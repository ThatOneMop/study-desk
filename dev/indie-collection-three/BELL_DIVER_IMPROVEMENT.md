# Bell Diver improvement — 2 November 2026

Candidate68 now has a substantive rendered-play improvement. It remains unlisted pending full qualification and comparative selection.

## Before and after

Baseline play retrieved everything with safe solo trips, without needing air pockets. The phone screenshot placed controls below the map, and generic glyphs obscured the bell/diver's identity.

Two optional charters per wreck now reward bringing a specified full bag home together. Heavy recovery requests the instrument and deep heavy crate; Survey bundle requests the instrument and both light crates. Heavy ascent makes route length and air-pocket detours relevant. A first success grants8 bonus coins and a persistent badge; splitting the load yields normal salvage but no badge. Six badges support alternate-route replay. Standard dives remain forgiving and existing v1 progress migrates without retroactive badges.

The phone action panel stays visible alongside the map with oxygen, bag weight, current cell, charter and movement costs. Original vector artwork depicts a brass diving bell, helmet, crates, compass and air bubbles. Current dive prose survives reload appropriately. Screenshot review found translucent text bleed in the first panel version; the follow-up makes it opaque.

Implementation: [258a129](https://github.com/ThatOneMop/study-desk/commit/258a1294d847fdb59c3557192881a4a20075e0be). Follow-up: [59a90f3](https://github.com/ThatOneMop/study-desk/commit/59a90f33f72a0501897e2e14ac3003df69162aa8).

## Evidence and limits

CI41442584001 passed at59a90f33f72a0501897e2e14ac3003df69162aa8: nine engine tests, two standard and four charter rendered three-wreck expeditions across desktop1280x1000 and390x844 touch-emulated Chromium. Charter routes use full bags and air pockets; per-action reload retains state and earned badges. Baseline regression covers purchases/banking, natural empty-bag rescue, abandonment, replay retention, Escape, keyboard movement, pause, corrupt/quota recovery, standalone Games and layout. Mobile collection controls are asserted in viewport.74 bundled routes/286 asset references and nine selected first-batch source-integrity checks pass. Artifact13140978025 SHA25680b1d0c66d19b8ffe48647952e417a3830407424c5e15c3f1026a21abe2b4274 verified; corrected touch Survey bundle full-load screenshot inspected. Earlier passing CI41442140080 artifact13140241924 SHA256d79c2e002d715a4b6ce5eaef0d55bc839635b96648db85e9626b425ee91fdde1 verified; desktop Heavy recovery and touch Survey bundle screenshots inspected. Local supplemental engine replay accumulated all six badges across two expeditions with per-action decode; this is not a rendered six-badge accumulation test.

[Final passing workflow](https://github.com/ThatOneMop/study-desk/actions/runs/41442584001)

Six expeditions are18 rendered wreck completions, not new games. Automated rendered routes and screenshot inspection do not demonstrate human enjoyment or physical-device performance. The base mode remains deliberately easy. Three fixed wrecks and deterministic layouts limit long-term depth; no audio or playtime claim is made.

Full qualification still needs loaded-cargo rendered rescue, rendered old-save migration, six badges accumulated within one ongoing save, duplicate-bonus rejection, keyboard collection/breathing and actual bridge hidden-state/unrelated-save checks. Selection remains pending; no public game link is claimed.

## Counts and preservation

Exactly50 third-batch slots: **28 built,28 improved,27 fully browser-qualified,0 currently integrated,0 currently live;22 unbuilt**. Historical25 releases remain separately recorded. Second batch remains20/20 with its additional round complete and9 historical releases, currently0 active after PR110.

Main remained fa57730f70904ae5f15e47fe0c7e55dc28144c88 at the start of this work. Public catalogue and its existing navigation audit were not changed or recounted as new work. Prior sources/saves, Numberworks, Gummy Bay and requested-GitHub-games work were untouched. No automation settings changed. Catalogue expansion remains held by deliberate14-game curation, not a newly observed publishing failure. Continue independent development on the development branch.
