const {JSDOM}=require('jsdom'),fs=require('fs'),assert=require('assert'),path=require('path');
const root=path.resolve(__dirname,'..');
const dom=new JSDOM(fs.readFileSync(root+'/index.html','utf8'),{url:'https://example.test/#games',runScripts:'outside-only',pretendToBeVisual:true});
const w=dom.window,d=w.document,$=id=>d.getElementById(id);w.confirm=()=>true;let external;w.open=url=>{external=url};
w.eval(fs.readFileSync(root+'/catalog.js','utf8'));w.eval(fs.readFileSync(root+'/app.js','utf8'));
assert(!$('arcade').hidden);assert($('study').hidden);assert.equal(d.querySelectorAll('.game').length,w.GAME_CATALOG.length);
for(const g of w.GAME_CATALOG){
 const i=w.GAME_CATALOG.indexOf(g);d.querySelectorAll('.game .game-content>button')[i].click();
 if(g.type==='external'){assert.equal(external,g.url);continue}
 assert.equal($('frame').getAttribute('src'),g.url);assert(!$('player').hidden);assert.equal($('playing').textContent,g.title);
 assert(fs.readFileSync(path.join(root,g.url),'utf8').includes('bridge.js'));
 $('frame').contentWindow.eval(fs.readFileSync(root+'/bridge.js','utf8'));
 $('frame').dispatchEvent(new w.Event('load'));assert($('loadStatus').hidden);
 $('pauseGame').click();assert(!$('pauseCover').hidden);$('resumeGame').click();assert($('pauseCover').hidden);
 $('playerStudy').click();assert(!$('study').hidden);assert($('player').hidden);
 $('openGames').click();assert(!$('arcade').hidden);assert($('player').hidden);
}
console.log('PASS: #games opens collection; '+w.GAME_CATALOG.length+' launch routes, pause/resume, study return and visible Games button. Does not execute game engines.');w.close();
