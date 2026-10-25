import bpy, math, os, json
from mathutils import Vector
R='/workspace/sites/nightshift'
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
M={}
def mat(n,c,r=.82):
 m=bpy.data.materials.new(n);m.diffuse_color=(*[((int(c[i:i+2],16)/255+.055)/1.055)**2.4 for i in (0,2,4)],1);m.use_nodes=True;p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=m.diffuse_color;p.inputs['Roughness'].default_value=r;M[n]=m
for n,c in [('Skin','C58F6C'),('Shirt','497D89'),('Pants','303D50'),('Boot','302E30'),('Sole','B8B3A2'),('Hair','46312D'),('Eye','F2E8D7'),('Iris','537077'),('Pupil','182329'),('Lip','855448'),('Trim','CFB89C'),('Badge','D1AF61')]:mat(n,c)
parts=[]
def finish(o,n,m,b):
 o.name=n;o.data.materials.append(M[m]);bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
 for p in o.data.polygons:p.use_smooth=True
 vg=o.vertex_groups.new(name=b);vg.add(list(range(len(o.data.vertices))),1,'REPLACE');parts.append(o);return o
def ell(n,x,y,z,s,m,b):
 bpy.ops.mesh.primitive_uv_sphere_add(segments=16,ring_count=10,location=(x,-z,y));o=bpy.context.object;o.scale=(s[0],s[2],s[1]);return finish(o,n,m,b)
def cube(n,x,y,z,s,m,b,bev=.035):
 bpy.ops.mesh.primitive_cube_add(size=1,location=(x,-z,y));o=bpy.context.object;o.scale=(s[0],s[2],s[1]);bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);mod=o.modifiers.new('Tailored edges','BEVEL');mod.width=bev;mod.segments=2;bpy.ops.object.modifier_apply(modifier=mod.name);return finish(o,n,m,b)
def rings(n,rings,m,b):
 verts=[];N=12
 for y,w,d,z in rings:
  for i in range(N):a=i*2*math.pi/N;verts.append((math.cos(a)*w,-z+math.sin(a)*d,y))
 faces=[]
 for j in range(len(rings)-1):
  for i in range(N):a=j*N+i;bb=j*N+(i+1)%N;faces.append((a,bb,bb+N,a+N))
 faces.extend([tuple(range(N-1,-1,-1)),tuple(range((len(rings)-1)*N,len(rings)*N))]);mesh=bpy.data.meshes.new(n);mesh.from_pydata(verts,[],faces);mesh.update();o=bpy.data.objects.new(n,mesh);bpy.context.collection.objects.link(o);bpy.context.view_layer.objects.active=o;o.select_set(True);return finish(o,n,m,b)
rings('Shaped shirt',[(.78,.23,.16,0),(.86,.235,.17,0),(1.12,.29,.18,0),(1.34,.32,.16,0),(1.41,.16,.13,0)],'Shirt','Chest')
cube('Belt',0,.79,.015,(.46,.08,.34),'Boot','Hips');cube('Buckle',0,.79,.193,(.07,.06,.025),'Badge','Hips')
ell('Neck',0,1.44,0,(.095,.15,.095),'Skin','Head')
rings('Sculpted head',[(1.50,.13,.15,.015),(1.55,.25,.24,.015),(1.68,.34,.28,0),(1.92,.38,.3,-.01),(2.08,.31,.26,-.03),(2.16,.12,.14,-.04)],'Skin','Head')
for side in [-1,1]:
 ell('Ear',side*.37,1.83,0,(.065,.11,.08),'Skin','Head');ell('Inner ear',side*.409,1.83,.025,(.024,.06,.04),'Lip','Head')
 ell('Eye socket',side*.143,1.89,.261,(.104,.092,.052),'Lip','Head');ell('Eyeball',side*.143,1.9,.285,(.096,.082,.055),'Eye','Head');ell('Iris',side*.143,1.9,.329,(.043,.05,.014),'Iris','Head');ell('Pupil',side*.143,1.9,.34,(.024,.031,.008),'Pupil','Head');ell('Catchlight',side*.13,1.921,.347,(.011,.012,.005),'Eye','Head')
 brow=cube('Eyebrow',side*.15,2.01,.279,(.18,.035,.045),'Hair','Head',.012);brow.rotation_euler.y=side*.09
 ell('Cheek',side*.19,1.73,.25,(.10,.065,.023),'Skin','Head')
