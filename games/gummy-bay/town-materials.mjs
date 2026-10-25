import * as THREE from './vendor/three.module.min.js';

const SIZE=16;
function textureBytes(kind){
 const bytes=new Uint8Array(SIZE*SIZE*4);
 for(let y=0;y<SIZE;y++)for(let x=0;x<SIZE;x++){
  const i=(y*SIZE+x)*4,seed=(x*37+y*61+x*y*11)%23;
  let value=255;
  if(kind==='mineral')value=244-seed%12-(x+y)%3;
  else if(kind==='concrete')value=248-(seed%7===0?18:seed%5);
  else if(kind==='roof')value=246-((x+y)%4===0?14:seed%8);
  bytes[i]=value;bytes[i+1]=kind==='roof'?Math.max(0,value-3):value;bytes[i+2]=kind==='mineral'?Math.max(0,value-5):value;bytes[i+3]=255;
 }
 return bytes;
}
function makeTexture(kind,repeat){
 const texture=new THREE.DataTexture(textureBytes(kind),SIZE,SIZE,THREE.RGBAFormat,THREE.UnsignedByteType);
 texture.name='Gummy Bay '+kind+' microdetail';texture.userData.townSurface=kind;texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.repeat.set(repeat,repeat);texture.colorSpace=THREE.SRGBColorSpace;texture.minFilter=THREE.LinearMipmapLinearFilter;texture.magFilter=THREE.LinearFilter;texture.generateMipmaps=true;texture.needsUpdate=true;return texture;
}

export const TOWN_SURFACE_TEXTURES=Object.freeze({
 mineral:makeTexture('mineral',4),
 concrete:makeTexture('concrete',3),
 roof:makeTexture('roof',5)
});

export const TOWN_MATERIAL_HIERARCHY=Object.freeze({
 buildingMass:Object.freeze({texture:'mineral',roughness:.9,metalness:0,label:'painted mineral mass'}),
 buildingTrim:Object.freeze({texture:null,roughness:.66,metalness:.05,label:'clean readable trim'}),
 roof:Object.freeze({texture:'roof',roughness:.84,metalness:.02,label:'weathered roof plane'}),
 hardscape:Object.freeze({texture:'concrete',roughness:.96,metalness:0,label:'mineral hardscape'}),
 marking:Object.freeze({texture:null,roughness:.76,metalness:0,label:'clean safety marking'}),
 streetBody:Object.freeze({texture:null,roughness:.86,metalness:.02,label:'clean street prop body'}),
 streetMetal:Object.freeze({texture:null,roughness:.7,metalness:.12,label:'clean street prop metal'})
});

export function townMaterialOptions(key){
 const profile=TOWN_MATERIAL_HIERARCHY[key];if(!profile)return null;
 return {map:profile.texture?TOWN_SURFACE_TEXTURES[profile.texture]:null,roughness:profile.roughness,metalness:profile.metalness};
}

export function townMaterialChecksum(texture){
 const bytes=texture?.image?.data;if(!(bytes instanceof Uint8Array))return null;
 let checksum=0;for(let i=0;i<bytes.length;i++)checksum=(checksum+bytes[i]*(i%29+1))>>>0;return checksum;
}
