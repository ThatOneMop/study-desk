from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import unquote
import json,subprocess,hashlib,struct
r=Path(__file__).resolve().parents[1];games=json.loads((r/'catalog.json').read_text());assert len(games)==len({g['id'] for g in games})==100
errors=[];checked=0
class Parser(HTMLParser):
 def handle_starttag(self,tag,attrs):
  global checked
  for k,v in attrs:
   if not v or not ((tag in ['script','img','iframe','audio','video','source'] and k=='src') or(tag=='link' and k=='href')):continue
   if v.startswith(('http:','https:','//','data:','blob:','#')):continue
   p=(self.base/unquote(v.split('?')[0].split('#')[0])).resolve();checked+=1
   if not p.exists():errors.append(str(self.base.relative_to(r))+': '+v)
for g in games:
 if g['type']=='external':continue
 p=r/g['url'].split('?')[0];assert p.exists(),p
 s=p.read_text();assert 'bridge.js' in s,p
 parser=Parser();parser.base=p.parent;parser.feed(s)
 if g['url'].find('?')>=0:
  slug=g['url'].split('?')[1];script=p.parent/slug/'main.js';assert script.exists(),script
  result=subprocess.run(['node','--check',str(script)],capture_output=True);assert result.returncode==0,result.stderr
print('Checked 99 bundled routes and their HTML asset references:',checked)
print('Missing references:',errors)
assert not errors
for p in [r/'app.js',r/'bridge.js',r/'catalog.js']:
 assert subprocess.run(['node','--check',str(p)],capture_output=True).returncode==0
wasm=(r/'games/doom-web/doom.wasm');print('DOOM files:',[p.name for p in (r/'games/doom-web').glob('*.wasm')])
for p in (r/'games/doom-web').glob('*.wasm'):assert p.read_bytes()[:4]==b'\0asm'
p=r/'games/doom-web/freedoom1.wad';data=p.read_bytes();magic,n,off=struct.unpack('<4sii',data[:12]);assert magic in [b'IWAD',b'PWAD'] and off+16*n<=len(data)
print('PASS source syntax and Freedoom WAD/WebAssembly structure')
