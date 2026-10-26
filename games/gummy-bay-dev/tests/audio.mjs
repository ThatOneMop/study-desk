import assert from 'node:assert/strict';
import {worldLighting} from '../dist/world-lighting.mjs';
import {
  AUDIO_STORAGE_KEY, AUDIO_LEVEL_KEYS, DEFAULT_AUDIO_LEVELS, MUSIC_BPM, MUSIC_DUCK, LOUDNESS_TARGET_DB,
  readAudioLevels, writeAudioLevels, footstepSurface, ambienceMix, musicVariant, musicPlan,
  policeIsArrested, cueForAction, cueForGameplay, stationCue, isManualAction, audioMixerHTML, replaceAudioMixer,
  loudnessDb, renderMusic, highFrequencyEnergy, renderBed, createTownAudio,
} from '../dist/audio.mjs';

function param(initial = 0) {
  const audioParam = {
    value: initial,
    ramps: [],
    setValueAtTime(value) { audioParam.value = value; return audioParam; },
    linearRampToValueAtTime(value) { audioParam.ramps.push(value); audioParam.value = value; return audioParam; },
    exponentialRampToValueAtTime(value) { audioParam.value = value; return audioParam; },
    setTargetAtTime(value) { audioParam.value = value; return audioParam; },
  };
  return audioParam;
}

function fakeContext(sampleRate = 4000) {
  const started = [];
  const oscillators = [];
  function gainNode() {
    return {gain: param(0), connect() {}};
  }
  const context = {
    sampleRate,
    currentTime: 0,
    state: 'suspended',
    destination: {kind: 'destination'},
    started,
    oscillators,
    listener: {
      positionX: param(), positionY: param(), positionZ: param(),
      forwardX: param(), forwardY: param(), forwardZ: param(),
      upX: param(), upY: param(), upZ: param(),
    },
    resume() { return Promise.resolve(); },
    createGain: gainNode,
    createOscillator() {
      const osc = {type: 'sine', frequency: param(440), connect() {}, start() { started.push('osc'); }, stop() {}, onended: null};
      oscillators.push(osc);
      return osc;
    },
    createBufferSource() {
      const source = {buffer: null, loop: false, playbackRate: param(1), connect() {}, start() { started.push('buffer'); }, stop() {}, onended: null};
      return source;
    },
    createBiquadFilter() {
      return {type: 'lowpass', frequency: param(350), Q: param(1), connect() {}};
    },
    createPanner() {
      return {
        panningModel: '', distanceModel: '', refDistance: 1, maxDistance: 10000, rolloffFactor: 1,
        positionX: param(), positionY: param(), positionZ: param(), connect() {},
      };
    },
    createBuffer(_channels, length) {
      const data = new Float32Array(length);
      return {length, sampleRate, getChannelData() { return data; }};
    },
  };
  return context;
}

function memoryStorage(seed = {}) {
  const values = new Map(Object.entries(seed));
  return {
    values,
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(key, String(value)); },
  };
}

const fresh = createTownAudio();
assert.equal(fresh.snapshot().unlocked, false);
assert.equal(fresh.unlock(null).ok, false);
assert.equal(fresh.unlock({}).reason, 'missing');
assert.equal(fresh.emit('not-a-sound').reason, 'unknown');
assert.equal(fresh.emit('footstep').reason, 'locked');

assert.ok(MUSIC_BPM >= 80 && MUSIC_BPM <= 90);
assert.equal(LOUDNESS_TARGET_DB, -18);
assert.ok(Math.abs(MUSIC_DUCK - 10 ** (-6 / 20)) < 1e-9);
assert.deepEqual(AUDIO_LEVEL_KEYS, ['master', 'music', 'effects', 'ambience']);

const legacy = readAudioLevels('{"master":0.5,"effects":0.25,"ambience":0.1}');
assert.equal(legacy.music, DEFAULT_AUDIO_LEVELS.music);
assert.equal(legacy.effects, 0.25);
assert.equal(legacy.master, 0.5);
assert.deepEqual(readAudioLevels('{'), {...DEFAULT_AUDIO_LEVELS});
assert.deepEqual(readAudioLevels(null), {...DEFAULT_AUDIO_LEVELS});
assert.equal(readAudioLevels('{"master":5,"music":-2,"effects":"nope"}').master, 1);
assert.equal(readAudioLevels('{"master":5,"music":-2}').music, 0);

