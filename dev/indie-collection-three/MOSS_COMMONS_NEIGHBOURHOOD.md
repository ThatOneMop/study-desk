# Moss Commons neighbourhood challenge — 27 October 2026

Implementation: `7ece0fd8f1f72624146bc8e0dfbfd52e68e286b8` on `indie-collection-three-dev`.

## Change and reason
Standard Moss Commons pools food and water across the settlement. Housing location had little service consequence. The optional neighbourhood challenge requires each house to share an edge with a well and a food plot, in addition to meeting population-wide capacity. Gardens and orchards supply local food access; one provider may serve several homes. Diagonals and paths do not relay local service. Orchard meadow requirements and garden irrigation still determine capacity.

Standard completion unlocks the challenge per site. No extra timber or budget changes. All three challenge fixtures finish, with 2/0/0 timber left; these are feasible routes, not proven optimums. One route uses a connecting path. Relocation can improve local access while reducing irrigation, creating a genuine trade-off. Preview text and house labels expose missing services before committing.

Mode changes confirm restarting the layout. Retry retains mode; site navigation returns to standard mode. The v1 key and legacy save shape are unchanged. Optional mode and separate challenge records are introduced only for challenge users. Existing records and other games' storage are preserved.

## Verification
- 29 tests pass: 18 engine and 11 jsdom 26.1.0, retaining all 19 earlier checks.
- Standard-to-challenge campaigns on all sites, per-placement save/reload, independent records, terminal completion, local edge/shared service behavior and global capacity.
- Read-only relocation preview, undo, retry, loss, mode unlock, confirmation/cancel, pause and malformed-save recovery/reset isolation.
- Both scripts pass syntax checks; referenced JS/CSS resolve locally; Games navigation remains.
- A JSON serialization-order assertion was corrected to structural save equality. No gameplay failure was masked.
- Partial local checkout: no full repository build claimed. No rendering, native-input/touch verification, screenshots or human enjoyment evidence.

## Repository and blockers
First-batch FINAL_REPORT was re-read: 20 finished/improved, nine selected in source, zero verified live. Second branch remains `3949e3d9f8e2e9846dc4c91c436d90b19bbbd341`: 20 implemented/initially improved, 20 additional source upgrades, six additional rendered verifications and fourteen pending.

Main was re-read at `5250882e835cba4cb10e9c826a91691ed0a43886`. Changes since the previous observation are scoped to Gummy Bay and credits; no launcher or workspace-switch control was added. Existing cleanup, catalogue and concurrent work are preserved. No new desktop/mobile navigation test is claimed.

The recorded local-rendering security-policy rejection was not bypassed or retried. Publishing remains unverified; the existing owner action is Settings → Pages → Source: GitHub Actions, followed by rerunning deployment and verifying routes. The separate hosted-site sign-in wall requires the owner's session. Do not clear save storage. No new publishing diagnosis or live release is claimed.

## Counts and next steps
Third batch retains exactly 50 slots: 17 prototypes built; zero qualified improvements/browser-tested/integrated/live; 33 unassigned slots. This is a refinement of slot 52, not a new game. No public entry added. Source-level refinement is pending and does not count toward the required rendered improvement pass.

Next: naturally play the neighbourhood mode on desktop and touch, inspect dense labels and missing-service forecasts, assess the tight budgets and service trade-offs, improve from observed play, and verify navigation/reload/retry before selection. Continue independent implementation while rendering is blocked. Keep the task active because substantial authorized work remains.
