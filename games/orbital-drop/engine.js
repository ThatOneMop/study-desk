/* Original Study Desk game. No third-party assets or dependencies. */
(function(root){
'use strict';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
function create(difficulty=1){return {phase:'playing',time:0,missionTime:240,difficulty,hero:{x:480,y:460,hp:100,shield:50,hit:0,regen:0,dash:0,blast:0},terminals:[{x:165,y:155,charge:0},{x:790,y:190,charge:0},{x:720,y:470,charge:0}],enemies:[],shots:[],particles:[],pings:[],kills:0,xp:0,level:1,power:1,rate:1,speed:1,perk:0,fire:0,spawn:0,extract:0,wave:1,shake:0,message:'Stay near each relay to recover its data.',events:[]};}
function emit(s,x,y,color,count=8){for(let i=0;i<count;i++){const a=Math.random()*Math.PI*2,v=40+Math.random()*130;s.particles.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:.3+Math.random()*.3,color});}}
function detonate(s,e){emit(s,e.x,e.y,'#ffb066',30);s.pings.push({x:e.x,y:e.y,life:.55,color:'#ffb066'});if(distance(s.hero,e)<74)damage(s,24);s.shake=Math.max(s.shake,1.3);e.hp=0;}
function upgrade(s,type){if(s.phase!=='playing'||s.perk<1||!['power','rate','speed'].includes(type))return false;s[type]+=type==='power'?.3:.18;s.perk--;s.hero.hp=Math.min(100,s.hero.hp+20);return true;}
function step(s,dt,input={}){
if(s.phase!=='playing')return;s.events=[];dt=clamp(dt,0,.04);s.time+=dt;s.missionTime-=dt;const h=s.hero;
h.dash=Math.max(0,h.dash-dt);h.blast=Math.max(0,h.blast-dt);h.hit=Math.max(0,h.hit-dt);h.regen=Math.max(0,h.regen-dt);
s.shake=Math.max(0,s.shake-dt*3);
let dx=input.x||0,dy=input.y||0,l=Math.hypot(dx,dy);if(l>1){dx/=l;dy/=l;}
if(input.dash&&h.dash===0&&(dx||dy)){h.x=clamp(h.x+dx*125,20,940);h.y=clamp(h.y+dy*125,20,580);h.dash=4;h.hit=.4;emit(s,h.x,h.y,'#8bf3ff',20);}
h.x=clamp(h.x+dx*180*s.speed*dt,18,942);h.y=clamp(h.y+dy*180*s.speed*dt,18,582);
if(h.regen===0)h.shield=Math.min(50,h.shield+6*dt);
if(input.blast&&h.blast===0){h.blast=12;s.events.push('blast');emit(s,h.x,h.y,'#ffc37e',45);s.pings.push({x:h.x,y:h.y,life:.6,color:'#ffc37e'});for(const e of s.enemies)if(distance(h,e)<170)e.hp-=100*s.power;}
s.spawn-=dt;if(s.spawn<=0){const wave=1+Math.floor(s.time/22);s.wave=wave;s.spawn=Math.max(.22,.7-s.time*.0025)/s.difficulty;const side=Math.floor(Math.random()*4),r=Math.random(),roll=Math.random();let type='drone',hp=Math.random()<.18?110:48;if(wave>=2&&roll<.16+wave*.015){type='spitter';hp=64;}else if(wave>=2&&roll>.86-wave*.008){type='exploder';hp=40;}s.enemies.push({x:side===0?0:side===1?960:r*960,y:side===2?0:side===3?600:r*600,hp,speed:65+Math.random()*25+s.time*.1,type,cooldown:2,flash:0});}
s.fire-=dt;let target=null;for(const e of s.enemies)if(e.hp>0&&(!target||distance(h,e)<distance(h,target)))target=e;
if(s.fire<=0&&((input.aim&&input.firing)||(target&&distance(h,target)<410))){s.fire=.24/s.rate;let a=input.aim&&input.firing?Math.atan2(input.aim.y-h.y,input.aim.x-h.x):Math.atan2(target.y-h.y,target.x-h.x);s.shots.push({x:h.x,y:h.y,vx:Math.cos(a)*560,vy:Math.sin(a)*560,life:.85,damage:22*s.power,enemy:false});}
for(const e of s.enemies){if(e.hp<=0)continue;e.flash=Math.max(0,(e.flash||0)-dt);const d=distance(h,e),a=Math.atan2(h.y-e.y,h.x-e.x);if(e.type!=='spitter'||d>230){e.x+=Math.cos(a)*e.speed*dt;e.y+=Math.sin(a)*e.speed*dt;}e.cooldown-=dt;if(e.type==='spitter'&&e.cooldown<=0&&d<420){e.cooldown=2.5;s.shots.push({x:e.x,y:e.y,vx:Math.cos(a)*140,vy:Math.sin(a)*140,life:4,damage:12,enemy:true});}if(e.type==='exploder'&&d<34){detonate(s,e);continue;}if(d<25&&h.hit===0){damage(s,15);e.x-=Math.cos(a)*24;e.y-=Math.sin(a)*24;}}
for(const b of s.shots){b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt;if(b.enemy){if(distance(h,b)<17){if(h.hit===0)damage(s,b.damage);b.life=0;}}else for(const e of s.enemies){if(e.hp>0&&distance(e,b)<18){e.hp-=b.damage;e.flash=.14;b.life=0;emit(s,b.x,b.y,'#c1ffb0',3);break;}}}
s.shots=s.shots.filter(b=>b.life>0);s.enemies=s.enemies.filter(e=>{if(e.hp>0)return true;s.kills++;s.xp++;emit(s,e.x,e.y,'#c1ffb0',e.type==='exploder'?18:8);return false;});
for(const t of s.terminals)if(t.charge<8&&distance(h,t)<65){t.charge=Math.min(8,t.charge+dt);if(t.charge===8){h.hp=Math.min(100,h.hp+18);h.shield=Math.min(50,h.shield+20);s.xp+=4;s.events.push('relay');s.message='Relay secured: +18 hull, +20 shield and 4 field XP.';emit(s,t.x,t.y,'#8bf3ff',24);s.pings.push({x:t.x,y:t.y,life:1,color:'#8bf3ff'});}}
while(s.xp>=8+s.level*4){s.xp-=8+s.level*4;s.level++;s.perk++;s.message='Field promotion: choose an upgrade.';}
const done=s.terminals.filter(t=>t.charge>=8).length;
if(done===3){s.message='All data secured. Hold the landing zone to extract.';if(distance(h,{x:480,y:460})<85){if(s.extract===0)s.pings.push({x:480,y:460,life:1.2,color:'#b9f5c8'});s.extract+=dt;if(s.extract>=18){s.phase='won';s.message='Extraction complete. You made it home.';}}}
if(s.missionTime<=0){s.phase='lost';s.message='Mission clock expired — you never reached the extraction window.';}
if(h.hp<=0){s.phase='lost';s.message='Signal lost. Try a different route and use your shockwave.';}
for(const p of s.particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;}s.particles=s.particles.filter(p=>p.life>0);
for(const p of s.pings)p.life-=dt;s.pings=s.pings.filter(p=>p.life>0);
}
function damage(s,n){const h=s.hero,shield=Math.min(h.shield,n);h.shield-=shield;h.hp-=n-shield;h.hit=.6;h.regen=3;s.shake=Math.max(s.shake,1);emit(s,h.x,h.y,'#ff8590');}
const api={create,step,upgrade,distance,clamp};if(typeof module!=='undefined')module.exports=api;root.Orbital=api;
})(typeof window!=='undefined'?window:globalThis);
