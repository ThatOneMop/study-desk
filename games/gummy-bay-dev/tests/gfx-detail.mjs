import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.min.js';
import {detailParts,bakeParts,createDetailMesh,decalSpots,createDecals,decalAtlasBytes,createLowCull,lowCullRadius} from '../dist/gfx-detail.mjs';
const parts=detailParts([{x:0,z:0,w:12,d:9,h:9.2},{x:30,z:0,w:2,d:9,h:9}],{alleys:[{x:0,z:-30,w:20,d:17}],wires:[{a:[-11,6,10],b:[11,6,11],sag:.7}]});
assert.ok(parts.length>20,'parts placed');assert.ok(parts.every(p=>[p.x,p.y,p.z,p.sx,p.sy,p.sz].every(Number.isFinite)));
assert.ok(parts.every(p=>Math.abs(p.x-30)>2),'slivers skipped');
const b=bakeParts(parts);assert.equal(b.verts,parts.length*36);
// unit cube faces point outward
const one=bakeParts([{x:0,y:0,z:0,sx:1,sy:1,sz:1,color:0xffffff}]);for(let i=0;i<36;i+=3){const ax=[0,1,2].map(k=>(one.pos[i*3+k]+one.pos[(i+1)*3+k]+one.pos[(i+2)*3+k])/3),n=[0,1,2].map(k=>one.nor[i*3+k]);const e1=[0,1,2].map(k=>one.pos[(i+1)*3+k]-one.pos[i*3+k]),e2=[0,1,2].map(k=>one.pos[(i+2)*3+k]-one.pos[i*3+k]);const cr=[e1[1]*e2[2]-e1[2]*e2[1],e1[2]*e2[0]-e1[0]*e2[2],e1[0]*e2[1]-e1[1]*e2[0]];assert.ok(cr[0]*n[0]+cr[1]*n[1]+cr[2]*n[2]>0,'ccw outward');assert.ok(ax[0]*n[0]+ax[1]*n[1]+ax[2]*n[2]>0);}
const scene=new THREE.Scene();const d=createDetailMesh(THREE,scene,parts),dc=createDecals(THREE,scene,decalSpots({roads:[{axis:'z',at:0,mid:0,len:150,width:10}],walls:[{x:1,z:1}]}));
assert.equal(scene.children.length,2,'whole pass = two meshes');assert.ok(dc.count>5);assert.equal(decalAtlasBytes().bytes.length,128*128*4);
// Low cull: far small prop leaves layer 0 on Low only, and comes back on other qualities.
const prop=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshStandardMaterial());prop.position.set(200,0,0);scene.add(prop);prop.updateMatrixWorld();
const cam=new THREE.PerspectiveCamera();const cull=createLowCull(THREE,scene);cull.update(cam,'performance');assert.equal(prop.layers.isEnabled(0),false);assert.equal(cull.culled,1);
cull.update(cam,'high');assert.ok(prop.layers.isEnabled(0));assert.equal(lowCullRadius(20),Infinity);
console.log('gfx-detail ok');
