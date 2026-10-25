import * as THREE from './vendor/three.module.min.js';
import {VEHICLE_ROADS,PEDESTRIAN_WAYS} from './road-zones.mjs?v=68';
import {PARKING_BAYS} from './parking-guide.mjs?v=69';
import {townMaterialOptions} from './town-materials.mjs?v=75';
import {townRoleColor} from './town-palette.mjs?v=76';

const freezeRecords=records=>Object.freeze(records.map(record=>Object.freeze(record)));
const horizontal=VEHICLE_ROADS.filter(road=>road.axis==='horizontal');
const vertical=VEHICLE_ROADS.filter(road=>road.axis==='vertical');
export const STREET_JUNCTIONS=freezeRecords(vertical.flatMap(v=>horizontal.filter(h=>Math.abs(v.x-h.x)<=h.w/2&&Math.abs(h.z-v.z)<=v.d/2).map((h,index)=>({id:`junction-${v.x}-${h.z}-${index}`,x:v.x,z:h.z}))));

function nearestParallelRoad(way){
 const coordinate=way.axis==='horizontal'?'z':'x';
 return VEHICLE_ROADS.filter(road=>road.axis===way.axis).reduce((best,road)=>!best||Math.abs(way[coordinate]-road[coordinate])<Math.abs(way[coordinate]-best[coordinate])?road:best,null);
}
export const STREET_CURBS=freezeRecords(PEDESTRIAN_WAYS.map((way,index)=>{
 const road=nearestParallelRoad(way),horizontalWay=way.axis==='horizontal',coordinate=horizontalWay?'z':'x',sign=Math.sign(way[coordinate]-road[coordinate])||1;
 return {id:`curb-${index}`,axis:way.axis,x:horizontalWay?way.x:road.x+sign*(road.w/2+.11),z:horizontalWay?road.z+sign*(road.d/2+.11):way.z,w:horizontalWay?way.w:.22,d:horizontalWay?.22:way.d};
}));

const finite=n=>Number.isFinite(n);
export function streetConstructionProfile(junction,index=0){
 if(!junction||![junction.x,junction.z,index].every(finite))return null;
 return Object.freeze({id:String(junction.id||`junction-${index}`),x:junction.x,z:junction.z,stripes:16,ramps:4,tactile:8,crossingOffset:7.35,roadSpan:10});
}

function pushBox(list,x,y,z,w,h,d,color,ry=0){list.push({x,y,z,w,h,d,color,ry});}
function makeBatch(scene,items,style){
 const geometry=new THREE.BoxGeometry(1,1,1),material=new THREE.MeshStandardMaterial({color:0xffffff,...townMaterialOptions(style),vertexColors:true,polygonOffset:true,polygonOffsetFactor:-1}),mesh=new THREE.InstancedMesh(geometry,material,items.length),object=new THREE.Object3D(),color=new THREE.Color();
 for(let i=0;i<items.length;i++){const item=items[i];object.position.set(item.x,item.y,item.z);object.rotation.set(0,item.ry||0,0);object.scale.set(item.w,item.h,item.d);object.updateMatrix();mesh.setMatrixAt(i,object.matrix);mesh.setColorAt(i,color.setHex(item.color));}
 mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;mesh.receiveShadow=true;mesh.computeBoundingSphere();scene.add(mesh);return mesh;
}

export function createStreetConstruction({scene,junctions=STREET_JUNCTIONS,curbs=STREET_CURBS,bays=PARKING_BAYS,quality='balanced'}={}){
 if(!scene||![junctions,curbs,bays].every(Array.isArray))throw new TypeError('Street construction needs a scene and authored arrays.');
 const profiles=junctions.map(streetConstructionProfile).filter(Boolean),markings=[],hardscape=[];
 for(const p of profiles){
  for(const side of [-1,1])for(const lane of [-1.5,-.5,.5,1.5]){
   pushBox(markings,p.x,.026,p.z+side*(p.crossingOffset+lane*.48),p.roadSpan,.018,.28,townRoleColor('crossing'));
   pushBox(markings,p.x+side*(p.crossingOffset+lane*.48),.027,p.z,.28,.018,p.roadSpan,townRoleColor('crossing'));
  }
  for(const sx of [-1,1])for(const sz of [-1,1]){
   pushBox(hardscape,p.x+sx*7.72,.055,p.z+sz*7.72,2.65,.055,2.65,townRoleColor('hardscapeA'));
   pushBox(hardscape,p.x+sx*7.02,.087,p.z+sz*7.72,.34,.035,1.55,townRoleColor('tactile'));
   pushBox(hardscape,p.x+sx*7.72,.088,p.z+sz*7.02,1.55,.035,.34,townRoleColor('tactile'));
  }
 }
 for(const curb of curbs)pushBox(hardscape,curb.x,.08,curb.z,curb.w,.16,curb.d,townRoleColor('curb'));
 for(const bay of bays){
  if(!bay||![bay.x,bay.z,bay.angle].every(finite))continue;
  const fx=Math.sin(bay.angle),fz=Math.cos(bay.angle),rx=Math.cos(bay.angle),rz=-Math.sin(bay.angle);
  for(const side of [-1,1])pushBox(markings,bay.x+rx*side*1.35,.028,bay.z+rz*side*1.35,.12,.02,6.2,townRoleColor('parking'),bay.angle);
  for(const end of [-1,1])pushBox(markings,bay.x+fx*end*3.05,.029,bay.z+fz*end*3.05,2.82,.02,.12,townRoleColor('parking'),bay.angle);
  pushBox(hardscape,bay.x-fx*2.35,.12,bay.z-fz*2.35,1.7,.24,.24,0x8f8b78,bay.angle);
 }
 const markingMesh=makeBatch(scene,markings,'marking'),hardscapeMesh=makeBatch(scene,hardscape,'hardscape');
 markingMesh.castShadow=false;
 const setQuality=q=>{markingMesh.visible=true;hardscapeMesh.visible=true;hardscapeMesh.castShadow=q!=='performance';};setQuality(quality);
 return Object.freeze({profiles:Object.freeze(profiles),markingMesh,hardscapeMesh,setQuality,drawCalls:2,counts:Object.freeze({junctions:profiles.length,curbs:curbs.length,bays:bays.length,markings:markings.length,hardscape:hardscape.length})});
}
