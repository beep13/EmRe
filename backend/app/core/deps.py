from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import List, Optional
from jose import JWTError, jwt

from ..db.base import get_db
from ..models import (
    User, Organization, OrganizationMembership, 
    Team, TeamMembership
)
from .config import settings

# Define OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="api/v1/auth/login"  # Updated to match the actual login endpoint
)

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, 
            settings.SECRET_KEY, 
            algorithms=[settings.ALGORITHM]
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Inactive user"
        )
    return current_user

async def get_organization_admin(
    org_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> User:
    membership = db.query(OrganizationMembership).filter(
        OrganizationMembership.organization_id == org_id,
        OrganizationMembership.user_id == current_user.id,
        OrganizationMembership.role == "admin",
        OrganizationMembership.status == "active"
    ).first()
    
    if not membership:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not an admin of this organization"
        )
    return current_user

async def get_team_leader(
    team_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> User:
    membership = db.query(TeamMembership).filter(
        TeamMembership.team_id == team_id,
        TeamMembership.user_id == current_user.id,
        TeamMembership.role == "leader"
    ).first()
    
    if not membership:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not a leader of this team"
        )
    return current_user

async def get_team_dispatcher(
    team_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> User:
    membership = db.query(TeamMembership).filter(
        TeamMembership.team_id == team_id,
        TeamMembership.user_id == current_user.id,
        TeamMembership.role.in_(["leader", "dispatcher"])
    ).first()
    
    if not membership:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not authorized to dispatch for this team"
        )
    return current_user

async def get_organization_member(
    org_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> User:
    membership = db.query(OrganizationMembership).filter(
        OrganizationMembership.organization_id == org_id,
        OrganizationMembership.user_id == current_user.id,
        OrganizationMembership.status == "active"
    ).first()
    
    if not membership:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not a member of this organization"
        )
    return current_user

async def get_team_member(
    team_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> User:
    membership = db.query(TeamMembership).filter(
        TeamMembership.team_id == team_id,
        TeamMembership.user_id == current_user.id
    ).first()
    
    if not membership:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not a member of this team"
        )
    return current_user 