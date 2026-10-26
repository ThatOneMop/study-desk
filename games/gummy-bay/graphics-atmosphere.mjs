import * as THREE from './vendor/three.module.min.js';
import {SKY_FRAGMENT,OCEAN_FRAGMENT} from './gfx-world.mjs?v=155';
// Art-direction stage 1. Sky and sea are world-space, never screen overlays.
export const COAST_SKY_FRAGMENT=`
varying vec3 direction;
uniform vec3 top,bottom;uniform float night,uTime,uCloud;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
void main(){
 vec3 dir=normalize(direction);float h=max(0.,dir.y);vec3 col=mix(bottom,top,pow(h,.45));
 // v129: a smooth perspective divide. The old max(.19,dir.y) clamp froze the noise
 // below 11 degrees, which drew vertical rain-like streaks down to the horizon.
 vec2 p=dir.xz/(dir.y+.24)*1.25+vec2(uTime*.0025,uTime*.0007);
 float n=noise(p)*.52+noise(p*2.03)*.28+noise(p*4.11)*.14+noise(p*8.13)*.06;
 float cloud=smoothstep(.46-uCloud*.16,.7-uCloud*.18,n)*smoothstep(.05,.32,h);
 vec3 litCloud=mix(vec3(.51,.60,.64),vec3(1.,.93,.79),smoothstep(.46,.7,n));
 col=mix(col,litCloud,cloud*(.78+uCloud*.2)*night);
 float halo=pow(max(0.,dot(dir,normalize(vec3(-.55,.64,.5)))),24.);
 col+=vec3(1.,.64,.31)*halo*.19*night*(1.-uCloud*.8);
 float star=step(.9975,hash(floor(dir.xz/max(.1,dir.y)*420.)))*smoothstep(.12,.4,h)*(1.-smoothstep(.42,.65,night));
 col+=vec3(.55,.67,.8)*star;
 gl_FragColor=vec4(col*night,1.);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`;
export const COAST_WATER_FRAGMENT=`
varying vec2 vUv;varying vec3 world;uniform float uTime,uLight,uFogNear,uFogFar,uCloud;uniform vec3 uFog;
void main(){
 float distanceToEye=distance(cameraPosition,world);
 float crest=sin(world.x*.19+world.z*.52-uTime*.9)+.46*sin(world.x*.49-world.z*.27+uTime*.56);
 float broad=sin(world.z*.08+world.x*.025)*.5+.5;
 vec3 deep=vec3(.075,.22,.26),shallows=vec3(.24,.47,.43);
 vec3 col=mix(deep,shallows,clamp(1.-abs(max(abs(world.x)-310.,abs(world.z+177.)-292.))/55.,0.,1.));
 col+=broad*.035;
 float detail=1.-smoothstep(40.,155.,distanceToEye);
 float foam=smoothstep(1.05,1.42,crest)*detail;
 float shore=exp(-abs(max(abs(world.x)-325.,abs(world.z+177.)-305.)-sin(world.x*.075+world.z*.06)*1.2)*.38);
 col=mix(col,vec3(.75,.82,.69),foam*.22+shore*(.18+.22*sin(uTime*.6+world.x*.1)));
 float glint=pow(max(0.,sin(world.x*.45+world.z*.68+uTime*.45)),24.)*detail;
 col+=vec3(.33,.3,.19)*glint*.2;
 col*=uLight*(1.-uCloud*.18);
 float fog=smoothstep(uFogNear,uFogFar,distanceToEye);
 gl_FragColor=vec4(mix(col,uFog,fog),1.);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`;
// v155 graphics step 6: the sky and sea now use the richer gfx-world.mjs shaders (COAST_* kept for reference).
export function createAtmosphereOverhaul({sky,water}){
 sky.material.uniforms.uTime={value:0};sky.material.uniforms.uCloud={value:0};water.material.uniforms.uCloud={value:0};sky.material.fragmentShader=SKY_FRAGMENT;sky.material.needsUpdate=true;
 water.material.fragmentShader=OCEAN_FRAGMENT;water.material.needsUpdate=true;
 return {update(time,weather={cloud:0}){sky.material.uniforms.uTime.value=Number.isFinite(time)?time:0;const cloud=Math.max(0,Math.min(1,Number(weather.cloud)||0));sky.material.uniforms.uCloud.value=cloud;water.material.uniforms.uCloud.value=cloud;}};
}
// Stable, subtle contact shading. Uses one reusable gradient, no extra lights.
export function contactTexture(){
 const n=64,data=new Uint8Array(n*n*4);
 for(let y=0;y<n;y++)for(let x=0;x<n;x++){const r=Math.hypot((x+.5)/n*2-1,(y+.5)/n*2-1),i=(y*n+x)*4;data[i]=20;data[i+1]=28;data[i+2]=30;data[i+3]=Math.round(Math.max(0,1-r)**2*115);}
 const t=new THREE.DataTexture(data,n,n);t.needsUpdate=true;return t;
}

// A deterministic 36-hour marine cycle derived from the saved day and clock.
// Smooth transitions prevent abrupt lighting changes on a moving player.
export function coastalWeather(day=1,minutes=540){
 const clock=(Math.max(1,Number.isFinite(day)?day:1)-1)*1440+(Number.isFinite(minutes)?minutes:540);
 const phase=(clock-540)/2160*Math.PI*2;
 const cloud=(1-Math.cos(phase))*.5;
 const mist=Math.pow(Math.max(0,Math.sin(phase-.7)),2)*.7;
 return Object.freeze({cloud,mist,label:mist>.4?'Sea mist':cloud>.62?'Overcast':cloud>.22?'Passing clouds':'Clear coast'});
}
