import assert from 'node:assert/strict';import fs from 'node:fs';
import {strainBookModel,strainBookHTML} from '../dist/strain-book.mjs';
import {PANTRY,mixedStrainIndex} from '../dist/mix-pantry.mjs';
// A tiny fake catalogue: 2 base strains, 2 ingredients → 4 mixed slots after the bases.
const base=[{name:'Pine Pop',color:0x93c35b,level:1,effects:['calm']},{name:'Lemon Fizz',color:0xe2ca63,level:2,effects:['zesty']}];
const pantry=[{name:'Sea Salt'},{name:'Chilli'}];const mix=(b,k)=>2+b*2+k;
const strains=[...base];for(let b=0;b<2;b++)for(let k=0;k<2;k++)strains[mix(b,k)]={name:'Mix '+b+k,color:0x445566,mixed:true,base:b,ingredient:k,effects:['tiny','buoyant']};
const m=strainBookModel({strains,baseCount:2,pantry,book:{[mix(0,1)]:{day:1}},unlocked:i=>i===0,names:{[mix(0,1)]:'Salty Dog'},value:i=>10+i,owned:()=>1,baseStock:i=>i===0?2:0,pantryStock:()=>1,mixedIndex:mix});
assert.equal(m.total,6);assert.equal(m.found,2);
const named=m.cards.find(c=>c.index===mix(0,1));assert.equal(named.known,true);assert.equal(named.name,'Salty Dog');assert.equal(named.value,13);assert.match(named.hint,/Pine Pop \+ chilli/);
const locked=m.cards.find(c=>c.index===1);assert.equal(locked.known,false);assert.equal(locked.name,'???');assert.equal(locked.value,null);assert.match(locked.hint,/level 2/);
assert.ok(m.cards.filter(c=>!c.known&&c.mixed).every(c=>c.name==='???'&&c.effects.length===0));
// Try-next only suggests undiscovered combos from owned, unlocked base stock.
assert.deepEqual(m.tryNext.map(t=>t.index),[mix(0,0)]);
const html=strainBookHTML(m);assert.match(html,/2 of 6 discovered/);assert.match(html,/Try next/);assert.match(html,/Pine Pop \+ sea salt/);assert.ok(!html.includes('Mix 1'));
assert.ok(!strainBookHTML(strainBookModel({strains:[{name:'<b>x'}],baseCount:1,unlocked:()=>true})).includes('<b>x'));
// Real catalogue size: 6 bases + 6 × pantry mixes.
assert.ok(mixedStrainIndex(5,PANTRY.length-1,6)>=6);
const game=fs.readFileSync(new URL('../dist/game.js',import.meta.url),'utf8');
assert.match(game,/strain-book\.mjs\?v=170/);assert.match(game,/function openStrains\(\)/);assert.match(game,/data-phone-key="strains"/);
const idx=fs.readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');assert.match(idx,/strain-book\.css\?v=170/);
console.log('PASS v170 strain book: '+m.found+'/'+m.total+' collection, silhouettes for undiscovered, try-next mixing ideas');
