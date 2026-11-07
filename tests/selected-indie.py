"""Integrity of the trimmed Study Desk catalogue (kept games only).

The catalogue was cut down to the games below on 2026-11-02. This check makes sure the
catalogue lists exactly those games, every route exists with the Study Desk bridge and a
credits entry, catalog.js matches catalog.json, and no removed game folder or link remains.
"""
from html.parser import HTMLParser
from pathlib import Path
import json
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]
KEEP = {
    "gummy-bay", "autumn-drift", "little-lake", "lost-found", "moon-salvage", "tiny-wilds", "forge-arena",
    "roof-runner", "ashwake", "winterfold", "spanwright", "creekhold", "lanewright", "harvest-protocol",
    "packworks", "numberworks", "mycelium-yard", "bell-diver",
}
# Folders under games/ that are not catalogue entries but must stay.
SUPPORT = {"gummy-bay-dev"}


class Parser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.bridges = 0

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "script" and (attrs.get("src") or "").split("?")[0].endswith("../../bridge.js"):
            self.bridges += 1


catalog = json.loads((ROOT / "catalog.json").read_text())
# GameMonetize stays prepared beside the catalogue, not in the public list, while gmEnabled is false.
prepared = json.loads((ROOT / "arcade" / "gamemonetize.js").read_text().split("window.ARCADE_GM_CATALOG = ", 1)[1].strip().rstrip(";"))
own = catalog
ids = [entry["id"] for entry in catalog]
assert len(ids) == len(set(ids)), ids
assert {entry["id"] for entry in own} == KEEP, {entry["id"] for entry in own} ^ KEEP
assert len(catalog) == len(KEEP)
assert not any(entry.get("type") == "arcade" or entry.get("source") in {"GameMonetize", "GameDistribution"} for entry in catalog)
assert "gamemonetize" not in (ROOT / "catalog.js").read_text().lower()
config = (ROOT / "arcade-config.js").read_text()
assert "gmEnabled: false" in config and "gdEnabled: false" in config
assert len(prepared) == 23, len(prepared)

js = (ROOT / "catalog.js").read_text()
assert js.startswith("window.GAME_CATALOG = ")
assert json.loads(js.split("=", 1)[1].strip().rstrip(";")) == catalog, "catalog.js and catalog.json differ"

credits = (ROOT / "credits.html").read_text()
assert 'id="arcade-gamemonetize"' in credits and 'id="arcade-gamedistribution"' in credits
for entry in prepared:
    assert entry["group"] == "Arcade" and entry["source"] == "GameMonetize", entry["id"]
    assert entry["embed"].startswith("https://html5.gamemonetize.co/"), entry["id"]
    assert entry["url"] == f"arcade/{entry['id']}/index.html", entry["id"]
    assert entry["thumbnail"].startswith("https://img.gamemonetize.com/"), entry["id"]
    assert entry["credits"] == "credits.html#arcade-gamemonetize", entry["id"]
    page = (ROOT / entry["url"]).read_text()
    assert "../../bridge.js" in page and "../../arcade-config.js" in page, entry["id"]
    assert entry["embed"] in page, entry["id"]
    assert "<iframe" not in page.lower(), entry["id"]
    assert "gmEnabled" in page, entry["id"]
    assert f'id="arcade-{entry["id"]}"' not in credits, entry["id"]

for entry in catalog:
    if entry["type"] == "arcade":
        continue
    assert entry["type"] == "bundled", entry["id"]
    assert entry["url"] == f"games/{entry['id']}/index.html", entry["id"]
    page = ROOT / entry["url"]
    assert page.is_file(), page
    parser = Parser()
    parser.feed(page.read_text())
    assert parser.bridges >= 1, entry["id"]
    anchor = entry["credits"].split("#", 1)[1]
    assert f'id="{anchor}"' in credits, entry["id"]
    if entry.get("thumbnail"):
        assert (ROOT / entry["thumbnail"]).is_file(), entry["thumbnail"]

folders = {p.name for p in (ROOT / "games").iterdir() if p.is_dir()}
assert folders == KEEP | SUPPORT, folders ^ (KEEP | SUPPORT)
for loose in (ROOT / "games").iterdir():
    assert loose.is_dir(), f"unexpected file in games/: {loose.name}"

sections = set(re.findall(r'<section id="([a-z0-9-]+)"', credits))
assert sections <= KEEP | {"created-games", "arcade", "arcade-gamemonetize", "arcade-gamedistribution"}, sections - KEEP

hub = "\n".join((ROOT / name).read_text() for name in ("index.html", "app.js", "community.html", "community.js"))
for link in re.findall(r"games/([a-z0-9-]+)/", hub):
    assert link in KEEP, f"link to removed game {link}"

index = (ROOT / "index.html").read_text()
assert 'id="studyMonday"' not in index
assert "access-verifiers.js" in index
verifiers = json.loads((ROOT / "access-verifiers.js").read_text().split("=", 1)[1].strip().rstrip(";"))
assert verifiers["algorithm"] == "PBKDF2" and verifiers["iterations"] == 600000
assert set(verifiers["credentials"]) == {"gamesPin"}
import base64
pin = verifiers["credentials"]["gamesPin"]
assert len(base64.b64decode(pin["salt"])) == 16 and len(base64.b64decode(pin["verifier"])) == 32
for path in ("app.js", "bridge.js", "catalog.js", "arcade-config.js", "arcade/gamemonetize.js", "arcade/gamedistribution.js", "access-verifiers.js"):
    result = subprocess.run(["node", "--check", str(ROOT / path)], capture_output=True)
    assert result.returncode == 0, result.stderr.decode()

print(f"PASS kept catalogue integrity: {len(KEEP)} bundled routes, {len(prepared)} GameMonetize games prepared but not public, bridge, credits, catalog.js/json match, no removed folders or links")
