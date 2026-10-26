// A deterministic "typical player" economy run. It uses the live price ladder, pantry,
// recipe twists, stir losses and equipment prices so tests can prove the money curve.
import {PANTRY} from './mix-pantry.mjs';
import {recipeOutcome,mixedPrice,stirOutcome,newMixSeed} from './mix-risk.mjs';
import {levelOf as rankOf} from './xp-curve.mjs';
import {NEW_RECIPE_XP} from './mix-core.mjs';

// Mirrors the STRAINS table in game.js (tests check the two stay in sync).
export const STRAIN_LADDER=Object.freeze([
 {name:'Pine Pop',price:30,level:1,seed:30,effect:'still'},
 {name:'Lemon Fizz',price:42,level:2,seed:35,effect:'sunny'},
 {name:'Purple Cloud',price:56,level:3,seed:40,effect:'breezy'},
 {name:'Blueberry Bounce',price:72,level:4,seed:45,effect:'zippy'},
 {name:'Frostbite',price:92,level:5,seed:74,effect:'quiet'},
 {name:'Sunset Gold',price:118,level:7,seed:100,effect:'zesty'}
].map(Object.freeze));
export const EQUIPMENT=Object.freeze({mixer:500,mixerLevel:2,tent:100,maxTents:6,bench:[220,420,620],benchLevel:2,benchStep:.15});
export const CUSTOMERS=5;
// Order size grows as regulars trust you: 1 gummy on day 1, up to 4 by day 10.
export const orderSize=day=>Math.min(4,1+Math.floor(day/3));
export const levelOf=rankOf;
export const unitValue=(price,bench)=>Math.round(price*(1+bench*EQUIPMENT.benchStep));

export function bestRecipe(seed,base,known,level,L=STRAIN_LADDER){
 const strain=L[base];let best={ingredient:-1,price:strain.price,effects:[strain.effect],cost:0};
 for(const i of known){const item=PANTRY[i];if(!item||item.unlockLevel>level)continue;
  const out=recipeOutcome(seed,[strain.effect],item),price=mixedPrice(strain.price,[strain.effect],out.effects);
  if(price-item.price>best.price-best.cost)best={ingredient:i,price,effects:out.effects,cost:item.price};}
 return best;
}

export function simulateEconomy({days=12,seed=newMixSeed(7),stir=.75,tries=2,ladder=STRAIN_LADDER}={}){
 const L=ladder;
 let cash=50,xp=0,tents=1,bench=0,mixer=false,mixes=0;const known=new Map(),log=[],stock=[];
 for(let day=1;day<=days;day++){
  const level=levelOf(xp);
  let base=0;for(let b=L.length-1;b>=0;b--){if(L[b].level<=level&&cash>=L[b].seed*tents){base=b;break;}}
  if(!(day===1))cash-=L[base].seed*tents; // day one's seed is in the starter budget
  let units=tents*4,newRecipes=0,top=0;const sold=[];
  const knownHere=known.get(base)||new Set();known.set(base,knownHere);
  if(mixer){
   const untried=PANTRY.map((p,i)=>i).filter(i=>PANTRY[i].unlockLevel<=level&&!knownHere.has(i));
   for(const i of untried.slice(0,tries)){if(units<1)break;const item=PANTRY[i];cash-=item.price;units--;mixes++;
    const out=recipeOutcome(seed,[L[base].effect],item);knownHere.add(i);newRecipes++;
    const fizz=stirOutcome({seed,key:out.key,ingredient:item.id,stir,count:1,nonce:mixes,item,effects:out.effects});
    if(!fizz.lost)sold.push(unitValue(mixedPrice(L[base].price,[L[base].effect],out.effects),bench));}
   const best=bestRecipe(seed,base,knownHere,level,L);
   for(let batch=0;units>0;batch++){const count=Math.min(4,units);units-=count;
    if(best.ingredient<0){for(let k=0;k<count;k++)sold.push(unitValue(L[base].price,bench));continue;}
    const item=PANTRY[best.ingredient];cash-=item.price*count;mixes++;
    const fizz=stirOutcome({seed,key:best.effects.join('|'),ingredient:item.id,stir,count,nonce:mixes,item,effects:best.effects});
    for(let k=0;k<count-fizz.lost+fizz.bonus;k++)sold.push(unitValue(best.price,bench));}
  }else for(let k=0;k<units;k++)sold.push(unitValue(L[base].price,bench));
  // Five regulars, one order each per day. Unsold stock keeps for tomorrow's orders.
  stock.push(...sold);stock.sort((a,b)=>b-a);
  const demand=day===1?2:CUSTOMERS*orderSize(day),sales=stock.splice(0,demand);stock.splice(CUSTOMERS*8);
  const deals=[];for(let i=0;i<sales.length;i+=orderSize(day))deals.push(sales.slice(i,i+orderSize(day)).reduce((a,b)=>a+b,0));
  const revenue=sales.reduce((a,b)=>a+b,0);top=Math.max(0,...sales);
  cash+=revenue;xp+=5*sales.length+NEW_RECIPE_XP*newRecipes+2*mixes;
  log.push({day,level,tents,bench,mixer,strain:L[base].name,units:sales.length,unitPrice:sales.length?Math.round(revenue/sales.length):0,avgSale:deals.length?Math.round(revenue/deals.length):0,topSale:Math.max(0,...deals),topUnit:top,revenue,cash});
  // Upgrades after the day's sales, keeping a seed reserve for tomorrow.
  const reserve=()=>L[Math.min(5,Math.max(0,levelOf(xp)-1))].seed*tents;
  if(!mixer&&levelOf(xp)>=EQUIPMENT.mixerLevel&&cash-EQUIPMENT.mixer>=reserve()){cash-=EQUIPMENT.mixer;mixer=true;}
  while(tents<EQUIPMENT.maxTents&&cash-EQUIPMENT.tent>=reserve()+EQUIPMENT.tent){cash-=EQUIPMENT.tent;tents++;}
  if(bench<3&&levelOf(xp)>=EQUIPMENT.benchLevel&&cash-EQUIPMENT.bench[bench]>=reserve()){cash-=EQUIPMENT.bench[bench];bench++;}
 }
 return log;
}

