/* Creekhold — synthesized ambience and stings. No samples. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.CreekholdAudio = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  let ctx = null, master = null, music = null, enabled = true, volume = 0.7, mode = 'temperate';
  const NOTES = [294, 349, 392, 440, 523, 392, 349, 330];

  function ac() {
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return null;
    if (!ctx) {
      ctx = new C();
      master = ctx.createGain();
      master.gain.value = volume;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume().catch(function () {});
    return ctx;
  }

  function setEnabled(on) { enabled = !!on; if (!enabled) stopMusic(); }
  function setVolume(v) {
    volume = Math.max(0, Math.min(1, v));
    if (master) master.gain.value = volume;
  }

  function env(duration, peak) {
    const c = ac();
    if (!c || !enabled) return null;
    const g = c.createGain();
    g.connect(master || c.destination);
    const now = c.currentTime;
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak * volume), now + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    return { c: c, g: g, now: now };
  }

  function tone(freq, duration, type, peak) {
    const e = env(duration, peak);
    if (!e) return;
    const o = e.c.createOscillator();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, e.now);
    o.connect(e.g);
    o.start(e.now);
    o.stop(e.now + duration + 0.02);
  }

  function noise(duration, peak) {
    const e = env(duration, peak);
    if (!e) return;
    const n = Math.floor(e.c.sampleRate * duration);
    const buf = e.c.createBuffer(1, n, e.c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < n; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const src = e.c.createBufferSource();
    src.buffer = buf;
    const filter = e.c.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 900;
    src.connect(filter);
    filter.connect(e.g);
    src.start(e.now);
  }

  function play(kind) {
    if (!enabled) return;
    if (kind === 'place') tone(520, 0.08, 'triangle', 0.08);
    else if (kind === 'raised') { tone(180, 0.16, 'sine', 0.1); tone(90, 0.2, 'triangle', 0.06); }
    else if (kind === 'chop') noise(0.07, 0.08);
    else if (kind === 'drink') tone(660, 0.09, 'sine', 0.05);
    else if (kind === 'eat') tone(480, 0.08, 'triangle', 0.05);
    else if (kind === 'deny') tone(140, 0.12, 'square', 0.04);
    else if (kind === 'ui') tone(700, 0.05, 'sine', 0.04);
    else if (kind === 'born') { tone(523, 0.12, 'sine', 0.06); tone(659, 0.16, 'sine', 0.05); }
    else if (kind === 'died') tone(110, 0.4, 'sine', 0.07);
    else if (kind === 'gear') tone(880, 0.07, 'square', 0.04);
    else if (kind === 'achieve') { tone(523, 0.1, 'triangle', 0.06); tone(784, 0.18, 'sine', 0.05); }
    else if (kind === 'drought') noise(0.5, 0.05);
    else if (kind === 'sour') tone(98, 0.4, 'sawtooth', 0.03);
    else if (kind === 'clear') tone(392, 0.2, 'sine', 0.05);
  }

  function startMusic() {
    const c = ac();
    if (!c || !enabled || music) return;
    const g = c.createGain();
    g.gain.value = 0.035 * volume;
    g.connect(master);
    let step = 0;
    const timer = setInterval(function () {
      if (!enabled || !ctx) return;
      const f = NOTES[step % NOTES.length] * (mode === 'badtide' ? 0.5 : mode === 'drought' ? 0.85 : 1);
      const o = c.createOscillator();
      const eg = c.createGain();
      o.type = mode === 'badtide' ? 'triangle' : 'sine';
      o.frequency.value = f;
      eg.gain.setValueAtTime(0.0001, c.currentTime);
      eg.gain.exponentialRampToValueAtTime(0.04, c.currentTime + 0.05);
      eg.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.9);
      o.connect(eg);
      eg.connect(g);
      o.start();
      o.stop(c.currentTime + 1);
      step++;
    }, 720);
    music = { g: g, timer: timer };
  }

  function stopMusic() {
    if (!music) return;
    clearInterval(music.timer);
    try { music.g.disconnect(); } catch (err) { /* already gone */ }
    music = null;
  }

  function setMode(next) {
    if (next === mode) return;
    mode = next;
    if (mode === 'drought') play('drought');
    else if (mode === 'badtide') play('sour');
    else play('clear');
  }

  return { play: play, setEnabled: setEnabled, setVolume: setVolume, startMusic: startMusic, stopMusic: stopMusic, setMode: setMode, unlock: ac };
});
