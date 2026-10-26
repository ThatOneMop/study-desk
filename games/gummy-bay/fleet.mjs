import {levelOf} from './xp-curve.mjs';
import * as THREE from './vendor/three.module.min.js';
export const FLEET=Object.freeze([
 Object.freeze({id:'van',name:'Delivery van',price:750,level:2,acceleration:8,top:16,reverse:5,steering:1.6,description:'The original dependable delivery fleet.'}),
 Object.freeze({id:'compact',name:'Bay Bee compact',price:1600,level:3,acceleration:10,top:16,reverse:5,steering:1.9,description:'Quicker acceleration and a more responsive turn. Unlock after the van.'}),
 Object.freeze({id:'estate',name:'Harborline estate',price:3400,level:5,acceleration:6.5,top:14,reverse:4,steering:1.25,description:'A longer silhouette with gentler acceleration and steering. Unlock after the van.'})
]);
export function fleetProfile(id){return FLEET.find(p=>p.id===id)||FLEET[0];}
export function fleetOwned(state,id){return id==='van'?!!state.vehicleOwned:!!state.vehicleOwned&&Array.isArray(state.fleetUnlocks)&&state.fleetUnlocks.includes(id)&&FLEET.some(p=>p.id===id);}
export function activeFleet(state){return fleetOwned(state,state.fleetSelected)?fleetProfile(state.fleetSelected):FLEET[0];}
export function fleetRequest(state,id,select=false){
 const profile=FLEET.find(p=>p.id===id);if(!profile||id==='van'&&!select)return {ok:false,reason:'Choose an available vehicle.'};
 if(!state.vehicleOwned)return {ok:false,reason:'Buy the delivery van fleet first.'};
 if(select)return fleetOwned(state,id)?{ok:true,profile}:{ok:false,reason:'Buy this vehicle first.'};
 if(fleetOwned(state,id))return {ok:false,reason:'Already owned.'};
 if(levelOf(state.xp)<profile.level)return {ok:false,reason:'Requires level '+profile.level+'.'};
 const balance=state.payment==='card'?state.bank:state.cash;
 if(!Number.isFinite(balance)||balance<profile.price)return {ok:false,reason:'Not enough '+(state.payment==='card'?'card funds.':'cash.')};
 return {ok:true,profile};
}
// Alternative bodies remain inside the original conservative van collision envelope.
export function createFleetModels(){
 const group=new THREE.Group();group.name='Alternative fleet bodies';const models=new Map();
 const tire=new THREE.MeshStandardMaterial({color:0x252d2c,roughness:1}),glass=new THREE.MeshStandardMaterial({color:0x49646b,roughness:.35}),trim=new THREE.MeshStandardMaterial({color:0xb4b9aa,roughness:.65}),lamp=new THREE.MeshStandardMaterial({color:0xf2d6a0,emissive:0xa68a52,emissiveIntensity:.15});
 const cube=new THREE.BoxGeometry(1,1,1),wheel=new THREE.CylinderGeometry(.28,.28,.14,12);
 for(const id of ['compact','estate']){
  const g=new THREE.Group(),compact=id==='compact',body=new THREE.MeshStandardMaterial({color:compact?0xb8a151:0x597865,roughness:.65});g.name=id;group.add(g);models.set(id,g);
  const box=(x,y,z,w,h,d,m)=>{const o=new THREE.Mesh(cube,m);o.position.set(x,y,z);o.scale.set(w,h,d);o.castShadow=true;o.receiveShadow=true;g.add(o);return o;};
  const length=compact?2.6:3.1;
  box(0,.57,0,1.58,.5,length,body);box(0,1.02,compact?-.15:-.22,1.35,.48,compact?1.35:1.85,glass);box(0,1.29,compact?-.15:-.22,1.42,.09,compact?1.4:1.9,body);
  box(0,.5,length/2,.99,.1,.07,trim);box(0,.5,-length/2,1.3,.1,.07,trim);
  for(const x of [-.57,.57])box(x,.67,length/2+.015,.26,.15,.03,lamp);
  for(const x of [-.79,.79])for(const z of [-.95,.95]){const o=new THREE.Mesh(wheel,tire);o.rotation.z=Math.PI/2;o.position.set(x,.29,z);g.add(o);}
  for(const x of [-.69,.69])box(x,1.02,-.1,.07,.5,.08,body);
 }
 return {group,models,select(id){for(const [key,g]of models)g.visible=key===id;group.visible=id!=='van';}};
}
