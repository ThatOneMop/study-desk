// v151 Graphics pass, step 2: materials.
// One original, procedurally generated detail atlas (4x2 tiles of 256px, greyscale,
// mean-normalised to 128): brick, plaster, asphalt with wear, pavement slabs, wood planks,
// roof shingles, grime streaks, concrete. Nothing is imported or traced from any game.
// patchWorldMaterials() adds a world-space detail layer to the existing static town
// materials in their own shader (onBeforeCompile). The surface is chosen per fragment
// from the facing and the existing base colour, so materials, batches and draw calls
// stay exactly the same: the atlas is one shared texture.
export const ATLAS_TILE=256,ATLAS_COLS=4,ATLAS_ROWS=2;
export const TILE=Object.freeze({brick:0,plaster:1,asphalt:2,pavement:3,wood:4,roof:5,grime:6,concrete:7});
const N=ATLAS_TILE;
function rng(seed){let r=seed>>>0;return()=>((r=(r*1664525+1013904223)>>>0)/4294967296);}
// Tileable value noise on an N-periodic lattice.
function noiseField(cells,seed){const r=rng(seed),g=new Float32Array(cells*cells);for(let i=0;i<g.length;i++)g[i]=r();
 return(x,y)=>{const fx=x/N*cells,fy=y/N*cells,x0=Math.floor(fx),y0=Math.floor(fy),tx=fx-x0,ty=fy-y0,sx=tx*tx*(3-2*tx),sy=ty*ty*(3-2*ty);
  const at=(a,b)=>g[((b%cells+cells)%cells)*cells+((a%cells+cells)%cells)];
  return (at(x0,y0)*(1-sx)+at(x0+1,y0)*sx)*(1-sy)+(at(x0,y0+1)*(1-sx)+at(x0+1,y0+1)*sx)*sy;};}
function tileValues(kind){
 const v=new Float32Array(N*N),r=rng(17+kind*101),big=noiseField(4,kind*7+3),mid=noiseField(16,kind*13+5),fine=noiseField(64,kind*19+11),streaks=noiseField(32,991);
 const grain=(x,y)=>(fine(x,y)-.5)*.5+(mid(x,y)-.5)*.35+(big(x,y)-.5)*.3;
 for(let y=0;y<N;y++)for(let x=0;x<N;x++){
  let o=0;const gr=grain(x,y);
  if(kind===TILE.brick){const row=y>>4,bx=(x+(row%2)*16)&255,col=bx>>5,mortar=(y&15)<2||(bx&31)<2;
   const tone=((row*31+col*17)%7)/7-.5;o=mortar?.28:-.05+tone*.22+gr*.35+(r()-.5)*.08;}
  else if(kind===TILE.plaster)o=gr*.5+(r()-.5)*.05;
  else if(kind===TILE.asphalt){const u=x/N;const lane=Math.exp(-((u-.3)**2)/.004)+Math.exp(-((u-.7)**2)/.004);
   o=(r()-.5)*.28+gr*.4-lane*.1+(big(x+40,y+90)>.72?.12:0);}
  else if(kind===TILE.pavement){const joint=(x&63)<2||(y&63)<2,slab=((x>>6)*5+(y>>6)*3)%4/4-.4;o=joint?-.28:slab*.14+gr*.35+(r()-.5)*.1;}
  else if(kind===TILE.wood){const plank=y>>5,joint=(y&31)<2||((x+plank*83)&255)<2;const streak=Math.sin((y+mid(x,y)*14)*1.7)*.5;o=joint?-.5:streak*.16+gr*.25+(plank%3-1)*.06;}
  else if(kind===TILE.roof){const row=Math.floor(y/21),tab=((x+(row%2)*16)&31)<2,inRow=(y%21)/21;o=tab?-.35:(inRow-.5)*.3+gr*.3+((row*7+(x>>5))%5/5-.5)*.12;}
  else if(kind===TILE.grime){const streak=streaks(x,0),drip=Math.pow(1-y/N,1.5);o=-Math.max(0,streak-.45)*drip*1.3+gr*.15;}
  else o=gr*.45+(r()<.01?-.4:0);
  v[y*N+x]=o;}
 let mean=0;for(const x of v)mean+=x;mean/=v.length;
 const out=new Uint8Array(N*N);for(let i=0;i<v.length;i++)out[i]=Math.max(0,Math.min(255,Math.round(128+(v[i]-mean)*150)));return out;
}
// Pure: the full RGBA atlas bytes (greyscale in rgb, 255 alpha).
export function buildAtlasBytes(){
 const W=N*ATLAS_COLS,H=N*ATLAS_ROWS,bytes=new Uint8Array(W*H*4);
 for(let t=0;t<ATLAS_COLS*ATLAS_ROWS;t++){const tv=tileValues(t),ox=(t%ATLAS_COLS)*N,oy=Math.floor(t/ATLAS_COLS)*N;
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){const i=((oy+y)*W+ox+x)*4,g=tv[y*N+x];bytes[i]=bytes[i+1]=bytes[i+2]=g;bytes[i+3]=255;}}
 return {bytes,width:W,height:H};
}
export function tileMean(atlas,t){const {bytes,width}=atlas,ox=(t%ATLAS_COLS)*N,oy=Math.floor(t/ATLAS_COLS)*N;let s=0;for(let y=0;y<N;y++)for(let x=0;x<N;x++)s+=bytes[((oy+y)*width+ox+x)*4];return s/(N*N);}

