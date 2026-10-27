# Fallow Table — initial source increment

27 October 2026. Third-batch slot 59, source commit `8120cbb8bcf19fa6d853d38dcfdcffbb0ba15393`.

## Implemented

Original temporal farming game: nine beds, three jobs per day, seven intervening growth nights and an eight-day season. Three contracts change soil, rainfall and basket requests. Planting spends soil, growing consumes water, beans restore soil and produce compost, live bean companions shade squash, and repeated carrots/squash yield less. Cross-watering creates placement choices. Mature crops can wait safely; no real-time timer.

Native keyboard/pointer controls, original SVG crops and landscape, responsive CSS, optional exact overnight forecast, full weather strip, distinct basket requests, record-based progression, undo across nights and wins/losses, confirmed retry/reset, guarded pause and isolated validated saves are implemented. No catalogue entry is added.

## Verification

- 19 passing tests: 11 engine, eight jsdom 26.1.0. The three authored routes complete with 13/11/8 work points left in 14/17/20 journal actions. These scores are feasible, not proven optimal.
- UI routes reload after every committed action. All eight rotations/reflections of each engine route succeed. Sixty deterministic varied legal runs exercise replay, immutable inputs and bounded resources.
- Tests cover rain-before-growth, dry stalls, mature crops, bean shade/removal, repeat-crop yield, soil/compost, bounded cross-watering, work limits, early end confirmation, final-night loss, undo/retry, sequential unlocks, forecasts, keyboard/native-control guards, pause/modal/parent guards, corrupt-save preservation/recovery, reset isolation and quota failures.
- Engine/game scripts pass syntax checks. New CSS/JS references exist. Root Games navigation and bridge references are validated against the remote repository tree; the local recovery checkout lacks the root index, so no complete local repository build is claimed.
- One early rotation test attempted to harvest beans after an unwatered dry night; it was corrected to include watering. The game correctly rejected the premature harvest. No gameplay change was disguised as a passing test.

These are automated engine/DOM checks. No rendered browser, native touch/focus/dialog behavior, screenshot inspection, human enjoyment or content-hours claim. The existing security-policy rendering rejection was not retried or bypassed. The initial prototype does not qualify as an improvement pass.

## Repository and navigation preservation

First-batch FINAL_REPORT was read again: 20 finished, nine historically source-selected, zero verified live. Second branch remained `3949e3d9f8e2e9846dc4c91c436d90b19bbbd341`; its additional round remains six rendered verified and fourteen pending. Third branch began at `37ba1a6d2c3954282981f34fbf4aeaa73f66e7ca`.

Main observed at `b0b1255a9fce7757bbf2f7725ad51f01b3250f4e`. Changes from the previous observed main were confined to Gummy Bay and credits. Current main index.html, app.js and changed Gummy Bay index.html were checked: no Switch workspace, playerStudy or studyBtn matches. No launcher, first/second-batch, Gummy Bay, save key or catalogue edits. The previous rendered desktop/mobile navigation audit is not counted as fresh testing here.

The recorded publication barrier was not repeatedly retried. GitHub Pages requires the owner to select GitHub Actions in repository Settings → Pages, rerun deployment and verify routes. The separately hosted Study Desk address previously showed an owning-account sign-in wall. No source commit is presented as a live release.

## Counts and next work

Third batch: exactly 50 ledger slots; 19 built prototypes, 0 qualified improved, 0 browser-tested, 0 integrated, 0 live; 31 unassigned. Second batch: 20 built and initially improved; 20 additional source upgrades, 6/20 rendered verified; final selection remains pending.

Fallow Table needs natural rendered desktop/touch play and inspected screenshots. Assess whether crop rotation matters enough within the short season, central cross-watering dominance, bean-shade readability and replay depth. Implement a substantial upgrade based on the observed weakness, then verify saves, progression, loss/retry, restart and navigation before selection. Continue the remaining distinct prototypes without treating pending source refinements as completed rendered passes. Automation settings unchanged.
