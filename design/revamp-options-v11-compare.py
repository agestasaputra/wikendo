"""Render PNG perbandingan 20 opsi auth-state-home (AFTER login) untuk review Telegram.

Grid 4 kolom x 5 baris. Tiap panel = header + greeting + hero + dropdown TERBUKA.
BEFORE (anon) identik semua = live sekarang, dijelaskan di judul, tidak digambar 20x.

CATATAN FONT: PIL load_default hanya aman untuk ASCII — semua label ASCII-only
(tanpa emoji, tanpa bullet, tanpa panah unicode, "/" ganti "•", "->" ganti panah).
"""
from PIL import Image, ImageDraw, ImageFont

INK = (12, 10, 9)
PAGE = (245, 245, 244)
WHITE = (255, 255, 255)
GRAY = (120, 113, 108)
GRAY2 = (214, 211, 209)
GRAY3 = (231, 229, 228)
LIME = (163, 230, 53)
LIMELIGHT = (217, 249, 157)
EMBER = (234, 88, 12)
GREEN = (22, 163, 74)
RED = (220, 38, 38)
BLUE = (37, 99, 235)
BG = (250, 250, 249)

AV = {
    'ink': (INK, WHITE),
    'lime': (LIME, INK),
    'white': (WHITE, INK),
    'ember': (EMBER, WHITE),
}

f_title = ImageFont.load_default(size=28)
f_sub = ImageFont.load_default(size=20)
f_med = ImageFont.load_default(size=21)
f_sml = ImageFont.load_default(size=18)
f_tny = ImageFont.load_default(size=16)

