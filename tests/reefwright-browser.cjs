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
  await page.goto('http://127.0.0.1:8135/games/reefwright/');
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
    if(stage===0&&i===2){const count=await page.locator('#round').textContent();await page.reload();assert.equal(await page.locator('#round').textContent(),count);}
   }
   await act('#channels');await act('#finish');assert.match(await page.locator('#result').textContent(),/A reef comes alive/);
   const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('study-desk-reefwright-v1')));assert.equal(saved.records[stage].finished,true);
   await page.screenshot({path:path.join(out,`${mobile?'touch':'desktop'}-coast-${stage+1}.png`),fullPage:true});
   if(stage<4)await act('#next');
  }
  await page.reload();assert.match(await page.locator('#result').textContent(),/All five coasts/);
  await act('#restart');await act('#cancel-confirm');assert.match(await page.locator('#round').textContent(),/8 \/ 8/);
  await act('#restart');await act('#accept-confirm');assert.match(await page.locator('#round').textContent(),/0 \/ 8/);
  // Real keyboard traversal and activation, regardless of touch context.
  await page.locator('[data-cell="0"]').focus();await page.keyboard.press('ArrowDown');assert.equal(await page.evaluate(()=>document.activeElement.dataset.cell),'6');
  await page.keyboard.press('3');await page.keyboard.press('r');
  // Corrupt saves are not silently destroyed.
  await page.evaluate(()=>localStorage.setItem('study-desk-reefwright-v1','{broken'));await page.reload();await act('[data-cell="0"]');await act('#plant');
  assert.equal(await page.evaluate(()=>localStorage.getItem('study-desk-reefwright-v1')),'{broken');
  await act('#reset-save');await act('#accept-confirm');assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('study-desk-reefwright-v1')).current.moves.length),1);
  await act('header a');await page.waitForURL('**/index.html#games');assert(await page.locator('#games').count()||await page.locator('#gameGrid').count()||await page.locator('.game').count());
  assert.deepEqual(errors,[]);console.log(`PASS ${mobile?'touch':'desktop'}: five complete campaigns, exact forecasts, reload, loss/reopen, restart, corrupt recovery, navigation and no browser errors`);
  await context.close();
 }
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();server.kill();});
