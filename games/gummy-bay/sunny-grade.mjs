// v161: bright, saturated daytime grade (Tom: "graphics are top priority").
// A post-pass over the clock lighting: blue zenith, pale-blue horizon, warmer stronger sun and a
// sky/ground hemisphere fill so shaded walls stay readable. Night, dusk and rain keep the old look.
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
export const SUNNY=Object.freeze({zenith:0x2f86e8,horizon:0x92c6ef,fog:0xa9d2f0,sun:0xffe9c2,hemiSky:0xc3defc,hemiGround:0x9a8a66,sunBoost:.42,hemiBoost:.38,exposure:.07});
// strength 0..1: full on a clear day, fades with dusk, cloud cover and rain.
export function sunnyStrength({daylight=0,cloud=0,rain=0,mist=0}={}){
 const day=clamp((daylight-.35)/.4);
 return clamp(day*(1-clamp(rain)*.85)*(1-clamp(cloud)*.45)*(1-clamp(mist)*.3));
}
export function applySunnyGrade({THREE,k,sun,hemi,scene,skyUniforms,renderer,waterUniforms,cloud=0}){
 if(!(k>0))return 0;
 const c=new THREE.Color();
 // undo most of the overcast dimming on bright days, then boost
 sun.intensity*=1+SUNNY.sunBoost*k+clamp(cloud)*.3*k;sun.color.lerp(c.setHex(SUNNY.sun),.6*k);
 hemi.intensity*=1+SUNNY.hemiBoost*k;hemi.color.lerp(c.setHex(SUNNY.hemiSky),.7*k);hemi.groundColor.lerp(c.setHex(SUNNY.hemiGround),.6*k);
 if(skyUniforms?.top)skyUniforms.top.value.lerp(c.setHex(SUNNY.zenith),.8*k);
 if(scene?.fog){scene.fog.color.lerp(c.setHex(SUNNY.fog),.75*k);scene.fog.near*=1+.5*k;scene.fog.far*=1+.6*k;if(scene.background?.isColor)scene.background.copy(scene.fog.color);}
 if(skyUniforms?.bottom)skyUniforms.bottom.value.lerp(c.setHex(SUNNY.horizon),.75*k);
 if(waterUniforms?.uFog)waterUniforms.uFog.value.copy(scene.fog.color);
 if(renderer)renderer.toneMappingExposure*=1+SUNNY.exposure*k;
 return k;
}
