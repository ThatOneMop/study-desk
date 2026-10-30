# Stencil Studio input protection —30 October2026

Stencil Studio hidden-action and keyboard repair: four new regressions failed before the fix; all24 checks (12 engine,12 DOM) now pass. Hidden bridge/document state blocks reset/recovery confirmation, modal reopening and resume; visible return requires explicit resume and preserves the pending decision. Composing/editable input and focused native controls retain shortcuts; bed arrow placement still works. Existing save format and all three commission routes preserved. Syntax passes. No rendered evidence or substantive gameplay-improvement credit.

Implementation: `5e75339160f8099d7a4f80fbeab3ff32747994de`.

Validation: `NODE_PATH=../well-qa/node_modules node --test tests/stencil-studio-engine.cjs tests/stencil-studio-dom.cjs` passed24/24; `node --check games/stencil-studio/game.js` passed. jsdom uses visual-document mode; the background test explicitly changes document visibility. Four new tests were red before the source fix. Tests simulate bridge events and keyboard input; they are not browser/touch evidence.

Current main remains184368dfcf0f68352014b850e5283c6c6fe545ed; no public assets/catalogue changed. Fresh main index and candidate source audit found no Switch workspace controls. Prior live navigation verification remains applicable because main is unchanged. Pages permission failure was resolved previously; no repeat publishing attempt here.

Third totals remain24 built,0 qualified improved/browser-tested/integrated/live, exactly50 reserved slots. Second totals corrected from stale6/20 to20/20 additional-round verification and9/9 selected upgraded releases integrated/live, backed by its final report. Existing games, saves and automation unchanged.

Next: Second batch complete: preserve20 finished candidates,40 substantive passes and9 selected upgraded live releases. Prioritize rendered Stencil Studio baseline playtest, then implement a game-specific improvement based on observed play. Verify desktop/touch progression, repair choices, save/reload, restart and navigation; inspect screenshots. Do not count source-only refinements as completed improvements. Render and improve all24 third-batch prototypes; implement26 remaining distinct games and progressively integrate qualified games. Keep unfinished candidates unlisted. Retain existing hourly schedule.
