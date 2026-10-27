// v169: seeds come from a dodgy supplier you text. You order and pay by text, they stash the seeds in a
// dead drop somewhere in the back lanes, and you walk there to collect. Pure helpers; game.js owns state.
import {WINDING_LANES,LANE_HALF,sampleLane,laneSurface} from './winding-lanes.mjs?v=166';
export const SUPPLIER=Object.freeze({name:'Weasel',sub:'Unknown number · supplier',outfit:0x3b4a3a,skin:0xc49a74,hair:0x1b1b1f,
 hello:'heard u need seeds. dont call. text only.',
 ordered:'ok. cash first. ill leave it somewhere quiet. dont be weird about it',
 ready:'its there. paper bag. come alone',
 collected:'pleasure. delete this.',
 busy:'one drop at a time. go get the last one'});
export const DROP_WAIT=40;   // game minutes before the bag is in place
export const PICKUP_RANGE=1.7;
export const MARKUP=1.15;    // a little dearer than the old seed shop: you pay for discretion
const SPOT_NAMES=['behind the dumpster','under the drainpipe','by the busted fence','next to the milk crates','in the gap between the walls','under the stairs'];
// Candidate drop spots: on the lane footpaths, just off the kerb, spread along all three laneways.
export function dropSpots(){
 const out=[];
 for(const lane of WINDING_LANES){const S=sampleLane(lane.pts);for(let i=3;i<S.length-3;i+=7){const p=S[i],len=Math.hypot(p.tx,p.tz)||1,nx=p.tz/len,nz=-p.tx/len,side=(out.length%2)?1:-1,off=LANE_HALF+1.05;const x=+(p.x+nx*off*side).toFixed(2),z=+(p.z+nz*off*side).toFixed(2);if(laneSurface(x,z)==='pavement')out.push({x,z,lane:lane.name||lane.id});}}
 return out;
}
export function pickDrop(day=1,orders=0){const spots=dropSpots(),i=Math.abs((day*7+orders*13)|0)%spots.length,spot=spots[i];return {...spot,note:SPOT_NAMES[(day+orders)%SPOT_NAMES.length]};}
export function seedPrice(base){return Math.max(1,Math.round((Number(base)||0)*MARKUP));}
export function orderTotal(base,qty){return seedPrice(base)*Math.max(1,Math.min(10,qty|0));}
// minute is absolute game minutes ((day-1)*1440+time)
export function dropState(drop,minute,player){
 if(!drop)return 'none';if(minute<drop.ready)return 'waiting';
 if(player&&Math.hypot(player.x-drop.x,player.z-drop.z)<=PICKUP_RANGE)return 'here';return 'ready';
}
export function supplierThread(drop,minute,{strain='',qty=0}={}){
 const lines=[{mine:false,text:SUPPLIER.hello}];
 if(drop){lines.push({mine:true,text:qty+' × '+strain+' seeds'});lines.push({mine:false,text:SUPPLIER.ordered});
  if(minute>=drop.ready)lines.push({mine:false,text:SUPPLIER.ready+'. '+drop.lane+', '+drop.note+'.'});}
 return lines;
}
