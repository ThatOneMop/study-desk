# Run 44 · Little Foundry owner-mark techniques

**20/20 playable prototypes · 20 improved games · 43 meaningful improvement passes · 9 finished · 0 selected · 0 publicly published.** Exactly 20 candidate slots retained.

Little Foundry’s six moulds were mechanically solvable but shared nearly the same capacity-first strategy, and only the opening bell had bounded visible review. Pass 2 gives every commission a different owner-requested completion order: body before rim, heavy tooth first, handle before blade, paired heavy cores, teeth before hubs, and beak-first/tail-last. The change adds mastery to the existing alloy/heat/flow loop without timers, more commissions or arbitrary grind.

The owner’s mark is part of the three-seal score. Live text says whether it is still possible, missed or honoured; completed mould sections receive numbered visual and accessible badges; the first broken step explains that the player can finish for fewer seals or undo. Version-one complete saves migrate optimistically to each commission’s authored plan, incomplete saves infer completed sections, and strict validation rejects duplicate or inconsistent completion sequences. Onboarding explains the rule and scoring.

Little Foundry remains a playable prototype, not a finished candidate. The revised first commission passed a visible miss→undo→three-seal→reload review, but the final exact-source Actions run has not surfaced through the GitHub connector and the other five revised commissions have not had visible satisfaction/fatigue review.

## Evidence

- Implementation commits: [2314978](https://github.com/ThatOneMop/study-desk/commit/2314978cb37081432b35572d846bf4dfe9908431) and final onboarding commit [6d605cd](https://github.com/ThatOneMop/study-desk/commit/6d605cd5a7a8ca544e32f79d6ce8398c18f4e5b9)
- Local final source: 15 Little Foundry engine checks passed; six legal owner-marked three-seal routes use 5/5/7/6/7/7 fuel and 19/19/21/22/23/24 actions; engine/game/engine-test/DOM-test/browser-test syntax passed.
- Expanded suites cover six distinct order rules, immediate miss feedback, undo recovery, numbered/accessible order badges, complete-save migration, all-six scoring/routes, desktop/touch UI paths and prior loss/save invariants.
- Managed rendered final source: deliberately poured a rim first, observed MISSED, #1 and undo guidance; undid to “still possible”; completed the bell body-first for three seals; HONOURED and all eight numbered sections survived reload. Completed desktop layout was visually inspected.
- Public `main` remained `42e32a7efa25a120f579dbef6a706d8588a2c3a8`; no game was added to the public catalogue.

## Verification limit

The GitHub connector returned no workflow run for the final source during this run, so there is no new CI run URL to claim. The prior pass-1 exact-source CI remains recorded in the ledger, while pass 2 is explicitly marked pending remote verification. This is agent-driven automated and bounded visible evidence, not a human enjoyment study, physical-device review, screen-reader review or proof of 20 hours of content/testing.

## Next

Obtain the final pass-2 Actions result and inspect job logs, then visibly play commissions 2–6 to assess whether the new order rules genuinely vary the heat/pour decisions without fatigue. Keep Little Foundry development-only unless it clears that finish gate; compare only finished candidates before scoped public integration.
