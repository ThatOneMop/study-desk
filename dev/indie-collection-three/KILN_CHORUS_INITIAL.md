# Kiln Chorus — initial prototype

2026-10-26. Slot 54 in the separate third collection.

Implementation commit: `68dd28cf93bf79f10b8a48a0603e052b93c7c068`.

## What changed

A new original thermal scheduling game, with shared chamber heat and independently warming clay pieces. Stoke spends fuel; Bank/Vent cool the chamber; drawing a mature piece removes it before the remaining pieces update and drops chamber heat by one. Glaze marks accumulate only in a piece's firing band. Any overheat spoils the load. Fuel exhaustion with cold unfinished clay is a second loss condition. Undo/retry are unlimited and retain earned records.

Three authored loads move from two different clay responses to three pieces and narrow firing bands. Fuel-efficient test routes take 7/9/13 actions and leave 3/4/3 fuel. Finite-state exploration confirms these fuel ceilings for the current rules; it does not establish human enjoyment or long-term replay value. This is distinct from mould tracing/pouring, restoration work, graph untangling and bead tilting.

The source includes original SVG pottery, patterned heat bands and text labels, two-step action/forecast controls, responsive CSS, reduced motion, keyboard/native buttons, firing history, a temperature trace, pause/dialog/parent guards and isolated safe saves. No dependencies/assets were imported into the runtime. No catalogue or shared launcher files changed.

## Evidence and limits

13 tests pass (7 engine, 6 jsdom 26.1.0). Campaigns complete via button routes with reload after each action. Checks cover thermal inertia, cumulative glazing, removal order, read-only forecasts, overheating, fuel exhaustion, terminal guards, undo/retry, best records, journal/unlock validation, input ownership, dialogs/pausing, trusted parent hide, corrupt recovery, isolated reset and quota failure. Exhaustive successor-state totals: 2,715 / 62,445 / 20,973. Dialogs are simulated. Both scripts pass syntax checks. Local HTML routes/assets resolve against the existing branch tree and new files.

No rendered play, screenshots, native desktop/touch, mobile layout or full-repository build evidence. The existing browser security-policy rejection was not bypassed. Built prototype is credited; improved, browser-tested, integrated and live remain false. No completed improvement pass is claimed. Next: naturally play and inspect the kiln on desktop/touch, identify its largest gameplay weakness (especially depth/replay and forecast clarity), and make a substantive playtest-led upgrade before public selection.

## Preservation and source audit

Starting third-branch head: `b46e668946ce42afbb2bd3ffb3046771f69bf0bb`. Main observed: `6ab8e8028e98270b16b4d71e4ab0083d06a6d7ed`; second branch: `3949e3d9f8e2e9846dc4c91c436d90b19bbbd341`. No AGENTS.md exists in the retrieved third-branch tree. First-batch FINAL_REPORT remains 20 finished/improved, 9 source-selected, 0 verified live. Second additional round remains 20 source upgrades, 6 rendered-verified, 14 pending.

Main advanced with concurrent launcher/catalogue and Gummy Bay work. Latest main index.html/app.js contain no Switch workspace label/handler matches; changed JavaScript/HTML diff additions have none either. Existing Games/Collection navigation stays intact. No new rendered navigation claim. Those concurrent changes are preserved without merging unfinished prototypes onto main.

Latest deployment evidence: [run 40281522302](https://github.com/ThatOneMop/study-desk/actions/runs/40281522302), on the observed main, passes Verify game routes and local assets but fails Configure GitHub Pages; preparation/upload/deploy are skipped. The current workflow has removed enablement and says it requires an existing Pages site with Settings → Pages → Source = GitHub Actions. No new error log was obtained, so no freshly confirmed permission diagnosis is claimed. No workflow change or repeated publication attempt was made. Earlier hosted-site sign-in/cache evidence is unchanged; no live release is claimed.

Third batch: **14/50 built; 0 improved; 0 browser-tested; 0 integrated; 0 verified live**. Exactly 50 slots remain in the ledger; slots 55–90 await implementation. This prototype stays off the public catalogue.