// ---- v142: the same run with the Sweet Network (dealers, runners, production crew) ----
// The player still serves their five regulars by hand; surplus and crew output go to the
// stockroom, runners carry it to dealers, and dealers sell to district customers for a cut.
import {freshEmpire,advanceEmpire,recruitDealer,hireCrew,crewSlots,slotUpgradeCost,DEALER_ROSTER,RUNNER_ROSTER,DAY} from './dealer-network.mjs';
export const HOUSES=Object.freeze([{cost:0,level:0},{cost:1200,level:3},{cost:3500,level:5}]);
export function simulateNetwork({days=15,seed=newMixSeed(7),stir=.75,tries=2,ladder=STRAIN_LADDER,heat=25,plan=true}={}){
 const L=ladder;let tents=1,bench=0,mixer=false,mixes=0;const known=new Map(),log=[];let stock=[];
 const prices=[];const priceIndex=p=>{let i=prices.indexOf(p);if(i<0){prices.push(p);i=prices.length-1;}return i;};
 const s={cash:50,xp:0,heat,sold:0,earned:0,house:0,raw:[0],storedPacks:[],wrappers:1e9};s.empire=freshEmpire(DAY,seed>>>0||1);
 let today={base:0,best:null,price:L[0].price};
 const storage=()=>[40,160,400][s.house];
 const ctx={price:t=>prices[t]||0,baseCount:1,bestBase:()=>0,seedCost:()=>Math.round(L[today.base].seed),name:()=>L[today.base].name,
  storageLeft:()=>storage()-s.storedPacks.reduce((a,b)=>a+(b||0),0),
  benchPlan:()=>s.raw[0]>0?{out:priceIndex(today.price)}:null,
  benchUse:()=>{if(s.raw[0]<1)return false;const c=today.best?.cost||0;if(s.cash<c)return false;s.raw[0]--;s.cash-=c;return true;}};
 for(let day=1;day<=days;day++){
  const level=levelOf(s.xp);
  let base=0;for(let b=L.length-1;b>=0;b--){if(L[b].level<=level&&s.cash>=L[b].seed*tents){base=b;break;}}
  if(day!==1)s.cash-=L[base].seed*tents;
  let units=tents*4,newRecipes=0;const sold=[];
  const knownHere=known.get(base)||new Set();known.set(base,knownHere);let best=null;
  if(mixer){
   const untried=PANTRY.map((p,i)=>i).filter(i=>PANTRY[i].unlockLevel<=level&&!knownHere.has(i));
   for(const i of untried.slice(0,tries)){if(units<1)break;const item=PANTRY[i];s.cash-=item.price;units--;mixes++;
    const out=recipeOutcome(seed,[L[base].effect],item);knownHere.add(i);newRecipes++;
    const fizz=stirOutcome({seed,key:out.key,ingredient:item.id,stir,count:1,nonce:mixes,item,effects:out.effects});
    if(!fizz.lost)sold.push(unitValue(mixedPrice(L[base].price,[L[base].effect],out.effects),bench));}
   best=bestRecipe(seed,base,knownHere,level,L);
   for(let batch=0;units>0;batch++){const count=Math.min(4,units);units-=count;
    if(best.ingredient<0){for(let k=0;k<count;k++)sold.push(unitValue(L[base].price,bench));continue;}
    const item=PANTRY[best.ingredient];s.cash-=item.price*count;mixes++;
    const fizz=stirOutcome({seed,key:best.effects.join('|'),ingredient:item.id,stir,count,nonce:mixes,item,effects:best.effects});
    for(let k=0;k<count-fizz.lost+fizz.bonus;k++)sold.push(unitValue(best.price,bench));}
  }else for(let k=0;k<units;k++)sold.push(unitValue(L[base].price,bench));
  today={base,best,price:unitValue(best&&best.ingredient>=0?best.price:L[base].price,bench)};
  stock.push(...sold);stock.sort((a,b)=>b-a);
  const demand=day===1?2:CUSTOMERS*orderSize(day),sales=stock.splice(0,demand);
  // Leftovers beyond tomorrow's own orders go to the stockroom for the runners.
  const keep=CUSTOMERS*orderSize(day+1);if(plan&&Object.keys(s.empire.dealers).length){for(const p of stock.splice(keep)){const t=priceIndex(p);s.storedPacks[t]=(s.storedPacks[t]||0)+1;}}else stock.splice(CUSTOMERS*8);
  const deals=[];for(let i=0;i<sales.length;i+=orderSize(day))deals.push(sales.slice(i,i+orderSize(day)).reduce((a,b)=>a+b,0));
  const own=sales.reduce((a,b)=>a+b,0),cash0=s.cash+own,st0={...s.empire.stats};
  s.cash+=own;s.earned+=own;s.sold+=sales.length;s.xp+=5*sales.length+NEW_RECIPE_XP*newRecipes+2*mixes;
  for(let i=0;i<s.storedPacks.length;i++)s.storedPacks[i]=s.storedPacks[i]||0;
  advanceEmpire(s,{...ctx,to:(day+1)*DAY});
  const st=s.empire.stats,net=Math.round(s.cash-cash0);
  log.push({day,level,tents,bench,mixer,house:s.house,strain:L[base].name,units:sales.length,unitPrice:sales.length?Math.round(own/sales.length):0,avgSale:deals.length?Math.round(own/deals.length):0,topUnit:Math.max(0,...sales),
   own,network:net,dealerUnits:st.dealerSales-st0.dealerSales,dealerUnit:st.dealerSales>st0.dealerSales?Math.round((st.dealerGross-st0.dealerGross)/(st.dealerSales-st0.dealerSales)):0,
   busts:st.busts-st0.busts,shorted:st.shorted-st0.shorted,wages:st.wages-st0.wages,dealers:Object.keys(s.empire.dealers).length,runners:Object.keys(s.empire.runners).length,crew:s.empire.crew.length,revenue:Math.round(own+net),cash:Math.round(s.cash)});
  if(!plan)continue;
  // A sensible player's upgrade order: tools first, then property, then people.
  const lv=levelOf(s.xp),reserve=()=>L[Math.min(5,Math.max(0,lv-1))].seed*tents+150;
  if(!mixer&&lv>=EQUIPMENT.mixerLevel&&s.cash-EQUIPMENT.mixer>=reserve()){s.cash-=EQUIPMENT.mixer;mixer=true;}
  while(tents<EQUIPMENT.maxTents&&s.cash-EQUIPMENT.tent>=reserve()+EQUIPMENT.tent){s.cash-=EQUIPMENT.tent;tents++;}
  if(bench<3&&lv>=EQUIPMENT.benchLevel&&s.cash-EQUIPMENT.bench[bench]>=reserve()){s.cash-=EQUIPMENT.bench[bench];bench++;}
  for(const h of [1,2])if(s.house<h&&lv>=HOUSES[h].level&&s.cash-HOUSES[h].cost>=reserve()+300){s.cash-=HOUSES[h].cost;s.house=h;}
  for(const d of DEALER_ROSTER)if(!s.empire.dealers[d.id]&&s.cash-d.fee>=reserve()+200){const r=recruitDealer(s.empire,d.id,{level:lv,cash:s.cash});if(r.ok){s.cash-=r.cost;const x=s.empire.dealers[d.id];for(const c of ['3','4','5','6','7','8','9','10'].slice(0,d.cap-3))x.customers.push(d.id+'-'+c);}}
  for(const r of RUNNER_ROSTER)if(!s.empire.runners[r.id]&&Object.keys(s.empire.dealers).length>(r.id==='pip'?0:1)&&lv>=r.unlock&&s.cash-r.fee>=reserve()+200){s.cash-=r.fee;s.empire.runners[r.id]={hired:true,auto:true,state:"idle",target:null,cargo:{},cash:0,leg:0,legTotal:1,trips:0};}
  for(let hires=0;hires<1&&s.cash>=reserve()+600;){const growers=s.empire.crew.filter(c=>c.role==='grower').length,benches=s.empire.crew.length-growers,role=benches<growers?'bench':'grower';
   if(s.empire.crew.length>=crewSlots(s.empire,s.house)){const c=slotUpgradeCost(s.empire);if(c==null||s.house<2||s.cash-c<reserve()+600)break;s.cash-=c;s.empire.slotsBought++;continue;}
   const r=hireCrew(s.empire,{role,level:lv,cash:s.cash,house:s.house});if(!r.ok)break;s.cash-=r.cost;hires++;}
 }
 return log;
}
