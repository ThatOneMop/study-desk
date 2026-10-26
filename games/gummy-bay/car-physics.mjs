// Arcade car physics for Gummy Bay. DOM-free and deterministic so the dev suite can check it on the CPU.
import {levelOf} from './xp-curve.mjs';
// The world uses forward=(sin a, cos a) and right=(cos a, -sin a), the same as the van's door and collision maths.

// Lucky Lou's Pre-Loved Motors: original, low-poly, family-friendly bangers. Prices in game dollars.
export const LOT_CARS=Object.freeze([
 {id:'tuktuk',name:'Tuk-Tuk',price:700,level:2,mass:.62,top:14,accel:5.6,reverse:4,steer:2.6,grip:6.2,drift:1.15,trunk:6,color:0x2f9a8a,trim:0xf3c64b,body:'tuktuk',blurb:'Three wheels, zero shame. Turns on a jelly bean.'},
 {id:'rustwagon',name:'Rustwagon',price:1200,level:2,mass:1,top:19,accel:7.4,reverse:5,steer:1.9,grip:7.2,drift:1.05,trunk:12,color:0xa0603e,trim:0x6f7a74,body:'wagon',blurb:'Half rust, half hope. Starts on the second try.'},
 {id:'icecream',name:'Ice-Cream Van',price:2200,level:3,mass:1.55,top:16,accel:5.4,reverse:4,steer:1.45,grip:6.6,drift:.9,trunk:30,color:0xf4ead8,trim:0xe98fb0,body:'icecream',blurb:'Plays a jingle. Nobody suspects the ice-cream van.'},
 {id:'pickup',name:'Pickup',price:3200,level:4,mass:1.35,top:20,accel:6.8,reverse:5,steer:1.7,grip:7.8,drift:1,trunk:24,color:0x4f6f9a,trim:0x2b3136,body:'pickup',blurb:'Open tray, big tyres, mild attitude.'},
 {id:'limo',name:'Lemon Limo',price:5600,level:6,mass:1.95,top:22,accel:6.1,reverse:4,steer:1.15,grip:7,drift:.85,trunk:18,color:0xe9d64e,trim:0x1f2328,body:'limo',blurb:'Long, yellow and impossible to park. Arrive in style.'},
 {id:'sprinter',name:'Sour Sprinter',price:8200,level:7,mass:.9,top:27,accel:11,reverse:5,steer:2.1,grip:9,drift:1.25,trunk:8,color:0x7ed957,trim:0x16191b,body:'sprinter',blurb:'Lime-green coupe tuned by somebody called Zest.'}
]);
export const LOT_SITE=Object.freeze({x:-56,z:-74,label:"Lucky Lou's Pre-Loved Motors"});
const LOT_INDEX=new Map(LOT_CARS.map(car=>[car.id,car]));
export const lotCar=id=>typeof id==='string'&&LOT_INDEX.has(id)?LOT_INDEX.get(id):null;
const MASS_FOR={van:1.45,compact:.92,estate:1.15};

const finite=(v,d=0)=>Number.isFinite(v)?v:d;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

// Turns either a lot car or a Harbor Motors fleet profile into full handling numbers.
export function handlingFor(profile={}){
 const lot=lotCar(profile.id);if(lot)return lot;
 return {id:profile.id||'van',name:profile.name||'Van',mass:MASS_FOR[profile.id]||1.2,top:finite(profile.top,12),accel:finite(profile.acceleration,6),reverse:finite(profile.reverse,4),steer:finite(profile.steering,1.6)*1.15,grip:7,drift:1,trunk:profile.id==='estate'?16:profile.id==='compact'?8:20};
}

