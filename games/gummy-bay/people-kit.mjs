// Shared look for Gummy Bay people (v126). Chunky, slightly stylised low-poly
// humans: rounded 0.33 m heads, boxy torsos, short thick limbs, flat clothing
// colours and a canvas-drawn 2D face. Original shapes and art, built in code.
import * as THREE from './vendor/three.module.min.js';

export const PEOPLE_FACE_COLS=8,PEOPLE_FACE_ROWS=3;
export const PEOPLE_FACE_STATES=Object.freeze({open:0,blink:1,talk:2});
export const PEOPLE_SKINS=Object.freeze([0xf1cba6,0xe2b088,0xcf9a6c,0xb77d52,0x9a623c,0x7c4d2e,0x5e3a24,0xeac0a0]);
export const PEOPLE_HAIR=Object.freeze([0x2a231d,0x45311f,0x6b4a2c,0x9a7040,0x1d1f22,0x5a3b28,0xb9b2a6,0xc8863e]);
// Street clothes: hoodies, bombers, flannels, tees and work jackets in muted, slightly grubby tones.
export const PEOPLE_TOPS=Object.freeze([0x4d6b8a,0xa8473c,0x5f7a4a,0xc2a25a,0x6e5a86,0x3d4a55,0xb8673a,0x2f6f6a,0x8c8c88,0x9a3f5c,0xd9cfb8,0x56483e]);
export const PEOPLE_PANTS=Object.freeze([0x33496a,0x2b3a55,0x3b3530,0x23262b,0x5d5444,0x41506a,0x6b6250]);
export const PEOPLE_SHOES=Object.freeze([0x1f1f22,0xe8e4dc,0x5a3a24,0x2c3440,0x8a2c2c]);
export const PEOPLE_TOP_STYLES=Object.freeze(['hoodie','jacket','tee','flannel','puffer']);
export const PEOPLE_HAIR_STYLES=Object.freeze(['short','long','buzz','bald','bun','cap']);
export const POLICE_LOOK=Object.freeze({top:0x1f2f4d,inner:0x16223a,pants:0x18233a,shoes:0x111318,cap:0x18243c,brim:0x0e1320,badge:0xd8b25a,belt:0x15161a});

const finite=value=>Number.isFinite(value)?value:0;
const pick=(list,n)=>list[((n%list.length)+list.length)%list.length];
const hash=n=>{let x=(Math.abs(Math.trunc(finite(n)))+1)*2654435761>>>0;x^=x>>>15;x=Math.imul(x,2246822519)>>>0;x^=x>>>13;return x>>>0;};
function shade(hex,amount){const c=new THREE.Color(hex);c.offsetHSL(0,0,amount);return c.getHex();}

// Deterministic look for one person. Role picks uniforms; everyone else mixes palettes.
export function personLook(id=0,role='townsfolk',palette={}){
 const n=Math.abs(Math.trunc(finite(id))),h=hash(n);
 const skin=Number.isFinite(palette.skin)?palette.skin:pick(PEOPLE_SKINS,h);
 const hair=Number.isFinite(palette.hair)?palette.hair:pick(PEOPLE_HAIR,h>>>3);
 const police=role==='police';
 let topStyle=pick(PEOPLE_TOP_STYLES,h>>>6),hairStyle=pick(PEOPLE_HAIR_STYLES,h>>>9);
 if(role==='worker'){topStyle='jacket';if(hairStyle==='cap'||hairStyle==='bun')hairStyle='short';}
 if(police){topStyle='uniform';hairStyle='police';}
 const top=police?POLICE_LOOK.top:role==='worker'?0xd98a2b:role==='seller'?0xc47b45:Number.isFinite(palette.color)?palette.color:pick(PEOPLE_TOPS,h>>>12);
 const inner=police?POLICE_LOOK.inner:topStyle==='jacket'||topStyle==='flannel'?pick([0xe6e0d2,0x2a2a2e,0x9fb0c2,0xc9b48a],h>>>15):shade(top,-.06);
 return Object.freeze({
  id:n,role,skin,hair,hairStyle,topStyle,top,inner,
  sleeve:topStyle==='tee'?skin:top,
  pants:police?POLICE_LOOK.pants:role==='worker'?0x2f3d52:pick(PEOPLE_PANTS,h>>>18),
  shoes:police?POLICE_LOOK.shoes:pick(PEOPLE_SHOES,h>>>21),
  hood:topStyle==='hoodie'?shade(top,-.05):top,
  cap:police?POLICE_LOOK.cap:pick([0x2a3d66,0xa33a2e,0x2f2f33,0x4f6b3a],h>>>24),
  brim:police?POLICE_LOOK.brim:0x1c1c20,badge:POLICE_LOOK.badge,belt:POLICE_LOOK.belt,
  glasses:!police&&(h>>>27)%5===0,
  faceStyle:(h>>>4)%4,
  hoodUp:topStyle==='hoodie'&&(h>>>28)%3===0
 });
}
export function faceCell(look,state='open'){
 const col=(look?.faceStyle||0)+(look?.glasses?4:0),row=PEOPLE_FACE_STATES[state]??0;
 return row*PEOPLE_FACE_COLS+col;
}

