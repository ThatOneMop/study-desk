# Stencil Studio — selective ink lift

2026-10-27 · Implementation `08600a642bbc4bba782731e5ddc9634d2ea51fc8`.

Source inspection found that reaching an earlier mistake required undoing later layers. Lift selected ink now removes only that channel through the positioned/rotated stencil. Other ink channels, cells outside the stencil and subsequent layers are preserved. Lifts share the existing five-operation allowance; empty lifts reject without consuming a turn. Exact previews show remaining differences and extra ink, and Undo restores removed ink. Original five-number print journals and saved setup remain unchanged; lift journals append -1. The mode is deliberately session-only and resets to printing on reload. Records retain their old values, now described as operations to include lifts.

The global Space handler also intercepted native button activation. Space on buttons/links/summary now stays native; page Space still prints or lifts, and input fields retain their original ownership. This is covered by a simulated ownership test, not a native-browser assertion.

20 tests pass (12 engine, 8 jsdom 26.1.0), retaining the initial 15. New evidence includes selective-channel removal through mixed ink, preserving a later valid layer, read-only forecast parity, a corrected five-operation win, empty-lift and invalid-journal rejection, allowance consumption, exact undo, records, UI preview/commit/reload, pause/guide guards and native button Space ownership. Original three-commission recipes, legacy saves/setup, loss/retry and corruption recovery continue passing. Both scripts pass syntax checks. A local copy-edit command initially used the wrong working-directory-relative path; it made no change and was corrected before the final passing suite.

No rendered browser, screenshot inspection, native touch/mobile verification, full repository build or live release. Source-led refinement only, with no completed improvement credit. Next naturally play the new mode on desktop/mobile, inspect the extra checkbox and preview distinction, assess whether the repair allowance creates satisfying choices, implement the required rendered-led improvement and verify saves/reload, loss/undo/retry and Games navigation before selection.

Starting third head `f917ffd96d1fbda208c624f663d7a81f6a7c51e5`; main observed `83fde46e12260e3a81785cee84fa75808399ff86`. New main delta contains Gummy Bay, existing-game and quality-document changes, with no added Switch workspace matches. Shared launcher/catalogue untouched. No AGENTS.md in the third tree. First final report re-read: twenty finished/improved, nine source-selected, zero verified live. Existing rendering security-policy and publication blockers were not bypassed or retried unchanged.

Exactly fifty third slots remain: 15 built prototypes, 0 improved/browser-tested/integrated/live. Second additional round remains 6/20 verified, 14 pending. Independent implementation remains possible; do not pause as complete.
