from hashlib import sha256
from html.parser import HTMLParser
from pathlib import Path
import json
import subprocess


ROOT = Path(__file__).resolve().parents[1]
SELECTED = {
    "tidepost": {
        "engine.js": "389cb4a1aebb0177a87e2ecf9c3a07914c0bf25b6530edb841f86e00120cfe81",
        "game.js": "d4513748b981f3ebcb628368c25f21ee8427f9cf03fb5d227451822a404b1b54",
        "style.css": "3b4c03a6b170c48dc7340b3a69af235192e31f0dac3f998bedb2e5e19983c6b1",
    },
    "deep-pocket": {
        "engine.js": "ae71ea29c5e053228e48ce89dabbd4c1f85b5a2cc9c5c1639576c432c666777a",
        "game.js": "9b4b4968362c8c22639a5787b2d3d321598520084e8bab21fd964f956483c8cc",
        "style.css": "4fb6b6231060d97e0e6e0e49d8e969a9b5d5a2021669c074a5af80cd43e15e77",
    },
    "queen-of-cinders": {
        "engine.js": "1d6e7988bc4507e6a36cef118d485554d069952e512139bc5e6ecd6bd6b33460",
        "game.js": "2b1959bfb5205ff8e66470137173c1d20698162d0ac3d632c154f594c1f26b77",
        "style.css": "7a033aa107ad524ef3db9046cd5d05e34b28da0dfa485d0578a78d0e658e8161",
    },
    "little-foundry": {
        "engine.js": "ed3aa11e11ba04d1d39adf00a1065c9c9d3ff4335a1dc6623be0cf599573f5cd",
        "game.js": "318bf65d33eea87cc7838b63eee7e5b81fad7d614a816dd4d14dd920974a444f",
        "style.css": "bd75ca442b6ed5d6ea72382ab80854ae615b7fb4753eb085825b33bb6638aee8",
    },
    "scrap-orbit": {
        "engine.js": "2fbcc5cd8a2c35ea0891e8cf91e455124748f0576f06c88f8155cbb96ab01e10",
        "game.js": "74389f9f25abeb3afb3969b49b16827baf931b5415e3a350ea0c837a8db94e29",
        "style.css": "ca27fed7ea5fad7314934da78fb0d7125e621330a42503381c33b18463b4e1af",
    },
    "inkline": {
        "engine.js": "35fc31f45d7db8cbc66228629af6ccf6bb88b69029526f1ff65cb36d6496caef",
        "game.js": "a9ff00b50ce531e0644f10ef9ef2bd8f41946d17834d3b1bf1974751dea37319",
        "style.css": "8b10b3b8d0932ff4270b9c3c6652935be8de57dde4e09344625f908df688f820",
    },
    "pocket-expedition": {
        "engine.js": "4148d6cb3f262bdddca8929387c24a3d56a481280a20d55301f25e89886a3f04",
        "game.js": "7ae152a76bc846e682bc1b22aa3a438e38c7e4c1d337a74fb5ab8298c1f22bcd",
        "style.css": "a5c0e49eeca3714d42bbbfba1b7c4f4c482558b7c1ef486d9a58aadc91426c30",
    },
    "echo-vault": {
        "engine.js": "df0f6935eabf7ef728520380d4a3aeb5ffeacb342a398ee80c9d9a84124ad611",
        "game.js": "01529b7fd61eac71cec3ac54d68363df9e0a27ed2294ecaffdb8858df6d1e744",
        "style.css": "f0b2ebebdc62bf83c653b16a0844cfcc3009403cc52c44786c654114a73629da",
    },
    "glasshouse": {
        "engine.js": "2c287e376d9cf5eef86a46e7b91f2dc92550f3d84f233377560bc210f430acb0",
        "game.js": "a77a9f756730609e7b1dc36de92f2c26632c28fb2ecbc1ccb7484e4fc4c75bdc",
        "style.css": "634935f2152bd8dc58e5847f0b448d302b4fb02bdd67d3cbbcc57bce5e57c000",
    },
}


class ReleaseParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.catalogue_links = 0
        self.bridges = 0

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "a" and attrs.get("href") == "../../index.html#games":
            self.catalogue_links += 1
        if tag == "script" and attrs.get("src") == "../../bridge.js":
            self.bridges += 1


catalog = json.loads((ROOT / "catalog.json").read_text())
entries = {entry["id"]: entry for entry in catalog}
assert len(SELECTED) == 9
assert set(SELECTED) <= set(entries)

for game_id, expected in SELECTED.items():
    entry = entries[game_id]
    assert entry["group"] == "Indie collection"
    assert entry["type"] == "bundled" and entry["internet"] is False
    assert entry["url"] == f"games/{game_id}/index.html"
    game_dir = ROOT / "games" / game_id
    for filename, digest in expected.items():
        path = game_dir / filename
        assert path.is_file(), path
        assert sha256(path.read_bytes()).hexdigest() == digest, path
        if filename.endswith(".js"):
            result = subprocess.run(["node", "--check", str(path)], capture_output=True)
            assert result.returncode == 0, result.stderr.decode()
    html = (game_dir / "index.html").read_text()
    parser = ReleaseParser()
    parser.feed(html)
    assert parser.catalogue_links == 1, game_id
    assert parser.bridges == 1, game_id
    lowered = html.casefold()
    for phrase in ("development collection", "development-only", "not selected", "development prototype"):
        assert phrase not in lowered, (game_id, phrase)
    assert f'id="{game_id}"' in (ROOT / "credits.html").read_text()

print("PASS selected indie integrity: 9 release routes, verified source hashes, syntax, bridge/catalogue links and credits")
