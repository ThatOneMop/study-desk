import * as THREE from './vendor/three.module.min.js';
const clamp=x=>Math.max(0,Math.min(1,x));
export function wakingPose(seconds=0){const t=clamp((Number.isFinite(seconds)?seconds:0)/2.4),ease=t*t*(3-2*t);return {height:.86+.86*ease,pitch:.3*(1-ease),roll: ease===1?0:-.16*(1-ease),legs:1-ease};}
export function createWorkshopTerminals({scene,homes}){
 const rows=[],caseMaterial=new THREE.MeshStandardMaterial({color:0x9c9c87,roughness:.85}),glass=new THREE.MeshStandardMaterial({color:0x355f56,emissive:0x6eaa86,emissiveIntensity:.35,roughness:.4}),keyMaterial=new THREE.MeshStandardMaterial({color:0x444b42,roughness:.9});
 const geometries=new Map();
 function part(g,x,y,z,w,h,d,material){const key=[w,h,d].join(',');if(!geometries.has(key))geometries.set(key,new THREE.BoxGeometry(w,h,d));const m=new THREE.Mesh(geometries.get(key),material);m.position.set(x,y,z);g.add(m);return m;}
 for(const [home,h]of homes.entries()){
  const g=new THREE.Group();g.name='BayBook terminal '+home;g.position.set(h.x+4.5,0,h.z+3.4);scene.add(g);
  part(g,0,1.35,-.05,.7,.5,.38,caseMaterial);part(g,0,1.36,.151,.59,.35,.025,glass);part(g,0,1.05,-.05,.3,.12,.23,caseMaterial);
  part(g,0,1.045,.27,.66,.04,.22,keyMaterial);
  for(let i=0;i<3;i++)part(g,-.08,1.45-i*.09,.17,.35-i*.06,.017,.012,keyMaterial);
  rows.push({home,group:g});
 }
 return {rows,update({active,room,house}){for(const row of rows)row.group.visible=!!active&&!!room&&row.home===house;},geometries,materials:[caseMaterial,glass,keyMaterial]};
}
export function firePulse(time=0){return .82+Math.sin(time*6.7)*.09+Math.sin(time*11.3)*.06;}
export function createCampsiteFire({scene,x,z,ground=0}){
 const group=new THREE.Group();group.name='Driftwood contained fire';group.position.set(x,ground,z);scene.add(group);
 const metal=new THREE.MeshStandardMaterial({color:0x47483d,roughness:.95}),bowl=new THREE.Mesh(new THREE.CylinderGeometry(.42,.31,.4,12),metal);bowl.position.y=.2;group.add(bowl);
 const flameMaterial=new THREE.MeshBasicMaterial({color:0xff9c42,transparent:true,opacity:.83,depthWrite:false}),coreMaterial=new THREE.MeshBasicMaterial({color:0xffde84});
 const flameGeometry=new THREE.ConeGeometry(.18,.6,7),flames=[];
 for(let i=0;i<4;i++){const f=new THREE.Mesh(flameGeometry,i===3?coreMaterial:flameMaterial);f.position.set(Math.sin(i*2.1)*.15,.55,Math.cos(i*2.1)*.15);group.add(f);flames.push(f);}
 return {group,flames,update(time,night){group.visible=true;for(let i=0;i<flames.length;i++){const f=flames[i],pulse=firePulse(time+i);f.scale.set(.8+pulse*.2,pulse,.8);f.rotation.z=Math.sin(time*3+i)*.13;f.position.y=.33+.3*pulse;}flameMaterial.opacity=.65+.18*clamp(night);}};
}

// Read-only workshop planning: in-transit stock and promised packs stay separate.
export function workshopPlan(state){
 const count=a=>Array.isArray(a)?a.reduce((n,v)=>n+(Number.isSafeInteger(v)&&v>0?v:0),0):0;
 const raw=count(state.raw),loose=count(state.gummies),packed=count(state.packs),stored=count(state.storedPacks),wrappers=Number.isSafeInteger(state.wrappers)&&state.wrappers>0?state.wrappers:0;
 const deals=Array.isArray(state.deals)?state.deals:[],reserved=deals.reduce((n,d)=>n+(Number.isSafeInteger(d.qty)&&d.qty>0?d.qty:0),0);
 const available=(state.packs||[]).reduce((n,v,i)=>n+Math.max(0,v-deals.filter(d=>d.t===i).reduce((q,d)=>q+d.qty,0)),0);
 const clock=((state.day||1)-1)*1440+(state.time||0);
 const deadlines=deals.filter(d=>Number.isFinite(d.due)).map(d=>({npc:d.npc,minutes:Math.max(0,Math.ceil(d.due-clock)),overdue:d.due<clock})).sort((a,b)=>a.minutes-b.minutes||a.npc-b.npc);
 return Object.freeze({raw,loose,packed,stored,wrappers,reserved,available,wrapNow:state.packStation?Math.min(loose,wrappers):0,finishable:state.packStation?Math.min(raw+loose,wrappers):0,wrapperShortfall:Math.max(0,raw+loose-wrappers),inTransit:state.crafterCargo?1:0,deadlines:Object.freeze(deadlines.map(Object.freeze))});
}
