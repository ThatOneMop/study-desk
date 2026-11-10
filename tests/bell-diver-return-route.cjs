const assert=require('node:assert/strict');
const E=require('../games/bell-diver/engine.js');
for(let level=0;level<3;level++)for(let pos=0;pos<35;pos++){
 if(E.layouts[level].rocks.includes(pos))continue;
 for(const cargo of [[],[1,4]])for(const fins of [0,1]){
  const s={...E.create(),level,pos,cargo,fins,air:100};const r=E.returnRoute(s);
  if(level===2&&pos===10){assert.equal(r.air,Infinity);assert.equal(r.safe,false);assert.deepEqual(r.path,[]);continue}
  assert(Number.isFinite(r.air));let at=pos,cost=0;
  for(const next of r.path){assert(E.adjacent(at,next));assert(!E.layouts[level].rocks.includes(next));
   const dir=Object.keys(E.DIRS).find(d=>at+E.DIRS[d]===next);cost+=E.cost(s,dir);at=next;
  }
  assert.equal(at,2);assert.equal(cost,r.air);assert(r.safe);
  if(r.air){assert(!E.returnRoute({...s,air:r.air-1}).safe);assert(E.returnRoute({...s,air:r.air}).safe)}
 }
}
console.log('Return routes: all three wrecks, every open cell, heavy/light bags and fins pass');
