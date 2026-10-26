// Hub mobile and accessibility checks: 390x844 phone and 768x1024 tablet, study desk and collection.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const BASE=process.env.BASE||'http://127.0.0.1:8765';
(async()=>{
 const launch={headless:true,args:['--no-sandbox']};if(process.env.CHROME_PATH)launch.executablePath=process.env.CHROME_PATH;
 const browser=await chromium.launch(launch);
 try{for(const [w,h] of [[390,844],[768,1024]])for(const hash of ['','#games']){
  const ctx=await browser.newContext({viewport:{width:w,height:h},hasTouch:true,isMobile:w<500,reducedMotion:'reduce'}),page=await ctx.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`${BASE}/index.html${hash}`,{waitUntil:'load'});await page.waitForTimeout(700);
  const r=await page.evaluate(()=>{const vis=e=>{const b=e.getBoundingClientRect();return b.width>0&&b.height>0&&getComputedStyle(e).visibility!=='hidden'&&!e.closest('[hidden],dialog:not([open])')};
   const name=e=>(e.getAttribute('aria-label')||e.textContent||e.title||e.alt||(e.labels&&e.labels[0]?.textContent)||'').trim();
   const ctl=[...document.querySelectorAll('a[href],button,select,summary,input:not([type=file]):not([type=hidden])')].filter(vis);
   return{scroll:document.documentElement.scrollWidth-innerWidth,small:ctl.filter(e=>{const b=e.getBoundingClientRect();return b.width<44||b.height<44}).map(e=>(e.id||e.className||e.tagName)+' '+Math.round(e.getBoundingClientRect().width)+'x'+Math.round(e.getBoundingClientRect().height)),
    unnamed:ctl.filter(e=>!name(e)).map(e=>e.id||e.tagName),noAlt:[...document.querySelectorAll('img:not([alt])')].length,main:document.querySelectorAll('main').length>0,h1:[...document.querySelectorAll('h1')].filter(vis).length,
    iconOnly:[...document.querySelectorAll('button')].filter(e=>/^[✕×‹›←→]$/.test(e.textContent.trim())&&!e.getAttribute('aria-label')).map(e=>e.id)}});
  const v=`${w}x${h}${hash||' study'}`;
  assert.equal(r.scroll,0,`${v}: no horizontal scroll`);
  assert.deepEqual(r.small,[],`${v}: every visible control is at least 44px`);
  assert.deepEqual(r.unnamed,[],`${v}: every control has an accessible name`);
  assert.deepEqual(r.iconOnly,[],`${v}: icon-only buttons are labelled`);
  assert.equal(r.noAlt,0,`${v}: images have alt text`);
  assert(r.main,`${v}: has a main landmark`);assert.equal(r.h1,1,`${v}: one visible h1`);
  if(hash){const play=page.locator('#games button:has-text("Play ")').first();await play.tap();await page.waitForTimeout(1200);assert(await page.isVisible('#player'),`${v}: a game launches`);
   await page.tap('#libraryBtn');await page.waitForTimeout(500);assert(!(await page.isVisible('#player')),`${v}: back returns to the collection`);assert(await page.isVisible('#gameCollection'),`${v}: collection visible again`)}
  else{await page.tap('#card');await page.waitForTimeout(250);assert.equal(await page.textContent('#side'),'ANSWER',`${v}: tapping a flashcard turns it`);await page.tap('#know');await page.waitForTimeout(250);assert.match(await page.textContent('#mastered'),/^1 /,`${v}: Got it marks mastery`)}
  assert.deepEqual(errors,[],`${v}: no page errors`);await ctx.close();console.log('ok',v);
 }}finally{await browser.close()}
 console.log('PASS hub mobile and accessibility: phone and tablet layouts, 44px targets, names, landmarks, launcher, back and study tools');
})().catch(e=>{console.error(e);process.exit(1)});
