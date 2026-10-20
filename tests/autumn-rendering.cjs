const assert=require('node:assert/strict'),fs=require('fs'),{JSDOM}=require('jsdom');
const root=__dirname+'/../',html=fs.readFileSync(root+'games/autumn-drift/index.html','utf8'),source=fs.readFileSync(root+'games/autumn-drift/game.js','utf8');
function boot(noCache=false,failComposite=false){
 const dom=new JSDOM(html,{url:'https://example.test/games/autumn-drift/',runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window,contexts=new Map();
 w.requestAnimationFrame=()=>1;
 w.HTMLCanvasElement.prototype.getContext=function(){
  if(noCache&&this.id!=='game')return null;
  if(!contexts.has(this)){const calls=[],visible=this.id==='game';contexts.set(this,new Proxy({calls},{get:(o,k)=>k in o?o[k]:k==='drawImage'&&visible&&failComposite?()=>{throw Error('Composite unavailable')}:k==='createLinearGradient'?()=>({addColorStop(){}}):(...args)=>calls.push([k,...args])}));}
  return contexts.get(this);
 };
 w.eval(fs.readFileSync(root+'games/autumn-drift/save-store.js','utf8'));
 w.eval(fs.readFileSync(root+'games/autumn-drift/recovery.js','utf8'));
 w.eval(source+`\nconst probe={backgrounds:0,stats:0};const originalBackground=background,originalStats=stats;
 background=()=>{probe.backgrounds++;return originalBackground()};stats=()=>{probe.stats++;return originalStats()};
 window.testRender={probe,render,resize,get state(){return JSON.stringify({save,leaves,collected,total,completed})},area(n){save.area=save.unlocked=n;loadGarden()},collect(){collected++},get leaves(){return leaves.length}};`);
 return {w,dom,t:w.testRender,contexts,close:()=>w.close()};
}
let g=boot(),t=g.t;t.area(1000);assert.equal(t.leaves,900);t.probe.backgrounds=t.probe.stats=0;
const before=t.state;for(let i=0;i<60;i++)t.render(i*16.67);
assert.equal(t.probe.backgrounds,1,'unchanged scenery is painted once, not every frame');
assert.equal(t.probe.stats,60,'tool stats calculated once per idle frame, not per leaf');
assert.equal(t.state,before,'render optimisation cannot mutate progress or leaves');
const cached=[...g.contexts.keys()].find(c=>c.id!=='game');assert(cached,'offscreen scenery buffer exists');
const main=g.contexts.get(g.w.document.getElementById('game'));
assert.equal(main.calls.filter(c=>c[0]==='drawImage').length,60,'each frame composites the scenery');
assert(g.contexts.get(cached).calls.filter(c=>c[0]==='stroke').length>=1500,'cache contains original detailed grass, not a blank shortcut');
t.collect();t.render(1100);assert.equal(t.probe.backgrounds,2,'basket count invalidates scenery');t.render(1117);assert.equal(t.probe.backgrounds,2);
t.area(1001);t.render(1134);assert.equal(t.probe.backgrounds,3,'area palette/scenery invalidates cache');
g.w.innerWidth=600;g.w.innerHeight=400;t.resize();t.render(1151);assert.equal(t.probe.backgrounds,4,'display density rebuilds cache');
g.w.devicePixelRatio=4;g.w.innerWidth=10000;g.w.innerHeight=8000;t.resize();t.render(1168);
assert(cached.width<=2400&&cached.height<=1600,'background bitmap has bounded high-DPI memory');
g.close();
g=boot(true);g.t.render(0);g.t.render(17);assert.equal(g.t.probe.backgrounds,2,'missing cache context falls back to original drawing');g.close();
g=boot(false,true);g.t.render(0);g.t.render(17);assert.equal(g.t.probe.backgrounds,3,'failed composite disables cache after one attempt');assert(g.contexts.get(g.w.document.getElementById('game')).calls.filter(c=>c[0]==='stroke').length>=3000,'fallback paints on visible context');g.close();
console.log('PASS Autumn rendering: 60 dense frames use 1 scenery paint/60 stats calculations, original grass retained, state unchanged, basket/area/density invalidation, bounded bitmap, unavailable-context fallback');