# id, name, avatar, cluster, greet, gsub, chip, hero_big, dropdown rows [(text, color)], effort, fam
OPTS = [
 ('AS1', 'Minimal ink', 'ink', 'ava-bell', 'Halo, Siska', 'siskadptr@gmail.com', '', False,
  [('siskadptr@gmail.com', GRAY), ('Keluar', RED)], 'S 1h', 'minimal'),
 ('AS2', 'Minimal lime', 'lime', 'ava-bell', 'Halo, Siska', '', '', False,
  [('siskadptr@gmail.com', GRAY), ('Riwayat', INK), ('Keluar', RED)], 'S 1h', 'minimal'),
 ('AS3', 'Outline kalem', 'white', 'ava-bell', 'Halo, Siska', 'siskadptr@gmail.com', '', False,
  [('siskadptr@gmail.com', GRAY), ('Keluar', RED)], 'S 1h', 'minimal'),
 ('AS4', 'Bell dulu', 'ink', 'bell-ava', 'Halo, Siska', '', '', False,
  [('siskadptr@gmail.com', GRAY), ('Keluar', RED)], 'S 1h', 'minimal'),
 ('AS5', 'Chip sisa', 'ink', 'ava-bell', 'Halo, Siska', '', 'Sisa 2 tempat / 5 makan', False,
  [('siskadptr@gmail.com', GRAY), ('Sisa 2 / 5 quota', GREEN), ('Riwayat', INK), ('Keluar', RED)], 'S 1-2h', 'wallet'),
 ('AS6', 'Wallet-card REC', 'ink', 'ava-bell', 'Halo, Siska', 'Sisa kamu: 2 tempat / 5 makan', '', False,
  [('siskadptr@gmail.com', GRAY), ('Riwayat', INK), ('Wishlist (Segera)', GRAY), ('Keluar', RED)], 'S 1-2h', 'wallet'),
 ('AS7', 'Quota-bar', 'ink', 'ava-bell-dot', 'Halo, Siska', '2 tempat / 5 makan tersisa', '', False,
  [('siskadptr@gmail.com', GRAY), ('Tempat tersisa 2', INK), ('Makan tersisa 5', INK), ('Keluar', RED)], 'S 2h', 'wallet'),
 ('AS8', 'Hero-first', 'ink', 'ava-bell', 'Halo, Siska', '', '', True,
  [('siskadptr@gmail.com', GRAY), ('Riwayat', INK), ('Wishlist (Segera)', GRAY), ('Keluar', RED)], 'S 1-2h', 'wallet'),
 ('AS9', 'Ember hangat', 'ember', 'ava-bell', 'Halo, Siska!', 'Weekend ini mau ke mana?', '', False,
  [('siskadptr@gmail.com', GRAY), ('Riwayat', INK), ('Wishlist (Segera)', GRAY), ('Keluar', RED)], 'S 1h', 'warm'),
 ('AS10', 'Nama di header', 'ink', 'ava-name-bell', 'Halo, Siska', 'Senang kamu kembali', '', False,
  [('siskadptr@gmail.com', GRAY), ('Riwayat', INK), ('Wishlist (Segera)', GRAY), ('Keluar', RED)], 'S 1h', 'warm'),
 ('AS11', 'Salam waktu', 'ink', 'ava-bell', 'Pagi, Siska', 'Curi start sebelum jam 10', '', False,
  [('siskadptr@gmail.com', GRAY), ('Riwayat', INK), ('Wishlist (Segera)', GRAY), ('Keluar', RED)], 'S 1-2h', 'warm'),
 ('AS12', 'Streak', 'lime', 'ava-bell', 'Halo, Siska', '', '3 weekend aktif', False,
  [('siskadptr@gmail.com', GRAY), ('Riwayat / 3 weekend', INK), ('Wishlist (Segera)', GRAY), ('Keluar', RED)], 'S 2h', 'warm'),
 ('AS13', 'Cluster penuh', 'ink', 'ava-name-bell', 'Halo, Siska', 'Sisa kamu: 2 tempat / 5 makan', '', False,
  [('siskadptr@gmail.com', GRAY), ('o Riwayat', INK), ('o Wishlist', GRAY), ('x Keluar', RED)], 'S 2h', 'power'),
 ('AS14', 'Grouped chevron', 'ink', 'ava-chev-bell', 'Halo, Siska', 'Sisa kamu: 2 tempat / 5 makan', '', False,
  [('siskadptr@gmail.com', GRAY), ('Riwayat', INK), ('Wishlist (Segera)', GRAY), ('Keluar', RED)], 'S 2h', 'power'),
 ('AS15', 'Bottom-sheet', 'ink', 'ava-bell', 'Halo, Siska', 'Sisa kamu: 2 tempat / 5 makan', '', False,
  [('siskadptr@gmail.com', GRAY), ('Riwayat', INK), ('Wishlist (Segera)', GRAY), ('Keluar', RED)], 'M 3h', 'power'),
 ('AS16', 'Badge notif', 'ink', 'ava-dot-bell3', 'Halo, Siska', 'Sisa kamu: 2 tempat / 5 makan', '', False,
  [('siskadptr@gmail.com', GRAY), ('Notifikasi (3)', INK), ('Riwayat', INK), ('Keluar', RED)], 'S 2h', 'power'),
 ('AS17', 'Voucher nudge', 'ink', 'ava-bell', 'Halo, Siska', 'Ada voucher menunggumu', '', False,
  [('siskadptr@gmail.com', GRAY), ('Riwayat', INK), ('Wishlist (Segera)', GRAY), ('Keluar', RED)], 'S 1-2h', 'convert'),
 ('AS18', 'Keluar kalem', 'ink', 'ava-bell', 'Halo, Siska', 'Sisa kamu: 2 tempat / 5 makan', '', False,
  [('siskadptr@gmail.com', GRAY), ('Riwayat', INK), ('Wishlist (Segera)', GRAY), ('Keluar', GRAY)], 'S 1h', 'convert'),
 ('AS19', 'Confirm-inline', 'ink', 'ava-bell', 'Halo, Siska', 'Sisa kamu: 2 tempat / 5 makan', '', False,
  [('siskadptr@gmail.com', GRAY), ('Riwayat', INK), ('Yakin keluar? Ya / Batal', RED)], 'M 2-3h', 'convert'),
 ('AS20', 'Avatar-only', 'ink', 'ava-only', 'Halo, Siska', 'Sisa kamu: 2 tempat / 5 makan', '', False,
  [('siskadptr@gmail.com', GRAY), ('Notifikasi', INK), ('Riwayat', INK), ('Keluar', RED)], 'S 1-2h', 'convert'),
]

FAM_COLOR = {'minimal': GRAY, 'wallet': GREEN, 'warm': EMBER, 'power': BLUE, 'convert': (147, 51, 234)}

PW, PH = 320, 640
GX, GY0, GAP = 30, 150, 20
COLS = 4

