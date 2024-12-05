from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import Optional, List
from fastapi import HTTPException, status

from ..models.team import Team, TeamMembership
from ..models.organization import OrganizationMembership
from ..schemas import team as schemas

def get_team(db: Session, team_id: int) -> Optional[Team]:
    return db.query(Team).filter(Team.id == team_id).first()

def get_teams(
    db: Session,
    organization_id: int,
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None
) -> List[Team]:
    query = db.query(Team).filter(Team.organization_id == organization_id)
    if status:
        query = query.filter(Team.status == status)
    return query.offset(skip).limit(limit).all()

def create_team(
    db: Session,
    team: schemas.TeamCreate,
    user_id: int
) -> Team:
    # Verify user has admin rights in the organization
    is_admin = db.query(OrganizationMembership).filter(
        and_(
            OrganizationMembership.organization_id == team.organization_id,
            OrganizationMembership.user_id == user_id,
            OrganizationMembership.role == 'admin'
        )
    ).first()

    if not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create teams in this organization"
        )

    db_team = Team(**team.model_dump())
    db.add(db_team)
    db.commit()
    db.refresh(db_team)

    # Add creator as team leader
    membership = TeamMembership(
        user_id=user_id,
        team_id=db_team.id,
        role='leader',
        added_by_id=user_id
    )
    db.add(membership)
    db.commit()

    return db_team

def update_team(
    db: Session,
    team_id: int,
    team_update: schemas.TeamUpdate,
    user_id: int
) -> Team:
    db_team = get_team(db, team_id)
    if not db_team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found"
        )

    # Check if user is team leader or org admin
    is_authorized = db.query(TeamMembership).filter(
        and_(
            TeamMembership.team_id == team_id,
            TeamMembership.user_id == user_id,
            TeamMembership.role == 'leader'
        )
    ).first() or db.query(OrganizationMembership).filter(
        and_(
            OrganizationMembership.organization_id == db_team.organization_id,
            OrganizationMembership.user_id == user_id,
            OrganizationMembership.role == 'admin'
        )
    ).first()

    if not is_authorized:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this team"
        )

    update_data = team_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_team, field, value)

    db.commit()
    db.refresh(db_team)
    return db_team

def add_team_member(
    db: Session,
    team_id: int,
    user_id: int,
    added_by_id: int,
    role: str = 'member'
) -> TeamMembership:
    # Verify the user being added is part of the organization
    team = get_team(db, team_id)
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found"
        )

    # Verify the adding user has permission (team leader or org admin)
    is_authorized = db.query(TeamMembership).filter(
        and_(
            TeamMembership.team_id == team_id,
            TeamMembership.user_id == added_by_id,
            TeamMembership.role == 'leader'
        )
    ).first() or db.query(OrganizationMembership).filter(
        and_(
            OrganizationMembership.organization_id == team.organization_id,
            OrganizationMembership.user_id == added_by_id,
            OrganizationMembership.role == 'admin'
        )
    ).first()

    if not is_authorized:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to add members to this team"
        )

    is_org_member = db.query(OrganizationMembership).filter(
        and_(
            OrganizationMembership.organization_id == team.organization_id,
            OrganizationMembership.user_id == user_id,
            OrganizationMembership.status == 'active'
        )
    ).first()

    if not is_org_member:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User must be an active member of the organization"
        )

    # Check if already a team member
    existing = db.query(TeamMembership).filter(
        and_(
            TeamMembership.team_id == team_id,
            TeamMembership.user_id == user_id
        )
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is already a member of this team"
        )

    membership = TeamMembership(
        user_id=user_id,
        team_id=team_id,
        role=role,
        added_by_id=added_by_id
    )
    db.add(membership)
    db.commit()
    db.refresh(membership)
    return membership 