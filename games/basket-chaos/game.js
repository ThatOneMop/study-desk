/* Original Study Desk sports. Shared by Basket, Volley and Soccer Chaos. */
(() => {
'use strict';
const sport=document.body.dataset.sport||'basket',canvas=document.querySelector('canvas'),ctx=canvas.getContext('2d');
const $=id=>document.getElementById(id),W=960,H=520,F=450,TAU=Math.PI*2;
const names={basket:'Basket Chaos',volley:'Volley Chaos',soccer:'Soccer Chaos'},verbs={basket:'Shoot',volley:'Hit',soccer:'Kick'};
const colors=['#82d0dd','#f5ac83'],keys=new Set(),pressed=new Set();
/* Shared modifiers for volley/soccer (unchanged surface). */
const mods=[{name:'CLASSIC COURT',g:1,r:17,bounce:.68,speed:1,note:'An honest ball. A fresh chance.'},{name:'MOON BALL',g:.64,r:18,bounce:.77,speed:1,note:'Low gravity. Give every shot room.'},{name:'HEAVY DUTY',g:1.2,r:24,bounce:.5,speed:.92,note:'A big ball with a heavy landing.'},{name:'QUICK FEET',g:1,r:15,bounce:.78,speed:1.25,note:'Faster feet, smaller ball.'},{name:'SUPER SPRING',g:.9,r:19,bounce:.88,speed:1,note:'Bouncy ball. Stay on your toes.'}];
/* Basket per-round mutations: shared physics plus hoop height and drifting rims. */
const mutations=[
{name:'CLASSIC COURT',g:1,r:17,bounce:.68,speed:1,hoopY:245,drift:0,note:'An honest ball. A fresh chance.'},
{name:'MOON BALL',g:.6,r:18,bounce:.78,speed:1,hoopY:245,drift:0,note:'Low gravity. Give every shot room.'},
{name:'HEAVY DUTY',g:1.25,r:24,bounce:.5,speed:.92,hoopY:245,drift:0,note:'A big ball with a heavy landing.'},
{name:'QUICK FEET',g:1,r:15,bounce:.8,speed:1.3,hoopY:245,drift:0,note:'Faster feet, smaller ball.'},
{name:'SUPER SPRING',g:.9,r:19,bounce:.9,speed:1,hoopY:245,drift:0,note:'Bouncy ball. Stay on your toes.'},
{name:'SKY HOOPS',g:1,r:17,bounce:.68,speed:1,hoopY:150,drift:0,note:'The rims climb sky-high. Aim up.'},
{name:'LOW RIM',g:1,r:19,bounce:.66,speed:1,hoopY:305,drift:0,note:'Droopy rims. Easy buckets?'},
{name:'DRIFTING HOOPS',g:.85,r:17,bounce:.76,speed:1,hoopY:245,drift:72,note:'The hoops will not sit still.'},
{name:'HEAVY AIR',g:1.5,r:18,bounce:.56,speed:.95,hoopY:245,drift:0,note:'Thick air. Jump high, fall fast.'}];
const TARGET_WINS=3; /* best of five rounds */
let mode='solo',phase='menu',paused=false,score=[0,0],round=0,mod=mutations[0],players=[],ball={},possession=-1,last=0,elapsed=0,pointTimer=0,notice='',particles=[],confetti=[],lastScorer=0,trail=[],possessionTime=0,rally=0,lastTouch=-1;
let countdown=0,hitStop=0,popups=[],rimShake=[0,0];
let record={wins:0,best:0,rally:0};try{record={...record,...JSON.parse(localStorage.getItem(`study-desk.${sport}-chaos.v1`)||'{}')}}catch{}
let volume=1;try{const v=Number(localStorage.getItem('study-desk.chaos.volume'));if(isFinite(v)&&v>=0)volume=Math.min(1,v)}catch{}
function records(){ $('records').textContent=`${record.wins} solo wins · best margin +${record.best} · longest rally ${record.rally}`; }
function save(){try{localStorage.setItem(`study-desk.${sport}-chaos.v1`,JSON.stringify(record))}catch{$('storage').textContent='This browser could not save your record. You can keep playing.'}}
/* --- WebAudio: synth crowd, swish, thud and countdown (no files). --- */
let actx=null,murmurSrc=null,murmurGain=null;
function audio(){if(actx)return actx;try{const C=window.AudioContext||window.webkitAudioContext;actx=C?new C():null}catch{actx=null}return actx}
function tone(freq,dur,type,gain,slideTo){const a=audio();if(!a||volume<=0)return;try{const t=a.currentTime,o=a.createOscillator(),g=a.createGain();o.type=type||'sine';o.frequency.setValueAtTime(freq,t);if(slideTo)o.frequency.exponentialRampToValueAtTime(Math.max(1,slideTo),t+dur);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(gain*volume,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g).connect(a.destination);o.start(t);o.stop(t+dur+.03)}catch{}}
function noise(dur,gain,freq){const a=audio();if(!a||volume<=0)return;try{const n=Math.max(1,Math.floor(a.sampleRate*dur)),buf=a.createBuffer(1,n,a.sampleRate),d=buf.getChannelData(0);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*(1-i/n);const s=a.createBufferSource();s.buffer=buf;const g=a.createGain();g.gain.value=gain*volume;let node=s;if(freq){const f=a.createBiquadFilter();f.type='bandpass';f.frequency.value=freq;s.connect(f);node=f}node.connect(g).connect(a.destination);s.start()}catch{}}
function swish(){noise(.16,.18,2400);tone(900,.16,'sine',.07,1500)}
function thud(v){tone(130,.12,'sine',.12*(v||1),60)}
function beep(f){tone(f||660,.11,'square',.1)}
function cheer(){noise(.9,.22,900);tone(523,.5,'triangle',.11,784);tone(659,.6,'triangle',.09,988)}
function groan(){tone(320,.7,'sawtooth',.11,130);noise(.5,.1,320)}
function murmur(on){const a=audio();if(!a)return;if(on){if(murmurSrc)return;try{const n=a.sampleRate*2,buf=a.createBuffer(1,n,a.sampleRate),d=buf.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;murmurSrc=a.createBufferSource();murmurSrc.buffer=buf;murmurSrc.loop=true;murmurGain=a.createGain();murmurGain.gain.value=0;const f=a.createBiquadFilter();f.type='bandpass';f.frequency.value=520;f.Q.value=.6;murmurSrc.connect(f).connect(murmurGain).connect(a.destination);murmurSrc.start();murmurGain.gain.linearRampToValueAtTime(.06*volume,a.currentTime+1)}catch{}}else{if(!murmurSrc)return;try{murmurGain.gain.linearRampToValueAtTime(0,a.currentTime+.6);murmurSrc.stop(a.currentTime+.7)}catch{}murmurSrc=null;murmurGain=null}}
function setVolume(v){volume=Math.min(1,Math.max(0,Number(v)/100));if(!isFinite(volume))volume=1;try{localStorage.setItem('study-desk.chaos.volume',String(volume))}catch{}if(murmurGain)try{murmurGain.gain.value=.06*volume}catch{}}
function overlay(title,copy,button){$('overlayTitle').textContent=title;$('overlayText').textContent=copy;$('start').textContent=button;$('overlay').hidden=false;}
function hideOverlay(){$('overlay').hidden=true;canvas.focus();}
function hoopX(id){return (id?85:875)+(mod.drift?Math.sin(elapsed*1.1+id*Math.PI)*mod.drift:0);}
function hoopY(){return mod.hoopY||245;}
function newRound(){round++;mod=sport==='basket'?mutations[round===1?0:Math.floor(Math.random()*mutations.length)]:mods[round===1?0:Math.floor(Math.random()*mods.length)];
 players=[0,1].map(id=>({id,x:id?710:250,y:F,vx:0,vy:0,ground:true,cool:0,flash:0,squash:0,dir:id?-1:1}));
 possession=-1;possessionTime=0;rally=0;lastTouch=-1;trail=[];popups=[];rimShake=[0,0];hitStop=0;
 ball={x:W/2,y:sport==='basket'?140:180,vx:0,vy:0,r:mod.r,noCatch:0,noHit:0,held:sport==='basket'};
 if(sport!=='basket'){ball.vx=(lastScorer?1:-1)*75;ball.vy=-65;}
 if(sport==='volley'){ball.x=lastScorer?720:240;ball.y=190;ball.vx=lastScorer?-125:125;ball.vy=0;}
 countdown=sport==='basket'?3:0;
 notice=mod.note;$('message').textContent=notice;}
function newMatch(){score=[0,0];round=0;elapsed=0;particles=[];confetti=[];popups=[];paused=false;phase='play';lastScorer=0;hitStop=0;murmur(false);newRound();$('pause').textContent='Pause';hideOverlay();$('mode').disabled=true;try{audio()?.resume?.()}catch{}}
function setPaused(value){if(!['play','point'].includes(phase))return;paused=value;$('pause').textContent=value?'Resume':'Pause';keys.clear();pressed.clear();if(value){murmur(false);overlay('Take a breather.','The court will be right here.','Resume match');}else{if(score[0]===TARGET_WINS-1||score[1]===TARGET_WINS-1)murmur(true);hideOverlay();}}
$('start').onclick=()=>{if(paused)setPaused(false);else newMatch()};$('pause').onclick=()=>setPaused(!paused);$('restart').onclick=()=>{phase='menu';paused=false;murmur(false);keys.clear();pressed.clear();$('mode').disabled=false;$('pause').textContent='Pause';overlay('A clean scoreboard.','Choose solo or two players, then step onto the court.','Start new match')};
$('mode').onchange=e=>{mode=e.target.value;document.querySelectorAll('[data-p2]').forEach(e=>e.hidden=mode!=='duo');};
window.addEventListener('keydown',e=>{if(e.target.matches('select,input,textarea'))return;if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space'].includes(e.code))e.preventDefault();if(e.code==='Escape'){if(!e.repeat)setPaused(!paused);return;}if(!keys.has(e.code))pressed.add(e.code);keys.add(e.code);try{audio()?.resume?.()}catch{}});
window.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',()=>{keys.clear();pressed.clear();setPaused(true)});document.addEventListener('visibilitychange',()=>{if(document.hidden)setPaused(true)});
for(const b of document.querySelectorAll('[data-key]')){b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);keys.add(b.dataset.key);pressed.add(b.dataset.key);canvas.focus();try{audio()?.resume?.()}catch{}});for(const event of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(event,()=>keys.delete(b.dataset.key));}
const volEl=$('volume');if(volEl){volEl.value=Math.round(volume*100);volEl.addEventListener('input',e=>setVolume(e.target.value));}
function burst(x,y,color,n=10){for(let i=0;i<n;i++)particles.push({x,y,vx:(Math.random()-.5)*260,vy:-Math.random()*220,life:.45+Math.random()*.35,color});}
function award(id){if(phase!=='play')return;score[id]++;lastScorer=id;hitStop=.13;const hx=hoopX(id),hy=hoopY();burst(hx,hy+8,colors[id],26);rimShake[id]=1;popups.push({x:hx,y:hy-16,text:'+1',life:1.1,vy:-64,color:colors[id]});swish();
 const who=id===0?'BLUE':mode==='solo'?'CPU':'CORAL';notice=`${who} SCORES`;
 if(score[id]>=TARGET_WINS){phase='over';$('mode').disabled=false;murmur(false);cheer();
  if(mode==='solo'&&id===0){record.wins++;record.best=Math.max(record.best,score[0]-score[1]);save();records();}
  overlay(id===0?'Blue takes the match.':mode==='solo'?'The CPU takes this one.':'Coral takes the match.',`${score[0]} – ${score[1]} in round ${round}. ${mode==='solo'&&id===0?'Solo victory saved.':'A rematch is one click away.'}`,'Play again');
  for(let i=0;i<70;i++)confetti.push({x:Math.random()*W,y:-Math.random()*H,vx:(Math.random()-.5)*80,vy:80+Math.random()*180,color:i%2?colors[id]:'#d5ee80',a:Math.random()*6});
 }else{phase='point';pointTimer=1.5;if(score[id]===TARGET_WINS-1){murmur(true);notice=`${who} — MATCH POINT`;}else{murmur(false);}}
 $('message').textContent=`${notice} · Blue ${score[0]} – ${score[1]} ${mode==='solo'?'CPU':'Coral'} · round ${round} of 5.`;}
function botIntent(p){const me=p.id,opp=players[0],myHoop=hoopX(me),theirHoop=hoopX(0);let target,left=false,right=false,jump=false,hit=false;
 if(possession===me){target=myHoop+(me?150:-150);if(Math.abs(p.x-target)<46&&p.cool<=0)hit=true;if(possessionTime>9.2&&p.cool<=0)hit=true;}
 else if(possession===0){target=Math.min(Math.max(opp.x+55,theirHoop-230),theirHoop-40);if(Math.abs(opp.x-p.x)<70&&p.cool<=0)hit=true;const near=Math.abs(ball.x-p.x)<80;if(p.ground&&near&&ball.y<p.y-60&&ball.y>p.y-210)jump=true;}
 else{const t=Math.max(.15,Math.min(1,(p.y-ball.y)/380));target=Math.max(60,Math.min(W-60,ball.x+ball.vx*t));const near=Math.abs(ball.x-p.x)<95;if(p.ground&&near&&ball.y<p.y-40&&ball.y>p.y-230)jump=true;if(p.ground&&Math.abs(ball.x-p.x)<72&&ball.y>p.y-40)hit=true;}
 left=p.x>target+9;right=p.x<target-9;return{left,right,jump,hit};}
function controls(p,dt){let left=false,right=false,jump=false,hit=false;
 if(p.id===1&&mode==='solo'){const c=botIntent(p);left=c.left;right=c.right;jump=c.jump;hit=c.hit;}
 else{const id=p.id;left=keys.has(id?'ArrowLeft':'KeyA');right=keys.has(id?'ArrowRight':'KeyD');jump=pressed.has(id?'ArrowUp':'KeyW');hit=pressed.has(id?'Enter':'Space')||pressed.has(id?'KeyL':'KeyX');}
 if(countdown>0){left=false;right=false;jump=false;hit=false;}
 p.vx=(Number(right)-Number(left))*250*mod.speed;if(p.vx)p.dir=Math.sign(p.vx);
 if(jump&&p.ground){p.vy=sport==='volley'?-620:-510;p.ground=false;burst(p.x,F,'#ccd4d3',5)}
 if(hit&&p.cool<=0){p.cool=.34;p.flash=.2;if(p.ground){p.vy=-420;p.ground=false;}action(p);}}
function touch(id){if(lastTouch!==id){rally++;lastTouch=id;if(rally>record.rally){record.rally=rally;save();records();}}}
function action(p){const low=p.low||keys.has(p.id?'ArrowDown':'KeyS');const dx=ball.x-p.x,dy=ball.y-(p.y-40),near=Math.hypot(dx,dy)<110+ball.r;
 if(sport==='basket'){
  if(possession===p.id){const tx=hoopX(p.id),ty=hoopY(),gravity=950*mod.g,time=Math.max(.9,Math.abs(tx-p.x)/390);touch(p.id);possession=-1;possessionTime=0;ball.held=false;ball.x=p.x+p.dir*23;ball.y=p.y-72;ball.vx=(tx-ball.x)/time+(Math.random()-.5)*13;ball.vy=(ty-ball.y)/time-.5*gravity*time;ball.noCatch=.32;ball.noHit=.15;burst(ball.x,ball.y,colors[p.id],9);thud(.6);}
  else if(possession>=0){const holder=players[possession];if(holder.id!==p.id&&Math.abs(holder.x-p.x)<46){possession=-1;possessionTime=0;ball.held=false;ball.x=holder.x-holder.dir*30;ball.y=holder.y-70;ball.vx=-holder.dir*150;ball.vy=-210;ball.noCatch=.5;ball.noHit=.12;burst(ball.x,ball.y,colors[p.id],10);thud(.8);}
   else if(near&&(ball.noCatch||0)<=0){possession=p.id;possessionTime=0;ball.held=false;touch(p.id);burst(ball.x,ball.y,colors[p.id],6);}}
  else if(near&&(ball.noCatch||0)<=0){possession=p.id;possessionTime=0;ball.held=false;touch(p.id);burst(ball.x,ball.y,colors[p.id],6);}
 }
 else if(near){touch(p.id);const toward=p.id?-1:1;
  if(sport==='volley'){ball.vx=toward*(290+Math.random()*55);ball.vy=(low&&p.y<F-45)||p.y<F-45&&ball.y>p.y-75?160:-560;ball.x=p.x+toward*35;}
  else{ball.vx=toward*(590+Math.abs(p.vx)*.4);ball.vy=low?-65:p.y<F-45?-140:-340;ball.x=p.x+toward*(ball.r+25);}
  ball.y=Math.min(ball.y,p.y-30);ball.noHit=.12;burst(ball.x,ball.y,colors[p.id],10);}}
function collidePlayer(p){if(ball.noHit>0||possession>=0)return;const cx=p.x,cy=p.y-31,rx=22,ry=29;let dx=ball.x-cx,dy=ball.y-cy;const nx=Math.max(-rx,Math.min(rx,dx)),ny=Math.max(-ry,Math.min(ry,dy)),ex=dx-nx,ey=dy-ny,dist=Math.hypot(ex,ey);if(dist<ball.r){if(sport==='basket'&&ball.noCatch<=0){possession=p.id;possessionTime=0;ball.held=false;touch(p.id);return;}let ux=dist?ex/dist:0,uy=dist?ey/dist:-1;ball.x+=ux*(ball.r-dist+1);ball.y+=uy*(ball.r-dist+1);if(sport==='volley'){touch(p.id);const toward=p.id?-1:1;ball.vx=toward*(200+Math.abs(ball.vx)*.35);ball.vy=-430;}else{const dot=ball.vx*ux+ball.vy*uy;ball.vx-=1.5*dot*ux;ball.vy-=1.5*dot*uy;ball.vx+=p.vx*.65;ball.vy=Math.min(ball.vy,-90);}burst(ball.x,ball.y,colors[p.id],3);}}
function step(dt){if(paused)return;if(hitStop>0){hitStop-=dt;return;}
 for(const q of particles){q.life-=dt;q.x+=q.vx*dt;q.y+=q.vy*dt;q.vy+=500*dt}particles=particles.filter(q=>q.life>0);
 for(const q of confetti){q.x+=q.vx*dt;q.y+=q.vy*dt;q.a+=dt*2;if(q.y>H)q.y=-20;}
 for(const q of popups){q.life-=dt;q.y+=q.vy*dt}popups=popups.filter(q=>q.life>0);
 if(phase==='point'){pointTimer-=dt;if(pointTimer<=0){phase='play';newRound();}return;}
 if(phase!=='play')return;
 elapsed+=dt;
 if(countdown>0){countdown-=dt;if(countdown<=0){countdown=0;if(ball.held){ball.held=false;ball.vy=-150;ball.vx=(Math.random()-.5)*140;}beep(880);}}
 rimShake=rimShake.map(v=>Math.max(0,v-dt*3));
 for(const p of players){p.cool=Math.max(0,p.cool-dt);p.flash=Math.max(0,p.flash-dt);p.squash=Math.max(0,p.squash-dt*4);controls(p,dt);p.vy+=1300*mod.g*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;let lo=32,hi=W-32;if(sport==='volley'){lo=p.id?515:30;hi=p.id?930:445;}p.x=Math.max(lo,Math.min(hi,p.x));if(p.y>=F){if(!p.ground&&p.vy>240){p.squash=Math.min(1,p.vy/1000);thud(.35);burst(p.x,F,'#c6d0d5',4);}p.y=F;p.vy=0;p.ground=true;}}
 if(sport!=='volley'){const a=players[0],b=players[1],dx=b.x-a.x;if(Math.abs(dx)<40&&Math.abs(a.y-b.y)<56){const sep=(40-Math.abs(dx))/2,dir=dx>=0?1:-1;a.x-=sep*dir;b.x+=sep*dir;}}
 if(sport==='basket'&&possession>=0){possessionTime+=dt;if(possessionTime>=12){const owner=players[possession];ball.held=false;ball.x=owner.x-owner.dir*45;ball.y=owner.y-80;ball.vx=-owner.dir*160;ball.vy=-220;ball.noCatch=.6;ball.noHit=.15;possession=-1;possessionTime=0;$('message').textContent='Shot clock! The ball is loose — take your chance.';}}
 if(possession>=0){const p=players[possession];ball.held=false;ball.x=p.x+p.dir*23;ball.y=p.y-63+Math.sin(elapsed*11)*3;ball.vx=0;ball.vy=0;ball.noCatch=0;}
 else if(ball.held){ball.x=W/2;ball.y=140;ball.vx=0;ball.vy=0;}
 else{ball.noCatch=Math.max(0,(ball.noCatch||0)-dt);ball.noHit=Math.max(0,(ball.noHit||0)-dt);const oldY=ball.y;ball.vy+=950*mod.g*dt;ball.x+=ball.vx*dt;ball.y+=ball.vy*dt;ball.vx*=Math.pow(.998,dt*60);if(ball.y<100){ball.y=100;ball.vy=Math.abs(ball.vy)*.7;}
  if(sport==='basket'){const hy=hoopY();for(const id of [1,0]){const hx=hoopX(id);if(ball.vy>0&&oldY<=hy&&ball.y>=hy&&Math.abs(ball.x-hx)<27){award(id);return;}for(const rimX of [hx-33,hx+33]){const dx=ball.x-rimX,dy=ball.y-hy,d=Math.hypot(dx,dy);if(d<ball.r+4){const ux=dx/(d||1),uy=dy/(d||1),dot=ball.vx*ux+ball.vy*uy;ball.x=rimX+ux*(ball.r+4);ball.y=hy+uy*(ball.r+4);if(dot<0){ball.vx-=1.65*dot*ux;ball.vy-=1.65*dot*uy;rimShake[id]=Math.min(1,rimShake[id]+.7);thud(.3);}}}}}
  if(sport==='soccer'&&ball.y>338&&((ball.x<ball.r&&ball.vx<0)||(ball.x>W-ball.r&&ball.vx>0))){award(ball.x<W/2?1:0);return;}
  if(ball.x<ball.r){ball.x=ball.r;ball.vx=Math.abs(ball.vx)*.8;}if(ball.x>W-ball.r){ball.x=W-ball.r;ball.vx=-Math.abs(ball.vx)*.8;}if(ball.y+ball.r>F){if(sport==='volley'){award(ball.x<W/2?1:0);return;}ball.y=F-ball.r;if(Math.abs(ball.vy)>60){ball.vy=-Math.abs(ball.vy)*mod.bounce;burst(ball.x,F,'#c6d0d5',3);thud(.25);}else ball.vy=0;ball.vx*=.94;}
  if(sport==='volley'&&ball.y+ball.r>294&&Math.abs(ball.x-W/2)<8+ball.r){ball.x=ball.x<W/2?W/2-8-ball.r:W/2+8+ball.r;ball.vx*=-.65;if(oldY+ball.r<294){ball.y=294-ball.r;ball.vy=-Math.abs(ball.vy)*.7;}}
  for(const p of players)collidePlayer(p);}
 trail.push({x:ball.x,y:ball.y});if(trail.length>8)trail.shift();}
function rr(x,y,w,h,r,fill){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=fill;ctx.fill();}
function line(x,y,x2,y2,color,width=2){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x2,y2);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();}
function text(value,x,y,size,color,align='center',weight=600){ctx.font=`${weight} ${size}px system-ui`;ctx.textAlign=align;ctx.fillStyle=color;ctx.fillText(value,x,y);}
function drawPlayer(p){const x=p.x,y=p.y,run=Math.sin(elapsed*17)*Math.min(1,Math.abs(p.vx)/100),c=colors[p.id];ctx.save();ctx.translate(x,y);if(p.squash>0)ctx.scale(1+p.squash*.28,1-p.squash*.42);ctx.lineCap='round';line(-8,-19,-12+run*8,-2,'#142638',8);line(8,-19,12-run*8,-2,'#142638',8);rr(-18,-52,36,34,9,c);line(-18,-43,-27,-31-p.flash*100,c,8);line(18,-43,27,-31-p.flash*100,c,8);ctx.beginPath();ctx.arc(0,-65,16,0,TAU);ctx.fillStyle='#f3e1cb';ctx.fill();rr(-16,-77,32,8,4,p.id?'#b35646':'#386d87');ctx.fillStyle='#26354a';ctx.beginPath();ctx.arc(p.dir*6,-65,2,0,TAU);ctx.fill();text(p.id?(mode==='solo'?'CPU':'2'):'1',0,-29,16,'#183246');ctx.restore();}
function render(){ctx.clearRect(0,0,W,H);const bg=ctx.createLinearGradient(0,0,0,H);bg.addColorStop(0,sport==='soccer'?'#224b47':'#263f59');bg.addColorStop(1,sport==='soccer'?'#356f5a':'#355772');ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);ctx.fillStyle='#172c40';ctx.fillRect(0,0,W,98);text('BLUE',W/2-120,33,12,colors[0]);text(mode==='solo'?'CPU':'CORAL',W/2+120,33,12,colors[1]);text(score[0],W/2-120,77,37,'#faf6e7');text(score[1],W/2+120,77,37,'#faf6e7');text(sport==='basket'?'BEST OF 5 · FIRST TO 3':'FIRST TO 5',W/2,41,11,'#c5d3d9');const mp=sport==='basket'&&(score[0]===TARGET_WINS-1||score[1]===TARGET_WINS-1);text(sport==='basket'?(mp?'MATCH POINT':possession>=0?`${Math.ceil(12-possessionTime)}s TO SHOOT`:countdown>0?'TIP-OFF INCOMING':'RACE FOR THE BALL'):sport==='volley'?`RALLY ${rally}`:'•  •  •',W/2,66,12,mp?'#ffd0a0':'#c5d3d9');text(`ROUND ${Math.max(1,round)} / 5`,27,40,11,'#afc3ca','left');text(mod.name,27,64,13,'#d5ee80','left');text(sport==='basket'?'PICK UP → SHOOT':sport==='volley'?'KEEP IT OFF YOUR FLOOR':'GET IT IN THE GOAL',W-25,44,11,'#b9cdd4','right');
 for(let i=0;i<12;i++){ctx.globalAlpha=.08;rr(30+i*84,125,56,20,4,'#fff');ctx.globalAlpha=1;}ctx.fillStyle=sport==='soccer'?'#417d60':'#b89f78';ctx.fillRect(0,F,W,H-F);ctx.fillStyle=sport==='soccer'?'#83b38a':'#e4c49b';ctx.fillRect(0,F,W,5);ctx.strokeStyle='#edf0d745';ctx.lineWidth=2;
 if(sport==='soccer'){ctx.strokeRect(32,355,130,95);ctx.strokeRect(W-162,355,130,95);ctx.beginPath();ctx.ellipse(W/2,F,105,40,0,Math.PI,TAU);ctx.stroke();line(W/2,350,W/2,F,'#edf0d74a');for(const x of [0,W-24]){rr(x,338,24,112,3,'#e7ece0');for(let y=345;y<450;y+=13)line(x,y,x+24,y,'#729b8d',1);}line(0,337,32,337,'#faf6e7',6);line(W-32,337,W,337,'#faf6e7',6);}
 else if(sport==='volley'){line(W/2,294,W/2,F,'#e7e3ce',8);for(let y=302;y<F;y+=13)line(W/2-5,y,W/2+5,y,'#667f8d',2);ctx.beginPath();ctx.ellipse(240,F,150,30,0,Math.PI,TAU);ctx.stroke();ctx.beginPath();ctx.ellipse(720,F,150,30,0,Math.PI,TAU);ctx.stroke();}
 else{const hy=hoopY(),dy=hy-245;for(const [id,x0] of [[0,875],[1,85]]){const x=hoopX(id),dir=x<W/2?-1:1,shk=rimShake[id]*Math.sin(elapsed*55)*3;line(x+dir*43,196+dy,x+dir*43,F,'#b4cbd3',7);rr(x+dir*43-5,177+dy,10,82,3,'#e5eeea');line(x-33,hy+shk,x+33,hy+shk,'#ef9a70',6);for(let i=-25;i<=25;i+=12)line(x+i,hy+5+shk,x+i*.7,hy+34+shk,'#ecf0dd77',1.5);line(x-18,hy+34+shk,x+18,hy+34+shk,'#ecf0dd77',1.5);ctx.beginPath();ctx.ellipse(x,F,110,40,0,Math.PI,TAU);ctx.stroke();}line(W/2,F-36,W/2,F,'#edf0d74a');}
 if(players.length){for(const p of players){ctx.fillStyle='#14253635';ctx.beginPath();ctx.ellipse(p.x,F+5,26,6,0,0,TAU);ctx.fill();}for(const p of players)drawPlayer(p);for(let i=0;i<trail.length;i++){const q=trail[i];ctx.globalAlpha=i/trail.length*.2;ctx.beginPath();ctx.arc(q.x,q.y,ball.r*.62,0,TAU);ctx.fillStyle='#ffe7ae';ctx.fill();}ctx.globalAlpha=1;ctx.save();ctx.translate(ball.x,ball.y);ctx.rotate(ball.x*.014);ctx.beginPath();ctx.arc(0,0,ball.r,0,TAU);ctx.fillStyle=sport==='basket'?'#efab69':sport==='volley'?'#f3ead5':'#edf1df';ctx.fill();ctx.strokeStyle=sport==='basket'?'#9b593b':sport==='volley'?'#739db6':'#2c4c53';ctx.lineWidth=2;ctx.stroke();if(sport==='soccer'){ctx.beginPath();for(let i=0;i<5;i++){const a=i*TAU/5;ctx.lineTo(Math.cos(a)*7,Math.sin(a)*7)}ctx.closePath();ctx.fillStyle='#294b53';ctx.fill();}else{ctx.beginPath();ctx.ellipse(0,0,ball.r*.45,ball.r,0,0,TAU);ctx.stroke();line(-ball.r,0,ball.r,0,ctx.strokeStyle,2);}ctx.restore();}
 for(const q of particles){ctx.globalAlpha=Math.max(0,q.life*1.8);rr(q.x,q.y,4,4,2,q.color)}ctx.globalAlpha=1;for(const q of confetti){ctx.save();ctx.translate(q.x,q.y);ctx.rotate(q.a);ctx.fillStyle=q.color;ctx.fillRect(-3,-5,6,10);ctx.restore();}
 for(const q of popups){ctx.globalAlpha=Math.min(1,q.life*1.4);text(q.text,q.x,q.y,24,q.color,'center',800);}ctx.globalAlpha=1;
 if(sport==='basket'&&countdown>0){rr(W/2-236,116,472,58,12,'#15283ee8');text(`ROUND ${round} · ${mod.name}`,W/2,146,16,'#d5ee80');ctx.globalAlpha=.9;text(String(Math.ceil(countdown)),W/2,300,120,'#f7f4e7','center',800);ctx.globalAlpha=1;}
 if(phase==='point'){rr(W/2-170,150,340,70,12,'#15283ee8');text(notice,W/2,195,25,'#f7f4e7');}
 text(`←  ${sport==='volley'?'YOUR HALF':'BLUE ATTACKS RIGHT'}${mode==='duo'?'     •     CORAL ATTACKS LEFT  →':''}`,W/2,495,11,'#142c3b');}
