# Fallow Table

An original turn-based crop-rotation game for third-batch slot 59. Grow beans, carrots and squash for a shared supper on nine beds. Each day supplies three work points; planting, harvesting, cross-watering and composting compete for them. Advance the day deliberately to apply a visible weather forecast and grow the crops. There is no real-time clock.

This is a temporal farming/resource loop, separate from Field Album's wildlife drafting, Moss Commons' permanent settlement placement, Glasshouse's breeding and Rill & Root's height-field routing. The same three crops interact through soil depletion, bean restoration, repeat-crop penalties, water storage and live companion shade. Three authored contracts vary initial soil, weather and basket requests. They are compact prototypes, not a content-hours claim.

## Rules

- Eight workdays, three work points each. Ending early discards unused work. Seven intervening nights grow crops; ending day eight closes the season without another growth step.
- Beans: two growth nights, no soil cost, two portions. Harvest restores one soil (cap two) and grants one compost bag.
- Carrots: one growth night, one soil, two portions. Squash: three growth nights, two soil, five portions. Soil is spent at planting. Replanting carrots or squash after the same crop in that bed loses one yield. A bean harvest resets that rotation penalty.
- Rain first adds one water to every bed, capped at two. Each immature crop with water grows once and consumes one water. An orthogonally adjacent standing bean plant lets squash grow without consuming water, but the squash still needs positive moisture. Mature crops do not drink or spoil. All growth uses the same start-of-night bean layout.
- Watering fills the selected bed and its orthogonal neighbours to two. Compost spends one bag to restore one soil (cap two); two bags are supplied initially. No-op jobs are rejected without spending work.
- Finish all basket requests to unlock another contract. Best records maximize unused work, including future days. This rewards finishing efficiently without a real-time score. Undo restores the complete prior day, crops, resources and harvested stock; earned records remain. Retry keeps records. An unfinished season can be undone or retried without permanent penalties.

## Controls and presentation

Select a bed and a seed packet, then use Sow, Pick, Water or Compost. Buttons are native and at least 44 CSS pixels high. The field shows crops, maturity, soil and water; the basket shows each separate request. A whole-season weather strip and optional exact overnight forecast support planning. Ending with unused work or closing the season requires confirmation.

Native Tab/Enter/Space works throughout. On the page or bed controls, arrows select a bed, 1–3 select seeds, S sows, H harvests, W waters, C composts, G turns beans into soil, T transplants to the selected destination and Z undoes. Shortcuts do not override other interactive elements. Pause, dialogs, document hiding and same-origin parent hide messages guard input. The Study Desk bridge loads first. Games navigation retains the catalogue destination; no workspace-switch control is added.

All SVG illustrations and CSS are original source in this repository. No external assets, fonts, production dependencies or audio. The desktop two-column layout stacks below 720px; ripe-crop animation respects reduced motion. These are implemented layout rules, not evidence of inspected rendering or physical touch testing.

## Save contract

`study-desk-fallow-table-v1` stores `{version:1, level, moves, records}`. Actions are replayed and validated through the engine; invalid, locked, overlong and post-completion journals reject. The 32-action cap follows the maximum 24 jobs plus eight end-of-day actions; it is not a content objective. Records are bounded and sequential. UI selection, seed choice, confirmations and forecasts are transient.

Unreadable data remains untouched until confirmed recovery. Storage failures show a temporary-session warning and leave the game playable. Reset only replaces this game's key. Other games' saves remain unchanged. Undo/retry and unlocked contract navigation preserve records.

## Validation

`NODE_PATH=/path/to/jsdom/node_modules node --test tests/fallow-table-engine.cjs tests/fallow-table-dom.cjs`

27 passing tests: 16 engine, eleven jsdom 26.1.0. Fixture routes complete all three contracts with 13/11/8 work points left and save/reload after every action. Eight rotations/reflections per contract replay the same strategies successfully. Deterministic varied routes exercise resource bounds and replay. Tests cover moisture order, dry stalls, mature crops, companion shade and removal, rotation yield, soil/compost, bounded cross-watering, work limits, final-night closure, undo, retry, progression, native-control guards, pause/dialog/parent guards, forecasts, isolated reset, corrupt data and storage failures. Both scripts pass syntax checks; local asset references and Games navigation are checked.

The fixture scores are feasible, not proven optimal. These automated routes do not establish human enjoyment, rendered layout, physical touch, native dialog/focus behavior or a full repository build. Existing browser access remains blocked by a previously recorded security-policy rejection; it was not retried or bypassed.

Keep this candidate unlisted pending natural rendered play, inspected desktop/mobile screenshots, a substantive improvement based on an observed weakness, follow-up verification and selection. Assess especially how often rotation matters within the short season, whether cross-watering makes central beds too dominant, whether bean shade is readable, and whether additional replay choices would improve depth. No qualified improvement pass or live release is claimed.

## Green manure source refinement

After one or more actual growth nights, a bean plant can be turned into its bed for one work point. It restores two soil (capped at two), gives one compost bag, clears the plant and sets the last crop to beans, but yields no food. A ripe bean can also be turned: picking gives two portions and one soil instead. Turning removes companion shade immediately; the forecast reflects that loss. This creates an early soil-renewal option at the cost of planted food and another job.

The action is `{type:'turn',p}` in the existing v1 journal. No new save fields, key changes or extra work allowance. Old routes retain their 13/11/8 scores. New manure-inclusive routes finish all three contracts with 7/5/8 points; the first two are coverage routes, not claims that manure improves the score. The poor-soil third route uses early renewal instead of spending an initial compost bag. Undo restores the original plant, shade, soil and compost.

Eight added engine/DOM checks cover the tradeoff, immature/ripe eligibility, rejection, resource caps, shade removal, undo, full campaigns with reload, native-input/pause/modal guards and retry. Instructions now start collapsed and the player-facing footer omits development terminology in line with main's current quality checklist; development status remains explicit here and in the ledger.

This is a source-observed mechanics refinement, not a rendered-play improvement pass. Rendered feedback, balance, layout and natural play remain pending. Keep the game unlisted.


## Transplanting source refinement

An immature crop can move to any empty bed for one work point. Select its current bed, choose a destination in the labeled native selector, then use Move growing crop (or T on page/bed focus). The preview states the crop, growth, yield and cost. Ripe, occupied, same-bed and invalid destinations are rejected without spending work.

The crop keeps its growth and planted yield. Soil, water and previous-harvest rotation history stay with each bed. Soil already spent at planting is neither refunded nor charged again. The destination's moisture and neighbouring beans govern subsequent growth. Moving a bean changes its companion shade immediately; moving a dry crop to wet ground can resume growth without watering a whole cross. Harvesting later updates the destination's rotation history normally.

The v1 journal adds {type:'transplant',p,to}, with no new state fields or save-key changes. Undo restores the crop and work; retry preserves records. All original routes/saves remain supported.

34 checks pass (20 engine, 14 jsdom), including the original 27. New coverage includes resource/history preservation, moisture and companion-shade consequences, strict eligibility, undo, three transplant-inclusive campaigns with per-action DOM save/reload, selection without mutation, keyboard/native/pause/modal guards and ripe rejection. Coverage routes finish with 10/8/5 points; these are not stronger-score or optimality claims. Scripts parse.

Observed limitation came from source inspection: crop locations were permanent after planting, preventing adjustment to moisture or companion shade. This source-informed mechanic does not count as a rendered-play-led improvement. Before qualification, assess whether relocation adds useful choices or enables dominant planting patterns, inspect desktop/mobile layout, and verify natural progression and navigation.
