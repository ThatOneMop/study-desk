(()=>{
'use strict';
const A=window.Ashwake;
const $=id=>document.getElementById(id);
const canvas=$('view'),ctx=canvas.getContext('2d');
const KEY=A.SAVE_KEY;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const STEPS=['Walk','Cinders','Relics','Dawn'];
const TUTORIAL=[
 ['Walk, and the light follows.','WASD or the arrow keys move you. On a touch screen, hold the move stick, or hold a point on the orchard and the warden walks that way. You do not aim.'],
 ['The lantern does the fighting.','Sparks seek the nearest moth. Roots are slower and thicker. Spore divers lunge. Your work is to keep walking so they do not pile onto the wick.'],
 ['Cinders are how you grow.','Glowing cinders drift in once a moth breaks. Fill the blue bar and the orchard offers three relics. Take one. Keys 1, 2 and 3 work, and so does a tap. Embers, the gold motes, are kept after the watch and buy relics that return next time.'],
 ['Stay until the bell.','The Bell Warden wakes as the clock passes 1:15. Quiet it and dawn pays extra embers. Falling on the path still keeps a smaller share. Esc, or the Pause button, saves your place. P is left for Study Desk.']
];
let meta=A.createMeta(),run=null,blocked=false,settled=false,gained=0,shown='',step=0,confirmFn=null;
let keys=new Set(),pointer={active:false,x:0,y:0},stickVec={active:false,x:0,y:0},stickId=null;
const particles=[],numbers=[];
let shake=0,flash=0,acc=0,last=0,achieveCarry=0,saveCarry=0,toastUntil=0;
const scenery=A.scenery(7);
const audio=createAudio();

function setText(id,text){const n=$(id);if(n.textContent!==text)n.textContent=text;}
function toast(text){if(!text)return;setText('toast',text);$('toast').hidden=false;toastUntil=performance.now()+2600;}
function announce(fresh){if(!fresh?.length)return;audio.mark();toast('Mark on the wick — '+fresh[fresh.length-1].name);}
function ask(title,copy,fn){confirmFn=fn;setText('confirmTitle',title);setText('confirmCopy',copy);$('confirm').showModal();}
function save(){
 if(blocked){setText('saveStatus','Unreadable archive protected. Replace it only when you mean to.');$('recover').hidden=false;return;}
 try{localStorage.setItem(KEY,A.encode({meta,run}));setText('saveStatus','Saved on this device.');}
 catch{setText('saveStatus','Progress is not saved: storage is unavailable.');}
}
function load(){
 try{
  const raw=localStorage.getItem(KEY);
  if(!raw)return;
  const decoded=A.decode(raw);
  if(!decoded.ok){blocked=true;return;}
  meta=decoded.meta;run=decoded.run;
  if(run&&run.phase==='play')A.pause(run);
 }catch{blocked=true;}
}
function soundLabel(){return meta.muted?'Sound off':'Sound on';}
function syncSound(){audio.muted=meta.muted;setText('soundTitle',soundLabel());setText('soundPause',soundLabel());}
function toggleSound(){meta.muted=!meta.muted;meta.lastPlayed=Date.now();syncSound();save();}
function begin(keeper){
 audio.unlock();
 const next=A.startRun(meta,keeper);
 if(!next){toast('That keeper is still locked.');return;}
 run=next;settled=false;gained=0;shown='';
 const earned=A.checkAchievements(meta,run,Date.now());
 meta=earned.meta;announce(earned.fresh);save();sync();canvas.focus();
}
function finish(){
 if(!run||settled||(run.phase!=='dead'&&run.phase!=='dawn'))return;
 const paid=A.bank(meta,run);
 if(paid.ok){meta=paid.meta;gained=paid.gained;}
 const earned=A.checkAchievements(meta,run,Date.now());
 meta=earned.meta;announce(earned.fresh);settled=true;save();
}
function openTutorial(){step=0;renderTutorial();if(run&&run.phase==='play')A.pause(run);$('tutorial').showModal();sync();}
function renderTutorial(){
 setText('tutorialTitle',STEPS[step]);
 setText('tutorialCopy',TUTORIAL[step][0]+' '+TUTORIAL[step][1]);
 setText('tutorialKeys','Keyboard: WASD or arrows, Esc to pause, 1–3 to choose. Touch: the stick or a held point on the orchard. The lantern fires either way.');
 setText('tutorialStep','Step '+(step+1)+' of '+STEPS.length);
 $('tutorialBack').disabled=step===0;
 setText('tutorialNext',step===STEPS.length-1?'Done':'Next');
}
function readInput(){
 let x=0,y=0;
 if(keys.has('a')||keys.has('arrowleft'))x-=1;
 if(keys.has('d')||keys.has('arrowright'))x+=1;
 if(keys.has('w')||keys.has('arrowup'))y-=1;
 if(keys.has('s')||keys.has('arrowdown'))y+=1;
 if(pointer.active){x+=pointer.x;y+=pointer.y;}
 if(stickVec.active){x+=stickVec.x;y+=stickVec.y;}
 return{x,y};
}
function viewOf(){return{w:Math.max(320,canvas.clientWidth||960),h:Math.max(200,canvas.clientHeight||540)};}
function uiBlocks(){return !!document.querySelector('dialog[open]');}
function playing(){return run&&run.phase==='play'&&!settled&&!uiBlocks()&&!window.StudyBridge?.paused;}

function burst(x,y,color,n,speed){
 const count=reduced?Math.min(3,n):n;
 for(let i=0;i<count;i++){const a=Math.random()*Math.PI*2,s=speed*(0.35+Math.random());particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:0.35+Math.random()*0.35,age:0,color,r:1.5+Math.random()*2.4});}
 if(particles.length>260)particles.splice(0,particles.length-260);
}
function floatText(x,y,text,color){numbers.push({x,y,text,color,life:0.7});if(numbers.length>40)numbers.shift();}
function takeEvents(list){
 for(const e of list||[]){
  if(e.type==='hit'){burst(e.x,e.y,e.kind==='warden'?'#ffd27a':'#ffe0b0',5,90);floatText(e.x,e.y-8,String(e.n),'#fff4d4');audio.play('hit');}
  else if(e.type==='kill'){burst(e.x,e.y,e.kind==='lantern'?'#ffb15a':e.kind==='root'?'#8d5a44':'#d7c4ef',e.quiet?4:10,140);if(!reduced)shake=Math.min(18,shake+(e.kind==='lantern'?7:e.kind==='warden'?12:2));}
  else if(e.type==='hurt'){flash=0.28;if(!reduced)shake=Math.min(18,shake+11);audio.play('hurt');}
  else if(e.type==='shot')audio.play('shot');
  else if(e.type==='gem')audio.play('gem');
  else if(e.type==='ember'){audio.play('gem');floatText(e.x,e.y,'ember','#ffd27a');}
  else if(e.type==='level'){if(!reduced)shake=Math.min(14,shake+5);audio.play('level');}
  else if(e.type==='boss'||e.type==='bossdead'){if(!reduced)shake=16;audio.play('boss');}
  else if(e.type==='dawn')audio.play('dawn');
  else if(e.type==='dead')audio.play('dead');
  else if(e.type==='pulse')audio.play('pulse');
 }
}

