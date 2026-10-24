from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
d=json.loads((root/'dev/indie-collection-three/ledger.json').read_text())
c=d['candidates'];assert len(c)==50 and [x['slot'] for x in c]==list(range(41,91))
ids=[x['id'] for x in c if x['id']];assert len(ids)==len(set(ids))
for key,field in [('built','built'),('improved','improved'),('browserTested','browserTested'),('integrated','integrated'),('live','live')]:assert d['totals'][key]==sum(x[field] for x in c)
catalog={x['id'] for x in json.loads((root/'catalog.json').read_text())}
for x in c:
 if not x['built']:continue
 assert x['source'] and x['tests'] and x['commits']
 for f in ['engine.js','game.js','index.html','style.css']:assert (root/x['source']/f).is_file()
 html=(root/x['source']/'index.html').read_text();assert '../../bridge.js' in html and '../../index.html#games' in html
 if not x['integrated']:assert x['id'] not in catalog
 if x['integrated']:assert x['improved'] and x['browserTested'] and x['integrationCommits']
 if x['improved']:assert x['improvementPasses']
 if x['live']:assert x['integrated'] and x['publishedUrl']
print('PASS third batch: 50 slots, separate counts, durable source and publication gates')
