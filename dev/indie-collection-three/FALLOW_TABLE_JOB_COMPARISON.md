# Fallow Table: job comparison checkpoint

1 November 2026. Implementation: 355fb70104bef5e522fbe4381226f9a82eacf77c. Development branch only; public main remains 3bf083bbcfbf11ee5cadbe669b079b74a7a62d1a.

## Observed weakness and change

During natural Kitchen garden play, picking standing beans reduced adjacent squash's next-night water from2 to1. Existing forecast disclosed this only after spending work, obscuring the tradeoff between harvesting food and keeping shade.

Before: Only the current board's overnight outcome was visible; trying a harvest or transplant needed a real action followed by undo.

After: Optional job comparison shows work, compost, basket, soil, water, crops and bean shade before/after, plus next-night no-further-jobs versus proposed-job outcomes. Explicit commit spends work; merely selecting jobs changes neither journal nor resources. Winning and final-day jobs do not invent another night. All six jobs share the original validated rules; v1 saves retained.

The panel is optional, uses native controls and explicitly says that projections assume no later jobs today. It supports water, sow, pick, green manure, transplant and compost. Invalid jobs cannot commit. It recomputes from the current bed/seed/destination; no stale preview data is persisted. Native dialog cancellation now clears pending work and refreshes control availability on close; embedded Games requests the existing parent Collection navigation.

## Evidence

CI41300403660 at 355fb70104bef5e522fbe4381226f9a82eacf77c passed37 focused checks (21 engine,16 DOM), syntax,63 bundled routes/231 HTML asset references and all9 selected first-batch integrity checks. Natural CUA desktop play exposed bean harvest removing squash shade (next-night water2→1); new preview predicted it before commit, subsequent night/reload matched. Completed Kitchen garden through new job controls on day6 with8 work points, reloaded win/record, undid/recommitted winning harvest, cancelled retry with native Escape, and confirmed retry retaining record. Inspected baseline, expanded harvest comparison, winning preview and390px iframe screenshots. Narrow native Space planted exactly once.390px harness uses desktop pointer, not touch emulation. Other two rendered contracts, touch, complete loss/recovery and real catalogue integration remain pending; no human enjoyment or content-duration claim.

Natural first-garden route: day1 bean in bed5, squash in bed2, carrot in bed1; day2 pick carrot; day3 pick bean, checking lost shade; day4 pick squash, plant bean in bed1 and carrot in bed3; day5 pick carrot; day6 pick bean. Beds here are one-based. The final preview correctly says the basket completes instead of predicting another night. Reload kept basket4/4/5 and record8. Preview is transient; only committed actions survive.

Screenshots inspected: desktop baseline, changed shade comparison, expanded squash harvest comparison, winning bean preview and390px planting comparison. Narrow layout wraps correctly with vertical scrolling; no native-touch claim. An immediate post-Escape query briefly observed disabled controls before the browser close event; the subsequent DOM showed unlocked retry/undo and correct record, and the confirmed retry worked.

## Checks and limits

[CI41300403660](https://github.com/ThatOneMop/study-desk/actions/runs/41300403660) succeeded. This is source/simulation/asset validation, not a full rendered campaign suite. The managed local browser preview worked; historical browser-blocked notes are superseded for this desktop/narrow session. No current deployment failure was retried: the prior Rill & Root release is verified live and main is unchanged.

Batch3 remains24built /18qualified-improved /18browser-tested /18integrated /18live, with exactly50 candidate slots. Fallow59 stays unlisted and is not counted as qualified yet. Batch2 remains20implemented,20initially improved,20additional-round verified,9selected/integrated/live. First batch is untouched.

## Next

- Qualify the job comparison with complete desktop/touch rendered campaigns through all three contracts, natural loss/recovery, save/reload, reset/undo/retry, pause/hidden bridge and navigation.
- Inspect screenshots and compare quality before fresh-main catalogue promotion. Keep unlisted until qualification.

No automation changes. The total task is incomplete; do not pause it.