W = GX * 2 + COLS * PW + (COLS - 1) * GAP
ROWS = 5
H = GY0 + ROWS * PH + ROWS * GAP + 30

img = Image.new('RGB', (W, H), BG)
d = ImageDraw.Draw(img)

d.text((GX, 20), 'Auth-state-home: 20 opsi AFTER login (P0 BEFORE = live kini, sama semua)', font=f_title, fill=INK)
d.text((GX, 56), 'BEFORE: header Login/Register + Halo, teman Wikendo + hero 1/2. AFTER: avatar + Halo, Siska + hero 2/5 + dropdown.', font=f_sub, fill=GRAY)
d.text((GX, 84), 'Rekomendasi: AS6 wallet-card. Balas: Gua suka [ID]. Anon 1:1, max-w-md, $0.', font=f_sub, fill=GREEN)
d.text((GX, 112), 'Minimal AS1-4 | Wallet AS5-8 | Warm AS9-12 | Power AS13-16 | Convert AS17-20', font=f_tny, fill=GRAY)


def draw_avatar(cx, cy, r, kind):
    bg, fg = AV[kind]
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=bg, outline=INK if kind == 'white' else None, width=2)
    t = 'S'
    tw = d.textlength(t, font=f_sml)
    d.text((cx - tw / 2, cy - 10), t, font=f_sml, fill=fg)


def draw_bell(cx, cy, dot=False, badge=0):
    # dome + skirt + clapper, ASCII-safe shapes
    d.pieslice([cx - 8, cy - 10, cx + 8, cy + 6], 180, 360, fill=INK)
    d.polygon([(cx - 9, cy - 1), (cx + 9, cy - 1), (cx + 6, cy + 8), (cx - 6, cy + 8)], fill=INK)
    d.ellipse([cx - 2, cy + 8, cx + 2, cy + 12], fill=INK)
    if dot:
        d.ellipse([cx + 5, cy - 12, cx + 11, cy - 6], fill=EMBER)
    if badge:
        d.ellipse([cx + 3, cy - 14, cx + 15, cy - 2], fill=RED)
        b = str(badge)
        d.text((cx + 6, cy - 14), b, font=f_tny, fill=WHITE)


def draw_cluster(x, yc, w, kind):
    """Right cluster in header, right-aligned ending at x+w."""
    if kind == 'ava-bell':
        draw_bell(x + w - 12, yc)
        draw_avatar(x + w - 44, yc, 13, cur_av)
    elif kind == 'bell-ava':
        draw_avatar(x + w - 12, yc, 13, cur_av)
        draw_bell(x + w - 44, yc)
    elif kind == 'ava-bell-dot':
        draw_bell(x + w - 12, yc, dot=True)
        draw_avatar(x + w - 44, yc, 13, cur_av)
    elif kind == 'ava-name-bell':
        draw_bell(x + w - 12, yc)
        d.text((x + w - 78, yc - 10), 'Siska', font=f_tny, fill=INK)
        draw_avatar(x + w - 96, yc, 13, cur_av)
    elif kind == 'ava-chev-bell':
        draw_bell(x + w - 12, yc)
        d.text((x + w - 40, yc - 10), 'v', font=f_sml, fill=GRAY)
        draw_avatar(x + w - 62, yc, 13, cur_av)
    elif kind == 'ava-dot-bell3':
        draw_bell(x + w - 12, yc, badge=3)
        draw_avatar(x + w - 48, yc, 13, cur_av)
        d.ellipse([x + w - 38, yc + 6, x + w - 32, yc + 12], fill=GREEN)
    elif kind == 'ava-only':
        draw_avatar(x + w - 14, yc, 13, cur_av)


