/* Threadbound juice: hooks, releases, landings, silver seeds, checkpoint knots, falls and kindled lanterns (toward the Ori / Worms ninja-rope swing feel). */
(function(){'use strict';const G=()=>window.TBGame;
JuiceKit({id:'threadbound',prefix:'tb',global:'TBJuice',headerBefore:'header span',play:'#canopy',root:415,accent:'#e9c46a',card:'#18201f',ink:'#f2eee2',good:'#cfe8d0',colors:['#e9c46a','#f2eee2','#c9d6df','#9fe0c8'],
 snap:()=>{const g=G();if(!g)return null;const r=g.o.run;return{i:r.index,status:r.status,rope:r.rope>=0,ground:r.ground,vy:r.vy,falls:r.falls,cp:r.checkpoint,seeds:r.blooms.filter(Boolean).length,total:r.blooms.length,stars:r.stars}},
 rules:[
  {test:(a,b)=>b.i===a.i&&b.status==='active'&&!a.rope&&b.rope,sfx:'good',run:K=>K.burst('#canopy',6,['#e9c46a','#f2eee2'])},
  {test:(a,b)=>b.i===a.i&&b.status==='active'&&a.rope&&!b.rope,sfx:'whoosh',run:()=>{}},
  {test:(a,b)=>b.i===a.i&&b.status==='active'&&!a.ground&&b.ground&&a.vy>8,sfx:'thud',run:K=>K.shake()},
  {test:(a,b)=>b.i===a.i&&b.seeds>a.seeds,sfx:'coin',run:(K,a,b)=>{K.callout('SILVER SEED '+b.seeds+'/'+b.total,'#canopy','good');K.burst('#canopy',14)}},
  {test:(a,b)=>b.i===a.i&&!a.cp&&b.cp,sfx:'good',run:K=>K.callout('KNOT TIED','#canopy','good')},
  {test:(a,b)=>b.i===a.i&&b.falls>a.falls,sfx:'bad',run:K=>{K.shake();K.flash('#ff6a4a');K.callout('FELL · BACK TO THE KNOT','#canopy','bad')}},
  {test:(a,b)=>b.i===a.i&&a.status!=='complete'&&b.status==='complete',sfx:'win',run:(K,a,b)=>setTimeout(()=>{K.callout('LANTERN KINDLED '+'★'.repeat(b.stars||0),'#canopy','good big');K.burst('#canopy',32)},200)}],
 paused:()=>{const p=document.getElementById('overlay');return !!(p&&!p.hidden)}});
})();
