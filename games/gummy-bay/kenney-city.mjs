// v162 Kenney City Kit (Commercial 2.1 and Suburban 2.0, CC0, www.kenney.nl) buildings for the
// generic city lots. Each kit shares one ~12 KB colour atlas, so the whole
// layer is baked into a few merged meshes (one per 400 m cell and kit), not
// one draw call per building. Models are fitted to each lot's footprint and face its street.
import * as THREE from './vendor/three.module.min.js';

export const KENNEY_CELL=400;
// Kenney fronts face -z; the city lots put their street side on local +z.
export const KENNEY_FRONT=Math.PI;
export const KENNEY_MODELS=Object.freeze({
 shop:['building-a','building-b','building-c','building-d','building-e','building-h','building-k'],
 terrace:['building-a','building-b','building-d','building-f','building-g','building-h','building-k'],
 flats:['building-i','building-j','building-l','building-n','building-f','building-g'],
 house:'abcdefghijklmnopqrstu'.split('').map(c=>'building-type-'+c)
});
export const KENNEY_URLS=Object.freeze(['./assets/kenney/city-commercial.glb','./assets/kenney/city-suburban.glb']);
// v163: tired, sun-bleached wall tints (nicotine cream, dirty render, faded brick,
// tired teal) so the kit reads run-down rather than toy-clean.
export const KENNEY_TINTS=Object.freeze([0xe2d8c4,0xd4c0a2,0xcfae98,0xb9c2c2,0xc9c6a8,0xdccaa0,0xbcaeb4,0xd8d2c6,0xc4a48c,0xa9b8ae]);
const rngFor=seed=>{let t=(seed>>>0)||1;return ()=>{t=(t+0x6D2B79F5)>>>0;let x=Math.imul(t^t>>>15,t|1);x^=x+Math.imul(x^x>>>7,x|61);return ((x^x>>>14)>>>0)/4294967296;};};

// Bake a loaded glTF scene into plain float geometry per named model, base at
// y=0 and centred in x/z. Quantised attributes are expanded here.
export function extractModels(root){
 const out={};root.updateMatrixWorld(true);
 root.traverse(o=>{if(!o.isMesh)return;let n=o;while(n.parent&&n.parent!==root)n=n.parent;const name=n.name||o.name;
  const g=o.geometry,P=g.attributes.position,N=g.attributes.normal,U=g.attributes.uv,cnt=P.count;
  const pos=new Float32Array(cnt*3),nor=new Float32Array(cnt*3),uv=new Float32Array(cnt*2),v=new THREE.Vector3(),nm=new THREE.Matrix3().getNormalMatrix(o.matrixWorld);
  for(let i=0;i<cnt;i++){v.fromBufferAttribute(P,i).applyMatrix4(o.matrixWorld);pos.set([v.x,v.y,v.z],i*3);if(N){v.fromBufferAttribute(N,i).applyMatrix3(nm).normalize();nor.set([v.x,v.y,v.z],i*3);}if(U){uv[i*2]=U.getX(i);uv[i*2+1]=U.getY(i);}}
  let lo=[1e9,1e9,1e9],hi=[-1e9,-1e9,-1e9];for(let i=0;i<cnt*3;i++){const k=i%3;lo[k]=Math.min(lo[k],pos[i]);hi[k]=Math.max(hi[k],pos[i]);}
  const cx=(lo[0]+hi[0])/2,cz=(lo[2]+hi[2])/2;for(let i=0;i<cnt;i++){pos[i*3]-=cx;pos[i*3+1]-=lo[1];pos[i*3+2]-=cz;}
  const index=g.index?Uint32Array.from(g.index.array):Uint32Array.from({length:cnt},(_,i)=>i);
  out[name]={pos,nor,uv,index,size:[hi[0]-lo[0],hi[1]-lo[1],hi[2]-lo[2]],material:o.material};
 });
 return out;
}

