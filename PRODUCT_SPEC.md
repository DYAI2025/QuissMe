# QuizzMe – Product Specification

> "Entertainment first. Connection always."

---

## 1. Product Vision

**QuizzMe** (Anlehnung an "Kiss Me") ist eine Entertainment-App für Paare, die durch Quizzes, Horoskop-Kompatibilität und spielerische Challenges die Beziehung stärkt – ohne jemals als Therapie oder Diagnose aufzutreten.

### Core Promise
> "Wir helfen euch, euch besser zu verstehen – mit Spaß, nicht mit Vorwürfen."

### Positionierung
- ❌ Keine Therapie
- ❌ Keine Diagnose  
- ❌ Kein "Coaching"
- ✅ Entertainment mit Tiefe
- ✅ Spielerei mit Erkenntnis
- ✅ Gentle Interventions (nur wenn gewünscht)

---

## 2. Target Audience

| Segment | Beschreibung | Motivation |
|---------|--------------|------------|
| **Early Adopters** | 25-40, digital natives, offen für Astrologie/Selbsttests | Neugier, Spaß |
| **LTR-Paare** | 3-15 Jahre Beziehung, wollen Frische zurück | Verbindung erhalten |
| **New Couples** | <2 Jahre, "Wo stehen wir?" | Kennenlernen vertiefen |
| **Curious Singles** | Mit Interesse an Kompatibilität | Future-proofing |

---

## 3. Core Features

### 3.1 Quiz Engine

**Quiz-Kategorien:**

| Kategorie | Focus | Beispiel-Quiz |
|-----------|-------|---------------|
| **Liebesprachen** | Kommunikation | "Welche Liebe sprichst du?" |
| **Konflikt-Muster** | Streit-Verhalten | "Wie streitet ihr?" |
| **Intimität** | Emotional & körperlich | "Was fehlt euch?" |
| **Werte** | Prioritäten | "Was ist euch wichtig?" |
| **Alltag** | Routine-Check | "Wer macht was?" |
| **Vertrauen** | Security | "Wie sicher fühlt ihr euch?" |
| **Zukunft** | Alignment | "Wo wollt ihr hin?" |
| **Sinnlichkeit** | +18 Bereich | "Was turnt euch an?" |

**Quiz-Format:**
```
1. Beide Partner beantworten separat (ohne dass der andere sieht)
2. Ergebnisse werden verglichen
3. Score (0-100%)
4. Insight + Gentle Nudge
5. Optional: Challenge empfehlen
```

**Beispiel: Liebesprachen-Quiz**

```
Frage: "Wenn du traurig bist, was brauchst du am meisten?"
A) Dass mich jemand in den Arm nimmt
B) Dass mir jemand etwas Nettes sagt
C) Dass jemand Zeit mit mir verbringt
D) Dass mir jemand hilft
E) Dass mich jemand verwöhnt

Output: "Partner A braucht Körperkontakt, Partner B braucht Worte.
Euer Love Language Gap: 3/5. Buff: 'Liebesflüsterer' für 7 Tage."
```

---

### 3.2 Horoskop-Kompatibilität

**BaZiEngine_v2 Integration:**

| Input | Output |
|-------|--------|
| Beide Geburtsdaten (Jahr/Monat/Tag/Zeit/Ort) | Element-Analyse (Wood-Fire-Earth-Metal-Water) |
| | Day Master Compatibility Score |
| | Stärken-Paarung |
| | Challenge-Paarung |
| | Jahres-Prognose für die Beziehung |

**Kompatibilitäts-Types:**

```
🔥 Fire + Fire = Leidenschaftlich aber verbrennend
🌊 Water + Water = Tief aber ertrinkend
🌱 Wood + Wood = Wachsend aber überwuchernd
🏔️ Earth + Earth = Stabil aber stagnierend
⚔️ Metal + Metal = Klar aber kalt
```

**Implementation:**
- BaZiEngine_v2 existiert bereits in `/home/dyai/clawd/PROJECTS/`
- Neue Funktion: `calculate_couple_compatibility(p1, p2)`
- Caching: Ergebnisse für 30 Tage speichern

---

### 3.3 Challenges (Spielerische Interventionen)

**Challenge-Typen:**

| Typ | Dauer | Fokus |
|-----|-------|-------|
| **Micro-Challenge** | 1-5 min | Sofortige Verbindung |
| **Daily-Ritual** | 1 Woche | Gewohnheit aufbauen |
| **Deep-Dive** | 24h | Intensive Erfahrung |
| **+18** | Variabel | Intimität (Opt-in) |

