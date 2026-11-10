/* Meaningful physics/control checks; NODE_PATH must point to jsdom 26. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{JSDOM}=require('jsdom');
const base=path.resolve(__dirname,'../games');
function load(slug,files){const dom=new JSDOM(fs.readFileSync(path.join(base,slug,'index.html'),'utf8'),{url:'https://study.test/',runScripts:'outside-only'}),w=dom.window;w.__STUDY_DESK_TEST__=true;w.Math.random=()=>.5;w.requestAnimationFrame=()=>1;w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({createLinearGradient:()=>({addColorStop(){}})},{get:(o,k)=>k in o?o[k]:()=>{}});for(const f of files)w.eval(fs.readFileSync(path.join(base,f),'utf8'));return{w,dom};}
function advance(api,n){for(let i=0;i<n*120;i++)api.step(1/120);}
{
 const {w,dom}=load('basket-chaos',['basket-chaos/game.js']),a=w.ChaosSportsTest;
 w.document.getElementById('mode').value='duo';w.document.getElementById('mode').dispatchEvent(new w.Event('change'));a.start();a.setPossession(0);advance(a,11);assert.equal(a.snapshot().possession,0);advance(a,1.1);assert.equal(a.snapshot().possession,-1,'holding the ball beyond 12 seconds forces a loose-ball turnover');assert.match(w.document.getElementById('message').textContent,/Shot clock/);assert.equal(a.snapshot().score[0],0);dom.window.close();
}
for(const sport of ['soccer','volley']){
 const {w,dom}=load(`${sport}-chaos`,['basket-chaos/game.js']),a=w.ChaosSportsTest;a.start();a.setPlayer(0,{x:300,y:350,vx:0,low:false});a.setBall({x:320,y:240,vx:0,vy:0,noHit:0});a.action(0);const high=a.snapshot().ball.vy;a.setPlayer(0,{low:true});a.setBall({x:320,y:240,vx:0,vy:0,noHit:0});a.action(0);assert.ok(a.snapshot().ball.vy>high,`${sport}: low action changes the trajectory`);assert.equal(a.snapshot().rally,1,'repeated same-player contacts do not inflate a rally');a.setPlayer(1,{x:350,y:350});a.setBall({x:330,y:310,vx:0,vy:0});a.action(1);assert.equal(a.snapshot().rally,2);assert.equal(JSON.parse(w.localStorage.getItem(`study-desk.${sport}-chaos.v1`)).rally,2,'alternating contacts save a longest rally');dom.window.close();
}
{
 const {w,dom}=load('chaos-court',['chaos-court/game.js']),a=w.ChaosCourtTest;a.step(2);a.setBall({x:910,y:220,vx:600,vy:0});for(let i=0;i<10;i++)a.step(1/120);assert.ok(a.snapshot().ball.vx<0,'a shot rebounds from the right basketball backboard');assert.equal(a.snapshot().score[0],0);dom.window.close();
}
{
 const E=require('../games/pocket-golf/engine.js'),c=E.course(42,0),ball={...c.start,vx:0,vy:0,sunk:false},before=JSON.stringify(ball),points=E.preview(ball,c,.25,95);assert.equal(JSON.stringify(ball),before,'preview does not move the real ball');E.strike(ball,.25,95);for(let i=0;i<720&&E.moving(ball)&&!ball.sunk;i++)E.step(ball,c,1/60);const end=points.at(-1);assert.ok(Math.hypot(end.x-ball.x,end.y-ball.y)<.001,'bank/sand preview reaches the actual resting lie');assert.ok(points.length>5);
}
{
 const {w,dom}=load('pocket-golf-nine',['pocket-golf-nine/game.js']),a=w.PocketGolfTest;a.start();const before=a.snapshot().aim;w.document.getElementById('aimRight').click();assert.ok(Math.abs(a.snapshot().aim-before-.03)<1e-9,'fine aiming turns only 0.03 radians');const power=w.document.getElementById('power');power.value=2;power.dispatchEvent(new w.Event('input'));a.shoot();assert.equal(a.snapshot().strokes,1);assert.ok(Math.abs(Math.hypot(a.snapshot().ball.vx,a.snapshot().ball.vy)-14)<1e-9,'2% power enables a delicate 14px/s tap');dom.window.close();
}
console.log('Sports polish: possession turnover, low kicks and spikes, alternating rally persistence, backboard rebound, and non-mutating physical golf prediction passed.');
