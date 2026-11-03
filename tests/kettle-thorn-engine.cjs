const T=require('node:test'),A=require('node:assert/strict'),E=require('../games/kettle-thorn/engine.js');
function career(){let s=E.create(),actions=[];for(let i=0;i<600&&s.best<12;i++){let a;if(s.phase==='shop'){a=s.bag[3]>1&&s.coins>=10?'prune':s.coins>=6&&E.total(s.bag)<15?'flower':'next'}else a=s.drawn.length&&(E.award(s)>=12||s.heat>=2&&E.award(s)>0||!E.total(s.left))?'bank':'draw';s=E.act(s,a);A.ok(s);actions.push(a)}A.ok(s.best>=12);return actions}
T('earned bag progression reaches keeper seal',()=>{let s=E.create();const r=career();for(const a of r){s=E.act(s,a);A.deepEqual(E.decode(JSON.stringify(s)),s)}A.ok(s.bag[3]<3);console.log('career actions',r.length,'best',s.best)});
T('overdrawing spoils only current brew',()=>{let s=E.create();while(s.phase==='brew')s=E.act(s,'draw');A.equal(s.coins,0);A.ok(s.heat>=4);s=E.act(s,'next');A.equal(s.heat,0);A.deepEqual(s.left,s.bag)});
T('reload cannot reroll and restart keeps best',()=>{let s=E.create();s=E.act(s,'draw');A.deepEqual(E.act(E.decode(JSON.stringify(s)),'draw'),E.act(s,'draw'));A.equal(E.act({...s,best:9},'restart').best,9);A.equal(E.act(s,'flower'),null)});
T('invalid saves reject',()=>{for(const patch of [{heat:4},{left:[0,0,0,0]},{seed:-1},{bag:[4,1,1,0]}])A.throws(()=>E.decode(JSON.stringify({...E.create(),...patch})))});
module.exports={career};
