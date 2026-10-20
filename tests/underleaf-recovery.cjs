const assert=require('node:assert/strict'),fs=require('fs'),{JSDOM}=require('jsdom');
const S=require('../games/underleaf/save-store.js'),root=__dirname+'/../';
const html=fs.readFileSync(root+'games/underleaf/index.html','utf8');
const original={...S.initial(),food:55},incoming={...S.initial(),rooms:3,workers:20,food:123,eggs:[{left:4,duration:8}]};
function boot(){
 const dom=new JSDOM(html,{url:'https://example.test/games/underleaf/',runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window,d=w.document,$=id=>d.getElementById(id);
 w.requestAnimationFrame=()=>1;w.confirm=()=>true;
 w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:(_,key)=>key==='createLinearGradient'?()=>({addColorStop(){}}):()=>{}});
 w.localStorage.setItem(S.KEY,JSON.stringify(original));
 for(const name of ['save-store.js','recovery.js'])w.eval(fs.readFileSync(root+'games/underleaf/'+name,'utf8'));
 for(const script of d.querySelectorAll('script:not([src])'))w.eval(script.textContent+'\nwindow.testTick=tick;');
 function importFile(text,size=String(text).length){Object.defineProperty($('importFile'),'files',{configurable:true,value:[{size,text:typeof text==='function'?text:async()=>text}]});return $('importFile').onchange()}
 return {w,$,importFile,raw:()=>w.localStorage.getItem(S.KEY),close:()=>w.close()};
}
(async()=>{
 let g=boot(),prompts=[];g.w.confirm=message=>{prompts.push(message);return true};
 const start=g.raw();
 for(const bad of ['{}','null','{bad',JSON.stringify({workers:5}),JSON.stringify({...incoming,eggs:null})]){await g.importFile(bad);assert.equal(g.raw(),start);}
 assert.equal(prompts.length,0,'invalid data never reaches replacement confirmation');
 let read=false;await g.importFile(()=>{read=true;return Promise.resolve(JSON.stringify(incoming))},100001);assert(!read,'reject oversized file before reading');
 g.w.confirm=()=>false;await g.importFile(JSON.stringify(incoming));assert.equal(g.raw(),start);assert.equal(g.$('workers').textContent,'3');
 g.w.confirm=message=>{prompts.push(message);return true};g.$('start').click();g.$('pause').click();
 await g.importFile(JSON.stringify(incoming));assert(prompts.at(-1).includes('20 workers'));assert.deepEqual(JSON.parse(g.raw()),incoming);assert.equal(g.w.localStorage.getItem(S.BACKUP),start);assert.equal(g.$('workers').textContent,'20');assert.equal(g.$('pause').textContent,'▶ Resume','import preserves manual pause');
 g.$('restoreColony').click();assert.deepEqual(JSON.parse(g.raw()),original);assert.deepEqual(JSON.parse(g.w.localStorage.getItem(S.BACKUP)),incoming);assert.equal(g.$('workers').textContent,'3');
 let finish;const pending=g.importFile(()=>new Promise(resolve=>finish=resolve),10);assert.equal(g.$('cancelImport').hidden,false);assert.equal(g.$('reset').disabled,true);const before=g.raw(),promptCount=prompts.length;
 g.$('cancelImport').click();finish(JSON.stringify(incoming));await pending;assert.equal(g.raw(),before);assert.equal(prompts.length,promptCount);assert.equal(g.$('reset').disabled,false);assert.equal(g.$('pause').textContent,'▶ Resume');
 const departing=g.importFile(()=>new Promise(resolve=>finish=resolve),10);g.w.dispatchEvent(new g.w.Event('pagehide'));finish(JSON.stringify(incoming));await departing;assert.equal(prompts.length,promptCount,'pagehide cancels late restoration');g.close();
 g=boot();g.w.confirm=()=>{g.w.localStorage.setItem(S.KEY,'newer tab');return true};await g.importFile(JSON.stringify(incoming));assert.equal(g.raw(),'newer tab');assert.equal(g.$('workers').textContent,'3');assert.match(g.$('saveStatus').textContent,/another tab/);g.close();
 g=boot();const set=g.w.Storage.prototype.setItem;g.w.Storage.prototype.setItem=function(key,value){if(key===S.BACKUP)throw Error('quota');return set.call(this,key,value)};await g.importFile(JSON.stringify(incoming));assert.deepEqual(JSON.parse(g.raw()),original);assert.equal(g.$('workers').textContent,'3');assert.match(g.$('toast').textContent,/not replaced/);g.close();
 g=boot();g.w.localStorage.setItem(S.BACKUP,'damaged backup');g.$('restoreColony').click();assert.deepEqual(JSON.parse(g.raw()),original);assert.equal(g.w.localStorage.getItem(S.BACKUP),'damaged backup');g.close();
 // If replacement fails after backup creation, retain the older backup when possible.
 const data=new Map([[S.KEY,JSON.stringify(original)],[S.BACKUP,JSON.stringify(incoming)]]);
 const store=S.create({getItem:k=>data.get(k)??null,setItem:(k,v)=>{if(k===S.KEY)throw Error('main write failed');data.set(k,v)},removeItem:k=>data.delete(k)});store.load();assert(!store.replace(S.initial()));assert.equal(data.get(S.KEY),JSON.stringify(original));assert.equal(data.get(S.BACKUP),JSON.stringify(incoming));
 console.log('PASS Underleaf recovery: complete-file validation, import/restore, named confirmation, cancel/oversize/late-read/pagehide guards, pause preservation, optimistic conflict and backup/write failures');
})().catch(error=>{console.error(error);process.exitCode=1});
