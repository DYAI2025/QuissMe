"""Unit tests for Core Auth Module"""
import pytest
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from app.core.auth import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    verify_token,
    verify_refresh_token
)
from app.config import get_settings


class TestPasswordHashing:
    """Tests for password hashing functions"""

    def test_hash_password_returns_string(self):
        """Test that hash_password returns a string"""
        hashed = hash_password("testpassword")
        assert isinstance(hashed, str)

    def test_hash_password_not_plaintext(self):
        """Test that hashed password is not plaintext"""
        password = "testpassword"
        hashed = hash_password(password)
        assert hashed != password

    def test_hash_password_different_each_time(self):
        """Test that same password produces different hashes (bcrypt salt)"""
        password = "testpassword"
        hash1 = hash_password(password)
        hash2 = hash_password(password)
        assert hash1 != hash2

    def test_verify_password_correct(self):
        """Test that correct password verifies"""
        password = "testpassword"
        hashed = hash_password(password)
        assert verify_password(password, hashed) is True

    def test_verify_password_incorrect(self):
        """Test that incorrect password fails verification"""
        password = "testpassword"
        hashed = hash_password(password)
        assert verify_password("wrongpassword", hashed) is False

    def test_verify_password_case_sensitive(self):
        """Test that password verification is case sensitive"""
        password = "TestPassword"
        hashed = hash_password(password)
        assert verify_password("testpassword", hashed) is False
        assert verify_password("TESTPASSWORD", hashed) is False

    def test_hash_empty_password(self):
        """Test hashing empty password (should work but not recommended)"""
        hashed = hash_password("")
        assert hashed is not None
        assert verify_password("", hashed) is True


class TestAccessTokenCreation:
    """Tests for access token creation"""

    def test_create_access_token_returns_string(self):
        """Test that create_access_token returns a string"""
        token = create_access_token({"sub": "user123"})
        assert isinstance(token, str)

    def test_create_access_token_is_valid_jwt(self):
        """Test that created token is a valid JWT"""
        token = create_access_token({"sub": "user123"})
        settings = get_settings()

        # Should not raise exception
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        assert payload["sub"] == "user123"

    def test_create_access_token_has_expiration(self):
        """Test that access token has expiration"""
        token = create_access_token({"sub": "user123"})
        settings = get_settings()

        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        assert "exp" in payload

    def test_create_access_token_custom_expiration(self):
        """Test that custom expiration is respected"""
        short_expiry = timedelta(minutes=5)
        token = create_access_token({"sub": "user123"}, expires_delta=short_expiry)
        settings = get_settings()

        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        exp_time = datetime.fromtimestamp(payload["exp"], tz=timezone.utc)
        now = datetime.now(timezone.utc)

        # Token should expire in approximately 5 minutes
        time_diff = exp_time - now
        assert timedelta(minutes=4) < time_diff < timedelta(minutes=6)


class TestRefreshTokenCreation:
    """Tests for refresh token creation"""

    def test_create_refresh_token_returns_string(self):
        """Test that create_refresh_token returns a string"""
        token = create_refresh_token({"sub": "user123"})
        assert isinstance(token, str)

    def test_create_refresh_token_has_type(self):
        """Test that refresh token has type field"""
        token = create_refresh_token({"sub": "user123"})
        settings = get_settings()

        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        assert payload.get("type") == "refresh"

    def test_refresh_token_longer_expiration(self):
        """Test that refresh token has longer expiration than access token"""
        access_token = create_access_token({"sub": "user123"})
        refresh_token = create_refresh_token({"sub": "user123"})
        settings = get_settings()

        access_payload = jwt.decode(access_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        refresh_payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])

        assert refresh_payload["exp"] > access_payload["exp"]


class TestTokenVerification:
    """Tests for token verification"""

    def test_verify_valid_token(self):
        """Test that valid token is verified"""
        token = create_access_token({"sub": "user123"})
        payload = verify_token(token)
        assert payload["sub"] == "user123"

    def test_verify_invalid_token_raises_error(self):
        """Test that invalid token raises error"""
        with pytest.raises(JWTError):
            verify_token("invalid.token.here")

    def test_verify_expired_token_raises_error(self):
        """Test that expired token raises error"""
        # Create token that expires immediately
        token = create_access_token({"sub": "user123"}, expires_delta=timedelta(seconds=-1))

        with pytest.raises(JWTError):
            verify_token(token)

    def test_verify_tampered_token_raises_error(self):
        """Test that tampered token raises error"""
        token = create_access_token({"sub": "user123"})
        # Tamper with the token
        tampered = token[:-5] + "xxxxx"

        with pytest.raises(JWTError):
            verify_token(tampered)


class TestRefreshTokenVerification:
    """Tests for refresh token verification"""

    def test_verify_valid_refresh_token(self):
        """Test that valid refresh token is verified"""
        token = create_refresh_token({"sub": "user123"})
        payload = verify_refresh_token(token)
        assert payload["sub"] == "user123"

    def test_verify_access_token_as_refresh_raises_error(self):
        """Test that access token fails refresh token verification"""
        access_token = create_access_token({"sub": "user123"})

        with pytest.raises(JWTError):
            verify_refresh_token(access_token)


class TestSecurityConsiderations:
    """Tests for security considerations"""

    def test_token_contains_no_sensitive_data(self):
        """Test that token doesn't expose sensitive data"""
        # Tokens are base64 encoded, so we can decode and check
        token = create_access_token({"sub": "user123", "role": "admin"})

        # Decode without verification to inspect payload
        import base64
        payload_part = token.split(".")[1]
        # Add padding if needed
        padding = 4 - len(payload_part) % 4
        if padding != 4:
            payload_part += "=" * padding

        decoded = base64.urlsafe_b64decode(payload_part)
        assert b"password" not in decoded.lower()

    def test_different_users_different_tokens(self):
        """Test that different users get different tokens"""
        token1 = create_access_token({"sub": "user1"})
        token2 = create_access_token({"sub": "user2"})
        assert token1 != token2
