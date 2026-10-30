/* Pocket Palaeo feel: dust and bone reveals, crack alarms, museum fanfare and a coached first dig. */
(function(){'use strict';const G=()=>window.PPGame,E=window.Palaeo;
const cell=i=>document.querySelector(`[data-cell="${i}"]`)||'#board';
const own=(s,i)=>E.SITES[s.site].specimens.find(id=>E.SPECIMENS[id].cells.includes(i));
const art=`<svg class="art" viewBox="0 0 150 96" aria-hidden="true"><rect x="10" y="10" width="130" height="80" rx="6" fill="#c9905d"/><g fill="#b07a4c"><circle cx="30" cy="30" r="3"/><circle cx="118" cy="24" r="2.5"/><circle cx="104" cy="72" r="3"/></g><path d="M38 60q12-22 34-18t40 6" stroke="#f3e6c8" stroke-width="7" stroke-linecap="round" fill="none"/><g stroke="#f3e6c8" stroke-width="4" stroke-linecap="round"><path d="M54 50v16M70 44v18M86 46v16"/></g><circle cx="114" cy="48" r="8" fill="#f3e6c8"/><circle cx="116" cy="46" r="2" fill="#8a5a36"/><path d="M20 80l14-14" stroke="#2f5547" stroke-width="5" stroke-linecap="round"/><path d="M30 64l8 8" stroke="#d6b98a" stroke-width="6"/></svg>`;
FeelKit({id:'pocket-palaeo',prefix:'pp',global:'PPFeel',title:'Pocket Palaeo',eyebrow:'SMALL FINDS. LONG STORIES.',art,
 tagline:'Brush away the years, brace fragile bones and lift whole specimens into your little museum.',
 startLabel:'Open the field case',keys:'1 brush · 2 pick · 3 brace · 4 resin · 5 lift · 6 jacket · arrows + Enter · P pause',
 pauseTitle:'Tea in the tent',pauseText:'The dig site waits under its tarp. Nothing changes until you return.',
 holdTip:()=>G()?.stroking,onPause:()=>G()?.stop(),headerBefore:'header #help',guide:'#help',play:'#board',tipAfter:'#tool-note',accent:'#2f5547',accentInk:'#f6ecd8',card:'#f6ecd8',ink:'#2b3a33',good:'#2f5547',goodInk:'#2f5547',tipBg:'#2f554714',shade:'#3b2a1acc',root:392,
 colors:['#c9905d','#e7c9a0','#8a5a36','#f3e6c8'],ambient:{cut:900,vol:.08,notes:[0,2,4,7,9]},
 escBusy:()=>G()&&G().grip!=null,
 progress:()=>{const g=G();if(!g)return'';const n=g.s.records.filter(Boolean).length;return n?`${n} of 6 specimens in the museum · ${g.s.marks} research seals`:'Three sites. Six specimens waiting.'},
 snap:()=>{const g=G();if(!g)return null;const s=g.s;return{site:s.site,n:s.actions.length,phase:s.phase,dirt:[...s.dirt],health:[...s.health],jackets:s.jackets.length,braces:s.braces.length,resin:s.resin,rec:[...s.recovered],up:s.upgrades.length,marks:s.marks,tool:g.tool,s}},
 rules:[
  {test:(a,b)=>b.site===a.site&&b.n>a.n&&b.dirt.some((d,i)=>d<a.dirt[i]),run:(K,a,b)=>{const ch=b.dirt.map((d,i)=>d<a.dirt[i]?i:-1).filter(i=>i>=0);const bones=ch.filter(i=>b.dirt[i]===0&&own(b.s,i)!==undefined&&!b.rec.includes(own(b.s,i)));for(const i of ch.slice(0,3))K.burst(cell(i),6,['#c9905d','#e7c9a0','#b07a4c']);
   if(bones.length){K.sfx.coin();K.callout('BONE!',cell(bones[0]),'good')}else (a.tool==='pick'?K.sfx.thud:K.sfx.step)()}},
  {test:(a,b)=>b.site===a.site&&b.n>a.n&&b.health.some((h,i)=>h<a.health[i])&&b.phase!=='lost',sfx:'bad',run:(K,a,b)=>{const i=b.health.findIndex((h,j)=>h<a.health[j]);K.shake();K.flash('#ff8a5a');K.callout('CRACK!',cell(i),'bad')}},
  {test:(a,b)=>b.site===a.site&&b.n>a.n&&b.braces>a.braces,sfx:'thud',run:K=>K.callout('BRACED','#board')},
  {test:(a,b)=>b.site===a.site&&b.n>a.n&&b.resin<a.resin,sfx:'good',run:(K,a,b)=>K.callout(b.jackets>a.jackets?'JACKET FITTED':'CONSOLIDATED','#board','good')},
  {test:(a,b)=>b.site===a.site&&b.rec.length>a.rec.length&&b.phase!=='lost',sfx:'great',run:(K,a,b)=>{const id=b.rec[b.rec.length-1],q=E.condition?E.condition(b.s,id):null;K.callout(`${E.SPECIMENS[id].name.toUpperCase()}${q!=null?' · '+q+'%':''}`,'#board','good big');for(let i=0;i<3;i++)setTimeout(()=>K.burst('#board',22),i*160)}},
  {test:(a,b)=>a.phase!=='complete'&&b.phase==='complete',sfx:'win',run:K=>setTimeout(()=>{K.callout('★ SITE COMPLETE · TO THE MUSEUM','#board','good big');K.burst('#board',30)},700)},
  {test:(a,b)=>b.site===a.site&&a.phase!=='lost'&&b.phase==='lost',sfx:'lose',run:K=>{K.shake();K.flash('#ff6b4a');K.callout('FRACTURED','#board','bad big')}},
  {test:(a,b)=>b.up>a.up,sfx:'great',run:K=>K.callout('NEW FIELD TOOL','#upgrades','good')}],
 tip:b=>{if(!b||b.site!==0||b.phase!=='dig'||b.s.records.filter(Boolean).length>=2)return'';const B='<b>FIELD MENTOR</b> · ',s=b.s;
  const sp=E.SITES[0].specimens.filter(id=>!b.rec.includes(id)),cells=sp.flatMap(id=>E.SPECIMENS[id].cells),covered=cells.filter(i=>s.dirt[i]>0).length,cracked=cells.filter(i=>s.dirt[i]===0&&s.health[i]<3).length;
  if(!b.n)return B+'Press <kbd>2</kbd> for the pick to clear plain soil fast, but switch to the brush (<kbd>1</kbd>) the moment you see pale bone. Drag across cells to sweep.';
  if(cracked&&s.resin)return B+`A bone is cracked. Press <kbd>4</kbd> for resin and tap it before you lift.`;
  if(covered)return B+`${covered} bone cell${covered===1?'':'s'} still under soil. Brush them clear; the pick can crack shallow bone.`;
  if(b.braces<2)return B+'Fully exposed! Press <kbd>3</kbd> and spread braces along the specimen: one near each end works well.';
  return B+'Braces set. Press <kbd>5</kbd> to lift, then tap the specimen. The preview shows any strain first.'}});
})();

