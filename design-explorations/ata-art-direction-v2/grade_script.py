import numpy as np
from PIL import Image,ImageFilter
rng=np.random.default_rng(7)
def smooth(x,a,b):
    t=np.clip((x-a)/(b-a),0,1);return t*t*(3-2*t)
def grade(im,strength=1.0,warm=1.0,vig=0.22,grain=0.011,sat=0.93,lift=0.02):
    a=np.asarray(im.convert('RGB'),dtype=np.float32)/255.0
    L=(0.2126*a[...,0]+0.7152*a[...,1]+0.0722*a[...,2])[...,None]
    # gentle filmic S-curve
    c=a**1.0
    c=c+(0.5-np.abs(c-0.5))*0*c
    c=np.clip(0.5+(c-0.5)*(1.0+0.16*strength),0,1)
    c=c*(1-lift)+lift*0.9*np.array([0.30,0.42,0.45])   # lifted teal-brown blacks
    # split tone
    sh=1-smooth(L,0.15,0.55);hi=smooth(L,0.55,0.95)
    c=c*(1-0.16*strength*sh)+0.16*strength*sh*c*np.array([0.78,1.0,1.08])
    c=c*(1-0.20*warm*hi)+0.20*warm*hi*c*np.array([1.10,1.0,0.80])
    # saturation
    g=(0.2126*c[...,0]+0.7152*c[...,1]+0.0722*c[...,2])[...,None]
    c=g+(c-g)*sat
    # vignette
    h,w=c.shape[:2];yy,xx=np.mgrid[0:h,0:w];r=np.hypot((xx-w/2)/(w/2),(yy-h/2)/(h/2))/1.41
    c=c*(1-vig*smooth(r,0.35,1.0))[...,None]
    # luminance-weighted grain
    n=rng.normal(0,grain,(h,w,1)).astype(np.float32)*(0.4+0.6*(1-np.abs(g-0.5)*2))
    c=np.clip(c+n,0,1)
    return Image.fromarray((c*255).astype(np.uint8))
def fit(im,w,h,cx=0.5,cy=0.5):
    s=max(w/im.width,h/im.height);im=im.resize((round(im.width*s),round(im.height*s)),Image.LANCZOS)
    x=int((im.width-w)*cx);y=int((im.height-h)*cy);return im.crop((x,y,x+w,y+h))
if __name__=='__main__':
    H='../hires/'
    def load(n):return Image.open(H+n+'.jpg').convert('RGB')
    cin=load('cinema');nig=load('night');val=load('valley');ker=load('keren')
    # fallbacks at 1600-1800 px from earlier grading pipeline
    har=Image.open('../real/harbour.webp').convert('RGB')
    jobs={
     'A_d':(cin,2880,1800,0.50,0.62,dict(warm=1.1)),
     'A_m':(cin,1170,2532,0.44,0.5,dict(warm=1.1)),
     'B1':(cin,1800,1200,0.5,0.55,dict(warm=1.0)),
     'B2':(val,1800,1200,0.5,0.55,dict(warm=1.0)),
     'B3':(har,1600,1066,0.5,0.55,dict(warm=1.0)),
     'C_d':(nig,2880,1800,0.5,0.62,dict(warm=0.8,vig=0.28)),
     'C_m':(nig,1170,2532,0.30,0.5,dict(warm=0.8,vig=0.28)),
    }
    for k,(im,w,h,cx,cy,kw) in jobs.items():
        g=grade(fit(im,w,h,cx,cy),**kw);g.save(f'img/{k}.jpg',quality=90);print(k,g.size)
    # raw vs graded check
    r=fit(cin,1200,750,0.5,0.62);g=grade(r,warm=1.1);s=Image.new('RGB',(2400,750));s.paste(r,(0,0));s.paste(g,(1200,0));s.resize((1600,500)).save('grade_check.png')
