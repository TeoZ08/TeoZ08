#!/usr/bin/env python3
"""Render an animated GitHub panorama with an independent transparent typography layer."""
from pathlib import Path
import math
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFont

W, SCENE_H, H, FRAMES = 1200, 400, 650, 84
OUTPUT = Path('assets')


def typeface(size, family='serif'):
    options = {
        'serif': [
            '/usr/share/fonts/truetype/liberation2/LiberationSerif-Regular.ttf',
            '/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf',
        ],
        'italic': [
            '/usr/share/fonts/truetype/liberation2/LiberationSerif-Italic.ttf',
            '/usr/share/fonts/truetype/dejavu/DejaVuSerifCondensed-Italic.ttf',
            '/usr/share/fonts/truetype/dejavu/DejaVuSerif-Italic.ttf',
        ],
        'sans': [
            '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
            '/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf',
        ]
    }[family]
    for path in options:
        if Path(path).is_file():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def draw_center(draw, txt, cx, top, font, color, tracking=0):
    if tracking:
        widths = [draw.textlength(char, font=font) for char in txt]
        total = sum(widths) + tracking * (len(txt) - 1)
        x = cx - total / 2
        for char, advance in zip(txt, widths):
            draw.text((round(x+1), top+2), char, fill=(2, 4, 6, 155), font=font)
            draw.text((round(x), top), char, fill=color, font=font)
            x += advance + tracking
    else:
        bbox = draw.textbbox((0, 0), txt, font=font)
        x = cx - (bbox[2] - bbox[0]) / 2
        draw.text((round(x + 1), top + 2), txt, fill=(2, 4, 6, 150), font=font)
        draw.text((round(x), top), txt, fill=color, font=font)


def typography_layer():
    overlay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    white = (234, 235, 232, 255)
    muted = (207, 212, 213, 255)
    gold = (184, 155, 94, 255)
    draw_center(draw, 'Matteo Lima Scotti', W // 2, 408, typeface(68, 'serif'), white)
    draw_center(draw, 'COMPUTER SCIENCE  ·  UFMS', W // 2, 493, typeface(18, 'sans'), gold, tracking=2.4)
    for value, x in [
        ('Backend development', 227),
        ('C# / .NET', 600),
        ('applied AI', 970),
    ]:
        draw_center(draw, value, x, 541, typeface(28, 'italic'), muted)
    draw_center(draw,
        'I build reliable software for systems, integrations and real-world workflows.',
        W // 2, 603, typeface(19, 'italic'), (184, 188, 190, 255))
    return overlay


def main():
    OUTPUT.mkdir(exist_ok=True, parents=True)
    source = Image.open(OUTPUT / 'banner-paisagem-animado.webp')
    source.seek(0)
    base = np.asarray(source.convert('RGB').resize((W, SCENE_H), Image.Resampling.LANCZOS), dtype=np.uint8)

    # Extend original water without stretching its horizontal details.
    extension_h = H - SCENE_H
    tail = np.asarray(base[::-1][:extension_h], dtype=np.float32)
    yy = np.arange(extension_h, dtype=np.float32)[:, None, None]
    fade = np.exp(-yy / 49.0)
    deep = np.array([4, 6, 9], dtype=np.float32)[None, None, :]
    tail = np.clip(tail * fade + deep * (1-fade), 0, 255).astype(np.uint8)
    canvas = np.vstack((base, tail))

    # Keep fonts editable and the text perfectly still over the animated scene.
    typography = typography_layer()
    typography.save(OUTPUT / 'painel-identidade.png', optimize=True)
    overlay = np.asarray(typography, dtype=np.uint8)
    rgb_overlay = overlay[:, :, :3].astype(np.float32)
    alpha = overlay[:, :, 3:4].astype(np.float32) / 255

    Y, X = np.indices((H, W), dtype=np.float32)
    cloud_mask = np.clip((268 - Y) / 55, 0, 1)
    tree_mask = np.exp(-((X - W/2) / 72) ** 4) * np.exp(-((Y - 200)/64) ** 4)
    cloud_mask = cv2.GaussianBlur(cloud_mask * (1 - tree_mask), (0, 0), sigmaX=7, sigmaY=5)
    lake_mask = np.clip((Y - 272) / 30, 0, 1)
    frames = []
    for i in range(FRAMES):
        phase = 2 * math.pi * i / FRAMES
        dx_sky = cloud_mask * (10 * math.sin(phase) + 2 * np.sin(phase + X / 170))
        dx_water = lake_mask * (3.5 * np.sin(Y * .17 + phase * 2 + X * .012) + 1.8 * np.sin(Y * .045 - phase * 2))
        dy_water = lake_mask * (1.1 * np.sin(Y * .15 + phase * 2))
        mx = np.clip(X + dx_sky + dx_water, 0, W-1).astype(np.float32)
        my = np.clip(Y + dy_water, 0, H-1).astype(np.float32)
        motion = cv2.remap(canvas, mx, my, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
        light = (0.027 * lake_mask * np.sin(Y * .22 + X * .014 + phase * 2))[:, :, None]
        motion = np.clip(motion.astype(np.float32) * (1 + light), 0, 255)
        motion = np.clip(motion * (1-alpha) + rgb_overlay * alpha, 0, 255).astype(np.uint8)
        frames.append(Image.fromarray(motion, 'RGB'))

    frames[0].save(OUTPUT / 'hero-perfil-animado.webp', save_all=True,
                   append_images=frames[1:], duration=125, loop=0,
                   format='WEBP', quality=82, method=5, minimize_size=True)
    frames[0].save(OUTPUT / 'hero-perfil-estatico.png', optimize=True)
    result = Image.open(OUTPUT / 'hero-perfil-animado.webp')
    assert result.n_frames == FRAMES, f'Expected {FRAMES} frames; got {result.n_frames}'
    print(f'Animated hero: {result.size}, {result.n_frames} frames, {(OUTPUT / "hero-perfil-animado.webp").stat().st_size:,} bytes')

if __name__ == '__main__':
    main()
