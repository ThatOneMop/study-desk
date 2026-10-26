// Sugar Squad cruisers: DOM-free pursuit AI that reuses the arcade car physics.
// They only exist while you drive during a pursuit. Break line of sight and outrun them to lose the chase.
import {stepCar,createCar,resolveMove} from './car-physics.mjs';

export const CRUISER_SPEC=Object.freeze({id:'cruiser',name:'Sugar Squad cruiser',mass:1.3,top:20.5,accel:7.2,reverse:5,steer:1.85,grip:8,drift:1,trunk:0});
export const CRUISER_SIGHT=46;
export const PULLOVER_RADIUS=5.2;
export const PULLOVER_SECONDS=1.8;
const wrap=a=>Math.atan2(Math.sin(a),Math.cos(a));
const finite=(v,d=0)=>Number.isFinite(v)?v:d;

// Picks a road point 50-75 m from the player, preferring one behind them, that is clear of walls.
export function cruiserSpawn(player,roads,{blocked=null,rand=Math.random,heading=0,avoid=[]}={}){
 let best=null,bestScore=-Infinity;
 for(let tries=0;tries<40;tries++){
  const road=roads[Math.floor(rand()*roads.length)%roads.length];if(!road)continue;
  const horizontal=road.axis==='horizontal';
  const along=horizontal?player.x+(rand()-.5)*150:player.z+(rand()-.5)*150;
  const x=horizontal?Math.max(road.x-road.w/2+4,Math.min(road.x+road.w/2-4,along)):road.x+(rand()-.5)*3;
  const z=horizontal?road.z+(rand()-.5)*3:Math.max(road.z-road.d/2+4,Math.min(road.z+road.d/2-4,along));
  const d=Math.hypot(x-player.x,z-player.z);if(d<48||d>80)continue;
  if(typeof blocked==='function'&&blocked(x,z))continue;
  if(avoid.some(o=>Math.hypot(o.x-x,o.z-z)<8))continue;
  const behind=-((x-player.x)*Math.sin(heading)+(z-player.z)*Math.cos(heading))/d;
  const score=behind-Math.abs(d-62)/40;
  if(score>bestScore){bestScore=score;const toward=Math.atan2(player.x-x,player.z-z);best={x,z,angle:horizontal?(Math.sin(toward)>0?Math.PI/2:-Math.PI/2):(Math.cos(toward)>0?0:Math.PI)};}
 }
 return best;
}
export function createCruiser(spot,id=0){const car=createCar(spot.x,spot.z,spot.angle);return {id,car,stuck:0,siren:0,lastSeen:0};}

// Steering: aim at where the player will be; handbrake round tight corners; reverse out when stuck.
export function cruiserInput(cruiser,target){
 const c=cruiser.car,lead=Math.min(1.2,Math.hypot(target.x-c.x,target.z-c.z)/18);
 const tx=target.x+finite(target.vx)*lead,tz=target.z+finite(target.vz)*lead;
 const want=Math.atan2(tx-c.x,tz-c.z),diff=wrap(want-c.angle),dist=Math.hypot(tx-c.x,tz-c.z);
 if(cruiser.reverse>0)return {throttle:-1,steer:-Math.sign(diff),handbrake:false};
 const steer=Math.max(-1,Math.min(1,diff*2.2));
 const slow=Math.hypot(finite(target.vx),finite(target.vz))<3;
 if(dist<6&&slow)return {throttle:c.long>1?-1:0,steer,handbrake:false};
 const close=dist<12&&slow?Math.max(.3,dist/12):1;
 return {throttle:(Math.abs(diff)>1.7?.45:1)*close,steer,handbrake:Math.abs(diff)>1.1&&c.speed>9};
}
// Steps every cruiser. clear(x,z,angle) is the world collision test. Returns {seen,pulled,respawn:[ids]}.
export function stepCruisers(list,{player,dt,clear,sight=null,playerSpeed=0,state}){
 const out={seen:false,boxed:false,pulled:false,respawn:[],nearest:Infinity};
 if(!list.length)return out;
 for(const cr of list){
  const c=cr.car,prev={x:c.x,z:c.z,angle:c.angle};
  stepCar(c,cruiserInput(cr,player),CRUISER_SPEC,dt);
  const hit=typeof clear==='function'?resolveMove(c,prev,clear):'free';
  const d=Math.hypot(player.x-c.x,player.z-c.z);out.nearest=Math.min(out.nearest,d);
  if(cr.reverse>0)cr.reverse=Math.max(0,cr.reverse-dt);
  else if(hit!=='free'||(c.speed<1&&d>9)){cr.stuck+=dt;if(cr.stuck>1.1){cr.stuck=0;cr.reverse=.9;cr.bumps=(cr.bumps||0)+1;}}
  else{cr.stuck=Math.max(0,cr.stuck-dt);cr.free=(cr.free||0)+dt;if(cr.free>3){cr.free=0;cr.bumps=0;}}
  if((cr.bumps||0)>3||d>140)out.respawn.push(cr.id);
  const looks=d<CRUISER_SIGHT&&(typeof sight!=='function'||sight({x:c.x,y:1.4,z:c.z},{x:player.x,y:1.2,z:player.z}));
  if(looks){out.seen=true;cr.lastSeen=0;}else cr.lastSeen+=dt;
  if(d<PULLOVER_RADIUS)out.boxed=true;
  cr.siren+=dt;
 }
 if(state){
  state.pull=out.boxed&&Math.abs(playerSpeed)<2.2?finite(state.pull)+dt:Math.max(0,finite(state.pull)-dt*.5);
  out.pulled=state.pull>=PULLOVER_SECONDS;
 }
 return out;
}
// Cruisers roll while the chase is a pursuit and you are driving.
export const cruisersWanted=(stage,driving)=>!!driving&&(stage==='pursuit'||stage==='all-units');
export const cruiserCount=(stage,quality)=>stage==='all-units'?(quality==='low'?2:3):(quality==='low'?1:2);
