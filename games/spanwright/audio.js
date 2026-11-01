'use strict';
/* Original synthesised audio for Spanwright. No sampled music or effects. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SpanAudio = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  function createAudio() {
    let ctx = null;
    let master = null;
    let musicGain = null;
    let sfxGain = null;
    let timer = 0;
    let step = 0;
    let playing = false;
    const volumes = { master: 0.8, music: 0.48, sfx: 0.85 };

    function ensure() {
      if (ctx) return true;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      ctx = new AC();
      master = ctx.createGain();
      musicGain = ctx.createGain();
      sfxGain = ctx.createGain();
      musicGain.connect(master);
      sfxGain.connect(master);
      master.connect(ctx.destination);
      applyVolumes();
      return true;
    }

    function applyVolumes() {
      if (!master) return;
      master.gain.value = volumes.master;
      musicGain.gain.value = volumes.music;
      sfxGain.gain.value = volumes.sfx;
    }

    function setVolumes(next) {
      if (typeof next.master === 'number') volumes.master = next.master;
      if (typeof next.music === 'number') volumes.music = next.music;
      if (typeof next.sfx === 'number') volumes.sfx = next.sfx;
      applyVolumes();
    }

    function envGain(t, a, d, peak) {
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(Math.max(0.001, peak), t + a);
      g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
      return g;
    }

    function tone(freq, dur, type, peak, dest, delay) {
      if (!ctx) return;
      const t = ctx.currentTime + (delay || 0);
      const o = ctx.createOscillator();
      o.type = type || 'sine';
      o.frequency.setValueAtTime(freq, t);
      const g = envGain(t, 0.012, dur, peak);
      o.connect(g);
      g.connect(dest || sfxGain);
      o.start(t);
      o.stop(t + dur + 0.05);
    }

    function noise(dur, peak, freq, q) {
      if (!ctx) return;
      const t = ctx.currentTime;
      const n = Math.floor(ctx.sampleRate * dur);
      const buffer = ctx.createBuffer(1, n, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < n; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / n);
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = freq || 800;
      filter.Q.value = q || 0.7;
      const g = envGain(t, 0.005, dur, peak);
      src.connect(filter);
      filter.connect(g);
      g.connect(sfxGain);
      src.start(t);
    }

    const pattern = [0, 3, 7, 10, 7, 3, 5, 7, 0, 7, 12, 10, 7, 5, 3, 0];
    function musicTick() {
      if (!playing || !ctx) return;
      if (ctx.state === 'suspended') return;
      const root = 220;
      const semi = pattern[step % pattern.length];
      const freq = root * Math.pow(2, semi / 12);
      tone(freq, 0.42, 'triangle', step % 4 === 0 ? 0.045 : 0.028, musicGain, 0);
      if (step % 8 === 0) tone(root / 2, 0.7, 'sine', 0.03, musicGain, 0);
      step += 1;
    }

    function startMusic() {
      if (!ensure()) return;
      if (playing) return;
      playing = true;
      clearInterval(timer);
      timer = setInterval(musicTick, 520);
      musicTick();
    }

    function stopMusic() {
      playing = false;
      clearInterval(timer);
    }

    function resume() {
      if (ctx && ctx.state === 'suspended') ctx.resume().catch(function () {});
    }

    function play(name) {
      if (!ensure()) return;
      resume();
      if (name === 'place') { tone(540, 0.07, 'triangle', 0.06); noise(0.05, 0.04, 1200, 1); }
      else if (name === 'wood') { noise(0.08, 0.08, 420, 0.6); tone(180, 0.09, 'triangle', 0.05); }
      else if (name === 'steel') { tone(880, 0.09, 'square', 0.025); tone(1320, 0.07, 'sine', 0.03); }
      else if (name === 'rope') { noise(0.06, 0.05, 600, 2); }
      else if (name === 'delete') { tone(240, 0.08, 'sine', 0.04); }
      else if (name === 'ui') { tone(660, 0.04, 'sine', 0.035); }
      else if (name === 'play') { tone(392, 0.08, 'triangle', 0.05); tone(523, 0.12, 'triangle', 0.05, sfxGain, 0.07); }
      else if (name === 'success') {
        [523, 659, 784, 1046].forEach(function (f, i) { tone(f, 0.22, 'triangle', 0.06, sfxGain, i * 0.08); });
      }
      else if (name === 'fail') { tone(196, 0.22, 'sine', 0.06); tone(155, 0.3, 'triangle', 0.05, sfxGain, 0.08); }
      else if (name === 'break') { noise(0.16, 0.12, 300, 0.5); tone(110, 0.18, 'sawtooth', 0.03); }
      else if (name === 'splash') { noise(0.2, 0.08, 500, 0.4); }
      else if (name === 'creak') { noise(0.1, 0.04, 240, 3); }
      else if (name === 'star') { tone(880, 0.1, 'sine', 0.04); }
      else if (name === 'hydraulic') { tone(160, 0.16, 'sawtooth', 0.02); noise(0.12, 0.03, 180, 1); }
    }

    return { setVolumes: setVolumes, startMusic: startMusic, stopMusic: stopMusic, play: play, resume: resume, ensure: ensure };
  }

  return { createAudio: createAudio };
});