export function lotOwned(state,id){return !!lotCar(id)&&Array.isArray(state?.lotCars)&&state.lotCars.includes(id);}
export function lotRequest(state,id,select=false){
 const car=lotCar(id);if(!car)return {ok:false,reason:'Lou squints. "Never heard of that one."'};
 const owned=lotOwned(state,id);
 if(select)return owned?{ok:true,car}:{ok:false,reason:'Buy it first.'};
 if(owned)return {ok:false,reason:'You already own the '+car.name+'.'};
 if(!state?.vehicleOwned)return {ok:false,reason:'Lou only deals with registered drivers. Buy the Harbor Motors van first.'};
 const level=levelOf(state.xp);
 if(level<car.level)return {ok:false,reason:'Lou wants to see level '+car.level+' first.'};
 const money=state.payment==='card'?finite(state.bank):finite(state.cash);
 if(money<car.price)return {ok:false,reason:'Not enough '+(state.payment==='card'?'in the bank':'cash')+' for the '+car.name+'.'};
 return {ok:true,car};
}
export const trunkCapacity=spec=>Math.max(0,Math.floor(finite(spec?.trunk,0)));
export const trunkCount=trunk=>Object.values(trunk&&typeof trunk==='object'?trunk:{}).reduce((n,v)=>n+(Number.isFinite(v)&&v>0?Math.floor(v):0),0);
// Moves up to `qty` packs between the carried bag and the trunk. Pure: returns new objects.
export function moveTrunk(packs,trunk,{type,qty=1,toTrunk=true,capacity=0}={}){
 const bag=Array.isArray(packs)?packs.slice():{...(packs||{})},boot={...(trunk||{})};
 const from=toTrunk?bag:boot,to=toTrunk?boot:bag,have=Math.max(0,Math.floor(finite(from[type])));
 let n=Math.min(have,Math.max(0,Math.floor(finite(qty))));
 if(toTrunk)n=Math.min(n,Math.max(0,capacity-trunkCount(boot)));
 if(!type||n<=0)return {packs:bag,trunk:boot,moved:0};
 from[type]=have-n;if(!from[type]&&from===boot)delete from[type];to[type]=Math.floor(finite(to[type]))+n;
 return {packs:bag,trunk:boot,moved:n};
}
// Seizes half the trunk (rounded up) after a pull-over.
export function seizeTrunk(trunk){const left={},taken={};let seized=0;for(const [k,v]of Object.entries(trunk||{})){const n=Math.max(0,Math.floor(finite(v))),take=Math.ceil(n/2);if(take){taken[k]=take;seized+=take;}if(n-take>0)left[k]=n-take;}return {trunk:left,seized,taken};}

export function createCar(x=0,z=0,angle=0){return {x:finite(x),z:finite(z),angle:finite(angle),vx:0,vz:0,yawRate:0,long:0,lat:0,speed:0,rpm:900,gear:1,slip:0,drifting:false,skid:0,lean:0};}

