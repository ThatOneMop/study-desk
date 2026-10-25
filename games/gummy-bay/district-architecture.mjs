import * as THREE from './vendor/three.module.min.js';
import {townMaterialOptions} from './town-materials.mjs?v=75';
import {townDistrictPalette,townRoleColor} from './town-palette.mjs?v=76';

const ROAD_XS=Object.freeze([-270,-105,0,105,270]);
const ROAD_ZS=Object.freeze([-90,-160,-230,-300,-370,-435]);
export const DISTRICT_ARCHETYPES=Object.freeze([
 Object.freeze({key:'bay-shop',floors:1,roof:'flat',upperScale:1,canopy:true}),
 Object.freeze({key:'brick-walkup',floors:2,roof:'parapet',upperScale:.92,canopy:false}),
 Object.freeze({key:'weatherboard-house',floors:2,roof:'gable',upperScale:.88,canopy:true}),
 Object.freeze({key:'harbor-shed',floors:1,roof:'shed',upperScale:1,canopy:false}),
 Object.freeze({key:'corner-office',floors:3,roof:'step',upperScale:.82,canopy:true})
]);
function frozenSite(x,z,w,d,index){return Object.freeze({id:`district-building-${index}`,x,z,w,d});}
const sites=[];
for(let row=0;row<5;row++)for(let col=0;col<10;col++){
 const x=[-240,-190,-140,-70,-30,30,70,140,190,240][col],z=[-125,-195,-265,-335,-405][row];
 sites.push(frozenSite(x,z,16+(col%3)*2+.7,19+(row%2)*3+.7,sites.length));
}
for(const side of [-1,1])for(let i=0;i<5;i++)sites.push(frozenSite(side*(150+i%2*70),-45+Math.floor(i/2)*52,18.7,18.7,sites.length));
export const DISTRICT_BUILDING_SITES=Object.freeze(sites);
export const DISTRICT_CONTRAST_COLLIDERS=Object.freeze([]);

const finite=n=>Number.isFinite(n);
function nearest(value,values){return values.reduce((best,n)=>Math.abs(value-n)<Math.abs(value-best)?n:best,values[0]);}
export function districtArchitectureProfile(site,index=0){
 if(!site||![site.x,site.z,site.w,site.d,index].every(finite)||site.w<8||site.d<8)return null;
 const archetype=DISTRICT_ARCHETYPES[((index%5)+5)%5],districtPalette=townDistrictPalette(site.x,site.z),palette=districtPalette.palette;
 const roadX=nearest(site.x,ROAD_XS),roadZ=nearest(site.z,ROAD_ZS),faceX=Math.abs(site.x-roadX)<Math.abs(site.z-roadZ);
 const front=Object.freeze(faceX?{axis:'x',sign:site.x>roadX?-1:1,road:roadX}:{axis:'z',sign:site.z>roadZ?-1:1,road:roadZ});
 const setback=1+(index%3)*.22,massW=site.w-setback*2,massD=site.d-setback*2;
 const floorHeight=3.05,height=3.55+(archetype.floors-1)*floorHeight;
 const bays=Math.max(2,Math.min(5,Math.floor((front.axis==='z'?massW:massD)/4.2)));
 return Object.freeze({id:site.id,index,district:districtPalette.district,archetype:archetype.key,floors:archetype.floors,roof:archetype.roof,canopy:archetype.canopy,upperScale:archetype.upperScale,x:site.x,z:site.z,w:massW,d:massD,siteW:site.w,siteD:site.d,setback,height,bays,front,palette});
}

export function districtFacadeDepth(profile){
 if(!profile||![profile.w,profile.d,profile.siteW,profile.siteD,profile.setback].every(finite)||!['x','z'].includes(profile.front?.axis)||![-1,1].includes(profile.front?.sign)||profile.setback<.9)return null;
 const layers=Object.freeze({doorBack:-.12,windowPane:-.1,frame:.16,sill:.2,cornice:.2,step:.66,canopy:profile.canopy?.82:0});
 const maxProjection=Math.max(layers.frame,layers.sill,layers.cornice,layers.step,layers.canopy);
 return Object.freeze({layers,maxProjection,clearance:profile.setback-maxProjection});
}

