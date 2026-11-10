# Lanebound

Original, dependency-free, solo 2D lane tactics game. Three lanes have allied/enemy minion waves, destructible towers and cores. An AI captain contests lanes. Choose the mobile ranged Ranger or the tougher Warden, earn gold/levels, buy equipment near home, and destroy the opposing core. Heroes respawn; cores do not. No commercial game code, branding or assets are included.

- WASD/arrows or touch movement pad: move. Attacks automatically target nearby enemies.
- Q / Pulse: area damage (7-second cooldown).
- E / Mend: heal (15-second cooldown).
- Space / Dash: directional burst (6-second cooldown).
- Escape / Pause: pause and resume.
- Return to the blue core for passive healing and the workshop. Blade adds damage; Boots add speed; Armor adds maximum health. Each has five ranks and increasing cost.

Win counter: `lanebound.wins.v1`. Storage failure does not block play. Includes the Study Desk bridge. This is a compact solo browser interpretation of lane combat, not a full Dota clone, online multiplayer or long-form campaign. Audio is not implemented.

Validation from repository root: `node --test tests/lanebound-engine.cjs`; shared bridge/DOM smoke: `NODE_PATH=<jsdom modules> node tests/orbital-shell.cjs`. A simulated lane-push strategy was verified to win; this is mechanical validation, not a claim of broad human playtesting.

Every third wave sends a cannon down each lane for both teams. The larger, gold-ringed unit moves slowly and deals double damage to towers and cores: escort your siege wave and intercept the enemy’s.
