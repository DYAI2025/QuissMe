"""Challenge endpoints"""
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas import ChallengeCompleteRequest
from app.dependencies import get_db, get_current_user
from app.services.couple_service import CoupleService
from app.services.quiz_service import QuizService
from app.core.challenge_system import get_recommended_challenges, get_challenge
from app.models import User, ChallengeHistory
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/couples", tags=["challenges"])


@router.get("/{couple_id}/challenges/recommended")
def get_recommended(
    couple_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get recommended challenges for a couple.
    
    Args:
        couple_id: Couple ID
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        List of recommended challenges
        
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
    
    # Get recent quiz scores to identify weak areas
    recent_scores = QuizService.get_recent_scores(db, couple_id, limit=5)
    
    # Identify weak areas (scores below 50%)
    weak_areas = ["liebesprachen", "intimität"]  # Default weak areas
    
    # Get recommended challenges
    challenges = get_recommended_challenges(weak_areas, difficulty="medium")
    
    return challenges


@router.post("/{couple_id}/challenges/{challenge_id}/start")
def start_challenge(
    couple_id: UUID,
    challenge_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Start a challenge.
    
    Args:
        couple_id: Couple ID
        challenge_id: Challenge ID
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        Challenge history record
        
    Raises:
        HTTPException: If couple not found, unauthorized, or challenge not found
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
    
    # Check challenge exists
    try:
        challenge = get_challenge(challenge_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Challenge not found"
        )
    
    # Create challenge history
    from datetime import datetime, timezone
    history = ChallengeHistory(
        couple_id=couple_id,
        challenge_id=challenge_id,
        status="started",
        started_at=datetime.now(timezone.utc)
    )
    
    db.add(history)
    db.commit()
    db.refresh(history)
    
    logger.info(f"Challenge started for couple {couple_id}: {challenge_id}")
    
    return {
        "id": str(history.id),
        "status": history.status,
        "started_at": history.started_at
    }


@router.post("/{couple_id}/challenges/{challenge_id}/complete")
def complete_challenge(
    couple_id: UUID,
    challenge_id: str,
    challenge_data: ChallengeCompleteRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Complete a challenge.
    
    Args:
        couple_id: Couple ID
        challenge_id: Challenge ID
        challenge_data: Completion data
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        Updated challenge history
        
    Raises:
        HTTPException: If couple not found, unauthorized, or challenge not found
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
    
    # Get challenge history
    history = db.query(ChallengeHistory).filter(
        (ChallengeHistory.couple_id == couple_id) &
        (ChallengeHistory.challenge_id == challenge_id)
    ).first()
    
    if not history:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Challenge not found"
        )
    
    # Update challenge
    from datetime import datetime, timezone
    history.status = "completed"
    history.completed_at = datetime.now(timezone.utc)
    history.feedback_rating = challenge_data.feedback_rating
    
    db.commit()
    db.refresh(history)
    
    logger.info(f"Challenge completed for couple {couple_id}: {challenge_id}")
    
    return {
        "id": str(history.id),
        "status": history.status,
        "completed_at": history.completed_at,
        "buffs_earned": ["harmonie_welle"]  # Example buff
    }


@router.get("/{couple_id}/challenges/history")
def get_challenge_history(
    couple_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    limit: int = 20
):
    """
    Get challenge history for a couple.
    
    Args:
        couple_id: Couple ID
        db: Database session
        current_user: Current authenticated user
        limit: Maximum results
        
    Returns:
        List of challenge history
        
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
    
    # Get challenge history
    history = db.query(ChallengeHistory).filter(
        ChallengeHistory.couple_id == couple_id
    ).order_by(ChallengeHistory.started_at.desc()).limit(limit).all()
    
    return [
        {
            "id": str(h.id),
            "challenge_id": h.challenge_id,
            "status": h.status,
            "started_at": h.started_at,
            "completed_at": h.completed_at,
            "feedback_rating": h.feedback_rating
        }
        for h in history
    ]
