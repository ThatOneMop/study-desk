import fs from 'node:fs';
import assert from 'node:assert/strict';
import {GLTFLoader} from '../dist/vendor/gltf-loader.js';
import {residentExpressionState,applyResidentBlinkMorph,createResidentExpressionRig,updateResidentExpressionRig} from '../dist/resident-expressions.mjs';

const root=new URL('../dist/assets/',import.meta.url);
const files=['citizen-v11.glb','citizen-v11-1.glb','citizen-v11-2.glb','citizen-lod-v12-0.glb','citizen-lod-v12-1.glb','citizen-lod-v12-2.glb'];
const open=residentExpressionState({now:1,id:2,talking:true,active:true});
const closed=Object.freeze({...open,blink:1,eyeOpen:0});
for(const file of files){
 const bytes=fs.readFileSync(new URL(file,root));
 const gltf=await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');
 const body=gltf.scene,head=body.getObjectByName('Head');assert.ok(head,file+' animated Head bone');
 const blinkMeshes=[];body.traverse(object=>{if(Number.isInteger(object.morphTargetDictionary?.Blink))blinkMeshes.push(object);});
 if(file.includes('lod-v12'))assert.equal(blinkMeshes.length,0,file+' documents absent low-detail Blink morph');else assert.ok(blinkMeshes.length>0,file+' real high-detail Blink morph');
 assert.equal(applyResidentBlinkMorph(body,closed),blinkMeshes.length,file+' updates every Blink target');
 for(const mesh of blinkMeshes)assert.equal(mesh.morphTargetInfluences[mesh.morphTargetDictionary.Blink],1,file+' closes the real lid morph');
 const rig=createResidentExpressionRig({head,hairColor:0x4c4034,skinColor:0xc58f6c});
 updateResidentExpressionRig(rig,closed);assert.equal(rig.group.visible,true,file+' expression rig remains active');assert.equal(rig.leftGlint.visible,false,file+' left glint hides behind closed lid');assert.equal(rig.rightGlint.visible,false,file+' right glint hides behind closed lid');assert.equal(rig.leftLid.visible,true,file+' left authored lid covers closure');assert.equal(rig.rightLid.visible,true,file+' right authored lid covers closure');
 assert.ok(rig.leftGlint.scale.y<=.021,file+' closed glint collapses vertically');assert.equal(rig.leftLid.scale.y,1,file+' shared lid reaches full closure');
 assert.equal(applyResidentBlinkMorph(body,open),blinkMeshes.length,file+' reopens every Blink target');
 updateResidentExpressionRig(rig,open);assert.equal(rig.leftGlint.visible,true,file+' open eye restores glint');assert.equal(rig.rightGlint.visible,true,file+' open eye restores paired glint');assert.equal(rig.leftLid.visible,open.eyeOpen<.98,file+' resting eyelid follows personality');assert.equal(rig.rightLid.visible,open.eyeOpen<.98,file+' paired resting eyelid follows personality');
 for(const mesh of blinkMeshes)assert.equal(mesh.morphTargetInfluences[mesh.morphTargetDictionary.Blink],open.blink,file+' accent and morph share one open-eye state');
}
console.log('PASS: all six real high/low resident GLBs synchronize eye glints and shared skin-toned lid closure; high rigs retain their actual Blink morph while the three low rigs explicitly use the authored fallback because their source GLBs contain no Blink morph. CPU transforms only; no rendered clipping claim.');
