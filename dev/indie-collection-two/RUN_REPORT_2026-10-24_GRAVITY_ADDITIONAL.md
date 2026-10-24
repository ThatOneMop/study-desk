# Borrowed Gravity additional improvement — 24 October 2026

Implementation: [dca02c4](https://github.com/ThatOneMop/study-desk/commit/dca02c401239e0d9060a7037ea9139a23597c82d). Branch: `indie-collection-two-dev`.

17/20 implemented and initially improved/tested. Five additional upgrades are verified, including this Borrowed Gravity pass. Three candidates remain unbuilt. No final selection, new integration or verified live release this increment. Thirteen earlier second-batch versions remain integrated by concurrent work on main.

## Change and evidence

Rendered baseline play borrowed the ceiling pull and examined the existing traversal and restart controls. Existing operator notes and source confirmed that scanner loss required a whole-attempt restart. The new field anchor creates a choice about how far to explore before securing progress: set or move it while resting on a safe surface, then recall once, even after collision. Position, pull and samples revert; time and transfer effort do not. Later samples return to the room. Anchors near scanners are rejected and unsafe recalls cannot teleport into a scanner. No extra levels, timers or third-party assets were added.

26 engine and 16 DOM checks pass, including original four galleries, a natural moving-scanner loss/recall, samples reverting, effort retained, single use, retry, old-save migration and malformed-anchor rejection. First-batch selected source hashes, bundled assets and twenty-slot/additional-round gates pass.

Cloud desktop play set a ceiling anchor, returned gravity, recalled and reloaded with the charge spent. A separate 390px walkthrough set a floor anchor, borrowed upward pull, recalled, paused and reloaded. Screenshots were inspected. This is agent UI verification, not human enjoyment evidence or physical-device testing.

[CI 40057078381](https://github.com/ThatOneMop/study-desk/actions/runs/40057078381) passes 400 engine + 285 DOM = 685 checks. Borrowed Gravity’s expanded native desktop/touch route passes anchoring, natural scanner loss, saved anchor reload, recall, spent-charge reload, a second loss/retry and all original campaigns/navigation/recovery. Other collection-wide browser groups are still pending.

34 Borrowed Gravity screenshots are retained in [artifact 12546132023](https://github.com/ThatOneMop/study-desk/actions/runs/40057078381/artifacts/12546132023). Inspected desktop-anchor-ready, touch-anchor-recalled and touch-anchor-spent-reloaded. ZIP SHA256: `db75395ce29fcc44023b1aa3eaac839fda5cd2f42d470158fe74845dd49aacf2`. Native Chrome 155.0.8059.39. An additional ordinary-input engine walkthrough completed gallery one after recall, preserving elapsed effort and unlocking the next room.

Four short authored rooms remain a depth limitation. This pass adds recovery planning, not a long campaign. Quality selection is deferred until verification and full-slate comparison.

## Preservation and next steps

First-batch FINAL_REPORT was read from its development branch: 20 finished, nine selected at that baseline. No first-batch source, save keys, catalogue entries or tests were edited. Current main is 0f295c9795590f96a90c6ceb8c1d165e77fcd3a7; concurrent catalogue, requested-games and Gummy Bay work and unrelated untracked files were preserved. Source push used expected-head protection from 57ebe6633811d006b521d7b0256f720a4620cc11.

The already investigated GitHub Pages permission failure remains unresolved; no unchanged deployment retry was made and no live game URL is claimed. This upgrade is development source only. Continue Static Orchard and other unchecked candidates, including the three missing implementations. Completion conditions are unmet; the task remains active.
