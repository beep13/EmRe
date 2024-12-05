from sqlalchemy import Column, Integer, String, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base_class import Base

class Team(Base):
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=False)
    type = Column(String)  # Could be Enum if we want to restrict types
    description = Column(String)
    geographic_area = Column(String)
    status = Column(Enum('active', 'inactive', name='team_status_types'), 
                   default='active')
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    organization = relationship("Organization", back_populates="teams")
    members = relationship("TeamMembership", back_populates="team")
    assigned_incidents = relationship("Incident", back_populates="assigned_team")
    resources = relationship("Resource", back_populates="team")

class TeamMembership(Base):
    __tablename__ = "team_memberships"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    role = Column(Enum('leader', 'member', 'dispatcher', name='team_role_types'), 
                 default='member')
    join_date = Column(DateTime(timezone=True), server_default=func.now())
    added_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Relationships
    user = relationship("User", foreign_keys=[user_id], back_populates="teams")
    team = relationship("Team", back_populates="members")
    added_by = relationship("User", foreign_keys=[added_by_id])