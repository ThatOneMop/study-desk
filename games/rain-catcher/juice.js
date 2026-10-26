/* Rain Catcher juice: earthworks, cistern valves, rain, gardens drinking, doorstep damage and season results (toward the Timberborn / From Dust water-shaping feel). */
(function(){'use strict';const G=()=>window.RCGame;
JuiceKit({id:'rain-catcher',prefix:'rc',global:'RCJuice',headerBefore:'header span',play:'#map',root:330,accent:'#7fc4e8',card:'#14212a',ink:'#eaf2f2',good:'#a8e0b0',colors:['#7fc4e8','#bfe6ff','#a8e0b0','#d8c08a'],
 snap:()=>{const g=G();if(!g)return null;const r=g.o.run;return{i:r.index,status:r.status,dig:r.earthwork,open:r.open.filter(Boolean).length,rain:r.received,grown:r.grown.reduce((a,b)=>a+b,0),dmg:r.damage.reduce((a,b)=>a+b,0)}},
 rules:[
  {test:(a,b)=>b.i===a.i&&b.dig!==a.dig,sfx:'thud',run:K=>K.burst('#map',8,['#d8c08a','#a08458'])},
  {test:(a,b)=>b.i===a.i&&b.open>a.open,sfx:'click',run:K=>K.callout('CISTERN OPEN','#map')},
  {test:(a,b)=>b.i===a.i&&b.open<a.open,sfx:'click',run:K=>K.callout('CISTERN SHUT','#map')},
  {test:(a,b)=>b.i===a.i&&b.rain>a.rain,sfx:'whoosh',run:K=>{K.callout('RAIN CAUGHT','#map','good');K.burst('#map',14,['#7fc4e8','#bfe6ff'])}},
  {test:(a,b)=>b.i===a.i&&b.grown>a.grown,sfx:'good',run:K=>{K.callout('GARDENS DRINK','#gardens','good');K.burst('#gardens',10,['#a8e0b0','#7fc4e8'])}},
  {test:(a,b)=>b.i===a.i&&b.dmg>a.dmg,sfx:'bad',run:K=>{K.shake();K.flash('#4a8aff');K.callout('DOORSTEP WET','#map','bad')}},
  {test:(a,b)=>b.i===a.i&&a.status!=='restored'&&b.status==='restored',sfx:'win',run:K=>setTimeout(()=>{K.callout('GARDENS RESTORED','#map','good big');K.burst('#map',32)},200)},
  {test:(a,b)=>b.i===a.i&&a.status!=='flooded'&&b.status==='flooded',sfx:'lose',run:K=>{K.shake();K.callout('FLOODED','#map','bad big')}},
  {test:(a,b)=>b.i===a.i&&a.status!=='dry'&&b.status==='dry',sfx:'lose',run:K=>K.callout('SEASON CLOSED','#map','bad big')}]});
})();
