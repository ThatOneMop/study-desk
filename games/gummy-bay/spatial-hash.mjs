// 8 m buckets for the static town boxes. A point only tests the bucket it
// stands in; boxes are inserted into every bucket their footprint touches.
const CELL=8;
const EMPTY=Object.freeze([]);
let source=null,count=-1,tail=null,buckets=new Map();

function rebuild(list){
 source=list;count=list.length;tail=list[count-1]||null;buckets=new Map();
 for(const box of list){
  if(!box||!(box.w>0)||!(box.d>0)||!Number.isFinite(box.x)||!Number.isFinite(box.z))continue;
  const x0=Math.floor((box.x-box.w/2)/CELL),x1=Math.floor((box.x+box.w/2-1e-9)/CELL);
  const z0=Math.floor((box.z-box.d/2)/CELL),z1=Math.floor((box.z+box.d/2-1e-9)/CELL);
  for(let ix=x0;ix<=x1;ix++)for(let iz=z0;iz<=z1;iz++){
   const key=ix+','+iz,bucket=buckets.get(key);
   if(bucket)bucket.push(box);else buckets.set(key,[box]);
  }
 }
}

export function colliderCandidates(list,x,z){
 if(!Array.isArray(list)||!Number.isFinite(x)||!Number.isFinite(z))return EMPTY;
 if(list!==source||list.length!==count||list[list.length-1]!==tail)rebuild(list);
 return buckets.get(Math.floor(x/CELL)+','+Math.floor(z/CELL))||EMPTY;
}

export const COLLIDER_CELL=CELL;
