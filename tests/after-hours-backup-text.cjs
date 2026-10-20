const assert=require('node:assert/strict'),fs=require('fs'),{JSDOM}=require('jsdom');
const root=__dirname+'/../games/after-hours/',html=fs.readFileSync(root+'index.html','utf8'),KEY='after-hours-save-v1';
function boot(raw){
 const dom=new JSDOM(html,{url:'https://example.test/games/after-hours/',runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window,d=w.document,$=id=>d.getElementById(id);
 w.matchMedia=()=>({matches:true});w.confirm=()=>true;w.HTMLDialogElement.prototype.showModal=function(){this.open=true};w.HTMLDialogElement.prototype.close=function(){this.open=false};
 if(raw!==undefined)w.localStorage.setItem(KEY,raw);
 for(const script of d.querySelectorAll('script')){if(script.src.includes('save-store.js'))w.eval(fs.readFileSync(root+'save-store.js','utf8'));else if(!script.src)w.eval(script.textContent)}
 if(!$('modal').open)$('saves').click();return {w,d,$,close:()=>w.close()};
}
let g=boot();assert(g.$('showRunText'),'backup must be available without file downloads');g.$('showRunText').click();const run=JSON.parse(g.$('backupText').value),before=g.w.localStorage.getItem(KEY);assert(g.$('backupText').readOnly);assert.equal(g.d.activeElement,g.$('backupText'));assert(g.$('backupTextTools').open);assert.equal(run.money,8);
const replacement={...run,money:42};g.$('restoreText').value=JSON.stringify(replacement);g.w.confirm=()=>false;g.$('restoreTextRun').click();assert.equal(g.w.localStorage.getItem(KEY),before);assert(g.$('modal').open,'cancel keeps text and current run');
g.w.confirm=message=>{assert.match(message,/42/);return true};g.$('restoreTextRun').click();assert.equal(JSON.parse(g.w.localStorage.getItem(KEY)).money,42);assert.equal(g.w.localStorage.getItem(KEY+'.backup'),before);assert(!g.$('modal').open);g.close();
g=boot();const unchanged=g.w.localStorage.getItem(KEY);for(const invalid of ['{broken','{}','x'.repeat(1000001)]){g.$('restoreText').value=invalid;g.$('restoreTextRun').click();assert.equal(g.w.localStorage.getItem(KEY),unchanged);assert.match(g.$('saveMessage').textContent,/not changed/)}g.close();
g=boot('{broken');g.$('showStoredText').click();assert.equal(g.$('backupText').value,'{broken');assert.equal(g.w.localStorage.getItem(KEY),'{broken','showing raw text never repairs/replaces it');g.close();
g=boot();g.w.URL.createObjectURL=()=>{throw Error('download unavailable')};g.$('exportRun').click();assert(g.$('backupText').value);assert(g.$('backupTextTools').open);assert.match(g.$('saveMessage').textContent,/Copy/);g.close();
g=boot();g.$('showRunText').click();const text=g.$('backupText').value,original=g.w.localStorage.getItem(KEY);g.$('restoreText').value=text;g.w.Storage.prototype.setItem=()=>{throw Error('quota')};g.$('restoreTextRun').click();assert.equal(g.w.localStorage.getItem(KEY),original);assert(g.$('modal').open);assert.match(g.$('saveMessage').textContent,/Could not safely/);g.close();
g=boot();g.$('showRunText').click();const saved=g.w.localStorage.getItem(KEY);g.$('backupText').value='not a save';g.$('closeModal').click();assert.equal(g.w.localStorage.getItem(KEY),saved);g.$('saves').click();assert.equal(g.$('backupText').value,'','old displayed text is not reused');g.close();
console.log('PASS After Hours backup text: read-only export/focus, valid restore/backup, cancel, malformed/oversized input, exact damaged raw, download failure fallback, quota and reopen safety');
