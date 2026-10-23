// Deterministic beam search used to create replayable campaign fixtures, never in the game UI.
const E=require('../games/reefwright/engine.js'),fs=require('node:fs');
function fitness(s){const e=E.evaluate(s),g=E.STAGES[s.stage].goals;const progress=['coral','nursery','kelp'].reduce((n,k)=>n+Math.min(1,e[k]/g[k]),0);return progress*100+e.score+(e.met?200:0);}
const routes=[];
for(let stage=0;stage<5;stage++){
 let beam=[E.fresh(stage)],best=null;
 for(let round=0;round<8;round++){
  const byBoard=new Map();
  for(const s of beam)for(const m of E.legalMoves(s)){
   const next=E.place(s,m),key=E.board(next).join('');
   if(!byBoard.has(key))byBoard.set(key,{s:next,f:fitness(next)});
  }
  beam=[...byBoard.values()].sort((a,b)=>b.f-a.f).slice(0,24).map(v=>v.s);
  if(!beam.length)break;
  best=beam[0];
 }
 const s=E.finish(best),e=E.evaluate(s);
 console.log(E.STAGES[stage].name,JSON.stringify(e));
 if(!e.met)throw Error('No winning fixture found for '+stage);
 routes.push(s);
}
fs.writeFileSync('tests/fixtures/reefwright-routes.json',JSON.stringify(routes,null,2)+'\n');
