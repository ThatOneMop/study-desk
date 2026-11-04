// Arcade section: live GameMonetize games are listed; GameDistribution games stay hidden
// (no tiles, no iframes) until arcade-config.js is switched on with a publisher ID.
const {JSDOM}=require('jsdom'),fs=require('fs'),assert=require('node:assert/strict'),path=require('path');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
const catalog=JSON.parse(read('catalog.json'));
const live=catalog.filter(g=>g.type==='arcade');
const sandbox=new JSDOM('',{runScripts:'outside-only'}).window;sandbox.eval(read('arcade/gamedistribution.js'));sandbox.eval(read('arcade-config.js'));
const gd=JSON.parse(JSON.stringify(sandbox.ARCADE_GD_CATALOG));
assert.equal(gd.length,45,'45 GameDistribution games are prepared');
assert.deepEqual({...sandbox.ARCADE_CONFIG},{gdEnabled:false,gdPublisherId:''},'GameDistribution is switched off by default');
assert(gd.every(g=>g.id.startsWith('gd-')&&g.source==='GameDistribution'&&/^[0-9a-f]{32}$/.test(g.gdGameId)&&g.url===`arcade/${g.id}/index.html`));
assert(!catalog.some(g=>g.source==='GameDistribution'),'no GameDistribution game in the public catalogue');
assert(live.length>=4);

function hub(config){
  const dom=new JSDOM(read('index.html'),{url:'https://example.test/#games',runScripts:'outside-only',pretendToBeVisual:true});
  const w=dom.window;w.eval(read('catalog.js'));w.eval(`window.ARCADE_CONFIG=${JSON.stringify(config)}`);
  w.eval(read('arcade/gamedistribution.js'));w.eval(read('app.js'));return w;
}
function titlesIn(w,name){const d=w.document;[...d.getElementById('filters').children].find(b=>b.textContent===name).click();return [...d.querySelectorAll('#games .game h3')].map(h=>h.textContent)}

// Default (off): only the live GameMonetize games appear, everywhere on the page.
let w=hub({gdEnabled:false,gdPublisherId:''});
let arcadeTitles=titlesIn(w,'Arcade');
assert.deepEqual(arcadeTitles.sort(),live.map(g=>g.title).sort(),'Arcade filter shows exactly the live games');
const allTitles=titlesIn(w,'All');
const html=w.document.body.innerHTML;
for(const g of gd){assert(!allTitles.includes(g.title),g.title+' must be hidden');assert(!html.includes(g.url),g.id+' link must not render');assert(!html.includes(g.gdGameId))}
// switched on without a publisher ID still stays hidden
w=hub({gdEnabled:true,gdPublisherId:'  '});
assert.deepEqual(titlesIn(w,'Arcade').sort(),live.map(g=>g.title).sort());

// Switched on with a publisher ID: GameDistribution games join the Arcade filter.
w=hub({gdEnabled:true,gdPublisherId:'test-publisher'});
arcadeTitles=titlesIn(w,'Arcade');
assert.equal(arcadeTitles.length,live.length+gd.length);
assert(gd.every(g=>arcadeTitles.includes(g.title)));

// Game pages: GM pages embed their catalogue link; GD pages make no iframe while off.
function page(id,config){
  const dom=new JSDOM(read(`arcade/${id}/index.html`),{url:`https://example.test/arcade/${id}/index.html`,runScripts:'outside-only'});
  const w=dom.window;w.eval(`window.ARCADE_CONFIG=${JSON.stringify(config)}`);
  const inline=[...w.document.querySelectorAll('script:not([src])')].filter(s=>s.type!=='application/json');
  inline.forEach(s=>w.eval(s.textContent));return w.document;
}
const OFF={gdEnabled:false,gdPublisherId:''},ON={gdEnabled:true,gdPublisherId:'test-publisher'};
for(const g of live){
  const src=read(g.url);assert(src.includes('../../bridge.js')&&src.includes('id="fs"')&&src.includes('id="back"'),g.id);
  const d=page(g.id,OFF),f=d.querySelectorAll('iframe');assert.equal(f.length,1,g.id);assert.equal(f[0].src,g.embed);
  assert.match(f[0].allow,/fullscreen/);assert(d.getElementById('credit').textContent.includes(g.developer));
}
for(const g of gd){
  const src=read(g.url);assert(!/<iframe/i.test(src),g.id+' has no static iframe');assert(!src.includes('html5.gamedistribution.com/'+g.gdGameId));
  const d=page(g.id,OFF);assert.equal(d.querySelectorAll('iframe').length,0,g.id+' must not embed while off');
  assert.match(d.getElementById('stage').textContent,/not switched on/);
}
const on=page(gd[0].id,ON).querySelector('iframe');
assert(on&&on.src.startsWith(`https://html5.gamedistribution.com/${gd[0].gdGameId}/?gd_sdk_referrer_url=`),'switch on embeds the GameDistribution URL with gd_sdk_referrer_url');
const credits=read('credits.html');for(const g of live)assert(credits.includes(`id="arcade-${g.id}"`));assert(credits.includes('id="arcade-gamedistribution"'));
console.log(`PASS arcade: ${live.length} live GameMonetize games listed and embedded; ${gd.length} GameDistribution games hidden with no iframe until switched on`);
process.exit(0);
