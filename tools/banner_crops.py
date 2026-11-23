#!/usr/bin/env python3
"""Make the homepage banner crops from one full-resolution photo (any photo, portrait or landscape).

The banner fills the browser window below the navbar, so its shape depends on the
window: about 0.45 wide per 1 tall on phones, up to about 2.7:1 on laptops (browser
toolbars eat a lot of the height). No single crop looks right on all of those, so this
makes up to five, each cut for a range of window shapes, works out which crop suits
which window, and prints the <picture> markup for index.html.

Usage (needs Pillow:  pip install pillow):

    python tools/banner_crops.py originals/22Nov2026Launch.jpeg 22Nov2026Launch \
        --subject 0.05 0.337 0.975 0.762

--subject   left top right bottom of what must stay visible, as fractions of the
            photo's width and height. Read the pixel positions in any image editor and
            divide by the photo's width/height. For the 22 Nov 2026 photo: the outermost
            people are at 5% and 97.5% across, the tip of the raised rocket is 33.7% down
            and the lowest shoes are 76.2% down.

It writes Images/<name>-tall/-portrait/-landscape/-wide/-ultrawide.webp (only the ones
the photo needs) and prints the <picture> markup to paste into index.html.
Keep the original photo in originals/ (not in git).

What it does when a window shape can't show everything:
  - never cuts the subject at the sides, and keeps a little sky above its top;
  - takes what has to go from the bottom (shoes, then legs);
  - on shapes much taller than the subject (phones), crops away empty sides first, and
    only if the subject itself is too wide, adds space above the photo by mirroring
    what's above the subject. That looks natural for sky or a plain wall; check the
    -tall crop if the top of the photo is busy.
"""

import argparse
import math
import os

from PIL import Image, ImageFilter, ImageOps

# name, crop shape (width / height), saved width in px
CROPS = [
    ("tall", 9 / 19.5, 1080),    # phones held upright
    ("portrait", 0.67, 1440),    # tablets upright, narrow browser windows
    ("landscape", 1.1, 1920),    # half-screen windows, tablets sideways
    ("wide", 1.9, 1920),         # MacBook-shaped windows
    ("ultrawide", 2.3, 2560),    # most laptop/desktop windows, wide monitors, phones sideways
]

NAVBAR_PX = 70           # the banner is the window minus the fixed navbar (css: .intro-pin)
TYPICAL_WINDOW_H = 880   # used to turn banner shapes into window shapes for the media queries
WIDEST_BANNER = 2.9      # e.g. a 21:9 monitor with browser toolbars, or a phone held sideways
MIN_SKY = 0.02           # sky always kept above the subject on screen, in photo heights
SIDE_ROOM = 0.04         # space kept beside the subject when cropping the sides, in photo widths
QUALITY = 74


def crop_extent(photo_ratio, r, subject, widest):
    """Part of the photo a crop of shape r uses: (x0, x1, y0, y1) as fractions of the
    photo's width and height. y0 < 0 means space is added above the photo.

    Sideways: the biggest rectangle of shape r that fits in the photo, centred on the
    subject; never narrower than the subject (plus SIDE_ROOM) - if that makes it taller
    than the photo, space is added above instead of cutting the subject.

    Up and down: on a banner wider than the crop, object-fit: cover trims the top and
    bottom equally, most of all on the widest banner the crop is used for (`widest`).
    The crop is placed so that even there, MIN_SKY of sky stays above the subject;
    whatever has to go is taken from the bottom."""
    left, top, right, _ = subject
    cw = min(1.0, r / photo_ratio)                         # full width or full height, whichever fits
    cw = max(cw, min(1.0, right - left + 2 * SIDE_ROOM))   # but never narrower than the subject
    ch = cw * photo_ratio / r
    x0 = min(max((left + right) / 2 - cw / 2, 0.0), 1 - cw)
    if ch > 1:                                             # taller than the photo: add space above
        return x0, x0 + cw, 1 - ch, 1.0
    seen = cw * photo_ratio / widest                       # height still on screen at the widest banner
    y0 = (top - MIN_SKY - 0.005) + seen / 2 - ch / 2
    y0 = min(max(y0, 0.0), 1 - ch)
    return x0, x0 + cw, y0, y0 + ch


def visible(box_ratio, crop_ratio, extent):
    """What part of the photo a banner of shape box_ratio shows with object-fit: cover."""
    x0, x1, y0, y1 = extent
    if box_ratio >= crop_ratio:                            # banner wider: top and bottom are trimmed
        h = (y1 - y0) * crop_ratio / box_ratio
        mid = (y0 + y1) / 2
        return x0, x1, mid - h / 2, mid + h / 2
    w = (x1 - x0) * box_ratio / crop_ratio                 # banner narrower: sides are trimmed
    mid = (x0 + x1) / 2
    return mid - w / 2, mid + w / 2, y0, y1


def badness(box_ratio, crop_ratio, extent, subject):
    """How bad a crop looks on a banner of this shape (0 = whole subject visible)."""
    left, top, right, bottom = subject
    x0, x1, y0, y1 = visible(box_ratio, crop_ratio, extent)
    cut_sides = max(0.0, x0 - (left - 0.005)) + max(0.0, (right + 0.005) - x1)
    cut_top = max(0.0, y0 - (top - MIN_SKY))               # keep some sky above the subject
    cut_bottom = max(0.0, bottom - y1)
    added_space = max(0.0, min(y1, 0.0) - y0)              # how much generated space is on screen
    mismatch = abs(math.log(box_ratio / crop_ratio))       # tie-breaker: least trimming wins
    return 10 * cut_sides + 10 * cut_top + cut_bottom + 0.5 * added_space + 0.02 * mismatch


