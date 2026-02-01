"""Authentication tests"""
import pytest
from fastapi import status


def test_register_user(client, test_user_data):
    """Test user registration"""
    response = client.post(
        "/api/auth/register",
        json=test_user_data
    )
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["email"] == test_user_data["email"]
    assert data["name"] == test_user_data["name"]
    assert "id" in data


def test_register_duplicate_email(client, test_user_data):
    """Test registration with duplicate email"""
    # Register first user
    client.post("/api/auth/register", json=test_user_data)
    
    # Try to register with same email
    response = client.post(
        "/api/auth/register",
        json=test_user_data
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST


def test_login_user(client, test_user_data):
    """Test user login"""
    # Register user
    client.post("/api/auth/register", json=test_user_data)
    
    # Login
    response = client.post(
        "/api/auth/login",
        json={
            "email": test_user_data["email"],
            "password": test_user_data["password"]
        }
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"


def test_login_invalid_credentials(client, test_user_data):
    """Test login with invalid credentials"""
    # Register user
    client.post("/api/auth/register", json=test_user_data)
    
    # Try to login with wrong password
    response = client.post(
        "/api/auth/login",
        json={
            "email": test_user_data["email"],
            "password": "wrongpassword"
        }
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_get_current_user(client, test_user_data):
    """Test get current user"""
    # Register and login
    client.post("/api/auth/register", json=test_user_data)
    login_response = client.post(
        "/api/auth/login",
        json={
            "email": test_user_data["email"],
            "password": test_user_data["password"]
        }
    )
    token = login_response.json()["access_token"]
    
    # Get current user
    response = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["email"] == test_user_data["email"]


def test_get_current_user_unauthorized(client):
    """Test get current user without token"""
    response = client.get("/api/auth/me")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
