from pydantic import BaseModel
from typing import Optional, List, Annotated
from datetime import datetime
from enum import Enum

from .common import TeamRole, UserBase
from .resource import ResourceBase

class TeamType(str, Enum):
    RESPONSE = "response"
    MEDICAL = "medical"
    RESCUE = "rescue"
    LOGISTICS = "logistics"
    SUPPORT = "support"

class TeamStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    STANDBY = "standby"

class TeamBase(BaseModel):
    name: str
    type: TeamType
    description: Optional[str] = None
    geographic_area: Optional[str] = None
    status: TeamStatus = TeamStatus.ACTIVE

class TeamCreate(TeamBase):
    organization_id: int

class TeamUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[TeamType] = None
    description: Optional[str] = None
    geographic_area: Optional[str] = None
    status: Optional[TeamStatus] = None

class Team(TeamBase):
    id: int
    organization_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class TeamDetail(Team):
    members: List[UserBase]
    resources: List[ResourceBase]
    member_count: int
    active_incidents: int
    assigned_resources: int
    organization_name: str

    class Config:
        from_attributes = True

class TeamMembershipBase(BaseModel):
    team_id: int
    user_id: int
    role: TeamRole

class TeamMembership(TeamMembershipBase):
    id: int
    join_date: datetime

    class Config:
        from_attributes = True