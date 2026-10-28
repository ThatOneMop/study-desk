# Bough Balance

Third-collection slot 64. Initial playable source, unlisted pending rendered testing and a substantive playtest-led improvement pass.

Arrange original paper-bird ornaments on a fixed hierarchy of hanging beams. Every beam must have zero net torque, and all hooks must be occupied. An ornament contributes weight × signed arm distance to its own beam. The entire child beam—including its one-unit frame and all descendants—loads its parent. A child's internal torque does not transfer as torque to its parent: the child hangs from a pivot.

Three compact mobiles increase structural depth: one beam; a root with two child beams; and a root, branch and two twigs. Select a bird and hook, inspect exact forecasts, and hang or swap. Moving an already-hung bird swaps occupants; a bird from the tray displaces the old occupant to the tray. Removal is reversible. No clock or loss penalty. Fewest-action records and sequential unlocks support replay; each puzzle has a tested solution using exactly one placement per ornament (4/6/6 actions).

This is a different loop from Counterweight's dynamic cargo hoisting, swing and ballast management: these are static, nested torque constraints with simultaneous beam goals. No existing game engine or art was reskinned. All SVG birds, structure drawings and CSS are original. No external art, audio or fonts; no audio implemented.

The diagram intentionally keeps beams level for readability; balance meters describe actual imbalance. It is a schematic, not a physical animation. The UI uses native buttons for both keyboard and touch intent. Actual rendering/readability and touch operation remain unverified.

## Controls / saves

- Select a lettered bird and numbered hook, then Hang / swap. Return to tray removes the selected hook's bird. Preview does not mutate progress.
- Native Tab/Enter/Space controls. On page/bird/hook buttons, 1–6 selects a bird, left/right arrows select a hook, H hangs, R removes, Z undoes. P remains reserved for Study Desk.
- Undo after success, confirmed restart, level selection and scoped reset preserve other games' saves. Best records survive undo/restart.
- Unique key `study-desk-bough-balance-v1`; strict replay of at most 200 actions and bounded records. The journal limit is a storage safeguard, not a content target. No save migration required for other games.
- Unreadable bytes are preserved during temporary play until confirmed recovery. Storage failures warn without stopping play. Trusted parent and document visibility independently guard input and confirmations; explicit resume required.

## Evidence

`NODE_PATH=/path/to/jsdom/node_modules node --test tests/bough-balance-engine.cjs tests/bough-balance-dom.cjs`

16 passing tests: 8 engine and 8 jsdom 26.1.0. All three winning routes through actual handlers, reload after every placement, unlocks, records, swaps/removal, mass/torque propagation, assignment identity conservation through depth three, strict save rejection, journal bound/retry, pure forecasts, native/composing/bridge keys, hidden confirmation and recovery, corrupt/quota saves and navigation markup. The real bridge is loaded with a simulated parent and stub dialogs. No rendered browser, screenshot inspection, physical touch, native-dialog or human enjoyment evidence. No full-repository build from the partial recovery.

Before qualification: render all mobiles at desktop and phone sizes, inspect the diagram and controls, play unfamiliar arrangements naturally, and implement a meaningful improvement based on the weakest observed aspect. The three fixed puzzles may be too short; exact previews and simple arithmetic may limit replay. Assess those questions instead of padding a campaign. Do not count this source implementation as a qualified improvement or catalogue release.
