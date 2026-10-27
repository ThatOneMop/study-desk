# Reedbreaker Vault — 27 October 2026

Source commit: [5351ad11cf5d8dec4fe0bf044fc060afc409217b](https://github.com/ThatOneMop/study-desk/commit/5351ad11cf5d8dec4fe0bf044fc060afc409217b).

## Gameplay change

Source inspection identified a missing positional choice: the ranger could walk, shove, pull or counter, but could not cross a beetle without moving it. Vault spends one energy to jump over an adjacent beetle onto the free land immediately beyond it. The beetle stays put and skips its response. Every other beetle responds normally, so a valid vault can still cause damage or defeat.

Water, rocks, another beetle, no adjacent target or insufficient energy reject for free. Button and V-key selection work with the existing direction controls, immediate movement and optional planning. Whole-turn forecasts include all final positions, energy, shield and outcomes. The v1 journal shape, key, old behavior and records remain unchanged.

## Tests

31 tests pass: 17 engine and 14 jsdom 26.1.0. All 24 pre-existing tests are retained. New checks cover exact displacement/energy, untouched vaulted target, other-enemy retaliation and loss, mutation-free blocked actions, malformed directions, terminal-state guards, all-bank progression and retry. Vault-assisted routes finish in 7/8/7 turns with 4/5/3 shield and save/reload after each action. These are feasibility routes, not claims of optimal play, enjoyment or longer content.

UI checks cover the button/V shortcut, forecasts, planning selection without mutation, exact future-board positions, cancel/confirm, pause, campaign reload, progression, retry and unrelated-save isolation. Both gameplay scripts pass syntax checks. No full-repository build or rendered test is claimed from the partial workspace.

## Preservation

Development base: 9607618243a7a68619f99c83625cf3b457e98f34. Remote source, tests and ledger were re-read before editing; no AGENTS.md was present in the tree. The first collection's report still records 20 finished, nine source-selected and zero verified live URLs.

Main observed at 73067ee92704ca7a50c802f67543c0273eaa1b0b. Changes since f81a5ff53c44f3e6c1ee995537e19e1da304e52e are Gummy Bay and credits. Launcher index/app are unchanged; inspected diffs contain no Switch workspace text. The existing Games link is preserved. Main, catalogue entries, other games and their saves are untouched.

## Pending qualification

Third batch remains **17/50 built, 0 improved, 0 browser-tested, 0 integrated, 0 verified live**. Exactly fifty slots remain, 33 unassigned. Second additional round remains **6/20 rendered verified, 14 pending**.

This is a source-led refinement, not a rendered-play improvement pass. The existing security-policy rendering blocker was not bypassed or retried. Natural desktop/touch play and screenshot review must assess whether the fifth action adds useful tactics without crowding the controls, along with energy balance, landing feedback, navigation and saves. Keep the prototype unlisted.

Publishing was not retried; the previously recorded Pages configuration barrier remains unresolved. No published game URL or live release is claimed. Continue independent candidate work while preserving the pending rendered review and final selection requirements.
