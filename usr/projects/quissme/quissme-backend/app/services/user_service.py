"""User service for CRUD operations"""
from typing import Optional
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models import User
from app.core.auth import hash_password
import logging

logger = logging.getLogger(__name__)


class UserService:
    """Service for user operations"""
    
    @staticmethod
    def create_user(
        db: Session,
        email: str,
        password: str,
        name: str
    ) -> User:
        """
        Create a new user.
        
        Args:
            db: Database session
            email: User email
            password: Plain text password
            name: User name
            
        Returns:
            Created user
            
        Raises:
            ValueError: If email already exists
        """
        try:
            # Check if user exists
            existing = db.query(User).filter(User.email == email).first()
            if existing:
                raise ValueError(f"User with email {email} already exists")
            
            # Create new user
            user = User(
                email=email,
                password_hash=hash_password(password),
                name=name
            )
            
            db.add(user)
            db.commit()
            db.refresh(user)
            
            logger.info(f"User created: {user.id}")
            return user
        except IntegrityError:
            db.rollback()
            raise ValueError(f"User with email {email} already exists")
    
    @staticmethod
    def get_user_by_id(db: Session, user_id: UUID) -> Optional[User]:
        """
        Get user by ID.
        
        Args:
            db: Database session
            user_id: User ID
            
        Returns:
            User or None
        """
        return db.query(User).filter(User.id == user_id).first()
    
    @staticmethod
    def get_user_by_email(db: Session, email: str) -> Optional[User]:
        """
        Get user by email.
        
        Args:
            db: Database session
            email: User email
            
        Returns:
            User or None
        """
        return db.query(User).filter(User.email == email).first()
    
    @staticmethod
    def update_user(
        db: Session,
        user_id: UUID,
        **kwargs
    ) -> Optional[User]:
        """
        Update user.
        
        Args:
            db: Database session
            user_id: User ID
            **kwargs: Fields to update
            
        Returns:
            Updated user or None
        """
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return None
        
        for key, value in kwargs.items():
            if hasattr(user, key) and value is not None:
                setattr(user, key, value)
        
        db.commit()
        db.refresh(user)
        
        logger.info(f"User updated: {user_id}")
        return user
    
    @staticmethod
    def set_birth_data(
        db: Session,
        user_id: UUID,
        birth_data: dict
    ) -> Optional[User]:
        """
        Set user birth data.
        
        Args:
            db: Database session
            user_id: User ID
            birth_data: Birth data dictionary
            
        Returns:
            Updated user or None
        """
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return None
        
        user.birth_data = birth_data
        
        db.commit()
        db.refresh(user)
        
        logger.info(f"Birth data set for user: {user_id}")
        return user
