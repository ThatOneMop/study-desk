const finite=Number.isFinite;
const pose=p=>p&&finite(p.x)&&finite(p.z);
export function policeSight(a,b,blocked){
 if(!pose(a)||!pose(b))return false;
 const distance=Math.hypot(b.x-a.x,b.z-a.z);if(distance>1000)return false;
 const steps=Math.max(1,Math.ceil(distance/.25));
 for(let i=0;i<=steps;i++)if(blocked(a.x+(b.x-a.x)*i/steps,a.z+(b.z-a.z)*i/steps))return false;
 return true;
}
export function readPoliceReport(report){
 if(!report||!['host','guest'].includes(report.role)||!Number.isSafeInteger(report.seized)||report.seized<0||!finite(report.fine)||report.fine<0)return null;
 return {role:report.role,seized:report.seized,fine:report.fine,day:Number.isInteger(report.day)&&report.day>0?report.day:null,fled:report.fled===true};
}
export function policeFeedback(police,role,actor,sight,{connected=true,stale=false}={}){
 const empty={stage:'clear',message:'',canComply:false};
 if(!connected)return {stage:'offline',message:'HOST DISCONNECTED · Police status is unavailable.',canComply:false};
 if(stale)return {stage:'stale',message:'HOST UPDATE STALE · Awaiting current police status.',canComply:false};
 if(police?.search){const q=police.search,seconds=finite(q.remaining)?Math.max(0,Math.ceil(q.remaining)):'?';return {stage:'search',message:(q.role===role?'BODY SEARCH':'PARTNER BEING SEARCHED')+' · '+seconds+'s · Shared carried stock is being checked.',canComply:false};}
 const priority={patrol:1,stop:2,pursuit:3},threats=(Array.isArray(police?.officers)?police.officers:[]).filter(c=>c&&c.target===role&&pose(c)&&Object.hasOwn(priority,c.mode)&&(c.mode!=='patrol'||c.suspicion>10));
 const threat=threats.reduce((best,c)=>!best||priority[c.mode]>priority[best.mode]||priority[c.mode]===priority[best.mode]&&(c.suspicion||0)>(best.suspicion||0)?c:best,null);
 const canComply=threats.some(c=>c.mode!=='patrol'&&pose(actor)&&Math.hypot(actor.x-c.x,actor.z-c.z)<18&&sight(c,actor));
 const instruction=canComply?'H to comply':'A visible officer must be within 18 m to comply';
 if(threat?.mode==='pursuit')return {stage:'pursuit',message:'PURSUIT · Police are chasing you · '+instruction,canComply};
 if(threat?.mode==='stop'){const remaining=Math.max(0,Math.ceil(4-Math.max(0,finite(threat.lost)?threat.lost:0)));return {stage:'stop',message:'POLICE STOP · '+remaining+'s before pursuit · '+instruction,canComply};}
 if(threat)return {stage:'watching',message:'POLICE WATCHING · Suspicion '+Math.round(Math.max(0,Math.min(100,finite(threat.suspicion)?threat.suspicion:0)))+'% · Walk calmly.',canComply:false};
 const report=readPoliceReport(police?.report);
 if(report&&police.cooldown>0)return {stage:'report',message:'SEARCH FINISHED · '+report.seized+' seized · $'+report.fine.toFixed(2).replace(/\.00$/,'')+' fine · Stored packs are safe.',canComply:false};
 return empty;
}
