# PRD — Weekend Planner: Decision Engine App

**Version:** 2.0 (Updated after validation)  
**Date:** October 5, 2026  
**Status:** Final for MVP Development  
**Owner:** Agesta (Founder & Solo Developer)

---

## Executive Summary

Weekend Planner is a mobile-first web app that solves **decision fatigue** for weekend planning. Instead of overwhelming users with information, we take over the decision by generating 5 personalized venue/activity recommendations based on a 30-second quiz.

**Core Value Prop:** "Answer 5 questions → Get 5 perfect weekend spots"

---

## 1. Problem Statement

### The Real Problem
Users aren't lacking information about weekend destinations — Google Maps, Instagram, and TikTok provide endless options. The real problem is **decision fatigue**: too many choices without a system to decide which option fits their current mood, budget, and context.

### Evidence
- Survey feedback: 87% of respondents said "too many choices" is the main blocker
- Existing solutions (curated lists, social recommendations) require manual filtering
- No tool that "decides for you" based on context

---

## 2. Target Users

### Primary
- **Demographics:** 20-35 years old, urban, middle income
- **Psychographics:** Value convenience over exhaustive research
- **Behavior:** Uses smartphone for planning, decides last-minute
- **Pain:** Spends 30+ minutes scrolling without deciding

### Secondary (Post-MVP)
- Event planners looking for venue recommendations
- Corporate teams planning team building
- Tourism boards promoting local destinations

---

## 3. Goals & Success Metrics

### North Star Metric
**Weekly Active Recommendation Completions**  
= Users who complete quiz → view recommendations → take action (view maps/save)

### Key Metrics

**Acquisition:**
- Landing page → Quiz start conversion: >40%
- Organic word-of-mouth coefficient: >0.2

**Engagement:**
- Quiz completion rate: >70%
- Recommendation click-through (Google Maps): >50%
- Regenerate rate: 20-35% (balance quality vs. dissatisfaction)

**Retention:**
- Day 2 return rate: >30%
- Day 7 return rate: >20%
- Weekly active users (WAU) growth: >15% week-over-week

**Quality Indicators:**
- Avg time on result page: >60 seconds
- Share rate: >5%
- Qualitative feedback sentiment: >70% positive

---

## 4. Scope - MVP Features

### Must-Have (P0)

#### 1. Quiz Flow
- **5-6 questions** (30-45 seconds to complete)
- Input dimensions:
  - Mood/vibe (santai, aktif, produktif, quality time)
  - Companion (sendiri, pasangan, teman, keluarga)
  - Budget per person (hemat <100k, menengah 100-300k, leluasa >300k)
  - Location scope (Jabodetabek, road trip, custom)
  - Time preference (pagi, siang, seharian) - optional
  - Child age (conditional, if family selected)

#### 2. AI Recommendation Engine
- Generate **5 recommendations** per quiz
- Powered by **Hermes-combo LLM** (via 9router API)
- Output format: JSON with name, category, reason, cost, location, best time

#### 3. Result Display
- **5 recommendation cards** with:
  - Venue/activity name
  - Category badge (cafe, outdoor, kuliner, etc.)
  - Personalized reason why it fits
  - Budget estimate (range)
  - Location area
  - Best time to visit
- Actions per card:
  - "Lihat di Google Maps" (external link)
  - "Simpan" (requires login)

#### 4. Authentication
- **Email + Password** registration
  - Collect: email, password, phone number
- **Google OAuth** (Supabase Auth)
- Anonymous users can use 1 quota before forced login

