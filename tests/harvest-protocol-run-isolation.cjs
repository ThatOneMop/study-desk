'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync('games/harvest-protocol/index.html','utf8');
for(const match of html.matchAll(/<script>([\s\S]*?)<\/script>/g))new vm.Script(match[1]);
const a=html.indexOf("$('run').onclick=async()=>"),b=html.indexOf("const canvas=$('field')",a),elements={run:{},code:{value:'harvest()'},error:{},status:{},speed:{value:'5'}};
const waits=[];const c={console,Promise,Math,$:id=>elements[id],running:false,cancel:false,autoplay:false,runVersion:0,workers:[{x:0,z:0}],game:{size:1,hay:0,fields:[{kind:'wheat',age:1}]},compile:()=>[['harvest',''],['harvest','']],ensureWorkers(){},note(){},refresh(){},burst(){},advance(){},persist(){throw Error('obsolete run must not save')},setTimeout:fn=>waits.push(fn),challenges:[],announce(){}};
vm.createContext(c);vm.runInContext(html.slice(a,b),c);
(async()=>{const pending=elements.run.onclick();assert.equal(c.game.hay,1);c.runVersion++;c.game={size:1,hay:100,fields:[{kind:'wheat',age:1}]};waits.shift()();await pending;assert.equal(c.game.hay,100);assert.equal(c.game.fields[0].age,1);console.log('PASS Harvest Protocol: an old run cannot harvest or save after farm reset');})().catch(e=>{console.error(e);process.exitCode=1});
