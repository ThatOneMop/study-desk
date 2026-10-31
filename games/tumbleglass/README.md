# Tumbleglass

Original Study Desk sliding-bead puzzle, third-collection slot 50. Tilt the tray to nest numbered beads in matching sockets. Edge-most beads move first; nesting locks a bead into an obstacle. One clamp holds a loose bead for a tilt, and one lift moves a bead one cell, including out of a socket. Unlimited undo supports relaxed experimentation.

Three compact authored trays unlock sequentially. Glassmaker’s studies reward three approaches on each: no tools, a clamp that changes the resulting layout without lifting, and lifting an already nested bead before finishing. Each study retains its shortest verified winning journal. These are alternate goals on three trays, not nine additional levels. Check tray optionally advises ordinary completion, not technique optimization. No content-hours or human-enjoyment claim.

Arrow keys work on the page/tray; native menus keep their keyboard behavior. Touch direction buttons sit immediately beneath the tray on narrow screens. Desktop uses a shared board/control bench. H/L marks identify the selected tool target. Pause, parent visibility and modal guards protect input. Games returns to the real Collection when embedded.

Only `study-desk-tumbleglass-v1` is written. Legacy journals remain readable. Optional study journals are replay-validated, including their required technique; old general records alone cannot prove technique awards. Undo/retry preserve best records and studies. Clear progress affects only this game. Unreadable saves remain intact until explicit recovery/reset; unavailable storage allows a temporary session. Records are local, not authenticated scores.

Original JavaScript, CSS glasswork and SVG cover; no third-party runtime assets or packages. Static hosting with the Study Desk bridge.

## Verification

`node --test tests/tumbleglass-engine.cjs tests/tumbleglass-dom.cjs` requires jsdom 26.1.0 via NODE_PATH. There are 29 focused checks, including exhaustive advisor verification across 1,127 reachable states, legacy/current saves, technique validation, undo/retry, recovery and input guards.

`node tests/tumbleglass-browser.cjs` and `node tests/tumbleglass-catalog-browser.cjs` use Playwright 1.58.2 Chromium in CI. Candidate run 41191843917 passed 18 UI-driven technique wins (nine each on desktop and emulated touch), every-action reload, recovery, scoped reset, native Escape, pause and navigation. Promotion run 41191942404 at c9eebba0c66efd8f8d8979260edb8e2d6307cb62 passed 242 focused checks, all ten selected third-batch gameplay/catalogue suites, 60 bundled routes/303 asset references and first-batch selected integrity. Final desktop/phone screenshots were inspected. Emulated touch is not a physical-device test.

Development history and selection evidence: `dev/indie-collection-three/TUMBLEGLASS_RENDERED_PASS.md` and the separate 50-slot ledger on `indie-collection-three-dev`.
