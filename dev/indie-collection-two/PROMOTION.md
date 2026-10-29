# Second-batch promotion checkpoint — 29 October 2026

All 20 initial games and all 20 additional-round upgrades are verified. The separate checklist and ledger record 40 meaningful passes and nine selected finalists. First-batch sources and current catalogue entries remain intact.

Hollow Keeper is merged with current main's feel-kit.js/feel.js, HKGame interface and title/pause/audio layers on branch `indie-two-promotion`, commit `519934be03660c6c68dd8c0eeca7bc0060a43127`, based on main `2098eeb559d90c840faaab3b8c500b3623f37cbf`. The new source preserves version-one saves and per-step undo. The feel-layer shortcut legend now includes tool 6. Browser routes explicitly enter the existing title screen after each reload; no bypass is used.

52 merged engine/DOM checks pass locally, as does current curation-regression.cjs (46 entries, filtering, retained preferences/saves, pause and absent workspace controls). Full rendered merge regression and repository asset checks are pending on the promotion branch. Do not infer main integration or live release from this source commit.

Next: inspect promotion CI, fix failures, inspect merged desktop/touch screenshots, then promote the tested changes with a fresh main lease. Merge and regression-test the other eight selected upgrades; preserve concurrent visual effects and the 20 deliberately retired Nightshift/Afterlight entries. New selected Cairn & Cord and Murmuration need catalogue integration and launch checks. Keep the first batch, Lane Eight, Gummy Bay and third-batch branch untouched.

Counts: second 20 built / 20 initially improved / 20 additionally verified / 9 selected / 0 newly promoted additional-round versions in this run / 0 newly verified live upgrades. Thirteen earlier second-batch entries remain in main from concurrent work. Third 24/50 built, 0 qualified improved/browser-tested/integrated/live. No automation was changed. The task remains incomplete.


## First upgrade published; next two staged — 29 October 2026

Hollow Keeper promotion `519934be03660c6c68dd8c0eeca7bc0060a43127` passed CI 40821596198 (52 focused checks, current curation, assets and first-batch integrity, full desktop/touch campaigns). Inspected desktop-warning, touch-regrow-preview and touch-regrow-safe from artifact 12874183820, SHA256 06268e704769887ab546ef194549b330ffb5878657967e6c809f5a5b78dec66a. Existing visual effects and pause/audio remain. The last screenshot caught the title fade; later captures now wait for its hidden state. This is a test capture refinement, not a new gameplay pass.

Main fast-forwarded with an expected-head lease. Pages run 40826925321 succeeded. Live https://thatonemop.github.io/study-desk/games/hollow-keeper/index.html was played through the first wave: placed a bed via preview/confirm, launched and safe-marched to preparation for wave 2 (3 hearts, 8 resin). Reload preserved it; Study Desk return showed current collection. Full gameplay coverage comes from native CI, not this shorter live smoke check. Live launcher retains Games/search/Collection with no Switch workspace control.

Cairn & Cord and Murmuration source/tests and two catalogue entries are staged at `0f47f738eecde95c0608f9c045091e8e690eda6b` on indie-two-promotion. 62 engine/DOM checks plus updated curation regression pass locally. Exact-source native CI pending. Their entries use verified control descriptions; existing 46 entries, Lane Eight, retired list and saves are preserved. Do not count these two as main-integrated/live until promotion.

Counts: 20 built/initially improved/additionally verified; 9 selected; 1 selected additional-round version promoted and live-verified, 8 remaining. Thirteen earlier initial-version second-batch entries remain in the catalogue from concurrent work. Third 24/50 built, 0 qualified improved/browser-tested/integrated/live. No automation changes.
