# Mycelium Yard improvement — 2 November 2026

Slot66 is improved on indie-collection-three-dev and remains unlisted. Implementation 6aab85078ce50aa54372b78764ef6ac3d818c1eb; rendered-feedback follow-up 16031393d5b4eab1bc77e32f02fb15aa110f843b.

## Before and after

The initial rendered baseline scored46/57/57 against14/24/34 goals with essentially the same fast-crop strategy. Blue bell lacked a useful purpose. Phone actions sat beneath six beds.

Each market now offers two buyers with different ordered baskets and freshness limits. Harvesting the requested species fills the current basket automatically; surplus sells normally. A basket pays a one-time bonus that can fund the next planting. Two deliveries award a saved buyer badge. Buyer choice locks at the first subsequent harvest. Fresh-blue deliveries require timing watering and ventilation; mixed baskets reward staggered planting. The base sales unlocks remain forgiving to preserve existing records. These are six replay goals, not six new games.

The phone action dock keeps the selected bed and plant/water/harvest/compost/vent/end-day controls visible. A rain-risk warning identifies threatened beds. First-pass screenshots revealed that jobs, coins and the sale message remained outside this view; the follow-up brings those into the dock too. Final screenshots show the blue crop, imminent rot warning, available vent action, daily job budget and successful basket bonuses without scrolling to a separate tool panel.

Old v1 saves retain crops, day, money, harvests and records. Missing buyer fields migrate to an empty challenge and no badges; past harvests do not award badges retroactively. Restarts preserve earned badges and records.

## Evidence

CI41398713369 passed at16031393d5b4eab1bc77e32f02fb15aa110f843b:15 engine tests; six baseline sales campaigns and twelve buyer campaigns (six buyers in each desktop1280x1000 and390x844 touch-emulated Chromium context), all with per-action save reload. All six badges accumulate, and route sales are29/30/42/46/48/48. Loss/retry, Escape, pause, corrupt-save preservation/recovery, quota handling, fixed-dock budget/feedback visibility and no horizontal overflow/page errors pass.74 bundled routes/286 HTML asset references and nine selected first-batch integrity checks pass. Artifact13119514697 SHA256b69e6181bfca025cbce199d42581bd165554314f6976d0ff687a6f505f8f6f31 verified. Touch Forest chef rain-risk/Blue bell and final Evening hamper badge screenshots, plus desktop mixed-basket completion, inspected. Automated rendered play, not a human enjoyment study.

Earlier improvement CI41398392406 also passed; artifact13120725561 SHA2565c21e9c529a448e7029c044176d07802649eef3f4389ac44970b916fe2e4c80d was verified and desktop/touch screenshots inspected before the follow-up.

Engine coverage includes six legal buyer routes, free choice/harvest locking, aged and rotted crop rejection, no double rewards, rain destruction/recovery, legacy save migration, persistent badges and malformed-state rejection. Negative-condition fixtures are unit tests; winning browser routes use visible controls and earned market progression.

## Assessment and remaining qualification

Ordered mixed baskets and freshness create crop-timing and rain decisions beyond the easy sales goals. Six optional badges support distinct replay plans without increasing the ten-morning run length. Fixed phone actions and visible income/job feedback remove repeated selection-to-action scrolling. Promising relaxed strategy candidate; full browser qualification and comparative selection still required.

Still pending: full keyboard focus/hotkey coverage, rendered legacy migration and rejection feedback, hidden parent confirmation/recovery guards, Games/Collection navigation and real catalogue shell integration. Thus ledger browserTested remains the stricter fully-qualified25, although all26 built games now have rendered baseline evidence. No public release is claimed for Mycelium Yard.

This is a compact original strategy game with ten discrete mornings, deterministic weather and six buyer challenges. No audio, physical-device or human enjoyment study; no content-duration claim.

## Preserved state and next run

Exactly50 third-batch slots:26 built,26 improved,25 fully browser-qualified,25 integrated and25 live;24 unbuilt. Batch two remains20 built,20 initial passes,20/20 additional-round verified, nine selected/integrated/live. First batch and all existing saves/releases preserved.

Main re-read ate148ea2a0628a581c54441db8a24535f39c89e39 and not changed. First-batch integrity checks pass; concurrent Gummy Bay, requested games and separate Numberworks work are untouched. No launcher or navigation control changed in this increment. The prior Switch workspace removal and successful live deployment audit stand; no unchanged publishing failure was retried. No automation changed.

Next: qualify Mycelium Yard, compare it against the released slate, then integrate only after passing shell/regression tests. Continue slots67–90. Development remains in progress; do not pause the hourly task yet.
