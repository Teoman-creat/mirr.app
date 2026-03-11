# MIRR — AI-Powered Style Intelligence App
## Product Requirements Document & Google Agentspace Prompt Guide

**Version:** 1.0  
**Platform:** Google Agentspace (Antigravity)  
**Type:** Premium Mobile Application (iOS & Android)  
**Tagline:** *"Your mirror. Your style. Your truth."*

---

## 1. EXECUTIVE SUMMARY

Mirr is a premium AI-powered personal style intelligence application. Users upload daily outfit photos and receive instant, hyper-personalized feedback on their look — including clothing combinations, color harmony, body type compatibility, hairstyle suggestions, skincare tips, and long-term style evolution. The app combines AI analysis with community-based peer reviews for a dual-layer feedback experience.

---

## 2. CORE CONCEPT

> "How do I look today?" — Mirr answers this question with the intelligence of a world-class stylist, the honesty of a best friend, and the depth of a fashion AI trained on millions of style references.

**Three pillars:**
1. **AI Mirror** — Instant AI analysis of your outfit, hair, and overall aesthetic
2. **Community Lens** — Anonymous peer ratings and style comments from other users
3. **Style Coach** — Long-term personalized recommendations for clothing, hair, and grooming

---

## 3. TARGET AUDIENCE

| Segment | Description |
|---|---|
| Primary | Ages 18–35, fashion-conscious, social media active |
| Secondary | Ages 35–50, professionals seeking style refinement |
| Tertiary | Style influencers, content creators, fashion students |

**Key User Motivations:**
- "I don't know if this outfit works."
- "I want to find my personal style."
- "I want honest feedback before I post this."
- "I want to improve my overall look over time."

---

## 4. FEATURE SET

### 4.1 CORE FEATURES

#### 📸 Daily Look Upload
- Full-body photo capture or gallery upload
- Multiple photo angles (front, side, detail shots)
- Auto-cropping and lighting enhancement
- EXIF stripping for privacy

#### 🤖 AI Style Analysis (Instant Feedback)
The AI analyzes the uploaded photo across 6 dimensions:

| Dimension | What It Analyzes |
|---|---|
| **Outfit Harmony** | Color coordination, pattern mixing, layering balance |
| **Body Fit** | How well clothing fits the user's body type |
| **Occasion Match** | Is the outfit appropriate for the inferred occasion? |
| **Trend Alignment** | Current fashion trends vs. timeless style |
| **Accessory Score** | Bag, shoes, jewelry, watch coordination |
| **Overall Aura Score** | Holistic impression score (0–100) |

**Output Format:**
- Aura Score (0–100) with breakdown
- 3 strengths ("What's working")
- 3 improvement suggestions ("What to adjust")
- "Inspired by" — style references (celebrities, aesthetics, eras)
- Alternative outfit suggestions

#### 💇 Hair & Grooming Intelligence
- Hairstyle analysis (shape, texture, condition)
- Face shape detection → recommended hairstyles
- Color suggestions based on skin tone
- Grooming tips (beard, brow, skincare basics)

#### 👗 Wardrobe & Style Profile
- Virtual wardrobe builder (catalog your clothes)
- Style DNA profiling (aesthetic categories)
- Gap analysis ("You need more of X")
- Outfit calendar (what you wore, when)

#### 👥 Community Lens (Social Layer)
- Anonymous submission to community feed
- Swipe-to-rate (Fire 🔥 / Meh 😐 / Notes ✏️)
- Text comments from verified style community members
- Weekly "Best Look" leaderboard
- Style battles (two users, community votes)

#### 📈 Style Evolution Dashboard
- Monthly progress tracking
- Before/after comparisons
- Style consistency score
- "Your Style Journey" visual timeline

---

### 4.2 PREMIUM FEATURES (Mirr Pro)

