# Visibility repair: Rill & Root, Fallow Table and Bellwether

2026-10-28. Implementation [b4b67145f615b1452c60e9673fdebe6c30c9b35a](https://github.com/ThatOneMop/study-desk/commit/b4b67145f615b1452c60e9673fdebe6c30c9b35a).

## Findings and changes

Extended the preceding three-shell audit to these three candidates. The new test suite first reproduced 12 failures out of 15 cases: pending reset and unreadable-save recovery could commit after a trusted parent hide; Resume could permit click-based actions while still hidden; keyboard shortcuts acted during composition or inside editable text. The three forged-message/manual-pause checks already passed. These are DOM-simulated findings, not observations of native-browser event timing.

Added separate parent-hidden tracking alongside document.hidden, with either independently blocking actions, Resume and confirmation. Confirm is disabled and its handler guarded while hidden or paused. Returning visibility leaves the game paused; the pending dialog can be cancelled, then the player can resume and reopen the action deliberately. Visibility messages require the trusted parent, same origin and a boolean flag. Keyboard handlers exclude composition and editable content.

Bellwether additionally guards hidden entry and its confirmation-opening path. Its existing asynchronous advice invalidation is preserved: a new sixteenth test resolves an advice promise after parent hide and verifies it cannot stage a stale move or change the save, even after returning and resuming.

No game engine, journal format, save key, shared bridge, catalogue, first/second collection or concurrent main/Gummy Bay source changed. Existing DOM harnesses explicitly model visible documents with jsdom pretendToBeVisual; this is a visibility setting, not rendering.

## Verification

125 passing checks in total: 109 pre-existing engine/DOM/bridge checks and 16 new checks. The combined game/regression invocation passed 124 checks; after adding the dedicated stale-advice case, the targeted suite passed all 16. Production scripts parse. Existing complete routes, optional mechanics, saves, progression, loss/retry where applicable and adviser tests remain intact.

Tests: tests/collection-three-visibility-two.cjs plus the rill-root engine/dom/bridge, fallow-table engine/dom and bellwether engine/dom suites. jsdom 26.1.0 installed through npm in /tmp/visibility-round2; tests load actual bridge source with a simulated parent and stub dialogs. No native UI timing, rendered navigation, screenshot, real touch or human enjoyment claims.

Latest branch state, third ledger/tree and first-batch FINAL_REPORT were read before edits; the current tree contains no AGENTS.md. Static source conventions unchanged. Partial recovery means no full-repository build/regression claim. Existing publishing and browser policy blockers were not retried or bypassed. No source commit is treated as a live release.

Third ledger remains exactly 50 slots, **23 built / 0 qualified improved / 0 browser-tested / 0 integrated / 0 live**. Second additional round remains **6/20 verified, 14 pending**. These reliability repairs do not qualify as substantive rendered gameplay improvement passes. Supported rendered desktop/touch and native-dialog verification remain necessary before selection. Continue the remaining 27 distinct games and outstanding playtest-led improvements; keep unfinished games unlisted.
