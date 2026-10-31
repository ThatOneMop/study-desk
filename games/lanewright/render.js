/* Lanewright — crisp vector city. Original drawing, no external images. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.LanewrightRender = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function createRenderer(canvas) {
    const ctx = canvas.getContext('2d');
    let dpr = 1;
    let viewW = 1;
    let viewH = 1;
    let chainRev = -1;
    let chains = [];
    const headings = new Map();
    const pops = new Map();

    function resize() {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      viewW = Math.max(1, canvas.clientWidth || 1);
      viewH = Math.max(1, canvas.clientHeight || 1);
      const w = Math.max(1, Math.round(viewW * dpr));
      const h = Math.max(1, Math.round(viewH * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function toScreen(cam, x, y) {
      return {
        x: (x - cam.x) * cam.z + viewW / 2,
        y: (y - cam.y) * cam.z + viewH / 2
      };
    }

    function screenToWorld(cam, sx, sy) {
      return {
        x: (sx - viewW / 2) / cam.z + cam.x,
        y: (sy - viewH / 2) / cam.z + cam.y
      };
    }

    function fillet(points, radius) {
      if (points.length < 3) return points.map(p => ({ x: p.x, y: p.y }));
      const out = [{ x: points[0].x, y: points[0].y }];
      for (let i = 1; i < points.length - 1; i++) {
        const a = points[i - 1];
        const b = points[i];
        const c = points[i + 1];
        const abx = a.x - b.x;
        const aby = a.y - b.y;
        const cbx = c.x - b.x;
        const cby = c.y - b.y;
        const lab = Math.hypot(abx, aby) || 1;
        const lcb = Math.hypot(cbx, cby) || 1;
        const cut = Math.min(radius, lab * 0.46, lcb * 0.46);
        out.push({ x: b.x + (abx / lab) * cut, y: b.y + (aby / lab) * cut });
        out.push({
          curve: true,
          cx: b.x,
          cy: b.y,
          x: b.x + (cbx / lcb) * cut,
          y: b.y + (cby / lcb) * cut
        });
      }
      const last = points[points.length - 1];
      out.push({ x: last.x, y: last.y });
      return out;
    }

    function chainsOf(list, kind) {
      const adj = new Map();
      list.forEach((s, i) => {
        const a = s.ax + ',' + s.ay;
        const b = s.bx + ',' + s.by;
        if (!adj.has(a)) adj.set(a, []);
        if (!adj.has(b)) adj.set(b, []);
        adj.get(a).push({ i: i, nx: s.bx, ny: s.by });
        adj.get(b).push({ i: i, nx: s.ax, ny: s.ay });
      });
      const used = new Set();
      const out = [];
      function trace(x, y) {
        const pts = [];
        let guard = 0;
        while (guard++ < 800) {
          const opts = (adj.get(x + ',' + y) || []).filter(e => !used.has(e.i));
          if (opts.length !== 1) break;
          used.add(opts[0].i);
          x = opts[0].nx;
          y = opts[0].ny;
          pts.push({ x: x, y: y });
        }
        return pts;
      }
      for (let i = 0; i < list.length; i++) {
        if (used.has(i)) continue;
        used.add(i);
        const s = list[i];
        const tail = trace(s.ax, s.ay);
        const head = trace(s.bx, s.by);
        const pts = tail.reverse().concat([{ x: s.ax, y: s.ay }, { x: s.bx, y: s.by }], head);
        if (pts.length >= 2) out.push({ kind: kind, pts: fillet(pts, 0.36) });
      }
      return out;
    }

    function rebuildChains(run) {
      if (run.graphRev === chainRev) return;
      chainRev = run.graphRev;
      const groups = { road: [], bridge: [], tunnel: [] };
      for (const s of run.segs) {
        if (groups[s.kind]) groups[s.kind].push(s);
        else groups.road.push(s);
      }
      chains = chainsOf(groups.road, 'road').concat(chainsOf(groups.bridge, 'bridge'), chainsOf(groups.tunnel, 'tunnel'));
    }

    function traceChain(cam, pts, keep) {
      if (!keep) ctx.beginPath();
      let moved = false;
      for (const p of pts) {
        if (p.curve) {
          const c = toScreen(cam, p.cx, p.cy);
          const t = toScreen(cam, p.x, p.y);
          ctx.quadraticCurveTo(c.x, c.y, t.x, t.y);
        } else {
          const s = toScreen(cam, p.x, p.y);
          if (!moved) { ctx.moveTo(s.x, s.y); moved = true; }
          else ctx.lineTo(s.x, s.y);
        }
      }
    }

    function paintChains(cam, city, list, style) {
      if (!list.length) return;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.save();
      ctx.translate(0, style.shadow || 0);
      ctx.strokeStyle = style.shadowColor || 'rgba(40,36,28,0.10)';
      ctx.lineWidth = style.wide;
      ctx.beginPath();
      for (const chain of list) traceChain(cam, chain.pts, true);
      ctx.stroke();
      ctx.restore();
      // One path per pass, so a junction never shows the kerb of the road beneath it.
      ctx.beginPath();
      for (const chain of list) traceChain(cam, chain.pts, true);
      ctx.strokeStyle = style.edge;
      ctx.lineWidth = style.wide;
      ctx.stroke();
      ctx.strokeStyle = style.fill;
      ctx.lineWidth = style.inner;
      ctx.stroke();
      if (style.dash) {
        ctx.save();
        ctx.strokeStyle = style.dash;
        ctx.lineWidth = Math.max(1, style.inner * 0.12);
        ctx.setLineDash([cam.z * 0.18, cam.z * 0.16]);
        for (const chain of list) {
          traceChain(cam, chain.pts);
          ctx.stroke();
        }
        ctx.restore();
      }
    }

    function roundedCell(cam, cx, cy, radius) {
      const p = toScreen(cam, cx, cy);
      const z = cam.z;
      const r = Math.min(radius, z / 2);
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(p.x, p.y, z, z, r);
      else ctx.rect(p.x, p.y, z, z);
    }

    function popScale(id, now, motion) {
      if (!pops.has(id)) pops.set(id, now);
      if (motion) return 1;
      const age = (now - pops.get(id)) / 1000;
      const T = 0.42;
      if (age >= T) return 1;
      const t = Math.max(0, age / T);
      const c1 = 2.4;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    }

    function pattern(id, x, y, r) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.clip();
      ctx.strokeStyle = 'rgba(255,255,255,0.78)';
      ctx.fillStyle = 'rgba(255,255,255,0.78)';
      ctx.lineWidth = Math.max(1, r * 0.08);
      if (id === 'coral') {
        for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) {
          ctx.beginPath();
          ctx.arc(x + i * r * 0.45, y + j * r * 0.45, r * 0.08, 0, 7);
          ctx.fill();
        }
      } else if (id === 'amber') {
        for (let i = -3; i <= 3; i++) {
          ctx.beginPath();
          ctx.moveTo(x - r, y + i * r * 0.28);
          ctx.lineTo(x + r, y + i * r * 0.28);
          ctx.stroke();
        }
      } else if (id === 'leaf') {
        ctx.beginPath();
        ctx.arc(x, y, r * 0.45, 0, 7);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x, y, r * 0.2, 0, 7);
        ctx.stroke();
      } else if (id === 'tide') {
        for (let i = -3; i <= 3; i++) {
          ctx.beginPath();
          ctx.moveTo(x + i * r * 0.28, y - r);
          ctx.lineTo(x + i * r * 0.28, y + r);
          ctx.stroke();
        }
      } else if (id === 'iris') {
        ctx.beginPath();
        ctx.moveTo(x - r, y);
        ctx.lineTo(x + r, y);
        ctx.moveTo(x, y - r);
        ctx.lineTo(x, y + r);
        ctx.stroke();
      } else {
        for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) {
          if ((i + j) % 2) {
            ctx.fillRect(x + i * r * 0.4 - r * 0.12, y + j * r * 0.4 - r * 0.12, r * 0.24, r * 0.24);
          }
        }
      }
      ctx.restore();
    }

    function drawBuilding(run, cam, b, opt, now) {
      const col = opt.colors[b.color] || opt.colors.coral;
      const scale = popScale(b.id + ':' + b.shape + ':' + Math.round(b.born * 8), now, opt.motion);
      const cx = b.cx + 0.5;
      const cy = b.cy + 0.5;
      const p = toScreen(cam, cx, cy);
      const z = cam.z * scale;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.fillStyle = 'rgba(40,36,28,0.14)';
      ctx.beginPath();
      ctx.ellipse(z * 0.04, z * 0.22, z * 0.34, z * 0.12, 0, 0, 7);
      ctx.fill();
      const hot = b.role === 'dest' && opt.highlight && opt.highlight.has(b.id);
      if (hot) {
        ctx.strokeStyle = 'rgba(255,255,255,0.9)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, z * 0.62, 0, 7);
        ctx.stroke();
      }
      ctx.fillStyle = col.fill;
      ctx.beginPath();
      if (b.role === 'house' || b.shape === 'circle') ctx.arc(0, 0, z * 0.47, 0, 7);
      else if (ctx.roundRect) ctx.roundRect(-z * 0.44, -z * 0.44, z * 0.88, z * 0.88, z * 0.18);
      else ctx.rect(-z * 0.44, -z * 0.44, z * 0.88, z * 0.88);
      ctx.fill();
      if (opt.colorblind) pattern(b.color, 0, 0, z * 0.3);
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      if (b.role === 'house') {
        ctx.beginPath();
        ctx.arc(-z * 0.1, -z * 0.08, z * 0.11, 0, 7);
        ctx.fill();
      } else {
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(-z * 0.2, -z * 0.2, z * 0.4, z * 0.4, z * 0.08);
        else ctx.rect(-z * 0.2, -z * 0.2, z * 0.4, z * 0.4);
        ctx.fill();
        ctx.fillStyle = b.timer > 0 ? '#9f2a22' : col.deep;
        ctx.font = '700 ' + Math.max(11, z * 0.34) + 'px "Avenir Next", "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(Math.max(0, Math.ceil(b.pins - 0.05))), 0, z * 0.02);
      }
      if (b.role === 'dest') drawPins(b, z, now, opt.motion, col);
      ctx.restore();
    }

    function drawPins(b, z, now, motion, col) {
      const n = Math.max(0, Math.min(12, Math.ceil(b.pins - 0.05)));
      if (!n && b.timer <= 0) return;
      const spread = Math.min(0.42, 0.16 + n * 0.035);
      for (let i = 0; i < n; i++) {
        const ang = -Math.PI / 2 + (i - (n - 1) / 2) * spread;
        const bob = motion ? 0 : Math.sin(now / 380 + i) * z * 0.015;
        const rad = z * 0.78 + bob;
        const x = Math.cos(ang) * rad;
        const y = Math.sin(ang) * rad;
        ctx.fillStyle = '#fffaf6';
        ctx.beginPath();
        ctx.arc(x, y, Math.max(4.5, z * 0.13), 0, 7);
        ctx.fill();
        ctx.fillStyle = b.timer > 0 ? '#c5362c' : col.fill;
        ctx.beginPath();
        ctx.arc(x, y, Math.max(3, z * 0.085), 0, 7);
        ctx.fill();
      }
      if (b.timer > 0) {
        const rad = z * 0.98;
        const pulse = motion ? 1 : 1 + Math.sin(now / 180) * 0.04 * (b.timer > 0.7 ? 1 : 0);
        ctx.strokeStyle = 'rgba(90,32,28,0.18)';
        ctx.lineWidth = Math.max(6, z * 0.16);
        ctx.beginPath();
        ctx.arc(0, 0, rad, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = b.timer > 0.72 ? '#9f1d14' : '#d64532';
        ctx.lineCap = 'round';
        ctx.lineWidth = Math.max(5, z * 0.13) * pulse;
        ctx.beginPath();
        ctx.arc(0, 0, rad, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.min(1, b.timer));
        ctx.stroke();
      }
    }

    function carPose(run, car) {
      if (car.state === 'idle' || !car.path || !car.path[car.i + 1]) {
        const house = run.buildings.find(b => b.id === car.houseId);
        if (!house) return null;
        const mates = run.cars.filter(c => c.houseId === house.id && c.state === 'idle');
        const idx = Math.max(0, mates.indexOf(car));
        return {
          x: house.cx + 0.28 + idx * 0.44,
          y: house.cy + 1.08,
          hx: 1,
          hy: 0,
          motor: false
        };
      }
      const a = car.path[car.i];
      const b = car.path[car.i + 1];
      const list = run.adj.get(a.x + ',' + a.y) || [];
      const edge = list.find(e => e.x === b.x && e.y === b.y);
      if (edge && edge.motor) {
        const m = run.motors.find(item => item.id === edge.id);
        const A = m ? { x: m.ax, y: m.ay } : a;
        const B = m ? { x: m.bx, y: m.by } : b;
        const dx = B.x - A.x;
        const dy = B.y - A.y;
        const len = Math.hypot(dx, dy) || 1;
        const bow = m ? m.bow : 0.55;
        const C = { x: (A.x + B.x) / 2 + (-dy / len) * bow, y: (A.y + B.y) / 2 + (dx / len) * bow };
        const forward = a.x === A.x && a.y === A.y;
        const t = forward ? car.t : 1 - car.t;
        const u = 1 - t;
        const x = u * u * A.x + 2 * u * t * C.x + t * t * B.x;
        const y = u * u * A.y + 2 * u * t * C.y + t * t * B.y;
        let hx = 2 * u * (C.x - A.x) + 2 * t * (B.x - C.x);
        let hy = 2 * u * (C.y - A.y) + 2 * t * (B.y - C.y);
        if (!forward) { hx = -hx; hy = -hy; }
        return { x: x, y: y, hx: hx, hy: hy, motor: true };
      }
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const len = Math.hypot(dx, dy) || 1;
      const side = 0.1;
      // Ease through corners on the same curve the road is drawn with,
      // instead of snapping heading at each grid node.
      const groundStep = (p, q) => {
        if (!p || !q) return false;
        const e = (run.adj.get(p.x + ',' + p.y) || []).find(n => n.x === q.x && n.y === q.y);
        return !!e && !e.motor;
      };
      const r = Math.min(0.32, len * 0.45);
      const d = car.t * len;
      let node = null, prev = null, next = null, s = 0;
      if (d < r && groundStep(car.path[car.i - 1], a)) {
        node = a; prev = car.path[car.i - 1]; next = b; s = 0.5 + d / (2 * r);
      } else if (len - d < r && groundStep(b, car.path[car.i + 2])) {
        node = b; prev = a; next = car.path[car.i + 2]; s = 0.5 - (len - d) / (2 * r);
      }
      if (node) {
        const ix = node.x - prev.x, iy = node.y - prev.y, il = Math.hypot(ix, iy) || 1;
        const ox = next.x - node.x, oy = next.y - node.y, ol = Math.hypot(ox, oy) || 1;
        const dot = (ix / il) * (ox / ol) + (iy / il) * (oy / ol);
        if (dot < -0.2) {
          const turn = 0.32;
          const sAng = Math.atan2(-ix / il, iy / il);
          let eAng = Math.atan2(-ox / ol, oy / ol);
          let sweep = eAng - sAng;
          while (sweep > Math.PI) sweep -= Math.PI * 2;
          while (sweep < -Math.PI) sweep += Math.PI * 2;
          if (Math.abs(sweep) < 0.8) sweep = sweep >= 0 ? Math.PI : -Math.PI;
          const ang = sAng + sweep * s;
          const x = node.x + Math.cos(ang) * turn;
          const y = node.y + Math.sin(ang) * turn;
          const hx = -Math.sin(ang) * Math.sign(sweep || 1);
          const hy = Math.cos(ang) * Math.sign(sweep || 1);
          return { x: x, y: y, hx: hx, hy: hy, motor: false };
        }
        if (Math.abs(ix / il - ox / ol) + Math.abs(iy / il - oy / ol) > 0.01) {
          const ri = Math.min(r, il * 0.45), ro = Math.min(r, ol * 0.45);
          const P0 = { x: node.x - ix / il * ri, y: node.y - iy / il * ri };
          const P2 = { x: node.x + ox / ol * ro, y: node.y + oy / ol * ro };
          const u = 1 - s;
          const x = u * u * P0.x + 2 * u * s * node.x + s * s * P2.x;
          const y = u * u * P0.y + 2 * u * s * node.y + s * s * P2.y;
          const hx = 2 * u * (node.x - P0.x) + 2 * s * (P2.x - node.x);
          const hy = 2 * u * (node.y - P0.y) + 2 * s * (P2.y - node.y);
          const hl = Math.hypot(hx, hy) || 1;
          return { x: x + (-hy / hl) * side, y: y + (hx / hl) * side, hx: hx, hy: hy, motor: false };
        }
      }
      return {
        x: a.x + dx * car.t + (-dy / len) * side,
        y: a.y + dy * car.t + (dx / len) * side,
        hx: dx,
        hy: dy,
        motor: false
      };
    }

    function drawCar(run, cam, car, opt, now) {
      const pose = carPose(run, car);
      if (!pose) return;
      const target = Math.atan2(pose.hy, pose.hx);
      let h = headings.has(car.id) ? headings.get(car.id) : target;
      let d = target - h;
      while (d > Math.PI) d -= Math.PI * 2;
      while (d < -Math.PI) d += Math.PI * 2;
      h += d * (opt.motion ? 1 : 0.38);
      headings.set(car.id, h);
      const p = toScreen(cam, pose.x, pose.y);
      const col = opt.colors[car.color] || opt.colors.coral;
      const w = cam.z * 0.5;
      const hgt = cam.z * 0.28;
      ctx.save();
      ctx.translate(p.x, p.y + cam.z * 0.03);
      ctx.fillStyle = 'rgba(40,36,28,0.16)';
      ctx.beginPath();
      ctx.ellipse(0, hgt * 0.2, w * 0.42, hgt * 0.28, 0, 0, 7);
      ctx.fill();
      ctx.rotate(h);
      ctx.fillStyle = col.fill;
      ctx.strokeStyle = col.deep;
      ctx.lineWidth = Math.max(1, cam.z * 0.03);
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(-w / 2, -hgt / 2, w, hgt, hgt * 0.45);
      else ctx.rect(-w / 2, -hgt / 2, w, hgt);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.92)';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(w * 0.02, -hgt * 0.28, w * 0.28, hgt * 0.56, 2);
      else ctx.fillRect(w * 0.02, -hgt * 0.28, w * 0.28, hgt * 0.56);
      ctx.fill();
      if (opt.colorblind) {
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.fillRect(-w * 0.28, -1, 3, 2);
      }
      ctx.restore();
    }

    function motorCurve(m) {
      const dx = m.bx - m.ax;
      const dy = m.by - m.ay;
      const len = Math.hypot(dx, dy) || 1;
      return {
        ax: m.ax,
        ay: m.ay,
        bx: m.bx,
        by: m.by,
        cx: (m.ax + m.bx) / 2 + (-dy / len) * m.bow,
        cy: (m.ay + m.by) / 2 + (dx / len) * m.bow
      };
    }

    function drawMotor(cam, m) {
      const c = motorCurve(m);
      const z = cam.z;
      const A = toScreen(cam, c.ax, c.ay);
      const B = toScreen(cam, c.bx, c.by);
      const C = toScreen(cam, c.cx, c.cy);
      function ramp(end, toward) {
        const dx = toward.x - end.x;
        const dy = toward.y - end.y;
        const len = Math.hypot(dx, dy) || 1;
        const ux = dx / len;
        const uy = dy / len;
        const px = -uy;
        const py = ux;
        const tip = toScreen(cam, end.x, end.y);
        const base = toScreen(cam, end.x + ux * 0.7, end.y + uy * 0.7);
        ctx.fillStyle = '#d5dde2';
        ctx.beginPath();
        ctx.moveTo(tip.x + px * z * 0.16, tip.y + py * z * 0.16);
        ctx.lineTo(tip.x - px * z * 0.16, tip.y - py * z * 0.16);
        ctx.lineTo(base.x - px * z * 0.28, base.y - py * z * 0.28);
        ctx.lineTo(base.x + px * z * 0.28, base.y + py * z * 0.28);
        ctx.closePath();
        ctx.fill();
      }
      ramp({ x: c.ax, y: c.ay }, { x: c.cx, y: c.cy });
      ramp({ x: c.bx, y: c.by }, { x: c.cx, y: c.cy });
      ctx.save();
      ctx.lineCap = 'round';
      ctx.translate(0, z * 0.14);
      ctx.strokeStyle = 'rgba(30,36,40,0.22)';
      ctx.lineWidth = z * 0.42;
      ctx.beginPath();
      ctx.moveTo(A.x, A.y);
      ctx.quadraticCurveTo(C.x, C.y, B.x, B.y);
      ctx.stroke();
      ctx.restore();
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#2c3a42';
      ctx.lineWidth = z * 0.4;
      ctx.beginPath();
      ctx.moveTo(A.x, A.y);
      ctx.quadraticCurveTo(C.x, C.y, B.x, B.y);
      ctx.stroke();
      ctx.strokeStyle = '#8ea3ae';
      ctx.lineWidth = z * 0.22;
      ctx.beginPath();
      ctx.moveTo(A.x, A.y);
      ctx.quadraticCurveTo(C.x, C.y, B.x, B.y);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,0.8)';
      ctx.lineWidth = Math.max(1.5, z * 0.035);
      ctx.setLineDash([z * 0.16, z * 0.14]);
      ctx.beginPath();
      ctx.moveTo(A.x, A.y);
      ctx.quadraticCurveTo(C.x, C.y, B.x, B.y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#243038';
      for (const t of [0.35, 0.65]) {
        const u = 1 - t;
        const x = u * u * c.ax + 2 * u * t * c.cx + t * t * c.bx;
        const y = u * u * c.ay + 2 * u * t * c.cy + t * t * c.by;
        const p = toScreen(cam, x, y + 0.12);
        ctx.fillRect(p.x - z * 0.04, p.y, z * 0.08, z * 0.16);
      }
    }

    function drawDriveways(run, cam, city) {
      const z = cam.z;
      const path = new Path2D();
      let any = false;
      for (const b of run.buildings) {
        const corners = [[b.cx, b.cy], [b.cx + 1, b.cy], [b.cx + 1, b.cy + 1], [b.cx, b.cy + 1]];
        const cx = b.cx + 0.5;
        const cy = b.cy + 0.5;
        for (const corner of corners) {
          const list = run.adj.get(corner[0] + ',' + corner[1]);
          if (!list || !list.length) continue;
          const dx = cx - corner[0];
          const dy = cy - corner[1];
          const len = Math.hypot(dx, dy) || 1;
          const endx = cx - (dx / len) * 0.52;
          const endy = cy - (dy / len) * 0.52;
          const a = toScreen(cam, corner[0], corner[1]);
          const end = toScreen(cam, endx, endy);
          path.moveTo(a.x, a.y);
          path.lineTo(end.x, end.y);
          any = true;
        }
      }
      if (!any) return;
      ctx.lineCap = 'round';
      ctx.strokeStyle = city.roadEdge;
      ctx.lineWidth = z * 0.42;
      ctx.stroke(path);
      ctx.strokeStyle = city.road;
      ctx.lineWidth = z * 0.28;
      ctx.stroke(path);
    }

    // Terrain as one soft shape: a cell rounds each corner where open ground
    // meets it on both sides, so rivers and hills read as blobs, not tiles.
    function blob(cam, city, kind, color, inset, alpha) {
      const z = cam.z;
      const at = (x, y) => x >= 0 && y >= 0 && x < city.cols && y < city.rows && city.terrain[y][x] === kind;
      const r = z * 0.45;
      const pad = z * (inset || 0);
      ctx.fillStyle = color;
      if (alpha) ctx.globalAlpha = alpha;
      ctx.beginPath();
      for (let y = 0; y < city.rows; y++) {
        for (let x = 0; x < city.cols; x++) {
          if (!at(x, y)) continue;
          const n = at(x, y - 1), so = at(x, y + 1), w = at(x - 1, y), e = at(x + 1, y);
          const l = w ? 0 : pad, t = n ? 0 : pad, rr = e ? 0 : pad, b = so ? 0 : pad;
          const p = toScreen(cam, x, y);
          const X = p.x + l - (w ? 0.5 : 0), Y = p.y + t - (n ? 0.5 : 0);
          const W = z - l - rr + (w ? 0.5 : 0) + (e ? 0.5 : 0), H = z - t - b + (n ? 0.5 : 0) + (so ? 0.5 : 0);
          if (W <= 0 || H <= 0) continue;
          const nw = at(x - 1, y - 1), ne = at(x + 1, y - 1), sw = at(x - 1, y + 1), se = at(x + 1, y + 1);
          const inner = r * 0.92;
          const rad = [
            (!n && !w) || (n && w && !nw) ? ((!n && !w) ? r : inner) : 0,
            (!n && !e) || (n && e && !ne) ? ((!n && !e) ? r : inner) : 0,
            (!so && !e) || (so && e && !se) ? ((!so && !e) ? r : inner) : 0,
            (!so && !w) || (so && w && !sw) ? ((!so && !w) ? r : inner) : 0
          ].map(v => Math.min(v, W / 2, H / 2));
          if (ctx.roundRect) ctx.roundRect(X, Y, W, H, rad);
          else ctx.rect(X, Y, W, H);
        }
      }
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    function draw(run, cam, preview, opt) {
      resize();
      const now = opt.now || 0;
      const city = run.city;
      const z = cam.z;
      ctx.clearRect(0, 0, viewW, viewH);
      ctx.fillStyle = city.ground;
      ctx.fillRect(0, 0, viewW, viewH);
      // The map itself is a shade deeper than the margin, so pale roads read.
      const m0 = toScreen(cam, 0, 0);
      ctx.fillStyle = city.ground2;
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(m0.x, m0.y, city.cols * z, city.rows * z, z * 0.6);
      else ctx.rect(m0.x, m0.y, city.cols * z, city.rows * z);
      ctx.fill();
      ctx.globalAlpha = 1;
      const wash = ctx.createRadialGradient(viewW * 0.5, viewH * 0.4, z, viewW * 0.5, viewH * 0.5, Math.max(viewW, viewH) * 0.7);
      wash.addColorStop(0, 'rgba(255,255,255,0.28)');
      wash.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = wash;
      ctx.fillRect(0, 0, viewW, viewH);

      blob(cam, city, 'water', city.water, 0);
      blob(cam, city, 'water', city.waterDeep, 0.2, 0.28);
      if (!opt.motion) {
        ctx.fillStyle = city.waterDeep;
        ctx.globalAlpha = 0.22;
        const shift = Math.floor(now / 700) % 7;
        for (let y = 0; y < city.rows; y++) {
          for (let x = 0; x < city.cols; x++) {
            if (city.terrain[y][x] !== 'water') continue;
            if ((x * 3 + y * 5 + shift) % 7 !== 0) continue;
            const p = toScreen(cam, x + 0.18, y + 0.22);
            ctx.beginPath();
            ctx.ellipse(p.x, p.y, z * 0.28, z * 0.1, -0.4, 0, 7);
            ctx.fill();
          }
        }
        ctx.globalAlpha = 1;
      }

      blob(cam, city, 'mountain', city.mountainLight, 0);
      blob(cam, city, 'mountain', city.mountain, 0.16);
      for (let y = 0; y < city.rows; y++) {
        for (let x = 0; x < city.cols; x++) {
          if (city.terrain[y][x] !== 'mountain') continue;
          if ((x * 7 + y * 3) % 4 !== 0) continue;
          const p = toScreen(cam, x + 0.5, y + 0.62);
          ctx.fillStyle = city.mountainLight;
          ctx.beginPath();
          ctx.moveTo(p.x - z * 0.3, p.y + z * 0.12);
          ctx.quadraticCurveTo(p.x - z * 0.06, p.y - z * 0.5, p.x, p.y - z * 0.5);
          ctx.quadraticCurveTo(p.x + z * 0.06, p.y - z * 0.5, p.x + z * 0.3, p.y + z * 0.12);
          ctx.closePath();
          ctx.globalAlpha = 0.75;
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }

      if (z > 22) {
        ctx.fillStyle = 'rgba(44,51,48,0.14)';
        for (let y = 0; y <= city.rows; y++) {
          for (let x = 0; x <= city.cols; x++) {
            const p = toScreen(cam, x, y);
            ctx.fillRect(p.x - 0.7, p.y - 0.7, 1.4, 1.4);
          }
        }
      }

      rebuildChains(run);
      const roads = chains.filter(c => c.kind === 'road');
      const bridges = chains.filter(c => c.kind === 'bridge');
      const tunnels = chains.filter(c => c.kind === 'tunnel');
      drawDriveways(run, cam, city);
      paintChains(cam, city, roads, {
        wide: z * 0.42,
        inner: z * 0.3,
        edge: city.roadEdge,
        fill: city.road,
        dash: 'rgba(255,255,255,0.75)',
        shadow: z * 0.05
      });
      paintChains(cam, city, bridges, {
        wide: z * 0.36,
        inner: z * 0.24,
        edge: '#8aa8b4',
        fill: '#f7fbff',
        dash: 'rgba(90,120,130,0.35)',
        shadow: z * 0.1,
        shadowColor: 'rgba(40,60,70,0.16)'
      });
      paintChains(cam, city, tunnels, {
        wide: z * 0.34,
        inner: z * 0.2,
        edge: '#6d645c',
        fill: '#b7aea4',
        dash: 'rgba(255,255,255,0.25)',
        shadow: z * 0.02
      });

      for (const r of run.rounds) {
        const p = toScreen(cam, r.x, r.y);
        const rad = z * 0.46;
        ctx.strokeStyle = city.roadEdge;
        ctx.lineWidth = z * 0.42;
        ctx.beginPath();
        ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = city.road;
        ctx.lineWidth = z * 0.3;
        ctx.stroke();
        ctx.fillStyle = city.ground2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, rad - z * 0.21, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = city.roadEdge;
        ctx.lineWidth = Math.max(1, z * 0.04);
        ctx.stroke();
        ctx.fillStyle = '#9fbf8f';
        ctx.beginPath();
        ctx.arc(p.x, p.y, z * 0.12, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const b of run.buildings) drawBuilding(run, cam, b, opt, now);

      const groundCars = [];
      const skyCars = [];
      for (const car of run.cars) {
        const pose = carPose(run, car);
        if (pose && pose.motor) skyCars.push(car);
        else groundCars.push(car);
      }
      for (const car of groundCars) drawCar(run, cam, car, opt, now);
      for (const m of run.motors) drawMotor(cam, m);
      for (const car of skyCars) drawCar(run, cam, car, opt, now);

      for (const light of run.lights) {
        const p = toScreen(cam, light.x, light.y);
        const phase = Math.floor(run.time / 3.4) % 2;
        ctx.fillStyle = '#2c3330';
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(5, z * 0.12), 0, 7);
        ctx.fill();
        ctx.fillStyle = phase === 0 ? '#d4e07a' : '#3d4a40';
        ctx.fillRect(p.x - z * 0.08, p.y - z * 0.03, z * 0.16, z * 0.045);
        ctx.fillStyle = phase === 1 ? '#d4e07a' : '#3d4a40';
        ctx.fillRect(p.x - z * 0.02, p.y - z * 0.09, z * 0.045, z * 0.18);
      }

      if (preview && preview.segs) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.setLineDash([z * 0.16, z * 0.12]);
        ctx.lineWidth = z * 0.28;
        for (const s of preview.segs) {
          if (s.kind === 'have') continue;
          const a = toScreen(cam, s.ax, s.ay);
          const b = toScreen(cam, s.bx, s.by);
          ctx.strokeStyle = s.bad ? 'rgba(198,70,58,0.85)' : 'rgba(46,122,86,0.8)';
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
        ctx.setLineDash([]);
      }
      if (preview && preview.motor) {
        const m = preview.motor;
        ctx.setLineDash([z * 0.14, z * 0.1]);
        ctx.strokeStyle = m.bad ? 'rgba(198,70,58,0.85)' : 'rgba(60,90,100,0.8)';
        ctx.lineWidth = z * 0.16;
        const A = toScreen(cam, m.ax, m.ay);
        const B = toScreen(cam, m.bx, m.by);
        const C = toScreen(cam, m.cx, m.cy);
        ctx.beginPath();
        ctx.moveTo(A.x, A.y);
        ctx.quadraticCurveTo(C.x, C.y, B.x, B.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      ctx.font = '600 ' + Math.max(12, z * 0.28) + 'px "Avenir Next", "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      for (const f of run.floaters) {
        const p = toScreen(cam, f.x, f.y - f.age * 0.4);
        ctx.globalAlpha = Math.max(0, 1 - f.age / 0.9);
        ctx.fillStyle = city.ink;
        ctx.fillText(f.text, p.x, p.y);
      }
      ctx.globalAlpha = 1;
    }

    return {
      resize: resize,
      draw: draw,
      screenToWorld: screenToWorld,
      toScreen: toScreen,
      carPose: carPose,
      view: () => ({ w: viewW, h: viewH })
    };
  }

  return { createRenderer: createRenderer };
});
