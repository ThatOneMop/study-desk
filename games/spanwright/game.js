'use strict';
(function () {
  const E = window.SpanEngine;
  const R = window.SpanRender;
  const audio = window.SpanAudio.createAudio();
  const $ = id => document.getElementById(id);
  const TUTORIAL = [
    { title: 'Road', body: 'Wheels only trust road. Drag from the left brass bolt two squares right, or tap the bolt and then the next joint.' },
    { title: 'Two metres', body: 'Road stops at 2 m. Keep going from the joint you just made until the road reaches the far bolt.' },
    { title: 'Send it', body: 'Play runs the cart. If it swims, undo and give the middle a triangle.' },
    { title: 'The load', body: 'Stress paints the members while they work. Green is quiet. Red is about to complain. Pinch or wheel to zoom; two fingers or the middle button pan.' }
  ];

  let meta = loadMeta();
  let screen = 'title';
  let session = null;
  let tool = 'road';
  let anchor = null;
  let ghost = null;
  let side = null;
  let cam = { x: 8, y: 6, zoom: 48, shake: 0 };
  let cursor = null;
  let particles = [];
  let tut = 0;
  let keys = {};
  let last = 0;
  let pointers = new Map();
  let pinching = null;
  let panning = null;
  let inspectorKey = '';
  const speeds = [1, 2, 4];
  let speedIndex = 0;

  function loadMeta() {
    try {
      const raw = localStorage.getItem(E.SAVE_KEY);
      if (!raw) return E.defaultMeta();
      const decoded = E.decode(raw);
      return decoded.ok ? decoded.meta : E.defaultMeta();
    } catch (err) {
      return E.defaultMeta();
    }
  }
  function saveMeta() {
    try { localStorage.setItem(E.SAVE_KEY, E.encode({ meta: meta })); } catch (err) {}
  }

  function show(next) {
    screen = next;
    ['title', 'map', 'achievements', 'play'].forEach(id => { $(id).hidden = id !== next; });
    if (next === 'map') renderMap();
    if (next === 'achievements') renderAchievements();
    if (next === 'play') {
      requestAnimationFrame(() => { resize(); $('scene').focus(); });
    }
    if (next === 'title') {
      $('yardBtn').disabled = !E.levelUnlocked(meta, 'yard');
    }
  }

  function money(n) { return '$' + Math.round(n).toLocaleString('en-US'); }
  function stars(n) { return '★★★'.slice(0, n) + '☆☆☆'.slice(0, 3 - n); }

  function renderMap() {
    const root = $('worlds');
    root.replaceChildren();
    E.WORLDS.forEach(world => {
      const section = document.createElement('section');
      section.className = 'world';
      const open = E.worldUnlocked(meta, world.id);
      const h = document.createElement('h2');
      h.textContent = world.name;
      const p = document.createElement('p');
      p.className = 'fine';
      p.textContent = open ? world.line : 'Opens after four clears in the previous chapter.';
      section.append(h, p);
      const grid = document.createElement('div');
      grid.className = 'levels';
      E.LEVELS.filter(l => l.world === world.id).forEach(level => {
        const btn = document.createElement('button');
        btn.type = 'button';
        const unlocked = E.levelUnlocked(meta, level);
        btn.disabled = !unlocked;
        const s = meta.stars[level.id] || 0;
        btn.innerHTML = '<strong>' + level.name + '</strong><small>' + (unlocked ? stars(s) : 'Locked') + '</small>';
        btn.addEventListener('click', () => start(level.id));
        grid.append(btn);
      });
      section.append(grid);
      root.append(section);
    });
    $('mapYard').disabled = !E.levelUnlocked(meta, 'yard');
  }

  function renderAchievements() {
    const root = $('achieveList');
    root.replaceChildren();
    E.ACHIEVEMENTS.forEach(item => {
      const row = document.createElement('div');
      row.className = 'achieve' + (meta.achievements[item.id] ? '' : ' lock');
      row.innerHTML = '<div><strong>' + item.name + '</strong><div class="fine">' + item.detail + '</div></div><span>' + (meta.achievements[item.id] ? 'Kept' : '—') + '</span>';
      root.append(row);
    });
  }

  function start(id) {
    session = E.startLevel(meta, id);
    if (!session) return;
    tool = session.level.materials[0];
    anchor = null;
    ghost = null;
    side = null;
    particles = [];
    tut = session.level.tutorial && meta.tutorial ? 0 : -1;
    cursor = { x: session.level.anchors[0].x, y: session.level.anchors[0].y };
    fitCamera();
    buildTools();
    closeVeils();
    show('play');
    $('stressBtn').setAttribute('aria-pressed', 'false');
    audio.startMusic();
    setStatus(session.level.brief);
    updateTutorial();
    updateHud();
  }

  function fitCamera() {
    const level = session.level;
    const x0 = level.xL == null ? level.bounds.x0 : level.xL - 3;
    const x1 = level.xR == null ? level.bounds.x1 : level.xR + 3;
    const deck = Math.max(level.yL || 6, level.yR || 6);
    const y0 = (level.waterY || 1) - 1.2;
    const topBolt = Math.max(deck, ...(level.anchors || []).map((a) => a.y));
    const y1 = Math.max(deck + 4.2, topBolt + 1.6);
    const vw = $('scene').clientWidth || 800;
    const vh = $('scene').clientHeight || 450;
    const zx = vw / Math.max(8, x1 - x0);
    const zy = vh / Math.max(6, y1 - y0);
    const fit = Math.min(zx, zy) * 0.96;
    cam.zoom = Math.max(16, Math.min(fit, 64));
    cam.minZoom = Math.min(16, cam.zoom * 0.8);
    cam.x = ((level.xL == null ? level.bounds.x0 : level.xL) + (level.xR == null ? level.bounds.x1 : level.xR)) / 2;
    cam.y = (y0 + y1) / 2;
    cam.shake = 0;
  }

  function buildTools() {
    const bar = $('tools');
    bar.replaceChildren();
    const items = session.level.materials.slice();
    if (session.level.allowSplit || session.level.materials.indexOf('hydraulic') >= 0 || session.level.sandbox) items.push('split');
    items.push('erase');
    if (session.level.sandbox) items.push('anchor');
    items.forEach(id => {
      const btn = document.createElement('button');
      btn.type = 'button';
      const mat = E.MATERIALS[id];
      const label = mat ? mat.name : (id === 'split' ? 'Hinge' : id === 'erase' ? 'Lift out' : 'Bolt');
      const key = mat ? mat.key : (id === 'split' ? 'H' : id === 'erase' ? 'X' : 'B');
      btn.innerHTML = '<small>' + key + '</small>' + label;
      btn.setAttribute('aria-pressed', String(tool === id));
      btn.addEventListener('click', () => { tool = id; anchor = null; buildTools(); audio.play('ui'); });
      bar.append(btn);
    });
  }

  function updateTutorial() {
    const box = $('tutorial');
    if (tut < 0 || !session || session.level.id !== 'willow-1' || (session.sim && session.sim.mode && tut < 3) || !$('result').hidden) { box.hidden = true; return; }
    const step = TUTORIAL[tut];
    box.hidden = false;
    $('tutTitle').textContent = step.title;
    $('tutBody').textContent = step.body;
  }

  function updateHud() {
    if (!session) return;
    $('levelName').textContent = session.level.name;
    const spent = session.spent || 0;
    const budget = session.level.budget;
    $('budgetText').textContent = money(spent) + ' / ' + money(budget);
    $('budgetPill').classList.toggle('warn', spent > budget);
    const sim = session.sim;
    const peak = sim ? Math.round((sim.liveStrain || sim.peakStrain || 0) * 100) : 0;
    $('stressText').textContent = sim && (sim.mode === 'run' || sim.mode === 'replay') ? (peak > 100 ? 'Snapping' : peak + '%') : 'Quiet';
    updateTutorial();
    $('playBtn').textContent = sim && sim.mode === 'run' ? 'Running' : 'Play';
    const speed = sim && sim.speed || 1;
    $('speedBtn').textContent = 'Speed ' + speed + '×';
    updateInspector();
  }

  function updateInspector() {
    const box = $('inspector');
    const beam = session && session.selected ? session.beams.find(b => b.id === session.selected) : null;
    const running = session && session.sim && (session.sim.mode === 'run' || session.sim.mode === 'replay');
    if (running || !beam || (beam.mat !== 'hydraulic' && beam.mat !== 'spring')) { if (!box.hidden) { box.hidden = true; box.replaceChildren(); } inspectorKey = ''; return; }
    const key = [beam.id, JSON.stringify(beam.phaseOn || {}), JSON.stringify(session.splits.map(x => x.open || {}))].join('|');
    if (key === inspectorKey && !box.hidden) return;
    inspectorKey = key;
    box.hidden = false;
    box.replaceChildren();
    const label = document.createElement('label');
    const title = beam.mat === 'hydraulic' ? 'Piston reach' : 'Coil, pull to push';
    label.append(document.createTextNode(title));
    const range = document.createElement('input');
    range.type = 'range';
    range.min = beam.mat === 'hydraulic' ? '0.5' : '0.65';
    range.max = beam.mat === 'hydraulic' ? '1.5' : '1.4';
    range.step = '0.01';
    range.value = String(beam.scale || 1);
    range.addEventListener('input', () => { E.setScale(session, beam.id, parseFloat(range.value)); setStatus(beam.mat === 'hydraulic' ? 'Piston set to ' + Math.round(beam.scale * 100) + '%.' : 'Coil set.'); });
    label.append(range);
    box.append(label);
    if (beam.mat === 'hydraulic') {
      (session.level.phases || []).forEach(phase => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'ghost';
        const on = !!(beam.phaseOn && beam.phaseOn[phase.id]);
        btn.textContent = phase.label + (on ? ' · armed' : ' · quiet');
        btn.setAttribute('aria-pressed', String(on));
        btn.addEventListener('click', () => { E.togglePhase(session, beam.id, phase.id); updateInspector(); audio.play('ui'); });
        box.append(btn);
      });
    }
    if (beam.mat === 'hydraulic' && session.splits.length) {
      const touching = session.splits.filter(sp => [sp.a, sp.b].some(id => id === beam.a || id === beam.b));
      const list = touching.length ? touching : session.splits;
      list.forEach(splitItem => {
        const n = session.splits.indexOf(splitItem) + 1;
        (session.level.phases || []).forEach(phase => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'ghost hinge';
          const on = !!(splitItem.open && splitItem.open[phase.id]);
          btn.setAttribute('aria-pressed', String(on));
          btn.textContent = 'Hinge ' + n + ' · ' + (phase.label || phase.id) + (on ? ' · opens' : ' · holds');
          btn.addEventListener('click', () => { E.toggleSplitPhase(session, splitItem.a, phase.id); updateInspector(); });
          box.append(btn);
        });
      });
    }
  }

  function setStatus(text) { $('status').textContent = text || ''; }

  function screenPoint(ev) {
    const rect = $('scene').getBoundingClientRect();
    const sx = ev.clientX - rect.left;
    const sy = ev.clientY - rect.top;
    return {
      x: cam.x + (sx - rect.width / 2) / cam.zoom,
      y: cam.y - (sy - rect.height / 2) / cam.zoom
    };
  }

  function zoomAt(clientX, clientY, nextZoom) {
    const rect = $('scene').getBoundingClientRect();
    const sx = clientX - rect.left - rect.width / 2;
    const sy = clientY - rect.top - rect.height / 2;
    const z = Math.max(cam.minZoom || 18, Math.min(90, nextZoom));
    const wx = cam.x + sx / cam.zoom, wy = cam.y - sy / cam.zoom;
    cam.zoom = z;
    cam.x = wx - sx / z;
    cam.y = wy + sy / z;
  }
  function followCursor() {
    if (!cursor) return;
    const rect = $('scene').getBoundingClientRect();
    const halfW = rect.width / 2 / cam.zoom - 1, halfH = rect.height / 2 / cam.zoom - 1.5;
    if (cursor.x < cam.x - halfW) cam.x = cursor.x + halfW;
    if (cursor.x > cam.x + halfW) cam.x = cursor.x - halfW;
    if (cursor.y < cam.y - halfH) cam.y = cursor.y + halfH;
    if (cursor.y > cam.y + halfH) cam.y = cursor.y - halfH;
  }
  function tutorialProgress(event) {
    if (tut < 0 || !session || session.level.id !== 'willow-1') return;
    if (event === 'beam' && tut === 0) tut = 1;
    const far = session.level.anchors[1];
    const reached = session.beams.some(b => b.mat === 'road' && [b.a, b.b].some(id => { const n = session.nodes.find(k => k.id === id); return n && Math.abs(n.x - far.x) < 0.01 && Math.abs(n.y - far.y) < 0.01; }));
    if (event === 'beam' && tut === 1 && reached) tut = 2;
    if (event === 'play' && tut <= 2) tut = 3;
    updateTutorial();
  }

  function place(x0, y0, x1, y1) {
    if (tool === 'erase') {
      const hit = E.deleteAt(session, x1, y1);
      setStatus(hit.ok ? 'Lifted out.' : hit.reason);
      if (hit.ok) audio.play('delete');
      return;
    }
    if (tool === 'split') {
      const hit = E.splitJoint(session, x1, y1);
      setStatus(hit.ok ? 'Hinge seated. Arm it on the phases where it should open.' : hit.reason);
      if (hit.ok) { session.selected = null; audio.play('steel'); updateInspector(); }
      return;
    }
    if (tool === 'anchor') {
      const hit = E.addAnchor(session, x1, y1);
      setStatus(hit.ok ? 'Bolt seated.' : hit.reason);
      return;
    }
    const hit = E.placeBeam(session, tool, x0, y0, x1, y1, { sideA: side, sideB: side });
    if (!hit.ok && hit.needSide) {
      side = side === 'a' ? 'b' : 'a';
      setStatus(side === 'a' ? 'Hinge side: bank.' : 'Hinge side: leaf. Tap again.');
      return;
    }
    if (!hit.ok) { setStatus(hit.reason); return; }
    audio.play(tool === 'steel' || tool === 'hydraulic' ? 'steel' : tool === 'rope' || tool === 'cable' ? 'rope' : 'wood');
    burst(hit.x1, hit.y1, '#e6d3b0', 8);
    setStatus(E.MATERIALS[tool].name + ' · ' + hit.len.toFixed(1) + ' m · ' + money(hit.cost));
    updateHud();
    tutorialProgress('beam');
    if (session.level.sandbox) meta.sandbox = E.exportDesign(session);
    else meta.drafts[session.level.id] = E.exportDesign(session);
    saveMeta();
  }

  function burst(x, y, color, n) {
    if (meta.settings.quality === 'plain') return;
    for (let i = 0; i < n; i++) {
      particles.push({ x: x, y: y, vx: (Math.random() - 0.5) * 2, vy: Math.random() * 2, life: 0.6 + Math.random() * 0.4, color: color, size: 2 + Math.random() * 3 });
    }
  }

  function onPointerDown(ev) {
    $('scene').setPointerCapture(ev.pointerId);
    pointers.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
    if (pointers.size === 2) {
      const pts = [...pointers.values()];
      pinching = { dist: Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y), mx: (pts[0].x + pts[1].x) / 2, my: (pts[0].y + pts[1].y) / 2, zoom: cam.zoom };
      anchor = null;
      ghost = null;
      return;
    }
    if (ev.button === 1 || (ev.button === 0 && ev.shiftKey)) {
      ev.preventDefault();
      panning = { sx: ev.clientX, sy: ev.clientY };
      return;
    }
    if (ev.button === 2 || tool === 'erase') {
      const p = screenPoint(ev);
      place(p.x, p.y, p.x, p.y);
      return;
    }
    const p = screenPoint(ev);
    if (anchor && anchor.armed) { anchor.down = { sx: ev.clientX, sy: ev.clientY }; return; }
    anchor = { x: p.x, y: p.y, sx: ev.clientX, sy: ev.clientY };
  }
  function onPointerMove(ev) {
    if (panning && pointers.has(ev.pointerId)) {
      cam.x -= (ev.clientX - panning.sx) / cam.zoom;
      cam.y += (ev.clientY - panning.sy) / cam.zoom;
      panning.sx = ev.clientX; panning.sy = ev.clientY;
      return;
    }
    if (!pointers.has(ev.pointerId) && !(anchor && anchor.armed && ev.pointerType === 'mouse')) return;
    if (pointers.has(ev.pointerId)) pointers.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
    if (pointers.size === 2 && pinching) {
      const pts = [...pointers.values()];
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) || 1;
      const mx = (pts[0].x + pts[1].x) / 2, my = (pts[0].y + pts[1].y) / 2;
      cam.x -= (mx - pinching.mx) / cam.zoom;
      cam.y += (my - pinching.my) / cam.zoom;
      pinching.mx = mx; pinching.my = my;
      zoomAt(mx, my, pinching.zoom * dist / (pinching.dist || 1));
      return;
    }
    if (!anchor) return;
    const p = screenPoint(ev);
    if (E.MATERIALS[tool]) {
      const len = Math.hypot(p.x - anchor.x, p.y - anchor.y);
      const mat = E.MATERIALS[tool];
      ghost = { x0: anchor.x, y0: anchor.y, x1: p.x, y1: p.y, ok: len <= mat.max + 0.05 && len > 0.3 };
    }
  }
  function onPointerUp(ev) {
    const wasPinch = !!pinching;
    pointers.delete(ev.pointerId);
    if (pointers.size < 2) pinching = null;
    if (panning) { if (!pointers.size) panning = null; return; }
    if (wasPinch || pointers.size) return;
    if (!anchor) return;
    const origin = anchor.armed && anchor.down ? anchor.down : anchor;
    const moved = Math.hypot(ev.clientX - origin.sx, ev.clientY - origin.sy);
    const p = screenPoint(ev);
    if (moved < 6) {
      if (!anchor.armed) {
        const pick = E.pickBeam(session, p.x, p.y);
        const nearJoint = session.nodes.some(n => Math.hypot(n.x - p.x, n.y - p.y) < 0.45);
        const picked = pick && session.beams.find(b => b.id === pick.id);
        if (picked && !nearJoint && (picked.mat === 'hydraulic' || picked.mat === 'spring')) {
          session.selected = picked.id; anchor = null; ghost = null;
          setStatus(picked.mat === 'hydraulic' ? 'Piston selected. Set its reach and phases below.' : 'Coil selected.');
          audio.play('ui');
          return;
        }
        if (session.selected && !nearJoint && !pick) session.selected = null;
      }
      if (!anchor.armed) { anchor = { x: p.x, y: p.y, sx: ev.clientX, sy: ev.clientY, armed: true }; ghost = null; setStatus('Start set. Tap the other end, or tap here again to cancel.'); return; }
      if (Math.hypot(ev.clientX - anchor.sx, ev.clientY - anchor.sy) < 10) { anchor = null; ghost = null; setStatus('Member cancelled.'); return; }
      place(anchor.x, anchor.y, p.x, p.y);
    } else if (E.MATERIALS[tool]) place(anchor.x, anchor.y, p.x, p.y);
    anchor = null;
    ghost = null;
  }

  function consumeEvents() {
    const sim = session && session.sim;
    if (!sim || !sim.events) return;
    for (const e of sim.events) {
      if (e.type === 'break') {
        audio.play('break');
        if (meta.settings.shake !== false) cam.shake = Math.min(22, cam.shake + 8);
        burst(e.x, e.y, e.mat === 'wood' ? '#c4894a' : '#d7dde3', 14);
      } else if (e.type === 'splash') audio.play('splash');
      else if (e.type === 'flag') audio.play('star');
      else if (e.type === 'result') {
        audio.play(e.result === 'success' ? 'success' : 'fail');
        onResult();
      }
    }
    sim.events.length = 0;
  }

  function onResult() {
    const fresh = E.award(meta, session);
    if (session.level.sandbox) meta.sandbox = E.exportDesign(session);
    else meta.drafts[session.level.id] = E.exportDesign(session);
    saveMeta();
    const g = session.sim.grade;
    const ok = session.sim.result === 'success';
    $('resultKicker').textContent = ok ? 'Across' : 'Not this time';
    $('resultTitle').textContent = ok ? session.level.name : 'The span gave way';
    $('resultBody').textContent = E.reasonText(session.sim) + ' ' + money(g.spent) + ' of ' + money(g.budget) + (g.peak > 1 ? '. Something went past its limit.' : '. Peak load ' + Math.round(g.peak * 100) + '%.');
    $('resultStars').textContent = stars(g.stars || 0);
    $('result').hidden = false;
    if (fresh.length) setStatus('Noted in the book: ' + fresh.map(id => E.ACHIEVEMENTS.find(a => a.id === id).name).join(', '));
    const idx = E.LEVELS.findIndex(l => l.id === session.level.id);
    const next = E.LEVELS[idx + 1];
    $('nextBtn').disabled = !next || !E.levelUnlocked(meta, next);
  }

  function tick(now) {
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
    last = now;
    if (screen === 'play' && session && !paused() && session.sim && session.sim.mode === 'run') {
      const n = session.sim.speed || 1;
      for (let i = 0; i < n; i++) E.tick(session);
      consumeEvents();
    } else if (screen === 'play' && session && session.sim && session.sim.mode === 'replay' && !paused()) {
      E.tickReplay(session, dt);
    }
    particles.forEach(p => { p.x += p.vx * dt; p.y += p.vy * dt; p.vy -= dt * 2; p.life -= dt; });
    particles = particles.filter(p => p.life > 0);
    cam.shake *= 0.86;
    if (screen === 'play' && session) paint();
    updateHud();
    requestAnimationFrame(tick);
  }

  function paused() {
    return !$('pause').hidden || !$('settings').hidden || !$('info').hidden;
  }

  function paint() {
    const canvas = $('scene');
    const dpr = Math.min(window.devicePixelRatio || 1, meta.settings.quality === 'plain' ? 1.25 : 2);
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
    }
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const shake = meta.settings.shake === false ? 0 : cam.shake;
    const view = { x: cam.x + (Math.random() - 0.5) * shake * 0.04, y: cam.y + (Math.random() - 0.5) * shake * 0.04, zoom: cam.zoom };
    R.draw(ctx, w, h, session, view, particles, {
      time: performance.now() / 1000,
      quality: meta.settings.quality,
      stress: session.sim && (session.sim.stress || $('stressBtn').getAttribute('aria-pressed') === 'true'),
      ink: !!meta.settings.stressInk,
      ghost: ghost,
      selected: session.selected,
      cursor: cursor,
      mode: session.sim && session.sim.mode
    });
  }

  function resize() {
    if (session && screen === 'play') fitCamera();
  }

  function closeVeils() {
    ['pause', 'settings', 'result', 'info'].forEach(id => { $(id).hidden = true; });
  }

  function openSettings() {
    $('volMaster').value = meta.settings.master;
    $('volMusic').value = meta.settings.music;
    $('volSfx').value = meta.settings.sfx;
    $('qualityBtn').textContent = 'Picture: ' + (meta.settings.quality === 'plain' ? 'Plain' : 'Fine');
    $('inkBtn').textContent = 'Stress: ' + (meta.settings.stressInk ? 'Ink' : 'Colour');
    $('shakeBtn').textContent = 'Shake: ' + (meta.settings.shake === false ? 'Off' : 'On');
    $('gridBtn').textContent = 'Grid: ' + (meta.settings.grid === 0.5 ? '½ m' : '1 m');
    $('settings').hidden = false;
  }

  function bind() {
    $('continueBtn').addEventListener('click', () => {
      audio.resume(); audio.startMusic(); audio.play('ui');
      const next = E.LEVELS.find(l => E.levelUnlocked(meta, l) && !(meta.stars[l.id] > 0)) || E.LEVELS[0];
      start(next.id);
    });
    $('mapBtn').addEventListener('click', () => { audio.play('ui'); show('map'); });
    $('yardBtn').addEventListener('click', () => start('yard'));
    $('mapYard').addEventListener('click', () => start('yard'));
    $('achieveBtn').addEventListener('click', () => { audio.play('ui'); show('achievements'); });
    $('settingsBtn').addEventListener('click', openSettings);
    $('mapHome').addEventListener('click', () => show('title'));
    $('achieveHome').addEventListener('click', () => show('title'));
    $('pauseBtn').addEventListener('click', () => { $('pause').hidden = false; $('resumeBtn').focus(); });
    $('resumeBtn').addEventListener('click', () => { $('pause').hidden = true; $('scene').focus(); });
    $('retryBtn').addEventListener('click', () => { if (session.sim) E.rebuild(session); $('pause').hidden = true; updateHud(); });
    $('quitBtn').addEventListener('click', () => { closeVeils(); if (session && !session.level.sandbox) { meta.drafts[session.level.id] = E.exportDesign(session); saveMeta(); } show('map'); });
    $('pauseSettings').addEventListener('click', openSettings);
    $('settingsClose').addEventListener('click', () => { $('settings').hidden = true; });
    $('infoBtn').addEventListener('click', () => {
      const level = session.level;
      $('infoKicker').textContent = level.world;
      $('infoTitle').textContent = level.name;
      const vehicles = (level.vehicles || []).map(v => (E.VEHICLES[v.type] || {}).name || v.type).join(', ');
      const phases = (level.phases || []).map(p => p.id + ' ' + (p.label || '')).join(' · ');
      const contract = level.contract && level.contract.requireClean ? ' Nothing may reach its limit.' : '';
      const under = level.contract && level.contract.requireUnder ? ' It must come in under budget.' : '';
      $('infoBody').textContent = level.brief + ' Budget ' + money(level.budget) + '. Vehicles: ' + vehicles + '. Phases: ' + phases + '.' + contract + under;
      $('info').hidden = false;
    });
    $('infoClose').addEventListener('click', () => { $('info').hidden = true; });
    $('playBtn').addEventListener('click', () => {
      audio.resume();
      if (session.sim && session.sim.mode === 'run') return;
      if (session.sim) E.rebuild(session);
      const started = E.beginSim(session);
      if (!started.ok) { setStatus(started.reason); return; }
      audio.play('play');
      $('result').hidden = true;
      anchor = null; ghost = null;
      setStatus('The crossing is in motion.');
      tutorialProgress('play');
    });
    $('undoBtn').addEventListener('click', () => { if (session && E.undo(session)) { audio.play('ui'); updateHud(); } });
    $('redoBtn').addEventListener('click', () => { if (session && E.redo(session)) { audio.play('ui'); updateHud(); } });
    $('cancelBtn').addEventListener('click', () => { anchor = null; ghost = null; setStatus('Member cancelled.'); audio.play('ui'); });
    $('stressBtn').addEventListener('click', () => {
      const on = $('stressBtn').getAttribute('aria-pressed') !== 'true';
      $('stressBtn').setAttribute('aria-pressed', String(on));
      if (session.sim) session.sim.stress = on;
    });
    $('rebuildBtn').addEventListener('click', () => { E.rebuild(session); $('result').hidden = true; updateHud(); });
    $('resultMap').addEventListener('click', () => { closeVeils(); show('map'); });
    $('nextBtn').addEventListener('click', () => {
      const idx = E.LEVELS.findIndex(l => l.id === session.level.id);
      const next = E.LEVELS[idx + 1];
      if (next && E.levelUnlocked(meta, next)) start(next.id);
    });
    $('replayBtn').addEventListener('click', () => {
      const fresh = E.noteReplay(meta);
      saveMeta();
      E.beginReplay(session);
      $('result').hidden = true;
      if (fresh.length) setStatus('Replay kept in the book.');
    });
    $('speedBtn').addEventListener('click', () => {
      speedIndex = (speedIndex + 1) % speeds.length;
      if (session.sim) E.setSpeed(session, speeds[speedIndex]);
      $('speedBtn').textContent = 'Speed ' + speeds[speedIndex] + '×';
    });
    $('replayScrub').addEventListener('input', () => {
      if (session && session.sim && session.sim.samples) E.seekReplay(session, parseFloat($('replayScrub').value));
    });
    ['volMaster', 'volMusic', 'volSfx'].forEach(id => {
      $(id).addEventListener('input', () => {
        meta.settings.master = parseFloat($('volMaster').value);
        meta.settings.music = parseFloat($('volMusic').value);
        meta.settings.sfx = parseFloat($('volSfx').value);
        audio.setVolumes(meta.settings);
        saveMeta();
      });
    });
    $('qualityBtn').addEventListener('click', () => { meta.settings.quality = meta.settings.quality === 'plain' ? 'fine' : 'plain'; saveMeta(); openSettings(); });
    $('inkBtn').addEventListener('click', () => { meta.settings.stressInk = !meta.settings.stressInk; saveMeta(); openSettings(); });
    $('shakeBtn').addEventListener('click', () => { meta.settings.shake = meta.settings.shake === false; saveMeta(); openSettings(); });
    $('gridBtn').addEventListener('click', () => {
      meta.settings.grid = meta.settings.grid === 0.5 ? 1 : 0.5;
      if (session) session.grid = meta.settings.grid;
      saveMeta(); openSettings();
    });
    $('tutNext').addEventListener('click', () => { tut += 1; if (tut >= TUTORIAL.length) { tut = -1; meta.tutorial = false; saveMeta(); } updateTutorial(); });
    $('tutSkip').addEventListener('click', () => { tut = -1; meta.tutorial = false; saveMeta(); updateTutorial(); });

    const scene = $('scene');
    scene.addEventListener('contextmenu', ev => ev.preventDefault());
    scene.addEventListener('pointerdown', onPointerDown);
    scene.addEventListener('pointermove', onPointerMove);
    scene.addEventListener('pointerup', onPointerUp);
    scene.addEventListener('pointercancel', onPointerUp);
    scene.addEventListener('auxclick', ev => ev.preventDefault());
    scene.addEventListener('wheel', ev => {
      ev.preventDefault();
      zoomAt(ev.clientX, ev.clientY, cam.zoom * (ev.deltaY > 0 ? 0.92 : 1.08));
    }, { passive: false });

    window.addEventListener('keydown', ev => {
      if (ev.target && ev.target.closest && ev.target.closest('input, textarea')) return;
      if (ev.key === 'Escape') {
        if (!$('settings').hidden) { $('settings').hidden = true; return; }
        if (screen === 'play' && anchor && $('pause').hidden) { anchor = null; ghost = null; setStatus('Member cancelled.'); return; }
        if (!$('info').hidden) { $('info').hidden = true; return; }
        if (!$('result').hidden) return;
        if (screen === 'play') { $('pause').hidden = !$('pause').hidden; if (!$('pause').hidden) $('resumeBtn').focus(); }
        return;
      }
      if (paused()) return;
      keys[ev.key] = true;
      if (screen !== 'play' || !session) return;
      const mat = Object.values(E.MATERIALS).find(m => m.key === ev.key && session.level.materials.indexOf(m.id) >= 0);
      if (mat) { tool = mat.id; buildTools(); return; }
      if (ev.key === 'h' || ev.key === 'H') { tool = 'split'; buildTools(); }
      if (ev.key === 'x' || ev.key === 'X') { tool = 'erase'; buildTools(); }
      if (ev.key === 'z' && !ev.metaKey && !ev.ctrlKey) { E.undo(session); updateHud(); }
      if (ev.key === 'Z' && ev.shiftKey) E.redo(session);
      if (ev.key === ' ') { ev.preventDefault(); $('playBtn').click(); }
      if (ev.key === 't' || ev.key === 'T') $('stressBtn').click();
      if (ev.key === 'r' || ev.key === 'R') { if (session.sim) E.rebuild(session); }
      if ((ev.key === 'Enter' || ev.key === ' ') && cursor && ev.key === 'Enter') {
        if (tool === 'erase' || tool === 'split' || tool === 'anchor') { place(cursor.x, cursor.y, cursor.x, cursor.y); return; }
        if (!anchor) { anchor = { x: cursor.x, y: cursor.y, sx: 0, sy: 0, armed: true }; setStatus('Start set. Move the pin and press Enter.'); }
        else {
          place(anchor.x, anchor.y, cursor.x, cursor.y);
          ghost = null;
          anchor = { x: cursor.x, y: cursor.y, sx: 0, sy: 0, armed: true };
        }
      }
      const step = session.grid || 1;
      const arrows = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] };
      if (arrows[ev.key] && cursor) {
        ev.preventDefault();
        cursor.x += arrows[ev.key][0];
        cursor.y += arrows[ev.key][1];
        followCursor();
        if (anchor && anchor.armed && E.MATERIALS[tool]) {
          const len = Math.hypot(cursor.x - anchor.x, cursor.y - anchor.y);
          ghost = { x0: anchor.x, y0: anchor.y, x1: cursor.x, y1: cursor.y, ok: len <= E.MATERIALS[tool].max + 0.05 && len > 0.3 };
        }
        setStatus('Survey pin ' + cursor.x.toFixed(1) + ', ' + cursor.y.toFixed(1) + (anchor ? '. Enter ends the member, Esc cancels.' : '. Enter starts a member.'));
      }
    });
    window.addEventListener('keyup', ev => { keys[ev.key] = false; });
    window.addEventListener('resize', resize);
  }

  bind();
  audio.setVolumes(meta.settings);
  show('title');
  requestAnimationFrame(tick);
  window.Spanwright = { get meta() { return meta; }, get session() { return session; }, get cam() { return cam; }, start: start };
})();