// Pick a model for a lot, preferring one whose plan shape matches the lot.
export function placeLot(lot,models){
 const r=rngFor(lot.seed||1),list=(KENNEY_MODELS[lot.type]||KENNEY_MODELS.shop).filter(n=>models[n]);if(!list.length)return null;
 const want=lot.w/lot.d;let best=null,score=1e9;
 for(let k=0;k<3;k++){const n=list[Math.floor(r()*list.length)],m=models[n],s=Math.abs(Math.log((m.size[0]/m.size[2])/want))+r()*.15;if(s<score){score=s;best=n;}}
 const m=models[best],sx=lot.w*.96/m.size[0],sz=lot.d*.96/m.size[2],sy=Math.sqrt(sx*sz)*(lot.type==='flats'?1.08:1)*(lot.type==='house'?.9+r()*.2:lot.type==='flats'?.88+r()*.6:.8+r()*.5);/* v164: mixed heights, stretched or squat windows */
 return {model:best,x:lot.x,y:lot.y||0,z:lot.z,rot:(lot.rot||0)+KENNEY_FRONT,sx,sy,sz,height:m.size[1]*sy,tint:KENNEY_TINTS[Math.floor(r()*KENNEY_TINTS.length)]};
}

export function mergePlacements(placements,models){
 let vc=0,ic=0;for(const p of placements){const m=models[p.model];vc+=m.pos.length/3;ic+=m.index.length;}
 const pos=new Float32Array(vc*3),nor=new Float32Array(vc*3),uv=new Float32Array(vc*2),col=new Float32Array(vc*3),index=new Uint32Array(ic);
 let vo=0,io=0;const tint=new THREE.Color();
 for(const p of placements){const m=models[p.model],n=m.pos.length/3,c=Math.cos(p.rot),s=Math.sin(p.rot);tint.setHex(p.tint);
  const cut=p.cut||0;
  for(let i=0;i<n;i++){const x=m.pos[i*3]*p.sx,y=Math.max(0,m.pos[i*3+1]-cut)*p.sy,z=m.pos[i*3+2]*p.sz,o=(vo+i)*3;
   pos[o]=p.x+x*c+z*s;pos[o+1]=p.y+y;pos[o+2]=p.z-x*s+z*c;
   let nx=m.nor[i*3]/p.sx,ny=m.nor[i*3+1]/p.sy,nz=m.nor[i*3+2]/p.sz;const l=Math.hypot(nx,ny,nz)||1;nx/=l;ny/=l;nz/=l;
   nor[o]=nx*c+nz*s;nor[o+1]=ny;nor[o+2]=-nx*s+nz*c;uv[(vo+i)*2]=m.uv[i*2];uv[(vo+i)*2+1]=m.uv[i*2+1];col[o]=tint.r;col[o+1]=tint.g;col[o+2]=tint.b;}
  if(p.cut){let k=0;for(let t=0;t<m.index.length;t+=3){const a=m.index[t],b=m.index[t+1],c2=m.index[t+2];if(m.pos[a*3+1]<=p.cut+.004&&m.pos[b*3+1]<=p.cut+.004&&m.pos[c2*3+1]<=p.cut+.004)continue;index[io+k++]=a+vo;index[io+k++]=b+vo;index[io+k++]=c2+vo;}vo+=n;io+=k;}
  else{for(let i=0;i<m.index.length;i++)index[io+i]=m.index[i]+vo;vo+=n;io+=m.index.length;}}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('normal',new THREE.BufferAttribute(nor,3));g.setAttribute('uv',new THREE.BufferAttribute(uv,2));g.setAttribute('color',new THREE.BufferAttribute(col,3));
 g.setIndex(new THREE.BufferAttribute(io<index.length?index.slice(0,io):index,1));g.computeBoundingSphere();g.computeBoundingBox();return g;
}

