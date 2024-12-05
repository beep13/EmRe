from enum import Enum
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TeamRole(str, Enum):
    LEADER = "leader"
    DISPATCHER = "dispatcher"
    MEMBER = "member"

class OrganizationRole(str, Enum):
    ADMIN = "admin"
    MEMBER = "member"

class UserBase(BaseModel):
    id: int
    email: str
    first_name: str
    last_name: str
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True 