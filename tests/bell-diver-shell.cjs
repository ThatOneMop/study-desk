const {chromium}=require('playwright'),A=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs'),{spawn}=require('node:child_process');
const E=require('../games/bell-diver/engine.js');
const root=path.join(__dirname,'..'),out=path.join(root,'test-artifacts/bell-diver');fs.mkdirSync(out,{recursive:true});
const server=spawn('python3',['-m','http.server','8192','--bind','127.0.0.1'],{cwd:root,stdio:'ignore'});let browser;
(async()=>{
 for(let i=0;i<50;i++){try{if((await fetch('http://127.0.0.1:8192')).ok)break}catch{}await new Promise(r=>setTimeout(r,100))}
 browser=await chromium.launch();
 for(const touch of [false,true]){
  const ctx=await browser.newContext({viewport:touch?{width:390,height:844}:{width:1280,height:1000},hasTouch:touch,isMobile:touch}),p=await ctx.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.route('**/shell-fixture.html',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0}iframe{width:100%;height:100vh;border:0}</style><iframe src="/games/bell-diver/index.html"></iframe><script>window.messages=[];addEventListener("message",e=>{if(e.source===document.querySelector("iframe").contentWindow&&e.origin===location.origin)messages.push(e.data.type)})</script>'}));
  await p.goto('http://127.0.0.1:8192/shell-fixture.html');const f=p.frames().find(f=>f.url().includes('/games/'));await f.locator('#board').waitFor();
  const click=async id=>touch?f.locator(id).tap():f.locator(id).click(),raw=()=>f.evaluate(k=>localStorage.getItem(k),E.KEY);
  await f.evaluate(()=>localStorage.setItem('study-desk-unrelated-qualification','KEEP'));
  await click('#down');A.equal(E.decode(await raw()).pos,7);
  const before=await raw();await f.locator('#board').focus();
  for(const props of [{repeat:true},{ctrlKey:true},{altKey:true},{metaKey:true},{isComposing:true}])await f.locator('#board').dispatchEvent('keydown',{key:'ArrowDown',bubbles:true,...props});
  A.equal(await raw(),before);
  // Real parent/source/origin messaging exercises the repository bridge, not a mock bridge.
  const visible=async value=>{await p.evaluate(v=>document.querySelector('iframe').contentWindow.postMessage({type:'study-visibility',visible:v},location.origin),value);await p.waitForFunction(v=>document.querySelector('iframe').contentWindow.StudyBridge.paused===!v,value)};
  await click('#retry');await visible(false);A.ok(await f.locator('#accept').isDisabled());
  await f.evaluate(()=>document.getElementById('accept').click());A.equal(await raw(),before);
  await visible(true);A.ok(await f.locator('#accept').isDisabled());await click('#cancel');await click('#pause');
  await click('#retry');await f.locator('#accept').focus();await p.keyboard.press('Enter');A.equal(E.decode(await raw()).pos,2);
  A.equal(await f.evaluate(()=>localStorage.getItem('study-desk-unrelated-qualification')),'KEEP');
  // A sibling/self message must not impersonate the real parent.
  await f.evaluate(()=>window.postMessage({type:'study-visibility',visible:false},location.origin));await f.evaluate(()=>new Promise(r=>setTimeout(r,30)));A.equal(await f.evaluate(()=>StudyBridge.paused),false);
  // Simulated document visibility is explicitly distinct from physical tab switching.
  await f.evaluate(()=>{Object.defineProperty(document,'hidden',{value:true,configurable:true});document.dispatchEvent(new Event('visibilitychange'))});
  const stationary=await raw();await f.evaluate(()=>document.getElementById('right').click());A.equal(await raw(),stationary);
  await f.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'))});await click('#pause');
  // Native keyboard on the board still works after the shell resumes.
  await f.locator('#board').focus();await p.keyboard.press('ArrowDown');A.equal(E.decode(await raw()).pos,7);
  await p.keyboard.press('Space');A.deepEqual(E.decode(await raw()).cargo,[0]);await p.keyboard.press('ArrowDown');const depleted=E.decode(await raw()).air;await p.keyboard.press('b');A.ok(E.decode(await raw()).air>depleted);A.deepEqual(E.decode(await raw()).usedAir,[12]);
  await p.screenshot({path:path.join(out,(touch?'touch':'desktop')+'-shell-resumed.png')});
  await f.evaluate(k=>localStorage.setItem(k,'unreadable original bytes'),E.KEY);await f.goto(f.url());await f.locator('#recover').waitFor();
  await click('#recover');await visible(false);await f.evaluate(()=>document.getElementById('accept').click());A.equal(await raw(),'unreadable original bytes');
  await visible(true);await click('#cancel');await click('#pause');await click('#recover');await click('#accept');A.equal(E.decode(await raw()).pos,2);
  A.equal(await f.evaluate(()=>localStorage.getItem('study-desk-unrelated-qualification')),'KEEP');
  await click('#games');await p.waitForFunction(()=>messages.includes('study-collection'));A.ok(p.url().endsWith('/shell-fixture.html'));
  A.deepEqual(errors,[]);await ctx.close();
 }
 console.log('PASS desktop/touch real bridge, hidden confirmations/recovery, resume keyboard, native Enter, input guards, simulated document visibility, unrelated saves and Collection messaging');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{await browser?.close();server.kill()});
