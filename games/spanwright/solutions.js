'use strict';
/*
 * Reference spans for Spanwright. Each contract has one build that should
 * clear, and a flat road that should not (except the opening plank).
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SpanSolutions = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const HEAVY = { hopper: true, cistern: true };

  function place(E, session, mat, x0, y0, x1, y1, opt) {
    const hit = E.placeBeam(session, mat, x0, y0, x1, y1, opt || {});
    if (!hit.ok) {
      const err = new Error((hit.reason || 'place') + ' ' + mat + ' ' + [x0, y0, x1, y1].join(','));
      err.hit = hit;
      throw err;
    }
    return hit;
  }

  function roadLine(E, session, x0, x1, y) {
    let x = x0;
    while (x < x1 - 0.02) {
      let step = Math.min(2, Math.round((x1 - x) * 1000) / 1000);
      if (step > 2) step = 2;
      place(E, session, 'road', x, y, Math.round((x + step) * 1000) / 1000, y);
      x = Math.round((x + step) * 1000) / 1000;
    }
  }

  function braced(E, session, x0, x1, y, triangle) {
    roadLine(E, session, x0, x1, y);
    if (x1 - x0 < 2) return;
    for (let p = x0; p < x1 - 1.5; p += 2) {
      const x2 = p + 2;
      if (x2 > x1 + 0.02) break;
      place(E, session, triangle, p, y, p + 1, y - 1);
      place(E, session, triangle, x2, y, p + 1, y - 1);
    }
    for (let p = x0 + 1; p + 2 <= x1 + 0.02; p += 2) {
      place(E, session, 'steel', p, y - 1, p + 2, y - 1);
    }
  }

  function warren(E, session, x0, x1, y) {
    roadLine(E, session, x0, x1, y);
    const yb = y - 2;
    if (x1 - x0 < 4) {
      braced(E, session, x0, x1, y, 'steel');
      return;
    }
    for (let x = x0 + 2; x <= x1 - 2 + 0.02; x += 2) place(E, session, 'steel', x, y, x, yb);
    place(E, session, 'steel', x0, y, x0 + 2, yb);
    place(E, session, 'steel', x1 - 2, yb, x1, y);
    for (let x = x0 + 2; x <= x1 - 4 + 0.02; x += 2) {
      place(E, session, 'steel', x, yb, x + 2, y);
      place(E, session, 'steel', x, yb, x + 2, yb);
    }
  }

  function deckPoints(level) {
    const y = level.yL == null ? 6 : level.yL;
    const pts = (level.anchors || []).filter(a => Math.abs(a.y - y) < 0.6);
    pts.sort((a, b) => a.x - b.x);
    const out = [];
    for (const p of pts) {
      if (!out.length || Math.abs(out[out.length - 1].x - p.x) > 0.2) out.push(p);
    }
    return out;
  }

  function patternFor(level) {
    if (level.id === 'willow-1') return 'flat';
    if (level.id === 'tide-1' || level.id === 'second-3') return 'lift';
    const types = (level.vehicles || []).map(v => v.type);
    const mats = level.materials || [];
    if (!mats.includes('steel') && (mats.includes('rope') || mats.includes('cable'))) return 'rope';
    if (types.some(t => HEAVY[t])) return 'warren';
    if (!mats.includes('wood')) return 'steel';
    return 'light';
  }

  function eachSpan(E, session, fn) {
    const pts = deckPoints(session.level);
    if (pts.length < 2) throw new Error('no deck anchors');
    for (let i = 1; i < pts.length; i++) fn(pts[i - 1].x, pts[i].x, pts[i - 1].y);
  }

  function buildFlat(E, session) {
    const level = session.level;
    const y = level.yL == null ? 6 : level.yL;
    roadLine(E, session, level.xL, level.xR, y);
  }

  function buildLift(E, session) {
    const h1 = place(E, session, 'hydraulic', 8, 2, 8, 6);
    const h2 = place(E, session, 'hydraulic', 12, 2, 12, 6);
    const sp1 = E.splitJoint(session, 8, 6);
    const sp2 = E.splitJoint(session, 12, 6);
    if (!sp1.ok || !sp2.ok) throw new Error('hinge');
    for (const id of [h1.id, h2.id]) {
      E.setScale(session, id, 1.5);
      E.togglePhase(session, id, 'A');
      E.togglePhase(session, id, 'B');
    }
    for (const id of [sp1.pair, sp2.pair]) {
      E.toggleSplitPhase(session, id, 'A');
      E.toggleSplitPhase(session, id, 'B');
    }
    place(E, session, 'road', 4, 6, 6, 6);
    place(E, session, 'road', 6, 6, 8, 6, { nodeB: sp1.id });
    place(E, session, 'road', 8, 6, 10, 6, { nodeA: sp1.pair });
    place(E, session, 'road', 10, 6, 12, 6, { nodeB: sp2.pair });
    place(E, session, 'road', 12, 6, 14, 6, { nodeA: sp2.id });
  }

  function buildArch(E, session) {
    const roadPts = [[7, 6], [8, 7], [9, 8], [10, 9], [12, 9], [14, 9], [16, 9], [17, 8], [18, 7], [19, 6]];
    for (let i = 1; i < roadPts.length; i++) {
      place(E, session, 'road', roadPts[i - 1][0], roadPts[i - 1][1], roadPts[i][0], roadPts[i][1]);
    }
    for (let p = 10; p < 16 - 1.5; p += 2) {
      place(E, session, 'wood', p, 9, p + 1, 8);
      place(E, session, 'wood', p + 2, 9, p + 1, 8);
    }
    for (let p = 11; p + 2 <= 16 + 0.02; p += 2) place(E, session, 'steel', p, 8, p + 2, 8);
  }

  function buildRope(E, session) {
    const level = session.level;
    const y = level.yL == null ? 6 : level.yL;
    const towers = (level.anchors || []).filter(a => a.y >= y + 3).sort((a, b) => a.x - b.x);
    if (!towers.length) throw new Error('no tower');
    const mat = level.materials.includes('rope') ? 'rope' : 'cable';
    roadLine(E, session, level.xL, level.xR, y);
    const mid = (level.xL + level.xR) / 2;
    for (let x = level.xL + 2; x <= level.xR - 2 + 0.02; x += 2) {
      const tower = towers.length === 1 ? towers[0] : (x <= mid ? towers[0] : towers[towers.length - 1]);
      place(E, session, mat, tower.x, tower.y, x, y);
    }
  }

  function buildReference(E, session) {
    const level = session.level;
    const kind = patternFor(level);
    if (kind === 'flat') {
      buildFlat(E, session);
      return kind;
    }
    if (kind === 'lift') {
      buildLift(E, session);
      return kind;
    }
    if (kind === 'arch') {
      buildArch(E, session);
      return kind;
    }
    if (kind === 'rope') {
      buildRope(E, session);
      return kind;
    }
    const triangle = kind === 'steel' ? 'steel' : 'wood';
    const fn = kind === 'warren'
      ? (x0, x1, y) => warren(E, session, x0, x1, y)
      : (x0, x1, y) => braced(E, session, x0, x1, y, triangle);
    eachSpan(E, session, fn);
    return kind;
  }

  return { patternFor, buildReference, buildFlat, buildLift };
});
