/* Pocket Expedition juice: departures, trail steps, finds, injuries, low rations and homecomings (toward The Long Dark route-planning loop). */
(function(){'use strict';const G=()=>window.PXGame;
JuiceKit({id:'pocket-expedition',prefix:'px',global:'PXJuice',headerBefore:'header .eyebrow',play:'#map',root:330,accent:'#d9a45b',card:'#1f2618',ink:'#f3ecd8',good:'#b9d37a',colors:['#d9a45b','#8aa86b','#f3ecd8','#6b4a2a'],
 snap:()=>{const g=G();if(!g)return null;const r=g.o.run;return{i:r.index,pos:r.pos,food:r.food,hp:r.health,bag:r.bag.length,value:r.value,visited:r.visited.length,status:r.status,stars:r.stars,dress:r.dressingUsed}},
 rules:[
  {test:(a,b)=>b.i===a.i&&a.status==='planning'&&b.status==='field',sfx:'whoosh',run:K=>K.callout('LEAVING CAMP','#map','big')},
  {test:(a,b)=>b.i===a.i&&b.pos!==a.pos&&b.status==='field',sfx:'step',run:(K,a,b)=>{K.burst('#map',6,['#8aa86b','#6b4a2a']);if(b.visited>a.visited)K.callout('NEW SITE','#siteTitle','good')}},
  {test:(a,b)=>b.i===a.i&&b.bag>a.bag,sfx:'coin',run:(K,a,b)=>{K.callout('FOUND!'+(b.value>a.value?' +'+(b.value-a.value)+' VALUE':''),'#bag','good');K.burst('#bag',14)}},
  {test:(a,b)=>b.i===a.i&&b.hp<a.hp&&b.status!=='lost',sfx:'bad',run:K=>{K.shake();K.flash('#ff6a4a');K.callout('HURT ON THE TRAIL','#map','bad')}},
  {test:(a,b)=>b.i===a.i&&!a.dress&&b.dress,sfx:'good',run:K=>K.callout('WOUND DRESSED','#dress','good')},
  {test:(a,b)=>b.i===a.i&&b.food<a.food&&b.food<=2&&b.status==='field',sfx:'thud',run:(K,a,b)=>K.callout('RATIONS LOW · '+b.food,'#stats','bad')},
  {test:(a,b)=>b.i===a.i&&a.status==='field'&&(b.status==='returned'||b.status==='complete'),sfx:'win',run:(K,a,b)=>setTimeout(()=>{K.callout('HOME SAFE'+(b.stars?' · '+'★'.repeat(b.stars):''),'#map','good big');K.burst('#map',30)},250)},
  {test:(a,b)=>b.i===a.i&&a.status==='field'&&b.status==='lost',sfx:'lose',run:K=>{K.shake();K.callout('THE TRAIL WINS','#map','bad big')}}]});
})();
