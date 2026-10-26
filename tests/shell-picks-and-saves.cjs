const assert=require('node:assert/strict'),fs=require('fs'),{JSDOM}=require('jsdom');
const root=__dirname+'/../';
function boot(entries={},confirm=()=>true){
 const dom=new JSDOM(fs.readFileSync(root+'index.html','utf8'),{url:'https://example.test/',runScripts:'outside-only',pretendToBeVisual:true});
 const w=dom.window,d=w.document,$=id=>d.getElementById(id);
 for(const [key,value] of Object.entries(entries))w.localStorage.setItem(key,value);
 w.confirm=confirm;
 let reloaded=0;w.eval(fs.readFileSync(root+'catalog.js','utf8'));w.eval(fs.readFileSync(root+'app.js','utf8'));
 w.studyReloadAfterImport=()=>{reloaded++};
 return {w,d,$,reloads:()=>reloaded,close:()=>w.close(),confirm};
}
function file(payload,size){const text=typeof payload==='string'?payload:JSON.stringify(payload);return {size:size??text.length,text:async()=>text}}
async function choose(g,payload,size){
 const input=g.$('importSaves');
 Object.defineProperty(input,'files',{configurable:true,value:[file(payload,size)]});
 const pending=input.onchange({target:input});
 let opened=false;
 for(let i=0;i<40&&!opened;i++){await new Promise(resolve=>setImmediate(resolve));opened=!!g.$('saveImportDialog').open}
 const keys=opened?[...g.$('saveImportList').querySelectorAll('code')].map(node=>node.textContent):[];
 if(opened)g.$(g.confirm()?'saveImportConfirm':'saveImportCancel').click();
 await pending;
 return keys;
}
(async()=>{
 const sunday=new Date(2026,9,25,23,30),monday=new Date(2026,9,26,0,30),nextSunday=new Date(2026,10,1,23,30),nextMonday=new Date(2026,10,2,0,30);
 let g=boot();
 const pick=date=>g.w.studyMondayPick(date);
 assert.equal(pick(monday).id,pick(nextSunday).id,'a Monday pick lasts through the following Sunday');
 assert.notEqual(pick(sunday).id,pick(monday).id,'the pick changes on Monday');
 assert.notEqual(pick(nextSunday).id,pick(nextMonday).id,'the next Monday chooses again');
 for(let i=0;i<120;i++){const game=pick(new Date(2026,0,5+i*7));assert.equal(game.type,'bundled');assert.equal(game.id,pick(new Date(2026,0,5+i*7)).id)}
 assert.equal(g.$('studyMondayTitle').textContent,'Monday pick');
 assert.equal(g.$('studyMonday').getAttribute('aria-labelledby'),'studyMondayTitle');
 assert.match(g.$('studyMondayText').textContent,new RegExp('Week of .*\\. '+pick(new Date()).title));
 assert.equal(g.$('studyMondayPlay').textContent,'Play Monday pick: '+pick(new Date()).title);
 assert.equal(g.$('studyMondayPlay').getAttribute('aria-describedby'),'studyMondayText');
 assert.equal(g.$('arcadeMondayPlay').textContent,g.$('studyMondayPlay').textContent);
 g.$('studyMondayPlay').click();
 assert.equal(g.$('player').hidden,false);
 assert.equal(g.$('frame').getAttribute('src'),pick(new Date()).url);
 assert.equal(g.$('playing').textContent,pick(new Date()).title);
 g.close();

 g=boot({'littleLakeV1':'{not json','keep-me':'stay'});
 let blob,name;g.w.Blob=class{constructor(parts){blob=parts.join('')}};g.w.URL.createObjectURL=()=>'blob:test';g.w.URL.revokeObjectURL=()=>{};
 g.w.HTMLAnchorElement.prototype.click=function(){name=this.download};
 g.$('exportSaves').click();
 const exported=JSON.parse(blob);
 assert.equal(name,'study-desk-saves.json');
 assert.equal(exported.format,'study-desk-saves');assert.equal(exported.version,1);
 assert.equal(exported.entries.find(entry=>entry.key==='littleLakeV1').value,'{not json');
 assert.equal(exported.entries.find(entry=>entry.key==='keep-me').value,'stay');
 assert.deepEqual(exported.entries.map(entry=>entry.key),[...exported.entries.map(entry=>entry.key)].sort());
 g.$('backup').click();
 assert.equal(JSON.parse(blob).version,2,'card export stays separate from the all-saves file');
 let read=false;const oversized=g.$('importSaves');
 Object.defineProperty(oversized,'files',{configurable:true,value:[{size:12000001,text:async()=>{read=true;return ''}}]});
 await oversized.onchange({target:oversized});
 assert.equal(read,false);assert.match(g.$('saveVaultStatus').textContent,/not imported/);assert.equal(g.w.localStorage.getItem('keep-me'),'stay');
 await choose(g,'{');assert.match(g.$('notice').textContent,/not a Study Desk save backup/);assert.equal(g.w.localStorage.getItem('littleLakeV1'),'{not json');
 await choose(g,{format:'study-desk-saves',version:'1',entries:[]});assert.match(g.$('saveVaultStatus').textContent,/not a Study Desk save backup/);
 await choose(g,{format:'study-desk-saves',version:1,entries:[{key:'keep-me',value:'x'},{key:'keep-me',value:'y'}]});
 assert.equal(g.w.localStorage.getItem('keep-me'),'stay');
 g.close();

 g=boot({'same':'1','keep-me':'stay'});
 let sameKeys=await choose(g,{format:'study-desk-saves',version:1,entries:[{key:'same',value:'1'}]});
 assert.deepEqual(sameKeys,[]);
 assert.match(g.$('saveImportSummary').textContent,/Nothing in this file is different/);
 assert.equal(g.w.localStorage.getItem('same'),'1');assert.equal(g.reloads(),0);
 sameKeys=await choose(g,{format:'study-desk-saves',version:1,entries:[{key:'same',value:'1'},{key:'added',value:'2'}]});
 assert.deepEqual(sameKeys,['added']);
 assert.match(g.$('saveImportList').textContent,/added — new on this device/);
 assert.equal(g.w.localStorage.getItem('same'),'1');assert.equal(g.w.localStorage.getItem('added'),'2');assert.equal(g.reloads(),1);
 g.close();

 g=boot({'littleLakeV1':'{not json','keep-me':'stay'},()=>false);
 let keys=await choose(g,{format:'study-desk-saves',version:1,entries:[{key:'littleLakeV1',value:'{"money":2}'},{key:'<img id="pwn">',value:'<img id="pwn">'}]});
 assert.deepEqual(keys,['littleLakeV1','<img id="pwn">']);
 assert.match(g.$('saveImportList').textContent,/littleLakeV1 — replaces the copy on this device/);
 assert.match(g.$('saveImportList').textContent,/<img id="pwn"> — new on this device/);
 assert.equal(g.w.localStorage.getItem('littleLakeV1'),'{not json');
 assert.equal(g.$('saveVaultStatus').textContent,'Import cancelled. Current saves were kept.');
 assert.equal(g.reloads(),0);assert.equal(g.d.getElementById('pwn'),null);
 g.close();

 g=boot({'old':'a','keep':'1'});
 const originalSet=g.w.Storage.prototype.setItem;
 g.w.Storage.prototype.setItem=function(key,value){if(key==='boom')throw Error('quota');return originalSet.call(this,key,value)};
 await choose(g,{format:'study-desk-saves',version:1,entries:[{key:'old',value:'b'},{key:'boom',value:'c'},{key:'extra',value:'d'}]});
 assert.equal(g.w.localStorage.getItem('old'),'a');assert.equal(g.w.localStorage.getItem('keep'),'1');
 assert.equal(g.w.localStorage.getItem('boom'),null);assert.equal(g.w.localStorage.getItem('extra'),null);
 assert.match(g.$('saveVaultStatus').textContent,/previous saves were kept/);assert.equal(g.reloads(),0);
 g.w.Storage.prototype.setItem=originalSet;
 g.close();

 g=boot({'littleLakeV1':'{not json','keep-me':'stay','study-desk-v1':'[]'});
 keys=await choose(g,{format:'study-desk-saves',version:1,entries:[{key:'littleLakeV1',value:'{"money":2}'},{key:'fresh-game',value:'{"ok":true}'},{key:'<img id="pwn">',value:'<img id="pwn">'}]});
 assert.deepEqual(keys,['littleLakeV1','fresh-game','<img id="pwn">']);
 assert.match(g.$('saveImportList').textContent,/littleLakeV1/);
 assert.equal(g.w.localStorage.getItem('littleLakeV1'),'{"money":2}');
 assert.equal(g.w.localStorage.getItem('fresh-game'),'{"ok":true}');
 assert.equal(g.w.localStorage.getItem('keep-me'),'stay');
 assert.equal(g.w.localStorage.getItem('<img id="pwn">'),'<img id="pwn">');
 assert.equal(g.d.getElementById('pwn'),null,'imported save text is stored, not turned into HTML');
 assert.equal(g.reloads(),1);assert.match(g.$('saveVaultStatus').textContent,/Reloading/);
 g.$('know').click();assert.equal(g.w.localStorage.getItem('study-desk-v1'),'[]','a restored save is not overwritten before reload');
 g.close();
 console.log('PASS Monday pick and save vault: weekly boundary, bundled choice, exact export, separate card backup, rejection, cancel, rollback, and confirmed import');
})().catch(e=>{console.error(e);process.exit(1)});
