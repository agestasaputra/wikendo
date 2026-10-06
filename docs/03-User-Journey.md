# User Journey - Weekend Planner MVP

**Version:** 2.0 (Updated for final quota system)  
**Date:** October 5, 2026  
**Status:** Final

---

## Overview

Weekend Planner has 2 main user types with distinct journeys:
1. **Anonymous Users** (first-time visitors, no account)
2. **Registered Users** (logged-in)

**Quota Rules:**
- All users: **2 quota per day** (reset 00:00 WIB)
- Anonymous: Can use **1 quota** (must login for 2nd)
- Each generate: **5 recommendations**
- No free regenerates (each counts)

---

## Journey 1: Anonymous User (First Visit)

### Step 1: Landing Page (`/`)

**Goal:** Convert visitor to quiz starter

**Elements:**
- Hero headline: "Bingung Weekend Ngapain? Kami Bantu Putuskan!"
- Subheadline: "5 pertanyaan singkat → 5 rekomendasi tempat yang pas buatmu"
- Primary CTA: "Mulai Sekarang" (large button)
- Trust signals: "Gratis • 30 detik • Tanpa login dulu"
- Optional: Social proof ("1,247 orang udah dapat rekomendasi minggu ini")

**User Action:**
→ Click "Mulai Sekarang"  
→ Navigate to `/quiz`

**Analytics:**
```javascript
gtag('event', 'landing_cta_clicked')
```

---

### Step 2: Quiz Page (`/quiz`)

**Goal:** Collect enough context for quality recommendations

**UI Structure:**
- Progress indicator (Question 2 of 5)
- One question at a time (mobile-first)
- Large tap targets (radio buttons)
- "Lanjut" button (enabled after selection)

**Questions:**

1. **"Weekend ini lu pengen yang gimana?"**
   - Santai/healing 🧘
   - Aktif/petualangan 🏃
   - Produktif (kerja sambil enjoy) 💼
   - Quality time bareng orang tersayang ❤️
   - Lainnya (text input)

2. **"Sama siapa?"**
   - Sendiri 🚶
   - Pasangan (2 orang) 💑
   - Teman (2-4 orang) 👥
   - Keluarga kecil, dengan anak 👨‍👩‍👧
   - Keluarga besar 👨‍👩‍👧‍👦

3. **"Usia anak?"** (conditional, only if family with kids)
   - Balita (0-5 tahun)
   - SD (6-12 tahun)
   - Remaja (13+ tahun)
   - Tidak ada anak

4. **"Budget per orang?"**
   - Hemat (<100rb) 💵
   - Menengah (100rb-300rb) 💴
   - Leluasa (>300rb) 💰

5. **"Mau kemana?"**
   - Sekitar Jabodetabek 🌆
   - Jauh, mau road trip 🚗
   - Lainnya (text input untuk kota)

6. **"Waktu?"** (optional)
   - Pagi (sebelum 12:00) ☀️
   - Siang/Sore (12:00-18:00) 🌤️
   - Seharian (pagi sampai malam) 🌙

**User Action:**
→ Answer all required questions  
→ Click "Generate Rekomendasi"  
→ Navigate to loading state → `/result`

**Analytics:**
```javascript
gtag('event', 'quiz_started')
// On each answer
gtag('event', 'quiz_question_answered', { question_num: 1 })
// On completion
gtag('event', 'quiz_completed', {
  mood: mood,
  companion: companion,
  budget: budget,
  location: location
})
```

---

### Step 3: Loading State

**Duration:** 2-5 seconds (LLM API call)

**UI:**
- Centered spinner or progress animation
- Text: "Lagi cariin tempat yang cocok buat kamu..."
- Optional: Rotating tips
  - "Pro tip: Cek jam operasional di Google Maps dulu ya"
  - "Jangan lupa booking kalau weekend rame!"
  - "Ajak teman untuk lebih seru 🎉"

**Background Process:**
```
1. Server receives quiz data
2. Check quota (anonymous: max 1)
3. Generate session_id (cookie)
4. Call Hermes-combo API
5. Parse JSON response
6. Save to database
7. Increment quota counter
8. Return 5 recommendations
```

**Error Handling:**
- If API fails → Show error modal, don't count quota
- If timeout (>15s) → Show retry option
- If quota exceeded → Show login prompt

---

### Step 4: Result Page - First Generation (`/result?session=xxx`)

**Header:**
- Title: "Ini Rekomendasi Weekend Buat Kamu!"
- Quota indicator: "🎁 1x gratis sudah dipakai • Login untuk 1x lagi"

