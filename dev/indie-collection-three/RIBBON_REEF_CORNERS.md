# Ribbon Reef corner repair

27 October 2026. Source [`1aa2b5566a423156d1a33166fb112fab33c74735`](https://github.com/ThatOneMop/study-desk/commit/1aa2b5566a423156d1a33166fb112fab33c74735).

## Weakness and change

Source inspection found that a small error in a net required redrawing the entire loop. This was not a rendered observation. Added Adjust corners: move any closed-loop vertex using a pointer handle or numbered selector plus arrow keys (Shift for fine movement), and remove unwanted vertices down to a triangle. Existing exact geometry/catch previews update before haul. Other vertices stay fixed. Pointer cancellation or lost capture restores the dragged vertex; extra pointers and blank-water drags are ignored. Pause/dialog/clear discard transient edits. Existing v1 saves and engine rules are unchanged.

## Evidence

All **22 tests pass**, including all 17 original tests: nine engine and thirteen jsdom 26.1.0 tests. New cases repair a fish-touching net into the original 470-rope clean catch without retracing; verify the committed polygon survives save/reload; test scaled pointer dragging, cancelled/lost capture restoration, triangle floor on deletion, native form key ownership, fine keyboard movement, additional-pointer isolation and pause/dialog cleanup. Existing three-reef campaign, loss/undo/retry, save corruption/quota and navigation-link assertions pass.

Script syntax check passes; 39 unique HTML IDs and 49 CSS rules parse. Dependencies installed outside repository. Simulated SVG bounds are not actual touch/layout evidence. No full repository build from the partial checkout.

## State and limits

Read first-batch baseline and current third ledger; no AGENTS.md in development tree. Main observed `d77f5490e7bf4f20723e9440d7e57c02c48e72c1`; concurrent Counterweight, Tea for Ghosts, catalogue and Gummy Bay changes were preserved. Its delta from `48184d01c5f0e9e1313fa58cdac2e17c114404f0` adds no Switch workspace control. Read current quality checklist and Gummy Bay playtest report; that other game's report does not verify this branch or authorize bypassing this environment's rendering restriction. No unchanged publishing retry.

Third batch remains **16/50 built, 0 improved/browser-tested/integrated/live**. Second additional round remains **6/20 rendered verified**, fourteen pending. Exactly fifty third-batch slots retained. This source refinement is pending rendered qualification and stays off the public catalogue. Need actual desktop/mobile play and screenshot inspection of handle density, finger occlusion, selector focus, concave edits, progression, loss/retry, saves and Games navigation before improvement credit or selection.
