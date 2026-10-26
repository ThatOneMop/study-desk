// Original Gummy Bay score and foley. Every buffer is synthesized here.
// No recorded music, voice, or sound-effect samples.
import {worldLighting} from './world-lighting.mjs';
import {VEHICLE_ROADS, PEDESTRIAN_WAYS} from './road-zones.mjs';

export const AUDIO_STORAGE_KEY = 'gummybay-audio';
export const AUDIO_LEVEL_KEYS = Object.freeze(['master', 'music', 'effects', 'ambience']);
export const DEFAULT_AUDIO_LEVELS = Object.freeze({master: 0.8, music: 0.55, effects: 0.8, ambience: 0.4});
export const MUSIC_BPM = 84;
export const MUSIC_DUCK = 10 ** (-6 / 20);
export const LOUDNESS_TARGET_DB = -18;

const DAY_PATTERN = Object.freeze({
  kicks: Object.freeze([0, 2.5, 4, 6.5]),
  snares: Object.freeze([1, 3, 5, 7]),
  hats: Object.freeze([0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5]),
  lowpass: 9000,
  crackle: 36,
});
const NIGHT_PATTERN = Object.freeze({
  kicks: Object.freeze([0, 4]),
  snares: Object.freeze([2, 6]),
  hats: Object.freeze([]),
  lowpass: 1400,
  crackle: 8,
});

export const AUDIO_EVENTS = Object.freeze([
  'footstep', 'door', 'pickup', 'trash', 'dumpster', 'skate-roll', 'skate-ollie',
  'sale', 'cash', 'xp', 'message', 'ui', 'notify',
  'soil', 'water', 'snip', 'gummy', 'wrapper', 'jar', 'mixer',
  'bark', 'warble', 'whistle', 'taser', 'radio', 'meter', 'siren', 'sting', 'thunder', 'rain', 'dialogue',
]);

export const FOOTSTEP_SURFACES = Object.freeze({
  asphalt: Object.freeze({cutoff: 2200, thud: 96, decay: 0.07, gain: 0.2}),
  concrete: Object.freeze({cutoff: 1400, thud: 78, decay: 0.09, gain: 0.17}),
  dirt: Object.freeze({cutoff: 480, thud: 54, decay: 0.13, gain: 0.18}),
  wood: Object.freeze({cutoff: 980, thud: 150, decay: 0.08, gain: 0.15}),
});

const MANUAL_ACTIONS = new Set(['prepare', 'plant', 'water', 'fill', 'harvest', 'make', 'pack', 'mix']);
const ACTION_CUES = Object.freeze({
  grabProp: 'pickup', dropProp: 'pickup', throwProp: 'pickup',
  pickup: 'trash', recycle: 'cash',
  deliver: 'sale',
  call: 'message', text: 'message', offer: 'message',
  rent: 'door', house: 'door', sleep: 'door',
});

function clamp01(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  return Math.min(1, Math.max(0, number));
}

