/* Deep Pocket juice: cast whoosh, bites, line strain, landings and brief fanfares (toward the Dredge / Fishing Planet catch loop). */
(function(){'use strict';const G=()=>window.DPGame,$=q=>document.querySelector(q);
JuiceKit({id:'deep-pocket',prefix:'dp',global:'DPJuice',headerBefore:'header span',play:'main',root:330,accent:'#8fc1c9',card:'#10262c',ink:'#e8f3ee',good:'#a7d08c',colors:['#8fc1c9','#e8f3ee','#5d9aa8','#f0d27a'],
 snap:()=>{const g=G();if(!g)return null;const r=g.o.run,f=r.fight;return{i:r.index,casts:r.casts,fight:!!f,ten:f?f.tension:0,prog:f?f.progress:0,rec:r.records.length,last:r.records[r.records.length-1],phase:r.phase,stars:r.stars,status:r.status,coins:g.o.profile.coins}},
 rules:[
  {test:(a,b)=>b.i===a.i&&b.casts>a.casts,sfx:'whoosh',run:K=>K.callout('CAST','#line')},
  {test:(a,b)=>!a.fight&&b.fight,sfx:'thud',run:K=>{K.shake();setTimeout(()=>K.callout('BITE! · '+($('#fishName')?.textContent||'').toUpperCase(),'#fight','big'),60)}},
  {test:(a,b)=>a.fight&&b.fight&&b.prog>a.prog,sfx:'step',run:K=>K.burst('#progress',6)},
  {test:(a,b)=>a.fight&&b.fight&&a.ten<80&&b.ten>=80,sfx:'bad',run:K=>{K.shake();K.flash('#ff8a5a');K.callout('LINE STRAIN','#tension','bad')}},
  {test:(a,b)=>a.phase!=='landed'&&b.phase==='landed',sfx:'great',run:K=>{K.callout('LANDED!','#fishArt','good big');K.burst('#fishArt',26)}},
  {test:(a,b)=>b.rec>a.rec&&b.last&&b.last.choice==='escape',sfx:'bad',run:K=>{K.shake();K.callout('IT GOT AWAY','#fishArt','bad')}},
  {test:(a,b)=>b.rec>a.rec&&b.last&&b.last.choice==='keep',sfx:'coin',run:(K,a,b)=>{K.callout(b.rec===1?'FIRST CATCH · IN THE NET':'IN THE NET','#fishArt','good big');K.burst('#fishArt',b.rec===1?28:16,['#f0d27a','#e8f3ee','#8fc1c9'])}},
  {test:(a,b)=>b.rec>a.rec&&b.last&&b.last.choice==='release',sfx:'good',run:K=>K.callout('RELEASED ✓','#fishArt','good')},
  {test:(a,b)=>b.coins>a.coins,sfx:'coin',run:(K,a,b)=>K.callout('+'+(b.coins-a.coins)+' COINS','#coins','good')},
  {test:(a,b)=>b.i===a.i&&a.status==='active'&&b.status==='complete',sfx:'win',run:(K,a,b)=>setTimeout(()=>{K.callout('BRIEF COMPLETE · '+'★'.repeat(b.stars||0),'#story','good big');K.burst('#story',30)},300)},
  {test:(a,b)=>b.i===a.i&&a.status==='active'&&b.status==='lost',sfx:'lose',run:K=>{K.shake();K.callout('THE LAKE WINS THIS ONE','#story','bad big')}}]});
})();
