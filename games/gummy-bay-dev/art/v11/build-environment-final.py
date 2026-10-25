# Reuses the original town footprint exactly; all changes are visual-only.
source=open('/workspace/sites/nightshift/art/build-town.py').read()
exec(source.split('B=[')[0])
bpy.ops.wm.open_mainfile(filepath=ROOT+'/art/gummy-bay-town.blend')
M={m.name:m for m in bpy.data.materials}
for n,c in [('cream','D9D0B6'),('ivory','F2E4C9'),('brick','A96C53'),('blue','597F8A'),('sage','8D9A7A'),('pink','C39785'),('trim','E7D8B8'),('roof','3F5556'),('glass','304F5A'),('metal','5D6967'),('wood','846549'),('dark','344640'),('gold','DCB667'),('rust','9A5239'),('leaf','557B50')]:
 if n not in M:material(n,c)
import ast
B=ast.literal_eval(source.split('B=',1)[1].split('\nfor idx',1)[0])
footprints=json.load(open(ROOT+'/dist/assets/district-colliders.json'))
print('Existing Blender town loaded',flush=True)
# Real linear colour values for glTF's PBR pipeline (the old export used sRGB numbers directly).
for m in M.values():
 c=m.diffuse_color;linear=tuple(v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in c[:3]);m.diffuse_color=(*linear,1);m.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value=m.diffuse_color
# Each neighbourhood gets a consistent roof form and wall treatment.
for i,p in enumerate(footprints):
 x,z,w,d=p['x'],p['z'],p['w']-.7,p['d']-.7
 if i<50:row=i//10;col=i%10;h=6+((row+col)%3)*3
 else:h=6+((i-50)%5%3)*2
 if i%3==0:
  # Two pitched panels with a ridge, rather than another flat box.
  for side in [-1,1]:
   o=cube('Pitched roof',x+side*w*.25,h+.85,z,w*.55,.18,d+.8,'roof',.02)
   # Rotate around the panel's own centre, because source vertices are world-space.
   center=Vector((x+side*w*.25,-z,h+.85));angle=side*-.18
   from mathutils import Matrix
   for v in o.data.vertices:v.co=center+Matrix.Rotation(angle,3,'Y')@(v.co-center)
  cube('Ridge flashing',x,h+1.7,z,.18,.16,d+.9,'metal')
 if i%3==1:
  for yy in [0.3,0.6,0.9]:cube('Brick plinth',x,yy,z+d/2+.04,w,.10,.07,'brick',0)
 # Store awnings make street-level silhouettes useful from player eye height.
 cube('Canopy',x,2.75,z+d/2+.65,4,.12,1.35,'blue' if i%2 else 'rust')
 for side in [-1,1]:cube('Canopy support',x+side*1.85,2.48,z+d/2+.4,.05,.5,.06,'metal',0)
# Architectural finish on the original accessible street; no geometry in existing entrances.
for i,(x,z,w,d,color,floors) in enumerate(B):
 for side in [-1,1]:
  cube('Street pilaster',x+side*(w/2-.24),1.8,z+d/2+.13,.36,3.6,.28,'trim')
  for yy in [.45,.7,.95]:cube('Street plinth',x+side*w*.34,yy,z+d/2+.15,w*.29,.08,.12,'brick',0)
  cube('Door casing',x+side*w*.2,1.4,z+d/2+.2,.12,2.8,.22,'wood')
 cube('Door lintel',x,2.82,z+d/2+.2,w*.4+.15,.14,.22,'wood')
 # Downpipe on outside corner and gutter below cornice.
 cyl('Rain pipe',x+w/2+.16,1.85,z-d*.35,.055,3.7,'metal',8)
 cube('Rain gutter',x,3.5,z+d/2+.32,w,.12,.16,'metal')
 # Interior room-scale trims avoid all work surfaces and player paths.
 for side in [-1,1]:
  cube('Interior skirting',x+side*(w/2-.17),.16,z,.10,.22,d-.4,'wood',0)
  cube('Interior crown',x+side*(w/2-.17),3.25,z,.14,.16,d-.4,'trim',0)
 cube('Back skirting',x,.16,z-d/2+.17,w-.4,.22,.1,'wood',0)
 cube('Ceiling inset',x,3.44,z,w-.5,.06,d-.5,'ivory',0)
 # Shallow wall-mounted radiator and switches, not loose obstacle props.
 cube('Radiator',x-w*.34,.55,z-d/2+.25,1.3,.65,.19,'ivory')
 for j in range(8):cube('Radiator fin',x-w*.34-.55+j*.16,.55,z-d/2+.36,.045,.58,.05,'metal',0)
 cube('Light switch',x+w*.22,1.4,z+d/2-.18,.09,.13,.03,'ivory',0)
