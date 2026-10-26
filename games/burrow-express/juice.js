/* Burrow Express juice: track laying, departures, train moves, signal holds and timetable results (toward the Mini Metro / Railbound puzzle-rail feel). */
(function(){'use strict';const G=()=>window.BEGame;
JuiceKit({id:'burrow-express',prefix:'be',global:'BEJuice',play:'#map',root:349,accent:'#efa869',card:'#2a1f18',ink:'#f6ead8',good:'#a9c49a',colors:['#efa869','#a9c49a','#c5ade2','#f6ead8'],
 snap:()=>{const g=G();if(!g)return null;const r=g.o.run;return{i:r.index,status:r.status,track:r.routes.reduce((n,p)=>n+p.length,0),moved:r.positions.reduce((n,p)=>n+p,0),held:r.held.filter(Boolean).length,stars:r.stars}},
 rules:[
  {test:(a,b)=>b.i===a.i&&b.status==='planning'&&b.track>a.track,sfx:'click',run:()=>{}},
  {test:(a,b)=>b.i===a.i&&a.status==='planning'&&b.status==='running',sfx:'whoosh',run:K=>{K.callout('ALL ABOARD','#map','good');K.burst('#map',12)}},
  {test:(a,b)=>b.i===a.i&&b.status==='running'&&b.moved>a.moved,sfx:'step',run:()=>{}},
  {test:(a,b)=>b.i===a.i&&b.held>a.held,sfx:'click',run:K=>K.callout('HELD AT SIGNAL','#map')},
  {test:(a,b)=>b.i===a.i&&a.status!=='complete'&&b.status==='complete',sfx:'win',run:(K,a,b)=>setTimeout(()=>{K.callout('ALL PARCELS IN '+'★'.repeat(b.stars||0),'#map','good big');K.burst('#map',32)},200)},
  {test:(a,b)=>b.i===a.i&&a.status!=='lost'&&b.status==='lost',sfx:'bad',run:K=>{K.shake();K.flash('#ff6a4a');K.callout('SIGNAL FAILURE','#map','bad big')}}]});
})();
