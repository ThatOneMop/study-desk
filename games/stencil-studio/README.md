# Stencil Studio

Original, unlisted third-collection candidate 41. Rotate and position three stencil shapes on a 5×5 sheet, combining Sea/Rose/Sun inks to match three authored commissions. Five operations per sheet; undo/retry and best-operation records support experimentation. Static HTML/CSS/JS with no external art or runtime dependencies.

## Selective ink lifts

Toggle Lift selected ink to remove only the chosen colour under the stencil. Other colours and all cells outside the stencil remain untouched. This repairs earlier mistakes without discarding later layers. A lift uses one of the same five operations; a lift with no selected ink has no effect and is rejected free. Forecasts display the exact resulting colours, extra ink and remaining differences before committing. Undo restores removed ink. The toggle resets to printing on reload; committed lift operations remain in the journal.

Existing five-number print entries, setup and save key `study-desk-stencil-studio-v1` remain unchanged. Lift entries append a sixth number, -1. Decoder replays legal operations and rejects malformed/no-op journals. Records retain their prior values. A demonstrated wrong-print / valid-layer / targeted-lift / two-further-layer route completes the first commission in five operations. Original three-operation recipes still work.

Keyboard arrows position, R rotates and Z undoes; Space prints/lifts outside native form controls. Space on buttons, links or summary elements is no longer intercepted, preserving their native activation. The checkbox, shape/ink buttons, bed buttons and action controls support pointer input. Physical touch/native keyboard and mobile layout still need rendered validation.

20 tests pass: 12 engine, 8 jsdom 26.1.0, retaining the original 15. Run from the repository root: `node --test tests/stencil-studio-engine.cjs tests/stencil-studio-dom.cjs` with jsdom available via NODE_PATH. Tests cover all original commissions, exact legacy saves/setup, selective channel removal, later-layer preservation, read-only forecasts, corrected five-operation completion, allowance/no-op rules, undo/retry/records, invalid journals, UI preview/commit/reload, pause/guide and native button Space ownership. Dialog APIs and key events are simulated. Scripts pass syntax checks.

Source inspection motivated this refinement; no rendered-playtest improvement credit. Naturally play the lift/print distinction, inspect screenshots and mobile controls, assess whether repair choices add depth, then implement the required rendered-led improvement before catalogue selection. No full repository build, live release, human enjoyment or content-hours claim.
