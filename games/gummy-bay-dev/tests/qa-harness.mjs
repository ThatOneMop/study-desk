import assert from 'node:assert/strict';
import fs from 'node:fs';
import {readQaFlag,qaStorageKey,inCamper,camperExitHold,steerHold,createDayDirector} from '../dist/qa-harness.mjs';

assert.equal(readQaFlag(''),null);
assert.equal(readQaFlag('?qa=1'),null);
assert.equal(readQaFlag('?qa=Day'),null);
assert.equal(readQaFlag('?qa=day'),'day');
assert.equal(readQaFlag('?qa=day&lane=1'),'day');
assert.equal(qaStorageKey(null),null);
assert.equal(qaStorageKey('day'),'gummybay-qa-day');
assert.equal(qaStorageKey('day').includes('v3'),false);

assert.equal(inCamper(-58,26.7),true);
assert.equal(inCamper(-50,27),false);
assert.deepEqual(camperExitHold(-Math.PI/2),{w:true});
assert.equal(camperExitHold(-Math.PI/2).a,undefined);
assert.equal(steerHold({yaw:0,x:0,z:0,tx:0,tz:5,stuck:1}).hold.s,true);
assert.equal(steerHold({yaw:0,x:0,z:0,tx:0,tz:.2,arrive:1.15}).arrived,true);

const game=fs.readFileSync(new URL('../dist/game.js',import.meta.url),'utf8');
assert.match(game,/qaStorageKey\(readQaFlag\(location\.search\)\)/);
assert.match(game,/if\(qaKey\)/);
assert.match(game,/localStorage\.setItem\(qaKey/);
assert.doesNotMatch(game,/\$\('hint'\)\.textContent=''/);

function world(extra){
 return {active:true,panel:'',station:false,work:false,search:false,policeReport:false,canComply:false,reach:false,
  x:-20,z:10,yaw:0,time:540,day:1,curfew:false,cash:400,xp:0,level:1,called:1,room:true,tents:1,installed:true,
  can:true,trimmers:true,packStation:true,seeds:0,soil:0,wrappers:0,water:0,plant:null,raw:0,gummies:0,packs:0,
  made:0,sold:0,harvested:0,listing:false,deal:-1,thread:null,hired:false,step:.2,officers:[],customers:[{x:-7,z:21}],residents:[],...extra};
}
const camper=createDayDirector();
const spawn={...world({x:-58,z:26.7,yaw:-Math.PI/2,called:0,room:false,tents:0,installed:false,can:false,trimmers:false,packStation:false}),step:.25};
const first=camper.intent(spawn);
const second=camper.intent(spawn);
assert.equal(first.phase,'exit');
assert.ok(first.aim.x>spawn.x);
assert.equal(first.press,null);
assert.equal(first.awaitCurfew,false);
assert.ok(first.fast>0&&first.fast<4);
assert.ok(second.aim.x>spawn.x,'a 1 FPS step keeps aiming out the camper door');

const rich=createDayDirector();
const hireSnap=world({level:3,cash:700,xp:60,sold:12,harvested:12,policeReport:true,reach:true});
const hire=rich.intent(hireSnap);
assert.deepEqual(hire.action,['hire','gardener']);
const blocked=createDayDirector();
const refused=blocked.intent({...hireSnap,reach:false});
assert.equal(refused.action,null);
assert.equal(refused.phase,'hire');
const early=createDayDirector();
assert.notEqual(early.intent({...hireSnap,level:1,xp:0,cash:700,policeReport:true}).action?.[0],'hire');

const evening=createDayDirector();
const ready=world({level:3,cash:80,xp:60,sold:12,harvested:12,hired:true,policeReport:true,seeds:0,soil:0,wrappers:0});
const wait=evening.intent(ready);
assert.equal(wait.awaitCurfew,true);
assert.equal(wait.done,false);
assert.ok(wait.fast>=4);
const seen=evening.intent({...ready,curfew:true,time:1320,step:10,residents:[{name:'Jules',status:'Walking to the usual meeting spot'}]});
assert.equal(seen.done,false);
assert.equal(seen.awaitCurfew,true);
const finished=evening.intent({...ready,curfew:true,time:1330,step:30,residents:[{name:'Jules',status:'Indoors for curfew · the usual meeting spot'}]});
assert.equal(finished.done,true);
assert.equal(finished.fast,0);
assert.equal(finished.awaitCurfew,false);
assert.ok(evening.report().events.some(event=>event.note==='curfew started'));
console.log('PASS: day harness stays off without ?qa=day, holds the camper exit, and fast-forwards only for the 22:00 watch.');
