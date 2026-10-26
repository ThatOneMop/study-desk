// v134 Lighting and visual polish. Three cheap layers on top of world-lighting:
//  1. readabilityGrade(): a bounce fill (one AmbientLight) and lifted hemisphere
//     colours so undersides, alleys and the overpass soffit are never near-black,
//     plus a cool moon fill at night. Sun, exposure and the light budget are untouched.
//  2. createStreetLighting(): instanced lamp posts with emissive heads and additive
//     fake light pools on the ground (no real lights; ≤3 draw calls, 0 by day).
//  3. createStylisedTrees(): trunk + clumped canopy trees, two instanced meshes.
import * as THREE from './vendor/three.module.min.js';

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

export function createStreetLighting({scene,spots=[],soffit=[],height=()=>0}={}){
 const group=new THREE.Group();group.name='Street lighting v134';scene.add(group);
 const n=spots.length,m=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler(),v=new THREE.Vector3(),sc=new THREE.Vector3();
 const poleMat=new THREE.MeshStandardMaterial({color:0x4d5450,roughness:.7,metalness:.3});
 const headMat=new THREE.MeshStandardMaterial({color:0xf2e2b8,emissive:0xffc27a,emissiveIntensity:.15,roughness:.5});
 const poolMat=new THREE.MeshBasicMaterial({color:0xffb766,map:poolTexture(),transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,fog:true,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});
 const poles=new THREE.InstancedMesh(new THREE.CylinderGeometry(.08,.12,5.4,6),poleMat,Math.max(1,n*2));
 const heads=new THREE.InstancedMesh(new THREE.BoxGeometry(.9,.18,.42),headMat,Math.max(1,n+soffit.length));
 const pools=new THREE.InstancedMesh(new THREE.PlaneGeometry(1,1),poolMat,Math.max(1,n+soffit.length));
 let pi=0,hi=0,li=0;
 for(const s of spots){const y=height(s.x,s.z);
  // pole, arm reaching over the road, head
  const ax=s.axis==='z'?0:s.face*.7,az=s.axis==='z'?s.face*.7:0;
  m.compose(v.set(s.x,y+2.7,s.z),q.identity(),sc.set(1,1,1));poles.setMatrixAt(pi++,m);
  e.set(s.axis==='z'?Math.PI/2:0,0,s.axis==='z'?0:Math.PI/2);q.setFromEuler(e);m.compose(v.set(s.x+ax*.5,y+5.3,s.z+az*.5),q,sc.set(.7,.26,.7));poles.setMatrixAt(pi++,m);
  q.setFromEuler(e.set(0,s.axis==='z'?Math.PI/2:0,0));m.compose(v.set(s.x+ax*1.15,y+5.22,s.z+az*1.15),q,sc.set(1,1,1));heads.setMatrixAt(hi++,m);
  q.setFromEuler(e.set(-Math.PI/2,0,0));m.compose(v.set(s.x+ax*1.6,y+.06,s.z+az*1.6),q,sc.set(10,10,1));pools.setMatrixAt(li++,m);
 }
 for(const s of soffit){ // sodium bars under the overpass deck
  m.compose(v.set(s.x,s.y,s.z),q.setFromEuler(e.set(0,0,0)),sc.set(2.2,.5,.5));heads.setMatrixAt(hi++,m);
  q.setFromEuler(e.set(-Math.PI/2,0,0));m.compose(v.set(s.x,height(s.x,s.z)+.07,s.z),q,sc.set(12,9,1));pools.setMatrixAt(li++,m);
 }
 poles.count=pi;heads.count=hi;pools.count=li;
 for(const o of [poles,heads,pools]){o.instanceMatrix.needsUpdate=true;o.computeBoundingSphere?.();o.userData.streetLighting=true;group.add(o);}
 poles.castShadow=true;heads.castShadow=false;pools.castShadow=pools.receiveShadow=false;pools.renderOrder=2;pools.visible=false;
 return {group,poles,heads,pools,count:n,soffit:soffit.length,
  update(grade){const p=grade?.pools??0;pools.visible=p>0;poolMat.opacity=.5*p;headMat.emissiveIntensity=grade?.heads??.15;}};
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

export function createStylisedTrees({scene,spots=[],height=()=>0,seed=11}={}){
 let r=seed>>>0;const rnd=()=>((r=(r*1664525+1013904223)>>>0)/4294967296);
 const trunkGeo=new THREE.CylinderGeometry(.16,.26,1,6);trunkGeo.translate(0,.5,0);
 const leafGeo=new THREE.IcosahedronGeometry(1,1);
 const trunkMat=new THREE.MeshStandardMaterial({color:0x6b5640,roughness:.95});
 const leafMat=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.9,flatShading:true});
 const CLUMPS=4,trunks=new THREE.InstancedMesh(trunkGeo,trunkMat,Math.max(1,spots.length)),leaves=new THREE.InstancedMesh(leafGeo,leafMat,Math.max(1,spots.length*CLUMPS));
 const m=new THREE.Matrix4(),q=new THREE.Quaternion(),v=new THREE.Vector3(),sc=new THREE.Vector3(),c=new THREE.Color();
 const greens=[0x5f8a4e,0x6f9a52,0x7fa35a,0x587f53,0x8aa65e];
 let li=0;
 spots.forEach((t,i)=>{const s=t.s??1,y=height(t.x,t.z),h=2.2*s;
  m.compose(v.set(t.x,y,t.z),q.identity(),sc.set(s,h,s));trunks.setMatrixAt(i,m);
  const base=greens[Math.floor((t.hue??rnd())*greens.length)%greens.length];
  for(let k=0;k<CLUMPS;k++){const a=k/CLUMPS*Math.PI*2+rnd(),rad=k?1.05*s:0,cy=y+h+(k?.35:1.05)*s,rr=(k?1.15:1.45)*s*(.9+rnd()*.2);
   q.setFromAxisAngle(v.set(0,1,0),rnd()*6);m.compose(v.set(t.x+Math.cos(a)*rad,cy,t.z+Math.sin(a)*rad),q,sc.set(rr,rr*.82,rr));leaves.setMatrixAt(li,m);
   c.setHex(base).offsetHSL((rnd()-.5)*.03,0,(k?-.03:.04)+(rnd()-.5)*.04);leaves.setColorAt(li,c);li++;}
 });
 trunks.count=spots.length;leaves.count=li;
 for(const o of [trunks,leaves]){o.castShadow=true;o.receiveShadow=true;o.instanceMatrix.needsUpdate=true;if(o.instanceColor)o.instanceColor.needsUpdate=true;o.computeBoundingSphere?.();o.name='Stylised trees';scene.add(o);}
 return {trunks,leaves,count:spots.length};
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

