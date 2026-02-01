"""Pattern detection endpoints"""
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.dependencies import get_db, get_current_user
from app.services.couple_service import CoupleService
from app.services.quiz_service import QuizService
from app.core.pattern_detection import (
    detect_intimacy_drop,
    detect_conflict_escalation,
    detect_routine_complacency,
    detect_positive_momentum,
    get_pattern_confidence,
    get_pattern_definition
)
from app.models import User, CouplePattern
from datetime import datetime, timezone
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/couples", tags=["patterns"])


@router.get("/{couple_id}/patterns")
def get_patterns(
    couple_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get detected patterns for a couple.
    
    Args:
        couple_id: Couple ID
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        List of detected patterns
        
    Raises:
        HTTPException: If couple not found or unauthorized
    """
    # Check couple exists and user is authorized
    couple = CoupleService.get_couple_by_id(db, couple_id)
    if not couple:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Couple not found"
        )
    
    # Check authorization
    if couple.user1_id != current_user.id and couple.user2_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this couple"
        )
    
    # Get patterns from database
    patterns = db.query(CouplePattern).filter(
        CouplePattern.couple_id == couple_id
    ).order_by(CouplePattern.triggered_at.desc()).all()
    
    return [
        {
            "pattern_type": pattern.pattern_type,
            "confidence": pattern.confidence,
            "triggered_at": pattern.triggered_at,
            "intervention_sent": pattern.intervention_sent,
            "user_response": pattern.user_response
        }
        for pattern in patterns
    ]


@router.post("/{couple_id}/patterns/analyze")
def analyze_patterns(
    couple_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Analyze couple patterns based on recent quiz data.
    
    Args:
        couple_id: Couple ID
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        Analysis results with detected patterns
        
    Raises:
        HTTPException: If couple not found or unauthorized
    """
    # Check couple exists and user is authorized
    couple = CoupleService.get_couple_by_id(db, couple_id)
    if not couple:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Couple not found"
        )
    
    # Check authorization
    if couple.user1_id != current_user.id and couple.user2_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this couple"
        )
    
    patterns_detected = []
    interventions = []
    
    try:
        # Get recent quiz scores
        recent_scores = QuizService.get_recent_scores(db, couple_id, limit=5)
        
        if len(recent_scores) >= 3:
            # Check for intimacy drop
            if detect_intimacy_drop(recent_scores):
                pattern_def = get_pattern_definition("intimacy_drop")
                confidence = get_pattern_confidence("intimacy_drop", len(recent_scores))
                
                # Save pattern
                pattern = CouplePattern(
                    couple_id=couple_id,
                    pattern_type="intimacy_drop",
                    confidence=confidence,
                    triggered_at=datetime.now(timezone.utc),
                    intervention_sent=pattern_def["intervention"]
                )
                db.add(pattern)
                
                patterns_detected.append("intimacy_drop")
                interventions.append(pattern_def["intervention"])
            
            # Check for conflict escalation
            if detect_conflict_escalation(recent_scores):
                pattern_def = get_pattern_definition("conflict_escalation")
                confidence = get_pattern_confidence("conflict_escalation", len(recent_scores))
                
                # Save pattern
                pattern = CouplePattern(
                    couple_id=couple_id,
                    pattern_type="conflict_escalation",
                    confidence=confidence,
                    triggered_at=datetime.now(timezone.utc),
                    intervention_sent=pattern_def["intervention"]
                )
                db.add(pattern)
                
                patterns_detected.append("conflict_escalation")
                interventions.append(pattern_def["intervention"])
            
            # Check for positive momentum
            if detect_positive_momentum(recent_scores):
                pattern_def = get_pattern_definition("positive_momentum")
                confidence = get_pattern_confidence("positive_momentum", len(recent_scores))
                
                # Save pattern
                pattern = CouplePattern(
                    couple_id=couple_id,
                    pattern_type="positive_momentum",
                    confidence=confidence,
                    triggered_at=datetime.now(timezone.utc),
                    intervention_sent=pattern_def["intervention"]
                )
                db.add(pattern)
                
                patterns_detected.append("positive_momentum")
                interventions.append(pattern_def["intervention"])
        
        # Check for routine complacency
        # Get last challenge completion date
        from app.models import ChallengeHistory
        last_challenge = db.query(ChallengeHistory).filter(
            (ChallengeHistory.couple_id == couple_id) &
            (ChallengeHistory.status == "completed")
        ).order_by(ChallengeHistory.completed_at.desc()).first()
        
        last_challenge_date = last_challenge.completed_at if last_challenge else None
        
        if detect_routine_complacency(last_challenge_date):
            pattern_def = get_pattern_definition("routine_complacency")
            confidence = 0.8  # High confidence for this pattern
            
            # Save pattern
            pattern = CouplePattern(
                couple_id=couple_id,
                pattern_type="routine_complacency",
                confidence=confidence,
                triggered_at=datetime.now(timezone.utc),
                intervention_sent=pattern_def["intervention"]
            )
            db.add(pattern)
            
            patterns_detected.append("routine_complacency")
            interventions.append(pattern_def["intervention"])
        
        db.commit()
        
        logger.info(f"Pattern analysis completed for couple {couple_id}: {patterns_detected}")
        
        return {
            "patterns_detected": patterns_detected,
            "interventions": interventions,
            "analysis_timestamp": datetime.now(timezone.utc)
        }
    except Exception as e:
        db.rollback()
        logger.error(f"Pattern analysis failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to analyze patterns"
        )
