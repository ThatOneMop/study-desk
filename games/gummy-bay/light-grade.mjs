// v134 Lighting and visual polish. Three cheap layers on top of world-lighting:
//  1. readabilityGrade(): a bounce fill (one AmbientLight) and lifted hemisphere
//     colours so undersides, alleys and the overpass soffit are never near-black,
//     plus a cool moon fill at night. Sun, exposure and the light budget are untouched.
//  2. createStreetDressing(): lamp posts, stylised trees (trunk + clumped canopy) and
//     planters as plain per-colour merged meshes the static batcher folds into its
//     town batches; additive light pools + glowing lamp heads are ONE night-only mesh.
//     No real lights: ~0 extra draw calls by day, +1 after dark.
import * as THREE from './vendor/three.module.min.js';
import {BATCH_CELL} from './static-batch.mjs?v=133';

const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,t)=>a+(b-a)*t;
function lerpHex(a,b,t){let o=0;for(const s of [16,8,0])o|=Math.round(lerp((a>>s)&255,(b>>s)&255,clamp(t)))<<s;return o;}

// Pure: what to add for a given world-lighting plan.
export function readabilityGrade(plan={}){
 const night=clamp(plan.night??0),day=clamp(plan.daylight??1),dusk=clamp(1-Math.abs(day-.3)/.3)*(1-night);
 const fill=lerp(.42,.62,night)+dusk*.08;
 const fillColor=lerpHex(lerpHex(0xfff0dc,0xffd2b0,dusk),0x6f82b8,night);
 return {
  fill,fillColor,
  hemiScale:lerp(1.18,1.35,night),
  hemiSky:lerpHex(plan.hemiSky??0xc4d8ea,lerpHex(0xdfe8f0,0x50648f,night),.35),
  hemiGround:lerpHex(plan.hemiGround??0x75694f,lerpHex(0xa8977a,0x4c4c60,night),.55),
  moon:night,
  pools:night>.04?clamp(night*1.15):0,
  heads:.15+night*2.4
 };
}

// Pure: lamp spots along city roads, kept off obstacles, points and junctions.
export function streetLampSpots({roadsZ=[],roadsX=[],xRange=[-280,280],zRange=[-445,-10],skipZ=[],keep=[],obstacles=[],points=[],spacing=26,curb=9.6}={}){
 const out=[],clear=(x,z)=>!obstacles.some(o=>Math.abs(x-o.x)<(o.w||0)/2+1.2&&Math.abs(z-o.z)<(o.d||0)/2+1.2)&&!points.some(p=>Math.hypot(p.x-x,p.z-z)<2.5)&&!keep.some(k=>x>=k.x0&&x<=k.x1&&z>=k.z0&&z<=k.z1);
 for(const rz of roadsZ){if(skipZ.includes(rz))continue;let i=0;for(let x=xRange[0]+8;x<xRange[1]-8;x+=spacing,i++){if(roadsX.some(rx=>Math.abs(x-rx)<13))continue;const s=i%2?1:-1,z=rz+s*curb;if(clear(x,z))out.push({x,z,face:-s,axis:'z'});}}
 for(const rx of roadsX){let i=0;for(let z=zRange[0]+8;z<zRange[1];z+=spacing,i++){if(roadsZ.some(rz=>Math.abs(z-rz)<13))continue;const s=i%2?1:-1,x=rx+s*curb;if(clear(x,z))out.push({x,z,face:-s,axis:'x'});}}
 return out;
}

function poolTexture(){
 const n=64,data=new Uint8Array(n*n*4);
 for(let y=0;y<n;y++)for(let x=0;x<n;x++){const d=Math.hypot(x-n/2+.5,y-n/2+.5)/(n/2),a=Math.pow(clamp(1-d),1.8);const i=(y*n+x)*4;data[i]=255;data[i+1]=255;data[i+2]=255;data[i+3]=Math.round(a*255);}
 const t=new THREE.DataTexture(data,n,n,THREE.RGBAFormat);t.needsUpdate=true;t.magFilter=THREE.LinearFilter;t.minFilter=THREE.LinearFilter;return t;
}

// Pure: tree spots from a free-cell predicate, on a jittered lattice.
export function treeSpots({free,bounds={minX:-280,maxX:280,minZ:-445,maxZ:66},step=9,max=170,seed=7,extra=[]}={}){
 let r=seed>>>0;const rnd=()=>((r=(r*1664525+1013904223)>>>0)/4294967296);
 const out=[...extra];
 for(let z=bounds.minZ;z<bounds.maxZ&&out.length<max;z+=step)for(let x=bounds.minX;x<bounds.maxX&&out.length<max;x+=step){
  const tx=x+(rnd()-.5)*step*.6,tz=z+(rnd()-.5)*step*.6;if(rnd()<.35)continue;
  if(free(tx,tz))out.push({x:tx,z:tz,s:.8+rnd()*.55,hue:rnd()});
 }
 return out;
}

