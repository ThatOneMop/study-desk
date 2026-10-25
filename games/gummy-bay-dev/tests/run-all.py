"""Run independent Node suites; results include exact commands and verification limits."""
from pathlib import Path
import concurrent.futures, json, subprocess, time, sys
ROOT=Path(__file__).resolve().parent.parent
FILES=sorted(f for f in (ROOT/'tests').iterdir() if f.suffix in ('.mjs','.cjs') and f.name!='scene-resources.mjs')
def check(f):
    command=['node']+(['--experimental-vm-modules'] if f.name=='module-link.cjs' else [])+[str(f.relative_to(ROOT))]
    start=time.monotonic()
    try:
        p=subprocess.run(command,cwd=ROOT,capture_output=True,text=True,timeout=180)
        return {'test':f.name,'command':command,'exit':p.returncode,'seconds':round(time.monotonic()-start,2),'output':(p.stdout+p.stderr)[-16000:]}
    except subprocess.TimeoutExpired:
        return {'test':f.name,'command':command,'exit':124,'seconds':180,'output':'Timeout'}
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool: results=list(pool.map(check,FILES))
report={'scope':'Automated CPU, asset, logic and mocked DOM/WebGL tests. Not rendered 3D, audio or live multiplayer acceptance.','total':len(results),'passed':sum(r['exit']==0 for r in results),'results':results}
path=ROOT/'docs/evidence/v121-final-tests.json';path.write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k!='results'},indent=2))
for r in results:
    if r['exit']:print(r['test'],r['output'])
sys.exit(any(r['exit'] for r in results))
