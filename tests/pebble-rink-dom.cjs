const test=require('node:test'),assert=require('node:assert/strict'),{JSDOM}=require('jsdom'),fs=require('node:fs'),E=require('../games/pebble-rink/engine.js'),solve=require('./pebble-rink-routes.cjs');function boot(raw){const d=new JSDOM(fs.readFileSync('games/pebble-rink/index.html','utf8'),{url:'https://test.invalid/games/pebble-rink/',runScripts:'outside-only',pretendToBeVisual:true}),w=d.window;w.structuredClone=structuredClone;let queue=[],draws=0,time=0,arcs=[];w.requestAnimationFrame=fn=>{queue.push(fn);return queue.length};d.stepAt=t=>{time=t;const fn=queue.shift();if(fn)fn(time)};d.advance=(n=250,dt=1000/60)=>{for(let i=0;i<n;i++)d.stepAt(time+dt)};d.stones=()=>arcs.filter(a=>a[2]===10).map(a=>a.slice(0,2));d.draws=()=>draws;w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:(_,key)=>(...args)=>{if(key==='fillRect'){draws++;arcs=[]}if(key==='arc')arcs.push(args)},set:()=>true});w.HTMLDialogElement.prototype.showModal=function(){this.open=true};w.HTMLDialogElement.prototype.close=function(){this.open=false};if(raw)w.localStorage.setItem(E.KEY,raw);for(const f of ['engine.js','game.js'])w.eval(fs.readFileSync('games/pebble-rink/'+f,'utf8'));return d}
test('all courses win through UI controls; saving during animation reloads the same resolved shot',()=>{let d=boot(),w=d.window;const $=id=>w.document.getElementById(id);for(let n=0;n<3;n++){if(n){$('courses').children[n].click();$('accept').click()}for(const shot of solve(n)){for(const k of ['angle','power','spin']){$(k).value=shot[k];$(k).dispatchEvent(new w.Event('input'))}$('throw').click();assert($('throw').disabled);const raw=w.localStorage.getItem(E.KEY),expected=E.run(E.decode(raw));d.window.close();d=boot(raw);w=d.window;assert.equal(w.localStorage.getItem(E.KEY),raw);assert.deepEqual(E.run(E.decode(w.localStorage.getItem(E.KEY))),expected)}assert.match($('status').textContent,/card earned/)}d.window.close()});
test('animation pause/resume, keyboard aim, natural loss/undo/retry and isolated reset',()=>{const d=boot(),w=d.window,$=id=>w.document.getElementById(id);w.dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowRight'}));assert.equal(JSON.parse(w.localStorage.getItem(E.KEY)).setup.angle,1);for(let i=0;i<3;i++){for(const [k,v]of [['angle',45],['power',40]]){$(k).value=v;$(k).dispatchEvent(new w.Event('input'))}$('throw').click();if(i===0){$('pause').click();const before=d.draws();d.advance(10);assert.equal(d.draws(),before);$('pause').click()}d.advance()}assert.match($('status').textContent,/End finished/);$('undo').click();assert.equal(JSON.parse(w.localStorage.getItem(E.KEY)).shots.length,2);$('retry').click();$('cancel').click();assert.equal(JSON.parse(w.localStorage.getItem(E.KEY)).shots.length,2);$('retry').click();$('accept').click();assert.equal(JSON.parse(w.localStorage.getItem(E.KEY)).shots.length,0);w.localStorage.setItem('other-game','keep');$('reset').click();$('accept').click();assert.equal(w.localStorage.getItem('other-game'),'keep');assert.equal(w.document.querySelector('header a').getAttribute('href'),'../../index.html#games');d.window.close()});
test('unreadable save stays intact through shots and cancelled recovery',()=>{const d=boot('{bad'),w=d.window,$=id=>w.document.getElementById(id);$('throw').click();d.advance();assert.equal(w.localStorage.getItem(E.KEY),'{bad');$('recover').click();$('cancel').click();assert.equal(w.localStorage.getItem(E.KEY),'{bad');$('recover').click();$('accept').click();assert.doesNotThrow(()=>E.decode(w.localStorage.getItem(E.KEY)));d.window.close()});
test('elapsed-time playback is independent of callback rate and never jumps over a pause',()=>{
  const a=boot(),b=boot();for(const d of [a,b]){d.window.document.getElementById('throw').click();d.stepAt(0)}
  a.advance(60,10);b.advance(120,5);assert.deepEqual(a.stones(),b.stones());
  const $=id=>a.window.document.getElementById(id);$('pause').click();const positions=a.stones();
  a.advance(50,1000);assert.deepEqual(a.stones(),positions);$('pause').click();a.advance(1,1000);
  assert.deepEqual(a.stones(),positions);a.advance(10,10);assert.notDeepEqual(a.stones(),positions);
  a.advance(250);b.advance(250);assert.equal($('throw').disabled,false);assert.deepEqual(a.stones(),b.stones());
  a.window.close();b.window.close();
});
test('replaying the last shot is read-only; notes explain score and undo recalls its settings',()=>{
  const d=boot(),w=d.window,$=id=>w.document.getElementById(id);$('power').value=75;$('power').dispatchEvent(new w.Event('input'));
  $('throw').click();d.advance();const saved=w.localStorage.getItem(E.KEY),end=d.stones();
  assert.match($('last-shot').textContent,/weight 75/);assert.match($('shot-changes').textContent,/Stone 1: 0 → 2/);
  $('review').click();assert.match($('status').textContent,/Replay/);assert($('throw').disabled);d.advance();
  assert.equal(w.localStorage.getItem(E.KEY),saved);assert.deepEqual(d.stones(),end);
  $('power').value=40;$('power').dispatchEvent(new w.Event('input'));$('undo').click();
  assert.equal($('power').value,'75');assert.equal($('review').disabled,true);assert.equal($('last-shot').textContent,'');
  const raw=w.localStorage.getItem(E.KEY);assert.equal(E.decode(raw).setup.power,75);d.window.close();
});
test('focused navigation and buttons keep native keys; the focused rink accepts gameplay keys',()=>{
  const d=boot(),w=d.window,$=id=>w.document.getElementById(id),initial=w.localStorage.getItem(E.KEY);
  for(const element of [$('pause'),$('retry'),$('review'),$('help'),$('courses').children[0],w.document.querySelector('header a')]){
    element.focus();for(const key of [' ','ArrowRight']){const event=new w.KeyboardEvent('keydown',{key,bubbles:true,cancelable:true});element.dispatchEvent(event);assert.equal(event.defaultPrevented,false)}
    assert.equal(w.localStorage.getItem(E.KEY),initial);
  }
  $('rink').focus();$('rink').dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));
  assert.equal(E.decode(w.localStorage.getItem(E.KEY)).setup.angle,1);
  $('rink').dispatchEvent(new w.KeyboardEvent('keydown',{key:' ',bubbles:true}));assert.equal(E.decode(w.localStorage.getItem(E.KEY)).shots.length,1);
  d.window.close();
});
test('help freezes playback and Escape restores controls after native dialog cancellation',async()=>{
  const d=boot(),w=d.window,$=id=>w.document.getElementById(id);$('help').click();assert($('throw').disabled);
  $('guide').open=false;$('guide').dispatchEvent(new w.Event('cancel'));await Promise.resolve();assert.equal($('throw').disabled,false);
  $('throw').click();d.advance(12);$('help').click();const before=d.stones();d.advance(100);assert.deepEqual(d.stones(),before);
  $('close').click();d.advance();assert.equal($('throw').disabled,false);d.window.close();
});