ell('Nose bridge',0,1.83,.29,(.062,.105,.065),'Skin','Head');ell('Nose tip',0,1.78,.347,(.084,.057,.073),'Skin','Head')
cube('Mouth',0,1.65,.256,(.16,.024,.025),'Lip','Head',.01);ell('Lower lip',0,1.626,.256,(.075,.018,.021),'Skin','Head')
# Hair built as a fitted cap and swept clumps, not a sphere sitting on the head.
rings('Hair cap',[(1.99,.372,.29,-.025),(2.1,.32,.265,-.04),(2.20,.2,.2,-.06),(2.23,.02,.02,-.06)],'Hair','Head')
for i in range(5):
 o=ell('Swept fringe',-.24+i*.105,2.115+.03*math.sin(i),.18,(.095,.06,.16),'Hair','Head');o.rotation_euler.y=-.35
for side in [-1,1]:
 b='UpperArm'+str(side);f='Forearm'+str(side);h='Hand'+str(side);t='Thigh'+str(side);l='Shin'+str(side)
 ell('Sleeve',side*.325,1.23,0,(.12,.19,.14),'Shirt',b);ell('Upper arm',side*.37,1.08,0,(.083,.18,.084),'Skin',b);ell('Forearm',side*.39,.86,.015,(.078,.17,.073),'Skin',f)
 cube('Palm',side*.395,.675,.025,(.13,.17,.10),'Skin',h,.04);ell('Thumb',side*.33,.69,.065,(.045,.075,.045),'Skin',h)
 for i in range(3):ell('Finger',side*.395+(i-1)*.035,.596,.035,(.022,.05,.036),'Skin',h)
 ell('Trouser upper',side*.13,.60,0,(.125,.25,.145),'Pants',t);ell('Trouser lower',side*.13,.28,0,(.09,.20,.11),'Pants',l)
 cube('Shoe',side*.13,.10,.065,(.22,.17,.38),'Boot',l,.055);cube('Sole',side*.13,.03,.065,(.23,.05,.39),'Sole',l,.017)
 for zz in [.12,.17,.22]:cube('Laces',side*.13,.185,zz,(.12,.014,.018),'Trim',l,.005)
 cube('Chest pocket',side*.15,1.24,.166,(.13,.13,.035),'Shirt','Chest',.015)
cube('Placket',0,1.1,.18,(.025,.48,.02),'Trim','Chest',.006)
for y in [.93,1.07,1.21]:ell('Button',0,y,.198,(.017,.017,.008),'Boot','Chest')
# One skinned mesh, one real armature, rigid groups at clothing seams.
bpy.ops.object.select_all(action='DESELECT')
for o in parts:o.select_set(True)
bpy.context.view_layer.objects.active=parts[0];bpy.ops.object.join();body=bpy.context.object;body.name='CitizenMesh'
bpy.ops.object.transform_apply(location=True,rotation=True,scale=True)
bpy.ops.object.armature_add();rig=bpy.context.object;rig.name='CitizenRig';bpy.ops.object.mode_set(mode='EDIT');rig.data.edit_bones.remove(rig.data.edit_bones[0])
def bone(n,p,q,parent=None):
 b=rig.data.edit_bones.new(n);b.head=(p[0],-p[2],p[1]);b.tail=(q[0],-q[2],q[1]);
 if parent:b.parent=rig.data.edit_bones[parent]
bone('Root',(0,0,0),(0,.2,0));bone('Hips',(0,.78,0),(0,.95,0),'Root');bone('Chest',(0,.95,0),(0,1.40,0),'Hips');bone('Head',(0,1.43,0),(0,1.94,0),'Chest')
for side in [-1,1]:
 bone('UpperArm'+str(side),(side*.31,1.32,0),(side*.38,.99,0),'Chest');bone('Forearm'+str(side),(side*.38,.99,0),(side*.395,.73,.015),'UpperArm'+str(side));bone('Hand'+str(side),(side*.395,.73,.015),(side*.395,.59,.025),'Forearm'+str(side));bone('Thigh'+str(side),(side*.13,.78,0),(side*.13,.43,0),'Hips');bone('Shin'+str(side),(side*.13,.43,0),(side*.13,.08,0),'Thigh'+str(side))
bpy.ops.object.mode_set(mode='OBJECT');body.parent=rig;mod=body.modifiers.new('Armature','ARMATURE');mod.object=rig
for b in rig.pose.bones:b.rotation_mode='XYZ'
# Eye closure morph, exported with the skin rather than moving an invisible fallback face.
body.shape_key_add(name='Basis');blink=body.shape_key_add(name='Blink');eyeverts=set()
for poly in body.data.polygons:
 if body.data.materials[poly.material_index].name in ['Eye','Iris','Pupil']:
  eyeverts.update(poly.vertices)