**Challenge-Bibliothek (Beispiele):**

```
🌟 Standard Challenges:

1. "Dankbarkeits-Ritual"
   Dauer: 7 Tage
   Täglich: "Sag 3 Dinge, die du an deinem Partner schätzt"
   Buff: +15% "Harmonie" für 7 Tage

2. "Augenkontakt"
   Dauer: 5 min (einmalig)
   "Schaut euch 5 min an, ohne zu sprechen"
   Effekt: +20% Intimität für 3 Tage

3. "Liebesprache switchen"
   Dauer: 24h
   "Spricht heute die Sprache eures Partners"
   Effekt: +10% Verständnis für 7 Tage
```

```
🔥 +18 Challenges (Opt-in, 18+):

1. "Nackt erzählen"
   "Legt euch nackt ins Bett, 15 min erzählen.
   Themen: Was ihr euch wünscht (keine Vorwürfe),
   wofür ihr dankbar seid (lange nicht gesagt)."
   → Fördert Nähe + Vertrauen

2. "Berührungs-Challenge"
   "5 min Berührung ohne Sex.
   Einer führt, einer folgt. Augen geschlossen."
   → Vertraut + Intimität

3. "Sinnes-Reise"
   "Eine Person beschreibt, die andere führt aus."
   → Kommunikation + Exploration
```

**Challenge-Logic:**

```
Wenn Quiz-Ergebnis niedrig in Bereich X:
  → Empfehle Challenge aus Bereich X
  → "Euer [Intimität]-Score ist bei 40%.
     Wir haben eine kleine Aufgabe für euch... 🌟"
```

---

### 3.4 Pattern Detection (Das Geheimnis)

**Was wird getrackt:**

```
Über Zeit (Wochen/Monate):
- Quiz-Antworten (Trends)
- Challenge-Completion-Rate
- Buff-Aktivierung
- Login-Frequenz
- Kompatibilitäts-Score-Veränderung
```

**Pattern Recognition:**

```
Beispiel-Patterns:

1. "Intimitäts-Drop"
   Wenn: 3x hintereinander niedriger Score bei Intimität-Quizzes
   Alert: "Euer Beziehungs-Tank ist bei 30%. 🌊"
   Intervention: Gentle Challenge empfehlen

2. "Konflikt-Escalation"  
   Wenn: Streit-bezogene Antworten nehmen zu
   Alert: "Es scheint etwas turbulent. 💫"
   Intervention: "Pause-Challenge" anbieten

3. "Routine-Complacency"
   Wenn: Keine Challenges seit 14 Tagen
   Alert: "Wie wär's mit etwas Neuem? ✨"
   Intervention: "Abenteuer-Challenge"
```

**Privacy:**
- Alles optional (Opt-in)
- Keine Rohdaten, nur aggregierte Scores
- Löschbar auf Wunsch
- Keine "Diagnosis" – nur Entertainment-Score

---

### 3.5 Buff System

**Was sind Buffs?**

```
Temporäre Boost für die Beziehung, basierend auf:
- Quiz-Ergebnisse
- Challenge-Completion
- Consistency
```

**Buff-Typen:**

| Buff | Dauer | Effekt |
|------|-------|--------|
| **Liebesflüsterer** | 7 Tage | +Empathie, besser zuhören |
| **Harmonie-Welle** | 3 Tage | -Konflikte, +Geduld |
| **Versöhnungs-Kraft** | 24h | Nach Streit: schneller Reset |
| **Neugier-Funkeln** | 7 Tage | +Fragen stellen, -Assumieren |
| **Intimitäts-Boost** | 7 Tage | +Körperliche Nähe |
| **Wert-Schärfer** | 14 Tage | Klarere Prioritäten |

**Buff-Visualisierung:**

```
┌─────────────────────────────────────┐
│  🌟 Euer aktiver Buff                │
│  ───────────────────────            │
│  Liebesflüsterer                    │
│  +15% Empathie bis 15.02.2026       │
│  🌟🌟🌟🌟🌟 (durch Quiz bestätigt)  │
└─────────────────────────────────────┘
```

---

## 4. Design System

### 4.1 Bazodiac Integration

**Design-Sprache:** Dark Cosmos + Gold (wie Bazodiac)

