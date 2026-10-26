// Lucky Pier prize arcade interior: a neon 2D room drawn on its own canvas,
// laid over the 3D world while the player is inside. Mouse, keyboard and touch.
import {ARCADE_GAMES,PRIZES,TOKEN_PRICE,TOKEN_PACKS,gameById,prizeById,buyTokens,startPlay,finishPlay,redeemPrize,equipGrip,toggleHat,normalizeArcade} from './arcade-core.mjs?v=137';
import {createGame,stepGame,SKEE_HOLES,skeeLanding,HOOP,hoopX,WHACK_HOLES,laneX,DROP_R,DROP_EDGE} from './arcade-games.mjs?v=137';
import {playArcadeCue} from './arcade-audio.mjs?v=137';

const SLOTS=[{kind:'tokens',name:'Token machine',color:'#ffe066'},...ARCADE_GAMES.map(g=>({kind:'game',id:g.id,name:g.name,color:g.color})),{kind:'prizes',name:'Prize counter',color:'#ff7ad9'}];
const SHAKE={jackpot:.9,prize:.7,whack:.35,slip:.45,buzz:.5,thud:.3,rim:.25,board:.3,hit:.35,swish:.3,coin:.2,end:.4};
const POSTER_ART={'poster-pier':['#2a0f45','#ff5fb8','LUCKY PIER'],'poster-bear':['#06324a','#43e8ff','SURF BEAR'],'poster-kick':['#2b1a0b','#ffd23f','KICKFLIP']};
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const hex=n=>'#'+(n>>>0).toString(16).padStart(6,'0');

const CSS=`#arcadeRoot{position:fixed;inset:0;z-index:2000;background:#0b0418;color:#f4ecff;font-family:system-ui,sans-serif;touch-action:none;user-select:none;-webkit-user-select:none;overflow:hidden}
#arcadeRoot canvas{position:absolute;inset:0;display:block}
#arcadeHUD{position:absolute;top:10px;left:10px;right:10px;display:flex;gap:10px;align-items:center;z-index:2;pointer-events:none}
#arcadeHUD>*{pointer-events:auto}#arcadeHUD .arcStat{background:rgba(20,8,40,.8);border:2px solid #ffd23f;border-radius:999px;padding:6px 14px;font-weight:800;box-shadow:0 0 12px rgba(255,210,63,.35)}
#arcadeHUD .tix{border-color:#ff5fb8;box-shadow:0 0 12px rgba(255,95,184,.4)}
.arcBtn{font:800 15px system-ui;color:#160a26;background:linear-gradient(#ffe680,#ffc23d);border:0;border-radius:12px;padding:10px 16px;min-height:44px;cursor:pointer;box-shadow:0 0 14px rgba(255,210,63,.45);display:inline-flex;flex-direction:column;align-items:center;justify-content:center}
.arcBtn small{font-weight:700;opacity:.75}.arcBtn:disabled{filter:grayscale(1);opacity:.45;cursor:default}.arcBtn.ghost{background:rgba(40,18,70,.9);color:#f4ecff;border:2px solid #9b6bff;box-shadow:0 0 10px rgba(155,107,255,.4)}
#arcadePanel[hidden],#arcadeRoot[hidden]{display:none!important}
#arcadePanel{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;z-index:3;background:rgba(8,2,18,.55)}
.arcCard{background:linear-gradient(#24104a,#160a2c);border:3px solid #ff5fb8;border-radius:20px;padding:20px 24px;max-width:min(560px,92vw);max-height:84vh;overflow:auto;box-shadow:0 0 30px rgba(255,95,184,.45);text-align:center}
.arcCard.wide{max-width:none;width:min(900px,94vw);box-sizing:border-box}.arcCard h2{margin:0 0 6px;font-size:26px;color:#ff9be0;text-shadow:0 0 12px #ff5fb8}.arcCard p{margin:6px 0 12px}.arcCard .dim{opacity:.7}
.arcRow{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:10px 0}.arcPay{margin:6px 0;display:flex;gap:8px;justify-content:center;flex-wrap:wrap}
.arcGrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:10px;margin:10px 0 14px;text-align:left}
.arcPrize{display:grid;grid-template-columns:48px 1fr auto;gap:10px;align-items:center;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:8px}
.arcPrize.owned{border-color:#7dff6a}.arcPrize small{display:block;opacity:.7;font-size:12px}.arcPrize .arcBtn{padding:8px 10px;font-size:13px;max-width:116px}
.arcSw{display:flex;width:44px;height:44px;border-radius:10px;align-items:center;justify-content:center;font-style:normal;font-size:24px;box-shadow:inset 0 0 0 3px rgba(0,0,0,.25)}.arcSw.snack{background:#43e8ff}
.arcPo{display:flex;width:40px;height:52px;border-radius:4px;align-items:center;justify-content:center;font:900 8px system-ui;font-style:normal;text-align:center;border:2px solid currentColor}
.arcOwned{color:#7dff6a;font-weight:800;font-size:13px}.arcBig{font:900 56px system-ui;color:#ffe066;text-shadow:0 0 20px #ffd23f}.arcRec{color:#7dff6a;font-weight:800}
#arcadeTouch{position:absolute;bottom:14px;left:0;right:0;display:none;justify-content:center;gap:24px;z-index:2}
#arcadeTouch button{width:68px;height:68px;border-radius:50%;border:3px solid #43e8ff;background:rgba(20,8,40,.75);color:#fff;font-size:24px;box-shadow:0 0 14px rgba(67,232,255,.5)}
@media (pointer:coarse){#arcadeRoot.playing #arcadeTouch{display:flex}}`;
function injectCSS(){if(document.getElementById('arcadeCSS'))return;const el=document.createElement('style');el.id='arcadeCSS';el.textContent=CSS;document.head.appendChild(el);}
export function drawBear(g,x,y,r,color,{squash=1,face=true}={}){
 g.save();g.translate(x,y);g.scale(1/squash*.98+.02,squash);g.fillStyle=color;
 g.beginPath();g.ellipse(0,r*.55,r*.75,r*.8,0,0,Math.PI*2);g.fill();
 g.beginPath();g.arc(0,-r*.35,r*.58,0,Math.PI*2);g.fill();
 for(const s of[-1,1]){g.beginPath();g.arc(s*r*.45,-r*.82,r*.22,0,Math.PI*2);g.fill();g.beginPath();g.arc(s*r*.72,r*.2,r*.22,0,Math.PI*2);g.fill();g.beginPath();g.arc(s*r*.42,r*1.2,r*.25,0,Math.PI*2);g.fill();}
 g.fillStyle='rgba(255,255,255,.35)';g.beginPath();g.ellipse(-r*.22,-r*.55,r*.16,r*.1,-.5,0,Math.PI*2);g.fill();
 if(face){g.fillStyle='rgba(30,10,30,.75)';g.beginPath();g.arc(-r*.2,-r*.4,r*.07,0,Math.PI*2);g.arc(r*.2,-r*.4,r*.07,0,Math.PI*2);g.fill();g.beginPath();g.arc(0,-r*.2,r*.12,.2,Math.PI-.2);g.strokeStyle='rgba(30,10,30,.7)';g.lineWidth=Math.max(1,r*.06);g.stroke();}
 g.restore();
}
function drawCat(g,x,y,r){g.save();g.translate(x,y);g.fillStyle='#9aa0ab';g.beginPath();g.arc(0,0,r*.7,0,Math.PI*2);g.fill();for(const s of[-1,1]){g.beginPath();g.moveTo(s*r*.6,-r*.25);g.lineTo(s*r*.5,-r*.95);g.lineTo(s*r*.12,-r*.6);g.fill();}
 g.fillStyle='#f6e27a';g.beginPath();g.arc(-r*.25,-r*.05,r*.12,0,Math.PI*2);g.arc(r*.25,-r*.05,r*.12,0,Math.PI*2);g.fill();g.fillStyle='#222';g.fillRect(-r*.27,-r*.14,r*.04,r*.18);g.fillRect(r*.23,-r*.14,r*.04,r*.18);
 g.strokeStyle='#e9edf2';g.lineWidth=1.5;for(const s of[-1,1])for(const k of[-1,1]){g.beginPath();g.moveTo(s*r*.2,r*.2);g.lineTo(s*r*.85,r*.2+k*r*.12);g.stroke();}g.fillStyle='#ff8fb8';g.beginPath();g.arc(0,r*.15,r*.07,0,Math.PI*2);g.fill();g.restore();}
