const assert=require('node:assert/strict');
const P=require('../games/prism-post/engine.js'),O=require('../games/orbit-orchard/engine.js');
for(let i=0;i<P.routes.length;i++){
 const l=P.level(i),original=l.mirrors.map(m=>m.value);assert(!P.trace(l).won,`route ${i+1} begins unsolved`);
 l.mirrors.forEach(m=>m.value=m.solution);const result=P.trace(l);
 assert(result.won,`route ${i+1} solution lights all lanterns`);assert(!result.loop);assert.equal(result.lit.length,l.targets.length);
 assert(l.mirrors.some((m,k)=>m.value!==original[k]));
}
// A correctly positioned basket catches gold, scores a combo, and ignores distant thorns.
let s=O.create();s.spawn=10;s.angle=0;s.items=[{angle:0,r:.785,speed:.3,hazard:false,checked:false}];O.step(s,.05);assert.equal(s.fruit,1);assert.equal(s.combo,1);assert.equal(s.score,12);
s.items=[{angle:0,r:.785,speed:.3,hazard:true,checked:false}];O.step(s,.05);assert.equal(s.shield,2);assert.equal(s.combo,0);
s.items=[{angle:Math.PI,r:.785,speed:.3,hazard:true,checked:false}];O.step(s,.05);assert.equal(s.shield,2);
s.items=[{angle:Math.PI,r:.785,speed:.3,hazard:false,checked:false}];O.step(s,.05);assert.equal(s.shield,2);assert(s.events.includes('miss'));
for(let round=1,score=0;round<=3;round++){
 s=O.create(round,score);s.spawn=10;s.angle=0;
 for(let n=0;n<s.quota;n++){s.items=[{angle:0,r:.785,speed:.3,hazard:false,checked:false}];O.step(s,.05);}
 assert.equal(s.state,'won',`season ${round} completes with quota`);assert.equal(s.fruit,s.quota);assert(s.score>score);score=s.score;
}
s=O.create();s.spawn=10;s.angle=0;for(let n=0;n<3;n++){s.items=[{angle:0,r:.785,speed:.3,hazard:true,checked:false}];O.step(s,.05);}assert.equal(s.state,'lost');
s=O.create();s.time=39.99;s.spawn=10;O.step(s,.05);assert.equal(s.state,'lost');
s=O.create();s.spawn=10;O.step(s,.05,1);assert(O.distance(s.angle,-Math.PI/2)>0);assert(O.distance(.01,O.TAU-.01)<.03);
s.target=0;for(let i=0;i<10;i++)O.step(s,.05);assert(O.distance(s.angle,0)<.001);
console.log('PASS new games: all 8 authored puzzles solvable, three arcade seasons, catch/miss/thorn/timeout/steering loops');
