// Optional one-time business challenges. Counters start when a job is accepted;
// existing progress and inventory never pay out retrospectively.
export const COMMISSIONS=Object.freeze([
 {id:'grower',name:'Two fresh harvests',text:'Harvest two plants after accepting.',needs:{harvested:2},cash:25,xp:10},
 {id:'maker',name:'Eight by hand',text:'Shape eight gummies and sell eight after accepting.',needs:{made:8,sold:8},cash:40,xp:15},
 {id:'flavour',name:'Experimental kitchen',text:'Mix four gummies and sell four after accepting.',needs:{mixed:4,sold:4},cash:35,xp:15}
].map(c=>Object.freeze({...c,needs:Object.freeze(c.needs)})));
const count=(s,k)=>Number.isFinite(s?.[k])?Math.max(0,Math.floor(s[k])):0;
const entries=s=>s?.notebookCommissions&&typeof s.notebookCommissions==='object'&&!Array.isArray(s.notebookCommissions)?s.notebookCommissions:{};
export function commissionView(s,id){
 const job=COMMISSIONS.find(c=>c.id===id);if(!job)return null;
 const saved=entries(s)[id],valid=saved&&typeof saved==='object'&&saved.start&&Object.keys(job.needs).every(k=>Number.isSafeInteger(saved.start[k])&&saved.start[k]>=0);
 const status=valid?(saved.claimed===true?'claimed':'active'):'available';
 const progress=Object.fromEntries(Object.entries(job.needs).map(([k,n])=>[k,status==='available'?0:Math.min(n,Math.max(0,count(s,k)-saved.start[k]))]));
 return {...job,status,progress,ready:status==='active'&&Object.entries(job.needs).every(([k,n])=>progress[k]>=n)};
}
export function commissionAction(s,id,kind){
 const job=commissionView(s,id);if(!job)return {ok:false,reason:'Unknown commission.'};
 if(kind==='accept'){
  if(job.status!=='available')return {ok:false,reason:'That commission has already been accepted.'};
  return {ok:true,entry:{start:Object.fromEntries(Object.keys(job.needs).map(k=>[k,count(s,k)])),claimed:false},cash:0,xp:0};
 }
 if(kind==='claim'&&job.ready)return {ok:true,entry:{...entries(s)[id],claimed:true},cash:job.cash,xp:job.xp};
 return {ok:false,reason:job.status==='claimed'?'Reward already collected.':'Complete the commission before collecting.'};
}
export function commissionHTML(s,escape=value=>String(value)){
 return '<section class="staffcard"><h3>Notebook commissions · optional</h3><p>Accept any jobs, then make progress in this save. No deadline; each reward can be collected once. Existing stock can be sold, but production goals need fresh work.</p>'+COMMISSIONS.map(c=>{
  const v=commissionView(s,c.id),progress=Object.entries(v.needs).map(([k,n])=>escape(k)+' '+v.progress[k]+'/'+n).join(' · ');
  const label=v.status==='claimed'?'Reward collected':v.status==='available'?'Accept commission':v.ready?'Collect reward':'In progress';
  const disabled=v.status==='claimed'||v.status==='active'&&!v.ready;
  return '<div class="item"><div><strong>'+escape(v.name)+'</strong><p>'+escape(v.text)+' '+progress+' · $'+v.cash+' + '+v.xp+' XP</p></div><button class="primary" onclick="bayCommission(\''+v.id+'\',\''+(v.status==='available'?'accept':'claim')+'\')" '+(disabled||s.__commissionGuest?'disabled':'')+'>'+label+'</button></div>';
 }).join('')+'</section>';
}
