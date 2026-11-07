"""The Arcade generator matches the committed catalogue, pages and credits.

Running it again must not add games, turn a provider on, or rewrite bundled entries.
"""
import hashlib
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def snapshot():
    files = [
        ROOT / "catalog.js",
        ROOT / "catalog.json",
        ROOT / "credits.html",
        ROOT / "arcade" / "gamemonetize.js",
        ROOT / "arcade" / "gamedistribution.js",
    ]
    files += sorted(path for path in (ROOT / "arcade").glob("*/index.html"))
    digest = hashlib.sha256()
    for path in files:
        digest.update(str(path.relative_to(ROOT)).encode())
        digest.update(b"\0")
        digest.update(path.read_bytes())
    return digest.hexdigest(), len(files)


before, count = snapshot()
result = subprocess.run([sys.executable, str(ROOT / "tools" / "arcade" / "build.py"), str(ROOT)], capture_output=True, text=True)
assert result.returncode == 0, result.stderr + result.stdout
after, count_after = snapshot()
assert count_after == count
assert before == after, "arcade generator output drifted from the committed catalogue"
print(f"PASS arcade catalogue generation parity: {count} files unchanged")
