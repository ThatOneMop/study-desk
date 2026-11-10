const assert=require('node:assert/strict'),fs=require('fs'),path=require('path'),{JSDOM}=require('jsdom');
const dir=__dirname,dom=new JSDOM(fs.readFileSync(path.join(dir,'index.html'),'utf8'),{url:'https://test.example/games/ashwake/',runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window;
w.requestAnimationFrame=()=>1;w.matchMedia=()=>({matches:false});w.HTMLCanvasElement.prototype.getContext=()=>({});
w.eval(fs.readFileSync(path.join(dir,'engine.js'),'utf8'));
w.eval(fs.readFileSync(path.join(dir,'game.js'),'utf8').replace('load();syncSound();','window.__inputTest={readInput,sync,get run(){return run},set run(value){run=value}};load();syncSound();'));
const $=id=>w.document.getElementById(id);$('begin').click();
w.document.dispatchEvent(new w.KeyboardEvent('keydown',{key:'d',bubbles:true}));assert.equal(w.__inputTest.readInput().x,1);
$('pauseBtn').click();assert.equal(w.__inputTest.readInput().x,0,'pause clears held keyboard input');
$('resume').click();assert.equal(w.__inputTest.readInput().x,0,'resume requires fresh input');w.document.dispatchEvent(new w.KeyboardEvent('keydown',{key:'d',repeat:true,bubbles:true}));assert.equal(w.__inputTest.readInput().x,0,'a held key repeat cannot re-arm movement');
w.document.dispatchEvent(new w.KeyboardEvent('keydown',{key:'a',bubbles:true}));
w.__inputTest.run.phase='level';w.__inputTest.sync();assert.equal(w.__inputTest.readInput().x,0,'relic draft clears movement');
w.__inputTest.run.phase='play';w.__inputTest.sync();
const view=$('view');view.getBoundingClientRect=()=>({left:0,top:0,width:960,height:540});
view.dispatchEvent(new w.MouseEvent('pointerdown',{clientX:600,clientY:270,button:0}));assert(w.__inputTest.readInput().x>0);
view.dispatchEvent(new w.Event('lostpointercapture'));assert.equal(w.__inputTest.readInput().x,0,'lost capture releases pointer movement');
// Every non-play transition releases keyboard, canvas pointer and captured touch-stick input.
const savedRun=w.__inputTest.run,stick=$('stick');stick.getBoundingClientRect=()=>({left:0,top:0,width:120,height:120});
for(const phase of ['pause','level','dead','dawn','title']){
 w.__inputTest.run=savedRun;savedRun.phase='play';w.__inputTest.sync();
 w.document.dispatchEvent(new w.KeyboardEvent('keydown',{key:'d',bubbles:true}));
 view.dispatchEvent(new w.MouseEvent('pointerdown',{clientX:600,clientY:270,button:0}));
 const down=new w.MouseEvent('pointerdown',{clientX:95,clientY:60,button:0});Object.defineProperty(down,'pointerId',{value:7});stick.dispatchEvent(down);
 assert(w.__inputTest.readInput().x>1,phase+' starts with held input from all controls');assert.notEqual($('nub').style.transform,'');
 if(phase==='title')w.__inputTest.run=null;else savedRun.phase=phase;
 w.__inputTest.sync();assert.equal(w.__inputTest.readInput().x,0,phase+' clears all held input');assert.equal(w.__inputTest.readInput().y,0);assert.equal($('nub').style.transform,'');
 const move=new w.MouseEvent('pointermove',{clientX:100,clientY:60});Object.defineProperty(move,'pointerId',{value:7});stick.dispatchEvent(move);assert.equal(w.__inputTest.readInput().x,0,phase+' drops stale touch capture identity');
}
w.__inputTest.run=savedRun;savedRun.phase='play';w.__inputTest.sync();
view.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert.equal(savedRun.phase,'pause');
view.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',repeat:true,bubbles:true}));assert.equal(savedRun.phase,'pause','holding Escape must keep the watch paused');
view.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert.equal(savedRun.phase,'play','a fresh Escape press resumes');
dom.window.close();console.log('Ashwake: pause/resume, all non-play transitions, Escape repeat and lost-pointer input release passed');