def add_space_above(photo, out_h, rows):
    """Extend the photo upward to out_h using its top `rows` (sky, wall...)."""
    w, h = photo.size
    extra = out_h - h
    if extra <= 0:
        return photo.resize((w, out_h), Image.LANCZOS)
    band = photo.crop((0, 0, w, rows))
    if extra <= 2.5 * rows:
        # Enough real sky: mirror it upward (about two copies looks like more of the same sky).
        space = Image.new("RGB", (w, extra))
        y, flip = extra, True
        while y > 0:                                       # build upward; each copy mirrors the one below
            y -= band.height
            space.paste(ImageOps.flip(band) if flip else band, (0, y))
            flip = not flip
        space = space.filter(ImageFilter.GaussianBlur(6))
    else:
        # Only a thin strip to work with: repeating it would show stripes, so stretch it
        # smoothly instead (flipped, so the row touching the photo matches the photo's top row).
        space = ImageOps.flip(band).resize((w, extra), Image.BICUBIC)
        space = space.filter(ImageFilter.GaussianBlur(max(6, extra // 40)))
    canvas = Image.new("RGB", (w, out_h))
    canvas.paste(space, (0, 0))
    canvas.paste(photo, (0, extra))
    return canvas


def media_ratio(box_ratio):
    """Banner shape -> window shape, as an integer ratio that every browser accepts."""
    window = box_ratio * (TYPICAL_WINDOW_H - NAVBAR_PX) / TYPICAL_WINDOW_H
    return f"{round(window * 1000)}/1000"


def plan(photo_ratio, subject):
    """Crop extents, and which crop to show for each banner shape."""
    # Each crop takes over a little below its own shape (sides can lose ~4%), so a crop is used
    # up to about the next crop's shape; the last one up to WIDEST_BANNER.
    widest = [CROPS[i + 1][1] * 0.96 for i in range(len(CROPS) - 1)] + [WIDEST_BANNER]
    extents = [crop_extent(photo_ratio, r, subject, w) for (_, r, _), w in zip(CROPS, widest)]
    shapes = [round(0.40 + i * 0.005, 3) for i in range(int((WIDEST_BANNER - 0.40) / 0.005) + 1)]
    best = [min(range(len(CROPS)), key=lambda i: (badness(s, CROPS[i][1], extents[i], subject), i))
            for s in shapes]
    if best != sorted(best):
        raise SystemExit("The best crop doesn't change in order from tall to wide windows for this "
                         "photo; check --subject or adjust CROPS.")
    return extents, shapes, best


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("source", help="full-resolution photo, e.g. originals/22Nov2026Launch.jpeg")
    parser.add_argument("name", help="output name, e.g. 22Nov2026Launch")
    parser.add_argument("--subject", nargs=4, type=float, required=True, metavar=("LEFT", "TOP", "RIGHT", "BOTTOM"))
    parser.add_argument("--out-dir", default="Images")
    args = parser.parse_args()

    subject = tuple(args.subject)
    photo = ImageOps.exif_transpose(Image.open(args.source)).convert("RGB")
    extents, shapes, best = plan(photo.width / photo.height, subject)
    used = sorted(set(best))
    switch_at = {prev: s for s, prev, cur in zip(shapes[1:], best, best[1:]) if cur != prev}

    os.makedirs(args.out_dir, exist_ok=True)
    print(f"{'crop':<10} {'size':>10} {'KB':>5}   used for banner shapes")
    for i in used:
        name, r, out_w = CROPS[i]
        x0, x1, y0, y1 = extents[i]
        out_h = round(out_w / r)
        px0, px1 = round(x0 * photo.width), round(x1 * photo.width)
        if y0 >= 0:
            img = photo.crop((px0, round(y0 * photo.height), px1, round(y1 * photo.height)))
            img = img.resize((out_w, out_h), Image.LANCZOS)
        else:
            part = photo.crop((px0, 0, px1, photo.height))
            scaled = part.resize((out_w, round(part.height * out_w / part.width)), Image.LANCZOS)
            room = subject[1] - 0.025                      # what's above the subject gets mirrored
            if room < 0.08:
                print(f"note: little room above the subject; check {name} looks natural")
            img = add_space_above(scaled, out_h, max(1, round(room * scaled.height)))
        path = os.path.join(args.out_dir, f"{args.name}-{name}.webp")
        img.save(path, "WEBP", quality=QUALITY, method=6)
        mine = [s for s, b in zip(shapes, best) if b == i]
        print(f"{name:<10} {out_w:>4}x{out_h:<5} {os.path.getsize(path) // 1000:>5}   {mine[0]:.2f} - {mine[-1]:.2f}")

    # Markup: ranges in order, crops wider than "wide" as min-aspect-ratio sources, "wide" as the <img>.
    lines = ["<picture>"]
    fallback = next((i for i in used if CROPS[i][0] == "wide"), used[-1])
    for i in used:
        name, r, out_w = CROPS[i]
        if i == fallback:
            continue
        size = f'width="{out_w}" height="{round(out_w / r)}"'
        src = f"Images/{args.name}-{name}.webp"
        if i < fallback:
            lines.append(f'    <source media="(max-aspect-ratio: {media_ratio(switch_at[i])})" srcset="{src}" {size}>')
        else:
            prev = used[used.index(i) - 1]
            lines.append(f'    <source media="(min-aspect-ratio: {media_ratio(switch_at[prev])})" srcset="{src}" {size}>')
    name, r, out_w = CROPS[fallback]
    lines.append(f'    <img class="home-media home-media-photo" alt="DESCRIBE THE PHOTO" '
                 f'src="Images/{args.name}-{name}.webp" width="{out_w}" height="{round(out_w / r)}" fetchpriority="high">')
    lines.append("</picture>")
    print("\n" + "\n".join(lines))


if __name__ == "__main__":
    main()
