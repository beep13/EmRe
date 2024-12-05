from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from sqlalchemy.orm import Session

from ....core.deps import (
    get_db,
    get_current_active_user,
    get_organization_admin,
    get_team_dispatcher
)
from ....crud import resource as crud
from ....schemas import resource as schemas
from ....models import User

router = APIRouter()

@router.post("/", response_model=schemas.Resource)
async def create_resource(
    resource_in: schemas.ResourceCreate,
    current_user: User = Depends(get_organization_admin),
    db: Session = Depends(get_db)
):
    """Create a new resource (org admin only)"""
    return crud.create_resource(db, resource_in)

@router.get("/", response_model=List[schemas.Resource])
async def list_resources(
    organization_id: Optional[int] = None,
    team_id: Optional[int] = None,
    status: Optional[str] = None,
    type: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """List resources with optional filters"""
    return crud.get_resources(
        db,
        organization_id=organization_id,
        team_id=team_id,
        status=status,
        type=type,
        skip=skip,
        limit=limit
    )

@router.get("/{resource_id}", response_model=schemas.ResourceDetail)
async def get_resource(
    resource_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get detailed resource information"""
    return crud.get_resource(db, resource_id)

@router.put("/{resource_id}", response_model=schemas.Resource)
async def update_resource(
    resource_id: int,
    resource_update: schemas.ResourceUpdate,
    current_user: User = Depends(get_organization_admin),
    db: Session = Depends(get_db)
):
    """Update resource details (org admin only)"""
    return crud.update_resource(db, resource_id, resource_update)

@router.post("/{resource_id}/assign", response_model=schemas.ResourceAssignment)
async def assign_resource(
    resource_id: int,
    assignment_in: schemas.ResourceAssignmentCreate,
    current_user: User = Depends(get_team_dispatcher),
    db: Session = Depends(get_db)
):
    """Assign a resource to an incident (team dispatcher only)"""
    return crud.assign_resource(db, resource_id, assignment_in)

@router.post("/{resource_id}/return", response_model=schemas.ResourceAssignment)
async def return_resource(
    resource_id: int,
    assignment_id: int,
    current_user: User = Depends(get_team_dispatcher),
    db: Session = Depends(get_db)
):
    """Mark a resource as returned (team dispatcher only)"""
    return crud.return_resource(db, assignment_id, current_user.id)

@router.get("/{resource_id}/assignments", response_model=List[schemas.ResourceAssignment])
async def list_resource_assignments(
    resource_id: int,
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """List all assignments for a resource"""
    return crud.get_resource_assignments(db, resource_id, skip=skip, limit=limit) 