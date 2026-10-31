'use strict';
const E=CanopyWeave,$=id=>document.getElementById(id),NS='http://www.w3.org/2000/svg';
const dirs={up:[0,-1],right:[1,0],down:[0,1],left:[-1,0]},letter=i=>String.fromCharCode(65+i);
let state=E.create(),selected=0,paused=false,parentHidden=false,blocked=false,pending=null,drag=null,notice='';
let rehearsal=false,plan=null,inspecting=false,issueIndex=0;
try{const raw=localStorage.getItem(E.KEY);if(raw)state=E.decode(raw)}catch{blocked=true}
const busy=()=>paused||parentHidden||document.hidden||$('confirm').open;
function clearPreview(){drag=null;plan=null;issueIndex=0}
function save(){
 if(blocked){$('save').textContent='Unreadable save preserved until confirmed recovery.';return}
 try{localStorage.setItem(E.KEY,JSON.stringify(state));$('save').textContent='Trellis, moves and best records saved.'}
 catch{$('save').textContent='Storage unavailable; this session is temporary.'}
}
function go(a){
 if(busy())return;clearPreview();const n=E.act(state,a);
 if(n.ok){state=n.state;selected=Math.min(selected,E.LEVELS[state.level].start.length-1);notice='';save()}
 else notice='Choose a different, empty dot inside the trellis.';
 render();
}
function propose(a){
 if(busy())return;
 if(!rehearsal){go(a);return}
 const original=E.board(state);
 if(state.moves.length>=300||E.inspect(state.level,original,state.compact===true).won)return;
 if(a.x===original[selected][0]&&a.y===original[selected][1]){plan=null;notice='Rehearsal returned to the saved position.'}
 else if(E.move(state.level,original,a)){plan={...a};notice=''}
 else {notice='That dot is occupied. Your previous rehearsal stays available.'}
 issueIndex=0;render();
}
function ask(text,fn){if(busy())return;clearPreview();pending=fn;$('question').textContent=text;$('confirm').showModal();render()}
function svg(tag,attrs){const el=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(attrs))el.setAttribute(k,v);return el}
function edgeName(i){return E.LEVELS[state.level].edges[i].map(letter).join('–')}
function describe(issue){
 if(issue.type==='leaf')return 'Vine '+edgeName(issue.edges[0])+' passes through leaf '+letter(issue.nodes[0])+'. Move that leaf or an end of the vine.';
 if(issue.type==='stretch')return 'Vine '+edgeName(issue.edges[0])+' exceeds four steps. Bring its leaves closer.';
 return 'Vines '+edgeName(issue.edges[0])+' and '+edgeName(issue.edges[1])+(issue.type==='overlap'?' overlap along the same line. Give them separate paths.':' cross or touch away from a shared leaf. Move an endpoint to separate them.');
}
function render(){
 const focus=document.activeElement?.id,original=E.board(state),planned=plan?E.move(state.level,original,plan):null;
 const points=drag?.preview||planned||original,compact=state.compact===true;
 const info=E.inspect(state.level,points,compact),before=E.inspect(state.level,original,compact),win=before.won,full=state.moves.length>=300,l=E.LEVELS[state.level];
 const issues=[...info.issues,...info.stretched.map(i=>({type:'stretch',edges:[i],nodes:[]}))];
 issueIndex=Math.max(0,Math.min(issueIndex,issues.length-1));const issue=inspecting?issues[issueIndex]:null;
 const affected=new Set(issue?[...issue.nodes,...issue.edges.flatMap(i=>l.edges[i])]:[]);
 $('title').textContent=l.name+(compact?' · Compact garden':'');
 $('compact').textContent=compact?'Return to free garden':'Try compact garden';$('compact').disabled=busy()||state.records[state.level]===null;
 $('reach-note').textContent=compact?(info.stretched.length?'Overstretched: '+info.stretched.map(edgeName).join(', ')+'. Bring these leaves closer.':info.won?'All vines are within reach and clear.':'All vines are within reach. Clear any remaining tangles.'):(state.records[state.level]===null?'Complete this trellis to unlock its compact-garden challenge.':'Compact garden unlocked: try shorter connections while keeping your free-garden record.');
 $('board').replaceChildren();
 for(let x=0;x<=8;x++)for(let y=0;y<=8;y++)$('board').append(svg('circle',{cx:20+x*40,cy:20+y*40,r:2,class:'dot'}));
 if(compact)$('board').append(svg('circle',{cx:20+points[selected][0]*40,cy:20+points[selected][1]*40,r:160,class:'reach'}));
 l.edges.forEach(([a,b],i)=>$('board').append(svg('line',{x1:20+points[a][0]*40,y1:20+points[a][1]*40,x2:20+points[b][0]*40,y2:20+points[b][1]*40,class:'vine'+(info.stretched.includes(i)?' stretched':'')+(info.bad.includes(i)?' tangled':'')+(issue?(issue.edges.includes(i)?' isolated':' muted'):'')})));
 if(planned||drag?.action){const p=original[selected],q=points[selected];$('board').append(svg('line',{x1:20+p[0]*40,y1:20+p[1]*40,x2:20+q[0]*40,y2:20+q[1]*40,class:'travel'}),svg('circle',{cx:20+p[0]*40,cy:20+p[1]*40,r:21,class:'origin'}))}
 points.forEach(([x,y],i)=>{
  const c=svg('circle',{cx:20+x*40,cy:20+y*40,r:18,class:'leaf'+(i===selected?' chosen':'')+(affected.has(i)?' involved':''),'data-node':i});
  const title=svg('title',{});title.textContent='Leaf '+letter(i);c.append(title);
  const text=svg('text',{x:20+x*40,y:20+y*40,class:'letter'});text.textContent=letter(i);$('board').append(c,text);
 });
 $('board').setAttribute('aria-label',points.map(([x,y],i)=>letter(i)+' column '+(x+1)+' row '+(y+1)).join('; ')+'. '+info.tangles+' tangles.'+(compact?' '+info.stretched.length+' overstretched vines.':'')+(planned?' Rehearsal, not saved.':''));
 $('status').textContent=paused?'Paused.':drag?(drag.preview?'Preview: '+info.tangles+' tangles'+(compact?', '+info.stretched.length+' overstretched vines':'')+(rehearsal?'. Release to rehearse.':'. Release to place.'):'That dot is occupied; release keeps the original layout.'):planned?'Rehearsal only. Saved layout and move record are unchanged.':win?'Every vine has room. Trellis complete!':full?'Move journal full. Undo or retry; records stay.':notice||info.tangles+' tangles'+(compact?' · '+info.stretched.length+' overstretched':'')+' · '+state.moves.length+' moves. Dashed vines need space.';
 $('rehearse').setAttribute('aria-pressed',rehearsal);$('rehearse').disabled=busy()||win||full;
 $('plan-help').textContent=rehearsal?'Rehearsal is on. Move a leaf, compare, then Place or Discard.':'Direct placement is on. Turn on rehearsal to compare a move before spending it.';
 $('plan-panel').hidden=!planned;
 if(planned){const delta=info.tangles-before.tangles,reach=info.stretched.length-before.stretched.length;$('comparison').textContent='Move '+letter(selected)+' to column '+(plan.x+1)+', row '+(plan.y+1)+': tangles '+before.tangles+' → '+info.tangles+' ('+(delta>0?'+':'')+delta+')'+(compact?'; stretched vines '+before.stretched.length+' → '+info.stretched.length+' ('+(reach>0?'+':'')+reach+')':'')+'. '+(info.won?'This placement completes the garden.':delta>0?'Adds tangles now; a temporary detour can make space.':'Inspect the remaining conflicts before placing.')}
 $('place').disabled=busy()||!planned;$('discard').disabled=busy()||!planned;
 $('inspect').setAttribute('aria-pressed',inspecting);$('inspect').disabled=busy();
 for(const id of ['previous-issue','next-issue']){$(id).hidden=!inspecting;$(id).disabled=busy()||issues.length<2}
 $('issue').textContent=inspecting?(issue?'Conflict '+(issueIndex+1)+' of '+issues.length+(planned?' in rehearsal':'')+': '+describe(issue):'No conflicts in '+(planned?'this rehearsal.':'this layout.')):'Inspect conflicts to isolate one connection problem at a time.';
 $('knots').replaceChildren();original.forEach((p,i)=>{const b=document.createElement('button');b.id='leaf-'+i;b.textContent='Leaf '+letter(i);b.setAttribute('aria-pressed',selected===i);b.disabled=busy()||win;b.onclick=()=>{if(busy())return;clearPreview();selected=i;notice='';render()};$('knots').append(b)});
 const point=points[selected];$('selected').textContent='Selected: '+letter(selected)+' · column '+(point[0]+1)+', row '+(point[1]+1)+(planned?' (rehearsed)':'');
 document.querySelectorAll('[data-dir]').forEach(b=>{const d=dirs[b.dataset.dir],x=point[0]+d[0],y=point[1]+d[1];b.disabled=busy()||win||full||!E.move(state.level,original,{node:selected,x,y})&&!(planned&&original[selected][0]===x&&original[selected][1]===y)});
 $('undo').disabled=busy()||!state.moves.length;$('retry').disabled=busy();$('pause').textContent=paused?'Resume':'Pause';$('pause').disabled=parentHidden||document.hidden;
 $('next').hidden=!win||state.level===2;$('next').disabled=busy();$('record').textContent='Fewest moves: '+((compact?state.compactRecords:state.records)[state.level]??'not completed');$('recover').hidden=!blocked;
 $('levels').replaceChildren();E.LEVELS.forEach((l,i)=>{const b=document.createElement('button');b.textContent=(i+1)+'. '+l.name;b.disabled=busy()||(i>0&&state.records[i-1]===null);b.onclick=()=>ask('Open this trellis? Current layout restarts; records stay.',()=>go({type:'level',level:i}));$('levels').append(b)});
 if(focus&&$(focus)&&!$(focus).disabled)$(focus).focus();
}
function position(e){const r=$('board').getBoundingClientRect();if(!r.width||!r.height)return null;return[Math.max(0,Math.min(8,Math.round(((e.clientX-r.left)/r.width*360-20)/40))),Math.max(0,Math.min(8,Math.round(((e.clientY-r.top)/r.height*360-20)/40)))]}
$('board').addEventListener('pointerdown',e=>{
 if(busy()||drag||e.button!==0||E.inspect(state.level,E.board(state),state.compact===true).won||state.moves.length>=300)return;
 e.preventDefault();const p=position(e);if(!p)return;const node=e.target.closest('[data-node]');
 if(node){clearPreview();selected=Number(node.dataset.node);drag={id:e.pointerId,start:p,preview:E.board(state),action:null};$('board').setPointerCapture?.(e.pointerId);render()}
 else propose({node:selected,x:p[0],y:p[1]});
});
$('board').addEventListener('pointermove',e=>{
 if(!drag||e.pointerId!==drag.id||busy())return;e.preventDefault();const p=position(e);if(!p)return;
 drag.action={node:selected,x:p[0],y:p[1]};drag.preview=E.move(state.level,E.board(state),drag.action);
 if(p[0]===drag.start[0]&&p[1]===drag.start[1]){drag.action=null;drag.preview=E.board(state)}
 render();
});
$('board').addEventListener('pointerup',e=>{if(!drag||e.pointerId!==drag.id)return;const a=drag.action,valid=drag.preview;drag=null;if(a&&valid)propose(a);else render()});
for(const type of ['pointercancel','lostpointercapture'])$('board').addEventListener(type,e=>{if(drag?.id===e.pointerId){drag=null;render()}});
function nudge(d){if(busy())return;const p=plan?[plan.x,plan.y]:E.board(state)[selected];propose({node:selected,x:p[0]+dirs[d][0],y:p[1]+dirs[d][1]})}
document.querySelectorAll('[data-dir]').forEach(b=>b.onclick=()=>nudge(b.dataset.dir));
document.addEventListener('keydown',e=>{if(busy()||e.repeat||e.isComposing||e.altKey||e.ctrlKey||e.metaKey||e.target.isContentEditable||/BUTTON|INPUT|SELECT|TEXTAREA|SUMMARY|A/.test(e.target.tagName))return;const d={ArrowUp:'up',ArrowRight:'right',ArrowDown:'down',ArrowLeft:'left'}[e.key];if(d){e.preventDefault();nudge(d)}});
$('rehearse').onclick=()=>{if(busy())return;clearPreview();rehearsal=!rehearsal;notice='';render()};
$('place').onclick=()=>{if(!busy()&&plan)go(plan)};$('discard').onclick=()=>{if(busy())return;clearPreview();notice='Rehearsal discarded; saved layout unchanged.';render()};
$('inspect').onclick=()=>{if(busy())return;inspecting=!inspecting;issueIndex=0;render()};
function cycle(d){if(busy())return;const info=E.inspect(state.level,plan?E.move(state.level,E.board(state),plan):E.board(state),state.compact===true),n=info.issues.length+info.stretched.length;if(n)issueIndex=(issueIndex+d+n)%n;render()}
$('previous-issue').onclick=()=>cycle(-1);$('next-issue').onclick=()=>cycle(1);
$('compact').onclick=()=>ask('Change garden mode and restart this layout? Both record sets stay.',()=>go({type:'compact',enabled:!state.compact}));
$('undo').onclick=()=>go('undo');$('retry').onclick=()=>ask('Retry this trellis? Records stay.',()=>go('retry'));$('next').onclick=()=>go({type:'level',level:state.level+1});
$('pause').onclick=()=>{if(parentHidden||document.hidden||$('confirm').open)return;clearPreview();paused=!paused;render()};
$('cancel').onclick=()=>{pending=null;$('confirm').close();render()};
$('accept').onclick=()=>{if(paused||parentHidden||document.hidden)return;const fn=pending;pending=null;$('confirm').close();fn?.();render()};
$('confirm').addEventListener('cancel',()=>{pending=null});$('confirm').addEventListener('close',()=>{pending=null;render()});
$('reset').onclick=()=>ask('Erase only Canopy Weave progress?',()=>{state=E.create();selected=0;blocked=false;notice='';save();render()});
$('recover').onclick=()=>ask('Replace unreadable Canopy Weave data with this session?',()=>{blocked=false;save();render()});
document.addEventListener('visibilitychange',()=>{if(document.hidden){clearPreview();paused=true}render()});
window.addEventListener('message',e=>{if(e.source!==parent||e.origin!==location.origin||e.data?.type!=='study-visibility')return;parentHidden=!e.data.visible;if(parentHidden){clearPreview();paused=true}render()});
$('collection').onclick=e=>{if(parent!==window){e.preventDefault();parent.postMessage({type:'study-collection'},location.origin)}};
save();render();
