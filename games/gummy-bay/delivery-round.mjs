const finitePoint=p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.z)&&Math.abs(p.x)<=10000&&Math.abs(p.z)<=10000;
const freeze=o=>Object.freeze(o);
const dueValue=d=>Number.isFinite(d)?d:Infinity;

// Read-only delivery guidance. Stock is allocated in deadline order, matching the
// commitments screen, but no order or inventory record is changed.
export function deliveryRound(state={},people=[],origin={x:0,z:0}){
 state=state&&typeof state==='object'?state:{};people=Array.isArray(people)?people:[];
 const day=Number.isFinite(state.day)&&state.day>=1?Math.floor(state.day):1;
 const time=Number.isFinite(state.time)?Math.max(0,Math.min(1439,state.time)):0;
 const clock=(day-1)*1440+time,stock=Array.isArray(state.packs)?state.packs.map(n=>Number.isFinite(n)&&n>0?Math.floor(n):0):[];
 const from=finitePoint(origin)?origin:{x:0,z:0},seen=new Set();
 const valid=(Array.isArray(state.deals)?state.deals:[]).filter(d=>{
  if(!d||!Number.isInteger(d.npc)||d.npc<0||d.npc>=people.length||seen.has(d.npc)||!Number.isInteger(d.t)||d.t<0||d.t>=stock.length||!Number.isInteger(d.qty)||d.qty<1||d.qty>40||!Number.isFinite(d.price)||d.price<0||d.price>1000000||!(d.due==null||Number.isFinite(d.due)))return false;
  seen.add(d.npc);return finitePoint(people[d.npc]);
 }).map(d=>({...d})).sort((a,b)=>dueValue(a.due)-dueValue(b.due)||a.npc-b.npc);
 const rows=valid.map(d=>{
  const allocated=Math.min(d.qty,stock[d.t]||0);stock[d.t]=(stock[d.t]||0)-allocated;
  const current=finitePoint(state.npcs?.[d.npc])?state.npcs[d.npc]:people[d.npc];
  const distance=Math.hypot(current.x-from.x,current.z-from.z),minutesLeft=Number.isFinite(d.due)?Math.max(0,Math.ceil(d.due-clock)):null,missing=d.qty-allocated;
  return freeze({npc:d.npc,t:d.t,qty:d.qty,price:d.price,due:Number.isFinite(d.due)?d.due:null,total:d.qty*d.price,allocated,missing,ready:missing===0,minutesLeft,distance,x:current.x,z:current.z,urgency:minutesLeft===null?'open':minutesLeft<=30?'urgent':minutesLeft<=60?'soon':'scheduled'});
 });
 const ready=rows.filter(r=>r.ready).sort((a,b)=>dueValue(a.due)-dueValue(b.due)||a.distance-b.distance||a.npc-b.npc);
 const waiting=rows.filter(r=>!r.ready).sort((a,b)=>a.missing-b.missing||dueValue(a.due)-dueValue(b.due)||a.distance-b.distance||a.npc-b.npc);
 const pick=ready[0]||waiting[0]||null;
 const next=pick?freeze({...pick,action:pick.ready?'deliver':'prepare',reason:pick.ready?(pick.minutesLeft===null?'Ready now · nearest open commitment':'Ready now · earliest deadline · '+pick.minutesLeft+' min'):'Pack '+pick.missing+' more before leaving'}):null;
 return freeze({clock,rows:freeze(rows),next,readyCount:ready.length,waitingCount:waiting.length});
}
