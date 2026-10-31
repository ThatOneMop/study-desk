/* Creekhold — isometric board. Original shapes, no external art. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.CreekholdRender = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const TW = 64, TH = 32, TZ = 18;

  const TINT = {
    path: '#e4d3b4', stairs: '#d7c4a4', platform: '#efd8b0', bridge: '#e7d7b8',
    dam: '#8a5534', levee: '#d08b6c', gate: '#6e8ea0', pump: '#2f7f8a',
    'deep-pump': '#24636e', tank: '#6fa8b0', cistern: '#4e8f96', filter: '#8d8a6a',
    wheel: '#c9853a', shaft: '#8d9390', vshaft: '#6e7674', wind: '#d8e2c8', engine: '#b85a32',
    hearth: '#e2a24a', lodge: '#b65b38', bunk: '#7d5a48', vat: '#a3546a',
    forager: '#6e9a45', carrots: '#e07a32', spuds: '#c9a15a', kettle: '#c4654a',
    hive: '#e6c85a', grill: '#a84832', lumber: '#6d8a3e', forester: '#4f7a3a',
    saw: '#b08968', mill: '#a06a42', gears: '#c0a15a', inventor: '#7d6ea8',
    yard: '#a68455', warehouse: '#8d7352', hauler: '#6a7d8a', porter: '#b9a48a',
    lantern: '#f0d78a', fire: '#e07a3a', pool: '#5eb0c0', arch: '#d4a0b8', bell: '#d7c36a'
  };

  function rotOf(x, y, rot, w, h) {
    switch (rot & 3) {
      case 1: return [h - 1 - y, x];
      case 2: return [w - 1 - x, h - 1 - y];
      case 3: return [y, w - 1 - x];
      default: return [x, y];
    }
  }

  function project(x, y, z, cam, mapW, mapH) {
    const p = rotOf(x, y, cam.rot, mapW, mapH);
    const zoom = cam.zoom;
    return [
      (p[0] - p[1]) * (TW / 2) * zoom + cam.x,
      (p[0] + p[1]) * (TH / 2) * zoom - z * TZ * zoom + cam.y
    ];
  }

  function centerOn(cam, x, y, z, viewW, viewH, mapW, mapH) {
    const p = rotOf(x, y, cam.rot, mapW, mapH);
    cam.x = viewW / 2 - (p[0] - p[1]) * (TW / 2) * cam.zoom;
    cam.y = viewH / 2 - ((p[0] + p[1]) * (TH / 2) * cam.zoom - z * TZ * cam.zoom);
  }

  function hash(x, y) { return Math.abs((x * 73856093 ^ y * 19349663) | 0); }

  function grass(cell, season) {
    const h = hash(cell.x, cell.y);
    if (cell.sour > 2) return h % 2 ? '#8a7844' : '#75683a';
    if (cell.ground <= 0) return '#9a7a52';
    if (cell.ground === 1) return h % 2 ? '#c6b07a' : '#b89d68';
    if (cell.ground >= 4) return h % 2 ? '#8e998c' : '#7e8b80';
    if (season === 'drought' || cell.irrig <= 0) return h % 3 === 0 ? '#c2b06a' : '#b7a25e';
    return ['#7ea15a', '#6e944e', '#8aaf62'][h % 3];
  }

  function diamond(ctx, sx, sy, hw, hh) {
    ctx.beginPath();
    ctx.moveTo(sx, sy - hh);
    ctx.lineTo(sx + hw, sy);
    ctx.lineTo(sx, sy + hh);
    ctx.lineTo(sx - hw, sy);
    ctx.closePath();
  }

  function column(ctx, sx, sy, zoom, z0, z1, top, left, right) {
    const hw = (TW / 2) * zoom, hh = (TH / 2) * zoom, vz = TZ * zoom;
    const y0 = sy - z0 * vz, y1 = sy - z1 * vz;
    if (z1 > z0 + 0.02) {
      ctx.beginPath();
      ctx.moveTo(sx - hw, y1);
      ctx.lineTo(sx, y1 + hh);
      ctx.lineTo(sx, y0 + hh);
      ctx.lineTo(sx - hw, y0);
      ctx.closePath();
      ctx.fillStyle = left;
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(sx + hw, y1);
      ctx.lineTo(sx, y1 + hh);
      ctx.lineTo(sx, y0 + hh);
      ctx.lineTo(sx + hw, y0);
      ctx.closePath();
      ctx.fillStyle = right;
      ctx.fill();
    }
    diamond(ctx, sx, y1, hw, hh);
    ctx.fillStyle = top;
    ctx.fill();
  }

  function strokeTop(ctx, sx, sy, zoom, z, color, width) {
    const hw = (TW / 2) * zoom, hh = (TH / 2) * zoom;
    const y = sy - z * TZ * zoom;
    diamond(ctx, sx, y, hw, hh);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
  }

  function drawTree(ctx, sx, sy, zoom, wood, t) {
    const s = zoom;
    if (wood <= 0) {
      ctx.fillStyle = '#6a4a30';
      ctx.fillRect(sx - 3 * s, sy - 4 * s, 6 * s, 5 * s);
      return;
    }
    ctx.fillStyle = '#6b442c';
    ctx.fillRect(sx - 1.5 * s, sy - 8 * s, 3 * s, 8 * s);
    ctx.fillStyle = '#3f6b34';
    ctx.beginPath();
    ctx.moveTo(sx, sy - 28 * s);
    ctx.lineTo(sx + 11 * s, sy - 8 * s);
    ctx.lineTo(sx - 11 * s, sy - 8 * s);
    ctx.fill();
    ctx.fillStyle = '#4e8240';
    ctx.beginPath();
    ctx.moveTo(sx, sy - 34 * s);
    ctx.lineTo(sx + 8 * s, sy - 16 * s);
    ctx.lineTo(sx - 8 * s, sy - 16 * s);
    ctx.fill();
    if (Math.sin(t / 500 + sx) > 0.6) {
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.fillRect(sx - 2 * s, sy - 24 * s, 2 * s, 4 * s);
    }
  }

  function drawBush(ctx, sx, sy, zoom, fruit) {
    ctx.fillStyle = '#3f6e38';
    ctx.beginPath();
    ctx.ellipse(sx, sy - 4 * zoom, 8 * zoom, 5 * zoom, 0, 0, 7);
    ctx.fill();
    if (fruit > 0.4) {
      ctx.fillStyle = '#c44848';
      ctx.beginPath();
      ctx.arc(sx - 3 * zoom, sy - 5 * zoom, 1.6 * zoom, 0, 7);
      ctx.arc(sx + 3 * zoom, sy - 4 * zoom, 1.6 * zoom, 0, 7);
      ctx.fill();
    }
  }

  function drawBuilding(ctx, sx, sy, zoom, cell, t, progress) {
    const b = cell.building;
    const id = b.id;
    const tint = TINT[id] || '#a56b43';
    const z = cell.ground + (cell.floors || 0) + (cell.levee || 0) * 0.02;
    const p = projectZ(sy, z, zoom);
    const rise = Math.max(0.15, progress);
    if (id === 'path' || id === 'bridge') {
      column(ctx, sx, sy, zoom, z, z + 0.08, tint, '#cbb892', '#b6a27e');
      return;
    }
    if (id === 'dam') {
      column(ctx, sx, sy, zoom * 0.96, z, z + 1.15 * rise, '#c4844e', '#7a4528', '#9a5a34');
      ctx.fillStyle = '#f4e2c4';
      ctx.fillRect(sx - 8 * zoom, p - 22 * zoom * rise, 16 * zoom, 4 * zoom);
      return;
    }
    if (id === 'levee') {
      const hgt = (cell.levee || (progress < 1 ? 0.4 : 1));
      column(ctx, sx, sy, zoom, cell.ground, cell.ground + hgt, '#e0a088', '#b8745c', '#c9846c');
      return;
    }
    if (id === 'wheel') {
      ctx.save();
      ctx.translate(sx, p - 8 * zoom);
      ctx.rotate(t / 400);
      ctx.strokeStyle = '#8a5a28';
      ctx.lineWidth = 2 * zoom;
      ctx.beginPath();
      ctx.arc(0, 0, 9 * zoom, 0, 7);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-9 * zoom, 0); ctx.lineTo(9 * zoom, 0);
      ctx.moveTo(0, -9 * zoom); ctx.lineTo(0, 9 * zoom);
      ctx.stroke();
      ctx.restore();
      return;
    }
    if (id === 'shaft' || id === 'vshaft') {
      ctx.strokeStyle = '#9aa19c';
      ctx.lineWidth = 3 * zoom;
      ctx.beginPath();
      ctx.moveTo(sx - 12 * zoom, p);
      ctx.lineTo(sx + 12 * zoom, p - (id === 'vshaft' ? 14 : 0) * zoom);
      ctx.stroke();
      return;
    }
    const tall = id === 'lodge' || id === 'hearth' || id === 'bunk' || id === 'inventor' || id === 'wind' ? 0.85 : 0.55;
    column(ctx, sx, sy, zoom * 0.78, z, z + tall * rise, tint, shade(tint, -28), shade(tint, -14));
    if (progress >= 1 && (id === 'lodge' || id === 'hearth' || id === 'bunk' || id === 'inventor')) {
      ctx.fillStyle = id === 'hearth' ? '#f2c14d' : '#6e3428';
      ctx.beginPath();
      ctx.moveTo(sx, p - 28 * zoom);
      ctx.lineTo(sx + 14 * zoom, p - 12 * zoom);
      ctx.lineTo(sx - 14 * zoom, p - 12 * zoom);
      ctx.fill();
    }
    if (progress < 1) {
      ctx.strokeStyle = 'rgba(36,48,40,0.45)';
      ctx.lineWidth = 1;
      ctx.strokeRect(sx - 10 * zoom, p - 18 * zoom, 20 * zoom, 4 * zoom);
      ctx.fillStyle = '#e2a24a';
      ctx.fillRect(sx - 10 * zoom, p - 18 * zoom, 20 * zoom * progress, 4 * zoom);
    }
    if (id === 'pump' || id === 'deep-pump') {
      ctx.fillStyle = '#d7eef0';
      ctx.fillRect(sx - 2 * zoom, p - 22 * zoom, 4 * zoom, 10 * zoom);
    }
    if (id === 'lantern' || id === 'hearth' || id === 'fire') {
      const glow = 0.35 + Math.sin(t / 180 + cell.x) * 0.15;
      ctx.fillStyle = 'rgba(242, 193, 77,' + glow + ')';
      ctx.beginPath();
      ctx.arc(sx, p - 16 * zoom, 5 * zoom, 0, 7);
      ctx.fill();
    }
  }

  function projectZ(sy, z, zoom) { return sy - z * TZ * zoom; }

  function shade(hex, delta) {
    const n = parseInt(hex.slice(1), 16);
    let r = (n >> 16) + delta, g = ((n >> 8) & 255) + delta, b = (n & 255) + delta;
    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));
    return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
  }

  function drawNib(ctx, sx, sy, zoom, nib, t) {
    const bob = Math.sin(t / 140 + nib.id * 1.7) * 1.6 * zoom;
    const s = (nib.kit ? 5.4 : 8.2) * zoom;
    const y = sy + bob;
    ctx.fillStyle = 'rgba(30, 24, 16, 0.2)';
    ctx.beginPath();
    ctx.ellipse(sx, sy + 2 * zoom, s * 0.8, s * 0.35, 0, 0, 7);
    ctx.fill();
    ctx.fillStyle = '#5c341f';
    ctx.beginPath();
    ctx.ellipse(sx - s * 0.95, y + s * 0.15, s * 0.62, s * 0.26, -0.5, 0, 7);
    ctx.fill();
    ctx.fillStyle = nib.contaminated > 0 ? '#6a7040' : '#7a4a2c';
    ctx.beginPath();
    ctx.ellipse(sx, y, s, s * 0.72, 0, 0, 7);
    ctx.fill();
    ctx.fillStyle = '#f3d7be';
    ctx.beginPath();
    ctx.ellipse(sx, y + s * 0.16, s * 0.48, s * 0.32, 0, 0, 7);
    ctx.fill();
    ctx.fillStyle = '#7a4a2c';
    ctx.beginPath();
    ctx.ellipse(sx - s * 0.38, y - s * 0.72, s * 0.18, s * 0.28, -0.2, 0, 7);
    ctx.ellipse(sx + s * 0.38, y - s * 0.72, s * 0.18, s * 0.28, 0.2, 0, 7);
    ctx.fill();
    ctx.fillStyle = '#24160f';
    ctx.fillRect(sx - s * 0.28, y - s * 0.1, s * 0.16, s * 0.16);
    ctx.fillRect(sx + s * 0.12, y - s * 0.1, s * 0.16, s * 0.16);
  }

  function sky(ctx, w, h, hour) {
    const night = hour >= 20 || hour < 5;
    const dusk = (hour >= 17 && hour < 20) || (hour >= 5 && hour < 7);
    const g = ctx.createLinearGradient(0, 0, 0, h);
    if (night) { g.addColorStop(0, '#1a2233'); g.addColorStop(1, '#2c3144'); }
    else if (dusk) { g.addColorStop(0, '#f0c39a'); g.addColorStop(1, '#d7e4cf'); }
    else { g.addColorStop(0, '#d5eef2'); g.addColorStop(1, '#e7f0d8'); }
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }

  function frame(ctx, view) {
    const run = view.run;
    const w = view.w, h = view.h;
    const cam = view.cam;
    const hour = run ? ((run.hour % 24) + 24) % 24 : 10;
    sky(ctx, w, h, hour);
    if (!run) return;
    const list = [];
    for (let i = 0; i < run.cells.length; i++) {
      const c = run.cells[i];
      const p = rotOf(c.x, c.y, cam.rot, run.w, run.h);
      list.push({ c: c, key: p[0] + p[1] + (c.ground + c.floors) * 0.01 });
    }
    list.sort(function (a, b) { return a.key - b.key; });
    const t = view.time || 0;
    for (let i = 0; i < list.length; i++) {
      const c = list[i].c;
      const topZ = c.ground + (c.levee || 0);
      const pt = project(c.x, c.y, 0, cam, run.w, run.h);
      if (pt[0] < -120 || pt[1] < -140 || pt[0] > w + 120 || pt[1] > h + 160) continue;
      const top = grass(c, run.season);
      column(ctx, pt[0], pt[1], cam.zoom, 0, Math.max(0.08, c.ground), top, '#6e4632', '#8a5a3e');
      if (c.levee > 0) column(ctx, pt[0], pt[1], cam.zoom, c.ground, c.ground + c.levee, '#e0a088', '#b8745c', '#c9846c');
      if (c.floors > 0 && !(c.building && c.building.id === 'levee')) {
        column(ctx, pt[0], pt[1], cam.zoom * 0.9, topZ, topZ + c.floors, '#efd8b0', '#d3b48a', '#e4c7a0');
      }
      if (c.water > 0.03) {
        const wz = topZ + Math.min(c.water, 3.2);
        const sour = c.bad > 0.45;
        const shimmer = Math.sin(t / 380 + c.x * 0.8 + c.y) * 0.04;
        const depth = Math.min(1, c.water / 1.6);
        const topA = (sour ? 0.55 : 0.42 + depth * 0.38) + shimmer;
        const body = sour ? 'rgba(110,92,40,' + topA + ')' : 'rgba(' + Math.round(30 - depth * 10) + ',' + Math.round(140 - depth * 30) + ',' + Math.round(170 - depth * 10) + ',' + topA + ')';
        column(ctx, pt[0], pt[1], cam.zoom, Math.max(topZ, wz - Math.min(c.water, 1.1)), wz, body, sour ? 'rgba(80,64,24,0.55)' : 'rgba(16,90,110,0.55)', sour ? 'rgba(96,78,30,0.5)' : 'rgba(20,110,128,0.5)');
        if (c.flow > 0.35 && !view.reduce) {
          ctx.strokeStyle = 'rgba(236, 250, 248, 0.45)';
          ctx.lineWidth = 1;
          const y = pt[1] - wz * TZ * cam.zoom;
          ctx.beginPath();
          ctx.moveTo(pt[0] - 10 * cam.zoom, y + Math.sin(t / 200 + c.x) * 2);
          ctx.lineTo(pt[0] + 10 * cam.zoom, y);
          ctx.stroke();
        }
      }
      if (view.overlay === 'water') {
        strokeTop(ctx, pt[0], pt[1], cam.zoom, topZ + c.water, 'rgba(20,90,110,0.35)', 1);
        if (c.water > 0.2) {
          ctx.fillStyle = '#14343c';
          ctx.font = (9 * cam.zoom) + 'px system-ui';
          ctx.fillText(c.water.toFixed(1), pt[0] - 6, pt[1] - (topZ + c.water) * TZ * cam.zoom);
        }
      } else if (view.overlay === 'reach' && run.network) {
        const on = run.network.has(c.x + ',' + c.y);
        if (on) strokeTop(ctx, pt[0], pt[1], cam.zoom, topZ, 'rgba(70,140,70,0.8)', 1.5);
      } else if (view.overlay === 'power' && run.powered && run.powered[c.x + ',' + c.y] > 0) {
        strokeTop(ctx, pt[0], pt[1], cam.zoom, topZ, 'rgba(210,160,40,0.9)', 1.5);
      } else if (view.overlay === 'sour' && (c.bad > 0.2 || c.sour > 0)) {
        strokeTop(ctx, pt[0], pt[1], cam.zoom, topZ, 'rgba(110,70,20,0.8)', 1.5);
      }
      if (c.tree) drawTree(ctx, pt[0], pt[1] - topZ * TZ * cam.zoom, cam.zoom, c.tree.wood, t);
      if (c.bush) drawBush(ctx, pt[0] + 8 * cam.zoom, pt[1] - topZ * TZ * cam.zoom, cam.zoom, c.bush.fruit);
      if (c.building) drawBuilding(ctx, pt[0], pt[1], cam.zoom, c, t, c.building.progress);
      if (view.selected && view.selected.x === c.x && view.selected.y === c.y) {
        strokeTop(ctx, pt[0], pt[1], cam.zoom, topZ + 0.05, '#fff8e8', 2);
      }
    }
    if (view.ghost) {
      const g = view.ghost;
      const pt = project(g.x, g.y, 0, cam, run.w, run.h);
      const cell = run.cells[g.y * run.w + g.x];
      const z = cell ? cell.ground : 0;
      strokeTop(ctx, pt[0], pt[1], cam.zoom, z, g.ok ? 'rgba(90,160,80,0.95)' : 'rgba(180,60,50,0.95)', 2);
      ctx.globalAlpha = 0.55;
      drawBuilding(ctx, pt[0], pt[1], cam.zoom, { x: g.x, y: g.y, ground: z, floors: cell ? cell.floors : 0, levee: 0, building: { id: g.id, progress: 1 } }, t, 1);
      ctx.globalAlpha = 1;
    }
    const nibs = (run.nibs || []).filter(function (n) { return !n.dead; });
    nibs.sort(function (a, b) { return (a.x + a.y) - (b.x + b.y); });
    for (let i = 0; i < nibs.length; i++) {
      const n = nibs[i];
      const pt = project(n.x, n.y, 0.2, cam, run.w, run.h);
      if (pt[0] < -20 || pt[1] < -20 || pt[0] > w + 20 || pt[1] > h + 20) continue;
      drawNib(ctx, pt[0], pt[1], cam.zoom, n, t);
    }
    const parts = view.particles || [];
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      const pt = project(p.x, p.y, p.z, cam, run.w, run.h);
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.fillRect(pt[0], pt[1], 3 * cam.zoom, 3 * cam.zoom);
      ctx.globalAlpha = 1;
    }
    if (hour >= 20 || hour < 5) {
      ctx.fillStyle = 'rgba(10, 16, 32, 0.28)';
      ctx.fillRect(0, 0, w, h);
    }
  }

  function pick(cam, viewW, viewH, mx, my, run) {
    // Hit-test in the same back-to-front order frame() paints, so the tile the
    // player can actually see under the pointer wins (including cliff faces).
    if (!run) return null;
    let best = null, bestKey = -Infinity;
    const hw = (TW / 2) * cam.zoom, hh = (TH / 2) * cam.zoom;
    for (let i = 0; i < run.cells.length; i++) {
      const c = run.cells[i];
      const solid = c.ground + (c.levee || 0) + (c.floors || 0);
      // Water is drawn as a raised surface, so it is what the player taps.
      const z = c.water > 0.03 ? Math.max(solid, c.ground + (c.levee || 0) + Math.min(c.water, 3.2)) : solid;
      const pt = project(c.x, c.y, z, cam, run.w, run.h);
      const dx = Math.abs(mx - pt[0]) / hw;
      if (dx > 1) continue;
      const slack = hh * (1 - dx);
      const baseY = pt[1] + z * TZ * cam.zoom;
      if (my < pt[1] - slack || my > baseY + slack) continue;
      const p = rotOf(c.x, c.y, cam.rot, run.w, run.h);
      const key = p[0] + p[1] + (c.ground + c.floors) * 0.01;
      if (key > bestKey) { best = c; bestKey = key; }
    }
    return best;
  }

  return { frame: frame, pick: pick, centerOn: centerOn, project: project, TINT: TINT };
});
