# Reedbreaker qualification — 31 October 2026

Slot 48 is built, substantially improved, rendered/browser-tested and selected. Catalogue integration and live release are pending the isolated promotion check.

- Gameplay improvement: [817116f9](https://github.com/ThatOneMop/study-desk/commit/817116f9ed0a7d3c64ba6f4e50ee7083300b749b), tactical undo plus named beetle responses, prompted by the rendered east-brace damage and restart-only recovery weakness.
- Hidden confirmation safeguard: 39236cd14b9c4984753c9f39dfe941e844bfee60.
- Native Escape repair: 159b330f9d8916121ebd726b5a741616f2f58bf5. The first Chromium run found controls left disabled after a dialog closed. Interactive reproduction confirmed it; rendering on the native close event fixes it.
- Successful qualification: [run 41171094555](https://github.com/ThatOneMop/study-desk/actions/runs/41171094555), job124449018270, 38 engine/DOM checks and 24 rendered bank clears (four route families × three banks × desktop/touch emulation). The unsuccessful preceding run41170914544 is retained as defect evidence, not counted as a pass.
- Artifact13030713765, SHA256 c41cf1f16f4cdd747f531ae1664c0d91d909c55527c95013182d3be3d0a0fba8. Inspected desktop-brace-bank-1, touch-exposed-brace, touch-defeat-rewound and touch-vault-bank-2 images. Boards, numbers, selected modes, response notes and touch confirmation fit the390px viewport; vertical scrolling remains.

Interactive browser play also completed all three banks, inspected the final counter forecast, committed/reloaded the final win, played an eleven-turn loss, reloaded/undid defeat and verified Escape no longer locks controls. CI verifies exact predictions and saves, records and unlocks, win/loss undo, retry, native keyboard/touch actions, modal/pause controls, actual iframe hide/show and Collection messages, scoped corruption recovery and quota failure. CI route execution is not evidence of human enjoyment; touch is emulated, not a physical device. Repository asset/syntax checks and all nine selected first-batch source hashes pass.

Selection: deterministic spatial combat adds variety alongside dice allocation, embroidery routes, sailing, packing and printing. Dash, hook, vault and directional counter compete for energy and position; the five-turn first-bank brace route trades shield for speed compared with the eight-turn full-shield dash route. Undo and explanations support relaxed experimentation. Three compact authored banks remain a material depth limit; alternate routes are not extra levels. No duration claim.

Promotion candidate: 7599ac67644b7e041ab9083f0a64b68b3ce46fbf. Counts:24 built /8 improved /8 browser-tested /7 integrated /7 live. Second batch remains20 built/improved/additional-round-verified and9 selected/integrated/live. Unfinished sources stay on the development branch. No automation settings changed.
