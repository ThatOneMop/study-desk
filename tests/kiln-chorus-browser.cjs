'use strict';
const {chromium}=require('playwright'),A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{spawn}=require('node:child_process'),E=require('../games/kiln-chorus/engine.js');
const root=path.join(__dirname,'..'),out=path.join(root,'test-artifacts/kiln-chorus'),base='http://127.0.0.1:8168';fs.mkdirSync(out,{recursive:true});let browser;
const server=spawn('python3',['-m','http.server','8168','--bind','127.0.0.1'],{cwd:root,stdio:'ignore'});
const routes=[['stoke','stoke','bank','draw0','stoke','bank','draw1'],['stoke','stoke',{action:'stoke',shield:0},'draw0','stoke','draw2','bank','bank','draw1'],['stoke','stoke','bank','bank',{action:'stoke',shield:0},'draw0','draw1','stoke','stoke','vent','soak','draw2']];
(async()=>{for(let i=0;i<50;i++){try{if((await fetch(base)).ok)break}catch{}await new Promise(r=>setTimeout(r,100))}browser=await chromium.launch({headless:true});for(const touch of [false,true]){
 const context=await browser.newContext({viewport:touch?{width:390,height:844}:{width:1280,height:1000},hasTouch:touch,isMobile:touch}),page=await context.newPage(),prefix=touch?'touch':'desktop',errors=[];
 page.on('pageerror',e=>errors.push(e.message));const act=async l=>touch?await l.tap():await l.click(),click=async id=>act(page.locator(id)),raw=()=>page.evaluate(k=>localStorage.getItem(k),E.KEY),state=async()=>E.decode(await raw());
 const shot=async(name,id='#pieces')=>{await page.locator(id).scrollIntoViewIfNeeded();await page.screenshot({path:path.join(out,prefix+'-'+name+'.png')});A.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth))};
 async function move(a){await click('[data-action="'+(typeof a==='string'?a:a.action)+'"]');if(typeof a!=='string')await click('#shield'+a.shield);await click('#perform')}
 async function reload(){const s=await state();await page.reload();A.deepEqual(await state(),s);A.ok(await page.locator('#plan-panel').isHidden())}
 try{
  await page.goto(base+'/games/kiln-chorus/index.html');await shot('onboarding');const start=await raw();
  await click('#plan-toggle');for(let i=0;i<3;i++)await move('stoke');A.match(await page.locator('#status').innerText(),/Rehearsal.*overheated/);A.match(await page.locator('#pieces').innerText(),/remove the last planned action/);A.equal(await raw(),start);await shot('failed-rehearsal','#plan-panel');
  await click('#plan-back');await move('bank');A.doesNotMatch(await page.locator('#status').innerText(),/overheated/);await click('#plan-commit');A.deepEqual((await state()).moves,['stoke']);A.equal(await page.locator('#plan-list li').count(),2);await reload();A.equal((await state()).moves.length,1);await click('#undo');A.equal(await raw(),start);
  for(let level=0;level<3;level++){
   await click('#plan-toggle');const before=await raw();for(const a of routes[level])await move(a);A.match(await page.locator('#status').innerText(),/Rehearsal.*Load complete/);A.equal(await raw(),before);A.ok(await page.locator('#next').isHidden());await shot('winning-plan-'+level,'#plan-panel');
   for(let i=0;i<routes[level].length;i++){await click('#plan-commit');A.equal((await state()).moves.length,i+1);A.deepEqual(E.decode(await raw()),await state())}
   await click('#plan-toggle');await reload();A.equal((await state()).records[level],[3,4,2][level]);A.equal(E.board(await state()).phase,'won');await shot('saved-win-'+level);
   await click('#retry');await page.locator('#cancel').press('Escape');await page.waitForFunction(()=>!document.querySelector('#confirm').open&&!document.querySelector('#retry').disabled);A.equal(E.board(await state()).phase,'won');
   if(level<2)await click('#next');
  }
  await click('#retry');await click('#accept');A.equal((await state()).records[2],2);
  // Replay naturally to the delayed trap, then commit a real loss and recover it.
  for(const a of routes[2].slice(0,9))await move(a);await move('bank');A.equal(E.board(await state()).phase,'lost');A.match(await page.locator('#pieces').innerText(),/Overheated/);await shot('real-loss');await reload();await click('#undo');await move('vent');await move('soak');await move('draw2');A.equal(E.board(await state()).phase,'won');await reload();
  await click('#retry');await click('#accept');await click('#plan-toggle');await move('stoke');let old=await raw();await click('#pause');A.ok(await page.locator('#plan-panel').isHidden());await click('#pause');A.equal(await raw(),old);
  await click('#plan-toggle');await move('stoke');await click('#retry');await click('#cancel');A.ok(await page.locator('#plan-panel').isHidden());A.equal(await raw(),old);
  // Native keyboard activation must perform exactly one action per Enter.
  await page.locator('[data-action="stoke"]').press('Enter');await page.locator('#perform').press('Enter');A.equal((await state()).moves.length,1);await reload();
  await click('header a');await page.waitForURL('**/index.html#games');
  // Only failure fixtures use storage injection; campaign progress above is earned through UI.
  await page.goto(base+'/games/kiln-chorus/index.html');await page.evaluate(k=>{localStorage.setItem(k,'broken');localStorage.setItem('kiln-test-other','preserve')},E.KEY);await page.reload();await click('#plan-toggle');await move('stoke');await click('#plan-commit');A.equal(await raw(),'broken');await click('#recover');await click('#cancel');A.equal(await raw(),'broken');await click('#recover');await click('#accept');A.equal((await state()).moves.length,1);await click('#reset');await click('#accept');A.deepEqual(await state(),E.create());A.equal(await page.evaluate(()=>localStorage.getItem('kiln-test-other')),'preserve');await shot('reset');
  await page.evaluate(()=>Storage.prototype.setItem=function(){throw Error('quota')});await move('stoke');A.match(await page.locator('#save').innerText(),/temporary/);A.deepEqual(errors,[]);
  console.log('PASS',prefix,'three rehearsed/committed campaigns, delayed trap and branch, draft isolation, real loss/undo/retry, records/reload, native Escape/Enter, pause/dialog discard, scoped recovery/reset/quota, Games navigation, no overflow or page errors');
 }catch(e){await page.screenshot({path:path.join(out,prefix+'-failure.png'),fullPage:true});throw e}finally{await context.close()}
}})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{if(browser)await browser.close();server.kill()});
