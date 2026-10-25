import * as THREE from './vendor/three.module.min.js';

const freezeRecords=records=>Object.freeze(records.map(record=>Object.freeze(record)));
export const ORDINARY_UNUSUAL_SITES=freezeRecords([
 {id:'room-04',label:'Room 04 workshop',x:-25,z:40,w:18,d:17,stage:'mould',palette:0},
 {id:'old-harbor',label:'Old Harbor Workshop',x:-54,z:55,w:24,d:20,stage:'pack',palette:1},
 {id:'hillside-house',label:'The Hillside House',x:54,z:51,w:27,d:22,stage:'mix',palette:2}
]);
export const ORDINARY_UNUSUAL_COLLIDERS=Object.freeze([]);
const PALETTES=Object.freeze([
 Object.freeze({panel:0x87765f,shelf:0xc7b58e,domestic:0x8da185,work:0xc58a70,accent:0xe0c56f}),
 Object.freeze({panel:0x64766e,shelf:0xa99c7d,domestic:0x9aaf9a,work:0x7d9fa3,accent:0xd9b58b}),
 Object.freeze({panel:0x766d80,shelf:0xb4aa91,domestic:0xb6a08a,work:0x8a9d76,accent:0xb98ea8})
]);
const finite=n=>Number.isFinite(n),box=(part,x,y,z,w,h,d,color,role)=>Object.freeze({shape:'box',part,x,y,z,w,h,d,color,role}),cylinder=(part,x,y,z,r,h,color,role)=>Object.freeze({shape:'cylinder',part,x,y,z,r,h,color,role});
export function ordinaryUnusualProfile(site,index=0){
 if(!site||typeof site.id!=='string'||!site.id||typeof site.label!=='string'||!site.label||!['mould','pack','mix'].includes(site.stage)||!Number.isInteger(site.palette)||!PALETTES[site.palette]||![site.x,site.z,site.w,site.d,index].every(finite)||site.w<10||site.d<10)return null;
 const p=PALETTES[site.palette],frontZ=site.z+site.d/2,z=frontZ-.72,domesticX=site.x-site.w*.35,workX=site.x+site.w*.35;
 const boxes=[
  box('domestic-panel',domesticX,1.75,z,2.55,1.65,.08,p.panel,'domestic'),box('domestic-shelf',domesticX,1.28,z+.18,2.3,.1,.42,p.shelf,'domestic'),
  box('photo-frame',domesticX-.48,2.04,z+.08,.82,.58,.07,p.domestic,'domestic'),box('book-one',domesticX+.2,1.49,z+.24,.18,.34,.2,p.work,'domestic'),box('book-two',domesticX+.42,1.46,z+.24,.16,.28,.2,p.accent,'domestic'),
  box('work-panel',workX,1.75,z,2.55,1.65,.08,p.panel,'work'),box('work-shelf-low',workX,1.28,z+.18,2.3,.1,.42,p.shelf,'work'),box('work-shelf-high',workX,1.86,z+.18,2.3,.1,.42,p.shelf,'work'),box('work-header',workX,2.45,z+.1,2.2,.14,.12,p.work,'work')
 ];
 const cylinders=[
  cylinder('mug',domesticX+.78,1.48,z+.22,.16,.36,p.domestic,'domestic'),cylinder('key-peg-left',domesticX-.2,2.28,z+.13,.045,.24,p.accent,'domestic'),cylinder('key-peg-right',domesticX+.05,2.28,z+.13,.045,.24,p.accent,'domestic')
 ];
 if(site.stage==='mould'){
  for(let i=0;i<3;i++){boxes.push(box('cooling-tray-'+i,workX-.7+i*.7,1.47+(i%2)*.58,z+.27,.52,.08,.28,p.work,'work'));cylinders.push(cylinder('gummy-sample-'+i,workX-.7+i*.7,1.62+(i%2)*.58,z+.28,.1,.18,p.accent,'work'));}
 }else if(site.stage==='pack'){
  for(let i=0;i<3;i++){boxes.push(box('pack-caddy-'+i,workX-.7+i*.7,1.51+(i%2)*.58,z+.25,.5,.34,.3,[p.work,p.accent,p.domestic][i],'work'));cylinders.push(cylinder('wrapper-roll-'+i,workX-.7+i*.7,1.71+(i%2)*.58,z+.27,.11,.18,p.shelf,'work'));}
 }else{
  for(let i=0;i<3;i++){boxes.push(box('bottle-cap-'+i,workX-.7+i*.7,1.8+(i%2)*.58,z+.27,.18,.1,.18,p.accent,'work'));cylinders.push(cylinder('mix-bottle-'+i,workX-.7+i*.7,1.55+(i%2)*.58,z+.27,.15,.48,[p.work,p.accent,p.domestic][i],'work'));}
 }
 return Object.freeze({...site,index,frontZ,insideZ:z,domesticX,workX,boxes:Object.freeze(boxes),cylinders:Object.freeze(cylinders),counts:Object.freeze({domestic:8,work:10,boxes:12,cylinders:6})});
}
export const ORDINARY_UNUSUAL_PROFILES=Object.freeze(ORDINARY_UNUSUAL_SITES.map((site,index)=>ordinaryUnusualProfile(site,index)));

