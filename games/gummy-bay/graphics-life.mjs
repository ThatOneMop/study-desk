import * as THREE from './vendor/three.module.min.js';
import {graphicBatch} from './graphics-architecture.mjs';
import {contactTexture} from './graphics-atmosphere.mjs';
// Stage 4: readable resident clothing and workshop craft detail, derived from live state.
export function everydayClothing(id,color=0x668978){
 const parts=[],style=((id%4)+4)%4;
 const add=(x,y,z,w,h,d,c)=>parts.push({x,y,z,w,h,d,color:c});
 const dark=new THREE.Color(color).multiplyScalar(.56).getHex(),light=new THREE.Color(color).lerp(new THREE.Color(0xeadcc0),.45).getHex();
 // Existing outfits use positive Z as the actor's forward direction.
 add(0,1.24,.225,.24,.055,.045,light);add(0,.76,.22,.45,.045,.04,dark);
 if(style===0){for(const side of [-1,1]){add(side*.12,1.04,.236,.18,.39,.038,color);add(side*.12,.91,.264,.14,.09,.018,dark);}add(0,1.04,.266,.025,.4,.015,0xc4bda1);}
 if(style===1){for(let j=0;j<4;j++)add(0,.85+j*.1,.244,.41,.025,.025,light);}
 if(style===2){for(const side of [-1,1])add(side*.18,1.05,.24,.045,.40,.035,dark);add(.11,1.05,.267,.13,.15,.025,light);}
 if(style===3){add(-.12,1.08,.25,.15,.13,.025,light);for(let j=0;j<4;j++)add(0,.86+j*.09,.25,.025,.025,.02,0xd0c8ac);}
 return parts;
}
export function createLifeOverhaul({scene,actors,homes,vendorActors=[]}){
 const clothing=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshStandardMaterial({color:0xffffff,roughness:.9}),512);
 clothing.name='Everyday resident garment details';clothing.count=0;clothing.frustumCulled=false;clothing.receiveShadow=true;clothing.instanceMatrix.setUsage(THREE.DynamicDrawUsage);scene.add(clothing);
 const shadow=new THREE.InstancedMesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({map:contactTexture(),transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1}),64);
 shadow.name='Resident grounding shadows';shadow.count=0;shadow.frustumCulled=false;scene.add(shadow);
 const local=new THREE.Object3D(),world=new THREE.Matrix4(),color=new THREE.Color(),cache=new Map(),excluded=new Set(vendorActors);
 const rooms=homes.map((h,i)=>{
  const g=new THREE.Group();g.name='Craft workshop finish '+i;scene.add(g);const pieces=[];
  const box=(x,y,z,w,hh,d,c,role)=>pieces.push({x:h.x+x,y,z:h.z+z,w,h:hh,d,color:c,role});
  // Table-mounted components stay inside existing solid table footprint.
  for(let j=0;j<18;j++)box(5.12+j*.22,1.355,3,.015,.012,1.22,0x557472,'brushed-table');
  for(let j=0;j<8;j++)box(5.3+j*.22,1.45,2.55,.14,.16,.18,0xb6b38a,'mould-stack');
  box(7.85,1.36,3.45,1.25,.025,.18,0x47766f,'packing-edge');
  for(let j=0;j<10;j++)box(7.3+j*.12,1.382,3.45,.045,.006,.12,0xe9ce83,'ruler-tick');
  // Back-wall fixture and tile courses do not introduce floor obstacles.
  for(let j=0;j<12;j++)box(-h.w*.38+j*h.w*.065,1.5,-h.d/2+.03,h.w*.06,.75,.035,i===0?0xa5b5a5:i===1?0x9db6b2:0xc1b8a0,'backsplash');
  const mesh=graphicBatch(g,'Workshop tilework and bench finish',pieces);g.visible=false;
  return {g,mesh};
 });
 function update({active,state,quality}){
  let n=0,sh=0;
  if(active)for(const a of actors){
   if(!a.body?.visible||!a.g?.visible)continue;
   a.g.updateWorldMatrix(true,false);
   if(sh<64){local.position.set(a.g.position.x,a.g.position.y+.018,a.g.position.z);local.rotation.set(-Math.PI/2,0,0);local.scale.set(.95,.70,1);local.updateMatrix();shadow.setMatrixAt(sh++,local.matrix);}
   if(a.isCop||excluded.has(a.g)||quality==='performance')continue;
   const chest=a.body.getObjectByName('Chest');if(!chest)continue;chest.updateWorldMatrix(true,false);const id=a.g.userData.id;let parts=cache.get(a.g);if(!parts){parts=everydayClothing(id,a.clothingBase);cache.set(a.g,parts);}
   for(const p of parts){if(n>=512)break;local.position.set(p.x,p.y-.95,p.z);local.rotation.set(0,0,0);local.scale.set(p.w,p.h,p.d);local.updateMatrix();world.multiplyMatrices(chest.matrixWorld,local.matrix);clothing.setMatrixAt(n,world);clothing.setColorAt(n++,color.setHex(p.color));}
  }
  clothing.count=n;shadow.count=sh;clothing.visible=active&&n>0;shadow.visible=active&&sh>0;clothing.instanceMatrix.needsUpdate=shadow.instanceMatrix.needsUpdate=true;if(clothing.instanceColor)clothing.instanceColor.needsUpdate=true;
  rooms.forEach((r,i)=>r.g.visible=!!active&&!!state.room&&state.house===i&&quality!=='performance');
 }
 return {clothing,shadow,rooms,update};
}
