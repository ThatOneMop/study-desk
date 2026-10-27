# Thimble Fair

Original open-information auction and crafting strategy game for third-batch slot 62. Choose one of three thread bundles at each of eight auctions, manage a twelve-coin purse against two visible rival bids, then deliver three different textile commissions. Each delivery returns one coin without using an auction. Priority on equal bids alternates. Buying a useful premium bundle can finish sooner; paying extra for the same bundle only depletes the purse. A losing bid or pass keeps coins but forfeits that auction.

This is lot selection, cash-flow planning and recipe assembly. It is distinct from the existing barter market, spatial drafting, sowing and paper-folding loops. All bids and upcoming lots are visible: there is no hidden auction randomness or real currency. The original SVG spool illustrations, woven CSS swatches and striped market awnings need no external assets.

## Play and progression

Choose a lot, set 0–6 coins (or Set minimum winning bid), inspect the exact outcome, then Place bid. Make & deliver consumes the stated recipe once and refunds a coin. All three commissions win; after the final auction, eligible deliveries remain available before a loss is declared. Undo works after results. Replay preserves best results. Best results favour fewer auctions and then more remaining coins.

Fair numbers 1–9999 deterministically vary bundles, prices, positions and colour allocation. These are procedural variations of one compact game, not thousands of separate campaigns or a duration claim. The whole schedule can be inspected before a purchase. A bounded list retains the last twenty created/improved fair records. Different fair numbers are a replay option, not a numerical progression grind.

There is a conservative affordable route: the two-thread lot in each of the first six auctions costs at most two coins. Those six lots jointly provide four threads of each colour, while the three recipes together consume three of each. This route needs at most the starting twelve coins even before delivery refunds. Tested premium routes for fairs 1, 42 and 314 finish after three auctions with 5, 4 and 8 coins, respectively. These are automated example routes, not human enjoyment evidence or a claim about content length. The game is deliberately a short fair; longer-term depth remains unevaluated.

## Hosting and controls

Serve the repository root and open games/thimble-fair/. Plain static HTML/CSS/JavaScript, no production build or dependency. Study Desk bridge loads first; Games returns to ../../index.html#games. The prototype is unlisted.

Native controls support Tab/Enter/Space. On page or lot focus, 1–3 select lots, B bids, M sets the minimum and Z undoes. Other controls retain their native keys. Input is guarded during pause, confirmation dialogs, document hiding and trusted same-origin parent hide messages. Restart, new fair and reset are confirmed. No clock or real-time input pressure.

Source defines 44px minimum native controls, labelled thread counts as well as colours, desktop three-column stalls, and single-column stalls/commissions below 680px. These are implementation properties, not inspected screenshots or actual touch evidence. There is no audio or purchase animation yet.

## Saving

The isolated study-desk-thimble-fair-v1 key contains {version:1,seed,moves,records}. The journal is at most twelve actions: eight auctions, three deliveries and one optional exchange. Replay validates exact action shapes, balances, recipes and terminal states. Records are bounded and validated; winning journals must have a corresponding result. Selection, tentative bid, pause and disclosure state are transient. Unreadable saves survive temporary play until explicit recovery or reset. Storage errors allow a temporary session. Reset affects only this game's key; other game saves are untouched.

## Verification and next work

With jsdom 26.1.0 available through NODE_PATH:

    node --test tests/thimble-fair-engine.cjs tests/thimble-fair-dom.cjs

21 tests pass: 10 engine and 11 DOM. Coverage includes deterministic markets and bounded offers; an affordable completion across 73 seed samples; three full premium routes with every action driven through controls and reloaded; ties, overbids, losses, payouts, recipe conservation, late delivery after auction eight through a natural eleven-action journal, invalid actions and bids, unaffordable previews, undo/retry, best-result comparison and bounds, new fair confirmation, native/shortcut focus guards, pause/dialog/parent/document hide guards, corruption recovery, quota errors, scoped reset and Games link resolution. Route fixtures are tests/fixtures/thimble-fair-routes.json. Both scripts parse; local assets, unique/used IDs and bridge-first loading pass; no Switch workspace control is introduced.

No rendered browser play, screenshot inspection, native touch/dialog verification, full-repository build or live verification occurred. The existing browser security-policy blocker was not retried or bypassed. This candidate has zero qualified improvement passes and is not selected, integrated or live. Next: render and play both affordable and premium strategies on desktop and mobile; assess whether open bids make the auction engaging, whether budget pressure and coin refunds create worthwhile choices, and whether target/missing-thread explanations need revision. Implement a substantial improvement based on that observation before qualification.

## One thread exchange (pending rendered review)

Source inspection found that surplus thread could not help when one recipe colour was missing. Once per fair, give two threads of one colour for one of another, without advancing auctions or spending coins. This creates a material-efficiency tradeoff: it can avoid another purchase but consumes an extra thread and may leave another commission short. It stays available after auction eight when eligible. A loss is declared only when neither a delivery nor an unused exchange is available; an unhelpful exchange may still end in a loss.

Native Give 2 / Receive 1 selectors preview the resulting basket without commitment. The button obeys pause/modal guards. Undo restores the basket and exchange allowance. Replay/new fair restores the allowance. The optional {type:'exchange',from,to} journal action uses the same v1 save key. Old journals and records remain valid with unchanged purchase/craft outcomes; no legacy state field is required. An old final-auction basket with surplus may now have this new recovery opportunity.

28 tests pass (14 engine, 14 jsdom), including all original 21. Added tests cover conservation and costs, invalid/double trades, three exchange-inclusive routes with every action reloaded through controls, pure forecasts, pause/modal guards, undo and natural twelve-action final-auction rescue. Example exchange routes finish fairs 1/42/314 in three auctions with 5/3/6 coins; they are alternate routes, not uniformly better than original 5/4/8-coin examples. No optimality or human enjoyment claim.

This is a source-informed refinement, not a rendered-qualified improvement. Rendered play and screenshot inspection must evaluate whether the exchange creates useful decisions and whether its extra controls burden mobile onboarding. The game remains unlisted.