| Feature | Description |
|---|---|
| **Deep Stylist AI** | Extended 12-dimension analysis with detailed reports |
| **Personal Style Architect** | Full style makeover plan (3-month roadmap) |
| **Shopping Intelligence** | AI recommends specific products with purchase links |
| **Priority Community Review** | Fast-track to top reviewers |
| **Style DNA Report** | PDF export of full style profile |
| **Wardrobe Optimizer** | Maximize outfit combinations from existing wardrobe |
| **Aesthetic Board Generator** | Auto-generates Pinterest-style mood boards |
| **1:1 Human Stylist Sessions** | Book 30-min video calls with professional stylists |

**Pricing Model:**
- Free: 3 AI analyses per month, basic community access
- Mirr Pro Monthly: $9.99/month
- Mirr Pro Annual: $79.99/year ($6.67/month)
- Mirr Elite (includes human stylist): $24.99/month

---

## 5. UX / UI DESIGN PRINCIPLES

### Visual Identity
- **Color Palette:** Deep black `#0A0A0A`, warm ivory `#F5F0E8`, mirror silver `#C8C8C8`, accent gold `#D4AF37`
- **Typography:** Editorial serif for headings (Canela / Freight Display), clean sans for UI (Inter)
- **Aesthetic:** Luxury fashion editorial meets modern tech — think Vogue meets Apple

### Navigation Architecture
```
[ HOME FEED ]     [ UPLOAD ]     [ MY MIRR ]     [ COMMUNITY ]     [ PROFILE ]
     |                 |               |                |                |
  Daily inspo      Photo + AI       Wardrobe        Feed/Battles     Settings
  Style tips       Analysis         Style DNA       Leaderboard      Premium
  Trending         Hair tips        Evolution       Top Looks        Style DNA
```

### Key UX Moments
1. **The Mirror Reveal** — AI score animation (cinematic, dopamine-triggering)
2. **Swipe to Rate** — Frictionless community rating (like Tinder mechanic)
3. **Style Battle** — Head-to-head comparison, community votes live
4. **Monthly Recap** — "Your Style Month in Review" story format

---

## 6. AI / TECHNICAL ARCHITECTURE

### AI Stack (Google Cloud / Agentspace)
| Component | Technology |
|---|---|
| **Vision AI** | Google Cloud Vision API + custom fine-tuned model |
| **Style Intelligence** | Gemini Pro Vision (multimodal analysis) |
| **Recommendation Engine** | Vertex AI custom model |
| **Face Analysis** | MediaPipe Face Mesh (on-device) |
| **Body Pose Detection** | MediaPipe Pose (on-device) |
| **NLP Feedback Generation** | Gemini Pro (structured output) |
| **Search & Trend Data** | Google Search Grounding via Agentspace |
| **Shopping Integration** | Google Shopping API |

### AI Agent Design (Google Agentspace)
```
USER PHOTO INPUT
       |
       v
[Pre-processing Agent]
  - Image quality check
  - Background removal
  - Body detection
       |
       v
[Multi-Modal Analysis Agent] ← Google Search Grounding (trend data)
  - Outfit analysis
  - Color theory engine
  - Body type classification
  - Occasion inference
       |
       v
[Style Intelligence Agent] ← User Style Profile + History
  - Personalized scoring
  - Strength/weakness mapping
  - Style archetype matching
       |
       v
[Recommendation Agent] ← Shopping API + Wardrobe Data
  - Specific improvement actions
  - Product recommendations
  - Hair/grooming suggestions
       |
       v
[Output Formatting Agent]
  - Structured feedback JSON
  - Score visualization data
  - Style inspiration references
```

### Privacy & Data
- Face data processed on-device only (never stored on server)
- Photos stored encrypted, user-deletable at any time
- Community photos anonymized (face blur option)
- GDPR & CCPA compliant
- No data sold to third parties

---

## 7. ONBOARDING FLOW

