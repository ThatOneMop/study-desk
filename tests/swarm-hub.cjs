'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const {JSDOM}=require('jsdom');
const {unlockShell}=require('./gate-fixture.cjs');
const root=__dirname+'/../';
(async()=>{
 const dom=new JSDOM(fs.readFileSync(root+'index.html','utf8'),{url:'https://example.test/#games',runScripts:'outside-only',pretendToBeVisual:true});
 const w=dom.window,d=w.document,$=id=>d.getElementById(id);
 try{
  w.matchMedia=()=>({matches:true});
  const saved=JSON.stringify({favourites:['autumn-drift','retired-fav'],recent:['little-lake'],plays:{'little-lake':2}});
  w.localStorage.setItem('after-class-hub-v1',saved);
  w.eval(fs.readFileSync(root+'catalog.js','utf8'));
  w.eval(fs.readFileSync(root+'app.js','utf8'));
  assert.equal($('frame').getAttribute('src'),null,'no game loads before unlock');
  await unlockShell(w);
  assert.equal($('heroTrack').querySelector('h3').textContent,'Gummy Bay');
  const expected=w.GAME_CATALOG.filter(g=>g.added==='2026-11-10').map(g=>g.title).sort();
  assert.equal(expected.length,5);
  assert.deepEqual([...$('newCards').querySelectorAll('.capsule-title')].map(x=>x.textContent).sort(),Array.from(expected));
  assert.equal($('improvedRow').hidden,false);
  assert.ok([...$('improvedCards').querySelectorAll('.capsule-title')].every(x=>!expected.includes(x.textContent)),'new and improved shelves do not duplicate games');
  $('groupBy').value='none';$('sortGames').value='newest';$('sortGames').dispatchEvent(new w.Event('change'));
  assert.deepEqual([...d.querySelectorAll('#games .game h3')].slice(0,5).map(x=>x.textContent).sort(),Array.from(expected));
  d.querySelector('#tagFilters [data-tag="Local two-player"]').click();
  assert.ok(d.querySelector('[data-game="chaos-court"]'));
  assert.equal(d.querySelector('[data-game="gummy-bay"]'),null,'online co-op is not labelled local two-player');
  assert.equal($('newRow').hidden,true);assert.equal($('improvedRow').hidden,true);
  $('clearFilters').click();
  $('search').value='local two-player';$('search').dispatchEvent(new w.Event('input'));
  assert.ok(d.querySelector('[data-game="chaos-court"]'),'play-mode tags are searchable');
  assert.equal(w.localStorage.getItem('after-class-hub-v1'),saved,'discovery preserves saved preferences');
  assert.ok(!d.body.textContent.includes('Lucky Company is solo'));
  console.log('PASS swarm hub: gated launch, metadata shelves, newest sort, local two-player filtering/search and preserved saves.');
 }finally{w.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
