const {chromium}=require('playwright'),A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{spawn}=require('node:child_process'),E=require('../games/mycelium-yard/engine.js');
const root=path.join(__dirname,'..'),out=path.join(root,'test-artifacts/mycelium-yard');fs.mkdirSync(out,{recursive:true});
const server=spawn('python3',['-m','http.server','8187','--bind','127.0.0.1'],{cwd:root,stdio:'ignore'}),base='http://127.0.0.1:8187';let browser;
(async()=>{
 for(let i=0;i<50;i++){try{if((await fetch(base)).ok)break}catch{}await new Promise(r=>setTimeout(r,100))}
 browser=await chromium.launch();
 for(const touch of [false,true]){
  const ctx=await browser.newContext({viewport:touch?{width:390,height:844}:{width:1280,height:1000},hasTouch:touch,isMobile:touch}),p=await ctx.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
  const click=async id=>touch?p.locator(id).tap():p.locator(id).click(),raw=()=>p.evaluate(k=>localStorage.getItem(k),E.KEY),state=async()=>E.decode(await raw());
  await p.goto(base+'/games/mycelium-yard/index.html');await p.locator('#bed-0').waitFor();
  await p.evaluate(()=>localStorage.setItem('unrelated-save','keep'));
  await p.locator('#bed-0').focus();await p.keyboard.press('2');A.equal(await p.locator('#bed-1').getAttribute('aria-pressed'),'true');
  await p.locator('#crop-0').focus();await p.keyboard.press('Enter');A.equal((await state()).jobs,2);A.equal((await state()).beds[1].kind,0);
  await p.locator('#bed-1').focus();await p.keyboard.press('w');A.equal((await state()).beds[1].water,3);
  await p.keyboard.press('v');A.equal((await state()).beds[1].water,1);
  await p.keyboard.press('n');await p.keyboard.press('n');await p.keyboard.press('h');A.equal((await state()).sales,5);
  await p.locator('#bed-1').scrollIntoViewIfNeeded();await p.screenshot({path:path.join(out,(touch?'touch':'desktop')+'-keyboard-harvest.png')});
  const earned=await state();delete earned.order;delete earned.badges;
  await p.evaluate(([k,s])=>localStorage.setItem(k,s),[E.KEY,JSON.stringify(earned)]);await p.reload();await p.locator('#bed-0').waitFor();const migrated=await state();for(const k of Object.keys(earned))A.deepEqual(migrated[k],earned[k]);A.deepEqual(migrated.badges,Array(6).fill(false));
  await click('#retry');await click('#accept');await click('#buyer-1');await click('#crop-1');for(let i=0;i<4;i++)await click('#night');await click('#harvest');A.equal((await state()).sales,8);A.equal((await state()).order.stage,0);A.match(await p.locator('#log').innerText(),/at most 0/);
  await p.screenshot({path:path.join(out,(touch?'touch':'desktop')+'-late-harvest.png')});
  await click('#retry');await click('#accept');await click('#buyer-1');for(let i=0;i<3;i++)await click('#night');await click('#crop-1');await click('#night');await click('#night');await click('#night');await click('#harvest');A.equal((await state()).sales,7);A.equal((await state()).order.stage,0);A.match(await p.locator('#log').innerText(),/unrotted/);
  await click('#retry');await p.keyboard.press('Escape');await p.locator('#retry:enabled').waitFor();const stable=await raw();
  await p.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'))});A.ok(await p.locator('#night').isDisabled());A.equal(await raw(),stable);
  await p.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'))});await click('#pause');
  await click('#games');await p.waitForURL('**/index.html#games');A.equal(await raw(),stable);A.equal(await p.evaluate(()=>localStorage.getItem('unrelated-save')),'keep');
  // Same-origin parent fixture exercises the actual bridge and Collection message contract.
  await p.route('**/qualification-host.html',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><iframe id="game" style="width:100%;height:900px" src="/games/mycelium-yard/index.html"></iframe><script>window.events=[];addEventListener("message",e=>{if(e.origin===location.origin)events.push(e.data.type)})</script>'}));
  await p.goto(base+'/qualification-host.html');const f=p.frameLocator('#game');await f.locator('#bed-0').waitFor();
  const visibility=async visible=>{await p.evaluate(v=>document.querySelector('iframe').contentWindow.postMessage({type:'study-visibility',visible:v},location.origin),visible);await f.locator('#pause').getByText(visible?'Resume':'Resume').count()};
  await f.locator('#retry').click();await visibility(false);await f.locator('#accept:disabled').waitFor();const before=await raw();
  await f.locator('#accept').evaluate(el=>el.click());A.equal(await raw(),before);await visibility(true);await f.locator('#cancel').click();await f.locator('#pause:enabled').waitFor();await f.locator('#pause').click();
  await p.evaluate(k=>localStorage.setItem(k,'broken'),E.KEY);await p.reload();await f.locator('#recover').waitFor();await f.locator('#recover').click();await visibility(false);await f.locator('#accept:disabled').waitFor();await f.locator('#accept').evaluate(el=>el.click());A.equal(await raw(),'broken');await visibility(true);await f.locator('#cancel').click();await f.locator('#pause:enabled').waitFor();await f.locator('#pause').click();await f.locator('#recover').click();await f.locator('#accept').click();E.decode(await raw());
  await f.locator('#games').click();await p.waitForFunction(()=>events.includes('study-collection'));A.equal(await p.evaluate(()=>localStorage.getItem('unrelated-save')),'keep');
  A.deepEqual(errors,[]);await ctx.close();
 }
 console.log('PASS desktop/touch keyboard harvest, v1 migration, late/rotted buyer rejection, Escape, visibility/hidden-confirmation/recovery, scoped saves, Games navigation and actual bridge Collection contract');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{await browser?.close();server.kill()});
