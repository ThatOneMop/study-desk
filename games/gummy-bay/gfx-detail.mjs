// v152 Graphics pass, step 3: detail.
// Gutters, downpipes, AC units, roof vents, window sills, shop signage boards, overhead
// wires and alley clutter are placed from building footprints (+ measured roof height)
// and baked into ONE vertex-coloured mesh. Wear decals (oil, cracks, patches, grime)
// are ONE transparent mesh on a small procedural atlas. So the whole pass costs at most
// two draw calls, whatever the count of parts.
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function rng(seed){let r=seed>>>0;return()=>((r=(r*1664525+1013904223)>>>0)/4294967296);}
export const DETAIL_COLORS=Object.freeze({gutter:0x5d625e,pipe:0x6b706b,ac:0xc9cbc4,acDark:0x7d827d,vent:0x8d918b,sill:0xd9d4c4,wire:0x24262a,bin:0x3f6a4c,binLid:0x2f5139,crate:0x9a7a52,pallet:0x8a6d48,sign:0x2f4f6f,signTrim:0xe8e0c8,box:0xb59a6e});
// Pure: parts for buildings [{x,z,w,d,h}] and alleys [{x,z,w,d}]. Each part is a box.
export function detailParts(buildings=[],{alleys=[],seed=5,max=4000,wires=[]}={}){
 const r=rng(seed),parts=[],C=DETAIL_COLORS;
 const box=(x,y,z,sx,sy,sz,color,rot=0)=>{if(parts.length<max)parts.push({x,y,z,sx,sy,sz,color,rot});};
 for(const a of alleys){
  if(!a||![a.x,a.z,a.w,a.d].every(Number.isFinite))continue;
  const n=4+Math.floor(r()*3);
  for(let i=0;i<n;i++){const px=a.x+(r()-.5)*a.w*.7,pz=a.z+(r()<.5?-1:1)*(a.d*.5-.9),k=r();
   if(k<.35){box(px,.62,pz,1.1,1.1,.8,C.bin);box(px,1.2,pz,1.16,.08,.86,C.binLid);}
   else if(k<.7){box(px,.4,pz,.8,.8,.8,C.crate,r());if(r()<.5)box(px+.1,1.1,pz,.6,.6,.6,C.box,r());}
   else{box(px,.07,pz,1.2,.14,1,C.pallet);box(px,.62,pz-.4,1.2,1,.14,C.pallet,.0);}}
 }
 // Overhead wires: sagging chains of thin boxes between two anchor points.
 for(const w of wires){const [ax,ay,az]=w.a,[bx,by,bz]=w.b,seg=10,len=Math.hypot(bx-ax,bz-az);if(!(len>1))continue;const rot=Math.atan2(bz-az,bx-ax);
  for(let i=0;i<seg;i++){const t0=i/seg,t1=(i+1)/seg,tm=(t0+t1)/2,sag=-(w.sag??.8)*4*tm*(1-tm);
   const sx=ax+(bx-ax)*tm,sz=az+(bz-az)*tm,sy=ay+(by-ay)*tm+sag,dy=((ay+(by-ay)*t1-(w.sag??.8)*4*t1*(1-t1))-(ay+(by-ay)*t0-(w.sag??.8)*4*t0*(1-t0)));
   parts.length<max&&parts.push({x:sx,y:sy,z:sz,sx:Math.hypot(len/seg,dy),sy:.035,sz:.035,color:C.wire,rot:-rot,tilt:Math.atan2(dy,len/seg)});}}
 for(const b of buildings){
  if(!b||![b.x,b.z,b.w,b.d,b.h].every(Number.isFinite)||b.h<2.5||b.w<3||b.d<3)continue;
  const g=b.ground??0,top=g+b.h,x0=b.x-b.w/2,x1=b.x+b.w/2,z0=b.z-b.d/2,z1=b.z+b.d/2;
  // gutters just under the roofline on all four sides
  box(b.x,top-.12,z0-.09,b.w+.2,.14,.16,C.gutter);box(b.x,top-.12,z1+.09,b.w+.2,.14,.16,C.gutter);
  box(x0-.09,top-.12,b.z,.16,.14,b.d+.2,C.gutter);box(x1+.09,top-.12,b.z,.16,.14,b.d+.2,C.gutter);
  // two downpipes on opposite corners
  box(x0-.12,g+(b.h-.1)/2,z0-.12,.12,b.h-.1,.12,C.pipe);box(x1+.12,g+(b.h-.1)/2,z1+.12,.12,b.h-.1,.12,C.pipe);
  // AC units on the side walls (upper floor), and roof vents/AC
  const floors=Math.max(1,Math.floor(b.h/3));
  for(let f=1;f<floors;f++){
   if(r()<.55){const zz=b.z+(r()-.5)*b.d*.6,side=r()<.5?-1:1,xx=side<0?x0-.32:x1+.32;box(xx,g+f*3+.75,zz,.62,.5,.8,C.ac);box(xx+side*.02,g+f*3+.75,zz,.6,.36,.62,C.acDark);box(xx-side*.2,g+f*3+.48,zz,.3,.06,.7,C.pipe);}
  }
  const vents=1+Math.floor(r()*Math.min(3,b.w*b.d/90));
  for(let i=0;i<vents;i++){const vx=b.x+(r()-.5)*b.w*.6,vz=b.z+(r()-.5)*b.d*.6;if(r()<.5)box(vx,top+.35,vz,1.2,.7,.9,C.ac);else{box(vx,top+.3,vz,.45,.6,.45,C.vent);box(vx,top+.64,vz,.6,.08,.6,C.acDark);}}
  // window sills: a thin ledge band per upper floor on the long sides
  for(let f=1;f<floors;f++){box(b.x,g+f*3+.02,z0-.07,b.w*.86,.07,.14,C.sill);box(b.x,g+f*3+.02,z1+.07,b.w*.86,.07,.14,C.sill);}
 }
 return parts;
}
// Bake parts into flat position/normal/colour arrays (unit cube per part).
const CUBE=(()=>{const f=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]],out=[];for(const n of f){const [a,b]=n[0]?[[0,1,0],[0,0,1]]:n[1]?[[1,0,0],[0,0,1]]:[[1,0,0],[0,1,0]];
 const c=k=>n.map((v,i)=>v*.5+a[i]*k[0]*.5+b[i]*k[1]*.5),q=[c([-1,-1]),c([1,-1]),c([1,1]),c([-1,-1]),c([1,1]),c([-1,1])];
 // wind so the face points along n
 const e1=q[1].map((v,i)=>v-q[0][i]),e2=q[2].map((v,i)=>v-q[0][i]),cr=[e1[1]*e2[2]-e1[2]*e2[1],e1[2]*e2[0]-e1[0]*e2[2],e1[0]*e2[1]-e1[1]*e2[0]];
 const flip=cr[0]*n[0]+cr[1]*n[1]+cr[2]*n[2]<0;for(const p of flip?[q[0],q[2],q[1],q[3],q[5],q[4]]:q)out.push([p,n]);}return out;})();
