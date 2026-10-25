import * as THREE from './vendor/three.module.min.js';
// Scenic terrain remains outside the playable bounds; no changes to navigation.
export function createCoastalBackdrop(scene,bounds){
 const points=[];
 for(let i=0;i<7;i++)for(const side of [-1,1])points.push([side*(bounds.maxX+75),bounds.minZ+25+i*78,30+(i%3)*10]);
 for(let i=0;i<6;i++)points.push([bounds.minX+i*110,bounds.minZ-85,35+(i%3)*8]);
 const mesh=new THREE.InstancedMesh(new THREE.SphereGeometry(1,12,7),new THREE.MeshStandardMaterial({color:0x839792,roughness:1}),points.length);
 const dummy=new THREE.Object3D();points.forEach(([x,z,h],i)=>{dummy.position.set(x,-5,z);dummy.scale.set(62,h,58);dummy.rotation.y=i*.7;dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);mesh.setColorAt(i,new THREE.Color(i%2?0xabb7ae:0x95a69e));});
 mesh.name='Distant coastal hills';mesh.castShadow=false;mesh.receiveShadow=false;mesh.computeBoundingSphere();scene.add(mesh);return mesh;
}
