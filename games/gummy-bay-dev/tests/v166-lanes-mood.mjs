import assert from 'node:assert/strict';import fs from 'node:fs';
import {WINDING_LANES,LANE_HALF,LANE_EDGE,sampleLane,laneSurface,laneDistance,planLaneLots,laneLotColliders,laneBlocks,laneLampSpots,laneWalks} from '../dist/winding-lanes.mjs';
import {drivingSurfaceZone,VEHICLE_ROADS} from '../dist/road-zones.mjs';
import {DODGY,dodgyStrength,signFlicker} from '../dist/dodgy-grade.mjs';
import {EXTRA_PATROL_ROUTES} from '../dist/patrol-expansion.mjs';
// Three narrow, bendy lanes near spawn; 5.6 m asphalt with footpaths either side.
assert.equal(WINDING_LANES.length,3);assert.ok(LANE_HALF*2<6.5,'narrower than the 8.6 m spawn streets');
for(const l of WINDING_LANES){const S=sampleLane(l.pts);assert.ok(S.length>8);
 // genuinely curved: heading changes by more than 40 degrees somewhere along the lane
 const hd=S.map(p=>Math.atan2(p.tx,p.tz));let turn=0;for(let i=1;i<hd.length;i++){let d=Math.abs(hd[i]-hd[i-1]);if(d>Math.PI)d=2*Math.PI-d;turn+=d;}assert.ok(turn>.7,l.id+' bends');}
assert.equal(laneSurface(22,-54),'road');assert.equal(laneSurface(22,-54+LANE_HALF+.8),'pavement');assert.equal(laneSurface(0,40),null);
assert.equal(drivingSurfaceZone({x:44,z:-65,angle:Math.PI/2}).key,'road','van drives the lane');
// Lots sit off the lanes, facing them, never overlapping each other's footprints or a grid road.
const {lots,alleys}=planLaneLots();assert.ok(lots.length>=18,'buildings follow the curves');assert.ok(alleys.length>=lots.length-1,'alleys between buildings');
for(const lot of lots){const c=Math.cos(lot.rot),s=Math.sin(lot.rot);for(const [a,b] of [[-1,-1],[1,-1],[1,1],[-1,1]]){const x=lot.x+a*lot.w/2*c+b*lot.d/2*s,z=lot.z-a*lot.w/2*s+b*lot.d/2*c;assert.ok(laneDistance(x,z).d>=LANE_EDGE+.39,lot.id+' clear of the footpath');}
 const f=[Math.sin(lot.rot),Math.cos(lot.rot)],toLane=laneDistance(lot.x+f[0]*3,lot.z+f[1]*3).d<laneDistance(lot.x,lot.z).d;assert.ok(toLane,lot.id+' fronts the lane');
 assert.equal(laneLotColliders(lot).length,3);}
assert.ok(laneBlocks().length>20);assert.ok(laneLampSpots().length>=6);assert.equal(laneWalks().length,6);
// The east Old Town beat now walks Gutter Lane.
assert.ok(EXTRA_PATROL_ROUTES[1].some(([x,z])=>laneDistance(x,z).d<LANE_HALF),'beat cop uses the lane');
// Mood: overcast by day (sun and exposure down, grey sky), still graded at night; signs buzz after dark only.
assert.ok(DODGY.sunScale<1&&DODGY.exposure<0);assert.ok(dodgyStrength({daylight:1})===1&&dodgyStrength({daylight:0})>0);
const g=n=>(n>>16&255)-(n&255);assert.ok(Math.abs(g(DODGY.zenith))<30,'grey, not blue, sky');
let drops=0;for(let i=0;i<40;i++){assert.equal(signFlicker(i,3,0),1,'no flicker by day');for(let t=0;t<20;t+=.05){const v=signFlicker(i,t,1);assert.ok(v>0&&v<=1);if(v<.3)drops++;}}assert.ok(drops>0,'some signs drop out at night');
const game=fs.readFileSync(new URL('../dist/game.js',import.meta.url),'utf8');
assert.match(game,/installWindingLanes/);assert.match(game,/applyDodgyGrade/);assert.match(game,/laneLampSpots\(\)/);
console.log('PASS v166 winding lanes, dodgy grade',lots.length,'lots');