export function bakeParts(parts){
 const pos=new Float32Array(parts.length*36*3),nor=new Float32Array(parts.length*36*3),col=new Float32Array(parts.length*36*3);let o=0;
 for(const p of parts){const cr=Math.cos(p.rot||0),sr=Math.sin(p.rot||0),ct=Math.cos(p.tilt||0),st=Math.sin(p.tilt||0);
  const R=((p.color>>16)&255)/255,G=((p.color>>8)&255)/255,B=(p.color&255)/255,lin=c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4;
  for(const [v,n] of CUBE){let x=v[0]*p.sx,y=v[1]*p.sy,z=v[2]*p.sz;let nx=n[0],ny=n[1],nz=n[2];
   // tilt about z, then yaw about y
   [x,y]=[x*ct-y*st,x*st+y*ct];[nx,ny]=[nx*ct-ny*st,nx*st+ny*ct];
   [x,z]=[x*cr+z*sr,-x*sr+z*cr];[nx,nz]=[nx*cr+nz*sr,-nx*sr+nz*cr];
   pos[o]=p.x+x;pos[o+1]=p.y+y;pos[o+2]=p.z+z;nor[o]=nx;nor[o+1]=ny;nor[o+2]=nz;col[o]=lin(R);col[o+1]=lin(G);col[o+2]=lin(B);o+=3;}}
 return {pos,nor,col,verts:o/3};
}
export function createDetailMesh(THREE,scene,parts){
 if(!parts.length)return null;const b=bakeParts(parts),g=new THREE.BufferGeometry();
 g.setAttribute('position',new THREE.BufferAttribute(b.pos,3));g.setAttribute('normal',new THREE.BufferAttribute(b.nor,3));g.setAttribute('color',new THREE.BufferAttribute(b.col,3));g.computeBoundingSphere();
 const mesh=new THREE.Mesh(g,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.8,metalness:.05}));mesh.name='Gfx detail v152';mesh.castShadow=true;mesh.receiveShadow=true;mesh.matrixAutoUpdate=false;mesh.userData.noBatch=true;scene.add(mesh);
 return {mesh,parts:parts.length,verts:b.verts};
}
// Wear decals: 4 procedural stains in a 2x2 atlas, one transparent mesh.
export function decalAtlasBytes(n=64){
 const W=n*2,bytes=new Uint8Array(W*W*4),r=rng(77);
 for(let t=0;t<4;t++){const ox=(t%2)*n,oy=(t>>1)*n,blobs=Array.from({length:6},()=>[r()*.5+.25,r()*.5+.25,.12+r()*.18]);
  for(let y=0;y<n;y++)for(let x=0;x<n;x++){const u=x/n,v=y/n;let a=0;
   if(t===0||t===3){for(const [bx,by,br] of blobs)a=Math.max(a,1-Math.hypot(u-bx,v-by)/br);a=clamp(a,0,1)**1.5*(t===0?.8:.45);}
   else if(t===1){const crack=Math.abs(v-.5-.18*Math.sin(u*9+Math.sin(u*23)*.6));a=crack<.02?.85:crack<.045?.25:0;a*=clamp(1-Math.abs(u-.5)*2.2,0,1)*1.8;}
   else{const edge=Math.min(u,v,1-u,1-v);a=edge>.06?.32+.06*Math.sin(u*40)*Math.sin(v*37):0;}
   const i=((oy+y)*W+ox+x)*4;bytes[i]=bytes[i+1]=bytes[i+2]=t===2?30:12;bytes[i+3]=Math.round(clamp(a,0,1)*255);}}
 return {bytes,width:W,height:W};
}
export function decalSpots({roads=[],walls=[],seed=9,max=260}={}){
 const r=rng(seed),out=[];
 for(const rd of roads){const n=Math.max(1,Math.round(rd.len/14));for(let i=0;i<n&&out.length<max;i++){const t=(i+r())/n-.5,lat=(r()-.5)*rd.width*.7;
  const x=rd.axis==='z'?rd.at+lat:rd.mid+t*rd.len,z=rd.axis==='z'?rd.mid+t*rd.len:rd.at+lat;out.push({x,z,s:1.2+r()*2.4,tile:Math.floor(r()*3),rot:r()*6.28});}}
 for(const w of walls)if(out.length<max&&r()<.7)out.push({x:w.x,z:w.z,s:1.4+r(),tile:3,rot:r()*6.28});
 return out;
}
export function createDecals(THREE,scene,spots,{height=()=>0}={}){
 if(!spots.length)return null;const pos=[],uv=[],idx=[];let n=0;
 for(const s of spots){const ou=(s.tile%2)*.5,ov=(s.tile>>1)*.5,c=Math.cos(s.rot),si=Math.sin(s.rot),h=height(s.x,s.z)+.115;
  for(const [a,b] of [[-1,-1],[1,-1],[1,1],[-1,1]]){const lx=a*s.s/2,lz=b*s.s/2;pos.push(s.x+lx*c-lz*si,h,s.z+lx*si+lz*c);uv.push(ou+(a+1)*.25,ov+(b+1)*.25);}
  idx.push(n,n+2,n+1,n,n+3,n+2);n+=4;}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeBoundingSphere();
 const a=decalAtlasBytes(),tex=new THREE.DataTexture(a.bytes,a.width,a.height,THREE.RGBAFormat);tex.needsUpdate=true;tex.magFilter=tex.minFilter=THREE.LinearFilter;
 const mesh=new THREE.Mesh(g,new THREE.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-3,polygonOffsetUnits:-3,side:THREE.DoubleSide}));
 mesh.name='Gfx wear decals v152';mesh.renderOrder=1;mesh.matrixAutoUpdate=false;mesh.userData.noBatch=true;scene.add(mesh);return {mesh,count:spots.length};
}