export function districtGeometricContrast(profile){
 const depth=districtFacadeDepth(profile),frontSpan=profile?.front?.axis==='z'?profile?.w:profile?.front?.axis==='x'?profile?.d:NaN;
 if(!depth||![frontSpan,profile?.height,profile?.floors].every(finite)||!Number.isInteger(profile.floors)||profile.floors<1||frontSpan<8||profile.height<3)return null;
 const verticals=Object.freeze([-1,1].map(side=>Object.freeze({kind:'vertical-rib',side,along:side*(frontSpan/2-.28),y:profile.height/2,width:.18,height:profile.height-.36,depth:.16,offset:.02})));
 const horizontals=Object.freeze(Array.from({length:profile.floors},(_,floor)=>Object.freeze({kind:'floor-datum',floor,along:0,y:3.38+floor*3.05,width:frontSpan*.94,height:.15,depth:.18,offset:.02})));
 return Object.freeze({id:profile.id,signature:`orthogonal-${verticals.length}v-${horizontals.length}h`,frontSpan,rightAngles:true,roundedParts:0,verticals,horizontals,maxProjection:.11,clearance:profile.setback-.11});
}

function pushBox(list,x,y,z,w,h,d,color,rx=0,ry=0,rz=0){list.push({x,y,z,w,h,d,color,rx,ry,rz});}
function frontPart(profile,along,y,width,height,depth,color,list,offset=0){
 const {front,x,z,w,d}=profile;
 if(front.axis==='z')pushBox(list,x+along,y,z+front.sign*(d/2+offset+depth/2),width,height,depth,color);
 else pushBox(list,x+front.sign*(w/2+offset+depth/2),y,z+along,depth,height,width,color);
}
function makeBatch(scene,geometry,items,style){
 const material=new THREE.MeshStandardMaterial({color:0xffffff,...townMaterialOptions(style),vertexColors:true}),mesh=new THREE.InstancedMesh(geometry,material,items.length),object=new THREE.Object3D(),color=new THREE.Color();
 for(let i=0;i<items.length;i++){const p=items[i];object.position.set(p.x,p.y,p.z);object.rotation.set(p.rx,p.ry,p.rz);object.scale.set(p.w,p.h,p.d);object.updateMatrix();mesh.setMatrixAt(i,object.matrix);mesh.setColorAt(i,color.setHex(p.color));}
 mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;mesh.castShadow=true;mesh.receiveShadow=true;mesh.computeBoundingSphere();scene.add(mesh);return mesh;
}

