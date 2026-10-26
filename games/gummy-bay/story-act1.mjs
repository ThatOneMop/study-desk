import {createTimeline} from './cinematics.mjs?v=129';
import {NAMED_LOOKS} from './people-kit.mjs?v=146';
// Act 1 "Last Call": the backstory cutscene that opens a new story save.
// v149: fully in-engine. The people-kit cast acts every beat (Gramps Gus at his candy
// stall, Mayor Plum at the parade podium as the giant gummy bear melts, the Sugar Squad
// arresting Gramps, you walking up to the camper) with authored camera moves, a sepia
// flashback grade, a title card, wipes, score stingers, ambience and blip voices.
// Everything is original: script, people, props and sound. DOM-free and testable.

export const ACT1_TITLE='Act 1 · Last Call';
const H=Math.PI/2;

// 3D camera shots. `minutes` is the time of day the world is lit for during the shot.
export const ACT1_SHOTS=Object.freeze([
 {id:'evening',duration:5.2,minutes:17*60+20,cam:[[-62,24,98],[-47,20.5,80],[-33,18,64]],look:[[6,2,-30],[8,2,-38],[10,2,-46]],fov:[54,50],ease:'inOutSine',fadeIn:.6},
 {id:'stall-wide',duration:3.4,minutes:10*60+30,cam:[[4.5,2.8,27],[2.8,2.5,24],[1.5,2.3,21.5]],look:[[-9.5,1.4,17.5],[-9.6,1.35,17.2],[-9.6,1.3,17]],fov:[46,42],ease:'inOutSine',drift:.03},
 {id:'stall-close',duration:3.2,minutes:10*60+30,cam:[[-6.3,1.95,19.2],[-6.8,1.9,18.6]],look:[[-10.4,1.45,16.9],[-10.4,1.48,16.95]],fov:[38,33],ease:'inOutSine',drift:.02},
 {id:'parade-wide',duration:3.6,minutes:13*60+30,cam:[[-2.6,1.35,25],[-1.8,1.55,22.5]],look:[[0,3.7,9],[0,3.4,9.5]],fov:[50,45],ease:'inOutSine',drift:.03},
 {id:'parade-melt',duration:4.6,minutes:14*60+30,cam:[[3.4,2.15,17.6],[2.2,1.95,15.9]],look:[[-.3,2.5,10.5],[-.2,2.2,11.2]],fov:[44,37],ease:'inOutSine',drift:.035},
 {id:'paper',duration:1.8,minutes:14*60+30,cam:[[2,4,20],[2,9,30]],look:[[0,3,8],[0,3,8]],fov:50,ease:'outCubic'},
 {id:'squad-walk',duration:2.8,minutes:17*60+50,cam:[[-3.2,2.0,2.4],[-4.4,1.9,8.4]],look:[[-7.6,1.5,14],[-9.6,1.4,16.8]],fov:[46,42],ease:'linear',drift:.05},
 {id:'arrest-close',duration:2.4,minutes:17*60+50,cam:[[-6.6,1.9,19.9],[-7.0,1.88,19.3]],look:[[-10.4,1.6,16.8],[-10.4,1.65,16.9]],fov:[40,34],ease:'inOutSine',drift:.03},
 {id:'arrest-wide',duration:2.6,minutes:17*60+50,cam:[[3.2,3.2,22.5],[2.6,3.0,20.5]],look:[[-6.8,1.3,14.2],[-5.2,1.3,12.6]],fov:[48,46],ease:'inOutSine',fadeOut:.25},
 {id:'camp',duration:3.8,minutes:9*60+20,cam:[[-34,5.5,35],[-40.5,3.0,33.5]],look:[[-40,1.3,26.8],[-49,1.3,28.4]],fov:[48,44],ease:'inOutSine',fadeIn:.35},
 {id:'table',duration:2.6,minutes:9*60+20,cam:[[-55,2.5,38.2],[-56.75,1.95,36.45]],look:[[-58.1,.9,34.5],[-57.8,.82,34.8]],fov:[42,38],ease:'inOutSine'},
 {id:'payphone',duration:2.6,minutes:9*60+20,cam:[[-50.8,2.3,34.6],[-52.1,1.95,30.6],[-52.6,1.76,28.5]],look:[[-46.6,1.5,31.4],[-46.8,1.45,30.9],[-47,1.4,30.5]],fov:[46,50],ease:'inOutSine'}
]);
export const ACT1=createTimeline(ACT1_SHOTS);
export const ACT1_DURATION=ACT1.duration;
// The last stretch blends from the payphone shot into the player's own eyes.
export const ACT1_HANDOFF=.9;
// v148: the skip hint shows for the first few seconds; Esc must be held this long.
export const ACT1_SKIP_HINT=3;
export const ACT1_SKIP_HOLD=.6;
const FLASH=[5.2,29.6];

