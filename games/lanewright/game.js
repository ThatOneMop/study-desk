/* Lanewright — map, saves, Sunday choice, and the pointer. */
(function () {
  'use strict';
  const E = window.LanewrightEngine;
  const audio = window.LanewrightAudio.createAudio();
  const canvas = document.getElementById('scene');
  const renderer = window.LanewrightRender.createRenderer(canvas);
  const $ = id => document.getElementById(id);

  const TUTORIAL = [
    { title: 'Houses and shops', body: 'Circles are houses. Squares are shops. A car only visits the shop that shares its colour.', pause: true },
    { title: 'Drag a lane', body: 'Drag from a grid point by the coral house across to the coral shop. Each step spends a road tile.', wait: 'link', pause: true },
    { title: 'A trip', body: 'The cars are moving. Each pin they collect is one trip, and that is the score.', wait: 'score', pause: false },
    { title: 'The ring', body: 'Pins gather on a shop. Past seven, a ring starts. If it completes, the city stops. Right-drag, or Erase, gives a tile back.', pause: true },
    { title: 'Sunday', body: 'At the end of the week you choose one supply. Roads, or a tool: bridge, tunnel, circle, light, or a fast motorway.', pause: true }
  ];

  let meta = E.createMeta();
  let run = null;
  let tool = 'road';
  let hand = 'draw';
  let speed = 1;
  let cam = { x: 9, y: 6, z: 42 };
  let userCam = false;
  let drawChain = null;
  let erasing = false;
  let panning = null;
  let pinch = null;
  let preview = null;
  let pointers = new Map();
  let last = 0;
  let tut = -1;
  let pickMode = 'endless';
  let status = '';
  let launched = null;
  let wipeArmed = false;

  function load() {
    try {
      const raw = localStorage.getItem(E.SAVE_KEY);
      if (!raw) return;
      const decoded = E.decode(raw);
      if (!decoded.ok) {
        status = 'The saved city could not be read. It is still stored.';
        return;
      }
      meta = decoded.meta;
      if (decoded.run && decoded.run.phase !== 'over') run = decoded.run;
    } catch (err) {
      status = 'The saved city could not be read.';
    }
  }

  function save() {
    try { localStorage.setItem(E.SAVE_KEY, E.encode({ meta: meta, run: run })); }
    catch (err) { setStatus('Could not save on this device.'); }
  }

  function applyAudio() {
    audio.setVolumes({
      music: meta.settings.music,
      sfx: meta.settings.sfx,
      mute: meta.settings.mute
    });
  }

  function setStatus(text) {
    status = text || '';
    const el = $('status');
    if (el) el.textContent = status;
  }

  function show(id) {
    const d = $(id);
    if (d && !d.open) d.showModal();
  }
  function hide(id) {
    const d = $(id);
    if (d && d.open) d.close();
  }
  function anyDialog() {
    return ['pause', 'settings', 'upgrade', 'result', 'help'].some(id => $(id).open);
  }

  function screenOf(section) {
    for (const id of ['title', 'cities', 'achieve', 'play']) $(id).hidden = id !== section;
    if (section !== 'play') {
      hide('pause');
      hide('upgrade');
      hide('result');
    }
  }

  function fit(force) {
    if (!run) return;
    if (userCam && !force) return;
    renderer.resize();
    const view = renderer.view();
    if (view.w < 40 || view.h < 40) return;
    const city = run.city;
    const narrow = view.w < 720;
    const top = narrow ? 108 : 72;
    const bot = narrow ? 132 : 84;
    const availW = Math.max(80, view.w - 28);
    const availH = Math.max(80, view.h - top - bot);
    cam.z = Math.max(16, Math.min(availW / (city.cols + 1.4), availH / (city.rows + 1.4)));
    cam.x = city.cols / 2;
    cam.y = city.rows / 2 - ((top + availH / 2) - view.h / 2) / cam.z;
    userCam = false;
  }

  function clampCam() {
    if (!run) return;
    cam.z = Math.max(14, Math.min(96, cam.z));
    cam.x = Math.max(-2, Math.min(run.city.cols + 2, cam.x));
    cam.y = Math.max(-2, Math.min(run.city.rows + 2, cam.y));
  }

  function zoomAt(sx, sy, nz) {
    const before = renderer.screenToWorld(cam, sx, sy);
    cam.z = nz;
    clampCam();
    const after = renderer.screenToWorld(cam, sx, sy);
    cam.x += before.x - after.x;
    cam.y += before.y - after.y;
    clampCam();
    userCam = true;
  }

  function snap(x, y, reach) {
    if (!run) return null;
    const nx = Math.round(x);
    const ny = Math.round(y);
    if (nx < 0 || ny < 0 || nx > run.city.cols || ny > run.city.rows) return null;
    if (Math.hypot(x - nx, y - ny) > (reach || 0.7)) return null;
    return { x: nx, y: ny };
  }

  function extendChain(node) {
    if (!drawChain || !node || !run) return;
    let guard = 0;
    while (guard++ < 48) {
      const last = drawChain[drawChain.length - 1];
      if (last.x === node.x && last.y === node.y) return;
      const nxt = {
        x: last.x + Math.sign(node.x - last.x),
        y: last.y + Math.sign(node.y - last.y)
      };
      if (nxt.x < 0 || nxt.y < 0 || nxt.x > run.city.cols || nxt.y > run.city.rows) return;
      const prev = drawChain[drawChain.length - 2];
      if (prev && prev.x === nxt.x && prev.y === nxt.y) drawChain.pop();
      else drawChain.push(nxt);
    }
  }

  function worldFromEvent(e) {
    const rect = canvas.getBoundingClientRect();
    return renderer.screenToWorld(cam, e.clientX - rect.left, e.clientY - rect.top);
  }

  function refreshTools() {
    document.querySelectorAll('#dock [data-tool]').forEach(btn => {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-tool') === tool && hand !== 'erase' ? 'true' : 'false');
    });
    $('eraseBtn').setAttribute('aria-pressed', hand === 'erase' ? 'true' : 'false');
    if (!run) return;
    $('nRoad').textContent = run.mode === 'sketch' ? '∞' : String(run.stock.road);
    $('nMotor').textContent = run.mode === 'sketch' ? '∞' : String(run.stock.motorway);
    $('nBridge').textContent = run.mode === 'sketch' ? '∞' : String(run.stock.bridge);
    $('nTunnel').textContent = run.mode === 'sketch' ? '∞' : String(run.stock.tunnel);
    $('nRound').textContent = run.mode === 'sketch' ? '∞' : String(run.stock.roundabout);
    $('nLight').textContent = run.mode === 'sketch' ? '∞' : String(run.stock.light);
    const bridgeOn = run.city.hasWater || run.stock.bridge > 0;
    const tunnelOn = run.city.hasMountain || run.stock.tunnel > 0;
    document.querySelector('[data-tool="bridge"]').disabled = !bridgeOn && run.mode !== 'sketch';
    document.querySelector('[data-tool="tunnel"]').disabled = !tunnelOn && run.mode !== 'sketch';
  }

  function refreshHud() {
    if (!run) return;
    const cal = E.calendar(run);
    $('cityName').textContent = run.city.name;
    $('when').textContent = cal.day + ' · Week ' + cal.week;
    $('score').textContent = String(run.score);
    $('roads').textContent = run.mode === 'sketch' ? '∞' : String(run.stock.road);
    const mod = run.mod && run.mode !== 'endless' && run.mode !== 'sketch';
    $('modPill').hidden = !mod;
    if (mod) $('modName').textContent = run.mod.name;
    for (const n of [0, 1, 2, 3]) {
      $('speed' + n).setAttribute('aria-pressed', speed === n ? 'true' : 'false');
    }
    const into = (run.time - run.weekIndex * E.WEEK) / E.WEEK;
    $('weekfill').style.width = Math.max(0, Math.min(1, into)) * 100 + '%';
    refreshTools();
    $('status').textContent = status;
  }

  function renderCities() {
    const sketch = pickMode === 'sketch';
    $('citiesLede').textContent = sketch
      ? 'Unlimited tiles, and the ring never ends the page.'
      : 'Eight shores. A good week on one opens the next.';
    $('cityList').innerHTML = E.CITIES.map(city => {
      const open = sketch || E.unlocked(meta, city.id);
      const best = E.bestOn(meta, city.id, 'endless');
      const idx = E.CITIES.findIndex(c => c.id === city.id);
      const prev = idx > 0 ? E.CITIES[idx - 1] : null;
      const lock = open ? '' : '<div class="lock">Need ' + city.unlock + ' trips in ' + (prev ? prev.name : 'the last city') + '</div>';
      const terrain = [city.hasWater ? 'Water' : '', city.hasMountain ? 'Hills' : '', !city.hasWater && !city.hasMountain ? 'Open ground' : ''].filter(Boolean).join(' · ');
      return '<article class="city"><i class="swatch" style="background:linear-gradient(90deg,' + city.ground + ',' + (city.hasWater ? city.water : city.ground2) + ',' + (city.hasMountain ? city.mountain : city.leaf || city.ground2) + ')"></i><strong>' + city.name + '</strong><small>' + city.region + ' · ' + terrain + '</small><p>' + city.blurb + '</p><small>Best ' + best + ' trips</small>' + lock + '<div class="row"><button type="button" data-city="' + city.id + '"' + (open ? '' : ' disabled') + '>' + (sketch ? 'Sketch' : 'Endless') + '</button></div></article>';
    }).join('');
  }

  function renderAchieve() {
    $('achieveList').innerHTML = E.ACHIEVEMENTS.map(a => {
      const on = meta.achievements.includes(a.id);
      return '<div class="' + (on ? 'on' : 'off') + '"><strong>' + a.name + '</strong><br><small>' + (on ? a.text : 'Still ahead') + '</small></div>';
    }).join('');
  }

  function syncSettings() {
    $('music').value = String(meta.settings.music);
    $('sfx').value = String(meta.settings.sfx);
    $('mute').checked = !!meta.settings.mute;
    $('colorblind').checked = !!meta.settings.colorblind;
    $('motion').checked = !!meta.settings.motion;
    applyAudio();
  }

  function title() {
    screenOf('title');
    $('continueBtn').hidden = !(run && run.phase !== 'over');
    const day = E.dailyKey();
    const week = E.weeklyKey();
    const dailyCity = E.CITIES[E.dailySeed(day) % E.CITIES.length];
    const weeklyCity = E.CITIES[E.weeklySeed(week) % E.CITIES.length];
    $('dailyBtn').textContent = 'Daily lane · ' + dailyCity.name;
    $('weeklyBtn').textContent = 'Weekly lane · ' + weeklyCity.name;
    const posted = meta.dailyPosted[day];
    $('titleNote').textContent = posted != null
      ? 'Today’s lane is already posted at ' + posted + ' trips. Another run is practice.'
      : (status || 'Saved on this device. A trip is a pin collected.');
  }

  function bootTutorial() {
    if (meta.tutorialDone || !run || run.mode !== 'endless' || run.cityId !== 'larkmere' || run.time > 1) {
      tut = -1;
      $('tutorial').hidden = true;
      return;
    }
    tut = 0;
    paintTut();
  }

  function paintTut() {
    const step = TUTORIAL[tut];
    if (!step) {
      $('tutorial').hidden = true;
      return;
    }
    $('tutorial').hidden = false;
    $('tutTitle').textContent = step.title;
    $('tutBody').textContent = step.body;
    const ready = tutReady();
    $('tutNext').disabled = !ready;
    $('tutNext').textContent = tut === TUTORIAL.length - 1 ? 'Drive' : 'Next';
  }

  function tutReady() {
    const step = TUTORIAL[tut];
    if (!step || !step.wait || !run) return true;
    if (step.wait === 'link') {
      const house = run.buildings.find(b => b.role === 'house' && b.color === 'coral');
      const dest = run.buildings.find(b => b.role === 'dest' && b.color === 'coral');
      return !!(house && dest && E.linked(run, house.id, dest.id));
    }
    if (step.wait === 'score') return run.score >= 1;
    return true;
  }

  function endTut() {
    tut = -1;
    meta.tutorialDone = true;
    $('tutorial').hidden = true;
    if (speed === 0) speed = 1;
    save();
  }

  function begin(cityId, mode, opts) {
    const next = E.startRun(meta, cityId, mode, opts || {});
    if (!next) {
      setStatus('That city is still shut.');
      return;
    }
    run = next;
    launched = { cityId: cityId, mode: mode, opts: opts || {} };
    speed = 1;
    userCam = false;
    drawChain = null;
    preview = null;
    hand = 'draw';
    tool = 'road';
    setStatus('');
    hide('pause');
    hide('result');
    hide('upgrade');
    screenOf('play');
    fit(true);
    bootTutorial();
    if (mode === 'sketch') E.bank(meta, run);
    save();
    canvas.focus();
  }

  function resumeRun() {
    if (!run) return;
    launched = { cityId: run.cityId, mode: run.mode, opts: { seed: run.seed, dayKey: run.dayKey, weekKey: run.weekKey } };
    screenOf('play');
    fit(true);
    bootTutorial();
    canvas.focus();
  }

  function openUpgrade() {
    if (!run || run.phase !== 'upgrade' || $('upgrade').open) return;
    const cal = E.calendar(run);
    $('upgradeTitle').textContent = 'Week ' + (cal.week + 1) + ' supplies';
    $('upgradeCards').innerHTML = (run.offer || []).map((card, i) =>
      '<button type="button" class="choice" data-card="' + i + '"><b>' + card.label + '</b><span>' + card.detail + '</span></button>'
    ).join('');
    show('upgrade');
    audio.upgrade();
    const first = $('upgradeCards').querySelector('button');
    if (first) first.focus();
  }

  function openResult() {
    if (!run || run.phase !== 'over' || $('result').open) return;
    const granted = E.bank(meta, run);
    tut = -1;
    $('tutorial').hidden = true;
    save();
    $('resultBody').textContent = run.reason || 'The city stopped.';
    $('resultScore').textContent = String(run.score);
    $('resultWeek').textContent = String(E.currentWeek(run));
    $('resultBest').textContent = String(E.bestOn(meta, run.cityId, run.mode === 'sketch' ? 'sketch' : run.mode));
    $('resultLife').textContent = String(meta.lifetime || 0);
    $('resultAwards').textContent = granted.length
      ? 'New: ' + granted.map(id => (E.ACHIEVEMENTS.find(a => a.id === id) || {}).name).filter(Boolean).join(', ')
      : '';
    show('result');
  }

  function consume() {
    if (!run) return;
    let warned = false;
    for (const ev of run.events) {
      if (ev.type === 'trip') audio.trip();
      else if (ev.type === 'build') audio.place();
      else if (ev.type === 'erase') audio.erase();
      else if (ev.type === 'spawn' || ev.type === 'promote') audio.pop();
      else if (ev.type === 'warn' && !warned) { warned = true; audio.warn(); }
      else if (ev.type === 'over') audio.over();
      else if (ev.type === 'saved') setStatus('The ring faded.');
    }
    run.events.length = 0;
  }

  function highlight() {
    if (tut !== 1 || !run) return null;
    const ids = new Set();
    for (const b of run.buildings) if (b.color === 'coral') ids.add(b.id);
    return ids;
  }

  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min(0.05, Math.max(0, (now - last) / 1000) || 0);
    last = now;
    const step = TUTORIAL[tut];
    const hold = !!(step && step.pause && (!step.wait || !tutReady()));
    if (run && run.phase === 'play' && speed > 0 && !hold && !anyDialog() && !$('play').hidden) {
      E.tick(run, dt * speed);
      consume();
      if (run.score !== run.banked) {
        E.bank(meta, run);
        save();
      }
    }
    if (tut >= 0) paintTut();
    if (run && $('play').hidden === false) {
      renderer.resize();
      if (!userCam && renderer.view().w > 40 && renderer.view().h > 40) {
        const city = run.city;
        const expect = Math.min(renderer.view().w / (city.cols + 2), renderer.view().h / (city.rows + 3));
        if (Math.abs(cam.z - expect) > expect * 0.45 && cam.z <= 42) fit(true);
      }
      if (run.phase === 'upgrade') openUpgrade();
      if (run.phase === 'over') openResult();
      renderer.draw(run, cam, preview, {
        colors: E.COLOR,
        colorblind: !!meta.settings.colorblind,
        motion: !!meta.settings.motion,
        highlight: highlight(),
        now: now
      });
      refreshHud();
      audio.tick(dt, run ? E.currentWeek(run) : 1);
    }
  }

  function commitChain() {
    if (!run || !drawChain || drawChain.length < 1) return;
    if (tool === 'roundabout' || tool === 'light') {
      const start = drawChain[0];
      const node = snap(start.x, start.y, 0.9) || { x: Math.round(start.x), y: Math.round(start.y) };
      const res = tool === 'roundabout' ? E.placeRoundabout(run, node.x, node.y) : E.placeLight(run, node.x, node.y);
      setStatus(res.ok ? '' : res.reason);
      if (res.ok) { audio.place(); save(); }
      return;
    }
    if (drawChain.length < 2) return;
    let res;
    if (tool === 'motorway') {
      const a = drawChain[0];
      const b = drawChain[drawChain.length - 1];
      res = E.placeMotorway(run, a, b);
    } else res = E.stroke(run, drawChain);
    setStatus(res.ok ? '' : (res.reason || ''));
    if (res.ok) save();
  }

  canvas.addEventListener('contextmenu', e => e.preventDefault());
  canvas.addEventListener('pointerdown', e => {
    if (!run || $('play').hidden) return;
    audio.resume();
    canvas.focus();
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* already gone */ }
    if (pointers.size >= 2) {
      drawChain = null;
      preview = null;
      if (erasing) { E.endUndo(run); erasing = false; }
      panning = null;
      const pts = [...pointers.values()];
      pinch = {
        dist: Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) || 1,
        z: cam.z,
        mx: (pts[0].x + pts[1].x) / 2,
        my: (pts[0].y + pts[1].y) / 2,
        cx: cam.x,
        cy: cam.y
      };
      return;
    }
    const w = worldFromEvent(e);
    if (e.button === 1 || hand === 'pan' || e.altKey) {
      panning = { x: e.clientX, y: e.clientY, cx: cam.x, cy: cam.y };
      return;
    }
    if (e.button === 2 || hand === 'erase') {
      erasing = true;
      E.beginUndo(run);
      const res = E.eraseAt(run, w.x, w.y);
      if (!res.ok && res.reason) setStatus(res.reason);
      return;
    }
    if (tool === 'roundabout' || tool === 'light') {
      drawChain = [{ x: w.x, y: w.y }];
      return;
    }
    const node = snap(w.x, w.y, 0.8);
    if (!node) {
      panning = { x: e.clientX, y: e.clientY, cx: cam.x, cy: cam.y };
      return;
    }
    drawChain = [node];
    preview = tool === 'motorway' ? null : E.previewStroke(run, drawChain);
  });
  canvas.addEventListener('pointermove', e => {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size >= 2 && pinch) {
      const pts = [...pointers.values()];
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) || 1;
      const rect = canvas.getBoundingClientRect();
      const mx = (pts[0].x + pts[1].x) / 2 - rect.left;
      const my = (pts[0].y + pts[1].y) / 2 - rect.top;
      zoomAt(mx, my, pinch.z * dist / pinch.dist);
      return;
    }
    if (panning) {
      cam.x = panning.cx - (e.clientX - panning.x) / cam.z;
      cam.y = panning.cy - (e.clientY - panning.y) / cam.z;
      clampCam();
      userCam = true;
      return;
    }
    if (!run) return;
    const w = worldFromEvent(e);
    if (erasing) {
      E.eraseAt(run, w.x, w.y);
      return;
    }
    if (!drawChain || tool === 'roundabout' || tool === 'light') return;
    const node = snap(w.x, w.y, 0.95);
    if (!node) return;
    extendChain(node);
    if (tool === 'motorway' && drawChain.length >= 2) {
      const a = drawChain[0];
      const b = drawChain[drawChain.length - 1];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const len = Math.hypot(dx, dy) || 1;
      const bad = len < 2;
      preview = { motor: { ax: a.x, ay: a.y, bx: b.x, by: b.y, cx: (a.x + b.x) / 2 + (-dy / len) * 0.6, cy: (a.y + b.y) / 2 + (dx / len) * 0.6, bad: bad } };
    } else preview = E.previewStroke(run, drawChain);
    if (preview && preview.reason) setStatus(preview.reason);
  });
  function pointerEnd(e) {
    pointers.delete(e.pointerId);
    if (pointers.size < 2) pinch = null;
    if (pointers.size > 0) return;
    if (erasing) {
      E.endUndo(run);
      erasing = false;
      save();
    }
    panning = null;
    if (drawChain) commitChain();
    drawChain = null;
    preview = null;
  }
  canvas.addEventListener('pointerup', pointerEnd);
  canvas.addEventListener('pointercancel', pointerEnd);
  canvas.addEventListener('wheel', e => {
    if (!run || $('play').hidden) return;
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const factor = Math.exp(-e.deltaY * 0.0012);
    zoomAt(e.clientX - rect.left, e.clientY - rect.top, cam.z * factor);
  }, { passive: false });

  window.addEventListener('keydown', e => {
    if (e.target && e.target.closest && e.target.closest('input, textarea, select')) return;
    const key = e.key.toLowerCase();
    if (e.key === 'Escape') {
      if ($('help').open) { hide('help'); return; }
      if ($('settings').open) { hide('settings'); return; }
      if ($('pause').open) { hide('pause'); return; }
      if ($('upgrade').open || $('result').open) return;
      if (run && !$('play').hidden) { show('pause'); e.preventDefault(); }
      return;
    }
    if (anyDialog() || !run || $('play').hidden) return;
    if (key === ' ' || e.code === 'Space') {
      if (e.target && e.target.closest && e.target.closest('button, a')) return;
      e.preventDefault();
      speed = speed === 0 ? 1 : 0;
      return;
    }
    if (key === 'z' && !e.shiftKey) { if (E.undo(run)) { save(); setStatus(''); } return; }
    if (key === 'y' || (key === 'z' && e.shiftKey)) { if (E.redo(run)) save(); return; }
    if (key === 'x') { hand = hand === 'erase' ? 'draw' : 'erase'; refreshTools(); return; }
    if (key === 'd') { hand = 'draw'; refreshTools(); return; }
    if (key === 'm') { hand = 'pan'; refreshTools(); return; }
    const tools = { '1': 'road', '2': 'motorway', '3': 'bridge', '4': 'tunnel', '5': 'roundabout', '6': 'light' };
    if (tools[key]) { tool = tools[key]; hand = 'draw'; refreshTools(); return; }
    if (key === 'q' || key === '[') { speed = Math.max(0, speed - 1); return; }
    if (key === 'e' || key === ']') { speed = Math.min(3, speed === 0 ? 1 : speed + 1); return; }
    const pan = 1.2;
    if (e.key === 'ArrowLeft' || key === 'a') { cam.x -= pan; userCam = true; clampCam(); e.preventDefault(); }
    if (e.key === 'ArrowRight') { cam.x += pan; userCam = true; clampCam(); e.preventDefault(); }
    if (e.key === 'ArrowUp' || key === 'w') { cam.y -= pan; userCam = true; clampCam(); e.preventDefault(); }
    if (e.key === 'ArrowDown' || key === 's') { cam.y += pan; userCam = true; clampCam(); e.preventDefault(); }
    if (key === '+' || key === '=') zoomAt(renderer.view().w / 2, renderer.view().h / 2, cam.z * 1.08);
    if (key === '-' || key === '_') zoomAt(renderer.view().w / 2, renderer.view().h / 2, cam.z / 1.08);
    if (key === 'f') fit(true);
  });

  document.querySelectorAll('#dock [data-tool]').forEach(btn => {
    btn.addEventListener('click', () => {
      tool = btn.getAttribute('data-tool');
      hand = 'draw';
      audio.resume();
      audio.ui();
      refreshTools();
    });
  });
  $('eraseBtn').addEventListener('click', () => {
    hand = hand === 'erase' ? 'draw' : 'erase';
    audio.ui();
    refreshTools();
  });
  for (const n of [0, 1, 2, 3]) {
    $('speed' + n).addEventListener('click', () => { speed = n; audio.resume(); });
  }
  $('undoBtn').addEventListener('click', () => { if (run && E.undo(run)) { save(); setStatus(''); } });
  $('fitBtn').addEventListener('click', () => fit(true));
  $('pauseBtn').addEventListener('click', () => { if (run) show('pause'); });
  $('resumeBtn').addEventListener('click', () => hide('pause'));
  $('pauseHelp').addEventListener('click', () => show('help'));
  $('pauseSettings').addEventListener('click', () => { syncSettings(); show('settings'); });
  $('pauseCities').addEventListener('click', () => { hide('pause'); pickMode = 'endless'; renderCities(); screenOf('cities'); save(); });
  $('pauseTitle').addEventListener('click', () => { hide('pause'); save(); title(); });

  $('continueBtn').addEventListener('click', () => { audio.resume(); resumeRun(); });
  $('citiesBtn').addEventListener('click', () => { audio.resume(); pickMode = 'endless'; renderCities(); screenOf('cities'); });
  $('citiesHome').addEventListener('click', title);
  $('cityList').addEventListener('click', e => {
    const btn = e.target.closest('[data-city]');
    if (!btn || btn.disabled) return;
    audio.resume();
    begin(btn.getAttribute('data-city'), pickMode === 'sketch' ? 'sketch' : 'endless');
  });
  $('dailyBtn').addEventListener('click', () => {
    audio.resume();
    const day = E.dailyKey();
    const city = E.CITIES[E.dailySeed(day) % E.CITIES.length];
    begin(city.id, 'daily', { dayKey: day });
  });
  $('weeklyBtn').addEventListener('click', () => {
    audio.resume();
    const week = E.weeklyKey();
    const city = E.CITIES[E.weeklySeed(week) % E.CITIES.length];
    begin(city.id, 'weekly', { weekKey: week });
  });
  $('sketchBtn').addEventListener('click', () => { audio.resume(); pickMode = 'sketch'; renderCities(); screenOf('cities'); });
  $('achieveBtn').addEventListener('click', () => { renderAchieve(); screenOf('achieve'); });
  $('achieveHome').addEventListener('click', title);
  $('helpBtn').addEventListener('click', () => show('help'));
  $('helpClose').addEventListener('click', () => hide('help'));
  $('settingsBtn').addEventListener('click', () => { syncSettings(); show('settings'); });
  $('settingsDone').addEventListener('click', () => { hide('settings'); save(); });
  $('pauseSettings');
  function readSettings() {
    meta.settings.music = Number($('music').value);
    meta.settings.sfx = Number($('sfx').value);
    meta.settings.mute = $('mute').checked;
    meta.settings.colorblind = $('colorblind').checked;
    meta.settings.motion = $('motion').checked;
    applyAudio();
    save();
  }
  ['music', 'sfx', 'mute', 'colorblind', 'motion'].forEach(id => $(id).addEventListener('input', readSettings));
  $('wipe').addEventListener('click', () => {
    if (!wipeArmed) {
      wipeArmed = true;
      $('wipe').textContent = 'Confirm erase';
      return;
    }
    localStorage.removeItem(E.SAVE_KEY);
    meta = E.createMeta();
    run = null;
    wipeArmed = false;
    $('wipe').textContent = 'Erase Lanewright save';
    hide('settings');
    title();
  });

  $('upgradeCards').addEventListener('click', e => {
    const btn = e.target.closest('[data-card]');
    if (!btn || !run) return;
    const res = E.chooseUpgrade(run, Number(btn.getAttribute('data-card')));
    if (!res.ok) return;
    hide('upgrade');
    audio.upgrade();
    setStatus(res.card ? res.card.label : '');
    save();
  });
  $('upgrade').addEventListener('cancel', e => e.preventDefault());

  $('retryBtn').addEventListener('click', () => {
    hide('result');
    if (!launched) { title(); return; }
    begin(launched.cityId, launched.mode, launched.opts);
  });
  $('resultCities').addEventListener('click', () => { hide('result'); pickMode = 'endless'; renderCities(); screenOf('cities'); });
  $('resultTitleBtn').addEventListener('click', () => { hide('result'); title(); });

  $('tutSkip').addEventListener('click', endTut);
  $('tutNext').addEventListener('click', () => {
    if (!tutReady()) return;
    tut += 1;
    if (tut >= TUTORIAL.length) endTut();
    else paintTut();
  });

  window.addEventListener('resize', () => { if (run && !$('play').hidden) fit(false); });
  document.addEventListener('pointerdown', () => audio.resume(), { once: false });

  load();
  syncSettings();
  title();
  requestAnimationFrame(frame);
})();
