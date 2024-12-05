from sqlalchemy import Column, Integer, String, DateTime, Enum, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base_class import Base

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String)
    type = Column(Enum('emergency_response', 'resource_distribution', 
                      'volunteer_coordination', 'disaster_relief', 
                      name='organization_types'), nullable=False)
    visibility = Column(Enum('public', 'private', name='visibility_types'), 
                       default='public')
    is_verified = Column(Boolean, default=False)
    region = Column(String, nullable=False)
    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    members = relationship("OrganizationMembership", back_populates="organization")
    teams = relationship("Team", back_populates="organization")
    resources = relationship("Resource", back_populates="organization")
    incidents = relationship("Incident", back_populates="organization")
    created_by = relationship("User")

class OrganizationMembership(Base):
    __tablename__ = "organization_memberships"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=False)
    role = Column(Enum('admin', 'member', name='org_role_types'), default='member')
    status = Column(Enum('active', 'pending', 'denied', name='membership_status_types'), 
                   default='pending')
    join_date = Column(DateTime(timezone=True), server_default=func.now())
    last_active = Column(DateTime(timezone=True))

    # Relationships
    user = relationship("User", back_populates="organizations")
    organization = relationship("Organization", back_populates="members")
 