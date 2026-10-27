# Bramble Pact

Third-collection slot 63. Initial playable source; unlisted, awaiting rendered playtesting and a substantive playtest-led improvement pass.

An open-hand trick-taking harvest puzzle. Choose a card, follow the led suit when possible, and anticipate two deterministic neighbours. The wind suit changes each trick and outranks other suits; the led suit determines the harvest. Keep exactly the promised Berry/Nut/Leaf baskets after six tricks. Sometimes the useful move is to lose. One woodland offer can discard your next won harvest, but is spent even if that trick loses. Winning with an offer keeps the next lead by default. Before the final trick, you can instead invite Wren or Moss to lead after your offered win. The same offer is spent, the harvest is still discarded, and losing leaves the actual winner leading.

Three fixed, authored deal/goal combinations use all eighteen cards (three suits, ranks 1–6). These are compact puzzles, not a long campaign. Every hand has verified wins with no offer and separate wins where the offer actually discards a harvest. Replay records distinguish those two outcomes. The second and third hands unlock sequentially. All opponents' cards, the wind schedule, and exact selected-card outcomes are visible; there is no reaction timer or hidden random event.

This is a distinct loop from Bramble Dice's reroll/combat allocation, Thimble Fair's auctions and crafting, and Inkline's route cards. It uses familiar follow-suit rules in an original exact-harvest puzzle structure, rather than copying those games' engines or substituting their art.

## Controls and saves

- Click/tap a legal card, optionally select the woodland offer, then Play. The preview is free and does not commit.
- Tab/Enter/Space work on native controls. Page/card shortcuts: 1–6 select by hand position, Enter commits, G toggles the offer, Z undoes. P is left to the shared bridge.
- Undo works after a win or loss. Confirmed restart keeps records. The three picnic buttons also ask before replacing a current hand.
- Save key `study-desk-bramble-pact-v1` stores a validated six-action journal, current picnic and three best records. Only this key is reset. Unreadable data remains untouched until confirmed recovery; failed storage writes warn without preventing play.
- Real bridge loads first. Parent/document visibility and pause block input; returning requires explicit resume. Confirm dialogs cannot commit while hidden.

All SVG suit art, CSS, rules, deals and implementation are original for Study Desk. No downloaded art, audio, fonts or third-party game code. There is no audio.

## Verification

`NODE_PATH=/path/to/jsdom/node_modules node --test tests/bramble-pact-engine.cjs tests/bramble-pact-dom.cjs`

31 tests pass: 15 engine, 16 jsdom 26.1.0. Six winning routes (with/without effective offers), three losing routes, per-action reload, sequential unlock, retry/undo, record preservation, strict malformed-save handling, native-control guards, real bridge P reservation and visibility in simulation. The original action set’s exhaustive legal branches cover 8,139 prefix visits / 3,381 complete journals, including alternative offer timings; these are algorithmic paths, not distinct content or human play sessions.

No rendered browser run, screenshot inspection, touch-layout verification, native-dialog verification, human enjoyment evidence, qualified improvement pass, catalogue integration or live release. The existing browser access policy blocker has not been retried or bypassed. Before selection: play the actual desktop/mobile interface, assess whether exact previews leave enough interesting planning, improve the weakest observed part, and inspect navigation and screenshots. Three fixed six-trick hands may be too short or too solvable by preview alone; these remain open design questions.

Invitation refinement: six additional complete routes (both neighbours in each picnic) pass through engine and actual UI handlers with per-action reload. Exact next-leader forecasts, card conservation, strict invitation validation, one-offer cost, loss behaviour, final-trick exclusion and undo are checked. This is a source-based refinement, not a rendered-qualified improvement.
