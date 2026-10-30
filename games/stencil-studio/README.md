# Stencil Studio

Original, unlisted third-collection candidate 41. Rotate and position three stencil shapes on a 5×5 sheet, combining Sea/Rose/Sun inks to match three authored commissions. Five operations per sheet; undo/retry and best-operation records support experimentation. Static HTML/CSS/JS with no external art or runtime dependencies.

## Selective ink lifts

Toggle Lift selected ink to remove only the chosen colour under the stencil. Other colours and all cells outside the stencil remain untouched. This repairs earlier mistakes without discarding later layers. A lift uses one of the same five operations; a lift with no selected ink has no effect and is rejected free. Forecasts display the exact resulting colours, extra ink and remaining differences before committing. Undo restores removed ink. The toggle resets to printing on reload; committed lift operations remain in the journal.

Existing five-number print entries, setup and save key `study-desk-stencil-studio-v1` remain unchanged. Lift entries append a sixth number, -1. Decoder replays legal operations and rejects malformed/no-op journals. Records retain their prior values. A demonstrated wrong-print / valid-layer / targeted-lift / two-further-layer route completes the first commission in five operations. Original three-operation recipes still work.

Keyboard arrows position, R rotates and Z undoes; Space prints/lifts outside native form controls. Space on buttons, links or summary elements is no longer intercepted, preserving their native activation. The checkbox, shape/ink buttons, bed buttons and action controls support pointer input. Physical touch/native keyboard and mobile layout still need rendered validation.

20 tests pass: 12 engine, 8 jsdom 26.1.0, retaining the original 15. Run from the repository root: `node --test tests/stencil-studio-engine.cjs tests/stencil-studio-dom.cjs` with jsdom available via NODE_PATH. Tests cover all original commissions, exact legacy saves/setup, selective channel removal, later-layer preservation, read-only forecasts, corrected five-operation completion, allowance/no-op rules, undo/retry/records, invalid journals, UI preview/commit/reload, pause/guide and native button Space ownership. Dialog APIs and key events are simulated. Scripts pass syntax checks.

Source inspection motivated this refinement; no rendered-playtest improvement credit. Naturally play the lift/print distinction, inspect screenshots and mobile controls, assess whether repair choices add depth, then implement the required rendered-led improvement before catalogue selection. No full repository build, live release, human enjoyment or content-hours claim.


## Rendered comparison and verification —30 October2026

Optional on-bed comparison labels planned missing/excess inks; a full-size selected-square readout names current, target and planned inks. This preview does not spend an operation; committed journal/save formats stay unchanged. The comparison toggle is session-only.

CI41038068546 at 5a04fa27ee8c39adb0b9fb0a70ac9b40af1ef221 passed27 focused tests, complete desktop1280×1000 and native-touch-emulated390×844 UI campaigns, all3 commissions, exact mid-layer saves/reload, selective five-operation repair preserving later layers/best records, planned comparison and readable full ink names, pause, deliberate loss/undo/retry, keyboard and native taps, isolated corrupt-save preservation/recovery/reset and return to development launcher. Asset checks passed63 bundled routes/231 HTML references and source syntax; all9 selected first-batch release hashes/links/credits passed. Artifact12968981163 SHA256bcc81eff9c51ac2a738e4f080bc209c858be9bfa53f32691f93248123a3c7089 contains18 screenshots. Inspected touch-repair-preview, touch-repaired-win and desktop-commission-2: correct preview-versus-current distinction, readable repair cost/ink diagnosis, intact best records and all3 completed prints. Phone requires vertical scrolling. Automated reliability and agent visual assessment, not human enjoyment or physical-device testing.

The earlier unverified notes above are historical. This candidate now has one verified rendered improvement pass and awaits integration into current main. No public launch is claimed. See dev/indie-collection-three/STENCIL_VERIFIED.md.