function resize(){
 const dpr=Math.min(2,devicePixelRatio||1),w=canvas.clientWidth,h=canvas.clientHeight;
 if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);}
}
function hash(x,y){let n=Math.imul(x|0,374761393)+Math.imul(y|0,668265263);n=(n^(n>>>13))>>>0;return n/4294967296;}
function roundRect(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}

function drawTree(tree){
 ctx.fillStyle='#1a120e';ctx.fillRect(tree.x-4,tree.y,8,tree.r*0.55);
 ctx.fillStyle=tree.kind==='spire'?'#14201a':'#1b2a20';
 ctx.beginPath();ctx.moveTo(tree.x,tree.y-tree.r*1.7);ctx.lineTo(tree.x+tree.r*0.7,tree.y+4);ctx.lineTo(tree.x-tree.r*0.62,tree.y+2);ctx.fill();
 ctx.fillStyle='#24362b';ctx.beginPath();ctx.moveTo(tree.x,tree.y-tree.r*1.15);ctx.lineTo(tree.x+tree.r*0.42,tree.y-tree.r*0.15);ctx.lineTo(tree.x-tree.r*0.38,tree.y-tree.r*0.2);ctx.fill();
}
function drawMoth(e,t){
 const flap=Math.sin(t*14+e.id)*0.55,gold=e.kind==='lantern';
 ctx.save();ctx.translate(e.x,e.y);ctx.rotate(Math.atan2(e.fy||1,e.fx||0));
 ctx.fillStyle=gold?'rgba(255,190,90,.35)':'rgba(190,170,230,.28)';
 ctx.beginPath();ctx.ellipse(-12,0,16,7+flap*6, -0.5,0,7);ctx.ellipse(12,0,16,7+flap*6,0.5,0,7);ctx.fill();
 ctx.fillStyle=gold?'#ffd18a':'#efe6ff';ctx.beginPath();ctx.ellipse(0,0,7,4,0,0,7);ctx.fill();
 ctx.strokeStyle='#2a1c18';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-2,-3);ctx.lineTo(-5,-10);ctx.moveTo(2,-3);ctx.lineTo(5,-10);ctx.stroke();
 ctx.restore();
}
function drawRoot(e){
 ctx.fillStyle='#4a3028';ctx.beginPath();ctx.arc(e.x,e.y,e.r,0,7);ctx.fill();
 ctx.fillStyle='#6a4636';ctx.beginPath();ctx.arc(e.x-5,e.y-2,e.r*0.55,0,7);ctx.arc(e.x+6,e.y+3,e.r*0.4,0,7);ctx.fill();
 ctx.fillStyle='#ffb15a';ctx.beginPath();ctx.arc(e.x+2,e.y-1,2.2,0,7);ctx.fill();
}
function drawDiver(e,t){
 ctx.fillStyle='rgba(150,220,190,.25)';ctx.beginPath();ctx.arc(e.x,e.y,e.r+4+Math.sin(t*8)*2,0,7);ctx.fill();
 ctx.fillStyle='#d7fff2';ctx.beginPath();ctx.arc(e.x,e.y,e.r*0.7,0,7);ctx.fill();
 ctx.fillStyle='#1c6a62';ctx.beginPath();ctx.arc(e.x,e.y,3,0,7);ctx.fill();
}
function drawWarden(e,t){
 ctx.save();ctx.translate(e.x,e.y);
 ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(0,30,28,8,0,0,7);ctx.fill();
 ctx.fillStyle='#2a241c';ctx.beginPath();ctx.moveTo(-28,-18);ctx.quadraticCurveTo(0,-58,28,-18);ctx.lineTo(34,18);ctx.quadraticCurveTo(0,34,-34,18);ctx.closePath();ctx.fill();
 ctx.strokeStyle='#ffb15a';ctx.globalAlpha=0.65+Math.sin(t*6)*0.2;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-6,-20);ctx.lineTo(0,8);ctx.lineTo(8,-6);ctx.stroke();ctx.globalAlpha=1;
 ctx.fillStyle='#f0d78c';ctx.beginPath();ctx.arc(Math.sin(t*3)*4,16,6,0,7);ctx.fill();
 ctx.fillStyle='#ff5a2a';ctx.fillRect(-10,-6,20,4);
 ctx.restore();
 const hp=Math.max(0,e.hp/e.max);
 ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillRect(e.x-30,e.y-62,60,6);
 ctx.fillStyle='#ffb15a';ctx.fillRect(e.x-30,e.y-62,60*hp,6);
}
function drawKeeper(p,t){
 const bob=p.moving?Math.sin(t*10)*2:0;
 ctx.save();ctx.translate(p.x,p.y+bob);
 ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(0,14,12,4,0,0,7);ctx.fill();
 ctx.fillStyle='#241820';ctx.beginPath();ctx.moveTo(0,-18);ctx.quadraticCurveTo(16,0,12,14);ctx.lineTo(-12,14);ctx.quadraticCurveTo(-16,0,0,-18);ctx.fill();
 ctx.fillStyle='#7a3048';ctx.fillRect(-3,-2,6,12);
 ctx.fillStyle='#f0d2b4';ctx.beginPath();ctx.arc(0,-12,5,0,7);ctx.fill();
 ctx.fillStyle='#1a1218';ctx.fillRect(-7,-18,14,4);ctx.fillRect(-3,-23,6,6);
 const lx=12,ly=1;
 ctx.strokeStyle='#c9a27a';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(4,-2);ctx.lineTo(lx,ly);ctx.stroke();
 ctx.fillStyle='#2a160e';ctx.fillRect(lx-5,ly-6,10,12);
 ctx.fillStyle='#fff1c9';ctx.beginPath();ctx.arc(lx,ly,3.4,0,7);ctx.fill();
 if(p.hurt>0){ctx.fillStyle='rgba(255,255,255,.7)';ctx.beginPath();ctx.arc(0,0,14,0,7);ctx.fill();}
 ctx.restore();
 const glow=ctx.createRadialGradient(p.x+12,p.y,8,p.x+12,p.y,150);
 glow.addColorStop(0,'rgba(255,196,110,.55)');glow.addColorStop(0.35,'rgba(255,140,60,.16)');glow.addColorStop(1,'rgba(255,120,40,0)');
 ctx.fillStyle=glow;ctx.beginPath();ctx.arc(p.x+12,p.y,150,0,7);ctx.fill();
}
function drawGem(g,t){
 ctx.save();ctx.translate(g.x,g.y);ctx.rotate(t*2);
 ctx.fillStyle=g.kind==='ember'?'#ffb15a':'#9ad7ff';
 ctx.beginPath();ctx.moveTo(0,-6);ctx.lineTo(4,0);ctx.lineTo(0,6);ctx.lineTo(-4,0);ctx.fill();
 ctx.restore();
}
function drawWorld(camX,camY,w,h,t,focus){
 ctx.fillStyle='#07060c';ctx.fillRect(0,0,w,h);
 const sky=ctx.createLinearGradient(0,0,0,h);sky.addColorStop(0,'#1a1230');sky.addColorStop(1,'#0c1214');ctx.fillStyle=sky;ctx.fillRect(0,0,w,h);
 ctx.fillStyle='#efe6c8';ctx.beginPath();ctx.arc(w*0.78,h*0.16,18,0,7);ctx.fill();
 ctx.fillStyle='rgba(255,236,190,.18)';ctx.beginPath();ctx.arc(w*0.78,h*0.16,40,0,7);ctx.fill();
 const sx=(Math.random()-0.5)*shake,sy=(Math.random()-0.5)*shake;
 ctx.save();ctx.translate(-camX+sx,-camY+sy);
 ctx.fillStyle='#17241e';ctx.fillRect(0,0,A.WORLD,A.WORLD);
 const tile=56,x0=Math.max(0,Math.floor(camX/tile)*tile),y0=Math.max(0,Math.floor(camY/tile)*tile);
 const x1=Math.min(A.WORLD,camX+w+tile),y1=Math.min(A.WORLD,camY+h+tile);
 for(let x=x0;x<x1;x+=tile)for(let y=y0;y<y1;y+=tile){
  const n=hash(x,y);if(n>0.72){ctx.strokeStyle=n>0.88?'#3d5a46':'#2a4034';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x+10,y+34);ctx.lineTo(x+14,y+22);ctx.moveTo(x+22,y+36);ctx.lineTo(x+20,y+24);ctx.stroke();}
 }
 for(const pond of scenery.ponds){if(pond.x<camX-80||pond.y<camY-80||pond.x>camX+w+80||pond.y>camY+h+80)continue;ctx.fillStyle='#1d3340';ctx.beginPath();ctx.ellipse(pond.x,pond.y,pond.rx,pond.ry,0,0,7);ctx.fill();ctx.fillStyle='rgba(255,220,170,.18)';ctx.beginPath();ctx.ellipse(pond.x-pond.rx*0.2,pond.y-pond.ry*0.2,pond.rx*0.35,pond.ry*0.2,0,0,7);ctx.fill();}
 ctx.strokeStyle='rgba(255,210,160,.25)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(A.WORLD/2,A.WORLD/2,78,0,7);ctx.stroke();
 for(const tree of scenery.trees){if(tree.x<camX-80||tree.y<camY-120||tree.x>camX+w+80||tree.y>camY+h+40)continue;drawTree(tree);}
 if(!focus){for(let i=0;i<7;i++){const m={id:i,x:A.WORLD/2+Math.sin(t*0.35+i)*300,y:A.WORLD/2+Math.cos(t*0.22+i*1.3)*190,fx:Math.cos(t+i),fy:Math.sin(t+i),kind:'mote'};drawMoth(m,t);}}
 ctx.restore();
}
function drawRun(w,h,t){
 const p=run.player,camX=p.x-w/2,camY=p.y-h/2;
 drawWorld(camX,camY,w,h,t,true);
 const sx=(Math.random()-0.5)*shake,sy=(Math.random()-0.5)*shake;
 ctx.save();ctx.translate(-camX+sx,-camY+sy);
 for(const g of run.gems)drawGem(g,t);
 for(const ring of run.rings){ctx.strokeStyle=`rgba(255,210,140,${ring.life})`;ctx.lineWidth=3;ctx.beginPath();ctx.arc(p.x,p.y,ring.r,0,7);ctx.stroke();}
 for(const b of run.bolts){ctx.fillStyle='#ff6a4a';ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,7);ctx.fill();}
 for(const e of run.enemies){if(e.kind==='root')drawRoot(e);else if(e.kind==='diver')drawDiver(e,t);else if(e.kind==='warden')drawWarden(e,t);else drawMoth(e,t);}
 for(const s of run.shots){ctx.strokeStyle=s.weapon==='thorn'?'#d2f0c2':'#fff1c4';ctx.lineWidth=s.weapon==='thorn'?2:3;ctx.beginPath();ctx.moveTo(s.x,s.y);ctx.lineTo(s.x-Math.cos(s.ang)*12,s.y-Math.sin(s.ang)*12);ctx.stroke();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(s.x,s.y,s.r*0.6,0,7);ctx.fill();}
 for(const o of (run.orbs||[])){ctx.fillStyle='#ffb15a';ctx.beginPath();ctx.arc(o.x,o.y,o.r,0,7);ctx.fill();ctx.fillStyle='#fff6d8';ctx.beginPath();ctx.arc(o.x,o.y,o.r*0.4,0,7);ctx.fill();}
 for(const part of particles){ctx.globalAlpha=Math.max(0,1-part.age/part.life);ctx.fillStyle=part.color;ctx.beginPath();ctx.arc(part.x,part.y,part.r,0,7);ctx.fill();ctx.globalAlpha=1;}
 drawKeeper(p,t);
 ctx.fillStyle='#fff4d4';ctx.font='12px ui-sans-serif,system-ui';ctx.textAlign='center';
 for(const n of numbers){ctx.globalAlpha=Math.max(0,n.life/0.7);ctx.fillStyle=n.color;ctx.fillText(n.text,n.x,n.y);ctx.globalAlpha=1;}
 ctx.restore();
 const vignette=ctx.createRadialGradient(w/2,h/2,w*0.2,w/2,h/2,w*0.72);
 vignette.addColorStop(0,'rgba(0,0,0,0)');vignette.addColorStop(1,p.hp/p.maxHp<0.3?'rgba(90,10,16,.55)':'rgba(0,0,0,.55)');
 ctx.fillStyle=vignette;ctx.fillRect(0,0,w,h);
 if(flash>0){ctx.fillStyle=`rgba(255,220,200,${flash})`;ctx.fillRect(0,0,w,h);}
}
function draw(now){
 resize();const w=canvas.clientWidth,h=canvas.clientHeight,t=now/1000;
 if(run)drawRun(w,h,t);else drawWorld(A.WORLD/2-w/2+Math.sin(t*0.15)*40,A.WORLD/2-h/2+Math.cos(t*0.12)*24,w,h,t,false);
}

