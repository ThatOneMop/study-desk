// v155 graphics pass step 6: water, sky, car paint and grass tufts.
// All original procedural art: shaders and generated geometry only, no downloaded assets.
import * as THREE from './vendor/three.module.min.js';

export const isLowWorld=q=>q==='performance';
const NOISE='float gwHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float gwNoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(gwHash(i),gwHash(i+vec2(1.,0.)),f.x),mix(gwHash(i+vec2(0.,1.)),gwHash(i+vec2(1.,1.)),f.x),f.y);}';

// Ocean: long swells displace the (coarse) sea mesh; per-pixel analytic wave normals and ripples give
// the detail, with sky fresnel reflection and sun glint on Medium/High (uQ=1) and soft crest foam.
const WAVES='void wave(vec2 xz,vec2 d,float k,float s,float a,inout float h,inout vec2 g){float ph=dot(d,xz)*k+uTime*s;h+=a*sin(ph);g+=a*k*cos(ph)*d;}';
export const OCEAN_VERTEX='varying vec2 vUv;varying vec3 world;uniform float uTime;uniform float uQ;'+WAVES+
'void main(){vUv=uv;vec4 w=modelMatrix*vec4(position,1.);float h=0.;vec2 g=vec2(0.);wave(w.xz,vec2(.8,.6),.11,.55,.06*uQ,h,g);wave(w.xz,vec2(-.45,.89),.17,.7,.035*uQ,h,g);'+
'w.y+=h;world=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}';
// Replaces the v132 coastal water fragment (graphics-atmosphere.mjs applies it): same deep/shallow
// palette, weather dimming and offshore shelf, plus per-pixel waves, fresnel sky reflection and glint.
export const OCEAN_FRAGMENT='varying vec2 vUv;varying vec3 world;uniform float uTime;uniform float uLight;uniform vec3 uFog;uniform float uFogNear;uniform float uFogFar;uniform float uCloud;uniform float uQ;uniform vec3 uSkyTop;uniform vec3 uSkyBot;uniform float uSkyLevel;'+NOISE+WAVES+
'void main(){float t=uTime;vec2 q=world.xz;float d=distance(cameraPosition,world);float detail=1.-smoothstep(40.,170.,d);float h=0.;vec2 g=vec2(0.);'+
'wave(q,vec2(.8,.6),.35,.9,.05,h,g);wave(q,vec2(-.5,.86),.55,1.1,.03,h,g);wave(q,vec2(.95,-.31),1.3,1.6,.012,h,g);wave(q,vec2(.2,.98),2.1,2.,.007,h,g);'+
'float k=(.5+.7*uQ)*(.35+.65*detail);vec3 n=normalize(vec3(-g.x*k,1.,-g.y*k));float r1=gwNoise(q*1.3+vec2(t*.35,t*.2)),r2=gwNoise(q*2.7-vec2(t*.25,-t*.4));n=normalize(n+vec3(r1-.5,0.,r2-.5)*.2*uQ*detail);'+
'vec3 deep=vec3(.075,.22,.26),shallows=vec3(.24,.47,.43);vec3 c=mix(deep,shallows,clamp(1.-abs(max(abs(world.x)-310.,abs(world.z+177.)-292.))/55.,0.,1.));c+=(sin(world.z*.08+world.x*.025)*.5+.5)*.035;'+
'vec3 V=normalize(cameraPosition-world);float fres=pow(1.-max(dot(n,V),0.),4.);vec3 R=reflect(-V,n);vec3 sky=mix(uSkyBot,uSkyTop,pow(clamp(R.y,0.,1.),.55))*uSkyLevel;'+
'c=mix(c,sky,clamp(fres*(.25+.5*uQ)+.05*uQ,0.,1.));'+
'float crest=sin(world.x*.19+world.z*.52-t*.9)+.46*sin(world.x*.49-world.z*.27+t*.56);float foam=smoothstep(1.05,1.42,crest)*detail*(.6+.4*gwNoise(q*2.2+t*.3))+smoothstep(.065,.095,h)*detail*.5;'+
'float shore=exp(-abs(max(abs(world.x)-325.,abs(world.z+177.)-305.)-sin(world.x*.075+world.z*.06)*1.2)*.38);c=mix(c,vec3(.8,.87,.8),foam*.3+shore*(.18+.22*sin(t*.6+world.x*.1)));'+
'c*=uLight*(1.-uCloud*.18);float day=smoothstep(.45,.9,uLight)*(1.-uCloud*.85);c+=vec3(1.,.93,.78)*pow(max(dot(R,normalize(vec3(-.55,.64,.5))),0.),160.)*1.6*uQ*day*detail;'+
'gl_FragColor=vec4(mix(c,uFog,smoothstep(uFogNear,uFogFar,d)),1.);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}';

