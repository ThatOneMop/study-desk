# Ribbon Reef

Original batch-three candidate 56. Draw free-form closed nets to deliver exact catches from a finite shoal. Choose which fish to group now and which to leave for later orders. Keep protected rays and coral outside the loop, avoid crossing the rope, and reduce total rope used on repeat trips. This is geometric net drawing, distinct from rod-and-tension fishing, stencil layering, route programming and stone curling elsewhere in the collections.

## Play

Serve the repository over HTTP and open `games/ribbon-reef/`. Select **Take the spool**. Drag in the water, release to close the loop, inspect the preview, and select **Haul this net**. Arrow keys move the needle; Shift uses two-unit steps. Space begins/closes the rope, Enter hauls, Escape cancels. Native buttons retain their keys. Pointer coordinates scale through the SVG view box. Multi-pointer interference and cancelled gestures are ignored/cancelled. Use **Adjust corners** on a closed net to drag a handle or select a numbered corner and nudge it with arrows/Shift. Remove corner simplifies the loop down to at least three corners. Cancelling a drag restores that corner; geometry and catch previews update without spending a turn. Haul commits the edited polygon using the unchanged v1 format. Actual touch usability is not verified yet.

Each of three authored reefs has six delivery fish, three orders, a fixed spool budget per loop, protected rays and coral. Fish stay still; there is no timer. Wrong catches and coral snags release everything and cause one fray. Three frays end a trip; Undo or Retry recovers. Invalid rope geometry or rope touching a fish is rejected without a turn. The preview reports whether a catch is clean, so the player can refine it before committing.

Completed trips unlock the next reef and retain the smallest total rope use (all valid hauls, including failed ones). Undo/retry preserve best records. An early grouping can leave an awkward later order; undo is intentionally available. There is no claim that every possible partial grouping is completable within the spool budget.

## Implementation and saving

Static HTML/CSS/JS; no build step or runtime dependency. `engine.js` owns simple-polygon validation, segment distances, point containment, exact species matching, journal replay and record progression. `game.js` owns SVG art, transient drawing, pointer/keyboard events, pause, dialogs and storage. The shared repository `../../bridge.js` loads first. All fish/coral sketches and code are original; no downloaded assets or third-party game collection.

Save key `study-desk-ribbon-reef-v1`: `{v:1,level,moves,records}`. Each committed move is an integer-coordinate polygon with 3–128 vertices. Replay reconstructs catches, orders, frays, total rope and outcome. Bounds, journal length, locked reefs and terminal-overrun journals are rejected. Unreadable stored bytes remain untouched until explicit Recover or Reset. Storage failures leave the current session playable. Uncommitted drawings are intentionally not saved and are discarded on pause, navigation hiding, dialogs or reload. Reset changes only this game's key.

## Checks and limits

`node --test tests/ribbon-reef-engine.cjs tests/ribbon-reef-dom.cjs` (DOM tests require jsdom 26.1.0; install outside the repository).

Hand-authored complete routes are in `tests/fixtures/ribbon-reef-routes.json`: 1430 / 2108 / 1600 rope. These are feasible routes, not optimal solutions or human playtests. Automated input checks include reload after every haul, keyboard drawing, 300×200 simulated SVG bounds, loss/undo/retry, dialogs, trusted parent visibility, isolated reset and corrupt/quota saves.

Rendering is blocked in the current environment. The three small authored reefs need natural desktop/touch play, screenshot inspection, visual/feedback refinement and a substantive playtest-led improvement pass. Especially assess finger occlusion, available drawing space, concave-net clarity, third-reef challenge and whether exact catch previews make the loop too easy. No browser-tested, improved, integrated or live credit; absent from the public catalogue.
