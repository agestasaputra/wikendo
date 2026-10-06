# Architecture Decision Record (ADR)
# Weekend Planner MVP

**Version:** 2.1 Amended (6 Okt 2026 malam)
**Date:** October 5, 2026 (asli) + amendment 6 Okt 2026
**Status:** Approved for Implementation + 3 amendment tercatat di log bawah
**Authors:** Agesta (Founder) + AI Development Team

---

## Document Purpose

This ADR documents all major technical decisions for Weekend Planner MVP, including rationale, alternatives considered, and consequences. Future developers (or AI agents) should reference this document to understand "why we built it this way."

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Frontend Stack](#2-frontend-stack)
3. [Backend Architecture](#3-backend-architecture)
4. [Database & Storage](#4-database--storage)
5. [LLM Integration](#5-llm-integration)
6. [Authentication](#6-authentication)
7. [Quota System](#7-quota-system)
8. [Analytics & Monitoring](#8-analytics--monitoring)
9. [Hosting & Deployment](#9-hosting--deployment)
10. [Cost Structure](#10-cost-structure)
11. [Security Considerations](#11-security-considerations)
12. [Performance Targets](#12-performance-targets)
13. [Future Migration Paths](#13-future-migration-paths)

---

## 1. System Overview

### Context
Solo founder building first startup, AI-assisted development, limited budget, growth-first strategy.

### High-Level Architecture

```
┌─────────────────────────────────────────────────┐
│                   Client                         │
│         (Nuxt 3 SSR/CSR, Mobile-First)          │
└─────────────────┬───────────────────────────────┘
                  │ HTTPS
┌─────────────────▼───────────────────────────────┐
│              Vercel Edge                         │
│   ┌─────────────────────────────────────┐       │
│   │   Nuxt Server Routes (Serverless)   │       │
│   │  ┌──────────┐    ┌───────────────┐  │       │
│   │  │ /api/    │    │ SSR Pages     │  │       │
│   │  │ generate │    │ (Landing)     │  │       │
│   │  │ auth     │    └───────────────┘  │       │
│   │  │ quota    │                        │       │
│   │  └────┬─────┘                        │       │
│   └───────┼──────────────────────────────┘       │
└───────────┼──────────────────────────────────────┘
            │
     ┌──────┴────────┐
     │               │
     ▼               ▼
┌─────────┐    ┌─────────────┐
│Supabase │    │ 9router API │
│PostgreSQL│   │ (Hermes-    │
│+ Auth   │    │  combo LLM) │
└─────────┘    └─────────────┘
```

### Request Flow Examples

**Anonymous user generates recommendation:**
```
1. User → Nuxt page (/quiz) → Submit quiz
2. Client → POST /api/generate → Nuxt server route
3. Server checks quota (Supabase) → Allow if <1 used
4. Server → 9router API (Hermes-combo) → Get recommendations
5. Server saves to DB → Increments quota
6. Server → Client (JSON response)
7. Client renders 5 recommendation cards
```

**Registered user logs in:**
```
1. User → /login → Supabase Auth (email/password or Google OAuth)
2. Supabase → Issues JWT session token
3. Client stores session (httpOnly cookie)
4. All subsequent API calls include auth header
5. Server validates JWT → Identifies user → Allows 2 quota/day
```

---

## 2. Frontend Stack

### Decision: Nuxt 4.5.2 (Vue 3) + TypeScript + Tailwind CSS

> **Amendment 6 Okt 2026:** scaffold real pakai **Nuxt 4.5.2** (bukan 3.x seperti rencana awal). Struktur folder real:
> `app/pages/`, `app/server/api/`, `app/server/utils/`, `app/types/`, `app/utils/`.
> Folder `app/components/`, `app/composables/`, `app/layouts/`, `app/middleware/` BELUM dibuat (UI masih inline di pages).
> Prettier TIDAK dipakai — cukup ESLint biar 1 tool.

**Rationale:**
- **Nuxt 3 benefits:**
  - Server-side rendering (SSR) for landing page SEO
  - File-based routing (no manual route config)
  - Server routes built-in (no separate backend needed)
  - Auto-imports (components, composables)
  - Great TypeScript support
  - Vercel zero-config deployment

- **Why not Next.js:**
  - Founder prefers Vue syntax
  - Nuxt 3 has simpler mental model (pages/ vs app/)
  - No difference in performance/capabilities for this use case

- **Why not plain Vue (Vite):**
  - Would need separate backend (Express/Fastify)
  - More setup overhead
  - SSR requires manual configuration

- **TypeScript:**
  - Catch errors early
  - Better IDE support for solo dev
  - Easier to maintain as codebase grows

- **Tailwind CSS:**
  - Fast styling (no separate CSS files)
  - Mobile-first utilities
  - Small bundle size (purged unused classes)

**Alternatives Considered:**
- Next.js 14 (React) - rejected due to preference for Vue
- SvelteKit - rejected due to smaller ecosystem
- Plain HTML + vanilla JS - rejected, too primitive for SPA

**Consequences:**
- ✅ Fast development velocity
- ✅ Built-in SSR + API routes
- ✅ Easy Vercel deployment
- ⚠️ Vue ecosystem smaller than React (but sufficient)
- ❌ Team expansion harder (fewer Vue devs than React)

---

## 3. Backend Architecture

### Decision: Monolithic Nuxt Server Routes (No Separate Backend)

**Rationale:**
- Nuxt 3 server routes are serverless functions (on Vercel)
- Sufficient for MVP scope:
  - Generate recommendations (call LLM API)
  - Check/update quota (database queries)
  - Handle auth callbacks
- No complex business logic requiring separate service
- Reduces operational complexity (one deployment)

**Directory Structure:**
```
server/
├── api/
│   ├── generate.post.ts       # POST /api/generate
│   ├── quota.get.ts           # GET /api/quota
│   └── auth/
│       ├── register.post.ts
│       └── callback.get.ts
├── middleware/
│   ├── auth.ts                # Verify JWT
│   └── rate-limit.ts          # Additional rate limiting
└── utils/
    ├── llm.ts                 # Hermes-combo client
    ├── db.ts                  # Supabase client
    └── prompt.ts              # System prompt templates
```

**When to Split Backend:**
- Admin dashboard with complex operations
- Background jobs (email queues, cron)
- Real-time features (WebSocket)
- Microservices needed for scale

**Alternatives Considered:**
- Separate Express/Fastify backend - over-engineering for MVP
- tRPC - adds complexity, type safety not critical here

**Consequences:**
- ✅ Simpler deployment (one codebase)
- ✅ Faster development (no API contract negotiation)
- ✅ Lower latency (no network hop between frontend/backend)
- ⚠️ Harder to scale independently (frontend/backend coupled)
- ❌ Can't reuse backend for mobile app (would need to refactor)

---

## 4. Database & Storage

### Decision: Supabase (PostgreSQL + Auth)

**Rationale:**
- **Free tier generous:**
  - 500MB database storage
  - 50,000 monthly active users
  - Unlimited API requests
  - Built-in auth (email, OAuth)

- **Built-in features:**
  - Row-level security (RLS)
  - Real-time subscriptions (future use)
  - Auto-generated REST API
  - Dashboard for debugging

- **Developer experience:**
  - SQL-based (familiar)
  - Good TypeScript support
  - Local development with CLI

**Schema Design:**

```sql
-- Users table (Supabase auth.users built-in)
-- Extends with user_profiles for phone

CREATE TABLE user_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User quota tracking
CREATE TABLE user_quota (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  quota_used INT DEFAULT 0,
  quota_limit INT DEFAULT 2,
  last_reset_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generation history
CREATE TABLE generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT, -- for anonymous users
  quiz_input JSONB NOT NULL,
  recommendations JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_generations_user_id ON generations(user_id);
CREATE INDEX idx_generations_session_id ON generations(session_id);
CREATE INDEX idx_generations_created_at ON generations(created_at DESC);

-- Row-level security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quota ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users view own quota"
  ON user_quota FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users view own generations"
  ON generations FOR SELECT
  USING (auth.uid() = user_id OR session_id = current_setting('app.session_id', true));

-- Daily quota reset function (called by cron)
CREATE OR REPLACE FUNCTION reset_daily_quotas()
RETURNS void AS $$
BEGIN
  UPDATE user_quota
  SET quota_used = 0,
      last_reset_at = NOW()
  WHERE last_reset_at < NOW() - INTERVAL '1 day';
END;
$$ LANGUAGE plpgsql;
```

**Alternatives Considered:**
- Firebase - more expensive, vendor lock-in
- MongoDB Atlas - free tier too small, no built-in auth
- Local PostgreSQL - requires separate hosting, no auth

**Consequences:**
- ✅ Zero cost for MVP
- ✅ Built-in auth saves development time
- ✅ Easy to migrate data out (standard PostgreSQL)
- ⚠️ Free tier limits (500MB, need monitoring)
- ❌ Vendor dependency (but migration path exists)

---

## 5. LLM Integration

### Decision: Hermes-combo via 9router API (Remote)

**Rationale:**
- Founder already has access to 9router endpoint
- Hermes-combo is a high-quality LLM
- Remote API simplifies deployment (no self-hosting LLM)

**Integration Pattern:**

```typescript
// server/utils/llm.ts
import type { QuizInput, Recommendation } from '~/types'

const SYSTEM_PROMPT = `
Kamu adalah asisten rekomendasi weekend planner yang ahli soal tempat-tempat
di Indonesia (kafe, tempat wisata, aktivitas, restoran, ruang publik, dll).

TUGAS:
Berdasarkan input user (mood, teman jalan, budget, radius, kota, waktu),
berikan 5 rekomendasi tempat/aktivitas yang SPESIFIK dan MASUK AKAL untuk
kota yang disebutkan.

ATURAN PENTING:
1. HANYA rekomendasikan tempat yang benar-benar kemungkinan besar eksis di
   kota tersebut. Jika tidak yakin, berikan rekomendasi jenis tempat umum.
2. Estimasi biaya harus realistis sebagai RANGE.
3. Sesuaikan dengan SEMUA input user.
4. Alasan harus spesifik ke input user.
5. Variasi jenis tempat jika memungkinkan.
6. JANGAN disclaimer, hanya JSON.

FORMAT OUTPUT (WAJIB JSON):
{
  "recommendations": [
    {
      "name": "Nama tempat atau jenis aktivitas",
      "category": "kategori singkat",
      "reason": "alasan spesifik kenapa cocok",
      "estimated_cost": "range biaya per orang dalam Rupiah",
      "location_area": "area/lokasi umum",
      "best_time": "waktu terbaik sesuai input",
      "confidence": "high/medium/low"
    }
  ]
}

INPUT USER:
- Mood: {mood}
- Teman jalan: {companion}
- Budget: {budget}
- Radius: {radius}
- Kota: {city}
- Waktu: {time}
`

export async function generateRecommendations(input: QuizInput): Promise<Recommendation[]> {
  const config = useRuntimeConfig()
  
  const userPrompt = `
Mood: ${input.mood}
Teman jalan: ${input.companion}
Budget: ${input.budget}
Radius: ${input.radius}
Kota: ${input.city}
Waktu: ${input.time || 'Fleksibel'}
  `.trim()

  try {
    const response = await $fetch(config.hermesApiUrl + '/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.hermesApiKey}`,
        'Content-Type': 'application/json',
      },
      body: {
        model: 'hermes-combo',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      },
      timeout: 15000 // 15 second timeout
    })

    const content = response.choices[0].message.content
    const parsed = JSON.parse(content)
    
    return parsed.recommendations.slice(0, 5) // Ensure exactly 5
    
  } catch (error) {
    console.error('LLM generation failed:', error)
    throw new Error('Failed to generate recommendations')
  }
}
```

**Error Handling:**
- Timeout after 15s → Show user-friendly error
- JSON parse failure → Retry once, then fallback
- API rate limit → Should not happen (quota enforced in DB)
- Don't count failed generations against user quota

**Cost Tracking:**
```typescript
// Log every LLM call for cost analysis
await supabase.from('llm_logs').insert({
  user_id: userId,
  model: 'hermes-combo',
  prompt_tokens: estimateTokens(prompt),
  cost_estimate: estimateCost(tokens),
  success: true
})
```

**Alternatives Considered:**
- OpenAI GPT-4o-mini - requires API key management, per-request cost
- Self-hosted LLM - too complex for solo founder
- Gemini Flash - quality unknown, similar complexity

**Consequences:**
- ✅ High-quality recommendations (Hermes-combo proven)
- ✅ No LLM hosting complexity
- ✅ Cost potentially lower (depends on 9router pricing)
- ⚠️ Dependency on 9router availability
- ❌ Need to confirm 9router pricing model

---

## 6. Authentication

### Decision: Supabase Auth (Email/Password + Google OAuth)

**Rationale:**
- Built into Supabase (no separate auth service)
- Supports multiple providers
- JWT-based, secure by default
- Free tier: 50K MAU

**Registration Flow:**

```typescript
// Email + Password
const { data, error } = await supabase.auth.signUp({
  email: email,
  password: password,
  options: {
    data: {
      phone: phone // Store phone in user metadata
    }
  }
})

// Create profile after signup
await supabase.from('user_profiles').insert({
  user_id: data.user.id,
  phone: phone
})

// Initialize quota
await supabase.from('user_quota').insert({
  user_id: data.user.id,
  quota_used: 0,
  quota_limit: 2
})
```

**Google OAuth:**
```typescript
// Initiate OAuth
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: 'https://your-domain.com/auth/callback',
    queryParams: {
      access_type: 'offline',
      prompt: 'consent',
    }
  }
})

// After OAuth callback, collect phone if first time
if (isFirstLogin) {
  // Show modal to collect phone
  await supabase.from('user_profiles').insert({
    user_id: user.id,
    phone: phone
  })
}
```

**Session Management:**
- Session stored in httpOnly cookie (secure)
- Auto-refresh before expiry
- Logout clears session from client + server

**Phone Number Requirement:**
- Required field on registration
- Format validation: +62 (Indonesia)
- Not verified in MVP (SMS verification post-MVP)
- Purpose: User accountability, future SMS notifications

**Email Verification:**
- **Decision: Optional for MVP** (reduce friction)
- Send verification email, but allow login without
- Can add requirement post-launch if abuse detected

**Alternatives Considered:**
- NextAuth/Auth.js - requires more setup
- Firebase Auth - vendor lock-in, cost
- Roll own JWT - security risk, time-consuming

**Consequences:**
- ✅ Battle-tested auth system
- ✅ Multiple providers (easy to add more)
- ✅ Zero setup cost
- ⚠️ Phone collection may reduce signup conversion
- ❌ Supabase dependency

---

## 7. Quota System

### Decision: Dual Quota — Tempat 2/hari + Makan 5/hari, Daily Reset, DB-Enforced (Addendum 07 v1.1 Approved 6 Okt 2026)

**Rules (Split Quiz — tidak dicampur):**
- Quiz Tempat (`/quiz` → `/result`): **2 quota/hari** (tetap PRD v2.0). Anonymous 1x, login 2x.
- Quiz Makan (`/makan` → `/result-makan`): **5 quota/hari terpisah** (tidak makan quota tempat). Anonymous 2x (cookie `makan_quota_used`), login 5x.
- Each generate: **5 recommendations** (tempat murni / tenant murni, tidak campur 3+2 — dihapus per feedback Agesta).
- Reset: Every day at **00:00 WIB** (UTC+7). Table `user_quota` + `mall_search_quota(user_id, date, used)`.

**Implementation:**

```typescript
// server/api/generate.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const user = event.context.user // from auth middleware
  const sessionId = getCookie(event, 'session_id') // anonymous tracking
  
  // Check quota
  const quota = await checkQuota(user?.id, sessionId)
  
  if (!quota.allowed) {
    if (quota.reason === 'login_required') {
      return { error: 'LOGIN_REQUIRED', message: 'Login untuk generate lagi' }
    }
    if (quota.reason === 'quota_exceeded') {
      return { 
        error: 'QUOTA_EXCEEDED', 
        message: 'Quota habis. Reset besok jam 00:00 WIB',
        reset_at: quota.resetAt
      }
    }
  }
  
  // Generate recommendations
  const recommendations = await generateRecommendations(body)
  
  // Save to DB
  await supabase.from('generations').insert({
    user_id: user?.id,
    session_id: sessionId,
    quiz_input: body,
    recommendations: recommendations
  })
  
  // Increment quota
  if (user) {
    await supabase.rpc('increment_quota', { user_id: user.id })
  } else {
    // Mark anonymous session as used
    setCookie(event, 'quota_used', '1', { maxAge: 86400 }) // 24h
  }
  
  return { recommendations, quota_remaining: quota.remaining - 1 }
})
```

**Quota Check Logic:**

```typescript
async function checkQuota(userId: string | null, sessionId: string) {
  if (!userId) {
    // Anonymous user
    const quotaUsed = getCookie('quota_used')
    if (quotaUsed === '1') {
      return { 
        allowed: false, 
        reason: 'login_required',
        remaining: 0
      }
    }
    return { allowed: true, remaining: 1 }
  }
  
  // Registered user
  const { data } = await supabase
    .from('user_quota')
    .select('quota_used, quota_limit, last_reset_at')
    .eq('user_id', userId)
    .single()
  
  // Check if needs reset
  const now = new Date()
  const lastReset = new Date(data.last_reset_at)
  const hoursSinceReset = (now - lastReset) / (1000 * 60 * 60)
  
  if (hoursSinceReset >= 24) {
    // Reset quota
    await supabase
      .from('user_quota')
      .update({ quota_used: 0, last_reset_at: now })
      .eq('user_id', userId)
    data.quota_used = 0
  }
  
  if (data.quota_used >= data.quota_limit) {
    const resetAt = new Date(lastReset)
    resetAt.setHours(resetAt.getHours() + 24)
    
    return { 
      allowed: false, 
      reason: 'quota_exceeded',
      remaining: 0,
      resetAt: resetAt.toISOString()
    }
  }
  
  return { 
    allowed: true, 
    remaining: data.quota_limit - data.quota_used 
  }
}
```

**Scheduled Reset (Backup):**
```sql
-- Supabase pg_cron extension
SELECT cron.schedule(
  'reset-daily-quotas',
  '0 0 * * *', -- Every day at 00:00 UTC
  $$
  UPDATE user_quota
  SET quota_used = 0, last_reset_at = NOW()
  WHERE last_reset_at < NOW() - INTERVAL '1 day';
  $$
);
```

**Why No Free Regenerates:**
- Simplifies logic (no tracking regenerate count per session)
- Encourages thoughtful quiz input
- Prevents LLM cost explosion from users spamming regenerate
- 2 quota/day already generous (4 quiz attempts over weekend)

**Alternatives Considered:**
- Lifetime quota (10 total) - rejected, poor retention
- 3-5 quota/day - rejected, want to start conservative
- Free regenerates (2x per quiz) - rejected, complexity + cost risk

**Consequences:**
- ✅ Simple to implement and understand
- ✅ Cost-controlled (max 2 LLM calls/user/day)
- ✅ Daily reset drives return behavior
- ⚠️ May feel restrictive to power users (monitor feedback)
- ❌ No flexibility for special cases (unless manual override)

---

## 8. Analytics & Monitoring

### Decision: Google Analytics 4 (GA4)

**Rationale:**
- Completely free, unlimited events
- Industry standard (easy to find help/resources)
- Good dashboard for non-technical users
- Future team members likely already familiar

**Events to Track:**

```typescript
// Page views (automatic)
pageview('/') // Landing
pageview('/quiz') // Quiz started
pageview('/result') // Result viewed

// Custom events
gtag('event', 'quiz_started')

gtag('event', 'quiz_completed', {
  mood: mood,
  budget: budget,
  location: location,
  has_companion: !!companion
})

gtag('event', 'recommendation_generated', {
  is_logged_in: !!user,
  quota_remaining: remaining,
  response_time_ms: responseTime,
  recommendation_count: 5
})

gtag('event', 'recommendation_clicked', {
  recommendation_index: index,
  category: category,
  action: 'view_maps' // or 'save'
})

gtag('event', 'login_prompted', {
  reason: 'quota_limit' // or 'save_favorite'
})

gtag('event', 'user_registered', {
  method: 'email' // or 'google'
})

gtag('event', 'quota_exhausted', {
  user_type: 'registered',
  total_generations_today: 2
})

gtag('event', 'share_clicked', {
  share_method: 'copy_link' // or 'whatsapp', 'instagram'
})
```

**Server-Side Logging (Cost Tracking):**
```typescript
// Log to Supabase for internal analytics
await supabase.from('analytics_events').insert({
  event_type: 'llm_generation',
  user_id: userId,
  session_id: sessionId,
  metadata: {
    model: 'hermes-combo',
    response_time_ms: elapsed,
    success: true,
    cost_estimate: estimatedCost
  }
})
```

**Monitoring Setup:**
- **Vercel Analytics:** Built-in (Web Vitals, performance)
- **Supabase Dashboard:** Database queries, auth events
- **Custom dashboard:** Build simple Next.js app to query `analytics_events` table

**Alerts:**
- Vercel: Email on deployment failure
- Supabase: Email on high database usage (>400MB)
- Custom: Daily email with key metrics (registrations, generations, errors)

**Alternatives Considered:**
- Posthog - free tier limited (1M events), overkill for MVP
- Mixpanel - limited free tier, complex setup
- Amplitude - similar to Mixpanel
- Plausible - privacy-focused but costs $9/month

**Consequences:**
- ✅ Zero cost
- ✅ Unlimited events
- ✅ Easy setup (one script tag)
- ⚠️ Privacy concerns (third-party tracking)
- ❌ Less powerful than Posthog (no cohort analysis, funnels limited)

---

## 9. Hosting & Deployment

### Decision: Vercel (Hobby Tier)

**Rationale:**
- Nuxt 3 zero-config deployment
- Free tier generous:
  - Unlimited deployments
  - 100GB bandwidth/month
  - Serverless functions included
  - Preview deployments per PR
  - Automatic HTTPS
  - Global CDN
- Great DX (Git push → auto deploy)

**Deployment Strategy:**
```yaml
# .github/workflows/deploy.yml (optional, Vercel auto-deploys)
name: Deploy to Vercel
on:
  push:
    branches: [main]
  pull_request:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - uses: vercel/actions@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

**Branch Strategy:**
- `main` → Production (auto-deploy)
- `staging` → Staging environment (auto-deploy)
- Feature branches → Preview URLs (auto-generated)

**Environment Variables (Vercel Secrets):**
```bash
# Production
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=eyJxxx...
SUPABASE_SERVICE_KEY=eyJxxx... # server-side only
HERMES_API_URL=https://9router-endpoint.com
HERMES_API_KEY=sk-...
NUXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Staging (separate Supabase project)
SUPABASE_URL=https://staging-xxx.supabase.co
...
```

**Rollback Strategy:**
- Vercel keeps previous deployments
- One-click rollback in dashboard
- Or: `vercel rollback <deployment-id>`

**Edge Case: LLM Endpoint Local**
- If Hermes-combo is localhost only:
  - Option 1: Deploy Hermes to cloud (Railway, Fly.io, Render)
  - Option 2: Use VPN/tunnel (not recommended for production)
  - Option 3: Fallback to OpenAI API for production

**Alternatives Considered:**
- Netlify - similar to Vercel, slightly less integrated with Nuxt
- Railway - good for full-stack, but Vercel better for frontend
- AWS Amplify - more complex, overkill
- Traditional VPS (DigitalOcean) - requires manual setup, not serverless

**Consequences:**
- ✅ Zero cost for MVP
- ✅ Excellent developer experience
- ✅ Auto-scaling (no capacity planning needed)
- ✅ Global CDN (fast worldwide)
- ⚠️ Vendor lock-in (but migration path exists via Docker)
- ❌ Cold start latency on serverless functions (usually <1s)

---

## 10. Cost Structure

### Monthly Cost Estimate (First 100 Users)

| Service | Free Tier | Usage Estimate | Cost |
|---------|-----------|----------------|------|
| **Vercel Hosting** | 100GB bandwidth | ~2GB (100 users × 20KB avg) | $0 |
| **Supabase** | 500MB DB + 50K MAU | ~50MB + 100 users | $0 |
| **9router API (Hermes)** | ❓ (Need confirmation) | 200 requests (100 users × 2/day) | ❓ |
| **Google Analytics** | Unlimited | Unlimited events | $0 |
| **Domain (optional)** | N/A | 1 domain | ~$15/year |
| **TOTAL** | | | **~$0-15/year** |

**LLM Cost Estimate (if using OpenAI as reference):**
- 100 users × 2 generations/day × 30 days = 6,000 requests/month
- Avg tokens: 1,100 per request (650 prompt + 450 completion)
- GPT-4o-mini: $0.00015/1K input + $0.0006/1K output
- Cost: ~$6/month for 6,000 requests
- **Assuming 9router is similar or lower**

**Break-Even Analysis:**
- If 9router costs ~$0.001/request: ~$6/month at 100 users
- Sustainable up to ~$50/month = 50,000 requests = 833 daily active users
- Monetization trigger: When cost >$50/month or 500+ registered users

**Cost Monitoring:**
```sql
-- Daily cost query
SELECT 
  DATE(created_at) as date,
  COUNT(*) as generations,
  COUNT(*) * 0.001 as estimated_cost_usd
FROM generations
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

---

## 11. Security Considerations

### API Security
```typescript
// Rate limiting (additional layer beyond quota)
import { rateLimit } from '~/server/utils/rate-limit'

export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event)
  const limited = await rateLimit(ip, { max: 10, window: 60000 }) // 10 req/min
  
  if (limited) {
    throw createError({ statusCode: 429, message: 'Too many requests' })
  }
  
  // ... rest of handler
})
```

### Input Validation
```typescript
import { z } from 'zod'

