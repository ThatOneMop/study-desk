/* Bolt & Bristle juice: scrubs, oiling, bolt turns, plate rotations, circuit tests and restorations (toward the PowerWash Simulator / Unpacking tidy-and-repair feel). */
(function(){'use strict';const G=()=>window.BBGame;const cell=i=>'#plate'+i;
JuiceKit({id:'bolt-and-bristle',prefix:'bb',global:'BBJuice',headerBefore:'header span',play:'#board',root:330,accent:'#e0a95a',card:'#1e2328',ink:'#f2ede4',good:'#a6dcb0',colors:['#e0a95a','#f2ede4','#8fb8c9','#c27a4a'],
 snap:()=>{const g=G();if(!g)return null;const j=g.o.job;return{i:j.index,status:j.status,act:j.actions,tests:j.tests,stars:j.stars,reward:j.reward,t:j.tiles.map(t=>[t.dirt,t.rust,t.bolt,t.rot].join(','))}},
 rules:[
  {test:(a,b)=>b.i===a.i&&b.t.some((x,i)=>x!==a.t[i]),sfx:'step',run:(K,a,b)=>{b.t.forEach((x,i)=>{if(x===a.t[i])return;const p=a.t[i].split(',').map(Number),q=x.split(',').map(Number);const col=q[0]<p[0]?['#d9cdb8','#f2ede4']:q[1]<p[1]?['#c27a4a','#e0a95a']:['#8fb8c9','#f2ede4'];K.burst(cell(i),q[3]!==p[3]&&q[0]===p[0]&&q[1]===p[1]&&q[2]===p[2]?4:8,col)})}},
  {test:(a,b)=>b.i===a.i&&b.t.some((x,i)=>{const p=a.t[i].split(','),q=x.split(',');return q[2]!==p[2]}),sfx:'click',run:()=>{}},
  {test:(a,b)=>b.i===a.i&&b.tests>a.tests&&b.status==='repair',sfx:'bad',run:K=>{K.shake();K.callout('NO CURRENT YET','#board','bad')}},
  {test:(a,b)=>b.i===a.i&&a.status==='repair'&&b.status==='complete',sfx:'win',run:(K,a,b)=>{K.flash('#ffe9a8');setTimeout(()=>{K.callout('IT HUMS! '+'★'.repeat(b.stars||0)+(b.reward?' · +'+b.reward+' COINS':''),'#board','good big');K.burst('#board',32)},200)}}]});
})();
