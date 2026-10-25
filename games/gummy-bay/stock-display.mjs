// Read-only stock previews. A large early flavour must not hide every later one.
export function stockDisplay(stock, limit=12) {
 const counts=Array.from(stock||[],n=>Number.isFinite(n)?Math.max(0,Math.floor(n)):0);
 const bounded=Math.min(12,Math.max(0,Math.floor(Number(limit)||0)));
 const total=counts.reduce((sum,n)=>sum+n,0),slots=[];
 for(let round=0;slots.length<bounded;round++){
  let added=false;
  for(let type=0;type<counts.length&&slots.length<bounded;type++){
   if(counts[type]>round){slots.push(type);added=true;}
  }
  if(!added)break;
 }
 return {total,slots,hidden:total-slots.length,flavours:counts.filter(n=>n>0).length};
}