#### 5. Quota System
- **2 quota per user per day** (reset at 00:00 WIB)
- Anonymous: 1 quota (must login for quota #2)
- Registered: Full 2 quota access
- After exhausted: Show countdown to reset + history/share options
- **No regenerate with same quiz input** (each generate counts as quota)

#### 6. Analytics Tracking
- Google Analytics 4 integration
- Track: page views, quiz completions, generations, auth events, quota exhaustion

### Should-Have (P1 - Post-Soft Launch)

- View recommendation history (logged-in users)
- Save favorites (logged-in users)
- Share result page via link
- Improved mobile UX (swipeable cards, bottom sheet modals)

### Won't Have (Out of Scope for MVP)

- ❌ Booking/reservation integration
- ❌ User reviews or ratings
- ❌ Real-time venue availability
- ❌ Photo uploads from users
- ❌ Social features (follow, comments)
- ❌ Premium/paid tier
- ❌ Personalization based on history (simple history view only)

---

## 5. Technical Approach

### Stack
- **Frontend:** Nuxt 3 (Vue 3, TypeScript, Tailwind CSS)
- **Backend:** Nuxt Server Routes (serverless functions)
- **Database:** Supabase (PostgreSQL + Auth)
- **LLM:** Hermes-combo via 9router API
- **Analytics:** Google Analytics 4
- **Hosting:** Vercel (frontend + serverless)

### Architecture Pattern
- Monolithic Nuxt app (server + client in one repo)
- SSR for landing page (SEO)
- CSR for quiz and result pages (interactivity)
- API routes for LLM calls and database access

### Security
- API keys stored in Vercel environment variables
- Row-level security (RLS) on Supabase
- Rate limiting: 2 quota/day per user (DB-enforced)
- Input sanitization on all user inputs

---

## 6. User Flows

### Anonymous User (First Visit)
1. Land on homepage → Click "Mulai Quiz"
2. Complete 5-6 question quiz (30-45s)
3. Generate → Wait 3-5s → View 5 recommendations
4. Take action: View maps, or try to save (→ login prompt)
5. Want 2nd generation → Must login

### Registered User
1. Login → Complete quiz
2. Generate (quota 1/2 used)
3. View results → Take action
4. Want more → Generate again (quota 2/2 used)
5. Quota exhausted → See countdown to reset + history/share options
6. Return next day → Quota reset to 2/2

### Error/Edge Cases
- LLM generation fails → Show error, don't count quota, allow retry
- Network timeout → Show error, allow retry
- User clears localStorage → Lose anonymous session, can generate again
- User shares result link → Others can view (read-only)

---

## 7. Constraints & Assumptions

### Constraints
- **Budget:** Limited (bootstrapped, no external funding yet)
- **Team:** Solo founder + AI assistants
- **Timeline:** MVP launch target: 2-3 weeks
- **LLM Cost:** Must stay <Rp 500k/month for first 100 users

### Assumptions
- Hermes-combo LLM has sufficient knowledge of Indonesian venues
- 2 quota/day is enough for casual weekend planning
- Daily reset drives habit formation (return behavior)
- Users trust AI-generated recommendations without photos
- Phone number collection doesn't hurt conversion

### Validation Plan
- Soft launch to 30-50 users (personal network)
- Monitor metrics for 2 weeks
- Interview 10 users for qualitative feedback
- Iterate based on data before scaling

---

## 8. Monetization Strategy (Deferred)

**MVP Approach:** Pure free model, daily reset, no paywalls

**Future Monetization (Post-PMF):**
- **Freemium:** Free tier (2/day) + Premium (unlimited, Rp 29-49k/month)
- **B2B:** Corporate event planning tier
- **Partnerships:** Commission from venue bookings
- **Sponsored recs:** Venues pay to be featured (clearly marked)

**Decision Trigger (Add monetization when):**
- 500+ registered users
- 30%+ DAU/MAU ratio
- 20%+ weekly retention
- Or LLM cost exceeds budget

---

## 9. Non-Functional Requirements

### Performance
- Initial page load: <2s (mobile 3G)
- Quiz interaction: <300ms response time
- LLM generation: <5s (target <3s)
- Result page render: <1s

### Reliability
- Uptime: >99.5% (Vercel SLA)
- Error rate: <1% of requests
- Graceful degradation on LLM failures

### Security
- HTTPS everywhere
- No secrets in client code
- Secure session management (httpOnly cookies)
- Input validation and sanitization
- Rate limiting on API endpoints

### Usability
- Mobile-first design (80% of traffic expected)
- WCAG AA compliance target
- Support for Indonesian language
- Works on Chrome, Safari, Firefox (latest 2 versions)

### Scalability
- Support 1000 concurrent users (Vercel auto-scales)
- Database can handle 10K users (Supabase free tier: 50K MAU)
- Horizontal scaling path via Vercel edge functions

---

## 10. Open Questions & Risks

### Open Questions
1. **Email verification:** Required or optional on registration?
2. **LLM prompt quality:** Will real-world recommendations be accurate enough?
3. **Optimal quota:** Is 2/day too little or too much?
4. **Domain:** Custom domain or vercel.app subdomain for launch?

### Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| LLM hallucination (fake venues) | High | Medium | Prompt engineering + "generic type" fallback |
| LLM cost explosion | High | Low | Hard rate limit (2/day), monitor daily |
| Low conversion (landing → quiz) | High | Medium | A/B test copy, improve value prop clarity |
| Poor recommendation quality | High | Medium | Iteration on system prompt, collect feedback |
| Slow LLM response (>5s) | Medium | Low | Set timeout, show better loading UX |
| User abuse (multiple accounts) | Low | Medium | Phone number + IP tracking |

---

## 11. Launch Plan

### Phase 1: Validation (Week 1-2)
- Build MVP (all P0 features)
- Internal testing (founder + AI)
- Deploy to staging

### Phase 2: Soft Launch (Week 3)
- Invite 30-50 users from personal network
- Monitor analytics daily
- Fix critical bugs
- Collect qualitative feedback

### Phase 3: Iteration (Week 4-5)
- Implement P1 features based on feedback
- Improve LLM prompt based on quality issues
- Optimize conversion funnel

### Phase 4: Public Launch (Week 6+)
- Announce on social media (LinkedIn, Twitter, Instagram)
- Product Hunt launch
- Local tech community (Telegram groups, Discord)
- Organic growth via word-of-mouth

---

## 12. Success Criteria (6 Weeks Post-Launch)

**Minimum Viable Success:**
- 200+ registered users
- 30%+ daily active users
- 25%+ day-7 retention
- 60%+ quiz completion rate
- 40%+ recommendation click-through rate

**Strong Success:**
- 500+ registered users
- 40%+ daily active users
- 30%+ day-7 retention
- 75%+ quiz completion rate
- 60%+ recommendation click-through rate
- Organic virality (>0.3 viral coefficient)

**Decision Point:**
- If minimum viable success → Continue, add P1 features
- If strong success → Scale, consider monetization
- If below minimum → Pivot or iterate heavily

---

## 13. Appendix

### Definitions
- **DAU/MAU:** Daily Active Users / Monthly Active Users (engagement metric)
- **Viral Coefficient:** # of new users referred by each existing user
- **PMF (Product-Market Fit):** When product solves real problem & users keep coming back

### References
- Original PRD v1.0 (dated earlier)
- Survey results (feedback validation)
- User journey documentation
- ADR (Architecture Decision Record)

---

**Document Status:** APPROVED for development  
**Next Steps:** Generate remaining documentation (ADR, schema, API spec) → Begin development

---

**Change Log:**
- v2.0 (Oct 5, 2026): Updated quota system (2/day, daily reset, no monetization MVP)
- v1.0 (Earlier): Initial draft with 4+6 quota system
