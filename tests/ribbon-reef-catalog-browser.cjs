'use strict';
const {chromium}=require('playwright'),A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{spawn}=require('node:child_process');
const E=require('../games/ribbon-reef/engine.js'),routes=require('./fixtures/ribbon-reef-routes.json'),root=path.join(__dirname,'..'),out=path.join(root,'test-artifacts/ribbon-reef-catalog'),base='http://127.0.0.1:8171';
fs.mkdirSync(out,{recursive:true});const server=spawn('python3',['-m','http.server','8171','--bind','127.0.0.1'],{cwd:root,stdio:'ignore'});let browser;
(async()=>{
 for(let n=0;n<50;n++){try{if((await fetch(base)).ok)break}catch{}await new Promise(r=>setTimeout(r,100))}
 browser=await chromium.launch();
 for(const touch of [false,true]){
  const context=await browser.newContext({viewport:touch?{width:390,height:844}:{width:1280,height:1000},hasTouch:touch,isMobile:touch}),page=await context.newPage(),errors=[],prefix=touch?'touch':'desktop';
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('favicon.ico'))errors.push(r.status()+' '+r.url())});
  const act=async l=>touch?l.tap():l.click(),raw=()=>page.evaluate(k=>localStorage.getItem(k),E.KEY),shot=name=>page.screenshot({path:path.join(out,prefix+'-'+name+'.png'),fullPage:true});
  try{
   await page.goto(base+'/index.html#games');A.equal(await page.getByRole('button',{name:/switch workspace/i}).count(),0);
   await page.locator('#search').fill('Ribbon Reef');A.equal(await page.locator('#games .game').count(),1);await page.locator('#groupBy').selectOption('collection');await page.locator('#sortGames').selectOption('az');A.match(await page.locator('#games').innerText(),/Indie collection three/);
   await act(page.locator('#games [data-action="favourite"]'));await act(page.locator('#filters').getByRole('button',{name:'Favourites',exact:true}));A.equal(await page.locator('#games .game').count(),1);await shot('search-favourite');
   await act(page.locator('#games [data-action="play"]'));const frame=page.frameLocator('#frame');await frame.locator('#start').waitFor();await page.waitForFunction(()=>document.querySelector('#loadStatus').hidden);A.equal(await page.locator('#playing').textContent(),'Ribbon Reef');await act(frame.locator('#start'));
   async function pins(poly){await frame.locator('#casting-mode').selectOption('pins');await frame.locator('#water').scrollIntoViewIfNeeded();const box=await frame.locator('#water').boundingBox();for(const [x,y] of poly){const px=box.x+x*box.width/600,py=box.y+y*box.height/400;if(touch)await page.touchscreen.tap(px,py);else await page.mouse.click(px,py)}await act(frame.locator('#close-net'))}
   for(const poly of routes[0]){const before=await raw();await pins(poly);A.equal(await raw(),before);A.match(await frame.locator('#preview').innerText(),/Matches the order/);await act(frame.locator('#haul'))}
   const saved=await raw(),s=E.decode(saved);A.equal(E.board(s).phase,'won');A.equal(s.records[0],E.board(s).rope);await frame.locator('#result').scrollIntoViewIfNeeded();await shot('reef-victory');
   await act(frame.locator('summary').filter({hasText:'Trips & records'}));await act(frame.locator('#reset'));await act(page.locator('#pauseGame'));await page.waitForFunction(()=>document.querySelector('#frame').contentDocument.querySelector('#accept').disabled);A.ok(await page.locator('#pauseCover').isVisible());A.equal(await raw(),saved);
   await act(page.locator('#resumeGame'));await act(frame.locator('#cancel'));A.equal(await frame.locator('#pause').textContent(),'Resume');await act(frame.locator('#pause'));A.ok(await frame.locator('#retry').isEnabled());
   await act(page.locator('#libraryBtn'));A.ok(await page.locator('#arcade').isVisible());A.equal(await raw(),saved);await act(page.locator('#games [data-action="play"]'));await act(frame.locator('#pause'));A.equal(await raw(),saved);
   page.once('dialog',d=>d.accept());await act(page.locator('#restartGame'));await frame.locator('#start').waitFor();await act(frame.locator('#start'));await page.waitForFunction(()=>document.querySelector('#loadStatus').hidden);A.equal(await raw(),saved);
   await act(frame.locator('#collection'));await page.waitForURL('**/index.html#games');await page.locator('#arcade').waitFor({state:'visible'});A.ok(await page.locator('#arcade').isVisible());A.equal(await page.locator('#player').isVisible(),false);await page.locator('#search').fill('Ribbon Reef');A.equal(await page.locator('#games [data-action="favourite"]').getAttribute('aria-pressed'),'true');await act(page.locator('#games [data-action="play"]'));await frame.locator('#play').waitFor();A.equal(await raw(),saved);await frame.locator('#water').scrollIntoViewIfNeeded();await shot('saved-return');
   A.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));const gf=page.frames().find(f=>f.url().includes('/games/ribbon-reef/'));A.ok(await gf.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));A.deepEqual(errors,[]);
   console.log('PASS',prefix,'search/group/sort/favourite, pin-cast victory, earned record, pause during reset, Collection return, restart, in-game Games top-level return and retained save; no overflow or page/asset errors');
  }catch(e){await shot('failure');throw e}finally{await context.close()}
 }
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{if(browser)await browser.close();server.kill()});
