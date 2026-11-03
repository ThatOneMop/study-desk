'use strict';const E=Ambercut,$=id=>document.getElementById(id);let s=E.create(),paused=false,hidden=false,blocked=false,pending=null;try{const raw=localStorage.getItem(E.KEY);if(raw)s=E.decode(raw)}catch{blocked=true}const busy=()=>paused||hidden||document.hidden||$('confirm').open;
function save(){if(blocked){$('save').textContent='Unreadable excavation save preserved. Recover explicitly to replace it.';return}try{localStorage.setItem(E.KEY,JSON.stringify(s));$('save').textContent='Excavation saved on this browser.'}catch{$('save').textContent='Storage unavailable; temporary session.'}}
function go(a){if(busy())return;const n=E.act(s,a);if(!n)return;s=n;save();render()}
const shapes=[
'<path d="M250 380V125 M250 175Q175 125 125 140Q165 195 250 200 M250 175Q325 125 375 140Q335 195 250 200 M250 325Q175 285 125 340Q180 375 250 350 M250 325Q325 285 375 340Q320 375 250 350" />',
'<path d="M250 440Q100 355 125 250Q140 155 250 125Q360 155 375 250Q400 355 250 440Z M250 440V155 M250 440Q155 300 160 245 M250 440Q345 300 340 245 M250 440Q200 270 210 180 M250 440Q300 270 290 180" />',
'<path d="M250 375V210 M250 230Q160 80 25 135Q55 230 220 265 M250 230Q340 80 475 135Q445 230 280 265 M250 280Q160 200 115 250Q140 300 250 325 M250 280Q340 200 385 250Q360 300 250 325" />'];
function specimen(i){return '<svg aria-hidden="true" viewBox="'+(i%5*100)+' '+(Math.floor(i/5)*100)+' 100 100" fill="none" stroke="#684929" stroke-width="9" stroke-linecap="round" stroke-linejoin="round">'+shapes[s.site]+'</svg>'}

function render(){const focus=document.activeElement?.id;
$('stats').textContent='Kit '+(50-s.strokes)+'/50 · Fractures '+s.damage.length+'/3 · Revealed '+E.found(s)+'/'+E.fossils[s.site].length;
$('commission').disabled=busy()||!E.act(s,'commission');$('assignment').textContent=s.commission?'Conservation: keep all four marked corners untouched. Finish without fractures for a seal.':'Earn a specimen to unlock conservation assignments.';
$('site').textContent=E.names[s.site]+' · Tray '+(s.site+1)+'/3'+(s.seals[s.site]?' · Seal earned':'');
$('board').replaceChildren(...s.depth.map((d,i)=>{const b=document.createElement('button'),f=E.fossils[s.site].includes(i),broken=s.damage.includes(i);b.id='cell-'+i;b.className='tile depth-'+d+(f&&d<=1?' fossil':'')+(broken?' broken':'')+(s.commission&&E.matrix.includes(i)?' protected':'');b.innerHTML='<span>'+(d>1?'▰'.repeat(d):f?(broken?'╳':'❧'):d?'·':'')+'</span><small>'+(d>1?d+' layers':d?(f?'Trace':'Thin'):(f?'Fossil':'Clear'))+'</small>';if(f&&d===0&&!broken)b.querySelector('span').innerHTML=specimen(i);b.setAttribute('aria-label','Row '+(1+Math.floor(i/5))+' column '+(1+i%5)+', '+(d>1?d+' layers':d?(f?'fossil trace':'thin stone'):(f?'exposed fossil':'clear stone')));b.disabled=busy()||!E.act(s,i);b.onclick=()=>go(i);b.onpointerenter=()=>mark(i);b.onfocus=()=>mark(i);return b}));
for(const id of ['brush','chisel','row','column']){$(id).disabled=busy();$(id).setAttribute('aria-pressed',s.tool===id)}
$('next').hidden=s.phase!=='won';$('next').disabled=busy();$('message').textContent=paused?'Paused.':s.last;
$('record').textContent='Best preservation: '+s.records.map((v,i)=>E.names[i]+' '+(v===null?'—':v)).join(' · ');
$('restart').disabled=busy();$('pause').textContent=paused?'Resume':'Pause';$('pause').disabled=hidden||document.hidden||$('confirm').open;$('accept').disabled=paused||hidden||document.hidden;$('recover').hidden=!blocked;
if(focus&&$(focus)&&!$(focus).disabled)$(focus).focus({preventScroll:true})}
function mark(i){document.querySelectorAll('.tile').forEach((b,j)=>b.classList.toggle('preview',E.footprint(s,i).includes(j)))}
for(const id of ['brush','chisel','row','column','next','commission'])$(id).onclick=()=>go(id);
$('commission').onclick=()=>ask('Replace this tray with a conservation assignment? Saved scores and seals stay.',()=>go('commission'));
function ask(text,fn){if(busy())return;pending=fn;$('question').textContent=text;$('confirm').showModal();render()}$('restart').onclick=()=>ask('Reset this tray? Your specimen records stay.',()=>go('restart'));$('recover').onclick=()=>ask('Replace the unreadable save with this session?',()=>{blocked=false;save();render()});$('cancel').onclick=()=>{pending=null;$('confirm').close();render()};$('confirm').addEventListener('cancel',()=>pending=null);$('confirm').addEventListener('close',render);$('accept').onclick=()=>{if(paused||hidden||document.hidden||!$('confirm').open)return;const fn=pending;pending=null;$('confirm').close();fn?.()};$('pause').onclick=()=>{if(hidden||document.hidden||$('confirm').open)return;paused=!paused;render()};$('games').onclick=e=>{if(parent!==window){e.preventDefault();parent.postMessage({type:'study-collection'},location.origin)}};window.addEventListener('message',e=>{if(e.source===parent&&e.origin===location.origin&&e.data?.type==='study-visibility'&&typeof e.data.visible==='boolean'){hidden=!e.data.visible;if(hidden)paused=true;render()}});document.addEventListener('visibilitychange',()=>{if(document.hidden)paused=true;render()});save();render();