// Pure: street-dressing spots inside a block (Old Town) that never sit on a road band,
// a collider, a door/contact point, a police lane or any crowd stop or walk line.
const segDist=(x,z,[ax,az],[bx,bz])=>{const dx=bx-ax,dz=bz-az,l=dx*dx+dz*dz,t=l?clamp(((x-ax)*dx+(z-az)*dz)/l):0;return Math.hypot(x-ax-dx*t,z-az-dz*t);};
export function dressingSpots({bounds={x0:-78,x1:78,z0:-38,z1:50},roadBands=[],colliders=[],points=[],routes=[],crowd=[],step=6,max=40,seed=3}={}){
 let r=seed>>>0;const rnd=()=>((r=(r*1664525+1013904223)>>>0)/4294967296);const out=[];
 for(let z=bounds.z0;z<=bounds.z1;z+=step)for(let x=bounds.x0;x<=bounds.x1;x+=step){
  const px=x+(rnd()-.5)*2,pz=z+(rnd()-.5)*2,kind=rnd();
  if(roadBands.some(b=>b.axis==='z'?Math.abs(pz-b.at)<b.half:Math.abs(px-b.at)<b.half))continue;
  if(colliders.some(o=>Math.abs(px-o.x)<(o.w||0)/2+2.4&&Math.abs(pz-o.z)<(o.d||0)/2+2.4))continue;
  if(points.some(p=>Math.hypot(p.x-px,p.z-pz)<5))continue;
  if(routes.some(rt=>rt.some((a,i)=>segDist(px,pz,a,rt[(i+1)%rt.length])<3)))continue;
  if(crowd.some(c=>c.b?segDist(px,pz,c.a,c.b)<2.2:Math.hypot(c.a[0]-px,c.a[1]-pz)<2.6))continue;
  if(out.some(o=>Math.hypot(o.x-px,o.z-pz)<5))continue;
  out.push({x:px,z:pz,kind:kind<.55?'tree':'planter',s:.75+rnd()*.4,hue:rnd()});if(out.length>=max)return out;
 }
 return out;
}


