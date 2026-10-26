# Reedbreaker

Third collection slot 48; unlisted development prototype. Original deterministic tactical shoving game with authored CSS art and no runtime dependencies.

Walk one square to recover one of two energy points. Dash up to three squares for two energy; the first beetle is shoved one square and skips its response. Water removes it. Rock or another beetle blocks the shove. The ranger cannot enter water. Remaining beetles attack if adjacent, otherwise move toward the ranger, trying their numbered axis priority first. Clear both beetles to unlock the next bank. Three authored banks each start at six shield; fewest-turn records persist through retry. No clock or real-time damage.

Direction focus/hover previews the entire turn including enemy responses. Arrow keys move; D/W choose dash/walk. Buttons are designed for keyboard and touch with 44px targets; rendered/mobile verification is pending. Pause and same-origin parent hide messages guard actions. Retry, reset and unreadable-save recovery require confirmation. P remains reserved for the shared bridge.

Only `study-desk-reedbreaker-v1` is read or changed. Saves contain version, bank, bounded replay journal and local best-turn records. Decode validates replay and unlocks; extra fields are discarded. Corrupt saves are preserved until explicit recovery/reset. Quota errors leave a playable temporary session. Records are local metadata, not authenticated scores. The 300-action journal ceiling is a storage bound, not a gameplay target.

## Evidence and limits

`node --test tests/reedbreaker-engine.cjs`

`NODE_PATH=/path/to/node_modules node --test tests/reedbreaker-dom.cjs` (jsdom 26.1.0)

Nine engine tests and six DOM tests pass. Saved winning routes clear the banks in 8/5/6 turns with 6/5/5 shield respectively. A state-space search found these routes; they are automated evidence, not a measure of enjoyment. Checks cover exact forecasts/reload, unlocks, water/rock/occupied shove behavior, energy, loss/retry, malformed saves, modal/keyboard/pause/bridge handlers, storage failure and navigation markup. Dialog methods are simulated. No screenshot, rendered play, actual touch/native keyboard activation or complete-repository build is claimed.

This is a compact three-bank prototype. Assess readability, enemy predictability, dash choices and depth through rendered desktop/touch play before making the required substantive improvement pass or adding it to the public catalogue. Existing saves, games and shared launcher files are untouched.

## Reed hook

Choose Hook (H), then the direction toward an adjacent beetle. Spend one energy to step backward onto free land and draw the beetle into your old square. The hooked beetle skips its response; all others respond normally. Water, rock, occupied retreat or missing target blocks the action without cost. This allows drawing enemies away from obstacles, but competes with saving two energy for a dash. Forecasts include the entire response. Saves retain the original key/schema; old walk/dash journals replay unchanged.

Hook-assisted routes clear the three banks in 9/8/9 turns with 6/5/6 shield. In the third bank the tested hook route trades extra turns for one more shield than the original route. These automated routes establish mechanics and options, not measured enjoyment. This refinement comes from source/engine inspection and awaits rendered playtesting; it does not count as the required completed improvement pass.

## Directional brace

Source review found no hold-position option: all successful actions moved the ranger, limiting defensive lures. Brace spends one energy to stay on the current land tile facing a chosen direction. An adjacent beetle attacking from that direction is blocked and counter-shoved one tile away. Water removes it; rock or another beetle prevents the shove but not the block. Side/rear attacks still hurt. Distant beetles approach normally without attacking on the same turn. Empty-facing braces still cost energy, so this is a deliberate trade-off rather than free waiting. Walking restores energy as before.

The Brace button or B key selects the mode. Direction buttons/arrow keys commit it; the existing complete-turn forecast includes counters, health, energy, splashes and terminal results. It uses the existing `{type,d}` journal shape with `type:'brace'`; all legacy routes, saves and records remain compatible. Retry restores energy and retains records. No new assets/dependencies or catalogue entries.

20 tests now pass (12 engine, 8 jsdom 26.1.0), retaining the original fifteen. New checks cover directional blocking and exposed rear attacks, water counters/final wins, rock/occupied counter destinations, distant approach, empty-facing cost, zero-energy rejection without mutation, all three brace-assisted campaigns, per-action forecast/save replay, UI completion, B shortcut, pause and retry. Demonstrated routes take 5/5/6 turns and leave 3/5/5 shield points. The shorter first route takes more damage than the earlier full-shield route; this is not a universal dominance or global-optimality claim. Both scripts pass syntax checks. Route fixtures are automated input evidence, not human enjoyment.

No rendered play, screenshots, native touch or layout verification, or full repository build. This source-led refinement does not earn a completed improvement pass. Next: naturally play defensive facing on desktop/touch, inspect whether the forecast and counter feedback are clear, tune energy and enemy response trade-offs, and complete a substantive playtest-led upgrade before selection.
