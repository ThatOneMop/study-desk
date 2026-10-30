'use strict';
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{spawn}=require('node:child_process'),E=require('../games/moon-dial/engine');
const root=path.join(__dirname,'..'),out=path.join(root,'test-artifacts/moon-dial'),url='http://127.0.0.1:8153';fs.mkdirSync(out,{recursive:true});const server=spawn('python3',['-m','http.server','8153','--bind','127.0.0.1'],{cwd:root,stdio:'ignore'});let browser;
(async()=>{for(let i=0;i<50;i++){try{if((await fetch(url)).ok)break}catch{}await new Promise(r=>setTimeout(r,100));}browser=await chromium.launch({headless:true});
for(const touch of [false,true]){
 const context=await browser.newContext({viewport:touch?{width:390,height:844}:{width:1280,height:1000},hasTouch:touch,isMobile:touch}),page=await context.newPage(),errors=[],prefix=touch?'touch':'desktop';
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('favicon.ico'))errors.push(r.status()+' '+r.url())});
 const act=async sel=>{const b=page.locator(sel);await b.scrollIntoViewIfNeeded();if(touch)await b.tap();else await b.click()},raw=()=>page.evaluate(k=>localStorage.getItem(k),E.KEY),state=async()=>E.decode(await raw()),shot=n=>page.screenshot({path:path.join(out,prefix+'-'+n+'.png'),fullPage:true});
 async function move(a){if(a.type==='clutch')await act('#couplings button:nth-child('+(a.edge+2)+')');else{await act('#gears button:nth-child('+(a.gear+1)+')');const before=await raw(),expected=E.step(E.run(await state()),a);await act(a.dir===1?'#plan-right':'#plan-left');assert.equal(await raw(),before);for(let i=0;i<expected.angles.length;i++)assert.match(await page.locator('#gears button').nth(i).getAttribute('aria-label'),new RegExp('preview '+expected.angles[i]+'$'));await act('#apply-plan');assert.deepEqual(E.run(await state()).angles,expected.angles);}}
 try{
 await page.goto(url+'/games/moon-dial/index.html');await act('#help');assert(await page.locator('#guide').isVisible());await act('#close');
 await act('#left');await act('#plan-left');assert.match(await page.locator('#plan-summary').textContent(),/Leaves its moon mark: C/);await shot('alignment-warning');
 const before=await raw();await act('#cancel-plan');assert.equal(await raw(),before);await act('#couplings button:nth-child(3)');await act('#plan-left');assert.match(await page.locator('#plan-summary').textContent(),/This restores the clock/);await act('#pause');assert(await page.locator('#apply-plan').isDisabled());await act('#pause');await act('#apply-plan');assert.equal(E.run(await state()).phase,'won');await shot('first-clock');
 for(let level=1;level<3;level++){
  await act('#machines button:nth-child('+(level+1)+')');await act('#accept');
  // Deliberate detour, undo and non-destructive hint before solving through normal UI.
  await act('#right');await act('#undo');const initial=await raw();await act('#hint');assert.equal(await raw(),initial);assert.match(await page.locator('#hint-text').textContent(),/One route/);
  for(const a of E.route(await state())){await move(a);const saved=await raw();await page.reload();assert.equal(await raw(),saved);assert(await page.locator('#plan-actions').isHidden());}
  assert.equal(E.run(await state()).phase,'won');await shot('mechanism-'+level);
 }
 const records=(await state()).records;assert(records.every(Number.isInteger));await act('#retry');await act('#cancel');assert.deepEqual((await state()).records,records);await act('#retry');await act('#accept');assert.equal((await state()).history.length,0);
 if(!touch){await page.locator('#gears button').first().focus();await page.keyboard.press('2');assert.equal((await state()).selected,1);await page.keyboard.press('a');assert.equal((await state()).history.length,1);await page.keyboard.press('z');assert.equal((await state()).history.length,0);}
 await act('#plan-left');const draft=await raw();await page.reload();assert.equal(await raw(),draft);assert(await page.locator('#plan-actions').isHidden());
 await act('#reset');await act('#cancel');assert.deepEqual((await state()).records,records);await act('#reset');await act('#accept');assert.deepEqual((await state()).records,[null,null,null]);
 // Isolated malformed-save fixture; gameplay and recovery use normal controls.
 await page.evaluate(k=>{localStorage.setItem(k,'{broken');localStorage.setItem('moon-test-unrelated','keep')},E.KEY);await page.reload();assert(await page.locator('#recover').isVisible());await act('#left');assert.equal(await raw(),'{broken');await act('#recover');await act('#cancel');assert.equal(await raw(),'{broken');await act('#recover');await act('#accept');assert.equal((await state()).history.length,1);assert.equal(await page.evaluate(()=>localStorage.getItem('moon-test-unrelated')),'keep');await shot('recovery');
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await act('header a');await page.waitForURL('**/index.html#games');assert(await page.locator('#arcade').isVisible());assert.equal(await page.getByRole('button',{name:/switch workspace/i}).count(),0);assert.deepEqual(errors,[]);
 console.log('PASS',prefix,'all3 mechanisms via rehearsed turns, exact reloads, disruption warning, pause, hints, detour/undo/retry, keyboard or native taps, scoped reset, corrupt recovery and development launcher return');
 }catch(e){await shot('failure');console.error(await page.locator('body').innerText());throw e}finally{await context.close()}
}
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{if(browser)await browser.close();server.kill()});
