from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from sqlalchemy.orm import Session

from ....core.deps import (
    get_db,
    get_current_active_user,
    get_organization_member,
    get_team_member
)
from ....crud import incident as crud
from ....schemas import incident as schemas
from ....models import User

router = APIRouter()

@router.post("/", response_model=schemas.Incident)
async def create_incident(
    incident_in: schemas.IncidentCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new incident"""
    return crud.create_incident(db, incident_in, current_user.id)

@router.get("/", response_model=List[schemas.Incident])
async def list_incidents(
    organization_id: Optional[int] = None,
    team_id: Optional[int] = None,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """List incidents with optional filters"""
    return crud.get_incidents(
        db,
        organization_id=organization_id,
        team_id=team_id,
        status=status,
        priority=priority,
        skip=skip,
        limit=limit
    )

@router.get("/{incident_id}", response_model=schemas.IncidentDetail)
async def get_incident(
    incident_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get detailed incident information"""
    return crud.get_incident(db, incident_id)

@router.put("/{incident_id}", response_model=schemas.Incident)
async def update_incident(
    incident_id: int,
    incident_update: schemas.IncidentUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update incident details"""
    return crud.update_incident(db, incident_id, incident_update, current_user.id)

@router.post("/{incident_id}/updates", response_model=schemas.IncidentUpdateRead)
async def create_incident_update(
    incident_id: int,
    update_in: schemas.IncidentUpdateCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Add an update to an incident"""
    return crud.create_incident_update(db, incident_id, current_user.id, update_in)

@router.get("/{incident_id}/updates", response_model=List[schemas.IncidentUpdateRead])
async def list_incident_updates(
    incident_id: int,
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """List all updates for an incident"""
    return crud.get_incident_updates(db, incident_id, skip=skip, limit=limit) 