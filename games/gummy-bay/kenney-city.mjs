// v162 Kenney City Kit (Commercial 2.1 and Suburban 2.0, CC0, www.kenney.nl) buildings for the
// generic city lots. Each kit shares one ~12 KB colour atlas, so the whole
// layer is baked into a few merged meshes (one per 160 m cell and kit), not
// one draw call per building. Models are fitted to each lot's footprint and face its street.
import * as THREE from './vendor/three.module.min.js';

export const KENNEY_CELL=160;
// Kenney fronts face -z; the city lots put their street side on local +z.
export const KENNEY_FRONT=Math.PI;
export const KENNEY_MODELS=Object.freeze({
 shop:['building-a','building-b','building-c','building-d','building-e','building-h','building-k'],
 terrace:['building-a','building-b','building-d','building-f','building-g','building-h','building-k'],
 flats:['building-i','building-j','building-l','building-n','building-f','building-g'],
 house:'abcdefghijklmnopqrstu'.split('').map(c=>'building-type-'+c)
});
export const KENNEY_URLS=Object.freeze(['./assets/kenney/city-commercial.glb','./assets/kenney/city-suburban.glb']);
// Soft wall tints so the white kit reads warm and sunny, like a seaside town.
export const KENNEY_TINTS=Object.freeze([0xffffff,0xfde3c8,0xf7d2c4,0xdbe9f6,0xe3f1d8,0xf6ecc4,0xece0f2,0xffffff]);
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
 const m=models[best],sx=lot.w*.96/m.size[0],sz=lot.d*.96/m.size[2],sy=Math.sqrt(sx*sz)*(lot.type==='flats'?1.08:1);
 return {model:best,x:lot.x,y:lot.y||0,z:lot.z,rot:(lot.rot||0)+KENNEY_FRONT,sx,sy,sz,height:m.size[1]*sy,tint:KENNEY_TINTS[Math.floor(r()*KENNEY_TINTS.length)]};
}

export function mergePlacements(placements,models){
 let vc=0,ic=0;for(const p of placements){const m=models[p.model];vc+=m.pos.length/3;ic+=m.index.length;}
 const pos=new Float32Array(vc*3),nor=new Float32Array(vc*3),uv=new Float32Array(vc*2),col=new Float32Array(vc*3),index=new Uint32Array(ic);
 let vo=0,io=0;const tint=new THREE.Color();
 for(const p of placements){const m=models[p.model],n=m.pos.length/3,c=Math.cos(p.rot),s=Math.sin(p.rot);tint.setHex(p.tint);
  for(let i=0;i<n;i++){const x=m.pos[i*3]*p.sx,y=m.pos[i*3+1]*p.sy,z=m.pos[i*3+2]*p.sz,o=(vo+i)*3;
   pos[o]=p.x+x*c+z*s;pos[o+1]=p.y+y;pos[o+2]=p.z-x*s+z*c;
   let nx=m.nor[i*3]/p.sx,ny=m.nor[i*3+1]/p.sy,nz=m.nor[i*3+2]/p.sz;const l=Math.hypot(nx,ny,nz)||1;nx/=l;ny/=l;nz/=l;
   nor[o]=nx*c+nz*s;nor[o+1]=ny;nor[o+2]=-nx*s+nz*c;uv[(vo+i)*2]=m.uv[i*2];uv[(vo+i)*2+1]=m.uv[i*2+1];col[o]=tint.r;col[o+1]=tint.g;col[o+2]=tint.b;}
  for(let i=0;i<m.index.length;i++)index[io+i]=m.index[i]+vo;vo+=n;io+=m.index.length;}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('normal',new THREE.BufferAttribute(nor,3));g.setAttribute('uv',new THREE.BufferAttribute(uv,2));g.setAttribute('color',new THREE.BufferAttribute(col,3));
 g.setIndex(new THREE.BufferAttribute(index,1));g.computeBoundingSphere();g.computeBoundingBox();return g;
}

export function createKenneyCity({scene,lots=[],Loader,urls=KENNEY_URLS}={}){
 const root=new THREE.Group();root.name='Kenney City Kit v162';if(scene)scene.add(root);
 const state={root,ready:false,failed:false,cells:[],placements:[],triangles:0,update,build};
 function build(models){
  // one material per kit atlas (Commercial, Suburban)
  const mats=new Map();state.materials=[];
  const matFor=map=>{if(!mats.has(map)){if(map){map.colorSpace=THREE.SRGBColorSpace;map.anisotropy=4;}const m=new THREE.MeshStandardMaterial({map,vertexColors:true,roughness:.82,metalness:0});m.name='kenney-city-'+mats.size;mats.set(map,m);state.materials.push(m);}return mats.get(map);};
  const cells=new Map();
  for(const lot of lots){const p=placeLot(lot,models);if(!p)continue;lot.height=p.height;state.placements.push(p);const mat=matFor(models[p.model].material?.map||null),k=Math.floor(p.x/KENNEY_CELL)+','+Math.floor(p.z/KENNEY_CELL)+','+mat.name;if(!cells.has(k))cells.set(k,{mat,list:[]});cells.get(k).list.push(p);}
  for(const [k,{mat,list}] of cells){const g=mergePlacements(list,models);const m=new THREE.Mesh(g,mat);m.name='Kenney city '+k;m.castShadow=true;m.receiveShadow=true;m.matrixAutoUpdate=false;root.add(m);state.triangles+=g.index.count/3;
   const b=g.boundingBox;state.cells.push({mesh:m,cx:(b.min.x+b.max.x)/2,cz:(b.min.z+b.max.z)/2,r:Math.hypot(b.max.x-b.min.x,b.max.z-b.min.z)/2});}
  state.ready=true;return state;
 }
 function update({camera,quality='balanced',night=0}={}){
  for(const m of state.materials||[])m.color.setScalar(1-.35*Math.max(0,Math.min(1,night)));
  if(!camera)return;const R=quality==='performance'?250:quality==='high'?320:290,x=camera.position.x,z=camera.position.z;
  for(const c of state.cells)c.mesh.visible=Math.max(0,Math.hypot(x-c.cx,z-c.cz)-c.r)<R;
 }
 if(Loader&&lots.length){const got=[];let left=urls.length;
  urls.forEach((url,i)=>new Loader().load(url,gltf=>{got[i]=extractModels(gltf.scene);if(--left===0)build(Object.assign({},...got));},undefined,e=>{state.failed=true;console.warn('Kenney city could not load',url,e);if(--left===0)build(Object.assign({},...got.filter(Boolean)));}));}
 return state;
}
