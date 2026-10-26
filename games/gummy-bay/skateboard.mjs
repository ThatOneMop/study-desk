// P1-5 skateboards. Six original decks sold at the Kickflip Container, a
// shipping-container skate shop. The board lives in hotbar slot 9: equip it,
// then click (or R) to drop it and ride. W pushes, A/D or the mouse carve,
// hold and release Space to ollie, S drags a foot to brake. Kerbs and steps
// over 12 cm need an ollie or you bail. Everything here is original code;
// the models, textures and sounds are all generated at runtime.
import * as THREE from './vendor/three.module.min.js';
import {personLook,createJointSet,proceduralJoints,writePerson,createPeopleMeshes,flushPeopleMeshes} from './people-kit.mjs?v=126';

// ---------- Boards (research §7 table, original names) ----------
const B=(id,name,price,top,ollie,deck,wheel,blurb,extra={})=>Object.freeze({id,name,price,top,ollie,deck,wheel,blurb,...extra});
export const BOARDS=Object.freeze([
 B('plank','Splinter Plank',75,5.5,.32,0xb98a55,0xe8dcc0,'A garage-sale deck with honest wheels. Gets you there, eventually.'),
 B('street','Kerbside Street',250,6.7,.45,0x2f5f9a,0xf2f0e6,'The everyday popsicle. Snappy tail, solid ollie.'),
 B('feather','Featherlite',500,7.3,.6,0xe9e2cf,0x7fd3c4,'Thin maple, light trucks. The highest pop in the shop.'),
 B('cruiser','Boardwalk Cruiser',500,8,.35,0xd9663f,0xf3b13c,'Fat soft wheels for long flat runs along the bay.'),
 B('dirt','Dirt Deck',1500,8.5,.45,0x5d6b3a,0x2b2b2b,'Knobbly tyres. Grass and gravel do not slow it down.',{offroad:true}),
 B('gold','Gummy Gold',1500,11,.5,0xe6b830,0xff7aa8,'Gold-flake deck, gummy wheels. Leaves a sparkle trail.',{sparkle:true})
]);
export const BOARD_IDS=Object.freeze(BOARDS.map(b=>b.id));
export function boardById(id){return BOARDS.find(b=>b.id===id)||null;}

// ---------- Physics constants (research §7) ----------
export const PUSH_IMPULSE=1.6,PUSH_INTERVAL=.55,ROLL_DRAG=.25,BRAKE_DECEL=5.5;
export const TURN_RATE=110*Math.PI/180,SKATE_GRAVITY=18;
export const KERB_LIMIT=.12,BAIL_TIME=.8,WALL_BAIL_SPEED=3.2;
export const ROUGH_DRAG=.9,ROUGH_TOP=.8,DOWNHILL_TOP=1.25;
export const OLLIE_CHARGE=.35,OLLIE_TAP=.6;
export const FOV_KICK=7,FOV_KICK_SPEED=8.5;
export const DECK_HEIGHT=.11;

export function turnRate(speed){return TURN_RATE/(1+Math.max(0,speed)/8);}
export function ollieVelocity(height){return Math.sqrt(2*SKATE_GRAVITY*Math.max(0,height));}
export function ollieHeight(board,charge){const c=Math.max(0,Math.min(1,Number.isFinite(charge)?charge:0));return (board?.ollie||.3)*(OLLIE_TAP+(1-OLLIE_TAP)*c);}
export function skateFov(base,speed){return base+FOV_KICK*Math.max(0,Math.min(1,(Number.isFinite(speed)?speed:0)/FOV_KICK_SPEED));}
// A rise is only a problem when it is taller than the kerb limit and the deck is not already above it.
export function kerbOutcome(rise,clearance){
 if(!(rise>KERB_LIMIT))return 'roll';
 return clearance>=rise-.02?'clear':'bail';
}
const wrap=a=>Math.atan2(Math.sin(a),Math.cos(a));

