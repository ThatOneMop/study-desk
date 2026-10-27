// v158: Schedule I-style meetups. When an order is agreed you pick a named spot and a time window;
// the customer walks there for the window. Late hand-offs and no-shows cost relationship.
export const WINDOW_MINUTES=90,GRACE_MINUTES=30,LEAD_MINUTES=25;
export const ON_TIME_BONUS=0,LATE_PENALTY=6,NO_SHOW_EXTRA=3;
export const DEAL_SPOTS=Object.freeze([
 Object.freeze({id:'lighthouse',name:'Lighthouse Steps',x:16,z:62,hint:'Waterfront, by the old steps'}),
 Object.freeze({id:'shelter',name:'Main St Bus Shelter',x:-18,z:9.6,hint:'Main Street, west of the crossing'}),
 Object.freeze({id:'fountain',name:'Palm Court Fountain',x:-30,z:24,hint:'Outside the motel courtyard'}),
 Object.freeze({id:'loading',name:'Hardware Loading Bay',x:-32,z:-14,hint:'Round the side of Hank’s'}),
 Object.freeze({id:'icebox',name:'Corner Store Ice Box',x:32,z:-16,hint:'Next to the Corner Store'}),
 Object.freeze({id:'bench',name:'Laundromat Bench',x:48,z:30,hint:'Out front of Suds & Sunshine'})
]);
export const clockOf=(day,time)=>(day-1)*1440+time;
export function windowOptions(now){
 // First window opens straight away (Schedule I's "now"); the later ones start on the half hour.
 const start=Math.ceil((now+20)/30)*30,first={id:0,from:Math.floor(now),to:Math.ceil((now+WINDOW_MINUTES)/30)*30};
 return [first,...[1,3].map((hours,n)=>({id:n+1,from:start+hours*60,to:start+hours*60+WINDOW_MINUTES}))];
}
export function fmtClock(abs){
 const m=((Math.round(abs)%1440)+1440)%1440,h=Math.floor(m/60),mm=m%60;
 return ((h+11)%12+1)+':'+String(mm).padStart(2,'0')+(h<12?' AM':' PM');
}
export function windowLabel(w,now){
 if(!w)return '';
 const day=d=>Math.floor(d/1440),tag=now!=null&&day(w.from)>day(now)?' tomorrow':'';
 return (now!=null&&w.from<=now?'Now':fmtClock(w.from))+'–'+fmtClock(w.to)+tag;
}
export function nearestSpot(spots,x,z){
 let best=0,dist=Infinity;
 spots.forEach((p,i)=>{const d=Math.hypot(p.x-x,p.z-z);if(d<dist){dist=d;best=i;}});
 return best;
}
// Where a deal stands right now. Legacy deals (no spot) keep the old "wait at home" behaviour.
export function meetStatus(deal,now){
 if(!deal||!Number.isFinite(deal.from)||!Number.isFinite(deal.to))return {phase:'legacy',minutes:0};
 if(now<deal.from)return {phase:'upcoming',minutes:Math.ceil(deal.from-now)};
 if(now<=deal.to)return {phase:'waiting',minutes:Math.ceil(deal.to-now)};
 if(now<=deal.to+GRACE_MINUTES)return {phase:'late',minutes:Math.ceil(deal.to+GRACE_MINUTES-now)};
 return {phase:'gone',minutes:0};
}
export const customerHeadsOut=(deal,now)=>Number.isFinite(deal?.from)&&now>=deal.from-LEAD_MINUTES&&now<=deal.to+GRACE_MINUTES;
// Relationship change applied on top of the normal sale bump.
export function meetOutcome(deal,now){
 const st=meetStatus(deal,now);
 if(st.phase==='upcoming')return {ok:false,phase:'early',relation:0,label:'Too early'};
 if(st.phase==='waiting')return {ok:true,phase:'on-time',relation:ON_TIME_BONUS,label:'On time'};
 if(st.phase==='late')return {ok:true,phase:'late',relation:-LATE_PENALTY,label:'Late'};
 if(st.phase==='gone')return {ok:false,phase:'gone',relation:0,label:'They left'};
 return {ok:true,phase:'legacy',relation:0,label:''};
}
export function phaseText(st){
 const m=n=>n>=60?Math.floor(n/60)+'h '+String(n%60).padStart(2,'0')+'m':n+'m';
 return {upcoming:'Starts in '+m(st.minutes),waiting:'Waiting now · '+m(st.minutes)+' left',late:'Late · leaves in '+m(st.minutes),gone:'No-show',legacy:'At their usual spot'}[st.phase]||'';
}
