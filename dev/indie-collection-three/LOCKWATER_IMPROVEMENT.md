# Lockwater improvement — 3 November 2026

Implementation: [b21dc51224a51fc0f67a52a6e5e1047b25f8909d](https://github.com/ThatOneMop/study-desk/commit/b21dc51224a51fc0f67a52a6e5e1047b25f8909d). One existing candidate improved; zero new games counted.

## Before and after

Baseline rendered routes never needed transfers. The three deliveries mainly repeated direct fills and drains, phone diagram text shrank to about8px, and reload restored generic starting advice.

Completing a standard delivery now earns its single-inlet contract. B cannot draw reservoir water: the player must stage water in A and transfer it into B while arranging a navigable route. Returning home is insufficient until B retains the requested reserve (1,2 or3). This creates useful water-routing and return-preparation decisions. Contracts have independent persistent water/turn records. The third contract has a6-unit budget instead of the standard4 because it must finish with B full; this is a different constraint, not a new game or a claim of additional hours.

A bounded state-space search detects when no completion remains, including stranded situations missed by the old simple loss threshold. It supplies a warning, not an optimal action sequence. Full-size water/gate readouts, compact phone controls and state-derived guidance survive reload. Job and mode changes now require confirmation. Legacy saves retain their original records and default to standard mode.

## Evidence

CI41497739027 at b21dc51224a51fc0f67a52a6e5e1047b25f8909d passed eight engine tests and twelve rendered clears: three standard deliveries and three single-inlet reserve contracts in each desktop1280×1000 and touch-emulated390×844 Chromium context. Contract routes require transfers and finish B at1/2/3 respectively in13/17/18 tested turns. Every action reloads exactly; separate records, earned contract unlocks, restart, native Escape, job confirmations, natural loss/retry, keyboard sail, pause, corrupt/quota saves and Games navigation pass.74 bundled routes/286 asset references, source syntax and nine first-batch release integrity checks pass. Artifact13166144931 sha256:3ed5d04a3ddaa63fac0781820885c54f85f0892689b09a31922dcebcbb882d79 verified; touch-contract-2.png and desktop-contract-1.png inspected. Automated reliability and agent visual assessment, not human enjoyment or physical-device testing.

[Passing workflow](https://github.com/ThatOneMop/study-desk/actions/runs/41497739027). The final phone screenshot shows all six water controls and both sail controls with readable full-size water levels; B fill is disabled in contract mode. Desktop screenshot shows the boat/chamber relation, matched levels and transfer guidance. Contract targets can still scroll above the controls. Standard tested routes remain11/14/13 turns; contract routes13/17/18 are not claimed water-optimal or human enjoyment evidence.

## Status and next work

Third batch30/50 built,30/50 improved,29/50 fully browser-qualified;20 unbuilt. Exactly50 slots remain. Second batch additional round remains20/20. Current integrated/live0/0, with historical25 third-batch and9 second-batch releases retained. No new live link exists for Lockwater.

Full qualification must cover actual bridge visibility and pending confirmations, cancelled callbacks, rendered legacy migration, native keyboard ownership and unrelated-save isolation, followed by comparative selection. The game remains a compact deterministic puzzle; no substantial-duration claim is made.

Main was freshly re-read at fa57730f70904ae5f15e47fe0c7e55dc28144c88 and preserved. Its exact14-game curation remains the release hold; no unchanged publishing retry was performed. Prior navigation audit remains applicable to unchanged main. Numberworks, Gummy Bay, requested-GitHub-games, existing saves and first-batch files were not changed. No automation was modified or paused.
