const test=require('node:test'),assert=require('node:assert/strict'),E=require('../games/moon-dial/engine.js'),solve=require('./moon-dial-routes.cjs');
test('all mechanisms solve through legal controls with exact saves and sequential unlocks',()=>{let s=E.create();for(let n=0;n<3;n++){s=E.act(s,n).state;const route=solve(n);console.log('mechanism',n,'actions',route.length);for(const a of route){const t=E.act(s,a);assert(t.ok);s=t.state;assert.deepEqual(E.decode(JSON.stringify(s)),s)}assert.equal(E.run(s).phase,'won');assert(s.records[n]>0)}assert.equal(E.unlocked(s),2)});
test('gears alternate directions and a clutch isolates only the selected edge',()=>{let r=E.fresh(0);r=E.step(r,{type:'turn',gear:0,dir:1});assert.deepEqual(r.angles,[3,3,2]);r=E.step(r,{type:'clutch',edge:0});r=E.step(r,{type:'turn',gear:0,dir:1});assert.deepEqual(r.angles,[4,3,2]);r=E.step(r,{type:'clutch',edge:1});r=E.step(r,{type:'turn',gear:0,dir:1});assert.deepEqual(r.angles,[5,2,2])});
test('undo restores clutch and angles; restart retains solved records',()=>{let s=E.create();const initial=E.run(s);s=E.act(s,{type:'clutch',edge:0}).state;s=E.act(s,'undo').state;assert.deepEqual(E.run(s),initial);for(const a of solve(0))s=E.act(s,a).state;const records=s.records.slice();s=E.act(s,'retry').state;assert.deepEqual(s.records,records);assert.equal(E.run(s).phase,'active')});
test('invalid moves are atomic and corrupt journals/locked levels are rejected',()=>{const s=E.create();assert.equal(E.act(s,2).ok,false);assert.equal(E.act(s,{type:'turn',gear:9,dir:1}).state,s);for(const mutate of [x=>x.history=['retry'],x=>x.history=[{type:'turn',gear:0,dir:0}],x=>x.level=2,x=>x.records=[null,3,null],x=>x.history=Array(401).fill({type:'turn',gear:0,dir:1})]){const a=E.create();mutate(a);assert.throws(()=>E.decode(JSON.stringify(a)))}assert.throws(()=>E.decode('null'));assert.throws(()=>E.decode('{bad'))});
test('selection persists, old saves migrate and changing to a smaller mechanism clamps it',()=>{const s=E.create();s.records=[3,4,5];s.level=2;s.selected=4;assert.deepEqual(E.decode(JSON.stringify(s)),s);assert.equal(E.act(s,0).state.selected,2);delete s.selected;assert.equal(E.decode(JSON.stringify(s)).selected,0);for(const selected of [-1,5,1.2,'1',null]){s.selected=selected;assert.throws(()=>E.decode(JSON.stringify(s)),/selected dial/)}});
test('optional guidance solves initial mechanisms with shortest action counts and no mutation',()=>{
 for(let level=0;level<3;level++){let s=E.create();s.records=[3,6,11];s.level=level;const before=JSON.stringify(s),path=E.route(s);assert.equal(path.length,[3,6,11][level]);assert.equal(JSON.stringify(s),before);for(const a of path){const t=E.act(s,a);assert(t.ok);s=t.state}assert.equal(E.run(s).phase,'won');assert.deepEqual(E.route(s),[])}
});
test('guidance recovers from varied legal detours rather than replaying a fixed solution',()=>{
 for(let level=0;level<3;level++)for(let seed=1;seed<=8;seed++){
  let s=E.create();s.records=[3,6,11];s.level=level;
  for(let i=0;i<seed+3;i++){s=E.act(s,{type:'clutch',edge:(seed+i)%(level+2)}).state;s=E.act(s,{type:'turn',gear:(seed*3+i)%(level+3),dir:i%2?1:-1}).state}
  const saved=JSON.stringify(s),route=E.route(s);assert.equal(JSON.stringify(s),saved);assert(route);
  for(const a of route){const t=E.act(s,a);assert(t.ok);s=t.state}assert.equal(E.run(s).phase,'won');
 }
});