**Main Content: 5 Recommendation Cards**

```
┌────────────────────────────────────────┐
│ 🏖️ Pantai Ancol                        │
│ [Badge: Outdoor • Wisata]              │
│                                         │
│ Kenapa Cocok:                          │
│ "Perfect untuk quality time bareng     │
│ pasangan dengan suasana santai. Ada    │
│ area tenang jauh dari keramaian."      │
│                                         │
│ 💰 Budget: Rp 150rb - 250rb/orang      │
│ 📍 Area: Jakarta Utara                 │
│ ⏰ Best time: Sabtu sore (16:00-18:00) │
│                                         │
│ [Button: 📍 Lihat di Maps]             │
│ [Button: 💾 Simpan] (login required)   │
└────────────────────────────────────────┘

[4 more cards...]
```

**Actions Available:**

1. **"Lihat di Maps"** - Opens Google Maps search in new tab
   ```javascript
   window.open(`https://www.google.com/maps/search/${encodeURIComponent(name + ' ' + area)}`)
   gtag('event', 'recommendation_clicked', { index, action: 'maps' })
   ```

2. **"Simpan"** - Shows login modal (feature requires auth)
   ```javascript
   if (!user) {
     showLoginModal()
     gtag('event', 'login_prompted', { reason: 'save_favorite' })
   }
   ```

3. **"Generate Lagi"** (sticky bottom button)
   - For anonymous user → **Show login wall:**
   ```
   ┌────────────────────────────────────────┐
   │  Mau Rekomendasi Lagi?                 │
   │                                         │
   │  Login dulu untuk dapat 1x generate    │
   │  lagi hari ini!                        │
   │                                         │
   │  [Login/Daftar]  [Nanti Aja]          │
   └────────────────────────────────────────┘
   ```

4. **"Ubah Jawaban"** - Back to quiz with pre-filled answers

**User Paths:**

#### Path A: Satisfied, Exits
- User clicks "Lihat di Maps" for 1+ recommendations
- User leaves page
- **Journey ends** ✅ (Success)

#### Path B: Wants More, Prompted to Login
- User clicks "Generate Lagi" or "Simpan"
- See login/register modal
- Decision:
  - Click "Login/Daftar" → Go to Step 5
  - Click "Nanti Aja" → Stay on page, journey ends

#### Path C: Not Satisfied, Changes Quiz
- User clicks "Ubah Jawaban"
- Returns to `/quiz` with pre-filled data
- But: already used 1 quota → Can't generate again without login

---

### Step 5: Auth Flow (Login or Register)

**Option A: Login (`/login`)**

Form:
- Email (validation)
- Password
- "Remember me" checkbox
- "Lupa password?" link

Actions:
- "Login" button → Supabase Auth
- "Login dengan Google" button → OAuth flow

**Option B: Register (`/register`)**

Form:
- Email (validation, check duplicate)
- Phone number (+62 format, validation)
- Password (min 8 chars, strength indicator)
- Confirm password
- Checkbox: "Setuju dengan [Syarat] dan [Privasi]"

Actions:
- "Daftar" button → Supabase signup + create profile
- "Daftar dengan Google" button → OAuth + collect phone

**Google OAuth Flow:**
```
1. Click "Login dengan Google"
2. Redirect to Google consent screen
3. User approves
4. Redirect to /auth/callback
5. If first time:
   → Show modal: "Masukkan nomor HP"
   → Save to user_profiles
