# Beepline rendered improvement checkpoint

31 October 2026. Slot49; unlisted development candidate.

## Observed weakness and change

Played Clover square naturally using F/F/R and saw its three-command completion record. Changing the final turn to L replaced the successful program: the game retained only a count, so recovering the route required re-entry. Added a loop notebook with six independently saved slots (three gardens × normal/delivery). Players can keep a route, experiment, compare exact simulated outcomes and restore the original at step zero. Comparison is optional and does not grant progression. This supports route optimization without expanding the campaign with repeated levels.

## Evidence

- Rendered managed local preview using normal native controls, without state injection: F/F/R wins Clover square; F/F/L comparison reports hedge failure versus the kept successful loop. Restoring then running reaches the original win. Reload retains kept loop and completion.
- Normal win unlocks pollen delivery. F/F/L/G/L completes delivery with3/3 delivered and a five-command record. Delivery has its own kept loop; reload and switching back restores the normal F/F/R notebook. Screenshots of comparison and delivery notebook were inspected: text and controls readable at desktop width.
- Native Escape cancels a reset dialog, controls re-enable, and Space on the board advances exactly one step. Embedded Games handler now sends the existing Collection bridge event; actual catalogue navigation is pending.
- 22/22 focused node:test checks pass:12 engine+10 jsdom. Prior18 preserved, including complete normal/delivery routes, exhaustive bounded program results, saves, crash/loop/overload recovery, record isolation, reset/recovery and quota handling. Four new checks cover notebook slot/copy isolation, malformed notebook rejection, read-only comparison/restore/reload, and hidden-parent pending-reset/resume protection. JavaScript syntax checks pass.

## Assessment and remaining work

Useful route experimentation is now reversible across reloads and modes. Three short authored gardens remain the scope; Scout simplifies Hedge run, while delivery changes routing constraints. No human enjoyment, physical touch, content-hour or full repository build claim. Desktop evidence covers the first garden in both modes; remaining gardens and touch require rendered qualification. Test full campaign, failure/retry, notebook persistence across every slot, reset/corrupt-save recovery, focus/hidden bridge, mobile layout and actual catalogue launch/return before selection. Do not integrate prematurely.

Main was re-read unchanged at7599ac67644b7e041ab9083f0a64b68b3ce46fbf. That release already verified removal of Switch workspace controls and successful Pages publication; no unchanged deployment failure was retried. This checkpoint changes only Beepline source/tests/docs on the development branch. Batch3 totals remain24 built/8 fully improved/8 browser-qualified/8 integrated/8 live. Batch2 remains20 built,20 additional-round verified,9 selected/integrated/live.