function coach(){
 if(!run||meta.runs>0||run.player.level>=3||run.time>28)return'';
 if(run.time<6)return'Walk with WASD, arrows, the stick, or a held point. The lantern aims itself.';
 if(run.player.level<2)return'Cinders raise the blue bar. When it fills, choose one relic.';
 return'The Bell Warden wakes just after a minute. Dawn pays more than a fall.';
}
function sync(){
 const phase=run?.phase||'title';
 document.body.dataset.phase=phase;
 $('title').hidden=!!run;
 $('hud').hidden=!run;
 $('pauseBtn').hidden=!run||phase==='pause'||phase==='dead'||phase==='dawn';
 $('stick').hidden=!run||phase!=='play';
 $('level').hidden=phase!=='level';
 $('pause').hidden=phase!=='pause';
 $('result').hidden=!(settled&&run);
 setText('pauseBtn','Pause');
 if(run){
  const p=run.player;
  $('hpFill').style.width=(100*Math.max(0,p.hp)/p.maxHp)+'%';
  $('xpFill').style.width=(100*Math.min(1,p.xp/p.next))+'%';
  setText('hpText','Health '+Math.ceil(p.hp));
  setText('xpText','Cinders '+p.xp+' / '+p.next);
  setText('clock',A.clock(run.time));
  setText('kills',run.kills+' moths');
  setText('runEmbers',run.embers+' embers');
  setText('rank','Light '+p.level);
  setText('relics',run.weapons.map(w=>A.WEAPONS[w.id].name+' '+w.level).join(' · '));
  const tip=coach();$('coach').hidden=!tip;setText('coach',tip);
  const banner=run.banner&&run.banner.life>0?run.banner.text:'';$('banner').hidden=!banner;setText('banner',banner);
  const key=phase==='level'&&run.draft?run.draft.map(c=>c.kind+c.id+c.level).join('|'):'';
  if(phase==='level'&&key!==shown){
   shown=key;$('cards').replaceChildren();
   run.draft.forEach((card,i)=>{const b=document.createElement('button');b.type='button';const k=document.createElement('kbd');k.textContent=String(i+1);const name=document.createElement('b');name.textContent=card.name;const text=document.createElement('span');text.textContent=card.text;b.append(k,name,text);b.onclick=()=>pick(i);$('cards').append(b);});
   $('cards').querySelector('button')?.focus();
  }
  if(settled){
   const won=run.phase==='dawn';
   setText('resultEyebrow',won?'The bell goes quiet':'The wick gutters');
   setText('resultTitle',won?'Dawn, at last':'The path keeps you');
   setText('resultCopy',won?'You brought the lantern through the Bell Warden.':'The moths took the wick. What you already gathered still comes home.');
   setText('resultStats',A.clock(run.time)+' on the path · '+run.kills+' moths · light '+run.player.level+' · +'+gained+' embers');
  }
  setText('pauseCopy',phase==='pause'&&run.held==='level'?'The offer is waiting. Resume to choose a relic.':'Your place on the path is saved on this device.');
 }
 const mins=Math.floor(meta.playTime/60),secs=Math.floor(meta.playTime%60);
 setText('playtime','On the path · '+mins+'m '+String(secs).padStart(2,'0')+'s');
 setText('record',meta.runs?meta.clears+' dawns · best '+A.clock(meta.bestTime)+' · best '+meta.bestKills+' moths':'No finished watch yet.');
 setText('purse',meta.embers+' embers kept');
 $('beginWick').hidden=!meta.unlocks.wickling;
 syncSound();
 const shopKey=[meta.embers,meta.runs,!!run,...A.UNLOCKS.map(item=>meta.unlocks[item.id])].join(':');
 if(shopKey!==sync.shopKey){sync.shopKey=shopKey;$('shop').replaceChildren();
 for(const item of A.UNLOCKS){
  const b=document.createElement('button');b.type='button';
  const owned=meta.unlocks[item.id];
  b.disabled=owned||meta.embers<item.cost||!!run;
  const name=document.createElement('b');name.textContent=owned?item.name+' — kept':item.name+' — '+item.cost+' embers';
  const small=document.createElement('small');small.textContent=item.text;b.append(name,small);
  b.onclick=()=>{const bought=A.purchase(meta,item.id);if(!bought.ok){toast(bought.reason);return;}meta=bought.meta;const earned=A.checkAchievements(meta,null,Date.now());meta=earned.meta;announce(earned.fresh);save();sync();};
  $('shop').append(b);
 }}
 const markKey=A.ACHIEVEMENTS.map(mark=>meta.achievements[mark.id]?1:0).join('');
 if(markKey!==sync.markKey){sync.markKey=markKey;$('achievements').replaceChildren();
 for(const mark of A.ACHIEVEMENTS){const li=document.createElement('li');li.textContent=(meta.achievements[mark.id]?'◆ ':'○ ')+mark.name+' — '+mark.detail;li.className=meta.achievements[mark.id]?'earned':'';$('achievements').append(li);}}
 if(performance.now()>toastUntil)$('toast').hidden=true;
}
function pick(index){if(!run||run.phase!=='level')return;const chosen=A.choose(run,index);if(!chosen.ok){toast(chosen.reason);return;}audio.play('pick');shown='';save();sync();}

