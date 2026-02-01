"""Unit tests for Buff System"""
import pytest
from datetime import datetime, timedelta, timezone
from app.core.buff_system import (
    get_buff_definition,
    calculate_buff_expiration,
    is_buff_expired,
    get_buff_time_remaining,
    list_all_buffs,
    BUFF_DEFINITIONS
)


class TestGetBuffDefinition:
    """Tests for get_buff_definition function"""

    def test_get_existing_buff(self):
        """Test getting an existing buff definition"""
        buff = get_buff_definition("liebesflüsterer")
        assert buff is not None
        assert buff["name"] == "Liebesflüsterer"

    def test_get_nonexistent_buff_raises_error(self):
        """Test getting nonexistent buff raises error"""
        with pytest.raises(ValueError) as exc_info:
            get_buff_definition("nonexistent_buff")
        assert "not found" in str(exc_info.value)

    def test_buff_has_required_fields(self):
        """Test that buff has all required fields"""
        required_fields = ["name", "duration_days", "effect", "description", "icon"]
        for buff_type in BUFF_DEFINITIONS:
            buff = get_buff_definition(buff_type)
            for field in required_fields:
                assert field in buff, f"Missing field {field} in {buff_type}"

    def test_all_known_buffs_accessible(self):
        """Test that all known buffs are accessible"""
        known_buffs = [
            "liebesflüsterer",
            "harmonie_welle",
            "versöhnungs_kraft",
            "neugier_funkeln",
            "intimitäts_boost",
            "wert_schärfer",
        ]
        for buff_type in known_buffs:
            buff = get_buff_definition(buff_type)
            assert buff is not None


class TestCalculateBuffExpiration:
    """Tests for calculate_buff_expiration function"""

    def test_expiration_in_future(self):
        """Test that expiration is in the future"""
        now = datetime.now(timezone.utc)
        expiration = calculate_buff_expiration("liebesflüsterer")
        assert expiration > now

    def test_expiration_matches_duration(self):
        """Test that expiration matches defined duration"""
        buff = get_buff_definition("liebesflüsterer")
        duration_days = buff["duration_days"]

        now = datetime.now(timezone.utc)
        expiration = calculate_buff_expiration("liebesflüsterer")

        expected_min = now + timedelta(days=duration_days - 1)
        expected_max = now + timedelta(days=duration_days + 1)

        assert expected_min < expiration < expected_max

    def test_different_buffs_different_durations(self):
        """Test that buffs with different durations have different expirations"""
        exp_7day = calculate_buff_expiration("liebesflüsterer")  # 7 days
        exp_3day = calculate_buff_expiration("harmonie_welle")  # 3 days
        exp_1day = calculate_buff_expiration("versöhnungs_kraft")  # 1 day

        assert exp_7day > exp_3day > exp_1day

    def test_expiration_has_timezone(self):
        """Test that expiration datetime is timezone-aware"""
        expiration = calculate_buff_expiration("liebesflüsterer")
        assert expiration.tzinfo is not None


class TestIsBuffExpired:
    """Tests for is_buff_expired function"""

    def test_future_date_not_expired(self):
        """Test that future date is not expired"""
        future = datetime.now(timezone.utc) + timedelta(days=1)
        assert is_buff_expired(future) is False

    def test_past_date_is_expired(self):
        """Test that past date is expired"""
        past = datetime.now(timezone.utc) - timedelta(days=1)
        assert is_buff_expired(past) is True

    def test_now_is_expired(self):
        """Test that exact now time is considered expired"""
        # This is a boundary case - depends on implementation
        now = datetime.now(timezone.utc)
        # Slightly in the past to ensure expiration
        past = now - timedelta(seconds=1)
        assert is_buff_expired(past) is True


class TestGetBuffTimeRemaining:
    """Tests for get_buff_time_remaining function"""

    def test_expired_returns_expired_string(self):
        """Test that expired buff returns 'Expired'"""
        past = datetime.now(timezone.utc) - timedelta(days=1)
        remaining = get_buff_time_remaining(past)
        assert remaining == "Expired"

    def test_days_remaining_format(self):
        """Test that days remaining shows correct format"""
        future = datetime.now(timezone.utc) + timedelta(days=3, hours=5)
        remaining = get_buff_time_remaining(future)
        assert "d" in remaining

    def test_hours_remaining_format(self):
        """Test that hours remaining shows correct format"""
        future = datetime.now(timezone.utc) + timedelta(hours=5, minutes=30)
        remaining = get_buff_time_remaining(future)
        assert "h" in remaining

    def test_minutes_remaining_format(self):
        """Test that minutes remaining shows correct format"""
        future = datetime.now(timezone.utc) + timedelta(minutes=30)
        remaining = get_buff_time_remaining(future)
        assert "m" in remaining


class TestListAllBuffs:
    """Tests for list_all_buffs function"""

    def test_returns_list(self):
        """Test that function returns a list"""
        buffs = list_all_buffs()
        assert isinstance(buffs, list)

    def test_returns_all_buffs(self):
        """Test that all buffs are returned"""
        buffs = list_all_buffs()
        assert len(buffs) == len(BUFF_DEFINITIONS)

    def test_buffs_have_required_fields(self):
        """Test that returned buffs have required fields"""
        buffs = list_all_buffs()
        required_fields = ["name", "duration_days", "effect", "description", "icon"]
        for buff in buffs:
            for field in required_fields:
                assert field in buff


class TestBuffDefinitionsIntegrity:
    """Tests for buff definitions data integrity"""

    def test_all_buffs_have_positive_duration(self):
        """Test that all buffs have positive duration"""
        for buff_type, buff in BUFF_DEFINITIONS.items():
            assert buff["duration_days"] > 0, f"Invalid duration for {buff_type}"

    def test_all_buffs_have_icons(self):
        """Test that all buffs have emoji icons"""
        for buff_type, buff in BUFF_DEFINITIONS.items():
            assert len(buff["icon"]) > 0, f"Missing icon for {buff_type}"

    def test_all_buffs_have_descriptions(self):
        """Test that all buffs have meaningful descriptions"""
        for buff_type, buff in BUFF_DEFINITIONS.items():
            assert len(buff["description"]) > 10, f"Short description for {buff_type}"

    def test_buff_names_are_german(self):
        """Test that buff names are in German"""
        # Check for German umlauts or common German words
        german_indicators = ["ü", "ö", "ä", "ß", "Welle", "Kraft", "Boost"]
        all_names = " ".join(b["name"] for b in BUFF_DEFINITIONS.values())
        assert any(ind in all_names for ind in german_indicators)
