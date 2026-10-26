// Sugar Squad drawn with the shared person kit: navy uniform, yellow cap band,
// grey vest. Original procedural props for cover, the stall and the dizzy stars.
import {personLook,namedLook,proceduralJoints,createJointSet,writePerson,createPeopleMeshes,flushPeopleMeshes,breathe,PERSON_SLOT,PERSON_MESH_PARTS} from './people-kit.mjs?v=146';
import {HIDE_SPOTS} from './hide-spots.mjs?v=132';
import {VISION_YAW} from './police-vision.mjs?v=132';

export const SQUAD_SHOP=Object.freeze({x:8,z:-8,label:'Shady Seconds'});
export const SQUAD_PAN=Object.freeze({x:-70,z:20,label:'A dented frying pan'});

const BOX_COUNT=PERSON_MESH_PARTS.box.length;
const BADGE=PERSON_SLOT.badge??0;

export function createSquadCast({THREE,scene,capacity=10}={}){
 if(!scene?.add||!THREE)throw new TypeError('Sugar Squad needs a scene.');
 const meshes=createPeopleMeshes(THREE,scene,capacity,'Sugar Squad');
 // v146: the lead officer is Inspector Hank Hardtack in his banded cap and moustache.
 const looks=Array.from({length:capacity},(_,index)=>index===0?namedLook('hank hardtack',personLook(3,'police'),3):personLook(index+3,'police'));
 const joints=createJointSet();
 const root=new THREE.Matrix4(),pos=new THREE.Vector3(),quat=new THREE.Quaternion(),up=new THREE.Vector3(0,1,0),unit=new THREE.Vector3(1,1,1),heightScale=new THREE.Vector3(1,1,1);
 const scratch=new THREE.Color();
 const mat=color=>new THREE.MeshStandardMaterial({color,roughness:.84,metalness:0});
 const props=new THREE.Group();props.name='Sugar Squad props';scene.add(props);
 const add=mesh=>{mesh.castShadow=true;mesh.receiveShadow=true;props.add(mesh);return mesh;};
 for(const spot of HIDE_SPOTS){
  if(spot.kind==='dumpster'){
   const body=add(new THREE.Mesh(new THREE.BoxGeometry(1.5,1.05,.9),mat(0x2f5a3a)));
   body.position.set(spot.x,.62,spot.z);
   const lid=add(new THREE.Mesh(new THREE.BoxGeometry(1.54,.08,.92),mat(0x3d6b48)));
   lid.position.set(spot.x,1.18,spot.z);lid.rotation.x=-.35;
  }else if(spot.kind==='porta-loo'){
   const body=add(new THREE.Mesh(new THREE.BoxGeometry(.86,2.05,.86),mat(0x3aa0b8)));
   body.position.set(spot.x,1.05,spot.z);
   const door=add(new THREE.Mesh(new THREE.BoxGeometry(.5,1.5,.04),mat(0x2c7c90)));
   door.position.set(spot.x,1.05,spot.z+.44);
  }else{
   for(const [ox,oz] of [[-.7,0],[0,.15],[.7,-.05]]){
    const bush=add(new THREE.Mesh(new THREE.BoxGeometry(.7,.8,.55),mat(0x3f7a3c)));
    bush.position.set(spot.x+ox,.45,spot.z+oz);
   }
  }
 }
 const stall=add(new THREE.Mesh(new THREE.BoxGeometry(2.2,1.3,1.4),mat(0x6b4a62)));
 stall.position.set(SQUAD_SHOP.x,.7,SQUAD_SHOP.z);
 const awning=add(new THREE.Mesh(new THREE.BoxGeometry(2.4,.08,1.1),mat(0xd7a15a)));
 awning.position.set(SQUAD_SHOP.x,1.45,SQUAD_SHOP.z+.2);
 const pan=add(new THREE.Mesh(new THREE.CylinderGeometry(.22,.22,.06,10),mat(0xb7b1a8)));
 pan.position.set(SQUAD_PAN.x,.08,SQUAD_PAN.z);
 const coneMat=new THREE.MeshBasicMaterial({color:0xffd24a,transparent:true,opacity:.42,depthWrite:false,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-4,polygonOffsetUnits:-4});
 const cone=new THREE.Mesh(new THREE.CircleGeometry(14,28,-VISION_YAW/2,VISION_YAW),coneMat);
 cone.rotation.x=-Math.PI/2;cone.rotation.z=-Math.PI/2;cone.renderOrder=4;
 const conePivot=new THREE.Group();conePivot.add(cone);conePivot.visible=false;scene.add(conePivot);
 const dizzyMat=new THREE.MeshBasicMaterial({color:0xffd34d});
 const birdMat=new THREE.MeshBasicMaterial({color:0xf4f0dc});
 const stars=new THREE.Group(),birds=new THREE.Group();
 for(let i=0;i<3;i++){
  const star=new THREE.Mesh(new THREE.OctahedronGeometry(.16,0),dizzyMat);stars.add(star);
  const bird=new THREE.Mesh(new THREE.SphereGeometry(.1,6,5),birdMat);birds.add(bird);
 }
 stars.visible=false;birds.visible=false;scene.add(stars);scene.add(birds);
 function placeDizzy(x,y,z,style,now){
  const show=Number.isFinite(x);
  stars.visible=show&&style!=='birdies';birds.visible=show&&style==='birdies';
  const group=style==='birdies'?birds:stars;
  if(!show)return;
  group.position.set(x,y+1.72,z);
  group.children.forEach((child,index)=>{
   const spin=now*3.2+index*2.1;
   child.position.set(Math.cos(spin)*.46,Math.sin(now*2.4+index)*.1,Math.sin(spin)*.46);
  });
 }
 function update({officers=[],now=0,floor=()=>0,showCone=false,dizzy=null,legacy=[]}={}){
  const clock=Number.isFinite(now)?now:0;
  const list=Array.isArray(officers)?officers:[];
  let used=0;
  for(let index=0;index<capacity;index++){
   const cop=list[index];
   const live=!!(cop&&Number.isFinite(cop.x)&&Number.isFinite(cop.z));
   if(!live){writePerson(meshes,index,joints,looks[index],{active:false});continue;}
   const ground=typeof floor==='function'?floor(cop.x,cop.z)||0:0;
   const running=cop.squad==='pursuit'||cop.squad==='all-units'||cop.mode==='pursuit';
   const walking=running||cop.mode==='patrol'||cop.squad==='suspicious'||cop.squad==='investigating';
   const knocked=(cop.ko||0)>0;
   used=index+1;
   pos.set(cop.x,ground,cop.z);quat.setFromAxisAngle(up,Number.isFinite(cop.angle)?cop.angle:0);root.compose(pos,quat,heightScale.setScalar(looks[index].height||1));
   proceduralJoints(joints,root,{
    swing:walking&&!knocked?Math.sin(clock*(running?8.5:4.6)+index):0,
    sit:knocked,bob:walking?Math.abs(Math.cos(clock*6+index))*.03:0,
    raise:cop.squad==='suspicious'&&!knocked?-.8:0,
    sway:knocked?Math.sin(clock*2)*.08:0,
    breath:walking||knocked?0:breathe(clock,index)
   });
   writePerson(meshes,index,joints,looks[index],{detail:true,face:knocked?'blink':'open',active:true});
   if(running)meshes.box.setColorAt(index*BOX_COUNT+BADGE,scratch.setHex(Math.sin(clock*18)>0?0xff4d4d:0x4d7dff));
  }
  flushPeopleMeshes(meshes,used>0,used);
  const lead=list.find(cop=>cop&&(cop.squad==='suspicious'||cop.squad==='investigating'||cop.squad==='pursuit'||cop.squad==='all-units'));
  conePivot.visible=!!(showCone&&lead);
  if(conePivot.visible){const ground=typeof floor==='function'?floor(lead.x,lead.z)||0:0;conePivot.position.set(lead.x,ground+.12,lead.z);conePivot.rotation.y=lead.angle||0;}
  if(dizzy&&Number.isFinite(dizzy.x))placeDizzy(dizzy.x,dizzy.y||0,dizzy.z,dizzy.style,clock);
  else placeDizzy(NaN,0,0,'stars',clock);
  for(const group of legacy){
   if(!group?.children)continue;
   for(const child of group.children){
    if(!child||child.userData?.squadHidden===1)continue;
    let skinned=false;
    child.traverse?.(object=>{if(object.isSkinnedMesh)skinned=true;});
    if(skinned)continue;
    child.scale.setScalar(.001);
    child.userData=child.userData||{};
    child.userData.squadHidden=1;
   }
  }
  pan.visible=!dizzy?.panTaken;
 }
 return {meshes,props,cone:conePivot,stars,birds,update,shop:SQUAD_SHOP,pan:SQUAD_PAN};
}
