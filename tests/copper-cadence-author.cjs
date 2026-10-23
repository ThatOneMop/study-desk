// Authored input sketches. Run to inspect their sounds during level design, never to rewrite a regression's target score.
const E=require('../games/copper-cadence/engine.js'),fs=require('fs'),a=(feed=null,brakes=0,shift=0)=>({feed,brakes,shift});
const plans=[
 [a(0),a(),a(0),a(),a(0),a(),a(0),a(),a(),a()],
 [a(0),a(1),a(),a(0),a(1),a(),a(0),a(),a(1),a(),a(),a()],
 [a(0),a(1),a(null,1),a(null,1),a(0),a(1),a(null,1),a(null,1),a(),a(),a(),a()],
 [a(0),a(1),a(0,0,2),a(2),a(1,0,2),a(null,0,0),a(0),a(null,0,2),a(1,0,0),a(null,0,2),a(),a(null,0,2),a(),a()],
 [a(0),a(1),a(2,1),a(null,1),a(null,3),a(null,3),a(2),a(1),a(0),a(null,3),a(null,7),a(null,7),a(null,7),a(),a(),a()]
];
const out=plans.map((actions,job)=>{let s=E.create(job);for(const a of actions){const r=E.step(s,a);if(!r.ok)throw Error(job+' '+s.beat+' '+r.reason);s=r.state;}console.log(job,JSON.stringify(s.heard),'errors',s.errors,'brakes',s.brakeTurns,'medals',E.medal(s));return {job,actions};});
fs.writeFileSync(__dirname+'/fixtures/copper-cadence-routes.json',JSON.stringify(out,null,2)+'\n');
