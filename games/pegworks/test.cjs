/* Run with jsdom available on NODE_PATH. Seeded physical campaign checks. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {JSDOM}=require('jsdom');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const code=fs.readFileSync(path.join(__dirname,'game.js'),'utf8');
function open(seed){
 const dom=new JSDOM(html,{runScripts:'outside-only',url:'https://study.test/games/pegworks/'}),w=dom.window;
 let randomState=seed>>>0;
 w.Math.random=()=>((randomState=(Math.imul(randomState,1664525)+1013904223)>>>0)/4294967296);
 w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:()=>()=>{}});
 w.requestAnimationFrame=()=>0;
 w.eval(code);
 return {w,g:w.Pegworks};
}
function finishShot(g){
 for(let i=0;i<2000&&g.snapshot().state==='flight';i++)g.step(1/120);
 assert.notEqual(g.snapshot().state,'flight','Every marble settles within the shot time limit');
}
function campaign(w,g,seed){
 const picks=[];
 for(let attempts=0;attempts<40&&!['won','lost'].includes(g.snapshot().state);attempts++){
  if(g.snapshot().state==='perk'){
   const options=[...w.document.querySelectorAll('#choices button')];
   assert.equal(options.length,3);
   const find=name=>options.find(b=>b.textContent.includes(name));
   const heal=find('Repair kit')||find('Warm bearings'),heavy=find('Heavy glass'),spare=find('Spare marble');
   // Repair when hurt, otherwise improve damage. Keep one spare-marble
   // upgrade when damage is absent; later spares cannot replace health.
   const choice=g.snapshot().hp<38 ? heal||heavy||spare : heavy||(!picks.includes('Spare marble')?spare:null)||heal||spare;
   assert.ok(choice,'Every perk screen offers a usable choice');
   picks.push(choice.querySelector('strong').textContent);
   choice.click();
  }
  if(g.snapshot().state==='aim'){g.launch();finishShot(g);}
 }
 assert.equal(g.snapshot().state,'won',`Legal aim/repair strategy completes six shifts with seed ${seed}; choices: ${picks.join(', ')}`);
 assert.equal(g.snapshot().round,6);
 assert.equal(picks.length,5,'One upgrade is awarded between each pair of shifts');
 assert.ok(Number(w.localStorage.getItem('study.pegworks.best.v1'))>0,'Completed run records its score');
}
const primarySeed=14,{w,g}=open(primarySeed);
assert.equal(g.snapshot().state,'intro');g.start();const before=g.snapshot();g.launch();
assert.equal(g.snapshot().shots,before.shots-1);
w.document.getElementById('pause').click();const frozen=JSON.stringify(g.snapshot());
for(let i=0;i<120;i++)g.step(1/120);
assert.equal(JSON.stringify(g.snapshot()),frozen,'Pause freezes the marble');
w.document.getElementById('start').click();finishShot(g);
assert.ok(g.snapshot().score>0,'A real shot hits pegs and earns damage score');
assert.ok(g.snapshot().enemy<before.enemy,'Peg damage reaches the enemy');
campaign(w,g,primarySeed);
g.start();assert.equal(g.snapshot().round,1);assert.equal(g.snapshot().score,0);
assert.equal(g.snapshot().shots,4,'Restart resets upgrades and marbles');w.close();
const otherSeeds=[1,5,21,30,42,67,99,123,150];
for(const seed of otherSeeds){const {w,g}=open(seed);g.start();campaign(w,g,seed);w.close();}
console.log('Pegworks: pause, physical peg hits, upgrades, record, restart and six-shift victories across 10 fixed perk seeds passed.');
