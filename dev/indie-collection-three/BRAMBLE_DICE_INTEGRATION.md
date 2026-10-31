# Bramble Dice integration — 31 October 2026

Live: https://thatonemop.github.io/study-desk/games/bramble-dice/index.html
Release main commit: `91155c64be71c4fced8a4c017ebe9e5ab3e0bf44`.

Release CI41159279264 passed129 focused checks (32+27+17+17+17+19), six desktop/touch-emulated full campaigns and six catalogue suites,55launch entries,54bundled routes/272HTML references, launcher/relaxed catalogue checks and9first-batch integrity checks. Artifact13026940293 has124screenshots, SHA256f178adad182392167de816531b7a8b58b0bddc94861c2c4ece648d8bdcba3b19; reviewed desktop-search-favourite,touch-comparison,touch-saved-return. Pages41159693932 succeeded. Live CUA confirmed comparison, reserve six transfer, turn1/full-health reload, standalone Games return, real catalogue launch retaining save, and embedded Games returning to existing collection. Live screenshot inspected. No Switch workspace controls visible.

## Changes and preservation

Added only the qualified game, its exact-save fixtures/tests, original SVG cover, credits and catalogue entries. Catalogue now55 entries(54bundled,1external). JavaScript/JSON catalogue representations match. Cache token is bramble-20261031. Main was re-read before its fast-forward from4689624c1cc3df8f3cd9a820fab6d6817cf79d3b; unrelated source and saves were retained. Existing Games/Collection, search, grouping, sorting and favourites remain; source checks and deployed UI show no Switch workspace controls. Historical Pages permission issue is resolved; no deployment workaround or automation changes.

## Issues caught before main

Initial CI caught a missing parallel JSON catalogue update; fixed catalogue and exact-count regression. Second run caught over-escaped test syntax for a literal positive delta; corrected assertion. Third run caught a real embedded navigation bug: the Games link nested a launcher. It now posts the established same-origin study-collection message when embedded while preserving the standalone href. Final full run passed before main advanced. This fix is also synchronized to development source.

## Scope and next work

Third collection:24/50built,6improved,6browser-tested,6integrated,6live. Second collection:20built,20additional-round improvements complete,9selected/live. First collection preserved. Bramble Dice has three authored encounters; no hours-of-content claim. Automated desktop/touch emulation and agent visual review are not human-enjoyment or physical-device evidence. Live verification covers an opening reserve turn, saves and navigation; full campaigns passed in CI and earlier rendered play.

Next: Needlepath(slot47) rendered core-loop assessment and a substantive upgrade. Keep unfinished games off the public catalogue.
