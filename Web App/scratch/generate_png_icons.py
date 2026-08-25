import zlib
import struct
import math

def create_png(width, height, draw_func):
    pixels = bytearray()
    for y in range(height):
        pixels.append(0)  # Filter type 0 (None)
        for x in range(width):
            r, g, b, a = draw_func(x, y, width, height)
            pixels.extend([r, g, b, a])
            
    # IHDR
    ihdr_data = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)
    ihdr_crc = zlib.crc32(b"IHDR" + ihdr_data)
    ihdr_chunk = struct.pack(">I", len(ihdr_data)) + b"IHDR" + ihdr_data + struct.pack(">I", ihdr_crc)
    
    # IDAT
    compressed = zlib.compress(pixels, level=9)
    idat_crc = zlib.crc32(b"IDAT" + compressed)
    idat_chunk = struct.pack(">I", len(compressed)) + b"IDAT" + compressed + struct.pack(">I", idat_crc)
    
    # IEND
    iend_crc = zlib.crc32(b"IEND")
    iend_chunk = struct.pack(">I", 0) + b"IEND" + struct.pack(">I", iend_crc)
    
    return b"\x89PNG\r\n\x1a\n" + ihdr_chunk + idat_chunk + iend_chunk

def render_logo_pixel(x, y, w, h):
    # Normalized coordinates (-1 to 1)
    nx = (x / (w - 1)) * 2 - 1
    ny = (y / (h - 1)) * 2 - 1
    
    # Rounded container background radius
    dist_corner = 0
    abs_x, abs_y = abs(nx), abs(ny)
    r_corner = 0.35
    if abs_x > (1 - r_corner) and abs_y > (1 - r_corner):
        cx = abs_x - (1 - r_corner)
        cy = abs_y - (1 - r_corner)
        dist_corner = math.sqrt(cx*cx + cy*cy)
        
    if dist_corner > r_corner:
        return (0, 0, 0, 0)  # Transparent outside rounded rect

    # Background gradient: Dark Red/Black (#1a0506 to #0d0d0e)
    bg_factor = (ny + 1) / 2
    r_bg = int(26 * (1 - bg_factor) + 13 * bg_factor)
    g_bg = int(5 * (1 - bg_factor) + 13 * bg_factor)
    b_bg = int(6 * (1 - bg_factor) + 14 * bg_factor)
    r, g, b, a = r_bg, g_bg, b_bg, 255

    # 1. Play Button Shield Triangle
    # Vertices approximately at: V1(-0.35, -0.5), V2(0.5, 0.0), V3(-0.35, 0.5)
    # Barycentric coordinates for triangle
    x1, y1 = -0.35, -0.52
    x2, y2 = 0.50, 0.0
    x3, y3 = -0.35, 0.52
    
    denom = (y2 - y3)*(x1 - x3) + (x3 - x2)*(y1 - y3)
    w1 = ((y2 - y3)*(nx - x3) + (x3 - x2)*(ny - y3)) / denom
    w2 = ((y3 - y1)*(nx - x3) + (x1 - x3)*(ny - y3)) / denom
    w3 = 1 - w1 - w2
    
    in_triangle = (w1 >= 0) and (w2 >= 0) and (w3 >= 0)
    
    if in_triangle:
        # Red gradient (#FF1E27 to #B20710)
        tf = (ny + 0.5) / 1.04
        tf = max(0.0, min(1.0, tf))
        r = int(255 * (1 - tf) + 178 * tf)
        g = int(30 * (1 - tf) + 7 * tf)
        b = int(39 * (1 - tf) + 16 * tf)

    # 2. White 'P' Inner Loop stroke
    # P arc center at (-0.1, -0.1), radius 0.22, stroke 0.07
    dx_p = nx - (-0.1)
    dy_p = ny - (-0.1)
    dist_p_center = math.sqrt(dx_p*dx_p + dy_p*dy_p)
    
    # Arc of P (upper loop)
    if 0.13 <= dist_p_center <= 0.26 and nx >= -0.2:
        r, g, b = 255, 255, 255
    # P vertical stem at x = -0.2, from y = -0.32 to y = 0.32
    if -0.26 <= nx <= -0.14 and -0.32 <= ny <= 0.32:
        r, g, b = 255, 255, 255
    # P middle horizontal bar at y = 0.12, from x = -0.2 to x = -0.05
    if -0.2 <= nx <= -0.05 and 0.05 <= ny <= 0.16:
        r, g, b = 255, 255, 255

    # 3. Gold Accent Dot at center of P
    dx_gold = nx - (-0.1)
    dy_gold = ny - (-0.1)
    if math.sqrt(dx_gold*dx_gold + dy_gold*dy_gold) <= 0.07:
        r, g, b = 245, 158, 11  # Gold #F59E0B

    # 4. Green Live Indicator Dot at top right (0.65, -0.65)
    dx_live = nx - 0.62
    dy_live = ny - (-0.62)
    dist_live = math.sqrt(dx_live*dx_live + dy_live*dy_live)
    if dist_live <= 0.08:
        r, g, b = 16, 185, 129  # Emerald green #10B981
    elif 0.08 < dist_live <= 0.12:
        # Glow ring
        glow_alpha = (0.12 - dist_live) / 0.04
        r = int(16 * glow_alpha + r * (1 - glow_alpha))
        g = int(185 * glow_alpha + g * (1 - glow_alpha))
        b = int(129 * glow_alpha + b * (1 - glow_alpha))

    return (r, g, b, a)

# Generate 192x192
png_192 = create_png(192, 192, render_logo_pixel)
with open('/Users/pansilu/Dev/Pansilu Stream/public/logo-192.png', 'wb') as f:
    f.write(png_192)

# Generate 512x512
png_512 = create_png(512, 512, render_logo_pixel)
with open('/Users/pansilu/Dev/Pansilu Stream/public/logo-512.png', 'wb') as f:
    f.write(png_512)

print("Generated logo-192.png and logo-512.png successfully!")
