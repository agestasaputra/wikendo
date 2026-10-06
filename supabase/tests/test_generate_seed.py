"""Unit test buat supabase/generate_seed.py (TDD: RED dulu, GREEN setelah generator jadi).

APA: ngetes fungsi murni konversi CSV → SQL (parse mission, escape quote, bool, meta mall).
KENAPA: 1 quote lolos (McDonald's) = seed gagal total di Supabase. Test ini yang jagain.
Cara jalan: cd supabase && python3 -m pytest tests/ -q  (atau: npm run test:seed dari app/)
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from generate_seed import parse_mission, sql_escape, to_bool, to_bool_nullable, tenant_to_sql, MALL_META


def test_parse_mission_single():
    assert parse_mission("keluarga") == ["keluarga"]


def test_parse_mission_pipe():
    assert parse_mission("makan_cepat|keluarga") == ["makan_cepat", "keluarga"]


def test_parse_mission_empty():
    assert parse_mission("") == []


def test_sql_escape_quote():
    # McDonald's & Roti'O ada di CSV — 1 quote lolos = INSERT fail semua
    # McDonald's cuma punya 1 apostrof → escape jadi McDonald''s (2 quote = 1 literal)
    assert sql_escape("McDonald's") == "McDonald''s"
    assert sql_escape("Roti'O") == "Roti''O"


def test_sql_escape_plain():
    assert sql_escape("HokBen") == "HokBen"


def test_to_bool():
    assert to_bool("true") is True
    assert to_bool("false") is False


def test_to_bool_nullable_empty_is_none():
    # Aturan baru (approved): field belum riset → NULL, bukan FALSE.
    # Kosong/"unknown"/"-" dari scrape|deep-research = belum tau, bukan non-halal.
    assert to_bool_nullable("") is None
    assert to_bool_nullable("unknown") is None
    assert to_bool_nullable("-") is None
    assert to_bool_nullable("true") is True
    assert to_bool_nullable("false") is False


def test_tenant_to_sql_null_halal_sets_needs_survey():
    # Tenant hasil scrape tanpa info halal → halal NULL + needs_survey TRUE,
    # supaya masuk antrian survey manual & di-exclude dari filter halal-only.
    row = {
        "mall_slug": "grand-indonesia",
        "tenant_name": "Tenant Baru X",
        "category": "kopi",
        "lantai": "LG",
        "halal": "",
        "budget_tier": "hemat",
        "price_range": "",
        "kids_friendly": "",
        "mission": "nongkrong_lama",
        "hype_tiktok": "",
        "is_open": "true",
    }
    sql = tenant_to_sql(row)
    assert "NULL" in sql
    assert "'scrape'" in sql or "'curated'" in sql
    assert "needs_survey" in sql.lower() or "TRUE" in sql


def test_mall_meta_5_malls():
    assert len(MALL_META) == 5
    slugs = {m["slug"] for m in MALL_META}
    assert slugs == {
        "grand-indonesia",
        "central-park",
        "kota-kasablanka",
        "pondok-indah-mall",
        "aeon-bsd",
    }


def test_tenant_to_sql_uses_mission_array():
    row = {
        "mall_slug": "grand-indonesia",
        "tenant_name": "McDonald's",
        "category": "fastfood",
        "lantai": "LG",
        "halal": "true",
        "budget_tier": "hemat",
        "price_range": "Rp 30-70rb",
        "kids_friendly": "true",
        "mission": "makan_cepat|keluarga",
        "hype_tiktok": "false",
        "is_open": "true",
    }
    sql = tenant_to_sql(row)
    assert "McDonald''s" in sql
    assert "ARRAY['makan_cepat','keluarga']" in sql
    assert "WHERE slug='grand-indonesia'" in sql
