/* Optional nature-game goals: gameplay, rewards, reload and input regressions. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..');
function boot(id,sources,probe,storage={}){
 const html=fs.readFileSync(path.join(root,'games',id,'index.html'),'utf8');
 const dom=new JSDOM(html,{url:`https://example.test/games/${id}/`,runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window;
 w.requestAnimationFrame=()=>1;w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:(_,key)=>key==='createLinearGradient'||key==='createRadialGradient'?()=>({addColorStop(){}}):()=>{}});
 for(const [key,value] of Object.entries(storage))w.localStorage.setItem(key,value);
 for(const src of sources){const code=src==='inline'?[...w.document.querySelectorAll('script:not([src])')].map(s=>s.textContent).join('\n'):fs.readFileSync(path.join(root,'games',id,src),'utf8');w.eval(code+(src===sources.at(-1)?'\n'+probe:''))}
 return dom;
}
const autumnProbe=`window.test={get state(){return save},get request(){return gardenRequest},chooseGardenRequest,requestReward,noteGardenRequest,persist,collect(how='pick'){collectLeaf(leaves[0],how);checkCleared();updateUI();persist()}};`;
{
 let dom=boot('autumn-drift',['save-store.js','recovery.js','game.js'],autumnProbe),w=dom.window,t=w.test,d=w.document;
 d.getElementById('start').click();assert(!t.chooseGardenRequest('basket'),'rake commission stays locked');assert(t.chooseGardenRequest('hand'));assert(!t.chooseGardenRequest('basket'),'one commission per garden');
 for(let i=0;i<11;i++)t.collect();assert.equal(t.request.progress,11);assert(!t.request.claimed);const reward=t.requestReward('hand');t.collect();assert(t.request.claimed);assert.equal(t.request.progress,12);
 const wallet=t.state.money;assert.equal(t.noteGardenRequest('pick'),0);assert.equal(t.state.money,wallet,'completed commission cannot pay twice');
 t.persist();const stored=w.localStorage.getItem('autumn-drift-v2');assert.equal(JSON.parse(stored).garden.request.claimed,true);dom.window.close();
 dom=boot('autumn-drift',['save-store.js','recovery.js','game.js'],autumnProbe,{'autumn-drift-v2':stored});t=dom.window.test;assert(t.request.claimed);assert.equal(t.noteGardenRequest('pick'),0,'reload retains claimed reward');assert.equal(t.state.money,wallet);assert(reward>0);dom.window.close();
 // Basket deliveries, unlike off-lawn sweeps, count toward the other job.
 dom=boot('autumn-drift',['save-store.js','recovery.js','game.js'],autumnProbe);t=dom.window.test;dom.window.document.getElementById('start').click();t.state.ranks[2]=5;assert(t.chooseGardenRequest('basket'));t.collect('blow');assert.equal(t.request.progress,0);for(let i=0;i<6;i++)t.collect('basket');assert(t.request.claimed);dom.window.close();
 console.log('PASS Autumn commissions: two choices, remaining-leaf goals, qualifying actions, once-only rewards and reload.');
}
{
 const R=require('../games/little-lake/research.js');let survey=R.create(0),grants=0;
 for(let rank=0;rank<5;rank++){
  for(let id=0;id<rank+2;id++)grants+=R.tag(survey,0,id).reward;
  assert.equal(survey.rank,rank+1);assert(survey.complete);assert.equal(R.tag(survey,0,0).reward,0);survey=R.restore(JSON.parse(JSON.stringify(survey)));assert.equal(survey.rank,rank+1);
  assert.equal(R.next(survey,0),rank<4);
 }
 assert.equal(grants,1200);assert.equal(R.next(survey,1),false,'research stops at five ranks');assert.equal(R.tag(R.create(0),1,6).ok,false,'wrong water cannot count');
 assert.equal(R.restore({rank:50},7).area,7,'invalid research safely defaults without changing old save data');
 const dom=boot('little-lake',['progression.js','research.js','inline'],`window.test={get save(){return save},releaseResearch,tackle,closePanel,castAt,idle,get bob(){return bob},ready(){started=true;state='idle';modal=false}};`),w=dom.window,t=w.test,d=w.document;
 t.ready();t.save.seen=[0,1];t.save.bag=[{id:0,area:1,value:10},{id:0,area:0,value:10},{id:0,area:0,value:10},{id:1,area:0,value:20}];
 assert(!t.releaseResearch(0),'caught origin must match survey water');assert(t.releaseResearch(1));assert.equal(t.save.bag.length,3);assert(!t.releaseResearch(1),'duplicate species are not consumed');assert.equal(t.save.bag.length,3);assert(t.releaseResearch(2));assert.equal(t.save.research.rank,1);assert.equal(t.save.money,80);assert.equal(t.save.bag.length,2);assert.deepEqual(Array.from(t.save.seen),[0,1],'released fish remain in the journal');
 assert(!t.releaseResearch(1),'completed survey does not consume more fish');t.tackle();assert(d.getElementById('nextSurvey'));d.getElementById('nextSurvey').click();assert(!t.save.research.complete);assert.equal(t.save.research.tagged.length,0);assert.equal(t.save.research.rank,1);
 t.closePanel();t.castAt(900,290);assert.equal(Math.round(t.bob.x-450),110,'rank actually increases cast range');
 assert.equal(JSON.parse(w.localStorage.getItem('littleLakeV1')).research.rank,1);dom.window.close();
 console.log('PASS Little Lake research: five bounded ranks, exact creel consumption, duplicate/origin guards, journal retention, grant persistence and real cast range.');
}
{
 const dom=boot('tiny-wilds',['save.js','game.js'],`window.test={Q,chooseBanquet,serveBanquet,banquetView,closeTitle,save};`),w=dom.window,t=w.test,d=w.document;
 assert(!t.serveBanquet(),'title blocks serving');t.closeTitle('ants');assert(!t.chooseBanquet(2),'advanced recipes stay level-gated');assert(!t.chooseBanquet(9));assert(!t.serveBanquet(),'empty pantry cannot pay');
 t.Q.pantry=[24,6,5,0];const nectar=t.Q.nectar;
 for(let i=0;i<3;i++)assert(t.serveBanquet());
 assert.equal(t.Q.banquets,3);assert.equal(t.Q.pantry[0],0);assert.equal(t.Q.pantry[1],0);assert.equal(t.Q.pantry[2],5,'recipe consumes no unrelated food');assert(t.Q.nectar>nectar+30);assert.equal(t.Q.level,2,'banquets contribute to queen evolution');assert.equal(t.Q.dna,2,'one evolution gene plus one third-banquet gift');
 assert(!t.serveBanquet(),'repeated click cannot spend absent ingredients');assert.deepEqual(Array.from(t.banquetView().need),[12,3,0,0],'next cycle raises required ingredients');assert(t.chooseBanquet(1));assert.match(d.getElementById('sidebar').textContent,/Honey picnic/);
 const saved=w.localStorage.getItem('tinyWilds2');assert.equal(JSON.parse(saved).queen.banquets,3);assert(w.TinyWildsSaves.decode(saved).ok);dom.window.close();
 const reload=boot('tiny-wilds',['save.js','game.js'],`window.test={Q};`,{'tinyWilds2':saved});assert.equal(reload.window.test.Q.banquets,3);assert.equal(reload.window.test.Q.menu,1);assert.equal(reload.window.test.Q.dna,2);reload.window.close();
 console.log('PASS Tiny Wilds banquets: recipe gates, exact ingredients, food choice, nutrition/evolution, third-meal gene, scaled goals and reload.');
}
{
 const probe=`window.test={state,returnOrder,returnFinds,ui,closeTitle};`;
 let dom=boot('lost-found',['inline'],probe),w=dom.window,t=w.test,d=w.document;
 assert.deepEqual(Array.from(t.state.requests),[0,0,0]);assert(!t.returnFinds(),'title blocks requests');t.closeTitle();t.state.bag=[0,0,1,-1];t.state.found=[0,1];t.ui();assert(!d.getElementById('returnFinds').disabled);assert(t.returnFinds());assert.deepEqual(Array.from(t.state.bag),[0,-1],'consumes one of each exact requested find, retaining duplicates and junk');assert.equal(t.state.money,26);assert.equal(t.state.requests[0],1);assert.deepEqual(Array.from(t.state.found),[0,1]);assert(!t.returnFinds(),'next request requires different finds');
 t.state.bag=[2,3,4];t.ui();assert(t.returnFinds());assert.equal(t.state.requests[0],2);assert(t.returnFinds());assert.equal(t.state.requests[0],3);const money=t.state.money;assert.equal(t.returnOrder(),null);assert(!t.returnFinds());assert.equal(t.state.money,money,'completed coast cannot pay again');
 const saved=w.localStorage.getItem('lostFound_v1');dom.window.close();dom=boot('lost-found',['inline'],probe,{'lostFound_v1':saved});t=dom.window.test;assert.equal(t.state.requests[0],3);t.state.area=1;t.ui();assert.equal(t.returnOrder().ids[0],5,'each coast has its own three requests');dom.window.close();
 console.log('PASS Lost & Found returns: nine coast-specific requests, exact inventory, premium reward, retained journal, one-time completion and reload.');
}
