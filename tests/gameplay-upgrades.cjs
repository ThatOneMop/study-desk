/* Regression coverage for the curated collection's new gameplay systems. */
const assert=require('node:assert/strict'),fs=require('fs'),vm=require('vm'),path=require('path'),{JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const clone=o=>JSON.parse(JSON.stringify(o));
const L=require('../games/little-lake/progression.js');
{
 let c=L.create(0),paid=0;
 for(let i=0;i<6;i++)paid+=L.record(c,0,i%3,i<2);
 assert.equal(paid,275);assert(c.claimed.every(Boolean));
 c=L.restore(clone(c));for(let i=0;i<12;i++)assert.equal(L.record(c,0,i%6,true),0,'claimed contracts cannot pay again after reload');
 const before=JSON.stringify(c);assert.equal(L.record(c,1,6,true),0);assert.equal(JSON.stringify(c),before,'wrong-area catches do not advance contracts');
 const legacy=L.restore(undefined,9);assert.equal(legacy.area,9);
 assert.equal(L.restore({...c,fish:[6999]},2).area,2,'invalid species are discarded');
 for(let i=0;i<100;i++){assert(L.roll('small',i/100)<=2);assert(L.roll('deep',i/100)>=3)}
 const next=L.create(0,1);assert.equal(next.catches,0);assert.equal(L.goals(next)[2].need,7);
}
const AHscript=[...read('games/after-hours/index.html').matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1]).find(s=>s.includes('const HANDS='));
const context={module:{exports:{}}};vm.runInNewContext(AHscript,context);const AH=context.module.exports,AHSave=require('../games/after-hours/save-store.js');
{
 const s=AH.newRun(91);assert(!AH.trim(s,s.hand[0].id),'no trimming during a blind');s.score=AH.target(s);AH.play(s,[s.hand[0].id]);s.money=50;
 const id=s.stock.find(x=>x.kind==='polish').id,cost=AH.trimCost(s);assert(AH.trim(s,id));assert.equal(s.money,50-cost);assert.equal(s.deck.length,51);assert(!s.deck.some(c=>c.id===id));assert(!s.hand.some(c=>c.id===id));assert(!s.pile.some(c=>c.id===id));assert(!s.stock.some(x=>x?.kind==='polish'&&x.id===id));assert(!AH.trim(s,s.deck[0].id),'one removal per visit');
 const restored=AHSave.parse(JSON.stringify(s),AH);assert.equal(restored.trimmed,true);assert.equal(restored.deck.length,51);assert(!AH.trim(restored,restored.deck[0].id));
 assert(AH.next(restored));assert(!restored.hand.some(c=>c.id===id));assert(AHSave.validate(restored,AH));
 const short=clone(restored);short.deck=short.deck.slice(0,19);assert.throws(()=>AHSave.validate(short,AH));
 const old=AH.newRun(5);delete old.trimmed;assert.equal(AHSave.validate(old,AH).deck.length,52);
}
const A=require('../games/ashwake/engine.js');
{
 const meta=A.createMeta(),run=A.startRun(meta,'warden',77);assert.equal(A.redraw(run).ok,false);run.player.xp=run.player.next;A.tick(run,{x:0,y:0},{w:960,h:540});assert.equal(run.phase,'level');
 const old=run.draft.map(c=>c.id);assert(A.redraw(run).ok);assert.equal(run.redraws,1);assert(run.draft.some(c=>!old.includes(c.id)),'offer changes');
 A.pause(run);const loaded=A.decode(A.encode({meta,run}));assert(loaded.ok);assert.equal(loaded.run.redraws,1);A.resume(loaded.run);assert.equal(loaded.run.phase,'level');assert.equal(loaded.run.draft.length,3,'a paused level-up keeps its cards after reload');
 assert(A.redraw(loaded.run).ok);assert.equal(loaded.run.redraws,0);assert(!A.redraw(loaded.run).ok);assert(A.choose(loaded.run,0).ok);
 const oldRun=A.startRun(meta,'warden',42);delete oldRun.redraws;assert.equal(A.decode(A.encode({meta,run:oldRun})).run.redraws,2);
 oldRun.redraws=99;assert(!A.decode(A.encode({meta,run:oldRun})).ok);
}
const E=require('../games/ratchet-run/engine.js');
{
 const old={version:1,current:{course:0,suspension:'soft',tape:[]},records:Array(5).fill(null)};assert.equal(E.decode(JSON.stringify(old)).records.length,8);assert.equal(E.unlocked(E.blank()),0);
 let book=E.blank();
 for(let course=0;course<E.COURSES.length;course++){
  let s=E.create(course),tape=[],jumped=new Set(),C=E.COURSES[course];
  function step(input){E.append(tape,input);s=E.step(s,input)}
  for(let n=0;n<12000&&s.phase==='ride';n++){
   let input=s.x>C.end-100?2:1;
   for(const [a] of C.gaps.concat(C.rough))if(s.ground&&s.x>=a-32&&s.x<a&&!jumped.has(a)){input|=16;jumped.add(a)}
   step(input);if(s.v<1&&s.x<C.end-45&&input===2)for(let k=0;k<10&&s.phase==='ride';k++)step(1);
  }
  assert.equal(s.phase,'won','course '+course+' is deliverable');assert(s.integrity>0);book=E.record(book,s,tape);assert.equal(E.replay(course,'soft',tape).phase,'won');assert.equal(E.decode(JSON.stringify(book)).records.filter(Boolean).length,course+1);
 }
 assert.equal(E.unlocked(book),7);const legacy=clone(book);legacy.records=legacy.records.slice(0,5);legacy.current={course:4,suspension:legacy.records[4].suspension,tape:legacy.records[4].tape};const migrated=E.decode(JSON.stringify(legacy));assert.equal(E.unlocked(migrated),5);assert.deepEqual(migrated.records.slice(0,5),legacy.records);
}
function domGame(name,probe,scripts=[]){
 const dom=new JSDOM(read('games/'+name+'/index.html'),{url:'https://test.example/games/'+name+'/',runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window;
 w.requestAnimationFrame=()=>1;w.scrollTo=()=>{};w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:(_,k)=>k==='createLinearGradient'||k==='createRadialGradient'?()=>({addColorStop(){}}):()=>{}});
 for(const script of scripts)w.eval(read('games/'+name+'/'+script));
 for(const script of w.document.querySelectorAll('script:not([src])'))w.eval(script.textContent+probe);
 return {w,d:w.document,$:id=>w.document.getElementById(id),close:()=>w.close()};
}
{
 const g=domGame('underleaf','\nwindow.test={get s(){return s},get ants(){return ants},tick,refresh,cost};',['save-store.js','recovery.js']),p=g.w.test;
 g.$('start').click();const forager=g.d.querySelector('[data-focus="forage"]');forager.click();assert.equal(p.s.focus,'forage');assert.equal(forager.getAttribute('aria-pressed'),'true');g.d.querySelector('[data-focus="nursery"]').click();assert.equal(p.s.focus,'forage','cooldown prevents priority hopping');
 const phase=p.ants[0].phase;p.tick(1);assert(Math.abs(p.ants[0].phase-phase-1.4/18)<1e-9);g.$('feed').click();const egg=p.s.eggs[0].left;p.tick(1);assert(Math.abs(egg-p.s.eggs[0].left-.7)<1e-9);
 p.tick(14);p.refresh();g.d.querySelector('[data-focus="dig"]').click();assert.equal(p.cost('expand'),27);assert.equal(JSON.parse(g.w.localStorage.getItem('underleaf-v1')).focus,'dig');
 g.$('pause').click();const cd=p.s.focusCooldown;p.tick(5);assert.equal(p.s.focusCooldown,cd,'pause freezes commitment');g.close();
}
{
 const g=domGame('little-lake','\nwindow.test={get save(){return save},get state(){return state},castAt,catchFish,tackle,closePanel,setCatch(id){current=id;clean=true},setReady(){started=true;state="idle"},draw};',['progression.js']),p=g.w.test;
 p.setReady();g.$('tackle').click();assert(g.d.querySelectorAll('[data-lure]').length===3);g.d.querySelector('[data-lure="deep"]').click();assert.equal(p.save.lure,'deep');assert.match(g.$('tripSummary').textContent,/Deep-water/);p.closePanel();p.castAt();assert.equal(p.state,'waiting');
 for(let i=0;i<6;i++){p.setCatch(i%3);p.catchFish()};assert.equal(p.save.money,275);assert(p.save.charter.claimed.every(Boolean));assert.equal(p.save.bag.length,6);p.tackle();assert(!g.$('newTrip').disabled);g.$('newTrip').click();assert.equal(p.save.charter.round,1);assert.equal(p.save.money,275);p.draw();g.close();
}
{
 const g=domGame('autumn-drift','',['save-store.js','recovery.js']);g.w.eval(read('games/autumn-drift/game.js')+'\nwindow.test={get save(){return save},get leaves(){return leaves},get count(){return collected},advance(){clock+=.5},collect(){collectLeaf(leaves[0],"pick");checkCleared();persist()},stats,blow,buy,rankCap};');const p=g.w.test;g.$('start').click();const leaf=p.leaves[0],x=leaf.x,y=leaf.y;p.blow(p.stats(),.1);assert.equal(leaf.vx,undefined,'bare hands cannot blow leaves');
 for(let i=0;i<11;i++){p.advance();p.collect()}const before=p.save.money;p.advance();p.collect();assert(p.save.money-before>=9,'milestone pays alongside leaf');const stored=JSON.parse(g.w.localStorage.getItem('autumn-drift-v2'));assert.equal(stored.garden.collected,12);
 assert.equal(p.rankCap(),5);p.save.money=10000;for(let i=0;i<5;i++)assert(p.buy(2));assert(!p.buy(2),'first area caps at five ranks');assert.equal(p.save.ranks[2],5);g.close();
}
console.log('PASS gameplay upgrades: once-only contract rewards/lures; shop deck shaping and old saves; finite relic redraws including paused reload; eight solvable bike courses and five-route migration; colony priority tradeoffs/cooldown; garden milestones and tool gates.');
