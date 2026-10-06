# MVP Feature Checklist - Weekend Planner

**Version:** 1.1
**Date:** October 6, 2026
**Status:** In Development — Phase 8.1 ✅ beres, 8.2/8.3 code-complete (belum E2E), Phase 1–3 sebagian, Phase 4–7 belum
**Owner:** Agesta (Solo Founder)

> **Sinkronisasi 6 Okt 2026:** checklist ini sempat tertinggal dari kode (8.1 beres tapi tak tercatat, kode 8.2/8.3 ada tapi tak dicentang).
> Mulai v1.1, file ini + `docs/08-Progress-Log.md` adalah sumber tunggal status. Tiap sesi dev wajib update keduanya.

---

## Overview

This checklist breaks down Weekend Planner MVP into actionable tasks with priority levels and time estimates. Use this as your development roadmap.

**Priority Levels:**
- **P0:** Must-have for launch (blocking)
- **P1:** Should-have (important but can defer)
- **P2:** Nice-to-have (post-launch)

**Time Estimates:** Based on solo dev with AI assistance

---

## Phase 1: Project Setup & Foundation

**Goal:** Initialize project, configure tools, set up infrastructure

### 1.1 Project Initialization
- [ ] **P0** Create GitHub repository + push + GitHub Projects board - *15 min* ⏳ NEXT (git lokal di-init 6 Okt, belum push)
- [x] **P0** Initialize Nuxt project (`app/`, Nuxt 4.5.2 + Vue 3 + TS) - *10 min* ✅ BERES 6 Okt 2026 (upgrade 3.17→4.5.2, build hijau)
- [x] **P0** Install dependencies: TypeScript, Tailwind CSS, ESLint - *20 min* ✅ BERES (Prettier TIDAK dipakai — keputusan: ESLint saja, biar 1 tool)
- [x] **P0** Configure `nuxt.config.ts` (modules, runtimeConfig hermesApiUrl/Key, supabaseUrl/anonKey) - *15 min* ✅ BERES
- [x] **P0** Set up directory structure: `pages/`, `server/`, `types/`, `utils/` - *10 min* ✅ BERES sebagian (`components/`, `composables/`, `layouts/` BELUM ada — dibuat saat dibutuhkan, bukan upfront)
- [x] **P0** Create `.env.example` file with all required env vars - *10 min* ✅ BERES (`app/.env.example`)

**Subtotal:** ~1.5 hours

---

### 1.2 Supabase Setup
- [ ] **P0** Create Supabase project - *5 min*
- [ ] **P0** Run database schema SQL (from `04-Database-Schema.md`) - *15 min*
- [ ] **P0** Enable Row-Level Security policies - *10 min*
- [ ] **P0** Create database functions (initialize_new_user, check_quota, etc.) - *20 min*
- [ ] **P0** Configure Google OAuth in Supabase Auth settings - *10 min*
- [ ] **P0** Test database connection from local - *10 min*
- [ ] **P0** Schedule pg_cron job for daily quota reset - *10 min*

**Subtotal:** ~1.5 hours

---

### 1.3 Hermes-combo / 9router Integration
- [x] **P0** Verify 9router API endpoint is accessible - *5 min* ✅ BERES (config `hermesApiUrl` + key di runtimeConfig)
- [ ] **P0** Test LLM generation with sample prompt (live call) - *15 min* ⏳ BELUM (kode jadi, belum hit API beneran)
- [x] **P0** Create LLM client utility (`server/utils/llm.ts`) - *30 min* ✅ BERES (`callLLM` + `generateTempat` + `rankTenants`, timeout 15s, JSON-only prompt)
- [x] **P0** Create system prompt template - *20 min* ✅ BERES (`TEMPAT_SYSTEM` + `MAKAN_SYSTEM` di `llm.ts`)
- [ ] **P0** Test full quiz → LLM → parse JSON flow - *20 min* ⏳ BELUM (tunggu seed di-run ke Supabase → gabung ke 8.4)

**Subtotal:** ~1.5 hours

---

