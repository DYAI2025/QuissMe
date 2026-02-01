"""Unit tests for Pattern Detection System"""
import pytest
from datetime import datetime, timedelta, timezone
from app.core.pattern_detection import (
    detect_intimacy_drop,
    detect_conflict_escalation,
    detect_routine_complacency,
    detect_positive_momentum,
    get_pattern_confidence,
    get_pattern_definition,
    PATTERN_DEFINITIONS
)


class TestDetectIntimacyDrop:
    """Tests for detect_intimacy_drop function"""

    def test_detects_drop_with_low_scores(self):
        """Test that intimacy drop is detected with consecutive low scores"""
        scores = [35, 30, 25]  # All below 40
        assert detect_intimacy_drop(scores) is True

    def test_no_drop_with_high_scores(self):
        """Test that no drop is detected with high scores"""
        scores = [80, 75, 85]
        assert detect_intimacy_drop(scores) is False

    def test_no_drop_with_insufficient_data(self):
        """Test that no drop is detected with insufficient data"""
        scores = [30, 25]  # Only 2 scores, threshold is 3
        assert detect_intimacy_drop(scores) is False

    def test_custom_threshold(self):
        """Test with custom threshold"""
        scores = [30, 25, 35, 28, 32]
        assert detect_intimacy_drop(scores, threshold=5) is True

    def test_custom_score_threshold(self):
        """Test with custom score threshold"""
        scores = [55, 50, 45]  # Above default 40, below custom 60
        assert detect_intimacy_drop(scores, score_threshold=60) is True

    def test_mixed_scores_no_detection(self):
        """Test that mixed scores don't trigger detection"""
        scores = [80, 30, 75, 25, 90]  # Mixed high and low
        assert detect_intimacy_drop(scores) is False


class TestDetectConflictEscalation:
    """Tests for detect_conflict_escalation function"""

    def test_detects_escalation_with_high_scores(self):
        """Test that conflict escalation is detected with consecutive high scores"""
        scores = [70, 75, 80]  # All above 60
        assert detect_conflict_escalation(scores) is True

    def test_no_escalation_with_low_scores(self):
        """Test that no escalation with low scores"""
        scores = [30, 40, 35]
        assert detect_conflict_escalation(scores) is False

    def test_no_escalation_with_insufficient_data(self):
        """Test that no escalation with insufficient data"""
        scores = [70, 80]
        assert detect_conflict_escalation(scores) is False

    def test_uses_last_n_scores(self):
        """Test that only last N scores are considered"""
        scores = [30, 40, 35, 70, 75, 80]  # Last 3 are high
        assert detect_conflict_escalation(scores, threshold=3) is True


class TestDetectRoutineComplacency:
    """Tests for detect_routine_complacency function"""

    def test_detects_complacency_with_no_challenges(self):
        """Test that complacency is detected when no challenges completed"""
        assert detect_routine_complacency(None) is True

    def test_detects_complacency_with_old_challenge(self):
        """Test that complacency is detected with old last challenge"""
        old_date = datetime.now(timezone.utc) - timedelta(days=20)
        assert detect_routine_complacency(old_date) is True

    def test_no_complacency_with_recent_challenge(self):
        """Test that no complacency with recent challenge"""
        recent_date = datetime.now(timezone.utc) - timedelta(days=5)
        assert detect_routine_complacency(recent_date) is False

    def test_custom_threshold(self):
        """Test with custom threshold"""
        date = datetime.now(timezone.utc) - timedelta(days=10)
        assert detect_routine_complacency(date, threshold_days=7) is True
        assert detect_routine_complacency(date, threshold_days=14) is False


class TestDetectPositiveMomentum:
    """Tests for detect_positive_momentum function"""

    def test_detects_momentum_with_high_scores(self):
        """Test that positive momentum is detected with consecutive high scores"""
        scores = [80, 85, 90]  # All above 75
        assert detect_positive_momentum(scores) is True

    def test_no_momentum_with_low_scores(self):
        """Test that no momentum with low scores"""
        scores = [50, 55, 60]
        assert detect_positive_momentum(scores) is False

    def test_no_momentum_with_insufficient_data(self):
        """Test that no momentum with insufficient data"""
        scores = [80, 85]
        assert detect_positive_momentum(scores) is False

    def test_custom_threshold(self):
        """Test with custom threshold"""
        scores = [80, 85]
        assert detect_positive_momentum(scores, threshold=2) is True


