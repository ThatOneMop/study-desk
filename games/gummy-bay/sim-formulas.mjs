// Customer, deal, rank and crew arithmetic. Original gummy shop. Not wired into the live loop.
export const RANKS=Object.freeze(['Driftwood','Hawker','Stallhand','Counter','Shelf','Borough','Wharf','Coast','Bay','Keeper','Founder']);
export const QUALITY=Object.freeze({trash:0,poor:.25,standard:.5,premium:.75,heavenly:1});
export const STANDARDS=Object.freeze({veryLow:'trash',low:'poor',moderate:'standard',high:'premium',veryHigh:'heavenly'});
export const ENJOYMENT_WEIGHTS=Object.freeze({affinity:.3,effects:.4,quality:.3});
export const APPEAL_ROLL=Object.freeze([.5,.25,.125,.125]);
export const MIN_APPEAL=.05;
export const SAMPLE_CURVE=Object.freeze([[.1,.04],[.25,.10],[.4,.33],[.5,.48],[.6,.63],[.7,.78],[.75,.85],[.8,.88],[.9,.94],[1,1]]);
export const SAMPLE_XP=50,COUNTER_XP=5,PLAYER_DELIVERY_XP=20,RUNNER_DELIVERY_XP=10;
export const REJECTION_LOYALTY=-.5;
export const CRAVING_SEEK=.33;
export const NIGHTLY_CRAVING_DECAY=.0625;
export const DEAL_WINDOWS=Object.freeze([0,360,720,1080]);
export const QUICK_DEAL_MINUTES=60;
export const ATM_WEEKLY_CAP=10000;
export const LAUNDER=Object.freeze([
 {capacity:2000,cost:4000,hours:24},{capacity:4000,cost:10000,hours:24},
 {capacity:6000,cost:20000,hours:24},{capacity:8000,cost:50000,hours:24}
]);
export const WAGES=Object.freeze({gardener:200,mixer:300,packer:200,sweeper:100});
export const RUNNER_CUT=.2,RUNNER_CUSTOMERS=10,RUNNER_SPEED=1.2;
export const INFLUENCE_UNLOCK=-.075,INFLUENCE_GRAFFITI=-.05,DISTRICT_UNLOCK=.3;
export const RIVAL_LOYALTY=1.25;
export const LAW_TARGET=Object.freeze({vision:45,curfewStart:21*60,curfewEnd:5*60,pursuitLevels:4});
export const CHECKLIST_SECONDS=.5;

const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));

