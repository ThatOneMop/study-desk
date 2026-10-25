// Test-only CPU object inventory. Visibility here does not include frustum,
// occlusion, material groups, shadow/AO passes or renderer draw-call accounting.
export function sceneResources(root){
 const objects=new Set(),geometries=new Set(),materials=new Set(),textures=new Set();
 let meshes=0,skinned=0,instanced=0,visibleMeshes=0,visiblePotentialTriangles=0;
 const countTriangles=o=>(o.geometry?.index?.count??o.geometry?.attributes?.position?.count??0)/3*(o.isInstancedMesh?o.count:1);
 const takeTexture=value=>{if(value?.isTexture)textures.add(value);else if(Array.isArray(value))value.forEach(v=>{if(v?.isTexture)textures.add(v);});};
 root.traverse(o=>{
  objects.add(o);if(o.isMesh){meshes++;if(o.isSkinnedMesh)skinned++;if(o.isInstancedMesh)instanced++;}
  if(o.geometry)geometries.add(o.geometry);
  for(const m of Array.isArray(o.material)?o.material:o.material?[o.material]:[]){materials.add(m);Object.values(m).forEach(takeTexture);for(const u of Object.values(m.uniforms??{}))takeTexture(u.value);}
 });
 root.traverseVisible(o=>{if(o.isMesh){visibleMeshes++;visiblePotentialTriangles+=countTriangles(o);}});
 return {objects,geometries,materials,textures,counts:{objects:objects.size,meshes,skinned,instanced,geometries:geometries.size,materials:materials.size,textures:textures.size,visibleMeshes,visiblePotentialTriangles:Math.round(visiblePotentialTriangles)}};
}
