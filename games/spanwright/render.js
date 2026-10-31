'use strict';
/* Spanwright drawing. Procedural ink, river light, and material sketches. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SpanRender = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const THEMES = {
    willow: { sky0: '#f2d7b0', sky1: '#8eb4c4', sky2: '#2f6170', hill: '#6d8b58', hill2: '#3f5c40', water: '#1e5564', foam: '#d5efe8', bank: '#c4a37a', bank2: '#8d6a45', tree: '#2f4a34' },
    copper: { sky0: '#f0c89a', sky1: '#c9845a', sky2: '#6a4638', hill: '#a68462', hill2: '#6e5140', water: '#3d5e68', foam: '#ead8c4', bank: '#b08968', bank2: '#6d4e38', tree: '#5c4634' },
    tide: { sky0: '#f0b48a', sky1: '#3d6e86', sky2: '#16303c', hill: '#3e5c55', hill2: '#1d3338', water: '#143e4c', foam: '#d7ece4', bank: '#b7a48c', bank2: '#6e5a48', tree: '#24362e' },
    hollow: { sky0: '#f0c2a4', sky1: '#c46b52', sky2: '#3a2a32', hill: '#a85b45', hill2: '#5c342c', water: '#2a4550', foam: '#f0d2c4', bank: '#c49070', bank2: '#704838', tree: '#3d2a28' },
    lantern: { sky0: '#243044', sky1: '#121826', sky2: '#070910', hill: '#1c2a28', hill2: '#101816', water: '#0e2430', foam: '#355868', bank: '#3a342c', bank2: '#221e1a', tree: '#15201c' },
    second: { sky0: '#d5dde4', sky1: '#8ea0ae', sky2: '#3d4c58', hill: '#7d8c86', hill2: '#46564f', water: '#3a5964', foam: '#e7eef0', bank: '#c8beb0', bank2: '#7a7168', tree: '#3e4a44' },
    yard: { sky0: '#f6e2c4', sky1: '#8fb0b4', sky2: '#2c5560', hill: '#7f9468', hill2: '#44583c', water: '#1f5864', foam: '#e5f4ef', bank: '#d0b48e', bank2: '#8d6b48', tree: '#355038' }
  };

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function mix(c1, c2, t) {
    const a = hex(c1), b = hex(c2);
    const r = Math.round(lerp(a[0], b[0], t));
    const g = Math.round(lerp(a[1], b[1], t));
    const bl = Math.round(lerp(a[2], b[2], t));
    return 'rgb(' + r + ',' + g + ',' + bl + ')';
  }
  function hex(h) {
    return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  }
  function stressColor(strain, ink) {
    const t = clamp(strain || 0, 0, 1);
    if (ink) {
      const v = Math.round(lerp(236, 20, t));
      return 'rgb(' + v + ',' + v + ',' + v + ')';
    }
    if (t < 0.45) return mix('#6fbf8a', '#e4c15a', t / 0.45);
    return mix('#e4c15a', '#d24b38', (t - 0.45) / 0.55);
  }
  function rnd(seed) {
    const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  }

  function worldToScreen(cam, x, y, w, h) {
    return {
      x: (x - cam.x) * cam.zoom + w / 2,
      y: h / 2 - (y - cam.y) * cam.zoom
    };
  }

  function roundRect(ctx, x, y, w, h, r) {
    const rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  function draw(ctx, w, h, session, cam, fx, opts) {
    const theme = THEMES[session.level.theme] || THEMES[session.level.world] || THEMES.willow;
    const time = opts.time || 0;
    const quality = opts.quality !== 'plain';
    ctx.clearRect(0, 0, w, h);
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, theme.sky0);
    sky.addColorStop(0.45, theme.sky1);
    sky.addColorStop(1, theme.sky2);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // sun or moon
    const sunX = w * 0.78, sunY = h * 0.16;
    const glow = ctx.createRadialGradient(sunX, sunY, 8, sunX, sunY, quality ? 180 : 80);
    glow.addColorStop(0, session.level.theme === 'lantern' ? 'rgba(232,214,170,.55)' : 'rgba(255,236,196,.85)');
    glow.addColorStop(1, 'rgba(255,236,196,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);
    ctx.beginPath();
    ctx.fillStyle = session.level.theme === 'lantern' ? '#efe6cf' : '#fff4d2';
    ctx.arc(sunX, sunY, session.level.theme === 'lantern' ? 16 : 26, 0, Math.PI * 2);
    ctx.fill();

    if (quality) {
      for (let i = 0; i < 4; i++) {
        const cx = ((i * 220 + time * (8 + i)) % (w + 180)) - 90;
        ctx.fillStyle = 'rgba(255,255,255,.18)';
        ctx.beginPath();
        ctx.ellipse(cx, 48 + i * 18, 46 + i * 8, 14, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // far hills
    ctx.fillStyle = theme.hill2;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.62);
    for (let x = 0; x <= w; x += 20) {
      const wx = cam.x + (x - w / 2) / cam.zoom;
      const y = h * 0.58 + Math.sin(wx * 0.08 + 1) * 18 + Math.sin(wx * 0.021) * 26;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.fill();

    const water = worldToScreen(cam, 0, session.level.waterY, w, h);
    // near bank silhouette behind water
    ctx.fillStyle = theme.hill;
    ctx.beginPath();
    ctx.moveTo(0, water.y + 30);
    ctx.lineTo(0, water.y - 10);
    ctx.lineTo(w, water.y - 16);
    ctx.lineTo(w, water.y + 40);
    ctx.fill();

    // water
    const waterGrad = ctx.createLinearGradient(0, water.y - 8, 0, h);
    waterGrad.addColorStop(0, theme.water);
    waterGrad.addColorStop(1, '#071820');
    ctx.fillStyle = waterGrad;
    ctx.fillRect(0, water.y, w, h - water.y);
    ctx.strokeStyle = theme.foam;
    ctx.globalAlpha = 0.45;
    ctx.lineWidth = 1.4;
    for (let i = 0; i < (quality ? 4 : 2); i++) {
      ctx.beginPath();
      for (let x = 0; x <= w; x += 8) {
        const y = water.y + 8 + i * 14 + Math.sin(x * 0.03 + time * 1.4 + i) * (3 + i);
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    drawBanks(ctx, w, h, session, cam, theme);
    drawTrees(ctx, w, h, session, cam, theme, time);
    drawForbid(ctx, w, h, session, cam);
    drawGrid(ctx, w, h, session, cam, opts);
    drawBoatsGhost(ctx, w, h, session, cam, time, opts);
    drawBeams(ctx, w, h, session, cam, opts, false);
    if (quality) drawReflection(ctx, w, h, session, cam, water.y);
    drawBeams(ctx, w, h, session, cam, opts, true);
    drawAnchors(ctx, w, h, session, cam);
    drawJoints(ctx, w, h, session, cam, opts);
    drawCheckpoints(ctx, w, h, session, cam, time);
    drawFlags(ctx, w, h, session, cam, time);
    drawVehicles(ctx, w, h, session, cam, time);
    drawGhost(ctx, w, h, session, cam, opts);
    drawParticles(ctx, cam, w, h, fx);
    if (opts.shake) {
      /* shake is applied by the camera before draw */
    }
    if (quality) {
      const vig = ctx.createRadialGradient(w / 2, h / 2, h * 0.35, w / 2, h / 2, h * 0.78);
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(1, 'rgba(12,16,20,.28)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);
    }
  }

  function drawBanks(ctx, w, h, session, cam, theme) {
    for (const g of session.level.ground || []) {
      const a = worldToScreen(cam, g.x0, g.y0, w, h);
      const b = worldToScreen(cam, g.x1, g.y1, w, h);
      const top = Math.min(a.y, b.y);
      const left = Math.min(a.x, b.x);
      const width = Math.abs(b.x - a.x);
      const grad = ctx.createLinearGradient(0, top, 0, top + 220);
      grad.addColorStop(0, theme.bank);
      grad.addColorStop(0.25, theme.bank2);
      grad.addColorStop(1, '#241910');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(left, top);
      ctx.lineTo(left + width, top);
      ctx.lineTo(left + width + 18, h);
      ctx.lineTo(left - 18, h);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,244,220,.35)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(left, top);
      ctx.lineTo(left + width, top);
      ctx.stroke();
      // grass ticks
      ctx.strokeStyle = 'rgba(70,90,48,.45)';
      for (let x = left; x < left + width; x += 14) {
        ctx.beginPath();
        ctx.moveTo(x, top);
        ctx.quadraticCurveTo(x + 3, top - 10, x + 1, top - 16);
        ctx.stroke();
      }
    }
  }

  function drawTrees(ctx, w, h, session, cam, theme, time) {
    const seed = session.level.dress || 1;
    const b = session.level.bounds;
    for (let i = 0; i < 9; i++) {
      const x = b.x0 + 1 + rnd(seed * 3 + i) * (b.x1 - b.x0 - 2);
      const gy = (session.level.ground || []).reduce((best, g) => {
        if (x < Math.min(g.x0, g.x1) || x > Math.max(g.x0, g.x1)) return best;
        return g.y0;
      }, null);
      if (gy == null || x > (session.level.xL || 99) - 0.4 && x < (session.level.xR || -99) + 0.4) continue;
      const p = worldToScreen(cam, x, gy, w, h);
      const s = 0.8 + rnd(seed + i * 9) * 0.7;
      const sway = Math.sin(time * 0.8 + i) * 2;
      ctx.fillStyle = theme.tree;
      ctx.beginPath();
      ctx.moveTo(p.x + sway, p.y);
      ctx.lineTo(p.x - 7 * s, p.y - 18 * s);
      ctx.lineTo(p.x + sway, p.y - 46 * s);
      ctx.lineTo(p.x + 7 * s, p.y - 18 * s);
      ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,.25)';
      ctx.fillRect(p.x - 1.5, p.y - 16 * s, 3, 16 * s);
    }
  }

  function drawForbid(ctx, w, h, session, cam) {
    for (const r of session.level.forbid || []) {
      const a = worldToScreen(cam, r.x, r.y + r.h, w, h);
      const b = worldToScreen(cam, r.x + r.w, r.y, w, h);
      ctx.fillStyle = 'rgba(90,70,60,.55)';
      ctx.strokeStyle = 'rgba(40,28,24,.8)';
      ctx.lineWidth = 2;
      roundRect(ctx, a.x, a.y, b.x - a.x, b.y - a.y, 8);
      ctx.fill();
      ctx.stroke();
    }
  }

  function drawGrid(ctx, w, h, session, cam, opts) {
    if (opts.mode === 'replay') return;
    const g = session.grid || 1;
    const x0 = cam.x - w / 2 / cam.zoom;
    const x1 = cam.x + w / 2 / cam.zoom;
    const y0 = cam.y - h / 2 / cam.zoom;
    const y1 = cam.y + h / 2 / cam.zoom;
    ctx.fillStyle = 'rgba(255,248,230,.28)';
    for (let x = Math.floor(x0 / g) * g; x <= x1; x += g) {
      for (let y = Math.floor(y0 / g) * g; y <= y1; y += g) {
        if (y < session.level.waterY) continue;
        const p = worldToScreen(cam, x, y, w, h);
        ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
      }
    }
  }

  function drawBoatsGhost(ctx, w, h, session, cam, time, opts) {
    const boats = (session.sim && session.sim.boats) || session.level.boats || [];
    for (const boat of boats) {
      const bx = session.sim && session.sim.boats ? boat.x : boat.x;
      const p = worldToScreen(cam, bx, session.level.waterY, w, h);
      const pw = boat.w * cam.zoom;
      const ph = boat.h * cam.zoom;
      ctx.save();
      ctx.globalAlpha = session.sim && session.sim.mode ? 0.95 : 0.55;
      ctx.fillStyle = '#8c3d32';
      ctx.strokeStyle = '#f0d2b0';
      ctx.lineWidth = 2;
      roundRect(ctx, p.x, p.y - ph, pw, ph * 0.42, 4);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#d8c4a4';
      ctx.fillRect(p.x + pw * 0.35, p.y - ph, 4, ph * 0.72);
      ctx.fillStyle = '#f2e2c4';
      ctx.beginPath();
      ctx.moveTo(p.x + pw * 0.42, p.y - ph * 0.95);
      ctx.lineTo(p.x + pw * 0.78, p.y - ph * 0.62);
      ctx.lineTo(p.x + pw * 0.42, p.y - ph * 0.42);
      ctx.fill();
      if (!(session.sim && session.sim.mode)) {
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = 'rgba(176,64,48,.8)';
        ctx.strokeRect(p.x, p.y - ph, pw, ph);
        ctx.setLineDash([]);
      }
      ctx.restore();
      if (!(session.sim && session.sim.mode)) {
        ctx.fillStyle = 'rgba(255,244,230,.8)';
        ctx.font = '12px Palatino, Georgia, serif';
        ctx.fillText('Barge lane', p.x, p.y - ph - 6);
      }
    }
  }

  function beamEnds(session, b) {
    const a = session.nodes.find(n => n.id === b.a);
    const c = session.nodes.find(n => n.id === b.b);
    return a && c ? { a: a, c: c } : null;
  }

  function drawBeams(ctx, w, h, session, cam, opts, foreground) {
    for (const b of session.beams) {
      const ends = beamEnds(session, b);
      if (!ends) continue;
      const A = worldToScreen(cam, ends.a.x, ends.a.y, w, h);
      const C = worldToScreen(cam, ends.c.x, ends.c.y, w, h);
      const stressOn = opts.stress && session.sim;
      const col = b.broken ? '#5c4036' : (stressOn ? stressColor(b.strain, opts.ink) : null);
      const first = session.sim && session.sim.firstBreak === b.id;
      ctx.save();
      ctx.lineCap = 'round';
      if (b.mat === 'road') drawRoad(ctx, A, C, cam.zoom, col, b.broken);
      else if (b.mat === 'wood') drawWood(ctx, A, C, cam.zoom, col, b.broken);
      else if (b.mat === 'steel') drawSteel(ctx, A, C, cam.zoom, col);
      else if (b.mat === 'rope') drawRope(ctx, A, C, cam.zoom, col, opts.time || 0, b);
      else if (b.mat === 'cable') drawCable(ctx, A, C, cam.zoom, col);
      else if (b.mat === 'hydraulic') drawHydraulic(ctx, A, C, cam.zoom, col, b);
      else if (b.mat === 'spring') drawSpring(ctx, A, C, cam.zoom, col, b);
      if (first) {
        ctx.strokeStyle = '#fff6d8';
        ctx.lineWidth = 3;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.moveTo(A.x, A.y);
        ctx.lineTo(C.x, C.y);
        ctx.stroke();
      }
      if (opts.selected === b.id) {
        ctx.strokeStyle = '#f3e2b0';
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(A.x, A.y);
        ctx.lineTo(C.x, C.y);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  function drawRoad(ctx, A, C, zoom, col) {
    const t = Math.max(7, 0.28 * zoom);
    ctx.strokeStyle = col || '#2c3338';
    ctx.lineWidth = t;
    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(C.x, C.y);
    ctx.stroke();
    ctx.strokeStyle = col ? 'rgba(255,255,255,.35)' : '#d9d3c6';
    ctx.lineWidth = Math.max(2, t * 0.22);
    ctx.setLineDash([t * 0.7, t * 0.55]);
    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(C.x, C.y);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  function drawWood(ctx, A, C, zoom, col) {
    ctx.strokeStyle = col || '#c4894a';
    ctx.lineWidth = Math.max(5, 0.16 * zoom);
    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(C.x, C.y);
    ctx.stroke();
    ctx.strokeStyle = col ? 'rgba(80,40,10,.35)' : 'rgba(90,48,16,.45)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(C.x, C.y);
    ctx.stroke();
  }
  function drawSteel(ctx, A, C, zoom, col) {
    const ang = Math.atan2(C.y - A.y, C.x - A.x);
    const nx = Math.cos(ang + Math.PI / 2), ny = Math.sin(ang + Math.PI / 2);
    const t = Math.max(3.5, 0.07 * zoom);
    ctx.strokeStyle = col || '#8d97a2';
    ctx.lineWidth = t;
    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(C.x, C.y);
    ctx.stroke();
    ctx.strokeStyle = col ? 'rgba(255,255,255,.3)' : '#e6ebf0';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(A.x + nx * t * 0.7, A.y + ny * t * 0.7);
    ctx.lineTo(C.x + nx * t * 0.7, C.y + ny * t * 0.7);
    ctx.moveTo(A.x - nx * t * 0.7, A.y - ny * t * 0.7);
    ctx.lineTo(C.x - nx * t * 0.7, C.y - ny * t * 0.7);
    ctx.stroke();
  }
  function drawRope(ctx, A, C, zoom, col, time, b) {
    const slack = b && b.rest && Math.hypot(C.x - A.x, C.y - A.y) < Math.abs((b.rest || 0) * zoom) * 0.92;
    ctx.strokeStyle = col || '#c2a36a';
    ctx.lineWidth = Math.max(2.2, 0.055 * zoom);
    ctx.beginPath();
    if (slack) {
      const mx = (A.x + C.x) / 2, my = (A.y + C.y) / 2 + 18;
      ctx.moveTo(A.x, A.y);
      ctx.quadraticCurveTo(mx, my, C.x, C.y);
    } else {
      const steps = 8;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = lerp(A.x, C.x, t);
        const y = lerp(A.y, C.y, t) + Math.sin(t * Math.PI * 6 + time * 2) * 0.6;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  }
  function drawCable(ctx, A, C, zoom, col) {
    ctx.strokeStyle = col || '#5d6b78';
    ctx.lineWidth = Math.max(1.6, 0.04 * zoom);
    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(C.x, C.y);
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.strokeStyle = col ? 'rgba(255,255,255,.25)' : '#aeb8c2';
    ctx.beginPath();
    ctx.moveTo(A.x + 1.2, A.y);
    ctx.lineTo(C.x + 1.2, C.y);
    ctx.stroke();
  }
  function drawHydraulic(ctx, A, C, zoom, col, b) {
    const t = Math.max(7, 0.16 * zoom);
    ctx.strokeStyle = col || '#b5523e';
    ctx.lineWidth = t;
    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(C.x, C.y);
    ctx.stroke();
    const mx = lerp(A.x, C.x, 0.45), my = lerp(A.y, C.y, 0.45);
    ctx.strokeStyle = '#f0d2a8';
    ctx.lineWidth = t * 0.45;
    ctx.beginPath();
    ctx.moveTo(mx, my);
    ctx.lineTo(C.x, C.y);
    ctx.stroke();
  }
  function drawSpring(ctx, A, C, zoom, col) {
    const coils = 9;
    ctx.strokeStyle = col || '#d0a15a';
    ctx.lineWidth = Math.max(2, 0.06 * zoom);
    ctx.beginPath();
    for (let i = 0; i <= coils * 8; i++) {
      const t = i / (coils * 8);
      const x = lerp(A.x, C.x, t);
      const y = lerp(A.y, C.y, t);
      const ang = Math.atan2(C.y - A.y, C.x - A.x) + Math.PI / 2;
      const mag = Math.sin(t * coils * Math.PI * 2) * Math.max(4, 0.1 * zoom);
      const px = x + Math.cos(ang) * mag;
      const py = y + Math.sin(ang) * mag;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }

  function drawReflection(ctx, w, h, session, cam, waterY) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, waterY, w, h - waterY);
    ctx.clip();
    ctx.globalAlpha = 0.18;
    for (const b of session.beams) {
      if (b.mat !== 'road' && b.mat !== 'steel') continue;
      const ends = beamEnds(session, b);
      if (!ends) continue;
      const A = worldToScreen(cam, ends.a.x, ends.a.y, w, h);
      const C = worldToScreen(cam, ends.c.x, ends.c.y, w, h);
      const ay = waterY + (waterY - A.y);
      const cy = waterY + (waterY - C.y);
      ctx.strokeStyle = '#d5ece6';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(A.x, ay);
      ctx.lineTo(C.x, cy);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawAnchors(ctx, w, h, session, cam) {
    for (const n of session.nodes) {
      if (!n.anchor && !n.pin) continue;
      const p = worldToScreen(cam, n.x, n.y, w, h);
      ctx.fillStyle = '#6d5a48';
      ctx.strokeStyle = '#2a2118';
      ctx.lineWidth = 1.5;
      roundRect(ctx, p.x - 11, p.y - 8, 22, 16, 3);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#e0b56a';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawJoints(ctx, w, h, session, cam, opts) {
    const splits = session.splits || [];
    for (const n of session.nodes) {
      if (n.pin) continue;
      const p = worldToScreen(cam, n.x, n.y, w, h);
      const split = splits.find(s => s.a === n.id || s.b === n.id);
      let ox = 0;
      if (split) ox = n.id === split.a ? -6 : 6;
      ctx.fillStyle = '#f4e7cf';
      ctx.strokeStyle = '#2a241c';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(p.x + ox, p.y, split ? 5.5 : 4.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      if (opts.cursor && Math.abs(opts.cursor.x - n.x) < 0.01 && Math.abs(opts.cursor.y - n.y) < 0.01) {
        ctx.strokeStyle = '#f2d48a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(p.x + ox, p.y, 9, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    if (opts.cursor) {
      const p = worldToScreen(cam, opts.cursor.x, opts.cursor.y, w, h);
      ctx.strokeStyle = 'rgba(255,244,220,.9)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(p.x - 8, p.y);
      ctx.lineTo(p.x + 8, p.y);
      ctx.moveTo(p.x, p.y - 8);
      ctx.lineTo(p.x, p.y + 8);
      ctx.stroke();
    }
  }

  function drawCheckpoints(ctx, w, h, session, cam, time) {
    for (const c of session.level.checkpoints || []) {
      const p = worldToScreen(cam, c.x, c.y, w, h);
      const got = session.sim && session.sim.vehicles && session.sim.vehicles.some(v => v.got && v.got[c.id]);
      ctx.save();
      ctx.translate(p.x, p.y + Math.sin(time * 2 + c.x) * 2);
      ctx.fillStyle = got ? '#e7c56a' : '#f4e1b0';
      ctx.strokeStyle = '#2a2118';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#8a4b22';
      ctx.fillRect(-1.5, 6, 3, 10);
      ctx.restore();
    }
  }

  function drawFlags(ctx, w, h, session, cam, time) {
    const vehicles = (session.sim && session.sim.vehicles && session.sim.vehicles.length)
      ? session.sim.vehicles
      : (session.level.vehicles || []);
    const seen = {};
    for (const v of vehicles) {
      const key = v.flagX + ':' + v.flagY;
      if (seen[key]) continue;
      seen[key] = true;
      const p = worldToScreen(cam, v.flagX, v.flagY, w, h);
      ctx.strokeStyle = '#f4efe4';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y + 16);
      ctx.lineTo(p.x, p.y - 18);
      ctx.stroke();
      ctx.fillStyle = v.done ? '#7dcea0' : '#d4533a';
      ctx.beginPath();
      const wave = Math.sin(time * 3 + p.x) * 3;
      ctx.moveTo(p.x, p.y - 18);
      ctx.lineTo(p.x + 16 + wave, p.y - 10);
      ctx.lineTo(p.x, p.y - 2);
      ctx.fill();
    }
  }

  function drawVehicles(ctx, w, h, session, cam, time) {
    const list = session.sim && session.sim.vehicles ? session.sim.vehicles.filter(v => v.alive || v.done || (session.sim.mode === 'replay' && v.x)) : [];
    for (const v of list) {
      if (!v.spawned && !(session.sim.mode === 'replay' && v.alive)) {
        if (!(v.alive || v.done)) continue;
      }
      if (!isFinite(v.x) || !isFinite(v.y)) continue;
      const p = worldToScreen(cam, v.x, v.y, w, h);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(-v.angle);
      const spec = {
        cycle: [28, 16, '#d7c4a4'],
        cart: [46, 22, '#e7d3a4'],
        hack: [50, 20, '#f0e2b8'],
        van: [56, 26, '#d9c2a2'],
        dray: [60, 24, '#c9844a'],
        wagon: [68, 28, '#b5653a'],
        hopper: [64, 30, '#8d6a45'],
        cistern: [74, 28, '#6e8c96']
      }[v.type] || [48, 22, '#e7d3a4'];
      ctx.fillStyle = spec[2];
      ctx.strokeStyle = '#241c16';
      ctx.lineWidth = 1.6;
      roundRect(ctx, -spec[0] / 2, -spec[1] / 2, spec[0], spec[1], 6);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = 'rgba(40,60,70,.35)';
      ctx.fillRect(-spec[0] / 2 + 6, -spec[1] / 2 + 4, spec[0] * 0.35, spec[1] * 0.42);
      const spin = v.spin || 0;
      const axle = spec[0] * 0.28;
      drawWheel(ctx, -axle, spec[1] * 0.35, spin);
      drawWheel(ctx, axle, spec[1] * 0.35, spin);
      ctx.restore();
    }
  }
  function drawWheel(ctx, x, y, spin) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(spin);
    ctx.fillStyle = '#2a241c';
    ctx.beginPath();
    ctx.arc(0, 0, 6.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#e6d7b8';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-5, 0); ctx.lineTo(5, 0);
    ctx.moveTo(0, -5); ctx.lineTo(0, 5);
    ctx.stroke();
    ctx.restore();
  }

  function drawGhost(ctx, w, h, session, cam, opts) {
    if (!opts.ghost) return;
    const A = worldToScreen(cam, opts.ghost.x0, opts.ghost.y0, w, h);
    const C = worldToScreen(cam, opts.ghost.x1, opts.ghost.y1, w, h);
    ctx.save();
    ctx.setLineDash([6, 4]);
    ctx.strokeStyle = opts.ghost.ok ? 'rgba(244,228,190,.9)' : 'rgba(210,80,60,.9)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(C.x, C.y);
    ctx.stroke();
    ctx.restore();
  }

  function drawParticles(ctx, cam, w, h, fx) {
    if (!fx) return;
    for (const p of fx) {
      const s = worldToScreen(cam, p.x, p.y, w, h);
      ctx.globalAlpha = clamp(p.life, 0, 1);
      ctx.fillStyle = p.color;
      ctx.fillRect(s.x, s.y, p.size, p.size);
    }
    ctx.globalAlpha = 1;
  }

  return { draw: draw, stressColor: stressColor, THEMES: THEMES, worldToScreen: worldToScreen };
});
