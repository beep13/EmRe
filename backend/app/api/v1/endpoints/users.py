from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from typing import List, Optional
from sqlalchemy.orm import Session

from ....core.deps import (
    get_db,
    get_current_user,
    get_current_active_user,
    get_organization_admin,
    get_team_leader
)
from ....crud import user as crud_user
from ....crud import organization as crud_org
from ....schemas import user as schemas
from ....core.security import create_access_token
from ....models import User, Organization, OrganizationMembership, Team, TeamMembership

router = APIRouter()

@router.post("/", response_model=schemas.User)
async def create_user(
    user_in: schemas.UserCreate,
    db: Session = Depends(get_db)
):
    """Create new user - public endpoint for registration"""
    return crud_user.create_user(db, user_in)

@router.get("/me", response_model=schemas.UserWithMemberships)
async def read_users_me(
    current_user = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get current user's profile with their organization memberships"""
    # Get organization memberships with organization names
    org_memberships = (
        db.query(OrganizationMembership)
        .join(Organization)
        .filter(OrganizationMembership.user_id == current_user.id)
        .with_entities(
            OrganizationMembership.id,
            OrganizationMembership.organization_id,
            Organization.name,
            OrganizationMembership.role,
            OrganizationMembership.status,
            OrganizationMembership.join_date,
            OrganizationMembership.last_active
        )
        .all()
    )

    # Convert to OrganizationMemberInfo objects
    organizations = [
        schemas.OrganizationMemberInfo(
            organization_id=membership.organization_id,
            name=membership.name,
            role=membership.role,
            status=membership.status,
            join_date=membership.join_date
        )
        for membership in org_memberships
    ]

    # Get team memberships
    team_memberships = (
        db.query(TeamMembership)
        .join(Team)
        .filter(TeamMembership.user_id == current_user.id)
        .with_entities(
            TeamMembership.id,
            TeamMembership.team_id,
            Team.name,
            Team.organization_id,
            TeamMembership.role,
            TeamMembership.join_date
        )
        .all()
    )

    # Convert to TeamMemberInfo objects
    teams = [
        schemas.TeamMemberInfo(
            team_id=membership.team_id,
            name=membership.name,
            organization_id=membership.organization_id,
            role=membership.role,
            join_date=membership.join_date
        )
        for membership in team_memberships
    ]

    # Create UserWithMemberships response
    return schemas.UserWithMemberships(
        **current_user.__dict__,
        organizations=organizations,
        teams=teams
    )

@router.put("/me", response_model=schemas.User)
async def update_current_user(
    user_update: schemas.UserUpdate,
    current_user = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update current user's profile"""
    return crud_user.update_user(db, current_user.id, user_update)

@router.get("/organizations/{org_id}/members", response_model=List[schemas.UserWithOrgRole])
async def read_organization_members(
    org_id: int,
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get all members of an organization (must be a member to view)"""
    # Authorization is handled in the crud operation
    return crud_org.get_organization_members(
        db, org_id, current_user.id, skip=skip, limit=limit
    )

@router.post("/organizations/{org_id}/members/{user_id}/role", response_model=schemas.UserWithOrgRole)
async def update_organization_member_role(
    org_id: int,
    user_id: int,
    role_update: schemas.OrganizationRoleUpdate,
    current_user = Depends(get_organization_admin),
    db: Session = Depends(get_db)
):
    """Update a member's role in an organization (admin only)"""
    return crud_org.update_organization_member_role(db, org_id, user_id, role_update.role)

@router.post("/teams/{team_id}/members/{user_id}/role", response_model=schemas.UserWithTeamRole)
async def update_team_member_role(
    team_id: int,
    user_id: int,
    role_update: schemas.TeamRoleUpdate,
    current_user = Depends(get_team_leader),
    db: Session = Depends(get_db)
):
    """Update a member's role in a team (team leader only)"""
    return crud_org.update_team_member_role(db, team_id, user_id, role_update.role) 