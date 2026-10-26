// Push a saved or teleported body out of solid town geometry.
// The search is bounded so a bad coordinate cannot walk the whole map.
export function nearestOpenPoint(x,z,blocked,{radius=6,step=.25}={}){
 if(!Number.isFinite(x)||!Number.isFinite(z)||typeof blocked!=='function')return null;
 const limit=Number.isFinite(radius)&&radius>0?Math.min(radius,12):6;
 const cell=Number.isFinite(step)&&step>0?Math.min(step,.5):.25;
 if(!blocked(x,z))return {x,z,distance:0};
 const cells=Math.ceil(limit/cell),offsets=[];
 for(let ix=-cells;ix<=cells;ix++)for(let iz=-cells;iz<=cells;iz++){
  const dx=ix*cell,dz=iz*cell,d=dx*dx+dz*dz;
  if(d===0||d>limit*limit)continue;
  offsets.push({dx,dz,d});
 }
 offsets.sort((a,b)=>a.d-b.d||a.dz-b.dz||a.dx-b.dx);
 for(const offset of offsets){
  const nx=x+offset.dx,nz=z+offset.dz;
  if(!blocked(nx,nz))return {x:nx,z:nz,distance:Math.hypot(offset.dx,offset.dz)};
 }
 return null;
}