### 1.4 Deployment Setup
- [ ] **P0** Connect GitHub repo to Vercel - *5 min*
- [ ] **P0** Configure Vercel environment variables - *10 min*
- [ ] **P0** Set up staging environment (separate branch) - *10 min*
- [ ] **P0** Test auto-deploy on push - *5 min*
- [ ] **P1** Set up custom domain (optional) - *30 min*

**Subtotal:** ~1 hour

---

**Phase 1 Total:** ~5.5 hours

---

## Phase 2: Core Features - Backend API

**Goal:** Build all server routes and business logic

### 2.1 Authentication Endpoints
- [ ] **P0** `POST /api/auth/register` - Email/password signup - *1 hour*
  - Validate email, password, phone format
  - Call Supabase Auth signup
  - Initialize user profile + quota
  - Set session cookie
  - Error handling (duplicate email, weak password)

- [ ] **P0** `POST /api/auth/login` - Email/password login - *45 min*
  - Validate credentials
  - Call Supabase Auth login
  - Set session cookie
  - Error handling (invalid credentials)

- [ ] **P0** `POST /api/auth/logout` - End session - *15 min*
  - Clear session cookie
  - Call Supabase signOut

- [ ] **P0** `GET /api/auth/callback` - OAuth callback handler - *45 min*
  - Handle Google OAuth redirect
  - Check if first-time user
  - Collect phone if needed
  - Initialize profile + quota

- [ ] **P0** Auth middleware (`server/middleware/auth.ts`) - *30 min*
  - Extract JWT from cookie
  - Verify with Supabase
  - Attach user to request context

**Subtotal:** ~3.5 hours

---

### 2.2 Quota System
- [ ] **P0** `GET /api/quota` - Check quota status - *45 min*
  - Anonymous: check session cookie
  - Registered: query database
  - Calculate hours until reset
  - Return status

- [ ] **P0** Quota check utility (`server/utils/quota.ts`) - *1.5 hours*
  - `checkQuota(userId, sessionId)` function
  - Handle anonymous vs registered logic
  - Auto-reset if >24h since last reset
  - Return {allowed, remaining, resetAt, reason}

- [ ] **P0** Increment quota utility - *30 min*
  - For registered: call `check_and_increment_quota()` DB function
  - For anonymous: set cookie

**Subtotal:** ~2.5 hours

---

### 2.3 Generation Endpoint
- [~] **P0** `POST /api/tempat/recommend` + `POST /api/makan/recommend` (pengganti `/api/generate` versi split Addendum 07) - *2.5 hours* ✅ CODE-COMPLETE 6 Okt 2026 (cek quota → filter/call LLM → save `generations`; belum live-test → gabung 8.4)
  - Validate quiz input with Zod
  - Check quota (fail early if exhausted)
  - Generate session_id for anonymous
  - Call LLM API with timeout (15s)
  - Parse JSON response
  - Validate 5 recommendations returned
  - Save to `generations` table
  - Increment quota
  - Log analytics event
  - Error handling (LLM timeout, parse failure, quota exceeded)

- [~] **P0** LLM generation utility improvements - *1 hour* ⏳ SEBAGIAN (timeout 15s + JSON-only prompt ✅; retry 1x + token counting + cost tracking ⏳ BELUM)
  - Retry logic (1 retry on timeout)
  - Better error messages
  - Token counting estimation
  - Cost tracking

**Subtotal:** ~3.5 hours

---

### 2.4 History & Favorites
- [ ] **P1** `GET /api/history` - Fetch generation history - *1 hour*
  - Require auth
  - Paginated results (limit, offset)
  - Return quiz_input + recommendations + created_at

- [ ] **P1** `POST /api/favorites` - Save favorite - *1 hour*
  - Require auth
  - Validate generation_id and index
  - Insert into favorites table
  - Handle duplicate (409 Conflict)

- [ ] **P1** `GET /api/favorites` - Fetch favorites - *45 min*
  - Require auth
  - Paginated results
  - Return recommendation data + notes

