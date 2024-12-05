from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import Optional, List
from fastapi import HTTPException, status
from datetime import datetime

from ..models.incident import Incident
from ..models.team import TeamMembership
from ..models.organization import OrganizationMembership
from ..schemas import incident as schemas

def get_incident(db: Session, incident_id: int) -> Optional[Incident]:
    return db.query(Incident).filter(Incident.id == incident_id).first()

def get_incidents(
    db: Session,
    organization_id: Optional[int] = None,
    team_id: Optional[int] = None,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    skip: int = 0,
    limit: int = 100
) -> List[Incident]:
    query = db.query(Incident)
    
    if organization_id:
        query = query.filter(Incident.organization_id == organization_id)
    if team_id:
        query = query.filter(Incident.assigned_team_id == team_id)
    if status:
        query = query.filter(Incident.status == status)
    if priority:
        query = query.filter(Incident.priority == priority)
    
    return query.order_by(Incident.created_at.desc()).offset(skip).limit(limit).all()

def create_incident(
    db: Session,
    incident: schemas.IncidentCreate,
    user_id: int
) -> Incident:
    # Verify user is part of the organization
    is_member = db.query(OrganizationMembership).filter(
        and_(
            OrganizationMembership.organization_id == incident.organization_id,
            OrganizationMembership.user_id == user_id,
            OrganizationMembership.status == 'active'
        )
    ).first()

    if not is_member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create incidents in this organization"
        )

    db_incident = Incident(
        **incident.model_dump(),
        created_by_id=user_id
    )
    db.add(db_incident)
    db.commit()
    db.refresh(db_incident)
    return db_incident

def update_incident(
    db: Session,
    incident_id: int,
    incident_update: schemas.IncidentUpdate,
    user_id: int
) -> Incident:
    db_incident = get_incident(db, incident_id)
    if not db_incident:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Incident not found"
        )

    # Check if user is authorized (team member, team leader, or org admin)
    is_authorized = (
        db_incident.created_by_id == user_id or
        db.query(TeamMembership).filter(
            and_(
                TeamMembership.team_id == db_incident.assigned_team_id,
                TeamMembership.user_id == user_id
            )
        ).first() or
        db.query(OrganizationMembership).filter(
            and_(
                OrganizationMembership.organization_id == db_incident.organization_id,
                OrganizationMembership.user_id == user_id,
                OrganizationMembership.role == 'admin'
            )
        ).first()
    )

    if not is_authorized:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this incident"
        )

    update_data = incident_update.model_dump(exclude_unset=True)
    
    # If status is being changed to resolved, set resolved_at
    if update_data.get('status') == 'resolved':
        update_data['resolved_at'] = datetime.utcnow()

    for field, value in update_data.items():
        setattr(db_incident, field, value)

    db.commit()
    db.refresh(db_incident)
    return db_incident 