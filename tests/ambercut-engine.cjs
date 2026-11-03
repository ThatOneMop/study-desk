const T=require('node:test'),A=require('node:assert/strict'),E=require('../games/ambercut/engine.js');
function route(site=0){let s=E.create(undefined,site),actions=[];const go=a=>{s=E.act(s,a);A.ok(s);actions.push(a)};for(let i=0;i<25;i++)if(E.near(i).every(j=>s.depth[j]>=2))go(i);go('brush');for(let i=0;i<25&&s.phase==='dig';i++)while(s.depth[i]&&s.phase==='dig')go(i);A.equal(s.phase,'won');console.log('site',site,'actions',actions.length,'strokes',s.strokes);return actions}
T('three naturally cleared trays save and progress',()=>{let s=E.create();for(let site=0;site<3;site++){for(const a of route(site)){s=E.act(s,a);A.deepEqual(E.decode(JSON.stringify(s)),s)}A.equal(s.damage.length,0);s=E.act(s,'next')}A.ok(s.records.every(x=>x!==null))});
T('reckless repeated crosses fracture fossils and retry retains records',()=>{let s=E.create([50,null,null]);for(const i of [6,7,8,12,17,16,18])while(s.depth[i]&&s.phase==='dig')s=E.act(s,i);A.equal(s.phase,'lost');A.deepEqual(E.act(s,'restart').records,[50,null,null])});
T('brush removes one layer without collateral damage',()=>{let s=E.act(E.create(),'brush'),n=E.act(s,6);A.equal(n.depth[6],s.depth[6]-1);A.equal(n.depth[7],s.depth[7]);A.equal(n.damage.length,0)});
T('malformed saves rejected',()=>{for(const p of [{site:4},{depth:[]},{strokes:-1},{phase:'won'},{damage:[0]}])A.throws(()=>E.decode(JSON.stringify({...E.create(),...p})))});
module.exports={route};

