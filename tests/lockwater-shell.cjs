const {chromium}=require('playwright'),A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{spawn}=require('node:child_process'),E=require('../games/lockwater/engine.js');
const root=path.join(__dirname,'..'),out=path.join(root,'test-artifacts/lockwater'),host=path.join(root,'tests/lockwater-host.html');
fs.mkdirSync(out,{recursive:true});fs.writeFileSync(host,`<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><button id="hide">Collection</button><button id="show">Return</button><p id="result"></p><iframe title="Lockwater" src="../games/lockwater/index.html" style="width:100%;height:900px;border:0"></iframe><script>const f=document.querySelector('iframe');hide.onclick=()=>f.contentWindow.postMessage({type:'study-visibility',visible:false},location.origin);show.onclick=()=>f.contentWindow.postMessage({type:'study-visibility',visible:true},location.origin);addEventListener('message',e=>{if(e.source===f.contentWindow&&e.origin===location.origin)result.textContent=e.data.type})</script>`);
const server=spawn('python3',['-m','http.server','8198','--bind','127.0.0.1'],{cwd:root,stdio:'ignore'});let browser;
(async()=>{for(let i=0;i<50;i++){try{if((await fetch('http://127.0.0.1:8198')).ok)break}catch{}await new Promise(r=>setTimeout(r,100))}browser=await chromium.launch();
for(const touch of [false,true]){
const ctx=await browser.newContext({viewport:touch?{width:390,height:844}:{width:1280,height:1000},hasTouch:touch,isMobile:touch}),p=await ctx.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://127.0.0.1:8198/games/lockwater/index.html');
const {route}=require('./lockwater-engine.cjs');let legacy,records=[null,null,null];for(let job=0;job<3;job++){legacy=E.create(job,records);for(const a of route(job,records))legacy=E.act(legacy,a);records=legacy.records}delete legacy.mode;delete legacy.contracts;
await p.evaluate(({key,legacy})=>{localStorage.setItem(key,JSON.stringify(legacy));localStorage.setItem('study-desk-unrelated-fixture','keep')},{key:E.KEY,legacy});await p.reload();
const click=async s=>touch?p.locator(s).tap():p.locator(s).click(),raw=()=>p.evaluate(k=>localStorage.getItem(k),E.KEY),state=async()=>E.decode(await raw());
A.equal((await state()).phase,'won');A.deepEqual((await state()).records,records);A.deepEqual((await state()).contracts,[null,null,null]);
await click('#job-0');await click('#accept');await click('#contract');await click('#accept');
let expected=E.create(0,records,[null,null,null],'contract');
for(const a of route(0,records,[null,null,null],'contract')){
 if(a.type==='sail'){await p.locator('#canal').focus();await p.keyboard.press(a.dir===1?'ArrowRight':'ArrowLeft')}
 else{await p.locator('#'+a.type+'-'+a.lock).focus();await p.keyboard.press('Space')}
 expected=E.act(expected,a);A.deepEqual(await state(),expected);
}
const earned=await state();A.ok(earned.contracts[0]);await p.reload();A.deepEqual(await state(),earned);
for(const cancel of ['escape','button']){await click('#standard');if(cancel==='escape')await p.keyboard.press('Escape');else await click('#cancel');await p.evaluate(()=>document.getElementById('accept').click());A.deepEqual(await state(),earned)}
await click('#standard');await click('#accept');A.deepEqual((await state()).contracts,earned.contracts);
await p.locator('#canal').focus();for(const event of [{key:'ArrowRight',repeat:true},{key:'ArrowRight',isComposing:true},{key:'ArrowRight',ctrlKey:true},{key:'ArrowRight',altKey:true},{key:'ArrowRight',metaKey:true}])await p.locator('#canal').dispatchEvent('keydown',event);A.equal((await state()).turn,0);
await p.locator('#fill-0').focus();await p.keyboard.press('Enter');A.equal((await state()).turn,1);
await click('#restart');await click('#accept');await click('#contract');await click('#accept');A.deepEqual((await state()).contracts,earned.contracts);
await p.locator('#canal').scrollIntoViewIfNeeded();await p.screenshot({path:path.join(out,(touch?'touch':'desktop')+'-qualified-record.png')});
await p.goto('http://127.0.0.1:8198/tests/lockwater-host.html');const frame=p.frames().find(f=>f.url().includes('/games/lockwater/'));await frame.waitForSelector('#fill-0');
const fc=async s=>touch?frame.locator(s).tap():frame.locator(s).click(),fr=()=>frame.evaluate(k=>localStorage.getItem(k),E.KEY);
await fc('#fill-0');await fc('#job-1');const before=await fr();await click('#hide');await p.waitForFunction(()=>document.querySelector('iframe').contentWindow.StudyBridge.paused);
A.ok(await frame.locator('#accept').isDisabled());await frame.evaluate(()=>{for(const id of ['accept','fill-0','transfer-0','right','pause','restart','recover'])document.getElementById(id).click()});A.equal(await fr(),before);
await click('#show');await p.waitForFunction(()=>!document.querySelector('iframe').contentWindow.StudyBridge.paused);A.ok(await frame.locator('#accept').isDisabled());await fc('#cancel');await fc('#pause');await frame.evaluate(()=>document.getElementById('accept').click());A.equal(await fr(),before);
await fc('#job-1');await fc('#accept');A.equal(E.decode(await fr()).job,1);A.deepEqual(E.decode(await fr()).contracts,earned.contracts);
await frame.evaluate(k=>localStorage.setItem(k,'broken'),E.KEY);await frame.goto(frame.url());await fc('#recover');await click('#hide');await p.waitForFunction(()=>document.querySelector('iframe').contentWindow.StudyBridge.paused);await frame.evaluate(()=>document.getElementById('accept').click());A.equal(await fr(),'broken');await click('#show');await p.waitForFunction(()=>!document.querySelector('iframe').contentWindow.StudyBridge.paused);await fc('#cancel');await fc('#pause');await frame.evaluate(()=>document.getElementById('accept').click());A.equal(await fr(),'broken');await fc('#recover');await fc('#accept');A.equal(E.decode(await fr()).turn,0);
await fc('#right');const saved=await fr();await fc('#games');await p.waitForFunction(()=>document.getElementById('result').textContent==='study-collection');A.equal(await fr(),saved);A.equal(await frame.evaluate(()=>localStorage.getItem('study-desk-unrelated-fixture')),'keep');
await frame.locator('#canal').evaluate(el=>el.scrollIntoView({block:'center'}));await p.screenshot({path:path.join(out,(touch?'touch':'desktop')+'-shell.png')});A.deepEqual(errors,[]);await ctx.close()
}console.log('PASS desktop/touch legacy records, two full keyboard contracts, cancelled callback rejection, mode/record retention, modifiers, native buttons, actual bridge hidden job/recovery confirmations, explicit resume, Collection and unrelated-save isolation')
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{await browser?.close();server.kill();fs.unlinkSync(host)});