- [ ] **P1** `DELETE /api/favorites/:id` - Remove favorite - *30 min*

**Subtotal:** ~3 hours

---

### 2.5 Utility Endpoints
- [ ] **P0** `GET /api/health` - Health check - *15 min* ⏳ BELUM (file belum ada)
  - Check database connection
  - Check LLM endpoint
  - Return service status

- [ ] **P0** Rate limiting middleware - *45 min*
  - Install `rate-limiter-flexible`
  - 60 req/min per IP
  - Return 429 on limit

**Subtotal:** ~1 hour

---

**Phase 2 Total:** ~13.5 hours

---

## Phase 3: Core Features - Frontend UI

**Goal:** Build all user-facing pages and components

### 3.1 Design System & Components
- [x] **P0** Tailwind config (colors, fonts, breakpoints) - *30 min* ✅ BERES (`app/tailwind.config.ts` + `@nuxtjs/tailwindcss`)
- [ ] **P0** Create base components - *2 hours* ⏳ BELUM (`app/components/` belum ada — UI sekarang inline di pages)
  - Button (primary, secondary, ghost variants)
  - Input (text, password, with validation states)
  - Card
  - Modal/Dialog
  - Loading spinner
  - Toast notification

- [ ] **P0** Create layout component (`layouts/default.vue`) - *45 min* ⏳ BELUM (`app/layouts/` belum ada)
  - Navbar (logo, login/register, user menu)
  - Footer (links, copyright)
  - Mobile responsive

**Subtotal:** ~3 hours

---

### 3.2 Landing Page
- [x] **P0** `pages/index.vue` - Landing page - *2 hours* ✅ CODE-COMPLETE (hero + dual CTA 🗺️/quiz + 🍜/makan; value-prop/how-it-works/SEO ⏳ menyusul)
  - Hero section with headline + CTA
  - Value proposition (3 benefits)
  - How it works (3 steps)
  - Social proof section (optional)
  - Footer
  - Mobile responsive
  - SEO meta tags

**Subtotal:** ~2 hours

---

### 3.3 Quiz Flow
- [x] **P0** `pages/quiz.vue` - Quiz page - *3 hours* ✅ CODE-COMPLETE 6 Okt (5Q tempat 1-layar-1-pertanyaan + progress + Kembali; localStorage resume ⏳ BELUM — dibuat saat 8.4)
  - Multi-step form (1 question per screen)
  - Progress indicator
  - Question components:
    - Mood selector (radio buttons with icons)
    - Companion selector
    - Budget selector
    - Location selector (with conditional text input)
    - Time selector (optional)
    - Child age (conditional)
  - Form validation
  - "Lanjut" / "Kembali" navigation
  - Submit → Call `/api/generate`
  - Loading state during generation
  - Error handling (show retry)

- [~] **P0** Quiz state management (composable) - *1 hour* ⏳ SEBAGIAN (logic pure `utils/quiz-logic.ts` + 12 unit test ✅; `composables/useQuiz()` + localStorage ⏳ BELUM)
  - `useQuiz()` composable
  - Store answers in reactive state
  - Persist to localStorage (resume if refresh)
  - Validation logic

**Subtotal:** ~4 hours

---

### 3.4 Result Page
- [x] **P0** `pages/result.vue` - Result display - *3 hours* ✅ CODE-COMPLETE 6 Okt (5 kartu tempat + loading + error; tombol Simpan/login-wall ⏳ butuh auth Phase 2.1)
- [ ] **P0** Recommendation card component - *1 hour* ⏳ BELUM (masih inline di result.vue/result-makan.vue — ekstraksi saat 3.1 components dibuat)
  - Header with quota indicator
  - 5 recommendation cards:
    - Name + category badge
    - Reason (personalized)
    - Cost estimate
    - Location area
    - Best time
    - "Lihat di Maps" button (external link)
    - "Simpan" button (login wall for anonymous)
  - "Generate Lagi" sticky bottom button
  - "Ubah Jawaban" link
  - Mobile: cards stack vertically
  - Tablet/Desktop: 2-column grid

