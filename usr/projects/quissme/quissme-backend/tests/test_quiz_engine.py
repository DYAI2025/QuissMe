"""Unit tests for Quiz Engine"""
import pytest
from app.core.quiz_engine import (
    get_quiz,
    list_quizzes,
    calculate_quiz_score,
    generate_insights,
    determine_buffs_earned,
    QUIZ_DATABASE
)


class TestGetQuiz:
    """Tests for get_quiz function"""

    def test_get_existing_quiz(self):
        """Test getting an existing quiz"""
        quiz = get_quiz("liebesprachen_1")
        assert quiz is not None
        assert quiz["title"] == "Welche Liebe sprichst du?"
        assert quiz["category"] == "liebesprachen"
        assert "questions" in quiz
        assert len(quiz["questions"]) > 0

    def test_get_nonexistent_quiz(self):
        """Test getting a quiz that doesn't exist"""
        with pytest.raises(ValueError) as exc_info:
            get_quiz("nonexistent_quiz")
        assert "not found" in str(exc_info.value)

    def test_quiz_has_required_fields(self):
        """Test that quiz has all required fields"""
        quiz = get_quiz("konflikt_1")
        required_fields = ["title", "category", "description", "questions"]
        for field in required_fields:
            assert field in quiz, f"Missing field: {field}"

    def test_quiz_questions_have_required_fields(self):
        """Test that quiz questions have required fields"""
        quiz = get_quiz("liebesprachen_1")
        for question in quiz["questions"]:
            assert "id" in question
            assert "text" in question
            assert "options" in question
            assert len(question["options"]) >= 2


class TestListQuizzes:
    """Tests for list_quizzes function"""

    def test_list_all_quizzes(self):
        """Test listing all quizzes"""
        quizzes = list_quizzes()
        assert len(quizzes) > 0
        assert len(quizzes) == len(QUIZ_DATABASE)

    def test_list_quizzes_by_category(self):
        """Test listing quizzes by category"""
        quizzes = list_quizzes(category="liebesprachen")
        assert len(quizzes) > 0
        for quiz in quizzes:
            assert quiz["category"] == "liebesprachen"

    def test_list_quizzes_nonexistent_category(self):
        """Test listing quizzes with nonexistent category"""
        quizzes = list_quizzes(category="nonexistent")
        assert len(quizzes) == 0

    def test_list_quizzes_returns_metadata(self):
        """Test that list_quizzes returns proper metadata"""
        quizzes = list_quizzes()
        for quiz in quizzes:
            assert "id" in quiz
            assert "title" in quiz
            assert "category" in quiz
            assert "description" in quiz
            assert "question_count" in quiz


class TestCalculateQuizScore:
    """Tests for calculate_quiz_score function"""

    def test_identical_answers_perfect_score(self):
        """Test that identical answers give 100% score"""
        p1_answers = [0, 1, 2, 3, 4]
        p2_answers = [0, 1, 2, 3, 4]
        score = calculate_quiz_score(p1_answers, p2_answers, "test")
        assert score == 100.0

    def test_completely_different_answers(self):
        """Test that completely different answers give low score"""
        p1_answers = [0, 0, 0, 0, 0]
        p2_answers = [4, 4, 4, 4, 4]
        score = calculate_quiz_score(p1_answers, p2_answers, "test")
        assert score == 0.0

    def test_partial_alignment(self):
        """Test partial alignment gives intermediate score"""
        p1_answers = [0, 1, 2]
        p2_answers = [0, 2, 3]  # Diff: 0, 1, 1 = 2 total
        score = calculate_quiz_score(p1_answers, p2_answers, "test")
        # Max diff = 3 * 4 = 12, actual diff = 2
        # Score = (1 - 2/12) * 100 = 83.3%
        assert 80 <= score <= 90

    def test_score_range(self):
        """Test that score is always in valid range"""
        import random
        for _ in range(100):
            p1 = [random.randint(0, 4) for _ in range(5)]
            p2 = [random.randint(0, 4) for _ in range(5)]
            score = calculate_quiz_score(p1, p2, "test")
            assert 0 <= score <= 100

    def test_empty_answers(self):
        """Test empty answers return default score"""
        score = calculate_quiz_score([], [], "test")
        assert score == 50.0

    def test_mismatched_answer_lengths_raises_error(self):
        """Test that mismatched answer lengths raise error"""
        with pytest.raises(ValueError):
            calculate_quiz_score([0, 1], [0, 1, 2], "test")

    def test_single_answer(self):
        """Test single answer calculation"""
        score = calculate_quiz_score([0], [2], "test")
        # Diff = 2, Max = 4, Score = (1 - 2/4) * 100 = 50%
        assert score == 50.0


