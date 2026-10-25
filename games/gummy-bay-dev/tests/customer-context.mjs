import assert from 'node:assert/strict';
import {customerVoice,customerReply,readCustomerReceipt,customerBrief,sampleChoices} from '../dist/customer-context.mjs';
const receipt={t:6,qty:2,total:90,day:3,time:570};
const s={day:3,time:600,packs:[3,0,0,0,0,0,2,1],deals:[{npc:0,t:0,qty:2,price:30,due:3530},{npc:1,t:6,qty:2,price:45,due:3520}],threads:{0:{lastSale:receipt}}};
const before=JSON.stringify(s),brief=customerBrief(s,0,30);
assert.deepEqual(brief.receipt,receipt);assert.equal(brief.order.minutesLeft,50);
assert.equal(brief.greeting,customerVoice(0).waiting);
assert.equal(customerBrief({...s,deals:[]},0,30).greeting,customerVoice(0).returning);
assert.equal(customerBrief({...s,threads:{},deals:[]},0,30).greeting,customerVoice(0).first);
assert.equal(customerBrief({...s,packs:[1]},0,30).order.missing,1);
assert.equal(readCustomerReceipt({},30),null);
for(const bad of [{...receipt,t:30},{...receipt,t:-1},{...receipt,qty:41},{...receipt,total:NaN},{...receipt,day:0},{...receipt,time:1440}])assert.equal(readCustomerReceipt({lastSale:bad},30),null);
const choices=sampleChoices(s,1);assert.deepEqual(choices,[{t:7,free:1,favourite:true},{t:0,free:1,favourite:false}]);
assert(!sampleChoices(s,0).some(q=>q.t===6),'promised favourite cannot be sampled');
assert.deepEqual(sampleChoices({packs:[1],deals:[{t:0,qty:2}]},0),[]);
for(const event of ['counter','agree','thanks']){
 const lines=Array.from({length:5},(_,i)=>customerReply(i,event,42,2));
 assert.equal(new Set(lines).size,5);assert(lines.every(t=>t.includes('$42')));
}
assert.equal(JSON.stringify(s),before,'all presentation helpers are read-only');
console.log('PASS: five distinct voices, receipt validation, returning/meeting greetings, commitments, preferred samples, reservations and read-only presentation.');