// Timed beats. kind: sub (speaker + line), cap (location card), title (big title card),
// panel (2D insert), chyron (news strap with a portrait), sfx (one-shot sound), music
// (score stinger), amb (ambience bed), grade (sepia flashback look), wipe (transition),
// quiet (hide today's crowds and traffic during the flashback), props (camp table set).
export const ACT1_BEATS=Object.freeze([
 {at:.3,until:4.9,kind:'title',title:'GUMMY BAY',line:'Act 1 · Last Call'},
 {at:.6,until:5,kind:'sub',who:'BAY BUGLE RADIO',text:'Good evening, Gummy Bay! Warm, breezy and, as always, sugar-free.'},
 {at:.2,until:.8,kind:'music',music:'title'},
 {at:0,until:5.2,kind:'amb',amb:'town'},
 {at:4.95,until:5.45,kind:'wipe',wipe:'in'},
 {at:FLASH[0],until:FLASH[1],kind:'grade',grade:'sepia'},
 {at:FLASH[0],until:FLASH[1],kind:'quiet'},
 {at:5.2,until:5.8,kind:'music',music:'flashback'},
 {at:5.2,until:11.8,kind:'amb',amb:'morning'},
 {at:5.4,until:8.4,kind:'cap',title:'THIRTY YEARS AGO',line:'Main Street · Summer 1996'},
 {at:5.4,until:8.5,kind:'sub',who:'BAY BUGLE RADIO',text:'Thirty years ago, Gramps Gus ran the sweetest candy stall in the bay.'},
 {at:8.7,until:11.7,kind:'sub',who:'GRAMPS GUS',text:'One for you, one for you… and one for the road!'},
 {at:11.8,until:12.4,kind:'music',music:'parade'},
 {at:11.8,until:20,kind:'amb',amb:'crowd'},
 {at:11.9,until:15.3,kind:'sub',who:'MAYOR PRUDENCE PLUM',text:'Welcome, one and all, to the Sweet Summer Parade!'},
 {at:15.4,until:16,kind:'music',music:'uhoh'},
 {at:15.5,until:18,kind:'sub',who:'BAY BUGLE RADIO',text:'Then the heatwave hit: the Great Jelly Incident.'},
 {at:18.1,until:19.9,kind:'sub',who:'MAYOR PRUDENCE PLUM',text:'I’m stuck! This town is going SUGAR-FREE!'},
 {at:18.2,until:18.6,kind:'sfx',sfx:'stamp'},
 {at:20,until:21.8,kind:'panel',panel:'paper'},
 {at:20,until:20.6,kind:'sfx',sfx:'whoosh'},
 {at:20,until:21.8,kind:'sub',who:'BAY BUGLE RADIO',text:'Sugar-Free Bay Act: candy is contraband.'},
 {at:21.8,until:22.4,kind:'music',music:'squad'},
 {at:20,until:29.6,kind:'amb',amb:'town'},
 {at:21.9,until:24.5,kind:'sub',who:'INSPECTOR HARDTACK',text:'Sugar Squad! Step away from the gummies, Gus!'},
 {at:24.7,until:26.9,kind:'sub',who:'GRAMPS GUS',text:'They’re for personal morale!'},
 {at:27,until:29.6,kind:'chyron',head:'BREAKING',text:'Local candy maker “Gramps Gus” nabbed with 3,000 gummies',portrait:'gramps'},
 {at:27.1,until:29.5,kind:'sub',who:'BAY BUGLE RADIO',text:'Gramps Gus was caught with three thousand gummies.'},
 {at:27,until:28,kind:'sfx',sfx:'siren'},
 {at:29.35,until:29.85,kind:'wipe',wipe:'out'},
 {at:29.6,until:38.6,kind:'props'},
 {at:29.6,until:30.2,kind:'music',music:'tender'},
 {at:29.6,until:38.6,kind:'amb',amb:'morning'},
 {at:29.8,until:33.2,kind:'cap',title:'DRIFTWOOD CAMPSITE',line:'The next morning · 9:00 AM'},
 {at:29.8,until:33.3,kind:'sub',who:'',text:'He left you his camper, a recipe tin and four hundred dollars.'},
 {at:33.6,until:35.9,kind:'sub',who:'THE NOTE',text:'“Keep the lights on, kid. —G”'},
 {at:35.6,until:38.6,kind:'sfx',sfx:'ring'},
 {at:36.1,until:38.4,kind:'sub',who:'',text:'Somewhere close by, a payphone starts to ring.'}
]);

