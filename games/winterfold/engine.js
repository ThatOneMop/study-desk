/* Winterfold — original trail-map resort sim. No third-party assets or borrowed names. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.WinterfoldEngine = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const SAVE_KEY = 'study-desk-winterfold-v1';
  const MAP_W = 1000, MAP_H = 700, SNAP = 34, DAY_LEN = 80;
  const OPEN_H = 7.5, CLOSE_H = 18;
  const RANK = { trail: 0, green: 1, blue: 2, red: 3, black: 4 };
  const COLOURS = ['trail', 'green', 'blue', 'red', 'black'];
  const LIFT_TYPES = {
    tow: { id: 'tow', name: 'Ski lift', cost: 1, seats: 4, speed: 22, max: 190, ground: true },
    chair: { id: 'chair', name: 'Chair', cost: 1, seats: 8, speed: 34, max: 360, ground: false },
    cabin: { id: 'cabin', name: 'Cabin', cost: 2, seats: 16, speed: 48, max: 620, ground: false }
  };
  const PISTE_SPEED = { trail: 20, green: 32, blue: 44, red: 58, black: 72 };
  const KINDS = ['station', 'summit', 'viewpoint', 'rescue', 'snowpark', 'cafe', 'restaurant', 'refuge'];

  const MOUNTAINS = [
    {
      id: 'lark', name: 'Lark Basin', region: 'A short folded hill',
      blurb: 'One honest fall line, then a few new places. Learn the colours before the queues do.',
      difficulty: 'Gentle', diamonds: 1, medals: [4, 7, 10], unlock: null,
      seed: 11, snowLine: 0, treeLow: 14, treeHigh: 70, treeAt: 0.55, rough: 5, base: 12,
      peaks: [
        { x: 0.42, y: 0.62, h: 8, s: 0.42 },
        { x: 0.42, y: 0.46, h: 24, s: 0.24 },
        { x: 0.66, y: 0.48, h: 30, s: 0.11 }
      ],
      glades: [
        { x1: 420, y1: 560, x2: 520, y2: 390, w: 46 },
        { x1: 520, y1: 400, x2: 650, y2: 330, w: 34 }
      ],
      rocks: [{ x: 250, y: 300, r: 28 }],
      rivers: [], cliffs: [], fences: [],
      demand: d => 10 + (d - 1) * 4, skill: 0,
      pois: [
        { id: 'st', kind: 'station', x: 420, y: 545 },
        { id: 'su', kind: 'summit', x: 520, y: 400 }
      ],
      later: [
        { day: 2, poi: { id: 'view', kind: 'viewpoint', x: 640, y: 340 } },
        { day: 3, poi: { id: 'cafe', kind: 'cafe', x: 400, y: 470 } },
        { day: 4, poi: { id: 'rescue', kind: 'rescue', x: 480, y: 480 } },
        { day: 5, poi: { id: 'refuge', kind: 'refuge', x: 700, y: 400 } },
        { day: 6, poi: { id: 'park', kind: 'snowpark', x: 600, y: 470 } },
        { day: 8, poi: { id: 'st2', kind: 'station', x: 250, y: 560 } }
      ]
    },
    {
      id: 'copper', name: 'Copper Comb', region: 'Two ridges and a dry creek',
      blurb: 'The snow stops halfway down. A cannon, or a long way round.',
      difficulty: 'Varied', diamonds: 2, medals: [6, 9, 12], unlock: { mountain: 'lark', days: 4 },
      seed: 27, snowLine: 36, treeLow: 36, treeHigh: 140, treeAt: 0.52, rough: 8, base: 20,
      peaks: [
        { x: 0.30, y: 0.30, h: 90, s: 0.24 },
        { x: 0.68, y: 0.28, h: 74, s: 0.22 },
        { x: 0.48, y: 0.72, h: 18, s: 0.30 }
      ],
      glades: [{ x1: 380, y1: 560, x2: 340, y2: 400, w: 48 }],
      rocks: [{ x: 560, y: 360, r: 34 }, { x: 180, y: 420, r: 22 }],
      rivers: [], cliffs: [{ x: 470, y: 390, r: 30 }], fences: [],
      demand: d => 12 + (d - 1) * 5, skill: 0,
      pois: [
        { id: 'st', kind: 'station', x: 380, y: 540 },
        { id: 'su', kind: 'summit', x: 340, y: 420 }
      ],
      later: [
        { day: 2, poi: { id: 'su2', kind: 'summit', x: 680, y: 240 } },
        { day: 3, poi: { id: 'cafe', kind: 'cafe', x: 560, y: 640 } },
        { day: 4, poi: { id: 'view', kind: 'viewpoint', x: 520, y: 300 } },
        { day: 5, poi: { id: 'rescue', kind: 'rescue', x: 180, y: 420 } },
        { day: 7, poi: { id: 'refuge', kind: 'refuge', x: 640, y: 420 } }
      ]
    },
    {
      id: 'glass', name: 'Glass Saddle', region: 'A river under a long ridge',
      blurb: 'The river cuts the hill in two. Rescue fills up if you forget the way out.',
      difficulty: 'Serious', diamonds: 3, medals: [7, 10, 14], unlock: { mountain: 'copper', days: 6 },
      seed: 41, snowLine: 20, treeLow: 40, treeHigh: 200, treeAt: 0.52, rough: 10, base: 30,
      peaks: [
        { x: 0.25, y: 0.32, h: 80, s: 0.20 },
        { x: 0.72, y: 0.30, h: 96, s: 0.22 },
        { x: 0.50, y: 0.78, h: 16, s: 0.28 }
      ],
      glades: [{ x1: 240, y1: 580, x2: 250, y2: 380, w: 42 }],
      rocks: [{ x: 400, y: 300, r: 26 }],
      rivers: [{ pts: [[500, 400], [680, 450], [860, 420], [980, 470]], w: 18 }],
      cliffs: [{ x: 620, y: 360, r: 28 }], fences: [],
      demand: d => 14 + (d - 1) * 6, skill: 2,
      pois: [
        { id: 'st', kind: 'station', x: 240, y: 560 },
        { id: 'su', kind: 'summit', x: 250, y: 400 }
      ],
      later: [
        { day: 2, poi: { id: 'view', kind: 'viewpoint', x: 470, y: 300 } },
        { day: 3, poi: { id: 'rescue', kind: 'rescue', x: 700, y: 560 } },
        { day: 4, poi: { id: 'su2', kind: 'summit', x: 740, y: 250 } },
        { day: 5, poi: { id: 'cafe', kind: 'cafe', x: 560, y: 580 } },
        { day: 6, poi: { id: 'refuge', kind: 'refuge', x: 400, y: 220 } },
        { day: 8, poi: { id: 'park', kind: 'snowpark', x: 640, y: 420 } }
      ]
    },
    {
      id: 'white', name: 'White Hour', region: 'The hill that does not end',
      blurb: 'A new place every morning, and a larger crowd than the day before. There is no last day.',
      difficulty: 'Endless', diamonds: 4, medals: [], unlock: { mountain: 'glass', days: 7 },
      endless: true,
      seed: 73, snowLine: 16, treeLow: 24, treeHigh: 160, treeAt: 0.5, rough: 9, base: 18,
      peaks: [
        { x: 0.40, y: 0.28, h: 86, s: 0.26 },
        { x: 0.70, y: 0.40, h: 60, s: 0.20 },
        { x: 0.32, y: 0.70, h: 14, s: 0.30 }
      ],
      glades: [{ x1: 340, y1: 580, x2: 380, y2: 380, w: 46 }],
      rocks: [{ x: 620, y: 500, r: 30 }],
      rivers: [{ pts: [[640, 280], [800, 340], [960, 300]], w: 16 }],
      cliffs: [], fences: [],
      demand: d => 16 + (d - 1) * 7, skill: 1,
      pois: [
        { id: 'st', kind: 'station', x: 340, y: 560 },
        { id: 'su', kind: 'summit', x: 380, y: 400 }
      ],
      later: []
    }
  ];

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
  function hash(ix, iy, seed) {
    let n = Math.imul(ix | 0, 374761393) + Math.imul(iy | 0, 668265263) + Math.imul(seed | 0, 1442695041);
    n = Math.imul(n ^ (n >>> 13), 1274126177);
    return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
  }
  function vnoise(x, y, seed) {
    const x0 = Math.floor(x), y0 = Math.floor(y);
    const tx = x - x0, ty = y - y0;
    const sx = tx * tx * (3 - 2 * tx), sy = ty * ty * (3 - 2 * ty);
    const v00 = hash(x0, y0, seed), v10 = hash(x0 + 1, y0, seed);
    const v01 = hash(x0, y0 + 1, seed), v11 = hash(x0 + 1, y0 + 1, seed);
    return v00 * (1 - sx) * (1 - sy) + v10 * sx * (1 - sy) + v01 * (1 - sx) * sy + v11 * sx * sy;
  }
  function fbm(x, y, seed) {
    let a = 0, f = 1, w = 0.55, s = 0;
    for (let i = 0; i < 4; i++) { a += vnoise(x * f, y * f, seed + i * 17) * w; s += w; f *= 2.05; w *= 0.5; }
    return a / s;
  }
  function mountainById(id) { return MOUNTAINS.find(m => m.id === id) || null; }
  function height(m, x, y) {
    const nx = x / MAP_W, ny = y / MAP_H;
    let h = m.base;
    for (const p of m.peaks) {
      const dx = nx - p.x, dy = ny - p.y;
      h += p.h * Math.exp(-(dx * dx + dy * dy) / (p.s * p.s));
    }
    h += (fbm(nx * 3.1, ny * 3.1, m.seed) - 0.5) * m.rough;
    return Math.max(0, h);
  }
  function inGlade(m, x, y) {
    for (const g of m.glades || []) {
      const vx = g.x2 - g.x1, vy = g.y2 - g.y1;
      const l2 = vx * vx + vy * vy || 1;
      let t = ((x - g.x1) * vx + (y - g.y1) * vy) / l2;
      t = clamp(t, 0, 1);
      if (Math.hypot(x - (g.x1 + vx * t), y - (g.y1 + vy * t)) < g.w) return true;
    }
    return false;
  }
  function naturalForest(m, x, y) {
    const h = height(m, x, y);
    if (h < m.treeLow || h > m.treeHigh) return false;
    if (inGlade(m, x, y)) return false;
    return fbm(x * 0.018, y * 0.018, m.seed + 9) > m.treeAt;
  }
  function cellKey(x, y) { return (Math.floor(x / 10)) + ',' + (Math.floor(y / 10)); }
  function forestAt(run, x, y) {
    if (!naturalForest(run.mountain, x, y)) return false;
    return !run.cleared[cellKey(x, y)];
  }
  function nearRiver(m, x, y) {
    for (const r of m.rivers || []) {
      for (let i = 0; i < r.pts.length - 1; i++) {
        const a = { x: r.pts[i][0], y: r.pts[i][1] }, b = { x: r.pts[i + 1][0], y: r.pts[i + 1][1] };
        const vx = b.x - a.x, vy = b.y - a.y, l2 = vx * vx + vy * vy || 1;
        let t = ((x - a.x) * vx + (y - a.y) * vy) / l2;
        t = clamp(t, 0, 1);
        if (Math.hypot(x - (a.x + vx * t), y - (a.y + vy * t)) < r.w) return true;
      }
    }
    return false;
  }
  function inDisc(list, x, y) {
    for (const c of list || []) if (Math.hypot(x - c.x, y - c.y) < c.r) return true;
    return false;
  }
  function cannonSnow(run, x, y) {
    for (const c of run.cannons) {
      const rad = 78 + c.level * 36;
      if (Math.hypot(x - c.x, y - c.y) <= rad) return true;
    }
    return false;
  }
  function snowAt(run, x, y) {
    return height(run.mountain, x, y) >= run.mountain.snowLine || cannonSnow(run, x, y);
  }
  function groundBlock(run, x, y) {
    const m = run.mountain;
    if (inDisc(m.rocks, x, y)) return 'rock';
    if (inDisc(m.cliffs, x, y)) return 'cliff';
    if (nearRiver(m, x, y)) return 'river';
    if (inDisc(m.fences, x, y)) return 'fence';
    return '';
  }
  function passage(run, x, y, mode) {
    const block = groundBlock(run, x, y);
    if (block === 'cliff' && mode !== 'cabin') return 'A cliff blocks that line.';
    if ((mode === 'piste' || mode === 'tow') && (block === 'rock' || block === 'river' || block === 'fence')) {
      return block === 'river' ? 'The creek is in the way.' : 'Rock or a fence blocks that line.';
    }
    if (mode === 'chair' && block === 'rock') return 'The chair cannot load on that rock.';
    if ((mode === 'piste' || mode === 'tow') && forestAt(run, x, y)) return 'Trees are in the way. Cut a lane first.';
    if (mode === 'piste' && !snowAt(run, x, y)) return 'No snow there. A cannon can make some.';
    return '';
  }

  function polyLength(pts) {
    let n = 0;
    for (let i = 1; i < pts.length; i++) n += dist(pts[i - 1], pts[i]);
    return n;
  }
  function simplify(pts) {
    const out = [];
    for (const p of pts) {
      if (!out.length || dist(out[out.length - 1], p) >= 8) out.push({ x: p.x, y: p.y });
    }
    if (pts.length && dist(out[out.length - 1], pts[pts.length - 1]) > 1) out.push({ x: pts[pts.length - 1].x, y: pts[pts.length - 1].y });
    return out;
  }
  function classify(g) {
    if (g < -0.12) return { ok: false, reason: 'Too steep to climb. Draw downhill, or keep a traverse almost flat.' };
    if (g < 0.06) return { ok: true, color: 'trail' };
    if (g <= 0.16) return { ok: true, color: 'green' };
    if (g <= 0.25) return { ok: true, color: 'blue' };
    if (g <= 0.40) return { ok: true, color: 'red' };
    if (g <= 0.58) return { ok: true, color: 'black' };
    return { ok: false, reason: 'That pitch is a cliff. Ease the line across the slope.' };
  }
  function sectionGrade(run, pts) {
    const len = polyLength(pts);
    if (len < 12) return { ok: false, reason: 'That ribbon is too short to be a run.' };
    const drop = height(run.mountain, pts[0].x, pts[0].y) - height(run.mountain, pts[pts.length - 1].x, pts[pts.length - 1].y);
    const g = drop / len;
    let worst = g;
    for (let i = 1; i < pts.length; i++) {
      const step = dist(pts[i - 1], pts[i]) || 1;
      const dg = (height(run.mountain, pts[i - 1].x, pts[i - 1].y) - height(run.mountain, pts[i].x, pts[i].y)) / step;
      if (dg > worst) worst = dg;
    }
    if (worst > 0.72) return { ok: false, reason: 'A cliff cuts across that line.', len, g };
    const band = classify(g);
    band.len = len;
    band.g = g;
    band.drop = drop;
    return band;
  }
  function sampleLine(run, pts, mode) {
    for (let i = 1; i < pts.length; i++) {
      const n = Math.max(1, Math.ceil(dist(pts[i - 1], pts[i]) / 8));
      for (let s = 0; s <= n; s++) {
        const t = s / n;
        const x = pts[i - 1].x + (pts[i].x - pts[i - 1].x) * t;
        const y = pts[i - 1].y + (pts[i].y - pts[i - 1].y) * t;
        const why = passage(run, x, y, mode);
        if (why) return why;
      }
    }
    return '';
  }
  function nodesOf(run) {
    const map = new Map();
    for (const p of run.pois) map.set(p.id, { id: p.id, x: p.x, y: p.y, kind: p.kind });
    for (const j of run.joints) map.set(j.id, j);
    return map;
  }
  function nearestNode(run, x, y, extra) {
    let best = null, bd = SNAP;
    const consider = (n) => {
      const d = Math.hypot(n.x - x, n.y - y);
      if (d <= bd) { bd = d; best = n; }
    };
    for (const n of nodesOf(run).values()) consider(n);
    for (const p of run.pistes) {
      for (const pt of p.pts) consider({ id: null, x: pt.x, y: pt.y, piste: p });
    }
    if (extra) consider(extra);
    return best ? { node: best, d: bd } : null;
  }
  function projectPiste(p, x, y) {
    let best = null, bd = 1e9, at = 0, acc = 0;
    for (let i = 1; i < p.pts.length; i++) {
      const a = p.pts[i - 1], b = p.pts[i];
      const vx = b.x - a.x, vy = b.y - a.y, l2 = vx * vx + vy * vy || 1;
      let t = clamp(((x - a.x) * vx + (y - a.y) * vy) / l2, 0, 1);
      const px = a.x + vx * t, py = a.y + vy * t;
      const d = Math.hypot(px - x, py - y);
      const along = acc + Math.hypot(vx, vy) * t;
      if (d < bd) { bd = d; best = { x: px, y: py, d, seg: i, t, along }; }
      acc += Math.hypot(vx, vy);
    }
    best.total = acc;
    return best;
  }
  function segmentHit(a, b, c, d) {
    const r = { x: b.x - a.x, y: b.y - a.y }, s = { x: d.x - c.x, y: d.y - c.y };
    const den = r.x * s.y - r.y * s.x;
    if (Math.abs(den) < 1e-6) return null;
    const q = { x: c.x - a.x, y: c.y - a.y };
    const t = (q.x * s.y - q.y * s.x) / den;
    const u = (q.x * r.y - q.y * r.x) / den;
    if (t > 0.06 && t < 0.94 && u > 0.06 && u < 0.94) return { x: a.x + t * r.x, y: a.y + t * r.y };
    return null;
  }

  function freshResources() { return { slope: 200, lift: 4, cannon: 4, trees: 20, upgrade: 4 }; }
  function cardPool(day, salt) {
    const bag = [
      { id: 'lift', title: 'Lift', detail: '+4 lift tokens', grant: { lift: 4 }, w: 3 },
      { id: 'slope', title: 'Slope', detail: '+200 m of ribbon', grant: { slope: 200 }, w: 3 },
      { id: 'upgrade', title: 'Upgrade', detail: '+2 upgrade marks', grant: { upgrade: 2 }, w: 3 },
      { id: 'cannon', title: 'Cannon', detail: '+2 snow cannons', grant: { cannon: 2 }, w: 1 },
      { id: 'trees', title: 'Cut trees', detail: '+8 tree cuts', grant: { trees: 8 }, w: 1 }
    ];
    const picked = [];
    let guard = 0;
    while (picked.length < 3 && guard++ < 20) {
      const roll = hash(day * 3 + picked.length, salt + guard * 13, 99);
      let acc = 0, sum = bag.reduce((s, b) => s + b.w, 0);
      let choice = bag[0];
      for (const b of bag) { acc += b.w / sum; if (roll <= acc) { choice = b; break; } }
      if (!picked.some(p => p.id === choice.id)) picked.push({ id: choice.id, title: choice.title, detail: choice.detail, grant: choice.grant });
    }
    return picked;
  }
  function skillOf(day, shift, i) {
    const t = clamp((day - 1 + shift) / 10, 0, 1);
    const cuts = [0.62 - t * 0.4, 0.88 - t * 0.28, 0.97 - t * 0.08, 1];
    const r = hash(day * 17, i * 29, 5 + shift);
    if (r < cuts[0]) return 'green';
    if (r < cuts[1]) return 'blue';
    if (r < cuts[2]) return 'red';
    return 'black';
  }
  function shapeChoices(run) {
    const kinds = run.pois.filter(p => p.kind !== 'station').map(p => p.kind);
    return kinds.length ? kinds : ['summit'];
  }
  function buildSchedule(run) {
    const n = Math.round(run.mountain.demand(run.day));
    const shapes = shapeChoices(run);
    const newest = run.pois.filter(p => p.kind !== 'station').slice(-1)[0];
    const list = [];
    for (let i = 0; i < n; i++) {
      const t = DAY_LEN * (0.08 + 0.52 * (i + 0.5) / n);
      let shape = shapes[Math.floor(hash(run.day, i, 3) * shapes.length) % shapes.length];
      if (newest && hash(run.day, i, 8) < 0.45) shape = newest.kind;
      list.push({ t, skill: skillOf(run.day, run.mountain.skill, i), shape });
    }
    return list;
  }
  function addPoi(run, poi) {
    if (run.pois.some(p => p.id === poi.id)) return;
    run.pois.push({ id: poi.id, kind: poi.kind, x: poi.x, y: poi.y, born: run.day });
  }
  function spawnScheduledPoi(run) {
    if (run.mountain.endless) {
      const kinds = ['viewpoint', 'cafe', 'rescue', 'refuge', 'snowpark', 'restaurant', 'summit', 'station'];
      const kind = kinds[(run.day - 1) % kinds.length];
      for (let k = 0; k < 12; k++) {
        const ang = hash(run.day, k, 21) * Math.PI * 2;
        const rad = 160 + hash(run.day, k, 22) * 220;
        const x = clamp(480 + Math.cos(ang) * rad, 80, 920);
        const y = clamp(380 + Math.sin(ang) * rad * 0.72, 80, 640);
        if (run.pois.some(p => Math.hypot(p.x - x, p.y - y) < 90)) continue;
        if (groundBlock(run, x, y)) continue;
        if (!snowAt(run, x, y) && kind !== 'cafe') continue;
        addPoi(run, { id: 'p' + run.day + '_' + k, kind, x, y });
        return;
      }
      return;
    }
    for (const item of run.mountain.later) if (item.day === run.day) addPoi(run, item.poi);
  }

  function createMeta() {
    return {
      version: 1, sound: true, tutorial: false, seen: false,
      best: {}, medals: {}, board: [], cleared: {}
    };
  }
  function unlocked(meta, id) {
    const m = mountainById(id);
    if (!m) return false;
    if (!m.unlock) return true;
    return (meta.cleared[m.unlock.mountain] || 0) >= m.unlock.days;
  }
  function startRun(meta, id, mode) {
    const m = mountainById(id);
    if (!m || !unlocked(meta, id)) return null;
    const sandbox = mode === 'sandbox';
    const run = {
      version: 1, mountainId: m.id, mountain: m, mode: sandbox ? 'sandbox' : 'run',
      phase: 'play', day: 1, clock: 0, speed: 0, score: 0, completed: 0,
      pois: m.pois.map(p => ({ ...p, born: 1 })),
      pistes: [], lifts: [], cannons: [], joints: [],
      cleared: {}, resources: sandbox ? { slope: 9999, lift: 9999, cannon: 9999, trees: 9999, upgrade: 9999 } : freshResources(),
      skiers: [], schedule: [], spawnIndex: 0, nextId: 1,
      cards: [], rerolls: 1, weekMark: 1, undo: [], redo: [],
      reason: '', sandbox
    };
    run.schedule = buildSchedule(run);
    return run;
  }
  function snapshot(run) {
    return JSON.stringify({
      pistes: run.pistes, lifts: run.lifts.map(l => ({ ...l, queue: [], riders: [] })),
      cannons: run.cannons, joints: run.joints, cleared: run.cleared,
      resources: run.resources, pois: run.pois, nextId: run.nextId
    });
  }
  function remember(run) {
    run.undo.push(snapshot(run));
    if (run.undo.length > 25) run.undo.shift();
    run.redo.length = 0;
  }
  function restore(run, raw) {
    const data = JSON.parse(raw);
    run.pistes = data.pistes;
    run.lifts = data.lifts;
    run.cannons = data.cannons;
    run.joints = data.joints;
    run.cleared = data.cleared;
    run.resources = data.resources;
    run.pois = data.pois;
    run.nextId = data.nextId;
    for (const s of run.skiers) if (s.state !== 'done') s.repath = true;
  }
  function undo(run) {
    if (!run.undo.length || run.phase === 'over') return false;
    run.redo.push(snapshot(run));
    restore(run, run.undo.pop());
    return true;
  }
  function redo(run) {
    if (!run.redo.length || run.phase === 'over') return false;
    run.undo.push(snapshot(run));
    restore(run, run.redo.pop());
    return true;
  }

  function spend(run, key, n) {
    if (run.sandbox) return true;
    if ((run.resources[key] || 0) < n) return false;
    run.resources[key] -= n;
    return true;
  }
  function refund(run, key, n) { if (!run.sandbox) run.resources[key] = (run.resources[key] || 0) + n; }

  function snapPoint(run, x, y) {
    let best = null, bd = SNAP;
    for (const p of run.pois) {
      const d = Math.hypot(p.x - x, p.y - y);
      if (d < bd) { bd = d; best = { kind: 'poi', id: p.id, x: p.x, y: p.y }; }
    }
    for (const j of run.joints) {
      const d = Math.hypot(j.x - x, j.y - y);
      if (d < bd) { bd = d; best = { kind: 'joint', id: j.id, x: j.x, y: j.y }; }
    }
    for (const l of run.lifts) {
      for (const end of [{ id: l.from, x: l.x1, y: l.y1 }, { id: l.to, x: l.x2, y: l.y2 }]) {
        const d = Math.hypot(end.x - x, end.y - y);
        if (d < bd) { bd = d; best = { kind: 'lift', id: end.id, x: end.x, y: end.y }; }
      }
    }
    // Stops, joints and lift ends win over the middle of a run. A run's own
    // end is its node, so we never split a run at (or a hair from) its end.
    const nodeBd = best ? bd : Infinity;
    for (const p of run.pistes) {
      const hit = projectPiste(p, x, y);
      if (hit.d >= bd) continue;
      if (hit.along < 10 || hit.total - hit.along < 10) {
        const head = hit.along < 10;
        const end = head ? p.pts[0] : p.pts[p.pts.length - 1];
        const id = head ? p.from : p.to;
        if (!best || best.kind !== 'poi') { bd = hit.d; best = { kind: 'joint', id, x: end.x, y: end.y }; }
        continue;
      }
      if (nodeBd !== Infinity && hit.d > nodeBd - 8) continue;
      bd = hit.d; best = { kind: 'piste', piste: p, x: hit.x, y: hit.y, along: hit.along, total: hit.total };
    }
    return best;
  }
  function ensureJoint(run, snap) {
    if (!snap) return null;
    if (snap.kind === 'poi' || snap.kind === 'joint' || snap.kind === 'lift') return snap.id;
    const id = 'j' + run.nextId++;
    run.joints.push({ id, x: snap.x, y: snap.y });
    splitPisteAt(run, snap.piste, snap.x, snap.y, id);
    return id;
  }
  function slicePts(pts, distances, a, b) {
    const total = distances[distances.length - 1];
    const start = clamp(a, 0, total), end = clamp(b, 0, total);
    const out = [pointAt(pts, distances, start)];
    for (let i = 1; i < pts.length - 1; i++) if (distances[i] > start + 0.5 && distances[i] < end - 0.5) out.push(pts[i]);
    out.push(pointAt(pts, distances, end));
    return out;
  }
  function cumDist(pts) {
    const d = [0];
    for (let i = 1; i < pts.length; i++) d.push(d[i - 1] + dist(pts[i - 1], pts[i]));
    return d;
  }
  function pointAt(pts, d, at) {
    for (let i = 1; i < pts.length; i++) {
      if (d[i] >= at) {
        const span = d[i] - d[i - 1] || 1;
        const t = (at - d[i - 1]) / span;
        return { x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * t, y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * t };
      }
    }
    return { ...pts[pts.length - 1] };
  }
  function makePiste(run, pts, from, to) {
    const band = sectionGrade(run, pts);
    if (!band.ok) return null;
    return {
      id: 'p' + run.nextId++, pts, from, to, color: band.color, length: Math.round(band.len),
      level: 0, riders: 0
    };
  }
  function splitPisteAt(run, piste, x, y, jointId) {
    const idx = run.pistes.indexOf(piste);
    if (idx < 0) return;
    const hit = projectPiste(piste, x, y);
    const d = cumDist(piste.pts);
    if (hit.along < 10 || hit.total - hit.along < 10) {
      const end = hit.along < 10 ? 'from' : 'to';
      piste[end] = jointId;
      if (end === 'from') piste.pts[0] = { x, y };
      else piste.pts[piste.pts.length - 1] = { x, y };
      return;
    }
    const leftPts = slicePts(piste.pts, d, 0, hit.along);
    const rightPts = slicePts(piste.pts, d, hit.along, hit.total);
    leftPts[leftPts.length - 1] = { x, y };
    rightPts[0] = { x, y };
    const left = makePiste(run, leftPts, piste.from, jointId) || { ...piste, id: 'p' + run.nextId++, pts: leftPts, to: jointId, length: Math.round(hit.along) };
    const right = makePiste(run, rightPts, jointId, piste.to) || { ...piste, id: 'p' + run.nextId++, pts: rightPts, from: jointId, length: Math.round(hit.total - hit.along) };
    left.level = right.level = piste.level;
    run.pistes.splice(idx, 1, left, right);
  }

  function previewStroke(run, raw) {
    const pts = simplify(raw || []);
    if (pts.length < 2) return { ok: false, reason: 'Drag a line across the snow.' };
    const band = sectionGrade(run, pts);
    if (!band.ok) return band;
    const block = sampleLine(run, pts, 'piste');
    if (block) return { ok: false, reason: block, color: band.color, len: band.len, g: band.g };
    const a = snapPoint(run, pts[0].x, pts[0].y);
    const b = snapPoint(run, pts[pts.length - 1].x, pts[pts.length - 1].y);
    if (!a || !b) return { ok: false, reason: 'Start and finish near a stop, a lift, or another run.', color: band.color, len: band.len, g: band.g };
    if (!run.sandbox && run.resources.slope < band.len) return { ok: false, reason: 'Not enough ribbon. You have ' + Math.floor(run.resources.slope) + ' m.', color: band.color, len: band.len, g: band.g };
    return { ok: true, color: band.color, len: band.len, g: band.g, reason: '' };
  }
  function commitStroke(run, raw) {
    if (run.phase === 'over' || run.phase === 'dawn') return { ok: false, reason: 'The hill is not open for drawing.' };
    const preview = previewStroke(run, raw);
    if (!preview.ok) return preview;
    const pts = simplify(raw);
    remember(run);
    const a = snapPoint(run, pts[0].x, pts[0].y);
    const b = snapPoint(run, pts[pts.length - 1].x, pts[pts.length - 1].y);
    pts[0] = { x: a.x, y: a.y };
    pts[pts.length - 1] = { x: b.x, y: b.y };
    const from = ensureJoint(run, snapPoint(run, pts[0].x, pts[0].y));
    const to = ensureJoint(run, snapPoint(run, pts[pts.length - 1].x, pts[pts.length - 1].y));
    const pieces = [];
    const cuts = [0];
    for (const other of run.pistes.slice()) {
      for (let i = 1; i < pts.length; i++) {
        for (let k = 1; k < other.pts.length; k++) {
          const hit = segmentHit(pts[i - 1], pts[i], other.pts[k - 1], other.pts[k]);
          if (!hit) continue;
          const id = 'j' + run.nextId++;
          run.joints.push({ id, x: hit.x, y: hit.y });
          splitPisteAt(run, other, hit.x, hit.y, id);
          const d = cumDist(pts);
          let along = 0;
          for (let s = 1; s < i; s++) along += dist(pts[s - 1], pts[s]);
          along += dist(pts[i - 1], hit);
          cuts.push(along);
        }
      }
    }
    cuts.push(polyLength(pts));
    cuts.sort((a, b) => a - b);
    const dAll = cumDist(pts);
    let prev = from;
    for (let c = 0; c < cuts.length - 1; c++) {
      if (cuts[c + 1] - cuts[c] < 12) continue;
      const slice = slicePts(pts, dAll, cuts[c], cuts[c + 1]);
      let next = to;
      if (c < cuts.length - 2) {
        const end = slice[slice.length - 1];
        const joint = run.joints.find(j => Math.hypot(j.x - end.x, j.y - end.y) < 6);
        next = joint ? joint.id : to;
      }
      const made = makePiste(run, slice, prev, next);
      if (made) { run.pistes.push(made); pieces.push(made); prev = made.to; }
    }
    if (!pieces.length) {
      const made = makePiste(run, pts, from, to);
      if (!made) return { ok: false, reason: 'That line would not hold a colour.' };
      run.pistes.push(made);
      pieces.push(made);
    }
    const used = pieces.reduce((s, p) => s + p.length, 0);
    if (!spend(run, 'slope', used)) {
      undo(run);
      return { ok: false, reason: 'Not enough ribbon.' };
    }
    for (const s of run.skiers) s.repath = true;
    return { ok: true, color: pieces[0].color, len: used, pieces: pieces.length };
  }

  function orientLift(run, a, b) {
    const ha = height(run.mountain, a.x, a.y), hb = height(run.mountain, b.x, b.y);
    return ha <= hb ? { bottom: a, top: b } : { bottom: b, top: a };
  }
  function previewLift(run, a, b, type) {
    const spec = LIFT_TYPES[type];
    if (!spec || !a || !b) return { ok: false, reason: 'Pick two points for the lift.' };
    const ends = orientLift(run, a, b);
    const len = dist(ends.bottom, ends.top);
    const gain = height(run.mountain, ends.top.x, ends.top.y) - height(run.mountain, ends.bottom.x, ends.bottom.y);
    if (len < 24) return { ok: false, reason: 'That lift is too short.' };
    if (len > spec.max) return { ok: false, reason: spec.name + ' reaches about ' + spec.max + ' m. Try a longer lift.' };
    if (gain < 8) return { ok: false, reason: 'Lifts need a real climb. The top should sit higher.' };
    const why = sampleLine(run, [ends.bottom, ends.top], spec.ground ? 'tow' : type);
    if (why) return { ok: false, reason: why };
    const sa = snapPoint(run, ends.bottom.x, ends.bottom.y);
    const sb = snapPoint(run, ends.top.x, ends.top.y);
    if (!sa || !sb) return { ok: false, reason: 'Anchor each end near a stop or a run.' };
    if (!run.sandbox && run.resources.lift < spec.cost) return { ok: false, reason: 'Not enough lift tokens.' };
    return { ok: true, len: Math.round(len), gain: Math.round(gain), reason: '' };
  }
  function commitLift(run, a, b, type) {
    if (run.phase === 'over' || run.phase === 'dawn') return { ok: false, reason: 'The hill is not open for building.' };
    const preview = previewLift(run, a, b, type);
    if (!preview.ok) return preview;
    const spec = LIFT_TYPES[type];
    remember(run);
    const ends = orientLift(run, a, b);
    const sa = snapPoint(run, ends.bottom.x, ends.bottom.y);
    const sb = snapPoint(run, ends.top.x, ends.top.y);
    const from = ensureJoint(run, sa);
    const to = ensureJoint(run, sb);
    if (!spend(run, 'lift', spec.cost)) { undo(run); return { ok: false, reason: 'Not enough lift tokens.' }; }
    run.lifts.push({
      id: 'l' + run.nextId++, type, from, to,
      x1: ends.bottom.x, y1: ends.bottom.y, x2: ends.top.x, y2: ends.top.y,
      length: preview.len, level: 0, cost: spec.cost, queue: [], riders: []
    });
    for (const s of run.skiers) s.repath = true;
    return { ok: true, len: preview.len };
  }
  function placeCannon(run, x, y) {
    if (run.phase === 'over' || run.phase === 'dawn') return { ok: false, reason: 'Not now.' };
    if (groundBlock(run, x, y) === 'river' || groundBlock(run, x, y) === 'rock') return { ok: false, reason: 'Nowhere to stand the cannon.' };
    if (!run.sandbox && run.resources.cannon < 1) return { ok: false, reason: 'No snow cannons left.' };
    remember(run);
    if (!spend(run, 'cannon', 1)) { undo(run); return { ok: false, reason: 'No snow cannons left.' }; }
    run.cannons.push({ id: 'c' + run.nextId++, x, y, level: 0 });
    return { ok: true };
  }
  function cutAt(run, x, y) {
    if (run.phase === 'over' || run.phase === 'dawn') return { ok: false, reason: 'Not now.' };
    const keys = [];
    for (let ix = -2; ix <= 2; ix++) for (let iy = -2; iy <= 2; iy++) {
      const cx = x + ix * 10, cy = y + iy * 10;
      if (Math.hypot(cx - x, cy - y) > 18) continue;
      if (!naturalForest(run.mountain, cx, cy)) continue;
      const key = cellKey(cx, cy);
      if (!run.cleared[key]) keys.push(key);
    }
    if (!keys.length) return { ok: false, reason: 'No trees there.' };
    if (!run.sandbox && run.resources.trees < keys.length) return { ok: false, reason: 'Not enough cuts for that clump.' };
    remember(run);
    if (!spend(run, 'trees', keys.length)) { undo(run); return { ok: false, reason: 'Not enough cuts.' }; }
    for (const key of keys) run.cleared[key] = 1;
    return { ok: true, n: keys.length };
  }
  function upgradeAt(run, x, y) {
    if (run.phase === 'over' || run.phase === 'dawn') return { ok: false, reason: 'Not now.' };
    let best = null, bd = 28, kind = '';
    for (const l of run.lifts) {
      const hit = projectPiste({ pts: [{ x: l.x1, y: l.y1 }, { x: l.x2, y: l.y2 }] }, x, y);
      if (hit.d < bd) { bd = hit.d; best = l; kind = 'lift'; }
    }
    for (const c of run.cannons) {
      const d = Math.hypot(c.x - x, c.y - y);
      if (d < bd) { bd = d; best = c; kind = 'cannon'; }
    }
    for (const p of run.pistes) {
      const hit = projectPiste(p, x, y);
      if (hit.d < 16 && hit.d < bd) { bd = hit.d; best = p; kind = 'piste'; }
    }
    if (!best) return { ok: false, reason: 'Point at a lift, a run, or a cannon.' };
    const cap = kind === 'lift' ? 3 : 2;
    if (best.level >= cap) return { ok: false, reason: 'That is already as strong as it gets.' };
    if (!run.sandbox && run.resources.upgrade < 1) return { ok: false, reason: 'No upgrade marks left.' };
    remember(run);
    if (!spend(run, 'upgrade', 1)) { undo(run); return { ok: false, reason: 'No upgrade marks left.' }; }
    best.level += 1;
    return { ok: true, kind, level: best.level };
  }
  function eraseAt(run, x, y) {
    if (run.phase === 'over' || run.phase === 'dawn') return { ok: false, reason: 'Not now.' };
    let best = null, bd = 18, kind = '';
    for (const p of run.pistes) {
      const hit = projectPiste(p, x, y);
      if (hit.d < bd) { bd = hit.d; best = p; kind = 'piste'; }
    }
    for (const l of run.lifts) {
      const hit = projectPiste({ pts: [{ x: l.x1, y: l.y1 }, { x: l.x2, y: l.y2 }] }, x, y);
      if (hit.d < bd) { bd = hit.d; best = l; kind = 'lift'; }
    }
    for (const c of run.cannons) {
      const d = Math.hypot(c.x - x, c.y - y);
      if (d < 22 && d < bd) { bd = d; best = c; kind = 'cannon'; }
    }
    if (!best) return { ok: false, reason: 'Nothing close enough to erase.' };
    remember(run);
    if (kind === 'piste') {
      const hit = projectPiste(best, x, y);
      const d = cumDist(best.pts);
      const a = Math.max(0, hit.along - 14), b = Math.min(hit.total, hit.along + 14);
      if (b - a >= hit.total - 8) {
        refund(run, 'slope', best.length);
        refund(run, 'upgrade', best.level);
        run.pistes = run.pistes.filter(p => p !== best);
      } else {
        const kept = [];
        if (a > 12) {
          const left = makePiste(run, slicePts(best.pts, d, 0, a), best.from, 'jcut' + run.nextId);
          if (left) { left.level = best.level; kept.push(left); }
        }
        if (hit.total - b > 12) {
          const right = makePiste(run, slicePts(best.pts, d, b, hit.total), 'jcut' + run.nextId, best.to);
          if (right) { right.level = best.level; kept.push(right); }
        }
        const removed = best.length - kept.reduce((s, p) => s + p.length, 0);
        refund(run, 'slope', Math.max(0, removed));
        run.pistes = run.pistes.filter(p => p !== best).concat(kept);
      }
    } else if (kind === 'lift') {
      refund(run, 'lift', best.cost);
      refund(run, 'upgrade', best.level);
      run.lifts = run.lifts.filter(l => l !== best);
    } else {
      refund(run, 'cannon', 1);
      refund(run, 'upgrade', best.level);
      run.cannons = run.cannons.filter(c => c !== best);
    }
    for (const s of run.skiers) s.repath = true;
    return { ok: true, kind };
  }

  function liftSeats(l) { return Math.round(LIFT_TYPES[l.type].seats * Math.pow(1.4, l.level)); }
  function liftSpeed(l) { return LIFT_TYPES[l.type].speed * Math.pow(1.1, l.level); }
  function pisteSpeed(p) { return PISTE_SPEED[p.color] * Math.pow(1.12, p.level || 0); }
  function allows(skill, color) {
    if (color === 'trail') return true;
    return RANK[color] <= RANK[skill];
  }
  function outgoing(run, nodeId) {
    const edges = [];
    for (const p of run.pistes) if (p.from === nodeId) edges.push({ kind: 'piste', edge: p, to: p.to });
    for (const l of run.lifts) if (l.from === nodeId) edges.push({ kind: 'lift', edge: l, to: l.to });
    return edges;
  }
  function edgeCost(item, skill) {
    if (item.kind === 'piste') {
      if (!allows(skill, item.edge.color)) return Infinity;
      const match = item.edge.color === skill || item.edge.color === 'trail' ? 1 : 1.55;
      const crowd = 1 + (item.edge.riders || 0) * 0.35;
      return (item.edge.length / pisteSpeed(item.edge)) * match * crowd;
    }
    const wait = (item.edge.queue.length / Math.max(1, liftSeats(item.edge))) * (item.edge.length / liftSpeed(item.edge));
    return item.edge.length / liftSpeed(item.edge) + wait * 0.85;
  }
  function findPath(run, fromId, goal) {
    const nodes = nodesOf(run);
    if (!nodes.has(fromId)) return null;
    const distM = new Map([[fromId, 0]]);
    const prev = new Map();
    const used = new Set();
    while (used.size < nodes.size) {
      let cur = null, best = Infinity;
      for (const id of nodes.keys()) if (!used.has(id) && (distM.get(id) ?? Infinity) < best) { best = distM.get(id); cur = id; }
      if (cur == null || best === Infinity) break;
      if (goal(nodes.get(cur), cur)) {
        const edges = [];
        let walk = cur;
        while (prev.has(walk)) { edges.push(prev.get(walk).edgeItem); walk = prev.get(walk).from; }
        edges.reverse();
        return edges;
      }
      used.add(cur);
      for (const item of outgoing(run, cur)) {
        const cost = edgeCost(item, goal.skill || 'black');
        if (!isFinite(cost)) continue;
        const next = (distM.get(cur) ?? Infinity) + cost;
        if (next < (distM.get(item.to) ?? Infinity)) {
          distM.set(item.to, next);
          prev.set(item.to, { from: cur, edgeItem: item });
        }
      }
    }
    return null;
  }
  function pathToShape(run, fromId, shape, skill) {
    const goal = (node) => node.kind === shape;
    goal.skill = skill;
    return findPath(run, fromId, goal);
  }
  function pathHome(run, fromId, skill) {
    const goal = (node) => node.kind === 'station';
    goal.skill = skill;
    return findPath(run, fromId, goal);
  }
  function stationNodes(run) { return run.pois.filter(p => p.kind === 'station'); }

  function spawnSkier(run, spec, i) {
    const stations = stationNodes(run);
    const home = stations[i % stations.length];
    const skier = {
      id: 's' + run.nextId++, shape: spec.shape, skill: spec.skill,
      state: 'think', node: home.id, edge: null, t: 0, visited: false, progress: 0
    };
    run.skiers.push(skier);
    assign(run, skier);
  }
  function assign(run, skier) {
    if (skier.state === 'done') return;
    const from = skier.node;
    if (!from) { skier.state = 'stuck'; return; }
    const path = skier.visited ? pathHome(run, from, skier.skill) : pathToShape(run, from, skier.shape, skier.skill);
    if (!path || !path.length) { skier.state = 'stuck'; skier.edge = null; return; }
    skier.path = path;
    enterEdge(run, skier, path[0]);
  }
  function enterEdge(run, skier, item) {
    skier.edge = item.edge.id;
    skier.edgeKind = item.kind;
    skier.t = 0;
    if (item.kind === 'lift') {
      skier.state = 'queue';
      if (!item.edge.queue.includes(skier.id)) item.edge.queue.push(skier.id);
    } else {
      skier.state = 'ski';
      item.edge.riders = (item.edge.riders || 0) + 1;
    }
  }
  function leavePiste(run, skier) {
    const p = run.pistes.find(x => x.id === skier.edge);
    if (p) p.riders = Math.max(0, (p.riders || 0) - 1);
  }
  function arriveNode(run, skier, nodeId) {
    leavePiste(run, skier);
    skier.node = nodeId;
    skier.edge = null;
    const node = nodesOf(run).get(nodeId);
    if (!skier.visited && node && node.kind === skier.shape) skier.visited = true;
    if (skier.visited && node && node.kind === 'station') {
      skier.state = 'done';
      const mult = { green: 1, blue: 1.35, red: 1.8, black: 2.4 }[skier.skill];
      run.score += Math.round((14 + 8) * mult * (1 + 0.08 * (run.day - 1)));
      return;
    }
    assign(run, skier);
  }
  function moveSkiers(run, dt) {
    for (const l of run.lifts) {
      const seats = liftSeats(l);
      const speed = liftSpeed(l);
      for (const rider of l.riders) rider.t += dt * speed / Math.max(20, l.length);
      const done = l.riders.filter(r => r.t >= 1);
      l.riders = l.riders.filter(r => r.t < 1);
      for (const rider of done) {
        const skier = run.skiers.find(s => s.id === rider.id);
        if (skier) arriveNode(run, skier, l.to);
      }
      while (l.riders.length < seats && l.queue.length) {
        const id = l.queue.shift();
        const skier = run.skiers.find(s => s.id === id);
        if (!skier || skier.state === 'done') continue;
        skier.state = 'ride';
        l.riders.push({ id, t: 0 });
      }
    }
    for (const skier of run.skiers) {
      if (skier.repath && skier.state !== 'ride' && skier.state !== 'done') {
        skier.repath = false;
        if (skier.state === 'queue') {
          const lift = run.lifts.find(l => l.queue.includes(skier.id));
          if (lift) lift.queue = lift.queue.filter(id => id !== skier.id);
        }
        leavePiste(run, skier);
        assign(run, skier);
      }
      if (skier.state !== 'ski') continue;
      const p = run.pistes.find(x => x.id === skier.edge);
      if (!p) { skier.state = 'stuck'; continue; }
      const crowd = 1 + Math.max(0, (p.riders || 1) - 1) * 0.12;
      skier.t += dt * pisteSpeed(p) / crowd / Math.max(16, p.length);
      if (skier.t >= 1) arriveNode(run, skier, p.to);
    }
    run.skiers = run.skiers.filter(s => s.state !== 'done');
  }

  function clockHours(run) {
    return OPEN_H + (run.clock / DAY_LEN) * (CLOSE_H - OPEN_H);
  }
  function formatClock(run) {
    const h = clockHours(run);
    const hh = Math.floor(h);
    const mm = Math.min(59, Math.floor((h - hh) * 60));
    return hh + 'H' + String(mm).padStart(2, '0');
  }
  function guests(run) {
    return { out: run.skiers.length, total: run.schedule.length };
  }
  function openDawn(run) {
    run.completed = run.day;
    run.day += 1;
    run.clock = 0;
    run.spawnIndex = 0;
    run.skiers = [];
    for (const l of run.lifts) { l.queue = []; l.riders = []; }
    for (const p of run.pistes) p.riders = 0;
    spawnScheduledPoi(run);
    if (run.day >= run.weekMark + 7) { run.rerolls = Math.min(1, run.rerolls + 1); run.weekMark = run.day; if (run.rerolls < 1) run.rerolls = 1; }
    if (run.sandbox) {
      run.schedule = buildSchedule(run);
      run.phase = 'play';
      return;
    }
    run.cards = cardPool(run.day, run.mountain.seed);
    run.phase = 'dawn';
    run.speed = 0;
  }
  function chooseCard(run, index) {
    if (run.phase !== 'dawn') return { ok: false, reason: 'No supply drop is waiting.' };
    const card = run.cards[index];
    if (!card) return { ok: false, reason: 'Pick one of the three cards.' };
    for (const [k, v] of Object.entries(card.grant)) run.resources[k] = (run.resources[k] || 0) + v;
    run.cards = [];
    run.schedule = buildSchedule(run);
    run.phase = 'play';
    run.speed = 0;
    return { ok: true, card };
  }
  function reroll(run) {
    if (run.phase !== 'dawn') return { ok: false, reason: 'Reroll during the morning drop.' };
    if (run.rerolls < 1) return { ok: false, reason: 'The next shuffle arrives next week.' };
    run.rerolls -= 1;
    run.cards = cardPool(run.day, run.mountain.seed + 50 + run.day);
    return { ok: true };
  }
  function tick(run, realDt) {
    if (!run || run.phase !== 'play') return run;
    const dt = Math.min(0.05, Math.max(0, realDt)) * (run.speed || 0);
    if (dt <= 0) return run;
    run.clock += dt;
    while (run.spawnIndex < run.schedule.length && run.schedule[run.spawnIndex].t <= run.clock) {
      spawnSkier(run, run.schedule[run.spawnIndex], run.spawnIndex);
      run.spawnIndex++;
    }
    moveSkiers(run, dt);
    if (run.clock >= DAY_LEN) {
      if (!run.sandbox && (run.skiers.length || run.spawnIndex < run.schedule.length)) {
        run.phase = 'over';
        run.speed = 0;
        run.reason = 'Dusk at 18:00, and guests are still on the hill.';
        run.clock = DAY_LEN;
      } else openDawn(run);
    }
    return run;
  }
  function setSpeed(run, speed) {
    if (run.phase !== 'play') return run;
    run.speed = speed;
    return run;
  }
  function counts(run) {
    const poi = {};
    for (const k of KINDS) poi[k] = 0;
    for (const p of run.pois) poi[p.kind] = (poi[p.kind] || 0) + 1;
    const slopes = { trail: 0, green: 0, blue: 0, red: 0, black: 0 };
    for (const p of run.pistes) slopes[p.color] = (slopes[p.color] || 0) + 1;
    const lifts = { tow: 0, chair: 0, cabin: 0 };
    for (const l of run.lifts) lifts[l.type] += 1;
    return { poi, slopes, lifts, cannons: run.cannons.length };
  }
  function connected(run, poi) {
    const near = (x, y) => Math.hypot(poi.x - x, poi.y - y) <= SNAP;
    if (run.pistes.some(p => near(p.pts[0].x, p.pts[0].y) || near(p.pts[p.pts.length - 1].x, p.pts[p.pts.length - 1].y) || p.from === poi.id || p.to === poi.id)) return true;
    if (run.lifts.some(l => l.from === poi.id || l.to === poi.id || near(l.x1, l.y1) || near(l.x2, l.y2))) return true;
    return false;
  }
  function altitude(run, poi) { return Math.round(height(run.mountain, poi.x, poi.y)); }

  function recordResult(meta, run) {
    const days = run.phase === 'over' ? run.day : run.completed;
    const closed = run.completed;
    const prev = meta.best[run.mountainId] || { score: 0, days: 0, closed: 0 };
    const best = {
      score: Math.max(prev.score, Math.round(run.score)),
      days: Math.max(prev.days, days),
      closed: Math.max(prev.closed, closed)
    };
    meta.best[run.mountainId] = best;
    meta.cleared[run.mountainId] = Math.max(meta.cleared[run.mountainId] || 0, closed);
    const row = { mountain: run.mountainId, mode: run.mode, score: Math.round(run.score), days, at: Date.now() };
    meta.board = [row, ...(meta.board || [])].sort((a, b) => b.score - a.score || b.days - a.days).slice(0, 8);
    return meta;
  }
  function starsFor(run) {
    const m = run.mountain;
    const closed = run.phase === 'over' ? run.completed : run.completed;
    if (!m.medals.length) return closed >= 10 ? 3 : closed >= 6 ? 2 : closed >= 3 ? 1 : 0;
    return m.medals.filter(n => closed >= n).length;
  }
  function strip(run) {
    return {
      version: 1, mountainId: run.mountainId, mode: run.mode, phase: run.phase, day: run.day,
      clock: run.clock, speed: 0, score: run.score, completed: run.completed,
      pois: run.pois, pistes: run.pistes, lifts: run.lifts.map(l => ({ ...l, queue: [], riders: [] })),
      cannons: run.cannons, joints: run.joints, cleared: run.cleared, resources: run.resources,
      nextId: run.nextId, rerolls: run.rerolls, weekMark: run.weekMark, cards: run.cards,
      schedule: run.schedule, spawnIndex: run.spawnIndex, sandbox: run.sandbox, reason: run.reason,
      skiers: (run.skiers || []).filter(s => s.state !== 'done').map(s => ({ ...s, repath: true }))
    };
  }
  function hydrate(data) {
    const m = mountainById(data.mountainId);
    if (!m) throw new Error('mountain');
    const run = {
      ...data, mountain: m, skiers: data.skiers || [], undo: [], redo: [],
      lifts: (data.lifts || []).map(l => ({ queue: [], riders: [], ...l })),
      pistes: (data.pistes || []).map(p => ({ riders: 0, ...p }))
    };
    if (run.phase === 'play') run.speed = 0;
    return run;
  }
  function encode(bundle) {
    const meta = bundle.meta || createMeta();
    const payload = { version: 1, id: 'winterfold', title: 'Winterfold', meta, run: bundle.run ? strip(bundle.run) : null };
    return JSON.stringify(payload);
  }
  function decode(raw) {
    let data;
    try { data = JSON.parse(raw); } catch { return { ok: false, reason: 'unreadable' }; }
    if (!data || data.version !== 1 || data.id !== 'winterfold' || !data.meta) return { ok: false, reason: 'wrong game' };
    const meta = { ...createMeta(), ...data.meta, best: data.meta.best || {}, medals: data.meta.medals || {}, board: data.meta.board || [], cleared: data.meta.cleared || {} };
    let run = null;
    if (data.run) {
      try { run = hydrate(data.run); } catch { return { ok: false, reason: 'run', meta }; }
    }
    return { ok: true, meta, run };
  }

  return {
    SAVE_KEY, MAP_W, MAP_H, SNAP, DAY_LEN, OPEN_H, CLOSE_H, COLOURS, LIFT_TYPES, KINDS, MOUNTAINS, RANK,
    mountainById, height, naturalForest, forestAt, snowAt, groundBlock, passage,
    createMeta, unlocked, startRun, previewStroke, commitStroke, previewLift, commitLift,
    placeCannon, cutAt, upgradeAt, eraseAt, undo, redo, tick, setSpeed, chooseCard, reroll,
    counts, connected, altitude, guests, clockHours, formatClock, recordResult, starsFor,
    encode, decode, classify, sectionGrade, polyLength, allows, pathToShape, pathHome, nodesOf
  };
});
