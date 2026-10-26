/* Borrowed Gravity juice: entering rooms, borrowing and returning objects, landings, shards collected and room results (toward the Portal / Superliminal puzzle-room feel). */
(function(){'use strict';const G=()=>window.BGGame;
JuiceKit({id:'borrowed-gravity',prefix:'bg',global:'BGJuice',headerBefore:'header #help',play:'#scene',root:349,accent:'#b9a6ff',card:'#17162a',ink:'#efeaff',good:'#a8f0d8',colors:['#b9a6ff','#efeaff','#7fe0d0','#ffd36b'],
 snap:()=>{const g=G();if(!g||!g.o)return null;const s=g.o,r=s.run;return{room:s.room,phase:r.phase,held:r.held,ground:r.grounded,vy:r.vy,transfers:r.transfers,got:r.collected.filter(Boolean).length}},
 rules:[
  {test:(a,b)=>b.room===a.room&&a.phase==='ready'&&b.phase==='play',sfx:'step',run:K=>K.callout('GALLERY OPEN','#scene')},
  {test:(a,b)=>b.room===a.room&&b.phase==='play'&&b.transfers>a.transfers,sfx:'whoosh',run:(K,a,b)=>{K.callout(b.held>=0?'BORROWED':'RETURNED','#scene','good');K.burst('#scene',12,['#b9a6ff','#7fe0d0'])}},
  {test:(a,b)=>b.room===a.room&&b.phase==='play'&&!a.ground&&b.ground&&a.vy>8,sfx:'thud',run:K=>K.shake()},
  {test:(a,b)=>b.room===a.room&&b.got>a.got,sfx:'coin',run:(K,a,b)=>{K.callout('SHARD '+b.got+'/3','#scene','good');K.burst('#scene',16)}},
  {test:(a,b)=>b.room===a.room&&a.phase!=='won'&&b.phase==='won',sfx:'win',run:K=>setTimeout(()=>{K.callout('ROOM SOLVED','#scene','good big');K.burst('#scene',32)},200)},
  {test:(a,b)=>b.room===a.room&&a.phase!=='lost'&&b.phase==='lost',sfx:'lose',run:K=>{K.shake();K.flash('#b9a6ff');K.callout('BARRIER RETURNED','#scene','bad big')}}]});
})();