def panel(col, row, opt):
    global cur_av
    oid, name, av, cluster, greet, gsub, chip, hero_big, rows, effort, fam = opt
    cur_av = av
    x = GX + col * (PW + GAP)
    y = GY0 + row * (PH + GAP)
    rec = (oid == 'AS6')
    d.rounded_rectangle([x, y, x + PW, y + PH], radius=24, fill=PAGE,
                        outline=GREEN if rec else GRAY3, width=3 if rec else 2)
    d.text((x + 12, y + 8), oid + ' - ' + name, font=f_med, fill=GREEN if rec else INK)
    d.text((x + 12, y + 32), fam + ' / ' + effort, font=f_tny, fill=FAM_COLOR[fam])
    top = y + 54

    # header
    d.rounded_rectangle([x + 10, top, x + PW - 10, top + 40], radius=10, fill=WHITE)
    d.rounded_rectangle([x + 18, top + 9, x + 42, top + 31], radius=6, fill=INK)
    d.text((x + 24, top + 10), 'W', font=f_tny, fill=WHITE)
    draw_cluster(x + 10, top + 20, PW - 20, cluster)
    top += 48

    # greeting
    draw_avatar(x + 24, top + 12, 12, av)
    d.text((x + 42, top + 2), greet, font=f_sml, fill=INK)
    top += 26
    if gsub:
        d.text((x + 42, top), gsub[:34], font=f_tny, fill=GRAY)
        top += 20
    if chip:
        cw = d.textlength(chip, font=f_tny) + 16
        d.rounded_rectangle([x + 42, top, x + 42 + cw, top + 22], radius=11, fill=(236, 253, 245))
        d.text((x + 50, top + 3), chip, font=f_tny, fill=(4, 120, 87))
        top += 28

    # hero
    hh = 150 if hero_big else 118
    d.rounded_rectangle([x + 10, top, x + PW - 10, top + hh], radius=12, fill=INK)
    d.rectangle([x + 10, top, x + 15, top + hh], fill=EMBER)
    d.text((x + 22, top + 6), 'QUOTA HARI INI / reset 00.00', font=f_tny, fill=WHITE)
    if hero_big:
        f_num = ImageFont.load_default(size=34)
        d.text((x + 22, top + 24), '2 / 5', font=f_num, fill=LIMELIGHT)
        d.text((x + 22, top + 64), 'Sisa kamu: 2 tempat / 5 makan', font=f_sml, fill=WHITE)
    else:
        f_num = ImageFont.load_default(size=26)
        d.text((x + 22, top + 24), '2 / 5', font=f_num, fill=LIMELIGHT)
        d.text((x + 22, top + 54), 'Sisa kamu: 2 tempat / 5 makan', font=f_tny, fill=WHITE)
    d.rounded_rectangle([x + 22, top + hh - 34, x + 150, top + hh - 8], radius=13, fill=LIME)
    d.text((x + 32, top + hh - 30), 'Mulai Quiz ->', font=f_tny, fill=INK)
    top += hh + 8

    # CTA pair
    d.rounded_rectangle([x + 10, top, x + PW // 2 - 2, top + 40], radius=10, fill=INK)
    d.rounded_rectangle([x + PW // 2 + 2, top, x + PW - 10, top + 40], radius=10, fill=INK)
    d.text((x + 22, top + 6), 'Cari Tempat', font=f_tny, fill=WHITE)
    d.text((x + 22, top + 22), 'quiz 30 dtk', font=f_tny, fill=GRAY2)
    d.text((x + PW // 2 + 12, top + 6), 'Cari Makan', font=f_tny, fill=WHITE)
    d.text((x + PW // 2 + 12, top + 22), 'quiz 20 dtk', font=f_tny, fill=GRAY2)
    top += 48

    # dropdown (open)
    dh = 10 + len(rows) * 26 + 8
    if oid == 'AS15':
        d.line([x + 60, top - 2, x + PW - 60, top - 2], fill=GRAY, width=3)
    d.rounded_rectangle([x + 10, top, x + PW - 10, top + dh], radius=12, fill=WHITE, outline=GRAY3, width=2)
    ry = top + 8
    for i, (txt, col_) in enumerate(rows):
        if i > 0:
            d.line([x + 20, ry - 3, x + PW - 20, ry - 3], fill=PAGE, width=2)
        if txt == rows[0][0] and '@' in txt:
            d.text((x + 22, ry), txt[:30], font=f_tny, fill=GRAY)
        else:
            d.text((x + 22, ry), txt[:30], font=f_sml if col_ != GRAY else f_tny, fill=col_)
        ry += 26


cur_av = 'ink'
for i, opt in enumerate(OPTS):
    panel(i % COLS, i // COLS, opt)

img.save('/home/ubuntu/wikendo-web-app/design/revamp-options-v11-compare.png')
print('saved design/revamp-options-v11-compare.png', img.size)
