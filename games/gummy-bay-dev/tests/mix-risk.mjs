import assert from 'node:assert/strict';
import {recipeOutcome,stirOutcome,saleConsequences,mixedPrice,revealSummary,isBad,newMixSeed,fizzChance,stirLabel} from '../dist/mix-risk.mjs';
import {PANTRY,pantryItem,pantryIndex} from '../dist/mix-pantry.mjs';
const item=id=>pantryItem(pantryIndex(id));
// Same seed + same stir => same result, every time.
const seed=newMixSeed(42);
for(const p of PANTRY){const a=recipeOutcome(seed,['sunny'],p),b=recipeOutcome(seed,['sunny'],p);assert.deepEqual(a,b,p.id);
 const sa=stirOutcome({seed,key:a.key,ingredient:p.id,stir:1,count:4,nonce:1,item:p,effects:a.effects}),sb=stirOutcome({seed,key:a.key,ingredient:p.id,stir:1,count:4,nonce:99,item:p,effects:a.effects});
 assert.deepEqual(sa,sb,'a careful stir ignores the batch counter');
 const la=stirOutcome({seed,key:a.key,ingredient:p.id,stir:.2,count:4,nonce:7,item:p,effects:a.effects}),lb=stirOutcome({seed,key:a.key,ingredient:p.id,stir:.2,count:4,nonce:7,item:p,effects:a.effects});
 assert.deepEqual(la,lb,'same seed, stir and batch => same sloppy result');}
// Different saves can twist the same recipe differently.
const twists=new Set();for(let i=0;i<40;i++)twists.add(recipeOutcome(newMixSeed(i),['still'],item('jelly')).key);
assert.ok(twists.size>=3,'mystery jelly differs between saves');
// Sloppy stirs on risky ingredients can fizz over: Volatile flare, lose 1-3 units.
const crackle=item('crackle');let fizz=0,clean=0;
for(let n=0;n<200;n++){const o=stirOutcome({seed,key:'k',ingredient:'crackle',stir:.25,count:5,nonce:n,item:crackle});
 if(o.kind==='fizz'){fizz++;assert.equal(o.flare,'volatile');assert.ok(o.lost>=1&&o.lost<=3,'lost '+o.lost);}else clean++;}
assert.ok(fizz>20&&clean>20,`sloppy crackle fizzes sometimes (${fizz}/200)`);
assert.equal(stirOutcome({seed,key:'k',ingredient:'crackle',stir:.25,count:1,nonce:fizz?0:0,item:crackle}).lost<=1,true);
assert.equal(fizzChance(1,crackle),0,'a perfect stir never fizzes');
assert.ok(fizzChance(.25,crackle)>fizzChance(.25,item('cough')),'risky ingredients fizz more than fixers');
assert.equal(stirLabel(1),'Perfect');assert.equal(stirLabel(.25),'Sloppy');
// Sale consequences.
const pung=saleConsequences(['pungent','sunny']);assert.equal(pung.heat,8);assert.ok(pung.notes[0].includes('Pungent'));
assert.equal(saleConsequences(['luminous'],{night:true}).heat,5);assert.equal(saleConsequences(['luminous']).heat,0);
assert.equal(saleConsequences(['wary']).haggle,.1);assert.equal(saleConsequences(['scattered']).forgetPay,.1);
// Bad effects carry real negative value; price never drops below the floor.
assert.ok(isBad('volatile')&&isBad('pungent')&&!isBad('sunny'));
assert.ok(mixedPrice(42,['sunny'],['sunny','bitter'])<42);
assert.ok(mixedPrice(42,['sunny'],['sunny','tiny'])>42);
assert.equal(mixedPrice(100,['still'],['bitter','volatile','scattered','pungent']),55);
assert.equal(mixedPrice(56,['breezy'],['breezy']),56,'an unchanged recipe keeps the base price');
const r=revealSummary(['sunny'],['sunny','woozy'],42);assert.deepEqual(r.gained,['woozy']);assert.deepEqual(r.bad,['woozy']);assert.ok(r.delta<0);
// Cost does not predict value: across saves cheap ingredients can beat expensive ones, and mixes can lose money.
let negatives=0,cheapWins=0;const bases=[[30,'still'],[42,'sunny'],[56,'breezy'],[72,'zippy'],[92,'quiet'],[118,'zesty']];
for(let i=0;i<30;i++){const s=newMixSeed(i);for(const [price,e] of bases){const val=p=>mixedPrice(price,[e],recipeOutcome(s,[e],p).effects)-price;
 for(const p of PANTRY)if(val(p)<0)negatives++;
 if(val(item('dye'))>val(item('gloop')))cheapWins++;}}
assert.ok(negatives>100,`mixes can lose value (${negatives})`);assert.ok(cheapWins>10,`a $2 dye sometimes beats $8 gloop (${cheapWins})`);
console.log(`PASS: mix risk layer is seeded per save, sloppy stirs fizz over (${fizz}/200 at Sloppy on Crackle), Pungent adds heat, ${negatives} losing mixes across 30 saves.`);
