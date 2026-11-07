const assert=require('node:assert/strict'),fs=require('fs'),vm=require('vm');
const root=__dirname+'/../',html=fs.readFileSync(root+'credits.html','utf8'),context={window:{}};
vm.runInNewContext(fs.readFileSync(root+'catalog.js','utf8'),context);
const ids=new Set([...html.matchAll(/<section id="([^"]+)"/g)].map(match=>match[1]));
for(const game of context.window.GAME_CATALOG){
 const match=game.credits?.match(/^credits\.html#(.+)$/);assert(match,game.title+' needs a local credits anchor');assert(ids.has(match[1]),game.title+' credit anchor must exist');
}
for(const retired of ['2048','hextris','astray','radius-raid','dino','pacman','doom-web','micro','polytrack'])assert(!ids.has(retired),'retired credit must not be presented as active: '+retired);
assert(!/Kodub|Official-site link only|Made by the community/.test(html),'retired catalogue copy must be absent');
for(const removed of ['after-hours','underleaf','lucky-company','tidepost','lane-eight','foldlight','reefwright','nightshift-empire'])assert(!ids.has(removed),'removed game credit must be gone: '+removed);
assert.equal(ids.size,context.window.GAME_CATALOG.filter(g=>!/#created-games$/.test(g.credits)).length+1+['arcade','arcade-gamemonetize','arcade-gamedistribution'].filter(id=>ids.has(id)).length,'one credits section per kept game plus created games and the switched-off Arcade lists');
console.log('PASS active credits: every catalogue anchor resolves; retired GitHub imports and PolyTrack shortcut absent; removed game credits dropped');
