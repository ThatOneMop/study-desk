const finite=n=>Number.isFinite(n);
const speed=n=>finite(n)?Math.max(-30,Math.min(30,n)):0;
// Measured original bevelled crate/tape: x .3348000, y .3248000, z .295.
// The old .3 floor offset intersected its bevel by .0248; old saves settle up.
export const PROP_RADIUS=.325,PROP_HALF_WIDTH=.335,PROP_HALF_DEPTH=.295;
export const PROP_MAX_SPIN=8;
const EPS=1e-8;
const angle=n=>finite(n)?Math.atan2(Math.sin(n),Math.cos(n)):0;
const spin=n=>finite(n)?Math.max(-PROP_MAX_SPIN,Math.min(PROP_MAX_SPIN,n)):0;
const clean=n=>Math.abs(n)<EPS?0:n;
export function propThrowSpin(yaw,gentle=false){
 if(gentle||!finite(yaw))return {wx:0,wy:0,wz:0};
 return {wx:clean(Math.cos(yaw)*5),wy:1.6,wz:clean(-Math.sin(yaw)*5)};
}
export function propVisualLift(rx,ry,rz){
 const x=angle(rx),y=angle(ry),z=angle(rz),a=Math.cos(x),b=Math.sin(x),c=Math.cos(y),d=Math.sin(y),e=Math.cos(z),f=Math.sin(z);
 const worldYFromX=a*f+b*e*d,worldYFromY=a*e-b*f*d,worldYFromZ=-b*c;
 const half=Math.abs(worldYFromX)*PROP_HALF_WIDTH+Math.abs(worldYFromY)*PROP_RADIUS+Math.abs(worldYFromZ)*PROP_HALF_DEPTH;
 return Math.max(0,half-PROP_RADIUS);
}
const propFinite=p=>p&&[p.x,p.y,p.z].every(finite);
const boundedSpin=n=>spin(n);
function pairVelocity(a,b,key,direction,anchoredA,anchoredB){
 const av=speed(a[key]),bv=speed(b[key]);
 // Positive relative travel in the separation direction means the pair was
 // closing before correction. Resting/touching pairs keep their velocities.
 if((av-bv)*direction<=0)return;
 if(anchoredA){b[key]=clean(-bv*.3);return;}
 if(anchoredB){a[key]=clean(-av*.3);return;}
 const restitution=.3,mean=(av+bv)/2,difference=(av-bv)*restitution/2;
 a[key]=speed(mean-difference);b[key]=speed(mean+difference);
}
function pairMove(a,b,axis,direction,penetration,blocked,anchoredA,anchoredB){
 const dx=axis==='x'?direction:0,dz=axis==='z'?direction:0;
 const safe=(p,amount)=>!blocked(p.x+dx*amount,p.z+dz*amount);
 if(anchoredA&&anchoredB)return false;
 if(anchoredA){if(!safe(b,penetration))return false;b.x+=dx*penetration;b.z+=dz*penetration;return true;}
 if(anchoredB){if(!safe(a,-penetration))return false;a.x-=dx*penetration;a.z-=dz*penetration;return true;}
 const half=penetration/2,safeA=safe(a,-half),safeB=safe(b,half);
 if(safeA&&safeB){a.x-=dx*half;a.z-=dz*half;b.x+=dx*half;b.z+=dz*half;return true;}
 if(safeA&&safe(a,-penetration)){a.x-=dx*penetration;a.z-=dz*penetration;return true;}
 if(safeB&&safe(b,penetration)){b.x+=dx*penetration;b.z+=dz*penetration;return true;}
 return false;
}
// Resolve the small fixed crate set after individual world sweeps. The solver
// is deterministic and save-friendly: it copies records, skips malformed
// legacy entries, never moves two player-held anchors and consults the same
// measured world blocker before applying a horizontal correction.
export function resolvePropPairs(props,{blocked=()=>false,passes=24}={}){
 if(!Array.isArray(props))return [];
 const out=props.map(p=>({...p})),count=Math.min(out.length,24);
 blocked=typeof blocked==='function'?blocked:()=>true;
 passes=Number.isInteger(passes)?Math.max(1,Math.min(24,passes)):24;
 for(let pass=0;pass<passes;pass++)for(let i=0;i<count;i++)for(let j=i+1;j<count;j++){
  const a=out[i],b=out[j];if(!propFinite(a)||!propFinite(b))continue;
  const dx=b.x-a.x,dy=b.y-a.y,dz=b.z-a.z;
  const px=PROP_HALF_WIDTH*2-Math.abs(dx),py=PROP_RADIUS*2-Math.abs(dy),pz=PROP_HALF_DEPTH*2-Math.abs(dz);
  if(px<=EPS||py<=EPS||pz<=EPS)continue;
  const anchoredA=!!a.owner,anchoredB=!!b.owner;
  // Two free crates may stack. Held crates use horizontal separation so the
  // holder's authored height and the other player's anchor are never changed.
  if(!anchoredA&&!anchoredB&&py<=px&&py<=pz){
   const upper=dy>EPS?b:dy< -EPS?a:b,lower=upper===a?b:a;
   upper.y=lower.y+PROP_RADIUS*2+EPS;
   const impact=Math.max(0,-speed(upper.vy));upper.vy=impact>.6?impact*.18:0;
   upper.wx=boundedSpin((finite(upper.wx)?upper.wx:0)+speed(upper.vz)*.35);
   upper.wz=boundedSpin((finite(upper.wz)?upper.wz:0)-speed(upper.vx)*.35);
   continue;
  }
  const axis=px<=pz?'x':'z',penetration=(axis==='x'?px:pz)+EPS;
  const delta=axis==='x'?dx:dz,direction=Math.abs(delta)>EPS?Math.sign(delta):((i+j)&1?1:-1);
  if(!pairMove(a,b,axis,direction,penetration,blocked,anchoredA,anchoredB))continue;
  pairVelocity(a,b,axis==='x'?'vx':'vz',direction,anchoredA,anchoredB);
  const tangent=axis==='x'?speed(a.vz)-speed(b.vz):speed(b.vx)-speed(a.vx);
  if(!anchoredA)a.wy=boundedSpin((finite(a.wy)?a.wy:0)+tangent*.12);
  if(!anchoredB)b.wy=boundedSpin((finite(b.wy)?b.wy:0)-tangent*.12);
 }
 return out;
}
const NO_BANDS=Object.freeze([]),validBand=b=>b&&finite(b.bottom)&&finite(b.top)&&b.top>=b.bottom;
function bandsAt(query,x,z){
 const bands=query?.(x,z);
 if(!Array.isArray(bands)||!bands.length)return NO_BANDS;
 return bands.length<=24&&bands.every(validBand)?bands:bands.slice(0,24).filter(validBand);
}
const overlaps=(y,bands)=>bands.some(b=>y>b.bottom-PROP_RADIUS+EPS&&y<b.top+PROP_RADIUS-EPS);
// Only embedded old/newly surrounded props are recovered, to the nearest free
// vertical boundary of the union. A crate already above a roof stays above it.
function recoverHeight(y,bands){
 if(!overlaps(y,bands))return y;
 let nearest=y,distance=Infinity;
 for(const b of bands)for(const edge of [b.bottom-PROP_RADIUS,b.top+PROP_RADIUS])if(!overlaps(edge,bands)&&Math.abs(edge-y)<distance){nearest=edge;distance=Math.abs(edge-y);}
 return nearest;
}
// A saved centre can have been valid under the older .325 horizontal padding
// while its measured bevel overlaps by less than .01 (or by the projected
// corner difference at a rotated tent). Move at most .16 to the nearest of 32
// deterministic directions; never rewrite the saved record or force an exit.
function recoverHorizontal(x,z,blocked){
 if(!blocked(x,z))return {x,z,recovered:false};
 for(let ring=1;ring<=16;ring++)for(let spoke=0;spoke<32;spoke++){
  const angle=spoke*Math.PI/16,radius=ring*.01,nx=x+Math.cos(angle)*radius,nz=z+Math.sin(angle)*radius;
  if(!blocked(nx,nz))return {x:nx,z:nz,recovered:true};
 }
 return {x,z,recovered:false};
}
export function propReachable(actor,prop,blocked,range=3,overheadBands=null){
 if(!actor||!prop||!finite(range)||range<0||range>3.5||![actor.x,actor.z,prop.x,prop.y,prop.z].every(finite))return false;
 const dy=prop.y-(finite(actor.y)?actor.y:1.72),distance=Math.hypot(prop.x-actor.x,dy,prop.z-actor.z);
 if(distance>range)return false;
 const steps=Math.max(1,Math.ceil(distance/.08));
 for(let i=0;i<=steps;i++){
  const x=actor.x+(prop.x-actor.x)*i/steps,z=actor.z+(prop.z-actor.z)*i/steps,y=(finite(actor.y)?actor.y:1.72)+dy*i/steps;
  if(blocked(x,z)||bandsAt(overheadBands,x,z).some(b=>y>=b.bottom-EPS&&y<=b.top+EPS))return false;
 }
 return true;
}
// The caller supplies actor or measured-crate clearance as appropriate. Sample
// the whole move, slide on a free axis and bounce once rather than per substep.
function sweep(position,dx,dz,blocked,{dy=0,overheadBands=null}={}){
 const horizontal=recoverHorizontal(position.x,position.z,blocked);
 let x=horizontal.x,z=horizontal.z,y=recoverHeight(position.y,bandsAt(overheadBands,horizontal.x,horizontal.z)),hitX=false,hitZ=false,hitY=0;
 const recovered=Math.abs(y-position.y)>EPS;
 const steps=Math.max(1,Math.min(96,Math.ceil(Math.max(Math.hypot(dx,dz),Math.abs(dy))/.08)));
 for(let i=0;i<steps;i++){
  if(!hitX){if(blocked(x+dx/steps,z)||overlaps(y,bandsAt(overheadBands,x+dx/steps,z)))hitX=true;else x+=dx/steps;}
  if(!hitZ){if(blocked(x,z+dz/steps)||overlaps(y,bandsAt(overheadBands,x,z+dz/steps)))hitZ=true;else z+=dz/steps;}
  if(!hitY&&!recovered){
   let next=y+dy/steps;
   for(const b of bandsAt(overheadBands,x,z)){
    const under=b.bottom-PROP_RADIUS,above=b.top+PROP_RADIUS;
    if(dy>0&&y<=under+EPS&&next>under){next=under;hitY=1;}
    else if(dy<0&&y>=above-EPS&&next<above){next=above;hitY=-1;}
   }
   y=next;
  }
 }
 return {x,y,z,hitX,hitZ,hitY,recovered,recoveredHorizontal:horizontal.recovered};
}
export function stepProp(prop,elapsed,{blocked,floorHeight,holder=null,overheadBands=null,reachBlocked=blocked}){
 const p={...prop},dt=finite(elapsed)?Math.max(0,Math.min(.06,elapsed)):0;
 if(!dt)return p;
 p.rx=angle(p.rx);p.ry=angle(p.ry);p.rz=angle(p.rz);
 p.wx=spin(p.wx);p.wy=spin(p.wy);p.wz=spin(p.wz);
 if(p.owner){
  // Lost contact releases at the last safe position; never teleport through a
  // wall to catch up with a player, a stale guest, or a newly loaded position.
  if(!holder||!finite(holder.yaw)||!propReachable(holder,p,reachBlocked,3.5,overheadBands))return {...p,owner:null,vx:0,vy:0,vz:0};
  const target={x:holder.x-Math.sin(holder.yaw)*1.35,z:holder.z-Math.cos(holder.yaw)*1.35};
  const ground=floorHeight(holder.x,holder.z),eye=finite(holder.y)?holder.y:ground+1.72;
  const look=finite(holder.pitch)?Math.max(-1.1,Math.min(1.1,holder.pitch)):0;
  const targetY=Math.max(ground+PROP_RADIUS,eye-.54+Math.sin(look)*.65),follow=1-Math.exp(-dt*18);
  const move=sweep(p,(target.x-p.x)*follow,(target.z-p.z)*follow,blocked,{dy:(targetY-p.y)*follow,overheadBands});
  const settle=Math.exp(-dt*10);
  return {...p,x:move.x,z:move.z,y:move.y,rx:p.rx*settle,rz:p.rz*settle,owner:move.hitY||move.recovered?null:p.owner,vx:0,vy:0,vz:0,wx:0,wy:0,wz:0};
 }
 p.rx=angle(p.rx+p.wx*dt);p.ry=angle(p.ry+p.wy*dt);p.rz=angle(p.rz+p.wz*dt);
 p.vx=speed(p.vx);p.vz=speed(p.vz);p.vy=speed(p.vy)-9.8*dt;
 const move=sweep(p,p.vx*dt,p.vz*dt,blocked,{dy:p.vy*dt,overheadBands});p.x=move.x;p.y=move.y;p.z=move.z;
 if(move.hitX)p.vx*=-.35;if(move.hitZ)p.vz*=-.35;
 if(move.hitX||move.hitZ){p.wx*=-.62;p.wy*=-.48;p.wz*=-.62;}
 if(move.recovered)p.vy=0;
 else if(move.hitY)p.vy=Math.abs(p.vy)>.6?(move.hitY>0?-1:1)*Math.abs(p.vy)*.28:0;
 const ground=PROP_RADIUS+floorHeight(p.x,p.z);
 if(move.hitY<0){const drag=Math.exp(-dt*5);p.vx*=drag;p.vz*=drag;}
 const supported=p.y<=ground||move.hitY<0;
 if(p.y<=ground){p.y=ground;p.vy=Math.abs(p.vy)>.6?-p.vy*.28:0;const drag=Math.exp(-dt*5);p.vx*=drag;p.vz*=drag;}
 if(supported){const tilt=Math.exp(-dt*8),angularDrag=Math.exp(-dt*7);p.rx*=tilt;p.rz*=tilt;p.wx*=angularDrag;p.wy*=angularDrag;p.wz*=angularDrag;}
 if(Math.abs(p.vx)<.015)p.vx=0;if(Math.abs(p.vz)<.015)p.vz=0;
 if(Math.abs(p.wx)<.015)p.wx=0;if(Math.abs(p.wy)<.015)p.wy=0;if(Math.abs(p.wz)<.015)p.wz=0;
 if(Math.abs(p.rx)<1e-4)p.rx=0;if(Math.abs(p.rz)<1e-4)p.rz=0;
 return p;
}
