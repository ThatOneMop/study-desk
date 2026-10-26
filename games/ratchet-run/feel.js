/* Ratchet Run feel: Trials-style landing calls, airtime, parcel pops and a coached first delivery. */
(function(){'use strict';const G=()=>window.RRGame,E=window.RatchetRun;let riding=false;
const bike=()=>{const c=document.getElementById('scene');if(!c)return null;const r=c.getBoundingClientRect();return{x:r.left+r.width*.3,y:r.top+r.height*.42}};
const art=`<svg class="art" viewBox="0 0 150 96" aria-hidden="true"><path d="M0 74q38-26 75-6t75-8v36H0z" fill="#47665a"/><circle cx="118" cy="22" r="11" fill="#e4b94e"/><g transform="translate(44 44)" fill="none" stroke="#1d3a40" stroke-width="3"><circle cx="0" cy="22" r="11"/><circle cx="40" cy="22" r="11"/><path d="M0 22l14-18h18l8 18M14 4l-4-8M32 4l3-8h6"/></g><rect x="52" y="30" width="14" height="12" rx="2" fill="#c46a3a"/><circle cx="64" cy="18" r="5" fill="#c46a3a"/><path d="M106 60l8-4" stroke="#6aa6d8" stroke-width="5" stroke-linecap="round"/></svg>`;
FeelKit({id:'ratchet-run',prefix:'rr',global:'RRFeel',title:'Ratchet Run',eyebrow:'TWO WHEELS. ONE GOOD DELIVERY.',art,
 tagline:'Ride five hand-drawn courier routes. Throttle, brake, hop and lean, keep the cargo strapped, and stop in the striped bay.',
 startLabel:'Start your shift',keys:'W/↑ throttle · S/↓ brake · A D lean · Space hop · P pause',
 pauseTitle:'Kickstand down',pauseText:'The bike waits right where you left it. Cargo is safe.',
 headerBefore:'header #help',guide:'#help',play:'#scene',tipAfter:'.route-heading',accent:'#e4b94e',accentInk:'#1d3a40',card:'#1d3a40',ink:'#f1edd7',good:'#9fd18b',root:440,tipBg:'#e4b94e22',
 colors:['#e4b94e','#6aa6d8','#c46a3a','#f1edd7'],ambient:{cut:700,vol:.12,notes:[0,4,7,9]},
 onPause:()=>{const g=G();if(!g)return;riding=!g.paused&&g.s.phase==='ride';g.pause()},onResume:()=>{if(riding)G().resume();riding=false},
 progress:()=>{const sv=G()&&G().save;const n=sv?(sv.records||[]).filter(Boolean).length:0;return n?`${n} of 5 deliveries signed`:'Five routes across the old town'},
 snap:()=>{const g=G();if(!g)return null;const s=g.s;return{course:s.course,frame:s.frame,phase:s.phase,ground:s.ground,integ:s.integrity,parcels:s.parcels.length,land:s.landings,x:s.x,v:s.v,msg:s.message,paused:g.paused,medal:E.medal(s)}},
 rules:[
  {test:(a,b)=>b.course===a.course&&b.frame>a.frame&&a.ground&&!b.ground&&b.phase==='ride',sfx:'whoosh'},
  {test:(a,b)=>b.course===a.course&&b.frame>a.frame&&!a.ground&&b.ground&&b.integ===a.integ&&b.phase==='ride',sfx:'thud',run:K=>{K.callout('CLEAN LANDING',bike(),'good');K.burst(bike(),8,['#c9b48a','#8c7a5a'])}},
  {test:(a,b)=>b.course===a.course&&b.frame>a.frame&&b.integ<a.integ&&b.phase!=='lost',sfx:'bad',run:(K,a,b)=>{K.shake();K.flash('#ff8a5a');K.callout(/landing/i.test(b.msg)?'HARD LANDING · STRAP SNAPPED':'CARGO SHAKEN',bike(),'bad')}},
  {test:(a,b)=>b.course===a.course&&b.frame>a.frame&&b.parcels>a.parcels,sfx:'coin',run:(K,a,b)=>{K.burst(bike(),16,['#6aa6d8','#f1edd7']);K.callout(`PARCEL ${b.parcels}/${E.COURSES[b.course].parcels.length}`,bike(),'good')}},
  {test:(a,b)=>a.phase==='ride'&&b.phase==='won',sfx:'win',run:(K,a,b)=>{K.callout('★'.repeat(b.medal)+' DELIVERED','#scene','good big');for(let i=0;i<4;i++)setTimeout(()=>K.burst('#scene',24),i*170)}},
  {test:(a,b)=>a.phase==='ride'&&b.phase==='lost',sfx:'lose',run:K=>{K.shake();K.flash('#ff6b4a');K.callout('BIKE DOWN','#scene','bad big')}},
  {test:(a,b)=>a.paused&&!b.paused&&b.phase==='ride',sfx:'good'}],
 tip:b=>{if(!b||b.course!==0||b.phase!=='ride')return'';const B='<b>DISPATCH</b> · ',end=E.COURSES[0].end;
  if(b.frame===0)return B+'Press Ride (or click it), then hold <kbd>W</kbd> / ↑ to pedal. The first hill is gentle: no hop needed.';
  if(b.x<end-260)return B+'Keep a steady pace. Tap <kbd>Space</kbd> on the crest to try for the blue parcel.';
  if(b.x<end-45)return B+(b.v>28?'Bay ahead: hold <kbd>S</kbd> / ↓ now to slow below 28.':'Nice and slow. Roll into the striped bay.');
  return B+'Stop inside the stripes to sign the delivery.'}});
})();