export function createDistrictArchitecture({scene,sites=DISTRICT_BUILDING_SITES,quality='balanced'}={}){
 if(!scene||!Array.isArray(sites))throw new TypeError('District architecture needs a scene and site array.');
 const profiles=sites.map(districtArchitectureProfile).filter(Boolean),contrastProfiles=[],mass=[],detail=[],gable=[];
 for(const p of profiles){
  const {palette:c}=p,baseHeight=Math.min(3.55,p.height),upperHeight=p.height-baseHeight;
  pushBox(mass,p.x,baseHeight/2,p.z,p.w,baseHeight,p.d,c.wall);
  if(upperHeight>0){const uw=p.w*p.upperScale,ud=p.d*p.upperScale;pushBox(mass,p.x,baseHeight+upperHeight/2,p.z,uw,upperHeight,ud,c.upper);}
  pushBox(mass,p.x,.28,p.z,p.w+.18,.56,p.d+.18,townRoleColor('foundation'));
  const topW=p.w*(upperHeight>0?p.upperScale:1),topD=p.d*(upperHeight>0?p.upperScale:1);
  if(p.roof==='gable')gable.push({x:p.x,y:p.height+.66,z:p.z,w:topW*1.04,h:2.6,d:topD*1.04,color:c.roof,rx:0,ry:Math.PI/4,rz:0});
  else if(p.roof==='shed')pushBox(mass,p.x,p.height+.18,p.z,topW+.35,.24,topD+.35,c.roof,p.front.axis==='z'?.11:0,0,p.front.axis==='x'?.11:0);
  else{pushBox(mass,p.x,p.height+.12,p.z,topW+.35,.24,topD+.35,c.roof);if(p.roof==='step')pushBox(mass,p.x-p.w*.19,p.height+.62,p.z,Math.min(3.2,p.w*.28),1,Math.min(3,p.d*.25),c.trim);}
  if(p.roof==='parapet')for(const side of [-1,1])pushBox(mass,p.x+side*topW*.48,p.height+.42,p.z,.2,.72,topD,c.trim);
  const depth=districtFacadeDepth(p),frontSpan=p.front.axis==='z'?p.w:p.d,contrast=districtGeometricContrast(p);contrastProfiles.push(contrast);
  frontPart(p,0,1.35,1.22,2.36,.04,c.door,detail,depth.layers.doorBack-.04);
  for(const side of [-1,1])frontPart(p,side*.69,1.35,.12,2.58,.12,c.trim,detail,.04);
  frontPart(p,0,2.63,1.5,.14,.14,c.trim,detail,.02);
  frontPart(p,0,.12,1.72,.24,.5,c.trim,detail,.08);
  if(p.canopy){frontPart(p,0,2.82,Math.min(4.8,frontSpan*.42),.16,.78,c.awning,detail,.04);frontPart(p,0,2.7,Math.min(4.8,frontSpan*.42),.14,.12,c.trim,detail,.04);}
  const span=(p.front.axis==='z'?p.w:p.d)*.72;
  for(let floor=0;floor<p.floors;floor++)for(let bay=0;bay<p.bays;bay++){
   const along=p.bays===1?0:-span/2+span*bay/(p.bays-1),y=1.65+floor*3.05;if(floor===0&&Math.abs(along)<1.05)continue;if(p.archetype==='harbor-shed'&&bay!==0)continue;if(p.archetype==='brick-walkup'&&bay%2===1)continue;
   frontPart(p,along,y,1.08,.98,.04,0x3f6268,detail,depth.layers.windowPane-.04);
   for(const side of [-1,1])frontPart(p,along+side*.67,y,.1,1.32,.12,c.trim,detail,.04);
   frontPart(p,along,y+.64,1.44,.1,.12,c.trim,detail,.04);
   frontPart(p,along,y-.66,1.55,.11,.18,c.trim,detail,.02);
  }
  // Side-wall relief stays inside the existing building setback.
  const iron=p.archetype==='harbor-shed',timber=p.archetype==='weatherboard-house';
  if(iron){for(const side of [-1,1])for(let z=-p.d/2+.3;z<p.d/2;z+=.48)pushBox(detail,p.x+side*(p.w/2+.025),baseHeight/2,p.z+z,.055,baseHeight-.08,.07,0x626b69);}
  if(p.archetype==='brick-walkup'){for(const side of [-1,1])for(let row=0;row<10;row++)for(let z=-p.d/2+.55+(row%2)*.42;z<p.d/2-.4;z+=.86)pushBox(detail,p.x+side*(p.w/2+.018),.22+row*.32,p.z+z,.04,.28,.8,[0x795e4e,0x896b59,0x705c50][row%3]);}
  if(timber){for(const side of [-1,1])for(let y=.32;y<baseHeight;y+=.25)pushBox(detail,p.x+side*(p.w/2+.025),y,p.z,.06,.035,p.d,0x737769);}
  // Dark weathered plinths and rain streaks, not more signs or windows.
  for(const side of [-1,1]){pushBox(detail,p.x+side*(p.w/2+.02),.22,p.z,.05,.44,p.d,0x4c514b);for(let n=0;n<3;n++)pushBox(detail,p.x+side*(p.w/2+.025),baseHeight-.55-n*.13,p.z-p.d*.3+n*p.d*.28,.025,.8+n*.19,.11,0x656b60);}
  for(const rib of contrast.verticals)frontPart(p,rib.along,rib.y,rib.width,rib.height,rib.depth,c.trim,detail,rib.offset);
  for(const band of contrast.horizontals)frontPart(p,band.along,band.y,band.width,band.height,band.depth,c.trim,detail,band.offset);
  if(p.roof==='flat'||p.roof==='parapet')pushBox(detail,p.x+p.w*.22,p.height+.47,p.z-p.d*.16,1.15,.5,1,0x7b8782);
 }
 const massMesh=makeBatch(scene,new THREE.BoxGeometry(1,1,1),mass,'buildingMass'),detailMesh=makeBatch(scene,new THREE.BoxGeometry(1,1,1),detail,'buildingTrim');
 const roofMesh=gable.length?makeBatch(scene,new THREE.ConeGeometry(.5,.5,4),gable,'roof'):null;
 const setQuality=q=>{detailMesh.visible=q!=='performance';massMesh.castShadow=q!=='performance';if(roofMesh)roofMesh.castShadow=q!=='performance';};setQuality(quality);
 return Object.freeze({profiles:Object.freeze(profiles),contrastProfiles:Object.freeze(contrastProfiles),massMesh,detailMesh,roofMesh,setQuality,drawCalls:roofMesh?3:2,counts:Object.freeze({sites:profiles.length,mass:mass.length,detail:detail.length,gable:gable.length,contrastVerticals:contrastProfiles.reduce((sum,item)=>sum+item.verticals.length,0),contrastHorizontals:contrastProfiles.reduce((sum,item)=>sum+item.horizontals.length,0)})});
}
