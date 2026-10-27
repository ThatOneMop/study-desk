// v173 customer crowd. One instanced people kit for every contact: 3 draw calls
// however many locals are on the street. Looks come from customer-cast; this
// file only poses them. Walking uses the existing procedural joint swing.
import {personLook,createPeopleMeshes,createJointSet,proceduralJoints,writePerson,flushPeopleMeshes,scaleJointsAbout,breathe} from './people-kit.mjs';

export function customerLook(index,over={}){
 const base=personLook(800+(index|0),'townsfolk',{
  color:Number.isFinite(over.top)?over.top:undefined,
  skin:Number.isFinite(over.skin)?over.skin:undefined,
  hair:Number.isFinite(over.hair)?over.hair:undefined
 });
 const look={...base,...over,id:800+(index|0),role:'customer'};
 const skin=look.skin,top=look.top;
 if(over.sleeve===undefined)look.sleeve=(look.topStyle==='tee'||look.topStyle==='polo'||look.topStyle==='overalls')?skin:top;
 if(over.arm===undefined)look.arm=look.topStyle==='overalls'?(look.inner??top):top;
 if(over.hood===undefined)look.hood=top;
 if(over.beardColor===undefined)look.beardColor=look.hair;
 if(over.inner===undefined&&(look.topStyle==='jacket'||look.topStyle==='flannel'||look.topStyle==='puffer'||look.topStyle==='track'))look.inner=look.inner||top;
 look.glasses=(look.eyewear||0)>0;
 look.hoodUp=false;
 return Object.freeze(look);
}

export function createCustomerCrowd({THREE,scene,contacts=[],people=[],looks=[]}={}){
 const slots=[];
 const count=Math.max(contacts.length||0,looks.length||0);
 for(let i=0;i<count;i++)if(looks[i])slots.push(i);
 const capacity=Math.max(8,slots.length||1);
 const meshes=createPeopleMeshes(THREE,scene,capacity,'Customer crowd');
 const joints=slots.map(()=>createJointSet());
 const baked=slots.map(i=>customerLook(i,looks[i]));
 const root=new THREE.Matrix4();
 function update({now=0,pose}={}){
  let n=0;
  for(let s=0;s<slots.length;s++){
   const i=slots[s];
   const p=pose?pose(i):null;
   if(!p||p.show===false)continue;
   const g=people[i];
   const x=Number.isFinite(p.x)?p.x:(g?.position?.x||0);
   const z=Number.isFinite(p.z)?p.z:(g?.position?.z||0);
   const y=Number.isFinite(p.y)?p.y:(g?.position?.y||0);
   const yaw=Number.isFinite(p.yaw)?p.yaw:(g?.rotation?.y||0);
   root.makeRotationY(yaw);
   root.setPosition(x,y,z);
   const moving=!!p.moving;
   const swing=moving?Math.sin((now||0)*7+i):0;
   proceduralJoints(joints[s],root,{swing,breath:breathe(now||0,i),bob:moving?Math.abs(Math.sin((now||0)*7+i))*.015:0});
   const height=baked[s].height||1;
   if(Math.abs(height-1)>.02)scaleJointsAbout(joints[s],x,y,z,height);
   writePerson(meshes,n,joints[s],baked[s],{detail:true,face:p.face||'open',active:true});
   n++;
  }
  flushPeopleMeshes(meshes,n>0,n);
  return n;
 }
 return {update,drawCalls:3,capacity,slots};
}
