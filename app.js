'use strict';
const $=id=>document.getElementById(id),KEY='study-desk-v1',DECK_KEY='study-desk-decks-v1',HUB_KEY='after-class-hub-v1';
const storageState=new Map();
function loadJson(key,fallback,validate){const state={raw:null,blocked:false,reason:''};storageState.set(key,state);try{state.raw=localStorage.getItem(key)}catch{state.blocked=true;state.reason='unavailable';return fallback}if(state.raw===null)return fallback;try{const value=JSON.parse(state.raw);if(!validate(value))throw Error();return value}catch{state.blocked=true;state.reason='unreadable';return fallback}}
function studyBlocked(){return [KEY,DECK_KEY].some(key=>storageState.get(key)?.blocked)}
function checkStorage(keys){
 let changed=false;
 for(const key of keys){const state=storageState.get(key);if(!state||state.blocked)continue;
  try{if(localStorage.getItem(key)===state.raw)continue;state.reason='conflict'}catch{state.reason='unavailable'}
  state.blocked=true;changed=true;
 }
 if(changed)refreshStorageNotices();
 return keys.every(key=>!storageState.get(key)?.blocked);
}
let vaultReloading=false;
function storeJson(key,value){if(vaultReloading)return false;if(!checkStorage(key===HUB_KEY?[HUB_KEY]:[KEY,DECK_KEY]))return false;try{const raw=JSON.stringify(value);localStorage.setItem(key,raw);storageState.get(key).raw=raw;return true}catch{const state=storageState.get(key);state.blocked=true;state.reason='unavailable';refreshStorageNotices();toast(key===HUB_KEY?'Game preferences are temporary on this device.':'Saving is unavailable. Export your cards before closing this tab.');return false}}
function downloadPreserved(key,name){try{const raw=storageState.get(key)?.raw;if(raw===null||raw===undefined)return;const url=URL.createObjectURL(new Blob([raw],{type:'application/json'})),a=el('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}catch{toast('The preserved data could not be downloaded. Keep this tab open and try again.')}}
function refreshStorageNotices(){
 const hint=document.querySelector('#study .hint');
 if(hint)hint.textContent='← → navigate · Space flips · '+(studyBlocked()?'Changes are temporary — export before reloading':'Progress saves on this device');
 for(const [id,target,keys] of [['studyStorageNotice',document.querySelector('#study .study-layout'),[KEY,DECK_KEY]],['gameStorageNotice',$('filters'),[HUB_KEY]]]){
  let box=$(id);if(!box){box=el('div',undefined,'storage-notice');box.id=id;box.setAttribute('role','status');target.before(box)}
  const blocked=keys.filter(key=>storageState.get(key)?.blocked);box.hidden=!blocked.length;box.replaceChildren();if(!blocked.length)continue;
  const unavailable=blocked.some(key=>storageState.get(key).reason==='unavailable'),conflict=blocked.some(key=>storageState.get(key).reason==='conflict');
  box.append(el('strong',conflict?'Saved data changed in another tab.':unavailable?'Saving is unavailable on this device.':'Saved data could not be read safely.'));
  box.append(el('p',id==='studyStorageNotice'?'Study changes are temporary in this tab. Existing saved data will not be replaced. Export your current cards before closing or reloading.':'Game preferences are temporary in this tab. Existing favourites and recently played data will not be replaced. Game saves are separate.'));
  if(conflict)box.append(el('p','Keep any changes you need, then reload to load the newer saved data. Nothing is merged automatically.'));
  if(storageState.get(KEY)?.reason==='unreadable'&&id==='studyStorageNotice')box.append(el('p','Starter cards are shown instead of your unreadable cards.'));
  for(const key of blocked)if(storageState.get(key).raw!==null){const label=key===KEY?'cards':key===DECK_KEY?'decks':'preferences',prefix=storageState.get(key).reason==='conflict'?'Download this tab’s previous ':'Download preserved ';box.append(button(prefix+label,()=>downloadPreserved(key,key===KEY?'study-cards-preserved.json':key===DECK_KEY?'study-decks-preserved.json':'game-preferences-preserved.json')))}
 }
}
window.addEventListener('storage',event=>{
 try{if(event.storageArea!==localStorage)return}catch{return}
 if(event.key===null)checkStorage([KEY,DECK_KEY,HUB_KEY]);
 else if(event.key===KEY||event.key===DECK_KEY)checkStorage([KEY,DECK_KEY]);
 else if(event.key===HUB_KEY)checkStorage([HUB_KEY]);
});
function toast(t){$('notice').textContent=t;$('notice').style.display='block';clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('notice').style.display='none',4000)}
function el(tag,text,cls){const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e}
function button(text,fn,cls){const b=el('button',text,cls);b.type='button';b.onclick=fn;return b}
function valid(v){return Array.isArray(v)&&v.length<=10000&&v.every(c=>c&&typeof c.id==='string'&&c.id.length<=100&&typeof c.deck==='string'&&c.deck.trim()&&c.deck.length<=60&&typeof c.q==='string'&&c.q.trim()&&c.q.length<=2000&&typeof c.a==='string'&&c.a.trim()&&c.a.length<=4000)}
function validDecks(v){return Array.isArray(v)&&v.length<=10000&&v.every(x=>typeof x==='string'&&x.trim()&&x.length<=60)}
const starter=[['Science','What is a force?','A push or pull that can change an object’s motion or shape.'],['Science','What is the difference between a mixture and a pure substance?','A mixture contains two or more substances. A pure substance contains only one substance.'],['Science','What does the independent variable mean?','The factor you deliberately change in an experiment.'],['Science','What force pulls objects towards Earth?','Gravity.'],['Science','How can you separate an insoluble solid from a liquid?','By filtration. The solid stays in the filter and the liquid passes through.'],['Maths','What is 15% of 80?','12. Calculate 0.15 × 80.'],['Maths','Solve: 3x + 5 = 20','x = 5. Subtract 5, then divide by 3.'],['Maths','What is the area of a triangle?','½ × base × perpendicular height.'],['Maths','What is −4 + 9?','5'],['English','What is a simile?','A comparison using “like” or “as”.'],['English','What is a metaphor?','A comparison that describes one thing as another.'],['English','What is personification?','Giving human qualities to something non-human.']].map((a,i)=>({id:'starter-'+i,deck:a[0],q:a[1],a:a[2],known:false}));
let cards=loadJson(KEY,starter,valid);
let deckNames=loadJson(DECK_KEY,[],validDecks);deckNames=[...new Set([...deckNames,...cards.map(c=>c.deck)])];
let deck=deckNames[0]||'My deck',index=0,flipped=false,order=[],arcade=false,playing=null,inPlayer=false,paused=false,hits=[],filter='All',tag='All';
const games=window.GAME_CATALOG;
let hub=loadJson(HUB_KEY,{},v=>v&&typeof v==='object'&&!Array.isArray(v)&&['favourites','recent'].every(key=>v[key]===undefined||(Array.isArray(v[key])&&v[key].every(id=>typeof id==='string'&&id.length<=100))));
// Keep retired IDs so preferences survive reversible catalogue changes.
for(const key of ['favourites','recent'])hub[key]=Array.isArray(hub[key])?[...new Set(hub[key].filter(id=>typeof id==='string'&&id.length<=100))].slice(0,1000):[];
function cleanPlays(value){const clean={};if(!value||typeof value!=='object'||Array.isArray(value))return clean;for(const [k,n] of Object.entries(value))if(typeof k==='string'&&k&&k.length<=100&&Number.isInteger(n)&&n>=0&&n<=1000000)clean[k]=n;return clean}
hub.plays=cleanPlays(hub.plays);
function save(){if(!checkStorage([KEY,DECK_KEY])){toast('These changes are temporary. Export your cards before closing or reloading.');return false}return storeJson(KEY,cards)&&storeJson(DECK_KEY,deckNames)}
function reset(){order=cards.filter(c=>c.deck===deck).map(c=>c.id);index=0;flipped=false;render()}
function current(){return cards.find(c=>c.id===order[index])}
function render(){
 $('decks').replaceChildren();for(const name of deckNames){const b=button(name+' · '+cards.filter(c=>c.deck===name).length,()=>{deck=name;reset()},name===deck?'selected':'');$('decks').append(b)}
 const c=current();$('decktitle').textContent=deck;$('cardtext').textContent=c?(flipped?c.a:c.q):'Create your first card';$('side').textContent=flipped?'ANSWER':'QUESTION';$('card').classList.toggle('answer',flipped);$('count').textContent=`${order.length?index+1:0} / ${order.length} cards`;const known=cards.filter(c=>c.deck===deck&&c.known).length;$('mastered').textContent=known+' mastered';$('bar').style.width=(order.length?known/order.length*100:0)+'%';
 for(const id of ['again','know','prev','next','shuffle'])$(id).disabled=!c;
}
function advance(n=1){if(order.length)index=(index+n+order.length)%order.length;flipped=false;render()}
$('card').onclick=()=>{if(current()){flipped=!flipped;render()}};$('next').onclick=()=>advance();$('prev').onclick=()=>advance(-1);
for(const [id,known] of [['know',true],['again',false]])$(id).onclick=()=>{const c=current();if(c){c.known=known;save();advance()}};
$('shuffle').onclick=()=>{for(let i=order.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[order[i],order[j]]=[order[j],order[i]]}index=0;flipped=false;render()};
function clearEdit(){ $('editingId').value='';$('question').value='';$('answer').value='';$('saveCard').textContent='Add card';$('cancelCardEdit').hidden=true; }
function listCards(){const box=$('cardlist');box.replaceChildren();for(const c of cards.filter(c=>c.deck===deck)){const row=el('div',undefined,'row'),text=el('span',c.q),actions=el('div');actions.append(button('Edit',()=>{$('editingId').value=c.id;$('deckName').value=c.deck;$('question').value=c.q;$('answer').value=c.a;$('saveCard').textContent='Save changes';$('cancelCardEdit').hidden=false;$('question').focus()}),button('Delete',()=>{if(!confirm('Delete this card?'))return;cards=cards.filter(x=>x.id!==c.id);clearEdit();save();reset();listCards()}));row.append(text,actions);box.append(row)}}
$('edit').onclick=()=>{clearEdit();$('deckName').value=deck;listCards();$('editor').showModal()};$('closeEdit').onclick=()=>$('editor').close();$('cancelCardEdit').onclick=clearEdit;
$('editorForm').onsubmit=e=>{e.preventDefault();const q=$('question').value.trim(),a=$('answer').value.trim(),d=$('deckName').value.trim();if(!q||!a||!d||d.length>60||q.length>2000||a.length>4000)return;const existing=cards.find(c=>c.id===$('editingId').value);if(existing){Object.assign(existing,{deck:d,q,a})}else{if(cards.length>=10000){toast('The 10,000-card limit has been reached.');return}cards.push({id:crypto.randomUUID(),deck:d,q,a,known:false})}if(!deckNames.includes(d))deckNames.push(d);deck=d;save();reset();listCards();clearEdit();$('editStatus').textContent=existing?'Card updated.':'Card added.'};
$('newDeck').onclick=()=>{const name=prompt('Name your new deck:')?.trim();if(!name)return;if(name.length>60){toast('Use a deck name under 60 characters.');return}if(!deckNames.includes(name))deckNames.push(name);deck=name;clearEdit();$('deckName').value=name;save();reset();listCards()};
$('renameDeck').onclick=()=>{const name=prompt('Rename '+deck+':',deck)?.trim();if(!name||name===deck)return;if(name.length>60||deckNames.includes(name)){toast('Choose a unique name under 60 characters.');return}for(const c of cards)if(c.deck===deck)c.deck=name;deckNames=deckNames.map(d=>d===deck?name:d);deck=name;$('deckName').value=name;clearEdit();save();reset();listCards()};
$('deleteDeck').onclick=()=>{if(!confirm('Delete the deck “'+deck+'” and its cards? Export a backup first if you want to keep them.'))return;cards=cards.filter(c=>c.deck!==deck);deckNames=deckNames.filter(d=>d!==deck);deck=deckNames[0]||'My deck';clearEdit();$('deckName').value=deck;save();reset();listCards()};
function download(name,data){const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})),a=el('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
$('backup').onclick=()=>download('study-cards.json',{version:2,cards,decks:deckNames});
$('import').onchange=async e=>{
 try{
  const file=e.target.files[0];if(!file)return;if(file.size>10000000)throw Error();
  const text=await file.text();if(text.length>10000000)throw Error();
  const payload=JSON.parse(text),incoming=Array.isArray(payload)?payload:payload?.cards,names=Array.isArray(payload)?[]:payload?.decks??[];
  if(!valid(incoming)||incoming.length+cards.length>10000||!validDecks(names))throw Error();
  const nextDecks=[...new Set([...deckNames,...names,...incoming.map(c=>c.deck)])];if(!validDecks(nextDecks))throw Error();
  // Prepare the entire import before changing live data; keep only supported fields.
  const added=incoming.map(c=>({id:crypto.randomUUID(),deck:c.deck,q:c.q,a:c.a,known:!!c.known}));
  cards=[...cards,...added];deckNames=nextDecks;deck=incoming[0]?.deck||deckNames[0]||'My deck';
  const persisted=save();reset();if($('editor').open){clearEdit();$('deckName').value=deck;listCards();}
  toast(persisted?'Imported. Existing cards and decks were kept.':'Imported into this tab only. Changes are temporary; export your cards before closing or reloading.');
 }catch{toast('Choose a valid Study Desk export under 10 MB, within the 10,000-card and 10,000-deck limits.')}finally{e.target.value=''}
};
for(const genre of [...new Set(games.map(g=>g.genre))].sort()){$('genre').append(new Option(genre,genre))}
const sessionReturn=el('div',undefined,'session-return');sessionReturn.id='sessionReturn';sessionReturn.hidden=true;$('filters').before(sessionReturn);
function drawFilters(){const focused=$('filters').contains(document.activeElement)?document.activeElement.textContent:null,groups=[...new Set(games.map(g=>g.group))];$('filters').replaceChildren();for(const name of ['All',...(groups.length>1?groups:[]),'Favourites','Recently played']){const b=button(name,()=>{filter=name;drawGames()},name===filter?'active':'');b.setAttribute('aria-pressed',String(name===filter));$('filters').append(b);if(name===focused)b.focus()}}
function focusGame(id,action='play'){const target=[...$('games').querySelectorAll('button[data-game]')].find(b=>b.dataset.game===id&&b.dataset.action===action);(target||$('search')).focus()}
function drawGames(){
 const sessionFocused=sessionReturn.contains(document.activeElement),active=games.find(g=>g.id===playing);sessionReturn.replaceChildren();sessionReturn.hidden=!active;if(active){const back=button('Return to '+active.title+' →',()=>play(active));sessionReturn.append(el('span','Your current session stays open while you browse.'),back);if(sessionFocused)back.focus()}
 drawFilters();$('gameCount').textContent=games.length+' games';$('openGames').textContent='Games · '+games.length+' →';$('switch').textContent='Browse '+games.length+' games →';$('includedCount').textContent=games.filter(g=>g.type!=='external').length+' games included here';const grid=$('games');grid.replaceChildren();const term=$('search').value.trim().toLowerCase(),genre=$('genre').value;
 let list=games.filter(g=>term.split(/\s+/).every(word=>(g.title+' '+g.description+' '+g.genre+' '+g.group+' '+(g.aliases||[]).join(' ')).toLowerCase().includes(word))&&(genre==='all'||g.genre===genre)&&tagMatch(g)&&(filter==='All'||g.group===filter||(filter==='Favourites'&&hub.favourites.includes(g.id))||(filter==='Recently played'&&hub.recent.includes(g.id))));
 layoutStore();
 if($('sortGames').value==='az')list.sort((a,b)=>a.title.localeCompare(b.title));
 if(filter==='Recently played'||$('sortGames').value==='recent')list.sort((a,b)=>(hub.recent.includes(a.id)?hub.recent.indexOf(a.id):Infinity)-(hub.recent.includes(b.id)?hub.recent.indexOf(b.id):Infinity));$('resultsCount').textContent=list.length+' shown';
 if(!list.length){const empty=el('div',undefined,'empty');empty.append(el('p',filter==='Favourites'?'No favourites match these filters. Use a star on a game to save it here.':filter==='Recently played'?'No recently played games match these filters.':'No games match these filters.'),button('Clear filters',()=>{$('search').value='';$('genre').value='all';filter='All';tag='All';drawGames();$('search').focus()}));grid.append(empty);return}
 const sections=new Map(),groupMode=$('groupBy').value;
 for(const g of list){
  const groupName=groupMode==='genre'?g.genre:groupMode==='collection'?g.group:'All games';
  if(!sections.has(groupName)){const section=el('section',undefined,'game-section'),heading=el('h2',groupName),items=el('div',undefined,'grid');heading.append(el('small',String(list.filter(item=>(groupMode==='genre'?item.genre:groupMode==='collection'?item.group:'All games')===groupName).length)));section.append(heading,items);grid.append(section);sections.set(groupName,items)}
  const tile=el('article',undefined,'game'),art=el('div',undefined,'art');art.style.setProperty('--shade',g.color);if(g.thumbnail){const img=el('img');img.src=g.thumbnail;img.alt=g.title+' gameplay';img.loading='lazy';img.width=320;img.height=160;art.append(img)}else art.textContent=g.icon;
  const fav=button(hub.favourites.includes(g.id)?'★':'☆',()=>{hub.favourites=hub.favourites.includes(g.id)?hub.favourites.filter(x=>x!==g.id):[...hub.favourites,g.id];storeJson(HUB_KEY,hub);drawGames();focusGame(g.id,'favourite')},'fav');fav.dataset.game=g.id;fav.dataset.action='favourite';fav.setAttribute('aria-label','Favourite '+g.title);fav.setAttribute('aria-pressed',String(hub.favourites.includes(g.id)));
  const body=el('div',undefined,'game-content');body.append(el('div',g.genre+' · '+g.group,'eyebrow'),el('h3',g.title),el('p',g.description));const badges=el('div',undefined,'badges');for(const label of [g.type==='external'?'Official-site link':'Bundled',g.internet?'Internet required':'Local assets',g.id==='lucky-company'?'Solo download':g.id==='doom-web'?'Freedoom data':''])if(label)badges.append(el('span',label));
  const details=el('details');details.append(el('summary','Controls & details'),el('p',g.controls+' · '+g.multiplayer));details.append(badges);const launch=button(g.type==='external'?'Open official site ↗':playing===g.id?'Return to game →':'Play game →',()=>play(g));launch.dataset.game=g.id;launch.dataset.action='play';launch.setAttribute('aria-label',(playing===g.id?'Return to ':'Play ')+g.title);body.append(details,launch);
  if(g.id==='lucky-company'){const online=el('a','Original online version ↗');online.href='https://lucky-company.work-7072.chatgpt.site';online.target='_blank';online.rel='noopener';body.append(online)}
  const credits=el('a','Credits & source ↗');credits.href=g.credits;credits.target='_blank';credits.rel='noopener';details.append(credits);tile.append(art,fav,body);sections.get(groupName).append(tile);
 }
}
function visibility(visible){$('frame').contentWindow?.postMessage({type:'study-visibility',visible:visible&&!document.hidden},location.origin)}
document.addEventListener('visibilitychange',()=>{visibility(arcade&&inPlayer&&!paused);if(document.hidden)releaseFullscreen()});
function releaseFullscreen(){try{$('frame').contentDocument?.exitPointerLock?.();if($('frame').contentDocument?.fullscreenElement)$('frame').contentDocument.exitFullscreen?.().catch(()=>{})}catch{}document.exitPointerLock?.();if(document.fullscreenElement)document.exitFullscreen?.().catch(()=>{})}
function show(){if($('editor').open)$('editor').close();$('study').hidden=arcade;$('arcade').hidden=!arcade||inPlayer;$('player').hidden=!arcade||!inPlayer;document.body.classList.toggle('playing',arcade&&inPlayer);document.title='Study Desk';visibility(arcade&&inPlayer&&!paused);$('pauseCover').hidden=!paused;$('pauseGame').textContent=paused?'Resume':'Pause';$('frame').inert=paused;$('frame').tabIndex=paused?-1:0;if(!arcade||!inPlayer||paused)releaseFullscreen();if(!arcade)$('card').focus();else if(inPlayer)$(paused?'resumeGame':'frame').focus();else $('search').focus({preventScroll:true})}
function toggle(){arcade=!arcade;show();if(arcade&&!inPlayer)drawGames()}
function openCollection(returnToGame=false){window.selectEntertainment?.('games',false);arcade=true;inPlayer=false;show();drawGames();if(returnToGame&&playing)focusGame(playing)}
function record(g,countPlay){hub.recent=[g.id,...hub.recent.filter(x=>x!==g.id)].slice(0,20);if(countPlay){hub.plays=cleanPlays(hub.plays);hub.plays[g.id]=Math.min(1000000,(hub.plays[g.id]||0)+1)}storeJson(HUB_KEY,hub)}
let loadingTimer,loadAttempt=0,currentLoad=null;
const loadMessage=el('span'),loadActions=el('div',undefined,'load-actions'),retryLoad=button('Retry game',()=>restartCurrent()),loadCollection=button('Back to collection',()=>openCollection(true));
loadMessage.id='loadMessage';loadActions.id='loadActions';retryLoad.id='retryLoad';loadCollection.id='loadCollection';loadActions.append(retryLoad,loadCollection);loadActions.hidden=true;$('loadStatus').replaceChildren(loadMessage,loadActions);
function launchWarning(message,moveFocus=true){const focused=$('frame')===document.activeElement;$('loadStatus').hidden=false;loadMessage.textContent=message;loadActions.hidden=false;$('frame').setAttribute('aria-busy','false');if(moveFocus&&focused&&arcade&&inPlayer&&!paused)retryLoad.focus();}
function beginLoad(g){clearTimeout(loadingTimer);const attempt=++loadAttempt;currentLoad={game:g,url:new URL(g.url,location.href),attempt,settled:false};$('loadStatus').hidden=false;loadActions.hidden=true;loadMessage.textContent='Loading '+g.title+'…';$('frame').setAttribute('aria-busy','true');loadingTimer=setTimeout(()=>{if(currentLoad?.attempt===attempt&&!currentLoad.settled)launchWarning(g.title+' is taking longer than expected. You can keep waiting, retry, or return to the collection.',false)},15000);$('frame').src=g.url;}
function restartCurrent(){const g=games.find(g=>g.id===playing);if(g&&confirm('Reload this game? Unsaved progress may be lost. Saved progress is not deleted.')){paused=false;beginLoad(g);show()}}
function gamePath(url){return url.pathname.replace(/\/index\.html$/,'/')}
function play(g){
 const currentGame=games.find(game=>game.id===playing);
 if(g.type!=='external'&&currentGame&&playing!==g.id&&!confirm('Switch from '+currentGame.title+' to '+g.title+'? This closes the current session. Unsaved progress may be lost. Saved progress is not deleted.'))return;
 record(g,playing!==g.id);if(g.type==='external'){window.open(g.url,'_blank','noopener');toast(g.title+' opens separately. Return to this tab to use Study Desk; PPP cannot control the other tab.');drawGames();return}if(playing!==g.id){visibility(false);beginLoad(g);playing=g.id;paused=false}$('frame').title=g.title+' game';$('playing').textContent=g.title;$('gameHelp').textContent=g.controls+' · PPP returns to study (P is reserved)';arcade=true;inPlayer=true;show()
}
$('frame').onload=()=>{
 if(!currentLoad)return;
 try{const loaded=new URL($('frame').contentWindow.location.href);if(loaded.origin!==currentLoad.url.origin||gamePath(loaded)!==gamePath(currentLoad.url))return;
  currentLoad.settled=true;clearTimeout(loadingTimer);if(!$('frame').contentWindow.StudyBridge){launchWarning(currentLoad.game.title+' did not load its Study Desk controls. Try reloading the game.');return;}
 }catch{currentLoad.settled=true;clearTimeout(loadingTimer);launchWarning('This game page could not be checked. Try reloading it or return to the collection.');return;}
 $('frame').setAttribute('aria-busy','false');$('loadStatus').hidden=true;loadActions.hidden=true;visibility(arcade&&inPlayer&&!paused);if(arcade&&inPlayer&&!paused)$('frame').focus();
};
$('restartGame').onclick=restartCurrent;
$('openGames').onclick=()=>openCollection();
function openHash(){if(['#games','#movies','#tv'].includes(location.hash)){openCollection();window.selectEntertainment?.(location.hash.slice(1),false)}}
window.addEventListener('hashchange',openHash);
$('libraryBtn').onclick=()=>openCollection(true);$('switch').onclick=()=>openCollection();
$('pauseGame').onclick=()=>{paused=!paused;show()};$('resumeGame').onclick=()=>{paused=false;show()};$('search').oninput=drawGames;$('genre').onchange=drawGames;$('groupBy').onchange=drawGames;$('sortGames').onchange=drawGames;$('clearFilters').onclick=()=>{$('search').value='';$('genre').value='all';$('groupBy').value='genre';$('sortGames').value='collection';filter='All';tag='All';drawGames();$('search').focus()};
window.addEventListener('message',e=>{if(e.source===$('frame').contentWindow&&e.origin===location.origin&&e.data?.type==='study-toggle')toggle()});
window.addEventListener('keydown',e=>{if(e.repeat||e.isComposing||e.ctrlKey||e.altKey||e.metaKey||e.target.closest?.('input,textarea,select,[contenteditable]:not([contenteditable="false"])'))return;const now=performance.now();if(e.key.toLowerCase()==='p'){hits=hits.filter(t=>now-t<=1000);hits.push(now);if(hits.length===3){hits=[];e.preventDefault();toggle()}return}hits=[];if(arcade||$('editor').open)return;if(e.code==='Space'&&e.target.tagName!=='BUTTON'){e.preventDefault();$('card').click()}if(e.key==='ArrowRight')advance();if(e.key==='ArrowLeft')advance(-1)},true);
function weekMonday(date=new Date()){const monday=new Date(date.getFullYear(),date.getMonth(),date.getDate());const day=monday.getDay()||7;monday.setDate(monday.getDate()-(day-1));monday.setHours(0,0,0,0);return monday}
function mondayPick(date=new Date()){
 const bundled=games.filter(g=>g.type!=='external').sort((a,b)=>a.id.localeCompare(b.id));
 if(!bundled.length)return null;
 const days=Math.round((weekMonday(date).getTime()-new Date(2024,0,1).getTime())/86400000);
 return bundled[((Math.floor(days/7)%bundled.length)+bundled.length)%bundled.length];
}
window.studyMondayPick=mondayPick;
function renderMondayPick(sectionId,textId,buttonId){
 const section=$(sectionId),text=$(textId),button=$(buttonId),game=mondayPick();
 if(!section||!text||!button)return;
 section.dataset.ready=game?'true':'false';section.hidden=!game;if(!game)return;
 const when=weekMonday().toLocaleDateString('en-GB',{day:'numeric',month:'long'});
 text.textContent='Week of '+when+'. '+game.title+'. '+game.description+' A new bundled game is chosen each Monday.';
 button.textContent='Play Monday pick: '+game.title;
 button.setAttribute('aria-describedby',textId);
 button.onclick=()=>play(game);
}
function renderMondayPicks(){renderMondayPick('studyMonday','studyMondayText','studyMondayPlay');renderMondayPick('arcadeMonday','arcadeMondayText','arcadeMondayPlay')}
const SAVE_VAULT_LIMIT=12000000;
function storageEntries(){
 const entries=[];
 for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(typeof key!=='string'||!key)continue;let value;try{value=localStorage.getItem(key)}catch{throw Error('unreadable')}if(typeof value!=='string')continue;entries.push({key,value})}
 entries.sort((a,b)=>a.key<b.key?-1:a.key>b.key?1:0);return entries;
}
function hasStoredKey(key){for(let i=0;i<localStorage.length;i++)if(localStorage.key(i)===key)return true;return false}
function validVault(payload){
 if(!payload||typeof payload!=='object'||Array.isArray(payload)||payload.format!=='study-desk-saves'||payload.version!==1)return false;
 if(!Array.isArray(payload.entries)||payload.entries.length>4000)return false;
 const seen=new Set();
 for(const entry of payload.entries){
  if(!entry||typeof entry!=='object'||Array.isArray(entry)||typeof entry.key!=='string'||typeof entry.value!=='string')return false;
  if(!entry.key||entry.key.length>512||entry.value.length>SAVE_VAULT_LIMIT||seen.has(entry.key))return false;
  seen.add(entry.key);
 }
 return true;
}
window.studySaveVault={validVault};
function setVaultStatus(message){for(const id of ['saveVaultStatus','saveVaultStatusArcade']){const node=$(id);if(node)node.textContent=message}}
function exportAllSaves(){
 try{
  const entries=storageEntries();
  download('study-desk-saves.json',{format:'study-desk-saves',version:1,exportedAt:new Date().toISOString(),entries});
  const message='Exported '+entries.length+' saved item'+(entries.length===1?'':'s')+'.';
  setVaultStatus(message);toast(message+' The file stays on this device.');
 }catch{setVaultStatus('Saves could not be exported.');toast('Saves could not be exported. Keep this tab open and try again.')}
}
async function importAllSaves(file){
 if(!file)return;
 if(file.size>SAVE_VAULT_LIMIT){setVaultStatus('That file is over 12 MB and was not imported.');toast('Choose a Study Desk save file under 12 MB.');return}
 const text=await file.text();
 if(text.length>SAVE_VAULT_LIMIT){setVaultStatus('That file is over 12 MB and was not imported.');toast('Choose a Study Desk save file under 12 MB.');return}
 const payload=JSON.parse(text);
 if(!validVault(payload)){setVaultStatus('That file is not a Study Desk save backup.');toast('That file is not a Study Desk save backup.');return}
 const changes=[];
 for(const entry of payload.entries){const had=hasStoredKey(entry.key),old=had?localStorage.getItem(entry.key):null;if(had&&old===entry.value)continue;changes.push({key:entry.key,value:entry.value,had,old})}
 if(!await reviewSaveImport(changes)){setVaultStatus('Import cancelled. Current saves were kept.');return}
 if(!changes.length){setVaultStatus('Nothing in that file was different, so no saves were changed.');return}
 const touched=[];
 try{
  for(const entry of changes){localStorage.setItem(entry.key,entry.value);touched.push(entry)}
 }catch{
  for(const item of touched.reverse()){try{if(item.had)localStorage.setItem(item.key,item.old);else localStorage.removeItem(item.key)}catch{}}
  setVaultStatus('Import stopped and previous saves were kept.');toast('Import stopped and previous saves were kept.');return;
 }
 vaultReloading=true;setVaultStatus('Saves restored. Reloading.');toast('Saves restored. Reloading.');
 try{window.studyReloadAfterImport()}catch{setVaultStatus('Saves restored. Reload this page to use them.')}
}
window.studyReloadAfterImport=()=>location.reload();
$('saveImportForm').addEventListener('submit',event=>event.preventDefault());
function openModal(dialog){if(typeof dialog.showModal==='function'){try{if(!dialog.open)dialog.showModal();return}catch{}}dialog.open=true}
function closeModal(dialog){if(typeof dialog.close==='function'){try{dialog.close();return}catch{}}dialog.open=false}
function reviewSaveImport(changes){
 const dialog=$('saveImportDialog'),list=$('saveImportList'),summary=$('saveImportSummary'),confirm=$('saveImportConfirm'),cancel=$('saveImportCancel'),note=$('saveImportNote');
 list.replaceChildren();
 const count=changes.length;
 summary.textContent=count?(count+' save'+(count===1?'':'s')+' will change.'):'Nothing in this file is different from the saves on this device.';
 for(const entry of changes){const item=el('li');item.append(el('code',entry.key),document.createTextNode(entry.had?' — replaces the copy on this device':' — new on this device'));list.append(item)}
 confirm.hidden=!count;cancel.textContent=count?'Cancel':'Close';
 note.hidden=!count;
 return new Promise(resolve=>{
  let settled=false;
  const finish=ok=>{if(settled)return;settled=true;dialog.removeEventListener('cancel',onCancel);dialog.removeEventListener('keydown',onKey);closeModal(dialog);resolve(ok)};
  const onCancel=event=>{event.preventDefault();finish(false)};
  const onKey=event=>{if(event.key==='Escape'){event.preventDefault();finish(false)}};
  cancel.onclick=()=>finish(false);confirm.onclick=()=>finish(true);
  dialog.addEventListener('cancel',onCancel);dialog.addEventListener('keydown',onKey);
  openModal(dialog);try{cancel.focus()}catch{}
 });
}
function gameTagList(g){return [g.type==='external'?'Official site':'Bundled',g.internet?'Needs internet':'Offline']}
function tagMatch(g){return tag==='All'||gameTagList(g).includes(tag)}
function storefrontHome(){return filter==='All'&&$('genre').value==='all'&&tag==='All'&&!$('search').value.trim()}
function reduceMotion(){try{return matchMedia('(prefers-reduced-motion: reduce)').matches}catch{return false}}
function svgEl(name,attrs){const node=document.createElementNS('http://www.w3.org/2000/svg',name);for(const [key,value] of Object.entries(attrs))node.setAttribute(key,value);return node}
function heroScene(game){
 const svg=svgEl('svg',{viewBox:'0 0 640 360',role:'img','aria-label':''});
 svg.setAttribute('aria-hidden','true');
 const shade=game.color||'#345943';
 svg.append(svgEl('rect',{width:'640',height:'360',fill:'#10211c'}));
 svg.append(svgEl('rect',{width:'640',height:'360',fill:shade,opacity:'.35'}));
 if(game.id==='gummy-bay'){
  svg.append(svgEl('path',{d:'M0 250 C120 210 180 280 320 240 C460 200 520 270 640 220 L640 360 L0 360 Z',fill:'#1d4c45'}));
  svg.append(svgEl('path',{d:'M40 250 L110 190 L180 250 Z',fill:'#d7c39a'}));
  svg.append(svgEl('rect',{x:'78',y:'220',width:'64',height:'48',rx:'4',fill:'#efe6d2'}));
  svg.append(svgEl('rect',{x:'250',y:'200',width:'90',height:'70',rx:'4',fill:'#f4efe4'}));
  svg.append(svgEl('path',{d:'M236 206 H354 L332 176 H258 Z',fill:'#e3c56b'}));
  svg.append(svgEl('rect',{x:'430',y:'214',width:'70',height:'54',rx:'4',fill:'#efe6d2'}));
 }else{
  svg.append(svgEl('circle',{cx:'480',cy:'120',r:'90',fill:shade,opacity:'.85','class':'float'}));
  svg.append(svgEl('circle',{cx:'160',cy:'230',r:'120',fill:'#000',opacity:'.18'}));
 }
 return svg;
}
let heroIndex=0,heroTimer,heroPaused=false,heroHover=false;
function heroSlides(){
 const slides=[],gummy=games.find(g=>g.id==='gummy-bay'),monday=mondayPick();
 if(gummy)slides.push({game:gummy,kicker:'Featured'});
 if(monday&&(!gummy||monday.id!==gummy.id))slides.push({game:monday,kicker:'Monday pick'});
 const extra=games.find(g=>g.type!=='external'&&!slides.some(slide=>slide.game.id===g.id));
 if(extra)slides.push({game:extra,kicker:'On the desk'});
 return slides;
}
function showHero(index,announce){
 const track=$('heroTrack'),slides=[...track.children],dots=[...$('heroDots').children];
 if(!slides.length)return;
 heroIndex=(index+slides.length)%slides.length;
 track.style.transform='translateX('+-heroIndex*100+'%)';
 slides.forEach((slide,i)=>{const on=i===heroIndex;try{slide.inert=!on}catch{}slide.setAttribute('aria-hidden',String(!on))});
 dots.forEach((dot,i)=>{dot.setAttribute('aria-selected',String(i===heroIndex));dot.tabIndex=i===heroIndex?0:-1});
 if(announce){const title=slides[heroIndex].querySelector('h3')?.textContent||'';$('heroStatus').textContent='Slide '+(heroIndex+1)+' of '+slides.length+': '+title}
}
function queueHero(){
 clearTimeout(heroTimer);
 const carousel=$('heroCarousel');
 if(!carousel||carousel.hidden||heroPaused||heroHover||reduceMotion()||document.hidden||$('gameCollection')?.hidden||$('arcade')?.hidden)return;
 if($('heroTrack').children.length<2)return;
 heroTimer=setTimeout(()=>{showHero(heroIndex+1,false);queueHero()},7000);
}
function renderHero(){
 const track=$('heroTrack'),dots=$('heroDots');if(!track||!dots)return;
 const slides=heroSlides();track.replaceChildren();dots.replaceChildren();
 slides.forEach((slide,i)=>{
  const art=el('div',undefined,'hero-art');art.style.setProperty('--shade',slide.game.color||'#345943');art.append(heroScene(slide.game),el('span',slide.game.icon,'hero-icon'));
  const copy=el('div',undefined,'hero-copy');
  copy.append(el('p',slide.kicker,'eyebrow'),el('h3',slide.game.title),el('p',slide.game.description));
  const playLabel=slide.kicker==='Monday pick'?'Play Monday pick: '+slide.game.title:'Play '+slide.game.title;
  copy.append(button(playLabel,()=>play(slide.game),'primary'));
  const panel=el('article',undefined,'hero-slide');panel.append(art,copy);track.append(panel);
  const dot=button('',()=>{showHero(i,true);queueHero()});
  dot.setAttribute('role','tab');dot.setAttribute('aria-label','Show featured game '+slide.game.title);dots.append(dot);
 });
 showHero(0,false);queueHero();
}
function fillShelf(section,row,items,label){
 if(!section||!row)return;
 section.hidden=!items.length;if(section.hidden){row.replaceChildren();return}
 row.replaceChildren();
 for(const g of items){
  const card=button('',()=>play(g),'capsule');
  card.setAttribute('aria-label',label+' '+g.title);
  const art=el('span',g.icon,'capsule-art');art.style.setProperty('--shade',g.color||'#345943');
  card.append(art,el('span',g.title,'capsule-title'),el('span',g.genre,'capsule-genre'));
  row.append(card);
 }
}
function layoutStore(){
 const home=storefrontHome();
 if($('heroCarousel'))$('heroCarousel').hidden=!home;
 if($('arcadeMonday'))$('arcadeMonday').hidden=!home||$('arcadeMonday').dataset.ready!=='true';
 if(!home){for(const id of ['continuePlaying','trendingRow','newRow','favouriteShelf'])if($(id))$(id).hidden=true;syncChips();syncHeroMotion();return}
 const byId=id=>games.find(game=>game.id===id);
 fillShelf($('continuePlaying'),$('continueRow'),hub.recent.map(byId).filter(Boolean).slice(0,12),'Continue playing');
 fillShelf($('trendingRow'),$('trendingCards'),Object.entries(hub.plays).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).map(([id])=>byId(id)).filter(Boolean).slice(0,12),'Trending');
 fillShelf($('newRow'),$('newCards'),games.filter(g=>g.type!=='external').slice(-12).reverse(),'New');
 fillShelf($('favouriteShelf'),$('favouriteRow'),hub.favourites.map(byId).filter(Boolean).slice(0,12),'Favourite');
 const opened=Object.values(hub.plays).reduce((sum,n)=>sum+n,0);
 if($('deskStats'))$('deskStats').textContent=opened?opened+' '+(opened===1?'session':'sessions')+' opened on this device':'No sessions on this device yet';
 syncChips();syncHeroMotion();
}
function syncHeroMotion(){queueHero()}
function syncChips(){
 if($('genreChips'))for(const chip of $('genreChips').querySelectorAll('button'))chip.setAttribute('aria-pressed',String(chip.dataset.genre===$('genre').value));
 if($('tagFilters'))for(const chip of $('tagFilters').querySelectorAll('button'))chip.setAttribute('aria-pressed',String(chip.dataset.tag===tag));
}
function buildGenreChips(){
 const row=$('genreChips');if(!row)return;row.replaceChildren();
 const add=(label,value)=>{const chip=button(label,()=>{$('genre').value=value;drawGames()});chip.dataset.genre=value;row.append(chip)};
 add('All genres','all');
 for(const option of [...$('genre').options])if(option.value!=='all')add(option.textContent,option.value);
}
function buildTagChips(){
 const row=$('tagFilters');if(!row)return;row.replaceChildren();
 for(const name of ['All','Bundled','Offline','Needs internet']){const chip=button(name,()=>{tag=name;drawGames()});chip.dataset.tag=name;row.append(chip)}
}
const THEME_KEY='study-desk-theme',SOUND_KEY='study-desk-sound';
function applyTheme(theme){
 document.documentElement.dataset.theme=theme==='dark'?'dark':'light';
 try{localStorage.setItem(THEME_KEY,document.documentElement.dataset.theme)}catch{}
 const meta=document.querySelector('meta[name=theme-color]');if(meta)meta.setAttribute('content',theme==='dark'?'#0c1210':'#f4f1e6');
 for(const id of ['themeStudy','themeArcade']){const node=$(id);if(!node)continue;const next=theme==='dark'?'light':'dark';node.textContent=next==='dark'?'Dark theme':'Light theme';node.setAttribute('aria-label','Switch to '+next+' theme')}
}
function savedTheme(){try{const saved=localStorage.getItem(THEME_KEY);if(saved==='dark'||saved==='light')return saved}catch{}return document.documentElement.dataset.theme==='dark'?'dark':'light'}
let soundOn=true,audioCtx,lastTick=0;
function paintSound(){const node=$('soundToggle');if(!node)return;node.setAttribute('aria-pressed',String(!soundOn));node.textContent=soundOn?'Sound on':'Sound off';node.setAttribute('aria-label',soundOn?'Mute sound':'Unmute sound')}
function playTone(freq,duration,gainValue){
 if(!soundOn)return;const AudioCtx=window.AudioContext||window.webkitAudioContext;if(!AudioCtx)return;
 try{audioCtx=audioCtx||new AudioCtx();if(audioCtx.state==='suspended')audioCtx.resume();const now=audioCtx.currentTime,osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.type='sine';osc.frequency.value=freq;gain.gain.setValueAtTime(gainValue,now);gain.gain.exponentialRampToValueAtTime(0.001,now+duration);osc.connect(gain);gain.connect(audioCtx.destination);osc.start(now);osc.stop(now+duration)}catch{}
}
function wireDesk(){
 applyTheme(savedTheme());
 let savedSound=null;try{savedSound=localStorage.getItem(SOUND_KEY)}catch{}
 soundOn=savedSound==='off'?false:savedSound==='on'?true:!reduceMotion();paintSound();
 if($('soundToggle'))$('soundToggle').onclick=()=>{soundOn=!soundOn;try{localStorage.setItem(SOUND_KEY,soundOn?'on':'off')}catch{}paintSound();if(soundOn)playTone(520,.06,.04)};
 for(const id of ['themeStudy','themeArcade'])if($(id))$(id).onclick=()=>applyTheme(document.documentElement.dataset.theme==='dark'?'light':'dark');
 if($('randomGame'))$('randomGame').onclick=()=>{const bundled=games.filter(g=>g.type!=='external');if(bundled.length)play(bundled[Math.floor(Math.random()*bundled.length)])};
 const carousel=$('heroCarousel');
 if(carousel){
  carousel.addEventListener('mouseenter',()=>{heroHover=true;queueHero()});
  carousel.addEventListener('mouseleave',()=>{heroHover=false;queueHero()});
  carousel.addEventListener('focusin',()=>{heroHover=true;queueHero()});
  carousel.addEventListener('focusout',()=>{heroHover=false;queueHero()});
  carousel.addEventListener('keydown',event=>{if(event.key!=='ArrowRight'&&event.key!=='ArrowLeft')return;if(event.altKey||event.ctrlKey||event.metaKey)return;event.preventDefault();showHero(heroIndex+(event.key==='ArrowRight'?1:-1),true);queueHero()});
 }
 if($('heroPrev'))$('heroPrev').onclick=()=>{showHero(heroIndex-1,true);queueHero()};
 if($('heroNext'))$('heroNext').onclick=()=>{showHero(heroIndex+1,true);queueHero()};
 if($('heroPause'))$('heroPause').onclick=()=>{heroPaused=!heroPaused;$('heroPause').setAttribute('aria-pressed',String(heroPaused));$('heroPause').textContent=heroPaused?'Play':'Pause';queueHero()};
 if(reduceMotion()){heroPaused=true;if($('heroPause')){$('heroPause').setAttribute('aria-pressed','true');$('heroPause').textContent='Play'}}
 queueHero();
 const arcade=$('arcade');
 if(arcade){
  arcade.addEventListener('pointerover',event=>{const target=event.target.closest?.('button');if(!target||target===event.relatedTarget)return;const now=performance.now();if(now-lastTick<140)return;lastTick=now;playTone(740,.03,.02)});
  arcade.addEventListener('pointerdown',event=>{if(event.target.closest?.('button'))playTone(480,.05,.035)});
 }
 document.addEventListener('visibilitychange',queueHero);
}
for(const id of ['exportSaves','exportSavesArcade'])$(id).onclick=exportAllSaves;
for(const id of ['importSaves','importSavesArcade'])$(id).onchange=async e=>{try{await importAllSaves(e.target.files?.[0])}catch{setVaultStatus('That file is not a Study Desk save backup.');toast('That file is not a Study Desk save backup.')}finally{e.target.value=''}};
buildGenreChips();buildTagChips();renderHero();wireDesk();
reset();drawGames();renderMondayPicks();openHash();refreshStorageNotices();