// Merged static dressing. Every part is baked (position, normal, colour, glow uv).
class Baker{
 constructor(){this.p=[];this.n=[];this.c=[];this.u=[];this.m=new THREE.Matrix4();this.nm=new THREE.Matrix3();this.col=new THREE.Color();this.v=new THREE.Vector3();}
 add(geo,matrix,hex,glow=false){const g=geo.index?geo.toNonIndexed():geo;const pos=g.attributes.position,nor=g.attributes.normal;this.nm.getNormalMatrix(matrix);this.col.setHex(hex);
  const uvs=g.attributes.uv;
  for(let i=0;i<pos.count;i++){this.v.fromBufferAttribute(pos,i).applyMatrix4(matrix);this.p.push(this.v.x,this.v.y,this.v.z);this.v.fromBufferAttribute(nor,i).applyMatrix3(this.nm).normalize();this.n.push(this.v.x,this.v.y,this.v.z);
   this.c.push(this.col.r,this.col.g,this.col.b);if(glow||!uvs)this.u.push(.5,.5);else this.u.push(uvs.getX(i),uvs.getY(i));}
  if(g!==geo)g.dispose();}
 geometry({colour=true}={}){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(this.p,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(this.n,3));if(colour)g.setAttribute('color',new THREE.Float32BufferAttribute(this.c,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(this.u,2));g.computeBoundingSphere();g.computeBoundingBox();return g;}
 get verts(){return this.p.length/3;}
}
export function createStreetDressing({scene,lamps=[],soffit=[],trees=[],planters=[],height=()=>0,seed=11}={}){
 let r=seed>>>0;const rnd=()=>((r=(r*1664525+1013904223)>>>0)/4294967296);
 // One plain mesh per colour per batch cell (BATCH_CELL), anchored at the cell centre, so each
 // folds into that cell's town batch (same look key as game.js box(): roughness .84) and frustum-culls.
 const parts=new Map();let at=[0,0];const bake=hex=>{const cx=Math.floor(at[0]/BATCH_CELL),cz=Math.floor(at[1]/BATCH_CELL),k=hex+'|'+cx+'|'+cz;if(!parts.has(k))parts.set(k,{hex,cx,cz,b:new Baker()});return parts.get(k).b;};
 const G=new Baker(),m=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler(),v=new THREE.Vector3(),sc=new THREE.Vector3();
 const pole=new THREE.CylinderGeometry(.08,.12,1,6),cube=new THREE.BoxGeometry(1,1,1),trunk=new THREE.CylinderGeometry(.16,.26,1,6),leaf=new THREE.IcosahedronGeometry(1,1),bush=new THREE.IcosahedronGeometry(.62,1),plane=new THREE.PlaneGeometry(1,1);plane.rotateX(-Math.PI/2);
 const pool=(x,y,z,w,d,hex)=>G.add(plane,m.compose(v.set(x,y+.07,z),q.identity(),sc.set(w,1,d)),hex,false);
 const glow=(matrix,hex)=>G.add(cube,matrix,hex,true);
 for(const s of lamps){at=[s.x,s.z];const y=height(s.x,s.z),ax=s.axis==='z'?0:s.face,az=s.axis==='z'?s.face:0;
  bake(0x4d5450).add(pole,m.compose(v.set(s.x,y+2.7,s.z),q.identity(),sc.set(1,5.4,1)),0xffffff);
  bake(0x4d5450).add(cube,m.compose(v.set(s.x+ax*.6,y+5.32,s.z+az*.6),q.identity(),sc.set(ax?1.3:.1,.1,az?1.3:.1)),0xffffff);
  bake(0xe8dcbc).add(cube,m.compose(v.set(s.x+ax*1.15,y+5.2,s.z+az*1.15),q.identity(),sc.set(ax?.9:.42,.18,az?.9:.42)),0xffffff);
  glow(m.compose(v.set(s.x+ax*1.15,y+5.19,s.z+az*1.15),q.identity(),sc.set(ax?.96:.48,.2,az?.96:.48)),0xffc98a);
  pool(s.x+ax*1.6,y,s.z+az*1.6,10,10,0xffb766);}
 for(const s of soffit){at=[s.x,s.z];bake(0xe8dcbc).add(cube,m.compose(v.set(s.x,s.y,s.z),q.identity(),sc.set(2.2,.12,.5)),0xffffff);glow(m.compose(v.set(s.x,s.y-.01,s.z),q.identity(),sc.set(2.26,.14,.56)),0xffb060);pool(s.x,height(s.x,s.z),s.z,12,9,0xf0a050);}
 const greens=[0x5f8a4e,0x6f9a52,0x7fa35a,0x587f53,0x8aa65e];
 for(const t of trees){at=[t.x,t.z];const s=t.s??1,y=height(t.x,t.z),h=2.2*s;
  bake(0x6b5640).add(trunk,m.compose(v.set(t.x,y+h/2,t.z),q.identity(),sc.set(s,h,s)),0xffffff);
  const g0=Math.floor((t.hue??rnd())*greens.length)%greens.length;
  for(let k=0;k<4;k++){const a=k/4*Math.PI*2+rnd(),rad=k?1.05*s:0,rr=(k?1.15:1.45)*s*(.9+rnd()*.2);
   q.setFromEuler(e.set(0,rnd()*6,0));const hex=greens[(g0+(k?1+(k%2):0))%greens.length];
   bake(hex).add(leaf,m.compose(v.set(t.x+Math.cos(a)*rad,y+h+(k?.35:1.05)*s,t.z+Math.sin(a)*rad),q,sc.set(rr,rr*.82,rr)),0xffffff);}}
 for(const p of planters){at=[p.x,p.z];const y=height(p.x,p.z);bake(0x9a7d5c).add(cube,m.compose(v.set(p.x,y+.28,p.z),q.identity(),sc.set(1.4,.55,1.4)),0xffffff);
  bake(0x6f9a52).add(bush,m.compose(v.set(p.x,y+.78,p.z),q.setFromEuler(e.set(0,(p.hue??0)*6,0)),sc.set(1,.8,1)),0xffffff);}
 // Plain single-colour meshes: the static batcher folds them into its town batches.
 const meshes=[];let verts=0;
 const looks=new Map(),look=hex=>{if(!looks.has(hex))looks.set(hex,new THREE.MeshStandardMaterial({color:hex,roughness:.84,flatShading:true}));return looks.get(hex);};
 for(const {hex,cx,cz,b} of parts.values()){const ox=(cx+.5)*BATCH_CELL,oz=(cz+.5)*BATCH_CELL,g=b.geometry({colour:false});g.translate(-ox,0,-oz);g.computeBoundingSphere();const mesh=new THREE.Mesh(g,look(hex));mesh.position.set(ox,0,oz);mesh.castShadow=mesh.receiveShadow=true;scene.add(mesh);meshes.push(mesh);verts+=b.verts;}
 // Night-only: additive pools + glowing lamp heads, one mesh.
 const nightMat=new THREE.MeshBasicMaterial({color:0xffffff,vertexColors:true,map:poolTexture(),transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,fog:true,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});
 const night=new THREE.Mesh(G.geometry(),nightMat);night.name='Street light pools v134';night.renderOrder=2;night.visible=false;night.userData.streetDressing=true;scene.add(night);
 [pole,cube,trunk,leaf,bush,plane].forEach(g=>g.dispose());
 return {meshes,pools:night,lamps:lamps.length,soffit:soffit.length,trees:trees.length,planters:planters.length,verts,
  update(grade){const p=grade?.pools??0;night.visible=p>0;nightMat.opacity=Math.min(1,.8*p);}};
}
