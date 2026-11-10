/* Downhole — in-browser synthesised audio (no external files). MIT, part of Study Desk games. */
window.DHaudio = (() => {
  'use strict';
  let ctx = null, master = null, limiter = null, musicGain = null;
  let musicOn = true, started = false, musicTimer = null;
  let rumbleSrc = null, rumbleFilter = null, rumbleGain = null;
  let dripTimer = null, depth = 0;

  function ensure() {
    if (ctx) return true;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      ctx = new AC();
      /* Peak limiter on the master bus so no layered SFX can spike the output. */
      limiter = ctx.createDynamicsCompressor();
      limiter.threshold.value = -2;
      limiter.knee.value = 0;
      limiter.ratio.value = 20;
      limiter.attack.value = 0.002;
      limiter.release.value = 0.2;
      limiter.connect(ctx.destination);
      master = ctx.createGain();
      master.gain.value = 0.7;
      master.connect(limiter);
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

  /* --- SFX ----------------------------------------------------------------- */
  /* Two-stage dig: a low "thock" transient plus a grittier noise scrape, with a
     slight random detune per hit and an internally-chosen material variant so a
     run of digs never sounds identical. Signature stays sfx.dig(). */
  const DIG_MATS = [
    { f: 92,  grit: 700,  n: 0.42, t: 0.34 }, // packed rock
    { f: 118, grit: 1150, n: 0.48, t: 0.30 }, // loose gravel
    { f: 72,  grit: 480,  n: 0.52, t: 0.38 }, // damp clay
    { f: 150, grit: 1600, n: 0.38, t: 0.26 }  // ore seam
  ];
  function dig() {
    resume();
    const v = 1 + (Math.random() * 0.2 - 0.1); // ±10% pitch/level variance
    const m = DIG_MATS[(Math.random() * DIG_MATS.length) | 0];
    tone(m.f * v, 'triangle', 0.004, 0.07, m.t, m.f * 0.6);      // stage 1: thock
    noise(0.02, 0.18 * v, 3200);                                  // transient click
    setTimeout(() => noise(0.085, m.n, m.grit * v), 18);         // stage 2: grit scrape
  }
  function crack() { resume(); noise(0.16, 0.7, 2400); tone(160, 'square', 0.004, 0.1, 0.2, 70); }
  function pickup() { resume(); tone(520, 'sine', 0.008, 0.14, 0.3, 780); }
  function sell() { resume(); [440, 554, 659, 880].forEach((f, i) => setTimeout(() => tone(f, 'sine', 0.01, 0.3, 0.25), i * 70)); }
  function buy() { resume(); tone(330, 'triangle', 0.01, 0.18, 0.3, 495); }
  function hurt() { resume(); tone(140, 'sawtooth', 0.01, 0.25, 0.35, 60); }
  function jet() { resume(); noise(0.25, 0.25, 400); }
  function ach() { resume(); [523, 659, 784].forEach((f, i) => setTimeout(() => tone(f, 'sine', 0.01, 0.4, 0.28), i * 110)); }
  function ui() { resume(); tone(600, 'sine', 0.005, 0.06, 0.15); }
  /* New systems (safe to call): cave-in, mechanical zipline, contract complete. */
  function rumble() {
    resume();
    noise(1.6, 0.7, 180);
    tone(38, 'sine', 0.02, 1.5, 0.5, 24);
    setTimeout(() => noise(1.0, 0.4, 320), 240);
  }
  function winch() {
    resume();
    noise(0.6, 0.18, 1300); // motor whir
    for (let i = 0; i < 8; i++) {
      setTimeout(() => { tone(300 + Math.random() * 80, 'square', 0.002, 0.03, 0.11); noise(0.02, 0.14, 2600); }, i * 75);
    }
  }
  function goal() {
    resume();
    [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => tone(f, 'sine', 0.01, 0.5, 0.3), i * 120));
    setTimeout(() => tone(1319, 'sine', 0.01, 0.9, 0.2), 520); // bell tail
  }
  const sfx = { dig, crack, pickup, sell, buy, hurt, jet, ach, ui, rumble, winch, goal };

  /* --- Depth atmosphere ---------------------------------------------------- */
  /* A looping low rumble that swells with depth, plus sparse drips/echoes once
     the player is deep. setDepth() is a safe no-op without a live ctx, and no
     game code needs to call it for the rest of the audio to work. */
  function startAmbience() {
    if (!rumbleSrc) {
      const len = (ctx.sampleRate * 3) | 0, buf = ctx.createBuffer(1, len, ctx.sampleRate), ch = buf.getChannelData(0);
      let last = 0;
      for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; last = (last + 0.02 * w) / 1.02; ch[i] = last * 3.5; }
      rumbleSrc = ctx.createBufferSource(); rumbleSrc.buffer = buf; rumbleSrc.loop = true;
      rumbleFilter = ctx.createBiquadFilter(); rumbleFilter.type = 'lowpass'; rumbleFilter.frequency.value = 100;
      rumbleGain = ctx.createGain(); rumbleGain.gain.value = 0.0001;
      rumbleSrc.connect(rumbleFilter); rumbleFilter.connect(rumbleGain); rumbleGain.connect(master);
      rumbleSrc.start();
    }
    if (depth > 10 && !dripTimer) {
      dripTimer = setInterval(() => { if (ctx.state === 'running' && Math.random() < 0.7) drip(); }, 2800);
    } else if (depth <= 10 && dripTimer) {
      clearInterval(dripTimer); dripTimer = null;
    }
  }
  function drip() {
    if (!ensure() || ctx.state !== 'running') return;
    const f = 900 + Math.random() * 900;
    tone(f, 'sine', 0.002, 0.12, 0.08, f * 0.8);
    setTimeout(() => tone(f * 0.98, 'sine', 0.002, 0.18, 0.035), 180);  // echo 1
    setTimeout(() => tone(f * 0.96, 'sine', 0.002, 0.26, 0.016), 430);  // echo 2
  }
  function setDepth(d) {
    depth = Math.max(0, +d || 0);
    if (!ensure()) return;
    startAmbience();
    const now = ctx.currentTime, norm = Math.min(1, depth / 120);
    try {
      rumbleGain.gain.cancelScheduledValues(now);
      rumbleGain.gain.setTargetAtTime(0.015 + 0.33 * norm, now, 1.2);
      rumbleFilter.frequency.setTargetAtTime(90 + 130 * norm, now, 1.2);
    } catch (e) {}
  }

  /* --- Ambient music ------------------------------------------------------- */
  /* Slow detuned pad; 3 rotating chord shapes, a low root that drifts, and an
     occasional soft bell note. One bar every ~14s, kept deliberately subtle. */
  const scale = [196, 220, 262, 294, 330];
  const CHORDS = [
    [1, 1.5, 2.02],   // open fifth + octave
    [1, 1.2, 1.5],    // minor
    [1, 1.26, 1.5]    // minor, wider third
  ];
  let chordIdx = 0;
  function musicBar() {
    if (!musicOn || !ensure() || ctx.state !== 'running') return;
    const t = ctx.currentTime;
    const pat = CHORDS[chordIdx % CHORDS.length]; chordIdx++;
    const root = scale[(Math.random() * scale.length) | 0] / 2;
    pat.forEach((m, i) => {
      const o = ctx.createOscillator(); o.type = i === 2 ? 'sine' : 'triangle';
      o.frequency.value = root * m;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.5 / (i + 1), t + 3);
      g.gain.linearRampToValueAtTime(0.0001, t + 13);
      o.connect(g); g.connect(musicGain);
      o.start(t); o.stop(t + 13.2);
    });
    if (Math.random() < 0.45) {
      const bf = scale[(Math.random() * scale.length) | 0] * 2;
      setTimeout(() => tone(bf, 'sine', 0.01, 1.6, 0.12), 1200 + Math.random() * 3000);
    }
  }
  function startMusic() {
    if (started || !ensure()) return;
    started = true;
    musicBar();
    musicTimer = setInterval(() => { if (musicOn) musicBar(); }, 7000);
  }

  return {
    sfx, startMusic, resume, setDepth,
    setVolume(v) { if (ensure()) master.gain.value = v; },
    setMusic(on) { musicOn = !!on; if (musicGain) musicGain.gain.value = on ? 0.16 : 0.0001; if (on) musicBar(); }
  };
})();
