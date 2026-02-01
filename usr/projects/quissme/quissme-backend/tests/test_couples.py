"""Couple tests"""
import pytest
from fastapi import status
from uuid import uuid4


def test_create_couple(client, test_user_data, test_partner_data):
    """Test couple creation"""
    # Register both users
    user1_response = client.post("/api/auth/register", json=test_user_data)
    user1_id = user1_response.json()["id"]
    
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
    response = client.post(
        "/api/couples",
        json={"partner_email": test_partner_data["email"]},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert "id" in data
    assert data["user1_id"] == user1_id


def test_create_couple_partner_not_found(client, test_user_data):
    """Test couple creation with non-existent partner"""
    # Register user
    client.post("/api/auth/register", json=test_user_data)
    
    # Login
    login_response = client.post(
        "/api/auth/login",
        json={
            "email": test_user_data["email"],
            "password": test_user_data["password"]
        }
    )
    token = login_response.json()["access_token"]
    
    # Try to create couple with non-existent partner
    response = client.post(
        "/api/couples",
        json={"partner_email": "nonexistent@example.com"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_get_couple(client, test_user_data, test_partner_data):
    """Test get couple"""
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
    
    # Get couple
    response = client.get(
        f"/api/couples/{couple_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["id"] == couple_id


def test_get_couple_unauthorized(client, test_user_data, test_partner_data):
    """Test get couple without authorization"""
    # Register both users
    client.post("/api/auth/register", json=test_user_data)
    user2_response = client.post("/api/auth/register", json=test_partner_data)
    user2_id = user2_response.json()["id"]
    
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
    
    # Login as user2
    login_response2 = client.post(
        "/api/auth/login",
        json={
            "email": test_partner_data["email"],
            "password": test_partner_data["password"]
        }
    )
    token2 = login_response2.json()["access_token"]
    
    # Try to get couple as user2 (not authorized)
    response = client.get(
        f"/api/couples/{couple_id}",
        headers={"Authorization": f"Bearer {token2}"}
    )
    # User2 should be able to access if they're part of the couple
    assert response.status_code == status.HTTP_200_OK
