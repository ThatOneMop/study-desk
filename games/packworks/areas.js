/* Packworks shelf rules. Meadow is open first. Later shelves open from
   collection goals, not from a price hike. Old saves keep any shelf they
   already pulled a card from. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.PackworksAreas = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const SETS = ['Meadow', 'Midnight', 'Deep Sea', 'Clockwork', 'Cosmos', 'Wildwood'];
  const REWARDS = [0, 80, 180, 420, 800, 1500];
  const BLURBS = [
    '',
    'Midnight unlatches. Night cards join the packs.',
    'The Deep Sea case opens.',
    'Clockwork starts ticking on the shelf.',
    'Cosmos spills into the booster.',
    'Wildwood is the last sealed drawer.'
  ];

  function key(id, variant) { return id + ':' + variant; }
  function clampArea(n) { n = Math.floor(Number(n) || 0); return Math.max(0, Math.min(SETS.length - 1, n)); }
  function typesIn(seen, setIndex) {
    let count = 0;
    for (let card = 0; card < 20; card++) {
      const id = setIndex * 20 + card;
      for (let variant = 0; variant < 5; variant++) if (seen && seen[key(id, variant)]) { count++; break; }
    }
    return count;
  }
  function setComplete(seen, setIndex) { return typesIn(seen, setIndex) >= 20; }
  function completedSets(seen, limit) {
    let count = 0;
    for (let i = 0; i < limit; i++) if (setComplete(seen, i)) count++;
    return count;
  }
  function bestVariant(seen, limitSets) {
    let best = -1;
    const limit = Math.min(SETS.length, limitSets) * 20;
    for (let id = 0; id < limit; id++) for (let variant = 0; variant < 5; variant++) if (seen && seen[key(id, variant)]) best = Math.max(best, variant);
    return best;
  }
  function highestSeen(seen) {
    let highest = 0;
    if (!seen) return 0;
    for (const raw of Object.keys(seen)) {
      if (!seen[raw]) continue;
      const id = Math.floor(Number(String(raw).split(':')[0]));
      if (id >= 0 && id < SETS.length * 20) highest = Math.max(highest, Math.floor(id / 20));
    }
    return highest;
  }
  function linesFor(target, seen, opened) {
    if (target === 1) return [
      { done: typesIn(seen, 0) >= 10, text: 'Meadow cards ' + typesIn(seen, 0) + '/10' },
      { done: opened >= 4, text: 'Packs opened ' + Math.min(opened, 4) + '/4' }
    ];
    if (target === 2) return [
      { done: setComplete(seen, 0), text: 'Finish the Meadow set ' + typesIn(seen, 0) + '/20' },
      { done: typesIn(seen, 1) >= 8, text: 'Midnight cards ' + typesIn(seen, 1) + '/8' }
    ];
    if (target === 3) return [
      { done: setComplete(seen, 1), text: 'Finish the Midnight set ' + typesIn(seen, 1) + '/20' },
      { done: typesIn(seen, 2) >= 8, text: 'Deep Sea cards ' + typesIn(seen, 2) + '/8' }
    ];
    if (target === 4) return [
      { done: typesIn(seen, 3) >= 12, text: 'Clockwork cards ' + typesIn(seen, 3) + '/12' },
      { done: bestVariant(seen, 4) >= 3, text: bestVariant(seen, 4) >= 3 ? 'A Starlit or Mythic card is in the book' : 'Find a Starlit or Mythic card' }
    ];
    if (target === 5) return [
      { done: completedSets(seen, 4) >= 3, text: 'Three finished sets ' + completedSets(seen, 4) + '/3' },
      { done: typesIn(seen, 4) >= 10, text: 'Cosmos cards ' + typesIn(seen, 4) + '/10' }
    ];
    return [];
  }
  function canOpen(target, seen, opened) {
    if (target <= 0) return true;
    if (target >= SETS.length) return false;
    return linesFor(target, seen, opened).every(line => line.done);
  }
  function freshShelves(before, save) {
    const next = reconcile(save);
    const start = clampArea(before);
    const gained = [];
    for (let area = start + 1; area <= next; area++) gained.push(area);
    return { area: next, gained };
  }
  function reconcile(save) {
    const seen = save && save.seen || {};
    const opened = Math.max(0, Math.floor(Number(save && save.opened) || 0));
    const stored = save && Number.isInteger(save.areas) ? clampArea(save.areas) : 0;
    let area = Math.max(stored, highestSeen(seen));
    while (area < SETS.length - 1 && canOpen(area + 1, seen, opened)) area++;
    return area;
  }
  function status(area, seen, opened) {
    area = clampArea(area);
    if (area >= SETS.length - 1) return { title: 'All six shelves are open', lines: [{ done: true, text: 'Hunt the variants you still lack.' }], sealed: null };
    const lines = linesFor(area + 1, seen, opened);
    return { title: 'Sealed shelf: ' + SETS[area + 1], lines, sealed: SETS[area + 1] };
  }
  function rollId(area, seen, random) {
    const open = clampArea(area) + 1;
    const newest = open - 1;
    const previousDone = newest === 0 || setComplete(seen, newest - 1);
    let set = 0;
    const roll = random();
    if (open === 1) set = 0;
    else if (!previousDone && roll < 0.62) set = newest - 1;
    else if (roll < 0.78) set = newest;
    else set = Math.floor(random() * open);
    return set * 20 + Math.floor(random() * 20);
  }
  function openNames(area) { return SETS.slice(0, clampArea(area) + 1); }

  return { SETS, REWARDS, BLURBS, typesIn, setComplete, completedSets, highestSeen, linesFor, canOpen, reconcile, freshShelves, status, rollId, openNames, clampArea };
});
