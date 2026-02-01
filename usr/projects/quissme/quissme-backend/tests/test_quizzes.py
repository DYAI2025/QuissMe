"""Quiz tests"""
import pytest
from fastapi import status


def test_list_quizzes(client):
    """Test list quizzes"""
    response = client.get("/api/quizzes")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0


def test_get_quiz(client):
    """Test get quiz"""
    # Get list of quizzes
    list_response = client.get("/api/quizzes")
    quizzes = list_response.json()
    
    if quizzes:
        quiz_id = quizzes[0]["id"]
        
        # Get quiz details
        response = client.get(f"/api/quizzes/{quiz_id}")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["id"] == quiz_id
        assert "questions" in data


def test_get_quiz_not_found(client):
    """Test get non-existent quiz"""
    response = client.get("/api/quizzes/nonexistent")
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_submit_quiz(client, test_user_data, test_partner_data):
    """Test submit quiz"""
    # Register both users
    client.post("/api/auth/register", json=test_user_data)
    client.post("/api/auth/register", json=test_partner_data)
    
    # Login as user1
    login_response = client.post(
        "/api/auth/login",
        json={
            "email": test_user_data["email"],
            "password": test_user_data["password"]
        }
    )
    token = login_response.json()["access_token"]
    
    # Create couple
    couple_response = client.post(
        "/api/couples",
        json={"partner_email": test_partner_data["email"]},
        headers={"Authorization": f"Bearer {token}"}
    )
    couple_id = couple_response.json()["id"]
    
    # Get list of quizzes
    list_response = client.get("/api/quizzes")
    quizzes = list_response.json()
    
    if quizzes:
        quiz_id = quizzes[0]["id"]
        
        # Submit quiz
        response = client.post(
            f"/api/quizzes/{quiz_id}/submit",
            json={
                "couple_id": couple_id,
                "p1_answers": [0, 1, 2],
                "p2_answers": [1, 2, 0]
            },
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "score" in data
        assert "insights" in data
        assert 0 <= data["score"] <= 100


def test_get_quiz_results(client, test_user_data, test_partner_data):
    """Test get quiz results"""
    # Register both users
    client.post("/api/auth/register", json=test_user_data)
    client.post("/api/auth/register", json=test_partner_data)
    
    # Login as user1
    login_response = client.post(
        "/api/auth/login",
        json={
            "email": test_user_data["email"],
            "password": test_user_data["password"]
        }
    )
    token = login_response.json()["access_token"]
    
    # Create couple
    couple_response = client.post(
        "/api/couples",
        json={"partner_email": test_partner_data["email"]},
        headers={"Authorization": f"Bearer {token}"}
    )
    couple_id = couple_response.json()["id"]
    
    # Get quiz results
    response = client.get(
        f"/api/quizzes/couples/{couple_id}/results",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