export function createMaterialAtlas(THREE){
 const a=buildAtlasBytes(),tex=new THREE.DataTexture(a.bytes,a.width,a.height,THREE.RGBAFormat,THREE.UnsignedByteType);
 tex.name='Gummy Bay gfx detail atlas v151';tex.colorSpace=THREE.NoColorSpace;tex.wrapS=tex.wrapT=THREE.ClampToEdgeWrapping;
 tex.minFilter=THREE.LinearMipmapLinearFilter;tex.magFilter=THREE.LinearFilter;tex.generateMipmaps=true;tex.anisotropy=4;tex.needsUpdate=true;
 return tex;
}

const VARY='varying vec3 gfxWorld;varying vec3 gfxNormal;\n';
const FRAG_HEAD=`uniform sampler2D gfxAtlas;uniform float gfxStrength;
float gfxSample(float t,vec2 uv){vec2 cell=vec2(mod(t,4.),floor(t/4.));vec2 s=vec2(.25,.5)*(254./256.);
 vec2 a=(cell+vec2(1./256.)+fract(uv)*(254./256.))*vec2(.25,.5);return textureGrad(gfxAtlas,a,dFdx(uv)*s,dFdy(uv)*s).r;}
`;
const FRAG_BODY=`
 {vec3 gn=normalize(gfxNormal);vec3 bc=diffuseColor.rgb;float lum=dot(bc,vec3(.2126,.7152,.0722));
  bool green=bc.g>bc.r*1.12&&bc.g>bc.b*1.04;float k=1.;
  if(!green){
   if(gn.y>.7){
    if(gfxWorld.y<1.4){float t=lum<.16?2.:(lum<.75?3.:7.);k=mix(1.,gfxSample(t,gfxWorld.xz*(t==2.?.22:.27))*2.,gfxStrength*(t==2.?1.:.8));}
    else k=mix(1.,gfxSample(5.,gfxWorld.xz*.55)*2.,gfxStrength*.85);
   }else if(abs(gn.y)<.35){
    vec2 wv=abs(gn.x)>abs(gn.z)?gfxWorld.zy:gfxWorld.xy;
    bool red=bc.r>bc.g*1.18&&bc.r>bc.b*1.25;bool brown=bc.r>bc.g*1.06&&bc.g>bc.b*1.06&&lum<.22;
    float t=red?0.:(brown?4.:1.);
    k=mix(1.,gfxSample(t,wv*(t==0.?.5:.38))*2.,gfxStrength*(t==1.?.75:1.));
    k*=mix(1.,gfxSample(6.,vec2(wv.x*.31,gfxWorld.y*.21))*2.,.55*gfxStrength);
    k*=1.-.2*gfxStrength*exp(-max(0.,gfxWorld.y)*1.4);
   }
  }
  diffuseColor.rgb*=k;}
`;
export function applyGfxMaterial(material,uniforms){
 if(!material?.isMeshStandardMaterial||material.userData.gfxMaterial)return false;
 material.userData.gfxMaterial=true;
 const previous=material.onBeforeCompile,prevKey=material.customProgramCacheKey?.bind(material);
 material.onBeforeCompile=function(shader,renderer){
  previous?.call(this,shader,renderer);
  shader.uniforms.gfxAtlas=uniforms.gfxAtlas;shader.uniforms.gfxStrength=uniforms.gfxStrength;
  shader.vertexShader=VARY+shader.vertexShader.replace('#include <worldpos_vertex>',`#include <worldpos_vertex>
   {vec4 gp=vec4(transformed,1.);vec3 gnn=objectNormal;
   #ifdef USE_INSTANCING
    gp=instanceMatrix*gp;gnn=mat3(instanceMatrix)*gnn;
   #endif
   #ifdef USE_BATCHING
    gp=batchingMatrix*gp;gnn=mat3(batchingMatrix)*gnn;
   #endif
   gfxWorld=(modelMatrix*gp).xyz;gfxNormal=mat3(modelMatrix)*gnn;}`);
  shader.fragmentShader=VARY+FRAG_HEAD+shader.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>'+FRAG_BODY);
 };
 material.customProgramCacheKey=()=>(prevKey?prevKey():'')+'|gfx151';material.needsUpdate=true;return true;
}

const MOVING=/car|vehicle|truck|bus|bike|board|skate|player|npc|cop|police|van|crowd|traffic|rider|resident|character|avatar|boat|ferry|door|wheel|cine|cast|kid|crew|squad|fleet|hair|beard|moustache|sideburn|face|eye|limb|arm|leg|torso|head|hand|body|\brv\b/i;
export function worldMaterialEligible(o,scene){
 if(!o?.isMesh||o.isSkinnedMesh)return false;
 for(let a=o;a&&a!==scene;a=a.parent){if(a.userData?.noBatch||a.isLOD&&a!==o||MOVING.test(a.name||''))return false;}
 // a rig part sits beside named limbs/hair: skip the whole rig, never swim a texture on a mover
 if(o.parent&&o.parent!==scene&&o.parent.children.length<40&&o.parent.children.some(c=>c!==o&&MOVING.test(c.name||'')))return false;
 const m=o.material;if(!m||Array.isArray(m)||!m.isMeshStandardMaterial||m.transparent||m.opacity<1||m.envMap)return false;
 if((m.roughness??1)<.45)return false;
 if(m.emissive&&m.emissiveIntensity>0&&(m.emissive.r+m.emissive.g+m.emissive.b)>.02)return false;
 return true;
}
export function patchWorldMaterials(scene,uniforms){
 const banned=new Set(),ok=new Set();
 scene.traverse(o=>{if(!o.isMesh)return;const ms=Array.isArray(o.material)?o.material:[o.material];if(worldMaterialEligible(o,scene))ok.add(o.material);else ms.forEach(m=>m&&banned.add(m));});
 let n=0;for(const m of ok)if(!banned.has(m)&&applyGfxMaterial(m,uniforms))n++;return n;
}
