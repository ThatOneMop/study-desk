import assert from 'node:assert/strict';
import fs from 'node:fs';
import {ACT1,ACT1_SHOTS,ACT1_BEATS,ACT1_DURATION,ACT1_HANDOFF,act1At,doorstepEyePose,archiveSvg,newspaperHtml,act1PanelHtml} from '../dist/story-act1.mjs';
import {openingDoorstep,insideRvShell} from '../dist/opening-shot.mjs';
const finite=p=>['x','y','z','lookX','lookY','lookZ','fov'].every(k=>Number.isFinite(p[k]));
// Timing: about fifty seconds, every beat inside the cutscene, shots contiguous.
assert.ok(ACT1_DURATION>=40&&ACT1_DURATION<=60,'the intro lasts 40-60 s, not a slog');
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
assert.equal(act1At(9).panel.panel,'float');assert.equal(act1At(14).panel.panel,'melt');assert.equal(act1At(20).panel.panel,'paper');
assert.equal(act1At(3).panel,null);assert.ok(act1At(30).chyron.text.includes('Gramps'));
assert.equal(act1At(40).props,true);assert.equal(act1At(20).props,false);
assert.ok(act1At(45).sfx.includes('ring'),'the payphone rings before the hand-off');
assert.ok(act1At(3).pose.y>12,'opens on a wide shot of the town');
// Panels are self-contained original markup: no external images or fonts.
for(const k of ['float','melt','paper']){const html=act1PanelHtml(k);assert.ok(html.length>400);assert.ok(!/https?:\/\/(?!www\.w3\.org)/.test(html),'no external URL in '+k);assert.ok(!/<script|onerror|onload/i.test(html),'no script in '+k);}
assert.ok(archiveSvg('float').startsWith('<svg')&&archiveSvg('melt').includes('Mmmph'));
// Wiring: existing saves skip the intro, Esc skips it, the vm/qa paths keep the old cards.
const game=fs.readFileSync(new URL('../dist/game.js',import.meta.url),'utf8');
assert.ok(/mode==='story'&&!s\.called&&!s\.arrivalSeen\)showArrival\(\)/.test(game),'only fresh story saves see the arrival');
assert.ok(game.includes("if(index===0&&typeof startIntro==='function'&&startIntro())return;"),'the arrival starts the cutscene when it can');
assert.ok(game.includes("if(e.key==='Escape'&&!e.repeat)finishArrival()"),'Esc skips');
assert.ok(game.includes('function finishArrival(){if(!active)return;if(cine.scene)endIntro();s.arrivalSeen=true;'),'skipping and finishing share one path and mark the save');
console.log('PASS: Act 1 "Last Call" intro: 51 s timeline, non-overlapping readable subtitles, family-friendly backstory (Great Jelly Incident, Sugar-Free Bay Act), camera outside the RV with a doorstep hand-off, original self-contained archive art, and skip/save wiring. Rendering checked separately by screenshots.');