export function createPlanters({scene,spots=[],height=()=>0}){
 const box=new THREE.BoxGeometry(1.4,.55,1.4);box.translate(0,.275,0);const bush=new THREE.IcosahedronGeometry(.62,1);
 const boxes=new THREE.InstancedMesh(box,new THREE.MeshStandardMaterial({color:0x9a7d5c,roughness:.9}),Math.max(1,spots.length));
 const bushes=new THREE.InstancedMesh(bush,new THREE.MeshStandardMaterial({color:0x6f9a52,roughness:.9,flatShading:true}),Math.max(1,spots.length));
 const m=new THREE.Matrix4(),q=new THREE.Quaternion(),v=new THREE.Vector3(),sc=new THREE.Vector3();
 spots.forEach((p,i)=>{const y=height(p.x,p.z);m.compose(v.set(p.x,y,p.z),q.identity(),sc.set(1,1,1));boxes.setMatrixAt(i,m);m.compose(v.set(p.x,y+.75,p.z),q.setFromAxisAngle(v.set(0,1,0).clone(),p.hue*6),sc.set(1,.8,1));m.setPosition(p.x,y+.75,p.z);bushes.setMatrixAt(i,m);});
 boxes.count=bushes.count=spots.length;for(const o of [boxes,bushes]){o.castShadow=o.receiveShadow=true;o.instanceMatrix.needsUpdate=true;o.computeBoundingSphere?.();scene.add(o);}
 return {boxes,bushes,count:spots.length};
}
