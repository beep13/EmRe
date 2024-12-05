from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from ....core import security
from ....core.config import settings
from ....crud import user as crud_user
from ....schemas.token import Token
from ....core import deps

router = APIRouter()

@router.post("/login", response_model=Token)
async def login_for_access_token(
    db: Session = Depends(deps.get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = crud_user.authenticate_user(
        db, email=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(
            status_code=400,
            detail="Incorrect email or password"
        )
    elif not user.is_active:
        raise HTTPException(
            status_code=400,
            detail="Inactive user"
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            subject=user.id,
            expires_delta=access_token_expires
        ),
        "token_type": "bearer"
    }

@router.post("/logout")
async def logout():
    """
    Logout the current user
    """
    # In a stateless JWT setup, client just needs to remove the token
    # For additional security, you could implement a token blacklist here
    return {"message": "Successfully logged out"}

@router.post("/refresh-token", response_model=Token)
async def refresh_token(
    current_user = Depends(deps.get_current_user)
) -> Any:
    """
    Refresh access token
    """
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            current_user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer"
    } 