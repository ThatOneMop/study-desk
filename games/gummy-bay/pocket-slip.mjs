// Body-search minigame. Four pat-down zones, each with a 0.35 s window.
// A full-skill slip lands 65% of the time and saves one carried stack.
export const SLIP_ZONES=4;
export const SLIP_WINDOW=0.35;
export const SLIP_GAP=0.55;
export const SLIP_CHANCE_FULL=0.65;

export function slipChance(skill=1){
 const value=Number.isFinite(skill)?Math.max(0,Math.min(1,skill)):0;
 return 0.25+(SLIP_CHANCE_FULL-0.25)*value;
}
export function slipZoneOpen(time,zone,{zones=SLIP_ZONES,window=SLIP_WINDOW,gap=SLIP_GAP}={}){
 if(!Number.isFinite(time)||!Number.isInteger(zone)||zone<0||zone>=zones)return false;
 const slot=window+gap,cycle=slot*zones;
 const t=((time%cycle)+cycle)%cycle;
 const start=zone*slot;
 return t>=start&&t<start+window;
}
export function trySlip({time=0,zone=0,skill=1,roll=0}={}){
 if(!slipZoneOpen(time,zone))return {ok:false,reason:'window',chance:slipChance(skill)};
 const chance=slipChance(skill);
 const luck=Number.isFinite(roll)?Math.max(0,Math.min(0.999,roll)):1;
 return {ok:luck<chance,reason:luck<chance?'slipped':'fumble',chance};
}
// One stack stays in a pocket. Everything else is still on the person.
export function spareStack(carried,zone=0){
 const keys=['packs','gummies','raw'];
 const lists=keys.map(key=>({key,items:Array.isArray(carried?.[key])?carried[key]:[]}));
 const filled=[];
 for(const list of lists)list.items.forEach((qty,index)=>{if(qty>0)filled.push({key:list.key,index,qty});});
 if(!filled.length)return null;
 const pick=filled[Math.abs(zone|0)%filled.length];
 return {key:pick.key,index:pick.index,qty:Math.min(pick.qty,pick.key==='packs'?pick.qty:Math.max(1,Math.ceil(pick.qty/2)))};
}
