from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

from .common import UserBase, TeamRole, OrganizationRole

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Role Update Schemas
class OrganizationRoleUpdate(BaseModel):
    role: OrganizationRole

class TeamRoleUpdate(BaseModel):
    role: TeamRole

# Membership Info Schemas
class OrganizationMemberInfo(BaseModel):
    organization_id: int
    name: str
    role: OrganizationRole
    status: str
    join_date: datetime

    class Config:
        from_attributes = True

class TeamMemberInfo(BaseModel):
    team_id: int
    name: str
    organization_id: int
    role: TeamRole
    join_date: datetime

    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    password: str

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None

class User(UserBase):
    pass

class UserWithOrgRole(UserBase):
    organization_role: OrganizationRole

class UserWithTeamRole(UserBase):
    team_role: TeamRole

class UserWithMemberships(UserBase):
    organizations: List[OrganizationMemberInfo]
    teams: List[TeamMemberInfo]