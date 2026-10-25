import bpy,math
from mathutils import Vector
R='/workspace/sites/nightshift'
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
for i in range(3):
 old=set(bpy.data.objects);bpy.ops.import_scene.gltf(filepath=R+'/dist/assets/citizen-lod-v12-'+str(i)+'.glb')
 for o in set(bpy.data.objects)-old:
  if o.type=='ARMATURE':
   if o.animation_data:o.animation_data_clear()
   o.data.pose_position='REST'
  if o.parent is None:o.location.x+=(i-1)*1.4
bpy.ops.mesh.primitive_plane_add(size=200);ground=bpy.context.object
m=bpy.data.materials.new('Studio floor');m.diffuse_color=(.12,.17,.19,1);ground.data.materials.append(m)
bpy.ops.object.light_add(type='AREA',location=(-3,-4,5));bpy.context.object.data.energy=500;bpy.context.object.data.size=4
bpy.ops.object.light_add(type='AREA',location=(3,1,4));bpy.context.object.data.energy=350;bpy.context.object.data.size=3
bpy.ops.object.camera_add(location=(3,-8,3));cam=bpy.context.object;cam.rotation_euler=(Vector((0,0,1.15))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=5.4
sc=bpy.context.scene;sc.camera=cam;sc.world.color=(.22,.22,.22);sc.render.engine='CYCLES';sc.cycles.samples=12;sc.render.resolution_x=1200;sc.render.resolution_y=650;sc.render.resolution_percentage=100;sc.render.filepath=R+'/art/v12/exported-lods.png';bpy.ops.render.render(write_still=True)
