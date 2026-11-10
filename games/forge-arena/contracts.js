/* Optional battle contracts. Uses simulation time and existing battle totals; no economy rewards. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ForgeContracts=api})(typeof globalThis!=='undefined'?globalThis:this,()=>{
'use strict';
const contracts=[{id:'scrap',name:'Scrap sprint',text:'3 eliminations within 90 seconds.',limit:90,kills:3,damage:0,clean:false},{id:'clean',name:'Clean circuit',text:'2 eliminations within 120 seconds without a death.',limit:120,kills:2,damage:0,clean:true},{id:'impact',name:'Heavy hand',text:'Deal 60,000 damage within 120 seconds.',limit:120,kills:0,damage:60000,clean:false}];
function create(id){return contracts.some(c=>c.id===id)?{id,elapsed:0,status:'active'}:null}
function step(run,dt,totals){if(!run||run.status!=='active'||!Number.isFinite(dt)||dt<0||dt>1)return run;const c=contracts.find(c=>c.id===run.id);if(!c)return run;run.elapsed+=dt;if(c.clean&&(totals.deaths||0)>0)run.status='failed';else if(run.elapsed<=c.limit&&(totals.kills||0)>=c.kills&&(totals.damage||0)>=c.damage)run.status='complete';else if(run.elapsed>=c.limit)run.status='failed';return run}
function restore(raw){try{const value=JSON.parse(raw),out={};for(const c of contracts)if(Number.isFinite(value?.[c.id])&&value[c.id]>=0&&value[c.id]<=c.limit)out[c.id]=value[c.id];return out}catch{return{}}}
return{contracts,create,step,restore};
});
