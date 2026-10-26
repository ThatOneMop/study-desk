/* Inkline juice: steps, page recoveries, ink blots, drafts and archive escapes (toward the Slay the Spire / Loop Hero card-run loop). */
(function(){'use strict';const G=()=>window.ILGame;
JuiceKit({id:'inkline',prefix:'il',global:'ILJuice',headerBefore:'header span',play:'#board',root:349,accent:'#d6b35c',card:'#141327',ink:'#efe8d4',good:'#9fc9a1',colors:['#d6b35c','#efe8d4','#5b6bd6','#1f1d3a'],
 snap:()=>{const g=G();if(!g)return null;const r=g.o.run;return{i:r.index,pos:r.pos,ink:r.ink,hp:r.health,pages:r.pages.length,deck:r.deck.length,phase:r.phase,stars:r.stars,status:r.status}},
 rules:[
  {test:(a,b)=>b.i===a.i&&b.pos!==a.pos,sfx:'step',run:(K,a,b)=>K.burst('#cell'+b.pos,8,['#d6b35c','#1f1d3a','#efe8d4'])},
  {test:(a,b)=>b.i===a.i&&b.pages>a.pages,sfx:'great',run:(K,a,b)=>{K.callout('PAGE RECOVERED '+b.pages+'/3','#cell'+b.pos,'good big');K.burst('#cell'+b.pos,22)}},
  {test:(a,b)=>b.i===a.i&&b.hp<a.hp&&b.status!=='lost',sfx:'bad',run:(K,a,b)=>{K.shake();K.flash('#5a2a8a');K.callout('INK BLOT −'+(a.hp-b.hp),'#cell'+b.pos,'bad')}},
  {test:(a,b)=>b.i===a.i&&b.ink>a.ink,sfx:'coin',run:(K,a,b)=>K.callout('+'+(b.ink-a.ink)+' INK','#stats','good')},
  {test:(a,b)=>a.phase!=='draft'&&b.phase==='draft',sfx:'good',run:K=>K.callout('DRAFT A NEW CARD','#draftPanel','good')},
  {test:(a,b)=>b.i===a.i&&b.deck>a.deck,sfx:'coin',run:K=>K.callout('CARD BOUND INTO THE DECK','#hand','good')},
  {test:(a,b)=>b.i===a.i&&a.status==='active'&&b.status==='complete',sfx:'win',run:(K,a,b)=>setTimeout(()=>{K.callout('ARCHIVE ESCAPED · '+'★'.repeat(b.stars||0),'#board','good big');K.burst('#board',32)},250)},
  {test:(a,b)=>b.i===a.i&&a.status==='active'&&b.status==='lost',sfx:'lose',run:K=>{K.shake();K.callout('THE INK RUNS DRY','#board','bad big')}}]});
})();
