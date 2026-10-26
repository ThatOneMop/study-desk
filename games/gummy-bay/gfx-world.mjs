// v155 graphics pass step 6: water, sky, car paint and grass tufts.
// All original procedural art: shaders and generated geometry only, no downloaded assets.
import * as THREE from './vendor/three.module.min.js';

export const isLowWorld=q=>q==='performance';
const NOISE='float gwHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float gwNoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(gwHash(i),gwHash(i+vec2(1.,0.)),f.x),mix(gwHash(i+vec2(0.,1.)),gwHash(i+vec2(1.,1.)),f.x),f.y);}';

// Ocean: four travelling sine swells (displaced in world space), analytic normals, ripple detail,
// sky fresnel reflection and sun glint on Medium/High (uQ=1), crest and shoreline foam everywhere.
export const OCEAN_VERTEX='varying vec2 vUv;varying vec3 world;varying vec3 vN;varying float vH;uniform float uTime;uniform float uQ;'+
'void wave(vec2 xz,vec2 d,float k,float s,float a,inout float h,inout vec2 g){float ph=dot(d,xz)*k+uTime*s;h+=a*sin(ph);g+=a*k*cos(ph)*d;}'+
'void main(){vUv=uv;vec4 w=modelMatrix*vec4(position,1.);float h=0.;vec2 g=vec2(0.);float A=.55+.45*uQ;'+
'wave(w.xz,vec2(.8,.6),.35,.9,.05*A,h,g);wave(w.xz,vec2(-.5,.86),.55,1.1,.03*A,h,g);wave(w.xz,vec2(.95,-.31),1.3,1.6,.012*A,h,g);wave(w.xz,vec2(.2,.98),2.1,2.,.007*A,h,g);'+
'w.y+=h;vH=h/A;vN=normalize(vec3(-g.x,1.,-g.y));world=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}';
export const OCEAN_FRAGMENT='varying vec2 vUv;varying vec3 world;varying vec3 vN;varying float vH;uniform float uTime;uniform float uLight;uniform vec3 uFog;uniform float uFogNear;uniform float uFogFar;uniform float uQ;uniform vec3 uSkyTop;uniform vec3 uSkyBot;uniform float uSkyLevel;'+NOISE+
'void main(){float t=uTime;vec2 q=world.xz;vec3 n=normalize(vN);'+
'float r1=gwNoise(q*1.3+vec2(t*.35,t*.2)),r2=gwNoise(q*2.7-vec2(t*.25,-t*.4));n=normalize(n+vec3(r1-.5,0.,r2-.5)*.22*uQ);'+
'vec3 V=normalize(cameraPosition-world);float depth=smoothstep(58.,115.,world.z);'+
'vec3 c=mix(vec3(.2,.48,.49),vec3(.1,.29,.36),depth);c+=sin(world.z*3.5+t*.8+sin(world.x*.12))*.018;'+
'float fres=pow(1.-max(dot(n,V),0.),4.);vec3 R=reflect(-V,n);vec3 sky=mix(uSkyBot,uSkyTop,pow(clamp(R.y,0.,1.),.55))*uSkyLevel;'+
'c=mix(c,sky,clamp(fres*(.22+.5*uQ)+.08*uQ,0.,1.));'+
'float day=smoothstep(.45,.9,uLight);float glint=pow(max(dot(R,normalize(vec3(.3,.42,.86))),0.),220.)*2.2*uQ*day;'+
'float crest=smoothstep(.055,.09,vH)*(.45+.55*gwNoise(q*3.+t*.3));'+
'float sd=world.z-58.;float band=1.-smoothstep(0.,4.+1.5*sin(world.x*.21+t*.6),sd);'+
'float lines=.5+.5*sin(sd*2.4-t*1.7+gwNoise(q*.8)*3.);float shore=band*smoothstep(.35,.85,lines*(.55+.45*gwNoise(q*2.2+t*.2)));'+
'c=mix(c,vec3(.92,.96,.95),clamp(crest*.55+shore*.8,0.,1.));c*=uLight;c+=glint;'+
'float fog=smoothstep(uFogNear,uFogFar,distance(cameraPosition,world));gl_FragColor=vec4(mix(c,uFog,fog),1.);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}';

