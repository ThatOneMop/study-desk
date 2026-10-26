// The opening Pine Pop sale has to be possible. Patrols can still walk the
// town, but they cannot stop, search or confiscate until that first sale.
export function firstSaleProtected(state){
 return !!state&&state.day===1&&!(Number(state.sold)>0);
}
const GEAR=['shove','baton','pan','sling','net'];
export function normalizeSquadSave(state){
 if(!state||typeof state!=='object')return state;
 if(!Array.isArray(state.gear))state.gear=[];
 state.gear=state.gear.filter(id=>GEAR.includes(id));
 if(!state.gear.includes('shove'))state.gear.unshift('shove');
 state.donuts=Number.isSafeInteger(state.donuts)&&state.donuts>0?Math.min(99,state.donuts):0;
 state.foundPan=state.foundPan===true;
 state.squadTool=GEAR.includes(state.squadTool)?state.squadTool:(state.gear.includes('pan')?'pan':'shove');
 return state;
}
