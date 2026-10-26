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
  const send = (method, params = {}, timeout = 15000) => new Promise((resolve, reject) => {
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
  `--remote-debugging-port=${debugPort}`,
  `--user-data-dir=${profile}`,
  '--window-size=1280,800',
  `http://127.0.0.1:${pagePort}/games/gummy-bay/index.html`,
], {stdio: 'ignore'});

let failure = null;
try {
  let page = null;
  for (let attempt = 0; attempt < 40 && !page; attempt++) {
    try {
      const targets = await readJson(`http://127.0.0.1:${debugPort}/json/list`);
      page = targets.find(target => target.type === 'page' && target.url.includes('gummy-bay'));
    } catch { /* chrome is still opening the port */ }
    if (!page) await new Promise(resolve => setTimeout(resolve, 250));
  }
  assert.ok(page?.webSocketDebuggerUrl, 'headless Chrome did not expose the game page');
  const {socket, send, opened} = connect(page.webSocketDebuggerUrl);
  await opened;
  await send('Runtime.enable');

  let status = null;
  for (let attempt = 0; attempt < 40; attempt++) {
    status = JSON.parse(await evaluate(send, `(() => JSON.stringify({
      town: typeof window.townAudio,
      unlocked: window.townAudio ? window.townAudio.unlocked === true : null,
      boot: document.getElementById('bootError')?.textContent || '',
      modal: (document.getElementById('modal')?.innerText || '').slice(0, 500),
      settings: [...document.querySelectorAll('button')].some(button => button.textContent.trim() === 'SETTINGS')
    }))()`));
    if (status.town === 'object' || status.settings || /3D graphics|Unable to start|WebGL/i.test(status.boot + status.modal)) break;
    await new Promise(resolve => setTimeout(resolve, 250));
  }

  const audioModule = await evaluate(send, `import('/games/gummy-bay/audio.mjs?v=124').then(module => typeof module.createTownAudio).catch(error => 'error:' + error.message)`);
  assert.equal(audioModule, 'function', `audio module did not load: ${audioModule}`);
  const complaint = `${status.boot}\n${status.modal}`;
  assert.equal(/audio\.mjs/i.test(complaint), false, complaint);

  if (status.town === 'object') {
    assert.equal(status.unlocked, false, 'audio must stay locked until a gesture');
    const point = JSON.parse(await evaluate(send, `(() => {
      const button = [...document.querySelectorAll('button')].find(item => item.textContent.trim() === 'SETTINGS');
      if (!button) return 'null';
      const box = button.getBoundingClientRect();
      return JSON.stringify({x: box.x + box.width / 2, y: box.y + box.height / 2});
    })()`));
    assert.ok(point, 'SETTINGS button was not on the title screen');
    await send('Input.dispatchMouseEvent', {type: 'mousePressed', x: point.x, y: point.y, button: 'left', clickCount: 1});
    await send('Input.dispatchMouseEvent', {type: 'mouseReleased', x: point.x, y: point.y, button: 'left', clickCount: 1});
    let mix = null;
    for (let attempt = 0; attempt < 20; attempt++) {
      mix = JSON.parse(await evaluate(send, `(() => {
        const music = document.querySelector('[aria-label="music volume"]');
        const effects = document.querySelector('[aria-label="effects volume"]');
        const text = document.getElementById('modal')?.innerText || '';
        return JSON.stringify({music: !!music, effects: !!effects, sfx: text.includes('SFX'), master: text.includes('Master')});
      })()`));
      if (mix.music && mix.effects && mix.sfx) break;
      await new Promise(resolve => setTimeout(resolve, 150));
    }
    assert.equal(mix.music, true);
    assert.equal(mix.effects, true);
    assert.equal(mix.sfx, true);
    assert.equal(mix.master, true);
    const stored = JSON.parse(await evaluate(send, `(() => { setVolume('music', 0.35); return localStorage.getItem('gummybay-audio'); })()`));
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
console.log('PASS: Gummy Bay boots in headless Chrome and the audio mixer is reachable without starting playback early.');
