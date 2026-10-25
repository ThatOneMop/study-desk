import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.min.js';
import {DISTRICT_BUILDING_SITES} from '../dist/district-architecture.mjs';
import {architectureDressing,createArchitectureOverhaul} from '../dist/graphics-architecture.mjs';
import {landscapePlan,createLandscapeOverhaul} from '../dist/graphics-landscape.mjs';
import {createLifeOverhaul,everydayClothing} from '../dist/graphics-life.mjs';
import {createAtmosphereOverhaul,contactTexture} from '../dist/graphics-atmosphere.mjs';
import {applyCoastalSurface} from '../dist/graphics-surfaces.mjs';
const scene=new THREE.Scene(),sites=DISTRICT_BUILDING_SITES,parts=architectureDressing(sites),lookup=new Map(sites.map(s=>[s.id,s]));
for(const [kind,list] of Object.entries(parts))for(const p of list){
 assert([p.x,p.y,p.z,p.w,p.h,p.d].every(Number.isFinite));assert(p.w>0&&p.h>0&&p.d>0);
 const s=lookup.get(p.site);assert(Math.abs(p.x-s.x)+p.w/2<=s.w/2,kind+' must stay inside solid site');assert(Math.abs(p.z-s.z)+p.d/2<=s.d/2,kind+' must stay inside solid site');
}
assert.equal(new Set(parts.glass.map(p=>p.site)).size,60);
const arch=createArchitectureOverhaul(scene,sites),resource=arch.groups.map(m=>[m,m.geometry,m.material]);
arch.update(1,'high');assert.equal(arch.groups[1].material.emissiveIntensity,.42);arch.update(0,'performance');assert.equal(arch.groups[1].material.emissiveIntensity,0);assert(!arch.groups[2].visible);
const bounds={minX:-280,maxX:280,minZ:-449,maxZ:95},land=createLandscapeOverhaul(scene,bounds);
assert.deepEqual(land.plan,landscapePlan(bounds));
for(const p of [...land.plan.trunks,...land.plan.crowns,...land.plan.grass])assert(Math.abs(p.x)-p.w/2>280);
for(const p of land.plan.rocks)assert(p.z-p.d/2>95);
land.update(30,'performance');assert(!land.groups[3].visible);land.update(50,'balanced');assert(land.groups[3].visible);
const g=new THREE.Group(),body=new THREE.Group();g.userData.id=3;g.add(body);scene.add(g);const chest=new THREE.Bone();chest.name='Chest';chest.position.y=.95;body.add(chest);
const actors=[{g,body,clothingBase:0x769977}],homes=[{x:-25,z:40,w:18,d:17}],life=createLifeOverhaul({scene,actors,homes});
const state={room:true,house:0,cash:400,version:3},before=JSON.stringify(state);
life.update({active:true,state,quality:'balanced'});assert.equal(life.clothing.count,everydayClothing(3,0x769977).length);assert.equal(life.shadow.count,1);assert(life.rooms[0].g.visible);
const garmentBefore=new THREE.Matrix4(),garmentAfter=new THREE.Matrix4();life.clothing.getMatrixAt(0,garmentBefore);chest.rotation.y=.4;life.update({active:true,state,quality:'balanced'});life.clothing.getMatrixAt(0,garmentAfter);assert(!garmentBefore.equals(garmentAfter),'garment details follow chest animation, not just actor roots');chest.rotation.y=0;
life.update({active:false,state,quality:'high'});assert.equal(life.clothing.count,0);assert.equal(life.shadow.count,0);assert(!life.rooms[0].g.visible);
life.update({active:true,state,quality:'performance'});assert.equal(life.clothing.count,0);assert(!life.rooms[0].g.visible);assert.equal(JSON.stringify(state),before);
const sky=new THREE.Mesh(new THREE.SphereGeometry(),new THREE.ShaderMaterial({uniforms:{}})),water=new THREE.Mesh(new THREE.PlaneGeometry(),new THREE.ShaderMaterial());
const atmosphere=createAtmosphereOverhaul({sky,water});atmosphere.update(NaN);assert.equal(sky.material.uniforms.uTime.value,0);atmosphere.update(12);assert.equal(sky.material.uniforms.uTime.value,12);
const tex=contactTexture();assert.equal(tex.image.data.length,64*64*4);assert.equal(tex.image.data[3],0);
const mat=new THREE.MeshStandardMaterial();assert(applyCoastalSurface(mat));assert(!applyCoastalSurface(mat));const shader={vertexShader:'#include <worldpos_vertex>',fragmentShader:'#include <color_fragment>'};mat.onBeforeCompile(shader);assert(shader.vertexShader.includes('instanceMatrix*cp'));assert(shader.fragmentShader.includes('groundWear'));
for(let i=0;i<200;i++){arch.update(i%2,i%2?'high':'balanced');land.update(i,'balanced');life.update({active:true,state,quality:'balanced'});}
assert(resource.every((r,i)=>r[0]===arch.groups[i]&&r[1]===arch.groups[i].geometry&&r[2]===arch.groups[i].material));
console.log('PASS: five graphics stages: 60 supported architectural sites, '+Object.values(parts).reduce((s,p)=>s+p.length,0)+' facade components, '+Object.values(land.plan).reduce((s,p)=>s+p.length,0)+' scenic parts, finite/immutable transforms, day/night/quality/ownership states and stable resources. Shader source checked; WebGL unavailable.');
