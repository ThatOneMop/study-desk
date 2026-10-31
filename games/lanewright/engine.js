/* Lanewright — original road-network sim. No third-party assets or borrowed names. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.LanewrightEngine = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const SAVE_KEY = 'study-desk-lanewright-v1';
  const WEEK = 140;
  const DAY = WEEK / 7;
  const TIMER = 15;
  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const PALETTE = ['coral', 'amber', 'leaf', 'tide', 'iris', 'rose'];
  const COLOR = {
    coral: { fill: '#e15b4c', deep: '#b63e36', ink: '#3a1814' },
    amber: { fill: '#e6a23a', deep: '#b67a1e', ink: '#3a2a10' },
    leaf: { fill: '#3aaa6a', deep: '#21784a', ink: '#102818' },
    tide: { fill: '#3a8fd4', deep: '#1e629e', ink: '#102030' },
    iris: { fill: '#7b64d6', deep: '#5340a4', ink: '#1a1430' },
    rose: { fill: '#d65b8c', deep: '#a43868', ink: '#301018' }
  };
  const TOOL_NAME = {
    road: 'road tiles',
    bridge: 'bridge',
    tunnel: 'tunnel',
    light: 'traffic light',
    roundabout: 'roundabout',
    motorway: 'motorway'
  };
  const ACHIEVEMENTS = [
    { id: 'first-trip', name: 'First pin', text: 'Complete a trip.' },
    { id: 'week-two', name: 'A second Sunday', text: 'Reach week 2.' },
    { id: 'week-four', name: 'A month of lanes', text: 'Reach week 4.' },
    { id: 'score-200', name: 'Two hundred trips', text: 'Score 200 in one city.' },
    { id: 'score-500', name: 'Five hundred trips', text: 'Score 500 in one city.' },
    { id: 'saved-ring', name: 'The ring faded', text: 'Bring a destination back under its pin limit.' },
    { id: 'bridge', name: 'Over the water', text: 'Lay a bridge.' },
    { id: 'tunnel', name: 'Through the hill', text: 'Lay a tunnel.' },
    { id: 'round', name: 'Give them a circle', text: 'Place a roundabout.' },
    { id: 'motor', name: 'A faster thread', text: 'Open a motorway.' },
    { id: 'light', name: 'Take turns', text: 'Set a traffic light.' },
    { id: 'daily', name: "Today's lane", text: 'Post a daily score.' },
    { id: 'sketch', name: 'Open notebook', text: 'Start a sketch.' },
    { id: 'all-cities', name: 'Every shore', text: 'Unlock every city.' },
    { id: 'lifetime-1000', name: 'A thousand pins', text: 'Complete 1,000 trips in all.' }
  ];
  const MODS = [
    { id: 'plain', name: 'Clear weather', pin: 1, roads: 1 },
    { id: 'rush', name: 'Rush hour', pin: 1.22, roads: 1 },
    { id: 'thin', name: 'Thin budget', pin: 1, roads: 0.72 },
    { id: 'festival', name: 'Festival weekend', pin: 1.32, roads: 1.12 }
  ];

  function paintTerrain(cols, rows, paints) {
    const terrain = [];
    for (let y = 0; y < rows; y++) {
      const row = [];
      for (let x = 0; x < cols; x++) row.push('land');
      terrain.push(row);
    }
    for (const p of paints) {
      if (p.type === 'fill') {
        for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) terrain[y][x] = p.tile;
      } else if (p.type === 'rect') {
        for (let y = p.y; y < p.y + p.h; y++) {
          for (let x = p.x; x < p.x + p.w; x++) {
            if (x >= 0 && y >= 0 && x < cols && y < rows) terrain[y][x] = p.tile;
          }
        }
      } else if (p.type === 'disc') {
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const dx = x + 0.5 - p.x;
            const dy = y + 0.5 - p.y;
            if (dx * dx + dy * dy <= p.r * p.r) terrain[y][x] = p.tile;
          }
        }
      }
    }
    return terrain;
  }

  function defineCity(spec) {
    const terrain = paintTerrain(spec.cols, spec.rows, spec.paint);
    let hasWater = false;
    let hasMountain = false;
    for (let y = 0; y < spec.rows; y++) {
      for (let x = 0; x < spec.cols; x++) {
        if (terrain[y][x] === 'water') hasWater = true;
        if (terrain[y][x] === 'mountain') hasMountain = true;
      }
    }
    return {
      id: spec.id,
      name: spec.name,
      region: spec.region,
      blurb: spec.blurb,
      cols: spec.cols,
      rows: spec.rows,
      unlock: spec.unlock,
      roads: spec.roads,
      bridges: spec.bridges || 0,
      tunnels: spec.tunnels || 0,
      ground: spec.ground,
      ground2: spec.ground2,
      water: spec.water,
      waterDeep: spec.waterDeep,
      mountain: spec.mountain,
      mountainLight: spec.mountainLight,
      road: spec.road,
      roadEdge: spec.roadEdge,
      ink: spec.ink,
      openings: spec.openings,
      terrain: terrain,
      hasWater: hasWater,
      hasMountain: hasMountain
    };
  }

  const CITIES = [
    defineCity({
      id: 'larkmere', name: 'Larkmere', region: 'Open meadow',
      blurb: 'A flat first page. Two colours, no river, no hill. Learn the drag.',
      cols: 18, rows: 12, unlock: 0, roads: 72,
      ground: '#f4f1e8', ground2: '#e3eddf', water: '#b7d4e8', waterDeep: '#8ebbd6',
      mountain: '#d5d0c8', mountainLight: '#ece8e1', road: '#fbfaf6', roadEdge: '#d9d3c8', ink: '#2c3330',
      paint: [],
      openings: [
        { role: 'house', color: 'coral', cx: 3, cy: 3 },
        { role: 'house', color: 'amber', cx: 3, cy: 8 },
        { role: 'dest', color: 'coral', cx: 13, cy: 3 },
        { role: 'dest', color: 'amber', cx: 13, cy: 8 }
      ]
    }),
    defineCity({
      id: 'pebble-quay', name: 'Pebble Quay', region: 'A bent river',
      blurb: 'The water steps across the middle. Same-bank trips are easy. The other bank is a bridge.',
      cols: 20, rows: 14, unlock: 140, roads: 64, bridges: 1,
      ground: '#f3efe4', ground2: '#e7f0e4', water: '#9ec8de', waterDeep: '#6ea8c6',
      mountain: '#d2cdc4', mountainLight: '#ebe6de', road: '#fbfaf6', roadEdge: '#d5cfc4', ink: '#243038',
      paint: [
        { type: 'rect', x: 0, y: 5, w: 10, h: 3, tile: 'water' },
        { type: 'rect', x: 8, y: 7, w: 12, h: 3, tile: 'water' }
      ],
      openings: [
        { role: 'house', color: 'coral', cx: 2, cy: 2 },
        { role: 'dest', color: 'coral', cx: 16, cy: 2 },
        { role: 'house', color: 'amber', cx: 2, cy: 11 },
        { role: 'dest', color: 'amber', cx: 16, cy: 11 }
      ]
    }),
    defineCity({
      id: 'kiln-ridge', name: 'Kiln Ridge', region: 'A stone spine',
      blurb: 'The ridge sits in the middle. A tunnel is short. The long way round the south still works.',
      cols: 18, rows: 14, unlock: 260, roads: 64, tunnels: 1,
      ground: '#f6f0e6', ground2: '#efe2d2', water: '#b7d4e8', waterDeep: '#8ebbd6',
      mountain: '#c9b5a2', mountainLight: '#e6d5c4', road: '#fbf8f3', roadEdge: '#d9cbb8', ink: '#3a2c24',
      paint: [
        { type: 'rect', x: 7, y: 1, w: 4, h: 11, tile: 'mountain' },
        { type: 'disc', x: 9, y: 6.5, r: 3.1, tile: 'mountain' }
      ],
      openings: [
        { role: 'house', color: 'coral', cx: 2, cy: 3 },
        { role: 'dest', color: 'coral', cx: 15, cy: 3 },
        { role: 'house', color: 'amber', cx: 2, cy: 10 },
        { role: 'dest', color: 'amber', cx: 15, cy: 10 }
      ]
    }),
    defineCity({
      id: 'saltglass', name: 'Saltglass', region: 'Three islands',
      blurb: 'Each island can serve itself. The third island cannot, until a bridge says so.',
      cols: 22, rows: 15, unlock: 400, roads: 60, bridges: 2,
      ground: '#e7f2ef', ground2: '#d5ebe4', water: '#8ec4cf', waterDeep: '#5fa4b4',
      mountain: '#d5d0c8', mountainLight: '#ece8e1', road: '#f7fbfa', roadEdge: '#c5ddd8', ink: '#1c3336',
      paint: [
        { type: 'fill', tile: 'water' },
        { type: 'rect', x: 2, y: 2, w: 6, h: 5, tile: 'land' },
        { type: 'rect', x: 14, y: 2, w: 7, h: 5, tile: 'land' },
        { type: 'rect', x: 6, y: 9, w: 9, h: 5, tile: 'land' }
      ],
      openings: [
        { role: 'house', color: 'coral', cx: 3, cy: 3 },
        { role: 'dest', color: 'coral', cx: 6, cy: 5 },
        { role: 'house', color: 'amber', cx: 15, cy: 3 },
        { role: 'dest', color: 'amber', cx: 18, cy: 5 }
      ]
    }),
    defineCity({
      id: 'reed-crossing', name: 'Reed Crossing', region: 'Two banks',
      blurb: 'A wide channel and not much else. North talks to north until you spend the bridge.',
      cols: 20, rows: 14, unlock: 560, roads: 62, bridges: 1,
      ground: '#f4f3e6', ground2: '#e4ecd4', water: '#7fb8c4', waterDeep: '#4e96a6',
      mountain: '#d5d0c8', mountainLight: '#ece8e1', road: '#fbfaf4', roadEdge: '#d5d2c2', ink: '#243028',
      paint: [{ type: 'rect', x: 0, y: 5, w: 20, h: 4, tile: 'water' }],
      openings: [
        { role: 'house', color: 'coral', cx: 3, cy: 2 },
        { role: 'dest', color: 'coral', cx: 15, cy: 2 },
        { role: 'house', color: 'amber', cx: 4, cy: 11 },
        { role: 'dest', color: 'amber', cx: 15, cy: 11 }
      ]
    }),
    defineCity({
      id: 'moth-terrace', name: 'Moth Terrace', region: 'Lilac shelves',
      blurb: 'The north is a terrace of stone. Everything you need starts on the lower shelf.',
      cols: 18, rows: 13, unlock: 740, roads: 64, tunnels: 1,
      ground: '#efeaf6', ground2: '#e2d8f0', water: '#b7c8e4', waterDeep: '#8aa6cc',
      mountain: '#c9c0d8', mountainLight: '#e4dced', road: '#faf8fc', roadEdge: '#d4cce0', ink: '#2a2438',
      paint: [
        { type: 'rect', x: 0, y: 0, w: 18, h: 5, tile: 'mountain' },
        { type: 'rect', x: 6, y: 3, w: 6, h: 2, tile: 'land' }
      ],
      openings: [
        { role: 'house', color: 'coral', cx: 2, cy: 8 },
        { role: 'dest', color: 'coral', cx: 14, cy: 7 },
        { role: 'house', color: 'amber', cx: 3, cy: 11 },
        { role: 'dest', color: 'amber', cx: 13, cy: 11 }
      ]
    }),
    defineCity({
      id: 'cinder-steps', name: 'Cinder Steps', region: 'Hill then pond',
      blurb: 'Steps of cinder on the west, a round pond on the east. Tunnel one way, bridge the other.',
      cols: 20, rows: 14, unlock: 940, roads: 62, tunnels: 1,
      ground: '#f6efe8', ground2: '#f0ddd0', water: '#a9cfe0', waterDeep: '#78b0c8',
      mountain: '#c4a898', mountainLight: '#e4d0c4', road: '#fbf7f3', roadEdge: '#e0d0c4', ink: '#3a2a24',
      paint: [
        { type: 'rect', x: 0, y: 0, w: 5, h: 14, tile: 'mountain' },
        { type: 'rect', x: 5, y: 0, w: 4, h: 8, tile: 'mountain' },
        { type: 'disc', x: 16, y: 9, r: 2.35, tile: 'water' }
      ],
      openings: [
        { role: 'house', color: 'coral', cx: 11, cy: 2 },
        { role: 'dest', color: 'coral', cx: 17, cy: 3 },
        { role: 'house', color: 'amber', cx: 11, cy: 11 },
        { role: 'dest', color: 'amber', cx: 17, cy: 12 }
      ]
    }),
    defineCity({
      id: 'halo-basin', name: 'Halo Basin', region: 'A ring of water',
      blurb: 'An outer shore, a moat, and an island that cannot hear you until a bridge lands.',
      cols: 22, rows: 16, unlock: 1160, roads: 68, bridges: 2,
      ground: '#f3f6ef', ground2: '#dcead8', water: '#8fb8d2', waterDeep: '#5e94b4',
      mountain: '#d5d0c8', mountainLight: '#ece8e1', road: '#fbfcf8', roadEdge: '#d0ddd4', ink: '#24302c',
      paint: [
        { type: 'rect', x: 3, y: 3, w: 16, h: 10, tile: 'water' },
        { type: 'rect', x: 7, y: 6, w: 8, h: 4, tile: 'land' }
      ],
      openings: [
        { role: 'house', color: 'coral', cx: 1, cy: 2 },
        { role: 'dest', color: 'coral', cx: 19, cy: 2 },
        { role: 'house', color: 'amber', cx: 1, cy: 13 },
        { role: 'dest', color: 'amber', cx: 19, cy: 13 }
      ]
    })
  ];

  function cityById(id) {
    return CITIES.find(c => c.id === id) || null;
  }

  function mulberry32(seed) {
    let a = seed >>> 0;
    const fn = function () {
      a |= 0;
      a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
    fn.state = () => a >>> 0;
    fn.set = s => { a = s >>> 0; };
    return fn;
  }

  function hashString(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function pad(n) { return String(n).padStart(2, '0'); }

  function dailyKey(date) {
    const d = date || new Date();
    return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate());
  }

  function weeklyKey(date) {
    const src = date || new Date();
    const d = new Date(Date.UTC(src.getUTCFullYear(), src.getUTCMonth(), src.getUTCDate()));
    const day = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - day);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const week = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return d.getUTCFullYear() + '-W' + pad(week);
  }

  function dailySeed(key) { return hashString('lane-day:' + (key || dailyKey())); }
  function weeklySeed(key) { return hashString('lane-week:' + (key || weeklyKey())); }

function pinRate(week, shape) {
  const w = Math.max(1, week);
  let base = 0.105 + (w - 1) * 0.03;
  if (w > 5) base += (w - 5) * 0.018;
  return base * (shape === 'circle' ? 1.62 : 1);
}

  function colorCount(week) {
    if (week >= 8) return 6;
    if (week >= 6) return 5;
    if (week >= 4) return 4;
    if (week >= 2) return 3;
    return 2;
  }

function spawnEvery(week) {
  return Math.max(11, 24 - (Math.max(1, week) - 1) * 1.35);
}

  function nk(x, y) { return x + ',' + y; }

  function inNode(city, x, y) {
    return x >= 0 && y >= 0 && x <= city.cols && y <= city.rows;
  }

  function cellTerrain(city, x, y) {
    if (x < 0 || y < 0 || x >= city.cols || y >= city.rows) return 'void';
    return city.terrain[y][x];
  }

  function classifyStep(city, buildings, x0, y0, x1, y1) {
    const dx = x1 - x0;
    const dy = y1 - y0;
    if (Math.abs(dx) > 1 || Math.abs(dy) > 1 || (dx === 0 && dy === 0)) return 'invalid';
    if (!inNode(city, x0, y0) || !inNode(city, x1, y1)) return 'invalid';
    if (dx !== 0 && dy !== 0) {
      const cx = Math.min(x0, x1);
      const cy = Math.min(y0, y1);
      if (buildings && buildings.some(b => b.cx === cx && b.cy === cy)) return 'blocked';
      const tile = cellTerrain(city, cx, cy);
      if (tile === 'void') return 'invalid';
      if (tile === 'water') return 'water';
      if (tile === 'mountain') return 'mountain';
      return 'land';
    }
    let real;
    if (dy === 0) {
      const x = Math.min(x0, x1);
      real = [cellTerrain(city, x, y0 - 1), cellTerrain(city, x, y0)];
    } else {
      const y = Math.min(y0, y1);
      real = [cellTerrain(city, x0 - 1, y), cellTerrain(city, x0, y)];
    }
    real = real.filter(t => t !== 'void');
    if (!real.length) return 'invalid';
    if (real.every(t => t === 'land')) return 'land';
    if (real.some(t => t === 'land')) return 'land';
    if (real.every(t => t === 'water')) return 'water';
    if (real.every(t => t === 'mountain')) return 'mountain';
    return 'mountain';
  }

  function lineNodes(a, b, city) {
    let x = a.x;
    let y = a.y;
    const pts = [{ x: x, y: y }];
    let guard = 0;
    while ((x !== b.x || y !== b.y) && guard++ < 256) {
      const sx = Math.sign(b.x - x);
      const sy = Math.sign(b.y - y);
      const nx = x + sx;
      const ny = y + sy;
      if (!inNode(city, nx, ny)) return null;
      x = nx;
      y = ny;
      pts.push({ x: x, y: y });
    }
    return pts;
  }

  function expandPoints(city, points) {
    if (!points || points.length < 2) return null;
    const full = [];
    for (let i = 0; i < points.length - 1; i++) {
      const part = lineNodes(points[i], points[i + 1], city);
      if (!part) return null;
      if (i === 0) full.push.apply(full, part);
      else full.push.apply(full, part.slice(1));
    }
    return full;
  }

  function segKey(ax, ay, bx, by) {
    if (ax < bx || (ax === bx && ay < by)) return ax + ',' + ay + '|' + bx + ',' + by;
    return bx + ',' + by + '|' + ax + ',' + ay;
  }

  function normSeg(ax, ay, bx, by) {
    if (ax < bx || (ax === bx && ay < by)) return { ax: ax, ay: ay, bx: bx, by: by };
    return { ax: bx, ay: by, bx: ax, by: ay };
  }

  function heapPush(h, item) {
    h.push(item);
    let i = h.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (h[p][0] <= h[i][0]) break;
      const tmp = h[p];
      h[p] = h[i];
      h[i] = tmp;
      i = p;
    }
  }

  function heapPop(h) {
    const top = h[0];
    const last = h.pop();
    if (h.length && last) {
      h[0] = last;
      let i = 0;
      for (;;) {
        const l = i * 2 + 1;
        const r = l + 1;
        let s = i;
        if (l < h.length && h[l][0] < h[s][0]) s = l;
        if (r < h.length && h[r][0] < h[s][0]) s = r;
        if (s === i) break;
        const tmp = h[s];
        h[s] = h[i];
        h[i] = tmp;
        i = s;
      }
    }
    return top;
  }

  function createMeta() {
    return {
      settings: { music: 0.55, sfx: 0.8, mute: false, colorblind: false, motion: false },
      best: {},
      achievements: [],
      lifetime: 0,
      tutorialDone: false,
      dailyPosted: {},
      weeklyBest: {}
    };
  }

  function bestOn(meta, cityId, mode) {
    const slot = meta.best && meta.best[cityId];
    if (!slot) return 0;
    if (mode) return slot[mode] || 0;
    return Math.max(slot.endless || 0, slot.daily || 0, slot.weekly || 0, slot.sketch || 0);
  }

  function unlocked(meta, id) {
    const city = cityById(id);
    if (!city) return false;
    if (!city.unlock) return true;
    const idx = CITIES.findIndex(c => c.id === id);
    if (idx <= 0) return true;
    const prev = CITIES[idx - 1];
    return bestOn(meta, prev.id, 'endless') >= city.unlock;
  }

  function currentWeek(run) { return run.weekIndex + 1; }

  function calendar(run) {
    const week = currentWeek(run);
    const dayIndex = Math.min(6, Math.floor((run.time - run.weekIndex * WEEK) / DAY));
    return { week: week, dayIndex: dayIndex, day: DAYS[Math.max(0, dayIndex)] };
  }

  function graceMul(run) {
    if (run.time < 10) return 0.4;
    if (run.time < 18) return 0.7;
    return 1;
  }

  function pushEvent(run, type, extra) {
    run.events.push({ type: type, extra: extra || null });
    if (run.events.length > 32) run.events.shift();
  }

  function rebuild(run) {
    const adj = new Map();
    function add(ax, ay, bx, by, meta) {
      const A = nk(ax, ay);
      const B = nk(bx, by);
      if (!adj.has(A)) adj.set(A, []);
      if (!adj.has(B)) adj.set(B, []);
      adj.get(A).push({ x: bx, y: by, ax: ax, ay: ay, bx: bx, by: by, kind: meta.kind, motor: !!meta.motor, span: meta.span || 0, id: meta.id || 0 });
      adj.get(B).push({ x: ax, y: ay, ax: bx, ay: by, bx: ax, by: by, kind: meta.kind, motor: !!meta.motor, span: meta.span || 0, id: meta.id || 0 });
    }
    for (const s of run.segs) add(s.ax, s.ay, s.bx, s.by, s);
    for (const m of run.motors) add(m.ax, m.ay, m.bx, m.by, { kind: 'motor', motor: true, id: m.id });
    run.adj = adj;
    run.graphRev = (run.graphRev || 0) + 1;
    run.pathCache = new Map();
  }

  function hasSeg(run, ax, ay, bx, by) {
    const k = segKey(ax, ay, bx, by);
    return run.segs.some(s => segKey(s.ax, s.ay, s.bx, s.by) === k);
  }

  function findSeg(run, ax, ay, bx, by) {
    const k = segKey(ax, ay, bx, by);
    return run.segs.find(s => segKey(s.ax, s.ay, s.bx, s.by) === k) || null;
  }

  function degree(run, x, y) {
    const list = run.adj.get(nk(x, y));
    return list ? list.length : 0;
  }

  function buildingCorners(b) {
    return [
      { x: b.cx, y: b.cy },
      { x: b.cx + 1, y: b.cy },
      { x: b.cx + 1, y: b.cy + 1 },
      { x: b.cx, y: b.cy + 1 }
    ];
  }

  function liveCorners(run, b) {
    return buildingCorners(b).filter(p => degree(run, p.x, p.y) > 0);
  }

function edgeSpeed(edge) {
  if (edge.motor || edge.kind === 'motor') return 6;
  if (edge.kind === 'bridge') return 3.05;
  if (edge.kind === 'tunnel') return 2.9;
  return 2.75;
}

  function adjacentSteps(city, x, y) {
    const out = [];
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (inNode(city, nx, ny)) out.push({ x: nx, y: ny });
      }
    }
    return out;
  }

  function dijkstra(run, starts, goals, mode) {
    const goalSet = new Set(goals.map(p => nk(p.x, p.y)));
    if (!starts.length || !goalSet.size) return null;
    for (const s of starts) if (goalSet.has(nk(s.x, s.y))) return [s];
    const dist = new Map();
    const prev = new Map();
    const heap = [];
    for (const s of starts) {
      const k = nk(s.x, s.y);
      dist.set(k, 0);
      heapPush(heap, [0, s.x, s.y]);
    }
    let guard = 0;
    while (heap.length && guard++ < 8000) {
      const cur = heapPop(heap);
      const cx = cur[1];
      const cy = cur[2];
      const ck = nk(cx, cy);
      if (cur[0] !== dist.get(ck)) continue;
      if (goalSet.has(ck)) {
        const path = [{ x: cx, y: cy }];
        let walk = ck;
        while (prev.has(walk)) {
          const p = prev.get(walk);
          path.push({ x: p.x, y: p.y });
          walk = nk(p.x, p.y);
        }
        path.reverse();
        return path;
      }
      const nexts = mode === 'land'
        ? adjacentSteps(run.city, cx, cy)
        : (run.adj.get(ck) || []);
      for (const n of nexts) {
        let cost = 1;
        if (mode === 'land') {
          const kind = classifyStep(run.city, run.buildings, cx, cy, n.x, n.y);
          if (kind !== 'land') continue;
          cost = hasSeg(run, cx, cy, n.x, n.y) ? 0.04 : 1;
        } else {
          const len = Math.hypot(n.x - cx, n.y - cy) || 1;
          cost = len / edgeSpeed(n);
        }
        const nkey = nk(n.x, n.y);
        const nd = cur[0] + cost;
        if (nd + 1e-9 < (dist.get(nkey) ?? 1e12)) {
          dist.set(nkey, nd);
          prev.set(nkey, { x: cx, y: cy });
          heapPush(heap, [nd, n.x, n.y]);
        }
      }
    }
    return null;
  }

  function pathBetween(run, a, b) {
    const starts = liveCorners(run, a);
    const goals = liveCorners(run, b);
    if (!starts.length || !goals.length) return null;
    const cacheKey = run.graphRev + '|' + a.id + '>' + b.id;
    if (run.pathCache.has(cacheKey)) return run.pathCache.get(cacheKey);
    const path = dijkstra(run, starts, goals, 'road');
    run.pathCache.set(cacheKey, path);
    if (run.pathCache.size > 500) run.pathCache.clear();
    return path;
  }

  function linked(run, idA, idB) {
    const a = run.buildings.find(b => b.id === idA);
    const b = run.buildings.find(b => b.id === idB);
    if (!a || !b) return false;
    const path = pathBetween(run, a, b);
    return !!(path && path.length >= 2);
  }

  function byId(run, id) { return run.buildings.find(b => b.id === id) || null; }

  function makeBuilding(run, role, color, cx, cy) {
    const id = ++run.seq;
    const dest = role === 'dest';
    return {
      id: id,
      role: role,
      color: color,
      cx: cx,
      cy: cy,
      shape: 'square',
      pins: dest ? 1.35 : 0,
      limit: 7,
      timer: 0,
      claimed: 0,
      born: run.time,
      promoteAt: dest && run.rng() < 0.55 ? run.time + 75 + run.rng() * 55 : Infinity,
      wasHot: false
    };
  }

  function makeCar(run, house) {
    return {
      id: ++run.seq,
      houseId: house.id,
      color: house.color,
      state: 'idle',
      path: null,
      i: 0,
      t: 0,
      destId: 0,
      lag: 0,
      rev: 0
    };
  }

  function nearestLand(run, cx, cy) {
    let best = null;
    let bestD = 1e9;
    for (let y = 0; y < run.city.rows; y++) {
      for (let x = 0; x < run.city.cols; x++) {
        if (run.city.terrain[y][x] !== 'land') continue;
        if (run.buildings.some(b => b.cx === x && b.cy === y)) continue;
        const d = Math.abs(x - cx) + Math.abs(y - cy);
        if (d < bestD) { bestD = d; best = { cx: x, cy: y }; }
      }
    }
    return best;
  }

  function occupied(run, cx, cy) {
    return run.buildings.some(b => b.cx === cx && b.cy === cy);
  }

  function pickCell(run, role, color) {
    const city = run.city;
    let loose = false;
    for (let pass = 0; pass < 2; pass++) {
      let bestScore = -1;
      let best = [];
      for (let cy = 0; cy < city.rows; cy++) {
        for (let cx = 0; cx < city.cols; cx++) {
          if (city.terrain[cy][cx] !== 'land') continue;
          if (occupied(run, cx, cy)) continue;
          let near = 99;
          for (const b of run.buildings) {
            const d = Math.max(Math.abs(b.cx - cx), Math.abs(b.cy - cy));
            if (d < near) near = d;
          }
          if (!loose && near < 2) continue;
          const edge = Math.min(cx, cy, city.cols - 1 - cx, city.rows - 1 - cy);
          let score = Math.min(near, 6) * 4 + edge;
          if (role === 'house') {
            // Houses settle a short drive from a shop of their colour.
            let kin = 99;
            for (const b of run.buildings) {
              if (b.color !== color || b.role !== 'dest') continue;
              kin = Math.min(kin, Math.max(Math.abs(b.cx - cx), Math.abs(b.cy - cy)));
            }
            if (kin < 99) score = 40 - Math.abs(kin - 4) * 5 + Math.min(near, 3) + edge * 0.5;
          }
          if (score > bestScore) { bestScore = score; best = [{ cx: cx, cy: cy }]; }
          else if (score === bestScore) best.push({ cx: cx, cy: cy });
        }
      }
      if (best.length) return best[Math.floor(run.rng() * best.length)];
      loose = true;
    }
    return null;
  }

  function spawnBuilding(run, forced) {
    const week = currentWeek(run);
    const colors = PALETTE.slice(0, colorCount(week));
    const counts = {};
    for (const c of colors) counts[c] = { house: 0, dest: 0 };
    for (const b of run.buildings) if (counts[b.color]) counts[b.color][b.role]++;
    let color = colors[0];
    let role = 'dest';
    if (forced) {
      color = forced.color;
      role = forced.role;
    } else {
      let missing = null;
      for (const c of colors) {
        if (counts[c].house < 1) { missing = { color: c, role: 'house' }; break; }
        if (counts[c].dest < 1) { missing = { color: c, role: 'dest' }; break; }
      }
      if (missing) {
        color = missing.color;
        role = missing.role;
      } else {
        // Keep every colour supplied: a house where cars are short of the
        // demand, otherwise a new shop on the colour with the most spare cars.
        let houseColor = null;
        let houseNeed = Infinity;
        let destColor = colors[0];
        let destSpare = -Infinity;
        for (const c of colors) {
          let weight = 0;
          for (const b of run.buildings) if (b.role === 'dest' && b.color === c) weight += b.shape === 'circle' ? 1.62 : 1;
          const ratio = counts[c].house / Math.max(1, weight);
          const jitter = run.rng() * 0.2;
          if (ratio < 1.5 && ratio + jitter < houseNeed) { houseNeed = ratio + jitter; houseColor = c; }
          if (ratio + jitter > destSpare) { destSpare = ratio + jitter; destColor = c; }
        }
        if (houseColor) { role = 'house'; color = houseColor; }
        else { role = 'dest'; color = destColor; }
      }
    }
    const cell = forced && forced.cx != null ? nearestLand(run, forced.cx, forced.cy) : pickCell(run, role, color);
    if (!cell) return null;
    const b = makeBuilding(run, role, color, cell.cx, cell.cy);
    run.buildings.push(b);
    if (role === 'house') {
      run.cars.push(makeCar(run, b));
      run.cars.push(makeCar(run, b));
    }
    pushEvent(run, 'spawn', { id: b.id, role: role, color: color });
    return b;
  }

  function capture(run) {
    return {
      segs: run.segs.map(s => ({ ax: s.ax, ay: s.ay, bx: s.bx, by: s.by, kind: s.kind, span: s.span })),
      motors: run.motors.map(m => ({ id: m.id, ax: m.ax, ay: m.ay, bx: m.bx, by: m.by, bow: m.bow })),
      lights: run.lights.map(l => ({ id: l.id, x: l.x, y: l.y })),
      rounds: run.rounds.map(r => ({ id: r.id, x: r.x, y: r.y })),
      stock: Object.assign({}, run.stock),
      spanSeq: run.spanSeq,
      placed: Object.assign({}, run.placed)
    };
  }

  function applyCapture(run, snap) {
    run.segs = snap.segs.map(s => ({ ax: s.ax, ay: s.ay, bx: s.bx, by: s.by, kind: s.kind, span: s.span }));
    run.motors = snap.motors.map(m => ({ id: m.id, ax: m.ax, ay: m.ay, bx: m.bx, by: m.by, bow: m.bow }));
    run.lights = snap.lights.map(l => ({ id: l.id, x: l.x, y: l.y }));
    run.rounds = snap.rounds.map(r => ({ id: r.id, x: r.x, y: r.y }));
    run.stock = Object.assign({}, snap.stock);
    run.spanSeq = snap.spanSeq;
    run.placed = Object.assign({}, snap.placed);
    rebuild(run);
    for (const car of run.cars) car.rev = -1;
  }

  function beginUndo(run) {
    if (run._undoOpen) return;
    run._undoSnap = capture(run);
    run._undoOpen = true;
  }

  function endUndo(run) {
    if (!run._undoOpen) return;
    run._undoOpen = false;
    const changed = JSON.stringify(capture(run)) !== JSON.stringify(run._undoSnap);
    if (changed) {
      run.undo.push(run._undoSnap);
      if (run.undo.length > 40) run.undo.shift();
      run.redo = [];
    }
    run._undoSnap = null;
  }

  function withUndo(run, fn) {
    const wrapped = !run._undoOpen;
    if (wrapped) beginUndo(run);
    const result = fn();
    if (wrapped) endUndo(run);
    return result;
  }

  function undo(run) {
    if (!run.undo.length) return false;
    run.redo.push(capture(run));
    applyCapture(run, run.undo.pop());
    return true;
  }

  function redo(run) {
    if (!run.redo.length) return false;
    run.undo.push(capture(run));
    applyCapture(run, run.redo.pop());
    return true;
  }

  function sketch(run) { return run.mode === 'sketch'; }

  function canSpend(run, key, n) {
    if (sketch(run)) return true;
    return (run.stock[key] || 0) >= n;
  }

  function spend(run, key, n) {
    if (sketch(run)) return;
    run.stock[key] -= n;
  }

  function refund(run, key, n) {
    if (sketch(run)) return;
    run.stock[key] = (run.stock[key] || 0) + n;
  }

  function spanTouching(run, x, y, kind) {
    for (const s of run.segs) {
      if (s.kind !== kind || !s.span) continue;
      if ((s.ax === x && s.ay === y) || (s.bx === x && s.by === y)) return s.span;
    }
    return 0;
  }

  function stroke(run, points) {
    const full = expandPoints(run.city, points);
    if (!full) return { ok: false, reason: 'That line leaves the map.', placed: 0 };
    return withUndo(run, () => {
      let placed = 0;
      let reason = '';
      let bridgeSpan = 0;
      let tunnelSpan = 0;
      for (let i = 0; i < full.length - 1; i++) {
        const a = full[i];
        const b = full[i + 1];
        if (hasSeg(run, a.x, a.y, b.x, b.y)) continue;
        const kind = classifyStep(run.city, run.buildings, a.x, a.y, b.x, b.y);
        if (kind === 'invalid') { reason = 'That line leaves the map.'; break; }
        if (kind === 'blocked') { reason = 'A building is in the way.'; break; }
        if (!canSpend(run, 'road', 1)) { reason = 'Out of road tiles.'; break; }
        const n = normSeg(a.x, a.y, b.x, b.y);
        if (kind === 'land') {
          spend(run, 'road', 1);
          run.segs.push({ ax: n.ax, ay: n.ay, bx: n.bx, by: n.by, kind: 'road', span: 0 });
          bridgeSpan = 0;
          tunnelSpan = 0;
          placed++;
        } else if (kind === 'water') {
          let span = spanTouching(run, a.x, a.y, 'bridge') || spanTouching(run, b.x, b.y, 'bridge') || bridgeSpan;
          if (!span) {
            if (!canSpend(run, 'bridge', 1)) { reason = 'That water needs a bridge.'; break; }
            spend(run, 'bridge', 1);
            span = ++run.spanSeq;
            run.placed.bridge = true;
          }
          spend(run, 'road', 1);
          run.segs.push({ ax: n.ax, ay: n.ay, bx: n.bx, by: n.by, kind: 'bridge', span: span });
          bridgeSpan = span;
          tunnelSpan = 0;
          placed++;
        } else if (kind === 'mountain') {
          let span = spanTouching(run, a.x, a.y, 'tunnel') || spanTouching(run, b.x, b.y, 'tunnel') || tunnelSpan;
          if (!span) {
            if (!canSpend(run, 'tunnel', 1)) { reason = 'That hill needs a tunnel.'; break; }
            spend(run, 'tunnel', 1);
            span = ++run.spanSeq;
            run.placed.tunnel = true;
          }
          spend(run, 'road', 1);
          run.segs.push({ ax: n.ax, ay: n.ay, bx: n.bx, by: n.by, kind: 'tunnel', span: span });
          tunnelSpan = span;
          bridgeSpan = 0;
          placed++;
        }
      }
      if (placed) {
        rebuild(run);
        pushEvent(run, 'build');
      }
      return { ok: placed > 0, placed: placed, reason: reason || (placed ? '' : 'Nothing new to lay.') };
    });
  }

  function previewStroke(run, points) {
    const full = expandPoints(run.city, points);
    if (!full) return { ok: false, reason: 'Off the map.', points: [], cost: 0, segs: [] };
    let roads = run.stock.road;
    let bridges = run.stock.bridge;
    let tunnels = run.stock.tunnel;
    const segs = [];
    let bridgeSpan = 0;
    let tunnelSpan = 0;
    let reason = '';
    const ghostBridges = [];
    const ghostTunnels = [];
    for (let i = 0; i < full.length - 1; i++) {
      const a = full[i];
      const b = full[i + 1];
      if (hasSeg(run, a.x, a.y, b.x, b.y)) {
        segs.push({ ax: a.x, ay: a.y, bx: b.x, by: b.y, kind: 'have', bad: false });
        continue;
      }
      const kind = classifyStep(run.city, run.buildings, a.x, a.y, b.x, b.y);
      let bad = false;
      let drawKind = kind;
      if (kind === 'invalid' || kind === 'blocked') {
        bad = true;
        reason = kind === 'blocked' ? 'A building is in the way.' : 'Off the map.';
      } else if (!sketch(run) && roads < 1) {
        bad = true;
        reason = 'Out of road tiles.';
      } else if (kind === 'water') {
        const touch = spanTouching(run, a.x, a.y, 'bridge') || spanTouching(run, b.x, b.y, 'bridge') || bridgeSpan;
        if (!touch) {
          if (!sketch(run) && bridges < 1) { bad = true; reason = 'That water needs a bridge.'; }
          else { bridges -= sketch(run) ? 0 : 1; bridgeSpan = 1; }
        }
        if (!bad) roads -= sketch(run) ? 0 : 1;
      } else if (kind === 'mountain') {
        const touch = spanTouching(run, a.x, a.y, 'tunnel') || spanTouching(run, b.x, b.y, 'tunnel') || tunnelSpan;
        if (!touch) {
          if (!sketch(run) && tunnels < 1) { bad = true; reason = 'That hill needs a tunnel.'; }
          else { tunnels -= sketch(run) ? 0 : 1; tunnelSpan = 1; }
        }
        if (!bad) roads -= sketch(run) ? 0 : 1;
      } else if (!bad) {
        roads -= sketch(run) ? 0 : 1;
        bridgeSpan = 0;
        tunnelSpan = 0;
        drawKind = 'land';
      }
      if (kind === 'water' && !bad) ghostBridges.push(1);
      if (kind === 'mountain' && !bad) ghostTunnels.push(1);
      segs.push({ ax: a.x, ay: a.y, bx: b.x, by: b.y, kind: drawKind, bad: bad });
      if (bad) break;
    }
    const any = segs.some(s => !s.bad && s.kind !== 'have');
    return {
      ok: any && segs.every(s => !s.bad),
      reason: reason,
      points: full,
      segs: segs,
      cost: segs.filter(s => !s.bad && s.kind !== 'have').length
    };
  }

  function distToSeg(px, py, ax, ay, bx, by) {
    const dx = bx - ax;
    const dy = by - ay;
    const l2 = dx * dx + dy * dy || 1;
    let t = ((px - ax) * dx + (py - ay) * dy) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(px - (ax + dx * t), py - (ay + dy * t));
  }

  function dropSpanIfOrphan(run, span, kind) {
    if (!span) return;
    if (run.segs.some(s => s.span === span && s.kind === kind)) return;
    if (kind === 'bridge') refund(run, 'bridge', 1);
    if (kind === 'tunnel') refund(run, 'tunnel', 1);
  }

  function eraseAt(run, x, y) {
    let best = null;
    let bestD = 0.48;
    for (const s of run.segs) {
      const d = distToSeg(x, y, s.ax, s.ay, s.bx, s.by);
      if (d < bestD) { bestD = d; best = { type: 'seg', item: s, d: d }; }
    }
    for (const m of run.motors) {
      const d = distToSeg(x, y, m.ax, m.ay, m.bx, m.by);
      if (d < bestD) { bestD = d; best = { type: 'motor', item: m, d: d }; }
    }
    for (const l of run.lights) {
      const d = Math.hypot(l.x - x, l.y - y);
      if (d < 0.42 && d < bestD) { bestD = d; best = { type: 'light', item: l, d: d }; }
    }
    for (const r of run.rounds) {
      const d = Math.hypot(r.x - x, r.y - y);
      if (d < 0.5 && d < bestD) { bestD = d; best = { type: 'round', item: r, d: d }; }
    }
    if (!best) return { ok: false, reason: 'Nothing there to lift.' };
    return withUndo(run, () => {
      if (best.type === 'seg') {
        const s = best.item;
        run.segs = run.segs.filter(seg => seg !== s);
        refund(run, 'road', 1);
        dropSpanIfOrphan(run, s.span, s.kind);
      } else if (best.type === 'motor') {
        run.motors = run.motors.filter(m => m !== best.item);
        refund(run, 'motorway', 1);
      } else if (best.type === 'light') {
        run.lights = run.lights.filter(l => l !== best.item);
        refund(run, 'light', 1);
      } else if (best.type === 'round') {
        run.rounds = run.rounds.filter(r => r !== best.item);
        refund(run, 'roundabout', 1);
      }
      rebuild(run);
      pushEvent(run, 'erase');
      return { ok: true };
    });
  }

  function mountainBlocks(city, x0, y0, x1, y1) {
    const len = Math.hypot(x1 - x0, y1 - y0);
    const steps = Math.max(1, Math.ceil(len * 4));
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      const x = x0 + (x1 - x0) * t;
      const y = y0 + (y1 - y0) * t;
      const cx = Math.floor(x);
      const cy = Math.floor(y);
      if (cellTerrain(city, cx, cy) === 'mountain') return true;
    }
    return false;
  }

  function placeMotorway(run, a, b) {
    if (!a || !b) return { ok: false, reason: 'Pick two points.' };
    if (a.x === b.x && a.y === b.y) return { ok: false, reason: 'That motorway is too short.' };
    if (!inNode(run.city, a.x, a.y) || !inNode(run.city, b.x, b.y)) return { ok: false, reason: 'Off the map.' };
    if (Math.hypot(b.x - a.x, b.y - a.y) < 2) return { ok: false, reason: 'Stretch it a little further.' };
    if (mountainBlocks(run.city, a.x, a.y, b.x, b.y)) return { ok: false, reason: 'Motorways cannot cross a hill.' };
    if (run.motors.length >= 9 && !sketch(run)) return { ok: false, reason: 'Nine motorways is the cap.' };
    if (!canSpend(run, 'motorway', 1)) return { ok: false, reason: 'No motorway in the pile.' };
    return withUndo(run, () => {
      spend(run, 'motorway', 1);
      const bow = (run.rng() < 0.5 ? -1 : 1) * (0.55 + run.rng() * 0.35);
      run.motors.push({ id: ++run.seq, ax: a.x, ay: a.y, bx: b.x, by: b.y, bow: bow });
      run.placed.motorway = true;
      rebuild(run);
      pushEvent(run, 'build');
      return { ok: true };
    });
  }

  function cellsTouching(x, y) {
    return [[x - 1, y - 1], [x, y - 1], [x - 1, y], [x, y]];
  }

  function placeRoundabout(run, x, y) {
    if (!inNode(run.city, x, y)) return { ok: false, reason: 'Off the map.' };
    if (run.rounds.some(r => r.x === x && r.y === y)) return { ok: false, reason: 'There is already a circle there.' };
    const cells = cellsTouching(x, y).filter(c => c[0] >= 0 && c[1] >= 0 && c[0] < run.city.cols && c[1] < run.city.rows);
    if (!cells.length) return { ok: false, reason: 'Too close to the edge.' };
    for (const c of cells) {
      if (run.city.terrain[c[1]][c[0]] !== 'land') return { ok: false, reason: 'Roundabouts sit on open ground.' };
      if (occupied(run, c[0], c[1])) return { ok: false, reason: 'A building is too close.' };
    }
    if (!canSpend(run, 'roundabout', 1)) return { ok: false, reason: 'No roundabout in the pile.' };
    return withUndo(run, () => {
      spend(run, 'roundabout', 1);
      run.rounds.push({ id: ++run.seq, x: x, y: y });
      run.placed.roundabout = true;
      pushEvent(run, 'build');
      return { ok: true };
    });
  }

  function placeLight(run, x, y) {
    if (!inNode(run.city, x, y)) return { ok: false, reason: 'Off the map.' };
    if (run.lights.some(l => l.x === x && l.y === y)) return { ok: false, reason: 'A light is already there.' };
    if (degree(run, x, y) < 3) return { ok: false, reason: 'Lights belong on a junction.' };
    if (!canSpend(run, 'light', 1)) return { ok: false, reason: 'No traffic light in the pile.' };
    return withUndo(run, () => {
      spend(run, 'light', 1);
      run.lights.push({ id: ++run.seq, x: x, y: y });
      run.placed.light = true;
      pushEvent(run, 'build');
      return { ok: true };
    });
  }

  function connectBuildings(run, idA, idB) {
    const a = byId(run, idA);
    const b = byId(run, idB);
    if (!a || !b) return { ok: false, reason: 'Missing building.' };
    const path = dijkstra(run, buildingCorners(a), buildingCorners(b), 'land');
    if (!path || path.length < 2) return { ok: false, reason: 'No land route.' };
    return stroke(run, path);
  }

  function lightAt(run, x, y) {
    return run.lights.some(l => l.x === x && l.y === y);
  }

  function roundAt(run, x, y) {
    return run.rounds.some(r => r.x === x && r.y === y);
  }

  function axisOf(from, to) {
    return Math.abs(to.x - from.x) >= Math.abs(to.y - from.y) ? 0 : 1;
  }

  function junctionState(run, from, to) {
    const deg = degree(run, to.x, to.y);
    const light = lightAt(run, to.x, to.y);
    const round = roundAt(run, to.x, to.y);
    if (deg < 3 && !light && !round) return { hold: false, dwell: 0 };
    if (light) {
      const phase = Math.floor(run.time / 3.4) % 2;
      if (axisOf(from, to) !== phase) return { hold: true, dwell: 0 };
    }
    const rec = run.nodeHold.get(nk(to.x, to.y));
    if (rec && rec > run.time) return { hold: true, dwell: 0 };
    return { hold: false, dwell: round ? 0.06 : 0.22 };
  }

  function releaseClaim(run, car) {
    if (!car.destId) return;
    const dest = byId(run, car.destId);
    if (dest) dest.claimed = Math.max(0, dest.claimed - 1);
    car.destId = 0;
  }

  function park(run, car) {
    releaseClaim(run, car);
    car.state = 'idle';
    car.path = null;
    car.i = 0;
    car.t = 0;
    car.lag = 0.08;
    car.rev = run.graphRev;
  }

  function ensurePath(run, car) {
    if (car.rev === run.graphRev && car.path && car.path[car.i + 1]) return true;
    const house = byId(run, car.houseId);
    if (!house) { park(run, car); return false; }
    if (car.state === 'out') {
      const dest = byId(run, car.destId);
      if (!dest) { park(run, car); return false; }
      const path = pathBetween(run, house, dest);
      if (!path || path.length < 2) { park(run, car); return false; }
      car.path = path;
      car.i = 0;
      car.t = 0;
      car.rev = run.graphRev;
      return true;
    }
    if (car.state === 'back') {
      const starts = car.path && car.path[car.i] ? [car.path[car.i]] : liveCorners(run, house);
      const goals = liveCorners(run, house);
      let path = null;
      if (starts.length && goals.length) path = dijkstra(run, starts, goals, 'road');
      if (!path) path = pathBetween(run, house, house);
      if (!path) { park(run, car); return false; }
      if (path.length < 2) { park(run, car); return false; }
      car.path = path;
      car.i = 0;
      car.t = 0;
      car.rev = run.graphRev;
      return true;
    }
    return false;
  }

  function arrive(run, car) {
    if (car.state === 'out') {
      const dest = byId(run, car.destId);
      if (dest && dest.pins > 0.2) {
        dest.pins = Math.max(0, dest.pins - 1);
        if (dest.timer > 0) dest.timer = Math.max(0, dest.timer - 0.18);
        run.score += 1;
        pushEvent(run, 'trip', { id: dest.id, color: dest.color, x: dest.cx + 0.5, y: dest.cy + 0.5 });
        run.floaters.push({ x: dest.cx + 0.5, y: dest.cy + 0.15, age: 0, text: '+1' });
        if (run.floaters.length > 16) run.floaters.shift();
      }
      releaseClaim(run, car);
      car.state = 'back';
      car.rev = -1;
      if (!ensurePath(run, car)) return;
      return;
    }
    park(run, car);
  }

  function advance(run, car, ahead, dt, hops) {
    if (hops > 5 || car.state === 'idle') return;
    const a = car.path[car.i];
    const b = car.path[car.i + 1];
    if (!a || !b) { arrive(run, car); return; }
    const list = run.adj.get(nk(a.x, a.y)) || [];
    const edge = list.find(e => e.x === b.x && e.y === b.y);
    if (!edge) { car.rev = -1; ensurePath(run, car); return; }
    const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
    let speed = edgeSpeed(edge);
    const junc = junctionState(run, a, b);
    if (junc.hold || (degree(run, b.x, b.y) >= 3 && car.t > 0.72)) speed *= 0.72;
    let maxT = 1;
    if (ahead && ahead.state !== 'idle' && ahead.path && ahead.path[ahead.i] && ahead.path[ahead.i + 1]
      && ahead.path[ahead.i].x === a.x && ahead.path[ahead.i].y === a.y
      && ahead.path[ahead.i + 1].x === b.x && ahead.path[ahead.i + 1].y === b.y) {
      maxT = Math.min(maxT, ahead.t - (0.48 / len));
    }
    if (junc.hold) maxT = Math.min(maxT, 0.9);
    if (maxT < 0) maxT = 0;
    const nt = car.t + (speed * dt) / len;
    if (nt < maxT || (maxT < 1 && nt >= maxT)) {
      car.t = Math.max(car.t, Math.min(nt, maxT));
      return;
    }
    if (junc.hold) {
      car.t = Math.min(Math.max(car.t, 0), 0.9);
      return;
    }
    if (junc.dwell > 0) run.nodeHold.set(nk(b.x, b.y), run.time + junc.dwell);
    const leftover = Math.max(0, (nt - 1) * len);
    car.i += 1;
    car.t = 0;
    if (!car.path[car.i + 1]) { arrive(run, car); return; }
    if (leftover > 0.001 && car.state !== 'idle') {
      const sp = Math.max(0.4, speed);
      advance(run, car, null, leftover / sp, hops + 1);
    }
  }

function stepCars(run, dt) {
  const groups = new Map();
  for (const car of run.cars) {
    if (car.lag > 0) car.lag = Math.max(0, car.lag - dt);
    if (car.state === 'idle' || car.lag > 0) continue;
      if (!ensurePath(run, car)) continue;
      if (car.state === 'idle' || !car.path || !car.path[car.i + 1]) continue;
      const a = car.path[car.i];
      const b = car.path[car.i + 1];
      const k = nk(a.x, a.y) + '>' + nk(b.x, b.y);
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k).push(car);
    }
    for (const list of groups.values()) {
      list.sort((a, b) => b.t - a.t);
      for (let i = 0; i < list.length; i++) {
        const ahead = i === 0 ? null : list[i - 1];
        advance(run, list[i], ahead, dt, 0);
      }
    }
  }

  function pickDest(run, house) {
    const options = [];
    for (const d of run.buildings) {
      if (d.role !== 'dest' || d.color !== house.color) continue;
      const open = d.pins - d.claimed;
      if (d.timer <= 0 && open < 0.45) continue;
      const path = pathBetween(run, house, d);
      if (!path || path.length < 2) continue;
      options.push({ d: d, path: path, open: open });
    }
    options.sort((a, b) => {
      const at = a.d.timer > 0 ? 1 : 0;
      const bt = b.d.timer > 0 ? 1 : 0;
      if (at !== bt) return bt - at;
      if (Math.abs(b.d.pins - a.d.pins) > 0.2) return b.d.pins - a.d.pins;
      return a.path.length - b.path.length;
    });
    return options[0] || null;
  }

  function dispatch(run) {
    const houses = run.buildings.filter(b => b.role === 'house');
    for (const house of houses) {
      const idle = run.cars.filter(c => c.houseId === house.id && c.state === 'idle' && c.lag <= 0);
      let n = 0;
      for (const car of idle) {
        const job = pickDest(run, house);
        if (!job) break;
        car.state = 'out';
        car.path = job.path;
        car.i = 0;
        car.t = 0;
        car.destId = job.d.id;
        car.rev = run.graphRev;
        car.lag = n * 0.32;
        job.d.claimed += 1;
        n++;
      }
    }
  }

  function updatePins(run, dt) {
    const week = currentWeek(run);
    const mul = (run.mod ? run.mod.pin : 1) * graceMul(run);
    for (const d of run.buildings) {
      if (d.role !== 'dest') continue;
      if (d.shape === 'square' && run.time >= d.promoteAt && week >= 3) {
        d.shape = 'circle';
        d.limit = 10;
        d.born = run.time;
        d.promoteAt = Infinity;
        pushEvent(run, 'promote', { id: d.id, color: d.color });
      }
      const rate = pinRate(week, d.shape) * mul;
      d.pins += rate * dt;
      if (d.pins > d.limit) {
        d.timer += dt / TIMER;
        if (d.timer > 0.2) d.wasHot = true;
        if (d.timer >= 0.35 && !d.ticked) {
          d.ticked = true;
          pushEvent(run, 'warn', { id: d.id, color: d.color });
        }
        if (d.timer >= 1) {
          d.timer = 1;
          run.phase = 'over';
          run.overId = d.id;
          const name = COLOR[d.color] ? d.color : '';
          run.reason = 'The ring filled on ' + (/^[aeiou]/.test(name) ? 'an ' : 'a ') + (name ? name + ' ' : '') + 'destination.';
          pushEvent(run, 'over', { id: d.id, color: d.color });
          return;
        }
      } else if (d.timer > 0) {
        d.timer = Math.max(0, d.timer - dt / 3.2);
        d.ticked = false;
        if (d.wasHot && d.timer === 0) {
          d.wasHot = false;
          run.savedRing = true;
          pushEvent(run, 'saved', { id: d.id });
        }
      }
    }
  }

  function stepSim(run, dt) {
    run.time += dt;
    if (run.nextSpawn == null) run.nextSpawn = 16;
    run.nextSpawn -= dt;
    if (run.nextSpawn <= 0) {
      spawnBuilding(run);
      run.nextSpawn = spawnEvery(currentWeek(run));
    }
    stepCars(run, dt);
    dispatch(run);
    updatePins(run, dt);
    for (const f of run.floaters) f.age += dt;
    run.floaters = run.floaters.filter(f => f.age < 0.9);
  }

  function makeOffer(run) {
    const rng = run.rng;
    const specials = ['light', 'roundabout', 'motorway'];
    if (run.city.hasWater) specials.push('bridge');
    if (run.city.hasMountain) specials.push('tunnel');
    const tool = specials[Math.floor(rng() * specials.length)];
    const count = tool === 'light' ? 2 : 1;
    const roadsOnly = 18 + Math.floor(rng() * 8);
    const withTool = 12 + Math.floor(rng() * 5);
    const cards = [
      { roads: roadsOnly, tool: null, count: 0 },
      { roads: withTool, tool: tool, count: count }
    ];
    if (rng() < 0.5) cards.reverse();
    for (const card of cards) {
      if (!card.tool) card.label = card.roads + ' road tiles';
      else {
        const noun = card.count > 1 ? TOOL_NAME[card.tool] + 's' : TOOL_NAME[card.tool];
        card.label = card.roads + ' road tiles and ' + card.count + ' ' + noun;
      }
      card.detail = card.tool ? toolBlurb(card.tool) : 'More ordinary road, and nothing else.';
    }
    return cards;
  }

  function toolBlurb(tool) {
    if (tool === 'bridge') return 'One bridge crosses a whole stretch of water.';
    if (tool === 'tunnel') return 'One tunnel crosses a whole stretch of hill.';
    if (tool === 'light') return 'A junction takes turns, one axis at a time.';
    if (tool === 'roundabout') return 'Cars barely pause. It needs empty ground around it.';
    if (tool === 'motorway') return 'A fast thread from one point to another. Hills still stop it.';
    return '';
  }

  function openUpgrade(run) {
    run.phase = 'upgrade';
    run.offer = makeOffer(run);
    pushEvent(run, 'sunday');
  }

  function spawnWeekWave(run) {
    const week = currentWeek(run);
    const n = colorCount(week);
    const prev = colorCount(week - 1);
    if (n > prev) {
      const color = PALETTE[n - 1];
      spawnBuilding(run, { role: 'house', color: color });
      spawnBuilding(run, { role: 'dest', color: color });
    }
  }

  function chooseUpgrade(run, index) {
    if (run.phase !== 'upgrade') return { ok: false, reason: 'It is not Sunday.' };
    const card = run.offer && run.offer[index];
    if (!card) return { ok: false, reason: 'That card is not on the table.' };
    if (!sketch(run)) {
      run.stock.road += card.roads;
      if (card.tool) run.stock[card.tool] = (run.stock[card.tool] || 0) + card.count;
    }
    run.weekIndex += 1;
    run.offer = null;
    run.phase = 'play';
    spawnWeekWave(run);
    pushEvent(run, 'upgrade', { label: card.label });
    return { ok: true, card: card };
  }

  function tick(run, dt) {
    if (!run || !(dt > 0) || run.phase !== 'play') return run;
    let left = dt;
    let guard = 0;
    while (left > 1e-8 && run.phase === 'play' && guard++ < 20000) {
      const room = (run.weekIndex + 1) * WEEK - run.time;
      const step = Math.min(left, 0.05, Math.max(room, 0));
      if (step <= 1e-8) { openUpgrade(run); break; }
      stepSim(run, step);
      left -= step;
      if (run.phase === 'play' && run.time >= (run.weekIndex + 1) * WEEK - 1e-6) openUpgrade(run);
    }
    return run;
  }

  function give(meta, id, granted) {
    if (!meta.achievements.includes(id)) {
      meta.achievements.push(id);
      granted.push(id);
    }
  }

  function bank(meta, run) {
    const granted = [];
    if (!run) return granted;
    const add = run.score - (run.banked || 0);
    if (add > 0) {
      meta.lifetime = (meta.lifetime || 0) + add;
      run.banked = run.score;
    }
    if (!meta.best[run.cityId]) meta.best[run.cityId] = { endless: 0, daily: 0, weekly: 0, sketch: 0 };
    const slot = meta.best[run.cityId];
    const mode = run.mode === 'sketch' ? 'sketch' : run.mode;
    slot[mode] = Math.max(slot[mode] || 0, run.score);
    if (run.mode === 'daily' && run.phase === 'over' && run.dayKey && meta.dailyPosted[run.dayKey] == null) {
      meta.dailyPosted[run.dayKey] = run.score;
      give(meta, 'daily', granted);
    }
    if (run.mode === 'weekly' && run.weekKey) {
      meta.weeklyBest[run.weekKey] = Math.max(meta.weeklyBest[run.weekKey] || 0, run.score);
    }
    if (run.score >= 1) give(meta, 'first-trip', granted);
    if (currentWeek(run) >= 2) give(meta, 'week-two', granted);
    if (currentWeek(run) >= 4) give(meta, 'week-four', granted);
    if (run.score >= 200) give(meta, 'score-200', granted);
    if (run.score >= 500) give(meta, 'score-500', granted);
    if (run.savedRing) give(meta, 'saved-ring', granted);
    if (run.placed.bridge) give(meta, 'bridge', granted);
    if (run.placed.tunnel) give(meta, 'tunnel', granted);
    if (run.placed.roundabout) give(meta, 'round', granted);
    if (run.placed.motorway) give(meta, 'motor', granted);
    if (run.placed.light) give(meta, 'light', granted);
    if (run.mode === 'sketch') give(meta, 'sketch', granted);
    if ((meta.lifetime || 0) >= 1000) give(meta, 'lifetime-1000', granted);
    if (CITIES.every(c => unlocked(meta, c.id))) give(meta, 'all-cities', granted);
    return granted;
  }

  function modFor(seed) {
    return MODS[seed % MODS.length];
  }

  function startRun(meta, cityId, mode, opts) {
    const city = cityById(cityId);
    if (!city) return null;
    const kind = mode || 'endless';
    if (kind === 'endless' && meta && !unlocked(meta, cityId)) return null;
    const opt = opts || {};
    let seed = opt.seed;
    let dayKey = '';
    let weekKeyStr = '';
    let mod = MODS[0];
    if (kind === 'daily') {
      dayKey = opt.dayKey || dailyKey();
      seed = seed == null ? dailySeed(dayKey) : seed;
      mod = modFor(seed);
    } else if (kind === 'weekly') {
      weekKeyStr = opt.weekKey || weeklyKey();
      seed = seed == null ? weeklySeed(weekKeyStr) : seed;
      mod = modFor(Math.floor(seed / 3));
    } else if (seed == null) {
      seed = (Date.now() % 1000000000) >>> 0;
    }
    const rng = mulberry32(seed >>> 0);
    const roads = Math.max(24, Math.round(city.roads * (kind === 'sketch' ? 1 : mod.roads)));
    const run = {
      version: 1,
      cityId: city.id,
      city: city,
      mode: kind,
      seed: seed >>> 0,
      dayKey: dayKey,
      weekKey: weekKeyStr,
      mod: kind === 'endless' || kind === 'sketch' ? MODS[0] : mod,
      rng: rng,
      time: 0,
      weekIndex: 0,
      score: 0,
      banked: 0,
      phase: 'play',
      reason: '',
      overId: 0,
      seq: 1,
      spanSeq: 1,
      buildings: [],
      cars: [],
      segs: [],
      motors: [],
      lights: [],
      rounds: [],
      stock: {
        road: roads,
        bridge: city.bridges,
        tunnel: city.tunnels,
        light: 0,
        roundabout: 0,
        motorway: 0
      },
      placed: { bridge: false, tunnel: false, roundabout: false, motorway: false, light: false },
      savedRing: false,
      nextSpawn: 26,
      offer: null,
      events: [],
      floaters: [],
      undo: [],
      redo: [],
      nodeHold: new Map(),
      adj: new Map(),
      pathCache: new Map(),
      graphRev: 1,
      _undoOpen: false,
      _undoSnap: null
    };
    for (const o of city.openings) spawnBuilding(run, o);
    rebuild(run);
    if (kind === 'sketch' && meta) bank(meta, run);
    return run;
  }

  function packRun(run) {
    if (!run) return null;
    return {
      version: 1,
      cityId: run.cityId,
      mode: run.mode,
      seed: run.seed,
      dayKey: run.dayKey,
      weekKey: run.weekKey,
      mod: run.mod,
      rngState: run.rng.state(),
      time: run.time,
      weekIndex: run.weekIndex,
      score: run.score,
      banked: run.banked,
      phase: run.phase,
      reason: run.reason,
      overId: run.overId,
      seq: run.seq,
      spanSeq: run.spanSeq,
      buildings: run.buildings,
      cars: run.cars,
      segs: run.segs,
      motors: run.motors,
      lights: run.lights,
      rounds: run.rounds,
      stock: run.stock,
      placed: run.placed,
      savedRing: run.savedRing,
      nextSpawn: run.nextSpawn,
      offer: run.offer
    };
  }

  function restoreRun(data) {
    const city = cityById(data.cityId);
    if (!city || !data.buildings || !data.stock) return null;
    const rng = mulberry32(data.seed || 1);
    if (data.rngState != null) rng.set(data.rngState);
    const run = {
      version: 1,
      cityId: city.id,
      city: city,
      mode: data.mode || 'endless',
      seed: data.seed || 1,
      dayKey: data.dayKey || '',
      weekKey: data.weekKey || '',
      mod: data.mod || MODS[0],
      rng: rng,
      time: data.time || 0,
      weekIndex: data.weekIndex || 0,
      score: data.score || 0,
      banked: data.banked || 0,
      phase: data.phase || 'play',
      reason: data.reason || '',
      overId: data.overId || 0,
      seq: data.seq || 1,
      spanSeq: data.spanSeq || 1,
      buildings: data.buildings,
      cars: data.cars || [],
      segs: data.segs || [],
      motors: data.motors || [],
      lights: data.lights || [],
      rounds: data.rounds || [],
      stock: data.stock,
      placed: data.placed || { bridge: false, tunnel: false, roundabout: false, motorway: false, light: false },
      savedRing: !!data.savedRing,
      nextSpawn: data.nextSpawn == null ? 18 : data.nextSpawn,
      offer: data.offer || null,
      events: [],
      floaters: [],
      undo: [],
      redo: [],
      nodeHold: new Map(),
      adj: new Map(),
      pathCache: new Map(),
      graphRev: 1,
      _undoOpen: false,
      _undoSnap: null
    };
    rebuild(run);
    return run;
  }

  function encode(state) {
    return JSON.stringify({ version: 1, meta: state.meta, run: packRun(state.run) });
  }

  function decode(raw) {
    let data;
    try { data = JSON.parse(raw); } catch (err) { return { ok: false }; }
    if (!data || data.version !== 1 || !data.meta || typeof data.meta !== 'object') return { ok: false };
    const meta = createMeta();
    if (data.meta.settings) Object.assign(meta.settings, data.meta.settings);
    meta.best = data.meta.best && typeof data.meta.best === 'object' ? data.meta.best : {};
    meta.achievements = Array.isArray(data.meta.achievements) ? data.meta.achievements.slice() : [];
    meta.lifetime = data.meta.lifetime || 0;
    meta.tutorialDone = !!data.meta.tutorialDone;
    meta.dailyPosted = data.meta.dailyPosted && typeof data.meta.dailyPosted === 'object' ? data.meta.dailyPosted : {};
    meta.weeklyBest = data.meta.weeklyBest && typeof data.meta.weeklyBest === 'object' ? data.meta.weeklyBest : {};
    let run = null;
    if (data.run) {
      run = restoreRun(data.run);
      if (!run) return { ok: false };
    }
    return { ok: true, meta: meta, run: run };
  }

  function toolLabel(id) { return TOOL_NAME[id] || id; }

  return {
    SAVE_KEY: SAVE_KEY,
    WEEK: WEEK,
    DAY: DAY,
    PALETTE: PALETTE,
    COLOR: COLOR,
    CITIES: CITIES,
    ACHIEVEMENTS: ACHIEVEMENTS,
    MODS: MODS,
    cityById: cityById,
    createMeta: createMeta,
    unlocked: unlocked,
    bestOn: bestOn,
    startRun: startRun,
    tick: tick,
    stroke: stroke,
    previewStroke: previewStroke,
    eraseAt: eraseAt,
    placeMotorway: placeMotorway,
    placeRoundabout: placeRoundabout,
    placeLight: placeLight,
    connectBuildings: connectBuildings,
    linked: linked,
    beginUndo: beginUndo,
    endUndo: endUndo,
    undo: undo,
    redo: redo,
    chooseUpgrade: chooseUpgrade,
    pinRate: pinRate,
    calendar: calendar,
    currentWeek: currentWeek,
    bank: bank,
    encode: encode,
    decode: decode,
    dailyKey: dailyKey,
    weeklyKey: weeklyKey,
    dailySeed: dailySeed,
    weeklySeed: weeklySeed,
    colorCount: colorCount,
    toolLabel: toolLabel,
    toolBlurb: toolBlurb,
    classifyStep: classifyStep
  };
});
