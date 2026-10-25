import * as THREE from './vendor/three.module.min.js';
import {graphicBatch} from './graphics-architecture.mjs';
// Deterministic, original texture pixels. No external images or screen-space grain.
export function gritTexture(kind){
 const n=128,b=new Uint8Array(n*n*4);let seed=8147;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const base=kind==='asphalt'?[57,61,59]:kind==='concrete'?[113,112,101]:[91,91,67];
 for(let y=0;y<n;y++)for(let x=0;x<n;x++){
  const noise=(rand()-.5)*(kind==='earth'?37:28),broad=Math.sin(x*.09)*Math.cos(y*.07)*8;
  const crack=kind==='asphalt'&&Math.abs(x-(48+Math.sin(y*.12)*5+Math.sin(y*.035)*19))<.65;
  const seam=kind==='concrete'&&(x<2||y<2);const i=(y*n+x)*4;
  for(let c=0;c<3;c++)b[i+c]=Math.max(0,Math.min(255,base[c]+noise+broad-(crack?24:0)-(seam?19:0)));b[i+3]=255;
 }
 const tex=new THREE.DataTexture(b,n,n);tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.colorSpace=THREE.SRGBColorSpace;tex.generateMipmaps=true;tex.minFilter=THREE.LinearMipmapLinearFilter;tex.magFilter=THREE.LinearFilter;tex.anisotropy=4;tex.needsUpdate=true;return tex;
}
export function gritMaterial(kind){
 const m=new THREE.MeshStandardMaterial({color:0xffffff,roughness:kind==='asphalt'?.94:1,map:gritTexture(kind)});
 m.userData.gritKind=kind;
 m.onBeforeCompile=shader=>{
  shader.vertexShader='varying vec3 gritWorld;\n'+shader.vertexShader;
  shader.vertexShader=shader.vertexShader.replace('#include <worldpos_vertex>','#include <worldpos_vertex>\n gritWorld=(modelMatrix*vec4(transformed,1.)).xyz;');
  // True metre-scaled UVs across wide, long and irregular road meshes.
  shader.fragmentShader='varying vec3 gritWorld;\n'+shader.fragmentShader;
  shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>','#ifdef USE_MAP\n diffuseColor *= texture2D(map,gritWorld.xz/'+(kind==='earth'?'5.0':kind==='concrete'?'2.5':'6.0')+');\n#endif');
 };
 m.customProgramCacheKey=()=> 'grit-world-'+kind;return m;
}
export function createStreetWear({scene,blocked,floorHeight,bounds}){
 let seed=717;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const paper=[],cans=[],glass=[],stains=[],cracks=[];
 const xs=[-270,-105,0,105,270],zs=[0,-90,-160,-230,-300,-370,-435];
 for(let i=0;i<1800;i++){
  let x,z;if(i%2){const axis=xs[i%xs.length];x=axis+(i%4<2?-1:1)*(6.5+rand()*3.2);z=bounds.minZ+14+rand()*(80-bounds.minZ);}else{z=zs[i%zs.length]+(i%4<2?-1:1)*(6.5+rand()*3.2);x=-275+rand()*550;}
  if(x<bounds.minX||x>bounds.maxX||z<bounds.minZ||z>bounds.maxZ||blocked(x,z))continue;
  const y=floorHeight(x,z)+.015,rot=rand()*6.28;
  const p={x,y,z,w:.12+rand()*.22,h:.012,d:.11+rand()*.19,ry:rot,color:[0xafa790,0x8c8e7f,0xa38e68,0x6f7977][i%4]};
  if(i%5<3)paper.push(p);else if(i%5===3)cans.push({...p,y:y+.045,w:.08,h:.14,d:.08,rz:1.4,color:0x838b85});else glass.push({...p,y:y+.04,w:.06,h:.22,d:.06,rz:1.5,color:0x4e6451});
 }
 for(let i=0;i<210;i++){
  const x=xs[i%5]+(rand()-.5)*7,z=bounds.minZ+14+rand()*(bounds.maxZ-bounds.minZ-30);if(blocked(x,z))continue;
  stains.push({x,y:.021,z,w:.6+rand()*2,h:.006,d:.4+rand()*1.3,ry:rand()*6,color:0x333b38});
  for(let j=0;j<3;j++)cracks.push({x:x+j*.22,y:.026,z:z+j*.3,w:.025,h:.005,d:.43,ry:rand()*.8-.4,color:0x252d2c});
 }
 const batches=[graphicBatch(scene,'Paper and wrappers',paper),graphicBatch(scene,'Discarded cans',cans,new THREE.CylinderGeometry(.5,.5,1,8),{metalness:.25}),graphicBatch(scene,'Discarded bottles',glass,new THREE.CylinderGeometry(.33,.5,1,7)),graphicBatch(scene,'Asphalt repairs',stains),graphicBatch(scene,'Road fractures',cracks)];
 batches.forEach(m=>m.castShadow=false);
 return {paper,cans,glass,stains,cracks,batches};
}
