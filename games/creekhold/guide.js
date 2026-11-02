/* Creekhold — the guided first colony, field notes and gentle warnings.
   Pure helpers on top of the engine so the steps can be checked without a browser. */
(function (root, factory) {
  const api = factory(typeof module === 'object' && module.exports ? require('./engine.js') : root.CreekholdEngine);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.CreekholdGuide = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (E) {
  'use strict';

  const DIRS = [[0, 1], [1, 0], [-1, 0], [0, -1]];

  function get(run, x, y) { return E.get(run, x, y); }
  function fresh(run) { E.canReach(run, run.hx, run.hy, E.DEF.path); }
  function md(ax, ay, bx, by) { return Math.abs(ax - bx) + Math.abs(ay - by); }

  function count(run, ids, builtOnly) {
    let n = 0;
    for (let i = 0; i < run.cells.length; i++) {
      const b = run.cells[i].building;
      if (b && ids.indexOf(b.id) >= 0 && (!builtOnly || b.progress >= 1)) n++;
    }
    return n;
  }
  function first(run, ids) {
    for (let i = 0; i < run.cells.length; i++) {
      const b = run.cells[i].building;
      if (b && ids.indexOf(b.id) >= 0) return run.cells[i];
    }
    return null;
  }
  function housingId(run) { return run.faction === 'cog' ? 'bunk' : 'lodge'; }
  function startHousing(run) { return run.faction === 'cog' ? 1 : 2; }

  function wet(c) { return !!c && c.water > 0.05; }
  // A bank tile is dry ground with river water right beside it, one step lower or level.
  function bankWater(run, c) {
    for (let i = 0; i < DIRS.length; i++) {
      const n = get(run, c.x + DIRS[i][0], c.y + DIRS[i][1]);
      if (n && wet(n) && n.ground <= c.ground && n.bad < 0.4) return n;
    }
    return null;
  }
  function open(c) { return !c.building && !c.tree && c.water <= 0.05; }

  // Shortest run of free tiles (same level, no trees) from the planned paths to a goal tile.
  function route(run, isGoal, avoid) {
    fresh(run);
    const plan = run.plan;
    const prev = new Map();
    const q = [];
    for (let i = 0; i < run.cells.length; i++) {
      const c = run.cells[i];
      if (!plan.has(c.x + ',' + c.y)) continue;
      if (isGoal(c)) return [];
      prev.set(c.x + ',' + c.y, null);
      q.push(c);
    }
    let head = 0;
    while (head < q.length) {
      const c = q[head++];
      for (let i = 0; i < DIRS.length; i++) {
        const n = get(run, c.x + DIRS[i][0], c.y + DIRS[i][1]);
        if (!n) continue;
        const k = n.x + ',' + n.y;
        if (prev.has(k) || !open(n) || E.walkZ(n) !== E.walkZ(c)) continue;
        if (avoid && avoid(n)) continue;
        prev.set(k, c);
        if (isGoal(n)) {
          const out = [];
          let at = n;
          while (at && !plan.has(at.x + ',' + at.y)) { out.unshift({ x: at.x, y: at.y }); at = prev.get(at.x + ',' + at.y); }
          return out;
        }
        q.push(n);
      }
    }
    return null;
  }

  function isBank(run, c) { return !!bankWater(run, c) && open(c); }
  function pathOnBank(run) {
    for (let i = 0; i < run.cells.length; i++) {
      const c = run.cells[i];
      const b = c.building;
      if (b && (b.id === 'path' || b.id === 'stairs') && bankWater(run, c)) return c;
    }
    return null;
  }

  function spots(run, id, score, limit) {
    const out = [];
    for (let i = 0; i < run.cells.length; i++) {
      const c = run.cells[i];
      const st = E.preview(run, id, c.x, c.y);
      if (!st.ok) continue;
      const s = score ? score(c) : 0;
      if (s === null) continue;
      out.push({ x: c.x, y: c.y, s: s + md(c.x, c.y, run.hx, run.hy) * 0.01 });
    }
    out.sort(function (a, b) { return a.s - b.s; });
    return out.slice(0, limit || 3).map(function (p) { return { x: p.x, y: p.y }; });
  }

  function near(run, c, r, test) {
    let n = 0;
    for (let dy = -5; dy <= 5; dy++) for (let dx = -5; dx <= 5; dx++) {
      const o = get(run, c.x + dx, c.y + dy);
      if (o && Math.hypot(dx, dy) <= r && test(o)) n++;
    }
    return n;
  }

  // Which way the river runs: from its sources toward its outlets.
  function flowAxis(run) {
    let sx = 0, sy = 0, sn = 0, ox = 0, oy = 0, on = 0;
    for (let i = 0; i < run.cells.length; i++) {
      const c = run.cells[i];
      if (c.source > 0) { sx += c.x; sy += c.y; sn++; }
      if (c.outlet) { ox += c.x; oy += c.y; on++; }
    }
    if (!sn || !on) return { axis: 'x', dir: 1 };
    const dx = ox / on - sx / sn, dy = oy / on - sy / sn;
    return Math.abs(dx) >= Math.abs(dy) ? { axis: 'x', dir: dx >= 0 ? 1 : -1 } : { axis: 'y', dir: dy >= 0 ? 1 : -1 };
  }

  // A full line of stick dams across the channel, a few tiles downstream of the first pump.
  function damLine(run) {
    const pump = first(run, ['pump', 'deep-pump']);
    if (!pump) return null;
    const w = bankWater(run, pump);
    if (!w) return null;
    const f = flowAxis(run);
    const across = { x: w.x - pump.x, y: w.y - pump.y };
    if ((f.axis === 'x' && across.x !== 0) || (f.axis === 'y' && across.y !== 0)) return null;
    for (let off = 3; off <= 7; off++) {
      const bx = f.axis === 'x' ? pump.x + f.dir * off : pump.x;
      const by = f.axis === 'y' ? pump.y + f.dir * off : pump.y;
      const bank = get(run, bx, by);
      if (!bank || bank.ground !== pump.ground) continue;
      if (bank.tree || (bank.building && bank.building.id !== 'path' && bank.building.id !== 'stairs')) continue;
      const cells = [];
      let ok = true;
      for (let k = 1; k < 12; k++) {
        const c = get(run, bx + across.x * k, by + across.y * k);
        if (!c || (c.ground >= pump.ground && !wet(c))) break;
        if (c.tree || (c.building && c.building.id !== 'dam')) { ok = false; break; }
        cells.push({ x: c.x, y: c.y });
      }
      if (ok && cells.length >= 2) return { bank: { x: bx, y: by }, cells: cells };
    }
    return null;
  }
  function damsDone(run, line) {
    for (let i = 0; i < line.cells.length; i++) {
      const c = get(run, line.cells[i].x, line.cells[i].y);
      if (!c.building || c.building.id !== 'dam') return false;
    }
    return true;
  }
  function inPlan(run, p) { fresh(run); return run.plan.has(p.x + ',' + p.y); }

  function tap(ctx) { return ctx && ctx.touch ? 'Tap' : 'Click'; }
  function low(text) { return text.charAt(0).toLowerCase() + text.slice(1); }

  function affordable(run, def) {
    const cost = def.cost || {};
    return Object.keys(cost).every(function (k) { return (run.store[k] || 0) >= cost[k]; });
  }

  // Where a building should go: glowing spots it can sit on now, or the path it still needs,
  // or a note that the colony is short of materials.
  function guidePlace(run, id, score, limit) {
    const def = E.DEF[id];
    if (!def || !run.unlocked[id]) return { mode: 'locked', targets: [] };
    if (!affordable(run, def)) return { mode: 'short', targets: [] };
    const here = spots(run, id, score, limit);
    if (here.length) return { mode: 'place', targets: here };
    const way = route(run, function (c) { return open(c) && score(c) !== null && E.walkZ(c) === E.walkZ(get(run, run.hx, run.hy)); });
    if (way && way.length > 1) { way.pop(); return { mode: 'path', targets: way }; }
    return { mode: 'place', targets: [] };
  }

  function placeStep(o) {
    function plan(run) { return guidePlace(run, typeof o.piece === 'function' ? o.piece(run) : o.piece, function (c) { return o.score(run, c); }, o.limit); }
    return {
      id: o.id, kind: 'do', title: o.title,
      plan: plan,
      glow: function (run) {
        const p = plan(run);
        if (p.mode === 'path') return { cat: 'paths', piece: 'path' };
        if (p.mode === 'short') return { speed: true };
        return { cat: o.cat, piece: typeof o.piece === 'function' ? o.piece(run) : o.piece };
      },
      body: function (ctx, run) {
        const text = typeof o.text === 'function' ? o.text(ctx, run) : o.text;
        if (!run) return text;
        const p = plan(run);
        const def = E.DEF[typeof o.piece === 'function' ? o.piece(run) : o.piece];
        if (p.mode === 'path') return (o.why || '') + 'First, extend your footpath to the glowing tiles. ' + def.name + ' has to touch a path.';
        if (p.mode === 'short') return (o.why || '') + def.name + ' costs ' + costText(def) + ' and you are short. Keep time running while your timber mark brings logs home.';
        return text;
      },
      targets: function (run) { return plan(run).targets; },
      done: o.done
    };
  }

  /* Each step: kind 'info' waits for Next; kind 'do' moves on by itself when done() is true.
     glow names the dock group, piece, or control to pulse; targets() lists tiles to light up. */
  const STEPS = [
    {
      id: 'welcome', kind: 'info', title: 'Welcome to Creekhold',
      body: function () { return 'You look after a colony of nibs, little river builders. Keep them watered, fed and housed. Every few days the river dries up, so you will store water before it does. Time is paused while you learn.'; }
    },
    {
      id: 'look', kind: 'do', title: 'Look around', next: 'Next',
      body: function (ctx) {
        return ctx.touch
          ? 'Drag one finger to move the map. Pinch to zoom. Try it now.'
          : 'Hold the right mouse button and drag (or use W A S D) to move the map. Scroll to zoom. Q and E turn the view. Try it now.';
      },
      start: function (run, st, ctx) { st.cam = { x: ctx.cam.x, y: ctx.cam.y, zoom: ctx.cam.zoom, rot: ctx.cam.rot }; },
      done: function (run, st, ctx) {
        const a = st.cam, b = ctx && ctx.cam;
        if (!a || !b) return false;
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) > 60 || Math.abs(a.zoom - b.zoom) > 0.08 || a.rot !== b.rot;
      }
    },
    {
      id: 'path', kind: 'do', title: 'Lay a footpath to the river',
      glow: { cat: 'paths', piece: 'path' },
      body: function (ctx) { return 'Nibs can only build things joined to the hearth by a footpath. Footpaths are free. ' + tap(ctx) + ' each glowing tile to lay a path from the hearth down to the riverbank.' + (ctx.touch ? ' Hold and drag to paint a line.' : ' You can also drag to paint a line.'); },
      targets: function (run) { return route(run, function (c) { return isBank(run, c); }) || []; },
      done: function (run) { return !!pathOnBank(run); }
    },
    placeStep({
      id: 'pump', title: 'Build a water pump', cat: 'water', piece: 'pump', limit: 2,
      text: function (ctx) { return 'Open 2 Water and pick Paw pump (8 logs). ' + tap(ctx) + ' a glowing tile on the riverbank next to your path. The pump lifts clean river water into your store.'; },
      score: function (run, c) {
        const w = bankWater(run, c);
        if (!w) return null;
        const f = flowAxis(run);
        return (f.axis === 'x' ? c.x : c.y) * f.dir * 0.05 - w.water;
      },
      done: function (run) { return count(run, ['pump', 'deep-pump']) >= 1; }
    }),
    placeStep({
      id: 'tank', title: 'Add a water tank', cat: 'water', piece: 'tank',
      text: function (ctx) { return 'Nibs drink stored water, not the river. Pick Clay tank (6 logs) and ' + low(tap(ctx)) + ' a glowing tile beside the path. Each tank keeps 80 more water for dry days.'; },
      score: function (run, c) { return bankWater(run, c) ? null : 0; },
      done: function (run) { return count(run, ['tank', 'cistern']) >= 1; }
    }),
    {
      id: 'play', kind: 'do', title: 'Start the clock',
      glow: { speed: true },
      body: function () { return 'Press ▶ (or Space) to start time. Free nibs walk out and build each frame. Pause with ❚❚ whenever you want to plan. Wait here until the pump is built.'; },
      status: function (run) {
        const p = first(run, ['pump', 'deep-pump']);
        return p ? 'Pump: ' + Math.round(Math.min(1, p.building.progress) * 100) + '% built' : '';
      },
      done: function (run) { return count(run, ['pump', 'deep-pump'], true) >= 1; }
    },
    placeStep({
      id: 'logs', title: 'Gather logs', cat: 'timber', piece: 'lumber', limit: 2,
      why: 'Logs pay for almost everything. ',
      text: function (ctx) { return 'Logs pay for almost everything (see Logs in the top bar). Open 6 Timber, pick Timber mark (4 logs) and ' + low(tap(ctx)) + ' a glowing tile near the trees. A nib chops trees close by and carries the logs home.'; },
      score: function (run, c) { const t = near(run, c, 4.4, function (o) { return o.tree && o.tree.wood > 0; }); return t >= 3 ? -t : null; },
      done: function (run) { return count(run, ['lumber']) >= 1; }
    }),
    placeStep({
      id: 'food', title: 'Pick berries for food', cat: 'food', piece: 'forager', limit: 2,
      why: 'Berry bushes feed the colony. ',
      text: function (ctx) { return 'Food is the next number to watch. Open 5 Food, pick Berry round (6 logs) and ' + low(tap(ctx)) + ' a glowing tile near the red berry bushes. A nib picks them for the larder.'; },
      score: function (run, c) { const b = near(run, c, 4.2, function (o) { return !!o.bush; }); return b >= 2 ? -b : null; },
      done: function (run) { return count(run, ['forager']) >= 1; }
    }),
    placeStep({
      id: 'home', title: 'Build another home', cat: 'shelter', piece: housingId,
      text: function (ctx) {
        return ctx.faction === 'cog'
          ? 'Every nib needs a bed. Open 4 Shelter, pick Cog bunk and ' + low(tap(ctx)) + ' a glowing tile. Spare beds let a berry vat raise new kits later.'
          : 'Every nib needs a bed, and new kits are only born when a bed is spare. Open 4 Shelter, pick Family lodge (12 logs) and ' + low(tap(ctx)) + ' a glowing tile.';
      },
      score: function (run, c) { return bankWater(run, c) ? null : 0; },
      done: function (run) { return count(run, [housingId(run)]) >= startHousing(run) + 1; }
    }),
    {
      id: 'dam', kind: 'do', title: 'Dam the river',
      glow: function (run) {
        const line = damLine(run);
        if (line && !inPlan(run, line.bank)) return { cat: 'paths', piece: 'path' };
        if (!affordable(run, E.DEF.dam)) return { speed: true };
        return { cat: 'water', piece: 'dam' };
      },
      body: function (ctx, run) {
        const line = run && damLine(run);
        if (line && !inPlan(run, line.bank)) return 'A dam keeps a deep pool by your pump when the river stops. First, extend your footpath along the bank to the glowing tiles, downstream of the pump.';
        if (run && !affordable(run, E.DEF.dam)) return 'Each Stick dam costs 4 logs and you are short. Keep time running while your timber mark brings logs home.';
        return 'Now open 2 Water and pick Stick dam (4 logs each). ' + tap(ctx) + ' every glowing tile across the river, bank to bank. Water piles up behind the dam, on the pump side.';
      },
      targets: function (run) {
        const line = damLine(run);
        if (!line) return [];
        if (!inPlan(run, line.bank)) return route(run, function (c) { return c.x === line.bank.x && c.y === line.bank.y; }) || [line.bank];
        return line.cells.filter(function (p) { const c = get(run, p.x, p.y); return !c.building; });
      },
      done: function (run) {
        const line = damLine(run);
        if (line) return damsDone(run, line);
        return count(run, ['dam']) >= 2;
      }
    },
    placeStep({
      id: 'desk', title: 'Build a wonder desk', cat: 'timber', piece: 'inventor',
      text: function (ctx) { return 'Ideas unlock new buildings, like farms and saws. Open 6 Timber, pick Wonder desk (10 logs, 2 planks) and ' + low(tap(ctx)) + ' a glowing tile. A nib there earns ideas.'; },
      score: function (run, c) { return bankWater(run, c) ? null : 0; },
      done: function (run) { return count(run, ['inventor']) >= 1; }
    }),
    {
      id: 'learn', kind: 'do', title: 'Learn to farm',
      glow: function (run) { return run.store.science >= (E.DEF.carrots.science || 10) ? { cat: 'food', piece: 'carrots', tech: 'carrots' } : { speed: true }; },
      body: function () { return 'Keep time running until Ideas (top bar) reaches 10. Then open 5 Food and press Carrot beds: the Idea tree opens. Press Carrot beds there to learn it.'; },
      status: function (run) { return 'Ideas: ' + Math.floor(run.store.science) + ' / ' + (E.DEF.carrots.science || 10); },
      done: function (run) { return !!run.unlocked.carrots; }
    },
    placeStep({
      id: 'farm', title: 'Plant a farm', cat: 'food', piece: 'carrots',
      why: 'Carrots need watered ground. ',
      text: function (ctx) { return 'Carrots grow on green, watered ground near the river. Pick Carrot beds (8 logs) and ' + low(tap(ctx)) + ' a glowing tile. Carrots are a better meal than berries, so nibs get happier.'; },
      score: function (run, c) { if (!(c.irrig > 0)) return null; return bankWater(run, c) ? 1 : 0; },
      done: function (run) { return count(run, ['carrots', 'spuds']) >= 1; }
    }),
    placeStep({
      id: 'drought', title: 'Get ready for the dry spell', cat: 'water', piece: 'tank',
      text: 'Watch the Season chip. When it turns orange and says Dry spell, the river stops and nibs only drink what you stored. Build a second Clay tank now so there is plenty saved.',
      score: function (run, c) { return bankWater(run, c) ? null : 0; },
      done: function (run) { return count(run, ['tank', 'cistern']) >= 2; }
    }),
    {
      id: 'done', kind: 'info', title: 'You are ready!', next: 'Finish',
      body: function () { return 'The Next card at the top left always shows your next goal. Keep Water and Food up, add tanks and homes as the colony grows, and press ? any time for How to play. Good luck, river keeper!'; }
    }
  ];

  function stepGlow(step, run) {
    if (!step || !step.glow) return null;
    return typeof step.glow === 'function' ? step.glow(run) : step.glow;
  }

  /* Gentle warnings with what to do about them. memo keeps the last game hour each one fired. */
  function warnings(run, memo) {
    const out = [];
    if (!run || run.phase !== 'play') return out;
    const pop = E.living(run).length || 1;
    const left = Math.max(0, E.seasonLenHours(run) - run.seasonHour);
    function say(id, text, gap, kind) {
      const last = memo[id];
      if (last != null && run.hour - last < gap) return;
      memo[id] = run.hour;
      out.push({ id: id, text: text, kind: kind || 'warn' });
    }
    if (run.season === 'temperate' && left < 30) {
      const key = (E.nextHazard(run) === 'badtide' ? 'sour-soon-' : 'dry-soon-') + run.cycle;
      if (memo[key] == null) {
        if (E.nextHazard(run) === 'badtide') say(key, 'A sour tide is coming in about a day. Sour water makes nibs sick. Fill your tanks now, and shut sluice gates when it arrives.', 1e9);
        else say(key, 'A dry spell starts in about a day. Fill your tanks and check your dam goes right across the river.', 1e9);
      }
    }
    if (run.season === 'drought' && memo['dry-on-' + run.cycle] == null) say('dry-on-' + run.cycle, 'Dry spell! The river has stopped. Nibs now drink from your tanks, so keep an eye on Water.', 1e9, 'bad');
    if (run.season === 'badtide' && memo['sour-on-' + run.cycle] == null) say('sour-on-' + run.cycle, 'Sour tide! Keep nibs out of brown water and use the clean water you stored.', 1e9, 'bad');
    const need = Math.max(8, pop * 1.5);
    if (run.store.water < need) {
      say('water', run.season === 'drought'
        ? 'Water is running low. A paw pump on the pool behind your dam can still draw water. Next time, build more tanks before the dry spell.'
        : 'Water is running low. Build another Paw pump on the riverbank and a Clay tank, then let time run so they fill.', 16);
    }
    if (E.foodTotal(run) < Math.max(8, pop * 2)) say('food', 'Food is running low. Put a Berry round near bushes, or learn Carrot beds in the Idea tree.', 16);
    const spare = E.beds(run) - E.living(run).length;
    if (spare < 0) say('beds', 'Some nibs have no bed and are getting grumpy. Build another home in 4 Shelter.', 30, 'info');
    return out;
  }

  const CAT_TIPS = {
    paths: 'Paths: footpaths, stairs and bridges. Nibs only build what a path reaches.',
    water: 'Water: pumps, tanks, dams and gates. Store water for dry spells.',
    power: 'Power: wheels and shafts that drive the faster workshops.',
    shelter: 'Shelter: homes. Every nib needs a bed.',
    food: 'Food: berry pickers and farms.',
    timber: 'Timber: chop logs, saw planks, press gears and earn ideas.',
    comfort: 'Comfort: things that make nibs happier.'
  };

  function costText(def) {
    const bits = [];
    Object.keys(def.cost || {}).forEach(function (k) { if (def.cost[k]) bits.push(def.cost[k] + ' ' + k); });
    return bits.length ? bits.join(', ') : 'free';
  }

  function pieceTip(def, run) {
    const known = run && run.unlocked[def.id];
    return def.name + ' — ' + def.blurb + ' Costs ' + costText(def) + '.' + (known ? '' : ' Learn it in the Idea tree for ' + (def.science || 0) + ' ideas.');
  }

  return {
    STEPS: STEPS,
    stepGlow: stepGlow,
    warnings: warnings,
    damLine: damLine,
    route: route,
    pathOnBank: pathOnBank,
    count: count,
    CAT_TIPS: CAT_TIPS,
    pieceTip: pieceTip,
    costText: costText
  };
});
