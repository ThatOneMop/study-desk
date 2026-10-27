// v168: a proper grow tent. Black canvas shell with a rolled-up zip door, silver reflective lining, a hanging
// LED panel, carbon filter and duct, clip fan, a black fabric pot of real-looking soil and a green watering can.
// Three merged vertex-coloured meshes per tent (matte, mylar, LED) plus one soil cap whose colour shows wetness.
// Original procedural geometry; no third-party assets.
export const TENT=Object.freeze({w:2.3,d:2.3,h:2.25,potR:.42,potH:.66});
const SOIL=Object.freeze({dry:0x8a6a4a,damp:0x5a4029,wet:0x33241a});

function rng(seed){let a=seed>>>0;return()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
function bucket(){return {pos:[],col:[],idx:[]};}
function push(b,verts,hex,shade=1){const base=b.pos.length/3,r=(hex>>16&255)/255*shade,g=(hex>>8&255)/255*shade,bl=(hex&255)/255*shade;for(const v of verts){b.pos.push(v[0],v[1],v[2]);b.col.push(r,g,bl);}return base;}
function quad(b,a,c,d,e,hex,shade){const i=push(b,[a,c,d,e],hex,shade);b.idx.push(i,i+1,i+2,i,i+2,i+3);}
export function addBox(b,x,y,z,w,h,d,hex,{skip=''}={}){
 const X=[x-w/2,x+w/2],Y=[y-h/2,y+h/2],Z=[z-d/2,z+d/2];
 if(!skip.includes('+y'))quad(b,[X[0],Y[1],Z[1]],[X[1],Y[1],Z[1]],[X[1],Y[1],Z[0]],[X[0],Y[1],Z[0]],hex,1);
 if(!skip.includes('-y'))quad(b,[X[0],Y[0],Z[0]],[X[1],Y[0],Z[0]],[X[1],Y[0],Z[1]],[X[0],Y[0],Z[1]],hex,.55);
 if(!skip.includes('+z'))quad(b,[X[0],Y[0],Z[1]],[X[1],Y[0],Z[1]],[X[1],Y[1],Z[1]],[X[0],Y[1],Z[1]],hex,.9);
 if(!skip.includes('-z'))quad(b,[X[1],Y[0],Z[0]],[X[0],Y[0],Z[0]],[X[0],Y[1],Z[0]],[X[1],Y[1],Z[0]],hex,.8);
 if(!skip.includes('+x'))quad(b,[X[1],Y[0],Z[1]],[X[1],Y[0],Z[0]],[X[1],Y[1],Z[0]],[X[1],Y[1],Z[1]],hex,.85);
 if(!skip.includes('-x'))quad(b,[X[0],Y[0],Z[0]],[X[0],Y[0],Z[1]],[X[0],Y[1],Z[1]],[X[0],Y[1],Z[0]],hex,.75);
}
// Vertical cylinder (open or capped), n sides, optional taper and per-side shade jitter for fabric folds.
export function addCyl(b,x,y,z,r0,r1,h,hex,{n=12,cap=true,jit=0,seed=1,axis='y'}={}){
 const R=rng(seed),P=(a,r,yy)=>{const c=Math.cos(a)*r,s=Math.sin(a)*r;return axis==='x'?[x+yy,y+c,z+s]:axis==='z'?[x+c,y+s,z+yy]:[x+c,y+yy,z+s];};
 for(let i=0;i<n;i++){const a0=i/n*Math.PI*2,a1=(i+1)/n*Math.PI*2,sh=.78+.22*Math.abs(Math.cos(a0+.6))-R()*jit;
  quad(b,P(a1,r0,-h/2),P(a0,r0,-h/2),P(a0,r1,h/2),P(a1,r1,h/2),hex,sh);
  if(cap){const i0=push(b,[P(0,0,h/2),P(a0,r1,h/2),P(a1,r1,h/2)],hex,1);b.idx.push(i0,i0+2,i0+1);}}
}
export function tentParts(seed=168){
 const matte=bucket(),mylar=bucket(),led=bucket(),{w,d,h,potR,potH}=TENT,hw=w/2,hd=d/2,t=.035,R=rng(seed);
 const CANVAS=0x101112,SEAM=0x232528,FRAME=0x9aa0a6,ZIP=0x0d0d0e;
 // Floor tray, black outer walls (back, sides), roof; front has two narrow panels either side of the door.
 addBox(matte,0,.03,0,w,.06,d,0x2a2b2d);
 addBox(matte,0,h/2,-hd,w,h,t,CANVAS,{skip:'+z'});
 addBox(matte,-hw,h/2,0,t,h,d,CANVAS,{skip:'+x'});addBox(matte,hw,h/2,0,t,h,d,CANVAS,{skip:'-x'});
 addBox(matte,0,h,0,w+.02,t,d+.02,CANVAS,{skip:'-y'});
 for(const sx of [-1,1])addBox(matte,sx*(hw-.2),h/2,hd,.4,h,t,CANVAS,{skip:'-z'});
 addBox(matte,0,h-.14,hd,w-.8,.28,t,CANVAS,{skip:'-z'});
 // Door flap rolled up and strapped, zip lines, seams, a small brand-free vent window.
 addCyl(matte,0,h-.38,hd+.07,.09,.09,w-.86,0x232427,{axis:'x',n:10,jit:.08,seed:3});
 for(const sx of [-.3,.3])addBox(matte,sx,h-.38,hd+.07,.035,.24,.2,0x111111);
 for(const sx of [-1,1])addBox(matte,sx*(hw-.4),h/2-.08,hd+.02,.025,h-.32,.012,ZIP);
 for(const sx of [-1,1])for(const sz of [-1,1])addBox(matte,sx*hw,h/2,sz*hd,.05,h+.02,.05,SEAM);
 addBox(matte,-hw-.02,h*.72,-.4,.012,.36,.36,0x3b3d40);
 // Silver mylar lining on the inside of back, sides and roof (slightly crinkled panels).
 for(let k=0;k<3;k++){const zz=-hd+.03,x0=-hw+.04+k*(w-.08)/3,x1=x0+(w-.08)/3,s=.86+R()*.14;quad(mylar,[x0,.08,zz],[x1,.08,zz],[x1,h-.04,zz],[x0,h-.04,zz],0xf2f4f6,s);}
 for(const sx of [-1,1])for(let k=0;k<3;k++){const xx=sx*(hw-.03),z0=-hd+.04+k*(d-.08)/3,z1=z0+(d-.08)/3,s=.82+R()*.16;sx<0?quad(mylar,[xx,.08,z1],[xx,.08,z0],[xx,h-.04,z0],[xx,h-.04,z1],0xf2f4f6,s):quad(mylar,[xx,.08,z0],[xx,.08,z1],[xx,h-.04,z1],[xx,h-.04,z0],0xf2f4f6,s);}
 quad(mylar,[-hw+.04,h-.03,hd-.04],[hw-.04,h-.03,hd-.04],[hw-.04,h-.03,-hd+.04],[-hw+.04,h-.03,-hd+.04],0xbfc4c8,.8);
 // Frame bars, LED panel on ratchet hangers, carbon filter + duct, clip fan on a corner pole.
 for(const sx of [-.55,.55])addBox(matte,sx,h-.1,0,.025,.025,d-.1,FRAME);
 for(const sx of [-.4,.4])for(const sz of [-.25,.25])addBox(matte,sx,h-.28,sz,.01,.34,.01,0x202020);
 addBox(matte,0,h-.47,0,1.0,.06,.62,0x2b2c2e);
 for(let k=0;k<6;k++)addBox(led,-.42+k*.168,h-.505,0,.11,.012,.54,0xfff4dc);
 addCyl(matte,-.62,h-.42,-.62,.16,.16,.5,0x3a3c3f,{n:12,seed:5});addCyl(matte,-.62,h-.13,-.62,.06,.06,.2,0x7a7f84,{n:8,cap:false});
 addCyl(matte,-.62,h-.17,-.2,.06,.06,.8,0x8d9297,{n:8,cap:false,axis:'z'});
 addBox(matte,hw-.12,h*.62,hd-.18,.05,.05,.12,0x222222);addCyl(matte,hw-.25,h*.62,hd-.2,.13,.13,.06,0x2e2f31,{axis:'x',n:12,seed:7});
 // Black fabric pot (folded rim, two handles) and a green watering can parked by the door.
 addCyl(matte,0,potH/2+.06,0,potR*.92,potR,potH,0x191a1b,{n:16,cap:false,jit:.12,seed:9});
 addCyl(matte,0,potH+.05,0,potR+.015,potR+.015,.06,0x222324,{n:16,cap:false,seed:11});
 for(const sx of [-1,1])addBox(matte,sx*(potR+.02),potH-.03,0,.03,.08,.12,0x111111);
 addCyl(matte,.78,.2,.75,.12,.11,.3,0x2f8f4e,{n:12,seed:13});addCyl(matte,.78,.38,.75,.035,.035,.08,0x2f8f4e,{n:8});
 addCyl(matte,.98,.33,.75,.022,.03,.36,0x2f8f4e,{axis:'x',n:6,seed:15});addBox(matte,.78,.44,.75,.03,.14,.2,0x267a42);
 addCyl(matte,1.17,.36,.75,.04,.025,.03,0x9da3a8,{axis:'x',n:8});
 // A couple of nutrient bottles and a pH pen for clutter.
 addCyl(matte,-.82,.15,.78,.06,.06,.22,0x2b5aa8,{n:8});addCyl(matte,-.68,.13,.82,.055,.055,.18,0xe0d8c4,{n:8});addCyl(matte,-.82,.28,.78,.03,.03,.04,0x111111,{n:6});
 return {matte,mylar,led};
}
function meshOf(THREE,b,material){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(b.pos,3));g.setAttribute('color',new THREE.Float32BufferAttribute(b.col,3));g.setIndex(b.idx);g.computeVertexNormals();return new THREE.Mesh(g,material);}
let shared=null;
export function buildGrowTent(THREE){
 if(!shared){const p=tentParts();shared={
  matte:meshOf(THREE,p.matte,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.92,metalness:0})),
  mylar:meshOf(THREE,p.mylar,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.38,metalness:.35,emissive:0x2a2c2e,side:THREE.DoubleSide})),
  led:meshOf(THREE,p.led,new THREE.MeshStandardMaterial({vertexColors:true,emissive:0xfff0d0,emissiveIntensity:1.6,roughness:.5})),
  soil:new THREE.CylinderGeometry(TENT.potR*.93,TENT.potR*.93,.04,16)};}
 const g=new THREE.Group();g.name='GrowTentV168';
 for(const k of ['matte','mylar','led']){const m=new THREE.Mesh(shared[k].geometry,shared[k].material);m.castShadow=k==='matte';m.receiveShadow=true;m.userData.tentPart=k;g.add(m);}
 const soil=new THREE.Mesh(shared.soil,new THREE.MeshStandardMaterial({color:SOIL.dry,roughness:1}));soil.position.y=TENT.potH+.02;soil.receiveShadow=true;soil.userData.tentPart='soil';g.add(soil);
 g.userData.soil=soil;return g;
}
// Soil colour follows the plant: fresh bag soil, wet after watering, drying out as it gets thirsty.
export function soilWetness(plant,now=Date.now()){
 if(!plant)return 0;const ph=plant.phase;
 if(ph==='dry')return .05;if(ph==='thirsty')return .3;if(ph==='soil')return .15;if(ph==='mature')return .45;
 if(Number.isFinite(plant.start)&&Number.isFinite(plant.end)&&plant.end>plant.start){const f=Math.min(1,Math.max(0,(now-plant.start)/(plant.end-plant.start)));return 1-.55*f;}
 return .8;
}
export function soilColor(THREE,wet,out=new THREE.Color()){const a=new THREE.Color(SOIL.dry),b=new THREE.Color(SOIL.damp),c=new THREE.Color(SOIL.wet);return wet<.5?out.copy(a).lerp(b,wet*2):out.copy(b).lerp(c,(wet-.5)*2);}
export function updateGrowTent(THREE,group,plant,{now=Date.now()}={}){
 const soil=group?.userData?.soil;if(!soil)return null;const wet=soilWetness(plant,now);soilColor(THREE,wet,soil.material.color);soil.material.roughness=1-.45*wet;
 return wet;
}
