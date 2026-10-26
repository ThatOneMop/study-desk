/* Roof Runner juice: jumps, dashes, hard landings, parcel pickups, checkpoints, falls and deliveries (toward the Celeste / Mirror's Edge 2D courier feel). */
(function(){'use strict';const G=()=>window.RRGame;
JuiceKit({id:'roof-runner',prefix:'rr',global:'RRJuice',headerBefore:'header span',play:'#city',root:392,accent:'#f2a65a',card:'#1b1f33',ink:'#f4efe6',good:'#9fe0b2',colors:['#f2a65a','#f4efe6','#7fb3e8','#ffd36b'],
 snap:()=>{const g=G();if(!g)return null;const r=g.o.run;return{i:r.index,status:r.status,ground:r.ground,vy:r.vy,dash:r.dash>0,falls:r.falls,parcels:r.parcels.filter(Boolean).length,cp:r.checkpoint,stars:r.stars}},
 rules:[
  {test:(a,b)=>b.i===a.i&&b.status==='active'&&a.ground&&!b.ground&&b.vy<0,sfx:'step',run:()=>{}},
  {test:(a,b)=>b.i===a.i&&b.status==='active'&&!a.dash&&b.dash,sfx:'whoosh',run:K=>K.burst('#city',6,['#7fb3e8','#f4efe6'])},
  {test:(a,b)=>b.i===a.i&&b.status==='active'&&!a.ground&&b.ground&&a.vy>9,sfx:'thud',run:K=>K.shake()},
  {test:(a,b)=>b.i===a.i&&b.parcels>a.parcels,sfx:'coin',run:(K,a,b)=>{K.callout('PARCEL '+b.parcels+'/3','#city','good');K.burst('#city',16)}},
  {test:(a,b)=>b.i===a.i&&!a.cp&&b.cp,sfx:'good',run:K=>K.callout('CHECKPOINT','#city','good')},
  {test:(a,b)=>b.i===a.i&&b.falls>a.falls,sfx:'bad',run:K=>{K.shake();K.flash('#ff6a4a');K.callout('FELL · BACK TO THE FLAG','#city','bad')}},
  {test:(a,b)=>b.i===a.i&&a.status==='active'&&b.status==='complete',sfx:'win',run:(K,a,b)=>setTimeout(()=>{K.callout('DELIVERED '+'★'.repeat(b.stars||0),'#city','good big');K.burst('#city',32)},200)},
  {test:(a,b)=>b.i===a.i&&a.status==='active'&&b.status==='lost',sfx:'lose',run:K=>{K.shake();K.callout('ROUTE LOST','#city','bad big')}}],
 paused:()=>{const p=document.getElementById('overlay');return !!(p&&!p.hidden)}});
})();
