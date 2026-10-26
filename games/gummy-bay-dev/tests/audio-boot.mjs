import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import fs from 'node:fs';
import http from 'node:http';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const chromeBin = '/usr/local/bin/google-chrome';

// v148: robust on a busy box. Everything runs against one overall deadline that fits the
// runner's 180 s cap; per-call timeouts scale with the machine's load, and every wait is
// readiness polling (a slow Runtime.evaluate is retried, not fatal) instead of fixed sleeps.
const started = Date.now();
const BUDGET_MS = Number(process.env.AUDIO_BOOT_BUDGET_MS) || 165000;
const deadline = started + BUDGET_MS;
const load = os.loadavg()[0] / Math.max(1, os.cpus().length);
const SLOW = Math.min(3, Math.max(1, 1 + load));
const remaining = () => Math.max(0, deadline - Date.now());
const callTimeout = () => Math.max(1000, Math.min(remaining(), 20000 * SLOW));
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const isTimeout = error => /timed out waiting for/.test(String(error?.message));
// Poll `probe` until `ready(value)`; probe timeouts are retried until the deadline.
async function poll(label, probe, ready, {every = 250, within = remaining()} = {}) {
  const until = Math.min(deadline, Date.now() + within);
  let last;
  let lastError = null;
  let wait = every;
  while (Date.now() < until) {
    try {
      last = await probe();
      lastError = null;
      if (ready(last)) return last;
    } catch (error) {
      if (!isTimeout(error) && !/Cannot find context|Execution context was destroyed|Inspected target navigated/.test(String(error?.message))) throw error;
      lastError = error;
    }
    await sleep(Math.min(wait, Math.max(0, until - Date.now())));
    wait = Math.min(1000, wait * 1.5);
  }
  throw new Error(`${label}: not ready after ${Math.round((Date.now() - started) / 1000)} s (load ${load.toFixed(2)})` + (lastError ? `; last error ${lastError.message}` : `; last ${JSON.stringify(last)}`));
}

function freePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const {port} = server.address();
      server.close(() => resolve(port));
    });
  });
}

function startServer() {
  const types = {'.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json', '.glb': 'model/gltf-binary', '.png': 'image/png'};
  const server = http.createServer((request, response) => {
    const url = new URL(request.url, 'http://127.0.0.1');
    const requested = decodeURIComponent(url.pathname);
    let file = path.normalize(path.join(root, requested));
    if (file !== root && !file.startsWith(root + path.sep)) {
      response.writeHead(403);
      response.end();
      return;
    }
    fs.stat(file, (error, stat) => {
      if (!error && stat.isDirectory()) file = path.join(file, 'index.html');
      fs.readFile(file, (readError, data) => {
        if (readError) {
          response.writeHead(404);
          response.end('missing');
          return;
        }
        response.writeHead(200, {'content-type': types[path.extname(file)] || 'application/octet-stream', 'cache-control': 'no-store'});
        response.end(data);
      });
    });
  });
  return new Promise(resolve => server.listen(0, '127.0.0.1', () => resolve(server)));
}

async function readJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.json();
}

function connect(wsUrl) {
  const socket = new WebSocket(wsUrl);
  let next = 0;
  const pending = new Map();
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data.toString());
    const resolve = pending.get(message.id);
    if (!resolve) return;
    pending.delete(message.id);
    resolve(message);
  });
  const send = (method, params = {}, timeout = callTimeout()) => new Promise((resolve, reject) => {
    const id = ++next;
    const timer = setTimeout(() => {
      pending.delete(id);
      reject(new Error(`timed out waiting for ${method}`));
    }, timeout);
    pending.set(id, message => {
      clearTimeout(timer);
      if (message.error) reject(new Error(message.error.message || method));
      else resolve(message.result || {});
    });
    socket.send(JSON.stringify({id, method, params}));
  });
  return {socket, send, opened: once(socket, 'open')};
}

async function evaluate(send, expression) {
  const result = await send('Runtime.evaluate', {expression, awaitPromise: true, returnByValue: true});
  if (result.exceptionDetails) {
    const text = result.exceptionDetails.exception?.description || result.exceptionDetails.text || 'page evaluation failed';
    throw new Error(text);
  }
  return result.result?.value;
}

const server = await startServer();
const pagePort = server.address().port;
const debugPort = await freePort();
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'gummy-audio-'));
const chrome = spawn(chromeBin, [
  '--headless=new',
  '--no-sandbox',
  '--disable-dev-shm-usage',
  '--use-gl=angle',
  '--use-angle=swiftshader',
  '--enable-unsafe-swiftshader',
  '--ignore-gpu-blocklist',
  '--disable-gpu-sandbox',
  '--disable-background-timer-throttling',
  '--disable-renderer-backgrounding',
  '--disable-backgrounding-occluded-windows',
  `--remote-debugging-port=${debugPort}`,
  `--user-data-dir=${profile}`,
  '--window-size=1280,800',
  `http://127.0.0.1:${pagePort}/games/gummy-bay/index.html`,
], {stdio: 'ignore'});