// The cast. Paths are [t, x, z, yaw?] in world metres; yaw faces +z at 0 (people-kit).
// acts: [from, to, gesture]; moods: [from, mood]; who: subtitle speakers they lip-sync.
export const ACT1_CAST=Object.freeze({
 props:[
  {kind:'stall',x:-9.5,z:17,yaw:H,show:FLASH},
  {kind:'podium',x:0,z:12,yaw:0,show:[11.8,20]},
  {kind:'bear',x:0,z:7.6,yaw:0,scale:1.15,show:[11.8,20],melt:[15.6,19.2]},
  {kind:'van',x:-3.2,z:11.2,yaw:0,show:[21.8,29.6]}
 ],
 actors:[
  {id:'gramps',look:'gramps',who:['GRAMPS'],show:[[5.2,11.8],[21.8,29.6]],
   path:[[5.2,-10.4,17,H],[27.2,-10.4,17,H],[27.9,-10.4,15.0],[28.6,-8.0,13.7],[29.6,-5.2,12.6]],
   acts:[[5.5,8.3,'wave'],[9.1,11.4,'give'],[24.3,27.2,'handsUp'],[27.2,29.6,'cuffed']],moods:[[5.2,'cheery'],[22,'wide'],[24.3,'worried']]},
  {id:'kid1',look:'kid:12',show:[5.2,11.8],path:[[5.2,-7.6,9.5],[7.6,-8.1,16.1,-H]],acts:[[10.1,11.8,'cheer']],mood:'cheery',moods:[[5.2,'friendly'],[9.8,'cheery']]},
  {id:'kid2',look:'kid:31',who:['KID'],show:[5.2,11.8],path:[[5.2,-6.0,24.5],[7.9,-8.0,17.9,-H]],acts:[[10.5,11.8,'cheer']],mood:'cheery'},
  {id:'passer',look:'folk:44',show:[5.2,11.8],path:[[5.2,-6.4,27.5],[11.8,-6.6,4]]},
  {id:'mayor',look:'mayor prudence',who:['MAYOR','PLUM'],show:[11.8,20],y:.4,path:[[11.8,0,11.9,0]],
   acts:[[12.1,14.9,'wave'],[16.3,18.0,'stuck'],[18.1,19.9,'bang']],moods:[[11.8,'cheery'],[15.7,'worried'],[16.6,'wide'],[18.1,'stern']]},
  ...[[-2.8,18.2,3],[-1.1,19.1,8],[.9,18.5,15],[2.7,19.4,22],[-.2,20.4,27]].map(([x,z,n],i)=>({id:'crowd'+i,look:(i===2?'kid:':'folk:')+n,show:[11.8,20],path:[[11.8,x,z,Math.PI+x*.05]],
   acts:[[12+i*.15,15+i*.1,i%2?'clap':'cheer'],[16.6+i*.2,19.8,i%2?'handsUp':'shrug']],moods:[[11.8,'cheery'],[16.4,'wide']]})),
  {id:'hank',look:'hank hardtack',who:['HARDTACK'],show:[21.8,29.6],path:[[21.8,-5.0,4.6],[24.0,-7.5,14.4],[24.5,-7.7,15.3,-1.04],[27.3,-7.7,15.3],[29.6,-4.3,11.4]],
   acts:[[22.2,24.5,'point'],[24.5,27.0,'hold']],mood:'stern'},
  {id:'officer1',look:'police:5',show:[21.8,29.6],path:[[21.8,-3.6,3.6],[24.3,-8.4,14.0],[24.8,-8.6,14.3,-.6],[27.3,-8.6,14.3],[29.6,-5.9,11.6]],mood:'stern',acts:[[25,27,'fold']]},
  {id:'officer2',look:'police:9',show:[21.8,29.6],path:[[21.8,-6.4,5.2],[24.6,-8.2,20.4],[25.1,-8.4,20.6,-2.1],[27.6,-8.4,20.6],[29.6,-7.0,15.0]],mood:'grumpy'},
  {id:'onlooker',look:'folk:23',show:[22.5,29.6],path:[[22.5,-6.2,24.5,-2.6]],acts:[[25,29.4,'handsUp']],mood:'wide'},
  {id:'player',look:'player',show:[29.6,33.4],path:[[29.6,-41,26.2],[33.4,-50.2,28.4]],mood:'friendly'}
 ]
});

