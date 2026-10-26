import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.min.js';
import {buildAtlasBytes,tileMean,TILE,createMaterialAtlas,applyGfxMaterial,worldMaterialEligible,patchWorldMaterials} from '../dist/gfx-materials.mjs';
const t0=performance.now(),a=buildAtlasBytes();
assert.equal(a.width,1024);assert.equal(a.height,512);assert.equal(a.bytes.length,1024*512*4);
for(const [k,t] of Object.entries(TILE)){const m=tileMean(a,t);assert.ok(Math.abs(m-128)<10,k+' mean '+m);}
// tiles carry real structure (not flat), and the atlas is deterministic
let spread=0;for(let i=0;i<a.bytes.length;i+=4*97)spread=Math.max(spread,Math.abs(a.bytes[i]-128));assert.ok(spread>30);
assert.deepEqual(buildAtlasBytes().bytes.slice(0,4096),a.bytes.slice(0,4096));
assert.ok(performance.now()-t0<4000,'atlas builds quickly');
const tex=createMaterialAtlas(THREE);assert.equal(tex.image.width,1024);
// Shader patch: idempotent, chains a previous hook, adds the varying + atlas uniform.
const u={gfxAtlas:{value:tex},gfxStrength:{value:1}};
const m=new THREE.MeshStandardMaterial({color:0xa04030});let prev=0;m.onBeforeCompile=()=>{prev++;};
assert.ok(applyGfxMaterial(m,u));assert.equal(applyGfxMaterial(m,u),false);
const sh={uniforms:{},vertexShader:'void main(){\n#include <worldpos_vertex>\n}',fragmentShader:'void main(){\n#include <color_fragment>\n}'};
m.onBeforeCompile(sh);assert.equal(prev,1);assert.ok(sh.vertexShader.includes('gfxWorld=')&&sh.fragmentShader.includes('gfxSample(')&&sh.uniforms.gfxAtlas===u.gfxAtlas);
assert.ok(m.customProgramCacheKey().includes('gfx151'));
// Eligibility: static walls yes; vehicles, skinned, glass, glowing and transparent no; shared with a mover -> no.
const scene=new THREE.Scene(),wall=new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshStandardMaterial({roughness:.9}));scene.add(wall);
const car=new THREE.Group();car.name='Town traffic car';const body=new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshStandardMaterial());car.add(body);scene.add(car);
const glass=new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshStandardMaterial({roughness:.1}));scene.add(glass);
const glow=new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshStandardMaterial({emissive:0xffaa00,emissiveIntensity:1}));scene.add(glow);
const shared=new THREE.MeshStandardMaterial();const s1=new THREE.Mesh(new THREE.BoxGeometry(),shared);scene.add(s1);const c2=new THREE.Mesh(new THREE.BoxGeometry(),shared);car.add(c2);
assert.ok(worldMaterialEligible(wall,scene));assert.equal(worldMaterialEligible(body,scene),false);assert.equal(worldMaterialEligible(glass,scene),false);assert.equal(worldMaterialEligible(glow,scene),false);
assert.equal(patchWorldMaterials(scene,u),1);assert.ok(wall.material.userData.gfxMaterial);assert.ok(!shared.userData.gfxMaterial);
assert.equal(patchWorldMaterials(scene,u),0,'second pass patches nothing new');
console.log('gfx-materials ok');
