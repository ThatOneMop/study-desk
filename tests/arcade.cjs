// Arcade providers stay hidden until their own switches are on.
// GameMonetize needs gmEnabled === true. GameDistribution also needs a publisher ID.
const {JSDOM}=require('jsdom'),fs=require('fs'),assert=require('node:assert/strict'),path=require('path');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
const catalog=JSON.parse(read('catalog.json'));
const sandbox=new JSDOM('',{runScripts:'outside-only'}).window;
sandbox.eval(read('arcade/gamemonetize.js'));sandbox.eval(read('arcade/gamedistribution.js'));sandbox.eval(read('arcade-config.js'));
const gm=JSON.parse(JSON.stringify(sandbox.ARCADE_GM_CATALOG));
const gd=JSON.parse(JSON.stringify(sandbox.ARCADE_GD_CATALOG));
assert.equal(gm.length,23,'23 GameMonetize games stay prepared');
assert.equal(gd.length,45,'45 GameDistribution games are prepared');
assert.deepEqual({...sandbox.ARCADE_CONFIG},{gmEnabled:false,gdEnabled:false,gdPublisherId:''},'both Arcade providers are switched off by default');
assert(gm.every(g=>g.source==='GameMonetize'&&g.embed.startsWith('https://html5.gamemonetize.co/')&&g.url===`arcade/${g.id}/index.html`));
assert(gd.every(g=>g.id.startsWith('gd-')&&g.source==='GameDistribution'&&/^[0-9a-f]{32}$/.test(g.gdGameId)&&g.url===`arcade/${g.id}/index.html`));
assert(!catalog.some(g=>g.source==='GameMonetize'||g.source==='GameDistribution'||g.type==='arcade'),'no provider game in the public catalogue');

function hub(config){
  const dom=new JSDOM(read('index.html'),{url:'https://example.test/#games',runScripts:'outside-only',pretendToBeVisual:true});
  const w=dom.window;w.eval(read('catalog.js'));w.eval(`window.ARCADE_CONFIG=${JSON.stringify(config)}`);
  w.eval(read('arcade/gamemonetize.js'));w.eval(read('arcade/gamedistribution.js'));w.eval(read('app.js'));return w;
}
function titles(w){return [...w.document.querySelectorAll('#games .game h3')].map(h=>h.textContent)}
function filterTitles(w,name){const button=[...w.document.getElementById('filters').children].find(b=>b.textContent===name);assert(button,name+' filter');button.click();return titles(w)}

const OFF={gmEnabled:false,gdEnabled:false,gdPublisherId:''};
let w=hub(OFF);
assert(![...w.document.getElementById('filters').children].some(b=>b.textContent==='Arcade'),'no Arcade filter while both providers are off');
for(const g of gm.concat(gd))assert(!titles(w).includes(g.title),g.title+' must be hidden');
assert.equal(w.document.getElementById('arcadeShelf').hidden,true,'empty Arcade shelf stays hidden');

w=hub({gmEnabled:'true',gdEnabled:false,gdPublisherId:''});
assert(!titles(w).some(title=>gm.some(g=>g.title===title)),'a non-boolean gmEnabled does not publish GameMonetize');
w=hub({gmEnabled:false,gdEnabled:true,gdPublisherId:'  '});
assert.deepEqual(filterTitles(w,'All').sort(),titles(hub(OFF)).sort(),'GameDistribution without a publisher ID stays hidden');

w=hub({gmEnabled:true,gdEnabled:false,gdPublisherId:''});
const gmTitles=filterTitles(w,'Arcade');
assert.deepEqual(gmTitles.sort(),gm.map(g=>g.title).sort(),'gmEnabled shows exactly the GameMonetize games');
assert(gd.every(g=>!titles(w).includes(g.title)),'turning GameMonetize on does not enable GameDistribution');

w=hub({gmEnabled:false,gdEnabled:true,gdPublisherId:'test-publisher'});
const gdTitles=filterTitles(w,'Arcade');
assert.deepEqual(gdTitles.sort(),gd.map(g=>g.title).sort(),'publisher switch shows exactly the GameDistribution games');
assert(gm.every(g=>!titles(w).includes(g.title)),'turning GameDistribution on does not enable GameMonetize');

function page(id,config){
  const dom=new JSDOM(read(`arcade/${id}/index.html`),{url:`https://example.test/arcade/${id}/index.html`,runScripts:'outside-only'});
  const w=dom.window;w.eval(`window.ARCADE_CONFIG=${JSON.stringify(config)}`);
  const inline=[...w.document.querySelectorAll('script:not([src])')].filter(s=>s.type!=='application/json');
  inline.forEach(s=>w.eval(s.textContent));return w.document;
}
for(const g of gm){
  const src=read(g.url);assert(src.includes('../../bridge.js')&&src.includes('id="fs"')&&src.includes('id="back"'),g.id);
  assert(!/<iframe/i.test(src),g.id+' has no static iframe');
  const d=page(g.id,OFF);assert.equal(d.querySelectorAll('iframe').length,0,g.id+' must not embed while off');
  assert.equal(d.querySelectorAll('img').length,0,g.id+' must not load a cover while off');
  assert.match(d.getElementById('stage').textContent,/switched off/);
}
const on=page(gm[0].id,{gmEnabled:true,gdEnabled:false,gdPublisherId:''}).querySelector('iframe');
assert(on&&on.src===gm[0].embed,'gmEnabled embeds the saved GameMonetize URL');
for(const g of gd){
  const src=read(g.url);assert(!/<iframe/i.test(src),g.id+' has no static iframe');assert(!src.includes('html5.gamedistribution.com/'+g.gdGameId));
  const d=page(g.id,OFF);assert.equal(d.querySelectorAll('iframe').length,0,g.id+' must not embed while off');
  assert.match(d.getElementById('stage').textContent,/not switched on/);
}
const gdOn=page(gd[0].id,{gmEnabled:false,gdEnabled:true,gdPublisherId:'test-publisher'}).querySelector('iframe');
assert(gdOn&&gdOn.src.startsWith(`https://html5.gamedistribution.com/${gd[0].gdGameId}/?gd_sdk_referrer_url=`),'switch on embeds the GameDistribution URL with gd_sdk_referrer_url');
const credits=read('credits.html');
assert(credits.includes('id="arcade-gamemonetize"'));assert(credits.includes('id="arcade-gamedistribution"'));
assert(!gm.some(g=>credits.includes(`id="arcade-${g.id}"`)),'hidden GameMonetize games are not separate live credit sections');
console.log(`PASS arcade: ${gm.length} GameMonetize and ${gd.length} GameDistribution games hidden until their own switches; public catalogue unchanged`);
process.exit(0);
