from hashlib import sha256
from html.parser import HTMLParser
from pathlib import Path
import json
import subprocess


ROOT = Path(__file__).resolve().parents[1]
SELECTED = {
    "tidepost": {
        "engine.js": "cbd7a71a0e4074374f5fc7759fc08cb852b8af379538aee9c096ae7725a4387e",
        "game.js": "a3da9a7d4b7be57a69184e8afbd45010ba31b62b0f6ba4994304396e56cf24d0",
        "style.css": "c3acf8deea0176f2270a6db8f9766c4475577319481ceba33a0450ab36065f93",
    },
    "deep-pocket": {
        "engine.js": "ae71ea29c5e053228e48ce89dabbd4c1f85b5a2cc9c5c1639576c432c666777a",
        "game.js": "ca250ca5986e52479506ce13f95f72de1949d8ef2b72d4a02d25d7f27ff02e11",
        "style.css": "4fb6b6231060d97e0e6e0e49d8e969a9b5d5a2021669c074a5af80cd43e15e77",
    },
    "queen-of-cinders": {
        "engine.js": "1d6e7988bc4507e6a36cef118d485554d069952e512139bc5e6ecd6bd6b33460",
        "game.js": "1708f6d787c4e24fbd979f187b5ea8f2795ac70e281f62b3fb19f5cac9677ffd",
        "style.css": "7a033aa107ad524ef3db9046cd5d05e34b28da0dfa485d0578a78d0e658e8161",
    },
    "little-foundry": {
        "engine.js": "ed3aa11e11ba04d1d39adf00a1065c9c9d3ff4335a1dc6623be0cf599573f5cd",
        "game.js": "07eaaff5bb7f71b89b222127e56fcdc79a28bd0904e9ad20349c01ee1b7cdaf0",
        "style.css": "bd75ca442b6ed5d6ea72382ab80854ae615b7fb4753eb085825b33bb6638aee8",
    },
    "scrap-orbit": {
        "engine.js": "2fbcc5cd8a2c35ea0891e8cf91e455124748f0576f06c88f8155cbb96ab01e10",
        "game.js": "74389f9f25abeb3afb3969b49b16827baf931b5415e3a350ea0c837a8db94e29",
        "style.css": "ca27fed7ea5fad7314934da78fb0d7125e621330a42503381c33b18463b4e1af",
    },
    "inkline": {
        "engine.js": "35fc31f45d7db8cbc66228629af6ccf6bb88b69029526f1ff65cb36d6496caef",
        "game.js": "ca4ce988abe87a843e1582216899845e63327d6dcbbb3e1292a4f737c13a11a4",
        "style.css": "8b10b3b8d0932ff4270b9c3c6652935be8de57dde4e09344625f908df688f820",
    },
    "pocket-expedition": {
        "engine.js": "4148d6cb3f262bdddca8929387c24a3d56a481280a20d55301f25e89886a3f04",
        "game.js": "ec8455984d072d15908a652a4ce4e8243180834e7f84cf9cdc93c6bc192722f2",
        "style.css": "a5c0e49eeca3714d42bbbfba1b7c4f4c482558b7c1ef486d9a58aadc91426c30",
    },
    "echo-vault": {
        "engine.js": "df0f6935eabf7ef728520380d4a3aeb5ffeacb342a398ee80c9d9a84124ad611",
        "game.js": "7dfc28698604aec3628e5becadf5d30ee7fe20e81817d1630c85378bc519270e",
        "style.css": "f0b2ebebdc62bf83c653b16a0844cfcc3009403cc52c44786c654114a73629da",
    },
    "glasshouse": {
        "engine.js": "2c287e376d9cf5eef86a46e7b91f2dc92550f3d84f233377560bc210f430acb0",
        "game.js": "4958eb0ab44137dec44975ea3975d3ebc5cdb544ff1d541652e98007538abe1e",
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
