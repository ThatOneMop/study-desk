/* Album trades keep the last owned copy of every variant. No unopened shelf is eligible. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PackworksTrades=api;})(globalThis,function(){
'use strict';
const DUPLICATES=8,COST=40;
function quote(state,shelf){
 if(!Number.isInteger(shelf)||shelf<0||shelf>Math.min(5,state.areas||0))return null;
 let extras=0,missing=null;
 for(let id=shelf*20;id<shelf*20+20;id++){
  let seen=false;
  for(let v=0;v<5;v++){const key=id+':'+v;seen=seen||!!state.seen[key];extras+=Math.max(0,Math.floor(Number(state.inventory[key])||0)-1)}
  if(!seen&&missing===null)missing=id;
 }
 return{missing,extras,cost:COST,duplicates:DUPLICATES,ready:missing!==null&&extras>=DUPLICATES&&state.cash>=COST};
}
function trade(state,shelf){
 const q=quote(state,shelf);if(!q?.ready)return null;
 const inventory={...state.inventory};let remaining=DUPLICATES;
 // Spend low variants first; never consume the final copy.
 for(let v=0;v<5&&remaining;v++)for(let id=shelf*20;id<shelf*20+20&&remaining;id++){
  const key=id+':'+v,used=Math.min(remaining,Math.max(0,Math.floor(Number(inventory[key])||0)-1));
  if(used){inventory[key]-=used;remaining-=used}
 }
 return{inventory,id:q.missing,cost:COST};
}
return{DUPLICATES,COST,quote,trade};
});