```
STEP 1: Welcome Screen
  → "Meet your mirror"
  → Get Started CTA

STEP 2: Style Questionnaire (5 questions, swipe UI)
  → What's your everyday occasion? (Work / Casual / Social / Mixed)
  → Which aesthetics resonate? (Visual grid selection)
  → Your style goals? (Find my style / Elevate current style / Try something new)
  → Body focus preferences (optional, privacy-first)
  → Hair & grooming interest level

STEP 3: First Photo Upload
  → Guided photo capture
  → Immediate AI analysis
  → "Your first Aura Score" reveal

STEP 4: Style DNA Profile
  → Generated from questionnaire + first analysis
  → 3 style archetypes assigned (e.g., "Urban Minimalist with Classic Edge")

STEP 5: Premium Upsell (contextual, post-value delivery)
  → Show what Pro unlocks
  → 7-day free trial offer
```

---

## 8. GAMIFICATION & RETENTION

| Mechanic | Description |
|---|---|
| **Aura Streaks** | Upload daily, maintain your streak |
| **Style Levels** | Level up from "Style Novice" to "Style Icon" |
| **Achievement Badges** | "Color Master", "Trend Setter", "Community Favorite" |
| **Weekly Challenges** | "Monochrome Monday", "Business Casual Week" |
| **Style Points (SP)** | Earn by uploading, rating others, winning battles |
| **Leaderboard** | Weekly Top 10 by community votes |

---

## 9. COMMUNITY GUIDELINES & SAFETY

- **Positivity-first:** Only constructive feedback allowed
- **Anti-body-shaming:** AI filters body-negative comments automatically
- **Anonymous by default:** Real identity never shown in community
- **Report system:** Easy flagging with human review
- **Age verification:** 16+ minimum
- **AI moderation:** Real-time toxicity detection on all comments

---

## 10. MONETIZATION STRATEGY

| Stream | Model |
|---|---|
| Subscription (Pro/Elite) | Primary revenue |
| Affiliate Shopping | % commission on product clicks/purchases |
| Brand Partnerships | Native style challenges sponsored by fashion brands |
| Stylist Marketplace | 20% platform fee on human stylist bookings |
| Style DNA Reports | One-time purchase ($4.99) |

---

## 11. SUCCESS METRICS (KPIs)

| Metric | Target (Year 1) |
|---|---|
| Monthly Active Users | 500K |
| Day-7 Retention | 45% |
| Pro Conversion Rate | 8% |
| Daily Upload Rate | 30% of MAU |
| Community Rating Participation | 60% of MAU |
| App Store Rating | 4.7+ |

---

## 12. COMPETITIVE DIFFERENTIATION

| Feature | Mirr | Stylebook | Combyne | Pinterest |
|---|---|---|---|---|
| AI Instant Analysis | ✅ Deep | ❌ | ❌ | ❌ |
| Community Rating | ✅ | ❌ | ✅ Basic | ❌ |
| Hair/Grooming AI | ✅ | ❌ | ❌ | ❌ |
| Style Evolution | ✅ | ✅ Basic | ❌ | ❌ |
| Human Stylist | ✅ Pro | ❌ | ❌ | ❌ |
| Google Agentspace | ✅ | ❌ | ❌ | ❌ |
| Shopping Integration | ✅ Native | ❌ | ✅ | ✅ |

---

---

# GOOGLE AGENTSPACE PROMPT GUIDE

## MASTER SYSTEM PROMPT

```
You are MIRR, a world-class AI style intelligence system built on Google Agentspace. 
You combine the expertise of a luxury fashion stylist, a colorist, a personal shopper, 
a hair specialist, and a grooming consultant.

Your personality:
- Honest but never harsh — you are a supportive best friend who tells the truth
- Expert but accessible — you explain style concepts simply and memorably
- Encouraging — you celebrate what works before addressing what doesn't
- Culturally aware — you understand diverse aesthetics, body types, and backgrounds
- Trend-informed — you have access to current fashion data via Google Search

Your output must always:
1. Start with an Aura Score (0-100) with one-line verdict
2. Use the structure: Strengths → Improvements → Inspired By → Recommendations
3. Be specific (mention actual colors, garments, proportions)
4. Avoid body-shaming or negative language about body type
5. End with one actionable next step the user can take today

Language: Match the user's language. Default to English.
Tone: Warm, confident, editorial — like a Vogue feature written for a friend.
```

