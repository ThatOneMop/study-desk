# Study Desk discovery update — 26 October 2026

Games now open by default. Flashcards remain available through the explicit #study navigation route. The home page adds three lightweight illustrated feature cards, recently opened games, play-style filters and a game suggestion dialog that honours the current search and filters. Suggestions exclude external links, avoid immediate repeats where possible, and do not mutate saved preferences until a game is actually launched. The recent shelf distinguishes the still-open session from games that need to launch again.

## Verification

- Existing shell and bridge regression checks passed after updating the default-route expectation.
- Discovery checks passed default navigation, play-style/search combinations, empty-state recovery, filtered suggestions, rerolls, external exclusion, movie/TV routes, recent/favourite persistence and damaged preference preservation.
- Existing launcher navigation, loading, switching, media and relaxed-collection checks passed. The relaxed-collection reset expectation now matches the intentional ungrouped default.
- All 64 catalogue launch routes passed their shell tests, including pause/resume and study navigation. This does not execute all game engines.
- All 63 bundled game entry points and 266 local HTML asset references exist.
- Browser inspection confirmed the desktop design, combined filtering, suggestion dialog, single-result reroll disabling, Autumn Drift launch, one leaf collected, pause and recent-session return.
- Physical mobile devices, multiplayer, all-game rendered QA and full campaigns have not been verified in this pass.

## Product priorities

1. Audit the strongest existing games through actual rendered play; fix loading, controls, save recovery and progression before promoting them.
2. Decide and explicitly configure classmate access. The current main Site is owner-only; this update preserves that audience.
3. Make game discovery useful: accurate genre/input/session information, real screenshots and honest readiness labels. Do not count procedural variation as verified playtime.
4. Develop shared challenges and private friend play with working server state, then verify the complete join/play/rejoin flow. Maintain reporting and blocking for social features.
5. Keep requests useful by collecting real votes and publishing tested winners. Movie and TV tabs currently provide viewing guides, not in-site commercial playback.

No automation schedules, game saves, catalogue entries or access policy are changed by this release. Existing prototype verification and GitHub Pages configuration work remain outstanding; the existing Sites publication path is used for this update.
