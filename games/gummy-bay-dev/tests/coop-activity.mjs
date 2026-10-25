import assert from 'node:assert/strict';
import {COOP_ACTIVITY_LIMIT,acceptCoopActivity,activitySnapshot,appendCoopActivity,coopActivityLine,deriveCoopActivity} from '../dist/coop-activity.mjs';

const state={cash:100,bank:0,day:1,packs:[0,0],storedPacks:[0,0],raw:[1,0],gummies:[0,0],seeds:[1,0],ingredients:[0],plants:[],helpers:{crafter:false},workerEnabled:{crafter:true},staffConfig:{},deals:[],ledger:[]};
const before=activitySnapshot(state),after=activitySnapshot({...state,cash:85,can:true});
const bought=deriveCoopActivity('buyCan',[],before,after,'Host',100,1);
assert.deepEqual(bought,{sequence:1,at:100,actor:'Host',key:'buyCan',item:null,amount:1});
assert.ok(Object.isFrozen(before)&&Object.isFrozen(bought));
assert.equal(deriveCoopActivity('buyCan',[],before,before,'Host',100,2),null,'no-op is not activity');
assert.equal(deriveCoopActivity('payment',[],before,after,'Host',100,2),null,'UI preference is not shared work');
assert.equal(deriveCoopActivity('visitPlace',[],before,after,'Host',100,2),null,'visits do not spam the feed');
assert.equal(deriveCoopActivity('grabProp',[],before,after,'Host',100,2),null,'prop play does not spam the feed');
const packed=deriveCoopActivity('pack',[1],activitySnapshot(state),activitySnapshot({...state,packs:[0,3],gummies:[0,0]}),'Partner',101,2);
assert.deepEqual(packed,{sequence:2,at:101,actor:'Partner',key:'pack',item:1,amount:3});
assert.equal(coopActivityLine(packed,['Pine Pop','Lemon Fizz']),'Partner packed gummies · Lemon Fizz ×3');
const accepted=acceptCoopActivity({type:'activity',event:packed},1);assert.equal(accepted.ok,true);assert.deepEqual(accepted.event,packed);assert.ok(Object.isFrozen(accepted)&&Object.isFrozen(accepted.event));
assert.equal(acceptCoopActivity({type:'activity',event:packed},2).reason,'sequence');
for(const event of [
 {...packed,sequence:3,actor:'Intruder'}, {...packed,sequence:3,key:'<img>'}, {...packed,sequence:3,item:64}, {...packed,sequence:3,item:'1'}, {...packed,sequence:3,amount:0}, {...packed,sequence:3,amount:1000}, {...packed,sequence:3,at:NaN}
])assert.equal(acceptCoopActivity({type:'activity',event},2).ok,false);
assert.equal(acceptCoopActivity({type:'activity',event:{...packed,sequence:3,__proto__:{key:'pack'}}},2).ok,true,'own canonical fields survive a hostile prototype');
let feed=[];for(let sequence=1;sequence<=12;sequence++)feed=appendCoopActivity(feed,Object.freeze({...bought,sequence}));
assert.equal(feed.length,COOP_ACTIVITY_LIMIT);assert.deepEqual(feed.map(e=>e.sequence),[5,6,7,8,9,10,11,12]);assert.ok(Object.isFrozen(feed));
assert.deepEqual(state.cash,100,'input state remains untouched');
console.log('PASS: canonical co-op activity derivation, no-op/noise exclusion, replay and hostile-shape rejection, immutable bounded feed and safe copy.');