const quizSchema = z.object({
  mood: z.enum(['santai', 'aktif', 'produktif', 'quality-time', 'lainnya']),
  companion: z.enum(['sendiri', 'pasangan', 'teman', 'keluarga-kecil', 'keluarga-besar']),
  budget: z.enum(['hemat', 'menengah', 'leluasa']),
  radius: z.enum(['jabodetabek', 'road-trip', 'lainnya']),
  city: z.string().max(100).optional(),
  time: z.enum(['pagi', 'siang', 'seharian']).optional()
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // Validate & sanitize
  const validated = quizSchema.parse(body)
  
  // ... proceed with validated data
})
```

### Environment Security
- Never expose API keys to client
- Use Vercel environment variables (encrypted)
- Rotate keys if leaked
- Separate staging/production keys

### Database Security
- Row-level security (RLS) enabled
- Users can only access own data
- Service key only used server-side
- Prepared statements (Supabase client handles this)

### Headers
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
    }
  }
})
```

---

## 12. Performance Targets

### Metrics
- **Landing page:**
  - First Contentful Paint (FCP): <1.5s
  - Largest Contentful Paint (LCP): <2.5s
  - Time to Interactive (TTI): <3s

- **Quiz page:**
  - Initial load: <1s
  - Quiz interaction: <300ms

