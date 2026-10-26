(()=>{'use strict';
// Tea for Ghosts: title card, rest/pause, keyboard play, sound and the ghost's reactions.
const E=window.TeaGhosts,G=window.TeaGame,$=id=>document.getElementById(id);if(!E||!G)return;
const SKEY='study-desk-tea-for-ghosts-sound';let soundOn=true;try{soundOn=localStorage.getItem(SKEY)!=='off'}catch{}
const F=window.TeaFeel={paused:false,opened:false,sfx:null};
// ---------- sound (synthesised, original) ----------
let ac=null,master=null,rain=null;
function audio(){if(ac)return ac;try{ac=new (window.AudioContext||window.webkitAudioContext)();master=ac.createGain();master.gain.value=soundOn?.55:0;master.connect(ac.destination)}catch{ac=null}return ac}
function tone(f,t0,d,type='sine',v=.18,f2){const c=audio();if(!c)return;const o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f,c.currentTime+t0);if(f2)o.frequency.exponentialRampToValueAtTime(f2,c.currentTime+t0+d);g.gain.setValueAtTime(0,c.currentTime+t0);g.gain.linearRampToValueAtTime(v,c.currentTime+t0+.012);g.gain.exponentialRampToValueAtTime(.0008,c.currentTime+t0+d);o.connect(g);g.connect(master);o.start(c.currentTime+t0);o.stop(c.currentTime+t0+d+.05)}
function noise(d,freq,v,t0=0,q=.8,type='bandpass'){const c=audio();if(!c)return;const len=Math.floor(c.sampleRate*d),buf=c.createBuffer(1,len,c.sampleRate),ch=buf.getChannelData(0);for(let i=0;i<len;i++)ch[i]=Math.random()*2-1;const s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();s.buffer=buf;f.type=type;f.frequency.value=freq;f.Q.value=q;g.gain.setValueAtTime(0,c.currentTime+t0);g.gain.linearRampToValueAtTime(v,c.currentTime+t0+.08);g.gain.linearRampToValueAtTime(0,c.currentTime+t0+d);s.connect(f);f.connect(g);g.connect(master);s.start(c.currentTime+t0)}
const SFX={scoop:i=>{tone(620+i*70,0,.16,'triangle',.12,900+i*60);tone(1800+i*90,.02,.08,'sine',.05)},unscoop:i=>tone(560+i*50,0,.14,'triangle',.09,380),
 set:()=>tone(440,0,.07,'square',.035),pour:()=>{noise(1.3,900,.16,0,1.2);noise(1.1,2400,.05,.1,2);tone(196,0,.5,'sine',.05,300)},
 bell:()=>{tone(1318,0,1.2,'sine',.12);tone(1975,0,.8,'sine',.05)},
 good:()=>[523,659,784,1046].forEach((f,i)=>{tone(f,.1+i*.11,1.1,'triangle',.11);tone(f*2,.1+i*.11,.5,'sine',.03)}),
 close:()=>{tone(392,.1,.5,'triangle',.09);tone(440,.3,.55,'triangle',.08)},
 bad:()=>{tone(294,.1,.6,'triangle',.09,262);tone(220,.32,.7,'sine',.07,196)},
 page:()=>noise(.18,3000,.05,0,.7,'highpass'),deny:()=>tone(180,0,.12,'square',.04)};
F.sfx=SFX;
function startRain(){const c=audio();if(!c||rain)return;const len=c.sampleRate*3,buf=c.createBuffer(1,len,c.sampleRate),ch=buf.getChannelData(0);let last=0;for(let i=0;i<len;i++){const w=Math.random()*2-1;last=(last+.02*w)/1.02;ch[i]=last*3.2+(Math.random()<.0009?(Math.random()-.5)*.6:0)}const s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();s.buffer=buf;s.loop=true;f.type='lowpass';f.frequency.value=1500;g.gain.value=.22;s.connect(f);f.connect(g);g.connect(master);s.start();rain={g};
 // a soft, sparse music-box motif under the rain
 const notes=[392,440,523,587,659,784];let n=0;rain.timer=setInterval(()=>{if(F.paused||!soundOn||document.hidden)return;const f=notes[(n*3+(n>>2))%notes.length];tone(f,0,2.2,'sine',.028);if(n%4===0)tone(f/2,0,3,'sine',.02);n++},2400)}
function setSound(on){soundOn=on;try{localStorage.setItem(SKEY,on?'on':'off')}catch{}if(master)master.gain.value=on?.55:0;document.querySelectorAll('[data-sound]').forEach(b=>{b.textContent='Sound: '+(on?'On':'Off');b.setAttribute('aria-pressed',String(on))})}
// ---------- DOM additions ----------
const art=document.querySelector('.window-art'),svg=art.querySelector('svg'),NS='http://www.w3.org/2000/svg';
const bubble=document.createElement('div');bubble.className='tf-bubble';bubble.id='tfBubble';bubble.setAttribute('aria-hidden','true');art.append(bubble);
const fx=document.createElement('div');fx.className='tf-fx';art.append(fx);
const banner=document.createElement('div');banner.className='tf-banner';banner.id='tfBanner';art.append(banner);
const ghost=$('ghost');ghost.classList.add('tf-ghost');const acc=document.createElementNS(NS,'g');acc.id='tfAccessory';ghost.append(acc);
const pourPath=document.createElementNS(NS,'path');pourPath.id='tfPour';pourPath.setAttribute('d','M402 268 C 386 276, 366 292, 358 318');pourPath.setAttribute('fill','none');pourPath.setAttribute('stroke-width','7');pourPath.setAttribute('stroke-linecap','round');svg.insertBefore(pourPath,$('tea-liquid').nextSibling);const pot=document.createElementNS(NS,'g');pot.id='tfPot';pot.innerHTML='<g transform="rotate(-28 440 250)"><ellipse cx="440" cy="252" rx="34" ry="27" fill="#cfe0d6"/><path d="M408 246q-16-2-22 18 10-6 24-6z" fill="#cfe0d6"/><path d="M472 238q20 4 14 26-4 8-16 4" fill="none" stroke="#cfe0d6" stroke-width="7"/><ellipse cx="440" cy="226" rx="20" ry="6" fill="#a9c2b5"/><circle cx="440" cy="218" r="5" fill="#e3ba78"/><path d="M412 258q28 10 56 0" stroke="#7d9e8a" stroke-width="4" fill="none"/></g>';svg.append(pot);
const head=document.querySelector('header');const tools=document.createElement('div');tools.className='tf-head';
tools.innerHTML='<button id="restBtn" type="button" title="Rest (P)">Rest <kbd>P</kbd></button><button id="soundBtn" type="button" data-sound aria-pressed="true">Sound: On</button>';head.insertBefore(tools,$('help'));tools.append($('help'));
const keys=document.createElement('p');keys.className='hint tf-keys';keys.innerHTML='<b>Keys</b> <kbd>1</kbd>–<kbd>6</kbd> add a scoop · <kbd>Shift</kbd>+number removes · <kbd>T</kbd> temperature · <kbd>S</kbd> steep · <kbd>W</kbd> water · <kbd>B</kbd> brew · <kbd>O</kbd> offer · <kbd>Z</kbd> undo · <kbd>R</kbd> recall · <kbd>A</kbd> another cup · <kbd>N</kbd> next visitor · <kbd>P</kbd> rest';document.querySelector('.workbench').append(keys);
const title=document.createElement('section');title.id='teaTitle';title.className='tf-title';title.setAttribute('role','dialog');title.setAttribute('aria-label','Tea for Ghosts');
title.innerHTML=`<div class="tf-title-card"><svg class="tf-title-art" viewBox="0 0 260 170" aria-hidden="true"><defs><radialGradient id="tfg"><stop stop-color="#efc785" stop-opacity=".75"/><stop offset="1" stop-color="#efc785" stop-opacity="0"/></radialGradient><linearGradient id="tfs" x2="0" y2="1"><stop stop-color="#f6eed3"/><stop offset="1" stop-color="#b1cbbd" stop-opacity=".2"/></linearGradient></defs><circle cx="130" cy="78" r="80" fill="url(#tfg)"/><g class="tf-title-ghost"><path d="M95 120q-4-48 4-74a32 32 0 0162 0q8 30 3 74l-12-8-12 9-12-9-12 9-12-9z" fill="url(#tfs)"/><ellipse cx="118" cy="62" rx="3" ry="4.5" fill="#3c5354"/><ellipse cx="142" cy="62" rx="3" ry="4.5" fill="#3c5354"/><path d="M123 75q7 6 14 0" stroke="#607771" stroke-width="2.4" fill="none" stroke-linecap="round"/></g><path d="M92 128q2 34 34 34h10q31 0 33-34z" fill="#e6d7b7"/><ellipse cx="131" cy="128" rx="39" ry="9" fill="#ae794e"/><path d="M168 134q24-3 18 14-5 9-22 4" fill="none" stroke="#e6d7b7" stroke-width="7"/><g class="tf-title-steam" stroke="#ece0bb" fill="none" stroke-width="2.4" opacity=".75"><path d="M120 118q-10-12 0-21t0-21M141 117q-10-12 0-21t0-21"/></g></svg>
<p class="eyebrow">THE TEAROOM BETWEEN STATIONS</p><h1>Tea for <em>Ghosts</em></h1><p class="tf-sub">Listen to each visitor, blend their favourite cup, and give back a memory.</p><p class="tf-night" id="tfNight"></p><div class="tf-title-actions"><button id="openTea" class="primary" type="button">Open the tearoom</button><button type="button" data-sound aria-pressed="true" id="titleSound">Sound: On</button></div><p class="tf-small">Enter to open · no timers, no rush · progress saves on this device</p></div>`;
document.body.append(title);
const pause=document.createElement('section');pause.id='teaPause';pause.className='tf-pause';pause.hidden=true;pause.setAttribute('role','dialog');pause.setAttribute('aria-label','Resting');
pause.innerHTML='<div class="tf-title-card tf-pause-card"><p class="eyebrow">PAUSED</p><h2>The kettle rests</h2><p class="tf-sub">Your visitor waits patiently. Nothing changes while you rest.</p><div class="tf-title-actions"><button id="resumeTea" class="primary" type="button">Return to the table</button><button id="pauseHelp" type="button">How to serve</button><button type="button" data-sound aria-pressed="true">Sound: On</button></div><p class="tf-small">P or Esc to return</p></div>';document.body.append(pause);
setSound(soundOn);
// ---------- visitor looks: tint + accessory ----------
const LOOK=[
 {top:'#f3ecc9',bot:'#a9cda0',acc:'<path d="M296 150q54-28 108 0q-8-14-54-17-46 3-54 17z" fill="#a8783e"/><path d="M318 141q32-32 64 0z" fill="#c39352"/><path d="M318 139q32 6 64 0" stroke="#7d9e77" stroke-width="5" fill="none"/><circle cx="383" cy="134" r="7" fill="#e58b9b"/><circle cx="383" cy="134" r="3" fill="#ffd166"/>'},
 {top:'#e9e7dd',bot:'#8ea4b5',acc:'<path d="M314 146q36-30 72 0z" fill="#33465a"/><rect x="306" y="144" width="88" height="8" rx="3" fill="#25364a"/><rect x="342" y="128" width="16" height="10" rx="2" fill="#e3ba78"/>'},
 {top:'#f7e6ea',bot:'#c4a7c9',acc:'<g transform="translate(398 238)"><path d="M0 0l-6-26" stroke="#7f9e77" stroke-width="3"/><circle cx="-7" cy="-31" r="9" fill="#f1b7c8"/><circle cx="-7" cy="-31" r="4" fill="#fff1c9"/></g><path d="M330 170q20 8 42 0" stroke="#f1b7c8" stroke-width="0" fill="none"/>'},
 {top:'#fbe5c8',bot:'#d99a6c',acc:'<g transform="translate(255 268)"><path d="M0-30v10" stroke="#8a6b56" stroke-width="3"/><rect x="-11" y="-20" width="22" height="28" rx="6" fill="#e9a55b"/><rect x="-6" y="-14" width="12" height="16" rx="3" fill="#ffe3a1"/></g><path d="M318 148q32-22 64 0" stroke="#8a5a3c" stroke-width="7" fill="none" stroke-linecap="round"/>'},
 {top:'#e6f0ef',bot:'#8fb7c1',acc:'<g transform="translate(436 220)"><path d="M0 0v54" stroke="#cfd8d6" stroke-width="3"/><path d="M-34 0q34-40 68 0q-8-6-17 0-8-6-17 0-9-6-17 0-8-6-17 0z" fill="#6b9aa8"/></g>'},
 {top:'#f6efd8',bot:'#b9b38a',acc:'<path d="M300 238q50 22 100 0l-4 14q-46 18-92 0z" fill="#c76b55"/><path d="M380 246l14 30-12 2-10-28z" fill="#b25a46"/><path d="M314 146q36-28 72 0z" fill="#7d6a4f"/><rect x="304" y="143" width="92" height="7" rx="3" fill="#5f503c"/>'}];
function dress(i){const L=LOOK[i]||LOOK[0];const st=document.querySelectorAll('#spirit stop');if(st[0])st[0].setAttribute('stop-color',L.top);if(st[1])st[1].setAttribute('stop-color',L.bot);acc.innerHTML=L.acc}
// ---------- ghost face & bubble ----------
const SMILE={idle:'M340 225q12 8 24 0',happy:'M334 221q18 18 36 0',close:'M340 227q12 3 24 0',sad:'M340 231q12-9 24 0'};
function face(kind){const sm=$('smile');if(sm){sm.setAttribute('d',SMILE[kind]||SMILE.idle)}ghost.dataset.mood=kind}
let typeT=null;function say(text,who){clearInterval(typeT);bubble.classList.add('show');bubble.innerHTML=(who?`<b>${who}</b>`:'')+'<span></span>';const sp=bubble.querySelector('span');let i=0;const quick=matchMedia('(prefers-reduced-motion: reduce)').matches;if(quick){sp.textContent=text;return}typeT=setInterval(()=>{i+=2;sp.textContent=text.slice(0,i);if(i%6===0&&soundOn&&ac&&F.opened)tone(900+Math.random()*200,0,.03,'sine',.012);if(i>=text.length)clearInterval(typeT)},24)}
function hideBubble(){bubble.classList.remove('show')}
function sparkles(n,col){const r=art.getBoundingClientRect();for(let k=0;k<n;k++){const s=document.createElement('i');s.className='tf-spark';s.style.left=(42+Math.random()*16)+'%';s.style.top=(30+Math.random()*25)+'%';s.style.setProperty('--dx',(Math.random()*2-1)*140+'px');s.style.setProperty('--dy',(-40-Math.random()*120)+'px');s.style.background=col||['#ffd166','#f3e9ca','#e3ba78','#b1cbbd'][k%4];s.style.animationDelay=(Math.random()*.25)+'s';fx.append(s);setTimeout(()=>s.remove(),1700)}}
function flash(text,kind){banner.textContent=text;banner.className='tf-banner show '+(kind||'');clearTimeout(flash.t);flash.t=setTimeout(()=>banner.className='tf-banner',2200)}
function blendColor(r){let n=0,c=[0,0,0];r.mix.forEach((m,i)=>{if(!m)return;const h=E.ING[i].color;const v=[1,3,5].map(o=>parseInt(h.slice(o,o+2),16));c=c.map((x,j)=>x+v[j]*m);n+=m});if(!n)return '#ae794e';const dark=[1.05,.92,.78][r.steep-1];return'rgb('+c.map(x=>Math.round(x/n*dark*.82)).join(',')+')'}
function reactLine(last,g){const f=last.feedback.map(x=>x.split(': '));const off=f.filter(([,v])=>v!=='just right');if(last.score>=E.PASS[G.state.guest])return last.score>=95?'Oh… this is exactly it. I remember now.':'Yes, that is close enough to remember by.';if(!off.length)return last.temperature;const bits=off.slice(0,2).map(([a,v])=>v==='too much'?'a little less '+a.toLowerCase():'more '+a.toLowerCase());return (last.score>=60?'Nearly. ':'Hmm. ')+'Perhaps '+bits.join(', and ')+'. '+(last.temperature==='The warmth is right.'?'':last.temperature)}
function sync(){const s=G.state;dress(s.guest);$('tfNight').textContent=E.count(s)?`Night ${Math.min(6,E.count(s)+1)} · ${E.count(s)} of 6 memories restored · ${E.GUESTS[Math.min(5,E.available(s))].name} is expected`:'Night 1 · your first visitor, Mabel, is waiting';$('tea-liquid').setAttribute('fill',blendColor(s.run));pourPath.setAttribute('stroke',blendColor(s.run));
 if(s.run.phase==='prep'&&!s.run.last)face('idle')}
// ---------- react to actions ----------
window.addEventListener('tea:act',ev=>{const {a,ok,state}=ev.detail;if(!F.opened)return;if(!ok){SFX.deny();return}const r=state.run,g=E.GUESTS[state.guest];sync();
 if(a.type==='scoop'){a.delta>0?SFX.scoop(a.id):SFX.unscoop(a.id);const jar=document.querySelectorAll('#ingredients .jar')[a.id];if(jar){jar.classList.remove('tf-pop');void jar.offsetWidth;jar.classList.add('tf-pop')}}
 else if(a.type==='set'||a.type==='undo'||a.type==='recall')SFX.set();
 else if(a.type==='brew'){SFX.pour();art.classList.remove('tf-pouring');void art.offsetWidth;art.classList.add('tf-pouring');say('The steam smells… familiar. Offer it whenever you are ready.',g.name)}
 else if(a.type==='serve'){SFX.bell();const last=r.last,pass=last.score>=E.PASS[state.guest];setTimeout(()=>{if(pass){SFX.good();face('happy');sparkles(26);flash(`Memory restored · ${last.score} / 100`,'good');art.classList.add('tf-glow');setTimeout(()=>art.classList.remove('tf-glow'),1800);if(state.records.filter(Boolean).length>ev.detail.before.records.filter(Boolean).length&&E.ING.some(i=>i.unlock===E.count(state)))setTimeout(()=>flash('A new ingredient arrives in the cabinet','gift'),2300)}else if(last.score>=60){SFX.close();face('close');flash(`${last.score} / 100 · nearly`,'')}else{SFX.bad();face('sad');ghost.classList.remove('tf-shiver');void ghost.getBoundingClientRect();ghost.classList.add('tf-shiver');flash(`${last.score} / 100`,'')}say(r.phase==='lost'?'Thank you for trying. I will come back another night.':pass?reactLine(last,g)+' '+g.memory:reactLine(last,g),g.name)},380)}
 else if(a.type==='nextcup'){SFX.page();face('idle');say('Another cup? I would like that.',g.name)}
 else if(a.type==='visit'||a.type==='restart'){SFX.page();face('idle');ghost.classList.remove('tf-arrive');void ghost.getBoundingClientRect();ghost.classList.add('tf-arrive');say(g.quote,g.name)}
 else if(a.type==='buy'){SFX.good();sparkles(10,'#e3ba78')}});
// ---------- title / pause ----------
function open(){if(F.opened)return;F.opened=true;title.classList.add('gone');setTimeout(()=>title.hidden=true,300);audio();if(ac&&ac.state==='suspended')ac.resume();startRain();SFX.bell();const s=G.state;sync();say(E.GUESTS[s.guest].quote,E.GUESTS[s.guest].name);ghost.classList.add('tf-arrive');setTimeout(()=>$('guest-name').focus({preventScroll:true}),80)}
function setPaused(p){if(!F.opened||F.paused===p)return;F.paused=p;pause.hidden=!p;if(ac){p?ac.suspend():ac.resume()}if(p)$('resumeTea').focus();else $('restBtn').focus()}
F.open=open;F.setPaused=setPaused;
$('openTea').onclick=open;$('restBtn').onclick=()=>setPaused(true);$('resumeTea').onclick=()=>setPaused(false);$('pauseHelp').onclick=()=>{setPaused(false);$('guide').showModal()};
document.querySelectorAll('[data-sound]').forEach(b=>b.onclick=()=>{audio();setSound(!soundOn);if(soundOn)SFX.set()});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&F.opened&&!F.paused&&!document.querySelector('dialog[open]'))setPaused(true)});
// ---------- keyboard ----------
function cycle(id){const s=$(id);if(s.disabled)return SFX.deny();s.selectedIndex=(s.selectedIndex+1)%s.options.length;s.dispatchEvent(new Event('change'))}
function press(id){const b=$(id);if(b&&!b.disabled&&!b.hidden){b.click();return true}SFX.deny();return false}
document.addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||e.altKey)return;const k=e.key.toLowerCase();
 if(!F.opened){if(e.key==='Enter'||e.key===' '){if(document.activeElement&&document.activeElement.dataset.sound!==undefined)return;e.preventDefault();open()}return}
 if(document.querySelector('dialog[open]'))return;
 if(F.paused){if(k==='p'||e.key==='Escape'){e.preventDefault();setPaused(false)}return}
 if(k==='p'||e.key==='Escape'){e.preventDefault();setPaused(true);return}
 const tag=document.activeElement?.tagName;if(tag==='SELECT'&&/^(arrow|enter| )/.test(k))return;
 const dm=/^Digit([1-6])$/.exec(e.code);if(dm){e.preventDefault();G.act({type:'scoop',id:+dm[1]-1,delta:e.shiftKey?-1:1});return}
 const map={t:()=>cycle('temp'),s:()=>cycle('steep'),w:()=>cycle('water'),b:()=>press('brew'),o:()=>press('serve'),z:()=>press('undo'),r:()=>press('recall'),a:()=>press('another'),n:()=>press('next'),h:()=>$('help').click(),'?':()=>$('help').click()};
 if(map[k]){e.preventDefault();map[k]()}});
sync();
})();
