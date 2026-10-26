/* Storm Signal juice: rescans, logged calls, misreads, boat dispatches, crews brought home and watch results (toward the Return of the Obra Dinn / Papers, Please deduction-desk feel). */
(function(){'use strict';const G=()=>window.SSGame;
JuiceKit({id:'storm-signal',prefix:'ss',global:'SSJuice',play:'#radar',root:311,accent:'#7fb3e8',card:'#0f1a26',ink:'#e6eef6',good:'#9fe0b2',colors:['#7fb3e8','#e6eef6','#ffd36b','#9fe0b2'],
 snap:()=>{const g=G();if(!g)return null;const r=g.o.run;return{i:r.index,status:r.status,beat:r.beat,scans:r.scans,misreads:r.misreads,logged:r.logged.filter(Boolean).length,out:r.missions.filter(m=>m!==null).length,home:r.progress.filter(p=>p==='home').length,stars:r.stars}},
 rules:[
  {test:(a,b)=>b.i===a.i&&b.scans>a.scans,sfx:'step',run:K=>K.callout('RESCAN','#radar')},
  {test:(a,b)=>b.i===a.i&&b.logged>a.logged,sfx:'good',run:K=>{K.callout('SIGNAL LOGGED','#radar','good');K.burst('#radar',10)}},
  {test:(a,b)=>b.i===a.i&&b.misreads>a.misreads,sfx:'bad',run:K=>{K.shake();K.flash('#ff6a4a');K.callout('MISREAD','#radar','bad')}},
  {test:(a,b)=>b.i===a.i&&b.out>a.out,sfx:'whoosh',run:K=>K.callout('BOAT AWAY','#radar','good')},
  {test:(a,b)=>b.i===a.i&&b.beat>a.beat&&b.home===a.home,sfx:'click',run:()=>{}},
  {test:(a,b)=>b.i===a.i&&b.home>a.home,sfx:'great',run:K=>{K.callout('CREW HOME SAFE','#radar','good');K.burst('#radar',20)}},
  {test:(a,b)=>b.i===a.i&&a.status!=='complete'&&b.status==='complete',sfx:'win',run:(K,a,b)=>setTimeout(()=>{K.callout('WATCH ENDS '+'★'.repeat(b.stars||0),'#radar','good big');K.burst('#radar',32)},200)},
  {test:(a,b)=>b.i===a.i&&a.status!=='lost'&&b.status==='lost',sfx:'lose',run:K=>{K.shake();K.callout('A LIGHT WENT OUT','#radar','bad big')}}]});
})();
