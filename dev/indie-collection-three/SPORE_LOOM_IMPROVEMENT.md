# Spore Loom improvement — 5 November 2026

Candidate87 has received a substantive tending upgrade. Qualification and selection remain pending.

## Observed weakness and change
In the rendered baseline, planting was the only player decision; subsequent generations only advanced toward a small fixed target. The upgrade unlocks a disturbed colony after each planting win. Its starting colony is fixed, but the player may transplant one living spore into empty soil between generations. Choosing the generation, source and destination changes all subsequent births and deaths.

All three disturbed colonies fail without intervention, tested explicitly. They have normal-action restoration routes with different timing: the cushion and lantern can be restored after generation1, while the reed route waits until generation2. This adds choices during growth without adding timers or padding the number of generations.

Dashed inner rings preview the next generation, selected spores are outlined, and mode-specific guidance explains transplanting. Tending seals persist independently of planting records. Replant resets the disturbance and restores the transplant; confirmed return to planting preserves earned records/seals. Legacy saves default to planting mode.

## Evidence
CI41931289646 atfa3aa21b4336c2470eaa70e856dd7f88747d17b0 passed six engine checks and twelve rendered planting/tending solutions at desktop1280×1000/touch-emulated390×844. Exact per-action reload includes selected spores and completed transplants; unlocks, seals, confirmed return to planting, lifting/replant/missed/restart, records, Space/Enter/Escape, pause, corrupt/quota storage, Games navigation and no overflow/page errors passed. Repository74 bundled routes/286 asset references, syntax/Freedoom and nine selected first-batch integrity checks passed. Artifact13371018247 SHA256eec73cc1e1ea8ed36760ee6612f35bb0344765805297b69a733ac29062c4dc91 downloaded/verified; desktop-selected-1.png and touch-tending-2.png opened and inspected. Initial upgrade CI41931140597 also passed before start/retry guidance refinement.

Automated rendered routes and agent screenshot inspection are not human enjoyment, physical-device or duration evidence.

## Assessment and next steps
The new intervention is causally necessary and distinct from initial planting. Three fixed targets still limit overall depth; this is not an extensive campaign. Full keyboard-only routes, embedded hide/resume/confirmation/navigation, save-history consistency and final selection evaluation remain pending. Keep off the catalogue until those checks are complete.

## Preservation
Batch3:47/50 built and improved,46 fully qualified,0 active integrated/live; three unbuilt slots88–90. Exactly50 candidate slots remain. Batch2's20/20 additional round and historical release evidence remain preserved.

Main f6164b75b93c4a323a7c8dfedd5f3711f7719437 is unchanged, including concurrent Arcade/Numberworks/Packworks/Gummy Bay work. No catalogue, deployment or automation changes were made; no repeated publishing-failure investigation or fresh live-release claim. The current recursive development tree has no AGENTS.md or first-batch FINAL_REPORT.md, so the existing historical evidence is retained without inventing files.

[Implementation](https://github.com/ThatOneMop/study-desk/commit/1ca3c4184cdd97cd21c25ced44b4c08fc249e663) · [Verification](https://github.com/ThatOneMop/study-desk/actions/runs/41931140597)

[Guidance refinement](https://github.com/ThatOneMop/study-desk/commit/fa3aa21b4336c2470eaa70e856dd7f88747d17b0) · [Final passing run](https://github.com/ThatOneMop/study-desk/actions/runs/41931289646)
