// Pure production planning and save validation. No DOM, storage, timing or network effects.
const integer=n=>Number.isSafeInteger(n)&&n>=0;
export function productionPlan(state,{kind,index,count=1,ingredient=0},baseCount,ingredientCount){
 const fail=reason=>({ok:false,reason});
 if(!state.room)return fail('Rent a workshop first.');
 if(!['make','pack','mix'].includes(kind)||!integer(index)||index>=state.raw.length||!Number.isInteger(count)||count<1||count>4)return fail('Invalid production request.');
 if(count>1&&!state.bench)return fail('A press upgrade is required for batches.');
 const arrays=['raw','gummies','packs','ingredients'];if(arrays.some(k=>!Array.isArray(state[k])||!state[k].every(integer))||!integer(state.wrappers))return fail('Inventory needs a valid save before production.');
 const deltas=[];let result=index;
 if(kind==='make'){if(state.raw[index]<count)return fail('Not enough harvested ingredients.');deltas.push(['raw',index,-count],['gummies',index,count]);}
 if(kind==='pack'){if(!state.packStation)return fail('Buy a packaging station first.');if(state.gummies[index]<count||state.wrappers<count)return fail('Not enough gummies or wrappers.');deltas.push(['gummies',index,-count],['packs',index,count]);}
 if(kind==='mix'){
  if(!state.mixer||index>=baseCount||!integer(ingredient)||ingredient>=ingredientCount)return fail('Choose an available mixer recipe.');
  const reserved=state.deals.filter(d=>d.t===index).reduce((sum,d)=>sum+d.qty,0),loose=Math.min(count,state.gummies[index]),packed=count-loose;
  if(state.ingredients[ingredient]<count||state.packs[index]-reserved<packed)return fail('Not enough flavouring or unreserved gummies.');
  result=baseCount+index*ingredientCount+ingredient;
  if(result>=state.gummies.length)return fail('Recipe unavailable.');
  deltas.push(['gummies',index,-loose],['packs',index,-packed],['ingredients',ingredient,-count],['gummies',result,count]);
 }
 return {ok:true,kind,count,result,deltas};
}
export function commitProduction(state,request,baseCount,ingredientCount){
 const plan=productionPlan(state,request,baseCount,ingredientCount);if(!plan.ok)return plan;
 for(const [key,index,delta]of plan.deltas)state[key][index]+=delta;
 if(plan.kind==='make')state.made+=plan.count;
 if(plan.kind==='pack')state.wrappers-=plan.count;
 if(plan.kind==='mix'){state.mixed+=plan.count;state.xp+=2*plan.count;}
 return plan;
}
export function validateSave(v,strainCount,world){
 const fail=reason=>({ok:false,reason});
 if(!v||typeof v!=='object'||Array.isArray(v)||v.version!==3||!['story','free'].includes(v.mode))return fail('Unsupported save format.');
 for(const key of ['cash','bank','xp','day','time','x','z'])if(!Number.isFinite(v[key]))return fail('Invalid '+key+'.');
 if(v.cash<0||v.bank<0||v.xp<0||v.day<1||v.time<0||v.time>=1440)return fail('Invalid money or clock.');
 if(v.x<world.minX||v.x>world.maxX||v.z<world.minZ||v.z>world.maxZ)return fail('Saved position is outside the town.');
 for(const key of ['seeds','raw','gummies','packs'])if(!Array.isArray(v[key])||v[key].length<6||v[key].length>strainCount||!v[key].every(integer))return fail('Invalid '+key+' inventory.');
 for(const key of ['storedPacks','ingredients'])if(v[key]!==undefined&&(!Array.isArray(v[key])||v[key].length>strainCount||!v[key].every(integer)))return fail('Invalid '+key+' inventory.');
 if(v.visits!==undefined){
  if(!v.visits||typeof v.visits!=='object'||Array.isArray(v.visits)||Object.keys(v.visits).length>9)return fail('Invalid location visits.');
  for(const record of Object.values(v.visits))if(!record||typeof record!=='object'||Array.isArray(record)||!Number.isSafeInteger(record.count)||record.count<1||record.count>9999||!Number.isSafeInteger(record.lastDay)||record.lastDay<1||!Number.isFinite(record.lastTime)||record.lastTime<0||record.lastTime>=1440)return fail('Invalid location visit.');
 }
 if(!Array.isArray(v.plants)||v.plants.length>8||!Array.isArray(v.deals)||!v.threads||typeof v.threads!=='object'||Array.isArray(v.threads))return fail('Invalid production or orders.');
 if(v.house!==undefined&&![0,1,2].includes(v.house))return fail('Invalid property.');
 for(const key of ['wrappers','soil','water','made','mixed','sold','earned','tents','bench','lights'])if(v[key]!==undefined&&!integer(v[key]))return fail('Invalid '+key+'.');
 for(const key of ['yaw','pitch'])if(v[key]!==undefined&&!Number.isFinite(v[key]))return fail('Invalid camera position.');
 const customers=new Set();for(const d of v.deals){if(!d||!integer(d.npc)||d.npc>4||customers.has(d.npc)||!integer(d.t)||d.t>=strainCount||!integer(d.qty)||d.qty<1||!Number.isFinite(d.price)||d.price<1)return fail('Invalid or duplicate order.');if(!v.threads[d.npc]||!Array.isArray(v.threads[d.npc].messages))return fail('Order conversation is missing.');customers.add(d.npc);}
 for(const p of v.plants)if(p&&(!['soil','dry','thirsty','growing','mature'].includes(p.phase)||(p.phase!=='soil'&&(!integer(p.t)||p.t>=6))))return fail('Invalid crop.');
 return {ok:true};
}
export function backupSlot(storage,key){const previous=storage.getItem(key);if(previous!==null)storage.setItem(key+'-before-import',previous);return previous!==null;}
