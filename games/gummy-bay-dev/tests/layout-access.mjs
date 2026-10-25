import assert from 'node:assert/strict';
import {findRoute,findReachableRoutes,createAccessAudit} from '../dist/workshop-logistics.mjs';
const bounds={minX:0,maxX:8,minZ:0,maxZ:8};
const tent=(x,z)=>Math.abs(x-3)<1.55&&Math.abs(z-3)<1.55;
const entrance={x:3,z:4.6},exit={x:3,z:7.5};
assert(tent(3,4.5),'fixture: nearest rounded node is inside tent');
const route=findRoute(exit,entrance,bounds,tent);
assert(route,'clear doorway edge can attach to another grid node');
assert.deepEqual(route[0],exit);assert.deepEqual(route.at(-1),entrance);
for(let i=1;i<route.length;i++){
 const p=route[i-1],q=route[i],n=Math.max(1,Math.ceil(Math.hypot(q.x-p.x,q.z-p.z)/.025));
 for(let j=0;j<=n;j++)assert(!tent(p.x+(q.x-p.x)*j/n,p.z+(q.z-p.z)*j/n));
}
const wall=(x,z)=>z>3.8&&z<4.2;
assert(findRoute(exit,{x:3,z:4.6},bounds,wall));
assert.equal(findRoute(exit,{x:3,z:1.4},bounds,wall),null,'rotating entrance across sealed wall is rejected');
const targets=[{x:1,z:7,label:'supply trolley'},{x:7,z:7,label:'stockroom'},{x:3,z:1.4,label:'tent 1 entrance'}];
const paths=findReachableRoutes(exit,targets,bounds,wall);
assert(paths[0]&&paths[1]&&!paths[2]);
let calls=0;const counted=(x,z)=>{calls++;return wall(x,z);};
const audit=createAccessAudit(),config={exit,targets,bounds,blocked:counted};
assert.deepEqual(audit('first',config),{ok:false,failed:'tent 1 entrance',checked:3});
const previous=calls;assert.strictEqual(audit('first',config),audit('first',config));assert.equal(calls,previous,'unchanged preview uses cached audit');
assert(audit('geometry changed',{...config,blocked:()=>false}).ok,'changed geometry invalidates cache');
for(const point of [{x:NaN,z:0},{x:-1,z:0},{x:9,z:2}])assert.equal(findRoute(exit,point,bounds,()=>false),null);
assert.equal(findRoute(exit,entrance,bounds,()=>false,0),null);
assert.equal(findRoute(exit,entrance,{minX:0,maxX:10000,minZ:0,maxZ:10000},()=>false),null);
assert.equal(findRoute(exit,entrance,bounds,()=>true),null);
console.log('PASS: doorway-edge routes, rotated entrances, multi-target connectivity, bounded grids, sampled collision clearance and unchanged-preview cache.');
