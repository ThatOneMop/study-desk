import * as THREE from './vendor/three.module.min.js';

const freezeRecords=records=>Object.freeze(records.map(record=>Object.freeze(record)));
export const DOORWAY_REVEAL_SITES=freezeRecords([
 {id:'palm-court',label:'Palm Court Motel',x:-25,z:19,w:18,d:13,family:'public'},
 {id:'room-04',label:'Room 04 workshop',x:-25,z:40,w:18,d:17,family:'domestic'},
 {id:'milos',label:'Milo’s Garden Goods',x:25,z:22,w:18,d:17,family:'public'},
 {id:'hanks',label:'Hank’s Hardware',x:-24,z:-23,w:20,d:17,family:'industrial'},
 {id:'corner-store',label:'The Corner Store',x:24,z:-25,w:20,d:18,family:'public'},
 {id:'suds',label:'Suds & Sunshine',x:53,z:22,w:19,d:17,family:'public'},
 {id:'lettings',label:'Cedar Bay Lettings',x:54,z:-25,w:21,d:19,family:'domestic'},
 {id:'helping-hand',label:'The Helping Hand',x:-53,z:-25,w:18,d:18,family:'domestic'},
 {id:'hillside-house',label:'The Hillside House',x:54,z:51,w:27,d:22,family:'domestic'},
 {id:'old-harbor',label:'Old Harbor Workshop',x:-54,z:55,w:24,d:20,family:'industrial'}
]);
export const DOORWAY_REVEAL_COLLIDERS=Object.freeze([]);

const PALETTES=Object.freeze({
 public:Object.freeze({returnColor:0x596c62,edge:0xd5c6a7,soffit:0xb9ad8d,threshold:0x727b70,inside:0x879680}),
 domestic:Object.freeze({returnColor:0x766a56,edge:0xdccba7,soffit:0xc4b18d,threshold:0x77786a,inside:0x8f9878}),
 industrial:Object.freeze({returnColor:0x4f6867,edge:0xc6c4a6,soffit:0xa9b5a0,threshold:0x667472,inside:0x718984})
});
const finite=n=>Number.isFinite(n);
export function doorwayRevealProfile(site,index=0){
 if(!site||typeof site.id!=='string'||!site.id||typeof site.label!=='string'||!site.label||!PALETTES[site.family]||![site.x,site.z,site.w,site.d,index].every(finite)||site.w<8||site.d<8)return null;
 const frontZ=site.z+site.d/2,openingWidth=site.w*.4,playerClearWidth=openingWidth-.65,depth=.55,insideZ=frontZ-.17,palette=PALETTES[site.family];
 if(playerClearWidth<2.4)return null;
 const parts=freezeRecords([
  {part:'left-return',x:site.x-openingWidth/2,y:1.35,z:insideZ,w:.1,h:2.7,d:depth,color:palette.returnColor},
  {part:'right-return',x:site.x+openingWidth/2,y:1.35,z:insideZ,w:.1,h:2.7,d:depth,color:palette.returnColor},
  {part:'left-edge',x:site.x-openingWidth/2+.07,y:1.35,z:frontZ+.075,w:.12,h:2.7,d:.1,color:palette.edge},
  {part:'right-edge',x:site.x+openingWidth/2-.07,y:1.35,z:frontZ+.075,w:.12,h:2.7,d:.1,color:palette.edge},
  {part:'lintel-soffit',x:site.x,y:2.73,z:insideZ,w:openingWidth-.1,h:.12,d:depth,color:palette.soffit},
  {part:'threshold',x:site.x,y:.035,z:insideZ,w:openingWidth-.25,h:.07,d:depth,color:palette.threshold},
  {part:'inner-header',x:site.x,y:2.48,z:frontZ-.47,w:openingWidth-.28,h:.14,d:.08,color:palette.inside}
 ]);
 return Object.freeze({...site,index,frontZ,openingWidth,playerClearWidth,depth,insideZ,parts,outside:Object.freeze({x:site.x,z:frontZ+1.15}),inside:Object.freeze({x:site.x,z:frontZ-1.15})});
}
export const DOORWAY_REVEAL_PROFILES=Object.freeze(DOORWAY_REVEAL_SITES.map((site,index)=>doorwayRevealProfile(site,index)));

export function doorwayRevealCollisionAligned(profile,blocked){
 if(!profile||typeof blocked!=='function')return false;
 const half=profile.openingWidth/2,lane=Math.min(.6,profile.playerClearWidth*.18);
 return blocked(profile.x-half,profile.frontZ)&&blocked(profile.x+half,profile.frontZ)&&[-lane,0,lane].every(offset=>!blocked(profile.x+offset,profile.frontZ));
}
export function doorwayRevealPathClear(profile,blocked){
 if(!profile||typeof blocked!=='function')return false;
 const lane=Math.min(.6,profile.playerClearWidth*.18);
 for(const offset of [-lane,0,lane])for(let i=0;i<=12;i++){const z=profile.outside.z+(profile.inside.z-profile.outside.z)*i/12;if(blocked(profile.x+offset,z))return false;}
 return true;
}

export function createDoorwayReveals({scene,sites=DOORWAY_REVEAL_SITES,quality='balanced'}={}){
 if(!scene||!Array.isArray(sites))throw new TypeError('Doorway reveals need a scene and site records.');
 const profiles=(sites===DOORWAY_REVEAL_SITES?DOORWAY_REVEAL_PROFILES:sites.map((site,index)=>doorwayRevealProfile(site,index))).filter(Boolean),parts=profiles.flatMap(profile=>profile.parts.map(part=>({...part,site:profile.id}))),geometry=new THREE.BoxGeometry(1,1,1),material=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.9,metalness:0,vertexColors:true,flatShading:true}),mesh=new THREE.InstancedMesh(geometry,material,parts.length),object=new THREE.Object3D(),color=new THREE.Color();
 mesh.userData.items=parts;
 for(const [index,part] of parts.entries()){object.position.set(part.x,part.y,part.z);object.scale.set(part.w,part.h,part.d);object.updateMatrix();mesh.setMatrixAt(index,object.matrix);mesh.setColorAt(index,color.setHex(part.color));}
 mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;mesh.computeBoundingSphere();scene.add(mesh);
 const setQuality=q=>{mesh.visible=true;mesh.castShadow=q==='high';mesh.receiveShadow=q!=='performance';};setQuality(quality);
 return Object.freeze({profiles:Object.freeze(profiles),mesh,setQuality,drawCalls:1,counts:Object.freeze({sites:profiles.length,parts:parts.length,colliders:0})});
}