export function ordinaryUnusualInsideHome(profile,margin=.35){
 if(!profile||!finite(margin)||margin<0)return false;
 const parts=[...profile.boxes,...profile.cylinders],halfW=profile.w/2-margin,halfD=profile.d/2-margin;
 return parts.every(part=>Math.abs(part.x-profile.x)<halfW&&Math.abs(part.z-profile.z)<halfD&&part.y>0&&part.y<3.5);
}
export function ordinaryUnusualPairing(profile){
 if(!profile)return Object.freeze({domestic:0,work:0,stages:Object.freeze([])});
 const parts=[...profile.boxes,...profile.cylinders];
 return Object.freeze({domestic:parts.filter(part=>part.role==='domestic').length,work:parts.filter(part=>part.role==='work').length,stages:Object.freeze(parts.filter(part=>part.role==='work').map(part=>part.part))});
}

export function createOrdinaryUnusualWork({scene,profiles=ORDINARY_UNUSUAL_PROFILES,quality='balanced'}={}){
 if(!scene||!Array.isArray(profiles))throw new TypeError('Ordinary/unusual work dressing needs a scene and profiles.');
 const valid=profiles.filter(Boolean),boxes=valid.flatMap(profile=>profile.boxes.map(part=>({...part,home:profile.index,site:profile.id}))),cylinders=valid.flatMap(profile=>profile.cylinders.map(part=>({...part,home:profile.index,site:profile.id}))),boxGeometry=new THREE.BoxGeometry(1,1,1),cylinderGeometry=new THREE.CylinderGeometry(1,1,1,10),material=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.88,metalness:0,vertexColors:true,flatShading:true}),boxMesh=new THREE.InstancedMesh(boxGeometry,material,boxes.length),cylinderMesh=new THREE.InstancedMesh(cylinderGeometry,material,cylinders.length),object=new THREE.Object3D(),color=new THREE.Color();
 const fill=(mesh,parts)=>{mesh.userData.items=parts;for(const [index,part]of parts.entries()){object.position.set(part.x,part.y,part.z);object.scale.set(part.shape==='box'?part.w:part.r,part.h,part.shape==='box'?part.d:part.r);object.updateMatrix();mesh.setMatrixAt(index,object.matrix);mesh.setColorAt(index,color.setHex(part.color));}mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;mesh.computeBoundingSphere();scene.add(mesh);};fill(boxMesh,boxes);fill(cylinderMesh,cylinders);
 const setQuality=q=>{for(const mesh of [boxMesh,cylinderMesh]){mesh.visible=true;mesh.castShadow=q==='high';mesh.receiveShadow=q!=='performance';}};setQuality(quality);
 return Object.freeze({profiles:Object.freeze(valid),boxMesh,cylinderMesh,setQuality,drawCalls:2,counts:Object.freeze({sites:valid.length,boxes:boxes.length,cylinders:cylinders.length,parts:boxes.length+cylinders.length,colliders:0})});
}
