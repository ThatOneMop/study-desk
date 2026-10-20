const fs=require('fs'),assert=require('node:assert/strict'),{JSDOM}=require('jsdom');
const root=__dirname+'/../',dom=new JSDOM(fs.readFileSync(root+'index.html','utf8'),{url:'https://example.test/repo/',runScripts:'outside-only',pretendToBeVisual:true});
const w=dom.window,d=w.document,$=id=>d.getElementById(id),timeouts=[],cleared=[];
const nativeTimeout=w.setTimeout.bind(w),nativeClear=w.clearTimeout.bind(w);
w.setTimeout=(fn,ms,...args)=>{if(ms===15000){const id=10000+timeouts.length;timeouts.push({fn,id});return id;}return nativeTimeout(fn,ms,...args)};
w.clearTimeout=id=>{cleared.push(id);nativeClear(id)};
w.eval(fs.readFileSync(root+'catalog.js','utf8'));w.eval(fs.readFileSync(root+'app.js','utf8'));
const frame=$('frame'),launch=id=>d.querySelector(`[data-action="play"][data-game="${id}"]`).click();
frame.onload();assert.equal($('loadStatus').hidden,true);
$('openGames').click();launch('after-hours');assert.equal(frame.getAttribute('aria-busy'),'true');
// An error/fallback page fires load too; a missing bridge must stay visible.
frame.onload();assert.equal($('loadStatus').hidden,false);assert.equal($('loadActions').hidden,false);assert($('loadMessage').textContent.includes('did not load'));assert.equal(d.activeElement,$('retryLoad'));
const firstWindow=frame.contentWindow;w.confirm=()=>false;$('retryLoad').click();assert.equal(frame.contentWindow,firstWindow);
w.confirm=()=>true;$('retryLoad').click();assert.notEqual(frame.contentWindow,firstWindow);assert.equal($('loadActions').hidden,true);
const retryTimer=timeouts.at(-1);frame.contentWindow.StudyBridge={};frame.onload();assert.equal($('loadStatus').hidden,true);assert.equal(frame.getAttribute('aria-busy'),'false');assert(cleared.includes(retryTimer.id));retryTimer.fn();assert.equal($('loadStatus').hidden,true);
$('libraryBtn').click();launch('underleaf');const oldTimer=timeouts.at(-1);$('libraryBtn').click();launch('after-hours');oldTimer.fn();assert($('loadMessage').textContent.startsWith('Loading After Hours'));
// A delayed event for a different route must not finish the current launch.
const currentTimer=timeouts.at(-1);frame.src='games/underleaf/index.html';frame.contentWindow.StudyBridge={};frame.onload();assert(!cleared.includes(currentTimer.id));assert.equal(frame.getAttribute('aria-busy'),'true');
frame.focus();currentTimer.fn();assert($('loadMessage').textContent.includes('taking longer'));assert.equal($('loadActions').hidden,false);assert.equal(d.activeElement,frame);
$('loadCollection').click();assert.equal($('arcade').hidden,false);$('search').focus();
frame.src='games/after-hours/';frame.contentWindow.StudyBridge={};frame.onload();assert.equal($('loadStatus').hidden,true);assert.equal(d.activeElement,$('search'));
$('sessionReturn').querySelector('button').click();$('pauseGame').click();frame.onload();assert.equal(d.activeElement,$('resumeGame'));
// Security exceptions inspecting a cross-origin/error document get a safe message.
Object.defineProperty(frame,'contentWindow',{configurable:true,value:{get location(){throw new Error('blocked')}}});frame.onload();assert($('loadMessage').textContent.includes('could not be checked'));assert.equal(d.activeElement,$('resumeGame'));
delete frame.contentWindow;
assert.equal(JSON.parse(w.localStorage.getItem('after-class-hub-v1')).recent[0],'after-hours');
console.log('PASS loading: missing bridge, timeout, cancel/retry, successful recovery, stale event/timer isolation, directory route, inactive/paused focus, safe inspection failure; no save deletion.');
w.close();
