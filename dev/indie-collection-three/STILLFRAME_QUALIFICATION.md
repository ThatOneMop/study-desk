# Stillframe qualification — 4 November 2026

Stillframe77 is qualified and held in reserve.

## Fixes and evidence
Implementation: ae9b4771fe7ca8aa940999a011781da80d2a75fc. Mobile qualification-host correction: 971c15ec55128483383bd45c3d0238981476102a.

The save decoder previously accepted more contact-sheet prints than spent film, photographs above their saved best score, and inconsistent/duplicate accepted briefs. It now rejects these inconsistent states. Regression coverage preserves genuine accepted work from earlier outings and original v1 migration.

CI41681052771 at971c15ec55128483383bd45c3d0238981476102a passed eight distinct engine checks and eight rendered exhibitions: four pointer/touch and four keyboard runs across desktop1280×1000 and touch-emulated390×844. Exact action/reload comparisons, alternate briefs/restart/cancel, loss/retry, legacy migration, corrupt/quota storage, native Space/Enter and Tab reachability pass. Actual bridge in a controlled same-origin iframe passes hidden restart/recovery/shoot suppression, explicit resume, Collection message and unrelated-save isolation. Mobile host viewport corrected after screenshot review; iframe innerWidth390 asserted. Repository74 routes/286 asset references, syntax/Freedoom structure and nine selected first-batch integrity checks pass. Artifact13252977313 sha256:9c7a82ceaed5a244e2c5d09fbcf7532f60dc675ff89df97fe8426ca764c4e5c7 verified; desktop-keyboard-1.png and touch-shell.png inspected.

[Passing workflow](https://github.com/ThatOneMop/study-desk/actions/runs/41681052771)

Eight distinct engine tests are imported again by browser helpers; those repeats are not additional distinct tests. Eight exhibition completions exercise72 accepted photos, not72 different pieces of content. Keyboard routes use native Space on focused buttons, per-action reload, Enter and an explicit Tab reachability check.

The initial passing run41680640319 exposed a QA-host issue during screenshot inspection: missing viewport metadata shrank the phone iframe to desktop scale. The corrected host now asserts390px width and no horizontal overflow. Final screenshots show readable phone navigation/brief/framing and the completed desktop alternate exhibition with retained photographs.

## Quality decision
Reserve. Photography gives the slate a distinct, relaxed loop, and the improvement made watching, framing and technique purposeful. However, three fixed animal rhythms, two composition variants and explicit readiness hints offer modest replay depth. Passing reliability checks is insufficient reason to promote it over the stronger selections already held for release reconciliation. Original simple silhouettes remain visually readable. No human enjoyment, physical-device testing or unmeasured content-duration claim.

## Preserved state and next work
Third batch remains exactly50 slots:37 built,37 improved,37 qualified,13 unbuilt,0 active integrated/live. Historical releases remain separately recorded. Batch two retains20/20 additional improvements and its historical selections.

Main was re-read and remains fa57730f70904ae5f15e47fe0c7e55dc28144c88. Preserve PR110's curated14 slate and existing navigation; no repeat publishing retry or new live-release claim. No source from earlier collections or concurrent work was edited. The historical first-batch report and AGENTS.md are absent from the current recursive development tree; retain recorded baseline rather than invent replacements.

Next: implement candidate78 with a distinct core loop, then rendered baseline and substantive improvement. Keep Stillframe in reserve.
