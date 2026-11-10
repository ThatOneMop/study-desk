# Loop Circuit

Original browser game created for Study Desk, 2026. Original code, four hand-built circuits and procedural canvas art; the engine note, wheelspin hiss and sound effects are synthesised at runtime with the Web Audio API. No third-party game source, art, level data or music is bundled, and nothing is derived from any existing moto/trials title. Study Desk's shared bridge retains its MIT notice in ../../bridge.js.

## Controls

- **↑ / W / Space** (or hold the canvas / the Throttle button) — throttle.
- **↓ / S** — brake.
- **← / A** — lean back (wheelie, rotate in the air). **→ / D** — lean forward (bring the nose down).
- **Esc** — pause. **R** — restart the run instantly. **Circuits** — back to the menu.

## Design

The bike is a rigid body (centre of mass, angle, angular velocity) with two spring-damper wheel contacts. All wheel forces are applied at the ground contact point, so the rear-wheel drive has a lever arm below the centre of mass and throttle naturally lifts the front — a wheelie — while landing nose-first pitches the rider over. Quadratic air drag caps top speed near 600 px/s without dulling low-speed grip on the climbs. The rider's head is checked against the surface each step: a head-down landing, a fall into a creek, or a pitch-over on a climb ends the run. The simulation runs at a fixed 1/120 s with two sub-steps.

Four circuits rise in difficulty, built from control points smoothed into a rideable Catmull-Rom surface, with creek gaps that fall through when missed. Best time per circuit, the sound choice and a run counter save to `localStorage` under `loop-circuit-v1`. A `LOOP` debug object exposes `start`, `frame`, `step`, `simulate`, `autopilotAll`, `state` and `profile` for headless driving.

## Honest completeness vs a paid game

A polished four-circuit vertical slice, not a full commercial product. Present: two-wheel rigid-body physics with throttle, brake, lean and air control; wheelie, flip and dive consequences; wheelspin dust, engine pitch tied to speed, finish confetti, wheelie callouts, speed-lookahead camera zoom, crash slow-motion and a 3-2-1 countdown; four hand-built circuits with medal times and saved bests; pause, sound toggle and touch controls. Missing versus a paid title: no level editor, no online leaderboards, no ghost replays, no rider or bike upgrades, no animated sprite art (the rider is drawn procedurally), no rear-wheel-only skid mark persistence, and no season or career structure. Runs are 9–15 s for a clean autopilot line, longer for a first attempt.