const store = memoryStorage({'gummybay-v3-story-1': '{"version":3,"cash":400}'});
const levels = {};
let persisted = 0;
const saved = createTownAudio({
  storage: store,
  levels,
  onPersistError() { persisted += 1; },
});
assert.equal(levels.music, 0.55);
assert.equal(saved.setVolume('music', 0.35), true);
assert.equal(levels.music, 0.35);
assert.equal(readAudioLevels(store.getItem(AUDIO_STORAGE_KEY)).music, 0.35);
assert.equal(readAudioLevels(store.getItem(AUDIO_STORAGE_KEY)).effects, 0.8);
assert.equal(saved.setVolume('master', 5), true);
assert.equal(levels.master, 1);
assert.equal(saved.setVolume('ambience', -2), true);
assert.equal(levels.ambience, 0);
assert.equal(saved.setVolume('score', 1), false);
assert.equal(store.getItem('gummybay-v3-story-1'), '{"version":3,"cash":400}');
store.setItem = () => { throw new Error('full'); };
assert.equal(saved.setVolume('effects', 0), true);
assert.equal(levels.effects, 0);
assert.equal(persisted, 1);

const legacyStore = memoryStorage({[AUDIO_STORAGE_KEY]: JSON.stringify({master: 0.4, effects: 0, ambience: 0.2})});
const legacyLevels = {master: 0.4, effects: 0, ambience: 0.2};
createTownAudio({storage: legacyStore, levels: legacyLevels});
assert.equal(legacyLevels.music, 0.55);
assert.equal(legacyLevels.effects, 0);
writeAudioLevels(legacyStore, legacyLevels);
assert.equal(JSON.parse(legacyStore.getItem(AUDIO_STORAGE_KEY)).effects, 0);

assert.equal(footstepSurface(0, 0), 'asphalt');
assert.equal(footstepSurface(180, 8.1), 'concrete');
assert.equal(footstepSurface(40, 40), 'dirt');
assert.equal(footstepSurface(0, 0, 1), 'wood');
assert.equal(footstepSurface(Number.NaN, 0), 'dirt');

const dayMix = ambienceMix(540);
const nightMix = ambienceMix(1320);
assert.equal(dayMix.night, worldLighting(540, true).night);
assert.equal(nightMix.night, worldLighting(1320, true).night);
assert.equal(dayMix.night, 0);
assert.equal(nightMix.night, 1);
assert.ok(dayMix.birds > dayMix.crickets && dayMix.traffic > nightMix.traffic);
assert.ok(nightMix.crickets > nightMix.birds && nightMix.hum > dayMix.hum);
assert.equal(musicVariant(540), 'day');
assert.equal(musicVariant(1320), 'night');
assert.ok(ambienceMix(540, {indoors: true}).birds < dayMix.birds);

const dayPlan = musicPlan('day');
const nightPlan = musicPlan('night');
assert.equal(dayPlan.bpm, MUSIC_BPM);
assert.equal(nightPlan.hats, 0);
assert.ok(nightPlan.kicks < dayPlan.kicks);
assert.ok(nightPlan.lowpass < dayPlan.lowpass);
assert.ok(nightPlan.crackle < dayPlan.crackle);

const dayScore = renderMusic('day', 8000);
const dayAgain = renderMusic('day', 8000);
const nightScore = renderMusic('night', 8000);
assert.equal(dayScore.length, dayAgain.length);
for (let i = 0; i < dayScore.length; i += 97) assert.equal(dayScore[i], dayAgain[i]);
assert.ok(Math.abs(loudnessDb(dayScore) - LOUDNESS_TARGET_DB) < 0.05, `day ${loudnessDb(dayScore)}`);
assert.ok(Math.abs(loudnessDb(nightScore) - LOUDNESS_TARGET_DB) < 0.05, `night ${loudnessDb(nightScore)}`);
assert.ok(highFrequencyEnergy(nightScore) < highFrequencyEnergy(dayScore) * 0.85);
assert.ok(renderBed('siren', 4000, 1.2).some(sample => sample !== 0));
assert.ok(renderBed('whirr', 4000, 0.5).some(sample => sample !== 0));

assert.equal(policeIsArrested('search'), true);
assert.equal(policeIsArrested('UNDER ARREST'), true);
assert.equal(policeIsArrested('under_arrest'), true);
assert.equal(policeIsArrested('busted'), true);
assert.equal(policeIsArrested('pursuit'), false);
assert.equal(cueForAction('deliver'), 'sale');
assert.equal(cueForGameplay({type: 'craving-ask', npc: 1}), 'message');
assert.equal(cueForGameplay({type: 'craving-changed'}), 'sale');
assert.equal(cueForGameplay({type: 'curfew'}), null);
assert.equal(cueForGameplay(null), null);
assert.equal(cueForAction('text'), 'message');
assert.equal(cueForAction('prepare'), null);
assert.equal(isManualAction('mix'), true);
assert.equal(isManualAction('deliver'), false);
assert.equal(stationCue('prepare', 0), 'soil');
assert.equal(stationCue('water', 0), 'water');
assert.equal(stationCue('harvest', 0), 'snip');
assert.equal(stationCue('make', 0), 'gummy');
assert.equal(stationCue('pack', 1), 'wrapper');
assert.equal(stationCue('mix', 0), 'jar');
assert.equal(stationCue('mix', 1), 'mixer');

