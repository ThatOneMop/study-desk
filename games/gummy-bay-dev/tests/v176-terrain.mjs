import assert from 'node:assert/strict';
import fs from 'node:fs';
import {districtTerrainHeight,districtGroundHeight} from '../dist/district-terrain.mjs';
import {outerGround,createOuterDistricts,outerRoadSamples} from '../dist/outer-districts.mjs';
import * as THREE from '../dist/vendor/three.module.min.js';

assert.equal(districtTerrainHeight(0,0),0,'old town stays flat here');
assert.equal(districtTerrainHeight(20,80),0,'the beach edge is not raised');
assert.equal(districtTerrainHeight(40,70),0);
assert.ok(districtTerrainHeight(20,-470)<.2,'Hillcrest starts level where the lane leaves town');
const south=districtTerrainHeight(30,-520),north=districtTerrainHeight(30,-760);
assert.ok(north>south+8,'Hillcrest climbs toward the back of the district ('+south.toFixed(2)+' → '+north.toFixed(2)+')');
assert.ok(districtTerrainHeight(-450,-40)>0&&districtTerrainHeight(-450,-40)<1.2,'Tin Terrace only rolls');
assert.equal(districtTerrainHeight(420,-10),0,'Salt Docks stays at the quay');
assert.ok(districtGroundHeight(-302,4)>2,'the west lane still clears the river');

// A walking step is about 0.16 m. The rise on that step stays under the 0.35 m step-up.
let worst=0,at=null;
for(let x=-120;x<=170;x+=4)for(let z=-790;z<=-490;z+=4){
 for(const [dx,dz] of [[.16,0],[-.16,0],[0,.16],[0,-.16]]){
  const rise=Math.abs(districtTerrainHeight(x+dx,z+dz)-districtTerrainHeight(x,z));
  if(rise>worst){worst=rise;at=[x,z,dx,dz];}
 }
}
assert.ok(worst<.2,'steepest Hillcrest step is '+worst.toFixed(3)+' m at '+at);

const scene=new THREE.Scene();
createOuterDistricts({scene,quality:'performance',height:districtGroundHeight});
const road=outerRoadSamples('crest-road');
const heights=road.map(p=>outerGround(p.x,p.z));
assert.ok(heights[0]<1,'the lane meets the city near ground level');
assert.ok(heights[heights.length-1]>heights[0]+6,'the lane climbs the hill');
for(let i=1;i<heights.length;i++){
 const run=Math.hypot(road[i].x-road[i-1].x,road[i].z-road[i-1].z)||1;
 assert.ok(Math.abs(heights[i]-heights[i-1])/run<.35,'road grade stays walkable');
}
assert.equal(outerGround(0,0),0);
assert.equal(outerGround(20,80),0);

const game=fs.readFileSync(new URL('../dist/game.js',import.meta.url),'utf8');
assert.match(game,/district-terrain\.mjs\?v=176/);
assert.match(game,/height:typeof districtGroundHeight/);
assert.match(game,/outerGround\(vehiclePose\.x,vehiclePose\.z\)/);
const html=fs.readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
assert.match(html,/game\.js\?v=176/);
console.log('PASS v176 terrain: Hillcrest rises '+north.toFixed(1)+' m, steepest step '+worst.toFixed(3)+' m');
