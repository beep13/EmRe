from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlalchemy.orm import Session

from ....core.deps import (
    get_db,
    get_current_active_user,
    get_organization_admin,
    get_team_leader,
    get_organization_member
)
from ....crud import team as crud
from ....schemas import team as schemas

router = APIRouter()

@router.post("/", response_model=schemas.Team)
async def create_team(
    team_in: schemas.TeamCreate,
    current_user = Depends(get_organization_admin),
    db: Session = Depends(get_db)
):
    """Create a new team (org admin only)"""
    return crud.create_team(db, team_in, current_user.id)

@router.get("/organization/{org_id}", response_model=List[schemas.Team])
async def list_organization_teams(
    org_id: int,
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(get_organization_member),
    db: Session = Depends(get_db)
):
    """List all teams in an organization"""
    return crud.get_organization_teams(db, org_id, skip=skip, limit=limit)

@router.get("/{team_id}", response_model=schemas.TeamDetail)
async def get_team(
    team_id: int,
    current_user = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get team details"""
    return crud.get_team(db, team_id, current_user.id)

@router.put("/{team_id}", response_model=schemas.Team)
async def update_team(
    team_id: int,
    team_update: schemas.TeamUpdate,
    current_user = Depends(get_team_leader),
    db: Session = Depends(get_db)
):
    """Update team details (team leader only)"""
    return crud.update_team(db, team_id, team_update)

@router.post("/{team_id}/members/{user_id}", response_model=schemas.TeamMembership)
async def add_team_member(
    team_id: int,
    user_id: int,
    role: schemas.TeamRole,
    current_user = Depends(get_team_leader),
    db: Session = Depends(get_db)
):
    """Add a member to the team (team leader only)"""
    return crud.add_team_member(db, team_id, user_id, role, current_user.id)

@router.delete("/{team_id}/members/{user_id}")
async def remove_team_member(
    team_id: int,
    user_id: int,
    current_user = Depends(get_team_leader),
    db: Session = Depends(get_db)
):
    """Remove a member from the team (team leader only)"""
    crud.remove_team_member(db, team_id, user_id)
    return {"status": "removed"} 