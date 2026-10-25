import * as THREE from './vendor/three.module.min.js';
import {districtArchitectureProfile} from './district-architecture.mjs';
// Stage 2: all-sided facades, structural roof edges, rainwater goods and lit windows.
export function graphicBatch(scene,name,items,geometry=new THREE.BoxGeometry(1,1,1),options={}){
 const mesh=new THREE.InstancedMesh(geometry,new THREE.MeshStandardMaterial({color:0xffffff,roughness:.82,...options}),Math.max(1,items.length)),o=new THREE.Object3D(),c=new THREE.Color();
 mesh.name=name;mesh.count=items.length;mesh.userData.parts=items;
 items.forEach((p,i)=>{o.position.set(p.x,p.y,p.z);o.rotation.set(p.rx||0,p.ry||0,p.rz||0);o.scale.set(p.w,p.h,p.d);o.updateMatrix();mesh.setMatrixAt(i,o.matrix);mesh.setColorAt(i,c.setHex(p.color));});
 mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;mesh.computeBoundingSphere();mesh.receiveShadow=true;scene.add(mesh);return mesh;
}
export function architectureDressing(sites){
 const structure=[],glass=[],trim=[],plant=[];
 const part=(list,x,y,z,w,h,d,color,role,site)=>list.push({x,y,z,w,h,d,color,role,site});
 for(const [i,site] of sites.entries()){
  const p=districtArchitectureProfile(site,i);if(!p)continue;
  const upper=p.floors>1?p.upperScale:1,tw=p.w*upper,td=p.d*upper;
  for(const side of [-1,1]){
   part(structure,p.x,p.height+.2,p.z+side*td/2,tw+.25,.18,.14,0x354b4b,'gutter',p.id);
   part(structure,p.x+side*tw/2,p.height+.2,p.z,.14,.18,td+.25,0x354b4b,'roof-edge',p.id);
   // Drainpipes sit on existing mass, never in a walkable approach.
   part(structure,p.x+side*(p.w/2-.12),1.5,p.z-p.d/2-.05,.095,2.9,.095,0x617b78,'drain',p.id);
  }
  // Side and rear elevations replace blank slabs with full floor/bay rhythms.
  for(const axis of ['x','z'])for(const side of [-1,1]){
   if(axis===p.front.axis&&side===p.front.sign)continue;
   for(let floor=0;floor<p.floors;floor++){
    const scale=floor?upper:1,span=(axis==='z'?p.w:p.d)*scale,depth=(axis==='z'?p.d:p.w)*scale;
    const bays=Math.max(2,Math.floor(span/3.2));
    for(let b=0;b<bays;b++){
     const along=(b-(bays-1)/2)*span/(bays+1),y=1.8+floor*3.05;
     const face=(list,a,yy,w,h,d,color,role,offset=0)=>part(list,p.x+(axis==='z'?a:side*(depth/2+.025+offset)),yy,p.z+(axis==='x'?a:side*(depth/2+.025+offset)),axis==='z'?w:d,h,axis==='z'?d:w,color,role,p.id);
     face(glass,along,y,1.22,1.25,.04,i%3?0x9ba88b:0xc2ac79,'window');
     for(const s of [-1,1])face(trim,along+s*.67,y,.1,1.47,.11,p.palette.trim,'jamb',.04);
     for(const s of [-1,1])face(trim,along,y+s*.69,1.42,.09,.13,p.palette.trim,'sill',.04);
     face(trim,along,y,.055,1.28,.08,0x3e5554,'mullion',.05);
     if(p.archetype==='weatherboard-house'&&floor===0){
      face(structure,along,y-.91,1.4,.25,.30,0x79664b,'window-box',.14);
      face(plant,along,y-.72,1.26,.22,.25,0x6f884c,'window-herbs',.14);
     }
    }
   }
  }
  // Material-specific courses kept inside original solid footprints.
  for(let k=1;k<=5;k++){
   const y=k*.48;
   part(trim,p.x,y,p.z-p.d/2-.025,p.w,.025,.025,i%5===2?0xb1b09a:0x7c8274,'wall-course',p.id);
  }
 }
 return {structure,glass,trim,plant};
}
export function createArchitectureOverhaul(scene,sites){
 const parts=architectureDressing(sites),groups=Object.entries(parts).map(([name,items])=>graphicBatch(scene,'Coastal architecture / '+name,items,undefined,name==='glass'?{roughness:.28,metalness:.18,emissive:0xffbb72,emissiveIntensity:0}:{}));
 return {parts,groups,update(night,quality){groups[1].material.emissiveIntensity=Math.max(0,Math.min(1,night))*.42;groups.forEach((g,i)=>{g.visible=quality!=='performance'||i<2;g.castShadow=quality==='high'&&i===0;});}};
}
