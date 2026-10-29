# Hollow Keeper — safe marching and resin intervention

29 October 2026. Source `be33501dc31ceec3ed3c251ee935ec0dadef5761`. Additional round remains **19/20 verified**, pending native verification.

## Observed weakness

Inspected touch-hollow-5-mid.png from native run 40798076659/artifact 12865476513: a readable scout report predicts 2/3 hearts, but gives no timing for intervention. Single-step marching or continuous auto march requires watching every step to catch depletion. This is agent screenshot/source assessment of rendered native gameplay, not human enjoyment evidence.

## Concrete change

Regrow spends two resin to restore up to two strikes, capped at three, then advances the attack immediately. It competes with fruit and later upgrades. Exact previews/scout reports include the advancing step. Tool 6 supports staged confirmation and saved replay. Safe marching now simulates ordinary steps and stops before the next nursery hit or thorn-bed exhaustion, naming the bed's row and column. It preserves every tick in the journal for single-step undo. The player can accept the warned step manually or choose regrowth/fruit. Safe marching is disabled while a tool preview is staged; auto march remains optional.

The preview simulation is pure. Applying safe march journals normal tick actions and never introduces a new save schema. It stops at wave boundaries. A final thorn strike that also ends a wave safely is allowed because beds refill between waves. It does not recommend optimal fruit placement or spend resin automatically.

## Evidence and boundary

29 October: 52 focused engine/DOM checks pass (29 engine + 23 DOM), including pure warning boundaries, no input mutation, ordinary replay/undo, reload, preview guard and original five full campaigns. Native browser suite expanded with earned regrowth victory, safe-march warning, preview/cancel/apply/reload and desktop/touch screenshots; final native evidence pending.

The existing regrowth pass is `2d97ff8c7a23d109fd2f34d0d2580be5d5d4c709`; this refinement does not replay or count an earlier pass. Baseline screenshot was inspected; final changed-source screenshots remain pending. Automated native routes are reliability evidence, not human enjoyment or physical-device testing.

No new public integration or live release. First batch, main (55c330d9ec493afc40e81e89a371f64cbd5bd8b0), Gummy Bay, existing saves and third-batch work preserved. The resolved Pages/workspace-control audit is unchanged; it was not retried as new work. Third batch remains 24/50 built and zero qualified improved/browser-tested/integrated/live.

Exact-source native CI: [40810194303](https://github.com/ThatOneMop/study-desk/actions/runs/40810194303), in progress at this checkpoint.