// v163: Blender-town footprints. 'upper' sites keep the walk-in shop ground floor
// (room walls, panes, door, sign, awning) and get Kenney upper storeys on top;
// 'full' sites are replaced outright. Fronts face +z (front=1) or -z (front=-1).
export const SITE_MODELS=Object.freeze({wide:['building-k','building-j','building-n'],single:['building-a','building-b','building-d','building-h'],tall:['building-f','building-g','building-i','building-l']});
export const STOREY=.4; // Kenney storey height in model units; ground floor is 0 to 0.4
export function placeSite(site,models){
 const r=rngFor(site.seed||Math.round(site.x*31+site.z*17)),out=[];
 const front=site.front===-1?-1:1,base=site.base||0,upper=site.mode==='upper',H=Math.max(3,(site.h||10)-base);
 const rot=(front===1?0:Math.PI)+KENNEY_FRONT;
 // try a few layouts, keep the least distorted (aspect of storeys and windows)
 const layouts=[];
 const have=n=>models[n];
 for(const n of SITE_MODELS.wide.filter(have)){const m=models[n];for(const rows of [1,2])layouts.push({cols:1,rows,list:[n]});}
 for(const rows of [1,2])layouts.push({cols:2,rows,list:SITE_MODELS.single.filter(have)},{cols:2,rows,list:SITE_MODELS.tall.filter(have)});
 let best=null,bestScore=1e9;
 for(const L of layouts){if(!L.list.length)continue;const n=L.list[Math.floor(r()*L.list.length)],m=models[n];
  const sx=site.w/L.cols/m.size[0],sz=site.d/L.rows/m.size[2],span=upper?Math.max(.4,m.size[1]-STOREY):m.size[1],sy=H/span;
  const score=Math.abs(Math.log(sz/sx))*.7+Math.abs(Math.log(sy/sx))+r()*.12-(L.cols>1?.3:0);if(score<bestScore){bestScore=score;best={...L,n,sx,sz,sy};}}
 if(!best)return out;
 // v164: break the symmetry. Columns get uneven widths, mixed models from every list
 // and their own heights, so one footprint reads as two or three different buildings.
 const pool=[...SITE_MODELS.single,...SITE_MODELS.tall,...SITE_MODELS.wide].filter(have);
 const weights=Array.from({length:best.cols},()=>.55+r()*.9),wsum=weights.reduce((a,b)=>a+b,0);
 let edge=-site.w/2;const cols=weights.map(v=>{const cw=site.w*v/wsum,cx=edge+cw/2;edge+=cw;return {cw,cx,n:best.cols>1?pool[Math.floor(r()*pool.length)]:best.n,hy:best.cols>1?(upper?.8+r()*.45:.62+r()*.75):1};});
 for(let c=0;c<best.cols;c++)for(let w=0;w<best.rows;w++){
  const col=cols[c],n=col.n,m=models[n];
  const sx=col.cw/m.size[0],sz=site.d/best.rows/m.size[2],span=upper?Math.max(.4,m.size[1]-STOREY):m.size[1],sy=H/span*col.hy;
  const lx=col.cx,lz=(best.rows>1?(w?-1:1)*site.d/4:0)*front,back=best.rows>1&&w===1;
  out.push({model:n,x:site.x+lx,y:base,z:site.z+lz,rot:back?rot+Math.PI:rot,sx,sy,sz,cut:upper?STOREY:0,height:base+span*sy,tint:KENNEY_TINTS[Math.floor(r()*KENNEY_TINTS.length)],site:site.id||null});}
 return out;
}

