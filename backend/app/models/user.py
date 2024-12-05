from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base_class import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Organization relationships
    organizations = relationship("OrganizationMembership", back_populates="user")
    created_organizations = relationship("Organization", back_populates="created_by")

    # Team relationships
    teams = relationship("TeamMembership", 
                        foreign_keys="[TeamMembership.user_id]", 
                        back_populates="user")
    teams_added = relationship("TeamMembership",
                             foreign_keys="[TeamMembership.added_by_id]",
                             back_populates="added_by")

    # Incident relationships
    created_incidents = relationship("Incident", back_populates="creator")
    incident_updates = relationship("IncidentUpdate", back_populates="user")