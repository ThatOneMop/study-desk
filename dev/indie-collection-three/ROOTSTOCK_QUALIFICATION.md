# Rootstock qualification — 4 November 2026

Rootstock (#80) is **qualified reserve**, with no catalogue or live release change.

## What changed

The prior substantial improvement remains the earned paired orchard: keep both complementary requested cultivars alive within six pots, with separate persistent seals, trait-dependent tree art and a horizontal phone nursery. This run qualifies that work; it does not count another substantive improvement pass.

Save loading previously accepted internally inconsistent progress. It now rejects paired mode without an ordinary completion, seals without matching records, absent starter discoveries, more nonstarter plants than crosses, zero completion scores, pending offspring without a cross or with identical parents, and completion records exceeding current crosses. Valid legacy saves retain their migration path and storage key. Retry after destructive pruning restores stock while preserving discoveries and earned records.

Implementation: [ca10a6d](https://github.com/ThatOneMop/study-desk/commit/ca10a6d554006705e7a2511d0e234426892e93f9). Qualification workflow wiring: [4987910](https://github.com/ThatOneMop/study-desk/commit/49879106ca0b40bd555037335cf0044cb0ba82ff).

## Verification

[Final successful CI run41758598239](https://github.com/ThatOneMop/study-desk/actions/runs/41758598239) tested head49879106ca0b40bd555037335cf0044cb0ba82ff:

- Eight engine checks, including inconsistent paired/progress saves and retry after pruning away needed traits.
- Twelve rendered pointer/touch deliveries across all three ordinary and earned paired requests at desktop1280×1000 and touch-emulated390×844.
- Four additional complete keyboard deliveries: first ordinary and earned paired request at both viewport sizes. Tab/Enter/Space/Escape, exact per-action state/reload, confirmation cancellation and restart retaining seals.
- Phone carousel scrolled to another parent; selecting it retains the scroll position.
- Actual game and bridge in a controlled same-origin iframe: hidden restart, paired/ordinary transition and corrupt-save recovery confirmations cannot write; hidden legal gameplay action cannot write; returning visible remains paused until explicit resume.
- Collection message, unrelated save sentinel, embedded phone width, no overflow or page errors.
- Baseline suite also covers pruning, discard, record/restart persistence, corrupt/quota storage handling and Games navigation.
- Repository checks:74 bundled routes/286 asset references, syntax/Freedoom structure and nine selected first-batch integrity checks.

The first run41758359728 passed its existing checks but omitted the new qualification script because workflow wiring was missing. Inspection of its logs caught the omission;4987910 wires the script and the final run above includes its explicit PASS output. The incomplete run is not full qualification evidence.

Final artifact13289022343 contains16 screenshots. Downloaded archive SHA256 was verified:
`c954a17bf54a8c28cce89cd7b37c49b095a2cc5f4f05cf0623de01e4974f5d6c`.
Opened and inspected `desktop-keyboard.png` and `touch-shell.png`: desktop shows the paired completion and saved four-cross record; phone shows readable request traits, accessible parent controls and a contained horizontal nursery. Inspection does not imply every artifact image was reviewed.

## Assessment and limits

Paired stock retention creates useful breeding-line and nursery-space decisions; the first two paired routes require pruning. The presentation communicates traits and the phone carousel reduces vertical travel. **Three fixed request pairs still limit replay depth**, so Rootstock remains reserve rather than entering the public catalogue.

These are automated rendered routes and agent screenshot inspection, not human enjoyment research, physical-device coverage or measured content-duration evidence. The controlled iframe verifies real bridge behavior; it is not a public catalogue launch. The game is a stylized inheritance puzzle. No loss screen applies; pruning away useful traits is recoverable with retry.

## Durable counts and release state

| Collection | Built | Initially improved | Additional round | Qualified | Active integrated/live |
| --- | ---: | ---: | ---: | ---: | --- |
| Second |20|20|20/20|See existing second-batch report|0/0 after main curation; historical9 releases retained |
| Third |40/50|40/50|Not a separate requirement|40/50|0/0; historical release evidence retained |

Exactly50 third-batch slots remain in the ledger; slots81–90 are unbuilt. Next: implement distinct candidate81, play its rendered baseline, then improve and qualify it.

Fresh main remains `e2ba9d1a221da8cdb3180a7f372a54743f6c52c2`; development was re-read at4987910 before this record. Preserve PR110's exact14 current catalogue and concurrent Gummy Bay/requested-GitHub-games work. No publication configuration change or new live-route verification was performed in this qualification run; unchanged previous findings are not counted as new work. No live Rootstock URL is claimed. Existing release-scope reconciliation remains outstanding for qualified selections.

The current development tree contains neither AGENTS.md nor dev/indie-collection/FINAL_REPORT.md. Historical first-batch20 finished/nine selected evidence is preserved without recreating a missing report. Second-batch20/20 additional-round evidence remains intact. No automation was changed or paused; the overall task is incomplete.
