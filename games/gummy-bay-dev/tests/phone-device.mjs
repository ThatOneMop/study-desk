import assert from 'node:assert/strict';
import {PHONE_SCREENS,phoneDeviceStatus} from '../dist/phone-device.mjs';

assert(Object.isFrozen(PHONE_SCREENS));assert.deepEqual(Object.keys(PHONE_SCREENS),['phone','thread','listing','deals','wallet','contacts']);
const local=phoneDeviceStatus({day:3,time:547},{role:'solo',connected:false},'phone');
assert.deepEqual(local,{model:'GBM-04',carrier:'COASTLINE CELL',screen:'MESSAGES',day:3,clock:'09:07',link:'LOCAL',signal:2});assert(Object.isFrozen(local));
assert.deepEqual(phoneDeviceStatus({day:2,time:1439},{role:'host',connected:true},'deals'),{model:'GBM-04',carrier:'COASTLINE CELL',screen:'DELIVERY ROUND',day:2,clock:'23:59',link:'LINK HOST',signal:4});
assert.equal(phoneDeviceStatus({}, {role:'guest',connected:false},'wallet').link,'LINK LOST');assert.equal(phoneDeviceStatus({}, {role:'guest',connected:false},'wallet').signal,0);
assert.equal(phoneDeviceStatus({}, {role:'guest',connected:true},'thread').link,'LINK GUEST');
assert.equal(phoneDeviceStatus(null,null,'listing').clock,'00:00');assert.equal(phoneDeviceStatus({day:-9,time:Infinity},{role:'owner',connected:true},'phone').day,1);
assert.equal(phoneDeviceStatus({day:1,time:540},{},'contacts').screen,'CONTACTS');
assert.equal(phoneDeviceStatus({}, {},'map'),null,'non-phone screens do not receive a device shell');
assert.equal(phoneDeviceStatus({}, {},'toString'),null,'prototype names cannot become screens');
console.log('PASS: immutable fictional GBM-04 status covers six functional screens, bounded day/time and honest solo, linked and lost-network states.');
