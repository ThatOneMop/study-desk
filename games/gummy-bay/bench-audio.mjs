// Short original foley for the bench. Oscillators and a noise buffer only.
const CUES = Object.freeze({
  pour: {type: 'triangle', freq: 210, end: 140, dur: 0.18, gain: 0.045, noise: 0.03},
  spill: {type: 'sawtooth', freq: 180, end: 70, dur: 0.22, gain: 0.04, noise: 0.08},
  pop: {type: 'square', freq: 920, end: 440, dur: 0.07, gain: 0.03, noise: 0},
  snap: {type: 'triangle', freq: 1480, end: 760, dur: 0.05, gain: 0.035, noise: 0},
  drizzle: {type: 'sine', freq: 640, end: 480, dur: 0.12, gain: 0.03, noise: 0.04},
  crimp: {type: 'triangle', freq: 240, end: 90, dur: 0.16, gain: 0.05, noise: 0.02},
  drop: {type: 'sine', freq: 160, end: 55, dur: 0.2, gain: 0.06, noise: 0.03},
  done: {type: 'sine', freq: 620, end: 880, dur: 0.14, gain: 0.04, noise: 0},
  skip: {type: 'sine', freq: 360, end: 240, dur: 0.1, gain: 0.03, noise: 0},
});

function noiseBuffer(context) {
  const length = Math.max(1, Math.floor(context.sampleRate * 0.2));
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const data = buffer.getChannelData(0);
  let seed = 0x6d2b79f5;
  for (let i = 0; i < length; i++) {
    seed = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    seed ^= seed + Math.imul(seed ^ (seed >>> 7), 61 | seed);
    data[i] = ((seed >>> 0) / 4294967296) * 2 - 1;
  }
  return buffer;
}

export function playBenchCue(context, kind, enabled = true) {
  const cue = CUES[kind];
  if (!enabled || !cue || !context || typeof context.createOscillator !== 'function') return false;
  const now = Number.isFinite(context.currentTime) ? context.currentTime : 0;
  try {
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.type = cue.type;
    osc.frequency.setValueAtTime(cue.freq, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(40, cue.end), now + cue.dur);
    gain.gain.setValueAtTime(cue.gain, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + cue.dur);
    osc.connect(gain);
    gain.connect(context.destination);
    osc.start(now);
    osc.stop(now + cue.dur + 0.02);
    if (cue.noise > 0 && typeof context.createBufferSource === 'function') {
      const src = context.createBufferSource();
      const hush = context.createGain();
      src.buffer = noiseBuffer(context);
      hush.gain.setValueAtTime(cue.noise, now);
      hush.gain.exponentialRampToValueAtTime(0.0001, now + cue.dur);
      src.connect(hush);
      hush.connect(context.destination);
      src.start(now);
      src.stop(now + cue.dur);
    }
    return true;
  } catch {
    return false;
  }
}

export const BENCH_CUES = Object.freeze(Object.keys(CUES));
