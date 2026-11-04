# Warren Watch baseline — 4 November 2026

Candidate82 is implemented and baseline-tested on indie-collection-three-dev. It is **not substantially improved, fully qualified, selected or released**.

## Playable loop

Assign a shared ant workforce to forage, nurse brood, dig or guard. Visible weather changes food yields and raid pressure. Food capacity and growing upkeep make brood timing matter; two adequately nursed days hatch new workers. Excavated chambers increase storage and brood size. Establish a daughter colony with10 workers,2 chambers,22 food and4 health; starvation or unguarded threats can abandon the nest. Four forecast starts rotate one weather cycle, and best completion days survive restart. No timers, imported collection or external assets. Original SVG cutaway and MIT game source.

Implementation: [ff9dd1d14fc891170fd185d72433377e397a24bc](https://github.com/ThatOneMop/study-desk/commit/ff9dd1d14fc891170fd185d72433377e397a24bc).
Rendered-feedback correction: [e353626130347502e4c4c7b0be4437ae8cdf153c](https://github.com/ThatOneMop/study-desk/commit/e353626130347502e4c4c7b0be4437ae8cdf153c).

This is a workforce/lifecycle/resource allocation game. It differs from Moss Commons' spatial village placement and Beepline's flight-programming loop. No existing candidate is counted again.

## Evidence

CI41784253180 at e353626130347502e4c4c7b0be4437ae8cdf153c passed four engine checks and six rendered colony wins (three forecast starts at desktop1280×1000 and touch-emulated390×844), legal allocations, brood growth, chamber construction, per-action state assertions/per-day reload, records/restart, loss/retry, Space/Escape, pause, corrupt/quota storage, Games navigation and no horizontal overflow/page errors. Repository74 bundled routes/286 asset references, syntax/Freedoom structure and nine selected first-batch integrity checks pass. Artifact13299979364 SHA256c2745859522ba0fb6fce9c82ebc6ddaf3a24055c25cada3f141f800e0c991424 downloaded/verified; desktop-colony-1.png and touch-colony-2.png opened and inspected. Earlier passing CI41783873954 artifact13300302305 SHA256b50b3127759110d945c98e5059f0d584f8022979372eae5094dbae9eeae255af inspected; misleading chamber/ant art corrected afterward.

[Final passing run](https://github.com/ThatOneMop/study-desk/actions/runs/41784253180).

The three rendered starts each completed in six days. The four-start engine check also completes each in six days. These are automated routes through visible controls, with agent inspection of captured screenshots; they are not human enjoyment, physical-device or long-duration evidence.

Initial screenshots showed food in a dark, apparently unexcavated chamber and ants straying outside their room. The correction uses three functional spaces, scales brood/storage space with expansions and keeps ants within the worker chamber. Final desktop/phone screenshots were inspected after the repeated successful browser run. This baseline visual fix does **not** qualify as the required substantive improvement.

## Next substantial improvement and qualification

The baseline's same greedy allocation policy wins all starts. Chambers only enlarge capacity; they do not yet create distinct colony strategies. Repeated +/- assignment and the tall phone page are further observed weaknesses. Next, add useful chamber specializations or brood/resource tradeoffs that change daily worker allocation, comfortable repeated assignment and compact phone decision feedback. Avoid merely adding repeated days or rotated forecasts. Preserve existing v1 colony saves and ordinary records.

Then play and inspect the changed rendered loop. Full keyboard routes, actual bridge/Collection lifecycle, hidden confirmations/recovery and stronger save-state consistency still need qualification. Ordinary browser navigation, keyboard activation and storage fallback already pass but are not substitutes for those remaining checks.

## Preservation and counts

Fresh main remains e2ba9d1a221da8cdb3180a7f372a54743f6c52c2. Existing exact14 catalogue curation, Gummy Bay, Numberworks and requested-GitHub-games work remain untouched. No Switch workspace control was introduced; Games navigation is retained. The unchanged main/publication audit was not retried or counted as new work.

Batch3: **42/50 built,41/50 substantially improved,41/50 fully browser-qualified,0 active integrated,0 active live;8 unbuilt**. All50 slots remain present. Candidate82 has baseline browser evidence but stays out of the fully qualified count. Historical integration/live counts remain separately preserved.

Batch2 remains20 built/initially improved and20/20 additional-round verified, with nine historical releases and zero active after main curation. The inspected recursive development tree has no AGENTS.md or dev/indie-collection/FINAL_REPORT.md; preserve the recorded historical first-batch20 finished/nine selected baseline without fabricating a replacement.

No public Warren Watch URL is claimed. The current release barrier is reconciliation with main's explicit exact14 catalogue in PR110, not a newly observed publishing permission failure. No release or automation changes were made. Overall task remains incomplete.
