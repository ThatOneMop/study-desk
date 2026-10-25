import fs from 'node:fs';
import assert from 'node:assert/strict';
import * as THREE from '../../dist/vendor/three.module.min.js';
import {GLTFLoader} from '../../dist/vendor/gltf-loader.js';
const root='/workspace/sites/nightshift';
async function read(n){let b=fs.readFileSync(root+'/dist/assets/'+n);return new GLTFLoader().parseAsync(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength),'');}
const gltf=await read('citizen-v11.glb');
assert.deepEqual(gltf.animations.map(a=>a.name).sort(),['Idle','Run','Search','Surrender','Talk','Walk','Work']);
let skin;gltf.scene.traverse(o=>{if(o.isSkinnedMesh)skin=o;});assert(skin);assert.equal(skin.skeleton.bones.length,14);
let mixer=new THREE.AnimationMixer(gltf.scene);
for(const clip of gltf.animations){mixer.stopAllAction();mixer.clipAction(clip).play();mixer.update(.5);gltf.scene.updateMatrixWorld(true);skin.computeBoundingBox();gltf.scene.traverse(o=>{if(o.isSkinnedMesh)o.computeBoundingBox();});const size=new THREE.Box3().setFromObject(gltf.scene).getSize(new THREE.Vector3());assert(size.toArray().every(Number.isFinite));assert(size.y>1.5&&size.y<3.2,clip.name+' height');assert(size.x<3,clip.name+' width');console.log(clip.name,size.toArray().map(n=>n.toFixed(2)).join(' x '));}
const file=fs.readFileSync(root+'/dist/game.js','utf8');let code=file.slice(file.indexOf('function cloneRig('),file.indexOf('function installCitizen('));let cloneRig=new Function('THREE',code+';return cloneRig;')(THREE);
const copy=cloneRig(gltf.scene);let cloneSkin;copy.traverse(o=>{if(o.isSkinnedMesh)cloneSkin=o;});assert.notEqual(cloneSkin.skeleton.bones[0],skin.skeleton.bones[0]);assert(cloneSkin.skeleton.bones.every(b=>{let p=b;while(p){if(p===copy)return true;p=p.parent;}return false;}));console.log('PASS skeleton clones are independent');
if(fs.existsSync(root+'/dist/assets/environment-v11-final.glb')){const env=await read('environment-v11-final.glb');let tris=0,meshes=0;env.scene.traverse(o=>{if(o.isMesh){meshes++;tris+=(o.geometry.index?.count||o.geometry.attributes.position.count)/3;assert(o.geometry.attributes.uv);let p=o.geometry.attributes.position;for(let i=0;i<p.count;i++)assert(Number.isFinite(p.getX(i))&&Number.isFinite(p.getY(i))&&Number.isFinite(p.getZ(i)));}});console.log('Environment',env.scene.children.length,'chunks',meshes,'meshes',tris,'triangles');assert(env.scene.getObjectByName('RV'));}
console.log('PASS exported asset structure, animation bounds and cloning');
