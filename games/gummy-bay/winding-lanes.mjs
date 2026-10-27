// v166: winding laneways near spawn. Tom: narrow, bendy, non-grid streets like Hyland Point's
// back streets. Each lane is a Catmull-Rom curve with its own 5.6 m asphalt, raised footpaths and
// kerbs; buildings are planted along the curve with tight alleys between them. Everything is one
// vertex-coloured merged mesh (one draw call). The grid roads elsewhere are unchanged.
// Pure helpers (lane data, sampling, surfaces, lot planning) have no THREE dependency.
export const LANE_HALF=2.8,LANE_PATH=1.7,LANE_KERB=.16;
export const LANE_EDGE=LANE_HALF+LANE_PATH; // outer edge of the footpath from the centre line
// Control points (x,z). Lanes leave Main Street / the -90 road at pavement edges.
export const WINDING_LANES=Object.freeze([
 Object.freeze({id:'gutter-lane',name:'Gutter Lane',pts:Object.freeze([[10.3,-56],[22,-54],[33,-60],[44,-65],[57,-62.5],[70,-57],[84,-60],[94.9,-63]])}),
 Object.freeze({id:'crook-st',name:'Crook Street',pts:Object.freeze([[57,-62.5],[62,-69],[58,-75],[61,-80.4]])}),
 Object.freeze({id:'drain-row',name:'Drain Row',pts:Object.freeze([[-13.4,-60],[-22,-57],[-30,-62],[-33,-70],[-28,-76],[-31,-80.4]])})
]);
const rng=seed=>{let a=seed>>>0||1;return()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};};
// Centripetal-ish Catmull-Rom sampled about every `step` metres; returns [{x,z,tx,tz,s}].
export function sampleLane(pts,step=1.5){
 const P=pts.map(p=>({x:p[0],z:p[1]})),n=P.length,out=[];
 const at=(i)=>P[Math.max(0,Math.min(n-1,i))];
 for(let i=0;i<n-1;i++){
  const p0=at(i-1),p1=at(i),p2=at(i+1),p3=at(i+2),len=Math.hypot(p2.x-p1.x,p2.z-p1.z),k=Math.max(2,Math.ceil(len/step));
  for(let j=0;j<k||(i===n-2&&j===k);j++){const t=j/k,t2=t*t,t3=t2*t;
   const f=(a,b,c,d)=>.5*(2*b+(-a+c)*t+(2*a-5*b+4*c-d)*t2+(-a+3*b-3*c+d)*t3);
   out.push({x:f(p0.x,p1.x,p2.x,p3.x),z:f(p0.z,p1.z,p2.z,p3.z)});}
 }
 let s=0;for(let i=0;i<out.length;i++){const a=out[Math.max(0,i-1)],b=out[Math.min(out.length-1,i+1)],l=Math.hypot(b.x-a.x,b.z-a.z)||1;out[i].tx=(b.x-a.x)/l;out[i].tz=(b.z-a.z)/l;if(i)s+=Math.hypot(out[i].x-out[i-1].x,out[i].z-out[i-1].z);out[i].s=s;}
 return out;
}
const SAMPLED=WINDING_LANES.map(l=>({...l,samples:sampleLane(l.pts)}));
export function laneSamples(id){return (SAMPLED.find(l=>l.id===id)||{}).samples||[];}
// Distance from a point to the nearest lane centre line.
export function laneDistance(x,z,lanes=SAMPLED){
 let best={d:Infinity,lane:null};
 for(const l of lanes){const S=l.samples;for(let i=0;i<S.length-1;i++){const a=S[i],b=S[i+1],vx=b.x-a.x,vz=b.z-a.z,ll=vx*vx+vz*vz||1,t=Math.max(0,Math.min(1,((x-a.x)*vx+(z-a.z)*vz)/ll)),d=Math.hypot(x-a.x-vx*t,z-a.z-vz*t);if(d<best.d)best={d,lane:l.id};}}
 return best;
}
// 'road' on the asphalt, 'pavement' on the footpath, null elsewhere.
export function laneSurface(x,z){if(!Number.isFinite(x)||!Number.isFinite(z)||x<-60||x>110||z>-40||z<-95)return null;const {d}=laneDistance(x,z);return d<=LANE_HALF?'road':d<=LANE_EDGE?'pavement':null;}
// Footpath walk lines for the crowd: one per lane side, as [[x,z],...].
export function laneWalks(){const out=[];for(const l of SAMPLED)for(const side of [-1,1]){const w=[];for(let i=0;i<l.samples.length;i+=3){const p=l.samples[i];w.push([+(p.x-p.tz*side*(LANE_HALF+LANE_PATH/2)).toFixed(2),+(p.z+p.tx*side*(LANE_HALF+LANE_PATH/2)).toFixed(2)]);}out.push(w);}return out;}

