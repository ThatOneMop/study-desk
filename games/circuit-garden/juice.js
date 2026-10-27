/* Circuit Garden juice: module placement, commissioning, intervals, bed growth, brownouts and season results (toward the Mini Motorways / Dorfromantik cosy-builder feel). */
(function(){'use strict';const G=()=>window.CGGame;const GOALS=[[2,2,2],[3,2,2],[2,3,2],[3,3,2],[3,3,3],[3,3,3]],NAMES=['Mint pump','Sunroom','Seed bank'];
JuiceKit({id:'circuit-garden',prefix:'cg',global:'CGJuice',play:'#roof',root:370,accent:'#9fd38a',card:'#16231b',ink:'#eef5e6',good:'#c8f0a8',colors:['#9fd38a','#ffe28a','#8fd0ff','#eef5e6'],
 snap:()=>{const g=G();if(!g)return null;const r=g.o.run;return{i:r.index,status:r.status,mods:r.tiles.filter(t=>t!==null).length,step:r.step,grow:r.growth.reduce((a,b)=>a+b,0),g:r.growth.slice(),faults:r.faults,stars:r.stars}},
 rules:[
  {test:(a,b)=>b.i===a.i&&b.status==='planning'&&b.mods!==a.mods,sfx:'click',run:()=>{}},
  {test:(a,b)=>b.i===a.i&&a.status==='planning'&&b.status==='growing',sfx:'whoosh',run:K=>{K.callout('GRID LIVE','#roof','good');K.burst('#roof',14,['#ffe28a','#8fd0ff'])}},
  {test:(a,b)=>b.i===a.i&&b.step>a.step&&b.grow===a.grow&&b.faults===a.faults,sfx:'step',run:()=>{}},
  {test:(a,b)=>b.i===a.i&&b.grow>a.grow,sfx:'good',run:(K,a,b)=>{const goals=GOALS[b.i]||GOALS[0],n=b.g.findIndex((v,i)=>v>(a.g[i]||0)),bloom=n>=0&&b.g[n]>=goals[n];K.callout(bloom?(NAMES[n]||'A bed').toUpperCase()+' IN BLOOM':'BEDS GROW','#roof','good'+(bloom?' big':''));K.burst('#roof',bloom?20:12,bloom?['#c8f0a8','#ffe28a','#fff6d4']:undefined)}},
  {test:(a,b)=>b.i===a.i&&b.faults>a.faults,sfx:'bad',run:K=>{K.shake();K.flash('#ff6a4a');K.callout('BROWNOUT','#roof','bad')}},
  {test:(a,b)=>b.i===a.i&&a.status!=='complete'&&b.status==='complete',sfx:'win',run:(K,a,b)=>setTimeout(()=>{K.callout('SEASON IN BLOOM '+'★'.repeat(b.stars||0),'#roof','good big');K.burst('#roof',32)},200)},
  {test:(a,b)=>b.i===a.i&&a.status!=='lost'&&b.status==='lost',sfx:'lose',run:K=>{K.shake();K.callout('GRID TRIPPED','#roof','bad big')}}]});
})();
