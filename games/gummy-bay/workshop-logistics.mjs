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
// Four-neighbour grid with sampled edges; bounded to the current workshop.
export function findRoute(start,end,bounds,blocked,step=.5){
 const key=(x,z)=>x+','+z,point=(x,z)=>({x:bounds.minX+x*step,z:bounds.minZ+z*step});
 const cell=p=>({x:Math.round((p.x-bounds.minX)/step),z:Math.round((p.z-bounds.minZ)/step)});
 const a=cell(start),b=cell(end),width=Math.floor((bounds.maxX-bounds.minX)/step),depth=Math.floor((bounds.maxZ-bounds.minZ)/step);
 const clear=(p,q)=>{const n=Math.max(1,Math.ceil(Math.hypot(q.x-p.x,q.z-p.z)/.15));for(let i=0;i<=n;i++)if(blocked(p.x+(q.x-p.x)*i/n,p.z+(q.z-p.z)*i/n))return false;return true;};
 if(!clear(start,point(a.x,a.z))||!clear(point(b.x,b.z),end))return null;
 const queue=[a],previous=new Map([[key(a.x,a.z),null]]);let head=0;
 while(head<queue.length&&head<10000){const c=queue[head++];if(c.x===b.x&&c.z===b.z){const path=[end];let k=key(c.x,c.z);while(k!==null){const [x,z]=k.split(',').map(Number);path.push(point(x,z));k=previous.get(k);}return path.reverse();}
  for(const [dx,dz]of [[1,0],[-1,0],[0,1],[0,-1]]){const x=c.x+dx,z=c.z+dz,k=key(x,z);if(x<0||z<0||x>width||z>depth||previous.has(k)||!clear(point(c.x,c.z),point(x,z)))continue;previous.set(k,key(c.x,c.z));queue.push({x,z});}
 }return null;
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