// Sky: horizon haze, domain-warped drifting clouds with lit tops and soft bases, stars at night.
export const SKY_FRAGMENT='varying vec3 direction;uniform vec3 top;uniform vec3 bottom;uniform float night;uniform float time;'+NOISE+
'float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*gwNoise(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}'+
'void main(){vec3 dir=normalize(direction);float h=clamp(dir.y,0.,1.);vec3 col=mix(bottom,top,pow(h,.55));col=mix(col,bottom*1.05,exp(-h*10.)*.35);'+
'vec2 p=dir.xz/max(.15,dir.y)*1.6+vec2(time*.006,time*.0025);vec2 wv=vec2(fbm(p*.6+time*.002),fbm(p*.6+3.1));float n=fbm(p+wv*.8);'+
'float cloud=smoothstep(.48,.68,n)*smoothstep(.03,.22,h);float lit=smoothstep(.0,.12,n-fbm(p+wv*.8+vec2(.07,.05)));'+
'vec3 cc=mix(vec3(.7,.73,.78),vec3(.98,.97,.93),.45+.55*lit);col=mix(col,cc,cloud*.8);col*=night;'+
'vec3 sc=floor(dir*170.);float star=step(.9965,gwHash(sc.xy+sc.z*17.13))*(1.-smoothstep(.22,.55,night))*(1.-cloud)*smoothstep(.06,.3,h);col+=vec3(star*.85);'+
'gl_FragColor=vec4(col,1.);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}';

// Car paint: classify the merged vertex-coloured bodies by palette colour and give paint a gloss,
// glass a sharp sky reflection, chrome hubs metal, tyres matte, and headlights/tail lights glow at night.
export function applyCarPaint(material,palette,sky){
 const lin=hex=>new THREE.Color(hex);
 const u={uNight:{value:0},uGloss:{value:1},uSkyTop:sky.top,uSkyBot:sky.bottom,uSkyLevel:sky.night,
  uTyre:{value:lin(palette.TYRE)},uGlass:{value:lin(palette.GLASS)},uLamp:{value:lin(palette.LAMP)},uTail:{value:lin(palette.TAIL)},uChrome:{value:lin(palette.CHROME)}};
 material.onBeforeCompile=sh=>{Object.assign(sh.uniforms,u);
  sh.fragmentShader=sh.fragmentShader
  .replace('#include <common>','#include <common>\nuniform float uNight;uniform float uGloss;uniform float uSkyLevel;uniform vec3 uSkyTop;uniform vec3 uSkyBot;uniform vec3 uTyre;uniform vec3 uGlass;uniform vec3 uLamp;uniform vec3 uTail;uniform vec3 uChrome;float carIs(vec3 c,vec3 k){vec3 d=c-k;return 1.-smoothstep(.0004,.003,dot(d,d));}')
  .replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\nfloat cTyre=carIs(vColor.rgb,uTyre),cGlass=carIs(vColor.rgb,uGlass),cLamp=carIs(vColor.rgb,uLamp),cTail=carIs(vColor.rgb,uTail),cChrome=carIs(vColor.rgb,uChrome);float cPaint=clamp(1.-cTyre-cGlass-cLamp-cTail-cChrome,0.,1.);roughnessFactor=mix(roughnessFactor,.3,cPaint*uGloss);roughnessFactor=mix(roughnessFactor,.1,cGlass*uGloss);roughnessFactor=mix(roughnessFactor,.22,cChrome);roughnessFactor=mix(roughnessFactor,.93,cTyre);')
  .replace('#include <metalnessmap_fragment>','#include <metalnessmap_fragment>\nmetalnessFactor=mix(metalnessFactor,.8,cChrome);')
  .replace('#include <emissivemap_fragment>','#include <emissivemap_fragment>\ntotalEmissiveRadiance+=vColor.rgb*(cLamp*2.6+cTail*1.5)*uNight;')
  .replace('#include <lights_fragment_end>','#include <lights_fragment_end>\n{vec3 Rw=inverseTransformDirection(reflect(-geometryViewDir,normal),viewMatrix);float fr=pow(1.-saturate(dot(normal,geometryViewDir)),3.);vec3 env=mix(uSkyBot,uSkyTop,saturate(Rw.y*.5+.5))*uSkyLevel;reflectedLight.indirectSpecular+=env*(.06+.55*fr)*(cPaint*.6+cGlass*1.2+cChrome*.9)*uGloss;}');
 };
 material.customProgramCacheKey=()=>'gummy-car-paint-v155';
 material.userData.paint=u;material.needsUpdate=true;
 return u;
}

