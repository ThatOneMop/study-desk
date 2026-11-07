'use strict';
const $=id=>document.getElementById(id);
const KEY='outbreak-atlas-v1';
const map=$('map'),ctx=map.getContext('2d');
let state=null,selected='hearthlow',playing=false,timer=0,clock=0,flashes=[],view={w:1000,h:620,scale:1,ox:0,oy:0};
let setup={scenario:'world',archetype:'drift',pressure:'breezy'};
const branches=[['tide','Tide'],['veil','Veil'],['hold','Hold']];

function resize(){
  const dpr=Math.min(2,devicePixelRatio||1);
  map.width=innerWidth*dpr;map.height=innerHeight*dpr;
  const wide=innerWidth>800,padRight=wide?400:16,padBottom=wide?70:300;
  view.scale=Math.min((innerWidth-padRight-24)/1000,(innerHeight-padBottom-24)/620);
  view.ox=wide?16:Math.max(8,(innerWidth-1000*view.scale)/2);
  view.oy=wide?Math.max(64,(innerHeight-620*view.scale)/2):54;
  view.w=innerWidth;view.h=innerHeight;
}
function worldPoint(x,y){return {x:(x-view.ox)/view.scale,y:(y-view.oy)/view.scale};}
function say(text){$('live').textContent=text;}
function persist(){if(!state)return;try{localStorage.setItem(KEY,JSON.stringify(state));}catch{}}
function loadSave(){try{return Outbreak.restore(JSON.parse(localStorage.getItem(KEY)||'null'));}catch{return null;}}
function scenarioMeta(id){return Outbreak.SCENARIOS.find(item=>item.id===id);}
function setState(next,announce){
  state=next;selected=state.lands[selected]?selected:'hearthlow';
  refresh();persist();
  if(announce)say(state.log[0]||'');
  if(state.won||state.lost){playing=false;$('play').setAttribute('aria-pressed','false');$('play').textContent='Watch';showEnd();}
}
function showEnd(){
  $('endTitle').textContent=state.won?'The story holds.':'The counter-effort wins.';
  $('endText').textContent=(state.log[0]||'')+' Month '+state.month+'.';
  $('end').hidden=false;
}
function refresh(){
  if(!state)return;
  const land=Outbreak.landById(selected),cell=state.lands[selected];
  $('month').textContent=String(state.month);
  $('talk').textContent=Math.round(state.talk*100)+'%';
  $('effort').textContent=Math.round(state.effort*100)+'%';
  $('points').textContent=String(state.points);
  $('eyebrow').textContent=scenarioMeta(state.scenario).name+' · '+Outbreak.ARCHETYPES[state.archetype].name+' · '+state.pressure;
  $('landName').textContent=land.name;
  const mark=Math.round(cell.mark*100);
  const status=cell.established?'Established':cell.foothold?'Foothold':'Quiet';
  $('landText').textContent=land.blurb+' Mark '+mark+'%. '+status+'. '+(land.kind==='isle'?'Island. ':'')+openLanes(land.id);
  const buttons=$('landButtons');buttons.replaceChildren();
  Outbreak.LANDS.forEach(item=>{
    const button=document.createElement('button');
    button.type='button';button.textContent=item.name;
    button.setAttribute('aria-pressed',String(item.id===selected));
    button.onclick=()=>{selected=item.id;refresh();};
    buttons.append(button);
  });
  const look=$('outlook');look.replaceChildren();
  Outbreak.forecast(state).lines.forEach(line=>{const li=document.createElement('li');li.textContent=line;look.append(li);});
  const wrap=$('branches');wrap.replaceChildren();
  branches.forEach(([id,title])=>{
    const block=document.createElement('section');block.className='branch';
    const heading=document.createElement('h3');heading.textContent=title;block.append(heading);
    Outbreak.UPGRADES.filter(item=>item.branch===id).forEach(item=>{
      const result=Outbreak.buy(state,item.id);
      const button=document.createElement('button');
      button.type='button';
      button.textContent=item.name+' · '+item.cost+'p';
      button.title=item.text;
      button.disabled=state.owned.includes(item.id)||!result.ok;
      if(state.owned.includes(item.id))button.textContent=item.name+' · taken';
      button.onclick=()=>{const bought=Outbreak.buy(state,item.id);if(bought.ok){say(bought.reason);setState(bought.state);}else say(bought.reason);};
      block.append(button);
    });
    wrap.append(block);
  });
}
function openLanes(id){
  const names={land:'land',sea:'sea',air:'sky'};
  const bits=Outbreak.LINKS.filter(link=>link.a===id||link.b===id).map(link=>{
    const other=Outbreak.landById(link.a===id?link.b:link.a).name;
    return other+' by '+(Outbreak.linkOpen(state,link)?'open '+names[link.kind]:names[link.kind]+' (closed)');
  });
  return bits.join('. ')+'.';
}
function paint(now){
  clock=now/1000;
  ctx.setTransform(1,0,0,1,0,0);
  ctx.clearRect(0,0,map.width,map.height);
  const dpr=map.width/innerWidth;
  ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.translate(view.ox,view.oy);ctx.scale(view.scale,view.scale);
  sea();
  masses();
  Outbreak.LINKS.forEach(link=>route(link));
  Outbreak.LANDS.forEach(land=>node(land));
  arc();
  requestAnimationFrame(paint);
}
function sea(){
  const g=ctx.createLinearGradient(0,0,0,620);
  g.addColorStop(0,'#1c6472');g.addColorStop(.55,'#134652');g.addColorStop(1,'#0c2c34');
  ctx.fillStyle=g;ctx.fillRect(-200,-200,1400,1000);
  ctx.strokeStyle='#ffffff16';ctx.lineWidth=2;
  for(let i=0;i<9;i++){
    ctx.beginPath();
    for(let x=0;x<=1000;x+=20){
      const y=70+i*62+Math.sin(x/90+clock*.6+i)*8;
      if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    }
    ctx.stroke();
  }
}
function blob(x,y,rx,ry,fill){
  ctx.fillStyle='#06181d66';ctx.beginPath();ctx.ellipse(x+10,y+16,rx,ry,0,0,7);ctx.fill();
  ctx.fillStyle=fill;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,7);ctx.fill();
  ctx.fillStyle='#ffffff18';ctx.beginPath();ctx.ellipse(x-rx*.2,y-ry*.35,rx*.45,ry*.28,0,0,7);ctx.fill();
}
function masses(){
  blob(250,300,210,190,'#c5d4ae');
  blob(560,340,230,180,'#d2c49a');
  blob(90,150,54,40,'#d7c7a2');
  blob(860,450,62,42,'#c9d3b0');
  blob(900,150,58,40,'#e3d2ae');
}
function curve(a,b,kind){
  const lift=kind==='air'?-36:kind==='sea'?28:0;
  const mx=(a.x+b.x)/2,my=(a.y+b.y)/2+lift;
  ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.quadraticCurveTo(mx,my,b.x,b.y);
  return {mx,my};
}
function route(link){
  const a=Outbreak.landById(link.a),b=Outbreak.landById(link.b),open=state?Outbreak.linkOpen(state,link):link.kind==='land';
  const colors={land:'#f4efe2',sea:'#8fd0c8',air:'#f0d78a'};
  ctx.save();ctx.lineWidth=open?3:1.5;ctx.strokeStyle=open?colors[link.kind]:'#ffffff33';
  if(!open)ctx.setLineDash([4,7]);
  curve(a,b,link.kind);ctx.stroke();ctx.restore();
  if(!open||!state)return;
  const from=state.lands[link.a].mark>0.2?a:state.lands[link.b].mark>0.2?b:null;
  if(!from)return;
  const t=(clock*0.25+a.x/1000)%1;
  const p=quad(a,b,link.kind,t);
  ctx.fillStyle=colors[link.kind];ctx.beginPath();ctx.arc(p.x,p.y,4,0,7);ctx.fill();
}
function quad(a,b,kind,t){
  const lift=kind==='air'?-36:kind==='sea'?28:0;
  const mx=(a.x+b.x)/2,my=(a.y+b.y)/2+lift;
  const u=1-t;
  return {x:u*u*a.x+2*u*t*mx+t*t*b.x,y:u*u*a.y+2*u*t*my+t*t*b.y};
}
function node(land){
  const cell=state?state.lands[land.id]:{mark:land.id==='hearthlow'?0.16:0,established:false};
  const mark=cell.mark||0;
  const fill=mix('#f4efe2',mark>0.62?'#8d3140':'#e07a3d',Math.min(1,mark*1.2));
  if(land.id===selected){ctx.strokeStyle='#f4efe2';ctx.lineWidth=6;ctx.beginPath();ctx.arc(land.x,land.y,30,0,7);ctx.stroke();}
  ctx.fillStyle='#10201855';ctx.beginPath();ctx.arc(land.x+3,land.y+5,22,0,7);ctx.fill();
  ctx.fillStyle=fill;ctx.beginPath();ctx.arc(land.x,land.y,22,0,7);ctx.fill();
  if(cell.established){ctx.strokeStyle='#f0d78a';ctx.lineWidth=3;ctx.beginPath();ctx.arc(land.x,land.y,26+Math.sin(clock*3+land.x)*1.5,0,7);ctx.stroke();}
  icon(land);
  ctx.font='bold 13px Georgia,serif';ctx.textAlign='center';
  ctx.lineWidth=4;ctx.strokeStyle='#10241f';ctx.strokeText(land.name,land.x,land.y+40);
  ctx.fillStyle='#f7f3e8';ctx.fillText(land.name,land.x,land.y+40);
}
function icon(land){
  ctx.save();ctx.translate(land.x,land.y);ctx.fillStyle='#1b2a24';
  if(land.kind==='isle'){ctx.beginPath();ctx.arc(0,-2,6,0,7);ctx.fill();}
  else if(land.kind==='coast'){ctx.fillRect(-7,-2,14,4);ctx.fillRect(-2,-8,4,12);}
  else if(land.id==='hearthlow'){ctx.beginPath();ctx.moveTo(0,-8);ctx.lineTo(8,0);ctx.lineTo(-8,0);ctx.fill();}
  else {ctx.fillRect(-5,-5,10,10);}
  ctx.restore();
}
function mix(a,b,t){
  const pa=[1,3,5].map(i=>parseInt(a.slice(i,i+2),16)),pb=[1,3,5].map(i=>parseInt(b.slice(i,i+2),16));
  return '#'+pa.map((v,i)=>Math.round(v+(pb[i]-v)*t).toString(16).padStart(2,'0')).join('');
}
function arc(){
  if(!state)return;
  ctx.strokeStyle='#ffffff22';ctx.lineWidth=8;ctx.beginPath();ctx.arc(500,310,300,Math.PI*1.15,Math.PI*1.85);ctx.stroke();
  ctx.strokeStyle='#d5e7f2';ctx.beginPath();ctx.arc(500,310,300,Math.PI*1.15,Math.PI*1.15+Math.PI*0.7*state.effort);ctx.stroke();
}
function nearest(x,y){
  let best=null,dist=42;
  Outbreak.LANDS.forEach(land=>{const d=Math.hypot(land.x-x,land.y-y);if(d<dist){dist=d;best=land.id;}});
  return best;
}
function boot(next){
  state=next;selected='hearthlow';$('title').hidden=true;$('help').hidden=true;$('end').hidden=true;$('sheet').hidden=false;$('dock').hidden=false;
  refresh();persist();say(scenarioMeta(state.scenario).text);map.focus();
}
function startNew(){
  const seed=Math.max(1,Math.floor(Number($('seed').value)||1))>>>0;
  boot(Outbreak.create({seed,scenario:setup.scenario,archetype:setup.archetype,pressure:setup.pressure}));
}
function stepOnce(){if(!state||state.won||state.lost)return;setState(Outbreak.step(state),true);}
function bind(){
  const scenes=$('scenarios');
  Outbreak.SCENARIOS.forEach(item=>{
    const button=document.createElement('button');
    button.type='button';button.textContent=item.name;
    button.title=item.text;button.setAttribute('aria-pressed',String(item.id===setup.scenario));
    button.onclick=()=>{setup.scenario=item.id;if(item.id==='calm')setup.pressure='calm';[...scenes.children].forEach(child=>child.setAttribute('aria-pressed',String(child===button)));document.querySelectorAll('[data-pressure]').forEach(child=>child.setAttribute('aria-pressed',String(child.dataset.pressure===setup.pressure)));};
    scenes.append(button);
  });
  $('pickDrift').onclick=()=>{setup.archetype='drift';$('pickDrift').setAttribute('aria-pressed','true');$('pickRoot').setAttribute('aria-pressed','false');};
  $('pickRoot').onclick=()=>{setup.archetype='root';$('pickRoot').setAttribute('aria-pressed','true');$('pickDrift').setAttribute('aria-pressed','false');};
  document.querySelectorAll('[data-pressure]').forEach(button=>button.onclick=()=>{setup.pressure=button.dataset.pressure;document.querySelectorAll('[data-pressure]').forEach(child=>child.setAttribute('aria-pressed',String(child===button)));});
  $('begin').onclick=startNew;
  const saved=loadSave();
  if(saved){$('resume').hidden=false;$('resume').onclick=()=>boot(saved);}
  $('next').onclick=stepOnce;
  $('play').onclick=()=>{playing=!playing;$('play').setAttribute('aria-pressed',String(playing));$('play').textContent=playing?'Pause':'Watch';};
  $('rules').onclick=()=>$('help').hidden=false;
  $('closeHelp').onclick=()=>{$('help').hidden=true;map.focus();};
  $('again').onclick=()=>{$('title').hidden=false;$('end').hidden=true;playing=false;};
  $('endAgain').onclick=()=>{$('title').hidden=false;$('end').hidden=true;playing=false;};
  map.addEventListener('pointerdown',event=>{
    const rect=map.getBoundingClientRect();
    const point=worldPoint(event.clientX-rect.left,event.clientY-rect.top);
    const hit=nearest(point.x,point.y);
    if(hit){selected=hit;refresh();say(Outbreak.landById(hit).name);}
  });
  addEventListener('keydown',event=>{
    if(['INPUT','TEXTAREA'].includes(event.target.tagName))return;
    if(!$('title').hidden||!$('help').hidden){if(event.key==='Escape')$('help').hidden=true;return;}
    const index=Outbreak.LANDS.findIndex(land=>land.id===selected);
    if(event.key==='ArrowRight'||event.key==='ArrowDown'){event.preventDefault();selected=Outbreak.LANDS[(index+1)%Outbreak.LANDS.length].id;refresh();}
    if(event.key==='ArrowLeft'||event.key==='ArrowUp'){event.preventDefault();selected=Outbreak.LANDS[(index+Outbreak.LANDS.length-1)%Outbreak.LANDS.length].id;refresh();}
    if((event.key==='n'||event.key==='N')&&!event.repeat)stepOnce();
    if(event.key==='Escape'){$('help').hidden=true;$('end').hidden=true;}
  });
  setInterval(()=>{if(playing)stepOnce();},900);
  addEventListener('resize',resize);resize();
  requestAnimationFrame(paint);
}
bind();
