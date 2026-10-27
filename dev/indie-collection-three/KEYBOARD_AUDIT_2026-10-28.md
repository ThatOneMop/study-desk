# Embedded controls audit and Rill & Root repair — 28 October 2026

Implementation: [1cd076ff0db03a4d4aa87348db9ffcab271a8ffd](https://github.com/ThatOneMop/study-desk/commit/1cd076ff0db03a4d4aa87348db9ffcab271a8ffd).

## Reproduced problem and repair
Study Desk's actual bridge captures plain P in embedded games before game listeners, reserving three presses for workspace navigation. Rill & Root bound its Release water action to P. Its standalone jsdom tests did not load bridge.js, so that collision was invisible to them.

Release water now uses W, with matching help text, visible button hint and aria-keyshortcuts. Button/touch activation, engine, journal actions and existing save keys remain unchanged. The shared bridge and workspace-navigation shortcut are not modified.

A new test loads the actual bridge before the engine/game with a simulated parent window. Before the repair, P navigation passed but W pouring failed. After repair, all **34 tests pass**: 17 engine, 12 standalone DOM and five bridge-integrated DOM checks. New coverage includes reserved P without pouring, W pouring, keyboard cut/fill/pour completion and reload, native-control ownership, modifiers/repeats, pause/modal guards and actual bridge visibility suspension/resume.

Command: NODE_PATH=/tmp/rill-bridge/node_modules node --test tests/rill-root-engine.cjs tests/rill-root-dom.cjs tests/rill-root-bridge.cjs. Game script syntax check passes. Dependency installation completed before the meaningful before/after regression runs.

## Audit scope and preservation
Inspected main index.html, app.js and bridge.js at 55c330d9ec493afc40e81e89a371f64cbd5bd8b0. The bridge is byte-identical to third development. No Switch workspace/playerStudy/studyBtn control matches found in the launcher.

Inspected game.js and index.html for all 22 built third candidates, 44 files. Source search found one explicit reserved P action binding, in Rill & Root, and no Switch workspace control matches. Audited paths and source blob IDs are in KEYBOARD_AUDIT_2026-10-28.json. This does not claim comprehensive dynamic behavior verification or a new audit of the first/second collection shells.

First-batch final report, current third tree/ledger and Rill & Root source conventions inspected. No AGENTS.md in third tree. Starting third 7de8b6cdf4d2389b93970480672d30438ae941a8; second 3949e3d9f8e2e9846dc4c91c436d90b19bbbd341; main as above. Preserve Games/Collection navigation, catalogue search/group/sort/favourites and concurrent main/Gummy Bay work. No catalogue entry or automation changes.

## Evidence limits and counts
This is a real source reliability defect reproduced with the actual bridge in jsdom, not a rendered iframe or native-input test. No screenshots, physical touch, human enjoyment rating, qualified improvement pass, full repository build or live release. Known browser security-policy blocker was not retried or bypassed; unchanged publishing failure not retried.

Exactly 50 third slots remain: **22 built, 0 qualified improved, 0 browser-tested, 0 integrated, 0 live**. Second additional round remains **6/20 verified, 14 pending**. First collection preserved. This control repair does not increment completion counts.

Next: rendered keyboard/touch/navigation checks once supported access is available; retain the bridge harness for future game-shell input changes. Continue outstanding original game implementation and substantive playtest-led refinement.
