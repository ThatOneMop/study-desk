# Lane Eight swimming career — 29 October 2026

Recovered the independently preserved career draft, previously absent from Study Desk main. This project remains separate from the 20/20/50 game collection counts.

Implemented career: three fictional clubs, four pool and three gym timed sessions, fatigue/recovery and stat-dependent controllable races, four repeating meet tiers, records, retirement after eight seasons (early after three races/season three), coaching, four recruitable swimmers, credits and per-swimmer records.

Current pass: improved water gradients, mosaic floor, moving caustics, sunlight, dimensional lane ropes and numbered starting blocks; articulated swimmers with caps, goggles and bubbles. Pool training now has its own animated swimming illustration instead of gym equipment. Added career-state guards and recovery input validation.

Verification: 25 Node tests pass, including all four strokes at 50/100/200m, training improving actual simulated race time, fatigue costs, clubs, meet unlocks and duplicate rewards, full athlete-retirement-coach flow, recruiting, squad training/racing and save migration. Syntax checks pass. Browser: joined career, completed five gym reps, reloaded saved career, started quick race and exercised keyboard strokes/breathing; inspected gym and upgraded pool screenshots. Full rendered career-to-coach traversal and physical touch-device testing remain unverified. Graphics are original canvas/SVG/CSS; no external assets.

Next: deeper rendered meet and coaching playtesting, distinct pool-session mechanics, richer career goals, mobile layout review and eventual Study Desk integration. Do not claim a GitHub catalogue release from this separate Site publication.

## Manager and chase-camera pass — 29 October 2026

Added a perspective chase camera with stadium seating, water reflections, animated swimmers, wakes, approaching-wall cues and a saved chase/overhead toggle. Both cameras use the same race physics. This is original canvas artwork inspired by the requested swimming-sports presentation, not Michael Phelps assets or Kinect support.

Career now has six clubs: three open community squads and earned academy/state/national programmes, with specialty bonuses, reputation/stat/medal requirements, signing costs and a seven-day transfer window. Added meaningful easy/balanced/overload training choices, planned meet targets, manager advice and earned career credits. Completing races, personal bests and first podiums per tier per season fund transfers. Added version-compatible migration and career JSON export/import for moving between the standalone site and Study Desk.

29 engine tests pass. Rendered QA: saved a Club Night target; chose overload; completed five pool reps (technique 20→25.8, fatigue 22→40); reloaded the career; played a full 50m career race using keyboard strokes/breathing; paused/resumed; finished sixth, gained 6 reputation and 25 credits, and observed the saved race book and cleared target. Inspected chase-camera, club ladder and 390px dashboard screenshots. Fixed the finished-position HUD mismatch observed in that race. Narrow layout testing uses a 390px iframe, not a physical touch device. New academy requirements, credit deduplication and transfer cooldown tested in Node; late-career rendered traversal remains outstanding.

Study Desk integration is prepared separately against the current GitHub main and current Sites source; preserve each catalogue's concurrent additions. Keep the same game save key. Existing saves on the standalone origin can be moved with Export career / Import career; browsers do not automatically share local storage across origins. No collection slot counters or automations are changed by this work.
