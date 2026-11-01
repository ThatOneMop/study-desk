# Seedwake route rehearsal — 2 November 2026

Implementation: 53dee6eac0ee208194923edbaab6485f58df9678 on indie-collection-three-dev.

Observed weakness: one-move forecasting could not explore a longer reserve/deferral continuation without changing the saved garden and undoing its actions. Added a temporary branching route, full landing/seed/flower log and resource comparison. Plant route saves the legal journal; discard/reload restore the planted anchor. Existing v1 saves and prior games are untouched.

39 local engine/DOM checks pass. Desktop browser play completed a five-handful deferral route, returned to the anchor, completed a four-handful reserve route, planted it and verified record4/second-garden unlock after reload. Native Space and retry Escape exercised. Desktop screenshot inspected: distinct planning panel, readable flower/resource deltas and separate commit/discard controls. Full desktop/touch suite is CI41314535262; screenshots and outcomes pending review.

Third-batch counts remain 24 built /19 qualified improvements /19 browser-qualified /19 integrated /19 live. Seedwake is not public. Second collection remains20 built,20 additional-round improvements,9 selected/live; original collection preserved. Main observed 6e3b9eb9f99b8d4994d9dc6ff71834284f3840b9. Publishing was healthy in the preceding Fallow Table release; no unchanged configuration retry was made. No automation changed.

Next: review CI artifacts, resolve failures, qualify, then main-based catalogue regression and live verification. Continue61–64 and26 unbuilt slots65–90. No unmeasured content-duration claim.