// Rounded box: a 2x2x2 subdivided cube pulled toward a sphere. 48 triangles, reads
// as a soft low-poly head or mitten with flat shading.
export function createRoundedBoxGeometry(segments=2,round=.85){
 const geometry=new THREE.BoxGeometry(1,1,1,segments,segments,segments),position=geometry.attributes.position,v=new THREE.Vector3(),s=new THREE.Vector3();
 for(let i=0;i<position.count;i++){
  v.fromBufferAttribute(position,i);s.copy(v).normalize().multiplyScalar(.5);
  // Keep face centres at 0.5 so features sit flush; pull edges and corners in.
  v.lerp(s,round*Math.min(1,(v.length()-.5)/.366));
  position.setXYZ(i,v.x,v.y,v.z);
 }
 // Sphere-like normals hide the seams between box faces: soft heads, low-poly outline.
 const normal=geometry.attributes.normal,n=new THREE.Vector3(),f=new THREE.Vector3();
 for(let i=0;i<position.count;i++){v.fromBufferAttribute(position,i).normalize();f.fromBufferAttribute(normal,i);n.copy(v).lerp(f,.25).normalize();normal.setXYZ(i,n.x,n.y,n.z);}
 normal.needsUpdate=true;
 return geometry;
}
export const PEOPLE_ROUND_GEOMETRY=createRoundedBoxGeometry();
export const PEOPLE_BOX_GEOMETRY=new THREE.BoxGeometry(1,1,1);