6. Initialize quota (2/day)
7. Redirect back to /quiz or previous page
```

**Success:**
- Set session cookie (httpOnly)
- Show toast: "Selamat datang! Kamu punya 1x generate lagi hari ini"
- Redirect to `/quiz` or `/result` (if came from there)

**Analytics:**
```javascript
gtag('event', 'user_registered', { method: 'email' | 'google' })
gtag('event', 'user_logged_in', { method: 'email' | 'google' })
```

---

## Journey 2: Registered User (Logged In)

### Step 6: Returning User - Quiz (`/quiz`)

**Differences from Anonymous:**

**Header:**
- "Hai, Agesta! 👋"
- Quota indicator: "Quota hari ini: 2/2 tersisa ⚡"

**Features:**
- Quiz answers auto-saved (can resume if interrupted)
- Optional: "Pakai quiz terakhir" quick action

**User Action:**
→ Complete quiz  
→ Generate (quota: 1/2 remaining)

---

### Step 7: Registered User Result Page

**Header:**
- "Rekomendasi Weekend Buat Agesta!"
- Quota: "Quota: 1/2 tersisa"

**New Capabilities:**

1. **"Simpan" works** (no login wall)
   - Click "Simpan" → Saved to user_profiles
   - Show toast: "✅ Tersimpan!"
   - Can view in `/favorites`

2. **View History** (nav link)
   - Click "History" in navbar
   - See list of past generations
   - Format:
   ```
   Sabtu, 5 Okt 2026 - 14:30
   "Santai bareng pasangan, budget menengah, Jabodetabek"
   [Lihat Lagi]
   ```

3. **Generate Again**
   - Click "Generate Lagi" → Back to quiz
   - Complete new quiz → Generate (quota: 0/2)
   - After 2nd generate: **Quota exhausted**

---

### Step 8: Quota Exhausted (2/2 Used)

**Modal/Screen:**
```
┌────────────────────────────────────────┐
│  Quota Hari Ini Habis! 😊             │
│                                         │
│  Reset besok jam 00:00 WIB             │
│  ⏰ 8 jam 23 menit lagi                │
│                                         │
│  Sambil nunggu, kamu bisa:             │
│  • Lihat history rekomendasi           │
│  • Share hasil ke teman                │
│  • Cek tempat yang udah kamu save      │
│                                         │
│  [Lihat History]  [Share]              │
└────────────────────────────────────────┘
```

**Available Actions:**
1. **"Lihat History"** → `/history`
2. **"Share"** → Copy link or share to WhatsApp/Instagram
3. **Wait for reset** → Come back tomorrow

**Analytics:**
```javascript
gtag('event', 'quota_exhausted', {
  user_type: 'registered',
  total_generations_today: 2
})
```

---

### Step 9: Next Day (Quota Reset)

**Trigger:** Automated at 00:00 WIB (database cron job)

**Database Update:**
```sql
UPDATE user_quota
SET quota_used = 0, last_reset_at = NOW()
WHERE last_reset_at < NOW() - INTERVAL '1 day';
```

**User Returns:**
- Sees updated quota: "Quota: 2/2 tersisa ✨"
- Can generate 2 more times
- **Cycle repeats**

---

## Navigation Structure

### Anonymous User Nav
```
┌────────────────────────────────────────┐
│ [Logo] Weekend Planner                 │
│                    [Login] [Mulai]     │
└────────────────────────────────────────┘
```

### Logged-In User Nav
```
┌────────────────────────────────────────┐
│ [Logo] Weekend Planner                 │
│  [History] [Favorites] [👤 Agesta ▼]  │
│                        ├─ Profile      │
│                        ├─ Settings     │
│                        └─ Logout       │
└────────────────────────────────────────┘
```

---

## Edge Cases & Error Handling

### Case 1: LLM Generation Failed

**Error Screen:**
```
┌────────────────────────────────────────┐
│  Oops! Ada Masalah Teknis...           │
│                                         │
│  Sistem lagi sibuk nih. Tenang, quota  │
│  kamu nggak kepotong kok!              │
│                                         │
│  [Coba Lagi]  [Ubah Jawaban]          │
└────────────────────────────────────────┘
```

**Behavior:**
- Don't count as quota used
- Allow immediate retry
- Log error to analytics

---

### Case 2: Network Timeout (>15s)

**Loading State Message:**
```
Permintaan taking longer than expected...
[Cancel]  [Keep Waiting]
```

**After Cancel:**
- Return to quiz
- Don't count quota
- Option to retry

---

### Case 3: User Clears Browser Data

**Anonymous:**
- Lose session_id
- Can generate again (new anonymous session)
- Effectively "reset" quota (minor abuse vector, acceptable)

**Registered:**
- Session cleared → Must login again
- Quota preserved in database

---

### Case 4: Shared Result Link

**Scenario:** User copies `/result?session=xxx` and sends to friend

**Behavior:**
- Friend opens link → Can view results (read-only)
- No "Simpan" or "Generate Lagi" buttons
- CTA: "Buat rekomendasi sendiri" → Landing page

---

### Case 5: Multiple Tabs/Devices

**Scenario:** User opens app in 2 tabs, generates in both

**Behavior:**
- Quota is server-side (database)
- First tab generates → quota: 1/2
- Second tab generates → quota: 0/2
- Third attempt (either tab) → Quota exhausted

---

## Mobile-Specific Considerations

### Quiz Flow
- **One question per screen** (no scroll between questions)
- Large tap targets (min 44×44px)
- Swipe to next question (optional)

### Result Cards
- **Stack vertically** (one card = full viewport width)
- Swipeable carousel (alternative layout)
- Sticky CTA at bottom ("Generate Lagi")

### Modals
- Use **bottom sheet** instead of center modal
- Easier thumb reach on tall screens

### Performance
- Lazy load images (if added later)
- Preload next question in quiz
- Optimistic UI (show loading immediately)

---

## Analytics Events Summary

### Page Views (Automatic)
```javascript
pageview('/') // Landing
pageview('/quiz') // Quiz started
pageview('/result') // Result viewed
pageview('/login') // Auth page
pageview('/register')
pageview('/history')
pageview('/favorites')
```

### Custom Events
```javascript
// Acquisition
gtag('event', 'landing_cta_clicked')
gtag('event', 'quiz_started')

