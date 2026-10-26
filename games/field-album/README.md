# Field Album

Original, unlisted third-collection candidate 55. Static HTML/CSS/JS; no runtime packages or external art. Open through the repository HTTP server, then choose Open my album. No catalogue entry yet.

Choose meadow, pond or forest for each of six surveys. Each deterministic packet contains a local plant, local animal and mixed find. Keep two of three cards and place them on a twelve-space terrain page. Edge neighbours influence scoring: bees want clover, frogs want plant diversity and robins want forest and separation from other robins. Plants score on matching terrain. Selection previews the exact total delta, including changes to existing neighbours. A robin can reduce a neighbour's solitude score.

Three terrain pages use targets 36 / 40 / 44. Fill a page to record a score; reach its target to unlock the next trail. Missing a target does not destroy anything: undo and retry remain available. Seed changes vary packet contents with the same rules and terrain. This is a compact drafting/placement game, not a claim of extensive campaign hours. There is no currency, purchase or paid random pack.

Controls: pointer/native buttons for survey, card and space selection, then Place; 1–3 selects survey/card, arrows select a space, Enter places when focus is outside native controls. Space labels include terrain, occupant and points. Cards/controls are ordinary buttons. Native keyboard/touch behaviour and responsive layouts still need rendered verification. Pause, parent/document hiding and confirmation dialogs block gameplay. Reduced-motion preference disables packet entrance animation.

Save key `study-desk-field-album-v1` is isolated. Version 1 stores seed, trail, a replayed journal (maximum 21 actions: 18 survey/placement actions, one optional rearrangement, one pocket and one pocket replacement) and three best-score records. Packet reveals and placements are saved; transient selections are not. Undo does not reroll a packet or erase a record. Switching seed/trail and retry preserve records; all-reset requires confirmation and affects only this key. Unreadable data is kept until explicit recovery/reset. Storage failure is reported while keeping the session playable.

Validation: `node --test tests/field-album-engine.cjs tests/field-album-dom.cjs`, with jsdom 26.1.0 installed outside the repository and exposed through NODE_PATH. Engine-only suite has no dependencies. Initial validation: 18 tests passed (10 engine, 8 jsdom). Route fixtures produce seed-137 scores 66/64/57. A two-placement greedy helper reaches all targets for seeds 1, 42, 137, 2026 and 999999; this is not exhaustive search or an optimum claim. The fixed forest-first low route scores 31 and exercises missed-target recovery. Initial failure-route tests incorrectly assumed meadow-first play would fail (it scored 56); only the test route was corrected, not the targets or rules.

No rendered playtest, screenshot review, physical touch test, human enjoyment claim or full repository build. Keep unlisted until natural play identifies a substantial improvement, that change is implemented, and desktop/mobile gameplay, save/restart and navigation are verified.

## One rearrangement per album

Select Rearrange once, choose an occupied source in the dropdown, then an empty or differently occupied destination. Confirm the score forecast to move or swap the finds. This preserves all later drafts and works after completion; a new best score can unlock the next trail. Same-space/identical-find swaps reject without spending it. Undo recovers the allowance, retry starts with a fresh one, and records never decrease. Original journals and boards remain unchanged unless this action is used.

Refinement checks: 26 passing engine/DOM tests (14 engine, 12 jsdom), retaining the original 18. The 31-point forest-first album can become 39 points by swapping spaces 5 and 6, unlocking trail two without redrafting. Source inspection motivated this change; no rendered improvement credit.

## Field pocket (source refinement)

Once per album, keep an unplaced packet find for later. Its card becomes unavailable in the current packet: place the other two. In a later survey, select a different unplaced find and use the pocket to replace it. The carried species can then fit a new terrain or neighbour combination. This changes the available draft choices across surveys without adding a thirteenth placement. The last survey cannot start a pocket, and same-survey or identical-species replacements are rejected. Keeping a find after one placement is allowed; a taken find can never be pocketed or replaced.

The pocket and rearrangement are independent allowances. Undo restores either one, including after a packet transition. Retry, trail changes and seed changes clear both through journal replay while retaining records. Committed `pocket` and `swapPocket` actions each contain a card index. The v1 journal now allows at most 21 actions (18 ordinary actions, one rearrangement, one pocket and one replacement); old journals replay with unchanged derived board shape. A pending pocket may be left unused when finishing an album.

This is a source-led refinement, not a rendered-play improvement pass. Test whether delaying a useful find creates satisfying choices, whether the replacement label prevents accidental trades, and whether the additional controls remain readable on touch devices before selecting this prototype for the catalogue.

Current validation: 33 tests pass (18 engine, 15 jsdom), retaining all 26 pre-pocket tests. Includes full 21-action replay with both allowances, exact species carry, invalid/late/taken/identical trades, legacy board shapes, unused pockets, UI preview/selection, pause and native keyboard guards, packet reloads, completion and isolated reset. No rendered evidence.
