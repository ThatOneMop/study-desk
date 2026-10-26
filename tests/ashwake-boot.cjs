const assert=require('node:assert/strict'),fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
const A=require(path.join(root,'games/ashwake/engine.js'));
const VIEW={w:960,h:540};
const html=fs.readFileSync(path.join(root,'games/ashwake/index.html'),'utf8');
const game=fs.readFileSync(path.join(root,'games/ashwake/game.js'),'utf8');
const css=fs.readFileSync(path.join(root,'games/ashwake/style.css'),'utf8');
assert.equal(A.SAVE_KEY,'study-desk-ashwake-v1');
assert(html.includes('../../bridge.js'));
assert(html.includes('href="../../index.html#games"'));
for(const id of ['title','begin','tutorial','pause','resume','stick','view','level','cards'])assert(html.includes('id="'+id+'"'),id);
assert(html.includes('Escape pauses')||html.includes('Esc'));
assert(game.includes('localStorage'));
assert(game.includes('AudioContext')||game.includes('webkitAudioContext'));
assert(css.includes('touch-action:none')||css.includes('touch-action: none'));
assert(!/vampire survivors|steam workshop|balatro/i.test(html+game));

assert.equal(A.startRun(A.createMeta(),'wickling',1),null);
const meta=A.createMeta();
let run=A.startRun(meta,'warden',1);
assert(run&&run.phase==='play'&&run.weapons.some(w=>w.id==='sparks'));
assert.equal(A.choose(run,0).ok,false);
A.pause(run);assert.equal(run.phase,'pause');A.resume(run);assert.equal(run.phase,'play');
run.player.xp=run.player.next;
A.tick(run,{x:0,y:0},VIEW);
assert.equal(run.phase,'level');assert.equal(run.draft.length,3);
assert.equal(A.choose(run,9).ok,false);
const offer=run.draft[0].id;
assert.equal(A.choose(run,0).ok,true);
assert(run.phase==='play'||run.phase==='level');
assert(run.weapons.some(w=>w.id===offer)||run.ranks[offer]>0||offer==='breath');

const fresh=A.createMeta();
let watch=A.startRun(fresh,'warden',1);
for(let i=0;i<90;i++){if(watch.phase==='level')A.choose(watch,0);else A.tick(watch,{x:1,y:0},VIEW);}
A.pause(watch);
const packed=A.encode({meta:fresh,run:watch});
const shell=JSON.parse(packed);
assert.equal(shell.id,'ashwake');
assert.equal(shell.title,'Ashwake');
assert.equal(typeof shell.playTime,'number');
assert.equal(shell.achievements.length,A.ACHIEVEMENTS.length);
assert(shell.achievements.every(a=>a.id&&a.name&&a.detail&&'earnedAt' in a));
const restored=A.decode(packed);
assert.equal(restored.ok,true);
assert.equal(restored.run.phase,'pause');
assert.equal(restored.run.kills,watch.kills);
assert.equal(restored.run.player.level,watch.player.level);
for(const bad of ['{','{"version":1}','{"version":1,"meta":{}}','x'.repeat(200000)])assert.equal(A.decode(bad).ok,false);

const rich=A.createMeta();rich.embers=40;
const bought=A.purchase(rich,'thorn');
assert.equal(bought.ok,true);assert.equal(bought.meta.unlocks.thorn,true);assert.equal(bought.meta.embers,24);
assert.equal(A.purchase(bought.meta,'thorn').ok,false);
assert.equal(A.purchase(A.createMeta(),'thorn').ok,false);
A.addTime(bought.meta,3.5,1_700_000_000_000);
const kept=A.checkAchievements(bought.meta,null,1_700_000_000_000);
assert(kept.fresh.some(a=>a.id==='kept'));
const round=A.decode(A.encode({meta:kept.meta,run:null}));
assert.equal(round.ok,true);
assert.equal(round.meta.playTime,3.5);
assert.equal(round.meta.achievements.kept,1_700_000_000_000);
assert.equal(JSON.parse(A.encode({meta:kept.meta})).achievements.find(a=>a.id==='kept').earnedAt,1_700_000_000_000);

