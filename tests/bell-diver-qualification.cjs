const{chromium}=require('playwright'),A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{spawn}=require('node:child_process'),E=require('../games/bell-diver/engine.js'),{expedition,charterExpedition,pathTo}=require('./bell-diver-engine.cjs');
const root=path.join(__dirname,'..'),out=path.join(root,'test-artifacts/bell-diver');fs.mkdirSync(out,{recursive:true});const server=spawn('python3',['-m','http.server','8193','--bind','127.0.0.1'],{cwd:root,stdio:'ignore'});let browser;
(async()=>{for(let i=0;i<50;i++){try{if((await fetch('http://127.0.0.1:8193')).ok)break}catch{}await new Promise(r=>setTimeout(r,100))}browser=await chromium.launch();for(const touch of [false,true]){
 const ctx=await browser.newContext({viewport:touch?{width:390,height:844}:{width:1280,height:1000},hasTouch:touch,isMobile:touch}),p=await ctx.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));const click=async id=>touch?p.locator(id).tap():p.locator(id).click(),raw=()=>p.evaluate(k=>localStorage.getItem(k),E.KEY),state=async()=>E.decode(await raw());await p.goto('http://127.0.0.1:8193/games/bell-diver/index.html');
 await p.evaluate(()=>localStorage.setItem('bell-qualification-other-save','KEEP'));
 for(const mode of [0,1,0]){
  const before=await state();
  for(const a of charterExpedition(mode).actions){await click('#'+(a.type==='charter'?'charter-'+(a.id===0?'heavy':'survey'):a.type==='move'?a.dir:a.type));await state()}
  const won=await state();A.equal(won.won,true);
  if(won.expeditions>=2)A.equal(won.badges.length,6);
  if(won.expeditions===3)A.equal(won.coins-before.coins,24,'repeated heavy charter grants ordinary salvage only');
  await p.reload();A.deepEqual(await state(),won);
  if(won.expeditions===2){await p.locator('#charterInfo').scrollIntoViewIfNeeded();await p.screenshot({path:path.join(out,(touch?'touch':'desktop')+'-six-badges.png')})}
  await click('#retry');await click('#accept');A.deepEqual((await state()).badges,won.badges);
 }
 // Load an actually earned old-format completed expedition, then inspect browser migration.
 const old=expedition().s;old.v=1;delete old.charter;delete old.badges;
 await p.evaluate(({key,old})=>localStorage.setItem(key,JSON.stringify(old)),{key:E.KEY,old});await p.reload();const migrated=await state();A.equal(migrated.won,true);A.equal(migrated.coins,old.coins);A.equal(migrated.tank,old.tank);A.deepEqual(migrated.badges,[]);
 await click('#retry');await click('#accept');const bank=await state();
 // Pick up cargo with keyboard and deliberately exhaust air through legal swim actions.
 await p.locator('#board').focus();await p.keyboard.press('ArrowDown');await p.keyboard.press('Space');A.deepEqual((await state()).cargo,[0]);let safety=0;
 while((await state()).rescues===0&&safety++<70){const q=await state();await click(q.pos===7?'#down':'#up')}
 const rescued=await state();A.equal(rescued.pos,2);A.equal(rescued.rescues,1);A.deepEqual(rescued.cargo,[]);A.equal(rescued.coins,bank.coins);A.equal(rescued.tank,bank.tank);A.equal(rescued.fins,bank.fins);A.deepEqual(rescued.banked,bank.banked);
 await p.reload();A.deepEqual(await state(),rescued);await click('#down');await click('#take');A.deepEqual((await state()).cargo,[0],'lost salvage can be collected again');
 await p.locator('#board').scrollIntoViewIfNeeded();await p.screenshot({path:path.join(out,(touch?'touch':'desktop')+'-loaded-rescue-retry.png')});A.equal(await p.evaluate(()=>localStorage.getItem('bell-qualification-other-save')),'KEEP');A.deepEqual(errors,[]);await ctx.close();
 }console.log('PASS six replayed charter campaigns, all-six-badge accumulation, duplicate bonus rejection, rendered v1 migration, loaded rescue/recollection, keyboard collection and unrelated-save retention')})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{await browser?.close();server.kill()});
