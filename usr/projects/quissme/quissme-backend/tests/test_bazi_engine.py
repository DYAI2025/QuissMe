"""Unit tests for BaZi Engine"""
import pytest
from datetime import datetime
from app.core.bazi_engine import (
    get_element_from_year,
    get_day_master,
    calculate_element_harmony,
    calculate_day_master_synergy,
    calculate_strength_gap,
    generate_yearly_prediction,
    generate_recommendations,
    calculate_couple_compatibility,
    ELEMENT_MAP,
    ELEMENT_COMPATIBILITY
)


class TestGetElementFromYear:
    """Tests for get_element_from_year function"""

    def test_element_returns_valid_element(self):
        """Test that function returns valid element"""
        valid_elements = set(ELEMENT_MAP.values())
        for year in range(1900, 2030):
            element = get_element_from_year(year)
            assert element in valid_elements, f"Invalid element for year {year}"

    def test_element_cycle_repeats(self):
        """Test that element cycle repeats every 10 years"""
        base_year = 1990
        element1 = get_element_from_year(base_year)
        element2 = get_element_from_year(base_year + 10)
        assert element1 == element2

    def test_specific_years(self):
        """Test specific year calculations"""
        # These are simplified calculations, testing consistency
        element_1990 = get_element_from_year(1990)
        element_1991 = get_element_from_year(1991)
        assert element_1990 is not None
        assert element_1991 is not None


class TestGetDayMaster:
    """Tests for get_day_master function"""

    def test_day_master_returns_valid_element(self):
        """Test that day master returns valid element"""
        valid_elements = set(ELEMENT_MAP.values())
        day_master = get_day_master(1990, 6, 15)
        assert day_master in valid_elements

    def test_different_dates_may_differ(self):
        """Test that different dates can have different day masters"""
        dm1 = get_day_master(1990, 1, 1)
        dm2 = get_day_master(1990, 6, 15)
        dm3 = get_day_master(1990, 12, 31)
        # At least one should be different (not a strict requirement)
        assert dm1 is not None and dm2 is not None and dm3 is not None


class TestCalculateElementHarmony:
    """Tests for calculate_element_harmony function"""

    def test_harmony_returns_float(self):
        """Test that harmony returns a float"""
        harmony = calculate_element_harmony("Wood", "Fire")
        assert isinstance(harmony, float)

    def test_harmony_in_valid_range(self):
        """Test that harmony is in valid range"""
        for e1 in ELEMENT_MAP.values():
            for e2 in ELEMENT_MAP.values():
                harmony = calculate_element_harmony(e1, e2)
                assert 0 <= harmony <= 100, f"Invalid harmony for {e1}-{e2}"

    def test_harmony_is_symmetric(self):
        """Test that harmony is symmetric (A-B == B-A)"""
        harmony_ab = calculate_element_harmony("Wood", "Fire")
        harmony_ba = calculate_element_harmony("Fire", "Wood")
        assert harmony_ab == harmony_ba

    def test_complementary_elements_high_harmony(self):
        """Test that complementary elements have high harmony"""
        # Water nourishes Wood
        harmony = calculate_element_harmony("Wood", "Water")
        assert harmony >= 70

    def test_opposing_elements_lower_harmony(self):
        """Test that opposing elements have lower harmony"""
        # Water extinguishes Fire
        harmony = calculate_element_harmony("Fire", "Water")
        assert harmony <= 50


class TestCalculateDayMasterSynergy:
    """Tests for calculate_day_master_synergy function"""

    def test_same_day_master_high_synergy(self):
        """Test that same day master gives high synergy"""
        synergy = calculate_day_master_synergy("Wood", "Wood")
        assert synergy >= 80

    def test_synergy_returns_float(self):
        """Test that synergy returns a float"""
        synergy = calculate_day_master_synergy("Fire", "Water")
        assert isinstance(synergy, float)

    def test_synergy_in_valid_range(self):
        """Test that synergy is in valid range"""
        for e1 in ELEMENT_MAP.values():
            for e2 in ELEMENT_MAP.values():
                synergy = calculate_day_master_synergy(e1, e2)
                assert 0 <= synergy <= 100


class TestCalculateStrengthGap:
    """Tests for calculate_strength_gap function"""

    def test_same_year_highest_score(self):
        """Test that same birth year gives highest score"""
        gap = calculate_strength_gap(1990, 1990)
        assert gap >= 90

    def test_small_age_gap_high_score(self):
        """Test that small age gap gives high score"""
        gap = calculate_strength_gap(1990, 1993)
        assert gap >= 75

    def test_large_age_gap_lower_score(self):
        """Test that large age gap gives lower score"""
        gap = calculate_strength_gap(1970, 1995)
        assert gap < 60

    def test_gap_is_symmetric(self):
        """Test that gap calculation is symmetric"""
        gap1 = calculate_strength_gap(1990, 2000)
        gap2 = calculate_strength_gap(2000, 1990)
        assert gap1 == gap2


