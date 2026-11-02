# Switchyard Post qualification — 2 November 2026

Candidate67 is fully browser-qualified and retained as a **reserve**, not a public release. This run adds verification and assessment, not a new game or another substantive improvement pass.

## Evidence

CI41425222829 passed on27d5a18042f6e406f10337eeb9aa69739ed96831: eight engine tests, twelve desktop/touch standard/fragile delivery wins with per-action reload, two keyboard completions, plus real repository bridge tests on desktop1280x1000 and390x844 touch-emulated Chromium. Parent-hidden restart/recovery cannot commit, resume restores keyboard play, native Enter confirms, repeated/modified/composing board input is ignored, self messages cannot impersonate parent, simulated document-hidden actions do not mutate saves, unrelated saves persist, and Games emits Collection without navigating the parent.74 bundled routes/286 references and nine selected first-batch integrity checks pass. Artifact13132415197 SHA2565aa2826fa2d1334c9e92da6d6d2197993a1e32189d16fd6aabc3bd5414b4e337 verified; touch and desktop resumed-shell screenshots inspected. This is automated rendered verification, not human enjoyment or physical-device evidence.

[Passing workflow](https://github.com/ThatOneMop/study-desk/actions/runs/41425222829) · [Test implementation](https://github.com/ThatOneMop/study-desk/commit/27d5a18042f6e406f10337eeb9aa69739ed96831)

The test fixture loads the real game and real repository bridge inside a same-origin iframe. Parent visibility messages use the real parent source/origin. Document visibility is explicitly simulated. Existing standard/fragile campaigns also cover progression, saves/reload, restart, badges, old-save migration and storage failures. These tests do not substitute for an eventual real-catalogue integration check.

## Comparative assessment

- Enjoyment potential: deliberate run-around planning, reversible mistakes and optional fragile handling fit relaxed play. No human enjoyment study was performed.
- Depth: three compact authored yards; the first two fragile routes differ, but the third repeats an optimal standard route. This is weaker long-term progression than Mycelium Yard's buyer timing, reinvestment and freshness choices.
- Polish: original readable railway graphics, visible phone coupling rules and keyboard focus; no audio or physical-device testing.
- Reliability: core routes, migration, recovery, undo, embedded visibility and input guards pass. Both resumed-shell screenshots were inspected.
- Variety: push-versus-pull shunting is distinct, but the broader slate already has many compact planning puzzles. Keep this as reserve rather than automatically selecting every qualified candidate.

## Counts and preservation

Third batch: **27/50 built,27/50 improved,27/50 fully browser-qualified,0 currently integrated,0 currently live**. Exactly50 ledger slots are retained;23 remain unbuilt. Historical25 releases remain recorded separately. Second batch remains20/20 implemented and additionally improved, with9 historical releases and0 currently active after PR110.

Fresh main is unchanged at fa57730f70904ae5f15e47fe0c7e55dc28144c88. Its current14-game curation, earlier sources/saves, Numberworks and other concurrent work were preserved. No new public link or deployment is claimed; no unchanged publication failure was retried. No automation settings changed. No AGENTS.md or requested first-batch FINAL_REPORT.md was present in the current development tree; preserved ledger history and prior recorded baseline were used without inventing a fresh report read.

Next implement candidate68 and remaining slots, with actual rendered baseline and improvement passes. Public expansion still requires reconciliation with current14-game curation; keep independently qualified work durable on development branches.
