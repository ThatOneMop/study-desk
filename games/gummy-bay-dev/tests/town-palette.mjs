import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.min.js';
import {TOWN_DISTRICT_PALETTES,TOWN_NEUTRALS,TOWN_ACCENTS,townDistrictPalette,townRoleColor,townColorDistance,townRelativeLuminance,townContrastRatio} from '../dist/town-palette.mjs?v=76';
import {DISTRICT_BUILDING_SITES,districtArchitectureProfile,createDistrictArchitecture} from '../dist/district-architecture.mjs';
import {createStreetConstruction} from '../dist/street-construction.mjs';
import {createVerticalTownLayer} from '../dist/vertical-town.mjs';
import {createContextualStreetProps} from '../dist/contextual-street-props.mjs';

assert.equal(TOWN_DISTRICT_PALETTES.length,7);
assert(Object.isFrozen(TOWN_DISTRICT_PALETTES)&&TOWN_DISTRICT_PALETTES.every(entry=>Object.isFrozen(entry)&&Object.isFrozen(entry.palette)));
assert(Object.isFrozen(TOWN_NEUTRALS)&&Object.isFrozen(TOWN_ACCENTS));
assert.equal(new Set(TOWN_DISTRICT_PALETTES.map(entry=>entry.district)).size,7);
assert.equal(new Set(TOWN_DISTRICT_PALETTES.map(entry=>entry.palette.key)).size,7);
for(const entry of TOWN_DISTRICT_PALETTES){
 assert.equal(townDistrictPalette(entry.x,entry.z),entry,'each named district anchor resolves to its own palette');
 const palette=entry.palette;
 assert.deepEqual(Object.keys(palette),['key','wall','upper','trim','roof','door','awning']);
 assert(Object.values(palette).slice(1).every(color=>Number.isInteger(color)&&color>=0&&color<=0xffffff));
 assert(townRelativeLuminance(palette.wall)>=.23&&townRelativeLuminance(palette.wall)<=.42,'wall values stay in one muted coastal band');
 assert(townContrastRatio(palette.wall,palette.roof)>=1.7,'roof stays darker than district wall');
 assert(townContrastRatio(palette.wall,palette.door)>=1.6,'entrance remains separated from district wall');
}
assert.equal(townDistrictPalette(NaN,0).district,'Old Town');
assert.equal(townRoleColor('crossing'),TOWN_ACCENTS.crossing);assert.equal(townRoleColor('foundation'),TOWN_NEUTRALS.foundation);assert.equal(townRoleColor('__proto__'),null);assert.equal(townRoleColor('missing'),null);
assert.equal(townColorDistance(0,0),0);assert.equal(townColorDistance(-1,0),null);assert.equal(townRelativeLuminance(0xffffff),1);assert.equal(townRelativeLuminance(Infinity),null);assert.equal(townContrastRatio(0xffffff,0),21);assert.equal(townContrastRatio(0xffffff,-1),null);
for(const role of ['crossing','tactile','parking']){
 assert(townContrastRatio(TOWN_ACCENTS[role],TOWN_NEUTRALS.darkMetal)>=3.2,role+' remains readable against dark street furniture');
 assert(townColorDistance(TOWN_ACCENTS[role],TOWN_NEUTRALS.hardscapeA)>=.23,role+' remains distinct from hardscape');
}
assert(townColorDistance(TOWN_ACCENTS.emergency,TOWN_NEUTRALS.streetMetal)>=.3,'emergency coral remains distinct from metal');

const profiles=DISTRICT_BUILDING_SITES.map(districtArchitectureProfile);
assert(profiles.every((profile,index)=>profile.district===townDistrictPalette(DISTRICT_BUILDING_SITES[index].x,DISTRICT_BUILDING_SITES[index].z).district));
assert(profiles.every(profile=>profile.palette===townDistrictPalette(profile.x,profile.z).palette),'architecture reuses frozen district palette objects');
assert(new Set(profiles.map(profile=>profile.district)).size>=6,'expanded architecture carries at least six named district identities');

const colors=mesh=>{const result=new Set(),color=new THREE.Color();for(let i=0;i<mesh.count;i++){mesh.getColorAt(i,color);result.add(color.getHex());}return result;};
const scene=new THREE.Scene(),architecture=createDistrictArchitecture({scene}),streets=createStreetConstruction({scene}),terrace=createVerticalTownLayer({scene}),props=createContextualStreetProps({scene});
const massColors=colors(architecture.massMesh),roofColors=colors(architecture.roofMesh),markingColors=colors(streets.markingMesh),hardscapeColors=colors(streets.hardscapeMesh),terraceMassColors=colors(terrace.massMesh),terraceDetailColors=colors(terrace.detailMesh),propBoxColors=colors(props.boxMesh),propCylinderColors=colors(props.cylinderMesh);
for(const profile of profiles){assert(massColors.has(profile.palette.wall));assert((profile.roof==='gable'?roofColors:massColors).has(profile.palette.roof),'each district contributes its coordinated mass/roof family');}
for(const role of ['crossing','parking'])assert(markingColors.has(townRoleColor(role)));
for(const role of ['hardscapeA','curb'])assert(hardscapeColors.has(townRoleColor(role)));
assert(hardscapeColors.has(townRoleColor('tactile')));assert(terraceMassColors.has(townRoleColor('hardscapeA'))&&terraceMassColors.has(townRoleColor('hardscapeB')));
assert(terraceDetailColors.has(townRoleColor('streetMetal'))&&terraceDetailColors.has(townRoleColor('wood')));
assert(propBoxColors.has(townRoleColor('service'))&&propCylinderColors.has(townRoleColor('emergency')));
const resources=scene.children.map(mesh=>[mesh,mesh.geometry,mesh.material,mesh.instanceMatrix,mesh.instanceColor]);
for(const quality of ['performance','balanced','high']){architecture.setQuality(quality);streets.setQuality(quality);terrace.setQuality(quality);props.setQuality(quality);}
assert.deepEqual(scene.children.map(mesh=>[mesh,mesh.geometry,mesh.material,mesh.instanceMatrix,mesh.instanceColor]),resources,'palette coordination does not add or replace batch resources across quality changes');
console.log('PASS: seven named coastal palettes coordinate 60 buildings and shared neutral/accent roles keep crossing, tactile, parking, service and emergency cues distinct across nine existing batches. CPU colour state only; no rendered palette claim.');
