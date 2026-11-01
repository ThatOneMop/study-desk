'use strict';
// Real Chromium inputs; campaign progress is earned through the rendered controls.
const {chromium}=require('playwright'),A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{spawn}=require('node:child_process');
const E=require('../games/ribbon-reef/engine.js'),routes=require('./fixtures/ribbon-reef-routes.json');
const root=path.join(__dirname,'..'),out=path.join(root,'test-artifacts/ribbon-reef'),base='http://127.0.0.1:8170';
fs.mkdirSync(out,{recursive:true});const server=spawn('python3',['-m','http.server','8170','--bind','127.0.0.1'],{cwd:root,stdio:'ignore'});let browser;
(async()=>{
 for(let i=0;i<50;i++){try{if((await fetch(base)).ok)break}catch{}await new Promise(r=>setTimeout(r,100))}
 browser=await chromium.launch();
 for(const touch of [false,true]){
  const context=await browser.newContext({viewport:touch?{width:390,height:844}:{width:1280,height:1000},hasTouch:touch,isMobile:touch}),page=await context.newPage(),cdp=await context.newCDPSession(page),prefix=touch?'touch':'desktop',errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{window.inputTrace=[];for(const type of ['pointerdown','pointerup','pointercancel','click'])document.addEventListener(type,e=>{window.inputTrace.push({type,target:e.target.id,x:e.clientX,y:e.clientY,touch:e.pointerType,pointerId:e.pointerId,time:Math.round(performance.now())});window.inputTrace=window.inputTrace.slice(-30)},true)});
  const click=async id=>touch?page.locator(id).tap():page.locator(id).click(),raw=()=>page.evaluate(k=>localStorage.getItem(k),E.KEY),state=async()=>E.decode(await raw());
  const shot=async(name,id='#water')=>{await page.locator(id).scrollIntoViewIfNeeded();await page.screenshot({path:path.join(out,prefix+'-'+name+'.png')});A.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no horizontal overflow')};
  const reload=async()=>{const before=await raw();await page.reload();await click('#start');A.equal(await raw(),before);A.equal(await page.locator('#casting-mode').inputValue(),'trace')};
  const trips=async()=>{const details=page.locator('details').filter({has:page.getByText('Trips & records',{exact:true})});if(await details.getAttribute('open')===null)await details.locator('summary').click()};
  async function draw(poly,mode='pins'){
   await page.locator('#casting-mode').selectOption(mode);await page.locator('#water').scrollIntoViewIfNeeded();const box=await page.locator('#water').boundingBox(),at=([x,y])=>({x:box.x+x*box.width/600,y:box.y+y*box.height/400});
   if(mode==='pins'){
    for(const p of poly){const q=at(p);if(touch)await page.touchscreen.tap(q.x,q.y);else await page.mouse.click(q.x,q.y)}
    A.ok(await page.locator('#haul').isDisabled());await click('#close-net');
   }else if(touch){
    await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...at(poly[0]),id:0}]});
    for(const p of poly.slice(1))await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{...at(p),id:0}]});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
   }else{
    const q=at(poly[0]);await page.mouse.move(q.x,q.y);await page.mouse.down();for(const p of poly.slice(1)){const q=at(p);await page.mouse.move(q.x,q.y)}await page.mouse.up();
   }
  }
  async function campaign(mode){
   for(let level=0;level<3;level++){
    for(let i=0;i<3;i++){
     const before=await raw();await draw(routes[level][i],mode);A.equal(await raw(),before,'preview never commits');A.match(await page.locator('#preview').innerText(),/Matches the order/);await shot(mode+'-reef'+level+'-net'+i);await click('#haul');await page.waitForFunction(n=>document.querySelector('#order').textContent.includes(n===3?'All orders delivered':'Order '+(n+1)+' / 3'),i+1,{timeout:3000});A.equal(E.board(await state()).order,i+1);A.equal(E.board(await state()).frays,0);await reload();
    }
    const s=await state(),b=E.board(s);A.equal(b.phase,'won');A.equal(s.records[level],b.rope);A.match(await page.locator('#condition').innerText(),new RegExp(b.rope+' rope'));await shot(mode+'-reef'+level+'-win','#result');if(level<2)await click('#next');
   }
   console.log(prefix,mode,'records',JSON.stringify((await state()).records));
  }
  try{
   await page.goto(base+'/games/ribbon-reef/index.html');await click('#start');await shot('onboarding');
   await campaign('pins');await trips();await click('#reef0');await click('#accept');await campaign('trace');
   await trips();await click('#reef0');await click('#accept');const records=(await state()).records;
   // Closed-corner repair, using actual controls and water keyboard focus.
   await draw([[90,80],[250,80],[250,155],[190,155]]);A.ok(await page.locator('#haul').isDisabled());await click('#edit');await page.locator('#corner').selectOption('3');await page.locator('#water').focus();for(let i=0;i<10;i++)await page.keyboard.press('ArrowLeft');A.match(await page.locator('#preview').innerText(),/Matches the order/);await shot('repaired-corner');await click('#haul');await reload();A.equal(E.board(await state()).order,1);
   await trips();await click('#retry');await page.locator('#cancel').press('Escape');await page.waitForFunction(()=>!document.querySelector('#confirm').open&&!document.querySelector('#retry').disabled);A.equal((await state()).moves.length,1);await click('#retry');await click('#accept');A.deepEqual((await state()).records,records);
   // Both keyboard modes, and Enter closes before committing in pin mode.
   for(const mode of ['trace','pins']){
    await page.locator('#casting-mode').selectOption(mode);await page.locator('#water').focus();
    // A reload restores the needle to the documented initial position.
    await reload();await page.locator('#casting-mode').selectOption(mode);await page.locator('#water').focus();await page.keyboard.press('ArrowRight');await page.keyboard.press('Space');
    for(const [key,n] of [['ArrowRight',16],['ArrowDown',8],['ArrowLeft',16]]){for(let i=0;i<n;i++)await page.keyboard.press(key);if(mode==='pins')await page.keyboard.press('Space')}
    await page.keyboard.press(mode==='pins'?'Enter':'Space');A.equal((await state()).moves.length,0);A.match(await page.locator('#preview').innerText(),/Matches the order/);await page.keyboard.press('Enter');A.equal(E.board(await state()).order,1);await trips();await click('#retry');await click('#accept');
   }
   // An unfinished pin can be removed; pausing discards only the draft.
   await page.locator('#casting-mode').selectOption('pins');await page.locator('#water').focus();await page.keyboard.press('Space');await page.keyboard.press('ArrowRight');await page.keyboard.press('Space');await click('#unpin');A.equal(await page.locator('#handles circle').count(),1);await page.locator('#water').focus();await page.keyboard.press('Backspace');A.equal(await page.locator('#net').getAttribute('d'),'');
   await draw(routes[0][0]);const saved=await raw();await click('#pause');A.ok(await page.locator('#haul').isDisabled());await click('#pause');A.equal(await page.locator('#net').getAttribute('d'),'');A.equal(await raw(),saved);
   // Invalid shape consumes nothing; wrong deliveries lose and can be undone/retried.
   await draw([[50,50],[150,150],[50,150],[150,50]]);A.ok(await page.locator('#haul').isDisabled());A.match(await page.locator('#preview').innerText(),/crosses itself/);A.equal(await raw(),saved);await shot('crossing-rejected');
   const wrong=[[30,30],[70,30],[70,70],[30,70]];
   for(let i=0;i<3;i++){await draw(wrong);await click('#haul')}
   A.equal(E.board(await state()).phase,'lost');await shot('loss','#result');await reload();await click('#undo');A.equal(E.board(await state()).frays,2);A.equal(E.board(await state()).phase,'active');await trips();await click('#retry');await click('#accept');A.deepEqual((await state()).records,records);await draw(routes[0][0]);await click('#haul');A.equal(E.board(await state()).order,1);
   await click('#collection');await page.waitForURL('**/index.html#games');await page.goto(base+'/games/ribbon-reef/index.html');await click('#start');A.equal(E.board(await state()).order,1);
   // Only failure fixtures inject storage; no campaign or unlocked reef is injected.
   await page.evaluate(k=>{localStorage.setItem(k,'broken');localStorage.setItem('ribbon-other-game','keep')},E.KEY);await page.reload();await click('#start');await draw(routes[0][0]);await click('#haul');A.equal(await raw(),'broken');await click('#recover');await click('#cancel');A.equal(await raw(),'broken');await click('#recover');await click('#accept');A.equal(E.board(await state()).order,1);await trips();await click('#reset');await click('#accept');A.deepEqual(await state(),E.create());A.equal(await page.evaluate(()=>localStorage.getItem('ribbon-other-game')),'keep');await shot('reset');
   await page.evaluate(()=>Storage.prototype.setItem=function(){throw Error('quota')});await draw(routes[0][0]);await click('#haul');A.match(await page.locator('#save').innerText(),/temporary/);A.match(await page.locator('#order').innerText(),/Order 2/);A.deepEqual(errors,[]);
   console.log('PASS',prefix,'3 reefs × 2 casting modes, reload each haul, earned unlocks, repair, keyboard, unpin, pause, invalid net, loss/undo/retry, native Escape, navigation, corruption/reset/quota, overflow');
  }catch(e){console.log('INPUT TRACE',JSON.stringify(await page.evaluate(()=>window.inputTrace)));await page.screenshot({path:path.join(out,prefix+'-failure.png'),fullPage:true});throw e}finally{await context.close()}
 }
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{if(browser)await browser.close();server.kill()});