export function createRide(board,{x=0,z=0,y=0,heading=0,speed=0}={}){
 return {board:board||BOARDS[0],x,z,y,heading,speed,vy:0,air:false,pushT:0,pushAnim:0,charge:0,charging:false,bail:0,lean:0,dist:0,events:[]};
}
// One fixed step. env: floorAt(x,z), blocked(x,z), rough(x,z) -> bool.
// input: push, brake, left, right, ollieHeld, steer (radians the camera wants to turn, optional).
export function stepRide(ride,input={},dt=1/60,env={}){
 dt=Number.isFinite(dt)?Math.max(0,Math.min(.1,dt)):0;
 const ev=ride.events=[];
 const floorAt=typeof env.floorAt==='function'?env.floorAt:()=>0;
 const blocked=typeof env.blocked==='function'?env.blocked:()=>false;
 const board=ride.board;
 if(ride.bail>0){ride.bail=Math.max(0,ride.bail-dt);ride.speed=Math.max(0,ride.speed-12*dt);if(ride.bail===0)ev.push('recovered');return ride;}
 const rough=!board.offroad&&typeof env.rough==='function'&&!!env.rough(ride.x,ride.z);
 const top=board.top*(rough?ROUGH_TOP:1);
 // Pushing: a +1.6 m/s kick every 0.55 s while W is held and the wheels are down.
 ride.pushT=Math.max(0,ride.pushT-dt);ride.pushAnim=Math.max(0,ride.pushAnim-dt);
 if(input.push&&!ride.air&&!ride.charging&&ride.pushT===0&&ride.speed<top-.01){ride.speed=Math.min(top,ride.speed+PUSH_IMPULSE);ride.pushT=PUSH_INTERVAL;ride.pushAnim=PUSH_INTERVAL;ev.push('push');}
 // Drag, braking and the rough-ground penalty.
 let drag=ROLL_DRAG+(rough?ROUGH_DRAG:0)+(input.brake&&!ride.air?BRAKE_DECEL:0);
 if(ride.air)drag=.05;
 ride.speed=Math.max(0,ride.speed-drag*dt);
 if(input.brake&&ride.speed>1&&!ride.air)ev.push('brake');
 // Carving. A/D turn directly, a camera steer is followed at the same limit.
 const rate=turnRate(ride.speed)*(ride.air?.35:1);
 let turn=((input.left?1:0)-(input.right?1:0))*rate*dt;
 if(Number.isFinite(input.steer)&&!turn){const want=wrap(input.steer);turn=Math.max(-rate*dt,Math.min(rate*dt,want));}
 ride.heading=wrap(ride.heading+turn);
 const leanTarget=dt>0?Math.max(-1,Math.min(1,turn/(rate*dt||1)))*Math.min(1,ride.speed/4):0;
 ride.lean+=(leanTarget-ride.lean)*(1-Math.exp(-dt*8));
 // Ollie: hold to crouch, release to pop. A tap still clears a kerb.
 if(input.ollieHeld&&!ride.air){ride.charging=true;ride.charge=Math.min(1,ride.charge+dt/OLLIE_CHARGE);}
 else if(ride.charging){ride.charging=false;if(!ride.air){ride.vy=ollieVelocity(ollieHeight(board,ride.charge));ride.air=true;ev.push('ollie');}ride.charge=0;}
 // Horizontal move with kerb and wall checks.
 const fx=-Math.sin(ride.heading),fz=-Math.cos(ride.heading);
 const dist=ride.speed*dt;
 const groundHere=floorAt(ride.x,ride.z);
 if(dist>0){
  const probe=Math.max(dist,.05)+.18;
  const nx=ride.x+fx*dist,nz=ride.z+fz*dist;
  if(blocked(nx,nz)||blocked(ride.x+fx*probe,ride.z+fz*probe)){
   if(ride.speed>WALL_BAIL_SPEED){bailRide(ride,'wall');return ride;}
   ride.speed=0;ev.push('bump');
  }else{
   const ahead=floorAt(ride.x+fx*probe,ride.z+fz*probe);
   if(kerbOutcome(ahead-groundHere,ride.y-groundHere)==='bail'){bailRide(ride,'kerb');return ride;}
   ride.x=nx;ride.z=nz;ride.dist+=dist;
  }
 }
 // Vertical: follow the ground, launch off ramp lips, fall off ledges.
 const ground=floorAt(ride.x,ride.z);
 if(ride.air){
  ride.vy-=SKATE_GRAVITY*dt;ride.y+=ride.vy*dt;
  if(ride.y<=ground){const impact=-ride.vy;ride.y=ground;ride.vy=0;ride.air=false;ev.push(impact>3.5?'land-hard':'land');}
 }else{
  const climb=ground-ride.y;
  if(climb<-.05){ride.air=true;}// rolled off a drop; keep the ramp's lift
  else{
   const vyGround=dt>0?climb/dt:0;
   ride.y=ground;
   // Slope gain g·sinθ: downhill speeds up, uphill slows. Fastest downhill.
   if(dist>0){const slope=climb/Math.max(dist,1e-4);ride.speed=Math.max(0,Math.min(board.top*DOWNHILL_TOP,ride.speed-9.81*Math.sin(Math.atan(slope))*dt));}
   ride.vy=vyGround;
  }
  if(ride.air&&ride.vy<0)ride.vy=0;
 }
 // Cap at top speed on the flat; only a slope can carry it beyond.
 if(ride.speed>top*DOWNHILL_TOP)ride.speed=top*DOWNHILL_TOP;
 return ride;
}
export function bailRide(ride,reason='kerb'){
 ride.bail=BAIL_TIME;ride.bailReason=reason;ride.speed=Math.min(ride.speed,2.5);ride.charging=false;ride.charge=0;ride.events.push('bail');return ride;
}
// Simulate holding W on the flat: returns the peak speed reached.
export function flatTopSpeed(board,seconds=30,dt=1/60){
 const ride=createRide(board);let peak=0;
 for(let t=0;t<seconds;t+=dt){stepRide(ride,{push:true},dt,{});peak=Math.max(peak,ride.speed);}
 return peak;
}

// Third-person chase camera behind the rider. yaw/pitch come from the mouse.
export function rideCamera(ride,yaw,pitch,{distance=3.4,height=1.55,blocked=null}={}){
 const p=Math.max(-.55,Math.min(.45,Number.isFinite(pitch)?pitch:0));
 const fx=-Math.sin(yaw),fz=-Math.cos(yaw);
 const head=ride.y+DECK_HEIGHT+1.45;
 let d=distance;
 if(typeof blocked==='function'){for(let step=distance;step>.9;step-=.2){const cx=ride.x-fx*step*Math.cos(p),cz=ride.z-fz*step*Math.cos(p);d=step;if(!blocked(cx,cz))break;}}
 const back=d*Math.cos(p),up=d*Math.sin(-p);
 return {x:ride.x-fx*back,y:head+Math.max(-.9,up)+(height-1.45),z:ride.z-fz*back,lookX:ride.x+fx*2.2,lookY:head-.25+Math.sin(p)*1.5,lookZ:ride.z+fz*2.2};
}

// Save helpers. Boards are an additive field: older saves simply own none.
export function normalizeSkate(s){
 if(!s||typeof s!=='object')return s;
 s.boards=Array.isArray(s.boards)?[...new Set(s.boards.filter(id=>BOARD_IDS.includes(id)))]:[];
 if(!s.boards.includes(s.boardSel))s.boardSel=s.boards.length?s.boards[s.boards.length-1]:null;
 return s;
}
export function buyBoard(s,id,spend){
 const board=boardById(id);if(!board||!s)return {ok:false,reason:'Unknown board.'};
 normalizeSkate(s);
 if(s.boards.includes(id)){s.boardSel=id;return {ok:true,equipped:true,board};}
 if(typeof spend==='function'&&!spend(board.price))return {ok:false,reason:'funds'};
 s.boards.push(id);s.boardSel=id;return {ok:true,bought:true,board};
}

