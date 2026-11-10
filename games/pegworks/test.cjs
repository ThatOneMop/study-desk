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
const seen={split:false,telegraph:false,armored:false,splitter:false,boss:false,crit:false,pierce:false,minions:false};
function campaign(w,g,seed){
 const picks=[];
 for(let attempts=0;attempts<60&&!['won','lost'].includes(g.snapshot().state);attempts++){
  const s=g.snapshot();
  if(s.enemyType==='armored')seen.armored=true;
  if(s.enemyType==='splitter')seen.splitter=true;
  if(s.enemyType==='boss')seen.boss=true;
  if(s.telegraph)seen.telegraph=true;
  if(s.split&&s.minions.length===2)seen.split=true;
  if(s.crit>0)seen.crit=true;
  if(s.pierce>0)seen.pierce=true;
  if(s.state==='perk'){
   const options=[...w.document.querySelectorAll('#choices button')];
   assert.equal(options.length,6,'Each level-up offers six upgrade cards');
   for(const b of options){assert.ok(b.dataset.rarity,'Each upgrade card carries a rarity tier');assert.ok(/common|rare|epic/.test(b.dataset.rarity),'Rarity is one of the three tiers');}
   const find=name=>options.find(b=>b.textContent.includes(name));
   const heal=find('Repair kit')||find('Warm bearings');
   const pierceTaken=picks.filter(p=>p.includes('Sharp point')).length;
   // Repair when hurt; otherwise take a couple of piercing picks for the
   // armoured mid-shifts, then raw damage, crits and spare marbles.
   const choice=s.hp<42 ? heal||find('Heavy glass')||find('Sharp point')
     : (pierceTaken<2?find('Sharp point'):null)||find('Heavy glass')||find('Crit lens')||(!picks.includes('Spare marble')?find('Spare marble'):null)||heal||options[0];
   assert.ok(choice,'Every perk screen offers a usable choice');
   picks.push(choice.querySelector('strong').textContent);
   choice.click();
  }
  if(g.snapshot().state==='aim'){g.launch();finishShot(g);}
 }
 assert.equal(g.snapshot().state,'won',`Legal aim/upgrade strategy completes six shifts with seed ${seed}; choices: ${picks.join(', ')}`);
 assert.equal(g.snapshot().round,6);
 assert.equal(picks.length,5,'One upgrade is awarded between each pair of shifts');
 assert.ok(Number(w.localStorage.getItem('study.pegworks.best.v1'))>0,'Completed run records its score');
}
const primarySeed=14,{w,g}=open(primarySeed);
assert.equal(g.snapshot().state,'intro');g.start();
const opening=g.snapshot();
assert.equal(opening.enemyType,'basic','Shift one is a plain pest');
assert.equal(opening.telegraph,false);
g.launch();
assert.equal(g.snapshot().shots,opening.shots-1);
w.document.getElementById('pause').click();const frozen=JSON.stringify(g.snapshot());
for(let i=0;i<120;i++)g.step(1/120);
assert.equal(JSON.stringify(g.snapshot()),frozen,'Pause freezes the marble');
w.document.getElementById('start').click();finishShot(g);
assert.ok(g.snapshot().score>0,'A real shot hits pegs and earns damage score');
assert.ok(g.snapshot().enemy<opening.enemy,'Peg damage reaches the enemy');
campaign(w,g,primarySeed);
g.start();assert.equal(g.snapshot().round,1);assert.equal(g.snapshot().score,0);
assert.equal(g.snapshot().shots,4,'Restart resets upgrades and marbles');
assert.equal(g.snapshot().enemyType,'basic','Restart returns to the plain first pest');
assert.equal(g.snapshot().pierce,0,'Restart clears piercing upgrades');w.close();
const otherSeeds=[1,5,21,30,42,67,99,123,150];
for(const seed of otherSeeds){const {w,g}=open(seed);g.start();campaign(w,g,seed);w.close();}
assert.ok(seen.armored&&seen.splitter&&seen.boss,'The campaign meets armoured, splitter and mini-boss shifts');
assert.ok(seen.telegraph,'A mini-boss telegraphs its big attack before it lands');
assert.ok(seen.split,'A splitter cracks into two smaller pests when defeated');
assert.ok(seen.pierce,'An armour-piercing upgrade becomes available and is taken');
console.log('Pegworks: pause, physical peg hits, six-card rarity upgrades, armoured/splitter/mini-boss shifts, telegraph, split and six-shift victories across 10 fixed perk seeds passed.');
