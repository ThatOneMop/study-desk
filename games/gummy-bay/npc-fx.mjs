// P1-6: what a customer does after eating your gummies, how passers-by react to
// you, and how a customer rates the batch. Pure data and maths, no drawing.
// Every look is a cartoon gag (hops, sparkles, tiny, glowing, snoozing); none of
// it imitates being intoxicated. Clocks: `clock` is absolute game minutes,
// `seconds` is real animation time.
import {EFFECTS,effectById} from './mix-core.mjs';

const fx=(id,label,o={})=>Object.freeze({id,label,scale:[1,1,1],hop:0,hover:0,sway:0,jitter:0,glow:0,tint:null,rainbow:false,face:null,animRate:1,orbit:0,peek:0,particle:null,lines:[],...o});
export const FX_KINDS=Object.freeze({
 bouncy:fx('bouncy','Bouncy',{hop:.24,lines:['Boing!','Wheee!','Boing boing!']}),
 giggly:fx('giggly','Giggly',{face:'talk',sway:.03,particle:{style:'note',color:0xffd25a,rate:1.2},lines:['Hee hee!','Ha ha ha!','*giggles*']}),
 sparkly:fx('sparkly','Sparkly',{particle:{style:'star',color:0xfff1a0,rate:9},lines:['Ooh, shiny!','I sparkle now!']}),
 tiny:fx('tiny','Tiny',{scale:[.6,.6,.6],lines:['Why is everything so big?','Tiny me!']}),
 big:fx('big','Big',{scale:[1.3,1.3,1.3],lines:['I feel enormous!','Mind your head!']}),
 lanky:fx('lanky','Lanky',{scale:[.94,1.24,.94],lines:['Nice view up here.','Stretchy!']}),
 glowy:fx('glowy','Glowy',{glow:1,tint:{color:0xc8fbff,amount:.38},particle:{style:'puff',color:0x9ff4ff,rate:1.4},lines:['I’m a night light!','Do I look glowy?']}),
 slowmo:fx('slowmo','Slow-mo',{animRate:.35,lines:['Every… thing… is… slow…','Taaaking… my… time…']}),
 zoomies:fx('zoomies','Zoomies',{orbit:1,animRate:1.6,lines:['Zoom zoom!','Can’t stop now!','Laps! Laps!']}),
 floaty:fx('floaty','Floaty',{hover:.3,particle:{style:'puff',color:0xffffff,rate:1},lines:['My feet left the ground!','Floaty!']}),
 rainbow:fx('rainbow','Rainbow',{rainbow:true,tint:{color:0xff5fa0,amount:.42},particle:{style:'star',color:-1,rate:5},lines:['I’m every colour!','Rainbow mode!']}),
 sleepy:fx('sleepy','Sleepy',{face:'blink',animRate:.6,sway:.05,particle:{style:'z',color:0xcfe0ff,rate:.8},lines:['*yawn*','Zzz…','Five more minutes…']}),
 wobbly:fx('wobbly','Wobbly',{sway:.14,lines:['Wibble wobble!','I’m made of jelly!']}),
 twitchy:fx('twitchy','Twitchy',{jitter:.025,lines:['Eep!','Boop!']}),
 grumpy:fx('grumpy','Grumpy',{tint:{color:0x9fb08a,amount:.22},particle:{style:'puff',color:0x8a8f99,rate:1.2},lines:['Blech. Too sour.','Hmph.']}),
 stinky:fx('stinky','Whiffy',{particle:{style:'puff',color:0xa6d36a,rate:2},lines:['Phew, garlicky!','Who brought onions?']}),
 confused:fx('confused','Confused',{particle:{style:'question',color:0xffffff,rate:.6},lines:['Wait, where was I?','Huh?']}),
 peeky:fx('peeky','Curious',{peek:1,lines:['Ooh, what’s that?','Hmm, interesting…']}),
 munchy:fx('munchy','Snacky',{face:'talk',lines:['Got any crisps?','Snack time!']}),
 fizzy:fx('fizzy','Fizzy',{particle:{style:'star',color:0xff9a6a,rate:6},hop:.06,lines:['Pop! Pop!','Fizz!']})
});
// Every mix effect has exactly one look. Names stay the mixer's; the look is the gag.
export const EFFECT_FX=Object.freeze({
 still:'slowmo',sunny:'giggly',keen:'peeky',peckish:'munchy',wary:'peeky',breezy:'floaty',pungent:'stinky',
 hearty:'big',woozy:'wobbly',zippy:'zoomies',zesty:'fizzy',drowsy:'sleepy',quiet:'slowmo',bitter:'grumpy',
 spry:'bouncy',smooth:'sparkly',hazy:'floaty',restless:'zoomies',jittery:'twitchy',slick:'sparkly',peppery:'fizzy',
 bright:'rainbow',luminous:'glowy',brisk:'zoomies',scattered:'confused',curious:'peeky',thunder:'bouncy',
 buoyant:'floaty',looming:'big',sparking:'sparkly',volatile:'fizzy',lanky:'lanky',tiny:'tiny',shambling:'wobbly'
});
export const FX_MAX_KINDS=3;
export const FX_MIN_MINUTES=120,FX_MAX_MINUTES=240,FX_FADE_MINUTES=20;
const finite=(v,d=0)=>Number.isFinite(v)?v:d;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function fxKindOf(effect){return FX_KINDS[EFFECT_FX[effect]]||null;}
// Strongest effects show first; duplicates of one look collapse.
export function fxKinds(effects,max=FX_MAX_KINDS){
 const list=[...new Set((effects||[]).filter(id=>effectById(id)))].sort((a,b)=>effectById(b).tier-effectById(a).tier||EFFECTS.indexOf(effectById(a))-EFFECTS.indexOf(effectById(b)));
 const out=[];for(const id of list){const k=EFFECT_FX[id];if(k&&!out.includes(k))out.push(k);if(out.length>=max)break;}
 return out;
}
// 2–4 in-game hours (about 100–200 real seconds), longer for stronger mixes.
export function fxMinutes(effects){
 const tiers=[...new Set(effects||[])].map(id=>effectById(id)?.tier||0).sort((a,b)=>b-a).slice(0,4);
 return clamp(FX_MIN_MINUTES+tiers.reduce((s,t)=>s+t*8,0),FX_MIN_MINUTES,FX_MAX_MINUTES);
}
export function startFx(effects,clock){
 const kinds=fxKinds(effects);if(!kinds.length)return null;
 const start=finite(clock);return {effects:[...new Set(effects)].filter(id=>effectById(id)),kinds,start,until:start+fxMinutes(effects)};
}
export function fxActive(entry,clock){return !!entry&&finite(clock)>=entry.start&&finite(clock)<entry.until;}
export function fxStrength(entry,clock){
 if(!fxActive(entry,clock))return 0;
 const c=finite(clock);return clamp(Math.min((c-entry.start)/1.5,(entry.until-c)/FX_FADE_MINUTES),0,1);
}
function hsl(h){const f=n=>{const k=(n+h*12)%12;return .5-.5*Math.max(-1,Math.min(k-3,9-k,1));};return (Math.round(f(0)*255)<<16)|(Math.round(f(8)*255)<<8)|Math.round(f(4)*255);}
// Per-frame look for one person. Low quality keeps every gag but thins particles.
export function fxFrame(entry,clock,seconds=0,id=0,{low=false}={}){
 const k=fxStrength(entry,clock);
 const out={on:k>0,strength:k,kinds:k>0?entry.kinds:[],scale:[1,1,1],lift:0,sway:0,jitterX:0,jitterZ:0,glow:0,tint:null,face:null,animRate:1,orbit:null,headTurn:0,particles:[]};
 if(!out.on)return out;
 const t=finite(seconds)+id*1.37;
 for(const name of entry.kinds){
  const f=FX_KINDS[name];
  for(let i=0;i<3;i++)out.scale[i]*=1+(f.scale[i]-1)*k;
  if(f.hop)out.lift+=Math.abs(Math.sin(t*Math.PI*1.6))*f.hop*k;
  if(f.hover)out.lift+=(f.hover+Math.sin(t*1.7)*.06)*k;
  if(f.sway)out.sway+=Math.sin(t*(name==='sleepy'?.9:2.2))*f.sway*k;
  if(f.jitter){out.jitterX+=Math.sin(t*47)*f.jitter*k;out.jitterZ+=Math.cos(t*39)*f.jitter*k;}
  if(f.glow)out.glow=Math.max(out.glow,f.glow*k*(.8+.2*Math.sin(t*3)));
  if(f.rainbow)out.tint={color:hsl((t*.25)%1),amount:f.tint.amount*k};
  else if(f.tint&&!out.tint)out.tint={color:f.tint.color,amount:f.tint.amount*k};
  if(f.face&&!out.face)out.face=f.face==='talk'?(Math.sin(t*9)>0?'talk':'open'):(Math.sin(t*.7)>-.6?'blink':'open');
  out.animRate*=1+(f.animRate-1)*k;
  if(f.orbit)out.orbit={radius:.9*k,angle:t*2.6};
  if(f.peek)out.headTurn+=Math.sin(t*1.3)*.7*k;
  if(f.particle){const rate=f.particle.rate*k*(low?.35:1);if(rate>0)out.particles.push({style:f.particle.style,color:f.particle.color<0?hsl((t*.5)%1):f.particle.color,rate});}
 }
 for(let i=0;i<3;i++)out.scale[i]=clamp(out.scale[i],.5,1.5);
 out.animRate=clamp(out.animRate,.25,2);
 return out;
}
export function fxLine(entry,seconds=0,id=0){
 if(!entry?.kinds?.length)return '';
 const n=Math.floor(finite(seconds)/7+id),f=FX_KINDS[entry.kinds[Math.abs(n)%entry.kinds.length]];
 return f.lines[Math.abs(n*7+id)%f.lines.length]||'';
}

