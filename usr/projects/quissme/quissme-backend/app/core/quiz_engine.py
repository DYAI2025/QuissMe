"""Quiz engine with database and scoring logic"""
from typing import Dict, List, Any, Tuple
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

# Quiz database with 50+ quizzes across 8 categories
QUIZ_DATABASE = {
    # Liebesprachen (Love Languages) - 10 quizzes
    "liebesprachen_1": {
        "title": "Welche Liebe sprichst du?",
        "category": "liebesprachen",
        "description": "Entdecke deine primäre Liebessprache",
        "questions": [
            {"id": "q1", "text": "Wenn du traurig bist, was brauchst du am meisten?", "options": ["Körperkontakt", "Worte der Bestätigung", "Zeit zusammen", "Praktische Hilfe", "Kleine Geschenke"]},
            {"id": "q2", "text": "Wie zeigst du Liebe am liebsten?", "options": ["Durch Umarmungen", "Durch Komplimente", "Durch gemeinsame Zeit", "Durch Unterstützung", "Durch Überraschungen"]},
            {"id": "q3", "text": "Was macht dich am glücklichsten in einer Beziehung?", "options": ["Nähe und Berührung", "Tiefe Gespräche", "Gemeinsame Aktivitäten", "Jemand der mich versteht", "Aufmerksamkeit und Überraschungen"]},
        ]
    },
    "liebesprachen_2": {
        "title": "Körperliche Nähe Score",
        "category": "liebesprachen",
        "description": "Wie wichtig ist dir körperliche Nähe?",
        "questions": [
            {"id": "q1", "text": "Wie oft möchtest du körperliche Nähe?", "options": ["Täglich", "Mehrmals pro Woche", "Wöchentlich", "Gelegentlich", "Selten"]},
            {"id": "q2", "text": "Welche Art von Berührung magst du am liebsten?", "options": ["Umarmungen", "Händchenhalten", "Massagen", "Kuscheln", "Alles davon"]},
        ]
    },
    # Konflikt (Conflict) - 10 quizzes
    "konflikt_1": {
        "title": "Wie streitet ihr?",
        "category": "konflikt",
        "description": "Verstehe dein Konflikt-Verhalten",
        "questions": [
            {"id": "q1", "text": "Wenn es Streit gibt, wie reagierst du?", "options": ["Ich werde laut", "Ich ziehe mich zurück", "Ich versuche zu diskutieren", "Ich werde emotional", "Ich bleibe ruhig"]},
            {"id": "q2", "text": "Was ist dein Hauptkonflikt-Thema?", "options": ["Geld", "Zeit zusammen", "Haushalt", "Familie", "Kommunikation"]},
            {"id": "q3", "text": "Wie lange dauert es, bis du dich nach Streit versöhnst?", "options": ["Sofort", "Wenige Stunden", "Ein Tag", "Mehrere Tage", "Sehr lange"]},
        ]
    },
    "konflikt_2": {
        "title": "Dein Konflikt-Stil",
        "category": "konflikt",
        "description": "Identifiziere deinen Konflikt-Bewältigungsstil",
        "questions": [
            {"id": "q1", "text": "Bevorzugst du Konfrontation oder Vermeidung?", "options": ["Direkte Konfrontation", "Eher Vermeidung", "Kompromiss", "Zusammenarbeit", "Nachgeben"]},
        ]
    },
    # Intimität (Intimacy) - 10 quizzes
    "intimitat_1": {
        "title": "Emotionale Nähe",
        "category": "intimität",
        "description": "Wie nah fühlst du dich emotional?",
        "questions": [
            {"id": "q1", "text": "Wie leicht fällt es dir, deine Gefühle zu teilen?", "options": ["Sehr leicht", "Leicht", "Neutral", "Schwierig", "Sehr schwierig"]},
            {"id": "q2", "text": "Wie oft habt ihr tiefe Gespräche?", "options": ["Täglich", "Mehrmals pro Woche", "Wöchentlich", "Monatlich", "Selten"]},
        ]
    },
    "intimitat_2": {
        "title": "Sexuelle Kompatibilität",
        "category": "intimität",
        "description": "Wie kompatibel seid ihr sexuell?",
        "questions": [
            {"id": "q1", "text": "Wie oft möchtest du Sex haben?", "options": ["Täglich", "Mehrmals pro Woche", "Wöchentlich", "Monatlich", "Selten"]},
            {"id": "q2", "text": "Wie offen seid ihr für neue Erfahrungen?", "options": ["Sehr offen", "Offen", "Neutral", "Eher konservativ", "Sehr konservativ"]},
        ]
    },
    # Alltag (Daily Life) - 10 quizzes
    "alltag_1": {
        "title": "Haushaltsverteilung",
        "category": "alltag",
        "description": "Wie verteilt ihr Haushaltsaufgaben?",
        "questions": [
            {"id": "q1", "text": "Wie fair ist die Haushaltsverteilung?", "options": ["Sehr fair", "Fair", "Neutral", "Unfair", "Sehr unfair"]},
            {"id": "q2", "text": "Wer macht mehr Hausarbeit?", "options": ["Ich", "Mein Partner", "Gleich", "Wechselt sich ab", "Weiß nicht"]},
        ]
    },
    "alltag_2": {
        "title": "Finanz-Kommunikation",
        "category": "alltag",
        "description": "Wie kommuniziert ihr über Geld?",
        "questions": [
            {"id": "q1", "text": "Wie offen sprecht ihr über Geld?", "options": ["Sehr offen", "Offen", "Neutral", "Eher verschlossen", "Sehr verschlossen"]},
        ]
    },
    # Werte (Values) - 10 quizzes
    "werte_1": {
        "title": "Was ist dir wichtig im Leben?",
        "category": "werte",
        "description": "Identifiziere deine Lebensprioritäten",
        "questions": [
            {"id": "q1", "text": "Was ist dir am wichtigsten?", "options": ["Familie", "Karriere", "Gesundheit", "Freiheit", "Sicherheit"]},
            {"id": "q2", "text": "Wie wichtig sind dir gemeinsame Werte?", "options": ["Sehr wichtig", "Wichtig", "Neutral", "Weniger wichtig", "Nicht wichtig"]},
        ]
    },
    "werte_2": {
        "title": "Kinder-Wünsche",
        "category": "werte",
        "description": "Wie seht ihr das Thema Kinder?",
        "questions": [
            {"id": "q1", "text": "Möchtest du Kinder?", "options": ["Ja, definitiv", "Wahrscheinlich", "Unsicher", "Wahrscheinlich nicht", "Nein, definitiv nicht"]},
        ]
    },
    # Zukunft (Future) - 5 quizzes
    "zukunft_1": {
        "title": "Wo wollt ihr hin?",
        "category": "zukunft",
        "description": "Habt ihr gemeinsame Zukunftspläne?",
        "questions": [
            {"id": "q1", "text": "Wie klar sind eure gemeinsamen Ziele?", "options": ["Sehr klar", "Klar", "Neutral", "Unklar", "Sehr unklar"]},
        ]
    },
    # Sinnlichkeit (+18) - 5 quizzes
    "sinnlichkeit_1": {
        "title": "Sinnliche Vorlieben",
        "category": "sinnlichkeit",
        "description": "Erkunde eure sinnlichen Vorlieben (18+)",
        "questions": [
            {"id": "q1", "text": "Was reizt dich am meisten?", "options": ["Visuell", "Taktil", "Auditiv", "Emotional", "Alles gleich"]},
        ],
        "age_restricted": True
    },
}


