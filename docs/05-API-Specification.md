# API Specification - Weekend Planner MVP

**Version:** 1.1 (7 Okt 2026 — patch Addendum 09 v1.3: quota split response + phone optional + voucher claim)
**Date:** October 5, 2026 (asli) + patch 7 Okt 2026
**Base URL:** `https://wikendo-web-app.vercel.app` (Production)  
**Status:** Final + patch v1.3 LOCKED

---

## Overview

Weekend Planner uses Nuxt 3 server routes for all API endpoints. All endpoints are serverless functions deployed on Vercel. Authentication uses Supabase JWT tokens passed via httpOnly cookies.

---

## Table of Contents

1. [Authentication](#authentication)
2. [Endpoints](#endpoints)
3. [Error Handling](#error-handling)
4. [Rate Limiting](#rate-limiting)
5. [Type Definitions](#type-definitions)

---

## Authentication

### Session Management

**Method:** JWT tokens from Supabase Auth, stored in httpOnly cookies

**Headers:**
```
Cookie: sb-access-token=<jwt>; sb-refresh-token=<jwt>
```

**Auth Middleware:**
```typescript
// server/middleware/auth.ts
export default defineEventHandler(async (event) => {
  const path = event.path
  
  // Public routes (no auth required)
  const publicRoutes = ['/api/generate', '/api/health']
  if (publicRoutes.includes(path)) return
  
  // Extract token from cookie
  const token = getCookie(event, 'sb-access-token')
  
  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized: No token provided'
    })
  }
  
  // Verify token with Supabase
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser(token)
  
  if (error || !user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized: Invalid token'
    })
  }
  
  // Attach user to request context
  event.context.user = user
})
```

---

## Endpoints

### 1. Generate Recommendations

**Endpoint:** `POST /api/generate`

**Description:** Generate 5 AI recommendations based on quiz input

**Authentication:** Optional (anonymous allowed for first generation)

**Request Body:**
```typescript
{
  mood: "santai" | "aktif" | "produktif" | "quality-time" | "lainnya",
  companion: "sendiri" | "pasangan" | "teman" | "keluarga-kecil" | "keluarga-besar",
  budget: "hemat" | "menengah" | "leluasa",
  radius: "jabodetabek" | "road-trip" | "lainnya",
  city?: string, // Required if radius = "lainnya"
  time?: "pagi" | "siang" | "seharian",
  child_age?: "balita" | "sd" | "remaja" | "tidak-ada" // If companion = family
}
```

**Response (Success):**
```typescript
{
  success: true,
  recommendations: [
    {
      name: "Taman Menteng",
      category: "outdoor",
      reason: "Cocok untuk quality time berdua dengan suasana tenang",
      estimated_cost: "Rp 50rb - 100rb",
      location_area: "Menteng, Jakarta Pusat",
      best_time: "Sabtu sore (16:00-18:00)",
      confidence: "high"
    }
    // ... 4 more
  ],
  quota_remaining: 1,
  is_logged_in: false
}
```

**Response (Quota Exhausted - Anonymous):**
```typescript
{
  success: false,
  error: "LOGIN_REQUIRED",
  message: "Login untuk generate lagi",
  login_url: "/login"
}
```

**Response (Quota Exhausted - Registered):**
```typescript
{
  success: false,
  error: "QUOTA_EXCEEDED",
  message: "Quota habis. Reset besok jam 00:00 WIB",
  reset_at: "2026-10-06T00:00:00+07:00",
  quota_remaining: 0
}
```

**Response (LLM Error):**
```typescript
{
  success: false,
  error: "GENERATION_FAILED",
  message: "Gagal generate rekomendasi. Coba lagi.",
  retry_allowed: true
}
```

**Status Codes:**
- `200 OK` - Success
- `400 Bad Request` - Invalid input
- `403 Forbidden` - Quota exceeded or login required
- `500 Internal Server Error` - LLM generation failed
- `503 Service Unavailable` - LLM service down

**Implementation:**
```typescript
// server/api/generate.post.ts
import { z } from 'zod'

const quizSchema = z.object({
  mood: z.enum(['santai', 'aktif', 'produktif', 'quality-time', 'lainnya']),
  companion: z.enum(['sendiri', 'pasangan', 'teman', 'keluarga-kecil', 'keluarga-besar']),
  budget: z.enum(['hemat', 'menengah', 'leluasa']),
  radius: z.enum(['jabodetabek', 'road-trip', 'lainnya']),
  city: z.string().max(100).optional(),
  time: z.enum(['pagi', 'siang', 'seharian']).optional(),
  child_age: z.enum(['balita', 'sd', 'remaja', 'tidak-ada']).optional()
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const user = event.context.user
  
  // Validate input
  const validated = quizSchema.parse(body)
  
  // Check quota
  const sessionId = getCookie(event, 'session_id') || generateSessionId()
  const quota = await checkQuota(user?.id, sessionId)
  
  if (!quota.allowed) {
    if (quota.reason === 'login_required') {
      throw createError({
        statusCode: 403,
        data: {
          error: 'LOGIN_REQUIRED',
          message: 'Login untuk generate lagi',
          login_url: '/login'
        }
      })
    }
    
    if (quota.reason === 'quota_exceeded') {
      throw createError({
        statusCode: 403,
        data: {
          error: 'QUOTA_EXCEEDED',
          message: 'Quota habis. Reset besok jam 00:00 WIB',
          reset_at: quota.resetAt
        }
      })
    }
  }
  
  // Generate recommendations
  const recommendations = await generateRecommendations(validated)
  
  // Save to database
  const generation = await saveGeneration({
    user_id: user?.id,
    session_id: sessionId,
    quiz_input: validated,
    recommendations
  })
  
  // Increment quota
  await incrementQuota(user?.id, sessionId)
  
  // Log analytics
  await logEvent({
    event_type: 'llm_generation',
    user_id: user?.id,
    session_id: sessionId,
    metadata: {
      response_time_ms: responseTime,
      success: true
    }
  })
  
  return {
    success: true,
    recommendations,
    quota_remaining: quota.remaining - 1,
    is_logged_in: !!user,
    generation_id: generation.id
  }
})
```

---

### 2. Check Quota Status

**Endpoint:** `GET /api/quota`

**Description:** Get current quota status for user — SPLIT tempat+makan (patch Addendum 09 v1.3).
Dipakai Home wallet 2-state: anon `1 tempat • 2 makan free`, register `2 • 5`.

**Authentication:** Optional

**Query Parameters:** None

**Response (Anonymous):**
```typescript
{
  tempat: { used: 0|1, limit: 1, remaining: 1|0 },
  makan: { used: 0|1|2, limit: 2, remaining: 2|1|0 },
  is_logged_in: false,
  reset_at: null, // cookie-based, reset tengah malam browser
  login_cta: "Login gratis → buka 2 tempat + 5 makan/hari"
}
```

**Response (Registered):**
```typescript
{
  tempat: { used: 1, limit: 2, remaining: 1 },
  makan: { used: 3, limit: 5, remaining: 2 },
  is_logged_in: true,
  reset_at: "2026-10-08T00:00:00+07:00",
  hours_until_reset: 18.5
}
```

**Status Codes:**
- `200 OK` - Success

**Implementation:**
```typescript
// server/api/quota.get.ts (patch Addendum 09 v1.3 — split tempat+makan)
export default defineEventHandler(async (event) => {
  const user = event.context.user

  if (!user) {
    // Anonymous: cookie terpisah (tempat 1x, makan 2x)
    const tempatUsed = getCookie(event, 'quota_used') === '1' ? 1 : 0
    const makanUsed = Math.min(parseInt(getCookie(event, 'makan_quota_used') || '0'), 2)

    return {
      tempat: { used: tempatUsed, limit: 1, remaining: 1 - tempatUsed },
      makan: { used: makanUsed, limit: 2, remaining: 2 - makanUsed },
      is_logged_in: false,
      reset_at: null,
      login_cta: "Login gratis → buka 2 tempat + 5 makan/hari"
    }
  }

  // Registered: user_quota (tempat 2) + mall_search_quota hari ini (makan 5)
  const tempat = await getQuotaStatus(user.id)
  const makan = await getMakanQuotaStatus(user.id) // mall_search_quota WHERE date=CURRENT_DATE

  return {
    tempat: { used: tempat.quota_used, limit: 2, remaining: 2 - tempat.quota_used },
    makan: { used: makan.used, limit: 5, remaining: 5 - makan.used },
    is_logged_in: true,
    reset_at: calculateResetTime(tempat.last_reset_at),
    hours_until_reset: calculateHoursUntilReset(tempat.last_reset_at)
  }
})
```

---

### 3. Get Generation History

**Endpoint:** `GET /api/history`

**Description:** Fetch user's past generations

**Authentication:** Required

**Query Parameters:**
```
?limit=10&offset=0
```

**Response:**
```typescript
{
  generations: [
    {
      id: "uuid",
      quiz_input: {
        mood: "santai",
        companion: "pasangan",
        budget: "menengah",
        radius: "jabodetabek",
        time: "siang"
      },
      recommendations: [...], // Array of 5 recs
      created_at: "2026-10-05T10:30:00Z"
    }
    // ... more
  ],
  total: 25,
  has_more: true
}
```

**Status Codes:**
- `200 OK` - Success
- `401 Unauthorized` - Not logged in

**Implementation:**
```typescript
// server/api/history.get.ts
export default defineEventHandler(async (event) => {
  const user = event.context.user
  
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Login required'
    })
  }
  
  const query = getQuery(event)
  const limit = parseInt(query.limit as string) || 10
  const offset = parseInt(query.offset as string) || 0
  
  const { data, total } = await getGenerationHistory(user.id, limit, offset)
  
  return {
    generations: data,
    total,
    has_more: total > (offset + limit)
  }
})
```

---

### 4. Save Favorite

**Endpoint:** `POST /api/favorites`

**Description:** Save a recommendation to favorites

**Authentication:** Required

**Request Body:**
```typescript
{
  generation_id: "uuid",
  recommendation_index: 0, // 0-4
  notes?: "Pengen coba ini weekend depan"
}
```

**Response:**
```typescript
{
  success: true,
  favorite_id: "uuid",
  message: "Rekomendasi berhasil disimpan"
}
```

**Status Codes:**
- `200 OK` - Success
- `400 Bad Request` - Invalid generation_id or index
- `401 Unauthorized` - Not logged in
- `409 Conflict` - Already favorited

**Implementation:**
```typescript
// server/api/favorites.post.ts
export default defineEventHandler(async (event) => {
  const user = event.context.user
  
  if (!user) {
    throw createError({ statusCode: 401, message: 'Login required' })
  }
  
  const { generation_id, recommendation_index, notes } = await readBody(event)
  
  // Fetch generation
  const generation = await getGeneration(generation_id)
  
  if (!generation || generation.user_id !== user.id) {
    throw createError({ statusCode: 404, message: 'Generation not found' })
  }
  
  if (recommendation_index < 0 || recommendation_index > 4) {
    throw createError({ statusCode: 400, message: 'Invalid index' })
  }
  
  // Save favorite
  const favorite = await saveFavorite({
    user_id: user.id,
    generation_id,
    recommendation_index,
    recommendation_data: generation.recommendations[recommendation_index],
    notes
  })
  
  return {
    success: true,
    favorite_id: favorite.id,
    message: 'Rekomendasi berhasil disimpan'
  }
})
```

---

### 5. Get Favorites

**Endpoint:** `GET /api/favorites`

**Description:** Fetch user's saved favorites

**Authentication:** Required

**Query Parameters:**
```
?limit=20&offset=0
```

**Response:**
```typescript
{
  favorites: [
    {
      id: "uuid",
      recommendation: {
        name: "Taman Menteng",
        category: "outdoor",
        reason: "...",
        estimated_cost: "Rp 50rb - 100rb",
        location_area: "Menteng, Jakarta Pusat",
        best_time: "Sabtu sore"
      },
      notes: "Pengen coba ini weekend depan",
      created_at: "2026-10-05T11:00:00Z"
    }
    // ... more
  ],
  total: 8,
  has_more: false
}
```

**Status Codes:**
- `200 OK` - Success
- `401 Unauthorized` - Not logged in

---

### 6. Register User

**Endpoint:** `POST /api/auth/register`

**Description:** Create new user account (patch Addendum 09 v1.3: phone OPTIONAL)

**Authentication:** None

**Request Body:**
```typescript
{
  email: "agesta@example.com",
  password: "SecurePass123!",
  phone?: "+628123456789" // OPTIONAL — NULL = valid, format +62 divalidasi HANYA kalau diisi
}
```

**Response:**
```typescript
{
  success: true,
  user: {
    id: "uuid",
    email: "agesta@example.com"
  },
  message: "Registrasi berhasil"
}
```

**Status Codes:**
- `201 Created` - Success
- `400 Bad Request` - Invalid input
- `409 Conflict` - Email already exists

**Implementation:**
```typescript
// server/api/auth/register.post.ts
export default defineEventHandler(async (event) => {
  const { email, password, phone } = await readBody(event)

  // Validate (patch Addendum 09 v1.3: phone OPTIONAL)
  if (!email || !password) {
    throw createError({ statusCode: 400, message: 'Email + password wajib' })
  }

  const cleanPhone = phone?.trim() ? phone.trim() : null
  if (cleanPhone && !/^\+62[0-9]{9,13}$/.test(cleanPhone)) {
    throw createError({ statusCode: 400, message: 'Format HP: +62...' })
  }

  // Create user in Supabase
  const supabase = createServiceClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { phone: cleanPhone }
    }
  })

  if (error) {
    throw createError({ statusCode: 409, message: error.message })
  }

  // Initialize user profile & quota (tempat 2 + makan 5 hari ini)
  await initializeNewUser(data.user.id, cleanPhone)
  
  // Set session cookie
  setCookie(event, 'sb-access-token', data.session.access_token, {
    httpOnly: true,
    secure: true,
    maxAge: 3600
  })
  
  return {
    success: true,
    user: {
      id: data.user.id,
      email: data.user.email
    },
    message: 'Registrasi berhasil'
  }
})
```

---

### 7. Login User

**Endpoint:** `POST /api/auth/login`

**Description:** Authenticate existing user

**Authentication:** None

**Request Body:**
```typescript
{
  email: "agesta@example.com",
  password: "SecurePass123!"
}
```

**Response:**
```typescript
{
  success: true,
  user: {
    id: "uuid",
    email: "agesta@example.com"
  },
  message: "Login berhasil"
}
```

**Status Codes:**
- `200 OK` - Success
- `401 Unauthorized` - Invalid credentials

---

### 8. Logout User

**Endpoint:** `POST /api/auth/logout`

**Description:** End user session

**Authentication:** Required

**Request Body:** None

**Response:**
```typescript
{
  success: true,
  message: "Logout berhasil"
}
```

**Status Codes:**
- `200 OK` - Success

---

### 9. Health Check

**Endpoint:** `GET /api/health`

**Description:** Service health status

**Authentication:** None

**Response:**
```typescript
{
  status: "ok",
  timestamp: "2026-10-05T06:03:13.666Z",
  services: {
    database: "ok",
    llm: "ok"
  }
}
```

**Status Codes:**
- `200 OK` - All services healthy
- `503 Service Unavailable` - Degraded

---

## Error Handling

### Standard Error Response

All errors follow this format:

```typescript
{
  statusCode: 400 | 401 | 403 | 404 | 409 | 500 | 503,
  message: "Human-readable error message",
  error?: "ERROR_CODE", // Optional machine-readable code
  details?: any // Optional additional context
}
```

### Error Codes

| Code | HTTP Status | Meaning |
|------|-------------|---------|
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `UNAUTHORIZED` | 401 | Not logged in |
| `LOGIN_REQUIRED` | 403 | Anonymous quota exhausted |
| `QUOTA_EXCEEDED` | 403 | Registered quota exhausted |
| `NOT_FOUND` | 404 | Resource doesn't exist |
| `ALREADY_EXISTS` | 409 | Duplicate resource |
| `GENERATION_FAILED` | 500 | LLM error |
| `SERVICE_UNAVAILABLE` | 503 | External service down |

---

## Rate Limiting

### Strategy

**Per-IP Rate Limit:** 60 requests per minute (additional layer beyond quota)

**Implementation:**
```typescript
// server/middleware/rate-limit.ts
import { RateLimiterMemory } from 'rate-limiter-flexible'

const rateLimiter = new RateLimiterMemory({
  points: 60, // requests
  duration: 60 // per 60 seconds
})

export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event, { xForwardedFor: true })
  
  try {
    await rateLimiter.consume(ip)
  } catch {
    throw createError({
      statusCode: 429,
      message: 'Too many requests. Please try again later.'
    })
  }
})
```

**Response (Rate Limited):**
```typescript
{
  statusCode: 429,
  message: "Too many requests. Please try again later.",
  retry_after: 30 // seconds
}
```

---

## Type Definitions

### TypeScript Types

```typescript
// types/quiz.ts
export type Mood = 'santai' | 'aktif' | 'produktif' | 'quality-time' | 'lainnya'
export type Companion = 'sendiri' | 'pasangan' | 'teman' | 'keluarga-kecil' | 'keluarga-besar'
export type Budget = 'hemat' | 'menengah' | 'leluasa'
export type Radius = 'jabodetabek' | 'road-trip' | 'lainnya'
export type Time = 'pagi' | 'siang' | 'seharian'
export type ChildAge = 'balita' | 'sd' | 'remaja' | 'tidak-ada'

export interface QuizInput {
  mood: Mood
  companion: Companion
  budget: Budget
  radius: Radius
  city?: string
  time?: Time
  child_age?: ChildAge
}

export interface Recommendation {
  name: string
  category: string
  reason: string
  estimated_cost: string
  location_area: string
  best_time: string
  confidence: 'high' | 'medium' | 'low'
}

export interface GenerateResponse {
  success: boolean
  recommendations?: Recommendation[]
  quota_remaining?: number
  is_logged_in?: boolean
  generation_id?: string
  error?: string
  message?: string
  reset_at?: string
}

export interface QuotaStatus {
  tempat: { used: number; limit: 2 | 1; remaining: number }, // register 2, anon 1
  makan: { used: number; limit: 5 | 2; remaining: number }, // register 5, anon 2
  is_logged_in: boolean
  reset_at: string | null
  hours_until_reset?: number
  login_cta?: string // anon only: "Login gratis → buka 2 tempat + 5 makan/hari"
}
```

---

## Testing

### Example cURL Requests

**Generate Recommendation (Anonymous):**
```bash
curl -X POST https://wikendo-web-app.vercel.app/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "mood": "santai",
    "companion": "pasangan",
    "budget": "menengah",
    "radius": "jabodetabek",
    "time": "siang"
  }'
```

**Check Quota:**
```bash
curl https://wikendo-web-app.vercel.app/api/quota
```

**Register:**
```bash
curl -X POST https://wikendo-web-app.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!",
    "phone": "+628123456789"
  }'
```

---

## API Versioning

**Current:** No versioning (MVP)

**Future:** When breaking changes needed:
- Add `/api/v2/` prefix
- Maintain v1 for 6 months
- Deprecation warnings in headers

---

## Addendum 07 v1.1 (Approved 6 Okt 2026) — Makan Endpoints (9 endpoint tempat TIDAK berubah)

### 10. List Malls — `GET /api/malls`
Public. Response: `[{slug, name, city, area, total_tenant, maps_url}]`.

### 11. Mall Detail — `GET /api/malls/:slug`
Public. Response: mall + stats `{total, halal_count, by_budget}`.

### 12. List Tenants — `GET /api/malls/:slug/tenants?halal=true&budget=hemat&mission=nongkrong_lama&kids=true&search=kopi`
Public, tanpa quota/LLM. Filter di Supabase. Response: array tenant `{id, name, category, lantai, halal, budget_tier, price_range, kids_friendly, mission, hype_tiktok, is_open, maps_url}`.

### 13. Makan Recommend — `POST /api/makan/recommend`
Body `MakanQuizInput {mall_slug, mission, budget_tier, companion, halal_only?, kids_friendly?}`. Flow: cek quota makan (anon cookie max 2, login 5/hari) → filter Supabase `WHERE mall=slug AND is_open AND budget AND (halal if halal_only)` → LLM ranking Top 5 + reason 1 kalimat → save `generations {type:'makan'}` → increment `mall_search_quota`. Quota habis → 403 `MAKAN_QUOTA_EXCEEDED` (tidak ganggu quota tempat).

### 14. Vote — `POST /api/vote`
Body `{generation_id, tenant_id}`. Tanpa login, rate-limit IP 10/menit. Untuk group vote link `/vote/:id`.

### 15. Report Tenant — `POST /api/report-tenant`
Body `{tenant_id, issue: 'tutup'|'buka'|'salah_info'}`. Tanpa login. Masuk review queue (freshness > completeness).

### 16. Claim Voucher — `POST /api/voucher/claim` (BARU — Addendum 09 v1.3, WAJIB login)
KENAPA wajib login? Voucher = duit tenant. Anon bisa bikin 100 akun → borong voucher. Login = 1 user 1 klaim/tenant/hari.
Body `{tenant_id}`. Auth: Required (anon → 401 + bottom sheet login "Login buat klaim voucher").
Flow: cek tenant ada promo aktif → cek `voucher_claims` belum ada (user_id, tenant_id, today) → generate code `WIK-XXXXX` → insert → return code + cara pakai ("Tunjukin ke kasir").
Double-klaim hari sama → 409 `ALREADY_CLAIMED`. Response: `{success, code, tenant_name, cara_pakai}`.

---

**Document Status:** FINAL + patch v1.3 LOCKED
**Last Updated:** October 7, 2026 (patch Addendum 09 v1.3)
**Next Review:** After soft launch feedback
