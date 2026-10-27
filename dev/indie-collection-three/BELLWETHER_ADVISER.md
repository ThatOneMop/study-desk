# Bellwether — optional adviser

27 October 2026. Source commit `ad5d1d4385b468fe81c681e704551339db07b977`.

The source-level gap was recovery help: the player could preview a move but not ask how to get the flock home from the current position. Ask the shepherd now performs a read-only breadth-first search over normal walks, quiet steps, flock whistles and named calls. It reports a found route length and previews the first action; the player still confirms it. The quiet and target controls match the suggestion. Advice never changes the save, route record or turn count.

The search stops after 25,000 expanded positions. Hitting that bound is explicitly unknown, not proof of impossibility. No-route is reported only for an exhausted reachable graph. Routes exceeding remaining journal capacity are not offered as playable. The initial third meadow hits the bound; a progressed final-meadow position succeeds. This is not a universal-solver claim. Search is synchronous; device latency requires rendered review.

## Checks

35 tests pass: 18 engine, 17 jsdom 26.1.0. All previous 29 retained, including original/quiet/named full routes, progression, per-action reload, corrupt saves/recovery, storage failures, reset isolation and navigation. Six added tests cover legal-route replay without mutation, bounded unknown versus proven trapped/complete positions, progressed final-meadow recovery, a full first-meadow UI campaign using advice then confirmation, pause/modal/hide guards, and clearing stale advice after target/mode/manual/undo changes. Both scripts parse.

The first two initial meadows yield 11/9-step routes. The engine fixture with dog 1 and sheep [6,7] is exhaustively trapped; a one-position budget on the final meadow is unknown. These distinctions are tested separately. No rendered browser, screenshot inspection, native focus/dialog/touch behavior, human enjoyment, universal optimum or complete-repository build is claimed. Existing rendering security-policy rejection was not retried or bypassed.

## Preservation and next work

Third branch started at `dcb462d4a02c9ffa962b110f0cad891592416623`, with no AGENTS.md found in its tree. First-batch FINAL_REPORT re-read: 20 finished, nine historically selected and zero verified live. Second branch remains `3949e3d9f8e2e9846dc4c91c436d90b19bbbd341`. Its additional round remains six rendered verified and fourteen pending.

Main observed at `82305ac8fee3931a4c3adf7ba1f54b76bd7f07de`; changes since the prior observation are confined to Gummy Bay. The changed Gummy Bay index.html contains no Switch workspace/playerStudy/studyBtn matches. Launcher files remain unchanged from the previous check. Concurrent main content is preserved. Existing publication/access barriers were not retried; no new live or rendered navigation claim.

Exactly 50 third-batch slots remain: 19 built, zero qualified improved/browser-tested/integrated/live, 31 unassigned. Bellwether stays unlisted. Next: natural rendered play and screenshots, test adviser latency and learning value on desktop/touch, make the required substantive playtest-led improvement, verify full lifecycle, then select. Continue the remaining games and second-batch obligations. Automation settings unchanged.
