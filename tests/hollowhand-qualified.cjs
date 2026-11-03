const {chromium}=require('playwright'),A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{spawn}=require('node:child_process'),E=require('../games/hollowhand/engine.js'),{route}=require('./hollowhand-engine.cjs');
const root=path.join(__dirname,'..'),out=path.join(root,'test-artifacts/hollowhand'),base='http://127.0.0.1:8208';
fs.mkdirSync(out,{recursive:true});const server=spawn('python3',['-m','http.server','8208','--bind','127.0.0.1'],{cwd:root,stdio:'ignore'});let browser;
(async()=>{
for(let i=0;i<50;i++){try{if((await fetch(base)).ok)break}catch{}await new Promise(r=>setTimeout(r,100))}
browser=await chromium.launch();
for(const touch of [false,true]){
 const ctx=await browser.newContext({viewport:touch?{width:390,height:844}:{width:1280,height:1000},hasTouch:touch,isMobile:touch}),p=await ctx.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
 const raw=()=>p.evaluate(k=>localStorage.getItem(k),E.KEY),state=async()=>E.decode(await raw()),key=async id=>{await p.locator('#'+id).focus();await p.keyboard.press('Space')};
 await p.goto(base+'/games/hollowhand/index.html');await p.evaluate(()=>localStorage.setItem('study-desk-unrelated-qa','keep'));
 let s=E.create();for(const a of route('study')){await key(typeof a==='number'?'card-'+a:a);s=E.act(s,a);A.deepEqual(await state(),s);const saved=await raw();await p.reload();A.equal(await raw(),saved)}
 A.equal(s.phase,'won');await p.locator('#record').scrollIntoViewIfNeeded();await p.screenshot({path:path.join(out,(touch?'touch':'desktop')+'-qualified.png')});
 // Real earned victory converted to the original save format; migration must occur once.
 const old=JSON.parse(JSON.stringify(s));delete old.turnVersion;old.total-=4;old.best-=3;
 await p.evaluate(([k,v])=>localStorage.setItem(k,v),[E.KEY,JSON.stringify(old)]);await p.reload();A.deepEqual(await state(),s);await p.reload();A.deepEqual(await state(),s);
 await key('restart');await key('accept');A.equal((await state()).best,s.best);
 // Reach a reward naturally, then exercise each untested reward in isolated saved branches.
 for(const a of route()){if((await state()).phase==='reward')break;await key(typeof a==='number'?'card-'+a:a)}
 const rewardState=await state();A.equal(rewardState.phase,'reward');
 for(const reward of ['mend','trim']){await p.evaluate(([k,v])=>localStorage.setItem(k,v),[E.KEY,JSON.stringify(rewardState)]);await p.reload();await key(reward);A.deepEqual(await state(),E.act(rewardState,reward));await p.reload();A.deepEqual(await state(),E.act(rewardState,reward))}
 // Controlled same-origin host uses the actual repository bridge.js in its real game iframe.
 await p.route('**/qualification-host.html',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><style>body{margin:0}iframe{width:100%;height:95vh;border:0}</style><iframe src="/games/hollowhand/index.html"></iframe><script>window.messages=[];addEventListener("message",e=>{if(e.origin===location.origin)messages.push(e.data.type)});</script>'}));
 await p.goto(base+'/qualification-host.html');const f=await (await p.waitForSelector('iframe')).contentFrame();await f.waitForSelector('#hand button');
 const snapshot=()=>f.evaluate(k=>localStorage.getItem(k),E.KEY),visible=async v=>{await p.evaluate(v=>document.querySelector('iframe').contentWindow.postMessage({type:'study-visibility',visible:v},location.origin),v);await f.waitForFunction(v=>StudyBridge.paused===!v,v)};
 await f.locator('#restart').click();const before=await snapshot();await visible(false);A.ok(await f.locator('#accept').isDisabled());await f.evaluate(()=>document.getElementById('accept').click());A.equal(await snapshot(),before);
 await visible(true);A.ok(await f.locator('#accept').isDisabled());await f.locator('#cancel').click();await f.locator('#pause').click();A.equal(await snapshot(),before);
 await f.evaluate(k=>localStorage.setItem(k,'broken'),E.KEY);await f.goto(base+'/games/hollowhand/index.html');await f.locator('#recover').click();await visible(false);await f.evaluate(()=>document.getElementById('accept').click());A.equal(await snapshot(),'broken');await visible(true);await f.locator('#cancel').click();await f.locator('#pause').click();await f.locator('#recover').click();await f.locator('#accept').click();E.decode(await snapshot());
 await f.locator('#games').click();await p.waitForFunction(()=>messages.includes('study-collection'));A.equal(await p.evaluate(()=>localStorage.getItem('study-desk-unrelated-qa')),'keep');
 await p.screenshot({path:path.join(out,(touch?'touch':'desktop')+'-shell.png')});A.deepEqual(errors,[]);await ctx.close();
}
console.log('PASS two keyboard victories, earned mend/trim branches, legacy migration, actual bridge hidden confirmations, explicit resume, Collection navigation and unrelated save isolation');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{await browser?.close();server.kill()});

