import assert from 'node:assert/strict';
import {deliveryRound} from '../dist/delivery-round.mjs';

const people=Object.freeze([{x:30,z:0},{x:4,z:0},{x:8,z:0},{x:12,z:0}].map(Object.freeze));
const state={day:2,time:60,packs:[2,1],npcs:[{x:3,z:4}],deals:[
 {npc:0,t:0,qty:2,price:15,due:1540},
 {npc:1,t:1,qty:2,price:20,due:1510},
 {npc:2,t:1,qty:2,price:25,due:1500}
]};
const before=JSON.stringify(state),round=deliveryRound(state,people,{x:0,z:0});
assert.equal(round.rows.length,3);assert.equal(round.readyCount,1);assert.equal(round.waitingCount,2);
assert.equal(round.next.npc,0,'ready order wins over earlier but incomplete commitments');
assert.equal(round.next.action,'deliver');assert.equal(round.next.distance,5,'accepted moving customer position is used');
assert.equal(round.next.minutesLeft,40);assert.equal(round.next.urgency,'soon');
assert.equal(round.rows.find(r=>r.npc===2).missing,1,'deadline-first allocation protects the earliest promise');
assert.equal(round.rows.find(r=>r.npc===1).missing,2);assert.equal(JSON.stringify(state),before,'planner is read-only');
assert(Object.isFrozen(round)&&Object.isFrozen(round.rows)&&round.rows.every(Object.isFrozen)&&Object.isFrozen(round.next));

const tied={day:1,time:100,packs:[8],deals:[{npc:0,t:0,qty:1,price:1,due:200},{npc:1,t:0,qty:1,price:1,due:200},{npc:2,t:0,qty:1,price:1,due:190}]};
assert.equal(deliveryRound(tied,people,{x:0,z:0}).next.npc,2,'earliest deadline is recommended');
delete tied.deals[2].due;assert.equal(deliveryRound(tied,people,{x:0,z:0}).next.npc,1,'equal deadline falls back to nearest customer');
const short={day:1,time:100,packs:[0,0],deals:[{npc:0,t:0,qty:4,price:1,due:150},{npc:1,t:1,qty:1,price:1,due:180}]};
assert.equal(deliveryRound(short,people,{x:0,z:0}).next.action,'prepare');assert.equal(deliveryRound(short,people,{x:0,z:0}).next.npc,1,'smallest missing batch is prepared first');
assert.equal(deliveryRound({deals:[]},people).next,null);assert.equal(deliveryRound({deals:null},people).rows.length,0);
assert.equal(deliveryRound(null,null,null).rows.length,0,'hostile containers safely become an empty plan');

const hostile=[null,{npc:-1,t:0,qty:1,price:1},{npc:8,t:0,qty:1,price:1},{npc:0,t:9,qty:1,price:1},{npc:0,t:0,qty:0,price:1},{npc:0,t:0,qty:41,price:1},{npc:0,t:0,qty:1,price:NaN},{npc:0,t:0,qty:1,price:1,due:NaN}];
assert.equal(deliveryRound({packs:[5],deals:hostile},people).rows.length,0,'hostile orders are ignored');
assert.equal(deliveryRound({packs:[5],deals:[{npc:0,t:0,qty:1,price:1},{npc:0,t:0,qty:1,price:1}]},people).rows.length,1,'duplicate customer commitments cannot steer the planner');
const fallback=deliveryRound({day:1,time:0,packs:[1],npcs:[{x:Infinity,z:0}],deals:[{npc:0,t:0,qty:1,price:2,due:20}]},people,{x:NaN,z:0});
assert.equal(fallback.next.distance,30);assert.equal(fallback.next.urgency,'urgent');
console.log('PASS: immutable delivery round prioritises ready deadline/distance, deadline-safe stock allocation, current customer positions, practical packing fallback and hostile-input rejection.');
