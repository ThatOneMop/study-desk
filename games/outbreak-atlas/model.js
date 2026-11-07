/* Outbreak Atlas — fictional mark on an invented archipelago.
   No real places, no real pathogens. The opposing effort is not a player mode. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Outbreak = factory();
})(typeof globalThis === 'undefined' ? this : globalThis, function () {
  'use strict';
  const LANDS = [
    { id: 'hearthlow', name: 'Hearthlow', x: 230, y: 330, kind: 'hub', blurb: 'A round market town and the usual starting hearth.' },
    { id: 'bramble', name: 'Bramble Reach', x: 350, y: 250, kind: 'land', blurb: 'Hedgerows and footpaths.' },
    { id: 'mothfen', name: 'Mothfen', x: 160, y: 240, kind: 'land', blurb: 'Soft ground and short roads.' },
    { id: 'glassmere', name: 'Glassmere', x: 300, y: 155, kind: 'coast', blurb: 'A bright lake with a harbor.' },
    { id: 'northwind', name: 'Northwind Shelf', x: 190, y: 100, kind: 'coast', blurb: 'High docks and a sky field.' },
    { id: 'redkettle', name: 'Redkettle', x: 250, y: 450, kind: 'land', blurb: 'Kilns, carts, and a south road.' },
    { id: 'cinder', name: 'Cinder Steppe', x: 470, y: 300, kind: 'land', blurb: 'Open ground between the two main lands.' },
    { id: 'pale', name: 'Pale Harbor', x: 430, y: 145, kind: 'coast', blurb: 'The northern sea gate.' },
    { id: 'velvet', name: 'Velvet Dunes', x: 560, y: 400, kind: 'land', blurb: 'Slow roads across warm sand.' },
    { id: 'orchard', name: 'High Orchard', x: 650, y: 490, kind: 'land', blurb: 'Terraces above the south coast.' },
    { id: 'sable', name: 'Sable Crossing', x: 710, y: 300, kind: 'coast', blurb: 'A dark-water ferry town.' },
    { id: 'lantern', name: 'Lantern Isles', x: 90, y: 150, kind: 'isle', blurb: 'An island with both a sea lane and a sky lane.' },
    { id: 'spire', name: 'Quiet Spire', x: 860, y: 450, kind: 'isle', blurb: 'A far island with both a sea lane and a sky lane.' },
    { id: 'farwhistle', name: 'Farwhistle', x: 900, y: 150, kind: 'isle', blurb: 'The farthest island. Sea or sky can reach it.' }
  ];
  const LINKS = [
    ['hearthlow', 'bramble', 'land'], ['hearthlow', 'mothfen', 'land'], ['hearthlow', 'redkettle', 'land'],
    ['bramble', 'glassmere', 'land'], ['bramble', 'cinder', 'land'], ['mothfen', 'northwind', 'land'],
    ['glassmere', 'pale', 'land'], ['cinder', 'velvet', 'land'], ['cinder', 'orchard', 'land'],
    ['redkettle', 'velvet', 'land'], ['redkettle', 'sable', 'land'], ['velvet', 'orchard', 'land'],
    ['velvet', 'sable', 'land'], ['orchard', 'sable', 'land'],
    ['pale', 'lantern', 'sea'], ['sable', 'spire', 'sea'], ['lantern', 'farwhistle', 'sea'], ['spire', 'farwhistle', 'sea'],
    ['northwind', 'lantern', 'air'], ['orchard', 'spire', 'air'], ['spire', 'farwhistle', 'air'], ['northwind', 'farwhistle', 'air']
  ].map(([a, b, kind]) => ({ a, b, kind }));
  const UPGRADES = [
    { id: 'footpaths', branch: 'tide', name: 'Footpaths', cost: 1, text: 'Land links carry the mark a little farther.' },
    { id: 'carts', branch: 'tide', name: 'Market carts', cost: 1, requires: ['footpaths'], text: 'Land links carry it farther still.' },
    { id: 'harbors', branch: 'tide', name: 'Harbor threads', cost: 1, text: 'Opens every sea lane. Either this or Sky threads can reach every island.' },
    { id: 'ferries', branch: 'tide', name: 'Night ferries', cost: 2, requires: ['harbors'], text: 'Open sea lanes run fuller.' },
    { id: 'sky', branch: 'tide', name: 'Sky threads', cost: 1, text: 'Opens every sky lane. Either this or Harbor threads can reach every island.' },
    { id: 'tailwinds', branch: 'tide', name: 'Tailwinds', cost: 2, requires: ['sky'], text: 'Open sky lanes run fuller.' },
    { id: 'season', branch: 'tide', name: 'Busy season', cost: 2, requires: ['carts'], text: 'Every open link carries more.' },
    { id: 'echo', branch: 'tide', name: 'Echo hop', cost: 2, requires: ['season'], text: 'A lively land sometimes sparks a neighbor a little extra.' },
    { id: 'soft', branch: 'veil', name: 'Soft names', cost: 1, text: 'People talk about the mark less.' },
    { id: 'dim', branch: 'veil', name: 'Dim signals', cost: 1, requires: ['soft'], text: 'The talk stays quieter.' },
    { id: 'borrowed', branch: 'veil', name: 'Borrowed quiet', cost: 2, requires: ['dim'], text: 'Each month, a little of the talk fades.' },
    { id: 'ports', branch: 'veil', name: 'Unremarkable ports', cost: 1, text: 'Sea crossings add less talk.' },
    { id: 'greyskies', branch: 'veil', name: 'Grey skies', cost: 1, text: 'Sky crossings add less talk.' },
    { id: 'still', branch: 'veil', name: 'Still water', cost: 2, requires: ['borrowed'], text: 'The counter-effort grows more slowly.' },
    { id: 'memory', branch: 'veil', name: 'Long memory', cost: 2, requires: ['still'], text: 'Root shrugs off more of the counter-effort.' },
    { id: 'maps', branch: 'veil', name: 'Forgotten maps', cost: 2, requires: ['ports', 'greyskies'], text: 'Islands add less talk.' },
    { id: 'roots', branch: 'hold', name: 'Deep roots', cost: 1, text: 'A strong mark is harder to wash down.' },
    { id: 'second', branch: 'hold', name: 'Second season', cost: 1, requires: ['roots'], text: 'A strong mark keeps growing.' },
    { id: 'stones', branch: 'hold', name: 'Warm stones', cost: 2, requires: ['second'], text: 'The counter-effort pushes less.' },
    { id: 'stories', branch: 'hold', name: 'Shared stories', cost: 1, text: 'Establishing a land returns an extra point.' },
    { id: 'ember', branch: 'hold', name: 'Low ember', cost: 1, text: 'Drift grows faster once people have noticed it.' },
    { id: 'rhythm', branch: 'hold', name: 'Counter-rhythm', cost: 2, requires: ['stones'], text: 'The counter-effort no longer washes the mark down.' },
    { id: 'wide', branch: 'hold', name: 'Wide hearth', cost: 1, text: 'Hearthlow grows faster.' },
    { id: 'lasting', branch: 'hold', name: 'Lasting mark', cost: 2, requires: ['rhythm'], text: 'Established lands barely slip.' }
  ];
  const SCENARIOS = [
    { id: 'world', name: 'World Spread', text: 'Establish the mark in all 14 lands before the counter-effort fills.' },
    { id: 'quiet', name: 'Quiet Circuit', text: 'Establish 8 lands while the talk is still at half or below.' },
    { id: 'twin', name: 'Twin Lights', text: 'Establish both Lantern Isles and Farwhistle. Sea or sky can reach them.' },
    { id: 'hearth', name: 'Hearthhold', text: 'Keep Hearthlow strong for 8 months in a row.' },
    { id: 'calm', name: 'Calm Atlas', text: 'A relaxed sandbox of World Spread. Choose how firmly the counter-effort pushes.' }
  ];
  const ARCHETYPES = {
    drift: { name: 'Drift', grow: 0.1, notice: 0.12, text: 'Fast and easy to notice. Good at crossing open links.' },
    root: { name: 'Root', grow: 0.075, notice: 0.038, text: 'Slower and quieter. The counter-effort has less to answer.' }
  };
  const PRESSURES = { calm: 0.7, breezy: 1, brisk: 1.28 };

  function landById(id) { return LANDS.find(land => land.id === id); }
  function upgradeById(id) { return UPGRADES.find(item => item.id === id); }
  function clamp(n) { return Math.max(0, Math.min(1, n)); }
  function shade(seed, id) {
    let n = (seed >>> 0) + String(id).split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0) * 13;
    n = Math.imul(n ^ (n >>> 16), 0x45d9f3b);
    return 0.9 + ((n >>> 0) % 100) / 500;
  }
  function owns(state, id) { return state.owned.indexOf(id) !== -1; }
  function clone(state) { return JSON.parse(JSON.stringify(state)); }
  function nextRand(state) {
    let a = (state.rng + 0x6D2B79F5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return { rng: a, value: ((t ^ (t >>> 14)) >>> 0) / 4294967296 };
  }
  function linkOpen(state, link) {
    if (link.kind === 'land') return true;
    if (link.kind === 'sea') return owns(state, 'harbors');
    return owns(state, 'sky');
  }
  function create(options) {
    const opts = options || {};
    const scenario = SCENARIOS.some(item => item.id === opts.scenario) ? opts.scenario : 'world';
    const archetype = opts.archetype === 'root' ? 'root' : 'drift';
    const pressure = PRESSURES[opts.pressure] ? opts.pressure : (scenario === 'calm' ? 'calm' : 'breezy');
    const lands = {};
    LANDS.forEach(land => { lands[land.id] = { mark: land.id === 'hearthlow' ? 0.16 : 0, foothold: false, established: false }; });
    return {
      version: 1, seed: (opts.seed >>> 0) || 1, rng: (opts.seed >>> 0) || 1,
      scenario, archetype, pressure, month: 0, points: 2, owned: [], lands,
      talk: 0.04, effort: 0, hearthStreak: 0, won: false, lost: false, log: ['Hearthlow already carries a small mark.']
    };
  }
  function mods(state) {
    const arch = ARCHETYPES[state.archetype];
    const pack = { grow: arch.grow, notice: arch.notice, land: 1, sea: 1, air: 1, effort: PRESSURES[state.pressure] };
    if (owns(state, 'footpaths')) pack.land *= 1.3;
    if (owns(state, 'carts')) pack.land *= 1.3;
    if (owns(state, 'ferries')) pack.sea *= 1.45;
    if (owns(state, 'tailwinds')) pack.air *= 1.45;
    if (owns(state, 'season')) { pack.land *= 1.2; pack.sea *= 1.2; pack.air *= 1.2; }
    if (owns(state, 'soft')) pack.notice *= 0.8;
    if (owns(state, 'dim')) pack.notice *= 0.8;
    if (owns(state, 'ember') && state.archetype === 'drift' && state.talk > 0.12) pack.grow *= 1.22;
    if (owns(state, 'still')) pack.effort *= 0.8;
    if (owns(state, 'stones')) pack.effort *= 0.86;
    if (owns(state, 'memory') && state.archetype === 'root') pack.effort *= 0.82;
    return pack;
  }
  function establishedCount(state) {
    return LANDS.reduce((sum, land) => sum + (state.lands[land.id].established ? 1 : 0), 0);
  }
  function checkWin(state) {
    if (state.scenario === 'quiet') return establishedCount(state) >= 8 && state.talk <= 0.5;
    if (state.scenario === 'twin') return state.lands.lantern.established && state.lands.farwhistle.established;
    if (state.scenario === 'hearth') return state.hearthStreak >= 8;
    return establishedCount(state) === LANDS.length;
  }
  function step(state) {
    if (!state || state.won || state.lost) return state;
    const next = clone(state);
    const pack = mods(next);
    LANDS.forEach(land => {
      const cell = next.lands[land.id];
      if (cell.mark <= 0) return;
      let grow = pack.grow;
      if (land.id === 'hearthlow' && owns(next, 'wide')) grow *= 1.38;
      if (cell.mark > 0.5 && owns(next, 'second')) grow *= 1.2;
      cell.mark = clamp(cell.mark + grow * shade(next.seed, land.id) * (1 - cell.mark));
    });
    LINKS.forEach(link => {
      if (!linkOpen(next, link)) return;
      const power = link.kind === 'land' ? pack.land : link.kind === 'sea' ? pack.sea : pack.air;
      carry(next, link.a, link.b, power);
      carry(next, link.b, link.a, power);
    });
    function carry(current, from, to, power) {
      const src = current.lands[from].mark;
      if (src < 0.2) return;
      const gain = src * 0.04 * power * shade(current.seed, to);
      const dest = current.lands[to];
      dest.mark = clamp(dest.mark + gain * (1 - dest.mark));
      if (owns(current, 'echo') && src > 0.22) {
        const roll = nextRand(current);
        current.rng = roll.rng;
        if (roll.value < 0.4) dest.mark = clamp(dest.mark + 0.035);
      }
    }
    let signal = 0;
    LANDS.forEach(land => {
      let weight = next.lands[land.id].mark;
      if (land.kind === 'isle' && owns(next, 'maps')) weight *= 0.55;
      signal += weight;
    });
    let talkGain = (signal / LANDS.length) * pack.notice * 1.7;
    if (owns(next, 'ports')) talkGain *= linkOpen(next, { kind: 'sea' }) ? 0.9 : 1;
    if (owns(next, 'greyskies')) talkGain *= linkOpen(next, { kind: 'air' }) ? 0.9 : 1;
    next.talk = clamp(next.talk + talkGain);
    if (owns(next, 'borrowed')) next.talk = clamp(next.talk - 0.018);
    const effortGain = (0.012 + next.talk * 0.08 + establishedCount(next) * 0.002) * pack.effort;
    next.effort = clamp(next.effort + effortGain);
    if (!owns(next, 'rhythm')) {
      const wash = next.effort * (owns(next, 'lasting') ? 0.004 : 0.01);
      LANDS.forEach(land => {
        const cell = next.lands[land.id];
        if (cell.mark <= 0) return;
        let loss = wash;
        if (owns(next, 'roots') && cell.mark > 0.4) loss *= 0.62;
        if (cell.established && owns(next, 'lasting')) loss *= 0.35;
        cell.mark = clamp(cell.mark - loss);
      });
    }
    const notes = [];
    LANDS.forEach(land => {
      const cell = next.lands[land.id];
      const before = state.lands[land.id];
      if (!cell.foothold && cell.mark >= 0.3) { cell.foothold = true; next.points += 1; notes.push(land.name + ' has a foothold.'); }
      if (!cell.established && cell.mark >= 0.62) { cell.established = true; next.points += owns(next, 'stories') ? 2 : 1; notes.push(land.name + ' is established.'); }
      else if (cell.mark - before.mark > 0.05) notes.push(land.name + ' is spreading.');
    });
    if (next.lands.hearthlow.mark >= 0.75) next.hearthStreak += 1;
    else next.hearthStreak = 0;
    next.month += 1;
    next.won = checkWin(next);
    next.lost = !next.won && next.effort >= 1;
    if (next.won) notes.unshift(winText(next));
    else if (next.lost) notes.unshift('The counter-effort covered the map. This story ends.');
    else notes.unshift('Month ' + next.month + '. Talk ' + Math.round(next.talk * 100) + '%. Counter-effort ' + Math.round(next.effort * 100) + '%.');
    next.log = notes.slice(0, 5);
    return next;
  }
  function winText(state) {
    const names = { world: 'Every land carries the mark.', quiet: 'Eight lands are established, and the talk is still low.', twin: 'Lantern Isles and Farwhistle both shine.', hearth: 'Hearthlow held for eight months.', calm: 'The calm atlas is complete.' };
    return names[state.scenario] || names.world;
  }
  function buy(state, id) {
    if (!state || state.won || state.lost) return { ok: false, state, reason: 'This story is already over.' };
    const item = upgradeById(id);
    if (!item) return { ok: false, state, reason: 'Unknown upgrade.' };
    if (owns(state, id)) return { ok: false, state, reason: 'Already taken.' };
    if ((item.requires || []).some(need => !owns(state, need))) return { ok: false, state, reason: 'An earlier upgrade is still missing.' };
    if (state.points < item.cost) return { ok: false, state, reason: 'Needs ' + item.cost + ' point' + (item.cost === 1 ? '' : 's') + '.' };
    const next = clone(state);
    next.points -= item.cost;
    next.owned = next.owned.concat(id);
    next.log = [item.name + ' is taken. ' + item.text];
    return { ok: true, state: next, reason: item.text };
  }
  function forecast(state) {
    if (!state || state.won || state.lost) return { lines: ['This story is already over.'], closed: [] };
    const preview = step(clone(state));
    const lines = [];
    LANDS.forEach(land => {
      const delta = preview.lands[land.id].mark - state.lands[land.id].mark;
      if (delta > 0.03) lines.push(land.name + ' outlook +' + Math.round(delta * 100) + '%');
    });
    lines.push('Talk outlook ' + Math.round(preview.talk * 100) + '%. Counter-effort outlook ' + Math.round(preview.effort * 100) + '%.');
    const closed = [];
    LINKS.forEach(link => {
      if (linkOpen(state, link)) return;
      const target = [link.a, link.b].map(landById).find(land => land.kind === 'isle');
      if (target && closed.indexOf(target.name) === -1) closed.push(target.name);
    });
    if (closed.length && !owns(state, 'harbors') && !owns(state, 'sky')) lines.push(closed.join(', ') + ' still need Harbor threads or Sky threads. Either one opens a way.');
    lines.push('Outlook, not a promise.');
    return { lines: lines.slice(0, 6), closed };
  }
  function reachable(state) {
    const seen = { hearthlow: true };
    let moved = true;
    while (moved) {
      moved = false;
      LINKS.forEach(link => {
        if (!linkOpen(state, link)) return;
        if (seen[link.a] && !seen[link.b]) { seen[link.b] = true; moved = true; }
        if (seen[link.b] && !seen[link.a]) { seen[link.a] = true; moved = true; }
      });
    }
    return LANDS.filter(land => seen[land.id]).map(land => land.id);
  }
  function restore(raw) {
    if (!raw || raw.version !== 1 || !LANDS.every(land => raw.lands && raw.lands[land.id])) throw new Error('Not an Outbreak Atlas save');
    const next = create({ seed: raw.seed, scenario: raw.scenario, archetype: raw.archetype, pressure: raw.pressure });
    next.rng = raw.rng >>> 0;
    next.month = Math.max(0, Math.floor(raw.month) || 0);
    next.points = Math.max(0, Math.floor(raw.points) || 0);
    next.talk = clamp(Number(raw.talk) || 0);
    next.effort = clamp(Number(raw.effort) || 0);
    next.hearthStreak = Math.max(0, Math.floor(raw.hearthStreak) || 0);
    next.owned = Array.isArray(raw.owned) ? raw.owned.filter(id => upgradeById(id)) : [];
    next.won = raw.won === true;
    next.lost = raw.lost === true && !next.won;
    next.log = Array.isArray(raw.log) ? raw.log.slice(0, 5).map(String) : next.log;
    LANDS.forEach(land => {
      const cell = raw.lands[land.id];
      next.lands[land.id] = { mark: clamp(Number(cell.mark) || 0), foothold: cell.foothold === true, established: cell.established === true };
    });
    return next;
  }
  return { LANDS, LINKS, UPGRADES, SCENARIOS, ARCHETYPES, PRESSURES, create, step, buy, forecast, reachable, restore, linkOpen, establishedCount, landById, upgradeById };
});
