// Original everyday routines; positions move through collision-checked routes.
export const PLACES={
 motel:{x:-25,z:28,label:'Palm Court'},garden:{x:25,z:33,label:'Milo’s garden shop'},
 hardware:{x:-24,z:-11,label:'Hank’s Hardware'},store:{x:24,z:-13,label:'the Corner Store'},
 laundry:{x:53,z:34,label:'Suds & Sunshine'},waterfront:{x:12,z:65,label:'the waterfront'}
};
export const CURFEW_START=1260,CURFEW_END=300;
export function curfewActive(time){const minute=((Number.isFinite(time)?time:0)%1440+1440)%1440;return minute>=CURFEW_START||minute<CURFEW_END;}
const routine=(morning,lunch,afternoon)=>[
 {at:0,place:'meeting',activity:'rest',line:'Taking it easy before the shops open.'},
 {at:480,...morning},{at:720,...lunch},{at:960,...afternoon},
 {at:1200,place:'meeting',activity:'phone',line:'Winding down. Send me a message if you have something good.'},
 {at:1260,place:'meeting',activity:'curfew',line:'Curfew. I’m staying at my usual spot until morning.'}
];
export const ROUTINES=[
 routine({place:'motel',activity:'phone',line:'Checking the late-shift roster. A sweet break would help.'},{place:'waterfront',activity:'drink',line:'A little sea air before another shift.'},{place:'laundry',activity:'browse',line:'Picking up my clean work shirt. Again.'}),
 routine({place:'garden',activity:'browse',line:'Milo says patience is free. At least something is.'},{place:'store',activity:'drink',line:'Just a small drink. Saving up for the good stuff.'},{place:'waterfront',activity:'phone',line:'Checking what everyone’s selling before I spend.'}),
 routine({place:'garden',activity:'browse',line:'Looking at the seeds. Good ingredients are worth waiting for.'},{place:'motel',activity:'phone',line:'Catching up on messages before the afternoon.'},{place:'store',activity:'browse',line:'Comparing flavours. I notice the little details.'}),
 routine({place:'hardware',activity:'browse',line:'Hank always has some gadget I don’t need. Probably.'},{place:'waterfront',activity:'phone',line:'Scouting the next big idea. Nice view for it.'},{place:'store',activity:'drink',line:'Show me something different and I’ll hear you out.'}),
 routine({place:'waterfront',activity:'drink',line:'Best place in town for a quiet morning.'},{place:'garden',activity:'browse',line:'A walk past Milo’s makes the day feel less rushed.'},{place:'waterfront',activity:'phone',line:'One last stop before the walk home.'})
];
export function residentPlan(index,time,meeting,hasDeal=false){
 if(hasDeal)return {...meeting,label:'the agreed meeting spot',activity:'waiting',line:'I’ve kept time for your delivery. See you at our usual spot.',meeting:true};
 const minute=((Number.isFinite(time)?time:540)%1440+1440)%1440;
 const entries=ROUTINES[index%ROUTINES.length]||ROUTINES[0];let chosen=entries[0];for(const entry of entries)if(entry.at<=minute)chosen=entry;
 const place=chosen.place==='meeting'?{...meeting,label:'the usual meeting spot'}:PLACES[chosen.place];
 return {...place,activity:chosen.activity,line:chosen.line,meeting:false};
}
export function residentDescription(plan,position,blocked=false){
 if(blocked)return 'Waiting for a clear path to '+plan.label;
 if(Math.hypot(position.x-plan.x,position.z-plan.z)>.7)return 'Walking to '+plan.label;
 if(plan.meeting)return 'Waiting for your delivery';
 const action={phone:'Checking messages',drink:'Taking a drink break',browse:'Looking around',rest:'Taking a break',curfew:'Indoors for curfew'}[plan.activity]||'Taking a break';
 return action+' · '+plan.label;
}
export function segmentClear(a,b,blocked){const n=Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.z-a.z)/.2));for(let i=0;i<=n;i++)if(blocked(a.x+(b.x-a.x)*i/n,a.z+(b.z-a.z)*i/n))return false;return true;}
// Bounded A* with a binary heap. No teleport fallback, no changes to collider data.
export function* citizenRouteSteps(start,end,blocked){
 if(segmentClear(start,end,blocked))return [{...end}];
 const sx=Math.round(start.x),sz=Math.round(start.z),gx=Math.round(end.x),gz=Math.round(end.z);
 const loX=Math.min(sx,gx)-16,hiX=Math.max(sx,gx)+16,loZ=Math.min(sz,gz)-16,hiZ=Math.max(sz,gz)+16;
 const a={x:sx,z:sz},b={x:gx,z:gz};if(!segmentClear(start,a,blocked)||!segmentClear(b,end,blocked))return null;
 const heap=[],seen=new Map(),closed=new Set(),key=(x,z)=>x+','+z;
 function push(v){heap.push(v);let i=heap.length-1;while(i){let p=(i-1)>>1;if(heap[p].f<=v.f)break;heap[i]=heap[p];i=p;}heap[i]=v;}
 function pop(){const v=heap[0],last=heap.pop();if(heap.length){let i=0;while(i*2+1<heap.length){let c=i*2+1;if(c+1<heap.length&&heap[c+1].f<heap[c].f)c++;if(heap[c].f>=last.f)break;heap[i]=heap[c];i=c;}heap[i]=last;}return v;}
 const first={...a,g:0,f:Math.abs(sx-gx)+Math.abs(sz-gz),parent:null};push(first);seen.set(key(sx,sz),first);
 for(let count=0;heap.length&&count<8000;count++){
  if(count>0&&count%48===0)yield null;
  const q=pop(),k=key(q.x,q.z);if(closed.has(k))continue;closed.add(k);
  if(q.x===gx&&q.z===gz){const path=[{...end}];for(let n=q;n;n=n.parent)path.push({x:n.x,z:n.z});return path.reverse();}
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){const x=q.x+dx,z=q.z+dz,k2=key(x,z),g=q.g+1;
   if(x<loX||x>hiX||z<loZ||z>hiZ||closed.has(k2)||(seen.get(k2)?.g??Infinity)<=g||!segmentClear(q,{x,z},blocked))continue;
   const v={x,z,g,f:g+(Math.abs(x-gx)+Math.abs(z-gz))*1.001,parent:q};seen.set(k2,v);push(v);
  }
 }
 return null;
}
export function orderOverview(state){
 const remaining=(state.packs||[]).slice(),clock=(state.day-1)*1440+state.time;
 return (state.deals||[]).map(d=>({...d})).sort((a,b)=>(a.due??Infinity)-(b.due??Infinity)).map(d=>{
  const allocated=Math.min(d.qty,Math.max(0,remaining[d.t]||0));remaining[d.t]=(remaining[d.t]||0)-allocated;
  return {...d,allocated,missing:d.qty-allocated,total:d.qty*d.price,minutesLeft:Number.isFinite(d.due)?Math.max(0,Math.ceil(d.due-clock)):null};
 });
}

export function citizenRoute(start,end,blocked){const planner=citizenRouteSteps(start,end,blocked);let step;do{step=planner.next();}while(!step.done);return step.value;}
