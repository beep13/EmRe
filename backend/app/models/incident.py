from sqlalchemy import Column, Integer, String, DateTime, Enum, ForeignKey, Float, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base_class import Base

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String)
    type = Column(Enum('emergency', 'resource_request', 'status_update', 
                      name='incident_types'), nullable=False)
    priority = Column(Enum('critical', 'high', 'medium', 'low', 
                         name='priority_levels'), nullable=False)
    status = Column(Enum('open', 'in_progress', 'resolved', 'closed', 
                        name='incident_status'), default='open')
    
    # Location data
    latitude = Column(Float)
    longitude = Column(Float)
    location_description = Column(String)

    # Foreign keys
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=False)
    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    assigned_team_id = Column(Integer, ForeignKey("teams.id"))

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    resolved_at = Column(DateTime(timezone=True))

    # Relationships
    organization = relationship("Organization", back_populates="incidents")
    creator = relationship("User", back_populates="created_incidents")
    assigned_team = relationship("Team", back_populates="assigned_incidents")
    updates = relationship("IncidentUpdate", back_populates="incident", 
                         cascade="all, delete-orphan")
    assigned_resources = relationship("ResourceAssignment", back_populates="incident")

class IncidentUpdate(Base):
    __tablename__ = "incident_updates"

    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(Integer, ForeignKey("incidents.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(String, nullable=False)
    update_type = Column(Enum('status_change', 'resource_update', 'general_update',
                            name='update_types'), default='general_update')
    update_metadata = Column(JSON)  # For storing additional update-specific data
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    incident = relationship("Incident", back_populates="updates")
    user = relationship("User", back_populates="incident_updates") 