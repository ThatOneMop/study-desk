const {chromium}=require('playwright'),A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{spawn}=require('node:child_process');
const E=require('../games/stillframe/engine.js'),{route}=require('./stillframe-engine.cjs');
const root=path.join(__dirname,'..'),out=path.join(root,'test-artifacts/stillframe');fs.mkdirSync(out,{recursive:true});
const server=spawn('python3',['-m','http.server','8212','--bind','127.0.0.1'],{cwd:root,stdio:'ignore'});let browser;
(async()=>{
  for(let i=0;i<50;i++){try{if((await fetch('http://127.0.0.1:8212')).ok)break}catch{}await new Promise(r=>setTimeout(r,100))}
  browser=await chromium.launch();
  for(const touch of [false,true]){
    const prefix=touch?'touch':'desktop',ctx=await browser.newContext({viewport:touch?{width:390,height:844}:{width:1280,height:1000},hasTouch:touch,isMobile:touch}),p=await ctx.newPage(),errors=[];
    p.on('pageerror',e=>errors.push(e.message));
    const click=async id=>touch?p.locator(id).tap():p.locator(id).click(),raw=()=>p.evaluate(k=>localStorage.getItem(k),E.KEY),state=async()=>E.decode(await raw());
    const screenshot=async name=>{await p.screenshot({path:path.join(out,prefix+'-'+name+'.png'),fullPage:true})};
    await p.goto('http://127.0.0.1:8212/games/stillframe/index.html');let expected=E.create();
    for(let edition=0;edition<2;edition++){
      for(const action of route(expected)){
        if(action==='shoot'){
          A.match(await p.locator('#readiness').innerText(),/Ready/);
          if(expected.subject===0)await screenshot('ready-'+edition+'-'+expected.seals[0]);
        }
        await click('#'+action.replace(':','-'));expected=E.act(expected,action);A.deepEqual(await state(),expected);
        if(edition===0){const saved=await raw();await p.reload();A.equal(await raw(),saved)}
        if(action==='shoot'){
          const print=expected.prints.at(-1);
          A.match(await p.locator('.print').last().innerText(),new RegExp(print.pose));
          A.equal(await p.locator('.print').count(),expected.prints.length);
          A.equal(await p.locator('.print-scene').last().getAttribute('data-pose'),print.pose);
        }
      }
      A.equal((await state()).phase,'won');A.deepEqual((await state()).seals,[3,3,3]);
      // Earlier captures must keep their own animal after switching the live subject to the moth.
      A.equal(await p.locator('.print-scene svg path').first().getAttribute('fill'),'#55a7b9');
      A.equal(await p.locator('.print-scene').nth(3).locator('path').first().getAttribute('fill'),'#b98459');
      A.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await screenshot('exhibition-'+edition);
      await click('#restart');await p.keyboard.press('Escape');A.deepEqual(await state(),expected);
      await click('#restart');await click('#accept');expected=E.act(expected,'restart');A.deepEqual(await state(),expected);
    }
    // A sharp wrong-pose print spends film without accepting the brief, and watching is free.
    for(const a of ['aim:0','shutter:1','aperture:0'])await click('#'+a.replace(':','-'));
    await click('#shoot');A.equal((await state()).seals[0],0);A.equal((await state()).prints[0].score,100);
    await screenshot('study-print');
    while((await state()).phase==='field')await click('#shoot');
    A.equal((await state()).phase,'lost');await p.reload();A.equal((await state()).phase,'lost');
    const retained=(await state()).records;await click('#restart');await click('#accept');A.deepEqual((await state()).records,retained);
    await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
    await p.locator('#wait').focus();await p.keyboard.press('Space');A.equal((await state()).tick,1);
    await click('#pause');A.ok(await p.locator('#shoot').isDisabled());A.ok(await p.locator('#technique-1').isDisabled());await click('#pause');
    // A v1 finished album is migrated, not erased or treated as nine new completed briefs.
    const legacy={v:1,subject:0,tick:3,aim:4,shutter:2,aperture:1,focus:1,film:6,records:[100,90,80],phase:'won',last:'Old exhibition'};
    await p.evaluate(([k,s])=>localStorage.setItem(k,JSON.stringify(s)),[E.KEY,legacy]);await p.reload();
    A.deepEqual((await state()).records,legacy.records);A.deepEqual((await state()).seals,[0,0,0]);A.equal((await state()).phase,'field');
    await p.evaluate(k=>localStorage.setItem(k,'broken'),E.KEY);await p.reload();await click('#wait');A.equal(await raw(),'broken');
    await click('#recover');await click('#accept');A.equal((await state()).tick,1);
    await p.evaluate(()=>Storage.prototype.setItem=function(){throw Error('quota')});await click('#wait');A.match(await p.locator('#save').innerText(),/temporary/);
    await click('#games');await p.waitForURL('**/index.html#games');A.deepEqual(errors,[]);await ctx.close();
  }
  console.log('PASS four rendered nine-brief exhibitions (two editions, desktop and touch), 36 accepted captures; first-edition exact per-action reload; frozen species/poses, wrong-pose study, exhaustion/retry, old-save migration, Space/Escape, pause, corrupt/quota saves and Games navigation.');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{await browser?.close();server.kill()});
