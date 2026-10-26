import {createTimeline} from './cinematics.mjs?v=129';
// Act 1 "Last Call": the backstory cutscene that opens a new story save.
// It explains, in about fifty seconds, why gummies are against the law in Gummy Bay,
// then gives the player the doorstep beside the ringing payphone.
// Everything is original: the script, the people and the art. The two "archive" beats
// are procedural SVG strings, so no image is downloaded. This file is DOM-free and testable.

export const ACT1_TITLE='Act 1 · Last Call';

// 3D camera shots. `minutes` is the time of day the world is lit for during the shot.
// Shot 2 sits behind the archive panels and is barely seen; it only keeps the frame alive.
export const ACT1_SHOTS=Object.freeze([
 {id:'evening',duration:7,minutes:17*60+20,cam:[[-62,24,98],[-47,20.5,80],[-33,18,64]],look:[[6,2,-30],[8,2,-38],[10,2,-46]],fov:[54,50],ease:'inOutSine',fadeIn:1.2,fadeOut:.5},
 {id:'archive',duration:18,minutes:8*60,cam:[[6,4.5,62],[5,5,52],[4,5.5,44]],look:[[-2,4,-10],[-3,4.5,-18],[-4,5,-26]],fov:50,ease:'linear',fadeIn:.4,fadeOut:.4},
 {id:'news',duration:11,minutes:17*60+40,cam:[[8,4.2,58],[6,4.6,44],[4,5,32]],look:[[-2,4,-10],[-3,4.4,-20],[-4,4.8,-30]],fov:[50,47],ease:'inOutSine',fadeIn:.5,fadeOut:.5},
 {id:'table',duration:9,minutes:9*60+20,cam:[[-52.4,3.4,41.6],[-55,2.5,38.2],[-56.75,1.95,36.45]],look:[[-58.4,1,34],[-58.1,.9,34.5],[-57.8,.82,34.8]],fov:[46,38],ease:'inOutSine',fadeIn:.5,fadeOut:.4},
 {id:'payphone',duration:6,minutes:9*60+20,cam:[[-49.5,2.6,37.5],[-51.4,2.1,33],[-52.6,1.8,29.4]],look:[[-46.6,1.5,31.4],[-46.8,1.45,30.9],[-47,1.4,30.5]],fov:[46,50],ease:'inOutSine',fadeIn:.4}
]);
export const ACT1=createTimeline(ACT1_SHOTS);
export const ACT1_DURATION=ACT1.duration;
// The last stretch blends from the payphone shot into the player's own eyes.
export const ACT1_HANDOFF=.9;

// Timed beats. kind: sub (speaker + line), cap (title card), panel (2D archive art),
// chyron (news strap), sfx (one-shot sound cue), props (show the campsite table set).
export const ACT1_BEATS=Object.freeze([
 {at:.8,until:6.6,kind:'cap',title:'GUMMY BAY',line:'Act 1 · Last Call'},
 {at:1.4,until:6.8,kind:'sub',who:'BAY BUGLE RADIO',text:'Good evening, Gummy Bay! Warm, breezy, and, as always, completely sugar-free.'},
 {at:7,until:12,kind:'panel',panel:'float'},
 {at:12,until:17,kind:'panel',panel:'melt'},
 {at:7.3,until:11.9,kind:'sub',who:'BAY BUGLE RADIO',text:'Thirty years ago this week, a local candy maker built the biggest gummy bear the world had ever seen.'},
 {at:12.1,until:16.9,kind:'sub',who:'BAY BUGLE RADIO',text:'Then came the heatwave. Mayor Prudence Plum was glued to her podium for six hours.'},
 {at:7,until:17,kind:'sfx',sfx:'film'},
 {at:17,until:25,kind:'panel',panel:'paper'},
 {at:17.4,until:24.8,kind:'sub',who:'BAY BUGLE RADIO',text:'A week later, the Sugar-Free Bay Act made every unlicensed sweet contraband. The Sugar Squad has kept the town tidy, and the dentists bored, ever since.'},
 {at:17,until:17.6,kind:'sfx',sfx:'whoosh'},
 {at:25.6,until:35.6,kind:'chyron',head:'BREAKING',text:'Local candy maker “Gramps Gus” nabbed with 3,000 gummies'},
 {at:25.8,until:30.4,kind:'sub',who:'BAY BUGLE RADIO',text:'In other news, Gramps Gus was caught this afternoon with three thousand gummy bears.'},
 {at:30.6,until:35.7,kind:'sub',who:'BAY BUGLE RADIO',text:'He says they were “for personal morale”. Nobody has seen him since.'},
 {at:36,until:45,kind:'props'},
 {at:36.6,until:41,kind:'cap',title:'DRIFTWOOD CAMPSITE',line:'The next morning · 9:00 AM'},
 {at:37,until:41,kind:'sub',who:'',text:'He left you his camper, a dented recipe tin, and four hundred dollars.'},
 {at:41.2,until:44.8,kind:'sub',who:'THE NOTE',text:'“Keep the lights on, kid. —G”'},
 {at:44.2,until:51,kind:'sfx',sfx:'ring'},
 {at:45.4,until:50,kind:'sub',who:'',text:'Somewhere close by, a payphone starts to ring.'}
]);

