# Ambercut — candidate76 baseline

3 November 2026

Implementation: [f8deb1f9c42b489a39aae263fef8766e7f3509c6](https://github.com/ThatOneMop/study-desk/commit/f8deb1f9c42b489a39aae263fef8766e7f3509c6)

## Implemented loop

Original excavation rules in games/ambercut: cross-shaped chisel cuts remove a layer from up to five cells, while brushes remove one layer safely. Thin fossil traces require care because a chisel's adjacent cuts can fracture them. Lift all fossil cells before three fractures or50 kit strokes. Three trays maintain separate preservation scores; reset preserves records, next cycles trays, and every action saves. Keyboard uses native Tab/Space and touch uses tool-then-cell taps. Hover/focus previews a cut footprint. No clock runs.

The spatial collateral-cutting loop differs from Grainwright's linear directional planing and Soundings' distance deduction. Shared confirmation/storage shell conventions are retained, with a separate study-desk-ambercut-v1 save key. Visuals use code-native CSS and text glyphs; no external asset collection was imported.

## Verification

[Passing run41632282501](https://github.com/ThatOneMop/study-desk/actions/runs/41632282501)

CI41632282501 at f8deb1f9c42b489a39aae263fef8766e7f3509c6 passed four engine checks and six rendered tray wins: all three trays in desktop1280×1000 and touch-emulated390×844 Chromium. Safe visible-depth routes used32,37 and30 strokes with zero fractures; every action survived exact reload. Fracture loss/retry, records across next/reset, native Space/Escape, pause, corrupt-save preservation/recovery, quota fallback and standalone Games navigation passed without page errors or horizontal overflow. Repository syntax/Freedoom structure and nine first-batch integrity checks pass. Artifact13229335589 sha256:9eee4f433629f49e5e705bafa97a2d4e63645a67c808040e46b377c23cf4979d verified; touch-site-1.png and desktop-site-0.png inspected. Automated reliability and agent visual assessment, not physical-device testing or human enjoyment evidence.

The route chooses chisel centers using visible layer depths, then brushes in grid order until completion; it does not consult hidden fossil coordinates to select actions. It is deliberately simple and exposes the baseline's shallow strategy. It clears more rubble than necessary, so saved records still admit optimization.

## Visual review and improvement priorities

The phone screenshot retains tools, counters, tray and completion action without horizontal overflow. Tile labels are small but legible. The desktop tray occupies much of the viewport. Repeated leaf-like glyphs do not yet create convincing shell, wing or fern specimens. A single safe strategy wins all three trays comfortably, leaving limited reason to reconsider tools.

Next: a substantive upgrade to excavation choices and specimen presentation, not additional repetitive trays. Full keyboard career, actual embedded bridge, kit-exhaustion browser coverage and further save-edge qualification remain pending. This candidate is not selected or public; no improvement-pass credit yet. Tests establish reliability, not long-term fun or substantial playtime.

## Preservation and counts

Exactly50 third-batch slots:36 built,35 improved,35 fully qualified,14 unbuilt (77–90),0 active integrated,0 verified live. Baseline browser evidence does not set browserTested=true until full qualification. Batch2 additional improvements remain20/20; historical releases stay separately recorded.

Fresh main remains fa57730f70904ae5f15e47fe0c7e55dc28144c88; current14-game curation and the release gate are unchanged. No publishing retry, public entry or automation edit. Recursive development tree has no AGENTS.md or first-batch FINAL_REPORT.md; previously recorded historical baseline is preserved. New files are confined to Ambercut source/tests/workflow and this batch's ledger/report, with an expected-head branch update to preserve concurrent work.
