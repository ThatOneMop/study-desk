import * as THREE from './vendor/three.module.min.js';
import {contactTexture} from './graphics-atmosphere.mjs';
import {chooseParcel} from './parcel-handling.mjs';
// All fittings stay within the existing crate collision envelope. Fixed resources.
export function createParcelFinish(scene,groups){
 const geo=new THREE.BoxGeometry(1,1,1),material=new THREE.MeshStandardMaterial({roughness:.93,color:0xffffff}),dummy=new THREE.Object3D(),color=new THREE.Color();
 const labels=['RETURN TO SENDER','NO NIGHT DELIVERIES','BAY SALVAGE / 03','NOT FOR THE MAYOR'];
 const fittings=groups.map((group,index)=>{
  const parts=[];
  for(const side of [-1,1]){
   for(let row=0;row<4;row++)parts.push([0,-.21+row*.14,side*.29,.57,.012,.008,0x665b48]);
   for(const x of [-.24,.24])parts.push([x,0,side*.291,.045,.54,.007,0x706955]);
   parts.push([0,.04,side*.294,.31,.15,.002,index%2?0xaaa585:0xc5b38c]);
   for(let line=0;line<3;line++)parts.push([-.015,.08-line*.035,side*.295,.23-line*.035,.012,.001,0x554f43]);
  }
  const mesh=new THREE.InstancedMesh(geo,material,parts.length);
  parts.forEach((p,i)=>{dummy.position.set(p[0],p[1],p[2]);dummy.rotation.set(0,0,0);dummy.scale.set(p[3],p[4],p[5]);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);mesh.setColorAt(i,color.setHex(p[6]));});
  mesh.name=labels[index%labels.length];mesh.receiveShadow=true;group.add(mesh);return mesh;
 });
 const shadowMaterial=new THREE.MeshBasicMaterial({map:contactTexture(),transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1});
 const shadows=new THREE.InstancedMesh(new THREE.PlaneGeometry(1,1),shadowMaterial,groups.length);shadows.frustumCulled=false;scene.add(shadows);
 const outline=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(.68,.66,.60)),new THREE.LineBasicMaterial({color:0xd8be85,transparent:true,opacity:.6}));outline.visible=false;scene.add(outline);
 return {fittings,shadows,outline,update(props,{active,floorHeight,actor,yaw,pitch,eligible,focused}){
  shadows.visible=!!active;let count=0;
  for(const p of props.slice(0,groups.length)){
   if(![p.x,p.y,p.z].every(Number.isFinite))continue;
   const ground=floorHeight(p.x,p.z),height=Math.max(0,p.y-ground-.325),scale=Math.max(.15,1-height*.25);
   dummy.position.set(p.x,ground+.018,p.z);dummy.rotation.set(-Math.PI/2,0,0);dummy.scale.set(1.1*scale,1.05*scale,1);dummy.updateMatrix();shadows.setMatrixAt(count++,dummy.matrix);
  }
  shadows.count=count;shadows.instanceMatrix.needsUpdate=true;
  const i=active&&focused?chooseParcel(props,actor,yaw,pitch,eligible):-1;outline.visible=i>=0&&!!groups[i];
  if(outline.visible){outline.position.copy(groups[i].position);outline.rotation.copy(groups[i].rotation);}
 }};
}