function glowText(g,text,x,y,size,color,{align='center',blur=18,font='900'}={}){g.save();g.font=font+' '+size+'px "Trebuchet MS",system-ui,sans-serif';g.textAlign=align;g.textBaseline='middle';g.shadowColor=color;g.shadowBlur=blur;g.fillStyle=color;g.fillText(text,x,y);g.shadowBlur=0;g.fillStyle='rgba(255,255,255,.85)';g.globalAlpha=.55;g.fillText(text,x,y);g.restore();}
function rrect(g,x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath();}
function neonRect(g,x,y,w,h,r,color,width=3){g.save();g.shadowColor=color;g.shadowBlur=16;g.strokeStyle=color;g.lineWidth=width;rrect(g,x,y,w,h,r);g.stroke();g.restore();}

export function createArcadeUI(host){
 let root=null,canvas=null,g=null,hud=null,panel=null,open=false,raf=0,lastT=0,clock=0;
 let view='lobby',sel=1,game=null,session=null,result=null,shake=0,particles=[],floaters=[],input=null,keysDown={},pointer={x:null,y:null,down:false},vp={x:0,y:0,w:1,h:1},spewing=0,hint=0;
 const st=()=>{const s=host.state();normalizeArcade(s);return s;};
 const sound=k=>{try{const a=host.audio?.();playArcadeCue(a?.ctx,k,a?.enabled!==false);}catch{}};
 function build(){injectCSS();
  root=document.createElement('div');root.id='arcadeRoot';root.hidden=true;root.setAttribute('role','application');root.setAttribute('aria-label','Lucky Pier Arcade');
  root.innerHTML='<canvas id="arcadeCanvas"></canvas><div id="arcadeHUD"></div><div id="arcadePanel" hidden></div><div id="arcadeTouch"><button data-a="left" aria-label="Left">◀</button><button data-a="act" aria-label="Action">●</button><button data-a="right" aria-label="Right">▶</button></div>';
  document.body.appendChild(root);canvas=root.querySelector('canvas');g=canvas.getContext('2d');hud=root.querySelector('#arcadeHUD');panel=root.querySelector('#arcadePanel');
  canvas.addEventListener('pointerdown',onDown);canvas.addEventListener('pointermove',onMove);addEventListener('pointerup',onUp);addEventListener('pointercancel',onUp);
  root.querySelectorAll('#arcadeTouch button').forEach(b=>{const a=b.dataset.a;b.onpointerdown=e=>{e.preventDefault();e.stopPropagation();if(a==='act'){keysDown.act=true;press();}else keysDown[a]=true;pointer.x=null;};b.onpointerup=b.onpointercancel=b.onpointerleave=e=>{if(a==='act'){if(keysDown.act)release();keysDown.act=false;}else keysDown[a]=false;};});
  root.addEventListener('click',onClick);addEventListener('keydown',onKey,true);addEventListener('keyup',onKeyUp,true);addEventListener('resize',resize);
 }
 function resize(){if(!canvas)return;const dpr=Math.min(2,devicePixelRatio||1),w=innerWidth,h=innerHeight;canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);canvas.style.width=w+'px';canvas.style.height=h+'px';g.setTransform(dpr,0,0,dpr,0,0);const W=Math.min(w-16,(h-70)*16/9),H=W*9/16;vp={x:(w-W)/2,y:Math.max(56,(h-H)/2+10),w:W,h:H};}
 // ---------- input ----------
 function inputFresh(){return {px:null,py:null,down:false,pressed:false,released:false,left:false,right:false,hole:-1};}
 function norm(e){const r=fieldRect();return {x:(e.clientX-r.x)/r.w,y:(e.clientY-r.y)/r.h};}
 function onDown(e){if(!open)return;e.preventDefault();const p=norm(e);pointer={x:p.x,y:p.y,down:true};if(view==='lobby'){lobbyPick(e);return;}if(view==='game'){input.px=p.x;input.py=p.y;press();}}
 function onMove(e){if(!open)return;const p=norm(e);if(e.pointerType==='mouse'||pointer.down){pointer.x=p.x;pointer.y=p.y;}if(view==='lobby'){const i=lobbyHit(e.clientX,e.clientY);if(i>=0&&e.pointerType==='mouse'&&i!==sel){sel=i;sound('ui');}}}
 function onUp(){if(!open)return;if(pointer.down&&view==='game')release();pointer.down=false;}
 function press(){if(!input)input=inputFresh();input.pressed=true;input.held=true;}
 function release(){if(!input)input=inputFresh();input.released=true;input.held=false;}
 const WHACK_KEYS=['q','w','e','a','s','d','z','x','c'];
 function onKey(e){if(!open)return;const k=e.key.toLowerCase();e.stopImmediatePropagation();if(['input','textarea','select'].includes(document.activeElement?.tagName?.toLowerCase()))return;
  if([' ','arrowleft','arrowright','arrowup','arrowdown','tab','enter'].includes(k))e.preventDefault();
  if(k==='escape'){if(view==='game')endGame(true);else if(view!=='lobby')toLobby();else leave();return;}
  if(view==='lobby'){if(k==='arrowleft'||k==='a'){sel=(sel+SLOTS.length-1)%SLOTS.length;sound('ui');}else if(k==='arrowright'||k==='d'){sel=(sel+1)%SLOTS.length;sound('ui');}else if(k==='enter'||k===' '||k==='e')activate(sel);return;}
  if(view==='game'){if(e.repeat)return;if(game?.id==='whack'){const n=/^[1-9]$/.test(k)?+k-1:WHACK_KEYS.indexOf(k);if(n>=0){input.hole=n;return;}}
   if(k==='arrowleft'||k==='a')keysDown.left=true;else if(k==='arrowright'||k==='d')keysDown.right=true;else if(k===' '||k==='enter'||k==='arrowup'||k==='w'){keysDown.act=true;pointer.x=null;press();}}
  if(view==='result'&&(k==='enter'||k===' '))replay();}
 function onKeyUp(e){if(!open)return;const k=e.key.toLowerCase();e.stopImmediatePropagation();if(k==='arrowleft'||k==='a')keysDown.left=false;else if(k==='arrowright'||k==='d')keysDown.right=false;else if(k===' '||k==='enter'||k==='arrowup'||k==='w'){if(keysDown.act&&view==='game')release();keysDown.act=false;}}
 function onClick(e){const b=e.target.closest('[data-arc]');if(!b||!open)return;e.preventDefault();const [cmd,arg]=b.dataset.arc.split(':');
  if(cmd==='leave')leave();else if(cmd==='lobby')toLobby();else if(cmd==='buy')buy(+arg);else if(cmd==='pay'){host.setPayment?.(arg);showTokens();}
  else if(cmd==='redeem')redeem(arg);else if(cmd==='grip'){equipGrip(st(),arg==='none'?null:arg);host.save();host.onPrize?.(null);sound('ui');showPrizes();}
  else if(cmd==='hat'){toggleHat(st());host.save();host.onPrize?.(null);sound('ui');showPrizes();}else if(cmd==='play')playGame(arg);else if(cmd==='again')replay();else if(cmd==='quit')endGame(true);}
 // ---------- lobby ----------
 function slotRect(i){const n=SLOTS.length,gap=vp.w*.012,w=(vp.w-gap*(n+1))/n,h=vp.h*.56;return {x:vp.x+gap+i*(w+gap),y:vp.y+vp.h*.3,w,h};}
 function lobbyHit(cx,cy){for(let i=0;i<SLOTS.length;i++){const r=slotRect(i);if(cx>=r.x&&cx<=r.x+r.w&&cy>=r.y-20&&cy<=r.y+r.h)return i;}return -1;}
 function lobbyPick(e){const i=lobbyHit(e.clientX,e.clientY);if(i<0)return;if(i===sel||e.pointerType!=='mouse'){sel=i;activate(i);}else{sel=i;sound('ui');}}
 function activate(i){const slot=SLOTS[i];if(!slot)return;sound('ui');if(slot.kind==='tokens')showTokens();else if(slot.kind==='prizes')showPrizes();else playGame(slot.id);}
 function drawLobby(t){
  const W=innerWidth,H=innerHeight;const bg=g.createLinearGradient(0,0,0,H);bg.addColorStop(0,'#14072a');bg.addColorStop(.55,'#22093d');bg.addColorStop(1,'#0a0414');g.fillStyle=bg;g.fillRect(0,0,W,H);
  // carpet: classic arcade cosmic squiggles, original pattern
  const floorY=vp.y+vp.h*.84;g.fillStyle='#120822';g.fillRect(0,floorY,W,H-floorY);g.save();g.globalAlpha=.55;for(let i=0;i<90;i++){const x=(i*137.5%W),y=floorY+((i*53)%Math.max(1,H-floorY));g.strokeStyle=['#43e8ff','#ff5fb8','#ffd23f','#7dff6a'][i%4];g.lineWidth=2;g.beginPath();g.arc(x,y,6+(i%3)*3,i,i+2.2);g.stroke();}g.restore();
  // back wall neon strips + bulb string
  for(let k=0;k<3;k++){g.fillStyle=['rgba(255,95,184,.08)','rgba(67,232,255,.07)','rgba(255,210,63,.06)'][k];g.fillRect(0,vp.y+vp.h*(.08+k*.07),W,4);}
  const bulbs=Math.floor(W/28);for(let i=0;i<bulbs;i++){const on=(Math.floor(t*6)+i)%3===0,x=14+i*28,y=vp.y-24+Math.sin(i*.9)*3;g.fillStyle=on?'#fff1a8':'#7a5a2a';g.shadowColor='#ffd23f';g.shadowBlur=on?16:0;g.beginPath();g.arc(x,y,4,0,Math.PI*2);g.fill();}g.shadowBlur=0;
  const flick=Math.sin(t*23)>.97?.4:1;g.globalAlpha=flick;glowText(g,'LUCKY PIER',vp.x+vp.w/2,vp.y+vp.h*.1,Math.round(vp.h*.11),'#ff5fb8',{blur:28});g.globalAlpha=1;
  glowText(g,'PRIZE ARCADE · TICKETS ONLY · SKILL GAMES',vp.x+vp.w/2,vp.y+vp.h*.2,Math.round(vp.h*.035),'#43e8ff',{blur:12,font:'800'});
  SLOTS.forEach((slot,i)=>{const r=slotRect(i),on=i===sel,bob=on?Math.sin(t*4)*3:0;g.save();g.translate(0,bob);
   const body=g.createLinearGradient(r.x,r.y,r.x+r.w,r.y);body.addColorStop(0,'#1c0f33');body.addColorStop(.5,'#2c1650');body.addColorStop(1,'#1c0f33');g.fillStyle=body;rrect(g,r.x,r.y,r.w,r.h,10);g.fill();
   neonRect(g,r.x,r.y,r.w,r.h,10,slot.color,on?4:2);
   g.fillStyle=slot.color;g.globalAlpha=.9;rrect(g,r.x+6,r.y+6,r.w-12,r.h*.16,6);g.fill();g.globalAlpha=1;
   const fs=Math.max(10,Math.min(r.w*.11,r.h*.06));g.font='900 '+fs+'px "Trebuchet MS",system-ui';g.fillStyle='#160a26';g.textAlign='center';g.textBaseline='middle';wrapText(g,slot.name.toUpperCase(),r.x+r.w/2,r.y+6+r.h*.08,r.w-16,fs*1.05);
   const sx=r.x+r.w*.12,sy=r.y+r.h*.26,sw=r.w*.76,sh=r.h*.36;g.fillStyle='#07030f';rrect(g,sx,sy,sw,sh,6);g.fill();drawIcon(slot,sx,sy,sw,sh,t);
   g.fillStyle='rgba(255,255,255,.08)';g.fillRect(sx+4,sy+4,sw*.4,4);
   g.fillStyle='#3a2266';rrect(g,r.x+r.w*.18,r.y+r.h*.7,r.w*.64,r.h*.08,5);g.fill();
   const sub=slot.kind==='game'?gameById(slot.id).cost+' TOKEN'+(gameById(slot.id).cost>1?'S':''):slot.kind==='tokens'?'$'+TOKEN_PRICE+' EACH':'REDEEM';glowText(g,sub,r.x+r.w/2,r.y+r.h*.74,Math.max(9,r.w*.09),'#ffe066',{blur:8,font:'800'});
   if(slot.kind==='game'){const best=st().arcade.best[slot.id]||0;g.font='700 '+Math.max(9,r.w*.075)+'px system-ui';g.fillStyle='rgba(255,255,255,.7)';g.fillText(best?'BEST '+best+' 🎟':'NEW',r.x+r.w/2,r.y+r.h*.88);}
   g.restore();
   if(on){g.fillStyle=slot.color;g.beginPath();g.moveTo(r.x+r.w/2-10,r.y+r.h+16);g.lineTo(r.x+r.w/2+10,r.y+r.h+16);g.lineTo(r.x+r.w/2,r.y+r.h+6);g.fill();}
  });
  const slot=SLOTS[sel],info=slot.kind==='game'?gameById(slot.id).blurb+' (~'+gameById(slot.id).secs+'s)':slot.kind==='tokens'?'Swap in-game cash for tokens at a fixed $'+TOKEN_PRICE+' each. Tokens never pay out cash.':'Trade tickets for grip tapes, a cap, RV posters and a snack.';
  g.font='600 '+Math.max(12,vp.h*.032)+'px system-ui';g.fillStyle='#f4ecff';g.textAlign='center';g.fillText(info,vp.x+vp.w/2,vp.y+vp.h*.93);
  g.font='600 '+Math.max(10,vp.h*.024)+'px system-ui';g.fillStyle='rgba(244,236,255,.6)';g.fillText('◀ ▶ choose · Enter or tap to play · Esc to leave',vp.x+vp.w/2,vp.y+vp.h*.975);
 }
 function wrapText(g,text,x,y,maxW,lh){const words=text.split(' ');let lines=[''];for(const w of words){const tryL=(lines.at(-1)+' '+w).trim();if(g.measureText(tryL).width>maxW&&lines.at(-1))lines.push(w);else lines[lines.length-1]=tryL;}lines.forEach((l,i)=>g.fillText(l,x,y+(i-(lines.length-1)/2)*lh));}
 function drawIcon(slot,x,y,w,h,t){g.save();g.beginPath();g.rect(x,y,w,h);g.clip();const cx=x+w/2,cy=y+h/2,r=Math.min(w,h)*.22;
  if(slot.kind==='tokens'){for(let i=0;i<3;i++){const yy=cy+r*.6-i*r*.35+Math.sin(t*3+i)*2;g.fillStyle='#ffd23f';g.beginPath();g.ellipse(cx,yy,r*1.1,r*.45,0,0,Math.PI*2);g.fill();g.strokeStyle='#a4741a';g.lineWidth=2;g.stroke();}glowText(g,'$'+TOKEN_PRICE,cx,cy-r*.9,r*.8,'#7dff6a',{blur:8});}
  else if(slot.kind==='prizes'){drawBear(g,cx-r*1.1,cy+r*.2,r*.7,'#ff5f7a');drawBear(g,cx+r*1.1,cy+r*.2,r*.7,'#5fd1ff');drawBear(g,cx,cy-r*.1,r*.85,'#ffd23f');}
  else if(slot.id==='claw'){drawBear(g,cx-r,cy+r*.9,r*.55,'#ff5f7a');drawBear(g,cx+r*.6,cy+r,r*.55,'#7dff6a');const sx=cx+Math.sin(t*1.5)*r;g.strokeStyle='#cfd6e6';g.lineWidth=2;g.beginPath();g.moveTo(sx,y);g.lineTo(sx,cy-r*.2);g.moveTo(sx,cy-r*.2);g.lineTo(sx-r*.4,cy+r*.2);g.moveTo(sx,cy-r*.2);g.lineTo(sx+r*.4,cy+r*.2);g.stroke();}
  else if(slot.id==='skee'){for(const [k,c] of [[1.4,'#43e8ff'],[1,'#ff5fb8'],[.6,'#ffd23f'],[.3,'#7dff6a']]){g.strokeStyle=c;g.lineWidth=3;g.beginPath();g.ellipse(cx,cy,r*k*1.3,r*k*.8,0,0,Math.PI*2);g.stroke();}const p=(t*.6)%1;g.fillStyle='#fff';g.beginPath();g.arc(cx,y+h-(h*.6)*p,r*.25,0,Math.PI*2);g.fill();}
  else if(slot.id==='drop'){g.fillStyle='#3c2a60';g.fillRect(x,y,w,h*.25+Math.sin(t*2.4)*h*.08);for(let i=0;i<5;i++)for(let k=0;k<3;k++){g.fillStyle=(i+k)%4===0?'#ffd23f':'#ff8fc8';g.beginPath();g.arc(x+w*(.15+i*.18),y+h*(.5+k*.18),r*.32,0,Math.PI*2);g.fill();}}
  else if(slot.id==='whack'){for(let i=0;i<3;i++){g.fillStyle='#05020a';g.beginPath();g.ellipse(x+w*(.2+i*.3),cy+r,r*.6,r*.22,0,0,Math.PI*2);g.fill();}const pop=Math.max(0,Math.sin(t*3));drawBear(g,x+w*.5,cy+r*(1.2-pop),r*.55,'#7dff6a');}
  else if(slot.id==='hoop'){g.fillStyle='#e9eef7';g.fillRect(cx+r*.6,cy-r*1.3,r*.15,r*1.2);g.strokeStyle='#ff8a3d';g.lineWidth=3;g.beginPath();g.moveTo(cx-r*.2,cy-r*.5);g.lineTo(cx+r*.6,cy-r*.5);g.stroke();const p=(t*.7)%1;g.fillStyle='#ff8a3d';g.beginPath();g.arc(cx-r*1.6+p*r*1.8,cy+r*1.2-Math.sin(p*Math.PI)*r*1.9,r*.28,0,Math.PI*2);g.fill();}
  g.restore();}
 // ---------- panels ----------
 function hudHTML(){const a=st().arcade;return '<button class="arcBtn ghost" data-arc="'+(view==='lobby'?'leave':'lobby')+'">'+(view==='lobby'?'⟵ Leave':'⟵ Lobby')+'</button><div class="arcStat tok">🪙 <b>'+a.tokens+'</b> tokens</div><div class="arcStat tix">🎟 <b>'+a.tickets+'</b> tickets</div>';}
 function refreshHUD(){if(hud)hud.innerHTML=hudHTML();}
 function showPanel(html){panel.innerHTML=html;panel.hidden=false;refreshHUD();}
 function hidePanel(){panel.hidden=true;panel.innerHTML='';}
 function showTokens(){view='tokens';const s=st(),cashLine=host.money?host.money():'';showPanel('<div class="arcCard"><h2>Token machine</h2><p>Fixed rate: <b>$'+TOKEN_PRICE+' per token</b>. Tokens are for play only and are never cashed back.</p>'+(cashLine?'<div class="arcPay">'+cashLine+'</div>':'')+'<div class="arcRow">'+TOKEN_PACKS.map(n=>'<button class="arcBtn" data-arc="buy:'+n+'">'+n+' token'+(n>1?'s':'')+'<small>$'+n*TOKEN_PRICE+'</small></button>').join('')+'</div><p class="dim">You have '+s.arcade.tokens+' tokens.</p><button class="arcBtn ghost" data-arc="lobby">Back</button></div>');}
 function buy(n){const r=buyTokens(st(),n,host.spend);if(r.ok){host.save();sound('coin');burst(innerWidth/2,innerHeight*.45,'#ffd23f',14);host.toast?.('+'+n+' tokens');}else{sound('deny');if(r.reason!=='funds')host.toast?.(r.reason);}showTokens();}
 function prizeIcon(p){if(p.kind==='grip')return '<i class="arcSw" style="background:'+hex(p.color)+'"></i>';if(p.kind==='poster'){const a=POSTER_ART[p.id];return '<i class="arcPo" style="background:'+a[0]+';color:'+a[1]+'">'+a[2]+'</i>';}if(p.kind==='hat')return '<i class="arcSw hat" style="background:'+hex(p.color)+'">🧢</i>';return '<i class="arcSw snack">🥤</i>';}
 function showPrizes(){view='prizes';const s=st(),a=s.arcade,day=host.day?.()||1;
  const cards=PRIZES.map(p=>{const owned=a.owned.includes(p.id);let btn;
   if(p.kind==='snack')btn=a.snackDay>=day?'<button class="arcBtn" disabled>Tomorrow</button>':'<button class="arcBtn" data-arc="redeem:'+p.id+'" '+(a.tickets<p.cost?'disabled':'')+'>🎟 '+p.cost+'</button>';
   else if(!owned)btn='<button class="arcBtn" data-arc="redeem:'+p.id+'" '+(a.tickets<p.cost?'disabled':'')+'>🎟 '+p.cost+'</button>';
   else if(p.kind==='grip')btn=a.grip===p.id?'<button class="arcBtn ghost" data-arc="grip:none">Equipped · remove</button>':'<button class="arcBtn" data-arc="grip:'+p.id+'">Equip</button>';
   else if(p.kind==='hat')btn='<button class="arcBtn'+(a.hat?' ghost':'')+'" data-arc="hat">'+(a.hat?'Wearing · take off':'Wear')+'</button>';
   else btn='<span class="arcOwned">Hung in the RV ✓</span>';
   return '<div class="arcPrize'+(owned?' owned':'')+'">'+prizeIcon(p)+'<div><b>'+esc(p.name)+'</b><small>'+esc(p.blurb)+'</small></div>'+btn+'</div>';}).join('');
  showPanel('<div class="arcCard wide"><h2>Prize counter</h2><p>You have <b>'+a.tickets+'</b> tickets. Prizes are keepsakes and never sell back.</p><div class="arcGrid">'+cards+'</div><button class="arcBtn ghost" data-arc="lobby">Back</button></div>');}
 function redeem(id){const r=redeemPrize(st(),id,host.day?.()||1);if(!r.ok){sound('deny');host.toast?.(r.reason);showPrizes();return;}host.save();sound('prize');shake=Math.max(shake,.5);burst(innerWidth/2,innerHeight*.4,'#ff7ad9',26);host.onPrize?.(r.prize,r);host.toast?.(r.prize.kind==='snack'?'Pier Fizz! +'+r.xp+' XP, stamina refilled.':'Won: '+r.prize.name+(r.prize.kind==='poster'?' (now in the RV)':''));showPrizes();}
 function toLobby(){view='lobby';game=null;session=null;hidePanel();refreshHUD();root.classList.remove('playing');}
 // ---------- games ----------
 function fieldRect(){const pad=vp.h*.04;return {x:vp.x+pad,y:vp.y+vp.h*.13,w:vp.w-pad*2,h:vp.h*.83};}
 let lastGame='claw';
 function playGame(id){const r=startPlay(st(),id);if(!r.ok){sound('deny');host.toast?.(r.reason);showTokens();return false;}host.save();lastGame=id;session=r.session;game=createGame(id,1+(st().arcade.plays*7)%5);input=inputFresh();keysDown={};view='game';hidePanel();refreshHUD();root.classList.add('playing');root.dataset.game=id;sound('start');hint=2.5;return true;}
 function replay(){if(view!=='result')return;playGame(lastGame);}
 function endGame(quit=false){if(!game||!session)return;game.done=true;const id=game.id,score=game.score;const r=finishPlay(st(),session,score);host.save();session=null;view='result';root.classList.remove('playing');result={id,tickets:r.tickets,record:r.record,quit};
  spew(r.tickets);sound(r.tickets>=15?'jackpot':'end');shake=Math.max(shake,r.tickets>=15?.8:.3);
  const g0=gameById(id);showPanel('<div class="arcCard result"><h2>'+esc(g0.name)+'</h2><div class="arcBig">+'+r.tickets+' 🎟</div>'+(r.record?'<p class="arcRec">New personal best!</p>':'')+'<p>Total tickets: <b>'+st().arcade.tickets+'</b></p><div class="arcRow"><button class="arcBtn" data-arc="again">Play again · '+g0.cost+' 🪙</button><button class="arcBtn" data-arc="lobby">Lobby</button></div></div>');
  host.emit?.(r.tickets>0?'xp':'ui');return r;}
 // Ticket spew: strips fly out of the cabinet slot, drawn on the canvas so it stays in step with the shake.
 let tickets=[];
 function spew(n){const count=Math.min(40,n),W=innerWidth,H=innerHeight;for(let i=0;i<count;i++)tickets.push({x:W/2+(Math.random()-.5)*40,y:H+20,vx:(Math.random()-.5)*420,vy:-(520+Math.random()*420),rot:(Math.random()-.5)*.6,vr:(Math.random()-.5)*7,delay:i*.045,life:1.8,born:false});}
 function drawTickets(dt){for(const k of tickets){k.delay-=dt;if(k.delay>0)continue;if(!k.born){k.born=true;sound('ticket');}k.life-=dt;k.vy+=900*dt;k.x+=k.vx*dt;k.y+=k.vy*dt;k.rot+=k.vr*dt;
  g.save();g.globalAlpha=Math.max(0,Math.min(1,k.life*1.5));g.translate(k.x,k.y);g.rotate(k.rot);g.fillStyle='#ff9f43';g.fillRect(-34,-13,68,26);g.fillStyle='#e07a1f';g.fillRect(28,-13,6,26);g.fillRect(-34,-13,6,26);g.fillStyle='#5a2a00';g.font='900 11px system-ui';g.textAlign='center';g.textBaseline='middle';g.fillText('TICKET',0,1);g.restore();}
  tickets=tickets.filter(k=>k.delay>0||(k.life>0&&k.y<innerHeight+60));}
 function burst(x,y,color,n=12){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,v=80+Math.random()*220;particles.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-60,life:.7+Math.random()*.4,color,size:2+Math.random()*3});}}
 function float(text,x,y,color='#ffe066'){floaters.push({text,x,y,t:0,color});}
 function gameEvents(f){for(const e of game.events){sound(e.kind==='prize'?'prize':e.kind);if(SHAKE[e.kind])shake=Math.max(shake,SHAKE[e.kind]);
  const at=evPos(e,f);if(['prize','jackpot','hit','whack','swish','coin','clack'].includes(e.kind))burst(at.x,at.y,e.kind==='jackpot'||e.gold?'#ffd23f':gameById(game.id).color,e.kind==='jackpot'?24:10);
  if(e.value||e.pts)float('+'+(e.value||e.pts),at.x,at.y-20);}}
 function evPos(e,f){const id=game.id;if(id==='claw')return {x:f.x+f.w*(game.clawX+game.sway),y:f.y+f.h*game.clawY};if(id==='skee'&&game.last)return {x:f.x+f.w*game.last.x,y:f.y+f.h*game.last.y};if(id==='drop')return {x:f.x+f.w*(e.x??game.dropX),y:f.y+f.h*(e.x!=null?.95:.2)};if(id==='whack'){const h=WHACK_HOLES[game.lastHole??4];return {x:f.x+f.w*h.x,y:f.y+f.h*h.y};}if(id==='hoop'){const s=f.w/1.6;return {x:f.x+hoopX(game.t)*s,y:f.y+f.h-HOOP.y*s};}return {x:f.x+f.w/2,y:f.y+f.h/2};}
 function stepGameFrame(dt){const f=fieldRect();const inp={...input,down:!!(input.held||pointer.down||keysDown.act),left:!!keysDown.left,right:!!keysDown.right,px:pointer.x!=null&&pointer.x>=0&&pointer.x<=1?pointer.x:null,py:pointer.y};if(input.hole>=0)game.lastHole=input.hole;else if(inp.pressed&&game.id==='whack'&&inp.px!=null){let bd=9;WHACK_HOLES.forEach((h,i)=>{const d=Math.hypot(inp.px-h.x,inp.py-h.y);if(d<bd){bd=d;game.lastHole=i;}});}
  stepGame(game,dt,inp);input={...inputFresh(),held:input.held};gameEvents(f);if(game.done)endGame(false);}
 function drawGameFrame(t){
  const W=innerWidth,H=innerHeight;g.fillStyle='#0b0418';g.fillRect(0,0,W,H);const gm=gameById(game?.id||lastGame),f=fieldRect();
  g.fillStyle='#1a0d30';rrect(g,vp.x,vp.y,vp.w,vp.h,18);g.fill();neonRect(g,vp.x,vp.y,vp.w,vp.h,18,gm.color,4);
  glowText(g,gm.name.toUpperCase(),vp.x+vp.w/2,vp.y+vp.h*.065,Math.round(vp.h*.06),gm.color,{blur:20});
  if(!game)return;
  const left=Math.max(0,Math.ceil(game.time-game.t));g.font='800 '+Math.round(vp.h*.04)+'px system-ui';g.textAlign='left';g.fillStyle=left<=5?'#ff5f7a':'#f4ecff';g.fillText('⏱ '+left+'s',vp.x+vp.w*.03,vp.y+vp.h*.065);
  g.textAlign='right';g.fillStyle='#ffe066';g.fillText('🎟 '+Math.min(gm.cap,game.score)+(game.score>gm.cap?' (max)':''),vp.x+vp.w*.97,vp.y+vp.h*.065);
  g.save();g.beginPath();rrect(g,f.x,f.y,f.w,f.h,10);g.clip();RENDER[game.id](g,game,f,t);g.restore();neonRect(g,f.x,f.y,f.w,f.h,10,'rgba(255,255,255,.35)',1.5);
  if(game.message&&hint<=0){g.font='800 '+Math.round(vp.h*.035)+'px system-ui';g.textAlign='center';g.fillStyle='rgba(10,4,20,.7)';const mw=g.measureText(game.message).width+30;rrect(g,vp.x+vp.w/2-mw/2,f.y+vp.h*.02,mw,vp.h*.055,10);g.fill();g.fillStyle='#fff';g.fillText(game.message,vp.x+vp.w/2,f.y+vp.h*.048);}
  if(hint>0){g.globalAlpha=Math.min(1,hint);g.font='700 '+Math.round(vp.h*.03)+'px system-ui';g.fillStyle='#43e8ff';g.textAlign='center';g.fillText(HINTS[game.id],vp.x+vp.w/2,f.y+vp.h*.05);g.globalAlpha=1;}
 }
 const HINTS={claw:'Move: mouse / drag / ◀ ▶ · Drop: click, tap or Space',skee:'Aim: mouse / ◀ ▶ · Hold and release to roll',drop:'Tap, click or Space to drop a gummy',whack:'Tap the bears, or keys Q W E / A S D / Z X C',hoop:'Aim: mouse / ◀ ▶ · Hold and release to shoot'};
 const RENDER={
  claw(g,st,f,t){const X=v=>f.x+v*f.w,Y=v=>f.y+v*f.h;const bg=g.createLinearGradient(0,f.y,0,f.y+f.h);bg.addColorStop(0,'#2a1150');bg.addColorStop(1,'#120624');g.fillStyle=bg;g.fillRect(f.x,f.y,f.w,f.h);
   for(let i=0;i<14;i++){g.fillStyle='rgba(255,95,184,.07)';g.fillRect(X(i/14),f.y,2,f.h);}
   g.fillStyle='#3a1f66';g.fillRect(X(.02),Y(.45),X(.18)-X(.02),f.h*.55);neonRect(g,X(.02),Y(.45),X(.18)-X(.02),f.h*.55,6,'#ffd23f',2);glowText(g,'PRIZE',X(.1),Y(.5),f.h*.045,'#ffd23f',{blur:10});
   g.fillStyle='#1b0c33';g.beginPath();g.ellipse(X(.6),Y(.95),f.w*.42,f.h*.12,0,0,Math.PI*2);g.fill();
   const R=f.h*.065;for(const p of st.plush)if(p.state!=='won'&&p.state!=='held')drawBear(g,X(p.x),Y(p.y),R*(p.gold?1.1:1),p.gold?'#ffd23f':p.color);
   g.fillStyle='#8f96a8';g.fillRect(f.x,Y(.07),f.w,6);const tipX=X(st.clawX+st.sway),cy=Y(st.clawY);g.fillStyle='#c9cfdb';rrect(g,X(st.clawX)-18,Y(.05),36,14,4);g.fill();
   g.strokeStyle='#d5dbe7';g.lineWidth=2;g.beginPath();g.moveTo(X(st.clawX),Y(.07));g.lineTo(tipX,cy);g.stroke();
   if(st.held)drawBear(g,X(st.held.x),Y(st.held.y),R*(st.held.gold?1.1:1),st.held.gold?'#ffd23f':st.held.color);
   const openA=st.phase==='drop'||st.phase==='aim'?.7:.25;g.strokeStyle='#e8edf6';g.lineWidth=4;g.lineCap='round';for(const s of[-1,0,1]){g.beginPath();g.moveTo(tipX,cy);const a=Math.PI/2+s*openA;g.lineTo(tipX+Math.cos(a)*R*.9*(s?1:0)+s*2,cy+Math.sin(a)*R*.9);g.stroke();}
   g.fillStyle='#ff5fb8';g.beginPath();g.arc(tipX,cy,6,0,Math.PI*2);g.fill();
   if(st.phase==='aim'){g.setLineDash([4,6]);g.strokeStyle='rgba(255,255,255,.25)';g.beginPath();g.moveTo(tipX,cy+10);g.lineTo(tipX,Y(.9));g.stroke();g.setLineDash([]);}
   g.font='800 '+f.h*.045+'px system-ui';g.textAlign='right';g.fillStyle='#fff';g.fillText('GRABS '+st.grabs,X(.98),Y(.14));},
  skee(g,st,f,t){const X=v=>f.x+v*f.w,Y=v=>f.y+v*f.h;g.fillStyle='#0f2236';g.fillRect(f.x,f.y,f.w,f.h);
   g.fillStyle='#173a55';g.beginPath();g.moveTo(X(.1),Y(1));g.lineTo(X(.9),Y(1));g.lineTo(X(.82),Y(.05));g.lineTo(X(.18),Y(.05));g.closePath();g.fill();
   for(let i=0;i<12;i++){g.fillStyle='rgba(67,232,255,.06)';g.fillRect(f.x,Y(i/12),f.w,2);}
   const cols={10:'#43e8ff',20:'#7dff6a',30:'#ffd23f',40:'#ff8a3d',50:'#ff5fb8',100:'#ffffff'};
   for(const h of [...SKEE_HOLES.slice(0,5)].reverse()){g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.ellipse(X(h.x),Y(h.y),h.r*f.w,h.r/.8*f.h,0,0,Math.PI*2);g.fill();g.save();g.shadowColor=cols[h.pts];g.shadowBlur=12;g.strokeStyle=cols[h.pts];g.lineWidth=3;g.stroke();g.restore();g.font='800 '+f.h*.03+'px system-ui';g.fillStyle=cols[h.pts];g.textAlign='center';g.fillText(h.pts,X(h.x),Y(h.y)-h.r/.8*f.h+f.h*.035);}
   for(const h of SKEE_HOLES.slice(5)){g.fillStyle='#05020a';g.beginPath();g.arc(X(h.x),Y(h.y),h.r*f.w,0,Math.PI*2);g.fill();g.save();g.shadowColor='#fff';g.shadowBlur=14;g.strokeStyle='#fff';g.lineWidth=3;g.stroke();g.restore();glowText(g,'100',X(h.x),Y(h.y)-h.r*f.w-12,f.h*.035,'#fff',{blur:8});}
   if(st.phase==='aim'){const land=skeeLanding(st.aim,st.charging?st.power:.5);g.strokeStyle='rgba(255,255,255,.35)';g.setLineDash([6,8]);g.beginPath();g.moveTo(X(st.aim),Y(.97));g.lineTo(X(land.x),Y(st.charging?land.y:.5));g.stroke();g.setLineDash([]);g.fillStyle='#fff';g.beginPath();g.arc(X(st.aim),Y(.95),f.h*.028,0,Math.PI*2);g.fill();}
   if(st.ball){const b=st.ball,r=f.h*.028*(1-.35*Math.min(1,b.t));g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(X(b.x),Y(b.y)+r*.6,r,r*.4,0,0,Math.PI*2);g.fill();g.fillStyle='#f4f1ea';g.beginPath();g.arc(X(b.x),Y(b.y-(b.hop||0)),r,0,Math.PI*2);g.fill();}
   if(st.last&&st.last.t<1){g.globalAlpha=1-st.last.t;glowText(g,st.last.pts?'+'+st.last.pts:'0',X(st.last.x),Y(st.last.y)-st.last.t*40,f.h*.07,cols[st.last.pts]||'#888',{blur:16});g.globalAlpha=1;}
   meterBar(g,X(.94),Y(.2),f.w*.025,f.h*.7,st.charging?st.power:0);
   g.font='800 '+f.h*.045+'px system-ui';g.textAlign='left';g.fillStyle='#fff';g.fillText('BALLS '+st.balls,X(.02),Y(.08));g.fillText('PTS '+st.points,X(.02),Y(.15));},
  drop(g,st,f,t){const X=v=>f.x+v*f.w,Y=v=>f.y+v*f.h;g.fillStyle='#1d1030';g.fillRect(f.x,f.y,f.w,f.h);
   g.fillStyle='#2d1a4a';g.fillRect(X(.12),Y(.18),X(.88)-X(.12),Y(DROP_EDGE)-Y(.18));for(let i=0;i<7;i++){g.fillStyle='rgba(255,210,63,.05)';g.fillRect(X(laneX(i))-f.w*.045,Y(.18),f.w*.09,Y(DROP_EDGE)-Y(.18));}
   g.save();g.shadowColor='#ff5fb8';g.shadowBlur=18;g.fillStyle='#ff5fb8';g.fillRect(X(.12),Y(DROP_EDGE)-2,X(.88)-X(.12),4);g.restore();
   const pg=g.createLinearGradient(0,Y(.1),0,Y(st.pusher));pg.addColorStop(0,'#5b3d8f');pg.addColorStop(1,'#a07be0');g.fillStyle=pg;g.fillRect(X(.12),Y(.1),X(.88)-X(.12),Y(st.pusher)-Y(.1));g.fillStyle='#e6d7ff';g.fillRect(X(.12),Y(st.pusher)-4,X(.88)-X(.12),4);
   const R=DROP_R*f.h*.95;const coin=(c,a=1)=>{const x=X(c.x),y=Y(c.y);g.globalAlpha=a;g.fillStyle=c.gold?'#ffd23f':'#ff8fc8';g.beginPath();g.arc(x,y,R,0,Math.PI*2);g.fill();g.strokeStyle=c.gold?'#a4741a':'#c4487f';g.lineWidth=2;g.stroke();drawBear(g,x,y-R*.15,R*.42,c.gold?'#fff2a8':'#ffd0e4',{face:false});if(c.fresh){g.strokeStyle='#fff';g.globalAlpha=c.fresh*3;g.beginPath();g.arc(x,y,R+4,0,Math.PI*2);g.stroke();}g.globalAlpha=1;};
   for(const lane of st.lanes)for(const c of lane)coin(c);for(const c of st.falling)coin({...c},Math.max(0,1-c.fall));
   const dx=X(st.dropX);g.fillStyle='#ffd23f';g.beginPath();g.moveTo(dx-22,Y(.02));g.lineTo(dx+22,Y(.02));g.lineTo(dx+10,Y(.09));g.lineTo(dx-10,Y(.09));g.fill();g.fillStyle=st.cooldown>0?'rgba(255,255,255,.2)':'rgba(255,255,255,.6)';g.fillRect(dx-2,Y(.09),4,Y(st.pusher)-Y(.09));
   g.font='800 '+f.h*.045+'px system-ui';g.textAlign='left';g.fillStyle='#fff';g.fillText('GUMMIES '+st.drops,X(.01),Y(.06));},
  whack(g,st,f,t){const X=v=>f.x+v*f.w,Y=v=>f.y+v*f.h;const bg=g.createLinearGradient(0,f.y,0,f.y+f.h);bg.addColorStop(0,'#0f3a24');bg.addColorStop(1,'#071a10');g.fillStyle=bg;g.fillRect(f.x,f.y,f.w,f.h);
   const R=f.h*.075;WHACK_HOLES.forEach((h,i)=>{const x=X(h.x),y=Y(h.y);g.save();g.beginPath();g.rect(x-R*2,y-R*3,R*4,R*3+R*.3);g.clip();const u=st.up.find(u=>u.hole===i);if(u){const k=Math.min(1,u.age/.12,Math.max(0,(u.life+.15-u.age)/.15));const yy=y+R*1.4-k*R*1.8;if(u.kind==='cat')drawCat(g,x,yy-R*.1,R*1.05);else drawBear(g,x,yy,R*.75,u.kind==='gold'?'#ffd23f':'#7dff6a',{squash:u.hit?.6:1});if(u.hit&&u.kind!=='cat'){g.fillStyle='#fff';for(let s=0;s<5;s++){const a=s/5*Math.PI*2+t*6;g.fillRect(x+Math.cos(a)*R*.9,yy-R*.9+Math.sin(a)*R*.3,4,4);}}}g.restore();
    g.fillStyle='#030806';g.beginPath();g.ellipse(x,y+R*.15,R*1.15,R*.35,0,0,Math.PI);g.fill();g.save();g.strokeStyle='#7dff6a';g.shadowColor='#7dff6a';g.shadowBlur=10;g.lineWidth=2;g.beginPath();g.ellipse(x,y+R*.15,R*1.15,R*.35,0,0,Math.PI*2);g.stroke();g.restore();
    g.font='700 '+f.h*.028+'px system-ui';g.fillStyle='rgba(255,255,255,.35)';g.textAlign='center';g.fillText(WHACK_KEYS[i].toUpperCase(),x,y+R*.85);});
   for(const b of st.bonks){const h=WHACK_HOLES[b.hole];g.save();g.translate(X(h.x)+R,Y(h.y)-R*1.2);g.rotate(-.9+b.t*4);g.fillStyle='#ff8a3d';g.fillRect(-R*.15,0,R*.3,R*1.2);g.fillStyle='#ffd23f';rrect(g,-R*.55,-R*.35,R*1.1,R*.55,6);g.fill();g.restore();}
   g.font='800 '+f.h*.045+'px system-ui';g.textAlign='left';g.fillStyle='#fff';g.fillText('BONKS '+st.hits+(st.combo>=3?'  COMBO x'+st.combo:''),X(.02),Y(.07));},
  hoop(g,st,f,t){const s=f.w/1.6,X=v=>f.x+v*s,Y=v=>f.y+f.h-v*s;const bg=g.createLinearGradient(0,f.y,0,f.y+f.h);bg.addColorStop(0,'#2b0f3f');bg.addColorStop(1,'#13071f');g.fillStyle=bg;g.fillRect(f.x,f.y,f.w,f.h);
   g.fillStyle='#3a2250';g.fillRect(f.x,Y(.04),f.w,f.h);for(let i=0;i<16;i++){g.fillStyle='rgba(255,138,61,.08)';g.fillRect(X(i*.1),Y(.04),2,f.h);}
   const hx=hoopX(st.t);g.fillStyle='#e9eef7';g.fillRect(X(hx+HOOP.half+.03),Y(HOOP.y+.24),s*.02,s*.3);neonRect(g,X(hx+HOOP.half+.03)-s*.005,Y(HOOP.y+.24),s*.03,s*.3,2,'#43e8ff',2);g.fillStyle='#555';g.fillRect(X(hx+HOOP.half+.05),Y(HOOP.y+.05),s*.015,Y(.04)-Y(HOOP.y+.05));
   g.strokeStyle='rgba(255,255,255,.7)';g.lineWidth=1.5;for(let k=0;k<=4;k++){const a=X(hx-HOOP.half+k*HOOP.half/2);g.beginPath();g.moveTo(a,Y(HOOP.y));g.lineTo(X(hx)+(a-X(hx))*.55,Y(HOOP.y-.09));g.stroke();}
   g.save();g.shadowColor='#ff8a3d';g.shadowBlur=14;g.strokeStyle='#ff8a3d';g.lineWidth=5;g.beginPath();g.moveTo(X(hx-HOOP.half),Y(HOOP.y));g.lineTo(X(hx+HOOP.half),Y(HOOP.y));g.stroke();g.restore();
   if(st.t>=18)glowText(g,'MOVING HOOP · +3',X(hx),Y(HOOP.y+.3),f.h*.035,'#ffd23f',{blur:10});
   const ball=(x,y)=>{const r=.03*s;g.fillStyle='#ff8a3d';g.beginPath();g.arc(X(x),Y(y),r,0,Math.PI*2);g.fill();g.strokeStyle='#5a2a0a';g.lineWidth=1.5;g.beginPath();g.moveTo(X(x)-r,Y(y));g.lineTo(X(x)+r,Y(y));g.moveTo(X(x),Y(y)-r);g.lineTo(X(x),Y(y)+r);g.stroke();};
   if(st.phase==='aim'){g.strokeStyle='rgba(255,255,255,.5)';g.lineWidth=3;g.setLineDash([6,7]);g.beginPath();g.moveTo(X(.18),Y(.28));g.lineTo(X(.18+Math.cos(st.angle)*.22),Y(.28+Math.sin(st.angle)*.22));g.stroke();g.setLineDash([]);ball(.18,.28);}
   if(st.ball)ball(st.ball.x,st.ball.y);
   meterBar(g,f.x+f.w*.02,f.y+f.h*.2,f.w*.025,f.h*.6,st.charging?st.power:0);
   g.font='800 '+f.h*.045+'px system-ui';g.textAlign='left';g.fillStyle='#fff';g.fillText('POINTS '+st.makes+(st.streak>=2?'  🔥'+st.streak:''),f.x+f.w*.06,f.y+f.h*.08);},
 };
 function meterBar(g,x,y,w,h,v){g.fillStyle='rgba(255,255,255,.12)';rrect(g,x,y,w,h,w/2);g.fill();const gr=g.createLinearGradient(0,y+h,0,y);gr.addColorStop(0,'#7dff6a');gr.addColorStop(.6,'#ffd23f');gr.addColorStop(1,'#ff5f7a');g.fillStyle=gr;rrect(g,x,y+h*(1-v),w,h*v,w/2);g.fill();g.fillStyle='#fff';g.fillRect(x-4,y+h*(1-v)-2,w+8,4);}
 // ---------- loop ----------
 function frame(ts){if(!open)return;raf=requestAnimationFrame(frame);const dt=Math.min(.05,lastT?(ts-lastT)/1000:.016);lastT=ts;clock+=dt;tick(dt);}
 function tick(dt){if(view==='game'&&game&&!game.done)stepGameFrame(dt);hint=Math.max(0,hint-dt);
  g.save();const sk=shake*shake*14;if(sk>.2)g.translate((Math.random()-.5)*sk,(Math.random()-.5)*sk);shake=Math.max(0,shake-dt*2.2);
  if(view==='game'||view==='result')drawGameFrame(clock);else drawLobby(clock);
  for(const p of particles){p.life-=dt;p.vy+=380*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;g.globalAlpha=Math.max(0,Math.min(1,p.life*2));g.fillStyle=p.color;g.fillRect(p.x,p.y,p.size,p.size);}particles=particles.filter(p=>p.life>0);
  drawTickets(dt);
  for(const fl of floaters){fl.t+=dt;g.globalAlpha=Math.max(0,1-fl.t);glowText(g,fl.text,fl.x,fl.y-fl.t*50,22,fl.color,{blur:10});}floaters=floaters.filter(f=>f.t<1);g.globalAlpha=1;g.restore();
  root.style.setProperty('--shake',(shake*shake*10).toFixed(1)+'px');}
 function enter(){if(!root)build();open=true;root.hidden=false;view='lobby';sel=Math.max(0,Math.min(SLOTS.length-1,sel));hidePanel();resize();refreshHUD();lastT=0;cancelAnimationFrame(raf);raf=requestAnimationFrame(frame);sound('start');}
 function leave(){if(view==='game')endGame(true);open=false;if(root){root.hidden=true;root.classList.remove('playing');}cancelAnimationFrame(raf);hidePanel?.();host.onLeave?.();}
 return {enter,leave,get open(){return open},get view(){return view},get game(){return game},
  // QA hooks: deterministic stepping for screenshots and tests.
  qa:{select(i){sel=i;},advance(n=1,dt=1/60){for(let i=0;i<n;i++)tick(dt);return tickets.length;},play:playGame,step(n=1,dt=1/60,inp={}){if(inp.px!=null){pointer.x=inp.px;pointer.y=inp.py??.5;}for(let i=0;i<n&&game&&!game.done;i++){input={...inputFresh(),...inp,held:!!inp.down};stepGameFrame(dt);}tick(0);return game&&{id:game.id,t:game.t,score:game.score,done:game.done};},
   end:()=>endGame(false),tokens:showTokens,prizes:showPrizes,lobby:toLobby,render:()=>tick(0),buy,redeem,state:()=>({view,sel,game:game&&{id:game.id,t:game.t,score:game.score,done:game.done},result,arcade:st().arcade})}};
}
export {POSTER_ART};
