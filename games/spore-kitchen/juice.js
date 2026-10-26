/* Spore Kitchen juice: planting, sprouting, harvests, plated dishes and finished services (toward the Cooking Simulator / Potion Craft brew-and-serve loop). */
(function(){'use strict';const G=()=>window.SKGame;const bed=i=>'#beds > :nth-child('+(i+1)+')';
JuiceKit({id:'spore-kitchen',prefix:'sk',global:'SKJuice',headerBefore:'header span',play:'#beds',root:349,accent:'#c98a5a',card:'#2a1c14',ink:'#f6ead8',good:'#b5d77a',colors:['#c98a5a','#e9c9a0','#8f6b4e','#b5d77a'],
 snap:()=>{const g=G();if(!g)return null;const k=g.o.kitchen;return{s:k.service,turn:k.turn,status:k.status,beds:k.beds.map(b=>b?JSON.stringify(b):''),tray:k.tray.length,served:k.served.filter(Boolean).length,stars:k.served.reduce((a,b)=>a+b,0),earn:k.earnings}},
 rules:[
  {test:(a,b)=>b.s===a.s&&b.beds.some((x,i)=>x&&!a.beds[i]),sfx:'step',run:(K,a,b)=>{const i=b.beds.findIndex((x,i)=>x&&!a.beds[i]);K.burst(bed(i),10,['#8f6b4e','#c98a5a','#e9c9a0']);K.callout('PLANTED',bed(i))}},
  {test:(a,b)=>b.s===a.s&&b.tray>a.tray,sfx:'coin',run:(K,a,b)=>{const i=a.beds.findIndex((x,i)=>x&&!b.beds[i]);const w=i>=0?bed(i):'#tray';K.burst(w,14);K.callout('HARVESTED',w,'good')}},
  {test:(a,b)=>b.s===a.s&&b.served>a.served,sfx:'great',run:(K,a,b)=>{const st=b.stars-a.stars;K.callout('SERVED '+'★'.repeat(Math.max(1,st)),'#orders','good big');K.burst('#orders',24)}},
  {test:(a,b)=>b.s===a.s&&b.turn>a.turn&&b.served===a.served&&b.tray===a.tray&&b.beds.filter(Boolean).length>=a.beds.filter(Boolean).length,sfx:'click',run:K=>K.burst('#beds',5,['#b5d77a','#e9c9a0'])},
  {test:(a,b)=>b.s===a.s&&a.status==='growing'&&b.status==='complete',sfx:'win',run:(K,a,b)=>setTimeout(()=>{K.callout('SERVICE COMPLETE · +'+b.earn+' COINS','#orders','good big');K.burst('#orders',32)},250)},
  {test:(a,b)=>b.s===a.s&&a.status==='growing'&&b.status==='failed',sfx:'lose',run:K=>{K.shake();K.callout('THE KITCHEN CLOSES','#beds','bad big')}}]});
})();