class TestGenerateInsights:
    """Tests for generate_insights function"""

    def test_high_score_insight(self):
        """Test insight generation for high score"""
        insights = generate_insights(85.0, "liebesprachen", [0, 1], [0, 1])
        assert insights["alignment"] == "Very High"
        assert "highly aligned" in insights["message"].lower() or "strength" in insights["message"].lower()

    def test_low_score_insight(self):
        """Test insight generation for low score"""
        insights = generate_insights(25.0, "konflikt", [0, 0], [4, 4])
        assert insights["alignment"] == "Low"
        assert "different" in insights["message"].lower()

    def test_moderate_score_insight(self):
        """Test insight generation for moderate score"""
        insights = generate_insights(50.0, "intimitat", [1, 1], [2, 2])
        assert insights["alignment"] == "Moderate"

    def test_insight_has_required_fields(self):
        """Test that insights have all required fields"""
        insights = generate_insights(75.0, "test", [0], [1])
        required_fields = ["score", "alignment", "message", "recommendation"]
        for field in required_fields:
            assert field in insights, f"Missing field: {field}"

    def test_insight_score_matches_input(self):
        """Test that insight score matches input"""
        score = 67.5
        insights = generate_insights(score, "test", [0], [1])
        assert insights["score"] == score


class TestDetermineBuffsEarned:
    """Tests for determine_buffs_earned function"""

    def test_high_score_liebesprachen_buff(self):
        """Test high score in liebesprachen gives liebesfluesterer buff"""
        buffs = determine_buffs_earned(85.0, "liebesprachen")
        assert "liebesflüsterer" in buffs

    def test_high_score_konflikt_buff(self):
        """Test high score in konflikt gives harmonie_welle buff"""
        buffs = determine_buffs_earned(85.0, "konflikt")
        assert "harmonie_welle" in buffs

    def test_high_score_intimitat_buff(self):
        """Test high score in intimitat gives intimitaets_boost buff"""
        buffs = determine_buffs_earned(85.0, "intimität")
        assert "intimitäts_boost" in buffs

    def test_medium_score_gives_neugier_buff(self):
        """Test medium score gives neugier_funkeln buff"""
        buffs = determine_buffs_earned(70.0, "test")
        assert "neugier_funkeln" in buffs

    def test_score_above_50_gives_wert_buff(self):
        """Test score above 50 gives wert_schaerfer buff"""
        buffs = determine_buffs_earned(55.0, "test")
        assert "wert_schärfer" in buffs

    def test_low_score_minimal_buffs(self):
        """Test low score gives minimal buffs"""
        buffs = determine_buffs_earned(30.0, "test")
        assert "wert_schärfer" not in buffs
        assert len(buffs) == 0


class TestQuizDatabaseIntegrity:
    """Tests for quiz database integrity"""

    def test_all_quizzes_have_unique_ids(self):
        """Test that all quiz IDs are unique"""
        quiz_ids = list(QUIZ_DATABASE.keys())
        assert len(quiz_ids) == len(set(quiz_ids))

    def test_all_categories_have_quizzes(self):
        """Test that known categories have quizzes"""
        categories = set(q["category"] for q in QUIZ_DATABASE.values())
        expected_categories = {"liebesprachen", "konflikt", "intimität", "alltag", "werte"}
        for cat in expected_categories:
            assert cat in categories, f"Missing category: {cat}"

    def test_quiz_options_are_not_empty(self):
        """Test that all quiz options are not empty strings"""
        for quiz_id, quiz in QUIZ_DATABASE.items():
            for question in quiz["questions"]:
                for option in question["options"]:
                    assert option.strip(), f"Empty option in {quiz_id}"

    def test_age_restricted_quizzes_marked(self):
        """Test that age-restricted quizzes are properly marked"""
        age_restricted = [
            q for q in QUIZ_DATABASE.values()
            if q.get("age_restricted", False)
        ]
        # There should be at least one age-restricted quiz
        assert len(age_restricted) >= 1
