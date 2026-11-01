# Seedwake integration and live verification

Completed 2 November 2026 (Sydney run date).

- Implementation:53dee6eac0ee208194923edbaab6485f58df9678.
- Embedded Games navigation repair:129a80b3efe28d9391c45229d2321edb0727229c.
- Qualification:b7a14e1eb45e31bfad68650813c4dbd98289fe0b, CI41314769769.
- Main integration:059f7d64b95bca528098eed23d8f5c70914922dc, release CI41315202608.
- Pages deployment:41315386416, succeeded.
- Live game:https://thatonemop.github.io/study-desk/games/seedwake/index.html

## Improvement and selection
Rendered play exposed one-step-only forecasting: reserve/deferral experiments had to mutate the saved garden and unwind moves. Route rehearsal now branches from an immutable anchor, uses the real sowing rules, reports each landing and seed/flower tradeoff, and compares bouquet/gust/reserve outcomes. It supports return-to-anchor, bounded undo, discard and deliberate planting. No temporary records/unlocks/save writes; reload returns to planted state. Original v1 saves and unreadable-save protection preserved. Selected for relaxed, consequence-driven circular sowing that differs from the existing grid gardening games. Three compact fixed gardens remain; no duration claim or human enjoyment claim.

## Evidence
40 focused tests (20 engine,20 DOM). Release CI completed18 desktop/touch-emulated authored campaigns,12 rehearsed; per-action journals/reload, branching, planned loss/undo, keyboard/native dialogs, pause/hidden confirmations, corrupt-save recovery, reset and direct/embedded navigation passed. Actual catalogue search/group/sort/favourite, rehearsal/earned win, Collection/Games return, restart/save retention passed.72 launch routes, relaxed navigation, active credits, source/assets and9 first-batch release hashes passed. Initial candidate CI41314535262 caught missing embedded Games messaging; it was repaired, not waived.

Release artifact13086986948 SHA256cf0458c1b5ada76a00ba35a5b0ae0fe4ed1a3a7b8a4a05f2b6ea81934dcdc480. Inspected desktop catalogue/cover, phone rehearsal and saved-return screenshots. Phone uses vertical scrolling, with readable stacked controls and no horizontal overflow. Earlier qualification artifact13086653650 includes full campaign evidence; inspected desktop final garden, phone reserve route and planned loss.

Live browser: first request while deployment was still running returned404; normal reload after deployment succeeded. Four-handful reserve route rehearsed, planted, reloaded; record4 and second-garden unlock retained. Games navigated to actual catalogue; search after initialization returned Seedwake; launch retained record; embedded Games returned to parent collection; reopening and Resume retained completed bouquet. Deployed catalog.js?v=seedwake-20261102 matches source. No Switch workspace buttons. No remaining publishing barrier or user action. Screenshot of live completed record inspected.

## Counts and next work
Third ledger retains exactly50 distinct slots41–90:24 built,20 substantially improved and browser-qualified,20 integrated,20 live. This run built0 new candidates, qualified/improved1 and published1. Four built candidates61–64 and26 unbuilt slots65–90 remain. First batch20 preserved; second batch20 and additional round20/20 preserved, with9 selected/live. Source integration and live release independently verified. Concurrent Study Desk, requested games and Gummy Bay changes preserved by fresh-main release and ref leases. No automation modified; do not pause while incomplete. Next: Foldlight61 rendered baseline and improvement.
