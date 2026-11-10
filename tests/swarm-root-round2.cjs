const assert=require('node:assert/strict'),fs=require('node:fs'),{JSDOM}=require('jsdom');
const P=require('../games/prism-post/engine.js'),O=require('../games/orbit-orchard/engine.js');
assert.equal(P.routes.length,16);
for(let i=8;i<P.routes.length;i++){
 const l=P.level(i);assert(!P.trace(l).won);l.mirrors.forEach(m=>m.value=m.solution);assert(P.trace(l).won,`night route ${i+1} solvable`);
}
let s=O.create();s.angle=0;s.spawn=10;
assert(O.pulse(s));assert(!O.pulse(s),'cannot spam a pulse');
s.items=[{angle:.35,r:.785,speed:.3,hazard:false,checked:false},{angle:0,r:.785,speed:.3,hazard:true,checked:false}];
O.step(s,.05);assert.equal(s.fruit,1,'pulse widens catch arc');assert.equal(s.shield,3,'pulse wards thorn');assert(s.events.includes('ward'));
for(let i=0;i<15;i++)O.step(s,.05);assert.equal(s.pulse,0);assert(!O.pulse(s),'ward expires before cooldown');
s.items=[{angle:0,r:.785,speed:.3,hazard:true,checked:false}];O.step(s,.05);assert.equal(s.shield,2,'ordinary damage resumes');
for(let i=0;i<120;i++)O.step(s,.05);assert(O.pulse(s),'pulse recharges');s.state='lost';assert(!O.pulse(s),'finished games reject pulse');
function load(id,setup){const dom=new JSDOM(fs.readFileSync(`games/${id}/index.html`,'utf8'),{url:'https://test.example/',runScripts:'outside-only',pretendToBeVisual:true});const w=dom.window;w.requestAnimationFrame=()=>0;w.HTMLCanvasElement.prototype.getContext=()=>({});setup?.(w);for(const file of ['engine.js','game.js'])w.eval(fs.readFileSync(`games/${id}/${file}`,'utf8'));return dom;}
let dom=load('prism-post',w=>w.localStorage.setItem('prism-post.v1',JSON.stringify({open:12,stamps:{7:2,10:1}}))),d=dom.window.document;
assert.equal(d.querySelector('#levels').children.length,16);assert(!d.querySelector('#levels').children[12].disabled);d.querySelector('#levels').children[12].click();assert.match(d.querySelector('#chapter').textContent,/13 \/ 16/);assert.match(d.querySelector('#name').textContent,/Night shift/);dom.window.close();
dom=load('orbit-orchard');d=dom.window.document;d.querySelector('#start').click();assert(!d.querySelector('#pulse').disabled);d.querySelector('#pulse').click();assert(d.querySelector('#pulse').disabled);assert.match(d.querySelector('#feedback').textContent,/Harvest pulse/);d.querySelector('#pause').click();assert(d.querySelector('#pulse').disabled);dom.window.close();
console.log('PASS round2: sixteen solvable Prism routes and compatible late unlocks; orbital pulse catch/ward/cooldown/expiry and UI');
