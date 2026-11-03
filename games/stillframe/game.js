'use strict';const E=Stillframe,$=id=>document.getElementById(id);let s=E.create(),paused=false,hidden=false,blocked=false,pending=null;try{const raw=localStorage.getItem(E.KEY);if(raw)s=E.decode(raw)}catch{blocked=true}const busy=()=>paused||hidden||document.hidden||$('confirm').open;
function save(){if(blocked){$('save').textContent='Unreadable camera save preserved. Recover explicitly to replace it.';return}try{localStorage.setItem(E.KEY,JSON.stringify(s));$('save').textContent='Camera saved on this browser.'}catch{$('save').textContent='Storage unavailable; temporary session.'}}
function go(a){if(busy())return;const n=E.act(s,a);if(!n)return;s=n;save();render()}

function choice(group,labels){$(group).replaceChildren(...labels.map((label,i)=>{const b=document.createElement('button');b.id=group+'-'+i;b.textContent=label;b.setAttribute('aria-pressed',s[group]===i);b.disabled=busy()||s.phase!=='field';b.onclick=()=>go(group+':'+i);return b}))}
function render(){const focus=document.activeElement?.id,t=E.subjects[s.subject],p=E.preview(s);
$('stats').textContent='Film '+s.film+'/9 · Album '+s.records.filter(x=>x>=80).length+'/3';
choice('subject',E.subjects.map(x=>x.name));choice('shutter',['Slow','Medium','Fast']);choice('aperture',['Narrow','Middle','Wide']);choice('focus',['Near','Middle','Far']);
$('brief').textContent=t.name+' · Light '+t.light+' · Motion '+t.speed+' · Distance '+['near','middle','far'][t.depth];
$('scene').style.setProperty('--x',(10+E.position(s)*20)+'%');$('scene').style.setProperty('--aim',(10+s.aim*20)+'%');
$('animal').innerHTML=s.subject===0?'<path d="M-32 0L-4-7L4-25L17-15L40-10L16-4L6 12L-17 7Z" fill="#55a7b9"/><circle cx="12" cy="-16" r="2" fill="#142f3b"/>':s.subject===1?'<path d="M-35 5L-25-15L10-15L18-38L30-35L35-20L21-12L15 8L10 32L3 32L4 10L-18 10L-25 32L-32 32L-28 8Z" fill="#b98459"/><path d="M24-35L21-52M21-45L12-48M27-37L34-52" stroke="#c8a279" stroke-width="3"/>':'<path d="M0 0Q-45-55-38-5Q-35 30 0 10Q35 30 38-5Q45-55 0 0Z" fill="#d5dba2"/><path d="M0-10V25" stroke="#5a765a" stroke-width="5"/>';
$('aim').replaceChildren(...Array.from({length:5},(_,i)=>{const b=document.createElement('button');b.id='aim-'+i;b.textContent='Frame '+(i+1);b.setAttribute('aria-pressed',s.aim===i);b.disabled=busy()||s.phase!=='field';b.onclick=()=>go('aim:'+i);return b}));
$('meter').textContent='Exposure '+p.exposure+' (target 2) · Preview '+p.score+'/100';
$('album').textContent=E.subjects.map((x,i)=>x.name+': '+s.records[i]+'/100').join(' · ');
$('message').textContent=paused?'Paused.':s.last;for(const id of ['shoot','wait'])$(id).disabled=busy()||!E.act(s,id);
$('restart').disabled=busy();$('pause').textContent=paused?'Resume':'Pause';$('pause').disabled=hidden||document.hidden||$('confirm').open;$('accept').disabled=paused||hidden||document.hidden;$('recover').hidden=!blocked;if(focus&&$(focus)&&!$(focus).disabled)$(focus).focus({preventScroll:true})}
for(const id of ['shoot','wait'])$(id).onclick=()=>go(id);
function ask(text,fn){if(busy())return;pending=fn;$('question').textContent=text;$('confirm').showModal();render()}$('restart').onclick=()=>ask('Start a new outing? Your best photographs stay.',()=>go('restart'));$('recover').onclick=()=>ask('Replace the unreadable save with this session?',()=>{blocked=false;save();render()});$('cancel').onclick=()=>{pending=null;$('confirm').close();render()};$('confirm').addEventListener('cancel',()=>pending=null);$('confirm').addEventListener('close',render);$('accept').onclick=()=>{if(paused||hidden||document.hidden||!$('confirm').open)return;const fn=pending;pending=null;$('confirm').close();fn?.()};$('pause').onclick=()=>{if(hidden||document.hidden||$('confirm').open)return;paused=!paused;render()};$('games').onclick=e=>{if(parent!==window){e.preventDefault();parent.postMessage({type:'study-collection'},location.origin)}};window.addEventListener('message',e=>{if(e.source===parent&&e.origin===location.origin&&e.data?.type==='study-visibility'&&typeof e.data.visible==='boolean'){hidden=!e.data.visible;if(hidden)paused=true;render()}});document.addEventListener('visibilitychange',()=>{if(document.hidden)paused=true;render()});save();render();





