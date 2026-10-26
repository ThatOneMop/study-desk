// Walk-height shells for the Blender town. Authored boxes stay in place.
// This only fills vertical surfaces the player can currently pass through:
// orphan walls, facade lips, and glass. Floors, roofs, and named openings stay clear.
export const TOWN_SHELL_PAD=.65;
const WALK_PLANES=Object.freeze([.7,1.15]);

const finite=n=>Number.isFinite(n);
function rectContains(rect,x,z){
 return !!rect&&finite(rect.x)&&finite(rect.z)&&finite(rect.w)&&finite(rect.d)&&rect.w>0&&rect.d>0&&Math.abs(x-rect.x)<rect.w/2&&Math.abs(z-rect.z)<rect.d/2;
}
function ignored(object,ignoreName){
 if(typeof ignoreName!=='function')return false;
 for(let node=object;node;node=node.parent)if(ignoreName(node.name))return true;
 return false;
}
function sliceSegment(ax,ay,az,bx,by,bz,cx,cy,cz,y){
 const verts=[[ax,ay,az],[bx,by,bz],[cx,cy,cz]],hits=[];
 for(let edge=0;edge<3;edge++){
  const p=verts[edge],q=verts[(edge+1)%3],dy=q[1]-p[1];
  if(Math.abs(dy)<1e-8){if(Math.abs(p[1]-y)<1e-4)hits.push([p[0],p[2]],[q[0],q[2]]);continue;}
  const t=(y-p[1])/dy;
  if(t<-1e-6||t>1+1e-6)continue;
  hits.push([p[0]+(q[0]-p[0])*t,p[2]+(q[2]-p[2])*t]);
 }
 if(hits.length<2)return null;
 let a=hits[0],b=hits[1],best=0;
 for(let i=0;i<hits.length;i++)for(let j=i+1;j<hits.length;j++){
  const dist=Math.hypot(hits[i][0]-hits[j][0],hits[i][1]-hits[j][1]);
  if(dist>best){best=dist;a=hits[i];b=hits[j];}
 }
 return best>1e-4?[a,b]:null;
}
function mergeRuns(cells,cell,pad){
 const rows=new Map();
 for(const key of cells){
  const [ix,iz]=key.split(',').map(Number);
  if(!rows.has(iz))rows.set(iz,new Set());
  rows.get(iz).add(ix);
 }
 const groups=new Map();
 for(const iz of [...rows.keys()].sort((a,b)=>a-b)){
  const xs=[...rows.get(iz)].sort((a,b)=>a-b);
  let start=xs[0];
  for(let i=1;i<=xs.length;i++){
   if(i===xs.length||xs[i]!==xs[i-1]+1){
    const key=start+','+xs[i-1];
    if(!groups.has(key))groups.set(key,[]);
    groups.get(key).push(iz);
    start=xs[i];
   }
  }
 }
 const rects=[];
 for(const [key,izs] of groups){
  const [x0,x1]=key.split(',').map(Number);
  const rowsZ=izs.sort((a,b)=>a-b);
  let z0=rowsZ[0],prev=rowsZ[0];
  for(let i=1;i<=rowsZ.length;i++){
   if(i===rowsZ.length||rowsZ[i]!==prev+1){
    const w=(x1-x0+1)*cell,d=(prev-z0+1)*cell;
    rects.push(Object.freeze({x:(x0+x1)/2*cell,z:(z0+prev)/2*cell,w:w+pad,d:d+pad,townShell:true}));
    z0=rowsZ[i];
   }
   prev=rowsZ[i];
  }
 }
 rects.sort((a,b)=>a.x-b.x||a.z-b.z||a.w-b.w||a.d-b.d);
 return Object.freeze(rects);
}

export function townGapColliders(root,{cell=.45,pad=TOWN_SHELL_PAD,covered=null,openFootprints=[],preserve=[],ignoreName=null,planes=WALK_PLANES}={}){
 if(!root||typeof root.traverse!=='function')return Object.freeze([]);
 const step=finite(cell)&&cell>0?cell:.45,extra=finite(pad)&&pad>=0?pad:TOWN_SHELL_PAD,margin=extra/2+step/2;
 const opens=Array.isArray(openFootprints)?openFootprints:[];
 const keeps=(Array.isArray(preserve)?preserve:[]).map(rect=>rect?{...rect,w:rect.w+margin*2,d:rect.d+margin*2}:rect);
 const contains=typeof covered==='function'?covered:()=>false;
 root.updateMatrixWorld?.(true);
 const cells=new Set();
 const v={x:0,y:0,z:0};
 const read=(attr,index,matrix)=>{
  const array=attr.array,item=attr.itemSize,offset=index*item;
  const x=array[offset],y=array[offset+1],z=array[offset+2];
  const e=matrix.elements;
  v.x=e[0]*x+e[4]*y+e[8]*z+e[12];
  v.y=e[1]*x+e[5]*y+e[9]*z+e[13];
  v.z=e[2]*x+e[6]*y+e[10]*z+e[14];
  return [v.x,v.y,v.z];
 };
 root.traverse(object=>{
  if(!object.isMesh||!object.geometry?.attributes?.position||ignored(object,ignoreName))return;
  const position=object.geometry.attributes.position,index=object.geometry.index,matrix=object.matrixWorld;
  const count=index?index.count:position.count;
  const at=i=>{const vi=index?index.getX(i):i;return read(position,vi,matrix);};
  for(let i=0;i<count;i+=3){
   const a=at(i),b=at(i+1),c=at(i+2);
   const abx=b[0]-a[0],aby=b[1]-a[1],abz=b[2]-a[2],acx=c[0]-a[0],acy=c[1]-a[1],acz=c[2]-a[2];
   const nx=aby*acz-abz*acy,ny=abz*acx-abx*acz,nz=abx*acy-aby*acx,length=Math.hypot(nx,ny,nz)||1;
   if(Math.abs(ny)/length>.75)continue;
   for(const y of planes){
    if(!finite(y))continue;
    const segment=sliceSegment(a[0],a[1],a[2],b[0],b[1],b[2],c[0],c[1],c[2],y);
    if(!segment)continue;
    const [p,q]=segment,span=Math.hypot(q[0]-p[0],q[1]-p[1]);
    const samples=Math.max(1,Math.ceil(span/step));
    for(let s=0;s<=samples;s++){
     const t=s/samples,x=p[0]+(q[0]-p[0])*t,z=p[1]+(q[1]-p[1])*t;
     if(opens.some(rect=>rectContains(rect,x,z))||keeps.some(rect=>rectContains(rect,x,z))||contains(x,z))continue;
     cells.add(Math.round(x/step)+','+Math.round(z/step));
    }
   }
  }
 });
 return mergeRuns(cells,step,extra);
}
