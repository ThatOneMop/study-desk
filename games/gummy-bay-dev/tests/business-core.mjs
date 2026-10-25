import assert from 'node:assert/strict';import {productionPlan,commitProduction,validateSave,backupSlot} from '../dist/business-core.mjs';
const fresh=()=>({version:3,mode:'story',cash:400,bank:0,xp:0,day:1,time:540,x:0,z:0,room:true,bench:1,packStation:true,mixer:true,raw:Array(30).fill(0),gummies:Array(30).fill(0),packs:Array(30).fill(0),seeds:Array(30).fill(0),ingredients:[4,0,0,0],wrappers:4,deals:[],threads:{},plants:[],made:0,mixed:0});
let s=fresh();s.raw[0]=4;assert(commitProduction(s,{kind:'make',index:0,count:4},6,4).ok);assert.equal(s.raw[0],0);assert.equal(s.gummies[0],4);
let before=JSON.stringify(s);s.wrappers=3;before=JSON.stringify(s);assert(!commitProduction(s,{kind:'pack',index:0,count:4},6,4).ok);assert.equal(JSON.stringify(s),before);
s.wrappers=4;assert(commitProduction(s,{kind:'pack',index:0,count:4},6,4).ok);assert.equal(s.packs[0],4);assert.equal(s.wrappers,0);
s.threads[0]={messages:[]};s.deals=[{npc:0,t:0,qty:3,price:30}];before=JSON.stringify(s);assert(!commitProduction(s,{kind:'mix',index:0,count:4,ingredient:0},6,4).ok);assert.equal(JSON.stringify(s),before);
assert(commitProduction(s,{kind:'mix',index:0,ingredient:0},6,4).ok);assert.equal(s.packs[0],3);assert.equal(s.gummies[6],1);
const world={minX:-280,maxX:280,minZ:-500,maxZ:95};assert(validateSave(s,30,world).ok);let old=fresh();for(const k of ['raw','gummies','packs','seeds'])old[k]=old[k].slice(0,6);assert(validateSave(old,30,world).ok);
old.raw[0]=-1;assert(!validateSave(old,30,world).ok);assert(!validateSave({...s,house:99},30,world).ok);assert(!validateSave({...s,deals:[...s.deals,...s.deals]},30,world).ok);
assert(validateSave({...s,visits:{hardware:{count:2,lastDay:1,lastTime:550}}},30,world).ok);assert(!validateSave({...s,visits:[]},30,world).ok);assert(!validateSave({...s,visits:{hardware:{count:0,lastDay:1,lastTime:550}}},30,world).ok);assert(!validateSave({...s,visits:{hardware:{count:2,lastDay:1,lastTime:Infinity}}},30,world).ok);
let storage=new Map([['slot','original']]);backupSlot({getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v)},'slot');assert.equal(storage.get('slot'),'original');assert.equal(storage.get('slot-before-import'),'original');
assert.throws(()=>backupSlot({getItem:()=> 'original',setItem:()=>{throw Error('quota')}},'slot'));
for(const request of [{kind:'pack',index:-1},{kind:'make',index:0,count:Infinity},{kind:'mix',index:0,ingredient:99}])assert(!productionPlan(s,request,6,4).ok);
console.log('PASS: atomic batches, missing supplies, reservations, legacy arrays, invalid saves, duplicate orders, backup quota failure.');

let cancel=fresh();cancel.raw[0]=4;const snapshot=JSON.stringify(cancel);productionPlan(cancel,{kind:'make',index:0,count:4},6,4);assert.equal(JSON.stringify(cancel),snapshot);
