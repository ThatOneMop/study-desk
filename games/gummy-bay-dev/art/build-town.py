import bpy, bmesh, math, random, os, json
from mathutils import Vector
random.seed(14)
ROOT='/workspace/sites/nightshift'
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
M={}
def material(name,hex,rough=.8,metal=0):
 m=bpy.data.materials.new(name);m.diffuse_color=(*tuple(int(hex[i:i+2],16)/255 for i in (0,2,4)),1);m.use_nodes=True;p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=m.diffuse_color;p.inputs['Roughness'].default_value=rough;p.inputs['Metallic'].default_value=metal;M[name]=m;return m
for args in [('cream','D9D0B6'),('ivory','F2E4C9'),('brick','A96C53'),('blue','597F8A'),('sage','8D9A7A'),('pink','C39785'),('trim','E7D8B8'),('roof','3F5556'),('glass','304F5A',.24,.3),('metal','5D6967',.42,.45),('wood','846549'),('dark','344640'),('gold','DCB667'),('rust','9A5239'),('leaf','557B50')]:material(*args)
def cube(name,x,y,z,w,h,d,m,bevel=.035):
 verts=[(x+sx*w/2,-z+sz*d/2,y+sy*h/2) for sx,sz,sy in [(-1,-1,-1),(-1,-1,1),(-1,1,-1),(-1,1,1),(1,-1,-1),(1,-1,1),(1,1,-1),(1,1,1)]]
 faces=[(0,4,6,2),(1,3,7,5),(0,1,5,4),(2,6,7,3),(0,2,3,1),(4,5,7,6)]
 mesh=bpy.data.meshes.new(name);mesh.from_pydata(verts,[],faces);mesh.materials.append(M[m]);mesh.update()
 if bevel and min(w,h,d)>.2:
  bm=bmesh.new();bm.from_mesh(mesh);bmesh.ops.bevel(bm,geom=list(bm.edges),offset=min(bevel,w*.15,h*.15,d*.15),segments=2,affect='EDGES');bm.to_mesh(mesh);bm.free()
 o=bpy.data.objects.new(name,mesh);bpy.context.collection.objects.link(o);return o

def cyl(name,x,y,z,r,h,m,vertices=16):
 bpy.ops.mesh.primitive_cylinder_add(vertices=vertices,radius=r,depth=h,location=(x,-z,y));o=bpy.context.object;o.name=name;o.data.materials.append(M[m]);return o
def text(body,x,y,z,size,m):
 bpy.ops.object.text_add(location=(x,-z,y),rotation=(math.pi/2,0,0));o=bpy.context.object;o.name=body;o.data.body=body;o.data.align_x='CENTER';o.data.size=size;o.data.extrude=.009;o.data.materials.append(M[m]);bpy.ops.object.convert(target='MESH');return o
def window(x,y,z,w=1.6,h=1.6,rotation=0):
 # Build front-oriented, then rotate assembly about vertical for rear/side elevations.
 start=set(bpy.data.objects)
 cube('Window recess',x,y,z,w+.22,h+.22,.18,'dark')
 cube('Blue glass',x,y,z+.10,w,h,.04,'glass',.015)
 cube('Window sill',x,y-h/2-.1,z+.14,w+.36,.14,.42,'trim')
 for side in [-1,1]:cube('Window jamb',x+side*(w/2+.04),y,z+.15,.10,h+.24,.12,'trim',.012)
 cube('Window lintel',x,y+h/2+.06,z+.13,w+.28,.12,.19,'trim')
 cube('Window mullion',x,y,z+.15,.06,h,.08,'trim',.008);cube('Window crossbar',x,y-.1,z+.15,w,.06,.08,'trim',.008)
 # Partly lowered blind adds individual occupancy.
 cube('Blind',x,y+h*.35,z+.17,w-.08,h*.22,.025,'ivory',.005)
 if rotation:
  pivot=Vector((x,-z,y));c,s=math.cos(rotation),math.sin(rotation)
  for o in set(bpy.data.objects)-start:
   
   for v in o.data.vertices:
    p=v.co-pivot;v.co=pivot+Vector((c*p.x-s*p.y,s*p.x+c*p.y,p.z))
