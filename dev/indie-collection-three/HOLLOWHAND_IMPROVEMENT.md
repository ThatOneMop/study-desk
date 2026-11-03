# Hollowhand: substantive improvement

3 November 2026

Implementation: [efd4de587bb49195743ec11e961bf6277bac3b5e](https://github.com/ThatOneMop/study-desk/commit/efd4de587bb49195743ec11e961bf6277bac3b5e)

## Observed weakness and change

The rendered baseline used one repeating enemy attack cycle across four fights. Its tested reward route always added Moon cleave. Phone scrolling hid critical health and intent. This pass builds on the baseline report and does not count the earlier turn-record correction as an improvement.

Briar now alternates a thorn stance and exposed turns: every attack during the stance reflects two damage, consumed by guard first, even on a finishing blow. Lantern heals three when its attack reaches health; full guard prevents that recovery. Crown alternates exposed turns with a heavily armored strike. Guard timing and attack order therefore have game-specific consequences. Read the wind now adds two guard alongside its two-card draw, enabling a defensive cycling deck. Foe silhouettes differ and the phone combat-status panel remains visible while scrolling. Enemy-specific instructions are shown before actions.

## Verification

[Passing run41615710092](https://github.com/ThatOneMop/study-desk/actions/runs/41615710092)

CI41615710092 at efd4de587bb49195743ec11e961bf6277bac3b5e passed nine distinct engine checks and four rendered wins: Moon cleave (52 actions/13 turns/18 health) and Read the wind (98 actions/21 turns/18 health) in each desktop1280×1000 and touch-emulated390×844 Chromium context. Exact every-action save/reload, loss/retry, best retention, native Space/Escape, pause, corrupt/quota saves and standalone Games navigation pass. Engine checks cover guarded/lethal reflection, prevented Lantern healing and legacy turn migration. Repository syntax/Freedoom and nine first-batch integrity checks pass. Artifact13220722811 sha256:de5224c6c26e6ce45d9165cd008371e6255881fdae496a250e90e9c6ca8013c1 verified; touch-study-room-2.png and desktop-cleave-room-1.png inspected. Automated reliability and agent visual assessment, not human enjoyment or physical-device testing.

The screenshots show readable Briar rules and a distinct mask on desktop; the mobile Lantern screenshot retains health and feeding rules above the scrolled hand. The sticky panel uses vertical space and does not remove all scrolling.

## Saves and remaining work

Save key, deck, seed, health and progress schema remain unchanged; existing turn-record migration passes. Existing active encounters adopt the new enemy rules. No save is reset. Full embedded-shell tests, keyboard career and alternative mend/trim reward coverage remain qualification work. Draw-deck success proves viability only: its21 turns versus13 for cleave does not establish balanced rewards or sustained enjoyment. Four fixed encounters and six cards remain a small scope.

## Counts and preservation

Exactly50 batch3 slots:35 built,35 improved,34 fully qualified,15 unbuilt,0 active integrated and0 verified live. Historical integration evidence is retained separately. Batch2 additional improvements remain20/20. No public catalogue or deployment change.

Fresh main remains fa57730f70904ae5f15e47fe0c7e55dc28144c88; PR110 curation is preserved. Recursive development tree contains no AGENTS.md. Requested first-batch FINAL_REPORT.md is absent on this branch (404); historical baseline remains recorded in existing ledgers, with no first-batch edits. Only Hollowhand source/tests and batch3 documentation changed. Next: qualification and comparative selection; preserve concurrent work and the release gate.
