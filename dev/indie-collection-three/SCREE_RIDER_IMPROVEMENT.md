# Scree Rider improvement — 5 November 2026

Candidate84 has its substantive improvement pass. Qualification and selection remain pending.

## Before and after
Rendered baseline play showed shallow fixed-track replay: all three clean optima were47 simulated time units. Terrain appeared only as text, the phone instructions were long and “Hold lean” obscured its drift-preserving behavior.

Each completed trail now unlocks alternate lines. Root bypasses preserve speed, gap bridges allow slower crossings, and inside shortcuts reward momentum. These lines demand an exact landing position and limited drift, so the rider must set up the approach in preceding sections. Bypasses and bridges add two time units; shortcuts save one. Clean replay optima are39/40/40 without adding levels. Legacy saves keep their records and default to the main line.

Roots, gaps and landing markers now appear in the trail illustration. “Keep drift” describes the centre control more accurately. A concise onboarding paragraph replaces the initially expanded instruction block.

[Gameplay commit](https://github.com/ThatOneMop/study-desk/commit/684ee2c26e98d0882d14a1fb73415549586c056c) · [Bridge route coverage](https://github.com/ThatOneMop/study-desk/commit/b93d9ce988015a63903aec9001e803eee2e35b10).

## Evidence
CI41843195550 atb93d9ce988015a63903aec9001e803eee2e35b10 passed seven engine checks and fourteen rendered main/earned-alternate/bridge descents at desktop1280×1000 and touch-emulated390×844. Exact per-action state,144 section reloads, records/restart, loss/retry, Space/Enter/Escape, pause, corrupt/quota storage, Games and no overflow/page errors pass. Repository74 bundled routes/286 asset references, syntax/Freedoom and nine selected first-batch integrity checks pass. Gameplay-identical preceding CI41842930545 passed twelve rendered descents; artifact13329293254 SHA2569d866ebf1cecd9cff4f33fe10ec3507046222f1fb73904d5dd3a771e3beac2fd downloaded/verified, desktop-alternate-0.png and touch-alternate-1.png opened and inspected.

[Passing run](https://github.com/ThatOneMop/study-desk/actions/runs/41843195550).

Inspected screenshots show readable alternate-line requirements, selected controls, visible roots/landing markers and compact instructions without horizontal overflow. These are automated rendered routes and agent screenshot inspection, not human enjoyment, physical-device or long-duration evidence. The full bridge route crossed at speed3; explicit speed1/2 crossings remain qualification work despite the engine permitting them.

## Preservation and next steps
Fresh main remains 16b3b1658812a90c885fab83d3af419557d8b59b. Its curated catalogue and concurrent Numberworks/Packworks/Gummy Bay work are untouched. No Switch workspace controls were added; no unchanged publication retry or automation change was made. No public release is claimed.

Batch3: **44/50 built,44/50 improved,43/50 fully browser-qualified,0 active integrated/live;6 unbuilt slots85–90**. Exactly50 ledger slots and separate historical release evidence are retained. Batch2 retains its20/20 additional improvement round. Fresh recursive development-tree inspection still finds no AGENTS.md or first-batch FINAL_REPORT.md; historical baseline evidence remains preserved.

Next: full keyboard-only descents, real bridge/embedded visibility and navigation checks, stronger save-state consistency and slow gap-bridge verification. Then assess selection. Current15-game catalogue/preflight reconciliation and overall final comparison remain outstanding.
