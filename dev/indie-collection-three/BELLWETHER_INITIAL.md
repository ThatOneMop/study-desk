# Bellwether initial implementation — 27 October 2026

Source commit: [c83cf16c1cae29e2c1987273469ef11a91c91be2](https://github.com/ThatOneMop/study-desk/commit/c83cf16c1cae29e2c1987273469ef11a91c91be2).

## Delivered

Slot 57 is now a playable source prototype, not an unassigned slot. Bellwether uses positional herding: walking near sheep pushes them away; whistling at a distance pulls them closer. Two sheep that select the same cell wait. Shelter arrivals remove sheep from play. Original SVG sheep, dog, rocks, grass and a golden gate give the game a pastoral identity. No third-party assets or runtime packages are required.

Three compact authored meadows explore open herding, a narrow passage and a split three-sheep flock. Players preview all resulting positions, then confirm; keyboard, buttons and adjacent-square taps share the same actions. Undo/retry and shortest-route records support experimentation without timers, damage or permanent losses. Saves validate a bounded action journal, preserve unreadable data until recovery, warn about unavailable storage and isolate reset to this game.

This is distinct from the existing dice, drawing, network, construction, ice-slide and courier candidates: the movable flock reacts to the dog's relative position rather than following a programmed route or being pushed directly.

## Evidence

- 16 tests pass (8 engine, 8 jsdom 26.1.0); both gameplay scripts pass syntax checks.
- Three complete campaigns via actual DOM controls, including save/reload after every committed action. Forecasts never mutate saves.
- Breadth-first graph searches independently verify the fixture routes at 11/9/17 steps. Search generated 3,267 / 963 / 67,412 states before finding each shortest route. This does not measure enjoyment or content hours.
- Pressure and whistle range boundaries, collisions, occupied starting squares, sheltered sheep, invalid/no-response actions, arrival undo, slower replay record preservation and sequential unlocks.
- Defensive save validation, post-win action rejection, journal-cap recovery, corrupt-save preservation/recovery, storage-quota warning and unrelated-save isolation.
- Opening/pause/dialog guards; foreign-parent messages ignored; trusted parent hiding pauses and clears previews. Keyboard shortcuts respect native form/button/link/summary controls.
- Simulated scaled SVG taps account for visible border widths. Unique IDs, board descriptions, local asset paths and stylesheet parsing checked. Responsive/reduced-motion rules exist; their rendered appearance remains unverified.

The first DOM run had two test-setup failures: its supposedly unresponsive opening whistle correctly moved a sheep, and the shared bridge was absent from the partial local checkout. The test now reaches a genuinely unresponsive state, and the unchanged bridge was fetched from the development head. Final tests pass.

## Preservation and audit

Started from development head cc739d30ed1130dce05e696f4afcb8c863c2a378. The only source additions are Bellwether, its tests and route fixture; the catalogue, bridge, first/second collections and existing save formats are untouched.

Latest main observed: a4e735c9a1dd46e6f75af0370c181e36f76267ba. Its single commit since e41ce7c5904b9bbe5fb3031c018dd57405ece275 changes Gummy Bay and credits. Launcher index/app are unchanged; the changed Gummy Bay HTML and new Bellwether shell contain no Switch workspace label. This is a source audit, not new desktop/mobile navigation evidence.

## Qualification and remaining work

| Scope | Built | Improved/verified | Integrated | Verified live |
| --- | ---: | ---: | ---: | ---: |
| Third batch | 17/50 | 0/50 | 0/50 | 0/50 |
| Second additional round | 20 source upgrades | 6/20 rendered verified | Final selection pending | Not newly verified |

Exactly 50 third-batch slots remain in the ledger, with 33 unassigned. Second-batch initial implementation/improvement remains 20/20; the 14 remaining additional upgrades still need rendered verification.

Rendered access remains blocked by the previously recorded security-policy rejection. It was not bypassed or retried; jsdom does not qualify as rendered play, screenshot review, touch testing or an improvement pass. Bellwether remains unlisted and has no published game URL. Assess compass tie-breaking, exact-preview satisfaction, the easier second meadow, native focus, actual mobile target sizes and visual readability before selecting an improvement.

Publishing was not retried. The previously recorded GitHub Pages configuration barrier remains unresolved; the owner action is Settings → Pages → Source: GitHub Actions, followed by the authorized release workflow and actual live-route checks. A development commit is not a live release. The first-batch report still records 20 finished, nine source-selected and zero verified live URLs.

Next: naturally render/play this prototype when access is available, implement a substantial change based on the observed weakness, verify progression/recovery/saves/navigation/layout, and only then consider catalogue integration. Continue independent source work on the remaining candidates in the meantime.
