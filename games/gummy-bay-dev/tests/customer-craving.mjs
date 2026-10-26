import assert from 'node:assert/strict';
import {normalizeCravings,noteSale,effectiveLevel,cravingBudgetBonus,cravingAsk,markAsked,cravingState} from '../dist/customer-craving.mjs';

assert.deepEqual(normalizeCravings(undefined,5,30),{});
assert.deepEqual(normalizeCravings([1,2],5,30),{});
const dirty=normalizeCravings({0:{t:0,level:140,lastDay:2,lastTime:10},9:{t:0,level:10},1:{t:99,level:10},2:'nope',3:{t:1,level:-4,lastDay:1,lastTime:0}},5,30);
assert.deepEqual(Object.keys(dirty),['0','3']);
assert.equal(dirty[0].level,100);
assert.equal(dirty[3].level,0);
assert.equal(dirty[3].t,1);

let book={};
book=noteSale(book,0,0,1,1,600);
assert.equal(book[0].t,0);
assert.equal(book[0].level,18);
const stacked=noteSale(book,0,0,1,1,700);
assert.equal(stacked[0].level,36);
assert.equal(book[0].level,18);
let capped={0:{t:0,level:90,lastDay:1,lastTime:0,askedDay:null,askedTime:null}};
assert.equal(noteSale(capped,0,0,4,1,800)[0].level,100);

const loyal={0:{t:2,level:50,lastDay:1,lastTime:0,askedDay:3,askedTime:40}};
assert.equal(effectiveLevel(loyal[0],1),50);
assert.equal(effectiveLevel(loyal[0],2),38);
assert.deepEqual(loyal[0],{t:2,level:50,lastDay:1,lastTime:0,askedDay:3,askedTime:40});
assert.equal(effectiveLevel({t:0,level:48,lastDay:1},5),0);
const switched=noteSale(loyal,0,4,1,2,900);
assert.equal(switched[0].t,4);
assert.equal(switched[0].level,Math.floor(38*.4)+18);
assert.equal(switched[0].askedDay,3);
assert.equal(switched[0].askedTime,40);

assert.equal(cravingState(null,1),null);
assert.deepEqual(cravingState(loyal[0],2),{product:2,level:38,active:true,lastDay:1,lastTime:0,askedDay:3,askedTime:40});
assert.equal(cravingBudgetBonus(loyal[0],1,1),0);
assert.equal(cravingBudgetBonus(loyal[0],2,1),50*.0015);
assert.equal(cravingBudgetBonus({t:2,level:12,lastDay:1},2,2),0);

const mild={t:0,level:39,lastDay:1,lastTime:0,askedDay:null,askedTime:null};
const ready={t:0,level:40,lastDay:1,lastTime:0,askedDay:null,askedTime:null};
const hooked={t:0,level:80,lastDay:1,lastTime:0,askedDay:null,askedTime:null};
const open={day:1,time:600,hasDeal:false,threadStatus:'idle'};
assert.equal(cravingAsk(mild,open),null);
assert.equal(cravingAsk(ready,{...open,hasDeal:true}),null);
assert.equal(cravingAsk(ready,{...open,threadStatus:'negotiating'}),null);
assert.equal(cravingAsk(ready,{...open,threadStatus:'agreed'}),null);
assert.deepEqual(cravingAsk(ready,open),{t:0,qty:1,level:40});
assert.deepEqual(cravingAsk(hooked,open),{t:0,qty:2,level:80});
const marked=markAsked(ready,1,600);
assert.equal(cravingAsk(marked,{day:1,time:719,hasDeal:false,threadStatus:'sold'}),null);
assert.deepEqual(cravingAsk(marked,{day:1,time:720,hasDeal:false,threadStatus:'sold'}),{t:0,qty:1,level:40});
assert.equal(ready.askedDay,null);

console.log('PASS: craving normalize, sale memory, decay, budget bonus and ask gaps.');
