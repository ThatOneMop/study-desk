# Moon Dial — initial implementation

25 October 2026. Slot 42, source commit `60dd61044207070fef97638b829242cf1e273715`. Unlisted third-batch prototype.

## Core loop

Each rotary dial has six positions and a target moon mark. Turning a dial moves every connected dial, with neighbours rotating in opposite directions. One sliding clutch disconnects an edge of the mechanism; moving it reconnects the previous edge. Choose which component to isolate and which dial to drive, then register every hand to its target.

Three authored machines use a short chain, a branching mechanism and a longer chain. They unlock sequentially and record fewest turns (clutch moves are free). Undo and restart permit relaxed experimentation without timers or a failure penalty. A 400-action journal limit is a save-size safeguard, not a gameplay/content target; the UI explains when restart or undo is needed.

The original navy/brass/mint CSS faces show current and target positions numerically as well as visually. Tap to select; turn buttons and keys A/D operate the selection, 1–5 select dials, Z undoes. The coupling panel and direction forecast describe the transmission. No imported games, assets, runtime dependencies or compile step.

## Evidence

Four engine tests pass. A graph search finds legal solutions for all three machines (3, 6 and 11 total actions); tests replay them through normal action dispatch and validate exact saves after every action. Tests separately verify alternating rotation, isolation of only the selected coupling, undo/restart, preserved records and rejection of corrupt journals/locked machines.

Two DOM tests pass. Every mechanism is won through UI handlers with reload after each action. Keyboard, pause, modal cancellation, isolated reset, malformed-save preservation and explicit recovery are checked. The Games href is checked; actual navigation is not browser-verified.

These tests prove rule reachability and interface wiring, not human enjoyment or rendered usability. No screenshot was generated or inspected. The previously recorded browser-policy blocker remains unresolved; no workaround or new browser run was attempted. Source commit skips CI. Desktop/touch play, legibility, animation, progression and navigation still require rendered verification and a substantive improvement based on observed weakness.

## Preservation and totals

The local checkout had been pruned by workspace maintenance. Required current source/ledgers and first-batch baseline were read from GitHub. No repository instructions named AGENTS.md were present in the third-branch tree. Changes were created against the current GitHub tree; no old local checkout was used to overwrite concurrent work.

Third batch: **2 implemented / 0 improved / 0 browser-tested / 0 integrated / 0 live**, exactly 50 slots. Stencil Studio remains slot 41. Second batch stays at twenty initially complete, 6/20 additional upgrades verified; Windup kits remain pending. First batch stays at twenty finished, nine selected and zero verified live URLs in its recorded baseline. No catalogue, first-batch or second-batch files changed. Main observed at `85d941d59e8897585606e5a67f4413a710643067` and untouched.

Full repository build/integrity checks were not rerun from a complete checkout after pruning. Targeted engine/DOM and syntax checks passed; the GitHub commit diff is checked to ensure only intended new game/test and ledger/report paths changed. Existing workspace-control/publication findings were not retried or counted as new progress.

Next: review both prototypes in a permitted rendered browser; implement meaningful improvements from that play; then consider catalogue integration. Continue the fourteen outstanding second-batch upgrades and the remaining 48 third-batch games. No final quality rating or hours-of-content claim.