function frame(now){
 const dt=Math.min(0.05,last? (now-last)/1000 : 0);last=now;
 if(window.StudyBridge?.paused&&run&&(run.phase==='play'||run.phase==='level')){A.pause(run);save();}
 if(playing()){
  acc+=dt;let steps=0;const events=[];
  while(acc>=A.STEP&&steps<5&&run.phase==='play'){A.tick(run,readInput(),viewOf());if(run.events)events.push(...run.events);acc-=A.STEP;steps++;}
  if(steps===5)acc=0;takeEvents(events);finish();
 }
 if(run&&(run.phase==='play'||run.phase==='level')&&!settled){
  A.addTime(meta,dt,Date.now());achieveCarry+=dt;saveCarry+=dt;
  if(achieveCarry>1){achieveCarry=0;const earned=A.checkAchievements(meta,run,Date.now());if(earned.fresh.length||earned.meta!==meta){meta=earned.meta;announce(earned.fresh);}}
  if(saveCarry>5){saveCarry=0;save();}
 }
 if(!reduced)shake=Math.max(0,shake-28*dt);else shake=0;flash=Math.max(0,flash-dt);
 for(const part of particles){part.age+=dt;part.x+=part.vx*dt;part.y+=part.vy*dt;part.vy+=20*dt;}
 for(let i=particles.length-1;i>=0;i--)if(particles[i].age>=particles[i].life)particles.splice(i,1);
 for(const n of numbers){n.life-=dt;n.y-=18*dt;}
 for(let i=numbers.length-1;i>=0;i--)if(numbers[i].life<=0)numbers.splice(i,1);
 if(run?.phase==='play'&&run.player?.moving&&!reduced&&Math.random()<0.4)burst(run.player.x,run.player.y+10,'#6a5a48',1,20);
 draw(now);sync();
 requestAnimationFrame(frame);
}

