#!/usr/bin/env python3
"""Build a continuous animated panorama + editorial identity for profile README."""
from pathlib import Path
import math
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFont

W,H,PANEL_H,FRAMES=1200,400,265,96

def font(size,serif=False):
    candidates=(
        ["/usr/share/fonts/truetype/liberation2/LiberationSerif-Regular.ttf",
         "/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf",
         "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf"]
        if serif else
        ["/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
         "/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf"])
    for name in candidates:
        if Path(name).exists():return ImageFont.truetype(name,size)
    return ImageFont.load_default()

def center(d,text,y,f,fill,spacing=0):
    if spacing:
        widths=[d.textlength(ch,font=f) for ch in text]
        x=(W-sum(widths)-(len(text)-1)*spacing)/2
        for ch,cw in zip(text,widths):
            d.text((round(x),y),ch,font=f,fill=fill)
            x+=cw+spacing
    else:
        bb=d.textbbox((0,0),text,font=f)
        d.text(((W-(bb[2]-bb[0]))/2,y),text,font=f,fill=fill)

def identity_panel(base):
    # Extend the panorama with actual reflected water from its final row.
    tail=base[-1::-1][:PANEL_H]
    yy=np.arange(PANEL_H,dtype=np.float32)[:,None,None]
    fade=np.exp(-yy/37)
    dark=np.array([5,8,11],dtype=np.float32).reshape(1,1,3)
    panel=np.clip(tail*fade+dark*(1-fade),0,255).astype(np.uint8)
    im=Image.fromarray(panel,'RGB')
    d=ImageDraw.Draw(im)
    center(d,"Matteo Lima Scotti",26,font(62,True),(235,237,236))
    d.line((290,109,405,109),fill=(117,96,57),width=1)
    d.line((795,109,910,109),fill=(117,96,57),width=1)
    center(d,"COMPUTER SCIENCE  ·  UFMS",96,font(18),(178,150,87),2.7)
    center(d,"Backend development  ·  C# / .NET  ·  applied AI",146,font(25),(235,237,236))
    center(d,"I build reliable software for systems, integrations and real-world workflows.",193,font(19),(167,173,177))
    d.line((523,235,677,235),fill=(82,72,53),width=1)
    return im

def main():
    src=Path("assets/banner-paisagem-animado.webp")
    out=Path("assets")
    out.mkdir(parents=True,exist_ok=True)
    assert src.is_file(),"Original landscape is required"
    source=Image.open(src)
    source.seek(0)
    base=np.asarray(source.convert("RGB").resize((W,H),Image.Resampling.LANCZOS),dtype=np.uint8)
    panel=identity_panel(base)
    assert np.array_equal(np.asarray(panel)[0],base[-1]),"Scene seam failed"
    panel.save(out/"painel-identidade.png",optimize=True)
    Y,X=np.indices((H,W),dtype=np.float32)
    mask=np.clip((258-Y)/42,0,1)
    tree=np.exp(-((X-600)/85)**4)*np.exp(-((Y-204)/74)**4)
    mask=cv2.GaussianBlur(np.clip(mask*(1-.98*tree),0,1),(0,0),sigmaX=7,sigmaY=5)
    water=np.clip((Y-264)/30,0,1)
    near=np.clip((Y-264)/136,0,1)
    panel_rgb=np.asarray(panel)
    frames=[]
    for i in range(FRAMES):
        phase=2*math.pi*i/FRAMES
        sky=mask*(11*np.sin(phase)+3*np.sin(phase+X/230))
        ripples=water*((3.6+near*3.7)*(np.sin((Y-264)*.135+2*phase)+.28*np.sin(Y*.042-3*phase+X*.002)))
        vertical=water*(.7*np.sin(Y*.16+2*phase))
        mx=np.clip(X+sky+ripples,0,W-1).astype("float32")
        my=np.clip(Y+vertical,0,H-1).astype("float32")
        moving=cv2.remap(base,mx,my,cv2.INTER_LINEAR,borderMode=cv2.BORDER_REPLICATE)
        shimmer=np.sin((Y-264)*.20+X*.014+3*phase)*np.sin((Y-264)*.063-2*phase)
        moving=np.clip(moving.astype("float32")*(1+.10*shimmer*near*water)[...,None],0,255).astype("uint8")
        lower=panel_rgb.copy()
        for yy in range(18):
            fade=math.exp(-yy/4)
            lower[yy]=np.clip(lower[yy].astype("float32")*(1-fade)+moving[-1].astype("float32")*fade,0,255).astype("uint8")
        frames.append(Image.fromarray(np.vstack([moving,lower]),"RGB"))
    target=out/"hero-perfil-animado.webp"
    frames[0].save(target,save_all=True,append_images=frames[1:],duration=110,loop=0,
                   format="WEBP",quality=79,method=5,minimize_size=True)
    frames[0].save(out/"hero-perfil-estatico.png",optimize=True)
    read=Image.open(target)
    assert read.n_frames==FRAMES,"Animated export did not preserve all frames"
    print("Ready:",target,target.stat().st_size,"bytes",read.n_frames,"frames")

if __name__=="__main__":
    main()
