// Gummy Bay cutscene stage (v149): draws the acting cast and the box-built props from
// cine-cast.mjs. Cost is fixed and small: three instanced draws for every actor (the
// shared people kit) plus three for every prop (solid boxes, soft rounded boxes and
// unlit glow boxes), whatever the scene. Hidden outside cutscenes.
import {personLook,namedLook,NAMED_LOOKS,proceduralJoints,createJointSet,writePerson,createPeopleMeshes,flushPeopleMeshes,createRoundedBoxGeometry} from './people-kit.mjs?v=154';
import {PROP_KINDS,CINE_MOODS} from './cine-cast.mjs?v=149';

export function cineLook(spec,mood='friendly'){
 const raw=typeof spec==='string'?spec:spec?.key||'folk:1';
 const [kind,arg]=raw.includes(':')?raw.split(':'):[raw,''];
 const n=Number(arg)||0;let look;
 if(NAMED_LOOKS[kind])look=namedLook(kind,personLook(n||kind.length*7,NAMED_LOOKS[kind].role||'townsfolk'),n);
 else if(kind==='police')look=personLook(n,'police');
 else if(kind==='kid')look={...personLook(n),height:.64,build:.92,beard:'none'};
 else if(kind==='player')look={...personLook(57),topStyle:'hoodie',top:0x2f6f6a,hood:0x2a6460,hat:'cap',cap:0xe8555d,brim:0xc94048,beard:'none',height:1};
 else if(kind==='crew')look={...personLook(n,'dealer'),top:0xd9d23a,hood:0xc9c22e,cap:0x6fb52c,brim:0x5a9a22,band:0x5a9a22};
 else look=personLook(n);
 const face=CINE_MOODS.indexOf(mood);
 const over=typeof spec==='object'&&spec?spec:{};
 return Object.freeze({...look,...(face>=0?{faceStyle:face}:{}),...(over.height?{height:over.height}:{})});
}

export function createCineStage({THREE,scene,capacity=14,propCapacity=320}={}){
 if(!THREE||!scene?.add)throw new TypeError('cine stage needs THREE and a scene');
 const meshes=createPeopleMeshes(THREE,scene,capacity,'Cutscene cast');
 const joints=createJointSet(),looks=new Map();
 const root=new THREE.Matrix4(),pos=new THREE.Vector3(),quat=new THREE.Quaternion(),up=new THREE.Vector3(0,1,0),scl=new THREE.Vector3();
 const solid=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshStandardMaterial({color:0xffffff,roughness:.72,metalness:0}),propCapacity);
 const soft=new THREE.InstancedMesh(createRoundedBoxGeometry(3,.9),new THREE.MeshStandardMaterial({color:0xffffff,roughness:.32,metalness:0,emissive:0x220406,emissiveIntensity:.35}),Math.max(32,propCapacity>>2));
 const glow=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshBasicMaterial({color:0xffffff,toneMapped:false}),24);
 const propMeshes={s:solid,r:soft,g:glow};
 solid.name='Cutscene props';soft.name='Cutscene props soft';glow.name='Cutscene props glow';
 const white=new THREE.Color(0xffffff);
 for(const m of Object.values(propMeshes)){m.frustumCulled=false;m.castShadow=m!==glow;m.receiveShadow=m!==glow;m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);for(let i=0;i<m.count;i++)m.setColorAt(i,white);m.count=0;m.visible=false;scene.add(m);}
 const M=new THREE.Matrix4(),L=new THREE.Matrix4(),P=new THREE.Matrix4(),E=new THREE.Euler(),Q=new THREE.Quaternion(),V=new THREE.Vector3(),S=new THREE.Vector3(),col=new THREE.Color();
 const caps={s:propCapacity,r:soft.instanceMatrix.count,g:24};
 function lookOf(spec,mood){const key=(typeof spec==='string'?spec:JSON.stringify(spec))+'|'+mood;let l=looks.get(key);if(!l){l=cineLook(spec,mood);looks.set(key,l);}return l;}
 function writeProps(props,floor){
  const used={s:0,r:0,g:0};
  for(const p of props||[]){
   const parts=PROP_KINDS[p.kind];if(!parts)continue;
   const ground=floor(p.x,p.z)||0;
   P.compose(V.set(p.x,ground+(p.y||0)+(p.bounce||0),p.z),Q.setFromAxisAngle(up,p.yaw||0),S.setScalar(p.scale||1));
   const m=p.melt||0;
   for(const part of parts){
    const kind=part.m;if(used[kind]>=caps[kind])continue;
    if(part.blink!==undefined&&part.blink!==p.blink){continue;}
    let sx=part.s[0],sy=part.s[1],sz=part.s[2],px=part.p[0],py=part.p[1],pz=part.p[2];
    if(part.grow){if(m<.02)continue;sx*=m;sz*=m;}
    else if(m>0&&py>.66){const k=1-.62*m;py=.66+(py-.66)*k;sy*=k;sx*=1+.32*m;sz*=1+.32*m;px*=1+.35*m;pz+=m*.4;}
    E.set(part.rx||0,part.ry||0,part.rz||0);L.compose(V.set(px,py,pz),Q.setFromEuler(E),S.set(sx,sy,sz));
    M.multiplyMatrices(P,L);const mesh=propMeshes[kind],i=used[kind]++;
    mesh.setMatrixAt(i,M);mesh.setColorAt(i,col.setHex(part.c));
   }
  }
  for(const k of Object.keys(propMeshes)){const mesh=propMeshes[k];mesh.count=used[k];mesh.visible=used[k]>0;mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;}
  return used;
 }
 function update({actors=[],props=[],floor=()=>0}={}){
  let n=0;
  for(const a of actors){
   if(n>=capacity)break;
   const look=lookOf(a.look,a.mood),ground=floor(a.x,a.z)||0;
   root.compose(pos.set(a.x,ground+(a.y||0),a.z),quat.setFromAxisAngle(up,a.yaw||0),scl.setScalar((look.height||1)*(a.scale||1)));
   proceduralJoints(joints,root,a.pose||{});
   writePerson(meshes,n,joints,look,{detail:true,face:a.face||'open',active:true});
   n++;
  }
  for(let i=n;i<capacity;i++)writePerson(meshes,i,joints,null,{active:false});
  flushPeopleMeshes(meshes,n>0,n);
  const used=writeProps(props,floor);
  return {actors:n,props:used};
 }
 function hide(){flushPeopleMeshes(meshes,false,0);for(const m of Object.values(propMeshes)){m.count=0;m.visible=false;}}
 return {meshes,propMeshes,update,hide,capacity};
}
