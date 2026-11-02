# Concurrent catalogue curation — 2 November 2026

Main advanced to fa57730f70904ae5f15e47fe0c7e55dc28144c88 through merged [PR110](https://github.com/ThatOneMop/study-desk/pull/110), explicitly trimming Study Desk to14 games. The PR removed64 entries, sources, covers, credits and per-game workflows. Current tests enforce the exact14-game set. This was discovered before attempting Mycelium Yard promotion; no main files or refs were changed by this run.

Pages run41407777399 succeeded. The actual live catalogue at https://thatonemop.github.io/study-desk/#games displays14 included games; Mycelium search returns0. No Switch workspace control was visible. This is deliberate curation, not the old Pages permission/cache failure. No navigation change was made here.

## Concrete changes

Added a read-only release preflight. It rejects stale main leases, duplicate IDs, removal of concurrently kept games, and additions outside the observed current curation policy. Seven unit tests pass. The real14-game proposal plus Mycelium correctly exits2 with 'Outside current curated catalogue: mycelium-yard'. It does not mutate refs, catalogues or saves. Future release work must invoke it with fresh main evidence and retain the ref lease; it is not a GitHub server-side enforcement rule.

Reconciled the exactly50-slot third ledger:26 built,26 improved,26 browser-qualified, **0 currently integrated/live**, with25 historical integrations/live verifications preserved separately. Mycelium remains qualified but unlisted. Twenty-four slots remain unbuilt. No test-only change is counted as a new game or substantive improvement.

The second batch's20 initial passes and20/20 additional round remain completed on its development branch. Its nine selected releases are now historical, with0 active selected releases after PR110. Do not describe those historical releases as currently live. First-batch histories and retained development sources are not rewritten or removed by this run.

## Continuation

Continue independent candidate development on indie-collection-three-dev. Do not merge that old development catalogue over fresh main: it contains intentionally retired titles. Public additions conflict with the new exact14 catalogue and need a reconciled scope before promotion. No restored games, no publishing retries, no Numberworks/Gummy Bay edits and no automation changes.

This run makes no new gameplay, desktop/mobile gameplay-test or screenshot-inspection claim. Prior Mycelium qualification remains valid; its public release was not performed.
