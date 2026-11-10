const assert=require('node:assert/strict'),E=require('../games/roof-runner/engine.js'),A=require('../games/ashwake/engine.js'),F=require('../games/forge-arena/contracts.js');
{
const old=E.create();delete old.profile.express;delete old.run.express;const migrated=E.decode(E.encode(old));assert(migrated);assert.deepEqual(migrated.profile.express,[false,false,false,false,false]);assert.equal(migrated.run.express,false);
function finish(ticks,falls){const o=E.create();assert(E.setExpress(o,true));E.step(o,{right:true});assert.equal(E.setExpress(o,false),false);Object.assign(o.run,{x:E.levels[0].goal[0]-10,y:370,ground:true,ticks,falls});assert(E.deliver(o));assert(E.decode(E.encode(o)));return o}
assert(finish(24*60,0).profile.express[0]);assert.equal(finish(24*60+1,0).profile.express[0],false);assert.equal(finish(600,1).profile.express[0],false);assert(finish(24*60+1,0).profile.best[0]>0,'missed express still unlocks the next route');
}
{
const m=A.createMeta(),r=A.startRun(m,'warden',3);r.player.hp=10;const near=r.enemies[0],far=r.enemies[1];near.x=r.player.x+30;near.y=r.player.y;near.hp=10;far.x=0;far.y=0;const farHP=far.hp;r.bolts=[{x:r.player.x,y:r.player.y,vx:0,vy:0,r:7,life:1,dmg:11}];assert(A.flare(r).ok);assert.equal(r.redraws,1);assert(!r.enemies.includes(near));assert.equal(far.hp,farHP);assert.equal(r.bolts.length,0);assert.equal(r.player.hp,10);assert(r.player.invuln>=.8);assert(A.decode(A.encode({meta:m,run:r})).ok,'flare saves remain readable after kills');r.player.xp=r.player.next;A.tick(r,{x:0,y:0},{w:960,h:540});assert.equal(r.phase,'level');assert.equal(A.flare(r).ok,false);assert(A.redraw(r).ok);assert.equal(r.redraws,0);A.choose(r,0);assert.equal(A.flare(r).ok,false,'redraw and flare share the same finite charges');
}
{
let r=F.create('scrap');F.step(r,1,{kills:3});assert.equal(r.status,'complete');r=F.create('clean');F.step(r,1,{kills:2,deaths:1});assert.equal(r.status,'failed');r=F.create('impact');for(let i=0;i<119;i++)F.step(r,1,{damage:0});F.step(r,1,{damage:60000});assert.equal(r.status,'complete');r=F.create('impact');for(let i=0;i<120;i++)F.step(r,1,{damage:0});F.step(r,1,{damage:90000});assert.equal(r.status,'failed','cannot complete after deadline');assert.equal(F.create('unknown'),null);assert.deepEqual(F.restore('{"scrap":90,"clean":-1,"impact":999,"unknown":2}'),{scrap:90});assert.deepEqual(F.restore('{'),{});
}
console.log('PASS round2 action engines: express migration/deadlines, flare resource tradeoff/save, combat contract completion/failure bounds');
