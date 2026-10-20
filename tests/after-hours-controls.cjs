const fs=require('fs'),assert=require('node:assert/strict'),{JSDOM}=require('jsdom');
const root=__dirname+'/../games/after-hours/';
const html=fs.readFileSync(root+'index.html','utf8');
const dom=new JSDOM(html,{url:'https://game.test/games/after-hours/',runScripts:'outside-only',pretendToBeVisual:true});
const w=dom.window,d=w.document,$=id=>d.getElementById(id),cards=()=>[...$('hand').querySelectorAll('[data-card]')];
w.matchMedia=()=>({matches:true});w.HTMLDialogElement.prototype.showModal=function(){this.open=true};w.HTMLDialogElement.prototype.close=function(){this.open=false};
for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)){if(m[1].includes('save-store.js'))w.eval(fs.readFileSync(root+'save-store.js','utf8'));else if(m[2].trim())w.eval(m[2]+(m[2].includes('animated client')?';window.testControls={state:()=>s,play:executePlay,target:()=>AH.target(s)};':''));}
function key(k,extra={},target=d.activeElement){const e=new w.KeyboardEvent('keydown',{key:k,bubbles:true,cancelable:true,...extra});target.dispatchEvent(e);return e;}
const state=()=>JSON.parse(w.localStorage.getItem('after-hours-save-v1'));
function focusIndex(n){assert.equal(d.activeElement,cards()[n])}
(async()=>{
 cards()[2].focus();const id=d.activeElement.dataset.card;d.activeElement.click();assert.equal(d.activeElement.dataset.card,id);assert.equal(d.activeElement.getAttribute('aria-pressed'),'true');
 key('ArrowRight');focusIndex(3);key('ArrowLeft');focusIndex(2);key('Home');focusIndex(0);key('ArrowLeft');focusIndex(0);key('End');focusIndex(7);key('ArrowRight');focusIndex(7);
 const lastId=d.activeElement.dataset.card;$('suitSort').click();assert.equal(d.activeElement.dataset.card,lastId);
 key('Escape');assert.equal(state().selected.length,0);assert.equal(d.activeElement.dataset.card,lastId);
 key('1');assert.equal(state().selected.length,1);key('1',{repeat:true});assert.equal(state().selected.length,1);
 key('2',{ctrlKey:true});key('2',{isComposing:true});assert.equal(state().selected.length,1);
 $('saves').click();key('2');assert.equal(state().selected.length,1);$('closeModal').click();
 const input=d.createElement('input');d.body.append(input);input.focus();key('d');key('2');assert.equal(state().selected.length,1);input.remove();
 cards()[0].focus();const before=state().hands;const enter=key('Enter');assert.equal(enter.defaultPrevented,true);assert.equal(state().hands,before-1);
 for(let n=0;$('new').disabled&&n<100;n++)await new Promise(resolve=>setTimeout(resolve,5));
 assert.equal($('new').disabled,false);assert(cards().includes(d.activeElement));assert.equal(state().selected.length,0);
 const handAfter=state().hands;$('saves').focus();assert.equal(key('Enter').defaultPrevented,false);assert.equal(state().hands,handAfter);
 // Controlled state transition exercises keyboard focus across a cleared blind,
 // shop rerender, sold stock, and the next round (not a balance/playthrough test).
 const testState=w.testControls.state();testState.score=w.testControls.target();testState.selected=[testState.hand[0].id];cards()[0].focus();await w.testControls.play();assert.equal(d.activeElement,$('next'));
 $('reroll').focus();$('reroll').click();assert.equal(d.activeElement,$('reroll'));
 const buy=[...d.querySelectorAll('[data-buy]')].find(b=>!b.disabled);assert(buy);buy.focus();buy.click();assert.equal(d.activeElement,$('next'));
 $('next').click();focusIndex(0);
 // A hidden/unfocused game must not steal focus when its hand is redrawn.
 cards()[1].focus();d.hasFocus=()=>false;$('rankSort').click();assert.equal(d.activeElement,d.body);
 assert.equal($('hand').getAttribute('aria-describedby'),'handControls');
 console.log('PASS After Hours controls: card identity focus, sort/clear, arrows/Home/End bounds, Enter scoring, remaining-card focus, modal/typing/modifier guards, no inactive-document focus theft.');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>w.close());
