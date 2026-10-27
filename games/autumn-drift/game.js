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
function areaCount(a){return a<3?[36,48,58][a]:Math.min(900,65+Math.floor(a*1.8))}
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
function loadGarden(restore=false){let r=rng(save.area*9157+save.clears*13+77);total=areaCount(save.area);collected=0;completed=false;leaves=[];particles=[];for(let i=0;i<total;i++){let a=r()*6.28,x=155+r()*880,y=225+r()*447;if((save.area%3)===1){x=220+(i%4)*210+Math.cos(a)*r()*80;y=420+Math.sin(a)*r()*185}leaves.push({id:i,x,y,a,s:9+r()*6,c:palette[(Math.floor(r()*7)+save.area)%7],hp:health(save.area),max:health(save.area),rare:r()<.035});}if(!(restore&&save.garden?.area===save.area)&&leaves.length){leaves[0].x=620;leaves[0].y=410}if(restore&&save.garden?.area===save.area){({leaves,collected,total,completed}=save.garden)}updateUI()}
function toast(msg){$('toast').textContent=msg;$('toast').style.opacity=1;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').style.opacity=0,2300)}
function updateUI(){let s=stats();$('money').textContent=fmt(save.money);$('day').textContent=`AREA ${save.area+1} / 5,000 · ${areaName(save.area).toUpperCase()}`;$('progress').style.width=collected/total*100+'%';$('instruction').textContent=`${collected} / ${total} picked · ${s.hold?'Hold to grab & blow':'Click to pick · hold & drag to blow'} · ${mode==='hand'?'Bare hand':toolName()}`;$('travelBtn').textContent=collected/total>=.85&&save.area===save.unlocked?'Next area →':'Areas';$('toolBtn').textContent=mode==='hand'?'Hand':toolName();$('tally').textContent=`${fmt(save.ranks.reduce((a,b)=>a+b,0))} / 20,000 upgrades`}
// ---- Leaf handling: picking (click/keyboard) and blowing (hold & drag), Leaf Blower style.
let floaters=[],flyers=[],combo=0,comboT=-9,dirtySave=false,lastSaveAt=0,uiDirty=false,shake=0,lastPointer=null,pointerVel={x:0,y:0},blowing=0,gustPuffs=[];
function hudTarget(){try{const r=$('money').getBoundingClientRect();if(r&&r.width)return{x:(r.left+r.width/2-ox)/scale,y:(r.top+r.height/2-oy)/scale}}catch{}return{x:1000,y:40}}
function collectLeaf(l,how){const s=stats();const i=leaves.indexOf(l);if(i<0)return 0;leaves.splice(i,1);collected++;save.picked++;
 let mult=1;if(how!=='pick'){if(clock-comboT<1.4)combo++;else combo=1;comboT=clock;mult=(how==='basket'?2:1)*(1+Math.min(.5,(combo-1)*.03))}
 const gain=Math.ceil(value(save.area)*s.value*(l.rare?5:1)*mult);save.money+=gain;
 for(let j=0;j<(l.rare?10:4);j++)particles.push({x:l.x,y:l.y,vx:rand(-60,60),vy:rand(-90,-20),life:.9,c:j%2?l.c:shade(l.c,.35)});
 flyers.push({x:l.x,y:l.y,sx:l.x,sy:l.y,t:0,c:l.rare?'#ffe178':l.c,a:l.a});
 floaters.push({x:l.x,y:l.y-10,text:'+'+fmt(gain)+(how==='basket'?' x2':''),life:1,c:l.rare?'#ffe178':'#fff3cf'});
 if(l.rare){shake=Math.max(shake,6);chime(1.5);toast('Golden leaf! +'+fmt(gain)+' acorns')}else pop(how==='basket'?1.3:1+Math.min(1,combo*.04));
 return gain}
function checkCleared(){if(!leaves.length&&!completed){completed=true;let bonus=areaCount(save.area)*value(save.area);save.money+=bonus;chime(1);setTimeout(()=>chime(1.5),160);shake=8;floaters.push({x:600,y:420,text:'GARDEN CLEARED! +'+fmt(bonus),life:2.2,c:'#ffe7a0',big:true});for(let j=0;j<60;j++)particles.push({x:600+rand(-200,200),y:440,vx:rand(-120,120),vy:rand(-260,-80),life:1.6,c:palette[j%7]});toast('Garden cleared! +'+fmt(bonus)+' bonus · Open Areas to continue')}}
function pick(){if(!running||completed)return;let s=stats();if(clock-lastPick<s.cooldown)return;let targets=leaves.map(l=>({l,d:Math.hypot(l.x-pointer.x,l.y-pointer.y)})).filter(o=>o.d<s.reach+o.l.s).sort((a,b)=>a.d-b.d).slice(0,s.amount);if(!targets.length)return;lastPick=clock;rustle();for(let {l} of targets){l.hp-=s.power;if(l.hp>0){floaters.push({x:l.x,y:l.y-12,text:'tug',life:.6,c:'#e8dcb0'});continue}collectLeaf(l,'pick')}checkCleared();updateUI();persist()}
function blowRadius(s){return 66+s.reach*1.5}
function blow(s,dt){const R=blowRadius(s),str=2600*(1+Math.log2(s.power)*.35),pv=pointerVel;let moved=0;
 for(const l of leaves){const dx=l.x-pointer.x,dy=l.y-pointer.y,d=Math.hypot(dx,dy);if(d>R||d<.01)continue;const f=1-d/R,mob=1/(1+Math.max(0,l.max/s.power-1)*.7);
  l.vx=(l.vx||0)+(dx/d*str*f+pv.x*3*f)*mob*dt;l.vy=(l.vy||0)+(dy/d*str*f+pv.y*3*f)*mob*dt;l.spin=(l.spin||0)+(Math.random()-.5)*8*dt;moved++}
 blowing=Math.min(1,moved/6);if(Math.random()<.5)gustPuffs.push({x:pointer.x+rand(-8,8),y:pointer.y+rand(-8,8),a:rand(0,6.28),life:.5,R})}
function stepLeaves(dt){const b=bin();let got=0;for(let i=leaves.length-1;i>=0;i--){const l=leaves[i];if(!l.vx&&!l.vy)continue;l.x+=l.vx*dt;l.y+=l.vy*dt;l.a=(l.a+(l.spin||0)*dt)%6.283;const k=Math.exp(-2.6*dt);l.vx*=k;l.vy*=k;
  const bx=(l.x-b.x)/b.r,by=(l.y-b.y)/(b.r*.72);if(bx*bx+by*by<1){collectLeaf(l,'basket');got++;continue}
  if(l.x<112||l.x>1088||l.y<172||l.y>706){collectLeaf(l,'blow');got++;continue}
  if(Math.abs(l.vx)+Math.abs(l.vy)<6){delete l.vx;delete l.vy;delete l.spin}}
 if(got){checkCleared();uiDirty=true;dirtySave=true}}
function pos(e){return{x:(e.clientX-ox)/scale,y:(e.clientY-oy)/scale}}
canvas.onpointerdown=e=>{if(!running)return;pointer=pos(e);lastPointer={...pointer,t:clock};down=true;try{canvas.setPointerCapture(e.pointerId)}catch{}if(sound)soundInit();pick()};
canvas.onpointermove=e=>{const p=pos(e);if(lastPointer){const dt=Math.max(.008,clock-lastPointer.t);pointerVel={x:Math.max(-900,Math.min(900,(p.x-lastPointer.x)/dt)),y:Math.max(-900,Math.min(900,(p.y-lastPointer.y)/dt))}}lastPointer={...p,t:clock};pointer=p};
canvas.onpointerup=canvas.onpointercancel=()=>{down=false;pointerVel={x:0,y:0}};addEventListener('blur',()=>down=false);



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
 const id=$('intro').style.display!=='none'?'intro':['shop','complete','savesPanel','helpPanel'].find(id=>$(id).style.display==='flex');
 if(!id)return;
 const buttons=panelButtons(id),first=buttons[0],last=buttons[buttons.length-1],active=document.activeElement;
 if(!buttons.includes(active)||(e.shiftKey&&active===first)||(!e.shiftKey&&active===last)){e.preventDefault();(e.shiftKey?last:first)?.focus()}
});
function closePanels(){if($('intro').style.display!=='none')return;recovery.cancel();$('helpPanel').style.display='none';$('savesPanel').style.display='none';$('shop').style.display='none';$('complete').style.display='none';running=true;down=false;canvas.focus()}
$('start').onclick=()=>{$('intro').style.display='none';running=true;canvas.focus();try{if(localStorage.getItem('autumnDriftSound')!=='0'){sound=true;$('sound').textContent='Sound on';soundInit()}}catch{}if(migrated)toast('Your previous acorns have been carried over.')};$('sound').onclick=()=>{sound=!sound;$('sound').textContent=sound?'Sound on':'Sound off';try{localStorage.setItem('autumnDriftSound',sound?'1':'0')}catch{}if(sound)soundInit();else setBlowSound(0)};$('toolBtn').onclick=()=>{mode=mode==='hand'?'best':'hand';updateUI()};
const tracks=['Hand strength','Hand reach','Tools & equipment','Leaf appraisal'];
function effect(i,n){return i===0?`${1+n} picking power`:i===1?`${(18+Math.log2(n+1)*7).toFixed(1)} px reach`:i===2?`${toolName(n)} · ${1+Math.floor(Math.sqrt(n)*1.8)} leaves/action`:`×${(1+n*.12).toFixed(2)} leaf income`}
function buy(i){let n=save.ranks[i];if(n>=MAX||n>save.unlocked||save.money<cost(i))return false;save.money-=cost(i);save.ranks[i]++;persist();updateUI();return true}
function shop(){running=false;down=false;$('upgrades').innerHTML='';tracks.forEach((title,i)=>{let n=save.ranks[i],row=document.createElement('div');row.className='row';let text=document.createElement('div');text.innerHTML=`<b>${title} <small>${fmt(n)} / 5,000</small></b><small>${effect(i,n)}<br>Next: ${n===MAX?'Complete':effect(i,n+1)}</small>`;let btn=document.createElement('button');btn.textContent=n===MAX?'Maxed':n>save.unlocked?`Area ${n+1}`:fmt(cost(i))+' acorns';btn.disabled=n===MAX||n>save.unlocked||save.money<cost(i);btn.onclick=()=>{if(buy(i)){chime();shop()}};row.append(text,btn);$('upgrades').append(row)});$('shop').style.display='flex';focusPanel('shop')}
$('shopBtn').onclick=()=>{if($('intro').style.display==='none'){$('complete').style.display='none';shop()}};$('closeShop').onclick=closePanels;$('helpBtn').onclick=()=>{if($('intro').style.display!=='none')return;running=false;down=false;$('shop').style.display='none';$('complete').style.display='none';$('helpPanel').style.display='flex';focusPanel('helpPanel')};$('closeHelp').onclick=closePanels;addEventListener('keydown',e=>{if(e.key==='Escape')closePanels()});
function canUnlock(){return save.area===save.unlocked&&save.unlocked<MAX-1&&collected/total>=.85&&save.money>=fee(save.area)}
function unlock(){if(!canUnlock())return false;save.money-=fee(save.area);save.unlocked++;save.area=save.unlocked;loadGarden();persist();closePanels();return true}
function travel(){running=false;down=false;$('shop').style.display='none';$('finishTitle').textContent='Beyond the gate.';$('finishText').textContent=`${fmt(save.unlocked+1)} / 5,000 areas unlocked. Clear 85% of your newest area and pay the gate fee to move on. Each area opens four new upgrade ranks. 20 biomes × 250 seeded variations.`;let info=$('gateInfo');info.textContent=save.unlocked===MAX-1?'All 5,000 areas unlocked!':save.area<save.unlocked?'Return to your furthest area to unlock the next gate.':`${Math.floor(collected/total*100)}% cleared / 85% needed · Gate: ${fmt(fee(save.area))} acorns`;$('next').textContent=save.area<save.unlocked?'Return to frontier →':save.unlocked===MAX-1?'All areas unlocked':`Unlock area ${save.unlocked+2} →`;$('next').disabled=save.area===save.unlocked&&!canUnlock();$('areaInput').max=save.unlocked+1;$('areaInput').value=save.area+1;$('complete').style.display='flex';focusPanel('complete')}
$('travelBtn').onclick=()=>{if($('intro').style.display==='none')travel()};$('next').onclick=()=>{if(save.area<save.unlocked){save.area=save.unlocked;loadGarden();persist();closePanels()}else unlock()};$('closeMap').onclick=closePanels;$('reseed').onclick=()=>{save.clears++;loadGarden();persist();closePanels();toast('A new fall of leaves. Earn more acorns here.')};$('visit').onclick=()=>{let a=Number($('areaInput').value)-1;if(!Number.isInteger(a)||a<0||a>save.unlocked){toast('Choose an unlocked area.');return}if(a!==save.area){save.area=a;loadGarden();persist()}closePanels()};
function soundInit(){if(!audio){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;audio=new AC();let buf=audio.createBuffer(1,audio.sampleRate*1,audio.sampleRate),d=buf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1);noise=buf}audio.resume?.()}
let blowSrc=null,blowGain=null,blowFilter=null;
function setBlowSound(level){if(!sound||!audio){if(blowGain&&audio)blowGain.gain.setTargetAtTime(0,audio.currentTime,.05);return}if(!blowSrc){blowSrc=audio.createBufferSource();blowSrc.buffer=noise;blowSrc.loop=true;blowFilter=audio.createBiquadFilter();blowFilter.type='bandpass';blowFilter.Q.value=.7;blowGain=audio.createGain();blowGain.gain.value=0;blowSrc.connect(blowFilter);blowFilter.connect(blowGain);blowGain.connect(audio.destination);blowSrc.start()}blowFilter.frequency.setTargetAtTime(500+level*900,audio.currentTime,.08);blowGain.gain.setTargetAtTime(level>0?.03+level*.05:0,audio.currentTime,.08)}
function rustle(){if(!sound||!audio||clock-lastRustle<.08)return;lastRustle=clock;let s=audio.createBufferSource(),f=audio.createBiquadFilter(),g=audio.createGain();s.buffer=noise;f.type='bandpass';f.frequency.value=900+Math.random()*1400;g.gain.setValueAtTime(.055,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.14);s.connect(f);f.connect(g);g.connect(audio.destination);s.start(0,Math.random()*.8,.16)}
let lastPop=0;function pop(p=1){if(!sound||!audio||clock-lastPop<.035)return;lastPop=clock;let o=audio.createOscillator(),g=audio.createGain(),now=audio.currentTime;o.type='triangle';o.frequency.setValueAtTime(380*p,now);o.frequency.exponentialRampToValueAtTime(760*p,now+.06);g.gain.setValueAtTime(.05,now);g.gain.exponentialRampToValueAtTime(.001,now+.12);o.connect(g);g.connect(audio.destination);o.start();o.stop(now+.13);rustle()}
function chime(p=1){if(!sound||!audio)return;let o=audio.createOscillator(),g=audio.createGain();o.type='sine';o.frequency.setValueAtTime(660*p,audio.currentTime);o.frequency.exponentialRampToValueAtTime(990*p,audio.currentTime+.15);g.gain.setValueAtTime(.08,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.5);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+.5)}
// ---- Pixel-art renderer (4-unit pixel grid). Everything below is original code-drawn art.
const U=4,snap=v=>Math.round(v/U)*U;
function hexRgb(h){h=h.replace('#','');return[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]}
function shade(h,f){const c=hexRgb(h).map(v=>Math.max(0,Math.min(255,Math.round(f>0?v+(255-v)*f:v*(1+f)))));return'#'+c.map(v=>v.toString(16).padStart(2,'0')).join('')}
function px(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(snap(x),snap(y),snap(w)||U,snap(h)||U)}
function pdisc(cx,cy,rx,ry,c){ctx.fillStyle=c;cx=snap(cx);cy=snap(cy);const top=snap(ry);for(let y=-top;y<top;y+=U){const k=(y+U/2)/ry,hw=snap(rx*Math.sqrt(Math.max(0,1-k*k)));if(hw>0)ctx.fillRect(cx-hw,cy+y,hw*2,U)}}
// Leaf sprites: o outline, x fill, h highlight, v vein. Rotated in 90° steps so pixels stay square.
const LEAF_MASKS=[[".....oo","...ooxo","..oxhxo",".oxhvxo",".oxvxo.","oovxo..","o.oo..."],["...o...",".o.x.o.","oxxhxxo",".oxvxo.","oxxvxxo",".oo.oo.","...o..."],[".oo..",".oxo.","oxhxo","oxvxo",".ovo.","..o.."]];
function rot(m){const n=m.length;return m.map((r,y)=>[...r].map((_,x)=>m[n-1-x][y]).join(''))}
const LEAF_RUNS=LEAF_MASKS.map(m=>{let out=[],cur=m;for(let r=0;r<4;r++){const runs=[],n=cur.length;cur.forEach((row,y)=>{for(let x=0;x<n;){const k=row[x];if(k==='.'){x++;continue}let e=x;while(e<n&&row[e]===k)e++;runs.push([k,(x-(n>>1))*U,(y-(n>>1))*U,(e-x)*U]);x=e}});out.push(runs);cur=rot(cur)}return out});
const leafShades={};function leafCols(c){return leafShades[c]||(leafShades[c]={x:c,o:shade(c,-.42),h:shade(c,.38),v:shade(c,-.22)})}
function leaf(x,y,s,a,c){const kind=s<11?2:(Math.floor(s*7)%2),runs=LEAF_RUNS[kind][((Math.round(a/(Math.PI/2))%4)+4)%4],cols=typeof c==='string'&&c[0]==='#'&&c.length===7?leafCols(c):null,bx=snap(x),by=snap(y);
 if(!cols){ctx.fillStyle=c;for(const r of runs)ctx.fillRect(bx+r[1],by+r[2],r[3],U);return}
 for(const k of ['o','x','v','h']){ctx.fillStyle=cols[k];for(const r of runs)if(r[0]===k)ctx.fillRect(bx+r[1],by+r[2],r[3],U)}}
