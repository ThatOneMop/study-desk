# Bramble Pact — neighbour invitations

2026-10-28. Source commit: [35af85ed98c71bfb35616c97d50ff9e854db4eff](https://github.com/ThatOneMop/study-desk/commit/35af85ed98c71bfb35616c97d50ff9e854db4eff).

Source-based weakness: the one woodland offer could avoid a harvest but always left the player leading after a win. There was no way to sacrifice that lead to change the next suit/order. This observation is from source and engine inspection, not rendered play.

Added an optional native selector alongside the offer: keep the lead (default), invite Wren, or invite Moss. If the offered trick wins, its harvest remains in the woodland and the selected neighbour starts the next trick. Their existing deterministic leading rule then applies. If the player loses, the invitation has no effect and the actual winner leads; the offer is still spent. The final trick excludes invitations because there is no subsequent lead. No extra resource or repetitive levels were added.

Exact forecasts name the next leader, completed history records invitations, and undo restores the previous hands/offer. New journal action field `passLead:1|2` is accepted only alongside `gift:true` before the final trick. Old journal actions, board shapes, outcomes and records remain unchanged. Save key/version stays v1. Selection resets after moves/retry/reload and does not itself modify saves.

## Verification

31 tests passed: 15 engine and 16 jsdom 26.1.0. All original 25 checks retained; six new tests cover six complete invitation routes (both neighbours, each of three picnics), per-action replay and UI save/reload, conservation of eighteen cards, changed next-table preparation, strict invalid actions, final-trick exclusion, offer cost after losing, preview purity, next-leader forecast, native-control/modal/pause guards and undo. Production scripts parse. Original-action exhaustive branch counts remain unchanged; no exhaustive claim is made for the expanded action set. Tests load the real bridge with a simulated parent and stub dialogs; this is not rendered browser evidence.

Source baseline, latest branch heads and first-batch FINAL_REPORT were checked. No AGENTS.md exists in the current third-branch tree. No shared bridge, main catalogue, first/second games or their save keys were changed. Existing source Switch-control audits remain applicable at unchanged main/second heads; the new selector adds no workspace control. Static project conventions remain unchanged, with no root build; no full-repository regression claim from this partial recovery.

The existing browser policy blocker was not retried or bypassed. No screenshot inspection, real keyboard/touch layout verification, human enjoyment judgment or live release is claimed. This is a pending source refinement, not a completed playtest-led improvement. Render the invitation flow and assess whether it creates useful planning or merely simplifies exact-quota puzzles before qualification.

Counts unchanged: third 23/50 built, 0 qualified improved/browser-tested/integrated/live; second additional round 6/20 verified, 14 pending. Exactly 50 third slots retained. Keep this game unlisted.
