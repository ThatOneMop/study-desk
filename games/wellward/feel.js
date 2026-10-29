/* Wellward feel: relic pops, bump alarms, banking fanfare, personal bests per well and a coached first descent. */
(function(){'use strict';const G=()=>window.WWGame,E=window.Wellward,BK='study-desk-wellward-best-v1';let riding=false;
let best={};try{best=JSON.parse(localStorage.getItem(BK)||'{}')||{}}catch(e){best={}}
const bucket=s=>{const c=document.getElementById('scene');if(!c||!s)return null;const r=c.getBoundingClientRect(),sc=Math.min(r.width/600,r.height/745),off=(r.width-600*sc)/2,p=E.position(s.run);return{x:r.left+off+p.x*sc,y:r.top+p.y*sc}};
const panel=document.createElement('section');panel.className='ww-best';panel.id='wwBest';
const st=document.createElement('style');st.textContent='.ww-best{margin-top:14px;padding:16px 18px;border-radius:14px;border:1px solid #f0c98a55;background:#0e2329}.ww-best h3{font:700 11px ui-monospace,monospace;letter-spacing:.18em;margin:0 0 8px;color:#f0c98a}.ww-best ol{list-style:none;margin:0;padding:0;font-size:13px;line-height:1.5}.ww-best li{display:flex;justify-content:space-between;gap:8px;border-top:1px solid #ffffff14;padding:5px 0}.ww-best li span{opacity:.75}.ww-best li.new b{color:#f0c98a}';document.head.append(st);
function drawBest(flash){const rows=E.WELLS.map((w,i)=>{const b=best[i];return`<li class="${flash===i?'new':''}"><span>${w.name}</span><b>${b?`${b.haul} relic${b.haul===1?'':'s'} · ${b.brass} brass · ${b.time.toFixed(1)} s${b.clean?' · ✦ clean':''}`:'—'}</b></li>`}).join('');panel.innerHTML=`<h3>PERSONAL BESTS</h3><ol>${rows}</ol>`}
drawBest();const aside=document.querySelector('aside');if(aside)aside.append(panel);
function bank(K,a,b){const haul=b.rel-a.rel,brass=b.coins-a.coins,time=a.frame/60,clean=a.health===3,i=a.well,o=best[i];let nb=[];
 if(!haul)return;if(!o||haul>o.haul)nb.push('HAUL');if(!o||brass>o.brass)nb.push('BRASS');if(!o||time<o.time)nb.push('TIME');
 best[i]={haul:Math.max(haul,o?o.haul:0),brass:Math.max(brass,o?o.brass:0),time:Math.min(time,o?o.time:1e9),clean:clean||!!(o&&o.clean)};try{localStorage.setItem(BK,JSON.stringify(best))}catch(e){}
 drawBest(nb.length?i:-1);K.callout(`BANKED +${brass} BRASS`,b.bucket?{x:b.bucket.x,y:b.bucket.y+70}:'#scene','good big');K.burst('#coins',22,['#f0c98a','#fff1c9','#8fc7c1']);if(nb.length){setTimeout(()=>{K.sfx.great();K.callout('NEW BEST · '+nb.join(' + '),'#wwBest','good')},420)}}
const art=`<svg class="art" viewBox="0 0 150 96" aria-hidden="true"><rect x="40" y="6" width="70" height="90" fill="#163038"/><path d="M40 6v90M110 6v90" stroke="#2e4c52" stroke-width="6"/><path d="M30 8h90" stroke="#c9a46a" stroke-width="4"/><path d="M75 8v46" stroke="#e8dcc0" stroke-width="1.5"/><path d="M66 54h18l-3 14h-12z" fill="#c9a46a"/><circle cx="58" cy="80" r="4" fill="#8fc7c1"/><circle cx="96" cy="70" r="3" fill="#f0c98a"/><path d="M40 86q35-8 70 0" stroke="#4d8b8f" stroke-width="2" fill="none"/></svg>`;
FeelKit({id:'wellward',prefix:'ww',global:'WWFeel',title:'Wellward',eyebrow:'A WINCH. A BUCKET. A LITTLE CURIOSITY.',art,
 tagline:'Swing a bucket down four winding wells, lift glowing relics and bring them home to the cabinet.',
 startLabel:'Uncoil the rope',keys:'A D slide · S lower · W raise · Space steady · E lift · F ballast · R repair · P pause',
 pauseTitle:'Rope tied off',pauseText:'The bucket hangs still. Nothing swings until you return.',
 headerBefore:'header #help',guide:'#help',play:'#scene',tipAfter:'#brief',accent:'#f0c98a',accentInk:'#122a30',card:'#122a30',ink:'#f3e6c6',good:'#8fc7c1',root:349,
 colors:['#f0c98a','#8fc7c1','#fff1c9'],ambient:{cut:300,vol:.3,notes:[0,3,5,7,10]},
 onPause:()=>{const g=G();if(!g)return;riding=!g.paused&&g.s.run.phase==='dive';g.pause()},onResume:()=>{if(riding)G().resume();riding=false},
 progress:()=>{const g=G();if(!g)return'';const t=E.totals(g.s);return t.relics?`${t.relics} relics in the cabinet · ${t.seals} of 4 seals`:'Four wells. Sixteen relics.'},
 snap:()=>{const g=G();if(!g)return null;const s=g.s,r=s.run,t=E.totals(s);return{well:s.well,phase:r.phase,health:r.health,cargo:r.cargo.length,ballast:r.ballast,coins:s.coins,rel:t.relics,seals:t.seals,frame:r.frame,up:Object.values(s.upgrades).reduce((a,b)=>a+b,0),bucket:bucket(s),paused:g.paused,len:r.length}},
 rules:[
  {test:(a,b)=>a.phase==='dock'&&b.phase==='dive',sfx:'whoosh',run:(K,a,b)=>K.callout('DOWN WE GO',b.bucket)},
  {test:(a,b)=>b.phase==='dive'&&b.cargo>a.cargo,sfx:'coin',run:(K,a,b)=>{K.burst(b.bucket,18);K.callout('RELIC SECURED',b.bucket,'good')}},
  {test:(a,b)=>b.phase!=='lost'&&a.phase==='dive'&&b.health<a.health,sfx:'bad',run:(K,a,b)=>{K.shake();K.flash('#ff8a5a');K.burst(b.bucket,10,['#9aa7a4','#6e7b78']);K.callout(`BUMP · ${b.health}/3 STRAPS`,b.bucket,'bad')}},
  {test:(a,b)=>b.phase==='dive'&&a.ballast!==b.ballast,sfx:'thud',run:(K,a,b)=>K.callout(b.ballast?'BALLAST FILLED':'WATER DRAINED',b.bucket)},
  {test:(a,b)=>a.phase==='dive'&&b.phase==='dock'&&b.rel>a.rel,sfx:'win',run:bank},
  {test:(a,b)=>b.seals>a.seals,run:K=>setTimeout(()=>{K.callout('SEAL EARNED · NEW WELL OPEN','#wells','good big');K.burst('#wells',26)},900)},
  {test:(a,b)=>a.phase==='dive'&&b.phase==='lost',sfx:'lose',run:K=>{K.shake();K.flash('#ff6b4a');K.callout('STRAP BROKEN','#scene','bad big')}},
  {test:(a,b)=>b.up>a.up,sfx:'great',run:K=>K.callout('UPGRADE FITTED','#upgrades','good')}],
 tip:b=>{if(!b||b.well!==0||b.rel>=2||b.phase==='lost')return'';const B='<b>WINCH-KEEPER</b> · ';
  if(b.phase==='dock')return B+(b.rel?'Lovely. Launch again and fetch another glow; two relics buy your first workshop upgrade.':'Press Launch to drop the bucket. The first well is calm: no current, wide walls.');
  if(!b.cargo)return B+'Hold <kbd>S</kbd> to lower and <kbd>A</kbd>/<kbd>D</kbd> to slide. Stop beside a glowing relic, hold <kbd>Space</kbd> to steady, then <kbd>E</kbd> to lift it.';
  return B+'Got it! Hold <kbd>W</kbd> to raise and steer back to the centre landing, then press Dock.'}});
})();
