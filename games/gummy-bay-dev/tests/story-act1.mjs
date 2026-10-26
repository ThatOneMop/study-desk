import assert from 'node:assert/strict';
import fs from 'node:fs';
import {ACT1_CAST,ACT1,ACT1_SHOTS,ACT1_BEATS,ACT1_DURATION,ACT1_HANDOFF,ACT1_SKIP_HINT,ACT1_SKIP_HOLD,act1At,act1ChyronHtml,act1PortraitSvg,doorstepEyePose,archiveSvg,newspaperHtml,act1PanelHtml} from '../dist/story-act1.mjs';
import {openingDoorstep,insideRvShell} from '../dist/opening-shot.mjs';
import {resolveCast,castAt,propsAt,GESTURES,PROP_KINDS,STINGERS} from '../dist/cine-cast.mjs';
const finite=p=>['x','y','z','lookX','lookY','lookZ','fov'].every(k=>Number.isFinite(p[k]));
// Timing (v149): a 30-40 s in-engine cinematic, every beat inside the cutscene, shots contiguous.
assert.ok(ACT1_DURATION>=30&&ACT1_DURATION<=40,'the intro lasts 30-40 s, not a slog');
assert.ok(ACT1_SHOTS.length>=10,'real cutting: at least 10 authored shots');
// No dead air: some line or title card is on screen for at least 85% of the intro.
{let quiet=0;for(let t=0;t<ACT1_DURATION;t+=.1){const at=act1At(t);if(!at.sub&&!at.cap&&!at.title)quiet+=.1;}assert.ok(quiet<ACT1_DURATION*.15,'dead air '+quiet.toFixed(1)+' s');}
assert.equal(ACT1.shots.length,ACT1_SHOTS.length);
for(const b of ACT1_BEATS){assert.ok(b.at>=0&&b.until>b.at&&b.until<=ACT1_DURATION+.01,'beat inside the intro: '+JSON.stringify(b));}
// Subtitles never overlap, so one line is always readable.
const subs=ACT1_BEATS.filter(b=>b.kind==='sub').sort((a,b)=>a.at-b.at);
for(let i=1;i<subs.length;i++)assert.ok(subs[i].at>=subs[i-1].until,'subtitles do not overlap: '+subs[i].text);
// Every subtitle stays readable at about 17 characters per second.
for(const b of subs)assert.ok(b.text.length/(b.until-b.at)<=24,'subtitle on screen long enough: '+b.text);
// The script explains why gummies are illegal and stays family-friendly.
const script=ACT1_BEATS.map(b=>[b.text,b.title,b.line,b.head].filter(Boolean).join(' ')).join(' ')+newspaperHtml();
for(const need of ['Great Jelly Incident','Sugar-Free Bay Act','contraband','Sugar Squad','Prudence Plum','Gramps','four hundred dollars','Keep the lights on, kid','payphone'])assert.ok(script.includes(need)||archiveSvg('melt').includes(need),'script mentions '+need);
for(const bad of [/\bgun/i,/blood/i,/\bkill/i,/\bdrug/i,/weed|cannabis|marijuana/i,/casino|gambl/i,/\bdead\b/i])assert.ok(!bad.test(script),'family-friendly: '+bad);
// Camera: finite poses everywhere, never inside the camper shell, hand-off lands on the doorstep eye.
for(let t=0;t<=ACT1_DURATION;t+=.25){const at=act1At(t);assert.ok(finite(at.pose),'finite pose at '+t);assert.ok(!insideRvShell(at.pose.x,at.pose.z),'camera outside the RV at '+t);assert.ok(at.pose.y>.5&&at.pose.y<60,'camera height at '+t);assert.ok(at.minutes>=0&&at.minutes<1440);}
const eye=doorstepEyePose(openingDoorstep(),50),step=openingDoorstep();
assert.deepEqual([eye.x,eye.y,eye.z],[step.x,step.y,step.z]);
assert.ok(eye.lookX>eye.x+9,'doorstep eye looks toward Main Street (+X)');
assert.ok(act1At(ACT1_DURATION).handoff>.9999);assert.equal(act1At(ACT1_DURATION-ACT1_HANDOFF-.01).handoff,0);
const last=act1At(ACT1_DURATION-ACT1_HANDOFF).pose;assert.ok(Math.hypot(last.x-eye.x,last.z-eye.z)<2.5,'the payphone shot ends close to the doorstep, so the blend is short');
assert.equal(act1At(ACT1_DURATION+1).done,true);assert.equal(act1At(10).done,false);
// Beats resolve as expected.
assert.equal(act1At(21).panel.panel,'paper');assert.equal(act1At(6).panel,null);assert.equal(act1At(16).panel,null,'the parade and melt are acted in 3D now, not panels');
assert.equal(act1At(3).panel,null);assert.ok(act1At(28).chyron.text.includes('Gramps'));
assert.equal(act1At(34).props,true);assert.equal(act1At(20).props,false);
assert.ok(act1At(37).sfx.includes('ring'),'the payphone rings before the hand-off');
assert.ok(act1At(3).pose.y>12,'opens on a wide shot of the town');
// v149 cinematic layer: title card, sepia flashback with wipes in and out, quiet streets, score and ambience.
assert.equal(act1At(2).title.title,'GUMMY BAY');assert.ok(act1At(2).titleIn>.99&&act1At(.35).titleIn<.2);
assert.equal(act1At(10).grade,'sepia');assert.equal(act1At(3).grade,'');assert.equal(act1At(32).grade,'');
assert.equal(act1At(10).quiet,true);assert.equal(act1At(32).quiet,false);
assert.equal(act1At(5.2).wipe.dir,'in');assert.equal(act1At(29.6).wipe.dir,'out');assert.equal(act1At(12).wipe,null);
for(const b of ACT1_BEATS.filter(b=>b.kind==='music'))assert.ok(STINGERS[b.music],'stinger '+b.music);
for(let t=0;t<ACT1_DURATION;t+=.5)assert.ok(act1At(t).amb,'ambience at '+t);
// The cast acts every beat: Gramps at his stall, the mayor at the podium, the arrest, you at the camper.
const cast=resolveCast(ACT1_CAST),who=(t,id)=>castAt(cast,t).find(a=>a.id===id);
assert.ok(who(9.5,'gramps')&&propsAt(cast,9.5).some(p=>p.kind==='stall'),'Gramps behind his candy stall');
assert.ok(who(9.5,'gramps').speaking===false&&castAt(cast,9.5,ACT1_BEATS.find(b=>b.who==='GRAMPS GUS')).find(a=>a.id==='gramps').speaking,'Gramps lip-syncs his line');
assert.ok(who(13,'mayor')&&who(13,'mayor').y>.3&&propsAt(cast,13).some(p=>p.kind==='podium'),'Mayor Plum on the parade podium');
assert.ok(propsAt(cast,18.5).find(p=>p.kind==='bear').melt>.7,'the gummy bear melts');
assert.ok(who(25,'hank')&&who(25,'officer1')&&Math.hypot(who(25,'hank').x-who(25,'gramps').x,who(25,'hank').z-who(25,'gramps').z)<4,'the Sugar Squad reaches Gramps');
assert.ok(who(29,'gramps').x>who(26,'gramps').x+2,'Gramps is led away');
assert.ok(who(31,'player')&&!who(34,'player'),'you walk up to the camper, then the camera becomes your eyes');
assert.ok(!castAt(cast,3).length,'no flashback cast in the present-day opener');
for(const a of ACT1_CAST.actors)for(const [,,g] of a.acts||[])assert.ok(GESTURES[g],'gesture '+g);
for(const p of ACT1_CAST.props)assert.ok(PROP_KINDS[p.kind],'prop '+p.kind);
// Panels are self-contained original markup: no external images or fonts.
for(const k of ['float','melt','paper']){const html=act1PanelHtml(k);assert.ok(html.length>400);assert.ok(!/https?:\/\/(?!www\.w3\.org)/.test(html),'no external URL in '+k);assert.ok(!/<script|onerror|onload/i.test(html),'no script in '+k);}
assert.ok(archiveSvg('float').startsWith('<svg')&&archiveSvg('melt').includes('Mmmph'));
// Wiring: existing saves skip the intro, Esc skips it, the vm/qa paths keep the old cards.
const game=fs.readFileSync(new URL('../dist/game.js',import.meta.url),'utf8');
assert.ok(/mode==='story'&&!s\.called&&!s\.arrivalSeen\)showArrival\(\)/.test(game),'only fresh story saves see the arrival');
assert.ok(game.includes("if(index===0&&typeof startIntro==='function'&&startIntro())return;"),'the arrival starts the cutscene when it can');
// v148 skip: a hint for the first 3 s, hold Esc or tap to skip.
assert.equal(ACT1_SKIP_HINT,3);assert.equal(act1At(.1).skipHint,true);assert.equal(act1At(2.9).skipHint,true);assert.equal(act1At(3.1).skipHint,false);
assert.ok(ACT1_SKIP_HOLD>=.3&&ACT1_SKIP_HOLD<=1,'a short hold, so a stray Esc does not skip');
assert.ok(game.includes('Hold <kbd>Esc</kbd> / tap to skip'),'skip hint copy');
assert.ok(game.includes("if(e.key==='Escape'&&!e.repeat&&!intro.hold)intro.hold=performance.now()")&&game.includes('if(held>=ACT1_SKIP_HOLD){intro.hold=0;finishArrival();return;}'),'holding Esc skips');
assert.ok(game.includes("addEventListener('keyup',e=>{if(e.key!=='Escape')return;const held=intro.hold?(performance.now()-intro.hold)/1000:0;intro.hold=0;if(held>=ACT1_SKIP_HOLD&&cine.scene&&active)finishArrival();},true)"),'releasing Esc early cancels; releasing after a full hold skips even between slow frames');
assert.ok(game.includes("if(tap&&cine.scene&&active)finishArrival()"),'a tap that began in the scene skips');
// People-kit looks: the Gramps mugshot and the mayor's photo use the 3D cast's colours.
const chy=act1ChyronHtml(act1At(28).chyron);assert.ok(chy.includes('cine-mug')&&chy.includes('#b84a3a')&&chy.includes('#f4f1ea'),'Gramps mugshot: red flannel, white combover and beard');
assert.ok(newspaperHtml().includes('#7a3f74')&&newspaperHtml().includes('#45311f'),'Mayor Plum photo matches her people-kit look');
assert.equal(act1PortraitSvg('nobody'),'');assert.ok(!/<script|https?:\/\/(?!www\.w3\.org)/.test(chy));
assert.ok(game.includes('cineView.chyron(act1ChyronHtml(at.chyron))'));
assert.ok(game.includes('function finishArrival(){if(!active)return;if(cine.scene)endIntro();s.arrivalSeen=true;'),'skipping and finishing share one path and mark the save');
console.log('PASS: Act 1 "Last Call" intro: '+ACT1_DURATION+' s in-engine cinematic ('+ACT1_SHOTS.length+' shots, acted by the people-kit cast, title card, sepia flashback, score) with a hold-Esc/tap skip hint and people-kit portraits, non-overlapping readable subtitles, family-friendly backstory (Great Jelly Incident, Sugar-Free Bay Act), camera outside the RV with a doorstep hand-off, original self-contained archive art, and skip/save wiring. Rendering checked separately by screenshots.');
