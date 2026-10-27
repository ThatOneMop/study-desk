# Seedwake leave-one reserve — 27 October 2026

Implementation: [e6beab4bf5bedb9569efe379e5f65d85781e4673](https://github.com/ThatOneMop/study-desk/commit/e6beab4bf5bedb9569efe379e5f65d85781e4673).

## Change and basis
Source review identified a rigid choice: every move emptied its starting bed. A once-per-garden reserve now leaves one seed and distributes the rest, shortening the landing by one while retaining a future seed. It needs at least two seeds and costs the usual handful; reverse sowing still spends a gust. Full laps still deposit into the origin. Exact previews, shortage explanation, native checkbox and K shortcut are implemented. Undo restores the ability; retry and garden changes reset it.

This is source-informed work, not a rendered observation or a qualified improvement pass. It must be evaluated for meaningful timing choices versus a dominant opening.

## Evidence
27 passing tests (16 engine, 11 jsdom 26.1.0), including the original 20. All three new reserve-inclusive campaigns were driven through DOM controls and reloaded after every action. Example routes take 4/6/8 handfuls versus the earlier 5/7/8 examples; no optimality or gameplay-duration claim.

Additional coverage: retained seed and changed landing, strict type/eligibility/repeated-use rejection, reverse gust combination, multi-lap origin deposits, undo/retry, journal validation, old saves and board shape, preview immutability, keyboard ownership, pause/modal guards, shortage messaging and selection reset. Both scripts parse. Existing tests cover losses, navigation, isolated resets, malformed-save recovery and storage failure.

No rendered browser/screenshot inspection, physical touch, native-dialog verification or human enjoyment evidence. No full-repository build claim. The game remains unlisted.

## Preservation and audit
First-batch final report reread: 20 finished, nine historically source-selected, zero verified live. Second branch unchanged at 3949e3d9f8e2e9846dc4c91c436d90b19bbbd341. Current third tree contains no AGENTS.md; current Seedwake source, README/save contract and ledger were reviewed before editing.

Main observed at 55c330d9ec493afc40e81e89a371f64cbd5bd8b0; since fec6f229630e04f272e585521c0685ad5491ba72 its changes are Gummy Bay-only. The changed Gummy Bay index has no Switch workspace/playerStudy/studyBtn matches. Existing navigation and concurrent work are preserved. Prior rendering/security and publishing barriers were not retried or bypassed; no live release is claimed.

Third counts remain **20/50 built; 0 qualified improved; 0 browser-tested; 0 integrated; 0 live**. Second additional round remains **6/20 verified, 14 pending**. Next: rendered review and substantive observed improvement, plus remaining 30 distinct games.
