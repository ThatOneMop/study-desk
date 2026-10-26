/* Scrap Orbit juice: undocking, couplings, cable releases, hull knocks, cargo deliveries and job results (toward the Hardspace: Shipbreaker / Outer Wilds tug feel). */
(function(){'use strict';const G=()=>window.SOGame;
JuiceKit({id:'scrap-orbit',prefix:'so',global:'SOJuice',play:'#space',root:330,accent:'#7fd1c7',card:'#101a26',ink:'#e8f1f4',good:'#9fe0b2',colors:['#7fd1c7','#e8f1f4','#ffcf6b','#8fa8ff'],
 snap:()=>{const g=G();if(!g)return null;const r=g.o.run;return{c:r.chapter,status:r.status,hits:r.hits,tether:r.tether,delivered:r.cargo.filter(b=>b.delivered).length,stars:r.stars}},
 rules:[
  {test:(a,b)=>b.c===a.c&&a.status==='ready'&&b.status==='active',sfx:'whoosh',run:K=>K.callout('UNDOCKED','#space','good')},
  {test:(a,b)=>b.c===a.c&&a.tether===null&&b.tether!==null,sfx:'good',run:K=>{K.callout('COUPLED','#space','good');K.burst('#space',10,['#7fd1c7','#e8f1f4'])}},
  {test:(a,b)=>b.c===a.c&&a.tether!==null&&b.tether===null&&b.delivered===a.delivered&&b.status==='active',sfx:'step',run:K=>K.callout('CABLE RELEASED','#space')},
  {test:(a,b)=>b.c===a.c&&b.hits>a.hits,sfx:'thud',run:K=>{K.shake();K.flash('#ff8a5a');K.callout('HULL KNOCK','#space','bad')}},
  {test:(a,b)=>b.c===a.c&&b.delivered>a.delivered,sfx:'coin',run:(K,a,b)=>{K.callout('CARGO DOCKED '+b.delivered+'/3','#space','good');K.burst('#space',18)}},
  {test:(a,b)=>b.c===a.c&&a.status==='active'&&b.status==='complete',sfx:'win',run:(K,a,b)=>setTimeout(()=>{K.callout('JOB DONE '+'★'.repeat(b.stars||0),'#space','good big');K.burst('#space',32)},200)},
  {test:(a,b)=>b.c===a.c&&a.status==='active'&&b.status==='lost',sfx:'lose',run:K=>{K.shake();K.callout('TUG DISABLED','#space','bad big')}}],
 paused:()=>{const p=document.getElementById('overlay');return !!(p&&!p.hidden)}});
})();
