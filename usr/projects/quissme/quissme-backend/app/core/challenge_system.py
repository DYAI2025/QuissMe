"""Challenge system for gamification"""
from typing import Dict, List, Any, Optional
import logging

logger = logging.getLogger(__name__)

# Challenge database
CHALLENGE_DATABASE = {
    "gratitude_ritual": {
        "id": "gratitude_ritual",
        "title": "Dankbarkeits-Ritual",
        "type": "daily_ritual",
        "duration": "7 Tage",
        "category": "liebesprachen",
        "description": "Sagt euch täglich 3 Dinge, die ihr aneinander schätzt",
        "difficulty": "easy",
        "buffs_earned": ["harmonie_welle"],
    },
    "eye_contact": {
        "id": "eye_contact",
        "title": "Augenkontakt",
        "type": "micro",
        "duration": "5 Minuten",
        "category": "intimität",
        "description": "Schaut euch 5 Minuten lang an, ohne zu sprechen",
        "difficulty": "easy",
        "buffs_earned": ["intimitäts_boost"],
    },
    "love_language_switch": {
        "id": "love_language_switch",
        "title": "Liebessprache wechseln",
        "type": "daily_ritual",
        "duration": "24 Stunden",
        "category": "liebesprachen",
        "description": "Sprecht heute die Liebessprache eures Partners",
        "difficulty": "medium",
        "buffs_earned": ["neugier_funkeln"],
    },
    "communication_challenge": {
        "id": "communication_challenge",
        "title": "Kommunikations-Challenge",
        "type": "deep_dive",
        "duration": "24 Stunden",
        "category": "konflikt",
        "description": "Führt ein tiefes Gespräch über ein wichtiges Thema",
        "difficulty": "hard",
        "buffs_earned": ["liebesflüsterer"],
    },
    "date_night": {
        "id": "date_night",
        "title": "Date Night",
        "type": "deep_dive",
        "duration": "Abend",
        "category": "alltag",
        "description": "Plant einen besonderen Abend zusammen",
        "difficulty": "medium",
        "buffs_earned": ["abenteuer_ruf"],
    },
    "massage_ritual": {
        "id": "massage_ritual",
        "title": "Massage-Ritual",
        "type": "micro",
        "duration": "15 Minuten",
        "category": "intimität",
        "description": "Gebt euch gegenseitig eine entspannende Massage",
        "difficulty": "easy",
        "buffs_earned": ["intimitäts_boost"],
    },
    "future_planning": {
        "id": "future_planning",
        "title": "Zukunftsplanung",
        "type": "deep_dive",
        "duration": "1 Stunde",
        "category": "zukunft",
        "description": "Diskutiert eure gemeinsamen Ziele für die nächsten 5 Jahre",
        "difficulty": "hard",
        "buffs_earned": ["wert_schärfer"],
    },
    "adventure_date": {
        "id": "adventure_date",
        "title": "Abenteuer-Date",
        "type": "deep_dive",
        "duration": "Halber Tag",
        "category": "alltag",
        "description": "Macht etwas Neues und Aufregendes zusammen",
        "difficulty": "medium",
        "buffs_earned": ["abenteuer_ruf"],
    },
    "trust_exercise": {
        "id": "trust_exercise",
        "title": "Vertrauens-Übung",
        "type": "micro",
        "duration": "10 Minuten",
        "category": "werte",
        "description": "Führt eine Vertrauens-Übung durch",
        "difficulty": "medium",
        "buffs_earned": ["vertrauen_schild"],
    },
}


def get_challenge(challenge_id: str) -> Dict[str, Any]:
    """
    Get challenge by ID.
    
    Args:
        challenge_id: Challenge identifier
        
    Returns:
        Challenge data
        
    Raises:
        ValueError: If challenge not found
    """
    if challenge_id not in CHALLENGE_DATABASE:
        raise ValueError(f"Challenge {challenge_id} not found")
    
    return CHALLENGE_DATABASE[challenge_id]


def list_challenges(category: str = None, difficulty: str = None) -> List[Dict[str, Any]]:
    """
    List challenges with optional filters.
    
    Args:
        category: Optional category filter
        difficulty: Optional difficulty filter
        
    Returns:
        List of challenges
    """
    challenges = []
    
    for challenge_id, challenge_data in CHALLENGE_DATABASE.items():
        if category and challenge_data["category"] != category:
            continue
        if difficulty and challenge_data["difficulty"] != difficulty:
            continue
        
        challenges.append(challenge_data)
    
    return challenges


def get_recommended_challenges(
    weak_areas: List[str],
    difficulty: str = "medium"
) -> List[Dict[str, Any]]:
    """
    Get recommended challenges based on weak areas.
    
    Args:
        weak_areas: List of weak category areas
        difficulty: Preferred difficulty level
        
    Returns:
        List of recommended challenges
    """
    recommended = []
    
    for weak_area in weak_areas:
        challenges = list_challenges(category=weak_area, difficulty=difficulty)
        recommended.extend(challenges)
    
    # Remove duplicates
    seen = set()
    unique_recommended = []
    for challenge in recommended:
        if challenge["id"] not in seen:
            unique_recommended.append(challenge)
            seen.add(challenge["id"])
    
    return unique_recommended[:5]  # Return top 5
