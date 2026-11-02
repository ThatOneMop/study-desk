# Brasswake — substantive improvement

Recorded 2026-11-02 15:22 UTC (3 November in Australia/Sydney).

Candidate69 remains on `indie-collection-three-dev`; it is not publicly listed. This run improves one existing candidate and adds zero new games.

## Before and after

The rendered baseline cleared three fixed courts in7/7/14 turns. Immediate return shots dominated, bolts overlapped, “Turn” labels were ambiguous and the fixed phone panel covered map rows.

Catch now spends both shield charges to bank one incoming bolt. The bearer can walk with it to recharge and choose a different firing position; firing spends ammo rather than shield. Catching a simultaneous second bolt does not protect against it. Guard remains the cheaper immediate-return alternative. Two persistent badges per court reward unscathed clears and a clear after a caught shot has been carried, fired and hit a sentry. Six badges are qualitative replay objectives, not added repetitive levels. Legacy v1 records remain intact.

Bolt direction/count chips distinguish hostile, reflected and stored shots. Guard labels now describe their action. Phone controls flow below the whole board. A screenshot-led follow-up keeps stored-shot status and the next mastery step visible after reload. Vertical scrolling to Fire controls remains a limitation.

Implementation: [c98eac2](https://github.com/ThatOneMop/study-desk/commit/c98eac2f18e9ee663f46b2215a630e2ec8910613); rendered follow-up: [d6be820](https://github.com/ThatOneMop/study-desk/commit/d6be820500ec87131210d5811ad1c409440cc8cb).

## Verification

CI41470511640 at d6be820500ec87131210d5811ad1c409440cc8cb passed eight engine checks, twelve normal/roving-shot court clears across desktop1280×1000 and touch-emulated390×844 Chromium, plus two complete keyboard catch/carry/fire clears. Per-action save/reload, earned unlocks, best turns and badges across restart, natural loss/retry, Escape, pause, corrupt/quota recovery, standalone Games navigation, no page errors/horizontal overflow and a fully visible board with nonoverlapping controls passed.74 bundled routes/286 HTML references and all nine first-batch release integrity checks pass. Artifact13155195981 SHA25663da82390cd9c9d1431e03a39ce1928581aeff2b201e23a7bf14ef50e566b526 verified; touch-holding-2, desktop-holding-2 and touch-mastery-2 screenshots inspected. Original solutions7/7/14 turns; roving-shot routes8/9/15, not proven optimal. Automated play and agent visual assessment, not human enjoyment or physical-device testing.

[Passing CI](https://github.com/ThatOneMop/study-desk/actions/runs/41470511640) includes the repository asset/source checks. There is no separate compilation step for this vanilla HTML/CSS/JS game.

CI41469962152 failed a strict visibility assertion after automatic scrolling. Final evidence uses explicit native center scrolling, a rendered frame, screenshot capture before assertion, one CSS-pixel rounding tolerance and separate board/control overlap checks. This is not reported as a passing run. Its inspected desktop screenshot also exposed missing held-shot feedback after reload, which was repaired.

The final touch holding screenshot shows all49 cells, separate hostile/friendly direction chips, an unobscured bottom row and readable stored-shot instructions. The desktop holding screenshot shows separate Walk/Guard/Fire controls and held ammo after reload. The touch completion screenshot shows terminal controls disabled and a usable restart. Screenshots are CI artifacts; only these named final images and the earlier failed-run desktop/touch images were visually inspected.

## Counts and release scope

| Collection | Built | Improved | Additional round | Fully browser-qualified | Currently integrated/live |
|---|---:|---:|---:|---:|---:|
| Second |20|20|20/20|20|0/0 after PR110;9 historical releases|
| Third |29/50|29/50|Not applicable|28/50|0/0 after PR110;25 historical releases|

Exactly50 third-batch slots remain;21 are unbuilt. First-batch historical sources/tests and second-batch completion records were preserved. No content-duration claim is made.

Main was re-read at `fa57730f70904ae5f15e47fe0c7e55dc28144c88` and not edited. PR110's explicit14-game catalogue remains the release hold; this run did not retry publication or claim a Pages failure. Previous source/live navigation audit and successful Pages evidence remain in the ledger. No new live game link exists for Brasswake. No automation was modified or paused.

## Next work

Qualify real parent-bridge hidden state and modal actions, complete keyboard/native-button behavior, rendered legacy saves, unrelated-save isolation and loss while carrying. Then assess Brasswake against the selected slate; its three small deterministic courts still limit depth. Continue original slots70–90 independently of the current catalogue hold. Preserve Numberworks, Gummy Bay and requested-GitHub-games changes.
