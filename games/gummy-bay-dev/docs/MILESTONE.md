# Reliability and integration milestone — audit
Base v16, source 2e26a64855fae0c3d8514b991ebe8651bfa928c1.

P0 Save loading: parse/normalization failures fall through to a fresh state and immediately save, risking destruction of malformed but recoverable progress. Completion: reject invalid slots without writing; retain pre-import backup; validate inventory arrays and world state. Unit-test failure paths.
P0 Production: completion spans nested wrappers and batches call per-item actions. Completion: shared all-or-nothing inventory transaction for make/pack/mix/batch with final supply validation and reservation protection; test no partial changes.
P1 Starter loop: old notebook instructions disagree with later additions. Completion: one authoritative checklist with actual purchases and recoverable funding; base economy tests retained.
P1 Workshop: stock state labels inconsistent and equipment additions overlap old tabletop props. Completion: truthful status UI, explicit stock summaries, clean duplicate surfaces/props where identifiable; geometry tests.
P1 Deliveries: information scattered across threads. Completion: concise active-order cards with exact quantities, price, deadline and tracking.
P1 Integration: Study Desk still bundles v12. Completion: sync current game, retain bridge before module, validate relative paths and publish collection separately.
P2 Visuals: reference reviewed, real rendered audit unavailable. Completion is blocked on supported browser access; no screenshot/FPS claims.
P2 Physical workers/crowd navigation: current timer automation retained, clearly labelled. Full spatial logistics and browser navigation validation remain beyond this verified milestone.
