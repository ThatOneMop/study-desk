'use strict';
const canvas=document.querySelector('canvas'),$=s=>document.getElementById(s),MAX=5000;
let ctx=canvas.getContext('2d');
const biomes=['Back Garden','Amber Orchard','Copperwood','Fern Hollow','Cottage Lane','Silver Birch','Maple Meadow','Mossy Ruins','Lakeside','Harvest Fields','Cedar Valley','Rosewood','Frosted Grove','Sunset Park','Wildwood','Golden Hills','Moonlit Glade','Scarlet Woods','Ancient Oaks','Autumn Sanctuary'];
const saveStore=AutumnSaves.create({getItem:key=>localStorage.getItem(key),setItem:(key,value)=>localStorage.setItem(key,value),removeItem:key=>localStorage.removeItem(key)});
let save=saveStore.load(),migrated=saveStore.migrated;
let W,H,scale,ox,oy,leaves=[],particles=[],running=false,down=false,completed=false,total=0,collected=0,clock=0,last=0,sound=false,audio,noise,lastRustle=0,toastTimer,lastPick=-10,pointer={x:600,y:400},hover=null,mode='best';
const palette=['#d48b37','#e8b64b','#b44c29','#d56932','#f2c960','#8e4830','#d99c55'];
const fmt=n=>Math.floor(n).toLocaleString();function rand(a,b){return a+Math.random()*(b-a)}
function rng(seed){return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296}}
function areaName(a){return biomes[a%20]+' · '+(Math.floor(a/20)+1)}
function areaCount(a){return Math.min(900,65+Math.floor(a*1.8))}
function health(a){return 1+Math.floor(a*.7)}
function value(a){return 1+Math.floor(a*.8)}
function fee(a){return Math.ceil(24+Math.pow(a+1,1.32)*9)}
function cost(track,rank=save.ranks[track]){return Math.ceil([12,18,28,22][track]+Math.pow(rank+1,1.28)*[5,5,7,6][track])}
function toolName(rank=save.ranks[2]){return rank>=500?'Cyclone collector':rank>=100?'Leaf vacuum':rank>=20?'Leaf grabber':rank>=5?'Garden rake':rank>=1?'Picking gloves':'Bare hand'}
function stats(){let [h,r,t,v]=save.ranks;return{power:1+h,reach:18+Math.log2(r+1)*7,amount:mode==='hand'?1:1+Math.floor(Math.sqrt(t)*1.8),value:1+v*.12,cooldown:Math.max(.045,.24/(1+Math.log2(t+1)*.32)),hold:mode!=='hand'&&t>=20}}
function currentGarden(){return {...save,garden:{area:save.area,leaves,collected,total,completed}}}
function saveStatus(){
 const messages={ready:'Autosaving on this device. Export a copy to keep it separately.',invalid:'The loaded save is invalid and has been preserved. This is a temporary garden; autosaving is paused. Download the loaded save before leaving.',conflict:'Another tab changed this save. Autosaving is paused to protect that copy. Export your current garden before reloading.',unavailable:'Saving is unavailable. Export your current garden before closing this tab.'};
 $('saveStatus').textContent=messages[saveStore.status];$('saveHint').textContent=saveStore.status==='ready'?'Autosaves on this device':'Saving paused — open Saves';$('exportLoaded').hidden=saveStore.originalRaw===null;
}
function persist(){saveStore.save(currentGarden());saveStatus()}
function downloadGarden(name,text){
 $('gardenJson').value=text;$('recoveryStatus').textContent='Download requested. If no file appears, copy the Garden JSON text below to keep this save.';
 try{const url=URL.createObjectURL(new Blob([text],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
 catch{toast('Download could not start. Keep this tab open and try again.')}
}
$('savesBtn').onclick=()=>{if($('intro').style.display!=='none')return;running=false;down=false;$('shop').style.display='none';$('complete').style.display='none';$('savesPanel').style.display='flex';saveStatus();focusPanel('savesPanel')};
$('exportGarden').onclick=()=>downloadGarden('autumn-drift-garden.json',JSON.stringify(currentGarden(),null,2));
$('exportLoaded').onclick=()=>{if(saveStore.originalRaw!==null)downloadGarden('autumn-drift-loaded-save.json',saveStore.originalRaw)};
$('exportPrevious').onclick=()=>{try{const text=saveStore.readBackup();if(text===null){$('recoveryStatus').textContent='No previous garden backup yet.';return}downloadGarden('autumn-drift-previous-save.json',text)}catch{$('recoveryStatus').textContent='The previous backup could not be read. Keep this tab open.'}};
$('closeSaves').onclick=()=>closePanels();
function resize(){canvas.width=innerWidth*devicePixelRatio;canvas.height=innerHeight*devicePixelRatio;W=innerWidth;H=innerHeight;scale=Math.min(W/1200,H/800);ox=(W-1200*scale)/2;oy=(H-800*scale)/2}addEventListener('resize',resize);resize();
function bin(){return{x:960,y:605,r:44}}
function loadGarden(restore=false){let r=rng(save.area*9157+save.clears*13+77);total=areaCount(save.area);collected=0;completed=false;leaves=[];particles=[];for(let i=0;i<total;i++){let a=r()*6.28,x=155+r()*880,y=225+r()*447;if((save.area%3)===1){x=220+(i%4)*210+Math.cos(a)*r()*80;y=420+Math.sin(a)*r()*185}leaves.push({id:i,x,y,a,s:9+r()*6,c:palette[(Math.floor(r()*7)+save.area)%7],hp:health(save.area),max:health(save.area),rare:r()<.035});}if(restore&&save.garden?.area===save.area){({leaves,collected,total,completed}=save.garden)}updateUI()}
function toast(msg){$('toast').textContent=msg;$('toast').style.opacity=1;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').style.opacity=0,2300)}
function updateUI(){let s=stats();$('money').textContent=fmt(save.money);$('day').textContent=`AREA ${save.area+1} / 5,000 · ${areaName(save.area).toUpperCase()}`;$('progress').style.width=collected/total*100+'%';$('instruction').textContent=`${collected} / ${total} picked · ${s.hold?'Hold to collect':'Click a leaf to pick it up'} · ${mode==='hand'?'Bare hand':toolName()}`;$('travelBtn').textContent=collected/total>=.85&&save.area===save.unlocked?'Next area →':'Areas';$('toolBtn').textContent=mode==='hand'?'Hand':toolName();$('tally').textContent=`${fmt(save.ranks.reduce((a,b)=>a+b,0))} / 20,000 upgrades`}
function pick(){if(!running||completed)return;let s=stats();if(clock-lastPick<s.cooldown)return;let targets=leaves.map(l=>({l,d:Math.hypot(l.x-pointer.x,l.y-pointer.y)})).filter(o=>o.d<s.reach+o.l.s).sort((a,b)=>a.d-b.d).slice(0,s.amount);if(!targets.length)return;lastPick=clock;rustle();for(let {l} of targets){l.hp-=s.power;if(l.hp>0)continue;leaves.splice(leaves.indexOf(l),1);collected++;save.picked++;let gain=Math.ceil(value(save.area)*s.value*(l.rare?5:1));save.money+=gain;for(let j=0;j<3;j++)particles.push({x:l.x,y:l.y,vx:rand(-30,30),vy:rand(-70,-30),life:1,c:l.c});if(l.rare)toast('Golden leaf! +'+fmt(gain)+' acorns')}if(!leaves.length){completed=true;let bonus=areaCount(save.area)*value(save.area);save.money+=bonus;chime();toast('Garden cleared! +'+fmt(bonus)+' bonus · Open Areas to continue')}updateUI();persist()}
function pos(e){return{x:(e.clientX-ox)/scale,y:(e.clientY-oy)/scale}}
canvas.onpointerdown=e=>{if(!running)return;pointer=pos(e);down=true;canvas.setPointerCapture(e.pointerId);if(sound)soundInit();pick()};canvas.onpointermove=e=>pointer=pos(e);canvas.onpointerup=canvas.onpointercancel=()=>down=false;addEventListener('blur',()=>down=false);

// Keyboard picking uses the same pick(), cooldown, tools and rewards as a tap.
let keyboardLeaf=null;
function announceLeaf(){
 const l=leaves.find(item=>item.id===keyboardLeaf);
 $('leafStatus').textContent=!leaves.length?'Garden cleared. Open Areas to continue.':l?(l.rare?'Golden leaf ':'Leaf ')+(l.id+1)+'. '+Math.ceil(l.hp)+' health. '+leaves.length+' leaves remain.':'Use arrow keys to select a leaf.';
}
function selectLeaf(key){
 if(!leaves.length){keyboardLeaf=null;announceLeaf();return}
 let current=leaves.find(l=>l.id===keyboardLeaf)||leaves.reduce((a,b)=>Math.hypot(a.x-pointer.x,a.y-pointer.y)<=Math.hypot(b.x-pointer.x,b.y-pointer.y)?a:b);
 if(key==='Home')current=leaves[0];
 else if(key==='End')current=leaves[leaves.length-1];
 else if(key?.startsWith('Arrow')){
  const [vx,vy]={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[key];
  const candidates=leaves.filter(l=>(l.x-current.x)*vx+(l.y-current.y)*vy>1);
  const score=l=>{const dx=l.x-current.x,dy=l.y-current.y;return Math.hypot(dx,dy)+Math.abs(dx*vy-dy*vx)*2};
  if(candidates.length)current=candidates.reduce((a,b)=>score(a)<=score(b)?a:b);
 }
 keyboardLeaf=current.id;pointer={x:current.x,y:current.y};announceLeaf();
}
canvas.addEventListener('focus',()=>{if(running)selectLeaf()});
canvas.addEventListener('keydown',e=>{
 if(!running||e.ctrlKey||e.altKey||e.metaKey||e.isComposing)return;
 if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(e.key)){e.preventDefault();selectLeaf(e.key);return}
 if(e.key==='Enter'||e.code==='Space'||e.key===' '){
  e.preventDefault();if(e.repeat)return;
  selectLeaf();pick();selectLeaf();
 }
});

function panelButtons(id){return [...$(id).querySelectorAll('button:not(:disabled),input:not(:disabled),textarea:not(:disabled)')].filter(el=>!el.hidden&&el.type!=='file')}
function focusPanel(id){panelButtons(id)[0]?.focus()}
addEventListener('keydown',e=>{
 if(e.key!=='Tab')return;
 const id=$('intro').style.display!=='none'?'intro':['shop','complete','savesPanel'].find(id=>$(id).style.display==='flex');
 if(!id)return;
 const buttons=panelButtons(id),first=buttons[0],last=buttons[buttons.length-1],active=document.activeElement;
 if(!buttons.includes(active)||(e.shiftKey&&active===first)||(!e.shiftKey&&active===last)){e.preventDefault();(e.shiftKey?last:first)?.focus()}
});
function closePanels(){if($('intro').style.display!=='none')return;recovery.cancel();$('savesPanel').style.display='none';$('shop').style.display='none';$('complete').style.display='none';running=true;down=false;canvas.focus()}
$('start').onclick=()=>{$('intro').style.display='none';running=true;canvas.focus();if(migrated)toast('Your previous acorns have been carried over.')};$('sound').onclick=()=>{sound=!sound;$('sound').textContent=sound?'Sound on':'Sound off';if(sound)soundInit()};$('toolBtn').onclick=()=>{mode=mode==='hand'?'best':'hand';updateUI()};
const tracks=['Hand strength','Hand reach','Tools & equipment','Leaf appraisal'];
function effect(i,n){return i===0?`${1+n} picking power`:i===1?`${(18+Math.log2(n+1)*7).toFixed(1)} px reach`:i===2?`${toolName(n)} · ${1+Math.floor(Math.sqrt(n)*1.8)} leaves/action`:`×${(1+n*.12).toFixed(2)} leaf income`}
function buy(i){let n=save.ranks[i];if(n>=MAX||n>save.unlocked||save.money<cost(i))return false;save.money-=cost(i);save.ranks[i]++;persist();updateUI();return true}
function shop(){running=false;down=false;$('upgrades').innerHTML='';tracks.forEach((title,i)=>{let n=save.ranks[i],row=document.createElement('div');row.className='row';let text=document.createElement('div');text.innerHTML=`<b>${title} <small>${fmt(n)} / 5,000</small></b><small>${effect(i,n)}<br>Next: ${n===MAX?'Complete':effect(i,n+1)}</small>`;let btn=document.createElement('button');btn.textContent=n===MAX?'Maxed':n>save.unlocked?`Area ${n+1}`:fmt(cost(i))+' acorns';btn.disabled=n===MAX||n>save.unlocked||save.money<cost(i);btn.onclick=()=>{if(buy(i)){chime();shop()}};row.append(text,btn);$('upgrades').append(row)});$('shop').style.display='flex';focusPanel('shop')}
$('shopBtn').onclick=()=>{if($('intro').style.display==='none'){$('complete').style.display='none';shop()}};$('closeShop').onclick=closePanels;addEventListener('keydown',e=>{if(e.key==='Escape')closePanels()});
function canUnlock(){return save.area===save.unlocked&&save.unlocked<MAX-1&&collected/total>=.85&&save.money>=fee(save.area)}
function unlock(){if(!canUnlock())return false;save.money-=fee(save.area);save.unlocked++;save.area=save.unlocked;loadGarden();persist();closePanels();return true}
function travel(){running=false;down=false;$('shop').style.display='none';$('finishTitle').textContent='Beyond the gate.';$('finishText').textContent=`${fmt(save.unlocked+1)} / 5,000 areas unlocked. Clear 85% of your newest area and pay the gate fee to move on. Each area opens four new upgrade ranks. 20 biomes × 250 seeded variations.`;let info=$('gateInfo');info.textContent=save.unlocked===MAX-1?'All 5,000 areas unlocked!':save.area<save.unlocked?'Return to your furthest area to unlock the next gate.':`${Math.floor(collected/total*100)}% cleared / 85% needed · Gate: ${fmt(fee(save.area))} acorns`;$('next').textContent=save.area<save.unlocked?'Return to frontier →':save.unlocked===MAX-1?'All areas unlocked':`Unlock area ${save.unlocked+2} →`;$('next').disabled=save.area===save.unlocked&&!canUnlock();$('areaInput').max=save.unlocked+1;$('areaInput').value=save.area+1;$('complete').style.display='flex';focusPanel('complete')}
$('travelBtn').onclick=()=>{if($('intro').style.display==='none')travel()};$('next').onclick=()=>{if(save.area<save.unlocked){save.area=save.unlocked;loadGarden();persist();closePanels()}else unlock()};$('closeMap').onclick=closePanels;$('reseed').onclick=()=>{save.clears++;loadGarden();persist();closePanels();toast('A new fall of leaves. Earn more acorns here.')};$('visit').onclick=()=>{let a=Number($('areaInput').value)-1;if(!Number.isInteger(a)||a<0||a>save.unlocked){toast('Choose an unlocked area.');return}if(a!==save.area){save.area=a;loadGarden();persist()}closePanels()};
function soundInit(){if(!audio){audio=new (window.AudioContext||window.webkitAudioContext)();let buf=audio.createBuffer(1,audio.sampleRate*.15,audio.sampleRate),d=buf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1);noise=buf;}audio.resume()}
function rustle(){if(!sound||!audio||clock-lastRustle<.08)return;lastRustle=clock;let s=audio.createBufferSource(),f=audio.createBiquadFilter(),g=audio.createGain();s.buffer=noise;f.type='bandpass';f.frequency.value=900+Math.random()*1400;g.gain.setValueAtTime(.055,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.14);s.connect(f);f.connect(g);g.connect(audio.destination);s.start()}
function chime(){if(!sound||!audio)return;let o=audio.createOscillator(),g=audio.createGain();o.type='sine';o.frequency.setValueAtTime(660,audio.currentTime);o.frequency.exponentialRampToValueAtTime(990,audio.currentTime+.15);g.gain.setValueAtTime(.08,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.5);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+.5)}
function ellipse(x,y,rx,ry,color){ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill()}
function round(x,y,w,h,r,c){ctx.fillStyle=c;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill()}
function leaf(x,y,s,a,c){ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(-s,0);ctx.quadraticCurveTo(-s*.2,-s*.8,s,0);ctx.quadraticCurveTo(s*.2,s*.85,-s,0);ctx.fill();ctx.strokeStyle='#71442066';ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(-s-2,0);ctx.lineTo(s*.7,0);ctx.stroke();ctx.restore()}
const grass=Array.from({length:1500},()=>({x:rand(125,1080),y:rand(183,703),s:rand(1,3),a:Math.random()}));
function tree(x,y,r,color){ellipse(x+28,y+25,r*.95,r*.35,'#102d2333');ctx.strokeStyle='#675139';ctx.lineWidth=17;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-6,y-85);ctx.stroke();ellipse(x,y-85,r,r*.68,'#633d2933');for(let i=0;i<7;i++){let a=i*2.4;ellipse(x+Math.cos(a)*r*.38,y-95+Math.sin(a)*r*.26,r*.57,r*.44,color)}ellipse(x-17,y-112,r*.48,r*.32,'#f3bf4b55')}
function background(){ctx.fillStyle='#293d31';ctx.fillRect(0,0,1200,800);let g=ctx.createLinearGradient(0,100,1100,800);g.addColorStop(0,`hsl(${65+(save.area%20)*4},24%,${35+(save.area%4)*3}%)`);g.addColorStop(1,`hsl(${75+(save.area%20)*3},25%,27%)`);round(91,156,1018,568,65,'#172d2555');round(105,166,990,544,52,g);
for(let q of grass){ctx.strokeStyle=q.a>.5?'#a3ad6d22':'#263e2d22';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(q.x,q.y);ctx.lineTo(q.x+2,q.y-q.s);ctx.stroke()}
// weathered garden fence
ctx.strokeStyle='#172d2555';ctx.lineWidth=12;ctx.beginPath();ctx.moveTo(118,177);ctx.lineTo(1080,177);ctx.stroke();for(let y of [139,158])round(105,y,990,8,2,'#8e8261');for(let x=111;x<1100;x+=35){round(x+4,127,12,57,3,'#2c382d44');round(x,116,12,62,3,'#b3a17b');round(x,116,4,59,2,'#c4b28c')}
// stepping stones and bench
for(let i=0;i<7;i++){ellipse(210+i*104,735+Math.sin(i)*4,43,19,'#172d2544');ellipse(208+i*104,730+Math.sin(i)*4,41,18,i%2?'#a8a188':'#97977e')}
round(690,190,155,36,4,'#1d382844');round(701,178,10,48,2,'#3c4434');round(819,178,10,48,2,'#3c4434');for(let i=0;i<3;i++)round(687,171+i*12,158,8,2,'#aa8054');
let b=bin();ellipse(b.x,b.y+5,b.r+9,b.r*.72+9,'#203a2b55');ellipse(b.x,b.y,b.r,b.r*.72,'#394b2c');ctx.save();ctx.translate(b.x,b.y);ctx.scale(1,.72);ctx.strokeStyle='#dcc57c';ctx.lineWidth=3;ctx.setLineDash([9,7]);ctx.beginPath();ctx.arc(0,0,b.r,0,7);ctx.stroke();ctx.restore();for(let i=0;i<Math.min(48,collected/3);i++){let a=i*2.4,rr=Math.sqrt(i/48)*b.r*.7;leaf(b.x+Math.cos(a)*rr,b.y+Math.sin(a)*rr*.6,7,a,palette[i%7])}ctx.fillStyle='#eee1b5';ctx.textAlign='center';ctx.font='10px system-ui';ctx.fillText('L E A F   B A S K E T',b.x,b.y+b.r*.72+23);
tree(117,245,85+(save.area%4)*6,palette[save.area%7]);tree(1070,285,104,palette[(save.area+2)%7]);tree(70,628,86,palette[(save.area+4)%7]);tree(1142,648,101,palette[(save.area+6)%7]); for(let i=0;i<save.area%5;i++){ellipse(350+i*130,208,15,8,'#87917a');}
// warm afternoon light
let light=ctx.createLinearGradient(100,50,1000,800);light.addColorStop(0,'#ffe8a915');light.addColorStop(1,'#00000000');ctx.fillStyle=light;ctx.fillRect(0,0,1200,800)
}
// Scenery is static between area/basket/density changes. Keep only one bounded
// bitmap; mobile/high-DPI windows never allocate more than 2400 × 1600 here.
let backgroundBuffer=null,backgroundContext=null,backgroundKey='',backgroundDisabled=false;
function paintBackground(){
 if(backgroundDisabled){background();return}
 try{
  if(!backgroundBuffer){backgroundBuffer=document.createElement('canvas');backgroundContext=backgroundBuffer.getContext('2d');if(!backgroundContext)throw Error('No scenery context')}
  const density=Math.min(2,Math.max(.5,scale*devicePixelRatio)),width=Math.ceil(1200*density),height=Math.ceil(800*density);
  const key=save.area+':'+collected+':'+width+':'+height;
  if(key!==backgroundKey){
   backgroundBuffer.width=width;backgroundBuffer.height=height;
   const visibleContext=ctx;
   try{ctx=backgroundContext;ctx.setTransform(width/1200,0,0,height/800,0,0);background()}
   finally{ctx=visibleContext}
   backgroundKey=key;
  }
  ctx.drawImage(backgroundBuffer,0,0,1200,800);
 }catch{
  // Preserve the original renderer if an extra canvas/context is unavailable.
  backgroundDisabled=true;backgroundBuffer=null;backgroundContext=null;backgroundKey='';background();
 }
}
function render(t){let dt=Math.min((t-last)/1000||.016,.035);last=t;clock+=dt;const frameStats=stats();if(running&&down&&frameStats.hold)pick();ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);ctx.fillStyle='#263a30';ctx.fillRect(0,0,W,H);ctx.translate(ox,oy);ctx.scale(scale,scale);paintBackground();hover=null;let nearest=Infinity;for(let l of leaves){let d=Math.hypot(l.x-pointer.x,l.y-pointer.y);if(d<frameStats.reach+l.s&&d<nearest){hover=l;nearest=d}leaf(l.x+1.5,l.y+2,l.s,l.a,'#1c2c2428');if(l.rare)ellipse(l.x,l.y,l.s+4,l.s*.8,'#ffe38655');leaf(l.x,l.y,l.s,l.a,l.rare?'#ffe178':l.c)}if(hover&&running){ctx.strokeStyle='#fff0bb';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(hover.x,hover.y,hover.s+5,0,7);ctx.stroke();if(hover.hp<hover.max){round(hover.x-17,hover.y-24,34,4,2,'#1b332a');round(hover.x-17,hover.y-24,34*hover.hp/hover.max,4,2,'#edc378')}}for(let i=particles.length-1;i>=0;i--){let p=particles[i];p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;ctx.globalAlpha=Math.max(0,p.life);leaf(p.x,p.y,5,p.life*3,p.c);if(p.life<0)particles.splice(i,1)}ctx.globalAlpha=1;if(running){const s=frameStats;ctx.strokeStyle='#eee4b955';ctx.lineWidth=1;ctx.beginPath();ctx.arc(pointer.x,pointer.y,s.reach,0,7);ctx.stroke();ctx.font='24px system-ui';ctx.textAlign='center';ctx.fillText(mode==='hand'||save.ranks[2]<5?'🤏':save.ranks[2]<20?'🧹':'🌀',pointer.x,pointer.y-22);ctx.font='11px system-ui';ctx.fillStyle='#f6e8c0';if(hover&&hover.hp>1)ctx.fillText(`${Math.ceil(hover.hp/s.power)} picks`,pointer.x,pointer.y+40)}requestAnimationFrame(render)}
const recovery=AutumnRecovery.mount({store:saveStore,snapshot:currentGarden,refreshStatus:saveStatus,apply(next){
 save=next;migrated=false;down=false;keyboardLeaf=null;hover=null;lastPick=-10;loadGarden(true);announceLeaf();
}});
addEventListener('pagehide',persist);loadGarden(true);saveStatus();requestAnimationFrame(render);
