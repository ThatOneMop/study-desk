/* Winterfold — map UI, saving, and the morning loop. */
(function () {
  'use strict';
  const E = window.WinterfoldEngine;
  const audio = window.WinterfoldAudio;
  const canvas = document.getElementById('map');
  const renderer = window.WinterfoldRender.createRenderer(canvas, E);
  const $ = id => document.getElementById(id);
  const POI_LABEL = { station: 'Station', summit: 'Summit', viewpoint: 'Viewpoint', rescue: 'Rescue', snowpark: 'Snow park', cafe: 'Cafe', restaurant: 'Restaurant', refuge: 'Refuge' };
  const POI_MARK = { station: '□', summit: '△', viewpoint: '◇', rescue: '+', snowpark: '★', cafe: '☕', restaurant: '●', refuge: '⌂' };
  const SLOPE_LABEL = { green: 'Green', blue: 'Blue', red: 'Red', black: 'Black', trail: 'Trail' };
  const SLOPE_COLOR = { green: '#2f9d4a', blue: '#2a6fe0', red: '#d23c3c', black: '#241f1c', trail: '#e08a2f' };
  const LIFT_LABEL = { tow: 'Ski lift', chair: 'Chair', cabin: 'Cabin' };
  const TUTORIAL = [
    ['Drag downhill', 'Choose Slope, then drag from the summit down toward the station. The colour is the steepness. Green is gentle. Black is steep. The run only goes the way you dragged.'],
    ['Bring them back up', 'Switch to Lift and drag from the station up to the summit. A chair crosses trees. A ski lift needs open ground. Cabins are for long spans and cost two tokens.'],
    ['Dusk is 18:00', 'Press play. Guests are shapes looking for a matching stop. They must be back at a station by 18:00, or the hill closes.'],
    ['Mornings', 'Each new day you pick one supply card. Fresh stops appear and flash until a line ends nearby. Cannons make snow. Cut trees to open a lane. Upgrade a queue that will not shrink.']
  ];

  let meta = E.createMeta();
  let run = null;
  let tool = 'slope';
  let hand = 'draw';
  let liftType = 'chair';
  let cam = { x: 500, y: 380, zoom: 1 };
  let drawing = null;
  let last = 0;
  let tut = 0;
  let sandbox = false;
  let pointers = new Map();
  let toastTimer = 0;
  let noted = '';

  function load() {
    try {
      const raw = localStorage.getItem(E.SAVE_KEY);
      if (!raw) return;
      const decoded = E.decode(raw);
      if (!decoded.ok) { $('hint').textContent = 'The saved hill could not be read. It is still stored.'; return; }
      meta = decoded.meta;
      if (decoded.run && decoded.run.phase !== 'over') run = decoded.run;
    } catch (err) { $('hint').textContent = 'The saved hill could not be read.'; }
  }
  function save() {
    try { localStorage.setItem(E.SAVE_KEY, E.encode({ meta, run })); }
    catch (err) { toast('Could not save on this device.'); }
  }
  function toast(text) {
    const el = $('toast');
    el.textContent = text;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
  }
  function fit(target) {
    renderer.resize();
    const hill = target || run;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!hill) {
      cam.zoom = Math.max(0.45, Math.min(w / E.MAP_W, h / E.MAP_H) * 0.92);
      cam.x = E.MAP_W / 2; cam.y = E.MAP_H / 2;
      return;
    }
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const p of hill.pois) {
      minX = Math.min(minX, p.x); minY = Math.min(minY, p.y);
      maxX = Math.max(maxX, p.x); maxY = Math.max(maxY, p.y);
    }
    const pad = 150;
    minX -= pad; minY -= pad; maxX += pad; maxY += pad;
    cam.zoom = Math.max(0.55, Math.min(w / (maxX - minX), h / (maxY - minY)) * 0.82);
    cam.x = (minX + maxX) / 2;
    cam.y = (minY + maxY) / 2;
  }
  function show(id) { const d = $(id); if (!d.open) d.showModal(); }
  function hide(id) { const d = $(id); if (d.open) d.close(); }

  function paintLists() {
    $('poiList').innerHTML = E.KINDS.map(k => `<div class="rowline"><i>${POI_MARK[k]}</i>${POI_LABEL[k]}<b data-poi="${k}">0</b></div>`).join('');
    $('slopeList').innerHTML = E.COLOURS.map(k => `<div class="rowline"><i><b class="swatch" style="background:${SLOPE_COLOR[k]}"></b></i>${SLOPE_LABEL[k]}<b data-slope="${k}">0</b></div>`).join('');
    $('liftList').innerHTML = ['tow', 'chair', 'cabin'].map(k => `<div class="rowline"><i>⬆</i>${LIFT_LABEL[k]}<b data-lift="${k}">0</b></div>`).join('');
  }
  function refresh() {
    if (!run) return;
    const c = E.counts(run);
    for (const k of E.KINDS) { const el = document.querySelector('[data-poi="' + k + '"]'); if (el) el.textContent = c.poi[k] || 0; }
    for (const k of E.COLOURS) { const el = document.querySelector('[data-slope="' + k + '"]'); if (el) el.textContent = c.slopes[k] || 0; }
    for (const k of ['tow', 'chair', 'cabin']) { const el = document.querySelector('[data-lift="' + k + '"]'); if (el) el.textContent = c.lifts[k] || 0; }
    $('cannonBuilt').textContent = c.cannons;
    $('hillName').textContent = run.mountain.name;
    $('hillRegion').textContent = run.mountain.region;
    $('diamonds').textContent = '◆'.repeat(run.mountain.diamonds) + '◇'.repeat(Math.max(0, 4 - run.mountain.diamonds));
    $('clock').textContent = E.formatClock(run);
    $('clock').classList.toggle('warn', E.clockHours(run) >= 17);
    $('day').textContent = 'Day ' + run.day;
    $('score').textContent = Math.round(run.score);
    const g = E.guests(run);
    $('guests').textContent = g.out + '/' + g.total;
    if (run.speed > 0 && $('hint').textContent.startsWith('Paused')) $('hint').textContent = 'Guests are moving. Empty the hill before 18:00.';
    const res = run.resources;
    $('stockSlope').textContent = Math.floor(res.slope) + ' m';
    $('stockLift').textContent = res.lift;
    $('stockCannon').textContent = res.cannon;
    $('stockTrees').textContent = res.trees;
    $('stockUpgrade').textContent = res.upgrade;
    for (const btn of document.querySelectorAll('#dock button')) btn.setAttribute('aria-pressed', String(btn.dataset.tool === tool));
    for (const btn of document.querySelectorAll('#hands button')) btn.setAttribute('aria-pressed', String(btn.dataset.hand === hand));
    for (const btn of document.querySelectorAll('#liftKinds button')) btn.setAttribute('aria-pressed', String(btn.dataset.lift === liftType));
    $('liftKinds').hidden = tool !== 'lift';
    for (const speed of [0, 1, 2, 4]) {
      const btn = $('speed' + speed);
      if (btn) btn.setAttribute('aria-pressed', String(run.speed === speed && run.phase === 'play'));
    }
  }
  function apply(result) {
    if (!result) return;
    if (result.ok) audio.draw();
    else { audio.error(); if (result.reason) toast(result.reason); }
    refresh();
    save();
  }
  function setTool(next) { tool = next; if (hand === 'move') hand = 'draw'; refresh(); }
  function setHand(next) { hand = next; refresh(); }
  function setSpeed(speed) {
    if (!run || run.phase !== 'play') return;
    E.setSpeed(run, speed);
    refresh();
  }
  function bootHill(id, mode) {
    const started = E.startRun(meta, id, mode);
    if (!started) { toast('That hill is still locked.'); return; }
    run = started;
    noted = '';
    sandbox = mode === 'sandbox';
    fit();
    hide('home'); hide('levels');
    refresh();
    if (!meta.tutorial && !sandbox && id === 'lark') openTut(0);
    else $('tutorial').hidden = true;
    $('hint').textContent = sandbox ? 'Sandbox. Build as long as you like.' : 'Paused. Draw a way down, then a way up.';
    save();
  }
  function openTut(i) {
    tut = i;
    $('tutorial').hidden = false;
    $('tutTitle').textContent = TUTORIAL[i][0];
    $('tutBody').textContent = TUTORIAL[i][1];
    $('tutNext').textContent = i === TUTORIAL.length - 1 ? 'Start drawing' : 'Next';
  }
  function fillLevels() {
    $('hillList').innerHTML = '';
    for (const m of E.MOUNTAINS) {
      const open = E.unlocked(meta, m.id);
      const best = meta.best[m.id];
      const btn = document.createElement('button');
      btn.className = 'hill';
      btn.disabled = !open;
      const stars = (m.medals || []).map(n => (meta.cleared[m.id] || 0) >= n ? '★' : '☆').join(' ');
      btn.innerHTML = `<b>${open ? m.name : 'Locked'}</b><span>${stars || ''}</span><small>${open ? m.blurb : 'Clear ' + m.unlock.days + ' days on the previous hill.'}</small><small>${best ? 'Best ' + best.score + ' · ' + best.closed + ' days' : m.difficulty}</small>`;
      btn.onclick = () => bootHill(m.id, sandbox ? 'sandbox' : 'run');
      $('hillList').appendChild(btn);
    }
    const rows = (meta.board || []).slice(0, 6);
    $('board').innerHTML = rows.length ? rows.map(r => `<tr><td>${(E.mountainById(r.mountain) || {}).name || r.mountain}</td><td>${r.score}</td><td>${r.days} days</td></tr>`).join('') : '<tr><td>No scores yet.</td></tr>';
  }
  function showDraft() {
    if (!run || run.phase !== 'dawn') return;
    $('draftDay').textContent = 'Day ' + run.day;
    $('rerollNote').textContent = run.rerolls > 0 ? 'One shuffle left this week.' : 'The next shuffle arrives next week.';
    $('reroll').disabled = run.rerolls < 1;
    const box = $('draftCards');
    box.innerHTML = '';
    run.cards.forEach((card, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'supply';
      b.innerHTML = `<strong>${card.title}</strong><em>${card.detail}</em>`;
      b.onclick = () => {
        const res = E.chooseCard(run, i);
        if (!res.ok) return toast(res.reason);
        audio.dawn();
        hide('draft');
        refresh();
        save();
        const fresh = run.pois[run.pois.length - 1];
        if (fresh && fresh.born === run.day) toast('A new ' + POI_LABEL[fresh.kind].toLowerCase() + ' opened on the hill.');
      };
      box.appendChild(b);
    });
    const confetti = $('confetti');
    confetti.innerHTML = '';
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      for (let i = 0; i < 18; i++) {
        const bit = document.createElement('i');
        bit.style.left = (8 + Math.random() * 84) + '%';
        bit.style.background = ['#2f9d4a', '#2a6fe0', '#e08a2f', '#d23c3c', '#1f4f86'][i % 5];
        bit.style.animationDelay = (Math.random() * 0.3) + 's';
        confetti.appendChild(bit);
      }
    }
    show('draft');
  }
  function finish() {
    if (!run) return;
    E.recordResult(meta, run);
    const stars = E.starsFor(run);
    $('resultKicker').textContent = run.phase === 'over' ? 'DUSK' : 'MORNING';
    $('resultTitle').textContent = run.phase === 'over' ? 'The hill closed' : 'Still going';
    $('resultBody').textContent = run.reason || 'Everyone was home.';
    $('resultScore').textContent = Math.round(run.score);
    $('resultDays').textContent = run.completed;
    $('resultBest').textContent = (meta.best[run.mountainId] || {}).score || 0;
    $('resultStars').textContent = '★'.repeat(stars) + '☆'.repeat(Math.max(0, 3 - stars));
    audio.over();
    const ended = run;
    run = null;
    save();
    show('result');
    $('retry').onclick = () => { hide('result'); bootHill(ended.mountainId, ended.mode); };
  }

  function pointerWorld(ev) {
    const rect = canvas.getBoundingClientRect();
    return renderer.unproject(cam, ev.clientX - rect.left, ev.clientY - rect.top);
  }
  canvas.addEventListener('pointerdown', ev => {
    if (!run || $('draft').open) return;
    canvas.setPointerCapture(ev.pointerId);
    const w = pointerWorld(ev);
    pointers.set(ev.pointerId, { x: ev.clientX, y: ev.clientY, wx: w.x, wy: w.y });
    if (pointers.size === 1 && hand !== 'move') {
      drawing = { pts: [w], cut: tool === 'cut' };
      if (tool === 'cannon' && hand === 'draw') apply(E.placeCannon(run, w.x, w.y));
      if (tool === 'upgrade' && hand === 'draw') apply(E.upgradeAt(run, w.x, w.y));
      if (hand === 'erase') apply(E.eraseAt(run, w.x, w.y));
      if (tool === 'cut' && hand === 'draw') apply(E.cutAt(run, w.x, w.y));
    }
  });
  canvas.addEventListener('pointermove', ev => {
    const prev = pointers.get(ev.pointerId);
    if (!prev || !run) return;
    const w = pointerWorld(ev);
    if (pointers.size >= 2) {
      const all = [...pointers.values()];
      const dx = ev.clientX - prev.x, dy = ev.clientY - prev.y;
      cam.x -= dx / cam.zoom;
      cam.y -= dy / cam.zoom;
    } else if (hand === 'move') {
      cam.x -= (ev.clientX - prev.x) / cam.zoom;
      cam.y -= (ev.clientY - prev.y) / cam.zoom;
    } else if (drawing && hand === 'draw' && (tool === 'slope' || tool === 'lift')) {
      const lastPt = drawing.pts[drawing.pts.length - 1];
      if (Math.hypot(w.x - lastPt.x, w.y - lastPt.y) > 6) drawing.pts.push(w);
      if (tool === 'slope') {
        const preview = E.previewStroke(run, drawing.pts);
        $('hint').textContent = preview.ok ? (SLOPE_LABEL[preview.color] + ' · ' + Math.round(preview.len) + ' m') : (preview.reason || '');
      }
    } else if (drawing && tool === 'cut' && hand === 'draw') {
      apply(E.cutAt(run, w.x, w.y));
    } else if (hand === 'erase') {
      E.eraseAt(run, w.x, w.y);
    }
    prev.x = ev.clientX; prev.y = ev.clientY;
    pointers.set(ev.pointerId, prev);
  });
  function endPointer(ev) {
    const active = pointers.get(ev.pointerId);
    pointers.delete(ev.pointerId);
    if (!drawing || pointers.size) return;
    const pts = drawing.pts;
    drawing = null;
    if (hand !== 'draw' || !run) return;
    if (tool === 'slope' && pts.length > 1) apply(E.commitStroke(run, pts));
    if (tool === 'lift' && pts.length > 1) apply(E.commitLift(run, pts[0], pts[pts.length - 1], liftType));
    refresh();
  }
  canvas.addEventListener('pointerup', endPointer);
  canvas.addEventListener('pointercancel', endPointer);
  canvas.addEventListener('wheel', ev => {
    if (!run) return;
    ev.preventDefault();
    const before = pointerWorld(ev);
    cam.zoom = Math.max(0.35, Math.min(2.4, cam.zoom * (ev.deltaY > 0 ? 0.92 : 1.08)));
    const after = pointerWorld(ev);
    cam.x += before.x - after.x;
    cam.y += before.y - after.y;
  }, { passive: false });

  document.addEventListener('keydown', ev => {
    if (ev.target && ev.target.closest && ev.target.closest('input,textarea')) return;
    const key = ev.key.toLowerCase();
    if ((ev.metaKey || ev.ctrlKey) && key === 'z') { ev.preventDefault(); if (run && E.undo(run)) { audio.click(); refresh(); renderer.invalidate(); } return; }
    if ((ev.metaKey || ev.ctrlKey) && key === 'y') { ev.preventDefault(); if (run && E.redo(run)) refresh(); return; }
    if (key === ' ') { ev.preventDefault(); if (run && run.phase === 'play') setSpeed(run.speed ? 0 : 1); return; }
    if (key === 'q') setSpeed(Math.max(0, (run && run.speed) - (run && run.speed === 4 ? 2 : 1)));
    if (key === 'e') setSpeed(run && run.speed === 0 ? 1 : run && run.speed === 1 ? 2 : 4);
    if (key === '1') setTool('slope');
    if (key === '2') setTool('lift');
    if (key === '3') setTool('cannon');
    if (key === '4') setTool('cut');
    if (key === '5') setTool('upgrade');
    if (key === 'm') setHand('move');
    if (key === 'd') setHand('draw');
    if (key === 'x') setHand('erase');
    if (key === 'escape') {
      if ($('guide').open) hide('guide');
      else if ($('settingsDlg').open) hide('settingsDlg');
      else if (run && run.phase === 'play') setSpeed(0);
    }
  });

  document.querySelectorAll('#dock button').forEach(btn => btn.onclick = () => { setTool(btn.dataset.tool); audio.click(); });
  document.querySelectorAll('#hands button').forEach(btn => btn.onclick = () => { setHand(btn.dataset.hand); audio.click(); });
  document.querySelectorAll('#liftKinds button').forEach(btn => btn.onclick = () => { liftType = btn.dataset.lift; refresh(); audio.click(); });
  $('speed0').onclick = () => setSpeed(0);
  $('speed1').onclick = () => setSpeed(1);
  $('speed2').onclick = () => setSpeed(2);
  $('speed4').onclick = () => setSpeed(4);
  $('keyToggle').onclick = () => {
    const open = $('key').classList.toggle('open');
    $('keyToggle').setAttribute('aria-expanded', String(open));
  };
  $('quit').onclick = () => {
    if (run) E.recordResult(meta, run);
    run = null;
    save();
    fillLevels();
    show('levels');
  };
  $('openSettings').onclick = () => { $('soundToggle').checked = meta.sound !== false; show('settingsDlg'); };
  $('closeSettings').onclick = () => hide('settingsDlg');
  $('soundToggle').onchange = () => { meta.sound = $('soundToggle').checked; audio.setEnabled(meta.sound); save(); };
  $('wipe').onclick = () => {
    localStorage.removeItem(E.SAVE_KEY);
    meta = E.createMeta();
    run = null;
    hide('settingsDlg');
    toast('Winterfold save cleared.');
    show('home');
  };
  $('playBtn').onclick = () => { hide('home'); fillLevels(); show('levels'); };
  $('continueBtn').onclick = () => { hide('home'); fit(); refresh(); };
  $('howBtn').onclick = () => show('guide');
  $('closeGuide').onclick = () => hide('guide');
  $('backHome').onclick = () => { hide('levels'); show('home'); };
  $('toLevels').onclick = () => { hide('result'); fillLevels(); show('levels'); };
  $('sandbox').onchange = () => { sandbox = $('sandbox').checked; };
  $('reroll').onclick = () => {
    const res = E.reroll(run);
    if (!res.ok) return toast(res.reason);
    showDraft();
  };
  $('tutSkip').onclick = () => { $('tutorial').hidden = true; meta.tutorial = true; save(); };
  $('tutNext').onclick = () => {
    if (tut >= TUTORIAL.length - 1) { $('tutorial').hidden = true; meta.tutorial = true; save(); }
    else openTut(tut + 1);
  };

  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000 || 0);
    last = now;
    if (run && run.phase === 'play') {
      const before = run.day;
      E.tick(run, dt);
      if (run.phase === 'play' && run.day !== before) save();
    }
    if (run && run.phase === 'dawn' && noted !== 'dawn-' + run.day) {
      noted = 'dawn-' + run.day;
      audio.dawn();
      showDraft();
      save();
    }
    if (run && run.phase === 'over' && noted !== 'over-' + run.day) {
      noted = 'over-' + run.day;
      finish();
    }
    if (!run) {
      if (!window.__preview) {
        const metaOpen = E.createMeta();
        metaOpen.cleared = { lark: 99, copper: 99, glass: 99 };
        window.__preview = E.startRun(metaOpen, 'lark', 'sandbox');
        window.__preview.speed = 0;
      }
    }
    const shown = run || window.__preview;
    if (shown) {
      renderer.frame(shown, cam, {
        time: now / 1000,
        ghost: drawing && tool === 'slope' ? drawing.pts : null,
        ghostColor: drawing && tool === 'slope' ? (E.previewStroke(shown, drawing.pts).color || 'green') : 'green',
        reduce: window.matchMedia('(prefers-reduced-motion: reduce)').matches
      });
    }
    if (run) refresh();
    requestAnimationFrame(loop);
  }

  for (const id of ['home', 'levels', 'draft', 'result', 'guide', 'settingsDlg']) $(id).addEventListener('cancel', ev => ev.preventDefault());
  paintLists();
  load();
  audio.setEnabled(meta.sound !== false);
  $('soundToggle').checked = meta.sound !== false;
  $('continueBtn').hidden = !run;
  window.addEventListener('resize', () => fit());
  canvas.addEventListener('pointerdown', () => { audio.unlock(); if (meta.sound !== false) audio.wind(); }, { once: true });
  fit();
  if (run) { hide('home'); refresh(); }
  else show('home');
  requestAnimationFrame(loop);
  window.Winterfold = { get run() { return run; }, get meta() { return meta; }, bootHill, E };
})();
