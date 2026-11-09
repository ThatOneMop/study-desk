'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../games/bell-diver/engine.js'),O=require('../games/outbreak-atlas/model.js');
test('Bell Diver return guide navigates all wrecks with light/heavy cargo and both fins states',()=>{
 for(let level=0;level<3;level++)for(let pos=0;pos<35;pos++)for(const fins of [0,1])for(const cargo of [[],[0,1]]){
  if(E.layouts[level].rocks.includes(pos))continue;
  const s={...E.create(),level,pos,fins,cargo,air:34,tank:2};
  const before=JSON.stringify(s),route=E.returnRoute(s);if(level===2&&pos===10){assert.equal(route,null);continue;}assert.ok(route);assert.equal(JSON.stringify(s),before);
  let p=pos,air=0;for(const step of route.path){assert.equal(p+E.DIRS[step.dir],step.pos);assert.ok(E.adjacent(p,step.pos));assert.ok(!E.layouts[level].rocks.includes(step.pos));air+=E.cost(s,step.dir);p=step.pos;}
  assert.equal(p,2);assert.equal(air,route.air);
  assert.equal(E.returnRoute({...s,air:Math.max(0,air-1)}).safe,air===0);
  assert.equal(E.returnRoute({...s,air}).safe,true);
 }
 const heavy={...E.create(),pos:7,cargo:[0,1],air:1};assert.equal(E.returnRoute(heavy).air,2);assert.equal(E.returnRoute(heavy).safe,false);
});
test('Outbreak purchase forecast uses identical seeded months and never mutates progress',()=>{
 let s=O.create({seed:17});s.points=20;for(let i=0;i<7;i++)s=O.step(s);
 const before=JSON.stringify(s),preview=O.upgradePreview(s,'footpaths','bramble');assert.ok(preview.spread>0);assert.equal(JSON.stringify(s),before);
 const baseline=O.step(s),bought=O.step(O.buy(s,'footpaths').state);
 assert.equal(preview.selected,(bought.lands.bramble.mark-baseline.lands.bramble.mark)*100);
 assert.equal(preview.awareness,(bought.talk-baseline.talk)*100);
 assert.equal(O.upgradePreview({...s,points:0},'footpaths','bramble'),null);
 assert.equal(O.upgradePreview(s,'carts','bramble'),null);
});
test('Gummy Bay tent guidance reflects real supply and growth gates without modifying a save',async()=>{
 const {stationReadiness:hint}=await import('../games/gummy-bay/station-readiness.mjs');
 const s={room:true,tents:1,installed:[0],soil:1,plants:[],can:true,water:2,trimmers:true};const before=JSON.stringify(s);
 assert.equal(hint('tent',s,0).ready,true);
 assert.match(hint('tent',{...s,soil:0},0).text,/buy soil/);
 assert.match(hint('tent',{...s,installed:[]},0).text,/install/);
 assert.equal(hint('tent',{...s,plants:[{phase:'dry'}]},0).ready,true);
 assert.match(hint('tent',{...s,water:0,plants:[{phase:'thirsty'}]},0).text,/refill/);
 assert.equal(hint('tent',{...s,trimmers:false,plants:[{phase:'mature'}]},0).ready,false);
 assert.equal(hint('tent',{...s,plants:[{phase:'growing',end:3000,waterings:1}]},0,1000).text,'Growing · 2s until next watering');
 assert.equal(JSON.stringify(s),before);
});

test('Bell Diver UI updates the direct-return warning and trail with cargo',()=>{
 const fs=require('node:fs'),{JSDOM}=require('jsdom'),path=require('node:path'),root=path.join(__dirname,'..');
 const dom=new JSDOM(fs.readFileSync(path.join(root,'games/bell-diver/index.html'),'utf8'),{url:'https://example.test/games/bell-diver/',runScripts:'outside-only',pretendToBeVisual:true});
 const w=dom.window;
 w.localStorage.setItem(E.KEY,JSON.stringify({...E.create(),pos:7,air:1,cargo:[0,1]}));
 w.eval(fs.readFileSync(path.join(root,'games/bell-diver/engine.js'),'utf8'));
 w.eval(fs.readFileSync(path.join(root,'games/bell-diver/game.js'),'utf8'));
 assert.match(w.document.getElementById('returnInfo').textContent,/needs 2 air; you have 1/);
 assert.ok(w.document.getElementById('returnInfo').classList.contains('low-air'));
 assert.ok(w.document.getElementById('cell-2').classList.contains('home-route'));
 w.document.getElementById('up').click();
 assert.match(w.document.getElementById('returnInfo').textContent,/At the bell/);
 assert.equal(JSON.parse(w.localStorage.getItem(E.KEY)).rescues,1);
 dom.window.close();
});
test('Outbreak upgrade UI previews costs without purchasing and refreshes after buying',()=>{
 const fs=require('node:fs'),{JSDOM}=require('jsdom'),path=require('node:path'),root=path.join(__dirname,'..');
 const dom=new JSDOM(fs.readFileSync(path.join(root,'games/outbreak-atlas/index.html'),'utf8'),{url:'https://example.test/games/outbreak-atlas/',runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window;
 w.requestAnimationFrame=()=>1;w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:()=>()=>{}});
 for(const file of ['model.js','game.js'])w.eval(fs.readFileSync(path.join(root,'games/outbreak-atlas',file),'utf8'));
 w.document.getElementById('begin').click();
 const before=w.localStorage.getItem('outbreak-atlas-v1');
 w.document.querySelector('[data-upgrade="footpaths"]').click();
 assert.match(w.document.getElementById('treePreview').textContent,/Next-month difference/);
 assert.match(w.document.getElementById('treePreview').textContent,/Hearthlow infection/);
 assert.equal(w.localStorage.getItem('outbreak-atlas-v1'),before);
 w.document.getElementById('buyUpgrade').click();
 assert.match(w.document.getElementById('treePreview').textContent,/Owned/);
 assert.doesNotMatch(w.document.getElementById('treePreview').textContent,/Next-month difference/);
 assert.ok(JSON.parse(w.localStorage.getItem('outbreak-atlas-v1')).owned.includes('footpaths'));
 w.close();
});
