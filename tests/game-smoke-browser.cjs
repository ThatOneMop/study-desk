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
  assert(await page.isVisible(g.start),`${g.id}: start control visible`);await page.click(g.start,{force:true});await page.waitForTimeout(350);
  assert(!(await page.isVisible(g.title)),`${g.id}: title screen closes after start`);
  assert(await page.isVisible(g.play),`${g.id}: playfield visible after start`);
  await page.focus(g.play).catch(()=>{});await page.keyboard.press(g.key);await page.waitForTimeout(500);
  if(g.check)await g.check(page);
  assert.deepEqual(errors,[],`${g.id}: no page errors`);
  await page.close();console.log('ok',g.id);
 }}finally{await browser.close()}
 console.log(`PASS game smoke: ${games.length} games boot without page errors and their title screens lead to play`);
})().catch(e=>{console.error(e);process.exit(1)});
