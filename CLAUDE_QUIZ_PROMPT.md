# QuissMe Quiz Generator Prompt
# Copy this into Claude (claude.code or claude.ai) to generate quizzes

---

## Context

You are helping build QuissMe – an entertainment app for couples that uses quizzes to help partners understand each other better. The quizzes are based on psychological research but framed positively as fun self-discovery, not therapy or diagnosis.

## Your Task

Generate {N} quiz questions for the **PASSION** cluster using the pole pairs below.

---

## Passion Poles (Use These)

| Pole | German Name | English Name | Key Traits |
|------|-------------|--------------|------------|
| **INITIATOR** | Der Zünder | The Igniter | Makes first move, brings energy, initiates intimacy |
| **RESPONDER** | Der Entfacher | The Kindler | Deepens energy, intensifies, follows through |
| **EXPRESSOR** | Der Strahler | The Expressor | Shows feelings openly, communicates desire |
| **RECEIVER** | Der Empfänger | The Receiver | Absorbs intensity, processes, shows reaction |
| **INTENSITY_HIGH** | Die Flamme | The Flame | Lives intense peaks, needs excitement |
| **INTENSITY_LOW** | Das Glühen | The Ember | Prefers steady warmth, values constancy |
| **EXPLORER** | Der Entdecker | The Explorer | Seeks new experiences, tries new things |
| **CULTIVATOR** | Der Gärtner | The Cultivator | Nurtures what exists, values familiarity |

---

## Schema (Follow Exactly)

```json
{
  "questions": [
    {
      "id": "passion_01",
      "indicator": "initiation_style",
      "context": "Ihr seid zusammen in einer neuen Stadt. Alles ist offen, alles möglich.",
      "text": "Was tust du als erstes?",
      "options": [
        { "text": "Ich checke die Szene und ziehe dich zu einem Ort, der mich interessiert.", "scores": { "INITIATOR": 3, "EXPLORER": 1 } },
        { "text": "Ich lasse mich von der Atmosphäre treiben und schaue, wohin es uns trägt.", "scores": { "CULTIVATOR": 2, "INTENSITY_LOW": 1 } },
        { "text": "Ich frage dich, was dich interessiert – und folge deiner Energie.", "scores": { "RESPONDER": 2, "RECEIVER": 2 } },
        { "text": "Ich suche nach dem intensivsten Erlebnis, das wir hier haben können.", "scores": { "INTENSITY_HIGH": 3, "EXPRESSOR": 1 } }
      ]
    }
  ]
}
```

---

## Critical Rules

### 1. POSITIVE FRAMING ONLY
**WRONG:** "Was fehlt euch am meisten?"
**RIGHT:** "Was wünscht ihr euch voneinander?"

**WRONG:** "Worüber streitet ihr euch?"
**RIGHT:** "Wie löst ihr Spannungen gemeinsam?"

**WRONG:** "Was ist euer größtes Problem?"
**RIGHT:** "Welche Herausforderung meistert ihr gemeinsam?"

### 2. Use These Patterns
- "Wie könnt ihr das gemeinsam stärken?"
- "Welche Gelegenheit liegt darin?"
- "Was könnt ihr voneinander lernen?"
- "Wie wächst ihr durch diese Unterschiede?"

### 3. Question Structure
- **context**: Warm, relatable scenario (not a problem)
- **text**: Open question about behavior/preference
- **options**: 4 options, each strongly pointing to ONE pole
- **scores**: Each option gives 3 points to one pole, 1 point to another (for nuance)

### 4. Language
- German language
- Natural, warm tone
- Relatable scenarios

### 5. Distribution
- Mix poles fairly across questions
- Each pole should be "strong" (3 points) in ~2-3 questions
- Include both EXPLORER/CULTIVATOR and INTENSITY_HIGH/INTENSITY_LOW pairs

---

## Example Outputs

### Example 1: Initiation
**Context:** "Es war ein langer Tag. Endlich seid ihr allein."
**Question:** "Wer macht den ersten Schritt?"
- INITIATOR: "Ich – ich ziehe dich näher und küsse dich."
- RESPONDER: "Ich warte auf deinen Impuls und gehe dann mit."
- EXPRESSOR: "Ich sage dir, was ich will – direkt und klar."
- RECEIVER: "Ich zeige durch Körpersprache, dass ich bereit bin."

### Example 2: Intensity  
**Context:** "Ihr plant einen besonderen Abend."
**Question:** "Was macht ihn perfekt?"
- INTENSITY_HIGH: "Ein Höhepunkt, an den wir uns lange erinnern werden."
- INTENSITY_LOW: "Eine warme, gemütliche Zeit zusammen."
- EXPLORER: "Etwas völlig Neues, das wir zusammen entdecken."
- CULTIVATOR: "Ein vertrautes Ritual, das wir besonders machen."

---

## Output Format

Return ONLY valid JSON. No markdown, no explanation.

```json
{
  "questions": [
    { /* question 1 */ },
    { /* question 2 */ },
    { /* question 3 */ },
    { /* question 4 */ },
    { /* question 5 */ }
  ]
}
```

---

## Your Turn

Generate {N} PASSION cluster quiz questions following this schema and rules.
