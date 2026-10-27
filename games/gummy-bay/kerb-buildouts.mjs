// v164: narrower streets near spawn. Tom: "long wide roads". The 12 m asphalt lives in
// the Blender town GLB and the vehicle zones, so instead of re-laying it we build the
// kerb out over the outer 1.75 m of each side (asphalt reads 8.6 m) and fill the new
// edge with dodgy street clutter: bollards, cracked planters, bins and leaning poles.
// One instanced, untextured batch (one draw call, no shadow casting).
import * as THREE from './vendor/three.module.min.js';
import {KERB_INNER,KERB_OUTER,BUILD_OUT_SEGMENTS,buildOutRects} from './road-zones.mjs?v=166';
export {KERB_INNER,KERB_OUTER,BUILD_OUT_SEGMENTS,buildOutRects};

const rng=seed=>{let a=seed>>>0||1;return()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};};
export const CLUTTER=Object.freeze(['bollard','planter','bin','pole','gap']);
export function planBuildOuts({segments=BUILD_OUT_SEGMENTS,seed=164,avoid=[]}={}){
 const r=rng(seed),boxes=[],colliders=[],items=[];
 const box=(x,y,z,w,h,d,color,ry=0)=>boxes.push({x,y,z,w,h,d,color,ry});
 for(const s of segments)for(const side of [-1,1]){
  const len=s.to-s.from,c=(s.from+s.to)/2,outer=s.outer||KERB_OUTER,mid=(KERB_INNER+outer)/2,width=outer-KERB_INNER;
  const at=(along,off)=>s.axis==='x'?{x:along,z:s.line+side*off}:{x:s.line+side*off,z:along};
  // slab (slightly patchy: three tones) and the new kerb lip
  for(let a=s.from;a<s.to-.01;a+=6){const l=Math.min(6,s.to-a),p=at(a+l/2,mid),tone=[0xa7a291,0x9c978a,0xb0aa98][Math.floor(r()*3)];
   box(p.x,.08,p.z,s.axis==='x'?l:width,.16,s.axis==='x'?width:l,tone);}
  const k=at(c,KERB_INNER+.11);box(k.x,.095,k.z,s.axis==='x'?len:.22,.19,s.axis==='x'?.22:len,0x8e8a7e);
  // grimy gutter stain along the new edge
  const gt=at(c,KERB_INNER-.18);box(gt.x,.012,gt.z,s.axis==='x'?len:.36,.01,s.axis==='x'?.36:len,0x56544d);
  for(let a=s.from+2+r()*3;a<s.to-2;a+=4.5+r()*4.5){
   const off=KERB_INNER+.55+r()*.5,p=at(a,off);
   if(avoid.some(q=>Math.hypot(q.x-p.x,q.z-p.z)<3.2))continue;
   const kind=CLUTTER[Math.floor(r()*CLUTTER.length)];items.push({kind,x:p.x,z:p.z});
   if(kind==='bollard'){for(const o of [-.7,0,.7]){const q=s.axis==='x'?{x:p.x+o,z:p.z}:{x:p.x,z:p.z+o};box(q.x,.55,q.z,.16,.84,.16,0x2c2f33);box(q.x,.84,q.z,.17,.08,.17,0xc9a227);}
    colliders.push(s.axis==='x'?{x:p.x,z:p.z,w:1.6,d:.3}:{x:p.x,z:p.z,w:.3,d:1.6});}
   else if(kind==='planter'){const w=1.4,d=.8,ry=s.axis==='x'?0:Math.PI/2;box(p.x,.4,p.z,w,.55,d,0x8a8579,ry);box(p.x,.7,p.z,w-.16,.08,d-.16,0x4a3b2a,ry);
    box(p.x+(r()-.5)*.6,.9,p.z+(r()-.5)*.3,.35,.35,.35,r()<.5?0x5d6b3a:0x7a6a3c);colliders.push(s.axis==='x'?{x:p.x,z:p.z,w,d}:{x:p.x,z:p.z,w:d,d:w});}
   else if(kind==='bin'){box(p.x,.6,p.z,.6,.95,.6,r()<.5?0x2f5a3a:0x50565c,r());box(p.x,1.1,p.z,.66,.06,.66,0x222426);colliders.push({x:p.x,z:p.z,w:.62,d:.62});}
   else if(kind==='pole'){const lean=(r()-.5)*.12;box(p.x,1.4,p.z,.1,2.6,.1,0x6a6d70,lean);box(p.x,2.55,p.z,s.axis==='x'?.5:.04,.5,s.axis==='x'?.04:.5,r()<.5?0xb23a2a:0x2a5aa0);colliders.push({x:p.x,z:p.z,w:.25,d:.25});}
  }
 }
 return {boxes,colliders,items,rects:buildOutRects(segments)};
}
export function createKerbBuildOuts({scene,segments=BUILD_OUT_SEGMENTS,avoid=[]}={}){
 const plan=planBuildOuts({segments,avoid});
 const geometry=new THREE.BoxGeometry(1,1,1),material=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.92,metalness:0,polygonOffset:true,polygonOffsetFactor:-1});
 const mesh=new THREE.InstancedMesh(geometry,material,plan.boxes.length),o=new THREE.Object3D(),c=new THREE.Color();
 plan.boxes.forEach((b,i)=>{o.position.set(b.x,b.y,b.z);o.rotation.set(0,b.ry||0,0);o.scale.set(b.w,b.h,b.d);o.updateMatrix();mesh.setMatrixAt(i,o.matrix);mesh.setColorAt(i,c.setHex(b.color));});
 mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;
 mesh.name='Kerb build-outs v164';mesh.castShadow=false;mesh.receiveShadow=true;mesh.computeBoundingSphere?.();scene?.add(mesh);
 return {mesh,colliders:plan.colliders,items:plan.items,rects:plan.rects,boxes:plan.boxes.length};
}
