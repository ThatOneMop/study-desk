// Disabling regression: GameMonetize cannot be reached from search, filters, random, or play,
// and a direct wrapper page does not request GameMonetize embeds or covers.
const {JSDOM}=require('jsdom'),fs=require('fs'),assert=require('node:assert/strict'),path=require('path');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
const HOST=/html5\.gamemonetize\.co|img\.gamemonetize\.com/i;
const index=read('index.html');
assert(index.includes('arcade-config.js'));
assert(index.indexOf('arcade-config.js')<index.indexOf('arcade/gamemonetize.js'));
assert(index.indexOf('arcade/gamemonetize.js')<index.indexOf('app.js'));
assert(!HOST.test(index),'the collection page has no GameMonetize embed or cover URL');

function boot(extra={}){
  const dom=new JSDOM(index,{url:'https://example.test/#games',runScripts:'outside-only',pretendToBeVisual:true});
  const w=dom.window,d=w.document;
  w.confirm=()=>true;
  w.matchMedia=()=>({matches:false});
  const loads=[];
  const orig=w.document.createElement.bind(w.document);
  w.document.createElement=function(name){
    const el=orig(name);
    const apply=(value)=>{if(HOST.test(String(value||'')))loads.push(String(value));return value};
    const src=Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el),'src');
    if(src&&src.set)Object.defineProperty(el,'src',{configurable:true,enumerable:src.enumerable,get:function(){return src.get?src.get.call(el):el.getAttribute('src')},set:function(value){apply(value);src.set.call(el,value)}});
    return el;
  };
  if(extra.storage)for(const [key,value] of Object.entries(extra.storage))w.localStorage.setItem(key,value);
  w.eval(read('catalog.js'));
  w.eval(read('arcade-config.js'));
  w.eval(read('arcade/gamemonetize.js'));
  w.eval(read('arcade/gamedistribution.js'));
  w.eval(read('app.js'));
  return {w,d,loads,$:id=>d.getElementById(id),gm:JSON.parse(JSON.stringify(w.ARCADE_GM_CATALOG)),gd:JSON.parse(JSON.stringify(w.ARCADE_GD_CATALOG))};
}
function remoteAttrs(d){
  return [...d.querySelectorAll('*')].flatMap(el=>['src','href'].map(name=>el.getAttribute(name)).filter(Boolean)).filter(value=>HOST.test(value));
}
function shown(d){return [...d.querySelectorAll('#games .game h3, #arcadeRow .capsule-title, #continueRow .capsule-title, #trendingCards .capsule-title, #favouriteRow .capsule-title')].map(node=>node.textContent)}

const g=boot({storage:{'after-class-hub-v1':JSON.stringify({favourites:['buggy-blast','creekhold'],recent:['panda-run','autumn-drift'],plays:{'buggy-blast':4,'little-lake':2}})}});
const {w,d,$,gm,gd}=g;
assert.equal(w.ARCADE_CONFIG.gmEnabled,false);
assert.equal(w.ARCADE_CONFIG.gdEnabled,false);
assert.equal(w.GAME_CATALOG.filter(game=>game.type==='bundled').length,18);
assert.equal(d.querySelectorAll('.game').length,18,'only bundled games are listed');
assert.equal($('arcadeShelf').hidden,true);
assert(![...$('filters').children].some(button=>button.textContent==='Arcade'));
for(const game of gm.concat(gd)){
  assert(!shown(d).includes(game.title),game.title);
  assert(!d.body.innerHTML.includes(game.url),game.id+' is not linked');
}
assert.deepEqual(remoteAttrs(d),[]);
assert.deepEqual(g.loads,[]);