// Shore foam: one transparent ribbon along the island coast where the shelf meets the water line,
// with foam lines that roll in and fade. Medium/High only.
export function createShoreFoam(outline=[],{y=-.355,from=.84,to=.97}={}){
 const pos=[],uv=[],idx=[];let run=0;
 outline.forEach((p,i)=>{const a={x:p.inner.x+(p.outer.x-p.inner.x)*from,z:p.inner.z+(p.outer.z-p.inner.z)*from},b={x:p.inner.x+(p.outer.x-p.inner.x)*to,z:p.inner.z+(p.outer.z-p.inner.z)*to};
  if(i){const o=outline[i-1];run+=Math.hypot(p.inner.x-o.inner.x,p.inner.z-o.inner.z);}
  pos.push(a.x,y,a.z,b.x,y,b.z);uv.push(run,0,run,1);});
 const n=outline.length;for(let i=0;i<n;i++){const j=(i+1)%n,a=i*2,b=j*2;idx.push(a,a+1,b,b,a+1,b+1);}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(idx);
 const u={uTime:{value:0},uLight:{value:1}};
 const mat=new THREE.ShaderMaterial({uniforms:u,transparent:true,depthWrite:false,side:THREE.DoubleSide,
  vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader:'varying vec2 vUv;uniform float uTime;uniform float uLight;'+NOISE+'void main(){float a=vUv.y;float n=gwNoise(vec2(vUv.x*.35,uTime*.25));float lines=smoothstep(.55,.9,.5+.5*sin(a*14.-uTime*1.6+n*4.));float edge=smoothstep(0.,.12,a)*(1.-smoothstep(.55,1.,a));float speck=smoothstep(.35,.75,gwNoise(vec2(vUv.x*1.7,a*6.-uTime*.4)));float f=edge*(lines*.75+speck*.35)*(.75+.25*n);gl_FragColor=vec4(vec3(.93,.97,.96)*(.35+.65*uLight),clamp(f,0.,.85));\n#include <colorspace_fragment>\n}'});
 const mesh=new THREE.Mesh(geo,mat);mesh.name='Gfx shore foam v155';mesh.renderOrder=2;mesh.frustumCulled=false;
 return {mesh,update(t,light,quality){u.uTime.value=t;u.uLight.value=light;mesh.visible=!isLowWorld(quality);}};
}

// Replaces the v132 coastal sky fragment: same gradient, sun halo and stars, but horizon haze and
// domain-warped drifting clouds with lit tops, shaded bases and silver edges (uCloud thickens them).
export const SKY_FRAGMENT='varying vec3 direction;uniform vec3 top;uniform vec3 bottom;uniform float night;uniform float uTime;uniform float uCloud;'+NOISE+
'float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*gwNoise(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}'+
'void main(){vec3 dir=normalize(direction);float h=max(0.,dir.y);vec3 col=mix(bottom,top,pow(h,.45));col=mix(col,bottom*1.04,exp(-h*9.)*.3);'+
'vec2 p=dir.xz/(dir.y+.24)*1.15+vec2(uTime*.0025,uTime*.0007);vec2 wv=vec2(fbm(p*.55+uTime*.0012),fbm(p*.55+4.3));float n=fbm(p+wv*.75);'+
'float cloud=smoothstep(.47-uCloud*.16,.66-uCloud*.18,n)*smoothstep(.05,.32,h);float lit=smoothstep(-.02,.1,n-fbm(p+wv*.75+vec2(.06,.04)));'+
'vec3 sunD=normalize(vec3(-.55,.64,.5));float toward=max(0.,dot(dir,sunD));vec3 base=mix(vec3(.5,.58,.64),vec3(.62,.62,.66),uCloud);vec3 litCloud=mix(base,vec3(1.,.95,.84),.35+.65*lit);'+
'litCloud+=vec3(1.,.8,.55)*pow(toward,6.)*(1.-smoothstep(.5,.7,n))*.35;col=mix(col,litCloud,cloud*(.8+uCloud*.18));'+
'col+=vec3(1.,.64,.31)*pow(toward,24.)*.19*(1.-uCloud*.8)*(1.-cloud*.6);'+
'float star=step(.9975,gwHash(floor(dir.xz/max(.1,dir.y)*420.)))*smoothstep(.12,.4,h)*(1.-smoothstep(.42,.65,night))*(1.-cloud);col+=vec3(.55,.67,.8)*star;'+
'gl_FragColor=vec4(col*night,1.);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}';

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
