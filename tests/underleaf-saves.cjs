const assert=require('node:assert/strict'),fs=require('fs'),{JSDOM}=require('jsdom');
const S=require('../games/underleaf/save-store.js'),root=__dirname+'/../';
function storage(raw=null){const data=new Map(raw===null?[]:[[S.KEY,raw]]);return {data,getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)}}
for(const bad of [{...S.initial(),eggs:null},{...S.initial(),workers:1e9},{...S.initial(),rooms:0},{...S.initial(),food:-1},{...S.initial(),eggs:[{left:9,duration:8}]},{...S.initial(),carry:6},{...S.initial(),autoOn:'yes'}])assert.throws(()=>S.validate(bad));
const legacy={workers:5};assert.equal(S.validate(legacy).rooms,1);
const valid={...S.initial(),rooms:3,workers:20,eggs:[{left:2,duration:8}],food:36.5};
let db=storage(JSON.stringify(valid)),store=S.create(db);assert.deepEqual(store.load(),valid);assert(store.save(valid));
for(const raw of ['{bad','null',JSON.stringify({...S.initial(),eggs:null}),'x'.repeat(100001)]){
 db=storage(raw);store=S.create(db);assert.deepEqual(store.load(),S.initial());assert.equal(store.status,'invalid');assert(!store.save(S.initial()));assert.equal(db.getItem(S.KEY),raw);
 assert(store.replace(S.initial()));assert.equal(db.getItem(S.BACKUP),raw);
}
db=storage(JSON.stringify(valid));store=S.create(db);store.load();db.setItem(S.KEY,'newer tab');assert(!store.save(valid));assert.equal(store.status,'conflict');assert.equal(db.getItem(S.KEY),'newer tab');
db=storage('bad');store=S.create(db);store.load();db.setItem=()=>{throw Error('quota')};assert(!store.replace(S.initial()));assert.equal(db.getItem(S.KEY),'bad');
db=storage(JSON.stringify(valid));store=S.create(db);store.load();const original=db.getItem(S.KEY);db.setItem=(key,value)=>{if(key===S.KEY)throw Error('write failure');db.data.set(key,value)};assert(!store.replace(S.initial()));assert.equal(db.getItem(S.KEY),original);assert.equal(db.getItem(S.BACKUP),original);
db=storage(JSON.stringify(valid));store=S.create(db);store.load();db.setItem=()=>{throw Error('quota')};assert(!store.save(valid));assert.equal(store.status,'unavailable');assert.equal(db.getItem(S.KEY),JSON.stringify(valid));
store=S.create({getItem(){throw Error('blocked')},setItem(){throw Error('blocked')}});assert.deepEqual(store.load(),S.initial());assert.equal(store.status,'unavailable');assert(!store.save(valid));
// Run the actual game script with canvas/audio/animation isolated from DOM assertions.
const html=fs.readFileSync(root+'games/underleaf/index.html','utf8');
function boot(raw){
 const dom=new JSDOM(html,{url:'https://example.test/games/underleaf/',runScripts:'outside-only',pretendToBeVisual:true});
 const w=dom.window,d=w.document;w.confirm=()=>false;w.requestAnimationFrame=()=>1;
 w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:(_,key)=>key==='createLinearGradient'?()=>({addColorStop(){}}):()=>{}});
 if(raw!==null)w.localStorage.setItem(S.KEY,raw);
 w.eval(fs.readFileSync(root+'games/underleaf/save-store.js','utf8'));
 for(const script of d.querySelectorAll('script:not([src])'))w.eval(script.textContent+'\nwindow.testTick=tick;');
 return {w,d,close:()=>w.close()};
}
let game=boot(JSON.stringify({...S.initial(),eggs:null}));
assert.match(game.d.getElementById('saveStatus').textContent,/preserved/);
assert.equal(game.d.getElementById('rawSave').hidden,false);
game.d.getElementById('start').click();game.d.getElementById('feed').click();game.w.dispatchEvent(new game.w.Event('pagehide'));
assert.equal(JSON.parse(game.w.localStorage.getItem(S.KEY)).eggs,null,'gameplay/pagehide cannot overwrite invalid save');
game.d.getElementById('reset').click();assert.equal(JSON.parse(game.w.localStorage.getItem(S.KEY)).eggs,null,'cancel reset preserves original');
game.w.confirm=()=>true;game.d.getElementById('reset').click();assert.equal(game.d.getElementById('food').textContent,'20');assert.match(game.d.getElementById('saveStatus').textContent,/Autosaves/);assert.equal(JSON.parse(game.w.localStorage.getItem(S.BACKUP)).eggs,null);
let downloads=[];game.w.URL.createObjectURL=()=> 'blob:test';game.w.URL.revokeObjectURL=()=>{};game.w.HTMLAnchorElement.prototype.click=function(){downloads.push(this.download)};
game.d.getElementById('exportColony').click();game.d.getElementById('previousSave').click();game.d.getElementById('rawSave').click();assert.deepEqual(downloads,['underleaf-colony.json','underleaf-previous-save.json','underleaf-loaded-save.json']);game.close();
game=boot(JSON.stringify(valid));assert.equal(game.d.getElementById('workers').textContent,'20');game.d.getElementById('start').click();game.d.getElementById('feed').click();assert.equal(JSON.parse(game.w.localStorage.getItem(S.KEY)).eggs.length,2);for(let i=0;i<200;i++)game.w.testTick(.05);game.w.dispatchEvent(new game.w.Event('pagehide'));assert.equal(S.validate(JSON.parse(game.w.localStorage.getItem(S.KEY))).workers,22);game.close();
console.log('PASS Underleaf saves: validated bounds/brood, legacy defaults, corrupt/raw preservation, backup-first reset, conflict/quota/read failures, actual game startup/feed/pagehide/reset');