// Lit windows at night: the kit's blue glass swatches become an emissive mask, and
// a world-space hash switches roughly half the windows on.
export const GLASS_COLOURS=Object.freeze([[103,148,217],[208,232,255]]);
export function glassMask(data){const out=new Uint8ClampedArray(data.length);for(let i=0;i<data.length;i+=4){const r=data[i],g=data[i+1],b=data[i+2];const v=(b>200&&b-r>=35&&g-r>=15)||GLASS_COLOURS.some(c=>Math.abs(r-c[0])<10&&Math.abs(g-c[1])<10&&Math.abs(b-c[2])<10)?255:0;out[i]=out[i+1]=out[i+2]=v;out[i+3]=255;}return out;}
function windowGlow(map){
 const img=map?.image;if(!img||typeof document==='undefined')return null;
 try{const w=img.width,h=img.height,cv=document.createElement('canvas');cv.width=w;cv.height=h;const cx=cv.getContext('2d');cx.drawImage(img,0,0);const id=cx.getImageData(0,0,w,h);const gm=glassMask(id.data);let lit=0;for(let i=0;i<gm.length;i+=4)lit+=gm[i]>0;id.data.set(gm);cx.putImageData(id,0,0);
  const t=new THREE.CanvasTexture(cv);t.flipY=map.flipY;t.colorSpace=THREE.SRGBColorSpace;t.magFilter=map.magFilter;t.minFilter=map.minFilter;t.userData.lit=lit/(w*h);return t;}catch(e){return null;}
}
// v163 grime: world-space dirt rising from the pavement, rain streaks under each
// storey and blotchy stains, so the clean kit reads weathered and dodgy.
export const GRIME_GLSL=`float kH(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float kN(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(kH(i),kH(i+vec2(1,0)),f.x),mix(kH(i+vec2(0,1)),kH(i+vec2(1,1)),f.x),f.y);}
vec3 kGrime(vec3 c,vec3 w){float along=w.x+w.z;float blot=kN(w.xz*.31+vec2(w.y*.23,0.))*.6+kN(vec2(along*1.1,w.y*.9))*.4;
 float base=1.-smoothstep(0.,2.4,w.y);float storey=fract(w.y/3.2);
 float streak=smoothstep(.62,.92,kN(vec2(along*2.6,floor(w.y/3.2)*5.3)))*(1.-storey)*.9;
 float g=1.-.30*base*(.55+.45*blot)-.20*streak-.16*smoothstep(.5,.85,blot);
 return mix(c,c*vec3(.88,.82,.72),.55*smoothstep(.35,.8,blot))*g;}`;
// v164 window variety: the same kit window reads as blinds, curtains, boarded,
// grimy-dark or dirty glass per window cell, so neighbouring buildings stop looking cloned.
export const WINDOW_STYLES=Object.freeze(['blinds','curtains','boarded','dark','glass']);
export const WINDOW_GLSL=`#ifdef USE_EMISSIVEMAP
{float kgm=texture2D(emissiveMap,vEmissiveMapUv).r;
 if(kgm>.5){vec3 kc=floor(vKWorld/vec3(2.7,3.1,2.7));float h=fract(sin(dot(kc,vec3(12.9898,78.233,37.719)))*43758.5453);float h2=fract(h*91.7);vec3 g=diffuseColor.rgb;
  if(h<.2){g=mix(vec3(.80,.76,.64),vec3(.56,.53,.45),step(.5,fract(vKWorld.y*7.)));}
  else if(h<.36){vec3 cc=h2<.33?vec3(.6,.22,.2):h2<.66?vec3(.74,.6,.3):vec3(.3,.42,.33);g=cc*(.78+.22*sin((vKWorld.x+vKWorld.z)*14.));}
  else if(h<.44){g=mix(vec3(.55,.42,.28),vec3(.43,.32,.2),step(.5,fract(vKWorld.y*3.5)));}
  else if(h<.56){g=vec3(.11,.13,.14);}
  else{g=mix(g,vec3(.30,.38,.44),.5+.2*h2);}
  diffuseColor.rgb=g;}}
#endif`;
export function nightWindowShader(shader){
 shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vKWorld;').replace('#include <project_vertex>','#include <project_vertex>\nvKWorld=(modelMatrix*vec4(transformed,1.0)).xyz;');
 shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 vKWorld;\n'+GRIME_GLSL).replace('#include <color_fragment>','#include <color_fragment>\n'+WINDOW_GLSL+'\ndiffuseColor.rgb=kGrime(diffuseColor.rgb,vKWorld);').replace('#include <emissivemap_fragment>','#include <emissivemap_fragment>\n{vec3 kc=floor(vKWorld/vec3(2.7,3.1,2.7));totalEmissiveRadiance*=step(.48,fract(sin(dot(kc,vec3(12.9898,78.233,37.719)))*43758.5453));}');
}