- [ ] **P0** Recommendation card component - *1 hour*
  - Reusable card component
  - Category badge styling
  - Icon integration
  - Responsive layout

**Subtotal:** ~4 hours

---

**Status 6 Okt 2026: BELUM ADA SAMA SEKALI** — `pages/login.vue`, `register.vue`, `auth/callback.vue`, `server/middleware/auth.ts` belum dibuat. Quota sekarang cookie-only (anon). Auth = blocker buat quota login + Simpan + history. Prioritas setelah 8.4.
- [ ] **P0** `pages/login.vue` - Login page - *1.5 hours*
  - Email + password form
  - "Remember me" checkbox
  - "Lupa password?" link (stub for now)
  - "Login dengan Google" button
  - Link to register page
  - Form validation
  - Error display (invalid credentials)
  - Redirect after success

- [ ] **P0** `pages/register.vue` - Register page - *1.5 hours*
  - Email, phone, password, confirm password fields
  - Phone validation (+62 format)
  - Password strength indicator
  - Terms checkbox
  - "Daftar dengan Google" button
  - Form validation
  - Error display (email exists, weak password)
  - Redirect after success

- [ ] **P0** `pages/auth/callback.vue` - OAuth callback - *1 hour*
  - Handle OAuth redirect
  - Show phone collection modal (if first-time Google login)
  - Loading state
  - Redirect to previous page or quiz

**Subtotal:** ~4 hours

---

### 3.6 User Features (Post-MVP P1)
- [ ] **P1** `pages/history.vue` - Generation history - *2 hours*
  - List past generations
  - Show quiz input summary
  - "Lihat Lagi" button to view results
  - Pagination
  - Empty state

- [ ] **P1** `pages/favorites.vue` - Saved favorites - *2 hours*
  - Grid of favorite cards
  - Notes display
  - "Hapus" button
  - Empty state

- [ ] **P1** `pages/profile.vue` - User profile - *1.5 hours*
  - Display email, phone
  - Edit profile (phone only)
  - Logout button

**Subtotal (P1):** ~5.5 hours

---

### 3.7 Error & Edge Case Pages
- [ ] **P0** `pages/quota-exhausted.vue` - Quota modal/page - *1 hour*
  - Countdown to reset
  - Alternative actions (history, share)
  - CTA to return tomorrow

- [ ] **P0** Error components - *1 hour*
  - 404 page
  - 500 error page
  - Network error modal
  - LLM generation failed modal

**Subtotal:** ~2 hours

---

|**Phase 3 Total (P0 only):** ~19.5 hours  
|**Phase 3 Total (with P1):** ~25 hours

---

## Phase 8: Mall F&B Split Quiz (Addendum 07 v1.1 Approved 6 Okt 2026)

**Goal:** Quiz makan + direktori tenant terpisah total dari quiz tempat. Result tidak dicampur.

### 8.1 Backend Mall (DB + Seed)
- [x] **P0** Create tables `malls`, `tenants`, `mall_search_quota` + `raw_scrape` staging + RLS (public read, staging closed) - *30 min* ✅ BERES 6 Okt 2026 (`supabase/migration.sql`: 4 tabel + `idx_tenants_needs_survey` + `idx_raw_scrape_city_status`)
- [x] **P0** Import `data/tenants-seed.csv` 200 rows (5 mall x 40) + verifikasi - *30 min* ✅ BERES (`generate_seed.py` + `seed.sql` 205 INSERT, pytest 10/10)
- [x] **P0** Patch NULL tri-state: kosong → `NULL` + `data_source`/`verified_at`/`needs_survey`, filter `.eq(true)` exclude NULL, badge ❓ - *1 jam* ✅ BERES 6 Okt 2026 (generator + migrasi + `types/` + `recommend.post.ts` + `tenants.get.ts` + `result-makan.vue` + `mall/[slug].vue` + `AUDIT.md`)

**Subtotal:** ~1 hour

---

