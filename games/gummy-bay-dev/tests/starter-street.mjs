import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.min.js';
import {townRoleColor} from '../dist/town-palette.mjs';
import {STARTER_APPROACH,starterMarkingKind,starterCurbRecords,starterApproachRecords,starterStreetBudget,createStarterStreet} from '../dist/starter-street.mjs';

const scene=new THREE.Scene();
const dashMaterial=new THREE.MeshStandardMaterial({color:0xece3bb}),walkMaterial=new THREE.MeshStandardMaterial({color:0xf0e8ce});
const dashX=new THREE.BoxGeometry(3,.015,.12),dashZ=new THREE.BoxGeometry(.12,.015,3),walkX=new THREE.BoxGeometry(.7,.02,2.5),walkZ=new THREE.BoxGeometry(2.5,.02,.7);
const expect=[];
for(let x=-86;x<90;x+=7){const mesh=new THREE.Mesh(dashX,dashMaterial);mesh.position.set(x,.01,0);scene.add(mesh);expect.push(['dash',x,0]);}
for(let z=-68;z<70;z+=7){const mesh=new THREE.Mesh(dashZ,dashMaterial);mesh.position.set(0,.01,z);scene.add(mesh);expect.push(['dash',0,z]);}
for(let x=-5;x<6;x+=1.5){const mesh=new THREE.Mesh(walkX,walkMaterial);mesh.position.set(x,.02,7.5);scene.add(mesh);expect.push(['crosswalk',x,7.5]);}
for(let z=-5;z<6;z+=1.5){const mesh=new THREE.Mesh(walkZ,walkMaterial);mesh.position.set(-7.5,.02,z);scene.add(mesh);expect.push(['crosswalk',-7.5,z]);}
assert.equal(expect.length,62);
assert.equal(expect.filter(item=>item[0]==='dash').length,46);
assert.equal(expect.filter(item=>item[0]==='crosswalk').length,16);
for(const mesh of scene.children)assert.equal(typeof starterMarkingKind(mesh),'string');

const decoy=new THREE.Mesh(dashX,dashMaterial);decoy.position.set(-86,5,0);scene.add(decoy);
const wrongColor=new THREE.Mesh(dashX,new THREE.MeshStandardMaterial({color:0xff0000}));wrongColor.position.set(-79,.01,0);scene.add(wrongColor);
const grouped=new THREE.Group();const hidden=new THREE.Mesh(dashZ,dashMaterial);hidden.position.set(0,.01,-68);grouped.add(hidden);scene.add(grouped);
assert.equal(starterMarkingKind(decoy),null);
assert.equal(starterMarkingKind(wrongColor),null);
assert.equal(starterMarkingKind(hidden),null);
assert.equal(starterMarkingKind(null),null);
assert.equal(starterStreetBudget('nope').quality,'balanced');
assert.equal(starterStreetBudget('performance').markings,'crossing-and-alternate-dashes');
assert.equal(starterStreetBudget('performance').maxDrawCalls,2);

const approach=STARTER_APPROACH;
assert.equal(approach.id,'rv-to-palm-court');
assert(approach.minZ>25.7,'approach stays south of the Palm Court front wall');
assert(approach.minX>-46.2,'approach stays east of the payphone');
assert(approach.maxX<=-16&&approach.minX>=-48);
const curbs=starterCurbRecords();
assert.equal(curbs.length,8);
assert(Object.isFrozen(curbs)&&curbs.every(Object.isFrozen));
for(const curb of curbs){
 const minX=curb.x-curb.w/2,maxX=curb.x+curb.w/2,minZ=curb.z-curb.d/2,maxZ=curb.z+curb.d/2;
 assert(maxX<=-7.4||minX>=7.4||maxZ<=-7.4||minZ>=7.4,'curb leaves the crossing mouth open');
 assert(curb.color===townRoleColor('curb'));
}
const approachParts=starterApproachRecords();
assert.equal(approachParts.filter(part=>part.role==='approach').length,1);
assert.equal(approachParts.filter(part=>part.role==='approach-curb').length,2);
assert.equal(approachParts.filter(part=>part.role==='approach-dash').length,5);
assert(approachParts.filter(part=>part.role==='approach-dash').every(part=>part.x>approach.minX&&part.x<approach.maxX&&part.z===approach.z));

