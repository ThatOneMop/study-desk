// Gummy Bay cutscene acting (v149). Shared by the Act 1 intro and the Act 2/3 story cuts.
// A cast script is plain data: who stands where, when they walk, which gesture they make,
// how they feel and which subtitle speaker they are. castAt() turns it into poses for the
// people kit (walk cycle, arm gestures, facial mood, blinking and lip-flap synced to
// the same syllable schedule that drives the blip "voices"). Props are lists of boxes
// drawn by cine-stage.mjs in three instanced draws. Everything is original and procedural:
// no recorded voices, no samples, no downloaded art. DOM-free and THREE-free, so it is
// testable in node; the Web Audio helpers only run when given an AudioContext.

const finite=(v,d=0)=>Number.isFinite(v)?v:d;
const clamp01=t=>Math.max(0,Math.min(1,finite(t)));
const smooth=t=>{const u=clamp01(t);return u*u*(3-2*u);};
const lerp=(a,b,t)=>a+(b-a)*t;
const wrapAngle=a=>{let x=finite(a);while(x>Math.PI)x-=Math.PI*2;while(x<-Math.PI)x+=Math.PI*2;return x;};
const lerpAngle=(a,b,t)=>a+wrapAngle(b-a)*t;
export const CINE_MOODS=Object.freeze(['friendly','wide','smirk','grumpy','sleepy','cheery','worried','stern']);

