const E=require('../games/mycelium-yard/engine.js'),A=require('node:assert/strict');
function buyerRoute(buyer,records=[14,24,34],badges=Array(6).fill(false)){
 let s=E.create(Math.floor(buyer/2),records,badges),actions=[];
 const go=a=>{const n=E.act(s,a);A.ok(n,JSON.stringify({a,s}));s=n;actions.push(a);A.deepEqual(E.decode(JSON.stringify(s)),s)};
 go({type:'buyer',buyer});
 while(!s.ended){
  while(s.jobs){
   const o=s.order,patron=E.BUYERS[buyer],need=patron.baskets[o.stage];
   let i=s.beds.findIndex(b=>b.kind>=0&&b.growth===E.CROPS[b.kind].time);
   if(i>=0){go({type:'harvest',bed:i});continue}
   const rain=E.WEATHER[s.day];
   if(s.beds.some(b=>b.kind>=0&&b.water+rain>3)){go({type:'vent'});continue}
   i=s.beds.findIndex(b=>b.kind>=0&&b.water===0);
   if(i>=0&&rain===0){go({type:'water',bed:i});continue}
   if(need&&s.day<7&&(rain<2||s.jobs>1)){
    const kind=need.findIndex((n,k)=>n>o.delivered[k]+s.beds.filter(b=>b.kind===k).length);
    i=s.beds.findIndex(b=>b.kind<0);
    if(kind>=0&&i>=0&&s.coins>=E.CROPS[kind].cost){go({type:'plant',bed:i,kind});continue}
   }
   break;
  }
  go({type:'night'});
 }
 return {s,actions};
}
module.exports={buyerRoute};
if(require.main===module)for(let i=0;i<6;i++){const r=buyerRoute(i);console.log(i,r.s.sales,r.s.order,r.s.badges[i],r.actions);A.equal(r.s.order.stage,2)}
