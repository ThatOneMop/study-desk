import assert from 'node:assert/strict';
import {DEALER_ROSTER,RUNNER_ROSTER,CREW,RISK,DAY,freshEmpire,normalizeEmpire,recruitDealer,assignCustomer,unassignCustomer,restockDealer,collectDealer,advanceEmpire,districtCustomers,stockTotal,hireCrew,crewSlots,slotUpgradeCost,dealerForecast,dealerLow} from '../dist/dealer-network.mjs';
import {simulateNetwork,simulateEconomy} from '../dist/economy-sim.mjs';
import {newMixSeed} from '../dist/mix-risk.mjs';
import {MAX_LEVEL} from '../dist/xp-curve.mjs';
const price=t=>[100,300][t]||0;
const ctx=(to,extra={})=>({to,price,baseCount:1,bestBase:()=>0,seedCost:()=>30,name:()=>'Pine Pop',storageLeft:()=>99,benchPlan:()=>null,benchUse:()=>false,...extra});
const world=(heat=0,seed=7)=>({cash:0,xp:0,heat,sold:0,earned:0,raw:[0,0],storedPacks:[0,0],wrappers:50,empire:freshEmpire(DAY,seed)});
// Roster sanity: every unlock is reachable and cuts fall as dealers get pricier.
for(const d of DEALER_ROSTER){assert.ok(d.unlock<=MAX_LEVEL,d.id+' unlock reachable');assert.ok(d.cut>0&&d.cut<.5);assert.equal(districtCustomers(d.id).length,12);}
for(const r of RUNNER_ROSTER)assert.ok(r.unlock<=MAX_LEVEL);
assert.ok(DEALER_ROSTER.every((d,i)=>!i||d.cut<DEALER_ROSTER[i-1].cut&&d.fee>DEALER_ROSTER[i-1].fee));
// Recruiting is gated by level and the signing fee.
{const s=world();assert.equal(recruitDealer(s.empire,'benny',{level:2,cash:9999}).ok,false);assert.equal(recruitDealer(s.empire,'benny',{level:3,cash:10}).ok,false);
 const r=recruitDealer(s.empire,'benny',{level:3,cash:300});assert.equal(r.ok,true);assert.equal(r.cost,300);assert.equal(recruitDealer(s.empire,'benny',{level:3,cash:300}).ok,false,'no double hire');
 assert.equal(s.empire.dealers.benny.customers.length,3,'starts with three regulars');
 for(let i=3;i<12;i++)assignCustomer(s.empire,'benny','benny-'+i);assert.equal(s.empire.dealers.benny.customers.length,DEALER_ROSTER[0].cap,'customer cap');
 assert.equal(assignCustomer(s.empire,'benny','mo-1'),false,'only district customers');assert.equal(unassignCustomer(s.empire,'benny','benny-0'),true);assert.equal(s.empire.dealers.benny.customers.length,DEALER_ROSTER[0].cap-1);}
// Restock respects carried packs and the dealer's shelf; collection empties the till.
{const s=world();recruitDealer(s.empire,'benny',{level:3,cash:300});const packs=[40,2];
 assert.equal(restockDealer(s.empire,'benny',packs,0,100),DEALER_ROSTER[0].stockCap,'shelf cap');assert.equal(packs[0],40-DEALER_ROSTER[0].stockCap);
 assert.equal(restockDealer(s.empire,'benny',packs,1,5),0,'full shelf');s.empire.dealers.benny.owed=123;assert.equal(collectDealer(s.empire,'benny'),123);assert.equal(s.empire.dealers.benny.owed,0);}
// Dealer economics: over a day with no heat, takings equal gross minus the cut minus any skim.
{const s=world(0,11);recruitDealer(s.empire,'benny',{level:3,cash:300});for(let i=3;i<5;i++)assignCustomer(s.empire,'benny','benny-'+i);
 restockDealer(s.empire,'benny',[16],0,16);advanceEmpire(s,ctx(3*DAY));const x=s.empire.dealers.benny,st=s.empire.stats;
 assert.ok(x.sold>0,'dealer sold while you were away');assert.equal(16-stockTotal(x.stock),x.sold);
 assert.equal(st.cuts,Math.round(st.cuts));assert.ok(Math.abs(st.cuts-st.dealerGross*DEALER_ROSTER[0].cut)<=x.sold,'cut matches the rate');
 assert.equal(x.owed,st.dealerGross-st.cuts-st.shorted,'takings = gross − cut − skim');assert.equal(s.cash,0,'cash waits at the dealer until collected');
 assert.ok(st.dealerGross/x.sold>=price(0)*.9&&st.dealerGross/x.sold<=price(0)*1.2,'district prices stay near list');
 // Out of stock: further orders are missed, not invented.
 restockDealer(s.empire,'benny',[0],0,0);const sold=x.sold;x.stock={};advanceEmpire(s,ctx(5*DAY));assert.equal(x.sold,sold);assert.ok(x.missed>0,'misses when empty');}
