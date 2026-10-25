# Beepline

Third collection slot 49. Original looping-program flight puzzle; unlisted development prototype. No runtime dependencies or external assets. CSS garden/bee artwork is authored in source.

Choose one to six commands: F moves one square (hedges end the flight); G glides to a hedge while visiting intermediate flowers; L/R turn; S (Scout) moves one square when clear or turns right at a hedge. Scout rechecks its surroundings on every execution. The program repeats. Collect every flower and return to the hive. The three gardens teach short repeated turns, gliding and navigating an asymmetric hedge layout. Step inspects each square/turn; Back one step retraces playback without losing earned records; Run plays the same sequence and can be stopped. Editing rewinds the flight; records persist. Legacy-command minima remain 3/2/5 commands; with Scout, minima are 3/1/3. Scout is not universally shorter: the first garden still rewards a three-command fixed loop.

Simulation detects repeated position/direction/program-counter/flower-mask states rather than relying on an arbitrary timer. Glides stop safely at hedges. A return home after all flowers ends immediately, even during a glide. There is no real-time pressure; autoplay is only playback.

Controls: native selects/buttons, Space on the page or board to step, normal keys inside controls. Targets are designed at 44px minimum. Pause, editor changes, confirmation dialogs and same-origin parent hide messages stop autoplay. The P shortcut remains reserved for the shared bridge.

Only `study-desk-beepline-v1` is used. Saved data contains version, garden, program, playback cursor and bounded local command-count records. Decode validates legal program, computed playback bounds, sequential unlocks and completion consistency. Corrupt saves remain untouched until explicit recovery/reset. Quota failure leaves a temporary playable session. Local records are not authenticated scores.

## Verification

`node --test tests/beepline-engine.cjs`

`NODE_PATH=/path/to/node_modules node --test tests/beepline-dom.cjs` with jsdom 26.1.0.

Eight engine and seven DOM tests cover all three solutions, exact frame saves/reload, unlocks, crash/loop recovery, glide collection, records/edit/rewind, malformed saves, controls, Run/Stop, pause/parent guards, reset isolation and storage failures. The legacy regression enumerates all 5,460 F/G/L/R programs of length 1–6 per garden, retaining 37/785/48 wins and minima 3/2/5. A separate extended enumeration checks all 19,530 F/G/L/R/S programs per garden: 422/4,672/717 wins, minima 3/1/3. Three new UI routes exercise both Scout branches. Backward inspection is checked at every cursor, across reloads, and under autoplay/pause/dialog guards. Old v1 saves remain readable without migration. These counts are engine validation, not authored content counts or evidence of enjoyment. Dialog and interval APIs are simulated in DOM tests.

No rendered-browser play, screenshots, native keyboard activation, touch/mobile layout or full repository build is claimed. The three gardens are compact; no content-duration claim is made. Render naturally on desktop/touch, assess program/glide highlighting and debugging clarity, then make a substantive playtest-led improvement before catalogue selection.

## Pending source refinement

26 October: fixed command streams had no environment-dependent decisions, and playback could only advance or restart. Scout introduces a conditional choice; Back one step supports route diagnosis after failure or success. This follows source/engine/DOM inspection, not rendered play. It does **not** satisfy the required rendered-playtest-led improvement pass. Assess whether the one-command Hedge run becomes too easy and whether the Scout explanation/branch feedback is clear during natural play before selection.
