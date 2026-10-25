import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.min.js';
import {createEffects} from '../dist/vendor/effects.js';
// Execute the real effect chain with real THREE resources but no WebGL context.
class RendererProbe{
 constructor(){this.targets=new Set();this.materials=new Set();this.draws=[];this.target=null;this.color=new THREE.Color(0x123456);this.alpha=.4;this.autoClear=true;this.outputColorSpace=THREE.SRGBColorSpace;this.toneMapping=THREE.ACESFilmicToneMapping;this.toneMappingExposure=.93;}
 getPixelRatio(){return 1.5;}getSize(v){return v.set(800,600);}getRenderTarget(){return this.target;}
 setRenderTarget(t){this.target=t;if(t)this.targets.add(t);}
 getClearColor(v){return v.copy(this.color);}getClearAlpha(){return this.alpha;}setClearColor(v){this.color.set(v);}setClearAlpha(v){this.alpha=v;}clear(){}
 render(root){this.draws.push({root,override:root.overrideMaterial??null,target:this.target});if(root.overrideMaterial)this.materials.add(root.overrideMaterial);else if(root.isMesh)this.materials.add(root.material);}
}
const materialDisposals=[],materialDispose=THREE.Material.prototype.dispose;
THREE.Material.prototype.dispose=function(){materialDisposals.push(this);materialDispose.call(this);};
try{for(let cycle=0;cycle<20;cycle++){
 materialDisposals.length=0;
 const renderer=new RendererProbe(),scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera();
 const geometry=new THREE.BoxGeometry(),material=new THREE.MeshStandardMaterial(),mesh=new THREE.Mesh(geometry,material);scene.add(mesh);
 let sceneDisposed=0;geometry.addEventListener('dispose',()=>sceneDisposed++);material.addEventListener('dispose',()=>sceneDisposed++);
 const effect=createEffects(renderer,scene,camera,640,360);effect.render();
 const beauty=renderer.draws.filter(d=>d.root===scene&&!d.override),normal=renderer.draws.filter(d=>d.root===scene&&d.override);
 const targets=[...renderer.targets],materials=[...renderer.materials],noise=[...new Set(materials.flatMap(m=>Object.values(m.uniforms??{}).map(u=>u.value).filter(t=>t?.isDataTexture)))];
 const disposal=new Map();for(const r of [...targets,...materials,...noise]){disposal.set(r,0);r.addEventListener('dispose',()=>disposal.set(r,disposal.get(r)+1));}
 effect.dispose();
 if(cycle===0)console.log(JSON.stringify({beautyDraws:beauty.length,normalDraws:normal.length,observedTargets:targets.length,observedMaterials:materials.length,allDisposedMaterials:new Set(materialDisposals).size,noiseTextures:noise.length,undisposedTargets:targets.filter(t=>disposal.get(t)===0).length,undisposedMaterials:materials.filter(t=>disposal.get(t)===0).length,undisposedNoise:noise.filter(t=>disposal.get(t)===0).length}));
 assert.equal(beauty.length,1,'High must draw the actual colour scene before AO');assert.equal(normal.length,1);
 assert(renderer.draws.indexOf(beauty[0])<renderer.draws.indexOf(normal[0]),'beauty buffer precedes AO');
 assert.equal(targets.length,5,'two compositor plus three SSAO targets');assert.equal(noise.length,1);
 for(const r of [...targets,...materials,...noise])assert.equal(disposal.get(r),1,'owned effect resource released exactly once: '+r.type);
 assert.equal(materialDisposals.length,8,'also release unused depth and compositor-copy shaders');assert.equal(new Set(materialDisposals).size,8);
 const renders=renderer.draws.length;effect.dispose();effect.resize(320,180);effect.render();assert.equal(renderer.draws.length,renders,'disposed effects cannot render or resize');
 for(const r of [...targets,...materials,...noise])assert.equal(disposal.get(r),1,'double dispose is harmless');
 assert.equal(materialDisposals.length,8);
 assert.equal(sceneDisposed,0,'disposing effects must preserve original scene assets');assert.equal(scene.overrideMaterial,null);
}}finally{THREE.Material.prototype.dispose=materialDispose;}
console.log('PASS: 20 real effect-chain lifecycles, beauty-before-AO ordering, five targets/eight materials/noise released once, idempotent teardown and original scene resources retained. Renderer is a probe, not GPU output or measured memory/FPS.');
