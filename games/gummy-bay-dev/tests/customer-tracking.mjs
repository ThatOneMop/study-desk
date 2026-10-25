import assert from 'node:assert/strict';
import {customerTrackStatus,projectTrackedCustomer} from '../dist/town-experience.mjs';

assert.equal(customerTrackStatus(),'waiting');
assert.equal(customerTrackStatus({moving:true}),'on the move');
assert.equal(customerTrackStatus({blocked:true,moving:true}),'route delayed');
assert.equal(customerTrackStatus({guest:true,connected:false,blocked:true,moving:true}),'last known · reconnect');
assert.equal(customerTrackStatus({guest:true,connected:true,moving:true}),'on the move');

const customers=[{name:'Jules',x:-140,z:-320},{name:'Benji',x:80,z:-100}],track={x:10,z:10,label:'Jules',npc:0};
const before=JSON.stringify([customers,track]);
assert.deepEqual(projectTrackedCustomer(track,customers,{moving:true}),{x:-140,z:-320,label:'Jules',npc:0,type:'customer',status:'on the move'});
assert.deepEqual(projectTrackedCustomer(track,customers,{guest:true,connected:false}),{x:-140,z:-320,label:'Jules',npc:0,type:'customer',status:'last known · reconnect'});
assert.equal(projectTrackedCustomer({...track,npc:-1},customers),null);
assert.equal(projectTrackedCustomer({...track,npc:2},customers),null);
assert.equal(projectTrackedCustomer({...track,npc:1.5},customers),null);
assert.equal(projectTrackedCustomer({...track,npc:1},[{x:0,z:0},{x:Infinity,z:0}]),null);
assert.equal(projectTrackedCustomer(null,customers),null);
assert.equal(JSON.stringify([customers,track]),before);
console.log('PASS: moving, waiting, blocked and disconnected customer tracking projects immutable finite last-known positions without clearing or inventing routes.');
