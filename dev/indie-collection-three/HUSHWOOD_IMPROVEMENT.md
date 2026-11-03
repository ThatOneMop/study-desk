# Hushwood79 — substantive improvement

4 November 2026. Implementation: [e9ca101fcfcc060ba8567e9e2486b13658144819](https://github.com/ThatOneMop/study-desk/commit/e9ca101fcfcc060ba8567e9e2486b13658144819).

The baseline rendered routes left both pebbles unused. Carrying the lantern now exposes adjacent squares around guards, in addition to their normal three-square forward sight. A distracted guard ignores the glow and looks only toward the pebble for two turns. Tested shortest routes use lures and save six turns on each of watches1–3 compared with the no-lure alternative. Slower no-lure routes remain possible; spending pebbles early does not inherently force a restart. Persistent glow-return seals mark completion under these rules. This changes the return-trip decisions, not merely the number of patrol seeds.

Old saves retain rules1 during their current watch; retry starts rules2. Historical records remain, so older and newer turn records are not directly comparable. Seals distinguish new-rule completion. The save key is unchanged. Phone controls now fit with the board and lure row in the390×844 viewport; onboarding remains available in the expandable Into the grove section. Victory status is corrected.

## Evidence

[Passing workflow](https://github.com/ThatOneMop/study-desk/actions/runs/41727870594).

CI41727870594 at e9ca101fcfcc060ba8567e9e2486b13658144819 passed six distinct engine checks and six rendered wins across desktop1280×1000 and touch-emulated390×844, with per-action exact reload, return-trip lure use, seals, caught/retry, restart, Space/Escape, pause, corrupt/quota storage, Games navigation and no horizontal overflow/page errors. Engine search proves lure routes six turns shorter than no-lure routes for each of seeds0–2. Legacy rules migration preserves records. Repository74 bundled routes/286 asset references and nine selected first-batch integrity checks pass. Artifact13275587739 SHA256123711e1ece626a3abb97155594d9c15b85a05e16353f4293ccbb89298318c9d verified; touch-return-lure.png and desktop-watch-0.png inspected.

Six distinct engine checks are counted once despite their import by the browser helper. Browser routes use buttons/touch and normal progression, with reload after each action. Screenshots were opened and visually inspected after archive hash verification. Phone return-lure image shows legible guards/sightlines and movement plus lure controls together; desktop victory shows the corrected objective and saved seal. Automated evidence is not a claim of human enjoyment or measured content duration.

## Remaining work and counts

Full keyboard/embedded qualification, broader patrol-seed solvability, guard crossing semantics and stronger save invariants remain. One fixed grove still constrains replay depth. Hushwood is not selected or published.

Batch3 retains exactly50 slots:39 built,39 improved,38 browser-qualified,11 unbuilt,0 currently integrated/live. Historical releases remain separately recorded. Batch2 additional round remains20/20. Main remains fa57730f70904ae5f15e47fe0c7e55dc28144c88; current exact14 curation and PR110 release gate are preserved. No repeated publication/Switch-workspace audit against unchanged main, no other game changes and no automation changes. The first-batch report and AGENTS.md remain absent from the current recursive development tree; historical first-batch evidence was preserved rather than fabricated.
