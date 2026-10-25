import * as THREE from './vendor/three.module.min.js';
export const ISLAND_ROAD_X=[-270,-105,0,105,270];
export const ISLAND_ROAD_Z=[0,-90,-160,-230,-300,-370,-435];
export function overlaps(a,b,gap=0){return Number.isFinite(b.w)&&Number.isFinite(b.d)&&Math.abs(a.x-b.x)<(a.w+b.w)/2+gap&&Math.abs(a.z-b.z)<(a.d+b.d)/2+gap;}
export function neighborhoodPlan({obstacles=[],points=[],height=()=>0}={}){
 const sites=[];
 // Two frontages per block, with narrow houses, small shops and walkups.
 for(let z=58;z>=-418;z-=4)for(let x=-248;x<=248;x+=4){
  const s={id:`island-home-${sites.length}`,x,z,w:12.7,d:14.7};
  if(ISLAND_ROAD_X.some(r=>Math.abs(x-r)<s.w/2+12)||ISLAND_ROAD_Z.some(r=>Math.abs(z-r)<s.d/2+12))continue;
  // Old Town remains authored. Keep its campsite, workshops and approaches clear.
  if(Math.abs(x)<112&&z>-78)continue;
  if(obstacles.some(b=>overlaps(s,b,3))||sites.some(b=>overlaps(s,b,3)))continue;
  if(points.some(p=>Math.abs(x-p.x)<s.w/2+8&&Math.abs(z-p.z)<s.d/2+8))continue;
  if([-9,0,9].some(dx=>[-9,0,9].some(dz=>height(x+dx,z+dz)>.01)))continue;
  sites.push(s);
 }
 return sites;
}
export function islandOutline(bounds,n=128){
 const cz=(bounds.minZ+bounds.maxZ)/2,hx=290,hz=(bounds.maxZ-bounds.minZ)/2+2;
 return Array.from({length:n},(_,i)=>{const a=i/n*Math.PI*2,dx=Math.cos(a),dz=Math.sin(a),r=1/Math.max(Math.abs(dx)/hx,Math.abs(dz)/hz),edge=48+5*Math.sin(a*7)+3*Math.sin(a*13);
 return {inner:{x:dx*r,z:cz+dz*r},outer:{x:dx*(r+edge),z:cz+dz*(r+edge)}};});
}
export function createIslandShore(scene,bounds,material){
 const outline=islandOutline(bounds),positions=[],colors=[],indices=[];
 const levels=[{t:0,y:-.075,c:0x66684e},{t:.62,y:-.10,c:0x74725a},{t:.83,y:-.23,c:0x9b9275},{t:1,y:-1.9,c:0x646e66}];
 for(const p of outline)for(const l of levels){positions.push(p.inner.x+(p.outer.x-p.inner.x)*l.t,l.y,p.inner.z+(p.outer.z-p.inner.z)*l.t);const c=new THREE.Color(l.c);colors.push(c.r,c.g,c.b);}
 for(let i=0;i<outline.length;i++)for(let j=0;j<3;j++){const a=i*4+j,b=((i+1)%outline.length)*4+j;indices.push(a,a+1,b,b,a+1,b+1);}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geo.setIndex(indices);geo.computeVertexNormals();
 const shore=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({vertexColors:true,roughness:1,side:THREE.DoubleSide}));shore.name='Continuous island coast';shore.receiveShadow=true;scene.add(shore);
 // Complete the south ground beneath the outer neighbourhoods; the old central beach stays above it.
 const land=new THREE.Mesh(new THREE.BoxGeometry(580,.6,bounds.maxZ-bounds.minZ+4),material);land.position.set(0,-.38,(bounds.minZ+bounds.maxZ)/2);land.name='Island land foundation';land.receiveShadow=true;scene.add(land);
 return {shore,land,outline};
}
export function relocateFromInfill(p,sites,free){
 if(!sites.some(b=>overlaps({x:p.x,z:p.z,w:1.5,d:1.5},b)))return p;
 for(let r=2;r<=40;r+=2)for(let i=0;i<32;i++){const a=i*Math.PI/16,x=p.x+Math.cos(a)*r,z=p.z+Math.sin(a)*r;if(free(x,z))return {...p,x,z};}return p;
}
