from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlalchemy.orm import Session

from ....core.deps import (
    get_db,
    get_current_active_user,
    get_organization_admin,
    get_organization_member
)
from ....crud import organization as crud
from ....schemas import organization as schemas

router = APIRouter()

@router.post("/", response_model=schemas.Organization)
async def create_organization(
    org_in: schemas.OrganizationCreate,
    current_user = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new organization"""
    return crud.create_organization(db, org_in, current_user.id)

@router.get("/", response_model=List[schemas.Organization])
async def list_organizations(
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """List all public organizations and private ones user is member of"""
    return crud.get_organizations(db, current_user.id, skip=skip, limit=limit)

@router.get("/{org_id}", response_model=schemas.OrganizationDetail)
async def get_organization(
    org_id: int,
    current_user = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get organization details"""
    return crud.get_organization(db, org_id, current_user.id)

@router.put("/{org_id}", response_model=schemas.Organization)
async def update_organization(
    org_id: int,
    org_update: schemas.OrganizationUpdate,
    current_user = Depends(get_organization_admin),
    db: Session = Depends(get_db)
):
    """Update organization details (admin only)"""
    return crud.update_organization(db, org_id, org_update)

@router.post("/{org_id}/members/request", response_model=schemas.OrganizationMembership)
async def request_membership(
    org_id: int,
    current_user = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Request to join an organization"""
    return crud.create_membership_request(db, org_id, current_user.id)

@router.post("/{org_id}/members/{user_id}/approve")
async def approve_membership(
    org_id: int,
    user_id: int,
    current_user = Depends(get_organization_admin),
    db: Session = Depends(get_db)
):
    """Approve a membership request (admin only)"""
    crud.approve_membership_request(db, org_id, user_id)
    return {"status": "approved"} 