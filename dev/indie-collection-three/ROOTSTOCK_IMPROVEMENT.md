# Rootstock80 — substantive improvement

4 November 2026. Gameplay commit [f1a048bf88ca85ccf69bf80431960acd009b9a81](https://github.com/ThatOneMop/study-desk/commit/f1a048bf88ca85ccf69bf80431960acd009b9a81); screenshot-driven UI correction [65323beded6c8758fc0f6466089151a84bb279e2](https://github.com/ThatOneMop/study-desk/commit/65323beded6c8758fc0f6466089151a84bb279e2).

## Before and after

The baseline rendered routes used only one or two crosses and did not need pruning. Completing an ordinary request now unlocks its paired orchard, which requires the original cultivar and its opposite six-trait cultivar alive together. Keeping complementary breeding lines while freeing nursery pots is consequential: the first two tested paired routes use four crosses and two pruning decisions. Paired records and completion seals persist separately from ordinary records. Third paired route uses two crosses. No additional game or inflated level count is claimed.

Original SVG trees now reflect height, hardiness canopy colour, fruit colour and firmness size. Discovered cultivars have a visual album. Phone nursery cards scroll horizontally, bringing the bench nearer; the carousel retains position across rendering. Mode changes require confirmation. Legacy v1 saves retain their discoveries/records and acquire empty paired seals. The save key is unchanged.

## Evidence

[Passing final workflow](https://github.com/ThatOneMop/study-desk/actions/runs/41751250289).

CI41751250289 at65323beded6c8758fc0f6466089151a84bb279e2 passed six distinct engine checks and twelve rendered deliveries: ordinary and earned paired requests across desktop1280×1000/touch-emulated390×844. Per-action exact reload, parent/crossover/offspring choices, required pruning in first two paired routes, discard, records/restart, Space/Escape, pause, corrupt/quota storage, Games navigation and no horizontal overflow/page errors pass. Repository74 routes/286 asset references, syntax/Freedoom structure and nine selected first-batch integrity checks pass. Final artifact13285799142 SHA256db7e0c72011b7fecdf559192bd3dec364f696b1909a79380a9238801dcf0f9d4 verified and touch-paired-1.png inspected. Earlier successful CI41750990176 artifact13285923556 SHA256416713553210b23501e86c1a40b527a9dfa6610fe042b6cb248797af17bbf688 verified; desktop-paired-0.png/touch-paired-1.png inspection prompted score-label and scroll-preservation fixes.

Actual button/touch actions and normal progression drive rendered routes; winning state is not injected. Archive hashes were verified and screenshots opened. Desktop trait differences are visible; phone no longer stacks six trees above the bench. Earlier screenshots revealed that paired mode displayed the ordinary best record; final phone screenshot confirms the corrected four-cross paired score. Functional automated tests and visual review are not human enjoyment or physical-device testing.

## Remaining work

Full keyboard and embedded-shell qualification, hidden mode-change confirmations, carousel behaviour regression and stronger save invariants remain. Three fixed request pairs still constrain replayability. No catalogue selection yet.

Batch3 remains exactly50 slots:40 built,40 improved,39 browser-qualified,10 unbuilt,0 currently integrated/live. Historical release counts remain separate. Batch2 additional round remains20/20. Fresh main remains e2ba9d1a221da8cdb3180a7f372a54743f6c52c2; concurrent Harvest Protocol and all current curation are preserved. No unchanged publication or Switch-workspace audit was repeated, and no automation changes were made. Current development tree still lacks AGENTS.md and the historical first-batch FINAL_REPORT.md; previous baseline evidence is preserved.