### 8.2 Makan API
- [x] **P0** `GET /api/malls` + `GET /api/malls/:slug` - *45 min* ✅ CODE-COMPLETE (`index.get.ts` ada; `:slug` detail via tenants.get — baca mall inline)
- [x] **P0** `GET /api/malls/:slug/tenants` (filter halal/budget/mission/kids/search, tanpa LLM) - *1 hour* ✅ CODE-COMPLETE + aturan NULL `.eq(true)` + JSDoc tri-state
- [x] **P0** `POST /api/makan/recommend` (cek quota makan → filter Supabase → LLM ranking Top 5 + reason 1 kalimat → save `generations {type:'makan'}`) - *2 hours* ✅ CODE-COMPLETE + passthrough `data_source`/`needs_survey`
- [ ] **P1** `POST /api/vote` (tanpa login, rate-limit IP) + `POST /api/report-tenant` - *1.5 hours* ⏳ BELUM — NEXT setelah 8.4 (nutup loop `is_open`/`needs_survey` dari AUDIT.md)

**Subtotal (P0):** ~3.75 hours

---

### 8.3 Frontend Makan + Direktori
- [x] **P0** `pages/makan.vue` - Quiz 4Q (mall wajib 1 → misi → budget → rombongan+toggle halal/kids), reuse quiz tempat 80% - *2.5 hours* ✅ CODE-COMPLETE (+ pre-fill `?mall=` skip Q1 via `getMakanStartStep`, tested)
- [x] **P0** `pages/result-makan.vue` - 5 kartu TENANT murni (nama + kategori•mall•lantai + halal + hype + reason + price_range + Maps gede + Simpan + Lapor tutup) - *2.5 hours* ✅ CODE-COMPLETE (+ badge ❓/📋 tri-state; tombol Simpan/Lapor ⏳ butuh auth/vote API)
- [x] **P0** `pages/mall/[slug].vue` - Direktori SEO (list 40 + filter + search + banner "Cariin yang cocok → /makan?mall=") - *2.5 hours* ✅ CODE-COMPLETE (+ badge ❓/📋; SEO meta ⏳ menyusul)
- [x] **P0** Update landing dual CTA (🗺️ Cari Tempat gede + 🍜 Cari Makan kedua) + navbar [Makan] - *45 min* ✅ SEBAGIAN (dual CTA di `index.vue` ✅; navbar [Makan] ⏳ BELUM — `layouts/` belum ada)
- [ ] **P1** History/Favorites tab Tempat | Makanan (`type` field) - *1.5 hours*

**Subtotal (P0):** ~8.25 hours

---

### 8.4 Testing Makan
- [ ] **P0** Test makan flow (landing → /makan → /result-makan → Maps/Simpan/Lapor) - *30 min*
- [ ] **P0** Test quota pisah (tempat 2/hari vs makan 5/hari, tidak saling makan) - *20 min*
- [ ] **P0** Test direktori filter + SEO meta `/mall/:slug` - *20 min*

**Subtotal:** ~1.2 hours

---

**Phase 8 Total (P0):** ~13-14 hours
**Grand Total P0:** 64h + 13h = **~77h** (Solo founder 4-5h/hari → 16-19 hari)

---

## Phase 4: State Management & Data Flow

**Goal:** Connect frontend to backend, handle auth state

### 4.1 Composables
- [ ] **P0** `composables/useAuth.ts` - Auth state - *2 hours*
  - `user` reactive ref
  - `login()`, `logout()`, `register()` functions
  - Auto-refresh token
  - Persist state across page loads

- [ ] **P0** `composables/useQuota.ts` - Quota state - *1 hour*
  - `quotaStatus` reactive ref
  - `fetchQuota()` function
  - Auto-update after generation
  - Countdown timer to reset

- [ ] **P0** `composables/useGenerate.ts` - Generation flow - *1.5 hours*
  - `generate(quizInput)` function
  - Loading state
  - Error handling
  - Store result in state

**Subtotal:** ~4.5 hours

---

### 4.2 API Client
- [ ] **P0** `utils/api.ts` - API client wrapper - *1.5 hours*
  - Fetch wrapper with auth header injection
  - Error parsing
  - TypeScript types
  - Retry logic (optional)

