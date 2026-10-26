import * as THREE from './vendor/three.module.min.js';

const freezeRecords=records=>Object.freeze(records.map(record=>Object.freeze(record)));
export const PUBLIC_SERVICE_SITES=freezeRecords([
 {id:'palm-court',label:'Palm Court Motel',x:-25,z:19,w:18,d:13,cue:'linen',accent:0x9b765c,service:0x65756b},
 {id:'milos',label:'Milo’s Garden Goods',x:25,z:22,w:18,d:17,cue:'garden',accent:0x738b5f,service:0x586e5d},
 {id:'hanks',label:'Hank’s Hardware',x:-24,z:-23,w:20,d:17,cue:'hardware',accent:0x738b89,service:0x536764},
 {id:'corner-store',label:'The Corner Store',x:24,z:-25,w:20,d:18,cue:'retail',accent:0xb7785f,service:0x766655},
 {id:'suds',label:'Suds & Sunshine',x:53,z:22,w:19,d:17,cue:'laundry',accent:0x74a2a5,service:0x5c7474},
 {id:'lettings',label:'Cedar Bay Lettings',x:54,z:-25,w:21,d:19,cue:'mail',accent:0xa17b5f,service:0x746858},
 {id:'helping-hand',label:'The Helping Hand',x:-53,z:-25,w:18,d:18,cue:'roster',accent:0x847994,service:0x685f73},
 {id:'coastway-servo',label:'Coastway Servo',x:-77,z:-35,w:17,d:14,cue:'manifold',accent:0xa6604d,service:0x5c6d66}
]);
export const PUBLIC_SERVICE_COLLIDERS=Object.freeze([]);

const CUES=Object.freeze({
 linen:Object.freeze({a:Object.freeze([1.45,.1,.1]),b:Object.freeze([1.05,.1,.1]),gap:.3}),
 garden:Object.freeze({a:Object.freeze([.12,.82,.1]),b:Object.freeze([.12,.6,.1]),gap:.42}),
 hardware:Object.freeze({a:Object.freeze([1.55,.14,.1]),b:Object.freeze([.18,.72,.1]),gap:.38}),
 retail:Object.freeze({a:Object.freeze([1.2,.18,.12]),b:Object.freeze([1.2,.18,.12]),gap:.33}),
 laundry:Object.freeze({a:Object.freeze([.72,.72,.1]),b:Object.freeze([.52,.52,.1]),gap:.48}),
 mail:Object.freeze({a:Object.freeze([1.3,.2,.12]),b:Object.freeze([1.3,.2,.12]),gap:.28}),
 roster:Object.freeze({a:Object.freeze([.78,.98,.1]),b:Object.freeze([.18,.78,.1]),gap:.5}),
 manifold:Object.freeze({a:Object.freeze([1.55,.16,.12]),b:Object.freeze([.16,.78,.12]),gap:.4})
});
const finite=n=>Number.isFinite(n);
const box=(part,role,x,y,z,w,h,d,color)=>Object.freeze({shape:'box',part,role,x,y,z,w,h,d,color});
const cylinder=(part,role,x,y,z,r,h,color)=>Object.freeze({shape:'cylinder',part,role,x,y,z,r,h,color});

export function publicServiceProfile(site,index=0){
 if(!site||typeof site.id!=='string'||!site.id||typeof site.label!=='string'||!site.label||!CUES[site.cue]||![site.x,site.z,site.w,site.d,site.accent,site.service,index].every(finite)||site.w<12||site.d<10)return null;
 const frontZ=site.z+site.d/2,rearZ=site.z-site.d/2,cue=CUES[site.cue],publicX=site.x-site.w*.27,serviceX=site.x+site.w*.24;
 const boxes=freezeRecords([
  box('public-notice-case','public',publicX,1.55,frontZ+.17,1.25,.78,.1,0xe2d7ba),
  box('public-notice-cap','public',publicX,1.99,frontZ+.2,1.4,.1,.14,site.accent),
  box('welcome-rail','public',site.x+site.w*.23,1.02,frontZ+.18,1.55,.13,.11,site.accent),
  box('left-canopy-brace','public',site.x-site.w*.17,2.37,frontZ+.43,.12,.5,.72,0x6a7568),
  box('right-canopy-brace','public',site.x+site.w*.17,2.37,frontZ+.43,.12,.5,.72,0x6a7568),
  box('service-door','service',serviceX,1.42,rearZ-.16,1.8,2.45,.1,site.service),
  box('service-kickplate','service',serviceX,.39,rearZ-.22,1.5,.38,.08,0x8b927f),
  box('service-header','service',serviceX,2.62,rearZ-.2,2.05,.14,.14,0xb7af91),
  box(site.cue+'-cue-a','service',site.x-site.w*.23,1.6+cue.gap*.22,rearZ-.2,cue.a[0],cue.a[1],cue.a[2],site.accent),
  box(site.cue+'-cue-b','service',site.x-site.w*.23+cue.gap,1.12+cue.gap*.18,rearZ-.21,cue.b[0],cue.b[1],cue.b[2],0xa6a48c)
 ]);
 const cylinders=freezeRecords([
  cylinder('public-entry-lamp','public',publicX,2.33,frontZ+.23,.11,.38,0xe8c982),
  cylinder('service-vent','service',site.x-site.w*.36,2.02,rearZ-.22,.12,1.12,site.service)
 ]);
 return Object.freeze({...site,index,frontZ,rearZ,publicX,serviceX,boxes,cylinders,counts:Object.freeze({public:6,service:6,boxes:10,cylinders:2})});
}
export const PUBLIC_SERVICE_PROFILES=Object.freeze(PUBLIC_SERVICE_SITES.map((site,index)=>publicServiceProfile(site,index)));

