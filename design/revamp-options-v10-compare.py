"""Render PNG perbandingan P0 vs Opsi A/B/C untuk review Telegram (2x2 grid).

CATATAN FONT: PIL default hanya aman untuk ASCII dasar — semua label di
file ini ASCII-only (tanpa emoji, tanpa bullet, tanpa panah unicode) agar
tidak muncul tofu (kotak-kotak) di hasil render.
"""
from PIL import Image, ImageDraw, ImageFont

W, H = 1400, 1180
BG = (250, 250, 249)
INK = (12, 10, 9)
PAGE = (245, 245, 244)
WHITE = (255, 255, 255)
GRAY = (168, 162, 158)
GRAY2 = (214, 211, 209)
LIME = (217, 249, 157)
EMBER = (234, 88, 12)
GREEN = (22, 163, 74)
RED = (220, 38, 38)
BLUE = (66, 133, 244)
G_OUTLINE = (218, 220, 224)

f_big = ImageFont.load_default(size=30)
f_med = ImageFont.load_default(size=22)
f_sml = ImageFont.load_default(size=19)
f_tny = ImageFont.load_default(size=17)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)
d.text((40, 18), "Tombol Google vs Form - P0 (kini) vs Opsi A / B / C", font=f_big, fill=INK)
d.text((40, 55), "Pilih 1: A (outline + ATAU + G resmi, rekomendasi) - B (grouped) - C (email-first, tdk saran)", font=f_med, fill=(87, 83, 80))

PW, PH = 300, 880
GX, GY, GAP = 40, 110, 26

G_COLORS = [(234, 67, 53), (66, 133, 244), (251, 188, 5), (52, 168, 83)]


def draw_g(cx, cy, r=11):
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=WHITE, outline=GRAY2)
    d.text((cx - 7, cy - 10), "G", font=f_med, fill=BLUE)


def draw_g_official(cx, cy, r=11):
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=WHITE, outline=GRAY2)
    d.arc([cx - r, cy - r, cx + r, cy + r], 300, 60, fill=G_COLORS[0], width=3)
    d.arc([cx - r, cy - r, cx + r, cy + r], 60, 180, fill=G_COLORS[1], width=3)
    d.arc([cx - r, cy - r, cx + r, cy + r], 180, 240, fill=G_COLORS[2], width=3)
    d.arc([cx - r, cy - r, cx + r, cy + r], 240, 300, fill=G_COLORS[3], width=3)


def panel(x, title, tag, tag_color, draw_body):
    d.rounded_rectangle([x, GY, x + PW, GY + PH], radius=26, fill=PAGE, outline=(231, 229, 228), width=2)
    d.text((x + 14, GY + 10), title, font=f_med, fill=INK)
    d.text((x + 14, GY + 36), tag, font=f_tny, fill=tag_color)
    top = GY + 62
    draw_body(x + 14, top, PW - 28)
    return top


def banner(x, y, w):
    d.rounded_rectangle([x, y, x + w, y + 64], radius=10, fill=INK)
    d.rectangle([x, y, x + 5, y + 64], fill=EMBER)
    d.text((x + 12, y + 6), "DAFTAR GRATIS", font=f_tny, fill=WHITE)
    d.text((x + 12, y + 24), "2 / 5", font=f_med, fill=LIME)
    d.text((x + 12, y + 46), "quota full + voucher", font=f_tny, fill=WHITE)
    return y + 76


def google_btn(x, y, w, outline=False, official=False, small=False, micro=None):
    h = 44 if small else 52
    d.rounded_rectangle([x, y, x + w, y + h], radius=h // 2, fill=WHITE,
                        outline=G_OUTLINE if outline else None, width=2 if outline else 1)
    cy = y + h // 2
    (draw_g_official if official else draw_g)(x + 78, cy)
    d.text((x + 100, cy - 11), "Daftar via Google", font=f_sml if not small else f_tny, fill=INK)
    if micro:
        d.text((x + 60, y + h + 2), micro, font=f_tny, fill=(120, 113, 108))
        return y + h + 22
    return y + h + 12


def divider(x, y, w, label="ATAU"):
    cy = y + 8
    d.line([x + 4, cy, x + w // 2 - 34, cy], fill=GRAY2, width=2)
    d.line([x + w // 2 + 34, cy, x + w - 4, cy], fill=GRAY2, width=2)
    d.text((x + w // 2 - 26, y), label, font=f_tny, fill=GRAY)
    return y + 28


def pill(x, y, w, icon, text, muted=True):
    d.rounded_rectangle([x, y, x + w, y + 48], radius=24, fill=WHITE)
    d.text((x + 14, y + 14), icon, font=f_sml, fill=GRAY)
    d.text((x + 40, y + 14), text, font=f_sml, fill=GRAY if muted else INK)
    return y + 60


def cta(x, y, w):
    d.rounded_rectangle([x, y, x + w, y + 48], radius=24, fill=INK)
    tw = d.textlength("Daftar >", font=f_sml)
    d.text((x + (w - tw) / 2, y + 14), "Daftar >", font=f_sml, fill=WHITE)
    return y + 60


def verdict(x, y, w, text, color):
    d.text((x + 4, y + 6), text, font=f_tny, fill=color)


def body_p0(x, y, w):
    y = banner(x, y, w)
    y = google_btn(x, y, w)
    y = pill(x, y, w, "@", "Email")
    y = pill(x, y, w, "*", "Password")
    y = cta(x, y, w)
    verdict(x, y, w, "X kembar: putih+bulat+shadow", RED)


def body_a(x, y, w):
    y = banner(x, y, w)
    y = google_btn(x, y, w, outline=True, official=True)
    y = divider(x, y, w)
    y = pill(x, y, w, "@", "Email")
    y = pill(x, y, w, "*", "Password")
    y = cta(x, y, w)
    verdict(x, y, w, "OK border+ATAU+G resmi", GREEN)


def body_b(x, y, w):
    y = banner(x, y, w)
    y = google_btn(x, y, w, outline=True, official=True, micro="1-klik - tanpa password baru")
    d.text((x + 4, y + 2), "ATAU DAFTAR PAKAI EMAIL", font=f_tny, fill=(120, 113, 108))
    y += 24
    d.rounded_rectangle([x, y, x + w, y + 250], radius=14, fill=WHITE, outline=(231, 229, 228), width=2)
    iy = y + 10
    iy = pill(x + 8, iy, w - 16, "@", "Email")
    iy = pill(x + 8, iy, w - 16, "*", "Password")
    iy = cta(x + 8, iy, w - 16)
    y += 262
    verdict(x, y, w, "OK dua kawasan tegas", GREEN)


def body_c(x, y, w):
    y = banner(x, y, w)
    y = pill(x, y, w, "@", "Email")
    y = pill(x, y, w, "*", "Password")
    y = cta(x, y, w)
    y = divider(x, y, w, label="atau 1-klik")
    y = google_btn(x, y, w, outline=True, official=True, small=True)
    verdict(x, y, w, "! Google tenggelam", RED)


panel(GX, "P0 - kini", "baseline - bukan pilihan", GRAY, body_p0)
panel(GX + (PW + GAP), "A - outline+ATAU", "rekomendasi - effort S", GREEN, body_a)
panel(GX + 2 * (PW + GAP), "B - grouped card", "effort M - pemisah tertegas", BLUE, body_b)
panel(GX + 3 * (PW + GAP), "C - email-first", "kontrarian - tdk saran", RED, body_c)

img.save("/home/ubuntu/wikendo-web-app/design/revamp-options-v10-compare.png")
print("saved design/revamp-options-v10-compare.png", img.size)