// ---------- Kickflip Container: site, mini skate spot ----------
export const KICKFLIP_SITE=Object.freeze({x:-92,z:-24,w:6.06,d:2.44,h:2.59});
// The open long side faces south (+z) toward the main road.
export const KICKFLIP_POINT=Object.freeze({x:KICKFLIP_SITE.x,z:KICKFLIP_SITE.z+KICKFLIP_SITE.d/2+1.6});
export const KICKFLIP_COLLIDERS=Object.freeze([
 Object.freeze({x:KICKFLIP_SITE.x,z:KICKFLIP_SITE.z,w:KICKFLIP_SITE.w+.5,d:KICKFLIP_SITE.d+.5}),
 Object.freeze({x:KICKFLIP_SITE.x,z:KICKFLIP_SITE.z+1.55,w:3.2,d:.7})
]);
// A kicker ramp and a ledge in front of the shop. Heights are floor surfaces,
// so walking still works (the ledge is under the step-up) but a board needs an ollie.
export const SKATE_SPOT=Object.freeze({
 kicker:Object.freeze({x:KICKFLIP_SITE.x-6.5,z:KICKFLIP_SITE.z+6,w:1.6,len:2.1,h:.42}),
 ledge:Object.freeze({x:KICKFLIP_SITE.x+6.2,z:KICKFLIP_SITE.z+6,w:.5,len:3,h:.22}),
 kerb:Object.freeze({x:KICKFLIP_SITE.x,z:KICKFLIP_SITE.z+9.5,w:9,len:.35,h:.16})
});
// Kicker rises toward -x (riders approach it heading west), ledge runs along x, kerb along x.
export function skateSpotHeight(x,z){
 const k=SKATE_SPOT.kicker,l=SKATE_SPOT.ledge,c=SKATE_SPOT.kerb;
 let h=0;
 if(Math.abs(z-k.z)<=k.w/2&&Math.abs(x-k.x)<=k.len/2){const t=(k.x+k.len/2-x)/k.len;h=Math.max(h,k.h*Math.max(0,Math.min(1,t)));}
 if(Math.abs(z-l.z)<=l.w/2&&Math.abs(x-l.x)<=l.len/2)h=Math.max(h,l.h);
 if(Math.abs(z-c.z)<=c.len/2&&Math.abs(x-c.x)<=c.w/2)h=Math.max(h,c.h);
 return h;
}

