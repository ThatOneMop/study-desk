import assert from 'node:assert/strict';
import {COOP_PING_TTL,acceptCoopPing,coopPingStatus} from '../dist/coop-ping.mjs';

const world=Object.freeze({minX:-290,maxX:290,minZ:-455,maxZ:95}),remote=Object.freeze({x:12,z:-20});
const accepted=acceptCoopPing({type:'ping',seq:1,x:12,z:-20},remote,world,500,0,true);
assert.equal(accepted.ok,true);assert.deepEqual(accepted.ping,{x:12,z:-20,receivedAt:500,sequence:1});assert.ok(Object.isFrozen(accepted)&&Object.isFrozen(accepted.ping));
assert.equal(acceptCoopPing({type:'ping',seq:1,x:12,z:-20},remote,world,501,1,true).reason,'sequence');
assert.equal(acceptCoopPing({type:'ping',seq:2,x:21,z:-20},remote,world,501,1,true).reason,'pose');
assert.equal(acceptCoopPing({type:'ping',seq:2,x:13,z:-20},null,world,501,1,true).reason,'pose');
assert.equal(acceptCoopPing({type:'ping',seq:2,x:290.01,z:-20},remote,world,501,1,false).reason,'bounds');
assert.equal(acceptCoopPing({type:'ping',seq:2,x:12,z:-455},null,world,501,1,false).ok,true);
for(const bad of [NaN,Infinity,-Infinity,'12',null])assert.equal(acceptCoopPing({type:'ping',seq:2,x:bad,z:-20},remote,world,501,1,false).ok,false);
assert.equal(acceptCoopPing({type:'ping',seq:2,x:12,z:-20},remote,world,-1,1,false).reason,'clock');
const status=coopPingStatus(accepted.ping,{x:15,z:-16},500+1000);
assert.deepEqual(status,{active:true,distance:5,remainingSeconds:119});assert.ok(Object.isFrozen(status));
assert.deepEqual(coopPingStatus(accepted.ping,{x:15,z:-16},500+COOP_PING_TTL+1),{active:false,distance:null,remainingSeconds:0});
assert.equal(coopPingStatus({x:0,z:0,receivedAt:0},{x:0,z:0},0,0).active,false);
assert.deepEqual(remote,{x:12,z:-20});assert.deepEqual(world,{minX:-290,maxX:290,minZ:-455,maxZ:95});
console.log('PASS: bounded current-channel co-op ping validation, replay rejection, guest pose corroboration, expiry, finite status and immutable inputs.');