| Token | Wert | Verwendung |
|-------|------|------------|
| `--c-bg-0` | #05060A | Hintergrund |
| `--c-gold` | #D6B25E | Akzente, Buffs |
| `--c-surface` | rgba(255,255,255,0.06) | Karten |
| `--blur-std` | 12px | Glassmorphism |
| `--r-card` | 24px | Abgerundete Ecken |

**Font:** Sora (wie Bazodiac)

### 4.2 UI Components

```
QuizzMe Components:
- 🃏 Quiz-Card (Quiz-Einblendung)
- 💞 Couple-Avatar (Visual Twin der Beziehung)
- 🏆 Achievement-Badges (erworbene Buffs)
- 📊 Relationship-Chart (Score-Verlauf)
- 🌟 Buff-Indicator (aktive Buffs)
- 🔗 Challenge-Card (Aufgabe präsentieren)
```

### 4.3 Navigation

```
Bottom Bar:
┌────────────────────────────────┐
│ 🏠 Home  │  🎯 Quiz  │  💕 Couple  │  🏆 Trophy  │  👤 Profile
└────────────────────────────────┘

Home: Dashboard, Today's Suggestion
Quiz: Quiz-Browser, Quiz-Start
Couple: Relationship Score, Challenges, Buffs
Trophy: Achievements, Stats, History
Profile: Settings, +18 Toggle, Account
```

---

## 5. BaZiEngine_v2 Coupling

### 5.1 Neue Funktionen

```python
# baZi_engine_couple.py (neue Datei)

from baZiEngine_v2 import BaZiChart

def calculate_couple_compatibility(
    p1_birth_data: dict,
    p2_birth_data: dict
) -> dict:
    """
    Berechnet Paar-Kompatibilität basierend auf BaZi.
    
    Returns:
        - element_harmony_score (0-100)
        - day_master_synergy (0-100)
        - strength_gap (0-100)
        - yearly_prediction (str)
        - recommendation (str)
    """
    chart1 = BaZiChart(**p1_birth_data)
    chart2 = BaZiChart(**p2_birth_data)
    
    return {
        "compatibility_score": calculate_synergy(chart1, chart2),
        "element_analysis": analyze_elements(chart1, chart2),
        "day_master_combo": analyze_day_masters(chart1, chart2),
        "strength_dynamics": analyze_strengths(chart1, chart2),
        "year_forecast": generate_forecast(chart1, chart2),
        "recommendations": generate_recommendations(chart1, chart2)
    }

def suggest_challenge(
    weak_area: str, 
    quiz_score: int
) -> Challenge:
    """
    Empfehlt passende Challenge basierend auf:
    - Schwachem Bereich aus Quiz
    - Aktuellem Score
    - BaZi-Profil
    """
    challenges = ChallengeDatabase.get_challenges(
        area=weak_area,
        bazi_profile=baZi_profile,
        intensity=map_score_to_intensity(quiz_score)
    )
    return challenges[0]
```

### 5.2 Datenbank-Schema

```sql
-- Supabase Schema

-- Users (Clerk Auth Integration)
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email TEXT,
    name TEXT,
    birth_data JSONB,  -- {year, month, day, hour, location}
    bazi_chart JSONB,  -- Cached BaZi calculation
    created_at TIMESTAMP
);

-- Couples (Relationship)
CREATE TABLE couples (
    id UUID PRIMARY KEY,
    user1_id UUID REFERENCES users(id),
    user2_id UUID REFERENCES users(id),
    compatibility_data JSONB,  -- BaZi coupling result
    created_at TIMESTAMP
);

-- Quiz Attempts
CREATE TABLE quiz_attempts (
    id UUID PRIMARY KEY,
    couple_id UUID REFERENCES couples(id),
    quiz_type TEXT,
    answers JSONB,  -- {p1_answers, p2_answers}
    score FLOAT,
    insights JSONB,
    created_at TIMESTAMP
);

-- Buffs
CREATE TABLE active_buffs (
    id UUID PRIMARY KEY,
    couple_id UUID REFERENCES couples(id),
    buff_type TEXT,
    effect_description TEXT,
    starts_at TIMESTAMP,
    expires_at TIMESTAMP
);

-- Challenges
CREATE TABLE challenge_history (
    id UUID PRIMARY KEY,
    couple_id UUID REFERENCES couples(id),
    challenge_id TEXT,
    status TEXT,  -- offered, started, completed, skipped
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    feedback_rating INT  -- Optional: 1-5
);

-- Pattern Tracking
CREATE TABLE couple_patterns (
    id UUID PRIMARY KEY,
    couple_id UUID REFERENCES couples(id),
    pattern_type TEXT,  -- intimacy_drop, conflict_escalation, etc.
    confidence FLOAT,
    triggered_at TIMESTAMP,
    intervention_sent TEXT,
    user_response TEXT  -- dismissed, engaged, no_response
);
```

