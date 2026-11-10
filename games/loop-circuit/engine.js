/* Loop Circuit — original side-scrolling motorbike-trials simulation engine. MIT License.
Copyright (c) 2026 Study Desk contributors
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the Software), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED AS IS, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
'use strict';
(function (root, factory) {
  const E = factory();
  if (typeof module === 'object' && module.exports) module.exports = E;
  else root.LoopEngine = E;
})(typeof window !== 'undefined' ? window : globalThis, () => {
  // ---- Tuning -------------------------------------------------------------
  // Screen coords: +x right, +y DOWN. One fixed substep is 1/120 s.
  // The bike is a rigid body (COM, angle, angular velocity) with two
  // spring-damper wheel contacts. Rear-wheel drive force is applied at the
  // rear wheel offset, below the COM, so throttle naturally lifts the front
  // (a wheelie); the same geometry makes landing nose-first pitch you over.
  const DT = 1 / 120, SUBSTEPS = 2;
  const G = 2000;                 // gravity (px/s^2)
  const WHEEL_R = 12, HALF_WB = 22;
  const WHEELS = [{ x: -HALF_WB, y: 4 }, { x: HALF_WB, y: 4 }]; // rear, front
  const HEAD = { x: 2, y: -26 };  // rider head, local
  const MASS = 1, INERTIA = 620;
  const K_SUSP = 340, C_SUSP = 34;      // suspension spring / damper
  const ENGINE = 2400, BRAKE = 1700;    // drive / brake force (accel units)
  const ROLL = 1.2, MU = 2.4;           // rolling resistance, friction cap
  const C_DRAG = 0.0032;                // quadratic air drag -> caps top speed
  const LEAN_TORQUE = 3000;             // air-control / body-lean torque scale
  const ANG_DAMP_GROUND = 0.994, ANG_DAMP_AIR = 0.998;
  const LIN_DAMP = 0.9995;
  const FALL_Y = 1000;                  // below this = fell in a gap
  const COUNTDOWN = 3.4;

  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

  // ---- Track data (hand authored) ----------------------------------------
  // `ctrl` are control points fed to a Catmull-Rom pass to make a smooth,
  // rideable surface; `gaps` are x-ranges with no ground at all (fall through).
  const rawTracks = [
    {
      name: 'Rolling Start', diff: 1,
      blurb: 'Two gentle rises to learn the throttle, then a soft crest and a long run-out. Wide, forgiving, and a fine place to find your balance.',
      sky: ['#123043', '#2b5c73'], ground: '#1d4b57', accent: '#ffcf6b',
      start: 90, finish: 5200,
      par: 12, medal: [12, 16, 22],
      ctrl: [[-300, 470], [300, 470], [700, 430], [1080, 470], [1450, 470], [1800, 424],
             [2150, 470], [2500, 470], [2850, 430], [3200, 470], [3550, 470], [3900, 424],
             [4250, 470], [4600, 470], [4950, 470], [5200, 470], [5500, 470]],
      gaps: []
    },
    {
      name: 'Whip Creek', diff: 2,
      blurb: 'A rising berm, then a creek crossing with a launch kicker. Carry speed off the lip or you will not make the far bank.',
      sky: ['#2a1533', '#5b2f5e'], ground: '#4a2350', accent: '#7ef0ff',
      start: 90, finish: 5600,
      par: 13, medal: [13, 17, 24],
      ctrl: [[-300, 470], [250, 470], [600, 430], [950, 470], [1300, 470], [1620, 376],
             [1920, 376], [2220, 470], [2520, 470], [2820, 470], [3140, 470], [3340, 428],
             [3480, 390], [3590, 428], [3790, 470], [4100, 470], [4420, 434], [4720, 470],
             [5040, 470], [5360, 470], [5600, 470], [5900, 470]],
      gaps: [[3480, 3590]]
    },
    {
      name: 'Bone Yard', diff: 3,
      blurb: 'Steep kickers and a double creek crossing. Feather the throttle on the climbs or you will loop it clean over the back.',
      sky: ['#3a1a12', '#7a3a1e'], ground: '#5c2a17', accent: '#ffb36b',
      start: 90, finish: 6600,
      par: 16, medal: [16, 21, 28],
      ctrl: [[-300, 470], [240, 470], [540, 420], [820, 470], [1120, 470], [1420, 470],
             [1700, 352], [2000, 352], [2300, 470], [2600, 470], [2900, 470], [3100, 470],
             [3280, 430], [3400, 388], [3510, 430], [3720, 470], [4020, 470], [4300, 470],
             [4480, 470], [4620, 426], [4760, 384], [4870, 426], [5080, 470], [5400, 470],
             [5700, 470], [6000, 470], [6300, 470], [6600, 470], [6900, 470]],
      gaps: [[3400, 3510], [4760, 4870]]
    },
    {
      name: 'Loop Circuit', diff: 4,
      blurb: 'The signature run: a steep launch, a long ramp to a high plateau, a big drop and a final kicker over the creek. Time it clean.',
      sky: ['#0d1b2e', '#233a63'], ground: '#1a2f52', accent: '#ffd166',
      start: 90, finish: 7600,
      par: 19, medal: [19, 25, 34],
      ctrl: [[-300, 470], [220, 470], [520, 430], [800, 470], [1080, 470], [1400, 470],
             [1680, 332], [2000, 332], [2320, 470], [2620, 470], [2940, 470], [3180, 470],
             [3380, 386], [3520, 340], [3630, 386], [3850, 470], [4150, 470], [4450, 470],
             [4700, 440], [5000, 370], [5240, 300], [5480, 300], [5620, 430], [5760, 470],
             [6080, 470], [6400, 470], [6580, 430], [6720, 388], [6830, 430], [7040, 470],
             [7360, 470], [7600, 470], [7900, 470]],
      gaps: [[3520, 3630], [5480, 5620], [6720, 6830]]
    }
  ];

  // Catmull-Rom: turn sparse control points into a dense, smooth polyline.
  function smooth(ctrl, per) {
    per = per || 8;
    const p = [ctrl[0], ...ctrl, ctrl[ctrl.length - 1]];
    const out = [];
    for (let i = 1; i < p.length - 2; i++) {
      const p0 = p[i - 1], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2];
      for (let s = 0; s < per; s++) {
        const t = s / per, t2 = t * t, t3 = t2 * t;
        const x = 0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3);
        const y = 0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3);
        out.push([x, y]);
      }
    }
    out.push(ctrl[ctrl.length - 1].slice());
    return out;
  }

  const tracks = rawTracks.map((t) => {
    const pts = smooth(t.ctrl, 9);
    // If a gap cuts the surface, raise a bridge-free chasm: points stay put,
    // terrainY returns Infinity inside a gap so the bike falls through.
    return { ...t, points: pts, gaps: t.gaps || [] };
  });

  // ---- Terrain sampling ---------------------------------------------------
  function inGap(t, x) {
    for (const g of t.gaps) if (x > g[0] && x < g[1]) return true;
    return false;
  }
  // Height of the surface at world x (Infinity over a gap). Binary search.
  function terrainY(t, x) {
    if (inGap(t, x)) return Infinity;
    const P = t.points;
    if (x <= P[0][0]) return P[0][1];
    if (x >= P[P.length - 1][0]) return P[P.length - 1][1];
    let lo = 0, hi = P.length - 1;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (P[m][0] <= x) lo = m; else hi = m; }
    const a = P[lo], b = P[hi], f = (x - a[0]) / (b[0] - a[0] || 1);
    return a[1] + (b[1] - a[1]) * f;
  }
  function segAt(t, x) {
    const P = t.points;
    if (x <= P[0][0]) return [P[0], P[1]];
    if (x >= P[P.length - 1][0]) return [P[P.length - 2], P[P.length - 1]];
    let lo = 0, hi = P.length - 1;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (P[m][0] <= x) lo = m; else hi = m; }
    return [P[lo], P[hi]];
  }
  // Upward surface normal (points away from the ground, i.e. toward -y).
  function terrainNormal(t, x) {
    const [a, b] = segAt(t, x);
    let dx = b[0] - a[0], dy = b[1] - a[1];
    const L = Math.hypot(dx, dy) || 1; dx /= L; dy /= L;
    return { x: dy, y: -dx, tx: dx, ty: dy };
  }
  // Surface pitch angle (parallel-to-slope target for the balance controller).
  function slopeAngle(t, x) {
    const [a, b] = segAt(t, x);
    return Math.atan2(b[1] - a[1], b[0] - a[0] || 1);
  }

  // ---- Bike state ---------------------------------------------------------
  function fresh(level) {
    const i = clamp(level | 0, 0, tracks.length - 1);
    const t = tracks[i];
    return {
      level: i, mode: 'countdown', countdown: COUNTDOWN,
      px: t.start, py: terrainY(t, t.start) - WHEEL_R - 6,
      vx: 0, vy: 0, angle: 0, angVel: 0,
      time: 0, best: null, deaths: 0, maxX: t.start,
      throttle: 0, brake: 0, lean: 0,
      contactRear: false, contactFront: false,
      wheelie: 0, air: 0, crashCause: '', lastCrashX: t.start
    };
  }

  function wheelWorld(s, off) {
    const c = Math.cos(s.angle), si = Math.sin(s.angle);
    return { x: s.px + off.x * c - off.y * si, y: s.py + off.x * si + off.y * c };
  }
  // Public: world position of wheel i (0 rear, 1 front) for rendering.
  function wheelPos(s, i) { return wheelWorld(s, WHEELS[i] || WHEELS[0]); }

  function crash(s, cause) {
    if (s.mode === 'dead') return s;
    s.mode = 'dead'; s.crashCause = cause; s.deaths++;
    s.lastCrashX = s.px;
    return s;
  }

  function respawn(s) {
    const t = tracks[s.level];
    s.px = t.start; s.py = terrainY(t, t.start) - WHEEL_R - 6;
    s.vx = 0; s.vy = 0; s.angle = 0; s.angVel = 0;
    s.time = 0; s.mode = 'countdown'; s.countdown = COUNTDOWN;
    s.wheelie = 0; s.air = 0; s.crashCause = '';
    return s;
  }

  function progress(s) {
    const t = tracks[s.level];
    return clamp(Math.round(((s.px - t.start) / (t.finish - t.start)) * 100), 0, 100);
  }

  // ---- One integration substep -------------------------------------------
  function substep(s, input, dt) {
    const t = tracks[s.level];
    const throttle = input.throttle ? 1 : 0;
    const brake = input.brake ? 1 : 0;
    const lean = clamp(input.lean || 0, -1, 1);
    s.throttle = throttle; s.brake = brake; s.lean = lean;

    let ax = 0, ay = G, torque = 0;
    let contactRear = false, contactFront = false;

    // Quadratic air drag along the velocity vector (caps top speed, keeps grip).
    const sp = Math.hypot(s.vx, s.vy);
    if (sp > 1) { const dm = C_DRAG * sp * sp; ax -= dm * s.vx / sp; ay -= dm * s.vy / sp; }

    for (let i = 0; i < 2; i++) {
      const off = WHEELS[i];
      const w = wheelWorld(s, off);
      const gy = terrainY(t, w.x);
      if (gy === Infinity) continue;
      const pen = (w.y + WHEEL_R) - gy;
      if (pen <= 0) continue;
      if (i === 0) contactRear = true; else contactFront = true;

      const n = terrainNormal(t, w.x);
      // Apply every wheel force at the ground contact (wheel centre pushed
      // down by -n*R), so the drive force has a real lever arm below the COM
      // and throttle can lift the front (a wheelie).
      const cx = w.x - n.x * WHEEL_R, cy = w.y - n.y * WHEEL_R;
      const rx = cx - s.px, ry = cy - s.py;
      // Velocity of the contact point.
      const vcx = s.vx - s.angVel * ry, vcy = s.vy + s.angVel * rx;
      const vn = vcx * n.x + vcy * n.y;

      let fn = K_SUSP * pen - C_SUSP * vn;
      if (fn < 0) fn = 0;

      // Tangent pointing forward (+x).
      let tx = n.tx, ty = n.ty;
      if (tx < 0) { tx = -tx; ty = -ty; }
      const vt = vcx * tx + vcy * ty;

      let ft = 0;
      if (i === 0 && throttle) ft += ENGINE * throttle;
      if (brake) ft -= BRAKE * brake * (vt >= 0 ? 1 : -1);
      ft -= ROLL * vt;
      const cap = MU * fn;
      if (ft > cap) ft = cap; else if (ft < -cap) ft = -cap;

      const Fx = n.x * fn + tx * ft;
      const Fy = n.y * fn + ty * ft;
      ax += Fx / MASS; ay += Fy / MASS;
      torque += rx * Fy - ry * Fx;
    }

    const grounded = contactRear || contactFront;
    // Body lean: full authority in the air, softer on the ground.
    torque += lean * LEAN_TORQUE * (grounded ? 0.7 : 1.0);

    s.vx += ax * dt; s.vy += ay * dt;
    s.vx *= LIN_DAMP; s.vy *= LIN_DAMP;
    s.angVel = (s.angVel + (torque / INERTIA) * dt) * (grounded ? ANG_DAMP_GROUND : ANG_DAMP_AIR);
    s.px += s.vx * dt; s.py += s.vy * dt; s.angle += s.angVel * dt;

    s.contactRear = contactRear; s.contactFront = contactFront;
    return grounded;
  }

  function step(s, input, dt) {
    input = input || {};
    dt = dt || DT;
    if (s.mode === 'countdown') {
      s.countdown -= dt;
      if (s.countdown <= 0) { s.countdown = 0; s.mode = 'run'; }
      return s;
    }
    if (s.mode !== 'run') return s;

    s.time += dt;
    const n = SUBSTEPS, h = dt / n;
    let grounded = false;
    for (let k = 0; k < n; k++) grounded = substep(s, input, h);

    if (s.px > s.maxX) s.maxX = s.px;

    // Rider head must stay above the ground.
    const hw = wheelWorld(s, HEAD);
    const hy = terrainY(tracks[s.level], hw.x);
    if (hy !== Infinity && hw.y > hy + 1) return crash(s, 'head');
    if (s.py > FALL_Y) return crash(s, 'fell');

    // Wheelie bookkeeping (rear down, front up, throttle on).
    if (grounded && s.contactRear && !s.contactFront && s.throttle && s.angle < -0.22) s.wheelie += dt;
    else s.wheelie = 0;
    s.air = grounded ? 0 : s.air + dt;

    if (s.px >= tracks[s.level].finish) { s.mode = 'won'; s.best = s.time; }
    return s;
  }

  // ---- Autopilot (headless verification + demo) ---------------------------
  // A balance controller: hold the chassis roughly parallel to the slope with
  // full throttle, ease off if a backflip is brewing. Enough to ride every
  // authored line to the flag.
  function autopilotInput(s) {
    if (s.mode === 'countdown') return { throttle: 0, brake: 0, lean: 0 };
    const t = tracks[s.level];
    const grounded = s.contactRear || s.contactFront;
    const target = grounded ? slopeAngle(t, s.px) : 0;
    const err = s.angle - target;
    let lean = clamp(-(3.0 * err + 0.28 * s.angVel) * 1.8, -1, 1);
    let throttle = 1;
    // Rider logic, measured against the slope, not the world: ease off and
    // throw weight forward if a wheelie climbs above the surface pitch; lean
    // back if the nose is diving below it.
    if (err < -0.35) { throttle = 0; lean = 1; }
    else if (err < -0.2) { lean = Math.max(lean, 0.6); }
    if (err > 0.5) lean = Math.min(lean, -0.6);
    return { throttle: throttle, brake: 0, lean: lean };
  }

  // ---- Save profile -------------------------------------------------------
  const N = tracks.length;
  function createProfile() {
    return { version: 1, best: Array(N).fill(null), sound: true, totalRuns: 0 };
  }
  function validProfile(p) {
    try {
      if (!p || p.version !== 1) return false;
      if (!Array.isArray(p.best) || p.best.length !== N) return false;
      for (const b of p.best) if (b !== null && !(typeof b === 'number' && isFinite(b) && b > 0 && b < 100000)) return false;
      if (typeof p.sound !== 'boolean') return false;
      if (!(typeof p.totalRuns === 'number' && p.totalRuns >= 0 && p.totalRuns < 1e9)) return false;
      return true;
    } catch { return false; }
  }
  function encodeProfile(p) { return JSON.stringify(p); }
  function decodeProfile(raw) {
    try {
      if (typeof raw !== 'string' || raw.length > 20000) return null;
      const p = JSON.parse(raw);
      if (!validProfile(p)) return null;
      return p;
    } catch { return null; }
  }

  function medalFor(t, seconds) {
    if (seconds == null) return null;
    const m = t.medal;
    return seconds <= m[0] ? 'gold' : seconds <= m[1] ? 'silver' : seconds <= m[2] ? 'bronze' : null;
  }

  return {
    DT, SUBSTEPS, G, WHEEL_R, HALF_WB, WHEELS, HEAD, FALL_Y, COUNTDOWN,
    tracks, trackCount: N, clamp,
    fresh, step, crash, respawn, progress, autopilotInput,
    terrainY, terrainNormal, slopeAngle, inGap, wheelPos,
    createProfile, validProfile, encodeProfile, decodeProfile, medalFor
  };
});