function frame(t){const dt=Math.min(.032,(t-last)/1000||0);last=t;step(dt);pressed.clear();render();requestAnimationFrame(frame)}
function snapshot(){return{sport,phase,paused,score:[...score],round,roundWins:[...score],targetWins:TARGET_WINS,countdown,hitStop,players:players.map(p=>({...p})),ball:{...ball},possession,record:{...record},modifier:mod.name,mutation:mod.name,hoopY:hoopY(),possessionTime,rally,volume};}
if(window.__STUDY_DESK_TEST__)window.ChaosSportsTest={snapshot,start:newMatch,step,action:id=>action(players[id]),setBall:q=>{possession=-1;ball.held=false;Object.assign(ball,q);},setPlayer:(id,q)=>Object.assign(players[id],q),setPossession:id=>{possession=id;}};
window.BCHAOS={snapshot,start:newMatch,startBot:()=>{mode='solo';$('mode').value='solo';newMatch();},simulateShot:(id=0)=>action(players[id]),forceScore:(id=0)=>{if(phase!=='play')phase='play';award(id);},step,setBall:q=>{possession=-1;ball.held=false;Object.assign(ball,q);},setPlayer:(id,q)=>Object.assign(players[id],q),setPossession:id=>{possession=id;},setScore:(a,b)=>{score[0]=a;score[1]=b;},setPhase:p=>{phase=p;},mutations:mutations.map(m=>m.name),hoopX,hoopY};
records();requestAnimationFrame(frame);
})();
