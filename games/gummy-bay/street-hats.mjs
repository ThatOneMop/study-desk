import * as THREE from './vendor/three.module.min.js';
const cap=new THREE.SphereGeometry(.38,20,12,0,Math.PI*2,0,Math.PI/2),brim=new THREE.SphereGeometry(.5,16,8),bucket=new THREE.CylinderGeometry(.28,.37,.28,20),beanie=new THREE.SphereGeometry(.37,20,14),materials=new Map();
export function addStreetHat(head,id,isCop=false){
 if(!head||isCop||![0,2,4].includes(id%6))return null;
 const style=id%6,color=[0x525d42,0x5e4f47,0x455b67][Math.floor(style/2)];
 if(!materials.has(color))materials.set(color,new THREE.MeshStandardMaterial({color,roughness:.92}));const material=materials.get(color),parts=[];
 const add=(geo,x,y,z,sx,sy,sz)=>{const m=new THREE.Mesh(geo,material);m.name='Street hat';m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=false;head.add(m);parts.push(m);};
 if(style===0){add(beanie,0,.65,.04,1,.67,1);add(brim,0,.55,.04,.78,.12,.75);}
 if(style===2){add(cap,0,.56,.02,1,.70,1);add(brim,0,.56,.25,.78,.06,.63);}
 if(style===4){add(bucket,0,.68,.04,1,1,1);add(brim,0,.54,.04,.98,.075,.93);}
 return {style,parts};
}
