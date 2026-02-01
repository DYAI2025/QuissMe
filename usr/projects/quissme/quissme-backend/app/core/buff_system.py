"""Buff system for gamification"""
from typing import Dict, List, Any
from datetime import datetime, timedelta, timezone
import logging

logger = logging.getLogger(__name__)

# Buff definitions
BUFF_DEFINITIONS = {
    "liebesflüsterer": {
        "name": "Liebesflüsterer",
        "duration_days": 7,
        "effect": "+15% Empathie",
        "description": "Erhöhte Fähigkeit, deinen Partner zu verstehen und einfühlsam zu kommunizieren.",
        "icon": "💕",
    },
    "harmonie_welle": {
        "name": "Harmonie-Welle",
        "duration_days": 3,
        "effect": "-Konflikte, +Geduld",
        "description": "Reduzierte Konflikte und erhöhte Geduld in schwierigen Momenten.",
        "icon": "🌊",
    },
    "versöhnungs_kraft": {
        "name": "Versöhnungs-Kraft",
        "duration_days": 1,
        "effect": "Nach Streit: schneller Reset",
        "description": "Hilft euch, schneller nach Konflikten wieder zusammenzufinden.",
        "icon": "🕊️",
    },
    "neugier_funkeln": {
        "name": "Neugier-Funkeln",
        "duration_days": 7,
        "effect": "+Fragen stellen, -Assumieren",
        "description": "Mehr Interesse füreinander und weniger Annahmen.",
        "icon": "✨",
    },
    "intimitäts_boost": {
        "name": "Intimitäts-Boost",
        "duration_days": 7,
        "effect": "+Körperliche Nähe",
        "description": "Erhöhte Lust auf körperliche Nähe und Zärtlichkeit.",
        "icon": "🔥",
    },
    "wert_schärfer": {
        "name": "Wert-Schärfer",
        "duration_days": 14,
        "effect": "Klarere Prioritäten",
        "description": "Besseres Verständnis für gemeinsame Werte und Prioritäten.",
        "icon": "💎",
    },
    "vertrauen_schild": {
        "name": "Vertrauen-Schild",
        "duration_days": 7,
        "effect": "+Sicherheit",
        "description": "Erhöhtes Vertrauen und Sicherheit in der Beziehung.",
        "icon": "🛡️",
    },
    "abenteuer_ruf": {
        "name": "Abenteuer-Ruf",
        "duration_days": 7,
        "effect": "+Neue Erfahrungen",
        "description": "Lust auf neue gemeinsame Abenteuer und Erfahrungen.",
        "icon": "🗺️",
    },
}


def get_buff_definition(buff_type: str) -> Dict[str, Any]:
    """
    Get buff definition.
    
    Args:
        buff_type: Buff type identifier
        
    Returns:
        Buff definition
        
    Raises:
        ValueError: If buff type not found
    """
    if buff_type not in BUFF_DEFINITIONS:
        raise ValueError(f"Buff type {buff_type} not found")
    
    return BUFF_DEFINITIONS[buff_type]


def calculate_buff_expiration(buff_type: str) -> datetime:
    """
    Calculate buff expiration time.
    
    Args:
        buff_type: Buff type identifier
        
    Returns:
        Expiration datetime
    """
    buff_def = get_buff_definition(buff_type)
    duration_days = buff_def["duration_days"]
    
    return datetime.now(timezone.utc) + timedelta(days=duration_days)


def is_buff_expired(expires_at: datetime) -> bool:
    """
    Check if buff has expired.
    
    Args:
        expires_at: Expiration datetime
        
    Returns:
        True if expired, False otherwise
    """
    return datetime.now(timezone.utc) > expires_at


def get_buff_time_remaining(expires_at: datetime) -> str:
    """
    Get human-readable time remaining for buff.
    
    Args:
        expires_at: Expiration datetime
        
    Returns:
        Time remaining string
    """
    now = datetime.now(timezone.utc)
    
    if now > expires_at:
        return "Expired"
    
    remaining = expires_at - now
    days = remaining.days
    hours = remaining.seconds // 3600
    minutes = (remaining.seconds % 3600) // 60
    
    if days > 0:
        return f"{days}d {hours}h"
    elif hours > 0:
        return f"{hours}h {minutes}m"
    else:
        return f"{minutes}m"


def list_all_buffs() -> List[Dict[str, Any]]:
    """
    List all available buffs.
    
    Returns:
        List of buff definitions
    """
    return list(BUFF_DEFINITIONS.values())
