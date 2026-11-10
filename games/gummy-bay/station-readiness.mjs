// Read-only guidance: inventory is changed only by the existing action handlers.
const amount=value=>Math.max(0,Number(value)||0);
// Count each product separately: a spare pack of another flavour cannot fill an order.
export function orderSupply(s){
 const needs=new Map();for(const d of s.deals||[])if(Number.isInteger(d.t)&&d.t>=0)needs.set(d.t,(needs.get(d.t)||0)+amount(d.qty));
 let promised=0,ready=0,collect=0,make=0,wrap=0;
 for(const [type,qty] of needs){
  promised+=qty;const carried=Math.min(qty,amount(s.packs?.[type]));ready+=carried;
  let short=qty-carried;const stored=Math.min(short,amount(s.storedPacks?.[type]));collect+=stored;short-=stored;
  const loose=Math.min(short,amount(s.gummies?.[type]));wrap+=loose;short-=loose;
  const raw=Math.min(short,amount(s.raw?.[type]));make+=raw;wrap+=raw;
 }
 return {promised,ready,collect,make,wrap,wrappersMissing:Math.max(0,wrap-amount(s.wrappers))};
}
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
  const stored=sum(s.storedPacks),capacity=([40,160,400][s.house??0]??40)+(s.chronicle?.owned?.warehouse?200:0),free=Math.max(0,capacity-stored),orders=orderSupply(s);
  if(orders.collect)return {text:'Collect '+orders.collect+' stored packs for agreed deals · '+stored+' / '+capacity+' stored',ready:true};
  return {text:stored+' / '+capacity+' stored · '+(free?free+' shelf spaces free':'Shelves full — collect packs'),ready:free>0};
 }
 const raw=sum(s.raw),loose=sum(s.gummies),packs=Math.min(loose,s.wrappers||0),orders=orderSupply(s);
 if(s.packStation&&orders.wrappersMissing)return {text:'Agreed deals need '+orders.wrappersMissing+' more wrappers · buy at corner store',ready:false};
 if(s.packStation&&orders.wrap>orders.make&&packs)return {text:Math.min(s.wrappers||0,orders.wrap-orders.make)+' ready to wrap for agreed deals'+(orders.make?' · shape '+orders.make+' first':''),ready:true};
 if(s.packStation&&packs)return {text:packs+' ready to wrap'+(raw?' · '+raw+' ready to shape':''),ready:true};
 if(raw)return {text:raw+' ready to shape'+(loose&&!s.wrappers?' · wrappers needed':''),ready:true};
 return {text:loose?(!s.packStation?'Buy packaging equipment':'Missing wrappers'):'Harvest ingredients to begin',ready:false};
}
