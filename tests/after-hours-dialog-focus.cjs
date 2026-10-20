const assert=require('node:assert/strict'),fs=require('fs'),{JSDOM}=require('jsdom');
const root=__dirname+'/../games/after-hours/',html=fs.readFileSync(root+'index.html','utf8');
const dom=new JSDOM(html,{url:'https://example.test/',runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window,d=w.document,$=id=>d.getElementById(id);
w.matchMedia=()=>({matches:true});w.HTMLDialogElement.prototype.showModal=function(){this.open=true;$('closeModal').focus()};w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'))};
for(const script of d.querySelectorAll('script')){if(script.src.includes('save-store.js'))w.eval(fs.readFileSync(root+'save-store.js','utf8'));else if(!script.src)w.eval(script.textContent+(script.textContent.includes('animated client')?'\nwindow.dialogProbe={state:()=>s,render,engine:AH};':''))}
try{
 $('collection').focus();$('collection').click();const catalog=d.querySelector('[data-catalog]');catalog.focus();const id=catalog.dataset.catalog;catalog.click();assert($('modal').contains(d.activeElement),'detail replacement must keep focus inside dialog');
 $('backCollection').focus();$('backCollection').click();assert.equal(d.activeElement.dataset.catalog,id,'back returns to the same catalogue joker');$('closeModal').click();assert.equal(d.activeElement,$('collection'));
 const s=w.dialogProbe.state();s.charms=w.dialogProbe.engine.CHARMS.slice(0,3).map(c=>c.id);w.dialogProbe.render();const owned=d.querySelector('[data-owned="0"]');const ownedId=owned.dataset.joker;owned.focus();owned.click();$('moveRight').focus();$('moveRight').click();assert.equal(d.activeElement,$('moveRight'),'repeat reorder remains focused');$('moveRight').click();assert.equal(d.activeElement,$('moveLeft'),'at boundary focus moves to enabled reverse control');$('closeModal').click();assert.equal(d.activeElement.dataset.joker,ownedId,'close returns to live reordered joker');
 $('collection').focus();$('collection').click();d.hasFocus=()=>false;$('closeModal').click();assert.notEqual(d.activeElement,$('collection'),'closing an inactive game does not steal focus');d.hasFocus=()=>true;
 // Exercise a valid shop produced by the actual engine, without a balance/playthrough claim.
 s.score=w.dialogProbe.engine.target(s);w.dialogProbe.engine.play(s,[s.hand[0].id]);w.dialogProbe.render();assert.equal(s.phase,'shop');
 for(const b of d.querySelectorAll('[data-buy]'))assert.match(b.getAttribute('aria-label'),/Buy .+ for \$/);
 const selling=d.querySelector('[data-owned="0"]');selling.focus();selling.click();$('sellJoker').focus();$('sellJoker').click();assert.equal(d.activeElement,$('next'),'selling returns to a live shop control');
 console.log('PASS After Hours dialogs: details focus, exact catalogue return, repeated reorder and boundaries, live owner return, inactive guard and named shop purchases');
}finally{w.close()}
