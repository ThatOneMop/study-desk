(function(root,factory){const planner=factory();if(typeof module==='object')module.exports=planner;else root.MoonHaul=planner})(globalThis,()=>{
'use strict';
function quote(items,order,types){const count=items.length,multiplier=Math.min(2,1+.15*Math.max(0,count-1));const base=items.reduce((value,item)=>value+(item.t===order?Math.round(types[item.t][1]*1.5):types[item.t][1]),0);return{count,base,multiplier,value:Math.round(base*multiplier),orderHit:items.some(item=>item.t===order)}}
return{quote};
});