---

## 6. Tech Stack

### 6.1 Frontend

```
Framework:     Next.js 14 (App Router)
UI Library:    Tailwind CSS + shadcn/ui
State:         Zustand + React Query
Auth:          Clerk (einfach, sicher)
Animations:    Framer Motion (smooth transitions)
Charts:        Recharts (Relationship scores)
Deployment:    Vercel (wie QuizzMe bestehend)
```

### 6.2 Backend

```
API:           FastAPI (Python) oder Next.js API Routes
BaZi Engine:   BaZiEngine_v2 (Python, bestehend)
Database:      Supabase (PostgreSQL + Auth)
Caching:       Redis (für Quiz-Ergebnisse, Patterns)
Payments:      Stripe (Abo-Management)
```

### 6.3 Infrastructure

```
Hosting:       Vercel (Frontend) + Railway/Render (Backend)
CI/CD:         GitHub Actions
Monitoring:    Sentry
Analytics:     PostHog (Privacy-friendly)
```

---

## 7. Monetarisierung

### 7.1 Pricing Tiers

| Tier | Preis | Features |
|------|-------|----------|
| **Free** | €0 | 3 Quizzes/Monat, Basis-Kompatibilität, 2 Challenges/Woche |
| **Premium** | €4.99/Monat | Alles unlimited, Pattern Detection, Detailed Reports, +18 Challenges |
| **Lifetime** | €99 | Premium für immer, exklusive Challenges, Early Access |

### 7.2 Revenue Streams

```
Primary: Subscription (80%)
- Monthly: €4.99
- Annual: €39.99 (33% Rabatt)

Secondary: One-time (15%)
- Detailed Report PDF: €9.99
- Anniversary Package: €19.99

Tertiary: Gift Codes (5%)
- 1 Month Premium Gift: €4.99
- Partnership with flower services?
```

### 7.3 Growth Strategy

```
Month 1-2: MVP Launch
- Soft launch to existing QuizzMe/Bazodiac users
- Product Hunt launch
- Partner with relationship podcasters

Month 3-6: Scale
- TikTok/Reels content: "Take this quiz with your partner!"
- Influencer partnerships (relationship coaches)
- App Store optimization

Month 6-12: Monetize
- Push premium tier
- Launch "Gift" feature
- Partnership with wedding planners
```

---

## 8. Launch Roadmap

### Phase 1: MVP (Wochen 1-4)

```
Week 1-2: Foundation
- [ ] QuizzMe UI Design (Dark Cosmos + Gold)
- [ ] Clerk Auth Integration
- [ ] Basic Quiz Engine (5 Quizzes)
- [ ] Couple Creation Flow

Week 3-4: BaZi Integration  
- [ ] BaZiEngine_v2 Coupling
- [ ] Compatibility Calculator
- [ ] Basic Challenge System (10 challenges)
- [ ] Beta Testing (inner circle)
```

### Phase 2: v1.0 (Wochen 5-8)

```
Week 5-6: Polish & Expand
- [ ] 15+ Quizzes (alle Kategorien)
- [ ] Buff System
- [ ] Pattern Detection (basic)
- [ ] Push Notifications

Week 7-8: Launch Prep
- [ ] Landing Page
- [ ] ASO (App Store Optimization)
- [ ] Marketing Assets
- [ ] Launch (Product Hunt + Social)
```

### Phase 3: v2.0 (Wochen 9-16)

```
Week 9-12: Deep Features
- [ ] Full Pattern Detection
- [ ] Gentle Intervention System
- [ ] +18 Content (Opt-in, 18+)
- [ ] Detailed PDF Reports

Week 13-16: Scale
- [ ] Analytics Dashboard
- [ ] A/B Testing
- [ ] Performance Optimization
- [ ] Mobile App (React Native)
```

---

## 9. Success Metrics

### KPIs

| Metric | Target (Month 1) | Target (Month 6) |
|--------|------------------|------------------|
| Downloads | 1,000 | 50,000 |
| Sign-ups | 500 | 25,000 |
| Active Couples | 200 | 10,000 |
| Quiz Completion Rate | 60% | 75% |
| Challenge Completion | 40% | 60% |
| Premium Conversion | 5% | 12% |
| NPS Score | 40 | 55 |
| Day 7 Retention | 35% | 50% |

