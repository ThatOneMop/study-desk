const {JSDOM}=require('jsdom'),fs=require('fs'),assert=require('assert');
const root=__dirname+'/../';
const dom=new JSDOM(fs.readFileSync(root+'index.html','utf8'),{url:'https://example.test/repo/',runScripts:'outside-only',pretendToBeVisual:true});
const w=dom.window,d=w.document,$=id=>d.getElementById(id);w.confirm=()=>true;w.prompt=()=> 'New deck';w.HTMLDialogElement.prototype.showModal=function(){this.open=true};w.HTMLDialogElement.prototype.close=function(){this.open=false};
w.eval(fs.readFileSync(root+'catalog.js','utf8'));w.eval(fs.readFileSync(root+'app.js','utf8'));
assert.equal(d.querySelectorAll('.game').length,w.GAME_CATALOG.length);assert.equal($('study').hidden,true);
w.location.hash='#study';w.dispatchEvent(new w.HashChangeEvent('hashchange'));assert.equal($('study').hidden,false);
function key(target,k,extra={}){target.dispatchEvent(new w.KeyboardEvent('keydown',{key:k,bubbles:true,...extra}))}
for(let i=0;i<3;i++)key(w,'p');assert.equal($('study').hidden,true);
for(let i=0;i<3;i++)key(w,'p');assert.equal($('study').hidden,false);
for(let i=0;i<3;i++)key($('question'),'p');assert.equal($('study').hidden,false);
$('search').value=' Balatro ';$('search').dispatchEvent(new w.Event('input'));assert.equal(d.querySelectorAll('.game').length,1);assert.equal(d.querySelector('.game h3').textContent,'After Hours');
$('search').value='';$('search').dispatchEvent(new w.Event('input'));
d.querySelector('.fav').click();assert.equal(JSON.parse(w.localStorage.getItem('after-class-hub-v1')).favourites.length,1);
$('edit').click();$('newDeck').click();$('question').value='Test question';$('answer').value='Test answer';$('editorForm').dispatchEvent(new w.Event('submit',{cancelable:true}));assert.equal($('cardtext').textContent,'Test question');
$('cardlist').querySelector('button').click();$('answer').value='Edited';$('editorForm').dispatchEvent(new w.Event('submit',{cancelable:true}));$('card').click();assert.equal($('cardtext').textContent,'Edited');$('know').click();assert.equal($('mastered').textContent,'1 mastered');
$('deleteDeck').click();assert(!JSON.parse(w.localStorage.getItem('study-desk-v1')).some(c=>c.deck==='New deck'));
console.log('PASS shell: '+w.GAME_CATALOG.length+' entries, games default and explicit study route, PPP both directions, typing exclusion, search, favourites, deck/card create/edit/delete, mastery');
const frame=$('frame'),f=frame.contentWindow;let toggles=0;w.addEventListener('message',e=>{if(e.data?.type==='study-toggle')toggles++});f.eval(fs.readFileSync(root+'bridge.js','utf8'));
function visible(v){f.dispatchEvent(new f.MessageEvent('message',{source:w,origin:f.location.origin,data:{type:'study-visibility',visible:v}}))}
// iframe about:blank reports null origin in jsdom; use its actual reported origin.
let released=0;f.document.addEventListener('keyup',()=>released++);f.document.dispatchEvent(new f.KeyboardEvent('keydown',{key:'w',code:'KeyW',bubbles:true}));
let ran=false;f.setTimeout(()=>ran=true,40);visible(false);assert(f.StudyBridge.paused);assert(released>0);const before=f.performance.now();
setTimeout(()=>{assert.equal(ran,false);assert.equal(f.performance.now(),before);visible(true);assert(!f.StudyBridge.paused);assert(f.performance.now()-before<20);setTimeout(()=>{assert(ran);console.log('PASS bridge: held-key release, timer suspension/resume, frozen clock/no large resume jump');w.close()},65)},75);