**Subtotal:** ~1.5 hours

---

**Phase 4 Total:** ~6 hours

---

## Phase 5: Analytics & Monitoring

**Goal:** Track user behavior and system health

### 5.1 Google Analytics Setup
- [ ] **P0** Install `@nuxtjs/google-analytics` or manual gtag - *15 min*
- [ ] **P0** Configure GA4 property - *15 min*
- [ ] **P0** Add gtag to `app.vue` - *15 min*
- [ ] **P0** Implement event tracking - *2 hours*
  - Page views (automatic)
  - quiz_started
  - quiz_completed
  - recommendation_generated
  - recommendation_clicked
  - login_prompted
  - user_registered
  - quota_exhausted
  - generation_failed

**Subtotal:** ~3 hours

---

### 5.2 Server-Side Logging
- [ ] **P0** Log LLM requests to `analytics_events` - *30 min*
- [ ] **P0** Log errors to `analytics_events` - *30 min*
- [ ] **P1** Create internal dashboard page (view logs) - *2 hours*

**Subtotal (P0):** ~1 hour  
**Subtotal (with P1):** ~3 hours

---

**Phase 5 Total (P0):** ~4 hours

---

## Phase 6: Testing & Quality Assurance

**Goal:** Ensure everything works before launch

### 6.1 Manual Testing
- [ ] **P0** Test full anonymous flow (landing → quiz → result) - *30 min*
- [ ] **P0** Test full registered flow (register → quiz → result × 2) - *30 min*
- [ ] **P0** Test quota exhaustion scenarios - *30 min*
- [ ] **P0** Test error scenarios (LLM timeout, invalid input) - *30 min*
- [ ] **P0** Test OAuth flow (Google login) - *15 min*
- [ ] **P0** Test mobile responsive (iPhone, Android) - *30 min*
- [ ] **P0** Test on multiple browsers (Chrome, Safari, Firefox) - *30 min*

**Subtotal:** ~3 hours

---

### 6.2 Automated Testing (Optional P1)
- [ ] **P1** Set up Vitest for unit tests - *1 hour*
- [ ] **P1** Write tests for utility functions (quota check, LLM client) - *2 hours*
- [ ] **P1** Set up Playwright for E2E tests - *1 hour*
- [ ] **P1** Write E2E test for happy path - *2 hours*

**Subtotal (P1):** ~6 hours

---

### 6.3 Bug Fixes & Polish
- [ ] **P0** Fix bugs found during testing - *4 hours (estimate)*
- [ ] **P0** Polish UI/UX rough edges - *2 hours*
- [ ] **P0** Optimize performance (lazy loading, code splitting) - *2 hours*

**Subtotal:** ~8 hours

---

**Phase 6 Total (P0):** ~11 hours

---

## Phase 7: Pre-Launch Preparation

**Goal:** Final checks and launch readiness

### 7.1 Content & Copy
- [ ] **P0** Write all UI copy (headlines, CTAs, error messages) - *1.5 hours*
- [ ] **P0** Review Indonesian language consistency - *30 min*
- [ ] **P0** Create social share OG image - *1 hour*

**Subtotal:** ~3 hours

---

### 7.2 SEO & Meta Tags
- [ ] **P0** Set up SEO meta tags (title, description) - *30 min*
- [ ] **P0** Add Open Graph tags - *30 min*
- [ ] **P0** Create `robots.txt` - *10 min*
- [ ] **P0** Create `sitemap.xml` - *20 min*

**Subtotal:** ~1.5 hours

---

### 7.3 Legal & Compliance
- [ ] **P1** Create Terms of Service page (simple version) - *1 hour*
- [ ] **P1** Create Privacy Policy page (simple version) - *1 hour*
- [ ] **P1** Add cookie notice (optional for MVP) - *30 min*

**Subtotal (P1):** ~2.5 hours

---

