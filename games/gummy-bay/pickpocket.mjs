// Cartoon pocket pinch. Crouch behind someone, press E, and stop a needle on
// a green patch. Three rounds, each a little quicker and a little thinner.
// Original code. No new assets. Family-friendly on purpose: coins, a baggie,
// a squashed donut, or a jar from the pantry. Nobody is hurt.
export const PICK_ROUNDS=3;
export const PICK_RANGE=1.65;
export const PICK_BEHIND=-0.45;
export const PICK_COOLDOWN=150;
export const PICK_COOLDOWN_FAIL=220;
const WIDTHS=[0.26,0.16,0.10];
const SPEEDS=[0.85,1.25,1.7];

const clamp01=roll=>{
 const r=Number.isFinite(roll)?roll:0;
 return Math.max(0,Math.min(0.999999,r));
};
export function gameMinute(day=1,time=0){
 const d=Number.isFinite(day)?day:1,t=Number.isFinite(time)?time:0;
 return (d-1)*1440+t;
}
export function behindScore(person,player){
 if(!person||!player)return 1;
 const dx=player.x-person.x,dz=player.z-person.z,dist=Math.hypot(dx,dz);
 if(!(dist>0))return 1;
 const yaw=Number.isFinite(person.yaw)?person.yaw:0;
 return (dx*Math.sin(yaw)+dz*Math.cos(yaw))/dist;
}
export function behindPeople(people,player){
 const hits=[];
 for(const person of people||[]){
  if(!person||!Number.isFinite(person.x)||!Number.isFinite(person.z))continue;
  const distance=Math.hypot(player.x-person.x,player.z-person.z);
  if(distance<0.4||distance>PICK_RANGE)continue;
  const dot=behindScore(person,player);
  if(dot>PICK_BEHIND)continue;
  hits.push({...person,distance,dot});
 }
 hits.sort((a,b)=>a.distance-b.distance);
 return hits;
}
export function cooldownLeft(book,id,minute){
 const until=book&&typeof book==='object'?book[id]:undefined;
 if(!Number.isFinite(until)||!Number.isFinite(minute))return 0;
 return Math.max(0,until-minute);
}
export function markCooldown(book,id,minute,span=PICK_COOLDOWN){
 const next=book&&typeof book==='object'&&!Array.isArray(book)?{...book}:{};
 const at=Number.isFinite(minute)?minute:0;
 const wait=Number.isFinite(span)?Math.max(0,span):PICK_COOLDOWN;
 next[id]=at+wait;
 return next;
}
export function sneakTarget(people,player,{crouched=false,minute=0,cooldowns=null}={}){
 if(!crouched||!player)return null;
 for(const person of behindPeople(people,player)){
  if(cooldownLeft(cooldowns,person.id,minute)>0)continue;
  return person;
 }
 return null;
}
export function coolingTarget(people,player,{crouched=false,minute=0,cooldowns=null}={}){
 if(!crouched||!player)return null;
 for(const person of behindPeople(people,player)){
  const left=cooldownLeft(cooldowns,person.id,minute);
  if(left>0)return {...person,left};
 }
 return null;
}
export function makeRound(index=0,roll=0){
 const i=Math.max(0,Math.min(PICK_ROUNDS-1,index|0));
 const width=WIDTHS[i],speed=SPEEDS[i],r=clamp01(roll);
 const start=0.06+r*(1-width-0.12);
 return {index:i,width,start,end:start+width,speed};
}
export function needlePos(time=0,speed=1){
 const span=Math.max(0.2,Number.isFinite(speed)?speed:1);
 const t=Number.isFinite(time)?Math.max(0,time):0;
 const u=((t*span)%2+2)%2;
 return u<=1?u:2-u;
}
export function hitZone(zone,pos){
 if(!zone||!Number.isFinite(pos))return false;
 return pos>=zone.start&&pos<=zone.end;
}
export function freshAttempt(target,roll=0){
 return {id:target?.id??'',round:0,zone:makeRound(0,roll),t:0,done:false,ok:false};
}
export function advanceAttempt(attempt,dt){
 if(!attempt||attempt.done)return attempt;
 const step=Number.isFinite(dt)?Math.max(0,dt):0;
 return {...attempt,t:attempt.t+step};
}
export function stopAttempt(attempt,roll=0){
 if(!attempt||attempt.done)return attempt;
 const pos=needlePos(attempt.t,attempt.zone.speed);
 if(!hitZone(attempt.zone,pos))return {...attempt,done:true,ok:false,pos};
 if(attempt.round>=PICK_ROUNDS-1)return {...attempt,done:true,ok:true,pos};
 const round=attempt.round+1;
 return {...attempt,round,zone:makeRound(round,roll),t:0,done:false,ok:false,pos};
}
export function rollLoot(roll=0,ingredientCount=4){
 const r=clamp01(roll),n=Math.max(1,ingredientCount|0);
 if(r>=0.9){
  const span=Math.max(1,Math.ceil(n/2));
  const index=Math.max(0,Math.min(n-1,(n-span)+Math.floor(((r-0.9)/0.1)*span)));
  return {kind:'ingredient',rare:true,index,qty:1};
 }
 if(r>=0.78)return {kind:'item',item:'donut',qty:1};
 if(r>=0.62)return {kind:'item',item:'wrapper',qty:1};
 return {kind:'cash',cash:4+Math.floor(r/0.62*11)};
}
export function failOutcome(roll=1){
 const r=clamp01(roll);
 const call=r<0.38;
 const heat=r<0.72?(call?18:10):0;
 return {shout:true,relation:-16,heat,call};
}
export function applyRelation(current,delta){
 const base=Number.isFinite(current)?current:0,extra=Number.isFinite(delta)?delta:0;
 return Math.max(0,Math.min(100,base+extra));
}
export function applyHeat(current,add){
 const base=Number.isFinite(current)?current:0,extra=Number.isFinite(add)?add:0;
 return Math.max(0,Math.min(100,base+extra));
}
export const SHOUTS=Object.freeze([
 'HEY! That pocket is mine!',
 'Oi! Hands to yourself!',
 'Whoa! Personal space!',
 'Excuse you! Those are my coins!'
]);
export function shoutLine(roll=0){return SHOUTS[Math.floor(clamp01(roll)*SHOUTS.length)%SHOUTS.length];}
export function lootLine(loot,name=''){
 if(!loot)return 'Nothing but lint.';
 if(loot.kind==='cash')return 'Pocket change. They never noticed.';
 if(loot.kind==='item'&&loot.item==='donut')return 'A squashed donut, still in its bag.';
 if(loot.kind==='item')return 'A spare gummy baggie.';
 if(loot.kind==='ingredient')return 'A little jar of '+(name||'flavouring')+'. Quiet jackpot.';
 return 'Nothing but lint.';
}
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function pickPromptHTML(name){
 return '<span class="key">E</span>Pinch '+escape(name)+'\'s pocket<small>Crouched behind them</small>';
}
export function pickBarHTML({name='',round=0,rounds=PICK_ROUNDS,pos=0,zone={start:0,width:0.2}}={}){
 const left=(Math.max(0,Math.min(1,zone.start||0))*100).toFixed(2);
 const width=(Math.max(0,zone.width||0)*100).toFixed(2);
 const needle=(Math.max(0,Math.min(1,pos))*100).toFixed(2);
 return '<div class="pick-card" role="dialog" aria-label="Pocket pinch"><p>Pinch '+escape(name)+'\'s pocket · round '+(round+1)+'/'+rounds+'</p><div class="pick-track" aria-hidden="true"><i class="pick-zone" style="left:'+left+'%;width:'+width+'%"></i><b class="pick-needle" style="left:'+needle+'%"></b></div><small>Press E to stop the needle on the green</small></div>';
}
