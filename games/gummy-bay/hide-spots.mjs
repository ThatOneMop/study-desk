// Break a chase by stepping into cover while nobody has a line of sight.
// Original props: a dumpster, a porta-loo and a hedge. No copied set dressing.
import {freshChase} from './police-ladder.mjs?v=132';

export const HIDE_KINDS=Object.freeze(['dumpster','porta-loo','hedge']);
export const HIDE_SPOTS=Object.freeze([
 Object.freeze({id:'dumpster-main',kind:'dumpster',x:8,z:6.6,radius:1.45,label:'Dumpster'}),
 Object.freeze({id:'loo-palm',kind:'porta-loo',x:-48,z:6.2,radius:1.2,label:'Porta-loo'}),
 Object.freeze({id:'hedge-court',kind:'hedge',x:-28,z:11.2,radius:1.55,label:'Hedge'})
]);

export function hideSpotAt(x,z,spots=HIDE_SPOTS){
 if(!Number.isFinite(x)||!Number.isFinite(z))return null;
 let best=null,bestD=Infinity;
 for(const spot of spots||[]){
  if(!spot||!Number.isFinite(spot.x)||!Number.isFinite(spot.z))continue;
  const distance=Math.hypot(x-spot.x,z-spot.z);
  const radius=Number.isFinite(spot.radius)?spot.radius:1.2;
  if(distance<=radius&&distance<bestD){best=spot;bestD=distance;}
 }
 return best;
}
// Entering cover only works if the squad cannot see you at that moment.
export function hidingClears(chase,{inside=false,seen=true}={}){
 const state=chase&&chase.stage?chase:freshChase();
 if(!inside||seen||state.stage==='clear')return {chase:state,cleared:false};
 return {chase:freshChase(),cleared:true};
}
