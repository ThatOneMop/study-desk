import * as THREE from './vendor/three.module.min.js';
import {graphicBatch} from './graphics-architecture.mjs';
// Stage 3: layered coastal habitat. All new solid scenic masses lie outside play bounds.
export function landscapePlan(bounds){
 const trunks=[],crowns=[],rocks=[],grass=[];let seed=67321;
 const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 for(let i=0;i<160;i++){
  const side=i%2?1:-1,x=side*(bounds.maxX+10+rand()*43),z=bounds.minZ+rand()*(bounds.maxZ-bounds.minZ),h=3+rand()*6;
  trunks.push({x,y:h*.45,z,w:.25+rand()*.18,h:h*.9,d:.27,color:0x736650,rz:side*.09});
  for(let j=0;j<3;j++)crowns.push({x:x+j*.45*side,y:h*.7+j*.75,z:z+(rand()-.5)*1.4,w:2.1+rand()*2,h:1.6+rand()*1.5,d:2+rand()*2,color:[0x667e54,0x839568,0x526d5a,0x9a9f69][i%4],ry:rand()*6});
 }
 for(let i=0;i<240;i++){
  const x=-320+rand()*640,z=99+rand()*22;
  rocks.push({x,y:-.25+rand()*.25,z,w:.6+rand()*3,h:.4+rand()*.9,d:.6+rand()*2,color:[0x8a8f84,0xadb09b,0x657773][i%3],ry:rand()*6});
 }
 for(let i=0;i<1100;i++){
  const side=i%2?1:-1,x=side*(bounds.maxX+2+rand()*16),z=bounds.minZ+rand()*(bounds.maxZ-bounds.minZ);
  grass.push({x,y:.16,z,w:.08+rand()*.16,h:.3+rand()*.5,d:.08,color:[0x99a66d,0x788a59,0xb4ab79][i%3],rz:(rand()-.5)*.5,ry:rand()*6});
 }
 return {trunks,crowns,rocks,grass};
}
export function createLandscapeOverhaul(scene,bounds){
 const plan=landscapePlan(bounds),trunks=graphicBatch(scene,'Coastal windbreak trunks',plan.trunks,new THREE.CylinderGeometry(.5,.65,1,6)),crowns=graphicBatch(scene,'Coastal broadleaf canopies',plan.crowns,new THREE.IcosahedronGeometry(.5,1)),rocks=graphicBatch(scene,'Tidal rock shelf',plan.rocks,new THREE.IcosahedronGeometry(.5,0)),grass=graphicBatch(scene,'Dune grasses',plan.grass);
 const groups=[trunks,crowns,rocks,grass],uniform={value:0};
 // Vertex movement is bounded and grows with local height. World base stays anchored.
 for(const mesh of [crowns,grass]){
  mesh.material.onBeforeCompile=shader=>{shader.uniforms.coastTime=uniform;shader.vertexShader='uniform float coastTime;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n transformed.x += sin(coastTime*.65 + instanceMatrix[3].x*.13 + instanceMatrix[3].z*.08)*.065*max(0.,position.y+.5);');};
  mesh.material.customProgramCacheKey=()=> 'coast-wind-v1';
 }
 return {plan,groups,update(time,quality){uniform.value=Number.isFinite(time)?time:0;grass.visible=quality!=='performance';crowns.count=quality==='performance'?Math.floor(plan.crowns.length/2):plan.crowns.length;groups.forEach(g=>g.castShadow=false);}};
}
