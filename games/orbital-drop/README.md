# Orbital Drop

Original, dependency-free, solo 2D extraction shooter. No commercial game code, branding or assets are included.

Recover three relays by standing inside their circles for eight seconds each, then hold the landing zone for eighteen seconds. Movement and tactical abilities are essential as enemies escalate. Rank promotions grant a choice of damage, firing rate or speed. Three difficulty settings and the successful-extraction counter provide replay goals; this is a compact mission, not a long campaign or online multiplayer.

- WASD/arrows: move; rifle automatically attacks the nearest enemy in range.
- Pointer hold: override firing direction while a target is in range.
- Space: directional dash (4-second cooldown).
- Q: area shockwave (12-second cooldown).
- Escape or Pause: pause/resume.
- Touch: movement pad and ability buttons; upgrades are tappable.

Storage: `orbital-drop.extractions.v1`, optional local win count. Storage denial does not block play. Includes the Study Desk bridge for parent suspension and input release. Audio is not implemented.

Validation: `node --test tests/orbital-engine.cjs` and `NODE_PATH=<jsdom modules> node tests/orbital-shell.cjs` (from repository root). The latter also checks Lanebound and exercises bridge, start, pause/resume, input, and parent visibility suspension with a simulated RAF clock.
