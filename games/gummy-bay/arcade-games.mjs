// Lucky Pier arcade cabinets: five original skill games as pure state machines.
// Coordinates are normalised (x 0..1 left to right, y 0..1 top to bottom). Each
// step(st,dt,input) pushes juice events into st.events for audio and shake.
// Nothing here is random chance for payouts. Layouts come from a fixed seed,
// and the score depends only on aim and timing.
export function rng(seed=1){let a=seed>>>0||1;return()=>{a=a+0x6d2b79f5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const EMPTY_INPUT=Object.freeze({px:null,py:null,down:false,pressed:false,released:false,left:false,right:false,hole:-1});
const ev=(st,kind,extra={})=>st.events.push({kind,...extra});
// A ping-pong meter 0..1..0 whose speed is fixed, so timing is learnable.
const meter=(t,period)=>{const p=(t%period)/period;return p<.5?p*2:2-p*2;};

// ---------------- Gummy Grabber (claw) ----------------
const PLUSH_COLORS=['#ff5f7a','#ffd23f','#5fd1ff','#7dff6a','#c38bff','#ff9b3d'];
export function createClaw(seed=7){
 const r=rng(seed),plush=[];
 const slots=[.3,.4,.5,.6,.7,.8,.9];
 slots.forEach((x,i)=>plush.push({x:x+(r()-.5)*.03,y:.82-(i%2)*.06,color:PLUSH_COLORS[i%PLUSH_COLORS.length],value:i===5?20:i%3===0?12:8,gold:i===5,state:'pile',vy:0}));
 return {id:'claw',time:45,t:0,done:false,score:0,grabs:4,clawX:.5,clawY:.12,vx:0,sway:0,swayV:0,phase:'aim',phaseT:0,held:null,slip:false,plush,events:[],message:'Line up and drop',combo:0};
}
export function stepClaw(st,dt,inp){
 st.events.length=0;if(st.done)return st;st.t+=dt;st.phaseT+=dt;
 const target=st.phase==='aim'?(inp.px!=null?clamp(inp.px,.24,.95):clamp(st.clawX+((inp.right?1:0)-(inp.left?1:0))*.5*dt,.24,.95)):st.clawX;
 if(st.phase==='aim'){const nx=clamp(st.clawX+clamp(target-st.clawX,-.6*dt,.6*dt),.24,.95);st.vx=(nx-st.clawX)/Math.max(dt,1e-4);st.clawX=nx;}
 // Pendulum sway driven by carriage acceleration; settles in about 1.5 s.
 st.swayV+=(-st.sway*38-st.swayV*4.2-(st.phase==='aim'?st.vx*.9:0))*dt;st.sway=clamp(st.sway+st.swayV*dt,-.06,.06);
 const tipX=st.clawX+st.sway;
 if(st.phase==='aim'){if(inp.pressed&&st.grabs>0){st.phase='drop';st.phaseT=0;st.grabs--;ev(st,'drop');}}
 else if(st.phase==='drop'){st.clawY=Math.min(.78,st.clawY+dt*.5);if(st.clawY>=.78){
   let best=null,bd=1;for(const p of st.plush)if(p.state==='pile'){const d=Math.abs(p.x-tipX);if(d<bd){bd=d;best=p;}}
   st.phase='lift';st.phaseT=0;
   if(best&&bd<.03){st.held=best;best.state='held';st.slip=false;ev(st,'grab');st.message='Got it!';}
   else if(best&&bd<.065){st.held=best;best.state='held';st.slip=true;ev(st,'grab');st.message='Wobbly grip...';}
   else{st.held=null;ev(st,'miss');st.message='Missed. Watch the swing.';}
 }}
 else if(st.phase==='lift'){st.clawY=Math.max(.12,st.clawY-dt*.42);
   if(st.held&&st.slip&&st.clawY<.5){st.held.state='fall';st.held.vy=0;st.held.x=tipX;st.held.y=st.clawY+.08;st.held=null;st.slip=false;ev(st,'slip');st.message='It slipped! Centre it next time.';}
   if(st.clawY<=.12){st.phase=st.held?'carry':'reset';st.phaseT=0;}}
 else if(st.phase==='carry'){st.clawX=Math.max(.1,st.clawX-dt*.4);if(st.clawX<=.1){st.held.state='chute';st.held.x=.1;st.held.y=.2;st.held.vy=0;const v=st.held.value;st.score+=v;ev(st,'prize',{value:v,gold:st.held.gold});st.held=null;st.phase='reset';st.phaseT=0;st.message='+'+v+' tickets!';}}
 else if(st.phase==='reset'){if(st.phaseT>.8){st.phase='aim';st.phaseT=0;}}
 if(st.held){st.held.x=tipX;st.held.y=st.clawY+.08;}
 for(const p of st.plush){if(p.state==='fall'){p.vy+=dt*2.4;p.y+=p.vy*dt;if(p.y>=.82){p.y=.82;p.state='pile';ev(st,'thud');}}if(p.state==='chute'){p.vy+=dt*2.4;p.y+=p.vy*dt;if(p.y>1.1)p.state='won';}}
 if(st.t>=st.time||(st.grabs<=0&&st.phase==='aim')){st.done=true;ev(st,'end');}
 return st;
}

// ---------------- Skee-Bay ----------------
export const SKEE_HOLES=Object.freeze([
 {x:.5,y:.62,r:.035,pts:50},{x:.5,y:.62,r:.07,pts:40},{x:.5,y:.62,r:.11,pts:30},{x:.5,y:.62,r:.15,pts:20},{x:.5,y:.62,r:.2,pts:10},
 {x:.3,y:.3,r:.03,pts:100},{x:.7,y:.3,r:.03,pts:100}]);
// Landing point from aim (lane x) and power. Power maps to depth up the ramp.
export function skeeLanding(aim,power){return {x:clamp(aim,.15,.85),y:clamp(1-.12-power*.78,.12,.95)};}
export function skeeScore(x,y){
 for(const h of SKEE_HOLES.slice(5))if(Math.hypot(x-h.x,(y-h.y)*.8)<=h.r)return h.pts;
 for(const h of SKEE_HOLES.slice(0,5))if(Math.hypot(x-h.x,(y-h.y)*.8)<=h.r)return h.pts;
 return 0;
}
export function createSkee(){return {id:'skee',time:45,t:0,done:false,score:0,points:0,balls:9,aim:.5,charging:false,chargeT:0,power:0,ball:null,phase:'aim',events:[],last:null,message:'Hold to charge, release to roll'};}
export function stepSkee(st,dt,inp){
 st.events.length=0;if(st.done)return st;st.t+=dt;
 if(st.phase==='aim'){
  if(inp.px!=null&&!st.charging)st.aim=clamp(inp.px,.15,.85);else st.aim=clamp(st.aim+((inp.right?1:0)-(inp.left?1:0))*.45*dt,.15,.85);
  if(inp.pressed&&st.balls>0){st.charging=true;st.chargeT=0;ev(st,'charge');}
  if(st.charging){st.chargeT+=dt;st.power=meter(st.chargeT,1.4);}
  if(st.charging&&(inp.released||!inp.down)){st.charging=false;st.balls--;const land=skeeLanding(st.aim,st.power);st.ball={x:st.aim,y:.97,tx:land.x,ty:land.y,t:0};st.phase='roll';ev(st,'roll');}
 }else if(st.phase==='roll'){
  const b=st.ball;b.t+=dt/1.25;const k=Math.min(1,b.t);b.x=st.aim+(b.tx-st.aim)*k;b.y=.97+(b.ty-.97)*k;b.hop=Math.sin(Math.PI*clamp((k-.55)/.45,0,1))*.05;
  if(b.t>=1){const pts=skeeScore(b.tx,b.ty);st.points+=pts;st.score=Math.round(st.points/25);st.last={pts,x:b.tx,y:b.ty,t:0};ev(st,pts>=100?'jackpot':pts>=40?'hit':pts>0?'clack':'miss',{pts});st.message=pts?'+'+pts:'Gutter!';st.ball=null;st.phase='wait';st.waitT=0;}
 }else if(st.phase==='wait'){st.waitT+=dt;if(st.waitT>.8)st.phase='aim';}
 if(st.last)st.last.t+=dt;
 if(st.t>=st.time||(st.balls<=0&&st.phase==='aim')){st.done=true;ev(st,'end');}
 return st;
}

// ---------------- Gummy Drop (pusher) ----------------
// Seven lanes of gummy coins. The pusher plate sweeps forward and back; a drop
// lands behind the lane under the chute, and a packed lane shoves its front coin
// off the ledge. Skill = timing the sliding chute over the fullest lanes.
export const DROP_R=.034,DROP_LANES=7,DROP_EDGE=.95;
export const laneX=i=>.2+i*.1;
export function pusherY(t){return .24+meter(t,2.6)*.2;}
export function createDrop(seed=11){
 const r=rng(seed),lanes=[];
 for(let i=0;i<DROP_LANES;i++){const n=4+Math.floor(r()*3),coins=[];let y=DROP_EDGE-DROP_R-.01-r()*.05;
  for(let k=0;k<n;k++){coins.push({y,gold:k===0&&(i===1||i===5),fall:0,x:laneX(i)});y-=DROP_R*2+r()*.03;}
  lanes.push(coins);}
 return {id:'drop',time:40,t:0,done:false,score:0,drops:20,pusher:.3,dropX:.5,lane:3,lanes,falling:[],events:[],message:'Tap to drop when the chute is over a full lane',cooldown:0,settle:0};
}
export function stepDrop(st,dt,inp){
 st.events.length=0;if(st.done)return st;st.t+=dt;st.cooldown=Math.max(0,st.cooldown-dt);
 st.dropX=.2+meter(st.t,2.2)*.6;st.lane=Math.round((st.dropX-.2)/.1);st.pusher=pusherY(st.t);
 if(inp.pressed&&st.drops>0&&st.cooldown<=0){st.drops--;st.cooldown=.55;const lane=st.lanes[st.lane];const back=lane[lane.length-1];
  lane.push({x:laneX(st.lane),y:Math.max(st.pusher+DROP_R,back?Math.min(back.y-DROP_R*2,st.pusher+DROP_R):st.pusher+DROP_R),gold:st.drops%5===0,fall:0,fresh:.3});ev(st,'clink',{lane:st.lane});}
 const D=DROP_R*2;
 st.lanes.forEach((lane,i)=>{
  let behind=st.pusher-DROP_R;
  for(let k=lane.length-1;k>=0;k--){const c=lane[k];c.y=Math.max(c.y,behind+D);behind=c.y;if(c.fresh)c.fresh=Math.max(0,c.fresh-dt);}
  while(lane.length&&lane[0].y>DROP_EDGE){const c=lane.shift();c.fall=.01;st.falling.push(c);const v=c.gold?4:1;st.score+=v;ev(st,c.gold?'jackpot':'coin',{value:v,x:c.x});}
 });
 for(const c of st.falling){c.fall+=dt*2.5;c.y+=dt*.5;}st.falling=st.falling.filter(c=>c.fall<1.2);
 if(st.drops<=0&&!st.settle)st.settle=st.t+3;
 if(st.t>=st.time||(st.settle&&st.t>=st.settle)){st.done=true;ev(st,'end');}
 return st;
}

// ---------------- Whack-a-Bear ----------------
export const WHACK_HOLES=Object.freeze(Array.from({length:9},(_,i)=>({x:.25+(i%3)*.25,y:.33+Math.floor(i/3)*.24})));
export function createWhack(seed=5){
 const r=rng(seed),plan=[];let t=.6;
 while(t<29){const life=Math.max(.55,1.05-t*.017);const hole=Math.floor(r()*9);const roll=r();plan.push({at:t,hole,life,kind:roll<.12?'gold':roll<.27?'cat':'bear'});t+=Math.max(.32,.78-t*.015);}
 return {id:'whack',time:30,t:0,done:false,score:0,hits:0,combo:0,plan,next:0,up:[],events:[],message:'Bonk the bears!',bonks:[]};
}
export function stepWhack(st,dt,inp){
 st.events.length=0;if(st.done)return st;st.t+=dt;
 while(st.next<st.plan.length&&st.plan[st.next].at<=st.t){const p=st.plan[st.next++];if(!st.up.some(u=>u.hole===p.hole))st.up.push({...p,age:0,hit:false});}
 let hole=inp.hole;
 if(hole<0&&inp.pressed&&inp.px!=null){let bd=.1;WHACK_HOLES.forEach((h,i)=>{const d=Math.hypot(inp.px-h.x,(inp.py-h.y)*.6);if(d<bd){bd=d;hole=i;}});}
 if(hole>=0){const u=st.up.find(u=>u.hole===hole&&!u.hit);st.bonks.push({hole,t:0});
  if(u){u.hit=true;u.age=Math.max(u.age,u.life-.18);if(u.kind==='cat'){st.combo=0;st.hits=Math.max(0,st.hits-2);ev(st,'buzz');st.message='Not the cat!';}
   else{st.combo++;const v=(u.kind==='gold'?3:1)+(st.combo>=5?1:0);st.hits+=v;ev(st,u.kind==='gold'?'jackpot':'whack',{combo:st.combo});st.message=st.combo>=5?'Combo x'+st.combo+'!':'Bonk!';}}
  else{st.combo=0;ev(st,'miss');}}
 for(const u of st.up){u.age+=dt;if(!u.hit&&u.age>=u.life&&u.kind!=='cat'&&!u.missed){u.missed=true;st.combo=0;}}
 st.up=st.up.filter(u=>u.age<u.life+.15);for(const b of st.bonks)b.t+=dt;st.bonks=st.bonks.filter(b=>b.t<.25);
 st.score=Math.round(st.hits*.35);
 if(st.t>=st.time){st.done=true;ev(st,'end');}
 return st;
}

// ---------------- Pier Hoops ----------------
// Physics in court units: x 0..1.6, y 0..1 (up). Rendered with y flipped.
export const HOOP=Object.freeze({y:.66,half:.075,rim:.012,board:.09});
export function hoopX(t){return t<18?1.28:1.24+Math.sin((t-18)*1.4)*.12;}
export function createHoop(){return {id:'hoop',time:40,t:0,done:false,score:0,makes:0,streak:0,angle:.95,charging:false,chargeT:0,power:0,ball:null,phase:'aim',events:[],message:'Aim, hold, release',shots:0};}
export function launchHoop(angle,power){const v=1.45+power*.8;return {x:.18,y:.28,vx:Math.cos(angle)*v,vy:Math.sin(angle)*v,scored:false,age:0,touched:false};}
export function stepHoop(st,dt,inp){
 st.events.length=0;if(st.done)return st;st.t+=dt;const hx=hoopX(st.t);
 if(st.phase==='aim'){
  if(inp.px!=null&&inp.py!=null&&!st.charging){const dx=inp.px*1.6-.18,dy=(1-inp.py)-.28;if(dx>.05)st.angle=clamp(Math.atan2(dy,dx),.5,1.35);}
  else st.angle=clamp(st.angle+((inp.left?1:0)-(inp.right?1:0))*.9*dt,.5,1.35);
  if(inp.pressed){st.charging=true;st.chargeT=0;ev(st,'charge');}
  if(st.charging){st.chargeT+=dt;st.power=meter(st.chargeT,1.5);}
  if(st.charging&&(inp.released||!inp.down)){st.charging=false;st.ball=launchHoop(st.angle,st.power);st.phase='fly';st.shots++;ev(st,'throw');}
 }else if(st.phase==='fly'){
  const b=st.ball,G=2.2,sub=4;
  for(let k=0;k<sub;k++){const h=dt/sub,py=b.y;b.vy-=G*h;b.x+=b.vx*h;b.y+=b.vy*h;b.age+=h;
   for(const rx of [hx-HOOP.half,hx+HOOP.half]){const dx=b.x-rx,dy=b.y-HOOP.y,d=Math.hypot(dx,dy),R=.03+HOOP.rim;if(d<R&&d>1e-5){const nx=dx/d,ny=dy/d,dot=b.vx*nx+b.vy*ny;if(dot<0){b.vx-=1.7*dot*nx;b.vy-=1.7*dot*ny;b.touched=true;ev(st,'rim');}b.x=rx+nx*R;b.y=HOOP.y+ny*R;}}
   const bx=hx+HOOP.half+.03;if(b.x>bx-.03&&b.x<bx+.02&&b.y>HOOP.y&&b.y<HOOP.y+.24&&b.vx>0){b.vx=-Math.abs(b.vx)*.55;b.x=bx-.03;b.touched=true;ev(st,'board');}
   if(!b.scored&&py>=HOOP.y&&b.y<HOOP.y&&b.vy<0&&Math.abs(b.x-hx)<HOOP.half-.012){b.scored=true;const moving=st.t>=18;st.streak++;const v=(moving?3:2)+(b.touched?0:1);st.makes+=v;ev(st,b.touched?'hit':'swish',{value:v});st.message=b.touched?'Bucket! +'+v:'SWISH! +'+v;}
   if(b.y<.04&&b.vy<0){b.y=.04;b.vy=-b.vy*.45;b.vx*=.7;ev(st,'bounce');}
  }
  if(b.age>2.6||b.x>1.7||b.x<-.1||(b.y<.06&&Math.abs(b.vy)<.2)){if(!b.scored){st.streak=0;st.message='Brick. Try again.';}st.ball=null;st.phase='aim';}
 }
 st.score=Math.round(st.makes);
 if(st.t>=st.time){st.done=true;ev(st,'end');}
 return st;
}

export const GAMES=Object.freeze({
 claw:{create:createClaw,step:stepClaw},skee:{create:createSkee,step:stepSkee},drop:{create:createDrop,step:stepDrop},
 whack:{create:createWhack,step:stepWhack},hoop:{create:createHoop,step:stepHoop}});
export function createGame(id,seed){const g=GAMES[id];return g?g.create(seed):null;}
export function stepGame(st,dt,inp=EMPTY_INPUT){const g=GAMES[st?.id];return g?g.step(st,Math.min(.05,Math.max(0,dt)),{...EMPTY_INPUT,...inp}):st;}
