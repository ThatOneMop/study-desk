# Ember Parcel — recoverable crossings

28 October 2026. Implementation `194b6fbaa4d2b54f52c1d29fcc179f563194b1ed` on `indie-collection-two-dev`.

## Observed weakness and concrete change

Rendered first garden crossing left the player at two warmth with an empty bag and stranded timber behind them. The earlier additional-round boardwalk source only allowed permanent placement; route resources could not be recovered after crossing.

Build a protected crossing for one bundle and one warmth; after passing it, optionally lift it for one warmth to recover the bundle. The original garden or deep water returns, exposing future footsteps/flares or water cost. Reuse timber for another crossing or four warmth. C keyboard mode, touch-sized controls, explicit cost hints and legal-cell highlighting make the choice readable. Hidden views cancel pending resets and cannot resume until visible; v1 journals and best records are preserved.

## Verification

- 2026-10-28: 22 engine + 11 DOM checks pass. Four original, four kept-boardwalk and four reclaimed-boardwalk routes remain legal; new routes save/replay after every action and preserve all gardens. Recovered terrain hazards, full-bag/zero-heat/invalid/repeated lifting, resource conservation, undo, key/pointer mode exclusivity, saved recovery, scoped reset and hidden confirmation guards checked.

- Direct rendered walkthrough: played old permanent crossing before editing, then lifted it from an existing saved journey, restored the garden, tested burning it and undo, and completed the delivery by stoking the recovered bundle. Completed the other three reclaimed crossings at 390px iframe width with pointer controls; final route reached zero warmth with one recovered bundle, survived reload and delivered. Loss/undo/retry, pause, confirmation cancellation and field guide inspected. Desktop baseline and phone active-mode screenshots visually reviewed. Narrow-screen pointer play is not physical touch.

- CI 40648857538 on 194b6fbaa4d2b54f52c1d29fcc179f563194b1ed: 522 engine + 357 DOM = 879 checks pass, including asset/syntax, first-batch integrity and second-batch gates. Native browser job 122684566369 passes desktop and emulated-touch four original deliveries plus all eight kept/lifted crossing campaigns, exact constructed/reclaimed/won save reloads, zero-warmth rescue, natural loss/undo/retry, equipment, confirmations, pause, isolated recovery/reset and navigation. Other browser groups still running at this checkpoint.

- 62 Ember screenshots retained in artifact 12798682617. Inspected desktop-lifted-choice-0, touch-lifted-reclaim-1 and touch-lifted-won-3: legal crossing highlight, readable cost/mode hints, restored water, intact records and wrapped phone controls. ZIP SHA256 b95edd2995e534a1063b756827612ff49735c0af5b4848d906c81781665f451a. Automated routes and agent walkthroughs are reliability evidence, not human enjoyment or physical-device testing.

## Quality and preservation

Distinct calm fuel-routing puzzle with reversible construction and real garden/water exposure. Optional lift trades one warmth/action and protection for portable fuel. Four authored routes remain short; the direct path can still beat elaborate construction on score. Readable tested controls, but no sound layer or broader progression. Retain unselected pending whole-slate comparison; no human enjoyment claim.

First-batch FINAL_REPORT and current instructions/branch source were reread before editing; no AGENTS.md in the second branch tree. Main `55c330d9ec493afc40e81e89a371f64cbd5bd8b0` and third branch `fb0ed7a0f0ed6f5fd8f3c2a53caae1ae732d9ecf` were checked again before recording results and remain untouched. Buildless HTML/JS conventions and isolated v1 saves retained. No new catalogue or deployment changes. The previous workspace-control removal and successful Pages deployment remain valid; no unchanged publishing failure was retried.

## Actual totals and next step

Second batch: 20/20 playable, initially improved and finished; 20 additional upgrades have source, **9/20 verified**. Eleven additional reviews remain. Thirteen initial second-batch entries are already integrated by concurrent work; zero new integrations or verified live upgrade routes in this increment. Third batch: **24/50 built, 0 qualified improved, 0 browser-tested completions, 0 integrated, 0 verified live**. No new candidate was built this run. First collection's 20 sources, nine selected entries and saves preserved.

Next: finish Clockwork Tide's rendered storage review and iteration; compare/select after all twenty additional upgrades, then integrate against current main. Finish the remaining distinct third-batch candidates and their rendered improvement passes. Existing hourly cadence remains unchanged; the overall task is not complete.