export function createKenneyCity({scene,lots=[],sites=[],Loader,urls=KENNEY_URLS}={}){
 const root=new THREE.Group();root.name='Kenney City Kit v164';if(scene)scene.add(root);
 const state={root,ready:false,failed:false,cells:[],placements:[],materials:[],triangles:0,models:null,pendingSites:[...sites],update,build,addSites,onChange:null,facades};
 const mats=new Map();
 const matFor=map=>{if(!mats.has(map)){if(map){map.colorSpace=THREE.SRGBColorSpace;map.anisotropy=4;}
  const glow=windowGlow(map);const m=new THREE.MeshStandardMaterial({map,vertexColors:true,roughness:.82,metalness:0,emissive:glow?0xffcf86:0x000000,emissiveMap:glow,emissiveIntensity:0});
  m.onBeforeCompile=nightWindowShader;m.name='kenney-city-'+mats.size;mats.set(map,m);state.materials.push(m);}return mats.get(map);};
 // Placements are merged per 240 m cell and kit atlas: a handful of draw calls.
 function bake(placements,tag){
  const models=state.models,cells=new Map();
  for(const p of placements){state.placements.push(p);const mat=matFor(models[p.model].material?.map||null),k=Math.floor(p.x/KENNEY_CELL)+','+Math.floor(p.z/KENNEY_CELL)+','+mat.name;if(!cells.has(k))cells.set(k,{mat,list:[]});cells.get(k).list.push(p);}
  for(const [k,{mat,list}] of cells){const g=mergePlacements(list,models);const m=new THREE.Mesh(g,mat);m.name='Kenney '+tag+' '+k;m.castShadow=true;m.receiveShadow=true;m.matrixAutoUpdate=false;root.add(m);state.triangles+=g.index.count/3;
   const b=g.boundingBox;state.cells.push({mesh:m,cx:(b.min.x+b.max.x)/2,cz:(b.min.z+b.max.z)/2,r:Math.hypot(b.max.x-b.min.x,b.max.z-b.min.z)/2});}
 }
 function addSites(list){if(!state.models){state.pendingSites.push(...list);return state;}
  bake(list.flatMap(site=>placeSite(site,state.models)),'site');state.onChange?.(state);return state;}
 function build(models){
  state.models=models;
  const lp=[];for(const lot of lots){const p=placeLot(lot,models);if(!p)continue;lot.height=p.height;lp.push(p);}
  bake(lp,'city');
  if(state.pendingSites.length){const q=state.pendingSites;state.pendingSites=[];addSites(q);}
  state.ready=true;state.onChange?.(state);return state;
 }
 // World facade boxes for the dodgy dressing (front normal is (-sin rot, -cos rot)).
 function facades(){const M=state.models;if(!M)return [];return state.placements.map(p=>{const m=M[p.model];return {x:p.x,z:p.z,rot:p.rot,w:m.size[0]*p.sx,d:m.size[2]*p.sz,height:p.height,base:p.y||0,upper:!!p.cut,storey:STOREY*p.sy,house:p.model.includes('type'),site:p.site||null};});}
 function update({camera,quality='balanced',night=0}={}){
  const n=Math.max(0,Math.min(1,night));
  for(const m of state.materials){m.color.setScalar(1-.35*n);m.emissiveIntensity=n>.05?.35+1.5*n:0;}
  if(!camera)return;const R=quality==='performance'?250:quality==='high'?320:290,x=camera.position.x,z=camera.position.z;
  for(const c of state.cells)c.mesh.visible=Math.max(0,Math.hypot(x-c.cx,z-c.cz)-c.r)<R;
 }
 if(Loader&&(lots.length||sites.length)){const got=[];let left=urls.length;
  urls.forEach((url,i)=>new Loader().load(url,gltf=>{got[i]=extractModels(gltf.scene);if(--left===0)build(Object.assign({},...got));},undefined,e=>{state.failed=true;console.warn('Kenney city could not load',url,e);if(--left===0)build(Object.assign({},...got.filter(Boolean)));}));}
 return state;
}