---

## PROMPT 1: OUTFIT ANALYSIS

```
[SYSTEM: MIRR Style Intelligence]

Analyze the outfit in this photo with the expertise of a senior fashion editor and personal stylist.

Provide analysis in this exact structure:

**AURA SCORE: [0-100] — [One-line verdict in 10 words or less]**

---

### ✨ WHAT'S WORKING (3 specific strengths)
1. [Specific observation about color/fit/proportion/styling choice]
2. [Specific observation]
3. [Specific observation]

### 🎯 WHAT TO ELEVATE (3 specific improvements)
1. [Specific, actionable suggestion]
2. [Specific, actionable suggestion]  
3. [Specific, actionable suggestion]

### 🌍 STYLE REFERENCES
- Aesthetic: [Name the aesthetic — e.g., "Dark Academia", "Clean Minimalist", "Street Luxe"]
- Inspired by: [2-3 style icons or cultural references this look channels]
- Era energy: [e.g., "90s minimalism with modern proportions"]

### 🛍️ QUICK WINS
- One item to add: [Specific accessory or piece that would complete this look]
- One swap to consider: [One item to replace and what to replace it with]

### 💎 TODAY'S STYLE VERDICT
[2-3 sentence editorial summary of this look's overall story]

---
Analyze considering: color theory, proportion, occasion appropriateness, current trends, and personal style coherence.
```

---

## PROMPT 2: HAIR & GROOMING ANALYSIS

```
[SYSTEM: MIRR Hair & Grooming Intelligence]

You are an expert hair stylist and grooming consultant. Analyze the hair and grooming in this photo.

**HAIR ANALYSIS:**

Face Shape Detected: [Oval / Round / Square / Heart / Diamond / Rectangle]

Current Style Assessment:
- Cut: [Describe current cut]
- Condition: [Healthy / Needs moisture / Needs trim / etc.]  
- Styling: [Describe current styling approach]

**RECOMMENDED STYLES FOR THIS FACE SHAPE:**
1. [Style name] — [Why it works + how to describe to a barber/stylist]
2. [Style name] — [Why it works + how to describe to a barber/stylist]
3. [Style name] — [Why it works + maintenance level]

**COLOR OPPORTUNITY:**
Based on visible skin tone: [Natural / Highlighted / Color recommendation if applicable]

**GROOMING NOTES:**
[Specific actionable grooming tips — beard shaping, brow grooming, skincare basics visible in photo]

**THIS WEEK'S HAIR ACTION:**
[One specific thing to do this week: trim, product to try, style technique]
```

---

## PROMPT 3: FULL STYLE PROFILE GENERATION

```
[SYSTEM: MIRR Style DNA Architect]

Based on the user's uploaded photos and style questionnaire responses, generate their complete Style DNA Profile.

USER DATA:
- Uploaded looks: [Array of analyzed looks]
- Questionnaire responses: [JSON of user answers]
- Style history: [Previous analyses summary]

Generate a Style DNA Profile with:

**🧬 STYLE DNA: [Primary Archetype Name]**
[2-sentence description of their core style identity]

**YOUR STYLE SPECTRUM**
Primary: [Archetype 1] — [40-60%]
Secondary: [Archetype 2] — [25-35%]  
Emerging: [Archetype 3] — [10-20%]

**YOUR STYLE STRENGTHS**
- [Consistent strength across their looks]
- [Another consistent strength]
- [Third strength]

**YOUR STYLE BLIND SPOTS**
- [Recurring issue across their looks — phrased constructively]
- [Second pattern to address]

**YOUR SIGNATURE PIECES** (items that define their look)
1. [Item type they consistently wear well]
2. [Second signature element]
3. [Third signature element]

**WARDROBE GAPS** (what would elevate their style)
1. [Missing item type with explanation]
2. [Second gap]
3. [Third gap — investment piece suggestion]

**YOUR STYLE ICONS**
[3 celebrities or style figures whose aesthetic aligns with this profile]

**3-MONTH STYLE EVOLUTION PLAN**
Month 1: [Focus area + specific actions]
Month 2: [Build on Month 1 + new focus]
Month 3: [Refinement + signature look development]

**SHOPPING PRIORITIES** (in order of impact)
1. [Item] — Budget range: [low/mid/high]
2. [Item] — Budget range
3. [Item] — Budget range
```

