"""BaZi astrology engine for couple compatibility"""
from typing import Dict, Any, Optional
import logging
import hashlib
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

# Element mappings for BaZi
ELEMENT_MAP = {
    1: "Wood", 2: "Fire", 3: "Earth", 4: "Metal", 5: "Water"
}

ELEMENT_COMPATIBILITY = {
    ("Wood", "Wood"): {"score": 60, "description": "Growing but potentially overwhelming"},
    ("Wood", "Fire"): {"score": 85, "description": "Fire feeds on wood - passionate and supportive"},
    ("Wood", "Earth"): {"score": 70, "description": "Wood breaks earth - challenging but growth-oriented"},
    ("Wood", "Metal"): {"score": 50, "description": "Metal cuts wood - conflicting energies"},
    ("Wood", "Water"): {"score": 80, "description": "Water nourishes wood - harmonious and flowing"},
    ("Fire", "Fire"): {"score": 65, "description": "Passionate but potentially burning out"},
    ("Fire", "Earth"): {"score": 80, "description": "Fire creates earth - creative and stable"},
    ("Fire", "Metal"): {"score": 55, "description": "Fire melts metal - transformative but intense"},
    ("Fire", "Water"): {"score": 40, "description": "Water extinguishes fire - opposing forces"},
    ("Earth", "Earth"): {"score": 70, "description": "Stable but potentially stagnant"},
    ("Earth", "Metal"): {"score": 85, "description": "Metal comes from earth - supportive and grounded"},
    ("Earth", "Water"): {"score": 60, "description": "Water erodes earth - challenging dynamics"},
    ("Metal", "Metal"): {"score": 65, "description": "Clear but potentially cold"},
    ("Metal", "Water"): {"score": 80, "description": "Metal holds water - protective and nurturing"},
    ("Water", "Water"): {"score": 70, "description": "Deep but potentially drowning"},
}


def get_element_from_year(year: int) -> str:
    """
    Get element from birth year using BaZi system.
    
    Args:
        year: Birth year
        
    Returns:
        Element name (Wood, Fire, Earth, Metal, Water)
    """
    # Simplified BaZi element calculation
    element_index = ((year - 1900) % 10) // 2 + 1
    return ELEMENT_MAP.get(element_index, "Wood")


def get_day_master(year: int, month: int, day: int) -> str:
    """
    Get day master from birth date (simplified).
    
    Args:
        year: Birth year
        month: Birth month
        day: Birth day
        
    Returns:
        Day master element
    """
    # Simplified calculation
    total_days = (year - 1900) * 365 + month * 30 + day
    element_index = (total_days % 10) // 2 + 1
    return ELEMENT_MAP.get(element_index, "Wood")


def calculate_element_harmony(element1: str, element2: str) -> float:
    """
    Calculate harmony score between two elements.
    
    Args:
        element1: First element
        element2: Second element
        
    Returns:
        Harmony score (0-100)
    """
    key = (element1, element2)
    if key in ELEMENT_COMPATIBILITY:
        return float(ELEMENT_COMPATIBILITY[key]["score"])
    
    # Reverse lookup
    key = (element2, element1)
    if key in ELEMENT_COMPATIBILITY:
        return float(ELEMENT_COMPATIBILITY[key]["score"])
    
    return 50.0  # Default neutral score


def calculate_day_master_synergy(dm1: str, dm2: str) -> float:
    """
    Calculate day master synergy.
    
    Args:
        dm1: First day master
        dm2: Second day master
        
    Returns:
        Synergy score (0-100)
    """
    # Same day master = high compatibility
    if dm1 == dm2:
        return 85.0
    
    # Calculate based on element harmony
    return calculate_element_harmony(dm1, dm2)


def calculate_strength_gap(year1: int, year2: int) -> float:
    """
    Calculate strength gap between partners.
    
    Args:
        year1: First birth year
        year2: Second birth year
        
    Returns:
        Strength gap score (0-100, higher = more balanced)
    """
    # Age difference impact
    age_diff = abs(year1 - year2)
    
    # Normalize to 0-100 scale
    if age_diff <= 5:
        return 90.0
    elif age_diff <= 10:
        return 75.0
    elif age_diff <= 15:
        return 60.0
    else:
        return 45.0


