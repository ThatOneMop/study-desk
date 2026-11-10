'use strict';
const test=require('node:test'),A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{JSDOM}=require('jsdom');
const E=require('../games/bell-diver/engine.js'),O=require('../games/outbreak-atlas/model.js');
function travel(s,target){const queue=[[s.pos,[]]],seen=new Set([s.pos]);let route;
 for(const [p,moves] of queue){if(p===target){route=moves;break;}for(const [dir,d]of Object.entries(E.DIRS)){const n=p+d;if(n<0||n>=35||!E.adjacent(p,n)||E.layouts[s.level].rocks.includes(n)||seen.has(n))continue;seen.add(n);queue.push([n,[...moves,dir]])}}
 A.ok(route);for(const dir of route){s=E.act(s,{type:'move',dir});A.ok(s);A.equal(s.rescues,0);s=E.decode(JSON.stringify(s));}return s;
}
test('sealed recovery can be completed at all three wrecks without pockets; old badges survive',()=>{
 let s={...E.create(),tank:2,fins:1,air:34,badges:[0,1,2,3,4,5]};
 for(let level=0;level<3;level++){
  s=E.act(s,{type:'charter',id:2});A.equal(s.charter,2);
  const pocket={...s,pos:E.layouts[level].air[0],air:4};A.equal(E.act(pocket,{type:'breathe'}),null);
  s=travel(s,E.layouts[level].items[0].p);s=E.act(s,{type:'take'});
  s=travel(s,E.layouts[level].relic);s=E.act(s,{type:'take'});s=travel(s,2);
  A.ok(s.badges.includes(6+level));A.equal(s.records[level],true);A.deepEqual(s.usedAir,[]);
  A.equal(s.coins,[11,23,36][level]);
  if(level<2)s=E.act(s,{type:'next'});
 }
 A.equal(s.won,true);A.equal(s.badges.length,9);
 s=E.act(s,{type:'retry'});A.equal(s.badges.length,9);A.equal(s.charter,-1);
 A.deepEqual(E.decode(JSON.stringify(s)),s);
});
test('sealed charter does not award a badge for split cargo and still permits standard diving',()=>{
 let s=E.act({...E.create(),tank:2,fins:1,air:34},{type:'charter',id:2});
 s=travel(s,7);s=E.act(s,{type:'take'});s=travel(s,2);A.equal(s.badges.length,0);
 let plain=E.act(E.create(),{type:'charter',id:-1});plain={...plain,pos:12,air:2};A.equal(E.act(plain,{type:'breathe'}).air,10);
});
function sprint(archetype,buys){let s=O.create({scenario:'islands',seed:2,archetype});const q=buys.slice();while(!s.won&&!s.lost){while(q.length&&O.buy(s,q[0]).ok)s=O.buy(s,q.shift()).state;s=O.step(s);A.deepEqual(O.restore(s),s);}return s;}
test('Island Sprint has seeded sea/sky winning strategies and a separate deadline loss',()=>{
 for(const [arch,buys] of [['drift',['sky','soft','footpaths','dim','carts','ember','wide']],['root',['harbors','soft','footpaths','dim','borrowed','carts','ferries','still']]]){
  const s=sprint(arch,buys);A.equal(s.won,true);A.ok(s.month<=24);for(const id of ['lantern','spire','farwhistle'])A.equal(s.lands[id].established,true);
 }
 let s=O.create({scenario:'islands',archetype:'root',pressure:'calm'});s={...s,month:23};s=O.step(s);A.equal(s.month,24);A.equal(s.lost,true);A.ok(s.effort<1);A.match(s.log[0],/charter closed/);A.equal(O.step(s),s);
});
test('notebook commissions require fresh earned progress, pay once and survive save reload',async()=>{
 const C=await import('../games/gummy-bay/notebook-commissions.mjs');
 let s={cash:10,xp:3,made:900,sold:900,mixed:200,harvested:800};
 const before=JSON.stringify(s);A.equal(C.commissionAction(s,'maker','claim').ok,false);A.equal(JSON.stringify(s),before);
 for(const job of C.COMMISSIONS){
  const accepted=C.commissionAction(s,job.id,'accept');A.equal(accepted.ok,true);s.notebookCommissions={...s.notebookCommissions,[job.id]:accepted.entry};
  A.equal(C.commissionView(s,job.id).ready,false);A.equal(C.commissionAction(s,job.id,'accept').ok,false);
  for(const [counter,need]of Object.entries(job.needs))s[counter]+=need;
  s=JSON.parse(JSON.stringify(s));A.equal(C.commissionView(s,job.id).ready,true);
  const reward=C.commissionAction(s,job.id,'claim');A.equal(reward.ok,true);s.notebookCommissions[job.id]=reward.entry;s.cash+=reward.cash;s.xp+=reward.xp;
  A.equal(C.commissionAction(s,job.id,'claim').ok,false);A.equal(C.commissionView(s,job.id).status,'claimed');
 }
 A.equal(s.cash,110);A.equal(s.xp,43);
 const dom=new JSDOM(C.commissionHTML(s));A.equal(dom.window.document.querySelectorAll('button:disabled').length,3);dom.window.close();
 const guest=new JSDOM(C.commissionHTML({__commissionGuest:true}));A.equal(guest.window.document.querySelectorAll('button:disabled').length,3);guest.window.close();
});
test('new charter and Island Sprint are reachable from their game UIs',()=>{
 const root=path.join(__dirname,'..');
 for(const [id,files]of [['bell-diver',['engine.js','game.js']],['outbreak-atlas',['model.js','game.js']]]){
  const dom=new JSDOM(fs.readFileSync(path.join(root,'games',id,'index.html'),'utf8'),{url:'https://example.test/games/'+id+'/',runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window;
  w.requestAnimationFrame=()=>1;w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:()=>()=>{}});
  for(const file of files)w.eval(fs.readFileSync(path.join(root,'games',id,file),'utf8'));
  if(id==='bell-diver'){w.document.getElementById('charter-sealed').click();A.equal(JSON.parse(w.localStorage.getItem(E.KEY)).charter,2);A.match(w.document.getElementById('charterInfo').textContent,/without using air pockets/);}
  else{[...w.document.querySelectorAll('#scenarios button')].find(b=>b.textContent==='Island Sprint').click();w.document.getElementById('begin').click();A.equal(JSON.parse(w.localStorage.getItem('outbreak-atlas-v1')).scenario,'islands');A.match(w.document.getElementById('objective').textContent,/0\/3 islands/);}
  w.close();
 }
});
