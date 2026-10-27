// v165: talking to people on the street (Tom: "look at them, E, they face you, a
// dialogue panel with a portrait and options, reaction animations").
// Pure logic + markup; game.js wires it to the crowd, police and the hotbar packs.
export const TALK_RANGE=3.2,TALK_FACING=.9;
const FIRST=['Dazza','Shaz','Kev','Trish','Mick','Leanne','Bazza','Jodie','Wes','Tash','Rhys','Kylie','Deano','Bec','Gaz','Mel','Tones','Nic','Craig','Lou'];
const LAST=['the Postie','from the Servo','with the Ute','on Smoko','from Number 9','the Busker','in Hi-Vis','with the Dog','off the Bus','from the Pub'];
const hash=n=>{let x=(Math.abs(Math.trunc(Number(n)||0))+7)*2654435761%4294967296;x^=x>>>13;x=Math.imul(x,0x5bd1e995)>>>0;x^=x>>>15;return x>>>0;};
export function personName(id){const h=hash(id);return FIRST[h%FIRST.length]+' '+LAST[(h>>>8)%LAST.length];}
// Mood is stable per person and drifts with the hour: grumpy early, chatty in the evening.
export const MOODS=Object.freeze(['chatty','wary','grumpy','keen']);
export function personMood(id,time=720){const h=hash(id*3+1),hour=Math.floor((((time%1440)+1440)%1440)/60);let m=h%4;if(hour<9&&m===0)m=2;if(hour>=18&&m===2&&h%3===0)m=0;return MOODS[m];}
export const REACTIONS=Object.freeze(['nod','laugh','shrug','shake','recoil','wave','talk']);
const GREET={chatty:['Not bad, mate. Bloody hot out, eh?','Yeah good! You new round here?','Living the dream. Well, a dream.'],wary:['...Do I know you?','Fine. Why?','Yeah, alright. Just heading off.'],grumpy:['What do you want?','Busy. Can\'t you tell?','Rack off, I\'m late.'],keen:['Heyyy! Good to see a friendly face.','Can\'t complain! Well, I could.','Sweet as. What\'s the go?']};
const PITCH_YES=['Gummies? ...Go on then, keep it quiet.','Ha, my cousin said someone was selling. Yeah, alright.','Sweet. Don\'t tell my mum.'];
const PITCH_NO=['Nah, I\'m right.','Not my thing, sorry.','Ha, no. Good luck though.'];
const PITCH_SNITCH=['Are you serious? I\'m calling the cops.','Get away from me. I\'m ringing the police.'];
const BYE=['See ya.','Hooroo.','Catch ya later.','Yeah, bye.'];
const pick=(list,r)=>list[Math.floor(r()*list.length)%list.length];
export function talkOptions({packs=0,tutorial=false}={}){
 return [
  {id:'greet',label:'How\'s it going?'},
  {id:'cops',label:'Seen any cops around?'},
  {id:'pitch',label:packs>0?'Want to try some gummies?':'Want to try some gummies? (no packs on you)',disabled:packs<=0},
  {id:'bye',label:'Never mind.'}
 ];
}
// ctx: {mood, packs, heat(0-100), tutorial, cop:{dist,dir}|null, contact:name|null}, r(): 0..1
export function talkReply(option,ctx={},r=Math.random){
 const mood=MOODS.includes(ctx.mood)?ctx.mood:'chatty';
 if(option==='greet'){const line=pick(GREET[mood],r);return {line,reaction:mood==='grumpy'?'shake':mood==='wary'?'shrug':r()<.5?'laugh':'nod',end:false};}
 if(option==='cops'){
  if(mood==='grumpy')return {line:'Do I look like a lookout?',reaction:'shake',end:false};
  const c=ctx.cop;if(!c||!(c.dist<120))return {line:'Haven\'t seen a single cop all day.',reaction:'shrug',end:false};
  const near=c.dist<35?'Right there, '+c.dir+'. Act natural.':'Saw one '+c.dir+', maybe '+Math.round(c.dist/10)*10+' metres off.';
  return {line:near,reaction:'nod',end:false,cop:true};
 }
 if(option==='pitch'){
  if(!(ctx.packs>0))return {line:'Got nothing to show me anyway.',reaction:'shrug',end:false};
  const base={keen:.75,chatty:.45,wary:.2,grumpy:.08}[mood],heat=Math.max(0,Math.min(100,ctx.heat||0));
  if(r()<base*(1-heat/200))return {line:pick(PITCH_YES,r),reaction:'nod',end:true,buy:true};
  const snitchChance=ctx.tutorial?0:mood==='grumpy'?.35:mood==='wary'?.25:.05;
  if(r()<snitchChance)return {line:pick(PITCH_SNITCH,r),reaction:'recoil',end:true,snitch:true};
  return {line:pick(PITCH_NO,r)+(ctx.contact&&mood!=='grumpy'?' Try '+ctx.contact+', they\'re always after a sweet fix.':''),reaction:'shake',end:false,tip:!!ctx.contact};
 }
 return {line:pick(BYE,r),reaction:'wave',end:true};
}
// Gesture offsets for a rigged person (radians / metres), t seconds since it started.
export const GESTURE_TIME=Object.freeze({nod:1.1,laugh:1.4,shrug:1,shake:1.2,recoil:.9,wave:1.8,talk:2.4});
export function gestureOffsets(kind,t){
 const out={headX:0,headY:0,headZ:0,shoulder:0,lean:0,bob:0,clip:null};const dur=GESTURE_TIME[kind];
 if(!dur||!(t>=0)||t>dur)return out;const env=Math.min(1,t*5)*Math.min(1,(dur-t)*5),bump=Math.sin(Math.PI*t/dur);
 if(kind==='nod')out.headX=.32*Math.sin(t*10)*env;
 else if(kind==='shake')out.headY=.42*Math.sin(t*12)*env;
 else if(kind==='laugh'){out.headX=-.28*env;out.bob=.035*Math.abs(Math.sin(t*15))*env;out.shoulder=.12*Math.abs(Math.sin(t*15))*env;}
 else if(kind==='shrug'){out.shoulder=.42*bump;out.headZ=.14*bump;}
 else if(kind==='recoil'){out.lean=-.2*bump;out.headX=-.22*bump;}
 else if(kind==='wave'){out.clip='Wave';out.headZ=.08*env;}
 else if(kind==='talk'){out.headX=.06*Math.sin(t*7)*env;out.headY=.05*Math.sin(t*3.1)*env;}
 return out;
}
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function talkPanelHTML({name,mood,line,options=[],portrait=''}){
 return '<div class="talk-card"><div class="talk-face">'+(portrait?'<img alt="" src="'+escape(portrait)+'">':'')+'</div><div class="talk-body"><b>'+escape(name)+'</b><small>'+escape(mood)+'</small><p>'+escape(line)+'</p><ol class="talk-options">'+
  options.map((o,i)=>'<li><button data-talk="'+escape(o.id)+'"'+(o.disabled?' disabled':'')+'><span class="key">'+(i+1)+'</span>'+escape(o.label)+'</button></li>').join('')+'</ol></div></div>';
}
// Fallback portrait (no WebGL): a flat face from the crowd palette.
export function drawPortrait(cx,palette={},size=128){
 if(!cx)return false;const hex=n=>'#'+(Number(n)>>>0).toString(16).padStart(6,'0');
 cx.fillStyle='#2b2f36';cx.fillRect(0,0,size,size);
 cx.fillStyle=hex(palette.outfit??0x4a6d96);cx.fillRect(size*.18,size*.72,size*.64,size*.3);
 cx.fillStyle=hex(palette.skin??0xd9a066);cx.beginPath();cx.ellipse(size/2,size*.46,size*.24,size*.28,0,0,Math.PI*2);cx.fill();
 cx.fillStyle=hex(palette.hair??0x3a2a1a);cx.beginPath();cx.ellipse(size/2,size*.28,size*.25,size*.13,0,Math.PI,Math.PI*2);cx.fill();
 cx.fillStyle='#1c1916';for(const s of [-1,1]){cx.beginPath();cx.arc(size/2+s*size*.09,size*.45,size*.025,0,Math.PI*2);cx.fill();}
 cx.fillRect(size*.44,size*.58,size*.12,size*.02);return true;
}
