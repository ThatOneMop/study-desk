# Liftkeeper baseline — 4 November 2026

Candidate78 is playable on the development branch and remains unselected.

## Implemented
Three freight manifests across five floors; load/park/deliver controls with six-tonne freight capacity; adjustable ground-level counterweight; directional energy forecasts and regenerative movement; engineer recovery with score penalty; saved dispatch records, restart confirmation, pause and unreadable-save recovery. Original CSS tower/cabin/crate artwork and game code. No imported collection or assets.

Source commit 7c70b74f9bdcee945fef33d48a3b3a37a9e1aca1; screenshot-driven phone label fix efe71c84817ceae83e852bce8142bd72bcc7e345. The early second manifest was rebalanced after engine search found no service-free solution. Final manifests all have service-free solutions.

## Validation
CI41690040013 atefe71c84817ceae83e852bce8142bd72bcc7e345 passed four distinct engine checks and six rendered dispatch wins (three each at desktop1280×1000/touch-emulated390×844). Every route action reloads exactly. All three manifests solve without engineer calls; service recovery, records/restart, Space/Escape, pause, corrupt/quota storage and Games navigation pass without page errors or horizontal overflow. Repository74 bundled routes/286 asset references, syntax/Freedoom structure and nine selected first-batch integrity checks pass. Artifact13256282701 sha256:2d73c232b825c0340d7bb811d6e3931b3aa0343eed0d1e6b191758dcde707b23 verified; final touch-dispatch-2.png inspected. Earlier CI41689589062 artifact13255498844 also verified and desktop-dispatch-0.png/touch-dispatch-2.png inspected, prompting cabin-label wrapping fix.

[Passing CI](https://github.com/ThatOneMop/study-desk/actions/runs/41690040013)

The browser route search finds valid input sequences; it does not inject state for progression. Four engine tests are imported again by the browser helper, not counted as eight unique tests. Screenshot review found a wrapping cabin-weight label at390px; follow-up CSS keeps it on one line and the rerun screenshot confirms this. These are automated reliability checks and agent visual inspection, not physical-device or human-enjoyment testing.

## Weaknesses and next pass
The tested routes use14,12,14 controls and8,6,8 floor movements. None needs to adjust the default counterweight. Freight staging is optional and the three fixed manifests are short. Engineer recovery prevents an unrecoverable stuck state but is not a progression system. The charge forecast also reports potential recovery rather than the actual gain at a full battery. Art is readable but static.

Next substantive pass must make counterweight/cargo planning matter and introduce useful progression/replay choices, not merely add similar manifests or cosmetic edits. Fix capped-recovery feedback. Full keyboard careers, embedded shell lifecycle, deeper save invariants and comparative selection follow that pass. Do not count the phone text fix as the required substantial improvement.

## Preserved state
Exactly50 batch-three slots remain:38 built,37 improved,37 fully qualified,12 unbuilt,0 active integrated/live. Historical releases and second-batch20/20 additional improvements remain in the ledger.

Main remains fa57730f70904ae5f15e47fe0c7e55dc28144c88; preserve its exact14 catalogue curation and prior Switch-workspace cleanup. No repeated publication attempt or new live-release claim. Current development tree has no AGENTS.md or historical first-batch FINAL_REPORT.md; retain the recorded historical baseline. All new source is isolated to Liftkeeper and its tests/workflow; no existing game or save key was edited.
