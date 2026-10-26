/* Little Foundry juice: ingot clanks, heat roar, molten pours, cold shuts and commission fanfares (toward the Forge Industry smithing loop). */
(function(){'use strict';const G=()=>window.LFGame;
JuiceKit({id:'little-foundry',prefix:'lf',global:'LFJuice',headerBefore:'header small',play:'main',root:262,accent:'#f0a04b',card:'#2a1a12',ink:'#fde9d0',good:'#f3c66b',colors:['#ffb347','#ff6a2a','#ffe08a','#8a4a2a'],
 snap:()=>{const g=G();if(!g)return null;const r=g.o.run;return{i:r.index,charge:r.charge[0]+r.charge[1],glow:r.glow,status:r.status,fill:r.fill.reduce((x,y)=>x+y,0),faults:r.faults.filter(Boolean).length,stars:r.stars}},
 rules:[
  {test:(a,b)=>b.i===a.i&&b.charge>a.charge,sfx:'thud',run:K=>{K.callout('CLANK','#recipe');K.burst('#recipe',6,['#9aa3ad','#d2d8de','#6b737c'])}},
  {test:(a,b)=>b.i===a.i&&b.glow>a.glow,sfx:'whoosh',run:(K,a,b)=>{K.burst('#glow',10);if(a.glow<6&&b.glow>=6){K.sfx.good();K.callout('MELT READY','#glow','good')}}},
  {test:(a,b)=>b.i===a.i&&a.status!=='casting'&&b.status==='casting',sfx:'great',run:K=>{K.flash('#ff9a3a');K.callout('MOLTEN','#metal','good big');K.burst('#metal',24)}},
  {test:(a,b)=>b.i===a.i&&b.fill>a.fill,sfx:'step',run:K=>K.burst('#mould',12)},
  {test:(a,b)=>b.i===a.i&&b.faults>a.faults,sfx:'bad',run:K=>{K.shake();K.callout('COLD SHUT','#mould','bad')}},
  {test:(a,b)=>b.i===a.i&&a.status!=='complete'&&b.status==='complete',sfx:'win',run:(K,a,b)=>setTimeout(()=>{K.callout('COMMISSION CAST · '+'★'.repeat(b.stars||0),'#mould','good big');K.burst('#mould',32)},250)},
  {test:(a,b)=>b.i===a.i&&a.status!=='lost'&&b.status==='lost',sfx:'lose',run:K=>{K.shake();K.callout('CRACKED IN THE MOULD','#mould','bad big')}}]});
})();
