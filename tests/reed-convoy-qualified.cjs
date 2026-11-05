const {chromium}=require('playwright'),A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{spawn}=require('node:child_process'),E=require('../games/reed-convoy/engine.js'),route=require('./reed-convoy-route.cjs');
const root=path.join(__dirname,'..'),out=path.join(root,'test-artifacts/reed-convoy'),base='http://127.0.0.1:8223';
fs.mkdirSync(out,{recursive:true});const server=spawn('python3',['-m','http.server','8223','--bind','127.0.0.1'],{cwd:root,stdio:'ignore'});let browser;
(async()=>{
for(let i=0;i<50;i++){try{if((await fetch(base)).ok)break}catch{}await new Promise(r=>setTimeout(r,100))}
browser=await chromium.launch();
for(const touch of [false,true]){
 const ctx=await browser.newContext({viewport:touch?{width:390,height:844}:{width:1280,height:1000},hasTouch:touch,isMobile:touch}),p=await ctx.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
 const raw=()=>p.evaluate(k=>localStorage.getItem(k),E.KEY),state=async()=>E.decode(await raw()),key=async id=>{await p.locator('#'+id).focus();await p.keyboard.press('Space');await p.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))))};
 await p.goto(base+'/games/reed-convoy/index.html');await p.evaluate(()=>localStorage.setItem('study-desk-unrelated-qa','keep'));
 let s=E.create();
 for(let level=0;level<3;level++){
 for(const mode of ['open','shallows']){if(mode==='shallows'){await key('contract');await key('accept');s=E.act(s,'shallows')}
 for(const a of route(level,mode)){await key(a);s=E.act(s,a);A.deepEqual(await state(),s);const saved=await raw();await p.reload();A.equal(await raw(),saved)}A.equal(s.phase,'won');}
 A.ok(s.seals[level]);await p.screenshot({path:path.join(out,(touch?'touch':'desktop')+'-keyboard-'+level+'.png'),fullPage:true});await key('next');s=E.act(s,'next');}
 await key('restart');await p.keyboard.press('Escape');await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));A.deepEqual(await state(),s);await key('restart');await key('accept');s=E.act(s,'restart');A.deepEqual(await state(),s);A.equal(Object.keys(s.seals).length,3);
 await p.locator('#games').focus();await p.keyboard.press('Tab');A.equal(await p.evaluate(()=>document.activeElement.id),'pause');await p.locator('#right').focus();await p.keyboard.press('Enter');A.equal((await state()).body[0],9);
 await p.route('**/qualification-host.html',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0}iframe{width:100%;height:95vh;border:0}</style><iframe src="/games/reed-convoy/index.html"></iframe><script>window.messages=[];addEventListener("message",e=>{if(e.origin===location.origin)messages.push(e.data.type)});</script>'}));
 await p.goto(base+'/qualification-host.html');const f=await (await p.waitForSelector('iframe')).contentFrame();await f.waitForSelector('#right');
 const snapshot=()=>f.evaluate(k=>localStorage.getItem(k),E.KEY),visible=async v=>{await p.evaluate(v=>document.querySelector('iframe').contentWindow.postMessage({type:'study-visibility',visible:v},location.origin),v);for(let i=0;i<40;i++){if(await f.evaluate(v=>StudyBridge.paused===!v,v))return;await new Promise(r=>setTimeout(r,50))}throw Error('Bridge visibility did not settle')};
 for(const control of ['restart','contract']){await f.locator('#'+control).click();const before=await snapshot();await visible(false);
 A.ok(await f.locator('#accept').isDisabled());await f.evaluate(()=>document.getElementById('accept').click());A.equal(await snapshot(),before);
 await visible(true);A.ok(await f.locator('#accept').isDisabled());await f.locator('#cancel').click();await f.locator('#pause').click();A.equal(await snapshot(),before);
 }
 const before=await snapshot();await visible(false);await f.evaluate(()=>document.getElementById('right').click());A.equal(await snapshot(),before);await visible(true);A.ok(await f.locator('#right').isDisabled());await f.locator('#pause').click();
 await f.evaluate(k=>localStorage.setItem(k,'broken'),E.KEY);await f.goto(base+'/games/reed-convoy/index.html');await f.locator('#recover').click();await visible(false);await f.evaluate(()=>document.getElementById('accept').click());A.equal(await snapshot(),'broken');await visible(true);await f.locator('#cancel').click();await f.locator('#pause').click();await f.locator('#recover').click();await f.locator('#accept').click();E.decode(await snapshot());
 await f.locator('#games').click();await p.waitForFunction(()=>messages.includes('study-collection'));A.equal(await p.evaluate(()=>localStorage.getItem('study-desk-unrelated-qa')),'keep');
 A.ok(await f.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));if(touch)A.equal(await f.evaluate(()=>innerWidth),390);await p.screenshot({path:path.join(out,(touch?'touch':'desktop')+'-shell.png')});A.deepEqual(errors,[]);await ctx.close();
}
console.log('PASS twelve full-keyboard open/shallow delivery solutions and seal persistence, per-action reload, records/restart, Tab/Enter/Space/Escape, real bridge hidden restart/recovery/actions, explicit resume, Collection navigation and unrelated save isolation');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{await browser?.close();server.kill()});