// ---- Ambient reactions. Highest priority wins.
export const REACT_RANGE=Object.freeze({flee:9,cower:4,backoff:12,point:14,wave:6,look:5});
export const REACT_SECONDS=Object.freeze({flee:4,cower:3.5,backoff:2.5,call:4,point:2.5,wave:2,look:0,idle:4});
export const REACTION_LINES=Object.freeze({
 flee:['Eek!','Not me!','Run!'],cower:['Whoa, hey!','Easy there!'],backoff:['Yikes.','Uh, nope.'],
 call:['Hello, Sugar Squad?','Yes, there’s a scuffle…'],point:['Nice ollie!','Whoa, sick!','Do it again!','Wicked!'],
 wave:['Hey!','Hiya!','Oh, hi!','Morning!'],bail:['Oof!','Ouch, you okay?']
});
export function chooseReaction({distance=Infinity,friendly=false,waved=false,chase=false,scuffle=null,trick=null,calling=false}={}){
 const d=finite(distance,Infinity);
 if(calling)return 'call';
 if(chase&&d<REACT_RANGE.flee)return 'flee';
 if(scuffle&&finite(scuffle.age,Infinity)<6){const sd=finite(scuffle.distance,Infinity);if(sd<REACT_RANGE.cower)return 'cower';if(sd<REACT_RANGE.backoff)return 'backoff';}
 if(trick&&finite(trick.age,Infinity)<3&&finite(trick.distance,Infinity)<REACT_RANGE.point)return 'point';
 if(friendly&&!waved&&d<REACT_RANGE.wave)return 'wave';
 if(d<REACT_RANGE.look)return 'look';
 return 'idle';
}
export function reactionLine(kind,id=0,salt=0){const list=REACTION_LINES[kind];return list?list[Math.abs(id*3+salt)%list.length]:'';}
// Body pose per reaction, read by the person kit.
export function reactionPose(kind,seconds=0){
 const t=finite(seconds);
 switch(kind){
  case 'wave':return {armR:{x:-2.75,z:.35,fore:-.5+Math.sin(t*9)*.45}};
  case 'point':return {armR:{x:-1.5,z:.05,fore:0}};
  case 'cower':return {crouch:.26,armL:{x:-1.25,z:.05,fore:-1.95},armR:{x:-1.25,z:.05,fore:-1.95}};
  case 'call':return {armR:{x:-.45,z:.55,fore:-2.3}};
  case 'stretch':return {armL:{x:-2.9,z:-.25,fore:-.1},armR:{x:-2.9,z:.25,fore:-.1}};
  case 'shrug':return {armL:{x:-.5,z:-.6,fore:-1.2},armR:{x:-.5,z:.6,fore:-1.2}};
  case 'giggle':return {armL:{x:-.9,z:-.1,fore:-1.4}};
  default:return {};
 }
}
// A friendly passer-by: a third of townsfolk, or anyone once your street rep is good.
export function crowdFriendly(id,rep=0){return Math.abs(Math.trunc(finite(id)))%3===0||finite(rep)>=40;}
// Idle variety: each person gets a short beat in a staggered 30 s window.
const IDLE_BEATS=Object.freeze([
 {kind:'stretch',line:'*big stretch*'},{kind:'yawn',line:'*yawn*'},{kind:'hum',line:'♪ hm hm hmm ♪'},
 {kind:'shrug',line:'Eh, who knows.'},{kind:'giggle',line:'Ha! Good one.'},{kind:'chat',line:'Lovely day for it.'},
 {kind:'chat',line:'Has anyone seen my cat?'},{kind:'chat',line:'The pier’s busy today.'}
]);
export function idleBeat(id=0,seconds=0){
 const n=Math.abs(Math.trunc(finite(id))),t=finite(seconds)+n*4.3,slot=Math.floor(t/30);
 if((slot+n)%3!==0||t-slot*30>REACT_SECONDS.idle)return null;
 return IDLE_BEATS[(slot*5+n)%IDLE_BEATS.length];
}

