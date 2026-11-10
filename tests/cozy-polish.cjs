const A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{JSDOM}=require('jsdom');
const root=path.join(__dirname,'../games');
function boot(id,api){
 const base=path.join(root,id),html=fs.readFileSync(path.join(base,'index.html'),'utf8'),dom=new JSDOM(html,{url:'https://example.test/games/'+id+'/',runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window;
 w.requestAnimationFrame=()=>1;w.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','')};w.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open');this.dispatchEvent(new w.Event('close'))};const param={setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}};const audioNode=()=>({gain:{...param},frequency:{...param},connect(){},disconnect(){},start(){},stop(){}});w.AudioContext=class{constructor(){this.currentTime=0;this.destination={};this.sampleRate=44100}createOscillator(){return audioNode()}createGain(){return audioNode()}createBiquadFilter(){return audioNode()}createBuffer(c,n){return{getChannelData:()=>new Float32Array(n)}}createBufferSource(){return audioNode()}resume(){}};w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:(_,k)=>/Gradient/.test(k)?()=>({addColorStop(){}}):k==='measureText'?()=>({width:20}):()=>{}});w.HTMLCanvasElement.prototype.setPointerCapture=()=>{};
 for(const script of w.document.scripts){const src=script.getAttribute('src');if(src){if(src.includes('bridge.js'))continue;w.eval(fs.readFileSync(path.join(base,src.split('?')[0]),'utf8')+(src.split('?')[0]==='game.js'?'\n'+(api||''):''));}else if(script.textContent.trim())w.eval(script.textContent+'\n'+(api||''));}
 return{dom,w,d:w.document,$:id=>w.document.getElementById(id)};
}const L=require('../games/little-lake/progression.js'),M=require('../games/mycelium-yard/engine.js');
for(const n of [0,.2,.99])A.ok([1,5].includes(L.roll('journal',n,0,[1,5])));
A.equal(L.roll('journal',.99,0,[]),4,'completed local journal falls back to normal fishing');
{
 const s=M.create();s.jobs=2;s.beds[0]={kind:0,growth:2,water:0,rot:0,ripe:0};s.beds[1]={kind:1,growth:3,water:0,rot:0,ripe:2};s.beds[2]={kind:0,growth:2,water:0,rot:0,ripe:1};
 const before=JSON.stringify(s),n=M.act(s,{type:'harvest-ready'});A.equal(n.jobs,0);A.equal(n.beds[0].kind,0);A.equal(n.beds[1].kind,-1);A.equal(n.beds[2].kind,-1);A.equal(n.sales,11);A.equal(JSON.stringify(s),before);A.equal(M.act(n,{type:'harvest-ready'}),null);A.deepEqual(M.decode(JSON.stringify(n)),n);
}
{
 const {dom,w,$}=boot('little-lake','window.qa={save,setReady(){started=true},castAt,tackle,closePanel,get current(){return current}};');
 w.qa.setReady();w.qa.tackle();A.equal(w.document.querySelectorAll('[data-lure]').length,4);w.document.querySelector('[data-lure="journal"]').click();w.qa.save.seen=[0,1,2,3,4];w.qa.closePanel();w.qa.castAt();A.equal(w.qa.current,5);dom.window.close();
}
{
 const {dom,w,$}=boot('lost-found','window.qa={state,get spots(){return spots},prepare(){state.found=[0,1,2,3];state.discover=false;for(const s of spots)s.id=0}};');
 w.qa.prepare();$('discover').click();A.ok(w.qa.spots.some(s=>s.id===4),'incomplete journal cannot leave detector with no eligible target');A.equal(w.qa.state.found.length,4);dom.window.close();
}
{
 const {dom,w,$}=boot('moon-salvage','window.qa={state,items,p,orderUI};');const q=w.qa;q.state.order=q.items[0].t;const order=q.state.order;$('start').click();A.equal(q.state.order,order,'active order survives title screen');q.orderUI();A.match($('order').textContent,/Dispatch radar:/);dom.window.close();
}
{
 const {dom,w,$}=boot('bell-diver','window.qa={prepare(){s=E.create();s.pos=7;s.air=15;render()},get pos(){return s.pos}};');w.qa.prepare();$('home-step').click();A.equal(w.qa.pos,2,'one click follows first route step and returns home');A.equal($('home-step').disabled,true);dom.window.close();
}
{
 const {dom,w,$}=boot('mycelium-yard','window.qa={prepare(){s=E.create();s.beds[0]={kind:0,growth:2,water:0,rot:0,ripe:0};render()},get s(){return s}};');w.qa.prepare();$('harvest-ready').click();A.equal(w.qa.s.jobs,2);A.equal(w.qa.s.beds[0].kind,-1);A.equal($('harvest-ready').disabled,true);dom.window.close();
}
{
 const {dom,w,$}=boot('tiny-wilds','window.qa={prepare(){Q.pantry=[2,3,4,5];Q.level=1;Q.fed=0;switchGame("ants")},Q,feedQueen};');w.qa.prepare();w.qa.feedQueen(true);A.deepEqual(Array.from(w.qa.Q.pantry),[0,3,4,5]);A.equal(w.qa.Q.fed,4,'craving meal receives 2x nutrition without balanced bonus');dom.window.close();
}
{
 const {dom,w,$}=boot('autumn-drift','window.qa={prepare(){leaves=leaves.slice(0,3);updateUI()},render};');w.qa.prepare();A.match($('instruction').textContent,/Last leaves marked/);w.qa.render(100);dom.window.close();
}
console.log('PASS cozy polish: journal lure/filter, stable dispatch radar, route step, batch harvest, selective meals and last-leaf locator.');
