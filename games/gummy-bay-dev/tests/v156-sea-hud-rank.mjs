import assert from 'node:assert/strict';
import fs from 'node:fs';
import {RANK_TITLES,TIER_XP,rankTitle,levelOf} from '../dist/xp-curve.mjs';
import {sleepSummary,sleepCardHTML} from '../dist/hud-s1.mjs';
const game=fs.readFileSync(new URL('../dist/game.js',import.meta.url),'utf8');
// Sea: the legacy bay slab and wet-sand stripes sat within 3 cm of the ocean and showed through its swells.
assert.ok(!game.includes('box(0,-.45,128,700,.1,140,0x80bcc8)'),'legacy bay slab removed');
assert.ok(!game.includes('box(0,-.38,86+i*6,240,.02,.12,0xb6d9d8)'),'legacy wet-sand stripes removed');
assert.ok(/ocean\.position\.set\(0,-\.375,128\)/.test(game),'ocean surface still in place');
// Story cuts hide the HUD and restore it.
const css=fs.readFileSync(new URL('../dist/story.css',import.meta.url),'utf8');
assert.ok(css.includes('body.storyCutOn>:not(#view):not(#storyCut)'),'story cut hides HUD layers');
for(const hook of ["storyUI.el.dataset.cut=id;storyHud(false)","storyUI.cut=null;storyHud(true)","storyUI.el.dataset.cut='raid-choice';storyHud(false)","storyUI.el.dataset.cut='';storyHud(true)"])assert.ok(game.includes(hook),hook);
// Street ranks: 11 titles x 5 tiers, monotonic, then Kingpin keeps counting.
assert.equal(RANK_TITLES.length,11);assert.equal(TIER_XP.length,11);
for(let i=1;i<TIER_XP.length;i++)assert.ok(TIER_XP[i]>TIER_XP[i-1]);
assert.equal(rankTitle(0).label,'Sugar Rat I');assert.equal(rankTitle(NaN).label,'Sugar Rat I');assert.equal(rankTitle(10).label,'Sugar Rat II');
assert.equal(rankTitle(50).label,'Chew Peddler I');
let prev=-1;for(let xp=0;xp<5000;xp+=7){const r=rankTitle(xp);assert.ok(r.index>=prev);prev=r.index;assert.ok(r.ratio>=0&&r.ratio<=1);}
const kingpin=TIER_XP.reduce((a,b)=>a+b*5,0);assert.equal(rankTitle(kingpin).label,'Gummy Kingpin 6');
const view=sleepSummary({day:1,cash:0,bank:0,sold:0,xp:5},{day:2,cash:0,bank:0,sold:0,xp:12},levelOf);
assert.ok(view.titleUp&&view.rankUp&&view.title==='Sugar Rat II');assert.ok(sleepCardHTML(view,String).includes('Sugar Rat II · Lv 1'));
console.log('PASS: v156 sea slab gone, story cuts hide the HUD, street rank ladder');