// ---- Voices: blip babble per character ("Animal Crossing" style, all synthesised) ----
export const VOICES=Object.freeze({
 radio:{base:170,spread:28,rate:12.5,wave:'square',filter:1800,gain:.022},
 gramps:{base:118,spread:30,rate:9.5,wave:'triangle',filter:1300,gain:.05},
 mayor:{base:290,spread:60,rate:12,wave:'square',filter:2400,gain:.026},
 hank:{base:92,spread:22,rate:10.5,wave:'sawtooth',filter:900,gain:.034},
 marge:{base:235,spread:45,rate:10,wave:'triangle',filter:2000,gain:.045},
 larry:{base:205,spread:18,rate:11,wave:'sawtooth',filter:1500,gain:.028},
 kid:{base:470,spread:80,rate:13,wave:'sine',filter:3200,gain:.05},
 tilly:{base:340,spread:55,rate:12,wave:'triangle',filter:2600,gain:.045},
 note:{base:0,spread:0,rate:0,wave:'sine',filter:0,gain:0}
});
// Subtitle speaker → voice key.
export function voiceFor(who){
 const w=String(who||'').toUpperCase();
 if(!w)return null;
 if(w.includes('NOTE'))return 'note';
 if(w.includes('GRAMPS'))return 'gramps';
 if(w.includes('MAYOR')||w.includes('PLUM'))return 'mayor';
 if(w.includes('HARDTACK')||w.includes('HANK')||w.includes('SQUAD'))return 'hank';
 if(w.includes('MARGE'))return 'marge';
 if(w.includes('LARRY'))return 'larry';
 if(w.includes('TILLY'))return 'tilly';
 if(w.includes('KID'))return 'kid';
 return 'radio';
}
const hashStr=s=>{let h=2166136261>>>0;for(const c of String(s)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)>>>0;}return h>>>0;};
// Deterministic syllable schedule for one line: [{at,dur,hz}], seconds from the line start.
// Words split into vowel groups; commas and full stops leave a breath. The schedule is
// squeezed to fit `fit` seconds so the mouth never flaps after the subtitle is gone.
export function blipSchedule(text,voiceKey,fit=Infinity){
 const v=VOICES[voiceKey];if(!v||!v.rate)return [];
 const out=[];let t=.05,h=hashStr(text+voiceKey);
 const step=1/v.rate;
 for(const token of String(text||'').split(/(\s+)/)){
  if(!token.trim())continue;
  const word=token.replace(/[^A-Za-z’']/g,'');
  const syl=Math.max(word?1:0,Math.min(5,(word.toLowerCase().match(/[aeiouy]+/g)||[]).length));
  for(let i=0;i<syl;i++){
   h=Math.imul(h^(h>>>13),1103515245)+12345>>>0;
   const wob=((h>>>8)%1000)/1000-.5,shout=/[A-Z]{3,}/.test(token)?1.18:1;
   out.push({at:t,dur:step*.62,hz:Math.round(v.base*shout*(1+wob*v.spread/v.base*2))});
   t+=step*(.85+((h>>>20)%100)/400);
  }
  t+=step*.35;
  if(/[,;:—–]$/.test(token))t+=step*1.6;
  if(/[.!?…]["”’]?$/.test(token))t+=step*3.2;
 }
 const total=t;
 if(Number.isFinite(fit)&&fit>0&&total>fit*.94){const k=fit*.94/total;for(const b of out){b.at*=k;b.dur*=k;}}
 return out;
}
const blipCache=new Map();
export function blipsFor(text,who,fit){
 const key=voiceFor(who);const k=key+'|'+fit+'|'+text;
 let list=blipCache.get(k);if(!list){list=blipSchedule(text,key,fit);if(blipCache.size>200)blipCache.clear();blipCache.set(k,list);}
 return list;
}
export function mouthOpen(blips,local){
 if(!Array.isArray(blips)||!Number.isFinite(local))return false;
 for(const b of blips){if(local<b.at)return false;if(local<b.at+b.dur)return true;}
 return false;
}

// ---- Gestures: arm poses for poseArms() ({x,z,fore} radians; x<0 swings forward/up) ----
const REST={x:0,z:.07,fore:-.2};
export const GESTURES=Object.freeze({
 wave:(t)=>({R:{x:-2.55,z:.42+Math.sin(t*11)*.32,fore:-.55}}),
 point:()=>({R:{x:-1.45,z:.12,fore:-.06}}),
 handsUp:(t)=>({L:{x:-2.85,z:.38,fore:-.32+Math.sin(t*9)*.08},R:{x:-2.85,z:.38,fore:-.32+Math.sin(t*9+1)*.08}}),
 give:()=>({R:{x:-1.15,z:.05,fore:-.45}}),
 offer:()=>({L:{x:-1.0,z:.1,fore:-.5},R:{x:-1.0,z:.1,fore:-.5}}),
 bang:(t)=>({R:{x:-1.25+Math.max(0,Math.sin(t*12))*.55,z:.12,fore:-.7}}),
 shrug:()=>({L:{x:-.35,z:.62,fore:-1.45},R:{x:-.35,z:.62,fore:-1.45}}),
 cheer:(t)=>({L:{x:-2.9+Math.sin(t*8)*.25,z:.3,fore:-.25},R:{x:-2.9+Math.sin(t*8+1.4)*.25,z:.3,fore:-.25}}),
 flail:(t)=>({L:{x:-2.2+Math.sin(t*13)*.6,z:.7,fore:-.4},R:{x:-2.2+Math.sin(t*13+2)*.6,z:.7,fore:-.4}}),
 stuck:(t)=>({L:{x:-.4,z:1.2+Math.sin(t*6)*.1,fore:-.2},R:{x:-.4,z:1.2+Math.sin(t*6+1)*.1,fore:-.2}}),
 phone:()=>({R:{x:-.55,z:.42,fore:-2.35}}),
 cuffed:()=>({L:{x:.5,z:.05,fore:-.75},R:{x:.5,z:.05,fore:-.75}}),
 fold:()=>({L:{x:-.75,z:.12,fore:-1.95},R:{x:-.68,z:.1,fore:-2.0}}),
 eat:(t)=>({R:{x:-1.05,z:.3,fore:-2.05+Math.max(0,Math.sin(t*7))*.25}}),
 hold:()=>({R:{x:-.95,z:.1,fore:-1.15}}),
 carry:()=>({L:{x:-.95,z:.12,fore:-.9},R:{x:-.95,z:.12,fore:-.9}}),
 megaphone:()=>({R:{x:-1.55,z:.18,fore:-1.25}}),
 clap:(t)=>({L:{x:-1.2,z:.05+Math.abs(Math.sin(t*9))*.22,fore:-.9},R:{x:-1.2,z:.05+Math.abs(Math.sin(t*9))*.22,fore:-.9}})
});
const blendArm=(a,b,k)=>({x:lerp(a.x,b.x,k),z:lerp(a.z,b.z,k),fore:lerp(a.fore,b.fore,k)});

// ---- Anchors: story cuts place their cast relative to a spot (pier, base door…) ----
export function placeLocal(anchor,x,z){
 const a=anchor||{x:0,z:0},c=Math.cos(a.yaw||0),s=Math.sin(a.yaw||0);
 return [finite(a.x)+x*c-z*s,finite(a.z)+x*s+z*c];
}
// Local facing → world facing (same rotation the camera offsets use).
export function yawLocal(anchor,yaw){return wrapAngle(finite(yaw)-finite(anchor?.yaw));}

// Piecewise path: [[t,x,z,yaw?],...]. Eased per leg so walkers start and stop gently.
function pathAt(path,t){
 if(!path.length)return {x:0,z:0,yaw:null,leg:-1};
 if(t<=path[0][0])return {x:path[0][1],z:path[0][2],yaw:path[0][3]??null,leg:-1};
 for(let i=1;i<path.length;i++){
  const a=path[i-1],b=path[i];
  if(t<b[0]){const u=smooth((t-a[0])/Math.max(1e-3,b[0]-a[0]));return {x:lerp(a[1],b[1],u),z:lerp(a[2],b[2],u),yaw:a[3]??null,leg:i};}
 }
 const z=path[path.length-1];return {x:z[1],z:z[2],yaw:z[3]??null,leg:path.length};
}
const inWindow=(w,t)=>!w||w.some?.(r=>Array.isArray(r)?t>=r[0]&&t<r[1]:false);
const showAt=(show,t)=>!show||(Array.isArray(show[0])?inWindow(show,t):t>=show[0]&&t<show[1]);

// Resolve a script against anchors once (world coordinates, world yaws).
export function resolveCast(script,anchors={}){
 const pick=name=>name?anchors[name]||null:null;
 const actors=(script?.actors||[]).map(a=>{
  const an=pick(a.anchor);
  const path=(a.path||[]).map(p=>{const [x,z]=an?placeLocal(an,p[1],p[2]):[p[1],p[2]];return [p[0],x,z,p[3]==null?undefined:an?yawLocal(an,p[3]):p[3]];});
  return {...a,path};
 });
 const props=(script?.props||[]).map(p=>{
  const an=pick(p.anchor);
  const path=(p.path||[[0,p.x||0,p.z||0,p.yaw||0]]).map(q=>{const [x,z]=an?placeLocal(an,q[1],q[2]):[q[1],q[2]];return [q[0],x,z,an?yawLocal(an,q[3]||0):q[3]||0];});
  return {...p,path};
 });
 return {actors,props,quiet:script?.quiet||null,grade:script?.grade||null};
}

// Poses for every visible actor at time t. speech: the subtitle beat on screen ({who,text,at,until}).
export function castAt(cast,t,speech=null){
 const time=finite(t);
 const out=[];
 const voice=speech?.who?String(speech.who).toUpperCase():'';
 const blips=speech?.text?blipsFor(speech.text,speech.who,(speech.until??speech.at+4)-speech.at):null;
 const talkLocal=speech?time-finite(speech.at):NaN;
 for(const [index,a] of (cast?.actors||[]).entries()){
  if(!showAt(a.show,time))continue;
  const p=pathAt(a.path,time),q=pathAt(a.path,time-.06),r=pathAt(a.path,time+.06);
  const vx=(r.x-q.x)/.12,vz=(r.z-q.z)/.12,speed=Math.hypot(vx,vz);
  let yaw;
  if(speed>.25)yaw=Math.atan2(vx,vz);
  else{
   // Stationary: explicit yaw, else face the target actor, else keep the last walking heading.
   yaw=p.yaw;
   if(yaw==null){let k=p.leg>0?p.leg-1:0;while(k>0&&a.path[k][3]==null)k--;yaw=a.path[k]?.[3]??0;}
   const prev=a.path[Math.max(0,p.leg-1)],prev2=a.path[Math.max(0,p.leg-2)];
   if(prev&&prev2&&prev!==prev2&&Math.hypot(prev[1]-prev2[1],prev[2]-prev2[2])>.2&&time-prev[0]<.45){
    const walkYaw=Math.atan2(prev[1]-prev2[1],prev[2]-prev2[2]);yaw=lerpAngle(walkYaw,yaw,smooth((time-prev[0])/.45));
   }
  }
  const act=(a.acts||[]).find(w=>time>=w[0]&&time<w[1]);
  let armL=null,armR=null;
  if(act&&GESTURES[act[2]]){
   const k=Math.min(smooth((time-act[0])/.28),smooth((act[1]-time)/.28)),g=GESTURES[act[2]](time+index*.7);
   if(g.L)armL=blendArm(REST,g.L,k);if(g.R)armR=blendArm(REST,g.R,k);
  }
  let mood=a.mood||'friendly';for(const m of a.moods||[])if(time>=m[0])mood=m[1];
  const speaking=!!(voice&&(a.who||[]).some(w=>voice.includes(String(w).toUpperCase())));
  const open=speaking&&mouthOpen(blips,talkLocal);
  const blink=!open&&((time+index*1.37)%3.7)<.13;
  const walking=speed>.25,running=speed>3.2;
  const phase=time*(running?9:5.2)*Math.min(1.5,Math.max(.8,speed/1.6))+index;
  const hop=(a.hops||[]).find(w=>time>=w[0]&&time<w[1]);
  out.push({id:a.id,look:a.look,x:p.x,z:p.z,y:finite(a.y)+(hop?Math.sin(Math.PI*clamp01((time-hop[0])/(hop[1]-hop[0])))*.35:0),yaw:wrapAngle(yaw),speed,
   pose:{swing:walking?Math.sin(phase):0,bob:walking?Math.abs(Math.cos(phase))*(running?.06:.03):0,
    breath:walking?0:Math.sin(time*1.55+index*1.37),nod:speaking?Math.sin(time*6.5)*.045+(open?.02:0):(act?.[2]==='bang'?.08:0),
    turn:finite(a.turn),crouch:a.crouch?finite(a.crouch):0,sway:act?.[2]==='stuck'||act?.[2]==='flail'?Math.sin(time*7)*.12:0,armL,armR},
   mood,face:open?'talk':blink?'blink':'open',speaking,scale:finite(a.scale,1)});
 }
 // Second pass: head turns toward whoever is speaking (only a glance, clamped).
 const talker=out.find(o=>o.speaking);
 if(talker)for(const o of out){if(o===talker||o.pose.turn)continue;const want=wrapAngle(Math.atan2(talker.x-o.x,talker.z-o.z)-o.yaw);if(Math.abs(want)<1.6)o.pose.turn=Math.max(-.7,Math.min(.7,want))*.8;}
 return out;
}
export function propsAt(cast,t){
 const time=finite(t),out=[];
 for(const p of cast?.props||[]){
  if(!showAt(p.show,time))continue;
  const at=pathAt(p.path,time),q=pathAt(p.path,time-.08),r=pathAt(p.path,time+.08);
  const moving=Math.hypot(r.x-q.x,r.z-q.z)>.02;
  let yaw=finite(at.yaw,p.path[0][3]||0);if(moving&&p.faceMotion)yaw=Math.atan2(r.x-q.x,r.z-q.z);
  const melt=p.melt?smooth((time-p.melt[0])/(p.melt[1]-p.melt[0])):0;
  out.push({kind:p.kind,x:at.x,z:at.z,y:finite(p.y),yaw,scale:finite(p.scale,1),melt,blink:Math.floor(time*6)%2,bounce:moving&&p.bounce?Math.abs(Math.sin(time*7))*.06:0});
 }
 return out;
}

// ---- Props: original low-poly sets built from boxes. m: s=solid, r=rounded/soft, g=glow ----
// p:[x,y,z] centre, s:[w,h,d], c colour, ry yaw, grow: scaled by melt (0 hides), blink: 0/1 phase.
const B=(p,s,c,m='s',extra={})=>Object.freeze({p,s,c,m,...extra});
function stall(){
 const parts=[B([0,.5,0],[2.6,1,1.05],0xb07a45),B([0,.5,.535],[2.5,.86,.04],0xe8737f),B([0,1.02,0],[2.75,.08,1.2],0x8a5a33)];
 for(const x of [-1.25,1.25])for(const z of [-.45,.45])parts.push(B([x,1.55,z],[.07,1.1,.07],0x6d4526));
 for(let i=0;i<7;i++)parts.push(B([-1.29+i*.43,2.12,.12],[.43,.06,1.45],i%2?0xf6efe0:0xe8555d,'s',{rx:-.32}));
 parts.push(B([0,2.32,-.45],[2.2,.42,.06],0xf6efe0),B([0,2.32,-.42],[2.0,.3,.04],0xe8555d));
 const jar=[0xff5a7a,0xffd24a,0x6ff0c8,0x8fb4ff,0xffa04a,0xd78bff];
 jar.forEach((c,i)=>{parts.push(B([-1.0+i*.4,1.13,.3],[.2,.18,.2],c,'r'));});
 parts.push(B([.95,1.1,-.25],[.36,.1,.28],0xe8414f,'r'),B([-.9,1.1,-.25],[.3,.12,.3],0x6ff0c8,'r'));
 return parts;
}
function podium(){
 const parts=[B([0,.2,0],[7.5,.4,3.6],0xd9b25a),B([0,.38,1.82],[7.5,.12,.06],0xe8555d),
  B([0,.98,.6],[.95,1.18,.62],0x7a3f74),B([0,1.6,.6],[1.1,.08,.75],0x5c2d58,'s',{rx:.18}),B([0,1.06,.92],[.36,.36,.03],0xe9c14a,'r'),
  B([0,1.78,.82],[.03,.42,.03],0x22252b),B([0,1.99,.88],[.08,.1,.12],0x2a2d33,'r')];
 for(const x of [-3.6,3.6])parts.push(B([x,1.6,-1.6],[.1,3.2,.1],0xf6efe0));
 for(let i=0;i<11;i++){const x=-3.3+i*.66,sag=Math.sin(i/10*Math.PI)*.35;parts.push(B([x,2.9-sag,-1.6],[.36,.4,.04],[0xff5a7a,0xffd24a,0x6ff0c8,0x8fb4ff][i%4],'s',{rz:.78}));}
 return parts;
}
function bear(){
 const red=0xe8414f,lite=0xff6b78,dark=0x3a0d12;
 return [B([0,.35,0],[3.8,.5,3.4],0xd9b25a),B([0,.62,0],[3.9,.06,3.5],0xe8555d),
  B([-.7,1.2,0],[.9,1.2,1],red,'r'),B([.7,1.2,0],[.9,1.2,1],red,'r'),
  B([0,2.75,0],[2.5,2.6,2],red,'r'),B([0,2.6,.75],[1.5,1.6,.6],lite,'r'),
  B([-1.45,3.1,.1],[.75,1.6,.75],red,'r',{rz:.5}),B([1.45,3.1,.1],[.75,1.6,.75],red,'r',{rz:-.5}),
  B([0,4.75,0],[2.1,1.75,1.75],red,'r'),B([-.8,5.75,0],[.62,.62,.45],red,'r'),B([.8,5.75,0],[.62,.62,.45],red,'r'),
  B([0,4.45,.85],[.85,.6,.4],lite,'r'),B([-.42,4.95,.86],[.2,.24,.08],dark,'r'),B([.42,4.95,.86],[.2,.24,.08],dark,'r'),B([0,4.6,1.04],[.26,.18,.1],dark,'r'),
  B([0,.66,1.6],[5.2,.06,4.4],red,'r',{grow:1})];
}
function van(){
 const parts=[B([0,1.25,0],[2.3,1.9,4.6],0xf3f1ea),B([0,1.05,0],[2.34,.42,4.64],0x2f62c9),B([0,1.75,2.05],[2.1,.7,.5],0x9fc4dd),
  B([-1.16,1.7,.6],[.04,.5,1.6],0x9fc4dd),B([1.16,1.7,.6],[.04,.5,1.6],0x9fc4dd),B([0,.55,2.3],[2.2,.3,.1],0xc8c8c8),
  B([-.5,2.32,.6],[.85,.22,.42],0xff2a3c,'g',{blink:0}),B([.5,2.32,.6],[.85,.22,.42],0x2a6bff,'g',{blink:1})];
 for(const [x,z] of [[-1.1,-1.5],[1.1,-1.5],[-1.1,1.5],[1.1,1.5]])parts.push(B([x,.42,z],[.3,.84,.84],0x22252b,'r'));
 return parts;
}
function baitcart(){
 return [B([0,.75,0],[1.6,.9,.9],0x2f6f8f),B([0,1.22,0],[1.7,.06,1],0xe0b13a),B([-.5,1.35,0],[.3,.22,.3],0xffd24a,'r'),B([0,1.36,.1],[.34,.24,.26],0xff5a7a,'r'),B([.5,1.34,-.1],[.3,.2,.3],0x6ff0c8,'r'),
  B([-.6,.28,.46],[.1,.56,.56],0x22252b,'r'),B([.6,.28,.46],[.1,.56,.56],0x22252b,'r'),B([0,1.9,-.38],[.06,1.3,.06],0x6d4526),B([0,2.5,-.38],[1.4,.5,.06],0xf6efe0),B([0,2.5,-.35],[1.2,.3,.04],0x2f6f8f)];
}
function lectern(){return [B([0,.55,0],[.8,1.1,.55],0x7a3f74),B([0,1.14,0],[.95,.08,.68],0x5c2d58,'s',{rx:.18}),B([0,.66,.29],[.34,.34,.03],0xe9c14a,'r'),B([0,1.34,.24],[.03,.4,.03],0x22252b),B([0,1.55,.3],[.08,.1,.12],0x2a2d33,'r'),B([0,1.3,-.1],[.6,.04,.3],0xff5a7a,'r')];}
function crates(){return [B([0,.35,0],[.8,.7,.8],0xb07a45),B([.15,1.0,.05],[.7,.6,.7],0xc48a52),B([1.0,.3,.2],[.7,.6,.7],0xa86e3e)];}
function clipboard(){return [B([0,0,0],[.26,.34,.03],0x8a5a33),B([0,.02,.02],[.22,.26,.01],0xf6efe0)];}
function phonebox(){return [B([0,1.2,0],[.9,2.4,.9],0xc23b3b),B([0,1.3,.46],[.7,1.6,.02],0x9fc4dd),B([0,2.48,0],[1,.16,1],0x8a2424)];}
function table(){return [B([0,.75,0],[2.2,.08,1],0xf6efe0),B([-.9,.37,0],[.08,.74,.8],0x6d4526),B([.9,.37,0],[.08,.74,.8],0x6d4526),B([-.5,.86,0],[.32,.14,.32],0xe8414f,'r'),B([.1,.84,.1],[.3,.1,.3],0xffd24a,'r'),B([.6,.86,-.1],[.26,.14,.26],0x6ff0c8,'r')];}
export const PROP_KINDS=Object.freeze({stall:stall(),podium:podium(),lectern:lectern(),bear:bear(),van:van(),baitcart:baitcart(),crates:crates(),clipboard:clipboard(),phonebox:phonebox(),table:table()});
export function propPartCount(kind){return PROP_KINDS[kind]?.length||0;}

// Gentle hand-held drift for a shot (metres / radians), deterministic in t.
export function cameraDrift(t,amount=.04){const a=finite(amount);return {x:Math.sin(t*.9)*a+Math.sin(t*2.3)*a*.25,y:Math.sin(t*1.3+1)*a*.6,z:Math.cos(t*.7)*a*.5};}

// ---- Web Audio: score stingers, ambience beds and blip voices (all synthesised) ----
const NOTE=n=>440*Math.pow(2,(n-69)/12);
export const STINGERS=Object.freeze({
 title:{wave:'triangle',notes:[[0,60,.5],[.18,64,.5],[.36,67,.6],[.54,72,1.6],[.54,64,1.6],[.54,67,1.6]],gain:.07,cut:2600},
 flashback:{wave:'sine',notes:[[0,84,.5],[.22,88,.5],[.44,91,.5],[.66,96,.7],[.95,91,.5],[1.17,88,.5],[1.39,84,1.2]],gain:.06,cut:6000,bell:1},
 parade:{wave:'sawtooth',notes:[[0,67,.18],[.2,67,.18],[.4,72,.3],[.75,76,.3],[1.1,79,.9],[1.1,72,.9]],gain:.035,cut:2200},
 uhoh:{wave:'sawtooth',notes:[[0,62,.45,-1],[.5,61,.45,-1],[1,60,.45,-1],[1.5,59,1.3,-3]],gain:.04,cut:1100},
 squad:{wave:'square',notes:[[0,43,.22],[.28,43,.22],[.56,46,.6],[.56,34,.6]],gain:.04,cut:900,drum:1},
 tender:{wave:'sine',notes:[[0,53,2.6],[0,57,2.6],[0,60,2.6],[0,64,2.6],[.6,72,1.8]],gain:.035,cut:3000},
 reveal:{wave:'triangle',notes:[[0,72,.3],[.12,76,.3],[.24,79,.3],[.36,84,1.4],[.36,79,1.4],[.36,76,1.4]],gain:.06,cut:5000,bell:1},
 rival:{wave:'square',notes:[[0,57,.2],[.25,60,.2],[.5,56,.2],[.75,55,.7]],gain:.03,cut:1400},
 siren:{wave:'square',notes:[[0,81,.38],[.4,75,.38],[.8,81,.38],[1.2,75,.38],[1.6,81,.38],[2.0,75,.5]],gain:.018,cut:2600},
 sting:{wave:'square',notes:[[0,48,.1],[.12,55,.5]],gain:.05,cut:1500,drum:1}
});
export function playStinger(ctx,dest,kind,{when=0,volume=1}={}){
 const s=STINGERS[kind];if(!ctx||!dest||!s)return false;
 try{
  const t0=ctx.currentTime+Math.max(0,when),f=ctx.createBiquadFilter();f.type='lowpass';f.frequency.value=s.cut;f.connect(dest);
  for(const [at,n,dur,bend] of s.notes){
   const o=ctx.createOscillator(),g=ctx.createGain(),t=t0+at,hz=NOTE(n);
   o.type=s.wave;o.frequency.setValueAtTime(hz,t);if(bend)o.frequency.linearRampToValueAtTime(hz*Math.pow(2,bend/12),t+dur);
   const peak=s.gain*volume;g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(peak,t+(s.bell?.005:.04));
   g.gain.exponentialRampToValueAtTime(.0001,t+dur*(s.bell?1.4:1));
   o.connect(g);g.connect(f);o.start(t);o.stop(t+dur*1.5+.05);
   if(s.bell){const o2=ctx.createOscillator(),g2=ctx.createGain();o2.type='sine';o2.frequency.value=hz*2.76;g2.gain.setValueAtTime(peak*.3,t);g2.gain.exponentialRampToValueAtTime(.0001,t+dur*.6);o2.connect(g2);g2.connect(f);o2.start(t);o2.stop(t+dur);}
  }
  if(s.drum){for(const at of s.notes.map(n=>n[0])){const t=t0+at,len=Math.floor(ctx.sampleRate*.12),b=ctx.createBuffer(1,len,ctx.sampleRate),d=b.getChannelData(0);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,3);const src=ctx.createBufferSource(),g=ctx.createGain();src.buffer=b;g.gain.value=.08*volume;src.connect(g);g.connect(dest);src.start(t);}}
  return true;
 }catch(e){return false;}
}
export function playBlips(ctx,dest,blips,voiceKey,{when=0,phone=false,volume=1}={}){
 const v=VOICES[voiceKey];if(!ctx||!dest||!v||!v.rate||!Array.isArray(blips))return 0;
 try{
  const t0=ctx.currentTime+Math.max(0,when),f=ctx.createBiquadFilter();
  if(phone){f.type='bandpass';f.frequency.value=1200;f.Q.value=1.4;}else{f.type='lowpass';f.frequency.value=v.filter;}
  f.connect(dest);
  for(const b of blips){const o=ctx.createOscillator(),g=ctx.createGain(),t=t0+b.at;o.type=v.wave;o.frequency.setValueAtTime(b.hz,t);o.frequency.linearRampToValueAtTime(b.hz*.92,t+b.dur);
   g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v.gain*volume,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+b.dur);o.connect(g);g.connect(f);o.start(t);o.stop(t+b.dur+.02);}
  return blips.length;
 }catch(e){return 0;}
}
// A bus for one cutscene: everything routes through it, so skipping silences it at once.
export function createCineAudio(ctx,dest){
 if(!ctx||!dest)return null;
 try{
  const bus=ctx.createGain();bus.gain.value=1;bus.connect(dest);
  const beds=[],timers=[];
  const noise=sec=>{const n=Math.floor(ctx.sampleRate*sec),b=ctx.createBuffer(1,n,ctx.sampleRate),d=b.getChannelData(0);let last=0;for(let i=0;i<n;i++){last=last*.97+(Math.random()*2-1)*.03;d[i]=last*6;}return b;};
  function bed(kind,volume=1){
   const src=ctx.createBufferSource();src.buffer=noise(3);src.loop=true;
   const f=ctx.createBiquadFilter(),g=ctx.createGain(),lfo=ctx.createOscillator(),lg=ctx.createGain();
   f.type=kind==='crowd'?'bandpass':'lowpass';f.frequency.value=kind==='sea'?520:kind==='crowd'?700:300;f.Q.value=kind==='crowd'?.8:.5;
   const base=(kind==='sea'?.11:kind==='crowd'?.09:.05)*volume;g.gain.value=base;
   lfo.frequency.value=kind==='sea'?.16:kind==='crowd'?.7:.1;lg.gain.value=base*.6;lfo.connect(lg);lg.connect(g.gain);
   src.connect(f);f.connect(g);g.connect(bus);src.start();lfo.start();beds.push(src,lfo);
   const chirp=kind==='sea'?'gull':kind==='town'||kind==='morning'?'bird':kind==='night'?'cricket':null;
   if(chirp){const tick=()=>{if(!beds.length)return;critter(chirp,volume);timers.push(setTimeout(tick,(chirp==='cricket'?700:1600)+Math.random()*2400));};timers.push(setTimeout(tick,600+Math.random()*900));}
  }
  function critter(kind,volume=1){
   const t=ctx.currentTime,o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';
   if(kind==='gull'){o.frequency.setValueAtTime(1500,t);o.frequency.exponentialRampToValueAtTime(900,t+.32);g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.02*volume,t+.04);g.gain.exponentialRampToValueAtTime(.0001,t+.36);o.start(t);o.stop(t+.4);}
   else if(kind==='cricket'){o.frequency.value=4300;g.gain.setValueAtTime(.0001,t);for(let i=0;i<4;i++){g.gain.setValueAtTime(.008*volume,t+i*.05);g.gain.setValueAtTime(.0001,t+i*.05+.025);}o.start(t);o.stop(t+.22);}
   else{const hz=2400+Math.random()*1200;o.frequency.setValueAtTime(hz,t);o.frequency.linearRampToValueAtTime(hz*1.25,t+.08);o.frequency.linearRampToValueAtTime(hz*.9,t+.16);g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.012*volume,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+.18);o.start(t);o.stop(t+.2);}
   o.connect(g);g.connect(bus);
  }
  let current='';
  return {bus,
   ambience(kind,volume=1){if(kind===current)return;current=kind;for(const n of beds.splice(0))try{n.stop();}catch(e){}if(kind)bed(kind,volume);},
   stinger(kind,opts){return playStinger(ctx,bus,kind,opts);},
   voice(blips,voiceKey,opts){return playBlips(ctx,bus,blips,voiceKey,opts);},
   stop(){current='';for(const id of timers.splice(0))clearTimeout(id);try{bus.gain.setTargetAtTime(0,ctx.currentTime,.06);}catch(e){}const nodes=beds.splice(0);setTimeout(()=>{for(const n of nodes)try{n.stop();}catch(e){}try{bus.disconnect();}catch(e){}},400);}};
 }catch(e){return null;}
}