function kite(s){
 const p=s.player,W=A.WORLD;let nx=0,ny=0,n=0;
 for(const e of s.enemies){const d=Math.hypot(e.x-p.x,e.y-p.y);if(d>0&&d<220){nx-=(e.x-p.x)/d;ny-=(e.y-p.y)/d;n++;}}
 if(p.x<260)nx+=1.2;if(p.x>W-260)nx-=1.2;if(p.y<260)ny+=1.2;if(p.y>W-260)ny-=1.2;
 if(!n&&Math.abs(nx)+Math.abs(ny)<0.2)return{x:Math.cos(s.time),y:Math.sin(s.time)};
 const m=Math.hypot(nx,ny)||1;return{x:nx/m,y:ny/m};
}
let still=A.startRun(A.createMeta(),'warden',1);
for(let i=0;i<70*60&&still.phase!=='dead'&&still.phase!=='dawn';i++){if(still.phase==='level')A.choose(still,0);else A.tick(still,{x:0,y:0},VIEW);}
assert.equal(still.phase,'dead');assert(still.time<60);assert(still.player.level>=2);
let moved=A.startRun(A.createMeta(),'warden',1);
for(let i=0;i<80*60&&(moved.phase==='play'||moved.phase==='level');i++){if(moved.phase==='level')A.choose(moved,0);else A.tick(moved,kite(moved),VIEW);}
assert.equal(moved.phase,'play');assert(moved.time>60);assert(moved.player.level>=5);assert(moved.bossSpawned);assert(moved.player.hp>0);

const ended=A.startRun(A.createMeta(),'warden',2);ended.phase='dawn';ended.time=80;ended.kills=20;ended.embers=4;
const paid=A.bank(A.createMeta(),ended);
assert.equal(paid.ok,true);assert(paid.gained>=18);assert.equal(paid.meta.clears,1);
const dawn=A.checkAchievements(paid.meta,ended,50);
assert(dawn.fresh.some(a=>a.id==='dawn'||a.id==='spark'));
assert(game.includes('drawGather')&&game.includes('setLineDash')&&game.includes('drawHollow'));
assert(html.includes('id="night"')&&html.includes('Hollow Bell'));
const owned=A.createMeta();owned.unlocks.wickling=true;
const wick=A.startRun(owned,'wickling',4),ward=A.startRun(A.createMeta(),'warden',4);
assert(wick.player.speed>ward.player.speed);
assert(A.KEEPERS.wickling.spark<A.KEEPERS.warden.spark&&A.KEEPERS.wickling.gait>1);
function until(s,n){for(let i=0;i<n&& (s.phase==='play'||s.phase==='level');i++){if(s.phase==='level')A.choose(s,0);else A.tick(s,{x:0,y:0},VIEW);}}
function quiet(s,kind){const e=s.enemies.find(x=>x.kind===kind);assert(e,kind);s.enemies=[e];e.x=s.player.x+36;e.y=s.player.y;e.hp=1;s.shots=[];until(s,90);assert(!s.enemies.some(x=>x.kind===kind));}
let nights=A.startRun(A.createMeta(),'warden',6);
nights.time=A.BOSS_AT-0.02;nights.player.hp=500;nights.player.maxHp=500;nights.player.next=9999;
until(nights,20);
quiet(nights,'warden');
assert(nights.firstBell&&nights.phase==='play');
until(nights,220);
assert.equal(nights.night,2);
nights.time=Math.max(nights.time,nights.hollowAt-0.05);nights.player.next=9999;
until(nights,24);
quiet(nights,'hollow');
until(nights,180);
assert.equal(nights.phase,'dawn');
assert(A.bank(A.createMeta(),nights).gained>=28);
const legacy=JSON.parse(A.encode({meta:A.createMeta(),run:A.startRun(A.createMeta(),'warden',1)}));
delete legacy.meta.achievements.firstbell;delete legacy.run.night;delete legacy.run.lull;delete legacy.run.firstBell;delete legacy.run.hollowAt;delete legacy.run.tolls;
const legacyBack=A.decode(JSON.stringify(legacy));
assert.equal(legacyBack.ok,true);
assert.equal(legacyBack.meta.achievements.firstbell,0);
assert.equal(legacyBack.run.night,1);
console.log('PASS Ashwake boot: title route, tutorial and pause markup, touch stick, save shell, achievements, play time, level-up, a walked watch, the gather ring, and both bells');
