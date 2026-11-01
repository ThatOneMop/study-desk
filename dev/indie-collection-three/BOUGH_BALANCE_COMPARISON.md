# Bough Balance: hook comparisons

Implementation: 51a63b7d5c57f3f9ceb48901da90fc1970161bd2.

Rendered play exposed an onboarding weakness: placing C at H3 in Two little nests changed both Crown and West nest totals without explaining the contributing loads. Comparing hooks required repeated selection.

Players can now inspect each beam's direct bird loads and frame-inclusive child mass, then compare every hook before committing. Each option explains changed pull, restored or disturbed balance, swaps/displaced birds and full completion. Choosing a hook only selects it; Hang/swap still commits the existing save-safe action. Native dialog close restores controls, and embedded Games requests Collection.

## Verification

- 30 engine/DOM tests pass locally and in [CI 41355354337](https://github.com/ThatOneMop/study-desk/actions/runs/41355354337).
- CI validates 74 bundled routes and 286 HTML references, source syntax, Freedoom structure and nine first-batch selected routes' source hashes/links/credits.
- Rendered opening baseline win, upgraded second-mobile and deep-canopy wins/reloads, comparison selection, and native Escape were checked.
- A 390px iframe layout was inspected. The settled H6 screenshot showed Crown, Branch and both twigs becoming balanced and every hook filled. This is narrow-layout evidence, not touch emulation or human enjoyment evidence.

## Branch repair

Development catalogue references preceded several published assets. Commits 2bc911bc742ba9f7399313d714e7c47e8d17fbd7 and b67a19b09f90dc2ece25728ea54b7feebf7170e2 restore only missing routes/thumbnails and the shared favicon from observed main b2f449e1f7ac1f2ced54d4ad21b47ba7bc0f63d8. Existing candidate files and main were not overwritten. Earlier CI failures are superseded by the passing run above.

## Remaining qualification

Full rendered desktop/touch campaigns, four brass routes, recovery/reset/retry/navigation regression, then selection and actual catalogue integration. Bough Balance remains development-only.

Third batch: 24 built, 23 qualified/improved/browser-tested/integrated/live, exactly 50 slots; 26 unbuilt. Second batch: 20/20 additional improvements, nine selected/live. No new public release in this increment; automation cadence unchanged.
