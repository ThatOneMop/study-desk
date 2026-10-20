const assert=require('node:assert/strict'),fs=require('fs'),{JSDOM}=require('jsdom');
const root=__dirname+'/../',KEY='study-desk-v1',DECK='study-desk-decks-v1';
const original=[{id:'one',deck:'Science',q:'Original question',a:'Original answer',known:false}];
function boot(names=['Science']){
 const dom=new JSDOM(fs.readFileSync(root+'index.html','utf8'),{url:'https://example.test/',runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window,d=w.document,$=id=>d.getElementById(id);
 w.localStorage.setItem(KEY,JSON.stringify(original));w.localStorage.setItem(DECK,JSON.stringify(names));
 w.eval(fs.readFileSync(root+'catalog.js','utf8'));w.eval(fs.readFileSync(root+'app.js','utf8'));
 return {w,d,$,async import(payload,size){const input=$('import');Object.defineProperty(input,'files',{configurable:true,value:[{size:size??JSON.stringify(payload).length,text:async()=>JSON.stringify(payload)}]});await input.onchange({target:input});},close:()=>w.close()};
}
const incoming={id:'two',deck:'Maths',q:'2+2?',a:'4',known:true};
(async()=>{
 let g=boot(),before=g.w.localStorage.getItem(KEY);
 await g.import({version:2,cards:[incoming],decks:Array.from({length:10001},(_,i)=>'Deck '+i)});
 assert.equal(g.w.localStorage.getItem(KEY),before,'over-limit deck import must not mutate cards');assert.equal(g.w.localStorage.getItem(DECK),'["Science"]');assert.match(g.$('notice').textContent,/10,000/);g.close();
 g=boot();await g.import({cards:[incoming],decks:'not an array'});assert.equal(g.w.localStorage.getItem(KEY),JSON.stringify(original),'malformed deck metadata rejected');g.close();
 g=boot();await g.import({cards:[incoming],decks:Array.from({length:9999},(_,i)=>'Deck '+i)});assert.equal(g.w.localStorage.getItem(KEY),JSON.stringify(original),'combined deck count must fit, not only incoming count');g.close();
 g=boot();await g.import({cards:[incoming],decks:['Maths']},10000001);assert.equal(g.w.localStorage.getItem(KEY),JSON.stringify(original),'oversized file rejected');g.close();
 g=boot();let calls=0;g.w.crypto.randomUUID=()=>{if(++calls===2)throw Error('UUID unavailable');return 'new-id'};
 await g.import({cards:[incoming,{...incoming,id:'three'}],decks:[]});
 let exported;g.w.Blob=class{constructor(parts){exported=parts.join('')}};g.w.URL.createObjectURL=()=> 'blob:test';g.w.HTMLAnchorElement.prototype.click=()=>{};g.$('backup').click();assert.equal(JSON.parse(exported).cards.length,1,'failed preparation leaves in-memory cards intact');g.close();
 g=boot();const newer=JSON.stringify([{...original[0],q:'Newer question'}]);g.w.localStorage.setItem(KEY,newer);await g.import({version:2,cards:[incoming],decks:['Empty deck']});assert.equal(g.w.localStorage.getItem(KEY),newer);assert.match(g.$('notice').textContent,/temporary/i,'blocked import must not claim saved success');assert.equal(g.$('decktitle').textContent,'Maths');g.close();
 g=boot();await g.import({version:2,cards:[{...incoming,extra:'discard me'}],decks:['Empty deck']});let result=JSON.parse(g.w.localStorage.getItem(KEY));assert.equal(result.length,2);assert.equal(result[1].known,true);assert.notEqual(result[1].id,'two');assert.equal(result[1].extra,undefined);assert.deepEqual(JSON.parse(g.w.localStorage.getItem(DECK)),['Science','Empty deck','Maths']);assert.match(g.$('notice').textContent,/Imported/);g.close();
 g=boot();await g.import([incoming]);assert.equal(JSON.parse(g.w.localStorage.getItem(KEY)).length,2,'legacy arrays supported');g.close();
 g=boot();g.w.Storage.prototype.setItem=()=>{throw Error('quota')};await g.import([incoming]);assert.equal(g.w.localStorage.getItem(KEY),JSON.stringify(original));assert.match(g.$('notice').textContent,/temporary/i,'storage errors cannot claim saved success');g.close();
 console.log('PASS Study import: deck/file bounds, malformed metadata, all-or-nothing preparation, conflict warning, safe fields, mastery and legacy arrays');
})().catch(e=>{console.error(e);process.exit(1)});
