const assert=require('node:assert/strict'),fs=require('fs'),{JSDOM}=require('jsdom');
const html=fs.readFileSync('games/packworks/index.html','utf8'),dom=new JSDOM(html,{url:'https://example.test/games/packworks/',runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window;
w.requestAnimationFrame=()=>1;w.confirm=()=>true;w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:(_,key)=>key==='createLinearGradient'?()=>({addColorStop(){}}):()=>{}});
w.eval(fs.readFileSync('games/packworks/areas.js','utf8'));
w.eval(fs.readFileSync('games/packworks/trades.js','utf8'));
const js=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]).filter(s=>s.trim()).join('\n');
w.eval(js+';window.testReset={dirty(){busy=true;current=[{}];queue=[[{}]];currentIndex=5;workerElapsed=9;printElapsed=9},get clean(){return !busy&&!current.length&&!queue.length&&!currentIndex&&!workerElapsed&&!printElapsed}}');
w.testReset.dirty();w.document.getElementById('reset').click();assert.equal(w.testReset.clean,true);assert.equal(w.document.getElementById('reveal').className,'');dom.window.close();console.log('PASS Packworks reset clears pending reveals and automation timers');
