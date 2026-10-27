import assert from 'node:assert/strict';
import fs from 'node:fs';
import {MISSIONS,MISSION_IDS,CHRONICLE_CUTS as CUTS,RUNGS,GANGS,PROPERTIES,DISTRICTS,DAY_MINUTES,EMPIRE_HOURS,ARC_MINUTES,
 freshChronicle,normalizeChronicle,stepChronicle,currentMission,missionProgress,arcComplete,joinGang,buyProperty,frontTake,worksGrant,
 openDistricts,applyDistricts,ensureDistrictRegistry,unlockNames,empireNow,chronicleTimeline,chronicleAt,chronicleDuration} from '../dist/bay-chronicle.mjs';

assert.equal(new Set(MISSION_IDS).size,MISSIONS.length);
assert.equal(ARC_MINUTES,60);assert.equal(EMPIRE_HOURS,20);assert.equal(DAY_MINUTES,20);
assert.equal(RUNGS.at(-1).hour,20);assert.equal(RUNGS.at(-1).day*DAY_MINUTES/60,20);
const blob=JSON.stringify(MISSIONS)+JSON.stringify(CUTS)+JSON.stringify(GANGS)+JSON.stringify(PROPERTIES);
assert.match(blob,/double-cross/);assert.match(blob,/Sugar-Free/);assert.match(blob,/Great Jelly|melted|stuck/);
assert.doesNotMatch(blob,/\b(drug|weed|cocaine|meth|gun|shoot|kill|blood|damn|hell)\b/i);
assert.equal(PROPERTIES.map(p=>p.purpose).sort().join(),'front,production,storage');

const early={sold:40,called:2,earned:500,tickets:40,level:8,day:4,bank:9000,cash:2000,time:19*60,atPier:true,atBase:true,finale:false};
let st=freshChronicle();
assert.equal(stepChronicle(st,early).story.open,false,'waits for Founders’ Day');
let r=stepChronicle(st,{...early,finale:true});st=r.story;
assert.equal(st.open,true);assert.equal(r.events[0].type,'open');assert.equal(r.events[1].id,'tin');
assert.equal(currentMission(st).id,'c-phone');
// Adaptive: the arc measures from this snapshot, so old sales do not skip Larry.
assert.equal(missionProgress(currentMission(st),early,st.base).met,false);
r=stepChronicle(st,{...early,finale:true,called:st.base.called});assert.deepEqual(r.events,[]);
r=stepChronicle(st,{...early,finale:true,called:st.base.called+1,atBase:false});
assert.equal(r.events[0].id,'c-phone');st=r.story;
r=stepChronicle(st,{...early,finale:true,atBase:true});assert.equal(r.events[0].id,'c-tin');
assert.ok(r.events.some(e=>e.id==='backstory'));assert.deepEqual(unlockNames(r.events),['Ivy']);st=r.story;
r=stepChronicle(st,{...early,finale:true,sold:st.base.sold+4});assert.equal(r.events[0].id,'c-rival');st=r.story;
r=stepChronicle(st,{...early,finale:true,earned:st.base.earned+150});assert.equal(r.events[0].id,'c-marge');st=r.story;
r=stepChronicle(st,{...early,finale:true,sold:st.base.sold+8,atPier:false});assert.deepEqual(r.events,[]);
r=stepChronicle(st,{...early,finale:true,sold:st.base.sold+8,atPier:true});assert.equal(r.events[0].id,'c-batch');st=r.story;
r=stepChronicle(st,{...early,finale:true,atBase:true});assert.equal(r.events[0].id,'c-cross');
assert.match(r.events[0].line,/Larry/);st=r.story;
r=stepChronicle(st,{...early,finale:true,tickets:st.base.tickets+5});assert.equal(r.events[0].id,'c-tilly');st=r.story;
r=stepChronicle(st,{...early,finale:true,level:st.base.level});assert.deepEqual(r.events,[],'the law waits for another level');
r=stepChronicle(st,{...early,finale:true,level:st.base.level+1});assert.equal(r.events[0].id,'c-law');st=r.story;
r=stepChronicle(st,{...early,finale:true,atPier:true,time:10*60});assert.deepEqual(r.events,[]);
r=stepChronicle(st,{...early,finale:true,atPier:true,time:19*60});assert.equal(r.events[0].id,'c-clear');st=r.story;
r=stepChronicle(st,{...early,finale:true,called:st.base.called+2,atBase:true});assert.equal(r.events[0].id,'c-keys');
assert.equal(r.events[0].district,'salt-docks');st=r.story;assert.equal(arcComplete(st),true);

