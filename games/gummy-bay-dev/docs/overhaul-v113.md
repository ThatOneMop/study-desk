# Gummy Bay — integrated overhaul v113

The 160-point reference is retained in `overhaul-160-audit.json`. This is an implementation/evidence audit, not a claim that all 160 observations are complete features or visually accepted. Literal features not implemented are named in the audit.

## Rebuilt and corrected

- Character skull geometry now preserves vertex colours. The previous rounded-head generator created black RGB vertices on a vertex-coloured skin material. All six loaded high/low assets are checked.
- Skull has a tapered jaw. Upper arms, forearms and thighs are reshaped in skeleton rest space using weighted transforms; joint lengths, animation clips, feet and colliders are preserved.
- Brows, glints and fallback lids now match the actual exported front eye plane (+Z, eye height 1.89 model units). Prior accents were behind and below the eyes. Hat brims face forward. Clothing details follow the animated chest.
- Residents have bounded width variation shared by both LODs, and nearby facing turns interpolate instead of snapping.
- Walking uses the exact integral of velocity damping. Forward/reverse acceleration, release and jump height have matching real-time results at 20, 30, 60, 120 and 144 Hz. Bob advances with actual displacement, not input held against a wall. Blocked sprinting no longer drains stamina.
- Hover and edge auto-turn are removed. Mouse look requires a drag or explicitly enabled pointer lock. Touch swipe remains. Settings instructions match the new behavior.
- A skippable three-part arrival introduces the existing $400/RV start. The first call is paced in three exchanges and tracks the motel after the authoritative call action. Return calls show current progress. Save version remains 3; existing slots are preserved.
- Three outer neighbourhood shops have real animated residents, shopfront signs, map destinations and the existing authoritative tools/seed/supply purchase paths. Existing island infill, sea, hills, roads and property ladder remain.
- Task containers tilt and stir with time-based easing. Their pour stream follows the moving spout. Completion/cancellation and inventory commits remain authoritative.
- Contact footsteps use a cached filtered noise buffer rather than the previous repeating pure tone, with quieter crouch contacts and raised-deck variation. Audio has not been auditioned in this environment.
- Mobile notebook is compact; the supply summary moves away from movement controls. Landscape layouts keep the center usable. Title no longer carries an unexplained IV suffix.

## Verification

Baseline: 94 suites passed. The module-link suite requires `--experimental-vm-modules`; the initial invocation without that flag failed and was corrected before editing.

Final reproducible command: `python tests/run-all.py`. Final results are stored in `evidence/v113-final-tests.json`. The boot integration suite loads actual GLBs with Three.js but mocks DOM, WebGL, channels and time. It exercises save reload/import, first-batch economy, cancellation, physical shop approach, actual outer-shop purchases, police migration/search, property/worker relocation, collision paths, phone/map, input events and arrival persistence.

Additional regression tests check frame-rate independence, nonblack generated skin vertices, normalized weights and face positions against the real GLB skeleton. Bounds tests changed only where intentional resident-width and roster changes superseded earlier constants.

The native browser preview cannot create a WebGL context. A separate 390×720/960×600 static HUD fixture was visually inspected and then removed from deployment. A CPU posed-triangle character view was inspected for geometry only. Neither is an in-game rendered playtest. GPU performance, final character appearance, audio, actual iPhone controls and live peer-to-peer co-op remain unverified.

## Remaining acceptance

Do not call this perfect or call all 160 points complete. A working WebGL device must validate natural traversal, camera feel, clipping, night readability, character expressions and controls. The audit explicitly preserves gaps such as skating, dynamic weather, fire, combat, a world computer and additional drivable vehicle classes instead of silently declaring them implemented.