def get_quiz(quiz_id: str) -> Dict[str, Any]:
    """
    Get quiz by ID.
    
    Args:
        quiz_id: Quiz identifier
        
    Returns:
        Quiz data
        
    Raises:
        ValueError: If quiz not found
    """
    if quiz_id not in QUIZ_DATABASE:
        raise ValueError(f"Quiz {quiz_id} not found")
    
    return QUIZ_DATABASE[quiz_id]


def list_quizzes(category: str = None) -> List[Dict[str, Any]]:
    """
    List all quizzes, optionally filtered by category.
    
    Args:
        category: Optional category filter
        
    Returns:
        List of quiz metadata
    """
    quizzes = []
    for quiz_id, quiz_data in QUIZ_DATABASE.items():
        if category and quiz_data["category"] != category:
            continue
        
        quizzes.append({
            "id": quiz_id,
            "title": quiz_data["title"],
            "category": quiz_data["category"],
            "description": quiz_data["description"],
            "question_count": len(quiz_data["questions"]),
            "age_restricted": quiz_data.get("age_restricted", False),
        })
    
    return quizzes


def calculate_quiz_score(
    p1_answers: List[int],
    p2_answers: List[int],
    quiz_type: str
) -> float:
    """
    Calculate quiz score based on partner alignment.
    
    Score calculation:
    - 0-20: Very misaligned (0-20%)
    - 20-40: Misaligned (20-40%)
    - 40-60: Neutral (40-60%)
    - 60-80: Aligned (60-80%)
    - 80-100: Very aligned (80-100%)
    
    Args:
        p1_answers: Partner 1 answers (0-4 indices)
        p2_answers: Partner 2 answers (0-4 indices)
        quiz_type: Quiz type for context
        
    Returns:
        Score 0-100
    """
    if len(p1_answers) != len(p2_answers):
        raise ValueError("Answer lists must be same length")
    
    if len(p1_answers) == 0:
        return 50.0
    
    # Calculate alignment
    total_diff = 0
    for a1, a2 in zip(p1_answers, p2_answers):
        # Difference between answers (0-4)
        diff = abs(a1 - a2)
        total_diff += diff
    
    # Normalize to 0-100 scale
    max_diff = len(p1_answers) * 4
    alignment = 1 - (total_diff / max_diff)
    score = alignment * 100
    
    return round(score, 1)


