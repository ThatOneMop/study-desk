# Last Lighthouse initial checkpoint — 24 October 2026

Slot 40 now has playable original source at `games/last-lighthouse/`, committed as `88b6d16534ad9d1b7b0227810b5692cdf799c1c7`. It is intentionally unlisted and unfinished.

Arrange six optical relays on a seven-by-seven harbour chart, trace light for free, then spend battery to guide each waiting ship. Missed signals and exposed cranking damage the convoy. Three short authored harbours contain six ships, different relay geometry and blocking shoals. Sequential unlocks, best-signal records, undo, retry, pause, keyboard controls, confirmations and isolated replay-validated saves are implemented. Artwork is original CSS/SVG plus platform glyphs; no external assets or game collection.

Four engine checks pass: all six ships reachable with ordinary relay actions and exact saves, loss/undo/retry, power/hull tradeoffs, atomic invalid actions, locked harbours and malformed journal rejection. Cloud desktop play completed Lantern Reach naturally: turn relay 1 and 2 to slash, signal the northern boat, turn relay 1 and 5 to backslash, signal the southern boat. Two-signal success unlocked Broken Shoal. Completed screenshot inspected; beam path, harbour log and controls were readable.

Observed weakness: the clean route leaves spare power, so the nominal power budget rarely creates a useful decision. Replaying fixed ship positions also has shallow progression. These require a substantive initial gameplay pass; cosmetic changes or more repeated harbours do not qualify. The separate additional-round pass must follow, not reuse that work. No human enjoyment, optimality or playtime claim.

Native desktop/touch CI: https://github.com/ThatOneMop/study-desk/actions/runs/40084157781 (pending at initial checkpoint). Tests use ordinary button/tap routes, mid-plan and won reloads, all harbour unlocks, natural loss/undo/retry, pause, cancellation, isolated reset/recovery and Games navigation. Screenshot inspection is recorded separately after completion.

Totals: **20/20 playable; 19 initially improved and finished; 6/20 additional upgrades**. Third batch remains **0/50 built/improved/tested/integrated/live**. No new catalogue integration or live release. Thirteen earlier second-batch entries on main are concurrent source integration, not completed final selection. Main was reread at `18b81b1d0a3c73a04268c84ba734b12ffd9bf37a`; development parent `1e3215252ff4c40e300501de0b277c234a06cc08`. First-batch report reread: twenty finished, nine selected; source and saves preserved. Previous Windup CI 40080637524 now has all seven jobs successful.

Existing workspace-control/publication audit retained; no unchanged publishing failure retried. No public shell, catalogue or Gummy Bay edits. Remaining work: Last Lighthouse initial improvement and verification, fourteen separate additional upgrades, slate comparison/integration, and all fifty third-batch games.

Checks job 120843561920 passed **717 checks** (425 engine, 292 DOM) plus preservation gates. Cloud reload retained the completed harbour and two-signal record. Native campaigns remain pending at this documentation checkpoint.

## Native verification completed

Native CI 40084157781 job 120843842346 passed desktop and emulated touch: all six ships/progression, exact saves/reload, loss/undo/retry, pause, cancellation, isolated reset/recovery and navigation. 22 screenshots retained in artifact 12556472208; touch-path-2-0 and desktop-win-2 inspected. No horizontal clipping; phone signal requires scrolling below board. Initial improvement still pending.

ZIP SHA256: `47dbf636760d8c362c780da337fe34eab06810d099e6e97ad07e69e282cc42df`. Automated routes demonstrate reliability, not human enjoyment or physical-device certification. Broader browser groups still running at checkpoint. Status stays playable, not improved/finished.
