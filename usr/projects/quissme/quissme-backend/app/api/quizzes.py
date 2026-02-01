"""Quiz endpoints"""
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas import QuizSubmitRequest, QuizResultResponse
from app.dependencies import get_db, get_current_user
from app.services.quiz_service import QuizService
from app.services.couple_service import CoupleService
from app.core.quiz_engine import get_quiz, list_quizzes, determine_buffs_earned
from app.models import User
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/quizzes", tags=["quizzes"])


@router.get("")
def list_all_quizzes():
    """
    List all available quizzes.
    
    Returns:
        List of quizzes
    """
    quizzes = list_quizzes()
    return quizzes


@router.get("/{quiz_id}")
def get_quiz_detail(quiz_id: str):
    """
    Get quiz details.
    
    Args:
        quiz_id: Quiz identifier
        
    Returns:
        Quiz data with questions
        
    Raises:
        HTTPException: If quiz not found
    """
    try:
        quiz = get_quiz(quiz_id)
        return quiz
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quiz not found"
        )


@router.post("/{quiz_id}/submit", response_model=QuizResultResponse)
def submit_quiz(
    quiz_id: str,
    quiz_data: QuizSubmitRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Submit quiz answers.
    
    Args:
        quiz_id: Quiz identifier
        quiz_data: Quiz submission data
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        Quiz results with score and insights
        
    Raises:
        HTTPException: If couple not found or unauthorized
    """
    try:
        # Check couple exists and user is authorized
        couple = CoupleService.get_couple_by_id(db, quiz_data.couple_id)
        if not couple:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Couple not found"
            )
        
        # Check authorization
        if couple.user1_id != current_user.id and couple.user2_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to submit quiz for this couple"
            )
        
        # Submit quiz
        attempt = QuizService.submit_quiz(
            db,
            quiz_data.couple_id,
            quiz_id,
            quiz_data.p1_answers,
            quiz_data.p2_answers
        )
        
        # Determine buffs earned
        buffs_earned = determine_buffs_earned(attempt.score, quiz_id)
        
        logger.info(f"Quiz submitted for couple {quiz_data.couple_id}: {quiz_id}")
        
        return {
            "score": attempt.score,
            "insights": attempt.insights,
            "buffs_earned": buffs_earned
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/couples/{couple_id}/results")
def get_quiz_results(
    couple_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    limit: int = 10
):
    """
    Get quiz results for a couple.
    
    Args:
        couple_id: Couple ID
        db: Database session
        current_user: Current authenticated user
        limit: Maximum results
        
    Returns:
        List of quiz attempts
        
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
    
    attempts = QuizService.get_quiz_attempts(db, couple_id, limit=limit)
    
    return [
        {
            "quiz_type": attempt.quiz_type,
            "score": attempt.score,
            "insights": attempt.insights,
            "created_at": attempt.created_at
        }
        for attempt in attempts
    ]
