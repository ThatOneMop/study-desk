const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),{JSDOM}=require('jsdom');
const game=__dirname+'/../games/after-hours/';
const html=fs.readFileSync(game+'index.html','utf8'),scripts=[...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)];
const context={module:{exports:{}}};vm.runInNewContext(scripts.find(m=>m[2].includes('const HANDS='))[2],context);const AH=context.module.exports,S=require(game+'save-store.js'),key='after-hours-save-v1';
function memory(initial){const m=new Map(Object.entries(initial||{}));return {getItem:k=>m.has(k)?m.get(k):null,setItem:(k,v)=>m.set(k,String(v)),m};}
function fresh(){return JSON.parse(JSON.stringify(AH.newRun(123)));}
const run=fresh();assert.deepEqual(S.parse(JSON.stringify(run),AH),S.validate(run,AH));
for(const corrupt of [s=>delete s.pile,s=>s.deck[1]=s.deck[0],s=>s.hand[0].rank=99,s=>s.round=-1,s=>s.charms=['not-a-joker'],s=>s.levels=null,s=>s.money='eight',s=>s.pile.push(s.hand[0])]){const s=fresh();corrupt(s);assert.throws(()=>S.validate(s,AH));}
const injected=fresh();injected.log=[{type:1,name:'<img src=x onerror=alert(1)>',points:30,chips:10,mult:3}];assert.equal(S.validate(injected,AH).log[0].name,'Pair');
const legacy=fresh();delete legacy.discarded;delete legacy.roundPlayed;assert.equal(S.validate(legacy,AH).roundPlayed,0);
assert.throws(()=>S.parse(' '.repeat(S.LIMIT+1),AH));
// Validate actual engine states through all phases, including after shop polish.
for(let seed=1;seed<=20;seed++){const s=AH.newRun(seed);for(let round=0;round<24;round++){S.validate(s,AH);AH.discard(s,[s.hand[0].id]);S.validate(s,AH);s.score=AH.target(s);AH.play(s,[s.hand[0].id]);S.validate(s,AH);if(s.phase==='shop'){s.money=100;AH.buy(s,5);S.validate(s,AH);AH.next(s);}}assert.equal(s.phase,'won');}
const bad=memory({[key]:'{"version":1,"deck":[]}'}),broken=S.create(()=>bad,key,AH);assert(broken.issue);assert.equal(broken.save(run),false);assert.equal(bad.getItem(key),'{"version":1,"deck":[]}');assert(broken.replace(run));assert.equal(bad.getItem(key+'.backup'),'{"version":1,"deck":[]}');
const shared=memory({[key]:JSON.stringify(run)}),one=S.create(()=>shared,key,AH),two=S.create(()=>shared,key,AH);const changed=fresh();changed.money=9;assert(one.save(changed));assert.equal(two.save(run),false);assert(two.issue.includes('Another tab'));assert.equal(JSON.parse(shared.getItem(key)).money,9);
const quota=memory({[key]:JSON.stringify(run)});quota.setItem=()=>{throw Error('quota')};const full=S.create(()=>quota,key,AH);assert.equal(full.replace(changed),false);assert.equal(JSON.parse(quota.getItem(key)).money,8);
assert(S.create(()=>{throw Error('blocked')},key,AH).issue);
function page(saved){const dom=new JSDOM(html,{url:'https://game.test/games/after-hours/',runScripts:'outside-only',pretendToBeVisual:true});const w=dom.window;
 w.matchMedia=()=>({matches:true});w.confirm=()=>true;w.HTMLDialogElement.prototype.showModal=function(){this.open=true};w.HTMLDialogElement.prototype.close=function(){this.open=false};
 if(saved!==undefined)w.localStorage.setItem(key,saved);
 for(const m of scripts){if(m[1].includes('save-store.js'))w.eval(fs.readFileSync(game+'save-store.js','utf8'));else if(m[2].trim())w.eval(m[2]);}
 return dom;
}
const damaged=page('{broken');const wd=damaged.window,dd=wd.document;assert(dd.getElementById('modal').open);assert.equal(wd.localStorage.getItem(key),'{broken');assert(dd.getElementById('saveMessage').textContent.includes('kept untouched'));dd.getElementById('keepRun').click();assert.equal(wd.localStorage.getItem(key+'.backup'),'{broken');assert(!dd.getElementById('modal').open);damaged.window.close();
const valid=page(JSON.stringify(run)),w=valid.window,d=w.document;assert.equal(d.querySelectorAll('#hand .card').length,8);d.getElementById('saves').click();assert(!d.getElementById('exportRun').disabled);d.getElementById('closeModal').click();d.getElementById('new').click();d.getElementById('confirmNew').click();assert(w.localStorage.getItem(key+'.backup'));
(async()=>{
 const open=()=>d.getElementById('saves').click();
 async function importText(text){const input=d.getElementById('saveFile');Object.defineProperty(input,'files',{configurable:true,value:[{size:text.length,text:async()=>text}]});await input.onchange({target:input});}
 open();const before=w.localStorage.getItem(key);await importText('{bad');assert.equal(w.localStorage.getItem(key),before);assert(d.getElementById('saveMessage').textContent.includes('has not changed'));
 const replacement=fresh();replacement.money=42;await importText(JSON.stringify(replacement));assert.equal(JSON.parse(w.localStorage.getItem(key)).money,42);assert.equal(w.localStorage.getItem(key+'.backup'),before);
 open();d.getElementById('restoreBackup').click();assert.equal(w.localStorage.getItem(key),before);
 open();w.confirm=()=>false;await importText(JSON.stringify(replacement));assert.equal(w.localStorage.getItem(key),before);
 let download;w.URL.createObjectURL=blob=>{assert(blob.size>0);return 'blob:test'};w.URL.revokeObjectURL=()=>{};w.HTMLAnchorElement.prototype.click=function(){download=this.download};d.getElementById('exportRun').click();assert.equal(download,'after-hours-run.json');
 // Closing the dialog during a slow file read cancels that import.
 let resolve;const input=d.getElementById('saveFile');Object.defineProperty(input,'files',{configurable:true,value:[{size:100,text:()=>new Promise(r=>resolve=r)}]});const pending=input.onchange({target:input});d.getElementById('closeModal').click();w.confirm=()=>true;resolve(JSON.stringify(replacement));await pending;assert.equal(w.localStorage.getItem(key),before);
 valid.window.close();
 console.log('PASS saves: malformed/oversized/injected saves, legacy counters, 480 forced-clear state transitions, corrupt-save preservation, two-tab conflict, quota failure, DOM recovery, export/import, cancellation and previous-save restore.');
})().catch(error=>{valid.window.close();console.error(error);process.exitCode=1;});