let faceTexture=null;
function drawFace(ctx,x,y,size,style,glasses,state){
 const cx=x+size/2,eyeY=y+size*.47,gap=size*(style===2?.17:.15),eyeR=size*(style===1?.062:.056);
 ctx.fillStyle='#17130f';ctx.strokeStyle='#2a1d14';ctx.lineCap='round';
 // Brows: four temperaments.
 const browY=eyeY-size*(style===3?.12:.15),tilt=[0,.03,-.02,.05][style]*size;
 ctx.lineWidth=size*.032;
 for(const side of [-1,1]){
  ctx.beginPath();ctx.moveTo(cx+side*(gap+size*.07),browY+(style===3?-tilt:tilt));ctx.lineTo(cx+side*(gap-size*.06),browY+(style===3?tilt:-tilt)*.4);ctx.stroke();
 }
 for(const side of [-1,1]){
  const ex=cx+side*gap;
  if(state==='blink'){ctx.lineWidth=size*.03;ctx.beginPath();ctx.moveTo(ex-eyeR*1.2,eyeY);ctx.quadraticCurveTo(ex,eyeY+eyeR*.9,ex+eyeR*1.2,eyeY);ctx.stroke();}
  else{
   // Resting look is half-lidded (deadpan townie); style 1 is wide awake.
   const lid=style===1?-eyeR*1.3:-eyeR*.35;
   ctx.save();ctx.beginPath();ctx.rect(ex-eyeR*2,eyeY+lid,eyeR*4,eyeR*4);ctx.clip();
   ctx.beginPath();ctx.ellipse(ex,eyeY,eyeR,eyeR*1.25,0,0,Math.PI*2);ctx.fill();
   ctx.fillStyle='#ffffff';ctx.beginPath();ctx.arc(ex+eyeR*.35,eyeY+lid+eyeR*.4,eyeR*.28,0,Math.PI*2);ctx.fill();ctx.fillStyle='#17130f';ctx.restore();
   if(style!==1){ctx.lineWidth=size*.026;ctx.beginPath();ctx.moveTo(ex-eyeR*1.35,eyeY+lid);ctx.lineTo(ex+eyeR*1.35,eyeY+lid);ctx.stroke();}
  }
 }
 if(glasses){ctx.lineWidth=size*.022;ctx.strokeStyle='#22252a';for(const side of [-1,1]){ctx.beginPath();ctx.roundRect?ctx.roundRect(cx+side*gap-size*.085,eyeY-size*.07,size*.17,size*.14,size*.03):ctx.rect(cx+side*gap-size*.085,eyeY-size*.07,size*.17,size*.14);ctx.stroke();}ctx.beginPath();ctx.moveTo(cx-gap+size*.085,eyeY-size*.02);ctx.lineTo(cx+gap-size*.085,eyeY-size*.02);ctx.stroke();ctx.strokeStyle='#2a1d14';}
 // Nose hint and cheeks.
 ctx.fillStyle='rgba(90,40,30,.22)';ctx.beginPath();ctx.ellipse(cx,eyeY+size*.12,size*.03,size*.022,0,0,Math.PI*2);ctx.fill();
 ctx.fillStyle='rgba(200,80,70,.16)';for(const side of [-1,1]){ctx.beginPath();ctx.ellipse(cx+side*size*.24,eyeY+size*.14,size*.05,size*.03,0,0,Math.PI*2);ctx.fill();}
 const mouthY=y+size*.74;ctx.fillStyle='#5a2a26';ctx.strokeStyle='#4a2420';ctx.lineWidth=size*.03;
 if(state==='talk'){ctx.beginPath();ctx.ellipse(cx,mouthY,size*.06,size*.045,0,0,Math.PI*2);ctx.fill();}
 else if(style===0){ctx.beginPath();ctx.moveTo(cx-size*.07,mouthY-size*.01);ctx.quadraticCurveTo(cx,mouthY+size*.035,cx+size*.07,mouthY-size*.01);ctx.stroke();}
 else if(style===1){ctx.beginPath();ctx.moveTo(cx-size*.06,mouthY);ctx.lineTo(cx+size*.06,mouthY);ctx.stroke();}
 else if(style===2){ctx.beginPath();ctx.moveTo(cx-size*.06,mouthY+size*.01);ctx.quadraticCurveTo(cx+size*.02,mouthY-size*.02,cx+size*.07,mouthY);ctx.stroke();}
 else{ctx.beginPath();ctx.moveTo(cx-size*.06,mouthY+size*.015);ctx.quadraticCurveTo(cx,mouthY-size*.02,cx+size*.06,mouthY+size*.015);ctx.stroke();}
}
export function peopleFaceTexture(){
 if(faceTexture)return faceTexture;
 if(typeof document==='undefined'||typeof document.createElement!=='function')return null;
 const cell=96,canvas=document.createElement('canvas');canvas.width=cell*PEOPLE_FACE_COLS;canvas.height=cell*PEOPLE_FACE_ROWS;
 const ctx=canvas.getContext?.('2d');if(!ctx)return null;
 const states=['open','blink','talk'];
 for(let row=0;row<PEOPLE_FACE_ROWS;row++)for(let col=0;col<PEOPLE_FACE_COLS;col++){
  // Row 0 sits at the bottom of the texture (v=0) because canvas textures flip Y.
  drawFace(ctx,col*cell,(PEOPLE_FACE_ROWS-1-row)*cell,cell,col%4,col>=4,states[row]);
 }
 faceTexture=new THREE.CanvasTexture(canvas);faceTexture.colorSpace=THREE.SRGBColorSpace;faceTexture.anisotropy=2;faceTexture.generateMipmaps=true;faceTexture.minFilter=THREE.LinearMipmapLinearFilter;
 return faceTexture;
}
// One face material per batch: per-instance aFace picks the atlas cell in the vertex shader.
export function createFaceMaterial(){
 const map=peopleFaceTexture();
 const material=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.85,metalness:0,map,alphaTest:.5,transparent:false,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});
 material.onBeforeCompile=shader=>{
  shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nattribute float aFace;').replace('#include <uv_vertex>',`#include <uv_vertex>\n#ifdef USE_MAP\n vMapUv=(uv+vec2(mod(aFace,${PEOPLE_FACE_COLS}.0),floor(aFace/${PEOPLE_FACE_COLS}.0)))/vec2(${PEOPLE_FACE_COLS}.0,${PEOPLE_FACE_ROWS}.0);\n#endif`);
 };
 material.customProgramCacheKey=()=>'gummy-people-face-v126';
 return material;
}
export function createFaceGeometry(capacity){
 const geometry=new THREE.PlaneGeometry(1,1);
 const attribute=new THREE.InstancedBufferAttribute(new Float32Array(Math.max(1,capacity)),1);attribute.setUsage(THREE.DynamicDrawUsage);
 geometry.setAttribute('aFace',attribute);
 return geometry;
}
export function createPeopleMaterial(flat=true){return new THREE.MeshStandardMaterial({color:0xffffff,roughness:.88,metalness:0,flatShading:flat});}

