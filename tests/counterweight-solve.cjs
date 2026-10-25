'use strict';
const E=require('../games/counterweight/engine.js'),fs=require('node:fs');
const destinations=[[-2,2],[-2,2,-2,2],[-2,3,-3,2],[-2,2,-2,-2,2],[-2,2,-2,2,-2,2]];
function delivery(start,target){const q=[start],seen=new Set();for(let k=0;k<q.length;k++){const s=q[k],key=[s.x,s.y,s.ballast,s.sway,s.held,s.next].join(',');if(seen.has(key))continue;seen.add(key);if(s.next>start.next)return s;
// Preserve the original unrigged benchmark; cradle routes have separate fixtures.
for(const a of E.ACTIONS.filter(a=>a!=='rig')){if(a==='hook'&&s.held!==null&&s.x!==target)continue;const r=E.step(s,a);if(!r.ok||r.state.damage||r.state.strain)continue;q.push(r.state);}}throw Error('No route');}
const routes=destinations.map((bays,i)=>{let s=E.create(i);const deliveries=[];for(const b of bays){const n=s.history.length;s=delivery(s,b);deliveries.push(s.history.slice(n));}return {job:i,moves:s.moves,medals:E.medal(s),deliveries,actions:s.history};});
fs.writeFileSync(__dirname+'/fixtures/counterweight-routes.json',JSON.stringify(routes,null,2)+'\n');console.log(routes.map(r=>({job:r.job,moves:r.moves,medals:r.medals})));
