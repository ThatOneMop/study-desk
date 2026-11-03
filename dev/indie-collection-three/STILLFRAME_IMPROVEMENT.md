# Stillframe — substantive improvement pass

Date: 4 November 2026 (Sydney); validation run on 3 November UTC.

## Before and after

The rendered baseline completed its album in three perfect shots and 18 control actions. Watching was unnecessary, settings could be repeated, and a print score remained beside a live scene that had already moved.

Stillframe now asks for three different photographic treatments of each animal:

- Portrait: the requested resting or revealed pose, centered, with a steady camera.
- Habitat: a resting animal positioned in the requested outer third of the frame.
- In motion: a travelling animal, space ahead, a following camera and Medium shutter. Following removes movement blur but blurs stationary subjects.

A sharp photograph alone no longer completes a brief. The live checklist explains missing conditions before film is spent; watching advances the predictable animal rhythm without spending film or imposing a real-time deadline. Accepted briefs survive a failed outing. Exhibition completion unlocks alternate portrait poses and habitat compositions while keeping best scores.

The captured contact sheet freezes species, pose, framing, quality and accepted brief separately from the advancing LIVE view. It persists through reload; an explicitly confirmed new outing clears that outing's sheet while preserving accepted work and best scores. Existing version-1 saves migrate under the original storage key. A completed old album retains its scores and starts the new briefs rather than auto-winning them.

Screenshot review of the first implementation found that the terminal brief misleadingly suggested choosing another animal and the shutter sat too far below the phone viewfinder. The follow-up commit clarifies completed/lost states and places Shoot/Watch beside the framing controls; the regression checks that live scene and shutter fit in the same 390×844 viewport.

## Implementation

- Gameplay/contact sheets/migration: `bebd926a986d93d9a8b53a3a21fcb631192d3c92`.
- Screenshot-driven terminal/phone control refinement: `081df261f0894134d464f83ad007425169e137c7`.
- Original code, SVG wildlife silhouettes and CSS landscapes; no third-party game collection or art import.
- Development branch only. No catalogue or existing first/second-batch source changes.

## Validation

Final CI [41671249260](https://github.com/ThatOneMop/study-desk/actions/runs/41671249260) at `92a4f8155ef927fd903a1523e451d022fecec1cc` passed:

- Six distinct engine checks: both brief editions with save round-trips; sharp-but-wrong composition rejection; panning tradeoff; frozen captures and failed-outing retention; v1 album migration; malformed saves/actions. The browser helper imports these tests too; that duplicate execution is not counted as six more distinct tests.
- Four rendered exhibitions in Chromium: two editions each at desktop1280×1000 and touch-emulated390×844, with 36 accepted photographs in total. First-edition routes reload and compare exact saved state after every action.
- Frozen subject/pose/composition, wrong-pose study print, film exhaustion/retry, retained scores, migration of completed v1 albums, native Space/Escape, pause, corrupt-save preservation/recovery, quota fallback and standalone Games navigation.
- No page errors or horizontal overflow. Phone scene bounds `y=-0.5,height=220`; shutter `y=279.5,height=44`. Both fit the 844px viewport with normal subpixel scroll rounding.
- Repository asset references:74 bundled routes/286 references; source syntax and Freedoom WAD/WebAssembly structure; nine selected first-batch integrity checks.

Final artifact13247618238 SHA256 `380e4d13c6a50167d28557442c45e233f4652fb884306dd6dc40b19421212246` was downloaded and hash-verified. Inspected `touch-controls-viewport.png` and `desktop-exhibition-1.png`: controls fit beside the live view on phone, terminal guidance is accurate, and contact-sheet species/compositions remain distinct. Earlier passing CI41670346187 artifact13247038317 (SHA256 `d07bca32359de0507e1345a77be35a89ad4907426918262966b930d87f3ca3d7`) was also verified and its desktop motion/phone exhibition screenshots inspected.

Intermediate CI41670853441 failed the newly added strict `scene.y>=0` phone assertion. The final test logs bounds, screenshots before asserting and allows one pixel of scroll rounding while still requiring the entire scene and shutter to fit; the measured -0.5px explains that failure. Gameplay and both completion routes passed in the final run.

This is automated rendered reliability evidence and agent screenshot assessment. It is not physical-device testing, human enjoyment testing, a full embedded-shell qualification or measured long-form content.

The two explicit composition editions each have an automated nine-shot, 73-action solution, including eight watch actions. Action counts describe the test route, not content duration or enjoyment. The mechanics add purposeful timing, framing and technique choices; they do not establish a long campaign.

## Assessment and next work

The substantive improvement pass is complete; the final rendered regression and screenshot review passed. Stillframe remains a compact, guided photography puzzle with three fixed subject rhythms and two composition variants. Readiness hints make it accessible but also make solutions explicit. Visuals are readable original silhouettes, not richly animated wildlife. It is not selected for public release at this stage.

Next: full keyboard route, real embedded visibility/dialog/Collection lifecycle, deeper save invariants and comparative quality assessment. Keep `browserTested` false until that qualification is complete, despite the rendered improvement evidence. Then build the remaining 13 distinct candidates in slots 78–90.

## Batch and release state

Third batch: 37/50 built, 37/50 substantially improved, 36/50 fully browser-qualified, 13 unbuilt, 0 active integrated and 0 active live. Separate historical releases remain in the ledger. Second batch: 20 built, 20 initially improved and additional substantial round 20/20 preserved; nine historical selections, zero currently active following curation.

Main remains `fa57730f70904ae5f15e47fe0c7e55dc28144c88`. Its PR110 exact-14 catalogue gate remains in effect. Prior Switch-workspace and deployed-source checks apply to this unchanged main; no duplicate publication retry or claim of a new live release. Keep the existing schedule unchanged.
