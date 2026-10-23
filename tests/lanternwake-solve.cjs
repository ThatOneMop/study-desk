// Deterministic beam search for clean authored crossings, not an optimality proof.
const E=require('../games/lanternwake/engine.js'),fs=require('fs');
function solve(v){let beam=[E.create(v)],seen=new Map(),maps={};const ds=p=>maps[p]||(maps[p]=E.distances(v,p));const jars=E.points(v,'J'),dock=E.points(v,'D')[0];
 const key=s=>JSON.stringify([s.boat,s.oil,s.jars.slice().sort(),s.refuges.slice().sort(),s.moths,s.beacons]);
 const score=s=>{const left=jars.filter(p=>!s.jars.includes(p));let p=s.boat,total=0;while(left.length){left.sort((a,b)=>ds(p)[a]-ds(p)[b]);const q=left.shift();total+=ds(p)[q];p=q;}total+=ds(p)[dock];return s.turn+total*1.5+s.throws*.4-s.oil*.2;};
 for(let depth=0;depth<70;depth++){let next=[];for(const s of beam)for(const a of E.ACTIONS){const r=E.step(s,a);if(!r.ok||r.state.hits||r.state.status==='lost')continue;const n=r.state;if(n.status==='won')return n;const k=key(n);if((seen.get(k)??Infinity)<=n.turn)continue;seen.set(k,n.turn);next.push(n);}next.sort((a,b)=>score(a)-score(b));beam=next.slice(0,1200);if(!beam.length)break;}
 throw Error('No clean route for '+v);
}
const routes=E.VOYAGES.map((_,v)=>{const s=solve(v);console.log(v,s.turn,s.throws,E.medal(s),s.history.join(' '));return {voyage:v,actions:s.history,turns:s.turn,throws:s.throws};});fs.writeFileSync(__dirname+'/fixtures/lanternwake-routes.json',JSON.stringify(routes,null,2)+'\n');
