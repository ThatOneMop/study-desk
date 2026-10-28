# Pocket Palaeo — retained lift plans and staged resin jackets

The additional round combines local resin-jacket protection with a treatment planner developed after rendered play exposed disappearing support guidance. Initial improvement passes are excluded.

## Observed weakness and implemented change

In the rendered first excavation, changing from Lift to Brace hid the clearance and load forecast. Jacket placement immediately spent resin. Comparing ways to support the same specimen therefore lost useful context or consumed a finite resource.

Lift plans now remain visible while brushing, adjusting braces, treating cracks and staging jackets. Selecting a jacket shows its one-charge cost and the whole specimen's condition before and after treatment. Cancel keeps the resin. Confirm records exactly one jacket in the existing replay journal. Recovery, reopening and changing sites clear the plan. Hidden keyboard/pointer actions and paused reset/recovery confirmations cannot mutate the journal.

Gameplay commits:
- Resin jacket mechanics: [282ad74](https://github.com/ThatOneMop/study-desk/commit/282ad742f526e7e30eb22667bc673bce4f449ac7).
- Rendered-review planning and input corrections: [1ff7d19](https://github.com/ThatOneMop/study-desk/commit/1ff7d19e476b6c46b2006022d81504ad8be10f2e).
- Expanded native regression: [5c18e3e](https://github.com/ThatOneMop/study-desk/commit/5c18e3ed14f3d59df0107ac74c33c4e17e399b3e).
- New-journal proposal reset correction and regression: [184bb3c](https://github.com/ThatOneMop/study-desk/commit/184bb3c613a5dba1c17585500cd69b747b3add3e). A new DOM test reproduced the stale visible proposal before the fix; all 47 focused tests pass after it.

## Concrete route and tradeoff

Pick and brush expose Reedfin and its border. Grip 10 and braces 10/12 produce 93% projected condition. Jacket 27 previews 96%; cancelling preserves both charges. Confirming that treatment and jacket 29 reaches 100%, spends both charges and leaves one reusable brace free. Recovering awards three seals. Fitted jackets survive reload; recovered jackets leave with the specimen. Reopening restores field supplies without duplicating museum rewards.

This is a forgiving alternative to rearranging reusable supports. Resin can instead repair excavation cracks. Jackets neither repair cracks nor protect against careless pick strikes, and they cannot rescue every unsupported lift. Optimally arranged reusable braces can still recover all six specimens perfectly without consuming resin.

## Verification

[CI 40686526711](https://github.com/ThatOneMop/study-desk/actions/runs/40686526711) on [184bb3c](https://github.com/ThatOneMop/study-desk/commit/184bb3c613a5dba1c17585500cd69b747b3add3e) passes 527 engine + 363 DOM = 890 checks, syntax/assets, exact twenty-slot and nine first-batch source-integrity gates. Native job 122813466023 passes desktop 1280×1000 and emulated touch 390×844: staged/cancelled jackets, retained 93→96→100 condition forecasts, exact fitted-jacket reload, 100% recovery and three-seal reward, reopening without duplicate rewards, journal cancellation retaining the proposal and confirmation clearing it, all six original perfect recoveries, all three tools/sites, fast pointer/touch strokes, keyboard traversal, mid-site reloads, deliberate fracture/retry, isolated corrupt-save recovery/reset and navigation. No browser errors. All seven final CI jobs passed. Earlier full run 40685609385 passed all seven jobs on the same jacket gameplay before the isolated journal-reset correction.

40 Pocket Palaeo screenshots retained in [artifact 12816395925](https://github.com/ThatOneMop/study-desk/actions/runs/40686526711/artifacts/12816395925). Inspected desktop-jacket-preview, touch-jacket-supported and touch-jacket-recovery: treatment cost and free cancellation are legible; amber jacket markers match retained safe-lift feedback; museum condition, rewards and site unlock appear correctly without horizontal clipping. Phone layout requires vertical scrolling. ZIP SHA256 8778fa06e811bbc87a3fde321c35a4d1ce908eda0c842198e7692c186a48bd6b. This is automated reliability and agent screenshot evidence, not human enjoyment or a physical-device claim.

The additional-round checklist is now **12/20 verified** (32 meaningful passes including the 20 initial passes). Third batch remains **24/50 built; 0 qualified improved/browser-tested/integrated/live**. No new catalogue integration or live release in this increment.

## Quality assessment and limits

Original field-journal SVG/CSS art, six distinct connected bone graphs, manual excavation and meaningful field-tool purchases remain intact. The new planner makes support/resource decisions easier to compare and reduces accidental spending. The campaign remains three fixed sites and six specimens. Replay comes from condition improvement, different grips/support arrangements and choosing repairs versus jackets; this does not create procedural discovery or justify a long playtime claim. Phone play requires vertical scrolling.

The 28 October cloud-browser reopening attempt was rejected by browser security policy after the preview had stopped. No bypass was attempted. Prior rendered desktop play, the newly expanded GitHub Chromium routes and inspected retained screenshots are separate evidence sources. Automated routes are reliability evidence, not a human enjoyment study, physical-device testing or a full accessibility audit.

Source remains on indie-collection-two-dev. No catalogue integration or live release is claimed for this upgrade. Existing saves, the first collection and concurrent main/third-batch work are preserved.
