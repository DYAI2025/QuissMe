# QuissMe - Starker Verbesserungsvorschlag

**Datum:** 2026-02-01
**Prioritaet:** HOCH

---

## Zusammenfassung der Analyse

Das QuissMe-Backend ist ein **unfertiger Prototyp** mit kritischen Bugs, die einen produktiven Einsatz verhindern. Die Kernidee und Architektur sind solide, aber die Implementierung ist unvollstaendig.

### Aktuelle Situation

```
Implementierungsstand:    ~25%
Kritische Bugs:           5
Fehlende Features:        ~15
Test-Abdeckung:           <15%
Frontend:                 0%
```

---

## PHASE 1: Kritische Fixes (1-2 Tage)

### 1.1 Sync/Async Problem loesen

**Empfehlung:** Komplett auf synchronen Code umstellen (einfacher, weniger Fehlerquellen)

```python
# database.py - VORHER (async)
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession

# database.py - NACHHER (sync)
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
```

**Betroffene Dateien:**
- `database.py`
- `dependencies.py`
- Alle API-Endpunkte

### 1.2 UserService-Bug fixen

```python
# dependencies.py - VORHER
user_service = UserService(db)
user = await user_service.get_user_by_id(user_id)

# dependencies.py - NACHHER
user = UserService.get_user_by_id(db, user_id)
```

### 1.3 Fehlende Konfiguration

```python
# config.py - hinzufuegen
ALLOWED_HOSTS: List[str] = ["localhost", "127.0.0.1", "*"]
```

### 1.4 Fehlenden Endpunkt implementieren

```python
# auth.py - hinzufuegen
@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """Get current user profile"""
    return current_user
```

---

## PHASE 2: Feature-Vervollstaendigung (1-2 Wochen)

### 2.1 Quiz-System vervollstaendigen

1. **Quiz-Daten aus JSON laden** statt hardcoded
2. **50+ Quizzes** implementieren (aktuell nur 13)
3. **Quiz-Format vereinheitlichen**

```python
# quiz_engine.py - Beispiel
import json
from pathlib import Path

def load_quizzes():
    quiz_files = [
        "quizzes.json",
        "quizzes_love_languages.json",
        "quizzes_complete.json"
    ]
    all_quizzes = {}
    for file in quiz_files:
        path = Path(__file__).parent.parent.parent / "data" / file
        if path.exists():
            with open(path) as f:
                data = json.load(f)
                # Merge quizzes...
    return all_quizzes
```

### 2.2 E-Mail-Service implementieren

```python
# services/email_service.py
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

class EmailService:
    @staticmethod
    def send_partner_invite(couple_id: str, partner_email: str, inviter_name: str):
        """Send partner invitation email"""
        message = Mail(
            from_email="noreply@quissme.app",
            to_emails=partner_email,
            subject=f"{inviter_name} hat dich zu QuissMe eingeladen!",
            html_content=f"""
            <h1>Liebes-Einladung</h1>
            <p>{inviter_name} moechte mit dir Quizzes bei QuissMe machen.</p>
            <a href="https://quissme.app/join/{couple_id}">Jetzt beitreten</a>
            """
        )
        # ... send logic
```

### 2.3 Passwort-Reset implementieren

```python
# api/auth.py - hinzufuegen
@router.post("/forgot-password")
def request_password_reset(email: EmailStr, db: Session = Depends(get_db)):
    """Request password reset"""
    user = UserService.get_user_by_email(db, email)
    if user:
        reset_token = create_reset_token(user.id)
        EmailService.send_password_reset(email, reset_token)
    return {"message": "If email exists, reset link sent"}

@router.post("/reset-password")
def reset_password(token: str, new_password: str, db: Session = Depends(get_db)):
    """Reset password with token"""
    # ... implementation
```

### 2.4 Pattern Detection integrieren

```python
# api/patterns.py - vollstaendige Implementation
@router.get("/{couple_id}/analyze")
def analyze_patterns(couple_id: UUID, db: Session = Depends(get_db)):
    """Run full pattern analysis"""
    # Get recent quiz scores
    quiz_scores = QuizService.get_recent_scores(db, couple_id)
    intimacy_scores = QuizService.get_recent_scores(db, couple_id, quiz_type="intimitat")
    conflict_scores = QuizService.get_recent_scores(db, couple_id, quiz_type="konflikt")

    # Get last challenge date
    last_challenge = db.query(ChallengeHistory).filter(
        ChallengeHistory.couple_id == couple_id,
        ChallengeHistory.status == "completed"
    ).order_by(ChallengeHistory.completed_at.desc()).first()

    patterns_detected = []
    interventions = []

    # Detect patterns
    if detect_intimacy_drop(intimacy_scores):
        patterns_detected.append("intimacy_drop")
        interventions.append(PATTERN_DEFINITIONS["intimacy_drop"]["intervention"])

    if detect_conflict_escalation(conflict_scores):
        patterns_detected.append("conflict_escalation")
        interventions.append(PATTERN_DEFINITIONS["conflict_escalation"]["intervention"])

    # ... weitere Pattern-Checks

    return {
        "patterns_detected": patterns_detected,
        "interventions": interventions,
        "recommendations": get_recommended_challenges([p for p in patterns_detected])
    }
```

