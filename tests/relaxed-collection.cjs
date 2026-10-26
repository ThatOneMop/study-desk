const {JSDOM}=require('jsdom'),fs=require('fs'),assert=require('node:assert/strict');
const root=__dirname+'/../',dom=new JSDOM(fs.readFileSync(root+'index.html','utf8'),{url:'https://example.test/#games',runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window,d=w.document,$=id=>d.getElementById(id);
w.eval(fs.readFileSync(root+'catalog.js','utf8'));w.eval(fs.readFileSync(root+'app.js','utf8'));
const change=(id,value,type='change')=>{$(id).value=value;$(id).dispatchEvent(new w.Event(type))};
const count=()=>d.querySelectorAll('.game').length;
assert.equal(count(),w.GAME_CATALOG.length);assert.equal($('arcade').hidden,false);assert.equal($('studyBtn'),null);assert.equal($('playerStudy'),null);
change('search','POKER balatro','input');assert.equal(count(),1);
$('clearFilters').click();change('genre','Fishing');assert.equal(count(),2);
change('search','no matching game','input');assert(d.querySelector('.empty'));d.querySelector('.empty button').click();assert.equal(count(),w.GAME_CATALOG.length);
change('groupBy','collection');assert.equal(d.querySelectorAll('.game-section').length,new Set(w.GAME_CATALOG.map(g=>g.group)).size);
change('groupBy','none');change('sortGames','az');const titles=[...d.querySelectorAll('.game h3')].map(e=>e.textContent);assert.deepEqual(titles,[...titles].sort((a,b)=>a.localeCompare(b)));
d.querySelector('.fav').click();[...$('filters').children].find(e=>e.textContent==='Favourites').click();assert.equal(count(),1);
$('clearFilters').click();assert.equal($('groupBy').value,'none');assert.equal(count(),w.GAME_CATALOG.length);
d.querySelector('[data-game="autumn-drift"][data-action="play"]').click();assert.equal($('player').hidden,false);$('libraryBtn').click();assert.equal($('sessionReturn').hidden,false);
change('groupBy','none');change('sortGames','recent');assert.equal(d.querySelector('.game h3').textContent,'Autumn Drift');
assert.equal($('frame').getAttribute('src'),'games/autumn-drift/index.html');
console.log('PASS relaxed collection: keyword search, genre, grouping, sorting, favourites, reset, removed workspace controls, game launch and preserved session.');w.close();

