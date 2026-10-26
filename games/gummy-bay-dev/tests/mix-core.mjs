import assert from 'node:assert/strict';
import {EFFECTS,INGREDIENTS,MAX_EFFECTS,NEW_RECIPE_XP,STATIONS,MIX_STATION_TIER,transformCount,roundHalfEven,productValue,addictiveness,recipeName,applyMix,batchMinutes,recipeXp} from '../dist/mix-core.mjs';

assert.equal(EFFECTS.length,34);
assert.equal(INGREDIENTS.length,16);
assert.equal(transformCount(),114);
assert.equal(MAX_EFFECTS,8);
assert.equal(NEW_RECIPE_XP,80);
assert.equal(MIX_STATION_TIER,2);
assert.deepEqual(STATIONS.mk1,{batch:10,minutesPerUnit:6});
assert.deepEqual(STATIONS.mk2,{batch:20,minutesPerUnit:3});
assert.equal(new Set(EFFECTS.map(item=>item.id)).size,34);
assert.equal(INGREDIENTS.some(item=>Object.hasOwn(item.transforms,'bright')||Object.hasOwn(item.transforms,'shambling')),false);

assert.equal(roundHalfEven(38.5),38);
assert.equal(roundHalfEven(1.5),2);
assert.equal(roundHalfEven(2.5),2);
assert.equal(productValue(35,['still']),38);
const ceiling=['tiny','shambling','looming','buoyant','lanky','sparking','luminous','thunder'];
assert.equal(Math.round(ceiling.reduce((sum,id)=>sum+EFFECTS.find(item=>item.id===id).bonus,0)*100)/100,4.24);
assert.equal(productValue(35,ceiling),183);
assert.equal(addictiveness(.05,['thunder']),Math.min(1,.05+.803));
assert.equal(addictiveness(.6,['spry','thunder']),1);

assert.deepEqual(applyMix(['still'],'peel'),['quiet','zesty']);
assert.deepEqual(applyMix(['woozy','keen'],'peel'),['woozy','jittery','zesty']);
assert.deepEqual(applyMix(['keen','woozy'],'peel'),['jittery','keen','zesty']);
assert.deepEqual(applyMix(['hearty'],'glaze'),['volatile','hearty']);
const full=['sunny','peckish','breezy','hearty','drowsy','spry','smooth','hazy'];
assert.equal(applyMix(full,'peel').length,8);
assert.equal(applyMix(full,'peel').includes('zesty'),false);
assert.equal(recipeName(['zesty','quiet']),recipeName(['quiet','zesty']));
assert.notEqual(recipeName(['still']),recipeName(['sunny']));
assert.equal(batchMinutes('mk1',10),60);
assert.equal(batchMinutes('mk1',11),60);
assert.equal(batchMinutes('mk2',20),60);
assert.equal(recipeXp(false),80);
assert.equal(recipeXp(true),0);
assert.equal(INGREDIENTS.filter(item=>item.unlockTier===0).length,4);

console.log('PASS: mix value, reactions, names, batches and recipe XP.');