export function act1At(seconds){
 const t=Math.max(0,Math.min(ACT1_DURATION,Number.isFinite(seconds)?seconds:0));
 const at=ACT1.at(t),beats=ACT1_BEATS.filter(b=>t>=b.at&&t<b.until),pick=k=>beats.filter(b=>b.kind===k).pop()||null;
 return {...at,time:t,done:Number.isFinite(seconds)&&seconds>=ACT1_DURATION,minutes:at.shot.minutes,
  sub:pick('sub'),cap:pick('cap'),panel:pick('panel'),chyron:pick('chyron'),props:!!pick('props'),sfx:beats.filter(b=>b.kind==='sfx').map(b=>b.sfx),
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
// The front page, as HTML (styled in cinematics.css).
export function newspaperHtml(){
 const plum=`<svg viewBox="0 0 200 150" aria-hidden="true"><rect width="200" height="150" fill="#d9cfbb"/><rect x="54" y="88" width="92" height="62" fill="#6d6152"/><circle cx="100" cy="58" r="28" fill="#b9aa92" stroke="#3b3329" stroke-width="3"/><path d="M72 46 q28 -30 56 0" fill="#3b3329"/><path d="M88 66 q12 8 24 0" stroke="#3b3329" stroke-width="3" fill="none"/><circle cx="90" cy="54" r="3" fill="#3b3329"/><circle cx="110" cy="54" r="3" fill="#3b3329"/><rect x="40" y="118" width="120" height="10" fill="#8f826e"/><path d="M128 112 l26 -8" stroke="#3b3329" stroke-width="4"/></svg>`;
 return `<article class="bugle"><header><small>Thirty years ago · Gummy Bay’s only newspaper · Price: one (1) carrot</small><h3>THE BAY BUGLE</h3></header>
 <h4>SUGAR-FREE BAY ACT PASSES</h4><p class="deck">Unlicensed sweets declared contraband · New “Sugar Squad” to patrol</p>
 <div class="cols"><figure>${plum}<figcaption>Mayor Prudence Plum, finally unstuck, signs the Act.</figcaption></figure>
 <p>After last week’s Great Jelly Incident, the town council has voted 7–0 to ban every sweet that does not carry a licence. Licences are available to nobody.</p>
 <p>“Never again,” said the mayor, who still smells faintly of raspberry. Lollipops, fudge and gummies of all kinds must be handed in by Friday.</p>
 <p>Dentists described the news as “quiet”. Inside: <b>How to tell if your neighbour is a candy maker</b>, page 4.</p></div></article>`;
}
export function act1PanelHtml(kind){return kind==='paper'?newspaperHtml():archiveSvg(kind);}
