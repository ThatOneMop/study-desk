# Gummy Bay continuation — v116

## Transport progression

Harbor Motors now offers two additional drivable fleet types after the original delivery van: Bay Bee compact ($1,600, level 3) and Harborline estate ($3,400, level 5). They have distinct original procedural bodies and acceleration, maximum speed, reverse speed and steering limits. These are actual selected driving profiles, not decorative parked vehicles. Existing road speed limits still apply. The original van's $750/level-2 price and handling remain unchanged.

The shared fleet selection and owned unlocks persist as optional version-3 fields. Old saves without them still use the original van. Invalid/unowned selections fall back to the van. Purchases use the selected cash/card balance, require clear garage access and reject duplicate ownership. Players must park before changing the fleet, including a connected partner. Host validation applies peer pose freshness and sequence replay protection to both new commands.

Alternative bodies fit within the original conservative collision envelope. This deliberately retains the existing swept collision and side-door safety rather than allowing a new body to bypass walls. The compact does not yet use a tighter collision envelope, and no extra cargo capacity is claimed for the estate.

A visible exit button provides a touch-accessible route through the existing safe exit action. It is disabled above the stopping threshold and hidden outside active driving or while menus are open. F remains available.

## Validation

See `docs/evidence/v116-final-tests.json` for all exact commands and results. Tests cover legacy fallback, purchase prerequisites, price/payment selection, duplicate and distant transactions, driving/peer locks, save reload, disconnected guests, peer freshness/replay, model dimensions/resource stability and exit-button states. Existing collision, parking, shop and economy regressions remain in the full suite.

No rendered WebGL, iPhone handling, shader or mobile-performance acceptance is claimed. Distinct handling parameters are implemented; subjective feel awaits real gameplay footage. The broader 160-point overhaul remains incomplete.