export function act1At(seconds){
 const t=Math.max(0,Math.min(ACT1_DURATION,Number.isFinite(seconds)?seconds:0));
 const at=ACT1.at(t),beats=ACT1_BEATS.filter(b=>t>=b.at&&t<b.until),pick=k=>beats.filter(b=>b.kind===k).pop()||null;
 const wipe=pick('wipe'),title=pick('title');
 return {...at,time:t,done:Number.isFinite(seconds)&&seconds>=ACT1_DURATION,minutes:at.shot.minutes,
  sub:pick('sub'),cap:pick('cap'),title,titleIn:title?Math.min(1,(t-title.at)/.6,(title.until-t)/.5):0,skipHint:t<ACT1_SKIP_HINT,panel:pick('panel'),chyron:pick('chyron'),props:!!pick('props'),
  sfx:beats.filter(b=>b.kind==='sfx').map(b=>b.sfx),music:beats.filter(b=>b.kind==='music').map(b=>b.music),amb:pick('amb')?.amb||'',
  grade:pick('grade')?.grade||'',quiet:!!pick('quiet'),wipe:wipe?{dir:wipe.wipe,p:(t-wipe.at)/(wipe.until-wipe.at)}:null,
  handoff:Math.max(0,Math.min(1,(t-(ACT1_DURATION-ACT1_HANDOFF))/ACT1_HANDOFF))};
}

// The player's eye at the doorstep, as a look-at pose for the hand-off blend.
export function doorstepEyePose(step,fov=50){
 const yaw=Number.isFinite(step?.yaw)?step.yaw:-Math.PI/2,x=step?.x??-52.6,y=step?.y??1.72,z=step?.z??28.2;
 return {x,y,z,lookX:x-Math.sin(yaw)*10,lookY:y,lookZ:z-Math.cos(yaw)*10,fov};
}

