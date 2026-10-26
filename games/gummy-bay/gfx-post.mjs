// v153 post-processing helpers.
//  - Glow halos: one instanced, camera-facing additive quad per lamp head, soffit light
//    and lit sign. They read like bloom on every quality (one extra draw call, night only),
//    so Low and Medium get a soft glow without a composer.
//  - postTuning(): per-quality strengths for the High composer (bloom knee, wide glow,
//    split-tone grade).
export function isLowPost(quality){return quality==='performance'||quality==='low';}
export function postTuning(quality,night=0){
 const n=Math.max(0,Math.min(1,Number.isFinite(night)?night:0));
 if(isLowPost(quality))return Object.freeze({halo:.55*n,haloScale:.85,composer:false,bloom:0,knee:0,wide:0,split:0});
 if(quality==='high')return Object.freeze({halo:.42*n,haloScale:1,composer:true,bloom:.32+.3*n,threshold:.78,knee:.32,wide:.45+.25*n,split:.05});
 return Object.freeze({halo:.7*n,haloScale:1,composer:false,bloom:0,knee:0,wide:0,split:0});
}
const GLOW_NAME=/sign|neon|lamp|lantern|bulb|glow|window light|lit/i,SKIP=/pool|halo|shadow|occlusion|decal|detail/i;
// Lamp heads mirror light-grade.mjs createStreetDressing (head at +1.15 along the arm, y+5.19).
export function glowSources({lamps=[],soffit=[],extra=[],height=()=>0,max=260}={}){
 const out=[],add=(x,y,z,size,color)=>{if(out.length<max&&[x,y,z,size].every(Number.isFinite)&&!out.some(o=>Math.abs(o.x-x)<1.2&&Math.abs(o.y-y)<1.2&&Math.abs(o.z-z)<1.2))out.push({x,y,z,size,color});};
 for(const s of lamps){const ax=s.axis==='z'?0:(s.face||0),az=s.axis==='z'?(s.face||0):0;add(s.x+ax*1.15,height(s.x,s.z)+5.12,s.z+az*1.15,3.2,0xffc27a);}
 for(const s of soffit)add(s.x,s.y-.12,s.z,3.4,0xffb468);
 for(const e of extra)add(e.x,e.y,e.z,e.size??2.4,e.color??0xffd2a0);
 return out;
}
// Scan for small lit signs/lamps that are not part of the street dressing.
export function sceneGlowExtras(THREE,scene,{max=80}={}){
 const out=[],box=new THREE.Box3(),c=new THREE.Vector3(),s=new THREE.Vector3();
 scene.updateMatrixWorld?.(true);
 scene.traverse(o=>{if(out.length>=max||!o.isMesh||o.isSkinnedMesh||SKIP.test(o.name||''))return;const m=Array.isArray(o.material)?o.material[0]:o.material;if(!m)return;
  const named=GLOW_NAME.test(o.name||'')||GLOW_NAME.test(o.parent?.name||'');
  const e=m.emissive?(m.emissive.r+m.emissive.g+m.emissive.b)/3*(m.emissiveIntensity??1):0;
  const basicLit=m.isMeshBasicMaterial&&m.toneMapped===false;
  if(!(e>.28||(named&&(e>.12||basicLit))))return;
  box.setFromObject(o);if(box.isEmpty())return;box.getCenter(c);box.getSize(s);const r=Math.max(s.x,s.y,s.z);if(r>7||r<.08||c.y<.4)return;
  const col=m.emissive&&e>.12?m.emissive:m.color;out.push({x:c.x,y:c.y,z:c.z,size:Math.min(3.2,1.2+r*.9),color:col?col.getHex():0xffd2a0});});
 return out;
}
const haloVertex=`varying vec2 vUv;varying vec3 vColor;varying float vFade;uniform float uScale;uniform float uNear;uniform float uFar;
void main(){vUv=uv;vColor=instanceColor;vec4 c=modelViewMatrix*instanceMatrix*vec4(0.,0.,0.,1.);float size=length(instanceMatrix[0].xyz)*uScale;float d=-c.z;
vFade=(1.-smoothstep(uNear,uFar,d))*smoothstep(1.2,5.,d);c.xy+=position.xy*size;gl_Position=projectionMatrix*c;}`;
const haloFragment=`uniform float uAlpha;varying vec2 vUv;varying vec3 vColor;varying float vFade;
void main(){vec2 p=vUv*2.-1.;float r=dot(p,p);if(r>1.)discard;float g=exp(-r*4.2)*.85+exp(-r*16.)*.6;gl_FragColor=vec4(vColor*g*uAlpha*vFade,1.);}`;
export function createGlowHalos(THREE,scene,sources=[]){
 if(!sources.length)return null;
 const geo=new THREE.PlaneGeometry(1,1),mat=new THREE.ShaderMaterial({uniforms:{uAlpha:{value:0},uScale:{value:1},uNear:{value:80},uFar:{value:260}},vertexShader:haloVertex,fragmentShader:haloFragment,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false});
 const mesh=new THREE.InstancedMesh(geo,mat,sources.length);mesh.name='Gfx glow halos v153';mesh.frustumCulled=false;mesh.renderOrder=3;mesh.visible=false;mesh.userData.noBatch=true;
 const m=new THREE.Matrix4(),col=new THREE.Color();
 sources.forEach((s,i)=>{m.makeScale(s.size,s.size,s.size);m.setPosition(s.x,s.y,s.z);mesh.setMatrixAt(i,m);col.setHex(s.color).convertSRGBToLinear?.();mesh.setColorAt(i,col);});
 mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;
 scene.add(mesh);
 return {mesh,count:sources.length,update(tuning,fog){const a=tuning?.halo??0;mesh.visible=a>.01;mat.uniforms.uAlpha.value=a;mat.uniforms.uScale.value=tuning?.haloScale??1;if(fog){mat.uniforms.uNear.value=fog.near*.6;mat.uniforms.uFar.value=fog.far;}}};
}