class TestGetPatternConfidence:
    """Tests for get_pattern_confidence function"""

    def test_returns_float(self):
        """Test that confidence is a float"""
        confidence = get_pattern_confidence("intimacy_drop", 5)
        assert isinstance(confidence, float)

    def test_confidence_in_valid_range(self):
        """Test that confidence is in valid range"""
        for data_points in range(1, 20):
            confidence = get_pattern_confidence("intimacy_drop", data_points)
            assert 0 <= confidence <= 1

    def test_more_data_higher_confidence(self):
        """Test that more data points give higher confidence"""
        conf_low = get_pattern_confidence("intimacy_drop", 3)
        conf_high = get_pattern_confidence("intimacy_drop", 10)
        assert conf_high >= conf_low

    def test_routine_complacency_lower_confidence(self):
        """Test that routine complacency has adjusted confidence"""
        conf_normal = get_pattern_confidence("intimacy_drop", 10)
        conf_routine = get_pattern_confidence("routine_complacency", 10)
        assert conf_routine < conf_normal


class TestGetPatternDefinition:
    """Tests for get_pattern_definition function"""

    def test_get_existing_pattern(self):
        """Test getting an existing pattern definition"""
        pattern = get_pattern_definition("intimacy_drop")
        assert pattern is not None
        assert pattern["name"] == "Intimacy Drop"

    def test_get_nonexistent_pattern_raises_error(self):
        """Test getting nonexistent pattern raises error"""
        with pytest.raises(ValueError) as exc_info:
            get_pattern_definition("nonexistent_pattern")
        assert "not found" in str(exc_info.value)

    def test_pattern_has_required_fields(self):
        """Test that pattern has all required fields"""
        required_fields = ["name", "description", "intervention"]
        for pattern_type in PATTERN_DEFINITIONS:
            pattern = get_pattern_definition(pattern_type)
            for field in required_fields:
                assert field in pattern, f"Missing field {field} in {pattern_type}"


class TestPatternDefinitionsIntegrity:
    """Tests for pattern definitions data integrity"""

    def test_all_patterns_have_thresholds(self):
        """Test that all patterns have threshold values"""
        for pattern_type, pattern in PATTERN_DEFINITIONS.items():
            assert "threshold" in pattern, f"Missing threshold in {pattern_type}"

    def test_all_patterns_have_interventions(self):
        """Test that all patterns have intervention text"""
        for pattern_type, pattern in PATTERN_DEFINITIONS.items():
            assert len(pattern["intervention"]) > 10, f"Short intervention in {pattern_type}"

    def test_known_patterns_exist(self):
        """Test that known patterns exist"""
        known_patterns = [
            "intimacy_drop",
            "conflict_escalation",
            "routine_complacency",
            "positive_momentum"
        ]
        for pattern in known_patterns:
            assert pattern in PATTERN_DEFINITIONS


class TestPatternDetectionScenarios:
    """Integration tests for pattern detection scenarios"""

    def test_healthy_relationship_no_negative_patterns(self):
        """Test that healthy relationship shows no negative patterns"""
        quiz_scores = [85, 80, 90, 85, 88]
        last_challenge = datetime.now(timezone.utc) - timedelta(days=5)

        assert detect_intimacy_drop(quiz_scores) is False
        assert detect_conflict_escalation(quiz_scores) is False
        assert detect_routine_complacency(last_challenge) is False
        assert detect_positive_momentum(quiz_scores) is True

    def test_struggling_relationship_patterns(self):
        """Test that struggling relationship shows patterns"""
        quiz_scores = [30, 35, 25, 40, 30]
        last_challenge = datetime.now(timezone.utc) - timedelta(days=30)

        assert detect_intimacy_drop(quiz_scores) is True
        assert detect_routine_complacency(last_challenge) is True

    def test_conflict_period_detection(self):
        """Test that conflict period is detected"""
        conflict_scores = [70, 75, 80, 85, 90]  # Rising conflict

        assert detect_conflict_escalation(conflict_scores) is True
