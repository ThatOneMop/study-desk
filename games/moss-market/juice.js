/* Moss Market juice: trades, workbench crafts, filled orders, declined offers and market results (toward the Moonlighter / Potion Craft shopkeeping feel). */
(function(){'use strict';const G=()=>window.MMGame;
JuiceKit({id:'moss-market',prefix:'mm',global:'MMJuice',play:'.offer-panel',root:349,accent:'#b9d77a',card:'#1d2416',ink:'#f3f0dc',good:'#cfe8a0',colors:['#b9d77a','#e8c27a','#f3f0dc','#9fc7a8'],
 snap:()=>{const g=G();if(!g)return null;const r=g.o.run;return{i:r.index,status:r.status,trades:r.trades,crafts:r.crafts,done:r.done.filter(Boolean).length,no:r.rejections,stars:r.stars}},
 rules:[
  {test:(a,b)=>b.i===a.i&&b.trades>a.trades,sfx:'coin',run:K=>{K.callout('TRADE MADE','.offer-panel','good');K.burst('.offer-panel',12)}},
  {test:(a,b)=>b.i===a.i&&b.crafts>a.crafts,sfx:'thud',run:K=>{K.callout('CRAFTED','.craft','good');K.burst('.craft',10,['#e8c27a','#f3f0dc'])}},
  {test:(a,b)=>b.i===a.i&&b.done>a.done,sfx:'great',run:(K,a,b)=>{K.callout('ORDER FILLED '+b.done+'/3','.orders-panel','good');K.burst('.orders-panel',18)}},
  {test:(a,b)=>b.i===a.i&&b.no>a.no,sfx:'bad',run:K=>{K.shake();K.callout('OFFER DECLINED','.offer-panel','bad')}},
  {test:(a,b)=>b.i===a.i&&a.status!=='complete'&&b.status==='complete',sfx:'win',run:(K,a,b)=>setTimeout(()=>{K.callout('MARKET DAY DONE '+'★'.repeat(b.stars||0),'.offer-panel','good big');K.burst('.offer-panel',32)},200)},
  {test:(a,b)=>b.i===a.i&&a.status!=='lost'&&b.status==='lost',sfx:'lose',run:K=>{K.shake();K.callout('STALL CLOSED EARLY','.offer-panel','bad big')}}]});
})();
