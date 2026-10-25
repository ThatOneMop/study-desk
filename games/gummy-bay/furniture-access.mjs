// Match the existing .65 total player-clearance padding on solid floor furniture.
export function furnitureFootprint(kind,x,z,width,depth,home){
 if(![x,z,width,depth].every(Number.isFinite)||width<=0||depth<=0)throw new TypeError('Invalid furnishing footprint');
 return Object.freeze({furniture:kind,x,z,w:width+.65,d:depth+.65,home});
}
export function furnitureContains(b,x,z){
 return !!b&&[b.x,b.z,b.w,b.d,x,z].every(Number.isFinite)&&b.w>0&&b.d>0&&Math.abs(x-b.x)<b.w/2&&Math.abs(z-b.z)<b.d/2;
}
// Old saves may be inside newly solid furnishings. Search at most 3 metres on a
// .25 grid, and never cross other walls/furniture on the way out. `blocked` may
// ignore only the enclosing fixtures during the escape segment, not at its end.
export function escapeFurniture(actor,fixtures,blocked){
 if(!actor||![actor.x,actor.z].every(Number.isFinite)||!Array.isArray(fixtures)||typeof blocked!=='function')return null;
 const enclosing=new Set(fixtures.slice(0,32).filter(b=>furnitureContains(b,actor.x,actor.z)));
 return escapeEnclosure(actor,enclosing,blocked);
}
// Shared bounded search; opaque IDs allow rotated tent parts to use the same
// path safety without pretending that the open-front tent is a solid rectangle.
export function escapeEnclosure(actor,enclosing,blocked){
 if(!actor||![actor.x,actor.z].every(Number.isFinite)||!enclosing?.size||typeof enclosing.has!=='function'||typeof blocked!=='function')return null;
 const offsets=[];
 for(let x=-12;x<=12;x++)for(let z=-12;z<=12;z++){const d=x*x+z*z;if(d>0&&d<=144)offsets.push({x:x*.25,z:z*.25,d});}
 offsets.sort((a,b)=>a.d-b.d||a.z-b.z||a.x-b.x);
 for(const offset of offsets){
  const x=actor.x+offset.x,z=actor.z+offset.z;if(blocked(x,z))continue;
  const steps=Math.ceil(Math.hypot(offset.x,offset.z)/.1);let clear=true;
  for(let i=0;i<=steps;i++)if(blocked(actor.x+offset.x*i/steps,actor.z+offset.z*i/steps,enclosing)){clear=false;break;}
  if(clear)return {x,z,distance:Math.hypot(offset.x,offset.z)};
 }
 return null;
}
