"""SQLAlchemy ORM Models for QuissMe"""
from sqlalchemy import Column, String, Integer, Float, DateTime, JSON, ForeignKey, Boolean, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from app.database import Base


class User(Base):
    """User model for QuissMe accounts"""
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    password_hash = Column(String(255), nullable=False)
    birth_data = Column(JSON, nullable=True)  # {year, month, day, hour, location}
    bazi_chart = Column(JSON, nullable=True)  # Cached BaZi calculation
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    couples_as_user1 = relationship(
        "Couple",
        foreign_keys="Couple.user1_id",
        back_populates="user1",
        cascade="all, delete-orphan"
    )
    couples_as_user2 = relationship(
        "Couple",
        foreign_keys="Couple.user2_id",
        back_populates="user2",
        cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<User {self.email}>"


class Couple(Base):
    """Couple model for relationship pairs"""
    __tablename__ = "couples"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user1_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    user2_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    compatibility_data = Column(JSON, nullable=True)  # BaZi coupling result
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user1 = relationship(
        "User",
        foreign_keys=[user1_id],
        back_populates="couples_as_user1"
    )
    user2 = relationship(
        "User",
        foreign_keys=[user2_id],
        back_populates="couples_as_user2"
    )
    quiz_attempts = relationship(
        "QuizAttempt",
        back_populates="couple",
        cascade="all, delete-orphan"
    )
    active_buffs = relationship(
        "ActiveBuff",
        back_populates="couple",
        cascade="all, delete-orphan"
    )
    challenge_history = relationship(
        "ChallengeHistory",
        back_populates="couple",
        cascade="all, delete-orphan"
    )
    patterns = relationship(
        "CouplePattern",
        back_populates="couple",
        cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<Couple {self.user1_id} + {self.user2_id}>"


class QuizAttempt(Base):
    """Quiz attempt model for tracking quiz submissions"""
    __tablename__ = "quiz_attempts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    couple_id = Column(UUID(as_uuid=True), ForeignKey("couples.id"), nullable=False, index=True)
    quiz_type = Column(String(100), nullable=False)  # liebesprachen, konflikt, intimität, etc.
    answers = Column(JSON, nullable=False)  # {p1_answers: [], p2_answers: []}
    score = Column(Float, nullable=False)  # 0-100
    insights = Column(JSON, nullable=True)  # Generated insights
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    # Relationships
    couple = relationship("Couple", back_populates="quiz_attempts")

    def __repr__(self):
        return f"<QuizAttempt {self.quiz_type} score={self.score}>"


class ActiveBuff(Base):
    """Active buff model for gamification"""
    __tablename__ = "active_buffs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    couple_id = Column(UUID(as_uuid=True), ForeignKey("couples.id"), nullable=False, index=True)
    buff_type = Column(String(100), nullable=False)  # liebesflüsterer, harmonie_welle, etc.
    effect_description = Column(Text, nullable=False)
    starts_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True), nullable=False, index=True)

    # Relationships
    couple = relationship("Couple", back_populates="active_buffs")

    def __repr__(self):
        return f"<ActiveBuff {self.buff_type}>"


class ChallengeHistory(Base):
    """Challenge history model for tracking challenge progress"""
    __tablename__ = "challenge_history"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    couple_id = Column(UUID(as_uuid=True), ForeignKey("couples.id"), nullable=False, index=True)
    challenge_id = Column(String(100), nullable=False)
    status = Column(String(50), nullable=False)  # offered, started, completed, skipped
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    feedback_rating = Column(Integer, nullable=True)  # 1-5
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    couple = relationship("Couple", back_populates="challenge_history")

    def __repr__(self):
        return f"<ChallengeHistory {self.challenge_id} {self.status}>"


class CouplePattern(Base):
    """Couple pattern model for AI-detected patterns"""
    __tablename__ = "couple_patterns"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    couple_id = Column(UUID(as_uuid=True), ForeignKey("couples.id"), nullable=False, index=True)
    pattern_type = Column(String(100), nullable=False)  # intimacy_drop, conflict_escalation, routine_complacency
    confidence = Column(Float, nullable=False)  # 0-1
    triggered_at = Column(DateTime(timezone=True), server_default=func.now())
    intervention_sent = Column(String(255), nullable=True)
    user_response = Column(String(50), nullable=True)  # dismissed, engaged, no_response

    # Relationships
    couple = relationship("Couple", back_populates="patterns")

    def __repr__(self):
        return f"<CouplePattern {self.pattern_type} confidence={self.confidence}>"