- **Generate flow:**
  - LLM response: <5s (target <3s)
  - Total quiz → result: <6s

- **Result page:**
  - Render: <500ms

### Optimization Strategies
- SSR for landing page (instant FCP)
- Lazy load non-critical components
- Image optimization (Nuxt image module)
- Minimize bundle size (<200KB initial JS)
- Use Vercel Edge Network (global CDN)

### Monitoring
- Vercel Analytics (Web Vitals)
- Google Analytics (page load times)
- Custom timing events

---

## 13. Future Migration Paths

### When to Migrate/Upgrade

**Database (Supabase → Self-hosted PostgreSQL):**
- When: >400MB data or >40K MAU
- How: pg_dump + restore to managed PostgreSQL (AWS RDS, DigitalOcean)
- Effort: Low (standard PostgreSQL)

**Hosting (Vercel → Self-hosted):**
- When: >90GB bandwidth/month or need more control
- How: Docker + Kubernetes or Railway
- Effort: Medium (need DevOps)

**LLM (Hermes-combo → Multiple providers):**
- When: 9router unavailable or quality issues
- How: Abstract LLM client, add fallback providers
- Effort: Low (already abstracted in `llm.ts`)

**Auth (Supabase → Auth0 or custom):**
- When: >40K MAU or need advanced features
- How: Migrate users via API, dual-run period
- Effort: High (careful user migration)

**Monolith → Microservices:**
- When: >10K DAU, need independent scaling
- How: Extract server routes to separate services
- Effort: High (architecture redesign)

---

## Appendix: Decision Summary Table

| Decision Area | Choice | Runner-up | Reason |
|---------------|--------|-----------|--------|
| Frontend | Nuxt 3 | Next.js | Founder prefers Vue, simpler |
| Backend | Nuxt server routes | Express | No separate backend needed |
| Database | Supabase | Firebase | Free tier, built-in auth, PostgreSQL |
| LLM | Hermes-combo | OpenAI GPT-4o-mini | Already available, high quality |
| Auth | Supabase Auth | NextAuth | Built-in, zero setup |
| Quota | Dual: tempat 2/hari + makan 5/hari (Addendum 07 v1.1) | Lifetime quota | Retention > monetization; makan behaviour 2-3x/hari, cost tetap $0 |
| Analytics | Google Analytics 4 | Posthog | Free unlimited, standard tool |
| Hosting | Vercel | Netlify | Best Nuxt integration |
| Deployment | Git push → auto | Manual | Fastest iteration |

---

**Document Status:** APPROVED  
**Next Action:** Proceed to implementation (Project Init)

**Review Schedule:** After soft launch (30 users), review and update based on real data
