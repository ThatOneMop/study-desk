'use strict';const E=Stillframe,$=id=>document.getElementById(id);let s=E.create(),paused=false,hidden=false,blocked=false,pending=null;try{const raw=localStorage.getItem(E.KEY);if(raw)s=E.decode(raw)}catch{blocked=true}const busy=()=>paused||hidden||document.hidden||$('confirm').open;
function save(){if(blocked){$('save').textContent='Unreadable camera save preserved. Recover explicitly to replace it.';return}try{localStorage.setItem(E.KEY,JSON.stringify(s));$('save').textContent='Camera saved on this browser.'}catch{$('save').textContent='Storage unavailable; temporary session.'}}
function go(a){if(busy())return;const n=E.act(s,a);if(!n)return;s=n;save();render()}

function choice(group,labels){$(group).replaceChildren(...labels.map((label,i)=>{const b=document.createElement('button');b.id=group+'-'+i;b.textContent=label;b.setAttribute('aria-pressed',s[group]===i);b.disabled=busy()||s.phase!=='field';b.onclick=()=>go(group+':'+i);return b}))}
function animal(subject){return subject===0?'<path d="M-32 0L-4-7L4-25L17-15L40-10L16-4L6 12L-17 7Z" fill="#55a7b9"/><circle cx="12" cy="-16" r="2" fill="#142f3b"/>':subject===1?'<path d="M-35 5L-25-15L10-15L18-38L30-35L35-20L21-12L15 8L10 32L3 32L4 10L-18 10L-25 32L-32 32L-28 8Z" fill="#b98459"/><path d="M24-35L21-52M21-45L12-48M27-37L34-52" stroke="#c8a279" stroke-width="3"/>':'<path d="M0 0Q-45-55-38-5Q-35 30 0 10Q35 30 38-5Q45-55 0 0Z" fill="#d5dba2"/><path d="M0-10V25" stroke="#5a765a" stroke-width="5"/>'}
function render(){const focus=document.activeElement?.id,t=E.subjects[s.subject],p=E.preview(s);
$('stats').textContent='Film '+s.film+'/9 · Accepted briefs '+s.seals.reduce((a,b)=>a+b,0)+'/9 · Edition '+(s.edition+1);
choice('subject',E.subjects.map(x=>x.name));choice('shutter',['Slow','Medium','Fast']);choice('aperture',['Narrow','Middle','Wide']);choice('focus',['Near','Middle','Far']);choice('technique',['Hold still','Follow subject']);
$('brief').textContent=t.name+' · Light '+t.light+' · Motion '+E.moment(s).speed+' · Distance '+['near','middle','far'][t.depth];
$('scene').style.setProperty('--x',(10+E.position(s)*20)+'%');$('scene').style.setProperty('--aim',(10+s.aim*20)+'%');
$('animal').innerHTML=animal(s.subject);
$('animal').dataset.pose=E.moment(s).pose;
$('scene').dataset.pose=E.moment(s).pose;
$('scene-label').textContent='LIVE · '+E.moment(s).pose+' · '+(E.moment(s).moving?(E.moment(s).direction>0?'moving right →':'← moving left'):'quiet moment');
$('aim').replaceChildren(...Array.from({length:5},(_,i)=>{const b=document.createElement('button');b.id='aim-'+i;b.textContent='Frame '+(i+1);b.setAttribute('aria-pressed',s.aim===i);b.disabled=busy()||s.phase!=='field';b.onclick=()=>go('aim:'+i);return b}));
$('meter').textContent='LIVE exposure '+p.exposure+' (target 2) · Quality '+p.score+'/100';
$('assignment-title').textContent=E.brief(s).title;
$('assignment-text').textContent=E.brief(s).text;
$('readiness').textContent=p.qualifies?'Ready — this photograph will earn the brief.':s.seals[s.subject]===3?'Subject set complete. Try another animal.':p.missing.join(' · ');
$('readiness').classList.toggle('ready',p.qualifies);
$('album').textContent=E.subjects.map((x,i)=>x.name+': '+s.seals[i]+'/3 briefs · best '+s.records[i]+'/100').join(' / ');
$('prints').replaceChildren(...s.prints.map((print,i)=>{const card=document.createElement('article');card.className='print'+(print.earned?' accepted':'');const scene=document.createElement('div');scene.className='print-scene';scene.innerHTML='<svg viewBox="-55 -60 110 110">'+animal(print.subject)+'</svg>';scene.firstChild.style.left=(50+(print.position-print.aim)*33)+'%';scene.dataset.pose=print.pose;const caption=document.createElement('p');caption.textContent=(i===s.prints.length-1?'LATEST CAPTURE · ':'')+E.subjects[print.subject].name+' · '+print.pose+' · '+print.score+'/100 · '+print.brief+(print.earned?' ✓ accepted':' · study print');card.append(scene,caption);return card}));
$('empty-prints').hidden=s.prints.length>0;
$('message').textContent=paused?'Paused.':s.last;for(const id of ['shoot','wait'])$(id).disabled=busy()||!E.act(s,id);
$('restart').disabled=busy();$('restart').textContent=s.phase==='won'?'Open alternate briefs':'New outing';$('pause').textContent=paused?'Resume':'Pause';$('pause').disabled=hidden||document.hidden||$('confirm').open;$('accept').disabled=paused||hidden||document.hidden;$('recover').hidden=!blocked;if(focus&&$(focus)&&!$(focus).disabled)$(focus).focus({preventScroll:true})}
for(const id of ['shoot','wait'])$(id).onclick=()=>go(id);
function ask(text,fn){if(busy())return;pending=fn;$('question').textContent=text;$('confirm').showModal();render()}$('restart').onclick=()=>ask(s.phase==='won'?'Open alternate composition briefs? Best scores stay; this contact sheet clears.':'Refill film? Accepted briefs and best scores stay; this contact sheet clears.',()=>go('restart'));$('recover').onclick=()=>ask('Replace the unreadable save with this session?',()=>{blocked=false;save();render()});$('cancel').onclick=()=>{pending=null;$('confirm').close();render()};$('confirm').addEventListener('cancel',()=>pending=null);$('confirm').addEventListener('close',render);$('accept').onclick=()=>{if(paused||hidden||document.hidden||!$('confirm').open)return;const fn=pending;pending=null;$('confirm').close();fn?.()};$('pause').onclick=()=>{if(hidden||document.hidden||$('confirm').open)return;paused=!paused;render()};$('games').onclick=e=>{if(parent!==window){e.preventDefault();parent.postMessage({type:'study-collection'},location.origin)}};window.addEventListener('message',e=>{if(e.source===parent&&e.origin===location.origin&&e.data?.type==='study-visibility'&&typeof e.data.visible==='boolean'){hidden=!e.data.visible;if(hidden)paused=true;render()}});document.addEventListener('visibilitychange',()=>{if(document.hidden)paused=true;render()});save();render();






