// Bounded world-space patina avoids enormous maps and identical tiled boxes.
// Only opt-in architectural materials; skinned people and UI are never patched.
export function applyCoastalSurface(material){
 if(!material?.isMeshStandardMaterial||material.userData.coastalPatina)return false;
 material.userData.coastalPatina=true;
 const previous=material.onBeforeCompile;
 material.onBeforeCompile=function(shader,renderer){
  previous?.call(this,shader,renderer);
  shader.vertexShader='varying vec3 coastPosition;\n'+shader.vertexShader;
  shader.vertexShader=shader.vertexShader.replace('#include <worldpos_vertex>',`#include <worldpos_vertex>
   vec4 cp=vec4(transformed,1.);
   #ifdef USE_INSTANCING
    cp=instanceMatrix*cp;
   #endif
   coastPosition=(modelMatrix*cp).xyz;`);
  shader.fragmentShader='varying vec3 coastPosition;\n'+shader.fragmentShader;
  shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
   float broad=sin(coastPosition.x*.71+sin(coastPosition.z*.56))*sin(coastPosition.y*1.3+coastPosition.z*.31);
   float groundWear=exp(-max(0.,coastPosition.y)*2.1);
   diffuseColor.rgb*=1.-.055*(broad*.5+.5)-.10*groundWear;`);
 };
 material.customProgramCacheKey=()=> 'coastal-material-v1';material.needsUpdate=true;return true;
}
