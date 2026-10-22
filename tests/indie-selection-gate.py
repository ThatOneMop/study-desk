#!/usr/bin/env python3
"""Validate the finished, selected indie slate and its integration evidence."""

from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
LEDGER_PATH = ROOT / "dev/indie-collection/ledger.json"
FINALISTS_PATH = ROOT / "dev/indie-collection/finalists.json"
REQUIRED_TASTES = {"fishing", "colony", "manual", "roguelike", "action"}
EXPECTED_FINALIST_COUNT = 9
PUBLIC_COMMIT = "a9aa7b0d6f191a5a7d376ad1751016e42f3f91ed"


def fail(message: str) -> None:
    raise AssertionError(message)


ledger = json.loads(LEDGER_PATH.read_text())
manifest = json.loads(FINALISTS_PATH.read_text())
slots = {slot["id"]: slot for slot in ledger["slots"]}
finalists = manifest["candidates"]

if len(slots) != 20:
    fail(f"expected exactly 20 candidate slots, found {len(slots)}")
unfinished = sorted(candidate_id for candidate_id, slot in slots.items() if slot["status"] != "finished")
if unfinished:
    fail(f"all candidate finish gates should be closed: {unfinished}")

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
    if slot["selected"] is not True:
        fail(f"{candidate_id} is not selected after the integration gate")
    if PUBLIC_COMMIT not in slot["integrationCommits"]:
        fail(f"{candidate_id} lacks the public integration commit")
    if slot["publishedUrl"] is not None:
        fail(f"{candidate_id} claims a live URL despite the Pages blocker")
    if not slot.get("selectionReason") or len(slot["selectionReason"]) < 40:
        fail(f"{candidate_id} needs a substantive selection reason")
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

if manifest.get("publicCommit") != PUBLIC_COMMIT:
    fail("finalist manifest has the wrong public integration commit")
if ledger["collectionReview"]["selected"] != EXPECTED_FINALIST_COUNT:
    fail("collection review selected total is not nine")
if ledger["collectionReview"]["published"] != 0:
    fail("collection review claims publication despite the Pages blocker")

print(
    "PASS indie selection gate: "
    f"20 finished candidates; {len(finalists)} unique selected/tested finalists; "
    f"requested tastes covered; 9 selected, 0 live URLs"
)