// ---- Archive art: original procedural SVG, sepia newsreel style. ----
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function townHall(){
 let cols='';for(let i=0;i<6;i++)cols+=`<rect x="${352+i*52}" y="214" width="20" height="150" fill="#d9c7a4" stroke="#6b5539" stroke-width="2"/>`;
 return `<g><rect x="320" y="364" width="340" height="18" fill="#c9b48e" stroke="#6b5539" stroke-width="2"/><rect x="300" y="382" width="380" height="16" fill="#bea983" stroke="#6b5539" stroke-width="2"/>
 <rect x="334" y="198" width="312" height="18" fill="#cdb995" stroke="#6b5539" stroke-width="2"/>${cols}
 <path d="M320 198 L490 120 L660 198 Z" fill="#d6c39f" stroke="#6b5539" stroke-width="3"/><circle cx="490" cy="166" r="20" fill="#f3e7cc" stroke="#6b5539" stroke-width="3"/><path d="M490 166 L490 152 M490 166 L500 170" stroke="#4a3a28" stroke-width="3"/>
 <text x="490" y="212" font-size="13" text-anchor="middle" fill="#5a4630" font-family="Georgia,serif" letter-spacing="3">TOWN HALL</text></g>`;
}
function crowd(y,n,seed){let s='';for(let i=0;i<n;i++){const x=40+i*(920/n)+((i*37+seed)%13),h=34+((i*53+seed)%18);s+=`<g fill="#3c2f22"><circle cx="${x}" cy="${y-h}" r="9"/><rect x="${x-10}" y="${y-h+8}" width="20" height="${h-6}" rx="8"/></g>`;}return s;}
function bear(cx,base,scale,melt){
 const k=scale,sag=melt?1:0;
 const body=melt
  ?`<path d="M${cx-170*k} ${base} C${cx-160*k} ${base-90*k} ${cx-90*k} ${base-120*k} ${cx} ${base-118*k} C${cx+100*k} ${base-120*k} ${cx+170*k} ${base-80*k} ${cx+190*k} ${base} Z" fill="#e8555d" stroke="#7a1f26" stroke-width="4"/>`
  :`<ellipse cx="${cx}" cy="${base-110*k}" rx="${92*k}" ry="${112*k}" fill="#e8555d" stroke="#7a1f26" stroke-width="4"/>`;
 const headY=base-(melt?150:250)*k,headX=cx+(melt?40*k:0);
 const head=`<g transform="rotate(${melt?18:0} ${headX} ${headY})"><circle cx="${headX-52*k}" cy="${headY-52*k}" r="${26*k}" fill="#e8555d" stroke="#7a1f26" stroke-width="4"/><circle cx="${headX+52*k}" cy="${headY-52*k}" r="${26*k}" fill="#e8555d" stroke="#7a1f26" stroke-width="4"/>
  <ellipse cx="${headX}" cy="${headY}" rx="${74*k}" ry="${melt?54*k:66*k}" fill="#ee6269" stroke="#7a1f26" stroke-width="4"/>
  ${melt?`<path d="M${headX-34*k} ${headY-8*k} q10 8 20 0 M${headX+14*k} ${headY-8*k} q10 8 20 0" stroke="#4a1218" stroke-width="5" fill="none"/>`:`<circle cx="${headX-26*k}" cy="${headY-10*k}" r="${7*k}" fill="#4a1218"/><circle cx="${headX+26*k}" cy="${headY-10*k}" r="${7*k}" fill="#4a1218"/>`}
  <path d="M${headX-24*k} ${headY+20*k} Q${headX} ${headY+(melt?28:40)*k} ${headX+24*k} ${headY+20*k}" stroke="#4a1218" stroke-width="5" fill="none"/>
  <ellipse cx="${headX-30*k}" cy="${headY-30*k}" rx="${16*k}" ry="${9*k}" fill="#ffffff66"/></g>`;
 const arms=melt?'':`<ellipse cx="${cx-96*k}" cy="${base-140*k}" rx="${26*k}" ry="${44*k}" transform="rotate(-38 ${cx-96*k} ${base-140*k})" fill="#e8555d" stroke="#7a1f26" stroke-width="4"/><ellipse cx="${cx+96*k}" cy="${base-140*k}" rx="${26*k}" ry="${44*k}" transform="rotate(38 ${cx+96*k} ${base-140*k})" fill="#e8555d" stroke="#7a1f26" stroke-width="4"/>`;
 let drips='';if(melt)for(let i=0;i<9;i++){const x=cx-150*k+i*38*k,l=18+((i*29)%40);drips+=`<path d="M${x-8} ${base-4} q8 ${l} 16 0" fill="#e8555d" stroke="#7a1f26" stroke-width="3"/>`;}
 return `<g opacity="${sag?1:1}">${arms}${body}${head}${drips}</g>`;
}
function filmFrame(inner,label){
 let sprockets='';for(let i=0;i<9;i++)sprockets+=`<rect x="14" y="${30+i*58}" width="18" height="30" rx="4" fill="#120d08"/><rect x="968" y="${30+i*58}" width="18" height="30" rx="4" fill="#120d08"/>`;
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${esc(label)}">
 <defs><radialGradient id="a1v" cx="50%" cy="48%" r="70%"><stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#1a1006" stop-opacity=".75"/></radialGradient>
 <filter id="a1s"><feColorMatrix type="matrix" values=".8 .24 .06 0 .03  .2 .72 .1 0 .02  .12 .2 .5 0 .01  0 0 0 1 0"/></filter></defs>
 <rect width="1000" height="560" fill="#2a1f14"/><g filter="url(#a1s)"><rect x="46" y="0" width="908" height="560" fill="#efe1c2"/>${inner}</g>
 <rect x="46" y="0" width="908" height="560" fill="url(#a1v)"/><path d="M220 0 L214 560 M731 0 L736 560" stroke="#fff6" stroke-width="1.5"/>${sprockets}
 <text x="910" y="40" font-size="18" text-anchor="end" fill="#fff3d6cc" font-family="Courier New,monospace">${esc(label)}</text></svg>`;
}
export function archiveSvg(kind){
 if(kind==='melt'){
  const inner=`<rect x="46" y="398" width="908" height="162" fill="#d8c59f"/>${townHall()}
  ${bear(500,400,1.05,true)}
  <path d="M330 398 C380 430 620 432 690 398 L720 470 L280 470 Z" fill="#e8555d" stroke="#7a1f26" stroke-width="4"/>
  <g><rect x="700" y="318" width="64" height="84" fill="#8a6a46" stroke="#4a3a28" stroke-width="3"/><circle cx="732" cy="286" r="18" fill="#e9cfae" stroke="#4a3a28" stroke-width="3"/><path d="M712 300 h40 v22 h-40 z" fill="#5d4a6e"/><path d="M700 330 q34 22 64 0" stroke="#e8555d" stroke-width="10" fill="none"/>
  <path d="M722 282 q10 -6 20 0" stroke="#4a3a28" stroke-width="3" fill="none"/><text x="784" y="268" font-size="18" fill="#4a3a28" font-family="Georgia,serif" font-style="italic">“Mmmph!”</text></g>
  ${crowd(548,15,7)}<text x="80" y="64" font-size="30" fill="#3a2b1c" font-family="Georgia,serif" font-style="italic" font-weight="700">The Great Jelly Incident</text>`;
  return filmFrame(inner,'BAY BUGLE NEWSREEL · 1996');
 }
 const inner=`<rect x="46" y="398" width="908" height="162" fill="#d8c59f"/>${townHall()}
 <g><rect x="250" y="402" width="420" height="44" rx="8" fill="#a98b62" stroke="#5a4630" stroke-width="3"/><circle cx="300" cy="452" r="22" fill="#4a3a28"/><circle cx="620" cy="452" r="22" fill="#4a3a28"/>
 <path d="M250 402 l20 -16 h380 l20 16" fill="#c4a77c" stroke="#5a4630" stroke-width="3"/></g>
 ${bear(460,392,1,false)}
 <g><path d="M120 120 Q300 150 480 110" stroke="#5a4630" stroke-width="3" fill="none"/><rect x="150" y="128" width="300" height="38" fill="#f6ecd4" stroke="#5a4630" stroke-width="3" transform="rotate(-3 300 147)"/>
 <text x="300" y="155" font-size="20" text-anchor="middle" fill="#5a4630" font-family="Georgia,serif" font-weight="700" transform="rotate(-3 300 147)">SWEET SUMMER PARADE</text></g>
 <g fill="#fff6dc"><circle cx="840" cy="96" r="44"/></g><g stroke="#fff6dc" stroke-width="5">${Array.from({length:8},(_,i)=>{const a=i*Math.PI/4;return `<path d="M${840+Math.cos(a)*58} ${96+Math.sin(a)*58} L${840+Math.cos(a)*76} ${96+Math.sin(a)*76}"/>`;}).join('')}</g>
 <text x="840" y="170" font-size="15" text-anchor="middle" fill="#5a4630" font-family="Courier New,monospace">41°C</text>
 ${crowd(548,15,3)}<text x="80" y="236" font-size="20" fill="#3a2b1c" font-family="Georgia,serif" font-style="italic">40,000 gummies.</text><text x="80" y="262" font-size="20" fill="#3a2b1c" font-family="Georgia,serif" font-style="italic">One very hot afternoon.</text>`;
 return filmFrame(inner,'BAY BUGLE NEWSREEL · 1996');
}

// ---- People-kit portraits: the same named looks the 3D cast wears (v146 kit). ----
const hx=c=>'#'+(Number(c)>>>0).toString(16).padStart(6,'0').slice(-6);
export function act1PortraitSvg(key,{label='',mug=false}={}){
 const l=NAMED_LOOKS[key];if(!l)return '';
 const skin=hx(l.skin),hair=hx(l.hair),top=hx(l.top),inner=hx(l.inner??0xf1e7cf),beard=hx(l.beardColor??l.hair),ink='#2a1d18';
 let hairBack='',hairFront='';
 if(l.hairStyle==='bob')hairBack=`<path d="M30 58 Q30 20 60 20 Q90 20 90 58 L90 74 L78 74 L78 46 L42 46 L42 74 L30 74 Z" fill="${hair}"/>`,hairFront=`<path d="M38 44 Q46 26 72 30 Q84 34 84 46 Q64 36 38 44 Z" fill="${hair}"/>`;
 else if(l.hairStyle==='combover')hairFront=`<path d="M36 40 Q50 26 80 34 L82 40 Q60 32 38 44 Z" fill="${hair}"/><path d="M33 46 q-4 10 2 18 M87 46 q4 10 -2 18" stroke="${hair}" stroke-width="7" stroke-linecap="round" fill="none"/>`;
 else hairFront=`<path d="M36 44 Q40 22 60 22 Q82 22 84 44 Q60 32 36 44 Z" fill="${hair}"/>`;
 const glasses=(l.eyewear??0)===1?`<g fill="none" stroke="${ink}" stroke-width="2.4"><circle cx="50" cy="56" r="7"/><circle cx="70" cy="56" r="7"/><path d="M57 56 h6"/></g>`:'';
 const beardSvg=l.beard==='full'?`<path d="M38 62 Q40 92 60 94 Q80 92 82 62 Q74 74 60 72 Q46 74 38 62 Z" fill="${beard}"/>`:l.beard==='moustache'?`<path d="M48 70 q12 -8 24 0 q-12 4 -24 0 Z" fill="${beard}"/>`:'';
 const lines=mug?Array.from({length:5},(_,i)=>`<path d="M0 ${24+i*20} h120" stroke="#c9bfae" stroke-width="1.4"/><text x="4" y="${21+i*20}" font-size="7" fill="#8f826e" font-family="monospace">${6-i}′</text>`).join(''):'';
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img" aria-label="${esc(label||key)}"><rect width="120" height="120" fill="${mug?'#e9e2d2':'#d9cfbb'}"/>${lines}
 ${hairBack}<path d="M20 120 Q22 92 60 90 Q98 92 100 120 Z" fill="${top}"/><path d="M50 92 L60 106 L70 92 Z" fill="${inner}"/><rect x="52" y="78" width="16" height="14" fill="${skin}"/>
 <ellipse cx="34" cy="58" rx="5" ry="7" fill="${skin}"/><ellipse cx="86" cy="58" rx="5" ry="7" fill="${skin}"/><rect x="34" y="30" width="52" height="54" rx="20" fill="${skin}"/>
 ${hairFront}<circle cx="50" cy="56" r="3.4" fill="${ink}"/><circle cx="70" cy="56" r="3.4" fill="${ink}"/><circle cx="51" cy="55" r="1.1" fill="#fff"/><circle cx="71" cy="55" r="1.1" fill="#fff"/>
 <path d="M45 47 q5 -3 10 0 M65 47 q5 -3 10 0" stroke="${ink}" stroke-width="2.4" fill="none" stroke-linecap="round"/><ellipse cx="60" cy="64" rx="4" ry="3.4" fill="${skin}" stroke="#0002"/>
 ${glasses}${beardSvg}<path d="M53 75 q7 5 14 0" stroke="${ink}" stroke-width="2.4" fill="none" stroke-linecap="round"/>${mug?`<rect x="30" y="100" width="60" height="16" fill="#2a1d18"/><text x="60" y="112" font-size="9" text-anchor="middle" fill="#fff" font-family="monospace">BAY PD · 3000</text>`:''}</svg>`;
}
// Chyron markup, shared by the intro and story cuts.
export function act1ChyronHtml(c){
 if(!c)return '';
 const mug=c.portrait?`<i class="cine-mug">${act1PortraitSvg(c.portrait,{label:c.text,mug:true})}</i>`:'';
 return mug+'<strong>'+esc(c.head)+'</strong><span>'+esc(c.text)+'</span>';
}
// The front page, as HTML (styled in cinematics.css).
export function newspaperHtml(){
 const plum=act1PortraitSvg('mayor prudence',{label:'Mayor Prudence Plum'}).replace('<svg ','<svg class="bugle-photo" ');
 return `<article class="bugle"><header><small>Thirty years ago · Gummy Bay’s only newspaper · Price: one (1) carrot</small><h3>THE BAY BUGLE</h3></header>
 <h4>SUGAR-FREE BAY ACT PASSES</h4><p class="deck">Unlicensed sweets declared contraband · New “Sugar Squad” to patrol</p>
 <div class="cols"><figure>${plum}<figcaption>Mayor Prudence Plum, finally unstuck, signs the Act.</figcaption></figure>
 <p>After last week’s Great Jelly Incident, the town council has voted 7–0 to ban every sweet that does not carry a licence. Licences are available to nobody.</p>
 <p>“Never again,” said the mayor, who still smells faintly of raspberry. Lollipops, fudge and gummies of all kinds must be handed in by Friday.</p>
 <p>Dentists described the news as “quiet”. Inside: <b>How to tell if your neighbour is a candy maker</b>, page 4.</p></div></article>`;
}
export function act1PanelHtml(kind){return kind==='paper'?newspaperHtml():archiveSvg(kind);}
