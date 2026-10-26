/* Study Desk feel kit: title card, pause that holds input, synthesised sound, bursts, callouts, shake and a coach line.
   Configured by the game's feel.js. Original code, no external assets. */
(function(){'use strict';
window.FeelKit=function(C){
const $=q=>document.querySelector(q),K={paused:false,opened:false,muted:false};const P=C.prefix;
const SK='study-desk-'+C.id+'-sound';try{K.muted=localStorage.getItem(SK)==='off'}catch(e){}
const css=`.${P}-title{position:fixed;inset:0;z-index:60;display:grid;place-items:center;background:${C.shade||'#0b1a1fcc'};backdrop-filter:blur(3px);transition:opacity .3s}
.${P}-title.gone{opacity:0;pointer-events:none}.${P}-card{max-width:min(520px,90vw);padding:34px 36px 28px;border-radius:18px;background:${C.card||'#12262c'};color:${C.ink||'#f1e7c4'};border:2px solid ${C.accent||'#f1cc79'};box-shadow:0 24px 70px #0008;text-align:center;font-family:inherit;animation:${P}in .5s ease-out}
.${P}-card .eyebrow{font:700 11px ui-monospace,monospace;letter-spacing:.2em;opacity:.75;margin:0 0 10px}.${P}-card h2{font-size:clamp(34px,6vw,54px);margin:0 0 8px;line-height:1}.${P}-card p{margin:8px 0;line-height:1.45}
.${P}-card .art{display:block;margin:4px auto 10px;width:150px;height:96px}.${P}-card button{font:inherit;font-weight:700;padding:12px 22px;border-radius:999px;border:0;background:${C.accent||'#f1cc79'};color:${C.accentInk||'#10232a'};cursor:pointer;margin:12px 4px 4px}
.${P}-card button.ghost{background:transparent;color:inherit;border:1px solid currentColor;font-weight:500}.${P}-card small{display:block;opacity:.7;margin-top:10px;font-size:12px}
.${P}-card kbd,.${P}-hb kbd{font:600 10px ui-monospace,monospace;opacity:.75;margin-left:4px}
@keyframes ${P}in{from{transform:translateY(14px) scale(.97);opacity:0}}
.${P}-hb{display:inline-flex;gap:6px;margin-right:8px}.${P}-hb button{font:inherit;font-size:13px;padding:7px 12px;border-radius:8px;cursor:pointer;background:transparent;color:inherit;border:1px solid currentColor;opacity:.9}
.${P}-fx{position:fixed;inset:0;pointer-events:none;z-index:55;overflow:hidden}.${P}-bit{position:absolute;width:7px;height:7px;border-radius:2px;animation:${P}bit .75s ease-out forwards}
@keyframes ${P}bit{to{transform:translate(var(--dx),var(--dy)) rotate(220deg);opacity:0}}
.${P}-call{position:absolute;transform:translate(-50%,-50%);font:800 13px ui-monospace,monospace;letter-spacing:.1em;padding:5px 10px;border-radius:6px;background:${C.card||'#12262c'}ee;color:${C.ink||'#f1e7c4'};border:1.5px solid ${C.accent||'#f1cc79'};white-space:nowrap;animation:${P}call 1.3s ease-out forwards}
.${P}-call.good{border-color:${C.good||'#9eb17a'};color:${C.goodInk||'#e4f5c8'}}.${P}-call.bad{border-color:#ff9e7a;color:#ffd6c6;background:#3a1c1cee}.${P}-call.big{font-size:18px;padding:8px 16px}
@keyframes ${P}call{0%{opacity:0;transform:translate(-50%,-30%) scale(.8)}15%{opacity:1;transform:translate(-50%,-50%) scale(1.08)}30%{transform:translate(-50%,-50%)}100%{opacity:0;transform:translate(-50%,-120%)}}
.${P}-shake{animation:${P}shake .32s}@keyframes ${P}shake{20%{transform:translate(-4px,2px)}40%{transform:translate(4px,-2px)}60%{transform:translate(-3px,-1px)}80%{transform:translate(2px,1px)}}
.${P}-flash{position:fixed;inset:0;pointer-events:none;z-index:54;animation:${P}flash .45s forwards}@keyframes ${P}flash{from{opacity:.32}to{opacity:0}}
.${P}-tip{margin:8px 0;padding:8px 12px;border-radius:8px;border-left:3px solid ${C.accent||'#f1cc79'};background:${C.tipBg||'#0000001f'};font-size:14px;line-height:1.4}.${P}-tip b{letter-spacing:.06em}
.${P}-pause{position:fixed;inset:0;z-index:61;display:grid;place-items:center;background:#0009}.${P}-pause[hidden]{display:none}`;
const st=document.createElement('style');st.textContent=css;document.head.append(st);
// title card
const title=document.createElement('div');title.className=P+'-title';title.id=P+'Title';
title.innerHTML=`<div class="${P}-card" role="dialog" aria-label="${C.title}"><p class="eyebrow">${C.eyebrow}</p>${C.art||''}<h2>${C.title}</h2><p>${C.tagline}</p><p class="prog" id="${P}Prog"></p><button id="${P}Start" type="button">${C.startLabel} <kbd>Enter</kbd></button><button class="ghost" id="${P}Snd" type="button"></button><small>${C.keys}</small></div>`;
document.body.append(title);
const pause=document.createElement('div');pause.className=P+'-pause';pause.id=P+'Pause';pause.hidden=true;
pause.innerHTML=`<div class="${P}-card" role="dialog" aria-label="Paused"><p class="eyebrow">PAUSED</p><h2 style="font-size:34px">${C.pauseTitle}</h2><p>${C.pauseText}</p><button id="${P}Resume" type="button">Resume</button><button class="ghost" id="${P}Help" type="button">How to play</button><button class="ghost" id="${P}Snd2" type="button"></button><small>P or Esc to resume</small></div>`;
document.body.append(pause);
const fx=document.createElement('div');fx.className=P+'-fx';fx.setAttribute('aria-hidden','true');document.body.append(fx);
const hb=document.createElement('span');hb.className=P+'-hb';hb.innerHTML=`<button id="${P}PauseBtn" type="button">Pause<kbd>P</kbd></button><button id="${P}SndBtn" type="button"></button>`;
const anchor=$(C.headerBefore);if(anchor)anchor.before(hb);else document.body.prepend(hb);
let tip=null;if(C.tip){tip=document.createElement('p');tip.className=P+'-tip';tip.id=P+'Tip';tip.hidden=true;const a=$(C.tipAfter);if(a)a.after(tip)}
// audio
let ac=null,master=null,amb=null;
function audio(){if(ac)return;try{ac=new (window.AudioContext||window.webkitAudioContext)();master=ac.createGain();master.gain.value=K.muted?0:.5;master.connect(ac.destination);ambient()}catch(e){ac=null}}
function tone(f,d,type,v,slide,delay){if(!ac||K.muted)return;const t=ac.currentTime+(delay||0),o=ac.createOscillator(),g=ac.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(30,f*slide),t+d);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v||.2,t+.01);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(master);o.start(t);o.stop(t+d+.05)}
function noise(d,f,v,delay){if(!ac||K.muted)return;const t=ac.currentTime+(delay||0),n=ac.sampleRate*d,b=ac.createBuffer(1,n,ac.sampleRate),x=b.getChannelData(0);for(let i=0;i<n;i++)x[i]=(Math.random()*2-1)*(1-i/n);const s=ac.createBufferSource(),fl=ac.createBiquadFilter(),g=ac.createGain();s.buffer=b;fl.type='lowpass';fl.frequency.value=f||1200;g.gain.value=v||.25;s.connect(fl);fl.connect(g);g.connect(master);s.start(t)}
const R=C.root||392;
const SFX={click:()=>tone(R*2,.05,'triangle',.12),
 step:()=>tone(R*1.5,.06,'triangle',.09,1.2),
 good:()=>{tone(R*2,.12,'triangle',.16);tone(R*2.5,.16,'triangle',.14,1,.07)},
 great:()=>{[1,1.25,1.5,2].forEach((m,i)=>tone(R*2*m,.22,'triangle',.15,1,i*.07))},
 coin:()=>{tone(R*3,.07,'square',.07);tone(R*4,.12,'square',.07,1,.06)},
 bad:()=>{tone(R*.6,.3,'sawtooth',.12,.6);noise(.18,600,.18)},
 thud:()=>{tone(R*.35,.18,'sine',.3,.5);noise(.12,400,.2)},
 whoosh:()=>noise(.3,2200,.12),
 win:()=>{[1,1.25,1.5,2,2.5].forEach((m,i)=>tone(R*m,.4,'triangle',.16,1,i*.11))},
 lose:()=>{[1,.84,.7,.5].forEach((m,i)=>tone(R*m,.35,'triangle',.14,1,i*.16))}};
K.sfx=SFX;
function ambient(){if(!ac||!C.ambient)return;const n=ac.sampleRate*2,b=ac.createBuffer(1,n,ac.sampleRate),x=b.getChannelData(0);let l=0;for(let i=0;i<n;i++){l=(l+(Math.random()*2-1)*.02)/1.02;x[i]=l*3}const s=ac.createBufferSource(),f=ac.createBiquadFilter(),g=ac.createGain();s.buffer=b;s.loop=true;f.type='lowpass';f.frequency.value=C.ambient.cut||500;g.gain.value=C.ambient.vol||.25;s.connect(f);f.connect(g);g.connect(master);s.start();amb=s;
 const notes=C.ambient.notes||[0,3,7,10];setInterval(()=>{if(K.paused||!K.opened||document.hidden||Math.random()<.45)return;const m=Math.pow(2,notes[Math.floor(Math.random()*notes.length)]/12);tone(R*m,1.6,'sine',.035)},2400)}
function sndLabel(){const t='Sound: '+(K.muted?'Off':'On');for(const id of ['Snd','Snd2','SndBtn'])$('#'+P+id).textContent=t}
function toggleSound(){K.muted=!K.muted;try{localStorage.setItem(SK,K.muted?'off':'on')}catch(e){}if(master)master.gain.value=K.muted?0:.5;sndLabel();SFX.click()}
sndLabel();
// fx helpers
function at(el){const e=typeof el==='string'?$(el):el;if(!e)return{x:innerWidth/2,y:innerHeight/2};if(e.x!==undefined&&e.nodeType===undefined)return e;const r=e.getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2}}
function burst(where,n,colors){const p=at(where);colors=colors||C.colors||['#f1cc79','#9eb17a','#e98f6d'];for(let i=0;i<(n||14);i++){const b=document.createElement('i');b.className=P+'-bit';const a=Math.random()*Math.PI*2,d=30+Math.random()*60;b.style.cssText=`left:${p.x}px;top:${p.y}px;background:${colors[i%colors.length]};--dx:${Math.cos(a)*d}px;--dy:${Math.sin(a)*d-20}px`;fx.append(b);setTimeout(()=>b.remove(),800)}}
let live=0;function callout(text,where,kind){const p=at(where);const off=live*34;live++;setTimeout(()=>live--,700);const c=document.createElement('div');c.className=P+'-call '+(kind||'');c.textContent=text;c.style.left=Math.max(70,Math.min(innerWidth-70,p.x))+'px';c.style.top=Math.max(20,p.y-24-off)+'px';fx.append(c);setTimeout(()=>c.remove(),1350)}
function shake(){const e=$(C.play);if(!e)return;e.classList.remove(P+'-shake');void e.offsetWidth;e.classList.add(P+'-shake')}
function flash(color){const f=document.createElement('div');f.className=P+'-flash';f.style.background=color||'#ff5a3c';document.body.append(f);setTimeout(()=>f.remove(),480)}
Object.assign(K,{burst,callout,shake,flash});
// open / pause
function open(){if(K.opened)return;K.opened=true;title.classList.add('gone');setTimeout(()=>title.hidden=true,300);audio();if(ac&&ac.state==='suspended')ac.resume();SFX.good();C.onOpen&&C.onOpen(K)}
function setPaused(p){if(!K.opened||K.paused===p)return;K.paused=p;pause.hidden=!p;if(p){C.onPause&&C.onPause();if(ac)ac.suspend();$('#'+P+'Resume').focus()}else{if(ac)ac.resume();document.activeElement?.blur?.();C.onResume&&C.onResume()}}
K.open=open;K.setPaused=setPaused;
$('#'+P+'Start').onclick=open;$('#'+P+'Snd').onclick=toggleSound;$('#'+P+'Snd2').onclick=toggleSound;$('#'+P+'SndBtn').onclick=e=>{toggleSound();e.currentTarget.blur()};
$('#'+P+'PauseBtn').onclick=e=>{setPaused(true)};$('#'+P+'Resume').onclick=()=>setPaused(false);
$('#'+P+'Help').onclick=()=>{setPaused(false);const g=$(C.guide);if(g&&g.showModal)g.showModal();else if(g)g.click()};
document.addEventListener('visibilitychange',()=>{if(document.hidden&&K.opened&&!document.querySelector('dialog[open]'))setPaused(true)});
window.addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||e.altKey)return;const k=e.key.toLowerCase();
 if(!K.opened){if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}e.stopImmediatePropagation();return}
 if(document.querySelector('dialog[open]')||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;
 if(K.paused){if(k==='p'||e.key==='Escape'){e.preventDefault();setPaused(false)}else if((e.key==='Enter'||e.key==='Tab')&&pause.contains(e.target))return;else e.preventDefault();e.stopImmediatePropagation();return}
 if(e.key==='Escape'&&C.escBusy&&C.escBusy())return;if(k==='p'||e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();setPaused(true)}},true);
for(const t of ['pointerdown','mousedown','click'])window.addEventListener(t,e=>{if(e.target.closest&&e.target.closest("a[href]")&&!K.paused)return;if((K.paused&&!pause.contains(e.target))||(!K.opened&&!title.contains(e.target))){e.stopImmediatePropagation();e.preventDefault()}},true);
// watch the game state and react
let prev=null;function loop(){try{const cur=C.snap();if(prev&&cur){for(const r of C.rules)if(r.test(prev,cur)){r.sfx&&SFX[r.sfx]&&SFX[r.sfx]();r.run&&r.run(K,prev,cur)}}
 if(tip){const t=C.tip(cur);tip.hidden=!t;if(t&&tip.innerHTML!==t)tip.innerHTML=t}
 const pr=$('#'+P+'Prog');if(pr&&C.progress&&!K.opened)pr.textContent=C.progress();prev=cur}catch(e){console.warn(e)}requestAnimationFrame(loop)}
requestAnimationFrame(loop);
window[C.global]=K;return K}})();
