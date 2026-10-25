// Host-owned stockroom crafter. Saved cargo is separate from available inventory.
export function validCargo(c,n){return c===undefined||c===null||!!(c&&['input','output'].includes(c.phase)&&['raw','gummies'].includes(c.source)&&Number.isInteger(c.index)&&c.index>=0&&c.index<n&&Number.isInteger(c.home)&&c.home>=0&&c.home<=2);}
export function releaseCargo(s){const c=s.crafterCargo;if(!c)return false;if(c.phase==='input'){s[c.source][c.index]++;s.wrappers++;}else s.packs[c.index]++;s.crafterCargo=null;return true;}
export function pickupCargo(s){
 if(s.crafterCargo||!s.room||!s.packStation||!s.wrappers)return false;
 const match=(n,i)=>n>0&&(s.staffConfig.crafter.strain<0||i===s.staffConfig.crafter.strain);
 let source='gummies',index=s.gummies.findIndex(match);if(index<0){source='raw';index=s.raw.findIndex(match);}if(index<0)return false;
 s[source][index]--;s.wrappers--;s.crafterCargo={phase:'input',source,index,home:s.house};return true;
}
export function processCargo(s){const c=s.crafterCargo;if(!c||c.phase!=='input')return false;if(c.source==='raw')s.made++;c.phase='output';return true;}
export function depositCargo(s,capacity){const c=s.crafterCargo;if(!c||c.phase!=='output'||s.storedPacks.reduce((a,b)=>a+b,0)>=capacity)return false;s.storedPacks[c.index]++;s.crafterCargo=null;return true;}
// One bounded flood can check every station and tent entrance. Endpoint
// attachments try nearby clear nodes: rounding alone rejects usable door edges.
export function findReachableRoutes(start,ends,bounds,blocked,step=.5){
 const paths=ends.map(()=>null),inside=p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.z)&&p.x>=bounds.minX&&p.x<=bounds.maxX&&p.z>=bounds.minZ&&p.z<=bounds.maxZ;
 if(!Number.isFinite(step)||step<=0||!Object.values(bounds).every(Number.isFinite)||bounds.minX>bounds.maxX||bounds.minZ>bounds.maxZ||!inside(start))return paths;
 const width=Math.floor((bounds.maxX-bounds.minX)/step),depth=Math.floor((bounds.maxZ-bounds.minZ)/step);
 if((width+1)*(depth+1)>10000)return paths;
 const key=(x,z)=>x+','+z,point=(x,z)=>({x:bounds.minX+x*step,z:bounds.minZ+z*step});
 const clear=(p,q)=>{const n=Math.max(1,Math.ceil(Math.hypot(q.x-p.x,q.z-p.z)/.1));for(let i=0;i<=n;i++)if(blocked(p.x+(q.x-p.x)*i/n,p.z+(q.z-p.z)*i/n))return false;return true;};
 const attachments=p=>{
  if(!inside(p)||blocked(p.x,p.z))return [];
  const x=Math.round((p.x-bounds.minX)/step),z=Math.round((p.z-bounds.minZ)/step),result=[];
  for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++){
   const xx=x+dx,zz=z+dz;
   if(xx>=0&&zz>=0&&xx<=width&&zz<=depth&&clear(p,point(xx,zz)))result.push({x:xx,z:zz});
  }
  return result.sort((a,b)=>Math.hypot(point(a.x,a.z).x-p.x,point(a.x,a.z).z-p.z)-Math.hypot(point(b.x,b.z).x-p.x,point(b.x,b.z).z-p.z));
 };
 const queue=attachments(start),previous=new Map(queue.map(p=>[key(p.x,p.z),null]));
 if(!queue.length)return paths;
 const targets=ends.map(attachments),pending=new Set(targets.flatMap((a,i)=>a.length?[i]:[]));let head=0;
 while(head<queue.length&&pending.size){const c=queue[head++],k=key(c.x,c.z);
  for(const i of pending)if(targets[i].some(p=>p.x===c.x&&p.z===c.z)){
   const path=[ends[i]];let at=k;
   while(at!==null){const [x,z]=at.split(',').map(Number);path.push(point(x,z));at=previous.get(at);}
   path.push(start);paths[i]=path.reverse();pending.delete(i);
  }
  if(!pending.size)break;
  for(const [dx,dz]of [[1,0],[-1,0],[0,1],[0,-1]]){const x=c.x+dx,z=c.z+dz,next=key(x,z);if(x<0||z<0||x>width||z>depth||previous.has(next)||!clear(point(c.x,c.z),point(x,z)))continue;previous.set(next,k);queue.push({x,z});}
 }
 return paths;
}
export function findRoute(start,end,bounds,blocked,step=.5){return findReachableRoutes(start,[end],bounds,blocked,step)[0];}
// A single-entry cache cannot grow with mouse movement. Caller keys include all
// geometry affecting access; stock quantities are intentionally not involved.
export function createAccessAudit(){
 let previousKey,result;
 return (key,{exit,targets,bounds,blocked})=>{
  if(result&&key===previousKey)return result;
  const routes=findReachableRoutes(exit,targets,bounds,blocked),failed=routes.findIndex(p=>!p);
  result={ok:failed<0,failed:failed<0?null:targets[failed].label,checked:targets.length};previousKey=key;return result;
 };
}
export class StockroomCrafter{
 constructor(){this.home=-1;this.position={x:0,z:0};this.path=null;this.target='';this.progress=0;this.status='Not hired';this.retry=0;}
 tick(s,dt,ctx){
  dt=Math.max(0,Math.min(.06,dt||0));let changed=false;
  if(s.crafterCargo&&(s.crafterCargo.home!==s.house||s.staffConfig.crafter.stock!=='stored'||!s.helpers.crafter)){changed=releaseCargo(s);this.progress=0;this.path=null;}
  if(this.home!==s.house){this.home=s.house;this.position={...ctx.source};this.path=null;this.progress=0;}
  if(!s.helpers.crafter){this.status='Not hired';return changed;}
  if(s.staffConfig.crafter.stock!=='stored'){this.status='Carried-stock automation';return changed;}
  if(!s.workerEnabled.crafter){this.status='Assignment paused';return changed;}
  if(!s.packStation){this.status='Missing packaging station';return changed;}
  if(ctx.occupied){this.status='Station occupied';return changed;}
  if(!s.crafterCargo&&ctx.full()){this.status='Storage full';return changed;}
  const phase=s.crafterCargo?.phase,goal=phase==='input'?'station':phase==='output'?'storage':'source',destination=ctx[goal];
  if(this.target!==goal){this.target=goal;this.path=null;this.retry=0;}
  if(Math.hypot(this.position.x-destination.x,this.position.z-destination.z)>.06){
   if(this.retry>0){this.retry-=dt;this.status='Route blocked';return changed;}
   if(!this.path){this.path=findRoute(this.position,destination,ctx.bounds,ctx.blocked);if(!this.path){this.retry=1;this.status='Route blocked';return changed;}}
   let remaining=dt*1.35;
   while(this.path.length&&remaining>0){const p=this.path[0],dx=p.x-this.position.x,dz=p.z-this.position.z,d=Math.hypot(dx,dz);const travel=Math.min(d,remaining),q={x:this.position.x+(d?dx/d*travel:0),z:this.position.z+(d?dz/d*travel:0)};
    if(ctx.blocked(q.x,q.z)){this.path=null;this.retry=1;this.status='Route blocked';return changed;}
    this.position=q;remaining-=travel;if(d<=travel+.001)this.path.shift();else break;
   }
   this.status=phase==='output'?'Carrying finished pack':phase==='input'?'Carrying supplies':'Walking to supplies';return changed;
  }
  this.path=null;
  if(!phase){
   if(!s.wrappers){this.status='Missing wrappers';return changed;}
   const matches=(n,i)=>n>0&&(s.staffConfig.crafter.strain<0||s.staffConfig.crafter.strain===i);
   if(!s.raw.some(matches)&&!s.gummies.some(matches)){this.status='Missing ingredients';return changed;}
   if(this.retry>0){this.retry-=dt;this.status='Route blocked';return changed;}
   if(!findRoute(ctx.source,ctx.station,ctx.bounds,ctx.blocked)||!findRoute(ctx.station,ctx.storage,ctx.bounds,ctx.blocked)){this.retry=1;this.status='Route blocked';return changed;}
   changed=pickupCargo(s)||changed;this.status=s.crafterCargo?'Supplies collected':'Missing ingredients';
  }
  else if(phase==='input'){this.status='Shaping and packaging';this.progress+=dt;if(this.progress>=2){changed=processCargo(s)||changed;this.progress=0;}}
  else {changed=depositCargo(s,ctx.capacity)||changed;this.status=s.crafterCargo?'Storage full · holding finished pack':'Pack stored';}
  return changed;
 }
}