// Oriented rectangle helpers.
const corners=(o)=>{const c=Math.cos(o.rot),s=Math.sin(o.rot),hw=o.w/2,hd=o.d/2;return [[-hw,-hd],[hw,-hd],[hw,hd],[-hw,hd]].map(([a,b])=>[o.x+a*c+b*s,o.z-a*s+b*c]);};
function obbOverlap(A,B,pad=0){const ca=corners(A),cb=corners(B);for(const C of [ca,cb])for(let i=0;i<4;i++){const p=C[i],q=C[(i+1)%4],nx=q[1]-p[1],nz=p[0]-q[0];const pa=ca.map(v=>v[0]*nx+v[1]*nz),pb=cb.map(v=>v[0]*nx+v[1]*nz),l=Math.hypot(nx,nz);if(Math.max(...pa)+pad*l<Math.min(...pb)||Math.max(...pb)+pad*l<Math.min(...pa))return false;}return true;}
const TYPES=['terrace','shop','terrace','flats','house','shop'];
// Buildings along both sides of every lane, fronts facing the lane, 1.1-2.4 m alleys between.
// clear({x0,x1,z0,z1}) lets the caller veto lots over colliders, gameplay points and routes.
export function planLaneLots({clear=()=>true,seed=166}={}){
 const r=rng(seed),lots=[],alleys=[];
 for(const l of SAMPLED)for(const side of [-1,1]){
  const S=l.samples,total=S[S.length-1].s;let s=6+r()*2;
  while(s<total-5){
   const w=5+r()*3.5,d=6+r()*2.8,mid=s+w/2;
   let i=S.findIndex(p=>p.s>=mid);if(i<0)break;const p=S[i];
   const nx=-p.tz*side,nz=p.tx*side,base=LANE_EDGE+.5+d/2;
   const lot={id:'lane-'+l.id+'-'+lots.length,x:0,z:0,w,d,rot:Math.atan2(-nx,-nz),type:TYPES[Math.floor(r()*TYPES.length)],floors:2+Math.floor(r()*3),seed:Math.floor(r()*1e9),lane:l.id};
   // on the inside of a bend the building steps back until its corners clear the footpath
   let cs=null,onLane=true;
   for(let push=0;push<=4.5&&onLane;push+=.5){lot.x=p.x+nx*(base+push);lot.z=p.z+nz*(base+push);cs=corners(lot);onLane=cs.concat([[lot.x,lot.z]]).some(c=>laneDistance(c[0],c[1]).d<LANE_EDGE+.4);}
   const bb={x0:Math.min(...cs.map(c=>c[0])),x1:Math.max(...cs.map(c=>c[0])),z0:Math.min(...cs.map(c=>c[1])),z1:Math.max(...cs.map(c=>c[1]))};
   if(!onLane&&!lots.some(o=>obbOverlap(o,lot,.5))&&clear(bb,lot)){lot.bb=bb;lots.push(lot);const g=1.1+r()*1.3;alleys.push({lane:l.id,x:lot.x,z:lot.z,s:s+w,width:g});s+=w+g;}
   else s+=1.5;
  }
 }
 return {lots,alleys};
}
// Axis-aligned collider boxes approximating each rotated lot (3 slices along its width).
export function laneLotColliders(lot){const out=[],c=Math.cos(lot.rot),s=Math.sin(lot.rot);for(const k of [-1,0,1]){const ox=k*lot.w/3,cx=lot.x+ox*c,cz=lot.z-ox*s,hw=lot.w/6,hd=lot.d/2;const ex=Math.abs(hw*c)+Math.abs(hd*s),ez=Math.abs(hw*s)+Math.abs(hd*c);out.push({x:cx,z:cz,w:ex*2*.86,d:ez*2*.86,laneLot:lot.id});}return out;}
// Planning blocks so the grid city keeps off the lanes (sampled squares over asphalt + paths).
export function laneBlocks(step=3){const out=[];for(const l of SAMPLED)for(let i=0;i<l.samples.length;i+=2){const p=l.samples[i];out.push({x:p.x,z:p.z,w:LANE_EDGE*2,d:LANE_EDGE*2,lane:l.id});}return out;}

