"""Validate implemented candidates and ledger without requiring legacy binary assets."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json, subprocess
root=Path(__file__).resolve().parents[1]
ledger=json.loads((root/'dev/indie-collection/ledger.json').read_text())
slots=ledger['slots']
assert len(slots)==20 and sorted(s['slot'] for s in slots)==list(range(1,21))
assert len({s['id'] for s in slots})==20
catalog=json.loads((root/'catalog.json').read_text())
public={g['id'] for g in catalog}
checked=0
class Assets(HTMLParser):
 def handle_starttag(self,tag,attrs):
  global checked
  for key,value in attrs:
   if not value or not ((tag in ('script','img','iframe') and key=='src') or (tag in ('link','a') and key=='href')):continue
   u=urlsplit(value)
   if u.scheme or u.netloc or not u.path:continue
   target=(self.base/unquote(u.path)).resolve()
   assert target.is_relative_to(root) and target.exists(), str(target)
   checked+=1
for slot in slots:
 if not slot['selected']:assert slot['id'] not in public, 'Unselected candidate exposed in public catalogue'
 if not slot['initialPlayable']:continue
 directory=root/slot['source']
 assert (directory/'index.html').exists()
 for file in directory.glob('*.html'):
  parser=Assets();parser.base=file.parent;parser.feed(file.read_text())
 for file in directory.glob('*.js'):
  subprocess.run(['node','--check',str(file)],check=True)
parser=Assets();parser.base=root/'dev/indie-collection';parser.feed((parser.base/'index.html').read_text())
print(f'PASS exact 20 slots, selection isolation, candidate syntax and {checked} local source/navigation references')
