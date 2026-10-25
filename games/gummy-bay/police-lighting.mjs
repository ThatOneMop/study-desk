// Presentation only. Host snapshots remain authoritative; no timers/state are advanced.
// The single environmental response borrows one of the two existing practical lights.
export function policeLighting(police,camera,{active=true,connected=true,stale=false,quality='balanced',night=0,now=0,sight=()=>true}={}){
 const empty={signals:[],target:null};
 if(!active||!connected||stale||!camera||![camera.x,camera.z].every(Number.isFinite))return empty;
 const blend=(1+Math.sin((Number.isFinite(now)?now%2:0)*Math.PI))/2; // slow, continuous 2-second colour cycle, not a strobe
 const signals=[];
 for(const [index,c] of (Array.isArray(police?.officers)?police.officers:[]).slice(0,6).entries()){
  if(!c||![c.x,c.z].every(Number.isFinite)||!['stop','pursuit'].includes(c.mode)||!['host','guest'].includes(c.target))continue;
  const distanceSquared=(c.x-camera.x)**2+(c.z-camera.z)**2;
  if(distanceSquared>=36**2||!sight(c,camera))continue;
  signals.push({index,x:c.x,y:1.45,z:c.z,distanceSquared,blend});
 }
 const closest=signals.filter(c=>c.distanceSquared<18**2).sort((a,b)=>a.distanceSquared-b.distanceSquared||a.index-b.index)[0];
 const strength=Number.isFinite(night)?Math.max(0,Math.min(1,night)):0;
 const target=closest&&quality!=='performance'&&strength>0?{...closest,intensity:6*strength*(1-closest.distanceSquared/18**2)}:null;
 return {signals,target};
}
