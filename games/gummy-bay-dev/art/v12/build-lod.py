import bpy
R='/workspace/sites/nightshift'
for i in range(3):
 bpy.ops.wm.open_mainfile(filepath=R+'/art/v11/citizen'+('-'+str(i) if i else '')+'.blend')
 for o in list(bpy.data.objects):
  if o.type!='MESH':continue
  if o.data.shape_keys:o.shape_key_clear()
  bpy.context.view_layer.objects.active=o
  mod=o.modifiers.new('Distance geometry','DECIMATE');mod.ratio=.32;mod.use_collapse_triangulate=True
  bpy.ops.object.modifier_apply(modifier=mod.name)
 bpy.ops.wm.save_as_mainfile(filepath=R+'/art/v12/citizen-lod-'+str(i)+'.blend')
 bpy.ops.export_scene.gltf(filepath=R+'/dist/assets/citizen-lod-v12-'+str(i)+'.glb',export_format='GLB',export_animation_mode='ACTIONS')