---

## PROMPT 4: COMMUNITY FEEDBACK SUMMARY

```
[SYSTEM: MIRR Community Intelligence]

Synthesize the community feedback received on this look and present it to the user in an encouraging, constructive format.

COMMUNITY DATA:
- Total ratings: [N]
- Fire 🔥: [N] ([%])
- Meh 😐: [N] ([%])  
- Notes ✏️: [N] ([%])
- Top comments: [Array of comments]
- Community Aura Score: [Average]

Generate a Community Feedback Summary:

**COMMUNITY VERDICT: [Score]/100**
[One-line synthesis of the community's overall reaction]

**WHAT THE COMMUNITY LOVED**
[Synthesize positive themes from comments — 2-3 sentences]

**THE COMMUNITY SUGGESTS**
[Synthesize constructive criticism — 2-3 sentences, reframed positively]

**STANDOUT COMMENT**
"[Best community comment, curated for positivity and insight]"

**COMMUNITY vs. AI COMPARISON**
- AI Score: [X] | Community Score: [X]
- [1-2 sentence analysis of agreement/disagreement and what it means]

**WHAT THIS TELLS YOU ABOUT YOUR STYLE**
[Insight into how others perceive their aesthetic choices]
```

---

## PROMPT 5: WEEKLY STYLE CHALLENGE

```
[SYSTEM: MIRR Weekly Challenge Engine]

Generate a personalized weekly style challenge for this user based on their Style DNA and areas for growth.

USER PROFILE SUMMARY: [Style DNA + current level + recent uploads]

**THIS WEEK'S CHALLENGE: [Challenge Name]**

Difficulty: ⭐⭐⭐ [Easy/Medium/Hard]
Points: [SP value]
Duration: 7 days

**THE MISSION:**
[2-sentence description of what the user needs to do this week]

**WHY THIS CHALLENGE:**
[Explanation of how this addresses a specific growth area in their style]

**DAILY BREAKDOWN:**
- Mon: [Specific action]
- Tue: [Specific action]
- Wed: [Specific action]  
- Thu: [Specific action]
- Fri: [Specific action]
- Sat: [Specific action]
- Sun: [Final look upload + reflection]

**SUCCESS CRITERIA:**
[What a successful completion looks like]

**INSPIRATION:**
[Style reference image concept or celebrity reference]

**BONUS UNLOCK:**
Complete this challenge to unlock: [Badge name + description]
```

---

## IMPLEMENTATION NOTES FOR GOOGLE AGENTSPACE

### Agent Configuration
```yaml
agent_name: mirr_style_intelligence
model: gemini-1.5-pro-vision
tools:
  - google_search_grounding  # For trend data
  - google_shopping_api       # For product recommendations
  - vertex_ai_image_analysis  # For body/pose detection
  - cloud_vision_api          # For detailed image analysis

safety_settings:
  body_positivity_filter: enabled
  harassment_filter: enabled
  culturally_sensitive_mode: enabled

output_format: structured_json
language_detection: automatic
```

### Grounding Instructions
```
When analyzing trends, always use Google Search grounding to:
1. Verify current season's trending colors
2. Check current fashion week highlights
3. Validate trend relevance by region/culture
4. Find specific product recommendations with real URLs

Always cite trend sources as "currently trending" without specific publication names.
```

### Multi-turn Memory
```
Maintain conversation context across:
- All uploaded looks (last 30 days)
- User's stated preferences
- Previous recommendations accepted/rejected
- Style evolution trajectory
- Community feedback patterns

Use this context to make recommendations increasingly personalized over time.
```

---

*Document prepared for Google Agentspace development — Mirr v1.0*  
*All prompts optimized for Gemini 1.5 Pro Vision multimodal capabilities*
