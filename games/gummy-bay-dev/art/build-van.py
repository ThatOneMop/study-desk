from pathlib import Path
exec(Path('/workspace/sites/nightshift/art/build-town.py').read_text().split('B=[',1)[0])
# Compact original electric delivery van: metres, front towards game +Z.
cube('Lower body',0,.65,0,1.9,.75,3.8,'blue',.14)
cube('Cargo box',0,1.3,-.65,1.82,1.35,2.1,'cream',.12)
cube('Cab',0,1.22,1,1.72,1.2,1.3,'blue',.12)
cube('Windshield',0,1.53,1.67,1.4,.62,.04,'glass',.02)
for side in [-1,1]:
 cube('Side glass',side*.87,1.5,1,.035,.56,.88,'glass',.01)
 cube('Door handle',side*.91,.95,.9,.06,.045,.24,'metal',.01)
 cube('Mirror',side*1.02,1.4,1.4,.25,.22,.18,'metal',.04)
 cube('Headlight',side*.6,.73,1.94,.34,.22,.07,'ivory',.02)
 cube('Tail light',side*.68,.84,-1.95,.2,.28,.06,'rust',.02)
 for z in [-1.15,1.14]:
  o=cyl('Wheel',side*.95,.43,z,.4,.21,'dark',20);o.rotation_euler.y=math.pi/2
  o=cyl('Wheel hub',side*1.07,.43,z,.23,.035,'metal',16);o.rotation_euler.y=math.pi/2
cube('Bumper',0,.43,1.96,1.83,.16,.16,'metal',.03)
cube('Cargo door split',0,1.27,-1.72,.025,1.14,.03,'metal',0)
cube('Delivery stripe',0,.97,1.96,1.7,.12,.04,'gold',.01)
# Stylised raised parcel icon on each cargo side.
for side in [-1,1]:
 cube('Parcel logo',side*.925,1.4,-.6,.035,.45,.55,'gold',.01)
 cube('Parcel tape',side*.95,1.4,-.6,.025,.46,.065,'ivory',0)
bpy.ops.wm.save_as_mainfile(filepath=ROOT+'/art/delivery-van.blend')
bpy.ops.export_scene.gltf(filepath=ROOT+'/dist/assets/delivery-van.glb',export_format='GLB',export_yup=True,export_animations=False)
