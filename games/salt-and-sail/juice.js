/* Salt & Sail juice: stowing cargo, casting off, hull knocks, shifting cargo and voyage results (toward the Dredge / Sea of Thieves small-boat trading feel). */
(function(){'use strict';const G=()=>window.SAGame;
JuiceKit({id:'salt-and-sail',prefix:'sa',global:'SAJuice',headerBefore:'header #help',play:'#scene',root:330,accent:'#e9c27a',card:'#12212b',ink:'#f2ece0',good:'#a8e0c8',colors:['#e9c27a','#f2ece0','#7fc4e8','#a8e0c8'],
 snap:()=>{const g=G();if(!g||!g.o)return null;const s=g.o,r=s.run;return{route:s.route,phase:s.phase,stowed:s.layout.length,hull:r.hull,cargo:r.integrity.reduce((a,b)=>a+b,0)}},
 rules:[
  {test:(a,b)=>b.route===a.route&&b.phase==='packing'&&b.stowed>a.stowed,sfx:'thud',run:K=>K.callout('STOWED','#scene','good')},
  {test:(a,b)=>b.route===a.route&&a.phase==='packing'&&b.phase==='sailing',sfx:'whoosh',run:K=>{K.callout('CAST OFF','#scene','good');K.burst('#scene',14,['#7fc4e8','#f2ece0'])}},
  {test:(a,b)=>b.route===a.route&&b.phase==='sailing'&&b.hull<a.hull,sfx:'bad',run:(K,a,b)=>{K.shake();K.flash('#ff6a4a');K.callout('HULL KNOCK · '+b.hull+' LEFT','#scene','bad')}},
  {test:(a,b)=>b.route===a.route&&b.phase==='sailing'&&b.cargo<a.cargo&&b.hull===a.hull,sfx:'thud',run:K=>{K.shake();K.callout('CARGO SHIFTED','#scene','bad')}},
  {test:(a,b)=>b.route===a.route&&a.phase!=='won'&&b.phase==='won',sfx:'win',run:K=>setTimeout(()=>{K.callout('LINES ASHORE','#scene','good big');K.burst('#scene',32)},200)},
  {test:(a,b)=>b.route===a.route&&a.phase!=='lost'&&b.phase==='lost',sfx:'lose',run:K=>{K.shake();K.callout('VOYAGE LOST','#scene','bad big')}}]});
})();
