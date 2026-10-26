// v133 static batching. Gummy Bay grew out of thousands of loose meshes added
// straight to the scene (trunks, crowns, posts, kerbs, trims). Each was its own
// draw call. Once the town has loaded, this merges the untouched ones into one
// mesh per material per 64 m cell. Merged sources are watched: if game code
// later moves, hides, re-materials or re-parents one, its whole batch is
// split back into the original meshes, so behaviour never changes.
import * as THREE from './vendor/three.module.min.js';

export const BATCH_CELL=160;
const plain=o=>{for(const k in o.userData)return false;return true;};
export function batchReject(o,scene){
 if(!o?.isMesh)return 'not-mesh';if(o.isInstancedMesh)return 'instanced';if(o.isSkinnedMesh)return 'skinned';if(o.children.length)return 'children';if(!o.visible)return 'hidden';
 const m=o.material;if(!m||Array.isArray(m))return 'multi-material';if(m.transparent||m.opacity<1)return 'transparent';
 const g=o.geometry;if(!g.attributes.normal)return 'no-normal';if(o.onBeforeRender!==THREE.Object3D.prototype.onBeforeRender)return 'onBeforeRender';if(!plain(o))return 'userData:'+Object.keys(o.userData).join(',');return '';
}
export function batchCandidate(o,scene){
 if(!o?.isMesh||o.parent!==scene||o.isInstancedMesh||o.isSkinnedMesh||o.children.length||!o.visible)return false;
 const m=o.material;if(!m||Array.isArray(m)||m.transparent||m.isShaderMaterial||m.isRawShaderMaterial||m.opacity<1)return false;
 const g=o.geometry;if(!g?.attributes?.position||!g.attributes.normal||g.morphAttributes&&Object.keys(g.morphAttributes).length)return false;
 if(o.onBeforeRender!==THREE.Object3D.prototype.onBeforeRender||o.renderOrder)return false;
 return plain(o);
}
// Opted-in groups (userData.batchStatic) contribute their static descendants;
// anything under a userData.noBatch node (rideable/animated parts, LODs) is left alone.
export function groupCandidate(o,scene){
 if(!o?.isMesh||o.isInstancedMesh||o.isSkinnedMesh||o.children.length||!o.visible||o.parent===scene)return false;
 let opted=false;for(let a=o.parent;a&&a!==scene;a=a.parent){if(!a.visible||a.userData.noBatch||a.isLOD)return false;if(a.userData.batchStatic)opted=true;}
 if(!opted)return false;
 const m=o.material;if(!m||Array.isArray(m)||m.transparent||m.isShaderMaterial||m.isRawShaderMaterial||m.opacity<1)return false;
 const g=o.geometry;if(!g?.attributes?.position||!g.attributes.normal||g.morphAttributes&&Object.keys(g.morphAttributes).length)return false;
 if(o.onBeforeRender!==THREE.Object3D.prototype.onBeforeRender||o.renderOrder)return false;
 return plain(o);
}
export function groupPieces(scene){const out=[];for(const c of scene.children)if(c.userData?.batchStatic)c.traverse(o=>{if(groupCandidate(o,scene))out.push(o);});return out;}
// Tiled surfaces (brick, render, iron...) are cloned per wall only to set a
// texture repeat. Walls sharing the same image and look can share one material
// once the repeat is baked into their UVs.
const hex=c=>c?c.getHexString():'-';
export function sharedTextureKey(m){
 const t=m.map;
 if(!t||!m.isMeshStandardMaterial||!t.source||t.wrapS!==THREE.RepeatWrapping||t.wrapT!==THREE.RepeatWrapping)return '';
 if(m.emissiveMap||m.normalMap||m.roughnessMap||m.metalnessMap||m.aoMap||m.alphaMap||m.bumpMap||m.lightMap||m.envMap||m.vertexColors||m.flatShading||m.wireframe)return '';
 if(m.onBeforeCompile!==THREE.Material.prototype.onBeforeCompile)return '';
 return ['tex',t.source.uuid,t.colorSpace,hex(m.color),hex(m.emissive),m.emissiveIntensity,m.roughness,m.metalness,m.side,m.alphaTest,m.depthWrite,m.depthTest,m.fog].join(':');
}
// Plain coloured solids differ only by colour: bake it into vertex colours so a
// whole block of trims, posts and crowns shares one material. Emissive or
// mapped looks keep their own material (night lighting drives those).
const qr=r=>r<.6?Math.round(r*5)/5:r<.86?.8:1,qm=m=>Math.round(m*10)/10;
export function vertexColorKey(m){
 if(!m.isMeshStandardMaterial||m.isMeshPhysicalMaterial||m.map||m.vertexColors||m.emissiveMap||m.normalMap||m.roughnessMap||m.metalnessMap||m.aoMap||m.alphaMap||m.bumpMap||m.lightMap||m.envMap||m.wireframe)return '';
 if(m.emissive.getHex()!==0&&m.emissiveIntensity>0)return '';
 if(m.onBeforeCompile!==THREE.Material.prototype.onBeforeCompile||m.alphaTest)return '';
 // Roughness/metalness are quantised (0.88 vs 0.92 reads the same) and flat
 // shading is baked into face normals, so many modules can share one material.
 return ['vc',qr(m.roughness),qm(m.metalness),m.side,m.fog,m.depthWrite,m.depthTest,m.polygonOffset?m.polygonOffsetFactor+'/'+m.polygonOffsetUnits:0].join(':');
}
const look=m=>[m.color?.getHex(),m.emissive?.getHex(),m.emissiveIntensity,m.roughness,m.metalness,m.opacity,m.transparent,m.visible].join(',');
export const MAX_INSTANCED_VERTS=40000;
const instVersions=o=>[o.instanceMatrix.version,o.instanceColor?.version??-1,o.count].join(',');
export function instancedCandidate(o,scene){
 if(!o?.isInstancedMesh||o.parent!==scene||o.children.length||!o.visible||!o.frustumCulled||o.count<1)return false;
 const m=o.material;if(!m||Array.isArray(m)||m.transparent||m.opacity<1||!vertexColorKey(m))return false;
 const g=o.geometry;if(!g?.attributes?.position||!g.attributes.normal||g.attributes.color||g.morphAttributes&&Object.keys(g.morphAttributes).length)return false;
 if(o.onBeforeRender!==THREE.Object3D.prototype.onBeforeRender||o.renderOrder)return false;
 const verts=(g.index?g.index.count:g.attributes.position.count)*o.count;if(verts>MAX_INSTANCED_VERTS)return false;
 return plain(o);
}
// One "piece" per mesh, or per instance of a static InstancedMesh.
function piecesOf(o,instanced){
 const g=o.geometry,m=o.material,hasUV=!!g.attributes.uv;
 const shareKey=!instanced&&hasUV&&sharedTextureKey(m)||!g.attributes.color&&vertexColorKey(m)||'';
 const out=[],mat=new THREE.Matrix4(),col=new THREE.Color(),pos=new THREE.Vector3();
 const n=instanced?o.count:1;
 for(let i=0;i<n;i++){
  if(instanced){o.getMatrixAt(i,mat);mat.premultiply(o.matrixWorld);}else mat.copy(o.matrixWorld);
  if(instanced&&Math.abs(mat.determinant())<1e-12)continue; // zero-scaled = hidden slot
  col.copy(m.color||col.set(1,1,1));if(instanced&&o.instanceColor){const c=new THREE.Color();o.getColorAt(i,c);col.multiply(c);}
  pos.setFromMatrixPosition(mat);
  const material=shareKey?shareKey:m.uuid;
  out.push({source:o,matrix:mat.clone(),color:col.clone(),material:m,key:[material,o.castShadow?1:0,o.receiveShadow?1:0,hasUV&&!shareKey.startsWith('vc')?1:0,g.attributes.color?1:0,Math.floor(pos.x/BATCH_CELL),Math.floor(pos.z/BATCH_CELL)].join('|'),shareKey});
 }
 return out;
}
function mergeInto(pieces,bakeUV,bakeColor){
 const parts=pieces.map(p=>{const src=p.source.geometry;let g=src.index?src.toNonIndexed():src.clone();g.applyMatrix4(p.matrix);
  if(p.matrix.determinant()<0){const a=g.attributes.position;for(const n of Object.keys(g.attributes)){const at=g.attributes[n];for(let i=0;i<at.count;i+=3)for(let c=0;c<at.itemSize;c++){const t=at.getComponent(i+1,c);at.setComponent(i+1,c,at.getComponent(i+2,c));at.setComponent(i+2,c,t);}}}
  if(bakeColor&&p.material.flatShading){g.deleteAttribute('normal');g.computeVertexNormals();}
  if(bakeUV&&g.attributes.uv){const t=p.material.map;t.updateMatrix();const uv=g.attributes.uv,v=new THREE.Vector2();for(let i=0;i<uv.count;i++){v.fromBufferAttribute(uv,i).applyMatrix3(t.matrix);uv.setXY(i,v.x,v.y);}}
  if(bakeColor){const c=p.color,n=g.attributes.position.count,a=new Float32Array(n*3);for(let i=0;i<n;i++){a[i*3]=c.r;a[i*3+1]=c.g;a[i*3+2]=c.b;}g.setAttribute('color',new THREE.BufferAttribute(a,3));}
  return g;});
 if(bakeColor)for(const g of parts)if(!g.attributes.uv)g.setAttribute('uv',new THREE.BufferAttribute(new Float32Array(g.attributes.position.count*2),2));
 const names=['position','normal','uv','color'].filter(n=>parts.every(g=>g.attributes[n]));
 const out=new THREE.BufferGeometry();
 for(const n of names){const size=parts[0].attributes[n].itemSize;if(parts.some(g=>g.attributes[n].itemSize!==size))continue;
  const total=parts.reduce((t,g)=>t+g.attributes[n].count*size,0),arr=new Float32Array(total);let off=0;
  for(const g of parts){const a=g.attributes[n];for(let i=0;i<a.count;i++)for(let c=0;c<size;c++)arr[off++]=a.getComponent(i,c);}
  out.setAttribute(n,new THREE.BufferAttribute(arr,size));}
 for(const g of parts)g.dispose();
 out.computeBoundingSphere();out.computeBoundingBox();return out;
}
export function createStaticBatcher(scene,{minGroup=2,checkEvery=45}={}){
 const batches=[],watched=new Map();let frame=0,splits=0,pendingInstanced=null,builtAt=0;
 const snapshot=o=>[...o.position.toArray(),...o.quaternion.toArray(),...o.scale.toArray()];
 function release(s){
  const w=watched.get(s);if(!w)return;watched.delete(s);
  const v=s.__batchVisible,m=s.__batchMaterial;delete s.visible;delete s.material;s.visible=v;s.material=m;delete s.__batchVisible;delete s.__batchMaterial;
  const home=s.__batchParent||scene;delete s.__batchParent;if(!s.parent)home.add(s);
  for(const b of w.batches)split(b);
 }
 function split(b){
  if(b.split)return;b.split=true;splits++;
  scene.remove(b.mesh);b.mesh.geometry.dispose();if(b.ownMaterial){b.mesh.material.map?.dispose();b.mesh.material.dispose();}
  for(const s of b.sources)release(s);
 }
 function watch(s,b){
  let w=watched.get(s);
  if(!w){w={batches:[],snap:snapshot(s),look:look(s.material),inst:s.isInstancedMesh?instVersions(s):''};watched.set(s,w);
   s.__batchParent=s.parent||scene;s.parent?.remove(s);s.__batchVisible=s.visible;s.__batchMaterial=s.material;
   Object.defineProperty(s,'visible',{configurable:true,enumerable:true,get(){return this.__batchVisible;},set(v){if(v!==this.__batchVisible){this.__batchVisible=v;release(this);}}});
   Object.defineProperty(s,'material',{configurable:true,enumerable:true,get(){return this.__batchMaterial;},set(v){if(v!==this.__batchMaterial){this.__batchMaterial=v;release(this);}}});
  }
  w.batches.push(b);
 }
 function mergeGroups(objects){
  scene.updateMatrixWorld(true);
  const groups=new Map();
  for(const o of objects)for(const p of piecesOf(o,o.isInstancedMesh)){if(!groups.has(p.key))groups.set(p.key,[]);groups.get(p.key).push(p);}
  for(const pieces of groups.values()){
   if(pieces.length<minGroup)continue;
   const p0=pieces[0],m0=p0.material,distinct=new Set(pieces.map(p=>p.material)).size>1;
   const shared=p0.shareKey.startsWith('tex')&&distinct;
   const vc=p0.shareKey.startsWith('vc')&&(distinct||pieces.some(p=>p.source.isInstancedMesh));
   let material=m0;
   if(shared){material=m0.clone();material.map=m0.map.clone();material.map.repeat.set(1,1);material.map.offset.set(0,0);material.map.center.set(0,0);material.map.rotation=0;material.map.needsUpdate=true;material.name='Static batch shared surface';}
   if(vc){material=new THREE.MeshStandardMaterial({vertexColors:true,roughness:qr(m0.roughness),metalness:qm(m0.metalness),side:m0.side,fog:m0.fog,depthWrite:m0.depthWrite,depthTest:m0.depthTest,polygonOffset:m0.polygonOffset,polygonOffsetFactor:m0.polygonOffsetFactor,polygonOffsetUnits:m0.polygonOffsetUnits});material.name='Static batch colours';}
   const mesh=new THREE.Mesh(mergeInto(pieces,shared,vc),material);
   mesh.name='Static batch';mesh.castShadow=p0.source.castShadow;mesh.receiveShadow=p0.source.receiveShadow;mesh.matrixAutoUpdate=false;
   const sources=[...new Set(pieces.map(p=>p.source))];mesh.userData.staticBatch=pieces.length;mesh.userData.batchKey=p0.key;
   const b={mesh,sources,split:false,ownMaterial:!!(shared||vc)};
   for(const s of sources)watch(s,b);
   scene.add(mesh);batches.push(b);
  }
 }
 function build(){
  scene.updateMatrixWorld(true);
  mergeGroups([...scene.children].filter(o=>batchCandidate(o,scene)).concat(groupPieces(scene)));
  // Instanced meshes are only merged once they have stayed still for a while.
  pendingInstanced=new Map([...scene.children].filter(o=>instancedCandidate(o,scene)).map(o=>[o,instVersions(o)]));
  frame=0;builtAt=performance.now();return api.stats();
 }
 const sphere=new THREE.Sphere();
 // Batches entirely past the fog's far plane render as flat fog colour; skip them.
 function fogCull(camera){
  const fog=scene.fog;if(!camera||!fog||!fog.isFog)return;const far=fog.far+4,cp=camera.position;
  for(const b of batches){if(b.split)continue;sphere.copy(b.mesh.geometry.boundingSphere);b.mesh.visible=sphere.center.distanceTo(cp)-sphere.radius<far;}
 }
 function update(camera){
  ++frame;fogCull(camera);
  if(pendingInstanced&&frame>=4&&(frame>=90||performance.now()-builtAt>2000)){const ready=[...pendingInstanced].filter(([o,v])=>o.parent===scene&&instVersions(o)===v&&instancedCandidate(o,scene)).map(([o])=>o);pendingInstanced=null;mergeGroups(ready);}
  if(frame%checkEvery)return;
  for(const [s,w] of [...watched]){
   if(!watched.has(s))continue;
   if(s.parent||look(s.__batchMaterial)!==w.look||(w.inst&&instVersions(s)!==w.inst)){release(s);continue;}
   const now=snapshot(s);if(now.some((v,j)=>Math.abs(v-w.snap[j])>1e-6))release(s);
  }
 }
 const api={build,update,splitAll(){for(const b of batches)split(b);},
  stats:()=>{const live=batches.filter(b=>!b.split);return {batches:live.length,merged:live.reduce((n,b)=>n+b.sources.length,0),pieces:live.reduce((n,b)=>n+b.mesh.userData.staticBatch,0),splits,pending:!!pendingInstanced};}};
 return api;
}
