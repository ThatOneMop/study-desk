// Read-only presentation projection. Never reserves or consumes inventory.
export function stationStatus(s){
 const sum=a=>Array.isArray(a)?a.reduce((n,v)=>n+(Number.isFinite(v)?Math.max(0,v):0),0):0;
 const raw=sum(s.raw),loose=sum(s.gummies),packed=sum(s.packs);
 const reserved=(s.deals||[]).reduce((n,d)=>n+Math.max(0,d.qty||0),0);
 return {
  shaping:raw?'Ready · '+raw+' ingredients':'Missing harvested ingredients',
  packaging:!s.packStation?'Equipment not purchased':!loose?'Waiting for gummies':!s.wrappers?'Missing wrappers':'Ready · '+Math.min(loose,s.wrappers)+' packs possible',
  delivery:Math.max(0,packed-reserved)+' available · '+reserved+' reserved',
 };
}
