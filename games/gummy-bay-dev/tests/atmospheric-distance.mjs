import assert from 'node:assert/strict';
import {ATMOSPHERIC_FIXED_VIEWS,atmosphericDistancePlan,atmosphericFogFactor,atmosphericViewSeparation} from '../dist/atmospheric-distance.mjs';

for(const quality of ['performance','balanced','high'])for(const daylight of [0,.08,.25,.5,1]){
 const plan=atmosphericDistancePlan({daylight,quality});
 assert(Number.isFinite(plan.near)&&Number.isFinite(plan.far)&&plan.near>=80&&plan.far<=298&&plan.far-plan.near>=160);
 assert(plan.waterNear<plan.near&&plan.waterFar<plan.far&&plan.waterFar>plan.waterNear);
 assert.equal(atmosphericFogFactor(plan.near,plan),0);assert.equal(atmosphericFogFactor(plan.far,plan),1);
 for(const view of ATMOSPHERIC_FIXED_VIEWS){const sample=atmosphericViewSeparation(view,plan);assert(sample&&sample.separated,`${quality} ${daylight} ${view.id}`);assert(sample.foreground<sample.town&&sample.town<sample.backdrop);}
}
assert(atmosphericDistancePlan({daylight:1,quality:'performance'}).far<atmosphericDistancePlan({daylight:1,quality:'balanced'}).far);
assert(atmosphericDistancePlan({daylight:1,quality:'balanced'}).far<atmosphericDistancePlan({daylight:1,quality:'high'}).far);
for(const input of [undefined,null,{},NaN,Infinity,-Infinity,-1,999])assert(atmosphericFogFactor(input,atmosphericDistancePlan())>=0&&atmosphericFogFactor(input,atmosphericDistancePlan())<=1);
assert.equal(atmosphericViewSeparation({foreground:1,town:1,backdrop:2}),null);assert.equal(atmosphericDistancePlan({daylight:NaN,quality:'bogus'}).quality,'balanced');
console.log('PASS: four fixed town cameras retain crisp foregrounds, graded town depth and softened backdrops across day/night and all quality modes; CPU fog factors only, not rendered atmospheric acceptance.');
