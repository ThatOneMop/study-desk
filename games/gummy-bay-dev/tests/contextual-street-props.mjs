import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.min.js';
import {VEHICLE_ROADS,PEDESTRIAN_WAYS,drivingSurfaceZone} from '../dist/road-zones.mjs';
import {PARKING_BAYS} from '../dist/parking-guide.mjs';
import {DISTRICT_BUILDING_SITES} from '../dist/district-architecture.mjs';
import {STREET_PROP_SITES,STREET_PROP_PROFILES,STREET_PROP_COLLIDERS,contextualStreetPropProfile,createContextualStreetProps} from '../dist/contextual-street-props.mjs';

const overlap=(a,b)=>Math.abs(a.x-b.x)<(a.w+b.w)/2&&Math.abs(a.z-b.z)<(a.d+b.d)/2;
assert.equal(STREET_PROP_SITES.length,8);
assert(Object.isFrozen(STREET_PROP_SITES)&&STREET_PROP_SITES.every(site=>Object.isFrozen(site)&&Object.isFrozen(site.anchor)&&Object.isFrozen(site.footprint)));
assert(Object.isFrozen(STREET_PROP_PROFILES)&&STREET_PROP_PROFILES.every(Object.isFrozen));
assert(Object.isFrozen(STREET_PROP_COLLIDERS)&&STREET_PROP_COLLIDERS.every(Object.isFrozen));
assert.equal(new Set(STREET_PROP_SITES.map(site=>site.id)).size,8);
assert.equal(new Set(STREET_PROP_SITES.map(site=>site.purpose)).size,8,'every installation has one explicit town purpose');
assert.equal(STREET_PROP_PROFILES.length,8);
for(const profile of STREET_PROP_PROFILES){
 assert(profile.clearCorridor>=1.8&&profile.clearCorridor<=2.3,'edge placement leaves a bounded pedestrian corridor');
 assert(profile.contextDistance<=32,'purpose-specific object stays near its named shop or district anchor');
 assert.equal(profile.collider.w,profile.footprint.w+.65);assert.equal(profile.collider.d,profile.footprint.d+.65);
 assert.equal(drivingSurfaceZone({x:profile.x,z:profile.z,angle:0}).key,'pavement','every site is anchored to a real authored pedestrian way');
 assert(VEHICLE_ROADS.every(road=>!overlap(profile.collider,road)),'padded solid footprint stays out of every vehicle road');
 assert(DISTRICT_BUILDING_SITES.every(building=>!overlap(profile.collider,building)),'solid footprint stays outside district buildings');
 assert(PARKING_BAYS.every(bay=>!overlap(profile.collider,{x:bay.x,z:bay.z,w:2.82,d:6.2})),'solid footprint does not obstruct a guided parking bay');
 assert(PEDESTRIAN_WAYS.some(way=>Math.abs(profile.x-way.x)<=way.w/2&&Math.abs(profile.z-way.z)<=way.d/2),'site belongs to an authored pedestrian way');
}
assert.equal(contextualStreetPropProfile(null),null);
assert.equal(contextualStreetPropProfile({...STREET_PROP_SITES[0],kind:'crate'}),null);
assert.equal(contextualStreetPropProfile({...STREET_PROP_SITES[0],z:-153}),null,'reject route-obstructing curb placement');
assert.equal(contextualStreetPropProfile({...STREET_PROP_SITES[0],anchor:{x:200,z:200}}),null,'reject arbitrary placement far from its contextual destination');
assert.equal(contextualStreetPropProfile({...STREET_PROP_SITES[0],x:NaN}),null);

const scene=new THREE.Scene(),props=createContextualStreetProps({scene,quality:'balanced'});
assert.equal(props.drawCalls,2);assert.deepEqual(props.counts,{sites:8,boxes:31,cylinders:28});assert.equal(scene.children.length,2);
assert.equal(props.boxMesh.count,31);assert.equal(props.cylinderMesh.count,28);
for(const mesh of scene.children)assert(mesh.isInstancedMesh&&mesh.instanceMatrix.array.every(Number.isFinite)&&!mesh.material.vertexColors);
const resources=scene.children.map(mesh=>[mesh,mesh.geometry,mesh.material,mesh.instanceMatrix,mesh.instanceColor]);
props.setQuality('performance');assert(props.boxMesh.visible&&props.cylinderMesh.visible&&!props.boxMesh.castShadow&&!props.cylinderMesh.castShadow);
props.setQuality('balanced');assert(props.boxMesh.castShadow&&props.cylinderMesh.castShadow);
props.setQuality('high');assert.deepEqual(scene.children.map(mesh=>[mesh,mesh.geometry,mesh.material,mesh.instanceMatrix,mesh.instanceColor]),resources);
assert.throws(()=>createContextualStreetProps(),/scene/);
console.log('PASS: eight purpose-specific street installations occupy authored pavement edges, leave at least 1.8 m clear, avoid roads/buildings/parking and use two stable instanced draw calls. CPU construction only; no rendered clutter/readability claim.');
