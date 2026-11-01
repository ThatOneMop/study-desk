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
    let terrain = null, key = '', bakedPpm = 1, lastBake = -1, viewW = 1, viewH = 1, dpr = 1;
    const paper = document.createElement('canvas');
    paper.width = 128; paper.height = 128;
    const pg = paper.getContext('2d');
    pg.fillStyle = '#f3efe6';
    pg.fillRect(0, 0, 128, 128);
    for (let i = 0; i < 900; i++) {
      const x = hash(i, 1, 8) * 128, y = hash(i, 2, 8) * 128;
      pg.fillStyle = hash(i, 3, 8) > 0.5 ? 'rgba(90,80,60,0.16)' : 'rgba(255,255,255,0.2)';
      pg.fillRect(x, y, 1, 1);
    }
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

    function drawStones(ctx, cx, cy, radius, count, fill, stroke, ppm) {
      for (let s = 0; s < count; s++) {
        const ang = hash(Math.round(cx), s, 30) * Math.PI * 2;
        const dist = hash(s, Math.round(cy), 31) * radius * 0.55;
        const sx = cx + Math.cos(ang) * dist;
        const sy = cy + Math.sin(ang) * dist * 0.75;
        const sr = radius * (0.28 + hash(s, 4, 32) * 0.35);
        ctx.beginPath();
        for (let k = 0; k < 7; k++) {
          const a = (k / 7) * Math.PI * 2 + 0.2;
          const j = 0.72 + hash(s, k, 33) * 0.45;
          const px = sx + Math.cos(a) * sr * j;
          const py = sy + Math.sin(a) * sr * j * 0.78;
          if (k) ctx.lineTo(px, py); else ctx.moveTo(px, py);
        }
        ctx.closePath();
        ctx.fillStyle = fill;
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 1.6 / ppm;
        ctx.fill();
        ctx.stroke();
      }
    }
    function contentKey(run) {
      return run.mountainId + '|' + run.cannons.map(c => c.x + ':' + c.y + ':' + c.level).join(',') + '|' + Object.keys(run.cleared).sort().join('.');
    }
    function bake(run, ppm) {
      const sig = contentKey(run);
      key = sig;
      bakedPpm = ppm;
      const m = run.mountain;
      const gw = 360, gh = 252;
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
          const shade = Math.max(0, Math.min(1, (dx * -1.15 + dy * -0.42 + 0.62) / 0.95));
          const snow = h >= m.snowLine || run.cannons.some(c => Math.hypot(c.x - x, c.y - y) < 78 + c.level * 36);
          const mottled = hash(ix >> 1, iy >> 1, m.seed + 21);
          let r, g, b;
          if (snow) {
            r = 168 + shade * 84; g = 178 + shade * 70; b = 188 + shade * 52;
            if (shade < 0.45) { r -= 18; g -= 10; b -= 4; }
            if (h < (m.snowLine || 0) + 22) { r -= 8 + mottled * 10; g -= 4; b += 6; }
          } else {
            r = 124 + shade * 70 + mottled * 24;
            g = 118 + shade * 52 + mottled * 14;
            b = 90 + shade * 28;
          }
          const grain = (hash(ix, iy, m.seed) - 0.5) * 14;
          const light = 0.32 + shade * 0.95;
          const o = (iy * gw + ix) * 4;
          data[o] = Math.max(0, Math.min(255, r * light + grain));
          data[o + 1] = Math.max(0, Math.min(255, g * light + grain));
          data[o + 2] = Math.max(0, Math.min(255, b * light + grain * 0.6));
          data[o + 3] = 255;
        }
      }
      ictx.putImageData(img, 0, 0);
      const tw = Math.max(900, Math.round(E.MAP_W * ppm));
      const th = Math.max(630, Math.round(E.MAP_H * ppm));
      terrain = document.createElement('canvas');
      terrain.width = tw; terrain.height = th;
      const tctx = terrain.getContext('2d');
      tctx.imageSmoothingEnabled = true;
      tctx.imageSmoothingQuality = 'high';
      tctx.drawImage(src, 0, 0, tw, th);
      tctx.globalCompositeOperation = 'multiply';
      tctx.globalAlpha = 0.28;
      tctx.fillStyle = tctx.createPattern(paper, 'repeat');
      tctx.fillRect(0, 0, tw, th);
      tctx.globalCompositeOperation = 'source-over';
      tctx.globalAlpha = 1;
      const sx = tw / E.MAP_W, sy = th / E.MAP_H;
      tctx.save();
      tctx.scale(sx, sy);
      tctx.lineCap = 'round';
      const step = 6;
      for (let level = 6; level < 200; level += step) {
        tctx.beginPath();
        tctx.strokeStyle = level % 30 === 0 ? 'rgba(92,84,70,0.45)' : 'rgba(120,112,98,0.22)';
        tctx.lineWidth = (level % 30 === 0 ? 1.35 : 0.75) / sx;
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
      for (const c of m.cliffs || []) drawStones(tctx, c.x, c.y, c.r, 7, '#8d877c', '#3e3a34', sx);
      for (const rock of m.rocks || []) drawStones(tctx, rock.x, rock.y, rock.r, 5, '#c8c2b6', '#4a463e', sx);
      const seen = new Set();
      const stepTrees = m.id === 'lark' ? 24 : 20;
      for (let y = 12; y < E.MAP_H; y += stepTrees) {
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
            const s = 18 + hash(x + n, y, 8) * 14;
            const ox = (hash(x, y + n, 14) - 0.5) * 10;
            const oy = (hash(x + n, y, 15) - 0.5) * 8;
            const sprite = pines[Math.floor(hash(x, y + n, 6) * pines.length)];
            tctx.drawImage(sprite, jx + ox - s * 0.5, jy + oy - s * 1.2, s, s * 1.35);
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
    function drawCable(ctx, a, b, type, time, preview, riders) {
      ctx.save();
      ctx.lineCap = 'round';
      ctx.strokeStyle = preview ? 'rgba(70,74,78,0.55)' : '#5c6166';
      ctx.lineWidth = preview ? 4 : 5.5;
      ctx.setLineDash(preview ? [8, 6] : []);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.strokeStyle = 'rgba(255,255,255,0.35)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
      const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
      const ux = dx / len, uy = dy / len;
      if (!preview) {
        const towers = Math.max(2, Math.min(6, Math.round(len / 90)));
        for (let i = 1; i < towers; i++) {
          const t = i / towers;
          const x = a.x + dx * t, y = a.y + dy * t;
          ctx.strokeStyle = '#3a3e42';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x - uy * 7, y + ux * 7 + 8);
          ctx.lineTo(x, y);
          ctx.lineTo(x + uy * 7, y - ux * 7 + 8);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(x - uy * 5, y + ux * 5);
          ctx.lineTo(x + uy * 5, y - ux * 5);
          ctx.stroke();
        }
      }
      const n = type === 'cabin' ? 4 : type === 'chair' ? 5 : 6;
      const speed = (type === 'cabin' ? 0.16 : type === 'chair' ? 0.12 : 0.09);
      const used = new Set();
      for (let i = 0; i < n; i++) {
        const t = ((time * speed) + i / n) % 1;
        const x = a.x + dx * t, y = a.y + dy * t;
        let person = null;
        riders.forEach((r, idx) => {
          if (used.has(idx) || person) return;
          const dt = Math.min(Math.abs(r.t - t), 1 - Math.abs(r.t - t));
          if (dt < 0.55 / n) { person = r; used.add(idx); }
        });
        drawBadge(ctx, x, y, type, person);
      }
      riders.forEach((r, idx) => {
        if (used.has(idx)) return;
        drawBadge(ctx, a.x + dx * r.t, a.y + dy * r.t, type, r);
      });
      ctx.restore();
    }
    function drawBadge(ctx, x, y, type, person) {
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = '#f7f4ee';
      ctx.strokeStyle = '#24282b';
      ctx.lineWidth = 1.7;
      ctx.beginPath();
      ctx.arc(0, 0, type === 'cabin' ? 9 : 7.5, 0, 7);
      ctx.fill();
      ctx.stroke();
      if (person) {
        ctx.fillStyle = COL[person.skill] || '#333';
        ctx.beginPath();
        ctx.arc(0, -1, 2.2, 0, 7);
        ctx.fill();
        ctx.fillRect(-2.2, 1.2, 4.4, 3.2);
      } else if (type === 'cabin') {
        ctx.strokeRect(-3, -3, 6, 5);
      } else if (type === 'tow') {
        ctx.beginPath();
        ctx.arc(0, 0, 2.4, 0, 7);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(-3, 2);
        ctx.lineTo(0, -2);
        ctx.lineTo(3, 2);
        ctx.stroke();
      }
      ctx.restore();
    }
    function drawSkier(ctx, x, y, skier, time, angle) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle || 0);
      const bob = Math.sin(time * 8 + x) * 1.1;
      ctx.translate(0, bob);
      ctx.fillStyle = 'rgba(40,40,30,0.18)';
      ctx.beginPath();
      ctx.ellipse(0, 8, 7, 2.4, 0, 0, 7);
      ctx.fill();
      ctx.strokeStyle = '#2a2a2a';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(-8, 7);
      ctx.lineTo(9, 9);
      ctx.moveTo(-7, 9);
      ctx.lineTo(9, 11);
      ctx.stroke();
      ctx.fillStyle = COL[skier.skill] || '#355';
      ctx.strokeStyle = 'rgba(20,20,20,0.55)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(-4.5, -2, 9, 8, 2) : ctx.rect(-4.5, -2, 9, 8);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#f3d2b0';
      ctx.beginPath();
      ctx.arc(0, -5, 3.1, 0, 7);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.strokeStyle = '#1c2420';
      ctx.lineWidth = 1.1;
      ctx.save();
      ctx.translate(0, -12);
      ctx.scale(0.7, 0.7);
      skierGlyph(ctx, skier.shape);
      ctx.restore();
      ctx.restore();
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
      const want = Math.max(1.35, Math.min((cam.zoom || 1) * dpr, 3));
      const sig = contentKey(run);
      const zoomStale = !terrain || Math.abs(want - bakedPpm) / bakedPpm > 0.12;
      if (!terrain || key !== sig || (zoomStale && extras.time - lastBake > 0.22)) {
        bake(run, want);
        lastBake = extras.time;
      }
      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, viewW, viewH);
      ctx.fillStyle = '#e4dece';
      ctx.fillRect(0, 0, viewW, viewH);
      const origin = project(cam, 0, 0);
      const drawW = terrain.width * (cam.zoom / bakedPpm);
      const drawH = terrain.height * (cam.zoom / bakedPpm);
      ctx.save();
      ctx.imageSmoothingEnabled = Math.abs(cam.zoom * dpr - bakedPpm) > 0.25;
      ctx.drawImage(terrain, origin.x, origin.y, drawW, drawH);
      ctx.restore();
      const hour = E.clockHours(run);
      const warm = hour < 10 ? 0.05 : hour > 16 ? 0.12 : 0.03;
      ctx.fillStyle = hour > 16 ? 'rgba(214,142,78,' + warm + ')' : 'rgba(170,190,210,' + warm + ')';
      ctx.fillRect(0, 0, viewW, viewH);

      for (const p of run.pistes) drawPiste(ctx, cam, p.pts, p.color, 8 + p.level * 1.4, extras.time, false);
      if (extras.ghost && extras.ghost.length > 1) drawPiste(ctx, cam, extras.ghost, extras.ghostColor || 'green', 8, extras.time, true);
      if (extras.liftGhost && extras.liftGhost.length > 1) {
        const a = extras.liftGhost[0], b = extras.liftGhost[extras.liftGhost.length - 1];
        drawCable(ctx, project(cam, a.x, a.y), project(cam, b.x, b.y), 'chair', extras.time, true, []);
      }

      for (const l of run.lifts) {
        drawCable(ctx, project(cam, l.x1, l.y1), project(cam, l.x2, l.y2), l.type, extras.time, false, l.riders.map(r => {
          const skier = run.skiers.find(s => s.id === r.id);
          return skier ? { t: r.t, skill: skier.skill, shape: skier.shape } : null;
        }).filter(Boolean));
      }

      const nodes = E.nodesOf(run);
      const queueIndex = new Map();
      for (const skier of run.skiers) {
        if (skier.state === 'ride') continue;
        let x = 0, y = 0, angle = 0, known = false;
        if (skier.state === 'ski') {
          const p = run.pistes.find(pp => pp.id === skier.edge);
          if (p) {
            const d = [0];
            for (let i = 1; i < p.pts.length; i++) d.push(d[i - 1] + Math.hypot(p.pts[i].x - p.pts[i - 1].x, p.pts[i].y - p.pts[i - 1].y));
            const at = Math.min(1, skier.t) * d[d.length - 1];
            for (let i = 1; i < p.pts.length; i++) if (d[i] >= at) {
              const span = d[i] - d[i - 1] || 1, u = (at - d[i - 1]) / span;
              x = p.pts[i - 1].x + (p.pts[i].x - p.pts[i - 1].x) * u;
              y = p.pts[i - 1].y + (p.pts[i].y - p.pts[i - 1].y) * u;
              angle = Math.atan2(p.pts[i].y - p.pts[i - 1].y, p.pts[i].x - p.pts[i - 1].x);
              known = true;
              break;
            }
          }
        } else if (skier.state === 'queue') {
          const lift = run.lifts.find(l => l.queue.includes(skier.id));
          if (lift) {
            const slot = lift.queue.indexOf(skier.id);
            const dx = lift.x1 - lift.x2, dy = lift.y1 - lift.y2;
            const len = Math.hypot(dx, dy) || 1;
            const ux = dx / len, uy = dy / len, px = -uy, py = ux;
            const col = slot % 3, row = Math.floor(slot / 3);
            x = lift.x1 + ux * (16 + row * 13) + px * (col - 1) * 11;
            y = lift.y1 + uy * (16 + row * 13) + py * (col - 1) * 11;
            angle = Math.atan2(uy, ux);
            known = true;
          }
        }
        if (!known && skier.node && nodes.get(skier.node)) {
          const n = nodes.get(skier.node);
          const slot = queueIndex.get(skier.node) || 0;
          queueIndex.set(skier.node, slot + 1);
          x = n.x + (slot % 4) * 12 - 18;
          y = n.y + 22 + Math.floor(slot / 4) * 14;
          known = true;
        }
        if (!known) continue;
        const s = project(cam, x, y);
        drawSkier(ctx, s.x, s.y, skier, extras.time, angle);
      }

      for (const poi of run.pois) {
        const s = project(cam, poi.x, poi.y);
        const linked = E.connected(run, poi);
        const fresh = poi.born === run.day && run.day > 1 && poi.kind !== 'station';
        const wants = !linked && poi.kind !== 'station' && (fresh || run.skiers.some(sk => sk.shape === poi.kind) || (run.schedule || []).slice(run.spawnIndex).some(sk => sk.shape === poi.kind));
        ctx.save();
        ctx.translate(s.x, s.y);
        if (wants) {
          const pulse = 0.5 + Math.sin(extras.time * 4) * 0.5;
          ctx.strokeStyle = '#e07a2f';
          ctx.lineWidth = 2.5;
          ctx.globalAlpha = 0.35 + pulse * 0.55;
          ctx.beginPath();
          ctx.arc(0, 0, 22 + pulse * 7, 0, 7);
          ctx.stroke();
          ctx.globalAlpha = 0.85;
          ctx.setLineDash([4, 4]);
          ctx.lineDashOffset = -extras.time * 18;
          ctx.beginPath();
          ctx.arc(0, 0, 16, 0, 7);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.globalAlpha = 1;
        }
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#1b2420';
        ctx.lineWidth = 2.6;
        ctx.shadowColor = 'rgba(20,24,20,0.28)';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetY = 2;
        icon(ctx, poi.kind, 15);
        ctx.shadowColor = 'transparent';
        ctx.restore();
        ctx.fillStyle = '#2c2922';
        ctx.font = '700 13px "Iowan Old Style", Palatino, Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText(E.altitude(run, poi) + ' m', s.x, s.y + 32);
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
