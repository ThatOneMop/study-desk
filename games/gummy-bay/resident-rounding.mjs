import * as THREE from './vendor/three.module.min.js';
// Rebuild the core skull with a tapered jaw and cheek plane while
// retaining facial geometry, original skin weights and all animation clips.
export function roundResidentAsset(gltf){
 if(gltf.scene.userData.roundedResidents)return;gltf.scene.userData.roundedResidents=true;
 refineResidentLimbs(gltf.scene);
 gltf.scene.traverse(mesh=>{
  if(!mesh.isSkinnedMesh||mesh.material?.name!=='Skin')return;
  const old=mesh.geometry,index=old.index,position=old.attributes.position,skin=old.attributes.skinIndex,weights=old.attributes.skinWeight;
  if(!skin||!weights)return;
  const isCore=i=>{const x=position.getX(i),y=position.getY(i),z=position.getZ(i);return y>=1.499&&y<=2.161&&Math.abs(x)<=.381&&z<=.301&&[1.50,1.55,1.68,1.92,2.08,2.16].some(h=>Math.abs(y-h)<.001);};
  const keep=[];let headSample=-1,removed=0;
  for(let i=0;i<(index?.count??position.count);i+=3){const ids=[0,1,2].map(j=>index?index.getX(i+j):i+j);if(ids.every(isCore)){headSample=ids[0];removed++;}else {const protrusion=ids.every(id=>{const x=position.getX(id),y=position.getY(id),z=position.getZ(id);return y>1.664&&y<1.94&&z>.22&&Math.abs(x)<.30;});if(!protrusion)keep.push(...ids);}}
  if(removed<20||headSample<0)return;
  let sphere=new THREE.SphereGeometry(1,20,16);sphere.scale(.315,.38,.285);const skull=sphere.attributes.position;
  for(let v=0;v<skull.count;v++){
   const y=skull.getY(v),jaw=Math.max(0,Math.min(1,(-y-.02)/.28));
   skull.setX(v,skull.getX(v)*(1-jaw*.10));
   skull.setZ(v,skull.getZ(v)*(1-jaw*.06));
  }
  sphere.computeVertexNormals();sphere=sphere.toNonIndexed();sphere.translate(0,1.825,.005);const n=sphere.attributes.position.count;
  const g=new THREE.BufferGeometry();
  for(const [name,a] of Object.entries(old.attributes)){
   const values=new a.array.constructor((keep.length+n)*a.itemSize);
   keep.forEach((id,i)=>{for(let c=0;c<a.itemSize;c++)values[i*a.itemSize+c]=a.array[id*a.itemSize+c];});
   for(let i=0;i<n;i++)for(let c=0;c<a.itemSize;c++){
    const src=sphere.attributes[name];let v=0;
    if(src)v=src.array[i*src.itemSize+c]??0;
    else if(name==='skinIndex'||name==='skinWeight'||name==='color')v=a.array[headSample*a.itemSize+c];
    values[(keep.length+i)*a.itemSize+c]=v;
   }
   g.setAttribute(name,new THREE.BufferAttribute(values,a.itemSize,a.normalized));
  }
  for(const [name,targets] of Object.entries(old.morphAttributes))g.morphAttributes[name]=targets.map(a=>{const values=new a.array.constructor((keep.length+n)*a.itemSize);keep.forEach((id,i)=>{for(let c=0;c<a.itemSize;c++)values[i*a.itemSize+c]=a.array[id*a.itemSize+c];});return new THREE.BufferAttribute(values,a.itemSize,a.normalized);});
  const face=g.attributes.position;
  for(let i=0;i<keep.length;i++){
   const x=face.getX(i),y=face.getY(i),z=face.getZ(i);
   if(Math.abs(x)<.09&&y>1.70&&y<1.94&&z>.275)face.setZ(i,.275+(z-.275)*1.22);
   if(Math.abs(x)>.09&&Math.abs(x)<.30&&y>1.664&&y<1.796&&z>.22){face.setZ(i,.245+(z-.245)*.55);face.setY(i,1.73+(y-1.73)*.75);}
  }
  // Preserve smooth skull normals instead of recomputing flat normals on triangles.
  g.morphTargetsRelative=old.morphTargetsRelative;g.computeBoundingBox();g.computeBoundingSphere();g.userData.roundedHead={removedTriangles:removed,newVertices:n};mesh.geometry=g;
 });
}

// Slim the authored balloon-shaped limbs in rest space without changing joint lengths,
// animation tracks, feet or collision. Weighted displacements preserve blended joints.
function refineResidentLimbs(scene){
 const original=new THREE.Vector3(),local=new THREE.Vector3(),result=new THREE.Vector3(),delta=new THREE.Vector3();
 scene.traverse(mesh=>{
  if(!mesh.isSkinnedMesh||!mesh.geometry.attributes.skinIndex)return;
  const geometry=mesh.geometry.clone(),p=geometry.attributes.position,indices=geometry.attributes.skinIndex,weights=geometry.attributes.skinWeight;
  const transforms=mesh.skeleton.bones.map((bone,i)=>{
   const width=/^UpperArm/.test(bone.name)?.64:/^Forearm/.test(bone.name)?.73:/^Thigh/.test(bone.name)?.70:/^Shin/.test(bone.name)?.84:1;
   return width===1?null:{inverse:mesh.skeleton.boneInverses[i],forward:mesh.skeleton.boneInverses[i].clone().invert(),width};
  });
  let changed=0;
  for(let i=0;i<p.count;i++){
   original.fromBufferAttribute(p,i);result.copy(original);let moved=false;
   for(let j=0;j<4;j++){
    const weight=weights.array[i*4+j],transform=transforms[indices.array[i*4+j]];if(!weight||!transform)continue;
    local.copy(original).applyMatrix4(transform.inverse);local.x*=transform.width;local.z*=transform.width;local.applyMatrix4(transform.forward);
    delta.subVectors(local,original).multiplyScalar(weight);result.add(delta);moved=true;
   }
   if(moved){p.setXYZ(i,result.x,result.y,result.z);changed++;}
  }
  if(changed){p.needsUpdate=true;geometry.computeVertexNormals();geometry.computeBoundingBox();geometry.computeBoundingSphere();geometry.userData.refinedLimbVertices=changed;mesh.geometry=geometry;}
 });
}
