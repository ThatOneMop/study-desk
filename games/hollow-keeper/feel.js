/* Hollow Keeper feel: Orcs Must Die-style trap feedback, a title card, pause and a first-hollow coach. */
(function(){'use strict';const G=()=>window.HKGame,E=window.HollowKeeper;
const cell=c=>document.querySelector(`[data-cell="${c}"]`)||'#board';
const art=`<svg class="art" viewBox="0 0 150 96" aria-hidden="true"><path d="M0 70q40-18 75-6t75-4v36H0z" fill="#3d2f22"/><path d="M0 78q50-10 150 0v18H0z" fill="#2a2018"/><path d="M30 92q10-40 45-46 34 6 45 46" fill="none" stroke="#c9a46a" stroke-width="3" stroke-dasharray="4 5"/><g transform="translate(75 40)"><ellipse rx="19" ry="14" fill="#4f6b3c"/><path d="M0-14V14" stroke="#24331c" stroke-width="2"/><circle cx="-9" cy="-4" r="3" fill="#a9c47f"/><circle cx="9" cy="-4" r="3" fill="#a9c47f"/><path d="M-6-15q-8-12-16-10M6-15q8-12 16-10" stroke="#24331c" stroke-width="2" fill="none"/><path d="M-19 0h-8M19 0h8M-17 8l-8 5M17 8l8 5" stroke="#24331c" stroke-width="2"/></g><g fill="#e3b25a"><circle cx="22" cy="20" r="2"/><circle cx="128" cy="14" r="1.6"/><circle cx="110" cy="30" r="1.2"/></g></svg>`;
FeelKit({id:'hollow-keeper',prefix:'hk',global:'HKFeel',title:'Hollow Keeper',eyebrow:'A COLONY BENEATH THE ROOTS',art,
 tagline:'Shape the trail, set thorn beds and lure intruders away from the nursery. Nothing marches until you say so.',
 startLabel:'Enter the hollow',keys:'1–5 tools · arrows + Enter place · L release · Space march · Z undo · P pause',
 pauseTitle:'Roots still',pauseText:'The colony holds its breath. Auto march stops until you return.',
 headerBefore:'header #help',guide:'#help',play:'#board',tipAfter:'#tool-note',accent:'#d9a95b',card:'#1d2a1f',ink:'#f0e6c8',good:'#a9c47f',root:330,
 colors:['#d9a95b','#a9c47f','#f0e6c8','#8c6a43'],ambient:{cut:380,vol:.22,notes:[0,2,5,7,9]},
 escBusy:()=>G()&&G().draft!=null,
 onPause:()=>G()&&G().stop(),
 progress:()=>{const sv=G()&&G().save;if(!sv)return'';const n=(sv.records||[]).filter(Boolean).length;return n?`${n} of ${E.CHAPTERS.length} hollows defended`:'Five hollows to defend'},
 snap:()=>{const g=G();if(!g)return null;const s=g.s;return{ch:s.chapter,phase:s.phase,wave:s.wave,def:s.defeated,hp:s.health,traps:s.traps.length,lv:s.traps.reduce((a,t)=>a+t.level,0),edits:s.edits,lure:!!s.lure,en:s.enemies.map(e=>({id:e.id,cell:e.cell,hp:e.hp})),hist:s.history.length,medal:E.medal(s)}},
 rules:[
  {test:(a,b)=>b.hist<a.hist||b.ch!==a.ch,run:()=>{}},
  {test:(a,b)=>b.ch===a.ch&&b.hist>=a.hist&&b.def>a.def,sfx:'good',run:(K,a,b)=>{const gone=a.en.filter(e=>!b.en.some(x=>x.id===e.id));const n=b.def-a.def;for(const e of gone){K.burst(cell(e.cell),16)}K.callout(n>1?`SQUASHED ×${n}`:'SQUASHED',cell((gone[0]||{}).cell),'good')}},
  {test:(a,b)=>b.ch===a.ch&&b.hist>=a.hist&&b.def===a.def&&b.en.some(e=>{const o=a.en.find(x=>x.id===e.id);return o&&e.hp<o.hp}),sfx:'thud',run:(K,a,b)=>{const e=b.en.find(e=>{const o=a.en.find(x=>x.id===e.id);return o&&e.hp<o.hp});K.burst(cell(e.cell),8,['#d9a95b','#8c6a43']);K.callout('THORNS!',cell(e.cell))}},
  {test:(a,b)=>b.ch===a.ch&&b.hist>=a.hist&&b.hp<a.hp,sfx:'bad',run:K=>{K.shake();K.flash('#ff6b4a');K.callout('NURSERY HIT','#hearts','bad')}},
  {test:(a,b)=>b.ch===a.ch&&b.hist>a.hist&&b.traps>a.traps,sfx:'step',run:(K,a,b)=>K.callout('THORNS SET','#board')},
  {test:(a,b)=>b.ch===a.ch&&b.hist>a.hist&&b.lv>a.lv&&b.traps===a.traps,sfx:'coin',run:K=>K.callout('REINFORCED','#board','good')},
  {test:(a,b)=>b.ch===a.ch&&b.hist>a.hist&&b.edits>a.edits,sfx:'thud'},
  {test:(a,b)=>b.ch===a.ch&&b.hist>a.hist&&b.lure&&!a.lure,sfx:'coin',run:K=>K.callout('FRUIT LURE','#board')},
  {test:(a,b)=>a.phase==='prep'&&b.phase==='defend',sfx:'whoosh',run:K=>K.callout('HERE THEY COME','#board','big')},
  {test:(a,b)=>b.ch===a.ch&&a.phase==='defend'&&b.phase==='prep'&&b.wave>a.wave,sfx:'great',run:K=>{K.callout('WAVE HELD · +4 RESIN','#board','good big');K.burst('#wave',18)}},
  {test:(a,b)=>a.phase!=='won'&&b.phase==='won',sfx:'win',run:(K,a,b)=>{K.callout('✦'.repeat(b.medal)+' THE HOLLOW HOLDS','#board','good big');for(let i=0;i<4;i++)setTimeout(()=>K.burst('#board',26),i*180)}},
  {test:(a,b)=>a.phase!=='lost'&&b.phase==='lost',sfx:'lose',run:K=>{K.shake();K.callout('THE NURSERY RETREATS','#board','bad big')}}],
 tip:b=>{if(!b||b.ch!==0||b.phase==='won'||b.phase==='lost')return'';const B='<b>ROOTKEEPER’S TIP</b> · ';
  if(b.phase==='defend')return B+'Each thorn bed strikes up to three times per wave. Press Space to march one step, or turn on Auto march.';
  if(b.wave===0&&b.traps<2)return B+`Press <kbd>2</kbd> for Plant thorns, then place beds on the lit trail near the nursery (N). ${2-b.traps} more bed${b.traps===1?'':'s'} will hold the first scouts.`;
  if(b.wave===0)return B+'Good beds. Press <kbd>L</kbd> or Release the wave and watch them work.';
  if(b.lv<=b.traps)return B+'The next grubs have 2 hit points. Press <kbd>3</kbd> to Reinforce a bed so it strikes for 2, then release.';
  return B+'Ready. Release the wave when you like. Thorns refill between waves.'}});
})();
