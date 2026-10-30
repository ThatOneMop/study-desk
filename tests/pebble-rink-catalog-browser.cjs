'use strict';
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{spawn}=require('node:child_process');
const root=path.join(__dirname,'..'),out=path.join(root,'test-artifacts/pebble-catalog'),base='http://127.0.0.1:8156',key='study-desk-pebble-rink-v1';
fs.mkdirSync(out,{recursive:true});const server=spawn('python3',['-m','http.server','8156','--bind','127.0.0.1'],{cwd:root,stdio:'ignore'});let browser;
(async()=>{
 for(let n=0;n<50;n++){try{if((await fetch(base)).ok)break}catch{}await new Promise(r=>setTimeout(r,100));}
 browser=await chromium.launch({headless:true});
 for(const touch of [false,true]){
  const context=await browser.newContext({viewport:touch?{width:390,height:844}:{width:1280,height:1000},hasTouch:touch,isMobile:touch}),page=await context.newPage(),errors=[],prefix=touch?'touch':'desktop';
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('favicon.ico'))errors.push(r.status()+' '+r.url())});
  const act=async locator=>{await locator.scrollIntoViewIfNeeded();if(touch)await locator.tap();else await locator.click()},shot=name=>page.screenshot({path:path.join(out,prefix+'-'+name+'.png'),fullPage:true}),raw=()=>page.evaluate(k=>localStorage.getItem(k),key);
  try{
   await page.goto(base+'/index.html#games');
   assert.equal(await page.getByRole('button',{name:/switch workspace/i}).count(),0);
   await page.locator('#search').fill('pebble rink');assert.equal(await page.locator('#games .game').count(),1);
   await page.locator('#groupBy').selectOption('collection');await page.locator('#sortGames').selectOption('az');
   assert.match(await page.locator('#games').innerText(),/Indie collection three/);
   await act(page.locator('#games [data-action="favourite"]'));await act(page.locator('#filters').getByRole('button',{name:'Favourites',exact:true}));
   assert.equal(await page.locator('#games .game').count(),1);await shot('search-favourite');
   await act(page.locator('#games [data-action="play"]'));const frame=page.frameLocator('#frame');await frame.locator('#courses button').first().waitFor();
   await page.waitForFunction(()=>document.querySelector('#loadStatus').hidden);assert.equal(await page.locator('#playing').textContent(),'Pebble Rink');
   const power=frame.locator('#power');await power.scrollIntoViewIfNeeded();
   const bounds=await power.boundingBox();
   if(touch){
    const cdp=await context.newCDPSession(page),y=bounds.y+bounds.height/2;
    await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:bounds.x+bounds.width/2,y}]});
    for(const fraction of [.6,.7,.8])await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:bounds.x+bounds.width*fraction,y}]});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await cdp.detach();
   }else{await page.mouse.move(bounds.x+bounds.width/2,bounds.y+bounds.height/2);await page.mouse.down();await page.mouse.move(bounds.x+bounds.width*.8,bounds.y+bounds.height/2,{steps:6});await page.mouse.up()}
   assert(Number(await power.inputValue())>80,'range drag changes weight');
   assert.equal(JSON.parse(await raw()).setup.power,Number(await power.inputValue()));
   const rink=frame.locator('#rink');await rink.scrollIntoViewIfNeeded();const rb=await rink.boundingBox();
   if(touch)await rink.tap({position:{x:rb.width*.7,y:rb.height*.35}});else await rink.click({position:{x:rb.width*.7,y:rb.height*.35}});
   assert(Number(await frame.locator('#angle').inputValue())<0);
   await frame.locator('#angle').focus();await page.keyboard.press('Home');for(let n=0;n<45;n++)await page.keyboard.press('ArrowRight');
   await power.focus();await page.keyboard.press('Home');for(let n=0;n<35;n++)await page.keyboard.press('ArrowRight');
   await act(frame.locator('#forecast'));assert.match(await frame.locator('#forecast-note').innerText(),/Forecast only/);await shot('forecast');
   await act(frame.locator('#throw'));
   await page.waitForFunction(()=>!document.querySelector('#frame').contentDocument.querySelector('#throw').disabled,{},{timeout:30000});
   const saved=await raw();assert.equal(JSON.parse(saved).shots.length,1);await shot('launched');
   await act(page.locator('#pauseGame'));assert(await page.locator('#pauseCover').isVisible());assert.equal(await raw(),saved);
   await act(page.locator('#resumeGame'));assert.equal(await frame.locator('#pause').textContent(),'Resume');await act(frame.locator('#pause'));
   assert(await frame.locator('#throw').isEnabled());
   await act(page.locator('#libraryBtn'));assert(await page.locator('#arcade').isVisible());assert.equal(await raw(),saved);
   await act(page.locator('#games [data-action="play"]'));assert.equal(await raw(),saved);assert.equal(await frame.locator('#pause').textContent(),'Resume');await act(frame.locator('#pause'));
   page.once('dialog',d=>d.accept());await act(page.locator('#restartGame'));await frame.locator('#courses button').first().waitFor();await page.waitForFunction(()=>document.querySelector('#loadStatus').hidden);assert.equal(await raw(),saved);
   // In-game Games must leave the player, rather than nesting another launcher in its iframe.
   await act(frame.locator('header a'));await page.waitForURL('**/index.html#games');await page.locator('#search').waitFor();
   assert(await page.locator('#arcade').isVisible());assert.equal(await page.locator('#player').isVisible(),false);assert.equal(await raw(),saved);
   await page.locator('#search').fill('pebble rink');assert.equal(await page.locator('#games .game').count(),1);assert.equal(await page.locator('#games [data-action="favourite"]').getAttribute('aria-pressed'),'true');
   await act(page.locator('#games [data-action="play"]'));await frame.locator('#courses button').first().waitFor();assert.equal(await raw(),saved);await shot('saved-return');
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   const gameFrame=page.frames().find(f=>f.url().includes('/games/pebble-rink/'));assert(await gameFrame.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   assert.deepEqual(errors,[]);console.log('PASS',prefix,'catalogue search/group/sort/favourite, range drag, canvas aim, animated shot, real launch, bridge pause, Collection return, restart, top-level Games and saved re-entry; no horizontal overflow or page/asset errors');
  }catch(e){await shot('failure');throw e}finally{await context.close()}
 }
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{if(browser)await browser.close();server.kill()});
