'use strict';
const {JSDOM}=require('jsdom'),test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
test('real shared pause displays reef goals and vitality, blocks cuts and resumes the proposal',()=>{
 const dom=new JSDOM(fs.readFileSync(root+'/games/reefwright/index.html','utf8'),{url:'https://example.test/games/reefwright/',runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window,d=w.document,$=id=>d.getElementById(id),errors=[];
 w.addEventListener('error',e=>errors.push(e.error));w.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','');};w.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open');};
 w.eval(fs.readFileSync(root+'/games/reefwright/engine.js','utf8'));
 const p=w.Reefwright.profile();p.current=require('./fixtures/reefwright-paired-cut.json').state;w.localStorage.setItem('study-desk-reefwright-v1',JSON.stringify(p));
 w.eval(fs.readFileSync(root+'/games/desk-feel.js','utf8'));w.eval(fs.readFileSync(root+'/games/reefwright/game.js','utf8'));
 $('desk-start').click();$('prune').click();d.querySelector('[data-cell="20"]').click();$('add-cut').click();d.querySelector('[data-cell="7"]').click();const forecast=$('forecast').textContent,save=w.localStorage.getItem('study-desk-reefwright-v1');
 $('desk-pause').click();assert.equal(w.__deskPaused,true);assert.match($('desk-pause-goal').textContent,/First light/);assert.match($('desk-pause-best').textContent,/27 vitality/);$('plant').click();assert.equal(w.localStorage.getItem('study-desk-reefwright-v1'),save);assert.equal($('forecast').textContent,forecast);
 $('desk-resume').click();assert.equal(w.__deskPaused,false);$('plant').click();assert.match($('prune').textContent,/0 left/);assert.deepEqual(errors,[]);w.close();
});
