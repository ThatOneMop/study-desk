# Hushwood — candidate 79 playable baseline

Run date: 4 November 2026 (Australia/Sydney; CI timestamp 3 November UTC).

## Implementation

Commit [8d60500](https://github.com/ThatOneMop/study-desk/commit/8d605004948e568c0fec4efcc0fee2c4f92e1f21) adds original turn-based stealth in `games/hushwood`, engine/browser tests and a dedicated verification workflow. Recover a seed lantern and return through two watched lanes. Hedges block walking and sight; each move, wait or pebble throw advances patrols. Two pebble lures redirect a nearby guard for two turns. Current and next-turn sightlines support deliberate play without a running timer.

The grove has one fixed map. New watches vary patrol starting timing; these are not separate campaigns or additional games. Each action saves under `study-desk-hushwood-v1`; best turn records survive retry. Corrupt storage remains untouched until explicit recovery; unavailable storage gives temporary-session feedback. Assets are original HTML/CSS shapes and system glyphs, with no third-party collection.

## Verification

[Successful Actions run 41718715703](https://github.com/ThatOneMop/study-desk/actions/runs/41718715703).

CI41718715703 at8d605004948e568c0fec4efcc0fee2c4f92e1f21 passed four distinct engine checks and six rendered recover-and-return watches: three patrol seeds each at desktop1280×1000 and touch-emulated390×844. Exact save/reload after every route action; lure expiry/reload, spotted/retry, records/restart, Space/Escape, pause, corrupt/quota storage, Games navigation and no page errors/horizontal overflow. Repository74 bundled routes/286 asset references, syntax/Freedoom structure and nine selected first-batch integrity checks pass. Artifact13270498657 sha256:1be0b65a0250040caa38b88ad8d26023d507521607d7961682c74ba1726dde18 verified; desktop-watch-0.png and touch-lure.png visually inspected. Baseline only; full keyboard/embedded qualification remains.

The engine tests appear twice in job logs because the browser route helper imports them; this report counts four distinct checks, not eight. Six rendered wins cover three seeds on each of two viewport/input configurations, not six distinct levels. The rendered routes use actual controls and exact saved-state comparisons after reload, not injected winning state. This is automated functional evidence, not a human enjoyment assessment.

Artifact archive was downloaded and verified against its reported SHA256. The desktop victory and phone lure screenshots were opened and inspected. The board, hedges, guard arrows and sightline outlines are readable with no horizontal clipping. Phone movement and lure actions require too much vertical travel. The desktop victory screenshot also exposes stale objective text above the board.

## Improvement priorities and release decision

The main gameplay weakness is that all three baseline winning routes use no pebbles. A substantial improvement should make distraction or another stealth choice consequential and demonstrate it in rendered play. Simply increasing the number of patrol seeds does not qualify. Inspect guard crossing/collision semantics and preserve legitimate v1 saves while strengthening validation. Bring actions nearer the board, fix the terminal objective status, then complete full keyboard and embedded-shell qualification.

Status: built baseline only. `improved=false` and `browserTested=false` retain the ledger's full qualification gate; baseline rendered evidence is recorded above. Hushwood is not selected, integrated or live.

## Batch and repository continuity

Third batch: exactly50 slots;39 built,38 substantively improved,38 fully browser-qualified,11 unbuilt. Active integrated/live counts remain0; historical release counts remain separately recorded. Second batch20/20 additional improvement completion is preserved.

Fresh main remains `fa57730f70904ae5f15e47fe0c7e55dc28144c88`; development head before this evidence commit is `8d605004948e568c0fec4efcc0fee2c4f92e1f21`. Main's exact14 curated catalogue remains protected by the recorded PR110 release gate. No catalogue, original collection, Gummy Bay, Numberworks, requested-GitHub-games or automation changes were made. The earlier Switch-workspace/publication audit was not replayed against unchanged main. No new live game URL is claimed.

Next increment: Hushwood's substantive improvement, then qualification/selection; slots80–90 remain unbuilt. The overall task is not complete and the schedule was not changed.
