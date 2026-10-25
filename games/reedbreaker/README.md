# Reedbreaker

Third collection slot 48; unlisted development prototype. Original deterministic tactical shoving game with authored CSS art and no runtime dependencies.

Walk one square to recover one of two energy points. Dash up to three squares for two energy; the first beetle is shoved one square and skips its response. Water removes it. Rock or another beetle blocks the shove. The ranger cannot enter water. Remaining beetles attack if adjacent, otherwise move toward the ranger, trying their numbered axis priority first. Clear both beetles to unlock the next bank. Three authored banks each start at six shield; fewest-turn records persist through retry. No clock or real-time damage.

Direction focus/hover previews the entire turn including enemy responses. Arrow keys move; D/W choose dash/walk. Buttons are designed for keyboard and touch with 44px targets; rendered/mobile verification is pending. Pause and same-origin parent hide messages guard actions. Retry, reset and unreadable-save recovery require confirmation. P remains reserved for the shared bridge.

Only `study-desk-reedbreaker-v1` is read or changed. Saves contain version, bank, bounded replay journal and local best-turn records. Decode validates replay and unlocks; extra fields are discarded. Corrupt saves are preserved until explicit recovery/reset. Quota errors leave a playable temporary session. Records are local metadata, not authenticated scores. The 300-action journal ceiling is a storage bound, not a gameplay target.

## Evidence and limits

`node --test tests/reedbreaker-engine.cjs`

`NODE_PATH=/path/to/node_modules node --test tests/reedbreaker-dom.cjs` (jsdom 26.1.0)

Five engine tests and four DOM tests pass. Saved winning routes clear the banks in 8/5/6 turns with 6/5/5 shield respectively. A state-space search found these routes; they are automated evidence, not a measure of enjoyment. Checks cover exact forecasts/reload, unlocks, water/rock/occupied shove behavior, energy, loss/retry, malformed saves, modal/keyboard/pause/bridge handlers, storage failure and navigation markup. Dialog methods are simulated. No screenshot, rendered play, actual touch/native keyboard activation or complete-repository build is claimed.

This is a compact three-bank prototype. Assess readability, enemy predictability, dash choices and depth through rendered desktop/touch play before making the required substantive improvement pass or adding it to the public catalogue. Existing saves, games and shared launcher files are untouched.
