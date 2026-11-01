# Ribbon Reef — corner casting development pass

1 November 2026. Candidate56 is qualified, integrated and live as of the release recorded below.

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


## Full qualification — 1 November 2026

Candidate56 now qualifies as improved and browser-tested; catalogue/live credit remains separate. [CI41283986102](https://github.com/ThatOneMop/study-desk/actions/runs/41283986102) passed on f6c1534ec123c2a0bba7cf9174a1517b058df485. 27 engine/DOM checks pass. Chromium desktop1280×1000 and touch-emulated390×844 complete all three reefs in both casting modes, producing records1430/2108/1600 and retaining the journal after every haul. Covers closed-corner repair, keyboard casting in both modes, unfinished unpin, pause, invalid crossing, three-fray loss, undo/retry, native Escape, navigation, corrupt-save preservation/recovery, isolated reset and quota failure. No horizontal overflow or page errors.

The first rendered run exposed an ignored Haul tap immediately after a continuous touch drag. Event diagnostics showed pointer-down/up on Haul but no click. Waiting for completion, touch CSS and consistent input identity did not resolve it; the CSS experiment was reverted. daad73576ea6950465fa0b34bb2e13ade56b7d81 handles deliberate touch release directly, and f6c1534ec123c2a0bba7cf9174a1517b058df485 cancels gestures that travel away and return. Cancellation, bounds, extra identity and duplicate-click guards are covered. The same previously failing route now passes without retrying the tap or adding an arbitrary delay.

Artifact13073673756 has58screenshots; downloaded ZIP SHA256 dd21b8f57c4be97c731567c76577b884ead81c7a7d7f29ad97c3478fa8fc9b77 matched. Inspected touch-trace-reef1-net2, touch-loss, touch-repaired-corner and desktop-pins-reef2-net1: readable species, coral exclusion, handles, loss/retry and wrapping controls. Vertical scrolling remains. This run also naturally completed Sandbar Post at1472rope (494+486+492), reloaded that completion and previewed a781rope concave Coral Arch catch; the latter uncommitted draft was cleared by development hot reload. Previous Coral Arch2165 completion remains separate evidence.

Selection assessment: distinct relaxed geometric planning, meaningful group/rope choices and reversible corner controls justify catalogue testing. Three compact static reefs and exact previews limit campaign depth. No optimality, physical-device, human-enjoyment or duration claims. Third totals:24built/16improved/16browser-tested/15integrated/15live until promotion completes.


Release: RIBBON_BELLWETHER_INTEGRATION.md records integration425044f92c98e4800c74e3a3e3b8fb2a11c0e427, passing regression and liveSandbar1436rope save/navigation verification.
