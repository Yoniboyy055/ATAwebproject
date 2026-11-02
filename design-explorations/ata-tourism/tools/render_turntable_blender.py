import bpy,sys,math,os,mathutils
name=sys.argv[sys.argv.index('--')+1];N=int(sys.argv[sys.argv.index('--')+2]);RES=int(sys.argv[sys.argv.index('--')+3]);SAMPLES=int(sys.argv[sys.argv.index('--')+4])
span=180.0;start=-80.0
src='/tmp/claude-0/-home-user/66fbf439-bf44-55fc-88c1-86466deb0481/scratchpad/ata/own/glb/%s_raw.glb'%name
out='/tmp/claude-0/-home-user/66fbf439-bf44-55fc-88c1-86466deb0481/scratchpad/ata/render/%s'%name
os.makedirs(out,exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=src)
objs=[o for o in bpy.context.scene.objects if o.type=='MESH']
# bounds
mn=mathutils.Vector((1e9,)*3);mx=mathutils.Vector((-1e9,)*3)
for o in objs:
    for c in o.bound_box:
        w=o.matrix_world@mathutils.Vector(c)
        for i in range(3):mn[i]=min(mn[i],w[i]);mx[i]=max(mx[i],w[i])
ctr=(mn+mx)/2;size=max(mx-mn)
pivot=bpy.data.objects.new('pivot',None);bpy.context.scene.collection.objects.link(pivot)
for o in bpy.context.scene.objects:
    if o is not pivot and o.parent is None:o.parent=pivot
k=2.0/size
pivot.scale=(k,k,k);pivot.location=(-ctr.x*k,-ctr.y*k,-ctr.z*k)
# pivot on empty at origin so rotation is around centre
rot=bpy.data.objects.new('rot',None);bpy.context.scene.collection.objects.link(rot);pivot.parent=rot
bpy.context.view_layer.update()
# world
w=bpy.data.worlds.new('w');bpy.context.scene.world=w;w.use_nodes=True;nt=w.node_tree
for n in list(nt.nodes):nt.nodes.remove(n)
sky=nt.nodes.new('ShaderNodeTexSky');sky.sky_type='MULTIPLE_SCATTERING'
try:
    sky.sun_elevation=math.radians(38);sky.sun_rotation=math.radians(40);sky.air_density=1.0;sky.dust_density=2.0
except Exception:pass
bg=nt.nodes.new('ShaderNodeBackground');bg.inputs['Strength'].default_value=1.0
o=nt.nodes.new('ShaderNodeOutputWorld')
nt.links.new(sky.outputs[0],bg.inputs[0]);nt.links.new(bg.outputs[0],o.inputs[0])
# key light
sun=bpy.data.lights.new('sun','SUN');sun.energy=0.55;sun.angle=math.radians(30);so=bpy.data.objects.new('sun',sun);bpy.context.scene.collection.objects.link(so)
so.rotation_euler=(math.radians(52),0,math.radians(35))
fill=bpy.data.lights.new('fill','AREA');fill.energy=30;fill.size=6;fo=bpy.data.objects.new('fill',fill);bpy.context.scene.collection.objects.link(fo);fo.location=(-4,-3,3);fo.rotation_euler=(math.radians(60),0,math.radians(-50))
# shadow-catcher floor
FLOOR=(mn.z-ctr.z)*k-0.01
bpy.ops.mesh.primitive_plane_add(size=14,location=(0,0,FLOOR))
fl=bpy.context.active_object;fl.is_shadow_catcher=True;fl.hide_render=True;sc0=bpy.context.scene;sc0.render.film_transparent=True
# camera
cam=bpy.data.cameras.new('c');cam.lens=70;co=bpy.data.objects.new('c',cam);bpy.context.scene.collection.objects.link(co);bpy.context.scene.camera=co
co.location=(0,-6.4,2.5);d=mathutils.Vector((0,0,0))-co.location;co.rotation_euler=d.to_track_quat('-Z','Y').to_euler()
sc=bpy.context.scene
sc.render.engine='CYCLES';sc.cycles.device='CPU';sc.cycles.samples=SAMPLES;sc.cycles.use_denoising=True
try:sc.cycles.denoiser='OPENIMAGEDENOISE'
except Exception:pass
sc.render.film_transparent=True;sc.render.resolution_x=RES;sc.render.resolution_y=int(RES*0.78);sc.render.resolution_percentage=100
sc.render.image_settings.file_format='PNG';sc.render.image_settings.color_mode='RGBA'
sc.view_settings.view_transform='Standard'
sc.cycles.use_adaptive_sampling=True
sc.view_settings.look='AgX - Base Contrast' if 'AgX - Base Contrast' in [i.identifier for i in bpy.types.ColorManagedViewSettings.bl_rna.properties['look'].enum_items] else 'None'
sc.view_settings.exposure=-1.25
for i in range(N):
    a=start+span*i/(N-1)
    rot.rotation_euler=(0,0,math.radians(a))
    sc.render.filepath=os.path.join(out,'f%02d.png'%i)
    bpy.ops.render.render(write_still=True)
print('done',name)
