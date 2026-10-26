// Smoke test for recently polished games: each boots, shows its title, the title leads to play, and no page errors occur.
// Needs Playwright and `python -m http.server 8765` in the website root (or set BASE). Set CHROME_PATH for system Chrome.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const BASE=(process.env.BASE||'http://127.0.0.1:8765').replace(/\/$/,'');
const games=[
 {id:'lost-found',title:'#titleScreen',start:'#startBtn',play:'canvas',key:'ArrowRight'},
 {id:'moon-salvage',title:'#intro',start:'#start',play:'canvas',key:'ArrowRight'},
 {id:'autumn-drift',title:'#intro',start:'#start',play:'#game',key:'ArrowRight'},
 {id:'underleaf',title:'#intro',start:'#start',play:'#game',key:'1'},
 {id:'little-lake',title:'#title',start:'#begin',play:'#game',key:'d',check:async page=>{assert(await page.evaluate(()=>started&&Array.isArray(save.seen)&&typeof save.records==='object'),'Little Lake starts with a records-ready save')}},
 {id:'lucky-company',title:'text=Your casino, to go.',start:'button:has-text("Start offline game")',play:'canvas',key:'w',prep:async page=>{await page.fill('input[placeholder="What should we call you?"]','Smoke')},check:async page=>{await page.click('button:has-text("Begin the run")',{force:true});await page.waitForTimeout(700);assert.match(await page.textContent('body'),/0 \/ 90 floor progress/,'the Lobby opens with the gentler 90-chip target');assert(await page.isVisible('#lcBest'),'best-run badge is shown')}},
 {id:'forge-arena',title:'body[data-state="hangar"] #battleButton',start:'#quickTestBtn',play:'#battleCanvas',key:'KeyP',prep:async page=>{if(await page.isVisible('#tutorialSkip'))await page.click('#tutorialSkip',{force:true})},wait:2600,check:async page=>{assert(await page.isVisible('#fxPause'),'P opens the pause menu');assert(await page.evaluate(()=>ForgePause.paused&&ForgePause.engine.__fx27),'battle is paused with hit feedback attached');await page.keyboard.press('Escape');await page.waitForTimeout(200);assert(!(await page.isVisible('#fxPause')),'Esc resumes')}},
 {id:'tidepost',title:'#titleScreen',start:'#castOff',play:'#sea',key:'ArrowRight',check:async page=>assert.equal(await page.textContent('#turns'),'1','a sailing key takes a turn after Cast off')}
];
(async()=>{
 const launch={headless:true,args:['--no-sandbox']};if(process.env.CHROME_PATH)launch.executablePath=process.env.CHROME_PATH;
 const browser=await chromium.launch(launch);
 try{for(const g of games){
  const page=await browser.newPage({viewport:{width:1280,height:860}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`${BASE}/games/${g.id}/index.html`,{waitUntil:'load'});await page.waitForTimeout(400);
  assert(await page.isVisible(g.title),`${g.id}: title screen visible on boot`);
  if(g.prep)await g.prep(page);
  assert(await page.isVisible(g.start),`${g.id}: start control visible`);await page.click(g.start,{force:true});await page.waitForTimeout(g.wait||350);
  assert(!(await page.isVisible(g.title)),`${g.id}: title screen closes after start`);
  assert(await page.isVisible(g.play),`${g.id}: playfield visible after start`);
  await page.focus(g.play).catch(()=>{});await page.keyboard.press(g.key);await page.waitForTimeout(500);
  if(g.check)await g.check(page);
  assert.deepEqual(errors,[],`${g.id}: no page errors`);
  await page.close();console.log('ok',g.id);
 }}finally{await browser.close()}
 console.log(`PASS game smoke: ${games.length} games boot without page errors and their title screens lead to play`);
})().catch(e=>{console.error(e);process.exit(1)});
