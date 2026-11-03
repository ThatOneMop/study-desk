'use strict';const E=Hushwood,$=id=>document.getElementById(id);let s=E.create(),paused=false,hidden=false,blocked=false,pending=null;try{const raw=localStorage.getItem(E.KEY);if(raw)s=E.decode(raw)}catch{blocked=true}const busy=()=>paused||hidden||document.hidden||$('confirm').open;
function save(){if(blocked){$('save').textContent='Unreadable grove save preserved. Recover explicitly to replace it.';return}try{localStorage.setItem(E.KEY,JSON.stringify(s));$('save').textContent='Watch saved on this browser.'}catch{$('save').textContent='Storage unavailable; temporary session.'}}
function go(a){if(busy())return;const n=E.act(s,a);if(!n)return;s=n;save();render()}
function render(){const focused=document.activeElement?.id,gs=E.guards(s),seen=E.sight(s),next=E.sight({...s,tick:s.tick+1});
$('stats').textContent='Watch '+(s.seed+1)+' · Turn '+s.tick+' · Pebbles '+s.stones+'/2 · '+(s.lantern?'Lantern carried — return home':'Find the seed lantern');
$('board').replaceChildren(...Array.from({length:49},(_,i)=>{const cell=document.createElement('div'),g=gs.find(g=>g.p===i);cell.className='tile'+(E.walls.includes(i)?' tree':'')+(seen.includes(i)?' seen':'')+(next.includes(i)?' next':'')+(i===s.player?' player':'')+(g?' guard':'');const arrow={up:'↑',down:'↓',left:'←',right:'→'};cell.textContent=i===s.player?'●':g?arrow[g.d]:i===42?'⌂':i===6&&!s.lantern?'◆':s.lure?.cell===i?'·':'';cell.setAttribute('aria-label','Row '+(Math.floor(i/7)+1)+' column '+(i%7+1)+(i===s.player?' you':g?' guard facing '+g.d:E.walls.includes(i)?' hedge':i===42?' home':i===6?' lantern':' path'));return cell}));
for(const id of ['up','down','left','right','wait','next'])$(id).disabled=busy()||!E.act(s,id);
for(const d of ['up','down','left','right'])$('lure-'+d).disabled=busy()||!E.act(s,'lure:'+d);
$('message').textContent=paused?'Paused.':s.last;$('records').textContent='This watch’s best: '+(s.records[s.seed]===undefined?'not delivered':s.records[s.seed]+' turns')+' · Watches completed: '+Object.keys(s.records).length;
$('restart').disabled=busy();$('pause').textContent=paused?'Resume':'Pause';$('pause').disabled=hidden||document.hidden||$('confirm').open;$('accept').disabled=paused||hidden||document.hidden;$('recover').hidden=!blocked;if(focused&&$(focused)&&!$(focused).disabled)$(focused).focus({preventScroll:true})}
for(const id of ['up','down','left','right','wait','next'])$(id).onclick=()=>go(id);for(const d of ['up','down','left','right'])$('lure-'+d).onclick=()=>go('lure:'+d);
function ask(text,fn){if(busy())return;pending=fn;$('question').textContent=text;$('confirm').showModal();render()}$('restart').onclick=()=>ask('Restart this watch? Your best records stay.',()=>go('restart'));$('recover').onclick=()=>ask('Replace the unreadable save with this session?',()=>{blocked=false;save();render()});$('cancel').onclick=()=>{pending=null;$('confirm').close();render()};$('confirm').addEventListener('cancel',()=>pending=null);$('confirm').addEventListener('close',render);$('accept').onclick=()=>{if(paused||hidden||document.hidden||!$('confirm').open)return;const fn=pending;pending=null;$('confirm').close();fn?.()};$('pause').onclick=()=>{if(hidden||document.hidden||$('confirm').open)return;paused=!paused;render()};$('games').onclick=e=>{if(parent!==window){e.preventDefault();parent.postMessage({type:'study-collection'},location.origin)}};window.addEventListener('message',e=>{if(e.source===parent&&e.origin===location.origin&&e.data?.type==='study-visibility'&&typeof e.data.visible==='boolean'){hidden=!e.data.visible;if(hidden)paused=true;render()}});document.addEventListener('visibilitychange',()=>{if(document.hidden)paused=true;render()});save();render();







