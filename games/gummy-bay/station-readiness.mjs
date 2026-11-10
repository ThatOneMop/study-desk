// Read-only guidance: inventory is changed only by the existing action handlers.
export function stationReadiness(type,s,index,now=Date.now()){
 const sum=a=>(a||[]).reduce((n,v)=>n+Math.max(0,Number(v)||0),0);
 if(!['craft','mix','sink','stockroom','tent'].includes(type))return null;
 if(!s.room)return {text:'Rent a room to start production',ready:false};
 if(type==='tent'){
  if(!Number.isInteger(index)||index<0||index>=s.tents)return {text:'Buy a grow tent from Hank',ready:false};
  if(!s.installed?.includes(index))return {text:'Owned tent · E to install',ready:true};
  const p=s.plants?.[index];
  if(!p)return {text:s.soil>0?'Empty planter · add soil':'Empty planter · buy soil from Milo',ready:s.soil>0};
  if(p.phase==='soil')return {text:'Soil ready · choose an unlocked seed',ready:false};
  if(p.phase==='dry'||p.phase==='thirsty')return {text:!s.can?'Thirsty · buy a watering can':!s.water?'Thirsty · refill at the sink':'Needs water · '+s.water+' / 6 charges',ready:!!s.can&&s.water>0};
  if(p.phase==='mature')return {text:s.trimmers?'Ready to harvest · 4 units':'Ripe · buy trimmers from Hank',ready:!!s.trimmers};
  const seconds=Math.max(0,Math.ceil(((Number(p.end)||now)-now)/1000));
  return {text:'Growing · '+seconds+'s until '+(p.waterings===1?'next watering':'harvest'),ready:false};
 }
 if(type==='sink')return {text:!s.can?'Missing watering can':s.water>=6?'Can full · 6 / 6 charges':'Free refill · '+s.water+' / 6 charges',ready:!!s.can&&s.water<6};
 if(type==='mix'){
  const usable=Array.from({length:6},(_,i)=>Math.max(0,(s.gummies?.[i]||0))+Math.max(0,(s.packs?.[i]||0)-(s.deals||[]).filter(d=>d.t===i).reduce((n,d)=>n+d.qty,0))).reduce((a,b)=>a+b,0);
  return {text:!s.mixer?'Mixing station not purchased':!usable?'Need unreserved base gummies':!sum(s.ingredients)?'Missing flavouring':'Ready to mix · choose a flavour',ready:!!s.mixer&&usable>0&&sum(s.ingredients)>0};
 }
 if(type==='stockroom'){
  const stored=sum(s.storedPacks),capacity=[40,160,400][s.house??0]??40,free=Math.max(0,capacity-stored);
  return {text:stored+' / '+capacity+' stored · '+(free?free+' shelf spaces free':'Shelves full — collect packs'),ready:free>0};
 }
 const raw=sum(s.raw),loose=sum(s.gummies),packs=Math.min(loose,s.wrappers||0);
 if(s.packStation&&packs)return {text:packs+' ready to wrap'+(raw?' · '+raw+' ready to shape':''),ready:true};
 if(raw)return {text:raw+' ready to shape'+(loose&&!s.wrappers?' · wrappers needed':''),ready:true};
 return {text:loose?(!s.packStation?'Buy packaging equipment':'Missing wrappers'):'Harvest ingredients to begin',ready:false};
}
