/* Original synthesised audio for Lanewright. No sampled music or effects. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.LanewrightAudio = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const SCALE = [146.83, 174.61, 196, 220, 261.63, 293.66, 349.23, 392];

  function createAudio() {
    let ctx = null;
    let master = null;
    let musicGain = null;
    let sfxGain = null;
    let air = null;
    let pad = [];
    let step = 0;
    let acc = 0;
    let started = false;
    const volumes = { master: 0.85, music: 0.55, sfx: 0.8 };
    let muted = false;

    function ensure() {
      if (ctx) return true;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      ctx = new AC();
      master = ctx.createGain();
      musicGain = ctx.createGain();
      sfxGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1400;
      musicGain.connect(filter);
      filter.connect(master);
      sfxGain.connect(master);
      master.connect(ctx.destination);
      apply();
      return true;
    }

    function apply() {
      if (!master) return;
      const m = muted ? 0 : volumes.master;
      master.gain.value = m;
      musicGain.gain.value = volumes.music;
      sfxGain.gain.value = volumes.sfx;
    }

    function setVolumes(next) {
      if (typeof next.music === 'number') volumes.music = next.music;
      if (typeof next.sfx === 'number') volumes.sfx = next.sfx;
      if (typeof next.mute === 'boolean') muted = next.mute;
      apply();
    }

    function resume() {
      if (!ensure()) return;
      started = true;
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});
      if (!air) startAir();
    }

    function env(t, attack, dur, peak) {
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(Math.max(0.0008, peak), t + attack);
      g.gain.exponentialRampToValueAtTime(0.0001, t + attack + dur);
      return g;
    }

    function tone(freq, dur, type, peak, dest, delay, slide) {
      if (!ctx || muted) return;
      const t = ctx.currentTime + (delay || 0);
      const o = ctx.createOscillator();
      o.type = type || 'sine';
      o.frequency.setValueAtTime(freq, t);
      if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, slide), t + dur);
      const g = env(t, 0.02, dur, peak);
      o.connect(g);
      g.connect(dest || sfxGain);
      o.start(t);
      o.stop(t + dur + 0.05);
    }

    function startAir() {
      const n = Math.floor(ctx.sampleRate * 2);
      const buffer = ctx.createBuffer(1, n, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < n; i++) data[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 420;
      const g = ctx.createGain();
      g.gain.value = 0.015;
      src.connect(filter);
      filter.connect(g);
      g.connect(musicGain);
      src.start();
      air = src;
    }

    function pluck(index, peak) {
      const freq = SCALE[index % SCALE.length] * (index > 6 ? 2 : 1);
      tone(freq, 1.6, 'triangle', peak, musicGain);
      tone(freq * 2, 1.1, 'sine', peak * 0.25, musicGain, 0.01);
    }

    function tick(dt, week) {
      if (!started || !ctx || muted) return;
      acc += dt;
      const gap = Math.max(1.15, 2.4 - Math.min(6, week) * 0.12);
      if (acc < gap) return;
      acc = 0;
      step++;
      const root = step % SCALE.length;
      pluck(root, 0.035 + Math.min(6, week) * 0.004);
      if (step % 2 === 0) pluck((root + 2) % SCALE.length, 0.02);
      if (week >= 3 && step % 4 === 0) pluck((root + 4) % SCALE.length + 2, 0.018);
      if (step % 8 === 0) {
        const freq = SCALE[root % 5] / 2;
        tone(freq, 3.2, 'sine', 0.03, musicGain);
      }
    }

    function place() { if (ensure() && started) tone(520, 0.07, 'triangle', 0.05); }
    function erase() { if (ensure() && started) tone(280, 0.08, 'sine', 0.04, null, 0, 180); }
    function trip() {
      if (!ensure() || !started) return;
      tone(660, 0.12, 'sine', 0.06);
      tone(880, 0.16, 'sine', 0.04, null, 0.05);
    }
    function pop() { if (ensure() && started) tone(440, 0.1, 'triangle', 0.04, null, 0, 660); }
    function warn() { if (ensure() && started) tone(196, 0.09, 'sine', 0.035); }
    function over() {
      if (!ensure() || !started) return;
      tone(392, 0.4, 'sine', 0.06, null, 0, 262);
      tone(262, 0.7, 'triangle', 0.05, null, 0.18, 174);
    }
    function upgrade() {
      if (!ensure() || !started) return;
      tone(523, 0.2, 'sine', 0.05);
      tone(659, 0.24, 'sine', 0.045, null, 0.06);
      tone(784, 0.32, 'sine', 0.04, null, 0.12);
    }
    function ui() { if (ensure() && started) tone(740, 0.04, 'sine', 0.03); }

    return { resume: resume, setVolumes: setVolumes, tick: tick, place: place, erase: erase, trip: trip, pop: pop, warn: warn, over: over, upgrade: upgrade, ui: ui };
  }

  return { createAudio: createAudio };
});
