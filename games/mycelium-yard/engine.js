(function(r,f){const e=f();if(typeof module==='object')module.exports=e;else r.MyceliumYard=e})(globalThis,()=>{'use strict';
const KEY='study-desk-mycelium-yard-v1';
const CROPS=[{name:'Honey fan',cost:2,time:2,value:5},{name:'Blue bell',cost:3,time:3,value:9},{name:'Rose cup',cost:3,time:2,value:7}];
const WEATHER=[0,1,0,2,0,0,1,0,2,0],GOALS=[14,24,34];
// Each basket is fulfilled in order. Earlier excess harvests sell normally, not into future baskets.
const BUYERS=[
 {name:'Village grocer',note:'A honey basket, then a blue centrepiece.',baskets:[[2,0,0],[0,1,0]],fresh:2,rewards:[4,6]},
 {name:'Bluebell café',note:'Two slow-grown blue harvests, served fresh.',baskets:[[0,1,0],[0,1,0]],fresh:0,rewards:[5,7]},
 {name:'Flower supper',note:'Honey and rose first; blue and rose next.',baskets:[[1,0,1],[0,1,1]],fresh:1,rewards:[6,8]},
 {name:'Soup kitchen',note:'Pair blue harvests, then honey and blue.',baskets:[[0,2,0],[1,1,0]],fresh:2,rewards:[6,8]},
 {name:'Forest chef',note:'A fresh trio, then one more fresh blue harvest.',baskets:[[1,1,1],[0,1,0]],fresh:0,rewards:[8,10]},
 {name:'Evening hamper',note:'Two blue-and-rose baskets; one evening of ripeness allowed.',baskets:[[0,1,1],[0,1,1]],fresh:1,rewards:[7,9]}
];
const empty=()=>({kind:-1,growth:0,water:0,rot:0,ripe:0});
const order=()=>({buyer:-1,stage:0,delivered:[0,0,0],locked:false});
const create=(level=0,records=[null,null,null],badges=Array(6).fill(false))=>({v:1,level,day:0,jobs:3,coins:8,sales:0,harvests:[0,0,0],beds:Array.from({length:6},empty),records:records.slice(),badges:badges.slice(),order:order(),ended:false,log:'Choose a buyer for a delivery challenge, then plant your first beds.'});
function act(s,a){
 if(!a||typeof a!=='object'||!['buyer','plant','water','harvest','compost','vent','night'].includes(a.type)||s.ended)return null;
 const n=JSON.parse(JSON.stringify(s));n.order??=order();n.badges??=Array(6).fill(false);
 if(a.type==='buyer'){
  if(!Number.isInteger(a.buyer)||Math.floor(a.buyer/2)!==s.level||a.buyer<0||a.buyer>=6||n.order.locked||a.buyer===n.order.buyer)return null;
  n.order={...order(),buyer:a.buyer};n.log='Serving '+BUYERS[a.buyer].name+'. Choice locks at your next harvest. Choosing costs no job.';return n;
 }
 if(a.type==='night'){
  n.day++;let events=[];
  for(const b of n.beds){
   if(b.kind<0)continue;const wet=b.water+WEATHER[s.day];b.water=Math.min(3,wet);if(wet>3)b.rot++;
   if(b.rot>=2){Object.assign(b,empty());events.push('A waterlogged bed was lost.');continue}
   if(b.growth>=CROPS[b.kind].time){b.ripe++;if(b.ripe>=3){Object.assign(b,empty());events.push('A ripe bed spoiled.')}continue}
   if(b.water>0){b.water--;b.growth++}
  }
  n.jobs=3;
  if(n.day===10){n.ended=true;const won=n.sales>=GOALS[n.level];n.log=won?'Market goal met!':'Market closed. Try a different planting plan.';if(won)n.records[n.level]=Math.max(n.records[n.level]||0,n.sales);if(n.order.buyer>=0)n.log+=n.order.stage===2?' Buyer delivery complete.':' Buyer delivery unfinished; replay for its badge.'}
  else n.log='Morning '+(n.day+1)+'. '+(events.join(' ')||'Check ripe beds and the forecast.');return n;
 }
 if(!n.jobs)return null;
 if(a.type==='vent'){
  if(!n.beds.some(b=>b.kind>=0&&b.water>0))return null;for(const b of n.beds)if(b.kind>=0)b.water=Math.max(0,b.water-2);n.log='Opened the roof: every planted bed loses two moisture.';
 }else{
  if(!Number.isInteger(a.bed)||a.bed<0||a.bed>=6)return null;const b=n.beds[a.bed];
  if(a.type==='plant'){
   if(b.kind!==-1||!Number.isInteger(a.kind)||a.kind<0||a.kind>Math.min(2,n.level+1)||n.coins<CROPS[a.kind].cost)return null;
   n.coins-=CROPS[a.kind].cost;Object.assign(b,{kind:a.kind,growth:0,water:2,rot:0,ripe:0});n.log='Planted '+CROPS[a.kind].name+'. Two moisture included.';
  }
  if(a.type==='water'){if(b.kind<0||b.water===3)return null;b.water=3;n.log='Watered this bed to three moisture.'}
  if(a.type==='harvest'){
   if(b.kind<0||b.growth<CROPS[b.kind].time)return null;
   const value=CROPS[b.kind].value-b.rot*2-b.ripe;n.sales+=value;n.coins+=value;n.harvests[b.kind]++;n.log='Sold '+CROPS[b.kind].name+' for '+value+' coins.';
   const o=n.order,buyer=BUYERS[o.buyer];
   if(buyer){o.locked=true;const needs=buyer.baskets[o.stage];
    if(needs&&o.delivered[b.kind]<needs[b.kind]){
     if(b.rot===0&&b.ripe<=buyer.fresh){o.delivered[b.kind]++;n.log+=' Added to buyer basket.';
      if(needs.every((v,i)=>o.delivered[i]===v)){const bonus=buyer.rewards[o.stage];o.stage++;o.delivered=[0,0,0];n.sales+=bonus;n.coins+=bonus;n.log+=' Basket delivered: +'+bonus+' coins!';if(o.stage===2){n.badges[o.buyer]=true;n.log+=' Buyer badge earned!'}}
     }else n.log+=' Buyer needs unrotted crops with at most '+buyer.fresh+' ripe evenings.';
    }
   }
   Object.assign(b,empty());
  }
  if(a.type==='compost'){if(b.kind<0)return null;n.coins++;Object.assign(b,empty());n.log='Composted this bed; recovered one coin.'}
 }
 n.jobs--;return n;
}
function decode(raw){
 const s=JSON.parse(raw),int=(v,a,b)=>Number.isInteger(v)&&v>=a&&v<=b;
 if(!s||s.v!==1||!int(s.level,0,2)||!int(s.day,0,10)||!int(s.jobs,0,3)||!int(s.coins,0,1000)||!int(s.sales,0,1000)||typeof s.ended!=='boolean'||s.ended!==(s.day===10)||!Array.isArray(s.records)||s.records.length!==3||s.records.some((v,i)=>v!==null&&(!int(v,GOALS[i],1000)||i>0&&s.records[i-1]===null))||s.level>0&&s.records[s.level-1]===null||!Array.isArray(s.harvests)||s.harvests.length!==3||s.harvests.some(v=>!int(v,0,30))||!Array.isArray(s.beds)||s.beds.length!==6||s.beds.some(b=>!b||!int(b.kind,-1,2)||!int(b.growth,0,b.kind<0?0:CROPS[b.kind].time)||!int(b.water,0,3)||!int(b.rot,0,1)||!int(b.ripe,0,2)||b.kind<0&&(b.water||b.rot||b.ripe))||typeof s.log!=='string'||s.log.length>250)throw Error('Invalid save');
 // Old v1 crops, money and records survive. No past harvest earns a new badge.
 if(!Object.hasOwn(s,'order'))s.order=order();if(!Object.hasOwn(s,'badges'))s.badges=Array(6).fill(false);
 const o=s.order;
 if(!Array.isArray(s.badges)||s.badges.length!==6||s.badges.some(x=>typeof x!=='boolean')||!o||!int(o.buyer,-1,5)||o.buyer>=0&&Math.floor(o.buyer/2)!==s.level||!int(o.stage,0,2)||typeof o.locked!=='boolean'||!Array.isArray(o.delivered)||o.delivered.length!==3||o.delivered.some((v,i)=>!int(v,0,o.buyer<0||o.stage===2?0:BUYERS[o.buyer].baskets[o.stage][i]))||o.buyer<0&&(o.stage||o.locked)||!o.locked&&(o.stage||o.delivered.some(Boolean))||o.stage===2&&!s.badges[o.buyer])throw Error('Invalid buyer save');
 return JSON.parse(JSON.stringify(s));
}
function forecast(s){if(s.ended)return [];const next=act(s,{type:'night'});return s.beds.map((b,i)=>{const n=next.beds[i];if(b.kind<0)return 'Empty';if(n.kind<0)return b.rot+(b.water+WEATHER[s.day]>3?1:0)>=2?'Lost to rot':'Spoils tonight';const messages=[];if(n.rot>b.rot)messages.push('Gains rot');if(n.growth>b.growth)messages.push(n.growth===CROPS[n.kind].time?'Ready tomorrow':'Grows to '+n.growth+'/'+CROPS[n.kind].time);else if(b.growth<CROPS[b.kind].time)messages.push('Too dry to grow');else messages.push('Ripe '+n.ripe+'/3 evenings');messages.push('Water '+n.water);return messages.join(' · ')})}
return{KEY,CROPS,WEATHER,GOALS,BUYERS,create,act,decode,forecast};});
