/* Glasshouse juice: sowing, watering, crosses, deliveries and exhibitions (toward the Botany Manor / Garden Life growing loop). */
(function(){'use strict';const G=()=>window.GHGame;
JuiceKit({id:'glasshouse',prefix:'gh',global:'GHJuice',headerBefore:'header span',play:'#garden',root:440,accent:'#7fb87a',card:'#12261a',ink:'#eef6e6',good:'#b4e08a',colors:['#7fb87a','#f2c2d4','#f7e08a','#b4e08a'],
 snap:()=>{const g=G();if(!g)return null;const r=g.o.run;return{i:r.index,day:r.day,water:r.water,sowed:r.sowed,crosses:r.crosses,comp:r.composted,wilted:r.wilted,del:r.delivered.filter(Boolean).length,status:r.status,stars:r.stars,pl:r.plants.map(p=>!!p),ages:r.plants.map(p=>p?p.age:0)}},
 rules:[
  {test:(a,b)=>b.i===a.i&&b.sowed>a.sowed,sfx:'step',run:(K,a,b)=>{const n=b.pl.findIndex((p,i)=>p&&!a.pl[i]),w=n>=0?'#pot'+n:'#garden';K.burst(w,10,['#8a5a36','#7fb87a','#c49a6c']);K.callout('SOWN',w)}},
  {test:(a,b)=>b.i===a.i&&b.water<a.water&&b.day===a.day,sfx:'whoosh',run:K=>K.burst('#garden',8,['#8fc1e9','#cfe7f7'])},
  {test:(a,b)=>b.i===a.i&&b.day>a.day,sfx:'good',run:(K,a,b)=>K.callout('DAY '+b.day,'#advance')},
  {test:(a,b)=>b.i===a.i&&b.ages.some((v,i)=>v>(a.ages[i]||0)),sfx:'good',run:(K,a,b)=>{const n=b.ages.findIndex((v,i)=>v>(a.ages[i]||0)),w=n>=0?'#pot'+n:'#garden';K.callout(b.ages[n]>=3?'IN BLOOM':'IT GREW',w,'good');K.burst(w,16,['#b4e08a','#f7e08a','#f2c2d4'])}},
  {test:(a,b)=>b.i===a.i&&b.crosses>a.crosses,sfx:'great',run:K=>{K.callout('NEW CROSS!','#garden','good big');K.burst('#garden',22)}},
  {test:(a,b)=>b.i===a.i&&b.del>a.del,sfx:'coin',run:K=>{K.callout('ORDER DELIVERED','#orders','good');K.burst('#orders',16)}},
  {test:(a,b)=>b.i===a.i&&b.comp>a.comp,sfx:'thud',run:K=>K.callout('COMPOSTED','#garden')},
  {test:(a,b)=>b.i===a.i&&b.wilted>a.wilted,sfx:'bad',run:K=>{K.shake();K.callout('A PLANT WILTED','#garden','bad')}},
  {test:(a,b)=>b.i===a.i&&a.status==='growing'&&b.status==='complete',sfx:'win',run:(K,a,b)=>setTimeout(()=>{K.callout('EXHIBITION READY · '+'★'.repeat(b.stars||0),'#garden','good big');K.burst('#garden',32)},250)},
  {test:(a,b)=>b.i===a.i&&a.status==='growing'&&b.status==='lost',sfx:'lose',run:K=>{K.shake();K.callout('THE SEASON IS OVER','#garden','bad big')}}]});
})();
