import * as THREE from './vendor/three.module.min.js';
import {PARKING_BAYS} from './parking-guide.mjs';
import {SHOP_APPROACH_PROFILES} from './shop-approaches.mjs';
import {VERTICAL_TOWN_LAYER} from './vertical-town.mjs';

export const LOGICAL_WEAR_COLLIDERS=Object.freeze([]);
const finite=n=>Number.isFinite(n);
const freezeMark=mark=>Object.freeze(mark);

export function logicalWearMarkValid(mark){
 return !!(mark&&typeof mark.id==='string'&&mark.id&&['footfall','tyre','tread'].includes(mark.kind)&&[mark.x,mark.y,mark.z,mark.w,mark.h,mark.d,mark.ry,mark.color].every(finite)&&mark.w>0&&mark.h>0&&mark.d>0&&mark.h<=.02);
}

export function logicalWearCoversPoint(mark,x,z,margin=0){
 if(!logicalWearMarkValid(mark)||![x,z,margin].every(finite)||margin<0)return true;
 const dx=x-mark.x,dz=z-mark.z,c=Math.cos(mark.ry),s=Math.sin(mark.ry),localX=dx*c-dz*s,localZ=dx*s+dz*c;
 return Math.abs(localX)<mark.w/2+margin&&Math.abs(localZ)<mark.d/2+margin;
}

export function logicalWearMarks({bays=PARKING_BAYS,shops=SHOP_APPROACH_PROFILES,layer=VERTICAL_TOWN_LAYER}={}){
 if(!Array.isArray(bays)||!Array.isArray(shops)||!layer)throw new TypeError('Logical wear needs parking, shop and terrace records.');
 const marks=[];
 for(let i=0;i<shops.length;i++){
  const p=shops[i];if(!p||![p.target?.x,p.target?.z,p.direction?.x,p.direction?.z,p.lateral?.x,p.lateral?.z].every(finite))throw new TypeError('Logical wear needs valid shop approaches.');
  const ry=Math.atan2(p.direction.x,p.direction.z);
  for(const side of [-1,1])marks.push(freezeMark({id:`${p.id}-footfall-${side<0?'left':'right'}`,kind:'footfall',source:p.id,x:p.target.x-p.direction.x*1.35+p.lateral.x*side*.56,y:.091,z:p.target.z-p.direction.z*1.35+p.lateral.z*side*.56,w:.3,h:.012,d:1.8,ry,color:side<0?0x77796d:0x7d7e71}));
 }
 for(let i=0;i<bays.length;i++){
  const bay=bays[i];if(!bay||typeof bay.label!=='string'||![bay.x,bay.z,bay.angle].every(finite))throw new TypeError('Logical wear needs valid parking bays.');
  const c=Math.cos(bay.angle),s=Math.sin(bay.angle);
  for(const side of [-1,1])marks.push(freezeMark({id:`parking-${i}-tyre-${side<0?'left':'right'}`,kind:'tyre',source:bay.label,x:bay.x+c*side*.55,y:.027,z:bay.z-s*side*.55,w:.16,h:.012,d:2.6,ry:bay.angle,color:side<0?0x4c5550:0x515a54}));
 }
 if(![layer.x,layer.width,layer.northStart,layer.northEnd,layer.platformSouth,layer.southEnd,layer.height,layer.steps].every(finite)||layer.steps<1)throw new TypeError('Logical wear needs a valid terrace layer.');
 const run=(layer.northStart-layer.northEnd)/layer.steps,rise=layer.height/layer.steps;
 for(let i=0;i<layer.steps;i++){
  const northHeight=(i+1)*rise,northZ=layer.northStart-run*(i+.5)+run/2-.08;
  marks.push(freezeMark({id:`${layer.id}-north-tread-${i+1}`,kind:'tread',source:layer.id,x:layer.x,y:northHeight+.006,z:northZ,w:5.4,h:.012,d:.11,ry:0,color:i%2?0x8b8978:0x858575}));
  const southHeight=(layer.steps-i)*rise,southZ=layer.platformSouth-run*(i+.5)-run/2+.08;
  marks.push(freezeMark({id:`${layer.id}-south-tread-${i+1}`,kind:'tread',source:layer.id,x:layer.x,y:southHeight+.006,z:southZ,w:5.4,h:.012,d:.11,ry:0,color:i%2?0x8b8978:0x858575}));
 }
 if(!marks.every(logicalWearMarkValid))throw new TypeError('Logical wear produced an invalid mark.');
 return Object.freeze(marks);
}

export const LOGICAL_WEAR_MARKS=logicalWearMarks();

export function createLogicalWear({scene,marks=LOGICAL_WEAR_MARKS,quality='balanced'}={}){
 if(!scene||!Array.isArray(marks)||!marks.length||!marks.every(logicalWearMarkValid))throw new TypeError('Logical wear needs a scene and valid marks.');
 const geometry=new THREE.BoxGeometry(1,1,1),material=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.98,metalness:0}),mesh=new THREE.InstancedMesh(geometry,material,marks.length),object=new THREE.Object3D(),color=new THREE.Color();
 for(let i=0;i<marks.length;i++){const mark=marks[i];object.position.set(mark.x,mark.y,mark.z);object.rotation.set(0,mark.ry,0);object.scale.set(mark.w,mark.h,mark.d);object.updateMatrix();mesh.setMatrixAt(i,object.matrix);mesh.setColorAt(i,color.setHex(mark.color));}
 mesh.name='Gummy Bay logical contact wear';mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;mesh.castShadow=false;mesh.receiveShadow=true;mesh.computeBoundingSphere();scene.add(mesh);
 const setQuality=q=>{mesh.visible=true;mesh.castShadow=false;mesh.receiveShadow=q!=='performance';};setQuality(quality);
 const counts=Object.freeze({marks:marks.length,footfall:marks.filter(mark=>mark.kind==='footfall').length,tyre:marks.filter(mark=>mark.kind==='tyre').length,tread:marks.filter(mark=>mark.kind==='tread').length});
 return Object.freeze({marks:Object.freeze([...marks]),mesh,setQuality,drawCalls:1,counts});
}
