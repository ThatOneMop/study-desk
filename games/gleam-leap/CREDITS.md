# Gleam Leap

Original browser game created for Study Desk, 2026. Original code, original hand-authored levels and procedural canvas art; the four-bar melody and drum kit are synthesised at runtime with the Web Audio API. No third-party game source, art, level data or music is bundled. Study Desk's shared bridge retains its MIT notice in ../../bridge.js.

## Controls

- **Space / W / ↑ / click / tap** — leap. Hold to leap again the moment you land (jumps are buffered and coyote time forgives an early or late press).
- **Esc** — pause. **R** — restart the run. **Levels** — back to the menu.
- Practise mode (per level card) drops checkpoints so a fall returns you to the last one.

## Design

The square auto-runs at a constant 320 px/s. One beat at 120 BPM is 0.5 s, which is 160 px of travel, so obstacles are authored on the beat grid and the level moves with the music. The jump arc (apex ~114 px, air time ~0.62 s, ~197 px of travel) clears a 40 px spike near its apex and lands on a 60 px block. Three hand-designed levels rise in difficulty; the best distance reached, per-level death markers and the practise toggle all save to `localStorage` under `gleam-leap-v1`. A `GLEAP` debug object exposes `start`, `reset`, `frame`, `simulate`, `autopilotAll` and `state` for headless driving.

## Honest completeness vs a paid game

A polished three-level vertical slice, not a full commercial product. Present: auto-runner core with buffered jump and coyote time, three hand-authored levels, level select with best-percentage and death markers, practise checkpoints, pause, sound toggle, beat-synced original synth music, parallax background, jump squash/stretch, death particles, screen shake and a victory fanfare. Missing versus a paid title: no level editor, no online leaderboards, no unlockable characters or skins, no user-imported music, no custom (non-square) game modes such as ship or wave, and no achievements. Levels are short (13–19 s each) by design for a slice.