// Grass tufts: one instanced draw of three-blade clumps around trees and planters, swaying in the wind.
export function tuftSpots(trees=[],planters=[],{max=900,seed=5,free=()=>true}={}){
 let r=seed>>>0;const rnd=()=>((r=(r*1664525+1013904223)>>>0)/4294967296);const out=[];
 const ring=(x,z,inner,outer,count)=>{for(let i=0;i<count&&out.length<max;i++){const a=rnd()*Math.PI*2,d=inner+rnd()*(outer-inner),px=x+Math.cos(a)*d,pz=z+Math.sin(a)*d;if(free(px,pz))out.push({x:px,z:pz,s:.7+rnd()*.6,ry:rnd()*Math.PI*2,hue:rnd()});}};
 for(const t of trees)ring(t.x,t.z,.45,2.2*(t.s??1),6);
 for(const p of planters)ring(p.x,p.z,.2,.9,3);
 return out;
}
export function createGrassTufts(spots,{height=()=>0}={}){
 const pos=[],col=[];const blade=(a,lean,h,w)=>{const c=Math.cos(a),s=Math.sin(a),lx=Math.cos(a+1.4)*lean,lz=Math.sin(a+1.4)*lean;
  pos.push(-c*w,0,-s*w, c*w,0,s*w, lx,h,lz);col.push(.26,.42,.18, .26,.42,.18, .62,.78,.36);};
 for(let i=0;i<5;i++)blade(i*1.26,.08+.04*(i%2),.32+.08*(i%3),.06);
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('color',new THREE.Float32BufferAttribute(col,3));geo.computeVertexNormals();
 const mat=new THREE.MeshLambertMaterial({vertexColors:true,side:THREE.DoubleSide});const wind={uTime:{value:0}};
 mat.onBeforeCompile=sh=>{sh.uniforms.uTime=wind.uTime;sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nuniform float uTime;').replace('#include <begin_vertex>','#include <begin_vertex>\n{vec4 wp=instanceMatrix*vec4(0.,0.,0.,1.);float sw=sin(uTime*1.7+wp.x*.7+wp.z*.5)*.06*position.y*3.;transformed.x+=sw;transformed.z+=sw*.6;}');};
 mat.customProgramCacheKey=()=>'gummy-grass-tufts-v155';
 const mesh=new THREE.InstancedMesh(geo,mat,Math.max(1,spots.length));mesh.name='Gfx grass tufts v155';
 const m=new THREE.Matrix4(),q=new THREE.Quaternion(),v=new THREE.Vector3(),sc=new THREE.Vector3(),e=new THREE.Euler(),tint=new THREE.Color();
 spots.forEach((p,i)=>{q.setFromEuler(e.set(0,p.ry,0));m.compose(v.set(p.x,height(p.x,p.z)+.02,p.z),q,sc.set(p.s,p.s,p.s));mesh.setMatrixAt(i,m);mesh.setColorAt(i,tint.setHSL(.24+p.hue*.06,.45,.42+p.hue*.12));});
 mesh.count=spots.length;mesh.castShadow=false;mesh.receiveShadow=true;mesh.frustumCulled=false;
 return {mesh,count:spots.length,update(t,quality){wind.uTime.value=t;mesh.visible=!isLowWorld(quality)&&spots.length>0;}};
}

// One place for the per-frame quality/night tuning of the step 6 world pieces.
export function worldTuning(quality,night){
 const low=isLowWorld(quality);
 return Object.freeze({waterQ:low?0:1,gloss:low?.65:1,headlights:Math.max(0,Math.min(1,(night-.25)/.45)),tufts:!low});
}
