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
        "engine.js": "ed41a88456e0672b202176235fe7970719b0916fe2854116882f87717eed28b2",
        "game.js": "957f442159f5b07a8da1f7fb30a406e6729a8405a058c370b5ade7b9bd9f7a29",
        "style.css": "4fb6b6231060d97e0e6e0e49d8e969a9b5d5a2021669c074a5af80cd43e15e77",
    },
    "queen-of-cinders": {
        "engine.js": "ab600e3d112c6df4659631b5bf0c71f735de95767141421eb78c5882c1025d71",
        "game.js": "2b1959bfb5205ff8e66470137173c1d20698162d0ac3d632c154f594c1f26b77",
        "style.css": "7a033aa107ad524ef3db9046cd5d05e34b28da0dfa485d0578a78d0e658e8161",
    },
    "little-foundry": {
        "engine.js": "3eb43a12ee4c6ee2144471236855965fa15d93ae04387ef7bc40253fd4a2ca7f",
        "game.js": "318bf65d33eea87cc7838b63eee7e5b81fad7d614a816dd4d14dd920974a444f",
        "style.css": "bd75ca442b6ed5d6ea72382ab80854ae615b7fb4753eb085825b33bb6638aee8",
    },
    "scrap-orbit": {
        "engine.js": "1e3a203f56fc60216e455b20a2a8ef4afc4ec4c344968b25c36599f3b0cb6ce7",
        "game.js": "ca361c40d571103add6ba74035599322568e95740460f9325d5d59a78eb1c316",
        "style.css": "ca27fed7ea5fad7314934da78fb0d7125e621330a42503381c33b18463b4e1af",
    },
    "inkline": {
        "engine.js": "819e6bd1b1a54bad4886537f25aed0fe25a175ddd49072b504f66542d816edf3",
        "game.js": "a9ff00b50ce531e0644f10ef9ef2bd8f41946d17834d3b1bf1974751dea37319",
        "style.css": "8b10b3b8d0932ff4270b9c3c6652935be8de57dde4e09344625f908df688f820",
    },
    "pocket-expedition": {
        "engine.js": "6cb38c0ff6e1f00ec35d0c850d994c5d8d0f93ef6ef8be6327272b09c6afa21e",
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
