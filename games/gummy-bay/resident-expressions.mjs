import * as THREE from './vendor/three.module.min.js';

export const RESIDENT_EXPRESSION_COLLIDERS=Object.freeze([]);
const BROW_GEOMETRY=new THREE.BoxGeometry(.22,.035,.035);
const GLINT_GEOMETRY=new THREE.SphereGeometry(.022,6,4);
const LID_GEOMETRY=new THREE.BoxGeometry(.19,.18,.026);
function faceFocusGeometry(){
 const positions=[];
 const addFacet=(x,y,z,rx,ry,rz)=>{const points=[[x-rx,y,z],[x+rx,y,z],[x,y-ry,z],[x,y+ry,z],[x,y,z-rz],[x,y,z+rz]],faces=[[0,2,4],[2,1,4],[1,3,4],[3,0,4],[2,0,5],[1,2,5],[3,1,5],[0,3,5]];for(const face of faces)for(const index of face)positions.push(...points[index]);};
 addFacet(-.24,.32,.284,.06,.025,.012);addFacet(.24,.32,.284,.06,.025,.012);addFacet(0,.4,.405,.025,.04,.012);
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.computeVertexNormals();geometry.computeBoundingSphere();return geometry;
}
const FACE_FOCUS_GEOMETRY=faceFocusGeometry();
export const RESIDENT_FACE_FOCUS_BOUNDS=Object.freeze({minX:-.30,maxX:.30,minY:.295,maxY:.44,minZ:.272,maxZ:.417});
const browMaterials=new Map();
const faceMaterials=new Map();
const glintMaterial=new THREE.MeshStandardMaterial({color:0xf7efd4,roughness:.35,metalness:0,emissive:0x3b3a31,emissiveIntensity:.08});
const finite=(value,fallback=0)=>Number.isFinite(value)?value:fallback;
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));

export function residentExpressionState({now=0,id=0,talking=false,working=false,moving=false,active=true,distance=0}={}){
 now=finite(now);id=finite(id);distance=Math.max(0,finite(distance));const cycle=((now+id*.61)%5.2+5.2)%5.2;
 const blink=cycle>4.95?Math.sin((cycle-4.95)/.25*Math.PI):0,talkPulse=talking?(Math.sin(now*8.5+id*1.3)+1)/2:0;
 const personality=Math.abs(Math.trunc(id))%5,restingOpen=[.78,.9,.70,.86,.82][personality];
 const state={
  active:!!active,
  blink:clamp(blink,0,1),
  eyeOpen:clamp((talking?Math.min(1,restingOpen+.12):restingOpen)*(1-blink),0,1),
  browLift:clamp(talking?.015+talkPulse*.035:working?-.008:[-.008,.005,-.012,0,-.004][personality],-.02,.055),
  browTilt:clamp(talking?(talkPulse-.5)*.24:working?-.08:0,-.16,.16),
  gazeX:moving?0:clamp(Math.sin(now*.72+id*1.7)*.018,-.018,.018),
  gazeY:moving?0:clamp((talking?talkPulse-.5:Math.sin(now*.43+id))*.012,-.012,.012),
  focus:clamp((distance-8)/92,0,1)
 };
 return Object.freeze(state);
}

export function applyResidentBlinkMorph(body,state){
 if(!body||typeof body.traverse!=='function')return 0;
 const blink=clamp(finite(state?.blink),0,1);let updated=0;
 body.traverse(object=>{
  const index=object.morphTargetDictionary?.Blink;
  if(!Number.isInteger(index)||!Array.isArray(object.morphTargetInfluences)||index>=object.morphTargetInfluences.length)return;
  object.morphTargetInfluences[index]=blink;updated++;
 });
 return updated;
}

