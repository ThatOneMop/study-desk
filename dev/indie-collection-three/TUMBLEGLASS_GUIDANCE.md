# Tumbleglass tray guidance — 26 October 2026

Source: `4c3e706ec38567eba77b6ffcfaee219dd0d3aca6` on `indie-collection-three-dev`.

## Finding and implemented behavior

Source inspection found the existing wedged warning only checked whether any tilt could move beads. Exhaustive state analysis found unsolvable configurations that still permit movement, leaving a player without an explanation of why repeating tilts cannot finish.

Optional **Check tray** now searches all legal tilts and any unused clamp. It suggests one action on a shortest remaining route, explicitly naming the held bead or No clamp. If no solution remains, it explains that earlier tilts must be undone or the tray retried. Advice never moves beads, changes the selected clamp, modifies a journal or awards a record. Pause/dialog guards hide and disable advice; successful actions, undo and reset clear it. Reload does not restore stale hints. A near-full journal gets a capacity warning if its shortest remaining route cannot fit.

## Verification

**16 tests pass: eight engine and eight jsdom 26.1.0**, plus both script syntax checks. An independent reverse-graph distance calculation covers all reachable states, including unused/spent clamp and locked-bead configurations. Counts by tray: 33/72/164 states and 6/0/8 dead ends. Every suggested route is replayed to a win; inputs remain unchanged. These 269 states are test coverage, not extra levels or a content-hours claim.

Original and clamp-assisted wins, save/reload, undo/retry, malformed data, old journal compatibility, reset isolation, corrupt recovery, storage failure, control guards and navigation markup still pass. New UI checks cover read-only hints, retained clamp selection, pause/confirmation guards, hiding/stale guidance, dead-end undo recovery and journal capacity. Dialog APIs are simulated.

No rendered browser, screenshots, physical touch/native keyboard, human enjoyment or full repository build claim. This source-observed assistance is pending rendered review and earns no completed improvement-pass credit.

## Preservation and next steps

Third batch remains **12/50 built; 0 improved/browser-tested/integrated/live**. Second additional round remains **20 source upgrades, 6 verified, 14 pending**. First-batch report reread: 20 finished, nine selected source entries, zero verified live URLs.

Main `dc88f09cfb30cae92e3f0e9afe65cd2f7ddaf4f7` and second branch `3949e3d9f8e2e9846dc4c91c436d90b19bbbd341` remain unchanged. Only Tumbleglass source/tests and third-batch evidence change. Workspace/publication blockers were not repeatedly retried; no browser-policy workaround was attempted. Public catalogue, previous collections, Gummy Bay and existing saves are preserved.

Next: rendered natural desktop/touch play and screenshot review, assessing whether guidance clarifies locking mistakes without removing satisfying experimentation; perform and verify a substantive playtest-led improvement before integration.
