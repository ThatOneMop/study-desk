exec(open('/workspace/sites/nightshift/art/build-town.py').read().split('B=[')[0])
for m in M.values():
 c=m.diffuse_color;m.diffuse_color=(*[((v+.055)/1.055)**2.4 for v in c[:3]],1);m.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value=m.diffuse_color
sets={}
start=set(bpy.data.objects)
# Open-front tent, with silver lining, tubular frame, zip rails and lamp. Existing crop remains separate.
cube('Tent floor',0,.04,0,2.4,.08,2.4,'dark')
for side in [-1,1]:
 cube('Tent canvas',side*1.16,1.15,0,.06,2.3,2.35,'roof');cube('Reflective lining',side*1.12,1.15,0,.025,2.23,2.25,'metal',0)
 for zz in [-1.1,1.1]:cyl('Tent frame',side*1.11,1.15,zz,.027,2.3,'metal',8)
 cube('Zipper rail',side*1.13,1.15,1.18,.055,2.3,.055,'gold',0)
 for yy in [.3,.55,.8,1.05,1.3,1.55,1.8,2.05]:cube('Zip tooth',side*1.12,yy,1.22,.06,.025,.025,'trim',0)
cube('Tent back',0,1.15,-1.16,2.4,2.3,.06,'roof');cube('Tent top',0,2.3,0,2.4,.09,2.4,'roof');cube('Lamp housing',0,2.12,0,1.6,.08,1.2,'metal')
for x in [-.55,0,.55]:cube('Lamp strip',x,2.065,0,.12,.025,1,'ivory',0)
cyl('Pot',0,.35,0,.58,.7,'rust',20);cyl('Soil',0,.71,0,.54,.03,'dark',20)
sets['Tent']=set(bpy.data.objects)-start
start=set(bpy.data.objects)
for xx in [-.95,.95]:
 for zz in [-.43,.43]:cube('Mixer leg',xx,.58,zz,.08,1.16,.08,'metal')
cube('Mixer shelf',0,.25,0,2.2,.08,1.1,'metal');cube('Mixer counter',0,1.23,0,2.4,.10,1.3,'ivory');cyl('Mixer bowl',-.45,1.49,0,.4,.44,'metal',24);cyl('Bowl rim',-.45,1.73,0,.43,.06,'trim',24)
cube('Motor',.55,1.55,-.15,.5,.6,.5,'blue',.08);cube('Arm',.1,1.88,-.15,1.25,.16,.25,'blue');cyl('Paddle shaft',-.45,1.7,0,.025,.4,'metal',8)
for xx in [.43,.62]:cyl('Dial',xx,1.52,.13,.055,.04,'gold',12).rotation_euler.x=math.pi/2
sets['Mixer']=set(bpy.data.objects)-start
start=set(bpy.data.objects)
cube('Phone post',0,1.15,0,.2,2.3,.2,'metal');cube('Phone back',0,2.2,-.2,1,1.35,.12,'blue');cube('Phone hood',0,2.95,0,1.2,.14,.8,'blue')
for side in [-1,1]:cube('Phone privacy wing',side*.55,2.25,0,.06,1.3,.7,'blue')
cube('Steel faceplate',0,2.2,0,.8,1.15,.15,'metal');cube('Receiver',-.27,2.28,.16,.16,.65,.15,'dark',.05)
for yy in [2.02,2.52]:cube('Receiver earpiece',-.27,yy,.20,.23,.17,.18,'dark',.04)
for i in range(12):cube('Phone key',.02+i%3*.13,2.43-i//3*.13,.1,.09,.08,.03,'trim',.008)
cube('Coin slot',.13,2.72,.11,.22,.035,.025,'dark',0)
for i in range(12):cyl('Coiled cable',-.26,1.82-i*.035,.12,.04,.02,'dark',8)
sets['Payphone']=set(bpy.data.objects)-start
for key,objects in sets.items():
 root=bpy.data.objects.new(key,None);bpy.context.collection.objects.link(root)
 for m in M.values():
  group=[o for o in objects if o.type=='MESH' and o.data.materials[0]==m]
  if not group:continue
  objects.difference_update(group)
  bpy.ops.object.select_all(action='DESELECT')
  for o in group:o.select_set(True)
  bpy.context.view_layer.objects.active=group[0];bpy.ops.object.join();o=bpy.context.object;o.name=key+'_'+m.name;o.parent=root
  bm=bmesh.new();bm.from_mesh(o.data);bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces));bm.to_mesh(o.data);bm.free()
bpy.ops.wm.save_as_mainfile(filepath=ROOT+'/art/v11/equipment.blend')
bpy.ops.export_scene.gltf(filepath=ROOT+'/dist/assets/equipment-v11.glb',export_format='GLB',export_animations=False)
