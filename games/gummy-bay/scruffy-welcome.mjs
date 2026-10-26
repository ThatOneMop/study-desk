import * as THREE from './vendor/three.module.min.js';

const freezeRecords=records=>Object.freeze(records.map(record=>Object.freeze(record)));
export const SCRUFFY_WELCOME_SITES=freezeRecords([
 {id:'driftwood-camp-care',label:'Driftwood campsite',kind:'campsite',x:-58,z:34.15,w:10,d:0,wear:0x8d755f,care:0x9bb679,accent:0xe0b86e},
 {id:'milos-mended-front',label:'Milo’s garden shop',kind:'shop',x:25,z:30.81,w:18,d:17,centreZ:22,wear:0x876f5d,care:0x91aa70,accent:0xe2bb75},
 {id:'hardware-mended-front',label:'Hank’s Hardware',kind:'shop',x:-24,z:-14.19,w:20,d:17,centreZ:-23,wear:0x7b6b5d,care:0x7f9b82,accent:0xd5a66d},
 {id:'corner-store-mended-front',label:'Corner Store',kind:'shop',x:24,z:-15.69,w:20,d:18,centreZ:-25,wear:0x8a705c,care:0xa3b477,accent:0xd99c70},
 {id:'helping-hand-mended-front',label:'Helping Hand',kind:'shop',x:-53,z:-15.69,w:18,d:18,centreZ:-25,wear:0x756b61,care:0x88a38b,accent:0xe0b271}
]);
export const SCRUFFY_WELCOME_COLLIDERS=Object.freeze([]);

const finite=value=>Number.isFinite(value);
export function scruffyWelcomeProfile(site,index=0){
 if(!site||typeof site.id!=='string'||!site.id||typeof site.label!=='string'||!site.label||!['campsite','shop'].includes(site.kind)||![site.x,site.z,site.w,site.d,site.wear,site.care,site.accent,index].every(finite)||site.w<8||site.d<0)return null;
 const anchorX=site.x+(index%2?-.28:.28)*site.w,facadeZ=site.z,boardWidth=2.35,lowestY=.42;
 const attached=site.kind==='campsite'||finite(site.centreZ)&&Math.abs(facadeZ-(site.centreZ+site.d/2+.31))<1e-9;
 if(!attached||Math.abs(anchorX-site.x)+boardWidth/2>site.w/2-.18)return null;
 return Object.freeze({...site,index,anchorX,facadeZ,boardWidth,lowestY,attached,decorativeOnly:true,pairing:'weathered-repair+kept-care'});
}
export const SCRUFFY_WELCOME_PROFILES=Object.freeze(SCRUFFY_WELCOME_SITES.map(scruffyWelcomeProfile));

export function scruffyWelcomeMounted(profile){
 if(!profile||![profile.x,profile.w,profile.anchorX,profile.boardWidth,profile.facadeZ,profile.lowestY].every(finite))return false;
 return profile.attached&&profile.lowestY>=.4&&Math.abs(profile.anchorX-profile.x)+profile.boardWidth/2<=profile.w/2-.18;
}

function makeBatch(scene,geometry,items){
 const material=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.96,metalness:0,flatShading:true}),mesh=new THREE.InstancedMesh(geometry,material,items.length),object=new THREE.Object3D(),color=new THREE.Color();
 mesh.userData.items=items;
 for(let i=0;i<items.length;i++){const part=items[i];object.position.set(part.x,part.y,part.z);object.rotation.set(part.rx||0,part.ry||0,part.rz||0);object.scale.set(part.w??part.r*2,part.h,part.d??part.r*2);object.updateMatrix();mesh.setMatrixAt(i,object.matrix);mesh.setColorAt(i,color.setHex(part.color));}
 mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;mesh.castShadow=false;mesh.receiveShadow=true;mesh.computeBoundingSphere();scene.add(mesh);return mesh;
}

export function createScruffyWelcome({scene,sites=SCRUFFY_WELCOME_SITES,quality='balanced'}={}){
 if(!scene||!Array.isArray(sites))throw new TypeError('Scruffy welcome dressing needs a scene and authored sites.');
 const profiles=(sites===SCRUFFY_WELCOME_SITES?SCRUFFY_WELCOME_PROFILES:sites.map(scruffyWelcomeProfile)).filter(profile=>profile&&scruffyWelcomeMounted(profile)),boxes=[],tins=[];
 for(const p of profiles){
  const z=p.facadeZ,side=p.index%2?-1:1;
  boxes.push({x:p.anchorX-.72,y:2.58,z,w:.82,h:.26,d:.055,color:p.wear,rz:-.04*side,role:'repair',site:p.id});
  boxes.push({x:p.anchorX+.48,y:2.22,z:z+.012,w:.64,h:.2,d:.06,color:p.wear,rz:.055*side,role:'repair',site:p.id});
  boxes.push({x:p.anchorX,y:1.48,z:z+.035,w:p.boardWidth,h:.64,d:.075,color:p.care,role:'welcome',site:p.id});
  boxes.push({x:p.anchorX,y:1.84,z:z+.075,w:p.boardWidth+.16,h:.055,d:.1,color:p.accent,role:'care',site:p.id});
  boxes.push({x:p.anchorX,y:1.12,z:z+.075,w:p.boardWidth+.16,h:.055,d:.1,color:p.accent,role:'care',site:p.id});
  boxes.push({x:p.anchorX-side*.53,y:1.48,z:z+.085,w:.12,h:.45,d:.03,color:p.accent,rz:.5*side,role:'care',site:p.id});
  boxes.push({x:p.anchorX,y:.68,z:z+.18,w:1.82,h:.1,d:.38,color:p.wear,role:'shelf',site:p.id});
  boxes.push({x:p.anchorX,y:.42,z:z+.18,w:1.54,h:.08,d:.31,color:p.care,role:'kept-bed',site:p.id});
  for(const offset of [-.55,.55])tins.push({x:p.anchorX+offset,y:.61,z:z+.2,r:.18,h:.38,color:offset<0?p.care:p.accent,role:'planter',site:p.id});
 }
 const boxMesh=makeBatch(scene,new THREE.BoxGeometry(1,1,1),boxes),tinMesh=makeBatch(scene,new THREE.CylinderGeometry(1,1,1,9),tins);
 const setQuality=q=>{boxMesh.visible=true;tinMesh.visible=true;boxMesh.castShadow=q==='high';tinMesh.castShadow=q==='high';};setQuality(quality);
 return Object.freeze({profiles:Object.freeze(profiles),boxMesh,tinMesh,setQuality,drawCalls:2,counts:Object.freeze({sites:profiles.length,boxes:boxes.length,tins:tins.length,repair:boxes.filter(item=>item.role==='repair').length,care:boxes.filter(item=>item.role!=='repair').length+tins.length,colliders:0})});
}
