// Headless day harness. Off unless the page is opened with ?qa=day.
// It never selects a story slot key; the game writes gummybay-qa-day instead.
import {RV_SUPPORT} from './rv-support.mjs?v=53';

export function readQaFlag(search){
 const text=String(search||'');
 const query=new URLSearchParams(text.startsWith('?')?text.slice(1):text);
 return query.get('qa')==='day'?'day':null;
}
export function qaStorageKey(flag){return flag==='day'?'gummybay-qa-day':null;}

export function inCamper(x,z){
 const r=RV_SUPPORT;
 return Number.isFinite(x)&&Number.isFinite(z)&&x>r.minX&&x<r.maxX&&z>r.minZ&&z<r.maxZ;
}

// Spawn faces east (yaw -PI/2). Strafing here walks into the rear wall.
export function camperExitHold(yaw){
 const face=-Math.PI/2;
 const diff=Math.atan2(Math.sin(face-yaw),Math.cos(face-yaw));
 if(Math.abs(diff)>.2)return {[diff>0?'arrowleft':'arrowright']:true};
 return {w:true};
}

export function steerHold({yaw,x,z,tx,tz,stuck=0,arrive=1.15}){
 const dist=Math.hypot(tx-x,tz-z);
 if(dist<=arrive)return {hold:{},arrived:true};
 if(stuck>.8&&stuck<1.7)return {hold:{s:true,arrowleft:true},arrived:false};
 const desired=Math.atan2(-(tx-x),-(tz-z));
 const diff=Math.atan2(Math.sin(desired-yaw),Math.cos(desired-yaw));
 const hold={};
 if(Math.abs(diff)>.45)hold[diff>0?'arrowleft':'arrowright']=true;
 else{hold.w=true;if(dist>8)hold.shift=true;if(Math.abs(diff)>.08)hold[diff>0?'arrowleft':'arrowright']=true;}
 return {hold,arrived:false};
}

const NODES={
 rv:[-50,27],phone:[-47,30.2],lane:[-8,28],courtOut:[-25,28],courtIn:[-25,22.5],
 roadW:[-8,0],roadM:[10,0],roadE:[30,0],roomE:[-8,52],roomOut:[-25,52],roomIn:[-25,44],
 roomMid:[-22,40],tent:[-31,36.8],sink:[-18,37.2],craft:[-18,45],
 hwOut:[-24,-12.2],hwIn:[-24,-17.6],southRun:[10,36],miloOut:[25,33.5],miloIn:[25,27],
 storeOut:[24,-13.2],storeIn:[24,-19],helpOut:[-53,-12.2],helpIn:[-53,-19],
 cop:[6,4],jules:[-7,22]
};
const LINKS=[
 ['rv','phone'],['rv','lane'],['phone','lane'],['lane','courtOut'],['courtOut','courtIn'],
 ['lane','roadW'],['lane','roomE'],['lane','jules'],['roomE','roomOut'],['roomOut','roomIn'],
 ['roomIn','roomMid'],['roomIn','craft'],['roomMid','tent'],['roomMid','sink'],['sink','craft'],
 ['roadW','roadM'],['roadM','roadE'],['roadW','hwOut'],['hwOut','hwIn'],['roadW','helpOut'],
 ['helpOut','helpIn'],['roadM','southRun'],['southRun','miloOut'],['miloOut','miloIn'],
 ['roadE','storeOut'],['storeOut','storeIn'],['roadM','cop']
];
const PLACE_NODE={payphone:'phone',reception:'courtIn',hardware:'hwIn',dealer:'miloIn',store:'storeIn',helpers:'helpIn',tent:'tent',sink:'sink',craft:'craft',cop:'cop',jules:'jules'};

function nearestNode(x,z){
 let best='rv',score=Infinity;
 for(const [id,p] of Object.entries(NODES)){const d=Math.hypot(x-p[0],z-p[1]);if(d<score){score=d;best=id;}}
 return best;
}
function routeNodes(from,to){
 if(from===to)return [to];
 const next=new Map(LINKS.flatMap(([a,b])=>[[a,[]],[b,[]]]));
 for(const [a,b] of LINKS){next.get(a).push(b);next.get(b).push(a);}
 const queue=[from],prev=new Map([[from,null]]);
 while(queue.length){const id=queue.shift();if(id===to)break;for(const n of next.get(id)||[])if(!prev.has(n)){prev.set(n,id);queue.push(n);}}
 if(!prev.has(to))return [NODES[to]?to:from];
 const path=[];
 for(let id=to;id;id=prev.get(id))path.push(id);
 path.reverse();
 return path;
}
function routePoints(x,z,place){
 const goal=PLACE_NODE[place];
 if(!goal)return [];
 const path=routeNodes(nearestNode(x,z),goal).map(id=>NODES[id]);
 let i=0;
 while(i<path.length-1&&Math.hypot(x-path[i][0],z-path[i][1])<2.2)i++;
 return path.slice(i);
}

