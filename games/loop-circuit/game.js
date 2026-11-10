/* Loop Circuit — game shell: rendering, audio, input, UI and juice. MIT License.
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
  const E = window.LoopEngine;
  const $ = (id) => document.getElementById(id);
  const KEY = 'loop-circuit-v1';
  const H = 500, DT = E.DT;

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
        else { blocked = true; warn('Saved times were unreadable, so they were left untouched. Play continues this session.'); }
      }
    } catch { blocked = true; warn('Storage is unavailable, so times last only for this session.'); }
  }
  function saveProfile() {
    if (blocked) return;
    try { localStorage.setItem(KEY, E.encodeProfile(profile)); }
    catch { blocked = true; warn('Saving failed. Keep this tab open; times are session-only.'); }
  }
  function warn(t) { const el = $('storage'); el.hidden = false; el.textContent = t; }

  // ---- Audio (WebAudio synth, original) -----------------------------------
  let actx = null, master = null, noiseBuf = null, soundOn = profile.sound;
  let engineOsc = null, engineSub = null, engineGain = null, wheelGain = null, wheelSrc = null;
  function ensureAudio() {
    if (actx) return true;
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return false;
    try { actx = new C(); } catch { return false; }
    master = actx.createGain();
    master.gain.value = soundOn ? 0.5 : 0;
    master.connect(actx.destination);
    const len = Math.floor(actx.sampleRate * 0.5);
    noiseBuf = actx.createBuffer(1, len, actx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    // Continuous engine: sawtooth + sub, low-passed, gain follows throttle.
    engineGain = actx.createGain(); engineGain.gain.value = 0;
    const lp = actx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1400;
    engineOsc = actx.createOscillator(); engineOsc.type = 'sawtooth'; engineOsc.frequency.value = 60;
    engineSub = actx.createOscillator(); engineSub.type = 'square'; engineSub.frequency.value = 30;
    const subG = actx.createGain(); subG.gain.value = 0.5;
    engineOsc.connect(lp); engineSub.connect(subG); subG.connect(lp); lp.connect(engineGain); engineGain.connect(master);
    engineOsc.start(); engineSub.start();
    // Wheelspin hiss.
    wheelSrc = actx.createBufferSource(); wheelSrc.buffer = noiseBuf; wheelSrc.loop = true;
    const hp = actx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 3200;
    wheelGain = actx.createGain(); wheelGain.gain.value = 0;
    wheelSrc.connect(hp); hp.connect(wheelGain); wheelGain.connect(master); wheelSrc.start();
    return true;
  }
  function resumeAudio() { if (actx && actx.state === 'suspended') actx.resume().catch(() => {}); }
  function tone(t, freq, dur, type, gain, slide) {
    if (!actx || !soundOn) return;
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = type || 'square'; o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq * slide), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.03);
  }
  function noiseHit(t, dur, freq, gain, type) {
    if (!actx || !soundOn) return;
    const s = actx.createBufferSource(); s.buffer = noiseBuf;
    const f = actx.createBiquadFilter(); f.type = type || 'lowpass'; f.frequency.value = freq;
    const g = actx.createGain(); g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(master); s.start(t); s.stop(t + dur + 0.02);
  }
  function crashSound() { if (!actx || !soundOn) return; const t = actx.currentTime; noiseHit(t, 0.4, 900, 0.35); tone(t, 200, 0.4, 'sawtooth', 0.18, 0.25); }
  function winSound() { if (!actx || !soundOn) return; const t = actx.currentTime; [0, 4, 7, 12, 16, 19].forEach((n, i) => tone(t + i * 0.1, 261 * Math.pow(2, n / 12), 0.4, 'square', 0.13)); }
  function beep(hi) { if (!actx || !soundOn) return; tone(actx.currentTime, hi ? 880 : 440, hi ? 0.3 : 0.15, 'square', 0.16); }
  function wheeliePop() { if (!actx || !soundOn) return; tone(actx.currentTime, 520, 0.14, 'square', 0.1, 1.8); }

  // ---- Game state ---------------------------------------------------------
  let run = null, paused = false, view = 'menu';
  const input = { throttle: false, brake: false, leanL: false, leanR: false };
  let camX = 0, camY = 0, camScale = 1, shake = 0, timeScale = 1;
  let particles = [], dust = [], pops = [], countdownShown = 99, wheelieFired = false;
  let crashDelay = 0, wonHandled = false, crashHandled = false, savedBest = null, goFired = false;

  function setView(v) { view = v; $('menu').hidden = v !== 'menu'; $('play').hidden = v === 'menu'; }
  function toMenu() {
    paused = false; run = null; timeScale = 1;
    buildMenu(); setView('menu'); $('storage').hidden = true;
  }

  function fmt(t) {
    if (t == null) return '—';
    const m = Math.floor(t / 60), s = t - m * 60;
    return m + ':' + (s < 10 ? '0' : '') + s.toFixed(2);
  }
  const MEDAL = { gold: '🥇', silver: '🥈', bronze: '🥉' };

  function buildMenu() {
    $('trackList').innerHTML = E.tracks.map((t, i) => {
      const best = profile.best[i], med = E.medalFor(t, best);
      const times = t.medal.map((x) => fmt(x)).join(' · ');
      return '<article class="card" style="--c:' + t.accent + '">' +
        '<div class="card-head"><span class="card-num">' + (i + 1) + '</span><h3>' + t.name + '</h3>' +
        '<span class="card-diff" title="Difficulty">' + '◆'.repeat(t.diff) + '</span></div>' +
        '<p>' + t.blurb + '</p>' +
        '<div class="card-stat"><span>Best <b>' + fmt(best) + (med ? ' ' + MEDAL[med] : '') + '</b></span></div>' +
        '<div class="medals" aria-label="Medal times"><span class="m gold">' + MEDAL.gold + ' ' + fmt(t.medal[0]) + '</span>' +
        '<span class="m silver">' + MEDAL.silver + ' ' + fmt(t.medal[1]) + '</span>' +
        '<span class="m bronze">' + MEDAL.bronze + ' ' + fmt(t.medal[2]) + '</span></div>' +
        '<div class="card-actions"><button class="play" data-track="' + i + '">' + (best != null ? 'Race again' : 'Ride') + '</button></div>' +
        '</article>';
    }).join('');
    $('soundBtn').textContent = 'Sound: ' + (soundOn ? 'on' : 'off');
    $('soundBtn').setAttribute('aria-pressed', String(soundOn));
  }

  function startTrack(i) {
    run = E.fresh(i);
    paused = false; crashDelay = 0; wonHandled = false; crashHandled = false; goFired = false;
    shake = 0; timeScale = 1; particles = []; dust = []; pops = []; wheelieFired = false;
    countdownShown = 99; savedBest = profile.best[i];
    setView('play'); updateHud(); syncOverlay();
    ensureAudio(); resumeAudio();
    canvas.focus({ preventScroll: true });
  }

  // ---- One fixed step -----------------------------------------------------
  function leanValue() { return (input.leanR ? 1 : 0) + (input.leanL ? -1 : 0); }
  function stepOnce(inp) {
    if (!run) return;
    const wasMode = run.mode;
    E.step(run, inp || { throttle: input.throttle, brake: input.brake, lean: leanValue() }, DT);
    if (wasMode === 'countdown' && run.mode === 'run' && !goFired) { goFired = true; beep(true); }
    if (run.mode === 'dead' && !crashHandled) onCrash();
    if (run.mode === 'won' && !wonHandled) onWin();
  }

  function onCrash() {
    crashHandled = true; crashDelay = 0.62; timeScale = 0.22;
    shake = 16; crashSound();
    const rw = E.tracks[run.level];
    for (let i = 0; i < 26; i++) {
      const a = Math.random() * Math.PI * 2, sp = 60 + Math.random() * 220;
      particles.push({ x: run.px, y: run.py, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 90, life: 0.7 + Math.random() * 0.4, max: 1.1, c: Math.random() < 0.5 ? '#ffd166' : rw.accent });
    }
  }

  function onWin() {
    wonHandled = true;
    winSound();
    if (savedBest == null || run.time < savedBest) { profile.best[run.level] = run.time; savedBest = run.time; }
    profile.totalRuns = (profile.totalRuns || 0) + 1;
    saveProfile();
    for (let i = 0; i < 70; i++) {
      const a = Math.random() * Math.PI * 2, sp = 40 + Math.random() * 260;
      particles.push({ x: run.px, y: run.py, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 140, life: 0.9 + Math.random() * 0.6, max: 1.5, c: ['#ffd166', '#7ef0ff', '#ff9a86', '#b6f0a0'][i % 4] });
    }
  }

  function respawn() {
    E.respawn(run);
    crashHandled = false; crashDelay = 0; timeScale = 1; shake = 0; goFired = false; countdownShown = 99;
    particles = []; dust = []; pops = []; wheelieFired = false;
  }

  // ---- HUD / overlay ------------------------------------------------------
  let hudTime = '', hudSpeed = -1, hudLevel = -1;
  function updateHud() {
    if (!run) return;
    const t = E.tracks[run.level];
    if (run.level !== hudLevel) {
      hudLevel = run.level;
      $('hudLevel').textContent = t.name;
      document.documentElement.style.setProperty('--accent', t.accent);
    }
    const ts = fmt(run.mode === 'countdown' ? 0 : run.time);
    if (ts !== hudTime) { hudTime = ts; $('hudTime').textContent = ts; }
    const spd = Math.round(Math.abs(run.vx));
    if (spd !== hudSpeed) { hudSpeed = spd; $('hudSpeed').textContent = spd + ' km/h'; $('bar').style.width = E.progress(run) + '%'; }
  }

  function syncOverlay() {
    const ov = $('overlay');
    if (!run || view === 'menu') { ov.hidden = true; return; }
    if (paused) { ov.hidden = false; $('ovTitle').textContent = 'Paused'; $('ovText').textContent = 'Take a breath. The circuit waits.'; $('ovBtn').hidden = true; return; }
    if (run.mode === 'countdown') {
      ov.hidden = false;
      const n = Math.ceil(run.countdown);
      $('ovTitle').textContent = n >= 4 ? 'Ready' : String(Math.max(1, n));
      $('ovText').textContent = 'Throttle to go. Balance with lean. Brake to slow.';
      $('ovBtn').hidden = false; $('ovBtn').textContent = 'Drop in';
      return;
    }
    if (run.mode === 'won') {
      ov.hidden = false;
      const med = E.medalFor(E.tracks[run.level], run.time);
      $('ovTitle').textContent = 'Circuit cleared' + (med ? ' — ' + MEDAL[med] : '');
      $('ovText').textContent = E.tracks[run.level].name + ' in ' + fmt(run.time) + '. Best ' + fmt(profile.best[run.level]) + '.' +
        (run.level < E.tracks.length - 1 ? ' Next circuit is waiting.' : ' All four circuits done. Chase a clean line.');
      $('ovBtn').hidden = false;
      $('ovBtn').textContent = run.level < E.tracks.length - 1 ? 'Next circuit' : 'Circuits';
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

  function render() {
    resize();
    const t = run ? E.tracks[run.level] : E.tracks[0];
    // Camera: lead the bike with speed, zoom out a touch at pace.
    const speed = run ? Math.hypot(run.vx, run.vy) : 0;
    const tScale = 1 - E.clamp(speed / 1500, 0, 0.22);
    camScale += (tScale - camScale) * 0.06;
    const bpx = run ? run.px : t.start, bpy = run ? run.py : 470;
    const lead = run ? E.clamp(run.vx * 0.14, -180, 180) : 0;
    const wantX = bpx + lead - (W * 0.36) / camScale;
    const wantY = bpy - (H * 0.56) / camScale;
    camX += (wantX - camX) * 0.12; camY += (wantY - camY) * 0.09;

    const sx = shake > 0 ? (Math.random() - 0.5) * shake : 0;
    const sy = shake > 0 ? (Math.random() - 0.5) * shake : 0;

    // Sky (screen space).
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, t.sky[0]); g.addColorStop(1, t.sky[1]);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.translate(sx, sy);
    ctx.scale(camScale, camScale);
    ctx.translate(-camX, -camY);

    drawParallax(t);
    drawGround(t);
    drawFinish(t);
    drawParticles();
    if (run) drawBike();
    drawPops();
    ctx.restore();

    drawVignette();
    drawSpeedLines(t);
  }

  function drawParallax(t) {
    const layers = [
      { f: 0.16, c: mix(t.sky[1], '#000000', 0.12), h: 190, sp: 240, y: 470 },
      { f: 0.32, c: mix(t.sky[1], '#000000', 0.32), h: 130, sp: 170, y: 480 },
      { f: 0.5, c: mix(t.sky[1], '#000000', 0.52), h: 84, sp: 120, y: 490 }
    ];
    for (const L of layers) {
      ctx.fillStyle = L.c;
      const off = camX * L.f;
      const start = Math.floor(off / L.sp) - 1;
      const count = Math.ceil((W / camScale) / L.sp) + 3;
      for (let i = start; i < start + count; i++) {
        const x = i * L.sp - off;
        const h = L.h + ((i * 71) % 70 + 70) % 70;
        ctx.fillRect(x, L.y - h, L.sp - 34, h + 300);
      }
    }
  }

  function drawGround(t) {
    const P = t.points, bottom = 1400;
    // Chasms first (dark voids under the gaps).
    for (const gp of t.gaps) {
      const y0 = Math.min(E.terrainY(t, gp[0] - 1), E.terrainY(t, gp[1] + 1));
      const gy = isFinite(y0) ? y0 : 470;
      ctx.fillStyle = '#04070c';
      ctx.fillRect(gp[0] - 1, gy - 30, (gp[1] - gp[0]) + 2, bottom - gy + 30);
    }
    // Surface body.
    ctx.beginPath();
    ctx.moveTo(P[0][0], bottom);
    for (const p of P) ctx.lineTo(p[0], p[1]);
    ctx.lineTo(P[P.length - 1][0], bottom);
    ctx.closePath();
    ctx.fillStyle = t.ground;
    ctx.fill();
    // Top edge.
    ctx.beginPath();
    ctx.moveTo(P[0][0], P[0][1]);
    for (const p of P) ctx.lineTo(p[0], p[1]);
    ctx.strokeStyle = hexA(t.accent, 0.85); ctx.lineWidth = 3 / camScale; ctx.stroke();
    // Stripes.
    ctx.strokeStyle = hexA('#ffffff', 0.05); ctx.lineWidth = 1 / camScale;
    for (let x = Math.floor(camX / 60) * 60; x < camX + W / camScale + 60; x += 60) {
      const y = E.terrainY(t, x);
      if (!isFinite(y)) continue;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, bottom); ctx.stroke();
    }
  }

  function drawFinish(t) {
    const x = t.finish;
    if (x < camX - 80 || x > camX + W / camScale + 80) return;
    const gy = E.terrainY(t, x);
    if (!isFinite(gy)) return;
    ctx.fillStyle = '#e9eef2';
    ctx.fillRect(x, gy - 118, 6 / camScale, 118);
    // Checker flag.
    const cw = 12, ch = 12;
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
      ctx.fillStyle = ((r + c) % 2) ? '#12161c' : '#f4f7fa';
      ctx.fillRect(x + 6 + c * cw, gy - 118 + r * ch, cw, ch);
    }
    ctx.fillStyle = hexA(t.accent, 0.9);
    ctx.font = 'bold ' + Math.round(13 / camScale) + 'px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('FINISH', x + 30, gy - 126);
  }

  function drawBike() {
    const t = E.tracks[run.level];
    const rear = E.wheelPos(run, 0), front = E.wheelPos(run, 1);
    // Frame.
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#dfe7ec'; ctx.lineWidth = 5 / camScale;
    ctx.beginPath(); ctx.moveTo(rear.x, rear.y); ctx.lineTo(front.x, front.y); ctx.stroke();
    // Forks / seat bar up to the rider.
    const c = Math.cos(run.angle), s = Math.sin(run.angle);
    const up = { x: run.px + (-2 * c - (-16) * s), y: run.py + (-2 * s + (-16) * c) };
    ctx.strokeStyle = '#9fb4c0'; ctx.lineWidth = 3 / camScale;
    ctx.beginPath(); ctx.moveTo(front.x, front.y); ctx.lineTo(up.x + 10 * c, up.y + 10 * s); ctx.stroke();
    // Wheels.
    for (const w of [rear, front]) {
      ctx.beginPath(); ctx.arc(w.x, w.y, E.WHEEL_R, 0, Math.PI * 2);
      ctx.fillStyle = '#111820'; ctx.fill();
      ctx.strokeStyle = t.accent; ctx.lineWidth = 3 / camScale; ctx.stroke();
      ctx.beginPath(); ctx.arc(w.x, w.y, E.WHEEL_R * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = '#3a4a55'; ctx.fill();
    }
    // Rider (torso + head) as a rounded body leaning into the pitch.
    ctx.save();
    ctx.translate(run.px, run.py);
    ctx.rotate(run.angle);
    ctx.fillStyle = t.accent;
    ctx.beginPath();
    ctx.roundRect(-13, -18, 26, 15, 6);
    ctx.fill();
    ctx.beginPath(); ctx.arc(3, -22, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#f2f7fa'; ctx.fill();
    ctx.strokeStyle = t.accent; ctx.lineWidth = 2 / camScale; ctx.stroke();
    ctx.restore();
    // Wheelspin / dust behind the rear wheel.
    if (run.throttle && run.contactRear) {
      const bx = rear.x - Math.cos(run.angle) * 4, by = rear.y + 4;
      for (let i = 0; i < 2; i++) {
        const sp = 60 + Math.random() * 120;
        dust.push({ x: bx, y: by, vx: -sp - Math.abs(run.vx) * 0.15, vy: -20 - Math.random() * 60, life: 0.35 + Math.random() * 0.3, max: 0.65, r: 2 + Math.random() * 3 });
      }
    }
  }

  function drawParticles() {
    for (const p of particles) {
      ctx.globalAlpha = Math.max(0, p.life / p.max);
      ctx.fillStyle = p.c;
      ctx.fillRect(p.x - 3, p.y - 3, 6, 6);
    }
    ctx.globalAlpha = 1;
    for (const d of dust) {
      ctx.globalAlpha = Math.max(0, d.life / d.max) * 0.5;
      ctx.fillStyle = '#c9d4da';
      ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function drawPops() {
    ctx.textAlign = 'center';
    for (const p of pops) {
      ctx.globalAlpha = Math.max(0, p.life / p.max);
      ctx.fillStyle = '#ffd166';
      ctx.font = 'bold ' + Math.round(20 / camScale) + 'px system-ui';
      ctx.fillText(p.text, p.x, p.y);
    }
    ctx.globalAlpha = 1;
  }

  function drawVignette() {
    const g = ctx.createLinearGradient(0, 0, W, 0);
    g.addColorStop(0, 'rgba(0,0,0,0.32)'); g.addColorStop(0.14, 'rgba(0,0,0,0)');
    g.addColorStop(0.86, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.32)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }

  function drawSpeedLines(t) {
    if (!run || run.mode !== 'run') return;
    const sp = Math.abs(run.vx);
    if (sp < 380) return;
    const a = Math.min(0.4, (sp - 380) / 900);
    ctx.strokeStyle = hexA(t.accent, a * 0.5);
    ctx.lineWidth = 2;
    for (let i = 0; i < 7; i++) {
      const y = ((i * 73 + (run.time * 900) % 500) % H);
      const x = W - ((run.time * 1400 + i * 190) % (W + 200));
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 60, y); ctx.stroke();
    }
  }

  // ---- Main loop ----------------------------------------------------------
  let last = 0, acc = 0;
  function frame(now) {
    if (!last) last = now;
    let dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (view === 'menu') { requestAnimationFrame(frame); return; }

    const sdt = dt * timeScale;
    if (run && !paused) {
      if (run.mode === 'countdown' || run.mode === 'run') {
        acc += sdt;
        let guard = 0;
        while (acc >= DT && guard++ < 12) { stepOnce(); acc -= DT; }
        // Countdown beeps.
        if (run.mode === 'countdown') {
          const n = Math.ceil(run.countdown);
          if (n !== countdownShown) { countdownShown = n; if (n <= 3 && n >= 1) beep(false); }
        }
        // Wheelie popup.
        if (run.wheelie > 0.55 && !wheelieFired) { wheelieFired = true; pops.push({ x: run.px, y: run.py - 40, text: 'WHEELIE!', life: 1.1, max: 1.1 }); wheeliePop(); }
        if (run.wheelie === 0) wheelieFired = false;
      } else if (run.mode === 'dead') {
        crashDelay -= dt; // real time, not slowed
        if (crashDelay <= 0) respawn();
      }
    }

    if (shake > 0) shake = Math.max(0, shake - dt * 40);
    if (timeScale < 1) timeScale = Math.min(1, timeScale + dt * 1.6);

    // Particle physics (scaled so slow-mo reads well).
    for (const p of particles) { p.life -= dt; p.x += p.vx * sdt; p.y += p.vy * sdt; p.vy += 900 * sdt; }
    particles = particles.filter((p) => p.life > 0);
    for (const d of dust) { d.life -= dt; d.x += d.vx * sdt; d.y += d.vy * sdt; d.vy += 120 * sdt; }
    dust = dust.filter((d) => d.life > 0);
    for (const p of pops) { p.life -= dt; p.y -= 22 * sdt; }
    pops = pops.filter((p) => p.life > 0);

    updateEngineSound();
    if (run) { updateHud(); syncOverlay(); }
    render();
    requestAnimationFrame(frame);
  }

  function updateEngineSound() {
    if (!actx) return;
    const speed = run ? Math.hypot(run.vx, run.vy) : 0;
    const on = run && !paused && (run.mode === 'run' || run.mode === 'countdown') && soundOn;
    const freq = 55 + Math.min(320, speed * 0.42);
    if (engineOsc) engineOsc.frequency.setTargetAtTime(freq, actx.currentTime, 0.05);
    if (engineSub) engineSub.frequency.setTargetAtTime(freq * 0.5, actx.currentTime, 0.05);
    const g = on ? (0.05 + (run.throttle ? 0.09 : 0.03)) : 0;
    if (engineGain) engineGain.gain.setTargetAtTime(g, actx.currentTime, 0.06);
    const spin = on && run.throttle && run.contactRear && !run.contactFront ? 0.05 : 0;
    if (wheelGain) wheelGain.gain.setTargetAtTime(spin, actx.currentTime, 0.05);
  }

  // ---- Input --------------------------------------------------------------
  function pressThrottle() { input.throttle = true; ensureAudio(); resumeAudio(); }
  function releaseThrottle() { input.throttle = false; }

  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey || /INPUT|TEXTAREA|SELECT/.test(e.target && e.target.tagName || '')) return;
    const k = e.key;
    if (k === 'Escape') { e.preventDefault(); if (view === 'play') togglePause(); return; }
    if (k === ' ' || k === 'ArrowUp' || k === 'w' || k === 'W') { e.preventDefault(); pressThrottle(); return; }
    if (k === 'ArrowDown' || k === 's' || k === 'S') { e.preventDefault(); input.brake = true; return; }
    if (k === 'ArrowLeft' || k === 'a' || k === 'A') { e.preventDefault(); input.leanL = true; return; }
    if (k === 'ArrowRight' || k === 'd' || k === 'D') { e.preventDefault(); input.leanR = true; return; }
    if ((k === 'r' || k === 'R') && view === 'play' && run && !paused) { e.preventDefault(); respawn(); }
  });
  document.addEventListener('keyup', (e) => {
    const k = e.key;
    if (k === ' ' || k === 'ArrowUp' || k === 'w' || k === 'W') releaseThrottle();
    else if (k === 'ArrowDown' || k === 's' || k === 'S') input.brake = false;
    else if (k === 'ArrowLeft' || k === 'a' || k === 'A') input.leanL = false;
    else if (k === 'ArrowRight' || k === 'd' || k === 'D') input.leanR = false;
  });

  function hold(el, on, off) {
    el.addEventListener('pointerdown', (e) => { e.preventDefault(); el.setPointerCapture && el.setPointerCapture(e.pointerId); on(); });
    el.addEventListener('pointerup', off); el.addEventListener('pointercancel', off);
  }
  canvas.addEventListener('pointerdown', (e) => { e.preventDefault(); canvas.setPointerCapture && canvas.setPointerCapture(e.pointerId); pressThrottle(); });
  canvas.addEventListener('pointerup', releaseThrottle);
  canvas.addEventListener('pointercancel', releaseThrottle);
  hold($('throttleBtn'), pressThrottle, releaseThrottle);
  hold($('brakeBtn'), () => { input.brake = true; }, () => { input.brake = false; });
  hold($('leanLBtn'), () => { input.leanL = true; }, () => { input.leanL = false; });
  hold($('leanRBtn'), () => { input.leanR = true; }, () => { input.leanR = false; });

  // ---- Controls -----------------------------------------------------------
  function togglePause() {
    if (!run || run.mode === 'dead' || run.mode === 'won') return;
    paused = !paused; input.throttle = false; input.brake = false;
    $('pauseBtn').textContent = paused ? 'Resume' : 'Pause';
    if (paused) { updateHud(); saveProfile(); }
    syncOverlay();
    if (!paused) { ensureAudio(); resumeAudio(); canvas.focus({ preventScroll: true }); }
  }
  $('trackList').addEventListener('click', (e) => {
    const p = e.target.closest('[data-track]');
    if (p) startTrack(Number(p.dataset.track));
  });
  $('pauseBtn').onclick = togglePause;
  $('restartBtn').onclick = () => { if (run) respawn(); };
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
    if (run.mode === 'countdown') { run.countdown = Math.min(run.countdown, 0.001); }
    else if (run.mode === 'won') {
      if (run.level < E.tracks.length - 1) startTrack(run.level + 1);
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
  window.LOOP = {
    engine: E,
    version: 1,
    start(i) { startTrack(Number(i) || 0); },
    reset() { toMenu(); },
    pause() { if (!paused) togglePause(); },
    frame(n, inp) { for (let k = 0; k < (n || 1); k++) stepOnce(inp); render(); return this.state(); },
    step(n, inp) { for (let k = 0; k < (n || 1); k++) stepOnce(inp); return this.state(); },
    simulate(seconds, mode) {
      const n = Math.round((seconds || 1) / DT);
      for (let k = 0; k < n; k++) {
        if (!run) break;
        if (run.mode === 'countdown') { run.countdown = Math.min(run.countdown, 0.001); stepOnce({ throttle: 0, brake: 0, lean: 0 }); }
        else if (run.mode === 'run') {
          if (mode === false) stepOnce({ throttle: false, brake: false, lean: 0 });
          else if (mode === 'throttle') stepOnce({ throttle: true, brake: false, lean: 0 });
          else stepOnce(E.autopilotInput(run));
        }
        else if (run.mode === 'dead') respawn();
        else break;
      }
      render();
      return this.state();
    },
    autopilotAll() {
      return E.tracks.map((t, i) => {
        const s = E.fresh(i); let g = 0;
        while (s.mode !== 'won' && s.mode !== 'dead' && g++ < 60000) E.step(s, E.autopilotInput(s), DT);
        return { level: i, name: t.name, mode: s.mode, time: +s.time.toFixed(2), pct: E.progress(s), deaths: s.deaths };
      });
    },
    state() {
      if (!run) return { mode: 'menu', view: view };
      return { level: run.level, mode: run.mode, x: Math.round(run.px), y: Math.round(run.py), vx: Math.round(run.vx),
        time: +run.time.toFixed(2), pct: E.progress(run), wheelie: +run.wheelie.toFixed(2), air: +run.air.toFixed(2),
        rear: run.contactRear, front: run.contactFront, crash: run.crashCause, paused: paused, best: profile.best[run.level] };
    },
    profile() { return JSON.parse(JSON.stringify(profile)); }
  };

  // ---- Boot ---------------------------------------------------------------
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
    const res = window.LOOP.autopilotAll();
    const el = $('debug'); el.hidden = false;
    el.textContent = 'LOOP_SELFTEST ' + JSON.stringify(res);
    window.__LOOP_READY = true;
  }

  if (/drive/.test(location.search)) {
    window.LOOP.start(0);
    const started = window.LOOP.state();
    window.LOOP.simulate(3, false);           // no input -> bike holds on the line
    const afterIdle = window.LOOP.state();
    window.LOOP.start(0);
    const played = window.LOOP.simulate(40, true);  // autopilot to the flag
    // Crash path: full throttle, no balance, straight into the hardest line.
    window.LOOP.start(3);
    let crashed = null;
    for (let k = 0; k < 240 && !crashed; k++) { window.LOOP.step(10, { throttle: true, brake: false, lean: 0 }); const st = window.LOOP.state(); if (st.mode === 'dead') crashed = st; }
    const afterCrashRespawn = window.LOOP.simulate(5, false);
    const el = $('debug'); el.hidden = false;
    el.textContent += ' LOOP_DRIVE ' + JSON.stringify({ started: started, afterIdle: afterIdle, played: played, crashed: crashed, afterCrashRespawn: afterCrashRespawn }) +
      ' profile=' + JSON.stringify(window.LOOP.profile());
    window.__LOOP_DRIVEN = true;
  }
  const playMatch = location.search.match(/play=(\d+)/);
  if (playMatch) {
    const tMatch = location.search.match(/t=(\d+)/);
    window.LOOP.start(Number(playMatch[1]) || 0);
    window.LOOP.simulate(tMatch ? Number(tMatch[1]) : 5, true);
  }
})();
