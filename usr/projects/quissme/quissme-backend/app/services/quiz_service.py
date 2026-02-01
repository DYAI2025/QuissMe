"""Quiz service for quiz operations"""
from typing import Optional, List
from uuid import UUID
from sqlalchemy.orm import Session
from app.models import QuizAttempt, Couple
from app.core.quiz_engine import calculate_quiz_score, generate_insights, determine_buffs_earned
import logging

logger = logging.getLogger(__name__)


class QuizService:
    """Service for quiz operations"""
    
    @staticmethod
    def submit_quiz(
        db: Session,
        couple_id: UUID,
        quiz_type: str,
        p1_answers: List[int],
        p2_answers: List[int]
    ) -> QuizAttempt:
        """
        Submit quiz answers and calculate results.
        
        Args:
            db: Database session
            couple_id: Couple ID
            quiz_type: Quiz type identifier
            p1_answers: Partner 1 answers
            p2_answers: Partner 2 answers
            
        Returns:
            Quiz attempt record
            
        Raises:
            ValueError: If couple not found
        """
        # Check couple exists
        couple = db.query(Couple).filter(Couple.id == couple_id).first()
        if not couple:
            raise ValueError(f"Couple {couple_id} not found")
        
        # Calculate score
        score = calculate_quiz_score(p1_answers, p2_answers, quiz_type)
        
        # Generate insights
        insights = generate_insights(score, quiz_type, p1_answers, p2_answers)
        
        # Create quiz attempt
        attempt = QuizAttempt(
            couple_id=couple_id,
            quiz_type=quiz_type,
            answers={
                "p1_answers": p1_answers,
                "p2_answers": p2_answers
            },
            score=score,
            insights=insights
        )
        
        db.add(attempt)
        db.commit()
        db.refresh(attempt)
        
        logger.info(f"Quiz submitted for couple {couple_id}: {quiz_type} (score: {score})")
        return attempt
    
    @staticmethod
    def get_quiz_attempts(
        db: Session,
        couple_id: UUID,
        quiz_type: Optional[str] = None,
        limit: int = 10
    ) -> List[QuizAttempt]:
        """
        Get quiz attempts for a couple.
        
        Args:
            db: Database session
            couple_id: Couple ID
            quiz_type: Optional quiz type filter
            limit: Maximum results
            
        Returns:
            List of quiz attempts
        """
        query = db.query(QuizAttempt).filter(QuizAttempt.couple_id == couple_id)
        
        if quiz_type:
            query = query.filter(QuizAttempt.quiz_type == quiz_type)
        
        return query.order_by(QuizAttempt.created_at.desc()).limit(limit).all()
    
    @staticmethod
    def get_recent_scores(
        db: Session,
        couple_id: UUID,
        quiz_type: Optional[str] = None,
        limit: int = 5
    ) -> List[float]:
        """
        Get recent quiz scores for pattern detection.
        
        Args:
            db: Database session
            couple_id: Couple ID
            quiz_type: Optional quiz type filter
            limit: Number of recent scores
            
        Returns:
            List of scores
        """
        attempts = QuizService.get_quiz_attempts(
            db, couple_id, quiz_type, limit
        )
        return [attempt.score for attempt in reversed(attempts)]
