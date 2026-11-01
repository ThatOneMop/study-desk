# Ribbon Reef — corner casting development pass

1 November 2026. Candidate56 remains unpublished and not fully qualified.

## Observed baseline
Natural managed-preview desktop play completed Sandbar Post with three keyboard-drawn rectangles:500+500+480=1480 rope,0frays. Reload after the second catch preserved Order3 and1000rope. Completion unlocked Coral Arch. Screenshots inspected: species markings, coral safety circle, protected ray, catch preview and completion were readable; the large water area requires scrolling to the haul controls. Keyboard rectangles required many intermediate arrow steps. Coral Arch introduces concave routing around coral, making continuous drawing less comfortable to plan and repair.

## Concrete change
Optional Place corners casting lets the player tap each turn separately, remove the last unfinished corner and explicitly close the loop. Keyboard arrows aim without adding rope; Space pins, Backspace removes, Enter closes and a second Enter hauls. Closed nets retain existing corner adjustment. The continuous-rope mode remains available. Changing mode clears only the uncommitted drawing. No scoring, reef, save-key or v1 journal changes.

Also repaired the pending reset/recovery confirmation guard while paused, native dialog-close rendering, and embedded Games return through the existing collection bridge. These safeguards do not count as a separate gameplay pass.

## Evidence and limits
26 checks passed:9engine+17DOM, including all previous22. New tests complete all three reefs via pinned corners with exact journal/reload, preserve outlines on pointer cancellation and secondary touches, verify scaled coordinates/unpin/mode clearing, keyboard aim/close/haul and paused reset safeguards. Syntax passes.

Natural post-change desktop play on Coral Arch pinned a nine-corner concave net around two Silver sprat, excluding the coral in its notch. Preview matched the order at745rope; haul advanced to Order2 without frays; reload retained the catch and745rope. Screenshots of the new controls and concave outline were inspected. Casting mode resets to continuous rope on reload; committed nets remain saved.

No full rendered three-reef run, touch-emulated or physical-device test, human-enjoyment evidence, integration or live credit. Additional-round total remains15/50. Next: finish both casting modes in rendered desktop/touch tests, inspect mobile layout, loss/undo/retry, native Escape, save/reset and real launcher navigation before qualification. Consider whether later-order visibility and tighter-route replay need another game-specific improvement.

## Narrow-layout continuation

A390×844 authored iframe harness with desktop pointer completed Coral Arch after the initial745rope net: a four-corner amber-pair net560rope and an eight-corner silver/amber net860rope with a notch excluding the upper coral. Total2165rope,0frays; reload retained the completed trip and record and unlocked the next reef. Inspected phone-width controls, water and result screenshots. Text and controls wrap legibly; vertical scrolling is needed. This is a narrow-layout desktop-pointer test, not native touch emulation or a physical phone. Third reef/full failure/retry/touch/launcher qualification remains pending.
