# Brasswake — candidate69 playable baseline

3 November 2026. Development source only; not selected or publicly released.

## Core loop

Every action advances bolts by one tile. Walking recharges a two-charge shield. Guarding redirects arriving hostile bolts into a chosen direction; friendly bolts damage sentries. Read next-landing outlines, manage three hearts and clear three authored courts. Best turn counts and earned unlocks persist through restart/reload. Keyboard arrows move, I/J/K/L guard, Space waits; touch supports adjacent-cell movement and a fixed action panel. Original vector shield/sentry art is code-authored.

This is a projectile-redirection combat loop, not a reskin of Reedbreaker's enemy pushing or Bramble Dice's dice allocation. It is intentionally a first playable implementation, not a claim of finished depth.

[Source](https://github.com/ThatOneMop/study-desk/commit/8381669deae25dff6800a4904177df120fc5484c) · [Harness correction](https://github.com/ThatOneMop/study-desk/commit/0ad297d330c8816d263fc33fb7c47c18c3ec1ef1) · [Passing workflow](https://github.com/ThatOneMop/study-desk/actions/runs/41463234816)

## Evidence

CI41463234816 passed at0ad297d330c8816d263fc33fb7c47c18c3ec1ef1: four engine tests and six rendered court wins across1280x1000 desktop and390x844 touch-emulated Chromium, with per-action reload, earned court unlocks, best-turn persistence, natural waiting-to-loss, restart, native Escape, keyboard wait/guard, pause, corrupt/quota recovery, standalone Games navigation and no horizontal overflow/page errors.74 bundled routes/286 HTML asset references and nine selected first-batch integrity checks pass. Artifact13149947448 SHA2568138e7afe7a949d84e1f56ea52c30a2e4ea868f8c05ed45e069d16d705e9b60f verified; desktop Brass choir and touch Crossfire court screenshots inspected. Tested solutions take7/7/14 turns; not claimed optimal or human enjoyment evidence. CI41463132157 failed on browser-harness syntax and is not passing evidence; corrected before the successful run.

Six rendered wins mean three courts in each viewport context, not six different games. The winning routes are automated gameplay through visible controls. No human enjoyment, physical-device test or measured playtime is claimed. No external game collection or asset pack was imported.

## Observed weaknesses and next pass

The current solutions are short and progression is limited to unlocking the next court and improving turn counts. Add useful tactical choices around projectile handling and defenses rather than padding the campaign with more health or repetition.

The inspected desktop and touch images show overlapping friendly/hostile arrows on one tile. Their directions and next destinations need clearer rendering. The mobile action panel is reachable, but it covers lower map rows in the initial view until the page is scrolled. Keep the complete board usable alongside controls. Change ambiguous Turn labels to communicate that guarding affects only the next action. These improvements have not yet been implemented or counted.

After that pass, verify complete keyboard play, shield exhaustion/recharge, simultaneous impacts, loss/retry, record saves, actual bridge hidden-state and scoped recovery. Compare the improved candidate against the slate before selecting it.

## Counts and preservation

Exactly50 third-batch slots: **29 built,28 improved,28 fully browser-qualified,0 currently integrated/live;21 unbuilt**. Historical25 releases remain separately recorded. Second batch remains20/20 including its additional improvement round, with9 historical releases and0 current active catalogue entries after PR110.

Main was fa57730f70904ae5f15e47fe0c7e55dc28144c88 at the start of this run; no main changes were made. The exact14 catalogue policy still holds. No unchanged publishing failure was retried or counted as work. Existing source/saves, Numberworks, Gummy Bay, requested-GitHub-games and automation settings were preserved. The current development tree contains no AGENTS.md or requested first-batch FINAL_REPORT.md; established baseline and current ledger were used without claiming a fresh read of absent files.

Next complete this candidate's substantive improvement and qualification, then implement slots70–90. Keep unfinished work on development branches and distinguish source integration from live release.
