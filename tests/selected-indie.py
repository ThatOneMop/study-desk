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
        "engine.js": "ad8feeefdd2559875da35389d5535df95a7f5ecbc2b07efadedc4b86cd6cc969",
        "game.js": "2008949ab9c251cbafb8d18410c3fd7818493e2f57198510cc463c362af366a5",
        "style.css": "d7e2554110036409df0a9150f847e12c887898d4d3b45096950e4a58b312bc51",
    },
    "scrap-orbit": {
        "engine.js": "2fbcc5cd8a2c35ea0891e8cf91e455124748f0576f06c88f8155cbb96ab01e10",
        "game.js": "74389f9f25abeb3afb3969b49b16827baf931b5415e3a350ea0c837a8db94e29",
        "style.css": "ca27fed7ea5fad7314934da78fb0d7125e621330a42503381c33b18463b4e1af",
    },
    "inkline": {
        "engine.js": "35fc31f45d7db8cbc66228629af6ccf6bb88b69029526f1ff65cb36d6496caef",
        "game.js": "9d17415b77089a603520f91db23a0b209e9427842f4dfb1908b898e26a8de300",
        "style.css": "fc006caa923db44bc864c835c0a44bfc9c4dd379955593dd36467f21518baf60",
    },
    "pocket-expedition": {
        "engine.js": "4148d6cb3f262bdddca8929387c24a3d56a481280a20d55301f25e89886a3f04",
        "game.js": "ec8455984d072d15908a652a4ce4e8243180834e7f84cf9cdc93c6bc192722f2",
        "style.css": "a5c0e49eeca3714d42bbbfba1b7c4f4c482558b7c1ef486d9a58aadc91426c30",
    },
    "echo-vault": {
        "engine.js": "2df0dee521d9557f04046d10c6b19ce8726312647023ee13f7130330fbd95492",
        "game.js": "6c431e567543241ceeade1fd07d706d8aa442cc87f68a0cffa9ad61940607709",
        "style.css": "580cfbb122b9362d833d23bbd67c9483d72fc796257b8e93c2e8d8ae8a13a1f4",
    },
    "glasshouse": {
        "engine.js": "7270d56fc86194dc5997321ccf7b240af0f7391d2edad2ce1f7ea78b39168264",
        "game.js": "840bef07acad067b059a6b55fd29a52f1ed6fbbab695524e60f22d25b6221526",
        "style.css": "3fc042058c5db0f1a9e09332eed6d5f1aefdfe4932127740ad97c3e74f0ea734",
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
