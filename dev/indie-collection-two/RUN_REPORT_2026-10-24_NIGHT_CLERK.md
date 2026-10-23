# Night Clerk — second batch, slot 36

Date: 24 October 2026 (Australia/Sydney).

The second collection now has **16 playable, meaningfully improved and finished candidates out of exactly 20 new slots**. Four remain concepts. No first-batch game, Nightshift/Afterlight entry or reskin is counted. Night Clerk remains on `indie-collection-two-dev`; this increment made no public catalogue or hosting changes.

## Playable loop and improvement

Night Clerk is a short haunted-hotel room puzzle. Read guests’ arrival notes, ask for exact needs, then distribute six room keys. A guest’s room features, floor and neighbours all matter. Noisy guests disturb adjacent sleepers through a shared wall or ceiling; a felt screen silences incoming noise but cannot satisfy a physical near/away requirement. Five authored shifts introduce more guests and unlock two movable screens after the second shift. Exhaustive room-permutation checks confirm that the last three shifts cannot succeed without a screen.

The initial playable commit was [bd0c93d](https://github.com/ThatOneMop/study-desk/commit/bd0c93d7b466d3a0d350d74dfd2f9bc90944a836), with 19 passing engine/interface checks. The separate improvement commit [92004a2](https://github.com/ThatOneMop/study-desk/commit/92004a256d53717b6ec6c9c0f5bf412ed1db1291) adds:

- Room forecasts that reveal only clarified needs, including effects on other guests.
- Atomic occupied-room key swaps and undo that preserves later interviews and cannot erase a bell.
- A fixed phone control panel, native guest chooser and retained keyboard focus.
- Opaque phone controls and accurate room labels after a shift ends.

Original CSS window illustrations and inline SVG guests use no outside assets. The isolated save key is `study-desk-night-clerk-v1`. Saves replay a bounded validated action log; malformed saves remain protected until explicit recovery. Best seals, bell counts and screen counts survive retries.

## Verification

[CI 40027839541](https://github.com/ThatOneMop/study-desk/actions/runs/40027839541) tests exact gameplay commit `92004a256d53717b6ec6c9c0f5bf412ed1db1291`.

- Night Clerk: **18 engine + 12 DOM checks passed**.
- Aggregate second-batch checks: **600 passed — 346 engine, 254 DOM**.
- Native Chrome 155.0.8059.39: desktop 1280×1000 and touch emulation 390×844 each complete all five shifts with three seals. Every committed placement matches its forecast. Mid-plan and completed saves reload exactly. Functional screens, key swaps, undo, native keyboard/touch and cancellation, natural three-bell failure, retry/cancel, bridge suspension, isolated recovery/reset and return navigation pass with zero browser errors.
- First-batch source hashes, nine selected release routes, public assets, syntax, exact twenty-slot gate and current shell/bridge/relaxed-collection checks passed.
- Full native regression: **all sixteen desktop/touch suites passed; all seven CI jobs succeeded**. No previous candidate was altered.

[The native screenshot artifact](https://github.com/ThatOneMop/study-desk/actions/runs/40027839541/artifacts/12533646510) contains 26 images. ZIP SHA256: `f748e3e54b60ff0550dec60ad7d52fe02b538e71c34fb7799dd38e523fda1062`. Desktop shift-five completion and phone swap-conflict images were visually inspected. Cloud UI additionally completed the first desktop shift and a phone-width second shift, including screen-kit unlocking. This is not physical-device testing. Source hashes are recorded in the ledger.

The two legacy shell tests still targeting removed `playerStudy` remain a documented pre-existing limitation. They were not changed or claimed as passing.

## Assessment and selection

Agent review on the ledger’s five-point scale: enjoyment 3, depth 2.5, polish 3.5, reliability 4.5, variety 3.5. These are comparative assessments, not human playtesting results.

The strongest feature is that moving one guest can alter other guests’ rest, making the house a connected puzzle rather than independent checklist slots. The screen is a functional upgrade. The fixed cast, five short shifts and single kit limit lasting depth. There is no generated campaign, economy or audio layer. The ghost-hospitality theme overlaps Tea for Ghosts even though room adjacency and recipe balancing are different mechanics. Keep both in comparison; do not select either automatically.

Night Clerk is finished but **unselected**. There is no new published Night Clerk URL. Final selection and integration await the remaining slate and another improvement/comparison pass.

## Preservation and publishing boundary

The first-batch `FINAL_REPORT.md` baseline remains 20 finished, nine selected, 66 meaningful passes and zero verified live URLs. Existing first-batch sources, saves, catalogue entries and tests were preserved. This increment changed only Night Clerk source/tests, the second-batch workflow and development documentation.

Remote main was reread at `ed2cf603aa47fc26e4f04216d5704351b72a32a9`. Separate all-created-games integration, requested GitHub games and Gummy Bay work were left intact. Future promotion must reread both main and that separate integration work; this ledger’s selection count does not override a separate user-requested catalogue inclusion.

The latest public [Pages run 39925660833](https://github.com/ThatOneMop/study-desk/actions/runs/39925660833), checked on 24 October, still failed at Configure GitHub Pages: “Get Pages site: Not Found,” followed by “Create Pages site: Resource not accessible by integration.” This is a GitHub Pages publishing blocker. It does not block development and does not establish the status of any separately hosted site.

Next: build Clockwork Tide, slot 37. Four concepts remain, followed by slate improvements, comparison, selected repository integration and separate live-deployment verification. The task remains active because the additional batch is incomplete.
