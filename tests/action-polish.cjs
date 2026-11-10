'use strict';
// Focused simulations for combat supplies, farming growth and route hazard warnings.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{JSDOM}=require('jsdom');
const root=path.join(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
function fixture(dir){const d=new JSDOM(read(`games/${dir}/index.html`),{url:`https://test.example/games/${dir}/`,runScripts:'outside-only',pretendToBeVisual:true});const w=d.window;w.requestAnimationFrame=()=>1;w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:(o,k)=>o[k]||(()=>{})});return d;}
{
 const d=fixture('orbital-surveyor'),w=d.window;w.eval(read('games/orbital-surveyor/game.js'));const g=w.OrbitalDropTest;g.start();g.enemies.push({x:g.player.x+80,y:g.player.y,hp:100,type:'runner',speed:0,attack:99,r:13});g.bullets.push({x:g.player.x+30,y:g.player.y,friendly:false},{x:0,y:0,friendly:false},{x:g.player.x,y:g.player.y,friendly:true});
 assert(g.pulse());assert.equal(g.enemies[0].hp,35);assert(g.enemies[0].x>g.player.x+80,'shockwave knocks a threat away');assert.equal(g.bullets.length,2,'only nearby enemy shots cleared');assert(!g.pulse(),'cooldown blocks repeat ability');
 g.player.pulse=.01;g.step(.02);assert(g.pulse());g.player.pulse=0;w.document.getElementById('pause').click();assert(!g.pulse(),'paused operation blocks ability');d.window.close();
}
{
 const E=require('../games/orbital-drop/engine.js'),s=E.create();s.spawn=1000;s.hero.hp=40;s.hero.shield=10;s.hero.regen=10;const t=s.terminals[0];s.hero.x=t.x;s.hero.y=t.y;t.charge=7.99;s.xp=10;
 E.step(s,.04);assert.equal(s.hero.hp,58);assert.equal(s.hero.shield,30);assert.equal(s.level,2,'relay XP grants promotion immediately');assert.equal(s.xp,2,'promotion preserves excess XP');const hp=s.hero.hp;E.step(s,.04);assert.equal(s.hero.hp,hp,'completed relay supplies grant only once');
 const firing=E.create();firing.spawn=1000;E.step(firing,.04,{aim:{x:900,y:460},firing:true});assert.equal(firing.shots.length,1,'manual fire works without a nearby auto-target');assert(firing.shots[0].vx>0);
}
{
 const E=require('../games/ashwake/engine.js');for(const hp of [50,98]){const s=E.startRun(E.createMeta(),'warden',12),lantern=s.enemies.find(e=>e.kind==='lantern');s.enemies=[lantern];s.player.hp=hp;s.spawn=9;s.weapons[0].timer=10;
 s.shots=[{id:999,x:lantern.x,y:lantern.y,ang:0,speed:0,r:10,dmg:1000,life:1,pierce:0,homing:0,target:0,hit:[],weapon:'sparks'}];E.tick(s,{});assert.equal(s.player.hp,Math.min(100,hp+8));assert.equal(s.enemies.length,0);assert.equal(s.events.find(e=>e.type==='mend').n,Math.min(8,100-hp));assert(E.decode(E.encode({meta:E.createMeta(),run:s})).ok,'healing keeps run save compatible');}
}
{
 const E=require('../games/roof-runner/engine.js'),s=E.create().run,v=[100,400,0];s.ticks=179;assert(!E.ventWarning(s,v));s.ticks=180;assert(E.ventWarning(s,v));assert(!E.ventActive(s,v),'warning window is safe');s.ticks=209;assert(E.ventWarning(s,v));s.ticks=210;assert(E.ventActive(s,v));assert(!E.ventWarning(s,v));
}
{
 // Exercise the actual repair update in isolation from the WebGL renderer and old engines.
 const html=read('games/forge-arena/index.html'),start=html.indexOf('window.BattleEngineV22=class'),a=html.indexOf('    update(dt){',start),b=html.indexOf('\n    damageUnit',a),method=html.slice(a,b);const context={Base:class{update(){}},hexRGB2:x=>x};vm.createContext(context);vm.runInContext(`class Repair extends Base { ${method} }; this.Repair=Repair`,context);
 function simulate(hz){const e=new context.Repair(),source={x:0,z:0,team:0,hp:0,maxHp:100,alive:true,repairAuraT:.25},ally={x:4,z:0,team:0,hp:10,maxHp:100,alive:true},enemy={x:3,z:0,team:1,hp:10,maxHp:100,alive:true};e.units=[source,ally,enemy];e.effects=[];for(let i=0;i<hz;i++)e.update(1/hz);assert.equal(enemy.hp,10);return ally.hp;}
 const activationStart=html.indexOf('  activateAbility(u,manual=false){',html.indexOf('window.BattleEngineV25=')),activationEnd=html.indexOf('\n  weaponSignature',activationStart),activation=html.slice(activationStart,activationEnd);context.AbilityBase=class{activateAbility(){for(const u of this.units)u.hp+=5;return true;}};vm.runInContext(`class Medic extends AbilityBase { ${activation} }; this.Medic=Medic`,context);const medic=new context.Medic(),healer={x:0,z:0,team:0,hp:10,alive:true,mech:{ability:{kind:'REPAIR'}}},friend={x:2,z:0,team:0,hp:20,alive:true};medic.units=[healer,friend];assert(medic.activateAbility(healer));assert.equal(healer.repairAuraT,2,'actual support ability starts lingering repair field');assert.equal(medic.healing,10,'tracks healing of nearby allies as well as self');
 assert(Math.abs(simulate(30)-11.5)<1e-8);assert(Math.abs(simulate(144)-simulate(30))<1e-8,'same repair amount at 30 and 144 Hz, including partial expiry frame');
}
(async()=>{
 const d=fixture('harvest-protocol'),w=d.window,timers=[];w.setTimeout=fn=>(timers.push(fn),timers.length);w.clearTimeout=()=>{};w.setInterval=()=>1;w.ResizeObserver=class{observe(){}};w.eval(w.document.querySelector('script:not([src])').textContent+'\nwindow.farmPolish={compile,get game(){return game}}');const g=w.farmPolish,$=id=>w.document.getElementById(id);
 assert.equal(g.compile('wait()').length,1);assert.throws(()=>g.compile('wait(8)'),/takes no arguments/);assert.throws(()=>g.compile('harvest(wheat)'),/takes no arguments/);g.game.fields[0].age=0;$('code').value=Array(8).fill('wait()').concat('harvest()').join('\n');let done=false;const task=$('run').onclick().then(()=>done=true);for(let i=0;i<50&&!done;i++){const fn=timers.shift();if(fn)fn();await Promise.resolve();await Promise.resolve();}await task;assert.equal(g.game.hay,4,'eight growth waits then harvest earn crop and first challenge reward');assert.match($('guide').textContent,/wait\(\)/);d.window.close();console.log('Action polish: shockwave damage/projectiles/cooldown/pause, relay supplies/XP/manual fire, elite healing/save, vent warning, frame-independent repair, farming wait/grammar passed.');
})().catch(e=>{console.error(e);process.exitCode=1});
