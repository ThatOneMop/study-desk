import assert from 'node:assert/strict';import fs from 'node:fs';
import * as N from '../dist/dealer-network.mjs';
const price=t=>[30,40,56][t]||30;
const ctxFor=(to,extra={})=>({to,price,baseCount:3,bestBase:()=>0,seedCost:()=>30,name:()=>'Pine Pop',storageLeft:()=>0,benchPlan:()=>null,benchUse:()=>false,...extra});
const regular=i=>({name:['Jules','Benji','Nina','Oz'][i]||'X',appetite:1,budget:1,every:16});
// Recruit, then hand over your own regulars (one dealer each, cap shared with locals).
let e=N.freshEmpire(0,7);assert.ok(N.recruitDealer(e,'benny',{level:5,cash:999}).ok);assert.ok(N.recruitDealer(e,'mo',{level:5,cash:999}).ok);
assert.deepEqual(e.dealers.benny.regulars,[]);assert.equal(e.dealers.benny.float,0);
assert.ok(N.assignRegular(e,'benny',2).ok);assert.ok(N.assignRegular(e,'benny',0).ok);
assert.equal(N.assignRegular(e,'mo',2).ok,false,'a regular belongs to one dealer');assert.equal(N.regularOwner(e,2),'benny');
assert.ok(e.dealers.benny.customers.length+e.dealers.benny.regulars.length<=N.dealerOf('benny').cap);
assert.ok(N.dropRegular(e,'benny',0));assert.equal(N.regularOwner(e,0),null);
// Float and protection.
assert.equal(N.giveFloat(e,'benny',500,1000),N.ROB.floatMax);assert.equal(N.giveFloat(e,'benny',50,1000),0);
const d=N.dealerOf('benny'),x=e.dealers.benny;x.owed=600;const r0=N.robberyRisk(d,x);
assert.ok(N.buyGuard(e,'benny',1000).ok);const r1=N.robberyRisk(d,x);assert.ok(N.buyGuard(e,'benny',1000).ok);const r2=N.robberyRisk(d,x);
assert.ok(r1<r0&&r2<r1,'lockbox and buddy cut the risk');assert.equal(N.buyGuard(e,'benny',1000).ok,false);
x.owed=0;assert.ok(N.robberyRisk(d,x)<r2,'collecting cuts the risk');assert.ok(['Low','Medium','High'].includes(N.riskLabel(r0)));
// A simulated week: regulars get sales events, robbery happens sometimes, and depth off ignores regulars.
const run=(depth,guard)=>{const s={cash:0,heat:0,sold:0,xp:0,empire:N.freshEmpire(0,11)};const e=s.empire;N.recruitDealer(e,'benny',{level:5,cash:999});const x=e.dealers.benny;
 N.assignRegular(e,'benny',1);N.assignRegular(e,'benny',3);x.guard=guard;x.float=depth?100:0;let ev=[];
 for(let day=0;day<7;day++){x.stock={0:16};ev=ev.concat(N.advanceEmpire(s,ctxFor((day+1)*1440,depth?{depth:true,regular}:{})));}
 return {ev,x};};
const on=run(true,0),off=run(false,0),safe=run(true,2);
assert.ok(on.ev.some(v=>v.kind==='regular'&&[1,3].includes(v.npc)),'regulars buy from the dealer');
assert.ok(!off.ev.some(v=>v.kind==='regular'),'economy sim (no depth) is untouched');
assert.ok(on.ev.filter(v=>v.kind==='rob').length>=safe.ev.filter(v=>v.kind==='rob').length,'protection does not raise robberies');
// Normalise keeps the new fields and drops junk.
const n=N.normalizeEmpire({v:1,dealers:{benny:{hired:true,regulars:[2,2,'x',-1],float:9999,guard:7,customers:[]}}},{clock:0});
assert.deepEqual(n.dealers.benny.regulars,[2]);assert.equal(n.dealers.benny.float,N.ROB.floatMax);assert.equal(n.dealers.benny.guard,N.GUARDS.length-1);
// Game wiring.
const g=fs.readFileSync('dist/game.js','utf8');
for(const k of ['window.__dealers','dealersAppHTML','regularOwner(s.empire,i))continue','depth:true','Dealer takings','pending.push','menu(\\\'dealers\\\')'])assert.ok(g.includes(k),k);
assert.ok(/meeting:i=>\{const d=\(s\.deals/.test(g),'assistant walks to the meetup spot');
assert.ok(fs.readFileSync('dist/index.html','utf8').match(/Gummy Bay v1(59|[6-9][0-9])/));
console.log('PASS: v159 dealer depth (regulars, float, robbery + protection, Dealers app wiring, assistant meet spot) · robberies/week '+on.ev.filter(v=>v.kind==='rob').length+' vs protected '+safe.ev.filter(v=>v.kind==='rob').length);
