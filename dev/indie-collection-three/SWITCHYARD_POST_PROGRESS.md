# Switchyard Post — candidate67 progress

2026-11-02. Development branch: indie-collection-three-dev. This is one original game, not six games or a reskin. Nothing was added to the public catalogue this run.

## Current counts

| Collection | Built | Initial improvement | Additional requested round | Fully browser-qualified | Currently integrated/live |
|---|---:|---:|---:|---:|---:|
| Second |20/20|20/20|20/20|20/20 recorded|0/0 (9 historical releases)|
| Third |27/50|27/50|not applicable|26/50|0/0 (25 historical releases)|

Exactly50 third-batch slots remain. Slots68–90 are unbuilt; candidate67 has rendered gameplay evidence but still awaits full shell qualification. The historicalTotals snapshot remains labelled as pre-PR110. First-batch sources and existing development histories were not modified.

## Implemented loop

Drive one locomotive around run-around sidings. Push a loose wagon in a straight line, or couple one adjacent wagon and pull it through corners into the engine's previous space. Deliver the red and blue wagons to their platforms, release coupling and park at HOME. Three authored yards unlock sequentially; earned action records persist. Keyboard arrows/R/B/Z and visible touch buttons are supported. Undo, confirmed restart, pause, scoped storage and explicit corrupt-save recovery are implemented. Artwork is original CSS/code.

The initial implementation exposed an unsolvable dead-end layout. Run-around track was added before the playable baseline; that repair is not counted as the later improvement pass.

## Rendered weakness and substantial improvement

Baseline desktop and390px touch screenshots showed that coupling feedback sat below the controls and outside the board viewport. The three short standard yards had only action-count replay. Engine review also found that reaching200 actions silently stopped play.

After earning a standard delivery, a player can choose fragile mail. Red must be pulled, never pushed; blue retains its normal handling. The exchange yard uses a sheltered red platform because its original dead end cannot accept a pull-only arrival. Fragile contracts have separate records and three persistent badges; standard records remain separate. Tested routes differ from standard in the first two yards. The third yard's shortest standard route also satisfies fragile handling; this is a known depth limit, not a new level.

Sticky board feedback now keeps the active wagon and fragile rule visible on phones. Delivered platforms are marked, completed boards retain contrast, and reload restores mode-appropriate instructions. Exploratory runs can exceed200 actions; undo retains the latest200 actions. Version1 saves migrate without invented fragile badges.

## Evidence

- Baseline source:9f2198a7d62030e3035c07c7c5346fe397709e20. Harness syntax fix:12630c4f26964bd94b1e21e2479aada23fc9aa03. Baseline CI41419711993 passed five engine checks and six rendered yard wins, persistence/retry/pause/recovery and repository checks.
- Baseline artifact13129511479 SHA256f2862032fc5edc37b8dc96451154a68e4f54615299eb8f3b5074ab1882cceb1a verified. Desktop opening-yard and touch evening-yard screenshots inspected.
- Gameplay improvement:3b086c85a56cbce43b224f84ef2e93463ffa7e36. Navigation-test timing fix:4ac0ff6a904d9bbe5a802fdd384353ffdd0b62d1. Screenshot-driven feedback/contrast follow-up:7f6417ae3d3852f7b8baba225d96bb771654ff75.
- [Final passing CI41421449886](https://github.com/ThatOneMop/study-desk/actions/runs/41421449886): eight engine tests; twelve standard/fragile rendered wins with per-action reload across1280x1000 desktop and390x844 touch-emulated Chromium; two keyboard completions; earned records/badges; v1 migration; undo/retry; native Escape; pause; corrupt-byte preservation/recovery; quota fallback; standalone Games navigation; no horizontal overflow/page errors.
- Repository checks passed74 bundled routes/286 HTML asset references and nine selected first-batch source-integrity checks. These describe the preserved development branch, not the current main catalogue.
- Final artifact13129842620 SHA2564137fea4d34c82fad4a9d419a053cbf4a1c053bafd8e1a40e5af8523ea13722e verified. Touch exchange shunting and final fragile delivery screenshots inspected. Prior improved desktop keyboard completion also inspected.
- Failed runs41419106374 (test-harness syntax) and41420740969 (navigation assertion before completion) are not passing evidence.

These are automated rendered playthroughs and visual inspection, not human enjoyment research or physical-device testing. No duration or20-hour content claim is made. There is no irreversible loss state: blocked moves, undo and restart support recovery. Three finite yards and one repeated optimal fragile route limit depth; no audio is implemented.

## Preservation, release and next steps

Fresh main remained fa57730f70904ae5f15e47fe0c7e55dc28144c88, the deliberate PR110 exact14-game curation. Main, Numberworks, requested-GitHub-games, Gummy Bay, existing saves and schedules were not edited. The previous live/source navigation and publishing audit remains applicable to unchanged main; no unchanged publishing failure was retried or counted as work.

No new live URL is claimed. Public integration remains held by the exact14 catalogue policy, not a newly observed deployment-permission failure. Catalogue expansion must be reconciled with that policy before releases.

Next finish candidate67's real-bridge parent-hidden confirmation/recovery, document visibility, input edge cases and unrelated-save preservation checks; compare it with the existing slate. Then build slots68–90, giving each a rendered baseline and substantive improvement. Keep all unfinished candidates on the development branch. The task and hourly schedule are not paused.
