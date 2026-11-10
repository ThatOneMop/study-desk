/* Downhole — in-browser synthesised audio (no external files). MIT, part of Study Desk games. */
window.DHaudio = (() => {
  'use strict';
  let ctx = null, master = null, musicGain = null, musicOn = true, started = false, musicTimer = null;
  function ensure() {
    if (ctx) return true;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.7;
      master.connect(ctx.destination);
      musicGain = ctx.createGain();
      musicGain.gain.value = 0.16;
      musicGain.connect(master);
    } catch (e) { ctx = null; return false; }
    return true;
  }
  function resume() { if (ensure() && ctx.state === 'suspended') ctx.resume().catch(() => {}); }
  function env(node, t0, a, d, peak) {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(peak, t0 + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + a + d);
    node.connect(g); g.connect(master);
    return g;
  }
  function tone(freq, type, a, d, peak, glide) {
    if (!ensure()) return;
    const t = ctx.currentTime, o = ctx.createOscillator();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (glide) o.frequency.exponentialRampToValueAtTime(glide, t + a + d);
    env(o, t, a, d, peak);
    o.start(t); o.stop(t + a + d + 0.05);
  }
  function noise(dur, peak, filterHz) {
    if (!ensure()) return;
    const t = ctx.currentTime, len = Math.max(1, (dur * ctx.sampleRate) | 0);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate), ch = buf.getChannelData(0);
    for (let i = 0; i < len; i++) ch[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(); src.buffer = buf;
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = filterHz || 900;
    src.connect(f); env(f, t, 0.005, dur, peak);
    src.start(t); src.stop(t + dur + 0.05);
  }
  const sfx = {
    dig() { resume(); noise(0.09, 0.5, 700); tone(90, 'triangle', 0.005, 0.08, 0.35, 55); },
    crack() { resume(); noise(0.16, 0.7, 2400); tone(160, 'square', 0.004, 0.1, 0.2, 70); },
    pickup() { resume(); tone(520, 'sine', 0.008, 0.14, 0.3, 780); },
    sell() { resume(); [440, 554, 659, 880].forEach((f, i) => setTimeout(() => tone(f, 'sine', 0.01, 0.3, 0.25), i * 70)); },
    buy() { resume(); tone(330, 'triangle', 0.01, 0.18, 0.3, 495); },
    hurt() { resume(); tone(140, 'sawtooth', 0.01, 0.25, 0.35, 60); },
    jet() { resume(); noise(0.25, 0.25, 400); },
    ach() { resume(); [523, 659, 784].forEach((f, i) => setTimeout(() => tone(f, 'sine', 0.01, 0.4, 0.28), i * 110)); },
    ui() { resume(); tone(600, 'sine', 0.005, 0.06, 0.15); }
  };
  /* Ambient mine hum: slow detuned pad, one bar every ~14s. */
  const scale = [196, 220, 262, 294, 330];
  function musicBar() {
    if (!musicOn || !ensure() || ctx.state !== 'running') return;
    const t = ctx.currentTime;
    const root = scale[(Math.random() * scale.length) | 0] / 2;
    [1, 1.5, 2.02].forEach((m, i) => {
      const o = ctx.createOscillator(); o.type = i === 2 ? 'sine' : 'triangle';
      o.frequency.value = root * m;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.5 / (i + 1), t + 3);
      g.gain.linearRampToValueAtTime(0.0001, t + 13);
      o.connect(g); g.connect(musicGain);
      o.start(t); o.stop(t + 13.2);
    });
  }
  function startMusic() {
    if (started || !ensure()) return;
    started = true;
    musicBar();
    musicTimer = setInterval(() => { if (musicOn) musicBar(); }, 7000);
  }
  return {
    sfx, startMusic, resume,
    setVolume(v) { if (ensure()) master.gain.value = v; },
    setMusic(on) { musicOn = !!on; if (musicGain) musicGain.gain.value = on ? 0.16 : 0.0001; if (on) musicBar(); }
  };
})();