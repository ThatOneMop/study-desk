"""Run the collection's offline Node engine/DOM regression scripts.

Install jsdom 26 separately and expose it through NODE_PATH. Playwright scripts
are deliberately separate: this runner does not start servers or browsers.
"""
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
failures = []
count = 0
for script in sorted((ROOT / "tests").glob("*.cjs")):
    source = script.read_text()
    if "playwright" in source or script.name == "gate-fixture.cjs":
        continue
    count += 1
    try:
        result = subprocess.run(
            ["node", str(script)], cwd=ROOT, capture_output=True, text=True, timeout=90
        )
        if result.returncode:
            failures.append(script.name)
            print(f"FAIL {script.name}\n{result.stdout}\n{result.stderr}", flush=True)
        else:
            print(f"PASS {script.name}", flush=True)
    except subprocess.TimeoutExpired:
        failures.append(script.name)
        print(f"TIMEOUT {script.name}", flush=True)

print(f"{count - len(failures)}/{count} engine/DOM scripts passed.", flush=True)
sys.exit(bool(failures))
