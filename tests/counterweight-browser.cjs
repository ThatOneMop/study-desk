'use strict';
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{spawn}=require('node:child_process');
const cradles=require('./fixtures/counterweight-cradles.json');
const routes=require('./fixtures/counterweight-routes.json'),key='study-desk-counterweight-v1';
const root=path.join(__dirname,'..'),out=path.join(root,'test-artifacts/counterweight');fs.mkdirSync(out,{recursive:true});
const server=spawn('python3',['-m','http.server','8136','--bind','127.0.0.1'],{cwd:root,stdio:'ignore'});let browser;
(async()=>{browser=await chromium.launch({executablePath:process.env.CHROME_EXECUTABLE_PATH||undefined,headless:true,args:['--no-sandbox']});for(const mobile of [false,true]){
 const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1280,height:1000},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:1});
 const page=await context.newPage(),errors=[],prefix=mobile?'touch':'desktop';page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('favicon.ico'))errors.push(r.status()+' '+r.url());});
 const act=async sel=>{const b=page.locator(sel);await b.scrollIntoViewIfNeeded();if(mobile)await b.tap();else await b.click();};
 await page.goto('http://127.0.0.1:8136/games/counterweight/');await page.waitForSelector('#scene svg');
 assert.equal(await page.locator('#jobs button:disabled').count(),4);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.screenshot({path:path.join(out,prefix+'-start.png'),fullPage:true});await act('#help');assert(await page.locator('#guide').evaluate(e=>e.open));await act('#close-guide');
 await act('[data-action=down]');assert.match(await page.locator('#status').textContent(),/landing height/);
 for(const route of routes){
  for(let i=0;i<route.actions.length;i++){
   const a=route.actions[i],button=page.locator(`[data-action=${a}]`),label=await button.getAttribute('title');
   assert(!label.includes('OVERLOAD')&&!label.includes('DAMAGE'));const m=label.match(/Balance (-?\d+), swing (\d+)/);assert(m,'missing preview');
   await act(`[data-action=${a}]`);assert.equal(Number(await page.locator('#balance').textContent()),Number(m[1]));assert.equal((await page.locator('#sway').textContent()).split(' / ')[0],m[2]);
   if(i===Math.floor(route.actions.length/2)){await page.screenshot({path:path.join(out,`${prefix}-job-${route.job+1}-mid.png`),fullPage:true});const before=await page.locator('#scene').getAttribute('aria-label');await page.reload();assert.equal(await page.locator('#scene').getAttribute('aria-label'),before);}
  }
  assert.match(await page.locator('#result').textContent(),/Everything in its place/);
  const saved=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);assert.equal(saved.records[route.job].medals,3);
  await page.screenshot({path:path.join(out,`${prefix}-job-${route.job+1}-done.png`),fullPage:true});if(route.job<4)await act('#next');
 }
 await page.reload();assert.match(await page.locator('#result').textContent(),/All five harbour jobs complete/);
 await act('#restart');await act('#cancel');assert.match(await page.locator('#result').textContent(),/Everything/);
 await act('#restart');await act('#accept');assert.match(await page.locator('#moves').textContent(),/^0 moves/);
 // Rehearsal keeps the actual journal intact, including failed previews and reload abandonment.
 await act('[data-job="0"]');await act('#accept');
 const clean=await page.evaluate(k=>localStorage.getItem(k),key);
 await act('#rehearse');
 if(mobile)await act('#rig');else await page.keyboard.press('c');
 for(const a of ['hook','up','left'])await act(`[data-action=${a}]`);
 assert.match(await page.locator('[data-action=left]').getAttribute('title'),/OVERLOAD/);
 await page.screenshot({path:path.join(out,prefix+'-rehearsal-risk.png'),fullPage:true});
 for(const a of ['left','settle','settle'])await act(`[data-action=${a}]`);
 assert.match(await page.locator('#rehearsal-summary').textContent(),/Safety brake/);assert(await page.locator('#apply-rehearsal').isDisabled());
 assert.equal(await page.evaluate(k=>localStorage.getItem(k),key),clean);
 await act('#undo');assert(!(await page.locator('#apply-rehearsal').isDisabled()));await act('#discard-rehearsal');
 assert.match(await page.locator('#moves').textContent(),/^0 moves/);assert.equal(await page.evaluate(k=>localStorage.getItem(k),key),clean);
 await act('#rehearse');if(mobile)await act('[data-action=up]');else await page.keyboard.press('w');
 assert.match(await page.locator('#scene').getAttribute('aria-label'),/level 1/);await page.reload();assert.equal(await page.locator('#rehearsal').isVisible(),false);assert.match(await page.locator('#moves').textContent(),/^0 moves/);
 // All five cradle routes now use actual rendered rehearsals, committing exactly one delivery at a time.
 for(const route of cradles){
  if(route.job>0){await act(`[data-job="${route.job}"]`);await act('#accept');}
  let journal=await page.evaluate(k=>localStorage.getItem(k),key);await act('#rehearse');
  for(let i=0;i<route.actions.length;i++){
   const a=route.actions[i],label=await page.locator(`[data-action=${a}]`).getAttribute('title'),m=label.match(/Balance (-?\d+), swing (\d+)/);assert(m);assert(!label.includes('OVERLOAD')&&!label.includes('DAMAGE'));
   await act(`[data-action=${a}]`);assert.equal(Number(await page.locator('#balance').textContent()),Number(m[1]));assert.equal((await page.locator('#sway').textContent()).split(' / ')[0],m[2]);assert.equal(await page.evaluate(k=>localStorage.getItem(k),key),journal);
   if(await page.locator('#hook').isDisabled()){
    if(route.job===0){await page.screenshot({path:path.join(out,prefix+'-rehearsal-delivery.png'),fullPage:true});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
    const preview=await page.locator('#scene').getAttribute('aria-label');await act('#apply-rehearsal');
    const saved=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);assert.deepEqual(saved.current.actions,route.actions.slice(0,i+1));
    await page.reload();assert.equal(await page.locator('#scene').getAttribute('aria-label'),preview);
    if(i<route.actions.length-1){journal=await page.evaluate(k=>localStorage.getItem(k),key);await act('#rehearse');}
   }
  }
  assert.match(await page.locator('#result').textContent(),/Everything in its place/);const saved=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);assert.equal(saved.records[route.job].medals,3);
 }
 await page.screenshot({path:path.join(out,prefix+'-rehearsal-complete.png'),fullPage:true});await act('#restart');await act('#accept');
 // Unsafe controls expose overloads before applying them; failure and free undo remain usable.
 for(const a of ['hook','up','right'])await act(`[data-action=${a}]`);
 assert.match(await page.locator('[data-action=right]').getAttribute('title'),/OVERLOAD/);
 for(const a of ['right','settle','settle'])await act(`[data-action=${a}]`);
 assert.match(await page.locator('#result').textContent(),/Shift paused/);await act('#undo');assert.equal(await page.locator('#result').isVisible(),false);
 await act('#restart');await act('#accept');await page.locator('[data-action=up]').focus();await page.keyboard.press('w');assert.match(await page.locator('#scene').getAttribute('aria-label'),/level 1/);await page.keyboard.press('z');assert.match(await page.locator('#scene').getAttribute('aria-label'),/level 0/);
 // Preserve another game's storage through Counterweight recovery.
 await page.evaluate(k=>{localStorage.setItem(k,'{broken');localStorage.setItem('cw-unrelated-fixture','keep');},key);await page.reload();await act('[data-action=hook]');assert.equal(await page.evaluate(k=>localStorage.getItem(k),key),'{broken');
 await act('#recover');await act('#cancel');assert.equal(await page.evaluate(k=>localStorage.getItem(k),key),'{broken');await act('#recover');await act('#accept');assert.equal(await page.evaluate(k=>JSON.parse(localStorage.getItem(k)).current.actions.length,key),1);assert.equal(await page.evaluate(()=>localStorage.getItem('cw-unrelated-fixture')),'keep');
 await act('header a');await page.waitForURL('**/index.html#games');assert(await page.locator('#games').count());assert.deepEqual(errors,[]);
 console.log(`PASS ${prefix}: five original plus five cradled/rehearsed three-medal jobs, isolated previews, draft loss/revision/discard/reload, exact previews, midgame reloads, loss/undo, keyboard, restart/cancel, corrupt recovery and navigation; no browser errors`);await context.close();
}})().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();server.kill();});

