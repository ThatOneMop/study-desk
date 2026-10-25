import * as THREE from './vendor/three.module.min.js';
export function dressPayphone(model){
 const group=new THREE.Group();group.name='Payphone steel hood and handset cord';model.add(group);
 const steel=new THREE.MeshStandardMaterial({color:0x5b6363,roughness:.6,metalness:.55}),black=new THREE.MeshStandardMaterial({color:0x1f2827,roughness:.8}),paper=new THREE.MeshStandardMaterial({color:0xc2bba6,roughness:.95});
 const add=(x,y,z,w,h,d,m)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);group.add(o);return o;};
 for(const side of [-1,1])add(side*.47,1.85,.17,.06,1.08,.55,steel);
 add(0,2.43,.17,1,.08,.58,steel);add(0,1.18,.34,.87,.06,.26,steel);
 add(.18,1.96,.455,.19,.038,.018,black);add(.18,1.79,.455,.19,.07,.018,steel);add(.21,1.42,.455,.30,.22,.016,paper);
 const points=[];for(let i=0;i<100;i++){const t=i/99;points.push(new THREE.Vector3(-.24+Math.sin(t*Math.PI*22)*.018,1.9-t*.48,.47+Math.cos(t*Math.PI*22)*.018));}
 const cord=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),100,.012,5,false),black);group.add(cord);
 return group;
}
