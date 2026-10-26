// Mixing risk layer: bad effects cost money, every save rolls its own recipe twists,
// and a sloppy stir can fizz a batch over. Pure and seeded: no DOM, clock or Math.random.
import {effectById,roundHalfEven,MAX_EFFECTS,EFFECTS} from './mix-core.mjs';
import {applyPantryMix,JELLY_POOL} from './mix-pantry.mjs';

// Effects that are bonus 0 in mix-core now carry a real penalty.
export const RISK_BONUS=Object.freeze({wary:-.12,pungent:-.20,woozy:-.15,bitter:-.25,restless:-.10,jittery:-.15,scattered:-.20,volatile:-.30});
export const BAD_EFFECTS=Object.freeze(Object.keys(RISK_BONUS));
export const VALUE_FLOOR=.55;
export function isBad(id){return Object.hasOwn(RISK_BONUS,id);}
export function riskBonus(id){return Object.hasOwn(RISK_BONUS,id)?RISK_BONUS[id]:(effectById(id)?.bonus||0);}
const sumBonus=effects=>(effects||[]).reduce((sum,id)=>sum+riskBonus(id),0);
export function riskValue(base,effects){
 return Math.max(Math.round(base*VALUE_FLOOR),roundHalfEven(base*(1+sumBonus(effects))));
}
// A base gummy's price already includes its native effect, so a mix is judged
// against that: losing the native effect or gaining a bad one can lower the price.
export function mixedPrice(base,nativeEffects,effects){
 return Math.max(Math.round(base*VALUE_FLOOR),roundHalfEven(base*(1+sumBonus(effects)-sumBonus(nativeEffects))));
}

// FNV-1a over the joined parts, then a small mulberry32 stream.
export function hashParts(...parts){
 let h=2166136261;
 for(const part of parts){const text=String(part);for(let i=0;i<text.length;i++)h=Math.imul(h^text.charCodeAt(i),16777619);h=Math.imul(h^31,16777619);}
 return h>>>0;
}
export function rng(seed){
 let a=seed>>>0;
 return ()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};
}
export function newMixSeed(salt=0){return hashParts('gummy-bay-mix',salt)||1;}
export function recipeKeyOf(effects){return [...new Set(effects||[])].sort().join('|');}

const GOOD_BY_TIER=EFFECTS.filter(e=>!isBad(e.id));
export function jellyAdds(seed){return JELLY_POOL[hashParts(seed,'jelly')%JELLY_POOL.length];}
export function resolvedAdds(seed,item){return item?.adds==='?'?jellyAdds(seed):item?.adds;}

// What this save's careful mix of (base effects + ingredient) produces. A per-save
// roll can twist the recipe: a bad side effect, a lucky extra or a swapped effect.
export function recipeOutcome(seed,baseEffects,item){
 const adds=resolvedAdds(seed,item);
 const plain=applyPantryMix(baseEffects,item,adds);
 const roll=rng(hashParts(seed,'recipe',recipeKeyOf(baseEffects),item?.id));
 const chance=Math.min(.75,(item?.instability||0)*.9);
 let effects=plain.slice(),twist=null;
 if(item&&roll()<chance){
  const kind=roll();
  if(kind<.25){
   const tier=Math.min(5,2+Math.round((item.price||2)/3));
   const pool=GOOD_BY_TIER.filter(e=>e.tier<=tier&&!effects.includes(e.id));
   const pick=pool[Math.floor(roll()*pool.length)];
   if(pick&&effects.length<MAX_EFFECTS){effects.push(pick.id);twist={kind:'lucky',effect:pick.id};}
  }else if(kind<.70&&item.risks.length){
   const bad=item.risks[Math.floor(roll()*item.risks.length)];
   if(!effects.includes(bad)&&effects.length<MAX_EFFECTS){effects.push(bad);twist={kind:'side',effect:bad};}
  }else{
   const targets=[...new Set(Object.values(item.transforms))].filter(id=>!effects.includes(id));
   const slot=Math.floor(roll()*effects.length),next=targets[Math.floor(roll()*targets.length)];
   if(next&&effects.length){twist={kind:'swap',from:effects[slot],effect:next};effects[slot]=next;}
  }
 }
 return {effects,plain,adds,twist,key:recipeKeyOf(effects)};
}

// Stir quality is 0..1. A careful stir (bucket 4) is fully deterministic for a save;
// sloppier stirs mix in the batch counter so they stay a gamble every time.
export function stirBucket(stir){return Math.max(0,Math.min(4,Math.round((Number.isFinite(stir)?stir:.6)*4)));}
export function stirLabel(stir){return ['Lumpy','Sloppy','Okay','Smooth','Perfect'][stirBucket(stir)];}
export function fizzChance(stir,item,effects=[]){
 const s=Math.max(0,Math.min(1,Number.isFinite(stir)?stir:.6));
 const volatile=(effects||[]).includes('volatile')?.35:0;
 return Math.min(.9,(1-s)*((item?.instability||0)+volatile)*1.6);
}
export function stirOutcome({seed,key,ingredient,stir,count=1,nonce=0,item,effects=[]}){
 const bucket=stirBucket(stir);
 const roll=rng(hashParts(seed,'stir',key,ingredient,bucket,bucket<4?nonce:0));
 const p=fizzChance(bucket/4,item,effects);
 if(roll()<p){
  const lost=Math.min(Math.max(1,count),1+Math.floor(roll()*3));
  return {kind:'fizz',lost,bonus:0,flare:'volatile',bucket,label:stirLabel(bucket/4),chance:p};
 }
 if(bucket===4&&roll()<.18)return {kind:'perfect',lost:0,bonus:1,flare:null,bucket,label:'Perfect',chance:p};
 return {kind:'clean',lost:0,bonus:0,flare:null,bucket,label:stirLabel(bucket/4),chance:p};
}

// World consequences of selling an effect set.
export function saleConsequences(effects,{night=false}={}){
 const list=effects||[];
 let heat=0;const notes=[];
 if(list.includes('pungent')){heat+=8;notes.push('Pungent: the whole street can smell it (+8 heat).');}
 if(night&&list.includes('luminous')){heat+=5;notes.push('Luminous after dark: glowing customers draw patrols (+5 heat).');}
 return {heat,haggle:list.includes('wary')?.10:0,forgetPay:list.includes('scattered')?.10:0,notes};
}

// The reveal card's arithmetic: gained, lost and the price swing versus the base gummy.
export function revealSummary(baseEffects,result,basePrice){
 const before=new Set(baseEffects||[]),after=new Set(result||[]);
 const gained=[...after].filter(id=>!before.has(id)),lost=[...before].filter(id=>!after.has(id));
 const price=mixedPrice(basePrice,baseEffects,result),base=basePrice;
 return {gained,lost,price,base,delta:price-base,bad:[...after].filter(isBad)};
}
