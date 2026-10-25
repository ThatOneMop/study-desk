# Copper Cadence silent catches — 25 October 2026

Implementation: [8ae2c4dde78e3e95744a74f34e6a0c5ffea1c7d9](https://github.com/ThatOneMop/study-desk/commit/8ae2c4dde78e3e95744a74f34e6a0c5ffea1c7d9), on indie-collection-two-dev only.

## Before and after

Source inspection suggests the short fixed commissions lack a choice between retaining an unwanted bead and sounding it. This remains a source-based design hypothesis, not a rendered observation.

Two silent catches per take recycle one selected exiting bead without producing its note. Its brake must be open and a bead must already occupy its exit; failed proposals do not advance time. Recycling happens before the current feed, allowing a caught bead to enter another track. Other lanes sound normally. Each catch counts with brake beats against the third-seal efficiency allowance. Missing/extra note scoring is unchanged, so catching a required note hurts accuracy.

The three catcher controls and 4/5/6 shortcuts stage one crank only. Toggling cancels. Forecasts include caught notes, stock and charges. The original SVG machine adds a labelled catching cup; the layout adds three minimum-44px buttons. Focus is retained when controls redraw. Guards prevent dialog/bridge-paused clicks and keys from changing gameplay. These visual/layout changes still need rendered review.

## Evidence

31 engine and 28 jsdom checks pass (59 total), with both gameplay scripts passing syntax checks. Command: `NODE_PATH=/tmp/copper-check/node_modules node --test tests/copper-cadence-engine.cjs tests/copper-cadence-dom.cjs`.

All five original campaigns retain three seals. Five separate fixtures introduce an extra circulating bead and catch it before an unwanted sound, completing without note errors. Their seals are **2/2/2/3/3**: catching consumes efficiency allowance, but later commissions can retain enough allowance for a third seal. These are reliability routes, not evidence that adding an unnecessary bead is a better strategy.

Tests cover actual pipeline occupancy, stock conservation, same-beat recycling/feed, missing required notes, exhausted charges, invalid/braked/empty targets, atomic rejection, one-turn trace semantics, every-action replay, legacy records, staging/cancel, keyboard/button inputs, saved catches, focus, undo refunds, loss/retry, scoped restart and navigation markup. Original sound opt-in tests use stub audio; no audible quality claim.

The unique save key and version remain unchanged. Legacy actions omit the optional catch field and replay with zero catches. New histories derive spent charges from legal actions instead of trusting saved stock. Best records retain the existing comparison rule, with the revised medal result.

## Status and next steps

Second batch: 20 initially built/improved/finished; **6/20 verified additional passes**, 13 implemented source upgrades awaiting rendered review, one additional implementation pending (Lanternwake). Final comparison/integration remains outstanding. Previously integrated initial games are preserved; no public catalogue change or new live release.

Third batch unchanged: **6/50 prototypes built; 0 completed improvements, browser-tested, integrated or verified live**.

Main remains `85d941d59e8897585606e5a67f4413a710643067`; third branch remains `ab12bd0d63f2a4cdc4579be3f811a6f4693c1161`. The existing workspace-control audit applies to unchanged main. No repeated publishing attempt or browser-policy workaround was made. Full repository gates were not run from this partial checkout.

Next: supported rendered before/after observation, actual desktop/touch play and screenshot inspection, then balance/layout iteration. Continue Lanternwake and remaining third-batch source work independently. No rendered improvement credit or completion pause yet.
