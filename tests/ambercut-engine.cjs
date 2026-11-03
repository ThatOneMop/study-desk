const T=require('node:test'),A=require('node:assert/strict'),E=require('../games/ambercut/engine.js');
function route(site=0){let s=E.create(undefined,site),actions=[];const go=a=>{s=E.act(s,a);A.ok(s);actions.push(a)};for(let i=0;i<25;i++)if(E.near(i).every(j=>s.depth[j]>=2))go(i);go('brush');for(let i=0;i<25&&s.phase==='dig';i++)while(s.depth[i]&&s.phase==='dig')go(i);A.equal(s.phase,'won');console.log('site',site,'actions',actions.length,'strokes',s.strokes);return actions}
T('three naturally cleared trays save and progress',()=>{let s=E.create();for(let site=0;site<3;site++){for(const a of route(site)){s=E.act(s,a);A.deepEqual(E.decode(JSON.stringify(s)),s)}A.equal(s.damage.length,0);s=E.act(s,'next')}A.ok(s.records.every(x=>x!==null))});
T('reckless repeated crosses fracture fossils and retry retains records',()=>{let s=E.create([50,null,null]);for(const i of [6,7,8,12,17,16,18])while(s.depth[i]&&s.phase==='dig')s=E.act(s,i);A.equal(s.phase,'lost');A.deepEqual(E.act(s,'restart').records,[50,null,null])});
T('brush removes one layer without collateral damage',()=>{let s=E.act(E.create(),'brush'),n=E.act(s,6);A.equal(n.depth[6],s.depth[6]-1);A.equal(n.depth[7],s.depth[7]);A.equal(n.damage.length,0)});
T('malformed saves rejected',()=>{for(const p of [{site:4},{depth:[]},{strokes:-1},{phase:'won'},{damage:[0]}])A.throws(()=>E.decode(JSON.stringify({...E.create(),...p})))});
module.exports={route};



function conservation(site=0){let s=E.create([60,60,60],site,[false,false,false],true),actions=[];const go=a=>{s=E.act(s,a);A.ok(s);actions.push(a)};for(const tool of ['row','column','chisel']){go(tool);for(let i=0;i<25;i++)if(E.footprint(s,i).every(j=>!E.matrix.includes(j)&&s.depth[j]>=2))go(i)}go('brush');for(let i=0;i<25&&s.phase==='dig';i++){if(E.matrix.includes(i))continue;while(s.depth[i]&&s.phase==='dig')go(i)}A.equal(s.phase,'won');A.ok(s.seals[site]);console.log('conservation',site,'strokes',s.strokes);return actions}
T('three conservation plans preserve matrix and earn persistent seals',()=>{let s=E.create([60,60,60]);for(let site=0;site<3;site++){s=E.act(s,'commission');for(const a of conservation(site)){s=E.act(s,a);A.deepEqual(E.decode(JSON.stringify(s)),s)}A.ok(s.seals[site]);s=E.act(s,'next')}A.deepEqual(E.act(s,'restart').seals,[true,true,true])});
T('conservation unlock and corner damage are enforced',()=>{A.equal(E.act(E.create(),'commission'),null);let s=E.act(E.create([60,null,null]),'commission');s=E.act(s,0);A.equal(s.phase,'lost');A.deepEqual(E.decode(JSON.stringify(s)),s)});
T('legacy saves retain excavation and records without granting seals',()=>{const old=E.create([60,null,null]);delete old.commission;delete old.seals;const n=E.decode(JSON.stringify(old));A.deepEqual(n.records,old.records);A.deepEqual(n.depth,old.depth);A.deepEqual(n.seals,[false,false,false]);A.deepEqual(E.decode(JSON.stringify(n)),n)});
module.exports.conservation=conservation;


T('conservation saves reject disturbed active matrix and unearned unlocks',()=>{const s=E.create([60,null,null],0,[false,false,false],true);s.depth[0]--;A.throws(()=>E.decode(JSON.stringify(s)));A.throws(()=>E.decode(JSON.stringify(E.create(undefined,0,undefined,true))));A.throws(()=>E.decode(JSON.stringify(E.create(undefined,0,[true,false,false]))))});
T('large collateral fracture losses remain reloadable',()=>{let s=E.create();s.depth=s.depth.map((d,i)=>E.fossils[0].includes(i)?1:d);s=E.act(s,17);A.ok(s.damage.length>=3);A.equal(s.phase,'lost');A.deepEqual(E.decode(JSON.stringify(s)),s)});