function createAudio(){
 let ctx=null,lastShot=0,lastGem=0;const bus={muted:false};
 function ac(){const C=window.AudioContext||window.webkitAudioContext;if(!C||bus.muted)return null;if(!ctx)ctx=new C();if(ctx.state==='suspended')ctx.resume();return ctx;}
 function tone(freq,dur,type,peak){const c=ac();if(!c)return;const t=c.currentTime,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(freq,t);g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+0.01);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+dur+0.02);}
 function noise(dur,peak){const c=ac();if(!c)return;const t=c.currentTime,n=c.createBuffer(1,Math.max(1,c.sampleRate*dur|0),c.sampleRate),d=n.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;const s=c.createBufferSource(),g=c.createGain();s.buffer=n;g.gain.setValueAtTime(peak,t);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);s.connect(g);g.connect(c.destination);s.start(t);}
 bus.unlock=()=>ac();
 bus.play=type=>{
  if(bus.muted)return;const now=performance.now();
  if(type==='shot'){if(now-lastShot<90)return;lastShot=now;tone(680,0.045,'square',0.025);}
  else if(type==='hit')noise(0.04,0.03);
  else if(type==='hurt')tone(98,0.18,'sawtooth',0.05);
  else if(type==='gem'){if(now-lastGem<70)return;lastGem=now;tone(880,0.06,'sine',0.035);}
  else if(type==='level'){tone(523,0.1,'triangle',0.05);setTimeout(()=>tone(659,0.12,'triangle',0.05),80);setTimeout(()=>tone(784,0.16,'triangle',0.05),160);}
  else if(type==='pick')tone(740,0.08,'triangle',0.04);
  else if(type==='pulse')tone(180,0.16,'sine',0.05);
  else if(type==='boss')tone(82,0.4,'sawtooth',0.06);
  else if(type==='dead')tone(196,0.35,'triangle',0.05);
  else if(type==='dawn'){tone(523,0.18,'sine',0.05);setTimeout(()=>tone(659,0.18,'sine',0.05),120);setTimeout(()=>tone(784,0.28,'sine',0.055),240);}
 };
 bus.mark=()=>{tone(880,0.08,'triangle',0.04);setTimeout(()=>tone(1174,0.12,'triangle',0.04),90);};
 return bus;
}

