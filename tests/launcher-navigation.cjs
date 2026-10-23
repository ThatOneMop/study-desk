const {JSDOM}=require('jsdom'),fs=require('fs'),assert=require('node:assert/strict');
const root=__dirname+'/../';
const dom=new JSDOM(fs.readFileSync(root+'index.html','utf8'),{url:'https://example.test/repo/',runScripts:'outside-only',pretendToBeVisual:true});
const w=dom.window,d=w.document,$=id=>d.getElementById(id);
w.eval(fs.readFileSync(root+'catalog.js','utf8'));w.eval(fs.readFileSync(root+'app.js','utf8'));
const launch=id=>[...d.querySelectorAll('button[data-action="play"]')].find(b=>b.dataset.game===id);
const filter=name=>[...$('filters').children].find(b=>b.textContent===name);
function checkFocus(element){assert.equal(d.activeElement,element)}
function search(term){$('search').value=term;$('search').dispatchEvent(new w.Event('input'))}
function ppp(){for(let i=0;i<3;i++)w.dispatchEvent(new w.KeyboardEvent('keydown',{key:'p',bubbles:true}))}
assert.equal($('sessionReturn').hidden,true);
$('switch').click();assert.equal($('arcade').hidden,false);checkFocus($('search'));
const favourite=d.querySelector('.fav');favourite.focus();favourite.click();checkFocus(d.querySelector('.fav'));
filter('Favourites').focus();filter('Favourites').click();checkFocus(filter('Favourites'));
assert.equal(d.querySelectorAll('.game').length,1);
d.querySelector('.fav').click();checkFocus($('search'));assert(d.querySelector('.empty').textContent.includes('No favourites'));
d.querySelector('.empty button').click();checkFocus($('search'));assert.equal(d.querySelectorAll('.game').length,w.GAME_CATALOG.length);
launch('after-hours').click();assert.equal($('frame').title,'After Hours game');checkFocus($('frame'));
const frameWindow=$('frame').contentWindow,src=$('frame').src;
$('pauseGame').click();checkFocus($('resumeGame'));assert.equal($('frame').inert,true);assert.equal($('frame').tabIndex,-1);
$('frame').onload();checkFocus($('resumeGame'));
$('libraryBtn').click();checkFocus(launch('after-hours'));assert.equal($('sessionReturn').hidden,false);
// Return remains available even when a search hides the active tile.
search('no such game');$('search').focus();$('frame').onload();checkFocus($('search'));
assert.equal(d.querySelectorAll('.game').length,0);$('sessionReturn').querySelector('button').click();
assert.equal($('frame').contentWindow,frameWindow);assert.equal($('frame').src,src);checkFocus($('resumeGame'));
$('resumeGame').click();assert.equal($('frame').inert,false);assert.equal($('frame').tabIndex,0);checkFocus($('frame'));
ppp();checkFocus($('card'));
// Browse always goes to the library, but PPP deliberately resumes the player.
ppp();assert.equal($('player').hidden,false);assert.equal($('frame').contentWindow,frameWindow);
ppp();$('switch').click();assert.equal($('player').hidden,true);assert.equal($('arcade').hidden,false);checkFocus($('search'));
$('sessionReturn').querySelector('button').click();assert.equal($('frame').contentWindow,frameWindow);
$('libraryBtn').click();checkFocus($('search'));
d.querySelector('.empty button').click();assert.equal(d.querySelectorAll('.game').length,w.GAME_CATALOG.length);
assert.equal($('genre').value,'all');assert.equal(filter('All').getAttribute('aria-pressed'),'true');
console.log('PASS launcher: browse vs PPP, preserved iframe session, return through empty filters, named controls, focus restoration, paused keyboard isolation, late-load focus guards.');
w.close();