let failure = null;
try {
  const page = await poll('headless Chrome did not expose the game page', async () => {
    try {
      const targets = await readJson(`http://127.0.0.1:${debugPort}/json/list`);
      return targets.find(target => target.type === 'page' && target.url.includes('gummy-bay')) || null;
    } catch { return null; /* chrome is still opening the port */ }
  }, found => !!found?.webSocketDebuggerUrl, {within: 45000 * SLOW});
  const {socket, send, opened} = connect(page.webSocketDebuggerUrl);
  await opened;
  await send('Runtime.enable');

  const status = await poll('the game never finished booting', async () => JSON.parse(await evaluate(send, `(() => JSON.stringify({
      town: typeof window.townAudio,
      unlocked: window.townAudio ? window.townAudio.unlocked === true : null,
      boot: document.getElementById('bootError')?.textContent || '',
      modal: (document.getElementById('modal')?.innerText || '').slice(0, 500),
      settings: [...document.querySelectorAll('button')].some(button => button.textContent.trim() === 'SETTINGS')
    }))()`)), value => value.town === 'object' || value.settings || /3D graphics|Unable to start|WebGL/i.test(value.boot + value.modal));

  const audioModule = await poll('audio module import', () => evaluate(send, `import('/games/gummy-bay/audio.mjs?v=124').then(module => typeof module.createTownAudio).catch(error => 'error:' + error.message)`), value => typeof value === 'string');
  assert.equal(audioModule, 'function', `audio module did not load: ${audioModule}`);
  const complaint = `${status.boot}\n${status.modal}`;
  assert.equal(/audio\.mjs/i.test(complaint), false, complaint);

  if (status.town === 'object') {
    assert.equal(status.unlocked, false, 'audio must stay locked until a gesture');
    // v129: the cinematic loading card sits over the title until any key or tap.
    const card = await poll('loading card state', () => evaluate(send, `document.getElementById('cineLoad')?.classList.contains('loading') === true`), value => typeof value === 'boolean');
    if (card) {
      await send('Input.dispatchKeyEvent', {type: 'keyDown', key: ' ', code: 'Space', windowsVirtualKeyCode: 32});
      await send('Input.dispatchKeyEvent', {type: 'keyUp', key: ' ', code: 'Space', windowsVirtualKeyCode: 32});
      await poll('any key dismisses the loading card', () => evaluate(send, `document.getElementById('cineLoad')?.classList.contains('loading') === false && !document.body.classList.contains('cineLoading')`), gone => gone === true);
    }
    const point = await poll('SETTINGS button was not on the title screen', async () => JSON.parse(await evaluate(send, `(() => {
      const button = [...document.querySelectorAll('button')].find(item => item.textContent.trim() === 'SETTINGS');
      if (!button) return 'null';
      const box = button.getBoundingClientRect();
      return JSON.stringify({x: box.x + box.width / 2, y: box.y + box.height / 2});
    })()`)), value => !!value, {within: 30000 * SLOW});
    await send('Input.dispatchMouseEvent', {type: 'mousePressed', x: point.x, y: point.y, button: 'left', clickCount: 1});
    await send('Input.dispatchMouseEvent', {type: 'mouseReleased', x: point.x, y: point.y, button: 'left', clickCount: 1});
    const mix = await poll('the settings mixer never opened', async () => JSON.parse(await evaluate(send, `(() => {
        const music = document.querySelector('[aria-label="music volume"]');
        const effects = document.querySelector('[aria-label="effects volume"]');
        const text = document.getElementById('modal')?.innerText || '';
        return JSON.stringify({music: !!music, effects: !!effects, sfx: text.includes('SFX'), master: text.includes('Master')});
      })()`)), value => value.music && value.effects && value.sfx, {every: 150, within: 30000 * SLOW});
    assert.equal(mix.music, true);
    assert.equal(mix.effects, true);
    assert.equal(mix.sfx, true);
    assert.equal(mix.master, true);
    const stored = JSON.parse(await poll('volume write', () => evaluate(send, `(() => { setVolume('music', 0.35); return localStorage.getItem('gummybay-audio'); })()`), value => typeof value === 'string'));
    assert.equal(stored.music, 0.35);
    assert.equal(typeof stored.effects, 'number');
    assert.equal(typeof stored.master, 'number');
    assert.equal(typeof stored.ambience, 'number');
  } else {
    assert.match(complaint, /3D graphics|Unable to start|WebGL/i);
  }
  socket.close();
} catch (error) {
  failure = error;
} finally {
  chrome.kill('SIGKILL');
  await new Promise(resolve => {
    if (chrome.exitCode !== null || chrome.signalCode !== null) resolve();
    else {
      chrome.once('exit', resolve);
      setTimeout(resolve, 1000);
    }
  });
  await new Promise(resolve => server.close(resolve));
  try { fs.rmSync(profile, {recursive: true, force: true, maxRetries: 5, retryDelay: 40}); } catch { /* Chrome can still hold the profile after exit. */ }
}

if (failure) throw failure;
console.log(`PASS: Gummy Bay boots in headless Chrome and the audio mixer is reachable without starting playback early (${((Date.now() - started) / 1000).toFixed(1)} s, load ${load.toFixed(2)}).`);
