/* Gleam Leap — original rhythm-runner simulation engine. MIT License.
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
  else root.GleamEngine = E;
})(typeof window !== 'undefined' ? window : globalThis, () => {
  // ---- Tuning -------------------------------------------------------------
  // Everything runs at 120 BPM so one beat = 0.5s and, at 320px/s, one beat of
  // travel = 160px. Obstacles are authored on that grid so the level breathes
  // with the music. Jump arc: v0=-740, g=2400 -> apex ~114px, air time 0.62s
  // (197px of travel), which clears a 40px spike and lands on a 60px block.
  const BPM = 120, BEAT = 60 / BPM, STEP = BEAT / 2, SPEED = 320,
        GRAVITY = 2400, JUMP_V = -740, SIZE = 40, GROUND_Y = 400, DT = 1 / 60,
        BUFFER = 0.12, COYOTE = 0.09, FALL_Y = 560, LOOKAHEAD = 0.18,
        SPIKE_H = 40, SPIKE_HIT_INSET = 12, LAND_TOL = 22;

  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

  // ---- Level data (hand authored, not random) -----------------------------
  // t:'spike' base:y  t:'block' x,y,w,h  t:'pit' x,w
  const levels = [
    {
      name: 'First Gleam', blurb: 'Learn the beat. One square, a few spikes, a couple of low blocks.',
      color: '#2f8f8a', sky: ['#0b1e2a', '#123a44'], accent: '#ffd166',
      length: 4200, checkpoints: [1100, 2100, 3200],
      melody: { lead: [0, null, 4, null, 7, null, 4, null, 5, null, 4, null, 2, null, null, null], bass: [0, 0, 3, 5] },
      obstacles: [
        { t: 'spike', x: 700 },
        { t: 'spike', x: 1020 },
        { t: 'spike', x: 1340 },
        { t: 'block', x: 1660, y: 340, w: 80, h: 60 },
        { t: 'spike', x: 2000 },
        { t: 'spike', x: 2320 }, { t: 'spike', x: 2360 },
        { t: 'block', x: 2700, y: 340, w: 160, h: 60 },
        { t: 'spike', x: 3100 },
        { t: 'spike', x: 3300 }, { t: 'spike', x: 3340 },
        { t: 'spike', x: 3700 }
      ]
    },
    {
      name: 'Pulse Run', blurb: 'Doubles, first gaps and a rising step. Keep the rhythm.',
      color: '#7a54c9', sky: ['#150d2e', '#2a1a52'], accent: '#7ef0ff',
      length: 5200, checkpoints: [1200, 2600, 3900],
      melody: { lead: [0, 0, 7, null, 5, 5, 4, null, 0, 0, 7, null, 9, 7, 5, null], bass: [0, 3, 5, 7] },
      obstacles: [
        { t: 'spike', x: 640 },
        { t: 'spike', x: 900 }, { t: 'spike', x: 940 },
        { t: 'pit', x: 1240, w: 80 },
        { t: 'spike', x: 1560 },
        { t: 'block', x: 1820, y: 340, w: 100, h: 60 },
        { t: 'spike', x: 2100 },
        { t: 'spike', x: 2340 }, { t: 'spike', x: 2380 },
        { t: 'pit', x: 2660, w: 80 },
        { t: 'block', x: 3000, y: 340, w: 160, h: 60 },
        { t: 'spike', x: 3420 },
        { t: 'spike', x: 3660 }, { t: 'spike', x: 3700 },
        { t: 'pit', x: 3980, w: 80 },
        { t: 'spike', x: 4300 },
        { t: 'spike', x: 4540 }, { t: 'spike', x: 4580 }
      ]
    },
    {
      name: 'Gleam Gauntlet', blurb: 'Tight doubles, stair hops and three gaps. The real run.',
      color: '#c0492f', sky: ['#2a0d0d', '#4a1a14'], accent: '#ffd166',
      length: 6200, checkpoints: [1150, 2500, 3900, 5000],
      melody: { lead: [12, null, 11, 12, 9, null, 7, null, 5, null, 7, 9, 7, 5, 4, null], bass: [0, -2, 3, 5] },
      obstacles: [
        { t: 'spike', x: 620 },
        { t: 'spike', x: 880 }, { t: 'spike', x: 920 },
        { t: 'block', x: 1200, y: 340, w: 100, h: 60 },
        { t: 'spike', x: 1500 },
        { t: 'spike', x: 1740 }, { t: 'spike', x: 1780 },
        { t: 'pit', x: 2020, w: 80 },
        { t: 'spike', x: 2300 },
        { t: 'block', x: 2560, y: 340, w: 160, h: 60 },
        { t: 'spike', x: 3400 },
        { t: 'spike', x: 3640 }, { t: 'spike', x: 3680 },
        { t: 'pit', x: 3920, w: 80 },
        { t: 'spike', x: 4200 },
        { t: 'spike', x: 4440 }, { t: 'spike', x: 4480 },
        { t: 'block', x: 4700, y: 340, w: 160, h: 60 },
        { t: 'spike', x: 5020 },
        { t: 'spike', x: 5260 }, { t: 'spike', x: 5300 },
        { t: 'pit', x: 5540, w: 80 },
        { t: 'spike', x: 5820 }
      ]
    },
    {
      name: 'Neon Deep', blurb: 'Triples, back-to-back gaps and long blocks. The grid turns electric.',
      color: '#3a2fbf', sky: ['#070d1f', '#12204a'], accent: '#39f6e8',
      length: 7000, checkpoints: [1300, 2800, 4200, 5600],
      melody: { lead: [7, null, 9, 11, null, 9, 7, null, 4, null, 7, null, 9, 11, 12, null], bass: [0, 5, 7, 3] },
      obstacles: [
        { t: 'spike', x: 640 },
        { t: 'spike', x: 900 }, { t: 'spike', x: 940 },
        { t: 'block', x: 1240, y: 340, w: 120, h: 60 },
        { t: 'spike', x: 1560 },
        { t: 'spike', x: 1820 }, { t: 'spike', x: 1860 },
        { t: 'pit', x: 2120, w: 80 },
        { t: 'spike', x: 2420 },
        { t: 'spike', x: 2680 }, { t: 'spike', x: 2720 },
        { t: 'block', x: 3060, y: 340, w: 160, h: 60 },
        { t: 'spike', x: 3380 },
        { t: 'spike', x: 3640 }, { t: 'spike', x: 3680 },
        { t: 'pit', x: 3940, w: 80 },
        { t: 'spike', x: 4240 },
        { t: 'spike', x: 4500 }, { t: 'spike', x: 4540 },
        { t: 'block', x: 4880, y: 340, w: 160, h: 60 },
        { t: 'spike', x: 5200 },
        { t: 'spike', x: 5460 }, { t: 'spike', x: 5500 },
        { t: 'pit', x: 5760, w: 80 },
        { t: 'spike', x: 6060 },
        { t: 'spike', x: 6320 }, { t: 'spike', x: 6360 },
        { t: 'spike', x: 6700 }
      ]
    },
    {
      name: 'Sunset Sprint', blurb: 'The long haul. Wide gaps, late triples and one false step ends it.',
      color: '#d94f2b', sky: ['#2a0f2e', '#8a2f4a'], accent: '#ff8a5c',
      length: 8000, checkpoints: [1400, 3000, 4600, 6200],
      melody: { lead: [12, 9, 12, 14, null, 12, 9, 7, 5, 7, 9, 12, 11, 9, 7, null], bass: [0, -2, 5, 7] },
      obstacles: [
        { t: 'spike', x: 600 },
        { t: 'spike', x: 860 }, { t: 'spike', x: 900 },
        { t: 'pit', x: 1180, w: 80 },
        { t: 'spike', x: 1480 },
        { t: 'block', x: 1740, y: 340, w: 100, h: 60 },
        { t: 'spike', x: 2040 },
        { t: 'spike', x: 2300 }, { t: 'spike', x: 2340 },
        { t: 'spike', x: 2680 },
        { t: 'pit', x: 2980, w: 80 },
        { t: 'spike', x: 3280 },
        { t: 'block', x: 3540, y: 340, w: 160, h: 60 },
        { t: 'spike', x: 3860 },
        { t: 'spike', x: 4120 }, { t: 'spike', x: 4160 },
        { t: 'pit', x: 4420, w: 80 },
        { t: 'spike', x: 4720 },
        { t: 'spike', x: 4980 }, { t: 'spike', x: 5020 },
        { t: 'block', x: 5360, y: 340, w: 160, h: 60 },
        { t: 'spike', x: 5680 },
        { t: 'pit', x: 5960, w: 80 },
        { t: 'spike', x: 6260 },
        { t: 'spike', x: 6520 }, { t: 'spike', x: 6560 },
        { t: 'block', x: 6880, y: 340, w: 160, h: 60 },
        { t: 'spike', x: 7200 },
        { t: 'spike', x: 7460 }, { t: 'spike', x: 7500 },
        { t: 'spike', x: 7800 }
      ]
    }
  ];

  const levelCount = levels.length;

  // ---- Run state ----------------------------------------------------------
  function fresh(level, practise) {
    const i = clamp(level | 0, 0, levelCount - 1);
    return {
      level: i, mode: 'ready', x: 0, y: GROUND_Y - SIZE, vy: 0,
      ground: true, coyote: COYOTE, buffer: 0, jumped: false, time: 0,
      practise: !!practise, checkpoint: -1, deaths: 0, maxX: 0,
      dead: false, won: false, deadCause: '', deadX: 0
    };
  }

  function die(s, cause) {
    s.mode = 'dead'; s.dead = true; s.deadCause = cause;
    s.deadX = s.x; s.deaths++;
    return s;
  }

  function respawn(s) {
    const lv = levels[s.level];
    let x = 0;
    if (s.practise && s.checkpoint >= 0) x = lv.checkpoints[s.checkpoint];
    s.x = x; s.y = GROUND_Y - SIZE; s.vy = 0; s.ground = true;
    s.coyote = COYOTE; s.buffer = 0; s.mode = 'run';
    s.dead = false; s.won = false;
    return s;
  }

  function progress(s) {
    const lv = levels[s.level];
    return clamp(Math.round((s.x / lv.length) * 100), 0, 100);
  }

  // ---- One fixed step -----------------------------------------------------
  function step(s, input) {
    input = input || {};
    if (s.mode === 'ready') {
      if (input.jumpPressed || input.jump) s.mode = 'run';
      else return s;
    }
    if (s.mode !== 'run') return s;

    const lv = levels[s.level];
    s.time += DT;

    // Jump buffering + coyote time.
    if (input.jumpPressed) s.buffer = BUFFER;
    else s.buffer = Math.max(0, s.buffer - DT);
    s.coyote = s.ground ? COYOTE : Math.max(0, s.coyote - DT);
    s.jumped = false;
    if ((s.ground || s.coyote > 0) && (input.jump || s.buffer > 0)) {
      s.vy = JUMP_V; s.ground = false; s.coyote = 0; s.buffer = 0; s.jumped = true;
    }

    s.x += SPEED * DT;
    if (s.x > s.maxX) s.maxX = s.x;
    const prevBottom = s.y + SIZE;

    s.vy = Math.min(1400, s.vy + GRAVITY * DT);
    s.y += s.vy * DT;
    s.ground = false;

    // Ground plane (absent over a pit).
    let overPit = false;
    for (const o of lv.obstacles) {
      if (o.t === 'pit' && s.x + SIZE > o.x && s.x < o.x + o.w) { overPit = true; break; }
    }
    if (!overPit && s.y + SIZE >= GROUND_Y && prevBottom <= GROUND_Y + 2 && s.vy >= 0) {
      s.y = GROUND_Y - SIZE; s.vy = 0; s.ground = true;
    }

    // Blocks: land on top, or die on the face.
    for (const o of lv.obstacles) {
      if (o.t !== 'block') continue;
      if (s.x + SIZE > o.x && s.x < o.x + o.w && s.y + SIZE > o.y && s.y < o.y + o.h) {
        if (s.vy >= 0 && prevBottom <= o.y + LAND_TOL) {
          s.y = o.y - SIZE; s.vy = 0; s.ground = true;
        } else {
          return die(s, 'block');
        }
      }
    }

    // Spikes (inset triangle hitbox, slightly forgiving).
    for (const o of lv.obstacles) {
      if (o.t !== 'spike') continue;
      const base = o.base || GROUND_Y;
      const hx = o.x + SPIKE_HIT_INSET, hw = SIZE - SPIKE_HIT_INSET * 2;
      const hy = base - SPIKE_H, hh = SPIKE_H;
      if (s.x + SIZE > hx && s.x < hx + hw && s.y + SIZE > hy && s.y < hy + hh) return die(s, 'spike');
    }

    if (s.y > FALL_Y) return die(s, 'fall');

    // Practise checkpoints.
    if (s.practise) {
      for (let i = 0; i < lv.checkpoints.length; i++) {
        if (s.x >= lv.checkpoints[i] && i > s.checkpoint) s.checkpoint = i;
      }
    }

    if (s.x >= lv.length) { s.mode = 'won'; s.won = true; }
    return s;
  }

  // ---- Autopilot (debug/verification only) --------------------------------
  // Jumps with a per-type lead so the arc lands correctly: spikes/blocks are
  // cleared near apex, pits are jumped late so the 197px arc lands beyond.
  function autopilotInput(s) {
    if (s.mode === 'ready') return { jump: true, jumpPressed: true };
    const lv = levels[s.level];
    const pr = s.x + SIZE;
    let best = null;
    for (const o of lv.obstacles) {
      const end = o.t === 'spike' ? o.x + SIZE : o.x + o.w;
      if (end <= pr) continue;
      if (o.t === 'block' && s.ground && Math.abs((s.y + SIZE) - o.y) < 3) continue; // standing on it
      const gap = o.x - pr;
      if (gap < 0) continue;
      if (!best || gap < best.gap) best = { gap: gap, t: o.t };
    }
    let jump = false;
    if (best) {
      const lead = best.t === 'block' ? 90 : best.t === 'pit' ? 60 : 30;
      jump = s.ground && best.gap <= lead;
    }
    return { jump: jump, jumpPressed: jump };
  }

  // ---- Save profile -------------------------------------------------------
  // Version 1 saves are forward-compatible: best/deaths/practise/bestTime are
  // stored per level and may be shorter than levelCount (older saves built when
  // fewer levels existed). decodeProfile pads any missing tail so a save made
  // before levels 4-5 shipped keeps every recorded best, death marker and
  // practise toggle instead of being rejected.
  const eachLevel = (v) => Array.from({ length: levelCount }, () => v);

  function createProfile() {
    return { version: 1, best: eachLevel(0), deaths: eachLevel(null).map(() => []), practise: eachLevel(false), bestTime: eachLevel(null), sound: true };
  }

  function isInt(v, a, b) { return Number.isInteger(v) && v >= a && v <= b; }

  function validBestTime(v) { return v === null || (typeof v === 'number' && Number.isFinite(v) && v > 0); }

  function validProfile(p) {
    try {
      if (!p || p.version !== 1) return false;
      if (!Array.isArray(p.best) || p.best.length < 1 || p.best.length > levelCount || !p.best.every((v) => isInt(v, 0, 100))) return false;
      if (!Array.isArray(p.deaths) || p.deaths.length !== p.best.length) return false;
      for (const arr of p.deaths) {
        if (!Array.isArray(arr) || arr.length > 120 || !arr.every((v) => typeof v === 'number' && Number.isFinite(v) && v >= 0)) return false;
      }
      if (!Array.isArray(p.practise) || p.practise.length !== p.best.length || !p.practise.every((v) => typeof v === 'boolean')) return false;
      if (p.bestTime !== undefined) {
        if (!Array.isArray(p.bestTime) || p.bestTime.length !== p.best.length || !p.bestTime.every(validBestTime)) return false;
      }
      if (typeof p.sound !== 'boolean') return false;
      return true;
    } catch { return false; }
  }

  function encodeProfile(p) { return JSON.stringify(p); }

  function decodeProfile(raw) {
    try {
      if (typeof raw !== 'string' || raw.length > 60000) return null;
      const p = JSON.parse(raw);
      if (!validProfile(p)) return null;
      // Migrate / pad arrays up to the live level count (older saves may be shorter).
      const n = levelCount;
      while (p.best.length < n) p.best.push(0);
      while (p.deaths.length < n) p.deaths.push([]);
      while (p.practise.length < n) p.practise.push(false);
      if (!Array.isArray(p.bestTime)) p.bestTime = [];
      while (p.bestTime.length < n) p.bestTime.push(null);
      // Trim stored markers defensively.
      p.deaths = p.deaths.map((a) => a.slice(-120));
      return p;
    } catch { return null; }
  }

  return {
    BPM, BEAT, STEP, SPEED, GRAVITY, JUMP_V, SIZE, GROUND_Y, DT, FALL_Y,
    SPIKE_H, LOOKAHEAD, levels, levelCount, clamp,
    fresh, step, die, respawn, progress, autopilotInput,
    createProfile, validProfile, encodeProfile, decodeProfile
  };
});