function lcg(seed) {
  let state = (seed >>> 0) || 1;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function midi(note) {
  return 440 * 2 ** ((note - 69) / 12);
}

export function readAudioLevels(raw) {
  const levels = {...DEFAULT_AUDIO_LEVELS};
  let data = raw;
  if (typeof raw === 'string') {
    try { data = JSON.parse(raw); } catch { return levels; }
  }
  if (!data || typeof data !== 'object') return levels;
  for (const key of AUDIO_LEVEL_KEYS) {
    if (!Object.prototype.hasOwnProperty.call(data, key)) continue;
    const next = clamp01(data[key]);
    if (next !== null) levels[key] = next;
  }
  return levels;
}

export function writeAudioLevels(storage, levels) {
  const payload = {};
  for (const key of AUDIO_LEVEL_KEYS) payload[key] = levels[key];
  storage.setItem(AUDIO_STORAGE_KEY, JSON.stringify(payload));
}

function insideRect(rect, x, z) {
  return Math.abs(x - rect.x) <= rect.w / 2 && Math.abs(z - rect.z) <= rect.d / 2;
}

export function footstepSurface(x, z, floor = 0) {
  if (!Number.isFinite(x) || !Number.isFinite(z)) return 'dirt';
  if (Number.isFinite(floor) && floor > 0.2) return 'wood';
  if (VEHICLE_ROADS.some(rect => insideRect(rect, x, z))) return 'asphalt';
  if (PEDESTRIAN_WAYS.some(rect => insideRect(rect, x, z))) return 'concrete';
  return 'dirt';
}

export function ambienceMix(minutes, {indoors = false} = {}) {
  const clock = worldLighting(minutes, true);
  const night = clock.night;
  const day = 1 - night;
  const walls = indoors ? 0.32 : 1;
  return {
    minutes: clock.minutes,
    night,
    birds: day * walls,
    traffic: day * (indoors ? 0.18 : 1),
    wind: (0.4 + night * 0.28) * (indoors ? 0.48 : 1),
    crickets: night * walls,
    hum: night * (indoors ? 0.75 : 1),
  };
}

export function musicVariant(minutes) {
  return ambienceMix(minutes).night >= 0.5 ? 'night' : 'day';
}

export function musicPlan(kind) {
  const pattern = kind === 'night' ? NIGHT_PATTERN : DAY_PATTERN;
  return Object.freeze({
    bpm: MUSIC_BPM,
    beats: 8,
    lowpass: pattern.lowpass,
    kicks: pattern.kicks.length,
    snares: pattern.snares.length,
    hats: pattern.hats.length,
    crackle: pattern.crackle,
  });
}

// Body search is the detained state this build actually has. A later
// "under arrest" flag uses the same tension layer.
export function policeIsArrested(stage) {
  const key = String(stage ?? '').toLowerCase().replace(/[_-]+/g, ' ').trim();
  return key === 'search' || key === 'arrest' || key === 'under arrest' || key === 'busted';
}

export function cueForAction(name) {
  return ACTION_CUES[name] || null;
}

export function cueForGameplay(event) {
  if (!event || typeof event.type !== 'string') return null;
  if (event.type === 'craving-ask') return 'message';
  if (event.type === 'craving-changed') return 'sale';
  return null;
}

export function stationCue(kind, step = 0) {
  if (kind === 'prepare' || kind === 'plant') return 'soil';
  if (kind === 'water' || kind === 'fill') return 'water';
  if (kind === 'harvest') return 'snip';
  if (kind === 'make') return 'gummy';
  if (kind === 'pack') return 'wrapper';
  if (kind === 'mix') return step === 0 ? 'jar' : 'mixer';
  return null;
}

export function isManualAction(name) {
  return MANUAL_ACTIONS.has(name);
}

const MIXER_LABELS = {master: 'Master', music: 'Music', effects: 'SFX', ambience: 'Ambience'};

export function audioMixerHTML(levels) {
  const safe = readAudioLevels(levels);
  return '<h3>Audio mix</h3>' + AUDIO_LEVEL_KEYS.map(key => (
    '<label class="audio-mix" style="display:block;margin:12px 0">' + MIXER_LABELS[key] +
    ' <input aria-label="' + key + ' volume" type="range" min="0" max="1" step="0.05" value="' + safe[key] +
    '" oninput="setVolume(\'' + key + '\',Number(this.value))"></label>'
  )).join('') + '<p class="note">Original procedural audio. Music, SFX and ambience start after the first click or key. Levels stay in this browser, separate from your save.</p>';
}

export function replaceAudioMixer(html, levels) {
  const mixer = audioMixerHTML(levels);
  if (typeof html !== 'string' || !html) return mixer;
  const next = html.replace(/<h3>Audio mix<\/h3>(?:<label[\s\S]*?<\/label>)*/, mixer);
  if (next !== html) return next;
  if (html.includes('aria-label="music volume"')) return html;
  return html + mixer;
}

function beatSeconds(beat) {
  return beat * 60 / MUSIC_BPM;
}

function addEpiano(data, rate, time, duration, freq, gain) {
  const start = Math.max(0, Math.floor(time * rate));
  const count = Math.floor(duration * rate);
  for (let i = 0; i < count && start + i < data.length; i++) {
    const t = i / rate;
    const body = Math.exp(-t * 2.6);
    const tine = Math.exp(-t * 16);
    const phase = t * freq;
    data[start + i] += gain * (
      Math.sin(phase * Math.PI * 2) * body +
      Math.sin(phase * Math.PI * 4) * 0.28 * tine +
      Math.sin(phase * Math.PI * 14) * 0.05 * tine
    );
  }
}

function addSine(data, rate, time, duration, freq, gain, decay) {
  const start = Math.max(0, Math.floor(time * rate));
  const count = Math.floor(duration * rate);
  for (let i = 0; i < count && start + i < data.length; i++) {
    const t = i / rate;
    data[start + i] += Math.sin(t * freq * Math.PI * 2) * Math.exp(-t * decay) * gain;
  }
}

function addKick(data, rate, time, gain) {
  const start = Math.max(0, Math.floor(time * rate));
  const count = Math.floor(0.17 * rate);
  let phase = 0;
  for (let i = 0; i < count && start + i < data.length; i++) {
    const t = i / rate;
    phase += (44 + 130 * Math.exp(-t * 30)) / rate;
    data[start + i] += Math.sin(phase * Math.PI * 2) * Math.exp(-t * 14) * gain;
  }
}

function addNoiseHit(data, rate, time, duration, gain, rand, color) {
  const start = Math.max(0, Math.floor(time * rate));
  const count = Math.max(1, Math.floor(duration * rate));
  let previous = 0;
  let high = 0;
  for (let i = 0; i < count && start + i < data.length; i++) {
    const white = rand() * 2 - 1;
    previous = previous * 0.96 + white * 0.04;
    high = white - previous;
    const sample = color === 'hat' ? high : color === 'snare' ? white * 0.75 + Math.sin(i / rate * 190 * Math.PI * 2) * 0.2 : white;
    data[start + i] += sample * Math.exp(-(i / rate) * (color === 'hat' ? 70 : 18)) * gain;
  }
}

function lowpass(data, rate, frequency) {
  if (!(frequency > 0) || frequency > rate * 0.45) return;
  const alpha = 1 - Math.exp(-2 * Math.PI * frequency / rate);
  let y = 0;
  for (let i = 0; i < data.length; i++) {
    y += (data[i] - y) * alpha;
    data[i] = y;
  }
}

function fadeEdges(data, rate) {
  const fade = Math.min(data.length >> 1, Math.max(1, Math.floor(rate * 0.02)));
  for (let i = 0; i < fade; i++) {
    const gain = i / fade;
    data[i] *= gain;
    data[data.length - 1 - i] *= gain;
  }
}

export function loudnessDb(samples) {
  if (!samples?.length) return -Infinity;
  let sum = 0;
  for (let i = 0; i < samples.length; i++) sum += samples[i] * samples[i];
  const rms = Math.sqrt(sum / samples.length);
  return rms > 1e-8 ? 20 * Math.log10(rms) : -Infinity;
}

function masterToLoudness(data) {
  let peak = 0;
  for (let i = 0; i < data.length; i++) peak = Math.max(peak, Math.abs(data[i]));
  if (peak < 1e-6) return;
  for (let i = 0; i < data.length; i++) data[i] = Math.tanh((data[i] / peak) * 1.35);
  const target = 10 ** (LOUDNESS_TARGET_DB / 20);
  let sum = 0;
  for (let i = 0; i < data.length; i++) sum += data[i] * data[i];
  const rms = Math.sqrt(sum / data.length) || target;
  let scale = target / rms;
  peak = 0;
  for (let i = 0; i < data.length; i++) peak = Math.max(peak, Math.abs(data[i]));
  if (peak * scale > 0.92) scale = 0.92 / peak;
  for (let i = 0; i < data.length; i++) data[i] *= scale;
}

export function renderMusic(kind, sampleRate) {
  const rate = Math.max(1000, Math.floor(sampleRate) || 44100);
  const pattern = kind === 'night' ? NIGHT_PATTERN : DAY_PATTERN;
  const seconds = beatSeconds(8);
  const data = new Float32Array(Math.max(1, Math.floor(rate * seconds)));
  const rand = lcg(kind === 'night' ? 0x51a7 : 0x84b0);
  const chords = kind === 'night'
    ? [[62, 65, 69], [65, 68, 72], [60, 63, 67], [62, 65, 69]]
    : [[62, 66, 69], [67, 71, 74], [69, 73, 76], [62, 66, 69]];
  const bass = kind === 'night' ? [38, 41, 36, 38] : [38, 43, 45, 38];
  for (let bar = 0; bar < 4; bar++) {
    const at = beatSeconds(bar * 2);
    addSine(data, rate, at, beatSeconds(2) * 0.96, midi(bass[bar]), 0.34, 0.35);
    for (const note of chords[bar]) addEpiano(data, rate, at, beatSeconds(1.85), midi(note), 0.16);
  }
  for (const beat of pattern.kicks) addKick(data, rate, beatSeconds(beat), 0.62);
  for (const beat of pattern.snares) addNoiseHit(data, rate, beatSeconds(beat), 0.12, 0.28, rand, 'snare');
  for (const beat of pattern.hats) addNoiseHit(data, rate, beatSeconds(beat), 0.035, 0.07, rand, 'hat');
  for (let i = 0; i < pattern.crackle; i++) {
    const at = rand() * seconds;
    addNoiseHit(data, rate, at, 0.008, 0.045, rand, 'hat');
  }
  lowpass(data, rate, pattern.lowpass);
  fadeEdges(data, rate);
  masterToLoudness(data);
  return data;
}

export function highFrequencyEnergy(samples) {
  if (!samples || samples.length < 2) return 0;
  let energy = 0;
  for (let i = 1; i < samples.length; i++) energy += Math.abs(samples[i] - samples[i - 1]);
  return energy / samples.length;
}

export function renderBed(kind, sampleRate, seconds = 2) {
  const rate = Math.max(1000, Math.floor(sampleRate) || 44100);
  const data = new Float32Array(Math.max(1, Math.floor(rate * seconds)));
  const rand = lcg({wind: 3, birds: 11, traffic: 19, crickets: 29, rain: 41, hum: 53, hats: 67, siren: 71, engine: 83, whirr: 89}[kind] || 99);
  if (kind === 'wind' || kind === 'rain' || kind === 'engine') {
    let brown = 0;
    for (let i = 0; i < data.length; i++) {
      brown = (brown + (rand() * 2 - 1) * 0.04) / 1.02;
      const wobble = 0.75 + 0.25 * Math.sin(i / rate * (kind === 'rain' ? 9 : 0.7));
      data[i] = brown * wobble * (kind === 'rain' ? 2.4 : 3.2);
    }
  } else if (kind === 'birds') {
    for (let chirp = 0; chirp < 5; chirp++) {
      const start = rand() * Math.max(0.2, seconds - 0.3);
      const freq = 1800 + rand() * 1400;
      addSine(data, rate, start, 0.09, freq, 0.2, 18);
      addSine(data, rate, start + 0.08, 0.07, freq * 1.2, 0.12, 20);
    }
  } else if (kind === 'traffic') {
    let brown = 0;
    for (let i = 0; i < data.length; i++) {
      brown = brown * 0.985 + (rand() * 2 - 1) * 0.015;
      data[i] = brown * 4;
    }
    addNoiseHit(data, rate, seconds * 0.35, 0.45, 0.15, rand, 'snare');
  } else if (kind === 'crickets') {
    for (let i = 0; i < data.length; i++) {
      const t = i / rate;
      const pulse = Math.max(0, Math.sin(t * 42));
      data[i] = Math.sin(t * 4680 * Math.PI * 2) * pulse * pulse * 0.25;
    }
  } else if (kind === 'hum') {
    for (let i = 0; i < data.length; i++) {
      const t = i / rate;
      data[i] = Math.sin(t * 55 * Math.PI * 2) * 0.2 + Math.sin(t * 110 * Math.PI * 2) * 0.06;
    }
  } else if (kind === 'hats') {
    for (let beat = 0; beat < 8; beat++) addNoiseHit(data, rate, beatSeconds(beat * 0.5) % seconds, 0.03, 0.2, rand, 'hat');
  } else if (kind === 'whirr') {
    let brown = 0;
    for (let i = 0; i < data.length; i++) {
      brown = (brown + (rand() * 2 - 1) * 0.2) / 1.08;
      const t = i / rate;
      data[i] = brown * (0.65 + 0.35 * Math.sin(t * 48 * Math.PI * 2));
    }
  } else if (kind === 'siren') {
    for (let i = 0; i < data.length; i++) {
      const t = i / rate;
      const glide = t < seconds / 2 ? t / (seconds / 2) : 1 - (t - seconds / 2) / (seconds / 2);
      const freq = 620 + glide * 210;
      data[i] = Math.sin(t * freq * Math.PI * 2) * 0.45 + Math.sin(t * freq * 0.5 * Math.PI * 2) * 0.12;
    }
  }
  fadeEdges(data, rate);
  return data;
}

function finite(value, fallback = 0) {
  return Number.isFinite(value) ? value : fallback;
}

export function createTownAudio(options = {}) {
  const storage = options.storage || null;
  const levels = options.levels && typeof options.levels === 'object' ? options.levels : {};
  let stored = {...DEFAULT_AUDIO_LEVELS};
  if (storage) {
    try { stored = readAudioLevels(storage.getItem(AUDIO_STORAGE_KEY)); } catch { stored = {...DEFAULT_AUDIO_LEVELS}; }
  }
  for (const key of AUDIO_LEVEL_KEYS) {
    const next = clamp01(levels[key]);
    levels[key] = next === null ? stored[key] : next;
  }

  const engine = {
    levels,
    unlocked: false,
    enabled: true,
    dialogue: false,
    tension: 0,
    rain: 0,
    mixerOn: false,
    variant: 'day',
    mix: null,
    stings: 0,
    barks: 0,
    clock: 0,
  };
  let ctx = null;
  let failedContext = null;
  let bedsStarted = false;
  let bedFailed = false;
  let queued = null;
  let voices = 0;
  let noise = null;
  const barkAt = new Map();
  const nodes = {};
  let lastOfficers = [];
  let wasArrested = false;
  let whistleStage = '';
  let meterAt = -10;
  let radioAt = -10;

  function time() {
    return Number.isFinite(ctx?.currentTime) ? ctx.currentTime : 0;
  }

  function glide(param, value) {
    if (!param) return;
    const next = Math.max(0, Number.isFinite(value) ? value : 0);
    try {
      if (param.setTargetAtTime && ctx && Number.isFinite(ctx.currentTime)) param.setTargetAtTime(next, ctx.currentTime, 0.12);
      else param.value = next;
    } catch {
      try { param.value = next; } catch { /* ignore a missing param */ }
    }
  }

  function applyGains() {
    if (!nodes.master) return;
    const duck = engine.dialogue ? MUSIC_DUCK : 1;
    const hear = engine.enabled ? 1 : 0;
    glide(nodes.master.gain, levels.master * hear);
    glide(nodes.music.gain, levels.music * duck);
    glide(nodes.effects.gain, levels.effects);
    glide(nodes.ambience.gain, levels.ambience);
    const mix = engine.mix || ambienceMix(540);
    const bed = engine.active === false ? 0.7 : 1;
    glide(nodes.layers.birds.gain, mix.birds * 0.045 * bed);
    glide(nodes.layers.traffic.gain, mix.traffic * 0.04 * bed);
    glide(nodes.layers.wind.gain, mix.wind * 0.04 * bed);
    glide(nodes.layers.crickets.gain, mix.crickets * 0.04 * bed);
    glide(nodes.layers.hum.gain, mix.hum * 0.03 * bed);
    glide(nodes.layers.rain.gain, engine.rain * 0.06 * bed);
    glide(nodes.layers.day.gain, (engine.variant === 'night' ? 0 : 1) * 0.9);
    glide(nodes.layers.night.gain, (engine.variant === 'night' ? 1 : 0) * 0.9);
    glide(nodes.layers.hats.gain, engine.tension * 0.22);
    const pulse = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(engine.clock * 8));
    glide(nodes.layers.pulse.gain, engine.tension * pulse * 0.16);
    if (nodes.siren) glide(nodes.siren.gain.gain, engine.sirenOn ? 0.12 : 0);
    if (nodes.engine) glide(nodes.engine.gain.gain, engine.engineGain || 0);
    if (nodes.mixer) glide(nodes.mixer.gain.gain, engine.mixerOn ? 0.07 : 0);
  }

  function bufferFrom(samples) {
    const audio = ctx.createBuffer(1, samples.length, ctx.sampleRate);
    audio.getChannelData(0).set(samples);
    return audio;
  }

  function startLoop(samples, destination) {
    const source = ctx.createBufferSource();
    source.buffer = bufferFrom(samples);
    source.loop = true;
    source.connect(destination);
    source.start();
    return source;
  }

  function ensureBeds() {
    if (!ctx || ctx.state !== 'running' || bedsStarted || bedFailed) return;
    try {
      const rate = ctx.sampleRate;
      nodes.sources = {
        day: startLoop(renderMusic('day', rate), nodes.layers.day),
        night: startLoop(renderMusic('night', rate), nodes.layers.night),
        wind: startLoop(renderBed('wind', rate, 2), nodes.layers.wind),
        birds: startLoop(renderBed('birds', rate, 2), nodes.layers.birds),
        traffic: startLoop(renderBed('traffic', rate, 2), nodes.layers.traffic),
        crickets: startLoop(renderBed('crickets', rate, 2), nodes.layers.crickets),
        hum: startLoop(renderBed('hum', rate, 2), nodes.layers.hum),
        rain: startLoop(renderBed('rain', rate, 2), nodes.layers.rain),
        hats: startLoop(renderBed('hats', rate, beatSeconds(4)), nodes.layers.hats),
      };
      const pulse = ctx.createOscillator();
      pulse.type = 'sine';
      pulse.frequency.value = 52;
      pulse.connect(nodes.layers.pulse);
      pulse.start();
      nodes.sources.pulse = pulse;
      const sirenGain = ctx.createGain();
      sirenGain.gain.value = 0;
      const siren = ctx.createBufferSource();
      siren.buffer = bufferFrom(renderBed('siren', rate, 1.2));
      siren.loop = true;
      siren.connect(sirenGain);
      let panner = null;
      try { panner = ctx.createPanner(); } catch { panner = null; }
      if (panner) {
        panner.panningModel = 'equalpower';
        panner.distanceModel = 'inverse';
        panner.refDistance = 4;
        panner.maxDistance = 48;
        panner.rolloffFactor = 1.15;
        sirenGain.connect(panner);
        panner.connect(nodes.effects);
      } else sirenGain.connect(nodes.effects);
      siren.start();
      nodes.siren = {source: siren, gain: sirenGain, panner};
      const engineGain = ctx.createGain();
      engineGain.gain.value = 0;
      const motor = ctx.createBufferSource();
      motor.buffer = bufferFrom(renderBed('engine', rate, 1));
      motor.loop = true;
      motor.connect(engineGain);
      engineGain.connect(nodes.effects);
      motor.start();
      nodes.engine = {source: motor, gain: engineGain};
      const mixerGain = ctx.createGain();
      mixerGain.gain.value = 0;
      const whirr = ctx.createBufferSource();
      whirr.buffer = bufferFrom(renderBed('whirr', rate, 1));
      whirr.loop = true;
      whirr.connect(mixerGain);
      mixerGain.connect(nodes.effects);
      whirr.start();
      nodes.mixer = {source: whirr, gain: mixerGain};
      bedsStarted = true;
      applyGains();
      if (queued) {
        const pending = queued;
        queued = null;
        engine.emit(pending.name, pending.detail);
      }
    } catch {
      bedFailed = true;
    }
  }

  function aimListener(world) {
    const listener = ctx?.listener;
    if (!listener) return;
    const x = finite(world.x);
    const y = finite(world.y, 1.7);
    const z = finite(world.z);
    const yaw = finite(world.yaw);
    const fx = -Math.sin(yaw);
    const fz = -Math.cos(yaw);
    try {
      if (listener.positionX?.setValueAtTime) {
        const now = time();
        listener.positionX.setValueAtTime(x, now);
        listener.positionY.setValueAtTime(y, now);
        listener.positionZ.setValueAtTime(z, now);
        listener.forwardX.setValueAtTime(fx, now);
        listener.forwardY.setValueAtTime(0, now);
        listener.forwardZ.setValueAtTime(fz, now);
        listener.upX.setValueAtTime(0, now);
        listener.upY.setValueAtTime(1, now);
        listener.upZ.setValueAtTime(0, now);
      } else {
        listener.setPosition?.(x, y, z);
        listener.setOrientation?.(fx, 0, fz, 0, 1, 0);
      }
    } catch { /* listener is optional */ }
  }

  function place(node, detail) {
    if (!Number.isFinite(detail?.x) || !Number.isFinite(detail?.z)) {
      node.connect(nodes.effects);
      return null;
    }
    let panner = null;
    try { panner = ctx.createPanner(); } catch { panner = null; }
    if (!panner) {
      node.connect(nodes.effects);
      return null;
    }
    panner.panningModel = 'equalpower';
    panner.distanceModel = 'inverse';
    panner.refDistance = 2;
    panner.maxDistance = 28;
    panner.rolloffFactor = 1.2;
    const y = finite(detail.y, 1.4);
    try {
      if (panner.positionX) {
        panner.positionX.value = detail.x;
        panner.positionY.value = y;
        panner.positionZ.value = detail.z;
      } else panner.setPosition?.(detail.x, y, detail.z);
    } catch { /* positional is best-effort */ }
    node.connect(panner);
    panner.connect(nodes.effects);
    return panner;
  }

  function noiseBuffer() {
    if (noise) return noise;
    const rand = lcg(0xc0ffee);
    const length = Math.max(1, Math.floor(ctx.sampleRate * 0.5));
    noise = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = rand() * 2 - 1;
    return noise;
  }

  function canPlay() {
    return !!(engine.unlocked && ctx && ctx.state === 'running' && engine.enabled && levels.master > 0 && levels.effects > 0 && voices < 48 && nodes.effects);
  }

  function voice(detail, build) {
    if (!engine.unlocked || !ctx) return {ok: false, reason: 'locked'};
    if (ctx.state !== 'running') {
      queued = {name: detail.__event, detail};
      return {ok: false, reason: 'suspended', queued: true};
    }
    if (!engine.enabled || !(levels.master > 0) || !(levels.effects > 0)) return {ok: false, reason: 'muted'};
    if (voices >= 48 || !nodes.effects) return {ok: false, reason: 'busy'};
    try {
      const gain = ctx.createGain();
      const chain = build(gain) || [];
      place(gain, detail);
      voices += 1;
      const source = chain[0];
      if (source) source.onended = () => {
        voices = Math.max(0, voices - 1);
        try { source.disconnect(); } catch { /* already stopped */ }
        try { gain.disconnect(); } catch { /* already stopped */ }
      };
      return {ok: true};
    } catch {
      return {ok: false, reason: 'error'};
    }
  }

  function tone(gain, when, freq, duration, peak, type = 'sine', slide = 0) {
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(Math.max(30, freq), when);
    if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), when + duration);
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, peak), when + Math.min(0.02, duration * 0.35));
    gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);
    osc.connect(gain);
    osc.start(when);
    osc.stop(when + duration + 0.02);
    return [osc];
  }

  function burst(gain, when, duration, peak, cutoff, q = 0.7) {
    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer();
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = cutoff;
    filter.Q.value = q;
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, peak), when + Math.min(0.03, duration * 0.25));
    gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);
    source.connect(filter);
    filter.connect(gain);
    source.start(when);
    source.stop(when + duration + 0.02);
    return [source, filter];
  }

  function bark(detail, gain) {
    const voiceId = Number.isInteger(detail.voice) ? detail.voice : 0;
    const base = 112 + (voiceId % 7) * 18;
    const words = [
      [0, 1.04],
      [1.18],
      [1, 1.35],
      [0.92],
    ][Math.abs(voiceId) % 4];
    const when0 = time();
    let last = null;
    words.forEach((ratio, index) => {
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      const formant = ctx.createBiquadFilter();
      formant.type = 'bandpass';
      formant.frequency.value = (index % 2 ? 1400 : 700) * (0.9 + (voiceId % 3) * 0.08);
      formant.Q.value = 5;
      const syllable = ctx.createGain();
      const at = when0 + index * 0.16;
      const freq = base * ratio;
      osc.frequency.setValueAtTime(freq, at);
      if (detail.warble) {
        osc.frequency.linearRampToValueAtTime(freq * 1.08, at + 0.05);
        osc.frequency.linearRampToValueAtTime(freq * 0.94, at + 0.1);
      }
      syllable.gain.setValueAtTime(0.0001, at);
      syllable.gain.exponentialRampToValueAtTime(0.07, at + 0.02);
      syllable.gain.exponentialRampToValueAtTime(0.0001, at + 0.13);
      osc.connect(formant);
      formant.connect(syllable);
      syllable.connect(gain);
      osc.start(at);
      osc.stop(at + 0.14);
      last = osc;
    });
    gain.gain.value = 1;
    engine.barks += 1;
    return last ? [last] : [];
  }

  function playEvent(name, detail) {
    const when = time();
    if (name === 'footstep') {
      const profile = FOOTSTEP_SURFACES[detail.surface] || FOOTSTEP_SURFACES.dirt;
      const peak = profile.gain * (detail.crouch ? 0.45 : 1) * (detail.sprint ? 1.05 : 1);
      return voice(detail, gain => {
        const made = burst(gain, when, profile.decay, peak, profile.cutoff);
        const body = ctx.createOscillator();
        body.frequency.value = profile.thud;
        body.connect(gain);
        body.start(when);
        body.stop(when + profile.decay);
        if (detail.sprint && made[0]) made[0].playbackRate.value = 1.12;
        return made;
      });
    }
    if (name === 'door') {
      const metal = detail.kind === 'metal';
      return voice(detail, gain => burst(gain, when, metal ? 0.12 : 0.2, 0.12, metal ? 1800 : 700, metal ? 2 : 0.8));
    }
    if (name === 'pickup') return voice(detail, gain => tone(gain, when, 240, 0.09, 0.08, 'triangle', 220));
    if (name === 'trash') return voice(detail, gain => burst(gain, when, 0.16, 0.1, 1600));
    if (name === 'dumpster') return voice(detail, gain => tone(gain, when, 90, 0.28, 0.16, 'triangle', -40));
    if (name === 'skate-roll') return voice(detail, gain => burst(gain, when, 0.35, 0.08, 900));
    if (name === 'skate-ollie') return voice(detail, gain => burst(gain, when, 0.07, 0.16, 2100, 3));
    if (name === 'sale') {
      const ding = voice(detail, gain => tone(gain, when, 1568, 0.18, 0.1, 'sine'));
      voice(detail, gain => tone(gain, when + 0.08, 2100, 0.05, 0.05, 'square'));
      voice(detail, gain => tone(gain, when + 0.12, 1760, 0.06, 0.045, 'square'));
      return ding;
    }
    if (name === 'cash') return voice(detail, gain => tone(gain, when, 988, 0.08, 0.07, 'triangle', 400));
    if (name === 'xp') {
      toneOnly(detail, 660, 0, 0.09);
      toneOnly(detail, 880, 0.08, 0.1);
      return toneOnly(detail, 1175, 0.16, 0.16);
    }
    if (name === 'message') {
      const first = voice(detail, gain => tone(gain, when, 523, 0.12, 0.08, 'sine'));
      voice(detail, gain => tone(gain, when + 0.11, 659, 0.16, 0.07, 'sine'));
      return first;
    }
    if (name === 'ui') return voice(detail, gain => tone(gain, when, 1400, 0.03, 0.035, 'square'));
    if (name === 'notify') return voice(detail, gain => tone(gain, when, 740, 0.16, 0.06, 'sine'));
    if (name === 'sting') {
      const first = voice(detail, gain => tone(gain, when, 988, 0.09, 0.08, 'triangle', -180));
      voice(detail, gain => tone(gain, when + 0.1, 494, 0.18, 0.07, 'sine', -120));
      return first;
    }
    if (name === 'soil') return voice(detail, gain => burst(gain, when, 0.32, 0.1, 500));
    if (name === 'water') return voice(detail, gain => burst(gain, when, 0.28, 0.09, 1200, 0.6));
    if (name === 'snip') return voice(detail, gain => burst(gain, when, 0.05, 0.1, 2800, 4));
    if (name === 'gummy') return voice(detail, gain => tone(gain, when, 140, 0.12, 0.1, 'sine', -50));
    if (name === 'wrapper') return voice(detail, gain => burst(gain, when, 0.18, 0.08, 3200, 0.4));
    if (name === 'jar') return voice(detail, gain => tone(gain, when, 420, 0.1, 0.07, 'triangle', 180));
    if (name === 'mixer') return voice(detail, gain => burst(gain, when, 0.22, 0.06, 360, 1.4));
    if (name === 'bark') {
      const id = Number.isInteger(detail.voice) ? detail.voice : 0;
      const last = barkAt.get(id) ?? -999;
      if (!detail.force && engine.clock - last < 8 + (id % 4)) return {ok: false, reason: 'cooldown'};
      if (detail.force && engine.clock - last < 0.35) return {ok: false, reason: 'cooldown'};
      barkAt.set(id, engine.clock);
      return voice(detail, gain => bark(detail, gain));
    }
    if (name === 'warble') return voice(detail, gain => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, when);
      osc.frequency.linearRampToValueAtTime(680, when + 0.08);
      osc.frequency.linearRampToValueAtTime(480, when + 0.16);
      osc.frequency.linearRampToValueAtTime(640, when + 0.24);
      gain.gain.setValueAtTime(0.0001, when);
      gain.gain.exponentialRampToValueAtTime(0.07, when + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.28);
      osc.connect(gain);
      osc.start(when);
      osc.stop(when + 0.3);
      return [osc];
    });
    if (name === 'whistle') return voice(detail, gain => tone(gain, when, 1600, 0.22, 0.06, 'sine', 700));
    if (name === 'taser') return voice(detail, gain => burst(gain, when, 0.14, 0.12, 2400, 6));
    if (name === 'radio') return voice(detail, gain => burst(gain, when, 0.35, 0.05, 1400, 2));
    if (name === 'meter') return voice(detail, gain => tone(gain, when, 880, 0.06, 0.05, 'square'));
    if (name === 'thunder') return voice(detail, gain => burst(gain, when, 0.7, 0.18, 180));
    if (name === 'siren') return {ok: true, cue: 'siren'};
    if (name === 'rain') {
      engine.rain = clamp01(detail.amount) ?? (detail.amount ? 1 : 0);
      applyGains();
      return {ok: true, cue: 'rain'};
    }
    if (name === 'dialogue') {
      engine.dialogue = !!detail.open;
      applyGains();
      return {ok: true, cue: 'dialogue'};
    }
    return {ok: false, reason: 'unknown'};
  }

  function toneOnly(detail, freq, delay, duration) {
    return voice(detail, gain => tone(gain, time() + delay, freq, duration, 0.07, 'sine'));
  }

  function moveSiren(world) {
    const officers = Array.isArray(world.officers) ? world.officers : [];
    const chasing = officers.filter(officer => officer && officer.mode === 'pursuit' && Number.isFinite(officer.x) && Number.isFinite(officer.z));
    engine.sirenOn = chasing.length > 0 || world.police === 'pursuit';
    const dt = finite(world.dt, 0);
    let doppler = 1;
    if (chasing.length && dt > 0) {
      let nearest = chasing[0];
      let best = Infinity;
      for (const officer of chasing) {
        const distance = Math.hypot(officer.x - finite(world.x), officer.z - finite(world.z));
        if (distance < best) { best = distance; nearest = officer; }
      }
      const previous = lastOfficers.find(officer => officer.mode === 'pursuit');
      if (previous && Number.isFinite(previous.x)) {
        const vx = (nearest.x - previous.x) / dt;
        const vz = (nearest.z - previous.z) / dt;
        const dx = finite(world.x) - nearest.x;
        const dz = finite(world.z) - nearest.z;
        const distance = Math.hypot(dx, dz) || 1;
        const closing = (vx * dx + vz * dz) / distance;
        doppler = 1 + Math.max(-0.18, Math.min(0.18, closing / 90));
      }
      const panner = nodes.siren?.panner;
      if (panner?.positionX) {
        panner.positionX.value = nearest.x;
        panner.positionY.value = 1.6;
        panner.positionZ.value = nearest.z;
      } else panner?.setPosition?.(nearest.x, 1.6, nearest.z);
    }
    if (nodes.siren?.source?.playbackRate) nodes.siren.source.playbackRate.value = doppler;
    engine.doppler = doppler;
    lastOfficers = officers.map(officer => ({...officer}));
  }

  function maybeBark(world) {
    if (!world.active || world.panel || world.driving || !Array.isArray(world.npcs)) return;
    for (const npc of world.npcs) {
      if (!npc || !Number.isFinite(npc.x) || !Number.isFinite(npc.z)) continue;
      if (Math.hypot(npc.x - finite(world.x), npc.z - finite(world.z)) > 8) continue;
      engine.emit('bark', {voice: npc.id ?? 0, x: npc.x, z: npc.z, warble: !!npc.warble});
    }
  }

  engine.setEnabled = function setEnabled(value) {
    engine.enabled = !!value;
    applyGains();
  };

  engine.setVolume = function setVolume(key, value) {
    if (!AUDIO_LEVEL_KEYS.includes(key)) return false;
    const next = clamp01(value);
    if (next === null) return false;
    levels[key] = next;
    if (storage) {
      try { writeAudioLevels(storage, levels); } catch { options.onPersistError?.(); }
    }
    applyGains();
    return true;
  };

  engine.unlock = function unlock(context) {
    if (!context || typeof context.createGain !== 'function') return {ok: false, reason: 'missing'};
    if (failedContext === context) return {ok: false, reason: 'error'};
    if (!engine.unlocked) {
      try {
        ctx = context;
        nodes.master = context.createGain();
        nodes.music = context.createGain();
        nodes.effects = context.createGain();
        nodes.ambience = context.createGain();
        nodes.master.gain.value = 0;
        nodes.music.connect(nodes.master);
        nodes.effects.connect(nodes.master);
        nodes.ambience.connect(nodes.master);
        nodes.master.connect(context.destination);
        nodes.layers = {};
        for (const name of ['day', 'night', 'wind', 'birds', 'traffic', 'crickets', 'hum', 'rain', 'hats', 'pulse']) {
          const gain = context.createGain();
          gain.gain.value = 0;
          gain.connect(name === 'day' || name === 'night' || name === 'hats' || name === 'pulse' ? nodes.music : nodes.ambience);
          nodes.layers[name] = gain;
        }
        engine.unlocked = true;
      } catch {
        failedContext = context;
        engine.unlocked = false;
        ctx = null;
        return {ok: false, reason: 'error'};
      }
    } else ctx = context;
    try {
      const pending = context.resume?.();
      pending?.then?.(() => ensureBeds())?.catch?.(() => {});
    } catch { /* resume can reject under autoplay */ }
    ensureBeds();
    applyGains();
    return {ok: true};
  };

  engine.emit = function emit(name, detail = {}) {
    if (!AUDIO_EVENTS.includes(name)) return {ok: false, reason: 'unknown'};
    const payload = {...detail, __event: name};
    try {
      if ((name === 'rain' || name === 'dialogue' || name === 'siren') && (!ctx || ctx.state !== 'running')) {
        if (name === 'rain') engine.rain = clamp01(detail.amount) ?? 0;
        if (name === 'dialogue') engine.dialogue = !!detail.open;
        return {ok: true, cue: name, deferred: true};
      }
      const result = playEvent(name, payload);
      return result.ok === false ? result : {...result, ok: true, cue: name};
    } catch {
      return {ok: false, reason: 'error'};
    }
  };

  engine.update = function update(world = {}) {
    engine.clock = finite(world.now, engine.clock);
    engine.active = world.active !== false;
    if (typeof world.dialogue === 'boolean') engine.dialogue = world.dialogue;
    if (Number.isFinite(world.rain)) engine.rain = Math.max(0, Math.min(1, world.rain));
    if (world.thunder) engine.emit('thunder');
    const mix = ambienceMix(world.time, {indoors: !!world.indoors});
    engine.mix = mix;
    engine.variant = mix.night >= 0.5 ? 'night' : 'day';
    const dt = Math.max(0, Math.min(1, finite(world.dt, 1 / 60)));
    const arrested = policeIsArrested(world.police);
    const target = arrested ? 1 : 0;
    if (wasArrested && !arrested) {
      engine.stings += 1;
      engine.emit('sting');
    }
    wasArrested = arrested;
    engine.tension = target > engine.tension ? Math.min(target, engine.tension + dt) : Math.max(target, engine.tension - dt);
    const stage = String(world.police || '');
    if (stage === 'stop' && whistleStage !== 'stop') engine.emit('whistle', {x: world.x, z: world.z});
    whistleStage = stage;
    if ((stage === 'pursuit' || stage === 'stop') && engine.clock - radioAt > 2.8) {
      radioAt = engine.clock;
      const officer = Array.isArray(world.officers) ? world.officers.find(item => item?.mode === 'pursuit' || item?.mode === 'stop') : null;
      engine.emit('radio', officer ? {x: officer.x, z: officer.z} : {});
    }
    if (arrested && engine.clock - meterAt > 0.6) {
      meterAt = engine.clock;
      engine.emit('meter');
    }
    const speed = Math.abs(finite(world.speed));
    engine.engineGain = world.driving ? Math.min(1, 0.04 + speed / 20) : 0;
    engine.mixerOn = world.station === 'mix';
    if (nodes.engine?.source?.playbackRate) nodes.engine.source.playbackRate.value = 0.65 + Math.min(1.1, speed / 16);
    moveSiren(world);
    if (world.enabled === false) engine.enabled = false;
    else if (world.enabled === true) engine.enabled = true;
    aimListener(world);
    ensureBeds();
    applyGains();
    maybeBark(world);
    return engine.snapshot();
  };

  engine.snapshot = function snapshot() {
    return {
      unlocked: !!engine.unlocked,
      enabled: engine.enabled !== false,
      variant: engine.variant,
      tension: engine.tension,
      dialogue: !!engine.dialogue,
      siren: !!engine.sirenOn,
      doppler: engine.doppler || 1,
      stings: engine.stings,
      barks: engine.barks,
      rain: engine.rain,
      mix: engine.mix,
      levels: {
        master: levels.master,
        music: levels.music,
        effects: levels.effects,
        ambience: levels.ambience,
      },
      gains: nodes.master ? {
        master: nodes.master.gain.value,
        music: nodes.music.gain.value,
        effects: nodes.effects.gain.value,
        ambience: nodes.ambience.gain.value,
        birds: nodes.layers.birds.gain.value,
        traffic: nodes.layers.traffic.gain.value,
        crickets: nodes.layers.crickets.gain.value,
        hum: nodes.layers.hum.gain.value,
        hats: nodes.layers.hats.gain.value,
        pulse: nodes.layers.pulse.gain.value,
      } : null,
    };
  };

  return engine;
}
