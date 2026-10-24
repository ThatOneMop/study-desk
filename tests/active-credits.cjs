const assert=require('node:assert/strict'),fs=require('fs'),vm=require('vm');
const root=__dirname+'/../',html=fs.readFileSync(root+'credits.html','utf8'),context={window:{}};
vm.runInNewContext(fs.readFileSync(root+'catalog.js','utf8'),context);
const ids=new Set([...html.matchAll(/<section id="([^"]+)"/g)].map(match=>match[1]));
for(const game of context.window.GAME_CATALOG){
 const match=game.credits?.match(/^credits\.html#(.+)$/);assert(match,game.title+' needs a local credits anchor');assert(ids.has(match[1]),game.title+' credit anchor must exist');
}
for(const retired of ['2048','hextris','astray','radius-raid','dino','pacman','doom-web','micro','polytrack'])assert(!ids.has(retired),'retired credit must not be presented as active: '+retired);
assert(!/Kodub|Official-site link only|Made by the community/.test(html),'retired catalogue copy must be absent');
const after=html.match(/<section id="after-hours">([\s\S]*?)<\/section>/)?.[1]||'';
assert.match(after,/Balatro-inspired/);assert.match(after,/not (?:the )?commercial Balatro/i);assert.match(after,/https:\/\/github\.com\/ThatOneMop\/Balatro/);assert.match(after,/bfbffaa3e9c2ce5d651831bcec2506e22bcc6f61/);
console.log('PASS active credits: every catalogue anchor resolves; retired GitHub imports and PolyTrack shortcut absent; After Hours source labelled accurately');
