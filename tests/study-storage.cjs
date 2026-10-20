const assert=require('node:assert/strict'),fs=require('fs'),{JSDOM}=require('jsdom');
const root=__dirname+'/../',KEY='study-desk-v1',DECK='study-desk-decks-v1',HUB='after-class-hub-v1';
function boot(entries={},failRead=false){
 const dom=new JSDOM(fs.readFileSync(root+'index.html','utf8'),{url:'https://example.test/',runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window,d=w.document,$=id=>d.getElementById(id);
 for(const [k,v] of Object.entries(entries))w.localStorage.setItem(k,v);
 if(failRead)w.Storage.prototype.getItem=()=>{throw Error('blocked')};
 w.eval(fs.readFileSync(root+'catalog.js','utf8'));w.eval(fs.readFileSync(root+'app.js','utf8'));
 return {w,d,$,close:()=>w.close()};
}
let g=boot({[KEY]:'{damaged'});g.$('know').click();assert.equal(g.w.localStorage.getItem(KEY),'{damaged','marking starter cards must not overwrite unreadable cards');g.close();
for(const raw of ['null','{}','[{}]','[] trailing']){g=boot({[KEY]:raw});g.$('know').click();assert.equal(g.w.localStorage.getItem(KEY),raw);assert.match(g.$('studyStorageNotice').textContent,/temporary/);g.close()}
g=boot({[DECK]:'{"unexpected":true}'});g.$('know').click();assert.equal(g.w.localStorage.getItem(DECK),'{"unexpected":true}');assert.equal(g.w.localStorage.getItem(KEY),null,'invalid deck data blocks both study writes');g.close();
g=boot({[HUB]:'{bad'});g.$('openGames').click();g.d.querySelector('.fav').click();assert.equal(g.w.localStorage.getItem(HUB),'{bad');assert.match(g.$('gameStorageNotice').textContent,/preferences/);g.$('know').click();assert(g.w.localStorage.getItem(KEY),'game preferences do not block study saves');g.close();
g=boot();g.$('know').click();assert.equal(JSON.parse(g.w.localStorage.getItem(KEY))[0].known,true);assert(g.$('studyStorageNotice').hidden);g.close();
g=boot({},true);g.$('know').click();assert.match(g.$('studyStorageNotice').textContent,/unavailable/);g.close();
g=boot({[KEY]:'{raw bytes'});let blobText,filename;g.w.Blob=class{constructor(parts){blobText=parts.join('')}};g.w.URL.createObjectURL=()=> 'blob:test';g.w.URL.revokeObjectURL=()=>{};g.w.HTMLAnchorElement.prototype.click=function(){filename=this.download};g.$('studyStorageNotice').querySelector('button').click();assert.equal(blobText,'{raw bytes');assert.equal(filename,'study-cards-preserved.json');g.close();
g=boot();g.$('know').click();const saved=g.w.localStorage.getItem(KEY);g.w.Storage.prototype.setItem=()=>{throw Error('quota')};g.$('know').click();assert.equal(g.w.localStorage.getItem(KEY),saved);assert.match(g.$('studyStorageNotice').textContent,/unavailable/);g.close();
g=boot({[HUB]:JSON.stringify({favourites:['retired-game'],recent:['retired-game']})});g.$('openGames').click();g.d.querySelector('.fav').click();assert(JSON.parse(g.w.localStorage.getItem(HUB)).favourites.includes('retired-game'));g.close();
g=boot({[KEY]:'[]',[DECK]:'[]'});assert.equal(g.$('cardtext').textContent,'Create your first card');assert(g.$('studyStorageNotice').hidden);g.close();
console.log('PASS Study storage: unreadable/invalid data preserved, grouped study writes blocked, preferences isolated, normal/empty saves retained, unavailable read/write warnings and exact raw export initiation');
