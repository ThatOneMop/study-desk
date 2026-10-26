// The live bench uses the four starter ingredients. Strain slots stay 6 bases + 4 mixes.
import {applyMix,productValue,recipeName,recipeXp,ingredientById,batchMinutes} from './mix-core.mjs';
export const BASE_EFFECTS=Object.freeze(['still','sunny','breezy','zippy','quiet','zesty'].map(id=>Object.freeze([id])));
export const BENCH_SLOTS=Object.freeze([
 {id:'peel',color:0xe3b662},
 {id:'fizz',color:0xa8c36f},
 {id:'glaze',color:0xe8d9b2},
 {id:'dust',color:0xb58bb6}
].map(Object.freeze));
export function benchIngredient(index){
 const slot=BENCH_SLOTS[index],item=slot?ingredientById(slot.id):null;
 if(!item)return null;
 return {name:item.name,effect:item.adds,cost:item.price,color:slot.color,mixId:item.id};
}
export function recipeKey(effects){return [...new Set(effects||[])].sort().join('|');}
export function mixResult(baseIndex,ingredientIndex,basePrice){
 const base=BASE_EFFECTS[baseIndex],ingredient=benchIngredient(ingredientIndex);
 if(!base||!ingredient||!Number.isFinite(basePrice))return null;
 const effects=applyMix(base,ingredient.mixId);
 return {effects,recipe:recipeName(effects),price:productValue(basePrice,effects),key:recipeKey(effects),mixId:ingredient.mixId};
}
export function mixExperience(known){return recipeXp(!!known);}
export function mixStationSeconds(units=1){return batchMinutes('mk1',units);}