// Shortchanging: a less honest dealer skims sometimes, and it is logged.
{let skims=0,logs=0;for(let seed=1;seed<=20;seed++){const s=world(0,seed);recruitDealer(s.empire,'mo',{level:9,cash:9e9});for(let i=3;i<7;i++)assignCustomer(s.empire,'mo','mo-'+i);restockDealer(s.empire,'mo',[24],0,24);advanceEmpire(s,ctx(3*DAY));skims+=s.empire.stats.shorted>0;logs+=s.empire.log.some(l=>l.kind==='short');}
 assert.ok(skims>=3&&skims<=19,'Mo shortchanges sometimes ('+skims+'/20)');assert.equal(logs,skims);}
// Bust risk climbs with heat; a bust confiscates stock, half the till, and benches the dealer for two days.
{const rate=heat=>{let b=0;for(let seed=1;seed<=40;seed++){const s=world(heat,seed);recruitDealer(s.empire,'benny',{level:9,cash:9e9});for(let i=3;i<5;i++)assignCustomer(s.empire,'benny','benny-'+i);restockDealer(s.empire,'benny',[16],0,16);advanceEmpire(s,ctx(4*DAY));b+=s.empire.stats.busts;}return b;};
 const cool=rate(0),hot=rate(100);assert.ok(hot>cool*2,'heat raises bust risk ('+cool+' → '+hot+')');assert.ok(cool<=12,'low heat is fairly safe');
 let s=null;for(let seed=1;seed<200&&!s;seed++){const w=world(100,seed);recruitDealer(w.empire,'benny',{level:9,cash:9e9});restockDealer(w.empire,'benny',[16],0,16);
  const events=advanceEmpire(w,ctx(2*DAY));if(events.some(e=>e.kind==='bust'))s={w,events};}
 assert.ok(s,'a hot dealer eventually gets caught');const x=s.w.empire.dealers.benny,at=s.events.find(e=>e.kind==='bust').at;
 assert.equal(stockTotal(x.stock),0,'stock confiscated');assert.equal(x.lowUntil,at+RISK.layLow);assert.ok(dealerLow(s.w.empire,'benny',at+DAY));assert.ok(s.w.heat>=100||s.w.heat>=RISK.bustHeatGain);
 assert.ok(!/arrest|jail|gun|kill/i.test(s.events.map(e=>e.text).join(' ')),'family-friendly wording');}
// Runners: stockroom → dealer, cash home minus the trip fee.
{const s=world(0,5);recruitDealer(s.empire,'benny',{level:9,cash:9e9});s.storedPacks=[30,0];s.empire.runners.pip={hired:true,auto:true,state:'idle',target:null,cargo:{},cash:0,leg:0,legTotal:1,trips:0};s.empire.dealers.benny.owed=200;
 advanceEmpire(s,ctx(DAY+DAY/2));const r=s.empire.runners.pip,x=s.empire.dealers.benny;
 assert.ok(r.trips>=1,'runner made a trip');assert.equal(s.storedPacks[0]+stockTotal(x.stock)+x.sold+stockTotal(r.cargo),30,'no packs lost or duplicated');
 assert.ok(s.cash>=200-RUNNER_ROSTER[0].trip,'takings came home');assert.ok(s.empire.stats.runnerFees>=RUNNER_ROSTER[0].trip);}
// Production crew: gated by level and property slots, works the 8–8 shift, pays wages at midnight.
{const s=world(0,3);s.cash=5000;s.house=0;assert.equal(hireCrew(s.empire,{role:'grower',level:2,cash:9e9,house:0}).ok,false);
 assert.equal(crewSlots(s.empire,0),1);assert.equal(crewSlots(s.empire,2),4);assert.equal(hireCrew(s.empire,{role:'grower',level:3,cash:9e9,house:0}).ok,true);
 assert.equal(hireCrew(s.empire,{role:'bench',level:3,cash:9e9,house:0}).ok,false,'one slot in the starter room');
 assert.equal(hireCrew(s.empire,{role:'bench',level:3,cash:9e9,house:1}).ok,true);assert.equal(slotUpgradeCost(s.empire),CREW.upgrade[0]);
 const plan=()=>s.raw[0]>0?{out:1}:null,use=()=>{if(s.raw[0]<1)return false;s.raw[0]--;return true;};
 advanceEmpire(s,ctx(2*DAY,{benchPlan:plan,benchUse:use}));
 assert.ok(s.empire.stats.grown>=12&&s.empire.stats.grown<=16,'grower: 4 raw per 3 h over a 12 h shift ('+s.empire.stats.grown+')');
 assert.ok(s.storedPacks[1]>0&&s.empire.stats.made===s.storedPacks[1],'bench packs into the stockroom');assert.equal(s.wrappers,50-s.storedPacks[1]);
 assert.equal(s.empire.stats.wages,CREW.wage.grower+CREW.wage.bench,'wages at midnight');}
