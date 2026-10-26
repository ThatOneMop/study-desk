# Canopy Weave initial prototype — 26 October 2026

Source: `d55722bdaafe719b17c003f5cc9365b02ecac95d` on `indie-collection-three-dev`.

## Implemented loop

Slot 53 is an original authored graph-untangling game. Players reposition leaf knots on a nine-by-nine trellis; every incident vine follows the knot. The goal is a planar arrangement with no crossing or overlapping vines and no vine through an unrelated leaf. Shared endpoints are permitted. There is no prescribed final arrangement, timer or loss state.

Three graphs progress from a four-node loop, to a wheel, to nested triangular connections. Demonstrated routes finish in 3/5/6 committed moves. These are compact validation routes, not minimum lengths or a content-duration promise. This direct graph manipulation differs from the existing stitch-routing and gravity/bead games; no prior candidate source, assets or names are repackaged.

Pointer dragging previews conflicts without changing the save and commits one move on release. Cancel, pause, dialogs and parent visibility discard the preview. Tap placement, letter selection buttons, arrow buttons and keyboard nudges provide alternatives. Dashed rust-coloured vines indicate tangles; knot letters avoid colour-only identification. Original SVG/CSS art is included but not visually verified.

Unlimited undo and confirmed retry preserve best records. Completion unlocks the next trellis. Isolated v1 saves replay bounded journals, reject invalid/post-win placements and preserve corrupt data until recovery. Quota failures continue as temporary sessions.

## Evidence and limits

Nine tests pass: five engine and four jsdom 26.1.0. All trellises complete through the UI with exact reload after each move. Geometry tests cover crossing/touching/overlap/shared endpoint behavior and 24 rotated/reflected solved embeddings. Other coverage includes invalid moves, ownership, unlocks, record consistency, undo/retry, 300-action storage bound, preview/release/cancel, occupied targets, pause/parent guards, native-control event exclusion, navigation markup, reset isolation, corrupt recovery and quota failure.

Both scripts pass syntax checks. SVG bounds, pointer events/capture and dialogs are simulated. No rendered browser, screenshot inspection, native keyboard/touch, mobile layout, human enjoyment or full repository build claim. The static repository needs no game compilation; the partial checkout cannot establish full-repository validation.

## Status and preservation

Exactly 50 third-batch slots: **13 built; 0 improved/browser-tested/integrated/live**; 37 remain unbuilt. Second additional round remains **20 source upgrades, 6 verified, 14 pending**. First-batch report reread: 20 finished, nine selected source entries, zero verified live URLs.

Main `dc88f09cfb30cae92e3f0e9afe65cd2f7ddaf4f7` and second branch `3949e3d9f8e2e9846dc4c91c436d90b19bbbd341` remain unchanged. No workspace/publication retry or browser-policy workaround. Only new Canopy Weave source/tests and third-batch evidence are added; existing games, saves, shared navigation, public catalogue and concurrent Gummy Bay work are preserved.

Next: natural rendered desktop/touch play and screenshot inspection, then a substantive improvement based on observed targeting, feedback or progression weakness. Verify reload, undo/retry/restart and navigation before catalogue selection.
