/* Last Match juice: lantern flashes, dodges, stunned and fading shadows, ember pickups, oil refills, knocks and clearing results (toward the Alan Wake / Don't Starve lantern feel, kept family-friendly). */
(function(){'use strict';const G=()=>window.LMGame;let fades=0;
JuiceKit({id:'last-match',prefix:'lm',global:'LMJuice',headerBefore:'header > div',play:'#field',root:294,accent:'#f2b65a',card:'#1a1622',ink:'#f6ecd9',good:'#ffd98a',goodInk:'#fff3d6',colors:['#ffd98a','#f2b65a','#fff3d6','#e98f6d'],
 snap:()=>{const g=G();if(!g)return null;const r=g.o.run;return{i:r.index,status:r.status,hits:r.hits,shots:r.shots,refills:r.refills,dash:r.dash>0,stun:r.enemies.filter(e=>e.phase==='stun').length,down:r.enemies.filter(e=>e.hp<=0).length,embers:r.enemies.filter(e=>e.coal).length,stars:r.stars}},
 rules:[
  {test:(a,b)=>b.i===a.i&&a.status==='ready'&&b.status==='active',sfx:'step',run:K=>K.callout('INTO THE ORCHARD','#field')},
  {test:(a,b)=>b.i===a.i&&b.shots>a.shots,sfx:'whoosh',run:K=>{K.flash('#fff3c4');K.burst('#field',8,['#fff3d6','#ffd98a'])}},
  {test:(a,b)=>b.i===a.i&&b.status==='active'&&!a.dash&&b.dash,sfx:'step',run:()=>{}},
  {test:(a,b)=>b.i===a.i&&b.stun>a.stun&&b.down===a.down,sfx:'good',run:K=>K.callout('STUNNED','#field','good')},
  {test:(a,b)=>b.i===a.i&&b.down>a.down,sfx:'great',run:K=>{fades++;K.callout(fades>=2?'THE ORCHARD WARMS ×'+fades:'SHADOW FADES','#field','good');K.burst('#field',16,['#ffe7a8','#f2b65a','#fff6d4']);K.flash('#ffe7a8')}},
  {test:(a,b)=>b.i===a.i&&b.embers>a.embers,sfx:'coin',run:K=>K.callout('EMBER','#field','good')},
  {test:(a,b)=>b.i===a.i&&b.refills>a.refills,sfx:'good',run:K=>K.callout('OIL TOPPED UP','#field','good')},
  {test:(a,b)=>b.i===a.i&&b.hits>a.hits,sfx:'thud',run:K=>{fades=0;K.shake();K.flash('#6a3cff');K.callout('KNOCKED BACK','#field','bad')}},
  {test:(a,b)=>b.i===a.i&&a.status==='active'&&b.status==='complete',sfx:'win',run:(K,a,b)=>setTimeout(()=>{K.callout('DAWN REACHED '+'★'.repeat(b.stars||0),'#field','good big');K.burst('#field',32)},200)},
  {test:(a,b)=>b.i===a.i&&a.status==='active'&&b.status==='lost',sfx:'lose',run:K=>{K.shake();K.callout('THE LANTERN FALLS','#field','bad big')}}],
 paused:()=>{const p=document.getElementById('overlay');return !!(p&&!p.hidden)}});
})();
