'use strict';
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{spawn}=require('node:child_process'),E=require('../games/stencil-studio/engine.js');
const root=path.join(__dirname,'..'),out=path.join(root,'test-artifacts/stencil-studio'),url='http://127.0.0.1:8151',key=E.KEY;
fs.mkdirSync(out,{recursive:true});const server=spawn('python3',['-m','http.server','8151','--bind','127.0.0.1'],{cwd:root,stdio:'ignore'});let browser;
(async()=>{
for(let i=0;i<50;i++){try{if((await fetch(url)).ok)break}catch{}await new Promise(r=>setTimeout(r,100));}
browser=await chromium.launch({headless:true});
for(const touch of [false,true]){
 const context=await browser.newContext({viewport:touch?{width:390,height:844}:{width:1280,height:1000},hasTouch:touch,isMobile:touch,deviceScaleFactor:1});const page=await context.newPage(),errors=[],prefix=touch?'touch':'desktop';
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('/favicon.ico'))errors.push(r.status()+' '+r.url())});
 const shot=n=>page.screenshot({path:path.join(out,prefix+'-'+n+'.png'),fullPage:true}),raw=()=>page.evaluate(k=>localStorage.getItem(k),key),state=async()=>E.decode(await raw());
 const act=async sel=>{const b=page.locator(sel);await b.scrollIntoViewIfNeeded();if(touch)await b.tap();else await b.click();};
 async function setup(mark){await act('#shapes button:nth-child('+(mark[0]+1)+')');await act('#inks button:nth-child('+([1,2,4].indexOf(mark[4])+1)+')');while((await state()).setup.rotation!==mark[1])await act('#rotate');await act('#board button:nth-child('+(mark[3]*5+mark[2]+1)+')');}
 async function stamp(mark){await setup(mark);const lifted=await page.locator('#lift').isChecked();if(lifted!==(mark.length===6))await act('#lift');assert(await page.locator('#stamp').isEnabled());await act('#stamp');}
 async function reset(){await act('#reset');await act('#accept');}
 try{
 await page.goto(url+'/games/stencil-studio/index.html');assert.equal(await page.locator('#board button').count(),25);assert.equal(await page.locator('#commissions button:disabled').count(),2);
 await act('#help');assert(await page.locator('#guide').isVisible());await act('#close');await shot('start');
 // Ordinary UI routes, exact reload after each layer; no game-state injection.
 for(let level=0;level<3;level++){
  if(level){await act('#commissions button:nth-child('+(level+1)+')');await act('#accept');}
  for(const mark of E.RECIPES[level]){await stamp(mark);const saved=await raw();await page.reload();assert.equal(await raw(),saved);}
  assert.equal(E.run(await state()).phase,'won');assert.match(await page.locator('#message').textContent(),/Print complete/);await shot('commission-'+level);
 }
 assert.deepEqual((await state()).records,[3,3,3]);
 // A mistake, useful later layer, selective lift, then completion in exactly five operations.
 await act('#commissions button:first-child');await act('#accept');await stamp([1,0,0,4,4]);await stamp(E.RECIPES[0][0]);await setup([1,0,0,4,4]);
 const untouched=await raw();await act('#compare');assert.equal(await raw(),untouched);assert.match(await page.locator('#board button:nth-child(21)').textContent(),/−Y/);await shot('repair-before');
 await act('#lift');assert.equal(await raw(),untouched);assert.match(await page.locator('#inspection').textContent(),/Now: Sun\. Target: blank paper\. Planned: blank paper\. Matches/);assert.match(await page.locator('#board button:nth-child(21)').textContent(),/✓/);
 await shot('repair-preview');await act('#pause');assert(await page.locator('#stamp').isDisabled());assert(await page.locator('#compare').isDisabled());await act('#pause');await act('#stamp');assert.equal(E.run(await state()).wrong,0);const repaired=await raw();await page.reload();assert.equal(await raw(),repaired);assert.equal(await page.locator('#lift').isChecked(),false);
 await stamp(E.RECIPES[0][1]);await stamp(E.RECIPES[0][2]);assert.equal(E.run(await state()).phase,'won');assert.equal((await state()).history.length,5);assert.equal((await state()).records[0],3);await shot('repaired-win');
 // Deliberate loss, undo and cancellable retry preserve earned records.
 await act('#retry');await act('#accept');for(let y=0;y<5;y++)await stamp([1,0,0,y,4]);assert.equal(E.run(await state()).phase,'lost');await shot('loss');await act('#undo');assert.equal(E.run(await state()).phase,'active');const lossUndo=await raw();await act('#retry');await act('#cancel');assert.equal(await raw(),lossUndo);await act('#retry');await act('#accept');assert.equal((await state()).history.length,0);assert.deepEqual((await state()).records,[3,3,3]);
 if(!touch){await setup([0,0,0,0,1]);await page.locator('#board button:first-child').focus();await page.keyboard.press('ArrowRight');assert.equal((await state()).setup.x,1);const rotation=(await state()).setup.rotation;await page.keyboard.press('r');assert.equal((await state()).setup.rotation,(rotation+1)%4);await page.locator('#stamp').focus();await page.keyboard.press('Space');assert.equal((await state()).history.length,1);await page.locator('#undo').focus();await page.keyboard.press('Space');assert.equal((await state()).history.length,0);}
 await act('#reset');await act('#cancel');assert.deepEqual((await state()).records,[3,3,3]);await reset();assert.deepEqual((await state()).records,[null,null,null]);
 // Isolated fixture: malformed local save, preserved during play/cancel, recover through UI.
 await page.evaluate(k=>{localStorage.setItem(k,'{broken');localStorage.setItem('stencil-test-unrelated','keep');},key);await page.reload();assert(await page.locator('#recover').isVisible());await act('#stamp');assert.equal(await raw(),'{broken');await act('#recover');await act('#cancel');assert.equal(await raw(),'{broken');await act('#recover');await act('#accept');assert.equal((await state()).history.length,1);await shot('recovered');await reset();assert.equal(await page.evaluate(()=>localStorage.getItem('stencil-test-unrelated')),'keep');
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await act('header a');await page.waitForURL('**/index.html#games');assert(await page.locator('#games').count());assert.deepEqual(errors,[]);
 console.log('PASS',prefix,': three commissions, exact layer reloads, five-operation selective repair, planned comparison/readout, pause, loss/undo/retry, keyboard or native taps, isolated corrupt recovery/reset and return navigation');
 }catch(e){await shot('failure');console.error(prefix,await page.locator('body').innerText());throw e}finally{await context.close()}
}
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{if(browser)await browser.close();server.kill()});
