"""Pattern detection for relationship analysis"""
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta, timezone
import logging

logger = logging.getLogger(__name__)

# Pattern definitions
PATTERN_DEFINITIONS = {
    "intimacy_drop": {
        "name": "Intimacy Drop",
        "description": "Declining intimacy scores detected",
        "threshold": 3,  # 3 consecutive low scores
        "score_threshold": 40,  # Below 40%
        "intervention": "Your intimacy scores have been declining. Consider scheduling quality time together.",
    },
    "conflict_escalation": {
        "name": "Conflict Escalation",
        "description": "Increasing conflict scores detected",
        "threshold": 3,  # 3 consecutive high conflict scores
        "score_threshold": 60,  # Above 60%
        "intervention": "Conflict levels seem to be rising. Try a communication challenge to reconnect.",
    },
    "routine_complacency": {
        "name": "Routine Complacency",
        "description": "No challenges completed recently",
        "threshold": 14,  # 14 days
        "intervention": "It's been a while since you did a challenge together. Try something new!",
    },
    "positive_momentum": {
        "name": "Positive Momentum",
        "description": "Consistently high scores detected",
        "threshold": 3,  # 3 consecutive high scores
        "score_threshold": 75,  # Above 75%
        "intervention": "You're doing great! Keep up this positive momentum.",
    },
}


def detect_intimacy_drop(
    recent_quiz_scores: List[float],
    threshold: int = 3,
    score_threshold: float = 40.0
) -> bool:
    """
    Detect if intimacy scores are dropping.
    
    Args:
        recent_quiz_scores: List of recent quiz scores
        threshold: Number of consecutive low scores to trigger
        score_threshold: Score threshold for "low"
        
    Returns:
        True if pattern detected
    """
    if len(recent_quiz_scores) < threshold:
        return False
    
    # Check last N scores
    recent = recent_quiz_scores[-threshold:]
    low_scores = sum(1 for score in recent if score < score_threshold)
    
    return low_scores >= threshold


def detect_conflict_escalation(
    recent_conflict_scores: List[float],
    threshold: int = 3,
    score_threshold: float = 60.0
) -> bool:
    """
    Detect if conflict scores are escalating.
    
    Args:
        recent_conflict_scores: List of recent conflict quiz scores
        threshold: Number of consecutive high scores to trigger
        score_threshold: Score threshold for "high"
        
    Returns:
        True if pattern detected
    """
    if len(recent_conflict_scores) < threshold:
        return False
    
    # Check last N scores
    recent = recent_conflict_scores[-threshold:]
    high_scores = sum(1 for score in recent if score > score_threshold)
    
    return high_scores >= threshold


def detect_routine_complacency(
    last_challenge_date: Optional[datetime],
    threshold_days: int = 14
) -> bool:
    """
    Detect if couple is in routine complacency.
    
    Args:
        last_challenge_date: Date of last completed challenge
        threshold_days: Days without challenges to trigger
        
    Returns:
        True if pattern detected
    """
    if last_challenge_date is None:
        return True
    
    days_since = (datetime.now(timezone.utc) - last_challenge_date).days
    return days_since >= threshold_days


def detect_positive_momentum(
    recent_quiz_scores: List[float],
    threshold: int = 3,
    score_threshold: float = 75.0
) -> bool:
    """
    Detect if couple has positive momentum.
    
    Args:
        recent_quiz_scores: List of recent quiz scores
        threshold: Number of consecutive high scores to trigger
        score_threshold: Score threshold for "high"
        
    Returns:
        True if pattern detected
    """
    if len(recent_quiz_scores) < threshold:
        return False
    
    # Check last N scores
    recent = recent_quiz_scores[-threshold:]
    high_scores = sum(1 for score in recent if score > score_threshold)
    
    return high_scores >= threshold


def get_pattern_confidence(pattern_type: str, data_points: int) -> float:
    """
    Calculate confidence score for pattern detection.
    
    Args:
        pattern_type: Type of pattern
        data_points: Number of data points used
        
    Returns:
        Confidence score (0-1)
    """
    # More data points = higher confidence
    base_confidence = min(data_points / 10, 1.0)
    
    # Adjust based on pattern type
    if pattern_type == "routine_complacency":
        base_confidence *= 0.9  # Slightly lower confidence
    
    return round(base_confidence, 2)


def get_pattern_definition(pattern_type: str) -> Dict[str, Any]:
    """
    Get pattern definition.
    
    Args:
        pattern_type: Pattern type identifier
        
    Returns:
        Pattern definition
        
    Raises:
        ValueError: If pattern type not found
    """
    if pattern_type not in PATTERN_DEFINITIONS:
        raise ValueError(f"Pattern type {pattern_type} not found")
    
    return PATTERN_DEFINITIONS[pattern_type]
