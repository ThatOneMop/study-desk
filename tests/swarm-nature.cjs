// Player interaction regressions; no render-loop or audio dependency.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..');
function open(id,sources,expose){
 const html=fs.readFileSync(path.join(root,'games',id,'index.html'),'utf8');
 const dom=new JSDOM(html,{url:`https://example.test/games/${id}/`,runScripts:'outside-only',pretendToBeVisual:true});
 const w=dom.window;w.requestAnimationFrame=()=>1;
 w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:(_,key)=>key==='createLinearGradient'||key==='createRadialGradient'?()=>({addColorStop(){}}):()=>{}});
 for(const src of sources)w.eval(src.startsWith('inline:')?html.match(/<script>([\s\S]*?)<\/script>/)[1]+'\n'+expose:fs.readFileSync(path.join(root,'games',id,src),'utf8')+(src===sources.at(-1)?'\n'+expose:''));
 return dom;
}
{
 const dom=open('autumn-drift',['save-store.js','recovery.js','game.js'],`window.gameTest={get save(){return save},get leaves(){return leaves},fixture(rooted=false){leaves=[{id:777,x:500,y:400,hp:2,max:2,s:10,c:'#d48b37',a:0,rooted}];total=1;collected=0;completed=false;keyboardLeaf=777;clock+=1},step(){stepLeaves(.035)},advance(){clock+=1},get basket(){return basket}};`);
 const w=dom.window,d=w.document,t=w.gameTest,c=d.getElementById('game');d.getElementById('start').click();t.fixture();
 const push=()=>c.dispatchEvent(new w.KeyboardEvent('keydown',{key:'b',bubbles:true,cancelable:true}));
 push();assert.equal(t.leaves[0].vx,undefined,'rake unlock is required');t.save.ranks[2]=5;t.fixture(true);push();assert.equal(t.leaves[0].vx,undefined,'rooted leaves still need picking');
 t.fixture();push();assert(t.leaves[0].vx>0&&t.leaves[0].vy>0,'B sweeps toward the basket');
 for(let i=0;i<150&&t.leaves.length;i++){t.step();if(i%24===23){t.advance();push()}}
 assert.equal(t.leaves.length,0,'successive keyboard sweeps land the leaf');assert.equal(t.basket,1,'keyboard sweeps satisfy the actual basket gate');
 dom.window.close();
}
{
 const dom=open('little-lake',['progression.js','research.js','inline:main'],`window.gameTest={get save(){return save},compare(assist){save.reelAssist=assist;started=true;state='reel';prog=.5;pos=.33;held=false;timer=0;last=0;modal=false;frame(16);return prog}};`);
 const w=dom.window,d=w.document,t=w.gameTest;d.getElementById('tackle').click();assert.equal(d.getElementById('reelAssist').getAttribute('aria-pressed'),'false');d.getElementById('reelAssist').click();
 assert.equal(d.getElementById('reelAssist').getAttribute('aria-pressed'),'true');assert.equal(JSON.parse(w.localStorage.getItem('littleLakeV1')).reelAssist,true,'assist uses the existing save');
 assert(t.compare(false)<.5,'normal precision zone is retained');assert(t.compare(true)>.5,'assist widens the actual catch zone');dom.window.close();
}
{
 const dom=open('tiny-wilds',['save.js','game.js'],`window.gameTest={Q,retrain,switchGame};`),w=dom.window,d=w.document,t=w.gameTest;
 t.switchGame('ants');const nectar=t.Q.nectar,total=t.Q.roles.reduce((a,b)=>a+b,0);const train=d.querySelector('[aria-label="Train forager as Courier"]');assert(!train.disabled);assert.equal(train.getAttribute('onclick'),'retrain(1)');assert(t.retrain(1));
 assert.equal(t.Q.roles[0],2);assert.equal(t.Q.roles[1],3);assert.equal(t.Q.nectar,nectar,'training does not charge nectar');assert.equal(t.Q.roles.reduce((a,b)=>a+b,0),total,'training conserves workers');
 assert.equal(t.retrain(2),false,'cultivators remain locked until level 2');t.retrain(1);assert.equal(t.retrain(1),false,'last forager is protected');assert.equal(t.Q.roles[0],1);
 t.Q.level=2; t.Q.roles[0]=2;assert(t.retrain(2),'level 2 opens cultivators');assert.equal(t.retrain(3),false,'nurses remain gated');assert.equal(t.retrain(-1),false);assert.equal(t.retrain(0),false);
 assert.equal(JSON.parse(w.localStorage.getItem('tinyWilds2')).queen.roles[2],1,'role training persists');dom.window.close();
}
{
 const dom=open('lost-found',['inline:main'],`window.gameTest={get pinpoint(){return pinpoint},get target(){return target}};`),w=dom.window,d=w.document,t=w.gameTest,b=d.getElementById('pinpointBtn');
 b.click();assert(!t.pinpoint,'title blocks pinpoint');d.getElementById('startBtn').click();b.click();assert(t.pinpoint);assert.equal(b.getAttribute('aria-pressed'),'true');
 w.dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowRight'}));assert(!t.pinpoint,'movement releases pinpoint');assert.equal(b.getAttribute('aria-pressed'),'false');
 b.click();d.getElementById('pauseBtn').click();assert(!t.pinpoint,'pausing releases pinpoint');b.click();assert(!t.pinpoint,'paused control cannot activate');dom.window.close();
}
console.log('PASS nature improvements: keyboard basket gates, persisted reel assist, guarded worker training, touch pinpoint state.');