export function publicServiceOpposed(profile){
 if(!profile||![profile.z,profile.frontZ,profile.rearZ].every(finite))return false;
 const parts=[...(profile.boxes||[]),...(profile.cylinders||[])];
 return profile.frontZ>profile.z&&profile.rearZ<profile.z&&parts.filter(part=>part.role==='public').length===6&&parts.filter(part=>part.role==='service').length===6&&parts.every(part=>part.role==='public'?part.z>profile.z:part.z<profile.z);
}
export function publicServiceMounted(profile){
 if(!profile)return false;const parts=[...(profile.boxes||[]),...(profile.cylinders||[])];
 return parts.length===12&&parts.every(part=>{const h=part.h,halfW=part.shape==='box'?part.w/2:part.r;return [part.x,part.y,part.z,h,halfW].every(finite)&&h>0&&halfW>0&&part.y-h/2>=.18&&Math.abs(part.x-profile.x)+halfW<=profile.w/2+.01&&Math.min(Math.abs(part.z-profile.frontZ),Math.abs(part.z-profile.rearZ))<=.8;});
}

export function createPublicServiceFronts({scene,profiles=PUBLIC_SERVICE_PROFILES,quality='balanced'}={}){
 if(!scene||!Array.isArray(profiles))throw new TypeError('Public/service fronts need a scene and profile records.');
 const valid=profiles.filter(Boolean),boxes=valid.flatMap(profile=>profile.boxes.map(part=>({...part,site:profile.id,cue:profile.cue}))),cylinders=valid.flatMap(profile=>profile.cylinders.map(part=>({...part,site:profile.id,cue:profile.cue}))),boxGeometry=new THREE.BoxGeometry(1,1,1),cylinderGeometry=new THREE.CylinderGeometry(1,1,1,10),boxMaterial=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.9,metalness:0,flatShading:true}),cylinderMaterial=boxMaterial.clone(),boxMesh=new THREE.InstancedMesh(boxGeometry,boxMaterial,boxes.length),cylinderMesh=new THREE.InstancedMesh(cylinderGeometry,cylinderMaterial,cylinders.length),object=new THREE.Object3D(),color=new THREE.Color();
 boxMesh.userData.items=boxes;cylinderMesh.userData.items=cylinders;
 for(const [index,part] of boxes.entries()){object.position.set(part.x,part.y,part.z);object.scale.set(part.w,part.h,part.d);object.updateMatrix();boxMesh.setMatrixAt(index,object.matrix);boxMesh.setColorAt(index,color.setHex(part.color));}
 for(const [index,part] of cylinders.entries()){object.position.set(part.x,part.y,part.z);object.scale.set(part.r,part.h,part.r);object.updateMatrix();cylinderMesh.setMatrixAt(index,object.matrix);cylinderMesh.setColorAt(index,color.setHex(part.color));}
 for(const mesh of [boxMesh,cylinderMesh]){mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;mesh.computeBoundingSphere();scene.add(mesh);}
 const setQuality=q=>{for(const mesh of [boxMesh,cylinderMesh]){mesh.visible=true;mesh.castShadow=q==='high';mesh.receiveShadow=q!=='performance';}};setQuality(quality);
 return Object.freeze({profiles:Object.freeze(valid),boxMesh,cylinderMesh,setQuality,drawCalls:2,counts:Object.freeze({sites:valid.length,boxes:boxes.length,cylinders:cylinders.length,parts:boxes.length+cylinders.length,public:valid.length*6,service:valid.length*6,colliders:0})});
}
