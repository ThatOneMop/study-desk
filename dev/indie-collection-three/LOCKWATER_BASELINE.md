# Lockwater baseline — 3 November 2026

Slot70 is a new original canal-lock delivery game. It is implemented only on the development branch, not in the public catalogue. Two independently controlled chambers, a raised middle sill, limited water and a return trip create a distinct hydraulic-operation loop. This is not Pocket Regatta's wind/helm sailing or Clockwork Tide's gear-ratio mill; no third-party collection or art was imported. All source and vector illustration are original.

Implementation: [25808b06547b8220bba26f7ffad67fba83fc6ada](https://github.com/ThatOneMop/study-desk/commit/25808b06547b8220bba26f7ffad67fba83fc6ada). Tutorial correction: [7c96a4eb8918b8b19c15ab647013ba93300f1344](https://github.com/ThatOneMop/study-desk/commit/7c96a4eb8918b8b19c15ab647013ba93300f1344) clarifies entering empty chamber A before filling it. Vanilla HTML/CSS/JS follows existing engine/UI/save/bridge conventions; no build compilation is required. No AGENTS.md was present in the fetched development tree.

## Verified baseline

Five engine checks and six desktop1280×1000/touch-emulated390×844 rendered delivery-and-return wins passed. Each action saves/reloads exactly; earned job unlocks, water/turn records, waste-to-loss/retry, native Escape, keyboard sailing, pause, corrupt-save preservation/recovery, quota fallback, standalone Games navigation and no horizontal overflow/page errors pass. CI41488293744 at 7c96a4eb8918b8b19c15ab647013ba93300f1344 succeeded, including74 bundled routes/286 asset references, source syntax and nine first-batch release integrity checks. Initial baseline CI41488135821 also passed. Artifact13161879102 sha256:c3bd9df5a2ba599c2c9bd085a2d9bb8979b842de40c89ab88ce35153888af76e was verified; desktop-job-2 and touch-job-1 screenshots from the initial baseline were inspected. The final follow-up only corrects tutorial entry order; no claim of final-artifact screenshot inspection. Routes use3/5/4 water in11/14/13 turns; not claimed optimal for water or human enjoyment.

[Final passing workflow](https://github.com/ThatOneMop/study-desk/actions/runs/41488293744). Browser routes operate actual rendered controls; only corrupt-storage testing deliberately injects invalid save text. Automated reliability and agent screenshot assessment are not human enjoyment evidence.

## Observations and next improvement

- All three tested routes use fill/drain alone. Transfers are available but lack a compelling reason to use them. Deepen conserved-water decisions rather than adding repeated deliveries or arbitrary action counts.
- Desktop art clearly shows the boat floating at chamber level and the sill. Phone illustration labels are too small despite the large buttons and absence of horizontal overflow. Add readable water/gate readouts and better layout.
- Reload returns the starting hint even with a boat at the hill. Guide the current delivery stage and blocked-gate reason.
- Job selection needs confirmation before discarding an active delivery. The simple water-loss threshold cannot recognize every stranded state; add a reliable recovery or diagnosis.
- Records persist, but three small deterministic jobs are only a baseline, not substantial long-term progression. Full parent-bridge, save-isolation and keyboard qualification remains.

## Counts and preservation

Third batch30/50 built,29/50 improved,29/50 fully qualified. Exactly50 candidate slots remain;20 are unbuilt. No improvement credit is given for the tutorial correction or baseline tests. Current integrated/live totals remain0/0;25 historical releases remain recorded. Second batch's20/20 additional round and nine historical releases remain intact.

Main is unchanged at fa57730f70904ae5f15e47fe0c7e55dc28144c88. Its exact14-game curation remains the release hold; no publishing retry or live-release claim was made. Prior navigation audit remains applicable to that unchanged main. First-batch integrity checks passed. Numberworks, Gummy Bay and requested-GitHub-games work were not edited. No automation changed or paused.
