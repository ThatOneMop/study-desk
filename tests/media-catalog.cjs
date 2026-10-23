const {JSDOM}=require('jsdom'),fs=require('fs'),assert=require('node:assert/strict');
const root=__dirname+'/../';
function setup(hash=''){
 const dom=new JSDOM(fs.readFileSync(root+'index.html','utf8'),{url:'https://example.test/study-desk/'+hash,runScripts:'outside-only',pretendToBeVisual:true});
 const w=dom.window;for(const file of ['catalog.js','media-catalog.js','app.js','media.js'])w.eval(fs.readFileSync(root+file,'utf8'));return dom;
}
const dom=setup('#movies'),w=dom.window,d=w.document,$=id=>d.getElementById(id);
assert.equal($('arcade').hidden,false);assert.equal($('gameCollection').hidden,true);assert.equal($('mediaCollection').hidden,false);
assert.equal(d.querySelectorAll('.media-card').length,50);
assert.equal(new Set(w.MEDIA_CATALOG.map(x=>x.id)).size,70);
$('mediaSearch').value='Avengers';$('mediaSearch').dispatchEvent(new w.Event('input'));assert.equal(d.querySelectorAll('.media-card').length,5);
$('mediaReset').click();$('mediaRating').value='PG';$('mediaRating').dispatchEvent(new w.Event('change'));
assert(d.querySelectorAll('.media-card').length>10);assert([...d.querySelectorAll('.media-meta')].every(x=>x.textContent.includes('PG')));
$('mediaSearch').value='nonexistent-title';$('mediaSearch').dispatchEvent(new w.Event('input'));assert.equal(d.querySelectorAll('.media-card').length,0);assert($('mediaGrid').textContent.includes('Nothing matches'));
w.selectEntertainment('tv');assert.equal(d.querySelectorAll('.media-card').length,20);
const hawaii=[...d.querySelectorAll('.media-card')].find(x=>x.textContent.includes('Hawaii Five-0'));
assert.equal(hawaii.querySelectorAll('.season-links a').length,10);
const house=[...d.querySelectorAll('.media-card')].find(x=>x.textContent.includes('House M.D.'));
assert.equal(house.querySelectorAll('.season-links a').length,8);
for(const a of d.querySelectorAll('.media-card a')){assert.equal(new URL(a.href).hostname,'www.justwatch.com');assert.equal(a.target,'_blank');assert(a.rel.includes('noopener'))}
$('gamesTab').click();assert.equal($('gameCollection').hidden,false);assert.equal($('mediaCollection').hidden,true);assert.equal(d.querySelectorAll('.game').length,w.GAME_CATALOG.length);
dom.window.close();
const tv=setup('#tv');assert.equal(tv.window.document.querySelectorAll('.media-card').length,20);tv.window.close();
console.log('PASS: 50 movies, 20 shows, direct routes, search, ratings, empty state, all season links, safe external links, return to games');
