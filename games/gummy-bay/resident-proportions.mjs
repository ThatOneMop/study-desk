export const RESIDENT_PROPORTION_COLLIDERS=Object.freeze([]);

const freezeScale=(x,y,z)=>Object.freeze({x,y,z});
const freezeFoot=(width,height,depth,drop,forward,color)=>Object.freeze({width,height,depth,drop,forward,color});
export const RESIDENT_PROPORTION_PROFILES=Object.freeze([
 Object.freeze({id:'reed',head:freezeScale(.93,1.10,1),forearm:freezeScale(.985,1.035,.985),hand:freezeScale(1.08,1.05,1.08),chest:freezeScale(.90,1.065,.96),foot:freezeFoot(.25,.13,.37,.345,-.07,0x3b5962)}),
 Object.freeze({id:'shore',head:freezeScale(.99,1.045,1.025),forearm:freezeScale(.99,1.02,.99),hand:freezeScale(1.055,1.04,1.055),chest:freezeScale(.94,1.035,.97),foot:freezeFoot(.24,.12,.35,.35,-.06,0x5b5249)}),
 Object.freeze({id:'stack',head:freezeScale(1.075,1.035,.99),forearm:freezeScale(.98,1.045,.98),hand:freezeScale(1.1,1.06,1.1),chest:freezeScale(.98,1.025,1),foot:freezeFoot(.28,.14,.4,.34,-.085,0x495b47)}),
 Object.freeze({id:'harbor',head:freezeScale(.95,1.08,1.035),forearm:freezeScale(.985,1.03,.985),hand:freezeScale(1.07,1.045,1.07),chest:freezeScale(.92,1.055,.97),foot:freezeFoot(.26,.125,.38,.347,-.075,0x4e4b66)}),
 Object.freeze({id:'ridge',head:freezeScale(.98,1.12,1.01),forearm:freezeScale(.98,1.04,.98),hand:freezeScale(1.115,1.065,1.115),chest:freezeScale(.89,1.075,.96),foot:freezeFoot(.27,.135,.39,.342,-.08,0x665044)})
]);

export function residentProportionProfile(id=0){
 id=Number.isFinite(id)?Math.trunc(id):0;
 return RESIDENT_PROPORTION_PROFILES[((id%RESIDENT_PROPORTION_PROFILES.length)+RESIDENT_PROPORTION_PROFILES.length)%RESIDENT_PROPORTION_PROFILES.length];
}

export function createResidentProportionRig({body,id=0}={}){
 if(!body||typeof body.getObjectByName!=='function')throw new TypeError('A resident proportion rig needs an animated body.');
 const profile=residentProportionProfile(id),rig={
  profile,body,hips:body.getObjectByName('Hips'),
  chest:body.getObjectByName('Chest'),
  head:body.getObjectByName('Head'),
  forearms:[body.getObjectByName('Forearm-1'),body.getObjectByName('Forearm1')],
  hands:[body.getObjectByName('Hand-1'),body.getObjectByName('Hand1')]
 };
 if(!rig.chest||!rig.head||rig.forearms.some(v=>!v)||rig.hands.some(v=>!v))throw new TypeError('Resident rig is missing a proportion bone.');
 Object.freeze(rig.forearms);Object.freeze(rig.hands);return Object.freeze(rig);
}

const setScale=(bone,scale)=>bone.scale.set(scale.x,scale.y,scale.z);
export function applyResidentProportionRig(rig){
 if(!rig?.profile)return false;
 setScale(rig.chest,rig.profile.chest);setScale(rig.head,rig.profile.head);
 // Elongate the body below the face while preserving head size and planted feet.
 // The authored pelvis rests at .78 m; compensate its downward leg stretch at the model root.
 if(rig.hips){rig.hips.scale.set(1,1.18,1);rig.head.scale.y/=1.18;rig.body.position.y=.78*.18*rig.body.scale.y;}
 for(const bone of rig.forearms)setScale(bone,rig.profile.forearm);
 for(const bone of rig.hands)setScale(bone,rig.profile.hand);
 return true;
}

function makeFootBatch(THREE,scene,capacity,name,roughness){
 const mesh=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshStandardMaterial({color:0xffffff,roughness,metalness:0,flatShading:true}),capacity*2);
 mesh.name=name;mesh.count=0;mesh.castShadow=false;mesh.receiveShadow=true;mesh.frustumCulled=false;mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);scene.add(mesh);return mesh;
}

export function createResidentFootSilhouettes({THREE,scene,actors,capacity=32,quality='balanced'}={}){
 if(!THREE?.InstancedMesh||!scene?.add||!Array.isArray(actors))throw new TypeError('Resident foot silhouettes need THREE, a scene and the live actor list.');
 if(!Number.isSafeInteger(capacity)||capacity<1)throw new RangeError('Resident foot silhouette capacity must be a positive integer.');
 const upper=makeFootBatch(THREE,scene,capacity,'Resident shoe uppers',.88),sole=makeFootBatch(THREE,scene,capacity,'Resident shoe soles',.94),local=new THREE.Object3D(),world=new THREE.Matrix4(),color=new THREE.Color(),soleColor=new THREE.Color(0x273432);
 const write=(mesh,index,bone,foot,part)=>{
  const isSole=part==='sole';local.position.set(0,foot.drop+(isSole?foot.height*.43:0),foot.forward-(isSole ? .006 : 0));local.rotation.set(0,0,0);local.scale.set(foot.width+(isSole ? .018 : 0),isSole ? .045 : foot.height,foot.depth+(isSole ? .014 : 0));local.updateMatrix();world.multiplyMatrices(bone.matrixWorld,local.matrix);mesh.setMatrixAt(index,world);mesh.setColorAt(index,isSole?soleColor:color.setHex(foot.color));
 };
 const update=({active=true}={})=>{
  let count=0;if(active)for(const actor of actors){if(count>=capacity*2)break;const body=actor?.body;if(!body||body.visible===false||typeof body.getObjectByName!=='function')continue;const left=body.getObjectByName('Shin-1'),right=body.getObjectByName('Shin1');if(!left||!right)continue;body.updateWorldMatrix(true,true);const foot=(actor.proportions?.profile||residentProportionProfile(actor?.g?.userData?.id)).foot;for(const bone of [left,right]){write(upper,count,bone,foot,'upper');write(sole,count,bone,foot,'sole');count++;}}
  upper.count=sole.count=count;upper.visible=sole.visible=!!active&&count>0;upper.instanceMatrix.needsUpdate=sole.instanceMatrix.needsUpdate=true;if(upper.instanceColor)upper.instanceColor.needsUpdate=true;if(sole.instanceColor)sole.instanceColor.needsUpdate=true;return count;
 };
 const setQuality=q=>{upper.castShadow=q==='high';sole.castShadow=q!=='performance';upper.receiveShadow=sole.receiveShadow=true;};
 setQuality(quality);update({active:false});
 return Object.freeze({upper,sole,update,setQuality,drawCalls:2,capacity,counts:Object.freeze({partsPerActor:4,colliders:0,textures:0})});
}