// Engagement
gtag('event', 'quiz_question_answered', { question_num })
gtag('event', 'quiz_completed', { mood, budget, location, companion })
gtag('event', 'recommendation_generated', { 
  is_logged_in, 
  quota_remaining, 
  response_time_ms 
})
gtag('event', 'recommendation_clicked', { 
  index, 
  action: 'maps' | 'save',
  category 
})

// Auth
gtag('event', 'login_prompted', { reason })
gtag('event', 'user_registered', { method })
gtag('event', 'user_logged_in', { method })

// Retention
gtag('event', 'quota_exhausted', { user_type })
gtag('event', 'history_viewed')
gtag('event', 'favorite_saved')
gtag('event', 'result_shared', { method })

// Errors
gtag('event', 'generation_failed', { error_type })
gtag('event', 'timeout_occurred')
```

---

## Success Metrics by Journey Stage

### Landing Page
- **CTA Click Rate:** >40%
- **Bounce Rate:** <50%
- **Avg Time on Page:** >15 seconds

### Quiz
- **Start → Complete Rate:** >70%
- **Avg Completion Time:** 30-60 seconds
- **Drop-off:** <20% per question

### Result Page
- **Recommendation Click Rate:** >50% (at least 1 clicked)
- **Avg Time on Page:** >60 seconds
- **Save/Share Rate:** >10%

### Auth Conversion
- **Anonymous → Register:** >25%
- **Login Prompt → Signup:** >40%

### Retention
- **Day 2 Return:** >30%
- **Day 7 Return:** >20%
- **Quota Reset → Comeback:** >40%

---

## Journey 3: Cari Makan (Split Quiz — Addendum 07 v1.1 Approved 6 Okt 2026)

### Step 10: Entry `/makan`
**Goal:** Jawab "lagi di mall, makan apa?" <10 detik.
**UI:** 4 pertanyaan, 1 layar 1 pertanyaan (reuse quiz.html, 80% copy-paste):
1. "Mau makan di mall mana?" → [GI] / [Central Park] / [Kokas] / [PIM] / [Aeon BSD] (wajib 1)
2. "Misi makan kali ini?" → Makan Cepat / Nongkrong Lama / Keluarga / Healing
3. "Budget per orang?" → Hemat (<50k) / Menengah (50-150k) / Leluasa (>150k)
4. "Rombongan + pantangan?" → Sendiri / Berdua / Rame + toggle Halal only + Kids-friendly
**Result `/result-makan`:** 5 TENANT murni (tidak campur tempat). Card: Nama + [Kategori • Mall Lt.X] + [✅ Halal] + [🔥 Hype] + reason 1 kalimat + price_range + Maps + Simpan + Lapor tutup.
**Quota:** Terpisah 5x/hari (anonymous 2x via cookie `makan_quota_used`, login 5x). Tidak makan quota tempat.

### Step 11: Direktori SEO `/mall/:slug`
**Goal:** Akuisisi organik $0, tanpa LLM/quota.
List 40 tenant searchable + filter halal/budget/lantai/kids/mission/search + banner "Males scroll? Cariin yang cocok →" → `/makan?mall=gi` (pre-fill Q1).

### Step 12: History/Favorites Split
Tab Tempat | Makanan. Snapshot JSONB + `type: 'tempat'|'makan'` agar tidak kecampur.

---

## Future Journey Enhancements (Post-MVP)

1. **Onboarding Tutorial** (first-time overlay)
2. **Quiz Presets** ("Weekend bareng pasangan lagi")
3. **Collaborative Planning** (invite friend, vote together)
4. **Social Share with OG Image** (beautiful preview card)
5. **Calendar Integration** ("Add to Google Calendar")
6. **Push Notifications** ("Weekend planner ready! 🎉")
7. **Referral Program** ("Ajak teman, dapat +1 quota")

---

**Document Status:** FINAL  
**Last Updated:** October 5, 2026  
**Next Review:** After soft launch (30 users)
