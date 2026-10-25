import * as THREE from './vendor/three.module.min.js';
export const WALKABLE_HILLS=Object.freeze([{x:-190,z:-64,r:16,h:2.8},{x:190,z:-64,r:16,h:3.4}]);
export function terrainHeight(x,z){
 if(!Number.isFinite(x)||!Number.isFinite(z))return 0;
 let y=0;for(const p of WALKABLE_HILLS){const t=Math.hypot(x-p.x,z-p.z)/p.r;if(t<1)y=Math.max(y,p.h*(1-t*t)**2);}return y;
}
function grid(width,depth,nx,nz,height){
 const g=new THREE.PlaneGeometry(width,depth,nx,nz);g.rotateX(-Math.PI/2);const p=g.attributes.position;
 for(let i=0;i<p.count;i++)p.setY(i,height(p.getX(i),p.getZ(i)));p.needsUpdate=true;g.computeVertexNormals();return g;
}
export function createGrittyTerrain(scene,bounds,groundMaterial){
 const hills=[];
 for(const h of WALKABLE_HILLS){const g=grid(h.r*2,h.r*2,48,48,(x,z)=>terrainHeight(x+h.x,z+h.z)+.006);const m=new THREE.Mesh(g,groundMaterial);m.position.set(h.x,0,h.z);m.name='Walkable hillside';m.receiveShadow=true;scene.add(m);hills.push(m);}
 // The river is beyond the west play boundary; raised banks meet the town edge.
 const points=[],indices=[],colors=[],steps=160,start=bounds.minZ-30,end=110;
 const riverX=z=>-302+Math.sin(z*.025)*4;
 for(let i=0;i<=steps;i++){const z=start+(end-start)*i/steps,x=riverX(z);for(const [offset,y] of [[-24,5],[-14,2.2],[-6,.06],[6,.06],[14,1.7],[18,.02]]){points.push(x+offset,y,z);const c=new THREE.Color(y>2?0x535b48:0x62664d);colors.push(c.r,c.g,c.b);}}
 for(let i=0;i<steps;i++)for(const j of [0,1,3,4]){const a=i*6+j,b=a+6;indices.push(a,b,a+1,b,b+1,a+1);}
 const bankGeo=new THREE.BufferGeometry();bankGeo.setAttribute('position',new THREE.Float32BufferAttribute(points,3));bankGeo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));bankGeo.setIndex(indices);bankGeo.computeVertexNormals();const banks=new THREE.Mesh(bankGeo,new THREE.MeshStandardMaterial({vertexColors:true,roughness:1,side:THREE.DoubleSide}));banks.name='Winding river banks';banks.receiveShadow=true;scene.add(banks);
 const wp=[],wi=[];for(let i=0;i<=steps;i++){const z=start+(end-start)*i/steps,x=riverX(z);wp.push(x-6,.035,z,x+6,.035,z);if(i<steps){const a=i*2;wi.push(a,a+2,a+1,a+2,a+3,a+1);}}
 const wg=new THREE.BufferGeometry();wg.setAttribute('position',new THREE.Float32BufferAttribute(wp,3));wg.setIndex(wi);wg.computeVertexNormals();
 const time={value:0},riverMat=new THREE.ShaderMaterial({uniforms:{t:time},side:THREE.DoubleSide,fog:false,vertexShader:'varying vec3 p;void main(){p=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying vec3 p;uniform float t;void main(){float r=sin(p.z*2.-t*1.2+sin(p.x*.8))*.5+.5;vec3 c=mix(vec3(.075,.12,.12),vec3(.19,.26,.23),r*.38);gl_FragColor=vec4(c,1.);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}'});
 const river=new THREE.Mesh(wg,riverMat);river.name='Westbank river';scene.add(river);
 const ridgeGeo=grid(760,110,100,20,(x,z)=>Math.max(0,Math.sin((z+55)/110*Math.PI))*(11+12*Math.sin(x*.018)**2)+2*Math.sin(x*.05)**2);
 const ridge=new THREE.Mesh(ridgeGeo,groundMaterial);ridge.position.set(0,0,bounds.minZ-66);ridge.name='Northern hill country';ridge.receiveShadow=true;scene.add(ridge);
 return {hills,banks,river,ridge,update(now){time.value=Number.isFinite(now)?now:0;}};
}