B=[(-25,19,18,13,'pink',2),(-25,40,18,17,'cream',1),(25,22,18,17,'sage',2),(-24,-23,20,17,'brick',2),(24,-25,20,18,'blue',2),(53,22,19,17,'cream',1),(54,-25,21,19,'pink',2),(-53,-25,18,18,'sage',2),(-77,-35,17,14,'cream',1)]
for idx,(x,z,w,d,color,floors) in enumerate(B):
 print('Building',idx,flush=True)
 top=3.82+floors*2.65
 cube('Upper storeys',x,3.82+floors*1.325,z,w-.4,floors*2.65,d-.4,color,.08)
 for level in range(floors):
  yy=5.12+level*2.65
  cube('Storey ledge',x,yy-1.2,z,w+.15,.17,d+.15,'trim')
  for side in [-1,1]:
   for j in [-1,0,1]:window(x+j*w*.29,yy,z+side*(d/2-.12),1.65,1.55,0 if side==1 else math.pi)
   for j in [-1,1]:window(x+side*(w/2-.12),yy,z+j*d*.27,1.65,1.55,math.pi/2 if side==1 else -math.pi/2)
 # Street-facing backs and sides no longer blank ground-level boxes.
 for j in [-1,0,1]:window(x+j*w*.29,1.9,z-d/2-.06,1.9,1.55,math.pi)
 for side in [-1,1]:
  for j in [-1,1]:window(x+side*(w/2+.04),1.9,z+j*d*.25,1.8,1.5,math.pi/2 if side==1 else -math.pi/2)
  cube('Corner pier',x+side*(w/2-.16),top/2,z-d/2,.32,top,.32,'trim')
 cube('Deep roof cornice',x,top+.12,z,w+.65,.24,d+.65,'trim',.04)
 cube('Roof surface',x,top+.27,z,w+.2,.12,d+.2,'roof')
 for side in [-1,1]:
  cube('Parapet',x+side*w/2,top+.52,z,.22,.56,d+.22,'roof');cube('Parapet',x,top+.52,z+side*d/2,w,.56,.22,'roof')
 # Rooftop equipment and brick chimneys.
 cube('Air handler',x-w*.24,top+.8,z-d*.2,2.1,1.05,1.7,'metal',.09)
 for i in range(6):cube('Air handler grille',x-w*.24-.84+i*.33,top+.85,z-d*.2+.88,.06,.65,.03,'dark',.005)
 cube('Chimney',x+w*.27,top+1,z-d*.25,.9,1.5,.85,'brick');cube('Chimney cap',x+w*.27,top+1.8,z-d*.25,1.15,.15,1.1,'trim')
 # Side service door, conduits and wall plates.
 cube('Service door',x+w/2+.08,1.13,z,.08,2.2,1.05,'blue');cube('Utility box',x-w/2-.08,1.5,z,.2,.8,.6,'metal')
 # A rooftop name board has a real frame and leg supports.
 names=['PALM COURT','ROOMS','GARDEN GOODS','HARDWARE','CORNER STORE','SUDS','CEDAR LETTINGS','HELPING HAND','COASTWAY']
 if idx in [0,3,4]:
  for sx in [-2.1,2.1]:cube('Sign bracket',x+sx,top+1.1,z+d/2,.1,1.8,.12,'metal')
  cube('Signboard',x,top+1.5,z+d/2,7.2,1.35,.18,'blue' if idx==0 else 'dark');text(names[idx],x,top+1.22,z+d/2+.105,.55,'ivory')
# New connected districts: rows of occupied exterior buildings with collision footprints.
footprints=[]
for row,z in enumerate([-125,-195,-265,-335,-405]):
 for col,x in enumerate([-240,-190,-140,-70,-30,30,70,140,190,240]):
  w=16+(col%3)*2;d=19+(row%2)*3;h=6+((row+col)%3)*3;color=['brick','blue','cream','sage','pink'][(col+row)%5]
  cube('District building',x,h/2,z,w,h,d,color,.07);cube('District cornice',x,h,z,w+.6,.28,d+.6,'trim')
  for yy in range(2,int(h),3):
   for xx in [-w*.28,w*.28]:window(x+xx,yy,z+d/2+.04,1.5,1.6)
   for side in [-1,1]:window(x+side*(w/2+.04),yy,z,1.5,1.6,math.pi/2 if side==1 else -math.pi/2)
  cube('Door',x,1.2,z+d/2+.08,1.1,2.4,.1,'blue');cube('Chimney',x+3,h+.6,z,1,1.2,1,'brick')
  footprints.append({'x':x,'z':z,'w':w+.7,'d':d+.7})
 print('District row',row,flush=True)
for side in [-1,1]:
 for i in range(5):
  x=side*(150+(i%2)*70);z=-45+(i//2)*52;h=6+(i%3)*2;w=18;d=18
  cube('Coastal district',x,h/2,z,w,h,d,['brick','cream','blue'][i%3],.07);cube('Cornice',x,h,z,w+.5,.3,d+.5,'trim')
  for yy in [2,5]:
   for j in [-1,1]:window(x+j*4,yy,z+d/2+.04,1.8,1.6)
  footprints.append({'x':x,'z':z,'w':w+.7,'d':d+.7})
with open(ROOT+'/dist/assets/district-colliders.json','w') as f:json.dump(footprints,f)
# Merge by material for a compact export and bounded draw calls.
for mat in list(M.values()):
 objs=[o for o in bpy.context.scene.objects if o.type=='MESH' and len(o.data.materials)==1 and o.data.materials[0]==mat]
 if not objs:continue
 bpy.ops.object.select_all(action='DESELECT')
 for o in objs:o.select_set(True)
 bpy.context.view_layer.objects.active=objs[0];bpy.ops.object.join();bpy.context.object.name='Town_'+mat.name
bpy.ops.wm.save_as_mainfile(filepath=ROOT+'/art/gummy-bay-town.blend')
bpy.ops.export_scene.gltf(filepath=ROOT+'/dist/assets/town-v7.glb',export_format='GLB',export_yup=True,export_animations=False)
# A real Blender preview of the exported architectural scene, for asset QA.
cube('Preview ground',0,-.2,-175,600,.2,580,'sage',0)
for x,z,w,d,color,floors in B:cube('Preview existing ground floor',x,1.8,z,w,3.6,d,color,0)
bpy.ops.object.light_add(type='SUN',location=(0,0,60));sun=bpy.context.object;sun.rotation_euler=(.4,-.5,-.6);sun.data.energy=2.1;sun.data.angle=.1
bpy.context.scene.world.color=(.3,.3,.3)
bpy.ops.object.camera_add(location=(83,-90,65));cam=bpy.context.object;direction=Vector((0,0,3))-cam.location;cam.rotation_euler=direction.to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=145;bpy.context.scene.camera=cam
sc=bpy.context.scene;sc.render.engine='CYCLES';sc.cycles.samples=16;sc.render.resolution_x=1100;sc.render.resolution_y=800;sc.render.resolution_percentage=100;sc.render.filepath=ROOT+'/art/town-preview.png';bpy.ops.render.render(write_still=True)
print('BLENDER_ASSETS_COMPLETE')
