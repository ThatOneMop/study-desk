'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');const {JSDOM}=require('jsdom');
for(const game of ['orbital-drop','lanebound']){
const base=path.join(__dirname,'../games',game),dom=new JSDOM(fs.readFileSync(path.join(base,'index.html'),'utf8'),{url:`https://example.test/games/${game}/`,runScripts:'outside-only',pretendToBeVisual:true});
const w=dom.window;let time=0,id=0;const frames=new Map();w.requestAnimationFrame=fn=>{frames.set(++id,fn);return id;};w.cancelAnimationFrame=id=>frames.delete(id);Object.defineProperty(w.performance,'now',{value:()=>time,configurable:true});
const noop=()=>{};w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:()=>noop,set:()=>true});
w.eval(fs.readFileSync(path.join(__dirname,'../bridge.js'),'utf8'));
w.eval(fs.readFileSync(path.join(base,'engine.js'),'utf8'));let state;const engine=w[game==='orbital-drop'?'Orbital':'Lanebound'],create=engine.create;engine.create=(...args)=>(state=create(...args));w.eval(fs.readFileSync(path.join(base,'game.js'),'utf8'));
const tick=n=>{for(let i=0;i<n;i++){time+=16.6667;const batch=[...frames.values()];frames.clear();batch.forEach(fn=>fn(time));}};
w.document.getElementById('start').click();assert.equal(w.document.getElementById('overlay').hidden,true);tick(120);
const hud=w.document.getElementById(game==='orbital-drop'?'rank':'level').textContent;assert.match(hud,game==='orbital-drop'?/2s/:/Wave 1/);
w.document.getElementById('pause').click();const before=w.document.getElementById(game==='orbital-drop'?'rank':'level').textContent;tick(120);assert.equal(w.document.getElementById(game==='orbital-drop'?'rank':'level').textContent,before);w.document.getElementById('pause').click();tick(120);assert.equal(w.StudyBridge.paused,false);
const x=state.hero.x;w.document.getElementById('game').dispatchEvent(new w.KeyboardEvent('keydown',{key:'d',code:'KeyD',bubbles:true}));tick(20);assert(state.hero.x>x,'keyboard moves hero');w.dispatchEvent(new w.MessageEvent('message',{data:{type:'study-visibility',visible:false},source:w,origin:w.location.origin}));const timeBefore=state.time;tick(120);assert.equal(state.time,timeBefore,'bridge suspension freezes simulation');w.dispatchEvent(new w.MessageEvent('message',{data:{type:'study-visibility',visible:true},source:w,origin:w.location.origin}));tick(20);assert(state.time>timeBefore,'bridge resumes simulation');assert.equal(w.StudyBridge.paused,false);
console.log(`${game}: bridge RAF advances simulation; start/pause/resume pass`);w.close();
}
