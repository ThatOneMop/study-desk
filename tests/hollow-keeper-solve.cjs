// Finite search for authored defense fixtures. Never change scores/maps to hide a regression.
const E=require('../games/hollow-keeper/engine.js'),fs=require('fs');
function doAction(s,a){const r=E.step(s,a);return r.ok?r.state:null;}
function wave(s){s=doAction(s,{type:'launch'});for(let i=0;i<100&&s?.phase==='defend';i++)s=doAction(s,{type:'tick'});return s;}
const routes=[];
for(let chapter=0;chapter<5;chapter++){let base=E.create(chapter);if(chapter>=3)for(const cell of [25,43])base=doAction(base,{type:'dig',cell});if(!base)throw Error('Invalid terrain sketch');const cells=base.tiles.map((_,c)=>c).filter(c=>E.walk(base,c)&&!base.starts.includes(c)&&base.nest!==c);let winner;
outer:for(const x of cells)for(const y of cells){if(x===y)continue;let s=base;for(const a of [{type:'trap',cell:x},{type:'upgrade',cell:x},{type:'trap',cell:y}])s=doAction(s,a);s=wave(s);if(!s||s.phase!=='prep'||s.health!==3)continue;for(const z of cells.filter(c=>c!==x&&c!==y)){let t=doAction(s,{type:'upgrade',cell:y});t=doAction(t,{type:'trap',cell:z});t=wave(t);if(t?.phase==='won'&&t.health===3){winner=t;break outer;}}}
if(!winner)throw Error('No perfect defense for '+chapter);routes.push({chapter,actions:winner.history});console.log(chapter,E.medal(winner),winner.history.length,'decisions',winner.traps.map(t=>t.cell+':'+t.level),'edits',winner.edits);}
fs.writeFileSync(__dirname+'/fixtures/hollow-keeper-routes.json',JSON.stringify(routes,null,2)+'\n');
