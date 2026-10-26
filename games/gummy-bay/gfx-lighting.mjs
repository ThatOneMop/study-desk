// v150 Graphics pass, step 1: lighting and colour.
// gfxLightGrade() is a pure layer applied after world-lighting + readabilityGrade:
//  - golden hour pushes the sun warmer and a little stronger, the sky bounce goes peach;
//  - night gets a cool moon key (so shapes keep a direction) and a lifted blue sky bounce;
//  - by day the flat ambient fill is trimmed and the hemisphere carries more sky/ground
//    contrast, so ground and walls read with direction instead of one flat tone;
//  - real shadows are softened (shadow intensity) on Medium/High.
// createGroundOcclusion() is the cheap Low fallback (and a subtle extra on Med/High):
// one merged, unlit mesh of gradient skirts around building footprints. One draw call.
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,Number.isFinite(v)?v:a));
const lerp=(a,b,t)=>a+(b-a)*t;
export function gfxLerpHex(a,b,t){let o=0;for(const s of [16,8,0])o|=Math.round(lerp((a>>s)&255,(b>>s)&255,clamp(t)))<<s;return o;}
export const isLowQuality=q=>q==='performance'||q==='low';

export function gfxLightGrade(plan={},quality='balanced'){
 const night=clamp(plan.night),warmth=clamp(plan.warmth)*(1-night),day=clamp(plan.daylight??1)*(1-night),low=isLowQuality(quality);
 return Object.freeze({
  night,warmth,
  sunScale:1+warmth*.24,
  sunColorMix:warmth*.38,sunWarm:0xff9a58,
  moon:night*.42,moonColor:0xb4bde0,
  hemiSkyMix:Math.max(night*.4,warmth*.3),hemiSkyTarget:night>warmth?0x5c6488:0xf2bc92,
  hemiGroundMix:(1-night)*.3,hemiGroundTarget:0x8a7254,
  hemiScale:1+day*.08+night*.06,
  fillScale:lerp(1,low?.66:.74,day)+night*.06,fillWarm:night*.45+warmth*.3,fillWarmColor:night>warmth?0x9c8c84:0xffc8a0,
  exposureScale:1+night*(low?.12:.24)+warmth*.03,
  shadowIntensity:low?0:lerp(.84,.62,night),
  occlusion:(low?.62:.4)*(1-night*.35)
 });
}

// Footprints: [{x,z,w,d}] axis-aligned. Pure geometry builder (arrays), so it is testable.
export function occlusionSkirts(footprints=[],{width=1.9,max=600,height=()=>0,lift=.19}={}){
 const pos=[],col=[],idx=[];let n=0;
 const v=(x,z,a)=>{pos.push(x,height(x,z)+lift,z);col.push(0,0,0,a);return n++;};
 for(const f of footprints.slice(0,max)){
  if(!f||![f.x,f.z,f.w,f.d].every(Number.isFinite)||f.w<3||f.d<3)continue;
  const x0=f.x-f.w/2,x1=f.x+f.w/2,z0=f.z-f.d/2,z1=f.z+f.d/2,W=width;
  const quad=(a,b,c,d)=>idx.push(a,b,c,a,c,d);
  // inner ring corners (alpha 1) and outer ring (alpha 0)
  const i00=v(x0,z0,1),i10=v(x1,z0,1),i11=v(x1,z1,1),i01=v(x0,z1,1);
  const s0a=v(x0,z0-W,0),s0b=v(x1,z0-W,0),e0a=v(x1+W,z0,0),e0b=v(x1+W,z1,0),n0a=v(x1,z1+W,0),n0b=v(x0,z1+W,0),w0a=v(x0-W,z1,0),w0b=v(x0-W,z0,0);
  const c00=v(x0-W,z0-W,0),c10=v(x1+W,z0-W,0),c11=v(x1+W,z1+W,0),c01=v(x0-W,z1+W,0);
  quad(i00,s0a,s0b,i10);quad(i10,e0a,e0b,i11);quad(i11,n0a,n0b,i01);quad(i01,w0a,w0b,i00);
  quad(i00,w0b,c00,s0a);quad(i10,s0b,c10,e0a);quad(i11,e0b,c11,n0a);quad(i01,n0b,c01,w0a);
 }
 return {pos,col,idx,verts:n};
}

export function createGroundOcclusion(THREE,scene,footprints,{height=()=>0,width=1.9}={}){
 const s=occlusionSkirts(footprints,{height,width});if(!s.verts)return null;
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(s.pos,3));g.setAttribute('color',new THREE.Float32BufferAttribute(s.col,4));g.setIndex(s.idx);g.computeBoundingSphere();
 const mat=new THREE.MeshBasicMaterial({vertexColors:true,transparent:true,opacity:.4,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2,side:THREE.DoubleSide});
 // vertex colour rgb is black; keep the tint by ignoring vertex rgb: colour * (0) would be black, which is what we want.
 const mesh=new THREE.Mesh(g,mat);mesh.name='Ground occlusion v150';mesh.renderOrder=1;mesh.userData.noBatch=true;scene.add(mesh);
 return {mesh,verts:s.verts,set(op){mat.opacity=clamp(op);mesh.visible=op>.01;}};
}