// Geometry: one merged, vertex-coloured mesh. Asphalt ribbon, two footpaths with kerb faces,
// a dark gutter strip, patched asphalt, and a few wheelie bins / dumpsters at alley mouths.
export function buildLaneMesh(THREE,{height=()=>0,alleys=[],seed=166}={}){
 const pos=[],col=[],idx=[],r=rng(seed),C=new THREE.Color();
 const quad=(a,b,c,d,hex,jit=.04)=>{const base=pos.length/3;C.setHex(hex);const k=1+(r()-.5)*jit*2;for(const v of [a,b,c,d]){pos.push(v[0],v[1],v[2]);col.push(C.r*k,C.g*k,C.b*k);}idx.push(base,base+1,base+2,base,base+2,base+3);};
 const boxQ=(x,y,z,w,h,d,ry,hex)=>{const c=Math.cos(ry),s=Math.sin(ry),P=(a,b,e)=>[x+a*c+e*s,y+b,z-a*s+e*c],hw=w/2,hd=d/2;
  const v=[P(-hw,0,-hd),P(hw,0,-hd),P(hw,0,hd),P(-hw,0,hd),P(-hw,h,-hd),P(hw,h,-hd),P(hw,h,hd),P(-hw,h,hd)];
  quad(v[4],v[7],v[6],v[5],hex);quad(v[3],v[2],v[6],v[7],hex,0);quad(v[1],v[0],v[4],v[5],hex,0);quad(v[0],v[3],v[7],v[4],hex,0);quad(v[2],v[1],v[5],v[6],hex,0);};
 const ASPH=[0x393a3a,0x363733,0x3c3c39],PATH=[0x8f8a7f,0x86826f,0x9a9486],KERB=0x77736a,GUTTER=0x2b2a26;
 for(const l of SAMPLED){const S=l.samples;
  for(let i=0;i<S.length-1;i++){const a=S[i],b=S[i+1],ya=height(a.x,a.z),yb=height(b.x,b.z);
   const off=(p,y,o,h)=>[p.x-p.tz*o,y+h,p.z+p.tx*o];
   const tone=ASPH[Math.floor(r()*3)];
   quad(off(a,ya,-LANE_HALF,.03),off(a,ya,LANE_HALF,.03),off(b,yb,LANE_HALF,.03),off(b,yb,-LANE_HALF,.03),tone,.015);
   for(const side of [-1,1]){const o0=side*LANE_HALF,o1=side*(LANE_HALF+.38),o2=side*LANE_EDGE,pt=PATH[(i>>1)%3];
    const q=(o,h,p,y)=>off(p,y,o,h);
    if(side>0){quad(q(o0-.5*side,.035,a,ya),q(o0,.035,a,ya),q(o0,.035,b,yb),q(o0-.5*side,.035,b,yb),GUTTER,.08);
     quad(q(o0,.03,a,ya),q(o0,LANE_KERB,a,ya),q(o0,LANE_KERB,b,yb),q(o0,.03,b,yb),KERB,0);
     quad(q(o0,LANE_KERB,a,ya),q(o1,LANE_KERB,a,ya),q(o1,LANE_KERB,b,yb),q(o0,LANE_KERB,b,yb),KERB,.03);
     quad(q(o1,LANE_KERB,a,ya),q(o2,LANE_KERB,a,ya),q(o2,LANE_KERB,b,yb),q(o1,LANE_KERB,b,yb),pt,.06);}
    else{quad(q(o0,.035,a,ya),q(o0-.5*side,.035,a,ya),q(o0-.5*side,.035,b,yb),q(o0,.035,b,yb),GUTTER,.08);
     quad(q(o0,LANE_KERB,a,ya),q(o0,.03,a,ya),q(o0,.03,b,yb),q(o0,LANE_KERB,b,yb),KERB,0);
     quad(q(o1,LANE_KERB,a,ya),q(o0,LANE_KERB,a,ya),q(o0,LANE_KERB,b,yb),q(o1,LANE_KERB,b,yb),KERB,.03);
     quad(q(o2,LANE_KERB,a,ya),q(o1,LANE_KERB,a,ya),q(o1,LANE_KERB,b,yb),q(o2,LANE_KERB,b,yb),pt,.06);}
   }
  }
  // patched asphalt and a manhole every so often
  for(let i=4;i<S.length-2;i+=9+Math.floor(r()*6)){const p=S[i],y=height(p.x,p.z)+.034,o=(r()-.5)*2.6,ry=Math.atan2(p.tx,p.tz);boxQ(p.x-p.tz*o,y,p.z+p.tx*o,.9+r()*1.1,.004,.8+r()*1.2,ry+r()*.3,r()<.5?0x2a2b29:0x43433f);}
 }
 const bins=[];
 for(const a of alleys){if(r()>.45)continue;const S=laneSamples(a.lane),p=S.find(q=>q.s>=a.s)||S[S.length-1];if(!p)continue;
  for(const side of [-1,1]){if(r()<.5)continue;const o=side*(LANE_HALF+LANE_PATH*.6),x=p.x-p.tz*o,z=p.z+p.tx*o,ry=Math.atan2(p.tx,p.tz),y=height(x,z)+LANE_KERB,big=r()<.35;
   if(big){boxQ(x,y,z,1.6,1.05,.9,ry,0x2f4a36);boxQ(x,y+1.05,z,1.66,.08,.96,ry,0x22352a);bins.push({x,z,w:1.4,d:1.4});}
   else{boxQ(x,y,z,.55,.92,.6,ry,r()<.5?0x2e5a3a:0x3b3e44);bins.push({x,z,w:.6,d:.6});}
   break;}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));g.setIndex(idx);g.computeVertexNormals();g.computeBoundingSphere();
 const mesh=new THREE.Mesh(g,new THREE.MeshLambertMaterial({vertexColors:true}));mesh.name='Winding lanes v166';mesh.receiveShadow=true;mesh.matrixAutoUpdate=false;mesh.updateMatrix();
 return {mesh,bins,verts:pos.length/3};
}
// Lamp spots on the footpaths (light-grade.mjs format): every ~17 m, alternating sides, arm toward the lane.
export function laneLampSpots(spacing=17){const out=[];for(const l of SAMPLED){let k=0;for(let s=5;s<l.samples[l.samples.length-1].s-3;s+=spacing,k++){const p=l.samples.find(q=>q.s>=s);const side=k%2?1:-1,o=LANE_HALF+LANE_PATH-.35,nx=-p.tz*side,nz=p.tx*side;const x=p.x+nx*o,z=p.z+nz*o;out.push(Math.abs(nz)>=Math.abs(nx)?{x,z,face:-Math.sign(nz),axis:'z',lane:l.id}:{x,z,face:-Math.sign(nx),axis:'x',lane:l.id});}}return out;}
