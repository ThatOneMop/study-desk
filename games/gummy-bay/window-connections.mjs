import * as THREE from './vendor/three.module.min.js';

const freezeRecords=records=>Object.freeze(records.map(record=>Object.freeze(record)));
export const WINDOW_CONNECTION_SITES=freezeRecords([
 {id:'palm-court',label:'Palm Court Motel',x:-25,z:19,w:18,d:13,family:'public'},
 {id:'room-04',label:'Room 04 workshop',x:-25,z:40,w:18,d:17,family:'domestic'},
 {id:'milos',label:'Milo’s Garden Goods',x:25,z:22,w:18,d:17,family:'public'},
 {id:'hanks',label:'Hank’s Hardware',x:-24,z:-23,w:20,d:17,family:'industrial'},
 {id:'corner-store',label:'The Corner Store',x:24,z:-25,w:20,d:18,family:'public'},
 {id:'suds',label:'Suds & Sunshine',x:53,z:22,w:19,d:17,family:'public'},
 {id:'lettings',label:'Cedar Bay Lettings',x:54,z:-25,w:21,d:19,family:'domestic'},
 {id:'helping-hand',label:'The Helping Hand',x:-53,z:-25,w:18,d:18,family:'domestic'},
 {id:'hillside-house',label:'The Hillside House',x:54,z:51,w:27,d:22,family:'domestic'},
 {id:'old-harbor',label:'Old Harbor Workshop',x:-54,z:55,w:24,d:20,family:'industrial'},
 {id:'coastway-servo',label:'Coastway Servo',x:-77,z:-35,w:17,d:14,family:'industrial'}
]);
export const WINDOW_CONNECTION_COLLIDERS=Object.freeze([]);

const PALETTES=Object.freeze({
 public:Object.freeze({reveal:0x6d7868,trim:0xc9c2a5,sill:0xa69d83}),
 domestic:Object.freeze({reveal:0x81745e,trim:0xd1c6a5,sill:0xaa9b7d}),
 industrial:Object.freeze({reveal:0x536c6a,trim:0xb7bda3,sill:0x7c8980})
});
const finite=n=>Number.isFinite(n);
export function windowConnectionProfile(site,index=0){
 if(!site||typeof site.id!=='string'||!site.id||typeof site.label!=='string'||!site.label||!PALETTES[site.family]||![site.x,site.z,site.w,site.d,index].every(finite)||site.w<8||site.d<8)return null;
 const frontZ=site.z+site.d/2,paneWidth=site.w*.18,paneHeight=1.35,paneY=1.8,depth=.55,palette=PALETTES[site.family],windows=[];
 for(const side of [-1,1]){
  const id=site.id+(side<0?'-left':'-right'),x=site.x+side*site.w*.35,insideZ=frontZ-.125,innerZ=frontZ-.39,halfW=paneWidth/2,halfH=paneHeight/2;
  const parts=freezeRecords([
   {part:'left-return',x:x-halfW-.055,y:paneY,z:insideZ,w:.11,h:paneHeight+.12,d:depth,color:palette.reveal},
   {part:'right-return',x:x+halfW+.055,y:paneY,z:insideZ,w:.11,h:paneHeight+.12,d:depth,color:palette.reveal},
   {part:'lintel-return',x,y:paneY+halfH+.055,z:insideZ,w:paneWidth+.22,h:.11,d:depth,color:palette.reveal},
   {part:'sill-return',x,y:paneY-halfH-.055,z:insideZ,w:paneWidth+.22,h:.11,d:depth,color:palette.sill},
   {part:'inner-left-trim',x:x-halfW-.018,y:paneY,z:innerZ,w:.07,h:paneHeight,d:.06,color:palette.trim},
   {part:'inner-right-trim',x:x+halfW+.018,y:paneY,z:innerZ,w:.07,h:paneHeight,d:.06,color:palette.trim},
   {part:'inner-sill-edge',x,y:paneY-halfH+.02,z:innerZ,w:paneWidth,h:.07,d:.06,color:palette.trim}
  ]);
  windows.push(Object.freeze({id,site:site.id,side,x,y:paneY,frontZ,paneWidth,paneHeight,depth,insideZ,innerZ,parts}));
 }
 return Object.freeze({...site,index,frontZ,paneWidth,paneHeight,windows:Object.freeze(windows)});
}
export const WINDOW_CONNECTION_PROFILES=Object.freeze(WINDOW_CONNECTION_SITES.map((site,index)=>windowConnectionProfile(site,index)));

export function windowApertureSamples(window){
 if(!window||![window.x,window.y,window.frontZ,window.paneWidth,window.paneHeight].every(finite))return Object.freeze([]);
 const dx=window.paneWidth*.18,dy=window.paneHeight*.2;
 return freezeRecords([[-dx,-dy],[dx,-dy],[-dx,dy],[dx,dy]].map(([x,y])=>({x:window.x+x,y:window.y+y,z:window.frontZ})));
}
export function windowConnectionAligned(window,pane){
 if(!window||!pane||![pane.x,pane.y,pane.z,pane.width,pane.height].every(finite))return false;
 return Math.abs(pane.x-window.x)<1e-6&&Math.abs(pane.y-window.y)<1e-6&&Math.abs(pane.z-(window.frontZ+.15))<1e-6&&Math.abs(pane.width-window.paneWidth)<1e-6&&Math.abs(pane.height-window.paneHeight)<1e-6;
}

export function createWindowConnections({scene,profiles=WINDOW_CONNECTION_PROFILES,quality='balanced'}={}){
 if(!scene||!Array.isArray(profiles))throw new TypeError('Window connections need a scene and profile records.');
 const windows=profiles.filter(Boolean).flatMap(profile=>profile.windows||[]),parts=windows.flatMap(window=>window.parts.map(part=>({...part,window:window.id}))),geometry=new THREE.BoxGeometry(1,1,1),material=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.9,metalness:0,flatShading:true}),mesh=new THREE.InstancedMesh(geometry,material,parts.length),object=new THREE.Object3D(),color=new THREE.Color();
 mesh.userData.items=parts;
 for(const [index,part] of parts.entries()){object.position.set(part.x,part.y,part.z);object.scale.set(part.w,part.h,part.d);object.updateMatrix();mesh.setMatrixAt(index,object.matrix);mesh.setColorAt(index,color.setHex(part.color));}
 mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;mesh.computeBoundingSphere();scene.add(mesh);
 const setQuality=q=>{mesh.visible=true;mesh.castShadow=q==='high';mesh.receiveShadow=q!=='performance';};setQuality(quality);
 return Object.freeze({profiles:Object.freeze(profiles.filter(Boolean)),windows:Object.freeze(windows),mesh,setQuality,drawCalls:1,counts:Object.freeze({sites:profiles.filter(Boolean).length,windows:windows.length,parts:parts.length,colliders:0})});
}