const reg=ensureDistrictRegistry({});
assert.equal(typeof reg.setLocked,'function');
const plan=openDistricts(st,{level:1,day:1});
assert.equal(plan.find(d=>d.id==='salt-docks').locked,false);
assert.equal(plan.find(d=>d.id==='neon-row').locked,true);
assert.equal(applyDistricts(plan,reg),true);
assert.equal(reg.list().find(d=>d.id==='salt-docks').locked,false);
assert.equal(reg.list().find(d=>d.id==='tin-terrace').locked,true);
// A registry that is already installed is left in place.
const existing={setLocked:()=>true,list:()=>[]};assert.equal(ensureDistrictRegistry({GUMMY_DISTRICTS:existing}),existing);

let crew=normalizeChronicle(st);
assert.equal(joinGang(crew,'sour',{level:5,day:3}).ok,false);
let joined=joinGang(crew,'sour',{level:6,day:3});assert.equal(joined.ok,true);crew=joined.story;
assert.equal(joinGang(crew,'pier',{level:12,day:4}).ok,false,'one crew');
assert.equal(buyProperty(crew,'warehouse',{level:5,bank:3999}).ok,false);
let deed=buyProperty(crew,'warehouse',{level:5,bank:4000});assert.equal(deed.ok,true);assert.equal(deed.property.purpose,'storage');crew=deed.story;
assert.equal(frontTake(crew,100,{cash:100}).ok,false,'no fountain yet');
deed=buyProperty(crew,'venue',{level:9,bank:7500});crew=deed.story;
const till=frontTake(crew,1000,{cash:1000});assert.equal(till.ok,true);assert.equal(till.bank,800);assert.equal(till.spend,1000);
deed=buyProperty(crew,'works',{level:13,bank:12000});crew=deed.story;
assert.equal(worksGrant(crew,{day:2,time:7*60}).ok,false);
const morning=worksGrant(crew,{day:2,time:9*60});assert.equal(morning.wrappers,4);
assert.equal(worksGrant(morning.story,{day:2,time:10*60}).ok,false);

const rich={level:20,day:60,standing:100,gang:'sour'};
const owned={warehouse:true,venue:true,works:true};
const done=[...MISSION_IDS];
const empire=empireNow({open:true,done,gang:'sour',standing:100,owned,base:{sold:0,called:0,earned:0,tickets:0,level:1,day:1,bank:0}},rich);
assert.equal(empire.done,true);assert.equal(empire.targetHours,20);
assert.equal(openDistricts({open:true,done,gang:'sour',standing:100,owned},{level:20,day:60}).every(d=>!d.locked),true);

const back=normalizeChronicle(JSON.parse(JSON.stringify(st)));assert.deepEqual(back.done,st.done);
assert.equal(normalizeChronicle(null).open,false);
assert.deepEqual(normalizeChronicle({open:true,done:['c-cross','c-phone'],gang:'nope',owned:{warehouse:true,bogus:true}}).done,['c-phone']);

for(const id of Object.keys(CUTS)){
 const tl=chronicleTimeline(id,{home:{x:-54,z:61,yaw:1}});
 assert.ok(tl.duration>=8&&tl.duration<=20,id);assert.equal(tl.duration,chronicleDuration(id));
 let subs=0;for(let time=0;time<=tl.duration;time+=.25){const a=chronicleAt(id,tl,time);assert.equal(a.letterbox,true);if(a.sub)subs++;}
 assert.ok(subs>8,id+' dialogue');
}
assert.equal(DISTRICTS.length,4);assert.equal(GANGS.length,3);
const game=fs.readFileSync(new URL('../dist/game.js',import.meta.url),'utf8');
const idx=fs.readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
assert.match(game,/bay-chronicle\.mjs\?v=179/);assert.match(game,/ensureDistrictRegistry/);assert.match(game,/chronicleAt/);
assert.match(idx,/Gummy Bay v179/);assert.match(idx,/game\.js\?v=179/);
console.log('PASS v179 bay chronicle: story hour, double-cross, districts, crews, properties, 20-hour road');
