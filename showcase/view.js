/* Bellows Gate drawing and buttons. The rules live in game.js. */
(function () {
  'use strict';
  const G = window.BellowsGate;
  const canvas = document.getElementById('yard');
  const $ = id => document.getElementById(id);
  const WORLD = { w: 860, h: 560 };
  let state = G.create();
  let paused = false;
  let last = 0;
  let dpr = 1;
  let scale = 1;
  let ox = 0;
  let oy = 0;
  let viewW = 800;
  let viewH = 480;

  function hash(n) {
    let x = Math.imul(n | 0, 374761393);
    x = Math.imul(x ^ (x >>> 13), 1274126177);
    return ((x ^ (x >>> 16)) >>> 0) / 4294967296;
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    viewW = Math.max(320, rect.width);
    viewH = Math.max(220, rect.height);
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(viewW * dpr);
    canvas.height = Math.round(viewH * dpr);
    scale = Math.min(viewW / WORLD.w, viewH / WORLD.h);
    ox = (viewW - WORLD.w * scale) / 2;
    oy = (viewH - WORLD.h * scale) / 2;
  }

  function worldAt(ev) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (ev.clientX - rect.left - ox) / scale,
      y: (ev.clientY - rect.top - oy) / scale
    };
  }

  function paintTools() {
    const box = $('tools');
    if (!box.childElementCount) {
      for (const tool of Object.values(G.TOOLS)) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'tool';
        btn.dataset.tool = tool.id;
        btn.innerHTML = '<strong></strong><span></span>';
        btn.onclick = () => { G.select(state, tool.id); paintTools(); };
        box.appendChild(btn);
      }
    }
    for (const btn of box.querySelectorAll('.tool')) {
      const tool = G.TOOLS[btn.dataset.tool];
      btn.querySelector('strong').textContent = tool.name;
      btn.querySelector('span').textContent = tool.cost + ' sparks';
      btn.setAttribute('aria-pressed', String(state.selected === tool.id));
      btn.disabled = state.phase === 'win' || state.phase === 'lose' || state.phase === 'ready';
    }
  }

  function paintHud() {
    $('embers').textContent = String(state.embers);
    $('embers').parentElement.classList.toggle('warn', state.embers <= 3);
    $('sparks').textContent = String(state.sparks);
    $('wave').textContent = (state.wave || 0) + '/' + G.WAVES.length;
    $('note').textContent = state.note || '';
    const building = state.phase === 'build';
    $('gateBtn').hidden = !building && state.phase !== 'ready';
    $('gateBtn').disabled = state.phase !== 'build';
    $('pauseBtn').disabled = state.phase !== 'fight' && state.phase !== 'breath';
    $('pauseBtn').textContent = paused ? 'Carry on' : 'Pause';
    paintTools();
  }

  function showEnd() {
    const won = state.phase === 'win';
    $('endRibbon').textContent = won ? 'GLOW' : 'DARK';
    $('endTitle').textContent = won ? 'The hearth held' : 'The hearth went dark';
    $('endBody').textContent = won
      ? 'Six waves came by. ' + state.downed + ' went out on the path, and ' + state.embers + ' embers are still awake.'
      : 'The soot found the fire. ' + state.downed + ' were stopped before the yard gave up.';
    if (!$('end').open) $('end').showModal();
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function drawYard(ctx, time) {
    ctx.fillStyle = '#f3e2b0';
    ctx.beginPath();
    ctx.arc(740, 78, 26, 0, 7);
    ctx.fill();
    ctx.fillStyle = '#3d4c66';
    ctx.beginPath();
    ctx.arc(752, 72, 22, 0, 7);
    ctx.fill();
    ctx.fillStyle = '#314056';
    ctx.beginPath();
    ctx.moveTo(0, 210);
    ctx.quadraticCurveTo(180, 150, 360, 200);
    ctx.quadraticCurveTo(560, 250, 860, 170);
    ctx.lineTo(860, 250);
    ctx.lineTo(0, 250);
    ctx.fill();
    ctx.fillStyle = '#2a3548';
    ctx.beginPath();
    ctx.moveTo(0, 250);
    ctx.quadraticCurveTo(240, 210, 520, 250);
    ctx.quadraticCurveTo(700, 276, 860, 230);
    ctx.lineTo(860, 310);
    ctx.lineTo(0, 310);
    ctx.fill();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#c4b49a';
    ctx.lineWidth = 36;
    ctx.beginPath();
    G.PATH.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y));
    ctx.stroke();
    ctx.strokeStyle = '#8d7a62';
    ctx.lineWidth = 28;
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255,244,220,0.28)';
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 14]);
    ctx.stroke();
    ctx.setLineDash([]);

    for (const pad of G.PADS) {
      const taken = state.towers.some(t => t.pad === pad.id);
      ctx.fillStyle = taken ? 'rgba(255,244,220,0.2)' : 'rgba(255,244,220,0.86)';
      ctx.strokeStyle = state.selected && !taken ? '#e7b34a' : '#6d6256';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(pad.x, pad.y, 16, 0, 7);
      ctx.fill();
      ctx.stroke();
    }

    drawHearth(ctx, time);
    for (const tower of state.towers) drawTower(ctx, tower, time);
    for (const flash of state.flashes) {
      ctx.strokeStyle = flash.tool === 'quench' ? 'rgba(90,210,214,0.9)' : flash.tool === 'hammer' ? 'rgba(255,210,120,0.95)' : 'rgba(255,244,220,0.9)';
      ctx.lineWidth = flash.tool === 'hammer' ? 4 : 2;
      ctx.beginPath();
      ctx.moveTo(flash.x, flash.y - 10);
      ctx.lineTo(flash.tx, flash.ty);
      ctx.stroke();
      if (flash.splash) {
        ctx.strokeStyle = 'rgba(90,210,214,0.45)';
        ctx.beginPath();
        ctx.arc(flash.tx, flash.ty, flash.splash * (1 - flash.life / 0.18), 0, 7);
        ctx.stroke();
      }
    }
    for (const creep of state.creeps) drawCreep(ctx, creep, time);
    for (const pop of state.pops) {
      ctx.globalAlpha = Math.max(0, pop.life / 0.45);
      ctx.fillStyle = '#fff4d2';
      ctx.font = '700 14px "Avenir Next", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(pop.text, pop.x, pop.y - 18 - (0.45 - pop.life) * 20);
      ctx.globalAlpha = 1;
    }
  }

  function drawHearth(ctx, time) {
    const x = G.HEARTH.x;
    const y = G.HEARTH.y;
    ctx.fillStyle = '#5c4a3a';
    roundRect(ctx, x - 34, y - 18, 68, 36, 6);
    ctx.fill();
    ctx.fillStyle = '#2e241c';
    ctx.fillRect(x - 16, y - 8, 32, 16);
    const flicker = 10 + Math.sin(time * 9) * 3;
    ctx.fillStyle = '#ffb15a';
    ctx.beginPath();
    ctx.moveTo(x, y - flicker - 8);
    ctx.quadraticCurveTo(x + 10, y - 4, x + 4, y + 4);
    ctx.quadraticCurveTo(x, y - 2, x - 5, y + 4);
    ctx.quadraticCurveTo(x - 12, y - 6, x, y - flicker - 8);
    ctx.fill();
    ctx.fillStyle = '#fff1c9';
    ctx.beginPath();
    ctx.arc(x, y - 4, 3, 0, 7);
    ctx.fill();
  }

  function drawTower(ctx, tower, time) {
    ctx.save();
    ctx.translate(tower.x, tower.y);
    ctx.fillStyle = 'rgba(20,16,12,0.25)';
    ctx.beginPath();
    ctx.ellipse(0, 14, 14, 5, 0, 0, 7);
    ctx.fill();
    if (tower.tool === 'fan') {
      ctx.fillStyle = '#f4ecdf';
      roundRect(ctx, -8, -6, 16, 18, 3);
      ctx.fill();
      ctx.save();
      ctx.translate(0, -8);
      ctx.rotate(time * (6 + tower.swing * 10));
      ctx.strokeStyle = '#e25b2a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-12, 0); ctx.lineTo(12, 0);
      ctx.moveTo(0, -12); ctx.lineTo(0, 12);
      ctx.stroke();
      ctx.restore();
    } else if (tower.tool === 'quench') {
      ctx.fillStyle = '#2aa3ad';
      ctx.beginPath();
      ctx.moveTo(-10, -2);
      ctx.lineTo(10, -2);
      ctx.lineTo(7, 14);
      ctx.lineTo(-7, 14);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#f4ecdf';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, -6, 8, Math.PI, 0);
      ctx.stroke();
      if (tower.swing > 0.2) {
        ctx.fillStyle = 'rgba(180,236,240,0.9)';
        ctx.beginPath();
        ctx.arc(6, 6, 3, 0, 7);
        ctx.fill();
      }
    } else {
      ctx.fillStyle = '#6d6256';
      ctx.fillRect(-12, 6, 24, 6);
      ctx.fillStyle = '#d7c4a4';
      ctx.beginPath();
      ctx.moveTo(-8, 6);
      ctx.lineTo(8, 6);
      ctx.lineTo(5, -2);
      ctx.lineTo(-5, -2);
      ctx.fill();
      ctx.save();
      ctx.translate(-2, -2);
      ctx.rotate(-0.6 + tower.swing * 1.1);
      ctx.fillStyle = '#e7b34a';
      ctx.fillRect(0, -3, 18, 5);
      ctx.fillStyle = '#c4552a';
      ctx.fillRect(16, -6, 7, 11);
      ctx.restore();
    }
    ctx.restore();
  }

  function drawCreep(ctx, creep, time) {
    const r = creep.kind === 'coal' ? 16 : creep.kind === 'clinker' ? 12 : 8;
    ctx.save();
    ctx.translate(creep.x, creep.y + Math.sin(time * 10 + creep.dist) * 1.5);
    ctx.fillStyle = 'rgba(20,16,12,0.28)';
    ctx.beginPath();
    ctx.ellipse(0, r * 0.8, r, r * 0.35, 0, 0, 7);
    ctx.fill();
    ctx.fillStyle = creep.kind === 'coal' ? '#241910' : creep.kind === 'clinker' ? '#6a5348' : '#3e4650';
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, 7);
    ctx.fill();
    if (creep.kind === 'clinker') {
      ctx.strokeStyle = '#e25b2a';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(-4, -2); ctx.lineTo(0, 3); ctx.lineTo(5, -1);
      ctx.stroke();
    }
    if (creep.kind === 'coal') {
      ctx.fillStyle = '#e7b34a';
      ctx.beginPath();
      ctx.moveTo(0, -r - 6); ctx.lineTo(4, -r + 1); ctx.lineTo(-4, -r + 1);
      ctx.fill();
    }
    ctx.fillStyle = '#fff8ee';
    ctx.beginPath();
    ctx.arc(-r * 0.28, -1, r * 0.22, 0, 7);
    ctx.arc(r * 0.28, -1, r * 0.22, 0, 7);
    ctx.fill();
    ctx.fillStyle = '#1c140f';
    ctx.beginPath();
    ctx.arc(-r * 0.22, -1, r * 0.1, 0, 7);
    ctx.arc(r * 0.34, -1, r * 0.1, 0, 7);
    ctx.fill();
    ctx.fillStyle = 'rgba(20,16,12,0.45)';
    roundRect(ctx, -r, -r - 8, r * 2, 3, 1.5);
    ctx.fill();
    ctx.fillStyle = creep.slowT > 0 ? '#7ee0e4' : '#8fd16a';
    roundRect(ctx, -r, -r - 8, r * 2 * Math.max(0, creep.hp / creep.max), 3, 1.5);
    ctx.fill();
    ctx.restore();
  }

  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000 || 0);
    last = now;
    if (!paused) G.tick(state, dt);
    if ((state.phase === 'win' || state.phase === 'lose') && !$('end').open) showEnd();
    paintHud();
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, viewW, viewH);
    const sky = ctx.createLinearGradient(0, 0, 0, viewH);
    sky.addColorStop(0, '#2c3a55');
    sky.addColorStop(0.45, '#3d4c66');
    sky.addColorStop(1, '#6d543e');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, viewW, viewH);
    ctx.fillStyle = 'rgba(255,244,220,0.8)';
    for (let i = 0; i < 36; i++) ctx.fillRect(hash(i + 40) * viewW, hash(i + 80) * viewH * 0.42, 1.6, 1.6);
    const horizon = oy + 280 * scale;
    const ground = ctx.createLinearGradient(0, horizon, 0, viewH);
    ground.addColorStop(0, '#6e7d55');
    ground.addColorStop(1, '#3f4a34');
    ctx.fillStyle = ground;
    ctx.fillRect(0, Math.max(0, horizon), viewW, viewH);
    ctx.save();
    ctx.translate(ox, oy);
    ctx.scale(scale, scale);
    drawYard(ctx, now / 1000);
    ctx.restore();
    requestAnimationFrame(frame);
  }

  canvas.addEventListener('pointerdown', ev => {
    if (state.phase === 'ready' || state.phase === 'win' || state.phase === 'lose') return;
    const at = worldAt(ev);
    let best = null;
    let bestD = 28;
    for (const pad of G.PADS) {
      const d = Math.hypot(pad.x - at.x, pad.y - at.y);
      if (d < bestD) { bestD = d; best = pad; }
    }
    if (!best) return;
    const result = G.place(state, best.id, state.selected);
    if (!result.ok) state.note = result.reason;
    paintHud();
  });

  $('play').onclick = () => {
    G.start(state);
    paused = false;
    $('start').close();
    paintHud();
  };
  $('again').onclick = () => {
    G.start(state);
    paused = false;
    $('end').close();
    paintHud();
  };
  $('gateBtn').onclick = () => {
    const result = G.openGate(state);
    if (!result.ok) state.note = result.reason;
    paintHud();
  };
  $('pauseBtn').onclick = () => { paused = !paused; paintHud(); };
  function openHow() { if (!$('how').open) $('how').showModal(); }
  $('howBtn').onclick = openHow;
  $('endHow').onclick = openHow;
  $('closeHow').onclick = () => $('how').close();
  document.addEventListener('keydown', ev => {
    if (ev.target && ev.target.closest && ev.target.closest('dialog')) {
      if (ev.key === 'Escape') return;
    }
    if (ev.key === '1') G.select(state, 'fan');
    if (ev.key === '2') G.select(state, 'quench');
    if (ev.key === '3') G.select(state, 'hammer');
    if (ev.key === ' ') {
      ev.preventDefault();
      if (state.phase === 'build') $('gateBtn').click();
      else if (state.phase === 'fight' || state.phase === 'breath') $('pauseBtn').click();
    }
    if (ev.key === '?' || (ev.key === 'h' && !ev.metaKey && !ev.ctrlKey)) openHow();
    paintHud();
  });
  for (const id of ['start', 'end', 'how']) {
    $(id).addEventListener('cancel', ev => { if (id !== 'how') ev.preventDefault(); });
  }

  window.BellowsDemo = {
    get state() { return state; },
    place(pad, tool) { return G.place(state, pad, tool); },
    open() { return G.openGate(state); },
    setPaused(value) { paused = value; }
  };

  resize();
  window.addEventListener('resize', resize);
  paintHud();
  $('start').showModal();
  requestAnimationFrame(frame);
})();
