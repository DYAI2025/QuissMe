"""Pydantic schemas for request/response validation"""
from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID


# ============================================================================
# AUTH SCHEMAS
# ============================================================================

class UserRegister(BaseModel):
    """User registration request"""
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)
    name: str = Field(..., min_length=2, max_length=255)

    @validator('password')
    def password_strength(cls, v):
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain uppercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain digit')
        return v


class UserLogin(BaseModel):
    """User login request"""
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Token response"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshTokenRequest(BaseModel):
    """Refresh token request"""
    refresh_token: str


# ============================================================================
# USER SCHEMAS
# ============================================================================

class BirthDataSchema(BaseModel):
    """Birth data for BaZi calculation"""
    year: int = Field(..., ge=1900, le=2100)
    month: int = Field(..., ge=1, le=12)
    day: int = Field(..., ge=1, le=31)
    hour: int = Field(..., ge=0, le=23)
    location: str = Field(..., min_length=2, max_length=255)


class UserResponse(BaseModel):
    """User response"""
    id: UUID
    email: str
    name: str
    birth_data: Optional[Dict[str, Any]] = None
    created_at: datetime

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    """User update request"""
    name: Optional[str] = Field(None, min_length=2, max_length=255)
    email: Optional[EmailStr] = None


class UserBirthDataUpdate(BaseModel):
    """User birth data update"""
    year: int = Field(..., ge=1900, le=2100)
    month: int = Field(..., ge=1, le=12)
    day: int = Field(..., ge=1, le=31)
    hour: int = Field(..., ge=0, le=23)
    location: str = Field(..., min_length=2, max_length=255)


# ============================================================================
# COUPLE SCHEMAS
# ============================================================================

class CoupleCreateRequest(BaseModel):
    """Create couple request"""
    partner_email: EmailStr


class CoupleResponse(BaseModel):
    """Couple response"""
    id: UUID
    user1_id: UUID
    user2_id: UUID
    compatibility_data: Optional[Dict[str, Any]] = None
    created_at: datetime

    class Config:
        from_attributes = True


class CoupleDetailResponse(BaseModel):
    """Couple detail response with user info"""
    id: UUID
    user1: UserResponse
    user2: UserResponse
    compatibility_data: Optional[Dict[str, Any]] = None
    created_at: datetime

    class Config:
        from_attributes = True


class CompatibilityResponse(BaseModel):
    """Compatibility calculation response"""
    element_harmony_score: float = Field(..., ge=0, le=100)
    day_master_synergy: float = Field(..., ge=0, le=100)
    strength_gap: float = Field(..., ge=0, le=100)
    yearly_prediction: str
    recommendations: str


# ============================================================================
# QUIZ SCHEMAS
# ============================================================================

class QuizQuestion(BaseModel):
    """Quiz question"""
    id: str
    text: str
    options: List[str]


class QuizResponse(BaseModel):
    """Quiz response"""
    id: str
    title: str
    category: str
    description: str
    question_count: int
    questions: Optional[List[QuizQuestion]] = None


class QuizSubmitRequest(BaseModel):
    """Quiz submission request"""
    couple_id: UUID
    quiz_type: str
    p1_answers: List[int] = Field(..., min_items=1)
    p2_answers: List[int] = Field(..., min_items=1)

    @validator('p1_answers', 'p2_answers')
    def validate_answers(cls, v):
        for answer in v:
            if not 0 <= answer <= 4:
                raise ValueError('Answer must be between 0 and 4')
        return v


class QuizResultResponse(BaseModel):
    """Quiz result response"""
    id: UUID
    quiz_type: str
    score: float = Field(..., ge=0, le=100)
    insights: Dict[str, Any]
    buffs_earned: List[str] = []
    created_at: datetime

    class Config:
        from_attributes = True


class QuizHistoryResponse(BaseModel):
    """Quiz history response"""
    id: UUID
    quiz_type: str
    score: float
    insights: Dict[str, Any]
    created_at: datetime

    class Config:
        from_attributes = True


# ============================================================================
# BUFF SCHEMAS
# ============================================================================

class BuffResponse(BaseModel):
    """Active buff response"""
    id: UUID
    buff_type: str
    effect_description: str
    starts_at: datetime
    expires_at: datetime

    class Config:
        from_attributes = True


class BuffHistoryResponse(BaseModel):
    """Buff history response"""
    id: UUID
    buff_type: str
    effect_description: str
    starts_at: datetime
    expires_at: datetime

    class Config:
        from_attributes = True


# ============================================================================
# CHALLENGE SCHEMAS
# ============================================================================

class ChallengeResponse(BaseModel):
    """Challenge response"""
    id: str
    title: str
    type: str  # micro, daily_ritual, deep_dive, +18
    duration: str
    description: str
    category: str


class ChallengeHistoryResponse(BaseModel):
    """Challenge history response"""
    id: UUID
    challenge_id: str
    status: str  # offered, started, completed, skipped
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    feedback_rating: Optional[int] = None

    class Config:
        from_attributes = True


class ChallengeCompleteRequest(BaseModel):
    """Challenge completion request"""
    feedback_rating: int = Field(..., ge=1, le=5)


class ChallengeRecommendationResponse(BaseModel):
    """Challenge recommendation response"""
    challenges: List[ChallengeResponse]
    reason: str


# ============================================================================
# PATTERN SCHEMAS
# ============================================================================

class PatternResponse(BaseModel):
    """Pattern response"""
    id: UUID
    pattern_type: str
    confidence: float = Field(..., ge=0, le=1)
    triggered_at: datetime
    intervention_sent: Optional[str] = None
    user_response: Optional[str] = None

    class Config:
        from_attributes = True


class PatternAnalysisResponse(BaseModel):
    """Pattern analysis response"""
    patterns_detected: List[PatternResponse]
    interventions: List[str]
    recommendations: List[str]


# ============================================================================
# ERROR SCHEMAS
# ============================================================================

class ErrorResponse(BaseModel):
    """Error response"""
    detail: str
    status_code: int
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class ValidationErrorResponse(BaseModel):
    """Validation error response"""
    detail: List[Dict[str, Any]]
    status_code: int = 422
