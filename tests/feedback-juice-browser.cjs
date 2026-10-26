// Feedback-kit test: each juiced game boots without page errors, shows a header Sound toggle that saves its setting, and real play events raise a callout.
// Needs Playwright and `python -m http.server 8765` in the website root (or set BASE). Set CHROME_PATH for system Chrome.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const BASE=(process.env.BASE||'http://127.0.0.1:8765').replace(/\/$/,'');
const w='const w=t=>new Promise(r=>setTimeout(r,t));';
const games=[
 {id:'deep-pocket',p:'dp',hook:'DPGame'},
 {id:'queen-of-cinders',p:'qc',hook:'QCGame'},
 {id:'little-foundry',p:'lf',hook:'LFGame'},
 {id:'inkline',p:'il',hook:'ILGame'},
 {id:'pocket-expedition',p:'px',hook:'PXGame',act:`(async()=>{${w}document.getElementById('launch').click();await w(150)})()`},
 {id:'echo-vault',p:'ev',hook:'EVGame',act:`(async()=>{${w}const r=()=>EVGame.o.run;const p=r().relic;EVGame.o.run.relic=!p;await w(120);EVGame.o.run.relic=p})()`},
 {id:'glasshouse',p:'gh',hook:'GHGame',act:`(async()=>{${w}document.getElementById('pot5').click();await w(80);document.getElementById('plant').click();await w(150)})()`},
 {id:'spore-kitchen',p:'sk',hook:'SKGame',act:`(async()=>{${w}document.getElementById('seed0').click();await w(80);document.querySelector('#beds > :nth-child(1)').click();await w(150)})()`},
 {id:'bolt-and-bristle',p:'bb',hook:'BBGame',act:`(async()=>{${w}document.getElementById('test').click();await w(150)})()`},
 {id:'roof-runner',p:'rr',hook:'RRGame'},
 {id:'scrap-orbit',p:'so',hook:'SOGame'},
 {id:'last-match',p:'lm',hook:'LMGame'},
 {id:'burrow-express',p:'be',hook:'BEGame',act:`(async()=>{${w}const r=BEGame.o.run,s=r.status;r.status='running';await w(150);r.status=s})()`},
 {id:'storm-signal',p:'ss',hook:'SSGame',act:`(async()=>{${w}const r=SSGame.o.run;r.scans++;await w(150);r.scans--})()`}
];
(async()=>{
 const launch={headless:true,args:['--no-sandbox']};if(process.env.CHROME_PATH)launch.executablePath=process.env.CHROME_PATH;
 const browser=await chromium.launch(launch);
 try{for(const g of games){
  const page=await browser.newPage({viewport:{width:1280,height:860}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`${BASE}/games/${g.id}/index.html`,{waitUntil:'load'});
  await page.evaluate(()=>localStorage.clear());await page.reload({waitUntil:'load'});await page.waitForTimeout(400);
  assert(await page.evaluate(h=>!!(window[h]&&window[h].o),g.hook),`${g.id}: game state hook present`);
  const snd=`#${g.p}SndBtn`;assert(await page.isVisible(snd),`${g.id}: Sound toggle visible`);
  assert.equal(await page.getAttribute(snd,'aria-pressed'),'true',`${g.id}: sound starts on`);
  await page.click(snd);assert.equal(await page.getAttribute(snd,'aria-pressed'),'false',`${g.id}: Sound toggle turns sound off`);
  assert.equal(await page.evaluate(id=>localStorage.getItem('study-desk-'+id+'-sound'),g.id),'off',`${g.id}: sound setting saved`);
  await page.reload({waitUntil:'load'});await page.waitForTimeout(300);
  assert.equal(await page.getAttribute(snd,'aria-pressed'),'false',`${g.id}: sound setting survives reload`);
  await page.click(snd);
  if(g.act){await page.evaluate(g.act);await page.waitForTimeout(100);assert(await page.evaluate(p=>document.querySelectorAll('.'+p+'-call').length>0,g.p),`${g.id}: a play event raises a callout`)}
  assert.deepEqual(errors,[],`${g.id}: no page errors`);
  await page.close();console.log('ok',g.id);
 }}finally{await browser.close()}
 console.log(`PASS feedback juice: ${games.length} games show a saved Sound toggle, raise callouts on play events, and boot without page errors`);
})().catch(e=>{console.error(e);process.exit(1)});
