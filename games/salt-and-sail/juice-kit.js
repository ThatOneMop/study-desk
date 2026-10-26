/* Study Desk juice kit: feedback-only layer (synthesised sound, bursts, callouts, shake, flash) for games that already have
   their own title and pause. Configured by the game's juice.js; it never blocks input. Original code, no external assets. */
(function(){'use strict';
window.JuiceKit=function(C){
const $=q=>document.querySelector(q),K={muted:false};const P=C.prefix;
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
const fx=document.createElement('div');fx.className=P+'-fx';fx.setAttribute('aria-hidden','true');document.body.append(fx);
const sb=document.createElement('button');sb.type='button';sb.id=P+'SndBtn';sb.className=P+'-snd';
const anchor=C.headerBefore&&$(C.headerBefore),hd=$('header');if(anchor){anchor.before(sb)}else if(hd){hd.append(sb)}else{sb.style.cssText='position:fixed;top:10px;right:10px;z-index:60';document.body.append(sb)}
st.textContent+=`.${P}-snd{font:inherit;font-size:13px;padding:7px 12px;border-radius:8px;cursor:pointer;background:transparent;color:inherit;border:1px solid currentColor;margin-right:8px}`;
let ac=null,master=null,amb=null;
function audio(){if(ac)return;try{ac=new (window.AudioContext||window.webkitAudioContext)();master=ac.createGain();master.gain.value=K.muted?0:.5;master.connect(ac.destination)}catch(e){ac=null}}
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
function at(el){const e=typeof el==='string'?$(el):el;if(!e)return{x:innerWidth/2,y:innerHeight/2};if(e.x!==undefined&&e.nodeType===undefined)return e;const r=e.getBoundingClientRect();if(!r.width&&!r.height){const pe=C.play&&$(C.play);if(pe&&pe!==e)return at(pe);return{x:innerWidth/2,y:innerHeight/2}}return{x:r.left+r.width/2,y:r.top+r.height/2}}
function burst(where,n,colors){const p=at(where);colors=colors||C.colors||['#f1cc79','#9eb17a','#e98f6d'];for(let i=0;i<(n||14);i++){const b=document.createElement('i');b.className=P+'-bit';const a=Math.random()*Math.PI*2,d=30+Math.random()*60;b.style.cssText=`left:${p.x}px;top:${p.y}px;background:${colors[i%colors.length]};--dx:${Math.cos(a)*d}px;--dy:${Math.sin(a)*d-20}px`;fx.append(b);setTimeout(()=>b.remove(),800)}}
let live=0;function callout(text,where,kind){const p=at(where);const off=live*34;live++;setTimeout(()=>live--,700);const c=document.createElement('div');c.className=P+'-call '+(kind||'');c.textContent=text;c.style.left=Math.max(70,Math.min(innerWidth-70,p.x))+'px';c.style.top=Math.max(20,p.y-24-off)+'px';fx.append(c);setTimeout(()=>c.remove(),1350)}
function shake(){const e=$(C.play);if(!e)return;e.classList.remove(P+'-shake');void e.offsetWidth;e.classList.add(P+'-shake')}
function flash(color){const f=document.createElement('div');f.className=P+'-flash';f.style.background=color||'#ff5a3c';document.body.append(f);setTimeout(()=>f.remove(),480)}
Object.assign(K,{burst,callout,shake,flash});
function sndLabel(){sb.textContent='Sound: '+(K.muted?'Off':'On');sb.setAttribute('aria-pressed',String(!K.muted))}
function toggleSound(){K.muted=!K.muted;try{localStorage.setItem(SK,K.muted?'off':'on')}catch(e){}if(master)master.gain.value=K.muted?0:.5;sndLabel();SFX.click()}
sndLabel();sb.onclick=e=>{audio();toggleSound();e.currentTarget.blur()};
const unlock=()=>{audio();if(ac&&ac.state==='suspended')ac.resume()};for(const t of ['pointerdown','keydown'])window.addEventListener(t,unlock,{capture:true,passive:true});
const quiet=()=>document.hidden||(C.paused&&C.paused());
let prev=null;function loop(){try{const cur=C.snap();if(prev&&cur&&!quiet()){for(const r of C.rules)if(r.test(prev,cur)){r.sfx&&SFX[r.sfx]&&SFX[r.sfx]();r.run&&r.run(K,prev,cur)}}prev=cur}catch(e){console.warn(e)}requestAnimationFrame(loop)}
requestAnimationFrame(loop);
window[C.global]=K;return K}})();