function leafShadow(x,y,s,a){const kind=s<11?2:(Math.floor(s*7)%2),runs=LEAF_RUNS[kind][((Math.round(a/(Math.PI/2))%4)+4)%4],bx=snap(x)+U,by=snap(y)+U;ctx.fillStyle='#14241a38';for(const r of runs)ctx.fillRect(bx+r[1],by+r[2],r[3],U)}
function ellipse(x,y,rx,ry,color){pdisc(x,y,rx,ry,color)}
function round(x,y,w,h,r,c){px(x,y,w,h,c)}
function hsl(h,s,l){s/=100;l/=100;const k=n=>(n+h/30)%12,a=s*Math.min(l,1-l),f=n=>l-a*Math.max(-1,Math.min(k(n)-3,Math.min(9-k(n),1)));return[f(0),f(8),f(4)].map(v=>Math.round(v*255))}
const grass=Array.from({length:1500},()=>({x:rand(125,1080),y:rand(183,703),s:rand(1,3),a:Math.random()}));
// Lawn is a 300×200 pixel bitmap per area, scaled ×4 without smoothing.
let lawnCanvas=null,lawnKey=-1;
function lawnBitmap(){
 if(lawnKey===save.area&&lawnCanvas)return lawnCanvas;
 try{const cv=document.createElement('canvas');cv.width=300;cv.height=200;const g=cv.getContext('2d');if(!g)return null;const img=g.createImageData(300,200);if(!img||typeof img.data!=='object')return null;const d=img.data,r=rng(save.area*7919+11),hue=65+(save.area%20)*4,L=35+(save.area%4)*3,tones=[hsl(hue,26,L-5),hsl(hue,25,L-1),hsl(hue,27,L+2),hsl(hue+6,30,L+5)],edge=hsl(hue-8,22,L-11),feat=save.area%5;
  const inside=(x,y)=>{const R=13,x0=26,y0=41,x1=274,y1=178;if(x<x0||x>x1||y<y0||y>y1)return false;const cx=x<x0+R?x0+R:x>x1-R?x1-R:x,cy=y<y0+R?y0+R:y>y1-R?y1-R:y;return(x-cx)**2+(y-cy)**2<=R*R};
  const G=7,gw=Math.ceil(300/G)+2,gh=Math.ceil(200/G)+2,grid=Array.from({length:gw*gh},()=>r()),bay=[0,.5,.75,.25],nz=(x,y)=>{const gx=x/G,gy=y/G,ix=gx|0,iy=gy|0,fx=gx-ix,fy=gy-iy,sm=t=>t*t*(3-2*t),a=grid[iy*gw+ix],b=grid[iy*gw+ix+1],c=grid[(iy+1)*gw+ix],e=grid[(iy+1)*gw+ix+1],u=sm(fx),v=sm(fy);return a*(1-u)*(1-v)+b*u*(1-v)+c*(1-u)*v+e*u*v};
  for(let y=0;y<200;y++)for(let x=0;x<300;x++){if(!inside(x,y))continue;const i=(y*300+x)*4,stripe=Math.floor((x+y*.35)/16)%2,v=nz(x,y)*.7+stripe*.16+bay[(x&1)+(y&1)*2]*.2;let c=tones[Math.max(0,Math.min(3,Math.floor(v*3.6)))];if(!inside(x-1,y)||!inside(x+1,y)||!inside(x,y-1)||!inside(x,y+1))c=edge;d[i]=c[0];d[i+1]=c[1];d[i+2]=c[2];d[i+3]=255}
  const put=(x,y,c)=>{x|=0;y|=0;if(x<0||y<0||x>=300||y>=200||!inside(x,y))return;const i=(y*300+x)*4;d[i]=c[0];d[i+1]=c[1];d[i+2]=c[2];d[i+3]=255};
  const flowers=[[236,226,214],[232,180,92],[214,132,160],[176,196,236]],dark=hsl(hue,28,L-9);
  for(let k=0;k<70;k++){const cl=Math.floor(k/7),x=40+((cl*97+save.area*13)%220)+r()*14,y=50+((cl*61+save.area*29)%118)+r()*10;if(feat===0||feat===3){const c=flowers[Math.floor(r()*4)];put(x,y,c);put(x+1,y,dark)}if(feat===1&&k<26){put(x,y,[222,208,180]);put(x+1,y,[222,208,180]);put(x,y-1,[180,82,60]);put(x+1,y-1,[200,96,70])}if(feat===2&&k<40){put(x,y,[150,146,128]);put(x+1,y,[176,172,150])}if(feat===4){put(x,y,[214,226,224]);put(x+2,y+1,[190,206,206])}}
  for(let k=0;k<26;k++){const x=30+r()*240,y=45+r()*130;for(let j=0;j<5;j++)put(x+(j%3),y+(j>>1),dark)}
  g.putImageData(img,0,0);lawnCanvas=cv;lawnKey=save.area;return cv}catch{return null}
}
function tree(x,y,r,color){const o=shade(color,-.5),m=shade(color,-.22),h=shade(color,.28),hh=shade(color,.5),tr=rng(Math.round(x*13+y*7+save.area*31)),cx=x,cy=y-60;
 pdisc(x+26,y+22,r*.98,r*.62,'#0f241a55');
 const lobes=[[0,0,1],[-.42,-.18,.62],[.44,-.12,.6],[-.2,.36,.6],[.3,.34,.58],[0,-.42,.55]];
 for(const [dx,dy,k] of lobes)pdisc(cx+dx*r,cy+dy*r,r*k+U,r*k*.86+U,o);
 for(const [dx,dy,k] of lobes)pdisc(cx+dx*r,cy+dy*r,r*k,r*k*.86,m);
 const clumps=[];for(let i=0;i<34;i++){const a=tr()*6.283,d=Math.sqrt(tr())*r*.8,X=cx+Math.cos(a)*d,Y=cy+Math.sin(a)*d*.86,l=-(Math.cos(a)+Math.sin(a))*d/r+tr()*.3-.15;clumps.push([X,Y,l,.17+tr()*.08])}
 clumps.sort((a,b)=>a[2]-b[2]);
 for(const [X,Y,l,k] of clumps){const col=l>.45?h:l>-.1?color:m;pdisc(X+U,Y+U,r*k,r*k*.85,o);pdisc(X,Y,r*k,r*k*.85,col);if(l>.2)px(X-r*k*.4,Y-r*k*.4,U,U,l>.55?hh:h)}
 ctx.fillStyle=o;for(let i=0;i<10;i++){const a=tr()*6.283;ctx.fillRect(snap(cx+Math.cos(a)*r*1.02),snap(cy+Math.sin(a)*r*.88),U,U)}}