def generate_yearly_prediction(element1: str, element2: str, current_year: int) -> str:
    """
    Generate yearly prediction for couple.
    
    Args:
        element1: First partner element
        element2: Second partner element
        current_year: Current year
        
    Returns:
        Prediction text
    """
    harmony = calculate_element_harmony(element1, element2)
    
    if harmony >= 80:
        return f"Year {current_year}: Harmonious energies favor growth and deepening connection. Excellent time for new commitments."
    elif harmony >= 60:
        return f"Year {current_year}: Balanced energies with some challenges. Focus on communication and mutual support."
    else:
        return f"Year {current_year}: Challenging energies require conscious effort. Opportunities for growth through understanding differences."


def generate_recommendations(element1: str, element2: str) -> str:
    """
    Generate recommendations based on element compatibility.
    
    Args:
        element1: First partner element
        element2: Second partner element
        
    Returns:
        Recommendation text
    """
    harmony = calculate_element_harmony(element1, element2)
    
    recommendations = []
    
    if harmony >= 80:
        recommendations.append("Your elements are highly compatible - nurture this natural harmony.")
    elif harmony >= 60:
        recommendations.append("Your elements complement each other - embrace your differences as strengths.")
    else:
        recommendations.append("Your elements present challenges - use these as opportunities for growth.")
    
    # Element-specific recommendations
    if element1 == "Water" or element2 == "Water":
        recommendations.append("Water element brings emotional depth - prioritize emotional communication.")
    
    if element1 == "Fire" or element2 == "Fire":
        recommendations.append("Fire element brings passion - channel this energy into shared goals.")
    
    if element1 == "Earth" or element2 == "Earth":
        recommendations.append("Earth element brings stability - build strong foundations together.")
    
    return " ".join(recommendations)


def calculate_couple_compatibility(
    p1_birth_data: Dict[str, Any],
    p2_birth_data: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Calculate couple compatibility using BaZi system.
    
    Args:
        p1_birth_data: First partner birth data {year, month, day, hour, location}
        p2_birth_data: Second partner birth data {year, month, day, hour, location}
        
    Returns:
        Compatibility data with scores and recommendations
    """
    try:
        # Extract birth data
        year1 = p1_birth_data.get("year")
        month1 = p1_birth_data.get("month")
        day1 = p1_birth_data.get("day")
        
        year2 = p2_birth_data.get("year")
        month2 = p2_birth_data.get("month")
        day2 = p2_birth_data.get("day")
        
        if not all([year1, month1, day1, year2, month2, day2]):
            raise ValueError("Missing required birth data")
        
        # Calculate elements
        element1 = get_element_from_year(year1)
        element2 = get_element_from_year(year2)
        
        # Calculate day masters
        dm1 = get_day_master(year1, month1, day1)
        dm2 = get_day_master(year2, month2, day2)
        
        # Calculate scores
        element_harmony_score = calculate_element_harmony(element1, element2)
        day_master_synergy = calculate_day_master_synergy(dm1, dm2)
        strength_gap = calculate_strength_gap(year1, year2)
        
        # Generate predictions and recommendations
        current_year = datetime.now().year
        yearly_prediction = generate_yearly_prediction(element1, element2, current_year)
        recommendations = generate_recommendations(element1, element2)
        
        return {
            "element_harmony_score": element_harmony_score,
            "day_master_synergy": day_master_synergy,
            "strength_gap": strength_gap,
            "yearly_prediction": yearly_prediction,
            "recommendations": recommendations,
            "elements": {
                "p1_element": element1,
                "p2_element": element2,
                "p1_day_master": dm1,
                "p2_day_master": dm2,
            },
            "calculated_at": datetime.utcnow().isoformat(),
        }
    except Exception as e:
        logger.error(f"BaZi calculation failed: {str(e)}")
        raise
