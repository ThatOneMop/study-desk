# Ambercut qualification and reserve selection

4 November 2026

## Fixes

[77ee5e19](https://github.com/ThatOneMop/study-desk/commit/77ee5e19bbf13bcc24e427d59dce870c5ab6940a) adds confirmation before a conservation assignment replaces the active tray. Cancellation preserves exact state. Save validation now rejects active/won conservation states with disturbed corner rock, locked assignments and seals without a corresponding record. Valid losses with more than three simultaneous fractures now reload instead of being rejected. Repeated conservation completions report this attempt's fracture outcome rather than claiming a new seal merely because an older seal exists.

## Verification

[Passing run41651594200](https://github.com/ThatOneMop/study-desk/actions/runs/41651594200)

CI41651594200 at a364ead2eb95f90ebdfbff4c210385a044454169 passed nine distinct engine checks and sixteen rendered tray wins: twelve existing pointer/touch normal/conservation wins and four additional keyboard wins in desktop1280×1000 and touch-emulated390×844 Chromium. Every keyboard excavation action survives exact reload. Assignment cancellation/confirmation, earned seals, legacy migration, kit exhaustion/retry, hidden restart/assignment/recovery confirmations through actual bridge.js, explicit resume, Collection messaging and unrelated-save isolation pass. Existing fracture/retry, corrupt/quota save, pause and navigation checks pass. Repository syntax/Freedoom and nine first-batch integrity checks pass. Artifact13237154400 sha256:784d4eeeeff42e6d7a9369ceb8f2575f834a067edf6eaa3b0ce040dc6a5b2707 verified; touch-qualified.png and desktop-shell.png inspected. Automated reliability and agent visual assessment, not physical-device testing or human enjoyment evidence.

Three preliminary runs exposed test-harness synchronization failures. Run41650342684 raced native dialog closing;2390be81536454d9647d6bec9585685bfcf2d82e waits for that event cycle. Runs41650860632 and41651225433 then waited using in-frame animation/timer polling that the bridge intentionally suspends. Final commit[a364ead2eb95f90ebdfbff4c210385a044454169](https://github.com/ThatOneMop/study-desk/commit/a364ead2eb95f90ebdfbff4c210385a044454169) observes visibility from a host-side clock. Assertions were retained; the final full run passes. These failed runs are not counted as qualification evidence.

Inspected phone screenshot shows the earned fern seal, protected corners and connected specimen. Desktop iframe screenshot shows the real game shell and navigation. Vertical scrolling remains. No physical-device or human-enjoyment claim is made.

## Selection

Qualified reserve. Directional cutting and preservation constraints create a distinct spatial loop, with readable connected specimen art. Three fixed trays and generous budgets still limit progression and replayability. Bell Diver's equipment progression and Mycelium Yard's reinvestment choices remain stronger selected candidates for the user's progression tastes.

## Status and preservation

Exactly50 third-batch slots:36 built,36 improved,36 qualified,14 unbuilt (77–90),0 active integrated,0 verified live. Historical release evidence and second-batch20/20 additional improvements remain unchanged.

Fresh main remains fa57730f70904ae5f15e47fe0c7e55dc28144c88; current14-game curation and release gate are preserved. No catalogue entry, deployment retry or automation change. Recursive development tree contains no AGENTS.md or first-batch FINAL_REPORT.md; previously recorded historical baseline is retained. Only Ambercut source/tests/workflow and batch3 documentation changed, using expected-head updates.

Next: implement distinct candidate77.