function background(){ctx.fillStyle='#26382d';ctx.fillRect(0,0,1200,800);
 // dark hedge border, dithered
 px(92,152,1016,572,'#1b2e22');ctx.fillStyle='#22382a';for(let i=0;i<520;i++){const a=(i*97)%1016,b=(i*53)%572;if(a>20&&a<996&&b>16&&b<556)continue;ctx.fillRect(snap(92+a),snap(152+b),U,U)}
 const lawn=lawnBitmap();let drew=false;if(lawn){try{const sm=ctx.imageSmoothingEnabled;ctx.imageSmoothingEnabled=false;ctx.drawImage(lawn,0,0,1200,800);ctx.imageSmoothingEnabled=sm;drew=true}catch{}}
 if(!drew){const c=hsl(65+(save.area%20)*4,25,35+(save.area%4)*3);px(108,168,984,540,`rgb(${c})`)}
 // grass tufts: 1,500 hand-placed single-pixel blades
 ctx.lineWidth=U;ctx.lineCap='butt';for(let q of grass){ctx.strokeStyle=q.a>.5?'#b8c47a3a':'#1e352544';const x=snap(q.x)+U/2,y=snap(q.y);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y-U*(q.s>2?2:1));ctx.stroke()}
 // weathered picket fence
 px(108,176,984,8,'#15281d66');for(let y of [136,156]){px(104,y,992,8,'#6f6248');px(104,y,992,4,'#a8976f')}
 for(let x=112;x<1096;x+=36){px(x+4,124,12,60,'#15281d55');px(x,112,12,64,'#5d4f36');px(x+U,116,4,56,'#cdb98f');px(x+8,116,4,56,'#a8946b');px(x+U,108,4,4,'#5d4f36')}
 // stepping stones
 for(let i=0;i<7;i++){const sx=210+i*104,sy=736+Math.round(Math.sin(i))*4;pdisc(sx+4,sy+4,40,16,'#14241a66');pdisc(sx,sy,40,16,'#6f6c5a');pdisc(sx,sy-U,36,12,i%2?'#aaa38a':'#9a9a80');px(sx-20,sy-8,12,4,'#c8c2a8')}
 // garden bench
 px(692,196,156,32,'#15281d55');px(700,176,12,48,'#3a3a2c');px(824,176,12,48,'#3a3a2c');for(let i=0;i<3;i++){px(688,168+i*12,160,8,'#7b5532');px(688,168+i*12,160,4,'#b5844f')}
 // wicker leaf basket
 let b=bin();pdisc(b.x+6,b.y+8,b.r+10,b.r*.72+8,'#14241a66');pdisc(b.x,b.y,b.r+8,b.r*.72+6,'#5b3b20');pdisc(b.x,b.y,b.r+4,b.r*.72+2,'#9a6a3c');
 ctx.fillStyle='#c08c52';for(let a=0;a<6.28;a+=.26){ctx.fillRect(snap(b.x+Math.cos(a)*(b.r+2)),snap(b.y+Math.sin(a)*(b.r*.72)),U,U)}
 pdisc(b.x,b.y,b.r-4,b.r*.72-6,'#3a2816');
 for(let i=0;i<Math.min(48,collected/3);i++){let a=i*2.4,rr=Math.sqrt(i/48)*b.r*.62;leaf(b.x+Math.cos(a)*rr,b.y+Math.sin(a)*rr*.6,9,a,palette[i%7])}
 ctx.fillStyle='#14241a';ctx.textAlign='center';ctx.font='bold 12px "Courier New",monospace';ctx.fillText('LEAF BASKET x2',b.x+2,b.y-b.r*.72-14);ctx.fillStyle='#f1e3b4';ctx.fillText('LEAF BASKET x2',b.x,b.y-b.r*.72-16);
 tree(117,305,85+(save.area%4)*6,palette[save.area%7]);tree(1070,345,104,palette[(save.area+2)%7]);tree(70,688,86,palette[(save.area+4)%7]);tree(1142,708,101,palette[(save.area+6)%7]);
 for(let i=0;i<save.area%5;i++){pdisc(350+i*130,212,16,8,'#5f6a52');pdisc(350+i*130,208,14,6,'#8d977c')}
 let light=ctx.createLinearGradient(100,50,1000,800);light.addColorStop(0,'#ffe8a912');light.addColorStop(1,'#00000000');ctx.fillStyle=light;ctx.fillRect(0,0,1200,800)
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
function tool(x,y,kind,t){x=snap(x);y=snap(y);if(kind===0){px(x-8,y-28,16,16,'#e9c9a0');px(x-8,y-32,4,8,'#e9c9a0');px(x-4,y-36,4,10,'#e9c9a0');px(x,y-36,4,10,'#e9c9a0');px(x+4,y-32,4,8,'#e9c9a0');px(x-8,y-16,16,4,'#b98f6a')}
 else if(kind===1){px(x-2,y-44,4,30,'#8a6236');px(x-14,y-16,28,4,'#cfcfc4');for(let i=0;i<4;i++)px(x-12+i*8,y-12,4,6,'#cfcfc4')}
 else{px(x-16,y-30,22,14,'#d9733f');px(x-16,y-30,22,4,'#f19a62');px(x+6,y-26,14,6,'#5d6672');px(x-12,y-16,6,8,'#3a3a40');if(blowing>0&&Math.sin(t*40)>0)px(x+20,y-26,4,6,'#ffffffaa')}}
