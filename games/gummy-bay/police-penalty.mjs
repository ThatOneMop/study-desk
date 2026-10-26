// What a Sugar Squad search or bust costs you. One rule for both paths:
//  · Day 1 is protected: a warning, nothing taken, no fine.
//  · Days 2-3 are gentle: half of each carried stack is confiscated (rounded down).
//  · From day 4: every carried stack goes, minus any stack you slipped.
// The fine is 30% of the cash in hand, at least $20 and never more than you hold.
// It is charged only when something was confiscated or you ran. Stored stock and the bank are never touched.
import {bustFine} from './busted.mjs?v=132';
export const PROTECTED_DAYS=1;
export const GENTLE_UNTIL_DAY=3;
export function penaltyTier(day){
 const d=Number.isFinite(day)?Math.floor(day):1;
 return d<=PROTECTED_DAYS?'warning':d<=GENTLE_UNTIL_DAY?'gentle':'full';
}
export function searchPenalty({day=1,cash=0,raw=[],gummies=[],packs=[],spared=null,fled=false}={}){
 const tier=penaltyTier(day),lists={raw,gummies,packs},kept={};let seized=0;
 for(const key of ['raw','gummies','packs']){
  const list=Array.isArray(lists[key])?lists[key]:[];
  kept[key]=list.map((qty,index)=>{
   const have=Number.isFinite(qty)?Math.max(0,qty):0;
   if(tier==='warning')return have;
   const slipped=spared&&spared.key===key&&spared.index===index?Math.min(have,Number(spared.qty)||0):0;
   const keep=tier==='gentle'?Math.max(slipped,have-Math.floor(have/2)):slipped;
   seized+=have-keep;return keep;
  });
 }
 const fine=tier==='warning'?0:(seized>0||fled)?bustFine(cash):0;
 return {tier,seized,fine,...kept};
}
export function penaltyMessage({tier,seized,fine},cashText=n=>'$'+n){
 if(tier==='warning')return 'Sugar Squad warning: first day in town, so they let you off. Keep it out of sight.';
 if(seized)return 'Police seized '+seized+' gummy product'+(seized===1?'':'s')+(tier==='gentle'?' (half your carried stock)':'')+' · '+cashText(fine)+' fine. Stored stock is safe.';
 if(fine)return 'Released · '+cashText(fine)+' fine for running.';
 return 'Search clear. No illegal gummies found.';
}
