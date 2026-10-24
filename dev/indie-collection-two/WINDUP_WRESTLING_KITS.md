# Windup Wrestling mechanical kits — implementation checkpoint

24 October 2026. Source commit: `dc5d51f2076f3029ccdd39890dcc3bfe63668a1c`. Development branch only; no new public route or live release.

The existing three short bouts offer little progression beyond improving turn counts. This is a source-based design hypothesis supported by earlier initial-pass records, not a newly observed rendered weakness. The browser initially could not reach the preview; after the preview service started, browser policy rejected page access. No workaround or alternative browser surface was used. Rendered play and visual assessment remain outstanding.

## Implemented choices

A first standard bell opens the workshop. Brass boots reduce spring capacity from three to two and increase slip cost from one to two, but absorb a full three-space grapple. The long coil stores four spring instead of three, but its brace only absorbs one space. The standard kit retains its original rules. Ram guards any adjacent spring of three or more, so the long coil cannot silently bypass his tell.

Changing kit requires confirmation and restarts the current bout. Each alternate kit has separate best-turn records; standard bells and rival unlocks remain intact. Older journals default to the standard kit and retain their rules version and outcome. Saves use the existing game-only key; unrelated saves are untouched.

## Evidence and limits

- 13 Windup engine tests pass, including six kit/rival winning routes, guard tradeoffs, expensive slips, four-spring capacity, exact save roundtrips, legacy outcomes and malformed kit rejection.
- 3 Windup DOM tests pass, including keyboard input, workshop unlock, cancelled/accepted kit changes, saved kit reload, costs, capacity and preserved standard records.
- Full local suite: 434 engine checks plus 293 DOM checks, all passing. These are automated reliability checks, not rendered gameplay or enjoyment evidence.
- Asset references, nine selected first-batch source hashes, twenty-slot ledger and 6/20 additional-round gates pass. No compile step for this static app.
- No new browser tests, screenshots, touch-layout inspection or live deployment verification. Commit deliberately skips CI browser execution following the access rejection. Existing prior Lighthouse CI 40088157129 was read-only checked and is now fully successful.

The additional round stays **6/20 verified**. This implementation is pending, not a seventh completed improvement. Initial batch-two baseline remains 20 built and initially improved/browser-tested. Third-batch ledger remains 0/50 built. No selection or integration in this increment. Main was observed at `432a0d75bd44e3c43975b8d11ae683fa0d7e2325` and left untouched.

## Next work

When permitted, play the baseline and kit version naturally, compare whether the tradeoffs create worthwhile decisions, and revise balance/onboarding. Verify progression, alternate-kit wins/losses, retry/undo, save/reload, reset, navigation and desktop/touch layout with inspected screenshots. Only then mark this additional pass verified. Continue the other thirteen pending upgrades and the separate fifty-game collection; do not pause as complete.
