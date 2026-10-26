/* Queen of Cinders juice: digging, hauls, hatchings, fire alarms and chapter fanfares (toward the Empires of the Undergrowth colony loop). */
(function(){'use strict';const G=()=>window.QCGame;
JuiceKit({id:'queen-of-cinders',prefix:'qc',global:'QCJuice',headerBefore:'header span',play:'#board',root:294,accent:'#e9a44f',card:'#2a1710',ink:'#fbe9cf',good:'#b9d37a',colors:['#e9a44f','#fbe9cf','#c0582b','#7d5a3a'],
 snap:()=>{const g=G();if(!g)return null;const c=g.o.colony;return{i:c.index,turn:c.turn,open:c.open.length,wet:c.wet.length,burn:c.burn.length,food:c.food,water:c.water,resin:c.resin,workers:c.workers,health:c.health,stars:c.stars,status:c.status,last:c.open[c.open.length-1]}},
 rules:[
  {test:(a,b)=>b.i===a.i&&b.open>a.open,sfx:'step',run:(K,a,b)=>{K.burst('#cell'+b.last,10,['#7d5a3a','#c49a6c','#4a3424']);K.callout('DUG','#cell'+b.last)}},
  {test:(a,b)=>b.i===a.i&&b.wet>a.wet,sfx:'whoosh',run:K=>K.callout('DAMPENED','#board','good')},
  {test:(a,b)=>b.i===a.i&&b.turn>a.turn,sfx:'thud',run:(K,a,b)=>{const got=['food','water','resin'].map(k=>b[k]>a[k]?'+'+(b[k]-a[k])+' '+k.toUpperCase():'').filter(Boolean);if(got.length)setTimeout(()=>{K.sfx.coin();K.callout(got.join(' · '),'#resources','good')},120)}},
  {test:(a,b)=>b.i===a.i&&b.workers>a.workers,sfx:'great',run:(K,a,b)=>{K.callout('HATCHED +'+(b.workers-a.workers)+' WORKERS','#colony','good');K.burst('#colony',16)}},
  {test:(a,b)=>b.i===a.i&&b.burn>a.burn,sfx:'bad',run:K=>{K.shake();K.flash('#ff6a2a');K.callout('FIRE SPREADS','#board','bad')}},
  {test:(a,b)=>b.i===a.i&&b.health<a.health&&b.status!=='lost',sfx:'bad',run:K=>{K.flash('#ff4a2a');K.callout('QUEEN SCORCHED','#colony','bad')}},
  {test:(a,b)=>b.i===a.i&&a.status==='active'&&b.status==='complete',sfx:'win',run:(K,a,b)=>setTimeout(()=>{K.callout('THE COLONY THRIVES · '+'★'.repeat(b.stars||0),'#board','good big');K.burst('#board',32)},300)},
  {test:(a,b)=>b.i===a.i&&a.status==='active'&&b.status==='lost',sfx:'lose',run:K=>{K.shake();K.callout('THE NEST IS LOST','#board','bad big')}}]});
})();
