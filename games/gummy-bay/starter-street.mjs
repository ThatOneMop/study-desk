import * as THREE from './vendor/three.module.min.js';
import {townRoleColor} from './town-palette.mjs?v=76';

// Old-town Main Street is the first road the player reaches from the RV.
// Its centre dashes and crossing bars were individual meshes (one draw each).
// This layer keeps that paint, plus a flat approach from the campsite to Palm
// Court, inside two instanced draws. Performance drops every other dash and
// keeps the crossing, the curbs and the approach so the street still reads.
const MARKING_Y={dash:.01,crosswalk:.02};
const DASH_X={w:3,h:.015,d:.12},DASH_Z={w:.12,h:.015,d:3};
const WALK_X={w:.7,h:.02,d:2.5},WALK_Z={w:2.5,h:.02,d:.7};
const ASPHALT=0x5e6862;

export const STARTER_APPROACH=Object.freeze({
 id:'rv-to-palm-court',x:-32,y:.034,z:27.05,w:28,h:.02,d:2.4,
 get minX(){return this.x-this.w/2},get maxX(){return this.x+this.w/2},
 get minZ(){return this.z-this.d/2},get maxZ(){return this.z+this.d/2}
});

const finite=n=>Number.isFinite(n);
const sizeMatch=(parameters,spec)=>parameters&&parameters.width===spec.w&&parameters.height===spec.h&&parameters.depth===spec.d;
function markingHex(mesh){
 const color=mesh.material?.color;
 return color?.isColor?color.getHex():null;
}

export function starterMarkingKind(mesh){
 if(!mesh?.isMesh||mesh.isInstancedMesh||mesh.geometry?.type!=='BoxGeometry'||mesh.parent&&mesh.parent.type==='Group')return null;
 const parameters=mesh.geometry.parameters,hex=markingHex(mesh),x=mesh.position?.x,y=mesh.position?.y,z=mesh.position?.z;
 if(![x,y,z].every(finite))return null;
 if(hex===0xece3bb&&y===MARKING_Y.dash&&z===0&&sizeMatch(parameters,DASH_X)&&Math.abs(x)<=90)return 'dash';
 if(hex===0xece3bb&&y===MARKING_Y.dash&&x===0&&sizeMatch(parameters,DASH_Z)&&Math.abs(z)<=72)return 'dash';
 if(hex===0xf0e8ce&&y===MARKING_Y.crosswalk&&z===7.5&&sizeMatch(parameters,WALK_X)&&Math.abs(x)<=8)return 'crosswalk';
 if(hex===0xf0e8ce&&y===MARKING_Y.crosswalk&&x===-7.5&&sizeMatch(parameters,WALK_Z)&&Math.abs(z)<=8)return 'crosswalk';
 return null;
}

function pushBox(list,record){list.push(Object.freeze({...record}));}
export function starterCurbRecords(){
 const curb=townRoleColor('curb'),y=.06,h=.1,t=.2,gap=7.4;
 const west=(-90+ -gap)/2,westW=90-gap,east=(gap+90)/2,eastW=90-gap;
 const north=(-72.5+ -gap)/2,northD=72.5-gap,south=(gap+72.5)/2,southD=72.5-gap;
 const edge=6.02+t/2,records=[];
 for(const z of [-edge,edge]){
  pushBox(records,{role:'curb',axis:'x',x:west,y,z,w:westW,h,d:t,color:curb});
  pushBox(records,{role:'curb',axis:'x',x:east,y,z,w:eastW,h,d:t,color:curb});
 }
 for(const x of [-edge,edge]){
  pushBox(records,{role:'curb',axis:'z',x,y,z:north,w:t,h,d:northD,color:curb});
  pushBox(records,{role:'curb',axis:'z',x,y,z:south,w:t,h,d:southD,color:curb});
 }
 return Object.freeze(records);
}

export function starterApproachRecords(){
 const approach=STARTER_APPROACH,curb=townRoleColor('curb'),cream=townRoleColor('crossing');
 const records=[Object.freeze({role:'approach',x:approach.x,y:approach.y,z:approach.z,w:approach.w,h:approach.h,d:approach.d,color:ASPHALT})];
 for(const side of [-1,1])pushBox(records,{role:'approach-curb',x:approach.x,y:.05,z:approach.z+side*(approach.d/2-.08),w:approach.w,h:.028,d:.16,color:curb});
 for(let i=0;i<5;i++)pushBox(records,{role:'approach-dash',x:approach.x-12+i*6,y:.056,z:approach.z,w:2.15,h:.016,d:.28,color:cream});
 return Object.freeze(records);
}

