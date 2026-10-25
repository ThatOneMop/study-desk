import * as THREE from './vendor/three.module.min.js';
import {DISTRICT_BUILDING_SITES,districtArchitectureProfile} from './district-architecture.mjs?v=77';

const freezeRecords=records=>Object.freeze(records.map(record=>Object.freeze(record)));
export const TOWN_UTILITY_SITES=freezeRecords([
 {id:'west-meter-bank',label:'West Grid meter bank',kind:'meter-bank',supportId:'district-building-1'},
 {id:'bay-rain-catch',label:'Bay Rain catch tank',kind:'rain-tank',supportId:'district-building-6'},
 {id:'market-condenser',label:'Market cold-room condenser',kind:'condenser',supportId:'district-building-14'},
 {id:'brick-meter-bank',label:'Brick Walk meter bank',kind:'meter-bank',supportId:'district-building-22'},
 {id:'servo-extractor',label:'North Servo extractor',kind:'extractor',supportId:'district-building-31'},
 {id:'heights-rain-catch',label:'Heights Rain catch tank',kind:'rain-tank',supportId:'district-building-37'},
 {id:'north-condenser',label:'Northgate workshop condenser',kind:'condenser',supportId:'district-building-43'},
 {id:'sugarworks-extractor',label:'Sugarworks extractor',kind:'extractor',supportId:'district-building-48'},
 {id:'harbor-meter-bank',label:'Harbor Grid meter bank',kind:'meter-bank',supportId:'district-building-52'},
 {id:'coast-condenser',label:'East Coast cold-room condenser',kind:'condenser',supportId:'district-building-57'}
]);
export const TOWN_UTILITY_KINDS=Object.freeze({
 'meter-bank':Object.freeze({purpose:'Power metering',boxColor:0x778680,pipeColor:0x4f6261,along:.2}),
 condenser:Object.freeze({purpose:'Cold-room cooling',boxColor:0x87928a,pipeColor:0x596c6b,along:-.35}),
 'rain-tank':Object.freeze({purpose:'Rainwater storage',boxColor:0x627b79,pipeColor:0x77918d,along:.45}),
 extractor:Object.freeze({purpose:'Workshop ventilation',boxColor:0x796f65,pipeColor:0x5c625d,along:-.15})
});

const finite=n=>Number.isFinite(n);
export function townUtilityProfile(site,index=0,supports=DISTRICT_BUILDING_SITES){
 if(!site||typeof site.id!=='string'||!site.id||typeof site.label!=='string'||!site.label||!Object.hasOwn(TOWN_UTILITY_KINDS,site.kind)||typeof site.supportId!=='string'||!finite(index)||!Array.isArray(supports))return null;
 const supportIndex=supports.findIndex(record=>record?.id===site.supportId);if(supportIndex<0)return null;
 const support=supports[supportIndex],building=districtArchitectureProfile(support,supportIndex);if(!building)return null;
 const spec=TOWN_UTILITY_KINDS[site.kind],backSign=-building.front.sign,along=spec.along+(index%2?-.22:.22),massHalf=building.front.axis==='z'?building.d/2:building.w/2;
 const x=building.front.axis==='z'?building.x+along:building.x+backSign*(massHalf+.3),z=building.front.axis==='z'?building.z+backSign*(massHalf+.3):building.z+along;
 const footprint=building.front.axis==='z'?Object.freeze({w:1.9,d:.65}):Object.freeze({w:.65,d:1.9});
 return Object.freeze({...site,index,support,supportIndex,purpose:spec.purpose,x,z,axis:building.front.axis,backSign,footprint,boxColor:spec.boxColor,pipeColor:spec.pipeColor});
}
export const TOWN_UTILITY_PROFILES=Object.freeze(TOWN_UTILITY_SITES.map((site,index)=>townUtilityProfile(site,index)));

export function utilityInsideSupport(profile,margin=.08){
 if(!profile||!profile.support||!profile.footprint||![profile.x,profile.z,profile.footprint.w,profile.footprint.d,profile.support.x,profile.support.z,profile.support.w,profile.support.d,margin].every(finite)||margin<0)return false;
 return Math.abs(profile.x-profile.support.x)+profile.footprint.w/2+margin<=profile.support.w/2&&Math.abs(profile.z-profile.support.z)+profile.footprint.d/2+margin<=profile.support.d/2;
}