// ---- Customer satisfaction after a deal.
export const SATISFACTION=Object.freeze({
 delighted:{emote:'♥ ♥',relation:4,texts:['That {fav} batch was perfect. You get me!','Best gummies on the bay. Same again soon?']},
 happy:{emote:'♪',relation:2,texts:['Tasty! Bit more {fav} next time?','Nice batch. I’d buy again.']},
 okay:{emote:'…',relation:0,texts:['They were fine. I was hoping for something {fav}.','Not bad. Not my favourite.']},
 grumpy:{emote:'Hmph!',relation:-3,texts:['Hmm, a bit {bad} for me. Try a different mix?','Too {bad}, honestly. I’ll pass for a while.']}
});
const BAD=['wary','pungent','woozy','bitter','restless','jittery','scattered','volatile'];
export function customerDislike(index){return BAD[Math.abs(Math.trunc(finite(index)))%BAD.length];}
export function satisfactionScore(effects,{favourite=null,dislike=null}={}){
 const list=[...new Set(effects||[])].filter(id=>effectById(id));
 const good=list.filter(id=>!BAD.includes(id)).length,bad=list.filter(id=>BAD.includes(id)).length;
 let score=.5+Math.min(.24,good*.06)-bad*.12;
 if(favourite&&list.includes(favourite))score+=.35;
 if(dislike&&list.includes(dislike))score-=.2;
 return clamp(score,0,1);
}
export function satisfactionTier(score){return score>=.85?'delighted':score>=.6?'happy':score>=.38?'okay':'grumpy';}
export function customerFeedback(effects,{favourite=null,dislike=null,index=0}={}){
 const score=satisfactionScore(effects,{favourite,dislike}),tier=satisfactionTier(score),info=SATISFACTION[tier];
 const list=[...new Set(effects||[])];
 const badId=(dislike&&list.includes(dislike))?dislike:list.find(id=>BAD.includes(id))||dislike||'bitter';
 const name=id=>(effectById(id)?.name||'sweet').toLowerCase();
 const text=info.texts[Math.abs(Math.trunc(finite(index)))%info.texts.length].replace('{fav}',name(favourite)).replace('{bad}',name(badId));
 return {score,tier,emote:info.emote,relation:info.relation,text};
}
