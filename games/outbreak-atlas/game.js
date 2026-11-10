'use strict';
const $=id=>document.getElementById(id);
const KEY='outbreak-atlas-v1';
const map=$('map'),ctx=map.getContext('2d');
let state=null,selected='hearthlow',playing=false,timer=0,clock=0,flashes=[],view={w:1000,h:620,scale:1,ox:0,oy:0};
let setup={scenario:'world',archetype:'drift',pressure:'breezy'};
const branches=[['tide','Tide'],['veil','Veil'],['hold','Hold']];
const TERRITORY={
  lantern:[[24,108],[46,64],[96,48],[132,78],[124,132],[78,164],[32,146]],
  northwind:[[150,78],[214,28],[348,24],[392,72],[352,138],[236,154],[156,128]],
  glassmere:[[392,72],[500,36],[592,74],[548,154],[430,162],[352,138]],
  pale:[[592,74],[708,42],[792,86],[756,164],[640,172],[548,154]],
  farwhistle:[[824,36],[888,18],[958,46],[968,112],[904,148],[828,118]],
  mothfen:[[108,168],[156,128],[236,154],[268,236],[214,318],[118,304],[86,230]],
  hearthlow:[[236,154],[352,138],[430,162],[456,248],[372,312],[252,292],[228,214]],
  bramble:[[430,162],[548,154],[612,228],[536,312],[456,248]],
  cinder:[[372,312],[536,312],[568,392],[468,458],[332,404],[348,332]],
  redkettle:[[118,304],[252,292],[332,404],[286,512],[146,492],[96,386]],
  velvet:[[332,404],[468,458],[498,542],[308,548],[268,452]],
  orchard:[[468,458],[620,428],[704,508],[548,568],[498,542]],
  sable:[[536,312],[640,172],[756,164],[808,286],[736,428],[620,428],[568,392]],
  spire:[[792,424],[858,392],[944,424],[956,512],[876,552],[792,500]]
};
const LABEL_AT={
  lantern:[78,168],northwind:[270,154],glassmere:[470,158],pale:[670,168],farwhistle:[890,150],
  mothfen:[168,300],hearthlow:[330,292],bramble:[510,300],cinder:[430,430],
  redkettle:[200,470],velvet:[390,530],orchard:[590,548],sable:[700,360],spire:[870,530]
};

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
  const prev=state;
  state=next;selected=state.lands[selected]?selected:'hearthlow';
  refresh();persist();
  if(announce&&prev){const note=monthNotes(prev,next);say(note);showPulse(note);}
  else if(announce)say(state.log[0]||'');
  if(state.won||state.lost){playing=false;$('play').setAttribute('aria-pressed','false');$('play').textContent='Watch';showEnd();}
}
function monthNotes(prev,next){
  const lines=[];
  if(next.owned.length>prev.owned.length){const id=next.owned.find(item=>!prev.owned.includes(item));lines.push(Outbreak.upgradeById(id).name+' is now affecting spread.');}
  Outbreak.LANDS.forEach(land=>{
    const before=prev.lands[land.id],after=next.lands[land.id];
    if(!before.established&&after.established)lines.push(land.name+' is newly established.');
    else if(!before.foothold&&after.foothold)lines.push(land.name+' is newly infected.');
  });
  const awareness=Math.round((next.talk-prev.talk)*100),cure=Math.round((next.effort-prev.effort)*100);
  lines.push('Awareness '+(awareness>=0?'+':'')+awareness+'%. Cure pressure '+(cure>=0?'+':'')+cure+'%.');
  if(next.won)lines.push(state.log[0]);
  if(next.lost)lines.push('Cure pressure filled before the objective.');
  return lines.join(' ');
}
function showPulse(text){
  const pulse=$('pulse');pulse.hidden=false;pulse.textContent=text;
  clearTimeout(showPulse.timer);showPulse.timer=setTimeout(()=>{pulse.hidden=true;},3400);
}
function objectiveLine(current){
  const done=Outbreak.establishedCount(current);
  if(current.scenario==='quiet')return 'Quiet Circuit '+Math.min(done,8)+'/8 established · awareness '+Math.round(current.talk*100)+'% (limit 50%)';
  if(current.scenario==='twin')return 'Twin Lights · Lantern Isles '+(current.lands.lantern.established?'established':'open')+' · Farwhistle '+(current.lands.farwhistle.established?'established':'open');
  if(current.scenario==='hearth')return 'Hearthhold '+current.hearthStreak+'/8 heavy months in Hearthlow';
  return 'World Spread '+done+'/14 lands established';
}
function showEnd(){
  $('endTitle').textContent=state.won?'The infection holds.':'Cure pressure wins.';
  $('endText').textContent=objectiveLine(state)+'. Month '+state.month+'. Awareness '+Math.round(state.talk*100)+'%. Cure pressure '+Math.round(state.effort*100)+'%. '+(state.log[0]||'');
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
  const status=cell.established?'Established infection':cell.foothold?'Foothold':mark>5?'Infected':'Not infected';
  $('landText').textContent=land.blurb+' Infection '+mark+'%. '+status+'. '+(land.kind==='isle'?'Island. ':'')+openLanes(land.id);
  $('objective').textContent=objectiveLine(state);
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
  renderTree();
}
const LAYOUT={
  tide:[['footpaths','carts','season','echo'],['harbors','ferries'],['sky','tailwinds']],
  veil:[['soft','dim','borrowed','still','memory'],['ports','maps'],['greyskies']],
  hold:[['roots','second','stones','rhythm','lasting'],['stories','ember','wide']]
};
let previewId=null;
function upgradeState(item){
  if(!state)return 'locked';
  if(state.owned.includes(item.id))return 'owned';
  if((item.requires||[]).some(id=>!state.owned.includes(id)))return 'locked';
  if(state.points<item.cost||state.won||state.lost)return 'pricey';
  return 'ready';
}
function renderTree(){
  const root=$('tree');if(!root||!state)return;
  root.replaceChildren();
  branches.forEach(([id,title])=>{
    const section=document.createElement('section');section.className='grow';
    const heading=document.createElement('h3');heading.textContent=title+' · '+(id==='tide'?'spread':id==='veil'?'stealth':'persistence');
    section.append(heading);
    const cols=document.createElement('div');cols.className='cols';
    LAYOUT[id].forEach(chain=>{
      const column=document.createElement('div');column.className='chain';
      chain.forEach(upgradeId=>{
        const item=Outbreak.upgradeById(upgradeId),mode=upgradeState(item);
        const button=document.createElement('button');
        button.type='button';button.className='node '+mode;button.dataset.upgrade=item.id;
        button.setAttribute('aria-pressed',String(previewId===item.id));
        const needs=(item.requires||[]).map(req=>Outbreak.upgradeById(req).name);
        const short=mode==='owned'?'Owned':mode==='locked'?'Needs '+needs.join(' + '):mode==='pricey'?item.cost+' pts needed':item.cost+' pt'+(item.cost>1?'s':'');
        button.innerHTML=glyph(item.id)+'<span><b>'+item.name+'</b><small>'+short+'</small></span>';
        button.onclick=()=>selectUpgrade(item.id);
        if(column.childElementCount){const joint=document.createElement('i');joint.className='joint';joint.setAttribute('aria-hidden','true');column.append(joint);}
        column.append(button);
      });
      cols.append(column);
    });
    section.append(cols);root.append(section);
  });
  const chosen=previewId&&Outbreak.upgradeById(previewId);
  const mode=chosen?upgradeState(chosen):'';
  $('treePreview').textContent=chosen?(chosen.name+' · '+(mode==='owned'?'Owned. ':mode==='locked'?'Locked. ':mode==='pricey'?'Not enough points. ':'Ready. ')+chosen.text+(chosen.requires&&chosen.requires.length?' Requires '+chosen.requires.map(id=>Outbreak.upgradeById(id).name).join(' and ')+'.':'')):'Select an upgrade to see its cost and exact effect.';
  $('buyUpgrade').disabled=mode!=='ready';
  $('buyUpgrade').textContent=chosen&&mode==='ready'?'Buy '+chosen.name:'Buy selected upgrade';
}
function glyph(id){
  const paths={footpaths:'M3 16c4-7 8-7 12 0M8 16v4M16 16v4',carts:'M4 15h12l2-6H7M7 18a2 2 0 104 0M14 18a2 2 0 104 0',harbors:'M4 16h16M6 16V8h4v8M14 16v-5h4v5',ferries:'M3 15h14l2 3H5zM8 15V9h6v6',sky:'M3 14l8-6 8 6M8 14v4M14 14v4',tailwinds:'M4 16c3-6 6-6 8 0M12 16c2-5 4-5 6 0',season:'M12 4v16M4 12h16M6 6l12 12M18 6L6 18',echo:'M6 14a6 6 0 0112 0M9 14a3 3 0 016 0',soft:'M6 14c2-4 4-4 6 0s4 4 6 0',dim:'M5 16h14M8 12h8M10 8h4',borrowed:'M12 5v8M8 9l4-4 4 4M6 18h12',ports:'M4 17h16M8 17V8l4 3 4-3v9',greyskies:'M6 16h12M8 12h8M7 8c2-2 8-2 10 0',still:'M4 14c2 2 4 2 6 0s4-2 6 0 4 2 4 0',memory:'M6 6h12v12H6zM9 10h6M9 14h4',maps:'M5 7l5-2 5 2 4-1v12l-4 1-5-2-5 2z',roots:'M12 4v8M12 12c-4 2-6 6-6 8M12 12c4 2 6 6 6 8',second:'M6 16c2-8 10-8 12 0M8 16h8',stones:'M6 16l3-8h6l3 8z',stories:'M6 5h10v14H6zM8 9h6M8 13h4',ember:'M12 18c4 0 6-3 4-7-2 2-4 1-4-3-3 3-6 5-6 8 0 2 2 2 6 2z',rhythm:'M4 14c2-4 4 4 6 0s4 4 6 0 4 4 4 0',wide:'M4 16l8-8 8 8M8 16v3M16 16v3',lasting:'M7 12l3 3 7-8'};
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+(paths[id]||'M5 12h14')+'" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}
function selectUpgrade(id){
  previewId=id;
  document.querySelectorAll('#tree .node').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.upgrade===id)));
  const chosen=Outbreak.upgradeById(id),mode=upgradeState(chosen);
  $('treePreview').textContent=chosen.name+' · '+(mode==='owned'?'Owned. ':mode==='locked'?'Locked. ':mode==='pricey'?'Not enough points. ':'Ready to buy. ')+chosen.text+(chosen.requires&&chosen.requires.length?' Requires '+chosen.requires.map(req=>Outbreak.upgradeById(req).name).join(' and ')+'.':'');
  $('buyUpgrade').disabled=mode!=='ready';
  $('buyUpgrade').textContent=mode==='ready'?'Buy '+chosen.name:'Buy selected upgrade';
}
function purchaseUpgrade(){
  if(!previewId)return;
  const bought=Outbreak.buy(state,previewId);
  say(bought.reason||bought.state&&bought.state.log[0]);
  if(bought.ok)setState(bought.state);
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
  Outbreak.LANDS.forEach(land=>territory(land));
  Outbreak.LINKS.forEach(link=>route(link));
  Outbreak.LANDS.forEach(land=>capital(land));
  Outbreak.LANDS.forEach(land=>label(land));
  requestAnimationFrame(paint);
}
function sea(){
  const g=ctx.createLinearGradient(0,0,200,620);
  g.addColorStop(0,'#1f6f7c');g.addColorStop(.45,'#14515d');g.addColorStop(1,'#0c313a');
  ctx.fillStyle=g;ctx.fillRect(-80,-40,1160,700);
  ctx.strokeStyle='rgba(214,236,232,.16)';ctx.lineWidth=1.5;
  for(let i=0;i<7;i++){
    ctx.beginPath();
    for(let x=-20;x<=1040;x+=16){
      const y=48+i*78+Math.sin(x/110+clock*.45+i)*7+Math.sin(x/40+i)*2;
      if(x===-20)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    }
    ctx.stroke();
  }
  ctx.fillStyle='rgba(244,239,226,.45)';ctx.font='italic 22px Georgia,serif';ctx.textAlign='left';
  ctx.fillText('The Amberwater',40,46);
  ctx.strokeStyle='rgba(186,214,196,.28)';
  [[120,210,26],[430,250,14],[790,240,22]].forEach(([x,y,r])=>{ctx.beginPath();ctx.ellipse(x,y,r,r*0.45,-0.4,0,7);ctx.stroke();});
}
function trace(poly){
  const n=poly.length;
  ctx.beginPath();
  for(let i=0;i<n;i++){
    const p0=poly[(i-1+n)%n],p1=poly[i],p2=poly[(i+1)%n],p3=poly[(i+2)%n];
    if(i===0)ctx.moveTo(p1[0],p1[1]);
    ctx.bezierCurveTo(p1[0]+(p2[0]-p0[0])/7,p1[1]+(p2[1]-p0[1])/7,p2[0]-(p3[0]-p1[0])/7,p2[1]-(p3[1]-p1[1])/7,p2[0],p2[1]);
  }
  ctx.closePath();
}
function inside(poly,x,y){
  let hit=false;
  for(let i=0,j=poly.length-1;i<poly.length;j=i++){
    const xi=poly[i][0],yi=poly[i][1],xj=poly[j][0],yj=poly[j][1];
    if(((yi>y)!==(yj>y))&&(x<(xj-xi)*(y-yi)/(yj-yi+0.00001)+xi))hit=!hit;
  }
  return hit;
}
function organic(poly){
  let cx=0,cy=0;
  poly.forEach(point=>{cx+=point[0];cy+=point[1];});
  cx/=poly.length;cy/=poly.length;
  const out=[],n=poly.length;
  for(let i=0;i<n;i++){
    const a=poly[i],b=poly[(i+1)%n];
    out.push(a);
    const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2,dx=mx-cx,dy=my-cy,len=Math.hypot(dx,dy)||1,bulge=8+((i*11)%10);
    out.push([mx+dx/len*bulge,my+dy/len*bulge]);
  }
  return out;
}
function territory(land){
  const poly=organic(TERRITORY[land.id]),cell=cellOf(land),mark=cell.mark||0;
  const base=land.kind==='isle'?'#d9c7a4':land.kind==='coast'?'#c9d3ae':land.id==='cinder'||land.id==='velvet'?'#d2c29a':'#b7c99a';
  ctx.save();
  ctx.shadowColor='#06202688';ctx.shadowBlur=12;ctx.shadowOffsetY=6;
  trace(poly);ctx.fillStyle='#0b242acc';ctx.fill();
  ctx.shadowColor='transparent';
  trace(poly);  ctx.fillStyle=mix(base,mark>0.62?'#8d3140':'#c4513a',Math.min(0.9,mark*1.05));ctx.fill();
  ctx.clip();
  if(mark>0.02){
    const radius=30+mark*120;
    const wash=ctx.createRadialGradient(land.x,land.y,8,land.x,land.y,radius);
    wash.addColorStop(0,'rgba(255,214,170,'+(0.35+mark*0.4)+')');
    wash.addColorStop(1,'rgba(255,214,170,0)');
    ctx.fillStyle=wash;ctx.fillRect(land.x-radius,land.y-radius,radius*2,radius*2);
  }
  detail(land);
  ctx.restore();
  trace(poly);
  ctx.lineWidth=8;ctx.strokeStyle='rgba(214,236,232,.34)';ctx.stroke();
  ctx.lineWidth=land.id===selected?3.5:1.7;
  ctx.strokeStyle=land.id===selected?'#f6e7b2':'#1a332c';
  ctx.stroke();
}
function detail(land){
  ctx.save();ctx.translate(land.x,land.y);ctx.strokeStyle='rgba(32,62,46,.55)';ctx.fillStyle='rgba(32,62,46,.55)';ctx.lineWidth=1.25;
  if(land.id==='mothfen'){for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(-28,i*8);ctx.lineTo(28,i*8+6);ctx.stroke();}}
  else if(land.id==='velvet'){for(let i=-1;i<=1;i++){ctx.beginPath();ctx.arc(i*16,8,12,Math.PI,0);ctx.stroke();}}
  else if(land.id==='cinder'){for(let i=0;i<8;i++)ctx.fillRect(-20+(i%4)*12,-8+Math.floor(i/4)*12,2,2);}
  else if(land.id==='orchard'){for(let i=-2;i<=2;i++){ctx.fillRect(-26,i*7,22,2);ctx.fillRect(6,i*7,16,2);}}
  else if(land.id==='redkettle'){ctx.fillRect(-8,-8,7,7);ctx.fillRect(6,-4,6,6);ctx.fillRect(-2,6,5,5);}
  else if(land.id==='glassmere'){ctx.beginPath();ctx.ellipse(0,-6,26,14,0,0,7);ctx.stroke();}
  else if(land.id==='hearthlow'){ctx.beginPath();ctx.moveTo(0,-10);ctx.lineTo(8,-2);ctx.lineTo(-8,-2);ctx.fill();ctx.fillRect(-5,-2,10,8);}
  else if(land.kind==='coast'||land.kind==='isle'){ctx.beginPath();ctx.moveTo(-16,6);ctx.lineTo(18,-4);ctx.stroke();ctx.fillRect(10,-8,3,10);}
  else {for(let i=0;i<5;i++){const x=-16+i*8,y=(i%2)*6-4;ctx.fillRect(x,y,2,6);ctx.fillRect(x+2,y-2,2,3);}}
  ctx.restore();
}
function cellOf(land){return state?state.lands[land.id]:{mark:land.id==='hearthlow'?0.16:0,established:false,foothold:false};}
function route(link){
  const a=Outbreak.landById(link.a),b=Outbreak.landById(link.b),open=state?Outbreak.linkOpen(state,link):link.kind==='land';
  const colors={land:'#f7f1df',sea:'#9fe0d4',air:'#f3d98a'};
  const lift=link.kind==='air'?-48:link.kind==='sea'?36:8;
  ctx.save();
  ctx.lineWidth=open?link.kind==='land'?4:3:1.4;
  ctx.strokeStyle=open?colors[link.kind]:'rgba(255,255,255,.28)';
  ctx.setLineDash(open?[12,8]:[4,7]);
  ctx.lineDashOffset=-clock*(open?28:0);
  ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.quadraticCurveTo((a.x+b.x)/2,(a.y+b.y)/2+lift,b.x,b.y);ctx.stroke();
  ctx.restore();
  if(!open||!state)return;
  const hot=state.lands[link.a].mark>0.2||state.lands[link.b].mark>0.2;
  if(!hot)return;
  for(let i=0;i<3;i++){
    const t=(clock*0.22+i/3+a.x/900)%1;
    const p=quad(a,b,lift,t);
    ctx.fillStyle=colors[link.kind];
    ctx.beginPath();ctx.arc(p.x,p.y,link.kind==='air'?3.5:4.5,0,7);ctx.fill();
  }
}
function quad(a,b,lift,t){
  const mx=(a.x+b.x)/2,my=(a.y+b.y)/2+lift,u=1-t;
  return {x:u*u*a.x+2*u*t*mx+t*t*b.x,y:u*u*a.y+2*u*t*my+t*t*b.y};
}
function capital(land){
  const cell=cellOf(land),mark=cell.mark||0;
  ctx.fillStyle='#10241fcc';ctx.beginPath();ctx.arc(land.x+2,land.y+3,7,0,7);ctx.fill();
  ctx.fillStyle=mark>0.62?'#f0d78a':mark>0.05?'#fff1df':'#24362f';
  ctx.beginPath();ctx.arc(land.x,land.y,6,0,7);ctx.fill();
  if(cell.established){ctx.strokeStyle='#f0d78a';ctx.lineWidth=2;ctx.beginPath();ctx.arc(land.x,land.y,11+Math.sin(clock*3)*.6,0,7);ctx.stroke();}
}
function label(land){
  const cell=cellOf(land),spot=LABEL_AT[land.id]||[land.x,land.y-30];
  const at=[Math.max(70,Math.min(930,spot[0])),Math.max(78,Math.min(560,spot[1]))];
  const name=land.name,pct=Math.round((cell.mark||0)*100)+'%';
  const status=cell.established?'Established':cell.foothold?'Foothold':(cell.mark||0)>0.05?'Infected':'Clear';
  ctx.font='600 15px system-ui,sans-serif';ctx.textAlign='center';
  const width=Math.max(ctx.measureText(name).width,ctx.measureText(status+' '+pct).width)+18;
  const x=at[0]-width/2,y=at[1]-16;
  round(x,y,width,36,8,'rgba(10,28,32,.9)');
  ctx.fillStyle='#f7f3e8';ctx.fillText(name,at[0],at[1]);
  ctx.font='700 12px system-ui,sans-serif';ctx.fillStyle=cell.established?'#f0d78a':'#f0c39a';
  ctx.fillText(status+' · '+pct,at[0],at[1]+14);
}
function round(x,y,w,h,r,color){
  ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();ctx.fillStyle=color;ctx.fill();
}
function mix(a,b,t){
  const pa=[1,3,5].map(i=>parseInt(a.slice(i,i+2),16)),pb=[1,3,5].map(i=>parseInt(b.slice(i,i+2),16));
  return '#'+pa.map((v,i)=>Math.round(v+(pb[i]-v)*t).toString(16).padStart(2,'0')).join('');
}
function nearest(x,y){
  const hit=Outbreak.LANDS.find(land=>inside(organic(TERRITORY[land.id]),x,y));
  if(hit)return hit.id;
  let best=null,dist=56;
  Outbreak.LANDS.forEach(land=>{const d=Math.hypot(land.x-x,land.y-y);if(d<dist){dist=d;best=land.id;}});
  return best;
}
function boot(next){
  state=next;setWatching(false);selected='hearthlow';previewId=null;$('title').hidden=true;$('help').hidden=true;$('growth').hidden=true;$('end').hidden=true;$('sheet').hidden=false;$('dock').hidden=false;
  refresh();persist();say(scenarioMeta(state.scenario).text);map.focus();
}
function startNew(){
  const seed=Math.max(1,Math.floor(Number($('seed').value)||1))>>>0;
  boot(Outbreak.create({seed,scenario:setup.scenario,archetype:setup.archetype,pressure:setup.pressure}));
}
function setWatching(value){playing=!!value&&!!state&&!state.won&&!state.lost&&$('title').hidden&&$('help').hidden&&$('growth').hidden;$('play').setAttribute('aria-pressed',String(playing));$('play').textContent=playing?'Pause':'Watch';}
function openSetup(){setWatching(false);$('title').hidden=false;$('end').hidden=true;$('help').hidden=true;$('growth').hidden=true;$('resume').hidden=!loadSave();}
function stepOnce(){if(!state||state.won||state.lost||!$('title').hidden||!$('help').hidden||!$('growth').hidden||document.hidden||window.StudyBridge?.paused)return;setState(Outbreak.step(state),true);}
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
  $('resume').hidden=!saved;$('resume').onclick=()=>{const latest=loadSave();if(latest)boot(latest);};
  $('next').onclick=stepOnce;
  $('play').onclick=()=>setWatching(!playing);
  $('growthBtn').onclick=()=>{setWatching(false);$('growth').hidden=false;document.querySelector('#tree .node')?.focus();};
  $('closeGrowth').onclick=()=>{$('growth').hidden=true;map.focus();};
  $('buyUpgrade').onclick=purchaseUpgrade;
  $('rules').onclick=()=>{setWatching(false);$('help').hidden=false;};
  $('closeHelp').onclick=()=>{$('help').hidden=true;map.focus();};
  $('again').onclick=openSetup;
  $('endAgain').onclick=openSetup;
  map.addEventListener('pointerdown',event=>{
    const rect=map.getBoundingClientRect();
    const point=worldPoint(event.clientX-rect.left,event.clientY-rect.top);
    const hit=nearest(point.x,point.y);
    if(hit){selected=hit;refresh();say(Outbreak.landById(hit).name);}
  });
  addEventListener('keydown',event=>{
    if(['INPUT','TEXTAREA'].includes(event.target.tagName))return;
    if(!$('title').hidden||!$('help').hidden||!$('growth').hidden){if(event.key==='Escape'){$('help').hidden=true;$('growth').hidden=true;}return;}
    const index=Outbreak.LANDS.findIndex(land=>land.id===selected);
    if(event.key==='ArrowRight'||event.key==='ArrowDown'){event.preventDefault();selected=Outbreak.LANDS[(index+1)%Outbreak.LANDS.length].id;refresh();}
    if(event.key==='ArrowLeft'||event.key==='ArrowUp'){event.preventDefault();selected=Outbreak.LANDS[(index+Outbreak.LANDS.length-1)%Outbreak.LANDS.length].id;refresh();}
    if((event.key==='n'||event.key==='N')&&!event.repeat)stepOnce();
    if(event.key==='Escape'){$('help').hidden=true;$('end').hidden=true;}
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden)setWatching(false);});
  addEventListener('blur',()=>setWatching(false));
  addEventListener('message',e=>{if(e.source===parent&&e.data?.type==='study-visibility'&&e.data.visible===false)setWatching(false);});
  setInterval(()=>{if(playing)stepOnce();},900);
  addEventListener('resize',resize);resize();
  requestAnimationFrame(paint);
}
bind();
