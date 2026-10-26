/* Small shared juice for Study Desk games: title gate, pause, sound, shake, particles. */
(function(){
'use strict';
const audio={ctx:null,on:true};
function tone(freq,dur,type,gain){
  if(!audio.on)return;
  try{
    const Ctx=window.AudioContext||window.webkitAudioContext; if(!Ctx)return;
    audio.ctx=audio.ctx||new Ctx();
    const t=audio.ctx.currentTime,o=audio.ctx.createOscillator(),g=audio.ctx.createGain();
    o.type=type||'sine'; o.frequency.value=freq||440; o.connect(g); g.connect(audio.ctx.destination);
    g.gain.setValueAtTime(gain==null?0.04:gain,t);
    g.gain.exponentialRampToValueAtTime(0.001,t+(dur||0.12));
    o.start(t); o.stop(t+(dur||0.12)+0.02);
  }catch(e){}
}
function shake(el){
  const node=el||document.querySelector('main')||document.body;
  node.classList.remove('desk-shake'); void node.offsetWidth; node.classList.add('desk-shake');
}
function burst(x,y,color,n){
  for(let i=0;i<(n||10);i++){
    const p=document.createElement('i');
    p.className='desk-bit'; p.style.left=x+'px'; p.style.top=y+'px'; p.style.background=color||'#f3d48a';
    p.style.setProperty('--dx',(Math.random()*90-45)+'px');
    p.style.setProperty('--dy',(Math.random()*-80-8)+'px');
    document.body.append(p); setTimeout(()=>p.remove(),520);
  }
}
function at(el){const r=(el&&el.getBoundingClientRect?el:document.body).getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+Math.min(r.height/2,180)};}
function blip(el){tone(660,0.05,'triangle',0.03); const p=at(el); burst(p.x,p.y,'#f3d48a',5);}
function miss(el){tone(170,0.16,'sawtooth',0.02); shake(el);}
function celebrate(el){const p=at(el); burst(p.x,p.y,'#ffe7a3',14); shake(el); tone(523,0.08); setTimeout(()=>tone(659,0.1),80); setTimeout(()=>tone(784,0.16),150);}
function titleOpen(){const t=document.getElementById('desk-title'); return !!(t&&!t.hidden);}
function mount(opts){
  const gate=document.createElement('div');
  gate.id='desk-title'; gate.className='desk-title';
  gate.innerHTML='<div><p class="eyebrow">'+(opts.eyebrow||'')+'</p><h2>'+(opts.title||'')+'</h2><p>'+(opts.goal||'')+'</p><p class="desk-best">'+(opts.best||'')+'</p><p class="desk-hint">'+(opts.hint||'')+'</p><button type="button" id="desk-start">'+(opts.start||'Start')+'</button></div>';
  document.body.append(gate);
  const menu=document.createElement('div');
  menu.id='desk-pause-menu'; menu.hidden=true; menu.className='desk-pause';
  menu.innerHTML='<div role="dialog" aria-modal="true" aria-labelledby="desk-pause-title"><h2 id="desk-pause-title">Paused</h2><p id="desk-pause-goal"></p><p id="desk-pause-best" class="desk-best"></p><button type="button" id="desk-resume">Resume</button><button type="button" id="desk-how">How to play</button><button type="button" id="desk-sound">Sound on</button></div>';
  document.body.append(menu);
  const pause=document.createElement('button');
  pause.type='button'; pause.id='desk-pause'; pause.textContent='Pause';
  (document.querySelector('header')||document.body).append(pause);
  function setPaused(on){
    window.__deskPaused=on; menu.hidden=!on; pause.textContent=on?'Resume':'Pause';
    if(on){menu.querySelector('#desk-pause-goal').textContent=opts.goalText?opts.goalText():''; menu.querySelector('#desk-pause-best').textContent=opts.bestText?opts.bestText():''; menu.querySelector('#desk-resume').focus();}
  }
  gate.querySelector('#desk-start').onclick=()=>{gate.hidden=true; blip(gate); if(opts.onStart)opts.onStart();};
  pause.onclick=()=>{ if(titleOpen())return; setPaused(menu.hidden); };
  menu.querySelector('#desk-resume').onclick=()=>setPaused(false);
  menu.querySelector('#desk-how').onclick=()=>{setPaused(false); if(opts.help)opts.help();};
  menu.querySelector('#desk-sound').onclick=()=>{audio.on=!audio.on; menu.querySelector('#desk-sound').textContent=audio.on?'Sound on':'Sound off'; if(audio.on)tone(660,0.05,'triangle',0.03);};
  document.addEventListener('keydown',e=>{
    if(e.key!=='Escape'||e.repeat||titleOpen())return;
    setTimeout(()=>{ if(e.defaultPrevented||document.querySelector('dialog[open]'))return; setPaused(menu.hidden); },0);
  });
}
window.DeskFeel={tone,shake,burst,blip,miss,celebrate,mount,titleOpen};
})();
