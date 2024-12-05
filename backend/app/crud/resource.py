from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import Optional, List
from fastapi import HTTPException, status
from datetime import datetime

from ..models.resource import Resource, ResourceAssignment
from ..models.organization import OrganizationMembership
from ..models.team import TeamMembership
from ..schemas import resource as schemas

def get_resource(db: Session, resource_id: int) -> Optional[Resource]:
    return db.query(Resource).filter(Resource.id == resource_id).first()

def get_resources(
    db: Session,
    organization_id: Optional[int] = None,
    team_id: Optional[int] = None,
    status: Optional[str] = None,
    type: Optional[str] = None,
    skip: int = 0,
    limit: int = 100
) -> List[Resource]:
    query = db.query(Resource)
    
    if organization_id:
        query = query.filter(Resource.organization_id == organization_id)
    if team_id:
        query = query.filter(Resource.team_id == team_id)
    if status:
        query = query.filter(Resource.status == status)
    if type:
        query = query.filter(Resource.type == type)
    
    return query.offset(skip).limit(limit).all()

def create_resource(
    db: Session,
    resource: schemas.ResourceCreate,
    user_id: int
) -> Resource:
    # Verify user has admin rights in the organization
    is_admin = db.query(OrganizationMembership).filter(
        and_(
            OrganizationMembership.organization_id == resource.organization_id,
            OrganizationMembership.user_id == user_id,
            OrganizationMembership.role == 'admin'
        )
    ).first()

    if not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create resources in this organization"
        )

    db_resource = Resource(**resource.model_dump())
    db.add(db_resource)
    db.commit()
    db.refresh(db_resource)
    return db_resource

def update_resource(
    db: Session,
    resource_id: int,
    resource_update: schemas.ResourceUpdate,
    user_id: int
) -> Resource:
    db_resource = get_resource(db, resource_id)
    if not db_resource:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resource not found"
        )

    # Check if user is authorized (team leader or org admin)
    is_authorized = (
        db.query(TeamMembership).filter(
            and_(
                TeamMembership.team_id == db_resource.team_id,
                TeamMembership.user_id == user_id,
                TeamMembership.role == 'leader'
            )
        ).first() if db_resource.team_id else False
    ) or db.query(OrganizationMembership).filter(
        and_(
            OrganizationMembership.organization_id == db_resource.organization_id,
            OrganizationMembership.user_id == user_id,
            OrganizationMembership.role == 'admin'
        )
    ).first()

    if not is_authorized:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this resource"
        )

    update_data = resource_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_resource, field, value)

    db.commit()
    db.refresh(db_resource)
    return db_resource

def assign_resource(
    db: Session,
    resource_id: int,
    incident_id: int,
    quantity: int,
    user_id: int
) -> ResourceAssignment:
    resource = get_resource(db, resource_id)
    if not resource:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resource not found"
        )

    # Check if user is authorized (team leader, dispatcher, or org admin)
    is_authorized = (
        db.query(TeamMembership).filter(
            and_(
                TeamMembership.team_id == resource.team_id,
                TeamMembership.user_id == user_id,
                TeamMembership.role.in_(['leader', 'dispatcher'])
            )
        ).first() if resource.team_id else False
    ) or db.query(OrganizationMembership).filter(
        and_(
            OrganizationMembership.organization_id == resource.organization_id,
            OrganizationMembership.user_id == user_id,
            OrganizationMembership.role == 'admin'
        )
    ).first()

    if not is_authorized:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to assign this resource"
        )

    # Check if resource has enough quantity available
    available_quantity = resource.quantity
    current_assignments = db.query(ResourceAssignment).filter(
        and_(
            ResourceAssignment.resource_id == resource_id,
            ResourceAssignment.returned_at.is_(None)
        )
    ).all()
    
    for assignment in current_assignments:
        available_quantity -= assignment.quantity

    if quantity > available_quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Not enough quantity available. Only {available_quantity} units available"
        )

    # Create assignment
    assignment = ResourceAssignment(
        resource_id=resource_id,
        incident_id=incident_id,
        quantity=quantity
    )
    db.add(assignment)

    # Update resource status if fully assigned
    if available_quantity - quantity == 0:
        resource.status = 'in_use'

    db.commit()
    db.refresh(assignment)
    return assignment

def return_resource(
    db: Session,
    assignment_id: int,
    user_id: int
) -> ResourceAssignment:
    assignment = db.query(ResourceAssignment).get(assignment_id)
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resource assignment not found"
        )

    resource = get_resource(db, assignment.resource_id)
    
    # Check authorization
    is_authorized = (
        db.query(TeamMembership).filter(
            and_(
                TeamMembership.team_id == resource.team_id,
                TeamMembership.user_id == user_id,
                TeamMembership.role.in_(['leader', 'dispatcher'])
            )
        ).first() if resource.team_id else False
    ) or db.query(OrganizationMembership).filter(
        and_(
            OrganizationMembership.organization_id == resource.organization_id,
            OrganizationMembership.user_id == user_id,
            OrganizationMembership.role == 'admin'
        )
    ).first()

    if not is_authorized:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to return this resource"
        )

    assignment.returned_at = datetime.utcnow()
    
    # Check if this was the last assignment and update resource status
    active_assignments = db.query(ResourceAssignment).filter(
        and_(
            ResourceAssignment.resource_id == resource.id,
            ResourceAssignment.returned_at.is_(None)
        )
    ).count()

    if active_assignments == 0:
        resource.status = 'available'

    db.commit()
    db.refresh(assignment)
    return assignment 