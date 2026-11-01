'use strict';
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{spawn}=require('node:child_process');
const E=require('../games/field-album/engine.js'),route=require('./fixtures/field-album-studies.json').find(r=>r.level===0&&r.goal===0);
const root=path.join(__dirname,'..'),out=path.join(root,'test-artifacts/field-album-catalog'),base='http://127.0.0.1:8168',key='study-desk-field-album-v1';
fs.mkdirSync(out,{recursive:true});const server=spawn('python3',['-m','http.server','8168','--bind','127.0.0.1'],{cwd:root,stdio:'ignore'});let browser;
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
   await page.locator('#search').fill('Field Album');assert.equal(await page.locator('#games .game').count(),1);
   await page.locator('#groupBy').selectOption('collection');await page.locator('#sortGames').selectOption('az');
   assert.match(await page.locator('#games').innerText(),/Indie collection three/);
   await act(page.locator('#games [data-action="favourite"]'));await act(page.locator('#filters').getByRole('button',{name:'Favourites',exact:true}));
   assert.equal(await page.locator('#games .game').count(),1);await shot('search-favourite');
   await act(page.locator('#games [data-action="play"]'));const frame=page.frameLocator('#frame');await frame.locator('#start').waitFor();
   await page.waitForFunction(()=>document.querySelector('#loadStatus').hidden);assert.equal(await page.locator('#playing').textContent(),'Field Album');
   await act(frame.locator('#start'));
   for(const a of route.moves){
    if(a.type==='survey')await act(frame.locator('#survey'+a.habitat));
    else{await act(frame.locator('#card'+a.card));await act(frame.locator('#plot'+a.p));await act(frame.locator('#place'))}
   }
   assert.match(await frame.locator('#status').innerText(),/Trail target reached/);
   await act(frame.locator('#studies-title'));assert.match(await frame.locator('#studies article').first().innerText(),/Confirmed on this page/);
   await frame.locator('#album').scrollIntoViewIfNeeded();await shot('habitat-victory');
   const saved=await raw();assert.equal(JSON.parse(saved).records[0],route.total);
   assert.equal(E.studies(E.board(E.decode(saved)).cells,0)[0].met,true);
   await act(frame.locator('#rearrange'));await act(frame.locator('#plot0'));
   const cells=E.board(E.decode(saved)).cells,to=cells.findIndex(v=>v!==cells[0]);
   await act(frame.locator('#plot'+to));assert.equal(await raw(),saved);
   await frame.locator('#forecast').scrollIntoViewIfNeeded();await shot('relationship-preview');
   await act(frame.locator('#place'));await act(frame.locator('#undo'));assert.equal(await raw(),saved);
   await act(frame.locator('#reset'));await act(page.locator('#pauseGame'));await page.waitForFunction(()=>document.querySelector('#frame').contentDocument.querySelector('#accept').disabled);assert(await page.locator('#pauseCover').isVisible());assert.equal(await raw(),saved);
   await act(page.locator('#resumeGame'));await act(frame.locator('#cancel'));assert.equal(await frame.locator('#pause').textContent(),'Resume');await act(frame.locator('#pause'));
   assert(await frame.locator('#retry').isEnabled());
   await act(page.locator('#libraryBtn'));assert(await page.locator('#arcade').isVisible());assert.equal(await raw(),saved);
   await act(page.locator('#games [data-action="play"]'));assert.equal(await raw(),saved);assert.equal(await frame.locator('#pause').textContent(),'Resume');await act(frame.locator('#pause'));
   page.once('dialog',d=>d.accept());await act(page.locator('#restartGame'));await frame.locator('#start').waitFor();await act(frame.locator('#start'));await page.waitForFunction(()=>document.querySelector('#loadStatus').hidden);assert.equal(await raw(),saved);
   // In-game Games must leave the player, rather than nesting another launcher in its iframe.
   await act(frame.locator('header a'));await page.waitForURL('**/index.html#games');await page.locator('#search').waitFor();
   assert(await page.locator('#arcade').isVisible());assert.equal(await page.locator('#player').isVisible(),false);assert.equal(await raw(),saved);
   await page.locator('#search').fill('Field Album');assert.equal(await page.locator('#games .game').count(),1);assert.equal(await page.locator('#games [data-action="favourite"]').getAttribute('aria-pressed'),'true');
   await act(page.locator('#games [data-action="play"]'));await frame.locator('#play').waitFor();assert.equal(await raw(),saved);await frame.locator('#album').scrollIntoViewIfNeeded();await shot('saved-return');
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   const gameFrame=page.frames().find(f=>f.url().includes('/games/field-album/'));assert(await gameFrame.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   assert.deepEqual(errors,[]);console.log('PASS',prefix,'catalogue search/group/sort/favourite, ecology completion, rearrangement preview/undo and retained record, real launch, bridge pause, Collection return, restart, top-level Games and saved re-entry; no horizontal overflow or page/asset errors');
  }catch(e){await shot('failure');throw e}finally{await context.close()}
 }
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{if(browser)await browser.close();server.kill()});

