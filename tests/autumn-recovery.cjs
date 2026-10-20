const assert=require('node:assert/strict'),fs=require('fs'),{JSDOM}=require('jsdom');
const S=require('../games/autumn-drift/save-store.js'),root=__dirname+'/../';
const html=fs.readFileSync(root+'games/autumn-drift/index.html','utf8');
function boot(raw=null){
 const dom=new JSDOM(html,{url:'https://example.test/garden/',runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window,d=w.document,$=id=>d.getElementById(id);
 w.requestAnimationFrame=()=>1;w.confirm=()=>true;w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:(_,k)=>k==='createLinearGradient'?()=>({addColorStop(){}}):()=>{}});
 if(raw!==null)w.localStorage.setItem(S.KEY,raw);
 for(const name of ['save-store.js','recovery.js','game.js'])w.eval(fs.readFileSync(root+'games/autumn-drift/'+name,'utf8'));
 $('start').click();$('savesBtn').click();
 function file(text,size=typeof text==='string'?text.length:10){Object.defineProperty($('importFile'),'files',{configurable:true,value:[{size,text:typeof text==='function'?text:async()=>text}]});return $('importFile').onchange()}
 function current(){ $('showGarden').click();return $('gardenJson').value }
 function paste(text){$('gardenJson').value=text;$('importGarden').click()}
 return {w,d,$,file,current,paste,raw:()=>w.localStorage.getItem(S.KEY),close:()=>w.close()};
}
(async()=>{
 let g=boot();const original=g.current();g.close();
 const incoming=JSON.stringify({...JSON.parse(original),money:123});
 g=boot(original);let prompts=[];g.w.confirm=t=>{prompts.push(t);return true};
 for(const text of ['{}','null','{bad',JSON.stringify({...S.initial(),garden:null}),'x'.repeat(S.LIMIT+1)]){g.paste(text);assert.equal(g.raw(),original)}
 assert.equal(prompts.length,0,'invalid/incomplete imports never ask to replace');
 g.w.confirm=()=>false;g.paste(incoming);assert.equal(g.raw(),original);assert.equal(g.$('money').textContent,'0');assert.match(g.$('recoveryStatus').textContent,/cancelled/);
 g.w.confirm=t=>{prompts.push(t);return true};g.paste(incoming);assert.equal(JSON.parse(g.raw()).money,123);assert.equal(g.w.localStorage.getItem(S.BACKUP),original);assert.equal(g.$('money').textContent,'123');assert(prompts.at(-1).includes('123 acorns'));assert.equal(g.$('savesPanel').style.display,'flex');
 g.$('restoreGarden').click();assert.equal(JSON.parse(g.raw()).money,0);assert.equal(JSON.parse(g.w.localStorage.getItem(S.BACKUP)).money,123);assert.equal(g.$('money').textContent,'0');
 const before=g.raw(),count=prompts.length;await g.file(incoming);assert.equal(g.raw(),before,'loading a file only fills a validated draft');assert.equal(prompts.length,count);assert.equal(g.$('gardenJson').value,incoming);
 let read=false;await g.file(()=>{read=true;return Promise.resolve(incoming)},S.LIMIT+1);assert(!read);
 let finish;const pending=g.file(()=>new Promise(resolve=>finish=resolve));assert(g.$('importGarden').disabled);g.$('cancelRead').click();finish(incoming);await pending;assert.equal(g.raw(),before);assert.equal(prompts.length,count);assert(!g.$('importGarden').disabled);
 const leaving=g.file(()=>new Promise(resolve=>finish=resolve));g.$('closeSaves').click();finish(incoming);await leaving;assert.equal(prompts.length,count);assert.equal(g.d.activeElement,g.$('game'));g.close();
 g=boot(original);g.w.confirm=()=>{g.w.localStorage.setItem(S.KEY,'newer tab');return true};g.paste(incoming);assert.equal(g.raw(),'newer tab');assert.equal(g.$('money').textContent,'0');assert.match(g.$('saveStatus').textContent,/Another tab/);g.close();
 g=boot('{damaged');g.paste(incoming);assert.equal(g.w.localStorage.getItem(S.BACKUP),'{damaged');assert.equal(JSON.parse(g.raw()).money,123);assert.equal(g.$('saveHint').textContent,'Autosaves on this device');g.$('restoreGarden').click();assert.equal(JSON.parse(g.raw()).money,123,'invalid backup is not restored');
 g.w.URL.createObjectURL=()=>{throw Error('no download')};g.$('exportPrevious').click();assert.equal(g.$('gardenJson').value,'{damaged','raw text survives even if download fails');g.close();
 g=boot(original);const set=g.w.Storage.prototype.setItem;g.w.Storage.prototype.setItem=function(k,v){if(k===S.BACKUP)throw Error('quota');return set.call(this,k,v)};g.paste(incoming);assert.equal(g.raw(),original);assert.equal(g.$('money').textContent,'0');assert.match(g.$('recoveryStatus').textContent,/not replaced/);g.close();
 const data=new Map([[S.KEY,original],[S.BACKUP,'older backup']]),store=S.create({getItem:k=>data.get(k)??null,setItem:(k,v)=>{if(k===S.KEY)throw Error('write failed');data.set(k,v)},removeItem:k=>data.delete(k)});store.load();assert(!store.replace(JSON.parse(incoming),original));assert.equal(data.get(S.KEY),original);assert.equal(data.get(S.BACKUP),'older backup');
 g=boot(original);const departing=g.file(()=>new Promise(resolve=>finish=resolve));g.w.dispatchEvent(new g.w.Event('pagehide'));finish(incoming);await departing;assert.match(g.$('recoveryStatus').textContent,/cancelled/);g.close();
 console.log('PASS Autumn recovery: strict text/file validation, review/confirm/cancel, backup/restore, corruption recovery, write/conflict failures, download-text fallback, late-read/pagehide guards');
})().catch(e=>{console.error(e);process.exitCode=1});
