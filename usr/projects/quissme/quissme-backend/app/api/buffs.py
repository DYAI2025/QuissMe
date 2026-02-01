"""Buff endpoints"""
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.dependencies import get_db, get_current_user
from app.services.couple_service import CoupleService
from app.models import User, ActiveBuff
from app.core.buff_system import get_buff_definition, is_buff_expired, get_buff_time_remaining
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/couples", tags=["buffs"])


@router.get("/{couple_id}/buffs")
def get_active_buffs(
    couple_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get active buffs for a couple.
    
    Args:
        couple_id: Couple ID
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        List of active buffs
        
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
    
    # Get active buffs
    buffs = db.query(ActiveBuff).filter(
        ActiveBuff.couple_id == couple_id
    ).all()
    
    # Filter expired buffs
    active_buffs = [
        {
            "id": str(buff.id),
            "buff_type": buff.buff_type,
            "effect_description": buff.effect_description,
            "expires_at": buff.expires_at,
            "time_remaining": get_buff_time_remaining(buff.expires_at)
        }
        for buff in buffs
        if not is_buff_expired(buff.expires_at)
    ]
    
    return active_buffs


@router.get("/{couple_id}/buffs/history")
def get_buff_history(
    couple_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    limit: int = 20
):
    """
    Get buff history for a couple.
    
    Args:
        couple_id: Couple ID
        db: Database session
        current_user: Current authenticated user
        limit: Maximum results
        
    Returns:
        List of buffs (active and expired)
        
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
    
    # Get buff history
    buffs = db.query(ActiveBuff).filter(
        ActiveBuff.couple_id == couple_id
    ).order_by(ActiveBuff.starts_at.desc()).limit(limit).all()
    
    return [
        {
            "id": str(buff.id),
            "buff_type": buff.buff_type,
            "effect_description": buff.effect_description,
            "starts_at": buff.starts_at,
            "expires_at": buff.expires_at,
            "is_active": not is_buff_expired(buff.expires_at)
        }
        for buff in buffs
    ]
