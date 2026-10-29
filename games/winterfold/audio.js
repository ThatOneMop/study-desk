/* Winterfold — small synthesized sounds. No samples. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.WinterfoldAudio = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  let ctx, enabled = true, wind = null;
  function ac() {
    if (!ctx) {
      const C = window.AudioContext || window.webkitAudioContext;
      if (!C) return null;
      ctx = new C();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function envGain(duration, peak) {
    const c = ac();
    if (!c || !enabled) return null;
    const g = c.createGain();
    g.connect(c.destination);
    const now = c.currentTime;
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(peak, now + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    return { c, g, now };
  }
  function tone(freq, duration, type, peak) {
    const e = envGain(duration, peak);
    if (!e) return;
    const o = e.c.createOscillator();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, e.now);
    o.connect(e.g);
    o.start(e.now);
    o.stop(e.now + duration + 0.02);
  }
  function noise(duration, peak, band) {
    const e = envGain(duration, peak);
    if (!e) return;
    const n = e.c.createBuffer(1, Math.floor(e.c.sampleRate * duration), e.c.sampleRate);
    const data = n.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const src = e.c.createBufferSource();
    src.buffer = n;
    const filter = e.c.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = band || 900;
    filter.Q.value = 0.7;
    src.connect(filter);
    filter.connect(e.g);
    src.start(e.now);
  }
  return {
    setEnabled(v) { enabled = !!v; if (!enabled && wind) { try { wind.stop(); } catch (e) {} wind = null; } },
    unlock() { ac(); },
    click() { tone(640, 0.07, 'triangle', 0.04); },
    draw() { noise(0.18, 0.03, 1400); tone(520, 0.12, 'sine', 0.03); },
    lift() { tone(220, 0.16, 'triangle', 0.05); tone(330, 0.2, 'sine', 0.03); },
    error() { tone(180, 0.12, 'square', 0.03); tone(140, 0.16, 'sine', 0.03); },
    dawn() { tone(523, 0.14, 'sine', 0.04); setTimeout(() => tone(659, 0.16, 'sine', 0.04), 90); setTimeout(() => tone(784, 0.22, 'triangle', 0.035), 180); },
    over() { tone(311, 0.2, 'sine', 0.04); setTimeout(() => tone(233, 0.28, 'triangle', 0.04), 120); },
    cut() { noise(0.08, 0.04, 400); },
    wind() {
      const c = ac();
      if (!c || !enabled || wind) return;
      const n = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
      const data = n.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      const src = c.createBufferSource();
      src.buffer = n;
      src.loop = true;
      const filter = c.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 420;
      const g = c.createGain();
      g.gain.value = 0.012;
      src.connect(filter);
      filter.connect(g);
      g.connect(c.destination);
      src.start();
      wind = src;
    }
  };
});
