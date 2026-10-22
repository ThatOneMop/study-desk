#!/usr/bin/env python3
"""Reject unfinished, untested or prematurely public indie finalists."""

from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
LEDGER_PATH = ROOT / "dev/indie-collection/ledger.json"
FINALISTS_PATH = ROOT / "dev/indie-collection/finalists.json"
REQUIRED_TASTES = {"fishing", "colony", "manual", "roguelike", "action"}
EXPECTED_FINALIST_COUNT = 9


def fail(message: str) -> None:
    raise AssertionError(message)


ledger = json.loads(LEDGER_PATH.read_text())
manifest = json.loads(FINALISTS_PATH.read_text())
slots = {slot["id"]: slot for slot in ledger["slots"]}
finalists = manifest["candidates"]

if len(finalists) != EXPECTED_FINALIST_COUNT:
    fail(f"expected {EXPECTED_FINALIST_COUNT} finalists, found {len(finalists)}")

ids = [entry["id"] for entry in finalists]
if len(ids) != len(set(ids)):
    fail("finalist ids must be unique")

loops: set[str] = set()
tastes: set[str] = set()
for entry in finalists:
    candidate_id = entry["id"]
    if candidate_id not in slots:
        fail(f"unknown finalist: {candidate_id}")
    slot = slots[candidate_id]
    if slot["status"] != "finished":
        fail(f"{candidate_id} is not finished")
    if slot["initialPlayable"] is not True:
        fail(f"{candidate_id} has no initial playable")
    if slot["meaningfulImprovementPasses"] < 1:
        fail(f"{candidate_id} has no meaningful improvement pass")
    if slot["selected"] is not False or slot["publishedUrl"] is not None:
        fail(f"{candidate_id} was made public before integration gates")
    if not slot["developmentCommits"]:
        fail(f"{candidate_id} has no development commit evidence")
    if not entry.get("reason") or len(entry["reason"]) < 40:
        fail(f"{candidate_id} needs a substantive finalist reason")

    loop = slot["coreLoop"].strip().casefold()
    if loop in loops:
        fail(f"duplicate finalist core loop: {slot['coreLoop']}")
    loops.add(loop)
    tastes.update(entry.get("fit", []))

    source = ROOT / slot["source"]
    for filename in ("index.html", "engine.js", "game.js", "style.css"):
        if not (source / filename).is_file():
            fail(f"{candidate_id} missing source file {filename}")

    stem = entry["testStem"]
    for layer in ("engine", "dom", "browser"):
        if not (ROOT / f"tests/{stem}-{layer}.cjs").is_file():
            fail(f"{candidate_id} missing {layer} suite")

    evidence = " ".join(slot["tests"]).casefold()
    if "chromium" not in evidence or "pass" not in evidence:
        fail(f"{candidate_id} lacks recorded passing browser evidence")

missing_tastes = REQUIRED_TASTES - tastes
if missing_tastes:
    fail(f"finalist slate misses requested tastes: {sorted(missing_tastes)}")

if ledger["collectionReview"]["selected"] != 0 or ledger["collectionReview"]["published"] != 0:
    fail("collection review claims selection/publication before integration")

print(
    "PASS indie selection gate: "
    f"{len(finalists)} unique finished/tested finalists; "
    f"requested tastes covered; 0 selected/public"
)
