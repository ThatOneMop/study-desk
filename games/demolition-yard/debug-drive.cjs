const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {JSDOM}=require('jsdom'),dom=new JSDOM(fs.readFileSync(path.join(__dirname,'index.html'),'utf8'),{runScripts:'outside-only',url:'https://study.test/games/demolition-yard/'}),w=dom.window;
w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:()=>()=>{}});w.requestAnimationFrame=()=>0;
w.eval(fs.readFileSync(path.join(__dirname,'game.js'),'utf8'));
const DY=w.DY;
console.log('contracts:', w.DemolitionYard.snapshot().total!==undefined?'ok':'?');
for(let lv=0;lv<7;lv++){
  const r=DY.run(lv);
  console.log(`L${lv} state=${r.state} cleared=${r.cleared}/${r.total} budget=${r.budget} elapsed=${r.elapsed.toFixed(1)} stars=${JSON.stringify(r.stars)}`);
  assert.equal(r.state,'won',`contract ${lv+1} solvable`);
  assert.equal(r.cleared,r.total);
  assert.ok(r.budget>=0);
}
const st=JSON.parse(w.localStorage.getItem('study.demolition.stars.v1')||'{}');
const rec=JSON.parse(w.localStorage.getItem('study.demolition.records.v1')||'{}');
console.log('saved stars:',JSON.stringify(st),'records keys:',Object.keys(rec).length);
assert.equal(Object.keys(st).length,7,'all seven contracts record stars');
console.log('DEBUG DRIVE PASS: 7 contracts solvable, stars saved.');
