import bpy,math
from mathutils import Vector
R='/workspace/sites/nightshift'
bpy.ops.wm.open_mainfile(filepath=R+'/art/v11/citizen.blend')
body=bpy.data.objects['CitizenMesh'];original=[v.co.copy() for v in body.data.vertices]
hairverts=set()
for poly in body.data.polygons:
 if body.data.materials[poly.material_index].name=='Hair':hairverts.update(poly.vertices)
for variant in [1,2]:
 for v,co in zip(body.data.vertices,original):v.co=co
 for idx in hairverts:
  v=body.data.vertices[idx]
  # Hair cap and fringe only, keep brows in place.
  if v.co.z<2.035:continue
  if variant==1:
   v.co.z=2.08+(v.co.z-2.08)*.75;v.co.x*=1.025
  else:
   # Opposite swept part: keep cap intact and shift the frontal locks.
   v.co.x=-v.co.x
   if v.co.y<-.13 and v.co.z>2.10:v.co.x+=.045;v.co.z+=.025
 bpy.ops.wm.save_as_mainfile(filepath=R+f'/art/v11/citizen-{variant}.blend')
 bpy.ops.export_scene.gltf(filepath=R+f'/dist/assets/citizen-v11-{variant}.glb',export_format='GLB',export_animation_mode='ACTIONS')
