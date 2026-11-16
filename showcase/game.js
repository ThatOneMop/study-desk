/* Bellows Gate — one evening of original forge-yard defence. No catalogue, no save. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.BellowsGate = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const PATH = [
    { x: 70, y: 118 },
    { x: 310, y: 118 },
    { x: 310, y: 248 },
    { x: 118, y: 248 },
    { x: 118, y: 412 },
    { x: 470, y: 412 },
    { x: 470, y: 186 },
    { x: 790, y: 186 },
    { x: 790, y: 468 },
    { x: 548, y: 508 }
  ];
  const HEARTH = { x: 548, y: 508 };
  const PADS = [
    { id: 'a', x: 186, y: 64 },
    { id: 'b', x: 392, y: 168 },
    { id: 'c', x: 214, y: 318 },
    { id: 'd', x: 250, y: 478 },
    { id: 'e', x: 390, y: 332 },
    { id: 'f', x: 578, y: 250 },
    { id: 'g', x: 690, y: 112 },
    { id: 'h', x: 678, y: 392 }
  ];
  const TOOLS = {
    fan: { id: 'fan', name: 'Puff fan', cost: 40, range: 96, every: 0.32, damage: 8, splash: 0, slow: 0, slowFor: 0, blurb: 'A quick huff. Cheap, and fond of sootlings.' },
    quench: { id: 'quench', name: 'Quench bucket', cost: 55, range: 84, every: 0.85, damage: 7, splash: 54, slow: 0.5, slowFor: 1.35, blurb: 'A cool splash. Clumps forget how to hurry.' },
    hammer: { id: 'hammer', name: 'Trip hammer', cost: 70, range: 122, every: 1.05, damage: 36, splash: 0, slow: 0, slowFor: 0, blurb: 'One patient bonk. Clinkers mind it.' }
  };
  const KINDS = {
    soot: { name: 'Sootling', hp: 30, speed: 132, reward: 8, leak: 1 },
    clinker: { name: 'Clinker', hp: 128, speed: 90, reward: 15, leak: 1 },
    coal: { name: 'Night Coal', hp: 460, speed: 64, reward: 36, leak: 3 }
  };
  const WAVES = [
    [{ kind: 'soot', n: 6, every: 0.62 }],
    [{ kind: 'soot', n: 8, every: 0.48 }],
    [{ kind: 'soot', n: 4, every: 0.45 }, { kind: 'clinker', n: 3, every: 0.95 }],
    [{ kind: 'clinker', n: 6, every: 0.7 }],
    [{ kind: 'soot', n: 8, every: 0.36 }, { kind: 'clinker', n: 4, every: 0.8 }],
    [{ kind: 'coal', n: 1, every: 1 }, { kind: 'soot', n: 6, every: 0.42 }]
  ];

  function hypot(a, b) { return Math.hypot(a, b); }
  function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }

  const SEG = [];
  let PATH_LEN = 0;
  for (let i = 1; i < PATH.length; i++) {
    const len = dist(PATH[i - 1], PATH[i]);
    SEG.push({ a: PATH[i - 1], b: PATH[i], len, start: PATH_LEN });
    PATH_LEN += len;
  }

  function along(d) {
    if (d >= PATH_LEN) return { x: HEARTH.x, y: HEARTH.y, done: true, angle: 0 };
    for (const seg of SEG) {
      if (d <= seg.start + seg.len) {
        const t = seg.len ? (d - seg.start) / seg.len : 0;
        return {
          x: seg.a.x + (seg.b.x - seg.a.x) * t,
          y: seg.a.y + (seg.b.y - seg.a.y) * t,
          angle: Math.atan2(seg.b.y - seg.a.y, seg.b.x - seg.a.x),
          done: false
        };
      }
    }
    return { x: HEARTH.x, y: HEARTH.y, done: true, angle: 0 };
  }

  function schedule(index) {
    const list = [];
    let t = 0.35;
    for (const group of WAVES[index]) {
      for (let i = 0; i < group.n; i++) {
        list.push({ t, kind: group.kind });
        t += group.every;
      }
      t += 0.25;
    }
    return list;
  }

  function create() {
    return {
      sparks: 155,
      embers: 10,
      wave: 0,
      time: 0,
      phase: 'ready',
      breath: 0,
      selected: 'fan',
      towers: [],
      creeps: [],
      flashes: [],
      pops: [],
      queue: [],
      nextId: 1,
      sent: 0,
      downed: 0,
      leaked: 0,
      note: 'Pick a tool, tap a stone, then open the gate.'
    };
  }

  function start(state) {
    if (state.phase !== 'ready' && state.phase !== 'win' && state.phase !== 'lose') return state;
    const fresh = create();
    fresh.selected = state.selected || 'fan';
    fresh.phase = 'build';
    fresh.note = 'The yard is quiet. Three tools. One hearth.';
    Object.assign(state, fresh);
    return state;
  }

  function select(state, tool) {
    if (!TOOLS[tool]) return { ok: false, reason: 'Unknown tool.' };
    state.selected = tool;
    return { ok: true };
  }

  function padById(id) { return PADS.find(p => p.id === id) || null; }

  function place(state, padId, toolId) {
    if (state.phase === 'ready' || state.phase === 'win' || state.phase === 'lose') {
      return { ok: false, reason: 'The gate is not open for building.' };
    }
    const tool = TOOLS[toolId || state.selected];
    const pad = padById(padId);
    if (!tool || !pad) return { ok: false, reason: 'That stone is not in the yard.' };
    if (state.towers.some(t => t.pad === pad.id)) return { ok: false, reason: 'Something already stands there.' };
    if (state.sparks < tool.cost) return { ok: false, reason: 'Not enough sparks for a ' + tool.name.toLowerCase() + '.' };
    state.sparks -= tool.cost;
    state.towers.push({
      id: 't' + state.nextId++,
      pad: pad.id,
      tool: tool.id,
      x: pad.x,
      y: pad.y,
      cool: 0.15,
      swing: 0
    });
    state.note = tool.name + ' set. The soot has opinions about this.';
    return { ok: true };
  }

  function openGate(state) {
    if (state.phase !== 'build') return { ok: false, reason: 'The gate is already open.' };
    beginWave(state, 0);
    if (!state.towers.length) state.note = 'Nothing on the stones. Bold, and brief.';
    return { ok: true };
  }

  function beginWave(state, index) {
    state.wave = index + 1;
    state.phase = 'fight';
    state.queue = schedule(index);
    state.sent = 0;
    state.note = 'Wave ' + state.wave + ' of ' + WAVES.length + '.';
  }

  function nearest(tower, creeps, range) {
    const spec = TOOLS[tower.tool];
    let best = null;
    let bestD = range == null ? spec.range : range;
    for (const creep of creeps) {
      if (creep.dead) continue;
      const d = dist(tower, creep);
      if (d <= bestD) { bestD = d; best = creep; }
    }
    return best;
  }

  function hurt(state, creep, amount) {
    if (creep.dead) return;
    creep.hp -= amount;
    if (creep.hp > 0) return;
    state.sparks += KINDS[creep.kind].reward;
    state.downed += 1;
    state.pops.push({ x: creep.x, y: creep.y, life: 0.45, text: '+' + KINDS[creep.kind].reward });
    creep.dead = true;
  }

  function tick(state, dt) {
    dt = Math.max(0, Math.min(0.05, dt || 0));
    if (!state || state.phase === 'ready' || state.phase === 'win' || state.phase === 'lose' || state.phase === 'build') {
      for (const tower of state.towers || []) tower.swing *= Math.pow(0.02, dt);
      return state;
    }
    state.time += dt;
    if (state.phase === 'breath') {
      state.breath -= dt;
      for (const tower of state.towers) tower.swing *= Math.pow(0.05, dt);
      if (state.breath <= 0) beginWave(state, state.wave);
      return state;
    }

    while (state.queue.length && state.queue[0].t <= state.sent) {
      const job = state.queue.shift();
      const kind = KINDS[job.kind];
      const at = along(0);
      state.creeps.push({
        id: 'c' + state.nextId++,
        kind: job.kind,
        hp: kind.hp,
        max: kind.hp,
        dist: 0,
        x: at.x,
        y: at.y,
        slow: 1,
        slowT: 0,
        angle: 0
      });
    }
    state.sent += dt;

    for (const tower of state.towers) {
      tower.cool -= dt;
      tower.swing = Math.max(0, tower.swing - dt * 1.6);
      const spec = TOOLS[tower.tool];
      if (tower.cool > 0) continue;
      const target = nearest(tower, state.creeps, spec.range);
      if (!target) continue;
      tower.cool = spec.every;
      tower.swing = 1;
      state.flashes.push({ x: tower.x, y: tower.y, tx: target.x, ty: target.y, tool: tower.tool, life: 0.18, splash: spec.splash });
      if (spec.splash) {
        for (const creep of state.creeps) {
          if (dist(target, creep) <= spec.splash) {
            hurt(state, creep, spec.damage);
            if (spec.slow) { creep.slow = spec.slow; creep.slowT = spec.slowFor; }
          }
        }
      } else hurt(state, target, spec.damage);
    }

    for (const creep of state.creeps) {
      if (creep.dead) continue;
      if (creep.slowT > 0) creep.slowT -= dt;
      else creep.slow = 1;
      const kind = KINDS[creep.kind];
      creep.dist += kind.speed * (creep.slowT > 0 ? creep.slow : 1) * dt;
      const at = along(creep.dist);
      creep.x = at.x;
      creep.y = at.y;
      creep.angle = at.angle;
      if (at.done) {
        creep.dead = true;
        creep.leaked = true;
        state.embers -= kind.leak;
        state.leaked += kind.leak;
        state.note = kind.name + ' reached the hearth.';
      }
    }
    state.creeps = state.creeps.filter(c => !c.dead);
    state.flashes = state.flashes.filter(f => (f.life -= dt) > 0);
    state.pops = state.pops.filter(p => (p.life -= dt) > 0);

    if (state.embers <= 0) {
      state.embers = 0;
      state.phase = 'lose';
      state.note = 'The hearth went dark.';
      return state;
    }
    if (!state.queue.length && !state.creeps.length) {
      if (state.wave >= WAVES.length) {
        state.phase = 'win';
        state.note = 'The yard kept its glow.';
      } else {
        state.phase = 'breath';
        state.breath = 2.4;
        state.note = 'A breath. Spend sparks before the next knock.';
      }
    }
    return state;
  }

  return {
    PATH, PADS, HEARTH, TOOLS, KINDS, WAVES, PATH_LEN,
    create, start, select, place, openGate, tick, along
  };
});
