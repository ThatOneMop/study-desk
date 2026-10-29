/* Winterfold — paper trail map. Original drawing, no external images. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.WinterfoldRender = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const COL = { trail: '#e08a2f', green: '#2f9d4a', blue: '#2a6fe0', red: '#d23c3c', black: '#241f1c' };
  const PINE = ['#6d7c5c', '#7e8f6c', '#5c6b4e', '#8b9a78', '#667558'];

  function hash(ix, iy, seed) {
    let n = Math.imul(ix | 0, 374761393) + Math.imul(iy | 0, 668265263) + Math.imul((seed | 0) + 3, 1442695041);
    n = Math.imul(n ^ (n >>> 13), 1274126177);
    return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
  }
  function spritePines(E) {
    const pines = [];
    for (let v = 0; v < 5; v++) {
      const c = document.createElement('canvas');
      c.width = 96; c.height = 120;
      const g = c.getContext('2d');
      g.translate(48, 108);
      g.fillStyle = 'rgba(70,80,60,0.18)';
      g.beginPath();
      g.ellipse(3, 2, 22, 8, 0, 0, 7);
      g.fill();
      g.strokeStyle = '#6a5842';
      g.lineWidth = 2;
      g.beginPath();
      g.moveTo(0, 0);
      g.lineTo(0, -18);
      g.stroke();
      for (let layer = 0; layer < 4; layer++) {
        const y = -16 - layer * 16;
        const w = 34 - layer * 6;
        g.fillStyle = PINE[(v + layer) % PINE.length];
        g.beginPath();
        g.moveTo(0, y - 18);
        const steps = 7;
        for (let k = 0; k <= steps; k++) {
          const t = k / steps;
          const j = (hash(v * 9, layer * 5 + k, 4) - 0.5) * 5;
          g.lineTo(-w / 2 + t * w + j, y + Math.sin(t * 6 + v) * 2);
        }
        g.closePath();
        g.fill();
        g.strokeStyle = 'rgba(40,48,32,0.28)';
        g.lineWidth = 1;
        g.stroke();
      }
      if (v % 2 === 0) {
        g.fillStyle = 'rgba(255,255,255,0.55)';
        g.beginPath();
        g.moveTo(0, -78);
        g.lineTo(-8, -62);
        g.lineTo(7, -64);
        g.fill();
      }
      pines.push(c);
    }
    return pines;
  }

  function createRenderer(canvas, E) {
    const pines = spritePines(E);
    let terrain = null, key = '', viewW = 1, viewH = 1, dpr = 1;
    const flakes = Array.from({ length: 70 }, (_, i) => ({
      x: hash(i, 2, 1), y: hash(i, 3, 2), s: 0.6 + hash(i, 4, 3) * 1.6, v: 0.15 + hash(i, 5, 4) * 0.35, o: 0.25 + hash(i, 6, 5) * 0.45
    }));

    function resize() {
      const r = canvas.getBoundingClientRect();
      viewW = Math.max(320, r.width);
      viewH = Math.max(240, r.height);
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(viewW * dpr);
      canvas.height = Math.round(viewH * dpr);
    }

    function project(cam, x, y) {
      return { x: (x - cam.x) * cam.zoom + viewW / 2, y: (y - cam.y) * cam.zoom + viewH / 2 };
    }
    function unproject(cam, x, y) {
      return { x: (x - viewW / 2) / cam.zoom + cam.x, y: (y - viewH / 2) / cam.zoom + cam.y };
    }

    function bake(run) {
      const sig = run.mountainId + '|' + run.cannons.map(c => c.x + ':' + c.y + ':' + c.level).join(',') + '|' + Object.keys(run.cleared).sort().join('.');
      if (terrain && key === sig) return;
      key = sig;
      const m = run.mountain;
      const gw = 200, gh = 140;
      const src = document.createElement('canvas');
      src.width = gw; src.height = gh;
      const ictx = src.getContext('2d');
      const img = ictx.createImageData(gw, gh);
      const data = img.data;
      const hx = (ix, iy) => E.height(m, (ix / (gw - 1)) * E.MAP_W, (iy / (gh - 1)) * E.MAP_H);
      for (let iy = 0; iy < gh; iy++) {
        for (let ix = 0; ix < gw; ix++) {
          const x = (ix / (gw - 1)) * E.MAP_W, y = (iy / (gh - 1)) * E.MAP_H;
          const h = hx(ix, iy);
          const hl = hx(Math.max(0, ix - 1), iy), hr = hx(Math.min(gw - 1, ix + 1), iy);
          const hd = hx(ix, Math.min(gh - 1, iy + 1)), hu = hx(ix, Math.max(0, iy - 1));
          const dx = (hr - hl) / 18, dy = (hd - hu) / 18;
          const shade = Math.max(0, Math.min(1, (dx * -0.85 + dy * -0.35 + 0.72) / 1.05));
          const snow = h >= m.snowLine || run.cannons.some(c => Math.hypot(c.x - x, c.y - y) < 78 + c.level * 36);
          const forest = E.forestAt(run, x, y);
          const rock = (m.rocks || []).some(r => Math.hypot(r.x - x, r.y - y) < r.r);
          let r, g, b;
          if (rock) { r = 150; g = 146; b = 136; }
          else if (snow) { r = 214 + shade * 36; g = 222 + shade * 28; b = 230 + shade * 18; }
          else { r = 176 + shade * 36; g = 168 + shade * 28; b = 132 + shade * 16; }
          if (forest && snow) { r -= 18; g -= 10; b -= 16; }
          else if (forest) { r -= 16; g -= 6; b -= 14; }
          const grain = (hash(ix, iy, m.seed) - 0.5) * 10;
          const light = 0.72 + shade * 0.38;
          const o = (iy * gw + ix) * 4;
          data[o] = Math.max(0, Math.min(255, r * light + grain));
          data[o + 1] = Math.max(0, Math.min(255, g * light + grain));
          data[o + 2] = Math.max(0, Math.min(255, b * light + grain * 0.6));
          data[o + 3] = 255;
        }
      }
      ictx.putImageData(img, 0, 0);
      terrain = document.createElement('canvas');
      terrain.width = 1400; terrain.height = 980;
      const tctx = terrain.getContext('2d');
      tctx.imageSmoothingEnabled = true;
      tctx.drawImage(src, 0, 0, terrain.width, terrain.height);
      const sx = terrain.width / E.MAP_W, sy = terrain.height / E.MAP_H;
      tctx.save();
      tctx.scale(sx, sy);
      tctx.lineCap = 'round';
      const step = 8;
      for (let level = 8; level < 180; level += step) {
        tctx.beginPath();
        tctx.strokeStyle = level % 40 === 0 ? 'rgba(120,110,90,0.28)' : 'rgba(140,130,112,0.16)';
        tctx.lineWidth = level % 40 === 0 ? 1.3 : 0.8;
        const cols = 90, rows = 64;
        for (let j = 0; j < rows; j++) {
          for (let i = 0; i < cols; i++) {
            const x0 = (i / cols) * E.MAP_W, y0 = (j / rows) * E.MAP_H;
            const x1 = ((i + 1) / cols) * E.MAP_W, y1 = ((j + 1) / rows) * E.MAP_H;
            const h00 = E.height(m, x0, y0), h10 = E.height(m, x1, y0), h01 = E.height(m, x0, y1), h11 = E.height(m, x1, y1);
            const pts = [];
            const edge = (xa, ya, ha, xb, yb, hb) => {
              if ((ha - level) * (hb - level) < 0) {
                const t = (level - ha) / (hb - ha);
                pts.push([xa + (xb - xa) * t, ya + (yb - ya) * t]);
              }
            };
            edge(x0, y0, h00, x1, y0, h10);
            edge(x1, y0, h10, x1, y1, h11);
            edge(x1, y1, h11, x0, y1, h01);
            edge(x0, y1, h01, x0, y0, h00);
            if (pts.length >= 2) { tctx.moveTo(pts[0][0], pts[0][1]); tctx.lineTo(pts[1][0], pts[1][1]); }
          }
        }
        tctx.stroke();
      }
      for (const river of m.rivers || []) {
        tctx.beginPath();
        river.pts.forEach((p, i) => i ? tctx.lineTo(p[0], p[1]) : tctx.moveTo(p[0], p[1]));
        tctx.strokeStyle = 'rgba(150,176,186,0.85)';
        tctx.lineWidth = (river.w || 16) * 1.6;
        tctx.stroke();
        tctx.strokeStyle = 'rgba(226,236,240,0.7)';
        tctx.lineWidth = 2;
        tctx.stroke();
      }
      for (const c of m.cliffs || []) {
        tctx.beginPath();
        tctx.arc(c.x, c.y, c.r, 0, 7);
        tctx.fillStyle = 'rgba(120,110,100,0.35)';
        tctx.fill();
      }
      const seen = new Set();
      for (let y = 12; y < E.MAP_H; y += 22) {
        for (let x = 12; x < E.MAP_W; x += 22) {
          if (!E.forestAt(run, x, y)) continue;
          if (run.pois.some(p => Math.hypot(p.x - x, p.y - y) < 28)) continue;
          const jx = x + (hash(x, y, 2) - 0.5) * 14;
          const jy = y + (hash(x, y, 3) - 0.5) * 14;
          const id = Math.floor(jx / 16) + ',' + Math.floor(jy / 16);
          if (seen.has(id)) continue;
          seen.add(id);
          const cluster = 2 + Math.floor(hash(x, y, 12) * 3);
          for (let n = 0; n < cluster; n++) {
            const s = 0.7 + hash(x + n, y, 8) * 0.55;
            const ox = (hash(x, y + n, 14) - 0.5) * 16;
            const oy = (hash(x + n, y, 15) - 0.5) * 12;
            const sprite = pines[Math.floor(hash(x, y + n, 6) * pines.length)];
            tctx.drawImage(sprite, jx + ox - 24 * s, jy + oy - 58 * s, 48 * s, 62 * s);
          }
        }
      }
      tctx.restore();
    }

    function poly(ctx, cam, pts) {
      ctx.beginPath();
      pts.forEach((p, i) => {
        const s = project(cam, p.x, p.y);
        if (i === 0) ctx.moveTo(s.x, s.y); else ctx.lineTo(s.x, s.y);
      });
    }
    function drawPiste(ctx, cam, pts, color, width, time, preview) {
      if (!pts || pts.length < 2) return;
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = 'rgba(40,36,28,0.16)';
      ctx.lineWidth = width + 5;
      poly(ctx, cam, pts.map(p => ({ x: p.x + 1.5, y: p.y + 2.2 })));
      ctx.stroke();
      ctx.strokeStyle = COL[color] || color;
      ctx.lineWidth = width;
      ctx.globalAlpha = preview ? 0.75 : 1;
      poly(ctx, cam, pts);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = 'rgba(255,255,255,0.38)';
      ctx.lineWidth = Math.max(1.5, width * 0.18);
      poly(ctx, cam, pts);
      ctx.stroke();
      ctx.restore();
      let walked = 0;
      const gap = 34;
      for (let i = 1; i < pts.length; i++) {
        const a = project(cam, pts[i - 1].x, pts[i - 1].y);
        const b = project(cam, pts[i].x, pts[i].y);
        const seg = Math.hypot(b.x - a.x, b.y - a.y);
        let t = ((Math.floor(walked / gap) + 1) * gap - walked);
        while (t < seg) {
          const u = t / seg;
          const x = a.x + (b.x - a.x) * u, y = a.y + (b.y - a.y) * u;
          const ang = Math.atan2(b.y - a.y, b.x - a.x);
          const phase = preview ? 0 : (time * 18) % gap;
          if (!preview || true) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(ang);
            ctx.strokeStyle = 'rgba(255,255,255,0.9)';
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            ctx.moveTo(-4, -3.5);
            ctx.lineTo(1, 0);
            ctx.lineTo(-4, 3.5);
            ctx.stroke();
            ctx.restore();
          }
          t += gap;
          if (phase) {}
        }
        walked += seg;
      }
    }
    function icon(ctx, kind, r) {
      ctx.beginPath();
      if (kind === 'station') ctx.rect(-r, -r, r * 2, r * 2);
      else if (kind === 'summit') { ctx.moveTo(0, -r * 1.15); ctx.lineTo(r, r * 0.85); ctx.lineTo(-r, r * 0.85); ctx.closePath(); }
      else if (kind === 'viewpoint') { ctx.moveTo(0, -r); ctx.lineTo(r, 0); ctx.lineTo(0, r); ctx.lineTo(-r, 0); ctx.closePath(); }
      else if (kind === 'rescue') { ctx.arc(0, 0, r, 0, 7); }
      else if (kind === 'snowpark') {
        for (let i = 0; i < 5; i++) {
          const a = -Math.PI / 2 + i * Math.PI * 2 / 5;
          const b = a + Math.PI / 5;
          ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
          ctx.lineTo(Math.cos(b) * r * 0.45, Math.sin(b) * r * 0.45);
        }
        ctx.closePath();
      } else if (kind === 'cafe') { ctx.arc(0, 2, r * 0.72, 0, 7); }
      else if (kind === 'restaurant') { ctx.arc(0, 0, r, 0, 7); }
      else { ctx.rect(-r * 0.8, -r * 0.2, r * 1.6, r * 1.15); }
      ctx.fill();
      ctx.stroke();
      if (kind === 'rescue') {
        ctx.beginPath();
        ctx.moveTo(0, -r * 0.55); ctx.lineTo(0, r * 0.55); ctx.moveTo(-r * 0.55, 0); ctx.lineTo(r * 0.55, 0);
        ctx.stroke();
      } else if (kind === 'cafe') {
        ctx.beginPath();
        ctx.arc(r * 0.7, 2, r * 0.32, -1.2, 1.2);
        ctx.stroke();
      } else if (kind === 'refuge') {
        ctx.beginPath();
        ctx.moveTo(-r, -r * 0.15); ctx.lineTo(0, -r * 1.05); ctx.lineTo(r, -r * 0.15);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    }
    function skierGlyph(ctx, shape) {
      ctx.beginPath();
      if (shape === 'summit') { ctx.moveTo(0, -6); ctx.lineTo(5, 4); ctx.lineTo(-5, 4); ctx.closePath(); }
      else if (shape === 'viewpoint') { ctx.moveTo(0, -5); ctx.lineTo(5, 0); ctx.lineTo(0, 5); ctx.lineTo(-5, 0); ctx.closePath(); }
      else if (shape === 'rescue') { ctx.arc(0, 0, 4.5, 0, 7); }
      else if (shape === 'snowpark') { ctx.moveTo(0, -6); ctx.lineTo(2, -1); ctx.lineTo(6, -1); ctx.lineTo(3, 2); ctx.lineTo(4, 6); ctx.lineTo(0, 3.5); ctx.lineTo(-4, 6); ctx.lineTo(-3, 2); ctx.lineTo(-6, -1); ctx.lineTo(-2, -1); ctx.closePath(); }
      else if (shape === 'cafe' || shape === 'restaurant') { ctx.arc(0, 0, 4.2, 0, 7); }
      else if (shape === 'refuge') { ctx.rect(-4, -3, 8, 7); }
      else ctx.rect(-4, -4, 8, 8);
      ctx.fill();
    }

    function frame(run, cam, extras) {
      if (!canvas.width) resize();
      bake(run);
      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, viewW, viewH);
      ctx.fillStyle = '#e6e0d2';
      ctx.fillRect(0, 0, viewW, viewH);
      const origin = project(cam, 0, 0);
      const scale = cam.zoom * (E.MAP_W / terrain.width);
      ctx.save();
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(terrain, origin.x, origin.y, terrain.width * scale, terrain.height * scale);
      ctx.restore();
      const hour = E.clockHours(run);
      const warm = hour < 10 ? 0.05 : hour > 16 ? 0.12 : 0.03;
      ctx.fillStyle = hour > 16 ? 'rgba(214,142,78,' + warm + ')' : 'rgba(170,190,210,' + warm + ')';
      ctx.fillRect(0, 0, viewW, viewH);

      for (const p of run.pistes) drawPiste(ctx, cam, p.pts, p.color, 8 + p.level * 1.4, extras.time, false);
      if (extras.ghost && extras.ghost.length > 1) drawPiste(ctx, cam, extras.ghost, extras.ghostColor || 'green', 8, extras.time, true);

      for (const l of run.lifts) {
        const a = project(cam, l.x1, l.y1), b = project(cam, l.x2, l.y2);
        ctx.strokeStyle = 'rgba(90,90,90,0.85)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
        ctx.strokeStyle = 'rgba(150,150,150,0.7)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x + 2, a.y + 2);
        ctx.lineTo(b.x + 2, b.y + 2);
        ctx.stroke();
        const n = l.type === 'cabin' ? 4 : l.type === 'chair' ? 5 : 6;
        const speed = (l.type === 'cabin' ? 0.16 : l.type === 'chair' ? 0.12 : 0.08) * (1 + l.level * 0.08);
        for (let i = 0; i < n; i++) {
          const t = ((extras.time * speed) + i / n) % 1;
          const x = a.x + (b.x - a.x) * t, y = a.y + (b.y - a.y) * t;
          ctx.save();
          ctx.translate(x, y);
          ctx.fillStyle = '#f4f1ea';
          ctx.strokeStyle = '#3c3c3c';
          ctx.lineWidth = 1;
          if (l.type === 'cabin') { ctx.fillRect(-5, -4, 10, 8); ctx.strokeRect(-5, -4, 10, 8); }
          else if (l.type === 'chair') { ctx.fillRect(-4, -2, 8, 5); ctx.strokeRect(-4, -2, 8, 5); ctx.beginPath(); ctx.moveTo(-4, -2); ctx.lineTo(0, -6); ctx.lineTo(4, -2); ctx.stroke(); }
          else { ctx.beginPath(); ctx.arc(0, 0, 3, 0, 7); ctx.fill(); ctx.stroke(); }
          ctx.restore();
        }
        const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
        ctx.fillStyle = '#f7f4ee';
        ctx.strokeStyle = '#444';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(mid.x, mid.y, 8, 0, 7);
        ctx.fill();
        ctx.stroke();
      }

      const nodes = E.nodesOf(run);
      for (const skier of run.skiers) {
        let x = 0, y = 0, known = false;
        if (skier.state === 'ski') {
          const p = run.pistes.find(pp => pp.id === skier.edge);
          if (p) {
            const d = [0];
            for (let i = 1; i < p.pts.length; i++) d.push(d[i - 1] + Math.hypot(p.pts[i].x - p.pts[i - 1].x, p.pts[i].y - p.pts[i - 1].y));
            const at = skier.t * d[d.length - 1];
            for (let i = 1; i < p.pts.length; i++) if (d[i] >= at) {
              const span = d[i] - d[i - 1] || 1, u = (at - d[i - 1]) / span;
              x = p.pts[i - 1].x + (p.pts[i].x - p.pts[i - 1].x) * u;
              y = p.pts[i - 1].y + (p.pts[i].y - p.pts[i - 1].y) * u;
              known = true;
              break;
            }
          }
        } else if (skier.state === 'ride') {
          const l = run.lifts.find(ll => ll.riders.some(r => r.id === skier.id));
          const rider = l && l.riders.find(r => r.id === skier.id);
          if (l && rider) { x = l.x1 + (l.x2 - l.x1) * rider.t; y = l.y1 + (l.y2 - l.y1) * rider.t; known = true; }
        } else if (skier.node && nodes.get(skier.node)) {
          const n = nodes.get(skier.node);
          const slot = run.skiers.filter(s => s.node === skier.node && s.state !== 'ski' && s.state !== 'ride').indexOf(skier);
          x = n.x + (slot % 5) * 7 - 14;
          y = n.y + 16 + Math.floor(slot / 5) * 8;
          known = true;
        }
        if (!known) continue;
        const s = project(cam, x, y);
        const bob = Math.sin(extras.time * 6 + x) * 0.6;
        ctx.save();
        ctx.translate(s.x, s.y + bob);
        ctx.scale(1.45, 1.45);
        ctx.strokeStyle = 'rgba(30,30,30,0.55)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(-6, 6);
        ctx.lineTo(7, 7);
        ctx.moveTo(-5, 8);
        ctx.lineTo(7, 9);
        ctx.stroke();
        ctx.fillStyle = COL[skier.skill] || '#333';
        ctx.lineWidth = 1;
        skierGlyph(ctx, skier.shape);
        ctx.restore();
      }

      for (const poi of run.pois) {
        const s = project(cam, poi.x, poi.y);
        const linked = E.connected(run, poi);
        const wants = run.skiers.some(sk => sk.shape === poi.kind) || (run.schedule || []).slice(run.spawnIndex).some(sk => sk.shape === poi.kind);
        const flash = !linked && poi.kind !== 'station' && wants;
        ctx.save();
        ctx.translate(s.x, s.y);
        if (flash) {
          ctx.globalAlpha = 0.35 + Math.sin(extras.time * 5) * 0.25;
          ctx.fillStyle = '#e0a23a';
          ctx.beginPath();
          ctx.arc(0, 0, 18, 0, 7);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
        ctx.fillStyle = '#fbfaf6';
        ctx.strokeStyle = '#2d3330';
        ctx.lineWidth = 1.6;
        ctx.shadowColor = 'rgba(40,40,30,0.18)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetY = 1;
        icon(ctx, poi.kind, 9);
        ctx.shadowColor = 'transparent';
        ctx.restore();
        ctx.fillStyle = '#4d493c';
        ctx.font = '600 11px "Iowan Old Style", Palatino, Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText(E.altitude(run, poi) + ' m', s.x, s.y + 24);
      }

      for (const c of run.cannons) {
        const s = project(cam, c.x, c.y);
        const rad = (78 + c.level * 36) * cam.zoom;
        ctx.beginPath();
        ctx.arc(s.x, s.y, rad, 0, 7);
        ctx.fillStyle = 'rgba(255,255,255,0.18)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(120,150,170,0.45)';
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#5d7380';
        ctx.fillRect(s.x - 4, s.y - 3, 8, 6);
      }

      if (!extras.reduce) {
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        for (const f of flakes) {
          f.y += f.v * 0.004;
          f.x += 0.0004;
          if (f.y > 1) f.y = 0;
          if (f.x > 1) f.x = 0;
          ctx.globalAlpha = f.o;
          ctx.fillRect(f.x * viewW, f.y * viewH, f.s, f.s);
        }
        ctx.globalAlpha = 1;
      }
    }

    return { frame, resize, project: (cam, x, y) => project(cam, x, y), unproject, invalidate() { key = ''; } };
  }

  return { createRenderer, COL };
});
