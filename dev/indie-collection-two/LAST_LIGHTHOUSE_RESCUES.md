# Last Lighthouse — lifeboat routing initial improvement

24 October 2026. Gameplay commit `54afb5d2a302575ae7cbf8e154e21e7cb31a62b5` on `indie-collection-two-dev`.

## Observed weakness and change

The initial rendered harbour ended with two spare power and had only a repeated convoy route. That left the battery budget largely irrelevant to clean play. This initial improvement gives each harbour an optional lifeboat receiver off the ordinary convoy path. Switch targets freely, arrange a different optical route, and spend two power to rescue the lifeboat before the final convoy delivery. Only finishing the convoy awards its permanent rescue pennant. A clean rescue run uses all six power; a missed signal makes the rescue compete with reserve power or a hull-costing crank. Players can abandon the optional rescue and shelter the convoy instead.

Existing convoy journals replay unchanged, old saves gain empty rescue records, and best-signal records remain. Rescue target, spent power and successful rescue are journaled for reload/undo. Reset only touches this game's key. Compact phone chart and sticky action controls reduce scrolling between route and signal; R toggles targets. Added same-origin bridge pause handling.

## Evidence

Seven focused engine checks pass: all six original deliveries, all three optional rescues, exact journal reload, rescue completion/pennant timing, old-save migration, malformed rescue records, natural loss/retry/undo, and the mistake/crank tradeoff. Preservation gates for first-batch source, assets and the exact twenty slots pass.

Rendered desktop: selected lifeboat, turned relays 1/2/3 to slash, signalled rescue, reloaded with four power and rescued status intact; reset relay 3 to straight, delivered northern convoy, redirected relays 1/5 to backslash, delivered southern convoy. Won with zero power and a pennant. Screenshot inspected: readable beam, status, controls and saved pennant.

CI https://github.com/ThatOneMop/study-desk/actions/runs/40088157129 is pending at this draft checkpoint. Native suite retains original campaigns/loss/retry/recovery/navigation and adds all three rescue routes, mid-rescue reload, pennants and desktop R input. Automated routes demonstrate reliability, not human enjoyment or physical-device certification.

## Scope and remaining work

This is Last Lighthouse's **initial** improvement, not its separate additional-round upgrade. Additional round remains 6/20. Third-batch fifty remain unbuilt. No public catalogue, shell, Gummy Bay, first-batch game or unrelated save changed. Main freshly observed at `7b356c8c4226e79848b038fc70e297808e506651`; preserve concurrent work at integration. Previous Lighthouse CI 40084157781 now fully passed all seven jobs.

Three authored harbours and one optional rescue per harbour remain compact. A distinct additional pass must address deeper replay/choices before final slate comparison. No measured playtime claim. Existing workspace/publication audit retained; unchanged hosting failures were not retried.

CI checks job 120855203132 passed **720 checks** (428 engine, 292 DOM) plus preservation gates.

Rendered mistake route also verified: missed initial signal, rescued lifeboat, delivered first convoy ship, observed zero power/disabled Signal; cranked to three power at cost of one hull, redirected final beam and finished with one power and one hull. Existing best three-signal record and pennant stayed intact.

## Initial completion verified

Native Chrome job 120855438529 passed desktop and emulated-touch original six-ship campaigns plus all three optional lifeboat rescues, pennants, rescue reload, loss/undo/retry, pause, cancellation, isolated reset/recovery and navigation. 34 screenshots in artifact 12557089508 (ZIP SHA256 `3380bef8f163730485a47bc32d70df54b22c7dc0d6a1ca6381715a76d2627f54`). Inspected touch-rescue-preview-2 and desktop-rescue-won-2: beam/receiver and controls readable; phone chart and signal controls fit more closely together without horizontal clipping. Broader groups still in progress at checkpoint.

Totals: **20/20 implemented, initially improved, browser-tested and finished compact candidates; 6/20 separate additional upgrades; zero final selections**. Thirteen earlier second-batch source integrations remain concurrent work; this pass integrates none and verifies no live release. Third batch stays 0/50 across all counts. The broader task is incomplete and stays active.