test('forecast is read-only and predicts collision scoring before release',()=>{
 const d=boot(),w=d.window,$=id=>w.document.getElementById(id);
 $('throw').click();d.advance();const saved=w.localStorage.getItem(E.KEY);
 $('forecast').click();assert.equal(w.localStorage.getItem(E.KEY),saved);
 assert.match($('forecast-note').textContent,/total 2 → 5/);assert.match($('forecast-note').textContent,/Stone 1: 2 → 3/);
 $('throw').click();d.advance();assert.equal(E.run(E.decode(w.localStorage.getItem(E.KEY))).score,5);
 $('undo').click();assert.match($('forecast-note').textContent,/total 2 → 5/);
 $('forecast').click();assert.match($('forecast-note').textContent,/Optional forecast/);d.window.close();
});
test('forecast follows curl and weight, blocks toggling while paused and is transient on reload',()=>{
 const d=boot(),w=d.window,$=id=>w.document.getElementById(id);$('forecast').click();
 $('power').value=40;$('power').dispatchEvent(new w.Event('input'));assert.match($('forecast-note').textContent,/total 0 → 0/);
 $('power').value=70;$('power').dispatchEvent(new w.Event('input'));$('spin').value=1;$('spin').dispatchEvent(new w.Event('input'));
 const raw=w.localStorage.getItem(E.KEY),s=E.decode(raw),expected=E.score(E.simulate([],s.setup,0).stones);
 assert.match($('forecast-note').textContent,new RegExp('total 0 → '+expected));
 $('pause').click();assert($('forecast').disabled);$('forecast').click();assert.equal($('forecast').getAttribute('aria-pressed'),'true');$('pause').click();
 const other=boot(raw);assert.equal(other.window.document.getElementById('forecast').getAttribute('aria-pressed'),'false');assert.equal(other.window.localStorage.getItem(E.KEY),raw);
 other.window.close();d.window.close();
});
test('hidden reset and recovery confirmations preserve saves until visible and resumed',()=>{
 for(const corrupt of [false,true]){
 const d=boot(corrupt?'{bad':undefined),w=d.window,$=id=>w.document.getElementById(id);
 if(!corrupt){$('throw').click();d.advance()}
 $(corrupt?'recover':'reset').click();const saved=w.localStorage.getItem(E.KEY);
 const visibility=visible=>w.dispatchEvent(new w.MessageEvent('message',{source:w.parent,origin:w.location.origin,data:{type:'study-visibility',visible}}));
 visibility(false);$('accept').click();$('pause').click();assert.equal(w.localStorage.getItem(E.KEY),saved);assert($('confirm').open);
 visibility(true);$('accept').click();assert.equal(w.localStorage.getItem(E.KEY),saved);$('cancel').click();$('pause').click();
 $(corrupt?'recover':'reset').click();$('accept').click();assert.notEqual(w.localStorage.getItem(E.KEY),saved);d.window.close();
 }
});
