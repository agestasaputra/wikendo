"""Generate supabase/seed.sql dari data/tenants-seed.csv (200 rows, 5 mall x 40).

APA: baca CSV → tulis file seed.sql berisi INSERT malls + INSERT tenants siap paste di Supabase SQL Editor.
KENAPA jadi script (bukan SQL tulis tangan): CSV punya jebakan — quote di nama (McDonald's, D'Crepes,
Roti'O), mission pipe-separated (makan_cepat|keluarga → TEXT[]), bool text → TRUE/FALSE. 1 lolos = seed gagal.
Script + unit test (tests/test_generate_seed.py) yang jagain.

Cara pakai:
  cd supabase && python3 generate_seed.py   → nulis seed.sql
  python3 -m pytest tests/ -q               → verifikasi konversi

Idempotent: malls pakai ON CONFLICT(slug) DO UPDATE; tenants DELETE per-mall dulu baru INSERT
(tenants belum punya unique constraint, jadi rerun tanpa DELETE = duplikat).
"""

import csv
import os
from urllib.parse import quote_plus

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, "..", "data", "tenants-seed.csv")
OUT_PATH = os.path.join(BASE_DIR, "seed.sql")

# Meta mall yang TIDAK ada di CSV (city/area). Urutan = urutan INSERT (biar rapi).
# total_tenant diisi otomatis = jumlah row CSV per mall (harus 40, dicek saat generate).
MALL_META = [
    {"slug": "grand-indonesia", "name": "Grand Indonesia", "city": "Jakarta", "area": "Thamrin / Menteng"},
    {"slug": "central-park", "name": "Central Park", "city": "Jakarta", "area": "Tanjung Duren / Grogol"},
    {"slug": "kota-kasablanka", "name": "Kota Kasablanka", "city": "Jakarta", "area": "Tebet"},
    {"slug": "pondok-indah-mall", "name": "Pondok Indah Mall", "city": "Jakarta", "area": "Pondok Indah"},
    {"slug": "aeon-bsd", "name": "Aeon Mall BSD City", "city": "Tangerang Selatan", "area": "BSD City"},
]

VALID_BUDGET = ("hemat", "menengah", "leluasa")


def parse_mission(raw: str) -> list:
    """'makan_cepat|keluarga' → ['makan_cepat', 'keluarga']. Kosong → []."""
    raw = (raw or "").strip()
    if not raw:
        return []
    return [m.strip() for m in raw.split("|") if m.strip()]


def sql_escape(s: str) -> str:
    """Escape quote buat literal SQL: McDonald's → Mc''Donald''s."""
    return (s or "").replace("'", "''")


def to_bool(raw: str) -> bool:
    """'true'/'false' CSV → bool Python (ditulis TRUE/FALSE di SQL)."""
    return (raw or "").strip().lower() == "true"


def to_bool_nullable(raw: str) -> bool | None:
    """Versi NULL-safe: kosong/unknown/-/null → None (= belum riset, bukan FALSE).

    APA: bedakan 'tidak' vs 'belum tahu' buat field halal/kids/hype.
    KENAPA: '' → FALSE itu overclaim bahaya (mis. non-halal padahal belum riset).
    NULL + needs_survey=TRUE = masuk antrian survey manual, di-exclude dari filter halal-only.
    """
    s = (raw or "").strip().lower()
    if s in ("", "unknown", "-", "null", "na", "n/a", "?"):
        return None
    if s == "true":
        return True
    if s == "false":
        return False
    return None


def sql_bool_nullable(v: bool | None) -> str:
    """bool|None Python → literal SQL TRUE/FALSE/NULL."""
    if v is None:
        return "NULL"
    return "TRUE" if v else "FALSE"


def sql_text_nullable(s: str) -> str:
    """Teks kosong → NULL (bukan string kosong), biar konsisten 'belum tahu = NULL'."""
    s = (s or "").strip()
    if not s:
        return "NULL"
    return "'%s'" % sql_escape(s)


def mission_to_sql(raw: str) -> str:
    """Mission CSV → literal TEXT[]: ARRAY['a','b'] atau '{}' kalau kosong."""
    parts = parse_mission(raw)
    if not parts:
        return "'{}'"
    return "ARRAY[" + ",".join("'%s'" % sql_escape(p) for p in parts) + "]"