const mixer = replaceAudioMixer('<h3>Audio mix</h3><label>master <input aria-label="master volume"></label><p class="keep">diagnostics</p>', levels);
assert.ok(mixer.includes('>SFX <'));
assert.ok(mixer.includes('aria-label="music volume"'));
assert.ok(mixer.includes('aria-label="effects volume"'));
assert.ok(mixer.endsWith('<p class="keep">diagnostics</p>'));
assert.ok(audioMixerHTML(levels).includes('Master'));

const suspended = fakeContext();
const quiet = createTownAudio({levels: {master: 0.8, music: 0.55, effects: 0.8, ambience: 0.4}});
assert.equal(quiet.unlock(suspended).ok, true);
assert.equal(quiet.snapshot().unlocked, true);
assert.equal(suspended.started.length, 0);
await Promise.resolve();
assert.equal(suspended.started.length, 0, 'suspended playback stays silent');

suspended.state = 'running';
const armed = quiet.update({time: 540, dt: 1 / 60, now: 1, x: 0, y: 1.7, z: 0, yaw: 0});
assert.ok(suspended.started.length > 0, 'running playback starts the beds');
assert.equal(armed.variant, 'day');
assert.ok(Math.abs(armed.gains.music - 0.55) < 1e-6);

quiet.update({time: 540, dt: 1 / 60, now: 2, dialogue: true});
assert.ok(Math.abs(quiet.snapshot().gains.music - 0.55 * MUSIC_DUCK) < 1e-6);
quiet.update({time: 1320, dt: 1 / 60, now: 3, dialogue: false});
assert.equal(quiet.snapshot().variant, 'night');
assert.ok(Math.abs(quiet.snapshot().gains.music - 0.55) < 1e-6);

assert.equal(quiet.setVolume('effects', 0), true);
assert.equal(quiet.emit('footstep', {surface: 'asphalt'}).reason, 'muted');
assert.ok(quiet.snapshot().gains.music > 0.5);
assert.equal(quiet.snapshot().gains.effects, 0);
assert.equal(quiet.setVolume('effects', 0.8), true);

for (const name of ['sale', 'message', 'xp', 'soil', 'water', 'snip', 'gummy', 'wrapper', 'jar', 'trash', 'skate-ollie', 'dumpster', 'taser', 'thunder', 'sting', 'ui']) {
  const played = quiet.emit(name, {x: 4, z: 2});
  assert.equal(played.ok, true, name);
}
assert.equal(quiet.emit('rain', {amount: 0.4}).ok, true);
assert.equal(quiet.snapshot().rain, 0.4);
quiet.update({time: 540, dt: 1 / 60, now: 4, station: 'mix'});
assert.ok(Math.abs(quiet.snapshot().gains.effects - 0.8) < 1e-6);

const warbles = suspended.oscillators.reduce((count, osc) => count + osc.frequency.ramps.length, 0);
assert.equal(quiet.emit('warble').ok, true);
assert.ok(suspended.oscillators.some(osc => osc.frequency.ramps.length >= 3));
assert.equal(quiet.emit('bark', {voice: 3, warble: true, force: true}).ok, true);
assert.ok(suspended.oscillators.reduce((count, osc) => count + osc.frequency.ramps.length, 0) > warbles);

quiet.update({time: 540, dt: 0.016, now: 20, npcs: []});
assert.equal(quiet.emit('bark', {voice: 2}).ok, true);
assert.equal(quiet.emit('bark', {voice: 2}).reason, 'cooldown');

const tension = createTownAudio();
tension.update({police: 'search', dt: 0.5, now: 1, time: 540});
assert.ok(Math.abs(tension.snapshot().tension - 0.5) < 1e-6);
tension.update({police: 'under arrest', dt: 0.5, now: 2, time: 540});
assert.ok(Math.abs(tension.snapshot().tension - 1) < 1e-6);
assert.equal(tension.snapshot().stings, 0);
tension.update({police: 'clear', dt: 0.5, now: 3, time: 540});
assert.equal(tension.snapshot().stings, 1);
assert.ok(Math.abs(tension.snapshot().tension - 0.5) < 1e-6);

const chase = fakeContext();
chase.state = 'running';
const siren = createTownAudio();
siren.unlock(chase);
siren.update({time: 540, dt: 0.5, now: 1, x: 0, z: 0, police: 'pursuit', officers: [{mode: 'pursuit', x: 10, z: 0}]});
siren.update({time: 540, dt: 0.5, now: 1.5, x: 0, z: 0, police: 'pursuit', officers: [{mode: 'pursuit', x: 2, z: 0}]});
assert.equal(siren.snapshot().siren, true);
assert.ok(siren.snapshot().doppler > 1, `doppler ${siren.snapshot().doppler}`);

console.log('PASS: procedural music stays near -18 dB, night is darker, mixer levels persist, and arrest tension ducks back out with a sting.');
