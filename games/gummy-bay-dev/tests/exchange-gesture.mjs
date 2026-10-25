import assert from 'node:assert/strict';
import {EXCHANGE_GESTURE_MS,readExchangeReceipt,exchangeRequest,matchExchangeReceipt,exchangeGesturePose} from '../dist/exchange-gesture.mjs';
const sale={kind:'deliver',npc:0,t:29,qty:4},sample={kind:'sample',npc:4,t:0,qty:1};
assert.deepEqual(readExchangeReceipt({...sale,arbitrary:'stripped'},30),sale);
assert.deepEqual(readExchangeReceipt(sample,30),sample);
for(const invalid of [null,{},...['kind','npc','t','qty'].flatMap(k=>[undefined,NaN,Infinity,-1,1.5,'1'].map(v=>({...sale,[k]:v}))),{...sale,npc:5},{...sale,t:30},{...sale,qty:41},{...sample,qty:2}])assert.equal(readExchangeReceipt(invalid,30),null);
for(const count of [0,129,NaN,1.5])assert.equal(readExchangeReceipt(sale,count),null);
const state={deals:[{npc:0,t:29,qty:4}]},before=JSON.stringify(state);
assert.deepEqual(exchangeRequest({type:'action',k:'deliver',a:0},state,30),sale);
assert.deepEqual(exchangeRequest({type:'action',k:'sample',a:4,b:0},state,30),sample);
for(const message of [{type:'ack',k:'deliver',a:0},{type:'action',k:'deliver',a:1},{type:'action',k:'soil',a:0}])assert.equal(exchangeRequest(message,state,30),null);
assert.deepEqual(matchExchangeReceipt(sale,sale,0,30),sale);assert.deepEqual(matchExchangeReceipt(sale,sale,10000,30),sale);
for(const elapsed of [-1,10001,NaN,Infinity])assert.equal(matchExchangeReceipt(sale,sale,elapsed,30),null);
for(const mismatch of [{...sale,kind:'sample',qty:1},{...sale,npc:1},{...sale,t:0},{...sale,qty:3},null])assert.equal(matchExchangeReceipt(mismatch,sale,50,30),null);
assert.equal(JSON.stringify(state),before);
for(const elapsed of [-1,EXCHANGE_GESTURE_MS,Infinity,NaN])assert.equal(exchangeGesturePose(elapsed),null);
let previous=null;for(let elapsed=0;elapsed<EXCHANGE_GESTURE_MS;elapsed++){
 const pose=exchangeGesturePose(elapsed);assert.ok([pose.reach,pose.packScale].every(v=>Number.isFinite(v)&&v>=0&&v<=1));
 if(previous){assert.ok(Math.abs(pose.reach-previous.reach)<.006);assert.ok(pose.packScale<=previous.packScale);}
 previous=pose;
}
assert.equal(exchangeGesturePose(0).reach,0);assert.equal(exchangeGesturePose(0).packScale,1);
assert.ok(exchangeGesturePose(300).reach>.8);assert.equal(exchangeGesturePose(600).packVisible,false);
assert.ok(exchangeGesturePose(839).reach<.00002);
console.log('PASS: bounded immutable exchange receipts, exact pending-command match and freshness, rejected malformed/mismatched outcomes, finite continuous reach/release/return and fixed 840ms lifetime. No rendering or inventory mutation.');
