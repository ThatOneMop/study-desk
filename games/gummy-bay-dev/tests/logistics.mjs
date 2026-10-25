import assert from 'node:assert/strict';
import {StockroomCrafter,findRoute,pickupCargo,processCargo,depositCargo,releaseCargo,validCargo} from '../dist/workshop-logistics.mjs';
const fresh=()=>({house:0,room:true,packStation:true,wrappers:1,raw:[1],gummies:[0],packs:[0],storedPacks:[0],made:0,helpers:{crafter:true},workerEnabled:{crafter:true},staffConfig:{crafter:{strain:-1,stock:'stored'}}});
const count=s=>s.raw[0]+s.gummies[0]+s.packs[0]+s.storedPacks[0]+(s.crafterCargo?1:0);
const ctx={source:{x:0,z:0},station:{x:2,z:0},storage:{x:2,z:2},bounds:{minX:-1,maxX:3,minZ:-1,maxZ:3},blocked:()=>false,occupied:false,capacity:10,full:()=>false};
let s=fresh(),w=new StockroomCrafter();for(let i=0;i<600;i++){w.tick(s,.06,ctx);assert.equal(count(s),1);assert(s.wrappers>=0);}assert.equal(s.storedPacks[0],1);assert.equal(s.made,1);assert.equal(s.wrappers,0);
s=fresh();assert(pickupCargo(s));assert.equal(pickupCargo(s),false);assert.equal(s.raw[0],0);assert.equal(count(s),1);
let loaded=JSON.parse(JSON.stringify(s));assert(validCargo(loaded.crafterCargo,1));assert(processCargo(loaded));assert.equal(processCargo(loaded),false);assert.equal(depositCargo(loaded,0),false);assert.equal(count(loaded),1);assert(depositCargo(loaded,1));assert.equal(depositCargo(loaded,1),false);assert.equal(count(loaded),1);
s=fresh();pickupCargo(s);s.workerEnabled.crafter=false;w=new StockroomCrafter();for(let i=0;i<30;i++)w.tick(s,.06,ctx);assert.equal(s.crafterCargo.phase,'input');assert.equal(count(s),1);s.staffConfig.crafter.stock='carried';w.tick(s,.06,ctx);assert.equal(s.raw[0],1);assert.equal(s.wrappers,1);assert.equal(s.crafterCargo,null);
s=fresh();pickupCargo(s);processCargo(s);s.house=1;w.tick(s,.06,ctx);assert.equal(s.packs[0],1);assert.equal(count(s),1);
s=fresh();w=new StockroomCrafter();w.tick(s,.06,{...ctx,blocked:(x,z)=>x>.5&&x<1.5});assert.equal(w.status,'Route blocked');assert.equal(s.raw[0],1);assert.equal(s.wrappers,1);
assert(findRoute({x:0,z:0},{x:2,z:0},ctx.bounds,(x,z)=>x>.5&&x<1.5&&Math.abs(z)<.4));
assert.equal(findRoute({x:0,z:0},{x:2,z:0},ctx.bounds,(x,z)=>x>.5&&x<1.5),null);
assert(!validCargo({phase:'output',source:'raw',index:100,home:0},1));
console.log('PASS physical worker: complete delivery, conservation each tick, duplicate pickup/process/deposit, save reload cargo, full output, pause, assignment/property recovery, routing and invalid cargo.');
// Manual production cannot consume a unit already picked up by the worker.
const {commitProduction}=await import('../dist/business-core.mjs');
s=fresh();s.ingredients=[0];s.deals=[];s.mixed=0;s.xp=0;pickupCargo(s);
assert.equal(commitProduction(s,{kind:'make',index:0,count:1},1,1).ok,false);assert.equal(count(s),1);
// Missing inputs do not trigger a path search every simulation frame.
s=fresh();s.raw=[0];let checks=0;w=new StockroomCrafter();w.tick(s,.06,{...ctx,blocked:()=>{checks++;return false;}});assert.equal(checks,0);
// Pause during work retains partial runtime progress, then completes exactly once.
s=fresh();w=new StockroomCrafter();for(let i=0;i<100&&w.status!=='Shaping and packaging';i++)w.tick(s,.06,ctx);
const progress=w.progress;s.workerEnabled.crafter=false;for(let i=0;i<100;i++)w.tick(s,.06,ctx);assert.equal(w.progress,progress);s.workerEnabled.crafter=true;for(let i=0;i<300;i++)w.tick(s,.06,ctx);assert.equal(s.storedPacks[0],1);
console.log('PASS: manual/worker competition, idle pathfinding cost and mid-task pause/resume.');
