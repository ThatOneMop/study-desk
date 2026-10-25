# Lanternwake lantern hoods — 26 October 2026

Implementation [237c2d8fbae76778b706f0681fdcc76b86e240b9](https://github.com/ThatOneMop/study-desk/commit/237c2d8fbae76778b706f0681fdcc76b86e240b9) on indie-collection-two-dev. No public integration.

## Mechanical change

Source-based hypothesis: the same lantern cannot offer local illumination without also attracting moths. Previously the only way to stop attraction was to reclaim the light entirely. This is not a rendered weakness observation; access remains blocked.

H/button toggles an adjacent lantern, choosing least remaining life and then lowest map position. A closed hood reduces water-path light radius from three to one and excludes the lantern from moth target selection. Opening restores both immediately. Toggling spends one turn, burns one life and advances moths; no oil is refunded. Hoods do not shield lanterns from a moth that arrives while pursuing another light. Reclaim and expiry still work.

The existing planning system previews the full resulting light, moth positions and resource changes before committing. A labelled dark hood appears on the original pixel SVG lantern; the instrument panel reports hooded count. Modal and bridge guards prevent commands from leaking through paused/covered controls. Existing save key/version and legacy action journals remain intact; hood state is derived by replay.

## Evidence

**56 passing checks: 30 engine and 26 jsdom.** Both gameplay scripts pass syntax. Test command: `NODE_PATH=/tmp/lantern-check/node_modules node --test tests/lanternwake-engine.cjs tests/lanternwake-dom.cjs`.

- All five original three-medal routes remain unchanged.
- Three added fixtures, for crossings 2, 3 and 5, use hood close/open actions and finish with no damage and three medals. Exact action forecasts and per-action replay roundtrips pass. No additional complete hood routes are claimed for crossings 1 or 4.
- On crossing 4, naturally throwing east then rowing east leaves moths at positions 28/34. Closing the only lantern hood leaves them there; holding oars instead moves them to 19/33. Reopening the hood produces that movement immediately.
- Narrower light, turn/life costs, no oil refund, expiry, reclaim, deterministic adjacent-lamp selection, invalid/terminal refusal and undo are checked. A targeted interaction fixture verifies a moth can eat a hooded lamp while chasing a different exposed lamp.
- DOM routes verify staged preview/cancel/commit, saved hood reload, keyboard H, visible hood markup/count, undo, restart/cancel, unrelated saves and modal/bridge guards. Existing loss/retry, corrupt-save recovery and navigation-markup coverage passes.

These are engine and simulated interface tests, not rendered observation, actual touch, inspected screenshots or human enjoyment. Full repository gates were not run from this partial checkout. Hood contrast and the larger phone control group need visual review; balance and usefulness need actual play-led iteration.

## Status

Second batch: twenty initially complete; all twenty additional upgrades now have source, **six verified and fourteen pending rendered review**. This is not completion of the requested additional round, and final selection remains outstanding.

Third batch unchanged: **6/50 built prototypes; 0 improved, browser-tested, integrated or verified live**. Forty-four source implementations remain. Continue those while supported rendered review is unavailable.

Main remains `85d941d59e8897585606e5a67f4413a710643067`; third branch remains `ab12bd0d63f2a4cdc4579be3f811a6f4693c1161`. Existing catalogue, first-batch, saves and concurrent work are untouched. The earlier workspace-control audit remains applicable to unchanged main. No unchanged publication retry or browser-policy workaround was attempted. No new live URL is claimed.

Next: supported rendered before/after review and iteration for this upgrade, then actual desktop/touch controls, saves/reload, progression/loss/retry, restart/navigation and inspected screenshots. Keep the ongoing development task active.