# Rental room: coherent warm wood floor, wall panels, headboard and bedding on the existing bed footprint.
for i in range(18):
 for j in range(9):
  xx=-33.5+i*.96;zz=32.1+j*1.84
  cube('Motel floorboard',xx,.045,zz,.94,.035,1.81,'wood' if (i+j)%4 else 'cream',0)
cube('Bed headboard',-31,1.1,42.45,2.1,1.6,.12,'wood')
for i in range(5):cube('Quilt seam',-31,1.19,43.25+i*.5,1.9,.018,.025,'blue',0)
# RV rebuilt in world coordinates with the same open doorway and collider footprint.
rvStart=set(bpy.data.objects)
x,z=-58,26
cube('RV chassis',x,.73,z,4.1,.17,8.85,'metal');cube('RV floor',x,.88,z,4.05,.12,8.7,'wood')
cube('RV left wall',x-2.05,1.95,z,.18,2.2,8.9,'ivory')
for zz,dd in [(-2.65,3.7),(3.1,2.8)]:cube('RV door side',x+2.05,1.95,z+zz,.18,2.2,dd,'ivory')
cube('RV rear wall',x,1.95,z-4.4,4.1,2.2,.18,'ivory');cube('RV cab lower',x,1.4,z+4.4,4.1,1.1,.18,'ivory')
cube('RV windscreen',x,2.55,z+4.44,3.65,1.1,.07,'glass');cube('Windscreen divider',x,2.55,z+4.5,.06,1.1,.05,'trim')
cube('RV roof',x,3.13,z,4.3,.22,8.95,'ivory',.09);cube('RV air conditioner',x,3.38,z-1.7,1.5,.4,1.7,'metal',.1)
for side in [-1,1]:
 for zz,dd in ([(-2.65,3.7),(3.1,2.8)] if side==1 else [(0,8.9)]):
  for yy,hh in [(1.24,.27),(1.49,.065)]:cube('RV stripe',x+side*2.151,yy,z+zz,.025,hh,dd,'rust',0)
 for zz in [-2.8,2.7]:
  tire=cyl('RV tyre',x+side*2.08,.63,z+zz,.6,.27,'dark',20);tire.rotation_euler.y=math.pi/2
  hub=cyl('RV hub',x+side*2.23,.63,z+zz,.31,.04,'metal',16);hub.rotation_euler.y=math.pi/2
 for zz in [-2.6,2.7]:
  cube('RV window frame',x+side*2.16,2.27,z+zz,.06,.93,1.7,'roof');cube('RV window',x+side*2.20,2.27,z+zz,.025,.77,1.53,'glass',0)
  cube('RV window divider',x+side*2.23,2.27,z+zz,.025,.78,.04,'trim',0)
 cube('RV lamp',x+side*1.55,1.35,z+4.52,.35,.24,.08,'gold')
cube('RV bumper',x,.73,z+4.57,4.25,.22,.29,'metal');cube('RV grille',x,1.23,z+4.53,1.8,.35,.05,'dark')
for i in range(6):cube('RV grille bar',x-.78+i*.31,1.23,z+4.57,.045,.32,.02,'metal',0)
# Preserve the same occupied interior footprints and open aisle.
cube('RV bunk',x-.8,1.17,z-2.6,1.8,.48,2.8,'sage',.09);cube('RV pillow',x-.8,1.48,z-3.2,1.5,.18,.65,'ivory',.08)
cube('RV kitchen',x-1,1.35,z+2.5,1.4,.8,2.1,'wood');cube('RV worktop',x-1,1.79,z+2.5,1.5,.1,2.2,'trim');cube('RV cupboards',x-1,2.62,z+2.5,1.4,.6,1.8,'cream')
for zz in [2,2.7]:cube('RV cabinet handle',x-.25,2.58,z+zz,.04,.035,.25,'metal',0)
rvObjects=set(bpy.data.objects)-rvStart
# Build spatial batches without repeated context joins.
batches={}
anchors=[(b[0],b[1]) for b in B]+[(p['x'],p['z']) for p in footprints]
originals=list(bpy.context.scene.objects)
for oi,o in enumerate(originals):
 if o.type!='MESH':continue
 # Repair winding while components are still closed, before partitioning faces.
 bm=bmesh.new();bm.from_mesh(o.data);bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces));bm.to_mesh(o.data);bm.free()
 coords=[o.matrix_world@v.co for v in o.data.vertices]
 for poly in o.data.polygons:
  verts=[coords[i] for i in poly.vertices]
  if o in rvObjects:key='RV'
  else:
   cx=sum(v.x for v in verts)/len(verts);cz=-sum(v.y for v in verts)/len(verts)
   idx=min(range(len(anchors)),key=lambda i:(cx-anchors[i][0])**2+(cz-anchors[i][1])**2);key='Building_%02d'%idx
  m=o.data.materials[poly.material_index];kind=m.name if m.name in ['glass','metal'] else 'Matte'
  data=batches.setdefault((key,kind),[[],[],[]]);base=len(data[0]);data[0].extend(tuple(v) for v in verts);data[1].append(tuple(range(base,base+len(verts))));data[2].append(tuple(m.diffuse_color))
 if oi%100==0:print('Partition',oi,flush=True)
