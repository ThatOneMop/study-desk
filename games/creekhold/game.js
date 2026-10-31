/* Creekhold — board, input, and the day. */
(function () {
  'use strict';
  const E = window.CreekholdEngine;
  const R = window.CreekholdRender;
  const A = window.CreekholdAudio;
  const $ = function (id) { return document.getElementById(id); };
  const canvas = $('view');
  const ctx = canvas.getContext('2d');
  const HOUR = 0.48;

  const TUTOR = [
    { title: 'A living river', body: 'The sources run in clear weather and stop in a dry spell. Later, a sour tide rides the same bed. Space starts and stops the clock.', check: function () { return false; } },
    { title: 'Lay a footpath', body: 'Paths is the first group. Tap tiles from the hearth down toward the water. Nibs only build what the path can reach.', check: function (run) { return countId(run, 'path') >= 4; } },
    { title: 'A paw pump', body: 'Choose Water, then Paw pump, on the grass edge just above the sandy shallows, touching your path. It draws from the tile beside it and will not drink sour water.', check: function (run) { return countId(run, 'pump') >= 1; } },
    { title: 'A clay tank', body: 'Place a tank on the path. The pump fills it. Nibs drink the store, not the river.', check: function (run) { return countId(run, 'tank') >= 1; } },
    { title: 'Hold the channel', body: 'A stick dam downstream of the pump keeps a pool when the sources sleep. Dam the whole low bed, not one tile of it.', check: function (run) { return countId(run, 'dam') >= 2; } },
    { title: 'The clock', body: 'Press play. Watch the season chip. A dry spell is announced a day ahead. The idea tree spends what the wonder desk files.', check: function () { return false; } }
  ];

  let meta = E.createMeta();
  let run = null;
  let cam = { x: 200, y: 80, zoom: 1, rot: 0 };
  let speed = 0;
  let tool = null;
  let cat = 'paths';
  let overlay = 'none';
  let hover = null;
  let selected = null;
  let tutorStep = 0;
  let tutorOn = false;
  let acc = 0;
  let last = 0;
  let keys = {};
  let pointers = new Map();
  let pinch = null;
  let moved = 0;
  let particles = [];
  let audioOn = false;
  let hudAt = 0;
  let loopErr = false;
  let previewReady = false;
  let marks = [];
  let markAt = 0;
  const pickState = { faction: 'reed', map: 'willow', diff: 'easy' };

  function countId(r, id) {
    let n = 0;
    for (let i = 0; i < r.cells.length; i++) if (r.cells[i].building && r.cells[i].building.id === id) n++;
    return n;
  }

  function save() {
    try { localStorage.setItem(E.SAVE_KEY, E.encode({ meta: meta, run: run })); } catch (err) { /* private mode */ }
  }

  function load() {
    try {
      const raw = localStorage.getItem(E.SAVE_KEY);
      if (!raw) return;
      const data = E.decode(raw);
      if (!data.ok) return;
      meta = data.meta;
      if (!meta.settings) meta.settings = { sound: true, volume: 0.7, motion: true, edge: true };
      if (data.run && data.run.phase === 'play') run = data.run;
    } catch (err) { /* ignore broken saves */ }
  }

  function toast(text) {
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = text;
    $('toasts').appendChild(el);
    setTimeout(function () { el.remove(); }, 2800);
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    canvas._w = rect.width;
    canvas._h = rect.height;
  }

  function viewSize() {
    return { w: canvas._w || canvas.clientWidth, h: canvas._h || canvas.clientHeight };
  }

  function focusHearth() {
    if (!run) return;
    const v = viewSize();
    // Frame halfway between the hearth and the map centre so the river is in view.
    const narrow = v.w < 520;
    const fx = narrow ? run.hx + 1 : (run.hx + run.w / 2) / 2;
    R.centerOn(cam, fx, (run.hy + run.h / 2) / 2, 2, v.w, v.h, run.w, run.h);
  }

  const OVERLAYS = ['none', 'water', 'reach', 'power', 'sour'];
  const OVERLAY_NAME = { none: 'View', water: 'Water', reach: 'Reach', power: 'Power', sour: 'Sour' };
  function setOverlay(next) {
    overlay = next;
    const b = $('overlayBtn');
    if (b) {
      b.textContent = OVERLAY_NAME[overlay] || 'View';
      b.setAttribute('aria-pressed', String(overlay !== 'none'));
      b.title = 'Overlay: ' + overlay + ' (V water, R reach, G power, C sour)';
    }
  }
  function cycleOverlay() {
    setOverlay(OVERLAYS[(OVERLAYS.indexOf(overlay) + 1) % OVERLAYS.length]);
    if (overlay !== 'none') toast((OVERLAY_NAME[overlay]) + ' overlay');
  }

  function setSpeed(n) {
    speed = n;
    ['0', '1', '2', '3'].forEach(function (k) {
      $('speed' + k).setAttribute('aria-pressed', String(speed === +k));
    });
  }

  function buildingsForCat() {
    return E.BUILDINGS.filter(function (b) { return b.cat === cat; });
  }

  function renderDock() {
    $('cats').innerHTML = '';
    E.CATS.forEach(function (c, i) {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = (i + 1) + ' ' + c.name;
      b.setAttribute('aria-pressed', String(c.id === cat));
      b.addEventListener('click', function () { cat = c.id; tool = null; marks = []; renderDock(); });
      $('cats').appendChild(b);
    });
    $('pieces').innerHTML = '';
    const erase = document.createElement('button');
    erase.type = 'button';
    erase.innerHTML = 'Remove<small>X</small>';
    erase.setAttribute('aria-pressed', String(tool === 'erase'));
    erase.addEventListener('click', function () { tool = tool === 'erase' ? null : 'erase'; renderDock(); });
    $('pieces').appendChild(erase);
    buildingsForCat().forEach(function (def) {
      const b = document.createElement('button');
      b.type = 'button';
      const other = def.faction && run && def.faction !== run.faction;
      if (other) return; // like the idea tree, only show this circle's own pieces
      const known = run && run.unlocked[def.id];
      b.disabled = !run || !!other;
      const cost = costLabel(def);
      b.innerHTML = def.name + '<small>' + (other ? 'Other circle' : known ? cost : (def.science || 0) + ' ideas') + '</small>';
      b.setAttribute('aria-pressed', String(tool === def.id));
      b.addEventListener('click', function () {
        if (!known && !other) { openTech(); return; }
        tool = tool === def.id ? null : def.id;
        marks = [];
        markAt = 0;
        renderDock();
      });
      $('pieces').appendChild(b);
    });
  }

  function costLabel(def) {
    const bits = [];
    Object.keys(def.cost || {}).forEach(function (k) { if (def.cost[k]) bits.push(def.cost[k] + ' ' + k); });
    return bits.length ? bits.join(' · ') : 'Free';
  }

  function syncHud() {
    if (!run) return;
    const pop = E.living(run).length;
    $('day').textContent = String(Math.floor(run.hour / 24) + 1);
    $('clock').textContent = E.clockLabel(run);
    const leftH = Math.max(0, E.seasonLenHours(run) - run.seasonHour);
    const leftD = Math.max(0, Math.ceil(leftH / 24));
    $('season').textContent = E.seasonLabel(run) + ' · ' + leftD + 'd';
    $('seasonChip').className = 'chip' + (run.season === 'drought' ? ' warn' : run.season === 'badtide' ? ' bad' : '');
    $('pop').textContent = String(pop);
    $('mood').textContent = String(Math.round(E.avgWell(run)));
    $('water').textContent = Math.floor(run.store.water) + '/' + E.waterCap(run);
    $('food').textContent = String(Math.floor(E.foodTotal(run)));
    $('logs').textContent = String(Math.floor(run.store.logs));
    $('planks').textContent = String(Math.floor(run.store.planks));
    $('gears').textContent = String(Math.floor(run.store.gears));
    $('ideas').textContent = String(Math.floor(run.store.science));
    const alerts = E.alerts(run);
    $('alerts').innerHTML = alerts.map(function (a) { return '<span>' + a + '</span>'; }).join('');
    if (run.freshAchieve) {
      const mark = E.ACHIEVE.find(function (m) { return m.id === run.freshAchieve; });
      if (mark) toast(mark.name + ' — ' + mark.text);
      run.freshAchieve = '';
      A.play('achieve');
    }
    A.setMode(run.season);
    const aim = E.goal(run);
    const bar = $('goalbar');
    if (aim && run.phase === 'play') {
      bar.hidden = false;
      $('goalKicker').textContent = 'Next ' + aim.index + '/' + aim.total + (aim.spare < 0 ? ' · ' + (-aim.spare) + ' rough' : aim.spare > 0 ? ' · ' + aim.spare + ' spare bed' + (aim.spare > 1 ? 's' : '') : '');
      $('goalTitle').textContent = aim.title;
      $('goalText').textContent = aim.text;
      const g = $('popGraph');
      if (g) {
        const gx = g.getContext('2d');
        gx.clearRect(0, 0, 96, 32);
        const log = run.popLog || [];
        gx.fillStyle = '#e7f3f2';
        gx.fillRect(0, 0, 96, 32);
        gx.strokeStyle = '#1f7c86';
        gx.lineWidth = 2;
        gx.beginPath();
        const series = log.length ? log : [E.living(run).length];
        const n = Math.max(2, series.length);
        const peak = Math.max(8, ...series);
        for (let i = 0; i < series.length; i++) {
          const x = series.length === 1 ? 48 : (i / (n - 1)) * 90 + 3;
          const y = 28 - (series[i] / peak) * 22;
          if (i === 0) gx.moveTo(x, y); else gx.lineTo(x, y);
        }
        gx.stroke();
        gx.fillStyle = '#1f7c86';
        const last = series[series.length - 1];
        const lx = series.length === 1 ? 48 : 93;
        gx.fillRect(lx - 2, 28 - (last / peak) * 22 - 2, 4, 4);
      }
    } else if (bar) bar.hidden = true;
    if (run.phase === 'over' && !$('over').open) showOver();
  }

  function tutorMaybe() {
    if (!tutorOn || !run) return;
    const step = TUTOR[tutorStep];
    if (!step) return;
    if (tutorStep > 0 && tutorStep < TUTOR.length - 1 && step.check(run)) {
      tutorStep++;
      tutorSync();
    }
  }

  function showOver() {
    setSpeed(0);
    $('overTitle').textContent = 'The colony is gone';
    $('overBody').textContent = 'The last nibs were lost to ' + (run.overWhy || 'the bend') + ' on day ' + (Math.floor(run.hour / 24) + 1) + '. A pump, a tank, and a dam downstream of that pump are what the first dry spell asks for.';
    $('over').showModal();
    save();
  }

  function tutorSync() {
    const step = TUTOR[tutorStep];
    if (!step) { $('tutor').hidden = true; tutorOn = false; meta.tutorial = true; save(); return; }
    $('tutor').hidden = false;
    $('tutorTitle').textContent = step.title;
    $('tutorBody').textContent = step.body;
    if (tutorStep > 0 && tutorStep < TUTOR.length - 1 && run && step.check(run)) tutorStep++;
  }

  function burst(x, y, color) {
    if (meta.settings && meta.settings.motion === false) return;
    for (let i = 0; i < 6; i++) {
      particles.push({
        x: x + Math.random() * 0.4, y: y + Math.random() * 0.4, z: 1,
        life: 1, color: color || '#e2a24a'
      });
    }
  }

  function consumeEvents() {
    if (!run || !run.events) return;
    const ev = run.events.splice(0, run.events.length);
    for (let i = 0; i < ev.length; i++) {
      const e = ev[i];
      if (e.type === 'raised') { A.play('raised'); burst(e.x, e.y, '#e7d3b0'); }
      else if (e.type === 'chop') { A.play('chop'); burst(e.x, e.y, '#6d8a3e'); }
      else if (e.type === 'drink') A.play('drink');
      else if (e.type === 'eat') A.play('eat');
      else if (e.type === 'born') { A.play('born'); toast('A kit is at the hearth'); }
      else if (e.type === 'died') A.play('died');
      else if (e.type === 'gear') A.play('gear');
      else if (e.type === 'season') toast(E.seasonLabel(run));
    }
  }

  const preview = E.startRun(E.createMeta(), 'willow', 'reed', 'easy');
  E.tick(preview, 8);

  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000 || 0);
    last = now;
    try {
    if (run && speed > 0 && run.phase === 'play' && !document.querySelector('dialog[open]')) {
      acc += dt * speed * HOUR;
      while (acc >= 0.25) { E.tick(run, 0.25); acc -= 0.25; }
      consumeEvents();
    }
    const pan = 280 * dt / cam.zoom;
    if (keys.KeyA || keys.ArrowLeft) cam.x += pan;
    if (keys.KeyD || keys.ArrowRight) cam.x -= pan;
    if (keys.KeyW || keys.ArrowUp) cam.y += pan;
    if (keys.KeyS || keys.ArrowDown) cam.y -= pan;
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].life -= dt;
      particles[i].z += dt;
      if (particles[i].life <= 0) particles.splice(i, 1);
    }
    const shown = run || preview;
    const v = viewSize();
    if (!run && !previewReady) {
      cam.zoom = 0.78;
      R.centerOn(cam, preview.hx + 4, preview.hy + 5, 1, v.w, v.h, preview.w, preview.h);
      previewReady = true;
    }
    R.frame(ctx, {
      run: shown, cam: cam, w: v.w, h: v.h, time: now, overlay: run ? overlay : 'none',
      selected: run ? selected : null, ghost: run ? ghostAt() : null, particles: particles,
      marks: run ? marks : null,
      reduce: meta.settings && meta.settings.motion === false
    });
    if (run && now - hudAt > 200) { hudAt = now; syncHud(); }
    if (run && tool && tool !== 'erase' && now - markAt > 400) { markAt = now; refreshMarks(); }
    requestAnimationFrame(loop);
    } catch (err) {
      // Keep the colony running, but say so once instead of failing silently.
      if (!loopErr) { loopErr = true; console.warn('Creekhold frame error', err); }
      requestAnimationFrame(loop);
    }
  }

  function chrome() {
    document.body.classList.toggle('playing', !!run);
  }

  function refreshMarks() {
    marks = [];
    if (!run || !hover || !tool || tool === 'erase' || !E.DEF[tool]) return;
    for (let i = 0; i < run.cells.length; i++) {
      const c = run.cells[i];
      if (Math.abs(c.x - hover.x) + Math.abs(c.y - hover.y) > 4) continue;
      const st = E.preview(run, tool, c.x, c.y);
      let near = run.network && run.network.has(c.x + ',' + c.y);
      if (!near && run.network) {
        if ((c.x > 0 && run.network.has((c.x - 1) + ',' + c.y)) || (c.x + 1 < run.w && run.network.has((c.x + 1) + ',' + c.y)) || (c.y > 0 && run.network.has(c.x + ',' + (c.y - 1))) || (c.y + 1 < run.h && run.network.has(c.x + ',' + (c.y + 1)))) near = true;
      }
      if (!near) continue;
      if (st.ok) marks.push({ x: c.x, y: c.y, ok: true });
      else if (st.reason === 'step') marks.push({ x: c.x, y: c.y, step: true });
    }
  }

  function ghostAt() {
    if (!run || !hover || !tool || tool === 'erase') return null;
    const def = E.DEF[tool];
    if (!def) return null;
    const st = E.preview(run, tool, hover.x, hover.y);
    if (st.reason === 'step' && run.unlocked.stairs) {
      const stair = E.preview(run, 'stairs', hover.x, hover.y);
      return { x: hover.x, y: hover.y, id: 'stairs', ok: stair.ok, step: true };
    }
    return { x: hover.x, y: hover.y, id: tool, ok: !!st.ok };
  }

  function placeAt(cell, quiet) {
    if (!run || !cell) return;
    if (tool === 'erase') {
      const r = E.demolish(run, cell.x, cell.y);
      if (!r.ok) A.play('deny'); else { A.play('place'); save(); }
      return;
    }
    if (!tool) { selectCell(cell); return; }
    const r = E.place(run, tool, cell.x, cell.y);
    if (!r.ok) { if (!quiet || r.reason === 'cost') { A.play('deny'); toast(reasonText(r.reason)); } return; }
    A.play('place');
    burst(cell.x, cell.y, '#e7d3b0');
    tutorMaybe();
    save();
    renderDock();
    syncHud();
  }

  function reasonText(reason) {
    const map = {
      'unreached': 'That tile is off the paths.',
      'step': 'One level down or up: lay a Step-stair (Paths) on the edge first.',
      'cost': 'Not enough stores.',
      'locked': 'Study it in the idea tree first.',
      'wet': 'Too much water. Use a dam, a levee, or a bridge.',
      'blocked': 'Something is already there.',
      'tree': 'A tree is in the way. Mark timber first.',
      'other-circle': 'The other circle builds that.',
      'stack-cap': 'That stack is as high as it goes.',
      'last-hearth': 'The colony needs its hearth.',
      'bedrock': 'The ground will not go lower.',
      'too-high': 'The ground will not go higher.'
    };
    return map[reason] || 'That will not sit there.';
  }

  function selectCell(cell) {
    selected = { x: cell.x, y: cell.y };
    const info = E.cellInfo(run, cell.x, cell.y);
    const box = $('inspect');
    if (!info || !info.building) { box.hidden = true; return; }
    box.hidden = false;
    $('inspectName').textContent = info.building.name;
    const bits = [];
    const def = E.DEF[info.building.id];
    bits.push(info.building.progress >= 1 ? 'Built.' : Math.round(info.building.progress * 100) + '% raised.');
    if (def.workers && info.building.progress >= 1) {
      const crew = run.nibs.filter(function (n) { return !n.dead && n.job && n.job.x === cell.x && n.job.y === cell.y && n.mode === 'work'; });
      bits.push(info.building.paused ? 'Paused.' : crew.length ? 'Crew: ' + crew.map(function (n) { return n.name; }).join(', ') + '.' : 'No crew yet — needs a free adult nib.');
    }
    if (info.water > 0.05) bits.push('Water ' + info.water.toFixed(1) + (info.bad > 0.2 ? ', sour ' + Math.round(info.bad * 100) + '%' : ''));
    if (info.power > 0) bits.push('Power ' + Math.round(info.power * 100) + '%');
    $('inspectBody').textContent = bits.join(' ') + (def.blurb ? ' ' + def.blurb : '');
    const actions = $('inspectActions');
    actions.innerHTML = '';
    if (E.DEF[info.building.id].gate) {
      for (let g = 0; g <= 3; g++) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'ghost';
        b.textContent = g === 0 ? 'Open' : g === 3 ? 'Shut' : 'Lip ' + g;
        b.addEventListener('click', function () { E.setGate(run, cell.x, cell.y, g); selectCell(cell); save(); });
        actions.appendChild(b);
      }
    }
    const pause = document.createElement('button');
    pause.type = 'button';
    pause.className = 'ghost';
    pause.textContent = info.building.paused ? 'Resume work' : 'Pause work';
    pause.addEventListener('click', function () { E.setPaused(run, cell.x, cell.y, !info.building.paused); selectCell(E.get(run, cell.x, cell.y)); save(); });
    actions.appendChild(pause);
    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'danger';
    del.textContent = 'Take down';
    del.addEventListener('click', function () { E.demolish(run, cell.x, cell.y); box.hidden = true; selected = null; save(); });
    actions.appendChild(del);
  }

  function showTip(text, x, y) {
    const tip = $('tooltip');
    if (!text) { tip.hidden = true; return; }
    tip.hidden = false;
    tip.textContent = text;
    const v = viewSize();
    const left = Math.min(x + 14, v.w - tip.offsetWidth - 8);
    const top = Math.min(y + 14, v.h - tip.offsetHeight - 8);
    tip.style.left = Math.max(8, left) + 'px';
    tip.style.top = Math.max(8, top) + 'px';
  }

  function hoverText() {
    if (!run || !hover) return '';
    if (tool && tool !== 'erase' && E.DEF[tool]) {
      const d = E.DEF[tool];
      const st = E.preview(run, tool, hover.x, hover.y);
      if (st.reason === 'step') return 'This edge needs a step-stair. The ghost shows one.';
      if (!st.ok && st.reason) return d.name + ' — ' + reasonText(st.reason);
      return d.name + ' — ' + d.blurb;
    }
    const info = E.cellInfo(run, hover.x, hover.y);
    if (info && info.building) return info.building.name + (info.building.progress < 1 ? ' (' + Math.round(info.building.progress * 100) + '%)' : '');
    if (info && info.tree) return info.tree.wood > 0 ? 'Tree' : 'Stump';
    if (info && info.bush) return 'Berry bush';
    if (info && info.water > 0.2) return 'Water ' + info.water.toFixed(1);
    return '';
  }

  function localPoint(ev) {
    const rect = canvas.getBoundingClientRect();
    return { x: ev.clientX - rect.left, y: ev.clientY - rect.top, cx: ev.clientX, cy: ev.clientY };
  }

  // Mouse drag with a line-type tool paints tiles like a brush; right/middle drag still pans.
  const PAINT = { path: 1, dam: 1, levee: 1, erase: 1 };
  let painting = null;
  let holdTimer = null;
  function paintAt(p) {
    const v = viewSize();
    const cell = R.pick(cam, v.w, v.h, p.x, p.y, run);
    if (!cell) return;
    const k = cell.x + ',' + cell.y;
    if (painting.done[k]) return;
    painting.done[k] = true;
    placeAt(cell, painting.count++ > 0);
  }

  function onPointerDown(ev) {
    canvas.setPointerCapture(ev.pointerId);
    pointers.set(ev.pointerId, localPoint(ev));
    moved = 0;
    painting = null;
    if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; }
    if (ev.button === 0 && run && tool && PAINT[tool]) {
      if (ev.pointerType === 'mouse') {
        painting = { done: {}, count: 0 };
        paintAt(localPoint(ev));
      } else {
        const start = localPoint(ev);
        holdTimer = setTimeout(function () {
          holdTimer = null;
          painting = { done: {}, count: 0 };
          paintAt(start);
        }, 280);
      }
    }
    if (pointers.size === 2) {
      const pts = Array.from(pointers.values());
      pinch = { dist: Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y), zoom: cam.zoom };
    }
    unlockAudio();
  }

  function onPointerMove(ev) {
    const p = localPoint(ev);
    if (pointers.has(ev.pointerId)) {
      const prev = pointers.get(ev.pointerId);
      const dx = p.x - prev.x, dy = p.y - prev.y;
      moved += Math.hypot(dx, dy);
      pointers.set(ev.pointerId, p);
      if (holdTimer && moved > 10) { clearTimeout(holdTimer); holdTimer = null; }
      if (painting) { paintAt(p); return; }
      if (pointers.size === 1 && moved > 8) { cam.x += dx; cam.y += dy; }
      if (pointers.size === 2 && pinch) {
        const pts = Array.from(pointers.values());
        const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) || 1;
        cam.zoom = Math.max(0.55, Math.min(2.2, pinch.zoom * (dist / (pinch.dist || 1))));
      }
    }
    if (run && pointers.size === 0) {
      const v = viewSize();
      hover = R.pick(cam, v.w, v.h, p.x, p.y, run);
      showTip(hoverText(), p.x, p.y);
      const edge = meta.settings && meta.settings.edge !== false;
      if (edge && pointers.size === 0) {
        const m = 16;
        if (p.x < m) cam.x += 8;
        if (p.y < m) cam.y += 8;
        if (p.x > v.w - m) cam.x -= 8;
        if (p.y > v.h - m) cam.y -= 8;
      }
    }
  }

  function onPointerUp(ev) {
    if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; }
    if (painting) { pointers.delete(ev.pointerId); painting = null; return; }
    const wasTap = moved < 8 && pointers.size <= 1;
    pointers.delete(ev.pointerId);
    if (pointers.size < 2) pinch = null;
    if (wasTap && run) {
      const p = localPoint(ev);
      const v = viewSize();
      const cell = R.pick(cam, v.w, v.h, p.x, p.y, run);
      placeAt(cell);
    }
  }

  function unlockAudio() {
    if (audioOn) return;
    audioOn = true;
    A.unlock();
    if (meta.settings.sound !== false) { A.setEnabled(true); A.startMusic(); }
  }

  function openTech() {
    if (!run) return;
    const aim = E.goal(run);
    $('techLead').textContent = Math.floor(run.store.science) + ' ideas. Lines show what must be known first. Tiers open after ' + E.TIER_GATE + ' studies in the ring below.';
    const list = $('techList');
    list.innerHTML = '';
    const TIER_NAME = ['At the hearth', 'First ideas', 'Second ring', 'Deep works'];
    const cols = [];
    for (let tier = 0; tier < 4; tier++) {
      const col = document.createElement('div');
      col.className = 'tcol';
      const open = E.tierOpen(run, tier);
      const h = document.createElement('h3');
      h.textContent = TIER_NAME[tier] + (open ? '' : ' · ' + E.tierProgress(run, tier - 1) + '/' + E.TIER_GATE);
      col.appendChild(h);
      cols.push(col);
      list.appendChild(col);
    }
    E.BUILDINGS.forEach(function (def) {
      if (def.faction && def.faction !== run.faction) return;
      const tier = def.tier || 0;
      const known = !!run.unlocked[def.id];
      const open = E.tierOpen(run, tier);
      const node = document.createElement('button');
      node.type = 'button';
      node.className = 'node' + (known ? ' known' : '') + (open ? '' : ' shut') + (aim && aim.id === def.id ? ' now' : '');
      node.dataset.id = def.id;
      const needs = (def.need || []).map(function (id) { return E.DEF[id] ? E.DEF[id].name : id; }).join(', ');
      node.innerHTML = '<b>' + def.name + '</b><span>' + (known ? 'Known' : !open ? 'Ring still shut' : needs ? 'After ' + needs : (def.science ? def.science + ' ideas' : 'Free')) + '</span>';
      node.disabled = known || !open;
      node.addEventListener('click', function () {
        const r = E.unlock(run, def.id);
        if (!r.ok) {
          A.play('deny');
          const why = r.reason === 'ideas' ? 'Not enough ideas yet.' : r.reason === 'tier' ? 'Study two works in the ring below first.' : r.reason === 'prereq' ? 'Learn ' + (E.DEF[r.missing] ? E.DEF[r.missing].name : 'the earlier work') + ' first.' : 'Already known.';
          toast(why);
          return;
        }
        A.play('achieve');
        toast(def.name + ' is in the dock.');
        save();
        openTech();
        renderDock();
      });
      cols[tier].appendChild(node);
    });
    if (!$('tech').open) $('tech').showModal();
    requestAnimationFrame(function () {
      const board = $('techBoard');
      const svg = $('techLines');
      if (!board || !svg) return;
      const br = board.getBoundingClientRect();
      svg.setAttribute('viewBox', '0 0 ' + board.scrollWidth + ' ' + board.scrollHeight);
      svg.setAttribute('width', board.scrollWidth);
      svg.setAttribute('height', board.scrollHeight);
      let html = '';
      E.BUILDINGS.forEach(function (def) {
        (def.need || []).forEach(function (id) {
          const a = list.querySelector('[data-id="' + id + '"]');
          const b = list.querySelector('[data-id="' + def.id + '"]');
          if (!a || !b) return;
          const ar = a.getBoundingClientRect();
          const brb = b.getBoundingClientRect();
          const x1 = ar.right - br.left + board.scrollLeft;
          const y1 = ar.top + ar.height / 2 - br.top + board.scrollTop;
          const x2 = brb.left - br.left + board.scrollLeft;
          const y2 = brb.top + brb.height / 2 - br.top + board.scrollTop;
          html += '<path d="M' + x1 + ' ' + y1 + ' C ' + (x1 + 24) + ' ' + y1 + ', ' + (x2 - 24) + ' ' + y2 + ', ' + x2 + ' ' + y2 + '" fill="none" stroke="#1f7c86" stroke-width="1.4" opacity="0.55"/>';
        });
      });
      svg.innerHTML = html;
    });
  }

  function openAchieve() {
    const list = $('achieveList');
    list.innerHTML = '';
    E.ACHIEVE.forEach(function (m) {
      const got = meta.achievements && meta.achievements[m.id];
      const row = document.createElement('div');
      row.className = 'choice';
      row.innerHTML = '<b>' + (got ? '◆ ' : '◇ ') + m.name + '</b><span>' + m.text + '</span>';
      list.appendChild(row);
    });
    $('achieve').showModal();
  }

  function fillPick() {
    function fill(el, items, key, current) {
      el.innerHTML = '';
      items.forEach(function (item) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'choice';
        b.setAttribute('aria-pressed', String(item.id === current));
        b.innerHTML = '<b>' + item.name + '</b><span>' + (item.motto || item.blurb || item.name) + '</span>';
        b.addEventListener('click', function () { pickState[key] = item.id; fillPick(); });
        el.appendChild(b);
      });
    }
    fill($('factionList'), [E.FACTIONS.reed, E.FACTIONS.cog], 'faction', pickState.faction);
    fill($('mapList'), E.MAPS.map(function (m) { return { id: m.id, name: m.name, blurb: m.blurb }; }), 'map', pickState.map);
    fill($('diffList'), [E.RULES.easy, E.RULES.normal, E.RULES.hard], 'diff', pickState.diff);
  }

  function begin() {
    run = E.startRun(meta, pickState.map, pickState.faction, pickState.diff);
    if (!run) return;
    chrome();
    particles = [];
    selected = null;
    tool = 'path';
    cat = 'paths';
    setSpeed(0);
    acc = 0;
    $('pick').close();
    $('title').close();
    resize();
    cam.zoom = viewSize().w < 520 ? 0.62 : 0.85;
    focusHearth();
    renderDock();
    syncHud();
    tutorOn = !meta.tutorial && pickState.map === 'willow';
    tutorStep = 0;
    if (tutorOn) tutorSync(); else $('tutor').hidden = true;
    save();
    toast(run.mapName + ' · ' + E.FACTIONS[run.faction].name);
  }

  function applySettings() {
    const s = meta.settings;
    $('soundToggle').checked = s.sound !== false;
    $('volume').value = String(s.volume == null ? 0.7 : s.volume);
    $('motionToggle').checked = s.motion !== false;
    $('edgeToggle').checked = s.edge !== false;
    A.setEnabled(s.sound !== false);
    A.setVolume(s.volume == null ? 0.7 : s.volume);
    if (s.sound === false) A.stopMusic();
  }

  function readSettings() {
    meta.settings.sound = $('soundToggle').checked;
    meta.settings.volume = parseFloat($('volume').value);
    meta.settings.motion = $('motionToggle').checked;
    meta.settings.edge = $('edgeToggle').checked;
    applySettings();
    if (meta.settings.sound) { unlockAudio(); A.startMusic(); }
    save();
  }

  function wire() {
    $('openMenu').addEventListener('click', function () { setSpeed(0); $('pause').showModal(); });
    $('overlayBtn').addEventListener('click', function () { cycleOverlay(); });
    $('playBtn').addEventListener('click', function () { fillPick(); $('title').close(); $('pick').showModal(); unlockAudio(); });
    $('continueBtn').addEventListener('click', function () {
      if (!run) return;
      $('title').close();
      setSpeed(0);
      resize();
      cam.zoom = viewSize().w < 520 ? 0.62 : 0.85;
      focusHearth();
      renderDock();
      syncHud();
      unlockAudio();
    });
    $('howBtn').addEventListener('click', function () { $('help').showModal(); });
    $('startBtn').addEventListener('click', begin);
    $('pickBack').addEventListener('click', function () { $('pick').close(); $('title').showModal(); });
    $('resumeBtn').addEventListener('click', function () { $('pause').close(); setSpeed(speed || 1); });
    $('techBtn').addEventListener('click', function () { $('pause').close(); openTech(); });
    $('achieveBtn').addEventListener('click', openAchieve);
    $('settingsBtn').addEventListener('click', function () { applySettings(); $('settings').showModal(); });
    $('helpBtn').addEventListener('click', function () { $('help').showModal(); });
    $('menuBtn').addEventListener('click', function () { $('pause').close(); setSpeed(0); save(); $('title').showModal(); $('continueBtn').hidden = !(run && run.phase === 'play'); });
    $('closeSettings').addEventListener('click', function () { readSettings(); $('settings').close(); });
    $('wipe').addEventListener('click', function () {
      localStorage.removeItem(E.SAVE_KEY);
      meta = E.createMeta();
      run = null;
      chrome();
      $('settings').close();
      $('pause').close();
      $('continueBtn').hidden = true;
      toast('Creekhold save erased');
      $('title').showModal();
    });
    $('closeTech').addEventListener('click', function () { $('tech').close(); });
    $('closeHelp').addEventListener('click', function () { $('help').close(); });
    $('closeAchieve').addEventListener('click', function () { $('achieve').close(); });
    $('retryBtn').addEventListener('click', function () { $('over').close(); begin(); });
    $('overMaps').addEventListener('click', function () { $('over').close(); fillPick(); $('pick').showModal(); });
    $('tutorSkip').addEventListener('click', function () { tutorOn = false; tutorStep = TUTOR.length; meta.tutorial = true; $('tutor').hidden = true; save(); });
    $('tutorNext').addEventListener('click', function () { tutorStep++; tutorSync(); });
    ['0', '1', '2', '3'].forEach(function (k) {
      $('speed' + k).addEventListener('click', function () { setSpeed(+k); unlockAudio(); });
    });
    $('soundToggle').addEventListener('change', readSettings);
    $('volume').addEventListener('input', readSettings);
    $('motionToggle').addEventListener('change', readSettings);
    $('edgeToggle').addEventListener('change', readSettings);
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);
    canvas.addEventListener('contextmenu', function (ev) { ev.preventDefault(); });
    canvas.addEventListener('wheel', function (ev) {
      ev.preventDefault();
      const v = viewSize();
      const rect = canvas.getBoundingClientRect();
      const mx = ev.clientX - rect.left, my = ev.clientY - rect.top;
      const old = cam.zoom;
      const next = Math.max(0.55, Math.min(2.2, cam.zoom * (ev.deltaY < 0 ? 1.08 : 0.92)));
      cam.x = mx - (mx - cam.x) * (next / old);
      cam.y = my - (my - cam.y) * (next / old);
      cam.zoom = next;
    }, { passive: false });
    window.addEventListener('keydown', function (ev) {
      if (ev.target && ev.target.closest && ev.target.closest('input, textarea')) return;
      keys[ev.code] = true;
      if (ev.code === 'Space') { ev.preventDefault(); setSpeed(speed === 0 ? 1 : 0); }
      else if (ev.key === 'q' || ev.key === 'Q') { cam.rot = (cam.rot + 3) & 3; if (run) focusHearth(); }
      else if (ev.key === 'e' || ev.key === 'E') { cam.rot = (cam.rot + 1) & 3; if (run) focusHearth(); }
      else if (ev.key === 'Escape') {
        if (document.querySelector('dialog[open]')) return;
        // Chrome treats Escape as a close request after keydown; without this the
        // freshly opened pause dialog is closed by the same key press.
        ev.preventDefault();
        if (tool) { tool = null; renderDock(); return; }
        setSpeed(0);
        $('pause').showModal();
      } else if (ev.key >= '1' && ev.key <= '7') {
        cat = E.CATS[+ev.key - 1].id;
        renderDock();
      } else if (ev.key === 'v' || ev.key === 'V') setOverlay(overlay === 'water' ? 'none' : 'water');
      else if (ev.key === 'r' || ev.key === 'R') setOverlay(overlay === 'reach' ? 'none' : 'reach');
      else if (ev.key === 'g' || ev.key === 'G') setOverlay(overlay === 'power' ? 'none' : 'power');
      else if (ev.key === 'c' || ev.key === 'C') setOverlay(overlay === 'sour' ? 'none' : 'sour');
      else if (ev.key === 'x' || ev.key === 'X') { tool = tool === 'erase' ? null : 'erase'; renderDock(); }
      else if (ev.key === 't' || ev.key === 'T') openTech();
      else if (ev.key === 'h' || ev.key === '?') $('help').showModal();
    });
    window.addEventListener('keyup', function (ev) { keys[ev.code] = false; });
    window.addEventListener('resize', function () { resize(); if (run) focusHearth(); });
    document.addEventListener('visibilitychange', function () { if (document.hidden) save(); });
    window.addEventListener('pagehide', save);
    setInterval(save, 20000);
  }

  load();
  applySettings();
  wire();
  renderDock();
  resize();
  $('continueBtn').hidden = !(run && run.phase === 'play');
  ['title', 'pick', 'over'].forEach(function (id) {
    $(id).addEventListener('cancel', function (ev) { ev.preventDefault(); });
  });
  chrome();
  window.Creekhold = {
    get run() { return run; },
    get meta() { return meta; },
    get cam() { return cam; },
    focus: focusHearth
  };
  $('title').showModal();
  requestAnimationFrame(function (t) { last = t; requestAnimationFrame(loop); });
})();
