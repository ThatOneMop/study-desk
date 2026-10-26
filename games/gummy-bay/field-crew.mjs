// Host-owned tent gardener and street seller. Saved inventory changes only when
// the worker finishes the job. A missing route stays a timer in staff-status.
import {findRoute} from './workshop-logistics.mjs?v=29';
const SPEED=1.6,JOB_SECONDS=1.2,MEET=0.45,APPROACH=6;
const clearSegment=(a,b,blocked)=>{
 const n=Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.z-a.z)/.1));
 for(let i=0;i<=n;i++)if(blocked(a.x+(b.x-a.x)*i/n,a.z+(b.z-a.z)*i/n))return false;
 return true;
};
export function approachPoint(target,blocked,distance=APPROACH){
 for(let i=0;i<16;i++){
  const a=i*Math.PI/8,p={x:target.x+Math.cos(a)*distance,z:target.z+Math.sin(a)*distance};
  if(clearSegment(p,target,blocked))return p;
 }
 return null;
}
function assigned(s,i,limit){const cfg=s.staffConfig.gardener;return i<limit&&(s.installed||[]).includes(i)&&(cfg.tent<0||cfg.tent===i);}
function seedFor(s,ctx){
 const cfg=s.staffConfig.gardener,seeds=s.seeds||[];
 return seeds.findIndex((n,i)=>n>0&&(ctx.unlocked?ctx.unlocked(i):true)&&(cfg.strain<0||cfg.strain===i));
}
export function chooseGardenJob(s,ctx){
 const limit=ctx.maxTents??99,tents=ctx.tents||[];
 if(s.trimmers&&ctx.roomForHarvest()){const hit=tents.find(t=>assigned(s,t.i,limit)&&s.plants?.[t.i]?.phase==='mature');if(hit)return {kind:'harvest',tent:hit.i};}
 if(s.can&&s.water>0&&!s.irrigation){const hit=tents.find(t=>assigned(s,t.i,limit)&&['dry','thirsty'].includes(s.plants?.[t.i]?.phase));if(hit)return {kind:'water',tent:hit.i};}
 if(s.soil>0){const strain=seedFor(s,ctx);if(strain>=0){const hit=tents.find(t=>assigned(s,t.i,limit)&&!s.plants?.[t.i]);if(hit)return {kind:'plant',tent:hit.i,strain};}}
 return null;
}
export function gardenIdle(s,ctx){
 const cfg=s.staffConfig.gardener,tents=(ctx.tents||[]).filter(t=>assigned(s,t.i,ctx.maxTents??99));
 if(!tents.length)return 'Waiting: install an assigned tent';
 if(!s.can&&!s.irrigation)return 'Waiting: watering can';
 if(!s.trimmers)return 'Waiting: trimmers';
 if(!ctx.roomForHarvest())return 'Waiting: property stock full';
 if(s.can&&!s.irrigation&&s.water<=0&&tents.some(t=>['dry','thirsty'].includes(s.plants?.[t.i]?.phase)))return 'Waiting: fill the watering can';
 if(tents.some(t=>s.plants?.[t.i]))return 'Tending assigned plants';
 if(!s.soil)return 'Waiting: soil';
 if(seedFor(s,ctx)<0)return 'Waiting: assigned seeds';
 return 'Ready to plant';
}
function applyGardenJob(s,job,ctx){
 const p=s.plants?.[job.tent];
 if(job.kind==='harvest'){
  if(p?.phase!=='mature'||!s.trimmers||!ctx.roomForHarvest())return false;
  s.raw[p.t]+=4;s.harvested=(s.harvested||0)+1;s.plants[job.tent]=null;return true;
 }
 if(job.kind==='water'){
  if(!p||!['dry','thirsty'].includes(p.phase)||!s.can||s.irrigation||s.water<=0)return false;
  const now=ctx.now?ctx.now():Date.now();
  s.water--;p.waterings=(p.waterings||0)+1;p.phase='growing';p.start=now;p.end=now+(ctx.growMs?ctx.growMs(p.t):1000);s.watered=(s.watered||0)+1;return true;
 }
 if(s.plants[job.tent]||s.soil<=0||!(s.seeds?.[job.strain]>0)||(ctx.unlocked&&!ctx.unlocked(job.strain)))return false;
 s.soil--;s.seeds[job.strain]--;s.plants[job.tent]={phase:'dry',t:job.strain,waterings:0};s.planted=(s.planted||0)+1;return true;
}
function walkPath(worker,dt,destination,ctx){
 if(worker.retry>0){worker.retry-=dt;worker.status='Garden route blocked';return false;}
 if(!worker.path){worker.path=findRoute(worker.position,destination,ctx.bounds,ctx.blocked);if(!worker.path){worker.retry=1;worker.status='Garden route blocked';return false;}}
 let remaining=dt*SPEED;
 while(worker.path.length&&remaining>0){
  const p=worker.path[0],dx=p.x-worker.position.x,dz=p.z-worker.position.z,d=Math.hypot(dx,dz),travel=Math.min(d,remaining);
  const q={x:worker.position.x+(d?dx/d*travel:0),z:worker.position.z+(d?dz/d*travel:0)};
  if(ctx.blocked(q.x,q.z)){worker.path=null;worker.retry=1;worker.status='Garden route blocked';return false;}
  worker.position=q;remaining-=travel;if(d<=travel+.001)worker.path.shift();else break;
 }
 return true;
}
export class TentGardener{
 constructor(){this.home=-1;this.position={x:0,z:0};this.path=null;this.work=0;this.retry=0;this.jobKey='';this.status='Not hired';}
 tick(s,dt,ctx){
  dt=Math.max(0,Math.min(.06,dt||0));
  const cfg=s.staffConfig?.gardener;
  if(!s.helpers?.gardener){this.status='Not hired';return false;}
  if(cfg?.route!=='walk'){this.status='Background timer';return false;}
  if(this.home!==s.house){this.home=s.house;this.position={...ctx.origin};this.path=null;this.work=0;this.retry=0;this.jobKey='';}
  if(!s.workerEnabled?.gardener){this.status='Assignment paused';return false;}
  const job=chooseGardenJob(s,ctx),key=job?job.kind+':'+job.tent:'';
  if(key!==this.jobKey){this.jobKey=key;this.path=null;this.work=0;}
  if(!job){this.status=gardenIdle(s,ctx);return false;}
  const tent=ctx.tents.find(t=>t.i===job.tent);
  if(!tent?.approach){this.status='Waiting: install an assigned tent';return false;}
  if(Math.hypot(this.position.x-tent.approach.x,this.position.z-tent.approach.z)>.2){
   this.status=job.kind==='harvest'?'Walking to harvest':job.kind==='water'?'Walking to water':'Walking to plant';
   return walkPath(this,dt,tent.approach,ctx)&&false;
  }
  this.path=null;this.work+=dt;
  this.status=job.kind==='harvest'?'Harvesting':job.kind==='water'?'Watering':'Planting';
  if(this.work<JOB_SECONDS)return false;
  this.work=0;
  if(!applyGardenJob(s,job,ctx)){this.status=gardenIdle(s,ctx);return false;}
  return true;
 }
}
export function chooseDelivery(s){
 const cfg=s.staffConfig?.seller;if(!cfg||cfg.route!=='walk'||!Array.isArray(s.deals))return null;
 return s.deals.find(d=>d&&Number.isInteger(d.npc)&&Number.isInteger(d.t)&&Number.isInteger(d.qty)&&d.qty>0&&Number.isFinite(d.price)&&(cfg.strain<0||cfg.strain===d.t)&&(s.packs?.[d.t]||0)>=d.qty)||null;
}
export function applyWorkerSale(s,deal){
 if(!deal||!Array.isArray(s.deals)||!Array.isArray(s.packs))return null;
 const current=s.deals.find(d=>d&&d.npc===deal.npc&&d.t===deal.t&&d.qty===deal.qty&&d.price===deal.price);
 if(!current||!(s.packs[current.t]>=current.qty))return null;
 s.packs[current.t]-=current.qty;
 const pay=current.price*current.qty;
 s.cash=(s.cash||0)+pay;s.earned=(s.earned||0)+pay;s.sold=(s.sold||0)+current.qty;s.xp=(s.xp||0)+current.qty*5;s.heat=Math.min(100,(s.heat||0)+12+current.qty*2);
 s.deals=s.deals.filter(d=>d!==current);
 const thread=s.threads?.[current.npc];
 if(thread){thread.status='sold';thread.lastSale={t:current.t,qty:current.qty,total:pay,day:s.day,time:s.time};(thread.messages??=[]).push({mine:false,text:'Thanks. I’ll look for you again.'});}
 return {pay,npc:current.npc,t:current.t,qty:current.qty};
}
export class StreetSeller{
 constructor(){this.home=-1;this.position=null;this.work=0;this.retry=0;this.targetNpc=-1;this.status='Not hired';}
 tick(s,dt,ctx){
  dt=Math.max(0,Math.min(.06,dt||0));
  const cfg=s.staffConfig?.seller;
  if(!s.helpers?.seller){this.status='Not hired';return false;}
  if(cfg?.route!=='walk'){this.status='Background timer';return false;}
  if(this.home!==s.house){this.home=s.house;this.position=null;this.work=0;this.retry=0;this.targetNpc=-1;}
  if(!s.workerEnabled?.seller){this.status='Assignment paused';return false;}
  const deal=chooseDelivery(s);
  if(!deal){
   const waiting=(s.deals||[]).some(d=>d&&(cfg.strain<0||cfg.strain===d.t));
   this.status=waiting?'Waiting: unreserved carried packs':'Waiting for an agreed deal';
   this.work=0;this.targetNpc=-1;return false;
  }
  const contact=ctx.contacts?.[deal.npc];
  if(!contact){this.status='Waiting for an agreed deal';return false;}
  if(this.targetNpc!==deal.npc){this.targetNpc=deal.npc;this.work=0;}
  if(!this.position){
   this.position=approachPoint(contact,ctx.blocked,ctx.approach||APPROACH);
   if(!this.position){this.status='Delivery route blocked';return false;}
  }
  const dx=contact.x-this.position.x,dz=contact.z-this.position.z,dist=Math.hypot(dx,dz);
  if(dist>MEET){
   if(this.retry>0){this.retry-=dt;this.status='Delivery route blocked';return false;}
   const step=Math.min(dist,dt*SPEED),next={x:this.position.x+(dx/dist)*step,z:this.position.z+(dz/dist)*step};
   if(!clearSegment(this.position,next,ctx.blocked)){this.retry=1;this.status='Delivery route blocked';return false;}
   this.position=next;this.status='Walking to '+contact.name;return false;
  }
  this.work+=dt;this.status='Handing over the order';
  if(this.work<JOB_SECONDS)return false;
  this.work=0;
  return applyWorkerSale(s,deal)||false;
 }
}
