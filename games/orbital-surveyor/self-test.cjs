/* Run: NODE_PATH=<test workspace>/node_modules node games/orbital-surveyor/self-test.cjs */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{JSDOM}=require('jsdom');
const root=__dirname,dom=new JSDOM(fs.readFileSync(path.join(root,'index.html'),'utf8'),{url:'https://study.test/games/orbital-surveyor/',runScripts:'outside-only'}),w=dom.window;
w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:(o,k)=>o[k]||(()=>{})});let frame;w.requestAnimationFrame=fn=>{frame=fn;return 1};
w.eval(fs.readFileSync(path.join(root,'game.js'),'utf8'));const game=w.OrbitalDropTest;frame(16);frame(32);
function step(seconds,before){for(let n=0;n<seconds/.04;n++){if(before)before();game.step(.04)}}
game.start();assert.equal(game.state,'playing');const x=game.player.x;game.keys.add('KeyD');step(1);game.keys.clear();assert(game.player.x>x+170,'movement must respond to held keys');
game.hit(30);assert.equal(game.player.shield,40);step(5,()=>game.enemies.forEach(e=>{e.x=0;e.y=0}));assert(game.player.shield>50,'shields regenerate after damage delay');game.dodge();const hp=game.player.hp;game.hit(200);assert.equal(game.player.hp,hp,'dodge briefly protects the suit');
game.start();game.keys.add('KeyJ');game.enemies.push({x:game.player.x+65,y:game.player.y,hp:10,type:'runner',speed:0,attack:99,r:13});step(.4);assert(game.score>=40,'auto-aim shots must hit and reward a threat');
game.start();game.keys.add('KeyE');for(const core of game.cores){game.player.x=core.x;game.player.y=core.y;step(2.1,()=>game.enemies.forEach(e=>{e.x=0;e.y=0}));assert(core.done,'holding Recover completes a nearby core')}
game.keys.clear();game.player.x=550;game.player.y=545;step(12.1,()=>game.enemies.forEach(e=>{e.x=0;e.y=0}));assert.equal(game.state,'won');assert(game.score>=1900);game.hit(1000);assert.equal(game.state,'won','late damage must not overwrite a completed extraction');assert.equal(JSON.parse(w.localStorage.getItem('orbital-drop.v1')).unlocked,2,'mission completion unlocks and saves next operation');
game.start();game.hit(1000);assert.equal(game.state,'lost');assert.match(w.document.getElementById('overlayTitle').textContent,/Signal lost/);
console.log('Orbital Surveyor: movement, shield regeneration, dodge protection, auto-aim damage/reward, core recovery, extraction, progression save and loss passed.');dom.window.close();