def tenant_to_sql(row: dict) -> str:
    """1 row CSV → 1 statement INSERT INTO tenants (mall_id via subselect slug).

    Aturan NULL (approved): halal/kids/hype kosong → NULL (bukan FALSE).
    + kolom metadata: data_source ('curated' V1 / 'scrape' / 'deep_research' / 'manual'),
      verified_at (NULL = belum verifikasi lapangan), needs_survey
      (TRUE kalau ada field NULL → masuk antrian survey manual).
    """
    if row["budget_tier"] not in VALID_BUDGET:
        raise ValueError("budget_tier invalid: %r (%s)" % (row["budget_tier"], row["tenant_name"]))
    halal_v = to_bool_nullable(row.get("halal", ""))
    kids_v = to_bool_nullable(row.get("kids_friendly", ""))
    hype_v = to_bool_nullable(row.get("hype_tiktok", ""))
    needs_survey = halal_v is None or kids_v is None or hype_v is None
    data_source = (row.get("data_source") or "curated").strip() or "curated"
    verified_raw = (row.get("verified_at") or "").strip()
    verified_sql = "'%s'" % sql_escape(verified_raw) if verified_raw else "NULL"
    return (
        "INSERT INTO tenants (mall_id, name, category, lantai, halal, budget_tier, "
        "price_range, kids_friendly, mission, hype_tiktok, is_open, maps_url, "
        "data_source, verified_at, needs_survey) VALUES ("
        "(SELECT id FROM malls WHERE slug='{slug}'), "
        "'{name}', '{cat}', '{lantai}', {halal}, '{budget}', {price}, "
        "{kids}, {mission}, {hype}, {open}, NULL, "
        "'{ds}', {verified}, {survey});"
    ).format(
        slug=row["mall_slug"],
        name=sql_escape(row["tenant_name"]),
        cat=sql_escape(row["category"]),
        lantai=sql_escape(row["lantai"]),
        halal=sql_bool_nullable(halal_v),
        budget=row["budget_tier"],
        price=sql_text_nullable(row.get("price_range", "")),
        kids=sql_bool_nullable(kids_v),
        mission=mission_to_sql(row["mission"]),
        hype=sql_bool_nullable(hype_v),
        open="TRUE" if to_bool(row.get("is_open", "true")) else "FALSE",
        ds=sql_escape(data_source),
        verified=verified_sql,
        survey="TRUE" if needs_survey else "FALSE",
    )


def main() -> None:
    with open(CSV_PATH, encoding="utf-8-sig", newline="") as f:
        rows = list(csv.DictReader(f))

    slugs_csv = {r["mall_slug"] for r in rows}
    slugs_meta = {m["slug"] for m in MALL_META}
    assert slugs_csv == slugs_meta, "mall CSV vs MALL_META beda: %s vs %s" % (slugs_csv, slugs_meta)

    per_mall: dict = {}
    for r in rows:
        per_mall.setdefault(r["mall_slug"], []).append(r)
    for slug, items in per_mall.items():
        assert len(items) == 40, "%s cuma %d rows (harus 40)" % (slug, len(items))

    lines = [
        "-- seed.sql — AUTO-GENERATED by generate_seed.py, JANGAN edit manual.",
        "-- Sumber: data/tenants-seed.csv (%d rows). Regenerate: cd supabase && python3 generate_seed.py" % len(rows),
        "-- Cara pakai: paste SELURUH file ini di Supabase Dashboard → SQL Editor → Run.",
        "-- Idempotent: aman di-run ulang (malls upsert, tenants delete+insert per mall).",
        "",
        "-- 1. Malls (5 rows)",
    ]
    for m in MALL_META:
        maps = "https://www.google.com/maps/search/?api=1&query=" + quote_plus(m["name"] + " " + m["city"])
        lines.append(
            "INSERT INTO malls (slug, name, city, area, maps_url, total_tenant) VALUES ("
            "'{slug}', '{name}', '{city}', '{area}', '{maps}', {total}) "
            "ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name, city=EXCLUDED.city, "
            "area=EXCLUDED.area, maps_url=EXCLUDED.maps_url, total_tenant=EXCLUDED.total_tenant;".format(
                slug=m["slug"],
                name=sql_escape(m["name"]),
                city=sql_escape(m["city"]),
                area=sql_escape(m["area"]),
                maps=maps,
                total=len(per_mall[m["slug"]]),
            )
        )

    lines += [
        "",
        "-- 2. Tenants (200 rows): hapus dulu biar rerun tidak duplikat, baru insert fresh.",
        "DELETE FROM tenants WHERE mall_id IN (SELECT id FROM malls WHERE slug IN "
        "('grand-indonesia','central-park','kota-kasablanka','pondok-indah-mall','aeon-bsd'));",
        "",
    ]
    for m in MALL_META:
        lines.append("-- %s (%d tenants)" % (m["name"], len(per_mall[m["slug"]])))
        for r in per_mall[m["slug"]]:
            lines.append(tenant_to_sql(r))
    lines += [
        "",
        "-- 3. Verifikasi (hasil imbalance = seed gagal, jangan lanjut):",
        "-- SELECT m.slug, m.total_tenant, COUNT(t.id) AS aktual FROM malls m",
        "-- LEFT JOIN tenants t ON t.mall_id = m.id GROUP BY m.slug, m.total_tenant ORDER BY m.slug;",
    ]

    with open(OUT_PATH, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")
    print("OK: %d rows → %s" % (len(rows), OUT_PATH))


if __name__ == "__main__":
    main()
