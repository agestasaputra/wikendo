# Workflow Revamp Halaman — 🔒 LOCKED 9 Okt 2026

> Anti miskom. Cuma 5 langkah. Di luar template = belum lock.

## 5 Langkah

1. Agesta upload refs → AI analisis preferensi (3 baris) → Agesta OK.
2. AI bikin 20 opsi HTML, tiap opsi ID gede.
3. Agesta jawab lock, 2 template sah:
   - Tanpa feedback: `Gua suka [ID]`
   - Dengan feedback:
     ```
     Gua suka [ID], tapi ada beberapa feedback:
     - feedback 1
     - feedback 2
     ```
4. AI tanya: mau dieksekusi sampe deploy Vercel?
5. Agesta jawab iya → AI eksekusi sampe deploy (TDD passed, repo 0 error, sesuaikan fitur, cek prod sama dengan [ID]).

## Aturan Kunci

- Tanpa ID = belum eksekusi. AI wajib minta ID dulu sebelum coding.
- Board HTML bukan spec coding. Slicing tetap 1:1 ikut SOP §8.
- Sumber: skill `agesta-app-workflow` §9 (sumber tunggal SOP).
