import assert from 'node:assert/strict';
import {s1Clock,HUD_ICONS,HOTBAR_SLOTS,hotbarSlot,hotbarCounts,hotbarHTML,pushNotice,noticeKind,sleepSummary,sleepCardHTML} from '../dist/hud-s1.mjs';
import fs from 'node:fs';

// Clock: 12-hour, weekday beside it, never the old "Day 1 · Mon 09:00" readout.
assert.equal(s1Clock(1,540).clock,'9:00 AM');
assert.equal(s1Clock(1,0).clock,'12:00 AM');
assert.equal(s1Clock(1,720).clock,'12:00 PM');
assert.equal(s1Clock(3,1245).label,'8:45 PM · Wed');
assert.equal(s1Clock(8,600).short,'Mon','the week wraps');
assert.ok(s1Clock(1,1380).night&&!s1Clock(1,720).night);

// Hotbar: eight unlabelled slots on keys 1–8, every slot drawn with an icon.
assert.equal(HOTBAR_SLOTS.length,8);
assert.deepEqual(HOTBAR_SLOTS.map(s=>s.key),['1','2','3','4','5','6','7','8']);
for(const slot of HOTBAR_SLOTS)assert.match(HUD_ICONS[slot.id],/^<svg/,slot.id+' has an original inline icon');
assert.equal(hotbarSlot('2').target,'can');assert.equal(hotbarSlot('9'),null);assert.equal(hotbarSlot('Tab'),null);
const esc=v=>String(v).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const html=hotbarHTML(esc);
assert.equal((html.match(/class="slot"/g)||[]).length,8);
assert.ok(html.includes('id="cashSlotValue"')&&html.includes('id="cardSlotValue"'),'cash and card tiles are present');
assert.ok(html.includes('id="equipCan"')&&html.includes('id="equipPacks"'),'legacy equip ids survive for existing code paths');
assert.ok(!/>\s*(Bag|Can|Packs|Grow|Mix|Map)\s*</.test(html),'slots carry no visible text labels');
const counts=hotbarCounts({can:true,plants:[{phase:1},{phase:0}]},{carried:3,raw:5,loose:2});
assert.equal(counts.packs,3);assert.equal(counts.can,1);assert.equal(counts.supplies,5);assert.equal(counts.loose,2);assert.equal(counts.grow,1);

// Notifications: newest first, three at most, four seconds, duplicates refresh.
let list=[];
for(let i=0;i<5;i++)list=pushNotice(list,{text:'n'+i},1000+i);
assert.equal(list.length,3);assert.equal(list[0].text,'n4');
assert.equal(list[0].until,1004+4000);
const again=pushNotice(list,{text:'n4'},2000);
assert.equal(again.length,3);assert.equal(again[0].until,6000);assert.notEqual(again[0].id,list[0].id,'a refreshed notice replays its animation');
assert.equal(pushNotice(list,{text:'late'},99999).length,1,'expired notices drop out');
assert.equal(noticeKind('Police are searching the area').app,'police');
assert.equal(noticeKind('Sale complete. You earned $40').app,'cash');

// Sleep summary: earnings, deals and XP since the day started.
const view=sleepSummary({day:1,cash:400,bank:0,sold:0,xp:10},{day:2,cash:520,bank:30,sold:3,xp:40},xp=>1+Math.floor(xp/30));
assert.equal(view.earned,150);assert.equal(view.deals,3);assert.ok(view.rankUp);
const card=sleepCardHTML(view,n=>'$'+n);
assert.ok(card.includes('sleep-card')&&card.includes('xpbar')&&card.includes('rank-stamp')&&card.includes('dismissSleepCard()'));
assert.ok(!sleepCardHTML(sleepSummary({day:1,cash:0,bank:0,sold:0,xp:0},{day:2,cash:0,bank:0,sold:0,xp:5},()=>1),String).includes('rank-stamp'));

// One theme: the HUD sheet uses the specified palette and a single bundled font.
const css=fs.readFileSync(new URL('../dist/hud-s1.css',import.meta.url),'utf8');
for(const token of ['rgba(16,20,24,.55)','#5fd35f','#4aa8ff','#ff4d4d','#4d7dff','340px','620px','rotate(3deg)','.22s'])assert.ok(css.includes(token),token);
assert.ok(!/Impact|Arial/.test(css));
assert.ok(fs.existsSync(new URL('../dist/assets/fonts/nunito-latin.woff',import.meta.url))&&fs.existsSync(new URL('../dist/assets/fonts/OFL.txt',import.meta.url)));
console.log('PASS Schedule I-style HUD: clock, hotbar, notices, sleep card and theme tokens');