$('search').value='Buggy Blast';$('search').dispatchEvent(new w.Event('input'));
assert.equal(d.querySelectorAll('.game').length,0);
assert.match(d.querySelector('.empty').textContent,/No games match/);
for(const game of gm){
  $('search').value=game.title;$('search').dispatchEvent(new w.Event('input'));
  assert.equal(d.querySelectorAll('.game').length,0,game.title+' search');
  $('search').value=game.id;$('search').dispatchEvent(new w.Event('input'));
  assert.equal(d.querySelectorAll('.game').length,0,game.id+' search');
}
$('search').value='gamemonetize';$('search').dispatchEvent(new w.Event('input'));
assert.equal(d.querySelectorAll('.game').length,0,'provider name search');
d.querySelector('#tagFilters button[data-tag="Arcade"]').click();
assert.equal(d.querySelectorAll('.game').length,0);
assert.match(d.querySelector('.empty').textContent,/Arcade is empty right now/);
assert.equal($('arcadeShelf').hidden,true);
d.querySelector('.empty button').click();
assert.equal(d.querySelectorAll('.game').length,18,'clearing the empty Arcade filter restores bundled games');
assert.equal($('search').value,'');

const urls=new Set();
let n=0;w.Math.random=()=>((n++)%18)/18;
for(let i=0;i<36;i++){$('randomGame').click();const src=$('frame').getAttribute('src');urls.add(src);assert(src.startsWith('games/'),src);assert(!src.includes('arcade'));assert(!HOST.test(src))}
assert.equal(urls.size,18,'random cycles bundled games only');
assert(!shown(d).some(title=>gm.concat(gd).some(game=>game.title===title)));
const saved=JSON.parse(w.localStorage.getItem('after-class-hub-v1'));
assert(saved.favourites.includes('buggy-blast')&&saved.recent.includes('panda-run'),'disabled ids stay in saved preferences');
assert.equal(saved.plays['buggy-blast'],4,'opening bundled games does not rewrite a disabled play count');
assert(![...d.querySelectorAll('[data-game]')].some(button=>button.dataset.game==='buggy-blast'||button.dataset.game==='panda-run'));

function openPage(id,config){
  const dom=new JSDOM(read(`arcade/${id}/index.html`),{url:`https://example.test/arcade/${id}/index.html`,runScripts:'outside-only'});
  const win=dom.window,loads=[];
  win.eval(`window.ARCADE_CONFIG=${JSON.stringify(config)}`);
  const orig=win.document.createElement.bind(win.document);
  win.document.createElement=function(name){
    const el=orig(name);
    const src=Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el),'src');
    if(src&&src.set)Object.defineProperty(el,'src',{configurable:true,enumerable:src.enumerable,get:function(){return src.get?src.get.call(el):el.getAttribute('src')},set:function(value){if(HOST.test(String(value||'')))loads.push(String(value));src.set.call(el,value)}});
    return el;
  };
  [...win.document.querySelectorAll('script:not([src])')].filter(s=>s.type!=='application/json').forEach(s=>win.eval(s.textContent));
  return {doc:win.document,loads};
}
for(const game of gm){
  const opened=openPage(game.id,{gmEnabled:false,gdEnabled:false,gdPublisherId:''});
  assert.equal(opened.doc.querySelectorAll('iframe').length,0,game.id);
  assert.equal(opened.doc.querySelectorAll('img').length,0,game.id);
  assert.deepEqual(remoteAttrs(opened.doc),[],game.id);
  assert.deepEqual(opened.loads,[],game.id+' network');
  assert.match(opened.doc.getElementById('stage').textContent,/not loaded/);
  assert(read(game.url).includes(game.embed),'embed address stays in the page metadata');
}
const enabled=openPage(gm[0].id,{gmEnabled:true,gdEnabled:false,gdPublisherId:''});
assert.equal(enabled.doc.querySelector('iframe').src,gm[0].embed,'the switch still reaches the saved embed');
const gdPage=openPage(gd[0].id,{gmEnabled:false,gdEnabled:false,gdPublisherId:''});
assert.equal(gdPage.doc.querySelectorAll('iframe').length,0,'GameDistribution stays off');
assert(!HOST.test(gdPage.doc.body.innerHTML));
console.log('PASS arcade disabled: 23 GameMonetize games absent from search, filters, random and play; no embed or cover request by default');
process.exit(0);
