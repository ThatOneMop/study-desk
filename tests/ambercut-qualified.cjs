const {chromium}=require('playwright'),A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{spawn}=require('node:child_process'),E=require('../games/ambercut/engine.js'),{route,conservation}=require('./ambercut-engine.cjs');
const root=path.join(__dirname,'..'),out=path.join(root,'test-artifacts/ambercut'),base='http://127.0.0.1:8211';
fs.mkdirSync(out,{recursive:true});const server=spawn('python3',['-m','http.server','8211','--bind','127.0.0.1'],{cwd:root,stdio:'ignore'});let browser;
(async()=>{
for(let i=0;i<50;i++){try{if((await fetch(base)).ok)break}catch{}await new Promise(r=>setTimeout(r,100))}
browser=await chromium.launch();
for(const touch of [false,true]){
 const ctx=await browser.newContext({viewport:touch?{width:390,height:844}:{width:1280,height:1000},hasTouch:touch,isMobile:touch}),p=await ctx.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
 const raw=()=>p.evaluate(k=>localStorage.getItem(k),E.KEY),state=async()=>E.decode(await raw()),key=async id=>{await p.locator('#'+id).focus();await p.keyboard.press('Space');await p.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))))};
 await p.goto(base+'/games/ambercut/index.html');await p.evaluate(()=>localStorage.setItem('study-desk-unrelated-qa','keep'));
 let s=E.create();for(const a of route()){await key(typeof a==='number'?'cell-'+a:a);s=E.act(s,a);A.deepEqual(await state(),s);const saved=await raw();await p.reload();A.equal(await raw(),saved)}
 const legacy=JSON.parse(JSON.stringify(s));delete legacy.commission;delete legacy.seals;
 await p.evaluate(([k,v])=>localStorage.setItem(k,v),[E.KEY,JSON.stringify(legacy)]);await p.reload();A.deepEqual(await state(),s);await p.reload();A.deepEqual(await state(),s);
 await key('commission');await p.keyboard.press('Escape');await p.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));A.deepEqual(await state(),s);await key('commission');await key('accept');s=E.act(s,'commission');
 for(const a of conservation()){await key(typeof a==='number'?'cell-'+a:a);s=E.act(s,a);A.deepEqual(await state(),s);const saved=await raw();await p.reload();A.equal(await raw(),saved)}
 A.ok(s.seals[0]);await p.locator('#board').scrollIntoViewIfNeeded();await p.screenshot({path:path.join(out,(touch?'touch':'desktop')+'-qualified.png')});
 await key('next');await key('brush');
 // Deliberately leave one fossil buried while spending the kit on other cells.
 for(let i=0;i<25&&(await state()).phase==='dig';i++){if(i===7)continue;while((await state()).depth[i]&&(await state()).phase==='dig')await key('cell-'+i)}
 A.equal((await state()).phase,'lost');A.equal((await state()).strokes,50);await p.reload();A.equal((await state()).phase,'lost');
 await key('restart');await key('accept');A.ok((await state()).seals[0]);
 // Controlled same-origin host uses the actual repository bridge.js in its real game iframe.
 await p.route('**/qualification-host.html',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><style>body{margin:0}iframe{width:100%;height:95vh;border:0}</style><iframe src="/games/ambercut/index.html"></iframe><script>window.messages=[];addEventListener("message",e=>{if(e.origin===location.origin)messages.push(e.data.type)});</script>'}));
 await p.goto(base+'/qualification-host.html');const f=await (await p.waitForSelector('iframe')).contentFrame();await f.waitForSelector('#board button');
 const snapshot=()=>f.evaluate(k=>localStorage.getItem(k),E.KEY),visible=async v=>{await p.evaluate(v=>document.querySelector('iframe').contentWindow.postMessage({type:'study-visibility',visible:v},location.origin),v);for(let attempt=0;attempt<40;attempt++){if(await f.evaluate(v=>StudyBridge.paused===!v,v))return;await new Promise(resolve=>setTimeout(resolve,50))}throw Error('Bridge visibility did not settle')};
 for(const control of ['restart','commission']){await f.locator('#'+control).click();const before=await snapshot();await visible(false);A.ok(await f.locator('#accept').isDisabled());await f.evaluate(()=>document.getElementById('accept').click());A.equal(await snapshot(),before);
 await visible(true);A.ok(await f.locator('#accept').isDisabled());await f.locator('#cancel').click();await f.locator('#pause').click();A.equal(await snapshot(),before);}
 await f.evaluate(k=>localStorage.setItem(k,'broken'),E.KEY);await f.goto(base+'/games/ambercut/index.html');await f.locator('#recover').click();await visible(false);await f.evaluate(()=>document.getElementById('accept').click());A.equal(await snapshot(),'broken');await visible(true);await f.locator('#cancel').click();await f.locator('#pause').click();await f.locator('#recover').click();await f.locator('#accept').click();E.decode(await snapshot());
 await f.locator('#games').click();await p.waitForFunction(()=>messages.includes('study-collection'));A.equal(await p.evaluate(()=>localStorage.getItem('study-desk-unrelated-qa')),'keep');
 await p.screenshot({path:path.join(out,(touch?'touch':'desktop')+'-shell.png')});A.deepEqual(errors,[]);await ctx.close();
}
console.log('PASS four keyboard tray wins, earned conservation, assignment cancellation, kit exhaustion/retry, legacy migration, actual bridge hidden confirmations and unrelated save isolation');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{await browser?.close();server.kill()});


