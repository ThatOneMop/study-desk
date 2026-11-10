'use strict';
const assert=require('node:assert/strict'),{Game:Bridge,materials,contracts}=require('../games/loadline/engine.js'),{Game:Mine,W,H}=require('../games/deep-shift/engine.js');
// Find and drive a worst-case-safe bridge for every hand-authored contract.
for(let n=0;n<contracts.length;n++){
 let best;
 for(let mask=0;mask<(1<<(contracts[n].n-1));mask++){
  const g=new Bridge(n);
  for(let b=1;b<g.deck.length;b++)if(mask&(1<<(b-1)))g.braces.add(b);
  for(let i=0;i<g.deck.length;i++){
   const d=Math.min(i+.5,g.deck.length-i-.5,...[...g.braces].map(b=>Math.abs(i+.5-b)));
   const load=g.contract.mass*(.8+d*.56)+g.contract.wind;
   g.deck[i]=materials.findIndex(m=>m.strength>=load);
  }
  if(!g.deck.includes(-1)&&g.remaining>=0&&(!best||g.spent<best.spent))best=g;
 }
 assert(best,`Contract ${n+1} must have an affordable safe blueprint`);
 assert(best.launch());for(let i=0;i<2000&&best.state==='test';i++)best.step(.04);
 assert.equal(best.state,'won',`Contract ${n+1} must be crossable`);
}
const bridge=new Bridge();assert.equal(bridge.launch(),false,'missing deck blocks test');bridge.deck.fill(0);assert(bridge.launch());for(let i=0;i<2000&&bridge.state==='test';i++)bridge.step(.04);assert.equal(bridge.state,'failed','underbuilt timber span must buckle');const retained=bridge.deck.slice();bridge.retry();assert.deepEqual(bridge.deck,retained);assert.equal(bridge.state,'build');assert(bridge.place(0,2));const spend=bridge.spent;assert.equal(bridge.place(1,2),false,'reject overbudget edit');assert.equal(bridge.spent,spend);assert(bridge.place(0,-1));assert.equal(bridge.spent,spend-35);assert(bridge.brace(2));assert(bridge.brace(2));assert.equal(bridge.braces.size,0,'brace refunds on removal');
const mine=new Mine();assert.equal(mine.state,'ready');mine.start();assert.equal(mine.state,'playing');assert.equal(mine.tiles.length,W*H);assert(mine.seen.some(Boolean)&&mine.seen.some(v=>!v));const air=mine.oxygen;assert(mine.scan());assert.equal(mine.oxygen,air-10);assert.equal(mine.scans,1);mine.y=3;mine.tiles[mine.index+1]={type:5,hp:3};assert.equal(mine.move(1,0),false,'gold requires multiple drill strokes');mine.step(.2);mine.move(1,0);mine.step(.2);assert(mine.move(1,0));assert.equal(mine.haul,65);mine.step(.2);mine.tiles[mine.index+1]={type:6,hp:1};const hp=mine.hp;mine.move(1,0);assert.equal(mine.hp,hp-1,'gas damages hull');mine.haul=100;mine.y=2;mine.tiles[1*W+mine.x]={type:0,hp:1};mine.step(.2);mine.move(0,-1);assert.equal(mine.state,'won');assert.equal(mine.meta.bank,100);assert.equal(mine.meta.rank,1);mine.finish('lost','late loss');assert.equal(mine.state,'won','terminal state cannot be overwritten');assert(mine.buy(0));assert.equal(mine.meta.bank,30);mine.start();assert.equal(mine.maxOxygen,130,'tank upgrade applies next shift');mine.haul=200;assert(mine.extract());assert.equal(mine.meta.bank,160);assert.equal(mine.meta.rank,1,'emergency lift never completes a quota');mine.start();mine.haul=999;const bank=mine.meta.bank;mine.oxygen=.01;mine.step(1);assert.equal(mine.state,'lost');assert.equal(mine.meta.bank,bank,'death cannot bank haul');const again=new Mine(mine.meta);assert.equal(again.meta.bank,bank);assert.equal(again.meta.upgrades[0],1);const malformed=new Mine({bank:Infinity,rank:99,upgrades:[99,-1,1.5],runs:NaN});assert.equal(malformed.meta.bank,0);assert.equal(malformed.meta.rank,5);assert.deepEqual(malformed.meta.upgrades,[4,0,1]);
// Demonstrate a safe full-quota return on an untouched generated mine using drill navigation.
const run=new Mine().start();let path=[];function move(dx,dy){for(let tries=0;tries<5;tries++){run.step(.2);if(run.move(dx,dy))return true;if(run.state!=='playing')return false}return false}
// Surface access plus the shallow seams allow a profitable, survivable first shift.
function routeTo(tx,ty){const queue=[[run.x,run.y,[]]],seen=new Set([run.index]);while(queue.length){const [x,y,p]=queue.shift();if(x===tx&&y===ty)return p;for(const d of [[0,1],[-1,0],[1,0],[0,-1]]){const nx=x+d[0],ny=y+d[1],idx=ny*W+nx;if(nx<1||nx>=W-1||ny<2||ny>=10||seen.has(idx)||[6,7].includes(run.tiles[idx].type))continue;seen.add(idx);queue.push([nx,ny,[...p,d]])}}}
for(let k=0;k<10&&run.haul<run.quota;k++){
 let candidates=[];for(let y=3;y<8;y++)for(let x=1;x<W-1;x++)if([3,4,5].includes(run.tiles[y*W+x].type)){const p=routeTo(x,y);if(p)candidates.push({x,y,p})}candidates.sort((a,b)=>a.p.length-b.p.length);assert(candidates.length);for(const d of candidates[0].p){assert(move(...d));path.push(d)}
}
assert(run.haul>=run.quota,'generated mine includes a reachable first quota');for(const d of path.reverse())assert(move(-d[0],-d[1]));assert.equal(run.state,'won');assert(run.oxygen>0);
console.log('New games: six affordable bridge contracts, crossing/buckling/edit refunds; mining/drill hardness, gas, scan, full return, emergency lift, permanent upgrades, loss, save validation, and real generated-mine quota route passed.');
