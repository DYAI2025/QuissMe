"""Couple service for CRUD operations"""
from typing import Optional, List
from uuid import UUID
from sqlalchemy.orm import Session
from app.models import Couple, User
import logging

logger = logging.getLogger(__name__)


class CoupleService:
    """Service for couple operations"""
    
    @staticmethod
    def create_couple(
        db: Session,
        user1_id: UUID,
        user2_id: UUID
    ) -> Couple:
        """
        Create a new couple relationship.
        
        Args:
            db: Database session
            user1_id: First user ID
            user2_id: Second user ID
            
        Returns:
            Created couple
            
        Raises:
            ValueError: If users don't exist or already coupled
        """
        # Check users exist
        user1 = db.query(User).filter(User.id == user1_id).first()
        user2 = db.query(User).filter(User.id == user2_id).first()
        
        if not user1 or not user2:
            raise ValueError("One or both users not found")
        
        # Check if already coupled
        existing = db.query(Couple).filter(
            ((Couple.user1_id == user1_id) & (Couple.user2_id == user2_id)) |
            ((Couple.user1_id == user2_id) & (Couple.user2_id == user1_id))
        ).first()
        
        if existing:
            raise ValueError("Users are already coupled")
        
        # Create couple
        couple = Couple(
            user1_id=user1_id,
            user2_id=user2_id
        )
        
        db.add(couple)
        db.commit()
        db.refresh(couple)
        
        logger.info(f"Couple created: {couple.id}")
        return couple
    
    @staticmethod
    def get_couple_by_id(db: Session, couple_id: UUID) -> Optional[Couple]:
        """
        Get couple by ID.
        
        Args:
            db: Database session
            couple_id: Couple ID
            
        Returns:
            Couple or None
        """
        return db.query(Couple).filter(Couple.id == couple_id).first()
    
    @staticmethod
    def get_user_couples(db: Session, user_id: UUID) -> List[Couple]:
        """
        Get all couples for a user.
        
        Args:
            db: Database session
            user_id: User ID
            
        Returns:
            List of couples
        """
        return db.query(Couple).filter(
            (Couple.user1_id == user_id) | (Couple.user2_id == user_id)
        ).all()
    
    @staticmethod
    def update_compatibility_data(
        db: Session,
        couple_id: UUID,
        compatibility_data: dict
    ) -> Optional[Couple]:
        """
        Update couple compatibility data.
        
        Args:
            db: Database session
            couple_id: Couple ID
            compatibility_data: Compatibility data dictionary
            
        Returns:
            Updated couple or None
        """
        couple = db.query(Couple).filter(Couple.id == couple_id).first()
        if not couple:
            return None
        
        couple.compatibility_data = compatibility_data
        
        db.commit()
        db.refresh(couple)
        
        logger.info(f"Compatibility data updated for couple: {couple_id}")
        return couple
