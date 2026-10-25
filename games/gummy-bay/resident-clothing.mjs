import * as THREE from './vendor/three.module.min.js';

export const RESIDENT_CLOTHING_COLLIDERS=Object.freeze([]);
export const RESIDENT_FABRIC_PATTERN=Object.freeze({id:'bay-diagonal-loom',size:16,repeatX:7,repeatY:10,min:205,max:252});

export const RESIDENT_CLOTHING_PROFILES=Object.freeze([
 Object.freeze({id:'washed-cotton',tone:-.08,roughness:.9}),
 Object.freeze({id:'soft-jersey',tone:.06,roughness:.76}),
 Object.freeze({id:'work-twill',tone:-.02,roughness:.84}),
 Object.freeze({id:'sun-faded-canvas',tone:.1,roughness:.94}),
 Object.freeze({id:'brushed-knit',tone:-.12,roughness:.88}),
 Object.freeze({id:'plain-weave',tone:.03,roughness:.81})
]);

export function residentClothingProfile(id=0){
 id=Number.isFinite(id)?Math.trunc(id):0;
 return RESIDENT_CLOTHING_PROFILES[((id%RESIDENT_CLOTHING_PROFILES.length)+RESIDENT_CLOTHING_PROFILES.length)%RESIDENT_CLOTHING_PROFILES.length];
}

const channel=(hex,shift,offset)=>{
 const value=hex>>shift&255;
 return Math.max(0,Math.min(255,Math.round(offset>=0?value+(255-value)*offset:value*(1+offset))));
};
export function clothingTone(baseColor,tone=0){
 baseColor=Number.isFinite(baseColor)?Math.max(0,Math.min(0xffffff,Math.trunc(baseColor))):0x497d89;
 tone=Number.isFinite(tone)?Math.max(-.15,Math.min(.12,tone)):0;
 return channel(baseColor,16,tone)<<16|channel(baseColor,8,tone)<<8|channel(baseColor,0,tone);
}

let fabricTexture=null;
const fabricRoughness=(x,y)=>{
 const diagonal=(x+y*3)%7<2?-18:0,warp=(x*5+y)%11<2?-11:0,fleck=(x*11+y*7)%29===0?-18:0;
 return Math.max(RESIDENT_FABRIC_PATTERN.min,Math.min(RESIDENT_FABRIC_PATTERN.max,252+diagonal+warp+fleck));
};
export function residentFabricTexture(){
 if(fabricTexture)return fabricTexture;
 const {size,repeatX,repeatY}=RESIDENT_FABRIC_PATTERN,data=new Uint8Array(size*size*4);
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){const i=(y*size+x)*4,value=fabricRoughness(x,y);data[i]=data[i+1]=data[i+2]=value;data[i+3]=255;}
 fabricTexture=new THREE.DataTexture(data,size,size,THREE.RGBAFormat,THREE.UnsignedByteType);
 fabricTexture.name='GummyBayFabricRoughness';fabricTexture.wrapS=fabricTexture.wrapT=THREE.RepeatWrapping;fabricTexture.repeat.set(repeatX,repeatY);
 fabricTexture.magFilter=fabricTexture.minFilter=THREE.LinearFilter;fabricTexture.generateMipmaps=false;fabricTexture.colorSpace=THREE.NoColorSpace;
 fabricTexture.userData.fabricPattern=RESIDENT_FABRIC_PATTERN.id;fabricTexture.needsUpdate=true;
 return fabricTexture;
}

export function createResidentClothing({body,id=0,baseColor=0x497d89,isCop=false}={}){
 if(!body||typeof body.traverse!=='function')throw new TypeError('Resident clothing needs an animated body.');
 const profile=residentClothingProfile(id),texture=residentFabricTexture(),materials=[],seen=new Set(),source=isCop?0x243c58:baseColor,color=clothingTone(source,profile.tone);
 body.traverse(object=>{if(!object?.isMesh)return;for(const material of Array.isArray(object.material)?object.material:[object.material]){
  if(!material||material.name!=='Shirt'||seen.has(material))continue;
  seen.add(material);material.color.setHex(color);material.roughness=profile.roughness;material.metalness=0;material.roughnessMap=texture;material.needsUpdate=true;material.userData.fabric=profile.id;material.userData.fabricTone=profile.tone;material.userData.fabricPattern=RESIDENT_FABRIC_PATTERN.id;materials.push(material);
 }});
 if(!materials.length)throw new TypeError('Resident rig is missing its Shirt material.');
 return Object.freeze({profile,color,isCop:!!isCop,texture,materials:Object.freeze(materials)});
}
