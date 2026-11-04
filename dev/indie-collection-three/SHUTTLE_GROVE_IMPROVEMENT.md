# Shuttle Grove improvement — 5 November 2026

Candidate85 has its substantive improvement pass. Qualification and selection remain pending.

## Before and after
The rendered baseline allowed the same two-shot pattern to win every match. Opponents stayed at the landing square and had nearly identical stamina.

Opponents now pay for movement and recover centrally after clears/drops. Fern, Rowan and Ash have different energy/rest profiles, and reply cycles shift after points. They anticipate the last square you scored on, adding reach against it. The player chooses between free Hold and paid Recover centre, balancing stamina against readiness for the next return. A clean match earns a persistent badge.

Engine tests confirm the old repeated pattern no longer wins a match. Winning routes differ by opponent and point and use central recovery. This adds decisions rather than lengthening the match. Legacy records remain intact with defaults for new fields.

Court numbers, an incoming trajectory, selected landing outline and scouting/recovery feedback improve readability. Screenshot inspection caught a stale /6 stamina denominator, now corrected to each rival's capacity.

[Gameplay implementation](https://github.com/ThatOneMop/study-desk/commit/b89622555b6de2ec8a30c147580ac9cf48482b65) · [Display correction](https://github.com/ThatOneMop/study-desk/commit/43701582c16226e28ccc8442e7299a523b829e69).

## Evidence
CI41874306533 at43701582c16226e28ccc8442e7299a523b829e69 passed six engine checks and six rendered adaptive matches at desktop1280×1000/touch-emulated390×844. Recovery choices, persistent clean badges, exact per-action reload, records/restart, loss/retry, Space/Enter/Escape, pause, corrupt/quota storage, Games and no overflow/page errors pass. Repository74 bundled routes/286 asset references, syntax/Freedoom and nine selected first-batch integrity checks pass. Artifact13346955424 SHA256693254c0fd34c1557cebe84c3086de33cbac2c3e230fd90bbc379526bd1b3423 downloaded/verified; touch-won-2.png inspected after correcting opponent stamina capacity. Earlier CI41873756191 passed; artifact13346610717 SHA256e9226cde1df52ddf08ecc5156e7037705eac153a54661179bf970d25d5c51539 verified; desktop-rally-0.png and touch-won-2.png inspected.

[Final verification](https://github.com/ThatOneMop/study-desk/actions/runs/41874306533).

Rendered routes use normal buttons and reload every action. These are automated checks and agent screenshot inspection, not human enjoyment, physical-device testing or duration evidence.

## Preservation and next steps
Batch3: **45/50 built,45/50 improved,44/50 fully browser-qualified,0 active integrated/live;5 unbuilt slots86–90**. Exactly50 slots and separate historical release evidence remain. Batch2 retains20/20 additional improvements.

Fresh main remained 16b3b1658812a90c885fab83d3af419557d8b59b. Its curated catalogue, Numberworks/Packworks/Gummy Bay work and existing saves are untouched. No Switch workspace controls, public entries or automation changes were added. No unchanged publication failure was retried. Fresh recursive development tree still has no AGENTS.md or first-batch FINAL_REPORT.md; preserve historical baseline evidence without inventing missing files.

Next: full keyboard-only matches, embedded bridge/visibility/navigation, deeper save-state checks and final selection assessment. Overall catalogue/preflight reconciliation remains outstanding.
