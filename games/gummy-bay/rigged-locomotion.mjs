// v172: distance-locked locomotion for the CC0 Quaternius townsfolk (see CREDITS.md).
// Walk and Run are in-place clips: during stance the foot travels backward in the
// model. Driving the cycle from metres walked, not from the clock, keeps that
// foot planted in the world. Idle, walk and run overlap by weight. Each person
// keeps a stable gait and a small idle fidget. No new third-party assets.
import {Vector3,Matrix4} from './vendor/three.module.min.js';
import {headBob} from './player-controller.mjs?v=144';

// Strides are model units per cycle, measured on people-man so both feet stay
// inside a few centimetres of one spot while the body moves forward one stride.
export const LOCOMOTION_STRIDE=Object.freeze({Walk:4.4,Run:10.6});
export const LOCOMOTION_PLANT=Object.freeze({
 Walk:Object.freeze({FootL:Object.freeze([[0.35,0.60]]),FootR:Object.freeze([[0.85,1]])}),
 Run:Object.freeze({FootL:Object.freeze([[0.70,0.82]]),FootR:Object.freeze([[0.20,0.32]])})
});
const PLANT_CLAMP=0.28; // model units; past this the foot takes a new step

const clamp01=t=>Math.max(0,Math.min(1,t));
const smooth=t=>{t=clamp01(t);return t*t*(3-2*t);};
const wrap=a=>Math.atan2(Math.sin(a),Math.cos(a));
const hash=n=>{let x=(Math.abs(Math.trunc(Number(n)||0))+1)*2654435761%4294967296;x^=x>>>15;return x>>>0;};
const _foot=new Vector3(),_desired=new Vector3(),_localNow=new Vector3(),_localWant=new Vector3(),_inv=new Matrix4();

// Explicit Idle (and other standing clips) stay idle, so position noise cannot
// start a sprint. Walk and Run blend from speed, with a little overlap.
export function locomotionWeights(speed=0,clip=''){
 speed=Number.isFinite(speed)?Math.max(0,speed):0;
 if(clip==='Sit')return {idle:0,walk:0,run:0,single:'Sit'};
 if(clip==='Wave')return {idle:0,walk:0,run:0,single:'Wave'};
 if(clip==='Idle'||clip==='Talk'||clip==='Work'||clip==='Search'||clip==='Surrender')return {idle:1,walk:0,run:0,single:null};
 if(clip==='Walk')speed=Math.max(speed,.55);
 if(clip==='Run')speed=Math.max(speed,3.5);
 const walkIn=smooth((speed-.12)/.58),runIn=smooth((speed-2.3)/1.7);
 const idle=(1-walkIn)*(1-runIn),walk=walkIn*(1-runIn),run=runIn,sum=idle+walk+run||1;
 return {idle:idle/sum,walk:walk/sum,run:run/sum,single:null};
}

// Stable per person: step phase, a slightly longer or shorter stride, and which fidget.
export function gaitStyle(id=0){
 const h=hash(id);
 return {phase:(h%1000)/1000,strideScale:.96+(h%9)/100,fidget:h%3,arm:.9+(h%7)/35};
}

export function strideMetres(clip,scaleXZ=1,style=1){
 const model=LOCOMOTION_STRIDE[clip]||LOCOMOTION_STRIDE.Walk;
 const scale=Number.isFinite(scaleXZ)&&scaleXZ>0?scaleXZ:1;
 const vary=Number.isFinite(style)&&style>0?style:1;
 return model*scale*vary;
}

export function advancePhase(phase,distance,stride){
 const p=Number.isFinite(phase)?phase:0;
 if(!(stride>0)||!Number.isFinite(distance)||distance<=0)return (p%1+1)%1;
 return (p+distance/stride)%1;
}

export function dominantClip(weights){
 if(!weights||weights.single)return null;
 return (weights.run||0)>(weights.walk||0)?'Run':'Walk';
}

export function footPlanted(clip,bone,phase){
 const wins=LOCOMOTION_PLANT[clip]?.[bone];if(!wins)return false;
 const p=((phase%1)+1)%1;
 return wins.some(([a,b])=>p>=a-1e-4&&p<=b+1e-4);
}

