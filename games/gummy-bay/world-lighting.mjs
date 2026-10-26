// One read-only clock projection for world lights, fog, sky and water.
// Hue follows the day. Intensities used by street lamps and the two practical
// lights stay on the original curves so saves and the light budget do not move.
const smooth=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
const mix=(a,b,t)=>a+(b-a)*t;
const channel=(hex,shift)=>((hex>>shift)&255)/255;
const toLinear=c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4;
const toSrgb=c=>c<=.0031308?c*12.92:1.055*c**(1/2.4)-.055;
function lerpHex(a,b,t){
 let out=0;
 for(const shift of [16,8,0]){
  const mixed=toSrgb(mix(toLinear(channel(a,shift)),toLinear(channel(b,shift)),t));
  out|=Math.max(0,Math.min(255,Math.round(mixed*255)))<<shift;
 }
 return out;
}
const NIGHT=Object.freeze({sun:0x7b8fc4,sky:0x22304d,ground:0x141418,fog:0x1b2433,exposure:1.08,bloom:.6,elevation:30});
// 05:00 through 19:45, plus the night plateau pinned at 04:00 and 21:00.
const COLOUR_KEYS=Object.freeze([
 Object.freeze({t:4*60,...NIGHT}),
 Object.freeze({t:5*60,sun:0x6b7fa8,sky:0x2a3550,ground:0x1a1a1f,fog:0x2a3448,exposure:1.05,bloom:.5,elevation:25}),
 Object.freeze({t:6.5*60,sun:0xffb27a,sky:0x9fb4cf,ground:0x5b5146,fog:0xc9b9a8,exposure:1,bloom:.4,elevation:6}),
 Object.freeze({t:9*60,sun:0xffe7c4,sky:0xb8d0e6,ground:0x6e6550,fog:0xc3d6e0,exposure:.95,bloom:.3,elevation:35}),
 Object.freeze({t:13*60,sun:0xfff1dc,sky:0xc4d8ea,ground:0x75694f,fog:0xc7dae2,exposure:.92,bloom:.3,elevation:60}),
 Object.freeze({t:17*60,sun:0xffd29a,sky:0xb9c6d6,ground:0x6a5a45,fog:0xd9c6ab,exposure:.95,bloom:.35,elevation:22}),
 Object.freeze({t:18*60+45,sun:0xff9a55,sky:0xc79a8a,ground:0x4f4238,fog:0xd49a7a,exposure:1,bloom:.45,elevation:6}),
 Object.freeze({t:19*60+45,sun:0x8a6a9a,sky:0x4a4f72,ground:0x25222a,fog:0x4a4a66,exposure:1.05,bloom:.55,elevation:-2}),
 Object.freeze({t:21*60,...NIGHT})
]);
function colourSample(minutes){
 const m=((minutes%1440)+1440)%1440;
 if(m>=21*60||m<4*60)return NIGHT;
 let index=0;
 while(index<COLOUR_KEYS.length-1&&m>COLOUR_KEYS[index+1].t)index++;
 const a=COLOUR_KEYS[index],b=COLOUR_KEYS[index+1],u=smooth(a.t,b.t,m);
 return {sun:lerpHex(a.sun,b.sun,u),sky:lerpHex(a.sky,b.sky,u),ground:lerpHex(a.ground,b.ground,u),fog:lerpHex(a.fog,b.fog,u),exposure:mix(a.exposure,b.exposure,u),bloom:mix(a.bloom,b.bloom,u),elevation:mix(a.elevation,b.elevation,u)};
}
// East (+X) at 06:00, west (-X) at 19:30. Night holds a low eastern moon.
function sunAzimuth(minutes){
 const m=((minutes%1440)+1440)%1440;
 if(m>=21*60||m<4*60)return .45;
 return Math.max(0,Math.min(1,(m-6*60)/(13.5*60)))*Math.PI;
}
export function sunOffset(plan){
 const elevation=Math.max(4,Number.isFinite(plan?.elevation)?plan.elevation:50)*Math.PI/180;
 const azimuth=Number.isFinite(plan?.azimuth)?plan.azimuth:.8;
 const distance=68,horizontal=Math.cos(elevation)*distance;
 return {x:Math.cos(azimuth)*horizontal,y:Math.sin(elevation)*distance,z:Math.sin(azimuth)*horizontal};
}
// Morning stays the original 06:00–12:00 quarter-wave (noon is exactly 1).
// Afternoon falls through golden hour and reaches the night floor at 20:00,
// so 18:45 keeps a warm sun instead of the midnight intensity.
export function clockDaylight(minutes){
 const m=((minutes%1440)+1440)%1440;
 if(m<=12*60)return Math.max(0,Math.sin((m-6*60)/1440*Math.PI*2));
 if(m>=20*60)return 0;
 return Math.cos((m-12*60)/(8*60)*Math.PI/2);
}
export function worldLighting(time,active=true){
 const minutes=Number.isFinite(time)?((time%1440)+1440)%1440:540;
 const daylight=active?clockDaylight(minutes):.22;
 const night=1-smooth(.12,.35,daylight);
 const colour=active?colourSample(minutes):null;
 return {minutes,daylight,night,fogMix:Math.max(.08,daylight),warmth:1-smooth(.12,.6,daylight),skyMix:smooth(.12,.6,daylight),
  sunIntensity:active?.18+daylight*2.05:.65,hemisphereIntensity:active?.48+Math.max(.08,daylight)*.60:.5,
  exposure:active?colour.exposure:.83,skyBrightness:.38+Math.max(.12,daylight)*.62,waterBrightness:.3+Math.max(.12,daylight)*.7,
  streetIntensity:8*night,porchEmission:.12+.68*night,
  sunColor:active?colour.sun:0xffe2bb,hemiSky:active?colour.sky:0xb0c5d5,hemiGround:active?colour.ground:0x5e6348,
  fogColor:active?colour.fog:0x26352f,bloom:active?colour.bloom:0,elevation:active?colour.elevation:55,azimuth:active?sunAzimuth(minutes):.9};
}

// Reuse the two existing non-shadow lights. At most 18 combined intensity;
// new workshop anchors do not add lights or make inactive properties occupied.
export function selectPracticalLights(camera,anchors,{active=true,room=false,house=0,quality='balanced'}={}){
 if(!active||quality==='performance'||!camera||![camera.x,camera.z].every(Number.isFinite)||!Array.isArray(anchors))return [];
 const candidates=[];
 for(const [index,a] of anchors.slice(0,64).entries()){
  if(!a||![a.x,a.y,a.z].every(Number.isFinite)||(a.home!==undefined&&(!room||a.home!==house)))continue;
  const distanceSquared=(camera.x-a.x)**2+(camera.z-a.z)**2;
  if(distanceSquared<130)candidates.push({index,x:a.x,y:a.y,z:a.z,home:a.home,id:a.id,distanceSquared,intensity:18*(1-distanceSquared/130)});
 }
 candidates.sort((a,b)=>a.distanceSquared-b.distanceSquared||a.index-b.index);
 const selected=candidates.slice(0,2),total=selected.reduce((n,a)=>n+a.intensity,0),scale=total>18?18/total:1;
 return selected.map(a=>({...a,intensity:a.intensity*scale}));
}
