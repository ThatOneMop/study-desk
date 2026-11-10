'use strict';
// Behavioural checks for builder-game improvements. NODE_PATH supplies jsdom 26.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {JSDOM}=require('jsdom'),root=path.resolve(__dirname,'..');
function boot(id){
 const dir=path.join(root,'games',id),dom=new JSDOM(fs.readFileSync(path.join(dir,'index.html'),'utf8'),{url:'https://study.test/games/'+id+'/',runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window,context=dom.getInternalVMContext();
 let frames=[],now=0;w.requestAnimationFrame=fn=>(frames.push(fn),frames.length);w.cancelAnimationFrame=()=>{};w.confirm=()=>true;w.alert=()=>{};w.matchMedia=()=>({matches:false,addEventListener(){}});
 w.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','')};w.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open');this.dispatchEvent(new w.Event('close'))};
 const noop=()=>{},ctx=new Proxy({measureText:s=>({width:String(s).length*7}),createLinearGradient:()=>({addColorStop(){}})},{get:(o,k)=>o[k]||noop});
 w.HTMLCanvasElement.prototype.getContext=()=>ctx;w.HTMLCanvasElement.prototype.setPointerCapture=noop;w.HTMLCanvasElement.prototype.getBoundingClientRect=()=>({left:0,top:0,width:960,height:600});
 for(const script of w.document.querySelectorAll('script')){const src=script.getAttribute('src');if(src?.includes('bridge.js'))continue;vm.runInContext(src?fs.readFileSync(path.join(dir,src),'utf8'):script.textContent,context,{filename:id+'/'+(src||'inline')});}
 return {w,run:code=>vm.runInContext(code,context),$(id){return w.document.getElementById(id)},tick(n){for(let i=0;i<n;i++){now+=40;const f=frames;frames=[];f.forEach(fn=>fn(now));}},close:()=>w.close()};
}
{
 const b=boot('pegworks'),g=b.w.Pegworks;g.start();const before=JSON.stringify(g.snapshot()),route=g.aimPreview();assert(route.length>3);assert.equal(JSON.stringify(g.snapshot()),before,'trajectory preview never mutates gameplay');const end=route[route.length-1];g.launch();for(let i=0;i<300&&g.snapshot().score===0;i++)g.step(1/120);assert(g.snapshot().score>0);assert(Math.hypot(g.snapshot().ball.x-end.x,g.snapshot().ball.y-end.y)<3,'preview ends at actual first peg collision');b.close();
}
{
 const b=boot('demolition-yard'),g=b.w.DemolitionYard;g.setup(0,false);const initial=JSON.stringify(g.snapshot()),target=g.snapshot().blocks[0];g.use(target.x,target.y);for(let i=0;i<50;i++)g.step(1/120);assert(g.snapshot().budget<60);b.$('pause').click();assert.equal(g.undo(),false,'cannot undo through pause');b.$('start').click();assert(g.undo());assert.equal(JSON.stringify(g.snapshot()),initial,'undo restores positions, supports and budget');assert.equal(g.undo(),false,'undo is single use');g.use(850,50);assert.equal(g.undo(),false,'empty clicks do not create undo state');b.close();
}
{
 const b=boot('corebreaker');b.run('heat=80;combo=8;clock=1;renderUI()');b.$('vent').click();assert.equal(b.run('heat'),25);assert.equal(b.run('combo'),0);assert.equal(b.run('ventReady'),9);b.run('heat=80');b.$('vent').click();assert.equal(b.run('heat'),80,'vent cooldown prevents repeated cooling');b.run('clock=10;paused=true');assert.equal(b.run('vent()'),false);b.run('paused=false');assert(b.run('vent()'));b.tick(220);assert.equal(b.run('heat'),0);assert.equal(b.$('vent').disabled,true,'cool rig cannot waste vent');b.close();
}
{
 const b=boot('packworks');assert.equal(b.run('S.keepShiny'),false,'existing saves retain default selling rules');b.run("S.inventory={'0:0':4,'1:2':20,'2:4':3};S.seen={'0:0':true,'1:2':true,'2:4':true};S.upgrades.fusion=1;render()");b.$('keepShiny').click();assert.equal(b.run('duplicates()'),3);assert.equal(b.run('duplicateValue()'),12);assert.match(b.$('sell').textContent,/12/);assert(b.$('fusion').disabled,'protected rare cards cannot pay the fusion cost');b.$('sell').click();assert.equal(b.run('owned(0,0)'),1);assert.equal(b.run('owned(1,2)'),20);assert.equal(b.run('owned(2,4)'),3);assert.equal(JSON.parse(b.w.localStorage.getItem('packworks-v1')).keepShiny,true);
 b.run("S.quick=true;S.autoSell=true;Areas.rollId=()=>1;chooseVariant=()=>2;openPack(true)");assert.equal(b.run('owned(1,2)'),23,'automatic packs keep rare duplicates');
 b.run("S.inventory['0:0']=17;S.upgrades.fusion=1;render()");b.$('fusion').click();assert.equal(b.run('owned(0,0)'),2,'fusion consumes only eligible plain extras');assert(b.run('owned(1,2)')>=23,'fusion preserves every protected rare extra');b.$('skip').click();b.$('keepShiny').click();assert(b.run('duplicates()')>=24);b.$('sell').click();assert.equal(b.run('owned(1,2)'),1);assert.equal(b.run('owned(2,4)'),1);b.close();
}
{
 const b=boot('numberworks');b.run("closePanel();state=E.create(2147,true);E.place(state,'add',20,20);E.place(state,'mul',30,30);const stoppedIds=state.buildings.map(n=>n.id)");b.run('nextBottleneck()');assert.equal(b.run('[...selected][0]'),b.run('stoppedIds[0]'));assert.equal(b.run('state.camera.x'),21);assert.match(b.$('inspect-content').textContent,/Needs inputs A and B/);b.run('nextBottleneck()');assert.equal(b.run('[...selected][0]'),b.run('stoppedIds[1]'));b.run('nextBottleneck()');assert.equal(b.run('[...selected][0]'),b.run('stoppedIds[0]'),'cycles waiting machines');assert(b.$('inspector').classList.contains('open'));b.close();
}
{
 const E=require('../games/spanwright/engine.js'),s={nodes:[{id:1,x:100,y:90},{id:2,x:110,y:90}],beams:[{id:3,a:1,b:2,mat:'wood'}],backup:JSON.stringify({nodes:[{id:1,x:2,y:4},{id:2,x:4,y:4}]}),sim:{firstBreak:3,result:'failure'}};
 const before=JSON.stringify(s);assert.match(E.failureAdvice(s),/Wood near \(3.0, 4.0\)/);assert.equal(JSON.stringify(s),before,'diagnosis never modifies the design');s.sim={why:'under',result:'failure'};assert.match(E.failureAdvice(s),/cheaper/);s.sim.result='success';assert.equal(E.failureAdvice(s),'');
}
(async()=>{
 const {stationReadiness,orderSupply}=await import('../games/gummy-bay/station-readiness.mjs');
 const s={room:true,house:0,packStation:true,packs:[1,50],storedPacks:[2],gummies:[3],raw:[2],wrappers:1,deals:[{t:0,qty:8}],chronicle:{owned:{warehouse:true}}};
 const before=JSON.stringify(s);assert.deepEqual(orderSupply(s),{promised:8,ready:1,collect:2,make:2,wrap:5,wrappersMissing:4});assert.match(stationReadiness('stockroom',s).text,/Collect 2/);assert.match(stationReadiness('stockroom',s).text,/240 stored/);assert.match(stationReadiness('craft',s).text,/4 more wrappers/);assert.equal(JSON.stringify(s),before,'guidance preserves inventory and reservations');s.wrappers=10;assert.equal(stationReadiness('craft',s).ready,true);s.deals=[];assert.match(stationReadiness('stockroom',s).text,/238 shelf spaces free/);
 console.log('PASS builder polish: prediction, budget undo, tactical vent/cooldown, rare-card protections, bottleneck cycling, first-break diagnosis and order-aware production.');
})().catch(err=>{console.error(err);process.exitCode=1});
