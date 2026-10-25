import * as THREE from './vendor/three.module.min.js';

const freezeRecords=records=>Object.freeze(records.map(record=>Object.freeze(record)));
export const NARROW_ALLEY_SITES=freezeRecords([
 {id:'hanks-service',label:'Hank’s Hardware service lane',x:-24,z:-23,w:20,d:17,accent:0x78908a,screen:0x4e5d59},
 {id:'corner-store-service',label:'Corner Store service lane',x:24,z:-25,w:20,d:18,accent:0xb37a62,screen:0x625a4d},
 {id:'lettings-service',label:'Cedar Bay Lettings service lane',x:54,z:-25,w:21,d:19,accent:0x9b7b63,screen:0x625c51},
 {id:'helping-hand-service',label:'Helping Hand service lane',x:-53,z:-25,w:18,d:18,accent:0x887d9a,screen:0x5f5968}
]);

const finite=n=>Number.isFinite(n);
const box=(part,x,y,z,w,h,d,color)=>Object.freeze({shape:'box',part,x,y,z,w,h,d,color});
const cylinder=(part,x,y,z,r,h,color)=>Object.freeze({shape:'cylinder',part,x,y,z,r,h,color});

export function narrowAlleyProfile(site,index=0){
 if(!site||typeof site.id!=='string'||!site.id||typeof site.label!=='string'||!site.label||![site.x,site.z,site.w,site.d,site.accent,site.screen,index].every(finite)||site.w<16||site.d<14)return null;
 const rearZ=site.z-site.d/2,screenZ=rearZ-4,screenLength=site.w*.62,screenDepth=.12;
 // Existing solid wall and the screen both include the game's .325 m player-radius padding.
 const wallInnerZ=rearZ-.45,screenInnerZ=screenZ+(screenDepth+.65)/2,clearWidth=wallInnerZ-screenInnerZ,laneZ=(wallInnerZ+screenInnerZ)/2;
 const left=Object.freeze({x:site.x-screenLength/2-1.2,z:laneZ}),right=Object.freeze({x:site.x+screenLength/2+1.2,z:laneZ});
 const panelWidth=screenLength/3-.08,boxes=freezeRecords([
  box('screen-left',site.x-screenLength/3,1.25,screenZ,panelWidth,2.5,screenDepth,site.screen),
  box('screen-centre',site.x,1.25,screenZ,panelWidth,2.5,screenDepth,site.screen),
  box('screen-right',site.x+screenLength/3,1.25,screenZ,panelWidth,2.5,screenDepth,site.screen),
  box('screen-cap',site.x,2.54,screenZ,screenLength,.08,.18,site.accent),
  box('drain-channel',site.x,.018,laneZ,screenLength,.035,.2,0x4d5550),
  box('service-band',site.x,.73,screenZ+.07,screenLength*.46,.12,.06,site.accent),
  box('wall-lamp',site.x,2.18,screenZ+.3,.62,.16,.48,0xd6bd78)
 ]);
 const cylinders=freezeRecords([
  cylinder('left-downpipe',site.x-screenLength*.42,1.18,screenZ+.09,.075,2.36,site.accent),
  cylinder('right-downpipe',site.x+screenLength*.42,1.18,screenZ+.09,.075,2.36,site.accent)
 ]);
 const collider=Object.freeze({x:site.x,z:screenZ,w:screenLength+.65,d:screenDepth+.65,narrowAlley:site.id});
 return Object.freeze({...site,index,rearZ,screenZ,screenLength,screenDepth,wallInnerZ,screenInnerZ,clearWidth,laneZ,left,right,boxes,cylinders,collider,counts:Object.freeze({boxes:7,cylinders:2,parts:9,colliders:1})});
}

export const NARROW_ALLEY_PROFILES=Object.freeze(NARROW_ALLEY_SITES.map((site,index)=>narrowAlleyProfile(site,index)));
export const NARROW_ALLEY_COLLIDERS=Object.freeze(NARROW_ALLEY_PROFILES.map(profile=>profile.collider));

export function narrowAlleyPointBlocked(profile,x,z){
 if(!profile||![x,z].every(finite))return true;const c=profile.collider;
 return Math.abs(x-c.x)<c.w/2&&Math.abs(z-c.z)<c.d/2;
}
export function narrowAlleyPathSamples(profile,step=.2){
 if(!profile||!finite(step)||step<=0||step>1)return Object.freeze([]);const distance=Math.hypot(profile.right.x-profile.left.x,profile.right.z-profile.left.z),count=Math.max(1,Math.ceil(distance/step));
 return freezeRecords(Array.from({length:count+1},(_,i)=>({x:profile.left.x+(profile.right.x-profile.left.x)*i/count,z:profile.left.z+(profile.right.z-profile.left.z)*i/count})));
}
export function narrowAlleyPathClear(profile,blocked){
 if(!profile||typeof blocked!=='function')return false;const samples=narrowAlleyPathSamples(profile);
 return samples.length>1&&samples.every(point=>!blocked(point.x,point.z));
}

export function createNarrowAlleys({scene,profiles=NARROW_ALLEY_PROFILES,quality='balanced'}={}){
 if(!scene||!Array.isArray(profiles))throw new TypeError('Narrow alleys need a scene and profile records.');
 const valid=profiles.filter(Boolean),boxes=valid.flatMap(profile=>profile.boxes.map(part=>({...part,alley:profile.id}))),cylinders=valid.flatMap(profile=>profile.cylinders.map(part=>({...part,alley:profile.id}))),boxGeometry=new THREE.BoxGeometry(1,1,1),cylinderGeometry=new THREE.CylinderGeometry(1,1,1,10),boxMaterial=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.94,metalness:0,vertexColors:true,flatShading:true}),cylinderMaterial=boxMaterial.clone(),boxMesh=new THREE.InstancedMesh(boxGeometry,boxMaterial,boxes.length),cylinderMesh=new THREE.InstancedMesh(cylinderGeometry,cylinderMaterial,cylinders.length),object=new THREE.Object3D(),color=new THREE.Color();
 boxMesh.userData.items=boxes;cylinderMesh.userData.items=cylinders;
 for(const [index,part] of boxes.entries()){object.position.set(part.x,part.y,part.z);object.scale.set(part.w,part.h,part.d);object.updateMatrix();boxMesh.setMatrixAt(index,object.matrix);boxMesh.setColorAt(index,color.setHex(part.color));}
 for(const [index,part] of cylinders.entries()){object.position.set(part.x,part.y,part.z);object.scale.set(part.r,part.h,part.r);object.updateMatrix();cylinderMesh.setMatrixAt(index,object.matrix);cylinderMesh.setColorAt(index,color.setHex(part.color));}
 for(const mesh of [boxMesh,cylinderMesh]){mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;mesh.computeBoundingSphere();scene.add(mesh);}
 const setQuality=q=>{for(const mesh of [boxMesh,cylinderMesh]){mesh.visible=true;mesh.castShadow=q!=='performance';mesh.receiveShadow=q!=='performance';}};setQuality(quality);
 return Object.freeze({profiles:Object.freeze(valid),boxMesh,cylinderMesh,setQuality,drawCalls:2,counts:Object.freeze({alleys:valid.length,boxes:boxes.length,cylinders:cylinders.length,parts:boxes.length+cylinders.length,colliders:valid.length})});
}