function browMaterial(color){
 color=Number.isFinite(color)?color:0x4c4034;
 if(!browMaterials.has(color))browMaterials.set(color,new THREE.MeshStandardMaterial({color,roughness:.92,metalness:0,flatShading:true}));
 return browMaterials.get(color);
}
function faceMaterial(color){
 color=Number.isFinite(color)?color:0xc58f6c;
 if(!faceMaterials.has(color)){const tone=new THREE.Color(color).lerp(new THREE.Color(0xf1c49d),.22);faceMaterials.set(color,new THREE.MeshStandardMaterial({color:tone,roughness:.78,metalness:0,emissive:tone.clone().multiplyScalar(.16),emissiveIntensity:.05,flatShading:true}));}
 return faceMaterials.get(color);
}
export function createResidentExpressionRig({head,hairColor,skinColor}={}){
 if(!head||typeof head.add!=='function')throw new TypeError('A resident expression rig needs an animated head.');
 const group=new THREE.Group();group.name='FaceExpressionAccents';
 const material=browMaterial(hairColor),skinMaterial=faceMaterial(skinColor),leftBrow=new THREE.Mesh(BROW_GEOMETRY,material),rightBrow=new THREE.Mesh(BROW_GEOMETRY,material),leftGlint=new THREE.Mesh(GLINT_GEOMETRY,glintMaterial),rightGlint=new THREE.Mesh(GLINT_GEOMETRY,glintMaterial),leftLid=new THREE.Mesh(LID_GEOMETRY,skinMaterial),rightLid=new THREE.Mesh(LID_GEOMETRY,skinMaterial),faceFocus=new THREE.Mesh(FACE_FOCUS_GEOMETRY,skinMaterial);
 leftBrow.name='ExpressionBrowLeft';rightBrow.name='ExpressionBrowRight';leftGlint.name='ExpressionEyeLeft';rightGlint.name='ExpressionEyeRight';
 leftLid.name='ExpressionLidLeft';rightLid.name='ExpressionLidRight';
 faceFocus.name='ExpressionFaceFocus';
 for(const mesh of [leftBrow,rightBrow,leftGlint,rightGlint,leftLid,rightLid,faceFocus]){mesh.castShadow=false;mesh.receiveShadow=false;mesh.frustumCulled=false;group.add(mesh);}
 head.add(group);
 const rig={group,leftBrow,rightBrow,leftGlint,rightGlint,leftLid,rightLid,faceFocus};
 updateResidentExpressionRig(rig,residentExpressionState({active:false}));
 return Object.freeze(rig);
}
export function updateResidentExpressionRig(rig,state){
 if(!rig?.group||!state)return false;
 rig.group.visible=!!state.active;
 const lift=finite(state.browLift),tilt=finite(state.browTilt),gazeX=clamp(finite(state.gazeX),-.018,.018),gazeY=clamp(finite(state.gazeY),-.012,.012),blink=clamp(finite(state.blink),0,1),eyeOpen=clamp(Number.isFinite(state.eyeOpen)?state.eyeOpen:1-blink,0,1),focus=clamp(finite(state.focus),0,1),detailScale=1+focus*.24;
 rig.leftBrow.position.set(-.14,.58+lift,.322);rig.rightBrow.position.set(.14,.58+lift,.322);
 rig.leftBrow.rotation.z=.1+tilt;rig.rightBrow.rotation.z=-.1-tilt;
 rig.leftGlint.position.set(-.14+gazeX,.46+gazeY,.356);rig.rightGlint.position.set(.14+gazeX,.46+gazeY,.356);
 const closure=1-eyeOpen,lidY=.55-.09*closure;rig.leftLid.position.set(-.14,lidY,.36);rig.rightLid.position.set(.14,lidY,.36);
 rig.leftBrow.scale.set(1+focus*.12,1+focus*.2,1);rig.rightBrow.scale.copy(rig.leftBrow.scale);
 const glintVisible=rig.group.visible&&eyeOpen>.08;rig.leftGlint.visible=glintVisible;rig.rightGlint.visible=glintVisible;
 const lidVisible=rig.group.visible&&closure>.02;rig.leftLid.visible=lidVisible;rig.rightLid.visible=lidVisible;rig.leftLid.scale.set(.9+closure*.1,Math.max(.02,closure),1);rig.rightLid.scale.copy(rig.leftLid.scale);
 rig.leftGlint.scale.set((.82+eyeOpen*.18)*detailScale,Math.max(.02,eyeOpen)*detailScale,detailScale);rig.rightGlint.scale.copy(rig.leftGlint.scale);rig.faceFocus.scale.setScalar(1+focus*.1);rig.faceFocus.visible=false;rig.leftBrow.visible=false;rig.rightBrow.visible=false;
 return rig.group.visible;
}
export function residentExpressionResources(){
 return Object.freeze({browGeometry:BROW_GEOMETRY,glintGeometry:GLINT_GEOMETRY,lidGeometry:LID_GEOMETRY,faceFocusGeometry:FACE_FOCUS_GEOMETRY,glintMaterial,browMaterialCount:browMaterials.size,faceMaterialCount:faceMaterials.size});
}
