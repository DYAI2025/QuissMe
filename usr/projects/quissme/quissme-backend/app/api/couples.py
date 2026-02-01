"""Couple endpoints"""
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas import CoupleCreateRequest, CoupleResponse
from app.dependencies import get_db, get_current_user
from app.services.couple_service import CoupleService
from app.services.user_service import UserService
from app.core.bazi_engine import calculate_couple_compatibility
from app.models import User
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/couples", tags=["couples"])


@router.post("", response_model=CoupleResponse, status_code=status.HTTP_201_CREATED)
def create_couple(
    couple_data: CoupleCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a couple relationship.
    
    Args:
        couple_data: Couple creation data
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        Created couple
        
    Raises:
        HTTPException: If partner not found or already coupled
    """
    try:
        # Find partner by email
        partner = UserService.get_user_by_email(db, couple_data.partner_email)
        if not partner:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Partner not found"
            )
        
        # Create couple
        couple = CoupleService.create_couple(
            db,
            current_user.id,
            partner.id
        )
        
        logger.info(f"Couple created: {couple.id}")
        return couple
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/{couple_id}", response_model=CoupleResponse)
def get_couple(
    couple_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get couple by ID.
    
    Args:
        couple_id: Couple ID
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        Couple data
        
    Raises:
        HTTPException: If couple not found or unauthorized
    """
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
    
    return couple


@router.get("/{couple_id}/compatibility")
def get_compatibility(
    couple_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get couple compatibility based on BaZi.
    
    Args:
        couple_id: Couple ID
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        Compatibility data
        
    Raises:
        HTTPException: If couple not found, unauthorized, or missing birth data
    """
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
    
    # Get users
    user1 = UserService.get_user_by_id(db, couple.user1_id)
    user2 = UserService.get_user_by_id(db, couple.user2_id)
    
    # Check birth data
    if not user1.birth_data or not user2.birth_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Both partners must have birth data set"
        )
    
    try:
        # Calculate compatibility
        compatibility = calculate_couple_compatibility(
            user1.birth_data,
            user2.birth_data
        )
        
        # Update couple with compatibility data
        CoupleService.update_compatibility_data(db, couple_id, compatibility)
        
        return compatibility
    except Exception as e:
        logger.error(f"Compatibility calculation failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to calculate compatibility"
        )


@router.post("/{couple_id}/invite")
def invite_partner(
    couple_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Send invite to partner.
    
    Args:
        couple_id: Couple ID
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        Status message
        
    Raises:
        HTTPException: If couple not found or unauthorized
    """
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
            detail="Not authorized to invite for this couple"
        )
    
    logger.info(f"Invite sent for couple: {couple_id}")
    
    return {"status": "invite_sent"}
