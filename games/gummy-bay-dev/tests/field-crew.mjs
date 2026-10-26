import assert from 'node:assert/strict';
import {TentGardener,StreetSeller,chooseGardenJob,applyWorkerSale,approachPoint} from '../dist/field-crew.mjs';
const open={minX:-2,maxX:6,minZ:-2,maxZ:4};
const gardenCtx=(extra={})=>({
 origin:{x:0,z:0},bounds:open,blocked:()=>false,maxTents:2,roomForHarvest:()=>true,unlocked:()=>true,growMs:()=>1000,now:()=>1000,
 tents:[{i:0,approach:{x:2,z:0}}],...extra
});
function gardenState(extra={}){
 return {house:0,helpers:{gardener:true},workerEnabled:{gardener:true},staffConfig:{gardener:{strain:-1,tent:-1,stock:'carried',route:'walk'}},
  installed:[0],plants:[null],trimmers:true,can:true,water:3,irrigation:false,soil:1,seeds:[1,0],raw:[0],harvested:0,watered:0,planted:0,...extra};
}
function run(worker,s,ctx,n=80){let changed=0;for(let i=0;i<n;i++)if(worker.tick(s,.06,ctx))changed++;return changed;}
let s=gardenState({plants:[{phase:'mature',t:0,waterings:2}],soil:0,seeds:[0]});
let g=new TentGardener();
assert.equal(chooseGardenJob(s,gardenCtx()).kind,'harvest');
assert.equal(run(g,s,gardenCtx()),1);
assert.equal(s.raw[0],4);assert.equal(s.plants[0],null);assert.equal(s.harvested,1);
assert.equal(run(g,s,gardenCtx(),40),0);assert.equal(s.raw[0],4);
s=gardenState({plants:[{phase:'dry',t:0,waterings:0}],seeds:[0]});
g=new TentGardener();
assert.equal(chooseGardenJob(s,gardenCtx()).kind,'water');
assert.equal(run(g,s,gardenCtx()),1);
assert.equal(s.water,2);assert.equal(s.plants[0].phase,'growing');assert.equal(s.plants[0].waterings,1);assert.equal(s.watered,1);
s=gardenState({can:false,water:0});g=new TentGardener();
assert.equal(run(g,s,gardenCtx()),1);
assert.deepEqual(s.plants[0],{phase:'dry',t:0,waterings:0});assert.equal(s.planted,1);
s=gardenState({plants:[{phase:'mature',t:0}],staffConfig:{gardener:{strain:-1,tent:-1,stock:'carried',route:'timer'}}});
g=new TentGardener();assert.equal(run(g,s,gardenCtx()),0);assert.equal(s.raw[0],0);assert.equal(g.status,'Background timer');
s=gardenState({plants:[{phase:'mature',t:0}],soil:0,seeds:[0]});g=new TentGardener();
g.tick(s,.06,gardenCtx());assert.equal(g.status,'Walking to harvest');
s.workerEnabled.gardener=false;const held=g.work;g.tick(s,.06,gardenCtx());
assert.equal(g.status,'Assignment paused');assert.equal(g.work,held);assert.equal(s.raw[0],0);
s.workerEnabled.gardener=true;assert.equal(run(g,s,gardenCtx()),1);assert.equal(s.raw[0],4);
s=gardenState({plants:[{phase:'mature',t:0}]});g=new TentGardener();
assert.equal(run(g,s,gardenCtx({blocked:()=>true})),0);assert.equal(s.raw[0],0);assert.equal(g.status,'Garden route blocked');
const sellerState=(extra={})=>({house:0,helpers:{seller:true},workerEnabled:{seller:true},staffConfig:{seller:{strain:-1,tent:-1,stock:'carried',route:'walk'}},
 packs:[2,0],cash:10,earned:0,sold:0,xp:0,heat:0,day:1,time:600,deals:[{npc:0,t:0,qty:2,price:30}],threads:{0:{status:'agreed',messages:[]}},...extra});
const sellerCtx=(blocked=()=>false)=>({contacts:[{name:'Jules',x:0,z:0}],blocked,approach:6});
let seller=new StreetSeller();s=sellerState();
seller.tick(s,0,sellerCtx());
assert.ok(Math.abs(Math.hypot(seller.position.x,seller.position.z)-6)<.02,'first assignment starts one approach away');
assert.equal(s.cash,10);
assert.equal(run(seller,s,sellerCtx(),400),1);
assert.equal(s.cash,70);assert.equal(s.earned,60);assert.equal(s.sold,2);assert.equal(s.xp,10);assert.equal(s.heat,16);assert.equal(s.packs[0],0);
assert.equal(s.deals.length,0);assert.equal(s.threads[0].status,'sold');assert.equal(s.threads[0].lastSale.total,60);
assert.equal(applyWorkerSale(s,{npc:0,t:0,qty:2,price:30}),null);
assert.equal(run(seller,s,sellerCtx(),40),0);assert.equal(s.cash,70);assert.equal(seller.status,'Waiting for an agreed deal');
s=sellerState({deals:[],packs:[5]});seller=new StreetSeller();
assert.equal(run(seller,s,sellerCtx(),80),0);assert.equal(s.packs[0],5);assert.equal(s.cash,10);
s=sellerState();seller=new StreetSeller();seller.home=0;seller.position={x:0,z:0};seller.targetNpc=0;
for(let i=0;i<10;i++)seller.tick(s,.06,sellerCtx());
assert.equal(s.cash,10);assert.ok(seller.work>0);
s.workerEnabled.seller=false;const mid=seller.work;seller.tick(s,.06,sellerCtx());
assert.equal(seller.work,mid);assert.equal(seller.status,'Assignment paused');
s.workerEnabled.seller=true;assert.equal(run(seller,s,sellerCtx(),30),1);assert.equal(s.cash,70);assert.equal(s.earned,60);
s=sellerState();seller=new StreetSeller();seller.home=0;seller.position={x:10,z:0};
assert.equal(run(seller,s,sellerCtx(x=>x>4),40),0);assert.equal(s.packs[0],2);assert.equal(seller.status,'Delivery route blocked');
s=sellerState({staffConfig:{seller:{strain:-1,tent:-1,stock:'carried',route:'timer'}}});seller=new StreetSeller();seller.position={x:0,z:0};
assert.equal(run(seller,s,sellerCtx(),40),0);assert.equal(s.cash,10);assert.equal(seller.status,'Background timer');
assert.equal(approachPoint({x:0,z:0},()=>true),null);
console.log('PASS: walking gardener harvests, waters with one charge and plants; walking seller pays an agreed deal once.');
console.log('PASS: timer routes, pause and a blocked path leave stock unchanged.');