// Yaw rate (rad/s) becomes a torso twist and a small bank. Both are clamped.
export function turnPose(yawRate=0){
 const r=Number.isFinite(yawRate)?yawRate:0;
 return {torso:Math.max(-.4,Math.min(.4,r*.08)),bank:Math.max(-.08,Math.min(.08,-r*.012))};
}

// Three quiet standing habits. `weight` is the idle blend, so they fade out as soon as someone walks.
export function idleFidget(id,time,weight=1){
 const w=clamp01(weight);if(w===0)return {headX:0,headY:0,hipZ:0,shoulder:0};
 const t=Number.isFinite(time)?time:0,k=gaitStyle(id).fidget,s=w*(.65+.35*Math.sin(t*.31+id));
 if(k===1)return {headX:0,headY:0,hipZ:Math.sin(t*.7+id)*.05*s,shoulder:0};
 if(k===2)return {headX:Math.sin(t*.4)*.04*s,headY:0,hipZ:0,shoulder:Math.max(0,Math.sin(t*.9+id))*.08*s};
 return {headX:Math.sin(t*.35+id)*.05*s,headY:Math.sin(t*.22+id*1.7)*.16*s,hipZ:0,shoulder:0};
}

function parentLocal(bone,world,out){
 bone.parent.updateWorldMatrix(true,false);
 return out.copy(world).applyMatrix4(_inv.copy(bone.parent.matrixWorld).invert());
}

// Apply blended clips. Call endLocomotion after mixer.update to pin stance feet.
// `entry` is a cc0 slot model: {obj, mixer, actions, head, shoulders}.
export function beginLocomotion(entry,{dt=0,speed=0,yaw=0,clip='',id=0}={}){
 if(!entry?.actions)return null;
 const undo=entry._locoUndo;if(undo){for(const fn of undo)fn();entry._locoUndo=null;}
 const weights=locomotionWeights(speed,clip);
 entry._loco=weights;
 if(weights.single){
  const next=entry.actions[weights.single]||entry.actions.Idle;
  for(const action of Object.values(entry.actions)){if(!action)continue;action.enabled=action===next;action.setEffectiveWeight(action===next?1:0);}
  if(next&&entry._single!==weights.single){next.reset().play();next.timeScale=1;entry._single=weights.single;}
  return weights;
 }
 entry._single=null;
 const style=entry._gait||(entry._gait=gaitStyle(id));
 const scale=Math.abs(entry.obj?.scale?.z)||1;
 const stride=strideMetres(weights.run>.5?'Run':'Walk',scale,style.strideScale);
 const moving=(weights.walk+weights.run)>.2;
 entry._phase=advancePhase(entry._phase??style.phase,moving?Math.max(0,speed)*Math.max(0,Math.min(.1,dt)):0,stride);
 for(const [name,key] of [['Idle','idle'],['Walk','walk'],['Run','run']]){
  const action=entry.actions[name];if(!action)continue;
  const w=weights[key]||0;
  action.enabled=w>0.004;action.setEffectiveWeight(w);
  if(w>0.004&&!action.isRunning())action.play();
  if(name==='Idle')action.timeScale=1;
  else{action.timeScale=0;action.time=((entry._phase%1+1)%1)*action.getClip().duration;}
 }
 const dy=wrap((Number.isFinite(yaw)?yaw:0)-(entry._yaw??yaw));
 const slice=Math.max(1e-3,Math.min(.1,Number.isFinite(dt)?dt:1/60));
 entry._yawRate=(entry._yawRate||0)+(dy/slice-(entry._yawRate||0))*Math.min(1,slice*8);
 entry._yaw=yaw;
 return weights;
}

