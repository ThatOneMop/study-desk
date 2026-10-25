import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.min.js';
import {neighborhoodPlan,overlaps,islandOutline,createIslandShore,relocateFromInfill,ISLAND_ROAD_X,ISLAND_ROAD_Z} from '../dist/island-neighborhoods.mjs';
import {DISTRICT_BUILDING_SITES,createDistrictArchitecture} from '../dist/district-architecture.mjs';
import {terrainHeight} from '../dist/gritty-terrain.mjs';
const sites=neighborhoodPlan({obstacles:DISTRICT_BUILDING_SITES,height:terrainHeight});
assert(sites.length>=80,`Expected substantial infill, got ${sites.length}`);
assert.deepEqual(sites,neighborhoodPlan({obstacles:DISTRICT_BUILDING_SITES,height:terrainHeight}));
for(const s of sites){assert(!DISTRICT_BUILDING_SITES.some(b=>overlaps(s,b,3)));assert(!sites.some(b=>b!==s&&overlaps(s,b,3)));assert(ISLAND_ROAD_X.every(x=>Math.abs(s.x-x)>=s.w/2+12));assert(ISLAND_ROAD_Z.every(z=>Math.abs(s.z-z)>=s.d/2+12));}
for(const range of [[-450,-300],[-300,-150],[-150,0],[0,95]])assert(sites.some(s=>s.z>=range[0]&&s.z<range[1]));
const bounds={minX:-280,maxX:280,minZ:95-(178*171*10/560),maxZ:95},scene=new THREE.Scene(),coast=createIslandShore(scene,bounds,new THREE.MeshStandardMaterial());
assert.equal(coast.outline.length,128);assert(coast.shore.geometry.attributes.position.array.every(Number.isFinite));
for(const p of islandOutline(bounds))assert(p.outer.x<bounds.minX||p.outer.x>bounds.maxX||p.outer.z<bounds.minZ||p.outer.z>bounds.maxZ);
const architecture=createDistrictArchitecture({scene,sites});assert.equal(architecture.profiles.length,sites.length);architecture.setQuality('performance');
const trapped={x:sites[0].x,z:sites[0].z},moved=relocateFromInfill(trapped,sites,(x,z)=>!sites.some(b=>overlaps({x,z,w:2,d:2},b)));assert(Math.hypot(moved.x-trapped.x,moved.z-trapped.z)>5);assert(!sites.some(b=>overlaps({...moved,w:1,d:1},b)));
console.log(`PASS: ${sites.length} potential infill lots, road clearance, deterministic collisions, coast topology, batched meshes and old-save rescue.`);