for o in originals:
 if o.type=='MESH':bpy.data.objects.remove(o,do_unlink=True)
matte=bpy.data.materials.new('Matte');matte.use_nodes=True;node=matte.node_tree.nodes.new('ShaderNodeVertexColor');node.layer_name='Color';matte.node_tree.links.new(node.outputs['Color'],matte.node_tree.nodes['Principled BSDF'].inputs['Base Color']);matte.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value=.86
roots={}
for bi,((key,kind),(verts,faces,cols)) in enumerate(batches.items()):
 mesh=bpy.data.meshes.new(key+'_'+kind);mesh.from_pydata(verts,[],faces);mesh.update()
 mesh.materials.append(matte if kind=='Matte' else M[kind]);o=bpy.data.objects.new(key+'_'+kind,mesh);bpy.context.collection.objects.link(o)
 mesh.uv_layers.new(name='SurfaceUV');mesh.color_attributes.new(name='Color',type='BYTE_COLOR',domain='CORNER');uv=mesh.uv_layers['SurfaceUV'];col=mesh.color_attributes['Color']
 for poly,c in zip(mesh.polygons,cols):
  axis=max(range(3),key=lambda a:abs(poly.normal[a]));axes=[a for a in range(3) if a!=axis]
  for li in poly.loop_indices:
   v=mesh.vertices[mesh.loops[li].vertex_index].co;uv.data[li].uv=(v[axes[0]]*.5,v[axes[1]]*.5);col.data[li].color=c if kind=='Matte' else (1,1,1,1)
 if key not in roots:
  root=bpy.data.objects.new(key,None);bpy.context.collection.objects.link(root);roots[key]=root
 o.parent=roots[key]
 if bi%20==0:print('Batch',bi,'/',len(batches),flush=True)
bpy.ops.wm.save_as_mainfile(filepath=ROOT+'/art/v11/environment-final.blend')
bpy.ops.export_scene.gltf(filepath=ROOT+'/dist/assets/environment-v11-final.glb',export_format='GLB',export_animations=False)
# Street-eye-height asset validation render (existing lower walls supplied solely for preview).
for x,z,w,d,color,floors in B:
 for side in [-1,1]:cube('Preview wall',x+side*w*.35,1.75,z+d/2,w*.3,3.5,.25,color)
 cube('Preview rear',x,1.75,z-d/2,w,3.5,.25,color)
cube('Preview pavement',0,-.16,0,180,.2,150,'cream',0)
bpy.ops.object.light_add(type='SUN');sun=bpy.context.object;sun.rotation_euler=(.5,-.3,-.5);sun.data.energy=2.4;sun.data.angle=.08
bpy.context.scene.world.color=(.3,.3,.3)
bpy.ops.object.camera_add(location=(5,-58,3.2));cam=bpy.context.object;cam.rotation_euler=(Vector((-24,-25,3))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.lens=27;sc=bpy.context.scene;sc.camera=cam;sc.render.engine='CYCLES';sc.cycles.samples=16;sc.render.resolution_x=1100;sc.render.resolution_y=700;sc.render.resolution_percentage=100;sc.render.filepath=ROOT+'/art/v11/street-preview.png';bpy.ops.render.render(write_still=True)