export function rankMultiplier(rank,tier=1,extra=0){
 const last=RANKS.length-1;
 const safeRank=clamp(rank|0,0,last);
 if(safeRank===last)return 1+.25*last+.1*clamp(extra|0,0,9);
 return 1+.25*(safeRank+clamp((tier|0)-1,0,4)/4);
}
export function weeklyOrders(minOrders,maxOrders,craving,loyalty){
 const drive=clamp(Math.max(craving,loyalty/5),0,1);
 return Math.round(minOrders+(maxOrders-minOrders)*drive);
}
export function orderSpacing(orders){return Math.max(1,Math.round(7/Math.max(1,orders)));}
export function weeklyBudget(minSpend,maxSpend,loyalty,multiplier){
 return multiplier*(minSpend+(maxSpend-minSpend)*clamp(loyalty/5,0,1));
}
export function appeal(enjoyment,price,value){
 if(!(value>0))return enjoyment;
 return enjoyment+1-2*clamp(price/(2*value),0,1);
}
export function pickAppeal(ranked,roll){
 const pool=ranked.filter(item=>item.appeal>=MIN_APPEAL).slice(0,4);
 if(!pool.length)return null;
 let cursor=0;
 for(let i=0;i<pool.length;i++){cursor+=APPEAL_ROLL[i]??APPEAL_ROLL.at(-1);if(roll<cursor)return pool[i];}
 return pool.at(-1);
}
export function valueProposition(market,unitPrice){
 if(!(unitPrice>0))return 2;
 const power=market<unitPrice?2.5:1;
 return clamp((market/unitPrice)**power,0,2);
}
export function quantityFactor(quantity,original){
 if(!(original>0))return 0;
 return clamp(1-Math.abs(quantity-original)/original,0,1);
}
export function judgeCounter({market,originalQty,originalTotal,nextQty,nextTotal,enjoyment,weekly,orders,craving,loyalty,roll}){
 const typical=orders>0?weekly/orders:Infinity;
 if(nextTotal>=3*typical)return {accepted:false,chance:0,reason:'ceiling'};
 const originalUnit=originalQty>0?originalTotal/originalQty:Infinity;
 const nextUnit=nextQty>0?nextTotal/nextQty:Infinity;
 const oldScore=valueProposition(market,originalUnit);
 const nextScore=valueProposition(market,nextUnit);
 const qty=quantityFactor(nextQty,originalQty);
 if(qty*nextScore>oldScore)return {accepted:true,chance:1,reason:'better'};
 if(nextScore<.12)return {accepted:false,chance:0,reason:'greedy'};
 const ease=(enjoyment+1)/2;
 if(qty*ease*nextScore>oldScore*enjoyment)return {accepted:true,chance:1,reason:'enjoyment'};
 const drive=clamp(Math.max(craving,loyalty/5),0,1);
 const gap=clamp((oldScore*enjoyment-qty*ease*nextScore)/.2,0,1);
 const chance=clamp(1-(gap-.2*drive)/.9,0,1);
 return {accepted:roll<chance,chance,reason:'roll'};
}
export function sampleScore(bestEnjoyment,loyalty,craving,friendLoyalty){
 const relationship=clamp(2*(loyalty/5-.5),0,1);
 const friends=clamp(2*(friendLoyalty/5-.5),0,1);
 return bestEnjoyment+.2*relationship+.2*clamp(craving,0,1)+.2*friends;
}
export function sampleAcceptance(score){
 for(const [x,y] of SAMPLE_CURVE)if(Math.abs(score-x)<1e-9)return y;
 if(score<=SAMPLE_CURVE[0][0])return SAMPLE_CURVE[0][1];
 if(score>=SAMPLE_CURVE.at(-1)[0])return SAMPLE_CURVE.at(-1)[1];
 for(let i=1;i<SAMPLE_CURVE.length;i++){
  const [x0,y0]=SAMPLE_CURVE[i-1],[x1,y1]=SAMPLE_CURVE[i];
  if(score<=x1)return y0+(y1-y0)*(score-x0)/(x1-x0);
 }
 return SAMPLE_CURVE.at(-1)[1];
}
export function afterDelivery({satisfaction,addictiveness}){
 const mood=clamp(satisfaction,0,1);
 return {loyalty:mood-.5,craving:addictiveness/5,xp:PLAYER_DELIVERY_XP};
}
export function dealPay(price,{curfew=false,rain=false,quick=false,qualityTiers=0,extraUnits=0,satisfaction=1}={}){
 const quality=qualityTiers>=.2?qualityTiers:0;
 const bonus=1+(curfew?.2:0)+(rain?.2:0)+(quick?.1:0)+.15*quality;
 const tip=satisfaction>=.99?10*Math.max(0,extraUnits):0;
 return price*bonus+tip;
}
export function decayCraving(craving,base,dryNight){
 const next=dryNight?craving-NIGHTLY_CRAVING_DECAY:craving;
 return clamp(Math.max(base,next),0,1);
}
export function approachCooldown(craving){return 4320-2160*clamp(craving,0,1);}
export function approachChance(craving){return .5*clamp(craving,0,1)/1440;}
export function playerKeepsOrder(loyalty){
 if(loyalty>=RIVAL_LOYALTY)return 1;
 return clamp(4*(loyalty/5),0,1);
}
export function influenceAfter(value,{unlock=0,graffiti=0}={}){
 return clamp(value+unlock*INFLUENCE_UNLOCK+graffiti*INFLUENCE_GRAFFITI,0,1);
}
export function signingFee(daily,alreadyHired){return daily+Math.min(100*Math.max(0,alreadyHired),500);}
export function runnerPay(sale){return sale*(1-RUNNER_CUT);}
