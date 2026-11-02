'use strict';
const {chromium}=require('playwright'),A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{spawn}=require('node:child_process'),E=require('../games/glimmer-loom/engine.js');
const root=path.join(__dirname,'..'),out=path.join(root,'test-artifacts/glimmer-loom-catalog'),base='http://127.0.0.1:8184';fs.mkdirSync(out,{recursive:true});const server=spawn('python3',['-m','http.server','8184','--bind','127.0.0.1'],{cwd:root,stdio:'ignore'});let browser;
(async()=>{for(let n=0;n<50;n++){try{if((await fetch(base)).ok)break}catch{}await new Promise(r=>setTimeout(r,100))}browser=await chromium.launch();for(const touch of [false,true]){
 const context=await browser.newContext({viewport:touch?{width:390,height:844}:{width:1280,height:1000},hasTouch:touch,isMobile:touch}),page=await context.newPage(),errors=[],prefix=touch?'touch':'desktop';page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('favicon.ico'))errors.push(r.status()+' '+r.url())});
 const act=async l=>touch?l.tap():l.click(),raw=()=>page.evaluate(k=>localStorage.getItem(k),E.KEY),shot=name=>page.screenshot({path:path.join(out,prefix+'-'+name+'.png'),fullPage:true});
 try{await page.goto(base+'/index.html#games');A.equal(await page.getByRole('button',{name:/switch workspace/i}).count(),0);await page.locator('#search').fill('Glimmer Loom');A.equal(await page.locator('#games .game').count(),1);await page.locator('#groupBy').selectOption('collection');await page.locator('#sortGames').selectOption('az');A.match(await page.locator('#games').innerText(),/Indie collection three/);await act(page.locator('#games [data-action="favourite"]'));await act(page.locator('#filters').getByRole('button',{name:'Favourites',exact:true}));await shot('catalogue');await act(page.locator('#games [data-action="play"]'));const f=page.frameLocator('#frame');await f.locator('#title').waitFor();await page.waitForFunction(()=>document.querySelector('#loadStatus').hidden);A.equal(await page.locator('#playing').textContent(),'Glimmer Loom');






 await act(f.locator('#sketch-toggle'));
 for(const i of [6,13]){await act(f.locator('#cell-'+i));await act(f.locator('#slash'));}
 A.equal(E.decode(await raw()).moves.length,0);await shot('ray-sketch');
 await act(f.locator('#sketch-apply'));await act(f.locator('#sketch-apply'));
 const saved=await raw();A.ok(E.trace(0,E.board(E.decode(saved))).won);A.match(await f.locator('#status').innerText(),/Both ribbons caught/);await f.locator('.board').scrollIntoViewIfNeeded();await shot('window-complete');

 await act(f.locator('#retry'));await act(page.locator('#pauseGame'));await page.locator('#pauseCover').waitFor({state:'visible'});A.equal(await raw(),saved);await act(page.locator('#resumeGame'));await act(f.locator('#cancel'));await act(f.locator('#pause'));A.ok(await f.locator('#retry').isEnabled());await act(page.locator('#libraryBtn'));await page.locator('#arcade').waitFor({state:'visible'});A.equal(await raw(),saved);await act(page.locator('#games [data-action="play"]'));await act(f.locator('#pause'));A.equal(await raw(),saved);
 page.once('dialog',d=>d.accept());await act(page.locator('#restartGame'));await f.locator('#title').waitFor();await page.waitForFunction(()=>document.querySelector('#loadStatus').hidden);A.equal(await raw(),saved);await act(f.locator('header a'));await page.locator('#arcade').waitFor({state:'visible'});A.equal(await page.locator('#player').isVisible(),false);A.equal(await page.locator('#games [data-action="favourite"]').getAttribute('aria-pressed'),'true');await act(page.locator('#games [data-action="play"]'));await f.locator('#title').waitFor();A.equal(await raw(),saved);await f.locator('#status').scrollIntoViewIfNeeded();await shot('saved-return');A.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));const gf=page.frames().find(f=>f.url().includes('/games/glimmer-loom/'));A.ok(await gf.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));A.deepEqual(errors,[]);console.log('PASS',prefix,'catalogue search/group/sort/favourite, ray sketch, earned optical completion, bridge pause with confirmation, Collection/Games navigation, restart/save retention; no errors/overflow');
 }catch(e){await shot('failure');throw e}finally{await context.close()}
}})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{if(browser)await browser.close();server.kill()});