const before=scene.children.length;
const layer=createStarterStreet({scene,quality:'balanced'});
assert.equal(layer.drawCalls,2);
assert.equal(layer.counts.adopted,62);
assert.equal(layer.counts.dashes,46);
assert.equal(layer.counts.crosswalks,16);
assert.equal(layer.counts.approachDashes,5);
assert.equal(layer.counts.curbs,8);
assert.equal(layer.counts.colliders,0);
assert.equal(layer.counts.replacedDraws,62);
assert.equal(scene.children.length,before-62+2);
assert(scene.children.includes(decoy)&&scene.children.includes(wrongColor)&&scene.children.includes(grouped));
assert(scene.children.every(mesh=>!starterMarkingKind(mesh)));
assert.equal(layer.markingMesh.count,layer.budgets.balanced);
assert.equal(layer.hardscapeMesh.count,layer.counts.hardscape);
assert.equal(layer.markingMesh.material.map,null);
assert.equal(layer.hardscapeMesh.material.map,null);
assert(layer.markingMesh.material.flatShading&&layer.hardscapeMesh.material.flatShading);

const position=new THREE.Vector3(),quaternion=new THREE.Quaternion(),scale=new THREE.Vector3();
function read(mesh,index){const matrix=new THREE.Matrix4();mesh.getMatrixAt(index,matrix);matrix.decompose(position,quaternion,scale);return {x:position.x,y:position.y,z:position.z,w:scale.x,h:scale.y,d:scale.z};}
for(const mesh of [layer.markingMesh,layer.hardscapeMesh]){
 assert(mesh.isInstancedMesh&&mesh.count>0);
 for(let i=0;i<mesh.count;i++){
  const item=mesh.userData.items[i],got=read(mesh,i);
  assert(Math.abs(got.x-item.x)<1e-4&&Math.abs(got.y-item.y)<1e-4&&Math.abs(got.z-item.z)<1e-4);
  assert(Math.abs(got.w-item.w)<1e-4&&Math.abs(got.h-item.h)<1e-4&&Math.abs(got.d-item.d)<1e-4);
  const expectedColor=item.role==='approach'?0x5e6862:(item.role==='curb'||item.role==='approach-curb')?townRoleColor('curb'):townRoleColor('crossing');
  assert.equal(item.color,expectedColor);
 }
}
const visible=layer.markingMesh.userData.items;
assert(visible.filter(item=>item.role==='crosswalk').every(item=>item.w>=.7||item.d>=.7));
assert(visible.filter(item=>item.role==='dash').every(item=>Math.max(item.w,item.d)>=2.8&&Math.min(item.w,item.d)>=.3));

const resources=scene.children.map(mesh=>[mesh,mesh.geometry,mesh.material,mesh.instanceMatrix,mesh.instanceColor]);
layer.setQuality('performance');
assert.equal(layer.activeBudget,'performance');
assert.equal(layer.markingMesh.count,layer.budgets.performance);
assert.equal(layer.hardscapeMesh.count,layer.counts.hardscape);
assert(layer.markingMesh.visible&&layer.hardscapeMesh.visible);
assert(!layer.markingMesh.castShadow&&!layer.hardscapeMesh.castShadow&&!layer.hardscapeMesh.receiveShadow);
const shown=layer.markingMesh.userData.items.slice(0,layer.markingMesh.count);
assert.equal(shown.filter(item=>item.role==='crosswalk').length,16);
assert.equal(shown.filter(item=>item.role==='approach-dash').length,5);
assert(shown.some(item=>item.role==='dash'&&item.z===0)&&shown.some(item=>item.role==='dash'&&item.x===0));
assert(shown.filter(item=>item.role==='dash').length<layer.counts.dashes);
layer.setQuality('high');
assert.equal(layer.markingMesh.count,layer.counts.markings);
assert(!layer.hardscapeMesh.castShadow);
layer.setQuality('balanced');
assert.equal(layer.markingMesh.count,layer.counts.markings);
assert(layer.hardscapeMesh.receiveShadow);
assert.deepEqual(scene.children.map(mesh=>[mesh,mesh.geometry,mesh.material,mesh.instanceMatrix,mesh.instanceColor]),resources);
assert.throws(()=>createStarterStreet(),/scene/);
assert.throws(()=>createStarterStreet({scene:null}),/scene/);

console.log('PASS: 62 loose old-town dashes and crossing bars collapse into one marking draw; eight curbs and the RV-to-Palm-Court approach share the second draw. Performance keeps the crossing, the approach and alternate dashes. No textures or colliders. CPU construction only.');
