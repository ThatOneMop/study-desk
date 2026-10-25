import assert from 'node:assert/strict';
import {RV_SUPPORT,RV_PROP_ROOF,RV_PROP_VENT,rvFloorHeight,rvCeilingHeight,rvPropBands} from '../dist/rv-support.mjs';
import {limitPlayerJump,playerViewHeights,playerHeadFits,PLAYER_HEAD_MARGIN} from '../dist/player-view.mjs';
assert.ok(Object.isFrozen(RV_SUPPORT));
for(const [x,z] of [[-58,26.7],[-57.5,26.7],[-59.5,26],[-56,27]]){assert.equal(rvFloorHeight(x,z),.94);assert.equal(rvCeilingHeight(x,z),3.02);}
assert.equal(rvFloorHeight(-60,26),0);assert.equal(rvFloorHeight(-55.4,27),.94);assert.equal(rvFloorHeight(-53.5,27),0);
let last=1;for(let i=0;i<=1900;i++){const x=-55.4+i/1000,height=rvFloorHeight(x,27);assert.ok(height>=0&&height<=.94);assert.ok(height<=last+.000001);if(i)assert.ok(last-height<.0005);last=height;}
assert.equal(rvFloorHeight(-54,27.86),0);assert.equal(rvCeilingHeight(-55.7,27),Infinity);
for(const p of [[NaN,27],[-58,Infinity],[200,80],[0,0]]){assert.equal(rvFloorHeight(...p),0);assert.equal(rvCeilingHeight(...p),Infinity);}
const input={ground:.94,crouch:0,jump:.6,vertical:4.6,ceiling:3.02},before=JSON.stringify(input),capped=limitPlayerJump(input);
assert.ok(Math.abs(capped.jump-.16)<1e-9);assert.equal(capped.vertical,0);assert.equal(JSON.stringify(input),before);
assert.deepEqual(limitPlayerJump({...input,vertical:-1}),{jump:capped.jump,vertical:-1});
assert.deepEqual(limitPlayerJump({...input,ceiling:Infinity}),{jump:.6,vertical:4.6});
assert.equal(playerHeadFits({...input,jump:.16}),true);assert.equal(playerHeadFits({...input,jump:.17}),false);assert.equal(playerHeadFits({...input,ceiling:Infinity}),true);
for(const crouch of [0,.1,.3,.5])for(const jump of [0,.01,.18,.4,.8,2]){
 const limited=limitPlayerJump({...input,crouch,jump});const view=playerViewHeights({ground:.94,crouch,jump:limited.jump});assert.ok(view.eye+PLAYER_HEAD_MARGIN<=3.02000001);
}
for(const v of [NaN,Infinity,-Infinity,-1e20,1e20]){const p=limitPlayerJump({ground:v,crouch:v,jump:v,vertical:v,ceiling:v});assert.ok(Object.values(p).every(Number.isFinite));assert.ok(p.jump>=0&&p.jump<=2);}
assert.ok(Object.isFrozen(RV_PROP_ROOF)&&Object.isFrozen(RV_PROP_VENT));
assert.deepEqual(rvPropBands(-58,24.3),[RV_PROP_ROOF,RV_PROP_VENT]);
assert.deepEqual(rvPropBands(-58,26.7),[RV_PROP_ROOF]);
assert.deepEqual(rvPropBands(RV_PROP_VENT.minX-.001,24.3),[RV_PROP_ROOF]);
for(const p of [[NaN,24.3],[-58,Infinity],[0,0]])assert.deepEqual(rvPropBands(...p),[]);
console.log('PASS: exported-height RV support, unchanged interior/ramp footprint, finite main-roof/rooftop-vent crate bands, smooth bounded doorway slope, finite/outside fallback and head-margin jump cap with upward-velocity release. No rendered entry/head-clearance claim.');
