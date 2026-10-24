# Windup Wrestling — initial playable and rival improvement

24 October 2026. Slot 39, a new original second-batch candidate. Source: `games/windup-wrestling/`. Serve the repository root and open `/games/windup-wrestling/`. No public catalogue entry or live release is claimed.

## Implemented loop

Read the rival's next action, manage up to three stored springs, and manoeuvre in a seven-space toy ring. A shove spends all spring; a brace absorbs two push spaces; a slip spends one spring to redirect an adjacent grapple using the rival's own momentum. Six large buttons and keys 1–6 work without a clock. Three sequential rivals unlock, with best-turn bells, undo, retry, confirmations, pause and isolated save recovery. All graphics are original CSS toy art.

Initial playable commit: `ff5b3c500bb3646d3f7838a66e062da603004719`.

## Observed weakness and initial improvement

The rendered introductory bout won in three moves. Engine route exploration found that the same step/wind/shove route also beat the other two rivals. Their different names and cycles did not produce sufficiently different decisions.

Commit `562848a8e8218cb32c45213a0d071c01eaf5eb71` makes Ram brace reactively against an adjacent fully wound player and gives Velvet an early two-spring grapple. The observed winning routes now differ: a three-move introductory shove, a seven-move bait/reversal against Ram and a four-move brace/wind/shove against Velvet. These are reachability examples, not universal optimality claims. Scouting text explains the mechanical differences.

Saved journals carry their rules revision. Older in-progress bouts retain their original rival behaviour until explicit retry/new bout; bells remain. No unrelated save keys are modified. This is the initial improvement only; the user's additional round remains pending for this candidate.

## Verification

Eight engine and two DOM checks pass, covering progression, natural loss, undo/retry, brace, reversal, locks, invalid actions, legacy rules, keyboard, reload, confirmation cancellation, pause and isolated reset/recovery. Full local and CI regression: **421 engine + 292 DOM = 713 passing checks**, plus asset, first-batch source-integrity and exact-slot gates.

CI: https://github.com/ThatOneMop/study-desk/actions/runs/40080637524

Cloud rendered play reached the initial win and reload, Ram's seven-move reversal, and Velvet's approach/brace/wind. Ram's completed desktop screenshot was inspected: ring, striped edges, action controls and records are readable. The cloud browser rejected the final click/reload request under its URL policy. No alternative browser route was used to bypass that rejection. The independently running native Chrome regression supplies desktop and touch-emulation coverage; its results are recorded below once complete.

## Assessment and remaining work

This is a compact three-bout game. The reactive guard and reversal improve choices, but depth and replay progression remain limited. It is not selected. A separate substantial upgrade must deepen useful choices before final comparison. Automated routes and agent walkthroughs are not human enjoyment evidence, physical-device certification or measured hours of content.

No first-batch source, save key, catalogue entry, Gummy Bay or public shell was edited. Main was reread at `18b81b1d0a3c73a04268c84ba734b12ffd9bf37a`: 64 catalogue entries, including thirteen earlier second-batch entries from concurrent work. These are not the final selections from the additional round. The third branch remains at `a7d79358057c01cf5889e804a308c4d6168c83de`, with 50 planned slots and zero built/improved/tested/integrated/live. The existing workspace/publication audit stands; no unchanged publishing failure was retried.

## Native verification result

Job 120833480441 succeeded. Desktop (1280×1000) and emulated touch (390×844) each completed all three rival wins, including Ram reversal and Velvet brace, exact mid-bout and won save reloads, natural ring-out loss/undo/retry, pause, modal cancellation, isolated reset/recovery and Games navigation. No page errors or horizontal overflow were observed. Other browser groups were still running when this checkpoint was recorded.

Ten Windup screenshots retained in [artifact 12555156061](https://github.com/ThatOneMop/study-desk/actions/runs/40080637524/artifacts/12555156061). ZIP SHA256: `1c317747154e2b800f59f7af6a3e1ac3b3a7e6aa04c286509c9f91fdc07ce3fe`. Inspected desktop Ram reversal, touch final win and touch guide: readable ring/controls/records, fitting guide dialog and no horizontal clipping. Touch uses emulation, not a physical device.

Current totals: **19/20 initial candidates built, improved and browser-tested; 6/20 additional upgrades; zero final selections; thirteen prior concurrent source integrations; zero verified live in this ledger.** This increment integrates or publishes no games. Third-batch totals remain 0/50 across built/improved/tested/integrated/live. Last Lighthouse, fourteen additional upgrades, final comparison/integration and the third collection remain outstanding.
