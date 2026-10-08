# Workflow Revamp Halaman — 🔒 LOCKED 9 Okt 2026

> Anti miskom. Loop feedback jelas. Di luar template = belum lock.

## 5 Langkah (dengan feedback loop)

1. Agesta upload refs → AI analisis preferensi (3 baris) → Agesta OK.
2. AI bikin 20 opsi HTML, tiap opsi ID gede.
3. Agesta jawab (cuma 2 template sah):
   - Tanpa feedback: `Gua suka [ID]` (= lock final)
   - Dengan feedback:
     ```
     Gua suka [ID], tapi ada beberapa feedback:
     - feedback 1
     - feedback 2
     ```
4. AI update desain sesuai feedback + kirim file HTML lagi (ID yang sama, versi revisi — ID jangan diganti).
5. Loop hingga final:
   - Agesta bilang `iya` (tanpa feedback) → AI eksekusi langsung sampe deploy (TDD passed, repo 0 error, sesuaikan fitur, cek prod sama dengan [ID] final).
   - Agesta bilang `iya` + feedback baru → balik ke langkah 4, iterasi lagi hingga `iya` bersih.

## Aturan Kunci

- Tanpa ID = belum eksekusi. AI wajib minta ID dulu sebelum coding.
- Revisi HTML tidak ganti ID — revisi menempel di ID yang sama biar tidak miskom.
- Board HTML bukan spec coding. Slicing tetap 1:1 ikut SOP §8.
- Sumber: skill `agesta-app-workflow` §9 (sumber tunggal SOP).
