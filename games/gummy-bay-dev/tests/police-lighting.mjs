import assert from 'node:assert/strict';
import {policeLighting} from '../dist/police-lighting.mjs';
const camera={x:0,z:0},officer=(x=0,z=4,mode='stop',target='host')=>({x,z,mode,target}),police={officers:[officer()]};
const options={night:1,now:.5},before=JSON.stringify(police);
assert.equal(policeLighting(police,camera,options).target.intensity,6*(1-16/324));
assert.equal(policeLighting(police,camera,{...options,now:.5}).target.blend,1);
assert.equal(policeLighting(police,camera,{...options,now:1.5}).target.blend,0);
for(const option of [{active:false},{connected:false},{stale:true}])assert.deepEqual(policeLighting(police,camera,{...options,...option}),{signals:[],target:null});
for(const value of [null,{}, {x:NaN,z:0},{x:0,z:Infinity}])assert.deepEqual(policeLighting(police,value,options),{signals:[],target:null});
for(const c of [null,officer(NaN),officer(0,0,'patrol'),officer(0,0,'bad'),officer(0,0,'stop','unknown')])assert.equal(policeLighting({officers:[c]},camera,options).signals.length,0);
for(const quality of ['balanced','high'])assert.ok(policeLighting(police,camera,{...options,quality}).target);
for(const option of [{quality:'performance'},{night:0},{night:NaN},{night:-2}]){const plan=policeLighting(police,camera,{...options,...option});assert.equal(plan.target,null);assert.equal(plan.signals.length,1);}
assert.equal(policeLighting(police,camera,{...options,sight:()=>false}).signals.length,0);
assert.equal(policeLighting({officers:[officer(0,18)]},camera,options).target,null);
assert.equal(policeLighting({officers:[officer(0,35.99)]},camera,options).signals.length,1);
assert.equal(policeLighting({officers:[officer(0,36)]},camera,options).signals.length,0);
const candidates={officers:[officer(0,10),officer(0,2),officer(0,-2,'pursuit','guest'),officer(0,3),officer(0,4),officer(0,5),officer(0,0)]};
assert.equal(policeLighting(candidates,camera,options).target.index,1); // bounded six, deterministic equal-distance tie
assert.equal(policeLighting(candidates,camera,{...options,sight:c=>c.z!==2}).target.index,2);
for(let i=0;i<10000;i++){
 const plan=policeLighting(police,camera,{night:i/1000,now:i/600});
 assert.ok(i===0?plan.target===null:plan.target.intensity>0&&plan.target.intensity<=6);
 assert.ok(plan.signals[0].blend>=0&&plan.signals[0].blend<=1);
 if(i>0)assert.ok(Math.abs(plan.signals[0].blend-policeLighting(police,camera,{now:(i-1)/600}).signals[0].blend)<.003);
}
assert.equal(JSON.stringify(police),before);
for(const now of [Infinity,NaN,-1e308,1e308])assert.ok(Number.isFinite(policeLighting(police,camera,{...options,now}).signals[0].blend));
console.log('PASS: bounded six-officer/one-response selector, continuous two-second cycle, nearest/tie/occlusion, valid role/mode/pose, quality/night/range/connection gates and 10000 finite read-only samples; no rendered illumination claim.');
