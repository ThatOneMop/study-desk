// Customer cravings for fictional gummies. Levels are stored; a missed day only changes the effective level.
const DECAY=12,GAIN=18,ASK_LEVEL=40,ASK_GAP=120;

export function normalizeCravings(raw,contactCount,strainCount){
 const out={};
 if(!raw||typeof raw!=='object'||Array.isArray(raw))return out;
 for(const [key,rec] of Object.entries(raw)){
  const npc=Number(key);
  if(!Number.isInteger(npc)||npc<0||npc>=contactCount||!rec||typeof rec!=='object')continue;
  const t=Number(rec.t);
  if(!Number.isInteger(t)||t<0||t>=strainCount)continue;
  const level=Math.max(0,Math.min(100,Number(rec.level)||0));
  out[npc]={
   t,level,
   lastDay:Number.isFinite(rec.lastDay)?rec.lastDay:1,
   lastTime:Number.isFinite(rec.lastTime)?rec.lastTime:0,
   askedDay:Number.isFinite(rec.askedDay)?rec.askedDay:null,
   askedTime:Number.isFinite(rec.askedTime)?rec.askedTime:null
  };
 }
 return out;
}

export function effectiveLevel(craving,day){
 if(!craving)return 0;
 const missed=Math.max(0,(Number(day)||0)-(Number(craving.lastDay)||0));
 return Math.max(0,craving.level-DECAY*Math.min(missed,8));
}

export function noteSale(cravings,npc,strain,qty,day,time){
 const prev=cravings?.[npc];
 const same=!!prev&&prev.t===strain;
 const base=same?effectiveLevel(prev,day):Math.floor(effectiveLevel(prev,day)*.4);
 const extra=Math.min(3,Math.max(0,(Number(qty)||1)-1))*4;
 const next={...(cravings||{})};
 next[npc]={
  t:strain,
  level:Math.min(100,base+GAIN+extra),
  lastDay:day,
  lastTime:time,
  askedDay:prev?.askedDay??null,
  askedTime:prev?.askedTime??null
 };
 return next;
}

export function cravingState(craving,day){
 if(!craving)return null;
 const level=effectiveLevel(craving,day);
 return {product:craving.t,level,active:level>0,lastDay:craving.lastDay,lastTime:craving.lastTime,askedDay:craving.askedDay,askedTime:craving.askedTime};
}

export function cravingBudgetBonus(craving,strain,day){
 if(!craving||craving.t!==strain)return 0;
 const level=effectiveLevel(craving,day);
 return level>0?level*.0015:0;
}

function askedClock(craving){
 if(!craving||!Number.isFinite(craving.askedDay)||!Number.isFinite(craving.askedTime))return -Infinity;
 return (craving.askedDay-1)*1440+craving.askedTime;
}

export function cravingAsk(craving,ctx){
 if(!craving||!ctx)return null;
 const level=effectiveLevel(craving,ctx.day);
 if(level<ASK_LEVEL||ctx.hasDeal)return null;
 if(ctx.threadStatus==='negotiating'||ctx.threadStatus==='agreed')return null;
 const clock=(ctx.day-1)*1440+ctx.time;
 if(clock-askedClock(craving)<ASK_GAP)return null;
 return {t:craving.t,qty:level>=80?2:1,level};
}

export function markAsked(craving,day,time){
 return {...craving,askedDay:day,askedTime:time};
}
