// A deterministic "typical player" economy run. It uses the live price ladder, pantry,
// recipe twists, stir losses and equipment prices so tests can prove the money curve.
import {PANTRY} from './mix-pantry.mjs';
import {recipeOutcome,mixedPrice,stirOutcome,newMixSeed} from './mix-risk.mjs';

// Mirrors the STRAINS table in game.js (tests check the two stay in sync).
export const STRAIN_LADDER=Object.freeze([
 {name:'Pine Pop',price:30,level:1,seed:30,effect:'still'},
 {name:'Lemon Fizz',price:42,level:2,seed:35,effect:'sunny'},
 {name:'Purple Cloud',price:56,level:3,seed:40,effect:'breezy'},
 {name:'Blueberry Bounce',price:72,level:4,seed:45,effect:'zippy'},
 {name:'Frostbite',price:92,level:5,seed:74,effect:'quiet'},
 {name:'Sunset Gold',price:118,level:6,seed:100,effect:'zesty'}
].map(Object.freeze));
export const EQUIPMENT=Object.freeze({mixer:500,mixerLevel:2,tent:100,maxTents:6,bench:[220,420,620],benchLevel:2,benchStep:.15});
export const CUSTOMERS=5;
// Order size grows as regulars trust you: 1 gummy on day 1, up to 4 by day 10.
export const orderSize=day=>Math.min(4,1+Math.floor(day/3));
export const levelOf=xp=>Math.min(8,1+Math.floor(xp/30));
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
  cash+=revenue;xp+=5*sales.length+80*newRecipes+2*mixes;
  log.push({day,level,tents,bench,mixer,strain:L[base].name,units:sales.length,unitPrice:sales.length?Math.round(revenue/sales.length):0,avgSale:deals.length?Math.round(revenue/deals.length):0,topSale:Math.max(0,...deals),topUnit:top,revenue,cash});
  // Upgrades after the day's sales, keeping a seed reserve for tomorrow.
  const reserve=()=>L[Math.min(5,Math.max(0,levelOf(xp)-1))].seed*tents;
  if(!mixer&&levelOf(xp)>=EQUIPMENT.mixerLevel&&cash-EQUIPMENT.mixer>=reserve()){cash-=EQUIPMENT.mixer;mixer=true;}
  while(tents<EQUIPMENT.maxTents&&cash-EQUIPMENT.tent>=reserve()+EQUIPMENT.tent){cash-=EQUIPMENT.tent;tents++;}
  if(bench<3&&levelOf(xp)>=EQUIPMENT.benchLevel&&cash-EQUIPMENT.bench[bench]>=reserve()){cash-=EQUIPMENT.bench[bench];bench++;}
 }
 return log;
}

