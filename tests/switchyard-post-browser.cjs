const {chromium}=require('playwright'), A=require('node:assert/strict'), fs=require('node:fs'), path=require('node:path'), {spawn}=require('node:child_process');
const E=require('../games/switchyard-post/engine.js'), {route}=require('./switchyard-post-engine.cjs');
const root=path.join(__dirname,'..'), out=path.join(root,'test-artifacts/switchyard-post');
fs.mkdirSync(out,{recursive:true});
const server=spawn('python3',['-m','http.server','8188','--bind','127.0.0.1'],{cwd:root,stdio:'ignore'});
let browser;
(async()=>{
  for(let i=0;i<50;i++){try{if((await fetch('http://127.0.0.1:8188')).ok)break}catch{}await new Promise(r=>setTimeout(r,100))}
  browser=await chromium.launch();
  for(const touch of [false,true]){
    const ctx=await browser.newContext({viewport:touch?{width:390,height:844}:{width:1280,height:1000},hasTouch:touch,isMobile:touch});
    const p=await ctx.newPage(), errors=[];
    p.on('pageerror',e=>errors.push(e.message));
    const click=async id=>touch?p.locator(id).tap():p.locator(id).click();
    const raw=()=>p.evaluate(k=>localStorage.getItem(k),E.KEY);
    const state=async()=>E.decode(await raw());
    const shot=async name=>{await p.locator('#board').scrollIntoViewIfNeeded();await p.screenshot({path:path.join(out,(touch?'touch':'desktop')+'-'+name+'.png')})};
    await p.goto('http://127.0.0.1:8188/games/switchyard-post/index.html');
    await p.locator('#board').waitFor();
    A.ok(await p.locator('#service').isDisabled());
    let records=[null,null,null];
    for(let level=0;level<3;level++){
      for(const fragile of [false,true]){
        if(fragile){await click('#service');await click('#accept');A.equal((await state()).fragile,true)}
        let count=0;
        for(const a of route(level,records,fragile)){
          await click(a.type==='move'?'#'+a.dir:a.car===0?'#red':'#blue');
          const before=await state();
          await p.reload();await p.locator('#board').waitFor();
          A.deepEqual(await state(),before);
          if(++count===8)await shot((fragile?'fragile':'standard')+'-shunting-'+level);
        }
        const won=await state();A.equal(won.won,true);records=won.records;
        if(fragile)A.ok(won.fragileRecords[level]>0);
        await shot((fragile?'fragile':'standard')+'-win-'+level);
        A.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
        await click('#undo');A.equal((await state()).won,false);
        await click('#retry');await p.keyboard.press('Escape');await p.locator('#retry:enabled').waitFor();
        await click('#retry');await click('#accept');
        A.equal((await state()).moves,0);A.deepEqual((await state()).records,records);
        A.deepEqual((await state()).fragileRecords,won.fragileRecords);
      }
      await click('#service');await click('#accept');A.equal((await state()).fragile,false);
      if(level<2){await click('#yard-'+(level+1));await click('#accept')}
    }
    A.equal((await state()).fragileRecords.filter(v=>v!==null).length,3);
    await click('#yard-0');await click('#accept');
    await p.locator('#board').focus();
    for(const a of route(0,records)){
      await p.keyboard.press(a.type==='move'?({left:'ArrowLeft',right:'ArrowRight',up:'ArrowUp',down:'ArrowDown'}[a.dir]):a.car===0?'r':'b');
    }
    A.equal((await state()).won,true);await shot('keyboard-win');
    await click('#retry');await click('#accept');
    await click('#pause');A.ok(await p.locator('#right').isDisabled());await click('#pause');
    let old=E.create();for(const a of route(0))old=E.act(old,a);
    old.v=1;delete old.fragile;delete old.fragileRecords;delete old.undoFloor;
    await p.evaluate(({key,save})=>localStorage.setItem(key,JSON.stringify(save)),{key:E.KEY,save:old});
    await p.reload();A.deepEqual((await state()).fragileRecords,[null,null,null]);A.equal((await state()).won,true);
    await click('#retry');await click('#accept');
    await p.evaluate(k=>localStorage.setItem(k,'broken'),E.KEY);await p.reload();await p.locator('#recover').waitFor();
    await click('#right');A.equal(await raw(),'broken');await click('#recover');await click('#accept');A.equal((await state()).moves,1);
    await p.evaluate(()=>Storage.prototype.setItem=function(){throw Error('quota')});await click('#right');A.match(await p.locator('#save').innerText(),/temporary/);
    await click('#games');A.ok(p.url().endsWith('/index.html#games'));
    A.deepEqual(errors,[]);await ctx.close();
  }
  console.log('PASS twelve standard/fragile rendered wins with per-action reload, two keyboard wins, badges, v1 migration, undo/retry, Escape, pause, corrupt/quota recovery, Games navigation and desktop/touch layout');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{await browser?.close();server.kill()});
