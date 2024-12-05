from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any, ForwardRef
from datetime import datetime
from enum import Enum

from .resource import ResourceAssignment  # Import ResourceAssignment

class IncidentType(str, Enum):
    EMERGENCY = "emergency"
    RESOURCE_REQUEST = "resource_request"
    STATUS_UPDATE = "status_update"

class IncidentPriority(str, Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

class IncidentStatus(str, Enum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    CLOSED = "closed"

class UpdateType(str, Enum):
    STATUS_CHANGE = "status_change"
    RESOURCE_UPDATE = "resource_update"
    GENERAL_UPDATE = "general_update"

class IncidentBase(BaseModel):
    title: str
    description: Optional[str] = None
    type: IncidentType
    priority: IncidentPriority
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    location_description: Optional[str] = None

class IncidentCreate(IncidentBase):
    organization_id: int
    assigned_team_id: Optional[int] = None

class IncidentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[IncidentPriority] = None
    status: Optional[IncidentStatus] = None
    assigned_team_id: Optional[int] = None

class IncidentUpdateBase(BaseModel):
    content: str
    update_type: UpdateType = UpdateType.GENERAL_UPDATE
    update_metadata: Optional[Dict[str, Any]] = Field(default_factory=dict)

class IncidentUpdateCreate(IncidentUpdateBase):
    incident_id: int

class IncidentUpdateRead(IncidentUpdateBase):
    id: int
    incident_id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class Incident(IncidentBase):
    id: int
    status: IncidentStatus
    organization_id: int
    created_by_id: int
    assigned_team_id: Optional[int]
    created_at: datetime
    updated_at: Optional[datetime]
    resolved_at: Optional[datetime]
    updates: List[IncidentUpdateRead] = Field(default_factory=list)

    class Config:
        from_attributes = True

class IncidentDetail(Incident):
    assigned_resources: List[ResourceAssignment] = Field(default_factory=list)
    organization_name: str
    team_name: Optional[str] = None
    creator_name: str

    class Config:
        from_attributes = True

# Update forward refs after all models are defined
IncidentDetail.model_rebuild()