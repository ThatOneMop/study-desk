# Bramble Pact — two-trick planning upgrade

2026-11-02

Implementation: 26dd706017a1a706266a044da5ed83e582f9ce46

## date

2026-11-02

## commit

26dd706017a1a706266a044da5ed83e582f9ce46

## observedWeakness

Played baseline first picnic opening Berry5 and previewed Berry6: current-trick forecast named the next leader but did not expose their led suit, legal replies or the next harvest. Longer planning required committing/undoing to discover those consequences.

## before

Only the immediate trick could be previewed; next-leader changes were text without playable follow-up comparison.

## after

Optional two-trick sketch enumerates legal next cards and available offer/invitation variants, shows all three follow-up plays and cumulative baskets, remaining needs, overflow and final promise outcome. Current play commits only the current action. Sketch changes never mutate the save; changing the first action invalidates the old follow-up. Native dialog close restores controls; embedded Games requests Collection.

## evidence

35 engine/DOM tests pass locally, retaining31 prior checks. Direct rendered first-picnic win and save/reload; compared Leaf3 loss to Wren versus Leaf6 win after Moss takes lead; verified chosen hypothetical Leaf6 was not committed when actually playing Leaf3 next. Native Escape returned enabled restart.390px iframe planner layout and card/offer selection inspected. Narrow iframe is layout evidence, not touch-emulation evidence.

## remaining

All three picnics and alternate offer/invitation paths on desktop and touch-emulated Chromium; loss/retry/reset/recovery and navigation rendered regression; inspect resulting screenshots; evaluate selection then catalogue tests. No full qualification credit yet.

## Verification and next steps

35 local tests and repository CI passed: https://github.com/ThatOneMop/study-desk/actions/runs/41340039197 . Existing dev catalogue assets and nine protected first-batch source hashes pass. Source save version and key unchanged. Source has no Switch workspace controls. Main remains4b29234b174535655c8ed03f424f162bdd03bf89, with the previously verified22 live third-batch games; no publishing retry was necessary. Managed preview stopped.

Full three-picnic desktop/touch campaigns and catalogue regression remain pending. The390px iframe screenshot is layout evidence, not actual touch testing. No human enjoyment or duration claim. Counts remain24 built,22 fully improved/browser-tested/integrated/live. Exactly50 slots preserved; second batch20/20 additional improvements and nine selected/live unchanged. Next finish Bramble Pact qualification, then Bough Balance64 and26 unbuilt candidates65–90. Schedule unchanged.
