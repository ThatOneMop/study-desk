import * as THREE from './vendor/three.module.min.js';
import {STREET_JUNCTIONS} from './street-construction.mjs?v=126';
import {SKYLINE_LANDMARK_PROFILES} from './town-skyline.mjs?v=126';
import {DISTRICT_BUILDING_SITES} from './district-architecture.mjs?v=126';

const freezeRecords=records=>Object.freeze(records.map(record=>Object.freeze(record)));
export const JUNCTION_REVEAL_SITES=freezeRecords([
 {id:'syrup-upper',junctionX:-270,junctionZ:-90,landmarkId:'syrup-stack'},
 {id:'syrup-lower',junctionX:-270,junctionZ:-160,landmarkId:'syrup-stack'},
 {id:'market-upper',junctionX:270,junctionZ:-160,landmarkId:'market-clock'},
 {id:'market-lower',junctionX:270,junctionZ:-230,landmarkId:'market-clock'},
 {id:'sugarworks-upper',junctionX:0,junctionZ:-300,landmarkId:'sugarworks-stack'},
 {id:'sugarworks-lower',junctionX:0,junctionZ:-370,landmarkId:'sugarworks-stack'},
 {id:'harbor-inner',junctionX:-105,junctionZ:-90,landmarkId:'harbor-signal'},
 {id:'harbor-outer',junctionX:-105,junctionZ:-160,landmarkId:'harbor-signal'}
]);

const finite=n=>Number.isFinite(n),clamp01=n=>Math.max(0,Math.min(1,n));
const pointOutsideSupports=(x,z,supports,margin=1.2)=>supports.every(support=>Math.abs(x-support.x)>support.w/2+margin||Math.abs(z-support.z)>support.d/2+margin);
const compass=(dx,dz)=>Math.abs(dx)>Math.abs(dz)?dx>0?'east':'west':dz>0?'south':'north';
const box=(part,x,y,z,w,h,d,color,ry=0)=>Object.freeze({shape:'box',part,x,y,z,w,h,d,color,ry});
const cylinder=(part,x,y,z,r,h,color)=>Object.freeze({shape:'cylinder',part,x,y,z,r,h,color});

export function junctionRevealProfile(site,index=0,{junctions=STREET_JUNCTIONS,landmarks=SKYLINE_LANDMARK_PROFILES,supports=DISTRICT_BUILDING_SITES}={}){
 if(!site||typeof site.id!=='string'||!site.id||![site.junctionX,site.junctionZ,index].every(finite)||typeof site.landmarkId!=='string'||!Array.isArray(junctions)||!Array.isArray(landmarks)||!Array.isArray(supports))return null;
 const junction=junctions.find(record=>record.x===site.junctionX&&record.z===site.junctionZ),landmark=landmarks.find(record=>record.id===site.landmarkId);if(!junction||!landmark)return null;
 const dx=landmark.x-junction.x,dz=landmark.z-junction.z,axis=Math.abs(dx)>Math.abs(dz)?'x':'z',sign=Math.sign(axis==='x'?dx:dz)||1,approachLength=32;
 const start=Object.freeze({x:junction.x-(axis==='x'?sign*approachLength:0),z:junction.z-(axis==='z'?sign*approachLength:0)}),end=Object.freeze({x:junction.x,z:junction.z}),heading=axis==='x'?(sign>0?Math.PI/2:-Math.PI/2):(sign>0?0:Math.PI);
 const cornerSigns=[[Math.sign(dx)||1,Math.sign(dz)||1],[-(Math.sign(dx)||1),Math.sign(dz)||1],[Math.sign(dx)||1,-(Math.sign(dz)||1)],[-(Math.sign(dx)||1),-(Math.sign(dz)||1)]],corner=cornerSigns.map(([sx,sz])=>({x:junction.x+sx*11.25,z:junction.z+sz*11.25})).find(point=>pointOutsideSupports(point.x,point.z,supports));if(!corner)return null;
 const landmarkHeight=landmark.topY-landmark.baseY,startDistance=Math.hypot(landmark.x-start.x,landmark.z-start.z),junctionDistance=Math.hypot(dx,dz),startAngle=Math.atan2(landmarkHeight,startDistance),junctionAngle=Math.atan2(landmarkHeight,junctionDistance),beamYaw=Math.atan2(-(landmark.z-corner.z),landmark.x-corner.x);
 const boxes=freezeRecords([
  box('verge-base',corner.x,.16,corner.z,.9,.32,.9,0x5c655e),
  box('sight-post',corner.x,1.48,corner.z,.18,2.64,.18,landmark.color),
  box('upper-sight-fin',corner.x,2.74,corner.z,2.5,.16,.18,landmark.accent,beamYaw),
  box('lower-sight-fin',corner.x,2.22,corner.z,1.55,.13,.15,landmark.accent,beamYaw),
  box('direction-cap',corner.x,2.95,corner.z,.44,.28,.44,landmark.color,Math.PI/4)
 ]),cylinders=freezeRecords([
  cylinder('near-gumdrop',corner.x-.22,2.95,corner.z,.12,.28,landmark.accent),
  cylinder('far-gumdrop',corner.x+.22,2.95,corner.z,.12,.28,landmark.accent)
 ]),collider=Object.freeze({x:corner.x,z:corner.z,w:1.55,d:1.55,junctionReveal:site.id});
 return Object.freeze({...site,index,junction,landmark,axis,sign,approachLength,start,end,heading,corner,direction:compass(dx,dz),landmarkHeight,startDistance,junctionDistance,startAngle,junctionAngle,boxes,cylinders,collider,counts:Object.freeze({boxes:5,cylinders:2,parts:7,colliders:1})});
}