### 7.4 Launch Checklist
- [ ] **P0** Set up production environment variables - *15 min*
- [ ] **P0** Test production build locally - *15 min*
- [ ] **P0** Deploy to production - *10 min*
- [ ] **P0** Smoke test in production - *30 min*
- [ ] **P0** Set up error monitoring (Sentry optional) - *1 hour*
- [ ] **P0** Prepare launch announcement (social media posts) - *1 hour*

**Subtotal:** ~3 hours

---

**Phase 7 Total (P0):** ~7.5 hours

---

## Time Summary

| Phase | P0 (Must-Have) | P1 (Should-Have) | Total |
|-------|----------------|------------------|-------|
| 1. Setup & Foundation | 5.5h | 0.5h | 6h |
| 2. Backend API | 10.5h | 3h | 13.5h |
| 3. Frontend UI | 19.5h | 5.5h | 25h |
| 4. State Management | 6h | 0h | 6h |
| 5. Analytics | 4h | 2h | 6h |
| 6. Testing & QA | 11h | 6h | 17h |
| 7. Pre-Launch | 7.5h | 2.5h | 10h |
| **TOTAL** | **64h** | **19.5h** | **83.5h** |

---

## Development Timeline

### Aggressive (Focus Mode)
- **8 hours/day** → **8 days** (P0 only)
- **8 hours/day** → **10.5 days** (P0 + P1)

### Realistic (Solo Founder)
- **4-5 hours/day** → **13-16 days** (P0 only)
- **4-5 hours/day** → **17-21 days** (P0 + P1)

### Recommended Schedule
**Week 1:** Phase 1-2 (Setup + Backend)  
**Week 2:** Phase 3-4 (Frontend + State)  
**Week 3:** Phase 5-7 (Analytics + Testing + Launch)

---

## Risk Mitigation

### High-Risk Tasks (Likely to Take Longer)
1. **LLM Integration** (Phase 1.3 + 2.3)
   - Risk: API reliability, prompt tuning, JSON parsing failures
   - Mitigation: Budget 2x time, implement robust error handling

2. **Quiz UX** (Phase 3.3)
   - Risk: Form flow confusing, drop-off rate high
   - Mitigation: Test with 3-5 users early, iterate on flow

3. **OAuth Integration** (Phase 2.1 + 3.5)
   - Risk: Callback redirect issues, phone collection friction
   - Mitigation: Test thoroughly, prepare fallback to email-only

4. **Mobile Responsive** (All frontend)
   - Risk: Layout breaks on small screens
   - Mitigation: Mobile-first design from start, test on real devices

---

## Post-Launch Iterations

### Week 1 After Launch
- [ ] Monitor analytics daily
- [ ] Collect user feedback (survey or interviews)
- [ ] Fix critical bugs (P0)
- [ ] Iterate on LLM prompt based on quality feedback

### Week 2-4 After Launch
- [ ] Implement P1 features (history, favorites, profile)
- [ ] A/B test landing page copy
- [ ] Optimize conversion funnel (landing → quiz → result)
- [ ] Add missing features based on user requests

---

## Feature Toggles (Optional)

Consider feature flags for:
- [ ] Google OAuth (can disable if issues arise)
- [ ] Phone number requirement (can make optional)
- [ ] Quota limit (can increase from 2 to 3 if LLM cost allows)
- [ ] P1 features (can enable gradually)

---

## Success Criteria (2 Weeks Post-Launch)

**Minimum Viable Success:**
- ✅ 50+ registered users
- ✅ 60%+ quiz completion rate
- ✅ 40%+ recommendation click-through rate
- ✅ 20%+ day-2 return rate
- ✅ <5% error rate

**Strong Success:**
- ✅ 100+ registered users
- ✅ 75%+ quiz completion rate
- ✅ 60%+ recommendation click-through rate
- ✅ 30%+ day-2 return rate
- ✅ Organic word-of-mouth (>0.2 viral coefficient)

---

**Document Status:** READY for execution  
**Last Updated:** October 5, 2026  
**Owner:** Agesta

**Next Action:** Begin Phase 1 (Project Setup)
