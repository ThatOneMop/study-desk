// Gummy Bay "Sweet Network": dealers, runners and production crew. DOM-free and seeded,
// so the live game and the economy sim run the exact same rules.
// Everything is a cartoon candy business: busts mean the Sugar Squad confiscates gummies.
export const DAY=1440;
export const DEALER_ROSTER=Object.freeze([
 {id:'benny',name:'Benny Boardwalk',district:'Old Town',x:-14,z:-9,unlock:3,fee:300,cut:.30,cap:5,stockCap:16,caution:.55,honesty:.9,leg:40,color:0x4f8fbf,line:'I know every bench in Old Town. And every grandma on them.'},
 {id:'mo',name:'Mo Marmalade',district:'East Market',x:104,z:-152,unlock:5,fee:800,cut:.25,cap:7,stockCap:24,caution:.45,honesty:.8,leg:70,color:0xd9822b,line:'Market folk love a sticky deal. Literally.'},
 {id:'cleo',name:'Cleo Caramel',district:'West Harbor',x:-178,z:-8,unlock:6,fee:1600,cut:.22,cap:9,stockCap:32,caution:.7,honesty:.95,leg:90,color:0xb0572f,line:'Sailors tip in doubloons. I convert.'},
 {id:'dex',name:'Dex Dimple',district:'North Heights',x:-8,z:-292,unlock:8,fee:3000,cut:.18,cap:11,stockCap:40,caution:.5,honesty:.85,leg:120,color:0x7b5fb5,line:'Heights people want the fancy stuff. I wear a scarf.'}
].map(Object.freeze));
export const RUNNER_ROSTER=Object.freeze([
 {id:'pip',name:'Pip on a BMX',unlock:4,fee:400,capacity:10,speed:1,trip:20},
 {id:'rosa',name:'Rosa Rollerblades',unlock:6,fee:1100,capacity:18,speed:1.4,trip:30}
].map(Object.freeze));
export const CREW=Object.freeze({unlock:3,hire:250,wage:{grower:60,bench:80},growMinutes:180,growYield:4,benchMinutes:40,shiftStart:8*60,shiftEnd:20*60,
 slots:Object.freeze([1,2,4]),upgrade:Object.freeze([900,2200])});
