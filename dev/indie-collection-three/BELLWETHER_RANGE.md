# Bellwether — range planning development pass

1 November 2026. Candidate57 remains development-only and not fully qualified.

Observed weakness: after walking north and choosing a whistle, Clover’s destination was previewed but Hazel only “waits”, without range or cause. Quiet movement had a similar unexplained wait. Players had to count cells or open the long rules disclosure to understand which tool could affect a sheep.

Implemented optional active-range overlay based on the proposed dog position. Nudge cells1–2 and whistle cells3–4 use distinct dashed outlines; quiet paws draws no pressure. Per-sheep forecast text explains distance, approach/retreat, quiet waiting, not-called targets and blocked/shared destinations. Invalid named calls still explain every waiting sheep. This supports planning before commitment; rules, route records and v1 journals are unchanged. Toggle does not alter the chosen action or write a save. Native dialog-close rendering and embedded collection return are also repaired.

Validation: all43 focused checks pass (21engine+22DOM), including previous41. Natural managed-preview desktop play before and after the upgrade, screenshots inspected. North then whistle committed two moves; after reload the dog remained row5,column2 and Clover row4,column3. Range preview correctly explained Clover3steps and Hazel5steps before that whistle. Quiet north preview suppressed pressure. A Hazel-only call at5steps remained disabled and spent no move. Native Escape cancelled retry and enabled controls after the close event, preserving the two moves.

Remaining: complete natural three-meadow play, screenshot/mobile/touch regression, quiet/named-call/adviser routes, performance/cancellation, saves/reset/restart and actual catalogue navigation. No improved/browserTested/integrated/live count credited yet. Avoid counting the earlier source-only refinements as this rendered pass.


Desktop continuation: normal controls and optional Ask the shepherd completed Clover gate at12steps (two exploratory actions plus a10-step advised route) and Willow passage at9steps. Reload retained the first completion and unlocked the passage. The third meadow was entered naturally; its initial search reached the existing25000-position budget and correctly reported uncertainty rather than impossibility. This remains partial desktop evidence; the final meadow and full touch/catalogue qualification remain pending.