function pointerVector(e){
 const r=canvas.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,dx=e.clientX-cx,dy=e.clientY-cy;
 const m=Math.hypot(dx,dy)||1,scale=Math.min(1,m/80);pointer.x=dx/m*scale;pointer.y=dy/m*scale;
}
$('begin').onclick=()=>begin('warden');
$('beginWick').onclick=()=>begin('wickling');
$('openTutorial').onclick=openTutorial;
$('tutorialPause').onclick=openTutorial;
$('tutorialClose').onclick=()=>$('tutorial').close();
$('tutorialBack').onclick=()=>{step=Math.max(0,step-1);renderTutorial();};
$('tutorialNext').onclick=()=>{if(step<STEPS.length-1){step++;renderTutorial();}else $('tutorial').close();};
$('soundTitle').onclick=toggleSound;
$('soundPause').onclick=toggleSound;
$('pauseBtn').onclick=()=>{if(run&&(run.phase==='play'||run.phase==='level')){A.pause(run);save();sync();$('resume').focus();}};
$('resume').onclick=()=>{if(run){A.resume(run);sync();canvas.focus();}};
$('abandon').onclick=()=>ask('Abandon this watch?','Embers from this walk are lost. Relics you already kept stay in the archive.',()=>{run=null;settled=false;save();sync();});
$('again').onclick=()=>{const keeper=run?.keeper||'warden';run=null;begin(keeper);};
$('toTitle').onclick=()=>{run=null;settled=false;sync();};
$('reset').onclick=()=>ask('Start a new archive?','This erases Ashwake embers, marks, play time and the open watch on this device. Other Study Desk saves stay.',()=>{meta=A.createMeta();run=null;blocked=false;settled=false;$('recover').hidden=true;save();sync();});
$('recover').onclick=()=>ask('Replace the unreadable archive?','Only Ashwake’s save is replaced. Other games are left alone.',()=>{blocked=false;$('recover').hidden=true;save();sync();});
$('confirmNo').onclick=()=>{$('confirm').close();confirmFn=null;};
$('confirmYes').onclick=()=>{const fn=confirmFn;confirmFn=null;$('confirm').close();fn?.();};
document.addEventListener('keydown',e=>{
 if(e.target.closest?.('input,textarea,select')||e.metaKey||e.ctrlKey||e.altKey)return;
 if(uiBlocks()&&e.key!=='Escape')return;
 const key=e.key.toLowerCase();
 if(key==='escape'){e.preventDefault();if($('tutorial').open){$('tutorial').close();return;}if($('confirm').open){$('confirm').close();return;}if(!run)return;if(run.phase==='pause')A.resume(run);else if(run.phase==='play'||run.phase==='level')A.pause(run);save();sync();return;}
 if(!run&&(key==='enter')&&e.target===document.body){begin('warden');return;}
 if(run?.phase==='level'&&!e.repeat&&['1','2','3'].includes(key)){e.preventDefault();pick(Number(key)-1);return;}
 if(key==='m'&&!e.repeat){toggleSound();return;}
 if(playing()&&['a','d','w','s','arrowleft','arrowright','arrowup','arrowdown'].includes(key)){e.preventDefault();keys.add(key);}
});
document.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
window.addEventListener('blur',()=>{keys.clear();pointer.active=false;stickVec.active=false;if(run&&(run.phase==='play'||run.phase==='level')){A.pause(run);save();sync();}});
window.addEventListener('pagehide',save);
document.addEventListener('visibilitychange',()=>{if(document.hidden&&run&&(run.phase==='play'||run.phase==='level')){A.pause(run);save();sync();}});
canvas.addEventListener('pointerdown',e=>{if(e.button>0||!playing())return;pointer.active=true;pointerVector(e);canvas.setPointerCapture?.(e.pointerId);audio.unlock();});
canvas.addEventListener('pointermove',e=>{if(pointer.active)pointerVector(e);});
canvas.addEventListener('pointerup',()=>{pointer.active=false;});
canvas.addEventListener('pointercancel',()=>{pointer.active=false;});
canvas.addEventListener('contextmenu',e=>e.preventDefault());
const stick=$('stick');
function moveStick(e){const r=stick.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),m=Math.hypot(dx,dy)||1,limit=42,s=Math.min(limit,m);stickVec.active=true;stickVec.x=(dx/m)*(s/limit);stickVec.y=(dy/m)*(s/limit);$('nub').style.transform=`translate(${dx/m*s}px,${dy/m*s}px)`;}
stick.addEventListener('pointerdown',e=>{e.preventDefault();if(!playing())return;stickId=e.pointerId;stick.setPointerCapture?.(e.pointerId);moveStick(e);audio.unlock();});
stick.addEventListener('pointermove',e=>{if(e.pointerId===stickId)moveStick(e);});
function endStick(e){if(e.pointerId!==stickId)return;stickId=null;stickVec.active=false;$('nub').style.transform='';}
stick.addEventListener('pointerup',endStick);stick.addEventListener('pointercancel',endStick);
document.addEventListener('pointerdown',()=>audio.unlock(),{once:true});

load();syncSound();if(blocked)$('recover').hidden=false;sync();document.body.dataset.ready='yes';requestAnimationFrame(frame);
})();