// Low only: small loose props far from the camera leave the render layer, so phones
// pay for the detail added above. Checked every 15 frames; buildings, batches, sky,
// ground, water, crowds and traffic are never touched. Restores everything off Low.
export function lowCullRadius(r){return r<4?95:r<12?130:Infinity;}
export function createLowCull(THREE,scene,{skip=/^(Static batch|Soft sky|Sky|Walkable|Westbank|Winding|Tidal|Northern|Street crowd|Chunky cast|Sugar Squad|Traffic|Town traffic|Ambient traffic|Contact shadows|Ground occlusion|Gfx|Sign atlas|Gummy Bay starter street)/i}={}){
 const box=new THREE.Box3(),sphere=new THREE.Sphere();let frame=0,culled=new Set(),entries=null;
 const setLayer=(o,on)=>o.traverse(c=>{if(on)c.layers.enable(0);else c.layers.disable(0);});
 function collect(){entries=[];for(const o of scene.children){if(o.isLight||o.isCamera||skip.test(o.name||'')||o.isInstancedMesh&&o.count>40)continue;box.setFromObject(o);if(box.isEmpty())continue;box.getBoundingSphere(sphere);if(sphere.radius<12)entries.push(o);}for(const o of [...culled])if(!entries.includes(o)){setLayer(o,true);culled.delete(o);}}
 const last=new THREE.Vector3(1e9,0,0);
 return {
  get culled(){return culled.size;},
  update(camera,quality){
   if(quality!=='performance'){if(culled.size){for(const o of culled)setLayer(o,true);culled.clear();}return;}
   const cp=camera.position;++frame;if(frame%15&&cp.distanceToSquared(last)<64)return;last.copy(cp);if(!entries||frame%600<15)collect();
   for(const o of entries){if(!o.parent||!o.visible)continue;box.setFromObject(o);if(box.isEmpty())continue;box.getBoundingSphere(sphere);
    const far=sphere.center.distanceTo(cp)-sphere.radius>lowCullRadius(sphere.radius);
    if(far&&!culled.has(o)){setLayer(o,false);culled.add(o);}else if(!far&&culled.has(o)){setLayer(o,true);culled.delete(o);}}
  },
  restore(){for(const o of culled)setLayer(o,true);culled.clear();}
 };
}
