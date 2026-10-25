# Bramble Dice — conditional equipment

25 October 2026. Implementation: d78751b7aeca9bc882c294126ce8dbbd55b826f1.

Source-led weakness: the three original equipment choices only scaled a job. Keeping low rolls and spreading dice between jobs had no special equipment payoff. No rendered observation is claimed.

Added two alternatives at the existing two reward clearings:
- Acorn Sling adds three attack for each attack die showing one or two, making low-roll retention an option.
- Three-leaf Clasp adds four attack when attack, guard and repair all receive dice, rewarding hybrid allocation.

Both stack. They compete with the existing spoon, shield and salve without adding levels, timers or extra reward slots. Forecasts state the conditional attack bonus, and the equipment summary shows owned gear only. The guide explains the tradeoffs.

13 tests pass: eight engine and five jsdom. Includes 25 seeded winning routes across five equipment focuses; direct low-roll, mixed-job, stacking and no-free-bonus checks; all prior control/loss/retry/save checks; and saved fixtures generated from the pre-upgrade engine. Old version-one journals retain their health, dice, RNG, encounter, phase, turn count and records. New choices persist through reload. Script syntax passes.

The automated policy still rerolls low dice rather than optimizing for the sling. Its wins demonstrate reachable completion, not optimal strategy, balance, or enjoyment. DOM tests simulate dialog methods. No browser rendering, screenshot inspection, touch test or full repository build was performed. Existing browser-policy restrictions were not bypassed. The game remains an unlisted prototype.

Only Bramble Dice source/tests and third-batch records changed. Save key/schema remain version one; other games, main catalogue and prior collections are untouched. First-batch baseline re-read: 20 finished, nine historically selected, zero verified live. Second batch remains 20 initially complete with 6/20 additional upgrades verified. Third batch remains exactly 50 slots: **6 built / 0 improved / 0 browser-tested / 0 integrated / 0 live**. This source upgrade is pending rendered play and earns no completed improvement credit.
