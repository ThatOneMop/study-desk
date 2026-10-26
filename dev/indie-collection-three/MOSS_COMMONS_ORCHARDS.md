# Moss Commons orchard refinement — 26 October 2026

Source: `b77478fc32b11971cb95ca2c3c4e490101a76d8e` on `indie-collection-three-dev`.

## Source-observed weakness and change

Food production previously depended on irrigated gardens. Occupying an empty neighbouring meadow could never reduce an existing building's yield. This observation comes from source and engine/DOM review, not rendered play.

Orchards now cost 3 timber and provide 6 food while at least two orthogonal neighbours remain empty, buildable meadow. With less space they provide only 1 food. Rocks and board edges do not count; fertility and nearby wells do not modify this yield. Paths and other buildings consume the orchard's open space, introducing a choice between compact irrigation and preserving meadow.

The build preview reports the full resulting capacity and explicitly names any orchard that will lose yield. Orchard plot text and accessible labels expose current food and open-neighbour counts. Selecting an orchard explains its requirement. Undo restores the old layout and yield. Original CSS tree art and handbook rules are included, but appearance is unverified.

## Evidence

Fourteen tests pass: nine engine and five jsdom 26.1.0. Original garden routes still cost 17 timber on each site. Distinct tested orchard layouts use one orchard, two wells and three houses for 16 timber; they finish with 4/3/2 timber remaining. These establish alternative playable routes, not optimality or human enjoyment.

Coverage includes every campaign win/unlock, save/reload after every build, crowding warnings before spending, low-yield orchard reload, undo yield restoration, rock/edge exclusions, old v1 journal compatibility, record improvements, loss/retry, pause/modal/parent guards, reset isolation, corrupt recovery and quota failure. Both gameplay scripts pass syntax checks. Dialog APIs are simulated.

No rendered play, screenshot inspection, physical touch/native keyboard validation, full repository build, or verified live route. The orchard's efficiency could overshadow irrigation; rendered balance assessment is still required. This is pending source refinement and earns **zero** completed improvement credit.

## Scope and next work

Third batch remains **12/50 built; 0 improved/browser-tested/integrated/live**. Second additional round remains **20 source upgrades, 6 verified, 14 pending**. The first-batch final report was reread from its development branch; it records 20 finished and nine selected source entries, with no verified live URLs.

Main `dc88f09cfb30cae92e3f0e9afe65cd2f7ddaf4f7` and second branch `3949e3d9f8e2e9846dc4c91c436d90b19bbbd341` are unchanged. Prior workspace/publication findings were not retried; no browser-policy workaround was attempted. Only Moss Commons source/tests and third-batch documentation change. Public catalogue, previous games, Gummy Bay and saves are preserved.

Next: rendered desktop/touch play of both strategies and screenshot inspection; improve based on observed balance, control or progression weaknesses. Verify saves, loss/undo/retry, restart and real navigation before catalogue selection.
