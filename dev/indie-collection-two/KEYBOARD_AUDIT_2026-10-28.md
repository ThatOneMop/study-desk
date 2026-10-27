# Second collection embedded controls repair — 28 October 2026

Implementation: [a7093b27d87356c6f39842dc4b5a2bde8c36ad8e](https://github.com/ThatOneMop/study-desk/commit/a7093b27d87356c6f39842dc4b5a2bde8c36ad8e).

## Confirmed defect and fix
Murmuration advertised P to pause, but Study Desk's actual shared bridge consumes plain P inside embedded games for workspace navigation. Standalone tests used a bridge stub and missed the conflict. A new test with actual bridge code and a simulated parent reproduced P being intercepted and the new K behavior missing before repair.

K now pauses/resumes. Help text, hint and aria-keyshortcuts match. Modifier and composition events leave gameplay controls alone. Visibility messages now verify parent rather than assuming the game is its own parent; standalone behavior remains compatible because parent equals window there. Engine and saved input trails are unchanged. P remains the shared navigation key.

## Verification
32 tests pass: 18 engine, nine standalone DOM and five real-bridge/jsdom tests.
NODE_PATH=/tmp/murmuration-bridge/node_modules node --test tests/murmuration-engine.cjs tests/murmuration-dom.cjs tests/murmuration-bridge.cjs

New bridge checks use a simulated parent and deterministic RAF, with canvas drawing disabled. They verify reserved P navigation without game pause, K freeze/resume of a moving flock, exact paused-save reload, native controls, modifiers/repeats/composition, guide ownership, trusted parent visibility suspension and forged-origin rejection. The K regression failed before repair and passed after. Existing four full migrations, food-funded regroup mechanics, loss/retry, saves/recovery/reset and navigation checks pass.

The existing browser suite now includes desktop K pause/resume assertions. It parses but was **not executed**; no browser/CI workaround was attempted. Game script parses. No new screenshots, native touch, real rendered iframe, human enjoyment, full-repository build or live-release evidence.

## Source audit and preservation
Read first-batch final report, latest second tree/ledger/additional checklist and current source. No AGENTS.md in second tree. Audited game.js and index.html for all twenty second-batch candidates (forty files) at 3949e3d9f8e2e9846dc4c91c436d90b19bbbd341. No Switch workspace/playerStudy/studyBtn controls found; explicit reserved P action search found Murmuration only. This is a source audit, not dynamic proof of every shell behavior.

Starting main 55c330d9ec493afc40e81e89a371f64cbd5bd8b0; third 331f0f36d50344ab071469ea22ae93c4ef94cd2d. Both preserved. No main catalogue edit. Main lookup did not provide games/murmuration/game.js (404), so no public copy was changed or release claimed. Prior source/publishing audit is not repeated as new deployment work. Shared bridge unchanged.

Historical second-batch counts and evidence remain intact: twenty built/initially improved; additional round **6/20 verified, fourteen pending**. Murmuration retains its exact earlier verification commit; current control changes have a separate pending rendered-verification note. No new substantive improvement credit. Third remains **22/50 built; zero qualified improved/browser-tested/integrated/live**. Exactly twenty second slots and fifty third slots retained.

Next: supported rendered embedded desktop/touch verification of changed controls, fourteen pending additional-round reviews and remaining distinct third candidates. Existing browser security-policy blocker was not retried or bypassed. No automation changes.
