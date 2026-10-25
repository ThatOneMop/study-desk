// One read-only clock projection for world lights, fog, sky and water.
const smooth=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
export function worldLighting(time,active=true){
 const minutes=Number.isFinite(time)?((time%1440)+1440)%1440:540;
 const daylight=active?Math.max(0,Math.sin((minutes-360)/1440*Math.PI*2)):.22;
 const night=1-smooth(.12,.35,daylight);
 return {minutes,daylight,night,fogMix:Math.max(.08,daylight),warmth:1-smooth(.12,.6,daylight),skyMix:smooth(.12,.6,daylight),
  sunIntensity:active?.18+daylight*2.05:.65,hemisphereIntensity:active?.48+Math.max(.08,daylight)*.60:.5,
  exposure:active?.88:.83,skyBrightness:.38+Math.max(.12,daylight)*.62,waterBrightness:.3+Math.max(.12,daylight)*.7,
  streetIntensity:8*night,porchEmission:.12+.68*night};
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
