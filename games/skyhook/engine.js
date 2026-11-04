/* Original Study Desk game. MIT license. */
(function(root){'use strict';
const KEY='study-desk-skyhook-v1',clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function create(seed=1,records={}){return {v:1,seed,job:0,x:90,rope:100,angle:0,omega:0,moves:0,bumps:0,phase:'lift',records:{...records},last:'Cargo attached. Retract the cable before crossing the warehouse.'}}
const target=s=>410+(s.seed*17+s.job*43)%130;
const position=s=>({x:s.x+Math.sin(s.angle)*s.rope,y:65+Math.cos(s.angle)*s.rope});
function act(s,a){let n=structuredClone(s);if(a==='restart')return create(s.seed,s.records);if(a==='next'&&s.phase==='won')return create(s.seed+1,s.records);if(s.phase!=='lift')return null;
if(a==='left'||a==='right'){let dx=a==='left'?-20:20;let x=clamp(s.x+dx,50,590);if(x===s.x)return null;n.x=x;n.omega=clamp(n.omega-dx/s.rope*1.7,-8,8);n.moves++}
else if(a==='up'||a==='down'){n.rope=clamp(s.rope+(a==='up'?-20:20),80,240);if(n.rope===s.rope)return null;n.moves++}
else if(a==='drop'){let p=position(s);if(Math.abs(p.x-target(s))>26||s.rope<200||Math.abs(s.omega*s.rope)>18){n.bumps++;n.last='Returned to dock: align over the berth, lower to 200+, and wait for gentle sway.';n.x=90;n.rope=100;n.angle=n.omega=0;return n}n.job++;n.last='Soft landing! Next load attached at the dock.';n.x=90;n.rope=100;n.angle=n.omega=0;if(n.job===3){n.phase='won';let score=n.moves+n.bumps*12;n.records[n.seed]=Math.min(n.records[n.seed]??Infinity,score);n.last='Shift complete. Three safe deliveries; your handling score is saved.'}}
else return null;return n}
function step(s,dt){if(s.phase!=='lift')return s;let n={...s};dt=clamp(dt,0,.025);n.omega+=(-9.81/Math.max(1,n.rope/50)*Math.sin(n.angle)-2.3*n.omega)*dt;n.angle=clamp(n.angle+n.omega*dt,-.8,.8);let p=position(n);if(p.x>194&&p.x<331&&p.y+28>195+Math.min(40,Math.abs(p.x-262)*40/62)){n={...n,x:90,rope:100,angle:0,omega:0,bumps:n.bumps+1,last:'Roof contact. Cargo returned safely: retract to 160 or less to cross.'}}return n}
function decode(raw){const s=JSON.parse(raw);if(!s||s.v!==1||!Number.isInteger(s.seed)||s.seed<1||s.seed>100000||!Number.isInteger(s.job)||s.job<0||s.job>3||!['lift','won'].includes(s.phase)||(s.phase==='won')!==(s.job===3)||!s.records||Array.isArray(s.records)||typeof s.records!=='object')throw Error('save');for(const [k,min,max] of [['x',50,590],['rope',80,240],['angle',-.8,.8],['omega',-10,10],['moves',0,1000000],['bumps',0,1000000]])if(!Number.isFinite(s[k])||s[k]<min||s[k]>max)throw Error('save');for(const [k,v] of Object.entries(s.records))if(!/^\d+$/.test(k)||!Number.isInteger(v)||v<0)throw Error('records');return s}
const E={KEY,create,target,position,act,step,decode};if(typeof module!=='undefined')module.exports=E;root.Skyhook=E;
})(typeof globalThis!=='undefined'?globalThis:this);
