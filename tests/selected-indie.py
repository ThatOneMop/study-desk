from hashlib import sha256
from html.parser import HTMLParser
from pathlib import Path
import json
import subprocess


ROOT = Path(__file__).resolve().parents[1]
SELECTED = {
    "tidepost": {
        "engine.js": "cc49595e3836d287d0f3b17fb360b914c57dcb0e3abe73a1845d1ea08027b733",
        "game.js": "2a60798a4de7d54ba688d803a0d0e6db6acb9827be1b32708b9f136546b1c0ff",
        "style.css": "c3acf8deea0176f2270a6db8f9766c4475577319481ceba33a0450ab36065f93",
    },
    "deep-pocket": {
        "engine.js": "a70ac851cf16222007004c25c9410de7c2fe495c526cc201b39f5d026d6c49db",
        "game.js": "d412caf0986b113a9f536e92044d9ca1cfd7f356659aeda654daad10da90a3ba",
        "style.css": "3d88316541c21f678444a2b2b30d251480de615d990b31b8e38fc6409fa49119",
    },
    "queen-of-cinders": {
        "engine.js": "e8ef741b15e75c0407a7efe013ae0fa2e861a81355e93be7a5dc742f71c58a52",
        "game.js": "6446886f166f293b09e16d144f8917a25379f744453686eec135087e5509e4e8",
        "style.css": "4c79cf1e30a03651a0b776608a572e9abc200ada8990e1864a9ecadd0c70146a",
    },
    "little-foundry": {
        "engine.js": "bd118b9d4d84c5549eb624e0e5df39dc7ec4edfeaa9a19c8f5e174873623bf3b",
        "game.js": "1a3529b34575a48a8a4e4feea7a3b0dbd7e6a0cecfa23440601df1f3ca3156a8",
        "style.css": "085c80e6c28aa39dbfe0c87b5faff02fff7941dea3047fb94592f22e2cf44c78",
    },
    "scrap-orbit": {
        "engine.js": "896d94316e815823edd411d244f51882cfb4e353b8ee8edc6cead61d659a6796",
        "game.js": "3893b4bd8949fdcb19502db660d612337440d234a3bbdc4a8faea9acee9d43aa",
        "style.css": "27deb6cf40d04cdd4cd687e0b2bbe941660c9ec45b9bbd5a23b9042b7f497e73",
    },
    "inkline": {
        "engine.js": "35fc31f45d7db8cbc66228629af6ccf6bb88b69029526f1ff65cb36d6496caef",
        "game.js": "9d17415b77089a603520f91db23a0b209e9427842f4dfb1908b898e26a8de300",
        "style.css": "fc006caa923db44bc864c835c0a44bfc9c4dd379955593dd36467f21518baf60",
    },
    "pocket-expedition": {
        "engine.js": "1fe12a150a234acf93aceb685e02ac7e9c99a41905a1704d555f3daa7802fbae",
        "game.js": "16cdb9e445045854061db7be113f287b3af686c06dc4df04cb45920752bbe109",
        "style.css": "2aa171b456c8abc863c0bfe2d8720b8b8151a174b0e968ae34ba1777a93a87f5",
    },
    "echo-vault": {
        "engine.js": "0f4afbb64825ac52fee27bc534a612920106fb61035980e7980632f64048ce7d",
        "game.js": "86302fa9f26267c4322ae6bfd0030819c02d1a1dcc706a3cc3e9d9d2bf03f1b5",
        "style.css": "5c59de15c7da4bf20518dfe6bbbe569c8e763547251ff6cd84199890ff650a35",
    },
    "glasshouse": {
        "engine.js": "6b3cd896e7f367a5918eb5e4d1e45bb8fcb17379ecde8ca736a12c97d4c83543",
        "game.js": "6ccd9abfb0487d111feabf808fefab01ebb0e1c7c9cda187e921d2d6e3bcb5bd",
        "style.css": "0f30f3ea9b0f282626941b19dbe745917bef96e7bf3321bb66b6d22989d9c2b3",
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
