'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('games/spanwright/game.js','utf8');
const tick=source.slice(source.indexOf('  function tick(now)'),source.indexOf('  function paused()'));
function simulate(hz,speed=1){
 const c={screen:'play',session:{sim:{mode:'run',speed}},last:0,simAccumulator:0,particles:[],cam:{shake:0},count:0,Math,requestAnimationFrame(){},paused(){return false},consumeEvents(){},paint(){},updateHud(){}};
 c.E={FRAME:1/60,tick(){c.count++}};vm.createContext(c);vm.runInContext(tick,c);
 for(let i=1;i<=hz*2;i++)c.tick(i*1000/hz);
 return c.count;
}
for(const hz of [30,60,120,144])for(const speed of [1,2,4])assert.equal(simulate(hz,speed),120*speed,`${hz} Hz, ${speed}x`);
console.log('PASS Spanwright: identical physics tick count at 30/60/120/144 Hz and all simulation speeds');
const E=require('../games/spanwright/engine.js'),meta=E.defaultMeta(),session=E.startLevel(meta,'willow-1');
E.beginSim(session);
const original=session.nodes[0].x;
session.nodes[0].x+=3;
const context={E,meta,session,saveMeta(){},Object,JSON};vm.createContext(context);
vm.runInContext(source.slice(source.indexOf('  function saveDraft()'),source.indexOf('  function show(next)')),context);
context.saveDraft();assert.equal(meta.drafts['willow-1'].nodes[0].x,original);assert.equal(session.nodes[0].x,original+3);
console.log('PASS Spanwright: autosaving during simulation preserves the unbent design without interrupting the run');
