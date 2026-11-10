'use strict';
// Run with NODE_PATH pointing to a workspace containing jsdom.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {JSDOM}=require('jsdom'),root=path.resolve(__dirname,'../..');
function boot(id,entries={}){
 const dir=path.join(root,'games',id),html=fs.readFileSync(path.join(dir,'index.html'),'utf8');
 const dom=new JSDOM(html,{url:'https://study.test/games/'+id+'/index.html',runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window,context=dom.getInternalVMContext();
 for(const [key,value] of Object.entries(entries))w.localStorage.setItem(key,value);
 let frames=[];w.requestAnimationFrame=fn=>(frames.push(fn),frames.length);w.cancelAnimationFrame=()=>{};
 w.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});w.confirm=()=>true;w.alert=()=>{};
 w.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','')};w.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open');this.dispatchEvent(new w.Event('close'))};
 const noop=()=>{},audio=new Proxy({},{get:()=>noop});w.WinterfoldAudio=audio;w.CreekholdAudio=audio;w.SpanAudio={createAudio:()=>audio};w.LanewrightAudio={createAudio:()=>audio};
 const ctx=new Proxy({getImageData:(x,y,w,h)=>({data:new Uint8ClampedArray(w*h*4),width:w,height:h}),createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4),width:w,height:h}),measureText:s=>({width:String(s).length*7}),createLinearGradient:()=>({addColorStop(){}}),createRadialGradient:()=>({addColorStop(){}})}, {get:(obj,k)=>k in obj?obj[k]:noop});
 w.HTMLCanvasElement.prototype.getContext=()=>ctx;w.HTMLCanvasElement.prototype.setPointerCapture=noop;w.HTMLCanvasElement.prototype.releasePointerCapture=noop;
 Object.defineProperty(w.HTMLCanvasElement.prototype,'clientWidth',{get:()=>960});Object.defineProperty(w.HTMLCanvasElement.prototype,'clientHeight',{get:()=>600});
 w.HTMLCanvasElement.prototype.getBoundingClientRect=()=>({x:0,y:0,left:0,top:0,width:960,height:600,right:960,bottom:600});
 for(const script of w.document.querySelectorAll('script')){const src=script.getAttribute('src');if(src&&(src.includes('bridge.js')||src==='audio.js'))continue;const code=src?fs.readFileSync(path.join(dir,src),'utf8'):script.textContent;vm.runInContext(code,context,{filename:id+'/'+(src||'inline.js')});}
 return {w,run:code=>vm.runInContext(code,context),frame(t){const current=frames;frames=[];current.forEach(f=>f(t))},key(key,options={},target=w.document.body){const event=new w.KeyboardEvent('keydown',{key,bubbles:true,cancelable:true,...options});target.dispatchEvent(event);return event},close:()=>w.close()};
}
{
 const b=boot('numberworks');b.run("closePanel();edit(()=>E.place(state,'belt',20,20));undo();");
 assert.equal(b.run('future.length'),1);b.run("edit(()=>E.place(state,'extractor',20,20))");assert.equal(b.run('future.length'),1,'a rejected placement must keep redo');
 b.run('redo()');assert(b.run("state.buildings.some(n=>n.x===20&&n.y===20)"),'redo restores the original conveyor');
 b.key(' ');const paused=b.run('paused');b.key(' ',{repeat:true});assert.equal(b.run('paused'),paused,'holding Space must not toggle repeatedly');b.close();
 console.log('PASS Numberworks: rejected edits preserve redo and held Space is stable');
}
{
 const b=boot('numberworks'),w=b.w;b.run("closePanel();state.level=3;E.startProject(state,'twins');E.receive(state,2);openProjects()");const before=b.run('JSON.stringify(state.career.active)'),floor=b.run('JSON.stringify(E.layout(state))');
 w.document.getElementById('project-cancel').click();assert(w.document.getElementById('confirm-dialog').open);assert.equal(b.run('JSON.stringify(state.career.active)'),before,'opening confirmation keeps the active project');w.document.getElementById('cancel-confirm').click();assert.equal(b.run('JSON.stringify(state.career.active)'),before,'cancelling the dialog keeps project deliveries');
 w.document.getElementById('project-cancel').click();w.document.getElementById('accept-confirm').click();assert.equal(b.run('state.career.active'),null);assert.equal(b.run('JSON.stringify(E.layout(state))'),floor);assert.equal(b.run('state.delivered[2]'),1);b.close();
 console.log('PASS Numberworks: project cancellation confirms first and preserves factory/commissions');
}
{
 const b=boot('numberworks'),w=b.w;b.run('closePanel();openContracts()');
 const cards=w.document.querySelectorAll('#panel-body [data-accept]');assert.equal(cards.length,5,'the rush contract board shows five orders');
 const id=b.run('E.contractBoard(state)[0].id'),val=b.run('E.contractBoard(state)[0].value'),cnt=b.run('E.contractBoard(state)[0].count');
 w.document.querySelector(`#panel-body [data-accept="${id}"]`).click();
 assert.equal(b.run('state.contracts.accepted'),id,'accepting a contract activates it');
 assert.equal(w.document.getElementById('contract-pin').hidden,false,'an active contract is pinned in the HUD');
 b.run(`for(let i=0;i<${cnt};i++)E.receive(state,${val})`);
 assert.equal(b.run('state.contracts.accepted'),null,'finishing the order clears the active contract');
 assert(b.run(`state.bank[${val}]`)>=cnt,'the multiplier reward banks research credit');
 assert.equal(b.run(`state.contracts.list.find(c=>c.id===${id}).done`),true,'the order is marked delivered');
 b.close();
 console.log('PASS Numberworks: rush contract board accepts, tracks and rewards an order');
}
{
 const b=boot('winterfold');b.w.Winterfold.bootHill('lark','sandbox');const run=b.w.Winterfold.run;run.phase='play';run.speed=1;
 b.frame(1000);const before=run.clock;b.w.document.getElementById('guide').showModal();b.frame(1050);b.frame(1100);assert.equal(run.clock,before,'the field guide freezes the simulation');
 b.key(' ');assert.equal(run.speed,1,'Space inside a dialog cannot change the game clock');b.w.document.getElementById('guide').close();b.frame(1150);assert(run.clock>before,'closing the guide restores the chosen speed');
 let commits=0;const commit=b.w.Winterfold.E.commitStroke;b.w.Winterfold.E.commitStroke=(...args)=>{commits++;return commit(...args)};const map=b.w.document.getElementById('map');
 for(const type of ['pointerdown','pointermove','pointercancel']){const e=new b.w.MouseEvent(type,{clientX:type==='pointerdown'?100:250,clientY:type==='pointerdown'?100:250,bubbles:true});Object.defineProperty(e,'pointerId',{value:1});map.dispatchEvent(e)}assert.equal(commits,0,'a cancelled touch cannot construct a slope');
 const pointer=(type,x,y,id)=>{const e=new b.w.MouseEvent(type,{clientX:x,clientY:y,bubbles:true});Object.defineProperty(e,'pointerId',{value:id});map.dispatchEvent(e)};
 pointer('pointerdown',100,100,1);pointer('pointermove',250,250,1);pointer('pointerdown',500,500,2);pointer('pointermove',550,550,2);pointer('pointerup',550,550,2);pointer('pointerup',250,250,1);assert.equal(commits,0,'two-finger panning must not commit a partial slope');
 pointer('pointerdown',100,100,3);pointer('pointermove',250,250,3);pointer('lostpointercapture',250,250,3);pointer('pointerup',250,250,3);assert.equal(commits,0,'lost capture cancels a route, including a later stale pointerup');
 b.w.dispatchEvent(new b.w.Event('blur'));assert.equal(run.speed,0,'leaving the window pauses the hill');assert(b.w.localStorage.getItem(b.w.Winterfold.E.SAVE_KEY));b.close();
 console.log('PASS Winterfold: modal clock, cancelled/two-finger/lost-capture gestures, blur save/pause');
}
{
 const E=require('../winterfold/engine.js'),bad='{unreadable hill',b=boot('winterfold',{[E.SAVE_KEY]:bad}),w=b.w;w.Winterfold.bootHill('lark','sandbox');w.dispatchEvent(new w.Event('pagehide'));assert.equal(w.localStorage.getItem(E.SAVE_KEY),bad,'temporary play cannot replace an unreadable save');
 w.confirm=()=>false;w.document.getElementById('wipe').click();assert.equal(w.localStorage.getItem(E.SAVE_KEY),bad,'declining wipe preserves original data');const remove=w.Storage.prototype.removeItem;w.confirm=()=>true;w.Storage.prototype.removeItem=()=>{throw Error('blocked')};w.document.getElementById('wipe').click();assert.equal(w.localStorage.getItem(E.SAVE_KEY),bad,'failed storage removal preserves recovery lock');
 w.Storage.prototype.removeItem=remove;w.document.getElementById('wipe').click();assert.equal(w.localStorage.getItem(E.SAVE_KEY),null);w.Winterfold.bootHill('lark','sandbox');assert(E.decode(w.localStorage.getItem(E.SAVE_KEY)).ok,'explicit successful wipe permits new saves');b.close();
 console.log('PASS Winterfold: unreadable saves survive temporary play and declined/failed wipes');
}
{
 const b=boot('spanwright'),w=b.w;w.Spanwright.start('willow-1');const scene=w.document.getElementById('scene');b.key('ArrowRight',{},scene);b.key('Enter',{},scene);b.key('ArrowRight',{},scene);b.key('Enter',{},scene);
 assert.equal(w.Spanwright.session.beams.length,1);w.document.getElementById('undoBtn').click();const decoded=w.SpanEngine.decode(w.localStorage.getItem(w.SpanEngine.SAVE_KEY));assert(decoded.ok);assert.equal(decoded.meta.drafts['willow-1'].beams.length,0,'undo is persisted immediately');
 const e=b.key('z',{ctrlKey:true,shiftKey:true},scene);assert(e.defaultPrevented);assert.equal(w.Spanwright.session.beams.length,1);const saved=w.SpanEngine.decode(w.localStorage.getItem(w.SpanEngine.SAVE_KEY));assert.equal(saved.meta.drafts['willow-1'].beams.length,1,'keyboard redo is persisted');const originalDesign=JSON.stringify(w.SpanEngine.exportDesign(w.Spanwright.session));w.document.getElementById('playBtn').click();assert(w.Spanwright.session.backup);const joint=w.Spanwright.session.nodes.find(n=>!n.pin);assert(joint);joint.y-=.75;w.dispatchEvent(new w.Event('blur'));assert.equal(w.document.getElementById('pause').hidden,false);const midRun=w.SpanEngine.decode(w.localStorage.getItem(w.SpanEngine.SAVE_KEY));assert.equal(JSON.stringify(midRun.meta.drafts['willow-1']),originalDesign,'mid-test autosave must preserve the unbent construction');b.close();
 console.log('PASS Spanwright: construction undo/redo persist through reload and blur pauses');
}
{
 function simulationAt(hz){const b=boot('spanwright'),w=b.w;w.Spanwright.start('willow-1');const s=w.Spanwright.session;for(let x=7;x<13;x+=2)assert(w.SpanEngine.placeBeam(s,'road',x,6,x+2,6).ok);b.frame(1000);w.document.getElementById('playBtn').click();for(let i=1;i<=hz/2;i++)b.frame(1000+i*1000/hz);const time=s.sim.t;assert.equal(s.sim.mode,'run');b.close();return time}
 const times=[30,60,120].map(simulationAt);for(const time of times)assert(Math.abs(time-.5)<1e-8,'half a real second simulates half a second at each refresh rate');assert(Math.max(...times)-Math.min(...times)<1e-8);console.log('PASS Spanwright: 30/60/120 Hz simulate the same elapsed time');
}
{
 const b=boot('creekhold'),w=b.w;const before=w.Creekhold.cam.rot;b.key('q',{code:'KeyQ'});assert.equal(w.Creekhold.cam.rot,before,'modal shortcuts must not rotate the board');assert.equal(w.Creekhold.speed,0);b.key(' ',{code:'Space'});assert.equal(w.Creekhold.speed,0,'modal Space cannot change speed');w.document.getElementById('title').close();b.key(' ',{code:'Space'});assert.equal(w.Creekhold.speed,1);b.key(' ',{code:'Space',repeat:true});assert.equal(w.Creekhold.speed,1);w.dispatchEvent(new w.Event('blur'));assert.equal(w.Creekhold.speed,0);b.close();
 console.log('PASS Creekhold: modal and repeat shortcuts cannot alter simulation, blur pauses');
}
{
 const b=boot('lanewright'),w=b.w;w.document.getElementById('citiesBtn').click();const first=w.document.querySelector('[data-city]');first.click();
 w.document.getElementById('tutSkip').click();w.document.getElementById('speed1').click();assert.equal(w.Lanewright.speed,1);b.key(' ',{repeat:true});assert.equal(w.Lanewright.speed,1,'held pause is ignored');const event=b.key('z',{ctrlKey:true});assert(event.defaultPrevented,'construction undo must not trigger the browser default');w.dispatchEvent(new w.Event('blur'));assert.equal(w.Lanewright.speed,0);assert(w.localStorage.getItem(w.LanewrightEngine.SAVE_KEY));b.close();
 console.log('PASS Lanewright: held pause and Ctrl+Z behave safely, blur saves and pauses');
}
{
 const b=boot('packworks'),w=b.w;b.run("award(0,0);award(0,0);award(0,1);award(1,0);render()");w.document.getElementById('tabCards').click();
 w.document.getElementById('variantFilter').value='1';w.document.getElementById('ownedFilter').value='owned';w.document.getElementById('variantFilter').dispatchEvent(new w.Event('change'));assert.equal(w.document.querySelectorAll('.collect').length,1,'variant ownership filter narrows to the foil discovery');
 w.document.getElementById('variantFilter').value='best';w.document.getElementById('ownedFilter').value='duplicates';w.document.getElementById('ownedFilter').dispatchEvent(new w.Event('change'));assert.equal(w.document.querySelectorAll('.collect').length,1,'spare filter counts duplicates in every discovered variant');
 w.document.getElementById('cardSearch').value='no-match-found';w.document.getElementById('cardSearch').dispatchEvent(new w.Event('input'));assert.equal(w.document.querySelectorAll('.collect').length,0);assert.match(w.document.getElementById('collection').textContent,/No cards match/);
 b.run("S.upgrades.fusion=1;S.inventory['0:0']=16;S.areas=0;renderFactory()");w.document.getElementById('fusion').click();assert(b.run('current[0].id')<20,'fusion may only draw from open shelves');
 w.document.getElementById('reset').click();assert.equal(b.run('busy'),false);assert.equal(w.document.getElementById('reveal').className,'');w.document.getElementById('open').click();assert.equal(b.run('S.opened'),1,'reset during a reveal leaves the new game playable');b.close();
 console.log('PASS Packworks: variant/search/duplicate filters, shelf-safe fusion and reveal reset');
}