export function endLocomotion(entry,{now=0,id=0}={}){
 const weights=entry?._loco;if(!weights||weights.single||!entry.obj)return;
 const undo=[];
 const phase=entry._phase||0,clip=dominantClip(weights),moving=(weights.walk+weights.run)>.45;
 if(!entry._feet){
  entry._feet={};
  entry.obj.traverse(o=>{if(o.isBone&&(o.name==='FootL'||o.name==='FootR'||o.name==='Torso'||o.name==='Hips'))entry._feet[o.name]=o;});
 }
 const feet=entry._feet;
 if(moving&&clip){
  const locks=entry._plants||(entry._plants={});
  const scale=Math.abs(entry.obj.scale.z)||1;
  for(const boneName of ['FootL','FootR']){
   const bone=feet[boneName];if(!bone)continue;
   const planted=footPlanted(clip,boneName,phase);
   bone.getWorldPosition(_foot);
   if(!planted){locks[boneName]=null;continue;}
   if(!locks[boneName])locks[boneName]={x:_foot.x,z:_foot.z};
   const dx=locks[boneName].x-_foot.x,dz=locks[boneName].z-_foot.z;
   if(Math.hypot(dx,dz)>PLANT_CLAMP*scale*2.2){locks[boneName]={x:_foot.x,z:_foot.z};continue;}
   _desired.set(_foot.x+dx,_foot.y,_foot.z+dz);
   parentLocal(bone,_foot,_localNow);parentLocal(bone,_desired,_localWant);
   let lx=_localWant.x-_localNow.x,lz=_localWant.z-_localNow.z;
   const mag=Math.hypot(lx,lz);
   if(mag>PLANT_CLAMP){const s=PLANT_CLAMP/mag;lx*=s;lz*=s;locks[boneName]=null;}
   if(Math.abs(lx)+Math.abs(lz)<1e-5)continue;
   bone.position.x+=lx;bone.position.z+=lz;
   undo.push(()=>{bone.position.x-=lx;bone.position.z-=lz;});
  }
 }else entry._plants=null;
 const turn=turnPose(entry._yawRate||0);
 const torso=feet.Torso,hips=feet.Hips;
 if(torso&&Math.abs(turn.torso)>1e-4){torso.rotation.y+=turn.torso;undo.push(()=>{torso.rotation.y-=turn.torso;});}
 // rotation.set() already cleared the bank this frame, so this is absolute.
 if(Math.abs(turn.bank)>1e-4)entry.obj.rotation.z=turn.bank;
 if(weights.idle>.55&&!moving){
  const f=idleFidget(id,now,weights.idle),head=entry.head;
  if(head&&(f.headX||f.headY)){head.rotation.x+=f.headX;head.rotation.y+=f.headY;undo.push(()=>{head.rotation.x-=f.headX;head.rotation.y-=f.headY;});}
  if(hips&&f.hipZ){hips.rotation.z+=f.hipZ;undo.push(()=>{hips.rotation.z-=f.hipZ;});}
  const shoulders=entry.shoulders||[];
  if(f.shoulder&&shoulders.length)shoulders.forEach((b,i)=>{const d=i%2?-f.shoulder:f.shoulder;b.rotation.z+=d;undo.push(()=>{b.rotation.z-=d;});});
 }
 entry._locoUndo=undo;
}

// Camera bob eases in and out and is low-passed, so the stride still matches
// headBob but a single frame of movement cannot kick the view.
export function createBobSmoother(){
 let y=0,lateral=0,roll=0,amp=0;
 return {reset(){y=lateral=roll=amp=0;},step(phase,speed,opts={},dt=1/60){
  const slice=Math.max(0,Math.min(.1,Number.isFinite(dt)?dt:0));
  const moving=!!opts.moving&&!opts.airborne;
  const target=moving&&(opts.amount??1)>0?1:0;
  amp+=(target-amp)*(1-Math.exp(-(moving?5.5:8)*Math.max(slice,1e-3)));
  if(amp<1e-3&&!moving){y=lateral=roll=0;return {y:0,lateral:0,roll:0};}
  const amount=Math.max(0,Math.min(1,Number.isFinite(opts.amount)?opts.amount:0))*amp;
  const raw=headBob(phase,speed,{...opts,amount});
  const k=1-Math.exp(-14*Math.max(slice,1e-3));
  y+=(raw.y-y)*k;lateral+=(raw.lateral-lateral)*k;roll+=(raw.roll-roll)*k;
  return {y,lateral,roll};
 }};
}
