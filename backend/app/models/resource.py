from sqlalchemy import Column, Integer, String, DateTime, Enum, ForeignKey, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base_class import Base

class Resource(Base):
    __tablename__ = "resources"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(Enum('equipment', 'vehicle', 'supply', 'personnel', 
                      name='resource_types'), nullable=False)
    status = Column(Enum('available', 'in_use', 'out_of_service', 'reserved',
                        name='resource_status'), default='available')
    
    # Location data
    latitude = Column(Float)
    longitude = Column(Float)
    location_description = Column(String)
    
    # Quantities and conditions
    quantity = Column(Integer, default=1)
    condition = Column(Enum('excellent', 'good', 'fair', 'poor', 
                          name='resource_condition'), default='good')
    
    # Foreign keys
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=False)
    team_id = Column(Integer, ForeignKey("teams.id"))

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    organization = relationship("Organization", back_populates="resources")
    team = relationship("Team", back_populates="resources")
    incident_assignments = relationship("ResourceAssignment", back_populates="resource")

class ResourceAssignment(Base):
    __tablename__ = "resource_assignments"

    id = Column(Integer, primary_key=True, index=True)
    resource_id = Column(Integer, ForeignKey("resources.id"), nullable=False)
    incident_id = Column(Integer, ForeignKey("incidents.id"), nullable=False)
    quantity = Column(Integer, default=1)
    assigned_at = Column(DateTime(timezone=True), server_default=func.now())
    returned_at = Column(DateTime(timezone=True))
    
    # Relationships
    resource = relationship("Resource", back_populates="incident_assignments")
    incident = relationship("Incident", back_populates="assigned_resources") 