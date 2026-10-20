const assert=require('node:assert/strict'),fs=require('fs'),{JSDOM}=require('jsdom');
const root=__dirname+'/../',html=fs.readFileSync(root+'games/autumn-drift/index.html','utf8');
function boot(raw=null,legacy=null){
 const dom=new JSDOM(html,{url:'https://example.test/games/autumn-drift/',runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window,d=w.document;
 w.requestAnimationFrame=()=>1;w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:(_,k)=>k==='createLinearGradient'?()=>({addColorStop(){}}):()=>{}});
 if(raw!==null)w.localStorage.setItem('autumn-drift-v2',raw);if(legacy!==null)w.localStorage.setItem('autumn-drift-v1',legacy);
 try{if(fs.existsSync(root+'games/autumn-drift/save-store.js'))w.eval(fs.readFileSync(root+'games/autumn-drift/save-store.js','utf8'));
 w.eval(fs.readFileSync(root+'games/autumn-drift/recovery.js','utf8'));
 w.eval(fs.readFileSync(root+'games/autumn-drift/game.js','utf8')+'\nwindow.testSave={persist,get snapshot(){return currentGarden()},advance(){clock+=1}};');}catch(e){w.close();throw e}
 return {w,d,$:id=>d.getElementById(id),close:()=>w.close()};
}
let g;const broken=JSON.stringify({area:0,unlocked:0,ranks:null});
assert.doesNotThrow(()=>{g=boot(broken)},'malformed ranks must not crash startup');
assert.match(g.$('saveStatus').textContent,/preserved/);g.$('start').click();g.w.testSave.persist();g.w.dispatchEvent(new g.w.Event('pagehide'));assert.equal(g.w.localStorage.getItem('autumn-drift-v2'),broken);g.close();
const S=require('../games/autumn-drift/save-store.js');
function db(raw=null,legacy=null){const data=new Map();if(raw!==null)data.set(S.KEY,raw);if(legacy!==null)data.set(S.LEGACY,legacy);return {data,getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)}}
for(const raw of ['{bad','null','{}',JSON.stringify({...S.initial(),garden:{area:0,leaves:null}}),'x'.repeat(1000001)]){const d=db(raw),s=S.create(d);s.load();assert.equal(s.status,'invalid');assert(!s.save(S.initial()));assert.equal(d.getItem(S.KEY),raw)}
for(const v of [{...S.initial(),area:5000},{...S.initial(),area:2,unlocked:1},{...S.initial(),money:-1},{...S.initial(),ranks:[0,0,0]},{...S.initial(),picked:Infinity}])assert.throws(()=>S.validate(v));
let d=db(null,JSON.stringify({money:42})),s=S.create(d);assert.equal(s.load().money,42);assert(s.migrated);assert(s.save(S.initial()));assert.equal(d.getItem(S.LEGACY),JSON.stringify({money:42}),'legacy bytes retained');
d=db(null,'bad legacy');s=S.create(d);s.load();assert.equal(s.status,'invalid');assert(!s.save(S.initial()));assert.equal(d.getItem(S.KEY),null);
d=db(JSON.stringify(S.initial()));s=S.create(d);s.load();d.setItem(S.KEY,'newer tab');assert(!s.save(S.initial()));assert.equal(s.status,'conflict');assert.equal(d.getItem(S.KEY),'newer tab');
s=S.create({getItem(){throw Error('blocked')},setItem(){throw Error('blocked')}});s.load();assert.equal(s.status,'unavailable');assert(!s.save(S.initial()));
d=db();s=S.create(d);s.load();d.setItem=()=>{throw Error('quota')};assert(!s.save(S.initial()));assert.equal(s.status,'unavailable');
g=boot();g.$('start').click();const c=g.$('game');c.dispatchEvent(new g.w.KeyboardEvent('keydown',{key:'Home',bubbles:true}));g.w.testSave.advance();c.dispatchEvent(new g.w.KeyboardEvent('keydown',{key:' ',code:'Space',bubbles:true}));
let saved=g.w.localStorage.getItem(S.KEY);assert.equal(S.validate(JSON.parse(saved)).garden.collected,1);assert.match(g.$('saveStatus').textContent,/Autosaving/);
const state=JSON.parse(saved);for(const garden of [{...state.garden,leaves:null},{...state.garden,collected:999},{...state.garden,leaves:[...state.garden.leaves,state.garden.leaves[0]]},{...state.garden,leaves:state.garden.leaves.map((x,i)=>i?x:{...x,hp:NaN})}])assert.throws(()=>S.validate({...state,garden}));
let downloads=[];g.w.URL.createObjectURL=()=> 'blob:test';g.w.URL.revokeObjectURL=()=>{};g.w.HTMLAnchorElement.prototype.click=function(){downloads.push(this.download)};
g.$('savesBtn').click();assert.equal(g.d.activeElement,g.$('exportGarden'));g.$('exportGarden').click();assert.deepEqual(downloads,['autumn-drift-garden.json']);g.$('closeSaves').click();assert.equal(g.d.activeElement,c);
g.w.localStorage.setItem(S.KEY,'changed elsewhere');g.w.testSave.persist();assert.match(g.$('saveStatus').textContent,/Another tab/);assert.equal(g.w.localStorage.getItem(S.KEY),'changed elsewhere');g.close();
g=boot(saved);assert.equal(g.w.testSave.snapshot.garden.collected,1,'actual garden restores with exact leaf progress');g.close();
g=boot(broken);downloads=[];g.w.URL.createObjectURL=()=> 'blob:test';g.w.URL.revokeObjectURL=()=>{};g.w.HTMLAnchorElement.prototype.click=function(){downloads.push(this.download)};assert(!g.$('exportLoaded').hidden);g.$('exportLoaded').click();assert.deepEqual(downloads,['autumn-drift-loaded-save.json']);g.close();
console.log('PASS Autumn saves: corrupt startup/raw preservation, bounded state/leaf validation, legacy migration, conflict/storage errors, actual pick/reload, save-menu focus and export initiation');
