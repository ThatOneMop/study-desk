# Study Desk release — 10 November 2026

Six parallel Codex agents worked on this batch: five gameplay assignments and one research/hub assignment. Catalogue expands from 19 to 24 entries. Chaos Court includes three separate sports modes.

## New original games

- Orbital Drop: solo top-down extraction shooter, three relays, shield, dash, shockwave, promotions and difficulty choices.
- Lanebound: solo three-lane MOBA, two heroes, allied/enemy waves, towers, cores, enemy captain, respawn and home shop.
- Chaos Court: basketball, volleyball and soccer; solo bot or local two-player; five physics modifiers; first to five.
- Pocket Golf: generated nine-hole courses, wall gaps, sand, aim/power controls and saved personal best.
- Corebreaker: 60 asteroid sectors, weak seams, heat/combo, four upgrade tracks, drones, permanent core rewards, save import/export and shared J/K keyboard input.

These are compact original 2D browser games, not ports or equivalents in scope to the commercial inspirations. Online multiplayer is not added. No proprietary source or assets are imported. Corebreaker is a short incremental expedition, not a claimed 20-hour campaign.

## Existing games: all 19 touched

| Game | Changes |
| --- | --- |
| Gummy Bay | Curfew HUD matches 21:00 simulation and adds advance warning. |
| Forge Arena | Cancelled touch fire cleanup, pause on blur, hub shortcut compatibility and parent origin validation. |
| Roof Runner | Delivery prompt at postbox and paused delivery prevention. |
| Ashwake | Clear held movement through pause/relic choice and cancelled input. |
| Winterfold | Preserve unreadable saves; cancel gestures without spending tokens; pause during dialogs; confirm clear. |
| Bell Diver | Weighted return-air estimate and next-step route highlight. |
| Spanwright | Refresh-rate-independent physics; save editing changes and original bridge during simulation. |
| Creekhold | Demolition feedback; keyboard/modal handling; background pause. |
| Lanewright | Cancelled touch gestures do not spend roads. |
| Harvest Protocol | Isolate old asynchronous runs after reset; execution progress; editor shortcuts. |
| Mycelium Yard | Actionable harvest/spoilage/waterlogging forecasts. |
| Outbreak Atlas | Percent labels, retained keyboard focus, pause Watch during decisions/background. |
| Numberworks | Confirm cancellation of active project progress. |
| Packworks | Clear stale reveal/automation callbacks on reset/import; honest storage failure notice. |
| Autumn Drift | Confirm reseeding a partly cleared garden. |
| Little Lake | Pointer capture/cancellation prevents stuck touch inputs. |
| Tiny Wilds | Correct multi-level evolution rewards in messages. |
| Lost & Found | R sells finds; instructions updated. |
| Moon Salvage | Distance/find guidance and pagehide saving. |

Save keys and formats preserved. Catalogue has metadata-driven new/improved shelves, newest sorting, original cover illustrations and a local two-player filter. Existing access gate and disabled third-party arcade providers remain.

## Verification and limits

Asset integrity checks cover 24 routes and 107 HTML asset references with no missing references. Catalogue JS/JSON parity, bridge inclusion, credits and folder integrity pass. Hub tests cover new shelves, sorting, local two-player classification, launcher routes, pause/switching and saved preferences. Engine tests cover new-game progression, costs/cooldowns, physics and win/loss conditions. Regression tests cover existing-game fixes.

Browser smoke checks opened all five new interfaces and exercised start/pause, sport/opponent selection, golf stroke and asteroid damage controls. Cloud browser frame progression did not provide reliable continuous simulation evidence; bridge-inclusive simulated RAF tests pass for both combat games. Full match completion, mobile hardware, long-session balance, and online peer play are not verified. No claim that all 24 games received a full visual redesign or human playtest.
