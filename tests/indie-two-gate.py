from pathlib import Path
import json
import re
root=Path(__file__).resolve().parents[1]
ledger=json.loads((root/'dev/indie-collection-two/ledger.json').read_text())
items=ledger['candidates']
assert len(items)==20
assert [i['slot'] for i in items]==list(range(21,41))
assert len({i['id'] for i in items})==20
first={'tidepost','deep-pocket','queen-of-cinders','little-foundry','scrap-orbit','inkline','pocket-expedition','echo-vault','glasshouse','spore-kitchen','bolt-and-bristle','roof-runner','stone-song','last-match','burrow-express','storm-signal','circuit-garden','moss-market','threadbound','rain-catcher'}
assert not ({i['id'] for i in items}&first)
counts={'playable':sum(i['status'] in ['playable','improved','finished'] for i in items),'improved':sum(bool(i['improvementPasses']) for i in items),'finished':sum(i['status']=='finished' for i in items),'selected':sum(i['selected'] for i in items),'meaningfulPasses':sum(len(i['improvementPasses']) for i in items)}
for key,val in counts.items():assert ledger['totals'][key]==val,(key,val)
catalog={i['id']:i for i in json.loads((root/'catalog.json').read_text())}
for i in items:
 if i['status']=='planned':
  assert not i['source'] and not i['improvementPasses'] and not i['selected']
  continue
 source=root/i['source'];assert source.is_dir()
 for file in ['index.html','engine.js','game.js','style.css']:assert (source/file).is_file()
 html=(source/'index.html').read_text();assert '../../bridge.js' in html and '../../index.html#games' in html
 if not i['selected']:assert i['id'] not in catalog
 if i['status']=='finished':assert i['improvementPasses'] and i['tests'] and all(i['quality'][k] is not None for k in ['enjoyment','depth','polish','reliability','variety'])
print('PASS second batch: exactly 20 new slots; honest status totals; source, bridge, navigation and selection gates')
