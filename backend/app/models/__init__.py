from .user import User
from .organization import Organization, OrganizationMembership
from .team import Team, TeamMembership
from .incident import Incident, IncidentUpdate
from .resource import Resource, ResourceAssignment
from .base_class import Base 

# Define common enums that might be used across multiple models
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "admin"
    MEMBER = "member"

class TeamRole(str, Enum):
    LEADER = "leader"
    MEMBER = "member"
    DISPATCHER = "dispatcher"

class IncidentStatus(str, Enum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    CLOSED = "closed"

class IncidentPriority(str, Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

class ResourceStatus(str, Enum):
    AVAILABLE = "available"
    IN_USE = "in_use"
    OUT_OF_SERVICE = "out_of_service"
    RESERVED = "reserved" 