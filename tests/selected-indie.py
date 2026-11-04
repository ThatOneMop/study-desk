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
    "packworks", "numberworks",
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
# Arcade entries are third-party catalogue games (GameMonetize) wrapped in arcade/<id>/ pages.
arcade = [entry for entry in catalog if entry.get("type") == "arcade"]
own = [entry for entry in catalog if entry.get("type") != "arcade"]
ids = [entry["id"] for entry in catalog]
assert len(ids) == len(set(ids)), ids
assert {entry["id"] for entry in own} == KEEP, {entry["id"] for entry in own} ^ KEEP
assert len(catalog) == len(KEEP) + len(arcade)
assert arcade, "expected live Arcade games"

js = (ROOT / "catalog.js").read_text()
assert js.startswith("window.GAME_CATALOG = ")
assert json.loads(js.split("=", 1)[1].strip().rstrip(";")) == catalog, "catalog.js and catalog.json differ"

credits = (ROOT / "credits.html").read_text()
for entry in arcade:
    assert entry["group"] == "Arcade" and entry["source"] == "GameMonetize", entry["id"]
    assert entry["embed"].startswith("https://html5.gamemonetize.co/"), entry["id"]
    assert entry["url"] == f"arcade/{entry['id']}/index.html", entry["id"]
    assert entry["thumbnail"].startswith("https://img.gamemonetize.com/"), entry["id"]
    page = (ROOT / entry["url"]).read_text()
    assert "../../bridge.js" in page and "../../arcade-config.js" in page, entry["id"]
    assert entry["embed"] in page, entry["id"]
    assert f'id="{entry["credits"].split("#", 1)[1]}"' in credits, entry["id"]

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
assert sections <= KEEP | {"created-games", "arcade", "arcade-gamedistribution"} | {f"arcade-{e['id']}" for e in arcade}, sections - KEEP

hub = "\n".join((ROOT / name).read_text() for name in ("index.html", "app.js", "community.html", "community.js"))
for link in re.findall(r"games/([a-z0-9-]+)/", hub):
    assert link in KEEP, f"link to removed game {link}"

for path in ("app.js", "bridge.js", "catalog.js"):
    result = subprocess.run(["node", "--check", str(ROOT / path)], capture_output=True)
    assert result.returncode == 0, result.stderr.decode()

print(f"PASS kept catalogue integrity: {len(KEEP)} bundled routes + {len(arcade)} live Arcade games, bridge, credits, catalog.js/json match, no removed folders or links")