function render(t){let dt=Math.min((t-last)/1000||.016,.035);last=t;clock+=dt;const frameStats=stats();if(running&&down){if(frameStats.hold)pick();blow(frameStats,dt);pointerVel.x*=.85;pointerVel.y*=.85}else blowing=0;if(running)stepLeaves(dt);setBlowSound(running&&down?blowing:0);
 if(uiDirty){uiDirty=false;updateUI()}if(dirtySave&&clock-lastSaveAt>.6){dirtySave=false;lastSaveAt=clock;persist()}
 ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);ctx.imageSmoothingEnabled=false;ctx.fillStyle='#263a30';ctx.fillRect(0,0,W,H);ctx.translate(ox,oy);ctx.scale(scale,scale);if(shake>0){ctx.translate((Math.random()-.5)*shake,(Math.random()-.5)*shake);shake=Math.max(0,shake-dt*30)}paintBackground();
 hover=null;let nearest=Infinity;for(let l of leaves){let d=Math.hypot(l.x-pointer.x,l.y-pointer.y);if(d<frameStats.reach+l.s&&d<nearest){hover=l;nearest=d}leafShadow(l.x,l.y,l.s,l.a)}
 for(let l of leaves){leaf(l.x,l.y,l.s,l.a,l.rare?'#ffd65c':l.c);if(l.rare&&Math.sin(clock*5+l.id)>.6){ctx.fillStyle='#fffbe0';ctx.fillRect(snap(l.x)+8,snap(l.y)-12,U,U)}}
 if(hover&&running){const hx=snap(hover.x),hy=snap(hover.y),r=snap(hover.s+6);ctx.fillStyle='#fff0bb';for(const [x0,y0,sx,sy] of [[hx-r,hy-r,1,1],[hx+r-U,hy-r,-1,1],[hx-r,hy+r-U,1,-1],[hx+r-U,hy+r-U,-1,-1]]){ctx.fillRect(sx>0?x0:x0-U,y0,U*2,U);ctx.fillRect(x0,sy>0?y0:y0-U,U,U*2)}if(hover.hp<hover.max){px(hover.x-16,hover.y-28,32,4,'#1b332a');px(hover.x-16,hover.y-28,32*hover.hp/hover.max,4,'#edc378')}}
 for(let i=gustPuffs.length-1;i>=0;i--){const g=gustPuffs[i];g.life-=dt;const d=(1-g.life/.5)*g.R;ctx.fillStyle='rgba(255,250,230,'+(g.life*.7).toFixed(2)+')';ctx.fillRect(snap(g.x+Math.cos(g.a)*d),snap(g.y+Math.sin(g.a)*d),U,U);if(g.life<=0)gustPuffs.splice(i,1)}
 for(let i=particles.length-1;i>=0;i--){let p=particles[i];p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=160*dt;ctx.fillStyle=p.c;ctx.globalAlpha=Math.max(0,Math.min(1,p.life*1.4));ctx.fillRect(snap(p.x),snap(p.y),U,U);if(p.life<0)particles.splice(i,1)}ctx.globalAlpha=1;
 if(flyers.length){const h=hudTarget();for(let i=flyers.length-1;i>=0;i--){const f=flyers[i];f.t+=dt*1.6;const k=Math.min(1,f.t),e=k*k*(3-2*k),mx=(f.sx+h.x)/2,my=Math.min(f.sy,h.y)-160;const x=(1-e)*(1-e)*f.sx+2*(1-e)*e*mx+e*e*h.x,y=(1-e)*(1-e)*f.sy+2*(1-e)*e*my+e*e*h.y;leaf(x,y,8,f.a+k*8,f.c);if(k>=1){flyers.splice(i,1);const m=$('money').parentElement;m.classList.remove('bump');void m.offsetWidth;m.classList.add('bump')}}}
 ctx.textAlign='center';for(let i=floaters.length-1;i>=0;i--){const f=floaters[i];f.life-=dt;const y=f.y-(1-f.life)*(f.big?20:34);ctx.font=f.big?'bold 34px "Courier New",monospace':'bold 15px "Courier New",monospace';ctx.globalAlpha=Math.max(0,Math.min(1,f.life*2));ctx.fillStyle='#14241a';ctx.fillText(f.text,f.x+2,y+2);ctx.fillStyle=f.c;ctx.fillText(f.text,f.x,y);if(f.life<=0)floaters.splice(i,1)}ctx.globalAlpha=1;
 if(running&&clock-comboT<1.4&&combo>2){ctx.font='bold 22px "Courier New",monospace';ctx.fillStyle='#14241a';ctx.fillText('SWEEP x'+combo,602,206);ctx.fillStyle='#ffd36b';ctx.fillText('SWEEP x'+combo,600,204)}
 if(running){const s=frameStats,R=down?blowRadius(s):s.reach,n=down?28:18;ctx.fillStyle=down?'#fff6d888':'#eee4b966';for(let i=0;i<n;i++){const a=i/n*6.283+(down?clock*2:0);ctx.fillRect(snap(pointer.x+Math.cos(a)*R),snap(pointer.y+Math.sin(a)*R),U,U)}tool(pointer.x,pointer.y,mode==='hand'||save.ranks[2]<5?0:save.ranks[2]<20?1:2,clock);ctx.font='bold 12px "Courier New",monospace';ctx.fillStyle='#f6e8c0';if(hover&&hover.hp>1)ctx.fillText(`${Math.ceil(hover.hp/s.power)} picks`,pointer.x,pointer.y+40)}requestAnimationFrame(render)}
const recovery=AutumnRecovery.mount({store:saveStore,snapshot:currentGarden,refreshStatus:saveStatus,apply(next){
 save=next;migrated=false;down=false;keyboardLeaf=null;hover=null;lastPick=-10;loadGarden(true);announceLeaf();
}});
addEventListener('pagehide',persist);loadGarden(true);saveStatus();requestAnimationFrame(render);
