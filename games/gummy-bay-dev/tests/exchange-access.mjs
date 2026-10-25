import assert from 'node:assert/strict';
import {exchangeAccess,freshExchangePose} from '../dist/exchange-access.mjs';
const a={x:0,y:1.72,z:0},b={x:4.5,z:0},open=()=>false;
assert(exchangeAccess(a,b,open).ok);
assert(!exchangeAccess(a,{...b,x:4.5001},open).ok);
assert(!exchangeAccess(a,b,x=>x>1.05&&x<1.16).ok,'clear endpoints are not enough');
assert(!exchangeAccess(a,b,x=>x===0).ok,'embedded actor cannot hand over stock');
assert(!exchangeAccess(a,b,x=>x===4.5).ok,'embedded customer cannot hand over stock');
assert(!exchangeAccess({...a,y:3},b,open).ok);
assert(exchangeAccess({...a,y:2.02},b,open,()=>.3).ok);
assert(exchangeAccess({...a,y:1.12},b,open).ok,'crouching is still in reach');
for(const bad of [NaN,Infinity,-Infinity]){
 for(const key of ['x','y','z'])assert(!exchangeAccess({...a,[key]:bad},b,open).ok);
 assert(!exchangeAccess(a,{...b,x:bad},open).ok);
}
let probes=0;exchangeAccess(a,{x:1e12,z:0},()=>{probes++;return false});assert.equal(probes,0,'far input never launches unbounded ray work');
const before=JSON.stringify([a,b]);exchangeAccess(a,b,open);assert.equal(JSON.stringify([a,b]),before);
assert(freshExchangePose(a,b,100,2100)===false,'pose drift rejected');
assert(freshExchangePose(a,{x:3,z:0},100,2100),'inclusive time and displacement boundaries');
assert(!freshExchangePose(a,a,null,100));assert(!freshExchangePose(a,a,100,99));
assert(!freshExchangePose(a,a,100,2101));assert(!freshExchangePose({...a,x:NaN},a,100,200));
console.log('PASS: clear handoff range, wall/embedded/elevation rejection, crouch, finite/bounded immutable checks and fresh peer-pose time/displacement boundaries.');