### North Star Metric

```
Weekly Active Couples (WAC) × Average Quizzes per Couple
```

---

## 10. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Low engagement after initial curiosity | High | High | Gamification, Streaks, Buffs |
| Privacy concerns with relationship data | Medium | High | Transparent data policy, Opt-in only |
| +18 content controversial | Medium | Medium | Strict 18+ gate, legal compliance |
| BaZi accuracy questioned | Low | Low | Frame as "entertainment", not science |
| Competition (existing apps) | Medium | Medium | Unique positioning, BaZi differentiation |

---

## 11. AI Studio Prompts

### Prompt 1: Landing Page Design

```
Design a landing page for "QuizzMe" - a couple entertainment app featuring quizzes, astrology compatibility checks, and playful challenges.

Brand: Dark cosmos aesthetic with gold accents, mysterious and elegant
Target: Couples 25-40 who want to strengthen their relationship through fun activities

Key sections:
- Hero: "Entdecke euch neu. Mit Spaß."
- Features: Quizzes, Compatibility, Challenges
- Social Proof: "Schon 10.000 Paare"
- CTA: "Kostenlos starten"

Style: Dark background (#05060A), gold accents (#D6B25E), glassmorphism cards, modern typography
```

### Prompt 2: App UI Design

```
Design mobile app UI for "QuizzMe" - couple relationship app with:
- Dashboard with relationship score
- Quiz cards with couple animations
- Challenge notifications with gold glow effects
- Compatibility horoscope visualization
- Achievement badges and buffs

Design language: Dark cosmos, gold accents, Sora font, smooth animations, 60fps transitions
Components: Bottom navigation, glassmorphism cards, subtle glow effects, cosmic background elements
```

---

## 12. Next Steps

### Immediate Actions

```
□ Review and approve Product Spec
□ Set up GitHub repository (DYAI2025/quizzme)
□ Create design mockups (AI Studio)
□ Begin BaZiEngine coupling implementation
□ Plan content (Quizzes, Challenges)
□ Prepare marketing assets
```

### Decisions Needed

```
1. Build as separate app or feature in QuizzMe?
2. Backend: Next.js API Routes or separate FastAPI?
3. Timeline: Target launch date?
4. Budget: Marketing spend for launch?
```

---

## Appendix: Quiz Ideas (50+)

### Liebesprachen (10)
1. Was brauchst du bei Stress?
2. Wie zeigst du Liebe?
3. Was macht dich am glücklichsten?
4. Was ist deine Love Language?
5. Körperliche Nähe Score
6. Worte der Bestätigung
7. Zeit schenken
8. Geschenke
9. Hilfe anbieten
10. Kombiniertes Profil

### Konflikt (10)
1. Wie streitest du?
2. Dein Konflikt-Stil
3. Nach Streit: Was brauchst du?
4. Themen die eskalieren
5. Kommunikations-Muster
6. "Ich" vs "Du" Statements
7. Deeskalations-Strategien
8. Streit nach Themen
9. Recover-Speed
10. Forgiveness-Factor

### Intimität (10)
1. Emotionale Nähe
2. Körperliche Nähe
3. Sexualität
4. Zuneigung zeigen
5. Qualität vs Quantität
6. Bedürfnisse kommunizieren
7. Neue Sachen ausprobieren
8. Berührungs-Profile
9. Romantik-Faktor
10. Intimitäts-Barrieren

### Alltag (10)
1. Haushaltsverteilung
2. Finanz-Kommunikation
3. Entscheidungen treffen
4. Work-Life Balance
5. Familien-Beziehungen
6. Freizeit-Gestaltung
7. Gesundheits-Routinen
8. Morgen-Routinen
9. Abend-Routinen
10. Gäste-Einladungen

### Werte (10)
1. Was ist wichtig im Leben?
2. Kinder-Wünsche
3. Karriere-Prioritäten
4. Finanz-Ziele
5. Lebensstil-Präferenzen
6. Religiöse/Spirituelle Werte
7. Familien-Bedeutung
8. Unabhängigkeit vs Zusammensein
9. Abenteuer vs Routine
10. Langfristige Ziele

---

*Document Version: 1.0*
*Created: 2026-01-31*
*Owner: DYAI Team*
