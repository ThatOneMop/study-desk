# Cinderwatch baseline — 3 November 2026

[Implementation 3d99f503489a1a38b87cfcc1d54ae5fbf76922d0](https://github.com/ThatOneMop/study-desk/commit/3d99f503489a1a38b87cfcc1d54ae5fbf76922d0). New original candidate72, unlisted on the development branch. No improvement or full qualification credit yet.

## Playable loop

Each intervention happens before the wind spreads the fire front. Select brush to cut a fuel break, spend one of two water charges to douse fire, or refill while the fire advances. Burning tiles ignite their downwind neighbour and burn out after three turns; rocks, wet ground, ash and breaks block ignition. A burning cabin loses the clearing. Containment opens the next clearing and saves the best amount of brush left intact. Three different terrain/fire/wind arrangements are implemented, with retry and safe local saves.

Original engine/UI/SVG artwork, no imported game or assets. Source inspection distinguished Queen of Cinders' ant teams/colony resource management and Last Match's moving lantern combat from this direct wind-front containment loop. No source from those games was reused. Latest development tree has no AGENTS.md; existing vanilla engine/UI/shared-bridge/Actions conventions were followed. First-batch baseline and prior obligations remain recorded unchanged in the durable ledger.

## Evidence

CI41543119130 at 3d99f503489a1a38b87cfcc1d54ae5fbf76922d0 passed four engine checks and six rendered containment wins (three clearings each in desktop1280×1000 and touch-emulated390×844 Chromium). Exact per-action reload, earned clearing unlocks/forest records, unattended cabin loss/retry, native Space, Escape, pause, corrupt-save preservation/recovery, quota fallback, standalone Games navigation and no page errors/horizontal overflow pass.74 bundled routes/286 HTML references, source syntax/Freedoom structure and nine first-batch release integrity checks pass. Artifact13188210038 sha256:ecba39210e520576f142568ace30636e5e84828f396cdcf08da86faa9ec4d39f verified; touch-clearing-2.png and desktop-clearing-1.png inspected. Automated reliability and agent visual assessment, not human enjoyment or physical-device testing.

[Passing workflow](https://github.com/ThatOneMop/study-desk/actions/runs/41543119130). Four distinct engine tests are counted once although imported by the browser harness. An early engine check showed the first layout could survive with no intervention; fire positions and wind were revised before commit. The tested winning routes use3/5/4 interventions, respectively. They are successful routes, not claims of optimal forest preservation.

## Rendered assessment and next pass

Tested containment routes take only3/5/4 turns and never need refill. Three fixed clearings and forest records provide shallow progression. Wind direction is readable but next threatened tiles are not marked, and reload resets tile selection. On desktop, scrolling the board into view can put the wind forecast above the viewport. No animation/audio or sustained-enjoyment evidence.

The phone screenshot has recognizable cabins, trees, rock ridges, flames and wet-ground symbols, with a legible selected-tile readout and tools. The small fire-age numbers lack an adjacent legend until the tutorial is read. The desktop screenshot shows a clean board but the forecast has scrolled away. A real improvement should deepen decisions and preview consequences, not merely increase turn counts or add colour variants. Full parent-bridge/visibility, legacy save and keyboard ownership qualification follows that pass.

## Counts and preservation

Batch3:32/50 built,31 improved,31 fully browser-qualified;18 unbuilt. Exactly50 slots retained. Batch2 additional round20/20 unchanged. Active integrated/live0/0 under PR110's current14-game catalogue hold;25 historical third-batch and9 second-batch releases remain recorded.

Main re-read at fa57730f70904ae5f15e47fe0c7e55dc28144c88 remains unchanged, so the prior Switch workspace/navigation audit still applies. No new workspace controls, publication retry or live URL. First-batch integrity tests pass; Numberworks, Gummy Bay, requested-GitHub-games and existing saves were not edited. No automation changed or paused.
