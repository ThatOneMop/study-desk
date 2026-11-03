# Cinderwatch improvement — 3 November 2026

Gameplay implementation [8200ecf7eeb3a95e1c9aba38a9537f269076fd82](https://github.com/ThatOneMop/study-desk/commit/8200ecf7eeb3a95e1c9aba38a9537f269076fd82); rendered-layout correction [2baee68396b54a97f71c0e5316b1fc0af652f465](https://github.com/ThatOneMop/study-desk/commit/2baee68396b54a97f71c0e5316b1fc0af652f465). Candidate72 remains unlisted.

## Before and after

Baseline routes took3/5/4 actions and never refilled. Cutting could cheaply stop fronts, while direction text did not show actual threatened tiles. Now completing a standard clearing unlocks its woodland-steward assignment: cutting is forbidden and two marked groves must remain unburned alongside the cabins. Water can be used to soak unburned brush ahead of a front as well as extinguish fire. Tested preventive-soak routes take4/5/6 actions; the latter two refill while fire continues. Separate steward records preserve prior standard records, and old saves migrate into standard mode. This changes available tactics and loss conditions, rather than adding repetitive levels or timers.

Selectable-action forecasts simulate the action and next spread without committing it, warn about immediate losses and outline newly ignited tiles. Tile and preview selections persist in a separate key. Initial rendered inspection found sticky forecast text covering upper tiles and excessive phone height. The follow-up removes overlay positioning and compacts board/controls. Final inspected screenshots show legible orange threatened-cell outlines, pink grove markers and clear forecast text. Some scrolling remains; no claim of polished animation or long-term content.

## Validation

CI41550006639 at 2baee68396b54a97f71c0e5316b1fc0af652f465 passed seven distinct engine checks and twelve rendered wins: three standard clearings and three earned steward assignments in each desktop1280×1000 and touch-emulated390×844 Chromium context. Tested steward routes begin with preventive soaking and finish in4/5/6 actions; the latter two use refill. Forecasted action states match rendered outcomes, danger outlines render, selection/preview preferences and saves survive reload, separate records/unlocks persist, and cabin loss/retry, native Space/Escape, pause, corrupt/quota save handling and Games navigation pass without page errors or horizontal overflow.74 bundled routes/286 HTML references, source syntax/Freedoom structure and nine first-batch integrity checks pass. Artifact13190522608 sha256:b1bed9d6c9fadb53dc0aa25fb429e47f9359ea4462d66e8fdcd65585331838b7 verified; touch-forecast-2.png and desktop-forecast-1.png inspected. Automated reliability and agent visual assessment, not human enjoyment or physical-device testing.

[Passing workflow](https://github.com/ThatOneMop/study-desk/actions/runs/41550006639). Initial improvement run41549711809 also passed and supplied the screenshots that motivated the layout correction. Engine checks are counted once despite being imported by the browser harness. Successful routes are not proven globally optimal.

## Assessment and next step

Water now has preventive and reactive uses, refill timing is exercised, and earned assignments impose a meaningful conservation constraint. Still a small fixed-layout planning game; no selection yet. Next qualify actual bridge visibility, hidden confirmations, keyboard ownership, rendered legacy migration, unrelated-save isolation and natural grove-loss/retry. Compare against stronger progression candidates afterward. Wet grove artwork and secondary-control scrolling remain polish limitations.

## Counts and preservation

Third batch32/50 built,32 improved,31 fully browser-qualified;18 unbuilt. Exactly50 slots retained. The rendered improvement is verified, but Cinderwatch does not yet increment the ledger's full-qualification browserTested count. Second-batch additional round20/20 remains complete. Active integrated/live0/0 under the existing PR110 current14-game curation hold;25 historical third-batch and9 second-batch releases remain recorded.

Main re-read at fa57730f70904ae5f15e47fe0c7e55dc28144c88 is unchanged; the existing Switch workspace/navigation audit remains applicable. No new workspace controls or live release, and no repeated publication attempt. First-batch integrity passes; Numberworks, Gummy Bay, requested-GitHub-games and their saves were not edited. No automation changed or paused.