// ---- Rigid-part rig shared by the street crowd (procedural joints) and the
// animated cast (joints read from bones without their stretch). Units: metres.
// Joint frames are upright: +y up the body, +z forward; limbs hang along -y.
const P=(name,mesh,joint,x,y,z,w,h,d,slot,when='always',far=false)=>Object.freeze({name,mesh,joint,x,y,z,w,h,d,slot,when,far});
export const PERSON_PARTS=Object.freeze([
 P('pelvis','box','hips',0,.04,0,.34,.17,.22,'pants','always',true),
 P('torso','box','chest',0,.14,0,.40,.48,.25,'top','always',true),
 P('front','box','chest',0,.13,.127,.12,.44,.012,'inner','open'),
 P('pocket','box','chest',0,.02,.127,.24,.10,.012,'hood','hoodie'),
 P('vest','box','chest',0,.17,0,.42,.34,.27,'vest','police'),
 P('badge','box','chest',.1,.27,.137,.05,.06,.012,'badge','police'),
 P('belt','box','hips',0,.14,0,.35,.05,.23,'belt','police'),
 P('neck','box','head',0,.03,0,.09,.09,.09,'skin'),
 P('upperL','box','armL',0,-.16,0,.10,.34,.11,'top','always',true),
 P('upperR','box','armR',0,-.16,0,.10,.34,.11,'top','always',true),
 P('foreL','box','foreL',0,-.12,0,.09,.26,.10,'sleeve','always',true),
 P('foreR','box','foreR',0,-.12,0,.09,.26,.10,'sleeve','always',true),
 P('thighL','box','thighL',0,-.18,0,.13,.38,.14,'pants','always',true),
 P('thighR','box','thighR',0,-.18,0,.13,.38,.14,'pants','always',true),
 P('shinL','box','shinL',0,-.17,0,.115,.36,.125,'pants','always',true),
 P('shinR','box','shinR',0,-.17,0,.115,.36,.125,'pants','always',true),
 P('shoeL','box','shinL',0,-.37,.04,.12,.08,.24,'shoes','always',true),
 P('shoeR','box','shinR',0,-.37,.04,.12,.08,.24,'shoes','always',true),
 P('brim','box','head',0,.285,.17,.26,.02,.12,'brim','capped'),
 P('band','box','head',0,.29,0,.296,.035,.306,'band','police'),
 P('head','round','head',0,.18,0,.27,.30,.28,'skin','always',true),
 P('hairTop','round','head',0,.30,-.012,.29,.10,.30,'hair','hairTop',true),
 P('hairBuzz','round','head',0,.29,-.006,.276,.065,.286,'hair','buzz',true),
 P('hairBack','round','head',0,.17,-.10,.285,.26,.10,'hair','long',true),
 P('nape','round','head',0,.24,-.1,.28,.13,.09,'hair','short'),
 P('bun','round','head',0,.34,-.08,.12,.10,.11,'hair','bun'),
 P('cap','round','head',0,.315,0,.29,.09,.30,'cap','capped',true),
 P('hoodUp','round','head',0,.2,-.035,.32,.36,.31,'hood','hoodUp',true),
 P('hoodDown','round','chest',0,.41,-.12,.30,.12,.12,'hood','hoodDown'),
 P('handL','round','foreL',0,-.3,0,.09,.10,.08,'skin'),
 P('handR','round','foreR',0,-.3,0,.09,.10,.08,'skin'),
 P('face','face','head',0,.175,.143,.25,.25,1,'face')
]);
export const PERSON_MESH_PARTS=Object.freeze({
 box:Object.freeze(PERSON_PARTS.filter(p=>p.mesh==='box')),
 round:Object.freeze(PERSON_PARTS.filter(p=>p.mesh==='round')),
 face:Object.freeze(PERSON_PARTS.filter(p=>p.mesh==='face'))
});
export const PERSON_SLOT=Object.freeze(Object.fromEntries(Object.values(PERSON_MESH_PARTS).flatMap(list=>list.map((part,index)=>[part.name,index]))));
export function personPartEnabled(part,look,detail=true){
 if(!detail&&!part.far)return false;
 const style=look?.hairStyle,top=look?.topStyle,police=look?.role==='police';
 switch(part.when){
  case 'always':return true;
  case 'open':return top==='jacket'||top==='flannel'||top==='puffer'||police;
  case 'hoodie':return top==='hoodie';
  case 'police':return police;
  case 'capped':return police||style==='cap';
  case 'hairTop':return !look?.hoodUp&&(style==='short'||style==='long'||style==='bun');
  case 'buzz':return !look?.hoodUp&&style==='buzz';
  case 'long':return !look?.hoodUp&&style==='long';
  case 'short':return !look?.hoodUp&&(style==='short'||style==='cap'||police);
  case 'bun':return !look?.hoodUp&&style==='bun';
  case 'hoodUp':return !!look?.hoodUp;
  case 'hoodDown':return top==='hoodie'&&!look?.hoodUp;
  default:return false;
 }
}
export function personSlotColor(look,slot){
 switch(slot){
  case 'vest':return 0x5d636b;case 'band':return 0xe0bf3a;
  case 'sleeve':return look.sleeve;default:return look[slot]??look.top;
 }
}
// Pose → joint matrices for a free-standing person. root already holds position and yaw.
const m1=new THREE.Matrix4(),m2=new THREE.Matrix4(),rx=new THREE.Matrix4(),rz=new THREE.Matrix4();
function jointAt(out,parent,x,y,z,angleX=0,angleZ=0){
 m1.makeTranslation(x,y,z);rx.makeRotationX(angleX);rz.makeRotationZ(angleZ);
 return out.multiplyMatrices(parent,m1).multiply(rx).multiply(rz);
}
export function createJointSet(){return {hips:new THREE.Matrix4(),chest:new THREE.Matrix4(),head:new THREE.Matrix4(),armL:new THREE.Matrix4(),armR:new THREE.Matrix4(),foreL:new THREE.Matrix4(),foreR:new THREE.Matrix4(),thighL:new THREE.Matrix4(),thighR:new THREE.Matrix4(),shinL:new THREE.Matrix4(),shinR:new THREE.Matrix4()};}
export function proceduralJoints(joints,root,pose={}){
 const swing=finite(pose.swing),sit=!!pose.sit,bob=finite(pose.bob),raise=finite(pose.raise),sway=finite(pose.sway),crouch=sit?0:finite(pose.crouch);
 const hipY=sit?.50:.80+bob-crouch;
 jointAt(joints.hips,root,0,hipY,0,0,sway*.3);
 jointAt(joints.chest,joints.hips,0,.17,0,sit?-.05:crouch*.9,sway);
 jointAt(joints.head,joints.chest,0,.41,0,finite(pose.nod),0);
 if(pose.turn)joints.head.multiply(ry.makeRotationY(finite(pose.turn)));
 for(const [side,sign] of [['L',-1],['R',1]]){
  const arm=sit?-.35:swing*-sign*.42+(side==='R'?raise:0);
  jointAt(joints['arm'+side],joints.chest,sign*.235,.36,0,arm,sign*.07);
  jointAt(joints['fore'+side],joints['arm'+side],0,-.32,0,sit?-.5:(side==='R'&&raise?-.6:-.15-Math.max(0,swing*sign)*.2),0);
  const thigh=sit?-1.5:swing*sign*.48-crouch*3.2;
  jointAt(joints['thigh'+side],joints.hips,sign*.09,0,0,thigh,0);
  jointAt(joints['shin'+side],joints['thigh'+side],0,-.36,0,sit?1.5:Math.max(0,-swing*sign)*.6+crouch*6,0);
 }
 poseArms(joints,pose);
 return joints;
}
// Reaction arms (wave, point, cower, phone): {x,z,fore} radians at the shoulder and elbow.
// Rebuilds the arm from the chest joint, so it also works on bone-driven people.
export function poseArms(joints,pose={}){
 for(const [side,sign] of [['L',-1],['R',1]]){
  const arm=pose['arm'+side];if(!arm||!joints.chest)continue;
  jointAt(joints['arm'+side],joints.chest,sign*.235,.36,0,finite(arm.x),sign*Math.abs(finite(arm.z))+sign*.07);
  jointAt(joints['fore'+side],joints['arm'+side],0,-.32,0,finite(arm.fore),0);
 }
 return joints;
}
const ry=new THREE.Matrix4();
const partMatrix=new THREE.Matrix4(),partLocal=new THREE.Matrix4(),ZERO=new THREE.Matrix4().makeScale(0,0,0);
// Writes one person into three instanced meshes at slot `person`. Disabled parts collapse to zero.
export function writePerson(meshes,person,joints,look,{detail=true,face='open',active=true,tint=null}={}){
 for(const kind of ['box','round','face']){
  const mesh=meshes[kind];if(!mesh)continue;
  const list=PERSON_MESH_PARTS[kind],base=person*list.length;
  for(let i=0;i<list.length;i++){
   const part=list[i],on=active&&personPartEnabled(part,look,detail)&&!!joints[part.joint];
   if(on){partLocal.makeTranslation(part.x,part.y,part.z);m2.makeScale(part.w,part.h,part.d);partLocal.multiply(m2);partMatrix.multiplyMatrices(joints[part.joint],partLocal);mesh.setMatrixAt(base+i,partMatrix);}
   else mesh.setMatrixAt(base+i,ZERO);
   if(kind==='face'){const attr=mesh.geometry.getAttribute('aFace');if(attr)attr.setX(base+i,faceCell(look,face));}
   else{scratchColor.setHex(look?personSlotColor(look,part.slot):0xffffff);if(tint&&tint.amount>0)scratchColor.lerp(tintColor.setHex(tint.color),Math.min(1,tint.amount));mesh.setColorAt(base+i,scratchColor);}
  }
 }
}
const scratchColor=new THREE.Color(),tintColor=new THREE.Color();
export function createPeopleMeshes(three,scene,capacity,name){
 const material=createPeopleMaterial();
 const box=new three.InstancedMesh(PEOPLE_BOX_GEOMETRY,material,capacity*PERSON_MESH_PARTS.box.length);
 const round=new three.InstancedMesh(PEOPLE_ROUND_GEOMETRY,createPeopleMaterial(false),capacity*PERSON_MESH_PARTS.round.length);
 const face=new three.InstancedMesh(createFaceGeometry(capacity*PERSON_MESH_PARTS.face.length),createFaceMaterial(),capacity*PERSON_MESH_PARTS.face.length);
 box.name=name;round.name=name+' heads';face.name=name+' faces';
 for(const mesh of [box,round,face]){mesh.frustumCulled=false;mesh.castShadow=false;mesh.receiveShadow=true;mesh.instanceMatrix.setUsage(three.DynamicDrawUsage);scene.add(mesh);}
 face.receiveShadow=false;
 // Allocate instanceColor up front so the first frame is never black.
 for(const mesh of [box,round]){for(let i=0;i<mesh.count;i++)mesh.setColorAt(i,scratchColor.setHex(0xffffff));}
 return {box,round,face,material};
}
export function flushPeopleMeshes(meshes,visible=true){
 for(const mesh of [meshes.box,meshes.round,meshes.face]){
  mesh.visible=visible;mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;
  const attr=mesh.geometry.getAttribute('aFace');if(attr)attr.needsUpdate=true;
 }
}
