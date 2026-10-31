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

  function palette(run) {
    const tone = (run && run.tone) || (run && run.mapId) || 'willow';
    if (tone === 'gorge') return { dirt: '#6a5c52', dirt2: '#3e3834', mud: '#8a7560', sand: '#b7a48a', rock: ['#9aa094', '#868e84'], grass: ['#8a9070', '#747a62', '#9aa080'], dry: ['#c2ae78', '#b09a68'] };
    if (tone === 'split') return { dirt: '#7a4e3c', dirt2: '#5c382c', mud: '#a88460', sand: '#d2bc88', rock: ['#8e9a8c', '#7a8878'], grass: ['#5e9a78', '#4e8668', '#78b090'], dry: ['#d2b86a', '#c2a45a'] };
    return { dirt: '#6e4632', dirt2: '#8a5a3e', mud: '#9a7a52', sand: '#c6b07a', rock: ['#8e998c', '#7e8b80'], grass: ['#7ea15a', '#6e944e', '#8aaf62'], dry: ['#c2b06a', '#b7a25e'] };
  }

  function grass(cell, season, pal) {
    const h = hash(cell.x, cell.y);
    if (cell.sour > 2 || (season === 'badtide' && cell.irrig > 0 && cell.sour > 0)) return h % 2 ? '#8a7844' : '#6a6238';
    if (cell.ground <= 0) return pal.mud;
    if (cell.ground === 1) return h % 2 ? pal.sand : shade(pal.sand, -14);
    if (cell.ground >= 4) return pal.rock[h % 2];
    if (season === 'drought' || cell.irrig <= 0) return pal.dry[h % 2];
    return pal.grass[h % 3];
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

  function drawTree(ctx, sx, sy, zoom, tree, t, season) {
    const s = zoom;
    const wood = tree.wood || 0;
    const grow = tree.grow || 0;
    if (wood <= 0) {
      ctx.fillStyle = '#5c3d28';
      ctx.fillRect(sx - 4 * s, sy - 3 * s, 8 * s, 4 * s);
      const sprout = Math.max(0, Math.min(1, grow / 18));
      if (sprout > 0.05) {
        ctx.fillStyle = season === 'badtide' ? '#8a8a48' : '#6ea84a';
        ctx.beginPath();
        ctx.moveTo(sx, sy - (6 + 16 * sprout) * s);
        ctx.lineTo(sx + 5 * sprout * s, sy - 3 * s);
        ctx.lineTo(sx - 5 * sprout * s, sy - 3 * s);
        ctx.fill();
      }
      return;
    }
    const stage = wood >= 3 ? 1 : wood === 2 ? 0.72 : 0.48;
    const leaf = season === 'badtide' ? '#8d8a46' : season === 'drought' ? '#8a9a58' : '#2f6b34';
    const leaf2 = season === 'badtide' ? '#6e6a32' : season === 'drought' ? '#6e7a40' : '#3e8a42';
    ctx.fillStyle = '#5a3824';
    ctx.fillRect(sx - 2 * s, sy - 12 * stage * s, 4 * s, 12 * stage * s);
    ctx.fillStyle = leaf;
    ctx.beginPath();
    ctx.moveTo(sx, sy - (18 + 22 * stage) * s);
    ctx.lineTo(sx + (8 + 8 * stage) * s, sy - 8 * s);
    ctx.lineTo(sx - (8 + 8 * stage) * s, sy - 8 * s);
    ctx.fill();
    ctx.fillStyle = leaf2;
    ctx.beginPath();
    ctx.moveTo(sx, sy - (26 + 18 * stage) * s);
    ctx.lineTo(sx + 7 * stage * s, sy - 14 * stage * s);
    ctx.lineTo(sx - 7 * stage * s, sy - 14 * stage * s);
    ctx.fill();
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

  function scaffold(ctx, sx, p, zoom, t, progress) {
    const sway = Math.sin(t / 220) * 1.2 * zoom;
    ctx.strokeStyle = '#c9b48a';
    ctx.lineWidth = Math.max(1, 1.4 * zoom);
    ctx.beginPath();
    ctx.moveTo(sx - 14 * zoom, p);
    ctx.lineTo(sx - 12 * zoom + sway, p - 26 * zoom * Math.max(0.35, progress));
    ctx.moveTo(sx + 14 * zoom, p);
    ctx.lineTo(sx + 12 * zoom - sway, p - 26 * zoom * Math.max(0.35, progress));
    ctx.moveTo(sx - 12 * zoom, p - 12 * zoom);
    ctx.lineTo(sx + 12 * zoom, p - 16 * zoom);
    ctx.stroke();
    ctx.fillStyle = '#e2a24a';
    ctx.fillRect(sx - 12 * zoom, p - 30 * zoom, 24 * zoom * progress, 3 * zoom);
  }

  function roof(ctx, sx, p, zoom, w, h, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(sx, p - h);
    ctx.lineTo(sx + w, p - h * 0.42);
    ctx.lineTo(sx - w, p - h * 0.42);
    ctx.fill();
  }

  function drawBuilding(ctx, sx, sy, zoom, cell, t, progress) {
    const b = cell.building;
    const id = b.id;
    const z = cell.ground + (cell.floors || 0);
    const p = projectZ(sy, z, zoom);
    const rise = Math.max(0.2, progress);
    const s = zoom;
    if (id === 'path') {
      column(ctx, sx, sy, zoom, z, z + 0.06, '#e7d7b6', '#cbb892', '#b6a27e');
      ctx.fillStyle = '#f4ead4';
      ctx.fillRect(sx - 6 * s, p - 2 * s, 12 * s, 2 * s);
      return;
    }
    if (id === 'bridge') {
      ctx.strokeStyle = '#8d5a32';
      ctx.lineWidth = 3 * s;
      ctx.beginPath();
      ctx.moveTo(sx - 16 * s, p - 4 * s);
      ctx.quadraticCurveTo(sx, p - 14 * s, sx + 16 * s, p - 4 * s);
      ctx.stroke();
      ctx.fillStyle = '#e7d3b0';
      ctx.fillRect(sx - 16 * s, p - 6 * s, 32 * s, 3 * s);
      return;
    }
    if (id === 'stairs') {
      ctx.fillStyle = '#d9c4a2';
      for (let i = 0; i < 3; i++) ctx.fillRect(sx - 12 * s + i * 8 * s, p - 4 * s - i * 5 * s, 8 * s, 4 * s);
      if (progress < 1) scaffold(ctx, sx, p, zoom, t, progress);
      return;
    }
    if (id === 'dam') {
      column(ctx, sx, sy, zoom * 0.98, z, z + 1.15 * rise, '#c98448', '#6e3e24', '#8d542e');
      ctx.fillStyle = '#f3e0c2';
      ctx.fillRect(sx - 10 * s, p - 24 * s * rise, 20 * s, 3.5 * s);
      ctx.fillStyle = '#5c331c';
      ctx.fillRect(sx - 14 * s, p - 8 * s, 4 * s, 8 * s);
      ctx.fillRect(sx + 10 * s, p - 8 * s, 4 * s, 8 * s);
      if (progress < 1) scaffold(ctx, sx, p, zoom, t, progress);
      return;
    }
    if (id === 'gate') {
      ctx.fillStyle = '#6e8ea0';
      ctx.fillRect(sx - 14 * s, p - 22 * s, 4 * s, 22 * s);
      ctx.fillRect(sx + 10 * s, p - 22 * s, 4 * s, 22 * s);
      const lip = (b.gate || 0) / 3;
      ctx.fillStyle = '#d7e4ea';
      ctx.fillRect(sx - 10 * s, p - (8 + 12 * lip) * s, 20 * s, 5 * s);
      if (progress < 1) scaffold(ctx, sx, p, zoom, t, progress);
      return;
    }
    if (id === 'levee') {
      const hgt = (cell.levee || (progress < 1 ? 0.45 : 1));
      column(ctx, sx, sy, zoom, cell.ground, cell.ground + hgt, '#e4b198', '#a86b52', '#c4846c');
      ctx.strokeStyle = 'rgba(90,50,36,0.35)';
      ctx.lineWidth = 1;
      for (let i = 1; i < hgt; i++) {
        const yy = projectZ(sy, cell.ground + i, zoom);
        ctx.beginPath();
        ctx.moveTo(sx - 16 * s, yy);
        ctx.lineTo(sx + 16 * s, yy);
        ctx.stroke();
      }
      return;
    }
    if (id === 'wheel') {
      ctx.save();
      ctx.translate(sx, p - 6 * s);
      ctx.rotate((t / 280) % 6.28);
      ctx.fillStyle = '#c9853a';
      ctx.beginPath();
      ctx.arc(0, 0, 12 * s, 0, 7);
      ctx.fill();
      ctx.strokeStyle = '#5c3318';
      ctx.lineWidth = 2 * s;
      ctx.beginPath();
      ctx.arc(0, 0, 12 * s, 0, 7);
      ctx.moveTo(-12 * s, 0); ctx.lineTo(12 * s, 0);
      ctx.moveTo(0, -12 * s); ctx.lineTo(0, 12 * s);
      ctx.moveTo(-8 * s, -8 * s); ctx.lineTo(8 * s, 8 * s);
      ctx.stroke();
      ctx.restore();
      ctx.fillStyle = '#6b4428';
      ctx.fillRect(sx - 16 * s, p - 3 * s, 32 * s, 4 * s);
      return;
    }
    if (id === 'shaft' || id === 'vshaft') {
      ctx.strokeStyle = '#8d9490';
      ctx.lineWidth = 4 * s;
      ctx.beginPath();
      ctx.moveTo(sx - 14 * s, p - 2 * s);
      ctx.lineTo(sx + 14 * s, p - (id === 'vshaft' ? 18 : 2) * s);
      ctx.stroke();
      ctx.fillStyle = '#d7c36a';
      ctx.beginPath();
      ctx.arc(sx, p - 2 * s, 3 * s, 0, 7);
      ctx.fill();
      return;
    }
    if (id === 'pump' || id === 'deep-pump') {
      column(ctx, sx, sy, zoom * 0.7, z, z + 0.55 * rise, '#2f7f8a', '#1d5560', '#246878');
      ctx.fillStyle = '#d5eef2';
      ctx.fillRect(sx - 3 * s, p - 28 * s, 6 * s, 16 * s);
      ctx.fillStyle = '#8d5a32';
      ctx.fillRect(sx + 2 * s, p - 18 * s, 14 * s, 3 * s);
      ctx.beginPath();
      ctx.arc(sx + 16 * s, p - 12 * s, 3 * s, 0, 7);
      ctx.fill();
      if (progress < 1) scaffold(ctx, sx, p, zoom, t, progress);
      return;
    }
    if (id === 'tank' || id === 'cistern') {
      const hh = (id === 'cistern' ? 22 : 16) * s * rise;
      ctx.fillStyle = '#6fa8b0';
      ctx.beginPath();
      ctx.ellipse(sx, p - hh, 12 * s, 5 * s, 0, 0, 7);
      ctx.fill();
      ctx.fillRect(sx - 12 * s, p - hh, 24 * s, hh);
      ctx.fillStyle = '#4e8f96';
      ctx.beginPath();
      ctx.ellipse(sx, p, 12 * s, 5 * s, 0, 0, 7);
      ctx.fill();
      ctx.strokeStyle = '#e7f4f2';
      ctx.lineWidth = 1.5 * s;
      ctx.beginPath();
      ctx.moveTo(sx - 12 * s, p - hh * 0.45);
      ctx.lineTo(sx + 12 * s, p - hh * 0.45);
      ctx.stroke();
      if (progress < 1) scaffold(ctx, sx, p, zoom, t, progress);
      return;
    }
    if (id === 'lodge' || id === 'bunk' || id === 'hearth') {
      const wide = id === 'bunk' ? 16 : 13;
      column(ctx, sx, sy, zoom * 0.92, z, z + 0.72 * rise, id === 'hearth' ? '#c98448' : id === 'bunk' ? '#7d5a48' : '#b65b38', '#6e3424', '#8a4630');
      if (progress > 0.55) {
        roof(ctx, sx, p - 8 * s, s, wide * s, 26 * s, id === 'hearth' ? '#6e3428' : '#5c281c');
        ctx.fillStyle = '#f4e2c0';
        ctx.fillRect(sx - 3 * s, p - 8 * s, 6 * s, 8 * s);
        if (id === 'lodge') {
          ctx.fillStyle = '#f2d27a';
          ctx.fillRect(sx + 5 * s, p - 16 * s, 4 * s, 5 * s);
        }
      }
      if (id === 'hearth' || progress >= 1) {
        const glow = 0.45 + Math.sin(t / 160 + cell.x) * 0.2;
        ctx.fillStyle = 'rgba(242, 170, 60,' + glow + ')';
        ctx.beginPath();
        ctx.arc(sx, p - 20 * s, 4.5 * s, 0, 7);
        ctx.fill();
      }
      if (progress < 1) scaffold(ctx, sx, p, zoom, t, progress);
      return;
    }
    if (id === 'lumber') {
      ctx.fillStyle = '#6d8a3e';
      ctx.fillRect(sx - 1.5 * s, p - 26 * s, 3 * s, 26 * s);
      ctx.fillStyle = '#e7d7a8';
      ctx.beginPath();
      ctx.moveTo(sx, p - 30 * s);
      ctx.lineTo(sx + 12 * s, p - 22 * s);
      ctx.lineTo(sx, p - 18 * s);
      ctx.fill();
      ctx.fillStyle = '#8d5a32';
      ctx.fillRect(sx - 12 * s, p - 5 * s, 8 * s, 4 * s);
      ctx.fillRect(sx - 10 * s, p - 8 * s, 8 * s, 3 * s);
      if (progress < 1) scaffold(ctx, sx, p, zoom, t, progress);
      return;
    }
    if (id === 'forager') {
      column(ctx, sx, sy, zoom * 0.72, z, z + 0.4 * rise, '#6e9a45', '#3f6a28', '#528236');
      ctx.fillStyle = '#c98448';
      ctx.beginPath();
      ctx.ellipse(sx + 8 * s, p - 6 * s, 6 * s, 4 * s, 0, 0, 7);
      ctx.fill();
      ctx.fillStyle = '#c44848';
      ctx.beginPath();
      ctx.arc(sx + 6 * s, p - 8 * s, 1.6 * s, 0, 7);
      ctx.arc(sx + 10 * s, p - 7 * s, 1.6 * s, 0, 7);
      ctx.fill();
      if (progress < 1) scaffold(ctx, sx, p, zoom, t, progress);
      return;
    }
    if (id === 'inventor') {
      column(ctx, sx, sy, zoom * 0.8, z, z + 0.7 * rise, '#7d6ea8', '#4c406e', '#655890');
      roof(ctx, sx, p - 10 * s, s, 14 * s, 22 * s, '#3a3158');
      ctx.fillStyle = '#f4e7b0';
      ctx.fillRect(sx - 5 * s, p - 12 * s, 10 * s, 6 * s);
      if (progress < 1) scaffold(ctx, sx, p, zoom, t, progress);
      return;
    }
    if (id === 'platform') {
      const floors = cell.floors || Math.max(1, Math.round(rise));
      column(ctx, sx, sy, zoom * 0.88, z, z + floors * 0.85, '#efd8b0', '#c9a878', '#ddc49a');
      ctx.fillStyle = '#8d5a32';
      ctx.fillRect(sx - 10 * s, p - 2 * s, 3 * s, 10 * s);
      ctx.fillRect(sx + 7 * s, p - 2 * s, 3 * s, 10 * s);
      return;
    }
    const tall = id === 'wind' || id === 'engine' ? 0.9 : 0.58;
    const tint = TINT[id] || '#a56b43';
    column(ctx, sx, sy, zoom * 0.82, z, z + tall * rise, tint, shade(tint, -32), shade(tint, -16));
    if (id === 'wind' && progress > 0.5) {
      ctx.save();
      ctx.translate(sx, p - 24 * s);
      ctx.rotate(t / 500);
      ctx.fillStyle = '#e7f0e4';
      ctx.fillRect(-2 * s, -16 * s, 4 * s, 32 * s);
      ctx.fillRect(-16 * s, -2 * s, 32 * s, 4 * s);
      ctx.restore();
    }
    if (id === 'engine') {
      ctx.fillStyle = '#5c331c';
      ctx.fillRect(sx + 6 * s, p - 22 * s, 4 * s, 10 * s);
    }
    if (progress < 1) scaffold(ctx, sx, p, zoom, t, progress);
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
    const moving = nib.mode === 'drink' || nib.mode === 'eat' || nib.mode === 'build' || nib.mode === 'work' || (nib.path && nib.path.length);
    const step = moving ? Math.sin(t / 90 + nib.id) : 0;
    const bob = step * 1.4 * zoom;
    const s = (nib.kit ? 6.2 : 9.4) * zoom;
    const y = sy + bob;
    ctx.fillStyle = 'rgba(30, 24, 16, 0.22)';
    ctx.beginPath();
    ctx.ellipse(sx, sy + 3 * zoom, s * 0.9, s * 0.32, 0, 0, 7);
    ctx.fill();
    ctx.fillStyle = '#5c341f';
    ctx.beginPath();
    ctx.ellipse(sx - s * 1.05, y + s * 0.2, s * 0.7, s * 0.28, -0.6, 0, 7);
    ctx.fill();
    const fur = nib.contaminated > 0 ? '#6d7344' : '#7a4a2c';
    ctx.fillStyle = fur;
    ctx.beginPath();
    ctx.ellipse(sx, y - s * 0.15, s * 0.95, s * 0.62, 0, 0, 7);
    ctx.fill();
    ctx.fillStyle = '#f3d7be';
    ctx.beginPath();
    ctx.ellipse(sx + s * 0.15, y, s * 0.42, s * 0.28, 0, 0, 7);
    ctx.fill();
    ctx.fillStyle = fur;
    ctx.beginPath();
    ctx.ellipse(sx - s * 0.35, y - s * 0.85, s * 0.2, s * 0.32, -0.3, 0, 7);
    ctx.ellipse(sx + s * 0.4, y - s * 0.85, s * 0.2, s * 0.32, 0.3, 0, 7);
    ctx.fill();
    ctx.fillStyle = '#24160f';
    ctx.fillRect(sx + s * 0.05, y - s * 0.2, s * 0.14, s * 0.14);
    ctx.fillRect(sx + s * 0.38, y - s * 0.2, s * 0.14, s * 0.14);
    const arm = nib.phase === 'chop' ? -0.9 : nib.mode === 'build' ? -0.4 + step * 0.6 : 0.4;
    ctx.strokeStyle = fur;
    ctx.lineWidth = Math.max(1.5, s * 0.18);
    ctx.beginPath();
    ctx.moveTo(sx + s * 0.3, y);
    ctx.lineTo(sx + s * 0.9, y + s * arm);
    ctx.stroke();
    if (nib.carry > 0 || nib.phase === 'back') {
      ctx.strokeStyle = '#c98448';
      ctx.lineWidth = Math.max(2, s * 0.28);
      ctx.beginPath();
      ctx.moveTo(sx - s * 0.2, y - s * 0.1);
      ctx.lineTo(sx + s * 1.1, y - s * 0.55);
      ctx.stroke();
    } else if (nib.phase === 'chop' || (nib.mode === 'work' && nib.job)) {
      ctx.strokeStyle = '#d7d0c4';
      ctx.lineWidth = Math.max(1.2, s * 0.12);
      ctx.beginPath();
      ctx.moveTo(sx + s * 0.7, y + s * arm);
      ctx.lineTo(sx + s * 1.15, y + s * arm - s * 0.45);
      ctx.stroke();
    }
    if (nib.kit) {
      ctx.fillStyle = '#f2c14d';
      ctx.beginPath();
      ctx.arc(sx, y - s * 1.25, s * 0.16, 0, 7);
      ctx.fill();
    }
  }

  function sky(ctx, w, h, hour, season, tone) {
    const night = hour >= 20 || hour < 5;
    const dusk = (hour >= 17 && hour < 20) || (hour >= 5 && hour < 7);
    const g = ctx.createLinearGradient(0, 0, 0, h);
    if (night) { g.addColorStop(0, '#12182a'); g.addColorStop(1, tone === 'gorge' ? '#2a2628' : '#243044'); }
    else if (season === 'drought') { g.addColorStop(0, '#f2d2a0'); g.addColorStop(1, '#e7d7a8'); }
    else if (season === 'badtide') { g.addColorStop(0, '#d7d2b8'); g.addColorStop(1, '#c8c4a4'); }
    else if (dusk) { g.addColorStop(0, '#f0c39a'); g.addColorStop(1, '#d7e4cf'); }
    else if (tone === 'gorge') { g.addColorStop(0, '#c9d5d8'); g.addColorStop(1, '#d5d8cc'); }
    else if (tone === 'split') { g.addColorStop(0, '#c5e6ea'); g.addColorStop(1, '#dcecd4'); }
    else { g.addColorStop(0, '#d5eef2'); g.addColorStop(1, '#e7f0d8'); }
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    const orbX = w * (0.15 + (hour / 24) * 0.7);
    const orbY = h * (night ? 0.18 : 0.16);
    ctx.fillStyle = night ? 'rgba(230, 236, 245, 0.85)' : season === 'drought' ? 'rgba(255, 214, 120, 0.9)' : 'rgba(255, 244, 210, 0.95)';
    ctx.beginPath();
    ctx.arc(orbX, orbY, night ? 10 : 16, 0, 7);
    ctx.fill();
  }

  function frame(ctx, view) {
    const run = view.run;
    const w = view.w, h = view.h;
    const cam = view.cam;
    const hour = run ? ((run.hour % 24) + 24) % 24 : 10;
    sky(ctx, w, h, hour, run && run.season, run && (run.tone || run.mapId));
    if (!run) return;
    const list = [];
    for (let i = 0; i < run.cells.length; i++) {
      const c = run.cells[i];
      const p = rotOf(c.x, c.y, cam.rot, run.w, run.h);
      list.push({ c: c, key: p[0] + p[1] + (c.ground + c.floors) * 0.01 });
    }
    list.sort(function (a, b) { return a.key - b.key; });
    const t = view.time || 0;
    const pal = palette(run);
    const marks = view.marks;
    for (let i = 0; i < list.length; i++) {
      const c = list[i].c;
      const topZ = c.ground + (c.levee || 0);
      const pt = project(c.x, c.y, 0, cam, run.w, run.h);
      if (pt[0] < -120 || pt[1] < -140 || pt[0] > w + 120 || pt[1] > h + 160) continue;
      const top = grass(c, run.season, pal);
      if (c.ground >= 2) {
        column(ctx, pt[0], pt[1], cam.zoom, 0, c.ground - 0.28, pal.dirt2, pal.dirt, pal.dirt2);
        column(ctx, pt[0], pt[1], cam.zoom, c.ground - 0.28, c.ground, top, pal.dirt, pal.dirt2);
      } else {
        column(ctx, pt[0], pt[1], cam.zoom, 0, Math.max(0.08, c.ground), top, pal.dirt, pal.dirt2);
      }
      if (run.season === 'drought' && c.ground >= 2 && c.water < 0.05 && (c.irrig || 0) < 1) {
        ctx.strokeStyle = 'rgba(90, 60, 30, 0.45)';
        ctx.lineWidth = 1;
        const y = pt[1] - c.ground * TZ * cam.zoom;
        ctx.beginPath();
        ctx.moveTo(pt[0] - 8 * cam.zoom, y);
        ctx.lineTo(pt[0] - 2 * cam.zoom, y + 3 * cam.zoom);
        ctx.lineTo(pt[0] + 6 * cam.zoom, y - 1 * cam.zoom);
        ctx.stroke();
      }
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
        if (!view.reduce) {
          const y = pt[1] - wz * TZ * cam.zoom;
          const travel = ((t / 140) + c.x * 0.3) % 1;
          ctx.strokeStyle = sour ? 'rgba(210, 200, 140, 0.45)' : 'rgba(236, 250, 248, 0.55)';
          ctx.lineWidth = 1.25;
          ctx.beginPath();
          ctx.moveTo(pt[0] - 12 * cam.zoom + travel * 16 * cam.zoom, y + Math.sin(t / 180 + c.y) * 1.5);
          ctx.lineTo(pt[0] - 2 * cam.zoom + travel * 16 * cam.zoom, y + 2);
          ctx.stroke();
          const spilling = c.building && c.building.id === 'dam' && c.water > 0.55;
          if (spilling || c.flow > 0.9) {
            ctx.fillStyle = 'rgba(255,255,255,0.55)';
            ctx.beginPath();
            ctx.ellipse(pt[0], y + 2, 8 * cam.zoom, 2.2 * cam.zoom, 0, 0, 7);
            ctx.fill();
          }
          if (sour && c.water > 0.2) {
            const by = y - ((t / 30 + hash(c.x, c.y)) % 12);
            ctx.fillStyle = 'rgba(180, 170, 90, 0.7)';
            ctx.beginPath();
            ctx.arc(pt[0] + 4 * cam.zoom, by, 1.6 * cam.zoom, 0, 7);
            ctx.fill();
          }
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
      if (marks) {
        for (let m = 0; m < marks.length; m++) {
          if (marks[m].x !== c.x || marks[m].y !== c.y) continue;
          strokeTop(ctx, pt[0], pt[1], cam.zoom, topZ + 0.02, marks[m].step ? 'rgba(214, 164, 64, 0.9)' : 'rgba(80, 160, 90, 0.75)', 1.4);
        }
      }
      if (c.tree) drawTree(ctx, pt[0], pt[1] - topZ * TZ * cam.zoom, cam.zoom, c.tree, t, run.season);
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
