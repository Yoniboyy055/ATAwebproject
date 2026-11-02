import math,json,urllib.request,time,io
import numpy as np
from PIL import Image
UA="ATA-design-review/1.0 (private design exploration)"
LON0,LON1,LAT0,LAT1=38.80,39.62,15.18,15.72
Z=11;N=2**Z
def tx(lon):return (lon+180)/360*N
def ty(lat):
    r=math.radians(lat);return (1-math.log(math.tan(r)+1/math.cos(r))/math.pi)/2*N
x0,x1=int(tx(LON0)),int(tx(LON1));y0,y1=int(ty(LAT1)),int(ty(LAT0))
print('tiles',x0,x1,y0,y1,(x1-x0+1)*(y1-y0+1))
import os
W=(x1-x0+1)*256;H=(y1-y0+1)*256;mos=np.zeros((H,W),dtype=np.float32)
for x in range(x0,x1+1):
    for y in range(y0,y1+1):
        u=f"https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{Z}/{x}/{y}.png"
        for k in range(4):
            try:
                d=urllib.request.urlopen(urllib.request.Request(u,headers={"User-Agent":UA}),timeout=40).read();break
            except Exception as e: time.sleep(3)
        a=np.array(Image.open(io.BytesIO(d)).convert('RGB')).astype(np.float32)
        mos[(y-y0)*256:(y-y0+1)*256,(x-x0)*256:(x-x0+1)*256]=a[...,0]*256+a[...,1]+a[...,2]/256-32768
# resample to regular lon/lat grid
GW,GH=480,int(480*(LAT1-LAT0)/(LON1-LON0)*1.0*math.cos(math.radians(15.45)) ** -1 * math.cos(math.radians(15.45)))
GH=int(GW*((LAT1-LAT0)/(LON1-LON0)))
def map_coordinates(a,coords,order=1,mode='nearest'):
    yy,xx=coords;yy=np.clip(yy,0,a.shape[0]-1.001);xx=np.clip(xx,0,a.shape[1]-1.001)
    y0=np.floor(yy).astype(int);x0=np.floor(xx).astype(int);fy=yy-y0;fx=xx-x0
    return a[y0,x0]*(1-fy)*(1-fx)+a[y0,x0+1]*(1-fy)*fx+a[y0+1,x0]*fy*(1-fx)+a[y0+1,x0+1]*fy*fx
lons=np.linspace(LON0,LON1,GW);lats=np.linspace(LAT1,LAT0,GH)
px=(np.array([tx(l) for l in lons])-x0)*256
py=(np.array([ty(l) for l in lats])-y0)*256
PX,PY=np.meshgrid(px,py)
grid=map_coordinates(mos,[PY,PX],order=1,mode='nearest').astype(np.float32)
print('grid',grid.shape,'min',grid.min(),'max',grid.max())
np.save('grid.npy',grid)
# route profile
rt=json.load(open('route.json'))['routes'][0]['geometry']['coordinates']
pts=np.array(rt);seg=np.hypot(np.diff(pts[:,0])*math.cos(math.radians(15.4)),np.diff(pts[:,1]));cum=np.concatenate([[0],np.cumsum(seg)]);cum/=cum[-1]
K=160;tt=np.linspace(0,1,K);rl=np.interp(tt,cum,pts[:,0]);rb=np.interp(tt,cum,pts[:,1])
gx=(rl-LON0)/(LON1-LON0)*(GW-1);gy=(LAT1-rb)/(LAT1-LAT0)*(GH-1)
el=map_coordinates(grid,[gy,gx],order=1)
print('route elev start',el[0],'end',el[-1],'max',el.max(),'min',el.min())
# smooth profile lightly
k=np.ones(5)/5;els=np.convolve(np.pad(el,2,mode='edge'),k,mode='valid')
json.dump(dict(bbox=[LON0,LON1,LAT0,LAT1],gw=GW,gh=GH,prof=[round(float(v)) for v in els],rx=[round(float(v)/(GW-1),4) for v in gx],ry=[round(float(v)/(GH-1),4) for v in gy]),open('route_dem.json','w'))
# elevation PNG (16-bit packed into RG)
e=np.clip((grid+100)*20,0,65535).astype(np.uint16)
out=np.zeros((GH,GW,3),dtype=np.uint8);out[...,0]=e>>8;out[...,1]=e&255
Image.fromarray(out).save('height.png')
# baked shaded-relief texture at 3x
S=3;big=map_coordinates(grid,np.meshgrid(np.linspace(0,GH-1,GH*S),np.linspace(0,GW-1,GW*S),indexing='ij'),order=1)
dy,dx=np.gradient(big,(LAT1-LAT0)/ (GH*S)*111000,(LON1-LON0)/(GW*S)*111000*math.cos(math.radians(15.45)))
dx=-dx
az,alt=math.radians(315),math.radians(38)
slope=np.arctan(np.hypot(dx,dy)*1.8);aspect=np.arctan2(dy,-dx)
shade=np.sin(alt)*np.cos(slope)+np.cos(alt)*np.sin(slope)*np.cos(az-aspect);shade=np.clip(shade,0,1)
def ramp(h):
    stops=[(-400,(18,70,92)),(-5,(40,126,140)),(0,(212,196,150)),(150,(196,176,122)),(600,(150,150,92)),(1100,(128,132,84)),(1700,(176,160,112)),(2200,(214,196,150)),(2600,(238,226,196))]
    xs=[s[0] for s in stops];res=np.zeros(h.shape+(3,))
    for c in range(3):res[...,c]=np.interp(h,xs,[s[1][c] for s in stops])
    return res
col=ramp(big)*(0.35+0.85*shade[...,None])
col=np.clip(col,0,255).astype(np.uint8)
Image.fromarray(col).save('relief.webp','WEBP',quality=84,method=6)
print(col.shape)