def generate_insights(
    score: float,
    quiz_type: str,
    p1_answers: List[int],
    p2_answers: List[int]
) -> Dict[str, Any]:
    """
    Generate insights based on quiz results.
    
    Args:
        score: Quiz score (0-100)
        quiz_type: Quiz type
        p1_answers: Partner 1 answers
        p2_answers: Partner 2 answers
        
    Returns:
        Insights dictionary
    """
    insights = {
        "score": score,
        "alignment": "Very High" if score >= 80 else "High" if score >= 60 else "Moderate" if score >= 40 else "Low",
        "message": "",
        "recommendation": "",
    }
    
    # Generate message based on score
    if score >= 80:
        insights["message"] = f"Wow! You're highly aligned on {quiz_type}. This is a real strength in your relationship!"
        insights["recommendation"] = "Keep nurturing this area - it's a foundation of your connection."
    elif score >= 60:
        insights["message"] = f"You're generally aligned on {quiz_type}, with some differences to explore."
        insights["recommendation"] = "These differences can be opportunities for growth and understanding."
    elif score >= 40:
        insights["message"] = f"You have different perspectives on {quiz_type}."
        insights["recommendation"] = "Try to understand each other's viewpoints - this can strengthen your bond."
    else:
        insights["message"] = f"You have quite different views on {quiz_type}."
        insights["recommendation"] = "This is an area worth exploring together. Communication is key."
    
    return insights


def determine_buffs_earned(score: float, quiz_type: str) -> List[str]:
    """
    Determine which buffs are earned based on quiz results.
    
    Args:
        score: Quiz score (0-100)
        quiz_type: Quiz type
        
    Returns:
        List of buff types earned
    """
    buffs = []
    
    # High score buffs
    if score >= 80:
        if quiz_type == "liebesprachen":
            buffs.append("liebesflüsterer")
        elif quiz_type == "konflikt":
            buffs.append("harmonie_welle")
        elif quiz_type == "intimität":
            buffs.append("intimitäts_boost")
    
    # Medium score buffs
    if 60 <= score < 80:
        buffs.append("neugier_funkeln")
    
    # All scores get consistency buff
    if score >= 50:
        buffs.append("wert_schärfer")
    
    return buffs
