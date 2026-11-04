# Scree Rider baseline — 4 November 2026

Candidate84 is implemented and has passed baseline rendered checks. It is not improved, fully qualified, selected or released.

## Implemented loop
Scree Rider is an original turn-based mountain-bike descent. Lean accumulates sideways drift; speed changes how far bends push the rider outward. Gaps require momentum, roots require braking, and three condition points allow recovery from mistakes. The exact next-section forecast permits relaxed planning without a real-time timer. Three twelve-section trails save independent best simulated descent times. Restart preserves those records.

Original SVG bicycle/trail art, responsive buttons, keyboard activation, explicit restart confirmation, pause and safe storage handling are included. Malformed saves are preserved until explicit recovery; unavailable storage allows a temporary session.

[Source implementation](https://github.com/ThatOneMop/study-desk/commit/209ee061b91b2b9f65c14822bdd5fe8c95ac2983).

## Evidence
CI41835060669 at209ee061b91b2b9f65c14822bdd5fe8c95ac2983 passed four engine checks and six rendered clean descents at desktop1280×1000 and touch-emulated390×844. Exact per-action state,72 section reloads, records/restart, loss/retry, Space/Enter/Escape, pause, corrupt/quota storage, Games navigation and no overflow/page errors pass. Repository74 bundled routes/286 asset references, syntax/Freedoom and nine selected first-batch integrity checks pass. Artifact13325820545 SHA2561156fb8490663fc2dd87d1f7283734dfe2beb4d052eec55cd6c72aab24a82a30 downloaded/verified; desktop-trail-0.png, touch-trail-0.png and touch-complete-2.png opened and inspected.

[Passing workflow](https://github.com/ThatOneMop/study-desk/actions/runs/41835060669).

The route solver finds clean solutions using normal lean, pace and ride actions; browser tests execute those controls rather than inject completed states. Four engine checks cover clean routes and immutable actions, drift/forecast behavior, loss/retry and malformed saves. The six rendered descents are automated tests, not human enjoyment or long-duration evidence.

## Observed weakness and next improvement
The desktop and phone screenshots show readable controls, selected-button feedback, a clear forecast and no horizontal overflow. The instruction block is long on a phone. The illustration depicts line position but does not show the approaching roots or gaps. “Hold lean” preserves drift rather than centring the bike and deserves clearer wording.

More importantly, every trail's fastest clean route is47 simulated time units, and the three fixed routes offer limited replay choices. The substantive improvement should create meaningful alternate-line decisions with different momentum/lean tradeoffs, not merely add sections or tighten a timer. Then re-play the changed routes, inspect screenshots and complete full keyboard-only, embedded lifecycle and save-history qualification.

## Preservation and totals
Main remained 16b3b1658812a90c885fab83d3af419557d8b59b when re-read before this report. Current curated catalogue, concurrent Numberworks/Packworks/Gummy Bay work and existing saves are untouched. No Switch workspace control was added. No unchanged publishing failure was retried, and no automation was changed.

Batch3: **44/50 built,43/50 improved,43/50 fully browser-qualified,0 actively integrated/live;6 unbuilt slots85–90**. Exactly50 ledger slots remain. Baseline browser evidence for84 is recorded without counting full qualification. Historical releases remain separately recorded. Batch2 retains20/20 implemented, initially improved and additional-round verified; its nine historical selections are no longer active after catalogue curation.

The recursive development tree has no AGENTS.md or first-batch FINAL_REPORT.md; the historical20 finished/nine selected baseline is retained without inventing missing source. No new public game link exists for84. Final selection and reconciliation of the development release preflight with the current15-game curated catalogue remain outstanding; this is ongoing development, not task completion.
