'use strict';
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{spawn}=require('node:child_process');
const routes=require('./fixtures/counterweight-routes.json'),key='study-desk-counterweight-v1';
const root=path.join(__dirname,'..'),out=path.join(root,'test-artifacts/counterweight');fs.mkdirSync(out,{recursive:true});
const server=spawn('python3',['-m','http.server','8136','--bind','127.0.0.1'],{cwd:root,stdio:'ignore'});let browser;
(async()=>{browser=await chromium.launch({headless:true,args:['--no-sandbox']});for(const mobile of [false,true]){
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
 console.log(`PASS ${prefix}: all five three-medal jobs, exact previews, midgame reloads, loss/undo, keyboard, restart/cancel, corrupt recovery and navigation; no browser errors`);await context.close();
}})().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();server.kill();});
