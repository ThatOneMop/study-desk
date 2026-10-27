import assert from 'node:assert/strict';
import {workshopMovePlan,commitWorkshopMove,readWorkshopMove} from '../dist/workshop-move.mjs';
const fresh=()=>({house:0,room:true,bank:5000,cash:400,xp:520,day:2,time:540,raw:[3],gummies:[2],packs:[4],storedPacks:[8],wrappers:5,plants:[{phase:'growing',t:0,end:1234}],deals:[{npc:0,t:0,qty:1,price:30}],layout:{'0:0':{x:1,z:2,r:0}},crafterCargo:null});
for(const phase of ['input','output']){
 const s=fresh();s.crafterCargo={phase,source:'raw',index:0,home:0};const preserved=JSON.stringify([s.plants,s.deals,s.layout,s.storedPacks,s.cash]);
 const planBefore=JSON.stringify(s);assert(workshopMovePlan(s,1,1).ok);assert.equal(JSON.stringify(s),planBefore);
 assert(commitWorkshopMove(s,1,1).ok);assert.equal(s.bank,3800);assert.equal(s.house,1);assert.equal(s.crafterCargo,null);
 assert.equal(s.raw[0],phase==='input'?4:3);assert.equal(s.packs[0],phase==='output'?5:4);assert.equal(s.wrappers,phase==='input'?6:5);
 assert.equal(JSON.stringify([s.plants,s.deals,s.layout,s.storedPacks,s.cash]),preserved);
 const committed=JSON.stringify(s);assert(!commitWorkshopMove(s,1,1).ok);assert.equal(JSON.stringify(s),committed);
 assert.equal(readWorkshopMove(s.lastMove,1).cargo,phase);
 assert(commitWorkshopMove(s,2,1).ok);assert.equal(s.bank,300);assert.equal(readWorkshopMove(s.lastMove,2).to,'Hillside house');
}
for(const patch of [{bank:1199},{xp:59},{crafterCargo:{phase:'bad'}},{police:{search:{}}},{time:NaN}]){const s=Object.assign(fresh(),patch),before=JSON.stringify(s);assert(!commitWorkshopMove(s,1,1).ok);assert.equal(JSON.stringify(s),before);}
for(const to of [0,3,'1',NaN])assert(!commitWorkshopMove(fresh(),to,1).ok);
const owner=fresh();owner.room=false;assert(commitWorkshopMove(owner,1,1).ok);assert(owner.room,'deed provides a usable workspace');
const cents=fresh();cents.bank=1200.25;assert(commitWorkshopMove(cents,1,1).ok);assert.equal(cents.bank,.25);
assert.equal(readWorkshopMove(undefined,1),null);assert.equal(readWorkshopMove({from:0,to:1,day:2},2),null);
console.log('PASS: atomic deed cost/eligibility, input/output cargo recovery once, crop/order/layout/stock conservation, larger workspace access and safe optional relocation history.');