// ---------- Canvas textures ----------
function canvasTexture(w,h,draw){
 if(typeof document==='undefined'||typeof document.createElement!=='function')return null;
 const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext&&c.getContext('2d');if(!g||typeof g.fillRect!=='function')return null;
 draw(g,w,h);const t=new THREE.CanvasTexture(c);if(THREE.SRGBColorSpace)t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;return t;
}
const hex=n=>'#'+n.toString(16).padStart(6,'0');
const tintGripTex=()=>canvasTexture(64,256,(g,w,h)=>{g.fillStyle='#e6e6e6';g.fillRect(0,0,w,h);for(let i=0;i<1600;i++){const v=150+Math.random()*90|0;g.fillStyle=`rgb(${v},${v},${v})`;g.fillRect(Math.random()*w,Math.random()*h,1,1);}g.fillStyle='rgba(255,255,255,.9)';for(let i=0;i<40;i++)g.fillRect(Math.random()*w,Math.random()*h,1,1);});
const griptex=()=>canvasTexture(64,256,(g,w,h)=>{g.fillStyle='#1d1e21';g.fillRect(0,0,w,h);for(let i=0;i<1800;i++){const v=20+Math.random()*40|0;g.fillStyle=`rgb(${v},${v},${v+3})`;g.fillRect(Math.random()*w,Math.random()*h,1,1);}g.fillStyle='#2a2b2f';g.fillRect(0,h*.12,w,2);g.fillRect(0,h*.88,w,2);});
function deckArt(board){
 return canvasTexture(64,256,(g,w,h)=>{
  g.fillStyle=hex(board.deck);g.fillRect(0,0,w,h);
  const tag=board.id;
  g.globalAlpha=.9;
  if(tag==='plank'){for(let y=0;y<h;y+=6){g.fillStyle=y%12?'#a67645':'#c79a62';g.fillRect(0,y,w,3);}g.fillStyle='#6b4a2a';g.font='bold 14px sans-serif';g.save();g.translate(38,170);g.rotate(-Math.PI/2);g.fillText('SPLINTER',0,0);g.restore();}
  if(tag==='street'){g.fillStyle='#f2efe4';g.fillRect(8,0,10,h);g.fillRect(46,0,10,h);g.fillStyle='#e2534b';g.beginPath();g.arc(32,128,16,0,7);g.fill();g.fillStyle='#f2efe4';g.font='bold 12px sans-serif';g.fillText('KS',24,132);}
  if(tag==='feather'){g.strokeStyle='#7fb7c9';g.lineWidth=3;for(let i=0;i<6;i++){g.beginPath();g.moveTo(32,40+i*30);g.quadraticCurveTo(10,60+i*30,32,80+i*30);g.stroke();}}
  if(tag==='cruiser'){const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#f6b24a');gr.addColorStop(.5,'#d9663f');gr.addColorStop(1,'#7c3b6a');g.fillStyle=gr;g.fillRect(0,0,w,h);g.fillStyle='#ffe7a8';g.beginPath();g.arc(32,150,18,Math.PI,0);g.fill();for(let i=0;i<4;i++){g.fillStyle='#7c3b6a';g.fillRect(0,154+i*9,w,3);}}
  if(tag==='dirt'){g.fillStyle='#45512b';for(let i=0;i<40;i++)g.fillRect(Math.random()*w,Math.random()*h,6,3);g.fillStyle='#e8d36a';g.fillRect(0,110,w,6);g.fillRect(0,140,w,6);}
  if(tag==='gold'){for(let i=0;i<220;i++){g.fillStyle=Math.random()<.5?'#fff1a8':'#b8891b';g.fillRect(Math.random()*w,Math.random()*h,2,2);}g.fillStyle='#ff7aa8';for(const y of [70,128,186]){g.beginPath();g.arc(32,y,9,0,7);g.fill();g.beginPath();g.arc(25,y-8,4,0,7);g.arc(39,y-8,4,0,7);g.fill();}}
  g.globalAlpha=1;
 });
}
const corrugated=(base)=>canvasTexture(256,128,(g,w,h)=>{
 g.fillStyle=base;g.fillRect(0,0,w,h);
 for(let x=0;x<w;x+=8){g.fillStyle='rgba(0,0,0,.22)';g.fillRect(x,0,3,h);g.fillStyle='rgba(255,255,255,.12)';g.fillRect(x+4,0,2,h);}
 for(let i=0;i<26;i++){const x=Math.random()*w,len=8+Math.random()*50;const gr=g.createLinearGradient(0,0,0,len);gr.addColorStop(0,'rgba(120,62,30,.55)');gr.addColorStop(1,'rgba(120,62,30,0)');g.fillStyle=gr;g.fillRect(x,Math.random()*20,2+Math.random()*3,len);}
 g.fillStyle='rgba(30,20,10,.25)';g.fillRect(0,h-10,w,10);
});
const signTex=()=>canvasTexture(512,96,(g,w,h)=>{
 g.fillStyle='#141619';g.fillRect(0,0,w,h);g.strokeStyle='#f3c241';g.lineWidth=5;g.strokeRect(6,6,w-12,h-12);
 g.textBaseline='middle';let size=50;
 const fit=()=>{g.font='900 '+size+'px system-ui,Arial Black,sans-serif';return g.measureText('KICKFLIP ').width+g.measureText('CONTAINER').width;};
 while(size>20&&fit()>w-44)size-=2;
 const a=g.measureText('KICKFLIP ').width,total=a+g.measureText('CONTAINER').width,x0=(w-total)/2;
 g.fillStyle='#ff5a7a';g.shadowColor='#ff5a7a';g.shadowBlur=14;g.fillText('KICKFLIP',x0,h/2+2);
 g.fillStyle='#7ff0d9';g.shadowColor='#7ff0d9';g.fillText('CONTAINER',x0+a,h/2+2);
});
const stickerTex=(text,bg,fg)=>canvasTexture(128,64,(g,w,h)=>{g.fillStyle=bg;g.beginPath();g.roundRect?g.roundRect(2,2,w-4,h-4,14):g.rect(2,2,w-4,h-4);g.fill();g.fillStyle=fg;g.font='900 22px system-ui,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(text,w/2,h/2+1);});

// ---------- Board model ----------
// Deck length 0.80 m, width 0.21 m, kicktails tipped 14°. Origin at ground under the deck centre.
export function createBoardModel(board,{shadow=true,grip:gripTint=null}={}){
 const g=new THREE.Group();g.name='Skateboard '+board.id;
 const deckMat=new THREE.MeshStandardMaterial({color:0xffffff,map:deckArt(board),roughness:board.id==='gold'?.32:.7,metalness:board.id==='gold'?.55:0});
 if(!deckMat.map)deckMat.color.setHex(board.deck);
 const grip=new THREE.MeshStandardMaterial({color:0xffffff,map:griptex(),roughness:.95});if(!grip.map)grip.color.setHex(0x1e1f22);if(Number.isFinite(gripTint)){const lit=tintGripTex();if(lit){grip.map?.dispose?.();grip.map=lit;}grip.color.setHex(gripTint);}
 const side=new THREE.MeshStandardMaterial({color:board.id==='gold'?0xc99a1d:0xd8c39a,roughness:.75});
 const mats=[side,side,grip,deckMat,side,side];
 const mid=new THREE.Mesh(new THREE.BoxGeometry(.21,.014,.52),mats);mid.position.y=DECK_HEIGHT;g.add(mid);
 for(const s of [-1,1]){
  const tail=new THREE.Group();tail.position.set(0,DECK_HEIGHT,s*.26);tail.rotation.x=s*-.25;g.add(tail);
  const t=new THREE.Mesh(new THREE.BoxGeometry(.21,.014,.15),mats);t.position.z=s*.075;tail.add(t);
  const nose=new THREE.Mesh(new THREE.CylinderGeometry(.105,.105,.014,16,1,false,0,Math.PI),mats[3]);nose.rotation.y=(s>0?0:Math.PI)-Math.PI/2;nose.position.z=s*.15;tail.add(nose);
 }
 const metal=new THREE.MeshStandardMaterial({color:0xb9bec4,metalness:.85,roughness:.32});
 const bush=new THREE.MeshStandardMaterial({color:0xf3c241,roughness:.6});
 const wheelR=board.id==='cruiser'||board.id==='dirt'?.036:.028;
 const wheelMat=board.id==='gold'?new THREE.MeshPhysicalMaterial({color:board.wheel,roughness:.25,clearcoat:.8,clearcoatRoughness:.15,transparent:true,opacity:.86}) /* no transmission: it forces a second opaque scene pass */:new THREE.MeshStandardMaterial({color:board.wheel,roughness:board.id==='dirt'?.95:.55});
 const wheels=[];
 for(const s of [-1,1]){
  const z=s*.2;
  const base=new THREE.Mesh(new THREE.BoxGeometry(.08,.02,.05),metal);base.position.set(0,DECK_HEIGHT-.017,z);g.add(base);
  const b1=new THREE.Mesh(new THREE.CylinderGeometry(.016,.016,.02,10),bush);b1.position.set(0,DECK_HEIGHT-.035,z);g.add(b1);
  const hanger=new THREE.Mesh(new THREE.BoxGeometry(.2,.024,.03),metal);hanger.position.set(0,wheelR+.006,z);g.add(hanger);
  const axle=new THREE.Mesh(new THREE.CylinderGeometry(.006,.006,.26,6),metal);axle.rotation.z=Math.PI/2;axle.position.set(0,wheelR,z);g.add(axle);
  for(const side of [-1,1]){
   const w=new THREE.Mesh(new THREE.CylinderGeometry(wheelR,wheelR,board.id==='cruiser'?.05:.034,18),wheelMat);w.rotation.z=Math.PI/2;w.position.set(side*.115,wheelR,z);g.add(w);wheels.push(w);
   if(board.id==='dirt'){for(let k=0;k<8;k++){const knob=new THREE.Mesh(new THREE.BoxGeometry(.03,.012,.012),wheelMat);const a=k/8*Math.PI*2;knob.position.set(0,Math.cos(a)*wheelR,Math.sin(a)*wheelR);knob.rotation.x=-a;w.add(knob);}}
  }
 }
 g.traverse(o=>{if(o.isMesh){o.castShadow=shadow;o.receiveShadow=true;}});
 g.userData.wheels=wheels;g.userData.wheelR=wheelR;g.userData.spin=0;
 return g;
}
export function spinBoardWheels(model,distance){
 const w=model?.userData?.wheels;if(!w)return;
 const a=(Number.isFinite(distance)?distance:0)/(model.userData.wheelR||.03);
 for(const wheel of w)wheel.rotation.x=a;
}

// ---------- Rider (people-kit body in a skate stance) ----------
const mA=new THREE.Matrix4(),mB=new THREE.Matrix4(),mC=new THREE.Matrix4(),mD=new THREE.Matrix4();
function joint(out,parent,x,y,z,ax=0,az=0,ay=0){
 mA.makeTranslation(x,y,z);mB.makeRotationY(ay);mC.makeRotationX(ax);mD.makeRotationZ(az);
 return out.multiplyMatrices(parent,mA).multiply(mB).multiply(mC).multiply(mD);
}
// Pose values: crouch 0..1 (ollie charge / landing), push 0..1 phase, lean -1..1, bail 0..1, air bool.
// The body faces +x of the board (sideways stance); the board runs along local z.
export function riderJoints(joints,root,{crouch=0,push=0,lean=0,bail=0,air=false,t=0}={}){
 const c=Math.max(0,Math.min(1,crouch)),bend=.25+c*.55+(air?.25:0);
 const hipY=.82+DECK_HEIGHT-bend*.24;
 const pushing=push>0?Math.sin(Math.min(1,push)*Math.PI):0;
 joint(joints.hips,root,0,hipY-pushing*.08,0,0,lean*.18+Math.sin(t*1.3)*.015);
 joint(joints.chest,joints.hips,0,.17,0,.22+c*.25+pushing*.15,lean*.22-bail*.6);
 joint(joints.head,joints.chest,0,.41,0,-.18-c*.1,0,Math.PI/2*.85);// look down the board
 // Arms out for balance; they swing with the carve.
 for(const [side,sign] of [['L',-1],['R',1]]){
  joint(joints['arm'+side],joints.chest,sign*.235,.36,0,-.15+sign*lean*.25,sign*(1.0+c*.25+Math.sin(t*2+sign)*.05));
  joint(joints['fore'+side],joints['arm'+side],0,-.32,0,-.35,sign*-.2);
 }
 // Feet over the truck bolts: front foot at -z (toward the nose), back foot at +z.
 // In the rider frame the board axis is local x after the root's quarter turn.
 const spread=.22;
 joint(joints.thighL,joints.hips,-.09,0,0,-bend*.9,-spread);
 joint(joints.shinL,joints.thighL,0,-.36,0,bend*1.5,spread*.3);
 if(pushing>0){
  // Push leg reaches down and back off the deck.
  joint(joints.thighR,joints.hips,.09,0,0,-.25-pushing*.2,spread+pushing*.35);
  joint(joints.shinR,joints.thighR,0,-.36,0,.25+pushing*.1,-pushing*.1);
 }else{
  joint(joints.thighR,joints.hips,.09,0,0,-bend*.9,spread);
  joint(joints.shinR,joints.thighR,0,-.36,0,bend*1.5,-spread*.3);
 }
 return joints;
}
export const RIDER_LOOK=Object.freeze({...personLook(11,'townsfolk'),topStyle:'hoodie',top:0x3f6d5a,hood:0x386350,sleeve:0x3f6d5a,pants:0x2b3a55,shoes:0xe8e4dc,hairStyle:'cap',cap:0xa33a2e,hoodUp:false,glasses:false});
export function createRider(scene){
 const meshes=createPeopleMeshes(THREE,scene,1,'Skate rider');
 const joints=createJointSet(),root=new THREE.Matrix4();
 for(const m of [meshes.box,meshes.round,meshes.face])m.castShadow=true;
 const rider={meshes,joints,root,visible:false};
 flushPeopleMeshes(meshes,false);
 return rider;
}
const qR=new THREE.Quaternion(),vP=new THREE.Vector3(),vS=new THREE.Vector3(1,1,1),eR=new THREE.Euler();
export function riderLook(cap=null){return Number.isFinite(cap)?{...RIDER_LOOK,cap}:RIDER_LOOK;}
export function updateRider(rider,ride,{visible=true,t=0,look=RIDER_LOOK}={}){
 if(!rider)return;
 if(!visible||!ride){if(rider.visible){flushPeopleMeshes(rider.meshes,false);rider.visible=false;}return;}
 const bail=ride.bail>0?1-ride.bail/BAIL_TIME:0;
 const tumble=ride.bail>0?Math.sin(Math.min(1,bail*1.6)*Math.PI*.5)*1.25:0;
 eR.set(-tumble*.6,ride.heading+Math.PI/2,ride.lean*-.12+tumble,'YXZ');qR.setFromEuler(eR);
 vP.set(ride.x,ride.y-(ride.bail>0?Math.min(.35,bail*.6):0),ride.z);rider.root.compose(vP,qR,vS);
 const crouch=ride.charging?ride.charge:ride.air?.4:0;
 riderJoints(rider.joints,rider.root,{crouch,push:ride.pushAnim>0?1-ride.pushAnim/PUSH_INTERVAL:0,lean:ride.lean,bail,air:ride.air,t});
 writePerson(rider.meshes,0,rider.joints,look||RIDER_LOOK,{detail:true});
 flushPeopleMeshes(rider.meshes,true);rider.visible=true;
}

// The shopkeeper behind the counter: a people-kit figure in a beanie and flannel.
export const KEEPER_LOOK=Object.freeze({...personLook(23,'townsfolk'),topStyle:'flannel',top:0x8a3b3b,sleeve:0x8a3b3b,pants:0x23262b,shoes:0x1f1f22,hairStyle:'cap',cap:0x2f6f6a,glasses:false});
export function createKickflipKeeper(scene,site=KICKFLIP_SITE){
 const meshes=createPeopleMeshes(THREE,scene,1,'Kickflip Container keeper');
 const keeper={meshes,joints:createJointSet(),root:new THREE.Matrix4(),x:site.x+.5,z:site.z+.62};
 updateKickflipKeeper(keeper,0);return keeper;
}
export function updateKickflipKeeper(keeper,t=0,{talk=false}={}){
 if(!keeper)return;
 qR.setFromEuler(eR.set(0,Math.sin(t*.4)*.25,0,'YXZ'));vP.set(keeper.x,0,keeper.z);keeper.root.compose(vP,qR,vS);
 proceduralJoints(keeper.joints,keeper.root,{sway:Math.sin(t*.9)*.04,bob:Math.sin(t*1.8)*.006,nod:talk?Math.sin(t*6)*.08:0,raise:Math.max(0,Math.sin(t*.35))*.5});
 writePerson(keeper.meshes,0,keeper.joints,KEEPER_LOOK,{detail:true,face:talk&&Math.sin(t*9)>0?'talk':'open'});
 flushPeopleMeshes(keeper.meshes,true);
}

// ---------- Procedural audio: rolling hum, deck clack, push scuff ----------
export function createSkateAudio(ctx,dest){
 if(!ctx||typeof ctx.createBuffer!=='function')return null;
 const len=ctx.sampleRate*2,buf=ctx.createBuffer(1,len,ctx.sampleRate),d=buf.getChannelData(0);
 let p=0;for(let i=0;i<len;i++){p=p*.96+(Math.random()*2-1)*.04;d[i]=p*3+(Math.random()*2-1)*.08;}
 const src=ctx.createBufferSource();src.buffer=buf;src.loop=true;
 const band=ctx.createBiquadFilter();band.type='bandpass';band.frequency.value=380;band.Q.value=.8;
 const low=ctx.createBiquadFilter();low.type='lowpass';low.frequency.value=1600;
 const gain=ctx.createGain();gain.gain.value=0;
 src.connect(band).connect(low).connect(gain).connect(dest);src.start();
 const noise=ctx.createBuffer(1,ctx.sampleRate*.4,ctx.sampleRate),nd=noise.getChannelData(0);for(let i=0;i<nd.length;i++)nd[i]=Math.random()*2-1;
 let lastJoint=0;
 function burst({freq=2400,q=1.2,time=.06,vol=.2,type='bandpass',thump=0,thumpFreq=120,at=0}={}){
  const t0=ctx.currentTime+at;
  const s=ctx.createBufferSource();s.buffer=noise;const f=ctx.createBiquadFilter();f.type=type;f.frequency.value=freq;f.Q.value=q;const g=ctx.createGain();
  g.gain.setValueAtTime(vol,t0);g.gain.exponentialRampToValueAtTime(.0008,t0+time);s.connect(f).connect(g).connect(dest);s.start(t0);s.stop(t0+time+.02);
  if(thump){const o=ctx.createOscillator(),og=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(thumpFreq*1.6,t0);o.frequency.exponentialRampToValueAtTime(thumpFreq*.6,t0+.12);og.gain.setValueAtTime(thump,t0);og.gain.exponentialRampToValueAtTime(.0008,t0+.14);o.connect(og).connect(dest);o.start(t0);o.stop(t0+.16);}
 }
 return {
  update(speed,grounded,volume=1,dist=0){
   const v=Math.max(0,Math.min(1,speed/9));
   gain.gain.setTargetAtTime(grounded&&speed>.2?(.05+.14*v)*volume:0,ctx.currentTime,.06);
   band.frequency.setTargetAtTime(260+v*520,ctx.currentTime,.08);
   // Pavement joints every 1.6 m: a soft double click.
   if(grounded&&speed>1&&dist-lastJoint>1.6){lastJoint=dist;burst({freq:1800,q:2,time:.025,vol:.05*volume});burst({freq:1800,q:2,time:.025,vol:.04*volume,at:.03});}
  },
  pop(volume=1){burst({freq:3200,q:1.5,time:.05,vol:.3*volume,thump:.18*volume,thumpFreq:180});},
  land(hard=false,volume=1){burst({freq:2200,q:1,time:hard?.12:.07,vol:(hard?.4:.26)*volume,thump:(hard?.35:.2)*volume,thumpFreq:95});burst({freq:2600,q:1.4,time:.04,vol:.16*volume,at:.035});},
  push(volume=1){burst({freq:900,q:.6,time:.16,vol:.09*volume,type:'lowpass'});},
  bail(volume=1){burst({freq:600,q:.5,time:.3,vol:.35*volume,type:'lowpass',thump:.3*volume,thumpFreq:70});burst({freq:3000,q:.7,time:.35,vol:.12*volume,at:.05});},
  stop(){gain.gain.setTargetAtTime(0,ctx.currentTime,.05);}
 };
}

// ---------- Kickflip Container shop model ----------
export function createKickflipContainer(scene,site=KICKFLIP_SITE){
 const g=new THREE.Group();g.name='Kickflip Container';g.position.set(site.x,0,site.z);scene.add(g);
 // Static shell/yard/skate spot fold into the town batches (userData.batchStatic); the
 // deck rack and stickers are small detail kept as real models, shown only up close.
 g.userData.batchStatic=true;
 const near=new THREE.Group();near.name='Kickflip rack detail';const lod=new THREE.LOD();lod.name='Kickflip rack LOD';lod.userData.noBatch=true;lod.addLevel(near,0);lod.addLevel(new THREE.Object3D(),18);g.add(lod);
 const W=site.w,D=site.d,H=site.h;
 const paint=new THREE.MeshStandardMaterial({color:0xffffff,map:corrugated('#2f7a74'),roughness:.72,metalness:.25});if(!paint.map)paint.color.setHex(0x2f7a74);
 const paintEnd=new THREE.MeshStandardMaterial({color:0xffffff,map:corrugated('#2a6e68'),roughness:.75,metalness:.25});if(!paintEnd.map)paintEnd.color.setHex(0x2a6e68);
 const frame=new THREE.MeshStandardMaterial({color:0x1f4f4b,roughness:.6,metalness:.4});
 const inside=new THREE.MeshStandardMaterial({color:0x6f6a60,roughness:.9});
 const ply=new THREE.MeshStandardMaterial({color:0xc8a774,roughness:.85});
 const add=(geo,mat,x,y,z,parent=g)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;};
 // Shell: back, ends, roof, floor. The +z long side is cut open as the shopfront.
 add(new THREE.BoxGeometry(W,H,.06),paint,0,H/2,-D/2+.03);
 add(new THREE.BoxGeometry(.06,H,D),paintEnd,-W/2+.03,H/2,0);add(new THREE.BoxGeometry(.06,H,D),paintEnd,W/2-.03,H/2,0);
 add(new THREE.BoxGeometry(W+.04,.08,D+.04),frame,0,H-.04,0);
 add(new THREE.BoxGeometry(W,.12,D),inside,0,.06+.1,0);
 // Corner castings and the rail under the opening.
 for(const sx of [-1,1])for(const sz of [-1,1]){add(new THREE.BoxGeometry(.18,H,.18),frame,sx*(W/2-.09),H/2,sz*(D/2-.09));}
 add(new THREE.BoxGeometry(W,.22,.12),frame,0,.11,D/2-.06);
 // Front: two side panels, a rolled-up shutter, a ply counter with stickers.
 add(new THREE.BoxGeometry(1.1,H,.05),paint,-W/2+.55,H/2,D/2-.03);add(new THREE.BoxGeometry(1.1,H,.05),paint,W/2-.55,H/2,D/2-.03);
 const shutter=new THREE.MeshStandardMaterial({color:0x8c9298,roughness:.55,metalness:.6});
 add(new THREE.CylinderGeometry(.16,.16,W-2.2,14),shutter,0,H-.3,D/2+.05).rotation.z=Math.PI/2;
 add(new THREE.BoxGeometry(W-2.2,.32,.03),shutter,0,H-.58,D/2+.07);
 const counter=add(new THREE.BoxGeometry(3.2,.95,.55),ply,0,.62,D/2+.3);
 add(new THREE.BoxGeometry(3.3,.05,.65),new THREE.MeshStandardMaterial({color:0x3b3f44,roughness:.4,metalness:.5}),0,1.12,D/2+.3);
 const stickers=[['SKATE','#f3c241','#141619'],['GUMMY','#ff5a7a','#fff'],['KICK PUSH','#7ff0d9','#141619'],['OLLIE!','#ffffff','#2f5f9a'],['BAY 4 LIFE','#e2534b','#fff']];
 stickers.forEach(([t,bg,fg],i)=>{const tex=stickerTex(t,bg,fg);const m=new THREE.Mesh(new THREE.PlaneGeometry(.34,.17),new THREE.MeshStandardMaterial({color:0xffffff,map:tex,roughness:.6,transparent:true}));if(!tex)m.material.color.set(bg);m.position.set(-1.25+i*.62,.42+(i%2)*.28,D/2+.577);m.rotation.z=(i%2?.12:-.1);near.add(m);});
 // Back wall rack with every deck for sale, and a lamp strip.
 BOARDS.forEach((b,i)=>{const deck=createBoardModel(b,{shadow:false});deck.rotation.set(-Math.PI/2+.1,0,0);deck.position.set(-1.75+i*.7,1.15,-D/2+.16);near.add(deck);
  const hook=add(new THREE.BoxGeometry(.04,.04,.12),frame,-1.75+i*.7,1.98,-D/2+.1);void hook;});
 const lampMat=new THREE.MeshStandardMaterial({color:0xfff2cf,emissive:0xffd890,emissiveIntensity:1.6});
 add(new THREE.BoxGeometry(W-1.4,.04,.08),lampMat,0,H-.22,-.2);
 const lamp=new THREE.PointLight(0xffc98a,6,7,1.6);lamp.position.set(0,H-.45,.2);g.add(lamp);
 // Lightbox sign on the roof.
 const st=signTex();const sign=new THREE.Mesh(new THREE.BoxGeometry(4.2,.78,.12),[frame,frame,frame,frame,new THREE.MeshStandardMaterial({color:0xffffff,map:st,emissive:0xffffff,emissiveMap:st,emissiveIntensity:.85,roughness:.5}),frame]);
 if(!st)sign.material[4].color.setHex(0xff5a7a);
 sign.position.set(0,H+.55,D/2-.2);g.add(sign);
 for(const sx of [-1.6,1.6])add(new THREE.BoxGeometry(.06,.5,.06),frame,sx,H+.12,D/2-.2);
 // Yard clutter: pallet, cones, a bin of old wheels.
 const pallet=new THREE.Group();pallet.position.set(W/2+.9,0,.4);g.add(pallet);
 for(let i=0;i<5;i++)add(new THREE.BoxGeometry(1.1,.03,.14),ply,0,.13,-.4+i*.2,pallet);for(const z of [-.45,0,.45])add(new THREE.BoxGeometry(1.1,.1,.1),ply,0,.06,z,pallet);
 const cone=new THREE.MeshStandardMaterial({color:0xf26a2e,roughness:.6});
 for(const [x,z] of [[-W/2-.8,1.3],[-W/2-1.3,1.9]]){add(new THREE.ConeGeometry(.16,.5,12),cone,x,.25,z);add(new THREE.BoxGeometry(.36,.03,.36),cone,x,.015,z);}
 // Skate spot: a smooth concrete pad, kicker ramp, ledge and painted kerb.
 const padMat=new THREE.MeshStandardMaterial({color:0xb9b5a8,roughness:.82,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});
 const pad=new THREE.Mesh(new THREE.PlaneGeometry(19,11.5),padMat);pad.rotation.x=-Math.PI/2;pad.position.set(0,.012,6.1);pad.receiveShadow=true;pad.name='Skate pad';g.add(pad);
 const seam=new THREE.MeshStandardMaterial({color:0x8f8b80,roughness:.9,polygonOffset:true,polygonOffsetFactor:-3,polygonOffsetUnits:-3});
 for(let i=-3;i<=3;i++){const m=new THREE.Mesh(new THREE.PlaneGeometry(.04,11.5),seam);m.rotation.x=-Math.PI/2;m.position.set(i*2.7,.014,6.1);g.add(m);}
 for(const z of [2.3,6.1,9.9]){const m=new THREE.Mesh(new THREE.PlaneGeometry(19,.04),seam);m.rotation.x=-Math.PI/2;m.position.set(0,.014,z);g.add(m);}
 const concrete=new THREE.MeshStandardMaterial({color:0xa9a69a,roughness:.88});
 const steel=new THREE.MeshStandardMaterial({color:0x6f777d,roughness:.4,metalness:.75});
 const k=SKATE_SPOT.kicker;
 const ramp=new THREE.Shape();ramp.moveTo(-k.len/2,0);ramp.lineTo(k.len/2,0);ramp.lineTo(-k.len/2,k.h);ramp.lineTo(-k.len/2,0);
 const rampGeo=new THREE.ExtrudeGeometry(ramp,{depth:k.w,bevelEnabled:false});rampGeo.translate(0,0,-k.w/2);
 const rampMesh=new THREE.Mesh(rampGeo,new THREE.MeshStandardMaterial({color:0xc8a774,roughness:.8}));rampMesh.position.set(k.x-site.x,0,k.z-site.z);rampMesh.castShadow=rampMesh.receiveShadow=true;g.add(rampMesh);
 add(new THREE.BoxGeometry(.04,.02,k.w),steel,k.x-site.x+k.len/2-.02,.01,k.z-site.z);
 const l=SKATE_SPOT.ledge;add(new THREE.BoxGeometry(l.len,l.h,l.w),concrete,l.x-site.x,l.h/2,l.z-site.z);add(new THREE.BoxGeometry(l.len,.02,.04),steel,l.x-site.x,l.h+.01,l.z-site.z+l.w/2-.02);
 const c=SKATE_SPOT.kerb;add(new THREE.BoxGeometry(c.w,c.h,c.len),new THREE.MeshStandardMaterial({color:0xd8d2bf,roughness:.85}),c.x-site.x,c.h/2,c.z-site.z);
 for(let i=0;i<9;i++)add(new THREE.BoxGeometry(.5,.005,c.len+.01),new THREE.MeshStandardMaterial({color:i%2?0xf3c241:0x26282b,roughness:.7}),c.x-site.x-c.w/2+.5+i,c.h+.003,c.z-site.z);
 return g;
}

// Shop menu body. money(n) formats; owned/selected read from the save.
export function kickflipShopHTML(s,{money=n=>'$'+n,available=0,esc=v=>String(v)}={}){
 normalizeSkate(s);
 let h='<div class="overline">KICKFLIP CONTAINER / DECKS &amp; WHEELS</div><h2>Roll faster than the Sugar Squad.</h2><p>Every board takes hotbar slot 9. Equip it, click or press R to drop it and ride. W pushes, A/D carve, hold and release Space to ollie. Kerbs over 12 cm need an ollie.</p><div class="skate-list">';
 for(const b of BOARDS){
  const owned=s.boards.includes(b.id),sel=s.boardSel===b.id;
  const stats='Top '+Math.round(b.top*3.6)+' km/h · Ollie '+Math.round(b.ollie*100)+' cm'+(b.offroad?' · Off-road':'')+(b.sparkle?' · Sparkle trail':'');
  const label=sel?'RIDING':owned?'Use':money(b.price);
  h+='<div class="item skate-item" data-board="'+b.id+'"><span class="skate-swatch" style="background:#'+b.deck.toString(16).padStart(6,'0')+';box-shadow:inset 0 -6px 0 #'+b.wheel.toString(16).padStart(6,'0')+'"></span><div><strong>'+esc(b.name)+'</strong><p>'+esc(b.blurb)+'<br><small>'+stats+'</small></p></div><button class="primary" onclick="action(\'buyBoard\',\''+b.id+'\')" '+(sel||(!owned&&available<b.price)?'disabled':'')+'>'+label+'</button></div>';
 }
 return h+'</div>';
}
