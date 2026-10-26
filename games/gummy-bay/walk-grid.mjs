// On-foot route planner over the real collision test. Used by the ?qa=day bot
// and by the route-budget test, so both measure the same walk a player makes.
// Grid A* (8-way, no corner cutting) with lazy cell tests, then string-pulled
// into a few straight legs. Pure module: callers pass blocked(x,z) and bounds.
export function createWalkGrid({blocked,minX,maxX,minZ,maxZ,res=.5}){
 const W=Math.ceil((maxX-minX)/res),H=Math.ceil((maxZ-minZ)/res);
 const state=new Uint8Array(W*H); // 0 unknown, 1 free, 2 blocked
 const cx=i=>minX+(i+.5)*res,cz=j=>minZ+(j+.5)*res;
 function freeCell(i,j){if(i<0||j<0||i>=W||j>=H)return false;const k=j*W+i;if(!state[k])state[k]=blocked(cx(i),cz(j))?2:1;return state[k]===1;}
 const toI=x=>Math.floor((x-minX)/res),toJ=z=>Math.floor((z-minZ)/res);
 function lineClear(ax,az,bx,bz){const n=Math.max(1,Math.ceil(Math.hypot(bx-ax,bz-az)/.2));for(let i=0;i<=n;i++)if(blocked(ax+(bx-ax)*i/n,az+(bz-az)*i/n))return false;return true;}
 function nearestFree(x,z,radius){let best=null,bd=Infinity;const r=Math.ceil(radius/res),i0=toI(x),j0=toJ(z);for(let dj=-r;dj<=r;dj++)for(let di=-r;di<=r;di++){const i=i0+di,j=j0+dj,d=Math.hypot(cx(i)-x,cz(j)-z);if(d>radius||d>=bd)continue;if(freeCell(i,j)){bd=d;best=[i,j];}}return best;}
 // A* from (ax,az) to any free cell within `reach` of (bx,bz). Returns
 // waypoints [[x,z],...] ending at the goal cell, or null when no route.
 function route(ax,az,bx,bz,{reach=1.5,maxNodes=400000}={}){
  if(!blocked(ax,az)&&!blocked(bx,bz)&&lineClear(ax,az,bx,bz))return [[bx,bz]];
  const s=nearestFree(ax,az,2),g=nearestFree(bx,bz,Math.max(reach,res));if(!s||!g)return null;
  const start=s[1]*W+s[0],gi=g[0],gj=g[1],goal=gj*W+gi;
  const gs=new Map([[start,0]]),prev=new Map([[start,-1]]),closed=new Set();
  const h=(i,j)=>{const dx=Math.abs(i-gi),dz=Math.abs(j-gj);return (Math.max(dx,dz)+(Math.SQRT2-1)*Math.min(dx,dz))*res;};
  const heap=[[h(s[0],s[1]),start]];
  const push=e=>{heap.push(e);let k=heap.length-1;while(k>0){const p=(k-1)>>1;if(heap[p][0]<=heap[k][0])break;[heap[p],heap[k]]=[heap[k],heap[p]];k=p;}};
  const pop=()=>{const top=heap[0],last=heap.pop();if(heap.length){heap[0]=last;let k=0;for(;;){const l=2*k+1,r=l+1;let m=k;if(l<heap.length&&heap[l][0]<heap[m][0])m=l;if(r<heap.length&&heap[r][0]<heap[m][0])m=r;if(m===k)break;[heap[m],heap[k]]=[heap[k],heap[m]];k=m;}}return top;};
  let found=false,expanded=0;
  while(heap.length){const [,c]=pop();if(closed.has(c))continue;if(c===goal){found=true;break;}closed.add(c);if(++expanded>maxNodes)break;
   const i=c%W,j=(c/W)|0,gc=gs.get(c);
   for(let dj=-1;dj<=1;dj++)for(let di=-1;di<=1;di++){if(!di&&!dj)continue;const ni=i+di,nj=j+dj;if(!freeCell(ni,nj))continue;if(di&&dj&&(!freeCell(i+di,j)||!freeCell(i,j+dj)))continue;const n=nj*W+ni;if(closed.has(n))continue;const ng=gc+(di&&dj?Math.SQRT2*res:res);if(ng<(gs.get(n)??Infinity)){gs.set(n,ng);prev.set(n,c);push([ng+h(ni,nj),n]);}}}
  if(!found)return null;
  const cells=[];for(let c=goal;c!==-1;c=prev.get(c))cells.push([cx(c%W),cz((c/W)|0)]);cells.reverse();
  // String-pull: keep only the corners the straight line cannot skip.
  const out=[];let from=[ax,az],k=0;
  while(k<cells.length-1){let far=k+1;for(let t=k+2;t<cells.length;t++){if(lineClear(from[0],from[1],cells[t][0],cells[t][1]))far=t;else if(t-far>6)break;}out.push(cells[far]);from=cells[far];k=far;}
  if(!out.length)out.push(cells[cells.length-1]);
  return out;
 }
 function length(ax,az,path){if(!path)return Infinity;let d=0,x=ax,z=az;for(const [px,pz] of path){d+=Math.hypot(px-x,pz-z);x=px;z=pz;}return d;}
 return {route,lineClear,length,res,W,H};
}
