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
const A=require('../games/ashwake/engine.js');
{
 const meta=A.createMeta(),run=A.startRun(meta,'warden',77);assert.equal(A.redraw(run).ok,false);run.player.xp=run.player.next;A.tick(run,{x:0,y:0},{w:960,h:540});assert.equal(run.phase,'level');
 const old=run.draft.map(c=>c.id);assert(A.redraw(run).ok);assert.equal(run.redraws,1);assert(run.draft.some(c=>!old.includes(c.id)),'offer changes');
 A.pause(run);const loaded=A.decode(A.encode({meta,run}));assert(loaded.ok);assert.equal(loaded.run.redraws,1);A.resume(loaded.run);assert.equal(loaded.run.phase,'level');assert.equal(loaded.run.draft.length,3,'a paused level-up keeps its cards after reload');
 assert(A.redraw(loaded.run).ok);assert.equal(loaded.run.redraws,0);assert(!A.redraw(loaded.run).ok);assert(A.choose(loaded.run,0).ok);
 const oldRun=A.startRun(meta,'warden',42);delete oldRun.redraws;assert.equal(A.decode(A.encode({meta,run:oldRun})).run.redraws,2);
 oldRun.redraws=99;assert(!A.decode(A.encode({meta,run:oldRun})).ok);
}
function domGame(name,probe,scripts=[]){
 const dom=new JSDOM(read('games/'+name+'/index.html'),{url:'https://test.example/games/'+name+'/',runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window;
 w.requestAnimationFrame=()=>1;w.scrollTo=()=>{};w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:(_,k)=>k==='createLinearGradient'||k==='createRadialGradient'?()=>({addColorStop(){}}):()=>{}});
 for(const script of scripts)w.eval(read('games/'+name+'/'+script));
 for(const script of w.document.querySelectorAll('script:not([src])'))w.eval(script.textContent+probe);
 return {w,d:w.document,$:id=>w.document.getElementById(id),close:()=>w.close()};
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
console.log('PASS gameplay upgrades: once-only Little Lake contract rewards and lures; Ashwake relic redraws including paused reload; Autumn Drift milestones and rank caps.');
