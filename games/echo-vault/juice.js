/* Echo Vault juice: footsteps, guard alerts, relic grabs, chimes and escapes (toward the Hitman GO / Invisible Inc. stealth-puzzle loop). */
(function(){'use strict';const G=()=>window.EVGame;
JuiceKit({id:'echo-vault',prefix:'ev',global:'EVJuice',headerBefore:'header span',play:'#map',root:311,accent:'#8fb8e0',card:'#0f1626',ink:'#e6eefb',good:'#9fd8b0',colors:['#8fb8e0','#e6eefb','#f0d27a','#3a4a6a'],
 snap:()=>{const g=G();if(!g)return null;const r=g.o.run;return{i:r.index,pos:r.pos,relic:r.relic,pages:r.pages.filter(Boolean).length,alerts:r.alerts,exposure:r.exposure,lures:r.lures,decoys:r.decoys.length,hidden:r.hidden,status:r.status}},
 rules:[
  {test:(a,b)=>b.i===a.i&&b.pos!==a.pos,sfx:'step',run:(K,a,b)=>K.burst('#tile'+b.pos,5,['#8fb8e0','#3a4a6a'])},
  {test:(a,b)=>b.i===a.i&&!a.hidden&&b.hidden,sfx:'whoosh',run:(K,a,b)=>K.callout('IN SHADOW','#tile'+b.pos,'good')},
  {test:(a,b)=>b.i===a.i&&!a.relic&&b.relic,sfx:'great',run:(K,a,b)=>{K.callout('RELIC TAKEN · GET OUT','#tile'+b.pos,'good big');K.burst('#tile'+b.pos,24)}},
  {test:(a,b)=>b.i===a.i&&b.pages>a.pages,sfx:'coin',run:(K,a,b)=>K.callout('PAGE '+b.pages+'/2','#tile'+b.pos,'good')},
  {test:(a,b)=>b.i===a.i&&b.decoys>a.decoys,sfx:'click',run:K=>K.callout('CHIME TOSSED','#map')},
  {test:(a,b)=>b.i===a.i&&b.lures>a.lures,sfx:'good',run:K=>K.callout('GUARD LURED','#guards','good')},
  {test:(a,b)=>b.i===a.i&&b.alerts>a.alerts&&b.status==='inside',sfx:'bad',run:(K,a,b)=>{K.shake();K.flash('#ff5a3c');K.callout('HEARD YOU!','#tile'+b.pos,'bad')}},
  {test:(a,b)=>b.i===a.i&&b.exposure>a.exposure&&b.alerts===a.alerts&&b.status==='inside',sfx:'thud',run:K=>K.callout('EXPOSED','#exposure','bad')},
  {test:(a,b)=>b.i===a.i&&a.status==='inside'&&b.status==='escaped',sfx:'win',run:K=>setTimeout(()=>{K.callout('CLEAN ESCAPE','#map','good big');K.burst('#map',32)},250)},
  {test:(a,b)=>b.i===a.i&&a.status==='inside'&&b.status==='caught',sfx:'lose',run:K=>{K.shake();K.flash('#ff3a2a');K.callout('CAUGHT','#map','bad big')}}]});
})();