for i in eyeverts:blink.data[i].co.z=1.9+(blink.data[i].co.z-1.9)*.08
# Bake small clothing and facial detail colours into vertex colours: four draw batches per actor.
oldm=list(body.data.materials);keep=[M['Skin'],M['Shirt'],M['Hair']]
detail=bpy.data.materials.new('Detail');detail.use_nodes=True;detail.diffuse_color=(1,1,1,1);nd=detail.node_tree.nodes.new('ShaderNodeVertexColor');nd.layer_name='Color';detail.node_tree.links.new(nd.outputs['Color'],detail.node_tree.nodes['Principled BSDF'].inputs['Base Color']);detail.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value=.8
colors=body.data.color_attributes.new(name='Color',type='BYTE_COLOR',domain='CORNER')
assign=[]
for poly in body.data.polygons:
 m=oldm[poly.material_index];idx=keep.index(m) if m in keep else 3;assign.append(idx)
 for li in poly.loop_indices:colors.data[li].color=m.diffuse_color if idx==3 else (1,1,1,1)
body.data.materials.clear()
for m in keep+[detail]:body.data.materials.append(m)
for poly,idx in zip(body.data.polygons,assign):poly.material_index=idx
rig.animation_data_create()
for name in ['Idle','Walk','Run','Talk','Work','Search','Surrender']:
 act=bpy.data.actions.new(name);rig.animation_data.action=act
 for frame in range(1,34,4):
  phase=(frame-1)/32*math.tau
  for b in rig.pose.bones:b.rotation_euler=(0,0,0);b.location=(0,0,0)
  rig.pose.bones['Chest'].rotation_euler.x=.015*math.sin(phase)
  rig.pose.bones['Head'].rotation_euler.z=.035*math.sin(phase)
  if name in ['Walk','Run']:
   amp=.42 if name=='Walk' else .7
   for side in [-1,1]:
    swing=math.sin(phase)*side
    rig.pose.bones['Thigh'+str(side)].rotation_euler.x=swing*amp
    rig.pose.bones['Shin'+str(side)].rotation_euler.x=max(0,-swing)*.65
    rig.pose.bones['UpperArm'+str(side)].rotation_euler.x=-swing*amp*.7
    rig.pose.bones['Forearm'+str(side)].rotation_euler.x=-.15 if name=='Walk' else -.8
   rig.pose.bones['Hips'].location.y=abs(math.sin(phase))*.025
  if name in ['Talk','Work','Search']:
   for side in [-1,1]:
    rig.pose.bones['UpperArm'+str(side)].rotation_euler.x=-.55-.15*math.sin(phase+side)
    rig.pose.bones['Forearm'+str(side)].rotation_euler.x=-.6-.2*math.sin(phase+side)
   rig.pose.bones['Chest'].rotation_euler.x=.12 if name=='Search' else .02
  if name=='Surrender':
   for side in [-1,1]:
    rig.pose.bones['UpperArm'+str(side)].rotation_euler.z=-side*1.5
    rig.pose.bones['Forearm'+str(side)].rotation_euler.x=-1.6
  for b in rig.pose.bones:b.keyframe_insert('rotation_euler',frame=frame);b.keyframe_insert('location',frame=frame)
 track=rig.animation_data.nla_tracks.new();track.name=name;track.strips.new(name,1,act);track.mute=True
rig.animation_data.action=None
for t in rig.animation_data.nla_tracks:t.mute=False
# Reset rest pose before saving/export; animations exported independently via actions.
for b in rig.pose.bones:b.rotation_euler=(0,0,0);b.location=(0,0,0)
bpy.context.scene.render.fps=24
bpy.ops.wm.save_as_mainfile(filepath=R+'/art/v11/citizen.blend')
bpy.ops.export_scene.gltf(filepath=R+'/dist/assets/citizen-v11.glb',export_format='GLB',export_animations=True,export_animation_mode='ACTIONS',export_skins=True)
# Portrait render is validation of asset shape, not gameplay.
for t in rig.animation_data.nla_tracks:t.mute=True
rig.data.pose_position='REST'
bpy.ops.object.light_add(type='AREA',location=(-3,-4,5));bpy.context.object.data.energy=450;bpy.context.object.data.shape='DISK';bpy.context.object.data.size=4
bpy.ops.object.light_add(type='AREA',location=(3,1,3));bpy.context.object.data.energy=250;bpy.context.object.data.size=3
bpy.ops.object.camera_add(location=(3,-6,2.6));cam=bpy.context.object;cam.rotation_euler=(Vector((0,0,1.1))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=2.8;sc=bpy.context.scene;sc.camera=cam;sc.world.color=(.18,.18,.18);sc.render.engine='CYCLES';sc.cycles.samples=24;sc.render.resolution_x=650;sc.render.resolution_y=750;sc.render.resolution_percentage=100;sc.render.filepath=R+'/art/v11/citizen-preview.png';bpy.ops.render.render(write_still=True)
