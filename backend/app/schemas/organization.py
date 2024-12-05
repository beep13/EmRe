from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from enum import Enum

from .user import UserWithOrgRole
from .team import TeamBase

class OrganizationType(str, Enum):
    EMERGENCY_RESPONSE = "emergency_response"
    RESOURCE_DISTRIBUTION = "resource_distribution"
    VOLUNTEER_COORDINATION = "volunteer_coordination"
    DISASTER_RELIEF = "disaster_relief"

class OrganizationVisibility(str, Enum):
    PUBLIC = "public"
    PRIVATE = "private"

class OrganizationBase(BaseModel):
    name: str
    type: OrganizationType
    description: Optional[str] = None
    region: str
    visibility: OrganizationVisibility = OrganizationVisibility.PUBLIC
    is_verified: bool = False

class OrganizationCreate(OrganizationBase):
    pass

class OrganizationUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[OrganizationType] = None
    description: Optional[str] = None
    region: Optional[str] = None
    visibility: Optional[OrganizationVisibility] = None
    is_verified: Optional[bool] = None

class Organization(OrganizationBase):
    id: int
    created_by_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class OrganizationDetail(Organization):
    members: List[UserWithOrgRole]
    teams: List[TeamBase]
    member_count: int
    team_count: int
    resource_count: int
    active_incidents: int

    class Config:
        from_attributes = True

class OrgRoleType(str, Enum):
    admin = "admin"
    member = "member"

class MembershipStatus(str, Enum):
    active = "active"
    pending = "pending"
    denied = "denied"

class OrganizationMembership(BaseModel):
    id: int
    user_id: int
    organization_id: int
    role: OrgRoleType
    status: MembershipStatus
    join_date: datetime
    last_active: Optional[datetime] = None

    class Config:
        from_attributes = True