const round=n=>Number.isFinite(n)?Math.round(n*10)/10:n;

export function createDayDirector(){
 const flags={policeDone:false,hireTried:false,curfewNoted:false,curfewHold:0};
  const wp={id:'',stuck:0,x:0,z:0,noted:false};
 const events=[];
 let phase='boot',lastNote='';
 function note(snap,text,extra){
  if(!text||text===lastNote)return;
  lastNote=text;
  events.push({note:text,x:round(snap.x),z:round(snap.z),time:round(snap.time),day:snap.day,cash:snap.cash,...extra});
  if(events.length>80)events.shift();
 }
 function sync(snap){
  if(snap.policeReport)flags.policeDone=true;
  if(snap.curfew&&!flags.curfewNoted){flags.curfewNoted=true;note(snap,'curfew started',{residents:snap.residents||[]});}
 }
 function busy(snap){return !!(snap.plant||snap.raw||snap.gummies||snap.packs||(snap.deal??-1)>=0);}
 function setup(snap){
  if(!snap.called)return {id:'call',place:'payphone',action:['call']};
  if(!snap.room)return {id:'rent',place:'reception',action:['rent']};
  if(!snap.tents)return {id:'buyTent',place:'hardware',action:['buyTent']};
  if(!snap.can)return {id:'buyCan',place:'hardware',action:['buyCan']};
  if(!snap.trimmers)return {id:'buyTrimmers',place:'hardware',action:['buyTrimmers']};
  if(!snap.packStation)return {id:'buyPack',place:'hardware',action:['buyPackStation']};
  return null;
 }
 function craft(snap){
  if(snap.tents>0&&!snap.installed)return {id:'install',place:'tent',action:['install',0]};
  if(snap.installed&&!snap.plant&&snap.soil>0&&snap.seeds>0)return {id:'prepare',place:'tent',action:['prepare',0]};
  if(snap.plant?.phase==='soil'&&snap.seeds>0)return {id:'plant',place:'tent',action:['plant',0,0]};
  if(snap.plant&&(snap.plant.phase==='dry'||snap.plant.phase==='thirsty'))return snap.water>0?{id:'water',place:'tent',action:['water',0]}:{id:'fill',place:'sink',action:['fill']};
  if(snap.plant?.phase==='growing')return {id:'grow',ripe:true};
  if(snap.plant?.phase==='mature')return {id:'harvest',place:'tent',action:['harvest',0]};
  if(snap.raw>0)return {id:'make',place:'craft',action:['make',0]};
  if(snap.gummies>0&&snap.wrappers<=0)return {id:'wrappers',place:'store',action:['wrappers']};
  if(snap.gummies>0)return {id:'pack',place:'craft',action:['pack',0]};
  if(snap.packs>0&&(snap.deal??-1)<0&&!snap.listing)return {id:'list',action:['list',0,Math.min(4,snap.packs),34]};
  if(snap.packs>0&&(snap.deal??-1)<0&&snap.thread?.status==='negotiating')return {id:'offer',action:['offer',0,snap.thread.counter||30]};
  if(snap.packs>0&&(snap.deal??-1)<0)return {id:'text',action:['text',0]};
  if((snap.deal??-1)>=0)return {id:'deliver',place:'customer',action:['deliver',snap.deal]};
  return null;
 }
 function restock(snap){
  if(snap.cash<40||busy(snap))return null;
  if(snap.seeds<1)return {id:'seed',place:'dealer',action:['seed',0]};
  if(snap.soil<1)return {id:'soil',place:'dealer',action:['soil']};
  if(snap.wrappers<4)return {id:'wrappers',place:'store',action:['wrappers']};
  return null;
 }
 function goal(snap){
  sync(snap);
  if(!snap.active)return {id:'boot'};
  if(snap.search)return {id:'search'};
  if(snap.station)return {id:'station'};
  if(snap.work)return {id:'work'};
  if(snap.panel)return {id:'close'};
  if(inCamper(snap.x,snap.z))return {id:'exit'};
  const first=setup(snap);
  if(first)return first;
  const job=craft(snap);
  if(job)return job;
  if(snap.sold>0&&!flags.policeDone)return {id:'police'};
  if(!snap.hired&&!flags.hireTried&&!busy(snap)&&snap.level>=3&&(snap.cash>=650||snap.harvested>=8))return {id:'hire',place:'helpers',action:['hire','gardener']};
  if(!(flags.policeDone&&(snap.hired||flags.hireTried))){const more=restock(snap);if(more)return more;}
  if(!snap.hired&&!flags.hireTried&&snap.level>=3&&!busy(snap))return {id:'hire',place:'helpers',action:['hire','gardener']};
  if(!flags.curfewNoted||flags.curfewHold<36)return {id:'curfew'};
  return {id:'done'};
 }
 function trackStuck(id,snap){
  if(wp.id!==id){wp.id=id;wp.stuck=0;wp.noted=false;wp.x=snap.x;wp.z=snap.z;}
  const moved=Math.hypot((snap.x||0)-wp.x,(snap.z||0)-wp.z);
  if(moved>.4){wp.stuck=0;wp.noted=false;}else wp.stuck+=snap.step||0;
  wp.x=snap.x;wp.z=snap.z;
  if(wp.stuck>8&&!wp.noted){wp.noted=true;note(snap,'held up on '+id);}
  return wp.stuck;
 }
 function walk(goalNow,snap){
  let points;
  if(goalNow.id==='police'){
   const cop=(snap.officers||[]).reduce((best,c)=>!c?best:!best||Math.hypot(snap.x-c.x,snap.z-c.z)<Math.hypot(snap.x-best.x,snap.z-best.z)?c:best,null);
   points=cop&&Math.hypot(snap.x-cop.x,snap.z-cop.z)<28?[[cop.x,cop.z]]:routePoints(snap.x,snap.z,'cop');
  }else if(goalNow.place==='customer'){
   const c=snap.customers?.[goalNow.action[1]]||{x:-7,z:21};
   points=routePoints(snap.x,snap.z,'jules').concat([[c.x,c.z]]);
  }else points=routePoints(snap.x,snap.z,goalNow.place);
  if(!points.length)return {hold:{},fast:.2,note:goalNow.id};
  const [tx,tz]=points[0];
  const stuck=trackStuck(goalNow.id,snap);
  const last=points.length===1;
  const arrive=goalNow.id==='police'&&last?3.2:1.15;
  let aimX=tx,aimZ=tz;
  if(stuck>2.4){const side=(Math.floor(stuck)%2?1:-1)*2.4;aimX+=side;aimZ+=side*.35;}
  const steered=steerHold({yaw:snap.yaw,x:snap.x,z:snap.z,tx:aimX,tz:aimZ,stuck,arrive});
  if(steered.arrived&&last)return {hold:{},fast:goalNow.id==='police'?2:.35,note:goalNow.id+' waiting'};
  return {hold:steered.hold,fast:1,note:goalNow.id};
 }
 function intent(snap){
  const goalNow=goal(snap);
  phase=goalNow.id;
  if(goalNow.id==='curfew'&&snap.curfew)flags.curfewHold+=snap.step||0;
  const base={hold:{},press:null,action:null,close:false,ripe:false,skipWork:false,fast:0,awaitCurfew:false,done:false,phase:goalNow.id};
  if(goalNow.id==='boot')return {...base,note:'boot'};
  if(goalNow.id==='close')return {...base,close:true,note:'close '+snap.panel};
  if(goalNow.id==='search')return {...base,fast:3,note:'police search'};
  if(goalNow.id==='station')return {...base,fast:2.5,note:'station '+ (snap.stationKind||'')};
  if(goalNow.id==='work')return {...base,skipWork:true,fast:.05,note:'work'};
  if(goalNow.id==='grow')return {...base,ripe:true,fast:.35,note:'grow'};
  if(goalNow.id==='exit'){trackStuck('exit',snap);return {...base,hold:camperExitHold(snap.yaw),fast:.8,note:'exit camper'};}
  if(goalNow.id==='curfew'){
   if(!snap.curfew||flags.curfewHold<36)return {...base,fast:snap.curfew?4:6,awaitCurfew:true,note:snap.curfew?'curfew holding':'wait for 22:00'};
   note(snap,'day complete',{residents:snap.residents||[]});
   return {...base,done:true,note:'day complete'};
  }
  if(goalNow.id==='done')return {...base,done:true,note:'day complete'};
  if(goalNow.id==='police'&&snap.canComply)return {...base,press:'h',fast:.3,note:'comply'};
  const needsPlace=!!goalNow.place;
  if(goalNow.action&&(!needsPlace||snap.reach)){
   if(goalNow.action[0]==='hire')flags.hireTried=true;
   note(snap,goalNow.id);
   return {...base,action:goalNow.action,fast:.15,note:goalNow.id};
  }
  const moving=walk(goalNow,snap);
  if(moving.note)note(snap,moving.note);
  return {...base,...moving,phase:goalNow.id};
 }
 return {preview:goal,intent,report:()=>({phase,done:phase==='done',events:[...events],policeDone:flags.policeDone,hireTried:flags.hireTried,curfew:flags.curfewNoted})};
}
