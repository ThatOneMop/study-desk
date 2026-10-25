import * as THREE from './vendor/three.module.min.js';
import {townMaterialOptions} from './town-materials.mjs?v=75';
import {townRoleColor} from './town-palette.mjs?v=76';

export const VERTICAL_TOWN_LAYER=Object.freeze({id:'gumdrop-terrace',label:'Gumdrop Terrace',x:-53,width:12,northStart:-49.5,northEnd:-55.5,platformSouth:-68.5,southEnd:-74.5,height:1.44,steps:8});
export const VERTICAL_TOWN_BARRIERS=Object.freeze([
 Object.freeze({x:-59.25,z:-62,w:.5,d:26}),
 Object.freeze({x:-46.75,z:-62,w:.5,d:26})
]);

const finite=n=>Number.isFinite(n);
export function verticalTownFloorHeight(x,z,layer=VERTICAL_TOWN_LAYER){
 if(![x,z,layer?.x,layer?.width,layer?.northStart,layer?.northEnd,layer?.platformSouth,layer?.southEnd,layer?.height].every(finite)||layer.width<=0||layer.height<0||Math.abs(x-layer.x)>layer.width/2||z>layer.northStart||z<layer.southEnd)return 0;
 if(z>=layer.northEnd)return Math.min(layer.height,Math.max(0,layer.height*(layer.northStart-z)/(layer.northStart-layer.northEnd)));
 if(z>=layer.platformSouth)return layer.height;
 return Math.min(layer.height,Math.max(0,layer.height*(z-layer.southEnd)/(layer.platformSouth-layer.southEnd)));
}

function pushBox(list,x,y,z,w,h,d,color){list.push({x,y,z,w,h,d,color});}
function makeBatch(scene,items,style){
 const geometry=new THREE.BoxGeometry(1,1,1),material=new THREE.MeshStandardMaterial({color:0xffffff,...townMaterialOptions(style),vertexColors:true}),mesh=new THREE.InstancedMesh(geometry,material,items.length),object=new THREE.Object3D(),color=new THREE.Color();
 for(let i=0;i<items.length;i++){const item=items[i];object.position.set(item.x,item.y,item.z);object.scale.set(item.w,item.h,item.d);object.updateMatrix();mesh.setMatrixAt(i,object.matrix);mesh.setColorAt(i,color.setHex(item.color));}
 mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;mesh.castShadow=true;mesh.receiveShadow=true;mesh.computeBoundingSphere();scene.add(mesh);return mesh;
}

export function createVerticalTownLayer({scene,layer=VERTICAL_TOWN_LAYER,quality='balanced'}={}){
 if(!scene||verticalTownFloorHeight(layer?.x,layer?.northEnd,layer)!==layer?.height)throw new TypeError('Vertical town layer needs a scene and valid terrace.');
 const mass=[],detail=[],run=(layer.northStart-layer.northEnd)/layer.steps,rise=layer.height/layer.steps;
 for(let i=0;i<layer.steps;i++){
  const northHeight=(i+1)*rise,northZ=layer.northStart-run*(i+.5);
  pushBox(mass,layer.x,northHeight/2,northZ,layer.width,northHeight,run+.025,townRoleColor(i%2?'hardscapeB':'hardscapeA'));
  const southHeight=(layer.steps-i)*rise,southZ=layer.platformSouth-run*(i+.5);
  pushBox(mass,layer.x,southHeight/2,southZ,layer.width,southHeight,run+.025,townRoleColor(i%2?'hardscapeB':'hardscapeA'));
 }
 const platformDepth=layer.northEnd-layer.platformSouth;
 pushBox(mass,layer.x,layer.height/2,(layer.northEnd+layer.platformSouth)/2,layer.width,layer.height,platformDepth,townRoleColor('hardscapeB'));
 for(const side of [-1,1]){
  const railX=layer.x+side*(layer.width/2+.25),railZ=(layer.northStart+layer.southEnd)/2,railDepth=layer.northStart-layer.southEnd;
  pushBox(detail,railX,.16,railZ,.18,.32,railDepth,townRoleColor('streetMetal'));
  pushBox(detail,railX,2.12,railZ,.16,.14,railDepth,townRoleColor('streetMetal'));
  for(let i=0;i<=8;i++){const z=layer.northStart-(layer.northStart-layer.southEnd)*i/8,y=verticalTownFloorHeight(layer.x,z,layer);pushBox(detail,railX,1.02+y*.55,z,.16,1.9+y*.1,.16,townRoleColor('streetMetal'));}
 }
 for(const z of [-59,-64.5]){pushBox(detail,layer.x-2.7,layer.height+.32,z,2.6,.64,.8,townRoleColor('wood'));pushBox(detail,layer.x-2.7,layer.height+.04,z,2.85,.12,1.05,townRoleColor('streetMetal'));}
 const massMesh=makeBatch(scene,mass,'hardscape'),detailMesh=makeBatch(scene,detail,'streetMetal');
 const setQuality=q=>{massMesh.visible=true;detailMesh.visible=true;detailMesh.castShadow=q!=='performance';};setQuality(quality);
 return Object.freeze({layer,massMesh,detailMesh,setQuality,drawCalls:2,counts:Object.freeze({steps:layer.steps*2,platforms:1,detail:detail.length})});
}