export const RISK=Object.freeze({bustBase:.004,bustHeat:.03,layLow:2*DAY,seize:.5,bustHeatGain:8,runnerHeat:40,runnerStop:.05,shortBase:.5,shortMin:.1,shortSpan:.2});
const NAMES=['Abe','Bea','Cass','Dot','Eli','Fern','Gus','Hattie','Ivo','Jo','Kit','Lou','Mabel','Ned','Opal','Quinn','Ruby','Sid','Tess','Ugo','Vi','Wes','Yara','Zed'];
const SURNAMES=['Puddle','Crumb','Fudge','Waffle','Biscuit','Treacle','Pickle','Muffin','Sprout','Noodle','Button','Toffee','Crumpet','Jelly'];
const hash=(...v)=>{let h=2166136261;for(const x of v.join('|')){h^=x.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;};
// Seeded PRNG whose state lives in the save, so reloading never rerolls an outcome.
export function nextRandom(e){let t=(e.rng=(e.rng+0x6D2B79F5)>>>0);t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;}
export function districtCustomers(id){
 const d=DEALER_ROSTER.find(x=>x.id===id);if(!d)return [];
 return Array.from({length:12},(_,i)=>{const h=hash(id,i);return {id:id+'-'+i,name:NAMES[h%NAMES.length]+' '+SURNAMES[(h>>>17)%SURNAMES.length],appetite:1+(h>>>5)%3,budget:Math.round((.92+((h>>>9)%24)/100)*100)/100,every:18+(h>>>13)%13};});
}
export const dealerOf=id=>DEALER_ROSTER.find(d=>d.id===id)||null;
export const runnerOf=id=>RUNNER_ROSTER.find(r=>r.id===id)||null;
export const stockTotal=stock=>Object.values(stock||{}).reduce((a,b)=>a+(b>0?b:0),0);
export function freshEmpire(clock=0,seed=1){return {v:1,clock,rng:seed>>>0,dealers:{},runners:{},crew:[],slotsBought:0,orders:{},log:[],stats:{dealerSales:0,dealerGross:0,dealerNet:0,cuts:0,shorted:0,busts:0,wages:0,runnerFees:0,made:0,grown:0,seized:0}};}
const num=(v,d=0)=>Number.isFinite(v)?v:d;
const cleanStock=(o,count)=>{const out={};for(const [k,v] of Object.entries(o||{})){const t=+k;if(Number.isInteger(t)&&t>=0&&t<count&&v>0)out[t]=Math.floor(v);}return out;};
export function normalizeEmpire(e,{clock=0,strainCount=64}={}){
 const f=freshEmpire(clock);if(!e||typeof e!=='object')return f;
 const out={...f,clock:Number.isFinite(e.clock)?Math.min(e.clock,clock||e.clock):clock,rng:Number.isInteger(e.rng)?e.rng>>>0:f.rng,slotsBought:Math.max(0,Math.min(CREW.upgrade.length,e.slotsBought|0)),stats:{...f.stats}};
 for(const k of Object.keys(f.stats))out.stats[k]=num(e.stats?.[k]);
 for(const d of DEALER_ROSTER){const x=e.dealers?.[d.id];if(!x?.hired)continue;const pool=new Set(districtCustomers(d.id).map(c=>c.id));
  out.dealers[d.id]={hired:true,stock:cleanStock(x.stock,strainCount),owed:Math.max(0,Math.round(num(x.owed))),customers:[...new Set((x.customers||[]).filter(c=>pool.has(c)))].slice(0,d.cap),strain:Number.isInteger(x.strain)&&x.strain>=-1&&x.strain<strainCount?x.strain:-1,target:Math.max(2,Math.min(d.stockCap,x.target|0||Math.round(d.stockCap*.75))),lowUntil:num(x.lowUntil),sold:num(x.sold),earned:num(x.earned),missed:num(x.missed),shorted:num(x.shorted),busts:num(x.busts)};}
 for(const r of RUNNER_ROSTER){const x=e.runners?.[r.id];if(!x?.hired)continue;
  out.runners[r.id]={hired:true,auto:x.auto!==false,state:['idle','out','back'].includes(x.state)?x.state:'idle',target:dealerOf(x.target)?x.target:null,cargo:cleanStock(x.cargo,strainCount),cash:Math.max(0,num(x.cash)),leg:Math.max(0,num(x.leg)),legTotal:Math.max(1,num(x.legTotal,1)),trips:num(x.trips)};
  if(out.runners[r.id].state!=='idle'&&!out.runners[r.id].target)Object.assign(out.runners[r.id],{state:'idle',leg:0});}
 out.crew=(Array.isArray(e.crew)?e.crew:[]).filter(c=>c&&['grower','bench'].includes(c.role)).slice(0,CREW.slots[2]+CREW.upgrade.length).map(c=>({role:c.role,strain:Number.isInteger(c.strain)&&c.strain>=-1&&c.strain<strainCount?c.strain:-1,work:Math.max(0,num(c.work)),on:c.on!==false,status:String(c.status||'')}));
 for(const [k,v] of Object.entries(e.orders||{}))if(Number.isFinite(v))out.orders[k]=v;
 out.log=(Array.isArray(e.log)?e.log:[]).filter(x=>x&&typeof x.text==='string').slice(-24).map(x=>({at:num(x.at),kind:String(x.kind||'info'),text:x.text}));
 return out;
}
function note(e,at,kind,text,events){const n={at,kind,text};e.log.push(n);if(e.log.length>24)e.log.splice(0,e.log.length-24);events?.push(n);}
// ---- Property slots and crew ----
export const crewSlots=(e,house)=>(CREW.slots[Math.max(0,Math.min(2,house|0))]||1)+(e.slotsBought|0);
export function hireCrew(e,{role,level,cash,house}){
 if(!['grower','bench'].includes(role))return {ok:false,reason:'Unknown role'};
 if(level<CREW.unlock)return {ok:false,reason:'Reach level '+CREW.unlock+' to hire production crew'};
 if(e.crew.length>=crewSlots(e,house))return {ok:false,reason:'No free work slot. Move to a bigger place or add a slot'};
 if(cash<CREW.hire)return {ok:false,reason:'Signing fee is $'+CREW.hire};
 e.crew.push({role,strain:-1,work:0,on:true,status:'Starting shift'});return {ok:true,cost:CREW.hire};
}
export function slotUpgradeCost(e){return CREW.upgrade[e.slotsBought|0]??null;}
// Extra work slots need a real property (not the starter room).
export function buySlot(e,{house,cash}){const c=slotUpgradeCost(e);if(c==null)return {ok:false,reason:'Every slot is already built'};if((house|0)<1)return {ok:false,reason:'Move out of the starter room to add work slots'};if(cash<c)return {ok:false,reason:'A new slot costs $'+c};e.slotsBought++;return {ok:true,cost:c};}
export function fireCrew(e,i){if(!e.crew[i])return false;e.crew.splice(i,1);return true;}
export function hireRunner(e,id,{level,cash}){const r=runnerOf(id);if(!r)return {ok:false,reason:'Unknown runner'};if(e.runners[id])return {ok:false,reason:r.name+' already runs for you'};if(level<r.unlock)return {ok:false,reason:'Reach level '+r.unlock+' first'};if(!Object.keys(e.dealers).length)return {ok:false,reason:'Recruit a dealer first'};if(cash<r.fee)return {ok:false,reason:'Signing fee is $'+r.fee};e.runners[id]={hired:true,auto:true,state:'idle',target:null,cargo:{},cash:0,leg:0,legTotal:1,trips:0};return {ok:true,cost:r.fee};}
// Send a runner now: to restock (if the stockroom has packs) and pick up the takings.
export function dispatchRunner(s,id,dealer,price){const e=s.empire,r=runnerOf(id),x=e.runners[id],d=e.dealers[dealer];if(!r||!x||!d||x.state!=='idle')return false;x.target=dealer;x.cargo=s.storedPacks?loadCargo(s.storedPacks,d,restockNeed(e,dealer),r.capacity,price):{};x.legTotal=x.leg=Math.max(15,Math.round(dealerOf(dealer).leg/r.speed));x.state='out';x.trips++;return true;}
// ---- Dealers ----
export function recruitDealer(e,id,{level,cash}){
 const d=dealerOf(id);if(!d)return {ok:false,reason:'Unknown dealer'};
 if(e.dealers[id])return {ok:false,reason:d.name+' already works with you'};
 if(level<d.unlock)return {ok:false,reason:'Reach level '+d.unlock+' first'};
 if(cash<d.fee)return {ok:false,reason:'Signing fee is $'+d.fee};
 e.dealers[id]={hired:true,stock:{},owed:0,customers:districtCustomers(id).slice(0,3).map(c=>c.id),strain:-1,target:Math.round(d.stockCap*.75),lowUntil:0,sold:0,earned:0,missed:0,shorted:0,busts:0};
 return {ok:true,cost:d.fee};
}
export function assignCustomer(e,id,cid){const d=dealerOf(id),x=e.dealers[id];if(!d||!x)return false;if(x.customers.includes(cid)||x.customers.length>=d.cap)return false;if(!districtCustomers(id).some(c=>c.id===cid))return false;x.customers.push(cid);return true;}
export function unassignCustomer(e,id,cid){const x=e.dealers[id];if(!x)return false;const n=x.customers.length;x.customers=x.customers.filter(c=>c!==cid);return x.customers.length<n;}
// Hand packs over in person (from the player's carried array) or via a runner's cargo.
export function restockDealer(e,id,packs,t,qty){
 const d=dealerOf(id),x=e.dealers[id];if(!d||!x||!Array.isArray(packs))return 0;
 const room=d.stockCap-stockTotal(x.stock),n=Math.max(0,Math.min(qty|0,room,packs[t]|0));if(!n)return 0;
 packs[t]-=n;x.stock[t]=(x.stock[t]||0)+n;return n;
}
export function collectDealer(e,id){const x=e.dealers[id];if(!x)return 0;const c=x.owed;x.owed=0;return c;}
export const dealerLow=(e,id,now)=>!!e.dealers[id]&&e.dealers[id].lowUntil>now;
const openHour=m=>{const t=((m%DAY)+DAY)%DAY;return t>=9*60&&t<23*60;};
function pickStrain(x,price){let best=-1,bv=-1;for(const [k,v] of Object.entries(x.stock)){const t=+k;if(v<=0)continue;if(x.strain===t)return t;const p=price(t);if(p>bv){bv=p;best=t;}}return best;}
function dealerSale(s,e,d,x,c,now,ctx,events){
 const t=pickStrain(x,ctx.price);
 if(t<0){x.missed++;if(x.missed%3===1)note(e,now,'empty',c.name+' wanted gummies but '+d.name.split(' ')[0]+' was out of stock.',events);return;}
 const qty=Math.min(c.appetite,x.stock[t]);x.stock[t]-=qty;if(!x.stock[t])delete x.stock[t];
 const gross=Math.round(ctx.price(t)*c.budget)*qty,cut=Math.round(gross*d.cut);let skim=0;
 if(nextRandom(e)<(1-d.honesty)*RISK.shortBase){skim=Math.round(gross*(RISK.shortMin+nextRandom(e)*RISK.shortSpan));x.shorted+=skim;e.stats.shorted+=skim;note(e,now,'short',d.name.split(' ')[0]+'’s tally came up $'+skim+' short. “Must’ve been the seagulls.”',events);}
 const net=gross-cut-skim;x.owed+=net;x.sold+=qty;x.earned+=net;
 Object.assign(e.stats,{dealerSales:e.stats.dealerSales+qty,dealerGross:e.stats.dealerGross+gross,dealerNet:e.stats.dealerNet+net,cuts:e.stats.cuts+cut});
 s.sold=(s.sold||0)+qty;s.xp=(s.xp||0)+2*qty;
 const risk=(RISK.bustBase+RISK.bustHeat*Math.max(0,Math.min(100,s.heat||0))/100)*(1.25-d.caution)*Math.sqrt(qty);
 if(nextRandom(e)<risk){const seized=stockTotal(x.stock);x.stock={};const lost=Math.round(x.owed*RISK.seize);x.owed-=lost;x.lowUntil=now+RISK.layLow;x.busts++;e.stats.busts++;e.stats.seized+=seized;
  s.heat=Math.min(100,(s.heat||0)+RISK.bustHeatGain);note(e,now,'bust','🚨 Sugar Squad caught '+d.name+' mid-deal! '+seized+' packs and $'+lost+' confiscated. Laying low for 2 days.',events);}
}
// ---- Runners: lab stockroom → dealer, and the dealer's takings back home ----
function restockNeed(e,id){const d=dealerOf(id),x=e.dealers[id];return Math.max(0,Math.min(d.stockCap,x.target)-stockTotal(x.stock));}
function loadCargo(stored,x,need,capacity,price){
 const cargo={};let left=Math.min(need,capacity);
 const order=stored.map((n,t)=>t).filter(t=>stored[t]>0).sort((a,b)=>(b===x.strain)-(a===x.strain)||price(b)-price(a));
 for(const t of order){if(left<=0)break;const n=Math.min(left,stored[t]);stored[t]-=n;cargo[t]=n;left-=n;}
 return cargo;
}
function runnerStep(s,e,r,x,now,dt,ctx,events){
 if(x.state==='idle'){
  if(!x.auto)return;const stored=s.storedPacks;let pick=null,score=0;
  for(const id of Object.keys(e.dealers)){if(dealerLow(e,id,now))continue;const need=restockNeed(e,id),owed=e.dealers[id].owed;const sc=(stored&&stockTotal(stored)?need*2:0)+(owed>=150?owed/50:0);if((need>=Math.max(2,dealerOf(id).stockCap*.35)||owed>=150)&&sc>score){score=sc;pick=id;}}
  if(!pick)return;x.target=pick;x.cargo=stored?loadCargo(stored,e.dealers[pick],restockNeed(e,pick),r.capacity,ctx.price):{};
  x.legTotal=x.leg=Math.max(15,Math.round(dealerOf(pick).leg/r.speed));x.state='out';x.trips++;
  if((s.heat||0)>=RISK.runnerHeat&&stockTotal(x.cargo)&&nextRandom(e)<RISK.runnerStop*(s.heat/100)){const n=stockTotal(x.cargo);x.cargo={};e.stats.seized+=n;note(e,now,'bust','🚲 Sugar Squad did a bike check on '+r.name.split(' ')[0]+'. '+n+' packs confiscated. Cool it down a bit.',events);}
  return;
 }
 x.leg-=dt;if(x.leg>0)return;
 if(x.state==='out'){const d=e.dealers[x.target];
  if(d&&!dealerLow(e,x.target,now)){const dd=dealerOf(x.target);for(const [k,v] of Object.entries(x.cargo)){const room=dd.stockCap-stockTotal(d.stock),n=Math.min(room,v);if(n>0){d.stock[k]=(d.stock[k]||0)+n;x.cargo[k]-=n;}}x.cash+=d.owed;d.owed=0;}
  x.state='back';x.legTotal=x.leg=Math.max(15,Math.round(dealerOf(x.target).leg/r.speed));return;}
 // Back home: leftover cargo returns to the stockroom, cash lands in your wallet minus the trip fee.
 for(const [k,v] of Object.entries(x.cargo))if(v>0&&s.storedPacks)s.storedPacks[k]=(s.storedPacks[k]||0)+v;
 const fee=Math.min(x.cash,r.trip),pay=x.cash-fee;s.cash=(s.cash||0)+pay;s.earned=(s.earned||0)+pay;e.stats.runnerFees+=fee;
 if(x.cash)note(e,now,'cash',r.name.split(' ')[0]+' brought back $'+pay+' from '+dealerOf(x.target).name.split(' ')[0]+(fee?' (trip $'+fee+')':'')+'.',events);
 Object.assign(x,{state:'idle',target:null,cargo:{},cash:0,leg:0});
}
// ---- Production crew: growers fill raw stock, bench hands make packs into the stockroom ----
function crewStep(s,e,c,now,dt,ctx){
 const t=((now%DAY)+DAY)%DAY;if(!c.on){c.status='Paused';return;}
 if(t<CREW.shiftStart||t>=CREW.shiftEnd){c.status='Off shift (8 AM–8 PM)';return;}
 if(c.role==='grower'){const b=c.strain>=0&&c.strain<ctx.baseCount?c.strain:ctx.bestBase();const seed=ctx.seedCost(b);
  if(c.work<=0&&(s.cash||0)<seed){c.status='Needs $'+seed+' for seeds';return;}
  if(c.work<=0){s.cash-=seed;}c.work+=dt;c.status='Growing '+ctx.name(b);
  if(c.work>=CREW.growMinutes){c.work=0;s.raw[b]=(s.raw[b]||0)+CREW.growYield;e.stats.grown+=CREW.growYield;}return;}
 const cap=ctx.storageLeft();if(cap<=0){c.status='Stockroom full';return;}
 if((s.wrappers||0)<=0){c.status='Out of wrappers';return;}
 const plan=ctx.benchPlan(c.strain);if(!plan){c.status='Waiting for raw gummies';return;}
 c.work+=dt;c.status='Packing '+ctx.name(plan.out);
 if(c.work>=CREW.benchMinutes){c.work=0;if(!ctx.benchUse(plan))return;s.wrappers--;s.storedPacks[plan.out]=(s.storedPacks[plan.out]||0)+1;e.stats.made++;}
}
// Advance the whole network to absolute minute `to` (day*1440+time). Long gaps (sleep) cap at two days.
export function advanceEmpire(s,ctx){
 const e=s.empire,events=[];const to=Math.max(e.clock,ctx.to),from=Math.max(e.clock,to-2*DAY);e.clock=from;const STEP=10;
 const customers={};for(const id of Object.keys(e.dealers))for(const c of districtCustomers(id))customers[c.id]=c;
 while(e.clock<to){const dt=Math.min(STEP,to-e.clock),now=e.clock+dt,before=e.clock;e.clock=now;
  if(Math.floor(before/DAY)!==Math.floor(now/DAY)){let w=0;for(const c of e.crew)if(c.on)w+=CREW.wage[c.role];if(w){s.cash=(s.cash||0)-w;e.stats.wages+=w;note(e,now,'wage','Paid crew wages: $'+w+'.',events);}}
  for(const [id,x] of Object.entries(e.dealers)){const d=dealerOf(id);if(x.lowUntil>now)continue;if(x.lowUntil&&x.lowUntil<=now){x.lowUntil=0;note(e,now,'info',d.name+' is back on the corner.',events);}
   if(!openHour(now))continue;
   for(const cid of x.customers){const c=customers[cid];if(!c)continue;if(!(cid in e.orders))e.orders[cid]=now+(hash(cid,'first')%(6*60));
    if(e.orders[cid]<=now){dealerSale(s,e,d,x,c,now,ctx,events);e.orders[cid]=now+c.every*60+(hash(cid,Math.floor(now/DAY))%180);if(x.lowUntil>now)break;}}}
  for(const [id,x] of Object.entries(e.runners))runnerStep(s,e,runnerOf(id),x,now,dt,ctx,events);
  for(const c of e.crew)crewStep(s,e,c,now,dt,ctx);
 }
 return events;
}
// Expected dealer take per day before risk, for the phone's planning line.
export function dealerForecast(e,id,price){const d=dealerOf(id),x=e.dealers[id];if(!d||!x)return 0;const t=pickStrain(x,price);if(t<0)return 0;
 return Math.round(districtCustomers(id).filter(c=>x.customers.includes(c.id)).reduce((a,c)=>a+Math.round(price(t)*c.budget)*c.appetite*24/c.every,0)*(1-d.cut));}
