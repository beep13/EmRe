from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class ResourceType(str, Enum):
    VEHICLE = "vehicle"
    EQUIPMENT = "equipment"
    MEDICAL = "medical"
    SUPPLY = "supply"
    OTHER = "other"

class ResourceStatus(str, Enum):
    AVAILABLE = "available"
    IN_USE = "in_use"
    OUT_OF_SERVICE = "out_of_service"
    RESERVED = "reserved"

class ResourceBase(BaseModel):
    name: str
    type: ResourceType
    description: Optional[str] = None
    quantity: int = 1
    status: ResourceStatus = ResourceStatus.AVAILABLE

    class Config:
        from_attributes = True

class ResourceCreate(ResourceBase):
    organization_id: int
    team_id: Optional[int] = None

class ResourceUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[ResourceType] = None
    description: Optional[str] = None
    quantity: Optional[int] = None
    status: Optional[ResourceStatus] = None
    team_id: Optional[int] = None

class Resource(ResourceBase):
    id: int
    organization_id: int
    team_id: Optional[int]
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ResourceAssignmentBase(BaseModel):
    resource_id: int
    incident_id: int
    quantity: int = 1
    notes: Optional[str] = None

class ResourceAssignmentCreate(ResourceAssignmentBase):
    """Schema for creating a new resource assignment"""
    pass

class ResourceAssignment(ResourceAssignmentBase):
    id: int
    assigned_at: datetime
    returned_at: Optional[datetime] = None
    assigned_by_id: int

    class Config:
        from_attributes = True

class ResourceAssignmentUpdate(BaseModel):
    """Schema for updating a resource assignment"""
    quantity: Optional[int] = None
    notes: Optional[str] = None
    returned_at: Optional[datetime] = None

class ResourceDetail(Resource):
    current_assignments: List[ResourceAssignment] = Field(default_factory=list)
    assignment_history: List[ResourceAssignment] = Field(default_factory=list)
    organization_name: str
    team_name: Optional[str] = None

    class Config:
        from_attributes = True 