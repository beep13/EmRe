from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import Optional, List
from fastapi import HTTPException, status

from ..models.organization import Organization, OrganizationMembership
from ..models.user import User
from ..models.team import Team
from ..models.resource import Resource
from ..models.incident import Incident
from ..schemas import organization as schemas

def get_organization(db: Session, org_id: int, user_id: int) -> Optional[schemas.OrganizationDetail]:
    """Get organization details with permission check"""
    # Get organization with related data
    org = (
        db.query(Organization)
        .filter(Organization.id == org_id)
        .first()
    )

    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )

    # Check if user has access (public org or user is a member)
    if org.visibility != 'public':
        is_member = db.query(OrganizationMembership).filter(
            and_(
                OrganizationMembership.organization_id == org_id,
                OrganizationMembership.user_id == user_id,
                OrganizationMembership.status == 'active'
            )
        ).first()
        
        if not is_member:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to view this organization"
            )

    # Get members with their roles
    members = (
        db.query(User, OrganizationMembership)
        .join(OrganizationMembership, User.id == OrganizationMembership.user_id)
        .filter(
            OrganizationMembership.organization_id == org_id,
            OrganizationMembership.status == 'active'
        )
        .all()
    )

    # Transform members into the expected format
    transformed_members = []
    for user, membership in members:
        member_dict = schemas.UserWithOrgRole(
            id=user.id,
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name,
            is_active=user.is_active,
            created_at=user.created_at,
            organization_role=membership.role
        )
        transformed_members.append(member_dict)

    # Get teams
    teams = (
        db.query(Team)
        .filter(Team.organization_id == org_id)
        .all()
    )

    # Get counts
    member_count = len(members)
    team_count = len(teams)
    resource_count = (
        db.query(Resource)
        .filter(Resource.organization_id == org_id)
        .count()
    )
    active_incidents = (
        db.query(Incident)
        .filter(
            Incident.organization_id == org_id,
            Incident.status.in_(['open', 'in_progress'])
        )
        .count()
    )

    # Create OrganizationDetail response
    return schemas.OrganizationDetail(
        id=org.id,
        name=org.name,
        type=org.type,
        description=org.description,
        region=org.region,
        visibility=org.visibility,
        is_verified=org.is_verified,
        created_by_id=org.created_by_id,
        created_at=org.created_at,
        updated_at=org.updated_at,
        members=transformed_members,
        teams=teams,
        member_count=member_count,
        team_count=team_count,
        resource_count=resource_count,
        active_incidents=active_incidents
    )

def get_organizations(
    db: Session, 
    user_id: int,
    skip: int = 0, 
    limit: int = 100,
    visibility: Optional[str] = None
) -> List[Organization]:
    """
    Get organizations that are either:
    1. Public
    2. User is a member of
    """
    query = db.query(Organization).distinct()
    
    # Include public organizations and organizations where user is a member
    query = query.outerjoin(OrganizationMembership).filter(
        (Organization.visibility == 'public') |
        (
            (OrganizationMembership.user_id == user_id) &
            (OrganizationMembership.status == 'active')
        )
    )
    
    if visibility:
        query = query.filter(Organization.visibility == visibility)
    
    return query.offset(skip).limit(limit).all()

def create_organization(
    db: Session, 
    organization: schemas.OrganizationCreate, 
    user_id: int
) -> Organization:
    db_org = Organization(
        **organization.model_dump(),
        created_by_id=user_id
    )
    db.add(db_org)
    db.commit()
    db.refresh(db_org)

    # Create membership for creator as admin
    membership = OrganizationMembership(
        user_id=user_id,
        organization_id=db_org.id,
        role='admin',
        status='active'
    )
    db.add(membership)
    db.commit()

    return db_org

def update_organization(
    db: Session, 
    org_id: int, 
    org_update: schemas.OrganizationUpdate,
    user_id: int
) -> Organization:
    db_org = get_organization(db, org_id)
    if not db_org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    
    # Check if user is admin
    is_admin = db.query(OrganizationMembership).filter(
        and_(
            OrganizationMembership.organization_id == org_id,
            OrganizationMembership.user_id == user_id,
            OrganizationMembership.role == 'admin'
        )
    ).first()

    if not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update organization"
        )

    update_data = org_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_org, field, value)
    
    db.commit()
    db.refresh(db_org)
    return db_org

def add_member(
    db: Session,
    org_id: int,
    user_id: int,
    role: str = 'member'
) -> OrganizationMembership:
    # Check if membership already exists
    existing = db.query(OrganizationMembership).filter(
        and_(
            OrganizationMembership.organization_id == org_id,
            OrganizationMembership.user_id == user_id
        )
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is already a member of this organization"
        )

    membership = OrganizationMembership(
        user_id=user_id,
        organization_id=org_id,
        role=role,
        status='pending' if role == 'member' else 'active'
    )
    db.add(membership)
    db.commit()
    db.refresh(membership)
    return membership 