---

## PHASE 3: Frontend (2-4 Wochen)

### 3.1 Tech-Stack (wie in PRODUCT_SPEC)

```
Framework:     Next.js 14 (App Router)
UI:            Tailwind CSS + shadcn/ui
State:         Zustand + TanStack Query
Auth:          NextAuth.js (statt Clerk - kostenlos)
Deployment:    Vercel
```

### 3.2 Kern-Seiten

```
/                    Landing Page
/login               Login
/register            Registrierung
/dashboard           Paar-Dashboard
/quizzes             Quiz-Browser
/quizzes/[id]        Quiz spielen
/challenges          Challenges-Browser
/compatibility       BaZi-Kompatibilitaet
/profile             Profil-Einstellungen
```

### 3.3 Design-System (wie in PRODUCT_SPEC)

```css
/* globals.css */
:root {
  --c-bg-0: #05060A;      /* Hintergrund */
  --c-gold: #D6B25E;      /* Akzente, Buffs */
  --c-surface: rgba(255,255,255,0.06);
  --blur-std: 12px;
  --r-card: 24px;
}
```

---

## PHASE 4: Infrastruktur (1 Woche)

### 4.1 Datenbankmigrationen mit Alembic

```bash
pip install alembic
alembic init migrations
alembic revision --autogenerate -m "Initial"
alembic upgrade head
```

### 4.2 Redis-Caching

```python
# services/cache_service.py
import redis
from app.config import get_settings

redis_client = redis.from_url(get_settings().REDIS_URL)

class CacheService:
    @staticmethod
    def cache_bazi_compatibility(couple_id: str, data: dict, ttl_days: int = 30):
        key = f"bazi:{couple_id}"
        redis_client.setex(key, ttl_days * 86400, json.dumps(data))

    @staticmethod
    def get_cached_bazi(couple_id: str):
        key = f"bazi:{couple_id}"
        cached = redis_client.get(key)
        return json.loads(cached) if cached else None
```

### 4.3 Rate-Limiting

```python
# middleware/rate_limit.py
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

# In main.py
app.state.limiter = limiter

# In API
@router.post("/register")
@limiter.limit("5/minute")
def register(...):
    ...
```

---

## Zeitplan-Schaetzung

| Phase | Dauer | Prioritaet |
|-------|-------|------------|
| Phase 1: Kritische Fixes | 1-2 Tage | KRITISCH |
| Phase 2: Features | 1-2 Wochen | HOCH |
| Phase 3: Frontend | 2-4 Wochen | HOCH |
| Phase 4: Infrastruktur | 1 Woche | MITTEL |
| **TOTAL** | **5-8 Wochen** | |

---

## Empfohlene Sofortmassnahmen

1. **Heute:**
   - [ ] Sync/Async Bug fixen
   - [ ] ALLOWED_HOSTS hinzufuegen
   - [ ] UserService-Bug fixen

2. **Diese Woche:**
   - [ ] /api/auth/me implementieren
   - [ ] Tests zum Laufen bringen
   - [ ] Quiz-Daten konsolidieren

3. **Naechste Woche:**
   - [ ] E-Mail-Service
   - [ ] Pattern Detection Integration
   - [ ] Frontend-Grundgeruest

---

## Fazit

Das QuissMe-Projekt hat **gutes Potenzial**, aber erfordert signifikante Arbeit:

**Staerken:**
- Klare Vision (PRODUCT_SPEC)
- Sinnvolle Architektur-Entscheidungen
- Interessantes Konzept (BaZi + Quizzes + Gamification)

**Schwaechen:**
- Kritische technische Bugs
- Unvollstaendige Implementierung
- Fehlendes Frontend

**Empfehlung:** Mit 5-8 Wochen konzentrierter Arbeit kann ein MVP erreicht werden. Prioritaet sollte auf den kritischen Fixes liegen, bevor weitere Features hinzugefuegt werden.

---

*Erstellt am 2026-02-01 durch Claude Code Analyse*
