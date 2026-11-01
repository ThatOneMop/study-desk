# Bellwether — range planning development pass

1 November 2026. Candidate57 is qualified and selected for catalogue regression, not yet integrated/live.

Observed weakness: after walking north and choosing a whistle, Clover’s destination was previewed but Hazel only “waits”, without range or cause. Quiet movement had a similar unexplained wait. Players had to count cells or open the long rules disclosure to understand which tool could affect a sheep.

Implemented optional active-range overlay based on the proposed dog position. Nudge cells1–2 and whistle cells3–4 use distinct dashed outlines; quiet paws draws no pressure. Per-sheep forecast text explains distance, approach/retreat, quiet waiting, not-called targets and blocked/shared destinations. Invalid named calls still explain every waiting sheep. This supports planning before commitment; rules, route records and v1 journals are unchanged. Toggle does not alter the chosen action or write a save. Native dialog-close rendering and embedded collection return are also repaired.

Validation: all43 focused checks pass (21engine+22DOM), including previous41. Natural managed-preview desktop play before and after the upgrade, screenshots inspected. North then whistle committed two moves; after reload the dog remained row5,column2 and Clover row4,column3. Range preview correctly explained Clover3steps and Hazel5steps before that whistle. Quiet north preview suppressed pressure. A Hazel-only call at5steps remained disabled and spent no move. Native Escape cancelled retry and enabled controls after the close event, preserving the two moves.

Remaining: complete natural three-meadow play, screenshot/mobile/touch regression, quiet/named-call/adviser routes, performance/cancellation, saves/reset/restart and actual catalogue navigation. No improved/browserTested/integrated/live count credited yet. Avoid counting the earlier source-only refinements as this rendered pass.


Desktop continuation: normal controls and optional Ask the shepherd completed Clover gate at12steps (two exploratory actions plus a10-step advised route) and Willow passage at9steps. Reload retained the first completion and unlocked the passage. The third meadow was entered naturally; its initial search reached the existing25000-position budget and correctly reported uncertainty rather than impossibility. This remains partial desktop evidence; the final meadow and full touch/catalogue qualification remain pending.


## Full rendered qualification

CI41285207844 passed43 focused checks and desktop1280x1000/touch-emulated390x844 Chromium campaigns: all three meadows across original, quiet and named-call routes, nine earned clears per viewport with exact per-step saves/reload. Range/explanations, keys/Escape, adviser read-only/cancel/pause/uncertainty, undo/retry/reset/recovery/quota/navigation and overflow checked. 56 screenshots; inspected touch range explanation, third-meadow named call, desktop quiet reposition and touch bounded-adviser. Artifact13075340803 SHA25614be4d891027a15e4f2ad0b1d4f4f879c9fec2cd930d31a0cc7ffd17c484533c. Automated routes are reliability evidence, not human enjoyment or physical-device testing.

Observed upgrade implementation: fb8cd528d3672fd8acf9217e000f2ce39b327ba1. Test implementation: 6a70fac1be44f79db023c02a81df480cee622cae. Natural first two meadow completions above complement the full automated campaigns. The finite three-meadow campaign is not extended by repetitive counts. Named calls improve the final fixture from17 to15steps; shorter is a choice outcome, not a duration claim.

Selection: {"status":"Selected for catalogue regression","enjoyment":"Agent assessment: deliberate reversible flock planning with clear reactions and optional help; no human enjoyment study.","depth":"Nudge, quiet reposition, whole-flock and named calls create different route choices and shortest-path replay across three compact meadows.","polish":"Original pastoral SVG, readable named sheep, optional range overlay and explicit causes. Mobile vertically scrolls; controls remain readable.","reliability":"43 checks and all9 route/meadow combinations on desktop and touch-emulated Chromium; exact saves/reloads and guarded adviser.","variety":"Simultaneous animal steering distinct from fishing geometry and construction/graph/drafting games.","knownLimits":"Three authored meadows; bounded adviser cannot solve every starting position within its25000-state budget and reports uncertainty. No physical-device, duration or human enjoyment claim."}

Next: actual catalogue launch/search/favourites, embedded pause/native dialog, restart, Collection/Games return and saves; then source integration and separately verified live release.
