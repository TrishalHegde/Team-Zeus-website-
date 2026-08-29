import os
import httpx
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import UserCreate
from security.auth import create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])

GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")

@router.get("/github/callback")
async def github_callback(code: str, db: Session = Depends(get_db)):
    if not GITHUB_CLIENT_ID or not GITHUB_CLIENT_SECRET:
        raise HTTPException(
            status_code=500, 
            detail="Server configuration error: GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET is missing from the environment."
        )

    # Exchange code for GitHub access token
    async with httpx.AsyncClient() as client:
        res = await client.post(
            "https://github.com/login/oauth/access_token",
            headers={"Accept": "application/json"},
            data={
                "client_id": GITHUB_CLIENT_ID,
                "client_secret": GITHUB_CLIENT_SECRET,
                "code": code,
            }
        )
        if res.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to fetch access token from GitHub")
        
        token_data = res.json()
        access_token = token_data.get("access_token")
        if not access_token:
            raise HTTPException(status_code=400, detail=f"GitHub OAuth error: {token_data.get('error_description', 'Unknown error')}")

        # Fetch user info using access token
        user_res = await client.get(
            "https://api.github.com/user",
            headers={"Authorization": f"token {access_token}"}
        )
        if user_res.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to fetch user profile from GitHub")
            
        github_profile = user_res.json()
        github_id = str(github_profile.get("id"))
        username = github_profile.get("login")
        avatar_url = github_profile.get("avatar_url")

        # Check if user exists, otherwise create
        user = db.query(User).filter(User.github_id == github_id).first()
        if not user:
            # First user will be admin for easy setup, others are students
            users_count = db.query(User).count()
            role = "admin" if users_count == 0 else "student"
            user = User(github_id=github_id, role=role, avatar_url=avatar_url)
            db.add(user)
            db.commit()
            db.refresh(user)
        else:
            # Update avatar if changed
            user.avatar_url = avatar_url
            db.commit()
            db.refresh(user)

        # Issue JWT
        token = create_access_token(data={"sub": user.id, "role": user.role})
        return {
            "token": token,
            "user": {
                "id": user.id,
                "github_id": user.github_id,
                "username": username,
                "role": user.role,
                "avatar_url": user.avatar_url
            }
        }