export function starterStreetBudget(quality){
 const mode=['performance','balanced','high'].includes(quality)?quality:'balanced';
 return Object.freeze({quality:mode,drawCalls:2,maxDrawCalls:2,markings:mode==='performance'?'crossing-and-alternate-dashes':'full',hardscape:'curbs-and-approach'});
}

function paint(mesh,items){
 const object=new THREE.Object3D(),color=new THREE.Color();
 mesh.userData.items=items;
 for(let i=0;i<items.length;i++){
  const item=items[i];
  object.position.set(item.x,item.y,item.z);object.rotation.set(0,0,0);object.scale.set(item.w,item.h,item.d);object.updateMatrix();
  mesh.setMatrixAt(i,object.matrix);mesh.setColorAt(i,color.setHex(item.color));
 }
 mesh.count=items.length;mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;
 mesh.castShadow=false;mesh.receiveShadow=true;mesh.computeBoundingSphere();
}

function makeBatch(scene,name,items){
 const material=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.94,metalness:0,flatShading:true,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});
 const mesh=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),material,Math.max(1,items.length));
 mesh.name=name;paint(mesh,items);scene.add(mesh);return mesh;
}

function adoptedMarking(mesh,kind){
 const parameters=mesh.geometry.parameters,alongX=parameters.width>parameters.depth,cream=townRoleColor('crossing');
 if(kind==='crosswalk')return Object.freeze({role:'crosswalk',kind,x:mesh.position.x,y:.028,z:mesh.position.z,w:parameters.width,h:.02,d:parameters.depth,color:cream});
 return Object.freeze({role:'dash',kind,x:mesh.position.x,y:.026,z:mesh.position.z,w:alongX?2.85:.36,h:.018,d:alongX?.36:2.85,color:cream});
}

export function createStarterStreet({scene,quality='balanced'}={}){
 if(!scene||!Array.isArray(scene.children))throw new TypeError('Starter street needs a scene.');
 const loose=[];
 for(const mesh of scene.children){const kind=starterMarkingKind(mesh);if(kind)loose.push({mesh,kind});}
 for(const entry of loose)scene.remove(entry.mesh);
 const crosswalks=[],dashes=[];
 for(const {mesh,kind} of loose){const record=adoptedMarking(mesh,kind);(kind==='crosswalk'?crosswalks:dashes).push(record);}
 dashes.sort((a,b)=>a.x-b.x||a.z-b.z||a.w-b.w);
 const kept=[],extra=[];dashes.forEach((dash,index)=>(index%2?extra:kept).push(dash));
 const approach=starterApproachRecords(),approachDashes=approach.filter(item=>item.role==='approach-dash'),hardscape=[...starterCurbRecords(),...approach.filter(item=>item.role!=='approach-dash')];
 const markings=[...crosswalks,...approachDashes,...kept,...extra];
 const performanceCount=crosswalks.length+approachDashes.length+kept.length;
 const markingMesh=makeBatch(scene,'Gummy Bay starter street markings',markings);
 const hardscapeMesh=makeBatch(scene,'Gummy Bay starter street curbs',hardscape);
 markingMesh.receiveShadow=false;
 const budgets=Object.freeze({performance:performanceCount,balanced:markings.length,high:markings.length});
 let active='balanced';
 const setQuality=mode=>{
  const budget=starterStreetBudget(mode);active=budget.quality;
  markingMesh.count=budgets[active];hardscapeMesh.count=hardscape.length;
  markingMesh.visible=hardscapeMesh.visible=true;markingMesh.castShadow=false;hardscapeMesh.castShadow=false;
  hardscapeMesh.receiveShadow=active!=='performance';markingMesh.receiveShadow=false;
 };
 setQuality(quality);
 return Object.freeze({
  markingMesh,hardscapeMesh,setQuality,drawCalls:2,budgets,
  get activeBudget(){return active},
  counts:Object.freeze({adopted:loose.length,dashes:dashes.length,crosswalks:crosswalks.length,approachDashes:approachDashes.length,curbs:hardscape.filter(item=>item.role==='curb').length,approach:hardscape.filter(item=>item.role==='approach'||item.role==='approach-curb').length,markings:markings.length,hardscape:hardscape.length,performanceMarkings:performanceCount,colliders:0,replacedDraws:loose.length})
 });
}
