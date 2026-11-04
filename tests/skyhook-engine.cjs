const E=require('../games/skyhook/engine'),A=require('node:assert/strict'),{test}=require('node:test');
const settle=s=>{for(let i=0;i<900;i++)s=E.step(s,1/60);return s};
function deliver(s){const x=90+20*Math.round((E.target(s)-90)/20);while(s.x<x)s=E.act(s,'right');s=settle(s);for(let i=0;i<6;i++)s=E.act(s,'down');s=settle(s);return E.act(s,'drop')}
test('three deliveries and persistent score across restart/new shift',()=>{let s=E.create();for(let i=0;i<3;i++){s=deliver(s);A.equal(s.job,i+1)}A.equal(s.phase,'won');A.equal(s.bumps,0);A.ok(s.records[1]>0);A.deepEqual(E.act(s,'restart').records,s.records);A.equal(E.act(s,'next').seed,2);A.deepEqual(E.decode(JSON.stringify(s)),s)});
test('rough drop returns cargo but preserves prior delivery',()=>{let s=deliver(E.create());s=E.act(s,'drop');A.equal(s.job,1);A.equal(s.bumps,1);A.equal(s.x,90)});
test('extended cable hits roof; short cable crosses safely',()=>{let s=E.create();s.rope=220;s.x=250;s=E.step(s,.02);A.equal(s.bumps,1);s=E.create();s.x=250;s=E.step(s,.02);A.equal(s.bumps,0)});
test('reject corrupt geometry and impossible completion',()=>{for(const patch of [{rope:300},{job:3},{angle:null},{records:[]}])A.throws(()=>E.decode(JSON.stringify({...E.create(),...patch})))});
module.exports={deliver,settle};
