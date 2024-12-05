from fastapi import APIRouter
from .endpoints import users, auth, organizations, teams, incidents, resources

api_router = APIRouter()

api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(organizations.router, prefix="/organizations", tags=["organizations"])
api_router.include_router(teams.router, prefix="/teams", tags=["teams"])
api_router.include_router(incidents.router, prefix="/incidents", tags=["incidents"])
api_router.include_router(resources.router, prefix="/resources", tags=["resources"]) 