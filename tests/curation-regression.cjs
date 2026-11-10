const {JSDOM}=require('jsdom'),fs=require('fs'),assert=require('node:assert/strict'),path=require('path');
const {unlockShell}=require('./gate-fixture.cjs');
const root=path.resolve(__dirname,'..');
const catalog=JSON.parse(fs.readFileSync(root+'/catalog.json','utf8'));
const dom=new JSDOM(fs.readFileSync(root+'/index.html','utf8'),{url:'https://example.test/#games',runScripts:'outside-only',pretendToBeVisual:true});
const w=dom.window,d=w.document,$=id=>d.getElementById(id);
w.localStorage.setItem('after-class-hub-v1',JSON.stringify({favourites:['micro-bmath','creekhold'],recent:['polytrack','creekhold']}));
const save='{"example":"retired save kept"}';w.localStorage.setItem('retired-game-save',save);
w.eval(fs.readFileSync(root+'/catalog.js','utf8'));w.eval(fs.readFileSync(root+'/app.js','utf8'));
(async()=>{await unlockShell(w);
assert.deepEqual(JSON.parse(JSON.stringify(w.GAME_CATALOG)),catalog);
const KEEP=["chaos-court", "corebreaker", "lanebound", "orbital-drop", "pocket-golf", "ashwake", "autumn-drift", "bell-diver", "creekhold", "forge-arena", "gummy-bay", "harvest-protocol", "lanewright", "little-lake", "lost-found", "moon-salvage", "mycelium-yard", "numberworks", "outbreak-atlas", "packworks", "roof-runner", "spanwright", "tiny-wilds", "winterfold"].sort();
const arcade=catalog.filter(g=>g.type==='arcade'||g.source==='GameMonetize'||g.source==='GameDistribution');
assert.equal(arcade.length,0,'Arcade providers are not in the public catalogue');
assert(!JSON.stringify(catalog).match(/gamemonetize|gamedistribution/i),'public catalogue has no provider hosts');
assert.equal(catalog.length,KEEP.length+arcade.length,'own games only while Arcade providers are switched off');
assert.deepEqual(catalog.filter(g=>g.type!=='arcade').map(g=>g.id).sort(),KEEP,'exactly the kept games are listed');
assert(catalog.every(g=>!['Nightshift','Afterlight'].includes(g.group)));
assert(catalog.every(g=>['bundled','external','arcade'].includes(g.type)));
assert(catalog.filter(g=>g.type==='external').every(g=>/^https:\/\//.test(g.url)));
assert(!d.querySelector('#playerStudy, #studyBtn'));
assert(!/switch workspace/i.test(d.body.textContent));
assert(catalog.every(g=>g.type!=='external'),'no external links remain');
assert.equal(new Set(catalog.map(g=>g.id)).size,catalog.length);
assert.equal($('openGames'),null,'study area has no swap-to-games button');assert.equal($('switch'),null,'study area has no Browse games entry');assert(!/Browse \d+ games|Games · \d+/.test($('study').textContent),'study area never advertises the game count');
assert.equal($('includedCount').textContent,catalog.filter(g=>g.type!=='external').length+' games included here');
assert(!d.body.textContent.includes('100 games'));
assert(!d.body.textContent.includes('Community classics'));
function filter(name){[...$('filters').children].find(b=>b.textContent===name).click()}
filter('Favourites');assert.equal(d.querySelectorAll('.game').length,1);
assert.equal(d.querySelector('.game h3').textContent,'Creekhold');
assert.equal([...$('filters').children].find(b=>b.textContent==='Favourites').getAttribute('aria-pressed'),'true');
filter('Recently played');assert.equal(d.querySelectorAll('.game').length,1);
d.querySelector('[data-action="play"]').click();
let messages=[];$('frame').contentWindow.postMessage=m=>messages.push(m);
let hidden=false;Object.defineProperty(d,'hidden',{configurable:true,get:()=>hidden});
function background(v){hidden=v;d.dispatchEvent(new w.Event('visibilitychange'))}
background(true);assert.equal(messages.at(-1).visible,false);
background(false);assert.equal(messages.at(-1).visible,true);
$('pauseGame').click();background(true);background(false);assert.equal(messages.at(-1).visible,false);
$('resumeGame').click();assert.equal(messages.at(-1).visible,true);
$('libraryBtn').click();background(true);background(false);assert.equal(messages.at(-1).visible,false);
assert(!$('arcade').hidden);assert($('player').hidden);
const saved=JSON.parse(w.localStorage.getItem('after-class-hub-v1'));
assert(saved.favourites.includes('micro-bmath'));assert(saved.recent.includes('polytrack'));
assert.equal(w.localStorage.getItem('retired-game-save'),save);
console.log('PASS curation: exact active catalogue, dynamic counts, aliases/filters, retired preferences/saves preserved, background pause and manual pause retained.');
w.close();
})().catch(error=>{console.error(error);process.exit(1)});





