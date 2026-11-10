const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('games/winterfold/game.js','utf8');
const body=source.slice(source.indexOf('  function endPointer(ev)'),source.indexOf("  canvas.addEventListener('pointerup'"));
for(const type of ['pointerup','pointercancel','lostpointercapture']){
 let commits=0,refreshes=0;
 const c={pointers:new Map([[1,{}]]),drawing:{pts:[{x:0,y:0},{x:100,y:100}]},hand:'draw',run:{},tool:'slope',liftType:'chair',E:{commitStroke:()=>{commits++;return {ok:true}}},apply:()=>{},refresh:()=>refreshes++};
 vm.createContext(c);vm.runInContext(body+';endPointer({pointerId:1,type:'+JSON.stringify(type)+'})',c);
 assert.equal(commits,type==='pointerup'?1:0);assert.equal(c.drawing,null);assert.equal(c.pointers.size,0);assert.equal(refreshes,1);
 // A duplicate capture-release event must not commit twice.
 vm.runInContext("endPointer({pointerId:1,type:'pointerup'})",c);assert.equal(commits,type==='pointerup'?1:0);
}
const saveBody=source.slice(source.indexOf('  function save()'),source.indexOf('  function toast('));
let writes=0;const c={saveBlocked:true,toast:()=>{},localStorage:{setItem:()=>writes++},E:{SAVE_KEY:'test',encode:()=>''},meta:{},run:null};vm.createContext(c);vm.runInContext(saveBody+';save()',c);assert.equal(writes,0);c.saveBlocked=false;vm.runInContext('save()',c);assert.equal(writes,1);
console.log('Winterfold pointer cancellation and unreadable-save preservation pass');
