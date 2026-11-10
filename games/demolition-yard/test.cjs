/* Run with jsdom available on NODE_PATH. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {JSDOM}=require('jsdom'),dom=new JSDOM(fs.readFileSync(path.join(__dirname,'index.html'),'utf8'),{runScripts:'outside-only',url:'https://study.test/games/demolition-yard/'}),w=dom.window;
w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:()=>()=>{}});w.requestAnimationFrame=()=>0;w.eval(fs.readFileSync(path.join(__dirname,'game.js'),'utf8'));const g=w.DemolitionYard;
assert.equal(g.snapshot().state,'intro');
for(let level=0;level<5;level++){
 g.setup(level,false);const initial=g.snapshot();g.use(850,50);assert.equal(g.snapshot().budget,initial.budget,'Empty air never costs budget');assert.ok(initial.blocks.every(b=>!b.falling),'Intact buildings start supported');
 const supports=initial.blocks.filter(b=>b.type==='post'&&b.y>470);
 for(const b of supports){if(g.snapshot().state==='won')break;g.use(b.x,b.y);for(let i=0;i<1000;i++)g.step(1/120);}
 const result=g.snapshot();assert.equal(result.state,'won',`Contract ${level+1} has a legal structural solution`);assert.equal(result.cleared,result.total);assert.ok(result.budget>=0);assert.ok(result.blocks.some(b=>b.falling),'Support removal produces a physical collapse');
}
g.setup(4,false);for(const crate of g.snapshot().blocks.filter(b=>b.target)){if(g.snapshot().state==='lost')break;g.use(crate.x,crate.y);for(let i=0;i<1000;i++)g.step(1/120);}assert.equal(g.snapshot().state,'lost','An inefficient sequence can exhaust the budget and reach a restartable failure');
assert.equal(Object.keys(JSON.parse(w.localStorage.getItem('study.demolition.records.v1'))).length,5,'Every completed contract saves its best refund');
g.setup(0,false);w.document.getElementById('pause').click();const frozen=JSON.stringify(g.snapshot());const target=g.snapshot().blocks[0];g.use(target.x,target.y);for(let i=0;i<120;i++)g.step(1/120);assert.equal(JSON.stringify(g.snapshot()),frozen,'Pause prevents demolition and movement');w.document.getElementById('start').click();g.setup(0,true);g.selectTool('heavy');for(const b of g.snapshot().blocks.filter(b=>b.type==='post'))g.use(b.x,b.y);assert.equal(g.snapshot().budget,60,'Practice does not spend the contract budget');
console.log('Demolition Yard: five solvable contracts, support cascades, free empty clicks, pause, practice and records passed.');