export const JUNCTION_REVEAL_PROFILES=Object.freeze(JUNCTION_REVEAL_SITES.map((site,index)=>junctionRevealProfile(site,index)));
export const JUNCTION_REVEAL_COLLIDERS=Object.freeze(JUNCTION_REVEAL_PROFILES.map(profile=>profile.collider));

export function junctionRevealReading(profile,position){
 if(!profile||!position||![position.x,position.z].every(finite))return null;const vx=profile.end.x-profile.start.x,vz=profile.end.z-profile.start.z,length2=vx*vx+vz*vz;if(length2<=0)return null;
 const wx=position.x-profile.start.x,wz=position.z-profile.start.z,raw=(wx*vx+wz*vz)/length2,progress=clamp01(raw),nearX=profile.start.x+vx*progress,nearZ=profile.start.z+vz*progress,lateral=Math.hypot(position.x-nearX,position.z-nearZ);if(raw<-.25||raw>1.35||lateral>7)return null;
 const distance=Math.hypot(profile.landmark.x-position.x,profile.landmark.z-position.z),apparentAngle=Math.atan2(profile.landmarkHeight,distance),stage=progress<.34?'glimpse':progress<.7?'emerging':'clear view';
 return Object.freeze({id:profile.id,label:profile.landmark.label,direction:profile.direction,stage,progress,lateral,distance,apparentAngle,cue:`${profile.landmark.label} ${stage} ${profile.direction}`});
}
export function nearestJunctionReveal(position,profiles=JUNCTION_REVEAL_PROFILES){
 if(!Array.isArray(profiles))return null;let best=null;for(const profile of profiles){const reading=junctionRevealReading(profile,position);if(reading&&(!best||reading.lateral<best.lateral-.000001||Math.abs(reading.lateral-best.lateral)<=.000001&&reading.distance<best.distance))best=reading;}return best;
}

export function createJunctionReveals({scene,profiles=JUNCTION_REVEAL_PROFILES,quality='balanced'}={}){
 if(!scene||!Array.isArray(profiles))throw new TypeError('Junction reveals need a scene and profile records.');const valid=profiles.filter(Boolean),boxes=valid.flatMap(profile=>profile.boxes.map(part=>({...part,reveal:profile.id}))),cylinders=valid.flatMap(profile=>profile.cylinders.map(part=>({...part,reveal:profile.id}))),boxGeometry=new THREE.BoxGeometry(1,1,1),cylinderGeometry=new THREE.CylinderGeometry(1,1,1,10),material=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.9,metalness:.02,flatShading:true}),boxMesh=new THREE.InstancedMesh(boxGeometry,material,boxes.length),cylinderMesh=new THREE.InstancedMesh(cylinderGeometry,material.clone(),cylinders.length),object=new THREE.Object3D(),color=new THREE.Color();
 boxMesh.userData.items=boxes;cylinderMesh.userData.items=cylinders;
 for(const [i,part] of boxes.entries()){object.position.set(part.x,part.y,part.z);object.rotation.set(0,part.ry||0,0);object.scale.set(part.w,part.h,part.d);object.updateMatrix();boxMesh.setMatrixAt(i,object.matrix);boxMesh.setColorAt(i,color.setHex(part.color));}
 for(const [i,part] of cylinders.entries()){object.position.set(part.x,part.y,part.z);object.rotation.set(0,0,0);object.scale.set(part.r,part.h,part.r);object.updateMatrix();cylinderMesh.setMatrixAt(i,object.matrix);cylinderMesh.setColorAt(i,color.setHex(part.color));}
 for(const mesh of [boxMesh,cylinderMesh]){mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;mesh.computeBoundingSphere();scene.add(mesh);}
 const setQuality=q=>{boxMesh.visible=true;cylinderMesh.visible=true;boxMesh.castShadow=q!=='performance';cylinderMesh.castShadow=q==='high';boxMesh.receiveShadow=q!=='performance';cylinderMesh.receiveShadow=q!=='performance';};setQuality(quality);
 return Object.freeze({profiles:Object.freeze(valid),boxMesh,cylinderMesh,setQuality,drawCalls:2,counts:Object.freeze({reveals:valid.length,boxes:boxes.length,cylinders:cylinders.length,parts:boxes.length+cylinders.length,colliders:valid.length})});
}
