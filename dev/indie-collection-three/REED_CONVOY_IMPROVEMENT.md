# Reed Convoy improvement — 5 November 2026

## Observed weakness and upgrade
The rendered baseline's three routes all allowed one full haul (17/17/15 actions). Although partial unloading worked, it was optional and did not create a strong load-planning decision.

Completing an open-water route now unlocks its Shallows contract. The east approach to HOME permits at most three boats; the south approach permits four. A full five-boat convoy cannot return through either. Players choose which one or two crates to bank first, then route the shorter convoy to the remaining cargo. The shortest normal-action routes found are30/22/22 actions with two unloads each; these are solver measurements, not content-duration claims. Free blocked moves and restart keep the pacing relaxed. There are no added timers or repetitive level counts.

The UI marks both shallow approaches, explains their limits in full-size text, and confirms mode changes. Original routes and their best records remain separate from new persistent shallow navigation seals. Restart and next waterway preserve both. Existing v1 saves migrate to open-water mode with their state/records retained.

## Implementation and evidence
Implementation: [2d872e31d7218771a30a6480c6a3bec386cef6a2](https://github.com/ThatOneMop/study-desk/commit/2d872e31d7218771a30a6480c6a3bec386cef6a2).
CI41952373995 passed six engine checks and twelve rendered deliveries (open and shallow routes on desktop1280×1000 and touch-emulated390×844), mandatory partial unloading, mode confirmation/cancel, separate saved seals, exact per-action reload, records/restart, Space/arrows/Escape, pause, corrupt/quota saves and Games navigation. No page errors or horizontal overflow. Repository checks passed74 bundled routes/286 references, source syntax/Freedoom structure and nine selected first-batch integrity checks. Artifact13381512118 was downloaded and SHA256 verified:866053f2aee17e7377b3fdff70cefd4b9cad8c220b8f9989ab2e773731d9f89c. Inspected desktop-shallows-0 and touch-shallows-2: approach limits, completed routes and separate seals are visible; full-size guidance wraps without clipping. Phone requires vertical scrolling. Automated rendered testing and agent visual inspection are not human enjoyment or physical-device evidence.

[Passing workflow](https://github.com/ThatOneMop/study-desk/actions/runs/41952373995)

## Assessment and remaining work
This is a substantial route/load mechanic based on the observed baseline weakness, not a cosmetic pass. Three authored waterways still limit replay depth. Full keyboard-only campaigns, embedded lifecycle/navigation and stricter save-history consistency remain qualification work. A player can pick up too much cargo and need to restart; the full-size brief warns that all five boats cannot return through the shallows. No human enjoyment, physical-device, accessibility-certification or hours-of-content claim.

## Preservation
Exactly50 third-batch slots remain:48 built,48 improved,47 fully qualified,0 active integrated and0 active live. Slots89–90 remain unbuilt. The second collection's20/20 additional improvement round remains recorded and unchanged. Main remains f6164b75b93c4a323a7c8dfedd5f3711f7719437, preserving the curated catalogue and concurrent Arcade/Numberworks/Packworks/Gummy Bay work. No public release or schedule change. Current tree still contains no AGENTS.md or first-batch FINAL_REPORT.md; previous baseline evidence is retained without inventing missing files. The unchanged publishing/Switch workspace investigations were not repeated.
