// v166: darker, dodgier mood (Tom: "not rainbows and sunshine"). Replaces the v161 sunny post-pass.
// Overcast, hazy daylight: a pale washed-out sun, grey-green sky fill, a dirty grey horizon and a
// closer fog, slightly lower exposure. Nights stay dim but readable (the v134 fill is untouched).
// Plus a cheap sign flicker: a hashed buzz that drops a few signs out for a beat after dark.
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
export const DODGY=Object.freeze({zenith:0x7d878c,horizon:0xa9a69a,fog:0x9c9b90,sun:0xd9d2c0,hemiSky:0x9ba5a2,hemiGround:0x4d4839,
 sunScale:.74,hemiScale:.9,exposure:-.07,nightFog:0x262b31});
// 0..1 overcast strength by day; dusk and night keep most of it (fog/sky tint) but at lower weight.
export function dodgyStrength({daylight=0}={}){return clamp(.45+clamp((daylight-.25)/.45)*.55);}
export function applyDodgyGrade({THREE,k,daylight=1,sun,hemi,scene,skyUniforms,renderer,waterUniforms}){
 if(!(k>0))return 0;
 const c=new THREE.Color(),day=clamp((daylight-.25)/.45),linked=!!(skyUniforms?.bottom&&scene?.fog&&skyUniforms.bottom.value.equals(scene.fog.color));
 sun.intensity*=1-(1-DODGY.sunScale)*k*day;sun.color.lerp(c.setHex(DODGY.sun),.65*k);
 hemi.intensity*=1-(1-DODGY.hemiScale)*k;hemi.color.lerp(c.setHex(DODGY.hemiSky),.6*k*day);hemi.groundColor.lerp(c.setHex(DODGY.hemiGround),.5*k);
 if(skyUniforms?.top)skyUniforms.top.value.lerp(c.setHex(DODGY.zenith),.75*k*day);
 if(skyUniforms?.bottom)skyUniforms.bottom.value.lerp(c.setHex(DODGY.horizon),.7*k*day);
 if(scene?.fog){scene.fog.color.lerp(c.setHex(day>.05?DODGY.fog:DODGY.nightFog),.7*k);if(scene.background?.isColor)scene.background.copy(scene.fog.color);}
 if(linked)skyUniforms.bottom.value.copy(scene.fog.color);
 if(waterUniforms?.uFog&&scene?.fog)waterUniforms.uFog.value.copy(scene.fog.color);
 if(renderer)renderer.toneMappingExposure*=1+DODGY.exposure*k*day;
 return k;
}
const hash=n=>{const s=Math.sin(n*127.1+311.7)*43758.5453;return s-Math.floor(s);};
// Brightness for sign i at time t (seconds): about one sign in four is faulty after dark.
export function signFlicker(i,t,night=1){
 if(night<.3||hash(i)>.26)return 1;
 const slot=Math.floor(t*7+i*13),h=hash(slot*.37+i);
 if(h<.07)return .15; // dropout
 if(h<.16)return .55+.3*Math.sin(t*60+i); // buzz
 return .92+.08*Math.sin(t*3+i);
}
