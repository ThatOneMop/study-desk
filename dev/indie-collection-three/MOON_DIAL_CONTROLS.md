# Moon Dial — control and feedback repairs

25 October 2026. Source commit `f641f0ebe6f76d5ac6aa7cee0a6141de96ff3e9f`. Development only.

Code inspection identified that every render recreated every dial and hand element. This discarded focus and made the CSS transform transition ineffective. Selection was also held only in a local variable, so reload always selected A.

Dial and hand nodes now persist within a mechanism. Accumulated rotation moves a single 60-degree tooth through the 5/0 boundary and reverses correctly on undo. Dial selection saves immediately, including before a turn; older saves default to A. Saved selection is validated and clamped when changing to a smaller mechanism. Coupling focus is restored after updates. Per-dial labels explain which dials turn in each direction and which stay isolated.

Nine tests pass: five engine and four DOM. They retain all three original solutions, progression and exact reload checks; add old-save migration, invalid selection rejection, selected-dial persistence, node identity/focus, coupling focus, direction/isolation labels and transform values across wraparound/undo. Syntax and exact fifty-slot/count/catalogue-exclusion checks also pass.

These tests do not show actual rendered animation or touch usability. No screenshot, browser test, human enjoyment or completed improvement claim is made. The previous browser-policy blocker remains unresolved and was not bypassed. This source repair does not qualify on its own as the requested substantive playtest-led improvement. Three short mechanisms remain a depth limitation.

Third batch remains **2 built / 0 improved / 0 browser-tested / 0 integrated / 0 live**. Second batch remains twenty initially complete, six additional upgrades verified. First-batch baseline remains twenty finished/nine selected. No catalogue, earlier game or second-batch files changed. Main was reread at `85d941d59e8897585606e5a67f4413a710643067` and left untouched. No unchanged publication retry counted as progress.

Full repository checks were not rerun from the partial checkout restored after pruning. A GitHub comparison verifies the intended changed paths. Next: rendered desktop/touch review of focus, movement, legibility, saves/reload and navigation, followed by the substantive gameplay improvement that review supports; continue the outstanding second/third-batch obligations.