function pushBox(list,p,along,y,width,height,depth,color,offset=0){
 if(p.axis==='z')list.push({x:p.x+along,y,z:p.z+p.backSign*offset,sx:width,sy:height,sz:depth,color});
 else list.push({x:p.x+p.backSign*offset,y,z:p.z+along,sx:depth,sy:height,sz:width,color});
}
function pushCylinder(list,p,along,y,radius,height,color,offset=0){
 if(p.axis==='z')list.push({x:p.x+along,y,z:p.z+p.backSign*offset,sx:radius,sy:height,sz:radius,color});
 else list.push({x:p.x+p.backSign*offset,y,z:p.z+along,sx:radius,sy:height,sz:radius,color});
}
function makeBatch(scene,geometry,items){
 const material=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.9,metalness:.12,vertexColors:true,flatShading:true}),mesh=new THREE.InstancedMesh(geometry,material,items.length),dummy=new THREE.Object3D(),color=new THREE.Color();
 for(let i=0;i<items.length;i++){const item=items[i];dummy.position.set(item.x,item.y,item.z);dummy.scale.set(item.sx,item.sy,item.sz);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);mesh.setColorAt(i,color.setHex(item.color));}
 mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;mesh.castShadow=false;mesh.receiveShadow=true;mesh.computeBoundingSphere();scene.add(mesh);return mesh;
}

export function createTownUtilities({scene,sites=TOWN_UTILITY_SITES,supports=DISTRICT_BUILDING_SITES,quality='balanced'}={}){
 if(!scene||!Array.isArray(sites)||!Array.isArray(supports))throw new TypeError('Town utilities need a scene, utility sites and building supports.');
 const profiles=sites.map((site,index)=>townUtilityProfile(site,index,supports)).filter(profile=>profile&&utilityInsideSupport(profile)),boxes=[],cylinders=[];
 for(const p of profiles){
  if(p.kind==='meter-bank'){
   pushBox(boxes,p,-.4,.76,.72,1.3,.48,p.boxColor);pushBox(boxes,p,.42,.76,.72,1.3,.48,p.boxColor);
   pushCylinder(cylinders,p,-.4,1.52,.08,.78,p.pipeColor,-.03);pushCylinder(cylinders,p,.42,1.52,.08,.78,p.pipeColor,-.03);
  }else if(p.kind==='condenser'){
   pushBox(boxes,p,0,.62,1.55,1.12,.56,p.boxColor);pushBox(boxes,p,0,.62,1.1,.72,.08,0x3e5152,.33);
   pushCylinder(cylinders,p,0,.62,.34,.12,p.pipeColor,.39);
  }else if(p.kind==='rain-tank'){
   pushBox(boxes,p,0,.12,1.5,.24,.58,p.boxColor);pushCylinder(cylinders,p,0,1.12,.58,2.05,p.pipeColor);
   pushCylinder(cylinders,p,.68,.9,.07,1.7,p.boxColor,-.08);
  }else{
   pushBox(boxes,p,0,1.38,1.45,.48,.56,p.boxColor);pushCylinder(cylinders,p,0,2.05,.34,1.1,p.pipeColor);
   pushCylinder(cylinders,p,0,2.67,.48,.18,p.boxColor);
  }
 }
 const boxMesh=makeBatch(scene,new THREE.BoxGeometry(1,1,1),boxes),cylinderMesh=makeBatch(scene,new THREE.CylinderGeometry(1,1,1,8),cylinders);
 const setQuality=q=>{boxMesh.visible=true;cylinderMesh.visible=true;boxMesh.castShadow=q==='high';cylinderMesh.castShadow=false;};setQuality(quality);
 return Object.freeze({profiles:Object.freeze(profiles),boxMesh,cylinderMesh,setQuality,drawCalls:2,counts:Object.freeze({sites:profiles.length,boxes:boxes.length,cylinders:cylinders.length})});
}
