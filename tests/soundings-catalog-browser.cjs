'use strict';
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{spawn}=require('node:child_process');
const root=path.join(__dirname,'..'),out=path.join(root,'test-artifacts/soundings-catalog'),base='http://127.0.0.1:8165',key='study-desk-soundings-v1';
fs.mkdirSync(out,{recursive:true});const server=spawn('python3',['-m','http.server','8165','--bind','127.0.0.1'],{cwd:root,stdio:'ignore'});let browser;
(async()=>{
 for(let n=0;n<50;n++){try{if((await fetch(base)).ok)break}catch{}await new Promise(r=>setTimeout(r,100));}
 browser=await chromium.launch({headless:true});
 for(const touch of [false,true]){
  const context=await browser.newContext({viewport:touch?{width:390,height:844}:{width:1280,height:1000},hasTouch:touch,isMobile:touch}),page=await context.newPage(),errors=[],prefix=touch?'touch':'desktop';
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('favicon.ico'))errors.push(r.status()+' '+r.url())});
  const act=async locator=>{if(touch)await locator.tap();else await locator.click()},shot=name=>page.screenshot({path:path.join(out,prefix+'-'+name+'.png'),fullPage:true}),raw=()=>page.evaluate(k=>localStorage.getItem(k),key);
  try{
   await page.goto(base+'/index.html#games');
   assert.equal(await page.getByRole('button',{name:/switch workspace/i}).count(),0);
   await page.locator('#search').fill('soundings');assert.equal(await page.locator('#games .game').count(),1);
   await page.locator('#groupBy').selectOption('collection');await page.locator('#sortGames').selectOption('az');
   assert.match(await page.locator('#games').innerText(),/Indie collection three/);
   await act(page.locator('#games [data-action="favourite"]'));await act(page.locator('#filters').getByRole('button',{name:'Favourites',exact:true}));
   assert.equal(await page.locator('#games .game').count(),1);await shot('search-favourite');
   await act(page.locator('#games [data-action="play"]'));const frame=page.frameLocator('#frame');await frame.locator('#board .cell').first().waitFor();
   await page.waitForFunction(()=>document.querySelector('#loadStatus').hidden);assert.equal(await page.locator('#playing').textContent(),'Soundings');
   for(const [p,type] of [[12,'bearing'],[0,'scan'],[1,'bearing'],[1,'recover'],[7,'recover']]){await act(frame.locator('#cell-'+p));await act(frame.locator('#'+type));}
   assert.match(await frame.locator('#status').innerText(),/Sector complete/);await shot('sector-victory');
   const saved=await raw();assert.equal(JSON.parse(saved).records[0],3);
   await act(page.locator('#pauseGame'));assert(await page.locator('#pauseCover').isVisible());assert.equal(await raw(),saved);
   await act(page.locator('#resumeGame'));assert.equal(await frame.locator('#pause').textContent(),'Resume');await act(frame.locator('#pause'));
   assert(await frame.locator('#retry').isEnabled());
   await act(page.locator('#libraryBtn'));assert(await page.locator('#arcade').isVisible());assert.equal(await raw(),saved);
   await act(page.locator('#games [data-action="play"]'));assert.equal(await raw(),saved);assert.equal(await frame.locator('#pause').textContent(),'Resume');await act(frame.locator('#pause'));
   page.once('dialog',d=>d.accept());await act(page.locator('#restartGame'));await frame.locator('#board .cell').first().waitFor();await page.waitForFunction(()=>document.querySelector('#loadStatus').hidden);assert.equal(await raw(),saved);
   // In-game Games must leave the player, rather than nesting another launcher in its iframe.
   await act(frame.locator('header a'));await page.waitForURL('**/index.html#games');await page.locator('#search').waitFor();
   assert(await page.locator('#arcade').isVisible());assert.equal(await page.locator('#player').isVisible(),false);assert.equal(await raw(),saved);
   await page.locator('#search').fill('soundings');assert.equal(await page.locator('#games .game').count(),1);assert.equal(await page.locator('#games [data-action="favourite"]').getAttribute('aria-pressed'),'true');
   await act(page.locator('#games [data-action="play"]'));await frame.locator('#board .cell').first().waitFor();assert.equal(await raw(),saved);await shot('saved-return');
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   const gameFrame=page.frames().find(f=>f.url().includes('/games/soundings/'));assert(await gameFrame.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   assert.deepEqual(errors,[]);console.log('PASS',prefix,'catalogue search/group/sort/favourite, sector completion and retained record, real launch, bridge pause, Collection return, restart, top-level Games and saved re-entry; no horizontal overflow or page/asset errors');
  }catch(e){await shot('failure');throw e}finally{await context.close()}
 }
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{if(browser)await browser.close();server.kill()});


