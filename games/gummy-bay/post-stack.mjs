import * as THREE from './vendor/three.module.min.js';

// Preset ids stay performance/balanced/high so existing saves and tests match.
// Low is the phone and software-renderer path: no composer, no shadows.
export function lookPreset(quality){
 const mode=quality==='low'||quality==='performance'?'performance':quality==='high'||quality==='ultra'?'high':'balanced';
 if(mode==='performance')return Object.freeze({id:'low',quality:mode,pixelRatio:1,shadows:false,composer:false,townDistance:72,vignette:'css'});
 if(mode==='high')return Object.freeze({id:'high',quality:mode,pixelRatio:1.85,shadows:true,composer:true,townDistance:280,vignette:'pass'});
 return Object.freeze({id:'medium',quality:mode,pixelRatio:1.25,shadows:true,composer:false,townDistance:210,vignette:'none'});
}

export function detectLookQuality({saved,cores,saveData=false,coarse=false,software=false}={}){
 if(saved==='performance'||saved==='low')return 'performance';
 if(saved==='balanced'||saved==='medium')return 'balanced';
 if(saved==='high'||saved==='ultra')return 'high';
 if(software||saveData||coarse||(Number.isFinite(cores)&&cores>0&&cores<=4))return 'performance';
 return 'balanced';
}

const clamp01=v=>Math.max(0,Math.min(1,Number.isFinite(v)?v:0));
const mix=(a,b,t)=>a+(b-a)*t;
function mix3(a,b,t){return [mix(a[0],b[0],t),mix(a[1],b[1],t),mix(a[2],b[2],t)];}

// Display-referred grade. Day is slightly warm and desaturated, golden hour
// pushes the highlights, night lifts the blacks toward blue-cyan.
export function lookGrade(night=0,warmth=0){
 const n=clamp01(night),w=clamp01(warmth)*(1-n);
 const day={saturation:1.0,contrast:1.09,lift:[.02,.02,.035],gain:[1.03,1,.96],vignette:.35};
 const gold={saturation:1.04,contrast:1.07,lift:[.035,.02,.012],gain:[1.07,1,.9],vignette:.32};
 const dusk={saturation:.82,contrast:1.02,lift:[.045,.05,.07],gain:[.9,.98,1.08],vignette:.42};
 const warm=mix(0,1,w);
 return Object.freeze({
  saturation:mix(mix(day.saturation,gold.saturation,warm),dusk.saturation,n),
  contrast:mix(mix(day.contrast,gold.contrast,warm),dusk.contrast,n),
  lift:Object.freeze(mix3(mix3(day.lift,gold.lift,warm),dusk.lift,n)),
  gain:Object.freeze(mix3(mix3(day.gain,gold.gain,warm),dusk.gain,n)),
  vignette:mix(mix(day.vignette,gold.vignette,warm),dusk.vignette,n)
 });
}

const quadVertex=`varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.0,1.0);}`;
const thresholdFragment=`uniform sampler2D tDiffuse;uniform float threshold;uniform float knee;varying vec2 vUv;void main(){vec3 c=texture2D(tDiffuse,vUv).rgb;float l=max(c.r,max(c.g,c.b));float s=clamp(l-threshold+knee,0.0,2.0*knee);s=s*s/(4.0*knee+1e-4);float w=max(s,l-threshold)/max(l,1e-4);gl_FragColor=vec4(min(c*w,vec3(8.0)),1.0);}`;
const blurFragment=`uniform sampler2D tDiffuse;uniform vec2 direction;varying vec2 vUv;void main(){vec3 c=texture2D(tDiffuse,vUv).rgb*.227+texture2D(tDiffuse,vUv+direction).rgb*.316+texture2D(tDiffuse,vUv-direction).rgb*.316+texture2D(tDiffuse,vUv+direction*2.0).rgb*.070+texture2D(tDiffuse,vUv-direction*2.0).rgb*.070;gl_FragColor=vec4(c,1.0);}`;
const compositeFragment=`uniform sampler2D tDiffuse;uniform sampler2D tBloom;uniform sampler2D tWide;uniform float wideStrength;uniform float split;uniform float bloomStrength;uniform float saturation;uniform float contrast;uniform vec3 lift;uniform vec3 gain;uniform float vignette;varying vec2 vUv;void main(){vec3 c=texture2D(tDiffuse,vUv).rgb+texture2D(tBloom,vUv).rgb*bloomStrength+texture2D(tWide,vUv).rgb*bloomStrength*wideStrength;gl_FragColor=vec4(c,1.0);
#include <tonemapping_fragment>
#include <colorspace_fragment>
c=clamp(gl_FragColor.rgb,0.0,1.0);float l=dot(c,vec3(.2126,.7152,.0722));c=mix(vec3(l),c,saturation);c=(c-.5)*contrast+.5;c=mix(c,c*c*(3.0-2.0*c),.18*(contrast-1.0)*6.0);c+=split*(mix(vec3(-.35,-.05,.45),vec3(.45,.12,-.4),smoothstep(.2,.8,l)));c=c*gain+lift;vec2 q=vUv-.5;c*=1.0-vignette*smoothstep(.25,.92,dot(q,q)*2.2);gl_FragColor=vec4(clamp(c,0.0,1.0),1.0);}`;

function makePass(fragment,uniforms){
 const material=new THREE.ShaderMaterial({uniforms,vertexShader:quadVertex,fragmentShader:fragment,depthTest:false,depthWrite:false});
 const mesh=new THREE.Mesh(new THREE.PlaneGeometry(2,2),material);
 const scene=new THREE.Scene();scene.add(mesh);
 return {scene,material,mesh};
}

