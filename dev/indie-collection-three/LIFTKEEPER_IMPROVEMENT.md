# Liftkeeper substantive improvement — 4 November 2026

Implementation commit: dec66edee84c3541df9ad935c4bb791d25a73a2c.

## Observed weakness and upgrade
The rendered baseline's14/12/14-action dispatch routes kept the default3-tonne counterweight. The improvement introduces earned low-power contracts: completing an ordinary dispatch unlocks its contract, and a successful contract earns a persistent seal independently of ordinary score records.

Each contract models a small power supply: peak draw cannot exceed3 charge per floor, initial charge is4/10/4, the counterweight locks at first departure, and freight must make one efficient round trip (8/6/8 floor movements). These limits represent the minimum tower trip, not additional repetitive levels or a running timer. Load combinations and the counterweight now matter. Search finds5/4/5-tonne solutions and no valid default3-tonne solution. Ordinary dispatches retain engineer recovery; a stuck contract offers restart or an explicitly confirmed return to ordinary mode.

The UI shows the opposite-moving counterweight, contract constraints and earned seals. Contract/mode switches require confirmation. Actual regeneration is capped to available battery space before displaying it. Original save keys and records are retained; legacy saves acquire empty seal fields.

## Evidence
CI41700373198 atdec66edee84c3541df9ad935c4bb791d25a73a2c passed seven distinct engine checks and twelve rendered dispatches: ordinary and earned low-power contracts across desktop1280×1000 and touch-emulated390×844. Every route action survives exact reload. Service recovery, records/restart, native Space/Escape, pause, corrupt/quota storage and Games navigation pass without page errors or horizontal overflow. Search finds low-power solutions using5,4,5 tonne counterweights and proves no solution with the default3 tonne counter under these contract rules. Legacy saves retain records and gain empty seals. Repository74 routes/286 asset references, syntax/Freedoom structure and nine selected first-batch integrity checks pass. Artifact13263366330 sha256:51c19d24ef6d46de26518590d11153e6e609b25f7d00bf8177638a5b4766ddb3 verified; desktop-contract-1.png and touch-contract-2.png inspected.

[Passing CI](https://github.com/ThatOneMop/study-desk/actions/runs/41700373198)

Seven distinct engine checks are re-imported by the browser helper; repeated execution is not counted as additional distinct tests. Browser progression uses normal controls, not injected completion states. These are automated rendered reliability checks and agent screenshot assessments, not human enjoyment or physical-device testing.

## Remaining quality work
The improvement is complete; full qualification remains pending. The three manifests are still deterministic and short; contract routes largely reuse their floor traversal with newly necessary energy planning. Do not claim a long campaign or measured duration. Screenshot inspection also found the ground-floor label crowded on phones after adding the counterweight column. Fix it during qualification, alongside full keyboard careers, embedded visibility and confirmations, deeper save validation and Collection navigation. No catalogue selection yet.

## Preserved scope
Batch three remains exactly50 slots:38 built,38 improved,37 fully qualified,12 unbuilt,0 active integrated/live. Historical releases and second-batch20/20 additional improvements remain preserved.

Main remains fa57730f70904ae5f15e47fe0c7e55dc28144c88. Its exact14 catalogue curation and prior Switch-workspace cleanup remain unchanged; no repeated publication retry or live-release claim. No existing first/second-batch game or unrelated concurrent source was edited. Current recursive development tree has no AGENTS.md or original first-batch FINAL_REPORT.md; preserve recorded historical baseline.
