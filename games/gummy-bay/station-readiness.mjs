// Read-only guidance: inventory is changed only by the existing action handlers.
export function stationReadiness(type,s){
 const sum=a=>(a||[]).reduce((n,v)=>n+Math.max(0,Number(v)||0),0);
 if(!['craft','mix','sink','stockroom'].includes(type))return null;
 if(!s.room)return {text:'Rent a room to start production',ready:false};
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