const GEARS=[0,.2,.4,.6,.8,1.01];
// One fixed-size arcade step. input: {throttle:-1..1, steer:-1..1 (positive turns left like A), handbrake:bool}.
export function stepCar(car,input,spec,dt){
 const h=handlingFor(spec);dt=clamp(finite(dt),0,.05);
 if(!(dt>0))return car;
 const throttle=clamp(finite(input?.throttle),-1,1),steer=clamp(finite(input?.steer),-1,1),hand=!!input?.handbrake;
 if(![car.x,car.z,car.angle,car.vx,car.vz,car.yawRate].every(Number.isFinite))Object.assign(car,createCar(finite(car.x),finite(car.z),finite(car.angle)));
 const fx=Math.sin(car.angle),fz=Math.cos(car.angle),rx=Math.cos(car.angle),rz=-Math.sin(car.angle);
 let long=car.vx*fx+car.vz*fz,lat=car.vx*rx+car.vz*rz;
 const mass=Math.max(.3,h.mass),push=h.accel/mass*.82;
 let braking=false;
 if(throttle>0){long+=(long<-.4?push*2.2:push*(1-.7*clamp(long/h.top,0,1)**2))*throttle*dt;if(long<-.4)braking=true;}
 else if(throttle<0){if(long>.4){long=Math.max(0,long+throttle*14/Math.sqrt(mass)*dt);braking=true;}else long+=throttle*push*.7*dt;}
 else long*=Math.exp(-dt*(.55+.25*mass));
 if(hand)long*=Math.exp(-dt*.9);
 long=clamp(long,-h.reverse,h.top);
 if(Math.abs(long)<.05&&!throttle)long=0;
 // Steering is speed-sensitive: nothing at a standstill, full at walking pace, softer at speed.
 const pace=Math.abs(long),bite=clamp(pace/5,0,1)/(1+pace/26),dir=long<-.1?-1:1;
 let target=steer*h.steer*bite*dir;
 if(hand&&pace>3)target*=1.75;
 if(car.drifting)target*=1.25;
 car.yawRate+=(target-car.yawRate)*Math.min(1,dt*(7/mass));
 // Momentum stays in world space: apply the new forward speed, then turn the body under it.
 car.vx=fx*long+rx*lat;car.vz=fz*long+rz*lat;
 car.angle+=car.yawRate*dt;
 const nfx=Math.sin(car.angle),nfz=Math.cos(car.angle),nrx=Math.cos(car.angle),nrz=-Math.sin(car.angle);
 long=car.vx*nfx+car.vz*nfz;lat=car.vx*nrx+car.vz*nrz;
 // Lateral grip: exponential decay of the sideways slide. The handbrake and drifting cut it.
 const slipRatio=Math.abs(lat)/(pace+1.5);
 if(!car.drifting&&(slipRatio>.3||(hand&&pace>6)))car.drifting=true;else if(car.drifting&&slipRatio<.1&&!hand)car.drifting=false;
 const grip=h.grip*(hand?.1:car.drifting?.3/h.drift:1)/Math.sqrt(mass);
 const kept=lat*Math.exp(-grip*dt);
 // Grip that bites converts some of the slide back into forward speed, minus scrub.
 long+=Math.sign(long||1)*Math.abs(lat-kept)*.35;lat=kept;
 long=clamp(long,-h.reverse,h.top);
 car.vx=nfx*long+nrx*lat;car.vz=nfz*long+nrz*lat;
 const l2=car.vx*nfx+car.vz*nfz,t2=car.vx*nrx+car.vz*nrz;
 car.long=l2;car.lat=t2;car.speed=Math.hypot(car.vx,car.vz);car.slip=Math.abs(t2)/(Math.abs(l2)+1.5);
 car.x+=car.vx*dt;car.z+=car.vz*dt;
 const frac=clamp(Math.abs(l2)/h.top,0,1);let gear=1;while(gear<5&&frac>=GEARS[gear])gear++;
 const lo=GEARS[gear-1],hi=GEARS[gear],band=clamp((frac-lo)/(hi-lo),0,1);
 const wheelspin=(throttle>0&&car.drifting)?.25:0;
 car.gear=l2<-.2?-1:gear;car.rpm=Math.round(900+5200*clamp(band*(gear===1?1:.72)+(gear===1?0:.28)+wheelspin,0,1)*(Math.abs(throttle)>0||frac>.05?1:.1));
 car.skid=car.speed>4&&(car.slip>.28||(braking&&pace>7)||(hand&&pace>4))?clamp(car.slip*1.6+(braking?.5:0)+(hand?.4:0),0,1):0;
 car.lean=clamp(-car.yawRate*car.speed*.012,-.12,.12);
 return car;
}
// Collision response used by the game and the cruisers: slide along a wall, else a small bounce.
export function resolveMove(car,prev,clear){
 if(clear(car.x,car.z,car.angle))return 'free';
 if(clear(car.x,prev.z,car.angle)){car.z=prev.z;car.vz*=-.2;return 'slide';}
 if(clear(prev.x,car.z,car.angle)){car.x=prev.x;car.vx*=-.2;return 'slide';}
 car.x=prev.x;car.z=prev.z;
 if(!clear(car.x,car.z,car.angle))car.angle=prev.angle;
 car.vx*=-.25;car.vz*=-.25;car.yawRate*=.3;return 'bounce';
}
export function syncLong(car){const fx=Math.sin(car.angle),fz=Math.cos(car.angle);car.long=car.vx*fx+car.vz*fz;return car.long;}
// Rescales the velocity when a road-zone limit changes the forward speed.
export function setLong(car,value){const fx=Math.sin(car.angle),fz=Math.cos(car.angle),rx=Math.cos(car.angle),rz=-Math.sin(car.angle);const lat=car.vx*rx+car.vz*rz;car.vx=fx*value+rx*lat;car.vz=fz*value+rz*lat;car.long=value;return car;}

// Third-person chase camera: lags behind, leans into turns, pulls in when a wall is in the way.
export function chaseCamera(car,prev,dt,{blocked=null,distance=6.2,height=2.6}={}){
 const back=distance+Math.min(2.2,car.speed*.06),ax=car.x-Math.sin(car.angle)*back,az=car.z-Math.cos(car.angle)*back;
 let x=ax,z=az;
 if(typeof blocked==='function')for(let t=.25;t<=1.0001;t+=.25){const px=car.x+(ax-car.x)*t,pz=car.z+(az-car.z)*t;if(blocked(px,pz)){x=car.x+(ax-car.x)*Math.max(.15,t-.25);z=car.z+(az-car.z)*Math.max(.15,t-.25);break;}}
 const k=prev?Math.min(1,dt*6):1,roll=(prev?.roll||0)+(car.lean-(prev?.roll||0))*Math.min(1,dt*5);
 const out={x:prev?prev.x+(x-prev.x)*k:x,z:prev?prev.z+(z-prev.z)*k:z,y:height,roll};
 out.lookX=car.x+Math.sin(car.angle)*3;out.lookZ=car.z+Math.cos(car.angle)*3;out.lookY=1.1;
 return out;
}
