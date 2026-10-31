/* Creekhold — river-colony simulation. Original rules inspired by public city-builder notes.
   No third-party assets, names, or text. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.CreekholdEngine = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const SAVE_KEY = 'study-desk-creekhold-v1';
  const VERSION = 1;

  const BUILDINGS = [
    { id: 'path', name: 'Footpath', cat: 'paths', cost: {}, work: 0.45, walk: true, tier: 0, science: 0, blurb: 'Nibs only raise frames that touch a footpath back to a hearth.' },
    { id: 'stairs', name: 'Step-stair', cat: 'paths', cost: { logs: 2 }, work: 1.4, stairs: true, tier: 0, science: 0, blurb: 'Links a path to the floor just above or below it.' },
    { id: 'platform', name: 'Stick platform', cat: 'paths', cost: { logs: 3, planks: 1 }, work: 2, platform: true, tier: 1, science: 8, blurb: 'A floor over open air. Stack it up to three. Water runs underneath.' },
    { id: 'bridge', name: 'Creek bridge', cat: 'paths', cost: { planks: 4 }, work: 2.2, bridge: true, walk: true, tier: 2, science: 18, blurb: 'A path that can sit over the current without damming it.' },
    { id: 'fill', name: 'Earth fill', cat: 'paths', cost: { logs: 2 }, work: 0, terraform: 1, tier: 2, science: 16, blurb: 'Raise one block of ground. Builders do it from the bank.' },
    { id: 'cracker', name: 'Root cracker', cat: 'paths', cost: { planks: 2, gears: 1 }, work: 0, terraform: -1, tier: 3, science: 30, blurb: 'Lower one block of ground. Useful for a new channel.' },

    { id: 'dam', name: 'Stick dam', cat: 'water', cost: { logs: 4 }, work: 2.2, dam: true, tier: 0, science: 0, blurb: 'Holds the river until it spills over the crest. The pool stays upstream.' },
    { id: 'levee', name: 'Clay levee', cat: 'water', cost: { logs: 3 }, work: 2, levee: true, tier: 0, science: 0, blurb: 'A solid wall. Stack up to four. Water can sit on top like a raised ditch.' },
    { id: 'gate', name: 'Sluice gate', cat: 'water', cost: { logs: 3, planks: 2 }, work: 2.4, gate: true, tier: 1, science: 12, blurb: 'Set the lip. Shut it when the current turns sour.' },
    { id: 'pump', name: 'Paw pump', cat: 'water', cost: { logs: 8 }, work: 2.6, workers: 1, pump: 4.2, tier: 0, science: 0, blurb: 'Draws clean water off a neighbouring tile into the tanks.' },
    { id: 'deep-pump', name: 'Deep draw', cat: 'water', cost: { logs: 6, planks: 4, gears: 1 }, work: 3, workers: 1, pump: 6, deep: true, needsPower: true, demand: 3, faction: 'cog', tier: 3, science: 36, blurb: 'Cog Lodge pump. Reaches a tile further and a shallower pool. Wants power.' },
    { id: 'tank', name: 'Clay tank', cat: 'water', cost: { logs: 6 }, work: 2, tank: 80, tier: 0, science: 0, blurb: 'Stores pumped water for the dry spell. Nibs drink from the store, not the river.' },
    { id: 'cistern', name: 'Reed cistern', cat: 'water', cost: { logs: 4, planks: 8 }, work: 3, tank: 160, tier: 2, science: 22, blurb: 'A larger store. The dry spell drinks this after the clay tanks.' },
    { id: 'filter', name: 'Gravel filter', cat: 'water', cost: { planks: 6, gears: 1 }, work: 3, workers: 1, filter: true, needsPower: true, demand: 3, tier: 3, science: 40, blurb: 'Slowly cleans sour water on neighbouring tiles.' },

    { id: 'wheel', name: 'Paddle wheel', cat: 'power', cost: { logs: 6, planks: 4 }, work: 2.6, wheel: true, tier: 1, science: 14, blurb: 'Turns in a sideways current. Too little water, or a flood over the axle, and it stops.' },
    { id: 'shaft', name: 'Cog shaft', cat: 'power', cost: { planks: 1 }, work: 0.8, shaft: true, tier: 1, science: 14, blurb: 'Carries power to the next tile on the same level.' },
    { id: 'vshaft', name: 'Rising shaft', cat: 'power', cost: { planks: 2, gears: 1 }, work: 1.4, shaft: true, vertical: true, tier: 2, science: 28, blurb: 'Carries power up or down a single step.' },
    { id: 'wind', name: 'Reed fan', cat: 'power', cost: { planks: 8, gears: 1 }, work: 3, power: 9, faction: 'reed', tier: 2, science: 26, blurb: 'Reed Circle wind mill. Keeps turning when the river sleeps.' },
    { id: 'engine', name: 'Log engine', cat: 'power', cost: { planks: 6, gears: 2 }, work: 3, workers: 1, engine: true, demand: 0, faction: 'cog', tier: 2, science: 26, blurb: 'Burns logs for steady power. The Cog Lodge answer to a dry wheel.' },

    { id: 'hearth', name: 'District hearth', cat: 'shelter', cost: { logs: 8 }, work: 3, center: true, walk: true, tier: 0, science: 0, blurb: 'Root of a district. Paths must reach it. Two emergency beds, and a trickle of ideas.' },
    { id: 'lodge', name: 'Family lodge', cat: 'shelter', cost: { logs: 12 }, work: 3, beds: 3, faction: 'reed', tier: 0, science: 0, blurb: 'Three beds. Reed Circle kits arrive only when a bed is spare and the colony is well.' },
    { id: 'bunk', name: 'Cog bunk', cat: 'shelter', cost: { logs: 8, planks: 4 }, work: 3, beds: 6, faction: 'cog', tier: 0, science: 0, blurb: 'Six tight beds. Less comfort than a lodge, more bodies under one roof.' },
    { id: 'vat', name: 'Berry vat', cat: 'shelter', cost: { planks: 6, gears: 1 }, work: 2.6, vat: true, faction: 'cog', tier: 1, science: 18, blurb: 'Spends berries and water to raise a kit, and only if a bunk is free.' },

    { id: 'forager', name: 'Berry round', cat: 'food', cost: { logs: 6 }, work: 2, workers: 1, gather: true, tier: 0, science: 0, blurb: 'Picks ripe bushes nearby. Berries are the plain food nibs eat last.' },
    { id: 'carrots', name: 'Carrot beds', cat: 'food', cost: { logs: 8 }, work: 2.4, workers: 1, farm: 'carrot', tier: 1, science: 10, blurb: 'Needs irrigated, unsour ground. A better meal than berries.' },
    { id: 'spuds', name: 'Tuber terrace', cat: 'food', cost: { logs: 6, planks: 4 }, work: 3, workers: 1, farm: 'spud', tier: 2, science: 24, blurb: 'Slower than carrots, more food when it comes in.' },
    { id: 'kettle', name: 'Kettle hut', cat: 'food', cost: { logs: 4, planks: 6 }, work: 2.6, workers: 1, cook: true, tier: 2, science: 24, blurb: 'Turns a berry and a carrot into two meals. Variety lifts wellbeing.' },
    { id: 'hive', name: 'Reed hive', cat: 'food', cost: { planks: 4 }, work: 2, hive: true, decor: 1, faction: 'reed', tier: 2, science: 20, blurb: 'A little honey over time, and a softer mood. No one has to staff it.' },
    { id: 'grill', name: 'Scrap grill', cat: 'food', cost: { planks: 4, gears: 1 }, work: 2.2, workers: 1, grill: true, faction: 'cog', tier: 2, science: 20, blurb: 'Fries berries into meals. Fast, smoky, not very gentle.' },

    { id: 'lumber', name: 'Timber mark', cat: 'timber', cost: { logs: 4 }, work: 1.6, workers: 1, lumber: true, tier: 0, science: 0, blurb: 'A nib walks to trees inside the mark, chops, and carries logs home.' },
    { id: 'forester', name: 'Sapling yard', cat: 'timber', cost: { logs: 6, planks: 4 }, work: 2.4, workers: 1, forest: true, tier: 2, science: 18, blurb: 'Replants empty stumps nearby so the bend does not go bald.' },
    { id: 'saw', name: 'Hand saw', cat: 'timber', cost: { logs: 8 }, work: 2.2, workers: 1, saw: 0.42, tier: 1, science: 8, blurb: 'One log becomes one plank. Slow, and it needs no shaft.' },
    { id: 'mill', name: 'Power saw', cat: 'timber', cost: { logs: 6, planks: 6, gears: 1 }, work: 3, workers: 1, saw: 1.15, needsPower: true, demand: 6, tier: 2, science: 22, blurb: 'A fast saw. Idle when the shafts are dark.' },
    { id: 'gears', name: 'Gear press', cat: 'timber', cost: { logs: 4, planks: 8 }, work: 3, workers: 1, press: true, needsPower: true, demand: 8, tier: 2, science: 20, blurb: 'Two planks become one gear, if the wheel or the engine is turning.' },
    { id: 'inventor', name: 'Wonder desk', cat: 'timber', cost: { logs: 10, planks: 2 }, work: 2.4, workers: 1, ideas: 1.25, tier: 0, science: 0, blurb: 'Studies the river and files ideas. Spend ideas in the tree.' },
    { id: 'yard', name: 'Log yard', cat: 'timber', cost: { logs: 4 }, work: 1.2, storage: { logs: 100 }, tier: 0, science: 0, blurb: 'Raises how many logs the colony can keep.' },
    { id: 'warehouse', name: 'Plank loft', cat: 'timber', cost: { logs: 4, planks: 6 }, work: 2, storage: { planks: 70, gears: 36 }, tier: 2, science: 16, blurb: 'Room for planks and gears.' },
    { id: 'hauler', name: 'Haul post', cat: 'timber', cost: { logs: 6 }, work: 1.8, workers: 1, hauler: true, tier: 1, science: 10, blurb: 'A nib here lets timber trips carry five logs instead of three.' },
    { id: 'porter', name: 'Clock porter', cat: 'timber', cost: { planks: 4, gears: 2 }, work: 2.4, porter: true, faction: 'cog', tier: 3, science: 34, blurb: 'A clockwork pair of hands. The colony can raise one more frame at a time.' },

    { id: 'lantern', name: 'Lantern ring', cat: 'comfort', cost: { planks: 2 }, work: 1.2, decor: 1, tier: 1, science: 6, blurb: 'A small light. Nearby life feels less thin.' },
    { id: 'fire', name: 'Story fire', cat: 'comfort', cost: { logs: 6 }, work: 1.8, leisure: true, decor: 1, tier: 1, science: 10, blurb: 'Idle nibs sit here and come away brighter.' },
    { id: 'pool', name: 'Splash pool', cat: 'comfort', cost: { logs: 4, planks: 2 }, work: 1.8, leisure: true, decor: 1, tier: 2, science: 16, blurb: 'A clean dip. Lifts the mood of whoever comes by.' },
    { id: 'arch', name: 'Blossom arch', cat: 'comfort', cost: { logs: 2, planks: 3 }, work: 1.6, decor: 2, faction: 'reed', tier: 2, science: 18, blurb: 'Reed Circle ornament. Quiet, and it counts double.' },
    { id: 'bell', name: 'Shift bell', cat: 'comfort', cost: { planks: 4, gears: 1 }, work: 1.6, decor: 2, faction: 'cog', tier: 2, science: 18, blurb: 'Cog Lodge ornament. The day has an edge, and the square looks finished.' }
  ];

  const DEF = {};
  BUILDINGS.forEach(function (b) { DEF[b.id] = b; });

  const CATS = [
    { id: 'paths', name: 'Paths' },
    { id: 'water', name: 'Water' },
    { id: 'power', name: 'Power' },
    { id: 'shelter', name: 'Shelter' },
    { id: 'food', name: 'Food' },
    { id: 'timber', name: 'Timber' },
    { id: 'comfort', name: 'Comfort' }
  ];

  const FACTIONS = {
    reed: { id: 'reed', name: 'Reed Circle', motto: 'Grow slow, store deep, and leave the bend cleaner.', housing: 'lodge' },
    cog: { id: 'cog', name: 'Cog Lodge', motto: 'Cut, count, and keep a wheel turning when the river sleeps.', housing: 'bunk' }
  };

  const RULES = {
    easy: { id: 'easy', name: 'Gentle', wet: 6, dryBase: 3, dryGrow: 1, dryCap: 6, badFrom: 4, food: 50, water: 38, logs: 80, planks: 20, gears: 4, consume: 0.65 },
    normal: { id: 'normal', name: 'Steady', wet: 5, dryBase: 3, dryGrow: 1, dryCap: 8, badFrom: 3, food: 36, water: 22, logs: 56, planks: 10, gears: 0, consume: 1 },
    hard: { id: 'hard', name: 'Harsh', wet: 4, dryBase: 4, dryGrow: 1, dryCap: 10, badFrom: 2, food: 24, water: 12, logs: 40, planks: 0, gears: 0, consume: 1.2 }
  };

  const NAMES = ['Pebble', 'Moss', 'Brindle', 'Cotton', 'Rush', 'Thimble', 'Cedar', 'Pip', 'Sorrel', 'Wick', 'Dapple', 'Brook', 'Fern', 'Cob', 'Quill', 'Maple', 'Twig', 'Hazel', 'Nim', 'Lark', 'Bram', 'Posy', 'Cinder', 'Moth', 'Juniper', 'Puddle', 'Amber', 'Silt', 'Nettle', 'Bramble'];
  const JOB_PRIO = ['pump', 'deep-pump', 'forager', 'lumber', 'filter', 'carrots', 'spuds', 'saw', 'mill', 'engine', 'gears', 'kettle', 'grill', 'inventor', 'forester', 'hauler'];
  const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function grid(w, h, g) {
    const cells = new Array(w * h);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        cells[y * w + x] = {
          x: x, y: y, ground: g, water: 0, bad: 0, flow: 0,
          levee: 0, floors: 0, stair: false,
          source: 0, outlet: false, badSource: 0,
          building: null, tree: null, bush: null, irrig: 0, sour: 0
        };
      }
    }
    return cells;
  }

  function idx(w, x, y) { return y * w + x; }

  function carve(cells, w, x, y, ground, water) {
    const c = cells[idx(w, x, y)];
    if (!c) return;
    c.ground = ground;
    if (water != null) c.water = water;
  }

  function blobTrees(cells, w, list) {
    list.forEach(function (p) {
      const c = cells[idx(w, p[0], p[1])];
      if (c && !c.building) c.tree = { wood: 3, grow: 16 };
    });
  }

  function blobBush(cells, w, list) {
    list.forEach(function (p) {
      const c = cells[idx(w, p[0], p[1])];
      if (c && !c.building) c.bush = { fruit: 4 };
    });
  }

  function mapWillow() {
    const w = 24, h = 18;
    const cells = grid(w, h, 2);
    for (let x = 0; x < w; x++) {
      carve(cells, w, x, 8, 1, 0.15);
      carve(cells, w, x, 9, 0, 0.9);
      carve(cells, w, x, 10, 0, 0.9);
      carve(cells, w, x, 11, 1, 0.15);
    }
    cells[idx(w, 0, 9)].source = 2.8;
    cells[idx(w, 0, 10)].source = 2.8;
    cells[idx(w, w - 1, 9)].outlet = true;
    cells[idx(w, w - 1, 10)].outlet = true;
    blobTrees(cells, w, [[3, 1], [2, 2], [6, 1], [7, 2], [8, 1], [9, 2], [11, 1], [12, 2], [14, 1], [15, 2], [3, 3], [13, 3], [16, 3], [6, 4]]);
    blobBush(cells, w, [[9, 5], [11, 5], [13, 5], [15, 4]]);
    return {
      id: 'willow', name: 'Willow Bend', difficulty: 'A first river',
      blurb: 'One channel, a flat bank, and bushes enough to learn the pump before the water sleeps.',
      hint: 'Lay a path to the bank, pump into a tank, and dam the channel downstream of the pump.',
      w: w, h: h, cells: cells, hx: 5, hy: 3
    };
  }

  function mapSplit() {
    const w = 28, h = 20;
    const cells = grid(w, h, 2);
    function low(x, y) { carve(cells, w, x, y, 0, 0.75); }
    for (let x = 0; x <= 12; x++) { low(x, 10); low(x, 11); }
    for (let y = 6; y <= 11; y++) low(12, y);
    for (let y = 11; y <= 15; y++) low(12, y);
    for (let x = 12; x < w; x++) { low(x, 6); low(x, 7); low(x, 14); low(x, 15); }
    for (let y = 9; y <= 12; y++) for (let x = 14; x <= 23; x++) carve(cells, w, x, y, 3, 0);
    cells[idx(w, 0, 10)].source = 3.6;
    cells[idx(w, 0, 11)].source = 3.6;
    cells[idx(w, w - 1, 6)].outlet = true;
    cells[idx(w, w - 1, 7)].outlet = true;
    cells[idx(w, w - 1, 14)].outlet = true;
    cells[idx(w, w - 1, 15)].outlet = true;
    blobTrees(cells, w, [[16, 9], [18, 9], [20, 9], [17, 12], [19, 12], [22, 10], [15, 8], [21, 8], [15, 4], [22, 4]]);
    blobBush(cells, w, [[17, 8], [20, 8], [18, 4]]);
    return {
      id: 'split', name: 'Split Current', difficulty: 'A fork',
      blurb: 'The river divides around a high island. One arm can be a store; the other should stay a spillway.',
      hint: 'Keep the island above the crest. Dam one arm, and leave the other open so the sour tide has a way past.',
      w: w, h: h, cells: cells, hx: 18, hy: 10
    };
  }

  function mapGorge() {
    const w = 26, h = 22;
    const cells = grid(w, h, 4);
    for (let x = 0; x < w; x++) {
      carve(cells, w, x, 12, 0, 0.7);
      carve(cells, w, x, 13, 0, 0.7);
    }
    for (let y = 9; y <= 10; y++) for (let x = 3; x <= 16; x++) carve(cells, w, x, y, 2, 0);
    for (let y = 5; y <= 8; y++) for (let x = 4; x <= 14; x++) carve(cells, w, x, y, 3, 0);
    for (let x = 6; x <= 10; x++) carve(cells, w, x, 11, 1, 0);
    for (let x = 18; x <= 24; x++) for (let y = 16; y <= 18; y++) carve(cells, w, x, y, 1, 0.2);
    cells[idx(w, 20, 17)].badSource = 2.4;
    cells[idx(w, 0, 12)].source = 3.4;
    cells[idx(w, 0, 13)].source = 3.4;
    cells[idx(w, w - 1, 12)].outlet = true;
    cells[idx(w, w - 1, 13)].outlet = true;
    blobTrees(cells, w, [[5, 6], [7, 6], [10, 6], [12, 7], [6, 8], [11, 5], [9, 9], [14, 6]]);
    blobBush(cells, w, [[6, 7], [12, 8]]);
    return {
      id: 'gorge', name: 'Ash Gorge', difficulty: 'A narrow cut',
      blurb: 'A canyon, a bench, and a sealed sour pocket. Stairs are already cut. The dry spells grow teeth.',
      hint: 'The stair down to the bench is in. Extend the path, store hard, and do not crack into the sour pocket until you mean to.',
      w: w, h: h, cells: cells, hx: 8, hy: 6,
      starters: [
        { id: 'path', x: 8, y: 7 }, { id: 'path', x: 8, y: 8 },
        { id: 'stairs', x: 8, y: 9 }, { id: 'path', x: 8, y: 10 },
        { id: 'stairs', x: 8, y: 11 }, { id: 'path', x: 9, y: 11 }
      ]
    };
  }

  const MAPS = [mapWillow(), mapSplit(), mapGorge()];
  function mapById(id) {
    for (let i = 0; i < MAPS.length; i++) if (MAPS[i].id === id) return MAPS[i];
    return null;
  }

  function get(run, x, y) {
    if (x < 0 || y < 0 || x >= run.w || y >= run.h) return null;
    return run.cells[y * run.w + x];
  }

  function keyOf(x, y) { return x + ',' + y; }

  function neigh(run, cell) {
    const out = [];
    for (let i = 0; i < 4; i++) {
      const n = get(run, cell.x + DIRS[i][0], cell.y + DIRS[i][1]);
      if (n) out.push(n);
    }
    return out;
  }

  function living(run) { return run.nibs.filter(function (n) { return !n.dead; }); }
  function adults(run) { return living(run).filter(function (n) { return !n.kit; }); }

  function foodTotal(run) {
    const s = run.store;
    return s.berry + s.carrot + s.spud + s.meal;
  }

  function eachBuilding(run, fn) {
    for (let i = 0; i < run.cells.length; i++) {
      const c = run.cells[i];
      if (c.building && c.building.progress >= 1 && !c.building.paused) fn(c, DEF[c.building.id]);
    }
  }

  function logCap(run) {
    let n = 90;
    eachBuilding(run, function (c, d) { if (d.storage && d.storage.logs) n += d.storage.logs; });
    return n;
  }
  function plankCap(run) {
    let n = 36;
    eachBuilding(run, function (c, d) { if (d.storage && d.storage.planks) n += d.storage.planks; });
    return n;
  }
  function gearCap(run) {
    let n = 18;
    eachBuilding(run, function (c, d) { if (d.storage && d.storage.gears) n += d.storage.gears; });
    return n;
  }
  function waterCap(run) {
    let n = 50;
    eachBuilding(run, function (c, d) { if (d.tank) n += d.tank; });
    return n;
  }
  function foodCap(run) { return 120; }

  function beds(run) {
    let n = 0;
    eachBuilding(run, function (c, d) {
      if (d.beds) n += d.beds;
      if (d.center) n += 2;
    });
    return n;
  }

  function solidHeight(cell) { return cell.ground + (cell.levee || 0); }

  function lip(cell) {
    const b = cell.building;
    if (!b || b.progress < 1 || b.paused) return -1e9;
    const d = DEF[b.id];
    if (!d) return -1e9;
    if (d.dam) return cell.ground + 1.15;
    if (d.gate) return cell.ground + (b.gate || 0) * 0.55;
    return -1e9;
  }

  function walkZ(cell) {
    return cell.ground + (cell.floors || 0);
  }

  function isNetworkCell(cell) {
    if (cell.floors > 0) return true;
    const b = cell.building;
    if (!b || b.progress < 1) return false;
    const d = DEF[b.id];
    if (!d) return false;
    if (d.walk || d.center || d.stairs || d.platform || d.bridge) return true;
    if (d.levee && b.deck) return true;
    return false;
  }

  function isPlanCell(cell) {
    if (isNetworkCell(cell)) return true;
    const b = cell.building;
    if (!b) return false;
    const d = DEF[b.id];
    return !!(d && (d.walk || d.stairs || d.platform || d.bridge || d.center));
  }

  function flood(run, allow) {
    const net = new Set();
    const q = [];
    for (let i = 0; i < run.cells.length; i++) {
      const c = run.cells[i];
      const b = c.building;
      if (b && b.progress >= 1 && DEF[b.id] && DEF[b.id].center) {
        net.add(keyOf(c.x, c.y));
        q.push(c);
      }
    }
    while (q.length) {
      const c = q.pop();
      const ns = neigh(run, c);
      for (let i = 0; i < ns.length; i++) {
        const n = ns[i];
        const k = keyOf(n.x, n.y);
        if (net.has(k) || !allow(n)) continue;
        const dz = Math.abs(walkZ(c) - walkZ(n));
        const stairish = function (cell) {
          if (!cell) return false;
          if (cell.stair) return true;
          return !!(cell.building && DEF[cell.building.id] && DEF[cell.building.id].stairs);
        };
        if (dz === 0 || (dz >= 1 && dz <= 3 && (stairish(c) || stairish(n)))) {
          net.add(k);
          q.push(n);
        }
      }
    }
    return net;
  }

  function rebuild(run) {
    run.network = flood(run, isNetworkCell);
    run.plan = flood(run, isPlanCell);
    run.netDirty = false;
  }

  function ensureNet(run) { if (run.netDirty || !run.network) rebuild(run); }

  function hydro(def) { return !!(def && (def.dam || def.levee || def.gate || def.terraform || def.wheel)); }

  function hydroLinked(run, x, y, net) {
    const start = get(run, x, y);
    if (!start) return false;
    const seen = new Set([keyOf(x, y)]);
    const q = [start];
    while (q.length) {
      const c = q.pop();
      const ns = neigh(run, c);
      for (let i = 0; i < ns.length; i++) {
        const n = ns[i];
        if (net.has(keyOf(n.x, n.y))) return true;
        const bd = n.building && DEF[n.building.id];
        if (!(bd && (bd.dam || bd.levee || bd.gate))) continue;
        const k = keyOf(n.x, n.y);
        if (seen.has(k)) continue;
        seen.add(k);
        q.push(n);
      }
    }
    return false;
  }

  // True when a planned path touches this tile but sits on a different level,
  // so the honest answer is "add a step-stair" rather than "off the paths".
  function needsStair(run, x, y) {
    const cell = get(run, x, y);
    if (!cell || !run.plan) return false;
    const ns = neigh(run, cell);
    for (let i = 0; i < ns.length; i++) {
      if (!run.plan.has(keyOf(ns[i].x, ns[i].y))) continue;
      const dz = Math.abs(walkZ(ns[i]) - walkZ(cell));
      if (dz >= 1 && dz <= 3) return true;
    }
    return false;
  }

  function reachWith(run, x, y, def, net) {
    const cell = get(run, x, y);
    if (!cell || !net) return false;
    if (hydro(def)) return hydroLinked(run, x, y, net);
    if (net.has(keyOf(x, y)) && (isNetworkCell(cell) || isPlanCell(cell))) return true;
    const target = cell.ground + (cell.floors || 0);
    const ns = neigh(run, cell);
    for (let i = 0; i < ns.length; i++) {
      const n = ns[i];
      if (!net.has(keyOf(n.x, n.y))) continue;
      const dz = Math.abs(walkZ(n) - target);
      if (dz === 0) return true;
      const stair = n.stair || cell.stair || (def && def.stairs) || (n.building && DEF[n.building.id] && DEF[n.building.id].stairs);
      if (dz >= 1 && dz <= 3 && stair) return true;
    }
    return false;
  }

  function canReach(run, x, y, def) {
    ensureNet(run);
    return reachWith(run, x, y, def, run.plan);
  }

  function onFrontier(run, x, y, def) {
    ensureNet(run);
    return reachWith(run, x, y, def, run.network);
  }

  function pushEvent(run, type, x, y) {
    run.events.push({ type: type, x: x || 0, y: y || 0, hour: run.hour });
    if (run.events.length > 40) run.events.shift();
  }

  function pay(run, cost) {
    const keys = Object.keys(cost || {});
    for (let i = 0; i < keys.length; i++) if ((run.store[keys[i]] || 0) < cost[keys[i]]) return false;
    for (let i = 0; i < keys.length; i++) run.store[keys[i]] -= cost[keys[i]];
    return true;
  }

  function refund(run, cost, frac) {
    const keys = Object.keys(cost || {});
    for (let i = 0; i < keys.length; i++) run.store[keys[i]] = (run.store[keys[i]] || 0) + Math.floor((cost[keys[i]] || 0) * frac);
  }

  function onComplete(run, cell) {
    const b = cell.building;
    if (!b) return;
    const d = DEF[b.id];
    b.progress = 1;
    if (d.levee) {
      const push = cell.water;
      cell.water = 0;
      cell.bad = 0;
      cell.levee = b.stackTo || (cell.levee + 1);
      if (push > 0) {
        const ns = neigh(run, cell).filter(function (n) { return !n.outlet; });
        const share = ns.length ? push / ns.length : 0;
        ns.forEach(function (n) { n.water += share; });
      }
    }
    if (d.platform) cell.floors = b.stackTo || (cell.floors + 1);
    if (d.stairs) cell.stair = true;
    run.netDirty = true;
    pushEvent(run, 'raised', cell.x, cell.y);
  }

  function stamp(run, id, x, y) {
    const cell = get(run, x, y);
    const d = DEF[id];
    cell.building = { id: id, progress: 1, gate: d.gate ? 1 : 0, stackTo: d.levee || d.platform ? 1 : 0, acc: 0, paused: false, deck: false };
    onComplete(run, cell);
    return cell;
  }

  function clearJob(run, x, y) {
    const k = keyOf(x, y);
    for (let i = 0; i < run.nibs.length; i++) {
      const n = run.nibs[i];
      if (n.job && n.job.x + ',' + n.job.y === k) { n.job = null; n.mode = 'free'; n.phase = null; }
      if (n.site && n.site.x + ',' + n.site.y === k) { n.site = null; if (n.mode === 'build') n.mode = 'free'; }
    }
  }

  function place(run, id, x, y) {
    const d = DEF[id];
    if (!d) return { ok: false, reason: 'unknown' };
    if (run.phase === 'over') return { ok: false, reason: 'over' };
    const cell = get(run, x, y);
    if (!cell) return { ok: false, reason: 'off-map' };
    if (d.faction && d.faction !== run.faction) return { ok: false, reason: 'other-circle' };
    if (!run.unlocked[id]) return { ok: false, reason: 'locked' };
    ensureNet(run);

    if (d.terraform) {
      if (cell.building) return { ok: false, reason: 'blocked' };
      if (!canReach(run, x, y, d)) return { ok: false, reason: 'unreached' };
      if (d.terraform < 0 && cell.ground <= 0) return { ok: false, reason: 'bedrock' };
      if (d.terraform > 0 && cell.ground >= 6) return { ok: false, reason: 'too-high' };
      if ((cell.water > 0.8 && d.terraform > 0)) return { ok: false, reason: 'wet' };
      if (!pay(run, d.cost)) return { ok: false, reason: 'cost' };
      cell.ground = Math.max(0, Math.min(6, cell.ground + d.terraform));
      pushEvent(run, 'dig', x, y);
      return { ok: true };
    }

    if (d.levee && cell.building && cell.building.id === 'levee' && cell.building.progress >= 1) {
      if (cell.levee >= 4) return { ok: false, reason: 'stack-cap' };
      if (!canReach(run, x, y, d)) return { ok: false, reason: 'unreached' };
      if (!pay(run, d.cost)) return { ok: false, reason: 'cost' };
      cell.building.progress = 0;
      cell.building.stackTo = cell.levee + 1;
      run.netDirty = true;
      return { ok: true };
    }
    if (d.platform && cell.building && cell.building.id === 'platform' && cell.building.progress >= 1) {
      if (cell.floors >= 3) return { ok: false, reason: 'stack-cap' };
      if (!canReach(run, x, y, d)) return { ok: false, reason: 'unreached' };
      if (!pay(run, d.cost)) return { ok: false, reason: 'cost' };
      cell.building.progress = 0;
      cell.building.stackTo = cell.floors + 1;
      return { ok: true };
    }
    if (d.platform && cell.building && cell.building.id === 'levee' && cell.building.progress >= 1 && !cell.building.deck) {
      if (!pay(run, d.cost)) return { ok: false, reason: 'cost' };
      cell.building.deck = true;
      cell.floors = Math.max(cell.floors, cell.levee);
      cell.stair = cell.stair;
      run.netDirty = true;
      pushEvent(run, 'raised', x, y);
      return { ok: true };
    }

    const swapping = cell.building && cell.building.id === 'platform' && cell.building.progress >= 1 && cell.floors > 0 && !d.platform && !d.dam && !d.levee && !d.gate && !d.walk && !d.shaft;
    if (cell.building && !swapping) return { ok: false, reason: 'blocked' };
    if (cell.tree && !d.bridge) return { ok: false, reason: 'tree' };
    if (!d.dam && !d.levee && !d.gate && !d.bridge && !d.wheel && cell.water > 0.22 && !swapping) return { ok: false, reason: 'wet' };
    if (!canReach(run, x, y, d)) return { ok: false, reason: !hydro(d) && needsStair(run, x, y) ? 'step' : 'unreached' };
    if (!pay(run, d.cost)) return { ok: false, reason: 'cost' };
    const keptFloors = swapping ? cell.floors : 0;
    cell.building = {
      id: id, progress: 0, gate: d.gate ? 1 : 0,
      stackTo: d.levee || d.platform ? 1 : 0,
      acc: 0, paused: false, deck: false
    };
    if (swapping) cell.floors = keptFloors;
    if (d.work <= 0) onComplete(run, cell);
    run.netDirty = true;
    return { ok: true };
  }

  function demolish(run, x, y) {
    const cell = get(run, x, y);
    if (!cell || !cell.building) return { ok: false, reason: 'empty' };
    const d = DEF[cell.building.id];
    if (d.center) {
      let centers = 0;
      eachBuilding(run, function (c, def) { if (def.center) centers++; });
      if (centers <= 1 && cell.building.progress >= 1) return { ok: false, reason: 'last-hearth' };
    }
    refund(run, d.cost, cell.building.progress >= 1 ? 0.65 : 0.8);
    if (d.platform || d.levee) cell.floors = 0;
    if (d.levee) cell.levee = 0;
    if (d.stairs) cell.stair = false;
    clearJob(run, x, y);
    cell.building = null;
    run.netDirty = true;
    pushEvent(run, 'fell', x, y);
    return { ok: true };
  }

  function setGate(run, x, y, level) {
    const cell = get(run, x, y);
    if (!cell || !cell.building || !DEF[cell.building.id].gate) return { ok: false, reason: 'not-a-gate' };
    cell.building.gate = Math.max(0, Math.min(3, level | 0));
    return { ok: true, gate: cell.building.gate };
  }

  function setPaused(run, x, y, paused) {
    const cell = get(run, x, y);
    if (!cell || !cell.building) return { ok: false };
    cell.building.paused = !!paused;
    return { ok: true };
  }

  // The idea tree opens tier by tier: tier 2+ needs TIER_GATE studied ideas from the tier below.
  const TIER_GATE = 2;
  function tierProgress(run, tier) {
    let n = 0;
    for (let i = 0; i < BUILDINGS.length; i++) {
      const b = BUILDINGS[i];
      if ((b.tier || 0) !== tier || !b.science) continue;
      if (b.faction && b.faction !== run.faction) continue;
      if (run.unlocked[b.id]) n++;
    }
    return n;
  }
  function tierOpen(run, tier) {
    return tier <= 1 || tierProgress(run, tier - 1) >= TIER_GATE;
  }

  function unlock(run, id) {
    const d = DEF[id];
    if (!d) return { ok: false, reason: 'unknown' };
    if (run.unlocked[id]) return { ok: false, reason: 'known' };
    if (d.faction && d.faction !== run.faction) return { ok: false, reason: 'other-circle' };
    if (!tierOpen(run, d.tier || 0)) return { ok: false, reason: 'tier' };
    const cost = d.science || 0;
    if (run.store.science < cost) return { ok: false, reason: 'ideas' };
    run.store.science -= cost;
    run.unlocked[id] = true;
    pushEvent(run, 'unlock', 0, 0);
    return { ok: true };
  }

  function finishAll(run) {
    for (let i = 0; i < run.cells.length; i++) {
      const c = run.cells[i];
      if (c.building && c.building.progress < 1) onComplete(run, c);
    }
    rebuild(run);
  }

  function addFluid(cell, amt, bad) {
    if (amt <= 0) return;
    const t = cell.water + amt;
    cell.bad = t > 0.0001 ? (cell.bad * cell.water + bad * amt) / t : 0;
    cell.water = t;
  }

  function badtideLevel(run) {
    const len = seasonLenHours(run);
    const h = run.seasonHour;
    const ramp = 12;
    let p;
    if (h < ramp) p = 0.5 + 0.5 * (h / ramp);
    else if (h > len - ramp) p = 0.5 + 0.5 * ((len - h) / ramp);
    else p = 1;
    return Math.max(0.5, Math.min(1, p));
  }

  function hazardDays(run) {
    const r = run.rules;
    return Math.min(r.dryCap, r.dryBase + (run.cycle - 1) * r.dryGrow);
  }

  function seasonLenHours(run) {
    if (run.season === 'temperate') return run.rules.wet * 24;
    return hazardDays(run) * 24;
  }

  function hazardKind(run) {
    if (run.cycle <= 1) return 'drought';
    if (run.cycle >= run.rules.badFrom && run.cycle % 2 === 0) return 'badtide';
    return 'drought';
  }

  function nextHazard(run) {
    if (run.season !== 'temperate') return run.season;
    return hazardKind(run);
  }

  function advanceClock(run, dt) {
    run.hour += dt;
    run.seasonHour += dt;
    const flipped = [];
    let guard = 0;
    while (run.seasonHour >= seasonLenHours(run) && guard++ < 8) {
      run.seasonHour -= seasonLenHours(run);
      if (run.season === 'temperate') {
        run.season = hazardKind(run);
        flipped.push(run.season);
      } else {
        if (run.season === 'drought' && living(run).length >= 4) grant(run, 'dry-lived');
        if (run.season === 'badtide' && living(run).length >= 4) grant(run, 'sour-lived');
        run.season = 'temperate';
        run.cycle += 1;
        flipped.push('temperate');
      }
    }
    if (flipped.length) pushEvent(run, 'season', 0, 0);
  }

  function flowOnce(run) {
    const cells = run.cells;
    const w = run.w, h = run.h;
    for (let i = 0; i < cells.length; i++) {
      const c = cells[i];
      c._s = solidHeight(c) + c.water;
    }
    for (let pass = 0; pass < 4; pass++) {
      const reverse = (pass + (run.flowFlip ? 1 : 0)) % 2 === 1;
      for (let n = 0; n < cells.length; n++) {
        const a = cells[reverse ? cells.length - 1 - n : n];
        for (let d = 0; d < 4; d++) {
          const nx = a.x + DIRS[d][0], ny = a.y + DIRS[d][1];
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          const b = cells[ny * w + nx];
          const barrier = Math.max(lip(a), lip(b));
          const blocked = barrier > -1e8;
          const dest = blocked ? Math.max(b._s, barrier) : b._s;
          if (a._s <= dest + 0.003) continue;
          let mv = (a._s - dest) * 0.48;
          if (mv > a.water) mv = a.water;
          if (mv < 0.0005) continue;
          const badA = a.bad;
          a.water -= mv;
          a._s -= mv;
          const tb = b.water + mv;
          b.bad = tb > 0.0001 ? (b.bad * b.water + badA * mv) / tb : 0;
          b.water = tb;
          b._s += mv;
          a.flow += mv;
          b.flow += mv;
        }
      }
    }
    run.flowFlip = !run.flowFlip;
  }

  function waterStep(run, dt) {
    const subs = dt >= 0.75 ? 3 : 2;
    const hdt = dt / subs;
    for (let s = 0; s < subs; s++) {
      for (let i = 0; i < run.cells.length; i++) run.cells[i].flow = 0;
      for (let i = 0; i < run.cells.length; i++) {
        const c = run.cells[i];
        if (run.season !== 'drought') {
          if (c.source) addFluid(c, c.source * hdt, run.season === 'badtide' ? badtideLevel(run) : 0);
          if (c.badSource) addFluid(c, c.badSource * hdt, 1);
        }
      }
      flowOnce(run);
      const ev = (run.season === 'drought' ? 0.02 : 0.0035) * hdt;
      for (let i = 0; i < run.cells.length; i++) {
        const c = run.cells[i];
        if (c.outlet) {
          c.flow += c.water;
          c.water = 0;
          c.bad = 0;
        } else {
          c.water = Math.max(0, c.water - ev);
          if (c.water < 0.012) { c.water = 0; c.bad = 0; }
          if (c.water > 6) c.water = 6;
        }
      }
    }
    for (let i = 0; i < run.cells.length; i++) run.cells[i].flow /= dt;
  }

  function irrigate(run, dt) {
    const w = run.w, h = run.h;
    const mark = new Uint8Array(run.cells.length);
    const sour = new Uint8Array(run.cells.length);
    for (let i = 0; i < run.cells.length; i++) {
      const c = run.cells[i];
      if (c.water < 0.28) continue;
      const bad = c.bad > 0.52;
      const clean = c.bad < 0.42;
      for (let dy = -3; dy <= 3; dy++) {
        for (let dx = -3; dx <= 3; dx++) {
          if (Math.abs(dx) + Math.abs(dy) > 3) continue;
          const x = c.x + dx, y = c.y + dy;
          if (x < 0 || y < 0 || x >= w || y >= h) continue;
          const j = y * w + x;
          if (bad) sour[j] = 1;
          else if (clean) mark[j] = 1;
        }
      }
    }
    for (let i = 0; i < run.cells.length; i++) {
      const c = run.cells[i];
      if (mark[i]) c.irrig = 36;
      else c.irrig = Math.max(0, (c.irrig || 0) - dt);
      if (sour[i]) c.sour = 16;
      else c.sour = Math.max(0, (c.sour || 0) - dt * 0.5);
    }
  }

  function wellbeing(nib, run) {
    let s = 6;
    if (nib.hunger > 45) s += 14;
    if (nib.thirst > 45) s += 14;
    if (nib.sleep > 40) s += 10;
    if (nib.sheltered) s += 12;
    s += (nib.tasted.berry ? 4 : 0) + (nib.tasted.carrot ? 6 : 0) + (nib.tasted.spud ? 6 : 0) + (nib.tasted.meal ? 8 : 0);
    s += Math.min(14, (run.decor || 0) * 3);
    if (nib.fun > 55) s += 10;
    if (nib.contaminated > 0) s -= 22;
    if (!nib.sheltered && !nib.kit) s -= 6;
    return Math.max(0, Math.min(100, s));
  }

  function avgWell(run) {
    const ns = living(run);
    if (!ns.length) return 0;
    let t = 0;
    for (let i = 0; i < ns.length; i++) t += wellbeing(ns[i], run);
    return t / ns.length;
  }

  function effOf(nib, run) {
    return (0.72 + wellbeing(nib, run) / 220) * (nib.contaminated > 0 ? 0.62 : 1);
  }

  function dist(ax, ay, bx, by) { return Math.hypot(ax - bx, ay - by); }

  function goToward(run, nib, tx, ty, dt) {
    const speed = (5.4 + wellbeing(nib, run) / 70) * (nib.contaminated > 0 ? 0.7 : 1);
    let leftTime = dt;
    let guard = 0;
    while (leftTime > 1e-4 && guard++ < 16) {
      const dx = tx - nib.x, dy = ty - nib.y;
      const left = Math.hypot(dx, dy);
      if (left < 0.08) { nib.x = tx; nib.y = ty; return; }
      if (left <= 7) {
        const step = Math.min(left, speed * leftTime);
        nib.x += dx / left * step;
        nib.y += dy / left * step;
        return;
      }
      ensureNet(run);
      const goal = nearestNet(run, tx, ty);
      const gk = goal ? keyOf(goal.x, goal.y) : '';
      if (!nib.path || nib.pathKey !== gk) {
        const start = nearestNet(run, nib.x, nib.y);
        nib.path = start && goal ? bfs(run, start, goal) : null;
        nib.pathKey = gk;
      }
      if (nib.path && nib.path.length) {
        const p = nib.path[0];
        const pdx = p.x - nib.x, pdy = p.y - nib.y;
        const pd = Math.hypot(pdx, pdy) || 0.0001;
        if (pd < 0.18) { nib.path.shift(); continue; }
        const step = Math.min(pd, speed * leftTime);
        nib.x += pdx / pd * step;
        nib.y += pdy / pd * step;
        leftTime -= step / speed;
        if (Math.hypot(p.x - nib.x, p.y - nib.y) < 0.18) nib.path.shift();
      } else {
        const step = Math.min(left, speed * leftTime);
        nib.x += dx / left * step;
        nib.y += dy / left * step;
        return;
      }
    }
  }

  function nearestNet(run, x, y) {
    ensureNet(run);
    let best = null, bd = 1e9;
    run.network.forEach(function (k) {
      const parts = k.split(',');
      const cx = +parts[0], cy = +parts[1];
      const d = dist(cx, cy, x, y);
      if (d < bd) { bd = d; best = { x: cx, y: cy }; }
    });
    return best;
  }

  function bfs(run, start, goal) {
    const w = run.w;
    const sk = keyOf(start.x, start.y), gk = keyOf(goal.x, goal.y);
    if (sk === gk) return [{ x: goal.x, y: goal.y }];
    const q = [start];
    const prev = new Map();
    prev.set(sk, null);
    let qi = 0;
    while (qi < q.length) {
      const c = q[qi++];
      const cell = get(run, c.x, c.y);
      const ns = cell ? neigh(run, cell) : [];
      for (let i = 0; i < ns.length; i++) {
        const n = ns[i];
        const k = keyOf(n.x, n.y);
        if (prev.has(k) || !run.network.has(k)) continue;
        const dz = cell ? Math.abs(walkZ(cell) - walkZ(n)) : 0;
        const stair = (cell && cell.stair) || n.stair;
        if (!(dz === 0 || (dz === 1 && stair))) continue;
        prev.set(k, c);
        if (k === gk) {
          const path = [];
          let cur = { x: n.x, y: n.y };
          while (cur) {
            path.push(cur);
            const pk = keyOf(cur.x, cur.y);
            const p = prev.get(pk);
            cur = p ? { x: p.x, y: p.y } : null;
            if (p && keyOf(p.x, p.y) === sk) break;
          }
          path.reverse();
          return path;
        }
        q.push(n);
      }
    }
    return null;
  }

  function standFor(run, cell) {
    ensureNet(run);
    let best = null, score = -1e9;
    const ns = neigh(run, cell);
    for (let i = 0; i < ns.length; i++) {
      const n = ns[i];
      if (!run.network.has(keyOf(n.x, n.y))) continue;
      const s = 10 - Math.abs(walkZ(n) - cell.ground);
      if (s > score) { score = s; best = n; }
    }
    return best || cell;
  }

  function nearestOf(run, nib, pred) {
    let best = null, bd = 1e9;
    for (let i = 0; i < run.cells.length; i++) {
      const c = run.cells[i];
      if (!c.building || c.building.progress < 1) continue;
      if (!pred(c, DEF[c.building.id])) continue;
      const d = dist(nib.x, nib.y, c.x, c.y);
      if (d < bd) { bd = d; best = c; }
    }
    return best;
  }

  function hourOf(run) { return ((run.hour % 24) + 24) % 24; }
  function isNight(run) { const h = hourOf(run); return h >= 20 || h < 5; }

  function decayNib(run, nib, dt) {
    const k = (nib.kit ? 0.55 : 1) * run.rules.consume;
    nib.thirst = Math.max(0, nib.thirst - 2.85 * k * dt);
    nib.hunger = Math.max(0, nib.hunger - 2.35 * k * dt);
    if (nib.mode === 'sleep') {
      /* restored while sleeping */
    } else {
      nib.sleep = Math.max(0, nib.sleep - 4.6 * dt);
    }
    nib.fun = Math.max(0, nib.fun - 0.45 * dt);
    if (nib.thirst <= 0) nib.thirstDry += dt; else nib.thirstDry = 0;
    if (nib.hunger <= 0) nib.hungerDry += dt; else nib.hungerDry = 0;
    if (nib.contaminated > 0) nib.contaminated = Math.max(0, nib.contaminated - 0.22 * dt);
    const under = get(run, Math.round(nib.x), Math.round(nib.y));
    if (under && under.water > 0.35 && under.bad > 0.55) nib.contaminated = Math.max(nib.contaminated, 10);
    nib.ageHours += dt;
    if (nib.kit) {
      nib.grow += dt * (0.85 + wellbeing(nib, run) / 180);
      if (nib.grow >= 96) {
        nib.kit = false;
        nib.grow = 0;
        pushEvent(run, 'grown', nib.x, nib.y);
      }
    } else if (nib.ageHours > nib.lifeHours) {
      kill(run, nib, 'age');
      return;
    }
    if (nib.thirstDry > 18) kill(run, nib, 'thirst');
    else if (nib.hungerDry > 26) kill(run, nib, 'hunger');
  }

  function kill(run, nib, why) {
    if (nib.dead) return;
    nib.dead = true;
    nib.why = why;
    run.deaths++;
    pushEvent(run, 'died', nib.x, nib.y);
    if (!living(run).length) {
      run.phase = 'over';
      run.overWhy = why;
      noteBest(run);
    }
  }

  function steer(run) {
    if (run.phase === 'over') return;
    const maxB = 3 + (run.porter ? 1 : 0);
    const people = adults(run);
    for (let i = 0; i < people.length; i++) {
      const nib = people[i];
      if (nib.thirst < 34 && run.store.water >= 1) { nib.mode = 'drink'; nib.phase = null; continue; }
      if (nib.hunger < 30 && foodTotal(run) >= 1) { nib.mode = 'eat'; nib.phase = null; continue; }
      if (isNight(run) || nib.sleep < 16) { nib.mode = 'sleep'; continue; }
      if (nib.mode === 'build' && nib.site) {
        const c = get(run, nib.site.x, nib.site.y);
        if (c && c.building && c.building.progress < 1) continue;
        nib.site = null;
        nib.mode = 'free';
      }
      if (nib.mode === 'work' && nib.job) {
        const c = get(run, nib.job.x, nib.job.y);
        if (c && c.building && c.building.progress >= 1 && !c.building.paused && DEF[c.building.id].workers) continue;
        nib.job = null;
        nib.mode = 'free';
        nib.phase = null;
      }
      if (nib.mode === 'leisure') continue;
      if (nib.mode !== 'build' && nib.mode !== 'work') nib.mode = 'free';
    }
    ensureNet(run);
    const sites = [];
    for (let i = 0; i < run.cells.length; i++) {
      const c = run.cells[i];
      if (!c.building || c.building.progress >= 1) continue;
      if (onFrontier(run, c.x, c.y, DEF[c.building.id])) sites.push(c);
    }
    sites.sort(function (a, b) {
      const pa = JOB_PRIO.indexOf(a.building.id);
      const pb = JOB_PRIO.indexOf(b.building.id);
      const sa = a.building.id === 'path' || a.building.id === 'stairs' ? -2 : (pa < 0 ? 5 : pa);
      const sb = b.building.id === 'path' || b.building.id === 'stairs' ? -2 : (pb < 0 ? 5 : pb);
      return sa - sb;
    });
    let building = people.filter(function (n) { return n.mode === 'build'; }).length;
    const free = people.filter(function (n) { return n.mode === 'free'; });
    let fi = 0;
    for (let s = 0; s < sites.length && fi < free.length && building < maxB; s++) {
      const taken = people.some(function (n) { return n.mode === 'build' && n.site && n.site.x === sites[s].x && n.site.y === sites[s].y; });
      if (taken) continue;
      free[fi].mode = 'build';
      free[fi].site = { x: sites[s].x, y: sites[s].y };
      free[fi].phase = null;
      fi++;
      building++;
    }
    const takenJobs = {};
    people.forEach(function (n) {
      if (n.mode === 'work' && n.job) takenJobs[n.job.x + ',' + n.job.y] = true;
    });
    const jobs = [];
    for (let p = 0; p < JOB_PRIO.length; p++) {
      const id = JOB_PRIO[p];
      for (let i = 0; i < run.cells.length; i++) {
        const c = run.cells[i];
        if (!c.building || c.building.id !== id || c.building.progress < 1 || c.building.paused) continue;
        if (takenJobs[keyOf(c.x, c.y)]) continue;
        if (!onFrontier(run, c.x, c.y, DEF[id])) continue;
        jobs.push(c);
      }
    }
    const still = people.filter(function (n) { return n.mode === 'free'; });
    for (let i = 0; i < still.length && i < jobs.length; i++) {
      still[i].mode = 'work';
      still[i].job = { x: jobs[i].x, y: jobs[i].y };
      still[i].phase = null;
    }
    const idle = people.filter(function (n) { return n.mode === 'free' && n.fun < 48; });
    if (idle.length) {
      const fun = [];
      eachBuilding(run, function (c, d) { if (d.leisure) fun.push(c); });
      if (fun.length) {
        idle[0].mode = 'leisure';
        idle[0].job = { x: fun[0].x, y: fun[0].y };
      }
    }
  }

  function stepBuild(run, nib, dt) {
    const cell = nib.site && get(run, nib.site.x, nib.site.y);
    if (!cell || !cell.building || cell.building.progress >= 1) { nib.mode = 'free'; nib.site = null; return; }
    const stand = standFor(run, cell);
    goToward(run, nib, stand.x, stand.y, dt);
    if (dist(nib.x, nib.y, stand.x, stand.y) < 0.65) {
      const work = DEF[cell.building.id].work || 1;
      cell.building.progress = Math.min(1, cell.building.progress + dt / work);
      if (cell.building.progress >= 1) {
        onComplete(run, cell);
        nib.mode = 'free';
        nib.site = null;
      }
    }
  }

  function stepDrink(run, nib, dt) {
    const spot = nearestOf(run, nib, function (c, d) { return d.pump || d.tank || d.center || d.deep; });
    if (!spot || run.store.water < 1) { nib.mode = 'free'; return; }
    goToward(run, nib, spot.x, spot.y, dt);
    if (dist(nib.x, nib.y, spot.x, spot.y) < 0.7) {
      nib.timer += dt;
      if (nib.timer >= 0.22) {
        if (run.store.water >= 1) {
          run.store.water -= 1;
          nib.thirst = 100;
          nib.thirstDry = 0;
          pushEvent(run, 'drink', spot.x, spot.y);
        }
        nib.timer = 0;
        nib.mode = 'free';
      }
    }
  }

  function takeFood(run, nib) {
    const order = ['meal', 'carrot', 'spud', 'berry'];
    for (let i = 0; i < order.length; i++) {
      const k = order[i];
      if (run.store[k] >= 1) {
        run.store[k] -= 1;
        nib.tasted[k] = 1;
        return true;
      }
    }
    return false;
  }

  function stepEat(run, nib, dt) {
    const spot = nearestOf(run, nib, function (c, d) {
      return d.gather || d.farm || d.cook || d.grill || d.center || d.beds;
    });
    if (!spot || foodTotal(run) < 1) { nib.mode = 'free'; return; }
    goToward(run, nib, spot.x, spot.y, dt);
    if (dist(nib.x, nib.y, spot.x, spot.y) < 0.7) {
      nib.timer += dt;
      if (nib.timer >= 0.22) {
        if (takeFood(run, nib)) {
          nib.hunger = 100;
          nib.hungerDry = 0;
          pushEvent(run, 'eat', spot.x, spot.y);
        }
        nib.timer = 0;
        nib.mode = 'free';
      }
    }
  }

  function stepSleep(run, nib, dt) {
    const spot = nearestOf(run, nib, function (c, d) { return d.beds || d.center; });
    if (!spot) {
      nib.sleep = Math.min(100, nib.sleep + 6 * dt);
      nib.sheltered = false;
      if (!isNight(run) && nib.sleep > 60) nib.mode = 'free';
      return;
    }
    goToward(run, nib, spot.x, spot.y, dt);
    if (dist(nib.x, nib.y, spot.x, spot.y) < 0.75) {
      nib.sleep = Math.min(100, nib.sleep + 14 * dt);
      nib.sheltered = true;
      if (DEF[spot.building.id].center && nib.contaminated > 0) nib.contaminated = Math.max(0, nib.contaminated - dt);
      if (!isNight(run) && nib.sleep > 72) nib.mode = 'free';
    }
  }

  function stepLeisure(run, nib, dt) {
    if (!nib.job) { nib.mode = 'free'; return; }
    goToward(run, nib, nib.job.x, nib.job.y, dt);
    if (dist(nib.x, nib.y, nib.job.x, nib.job.y) < 0.6) {
      nib.timer += dt;
      nib.fun = Math.min(100, nib.fun + 28 * dt);
      if (nib.timer > 1.2 || nib.fun >= 100) {
        nib.timer = 0;
        nib.mode = 'free';
        nib.job = null;
      }
    }
  }

  function stepLumber(run, nib, dt, post) {
    if (!nib.phase) nib.phase = 'seek';
    if (nib.phase === 'seek') {
      let best = null, bd = 1e9;
      for (let i = 0; i < run.cells.length; i++) {
        const c = run.cells[i];
        if (!c.tree || c.tree.wood <= 0) continue;
        const d = dist(c.x, c.y, post.x, post.y);
        if (d > 4.4 || d >= bd) continue;
        best = c; bd = d;
      }
      if (!best) { goToward(run, nib, post.x, post.y, dt); return; }
      nib.tx = best.x; nib.ty = best.y;
      nib.phase = 'go';
    }
    if (nib.phase === 'go') {
      goToward(run, nib, nib.tx, nib.ty, dt);
      if (dist(nib.x, nib.y, nib.tx, nib.ty) < 0.28) { nib.phase = 'chop'; nib.timer = 1.05; }
    } else if (nib.phase === 'chop') {
      const tree = get(run, nib.tx, nib.ty);
      if (!tree || !tree.tree || tree.tree.wood <= 0) { nib.phase = 'seek'; return; }
      nib.timer -= dt;
      if (nib.timer <= 0) {
        tree.tree.wood -= 1;
        if (tree.tree.wood <= 0) { tree.tree.wood = 0; tree.tree.grow = 0; }
        nib.carry = run.haulerBoost ? 5 : 3;
        nib.phase = 'back';
        pushEvent(run, 'chop', tree.x, tree.y);
      }
    } else if (nib.phase === 'back') {
      goToward(run, nib, post.x, post.y, dt);
      if (dist(nib.x, nib.y, post.x, post.y) < 0.4) {
        const room = logCap(run) - run.store.logs;
        const put = Math.max(0, Math.min(room, nib.carry || 0));
        run.store.logs += put;
        nib.carry = 0;
        nib.phase = 'seek';
      }
    }
  }

  function produce(run, cell, nib, dt) {
    const d = DEF[cell.building.id];
    const b = cell.building;
    const e = effOf(nib, run);
    const power = powerAt(run, cell);
    if (d.needsPower && power <= 0.05) return;
    const scale = d.needsPower ? power : 1;
    if (d.pump) {
      let src = null, best = -1;
      const reach = d.deep ? 2 : 1;
      for (let dy = -reach; dy <= reach; dy++) {
        for (let dx = -reach; dx <= reach; dx++) {
          if (Math.abs(dx) + Math.abs(dy) > reach || (dx === 0 && dy === 0)) continue;
          const n = get(run, cell.x + dx, cell.y + dy);
          if (!n) continue;
          const minD = d.deep ? 0.08 : 0.22;
          if (n.water < minD || n.bad > 0.45) continue;
          if (n.water > best) { best = n.water; src = n; }
        }
      }
      if (!src) return;
      const room = waterCap(run) - run.store.water;
      const amt = Math.max(0, Math.min(src.water * 0.5, d.pump * dt * e * scale, room));
      if (amt > 0) {
        src.water -= amt;
        run.store.water += amt;
      }
      return;
    }
    if (d.gather) {
      let fruit = 0;
      const bushes = [];
      for (let i = 0; i < run.cells.length; i++) {
        const c = run.cells[i];
        if (!c.bush || c.sour > 0) continue;
        if (dist(c.x, c.y, cell.x, cell.y) <= 4.2 && c.bush.fruit > 0) {
          fruit += c.bush.fruit;
          bushes.push(c);
        }
      }
      if (fruit <= 0) return;
      const room = foodCap(run) - foodTotal(run);
      let amt = Math.min(1.7 * dt * e, fruit, Math.max(0, room));
      run.store.berry += amt;
      for (let i = 0; i < bushes.length && amt > 0; i++) {
        const take = Math.min(bushes[i].bush.fruit, amt);
        bushes[i].bush.fruit -= take;
        amt -= take;
      }
      return;
    }
    if (d.farm) {
      if (cell.irrig <= 0 || cell.sour > 0 || cell.water > 0.45) return;
      b.acc += dt * e;
      const need = d.farm === 'spud' ? 20 : 13;
      if (b.acc >= need && foodTotal(run) < foodCap(run)) {
        b.acc = 0;
        const key = d.farm === 'spud' ? 'spud' : 'carrot';
        run.store[key] += d.farm === 'spud' ? 4 : 3;
        pushEvent(run, 'harvest', cell.x, cell.y);
      }
      return;
    }
    if (d.cook) {
      b.acc += dt * e;
      if (b.acc >= 4 && run.store.berry >= 1 && run.store.carrot >= 1 && foodTotal(run) + 2 <= foodCap(run) + 1) {
        b.acc = 0;
        run.store.berry -= 1;
        run.store.carrot -= 1;
        run.store.meal += 2;
      }
      return;
    }
    if (d.grill) {
      b.acc += dt * e;
      if (b.acc >= 3 && run.store.berry >= 1 && foodTotal(run) < foodCap(run)) {
        b.acc = 0;
        run.store.berry -= 1;
        run.store.meal += 1;
      }
      return;
    }
    if (d.saw) {
      b.acc += dt * d.saw * e * scale;
      if (b.acc >= 1 && run.store.logs >= 1 && run.store.planks < plankCap(run)) {
        b.acc -= 1;
        run.store.logs -= 1;
        run.store.planks += 1;
        pushEvent(run, 'saw', cell.x, cell.y);
      }
      return;
    }
    if (d.press) {
      b.acc += dt * e * scale;
      if (b.acc >= 3 && run.store.planks >= 2 && run.store.gears < gearCap(run)) {
        b.acc = 0;
        run.store.planks -= 2;
        run.store.gears += 1;
        grant(run, 'gear');
        pushEvent(run, 'gear', cell.x, cell.y);
      }
      return;
    }
    if (d.ideas) {
      run.store.science += d.ideas * dt * e;
      return;
    }
    if (d.filter) {
      const ns = neigh(run, cell);
      for (let i = 0; i < ns.length; i++) {
        if (ns[i].water > 0.15 && ns[i].bad > 0) {
          ns[i].bad = Math.max(0, ns[i].bad - 0.35 * dt * e * scale);
          if (ns[i].bad < 0.08) grant(run, 'filtered');
        }
      }
      return;
    }
    if (d.engine) {
      b.acc += dt;
      if (b.acc >= 1) {
        if (run.store.logs >= 1) { run.store.logs -= 1; b.acc = 0; b.fueled = 4; }
        else { b.acc = 1; b.fueled = 0; }
      }
    }
  }

  function stepWork(run, nib, dt) {
    const cell = nib.job && get(run, nib.job.x, nib.job.y);
    if (!cell || !cell.building || cell.building.progress < 1 || cell.building.paused) {
      nib.mode = 'free'; nib.job = null; return;
    }
    const d = DEF[cell.building.id];
    if (d.lumber) { stepLumber(run, nib, dt, cell); return; }
    goToward(run, nib, cell.x, cell.y, dt);
    if (dist(nib.x, nib.y, cell.x, cell.y) < 0.85) produce(run, cell, nib, dt);
  }

  function act(run, nib, dt) {
    if (nib.dead) return;
    if (nib.mode === 'drink') stepDrink(run, nib, dt);
    else if (nib.mode === 'eat') stepEat(run, nib, dt);
    else if (nib.mode === 'sleep') stepSleep(run, nib, dt);
    else if (nib.mode === 'build') stepBuild(run, nib, dt);
    else if (nib.mode === 'work') stepWork(run, nib, dt);
    else if (nib.mode === 'leisure') stepLeisure(run, nib, dt);
  }

  function growPlants(run, dt) {
    const foresters = [];
    eachBuilding(run, function (c, d) {
      if (!d.forest) return;
      const staffed = adults(run).some(function (n) { return n.mode === 'work' && n.job && n.job.x === c.x && n.job.y === c.y; });
      if (staffed) foresters.push(c);
    });
    for (let i = 0; i < run.cells.length; i++) {
      const c = run.cells[i];
      if (c.tree && c.tree.wood <= 0 && c.sour <= 0) {
        let rate = 0.1;
        for (let f = 0; f < foresters.length; f++) if (dist(foresters[f].x, foresters[f].y, c.x, c.y) < 5) rate = 0.8;
        c.tree.grow += rate * dt;
        if (c.tree.grow >= 18) { c.tree.wood = 3; c.tree.grow = 18; }
      }
      if (c.bush) {
        if (c.sour > 0) c.bush.fruit = Math.max(0, c.bush.fruit - 0.4 * dt);
        else if (c.bush.fruit < 4) c.bush.fruit += (c.irrig > 0 ? 0.22 : 0.12) * dt;
      }
    }
  }

  function passive(run, dt) {
    run.decor = 0;
    run.porter = false;
    run.haulerBoost = false;
    eachBuilding(run, function (c, d) {
      if (d.decor) run.decor += d.decor;
      if (d.center) run.store.science += 0.18 * dt;
      if (d.hive && foodTotal(run) < foodCap(run)) run.store.meal += 0.12 * dt;
      if (d.porter) run.porter = true;
    });
    run.haulerBoost = adults(run).some(function (n) {
      if (n.mode !== 'work' || !n.job) return false;
      const c = get(run, n.job.x, n.job.y);
      return c && c.building && DEF[c.building.id].hauler;
    });
  }

  function powerGraph(run) {
    const powered = {};
    const nodes = [];
    for (let i = 0; i < run.cells.length; i++) {
      const c = run.cells[i];
      if (!c.building || c.building.progress < 1 || c.building.paused) continue;
      const d = DEF[c.building.id];
      if (d.shaft || d.wheel || d.power || d.engine || d.needsPower) nodes.push(c);
    }
    const seen = new Set();
    function supplyOf(c) {
      const d = DEF[c.building.id];
      if (d.wheel) {
        if (c.water < 0.14 || c.water > 1.25) return 0;
        const p = Math.min(16, c.flow * 7.5);
        if (p > 1) grant(run, 'wheel');
        return p;
      }
      if (d.power) {
        const gust = 0.82 + 0.18 * Math.sin(run.hour * 0.35);
        return d.power * gust;
      }
      if (d.engine && c.building.fueled > 0) return 12;
      return 0;
    }
    function demandOf(c) {
      const d = DEF[c.building.id];
      return d.needsPower ? (d.demand || 4) : 0;
    }
    for (let i = 0; i < nodes.length; i++) {
      const start = nodes[i];
      const sk = keyOf(start.x, start.y);
      if (seen.has(sk)) continue;
      const comp = [];
      const q = [start];
      seen.add(sk);
      while (q.length) {
        const c = q.pop();
        comp.push(c);
        const ns = neigh(run, c);
        for (let k = 0; k < ns.length; k++) {
          const n = ns[k];
          if (!n.building || n.building.progress < 1) continue;
          const nd = DEF[n.building.id];
          if (!(nd.shaft || nd.wheel || nd.power || nd.engine || nd.needsPower)) continue;
          const dz = Math.abs(walkZ(c) - walkZ(n));
          const vertical = (c.building && DEF[c.building.id].vertical) || nd.vertical;
          if (dz > 1) continue;
          if (dz === 1 && !vertical) continue;
          const nk = keyOf(n.x, n.y);
          if (seen.has(nk)) continue;
          seen.add(nk);
          q.push(n);
        }
      }
      let supply = 0, demand = 0;
      for (let k = 0; k < comp.length; k++) {
        supply += supplyOf(comp[k]);
        demand += demandOf(comp[k]);
      }
      const frac = demand <= 0.01 ? (supply > 0 ? 1 : 0) : Math.max(0, Math.min(1, supply / demand));
      for (let k = 0; k < comp.length; k++) powered[keyOf(comp[k].x, comp[k].y)] = frac;
    }
    run.powered = powered;
  }

  function powerAt(run, cell) {
    if (!run.powered) return 0;
    return run.powered[keyOf(cell.x, cell.y)] || 0;
  }

  function breed(run, dt) {
    if (run.phase === 'over') return;
    const pop = living(run).length;
    if (pop >= 28) return;
    const spare = beds(run) - pop;
    const well = avgWell(run);
    if (run.faction === 'reed') {
      run.breedAcc += dt;
      if (run.breedAcc >= 34 && spare >= 1 && foodTotal(run) > 14 && run.store.water > 12 && well >= 48) {
        run.breedAcc = 0;
        giveBirth(run);
      }
    } else {
      eachBuilding(run, function (c, d) {
        if (!d.vat || spare < 1) return;
        c.building.acc += dt;
        if (c.building.acc >= 26 && run.store.berry >= 2 && run.store.water >= 1 && well >= 40 && foodTotal(run) > 10) {
          c.building.acc = 0;
          run.store.berry -= 2;
          run.store.water -= 1;
          giveBirth(run);
        }
      });
    }
  }

  function giveBirth(run) {
    const hearth = findHearth(run);
    const nib = makeNib(run, true, hearth ? hearth.x : run.hx, hearth ? hearth.y : run.hy);
    run.nibs.push(nib);
    run.born++;
    pushEvent(run, 'born', nib.x, nib.y);
  }

  function findHearth(run) {
    for (let i = 0; i < run.cells.length; i++) {
      const c = run.cells[i];
      if (c.building && c.building.progress >= 1 && DEF[c.building.id].center) return c;
    }
    return null;
  }

  function makeNib(run, kit, x, y) {
    run.nextId++;
    const rng = run.rng;
    const life = (48 + Math.floor((rng ? rng() : 0.3) * 8)) * 24;
    return {
      id: run.nextId,
      name: NAMES[run.nextId % NAMES.length],
      x: x, y: y,
      kit: !!kit,
      grow: 0,
      ageHours: kit ? 0 : life * (0.12 + (rng ? rng() : 0.2) * 0.32),
      lifeHours: life,
      thirst: kit ? 90 : 78,
      hunger: kit ? 90 : 82,
      sleep: 76,
      fun: 40,
      thirstDry: 0,
      hungerDry: 0,
      contaminated: 0,
      sheltered: true,
      tasted: { berry: 0, carrot: 0, spud: 0, meal: 0 },
      mode: 'free',
      job: null,
      site: null,
      phase: null,
      path: null,
      pathKey: '',
      timer: 0,
      carry: 0,
      tx: 0, ty: 0,
      dead: false
    };
  }

  const ACHIEVE = [
    { id: 'dam', name: 'First stick dam', text: 'The current paused for you.' },
    { id: 'wheel', name: 'Wheel in the water', text: 'A paddle wheel took the current.' },
    { id: 'dry-lived', name: 'Through the dry spell', text: 'The colony was still here when the river returned.' },
    { id: 'sour-lived', name: 'Sour and standing', text: 'A sour tide passed and nibs were still at the hearth.' },
    { id: 'gear', name: 'First gear', text: 'Two planks left the press as a gear.' },
    { id: 'dozen', name: 'A full dozen', text: 'Twelve nibs under your roofs.' },
    { id: 'crowd', name: 'A loud bend', text: 'Twenty-four nibs. The path is busy.' },
    { id: 'scholar', name: 'Margin notes', text: 'Eighty ideas on the desk.' },
    { id: 'stacked', name: 'Three high', text: 'The colony left the ground.' },
    { id: 'content', name: 'Easy shoulders', text: 'Wellbeing held at seventy.' },
    { id: 'both-circles', name: 'Both circles', text: 'You have kept a Reed hearth and a Cog hall.' },
    { id: 'three-bends', name: 'Three bends', text: 'Willow, Split, and Ash have all seen a hearth.' },
    { id: 'second-hearth', name: 'Second hearth', text: 'Another district root is lit.' },
    { id: 'full-tank', name: 'Tanks heavy', text: 'More than a hundred water was put away.' },
    { id: 'filtered', name: 'Gravel did the work', text: 'Sour water came off a neighbour tile.' }
  ];

  function grant(run, id) {
    if (!run.meta) return;
    if (run.meta.achievements[id]) return;
    run.meta.achievements[id] = { hour: Math.round(run.hour), map: run.mapId };
    run.freshAchieve = id;
    pushEvent(run, 'achieve', 0, 0);
  }

  function review(run) {
    if (!run.meta) return;
    let hearths = 0, maxF = 0, maxL = 0, anyDam = false;
    for (let i = 0; i < run.cells.length; i++) {
      const c = run.cells[i];
      if (c.floors > maxF) maxF = c.floors;
      if (c.levee > maxL) maxL = c.levee;
      if (!c.building || c.building.progress < 1) continue;
      const d = DEF[c.building.id];
      if (d.center) hearths++;
      if (d.dam) anyDam = true;
    }
    if (anyDam) grant(run, 'dam');
    if (living(run).length >= 12) grant(run, 'dozen');
    if (living(run).length >= 24) grant(run, 'crowd');
    if (run.store.science >= 80) grant(run, 'scholar');
    if (maxF >= 3 || maxL >= 3) grant(run, 'stacked');
    if (avgWell(run) >= 70 && living(run).length >= 6) grant(run, 'content');
    if (hearths >= 2) grant(run, 'second-hearth');
    if (run.store.water >= 100) grant(run, 'full-tank');
    const seenM = run.meta.seenMaps || {};
    if (seenM.willow && seenM.split && seenM.gorge) grant(run, 'three-bends');
    const seenF = run.meta.seenFactions || {};
    if (seenF.reed && seenF.cog) grant(run, 'both-circles');
  }

  function noteBest(run) {
    if (!run.meta) return;
    const key = run.mapId + ':' + run.faction + ':' + run.difficulty;
    const prev = run.meta.best[key] || { days: 0, pop: 0 };
    const days = Math.floor(run.hour / 24);
    const pop = Math.max(prev.pop, run.peak || 0, living(run).length);
    run.meta.best[key] = { days: Math.max(prev.days, days), pop: pop };
  }

  function alerts(run) {
    const out = [];
    const left = Math.max(0, seasonLenHours(run) - run.seasonHour);
    if (run.phase === 'over') out.push('The hearth is dark');
    else if (run.season === 'temperate' && left < 28) {
      out.push(nextHazard(run) === 'badtide' ? 'Sour tide within a day' : 'Dry spell within a day');
    } else if (run.season === 'drought') out.push('Dry spell — sources are still');
    else if (run.season === 'badtide') out.push('Sour tide — keep it out of the tanks');
    if (run.store.water < 8) out.push('Stored water is low');
    if (foodTotal(run) < 8) out.push('The larder is thin');
    if (living(run).some(function (n) { return n.thirst < 18 && !n.kit; })) out.push('A nib is parched');
    if (living(run).some(function (n) { return n.contaminated > 2; })) out.push('A nib waded in sour water');
    let off = 0;
    ensureNet(run);
    for (let i = 0; i < run.cells.length; i++) {
      const c = run.cells[i];
      if (c.building && c.building.progress < 1 && !canReach(run, c.x, c.y, DEF[c.building.id])) off++;
    }
    if (off) out.push(off + ' frame' + (off > 1 ? 's are' : ' is') + ' off the paths');
    return out.slice(0, 4);
  }

  function tickHour(run, dt) {
    advanceClock(run, dt);
    ensureNet(run);
    waterStep(run, dt);
    irrigate(run, dt);
    if (run.phase !== 'over') {
      const people = living(run);
      for (let i = 0; i < people.length; i++) decayNib(run, people[i], dt);
      if (run.phase !== 'over') {
        passive(run, dt);
        growPlants(run, dt);
        steer(run);
        const now = living(run);
        for (let i = 0; i < now.length; i++) act(run, now[i], dt);
        powerGraph(run);
        breed(run, dt);
        eachBuilding(run, function (c) { if (c.building.fueled > 0) c.building.fueled = Math.max(0, c.building.fueled - dt); });
      }
    } else {
      powerGraph(run);
    }
    const pop = living(run).length;
    if (pop > (run.peak || 0)) run.peak = pop;
    review(run);
    if (Math.floor(run.hour) !== Math.floor(run.hour - dt)) noteBest(run);
    run.nibs = run.nibs.filter(function (n) { return !n.dead; });
  }

  function tick(run, hours) {
    let left = Math.max(0, hours || 0);
    let guard = 0;
    while (left > 1e-6 && guard++ < 10000) {
      const step = Math.min(left, 1);
      tickHour(run, step);
      left -= step;
    }
    return run;
  }

  function startingUnlocks(faction) {
    const u = {};
    BUILDINGS.forEach(function (b) {
      if (b.faction && b.faction !== faction) return;
      if (!b.science) u[b.id] = true;
    });
    return u;
  }

  function createMeta() {
    return {
      achievements: {},
      best: {},
      seenMaps: {},
      seenFactions: {},
      tutorial: false,
      settings: { sound: true, volume: 0.7, motion: true, edge: true }
    };
  }

  function startRun(meta, mapId, factionId, difficulty) {
    const map = mapById(mapId);
    const rules = RULES[difficulty] || RULES.easy;
    const faction = factionId === 'cog' ? 'cog' : 'reed';
    if (!map) return null;
    const run = {
      v: VERSION,
      mapId: map.id,
      mapName: map.name,
      blurb: map.blurb,
      hint: map.hint,
      faction: faction,
      difficulty: rules.id,
      rules: {
        wet: rules.wet, dryBase: rules.dryBase, dryGrow: rules.dryGrow,
        dryCap: rules.dryCap, badFrom: rules.badFrom, consume: rules.consume
      },
      w: map.w,
      h: map.h,
      cells: map.cells.map(function (c) {
        return {
          x: c.x, y: c.y, ground: c.ground, water: c.water, bad: c.bad || 0, flow: 0,
          levee: 0, floors: 0, stair: false,
          source: c.source || 0, outlet: !!c.outlet, badSource: c.badSource || 0,
          building: null,
          tree: c.tree ? { wood: c.tree.wood, grow: c.tree.grow } : null,
          bush: c.bush ? { fruit: c.bush.fruit } : null,
          irrig: 0, sour: 0
        };
      }),
      hx: map.hx, hy: map.hy,
      hour: 6,
      season: 'temperate',
      seasonHour: 6,
      cycle: 1,
      store: {
        logs: rules.logs, planks: rules.planks, gears: rules.gears,
        water: rules.water, science: 0,
        berry: rules.food, carrot: 0, spud: 0, meal: 0
      },
      unlocked: startingUnlocks(faction),
      nibs: [],
      nextId: 0,
      deaths: 0,
      born: 0,
      peak: 8,
      phase: 'play',
      overWhy: '',
      events: [],
      network: null,
      netDirty: true,
      powered: {},
      flowFlip: false,
      breedAcc: 0,
      decor: 0,
      porter: false,
      haulerBoost: false,
      seed: map.id.length * 17 + rules.id.length * 3,
      meta: meta || null,
      freshAchieve: ''
    };
    run.rng = mulberry32(run.seed + 99);
    stamp(run, 'hearth', map.hx, map.hy);
    if (faction === 'reed') {
      stamp(run, 'lodge', map.hx - 1, map.hy - 1);
      stamp(run, 'lodge', map.hx + 1, map.hy - 1);
    } else {
      stamp(run, 'bunk', map.hx + 1, map.hy);
    }
    if (map.starters) {
      for (let i = 0; i < map.starters.length; i++) stamp(run, map.starters[i].id, map.starters[i].x, map.starters[i].y);
    }
    // A short path off the hearth so the first player path has a clear join.
    if (!get(run, map.hx, map.hy + 1).building) stamp(run, 'path', map.hx, map.hy + 1);
    rebuild(run);
    for (let i = 0; i < 8; i++) run.nibs.push(makeNib(run, false, map.hx, map.hy));
    if (meta) {
      meta.seenMaps = meta.seenMaps || {};
      meta.seenFactions = meta.seenFactions || {};
      meta.seenMaps[map.id] = true;
      meta.seenFactions[faction] = true;
      review(run);
    }
    return run;
  }

  function snapshot(run) {
    return {
      hour: Math.round(run.hour * 10) / 10,
      day: Math.floor(run.hour / 24) + 1,
      clock: Math.floor(hourOf(run)),
      season: run.season,
      cycle: run.cycle,
      pop: living(run).length,
      deaths: run.deaths,
      water: Math.round(run.store.water),
      food: Math.round(foodTotal(run)),
      logs: run.store.logs,
      phase: run.phase,
      overWhy: run.overWhy || ''
    };
  }

  function totalWater(run) {
    let t = 0;
    for (let i = 0; i < run.cells.length; i++) t += run.cells[i].water;
    return t;
  }

  function cellInfo(run, x, y) {
    const c = get(run, x, y);
    if (!c) return null;
    ensureNet(run);
    const d = c.building ? DEF[c.building.id] : null;
    return {
      x: x, y: y, ground: c.ground, water: c.water, bad: c.bad, flow: c.flow,
      irrig: c.irrig, sour: c.sour, levee: c.levee, floors: c.floors,
      linked: run.network.has(keyOf(x, y)) || canReach(run, x, y, d || { walk: true }),
      power: run.powered ? (run.powered[keyOf(x, y)] || 0) : 0,
      building: c.building ? { id: c.building.id, name: d.name, progress: c.building.progress, gate: c.building.gate, paused: c.building.paused } : null,
      tree: c.tree, bush: c.bush
    };
  }

  function exportRun(run) {
    return {
      mapId: run.mapId, faction: run.faction, difficulty: run.difficulty,
      hour: run.hour, season: run.season, seasonHour: run.seasonHour, cycle: run.cycle,
      deaths: run.deaths, born: run.born, peak: run.peak, phase: run.phase, overWhy: run.overWhy || '',
      breedAcc: run.breedAcc, seed: run.seed, nextId: run.nextId,
      store: run.store, unlocked: run.unlocked,
      nibs: run.nibs.filter(function (n) { return !n.dead; }).map(function (n) {
        return {
          id: n.id, name: n.name, x: n.x, y: n.y, kit: n.kit, grow: n.grow,
          ageHours: n.ageHours, lifeHours: n.lifeHours,
          thirst: n.thirst, hunger: n.hunger, sleep: n.sleep, fun: n.fun,
          thirstDry: n.thirstDry, hungerDry: n.hungerDry, contaminated: n.contaminated,
          sheltered: n.sheltered, tasted: n.tasted, mode: 'free'
        };
      }),
      cells: run.cells.map(function (c) {
        return {
          g: c.ground, w: Math.round(c.water * 1000) / 1000, b: Math.round((c.bad || 0) * 1000) / 1000,
          L: c.levee || 0, F: c.floors || 0, S: c.stair ? 1 : 0,
          src: c.source || 0, out: c.outlet ? 1 : 0, badSrc: c.badSource || 0,
          tree: c.tree ? [c.tree.wood, Math.round(c.tree.grow * 10) / 10] : 0,
          bush: c.bush ? Math.round(c.bush.fruit * 100) / 100 : 0,
          irrig: Math.round(c.irrig || 0), sour: Math.round(c.sour || 0),
          bld: c.building ? [c.building.id, Math.round(c.building.progress * 1000) / 1000, c.building.gate || 0, c.building.stackTo || 0, c.building.paused ? 1 : 0, c.building.deck ? 1 : 0, Math.round((c.building.acc || 0) * 100) / 100, c.building.fueled || 0] : 0
        };
      })
    };
  }

  function importRun(data, meta) {
    if (!data || !data.mapId || !mapById(data.mapId)) return null;
    const rules = RULES[data.difficulty] || RULES.easy;
    const map = mapById(data.mapId);
    const run = startRun(meta || createMeta(), data.mapId, data.faction, data.difficulty);
    run.hour = data.hour;
    run.season = data.season;
    run.seasonHour = data.seasonHour;
    run.cycle = data.cycle;
    run.deaths = data.deaths || 0;
    run.born = data.born || 0;
    run.peak = data.peak || 0;
    run.phase = data.phase || 'play';
    run.overWhy = data.overWhy || '';
    run.breedAcc = data.breedAcc || 0;
    run.seed = data.seed || run.seed;
    run.nextId = data.nextId || run.nextId;
    run.store = data.store;
    run.unlocked = data.unlocked;
    run.rng = mulberry32((data.seed || 1) + 5);
    run.cells = data.cells.map(function (c, i) {
      const x = i % map.w, y = (i / map.w) | 0;
      const bld = c.bld ? {
        id: c.bld[0], progress: c.bld[1], gate: c.bld[2], stackTo: c.bld[3],
        paused: !!c.bld[4], deck: !!c.bld[5], acc: c.bld[6] || 0, fueled: c.bld[7] || 0
      } : null;
      return {
        x: x, y: y, ground: c.g, water: c.w, bad: c.b || 0, flow: 0,
        levee: c.L || 0, floors: c.F || 0, stair: !!c.S,
        source: c.src || 0, outlet: !!c.out, badSource: c.badSrc || 0,
        building: bld,
        tree: c.tree ? { wood: c.tree[0], grow: c.tree[1] } : null,
        bush: c.bush ? { fruit: c.bush } : null,
        irrig: c.irrig || 0, sour: c.sour || 0
      };
    });
    run.w = map.w;
    run.h = map.h;
    run.nibs = (data.nibs || []).map(function (n) {
      n.dead = false;
      n.mode = 'free';
      n.job = null;
      n.site = null;
      n.phase = null;
      n.path = null;
      n.timer = 0;
      n.carry = 0;
      return n;
    });
    run.meta = meta || run.meta;
    run.netDirty = true;
    rebuild(run);
    return run;
  }

  function encode(payload) {
    const meta = payload.meta || createMeta();
    const copy = {
      achievements: meta.achievements || {},
      best: meta.best || {},
      seenMaps: meta.seenMaps || {},
      seenFactions: meta.seenFactions || {},
      tutorial: !!meta.tutorial,
      settings: meta.settings || { sound: true, volume: 0.7, motion: true, edge: true }
    };
    return JSON.stringify({ v: VERSION, meta: copy, run: payload.run ? exportRun(payload.run) : null });
  }

  function decode(raw) {
    try {
      const o = JSON.parse(raw);
      if (!o || o.v !== VERSION || !o.meta) return { ok: false };
      const meta = o.meta;
      if (!meta.achievements || !meta.settings) return { ok: false };
      let run = null;
      if (o.run) {
        run = importRun(o.run, meta);
        if (!run) return { ok: false };
      }
      return { ok: true, meta: meta, run: run };
    } catch (err) {
      return { ok: false };
    }
  }

  function seasonLabel(run) {
    if (run.season === 'drought') return 'Dry spell';
    if (run.season === 'badtide') return 'Sour tide';
    return 'Clear water';
  }

  function clockLabel(run) {
    const h = Math.floor(hourOf(run));
    const m = Math.floor((hourOf(run) - h) * 60);
    return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
  }

  return {
    SAVE_KEY: SAVE_KEY,
    VERSION: VERSION,
    BUILDINGS: BUILDINGS,
    DEF: DEF,
    CATS: CATS,
    FACTIONS: FACTIONS,
    RULES: RULES,
    MAPS: MAPS,
    ACHIEVE: ACHIEVE,
    createMeta: createMeta,
    startRun: startRun,
    tick: tick,
    place: place,
    demolish: demolish,
    setGate: setGate,
    setPaused: setPaused,
    unlock: unlock, tierOpen: tierOpen, tierProgress: tierProgress, TIER_GATE: TIER_GATE,
    finishAll: finishAll,
    living: living,
    adults: adults,
    foodTotal: foodTotal,
    waterCap: waterCap,
    beds: beds,
    totalWater: totalWater,
    snapshot: snapshot,
    alerts: alerts,
    wellbeing: wellbeing,
    avgWell: avgWell,
    cellInfo: cellInfo,
    get: get,
    seasonLabel: seasonLabel,
    clockLabel: clockLabel,
    nextHazard: nextHazard,
    seasonLenHours: seasonLenHours,
    hazardDays: hazardDays,
    powerAt: powerAt,
    walkZ: walkZ,
    solidHeight: solidHeight,
    encode: encode,
    decode: decode,
    exportRun: exportRun,
    canReach: canReach,
    rebuild: rebuild
  };
});
