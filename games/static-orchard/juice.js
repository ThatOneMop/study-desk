/* Static Orchard juice: zaps, chain hits, pests shooed, harvests, waves, trunk damage and orchard results (toward the Plants vs. Zombies garden-defence feel, kept gentle). */
(function(){'use strict';const G=()=>window.STGame;
JuiceKit({id:'static-orchard',prefix:'st',global:'STJuice',headerBefore:'header #help',play:'#scene',root:392,accent:'#ffd36b',card:'#18221a',ink:'#f2f0dc',good:'#c8f0a8',colors:['#ffd36b','#bfe6ff','#f2f0dc','#c8f0a8'],
 snap:()=>{const g=G();if(!g||!g.o)return null;const s=g.o,r=s.run;return{o:s.orchard,phase:r.phase,shots:r.shots,kills:r.kills,chain:r.bestChain,health:r.health,escaped:r.escaped,harvest:r.harvest,wave:r.wave}},
 rules:[
  {test:(a,b)=>b.o===a.o&&a.phase==='ready'&&b.phase==='active',sfx:'step',run:K=>K.callout('ORCHARD ON WATCH','#scene')},
  {test:(a,b)=>b.o===a.o&&b.shots>a.shots,sfx:'whoosh',run:K=>K.burst('#scene',6,['#ffd36b','#bfe6ff'])},
  {test:(a,b)=>b.o===a.o&&b.kills>a.kills,sfx:'coin',run:K=>K.callout('SHOOED','#scene','good')},
  {test:(a,b)=>b.o===a.o&&b.chain>a.chain&&b.chain>1,sfx:'great',run:(K,a,b)=>{K.callout('CHAIN ×'+b.chain,'#scene','good big');K.burst('#scene',18)}},
  {test:(a,b)=>b.o===a.o&&b.harvest>a.harvest,sfx:'good',run:K=>K.callout('HARVEST','#scene','good')},
  {test:(a,b)=>b.o===a.o&&b.wave>a.wave&&b.phase==='active',sfx:'step',run:(K,a,b)=>K.callout('SWARM '+b.wave+' / 3','#scene')},
  {test:(a,b)=>b.o===a.o&&b.health<a.health,sfx:'bad',run:K=>{K.shake();K.flash('#ff6a4a');K.callout('TREE NIBBLED','#scene','bad')}},
  {test:(a,b)=>b.o===a.o&&b.escaped>a.escaped&&b.health===a.health,sfx:'bad',run:K=>K.callout('ONE SLIPPED PAST','#scene','bad')},
  {test:(a,b)=>b.o===a.o&&a.phase!=='won'&&b.phase==='won',sfx:'win',run:K=>setTimeout(()=>{K.callout('ORCHARD SAFE','#scene','good big');K.burst('#scene',32)},200)},
  {test:(a,b)=>b.o===a.o&&a.phase!=='lost'&&b.phase==='lost',sfx:'lose',run:K=>{K.shake();K.callout('ORCHARD OVERRUN','#scene','bad big')}}]});
})();
