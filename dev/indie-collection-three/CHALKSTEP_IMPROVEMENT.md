# Chalkstep improvement — 5 November 2026

## Observed weakness
All three rendered baseline walls permitted the same 11-action hand/foot/rest pattern despite shifted holds. Resting anywhere balanced and uniform hand costs made route planning shallow.

## Substantive change
Completing an original wall unlocks its marked route. Two starred holds must be visited by a hand before topping out; feet alone cannot satisfy them. Resting is restricted to foot heights 1 and 3, each once. Hand reaches spanning three grid steps cost two grip rather than one, while shorter reaches cost one and feet remain free. Players must plan intermediate foot support, checkpoint order and rest locations instead of repeating the baseline's height2 rest. The tested marked routes finish in 14 actions, with grip remaining 2/2/0 across the three walls; these are route measurements, not duration claims.

Marked routes have separate persistent seals, confirmed mode switching, visible remaining-mark progress, starred holds, contextual grip-cost guidance and accessible per-hold cost labels. Original routes and records remain available; existing v1 saves migrate to open mode with original progress intact. No arbitrary timer or repeated walls added.

## Evidence
CI 41991210014 at 113cb52a803fa3b2b030725bea4109095310ab13 passed six engine checks and twelve rendered climbs (three open and three marked on desktop 1280×1000 and touch-emulated 390×844). Verified hand checkpoints, grip costs, restricted one-use rests, mode confirmation, exact per-move reload, separate seals, original records/retry, exhaustion/foot recovery, Space/Enter/Escape, pause, corrupt/quota handling, Games navigation and no page errors/overflow. Repository assets, source syntax/Freedoom structure and nine first-batch integrity checks passed. Artifact 13398551277 SHA256 f8020b6a6a073c2ed6fbccfcd9d97ebacf2e8becd859cefef69b5ae83fba640f verified. Inspected touch-marked-start-2 and desktop-marked-win-1: visible stars, limb labels, readable wrapped instructions and 2/2 completion with saved seals. Phone requires scrolling. Inspection found general help omitted marked-rule exceptions; corrected in 1b0bde59f2824b8e921af5e8ff6e59f2c1e91f96. Automated routes and agent visual assessment are not human enjoyment or physical-device evidence.


Help correction verification: CI 41991901174 at 1b0bde59f2824b8e921af5e8ff6e59f2c1e91f96 passed the same six engine checks, twelve rendered climbs and repository checks. Artifact 13398048896 SHA256 e17503aeedc3e93d1c0a868130697ef6b5da3a1903d06c50e7a3c899005c8210 verified; touch-marked-start-2 inspected again with correct grip/rest/checkpoint exceptions, readable wrapping and no overlap.

## Assessment and remaining work
The marked challenges add earned progression and grip/rest planning, but still share three compact authored walls. Full keyboard campaigns, embedded lifecycle/navigation and stronger body/phase/save validation remain qualification work. This is a verified substantial improvement, not final release approval. No human enjoyment, physical-device, full accessibility or hours-of-content claim.

## Preservation and next steps
Exactly 50 third-batch slots: 50 built, 50 improved, 49 fully qualified, 0 active integrated/live. Fully qualify Chalkstep90, then compare the complete slate, perform targeted final polish and integrate selected winners against fresh main with curated catalogue preservation. All 50 built/improved does not complete the integration obligation.

Second-batch20/20 additional improvement evidence and historical sources/saves remain unchanged. Main f6164b75b93c4a323a7c8dfedd5f3711f7719437 unchanged, including concurrent Arcade/Numberworks/Packworks/Gummy Bay work. No public release or schedule change. Unchanged Switch workspace/publication investigations were not repeated. Current development tree has no AGENTS.md or first-batch FINAL_REPORT.md; historical evidence remains recorded without inventing files.

[Implementation](https://github.com/ThatOneMop/study-desk/commit/113cb52a803fa3b2b030725bea4109095310ab13) · [Workflow](https://github.com/ThatOneMop/study-desk/actions/runs/41991210014)
