// Family-friendly scuffles. A shove, a foam baton, a pan, a slingshot or a
// sticky net. Three bonks and they sit dizzy, seeing stars or birdies.
export const KO_HITS=3;
export const KO_MIN=4;
export const KO_MAX=6;
export const COP_HEAT=40;

export const SCUFFLE_WEAPONS=Object.freeze([
 Object.freeze({id:'shove',name:'Shove',price:0,range:1.2,impact:1,charge:0.35,shop:false}),
 Object.freeze({id:'baton',name:'Foam baton',price:50,range:1.6,impact:1,charge:0.5,shop:true}),
 Object.freeze({id:'pan',name:'Frying pan',price:100,range:1.8,impact:2,charge:0.6,shop:true}),
 Object.freeze({id:'sling',name:'Slingshot',price:80,range:8,impact:1,charge:0.45,shop:true}),
 Object.freeze({id:'net',name:'Sticky net',price:120,range:10,impact:0,charge:0.5,shop:true,slow:0.6,slowFor:3})
]);
const BY_ID=Object.freeze(Object.fromEntries(SCUFFLE_WEAPONS.map(weapon=>[weapon.id,weapon])));
export function scuffleWeapon(id){return BY_ID[id]||BY_ID.shove;}
export function shopWeapons(){return SCUFFLE_WEAPONS.filter(weapon=>weapon.shop);}

export function knockLength(roll=0){
 const t=Number.isFinite(roll)?Math.max(0,Math.min(1,roll)):0;
 return KO_MIN+(KO_MAX-KO_MIN)*t;
}
export function knockStyle(roll=0){return (Number.isFinite(roll)?roll:0)<0.5?'stars':'birdies';}
export function freshTarget(){return {hits:0,ko:0,style:'stars'};}

// Each swing is one bonk, whatever the cartoon impact. The pan just hits harder
// objects (a vending machine gives up after two pan hits).
export function bonk(target,weapon,roll=0){
 const item=weapon&&weapon.id?weapon:scuffleWeapon(weapon);
 const prev=target&&typeof target==='object'?target:freshTarget();
 if(item.id==='net')return {target:{...prev,slow:item.slowFor||3},ko:false,kind:'net',weapon:item.id};
 const hits=(prev.hits||0)+1;
 if(hits>=KO_HITS){
  const down=knockLength(roll);
  const style=knockStyle(roll);
  return {target:{hits,ko:down,style},ko:true,down,style,kind:'ko',weapon:item.id};
 }
 return {target:{hits,ko:0,style:prev.style||'stars'},ko:false,kind:'bonk',weapon:item.id};
}
export function stepKnockout(target,dt){
 if(!target||!(target.ko>0))return target||freshTarget();
 const step=Number.isFinite(dt)?Math.max(0,dt):0;
 const ko=target.ko-step;
 if(ko<=0)return freshTarget();
 return {...target,ko};
}
export function machineBreaks(hits,weapon){
 const item=weapon&&weapon.id?weapon:scuffleWeapon(weapon);
 const need=item.id==='pan'?2:4;
 return (hits||0)>=need;
}
