"""Unit tests for Challenge System"""
import pytest
from app.core.challenge_system import (
    get_challenge,
    list_challenges,
    get_recommended_challenges,
    CHALLENGE_DATABASE
)


class TestGetChallenge:
    """Tests for get_challenge function"""

    def test_get_existing_challenge(self):
        """Test getting an existing challenge"""
        challenge = get_challenge("gratitude_ritual")
        assert challenge is not None
        assert challenge["title"] == "Dankbarkeits-Ritual"

    def test_get_nonexistent_challenge_raises_error(self):
        """Test getting nonexistent challenge raises error"""
        with pytest.raises(ValueError) as exc_info:
            get_challenge("nonexistent_challenge")
        assert "not found" in str(exc_info.value)

    def test_challenge_has_required_fields(self):
        """Test that challenge has all required fields"""
        required_fields = ["id", "title", "type", "duration", "category", "description", "difficulty", "buffs_earned"]
        for challenge_id in CHALLENGE_DATABASE:
            challenge = get_challenge(challenge_id)
            for field in required_fields:
                assert field in challenge, f"Missing field {field} in {challenge_id}"


class TestListChallenges:
    """Tests for list_challenges function"""

    def test_list_all_challenges(self):
        """Test listing all challenges"""
        challenges = list_challenges()
        assert len(challenges) == len(CHALLENGE_DATABASE)

    def test_list_challenges_by_category(self):
        """Test listing challenges by category"""
        challenges = list_challenges(category="liebesprachen")
        assert len(challenges) > 0
        for challenge in challenges:
            assert challenge["category"] == "liebesprachen"

    def test_list_challenges_by_difficulty(self):
        """Test listing challenges by difficulty"""
        challenges = list_challenges(difficulty="easy")
        assert len(challenges) > 0
        for challenge in challenges:
            assert challenge["difficulty"] == "easy"

    def test_list_challenges_combined_filters(self):
        """Test listing challenges with combined filters"""
        challenges = list_challenges(category="intimität", difficulty="easy")
        for challenge in challenges:
            assert challenge["category"] == "intimität"
            assert challenge["difficulty"] == "easy"

    def test_list_challenges_no_results(self):
        """Test listing challenges with no matching results"""
        challenges = list_challenges(category="nonexistent")
        assert len(challenges) == 0


class TestGetRecommendedChallenges:
    """Tests for get_recommended_challenges function"""

    def test_returns_challenges_for_weak_areas(self):
        """Test that challenges are returned for weak areas"""
        weak_areas = ["liebesprachen", "intimität"]
        challenges = get_recommended_challenges(weak_areas)
        assert len(challenges) > 0

    def test_respects_difficulty_preference(self):
        """Test that difficulty preference is respected"""
        weak_areas = ["liebesprachen"]
        challenges = get_recommended_challenges(weak_areas, difficulty="easy")
        for challenge in challenges:
            assert challenge["difficulty"] == "easy"

    def test_returns_max_5_challenges(self):
        """Test that maximum 5 challenges are returned"""
        weak_areas = ["liebesprachen", "intimität", "konflikt", "alltag"]
        challenges = get_recommended_challenges(weak_areas)
        assert len(challenges) <= 5

    def test_no_duplicate_challenges(self):
        """Test that no duplicate challenges are returned"""
        weak_areas = ["liebesprachen", "intimität"]
        challenges = get_recommended_challenges(weak_areas)
        challenge_ids = [c["id"] for c in challenges]
        assert len(challenge_ids) == len(set(challenge_ids))

    def test_empty_weak_areas_returns_empty(self):
        """Test that empty weak areas returns empty list"""
        challenges = get_recommended_challenges([])
        assert len(challenges) == 0


class TestChallengeDatabaseIntegrity:
    """Tests for challenge database integrity"""

    def test_all_challenges_have_unique_ids(self):
        """Test that all challenge IDs are unique"""
        challenge_ids = list(CHALLENGE_DATABASE.keys())
        assert len(challenge_ids) == len(set(challenge_ids))

    def test_all_challenge_types_valid(self):
        """Test that all challenge types are valid"""
        valid_types = {"micro", "daily_ritual", "deep_dive", "+18"}
        for challenge_id, challenge in CHALLENGE_DATABASE.items():
            assert challenge["type"] in valid_types, f"Invalid type in {challenge_id}"

    def test_all_difficulties_valid(self):
        """Test that all difficulties are valid"""
        valid_difficulties = {"easy", "medium", "hard"}
        for challenge_id, challenge in CHALLENGE_DATABASE.items():
            assert challenge["difficulty"] in valid_difficulties, f"Invalid difficulty in {challenge_id}"

    def test_all_challenges_have_buffs(self):
        """Test that all challenges have at least one buff"""
        for challenge_id, challenge in CHALLENGE_DATABASE.items():
            assert len(challenge["buffs_earned"]) > 0, f"No buffs in {challenge_id}"

    def test_challenge_categories_exist(self):
        """Test that expected categories exist"""
        categories = set(c["category"] for c in CHALLENGE_DATABASE.values())
        expected = {"liebesprachen", "intimität", "konflikt", "alltag", "zukunft", "werte"}
        for cat in expected:
            assert cat in categories, f"Missing category: {cat}"

    def test_challenge_durations_not_empty(self):
        """Test that challenge durations are not empty"""
        for challenge_id, challenge in CHALLENGE_DATABASE.items():
            assert challenge["duration"], f"Empty duration in {challenge_id}"

    def test_challenge_descriptions_meaningful(self):
        """Test that challenge descriptions are meaningful"""
        for challenge_id, challenge in CHALLENGE_DATABASE.items():
            assert len(challenge["description"]) > 10, f"Short description in {challenge_id}"


class TestChallengeTypes:
    """Tests for different challenge types"""

    def test_micro_challenges_exist(self):
        """Test that micro challenges exist"""
        micro = [c for c in CHALLENGE_DATABASE.values() if c["type"] == "micro"]
        assert len(micro) > 0

    def test_daily_ritual_challenges_exist(self):
        """Test that daily ritual challenges exist"""
        daily = [c for c in CHALLENGE_DATABASE.values() if c["type"] == "daily_ritual"]
        assert len(daily) > 0

    def test_deep_dive_challenges_exist(self):
        """Test that deep dive challenges exist"""
        deep = [c for c in CHALLENGE_DATABASE.values() if c["type"] == "deep_dive"]
        assert len(deep) > 0