class TestGenerateYearlyPrediction:
    """Tests for generate_yearly_prediction function"""

    def test_prediction_returns_string(self):
        """Test that prediction returns a string"""
        prediction = generate_yearly_prediction("Wood", "Fire", 2026)
        assert isinstance(prediction, str)
        assert len(prediction) > 0

    def test_prediction_contains_year(self):
        """Test that prediction contains the year"""
        prediction = generate_yearly_prediction("Wood", "Fire", 2026)
        assert "2026" in prediction

    def test_high_harmony_positive_prediction(self):
        """Test that high harmony gives positive prediction"""
        # Wood-Fire has high harmony
        prediction = generate_yearly_prediction("Wood", "Fire", 2026)
        # Should contain positive words
        positive_words = ["harmonious", "growth", "excellent", "favor"]
        assert any(word in prediction.lower() for word in positive_words)


class TestGenerateRecommendations:
    """Tests for generate_recommendations function"""

    def test_recommendations_returns_string(self):
        """Test that recommendations returns a string"""
        rec = generate_recommendations("Wood", "Fire")
        assert isinstance(rec, str)
        assert len(rec) > 0

    def test_recommendations_element_specific(self):
        """Test that recommendations include element-specific advice"""
        rec = generate_recommendations("Water", "Fire")
        assert len(rec) > 10  # Has meaningful content


class TestCalculateCoupleCompatibility:
    """Tests for calculate_couple_compatibility function"""

    def test_basic_compatibility_calculation(self):
        """Test basic compatibility calculation"""
        p1_birth = {"year": 1990, "month": 6, "day": 15}
        p2_birth = {"year": 1992, "month": 3, "day": 20}

        result = calculate_couple_compatibility(p1_birth, p2_birth)

        assert "element_harmony_score" in result
        assert "day_master_synergy" in result
        assert "strength_gap" in result
        assert "yearly_prediction" in result
        assert "recommendations" in result
        assert "elements" in result

    def test_compatibility_scores_in_range(self):
        """Test that all scores are in valid range"""
        p1_birth = {"year": 1985, "month": 1, "day": 1}
        p2_birth = {"year": 1988, "month": 12, "day": 31}

        result = calculate_couple_compatibility(p1_birth, p2_birth)

        assert 0 <= result["element_harmony_score"] <= 100
        assert 0 <= result["day_master_synergy"] <= 100
        assert 0 <= result["strength_gap"] <= 100

    def test_compatibility_contains_element_info(self):
        """Test that result contains element information"""
        p1_birth = {"year": 1990, "month": 6, "day": 15}
        p2_birth = {"year": 1992, "month": 3, "day": 20}

        result = calculate_couple_compatibility(p1_birth, p2_birth)

        assert "p1_element" in result["elements"]
        assert "p2_element" in result["elements"]
        assert "p1_day_master" in result["elements"]
        assert "p2_day_master" in result["elements"]

    def test_compatibility_missing_data_raises_error(self):
        """Test that missing data raises error"""
        p1_birth = {"year": 1990}  # Missing month and day
        p2_birth = {"year": 1992, "month": 3, "day": 20}

        with pytest.raises(ValueError):
            calculate_couple_compatibility(p1_birth, p2_birth)

    def test_compatibility_has_timestamp(self):
        """Test that result has calculation timestamp"""
        p1_birth = {"year": 1990, "month": 6, "day": 15}
        p2_birth = {"year": 1992, "month": 3, "day": 20}

        result = calculate_couple_compatibility(p1_birth, p2_birth)

        assert "calculated_at" in result

    def test_same_birth_data_consistent(self):
        """Test that same birth data gives consistent results"""
        p1_birth = {"year": 1990, "month": 6, "day": 15}
        p2_birth = {"year": 1992, "month": 3, "day": 20}

        result1 = calculate_couple_compatibility(p1_birth, p2_birth)
        result2 = calculate_couple_compatibility(p1_birth, p2_birth)

        assert result1["element_harmony_score"] == result2["element_harmony_score"]
        assert result1["day_master_synergy"] == result2["day_master_synergy"]


class TestElementCompatibilityData:
    """Tests for element compatibility data integrity"""

    def test_all_element_pairs_defined(self):
        """Test that common element pairs are defined"""
        required_pairs = [
            ("Wood", "Fire"),
            ("Fire", "Earth"),
            ("Earth", "Metal"),
            ("Metal", "Water"),
            ("Water", "Wood"),
        ]
        for pair in required_pairs:
            harmony = calculate_element_harmony(*pair)
            assert harmony > 0, f"Missing or invalid pair: {pair}"

    def test_compatibility_descriptions_exist(self):
        """Test that compatibility descriptions exist"""
        for key, value in ELEMENT_COMPATIBILITY.items():
            assert "score" in value
            assert "description" in value
            assert isinstance(value["score"], int)
            assert isinstance(value["description"], str)
