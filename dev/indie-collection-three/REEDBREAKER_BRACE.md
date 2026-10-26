# Reedbreaker — directional brace

2026-10-26 · Implementation: `4632be8e78fc82c9aba25a05580c3119a55032c6`.

Source inspection identified no way to hold position: every successful existing action moved the ranger. Brace now spends one energy to face a direction while staying put. A faced adjacent attacker is blocked and pushed one tile back; water removes it. Rock or another beetle blocks the displacement but not the guard. Side/rear attackers still damage the ranger. Distant beetles move normally without an immediate attack. Empty-facing braces deliberately spend energy. Walk restores energy; brace competes with hook/dash resources.

The new mode has a native button and B shortcut. Direction controls and complete-turn forecasts include its response. Existing {type,d} journals accept brace and preserve old routes/save shapes/records. Retry restores full energy. All artwork is existing original art; no external dependencies or public catalogue changes.

20 tests pass: 12 engine, 8 jsdom 26.1.0, including the prior fifteen. Coverage includes directional block and exposed rear, last-beetle counter splash/win, rock and occupied push destinations, approach behavior, empty-facing cost, zero-energy no-mutation, all three brace-assisted routes with exact per-action forecast and reload, UI campaign completion, B shortcut, pause, retry and unrelated save preservation. Both scripts pass syntax checks. Demonstrated routes use 5/5/6 turns with 3/5/5 shield; the first is faster but takes more damage than the earlier full-shield route. No global-optimality or human-enjoyment claim.

No rendered play, screenshots, native input/layout review or full repository build. Existing browser security-policy rejection was not bypassed. This is a source-led refinement, not a completed improvement pass. Next: naturally play on desktop/touch, inspect directional readability and counter feedback, assess energy/health trade-offs, then complete a substantial playtest-led improvement before selection.

Starting third head: `bbde8cdfecda09d8792f1c3dff27da963bc48786`. Main observed: `37e79d805957cad5d28451890a001eb2ad3bb004`, including concurrent launcher/Gummy Bay changes. Fresh main index.html/app.js contain no Switch workspace matches. Shared navigation/catalogue, existing games and saves are preserved. No unchanged publishing retry or live release claim. No AGENTS.md found in the third tree. First final report retains twenty finished/improved, nine selected source, zero verified live.

Exactly fifty third slots remain: **14 built; 0 improved/browser-tested/integrated/live**. Second additional round remains **6/20 verified, 14 pending**. Unfinished candidates remain unlisted.
