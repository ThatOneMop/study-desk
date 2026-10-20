'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),E=require('../dev/indie-collection/glasshouse/engine.js');let passed=0;
function test(n,f){f();passed++;console.log('PASS '+n)}
const plans=[
 {base:[[0,0],[1,2]],crosses:[[0,1,4]]},
 {base:[[0,0],[1,2],[4,6],[5,6]],crosses:[[0,4,8],[1,5,10]]},
 {base:[[0,0],[4,6],[8,1],[9,3]],crosses:[[8,9,5],[0,4,8]]},
 {base:[[0,0],[1,2],[5,6]],crosses:[[0,1,4,6],[6,5,12]]},
 {base:[[0,1],[1,3],[3,7],[5,2],[9,6]],crosses:[[0,1,5,2],[2,3,13],[5,9,10]]},
 {base:[[0,0],[1,2],[5,6],[8,1],[9,3],[13,7]],crosses:[[0,1,4,6],[6,5,12],[8,9,5],[9,13,11]]}
];
function bestPot(o,id){let best=-1,cost=Infinity;for(let i=0;i<16;i++){if(o.run.plants[i])continue;let age=0,days=0;while(age<3&&days<12){if(E.needs[E.gene(id).mask].includes(E.light(o,i,o.run.day+days)))age++;days++}if(age===3&&days<cost){best=i;cost=days}}assert.ok(best>=0,'No growing position for '+E.name(id));return best}
function solve(o,after=()=>{}){const spec=plans[o.run.index],commands=[],done=new Set();const act=(name,...args)=>{assert.ok(E[name](o,...args),JSON.stringify([name,args,o.run]));commands.push([name,...args]);after(o)};for(const [i,id]of spec.base)act('plant',i,id);
 for(let n=0;n<40&&o.run.status==='growing';n++){
  for(let i=0;i<16;i++){const p=o.run.plants[i];if(p?.age===3){const j=E.exhibitions[o.run.index].goals.findIndex((id,j)=>!o.run.delivered[j]&&id===p.gene);if(j>=0)act('submit',i,j)}}if(o.run.status!=='growing')break;
  for(let i=0;i<16;i++)if(o.run.plants[i]?.water===0&&o.run.water)act('water',i);
  for(let j=0;j<spec.crosses.length;j++){if(done.has(j))continue;const [a,b,id,fixed]=spec.crosses[j];if(E.offspring(o,a,b)!==id||!o.run.water||o.run.plants[a].lastCross===o.run.day||o.run.plants[b].lastCross===o.run.day)continue;act('cross',a,b);const pot=fixed??bestPot(o,id);act('plant',pot,id);if(o.run.water)act('water',pot);done.add(j)}
  act('advance');
 }assert.equal(o.run.status,'complete',JSON.stringify(o.run));return commands}
const routes=[];
test('six legal baseline exhibitions solve through planting, growth, breeding and deliveries',()=>{const o=E.create();for(let i=0;i<6;i++){routes.push(solve(o,s=>assert.deepEqual(E.decode(E.encode(s)),s)));console.log('EXHIBITION',i,'day',o.run.day,'actions',routes[i].length,'wilted',o.run.wilted,'medals',o.run.stars);assert.equal(o.run.stars,3);if(i<5)assert.ok(E.next(o,i+1))}assert.deepEqual(o.profile.best,[3,3,3,3,3,3]);assert.ok(o.profile.seen[12]&&o.profile.seen[13])});
test('no wall-clock growth, occupied pots, invalid inputs and locked rooms are guarded',()=>{const o=E.create(),raw=E.encode(o);assert.equal(E.next(o,5),false);assert.equal(E.plant(o,99,0),false);assert.equal(E.water(o,0),false);assert.equal(E.cross(o,0,1),false);assert.equal(E.encode(o),raw);E.plant(o,0,0);assert.equal(E.plant(o,0,2),false);assert.equal(o.run.day,0);assert.equal(o.run.plants[0].age,0)});
test('sunlight shifts, tall neighbours soften light, frosted panes reduce it',()=>{const o=E.create();assert.equal(E.light(o,4),2);E.plant(o,0,1);assert.equal(E.light(o,4),1);assert.equal(E.light(o,1,3),1);assert.equal(E.light(o,1,4),2);o.profile.best[0]=3;o.run=E.fresh(1);assert.equal(E.light(o,12),1)});
test('water is finite per day, lasts two days and two dry days cause real wilting',()=>{const o=E.create();E.plant(o,0,0);E.water(o,0);assert.equal(o.run.water,5);assert.equal(E.water(o,0),false);E.advance(o);assert.equal(o.run.plants[0].water,1);E.advance(o);assert.equal(o.run.plants[0].water,0);E.advance(o);assert.equal(o.run.plants[0].dry,1);E.advance(o);assert.equal(o.run.plants[0],null);assert.equal(o.run.wilted,1);assert.ok(E.valid(o))});
test('parent colours union, heights inherit and parents cannot cross twice per day',()=>{const o=E.create();E.plant(o,0,0);E.plant(o,1,3);for(let n=0;n<3;n++){if(!o.run.plants[0].water)E.water(o,0);if(!o.run.plants[1].water)E.water(o,1);E.advance(o)}assert.equal(E.offspring(o,0,1),4);assert.ok(E.cross(o,0,1));assert.equal(E.cross(o,0,1),false);E.water(o,0);E.water(o,1);E.advance(o);assert.equal(E.offspring(o,0,1),5);assert.ok(E.cross(o,0,1));assert.equal(E.offspring(o,0,5),null);assert.ok(E.valid(o))});
test('exhibition timeout, retry and best-only replay retain discoveries without farming',()=>{const o=E.create();solve(o);const best=E.copy(o.profile);E.retry(o);for(let n=0;n<17;n++)E.advance(o);assert.equal(o.run.status,'lost');assert.ok(E.valid(o));assert.deepEqual(o.profile,best);E.retry(o);solve(o);assert.deepEqual(o.profile,best)});
test('delivering wrong height/colour or immature plants is impossible',()=>{const o=E.create();E.plant(o,0,0);assert.equal(E.submit(o,0,0),false);for(let n=0;n<3;n++){E.water(o,0);E.advance(o)}assert.equal(E.submit(o,0,0),false);assert.equal(o.run.delivered[0],false)});
test('malformed, inconsistent, oversized, null and forged saves reject without mutation',()=>{assert.equal(E.decode('{bad'),null);assert.equal(E.decode(' '.repeat(26001)),null);for(const fn of [o=>o.profile=null,o=>o.run=null,o=>o.run.plants=null,o=>o.run.seeds[0]++,o=>o.run.sowed++,o=>o.run.delivered=[true],o=>o.run.status='complete',o=>o.profile.best=[0,3,0,0,0,0],o=>o.run.water=7,o=>o.run.plants[0]={gene:0,age:3,water:0,dry:0,lastCross:-1}]){const o=E.create();fn(o);assert.equal(E.valid(o),false);assert.equal(E.decode(JSON.stringify(o)),null)}});
if(require.main===module){fs.writeFileSync('/tmp/glasshouse-routes.json',JSON.stringify(routes));console.log(`${passed} Glasshouse engine checks passed`)}module.exports={plans,bestPot,solve};