// Save/load: normalize keeps progress, clamps junk, and the PRNG state survives so outcomes never reroll.
{const s=world(60,9);recruitDealer(s.empire,'benny',{level:9,cash:9e9});restockDealer(s.empire,'benny',[16],0,16);hireCrew(s.empire,{role:'grower',level:3,cash:9e9,house:0});advanceEmpire(s,ctx(DAY+600));
 const copy=JSON.parse(JSON.stringify(s));copy.empire=normalizeEmpire(JSON.parse(JSON.stringify(s.empire)),{clock:s.empire.clock,strainCount:2});
 assert.deepEqual(copy.empire.dealers,s.empire.dealers);assert.equal(copy.empire.rng,s.empire.rng);
 advanceEmpire(s,ctx(3*DAY));advanceEmpire(copy,ctx(3*DAY));assert.deepEqual(copy.empire.stats,s.empire.stats,'same future after reload');
 const junk=normalizeEmpire({dealers:{benny:{hired:true,stock:{0:5,9:3,x:1},owed:-4,customers:['benny-1','benny-1','mo-2'],strain:99},zzz:{hired:true}},crew:[{role:'boss'},{role:'bench',strain:1}],slotsBought:9,runners:{pip:{hired:true,state:'out'}}},{strainCount:2});
 assert.deepEqual(junk.dealers.benny.stock,{0:5});assert.equal(junk.dealers.benny.owed,0);assert.deepEqual(junk.dealers.benny.customers,['benny-1']);assert.equal(junk.dealers.benny.strain,-1);
 assert.ok(!junk.dealers.zzz);assert.equal(junk.crew.length,1);assert.equal(junk.slotsBought,CREW.upgrade.length);assert.equal(junk.runners.pip.state,'idle','orphan trips reset');
 assert.deepEqual(normalizeEmpire(null).dealers,{});
 assert.ok(dealerForecast(s.empire,'benny',price)>=0);}
// Sim curve bounds (mean of 6 saves) on the v174 grind: $30 start, no early runaway,
// premium sales ($200–400) from day 11 once Sunset Gold is reachable. A mixer week
// can step about 2.5×, so daily revenue may triple but not run away. Dealers unlock
// later, so the network becomes a real second income by day 15.
const runs=[1,2,3,4,5,6].map(n=>simulateNetwork({days:15,seed:newMixSeed(n)}));
const mean=(d,k)=>runs.reduce((a,l)=>a+l[d-1][k],0)/runs.length;
assert.equal(mean(1,'unitPrice'),30);
for(let d=1;d<=5;d++)assert.ok(mean(d,'unitPrice')<=60,'day '+d+' stays cheap');
assert.ok(mean(6,'unitPrice')<=110&&mean(7,'unitPrice')<=150,'no early runaway');
for(let d=1;d<=5;d++)assert.ok(mean(d,'cash')<=1200,'day '+d+' cash stays modest ('+mean(d,'cash')+')');
for(let d=11;d<=15;d++){const u=mean(d,'unitPrice');assert.ok(u>=200&&u<=400,'day '+d+' premium sale $'+u);}
for(let d=2;d<=15;d++)assert.ok(mean(d,'revenue')<=3*mean(d-1,'revenue'),'daily revenue growth bounded (day '+d+')');
assert.ok(mean(15,'network')>mean(15,'own')*.4,'by day 15 the network is a real second income');
assert.ok(mean(15,'revenue')<=20000,'late game stays bounded');
for(const log of runs)for(const r of log)assert.ok(r.cash>=0,'never broke');
const base=[1,2,3,4,5,6].map(n=>simulateEconomy({days:12,seed:newMixSeed(n)}));
const solo=base.reduce((a,l)=>a+l[9].unitPrice,0)/6;
assert.ok(solo>=200&&solo<=400,'a solo day-10 sale is still premium ($'+solo+')');
assert.ok(mean(10,'unitPrice')<solo,'hiring the network spends cash, so day-10 own prices trail a solo run');
console.log('PASS: dealer network: economics, restock, shortchange, bust risk, runners, crew slots, save/load and sim bounds · '+[1,3,5,7,10,12,14].map(d=>'D'+d+' $'+Math.round(mean(d,'unitPrice'))+'/unit $'+Math.round(mean(d,'revenue'))+'/day').join(' · '));
