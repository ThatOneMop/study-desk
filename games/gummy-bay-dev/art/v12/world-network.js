// Routed customers, safe vehicle sweeps, recovery and co-op command receipts.
const customerPaths=new Map();let customerPathBudget=1;
const customers11=updateCustomers;updateCustomers=function(dt){customerPathBudget=1;customers11(dt);};
function moveCustomerTo(c,i,target,dt){if(Math.hypot(player.x-c.x,player.z-c.z)<=2.5)return;let aim=target;
 if(!copSight(c,target)){let route=customerPaths.get(i);if(!route||route.expires<now||Math.hypot(route.tx-target.x,route.tz-target.z)>2){if(customerPathBudget<=0)return;customerPathBudget--;route={path:copPath(c,target),expires:now+3,tx:target.x,tz:target.z};customerPaths.set(i,route);}while(route.path.length&&Math.hypot(c.x-route.path[0].x,c.z-route.path[0].z)<.5)route.path.shift();if(!route.path.length)return;aim=route.path[0];}
 let dx=aim.x-c.x,dz=aim.z-c.z,d=Math.hypot(dx,dz),amount=Math.min(d,dt*1.05);if(d<.01)return;let nx=c.x+dx/d*amount,nz=c.z+dz/d*amount;if(!blocked(nx,c.z))c.x=nx;if(!blocked(c.x,nz))c.z=nz;
}
function vehicleSweep(x,z,angle){const distance=Math.hypot(x-player.x,z-player.z),steps=Math.max(1,Math.ceil(distance/.25));for(let i=1;i<=steps;i++)if(!vehicleClear(player.x+(x-player.x)*i/steps,player.z+(z-player.z)*i/steps,angle))return false;return true;}
let lastSafe={x:-52,z:32},stuckSeconds=0;
function recoverPosition(){if(!active||net.role==='guest'||ensurePolice().search||ensurePolice().officers.some(c=>c.target===localPoliceRole()&&c.mode!=='patrol')){toast('Recovery is unavailable during a police encounter or as a guest.');return;}if(!blocked(player.x,player.z)){toast('Your position is clear. Use the map for directions.');return;}if(!blocked(lastSafe.x,lastSafe.z)){driving=false;driveSpeed=0;player.set(lastSafe.x,1.72,lastSafe.z);locomotion.x=locomotion.z=0;close();save();toast('Returned to your last clear position.');}}window.recoverPosition=recoverPosition;
const update11=update;update=function(dt){update11(dt);if(active&&!blocked(player.x,player.z)){lastSafe={x:player.x,z:player.z};stuckSeconds=0;}else if(active)stuckSeconds+=dt;};
const load11=load;load=function(...args){load11(...args);customerPaths.clear();copPaths.clear();if(!blocked(player.x,player.z))lastSafe={x:player.x,z:player.z};};window.loadGame=load;
const network11=networkTick;networkTick=function(dt){network11(dt);if(other&&!visualActors.some(a=>a.g===other)){const variant=other.userData.id%3;if(citizenTemplates[variant])installCitizen(citizenTemplates[variant],variant);}};
function validPose(p){return p&&[p.x,p.z,p.yaw].every(Number.isFinite)&&p.x>=WORLD.minX&&p.x<=WORLD.maxX&&p.z>=WORLD.minZ&&p.z<=WORLD.maxZ;}
function validSharedState(v){return v&&v.version===3&&['cash','bank','xp','x','z','day','time'].every(k=>Number.isFinite(v[k]))&&['seeds','raw','gummies','packs'].every(k=>Array.isArray(v[k])&&v[k].length>=6&&v[k].length<=STRAINS.length&&v[k].every(n=>Number.isFinite(n)&&n>=0))&&Array.isArray(v.plants)&&v.plants.length<=8&&Array.isArray(v.deals)&&v.threads&&typeof v.threads==='object';}
function remoteActionAllowed(msg){if(!net.remote||Math.hypot(net.remote.x-msg.x,net.remote.z-msg.z)>3)return false;const k=msg.k;
 if(['list','text','offer','cancelDeal','payment','complyPolice','dropProp','throwProp'].includes(k))return true;
 const mapping={call:'payphone',rent:'reception',job:'reception',buyTent:'hardware',buyCan:'hardware',buyTrimmers:'hardware',buyPackStation:'hardware',buyMixer:'hardware',lights:'hardware',bench:'hardware',irrigation:'hardware',seed:'dealer',soil:'dealer',wrappers:'store',lemonade:'store',ingredient:'servo',fill:'sink',make:'craft',pack:'craft',mix:'mix',hire:'helpers',worker:'helpers',staffAssign:'helpers',house:'property',deposit:'laundry',withdraw:'laundry',front:'laundry',sleep:'bed',atmDeposit:'atm',atmWithdraw:'atm',recycle:'recycler',stash:'stockroom',unstash:'stockroom',buyVehicle:'garage',install:'tent',prepare:'tent',plant:'tent',water:'tent',harvest:'tent',placeTent:'tent',pickup:'litter',grabProp:'prop',sample:'customer',deliver:'customer'};
 const type=k==='batch'?(msg.a?.kind==='mix'?'mix':'craft'):mapping[k];if(!type)return false;
 return points.some(p=>p.type===type&&pointVisible(p)&&Math.hypot(msg.x-p.x,msg.z-p.z)<=5&&(type!=='tent'||p.i===msg.a)&&(type!=='customer'||p.i===msg.a)&&(type!=='litter'||p.id===msg.a));
}
let guestSequence=0,pendingCommands=new Map();
const send11=netSend;netSend=function(msg){if(msg.type==='action'&&net.role==='guest'){if(!net.connected){toast('Reconnect to the host first.');return;}send11({type:'position',player:playerPacket()});msg={...msg,seq:++guestSequence};pendingCommands.set(msg.seq,now);}send11(msg);};
const wire11=wireChannel;wireChannel=function(ch){wire11(ch);const oldMessage=ch.onmessage,oldClose=ch.onclose;let lastCommand=0;guestSequence=0;pendingCommands.clear();
 ch.onmessage=e=>{let m;try{m=JSON.parse(e.data);}catch{return;}
  if(m.type==='ack'){pendingCommands.delete(m.seq);if(m.error)toast(m.error);return;}
  if(['welcome','state'].includes(m.type)&&net.role==='guest'&&!validSharedState(m.state)){toast('Invalid shared state ignored. Reconnect if this continues.');return;}
  if(m.type==='position'&&!validPose(m.player))return;
  if(m.type==='state'&&m.player&&!validPose(m.player))return;
  if(m.type==='action'&&net.role==='host'){
   if(!Number.isSafeInteger(m.seq)||m.seq<=0)return;
   if(m.seq<=lastCommand){send11({type:'ack',seq:m.seq});return;}
   lastCommand=m.seq;
   if(!remoteActionAllowed(m)){send11({type:'ack',seq:m.seq,error:'Move to the correct shop or workstation and try again.'});return;}
   oldMessage(e);send11({type:'ack',seq:m.seq});return;
  }
  oldMessage(e);
 };
 ch.onclose=()=>{oldClose?.();pendingCommands.clear();keys={};if(net.role==='guest'){if(stationTask)cancelStation();menu('network');toast('Host disconnected. Shared actions are paused; your personal saves are safe.');}};
};
// Loud running or a moving van draws attention only nearby and through an unobstructed path.
const police12=tickPolice;tickPolice=function(dt){police12(dt);if(net.role==='guest')return;if(!s.made&&!s.sold)return;const p=ensurePolice();if(p.cooldown||p.search)return;const loud=driving?Math.abs(driveSpeed)>5:!!(walk&&keys.shift);if(loud)for(const cop of p.officers)if(cop.mode==='patrol'&&Math.hypot(cop.x-player.x,cop.z-player.z)<(driving?14:7)&&copSight(cop,player)){cop.target='host';cop.angle=Math.atan2(player.x-cop.x,player.z-cop.z);cop.suspicion=Math.min(100,cop.suspicion+dt*12);}};
const menu12=menu;menu=function(which,data){menu12(which,data);if(which==='pause')$('modal').innerHTML+=row('Position recovery','Use only if you are inside blocked geometry. Unavailable during police encounters.','Recover position','recoverPosition()',!blocked(player.x,player.z));if(which==='network')$('modal').innerHTML+='<p class="note">Commands use receipts and duplicate protection. A guest must be at the relevant shop or station. If disconnected, rejoin with a new invite; the host’s save is authoritative.</p>';};window.menu=menu;