// High-only stack. The scene pass keeps the renderer tone map (AgX). This pass
// adds emissive bloom, a light grade and a vignette. Low and Medium do not use it.
export function createEffects(renderer,scene,camera,width=1280,height=720){
 const noop={render(){if(renderer&&scene&&camera&&typeof renderer.render==='function')renderer.render(scene,camera);},resize(){},dispose(){},setGrade(){},setPost(){}};
 if(!renderer||typeof renderer.setRenderTarget!=='function'||!scene||!camera)return noop;
 const size={w:Math.max(2,width|0),h:Math.max(2,height|0)};
 const target=()=>new THREE.WebGLRenderTarget(size.w,size.h,{type:THREE.HalfFloatType,depthBuffer:true});
 const half=(k=1)=>new THREE.WebGLRenderTarget(Math.max(2,size.w>>k),Math.max(2,size.h>>k),{type:THREE.HalfFloatType,depthBuffer:false});
 let beauty=target(),bloomA=half(),bloomB=half(),wideA=half(3),wideB=half(3);
 const grade=lookGrade(0,0);
 const threshold=makePass(thresholdFragment,{tDiffuse:{value:null},threshold:{value:.78},knee:{value:.32}});
 const blur=makePass(blurFragment,{tDiffuse:{value:null},direction:{value:new THREE.Vector2(1/size.w,0)}});
 const composite=makePass(compositeFragment,{
  tDiffuse:{value:null},tBloom:{value:null},tWide:{value:null},wideStrength:{value:.5},split:{value:.04},bloomStrength:{value:.35},
  saturation:{value:grade.saturation},contrast:{value:grade.contrast},
  lift:{value:new THREE.Vector3(...grade.lift)},gain:{value:new THREE.Vector3(...grade.gain)},
  vignette:{value:grade.vignette}
 });
 const ortho=new THREE.OrthographicCamera(-1,1,1,-1,0,1);
 let failed=false,disposed=false,boost=0;
 function draw(pass,to,input){
  pass.material.uniforms.tDiffuse.value=input;
  renderer.setRenderTarget(to);renderer.render(pass.scene,ortho);
 }
 return {
  setPost(t={}){const u=composite.material.uniforms;if(Number.isFinite(t.wide))u.wideStrength.value=Math.max(0,Math.min(1.5,t.wide));if(Number.isFinite(t.split))u.split.value=Math.max(0,Math.min(.12,t.split));if(Number.isFinite(t.threshold))threshold.material.uniforms.threshold.value=t.threshold;if(Number.isFinite(t.knee))threshold.material.uniforms.knee.value=Math.max(.01,t.knee);if(Number.isFinite(t.bloom))boost=Math.max(0,Math.min(1,t.bloom));},
  setGrade(night=0,warmth=0,bloom=.35){
   const next=lookGrade(night,warmth),u=composite.material.uniforms;
   u.saturation.value=next.saturation;u.contrast.value=next.contrast;u.vignette.value=next.vignette;
   u.lift.value.set(next.lift[0],next.lift[1],next.lift[2]);u.gain.value.set(next.gain[0],next.gain[1],next.gain[2]);
   u.bloomStrength.value=Math.max(0,Math.min(1,Math.max(Number.isFinite(bloom)?bloom:.35,boost)));
  },
  render(){
   if(disposed)return;
   if(failed){renderer.setRenderTarget(null);renderer.render(scene,camera);return;}
   const previous=renderer.getRenderTarget?.()??null;
   try{
    renderer.setRenderTarget(beauty);renderer.render(scene,camera);
    draw(threshold,bloomA,beauty.texture);
    blur.material.uniforms.direction.value.set(1/Math.max(2,size.w>>1),0);draw(blur,bloomB,bloomA.texture);
    blur.material.uniforms.direction.value.set(0,1/Math.max(2,size.h>>1));draw(blur,bloomA,bloomB.texture);
    // wide, soft glow from an eighth-res copy of the bright pass
    blur.material.uniforms.direction.value.set(2/Math.max(2,size.w>>3),0);draw(blur,wideA,bloomA.texture);
    blur.material.uniforms.direction.value.set(0,2/Math.max(2,size.h>>3));draw(blur,wideB,wideA.texture);
    composite.material.uniforms.tWide.value=wideB.texture;
    composite.material.uniforms.tBloom.value=bloomA.texture;
    draw(composite,null,beauty.texture);
   }catch(e){failed=true;renderer.setRenderTarget(null);renderer.render(scene,camera);}
   finally{if(!failed)renderer.setRenderTarget(previous);}
  },
  resize(w,h){
   if(disposed)return;
   size.w=Math.max(2,w|0);size.h=Math.max(2,h|0);
   beauty.setSize(size.w,size.h);bloomA.setSize(Math.max(2,size.w>>1),Math.max(2,size.h>>1));bloomB.setSize(Math.max(2,size.w>>1),Math.max(2,size.h>>1));wideA.setSize(Math.max(2,size.w>>3),Math.max(2,size.h>>3));wideB.setSize(Math.max(2,size.w>>3),Math.max(2,size.h>>3));
  },
  dispose(){
   if(disposed)return;disposed=true;
   for(const rt of [beauty,bloomA,bloomB,wideA,wideB])rt.dispose();
   for(const pass of [threshold,blur,composite]){pass.material.dispose();pass.mesh.geometry.dispose();}
  }
 };
}
