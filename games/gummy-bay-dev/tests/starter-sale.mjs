import assert from 'node:assert/strict';
import {grantStarter,starterUntouched,starterOfferDue,STARTER_PACKS,STARTER_TEXT} from '../dist/starter-sale.mjs';
const blank=()=>({packs:[0],gummies:[0],raw:[0],storedPacks:[0],sold:0,made:0,harvested:0,mixed:0,deals:[]});
const fresh=grantStarter(blank());
assert.equal(fresh.packs[0],STARTER_PACKS);assert.equal(fresh.starterBatch,true);assert.equal(fresh.starterOffer,false);
assert.equal(grantStarter(fresh).packs[0],STARTER_PACKS);
const veteran=blank();veteran.sold=1;grantStarter(veteran);assert.equal(veteran.packs[0],0);assert.equal(veteran.starterBatch,true);
for(const key of ['made','harvested','mixed']){const v=blank();v[key]=1;grantStarter(v);assert.equal(v.packs[0],0,key);}
for(const key of ['packs','gummies','raw','storedPacks']){const v=blank();v[key]=[0,2];grantStarter(v);assert.equal(v.packs[0],0,key);}
const flagged=blank();flagged.starterBatch=true;grantStarter(flagged);assert.equal(flagged.packs[0],0);
assert.equal(starterUntouched(blank()),true);assert.equal(starterUntouched(fresh),false);
const ready=grantStarter(blank());
assert.equal(starterOfferDue(ready,19.9),false);assert.equal(starterOfferDue(ready,20),true);
ready.sold=1;assert.equal(starterOfferDue(ready,40),false);
const offered=grantStarter(blank());offered.starterOffer=true;assert.equal(starterOfferDue(offered,40),false);
const busy=grantStarter(blank());busy.deals=[{npc:0}];assert.equal(starterOfferDue(busy,40),false);
const short=grantStarter(blank());short.packs[0]=1;assert.equal(starterOfferDue(short,40),false);
assert.match(STARTER_TEXT,/2 at \$30/);
console.log('PASS: starter packs land once on an untouched save, and Jules\' offer waits 20 seconds.');
