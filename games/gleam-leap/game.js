/* Gleam Leap — game shell, rendering, audio and input. MIT License.
Copyright (c) 2026 Study Desk contributors
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the Software), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED AS IS, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
(() => {
  'use strict';
  const E = window.GleamEngine;
  const $ = (id) => document.getElementById(id);
  const KEY = 'gleam-leap-v1';
  const H = 500, VIEW_X = 0.28;
  const canvas = $('canvas'), ctx = canvas.getContext('2d');
  let W = 960;

  // ---- Save ---------------------------------------------------------------
  let profile = E.createProfile(), blocked = false;
  function loadProfile() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw !== null) {
        const p = E.decodeProfile(raw);
        if (p) profile = p;
        else { blocked = true; warn('Saved progress was unreadable, so it was left untouched. Play continues this session.'); }
      }
    } catch { blocked = true; warn('Storage is unavailable, so progress lasts only for this session.'); }
  }
  function saveProfile() {
    if (blocked) return;
    try { localStorage.setItem(KEY, E.encodeProfile(profile)); }
    catch { blocked = true; warn('Saving failed. Keep this tab open; progress is session-only.'); }
  }
  function warn(t) { const el = $('storage'); el.hidden = false; el.textContent = t; }

  // ---- Audio (WebAudio synth, original melody) ----------------------------
  let actx = null, master = null, noiseBuf = null, soundOn = profile.sound;
  let musicAnchor = 0, nextStep = 0, musicStarted = false;
  function ensureAudio() {
    if (actx) return true;
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return false;
    try { actx = new C(); } catch { return false; }
    master = actx.createGain();
    master.gain.value = soundOn ? 0.5 : 0;
    master.connect(actx.destination);
    const len = Math.floor(actx.sampleRate * 0.4);
    noiseBuf = actx.createBuffer(1, len, actx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return true;
  }
  function resumeAudio() { if (actx && actx.state === 'suspended') actx.resume().catch(() => {}); }
  function tone(t, freq, dur, type, gain) {
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.03);
  }
  function kick(t) {
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(48, t + 0.12);
    g.gain.setValueAtTime(0.9, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.2);
  }
  function hat(t) {
    const s = actx.createBufferSource(); s.buffer = noiseBuf;
    const f = actx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 7000;
    const g = actx.createGain(); g.gain.setValueAtTime(0.16, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    s.connect(f); f.connect(g); g.connect(master); s.start(t); s.stop(t + 0.06);
  }
  function snare(t) {
    const s = actx.createBufferSource(); s.buffer = noiseBuf;
    const f = actx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1800; f.Q.value = 0.8;
    const g = actx.createGain(); g.gain.setValueAtTime(0.32, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
    s.connect(f); f.connect(g); g.connect(master); s.start(t); s.stop(t + 0.16);
    tone(t, 190, 0.1, 'triangle', 0.1);
  }
  function playStep(k, t) {
    const lv = E.levels[run.level], mel = lv.melody;
    const beat = Math.floor(k / 2), eighth = k % 2;
    if (eighth === 0) { kick(t); const b = mel.bass[beat % mel.bass.length]; tone(t, 110 * Math.pow(2, b / 12), 0.24, 'triangle', 0.2); }
    else hat(t);
    const n = mel.lead[k % mel.lead.length];
    if (n !== null && n !== undefined) tone(t, 220 * Math.pow(2, n / 12), 0.15, 'square', 0.08);
    if (eighth === 0 && beat % 2 === 1) snare(t);
  }
  function scheduleMusic() {
    if (!actx || !soundOn || !run || run.mode !== 'run' || paused) return;
    if (!musicStarted) { musicAnchor = actx.currentTime - run.time; nextStep = Math.max(0, Math.floor(run.time / E.STEP)); musicStarted = true; }
    const until = actx.currentTime + E.LOOKAHEAD;
    let guard = 0;
    while (musicAnchor + nextStep * E.STEP < until && guard++ < 64) {
      const t = musicAnchor + nextStep * E.STEP;
      if (t >= actx.currentTime - 0.02) playStep(nextStep, Math.max(t, actx.currentTime));
      nextStep++;
    }
  }
  function deathSound() {
    if (!actx || !soundOn) return;
    const t = actx.currentTime, o = actx.createOscillator(), g = actx.createGain();
    o.type = 'sawtooth'; o.frequency.setValueAtTime(420, t); o.frequency.exponentialRampToValueAtTime(60, t + 0.4);
    g.gain.setValueAtTime(0.22, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.5);
  }
  function winSound() {
    if (!actx || !soundOn) return;
    const t = actx.currentTime;
    [0, 4, 7, 12, 16].forEach((n, i) => tone(t + i * 0.1, 220 * Math.pow(2, n / 12), 0.35, 'square', 0.14));
  }
  function jumpSound() { if (!actx || !soundOn) return; tone(actx.currentTime, 520, 0.07, 'square', 0.05); }

  // ---- Game state ---------------------------------------------------------
  let run = null, paused = false, view = 'menu';
  const input = { jump: false, jumpPressed: false };
  let camX = 0, shake = 0, pulse = 0, squash = 1, deathDelay = 0, wonDelay = 0;
  let particles = [], trail = [];
  let deathHandled = false, wonHandled = false, savedBest = 0;

  // Speedrun clock: milliseconds -> "12.34s" / "1:05.67" (— when unset).
  function fmtTime(ms) {
    if (ms === null || ms === undefined) return '—';
    const s = ms / 1000;
    const m = Math.floor(s / 60);
    const rem = s - m * 60;
    return (m > 0 ? m + ':' + rem.toFixed(2).padStart(5, '0') : rem.toFixed(2) + 's');
  }

  function setView(v) { view = v; $('menu').hidden = v !== 'menu'; $('play').hidden = v === 'menu'; }
  function toMenu() {
    paused = false; run = null; musicStarted = false;
    buildMenu(); setView('menu'); $('storage').hidden = true;
  }

  function buildMenu() {
    $('levelList').innerHTML = E.levels.map((lv, i) => {
      const best = profile.best[i], deaths = profile.deaths[i].length;
      return '<article class="card" style="--c:' + lv.color + ';--a:' + lv.accent + '">' +
        '<div class="card-head"><span class="card-num">' + (i + 1) + '</span><h3>' + lv.name + '</h3></div>' +
        '<p>' + lv.blurb + '</p>' +
        '<div class="card-stat"><span>Best <b>' + best + '%</b></span><span>Time <b>' + fmtTime(profile.bestTime[i]) + '</b></span><span>Deaths <b>' + deaths + '</b></span></div>' +
        '<div class="card-actions">' +
        '<button class="play" data-level="' + i + '">' + (best >= 100 ? 'Replay' : best > 0 ? 'Continue' : 'Play') + '</button>' +
        '<button class="practice' + (profile.practise[i] ? ' on' : '') + '" data-practice="' + i + '" aria-pressed="' + profile.practise[i] + '">Practise' + (profile.practise[i] ? ' ✓' : '') + '</button>' +
        '</div></article>';
    }).join('');
    $('soundBtn').textContent = 'Sound: ' + (soundOn ? 'on' : 'off');
    $('soundBtn').setAttribute('aria-pressed', String(soundOn));
  }

  function startLevel(i, practice) {
    run = E.fresh(i, practice === undefined ? profile.practise[i] : practice);
    paused = false; deathDelay = 0; wonDelay = 0; shake = 0; particles = []; trail = [];
    deathHandled = false; wonHandled = false; savedBest = profile.best[i]; musicStarted = false;
    setView('play'); updateHud(); syncOverlay();
    ensureAudio(); resumeAudio();
    canvas.focus({ preventScroll: true });
  }

  // ---- One fixed step -----------------------------------------------------
  function stepOnce(inp) {
    if (!run) return;
    const wasReady = run.mode === 'ready';
    const wasGround = run.ground;
    E.step(run, inp || {});
    if (wasReady && run.mode === 'run') { musicStarted = false; }
    if (run.jumped) { squash = 0.74; jumpSound(); }
    else if (!wasGround && run.ground) { squash = 1.16; spawnDust(run.x + E.SIZE / 2, run.y + E.SIZE); } // landing squash + dust
    if (run.mode === 'dead' && !deathHandled) onDeath();
    if (run.mode === 'won' && !wonHandled) onWin();
  }

  // A soft kick of dust where the square meets the ground — sells the landing.
  function spawnDust(cx, gy) {
    const acc = E.levels[run.level].accent;
    for (let i = 0; i < 9; i++) {
      const dir = Math.random() < 0.5 ? -1 : 1;
      particles.push({
        x: cx, y: gy - 2,
        vx: dir * (20 + Math.random() * 90), vy: -(10 + Math.random() * 70),
        life: 0.28 + Math.random() * 0.22, max: 0.5, c: Math.random() < 0.5 ? acc : '#cfe8e3'
      });
    }
  }

  function onDeath() {
    deathHandled = true; deathDelay = 0.7;
    shake = 14; deathSound();
    for (let i = 0; i < 34; i++) {
      const a = Math.random() * Math.PI * 2, sp = 60 + Math.random() * 240;
      particles.push({ x: run.x + 20, y: run.y + 20, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 60, life: 0.7 + Math.random() * 0.4, max: 1.1, c: Math.random() < 0.5 ? '#ffd166' : '#7ef0ff' });
    }
    // Record a death marker (unique-ish, capped).
    const arr = profile.deaths[run.level];
    if (arr.length < 120) arr.push(Math.round(run.x));
    saveProfile();
  }

  function onWin() {
    wonHandled = true; wonDelay = 0.4;
    winSound();
    profile.best[run.level] = 100;
    // Speedrun best: fastest clean-shell completion, ignored in practise mode.
    if (!run.practise) {
      const ms = Math.round(run.time * 1000), prev = profile.bestTime[run.level];
      if (prev === null || prev === undefined || ms < prev) profile.bestTime[run.level] = ms;
    }
    saveProfile();
    for (let i = 0; i < 40; i++) {
      const a = Math.random() * Math.PI * 2, sp = 40 + Math.random() * 200;
      particles.push({ x: run.x + 20, y: run.y + 20, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 120, life: 0.8 + Math.random() * 0.5, max: 1.3, c: ['#ffd166', '#7ef0ff', '#ff9a86'][i % 3] });
    }
  }

  // ---- HUD / overlay ------------------------------------------------------
  let hudPct = -1, hudLevel = -1, hudMarks = '', hudTime = '';
  function updateHud() {
    if (!run) return;
    const lv = E.levels[run.level], pct = E.progress(run);
    if (pct > profile.best[run.level]) profile.best[run.level] = pct;
    if (run.level !== hudLevel) {
      hudLevel = run.level;
      $('hudLevel').textContent = lv.name;
      document.documentElement.style.setProperty('--accent', lv.accent);
      document.documentElement.style.setProperty('--level', lv.color);
      hudMarks = '';
    }
    if (pct !== hudPct) { hudPct = pct; $('hudPct').textContent = pct + '%'; $('bar').style.width = pct + '%'; }
    const t = fmtTime(Math.round(run.time * 1000));
    if (t !== hudTime) { hudTime = t; $('hudTime').textContent = t; }
    const marks = profile.deaths[run.level].map((x) => '<i style="left:' + (x / lv.length * 100).toFixed(2) + '%"></i>').join('');
    if (marks !== hudMarks) { hudMarks = marks; $('marks').innerHTML = marks; }
  }

  function syncOverlay() {
    const ov = $('overlay');
    if (!run || view === 'menu') { ov.hidden = true; return; }
    if (paused) { ov.hidden = false; $('ovTitle').textContent = 'Paused'; $('ovText').textContent = 'Take a breath. The beat waits.'; $('ovBtn').hidden = true; return; }
    if (run.mode === 'ready') { ov.hidden = false; $('ovTitle').textContent = 'Ready'; $('ovText').textContent = 'Tap, click or press Space to leap. Hold to jump again the moment you land.'; $('ovBtn').hidden = false; $('ovBtn').textContent = 'Leap'; return; }
    if (run.mode === 'won') {
      ov.hidden = false; $('ovTitle').textContent = 'Gleam reached!';
      const lv = E.levels[run.level], bt = profile.bestTime[run.level];
      const timeTxt = run.practise ? '' : ' Time ' + fmtTime(Math.round(run.time * 1000)) + (bt !== null && bt !== undefined ? ' — best ' + fmtTime(bt) + '.' : '.');
      const next = run.level < E.levels.length - 1 ? 'The next run is waiting.' : 'Every run cleared. Now chase a faster time.';
      $('ovText').textContent = lv.name + ' cleared.' + timeTxt + ' Deaths this run: ' + run.deaths + '. ' + next;
      $('ovBtn').hidden = false;
      $('ovBtn').textContent = run.level < E.levels.length - 1 ? 'Next run' : 'Levels';
      return;
    }
    ov.hidden = true;
  }

  // ---- Rendering ----------------------------------------------------------
  function resize() {
    const cw = Math.round(canvas.clientWidth || 960);
    W = Math.max(320, Math.min(960, cw));
    if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }
  }

  function render() {
    resize();
    ctx.clearRect(0, 0, W, H);
    const lv = run ? E.levels[run.level] : E.levels[0];
    camX = run ? Math.max(0, run.x - W * VIEW_X) : 0;
    const sx = shake > 0 ? (Math.random() - 0.5) * shake : 0;
    const sy = shake > 0 ? (Math.random() - 0.5) * shake : 0;
    ctx.save();
    ctx.translate(sx, sy);

    drawSky(lv);
    drawParallax(lv);
    drawGround(lv);
    drawDeathMarkers(lv);
    drawFinish(lv);
    drawObstacles(lv);
    if (run) drawPlayer();
    drawParticles();
    ctx.restore();
    drawVignette(lv);
  }

  function drawSky(lv) {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, lv.sky[0]); g.addColorStop(1, lv.sky[1]);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // Beat pulse glow behind the action.
    const glow = 0.12 + pulse * 0.5;
    const rg = ctx.createRadialGradient(W * 0.7, 150, 20, W * 0.7, 150, 420);
    rg.addColorStop(0, hexA(lv.accent, glow)); rg.addColorStop(1, hexA(lv.accent, 0));
    ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H);
  }

  function drawParallax(lv) {
    const layers = [
      { f: 0.18, c: lv.sky[1], h: 200, sp: 150, y: 420 },
      { f: 0.34, c: mix(lv.sky[1], '#000000', 0.35), h: 140, sp: 110, y: 430 },
      { f: 0.55, c: mix(lv.sky[1], '#000000', 0.6), h: 90, sp: 80, y: 440 }
    ];
    for (const L of layers) {
      ctx.fillStyle = L.c;
      const off = camX * L.f;
      const start = Math.floor(off / L.sp) - 1;
      for (let i = start; i < start + Math.ceil(W / L.sp) + 3; i++) {
        const x = i * L.sp - off;
        const h = L.h + ((i * 53) % 60 + 60) % 60;
        ctx.fillRect(x, L.y - h, L.sp - 26, h + 200);
      }
    }
  }

  function drawGround(lv) {
    ctx.fillStyle = mix(lv.sky[1], '#000000', 0.7);
    ctx.fillRect(0, E.GROUND_Y, W, H - E.GROUND_Y);
    // Beat pulse on the ground line: the bar breathes and throws a soft glow.
    const glow = 0.4 + pulse * 0.6;
    const rg = ctx.createLinearGradient(0, E.GROUND_Y - 30, 0, E.GROUND_Y);
    rg.addColorStop(0, hexA(lv.accent, 0)); rg.addColorStop(1, hexA(lv.accent, 0.16 * (0.4 + pulse)));
    ctx.fillStyle = rg; ctx.fillRect(0, E.GROUND_Y - 30, W, 30);
    ctx.fillStyle = hexA(lv.accent, glow);
    ctx.fillRect(0, E.GROUND_Y, W, 3 + pulse * 4);
    // Pits carve the ground away.
    for (const o of lv.obstacles) {
      if (o.t !== 'pit') continue;
      const x = o.x - camX;
      if (x > W || x + o.w < 0) continue;
      ctx.fillStyle = '#04070a'; ctx.fillRect(x, E.GROUND_Y, o.w, H - E.GROUND_Y);
      ctx.fillStyle = hexA(lv.accent, 0.35); ctx.fillRect(x, E.GROUND_Y, o.w, 3);
    }
  }

  function drawDeathMarkers(lv) {
    const arr = profile.deaths[run ? run.level : 0];
    const now = performance.now() / 1000;
    ctx.font = 'bold 16px system-ui'; ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(255,90,90,0.75)'; ctx.shadowBlur = 9;
    for (let k = 0; k < arr.length; k++) {
      const x = arr[k] - camX + 20;
      if (x < -20 || x > W + 20) continue;
      const phase = arr[k] * 0.013 + k * 0.7;
      const a = 0.32 + 0.24 * (0.5 + 0.5 * Math.sin(now * 1.6 + phase));
      const lift = 2.2 * Math.sin(now * 1.6 + phase);
      ctx.fillStyle = 'rgba(255,120,120,' + a.toFixed(3) + ')';
      ctx.fillText('✕', x, E.GROUND_Y - 14 + lift);
    }
    ctx.shadowBlur = 0;
  }

  function drawFinish(lv) {
    const x = lv.length - camX;
    if (x < -60 || x > W + 60) return;
    ctx.fillStyle = hexA(lv.accent, 0.85);
    ctx.fillRect(x, 150, 10, E.GROUND_Y - 150);
    ctx.fillRect(x - 24, 150, 10, E.GROUND_Y - 150);
    ctx.fillStyle = hexA(lv.accent, 0.18 + pulse * 0.3);
    ctx.fillRect(x - 34, 140, 54, E.GROUND_Y - 140);
    ctx.font = 'bold 13px system-ui'; ctx.textAlign = 'center';
    ctx.fillStyle = '#fff'; ctx.fillText('GLEAM', x - 5, 132);
  }

  function drawObstacles(lv) {
    for (const o of lv.obstacles) {
      if (o.t === 'spike') {
        const base = o.base || E.GROUND_Y, x = o.x - camX;
        if (x > W || x + E.SIZE < 0) continue;
        ctx.beginPath();
        ctx.moveTo(x, base); ctx.lineTo(x + E.SIZE / 2, base - E.SPIKE_H); ctx.lineTo(x + E.SIZE, base); ctx.closePath();
        ctx.fillStyle = '#0a0f14'; ctx.fill();
        ctx.strokeStyle = hexA(lv.accent, 0.9); ctx.lineWidth = 2; ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + E.SIZE / 2, base - E.SPIKE_H); ctx.lineTo(x + E.SIZE / 2, base);
        ctx.strokeStyle = hexA(lv.accent, 0.35); ctx.lineWidth = 1; ctx.stroke();
      } else if (o.t === 'block') {
        const x = o.x - camX;
        if (x > W || x + o.w < 0) continue;
        ctx.fillStyle = '#0d141b'; ctx.fillRect(x, o.y, o.w, o.h);
        ctx.strokeStyle = hexA(lv.accent, 0.85); ctx.lineWidth = 2; ctx.strokeRect(x + 1, o.y + 1, o.w - 2, o.h - 2);
        ctx.fillStyle = hexA(lv.accent, 0.55); ctx.fillRect(x, o.y, o.w, 4);
      }
    }
  }

  function drawPlayer() {
    const px = run.x - camX, py = run.y;
    // trail
    ctx.fillStyle = hexA(E.levels[run.level].accent, 0.18);
    for (let i = 0; i < trail.length; i++) {
      const a = i / trail.length * 0.4;
      ctx.globalAlpha = a;
      ctx.fillRect(trail[i] - camX + 20, run.y + 20, 10, 10);
    }
    ctx.globalAlpha = 1;
    if (run.mode === 'dead') return;
    const sq = squash, st = 1 / squash;
    const w = E.SIZE * sq, h = E.SIZE * st;
    const cx = px + E.SIZE / 2, cy = py + E.SIZE / 2;
    ctx.save();
    ctx.translate(cx, cy);
    const glow = ctx.createRadialGradient(0, 0, 4, 0, 0, 46);
    glow.addColorStop(0, hexA(E.levels[run.level].accent, 0.9));
    glow.addColorStop(1, hexA(E.levels[run.level].accent, 0));
    ctx.fillStyle = glow; ctx.fillRect(-46, -46, 92, 92);
    ctx.fillStyle = '#eafffb';
    ctx.fillRect(-w / 2, -h / 2, w, h);
    ctx.strokeStyle = E.levels[run.level].accent; ctx.lineWidth = 3;
    ctx.strokeRect(-w / 2 + 1, -h / 2 + 1, w - 2, h - 2);
    ctx.fillStyle = '#0b1e2a';
    ctx.fillRect(-w / 2 + 9, -h / 2 + 11, 5, 6);
    ctx.fillRect(w / 2 - 14, -h / 2 + 11, 5, 6);
    ctx.restore();
  }

  function drawParticles() {
    for (const p of particles) {
      ctx.globalAlpha = Math.max(0, p.life / p.max);
      ctx.fillStyle = p.c;
      ctx.fillRect(p.x - camX, p.y, 5, 5);
    }
    ctx.globalAlpha = 1;
  }

  function drawVignette(lv) {
    const g = ctx.createLinearGradient(0, 0, W, 0);
    g.addColorStop(0, 'rgba(0,0,0,0.35)'); g.addColorStop(0.12, 'rgba(0,0,0,0)');
    g.addColorStop(0.88, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.35)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }

  function hexA(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }
  function mix(a, b, t) {
    const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
    const r = Math.round((((pa >> 16) & 255) * (1 - t) + ((pb >> 16) & 255) * t));
    const g = Math.round((((pa >> 8) & 255) * (1 - t) + ((pb >> 8) & 255) * t));
    const bl = Math.round(((pa & 255) * (1 - t) + (pb & 255) * t));
    return 'rgb(' + r + ',' + g + ',' + bl + ')';
  }

  // ---- Main loop ----------------------------------------------------------
  let last = 0, acc = 0;
  function frame(now) {
    if (!last) last = now;
    let dt = Math.min(0.1, (now - last) / 1000); last = now;
    if (view === 'menu') { requestAnimationFrame(frame); return; }

    if (run && !paused) {
      if (run.mode === 'ready' || run.mode === 'run') {
        acc += dt;
        while (acc >= E.DT) {
          stepOnce({ jump: input.jump, jumpPressed: input.jumpPressed });
          input.jumpPressed = false;
          acc -= E.DT;
        }
        scheduleMusic();
        // juice
        pulse = Math.max(0, 1 - ((run.time % E.BEAT) / E.BEAT));
        const tgt = run.ground ? 1 : 0.96; // slight stretch in the air
        squash += (tgt - squash) * Math.min(1, dt * 12);
        trail.push(run.x); if (trail.length > 6) trail.shift();
      } else if (run.mode === 'dead') {
        deathDelay -= dt;
        if (deathDelay <= 0) { E.respawn(run); deathHandled = false; shake = 0; squash = 1; trail = []; musicStarted = false; }
      } else if (run.mode === 'won') {
        wonDelay -= dt;
      }
    }

    if (shake > 0) shake = Math.max(0, shake - dt * 40);
    for (const p of particles) { p.life -= dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 900 * dt; }
    particles = particles.filter((p) => p.life > 0);

    if (run) { updateHud(); syncOverlay(); }
    render();
    requestAnimationFrame(frame);
  }

  // ---- Input --------------------------------------------------------------
  function pressJump() {
    if (view !== 'play' || !run) return;
    if (paused) return;
    input.jump = true; input.jumpPressed = true;
    ensureAudio(); resumeAudio();
  }
  function releaseJump() { input.jump = false; }

  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey || /INPUT|TEXTAREA|SELECT/.test(e.target && e.target.tagName || '')) return;
    const k = e.key;
    if (k === 'Escape') { e.preventDefault(); if (view === 'play') togglePause(); return; }
    if (k === ' ' || k === 'ArrowUp' || k === 'w' || k === 'W') { e.preventDefault(); if (!e.repeat) pressJump(); else input.jump = true; return; }
    if ((k === 'r' || k === 'R') && view === 'play' && run && !paused) { e.preventDefault(); restart(); }
  });
  document.addEventListener('keyup', (e) => {
    const k = e.key;
    if (k === ' ' || k === 'ArrowUp' || k === 'w' || k === 'W') releaseJump();
  });

  canvas.addEventListener('pointerdown', (e) => { e.preventDefault(); canvas.setPointerCapture && canvas.setPointerCapture(e.pointerId); pressJump(); });
  canvas.addEventListener('pointerup', releaseJump);
  canvas.addEventListener('pointercancel', releaseJump);
  $('jumpBtn').addEventListener('pointerdown', (e) => { e.preventDefault(); pressJump(); });
  $('jumpBtn').addEventListener('pointerup', releaseJump);
  $('jumpBtn').addEventListener('pointercancel', releaseJump);

  // ---- Controls -----------------------------------------------------------
  function togglePause() {
    if (!run || run.mode === 'dead' || run.mode === 'won') return;
    paused = !paused; musicStarted = false; input.jump = false;
    $('pauseBtn').textContent = paused ? 'Resume' : 'Pause';
    if (paused) { updateHud(); saveProfile(); }
    syncOverlay();
    if (!paused) { ensureAudio(); resumeAudio(); canvas.focus({ preventScroll: true }); }
  }
  function restart() {
    if (!run) return;
    run = E.fresh(run.level, run.practise);
    deathHandled = false; wonHandled = false; paused = false; deathDelay = 0; wonDelay = 0;
    shake = 0; particles = []; trail = []; squash = 1; musicStarted = false;
    $('pauseBtn').textContent = 'Pause';
    canvas.focus({ preventScroll: true });
  }

  $('levelList').addEventListener('click', (e) => {
    const p = e.target.closest('[data-level]');
    if (p) { startLevel(Number(p.dataset.level)); return; }
    const t = e.target.closest('[data-practice]');
    if (t) {
      const i = Number(t.dataset.practice);
      profile.practise[i] = !profile.practise[i];
      saveProfile(); buildMenu();
    }
  });
  $('pauseBtn').onclick = togglePause;
  $('restartBtn').onclick = restart;
  $('menuBtn').onclick = () => { saveProfile(); toMenu(); };
  $('soundBtn').onclick = () => {
    soundOn = !soundOn; profile.sound = soundOn; saveProfile();
    if (master) master.gain.value = soundOn ? 0.5 : 0;
    ensureAudio(); resumeAudio();
    $('soundBtn').textContent = 'Sound: ' + (soundOn ? 'on' : 'off');
    $('soundBtn').setAttribute('aria-pressed', String(soundOn));
  };
  $('ovBtn').onclick = () => {
    if (!run) return;
    if (run.mode === 'ready') { input.jump = true; input.jumpPressed = true; }
    else if (run.mode === 'won') {
      if (run.level < E.levels.length - 1) startLevel(run.level + 1);
      else toMenu();
    }
  };
  window.addEventListener('blur', () => { if (view === 'play' && !paused) togglePause(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden && view === 'play' && !paused) togglePause(); });
  window.addEventListener('pagehide', () => { if (run) { updateHud(); saveProfile(); } });
  window.addEventListener('message', (e) => {
    if (e.source !== window.parent || e.source === window || e.origin !== location.origin) return;
    if (e.data && e.data.type === 'study-visibility' && !e.data.visible && view === 'play' && !paused) togglePause();
  });

  // ---- Debug hooks for the lead / headless verification -------------------
  window.GLEAP = {
    engine: E,
    version: 1,
    start(i, practice) { startLevel(Number(i) || 0, practice); },
    reset() { toMenu(); },
    pause() { if (!paused) togglePause(); },
    frame(n, inp) { for (let k = 0; k < (n || 1); k++) stepOnce(inp || { jump: false }); render(); return this.state(); },
    simulate(seconds, autopilot) {
      const n = Math.round((seconds || 1) / E.DT);
      for (let k = 0; k < n; k++) {
        if (!run) break;
        if (run.mode === 'ready') {
          stepOnce({ jump: true, jumpPressed: true }); // start the run
        } else if (run.mode === 'run') {
          stepOnce(autopilot === false ? { jump: false } : E.autopilotInput(run));
        } else if (run.mode === 'dead') {
          deathDelay = 0; E.respawn(run); deathHandled = false; shake = 0; squash = 1; trail = []; musicStarted = false;
        }
      }
      render();
      return this.state();
    },
    autopilotAll() {
      return E.levels.map((lv, i) => {
        const s = E.fresh(i, false); let g = 0;
        while ((s.mode === 'run' || s.mode === 'ready') && g++ < 40000) E.step(s, E.autopilotInput(s));
        return { level: i, name: lv.name, mode: s.mode, pct: E.progress(s), deaths: s.deaths };
      });
    },
    state() {
      return run ? { level: run.level, mode: run.mode, x: Math.round(run.x), y: Math.round(run.y), pct: E.progress(run), ground: run.ground, deaths: run.deaths, practise: run.practise, paused: paused } : { mode: 'menu', view: view };
    },
    profile() { return JSON.parse(JSON.stringify(profile)); }
  };

  // ---- Boot ---------------------------------------------------------------
  // Headless diagnostics: surface any runtime error into the DOM so a
  // --dump-dom run can prove the page is clean.
  window.addEventListener('error', (e) => {
    const d = $('debug'); d.hidden = false;
    d.textContent += ' PAGE_ERROR ' + (e.message || e.error) + ' @' + (e.filename || '') + ':' + (e.lineno || '');
  });
  window.addEventListener('unhandledrejection', (e) => {
    const d = $('debug'); d.hidden = false;
    d.textContent += ' PAGE_REJECTION ' + (e.reason && e.reason.message || e.reason);
  });

  loadProfile();
  soundOn = profile.sound;
  buildMenu();
  setView('menu');
  resize();
  requestAnimationFrame(frame);

  if (/selftest/.test(location.search)) {
    const res = window.GLEAP.autopilotAll();
    const el = $('debug');
    el.hidden = false;
    el.textContent = 'GLEAP_SELFTEST ' + JSON.stringify(res);
    window.__GLEAP_READY = true;
  }

  if (/drive/.test(location.search)) {
    // Drive the real game shell end to end, then report the resulting state.
    window.GLEAP.start(0, false);
    const started = window.GLEAP.state();
    // No input: the square runs into the first spike, dies and auto-respawns.
    window.GLEAP.simulate(4, false);
    const afterCrash = window.GLEAP.state();
    // Practise mode: fall returns to a checkpoint rather than the start.
    window.GLEAP.start(0, true);
    window.GLEAP.simulate(25, true);
    const afterPractise = window.GLEAP.state();
    // Clean run on the real loop.
    window.GLEAP.start(0, false);
    const played = window.GLEAP.simulate(25, true);
    // New levels through the shipped shell + speedrun best-time recording.
    window.GLEAP.start(3, false);
    const neon = window.GLEAP.simulate(30, true);
    window.GLEAP.start(4, false);
    const sunset = window.GLEAP.simulate(35, true);
    const el = $('debug');
    el.hidden = false;
    el.textContent += ' GLEAP_DRIVE ' + JSON.stringify({ started: started, afterCrash: afterCrash, afterPractise: afterPractise, played: played, neon: neon, sunset: sunset }) +
      ' profile=' + JSON.stringify(window.GLEAP.profile());
    window.__GLEAP_DRIVEN = true;
  }
  const playMatch = location.search.match(/play=(\d+)/);
  if (playMatch) {
    const tMatch = location.search.match(/t=(\d+)/);
    window.GLEAP.start(Number(playMatch[1]) || 0, false);
    window.GLEAP.simulate(tMatch ? Number(tMatch[1]) : 5, true);
  }
})();
