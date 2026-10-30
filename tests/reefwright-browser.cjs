'use strict';
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{spawn}=require('node:child_process');
const routes=require('./fixtures/reefwright-routes.json');
const root=path.join(__dirname,'..'),out=path.join(root,'test-artifacts/reefwright');fs.mkdirSync(out,{recursive:true});
const server=spawn('python3',['-m','http.server','8135','--bind','127.0.0.1'],{cwd:root,stdio:'ignore'});
let browser;
(async()=>{
 browser=await chromium.launch({executablePath:process.env.CHROME_EXECUTABLE_PATH||undefined,headless:true,args:['--no-sandbox']});
 for(const mobile of [false,true]){
  const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1280,height:1000},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:1});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('favicon.ico'))errors.push(r.status()+' '+r.url());});
  const act=async s=>{const b=page.locator(s);await b.scrollIntoViewIfNeeded();if(mobile)await b.tap();else await b.click();};
  await page.goto('http://127.0.0.1:8135/games/reefwright/');await act('#desk-start');
  await page.waitForFunction(()=>window.Reefwright&&document.querySelectorAll('[data-cell]').length===36);
  assert.equal(await page.locator('#sites button:disabled').count(),4);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'horizontal overflow');
  await page.screenshot({path:path.join(out,(mobile?'touch':'desktop')+'-onboarding.png'),fullPage:true});
  await act('#help-button');assert.equal(await page.locator('#guide').evaluate(d=>d.open),true);await act('#close-guide');
  // Preview is non-mutating; rotate and reject an off-board footprint.
  await act('[data-offer="2"]');await act('[data-cell="5"]');assert.equal(await page.locator('#plant').isDisabled(),true);await act('#rotate');assert.equal(await page.locator('#plant').isEnabled(),true);
  assert.equal(await page.evaluate(()=>localStorage.getItem('study-desk-reefwright-v1')),null);
  await act('#plant');assert.match(await page.locator('#round').textContent(),/1 \/ 8/);await act('#undo');
  // A losing survey and its reopen path.
  await act('#finish');assert.match(await page.locator('#result').textContent(),/useful first survey/);await act('#undo');
  for(let stage=0;stage<5;stage++){
   for(let i=0;i<8;i++){
    const m=routes[stage].moves[i];await act(`[data-offer="${m.offer}"]`);for(let r=0;r<m.rotation;r++)await act('#rotate');
    await act(`[data-cell="${m.y*6+m.x}"]`);
    const forecast=await page.locator('#forecast').textContent();assert.match(forecast,/After planting/);
    const expected=Number(forecast.match(/Vitality (\d+)/)[1]);await act('#plant');assert.equal(Number(await page.locator('#score').textContent()),expected);
    if(stage===0&&i===2){await page.locator('#board').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(out,`${mobile?'touch':'desktop'}-midgame.png`),fullPage:true});}
    if(stage===0&&i===2){const count=await page.locator('#round').textContent();await page.reload();await act('#desk-start');assert.equal(await page.locator('#round').textContent(),count);}
   }
   await act('#channels');await act('#finish');assert.match(await page.locator('#result').textContent(),/A reef comes alive/);
   const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('study-desk-reefwright-v1')));assert.equal(saved.records[stage].finished,true);
   await page.screenshot({path:path.join(out,`${mobile?'touch':'desktop'}-coast-${stage+1}.png`),fullPage:true});
   if(stage<4)await act('#next');
  }
  await page.reload();await act('#desk-start');assert.match(await page.locator('#result').textContent(),/All five coasts/);
  await act('#restart');await act('#cancel-confirm');assert.match(await page.locator('#round').textContent(),/8 \/ 8/);
  await act('#restart');await act('#accept-confirm');assert.match(await page.locator('#round').textContent(),/0 \/ 8/);
  // Real keyboard traversal and activation, regardless of touch context.
  await page.locator('[data-cell="0"]').focus();await page.keyboard.press('ArrowDown');assert.equal(await page.evaluate(()=>document.activeElement.dataset.cell),'6');
  await page.keyboard.press('3');await page.keyboard.press('r');
  const key='study-desk-reefwright-v1',raw=()=>page.evaluate(k=>localStorage.getItem(k),key),prefix=mobile?'touch':'desktop';
  async function openCoast(stage){await act(`[data-stage="${stage}"]`);if(await page.locator('#confirm').evaluate(e=>e.open))await act('#accept-confirm');else{await act('#restart');await act('#accept-confirm');}}
  async function place(m){await act(`[data-offer="${m.offer}"]`);for(let r=0;r<m.rotation;r++)await act('#rotate');await act(`[data-cell="${m.y*6+m.x}"]`);await act('#plant');}
  for(const route of require('./fixtures/reefwright-cut-routes.json')){await openCoast(route.stage);for(const m of route.moves){if(m.type==='prune'){await act('#prune');const before=await raw();await act(`[data-cell="${m.cell}"]`);assert.equal(await raw(),before);await act('#plant');const after=await raw();await page.reload();await act('#desk-start');assert.equal(await raw(),after);}else await place(m);}await act('#finish');assert.match(await page.locator('#result').textContent(),/A reef comes alive/);await page.screenshot({path:path.join(out,`${prefix}-cut-coast-${route.stage}.png`),fullPage:true});}
  await openCoast(0);const pair=require('./fixtures/reefwright-paired-cut.json');for(const m of pair.state.moves)await place(m);const baseline=await raw();await act('#prune');await act('[data-cell="20"]');assert.match(await page.locator('#forecast').textContent(),/Vitality 24/);await act('#add-cut');assert(await page.locator('[data-cell="20"]').evaluate(e=>e.classList.contains('preview-cut')));await act('[data-cell="7"]');assert.match(await page.locator('#forecast').textContent(),/Vitality 27/);assert.match(await page.locator('#forecast').textContent(),/nurseries 7/);assert.equal(await raw(),baseline);await page.screenshot({path:path.join(out,`${prefix}-paired-preview.png`),fullPage:true});await act('#desk-pause');const heldForecast=await page.locator('#forecast').textContent();await page.keyboard.press('x');assert.equal(await raw(),baseline);assert.equal(await page.locator('#forecast').textContent(),heldForecast);await page.screenshot({path:path.join(out,`${prefix}-paired-paused.png`),fullPage:true});await act('#desk-resume');await act('#prune');assert.equal(await raw(),baseline);await act('#prune');await act('[data-cell="20"]');await act('#add-cut');await act('[data-cell="7"]');if(mobile)await act('#plant');else await page.keyboard.press('Enter');assert.match(await page.locator('#prune').textContent(),/0 left/);const committed=await raw();await page.reload();await act('#desk-start');assert.equal(await raw(),committed);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:path.join(out,`${prefix}-paired-committed.png`),fullPage:true});await act('#undo');await act('#undo');assert.equal(await raw(),baseline);
  // Corrupt saves are not silently destroyed.
  await page.evaluate(()=>localStorage.setItem('study-desk-reefwright-v1','{broken'));await page.reload();await act('#desk-start');await act('[data-cell="0"]');await act('#plant');
  assert.equal(await page.evaluate(()=>localStorage.getItem('study-desk-reefwright-v1')),'{broken');
  await act('#reset-save');await act('#accept-confirm');assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('study-desk-reefwright-v1')).current.moves.length),1);
  await act('header a');await page.waitForURL('**/index.html#games');assert(await page.locator('#games').count()||await page.locator('#gameGrid').count()||await page.locator('.game').count());
  assert.deepEqual(errors,[]);console.log(`PASS ${mobile?'touch':'desktop'}: five complete campaigns, exact forecasts, reload, loss/reopen, restart, corrupt recovery, navigation and no browser errors`);
  await context.close();
 }
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();server.kill();});

