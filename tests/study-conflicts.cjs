const assert=require('node:assert/strict'),fs=require('fs'),{JSDOM}=require('jsdom');
function openGamesHub(win){win.history.replaceState(null,'','#games');win.dispatchEvent(new win.HashChangeEvent('hashchange'))}
const root=__dirname+'/../',KEY='study-desk-v1',DECK='study-desk-decks-v1',HUB='after-class-hub-v1';
const cards=JSON.stringify([{id:'one',deck:'Science',q:'Original question',a:'Original answer',known:false}]);
function boot(entries={}){
 const dom=new JSDOM(fs.readFileSync(root+'index.html','utf8'),{url:'https://example.test/',runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window,d=w.document,$=id=>d.getElementById(id);
 for(const [key,value] of Object.entries({[KEY]:cards,[DECK]:'["Science"]',...entries}))w.localStorage.setItem(key,value);
 w.eval(fs.readFileSync(root+'catalog.js','utf8'));w.eval(fs.readFileSync(root+'app.js','utf8'));
 return {w,d,$,close:()=>w.close()};
}
// Simulate a newer value arriving without a delivered storage event: pre-write checks must protect it.
let g=boot(),newer=cards.replace('Original question','Newer question');g.w.localStorage.setItem(KEY,newer);g.$('know').click();
assert.equal(g.w.localStorage.getItem(KEY),newer,'stale card review must not overwrite a newer save');assert.equal(g.w.localStorage.getItem(DECK),'["Science"]');assert.match(g.$('studyStorageNotice').textContent,/another tab/);assert.match(g.$('notice').textContent,/temporary/);
let exported;g.w.Blob=class{constructor(parts){exported=parts.join('')}};g.w.URL.createObjectURL=()=> 'blob:test';g.w.URL.revokeObjectURL=()=>{};g.w.HTMLAnchorElement.prototype.click=()=>{};g.$('backup').click();assert.equal(JSON.parse(exported).cards[0].known,true,'temporary edits remain exportable');assert.equal(JSON.parse(exported).cards[0].q,'Original question');assert.equal(g.w.localStorage.getItem(KEY),newer);g.close();
g=boot();g.w.localStorage.setItem(DECK,'["Science","New deck"]');g.$('know').click();assert.equal(g.w.localStorage.getItem(KEY),cards,'deck conflict blocks card write too');assert.equal(g.w.localStorage.getItem(DECK),'["Science","New deck"]');g.close();
for(const key of [KEY,DECK]){g=boot();g.w.localStorage.removeItem(key);g.$('know').click();assert.equal(g.w.localStorage.getItem(key),null,'external deletion is not undone');g.close()}
g=boot({[HUB]:'{"favourites":[],"recent":[]}'});const preferences='{"favourites":["underleaf"],"recent":[]}';g.w.localStorage.setItem(HUB,preferences);openGamesHub(g.w);g.d.querySelector('.fav').click();assert.equal(g.w.localStorage.getItem(HUB),preferences);assert.match(g.$('gameStorageNotice').textContent,/another tab/);g.$('know').click();assert.equal(JSON.parse(g.w.localStorage.getItem(KEY))[0].known,true,'preference conflict does not block study');g.close();
g=boot();g.w.localStorage.setItem(KEY,newer);g.w.dispatchEvent(new g.w.StorageEvent('storage',{key:KEY,storageArea:g.w.localStorage,newValue:newer}));assert(!g.$('studyStorageNotice').hidden,'event shows warning before an edit');g.close();
g=boot();g.w.localStorage.clear();g.w.dispatchEvent(new g.w.StorageEvent('storage',{key:null,storageArea:g.w.localStorage}));assert(!g.$('studyStorageNotice').hidden);g.$('know').click();assert.equal(g.w.localStorage.length,0);g.close();
g=boot();g.w.dispatchEvent(new g.w.StorageEvent('storage',{key:KEY,storageArea:g.w.sessionStorage,newValue:newer}));assert(g.$('studyStorageNotice').hidden,'sessionStorage is unrelated');g.w.dispatchEvent(new g.w.StorageEvent('storage',{key:'some-game-save',storageArea:g.w.localStorage}));assert(g.$('studyStorageNotice').hidden);g.close();
g=boot();g.$('know').click();const own=g.w.localStorage.getItem(KEY);g.w.dispatchEvent(new g.w.StorageEvent('storage',{key:KEY,storageArea:g.w.localStorage,newValue:cards}));assert(g.$('studyStorageNotice').hidden,'queued events compare current storage, not stale event data');g.$('again').click();assert.equal(JSON.parse(g.w.localStorage.getItem(KEY))[0].known,false);g.close();
g=boot();g.w.Storage.prototype.getItem=()=>{throw Error('blocked after startup')};g.$('know').click();assert.match(g.$('studyStorageNotice').textContent,/unavailable/);g.close();
console.log('PASS Study conflicts: stale cards/decks/preferences, deleted/cleared storage, pre-write and event guards, independent study writes, unrelated/stale events and read failures');
